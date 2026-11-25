"use strict";
/* ======================================================================
   JARVIS AO VIVO · conversa por voz em tempo real com a Gemini Live API
   · WebSocket direto com o Google (chave do Gemini salva em Ajustes).
   · Microfone em PCM 16 kHz enviado em pedaços de 100 ms; a resposta chega em áudio 24 kHz
     e toca na hora. O próprio Gemini detecta quando você começa e para de falar.
   · Conhece seus dados (o mesmo resumo do Jarvis) e registra coisas no app falando
     ("gastei 30 no uber", "me lembra de ligar pra Ana amanhã") pela ferramenta registrar_no_app.
   · Sessão de até ~10 minutos; depois é só tocar para continuar.
   ====================================================================== */
const LIVE_WS="wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent";
const LIVE_PADRAO=["gemini-3.1-flash-live-preview","gemini-2.5-flash-native-audio-preview-12-2025","gemini-2.5-flash-native-audio-preview-09-2025","gemini-live-2.5-flash-preview","gemini-2.0-flash-live-001"];
let LV=null;

async function liveModelos(key){try{const c=JSON.parse(localStorage.getItem("mu_livem")||"null");if(c&&c.t>Date.now()-3*864e5&&c.m.length)return c.m;}catch(e){}
  let m=[];try{const r=await gFetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200",{},key);if(r.ok){const j=await r.json();
    const nota=n=>(/native-audio/.test(n)?30:0)+(/live/.test(n)?20:0)+(parseFloat((n.match(/gemini-(\d+(\.\d+)?)/)||[])[1])||0)*10-(/translate|transcribe/.test(n)?200:0);
    m=(j.models||[]).filter(x=>(x.supportedGenerationMethods||[]).includes("bidiGenerateContent")).map(x=>String(x.name).replace(/^models\//,"")).filter(n=>!/translate|transcribe/.test(n)).sort((a,b)=>nota(b)-nota(a));}}catch(e){}
  m=m.concat(LIVE_PADRAO).filter((v,i,a)=>a.indexOf(v)===i);try{localStorage.setItem("mu_livem",JSON.stringify({t:Date.now(),m}));}catch(e){}return m;}

/* ---------- áudio ---------- */
function b64DeInt16(i16){const u=new Uint8Array(i16.buffer);let s="";for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s);}
function int16DeB64(b){const s=atob(b),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return new Int16Array(u.buffer,0,u.length>>1);}
async function liveMic(){const st=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true,channelCount:1}});
  const C=window.AudioContext||window.webkitAudioContext,ctx=new C();if(ctx.state==="suspended")await ctx.resume();
  const src=ctx.createMediaStreamSource(st),pr=ctx.createScriptProcessor(4096,1,1),razao=ctx.sampleRate/16000;let acc=[];
  pr.onaudioprocess=e=>{if(!LV)return;const d=e.inputBuffer.getChannelData(0);let pico=0;
    const n=Math.floor(d.length/razao),o=new Int16Array(n);for(let i=0;i<n;i++){const v=d[Math.floor(i*razao)];const a=Math.abs(v);if(a>pico)pico=a;o[i]=Math.max(-32768,Math.min(32767,v*32767));}
    LV.nivelIn=pico;if(LV.mudo||(LV.falando&&!LV.interromper))return;acc.push(o);const tot=acc.reduce((s,x)=>s+x.length,0);
    if(tot>=1600){const j=new Int16Array(tot);let p=0;acc.forEach(x=>{j.set(x,p);p+=x.length;});acc=[];liveEnviar({realtimeInput:{audio:{data:b64DeInt16(j),mimeType:"audio/pcm;rate=16000"}}});}};
  const zero=ctx.createGain();zero.gain.value=0;src.connect(pr);pr.connect(zero);zero.connect(ctx.destination);
  return{st,ctx,parar(){try{pr.disconnect();src.disconnect();}catch(e){}st.getTracks().forEach(t=>t.stop());ctx.close().catch(()=>{});}};}
function liveTocar(b64,mime){const L=LV;if(!L)return;const rate=+((/rate=(\d+)/.exec(mime||"")||[])[1]||24000),pcm=int16DeB64(b64);if(!pcm.length)return;
  const c=L.saida;const buf=c.createBuffer(1,pcm.length,rate),ch=buf.getChannelData(0);let pico=0;for(let i=0;i<pcm.length;i++){ch[i]=pcm[i]/32768;const a=Math.abs(ch[i]);if(a>pico)pico=a;}
  const s=c.createBufferSource();s.buffer=buf;s.connect(c.destination);const t=Math.max(c.currentTime+.04,L.prox);s.start(t);L.prox=t+buf.duration;L.fontes.push(s);L.falando=true;L.nivelOut=pico;
  s.onended=()=>{L.fontes=L.fontes.filter(x=>x!==s);if(!L.fontes.length&&c.currentTime>=L.prox-.05){setTimeout(()=>{if(LV===L&&!L.fontes.length){L.falando=false;liveStatus();}},250);}};liveStatus();}
function liveCalar(){const L=LV;if(!L)return;L.fontes.forEach(s=>{try{s.stop();}catch(e){}});L.fontes=[];L.prox=0;L.falando=false;liveStatus();}

/* ---------- conexão ---------- */
const liveEnviar=o=>{if(LV&&LV.ws&&LV.ws.readyState===1)LV.ws.send(JSON.stringify(o));};
function liveSistema(){return jarSistema().replace("- A resposta será falada: no máximo 4 frases curtas","- Esta é uma conversa por voz ao vivo, em português do Brasil: respostas curtas e naturais, de 1 a 3 frases")+`
- Quando a pessoa pedir para registrar algo no app (gasto, treino feito, lembrete, compromisso, algo que fez, hábito), chame a ferramenta registrar_no_app com a frase dela e depois confirme em poucas palavras.
- Fale sempre em português do Brasil.

DADOS DO APP:
${jarDados()}`;}
const LIVE_TOOLS=[{functionDeclarations:[{name:"registrar_no_app",description:"Registra no app da pessoa: gastos, checks de treino ou estudo, lembretes, compromissos de agenda, coisas que ela fez hoje e hábitos. Use a frase da pessoa.",
  parameters:{type:"OBJECT",properties:{frase:{type:"STRING",description:"O que registrar, nas palavras da pessoa"}},required:["frase"]}}]}];
async function liveConectar(L,ms,i,comTools){if(i>=ms.length){liveFalha("Nenhum modelo de conversa ao vivo está disponível para a sua chave agora.");return;}
  const m=ms[i],key=MU_CONFIG.geminiKey;L.modelo=m;L.pronto=false;liveStatus("Conectando…");
  let ws;try{ws=new WebSocket(LIVE_WS+"?key="+encodeURIComponent(key));}catch(e){liveFalha("Não consegui abrir a conexão.");return;}L.ws=ws;
  ws.onopen=()=>{const setup={model:"models/"+m,generationConfig:{responseModalities:["AUDIO"],speechConfig:{voiceConfig:{prebuiltVoiceConfig:{voiceName:vozCfg().nome||"Charon"}}}},
      systemInstruction:{parts:[{text:liveSistema()}]},inputAudioTranscription:{},outputAudioTranscription:{}};if(comTools)setup.tools=LIVE_TOOLS;ws.send(JSON.stringify({setup}));};
  ws.onmessage=async ev=>{if(LV!==L)return;let t=ev.data;if(t instanceof Blob)t=await t.text();else if(t instanceof ArrayBuffer)t=new TextDecoder().decode(t);let j;try{j=JSON.parse(t);}catch(e){return;}
    if(j.setupComplete){L.pronto=true;try{localStorage.setItem("mu_livem_ok",m);}catch(e){}liveStatus();return;}
    if(j.serverContent){const sc=j.serverContent;
      if(sc.interrupted)liveCalar();
      (((sc.modelTurn||{}).parts)||[]).forEach(p=>{if(p.inlineData&&p.inlineData.data)liveTocar(p.inlineData.data,p.inlineData.mimeType);});
      if(sc.inputTranscription&&sc.inputTranscription.text){if(L.ultimoQuem!=="eu"){L.eu="";L.ultimoQuem="eu";}L.eu+=sc.inputTranscription.text;liveTexto();}
      if(sc.outputTranscription&&sc.outputTranscription.text){if(L.ultimoQuem!=="jarvis"){L.jv="";L.ultimoQuem="jarvis";}L.jv+=sc.outputTranscription.text;liveTexto();}
      if(sc.turnComplete){if(L.eu||L.jv){JAR.turnos.push({q:(L.eu||"(voz)").trim(),a:(L.jv||"").trim()});if(JAR.turnos.length>40)JAR.turnos.shift();}L.ultimoQuem="";}}
    if(j.toolCall&&j.toolCall.functionCalls){const R=[];for(const fc of j.toolCall.functionCalls){let res="";
        try{if(fc.name==="registrar_no_app"){const A=await parseIA(String((fc.args||{}).frase||""));const d=execAcoes(A);const ok=d.filter(x=>!x.miss);res=ok.length?"Registrado: "+ok.map(x=>x.t).join("; "):"Não consegui registrar. Peça para a pessoa repetir com mais detalhes.";if(ok.length){rr();toast("check","Registrado pelo Jarvis",ok.map(x=>x.t).join(" · "));}}else res="Ferramenta desconhecida.";}
        catch(e){res="Erro ao registrar: "+(e&&e.message||e);}R.push({id:fc.id,name:fc.name,response:{resultado:res}});}
      liveEnviar({toolResponse:{functionResponses:R}});}
    if(j.goAway){liveStatus("A sessão vai terminar em instantes…");}};
  ws.onclose=ev=>{if(LV!==L)return;if(!L.pronto){const r=String(ev.reason||"");console.warn("live fechou",ev.code,r);
      if(comTools&&/tool|function/i.test(r))return liveConectar(L,ms,i,false);
      if(/API key|PERMISSION|permission|unauthor/i.test(r)){liveFalha("O Google recusou a chave para a conversa ao vivo. "+r.slice(0,120));return;}
      if(/quota|RESOURCE_EXHAUSTED|exceeded/i.test(r)){liveFalha("A cota gratuita da conversa ao vivo acabou por hoje.");return;}
      return liveConectar(L,ms,i+1,true);}
    L.pronto=false;liveCalar();liveStatus(ev.code===1000?"Sessão encerrada.":"A conexão caiu.",true);};
  ws.onerror=()=>{};}

/* ---------- tela ---------- */
function liveHTML(){const L=LV;return `<div class="lvp" id="lvp"><div class="kt"><button class="ib" data-a="liveFim" aria-label="Encerrar">${ic("x")}</button><div class="grow small"><b>Jarvis ao vivo</b><span style="display:block;opacity:.7" id="lvM"></span></div>
   <button class="chip ${L.interromper?"c":""}" data-a="liveInterromper" title="Deixe ligado se estiver com fone">${ic(L.interromper?"mic":"mic-off")} Interromper</button></div>
   <div class="lvc"><button class="lvo" id="lvO" data-a="liveToque" aria-label="Tocar para interromper"><span></span></button><div class="lvs" id="lvS">Conectando…</div></div>
   <div class="lvt"><p class="lveu" id="lvE"></p><p class="lvjv" id="lvJ"></p></div>
   <div class="kbtn"><button class="btn ghost" data-a="liveMudo" id="lvMu">${ic(L.mudo?"mic-off":"mic")} ${L.mudo?"Microfone desligado":"Microfone ligado"}</button><button class="btn" data-a="liveFim">${ic("square")} Encerrar</button></div></div>`;}
function liveStatus(t,acabou){const L=LV;if(!L)return;const s=$("lvS");if(!s)return;L.acabou=!!acabou;
  s.textContent=t||(L.mudo?"Microfone desligado":!L.pronto?"Conectando…":L.falando?"Falando… (toque na esfera para interromper)":"Pode falar");
  const o=$("lvO");if(o){o.classList.toggle("fala",!!L.falando);o.classList.toggle("off",!L.pronto);}
  const m=$("lvM");if(m)m.textContent=L.modelo?L.modelo.replace(/^gemini-/,"Gemini "):"";
  if(acabou&&s)s.innerHTML=`${esc(t)} <button class="lk" data-a="liveRetomar" style="color:#fff">Continuar conversa</button>`;}
function liveTexto(){const L=LV;if(!L)return;const e=$("lvE"),j=$("lvJ");if(e)e.textContent=(L.eu||"").trim();if(j)j.textContent=(L.jv||"").trim();}
function liveAnima(){const L=LV;if(!L)return;const o=$("lvO");if(o){const n=L.falando?L.nivelOut||0:L.nivelIn||0;o.style.setProperty("--n",Math.min(1,n*2.2).toFixed(3));L.nivelOut*=.85;}L.raf=requestAnimationFrame(liveAnima);}
function liveFalha(msg){const L=LV;if(!L)return;liveStatus(msg,false);const s=$("lvS");if(s)s.innerHTML=`${esc(msg)}<br><button class="lk" data-a="liveFim" style="color:#fff">Fechar</button>`;}

async function liveAbrir(){if(!(window.MU_CONFIG&&MU_CONFIG.geminiKey))return toast("audio-lines","Falta a chave do Gemini","Cole a chave em Ajustes → Voz do Jarvis.");
  if(!navigator.mediaDevices||!window.WebSocket)return toast("audio-lines","Este navegador não suporta conversa ao vivo","Use o Chrome.");
  if(LV)return;closeSheet();calar();try{vzCancelar();}catch(e){}
  const C=window.AudioContext||window.webkitAudioContext;LV={fontes:[],prox:0,falando:false,mudo:false,interromper:localStorage.getItem("mu_live_int")==="1",eu:"",jv:"",nivelIn:0,nivelOut:0,saida:new C()};
  try{if(LV.saida.state==="suspended")await LV.saida.resume();}catch(e){}
  const d=document.createElement("div");d.id="lvw";d.innerHTML=liveHTML();document.body.appendChild(d);document.body.style.overflow="hidden";guard();liveAnima();
  try{if(navigator.wakeLock)LV.lock=await navigator.wakeLock.request("screen");}catch(e){}
  try{LV.mic=await liveMic();}catch(e){liveFalha("Não consegui usar o microfone. Libere o acesso nas configurações do navegador.");return;}
  const ms=await liveModelos(MU_CONFIG.geminiKey);let ok="";try{ok=localStorage.getItem("mu_livem_ok")||"";}catch(e){}
  liveConectar(LV,ok?[ok].concat(ms.filter(x=>x!==ok)):ms,0,true);}
function liveFechar(){const L=LV;if(!L)return;LV=null;cancelAnimationFrame(L.raf);try{L.ws&&L.ws.close(1000);}catch(e){}try{L.mic&&L.mic.parar();}catch(e){}
  L.fontes.forEach(s=>{try{s.stop();}catch(e){}});try{L.saida.close();}catch(e){}try{L.lock&&L.lock.release();}catch(e){}
  const d=$("lvw");if(d)d.remove();document.body.style.overflow="";rr();}
ACT.liveAbrir=()=>liveAbrir();
ACT.liveFim=()=>liveFechar();
ACT.liveToque=()=>{if(LV&&LV.falando)liveCalar();};
ACT.liveMudo=()=>{if(!LV)return;LV.mudo=!LV.mudo;const b=$("lvMu");if(b)b.innerHTML=`${ic(LV.mudo?"mic-off":"mic")} ${LV.mudo?"Microfone desligado":"Microfone ligado"}`;liveStatus();};
ACT.liveInterromper=el=>{if(!LV)return;LV.interromper=!LV.interromper;try{localStorage.setItem("mu_live_int",LV.interromper?"1":"0");}catch(e){}el.classList.toggle("c",LV.interromper);el.innerHTML=`${ic(LV.interromper?"mic":"mic-off")} Interromper`;
  toast("mic",LV.interromper?"Você pode interromper falando":"Ele termina de falar antes de ouvir",LV.interromper?"Melhor com fone de ouvido.":"Toque na esfera para cortar a fala.");};
ACT.liveRetomar=async()=>{const L=LV;if(!L)return;const ms=await liveModelos(MU_CONFIG.geminiKey);liveConectar(L,[L.modelo].concat(ms.filter(x=>x!==L.modelo)),0,true);};
window.addEventListener("popstate",e=>{if(LV){e.stopImmediatePropagation();GUARD=false;guard();liveFechar();}},true);

/* entradas: botão "Ao vivo" no Jarvis e no microfone do Início */
const _jarSheetLive=jarSheet;jarSheet=function(){const r=_jarSheetLive.apply(this,arguments);const h=document.querySelector("#sheet .row");
  if(h&&!h.querySelector('[data-a="liveAbrir"]'))h.insertAdjacentHTML("beforeend",`<button class="chip c" data-a="liveAbrir" title="Conversa por voz em tempo real">${ic("audio-lines")} Ao vivo</button>`);return r;};
const _copiMicLive=ACT.copiMic;ACT.copiMic=function(){const r=_copiMicLive.apply(this,arguments);const b=document.querySelector("#sheet .btns");
  if(b&&window.MU_CONFIG&&MU_CONFIG.geminiKey)b.insertAdjacentHTML("afterbegin",`<button class="btn ghost full" data-a="liveAbrir">${ic("audio-lines")} Conversa ao vivo com o Jarvis</button>`);return r;};
