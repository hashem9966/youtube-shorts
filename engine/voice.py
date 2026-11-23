#!/usr/bin/env python3
"""Voiceover + timeline + sound effects for one episode.
usage: python3 engine/voice.py episodes/<slug>
Reads <ep>/script.json, writes <ep>/build/{timeline.json,audio.wav}.
Needs: pip install edge-tts ; network host speech.platform.bing.com (via the session proxy)."""
import json, os, subprocess, sys, wave
import numpy as np
EP=sys.argv[1]; B=os.path.join(EP,'build'); os.makedirs(B,exist_ok=True)
sc=json.load(open(os.path.join(EP,'script.json')))
voice=sc.get('voice','ar-SA-HamedNeural'); rate=sc.get('rate','+25%'); design=sc.get('design_duration',30.0)
sr=44100
env=dict(os.environ, SSL_CERT_FILE=os.environ.get('SSL_CERT_FILE','/root/.ccr/ca-bundle.crt'))
proxy=os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')
def tts(text,i):
    mp3=os.path.join(B,f'l{i}.mp3'); wav=os.path.join(B,f'l{i}.wav')
    cmd=['edge-tts','--voice',voice,f'--rate={rate}','--text',text,'--write-media',mp3]
    if proxy: cmd[1:1]=['--proxy',proxy]
    for _ in range(3):
        subprocess.run(cmd,env=env,stdin=subprocess.DEVNULL,capture_output=True)
        if os.path.exists(mp3) and os.path.getsize(mp3)>1000: break
    else: sys.exit(f'TTS failed for line {i}: {text}')
    af='silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse'
    subprocess.run(['ffmpeg','-nostdin','-loglevel','error','-y','-i',mp3,'-af',af,'-ar',str(sr),'-ac','1',wav],check=True)
    w=wave.open(wav); a=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float)/32768; return a
t=0.2; anchors=[(0.0,0.0)]; caps=[]; clips=[]
for i,L in enumerate(sc['lines']):
    if i>0: t+=L.get('pause_before', 0.45 if L.get('scene_start') else 0.12)
    clip=tts(L.get('tts',L['caption']),i); d=len(clip)/sr
    a,b=L['at']; anchors+= [(t,a),(t+d,b)]; clips.append((t,clip)); caps.append([round(t-0.05,3),round(t+d+0.2,3),L['caption']])
    t+=d
E=round(t+sc.get('tail',0.9),2); anchors.append((E,design))
for k in range(len(caps)-1): caps[k][1]=min(caps[k][1],caps[k+1][0])
n=int(E*sr); vo=np.zeros(n)
for st,c in clips: i=int(st*sr); vo[i:i+len(c)]+=c[:n-i]
ax=np.array(anchors); newt=lambda o: float(np.interp(o,ax[:,1],ax[:,0]))
rng=np.random.default_rng(1); sfx=np.zeros(n)
def envl(L,a,d): x=np.arange(L)/sr; return np.minimum(x/a,1)*np.exp(-x/d)
def add(s,at):
    i=int(at*sr); j=min(n,i+len(s))
    if 0<=i<n: sfx[i:j]+=s[:j-i]
def whoosh(at):
    L=int(.6*sr); x=np.arange(L)/sr; add(np.convolve(rng.normal(0,1,L),np.ones(25)/25,'same')*np.sin(np.pi*x/.6)**2*.35,at-.3)
def spark(at):
    L=int(.25*sr); add(np.diff(np.concatenate([[0],rng.normal(0,1,L)*envl(L,.001,.04)*.25])),at)
def boom(at):
    L=int(.8*sr); x=np.arange(L)/sr; add((np.sin(2*np.pi*(40+60*np.exp(-x*8))*x)+.4*np.convolve(rng.normal(0,1,L),np.ones(60)/60,'same'))*np.exp(-x*5)*.4,at)
def pop(at):
    L=int(.12*sr); x=np.arange(L)/sr; add(np.sin(2*np.pi*900*(1+2*x)*x)*envl(L,.001,.04)*.12,at)
def ding(at):
    L=int(.6*sr); x=np.arange(L)/sr; add((np.sin(2*np.pi*1320*x)+.5*np.sin(2*np.pi*1980*x))*envl(L,.002,.18)*.12,at)
FX=dict(whoosh=whoosh,spark=spark,boom=boom,pop=pop,ding=ding)
for k,times in sc.get('sfx',{}).items():
    for o in times: FX[k](newt(o))
mix=vo+sfx*0.55; mix*=np.minimum(1,(E-np.arange(n)/sr)/0.4); mix=mix/np.max(np.abs(mix))*0.9
d=(mix*32767).astype(np.int16); w=wave.open(os.path.join(B,'audio.wav'),'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes(np.stack([d,d],1).tobytes()); w.close()
json.dump({'E':E,'anchors':anchors,'caps':caps},open(os.path.join(B,'timeline.json'),'w'),ensure_ascii=False)
print(f'voice ok: {E:.1f}s, {len(caps)} lines')
