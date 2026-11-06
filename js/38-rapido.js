"use strict";
/* ======================================================================
   JARVIS DE BATE-PRONTO
   · A resposta chega em fluxo (streaming): o texto aparece enquanto a IA escreve.
   · A voz começa na PRIMEIRA frase, enquanto o resto ainda está sendo gerado.
   · Modelo mais rápido primeiro (Flash-Lite), sem "pensar" antes de responder.
   · Os dados do app ficam pré-montados por 30 s e a conexão com o Google é aberta antes.
   ====================================================================== */
(()=>{try{["https://generativelanguage.googleapis.com"].forEach(h=>{const l=document.createElement("link");l.rel="preconnect";l.href=h;l.crossOrigin="";document.head.appendChild(l);});}catch(e){}})();

/* dados do Jarvis em cache curto (invalidado a cada gravação) */
const JDC={t:0,v:""};const _jarDadosC=jarDados;jarDados=function(){if(JDC.v&&Date.now()-JDC.t<30000)return JDC.v;JDC.v=_jarDadosC.apply(this,arguments);JDC.t=Date.now();return JDC.v;};
const _saveJDC=save;save=function(){JDC.t=0;return _saveJDC.apply(this,arguments);};
const jarAquecer=()=>{setTimeout(()=>{try{jarDados();}catch(e){}if(window.MU_CONFIG&&MU_CONFIG.geminiKey)iaModelos(MU_CONFIG.geminiKey).catch(()=>{});},50);};
const _jarSheetQ=jarSheet;jarSheet=function(){if(!JDC.v||Date.now()-JDC.t>25000)jarAquecer();return _jarSheetQ.apply(this,arguments);};

/* ---------- IA em fluxo ---------- */
async function geminiStream(parts,o,onTexto){const key=window.MU_CONFIG&&MU_CONFIG.geminiKey;if(!key)throw iaErro(0,"sem chave","");
  let salvo="";try{salvo=localStorage.getItem("mu_iam_r")||"";}catch(e){}
  const desc=await iaModelos(key);let ms=[salvo].concat(desc,IA_MODELOS).filter((v,i,a)=>v&&a.indexOf(v)===i);
  if(o.rapido)ms=ms.filter(m=>/lite/.test(m)).concat(ms.filter(m=>!/lite/.test(m)));if(salvo)ms=[salvo].concat(ms.filter(m=>m!==salvo));
  let last=null;
  for(const m of ms){for(const pensar of [false,true]){
    const gc={temperature:o.temp!=null?o.temp:.3,maxOutputTokens:o.max||700};if(!pensar)gc.thinkingConfig={thinkingBudget:0};
    const body={contents:[{role:"user",parts}],generationConfig:gc};if(o.sys)body.systemInstruction={parts:[{text:o.sys}]};
    let r;try{r=await gFetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:streamGenerateContent?alt=sse`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)},key);}
    catch(e){throw iaErro(0,String(e),m);}
    if(!r.ok){const err=await r.text();last=iaErro(r.status,err,m);if(r.status===400&&/thinking|budget/i.test(err)&&!pensar)continue;if(r.status===403||(r.status===400&&/API key/i.test(err)))throw last;break;}
    if(!r.body||!r.body.getReader){const j=await r.text();let txt="";j.split("\n").forEach(l=>{if(l.startsWith("data:"))try{const x=JSON.parse(l.slice(5));txt+=((((x.candidates||[])[0]||{}).content||{}).parts||[]).filter(p=>!p.thought).map(p=>p.text||"").join("");}catch(e){}});if(txt){onTexto&&onTexto(txt,true);return txt;}break;}
    const rd=r.body.getReader(),dec=new TextDecoder();let buf="",txt="";
    while(true){const {done,value}=await rd.read();if(done)break;buf+=dec.decode(value,{stream:true}).replace(/\r/g,"");let i;
      while((i=buf.indexOf("\n\n"))>=0){const ev=buf.slice(0,i);buf=buf.slice(i+2);ev.split("\n").forEach(l=>{if(!l.startsWith("data:"))return;try{const x=JSON.parse(l.slice(5));
        const t=((((x.candidates||[])[0]||{}).content||{}).parts||[]).filter(p=>!p.thought).map(p=>p.text||"").join("");if(t){txt+=t;onTexto&&onTexto(txt,false);}}catch(e){}});}}
    if(txt.trim()){try{localStorage.setItem("mu_iam_r",m);}catch(e){}onTexto&&onTexto(txt,true);return txt.trim();}
    last=iaErro(200,"resposta vazia",m);break;}}
  throw last||iaErro(0,"sem modelos","");}

/* ---------- voz em fila: fala a primeira frase enquanto o resto chega ---------- */
function falarFrase(t){return new Promise(res=>{try{const u=new SpeechSynthesisUtterance(t);u.lang="pt-BR";const v=vozAparelho();if(v)u.voice=v;u.rate=.98;u.pitch=.88;u.onend=res;u.onerror=res;speechSynthesis.speak(u);}catch(e){res();}});}
async function tocarAudio(a,sinal){const c=vozCtx();if(!c)throw new Error("sem áudio");const buf=await vozDecodifica(c,a);return new Promise(res=>{const src=c.createBufferSource();src.buffer=buf;src.connect(c.destination);
  const t0=sinal?vozSinal(c,c.currentTime+.02):c.currentTime+.02;src.onended=()=>{if(VOZ.src===src)VOZ.src=null;res();};src.start(t0);VOZ.src=src;});}
function vozFluxo(onFim){calar();const id=++VOZ.seq,ia=vozUsaIA("resp"),fila=[];let tocando=false,acabou=false,primeiro=true;
  const vivo=()=>id===VOZ.seq;
  async function tocar(){if(tocando||!fila.length||!vivo())return;tocando=true;const it=fila.shift();
    try{let a=null;if(it.p)a=await it.p;if(!vivo())return;if(a)await tocarAudio(a,primeiro&&vozCfg().sinal);else await falarFrase(it.t);}catch(e){if(vivo())await falarFrase(it.t);}
    primeiro=false;tocando=false;if(!vivo())return;if(fila.length)tocar();else if(acabou)onFim&&onFim();}
  return{ia,push(t){t=String(t||"").trim();if(!t||!vivo())return;fila.push({t,p:ia?vozAudio(t).catch(e=>{if(String(e.message)==="limite")toast("audio-lines","Cota de voz de IA esgotada","Uso a voz do aparelho.");return null;}):null});tocar();},
    fim(){acabou=true;if(!tocando&&!fila.length&&vivo())onFim&&onFim();}};}

/* ---------- pergunta com resposta em fluxo ---------- */
const _jarPerguntarLento=jarPerguntar;
jarPerguntar=async function(q){q=String(q||"").trim();if(!q||JAR.busy)return;
  if(!(window.MU_CONFIG&&MU_CONFIG.geminiKey))return _jarPerguntarLento.apply(this,arguments);
  ditarParar();jarParar();calar();JAR.busy=true;const turno={q,a:""};JAR.turnos.push(turno);jarSheet(true);
  const fim=()=>{if(JAR.conversa&&!$("sheet").classList.contains("hidden")&&$("jarI"))jarOuvir();};
  const voz=vozFluxo(fim);let enviado=0,tRender=0;
  const fala=(txt,final)=>{const resto=txt.slice(enviado);
    if(!final){const m=resto.match(/^[\s\S]{12,}?[.!?…](?=\s)/);if(m&&(enviado===0||!voz.ia)){voz.push(m[0]);enviado+=m[0].length;}}
    else{if(resto.trim())voz.push(resto);enviado=txt.length;voz.fim();}};
  const hist=JAR.turnos.slice(-5,-1).filter(x=>x.a&&!x.erro).map(x=>`Pessoa: ${x.q}\nJarvis: ${x.a}`).join("\n");
  const corpo=`DADOS DO APP:\n${jarDados()}\n\n${hist?"CONVERSA ATÉ AQUI:\n"+hist+"\n\n":""}PERGUNTA: ${q}`;
  try{await Promise.race([geminiStream([{text:corpo}],{sys:jarSistema(),temp:.3,max:600,rapido:true},(txt,final)=>{turno.a=txt;fala(txt,final);
        const agora=Date.now();if(final||agora-tRender>140){tRender=agora;if(!$("sheet").classList.contains("hidden"))jarSheet(!final);}}),
      new Promise((_,rej)=>setTimeout(()=>rej(new Error("tempo")),25000))]);
    JAR.busy=false;if(!$("sheet").classList.contains("hidden"))jarSheet(false);}
  catch(e){console.warn("jarvis fluxo",e);JAR.busy=false;
    if(!turno.a){JAR.turnos.pop();if(FBCFG&&!(e&&e.status===403))return _jarPerguntarLento.call(this,q);
      turno.erro=true;turno.a=/tempo/.test(String(e&&e.message))?"A IA demorou demais para responder. Tente de novo em instantes.":(e&&e.amigavel)||"Não consegui falar com a IA agora. Veja Ajustes → Diagnóstico da IA.";JAR.turnos.push(turno);}
    else voz.fim();
    if(!$("sheet").classList.contains("hidden"))jarSheet(false);}};
