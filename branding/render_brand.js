// usage: node branding/render_brand.js "<Channel Name>"  -> branding/avatar.png, branding/banner.png
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{const name=process.argv[2]||'How It Started';const b=await chromium.launch();const p=await b.newPage({viewport:{width:2560,height:1440}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
for(const kind of ['avatar','banner']){await p.goto('file://'+path.join(__dirname,'brand.html')+'?kind='+kind+'&name='+encodeURIComponent(name));
 await p.waitForFunction(()=>window.done===true);const d=await p.evaluate(()=>document.getElementById('c').toDataURL('image/png'));
 fs.writeFileSync(path.join(__dirname,kind+'.png'),Buffer.from(d.split(',')[1],'base64'))}
await b.close();if(errs.length){console.error(errs);process.exit(1)}console.log('ok')})();
