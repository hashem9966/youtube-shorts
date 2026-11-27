/* How Money Moves: 16:9 drawing kit (1920x1080). Scenes get a beat context:
   S.lt = seconds since the beat started, S.dur = beat length, S.L[i] = start of line i (beat-local), S.ap(i,d) = eased appear of line i. */
const W=1920,H=1080,C=document.getElementById('c'),X=C.getContext('2d');
const GOLD='#F5C542',GOLD2='#C9931E',GREEN='#1FD68A',RED='#FF5A5F',BLUE='#4DA3FF',PURPLE='#9B7BFF',WH='#F3F7F5',MU='#9FB8AD',INK='#06140F',PANEL='#0F2A1F';
const cl=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),seg=(t,a,b)=>cl((t-a)/(b-a)),lerp=(a,b,x)=>a+(b-a)*x;
const eo=x=>1-Math.pow(1-x,3),eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,back=x=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)};
function rnd(i){const s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s)}
function rr(x,y,w,h,r){X.beginPath();X.roundRect(x,y,w,h,r)}
function txt(s,x,y,size,col,wt=800,align='center',a=1){if(a<=0)return;X.save();X.globalAlpha*=a;X.font=`${wt} ${size}px Cairo`;X.textAlign=align;X.textBaseline='middle';X.fillStyle=col;X.fillText(s,x,y);X.restore()}
function glow(x,y,r,col,a=1){if(a<=0)return;const g=X.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');X.save();X.globalAlpha*=a;X.fillStyle=g;X.fillRect(x-r,y-r,2*r,2*r);X.restore()}
function pop(a,x,y,fn){if(a<=0)return;const s=back(cl(a));X.save();X.globalAlpha*=cl(a*1.5);X.translate(x,y);X.scale(s,s);fn();X.restore()}
function bg(t){const g=X.createRadialGradient(W*.5,H*.45,100,W*.5,H*.5,W*.75);g.addColorStop(0,'#0F2E22');g.addColorStop(1,INK);X.fillStyle=g;X.fillRect(0,0,W,H);
  X.strokeStyle='rgba(31,214,138,.05)';X.lineWidth=2;for(let x=(-t*8)%80;x<=W;x+=80){X.beginPath();X.moveTo(x,0);X.lineTo(x,H);X.stroke()}for(let y=0;y<=H;y+=80){X.beginPath();X.moveTo(0,y);X.lineTo(W,y);X.stroke()}
  for(let i=0;i<30;i++){const x=rnd(i)*W,y=(rnd(i+50)*H-t*(6+rnd(i+3)*10))%H;X.fillStyle=`rgba(245,197,66,${.05+rnd(i+9)*.08})`;X.beginPath();X.arc(x,y<0?y+H:y,2+rnd(i+4)*3,0,7);X.fill()}}
function label(s,x,y,col=WH,size=34,a=1){if(a<=0)return;X.save();X.globalAlpha*=a;X.font=`800 ${size}px Cairo`;const w=X.measureText(s).width+44;rr(x-w/2,y-size*.85,w,size*1.7,size*.85);X.fillStyle='rgba(6,20,15,.85)';X.fill();X.lineWidth=3;X.strokeStyle=col;X.stroke();X.restore();txt(s,x,y+2,size,col,800,'center',a)}
function chapterTag(s,a){if(!s||a<=0)return;X.save();X.globalAlpha*=a;X.font='800 30px Cairo';const w=X.measureText(s).width+60;rr(60,52,w,58,29);X.fillStyle='rgba(245,197,66,.14)';X.fill();X.lineWidth=2;X.strokeStyle=GOLD;X.stroke();X.restore();txt(s,90,82,30,GOLD,800,'left',a)}
/* --- icons --- */
function person(x,y,s,col=BLUE){X.save();X.translate(x,y);X.scale(s,s);X.fillStyle=col;X.beginPath();X.arc(0,-62,34,0,7);X.fill();rr(-52,-22,104,96,40);X.fill();X.fillStyle='rgba(255,255,255,.25)';X.beginPath();X.arc(-10,-72,10,0,7);X.fill();X.restore()}
function store(x,y,s){X.save();X.translate(x,y);X.scale(s,s);X.fillStyle='#2C4A3E';rr(-90,-60,180,130,10);X.fill();
  for(let i=0;i<6;i++){X.fillStyle=i%2?WH:RED;X.beginPath();X.moveTo(-100+i*33.3,-60);X.lineTo(-100+(i+1)*33.3,-60);X.lineTo(-100+(i+1)*33.3,-30);X.arc(-100+(i+.5)*33.3,-30,16.6,0,Math.PI);X.closePath();X.fill()}
  X.fillStyle='#8FD3FF';rr(-70,-5,60,50,6);X.fill();X.fillStyle='#7A5232';rr(15,-5,50,75,6);X.fill();X.fillStyle=GOLD;X.beginPath();X.arc(55,35,5,0,7);X.fill();X.restore()}
function bank(x,y,s,col=GOLD){X.save();X.translate(x,y);X.scale(s,s);X.fillStyle=col;X.beginPath();X.moveTo(-110,-50);X.lineTo(0,-110);X.lineTo(110,-50);X.closePath();X.fill();
  X.fillRect(-110,-48,220,16);for(let i=0;i<5;i++)X.fillRect(-92+i*42,-26,22,86);X.fillRect(-120,62,240,20);X.fillStyle=INK;X.font='900 40px Cairo';X.textAlign='center';X.textBaseline='middle';X.fillText('$',0,-70);X.restore()}
function network(x,y,s,t){X.save();X.translate(x,y);X.scale(s,s);glow(0,0,150,'rgba(155,123,255,.35)');X.strokeStyle=PURPLE;X.lineWidth=6;X.beginPath();X.arc(0,0,78,0,7);X.stroke();
  X.beginPath();X.ellipse(0,0,36,78,0,0,7);X.stroke();X.beginPath();X.moveTo(-78,0);X.lineTo(78,0);X.stroke();X.beginPath();X.ellipse(0,0,78,30,0,0,7);X.stroke();
  for(let i=0;i<6;i++){const a=t*1.4+i*Math.PI/3;X.fillStyle=GOLD;X.beginPath();X.arc(Math.cos(a)*98,Math.sin(a)*98,8,0,7);X.fill()}X.restore()}
function card(x,y,s,rot=0,col1='#1A6E52',col2='#0D3B2C'){X.save();X.translate(x,y);X.rotate(rot);X.scale(s,s);const g=X.createLinearGradient(-170,-105,170,105);g.addColorStop(0,col1);g.addColorStop(1,col2);
  rr(-170,-105,340,210,22);X.fillStyle=g;X.fill();X.lineWidth=3;X.strokeStyle='rgba(255,255,255,.25)';X.stroke();rr(-130,-45,62,48,8);X.fillStyle=GOLD;X.fill();
  X.strokeStyle=GOLD2;X.lineWidth=3;X.beginPath();X.moveTo(-130,-21);X.lineTo(-68,-21);X.moveTo(-99,-45);X.lineTo(-99,3);X.stroke();
  X.fillStyle='rgba(255,255,255,.8)';X.font='700 28px Cairo';X.textAlign='left';X.fillText('•••• •••• •••• 2048',-130,50);X.font='900 30px Cairo';X.textAlign='right';X.fillStyle=GOLD;X.fillText('CARD',150,-70);X.restore()}
function terminal(x,y,s,beep=0){X.save();X.translate(x,y);X.scale(s,s);rr(-80,-130,160,260,24);X.fillStyle='#22303A';X.fill();rr(-60,-110,120,80,10);X.fillStyle=beep>0?'#1FD68A':'#0B1E2A';X.fill();
  if(beep>0){X.fillStyle=INK;X.font='900 44px Cairo';X.textAlign='center';X.textBaseline='middle';X.fillText('✓',0,-70)}for(let i=0;i<9;i++){rr(-55+(i%3)*40,-10+Math.floor(i/3)*40,30,30,6);X.fillStyle='#3A4B57';X.fill()}X.restore()}
function coin(x,y,r,a=1){if(a<=0)return;X.save();X.globalAlpha*=a;const g=X.createLinearGradient(x-r,y-r,x+r,y+r);g.addColorStop(0,'#FFE38A');g.addColorStop(1,GOLD2);X.beginPath();X.arc(x,y,r,0,7);X.fillStyle=g;X.fill();
  X.font=`900 ${r*1.2}px Cairo`;X.textAlign='center';X.textBaseline='middle';X.fillStyle='#7A520C';X.fillText('$',x,y+r*.05);X.restore()}
function arrowLine(x1,y1,x2,y2,col,w=8,a=1,p=1){if(a<=0||p<=0)return;const ex=lerp(x1,x2,p),ey=lerp(y1,y2,p);X.save();X.globalAlpha*=a;X.strokeStyle=col;X.fillStyle=col;X.lineWidth=w;X.lineCap='round';
  X.beginPath();X.moveTo(x1,y1);X.lineTo(ex,ey);X.stroke();const an=Math.atan2(y2-y1,x2-x1);X.beginPath();X.moveTo(ex+Math.cos(an)*6,ey+Math.sin(an)*6);X.lineTo(ex-Math.cos(an-.45)*28,ey-Math.sin(an-.45)*28);X.lineTo(ex-Math.cos(an+.45)*28,ey-Math.sin(an+.45)*28);X.closePath();X.fill();X.restore()}
function packet(x1,y1,x2,y2,p,col=GOLD){if(p<=0||p>=1)return;const x=lerp(x1,x2,eio(p)),y=lerp(y1,y2,eio(p));glow(x,y,40,'rgba(245,197,66,.6)');X.fillStyle=col;X.beginPath();X.arc(x,y,12,0,7);X.fill()}
function bigNumber(s,x,y,size,col,a){if(a<=0)return;X.save();X.globalAlpha*=a;X.font=`900 ${size}px Cairo`;X.textAlign='center';X.textBaseline='middle';X.lineJoin='round';X.lineWidth=size*.08;X.strokeStyle='rgba(4,12,9,.9)';X.strokeText(s,x,y);X.fillStyle=col;X.fillText(s,x,y);X.restore()}
function money(n,d=0){return '$'+n.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d})}
/* subtitles: bottom band */
function subtitle(text,a){if(!text||a<=0)return;X.save();X.globalAlpha*=a;const size=38;X.font=`700 ${size}px Cairo`;let lines=[text];
  if(X.measureText(text).width>1500){const w=text.split(' ');let best=1,bd=1e9;for(let i=1;i<w.length;i++){const d=Math.abs(X.measureText(w.slice(0,i).join(' ')).width-X.measureText(w.slice(i).join(' ')).width);if(d<bd){bd=d;best=i}}lines=[w.slice(0,best).join(' '),w.slice(best).join(' ')]}
  const lh=size*1.35,bw=Math.max(...lines.map(l=>X.measureText(l).width))+60,bh=lh*lines.length+22,by=H-40-bh;rr(W/2-bw/2,by,bw,bh,16);X.fillStyle='rgba(0,0,0,.6)';X.fill();X.restore();
  lines.forEach((l,i)=>txt(l,W/2,by+11+lh*(i+.5)+2,size,WH,700,'center',a))}
window.ready=Promise.all([700,800,900].map(w=>document.fonts.load(`${w} 40px Cairo`,'How Money $123'))).then(()=>document.fonts.ready);
