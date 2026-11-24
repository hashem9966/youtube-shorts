/* Episode: ليش نشوف سراب في الطريق؟ (inferior mirage, refraction in hot air). Scene functions take DESIGN time t (0..30). */
const SKY1='#5FA8F5',SKY2='#CFE6FF',SAND='#D9B26F',ASP='#2E3440',HOT='#FF6A3D',COOL='#6FB8FF',RAY='#FFE45C';
window.HIGHLIGHT=[['مويه',COOL],['الشمس',SP],['يسخّن',HOT],['تسخّن',HOT],['أحرّ',HOT],['الضوء',RAY],['ينحني',RAY],['السما',SKY1],['مخك',G],['تبعد',RED],
 ['water',COOL],['sun',SP],['asphalt',HOT],['hottest',HOT],['light',RAY],['bends',RAY],['sky',SKY1],['brain',G],['away',RED]];

const WIN=[90,430,900,850]; // x,y,w,h viewing window
function windowClip(fn){X.save();rr(...WIN,40);X.clip();fn();X.restore();X.save();rr(...WIN,40);X.lineWidth=5;X.strokeStyle='rgba(255,255,255,.25)';X.stroke();X.restore()}
function cloud(x,y,s,a=1,flip=false){X.save();X.globalAlpha*=a;X.translate(x,y);X.scale(s,flip?-s:s);X.fillStyle='#FFFFFF';
  [[-60,10,45],[-10,-12,60],[50,8,45],[0,22,40]].forEach(c=>{X.beginPath();X.arc(c[0],c[1],c[2],0,7);X.fill()});X.restore()}
function puddle(x,y,w,h,t,a){if(a<=0)return;X.save();X.globalAlpha*=a;X.beginPath();X.ellipse(x,y,w,h,0,0,7);X.clip();
  const g=X.createLinearGradient(0,y-h,0,y+h);g.addColorStop(0,SKY2);g.addColorStop(1,SKY1);X.fillStyle=g;X.fillRect(x-w,y-h,2*w,2*h);
  X.strokeStyle='rgba(255,255,255,.55)';X.lineWidth=3;for(let i=-2;i<=2;i++){X.beginPath();for(let k=-w;k<=w;k+=8)X.lineTo(x+k,y+i*h*.35+Math.sin(k*.06+t*7+i)*3);X.stroke()}
  X.restore()}
function roadScene(t,pY=900,pA=0,pW=230){ // perspective desert road inside the window
  windowClip(()=>{const [wx,wy,ww,wh]=WIN,hz=wy+300;
    const sg=X.createLinearGradient(0,wy,0,hz);sg.addColorStop(0,SKY1);sg.addColorStop(1,SKY2);X.fillStyle=sg;X.fillRect(wx,wy,ww,hz-wy);
    cloud(260,wy+110,.8);cloud(760,wy+80,.6);
    X.fillStyle=SAND;X.fillRect(wx,hz,ww,wy+wh-hz);
    X.fillStyle=ASP;X.beginPath();X.moveTo(525,hz);X.lineTo(555,hz);X.lineTo(980,wy+wh);X.lineTo(100,wy+wh);X.closePath();X.fill();
    X.fillStyle='#F4F1E6';for(let i=0;i<8;i++){const f=((i/8)+t*.25)%1,f2=f+.05,y1=hz+Math.pow(f,2)*(wh-300),y2=hz+Math.pow(f2,2)*(wh-300);
      const w1=2+f*14,w2=2+f2*14;X.beginPath();X.moveTo(540-w1/2,y1);X.lineTo(540+w1/2,y1);X.lineTo(540+w2/2,y2);X.lineTo(540-w2/2,y2);X.closePath();X.fill()}
    puddle(540,pY,pW*(.5+.5*(pY-hz)/(wh-300)),24*(.5+.5*(pY-hz)/(wh-300)),t,pA);
    // heat shimmer
    X.strokeStyle='rgba(255,255,255,.12)';X.lineWidth=3;for(let i=0;i<4;i++){X.beginPath();for(let x=wx;x<wx+ww;x+=10)X.lineTo(x,hz+20+i*14+Math.sin(x*.05+t*6+i)*4);X.stroke()}
  });
}
function sun(x,y,r,t,a=1){X.save();X.globalAlpha*=a;glow(x,y,r*2.6,'rgba(255,200,60,.55)',1);X.strokeStyle=SP;X.lineWidth=10;X.lineCap='round';
  for(let i=0;i<10;i++){const an=i/10*Math.PI*2+t*.4;X.beginPath();X.moveTo(x+Math.cos(an)*r*1.25,y+Math.sin(an)*r*1.25);X.lineTo(x+Math.cos(an)*r*1.6,y+Math.sin(an)*r*1.6);X.stroke()}
  X.beginPath();X.arc(x,y,r,0,7);X.fillStyle=SP;X.fill();X.restore()}
function layers(a,heat=1){if(a<=0)return;X.save();X.globalAlpha*=a;
  for(let i=0;i<5;i++){const y=1150-(i+1)*110,f=i/4;X.fillStyle=`rgba(${Math.round(lerp(255,111,f))},${Math.round(lerp(106,184,f))},${Math.round(lerp(61,255,f))},${.22*heat})`;X.fillRect(100,y,880,110)}
  X.restore()}
function ground(t,glowA){X.fillStyle=ASP;rr(100,1150,880,90,14);X.fill();if(glowA>0)glow(540,1160,420,'rgba(255,90,40,.55)',glowA);
  X.fillStyle='#F4F1E6';for(let i=0;i<5;i++)X.fillRect(150+i*180,1190,90,10)}
function eye(x,y,s,a=1){X.save();X.globalAlpha*=a;X.translate(x,y);X.scale(s,s);X.beginPath();X.moveTo(-60,0);X.quadraticCurveTo(0,-48,60,0);X.quadraticCurveTo(0,48,-60,0);X.closePath();
  X.fillStyle='#fff';X.fill();X.beginPath();X.arc(0,0,24,0,7);X.fillStyle='#3B7DD8';X.fill();X.beginPath();X.arc(0,0,11,0,7);X.fillStyle='#0b1020';X.fill();X.restore()}
const K=0.00367; const rayY=x=>1110-K*(x-600)*(x-600); // light path: down from the sky, bending back up
function ray(f,a=1,col=RAY){if(a<=0||f<=0)return;X.save();X.globalAlpha*=a;X.strokeStyle=col;X.lineWidth=9;X.lineCap='round';X.beginPath();
  const x0=220,x1=880,xe=lerp(x0,x1,f);for(let x=x0;x<=xe;x+=6)X.lineTo(x,rayY(x));X.stroke();
  const d=-2*K*(xe-600),an=Math.atan2(d,1);X.fillStyle=col;X.beginPath();X.moveTo(xe+Math.cos(an)*14,rayY(xe)+Math.sin(an)*14);
  X.lineTo(xe-Math.cos(an-.5)*34,rayY(xe)-Math.sin(an-.5)*34);X.lineTo(xe-Math.cos(an+.5)*34,rayY(xe)-Math.sin(an+.5)*34);X.closePath();X.fill();X.restore()}
function car(x,y,s){X.save();X.translate(x,y);X.scale(s,s);rr(-120,-70,240,110,26);X.fillStyle='#C0392B';X.fill();rr(-90,-120,180,70,22);X.fillStyle='#A93226';X.fill();
  rr(-75,-110,150,46,14);X.fillStyle='#1d2a44';X.fill();X.fillStyle='#FF4D4D';rr(-110,-40,40,20,8);X.fill();rr(70,-40,40,20,8);X.fill();
  X.fillStyle='#111';rr(-110,40,50,30,8);X.fill();rr(60,40,50,30,8);X.fill();X.fillStyle='#e9eef6';rr(-30,-10,60,20,4);X.fill();X.restore()}

function S1(t){ // hook 0–4.2
  const a=sceneAlpha(t,-1,4.2);X.save();X.globalAlpha=a;
  const ti=eo(seg(t,0,.5));X.save();X.translate(0,lerp(-60,0,ti));X.globalAlpha*=ti;stroked(T('سراب!','Mirage!'),540,340,110,COOL,'center',1,12);X.restore();
  const fade=1-seg(t,2.0,2.6)*.75;roadScene(t,930,seg(t,.4,1.0)*fade);
  const q=back(seg(t,2.9,3.3));if(q>0){X.save();X.translate(540,820);X.scale(q*(1+.06*Math.sin(t*8)),q);stroked('?',0,0,170,SP,'center',1,14);X.restore()}
  const x=seg(t,1.9,2.3);if(x>0){X.save();X.globalAlpha*=x;X.strokeStyle=RED;X.lineWidth=14;X.lineCap='round';X.beginPath();X.moveTo(440,880);X.lineTo(640,980);X.moveTo(640,880);X.lineTo(440,980);X.stroke();X.restore()}
  X.restore();
}
function S2(t){ // hot asphalt 4.2–9.4
  const a=sceneAlpha(t,4.2,9.4);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('١ • الأسفلت يسخن','1 • Hot asphalt'),HOT,1);
  const ii=eo(seg(t,4.2,4.8));sun(820,540,56,t,ii);
  const rays=seg(t,4.4,5.2);if(rays>0){X.save();X.globalAlpha*=rays;X.strokeStyle='rgba(255,228,92,.7)';X.lineWidth=6;X.setLineDash([18,14]);X.lineDashOffset=-t*60;
    [[760,600,300,1140],[790,610,540,1140],[830,620,780,1140]].forEach(l=>{X.beginPath();X.moveTo(l[0],l[1]);X.lineTo(l[2],l[3]);X.stroke()});X.setLineDash([]);X.restore()}
  layers(seg(t,7.6,8.6));ground(t,seg(t,5.0,6.0));
  const hw=seg(t,6.0,6.5);if(hw>0){for(let i=0;i<5;i++){const ph=(t*.7+i/5)%1;X.save();X.globalAlpha*=hw*(1-ph);X.strokeStyle=HOT;X.lineWidth=7;X.lineCap='round';X.beginPath();
    const bx=200+i*170,by=1130-ph*380;for(let k=0;k<60;k+=4)X.lineTo(bx+Math.sin(k*.15+t*5)*12,by-k);X.stroke();X.restore()}}
  txt(T('حار','Hot'),170,1095,44,HOT,900,'center',seg(t,8.0,8.4));txt(T('أبرد','Cooler'),170,655,44,COOL,900,'center',seg(t,8.2,8.6));
  txt(T('أسفلت','Asphalt'),540,1195,40,WH,800,'center',seg(t,4.8,5.2));
  X.restore();
}
function S3(t){ // light bends 9.4–16.4
  const a=sceneAlpha(t,9.4,16.4);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٢ • الضوء ينحني','2 • Light bends'),RAY,1);
  layers(1);ground(t,.6);cloud(220,520,.9,seg(t,9.5,10));eye(890,rayY(880)-5,1.1,seg(t,9.6,10.1));
  const sp=seg(t,9.7,10.2)*(1-seg(t,11.2,11.6));if(sp>0){arrow(560,1095,840,1095,HOT,9,sp);txt(T('أسرع','Faster'),700,1050,40,HOT,900,'center',sp);
    arrow(560,655,700,655,COOL,9,sp);txt(T('أبطأ','Slower'),630,610,40,COOL,900,'center',sp)}
  ray(eio(seg(t,11.4,14.8)),1);
  const lab=seg(t,13.2,13.6);txt(T('ضوء السما','Sky light'),330,470,40,RAY,800,'left',lab);
  X.restore();
}
function S4(t){ // brain fooled 16.4–22.4
  const a=sceneAlpha(t,16.4,22.4);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٣ • مخك ينخدع','3 • Your brain is fooled'),G,1);
  layers(1);ground(t,.6);cloud(220,520,.9);eye(890,rayY(880)-5,1.1);ray(1,.55);
  const dl=seg(t,16.6,18.2);if(dl>0){const ex=880,ey=rayY(880),d=-2*K*(ex-600),len=Math.hypot(1,d),ux=-1/len,uy=-d/len,L=(1150-ey)/uy;
    X.save();X.strokeStyle=WH;X.lineWidth=6;X.setLineDash([16,12]);X.beginPath();X.moveTo(ex,ey);X.lineTo(ex+ux*L*dl,ey+uy*L*dl);X.stroke();X.setLineDash([]);X.restore();
    const im=seg(t,18.4,19.0);if(im>0){const px=ex+ux*L,py=1150;puddle(px,py-6,150,34,t,im);cloud(px,py-6,.38,im,true);
      txt(T('بركة مويه؟','A puddle?'),px,1290,46,COOL,900,'center',seg(t,20.4,20.8))}}
  txt(T('اللي يحسبه مخك','What your brain assumes'),640,760,36,WH,700,'center',seg(t,16.8,17.2)*(1-seg(t,19.6,20)));
  X.restore();
}
function S5(t){ // runs away 22.4–26.6
  const a=sceneAlpha(t,22.4,26.6);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٤ • ليش تهرب؟','4 • Why it runs away'),RED,1);
  const p=eio(seg(t,22.6,26.4));roadScene(t*2,lerp(1000,790,p),1,lerp(260,200,p));
  car(540,lerp(1215,1150,p),lerp(1.0,.82,p));
  const ar=seg(t,23.0,23.4);if(ar>0)arrow(820,lerp(1000,790,p)+10,820,lerp(1000,790,p)-80,RED,9,ar);
  X.restore();
}
function S6(t){ // payoff 26.6–30
  const a=sceneAlpha(t,26.6,31);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('الخلاصة','Summary'),WH,1);
  const r1=back(seg(t,26.7,27.2)),r2=back(seg(t,27.0,27.5));
  if(r1>0){X.save();X.translate(290,800);X.scale(r1,r1);puddle(0,0,190,70,t,1);cloud(0,0,.6,1,true);X.restore();txt(T('مو مويه','Not water'),290,940,48,COOL,900,'center',r1)}
  stroked('=',545,800,140,WH,'center',seg(t,27.3,27.6),12);
  if(r2>0){X.save();X.translate(790,800);X.scale(r2,r2);rr(-170,-110,340,220,30);const g=X.createLinearGradient(0,-110,0,110);g.addColorStop(0,SKY1);g.addColorStop(1,SKY2);X.fillStyle=g;X.fill();cloud(0,0,.7);X.restore();
    txt(T('صورة السما','The sky'),790,970,48,SKY1,900,'center',r2)}
  const f=back(seg(t,28.5,28.9));if(f>0){const lab=T('تابع للمزيد','Follow for more');X.save();X.translate(540,1180);X.scale(f,f);X.font='900 44px Cairo';const w=X.measureText(lab).width+90;
    rr(-w/2,-38,w,76,38);X.fillStyle=RED;X.fill();X.restore();txt(lab,540,1182,44,WH,900,'center',f)}
  X.restore();
}
function drawScenes(t){S1(t);S2(t);S3(t);S4(t);S5(t);S6(t)}
function drawCover(){bg(3);roadScene(1.3,950,1,300);stroked(T('مو مويه!','Not water!'),540,330,T(150,130),COOL,'center',1,16);
  const x0=430,y0=900;X.save();X.strokeStyle=RED;X.lineWidth=16;X.lineCap='round';X.beginPath();X.moveTo(x0,y0);X.lineTo(x0+220,y0+110);X.moveTo(x0+220,y0);X.lineTo(x0,y0+110);X.stroke();X.restore()}
window.drawScenes=drawScenes;window.drawCover=drawCover;
