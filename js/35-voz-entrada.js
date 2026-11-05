"use strict";
/* ======================================================================
   OUVIR · reconhecimento de voz robusto para o copiloto, o Jarvis e os ditados
   O Chrome do Android repete pedaços da fala quando o reconhecimento é contínuo
   ("Jarvis, Jarvis Qual, Jarvis Qual foi…"). Aqui o texto é remontado a cada evento a partir
   da lista completa de resultados, descartando as versões parciais repetidas.
   · Termina sozinho quando você para de falar (silêncio configurável) ou ao tocar no botão.
   · Reinicia por conta própria se o navegador encerrar no meio, sem perder o que já foi dito.
   · Remove "Jarvis" do começo e mostra mensagens claras para cada tipo de erro.
   ====================================================================== */
const VZ={s:null};
const vzNorm=s=>normTxt(s).replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim();
/* junta os resultados descartando as versões cumulativas e repetidas */
function vzJuntar(L){const out=[];for(const raw of L){const t=String(raw||"").replace(/\s+/g," ").trim();if(!t)continue;const n=vzNorm(t);if(!n)continue;
    if(!out.length){out.push(t);continue;}const ult=vzNorm(out[out.length-1]);
    if(n===ult||ult.endsWith(n))continue;
    const wl=ult.split(" "),wn=n.split(" ");let cp=0;while(cp<wl.length&&cp<wn.length&&wl[cp]===wn[cp])cp++;
    /* mesma frase sendo revisada pelo reconhecedor (começa igual): fica a versão mais completa */
    if(cp>=Math.min(2,wl.length,wn.length)&&cp>0){if(wn.length>=wl.length)out[out.length-1]=t;continue;}
    out.push(t);}
  return out.join(" ");}
const vzLimpa=t=>String(t||"").replace(/^\s*((ei|oi|olá|ola|e aí|e ai|ok)[,!]?\s+)?(jarvis[,.!:]?\s*)+/i,"").replace(/\s+/g," ").trim();
const VZ_ERROS={"not-allowed":["Microfone bloqueado","Libere o microfone para este site nas configurações do navegador."],"service-not-allowed":["Microfone bloqueado","Libere o microfone para este site nas configurações do navegador."],
  "audio-capture":["Microfone indisponível","Outro app pode estar usando o microfone."],"network":["Sem internet para reconhecer a voz","O reconhecimento de voz do Chrome precisa de internet."],"language-not-supported":["Idioma não disponível","Instale o português do Brasil no reconhecimento de voz do Google."]};
/* o: {silencio (ms, 0 = só para no botão), onTexto(t), onFim(t), max (ms)} */
function ouvir(o){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){toast("mic","Este navegador não reconhece voz","Use o Chrome no Android ou no computador. Ou digite.");return false;}
  vzCancelar();try{calar();}catch(e){}
  const S={o,base:"",sess:"",ativo:true,fim:false,timer:null,ultimo:Date.now(),inicio:Date.now(),r:null,ouviu:false};VZ.s=S;
  const texto=()=>vzLimpa((S.base+" "+S.sess).trim());
  const agendaSilencio=()=>{clearTimeout(S.timer);if(!o.silencio)return;S.timer=setTimeout(()=>{if(VZ.s===S&&texto())vzFinalizar();},o.silencio);};
  const iniciar=()=>{const r=new SR();r.lang="pt-BR";r.continuous=true;r.interimResults=true;r.maxAlternatives=1;S.r=r;
    r.onresult=e=>{const L=[];for(let i=0;i<e.results.length;i++)L.push(e.results[i][0].transcript);S.sess=vzJuntar(L);S.ultimo=Date.now();S.ouviu=true;o.onTexto&&o.onTexto(texto());agendaSilencio();};
    r.onerror=ev=>{if(ev.error==="no-speech"||ev.error==="aborted")return;const m=VZ_ERROS[ev.error];if(m){S.ativo=false;toast("mic",m[0],m[1]);}};
    r.onend=()=>{if(VZ.s!==S)return;if(S.sess){S.base=vzJuntar([S.base,S.sess]);S.sess="";}
      const tempo=Date.now()-S.inicio;
      if(S.ativo&&!S.fim&&tempo<(o.max||120000)&&!(o.silencio&&texto()&&Date.now()-S.ultimo>=o.silencio)&&!(!S.ouviu&&tempo>9000)){try{iniciar();return;}catch(e){}}
      vzFinalizar();};
    try{r.start();}catch(e){S.ativo=false;}};
  iniciar();if(o.silencio)S.timer=setTimeout(()=>{if(VZ.s===S&&!texto()){vzFinalizar();}},9000);return true;}
function vzFinalizar(){const S=VZ.s;if(!S||S.fim)return;S.fim=true;S.ativo=false;clearTimeout(S.timer);VZ.s=null;
  if(S.sess){S.base=vzJuntar([S.base,S.sess]);S.sess="";}const r=S.r;if(r){r.onend=null;r.onresult=null;try{r.stop();}catch(e){}}
  const t=vzLimpa(S.base);S.o.onFim&&S.o.onFim(t);}
function vzCancelar(){const S=VZ.s;if(!S)return;S.fim=true;S.ativo=false;clearTimeout(S.timer);VZ.s=null;const r=S.r;if(r){r.onend=null;r.onresult=null;try{r.abort();}catch(e){}}}

/* ---------- copiloto do Início ---------- */
ACT.copiMic=()=>{sheet(`<h2>${ic("audio-lines")} Fale com o Jarvis</h2><p class="muted small" style="margin:4px 0 0">Dê ordens (<i>gastei 32 no almoço no cartão</i>) ou pergunte (<i>quanto gastei com gasolina nos últimos dois meses?</i>). Quando você parar de falar, eu executo.</p>
   <div class="micw"><button class="mic on" data-a="copiStop" aria-label="Pronto">${ic("mic")}</button></div><div id="micT" class="mict">Ouvindo…</div>
   <div class="btns"><button class="btn full" data-a="copiStop">${ic("check")} Pronto</button><button class="btn ghost full" data-a="micCancel">Cancelar</button></div>`);
  const ok=ouvir({silencio:2000,onTexto:t=>{const m=$("micT");if(m)m.textContent=t||"Ouvindo…";},
    onFim:t=>{if(!t){closeSheet();return toast("mic","Não ouvi nada","Toque no microfone e fale perto do celular.");}copiRun(t);}});
  if(!ok)closeSheet();};
ACT.copiStop=()=>{if(VZ.s)vzFinalizar();};
ACT.micCancel=()=>{vzCancelar();closeSheet();};

/* ---------- Jarvis ---------- */
jarOuvir=function(){JAR.ouvindo=true;jarSheet(false);
  const ok=ouvir({silencio:1600,onTexto:t=>{const i=$("jarI");if(i)i.value=t;const o=$("jarOuv");if(o)o.textContent=t?"Ouvindo… (pare de falar para enviar)":"Ouvindo…";},
    onFim:t=>{JAR.ouvindo=false;if(t)jarPerguntar(t);else if(!$("sheet").classList.contains("hidden"))jarSheet(false);}});
  if(!ok){JAR.ouvindo=false;jarSheet(false);}};
jarParar=function(){if(VZ.s){vzCancelar();}JAR.ouvindo=false;};
ACT.jarMic=()=>{if(JAR.ouvindo&&VZ.s){vzFinalizar();return;}jarOuvir();};

/* ---------- ditado em campos de texto (Feynman e outros) ---------- */
ditar=function(campoId,btnId){if(DIT){ditarParar();return;}const campo=$(campoId);if(!campo)return;const base=campo.value?campo.value.replace(/\s*$/," "):"",btn=$(btnId);
  const ok=ouvir({silencio:0,max:600000,onTexto:t=>{const c=$(campoId);if(c)c.value=base+t;},onFim:t=>{const c=$(campoId);if(c&&t)c.value=base+t;DIT=null;if(btn&&btn.isConnected){btn.classList.remove("rec");btn.innerHTML=btn.dataset.curto?ic("mic"):`${ic("mic")} Falar em vez de digitar`;}}});
  if(!ok)return;DIT={btn};if(btn){btn.classList.add("rec");btn.innerHTML=btn.dataset.curto?ic("square"):`${ic("square")} Parar de gravar`;}};
ditarParar=function(){if(DIT&&VZ.s)vzFinalizar();DIT=null;};

/* ---------- Ajustes → Diagnóstico da IA ---------- */
const _vozAjDiag=vozAjustesHTML;vozAjustesHTML=function(){const h=_vozAjDiag.apply(this,arguments);
  return h.replace(/<\/div>$/,`<div class="wrap-row" style="margin-top:10px"><button class="btn ghost sm" data-a="iaDiag">${ic("activity")} Diagnóstico da IA</button></div></div>`);};
ACT.iaDiag=async()=>{const L=[],linha=(ok,t,d)=>L.push(`<div class="ctlog"><span>${ic(ok?"circle-check":"circle-alert")}</span><span class="grow"><b>${esc(t)}</b>${d?`<span class="tiny muted" style="display:block">${esc(d)}</span>`:""}</span></div>`);
  const render=fim=>sheet(`<h2>Diagnóstico da IA</h2><div class="small">${L.join("")}</div>${fim?"":`<div class="bar" style="margin-top:10px"><i style="width:45%"></i></div>`}<div class="btns"><button class="btn ghost full" data-a="close">Fechar</button></div>`);
  render(false);const key=window.MU_CONFIG&&MU_CONFIG.geminiKey;
  linha(!!key,key?"Chave do Gemini encontrada no config.js":"Sem chave do Gemini no config.js",key?"…"+String(key).slice(-4):"Crie em aistudio.google.com/apikey e cole em geminiKey.");
  linha(navigator.onLine!==false,navigator.onLine!==false?"Internet conectada":"Sem internet","");
  linha(!!(window.SpeechRecognition||window.webkitSpeechRecognition),(window.SpeechRecognition||window.webkitSpeechRecognition)?"Reconhecimento de voz disponível":"Este navegador não reconhece voz","Funciona no Chrome (Android e computador).");render(false);
  if(key){try{localStorage.removeItem("mu_iams");}catch(e){}const ms=await iaModelos(key);linha(ms.length>0,ms.length?"Modelos disponíveis para a chave":"Não consegui listar os modelos",ms.join(", "));render(false);
    const t0=Date.now();try{const r=await geminiREST([{text:"Responda apenas: ok"}],{max:20});linha(true,`IA respondeu em ${((Date.now()-t0)/1000).toFixed(1)} s`,"Modelo: "+(localStorage.getItem("mu_iam")||"?")+" · resposta: "+r.slice(0,20));}
    catch(e){linha(false,"A IA não respondeu",(e.amigavel||"")+" "+String(e.message||"").slice(0,180));}}
  if(FBCFG){const t0=Date.now();try{await Promise.race([aiFirebase([{text:'Responda só com JSON: {"ok":true}'}]),new Promise((_,j)=>setTimeout(()=>j(new Error("tempo esgotado")),15000))]);linha(true,`IA do Firebase respondeu em ${((Date.now()-t0)/1000).toFixed(1)} s`,"");}
    catch(e){linha(!!key,key?"IA do Firebase indisponível (sem problema: a chave do Gemini é usada)":"IA do Firebase indisponível",String(e&&e.message||e).slice(0,160));}}
  render(true);};
const _closeSheetVz=closeSheet;closeSheet=function(){vzCancelar();return _closeSheetVz.apply(this,arguments);};
