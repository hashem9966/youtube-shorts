/* Episode: كيف يعمل المكيّف؟ (refrigeration cycle: it moves heat, it does not make cold). Scene functions take DESIGN time t (0..30). */
const COLD='#4FB3FF',WARM='#FFB020',HOTC='#FF4D4D',PIPE='#3A4A66',WALL='#C9B79C',ROOM='rgba(255,140,60,.10)',OUT='rgba(255,210,120,.08)';
window.HIGHLIGHT=[['البارد',COLD],['برودة',COLD],['البرد',COLD],['يبرد',COLD],['حرارة',HOTC],['الحرارة',HOTC],['حرارتك',HOTC],['حرارته',HOTC],['حارة',HOTC],['يسخن',HOTC],['الضاغط',G],['ضيقة',D],['الخارج',WARM],['الخارجية',WARM],['ينقل',D],
 ['cold',COLD],['icy',COLD],['heat',HOTC],['hot',HOTC],['hotter',HOTC],['compressor',G],['valve',D],['outside',WARM],['outdoors',WARM],['moves',D]];

/* closed loop: right side = indoor coil (going up), top = to outside, left = outdoor coil (going down), bottom = back in through the valve */
const LX0=200,LX1=880,LY0=600,LY1=1160,SEG=[LY1-LY0,LX1-LX0,LY1-LY0,LX1-LX0],TOT=SEG.reduce((a,b)=>a+b),WALLX=540,COMPX=330,VALVEX=430;
function loopPt(d){d=((d%TOT)+TOT)%TOT;if(d<SEG[0])return[LX1,LY1-d];d-=SEG[0];if(d<SEG[1])return[LX1-d,LY0];d-=SEG[1];if(d<SEG[2])return[LX0,LY0+d];d-=SEG[2];return[LX0+d,LY1]}
const D_COMP=SEG[0]+(LX1-COMPX),D_VALVE=SEG[0]+SEG[1]+SEG[2]+(VALVEX-LX0);
function mix(a,b,f){const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const A=p(a),B=p(b);return `rgb(${A.map((v,i)=>Math.round(lerp(v,B[i],cl(f)))).join(',')})`}
function tempCol(d){d=((d%TOT)+TOT)%TOT;
  if(d<SEG[0])return mix(COLD,WARM,d/SEG[0]);
  if(d<D_COMP)return WARM;
  if(d<SEG[0]+SEG[1]+SEG[2])return mix(HOTC,WARM,(d-SEG[0]-SEG[1])/SEG[2]*.9);
  if(d<D_VALVE)return WARM;return COLD}
function pipes(a=1){X.save();X.globalAlpha*=a;X.strokeStyle=PIPE;X.lineWidth=34;X.lineJoin='round';X.beginPath();X.rect(LX0,LY0,LX1-LX0,LY1-LY0);X.stroke();
  X.strokeStyle='rgba(255,255,255,.12)';X.lineWidth=4;X.beginPath();X.rect(LX0-10,LY0-10,LX1-LX0+20,LY1-LY0+20);X.stroke();X.restore()}
function blobs(t,speed=260,a=1,hl=null){for(let i=0;i<22;i++){const d=i*TOT/22+t*speed;const [x,y]=loopPt(d);
  X.save();X.globalAlpha*=a*(hl?(hl(((d%TOT)+TOT)%TOT)?1:.25):1);X.beginPath();X.arc(x,y,13,0,7);X.fillStyle=tempCol(d);X.fill();X.restore()}}
function houseBg(a=1){X.save();X.globalAlpha*=a;rr(WALLX,430,400,850,30);X.fillStyle=ROOM;X.fill();rr(100,430,440,850,30);X.fillStyle=OUT;X.fill();
  X.fillStyle=WALL;X.fillRect(WALLX-14,430,28,850);X.restore();
  txt(T('غرفتك','Your room'),760,480,40,WARM,900,'center',a);txt(T('الخارج','Outside'),300,480,40,SP,900,'center',a)}
function compressor(x,y,s,t,a=1,pulse=0){if(a<=0)return;X.save();X.globalAlpha*=a;X.translate(x,y);const k=1+pulse*.08*Math.sin(t*30);X.scale(s*k,s*k);
  rr(-70,-60,140,120,22);X.fillStyle='#2B3550';X.fill();X.lineWidth=5;X.strokeStyle=G;X.stroke();
  X.fillStyle=G;for(let i=-1;i<=1;i++){rr(-48,i*30-6,96,12,6);X.fill()}X.restore()}
function fan(x,y,r,t,a=1,spd=8){if(a<=0)return;X.save();X.globalAlpha*=a;X.translate(x,y);X.beginPath();X.arc(0,0,r,0,7);X.strokeStyle='rgba(255,255,255,.5)';X.lineWidth=5;X.stroke();
  X.rotate(t*spd);X.fillStyle='rgba(220,230,245,.9)';for(let k=0;k<3;k++){X.rotate(Math.PI*2/3);X.beginPath();X.ellipse(r*.45,0,r*.45,r*.16,0,0,7);X.fill()}
  X.beginPath();X.arc(0,0,r*.14,0,7);X.fillStyle='#2B3550';X.fill();X.restore()}
function heatWaves(x,y,dir,t,a=1,n=4,len=220){if(a<=0)return;for(let i=0;i<n;i++){const ph=(t*.8+i/n)%1;X.save();X.globalAlpha*=a*(1-ph);X.strokeStyle=HOTC;X.lineWidth=10;X.lineCap='round';X.beginPath();
  for(let k=0;k<90;k+=5)X.lineTo(x+dir*(ph*len+k),y-90+i*60+Math.sin(k*.15+t*6)*10);X.stroke();X.restore()}}
function thermo(x,y,v,col,a=1){if(a<=0)return;X.save();X.globalAlpha*=a;rr(x-16,y-120,32,200,16);X.fillStyle='rgba(255,255,255,.15)';X.fill();
  X.beginPath();X.arc(x,y+95,30,0,7);X.fillStyle=col;X.fill();rr(x-8,y+80-170*v,16,170*v+10,8);X.fill();X.restore()}
function heatDot(x,y,r=12,a=1){glow(x,y,r*2.4,'rgba(255,77,77,.7)',a);X.save();X.globalAlpha*=a;X.beginPath();X.arc(x,y,r,0,7);X.fillStyle=HOTC;X.fill();X.restore()}
function snow(x,y,s,col,a=1){if(a<=0)return;X.save();X.globalAlpha*=a;X.translate(x,y);X.strokeStyle=col;X.lineWidth=10*s;X.lineCap='round';
  for(let k=0;k<3;k++){X.rotate(Math.PI/3);X.beginPath();X.moveTo(-60*s,0);X.lineTo(60*s,0);X.stroke()}X.restore()}
function acIndoor(x,y,t,a=1,breeze=1){if(a<=0)return;X.save();X.globalAlpha*=a;rr(x-210,y-70,420,140,34);X.fillStyle='#EEF3FA';X.fill();rr(x-180,y+30,360,16,8);X.fillStyle='#B9C6D9';X.fill();
  X.restore();if(breeze>0){for(let i=0;i<4;i++){const ph=(t*.9+i/4)%1;X.save();X.globalAlpha*=a*breeze*(1-ph);X.strokeStyle=COLD;X.lineWidth=7;X.lineCap='round';X.beginPath();
    for(let k=0;k<200;k+=8)X.lineTo(x-150+i*100+Math.sin(k*.05+t*5)*12,y+90+ph*260+k*.5);X.stroke();X.restore()}}}
function outdoorUnit(x,y,s,t,a=1){if(a<=0)return;X.save();X.globalAlpha*=a;X.translate(x,y);X.scale(s,s);rr(-200,-170,400,340,30);X.fillStyle='#D8DEE8';X.fill();X.restore();
  fan(x-30*s,y,120*s,t,a,10);X.save();X.globalAlpha*=a;X.fillStyle='#9AA7BA';for(let i=0;i<6;i++){rr(x+110*s,y+(-120+i*45)*s,60*s,14*s,6);X.fill()}X.restore()}

function S1(t){ // hook 0–4.2
  const a=sceneAlpha(t,-1,4.2);if(a<=0)return;X.save();X.globalAlpha=a;
  const ti=eo(seg(t,0,.5));X.save();X.translate(0,lerp(-60,0,ti));X.globalAlpha*=ti;stroked(T('هواء بارد؟','Cold air?'),540,340,110,COLD,'center',1,12);X.restore();
  acIndoor(540,620,t,eo(seg(t,.1,.6)),1);
  const sn=back(seg(t,1.6,2.0));snow(540,1000,.9*sn,COLD,sn>0?1:0);
  const x=seg(t,2.0,2.3);if(x>0){X.save();X.globalAlpha*=x;X.strokeStyle=RED;X.lineWidth=16;X.lineCap='round';X.beginPath();X.moveTo(440,900);X.lineTo(640,1100);X.moveTo(640,900);X.lineTo(440,1100);X.stroke();X.restore();
    txt(T('لا يصنعه!','It makes none!'),540,1200,52,RED,900,'center',x)}
  const q=back(seg(t,2.9,3.3));if(q>0){X.save();X.translate(860,800);X.scale(q*(1+.06*Math.sin(t*8)),q);stroked('?',0,0,170,SP,'center',1,14);X.restore()}
  X.restore();
}
function S2(t){ // fluid absorbs heat indoors 4.2–9.6
  const a=sceneAlpha(t,4.2,9.6);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('١ • سائل يمتص الحرارة','1 • A fluid soaks up heat'),COLD,1);
  houseBg(1);const pa=seg(t,4.4,5.0);pipes(pa);
  const inRoom=d=>d<SEG[0];blobs(t,240,pa,seg(t,6.0,6.4)>0?inRoom:null);
  const ha=seg(t,7.8,8.2);for(let i=0;i<7;i++){const ph=(t*.5+i/7)%1,sx=620+rnd(i+5)*220,sy=700+rnd(i+9)*400;heatDot(lerp(sx,LX1,eio(ph)),lerp(sy,sy-40,ph),16,ha*(1-.6*ph))}
  thermo(700,860,lerp(.8,.55,eio(seg(t,8.0,9.4))),mix(HOTC,COLD,seg(t,8.0,9.4)),seg(t,5.0,5.4));
  txt(T('ملف الغرفة','Indoor coil'),LX1-10,LY1+70,38,COLD,900,'center',seg(t,6.2,6.6));
  X.restore();
}
function S3(t){ // compressor, hotter than the street, dumps heat 9.6–16.6
  const a=sceneAlpha(t,9.6,16.6);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٢ • الضاغط','2 • The compressor'),G,1);
  houseBg(1);pipes(1);blobs(t,300,1);
  const ca=seg(t,11.6,12.0);compressor(COMPX,LY0,1,t,1,ca*(1-seg(t,13.2,13.4)));
  txt(T('ضاغط','Compressor'),COMPX,LY0+110,40,G,900,'center',ca);
  const hb=seg(t,13.4,13.8);if(hb>0){txt(T('أسخن من الشارع','Hotter than outside'),370,1060,T(40,32),HOTC,900,'center',hb)}
  const fa=seg(t,15.0,15.3);if(fa>0){fan(LX0,880,90,t,fa,12);heatWaves(LX0-60,880,-1,t,fa,4,40)}
  X.restore();
}
function S4(t){ // valve, pressure drop, loop 16.6–22.6
  const a=sceneAlpha(t,16.6,22.6);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٣ • الفتحة الضيقة','3 • The tiny valve'),D,1);
  const zo=1-seg(t,20.4,20.8);
  if(zo>0){X.save();X.globalAlpha*=zo;
    // zoomed pipe: wide -> narrow neck -> wide
    X.fillStyle=PIPE;X.beginPath();X.moveTo(110,620);X.lineTo(470,620);X.lineTo(520,760);X.lineTo(560,760);X.lineTo(610,620);X.lineTo(970,620);X.lineTo(970,900);X.lineTo(610,900);X.lineTo(560,780);X.lineTo(520,780);X.lineTo(470,900);X.lineTo(110,900);X.closePath();X.fill();
    for(let i=0;i<12;i++){const f=((t*.22+i/12)%1),x=lerp(130,950,f);const neck=Math.abs(x-540)<90;const y=neck?770:760+Math.sin(i*1.7)*90*(1-Math.max(0,1-Math.abs(x-540)/200));
      const cold=x>560;X.beginPath();X.arc(x,neck?770:lerp(760,y,1),neck?12:22,0,7);X.fillStyle=cold?COLD:WARM;X.fill()}
    txt(T('ضغط عالٍ','High pressure'),280,560,40,WARM,900,'center',seg(t,17.0,17.4));
    txt(T('ضغط منخفض','Low pressure'),800,560,40,COLD,900,'center',seg(t,18.6,19.0));
    const ga=seg(t,18.6,19.0);if(ga>0){X.save();X.globalAlpha*=ga;X.translate(540,1110);X.beginPath();X.arc(0,0,110,Math.PI,0);X.strokeStyle=WH;X.lineWidth=8;X.stroke();
      const an=Math.PI+lerp(.85,.15,eio(seg(t,18.8,20.0)))*Math.PI;X.strokeStyle=RED;X.lineWidth=10;X.lineCap='round';X.beginPath();X.moveTo(0,0);X.lineTo(Math.cos(an)*90,Math.sin(an)*90);X.stroke();X.restore();
      snow(820,1100,.5,COLD,seg(t,19.6,20.0))}
    X.restore()}
  const lp=seg(t,20.6,21.0);if(lp>0){X.save();X.globalAlpha*=lp;houseBg(1);pipes(1);blobs(t,360,1);compressor(COMPX,LY0,.8,t,1,0);
    [[LX1,880,-Math.PI/2],[540,LY0,Math.PI],[LX0,880,Math.PI/2],[700,LY1,0]].forEach(p=>arrow(p[0]-Math.cos(p[2])*40,p[1]-Math.sin(p[2])*40,p[0]+Math.cos(p[2])*40,p[1]+Math.sin(p[2])*40,WH,8,1));X.restore()}
  X.restore();
}
function S5(t){ // outdoor unit blows your heat 22.6–26.8
  const a=sceneAlpha(t,22.6,26.8);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٤ • الدليل','4 • The proof'),HOTC,1);
  outdoorUnit(620,820,1.1,t,eo(seg(t,22.7,23.2)));
  heatWaves(370,820,-1,t,seg(t,23.6,24.0),5,150);
  const lb=back(seg(t,24.8,25.2));if(lb>0){X.save();X.translate(540,1170);X.scale(lb,lb);stroked(T('حرارة بيتك!','Your home\'s heat!'),0,0,74,HOTC,'center',1,10);X.restore()}
  txt(T('الوحدة الخارجية','Outdoor unit'),620,560,42,WH,900,'center',seg(t,23.0,23.4));
  X.restore();
}
function S6(t){ // payoff 26.8–30
  const a=sceneAlpha(t,26.8,31);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('الخلاصة','Summary'),WH,1);
  const r1=back(seg(t,26.9,27.4));if(r1>0){X.save();X.translate(290,780);X.scale(r1,r1);snow(0,0,.9,COLD,1);X.strokeStyle=RED;X.lineWidth=14;X.lineCap='round';X.beginPath();X.moveTo(-90,-90);X.lineTo(90,90);X.moveTo(90,-90);X.lineTo(-90,90);X.stroke();X.restore();
    txt(T('لا يصنع البرد','Makes no cold'),290,960,44,COLD,900,'center',r1)}
  const r2=back(seg(t,27.6,28.1));if(r2>0){X.save();X.translate(790,780);X.scale(r2,r2);rr(-130,-110,120,220,20);X.fillStyle=ROOM;X.fill();X.strokeStyle=WARM;X.lineWidth=4;X.stroke();
      const f=(t*.6)%1;heatDot(lerp(-70,110,f),0,18,1);arrow(-20,60,120,60,D,8,1);X.restore();
    txt(T('ينقل الحرارة','Moves heat'),790,960,44,D,900,'center',r2)}
  const f=back(seg(t,28.5,28.9));if(f>0){const lab=T('تابع للمزيد','Follow for more');X.save();X.translate(540,1180);X.scale(f,f);X.font='900 44px Cairo';const w=X.measureText(lab).width+90;
    rr(-w/2,-38,w,76,38);X.fillStyle=RED;X.fill();X.restore();txt(lab,540,1182,44,WH,900,'center',f)}
  X.restore();
}
function drawScenes(t){S1(t);S2(t);S3(t);S4(t);S5(t);S6(t)}
function drawCover(){bg(3);outdoorUnit(640,860,1.25,2.2,1);heatWaves(370,860,-1,2.2,1,5,150);
  stroked(T('ينقل الحرارة!','It moves heat!'),540,350,T(116,104),HOTC,'center',1,16)}
window.drawScenes=drawScenes;window.drawCover=drawCover;
