/* Episode: لماذا نرى البرق قبل الرعد؟ (light vs sound speed; count seconds ÷ 3 = km). Scene functions take DESIGN time t (0..30). */
const LIT='#FFE45C',SND='#7FB2FF',CLOUD='#5B6478',CLOUD2='#8C95AA',GRASS='#2F6B4F',NIGHT='rgba(30,20,70,.35)';
window.HIGHLIGHT=[['البرق',LIT],['الضوء',LIT],['لحظة',LIT],['الرعد',SND],['الصوت',SND],['ببطء',SND],['كيلومتر',G],['كيلومترات',G],['ثلاثة',G],['ثلاث',G],['٣',G],['٩',G],['الثواني',G],['اقتربت',RED],['يتأخر',SND],
 ['lightning',LIT],['light',LIT],['flash',LIT],['instantly',LIT],['thunder',SND],['sound',SND],['strolls',SND],['km',G],['3',G],['9',G],['three',G],['seconds',G],['closer',RED],['late',SND]];

function cloud(x,y,s,a=1){if(a<=0)return;X.save();X.globalAlpha*=a;X.translate(x,y);X.scale(s,s);
  [[-110,10,70],[-40,-30,90],[50,-20,80],[120,15,60],[0,25,80]].forEach((c,i)=>{X.beginPath();X.arc(c[0],c[1],c[2],0,7);X.fillStyle=i%2?CLOUD:CLOUD2;X.fill()});X.restore()}
function zap(x0,y0,x1,y1,seed,a=1,w=10){if(a<=0)return;X.save();X.globalAlpha*=a;glow(x1,y1,120,'rgba(255,228,92,.6)',1);X.strokeStyle=LIT;X.lineWidth=w;X.lineJoin='round';X.lineCap='round';X.beginPath();X.moveTo(x0,y0);
  const n=7;for(let i=1;i<=n;i++){const f=i/n;X.lineTo(lerp(x0,x1,f)+(i<n?(rnd(seed+i)-.5)*90:0),lerp(y0,y1,f))}X.stroke();X.strokeStyle='#FFFFFF';X.lineWidth=w*.35;X.stroke();X.restore()}
function rings(x,y,r,a=1,n=3,gap=50){for(let i=0;i<n;i++){const rr2=r-i*gap;if(rr2<=0)continue;X.save();X.globalAlpha*=a*(1-i/n);X.strokeStyle=SND;X.lineWidth=7;X.beginPath();X.arc(x,y,rr2,0,7);X.stroke();X.restore()}}
function person(x,y,s,a=1){if(a<=0)return;X.save();X.globalAlpha*=a;X.translate(x,y);X.scale(s,s);X.fillStyle=WH;X.beginPath();X.arc(0,-70,24,0,7);X.fill();rr(-22,-42,44,70,18);X.fill();
  rr(-20,24,14,46,7);X.fill();rr(6,24,14,46,7);X.fill();X.restore()}
function eyeIcon(x,y,s,a=1){if(a<=0)return;X.save();X.globalAlpha*=a;X.translate(x,y);X.scale(s,s);X.beginPath();X.moveTo(-50,0);X.quadraticCurveTo(0,-40,50,0);X.quadraticCurveTo(0,40,-50,0);X.closePath();X.fillStyle=WH;X.fill();
  X.beginPath();X.arc(0,0,18,0,7);X.fillStyle='#3B7DD8';X.fill();X.beginPath();X.arc(0,0,8,0,7);X.fillStyle='#0b1020';X.fill();X.restore()}
function earIcon(x,y,s,a=1){if(a<=0)return;X.save();X.globalAlpha*=a;X.translate(x,y);X.scale(s,s);X.fillStyle=WH;X.beginPath();X.moveTo(-40,-14);X.lineTo(-20,-14);X.lineTo(4,-36);X.lineTo(4,36);X.lineTo(-20,14);X.lineTo(-40,14);X.closePath();X.fill();
  X.strokeStyle=SND;X.lineWidth=8;X.lineCap='round';[20,36].forEach(r=>{X.beginPath();X.arc(8,0,r,-.8,.8);X.stroke()});X.restore()}
function stopwatch(x,y,r,sec,a=1,col=G){if(a<=0)return;X.save();X.globalAlpha*=a;X.translate(x,y);rr(-22,-r-46,44,30,8);X.fillStyle=WH;X.fill();
  X.beginPath();X.arc(0,0,r,0,7);X.fillStyle='rgba(255,255,255,.08)';X.fill();X.lineWidth=12;X.strokeStyle=WH;X.stroke();
  X.beginPath();X.arc(0,0,r-18,-Math.PI/2,-Math.PI/2+Math.PI*2*((sec%10)/10));X.strokeStyle=col;X.lineWidth=18;X.stroke();
  const an=-Math.PI/2+Math.PI*2*(sec/10);X.strokeStyle=RED;X.lineWidth=8;X.lineCap='round';X.beginPath();X.moveTo(0,0);X.lineTo(Math.cos(an)*(r-34),Math.sin(an)*(r-34));X.stroke();X.restore()}
function ground(y,a=1){X.save();X.globalAlpha*=a;rr(100,y,880,60,16);X.fillStyle=GRASS;X.fill();X.restore()}
function flash(t,t0,a=1){const f=Math.max(0,1-Math.abs(t-t0)/.18);if(f>0){X.save();X.globalAlpha=f*.35*a;X.fillStyle='#FFFBE0';X.fillRect(0,0,W,H);X.restore()}}

function S1(t){ // hook 0–4.2
  const a=sceneAlpha(t,-1,4.2);if(a<=0)return;X.save();X.globalAlpha=a;
  X.save();X.fillStyle=NIGHT;X.fillRect(90,280,900,1020);X.restore();
  cloud(330,520,1.1,eo(seg(t,0,.4)));
  const z=seg(t,.25,.35)*(1-seg(t,1.0,1.4));zap(300,580,260,1130,3,z,14);flash(t,.3,a);
  ground(1140,1);person(800,1110,1.2,1);
  eyeIcon(800,930,1,seg(t,.4,.7));
  const ra=seg(t,1.5,1.6);if(ra>0){X.save();X.beginPath();X.rect(90,280,900,1020);X.clip();rings(260,1120,lerp(40,520,eo(seg(t,1.5,2.9))),ra*(1-seg(t,3.6,4.0)),3,60);X.restore();earIcon(870,960,1,seg(t,1.9,2.2))}
  const tl=seg(t,.4,.8);stroked(T('١','1'),720,930,64,LIT,'center',tl,8);stroked(T('٢','2'),930,960,64,SND,'center',seg(t,1.9,2.2),8);
  const q=back(seg(t,2.9,3.3));if(q>0){X.save();X.translate(560,420);X.scale(q*(1+.06*Math.sin(t*8)),q);stroked('?',0,0,170,SP,'center',1,14);X.restore()}
  X.restore();
}
function S2(t){ // both at once, two speeds 4.2–9.6
  const a=sceneAlpha(t,4.2,9.6);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('١ • حدث واحد… رسولان','1 • One event, two messengers'),LIT,1);
  cloud(300,520,.9,1);const z=seg(t,4.4,4.5)*(1-seg(t,5.4,5.8));zap(280,570,250,900,8,z,12);flash(t,4.5,a);
  const p=seg(t,6.0,7.6);
  if(p>0){// light line races right instantly, sound crawls
    const lx=lerp(250,900,eo(seg(t,6.0,6.15)));X.save();X.strokeStyle=LIT;X.lineWidth=10;X.lineCap='round';X.beginPath();X.moveTo(250,900);X.lineTo(lx,900);X.stroke();X.restore();
    txt(T('ضوء','Light'),900,850,46,LIT,900,'center',seg(t,6.1,6.3));
    rings(250,900,lerp(30,180,seg(t,6.0,9.6)),1,3,45);txt(T('صوت','Sound'),250,1110,46,SND,900,'center',seg(t,6.4,6.8))}
  const ba=seg(t,7.8,8.2);if(ba>0){X.save();X.globalAlpha*=ba;rr(130,1170,820,40,20);X.fillStyle='rgba(255,255,255,.08)';X.fill();rr(130,1170,820*eo(seg(t,7.9,8.2)),40,20);X.fillStyle=LIT;X.fill();
    rr(130,1225,lerp(0,12,seg(t,8.0,9.0)),40,12);X.fillStyle=SND;X.fill();X.restore();
    txt(T('الضوء','Light'),T(890,190),1145,34,LIT,900,'center',ba);txt(T('الصوت','Sound'),T(890,190),1290,34,SND,900,'center',ba)}
  X.restore();
}
function S3(t){ // race: light instant, sound 1 km / 3 s 9.6–16.6
  const a=sceneAlpha(t,9.6,16.6);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٢ • السباق','2 • The race'),SND,1);
  const x0=150,x1=930,km=k=>lerp(x0,x1,k/3);
  X.save();X.strokeStyle='rgba(255,255,255,.35)';X.lineWidth=4;[[600],[900]].forEach(y=>{X.beginPath();X.moveTo(x0,y[0]);X.lineTo(x1,y[0]);X.stroke()});X.restore();
  for(let k=0;k<=3;k++){X.save();X.fillStyle='rgba(255,255,255,.5)';X.fillRect(km(k)-2,560,4,380);X.restore();txt(T(AR(k)+' كم',k+' km'),km(k),985,36,MU,800,'center',1)}
  // light lane
  const lf=eo(seg(t,9.9,10.1));zap(x0,520,x0,600,11,1-seg(t,10.6,11),6);X.save();X.strokeStyle=LIT;X.lineWidth=14;X.lineCap='round';X.beginPath();X.moveTo(x0,600);X.lineTo(lerp(x0,x1,lf),600);X.stroke();X.restore();
  txt(T('ضوء: لحظة','Light: instant'),540,530,44,LIT,900,'center',seg(t,10.0,10.3));
  // sound lane: 1 km every 3 s (scene clock)
  const sec=lerp(0,9,seg(t,11.6,16.4)),sx=km(Math.min(3,sec/3));X.save();X.translate(sx,900);rings(0,0,40+10*Math.sin(t*6),1,2,24);X.restore();
  txt(T('صوت','Sound'),sx,820,40,SND,900,'center',seg(t,11.6,12.0));
  const lb=seg(t,13.4,13.8);if(lb>0){stroked(T('١ كم = ٣ ثوانٍ','1 km = 3 seconds'),540,1110,62,G,'center',lb,10)}
  stopwatch(540,1240,0,0,0);txt(T(AR(Math.floor(sec))+' ث',Math.floor(sec)+' s'),830,1110,48,WH,900,'center',seg(t,11.6,12)*(1-lb));
  X.restore();
}
function S4(t){ // trick: count, ÷3, km 16.6–22.6
  const a=sceneAlpha(t,16.6,22.6);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٣ • الحيلة','3 • The trick'),G,1);
  const cz=seg(t,16.8,17.0)*(1-seg(t,17.6,18.0));zap(T(330,800),330,T(290,760),620,21,cz,10);flash(t,16.9,a);
  const sec=Math.min(9,lerp(0,9,seg(t,18.2,20.0)));const SW=T(750,330),OP=T(330,750);stopwatch(SW,780,190,sec,eo(seg(t,16.8,17.3)));
  stroked(T(AR(Math.round(sec)),String(Math.round(sec))),SW,790,110,WH,'center',seg(t,18.2,18.4),10);txt(T('ثوانٍ','seconds'),SW,1010,44,G,900,'center',seg(t,18.2,18.6));
  const dv=back(seg(t,20.0,20.4));if(dv>0){X.save();X.translate(OP,700);X.scale(dv,dv);stroked('÷',T(70,-50),0,110,G,'center',1,10);stroked(T('٣','3'),T(-40,50),0,110,G,'center',1,10);X.restore()}
  const eq=back(seg(t,21.2,21.6));if(eq>0){X.save();X.translate(OP,900);X.scale(eq,eq);stroked('=',T(130,-130),0,96,WH,'center',1,10);stroked(T('٣ كم','3 km'),T(-40,40),0,96,WH,'center',1,10);X.restore()}
  X.restore();
}
function S5(t){ // storm approaching 22.6–26.8
  const a=sceneAlpha(t,22.6,26.8);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٤ • العاصفة تقترب','4 • The storm moves in'),RED,1);
  ground(1140,1);person(880,1110,1.1,1);
  const p=eio(seg(t,24.8,26.6)),cx=lerp(260,620,p);cloud(cx,560,1,1);
  const z1=seg(t,23.0,23.1)*(1-seg(t,23.6,24.0)),z2=seg(t,25.6,25.7)*(1-seg(t,26.2,26.6));zap(cx,610,cx-20,1130,30,Math.max(z1,z2),12);flash(t,23.0,a);flash(t,25.6,a);
  // distance bar
  const dx0=cx,dx1=880;X.save();X.strokeStyle=WH;X.lineWidth=4;X.setLineDash([12,10]);X.beginPath();X.moveTo(dx0,1225);X.lineTo(dx1,1225);X.stroke();X.setLineDash([]);X.restore();
  const s=Math.round(lerp(9,3,p)),k=Math.round(lerp(3,1,p)),la=seg(t,23.0,23.4);
  stroked(T('على بُعد '+AR(k)+' كم',k+' km away'),(dx0+dx1)/2,1268,48,p>.5?RED:G,'center',la,9);
  stopwatch(880,880,62,s,la,p>.5?RED:G);stroked(T(AR(s),String(s)),880,884,54,WH,'center',la,8);
  const ar=seg(t,25.0,25.4)*(1-seg(t,26.4,26.8));if(ar>0)arrow(cx+120,450,cx+260,450,RED,9,ar);
  X.restore();
}
function S6(t){ // payoff 26.8–30
  const a=sceneAlpha(t,26.8,31);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('الخلاصة','Summary'),WH,1);
  const r1=back(seg(t,26.9,27.4)),r2=back(seg(t,27.3,27.8));
  if(r1>0){X.save();X.translate(290,780);X.scale(r1,r1);eyeIcon(0,0,1.6,1);X.restore();txt(T('يصل فورًا','Arrives instantly'),290,940,44,LIT,900,'center',r1)}
  stroked('>',545,790,140,WH,'center',seg(t,27.5,27.8),12);
  if(r2>0){X.save();X.translate(790,780);X.scale(r2,r2);earIcon(0,0,2.2,1);X.restore();txt(T('١ كم / ٣ ث','1 km / 3 s'),790,940,44,SND,900,'center',r2)}
  const f=back(seg(t,28.5,28.9));if(f>0){const lab=T('تابع للمزيد','Follow for more');X.save();X.translate(540,1180);X.scale(f,f);X.font='900 44px Cairo';const w=X.measureText(lab).width+90;
    rr(-w/2,-38,w,76,38);X.fillStyle=RED;X.fill();X.restore();txt(lab,540,1182,44,WH,900,'center',f)}
  X.restore();
}
function drawScenes(t){S1(t);S2(t);S3(t);S4(t);S5(t);S6(t)}
function drawCover(){bg(3);X.save();X.fillStyle=NIGHT;X.fillRect(90,280,900,1020);X.restore();cloud(330,600,1.2,1);zap(310,660,270,1180,3,1,16);
  stopwatch(760,900,170,6,1);stroked(T('٣','3'),760,910,110,WH,'center',1,10);
  stroked(T('احسب المسافة!','Count the seconds!'),540,360,T(110,96),LIT,'center',1,16)}
window.drawScenes=drawScenes;window.drawCover=drawCover;
