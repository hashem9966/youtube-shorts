/* Episode: كيف الشربة تبرّد المويه؟ (evaporative cooling). Scene functions take DESIGN time t (0..30). */
const CL='#C8693A',CLD='#8E4524',WA='#4FB3FF',HOT='#FF6A3D',COLD='#6FD3FF';
window.HIGHLIGHT=[['كهربا',RED],['ثلج',COLD],['الشربة',CL],['تبخير',COLD],['التبخير',COLD],['حرارة',HOT],['تبرد',COLD],['تبرّد',COLD],['ناشف',SP],['الرطوبة',WA],['تعرق',WA],
 ['power',RED],['ice',COLD],['clay',CL],['jug',CL],['evaporat',COLD],['heat',HOT],['cool',COLD],['drier',SP],['humid',WA],['sweat',WA]];

function jug(x,y,s,wet=0,t=0,cut=0,waterCol=WA){ // clay jug centred on its belly
  X.save();X.translate(x,y);X.scale(s,s);
  const g=X.createLinearGradient(-170,0,170,0);g.addColorStop(0,CLD);g.addColorStop(.45,CL);g.addColorStop(1,'#7A3A1E');
  X.beginPath();X.moveTo(-55,-230);X.lineTo(55,-230);X.quadraticCurveTo(60,-160,110,-130);X.bezierCurveTo(200,-80,200,150,120,200);
  X.quadraticCurveTo(0,250,-120,200);X.bezierCurveTo(-200,150,-200,-80,-110,-130);X.quadraticCurveTo(-60,-160,-55,-230);X.closePath();
  X.fillStyle=g;X.fill();
  rr(-70,-252,140,30,12);X.fillStyle='#A9522B';X.fill();
  // decorative band
  X.strokeStyle='rgba(255,220,180,.35)';X.lineWidth=8;X.beginPath();X.ellipse(0,-60,165,26,0,0,Math.PI);X.stroke();
  if(cut>0){ // cutaway window showing the water
    X.save();X.globalAlpha*=cut;X.beginPath();X.ellipse(0,60,95,110,0,0,7);X.fillStyle='rgba(10,20,40,.85)';X.fill();
    X.beginPath();X.ellipse(0,60,95,110,0,0,7);X.clip();X.fillStyle=waterCol;X.fillRect(-100,10+Math.sin(t*4)*5,200,200);
    X.restore();X.lineWidth=6;X.strokeStyle='rgba(255,255,255,.5)';X.beginPath();X.ellipse(0,60,95,110,0,0,7);X.stroke();
  }
  // sweat beads
  for(let i=0;i<18;i++){if(rnd(i+40)>wet)continue;const an=-0.6+rnd(i)*2.6,r=150+rnd(i+9)*20;
    const bx=Math.cos(an)*r*(i%2?1:-1)*.92,by=Math.sin(an)*r*.8+30;X.fillStyle='rgba(150,215,255,.9)';X.beginPath();X.ellipse(bx,by,7,10,0,0,7);X.fill();
    X.fillStyle='rgba(255,255,255,.7)';X.beginPath();X.arc(bx-2,by-3,2.5,0,7);X.fill()}
  X.restore();
}
function vapor(cx,cy,w,t,a,n=12){if(a<=0)return;for(let i=0;i<n;i++){const ph=(t*.45+rnd(i+70))%1,px=cx-w/2+rnd(i+80)*w+Math.sin(t*3+i)*18,py=cy-ph*260;
  X.fillStyle=`rgba(220,235,255,${.4*a*(1-ph)})`;X.beginPath();X.arc(px,py,14+26*ph,0,7);X.fill()}}
function thermo(x,y0,y1,level,col,a=1){X.save();X.globalAlpha*=a;rr(x-24,y1-20,48,y0-y1+40,24);X.fillStyle='rgba(255,255,255,.1)';X.fill();X.lineWidth=5;X.strokeStyle='#5d7aa6';X.stroke();
  const fy=lerp(y0,y1+20,level);rr(x-13,fy,26,y0-fy+10,13);X.fillStyle=col;X.fill();X.beginPath();X.arc(x,y0+40,42,0,7);X.fillStyle=col;X.fill();X.stroke();X.restore()}
function noSign(x,y,s,a){if(a<=0)return;X.save();X.translate(x,y);X.scale(s,s);X.globalAlpha*=a;X.strokeStyle=RED;X.lineWidth=14;X.beginPath();X.arc(0,0,80,0,7);X.stroke();
  X.beginPath();X.moveTo(-56,-56);X.lineTo(56,56);X.stroke();X.restore()}
function plug(x,y){rr(x-50,y-40,100,80,18);X.fillStyle='#e9eef6';X.fill();X.fillStyle='#9aa9bf';X.fillRect(x-30,y-80,14,44);X.fillRect(x+16,y-80,14,44);
  X.strokeStyle='#e9eef6';X.lineWidth=12;X.beginPath();X.moveTo(x,y+40);X.quadraticCurveTo(x,y+90,x+50,y+100);X.stroke()}
function ice(x,y){X.save();X.translate(x,y);X.rotate(-.15);rr(-60,-60,120,120,20);X.fillStyle='rgba(170,225,255,.85)';X.fill();X.lineWidth=5;X.strokeStyle='#e8f7ff';X.stroke();
  X.fillStyle='rgba(255,255,255,.6)';rr(-40,-42,40,14,7);X.fill();X.restore()}
function face(x,y,s,wet,t){X.save();X.translate(x,y);X.scale(s,s);
  X.beginPath();X.arc(0,0,150,0,7);X.fillStyle='#E7B08A';X.fill();
  X.fillStyle='#3a2a20';X.beginPath();X.arc(-50,-10,14,0,7);X.arc(50,-10,14,0,7);X.fill();
  X.strokeStyle='#3a2a20';X.lineWidth=9;X.lineCap='round';X.beginPath();X.arc(0,40,50,.2,Math.PI-.2);X.stroke();
  X.fillStyle='#2b2b2b';X.beginPath();X.arc(0,-60,152,Math.PI*1.08,Math.PI*1.92);X.closePath();X.fill();
  for(let i=0;i<7;i++){if(rnd(i+90)>wet)continue;const bx=-110+i*36,by=-55+((i*37)%23)+Math.sin(t*2+i)*3;drop(bx,by,.17,'rgba(150,215,255,.95)')}
  X.restore()}
function sun(x,y,r,t,a=1){X.save();X.globalAlpha*=a;glow(x,y,r*2.6,'rgba(255,200,60,.55)',1);X.strokeStyle=SP;X.lineWidth=10;X.lineCap='round';
  for(let i=0;i<10;i++){const an=i/10*Math.PI*2+t*.4;X.beginPath();X.moveTo(x+Math.cos(an)*r*1.25,y+Math.sin(an)*r*1.25);X.lineTo(x+Math.cos(an)*r*1.6,y+Math.sin(an)*r*1.6);X.stroke()}
  X.beginPath();X.arc(x,y,r,0,7);X.fillStyle=SP;X.fill();X.restore()}

function S1(t){ // hook 0–4.2
  const a=sceneAlpha(t,-1,4.2);X.save();X.globalAlpha=a;
  const ti=eo(seg(t,0,.5));X.save();X.translate(0,lerp(-60,0,ti));X.globalAlpha*=ti;
  stroked(T('تبريد بدون كهربا','Zero-power cooling'),540,340,T(96,88),CL,'center',1,12);X.restore();
  const jd=back(seg(t,.15,.85));jug(540,lerp(300,800,jd),1.05,seg(t,1.0,3.5),t);
  const p1=back(seg(t,1.3,1.7));if(p1>0){X.save();X.translate(250,1130);X.scale(p1,p1);plug(0,0);X.restore();noSign(250,1130,1,seg(t,1.6,1.9))}
  const p2=back(seg(t,1.8,2.2));if(p2>0){X.save();X.translate(830,1130);X.scale(p2,p2);ice(0,0);X.restore();noSign(830,1130,1,seg(t,2.1,2.4))}
  const q=back(seg(t,2.8,3.2));if(q>0){X.save();X.translate(780,560);X.scale(q*(1+.06*Math.sin(t*8)),q);stroked('?',0,0,170,SP,'center',1,14);X.restore()}
  X.restore();
}
function S2(t){ // pores 4.2–9.6
  const a=sceneAlpha(t,4.2,9.6);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('١ • سر الفخار','1 • The secret of clay'),CL,1);
  const ii=eo(seg(t,4.2,4.8));
  jug(230,760,.62,seg(t,7.8,9.4),t);
  // magnifier link
  X.save();X.globalAlpha*=ii;X.strokeStyle='rgba(255,255,255,.35)';X.lineWidth=5;X.setLineDash([12,12]);
  X.beginPath();X.moveTo(320,700);X.lineTo(420,560);X.moveTo(320,820);X.lineTo(420,1060);X.stroke();X.setLineDash([]);X.restore();
  const cx=640,cy=810,R=280*lerp(.6,1,ii);
  X.save();X.globalAlpha*=ii;X.beginPath();X.arc(cx,cy,R,0,7);X.clip();
  X.fillStyle='#0f1e3a';X.fillRect(cx-R,cy-R,2*R,2*R);
  X.fillStyle='rgba(79,179,255,.75)';X.fillRect(cx-R,cy-R,R-70,2*R);           // water inside (left)
  X.fillStyle='rgba(255,160,90,.08)';X.fillRect(cx+70,cy-R,R,2*R);              // hot air outside (right)
  X.fillStyle=CL;X.fillRect(cx-70,cy-R,140,2*R);                                  // clay wall
  const pores=[-200,-120,-40,40,120,200];
  pores.forEach((py,k)=>{X.fillStyle='#3b1a0c';rr(cx-70,cy+py-9,140,18,9);X.fill();
    const sp=seg(t,6.0+k*.25,8.6+k*.15);if(sp>0){for(let j=0;j<3;j++){const ph=(sp*1.6+j/3)%1;const px=lerp(cx-80,cx+95,ph*sp);
      X.fillStyle=WA;X.beginPath();X.arc(px,cy+py,7,0,7);X.fill()}}
    const out=seg(t,7.8+k*.15,8.6+k*.15);if(out>0){X.fillStyle='rgba(150,215,255,.95)';X.beginPath();X.ellipse(cx+86,cy+py,10*out,13*out,0,0,7);X.fill()}});
  X.restore();
  X.save();X.globalAlpha*=ii;X.lineWidth=10;X.strokeStyle='#e9eef6';X.beginPath();X.arc(cx,cy,R,0,7);X.stroke();
  X.lineCap='round';X.lineWidth=26;X.beginPath();X.moveTo(cx+R*.72,cy+R*.72);X.lineTo(cx+R*.72+70,cy+R*.72+70);X.stroke();X.restore();
  txt(T('جوا','Inside'),cx-170,cy-R-36,44,WA,800,'center',seg(t,4.6,5.0));
  txt(T('برا','Outside'),cx+170,cy-R-36,44,HOT,800,'center',seg(t,4.6,5.0));
  txt(T('فخار','Clay'),cx,cy+R+40,44,CL,900,'center',seg(t,4.8,5.2));
  X.restore();
}
function S3(t){ // evaporation 9.6–17.6
  const a=sceneAlpha(t,9.6,17.6);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٢ • التبخير','2 • Evaporation'),COLD,1);
  const ii=eo(seg(t,9.6,10.2));X.save();X.translate(0,lerp(160,0,ii));
  const cool=eio(seg(t,15.6,17.4)),wc=`rgb(${Math.round(lerp(255,79,cool))},${Math.round(lerp(150,179,cool))},${Math.round(lerp(90,255,cool))})`;
  jug(450,830,1.15,1,t,seg(t,13.4,13.9),wc);
  // hot wind from the right
  const w=seg(t,9.8,10.4)*(1-seg(t,13.2,13.6)*.6);for(let i=0;i<3;i++){const ox=(t*220+i*120)%260;arrow(960-ox,640+i*120,880-ox,640+i*120,HOT,9,w*.9)}
  txt(T('هوا حار وناشف','Hot dry air'),800,560,40,HOT,800,'center',w);
  vapor(450,560,330,t,seg(t,10.0,10.8),16);
  txt(T('بخار','Vapor'),450,420,48,'#DCE6F5',800,'center',seg(t,10.6,11.0));
  // heat flowing out of the water into the evaporating beads
  const hf=seg(t,13.6,14.0)*(1-seg(t,16.6,17.2));if(hf>0){for(let i=0;i<4;i++){const ph=(t*.9+i/4)%1;const an=-.9+i*.6;
    const x1=450+Math.cos(an)*30,y1=900+Math.sin(an)*30,x2=450+Math.cos(an)*175,y2=900+Math.sin(an)*150;
    arrow(lerp(x1,x2,ph*.6),lerp(y1,y2,ph*.6),lerp(x1,x2,ph*.6+.35),lerp(y1,y2,ph*.6+.35),HOT,8,hf*(1-ph))}
    stroked(T('حرارة','Heat'),450,1170,58,HOT,'center',hf,9)}
  thermo(860,1120,700,lerp(.85,.35,cool),cool>.5?COLD:HOT,seg(t,15.4,15.8));
  txt(T('تبرد!','Cooler!'),860,630,48,COLD,900,'center',seg(t,16.4,16.8));
  X.restore();X.restore();
}
function S4(t){ // dry vs humid 17.6–22.8
  const a=sceneAlpha(t,17.6,22.8);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٣ • الجو الناشف أحسن','3 • Dry air works best'),SP,1);
  const d=eo(seg(t,17.8,18.4)),h=eo(seg(t,18.3,18.9)),hl=seg(t,21.3,21.6);
  // dry (right)
  X.save();X.globalAlpha*=d;sun(800,520,44,t);jug(740,880,.72,1,t);vapor(740,700,220,t*1.3,seg(t,19.8,20.4),16);
  thermo(930,1120,760,lerp(.6,.25,seg(t,19.8,21)),COLD,1);txt(T('جو ناشف','Dry air'),740,1210,48,SP,900,'center',1);X.restore();
  // humid (left)
  X.save();X.globalAlpha*=h;
  if(hl>0){X.save();X.globalAlpha*=hl*(.6+.4*Math.sin(t*9));rr(150,450,340,820,40);X.lineWidth=8;X.strokeStyle=WA;X.stroke();X.restore()}
  X.fillStyle='#9fb0c8';[[260,520,60],[320,500,70],[380,525,55]].forEach(c=>{X.beginPath();X.arc(c[0],c[1],c[2],0,7);X.fill()});
  for(let i=0;i<6;i++){const ph=(t*.8+i/6)%1;drop(230+i*28,580+ph*60,.12,'rgba(120,190,255,.8)')}
  jug(320,880,.72,.5,t);vapor(320,700,200,t*.6,.35,4);
  thermo(130,1120,760,.62,HOT,1);txt(T('جو رطب','Humid air'),320,1210,48,WA,900,'center',1);X.restore();
  X.restore();
}
function S5(t){ // sweat 22.8–26.6
  const a=sceneAlpha(t,22.8,26.6);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٤ • نفس فكرة العرق','4 • Same as sweating'),WA,1);
  const ii=back(seg(t,22.9,23.5));sun(820,520,50,t,seg(t,23.0,23.4));
  X.save();X.translate(500,860);X.scale(ii,ii);face(0,0,1.25,seg(t,23.6,25.0),t);X.restore();
  vapor(500,640,260,t,seg(t,24.8,25.4),12);
  const cg=seg(t,25.2,25.8);if(cg>0){glow(500,860,300,'rgba(111,211,255,.35)',cg);txt(T('يبرد!','Cools down!'),500,1150,52,COLD,900,'center',cg)}
  X.restore();
}
function S6(t){ // payoff 26.6–30
  const a=sceneAlpha(t,26.6,31);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('الخلاصة','Summary'),WH,1);
  const r1=back(seg(t,26.7,27.2)),r2=back(seg(t,26.9,27.4));
  if(r1>0){X.save();X.translate(300,800);X.scale(r1,r1);jug(0,0,.8,1,t);X.restore()}
  if(r2>0){X.save();X.translate(790,800);X.scale(r2,r2);face(0,0,.95,1,t);X.restore()}
  stroked('=',545,800,140,WH,'center',seg(t,27.3,27.6),12);
  vapor(300,560,200,t,seg(t,27.2,27.6),8);vapor(790,580,200,t,seg(t,27.4,27.8),8);
  const f=back(seg(t,28.5,28.9));if(f>0){const lab=T('تابع للمزيد','Follow for more');X.save();X.translate(540,1180);X.scale(f,f);X.font='900 44px Cairo';const w=X.measureText(lab).width+90;
    rr(-w/2,-38,w,76,38);X.fillStyle=RED;X.fill();X.restore();txt(lab,540,1182,44,WH,900,'center',f)}
  X.restore();
}
function drawScenes(t){S1(t);S2(t);S3(t);S4(t);S5(t);S6(t)}
function drawCover(){
  bg(3);glow(540,900,700,'rgba(111,211,255,.18)',1);
  jug(540,1000,1.35,1,3);vapor(540,640,380,3,1,16);
  stroked(T('تعرق','It sweats'),540,380,T(160,130),COLD,'center',1,16);
  stroked(T('زيك!','like you!'),540,560,T(160,130),WH,'center',1,16);
}
window.drawScenes=drawScenes;window.drawCover=drawCover;
