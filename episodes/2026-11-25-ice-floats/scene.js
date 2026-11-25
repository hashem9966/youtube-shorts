/* Episode: ليش الثلج يطفو على الماء؟ (open hexagonal lattice of ice, ~9% expansion). Scene functions take DESIGN time t (0..30). */
const WAT='rgba(63,169,245,.72)',WAT2='rgba(24,96,196,.92)',ICE='#DDF4FF',ICE2='#8FD3FF',OX='#FF5A5A',HY='#F4F7FB',BOND='#FFE45C',WAX1='rgba(240,180,80,.75)',WAX2='rgba(196,120,40,.92)';
window.HIGHLIGHT=[['الثلج',ICE2],['يغرق',RED],['تغرق',RED],['الماء',ICE2],['يطفو',D],['سداسية',BOND],['هيدروجينية',BOND],['فراغات',G],['٩٪',G],['الأسماك',D],['العكس',G],
 ['ice',ICE2],['sinks',RED],['sink',RED],['water',ICE2],['floats',D],['six-sided',BOND],['hydrogen',BOND],['gaps',G],['9%',G],['fish',D],['opposite',G]];

function cube(cx,cy,s,rot=0,a=1){if(a<=0)return;X.save();X.globalAlpha*=a;X.translate(cx,cy);X.rotate(rot);
  const g=X.createLinearGradient(-s/2,-s/2,s/2,s/2);g.addColorStop(0,'#F6FCFF');g.addColorStop(1,ICE2);rr(-s/2,-s/2,s,s,s*.18);X.fillStyle=g;X.fill();
  X.lineWidth=4;X.strokeStyle='rgba(255,255,255,.95)';X.stroke();X.fillStyle='rgba(255,255,255,.75)';rr(-s*.32,-s*.34,s*.26,s*.12,s*.05);X.fill();X.restore()}
function block(cx,bot,w,h,c1,c2,a=1){if(a<=0)return;X.save();X.globalAlpha*=a;const g=X.createLinearGradient(0,bot-h,0,bot);g.addColorStop(0,c1);g.addColorStop(1,c2);rr(cx-w/2,bot-h,w,h,16);X.fillStyle=g;X.fill();
  X.lineWidth=4;X.strokeStyle='rgba(255,255,255,.6)';X.stroke();X.restore()}
/* glass: draws `inner` (objects in the glass) first, then translucent liquid over it, then the rim */
function glass(cx,top,w,h,lvl,t,a,inner,c1=WAT,c2=WAT2){if(a<=0)return;X.save();X.globalAlpha*=a;const x=cx-w/2,bot=top+h,wy=bot-h*lvl;
  X.save();rr(x,top,w,h,30);X.fillStyle='rgba(255,255,255,.04)';X.fill();X.restore();
  if(inner)inner(wy);
  X.save();rr(x,top,w,h,30);X.clip();const g=X.createLinearGradient(0,wy,0,bot);g.addColorStop(0,c1);g.addColorStop(1,c2);X.fillStyle=g;
  X.beginPath();X.moveTo(x,bot);for(let k=0;k<=w;k+=10)X.lineTo(x+k,wy+Math.sin(k*.03+t*3)*5);X.lineTo(x+w,bot);X.closePath();X.fill();X.restore();
  rr(x,top,w,h,30);X.lineWidth=7;X.strokeStyle='rgba(220,240,255,.75)';X.stroke();X.fillStyle='rgba(255,255,255,.16)';rr(x+18,top+24,14,h-70,7);X.fill();
  X.restore();return wy}
function mol(x,y,rot,s=1,a=1){if(a<=0)return;X.save();X.globalAlpha*=a;X.translate(x,y);X.rotate(rot);X.scale(s,s);
  [-.92,.92].forEach(an=>{X.beginPath();X.arc(Math.sin(an)*25,-Math.cos(an)*25,11,0,7);X.fillStyle=HY;X.fill()});
  X.beginPath();X.arc(0,0,20,0,7);X.fillStyle=OX;X.fill();X.beginPath();X.arc(-6,-6,6,0,7);X.fillStyle='rgba(255,255,255,.45)';X.fill();X.restore()}
function fish(x,y,s,dir,t,a=1){if(a<=0)return;X.save();X.globalAlpha*=a;X.translate(x,y);X.scale(s*dir,s);const w=Math.sin(t*10)*8;
  X.fillStyle='#FFB020';X.beginPath();X.ellipse(0,0,46,24,0,0,7);X.fill();X.beginPath();X.moveTo(-40,0);X.lineTo(-74,-22+w);X.lineTo(-74,22+w);X.closePath();X.fill();
  X.beginPath();X.arc(22,-6,6,0,7);X.fillStyle='#0b1020';X.fill();X.restore()}
function hexPath(cx,cy,a){X.beginPath();for(let k=0;k<6;k++){const an=k*Math.PI/3;X.lineTo(cx+a*Math.cos(an),cy+a*Math.sin(an))}X.closePath()}

/* honeycomb lattice for the molecule scene */
const HA=72,PAN=[120,450,820,770];
const LAT=(()=>{const V=new Map(),E=new Set(),Cs=[];const key=(x,y)=>Math.round(x)+','+Math.round(y);const s3=Math.sqrt(3);
  for(let c=0;c<7;c++)for(let r=0;r<6;r++){const cx=200+c*1.5*HA,cy=530+r*s3*HA+(c%2?s3*HA/2:0);
    if(cx+HA>PAN[0]+PAN[2]-20||cy+s3*HA/2>PAN[1]+PAN[3]-20)continue;Cs.push([cx,cy]);const ks=[];
    for(let k=0;k<6;k++){const x=cx+HA*Math.cos(k*Math.PI/3),y=cy+HA*Math.sin(k*Math.PI/3),kk=key(x,y);if(!V.has(kk))V.set(kk,[x,y,V.size]);ks.push(V.get(kk)[2])}
    for(let k=0;k<6;k++){const a=ks[k],b=ks[(k+1)%6];E.add(Math.min(a,b)+'-'+Math.max(a,b))}}
  const vs=[...V.values()].map(v=>[v[0],v[1]]);return {vs,es:[...E].map(e=>e.split('-').map(Number)),cs:Cs}})();
const LC=LAT.vs.reduce((s,v)=>[s[0]+v[0]/LAT.vs.length,s[1]+v[1]/LAT.vs.length],[0,0]);
function molPos(i,t,f){const v=LAT.vs[i];const lx=LC[0]+(v[0]-LC[0])*.8+Math.sin(t*3.1+i*1.7)*16,ly=LC[1]+(v[1]-LC[1])*.8+Math.cos(t*2.7+i*2.3)*16;
  return [lerp(lx,v[0],f),lerp(ly,v[1],f)]}

function S1(t){ // hook 0–4.2
  const a=sceneAlpha(t,-1,4.2);if(a<=0)return;X.save();X.globalAlpha=a;
  const ti=eo(seg(t,0,.5));X.save();X.translate(0,lerp(-60,0,ti));X.globalAlpha*=ti;stroked(T('لا يغرق!','Never sinks!'),540,340,110,ICE2,'center',1,12);X.restore();
  const s=180;glass(540,540,520,680,.7,t,1,wy=>{const fy=wy+.4*s;const p=seg(t,.2,1.0);
    let y=p<1?lerp(230,fy,p*p):fy+34*Math.exp(-(t-1)*2.6)*Math.sin((t-1)*8)+4*Math.sin(t*2.2);cube(540,y,s,.12*Math.sin(t*1.7),1)});
  const sp=seg(t,1.0,1.5);if(sp>0&&sp<1){for(let i=0;i<8;i++){const an=-Math.PI*(.15+.7*i/7);X.fillStyle=`rgba(180,225,255,${1-sp})`;X.beginPath();X.arc(540+Math.cos(an)*(80+120*sp),730+Math.sin(an)*(40+150*sp)+200*sp*sp,10,0,7);X.fill()}}
  const lb=seg(t,1.7,2.1);if(lb>0){txt(T('ماء صلب','Solid water'),540,470,50,ICE,900,'center',lb)}
  const q=back(seg(t,2.9,3.3));if(q>0){X.save();X.translate(860,640);X.scale(q*(1+.06*Math.sin(t*8)),q);stroked('?',0,0,170,SP,'center',1,14);X.restore()}
  X.restore();
}
function S2(t){ // most solids sink 4.2–9.6
  const a=sceneAlpha(t,4.2,9.6);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('١ • الصلب عادةً يغرق','1 • Solids usually sink'),RED,1);
  const s=130;
  glass(310,560,340,560,.82,t,eo(seg(t,4.3,4.8)),wy=>{const p=eio(seg(t,6.4,7.6));const sc=lerp(1,.9,eo(seg(t,6.0,6.5)));
    cube(310,lerp(wy+s*.2,1120-14-s*sc/2,p),s*sc,0,1);
    const ia=seg(t,6.0,6.3)*(1-seg(t,7.4,7.7));if(ia>0){const cy=lerp(wy+s*.2,1120-14-s*sc/2,p);[[-1,0],[1,0],[0,-1],[0,1]].forEach(d=>arrow(310+d[0]*130,cy+d[1]*130,310+d[0]*85,cy+d[1]*85,WH,7,ia))}
  },WAX1,WAX2);
  const da=seg(t,6.6,7.0)*(1-seg(t,7.6,8.0));if(da>0)arrow(130,700,130,1000,RED,9,da);
  txt(T('شمع','Wax'),310,1180,46,'#F0B450',900,'center',seg(t,4.6,5.0));
  const r=seg(t,7.8,8.2);
  glass(770,560,340,560,.82,t,r,wy=>{const fy=wy+.4*s;const p=seg(t,7.9,8.4);let y=p<1?lerp(500,fy,p*p):fy+22*Math.exp(-(t-8.4)*3)*Math.sin((t-8.4)*9);cube(770,y,s,0,1)});
  txt(T('ماء','Water'),770,1180,46,ICE2,900,'center',r);
  const ua=seg(t,8.5,8.8);if(ua>0)arrow(930,1000,930,720,D,9,ua);
  const o=back(seg(t,8.8,9.2));if(o>0){X.save();X.translate(770,470);X.scale(o,o);stroked(T('العكس!','Opposite!'),0,0,72,G,'center',1,10);X.restore()}
  X.restore();
}
function S3(t){ // molecules -> hexagonal lattice 9.6–16.6
  const a=sceneAlpha(t,9.6,16.6);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٢ • داخل الثلج','2 • Inside the ice'),BOND,1);
  X.save();rr(...PAN,36);X.fillStyle='rgba(30,111,208,.18)';X.fill();X.lineWidth=4;X.strokeStyle='rgba(255,255,255,.2)';X.stroke();X.restore();
  const f=eio(seg(t,11.8,13.4)),tt=lerp(t,12.0,f);
  const P=LAT.vs.map((v,i)=>molPos(i,tt,f));
  const ba=seg(t,12.4,13.4);if(ba>0){X.save();X.globalAlpha*=ba;X.strokeStyle=BOND;X.lineWidth=5;X.setLineDash([12,10]);
    LAT.es.forEach(([i,j])=>{X.beginPath();X.moveTo(P[i][0],P[i][1]);X.lineTo(P[j][0],P[j][1]);X.stroke()});X.setLineDash([]);X.restore()}
  const hx=seg(t,13.4,13.9);if(hx>0){const c=LAT.cs[Math.floor(LAT.cs.length/2)];X.save();X.globalAlpha*=hx;hexPath(c[0],c[1],HA);X.lineWidth=12;X.strokeStyle=BOND;X.stroke();X.restore();
    txt(T('سداسي','Hexagon'),c[0],c[1],40,BOND,900,'center',hx*(1-seg(t,14.8,15.1)))}
  const ga=seg(t,15.0,15.5);if(ga>0){LAT.cs.forEach((c,k)=>glow(c[0],c[1],60,'rgba(255,176,32,.9)',ga*(.55+.35*Math.sin(t*5+k))));
    const c=LAT.cs[Math.floor(LAT.cs.length/2)];txt(T('فراغ','Gap'),c[0],c[1],40,WH,900,'center',ga)}
  P.forEach((p,i)=>mol(p[0],p[1],lerp(t*1.3+i,(i%2?Math.PI:0)+.5,f),.95,1));
  const la=seg(t,9.8,10.2)*(1-seg(t,11.6,12.0));txt(T('سائل: متزاحمة','Liquid: crowded'),540,1268,44,ICE2,900,'center',la);
  const lb=seg(t,13.6,14.0);txt(T('ثلج: شبكة مفتوحة','Ice: open lattice'),540,1268,44,BOND,900,'center',lb);
  X.restore();
}
function S4(t){ // 9% bigger, same weight, floats 16.6–22.6
  const a=sceneAlpha(t,16.6,22.6);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٣ • أكبر بحوالي ٩٪','3 • About 9% bigger'),G,1);
  const out=1-seg(t,20.4,20.8);
  if(out>0){X.save();X.globalAlpha*=out;const bot=960,h0=340,g=eo(seg(t,17.0,18.4));const hi=h0*(1+.09*g);
    block(330,bot,220,h0,'rgba(63,169,245,.9)','rgba(24,96,196,.95)',seg(t,16.7,17.0));
    block(750,bot,220,lerp(h0,hi,1),ICE,ICE2,seg(t,16.7,17.0));
    txt(T('ماء','Water'),330,bot-h0/2,48,WH,900,'center',1);txt(T('ثلج','Ice'),750,bot-hi/2,48,'#0b2a50',900,'center',1);
    X.save();X.strokeStyle=WH;X.lineWidth=4;X.setLineDash([12,10]);X.beginPath();X.moveTo(200,bot-h0);X.lineTo(880,bot-h0);X.stroke();X.setLineDash([]);X.restore();
    const pa=back(seg(t,18.2,18.6));if(pa>0){X.save();X.translate(750,bot-hi-60);X.scale(pa,pa);stroked(T('+٩٪','+9%'),0,0,72,G,'center',1,10);X.restore()}
    const bl=seg(t,18.8,19.3);if(bl>0){X.save();X.globalAlpha*=bl;X.fillStyle=MU;X.beginPath();X.moveTo(540,975);X.lineTo(500,1060);X.lineTo(580,1060);X.closePath();X.fill();
      rr(190,962,700,16,8);X.fillStyle=WH;X.fill();X.restore();
      txt(T('الوزن نفسه','Same weight'),540,1120,50,WH,900,'center',bl);
      [[330,'١ كغ','1 kg'],[750,'١ كغ','1 kg']].forEach(k=>{rr(k[0]-70,1170,140,64,20);X.save();X.globalAlpha*=bl;X.fillStyle='rgba(255,255,255,.1)';X.fill();X.restore();txt(T(k[1],k[2]),k[0],1203,40,G,900,'center',bl)})}
    X.restore()}
  const fl=seg(t,20.6,21.0);if(fl>0){X.save();X.globalAlpha*=fl;const s=200;
    glass(540,520,760,700,.72,t,1,wy=>{const p=eo(seg(t,20.8,22.0));const fy=wy+.4*s;cube(540,lerp(1150,fy,p)+5*Math.sin(t*2),s,0,1)});
    arrow(820,1080,820,820,D,10,seg(t,20.8,21.1)*(1-seg(t,22.0,22.4)));
    const fa=back(seg(t,21.6,22.0));if(fa>0){X.save();X.translate(540,450);X.scale(fa,fa);stroked(T('يطفو!','It floats!'),0,0,80,D,'center',1,10);X.restore()}
    X.restore()}
  X.restore();
}
function S5(t){ // frozen lake 22.6–26.8
  const a=sceneAlpha(t,22.6,26.8);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٤ • لماذا يهمّنا؟','4 • Why it matters'),D,1);
  const top=650,bot=1250;X.save();rr(110,440,840,810,36);X.clip();
  X.fillStyle='rgba(200,220,255,.07)';X.fillRect(110,440,840,top-440);
  const g=X.createLinearGradient(0,top,0,bot);g.addColorStop(0,'#2A7FD6');g.addColorStop(1,'#0E2F66');X.fillStyle=g;X.fillRect(110,top,840,bot-top);
  for(let i=0;i<26;i++){const x=110+rnd(i+40)*840,y=440+((rnd(i+60)*210+t*60*(.6+rnd(i)))%210);X.fillStyle='rgba(255,255,255,.85)';X.beginPath();X.arc(x,y,4+rnd(i+9)*4,0,7);X.fill()}
  const th=eo(seg(t,23.0,24.4))*70;if(th>0){X.fillStyle=ICE;X.fillRect(110,top-8,840,th+8);X.fillStyle='rgba(255,255,255,.6)';for(let i=0;i<6;i++)X.fillRect(150+i*140,top+th*.4,70,5)}
  const fa=seg(t,24.8,25.3);for(let i=0;i<3;i++){const dir=i%2?-1:1,sp=90+i*30,x=110+((t*sp*dir+i*300)%840+840)%840;fish(x,860+i*120,1,dir,t+i,fa)}
  X.restore();X.save();rr(110,440,840,810,36);X.lineWidth=4;X.strokeStyle='rgba(255,255,255,.22)';X.stroke();X.restore();
  txt(T('ثلج يطفو','Floating ice'),790,top+35,40,'#0b2a50',900,'center',seg(t,24.0,24.4));
  txt(T('ماء سائل','Liquid water'),300,1190,40,ICE,900,'center',seg(t,25.0,25.4));
  X.restore();
}
function S6(t){ // payoff 26.8–30
  const a=sceneAlpha(t,26.8,31);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('الخلاصة','Summary'),WH,1);
  const r1=back(seg(t,26.9,27.4)),r2=back(seg(t,27.2,27.7));
  if(r1>0){X.save();X.translate(290,800);X.scale(r1,r1);hexPath(0,0,130);X.lineWidth=12;X.strokeStyle=BOND;X.stroke();glow(0,0,110,'rgba(255,176,32,.9)',.6+.3*Math.sin(t*5));
    for(let k=0;k<6;k++)mol(130*Math.cos(k*Math.PI/3),130*Math.sin(k*Math.PI/3),k*Math.PI/3+Math.PI/2,.9,1);X.restore();txt(T('فراغات','Gaps'),290,1025,50,G,900,'center',r1)}
  stroked('=',545,800,140,WH,'center',seg(t,27.5,27.8),12);
  if(r2>0){X.save();X.translate(790,800);X.scale(r2,r2);glass(0,-170,260,340,.62,t,1,wy=>cube(0,wy+.4*100+3*Math.sin(t*2),100,0,1));X.restore();txt(T('يطفو','Floats'),790,1025,50,D,900,'center',r2)}
  const f=back(seg(t,28.5,28.9));if(f>0){const lab=T('تابع للمزيد','Follow for more');X.save();X.translate(540,1180);X.scale(f,f);X.font='900 44px Cairo';const w=X.measureText(lab).width+90;
    rr(-w/2,-38,w,76,38);X.fillStyle=RED;X.fill();X.restore();txt(lab,540,1182,44,WH,900,'center',f)}
  X.restore();
}
function drawScenes(t){S1(t);S2(t);S3(t);S4(t);S5(t);S6(t)}
function drawCover(){bg(3);const s=260;glass(540,560,700,720,.68,3,1,wy=>cube(540,wy+.4*s,s,.08,1));
  stroked(T('لا يغرق أبدًا!','It never sinks!'),540,350,T(120,104),ICE2,'center',1,16);
  X.save();X.translate(540,470);stroked(T('لماذا؟','Why?'),0,0,80,SP,'center',1,12);X.restore()}
window.drawScenes=drawScenes;window.drawCover=drawCover;
