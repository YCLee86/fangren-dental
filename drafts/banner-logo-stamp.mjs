import fs from "node:fs";
const [,,illu,out,cxA,cyA,lwA,styleA] = process.argv;   // styleA: "flat"（純白）或 "ink"（手繪感，預設）
const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.js").then(m=>m.default??m);
const chrome="/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const b64=f=>fs.readFileSync(f).toString("base64");
const illuUri=`data:image/jpeg;base64,${b64(illu)}`;
const logoUri=`data:image/png;base64,${b64("/home/user/fangren-dental/assets/logo.png")}`;
const b=await chromium.launch({executablePath:fs.existsSync(chrome)?chrome:undefined});
const pg=await b.newPage();
const r=await pg.evaluate(async({illuUri,logoUri,cx,cy,lw,style})=>{
  const img=new Image(); img.src=illuUri; await img.decode();
  const logo=new Image(); logo.src=logoUri; await logo.decode();
  const W=img.naturalWidth,H=img.naturalHeight;
  const c=document.createElement("canvas"); c.width=W; c.height=H;
  const g=c.getContext("2d",{willReadFrequently:true}); g.drawImage(img,0,0);
  const ar=logo.naturalHeight/logo.naturalWidth;
  const lh=Math.round(lw*ar);
  const SS=4; // 超取樣，邊緣才不會鋸齒
  const t=document.createElement("canvas"); t.width=lw*SS; t.height=lh*SS;
  const tg=t.getContext("2d",{willReadFrequently:true});
  tg.imageSmoothingEnabled=true; tg.imageSmoothingQuality="high";
  tg.drawImage(logo,0,0,lw*SS,lh*SS);
  const td=tg.getImageData(0,0,lw*SS,lh*SS).data;
  const x0=Math.round(cx-lw/2), y0=Math.round(cy-lh/2);
  const dst=g.getImageData(x0,y0,lw,lh); const dd=dst.data;
  for(let y=0;y<lh;y++)for(let x=0;x<lw;x++){
    let a=0;
    for(let sy=0;sy<SS;sy++)for(let sx=0;sx<SS;sx++){
      a+=td[(((y*SS+sy)*lw*SS)+(x*SS+sx))*4+3];
    }
    a=a/(SS*SS)/255;
    if(a<=0)continue;
    /* ink：不要純白、不要平塗 —— 用暖白（紙色那一階）、整體降一點不透明度，
       再加一點依座標決定的顆粒，讓底下的綠透一點上來。純白那一版留著當對照。 */
    let R=255,G=255,B=255,k=1;
    if(style!=="flat"){
      const n=(Math.sin((x*12.9898+y*78.233))*43758.5453)%1;      // 固定種子的雜訊
      const j=(n-Math.floor(n))-0.5;                               // -0.5 ~ 0.5
      R=244; G=241; B=233;                                         // 暖白
      k=0.90+j*0.14;                                               // 顆粒
      if(a<0.9) k*=0.82;                                           // 邊緣再軟一階
    }
    const aa=Math.max(0,Math.min(1,a*k));
    const i=(y*lw+x)*4;
    dd[i]  =Math.round(dd[i]  *(1-aa)+R*aa);
    dd[i+1]=Math.round(dd[i+1]*(1-aa)+G*aa);
    dd[i+2]=Math.round(dd[i+2]*(1-aa)+B*aa);
  }
  g.putImageData(dst,x0,y0);
  return {data:c.toDataURL("image/png"),lw,lh,x0,y0};
},{illuUri,logoUri,cx:+cxA,cy:+cyA,lw:+lwA,style:styleA||"ink"});
await b.close();
fs.writeFileSync(out,Buffer.from(r.data.split(",")[1],"base64"));
console.log(`logo ${r.lw}x${r.lh} @ (${r.x0},${r.y0}) → ${out}`);
