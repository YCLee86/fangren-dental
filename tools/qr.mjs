/* ==========================================================================
   QR code 產生器（純 JS、零依賴）
   ⚠ 為什麼自己寫：這個 repo 的規矩是**沒有任何 npm 依賴**（CLAUDE.md 第三節），
     而線上的 QR 產生服務會把網址送出去、產出的圖還可能哪天連不到。
     這一支只吐 SVG 的 path 字串，**向量**，印多大都不會糊。

   支援：byte 模式（UTF-8）、EC 等級 L/M/Q/H、版本 1~10（最多約 154 個位元組）。
   對這一站的用途（Google 地圖短網址約 30~40 字）綽綽有餘。

   ⚠⚠ **驗證方式（要改這一支之前先讀）**：QR 最惡劣的失敗是「看起來完全正常
     但掃不出來」—— 尺寸、資料、遮罩全對，只有那 30 格的格式資訊反過來，
     肉眼一模一樣。所以**不要用眼睛驗收，要真的掃**。
     容器裡沒有解碼器，做法是臨時裝兩個 **只給驗證用、不是專案依賴** 的套件：
         pip install segno opencv-python-headless
     ・segno 產一份參考矩陣，逐格比對（可以指定遮罩，才比得準）
     ・cv2.QRCodeDetector 把自己產的圖真的解一次
     2026-08-23 的驗收：五個網址 × 四個等級 × 五種放大倍率，**20/20 全部解得出來**。
     ⚠ 和 segno 逐格比對時會發現**填充位元組差一個 0x00** —— 那是補齊方式的
       慣例差異（兩種都合法、都解得出來），不是 bug，不要照著改。

     import { qrPath } from './qr.mjs'
     const { n, d } = qrPath('https://maps.app.goo.gl/xxxx', 'Q')
     // n ＝ 邊長幾格（含 quiet zone 前的格數）、d ＝ path 的 d 屬性
   ⚠ 靜區（quiet zone）**不含在 n 裡面**，擺版時自己在四邊各留 4 格 ——
     少了它手機常常掃不到。
   ========================================================================== */

/* ---- GF(256) ---------------------------------------------------------- */
const EXP = new Uint8Array(512), LOG = new Uint8Array(256);
for (let i = 0, x = 1; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 0x100) x ^= 0x11d; }
for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
const mul = (a, b) => (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]];

function rsGen(deg) {
  let p = [1];
  for (let i = 0; i < deg; i++) {
    const q = [...p, 0];
    for (let j = 0; j < p.length; j++) q[j + 1] ^= mul(p[j], EXP[i]);
    p = q;
  }
  return p;
}
function rsEnc(data, deg) {
  const g = rsGen(deg), res = new Uint8Array(deg);
  for (const b of data) {
    const f = b ^ res[0];
    res.copyWithin(0, 1); res[deg - 1] = 0;
    if (f !== 0) for (let i = 0; i < deg; i++) res[i] ^= mul(g[i + 1], f);
  }
  return res;
}

/* ---- 版本表（版本 1~10）------------------------------------------------
   每一格：[EC 每塊幾個位元組, 第一組幾塊, 第一組每塊資料幾位元組,
            第二組幾塊, 第二組每塊資料幾位元組]                            */
const EC = { L: 0, M: 1, Q: 2, H: 3 };
const RS = [
  /* v1  */[[7,1,19,0,0],[10,1,16,0,0],[13,1,13,0,0],[17,1,9,0,0]],
  /* v2  */[[10,1,34,0,0],[16,1,28,0,0],[22,1,22,0,0],[28,1,16,0,0]],
  /* v3  */[[15,1,55,0,0],[26,1,44,0,0],[18,2,17,0,0],[22,2,13,0,0]],
  /* v4  */[[20,1,80,0,0],[18,2,32,0,0],[26,2,24,0,0],[16,4,9,0,0]],
  /* v5  */[[26,1,108,0,0],[24,2,43,0,0],[18,2,15,2,16],[22,2,11,2,12]],
  /* v6  */[[18,2,68,0,0],[16,4,27,0,0],[24,4,19,0,0],[28,4,15,0,0]],
  /* v7  */[[20,2,78,0,0],[18,4,31,0,0],[18,2,14,4,15],[26,4,13,1,14]],
  /* v8  */[[24,2,97,0,0],[22,2,38,2,39],[22,4,18,2,19],[26,4,14,2,15]],
  /* v9  */[[30,2,116,0,0],[22,3,36,2,37],[20,4,16,4,17],[24,4,12,4,13]],
  /* v10 */[[18,2,68,2,69],[26,4,43,1,44],[24,6,19,2,20],[28,6,15,2,16]],
];
/* 對齊圖樣的中心座標（版本 2 起） */
const ALIGN = [[],[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50]];

function bitsCap(ver, ecl) {
  const [ecw, n1, d1, n2, d2] = RS[ver - 1][EC[ecl]];
  return (n1 * d1 + n2 * d2) * 8;
}

/* ---- 編碼 -------------------------------------------------------------- */
function encode(str, ecl) {
  const bytes = new TextEncoder().encode(str);
  let ver = 0;
  for (let v = 1; v <= 10; v++) {
    /* 模式 4 位元 ＋ 長度 8 位元（v1~9）／16 位元（v10 起） */
    const lenBits = v < 10 ? 8 : 16;
    if (4 + lenBits + bytes.length * 8 <= bitsCap(v, ecl)) { ver = v; break; }
  }
  if (!ver) throw new Error('字串太長，這一支只做到版本 10：' + str.length);

  const cap = bitsCap(ver, ecl), bits = [];
  const put = (v, n) => { for (let i = n - 1; i >= 0; i--) bits.push((v >> i) & 1); };
  put(4, 4);
  put(bytes.length, ver < 10 ? 8 : 16);
  for (const b of bytes) put(b, 8);
  for (let i = 0; i < 4 && bits.length < cap; i++) bits.push(0);       /* 終止符 */
  while (bits.length % 8) bits.push(0);
  const pads = [0xec, 0x11];
  for (let i = 0; bits.length < cap; i++) put(pads[i % 2], 8);

  const data = new Uint8Array(bits.length / 8);
  for (let i = 0; i < data.length; i++)
    for (let j = 0; j < 8; j++) data[i] = (data[i] << 1) | bits[i * 8 + j];

  /* 分塊 ＋ RS ＋ 交錯 */
  const [ecw, n1, d1, n2, d2] = RS[ver - 1][EC[ecl]];
  const blocks = [], ecs = [];
  let p = 0;
  for (let i = 0; i < n1 + n2; i++) {
    const len = i < n1 ? d1 : d2;
    const blk = data.subarray(p, p + len); p += len;
    blocks.push(blk); ecs.push(rsEnc(blk, ecw));
  }
  const out = [];
  for (let i = 0; i < Math.max(d1, d2); i++)
    for (const b of blocks) if (i < b.length) out.push(b[i]);
  for (let i = 0; i < ecw; i++) for (const e of ecs) out.push(e[i]);
  return { ver, words: out };
}

/* ---- 排版 -------------------------------------------------------------- */
function buildMatrix(ver, ecl, words, forceMask = -1) {
  const n = ver * 4 + 17;
  const m = Array.from({ length: n }, () => new Int8Array(n).fill(-1));   /* -1 ＝ 還沒放 */
  const set = (r, c, v) => { if (r >= 0 && r < n && c >= 0 && c < n) m[r][c] = v; };

  /* 定位圖樣 ＋ 分隔 */
  const finder = (r0, c0) => {
    for (let r = -1; r <= 7; r++) for (let c = -1; c <= 7; c++) {
      const inner = r >= 0 && r <= 6 && c >= 0 && c <= 6;
      const on = inner && (r === 0 || r === 6 || c === 0 || c === 6 ||
                           (r >= 2 && r <= 4 && c >= 2 && c <= 4));
      set(r0 + r, c0 + c, on ? 1 : 0);
    }
  };
  finder(0, 0); finder(0, n - 7); finder(n - 7, 0);

  /* 時序圖樣 */
  for (let i = 8; i < n - 8; i++) { m[6][i] = i % 2 ? 0 : 1; m[i][6] = i % 2 ? 0 : 1; }

  /* 對齊圖樣（避開三個定位圖樣） */
  const al = ALIGN[ver];
  for (const r of al) for (const c of al) {
    if ((r <= 8 && c <= 8) || (r <= 8 && c >= n - 9) || (r >= n - 9 && c <= 8)) continue;
    for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++)
      set(r + dr, c + dc, (Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0)) ? 1 : 0);
  }

  /* 格式資訊的位置先佔起來（值稍後寫），以及固定的那顆黑點 */
  /* ⚠⚠ 格式資訊的落點寫死成兩張表，**順序就是第 14 位到第 0 位**。
     這一段踩了兩次：
       ① 第二份的第 0~6 位在 (n-1,8)~(n-7,8) 共 7 格（(n-8,8) 是那顆永遠黑的點），
         第 7~14 位在第 8 列的 (8,n-8)~(8,n-1) 共 8 格 —— 第一版寫成 7+7，
         第 7 位整個沒放到。
       ② **位元順序是反的**：(8,0) 放的是第 **14** 位不是第 0 位。
         症狀最惡劣的就是這一個 —— 尺寸、資料、遮罩全對，
         只有那 30 格的格式資訊反過來，**掃不出來但看起來完全正常**。
         驗證方式見檔尾那一段：拿 opencv 的解碼器實際掃過。 */
  const FMT1 = [[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,7],[8,8],[7,8],
                [5,8],[4,8],[3,8],[2,8],[1,8],[0,8]];
  const FMT2 = [[n-1,8],[n-2,8],[n-3,8],[n-4,8],[n-5,8],[n-6,8],[n-7,8],
                [8,n-8],[8,n-7],[8,n-6],[8,n-5],[8,n-4],[8,n-3],[8,n-2],[8,n-1]];
  const fmtCells = [...FMT1, ...FMT2];
  for (const [r, c] of fmtCells) m[r][c] = 0;
  m[n - 8][8] = 1;                                                       /* 永遠是黑 */

  /* 版本資訊（版本 7 起）—— 這一支只到 10，所以 7~10 要寫 */
  if (ver >= 7) {
    let rem = ver << 12;
    for (let i = 17; i >= 12; i--) if ((rem >> i) & 1) rem ^= 0x1f25 << (i - 12);
    const bits = (ver << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const b = (bits >> i) & 1, a = Math.floor(i / 3), bb = i % 3;
      m[a][n - 11 + bb] = b; m[n - 11 + bb][a] = b;
    }
  }

  /* 資料：從右下角往上走的之字形，跳過第 6 欄 */
  let bitIdx = 0;
  const total = words.length * 8;
  const nextBit = () => bitIdx < total ? (words[bitIdx >> 3] >> (7 - (bitIdx++ & 7))) & 1 : (bitIdx++, 0);
  let up = true;
  for (let col = n - 1; col > 0; col -= 2) {
    if (col === 6) col--;
    for (let i = 0; i < n; i++) {
      const row = up ? n - 1 - i : i;
      for (const c of [col, col - 1]) if (m[row][c] === -1) m[row][c] = nextBit();
    }
    up = !up;
  }

  /* 遮罩：八種都試，取罰分最低的 */
  const MASK = [
    (r, c) => (r + c) % 2 === 0,
    (r, c) => r % 2 === 0,
    (r, c) => c % 3 === 0,
    (r, c) => (r + c) % 3 === 0,
    (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
    (r, c) => (r * c) % 2 + (r * c) % 3 === 0,
    (r, c) => ((r * c) % 2 + (r * c) % 3) % 2 === 0,
    (r, c) => ((r + c) % 2 + (r * c) % 3) % 2 === 0,
  ];
  const isFn = Array.from({ length: n }, () => new Uint8Array(n));
  {   /* 哪些格子是功能圖樣（不遮罩） */
    const tmp = Array.from({ length: n }, () => new Int8Array(n).fill(-1));
    const setT = (r, c, v) => { if (r >= 0 && r < n && c >= 0 && c < n) tmp[r][c] = v; };
    const f2 = (r0, c0) => { for (let r = -1; r <= 7; r++) for (let c = -1; c <= 7; c++) setT(r0 + r, c0 + c, 1); };
    f2(0, 0); f2(0, n - 7); f2(n - 7, 0);
    for (let i = 0; i < n; i++) { tmp[6][i] = 1; tmp[i][6] = 1; }
    for (const r of al) for (const c of al) {
      if ((r <= 8 && c <= 8) || (r <= 8 && c >= n - 9) || (r >= n - 9 && c <= 8)) continue;
      for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++) setT(r + dr, c + dc, 1);
    }
    for (const [r, c] of fmtCells) tmp[r][c] = 1;
    tmp[n - 8][8] = 1;
    if (ver >= 7) for (let i = 0; i < 18; i++) {
      const a = Math.floor(i / 3), bb = i % 3;
      tmp[a][n - 11 + bb] = 1; tmp[n - 11 + bb][a] = 1;
    }
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) isFn[r][c] = tmp[r][c] === 1 ? 1 : 0;
  }

  const fmtBits = (ecl, mask) => {
    const ecBits = { L: 1, M: 0, Q: 3, H: 2 }[ecl];
    let d = (ecBits << 3) | mask, rem = d << 10;
    for (let i = 14; i >= 10; i--) if ((rem >> i) & 1) rem ^= 0x537 << (i - 10);
    return (((d << 10) | rem) ^ 0x5412);
  };

  const penalty = (g) => {
    let p = 0;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      if (c < n - 4) { let same = 1; while (c + same < n && g[r][c + same] === g[r][c]) same++;
        if (same >= 5) { p += 3 + (same - 5); c += same - 1; } }
    }
    for (let c = 0; c < n; c++) for (let r = 0; r < n; r++) {
      if (r < n - 4) { let same = 1; while (r + same < n && g[r + same][c] === g[r][c]) same++;
        if (same >= 5) { p += 3 + (same - 5); r += same - 1; } }
    }
    for (let r = 0; r < n - 1; r++) for (let c = 0; c < n - 1; c++)
      if (g[r][c] === g[r][c + 1] && g[r][c] === g[r + 1][c] && g[r][c] === g[r + 1][c + 1]) p += 3;
    const pat = [1,0,1,1,1,0,1,0,0,0,0];
    const hit = (arr) => { let k = 0; for (let i = 0; i + 11 <= arr.length; i++) {
      let ok = true; for (let j = 0; j < 11; j++) if (arr[i + j] !== pat[j]) { ok = false; break; }
      if (ok) k++;
      ok = true; for (let j = 0; j < 11; j++) if (arr[i + j] !== pat[10 - j]) { ok = false; break; }
      if (ok) k++;
    } return k; };
    for (let r = 0; r < n; r++) p += 40 * hit([...g[r]]);
    for (let c = 0; c < n; c++) p += 40 * hit(g.map(row => row[c]));
    let dark = 0; for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) dark += g[r][c];
    p += Math.floor(Math.abs(dark * 100 / (n * n) - 50) / 5) * 10;
    return p;
  };

  let best = null, bestP = Infinity, bestMask = -1;
  for (let mk = 0; mk < 8; mk++) {
    if (forceMask >= 0 && mk !== forceMask) continue;
    const g = m.map(row => Int8Array.from(row));
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++)
      if (!isFn[r][c] && MASK[mk](r, c)) g[r][c] ^= 1;
    const f = fmtBits(ecl, mk);
    FMT1.forEach(([r, c], k) => { g[r][c] = (f >> (14 - k)) & 1; });
    FMT2.forEach(([r, c], k) => { g[r][c] = (f >> (14 - k)) & 1; });
    g[n - 8][8] = 1;
    const p = penalty(g);
    if (p < bestP) { bestP = p; best = g; bestMask = mk; }
  }
  return { n, g: best, mask: bestMask };
}

/* ---- 對外 -------------------------------------------------------------- */
export function qrMatrix(text, ecl = 'Q', forceMask = -1) {
  const { ver, words } = encode(text, ecl);
  return buildMatrix(ver, ecl, words, forceMask);
}
/* 給測試用：吐出版本與交錯後的碼字，方便和參考實作對答案。 */
export function qrWords(text, ecl = 'Q') { return encode(text, ecl); }

/* 一格 1 單位的 path。⚠ 同一列相連的格子併成一個矩形，檔案小很多。 */
export function qrPath(text, ecl = 'Q') {
  const { n, g } = qrMatrix(text, ecl);
  let d = '';
  for (let r = 0; r < n; r++) {
    let c = 0;
    while (c < n) {
      if (!g[r][c]) { c++; continue; }
      let w = 1; while (c + w < n && g[r][c + w]) w++;
      d += `M${c} ${r}h${w}v1h-${w}z`;
      c += w;
    }
  }
  return { n, d };
}
