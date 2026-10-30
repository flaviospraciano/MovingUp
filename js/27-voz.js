"use strict";
/* ======================================================================
   VOZ DO JARVIS
   · Voz de IA (Gemini TTS, plano gratuito): voz humana, grave e calma, no estilo de um mordomo britânico.
     Usada nos briefings e nas respostas do Jarvis. O áudio fica guardado no aparelho:
     ouvir de novo não gasta a cota.
   · Voz do aparelho: reserva automática quando não há chave, sem internet ou quando a cota do dia acaba.
     O app escolhe a voz mais natural instalada e deixa você trocar em Ajustes.
   Precisa: geminiKey no config.js (chave grátis do Google AI Studio).
   ====================================================================== */
const VOZ={ctx:null,src:null,seq:0,modelo:null,mem:new Map(),prep:{}};
const VOZ_IA=[["Charon","Grave"],["Algieba","Suave"],["Orus","Firme"],["Iapetus","Clara"]];
const VOZ_MODELOS=["gemini-3.1-flash-tts-preview","gemini-2.5-flash-preview-tts"];
const VOZ_ESTILO=`Leia o texto abaixo em português do Brasil com a voz de um assistente de inteligência artificial sofisticado e leal, no estilo de um mordomo britânico: voz masculina grave, calma e segura, dicção impecável, ritmo tranquilo, pausas curtas entre as frases, cordialidade discreta e um leve toque de humor seco. Leia apenas o texto, sem estas instruções.`;
const vozCfg=()=>{const c=cfg();return{modo:c.vozModo||"ia",nome:c.vozNome||"Charon",aparelho:c.vozAparelho||"",sinal:c.vozSinal!==false};};
const temChaveGemini=()=>!!(window.MU_CONFIG&&MU_CONFIG.geminiKey);
const vozBloqueio=()=>{try{return +localStorage.getItem("mu_tts_ate")||0;}catch(e){return 0;}};
const vozBloqueada=()=>Date.now()<vozBloqueio();
/* tipo: "brief" (briefings), "resp" (respostas do Jarvis) */
const vozUsaIA=tipo=>{const c=vozCfg();return temChaveGemini()&&!vozBloqueada()&&navigator.onLine!==false&&(c.modo==="ia"||(c.modo==="brief"&&tipo==="brief"));};

/* ---------- áudio: o contexto é liberado no primeiro toque (exigência dos navegadores) ---------- */
function vozCtx(){if(!VOZ.ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;VOZ.ctx=new C();}
  if(VOZ.ctx.state==="suspended")VOZ.ctx.resume().catch(()=>{});return VOZ.ctx;}
document.addEventListener("pointerdown",()=>{if(VOZ.ctx||DB.be)vozCtx();},{capture:true,passive:true});
function vozSinal(c,t){const o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain();o.type="sine";o2.type="sine";
  o.frequency.setValueAtTime(880,t);o.frequency.exponentialRampToValueAtTime(1320,t+.12);o2.frequency.setValueAtTime(1760,t+.06);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.05,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.28);
  o.connect(g);o2.connect(g);g.connect(c.destination);o.start(t);o2.start(t+.06);o.stop(t+.3);o2.stop(t+.3);return t+.32;}
function pcmBuffer(c,b64,mime){const rate=+((/rate=(\d+)/i.exec(mime||"")||[])[1]||24000),bin=atob(b64),n=bin.length>>1,buf=c.createBuffer(1,n,rate),ch=buf.getChannelData(0);
  for(let i=0;i<n;i++){let s=bin.charCodeAt(2*i)|(bin.charCodeAt(2*i+1)<<8);if(s>=32768)s-=65536;ch[i]=s/32768;}return buf;}
async function vozDecodifica(c,a){if(/l16|pcm/i.test(a.mime||"")||!a.mime)return pcmBuffer(c,a.b64,a.mime);
  const bin=atob(a.b64),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return c.decodeAudioData(u.buffer);}
async function vozTocar(a,onFim){const c=vozCtx();if(!c)throw new Error("sem áudio");const buf=await vozDecodifica(c,a);
  const src=c.createBufferSource();src.buffer=buf;const g=c.createGain();g.gain.value=1;src.connect(g);g.connect(c.destination);
  const t0=vozCfg().sinal?vozSinal(c,c.currentTime+.02):c.currentTime+.02;src.onended=()=>{if(VOZ.src===src){VOZ.src=null;onFim&&onFim();}};src.start(t0);VOZ.src=src;}

/* ---------- Gemini TTS, com cache no aparelho ---------- */
async function vozHash(s){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));return [...new Uint8Array(b)].slice(0,12).map(x=>x.toString(16).padStart(2,"0")).join("");}
async function vozCacheLer(k){if(VOZ.mem.has(k))return VOZ.mem.get(k);try{const d=await idb();const v=await idbReq(d.transaction("imgs").objectStore("imgs").get(k));if(v)VOZ.mem.set(k,v);return v||null;}catch(e){return null;}}
async function vozCacheGravar(k,v){VOZ.mem.set(k,v);try{const d=await idb();d.transaction("imgs","readwrite").objectStore("imgs").put(v,k);
  let L=[];try{L=JSON.parse(localStorage.getItem("mu_tts_k")||"[]");}catch(e){}L=L.filter(x=>x!==k);L.push(k);
  while(L.length>16){const velho=L.shift();VOZ.mem.delete(velho);d.transaction("imgs","readwrite").objectStore("imgs").delete(velho);}localStorage.setItem("mu_tts_k",JSON.stringify(L));}catch(e){}}
function vozLimite(msg){/* cota do dia: a liberação acontece de madrugada; cota por minuto: espera 1 minuto */
  let ate=Date.now()+65000;if(/per ?day|daily|PerDay|requests_per_day/i.test(msg)){const d=new Date();d.setDate(d.getDate()+(d.getHours()>=5?1:0));d.setHours(5,10,0,0);ate=d.getTime();}
  try{localStorage.setItem("mu_tts_ate",String(ate));}catch(e){}}
async function vozGemini(texto){const nome=vozCfg().nome,ms=VOZ.modelo?[VOZ.modelo]:VOZ_MODELOS;let last=null;
  for(const m of ms){const r=await gFetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`,{method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({contents:[{parts:[{text:VOZ_ESTILO+"\n\n"+texto}]}],generationConfig:{responseModalities:["AUDIO"],speechConfig:{voiceConfig:{prebuiltVoiceConfig:{voiceName:nome}}}}})},MU_CONFIG.geminiKey);
    if(r.status===429){const t=await r.text();vozLimite(t);throw new Error("limite");}
    if(r.status===404||r.status===400){last=new Error("modelo "+m+": "+r.status+" "+(await r.text()).slice(0,200));continue;}
    if(!r.ok)throw new Error("voz "+r.status+" "+(await r.text()).slice(0,200));
    const j=await r.json(),p=(((j.candidates||[])[0]||{}).content||{}).parts||[],a=p.find(x=>x.inlineData&&x.inlineData.data);
    if(!a)throw new Error("resposta sem áudio");VOZ.modelo=m;return{b64:a.inlineData.data,mime:a.inlineData.mimeType||""};}
  throw last||new Error("nenhum modelo de voz disponível");}
async function vozAudio(texto){const k="tts_"+await vozHash(vozCfg().nome+"|"+VOZ_ESTILO.length+"|"+texto);const c=await vozCacheLer(k);if(c)return c;
  const a=await vozGemini(texto);await vozCacheGravar(k,a);return a;}

/* ---------- voz do aparelho, a mais natural possível ---------- */
function vozesPT(){try{return speechSynthesis.getVoices().filter(v=>/^pt[-_]?br/i.test(v.lang)||/portugu[eê]s.*brasil/i.test(v.name));}catch(e){return[];}}
function vozNota(v){const n=v.name;let s=0;if(/natural|neural|online|premium|enhanced|aprimorad|alta qualidade/i.test(n))s+=4;if(/google/i.test(n))s+=2;
  if(/antonio|ant[oô]nio|daniel|ricardo|f[aá]bio|felipe|humberto|male|masculin/i.test(n))s+=3;if(!v.localService)s+=1;return s;}
function vozAparelho(){const L=vozesPT(),q=vozCfg().aparelho;return L.find(v=>v.name===q)||L.slice().sort((a,b)=>vozNota(b)-vozNota(a))[0]||null;}
function falarAparelho(t,onFim){try{if(!("speechSynthesis" in window))return;speechSynthesis.cancel();const v=vozAparelho();
  const P=String(t).replace(/\s+/g," ").match(/[^.!?]+[.!?]*/g)||[String(t)];
  P.forEach((p,i)=>{const u=new SpeechSynthesisUtterance(p.trim());u.lang="pt-BR";if(v)u.voice=v;u.rate=.98;u.pitch=.88;if(i===P.length-1&&onFim)u.onend=onFim;speechSynthesis.speak(u);});}catch(e){}}
try{speechSynthesis.onvoiceschanged=()=>{};speechSynthesis.getVoices();}catch(e){}

/* ---------- a fala do app ---------- */
async function vozFalar(texto,o={}){texto=String(texto||"").trim();if(!texto)return;calar();const id=++VOZ.seq;
  if((o.forcaIA&&vozCfg().modo!=="aparelho"&&temChaveGemini()&&!vozBloqueada())||vozUsaIA(o.tipo||"resp")){
    const t=setTimeout(()=>{if(id===VOZ.seq)toast("audio-lines","Preparando a voz…","");},700);
    try{const a=await Promise.race([vozAudio(texto.slice(0,3000)),new Promise((_,rej)=>setTimeout(()=>rej(new Error("tempo")),35000))]);clearTimeout(t);
      if(id!==VOZ.seq)return;await vozTocar(a,o.onFim);return;}
    catch(e){clearTimeout(t);console.warn("voz",e);if(id!==VOZ.seq)return;
      if(String(e.message)==="limite")toast("audio-lines","Cota de voz de IA esgotada",vozBloqueio()-Date.now()>3600e3?"Até amanhã, uso a voz do aparelho.":"Em um minuto volta.");}}
  falarAparelho(texto,o.onFim);}
calar=function(){VOZ.seq++;try{speechSynthesis.cancel();}catch(e){}if(VOZ.src){try{VOZ.src.stop();}catch(e){}VOZ.src=null;}};
falarLongo=function(t,onFim){return vozFalar(t,{tipo:"resp",onFim});};
falar=function(t){falarAparelho(t);}; /* confirmações curtas do copiloto: voz do aparelho, sem gastar cota */

/* prepara o áudio do briefing assim que ele aparece no Início, para tocar na hora do toque */
const _secBrfVoz=secBriefing;secBriefing=function(){const h=_secBrfVoz.apply(this,arguments);const per=brfPer();
  if(h&&per&&vozUsaIA("brief")){const k=TODAY()+per;if(!VOZ.prep[k]){VOZ.prep[k]=1;setTimeout(()=>{briefTexto(per).then(vozAudio).catch(e=>{console.warn("pré-voz",e);});},2500);}}return h;};

/* ---------- Ajustes → Voz do Jarvis ---------- */
function vozAjustesHTML(){const c=vozCfg(),cf=cfg(),L=vozesPT(),bl=vozBloqueada();
  return `<div class="sec"><h2>${ic("audio-lines")} Voz do Jarvis</h2></div><div class="card">
   <div class="fld" style="margin-top:0"><span>Quando usar a voz de IA</span><div class="seg" data-on="vozModo">${[["ia","Briefings e respostas"],["brief","Só nos briefings"],["aparelho","Nunca"]].map(([k,n])=>`<button data-a="seg" data-v="${k}" aria-pressed="${c.modo===k}">${n}</button>`).join("")}</div></div>
   <div class="fld"><span>Voz de IA</span><div class="seg" data-on="vozNome">${VOZ_IA.map(([k,n])=>`<button data-a="seg" data-v="${k}" aria-pressed="${c.nome===k}">${n}</button>`).join("")}</div></div>
   <div class="fld"><span>Como o Jarvis chama você</span><div class="seg" data-on="vozTrat">${[["senhor","Senhor"],["senhora","Senhora"],["nome","Pelo nome"]].map(([k,n])=>`<button data-a="seg" data-v="${k}" aria-pressed="${(cf.trat||"senhor")===k}">${n}</button>`).join("")}</div></div>
   ${L.length?`<label class="fld"><span>Voz do aparelho (reserva)</span><select data-ch="vozAparelho"><option value="">Automática: a mais natural</option>${L.map(v=>`<option ${c.aparelho===v.name?"selected":""}>${esc(v.name)}</option>`).join("")}</select></label>`:""}
   <div class="wrap-row" style="margin-top:6px"><button class="btn sm" data-a="vozAmostra">${ic("play")} Ouvir amostra</button><button class="btn ghost sm" data-a="vozSinalT">${c.sinal?"Sinal sonoro: ligado":"Sinal sonoro: desligado"}</button></div>
   <p class="tiny faint" style="margin:10px 0 0">${!temChaveGemini()?"Para a voz de IA, cole a chave grátis do Gemini no config.js, em geminiKey (passo a passo no LEIA-ME). Até lá, uso a voz do aparelho.":bl?"A cota gratuita de voz de IA acabou por enquanto. Até ela voltar, uso a voz do aparelho.":"A voz de IA tem cota gratuita diária pequena. Áudios repetidos ficam guardados e não gastam cota."}</p></div>`;}
const _ajustesVoz=VIEWS.ajustes;VIEWS.ajustes=()=>{const h=_ajustesVoz();const i=h.indexOf('<div class="sec"><h2>Minhas frases</h2>');return i<0?h:h.slice(0,i)+vozAjustesHTML()+h.slice(i);};
const vozSalva=(k,v)=>{const c=cfg();c[k]=v;save(c);};
ACT.vozModo=el=>{vozSalva("vozModo",el.dataset.v);rr();};
ACT.vozNome=el=>{vozSalva("vozNome",el.dataset.v);};
ACT.vozTrat=el=>{vozSalva("trat",el.dataset.v);};
ACT.vozSinalT=()=>{vozSalva("vozSinal",!vozCfg().sinal);rr();};
CH.vozAparelho=el=>vozSalva("vozAparelho",el.value);
ACT.vozAmostra=()=>{const c=cfg(),t=c.trat||"senhor",n=t==="nome"?(c.nome||"").split(" ")[0]:t;
  vozFalar(`Bom dia${n?", "+n:""}. Todos os sistemas operacionais. Sua agenda está sob controle e o ciclo segue em bom ritmo. Se me permite a observação, hoje é um excelente dia para subir mais um degrau.`,{tipo:"brief",forcaIA:true});};
