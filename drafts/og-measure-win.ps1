# 分享圖的交件門檻量測（Windows 版）
#
# 為什麼另外寫一支：drafts/og-measure.mjs 與 og-measure-ink.mjs 是雲端 session 寫的，
# 寫死了 /opt/node22/.../playwright 與 /opt/pw-browsers/... 的路徑，Windows 上跑不動。
# 這一支只用 .NET 的 System.Drawing，不需要任何相依套件。
#
#   powershell -NoProfile -ExecutionPolicy Bypass -File drafts/og-measure-win.ps1 <圖檔> [box名字=x0,y0,x1,y1 ...]
#
# 例：
#   ... og-measure-win.ps1 drafts/og-topic-perio-v1.jpg 醫師=0.10,0.20,0.34,0.96 牙齒=0.45,0.32,0.72,0.94
#
# 門檻（ILLUSTRATION.md 第十一之一節／TEAM.md 第一節第 9 號）：
#   無彩空白（S<12 且 L>80）< 5%　・　邊緣密度 >= 30%　・　各框最暗 5 百分位相差 < 20 階
# 這一站另外加一條（2026-08-23 量出來的，見 drafts/og-topic-perio-prompt.md）：
#   頂 17% 那條安靜區：平均 HSL L <= 50、p95 <= 60，否則玻璃帶上的紙色字撐不住（牙周的深階比較淺）。

param([Parameter(Mandatory=$true)][string]$Path, [Parameter(ValueFromRemainingArguments=$true)][string[]]$Boxes)
[Console]::OutputEncoding = [Text.Encoding]::UTF8

Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile((Resolve-Path $Path))
$W = $bmp.Width; $H = $bmp.Height
$rect = New-Object System.Drawing.Rectangle 0,0,$W,$H
$bd = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$stride = $bd.Stride; $bytes = New-Object byte[] ($stride*$H)
[System.Runtime.InteropServices.Marshal]::Copy($bd.Scan0, $bytes, 0, $bytes.Length)
$bmp.UnlockBits($bd); $bmp.Dispose()

$lum = New-Object 'double[]' ($W*$H)
$hslL = New-Object 'double[]' ($W*$H)
$pale = 0; $chroma = 0; $n = 0; $sL = 0.0
for ($y=0; $y -lt $H; $y++) {
  $row = $y*$stride
  for ($x=0; $x -lt $W; $x++) {
    $i = $row + $x*3
    $b = $bytes[$i]; $g = $bytes[$i+1]; $r = $bytes[$i+2]
    $k = $y*$W + $x
    $lum[$k] = 0.2126*$r + 0.7152*$g + 0.0722*$b
    $rr = $r/255.0; $gg = $g/255.0; $bb = $b/255.0
    $mx = [Math]::Max($rr,[Math]::Max($gg,$bb)); $mn = [Math]::Min($rr,[Math]::Min($gg,$bb))
    $l = ($mx+$mn)/2
    if ($mx -eq $mn) { $s = 0 } else { $s = ($mx-$mn)/(1-[Math]::Abs(2*$l-1)) }
    $s *= 100; $l *= 100; $hslL[$k] = $l
    if ($s -gt 25) { $chroma++ }
    if ($s -lt 12 -and $l -gt 80) { $pale++ }
    if ($l -ge 12 -and $l -le 96) { $n++; $sL += $l }
  }
}
$edges = 0; $tot = 0
for ($y=1; $y -lt $H-1; $y++) {
  for ($x=1; $x -lt $W-1; $x++) {
    $gx = [Math]::Abs($lum[$y*$W+$x+1] - $lum[$y*$W+$x-1])
    $gy = [Math]::Abs($lum[($y+1)*$W+$x] - $lum[($y-1)*$W+$x])
    $tot++; if (($gx+$gy) -gt 12) { $edges++ }
  }
}
$all = $W*$H
$blankPct = 100.0*$pale/$all; $edgePct = 100.0*$edges/$tot
"檔案　　　　{0}　{1}x{2}　比例 {3:N3}" -f (Split-Path $Path -Leaf), $W, $H, ($W/$H)
"無彩空白　　{0,5:N1}%　{1}（門檻 < 5%）" -f $blankPct, $(if($blankPct -lt 5){"OK"}else{"NG"})
"邊緣密度　　{0,5:N1}%　{1}（門檻 >= 30%）" -f $edgePct, $(if($edgePct -ge 30){"OK"}else{"NG"})
"彩色面積　　{0,5:N1}%　平均 L {1:N1}" -f (100.0*$chroma/$all), ($sL/$n)

# 頂 17% 的安靜區（玻璃帶壓在這裡）
# ⚠ 用第 95 百分位不用最大值 —— 天空裡一顆過曝的點就會把最大值頂到 100，那不是判準。
# 門檻是從已上線的 general 那張回推的（平均 39.7／p95 76.5 → 帶子最亮處實測 4.40）。
$by = [int]($H*0.17); $bvals = New-Object System.Collections.Generic.List[double]
for ($y=0; $y -lt $by; $y++) { for ($x=0; $x -lt $W; $x++) { $bvals.Add($hslL[$y*$W+$x]) } }
$barr = $bvals.ToArray(); [Array]::Sort($barr)
$bmean = ($barr | Measure-Object -Average).Average
$bp95 = $barr[[int]($barr.Length*0.95)]
"頂17%安靜區　平均 L {0,5:N1}　p95 L {1,5:N1}　{2}（牙周這一科：平均 <= 50、p95 <= 60）" -f $bmean, $bp95, $(if($bmean -le 50 -and $bp95 -le 60){"OK"}else{"NG"})

# 逐框的線有多實（最暗 5 百分位）
if ($Boxes) {
  $p5s = @()
  foreach ($spec in $Boxes) {
    $parts = $spec -split '='
    $name = $parts[0]; $c = $parts[1] -split ','
    $x0 = [int]([double]$c[0]*$W); $y0 = [int]([double]$c[1]*$H)
    $x1 = [int]([double]$c[2]*$W); $y1 = [int]([double]$c[3]*$H)
    $vals = New-Object System.Collections.Generic.List[double]
    for ($y=$y0; $y -lt $y1; $y++) { for ($x=$x0; $x -lt $x1; $x++) { $vals.Add($lum[$y*$W+$x]) } }
    $arr = $vals.ToArray(); [Array]::Sort($arr)
    $p5 = $arr[[int]($arr.Length*0.05)]; $p5s += $p5
    "框 {0,-10} 最暗5百分位 {1,6:N1}　中位 {2,6:N1}　高佔畫面 {3,5:N1}%" -f $name, $p5, $arr[[int]($arr.Length*0.5)], (100.0*($y1-$y0)/$H)
  }
  if ($p5s.Count -gt 1) {
    $spread = ($p5s | Measure-Object -Maximum).Maximum - ($p5s | Measure-Object -Minimum).Minimum
    "線的實度相差　{0,5:N1} 階　{1}（門檻 < 20）" -f $spread, $(if($spread -lt 20){"OK"}else{"NG"})
  }
}
