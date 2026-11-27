// usage: node kids/render_test.js  -> kids/art/{dragon_poses.png,forest_dragon.png,dragon_flight_test.mp4}
const {chromium}=require('playwright');const {spawn}=require('child_process');const fs=require('fs');const path=require('path');
(async()=>{const out=path.join(__dirname,'art');fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.join(__dirname,'dragon.html'));await p.evaluate(()=>window.ready);
const shot=async fn=>{const d=await p.evaluate(fn);return Buffer.from(d.split(',')[1],'base64')};
fs.writeFileSync(out+'/dragon_poses.png',await shot(()=>{X.clearRect(0,0,1920,1080);const {dragon}=DRAGON;
  [[-.5*Math.PI/5.5+0.0,330],[0.29,960],[0.57,1590]].forEach(([t,x])=>dragon(x,600,.95,t));return C.toDataURL('image/png')}));
fs.writeFileSync(out+'/forest_dragon.png',await shot(()=>{const {dragon,forest}=DRAGON;forest(2,300);dragon(900,470,1.0,2);return C.toDataURL('image/png')}));
const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','18',out+'/dragon_flight_test.mp4'],{stdio:['pipe','inherit','inherit']});
for(let i=0;i<180;i++){const buf=await shot(`(()=>{const t=${i/30};const {dragon,forest}=DRAGON;forest(t,t*260);dragon(780+Math.sin(t*.8)*120,470+Math.sin(t*1.3)*40,1.0,t);return C.toDataURL('image/jpeg',.92)})()`);
 if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r))}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();if(errs.length){console.error(errs);process.exit(1)}console.log('ok')})();
