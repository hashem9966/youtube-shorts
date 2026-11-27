// usage: node money/engine/render_long.js money/episodes/<ep> [--preview t1,t2,...]
// Needs build/{timeline.json,audio.wav} from voice_long.py. Writes video.mp4, thumbnail.png, captions.srt in the episode folder.
const {chromium}=require('playwright');const {spawn}=require('child_process');const fs=require('fs');const path=require('path');
(async()=>{const ep=path.resolve(process.argv[2]);const B=ep+'/build';const pi=process.argv.indexOf('--preview');const preview=pi>0?process.argv[pi+1].split(',').map(Number):null;
const TL=JSON.parse(fs.readFileSync(B+'/timeline.json','utf8'));const N=Math.round(TL.E*30);
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/page.html?ep='+encodeURIComponent('file://'+ep));await p.evaluate(()=>window.ready);
await p.evaluate(TL=>{window.TL=TL;
 window.frame=t=>{X.setTransform(1,0,0,1,0,0);X.globalAlpha=1;bg(t);
  TL.beats.forEach((bt,bi)=>{if(t<bt.start||t>bt.end)return;const a=Math.min(seg(t,bt.start,bt.start+.45),1-seg(t,bt.end-.45,bt.end));if(a<=0)return;
   const L=bt.lines.map(l=>l.start-bt.start);const lt=t-bt.start;
   const S={t,lt,dur:bt.end-bt.start,L,ap:(i,d=.5)=>L[i]===undefined?0:eo(seg(lt,L[i]-.15,L[i]-.15+d))};
   X.save();X.globalAlpha=a;X.translate(W/2,430);X.scale(.86,.86);X.translate(-W/2,-430);BEATS[bt.visual](S);X.restore();X.globalAlpha=1;chapterTag(bt.chapter,a)});
  const ln=TL.lines.find(l=>t>=l.start-.1&&t<l.end+.25);if(ln)subtitle(ln.text,Math.min(seg(t,ln.start-.1,ln.start+.1),1-seg(t,ln.end+.1,ln.end+.25)))}},TL);
if(errs.length){console.error(errs);process.exit(1)}
const grab=async(js,type)=>{const d=await p.evaluate(js);return Buffer.from(d.split(',')[1],'base64')};
if(preview){fs.mkdirSync(B+'/preview',{recursive:true});for(const t of preview)fs.writeFileSync(`${B}/preview/${t}.png`,await grab(`(()=>{frame(${t});return C.toDataURL('image/png')})()`));
 fs.writeFileSync(B+'/preview/thumb.png',await grab(`(()=>{drawCover();return C.toDataURL('image/png')})()`));await b.close();if(errs.length){console.error(errs);process.exit(1)}console.log('preview ok');return}
const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-i',B+'/audio.wav','-c:v','libx264','-preset','medium','-crf','20','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-shortest','-movflags','+faststart',ep+'/video.mp4'],{stdio:['pipe','inherit','inherit']});
for(let i=0;i<N;i++){const buf=await grab(`(()=>{frame(${i/30});return C.toDataURL('image/jpeg',.9)})()`);if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));if(i%1500===0)console.log('frame',i,'/',N)}
fs.writeFileSync(ep+'/thumbnail.png',await grab(`(()=>{drawCover();return C.toDataURL('image/png')})()`));
const f=s=>{const ms=Math.round(s*1000);return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')},${String(ms%1000).padStart(3,'0')}`};
fs.writeFileSync(ep+'/captions.srt',TL.lines.map((l,i)=>`${i+1}\n${f(l.start)} --> ${f(l.end)}\n${l.text}\n`).join('\n'));
ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();if(errs.length){console.error(errs);process.exit(1)}console.log('render ok',N)})();
