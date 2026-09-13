/* 8-bit、非交錯的 PNG 解碼（容器裡沒有 PIL、沒有 ImageMagick）。
 * post-google.mjs 與 check-post-google.mjs 共用一份 ——
 * 兩邊各抄一份的話，哪天改了門檻只會改到其中一邊。
 */
import zlib from "node:zlib";

export function decode(buf) {
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  const ch = { 0: 1, 2: 3, 4: 2, 6: 4 }[buf.readUInt8(25)];
  if (buf.readUInt8(24) !== 8 || !ch) throw new Error("只認得 8-bit 的 PNG");
  const parts = [];
  for (let off = 8; off + 8 <= buf.length;) {
    const len = buf.readUInt32BE(off);
    if (buf.toString("ascii", off + 4, off + 8) === "IDAT")
      parts.push(buf.subarray(off + 8, off + 8 + len));
    off += len + 12;
  }
  const raw = zlib.inflateSync(Buffer.concat(parts));
  const stride = w * ch, px = Buffer.alloc(h * stride);
  let o = 0;
  for (let y = 0; y < h; y++) {
    const f = raw[o++];
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? px[y * stride + x - ch] : 0;
      const b = y > 0 ? px[(y - 1) * stride + x] : 0;
      const c = x >= ch && y > 0 ? px[(y - 1) * stride + x - ch] : 0;
      let v = raw[o + x];
      if (f === 1) v += a; else if (f === 2) v += b;
      else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      px[y * stride + x] = v & 255;
    }
    o += stride;
  }
  return { w, h, ch, px };
}

export const at = (d, x, y) => {
  const i = (y * d.w + x) * d.ch;
  return [d.px[i], d.px[i + 1], d.px[i + 2]];
};

/* 內容的外框（墨在哪裡）。
 * ⚠⚠ 門檻要跨過浮水印：那一層只有 4~5% 的墨，壓在卡色上只差 8~10 階，
 *   門檻寫 12 以下的話浮水印會被當成內容，整張圖的外框就變成「整張」。
 *   內容的墨都在 30 階以上，所以 18 是安全的中間值。
 * @param {{x?:number,w?:number}} win 只看這一段欄（拿來單獨量補出來的邊條）
 */
export function inkBox(d, bg, win = {}) {
  const x0 = win.x ?? 0, x1 = win.x != null && win.w != null ? win.x + win.w : d.w;
  const far = (c) => Math.max(Math.abs(c[0] - bg[0]), Math.abs(c[1] - bg[1]), Math.abs(c[2] - bg[2])) > 18;
  let top = -1, bot = -1, lef = -1, rig = -1, n = 0;
  for (let y = 0; y < d.h; y++) {
    let row = 0;
    for (let x = x0; x < x1; x++) if (far(at(d, x, y))) {
      row++; if (lef < 0 || x < lef) lef = x; if (x > rig) rig = x;
    }
    if (row >= 3) { if (top < 0) top = y; bot = y; }
    n += row;
  }
  return { top, bot, left: lef, right: rig, n, padTop: top, padBot: d.h - 1 - bot };
}
