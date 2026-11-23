/* Shared drawing kit for every episode. 1080x1920 canvas, Arabic (RTL) text via Cairo.
   Episode scene.js files call these helpers. Times passed to scenes are DESIGN times (see script.json 'at'). */
const W=1080,H=1920,FPS=30,DUR=30;
const C=document.getElementById('c'),X=C.getContext('2d');
const G='#FFB020',D='#22C3A6',WH='#F4F7FB',MU='#9FB0C8',RED='#FF4D4D',FL='#FF6A1F',SP='#FFE45C';
const AR=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const cl=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const seg=(t,a,b)=>cl((t-a)/(b-a));
const eo=x=>1-Math.pow(1-x,3);
const eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const back=x=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)};
const lerp=(a,b,x)=>a+(b-a)*x;
function rnd(i){const s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s)}

/* captions are filled by the renderer from timeline.json */
const CAPS=[];window.CAPS=CAPS;

/* ---------- primitives ---------- */
function rr(x,y,w,h,r){X.beginPath();X.roundRect(x,y,w,h,r)}
function txt(s,x,y,size,col,wt=900,align='center',alpha=1){
  X.save();X.globalAlpha*=alpha;X.font=`${wt} ${size}px Cairo`;X.direction='rtl';X.textAlign=align;X.textBaseline='middle';
  X.fillStyle=col;X.fillText(s,x,y);X.restore();
}
function stroked(s,x,y,size,col,align='center',alpha=1,sw=10){
  X.save();X.globalAlpha*=alpha;X.font=`900 ${size}px Cairo`;X.direction='rtl';X.textAlign=align;X.textBaseline='middle';
  X.lineJoin='round';X.lineWidth=sw;X.strokeStyle='rgba(4,8,18,.92)';X.strokeText(s,x,y);X.fillStyle=col;X.fillText(s,x,y);X.restore();
}
function glow(x,y,r,col,a){const g=X.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');X.save();X.globalAlpha*=a;X.fillStyle=g;X.fillRect(x-r,y-r,2*r,2*r);X.restore()}
function drop(x,y,s,col){ // fuel droplet
  X.save();X.translate(x,y);X.scale(s,s);X.beginPath();X.moveTo(0,-70);
  X.bezierCurveTo(30,-30,52,0,52,22);X.arc(0,22,52,0,Math.PI);X.bezierCurveTo(-52,0,-30,-30,0,-70);X.closePath();
  X.fillStyle=col;X.fill();X.beginPath();X.ellipse(-18,18,10,18,-.4,0,7);X.fillStyle='rgba(255,255,255,.45)';X.fill();X.restore();
}
function barrel(x,y,s,rot=0){
  X.save();X.translate(x,y);X.rotate(rot);X.scale(s,s);
  const gr=X.createLinearGradient(-130,0,130,0);gr.addColorStop(0,'#1d2a44');gr.addColorStop(.45,'#3a557f');gr.addColorStop(1,'#16203a');
  rr(-130,-170,260,340,40);X.fillStyle=gr;X.fill();
  X.fillStyle='#0d1528';[-95,95].forEach(v=>{rr(-136,v-12,272,24,12);X.fill()});
  X.beginPath();X.ellipse(0,-170,124,22,0,0,7);X.fillStyle='#2c4166';X.fill();
  drop(0,10,.95,'#0b0b0b');X.restore();
}
function chip(label,col,a){
  if(a<=0)return;X.save();X.globalAlpha=a;X.font='800 40px Cairo';const w=X.measureText(label).width+80;
  rr(540-w/2,300,w,78,39);X.fillStyle='rgba(255,255,255,.08)';X.fill();X.lineWidth=3;X.strokeStyle=col;X.stroke();
  X.restore();txt(label,540,342,40,col,800,'center',a);
}
function arrow(x1,y1,x2,y2,col,w=10,a=1){
  X.save();X.globalAlpha*=a;X.strokeStyle=col;X.fillStyle=col;X.lineWidth=w;X.lineCap='round';
  X.beginPath();X.moveTo(x1,y1);X.lineTo(x2,y2);X.stroke();const an=Math.atan2(y2-y1,x2-x1);
  X.beginPath();X.moveTo(x2+Math.cos(an)*8,y2+Math.sin(an)*8);X.lineTo(x2-Math.cos(an-.5)*34,y2-Math.sin(an-.5)*34);X.lineTo(x2-Math.cos(an+.5)*34,y2-Math.sin(an+.5)*34);X.closePath();X.fill();X.restore();
}
function bolt(x,y,s,col,a=1){X.save();X.globalAlpha*=a;X.translate(x,y);X.scale(s,s);X.beginPath();
  X.moveTo(10,-60);X.lineTo(-28,6);X.lineTo(-2,6);X.lineTo(-12,60);X.lineTo(30,-10);X.lineTo(4,-10);X.closePath();X.fillStyle=col;X.fill();X.restore()}
function flames(cx,cy,w,t,a=1){
  for(let i=0;i<7;i++){const fx=cx-w/2+w*(i+.5)/7,h=70+28*Math.sin(t*14+i*1.7)+18*Math.sin(t*23+i);
    X.save();X.globalAlpha*=a;const g=X.createLinearGradient(0,cy,0,cy-h);g.addColorStop(0,FL);g.addColorStop(.6,'#FFB020');g.addColorStop(1,'rgba(255,228,92,0)');
    X.fillStyle=g;X.beginPath();X.moveTo(fx-26,cy);X.quadraticCurveTo(fx-20,cy-h*.6,fx+4*Math.sin(t*9+i),cy-h);X.quadraticCurveTo(fx+20,cy-h*.6,fx+26,cy);X.closePath();X.fill();X.restore()}
}
function burst(x,y,r,a){if(a<=0)return;glow(x,y,r*1.6,'rgba(255,170,40,.9)',a);
  X.save();X.globalAlpha*=a;X.fillStyle=FL;X.beginPath();for(let i=0;i<20;i++){const an=i/20*Math.PI*2,rr2=i%2?r*.55:r;X.lineTo(x+Math.cos(an)*rr2,y+Math.sin(an)*rr2)}X.closePath();X.fill();
  X.fillStyle=SP;X.beginPath();X.arc(x,y,r*.38,0,7);X.fill();X.restore()}

/* ---------- background ---------- */
function bg(t){
  const g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0A1224');g.addColorStop(1,'#13264A');X.fillStyle=g;X.fillRect(0,0,W,H);
  X.save();X.strokeStyle='rgba(255,255,255,.035)';X.lineWidth=2;for(let x=0;x<=W;x+=90){X.beginPath();X.moveTo(x,0);X.lineTo(x,H);X.stroke()}
  for(let y=0;y<=H;y+=90){X.beginPath();X.moveTo(0,y);X.lineTo(W,y);X.stroke()}X.restore();
  for(let i=0;i<40;i++){const x=rnd(i)*W,y=(rnd(i+99)*H-t*(20+rnd(i+7)*40))%H;X.fillStyle=`rgba(160,200,255,${.08+rnd(i+3)*.12})`;X.beginPath();X.arc(x,y<0?y+H:y,2+rnd(i+5)*3,0,7);X.fill()}
}

/* ---------- captions ---------- */
function wordCol(w){if(w.includes('بنزين'))return G;if(w.includes('ديزل'))return D;if(w.includes('شرارة')||w.includes('البوجي'))return SP;if(w.includes('٤٠٠')||w.includes('حرار')||w.includes('يسخن'))return FL;return WH}
function captions(t){
  const c=CAPS.find(c=>t>=c[0]&&t<c[1]);if(!c)return;
  const p=seg(t,c[0],c[0]+.18),out=seg(t,c[1]-.12,c[1]);const a=Math.min(p,1-out);
  let size=70;const words=c[2].split(' ');X.font=`900 ${size}px Cairo`;
  const sp=()=>X.measureText(' ').width;let tw=()=>words.reduce((s,w)=>s+X.measureText(w).width,0)+sp()*(words.length-1);
  while(tw()>860&&size>44){size-=2;X.font=`900 ${size}px Cairo`}
  const total=tw(),cx=520,cy=1430,sc=lerp(.86,1,back(p));
  X.save();X.translate(cx,cy);X.scale(sc,sc);X.globalAlpha=a;
  rr(-total/2-36,-size*.95,total+72,size*1.9,28);X.fillStyle='rgba(5,10,22,.62)';X.fill();
  let x=total/2; // RTL: first word on the right
  X.font=`900 ${size}px Cairo`;
  for(const w of words){const ww=X.measureText(w).width;stroked(w,x,4,size,wordCol(w),'right',1,9);x-=ww+sp()}
  X.restore();
}


function sceneAlpha(t,a,b){return Math.min(seg(t,a,a+.3),1-seg(t,b-.25,b))}
window.ready=Promise.all([600,800,900].map(w=>document.fonts.load(`${w} 40px Cairo`,'بنزين ديزل ٤٠٠'))).then(()=>document.fonts.ready);
