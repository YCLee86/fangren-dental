import fs from "node:fs";
const {chromium}=await import("/opt/node22/lib/node_modules/playwright/index.js").then(m=>m.default??m);
const pw="/opt/pw-browsers";
const chrome=fs.readdirSync(pw).map(d=>`${pw}/${d}/chrome-linux/headless_shell`).find(p=>fs.existsSync(p));
const b=await chromium.launch({executablePath:chrome});
const pg=await b.newPage();
const F=new URL("./ref-15-people-avatar-lime.webp", import.meta.url).pathname;
const uri=`data:image/webp;base64,${fs.readFileSync(F).toString("base64")}`;
/* 視窗是在 2.5 倍放大圖上目視定出來的，換算回原尺寸 450x337 */
const WINS=[
  ["驚嘆號 !",        [ 95,  50, 140, 110]],
  ["三條短斜線",      [875,  70, 965, 130]],
  ["螺旋＋圈",        [270, 460, 325, 515]],
  ["四角星",          [615, 450, 670, 505]],
  ["三個漸大的圓",    [740, 445, 805, 500]],
  ["頭①（髮頂到下巴）",[110, 100, 225, 265]],
  ["頭⑤（髮頂到下巴）",[955, 125, 1065, 275]],
];
const out=await pg.evaluate(async ({uri,WINS})=>{
  const img=new Image(); img.src=uri; await img.decode();
  const S=2.5;
  const W=Math.round(img.naturalWidth*S), H=Math.round(img.naturalHeight*S);
  const c=document.createElement("canvas"); c.width=W; c.height=H;
  const g=c.getContext("2d"); g.imageSmoothingEnabled=true; g.imageSmoothingQuality="high";
  g.drawImage(img,0,0,W,H);
  const d=g.getImageData(0,0,W,H).data;
  const lum=(i)=>0.2126*d[i]+0.7152*d[i+1]+0.0722*d[i+2];
  const res=[];
  for(const [name,[x0,y0,x1,y1]] of WINS){
    let minx=1e9,miny=1e9,maxx=-1,maxy=-1,n=0;
    for(let y=y0;y<y1;y++) for(let x=x0;x<x1;x++){
      const i=(y*W+x)*4;
      if(lum(i)<140){n++; if(x<minx)minx=x; if(x>maxx)maxx=x; if(y<miny)miny=y; if(y>maxy)maxy=y;}
    }
    res.push({name,n,w:maxx-minx+1,h:maxy-miny+1,box:[minx,miny,maxx,maxy]});
  }
  return {W,H,res};
},{uri,WINS});
console.log(`放大圖 ${out.W}×${out.H}（原檔 450×337 的 2.5 倍）\n`);
const head1=out.res.find(r=>r.name.startsWith("頭①")).h;
const head5=out.res.find(r=>r.name.startsWith("頭⑤")).h;
for(const r of out.res){
  const ref = r.name.startsWith("頭") ? null : (r.name==="三條短斜線"?head5:head1);
  const pct = ref ? `　＝ 頭高的 ${(r.h/ref*100).toFixed(0)}%` : "";
  console.log(`${r.name.padEnd(12,"　")} ${String(r.w).padStart(3)}×${String(r.h).padStart(3)} px　深色像素 ${String(r.n).padStart(4)}${pct}`);
}
console.log(`\n頭高：① ${head1}px　⑤ ${head5}px`);
await b.close();
