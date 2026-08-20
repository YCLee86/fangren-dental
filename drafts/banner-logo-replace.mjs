import fs from "node:fs";
const [,,illu,out,x0A,y0A,x1A,y1A,lwA] = process.argv;   // 牌子的外框
const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.js").then(m=>m.default??m);
const chrome="/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const b64=f=>fs.readFileSync(f).toString("base64");
const illuUri=`data:image/jpeg;base64,${b64(illu)}`;
const logoUri=`data:image/png;base64,${b64("/home/user/fangren-dental/assets/logo.png")}`;
const b=await chromium.launch({executablePath:fs.existsSync(chrome)?chrome:undefined});
const pg=await b.newPage();
const r=await pg.evaluate(async({illuUri,logoUri,X0,Y0,X1,Y1,lw})=>{
  const img=new Image(); img.src=illuUri; await img.decode();
  const logo=new Image(); logo.src=logoUri; await logo.decode();
  const W=img.naturalWidth,H=img.naturalHeight;
  const c=document.createElement("canvas"); c.width=W; c.height=H;
  const g=c.getContext("2d",{willReadFrequently:true}); g.drawImage(img,0,0);

  // ① 從牌子的邊環取綠色的眾數（不是平均 —— CLAUDE.md 第九節第 11 條）
  const px=g.getImageData(0,0,W,H).data, key=[];
  const push=(x,y)=>{const i=(y*W+x)*4; key.push(((px[i]>>3)<<10)|((px[i+1]>>3)<<5)|(px[i+2]>>3));};
  for(let x=X0+2;x<=X1-2;x++){ push(x,Y0+2); push(x,Y0+3); push(x,Y1-2); push(x,Y1-3); }
  for(let y=Y0+2;y<=Y1-2;y++){ push(X0+2,y); push(X0+3,y); push(X1-2,y); push(X1-3,y); }
  const cnt={}; for(const k of key) cnt[k]=(cnt[k]||0)+1;
  const mode=+Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0][0];
  const gr=[( (mode>>10)&31)*8+4, ((mode>>5)&31)*8+4, (mode&31)*8+4];

  // ② 把牌子內部抹成那個綠（保留外框那 2px），帶一點顆粒免得變成死板的色塊
  const ix0=X0+2, iy0=Y0+2, ix1=X1-2, iy1=Y1-2;
  const inner=g.getImageData(ix0,iy0,ix1-ix0+1,iy1-iy0+1); const idd=inner.data;
  for(let y=0;y<=iy1-iy0;y++)for(let x=0;x<=ix1-ix0;x++){
    const n=(Math.sin(((x+ix0)*12.9898+(y+iy0)*78.233))*43758.5453)%1;
    const j=((n-Math.floor(n))-0.5)*10;
    const i=(y*(ix1-ix0+1)+x)*4;
    idd[i]=Math.max(0,Math.min(255,gr[0]+j)); idd[i+1]=Math.max(0,Math.min(255,gr[1]+j)); idd[i+2]=Math.max(0,Math.min(255,gr[2]+j));
  }
  g.putImageData(inner,ix0,iy0);

  // ③ 貼上原始向量的標誌（ink：暖白、降不透明度、加顆粒、邊緣再軟一階）
  const ar=logo.naturalHeight/logo.naturalWidth, lh=Math.round(lw*ar), SS=4;
  const t=document.createElement("canvas"); t.width=lw*SS; t.height=lh*SS;
  const tg=t.getContext("2d",{willReadFrequently:true});
  tg.imageSmoothingEnabled=true; tg.imageSmoothingQuality="high";
  tg.drawImage(logo,0,0,lw*SS,lh*SS);
  const td=tg.getImageData(0,0,lw*SS,lh*SS).data;
  const cx=(X0+X1)/2, cy=(Y0+Y1)/2;
  const px0=Math.round(cx-lw/2), py0=Math.round(cy-lh/2);
  const dst=g.getImageData(px0,py0,lw,lh), dd=dst.data;
  for(let y=0;y<lh;y++)for(let x=0;x<lw;x++){
    let a=0; for(let sy=0;sy<SS;sy++)for(let sx=0;sx<SS;sx++) a+=td[(((y*SS+sy)*lw*SS)+(x*SS+sx))*4+3];
    a=a/(SS*SS)/255; if(a<=0)continue;
    const n=(Math.sin(((x+px0)*12.9898+(y+py0)*78.233))*43758.5453)%1;
    const j=(n-Math.floor(n))-0.5;
    let k=0.90+j*0.14; if(a<0.9) k*=0.82;
    const aa=Math.max(0,Math.min(1,a*k)), i=(y*lw+x)*4;
    dd[i]=Math.round(dd[i]*(1-aa)+244*aa);
    dd[i+1]=Math.round(dd[i+1]*(1-aa)+241*aa);
    dd[i+2]=Math.round(dd[i+2]*(1-aa)+233*aa);
  }
  g.putImageData(dst,px0,py0);
  return {data:c.toDataURL("image/png"), green:gr, lw, lh, px0, py0};
},{illuUri,logoUri,X0:+x0A,Y0:+y0A,X1:+x1A,Y1:+y1A,lw:+lwA});
await b.close();
fs.writeFileSync(out,Buffer.from(r.data.split(",")[1],"base64"));
console.log(`牌子綠 rgb(${r.green}) ・標誌 ${r.lw}x${r.lh} @ (${r.px0},${r.py0})`);
