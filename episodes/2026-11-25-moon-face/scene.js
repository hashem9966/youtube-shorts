/* Episode: ليش القمر دايم يورينا نفس الوجه؟ (tidal locking: one spin per orbit). Scene functions take DESIGN time t (0..30). */
const MO='#C9CED8',MO2='#8C94A3',NEAR='#22C3A6',FAR='#FFB020',EB='#2F7FE0',EG='#3DBE6E',STAR='#FFFFFF';
window.HIGHLIGHT=[['القمر',MO],['الأرض',EB],['يدور',NEAR],['٢٧',G],['جاذبية',RED],['قيّدته',RED],['البعيد',FAR],['الآخر',FAR],['الشمس',SP],['يواجهنا',NEAR],['نحونا',NEAR],['مظلمًا',MU],
 ['moon',MO],['earth',EB],['spin',NEAR],['27',G],['gravity',RED],['locked',RED],['far',FAR],['other',FAR],['sun',SP],['faces',NEAR],['toward',NEAR],['dark',MU]];

function stars(t){for(let i=0;i<70;i++){const x=90+rnd(i+300)*850,y=260+rnd(i+500)*1040,tw=.35+.35*Math.sin(t*2+i);
  X.fillStyle=`rgba(255,255,255,${tw*.7})`;X.beginPath();X.arc(x,y,1.5+rnd(i+700)*2.2,0,7);X.fill()}}
/* moon: rot = direction (radians) the NEAR side faces. Craters turn with it; a teal arc marks the near side, orange the far side. */
function moon(x,y,r,rot,a=1,ring=true,sx=1){if(a<=0)return;X.save();X.globalAlpha*=a;X.translate(x,y);X.rotate(rot);X.scale(sx,1);
  const g=X.createRadialGradient(-r*.3,-r*.3,r*.1,0,0,r);g.addColorStop(0,'#E6E9EF');g.addColorStop(1,MO2);X.beginPath();X.arc(0,0,r,0,7);X.fillStyle=g;X.fill();
  [[.55,.1,.22],[.35,-.45,.16],[.2,.5,.13],[-.3,-.2,.18],[-.55,.35,.12],[.6,-.5,.1],[-.1,.1,.09]].forEach(c=>{X.beginPath();X.arc(c[0]*r,c[1]*r,c[2]*r,0,7);X.fillStyle='rgba(90,98,115,.55)';X.fill()});
  if(ring){X.lineWidth=Math.max(6,r*.09);X.lineCap='round';X.strokeStyle=NEAR;X.beginPath();X.arc(0,0,r+X.lineWidth*.6,-Math.PI/2+.08,Math.PI/2-.08);X.stroke();
    X.strokeStyle=FAR;X.beginPath();X.arc(0,0,r+X.lineWidth*.6,Math.PI/2+.08,Math.PI*1.5-.08);X.stroke();
    X.beginPath();X.arc(r*.72,0,r*.12,0,7);X.fillStyle=NEAR;X.fill()}
  X.restore()}
function earth(x,y,r,t,a=1){if(a<=0)return;X.save();X.globalAlpha*=a;glow(x,y,r*1.7,'rgba(80,160,255,.45)',1);X.beginPath();X.arc(x,y,r,0,7);X.fillStyle=EB;X.fill();X.save();X.clip();
  X.fillStyle=EG;for(let i=0;i<5;i++){const cx=x+((rnd(i+11)*2.4*r+t*r*.25)%(2.4*r))-1.2*r,cy=y+(rnd(i+21)-.5)*1.4*r;X.beginPath();X.ellipse(cx,cy,r*(.25+rnd(i+31)*.25),r*(.15+rnd(i+41)*.2),rnd(i)*3,0,7);X.fill()}
  X.restore();X.restore()}
function sunB(x,y,r,t,a=1){if(a<=0)return;X.save();X.globalAlpha*=a;glow(x,y,r*2.6,'rgba(255,200,60,.55)',1);X.strokeStyle=SP;X.lineWidth=10;X.lineCap='round';
  for(let i=0;i<10;i++){const an=i/10*Math.PI*2+t*.4;X.beginPath();X.moveTo(x+Math.cos(an)*r*1.25,y+Math.sin(an)*r*1.25);X.lineTo(x+Math.cos(an)*r*1.6,y+Math.sin(an)*r*1.6);X.stroke()}
  X.beginPath();X.arc(x,y,r,0,7);X.fillStyle=SP;X.fill();X.restore()}
function spinArrow(x,y,R,a0,len,col,a=1,w=9){if(a<=0)return;X.save();X.globalAlpha*=a;X.strokeStyle=col;X.fillStyle=col;X.lineWidth=w;X.lineCap='round';X.beginPath();X.arc(x,y,R,a0,a0+len);X.stroke();
  const ae=a0+len,px=x+Math.cos(ae)*R,py=y+Math.sin(ae)*R,tan=ae+Math.PI/2;X.beginPath();X.moveTo(px+Math.cos(tan)*22,py+Math.sin(tan)*22);
  X.lineTo(px+Math.cos(ae)*16,py+Math.sin(ae)*16);X.lineTo(px-Math.cos(ae)*16,py-Math.sin(ae)*16);X.closePath();X.fill();X.restore()}
function lock(x,y,s,a=1){if(a<=0)return;X.save();X.globalAlpha*=a;X.translate(x,y);X.scale(s,s);X.strokeStyle=RED;X.lineWidth=12;X.beginPath();X.arc(0,-30,30,Math.PI,0);X.stroke();
  rr(-46,-30,92,74,14);X.fillStyle=RED;X.fill();X.beginPath();X.arc(0,0,9,0,7);X.fillStyle='#0b1020';X.fill();X.restore()}

function S1(t){ // hook 0–4.2
  const a=sceneAlpha(t,-1,4.2);if(a<=0)return;X.save();X.globalAlpha=a;
  const ti=eo(seg(t,0,.5));X.save();X.translate(0,lerp(-60,0,ti));X.globalAlpha*=ti;stroked(T('الوجه الخفي','The hidden side'),540,340,96,FAR,'center',1,12);X.restore();
  earth(540,1190,70,t,eo(seg(t,1.4,1.9)));
  const s=back(seg(t,.1,.7));moon(540,760,230*s,Math.PI/2+.06*Math.sin(t*1.3),1,seg(t,1.5,2.0)>0);
  const sl=seg(t,1.6,2.1);if(sl>0){X.save();X.globalAlpha*=sl;X.strokeStyle=NEAR;X.lineWidth=5;X.setLineDash([14,12]);X.lineDashOffset=-t*40;X.beginPath();X.moveTo(540,1120);X.lineTo(540,1010);X.stroke();X.setLineDash([]);X.restore()}
  const q=back(seg(t,2.9,3.3));if(q>0){X.save();X.translate(540,600);X.scale(q*(1+.06*Math.sin(t*8)),q);stroked('?',0,0,170,SP,'center',1,14);X.restore()}
  X.restore();
}
function S2(t){ // it does spin, 27 days 4.2–9.6
  const a=sceneAlpha(t,4.2,9.6);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('١ • القمر يدور فعلًا','1 • The Moon does spin'),NEAR,1);
  const sp=eio(seg(t,6.0,9.4));moon(540,780,200,-Math.PI/2+sp*Math.PI*2,eo(seg(t,4.3,4.8)));
  const st=seg(t,4.6,5.0)*(1-seg(t,5.8,6.1));if(st>0){stroked(T('ثابت؟','Still?'),540,500,70,MU,'center',st,10)}
  const ar=seg(t,6.0,6.4);if(ar>0){spinArrow(540,780,265,-Math.PI/2+sp*Math.PI*2-.2,-1.6,NEAR,ar);spinArrow(540,780,265,Math.PI/2+sp*Math.PI*2-.2,-1.6,NEAR,ar)}
  const dc=seg(t,7.8,8.0);if(dc>0){const n=Math.max(1,Math.round(27*sp));X.save();X.globalAlpha*=dc;rr(330,1105,420,110,30);X.fillStyle='rgba(255,255,255,.07)';X.fill();X.lineWidth=3;X.strokeStyle=G;X.stroke();X.restore();
    stroked(T('يوم '+AR(n),'Day '+n),540,1162,64,G,'center',dc,10)}
  X.restore();
}
function S3(t){ // one orbit = one spin 9.6–16.6
  const a=sceneAlpha(t,9.6,16.6);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٢ • دورة واحدة = لفّة واحدة','2 • One orbit = one spin'),G,1);
  const ex=540,ey=790,R=320;
  X.save();X.strokeStyle='rgba(255,255,255,.3)';X.lineWidth=4;X.setLineDash([12,12]);X.beginPath();X.arc(ex,ey,R,0,7);X.stroke();X.setLineDash([]);X.restore();
  earth(ex,ey,85,t,1);
  const p=eio(seg(t,9.9,16.3)),th=-Math.PI/2+p*Math.PI*2;
  const gh=seg(t,13.2,13.7);if(gh>0){for(let k=0;k<8;k++){const tk=-Math.PI/2+k*Math.PI/4;if(tk<th-.3)moon(ex+Math.cos(tk)*R,ey+Math.sin(tk)*R,52,tk+Math.PI,.35*gh)}}
  const mx=ex+Math.cos(th)*R,my=ey+Math.sin(th)*R;
  X.save();X.strokeStyle=NEAR;X.lineWidth=4;X.setLineDash([10,10]);X.globalAlpha*=.7;X.beginPath();X.moveTo(ex+Math.cos(th)*95,ey+Math.sin(th)*95);X.lineTo(mx-Math.cos(th)*70,my-Math.sin(th)*70);X.stroke();X.setLineDash([]);X.restore();
  moon(mx,my,60,th+Math.PI,1);
  const n=Math.max(1,Math.round(27*p));stroked(T('يوم '+AR(n),'Day '+n),540,1215,56,G,'center',seg(t,9.8,10.2),10);
  X.restore();
}
function S4(t){ // gravity slowed and locked it 16.6–22.6
  const a=sceneAlpha(t,16.6,22.6);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٣ • جاذبية الأرض','3 • Earth\'s gravity'),RED,1);
  earth(250,780,110,t,1);
  const lk=eo(seg(t,16.8,21.6)),rot=Math.PI-Math.PI*2*3*(1-lk);
  moon(780,780,125,rot,1,true,1);
  const ga=seg(t,16.9,17.3);if(ga>0){for(let i=0;i<3;i++){const ph=(t*1.2+i/3)%1;arrow(lerp(640,420,ph)+60,780+(i-1)*70,lerp(640,420,ph),780+(i-1)*70,RED,8,ga*Math.sin(ph*Math.PI))}}
  const sa=seg(t,17.0,17.4)*(1-seg(t,21.2,21.6));if(sa>0)spinArrow(780,780,175,rot-.4,-1.4,NEAR,sa);
  const ba=seg(t,18.4,18.8);if(ba>0){X.save();X.globalAlpha*=ba;rr(190,1080,700,34,17);X.fillStyle='rgba(255,255,255,.1)';X.fill();rr(190,1080,700*seg(t,18.5,21.6),34,17);X.fillStyle=RED;X.fill();X.restore();
    txt(T('ملايين السنين','Millions of years'),540,1175,48,WH,900,'center',ba)}
  const la=back(seg(t,21.6,22.0));if(la>0){lock(780,560,la);txt(T('مقيَّد','Locked'),780,470,48,RED,900,'center',la)}
  X.restore();
}
function S5(t){ // far side is not dark 22.6–26.8
  const a=sceneAlpha(t,22.6,26.8);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('٤ • الوجه البعيد مضيء','4 • The far side gets light'),SP,1);
  const mx=600,my=800,R=170,ex=830,ey=1170,toE=Math.atan2(ey-my,ex-mx);
  earth(ex,ey,65,t,1);
  const sa=seg(t,24.8,25.3);sunB(210,520,70,t,sa);
  moon(mx,my,R,toE,1,true);
  // shade the half facing away from the sun (dim until the sun appears)
  const sd=Math.atan2(520-my,210-mx);X.save();X.beginPath();X.arc(mx,my,R,sd+Math.PI/2,sd+Math.PI*1.5);X.closePath();X.fillStyle=`rgba(8,12,24,${.62})`;X.fill();X.restore();
  const dk=1-sa;if(dk>0){X.save();X.beginPath();X.arc(mx,my,R,sd-Math.PI/2,sd+Math.PI/2);X.closePath();X.fillStyle=`rgba(8,12,24,${.62*dk})`;X.fill();X.restore()}
  if(sa>0){X.save();X.globalAlpha*=sa;X.strokeStyle='rgba(255,228,92,.7)';X.lineWidth=6;X.setLineDash([18,14]);X.lineDashOffset=-t*60;
    [[-50,0],[0,0],[50,0]].forEach((o,i)=>{X.beginPath();X.moveTo(270+o[0]*.3,580+i*20);X.lineTo(mx-R*.8+o[0]*.6,my-R*.6+o[0]);X.stroke()});X.setLineDash([]);X.restore()}
  const fl=seg(t,23.0,23.4);if(fl>0){txt(T('الوجه البعيد','Far side'),245,850,44,FAR,900,'center',fl);
    stroked(sa>0?T('مضيء!','Lit!'):T('مظلم؟','Dark?'),245,925,62,sa>0?SP:MU,'center',fl,10);arrow(330,790,420,730,FAR,7,fl)}
  txt(T('الوجه القريب','Near side'),mx+150,my+250,40,NEAR,900,'center',seg(t,23.2,23.6));
  X.restore();
}
function S6(t){ // payoff 26.8–30
  const a=sceneAlpha(t,26.8,31);if(a<=0)return;X.save();X.globalAlpha=a;
  chip(T('الخلاصة','Summary'),WH,1);
  const r1=back(seg(t,26.9,27.4)),r2=back(seg(t,27.2,27.7));
  if(r1>0){X.save();X.translate(290,800);X.scale(r1,r1);moon(0,0,110,-Math.PI/2+t*1.4,1);spinArrow(0,0,160,t*1.4,-1.5,NEAR,1);X.restore();txt(T('لفّة حول نفسه','1 spin'),290,1010,46,NEAR,900,'center',r1)}
  stroked('=',545,800,140,WH,'center',seg(t,27.5,27.8),12);
  if(r2>0){X.save();X.translate(790,800);X.scale(r2,r2);X.strokeStyle='rgba(255,255,255,.35)';X.lineWidth=4;X.setLineDash([10,10]);X.beginPath();X.arc(0,0,150,0,7);X.stroke();X.setLineDash([]);
    earth(0,0,52,t,1);const th=t*1.4-Math.PI/2;moon(Math.cos(th)*150,Math.sin(th)*150,40,th+Math.PI,1);X.restore();txt(T('دورة حول الأرض','1 orbit'),790,1010,46,G,900,'center',r2)}
  const f=back(seg(t,28.5,28.9));if(f>0){const lab=T('تابع للمزيد','Follow for more');X.save();X.translate(540,1180);X.scale(f,f);X.font='900 44px Cairo';const w=X.measureText(lab).width+90;
    rr(-w/2,-38,w,76,38);X.fillStyle=RED;X.fill();X.restore();txt(lab,540,1182,44,WH,900,'center',f)}
  X.restore();
}
function drawScenes(t){stars(t);S1(t);S2(t);S3(t);S4(t);S5(t);S6(t)}
function drawCover(){bg(3);stars(3);earth(540,1200,75,3,1);moon(540,780,260,Math.PI/2,1);
  X.save();X.beginPath();X.arc(540,780,262,Math.PI,0);X.closePath();X.fillStyle='rgba(8,12,24,.55)';X.fill();X.restore();
  stroked('?',540,650,200,SP,'center',1,16);
  stroked(T('النصف المخفي','The hidden half'),540,350,T(116,100),FAR,'center',1,16)}
window.drawScenes=drawScenes;window.drawCover=drawCover;
