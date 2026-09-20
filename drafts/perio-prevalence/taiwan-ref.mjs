/* 台灣輪廓的參考圖（給出圖模型看形狀用，不是風格範本）。
   海岸取二十個控制點的經緯度，照 3:4.2 的實際比例投影（南北 394km、東西 144km）。
   ⚠ 這是簡化輪廓，不是精確海岸線 —— 用途只是「讓模型畫對這座島的比例與兩側的個性」：
   西岸平滑、東岸較直、北端偏方、南端收成尖。 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const PTS = [
  [121.54,25.30],[121.75,25.15],[122.00,25.01],[121.87,24.60],[121.62,24.00],
  [121.38,23.10],[121.15,22.75],[120.90,22.30],[120.86,21.92],[120.74,22.05],
  [120.62,22.35],[120.45,22.55],[120.27,22.70],[120.13,23.05],[120.18,23.55],
  [120.42,24.05],[120.68,24.50],[120.93,24.85],[121.08,25.03],[121.42,25.18],
];
const W=760,H=1180,PAD=40;
const lons=PTS.map(p=>p[0]), lats=PTS.map(p=>p[1]);
const [lo0,lo1]=[Math.min(...lons),Math.max(...lons)];
const [la0,la1]=[Math.min(...lats),Math.max(...lats)];
/* 經度要乘 cos(緯度) 才是真實的東西向距離 */
const k=Math.cos(23.6*Math.PI/180);
const sx=(W-2*PAD)/((lo1-lo0)*k), sy=(H-2*PAD)/(la1-la0);
const s=Math.min(sx,sy);
const X=lo=>PAD+(lo-lo0)*k*s, Y=la=>H-PAD-(la-la0)*s;

/* 圓潤一點的閉合曲線（Catmull-Rom → 三次貝茲） */
const d=(()=>{
  const p=PTS.map(([lo,la])=>[X(lo),Y(la)]);
  const n=p.length, out=[`M ${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`];
  for(let i=0;i<n;i++){
    const p0=p[(i-1+n)%n],p1=p[i],p2=p[(i+1)%n],p3=p[(i+2)%n];
    const c1=[p1[0]+(p2[0]-p0[0])/6, p1[1]+(p2[1]-p0[1])/6];
    const c2=[p2[0]-(p3[0]-p1[0])/6, p2[1]-(p3[1]-p1[1])/6];
    out.push(`C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`);
  }
  return out.join(" ")+" Z";
})();

const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="100%" height="100%" fill="#f4f4f5"/>
<path d="${d}" fill="#2a6d69" stroke="#2a6d69" stroke-width="3" stroke-linejoin="round"/>
</svg>`;
const page=path.join(process.argv[2],"tw.html");
fs.writeFileSync(page,`<!doctype html><meta charset="utf-8"><style>html,body{margin:0}svg{display:block}</style>${svg}`);
const chrome="/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
execFileSync(chrome,["--no-sandbox","--disable-gpu","--hide-scrollbars",
  `--window-size=${W},${H}`,`--user-data-dir=${path.join(process.argv[2],"prof-tw")}`,
  `--screenshot=${path.join(process.argv[2],"taiwan-ref.png")}`,`file://${page}`],{stdio:["ignore","ignore","pipe"]});
console.log("寬高比 %s:1（真實約 2.74:1）", ((H-2*PAD)/((lo1-lo0)*k*s)).toFixed(2));
