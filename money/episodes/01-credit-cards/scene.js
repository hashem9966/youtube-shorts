/* Episode 01: How credit card companies make money. Each beat draws from S (see longlib.js). */
const P={you:[380,400],store:[1540,400],issuer:[380,800],net:[960,800],acq:[1540,800]};
function mapScene(S,show,opts={}){ // the five players and their links
  const a=k=>show[k]??0, t=S.t;
  const link=(p,q,k,col)=>{const v=a(k);if(v<=0)return;X.save();X.globalAlpha*=v;X.strokeStyle=col;X.lineWidth=5;X.setLineDash([14,12]);X.lineDashOffset=-t*30;X.beginPath();X.moveTo(...p);X.lineTo(...q);X.stroke();X.restore()};
  link([P.you[0],P.you[1]+80],[P.issuer[0],P.issuer[1]-120],'issuer',BLUE);
  link([P.store[0],P.store[1]+80],[P.acq[0],P.acq[1]-120],'acq',GOLD);
  link([P.issuer[0]+130,P.issuer[1]],[P.net[0]-120,P.net[1]],'net',PURPLE);
  link([P.net[0]+120,P.net[1]],[P.acq[0]-130,P.acq[1]],'net',PURPLE);
  link([P.you[0]+120,P.you[1]],[P.store[0]-130,P.store[1]],'you',MU);
  pop(a('you'),...P.you,()=>person(0,20,1.1,BLUE));label('You',P.you[0],P.you[1]+120,BLUE,32,a('you'));
  pop(a('store'),...P.store,()=>store(0,10,1.1));label('The store',P.store[0],P.store[1]+120,WH,32,a('store'));
  pop(a('issuer'),...P.issuer,()=>bank(0,0,.95,BLUE));label('Your bank (issuer)',P.issuer[0],P.issuer[1]+120,BLUE,32,a('issuer'));
  pop(a('acq'),...P.acq,()=>bank(0,0,.95,GOLD));label("Store's bank (acquirer)",P.acq[0],P.acq[1]+120,GOLD,32,a('acq'));
  pop(a('net'),...P.net,()=>network(0,0,.95,t));label('Card network',P.net[0],P.net[1]+150,PURPLE,32,a('net'));
}
const BEATS={
hook(S){const {lt,ap}=S;
  const ci=eo(seg(lt,0,.8));card(lerp(-300,520,ci),520,1.15,lerp(-.4,-.12,ci));terminal(900,560,1.0,ap(1)>0?1:0);
  if(ap(1)>0){label('PAID IN FULL',520,760,GREEN,40,ap(1));label('$0 interest',520,840,GREEN,36,ap(1))}
  bigNumber('?',1420,420,260,GOLD,ap(2));txt('So how do they still profit?',1420,640,52,WH,800,'center',ap(2));
  if(ap(3)>0){for(let i=0;i<6;i++){const ph=((lt-S.L[3])*.6+i/6)%1;coin(900+Math.sin(i)*40,560-ph*300,18,ap(3)*(1-ph))}}
  if(ap(4)>0){X.save();X.globalAlpha*=ap(4);for(let i=0;i<3;i++){rr(1240+i*24,760+i*14,260,120,12);X.fillStyle=['#2E7D5B','#3C9A6E','#4CB582'][i];X.fill()}X.restore();txt('Cash payers too',1390,940,40,MU,800,'center',ap(4))}
  if(ap(5)>0){X.save();X.globalAlpha*=ap(5);X.fillStyle='rgba(6,20,15,.82)';X.fillRect(-300,-300,W+600,H+600);X.restore();bigNumber('Follow the money',W/2,H/2-20,120,GOLD,ap(5))}
},
players(S){const {ap}=S;mapScene(S,{you:ap(0,.6),store:ap(0,.6),issuer:ap(2),acq:ap(3),net:ap(4)});
  if(ap(1)>0&&ap(2)<1)txt('+ more players',W/2,620,48,GOLD,800,'center',ap(1)*(1-ap(2)));
  if(ap(5)>0){label('≈ 2 seconds',W/2,560,GOLD,46,ap(5))}
},
journey(S){const {lt,L,ap}=S;mapScene(S,{you:1,store:1,issuer:1,acq:1,net:1});
  const hop=(i,p,q)=>{const s=L[i]??0,e=(L[i+1]??S.dur);packet(...p,...q,seg(lt,s+.3,Math.min(e,s+2.2)))};
  hop(1,P.store,P.acq);hop(2,P.acq,P.net);hop(3,P.net,P.issuer);
  if(ap(4)>0){label('Fraud check ✓',P.issuer[0]+270,P.issuer[1]-150,GREEN,32,ap(4));label('Credit available ✓',P.issuer[0]+270,P.issuer[1]-90,GREEN,32,ap(4))}
  if(ap(5)>0){const s=L[5];packet(...P.issuer,...P.net,seg(lt,s,s+1));packet(...P.net,...P.acq,seg(lt,s+1,s+2));packet(...P.acq,...P.store,seg(lt,s+2,s+3));
    if(lt>s+3)label('BEEP ✓ Approved',P.store[0],P.store[1]-150,GREEN,36,seg(lt,s+3,s+3.4))}
  if(ap(6)>0)label('Money settles in 1–2 days',W/2,560,GOLD,42,ap(6));
},
swipe100(S){const {lt,ap}=S;const cx=760,cy=540,R=300;
  const cut=ap(2),share=0.0236*6; // slice drawn exaggerated so it is visible; label gives the real number
  X.save();X.globalAlpha*=ap(0,.6);X.beginPath();X.moveTo(cx,cy);X.arc(cx,cy,R,-Math.PI/2+share*Math.PI*2,Math.PI*1.5);X.closePath();X.fillStyle=GREEN;X.fill();X.restore();
  if(ap(0)>0){const off=cut*60;X.save();X.globalAlpha*=ap(0,.6);X.translate(Math.cos(-Math.PI/2+share*Math.PI)*off,Math.sin(-Math.PI/2+share*Math.PI)*off);X.beginPath();X.moveTo(cx,cy);X.arc(cx,cy,R,-Math.PI/2,-Math.PI/2+share*Math.PI*2);X.closePath();X.fillStyle=cut>0?RED:GREEN;X.fill();X.restore()}
  bigNumber('$100',cx,cy,120,INK,ap(0,.6)*(1-ap(5)));
  txt('Your purchase',cx,cy+R+60,40,MU,800,'center',ap(0,.6));
  if(ap(1)>0)txt('The store gets…',1420,300,52,WH,800,'center',ap(1));
  label('Swipe fee',cx+190,cy-R-40,RED,40,ap(3));
  bigNumber('≈ 2.3%',1420,470,150,RED,ap(4));txt('average Visa & Mastercard credit swipe fee, US 2025',1420,580,30,MU,700,'center',ap(4));txt('(merchant groups’ estimate)',1420,620,28,MU,700,'center',ap(4));
  if(ap(5)>0){const v=lerp(100,97.7,eo(seg(lt,S.L[5],S.L[5]+1.5)));bigNumber(money(v,2),cx,cy,100,INK,ap(5));bigNumber('≈ '+money(97.7,2),1420,800,110,GREEN,ap(5));txt('kept by the store',1420,890,36,MU,800,'center',ap(5))}
},
split(S){const {lt,L,ap}=S;mapScene(S,{you:.35,store:1,issuer:1,acq:1,net:1});
  const flow=(i,p,q,n,big)=>{if(ap(i)<=0)return;for(let k=0;k<n;k++){const ph=((lt-L[i])*.5+k/n)%1;coin(lerp(p[0],q[0],ph),lerp(p[1],q[1],ph)-Math.sin(ph*Math.PI)*80,big?22:14,ap(i))}};
  flow(0,P.store,P.issuer,6,true);flow(1,P.store,P.acq,3,false);flow(2,P.issuer,P.net,2,false);flow(2,P.acq,P.net,2,false);
  const hideL=1-ap(4);label('Interchange → your bank (biggest part)',P.issuer[0]+60,P.issuer[1]-200,BLUE,32,ap(0)*hideL);
  label('Small markup',P.acq[0],P.acq[1]-200,GOLD,32,ap(1)*hideL);
  label('Network fees (much smaller)',P.net[0],P.net[1]-180,PURPLE,32,ap(2)*hideL);
  if(ap(3)>0&&ap(4)<=0)txt('Surprise…',W/2,560,56,GOLD,900,'center',ap(3));
  if(ap(4)>0){X.save();X.globalAlpha*=ap(4);X.fillStyle='rgba(6,20,15,.97)';X.fillRect(-300,420,W+600,260);X.restore();
    txt("Visa & Mastercard don't keep the interchange fee",W/2,505,52,WH,900,'center',ap(4));txt('They earn network & processing fees (Visa annual report)',W/2,585,36,PURPLE,800,'center',ap(5))}
},
scale(S){const {lt,L,ap}=S;
  bigNumber('2%',W/2,300,180,GOLD,ap(0)*(1-ap(1)));
  if(ap(1)>0){for(let i=0;i<8;i++){const h=eo(seg(lt,L[1]+i*.12,L[1]+i*.12+.8))*(150+i*45);rr(260+i*90,800-h,60,h,8);X.fillStyle=`rgba(31,214,138,${.4+i*.07})`;X.fill()}txt('Trillions spent on cards every year',580,860,34,MU,800,'center',ap(1))}
  if(ap(2)>0){const v=Math.round(lerp(0,100,eo(seg(lt,L[2],L[2]+2))));bigNumber('$'+v+'B+',1380,560,180,GOLD,ap(2));txt('Visa & Mastercard credit swipe fees, 2025',1380,690,34,WH,800,'center',ap(2));txt('(merchant groups’ estimate)',1380,735,28,MU,700,'center',ap(2))}
  if(ap(3)>0)label('Your bank earns its share, even at $0 interest',1380,830,GREEN,32,ap(3));
},
whyaccept(S){const {lt,L,ap}=S;
  pop(ap(0,.6),W/2,420,()=>store(0,0,1.6));
  if(ap(0)>0&&ap(1)<=0)label('Give up 2% of every sale?',W/2,700,GOLD,44,ap(0));
  const h1=1-ap(3);if(ap(1)>0&&h1>0){X.save();X.globalAlpha*=h1;card(560,760,.75,-.15);X.save();X.globalAlpha*=ap(1)*.45;rr(1260,690,260,130,14);X.fillStyle='#3C9A6E';X.fill();X.restore();txt('Cards: easy spending',560,900,34,GREEN,800,'center',ap(1));txt('Cash: less common',1390,900,34,MU,800,'center',ap(1));X.restore()}
  if(ap(2)>0){label('CARDS NOT ACCEPTED',W/2,230,RED,38,ap(2));for(let i=0;i<3;i++){const ph=seg(lt,L[2]+i*.3,L[2]+i*.3+2);person(lerp(W/2+120,W+120,eo(ph)),650,.7,MU)}}
  if(ap(3)>0)label('A cost of doing business',W/2,700,GOLD,46,ap(3));
},
rewards(S){const {lt,L,ap}=S;
  const chips=[['Cash back',GREEN],['Points',GOLD],['Miles',BLUE]];chips.forEach(([s,c],i)=>label(s,520+i*440,220,c,40,ap(1)*(1-ap(2)*.5)));
  if(ap(0)>0&&ap(1)<=0)bigNumber('Rewards?',W/2,240,110,GOLD,ap(0));
  if(ap(2)>0){card(620,560,.85,-.1);card(1300,560,.85,.1,'#3A3A46','#121218');txt('Standard card',620,740,34,MU,800,'center',ap(2));txt('Premium rewards card',1300,740,34,GOLD,800,'center',ap(2));
    const h1=eo(seg(lt,L[2],L[2]+1))*90,h2=eo(seg(lt,L[2],L[2]+1))*170;rr(590,900-h1,60,h1,8);X.fillStyle=RED;X.fill();rr(1270,900-h2,60,h2,8);X.fill();txt('higher swipe fee →',1050,860,30,RED,800,'center',ap(2))}
  if(ap(3)>0){X.save();X.globalAlpha*=ap(3);X.fillStyle='rgba(6,20,15,.96)';X.fillRect(-300,-300,W+600,H+600);X.restore();
    pop(ap(3),330,560,()=>store(0,0,1));pop(ap(3),960,560,()=>bank(0,0,1,BLUE));pop(ap(3),1590,560,()=>person(0,20,1.1,BLUE));
    for(let k=0;k<5;k++){const ph=((lt-L[3])*.5+k/5)%1;coin(lerp(330,960,ph),560-Math.sin(ph*Math.PI)*90,22,ap(3))}
    for(let k=0;k<2;k++){const ph=((lt-L[3])*.5+k/2)%1;coin(lerp(960,1590,ph),560-Math.sin(ph*Math.PI)*90,14,ap(3))}
    label('Swipe fee',645,400,RED,32,ap(3));label('A share back as points',1275,400,GREEN,32,ap(3))}
  if(ap(4)>0)label('Not free money: a share of the fee',W/2,850,GOLD,44,ap(4));
},
cash(S){const {lt,L,ap}=S;
  pop(ap(0,.6),W/2,330,()=>store(0,0,1.2));
  if(ap(1)>0){label('Price includes the card fee',W/2,520,GOLD,40,ap(1))}
  if(ap(2)>0){person(560,800,1,MU);person(1360,800,1,BLUE);txt('Pays cash',560,930,34,MU,800,'center',ap(2));txt('Pays with rewards card',1360,930,34,BLUE,800,'center',ap(2));
    for(let k=0;k<4;k++){const ph=((lt-L[2])*.4+k/4)%1;coin(lerp(640,1280,ph),760-Math.sin(ph*Math.PI)*100,14,ap(2))}
    txt('Federal Reserve Bank of Boston study (2010)',W/2,590,28,MU,700,'center',ap(2))}
  if(ap(3)>0){label('Lower income',560,660,MU,30,ap(3));label('Higher income',1360,660,BLUE,30,ap(3))}
},
interest(S){const {lt,L,ap}=S;
  if(ap(0)>0&&ap(1)<=0)txt('Another money stream',W/2,400,60,GOLD,900,'center',ap(0));
  if(ap(1)>0){person(380,560,1.2,RED);label('Carries a balance',380,720,RED,34,ap(1))}
  if(ap(2)>0){const v=lerp(0,1.28,eo(seg(lt,L[2],L[2]+2)));bigNumber('$'+v.toFixed(2)+' trillion',1150,300,110,WH,ap(2));txt('US credit card balances, end of 2025 (New York Fed)',1150,385,30,MU,700,'center',ap(2))}
  if(ap(3)>0){const cx=1150,cy=600,r=110,p=eo(seg(lt,L[3],L[3]+1.5))*0.22;X.save();X.globalAlpha*=ap(3);X.lineWidth=26;X.strokeStyle='rgba(255,255,255,.12)';X.beginPath();X.arc(cx,cy,r,0,7);X.stroke();
    X.strokeStyle=RED;X.beginPath();X.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+p*Math.PI*2*2);X.stroke();X.restore();bigNumber('≈22%',cx,cy,70,RED,ap(3));txt('average APR when interest is charged, 2025 (Federal Reserve)',cx,cy+165,28,MU,700,'center',ap(3))}
  if(ap(4)>0){bigNumber('$160B',560,880,96,GOLD,ap(4));txt('interest paid in 2024 (CFPB)',560,955,30,MU,700,'center',ap(4))}
  if(ap(5)>0){bigNumber('+ $31B',1150,880,96,GOLD,ap(5));txt('in fees (CFPB)',1150,955,30,MU,700,'center',ap(5))}
},
fees(S){const {ap}=S;const items=['Annual fee','Late fee','Cash advance fee','Foreign transaction fee'];
  const icon=[()=>{rr(-70,-60,140,120,12);X.fillStyle=WH;X.fill();X.fillStyle=RED;X.fillRect(-70,-60,140,34);X.fillStyle=INK;for(let i=0;i<6;i++)X.fillRect(-50+(i%3)*40,-10+Math.floor(i/3)*35,24,22)},
    ()=>{X.lineWidth=12;X.strokeStyle=WH;X.beginPath();X.arc(0,0,70,0,7);X.stroke();X.lineCap='round';X.beginPath();X.moveTo(0,0);X.lineTo(0,-45);X.moveTo(0,0);X.lineTo(32,20);X.stroke()},
    ()=>{for(let i=0;i<3;i++){rr(-85+i*14,-45+i*12,170,90,10);X.fillStyle=['#2E7D5B','#3C9A6E','#4CB582'][i];X.fill()}X.fillStyle=WH;X.font='900 56px Cairo';X.textAlign='center';X.textBaseline='middle';X.fillText('$',14,24)},
    ()=>{X.fillStyle=WH;X.beginPath();X.moveTo(-80,10);X.lineTo(80,-10);X.quadraticCurveTo(100,0,80,10);X.lineTo(-80,20);X.closePath();X.fill();X.beginPath();X.moveTo(0,0);X.lineTo(-30,-60);X.lineTo(-5,-60);X.lineTo(30,0);X.closePath();X.fill();X.beginPath();X.moveTo(0,12);X.lineTo(-25,60);X.lineTo(0,60);X.lineTo(30,12);X.closePath();X.fill();X.beginPath();X.moveTo(-70,10);X.lineTo(-90,-30);X.lineTo(-75,-30);X.lineTo(-55,8);X.closePath();X.fill()}];
  if(ap(0)>0)txt('The fees',W/2,220,72,GOLD,900,'center',ap(0));
  items.forEach((s,i)=>{const a=ap(i+1);if(a<=0)return;const x=270+i*460;pop(a,x,520,()=>{rr(-200,-150,400,300,30);X.fillStyle=PANEL;X.fill();X.lineWidth=4;X.strokeStyle=GOLD;X.stroke();X.save();X.translate(0,-10);icon[i]();X.restore()});txt(s,x,640,36,WH,800,'center',a)});
},
summary(S){const {lt,L,ap}=S;const cols=[['Swipe fees','paid by stores',GREEN],['Interest','paid by people carrying a balance',RED],['Fees','annual, late, cash advance, foreign',GOLD]];
  if(ap(0)>0)txt('3 money streams',W/2,170,64,WH,900,'center',ap(0));
  cols.forEach(([h,s,c],i)=>{const a=ap(i+1);if(a<=0)return;const x=420+i*540,hi=(i===0&&ap(4)>0)||(i===1&&ap(6)>0);if(hi)glow(x,560,300,c.replace(')',',.3)').replace('#','#'),.0);
    pop(a,x,560,()=>{rr(-230,-220,460,440,30);X.fillStyle=hi?'rgba(255,255,255,.08)':PANEL;X.fill();X.lineWidth=hi?10:4;X.strokeStyle=c;X.stroke()});
    bigNumber(String(i+1),x,460,110,c,a);txt(h,x,600,52,WH,900,'center',a);txt(s,x,670,26,MU,700,'center',a)});
  if(ap(4)>0)label('Pay in full → only stream 1',420,860,GREEN,34,ap(4));
  if(ap(5)>0)label('…and part comes back as rewards',420,930,GREEN,30,ap(5));
  if(ap(6)>0)label('The biggest part of the business',960,860,RED,36,ap(6));
},
outro(S){const {lt,ap}=S;
  const r=130;glow(W/2,380,320,'rgba(245,197,66,.35)');coin(W/2,380,r,1);X.save();X.strokeStyle=GREEN;X.lineWidth=14;X.lineCap='round';X.beginPath();X.arc(W/2,380,r*1.3,-0.4+lt*.6,1.4+lt*.6);X.stroke();X.beginPath();X.arc(W/2,380,r*1.3,2.7+lt*.6,4.5+lt*.6);X.stroke();X.restore();
  txt('2 seconds · 5 players · a slice for almost everyone',W/2,620,44,WH,800,'center',ap(0));
  if(ap(1)>0){const s=1+.05*Math.sin(lt*6);X.save();X.translate(W/2,740);X.scale(s,s);rr(-220,-50,440,100,50);X.fillStyle=RED;X.fill();X.restore();txt('SUBSCRIBE',W/2,742,44,WH,900,'center',ap(1));txt('How Money Moves',W/2,830,40,GOLD,900,'center',ap(1))}
  txt('Educational content only. Not financial advice.',W/2,895,28,MU,700,'center',ap(2));
}};
function drawCover(){bg(0);card(560,560,1.6,-.15);glow(1300,420,380,'rgba(255,90,95,.35)');bigNumber('THEY',1340,300,150,WH,1);bigNumber('STILL',1340,450,150,WH,1);bigNumber('PROFIT',1340,600,170,GOLD,1);
  bigNumber('$0 interest?',560,860,80,GREEN,1)}
window.BEATS=BEATS;window.drawCover=drawCover;
