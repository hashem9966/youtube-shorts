#!/usr/bin/env python3
"""Narration + timeline + soft music bed for a long-form (16:9) episode.
usage: python3 money/engine/voice_long.py money/episodes/<ep>
Reads script.json {voice, rate, beats:[{visual, chapter, lines:[...]}]} and writes build/{timeline.json,audio.wav}."""
import json, os, subprocess, sys, wave
import numpy as np
EP=sys.argv[1]; B=os.path.join(EP,'build'); os.makedirs(B,exist_ok=True)
sc=json.load(open(os.path.join(EP,'script.json'))); sr=44100
voice=sc.get('voice','en-US-AndrewNeural'); rate=sc.get('rate','+0%')
env=dict(os.environ, SSL_CERT_FILE=os.environ.get('SSL_CERT_FILE','/root/.ccr/ca-bundle.crt')); proxy=os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')
def tts(text,key):
    mp3=os.path.join(B,key+'.mp3'); wav=os.path.join(B,key+'.wav')
    if not os.path.exists(wav):
        cmd=['edge-tts','--voice',voice,f'--rate={rate}','--text',text,'--write-media',mp3]
        if proxy: cmd[1:1]=['--proxy',proxy]
        for _ in range(4):
            subprocess.run(cmd,env=env,stdin=subprocess.DEVNULL,capture_output=True)
            if os.path.exists(mp3) and os.path.getsize(mp3)>1000: break
        else: sys.exit('TTS failed: '+text)
        af='silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse'
        subprocess.run(['ffmpeg','-nostdin','-loglevel','error','-y','-i',mp3,'-af',af,'-ar',str(sr),'-ac','1',wav],check=True)
    w=wave.open(wav); return np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float)/32768
t=0.6; lines=[]; beats=[]; clips=[]
for bi,b in enumerate(sc['beats']):
    if bi>0: t+=0.9
    b0=t; li0=len(lines)
    for k,text in enumerate(b['lines']):
        if k>0: t+=0.32
        c=tts(text,f'b{bi:02d}_{k:02d}'); d=len(c)/sr
        lines.append({'start':round(t,3),'end':round(t+d,3),'text':text,'beat':bi,'k':k}); clips.append((t,c)); t+=d
    beats.append({'visual':b['visual'],'chapter':b.get('chapter',''),'start':round(b0-0.45 if bi else 0,3),'end':round(t+0.45,3),'lines':[{'start':l['start'],'end':l['end']} for l in lines[li0:]]})
E=round(t+2.0,2); beats[-1]['end']=E
n=int(E*sr); vo=np.zeros(n)
for st,c in clips: i=int(st*sr); vo[i:i+len(c)]+=c[:n-i]
# soft ambient music bed: slow chord pads, very low under the voice
tt=np.arange(n)/sr; bed=np.zeros(n); prog=[(57,60,64),(53,57,60),(48,52,55),(55,59,62)]; bar=6.0
for k in range(int(E/bar)+1):
    ch=prog[k%4]; s0=int(k*bar*sr); s1=min(n,int((k+1)*bar*sr)+sr)
    x=np.arange(s1-s0)/sr; envl=np.minimum(1,np.minimum(x/1.5,(bar+1-x)/1.5)).clip(0)
    for m in ch:
        f=440*2**((m-69)/12); bed[s0:s1]+=(np.sin(2*np.pi*f*x)+.3*np.sin(4*np.pi*f*x))*envl*.05
bed*=np.minimum(1,np.minimum(tt/3,(E-tt)/3))
mix=vo+bed*0.35; mix=mix/np.max(np.abs(mix))*0.9
d=(mix*32767).astype(np.int16); w=wave.open(os.path.join(B,'audio.wav'),'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes(np.stack([d,d],1).tobytes()); w.close()
json.dump({'E':E,'lines':lines,'beats':beats},open(os.path.join(B,'timeline.json'),'w'))
print(f'voice ok: {E:.1f}s ({E/60:.1f} min), {len(lines)} lines, {len(beats)} beats')
