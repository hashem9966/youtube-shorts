// usage: node engine/render.js episodes/<slug> [--lang en] [--preview t1,t2,...]
// Arabic: build/ -> video.mp4, cover.png, captions.srt.  English: build-en/ -> video-en.mp4, cover-en.png, captions-en.srt
// Needs <ep>/build/{timeline.json,audio.wav} from voice.py. Writes <ep>/video.mp4, cover.png, captions.srt
const {chromium}=require('playwright');const {spawn}=require('child_process');const fs=require('fs');const path=require('path');
(async()=>{const ep=path.resolve(process.argv[2]);const eng=__dirname;const li=process.argv.indexOf('--lang');const LANG=li>0?process.argv[li+1]:'ar';const sfx=LANG==='ar'?'':'-'+LANG;const B=ep+'/build'+sfx;
const prevIdx=process.argv.indexOf('--preview');const preview=prevIdx>0?process.argv[prevIdx+1].split(',').map(Number):null;
const TL=JSON.parse(fs.readFileSync(B+'/timeline.json','utf8'));const N=Math.round(TL.E*30);
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+eng+'/page.html?ep='+encodeURIComponent('file://'+ep)+'&lang='+LANG);await p.evaluate(()=>window.ready);
if(errs.length){console.error('page errors:',errs);process.exit(1)}
await p.evaluate(TL=>{CAPS.length=0;TL.caps.forEach(c=>CAPS.push(c));const A=TL.anchors;
 window.warp=t=>{for(let i=1;i<A.length;i++){if(t<=A[i][0]){const [n0,o0]=A[i-1],[n1,o1]=A[i];return n1===n0?o1:o0+(o1-o0)*(t-n0)/(n1-n0)}}return A[A.length-1][1]};
 window.frame=t=>{const tw=warp(t);X.setTransform(1,0,0,1,0,0);X.globalAlpha=1;bg(tw);drawScenes(tw);X.setTransform(1,0,0,1,0,0);X.globalAlpha=1;captions(t)}},TL);
const grab=async(fn,arg,type)=>{const d=await p.evaluate(([fn,arg,type])=>{window[fn](arg);return document.getElementById('c').toDataURL(type,.95)},[fn,arg,type]);return Buffer.from(d.split(',')[1],'base64')};
if(preview){fs.mkdirSync(B+'/preview',{recursive:true});for(const t of preview)fs.writeFileSync(`${B}/preview/${t}.png`,await grab('frame',t,'image/png'));
 fs.writeFileSync(B+'/preview/cover.png',await grab('drawCover',0,'image/png'));if(errs.length)console.error(errs);await b.close();console.log('preview ok');return}
const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-i',B+'/audio.wav',
 '-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-profile:v','high','-c:a','aac','-b:a','192k','-shortest','-movflags','+faststart',ep+'/video'+sfx+'.mp4'],{stdio:['pipe','inherit','inherit']});
for(let i=0;i<N;i++){const buf=await grab('frame',i/30,'image/jpeg');if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r))}
fs.writeFileSync(ep+'/cover'+sfx+'.png',await grab('drawCover',0,'image/png'));
const f=s=>{const ms=Math.max(0,Math.round(s*1000)),m=Math.floor(ms/60000),ss=Math.floor(ms/1000)%60,r=ms%1000;return `00:${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')},${String(r).padStart(3,'0')}`};
fs.writeFileSync(ep+'/captions'+sfx+'.srt',TL.caps.map((c,i)=>`${i+1}\n${f(c[0])} --> ${f(c[1])}\n${c[2]}\n`).join('\n'));
ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();
if(errs.length){console.error('page errors:',errs);process.exit(1)}console.log('render ok:',N,'frames')})();
