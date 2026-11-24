window.HIGHLIGHT=[['بنزين',G],['ديزل',D],['شرارة',SP],['البوجي',SP],['٤٠٠',FL],['حرار',FL],['يسخن',FL],['gasoline',G],['diesel',D],['spark',SP],['400',FL],['heat',FL],['hot',FL]];
/* Episode: البنزين والديزل. Scene functions take DESIGN time t (0..30). */


function S1(t){ // hook 0–4.2
  const a=sceneAlpha(t,-1,4.2);X.save();X.globalAlpha=a;
  const ti=eo(seg(t,0,.5));
  X.save();X.translate(0,lerp(-60,0,ti));X.globalAlpha*=ti;
  X.font='900 108px Cairo';const w1=X.measureText(T('بنزين','Gasoline')).width,w2=X.measureText(T('ضد','vs')).width,w3=X.measureText(T('ديزل','Diesel')).width,gap=34,TW=w1+w2+w3+gap*2;
  if(LANG==='en'){let x=540-TW/2;stroked('Gasoline',x,350,108,G,'left',1,12);x+=w1+gap;stroked('vs',x,350,108,WH,'left',1,12);x+=w2+gap;stroked('Diesel',x,350,108,D,'left',1,12);}
  else{let x=540+TW/2;stroked('بنزين',x,350,108,G,'right',1,12);x-=w1+gap;stroked('ضد',x,350,108,WH,'right',1,12);x-=w2+gap;stroked('ديزل',x,350,108,D,'right',1,12);}X.restore();
  const bd=back(seg(t,.15,.85));barrel(540,lerp(300,780,bd),1.05,Math.sin(t*3)*.03*(1-seg(t,1,2)));
  const sp=seg(t,1.3,2.0),e=eo(sp);
  if(sp>0){
    const hx=lerp(540,780,e),hy=lerp(620,1060,e)-Math.sin(e*Math.PI)*220;drop(hx,hy,lerp(.3,1.25,e),G);
    const dx=lerp(540,300,e),dy=lerp(620,1060,e)-Math.sin(e*Math.PI)*220;drop(dx,dy,lerp(.3,1.25,e),D);
    txt(T('بنزين','Gasoline'),780,1190,56,G,900,'center',seg(t,1.9,2.2));txt(T('ديزل','Diesel'),300,1190,56,D,900,'center',seg(t,1.9,2.2));
  }
  const sw=seg(t,2.5,2.9);if(sw>0){
    X.save();X.globalAlpha*=sw;X.strokeStyle=WH;X.lineWidth=9;X.lineCap='round';
    X.beginPath();X.arc(540,1060,120,Math.PI*1.15,Math.PI*1.85);X.stroke();X.beginPath();X.arc(540,1060,120,Math.PI*.15,Math.PI*.85);X.stroke();X.restore();
    const ns=back(seg(t,2.8,3.2));if(ns>0){X.save();X.translate(540,1060);X.scale(ns,ns);X.strokeStyle=RED;X.lineWidth=16;X.beginPath();X.arc(0,0,70,0,7);X.stroke();
      X.beginPath();X.moveTo(-50,-50);X.lineTo(50,50);X.stroke();X.restore()}
  }
  X.restore();
}
function S2(t){ // heating 4.2–8.6
  const a=sceneAlpha(t,4.2,8.6);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('١ • من وين يطلعون؟','1 • Where do they come from?'),WH,1);
  const ii=eo(seg(t,4.2,4.8));X.save();X.translate(lerp(-300,0,ii),0);
  // vessel
  const vx=290,vy=640,vw=380,vh=420;
  rr(vx,vy,vw,vh,46);X.fillStyle='rgba(255,255,255,.06)';X.fill();X.lineWidth=8;X.strokeStyle='#5d7aa6';X.stroke();
  X.save();rr(vx+8,vy+8,vw-16,vh-16,40);X.clip();
  const lvl=vy+150;X.beginPath();X.moveTo(vx,vy+vh);for(let x=vx;x<=vx+vw;x+=10){X.lineTo(x,lvl+Math.sin(x*.04+t*6)*8*(.4+seg(t,5.8,7.2)))}X.lineTo(vx+vw,vy+vh);X.closePath();
  const og=X.createLinearGradient(0,lvl,0,vy+vh);og.addColorStop(0,'#3a2a1a');og.addColorStop(1,'#0c0805');X.fillStyle=og;X.fill();
  const heat=seg(t,5.8,8.0);for(let i=0;i<26;i++){const ph=(t*(.6+rnd(i)*.8)+rnd(i+4))%1,bx=vx+30+rnd(i+9)*(vw-60),by=lerp(vy+vh-20,lvl+10,ph);
    X.fillStyle=`rgba(255,190,120,${.5*heat})`;X.beginPath();X.arc(bx,by,4+rnd(i+2)*8,0,7);X.fill()}
  X.restore();
  txt(T('نفط خام','Crude oil'),vx+vw/2,vy+vh-90,58,WH,900,'center',1);
  // burner
  rr(vx+20,vy+vh+20,vw-40,26,13);X.fillStyle='#2b3b57';X.fill();
  flames(vx+vw/2,vy+vh+18,vw-60,t,seg(t,5.4,5.9));
  // vapor
  const vp=seg(t,6.8,8.4);for(let i=0;i<16;i++){const ph=(t*.5+rnd(i+30))%1,px=vx+60+rnd(i+40)*(vw-120)+Math.sin(t*3+i)*20,py=lerp(vy+120,vy-200,ph);
    X.fillStyle=`rgba(220,230,245,${.35*vp*(1-ph)})`;X.beginPath();X.arc(px,py,16+30*ph,0,7);X.fill()}
  txt(T('بخار','Vapor'),vx+vw/2,vy-150,52,'#DCE6F5',800,'center',seg(t,7.3,7.7));
  X.restore();
  // thermometer
  const tx=850,ty0=1060,ty1=600,hp=eio(seg(t,5.8,7.4));
  rr(tx-26,ty1-20,52,ty0-ty1+40,26);X.fillStyle='rgba(255,255,255,.1)';X.fill();X.lineWidth=5;X.strokeStyle='#5d7aa6';X.stroke();
  const fy=lerp(ty0,ty1+20,hp);rr(tx-14,fy,28,ty0-fy+10,14);X.fillStyle=FL;X.fill();
  X.beginPath();X.arc(tx,ty0+44,46,0,7);X.fillStyle=FL;X.fill();X.lineWidth=5;X.stroke();
  const deg=Math.round(lerp(25,400,hp)/5)*5;stroked(T(AR(deg)+'°م',deg+'°C'),tx,ty1-80,62,hp>.95?FL:WH,'center',seg(t,4.6,5.0),9);
  X.restore();
}
const LEVELS=[ // y, label, color, reveal time, highlight
 [600,T('غازات','Gases'),'#B7C3D6',10.4,0],[740,T('بنزين','Gasoline'),G,11.6,1],[880,T('كيروسين','Kerosene'),'#F2D27A',12.6,0],[1020,T('ديزل','Diesel'),D,13.4,1],[1160,T('زيوت ثقيلة','Heavy oils'),'#8A6A4A',14.4,0]];
function S3(t){ // tower 8.6–15.6
  const a=sceneAlpha(t,8.6,15.6);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٢ • برج التقطير','2 • Distillation tower'),WH,1);
  const ii=eo(seg(t,8.6,9.2));X.save();X.translate(0,lerp(200,0,ii));
  const x0=330,x1=600,y0=520,y1=1240;
  const tg=X.createLinearGradient(0,y0,0,y1);tg.addColorStop(0,'rgba(80,150,255,.22)');tg.addColorStop(1,'rgba(255,90,40,.3)');
  rr(x0,y0,x1-x0,y1-y0,60);X.fillStyle=tg;X.fill();X.lineWidth=8;X.strokeStyle='#6c8bba';X.stroke();
  LEVELS.forEach(L=>{X.strokeStyle='rgba(255,255,255,.25)';X.lineWidth=5;X.beginPath();X.moveTo(x0+20,L[0]+40);X.lineTo(x1-20,L[0]+40);X.stroke()});
  // inlet
  arrow(150,1200,x0-10,1200,FL,14,seg(t,8.8,9.4));txt(T('بخار حار','Hot vapor'),190,1265,40,FL,800,'center',seg(t,8.8,9.4));
  // bubbles rising
  const bp=seg(t,9.0,9.6);for(let i=0;i<34;i++){const ph=(t*(.25+rnd(i)*.25)+rnd(i+70))%1,by=lerp(y1-30,y0+40,ph),bx=x0+40+rnd(i+80)*(x1-x0-80)+Math.sin(t*4+i)*12;
    const hot=1-ph;X.fillStyle=`rgba(${Math.round(lerp(140,255,hot))},${Math.round(lerp(190,120,hot))},${Math.round(lerp(255,60,hot))},${.75*bp})`;X.beginPath();X.arc(bx,by,6+rnd(i+1)*7,0,7);X.fill()}
  // hot/cold scale
  const sa=seg(t,10.2,10.7);arrow(250,1150,250,600,'rgba(255,255,255,.7)',8,sa);
  txt(T('بارد','Cool'),250,545,38,'#8ec5ff',800,'center',sa);txt(T('حار','Hot'),250,1205,38,FL,800,'center',sa);
  // outputs
  LEVELS.forEach(L=>{const r=seg(t,L[3],L[3]+.45);if(r<=0)return;const e=eo(r),y=L[0]+40,ex=lerp(x1,x1+110,e);
    X.save();X.globalAlpha*=r;X.strokeStyle=L[2];X.lineWidth=18;X.lineCap='round';X.beginPath();X.moveTo(x1,y);X.lineTo(ex,y);X.stroke();X.restore();
    const hl=L[4]?1+.08*Math.sin(t*8)*seg(t,L[3]+.3,L[3]+.6):1;
    if(L[4])glow(x1+150+80,y,190,L[2]==G?'rgba(255,176,32,.35)':'rgba(34,195,166,.35)',r);
    drop(x1+150,y+6,(L[4]?.62:.42)*hl*e,L[2]);
    if(L[4])stroked(L[1],x1+205,y,70*hl,L[2],'left',r,10);else txt(L[1],x1+190,y,42,L[2],800,'left',r);
  });
  X.restore();X.restore();
}
function cylinder(t,cfg){
  const cx=540,top=600,bot=1180,w=400,lx=cx-w/2,headH=70;
  const py=lerp(1020,cfg.minY,cfg.p); // piston top y
  // walls
  X.fillStyle='#22324f';rr(lx-30,top,30,bot-top,10);X.fill();rr(lx+w,top,30,bot-top,10);X.fill();
  rr(lx-30,top-headH,w+60,headH,18);X.fill();
  // chamber gas
  X.save();X.beginPath();X.rect(lx,top,w,py-top);X.clip();
  const hc=cfg.heat||0;X.fillStyle=`rgba(${Math.round(lerp(40,255,hc))},${Math.round(lerp(70,80,hc))},${Math.round(lerp(120,40,hc))},${.35+.35*hc})`;X.fillRect(lx,top,w,py-top);
  for(let i=0;i<40;i++){const fx=rnd(i+200),fy=rnd(i+300);const px=lx+20+fx*(w-40)+Math.sin(t*7+i)*6,pyy=top+14+fy*(py-top-28)+Math.cos(t*6+i)*5;
    X.fillStyle=cfg.dot(i);X.beginPath();X.arc(px,pyy,7,0,7);X.fill()}
  if(cfg.mist>0){for(let i=0;i<30;i++){const an=(rnd(i+500)-.5)*1.3+Math.PI/2,d=cfg.mist*(60+rnd(i+600)*170);X.fillStyle=`rgba(34,195,166,${.85*(1-cfg.mist*.4)})`;X.beginPath();X.arc(cx+Math.cos(an)*d,top+10+Math.sin(an)*d,6,0,7);X.fill()}}
  X.restore();
  if(cfg.boom>0)burst(cx,(top+py)/2,lerp(60,160,cfg.boom),1-cfg.boom*.6);
  // piston
  const pg=X.createLinearGradient(lx,0,lx+w,0);pg.addColorStop(0,'#5b6f8f');pg.addColorStop(.5,'#a9bad3');pg.addColorStop(1,'#4b5d7a');
  rr(lx+6,py,w-12,120,14);X.fillStyle=pg;X.fill();X.fillStyle='#33445f';[30,62,94].forEach(o=>{X.fillRect(lx+6,py+o,w-12,8)});
  X.fillStyle='#6f84a6';rr(cx-26,py+120,52,bot-py-60,12);X.fill();
}
function pistonCycle(t,a,b,minY){ // compression then power stroke
  const c=seg(t,a,b);return c<.55?eio(c/.55):1-eo((c-.55)/.45);
}
function S4(t){ // gasoline 15.6–20.8
  const a=sceneAlpha(t,15.6,20.8);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٣ • محرك البنزين','3 • Gasoline engine'),G,1);
  const c1=[15.8,18.6],c2=[18.7,20.6];
  let p=t<c1[1]?pistonCycle(t,c1[0],c1[1]):pistonCycle(t,c2[0],c2[1]);
  const sparkT=[c1[0]+(c1[1]-c1[0])*.55,c2[0]+(c2[1]-c2[0])*.55];
  let boom=0,flash=0;sparkT.forEach(s=>{const k=seg(t,s,s+.6);if(k>0&&k<1)boom=k;const f=seg(t,s-.08,s+.15);if(f>0&&f<1)flash=1-Math.abs(f*2-1)});
  cylinder(t,{p,minY:720,heat:boom?1-boom*.5:0,mist:0,boom,dot:i=>i%3?'rgba(255,176,32,.85)':'rgba(200,220,255,.7)'});
  // spark plug
  rr(510,440,60,110,10);X.fillStyle='#e9eef6';X.fill();rr(522,550,36,50,6);X.fillStyle='#9aa9bf';X.fill();
  if(flash>0){glow(540,620,220,'rgba(255,240,140,.95)',flash);bolt(540,640,1.3,SP,flash)}
  // labels
  txt(T('بوجي','Spark plug'),650,470,48,WH,800,'left',seg(t,16.0,16.4));arrow(642,476,585,500,WH,6,seg(t,16.0,16.4));
  txt(T('وقود + هواء','Fuel + air'),540,1260,42,G,800,'center',seg(t,16.0,16.4));
  stroked(T('شرارة!','Spark!'),760,690,76,SP,'left',flash>0?1:seg(t,17.6,17.8)*(1-seg(t,18.6,18.8)),10);
  X.restore();
}
function S5(t){ // diesel 20.8–26.2
  const a=sceneAlpha(t,20.8,26.2);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٤ • محرك الديزل','4 • Diesel engine'),D,1);
  const comp=eio(seg(t,21.0,23.9)),down=eo(seg(t,24.35,25.6));const p=comp*(1-down);
  const heat=seg(t,22.6,24.2)*(1-seg(t,25.0,26.0)*.7);
  const mist=seg(t,23.9,24.35),boom=seg(t,24.3,25.1);
  cylinder(t,{p,minY:640,heat,mist:mist>0&&boom<1?mist:0,boom:boom>0&&boom<1?boom:0,dot:i=>`rgba(${Math.round(lerp(170,255,heat))},${Math.round(lerp(215,150,heat))},255,.8)`});
  // injector
  rr(518,430,44,120,10);X.fillStyle=D;X.fill();rr(528,550,24,50,6);X.fillStyle='#7fe3d3';X.fill();
  txt(T('بخّاخ','Injector'),640,470,46,D,800,'left',seg(t,21.2,21.6));
  txt(T('هواء فقط','Air only'),540,1260,44,'#bfe0ff',800,'center',seg(t,21.2,21.6)*(1-seg(t,22.6,23)));
  txt(T('ضغط عالي ← حرارة','High pressure → heat'),540,1260,44,FL,800,'center',seg(t,22.8,23.2));
  if(heat>0)glow(540,620,240,'rgba(255,80,40,.5)',heat*(1-boom));
  // no-spark badge
  const nb=back(seg(t,24.5,24.9));if(nb>0){X.save();X.translate(830,700);X.scale(nb,nb);X.beginPath();X.arc(0,0,78,0,7);X.fillStyle='rgba(5,10,22,.8)';X.fill();
    bolt(0,0,.95,SP,1);X.strokeStyle=RED;X.lineWidth=12;X.beginPath();X.arc(0,0,72,0,7);X.stroke();X.beginPath();X.moveTo(-52,-52);X.lineTo(52,52);X.stroke();X.restore();
    stroked(T('بدون شرارة!','No spark!'),830,830,58,WH,'center',seg(t,24.6,24.9),9)}
  X.restore();
}
function card(x,y,w,h,col,title,rows,a,icon){
  if(a<=0)return;X.save();X.globalAlpha*=a;
  rr(x,y,w,h,36);X.fillStyle='rgba(255,255,255,.07)';X.fill();X.lineWidth=5;X.strokeStyle=col;X.stroke();
  rr(x,y,w,120,{upperLeft:36,upperRight:36,lowerLeft:0,lowerRight:0});X.fillStyle=col;X.fill();
  txt(title,x+w/2,y+62,64,'#0A1224',900,'center',1);
  rows.forEach((r,i)=>{const ry=y+210+i*120;txt(r[1],x+w/2,ry-26,30,MU,600,'center',1);txt(r[0],x+w/2,ry+16,44,WH,800,'center',1)});
  X.restore();
}
function S6(t){ // summary 26.2–30
  const a=sceneAlpha(t,26.2,31);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('الخلاصة','Summary'),WH,1);
  const r1=eo(seg(t,26.3,26.9)),r2=eo(seg(t,26.5,27.1));
  X.save();X.translate(lerp(300,0,r1),0);card(560,470,420,560,G,T('بنزين','Gasoline'),[[T('أخف','Lighter'),T('الوزن','Weight')],[T('شرارة بوجي','Spark plug'),T('الاشتعال','Ignition')],[T('السيارات','Cars'),T('غالباً في','Mostly in')]],r1);X.restore();
  X.save();X.translate(lerp(-300,0,r2),0);card(100,470,420,560,D,T('ديزل','Diesel'),[[T('أثقل','Heavier'),T('الوزن','Weight')],[T('ضغط وحرارة','Pressure + heat'),T('الاشتعال','Ignition')],[T('الشاحنات','Trucks'),T('غالباً في','Mostly in')]],r2);X.restore();
  const b=back(seg(t,27.9,28.4));if(b>0){X.save();X.translate(540,1150);X.scale(b*.42,b*.42);barrel(0,0,1,0);X.restore()}
  const f=back(seg(t,28.5,28.9));if(f>0){X.save();X.translate(540,1250);X.scale(f,f);X.font='900 44px Cairo';const w=X.measureText(T('تابع للمزيد','Follow for more')).width+90;
    rr(-w/2,-38,w,76,38);X.fillStyle=RED;X.fill();X.restore();txt(T('تابع للمزيد','Follow for more'),540,1252,44,WH,900,'center',f)}
  X.restore();
}


function drawScenes(t){S1(t);S2(t);S3(t);S4(t);S5(t);S6(t)}
function drawCover(){
  bg(3);
  const g=X.createRadialGradient(540,900,50,540,900,700);g.addColorStop(0,'rgba(255,120,40,.25)');g.addColorStop(1,'rgba(0,0,0,0)');X.fillStyle=g;X.fillRect(0,0,W,H);
  barrel(540,980,1.15,0);drop(260,1080,1.5,D);drop(820,1080,1.5,G);
  bolt(820,800,1.4,SP,1);
  X.save();X.translate(260,800);X.beginPath();X.arc(0,0,74,0,7);X.fillStyle='rgba(5,10,22,.8)';X.fill();X.strokeStyle=FL;X.lineWidth=10;X.stroke();X.restore();
  arrow(220,830,300,770,FL,10,1);
  stroked(T('شرارة','Spark'),540,430,150,SP,'center',1,16);stroked(T('ولا ضغط؟','or Pressure?'),540,600,150,WH,'center',1,16);
  txt(T('بنزين','Gasoline'),820,1290,72,G,900,'center',1);txt(T('ديزل','Diesel'),260,1290,72,D,900,'center',1);
}
window.drawScenes=drawScenes;window.drawCover=drawCover;
