# palette-measure.ps1 - measure real colours out of the clinic's own photos.
# See PALETTE.md for what the numbers mean and how they are used.
#
#   powershell -ExecutionPolicy Bypass -File tools\palette-measure.ps1 -Manifest jobs.txt
#   powershell -ExecutionPolicy Bypass -File tools\palette-measure.ps1 -Grid -Paths a.jpg,b.jpg -OutDir .
#
# Manifest lines (file MUST be saved as UTF-8):
#   label|C:\path\photo.jpg|6
#   label|C:\path\photo.jpg|3|0.20,0.60,0.45,0.90
# Field 3 = number of dominant colours (k). Field 4 = crop x0,y0,x1,y1 as 0..1 fractions.
#
# NOTE: keep this file ASCII-only. Windows PowerShell 5.1 reads a BOM-less UTF-8
# script as ANSI, which turns non-ASCII literals into garbage and breaks parsing.

param(
  [string]$Manifest,
  [int]$MaxDim = 150,
  [switch]$Grid,
  [string[]]$Paths,
  [string]$OutDir = ".",
  [int]$GridWidth = 760
)

Add-Type -AssemblyName System.Drawing

# ---------------------------------------------------------------- grid mode --
# Writes a downscaled copy with 10% gridlines so crop fractions are easy to read off.
if ($Grid) {
  if (-not $Paths) { throw "-Grid needs -Paths" }
  foreach ($p in $Paths) {
    $img = [System.Drawing.Image]::FromFile($p)
    $h = [int]($img.Height * $GridWidth / $img.Width)
    $bmp = New-Object System.Drawing.Bitmap($GridWidth, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, $GridWidth, $h)
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(160, 255, 0, 0), 1)
    $font = New-Object System.Drawing.Font("Consolas", 9, [System.Drawing.FontStyle]::Bold)
    $bg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 0, 0, 0))
    for ($i = 1; $i -lt 10; $i++) {
      $x = [int]($GridWidth * $i / 10); $y = [int]($h * $i / 10)
      $g.DrawLine($pen, $x, 0, $x, $h)
      $g.DrawLine($pen, 0, $y, $GridWidth, $y)
      $g.FillRectangle($bg, $x + 1, 1, 22, 13)
      $g.DrawString(".$i", $font, [System.Drawing.Brushes]::Yellow, $x + 1, 0)
      $g.FillRectangle($bg, 1, $y + 1, 22, 13)
      $g.DrawString(".$i", $font, [System.Drawing.Brushes]::Yellow, 1, $y)
    }
    $g.Dispose()
    $out = Join-Path $OutDir ("grid-" + [System.IO.Path]::GetFileNameWithoutExtension($p) + ".png")
    $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose(); $img.Dispose()
    Write-Output $out
  }
  return
}

# ------------------------------------------------------------- measure mode --
$cs = @'
using System;
using System.Text;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;

public class Pal {
  public static string Analyze(string path, int k, double fx0, double fy0, double fx1, double fy1, int maxDim) {
    using (Bitmap src = new Bitmap(path)) {
      int cx = (int)(src.Width * fx0);
      int cy = (int)(src.Height * fy0);
      int cw = (int)(src.Width * (fx1 - fx0));
      int ch = (int)(src.Height * (fy1 - fy0));
      if (cw < 1) cw = 1; if (ch < 1) ch = 1;
      double scale = Math.Min(1.0, (double)maxDim / Math.Max(cw, ch));
      int dw = Math.Max(1, (int)(cw * scale));
      int dh = Math.Max(1, (int)(ch * scale));

      using (Bitmap dst = new Bitmap(dw, dh, PixelFormat.Format24bppRgb)) {
        using (Graphics g = Graphics.FromImage(dst)) {
          g.InterpolationMode = InterpolationMode.HighQualityBicubic;
          g.DrawImage(src, new Rectangle(0, 0, dw, dh), new Rectangle(cx, cy, cw, ch), GraphicsUnit.Pixel);
        }
        BitmapData bd = dst.LockBits(new Rectangle(0,0,dw,dh), ImageLockMode.ReadOnly, PixelFormat.Format24bppRgb);
        int n = dw * dh;
        double[] R = new double[n], G = new double[n], B = new double[n];
        byte[] buf = new byte[bd.Stride * dh];
        System.Runtime.InteropServices.Marshal.Copy(bd.Scan0, buf, 0, buf.Length);
        dst.UnlockBits(bd);
        int idx = 0;
        for (int y = 0; y < dh; y++) {
          int rowOff = y * bd.Stride;
          for (int x = 0; x < dw; x++) {
            int o = rowOff + x * 3;
            B[idx] = buf[o]; G[idx] = buf[o+1]; R[idx] = buf[o+2];
            idx++;
          }
        }

        // k-means++ with a fixed seed, so the same photo always gives the same numbers.
        Random rnd = new Random(12345);
        double[] cR = new double[k], cG = new double[k], cB = new double[k];
        int first = rnd.Next(n);
        cR[0]=R[first]; cG[0]=G[first]; cB[0]=B[first];
        double[] dist = new double[n];
        for (int i = 0; i < n; i++) dist[i] = double.MaxValue;
        for (int c = 1; c < k; c++) {
          double tot = 0;
          for (int i = 0; i < n; i++) {
            double dr = R[i]-cR[c-1], dg = G[i]-cG[c-1], db = B[i]-cB[c-1];
            double d = dr*dr + dg*dg + db*db;
            if (d < dist[i]) dist[i] = d;
            tot += dist[i];
          }
          double target = rnd.NextDouble() * tot, acc = 0; int pick = n-1;
          for (int i = 0; i < n; i++) { acc += dist[i]; if (acc >= target) { pick = i; break; } }
          cR[c]=R[pick]; cG[c]=G[pick]; cB[c]=B[pick];
        }

        int[] assign = new int[n];
        for (int iter = 0; iter < 24; iter++) {
          for (int i = 0; i < n; i++) {
            double best = double.MaxValue; int bi = 0;
            for (int c = 0; c < k; c++) {
              double dr = R[i]-cR[c], dg = G[i]-cG[c], db = B[i]-cB[c];
              double d = dr*dr + dg*dg + db*db;
              if (d < best) { best = d; bi = c; }
            }
            assign[i] = bi;
          }
          double[] sR = new double[k], sG = new double[k], sB = new double[k];
          int[] cnt = new int[k];
          for (int i = 0; i < n; i++) { int a = assign[i]; sR[a]+=R[i]; sG[a]+=G[i]; sB[a]+=B[i]; cnt[a]++; }
          for (int c = 0; c < k; c++) if (cnt[c] > 0) { cR[c]=sR[c]/cnt[c]; cG[c]=sG[c]/cnt[c]; cB[c]=sB[c]/cnt[c]; }
        }

        int[] counts = new int[k];
        for (int i = 0; i < n; i++) counts[assign[i]]++;
        int[] order = new int[k];
        for (int i = 0; i < k; i++) order[i] = i;
        Array.Sort((int[])counts.Clone(), order);
        StringBuilder sb = new StringBuilder();
        for (int oi = k - 1; oi >= 0; oi--) {
          int c = order[oi];
          int r = (int)Math.Round(cR[c]), gg = (int)Math.Round(cG[c]), b = (int)Math.Round(cB[c]);
          double share = 100.0 * counts[c] / n;
          double mx = Math.Max(r, Math.Max(gg, b)) / 255.0;
          double mn = Math.Min(r, Math.Min(gg, b)) / 255.0;
          double l = (mx + mn) / 2.0;
          double s = (mx == mn) ? 0 : (l > 0.5 ? (mx-mn)/(2.0-mx-mn) : (mx-mn)/(mx+mn));
          double hue = 0;
          if (mx != mn) {
            double d2 = mx - mn;
            double rr = r/255.0, gr = gg/255.0, br = b/255.0;
            if (mx == rr) hue = ((gr-br)/d2 + (gr < br ? 6 : 0));
            else if (mx == gr) hue = ((br-rr)/d2 + 2);
            else hue = ((rr-gr)/d2 + 4);
            hue *= 60;
          }
          sb.AppendFormat("  #{0:x2}{1:x2}{2:x2}  {3,5:F1}%  S={4,4:F1}%  L={5,4:F1}%  H={6,5:F0}  R-B={7,4}\n",
            r, gg, b, share, s*100, l*100, hue, r - b);
        }
        return sb.ToString();
      }
    }
  }
}
'@

if (-not ("Pal" -as [type])) {
  Add-Type -TypeDefinition $cs -ReferencedAssemblies System.Drawing
}

if (-not $Manifest) { throw "need -Manifest <file>  (or -Grid -Paths ...)" }

foreach ($line in (Get-Content -LiteralPath $Manifest -Encoding UTF8)) {
  if ($line -match '^\s*$' -or $line -match '^\s*#') { continue }
  $p = $line -split '\|'
  $label = $p[0].Trim()
  $path  = $p[1].Trim()
  $k     = if ($p.Count -gt 2 -and $p[2].Trim()) { [int]$p[2].Trim() } else { 6 }
  $crop  = if ($p.Count -gt 3 -and $p[3].Trim()) { $p[3].Trim() } else { "0,0,1,1" }
  $c = $crop -split ','
  if (-not (Test-Path -LiteralPath $path)) { Write-Output "== $label : MISSING $path"; continue }
  Write-Output "== $label"
  Write-Output ([Pal]::Analyze($path, $k, [double]$c[0], [double]$c[1], [double]$c[2], [double]$c[3], $MaxDim))
}
