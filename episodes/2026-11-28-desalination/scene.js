/* Episode: كيف يصير ماء البحر صالحًا للشرب؟ (desalination: distillation and reverse osmosis). Scene functions take DESIGN time t (0..30). */
const SEA='#1F78C8',SEA2='#0E4C8A',FRESH='#7FD4FF',SALT='#F4F7FB',SALTC='#FFB020',STEAM='rgba(200,230,255,.85)',MEM='#22C3A6',FACT='#3A4A66';
window.HIGHLIGHT=[['بحر',SEA],['البحر',SEA],['بالملح',SALTC],['الملح',SALTC],['عذبًا',FRESH],['الماء',FRESH],['يتبخر',STEAM],['نغلي',FL],['السعودية',D],['التناضح',MEM],['غشاء',MEM],['الطاقة',G],['أشهر',D],
 ['seawater',SEA],['sea',SEA],['salt',SALTC],['fresh',FRESH],['water',FRESH],['evaporates',FRESH],['boil',FL],['Saudi',D],['osmosis',MEM],['membrane',MEM],['energy',G],['common',D]];

function waves(x,y,w,h,t,a=1,c1=SEA,c2=SEA2){if(a<=0)return;X.save();X.globalAlpha*=a;const g=X.createLinearGradient(0,y,0,y+h);g.addColorStop(0,c1);g.addColorStop(1,c2);X.fillStyle=g;
  X.beginPath();X.moveTo(x,y+h);for(let k=0;k<=w;k+=10)X.lineTo(x+k,y+Math.sin(k*.025+t*2.4)*14);X.lineTo(x+w,y+h);X.closePath();X.fill();X.restore()}
function crystal(x,y,s,a=1,rot=0){if(a<=0)return;X.save();X.globalAlpha*=a;X.translate(x,y);X.rotate(rot);rr(-s/2,-s/2,s,s,s*.15);X.fillStyle=SALT;X.fill();X.strokeStyle=SALTC;X.lineWidth=3;X.stroke();X.restore()}
function cup(x,y,s,t,a=1,lvl=.65,salty=0){if(a<=0)return;X.save();X.globalAlpha*=a;X.translate(x,y);X.scale(s,s);
  X.save();X.beginPath();X.moveTo(-110,-150);X.lineTo(110,-150);X.lineTo(85,150);X.lineTo(-85,150);X.closePath();X.clip();
  const wy=150-300*lvl;X.fillStyle=FRESH;X.globalAlpha*=.8;X.beginPath();X.moveTo(-120,160);for(let k=-120;k<=120;k+=8)X.lineTo(k,wy+Math.sin(k*.05+t*3)*5);X.lineTo(120,160);X.closePath();X.fill();X.restore();
  for(let i=0;i<8;i++)crystal(-60+rnd(i+3)*120,wy+30+rnd(i+7)*(140-wy*.2),16,salty);
  X.beginPath();X.moveTo(-110,-150);X.lineTo(-85,150);X.lineTo(85,150);X.lineTo(110,-150);X.strokeStyle='rgba(220,240,255,.85)';X.lineWidth=7;X.stroke();X.restore()}
function plant(x,y,s,t,a=1){if(a<=0)return;X.save();X.globalAlpha*=a;X.translate(x,y);X.scale(s,s);X.fillStyle=FACT;rr(-170,-60,340,160,20);X.fill();rr(-130,-170,70,120,12);X.fill();rr(40,-140,60,90,12);X.fill();
  X.fillStyle=MEM;for(let i=0;i<4;i++){rr(-140+i*80,0,50,50,8);X.fill()}X.restore();
  for(let i=0;i<3;i++){const ph=(t*.5+i/3)%1;X.save();X.globalAlpha*=a*(1-ph);X.fillStyle='rgba(220,230,245,.7)';X.beginPath();X.arc(x-95*s+Math.sin(ph*6)*10,y-190*s-ph*120,22+ph*30,0,7);X.fill();X.restore()}}
function pot(x,y,t,a=1,boil=0){if(a<=0)return;X.save();X.globalAlpha*=a;flames(x,y+175,300,t,1);rr(x-190,y-80,380,240,30);X.fillStyle='#55607A';X.fill();
  X.save();rr(x-180,y-70,360,220,26);X.clip();waves(x-180,y-20+Math.sin(t*9)*boil*4,360,200,t*(1+boil*2),1);X.restore();
  rr(x-205,y-96,410,26,13);X.fillStyle='#6C7894';X.fill();X.restore()}
function bubbleUp(x,y,t,a,n=12,col=STEAM,rise=380,spread=150,seed=0){if(a<=0)return;for(let i=0;i<n;i++){const ph=(t*.55+i/n)%1;X.save();X.globalAlpha*=a*(1-ph*.7);X.fillStyle=col;X.beginPath();
  X.arc(x+(rnd(i+seed)-.5)*spread*2+Math.sin(ph*7+i)*14,y-ph*rise,8+rnd(i+seed+4)*8,0,7);X.fill();X.restore()}}
function waterMol(x,y,s=1,a=1){if(a<=0)return;X.save();X.globalAlpha*=a;X.translate(x,y);X.scale(s,s);X.fillStyle=FRESH;X.beginPath();X.arc(0,0,13,0,7);X.fill();X.fillStyle=WH;X.beginPath();X.arc(-11,-9,6,0,7);X.arc(11,-9,6,0,7);X.fill();X.restore()}
function saltIon(x,y,s=1,a=1){if(a<=0)return;X.save();X.globalAlpha*=a;X.beginPath();X.arc(x,y,24*s,0,7);X.fillStyle=SALTC;X.fill();X.fillStyle='#0b1020';X.font=`900 ${24*s}px Cairo`;X.textAlign='center';X.textBaseline='middle';X.fillText('+',x,y+1);X.restore()}

function S1(t){ // hook 0–4.2
  const a=sceneAlpha(t,-1,4.2);if(a<=0)return;X.save();X.globalAlpha=a;
  const ti=eo(seg(t,0,.5));X.save();X.translate(0,lerp(-60,0,ti));X.globalAlpha*=ti;stroked(T('ماء بحر؟','Seawater?'),540,340,110,SEA,'center',1,12);X.restore();
  waves(100,1020,880,260,t,eo(seg(t,0,.5)));
  const lift=eo(seg(t,.3,1.4));cup(540,lerp(1150,720,lift),1.25,t,lift,.65,1-seg(t,1.8,2.6));
  const sb=seg(t,1.8,2.6);if(sb>0&&sb<1)for(let i=0;i<8;i++){X.save();X.globalAlpha*=1-sb;crystal(540+(rnd(i)-.5)*320*sb,720+(rnd(i+2)-.5)*260*sb,18,1,sb*4);X.restore()}
  const q=back(seg(t,2.9,3.3));if(q>0){X.save();X.translate(860,640);X.scale(q*(1+.06*Math.sin(t*8)),q);stroked('?',0,0,170,SP,'center',1,14);X.restore()}
  X.restore();
}
function S2(t){ // Saudi #1, two methods 4.2–9.6
  const a=sceneAlpha(t,4.2,9.6);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('١ • طريقتان','1 • Two methods'),D,1);
  waves(100,1110,880,180,t,1);plant(540,800,1.2,t,eo(seg(t,4.4,4.9)));
  const m=back(seg(t,4.6,5.0))*(1-seg(t,6.0,6.3));if(m>0){X.save();X.translate(840,560);X.scale(m,m);X.beginPath();X.arc(0,0,72,0,7);X.fillStyle=G;X.fill();X.restore();stroked(T('١','#1'),840,564,70,'#0b1020','center',m,0)}
  txt(T('الأكبر في العالم','World\'s #1 producer'),840,680,42,D,900,'center',seg(t,5.0,5.4)*(1-seg(t,6.2,6.5)));
  const sp=seg(t,6.2,6.6);if(sp>0){arrow(470,640,260,520,FL,10,sp);arrow(610,640,820,520,MEM,10,sp);
    txt(T('١ • الغلي','1 • Boiling'),230,470,44,FL,900,'center',sp);txt(T('٢ • الغشاء','2 • Membrane'),850,470,44,MEM,900,'center',sp)}
  const hb=seg(t,7.6,8.0);if(hb>0){glow(230,470,160,'rgba(255,106,31,.5)',hb*(.6+.3*Math.sin(t*6)))}
  X.restore();
}
function S3(t){ // distillation 9.6–15.0
  const a=sceneAlpha(t,9.6,15.0);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٢ • الغلي والتبخير','2 • Boil and evaporate'),FL,1);
  pot(330,1000,t,1,1);
  bubbleUp(330,900,t,seg(t,9.8,10.3),14,STEAM,360,120);
  const sa=seg(t,11.4,11.8);for(let i=0;i<9;i++)crystal(220+rnd(i+30)*220,1110+rnd(i+40)*30,20,sa,rnd(i)*.6);
  if(sa>0)txt(T('ملح','Salt'),330,1240,40,SALTC,900,'center',sa);
  // condenser tube from top of steam to the cup
  const ca=seg(t,13.0,13.4);if(ca>0){X.save();X.globalAlpha*=ca;X.strokeStyle='#9FB0C8';X.lineWidth=28;X.lineCap='round';X.beginPath();X.moveTo(330,500);X.lineTo(760,500);X.lineTo(760,700);X.stroke();
    X.strokeStyle=FRESH;X.lineWidth=10;X.setLineDash([16,18]);X.lineDashOffset=-t*80;X.stroke();X.setLineDash([]);X.restore();
    txt(T('تبريد','Cooling'),560,450,40,FRESH,900,'center',ca);
    for(let i=0;i<3;i++){const ph=(t*1.2+i/3)%1;X.save();X.globalAlpha*=ca;X.beginPath();X.arc(760,720+ph*120,10,0,7);X.fillStyle=FRESH;X.fill();X.restore()}}
  cup(760,1030,.95,t,seg(t,13.0,13.4),lerp(.05,.6,eio(seg(t,13.4,14.8))),0);
  txt(T('ماء عذب','Fresh water'),760,1220,42,FRESH,900,'center',seg(t,14.0,14.4));
  X.restore();
}
function S4(t){ // reverse osmosis 15.0–22.6
  const a=sceneAlpha(t,15.0,22.6);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٣ • التناضح العكسي','3 • Reverse osmosis'),MEM,1);
  const L=120,R=960,MX=540,TOP=460,BOT=1240;
  X.save();rr(L,TOP,R-L,BOT-TOP,30);X.fillStyle='rgba(31,120,200,.16)';X.fill();X.restore();
  X.save();X.beginPath();X.rect(L,TOP,MX-L,BOT-TOP);X.clip();waves(L,TOP+40,MX-L,BOT-TOP,t,.35);X.restore();
  // piston
  const pp=seg(t,17.0,17.4),push=pp*(20+16*Math.sin(t*5));X.save();X.fillStyle='#8C95AA';rr(L+10+push,TOP+30,30,BOT-TOP-60,12);X.fill();rr(L-40+push,(TOP+BOT)/2-20,60,40,10);X.fill();X.restore();
  if(pp>0){[0,1,2].forEach(i=>arrow(L+70+push,640+i*220,L+170+push,640+i*220,G,9,pp))}
  // membrane with holes
  const ma=seg(t,18.6,19.0);X.save();X.globalAlpha*=Math.max(.35,ma);X.strokeStyle=MEM;X.lineWidth=14;X.setLineDash([60,22]);X.beginPath();X.moveTo(MX,TOP+10);X.lineTo(MX,BOT-10);X.stroke();X.setLineDash([]);X.restore();
  txt(T('غشاء','Membrane'),MX,TOP-30+0,40,MEM,900,'center',ma);
  // molecules
  const flow=seg(t,20.6,21.0);
  for(let i=0;i<14;i++){const ph=(t*.25+i/14)%1,y=TOP+60+rnd(i+50)*(BOT-TOP-120);
    const x=flow>0?lerp(L+200,R-60,ph):L+200+rnd(i+60)*260+Math.sin(t*3+i)*12;waterMol(x,y,1.1,1)}
  for(let i=0;i<8;i++){const y=TOP+90+rnd(i+70)*(BOT-TOP-180);const bx=L+210+rnd(i+80)*230;const hit=flow>0?(Math.sin(t*4+i)*.5+.5):0;saltIon(Math.min(MX-34,bx+hit*90),y,1,1)}
  txt(T('ماء البحر','Seawater'),330,BOT+40,40,SEA,900,'center',1);txt(T('ماء عذب','Fresh water'),750,BOT+40,40,FRESH,900,'center',seg(t,20.8,21.2));
  X.restore();
}
function S5(t){ // most common, saves energy 22.6–26.8
  const a=sceneAlpha(t,22.6,26.8);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٤ • الأشهر اليوم','4 • Most used today'),G,1);
  const r1=seg(t,22.8,23.2),r2=seg(t,23.0,23.4);
  flames(260,760,160,t,r1);txt(T('الغلي','Boiling'),260,820,44,FL,900,'center',r1);
  X.save();X.globalAlpha*=r2;X.strokeStyle=MEM;X.lineWidth=12;X.setLineDash([40,16]);X.beginPath();X.moveTo(260,980);X.lineTo(260,1100);X.stroke();X.setLineDash([]);X.restore();
  txt(T('الغشاء','Membrane'),260,1160,44,MEM,900,'center',r2);
  const e=eio(seg(t,24.6,25.8));
  [[700,FL,1],[1050,MEM,.35]].forEach((b,i)=>{const y=i?1000:690;X.save();X.globalAlpha*=r1;rr(430,y,500,70,35);X.fillStyle='rgba(255,255,255,.08)';X.fill();rr(430,y,500*b[2]*e,70,35);X.fillStyle=b[1];X.fill();X.restore();
    bolt(400,y+35,.6,G,e)});
  const lb=back(seg(t,25.8,26.2));if(lb>0){X.save();X.translate(680,1210);X.scale(lb,lb);stroked(T('طاقة أقل!','Less energy!'),0,0,64,G,'center',1,10);X.restore()}
  X.restore();
}
function S6(t){ // payoff 26.8–30
  const a=sceneAlpha(t,26.8,31);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('الخلاصة','Summary'),WH,1);
  const r1=back(seg(t,26.9,27.4));if(r1>0){X.save();X.translate(290,800);X.scale(r1,r1);X.beginPath();X.arc(0,0,150,0,7);X.clip();waves(-150,-40,300,200,t,1);X.restore();
    X.save();X.translate(290,800);X.scale(r1,r1);X.beginPath();X.arc(0,0,150,0,7);X.strokeStyle=WH;X.lineWidth=6;X.stroke();X.restore();txt(T('ماء البحر','Seawater'),290,1000,46,SEA,900,'center',r1)}
  arrow(450,800,610,800,WH,10,seg(t,27.3,27.6));
  const r2=back(seg(t,27.5,28.0));if(r2>0){X.save();X.translate(790,800);X.scale(r2,r2);cup(0,0,.9,t,1,.6,0);X.restore();txt(T('ماء كأسك','Your glass'),790,1000,46,FRESH,900,'center',r2)}
  const f=back(seg(t,28.5,28.9));if(f>0){const lab=T('تابع للمزيد','Follow for more');X.save();X.translate(540,1180);X.scale(f,f);X.font='900 44px Cairo';const w=X.measureText(lab).width+90;
    rr(-w/2,-38,w,76,38);X.fillStyle=RED;X.fill();X.restore();txt(lab,540,1182,44,WH,900,'center',f)}
  X.restore();
}
function drawScenes(t){S1(t);S2(t);S3(t);S4(t);S5(t);S6(t)}
function drawCover(){bg(3);waves(100,1020,880,260,3,1);cup(540,760,1.4,3,1,.65,0);
  stroked(T('من البحر؟','From the sea?'),540,350,T(120,110),SEA,'center',1,16)}
window.drawScenes=drawScenes;window.drawCover=drawCover;
