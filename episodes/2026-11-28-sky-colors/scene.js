/* Episode: لماذا السماء زرقاء والغروب أحمر؟ (Rayleigh scattering, longer path at sunset). Scene functions take DESIGN time t (0..30). */
const SKYB='#3E8EF0',SKYB2='#A9D4FF',SUNSET1='#FF5E3A',SUNSET2='#FFB347',SPEC=['#FF4D4D','#FF8C1A','#FFE45C','#3DD68C','#3E8EF0','#6A5BFF'],ATM='rgba(120,180,255,.18)';
window.HIGHLIGHT=[['تحمرّ',SUNSET1],['الغروب',SUNSET2],['غروبًا',SUNSET2],['الأحمر',SUNSET1],['بالأحمر',SUNSET1],['البرتقالي',SUNSET2],['الأزرق',SKYB],['زرقاء',SKYB],['أبيض',WH],['الألوان',SP],['الهواء',SKYB2],['يتشتت',SKYB],['فيتشتت',SKYB],['أطول',G],
 ['red',SUNSET1],['sunset',SUNSET2],['orange',SUNSET2],['blue',SKYB],['white',WH],['colors',SP],['air',SKYB2],['scatters',SKYB],['more',G]];

function skyRect(x,y,w,h,c1,c2,a=1){if(a<=0)return;X.save();X.globalAlpha*=a;const g=X.createLinearGradient(0,y,0,y+h);g.addColorStop(0,c1);g.addColorStop(1,c2);rr(x,y,w,h,36);X.fillStyle=g;X.fill();X.restore()}
function sunDisc(x,y,r,col,a=1){if(a<=0)return;glow(x,y,r*3,col==='#FFFFFF'?'rgba(255,250,220,.7)':'rgba(255,140,60,.7)',a);X.save();X.globalAlpha*=a;X.beginPath();X.arc(x,y,r,0,7);X.fillStyle=col;X.fill();X.restore()}
function horizon(y,a=1){if(a<=0)return;X.save();X.globalAlpha*=a;X.fillStyle='#1B2B3A';X.beginPath();X.moveTo(90,y);for(let x=90;x<=990;x+=30)X.lineTo(x,y-12-18*Math.abs(Math.sin(x*.013)));X.lineTo(990,1300);X.lineTo(90,1300);X.closePath();X.fill();X.restore()}
function beam(x0,y0,x1,y1,col,w=14,a=1){if(a<=0)return;X.save();X.globalAlpha*=a;X.strokeStyle=col;X.lineWidth=w;X.lineCap='round';X.beginPath();X.moveTo(x0,y0);X.lineTo(x1,y1);X.stroke();X.restore()}
function molDot(x,y,r=12,a=1){if(a<=0)return;X.save();X.globalAlpha*=a;X.beginPath();X.arc(x,y,r,0,7);X.fillStyle='rgba(220,235,255,.85)';X.fill();X.restore()}
function personTiny(x,y,s,a=1){if(a<=0)return;X.save();X.globalAlpha*=a;X.translate(x,y);X.scale(s,s);X.fillStyle=WH;X.beginPath();X.arc(0,-60,20,0,7);X.fill();rr(-18,-36,36,60,14);X.fill();rr(-16,22,12,40,6);X.fill();rr(4,22,12,40,6);X.fill();X.restore()}

function S1(t){ // hook 0–4.2
  const a=sceneAlpha(t,-1,4.2);if(a<=0)return;X.save();X.globalAlpha=a;
  const f=eio(seg(t,.2,2.6));skyRect(100,440,880,860,f<.5?SKYB:SUNSET1,f<.5?SKYB2:SUNSET2,1);
  skyRect(100,440,880,860,SUNSET1,SUNSET2,f);
  sunDisc(540,lerp(560,1080,f),70,f>.5?'#FF7A3A':'#FFFFFF',1);horizon(1130,1);
  const ti=eo(seg(t,0,.5));X.save();X.translate(0,lerp(-60,0,ti));X.globalAlpha*=ti;stroked(T('لماذا يحمرّ؟','Why red?'),540,340,110,SUNSET2,'center',1,12);X.restore();
  const q=back(seg(t,2.9,3.3));if(q>0){X.save();X.translate(820,640);X.scale(q*(1+.06*Math.sin(t*8)),q);stroked('?',0,0,170,SP,'center',1,14);X.restore()}
  X.restore();
}
function S2(t){ // white light = all colors 4.2–9.6
  const a=sceneAlpha(t,4.2,9.6);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('١ • الضوء الأبيض','1 • White light'),WH,1);
  sunDisc(220,600,80,'#FFFFFF',eo(seg(t,4.4,4.9)));
  const b=eo(seg(t,4.6,5.4));beam(300,640,lerp(300,560,b),lerp(640,800,b),'#FFFFFF',22,b>0?1:0);
  const sp=eio(seg(t,5.8,7.4));if(sp>0){X.save();X.translate(560,800);X.beginPath();X.moveTo(-60,60);X.lineTo(60,60);X.lineTo(0,-70);X.closePath();X.fillStyle='rgba(200,230,255,.25)';X.fill();X.strokeStyle='rgba(255,255,255,.7)';X.lineWidth=4;X.stroke();X.restore();
    SPEC.forEach((c,i)=>{const an=-.25+i*.11;beam(580,810,580+Math.cos(an)*360*sp,810+Math.sin(an)*360*sp+i*8,c,16,1)})}
  const lb=seg(t,7.6,8.0);if(lb>0){stroked(T('أحمر','Red'),820,650,50,SPEC[0],'center',lb,8);stroked(T('أزرق','Blue'),820,1000,50,SPEC[4],'center',lb,8)}
  X.restore();
}
function S3(t){ // scattering: blue sky 9.6–16.6
  const a=sceneAlpha(t,9.6,16.6);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٢ • الهواء يبعثر الأزرق','2 • Air scatters blue'),SKYB,1);
  const sk=seg(t,15.0,16.0);skyRect(100,440,880,860,'rgba(62,142,240,'+(.15+.85*sk)+')','rgba(169,212,255,'+(.1+.8*sk)+')',1);
  for(let i=0;i<26;i++)molDot(130+rnd(i+11)*820,480+rnd(i+21)*640,10,seg(t,9.8,10.4));
  // incoming white beam -> red continues, blue bounces randomly
  const bi=eo(seg(t,10.0,11.0));beam(100,560,lerp(100,980,bi),lerp(560,900,bi),'rgba(255,255,255,.9)',12,1);
  const sc=seg(t,13.2,13.6);if(sc>0){for(let i=0;i<22;i++){const ph=(t*.6+i/22)%1,ox=130+rnd(i+11)*820,oy=480+rnd(i+21)*640,an=rnd(i+31)*Math.PI*2,d=ph*140;
      X.save();X.globalAlpha*=sc*(1-ph);X.strokeStyle=SKYB;X.lineWidth=7;X.lineCap='round';X.beginPath();X.moveTo(ox+Math.cos(an)*d,oy+Math.sin(an)*d);X.lineTo(ox+Math.cos(an)*(d+40),oy+Math.sin(an)*(d+40));X.stroke();X.restore()}}
  const hc=seg(t,11.2,11.6);if(hc>0){burst(540,730,40,hc*(1-seg(t,12.4,12.8)));txt(T('اصطدام!','Hit!'),540,650,44,SP,900,'center',hc*(1-seg(t,12.4,12.8)))}
  horizon(1160,1);personTiny(800,1150,1.1,1);
  const ey=seg(t,15.0,15.4);if(ey>0)arrow(800,1060,700,940,WH,7,ey);
  X.restore();
}
function S4(t){ // sunset: longer path through the air 16.6–22.6
  const a=sceneAlpha(t,16.6,22.6);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٣ • وقت الغروب','3 • At sunset'),SUNSET2,1);
  // earth arc with atmosphere layer
  const cx=540,cy=1750,R=900;X.save();rr(100,440,880,860,36);X.clip();X.beginPath();X.arc(cx,cy,R+190,0,7);X.fillStyle=ATM;X.fill();X.beginPath();X.arc(cx,cy,R,0,7);X.fillStyle='#1B3A5A';X.fill();X.restore();
  personTiny(540,cy-R+4,1,1);
  // noon path (short) vs sunset path (long)
  const p1=eo(seg(t,17.0,17.6));beam(540,cy-R-190,540,lerp(cy-R-190,cy-R-60,p1),'#FFFFFF',12,1);sunDisc(540,cy-R-250,40,'#FFFFFF',1);
  txt(T('ظهرًا: طريق قصير','Noon: short path'),540,480,40,SKYB2,900,'center',seg(t,17.0,17.4));
  const p2=eo(seg(t,18.2,19.6));const sx=120,sy=cy-R-20;sunDisc(sx-10,sy-30,40,'#FF7A3A',seg(t,18.2,18.6));
  beam(sx+30,sy-10,lerp(sx+30,520,p2),lerp(sy-10,cy-R-50,p2),SUNSET2,12,seg(t,18.2,18.6));
  txt(T('غروبًا: طريق أطول بكثير','Sunset: far longer path'),540,1220,40,SUNSET2,900,'center',seg(t,18.6,19.0));
  const lost=seg(t,20.2,20.6);if(lost>0){for(let i=0;i<10;i++){const ph=(t*.7+i/10)%1,f=i/10,x=lerp(sx+40,500,f),y=lerp(sy-12,cy-R-48,f);X.save();X.globalAlpha*=lost*(1-ph);X.strokeStyle=SKYB;X.lineWidth=7;X.lineCap='round';
      X.beginPath();X.moveTo(x,y-10-ph*90);X.lineTo(x+(rnd(i)-.5)*30,y-40-ph*90);X.stroke();X.restore()}}
  X.restore();
}
function S5(t){ // only red/orange left 22.6–26.8
  const a=sceneAlpha(t,22.6,26.8);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٤ • يبقى الأحمر','4 • Red survives'),SUNSET1,1);
  const sk=eio(seg(t,24.8,26.2));skyRect(100,440,880,860,SUNSET1,SUNSET2,sk);
  // rays arriving: blue ones drop off along the path, red/orange go through
  SPEC.forEach((c,i)=>{const y=560+i*80,keep=i<2,len=keep?1:lerp(1,.25+i*.05,eio(seg(t,22.8,24.4)));const x1=lerp(140,900,len);beam(140,y,x1,y,c,14,1);
    if(!keep&&len<.99){X.save();X.globalAlpha*=.6;X.fillStyle=c;for(let k=0;k<4;k++){const ph=(t*.8+k/4)%1;X.beginPath();X.arc(x1+10,y-ph*70,6,0,7);X.fill()}X.restore()}});
  personTiny(920,1150,1,1);horizon(1180,1);sunDisc(150,1080,50,'#FF7A3A',1);
  const lb=back(seg(t,24.0,24.4));if(lb>0){X.save();X.translate(540,1050);X.scale(lb,lb);stroked(T('أحمر وبرتقالي','Red and orange'),0,0,64,SUNSET2,'center',1,10);X.restore()}
  X.restore();
}
function S6(t){ // payoff 26.8–30
  const a=sceneAlpha(t,26.8,31);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('الخلاصة','Summary'),WH,1);
  const r1=back(seg(t,26.9,27.4)),r2=back(seg(t,27.3,27.8));
  if(r1>0){X.save();X.translate(290,800);X.scale(r1,r1);skyRect(-170,-170,340,340,SKYB,SKYB2,1);sunDisc(60,-80,36,'#FFFFFF',1);X.restore();txt(T('ظهرًا','Noon'),290,1020,48,SKYB,900,'center',r1)}
  if(r2>0){X.save();X.translate(790,800);X.scale(r2,r2);skyRect(-170,-170,340,340,SUNSET1,SUNSET2,1);sunDisc(0,120,40,'#FF7A3A',1);X.restore();txt(T('غروبًا','Sunset'),790,1020,48,SUNSET2,900,'center',r2)}
  txt(T('الهواء نفسه','Same air'),540,560,46,WH,900,'center',seg(t,27.6,28.0));
  const f=back(seg(t,28.5,28.9));if(f>0){const lab=T('تابع للمزيد','Follow for more');X.save();X.translate(540,1180);X.scale(f,f);X.font='900 44px Cairo';const w=X.measureText(lab).width+90;
    rr(-w/2,-38,w,76,38);X.fillStyle=RED;X.fill();X.restore();txt(lab,540,1182,44,WH,900,'center',f)}
  X.restore();
}
function drawScenes(t){S1(t);S2(t);S3(t);S4(t);S5(t);S6(t)}
function drawCover(){bg(3);X.save();rr(100,440,880,860,36);X.clip();skyRect(100,440,440,860,SKYB,SKYB2,1);skyRect(540,440,440,860,SUNSET1,SUNSET2,1);X.restore();
  sunDisc(320,620,60,'#FFFFFF',1);sunDisc(760,1060,60,'#FF7A3A',1);horizon(1140,1);
  stroked(T('الهواء نفسه!','Same air!'),540,340,T(120,110),SUNSET2,'center',1,16)}
window.drawScenes=drawScenes;window.drawCover=drawCover;
