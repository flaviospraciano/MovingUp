"use strict";
/* ======================================================================
   4.2 · JARVIS NO PADRÃO MAIS NOVO DE IA (novembro de 2026)
   · Cérebro: Gemini 4 Hydrogen (gemini-4-hydrogen, plano gratuito), com reserva no Gemini 3.8 Flash.
     O Gemini 4 recusa thinkingBudget (erro 400) e ignora temperature: cada família recebe o parâmetro certo
     (thinkingLevel "low" nas respostas rápidas, "high" nas análises). Modelos só pagos (Carbon, Argon) ficam de fora.
   · Busca do Google dentro do Jarvis (ferramenta google_search) para perguntas sobre o mundo, com as fontes.
   · Gemini Decisions API (gemini-decision-1): entende em ~0,2 s o tipo de pedido antes de chamar o modelo grande.
   · Voz: Gemini 3.8 Flash TTS (estilo em speech_metadata, áudio WAV) e ElevenLabs (Eleven v4) como opção.
   · Ao vivo: Gemini 3.8 Live (gemini-3.8-live) primeiro.
   · "Ei, Jarvis" com o app aberto · Encaixar na agenda · Advogado do diabo nas decisões.
   ====================================================================== */

/* ícones novos desta versão (Lucide, licença ISC) */
Object.assign(ICONS,{"battery-charging": "<path d=\"M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2\" /> <path d=\"M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1\" /> <path d=\"m11 7-3 5h4l-3 5\" /> <line x1=\"22\" x2=\"22\" y1=\"11\" y2=\"13\" />", "battery-low": "<rect width=\"16\" height=\"10\" x=\"2\" y=\"7\" rx=\"2\" ry=\"2\" /> <line x1=\"22\" x2=\"22\" y1=\"11\" y2=\"13\" /> <line x1=\"6\" x2=\"6\" y1=\"11\" y2=\"13\" />", "calendar-range": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" /> <path d=\"M16 2v4\" /> <path d=\"M3 10h18\" /> <path d=\"M8 2v4\" /> <path d=\"M17 14h-6\" /> <path d=\"M13 18H7\" /> <path d=\"M7 14h.01\" /> <path d=\"M17 18h.01\" />", "calendar-search": "<path d=\"M16 2v4\" /> <path d=\"M21 11.75V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.25\" /> <path d=\"m22 22-1.875-1.875\" /> <path d=\"M3 10h18\" /> <path d=\"M8 2v4\" /> <circle cx=\"18\" cy=\"18\" r=\"3\" />", "calendar-x": "<path d=\"M8 2v4\" /> <path d=\"M16 2v4\" /> <rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" /> <path d=\"M3 10h18\" /> <path d=\"m14 14-4 4\" /> <path d=\"m10 14 4 4\" />", "external-link": "<path d=\"M15 3h6v6\" /> <path d=\"M10 14 21 3\" /> <path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\" />", "file-up": "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\" /> <path d=\"M14 2v4a2 2 0 0 0 2 2h4\" /> <path d=\"M12 12v6\" /> <path d=\"m15 15-3-3-3 3\" />", "flask-conical": "<path d=\"M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2\" /> <path d=\"M8.5 2h7\" /> <path d=\"M7 16h10\" />", "image": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" ry=\"2\" /> <circle cx=\"9\" cy=\"9\" r=\"2\" /> <path d=\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\" />", "monitor": "<rect width=\"20\" height=\"14\" x=\"2\" y=\"3\" rx=\"2\" /> <line x1=\"8\" x2=\"16\" y1=\"21\" y2=\"21\" /> <line x1=\"12\" x2=\"12\" y1=\"17\" y2=\"21\" />", "scan-eye": "<path d=\"M3 7V5a2 2 0 0 1 2-2h2\" /> <path d=\"M17 3h2a2 2 0 0 1 2 2v2\" /> <path d=\"M21 17v2a2 2 0 0 1-2 2h-2\" /> <path d=\"M7 21H5a2 2 0 0 1-2-2v-2\" /> <circle cx=\"12\" cy=\"12\" r=\"1\" /> <path d=\"M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0\" />", "sheet": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" ry=\"2\" /> <line x1=\"3\" x2=\"21\" y1=\"9\" y2=\"9\" /> <line x1=\"3\" x2=\"21\" y1=\"15\" y2=\"15\" /> <line x1=\"9\" x2=\"9\" y1=\"9\" y2=\"21\" /> <line x1=\"15\" x2=\"15\" y1=\"9\" y2=\"21\" />", "siren": "<path d=\"M7 18v-6a5 5 0 1 1 10 0v6\" /> <path d=\"M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z\" /> <path d=\"M21 12h1\" /> <path d=\"M18.5 4.5 18 5\" /> <path d=\"M2 12h1\" /> <path d=\"M12 2v1\" /> <path d=\"m4.929 4.929.707.707\" /> <path d=\"M12 12v6\" />", "switch-camera": "<path d=\"M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5\" /> <path d=\"M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5\" /> <circle cx=\"12\" cy=\"12\" r=\"3\" /> <path d=\"m18 22-3-3 3-3\" /> <path d=\"m6 2 3 3-3 3\" />", "table": "<path d=\"M12 3v18\" /> <rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" /> <path d=\"M3 9h18\" /> <path d=\"M3 15h18\" />", "unlink": "<path d=\"m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71\" /> <path d=\"m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71\" /> <line x1=\"8\" x2=\"8\" y1=\"2\" y2=\"5\" /> <line x1=\"2\" x2=\"5\" y1=\"8\" y2=\"8\" /> <line x1=\"16\" x2=\"16\" y1=\"19\" y2=\"22\" /> <line x1=\"19\" x2=\"22\" y1=\"16\" y2=\"16\" />", "user": "<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\" /> <circle cx=\"12\" cy=\"7\" r=\"4\" />", "message-circle-off": "<path d=\"M20.5 14.9A9 9 0 0 0 9.1 3.5\" /> <path d=\"m2 2 20 20\" /> <path d=\"M5.6 5.6C3 8.3 2.2 12.5 4 16l-2 6 6-2c3.4 1.8 7.6 1.1 10.3-1.7\" />", "copy-check": "<path d=\"m12 15 2 2 4-4\" /> <rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\" /> <path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\" />", "file-question": "<path d=\"M12 17h.01\" /> <path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z\" /> <path d=\"M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3\" />"});
const IA42={ground:null,dec:null,decAte:0};
const IA_PAGO=/gemini-4-(carbon|argon|neon)/;
IA_MODELOS.length=0;IA_MODELOS.push("gemini-4-hydrogen","gemini-flash-latest","gemini-3.8-flash","gemini-3.6-flash","gemini-flash-lite-latest","gemini-3.5-flash-lite");
/* migração única: esquece o modelo salvo antigo para o Hydrogen ser tentado primeiro */
try{if(localStorage.getItem("mu_ia42")!=="2"){["mu_iam","mu_iam_r","mu_iams","mu_livem","mu_livem_ok"].forEach(k=>localStorage.removeItem(k));localStorage.setItem("mu_ia42","2");}}catch(e){}
const iaNota=n=>(/hydrogen/.test(n)?400:0)+(/flash-latest$/.test(n)?150:0)+(/lite/.test(n)?-40:0)+(/preview/.test(n)?-15:0)+(parseFloat((n.match(/gemini-(\d+(\.\d+)?)/)||[])[1])||0)*10;
iaModelos=async function(key){try{const c=JSON.parse(localStorage.getItem("mu_iams42")||"null");if(c&&c.t>Date.now()-3*864e5&&c.m.length)return c.m;}catch(e){}
  try{const r=await gFetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=300",{},key);if(!r.ok)return[];const j=await r.json();
    const m=(j.models||[]).filter(x=>(x.supportedGenerationMethods||[]).includes("generateContent")).map(x=>String(x.name).replace(/^models\//,""))
      .filter(n=>/^gemini-/.test(n)&&/flash|hydrogen/.test(n)&&!IA_PAGO.test(n)&&!/tts|image|live|audio|embed|exp|native|thinking|decision|transcribe|omni|robotics|computer|banana|research/.test(n))
      .sort((a,b)=>iaNota(b)-iaNota(a)).slice(0,6);
    try{localStorage.setItem("mu_iams42",JSON.stringify({t:Date.now(),m}));}catch(e){}return m;}catch(e){return[];}};
/* raciocínio certo para cada família: rapido | medio | fundo */
function iaPensar(m,nivel){if(/gemini-4/.test(m))return{thinkingLevel:nivel==="fundo"?"high":nivel==="medio"?"medium":"low"};
  if(/gemini-3/.test(m))return{thinkingLevel:nivel==="fundo"?"high":"low"};
  if(/gemini-2\.5/.test(m))return nivel==="fundo"?null:{thinkingBudget:0};
  return{thinkingLevel:nivel==="fundo"?"high":"low"};}
function iaCorpo(m,parts,o,tent){const gc={maxOutputTokens:o.max||2048};if(!/gemini-4/.test(m))gc.temperature=o.temp!=null?o.temp:.2;
  if(o.json&&!o.busca)gc.responseMimeType="application/json";const pz=tent===0?iaPensar(m,o.nivel||"rapido"):null;if(pz)gc.thinkingConfig=pz;
  const body={contents:[{role:"user",parts}],generationConfig:gc};if(o.sys)body.systemInstruction={parts:[{text:o.sys}]};if(o.busca)body.tools=[{google_search:{}}];return body;}
const iaUniq=a=>a.filter((v,i,x)=>v&&x.indexOf(v)===i);
const iaChaveRuim=(st,err)=>(st===400&&/API key/i.test(err))||(st===403&&/API key|referer|referrer|blocked|API_KEY|has not been used|disabled/i.test(err));
function iaTxt(j){const c=(j.candidates||[])[0]||{};return{c,txt:((c.content||{}).parts||[]).filter(x=>!x.thought).map(x=>x.text||"").join("").trim()};}
geminiREST=async function(parts,o={}){const key=window.MU_CONFIG&&MU_CONFIG.geminiKey;if(!key){const e=new Error("sem chave");e.amigavel="Falta a chave do Gemini (Ajustes → Chave do Gemini).";throw e;}
  let salvo="";try{salvo=localStorage.getItem("mu_iam")||"";}catch(e){}
  const ms=iaUniq([(MU_CONFIG.aiModel||""),salvo].concat(await iaModelos(key),IA_MODELOS));let last=null,busca=!!o.busca;
  for(const m of ms){for(let tent=0;tent<3;tent++){const body=iaCorpo(m,parts,Object.assign({},o,{busca}),tent);
    let r;try{r=await gFetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)},key);}catch(e){throw iaErro(0,String(e),m);}
    if(r.ok){const j=await r.json(),{c,txt}=iaTxt(j);if(!txt){last=iaErro(200,"resposta vazia ("+(c.finishReason||"")+")",m);if(tent===0)continue;break;}
      try{localStorage.setItem("mu_iam",m);}catch(e){}IA42.ground=busca?(c.groundingMetadata||null):null;IA42.modelo=m;return txt;}
    const err=await r.text();last=iaErro(r.status,err,m);
    if(r.status===400&&/thinking|budget|level/i.test(err)&&tent===0)continue;
    if(r.status===400&&busca&&/search|tool|grounding/i.test(err)){busca=false;continue;}
    if(iaChaveRuim(r.status,err))throw last;
    if(m===salvo)try{localStorage.removeItem("mu_iam");}catch(e){}
    break;}}
  throw last||iaErro(0,"sem modelos","");};
geminiStream=async function(parts,o,onTexto){o=o||{};const key=window.MU_CONFIG&&MU_CONFIG.geminiKey;if(!key)throw iaErro(0,"sem chave","");
  let salvo="";try{salvo=localStorage.getItem("mu_iam_r")||"";}catch(e){}
  let busca=!!(o.busca||JAR.busca);const sys=(o.sys||"")+(busca?"\n- Esta pergunta precisa de informação atual: use a Busca Google e diga a fonte em poucas palavras (ex.: segundo o g1). Datas e números exatos.":"");
  const ms=iaUniq([salvo].concat(await iaModelos(key),IA_MODELOS));let last=null;
  for(const m of ms){for(let tent=0;tent<3;tent++){const body=iaCorpo(m,parts,Object.assign({},o,{sys,busca,max:o.max||700}),tent);
    let r;try{r=await gFetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:streamGenerateContent?alt=sse`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)},key);}catch(e){throw iaErro(0,String(e),m);}
    if(!r.ok){const err=await r.text();last=iaErro(r.status,err,m);if(r.status===400&&/thinking|budget|level/i.test(err)&&tent===0)continue;
      if(r.status===400&&busca&&/search|tool|grounding/i.test(err)){busca=false;continue;}if(iaChaveRuim(r.status,err))throw last;break;}
    let txt="",gm=null;const linha=l=>{if(!l.startsWith("data:"))return;try{const x=JSON.parse(l.slice(5)),c=(x.candidates||[])[0]||{};if(c.groundingMetadata)gm=c.groundingMetadata;
        const t=((c.content||{}).parts||[]).filter(p=>!p.thought).map(p=>p.text||"").join("");if(t){txt+=t;onTexto&&onTexto(txt,false);}}catch(e){}};
    if(!r.body||!r.body.getReader){(await r.text()).split("\n").forEach(linha);}
    else{const rd=r.body.getReader(),dec=new TextDecoder();let buf="";
      while(true){const {done,value}=await rd.read();if(done)break;buf+=dec.decode(value,{stream:true}).replace(/\r/g,"");let i;
        while((i=buf.indexOf("\n\n"))>=0){const ev=buf.slice(0,i);buf=buf.slice(i+2);ev.split("\n").forEach(linha);}}
      if(buf.trim())buf.split("\n").forEach(linha);}
    if(txt.trim()){try{localStorage.setItem("mu_iam_r",m);}catch(e){}IA42.ground=busca?gm:null;IA42.modelo=m;onTexto&&onTexto(txt,true);return txt.trim();}
    last=iaErro(200,"resposta vazia",m);if(tent===0)continue;break;}}
  throw last||iaErro(0,"sem modelos","");};

/* ---------- Gemini Decisions API: decisões fechadas, calibradas, em ~0,2 s ---------- */
async function iaDecidir(input,questions,ms){const key=window.MU_CONFIG&&MU_CONFIG.geminiKey;if(!key||Date.now()<IA42.decAte||navigator.onLine===false)return null;
  const ctl=new AbortController(),tm=setTimeout(()=>ctl.abort(),ms||1400);
  try{const r=await gFetch("https://generativelanguage.googleapis.com/v1beta/decisions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"gemini-decision-1",input,questions}),signal:ctl.signal},key);
    if(!r.ok){IA42.decAte=Date.now()+([403,404].includes(r.status)?6*3600e3:r.status===429?120e3:600e3);return null;}
    const j=await r.json();return j.answers||null;}catch(e){return null;}finally{clearTimeout(tm);}}
const JV_INTENCOES={gasto:"Registrar um gasto, compra ou pagamento que a pessoa fez",lembrete:"Pedir para ser lembrado de algo",compromisso:"Marcar compromisso, reunião, consulta ou evento na agenda",
  tarefa:"Anotar uma tarefa ou afazer",treino:"Registrar que treinou, correu, nadou ou se exercitou",encaixar:"Achar horário livre na agenda para uma atividade com duração",
  dados:"Pergunta sobre os próprios registros no app: gastos, treinos, agenda, contas, estudos, hábitos, tarefas",
  mundo:"Pergunta que precisa de informação atual da internet: clima, notícias, esportes, preços, cotações, horários, lugares, eventos recentes",
  saber:"Pergunta de conhecimento geral que não muda com o tempo, explicação de conteúdo ou exercício",conversa:"Conversa, desabafo, motivação ou pedido de conselho",abrir:"Abrir uma tela, módulo ou função do app"};
async function jvIntencao(q){const A=await iaDecidir(q,{intencao:{type:"choice",instructions:"Qual é a intenção principal deste pedido feito a um assistente pessoal? O texto pode vir de voz, com erros de transcrição.",criteria:JV_INTENCOES}});
  const x=A&&A.intencao;if(!x||!x.choice)return null;IA42.dec={k:x.choice,p:+x.confidence||0};return IA42.dec;}
const jvPareceMundo=q=>/(previs[aã]o do tempo|\bclima\b|vai chover|chuva hoje|temperatura (hoje|agora|amanh)|not[ií]cia|aconteceu (hoje|ontem)|placar|quem ganhou|resultado do jogo|jogo d[oe] (hoje|ontem)|cota[çc][aã]o|d[oó]lar|euro hoje|bitcoin|pre[çc]o d[oae]|quanto (est[aá]|custa) (o|a)|que horas (abre|fecha)|aberto agora|lan[çc]amento d|na internet|no google|pesquis[ae] (na|no|sobre)|procur[ae] na)/i.test(normTxt(q));
/* pedidos com dinheiro passam pela confirmação na tela, como no copiloto */
const jvTemGasto=A=>(A||[]).some(a=>a.tipo==="gasto");
function jvExecLista(A){const d=execAcoes(A||[]),ok=d.filter(x=>!x.miss);if(ok.length)rr();return ok;}
async function jvExecutar(q){if(typeof parseIA!=="function"||typeof execAcoes!=="function")return false;JAR.busy=true;const turno={q,a:""};JAR.turnos.push(turno);jarSheet(true);
  try{const A=(await parseIA(q)||[]).filter(a=>a&&a.tipo&&a.tipo!=="nada");JAR.busy=false;if(!A.length){JAR.turnos.pop();return false;}
    if(jvTemGasto(A)){turno.conf=A;turno.a="Confere antes de eu lançar:";jarSheet(false);falarLongo("Confere na tela antes de eu lançar.");return true;}
    const ok=jvExecLista(A);if(!ok.length){JAR.turnos.pop();return false;}turno.a="Feito: "+ok.map(x=>x.t).join("; ")+".";jarSheet(false);falarLongo(turno.a,()=>{if(JAR.conversa&&!$("sheet").classList.contains("hidden")&&$("jarI"))jarOuvir();});return true;}
  catch(e){JAR.busy=false;JAR.turnos.pop();return false;}}
ACT.jvConf=el=>{const t=JAR.turnos[+el.dataset.i];if(!t||!t.conf)return;const ok=jvExecLista(t.conf);t.conf=null;t.a=ok.length?"Feito: "+ok.map(x=>x.t).join("; ")+".":"Não consegui lançar.";jarSheet(false);toast("check","Lançado",ok.map(x=>x.t).join(" · ").slice(0,120));};
ACT.jvConfNao=el=>{const t=JAR.turnos[+el.dataset.i];if(!t)return;t.conf=null;t.a="Cancelado. Nada foi lançado.";jarSheet(false);};
const _jp42=jarPerguntar;
jarPerguntar=async function(q){q=String(q||"").trim();if(!q||JAR.busy||JAR.decidindo)return;
  if(!(window.MU_CONFIG&&MU_CONFIG.geminiKey))return _jp42.call(this,q);
  JV_Q=q;try{if(rotaNova(q))return;}catch(e){console.warn(e);}
  try{const c=typeof comandoLocal==="function"?comandoLocal(q):null;if(c&&typeof rodarLocal==="function"&&rodarLocal(c,q))return;}catch(e){}
  JAR.decidindo=true;let dec=null;try{dec=await jvIntencao(q);}finally{JAR.decidindo=false;}
  if(dec){if(["gasto","lembrete","compromisso","tarefa","treino"].includes(dec.k)&&dec.p>=.6&&await jvExecutar(q))return;
    if(dec.k==="dados"&&dec.p>=.5&&cfg().jvFerr!==false&&await jvTurnoFerramentas(q))return;
    if(dec.k==="encaixar"&&dec.p>=.55&&encaixarPedido(q,true))return;
    if(dec.k==="mundo"&&dec.p>=.45)JAR.busca=true;}
  else if(jvPareceMundo(q))JAR.busca=true;
  IA42.ground=null;const n0=JAR.turnos.length;
  try{await _jp42.call(this,q);}finally{const busca=JAR.busca;JAR.busca=false;
    if(busca&&IA42.ground){const t=JAR.turnos.slice(n0).reverse().find(x=>x.q===q)||JAR.turnos[JAR.turnos.length-1];if(t&&!t.erro){t.fontes=jvFontes(IA42.ground);t.sug=((IA42.ground.searchEntryPoint||{}).renderedContent)||"";if(!$("sheet").classList.contains("hidden"))jarSheet(false);}}}};
function jvFontes(g){const v=new Set();return((g&&g.groundingChunks)||[]).map(c=>c.web||{}).filter(w=>w.uri&&!v.has(w.title||w.uri)&&v.add(w.title||w.uri)).slice(0,4).map(w=>({u:w.uri,t:String(w.title||w.uri).replace(/^www\./,"").slice(0,40)}));}
const _jarSheet42=jarSheet;jarSheet=function(pensando){_jarSheet42.apply(this,arguments);const S=$("sheet");if(!S)return;
  S.querySelectorAll('[data-a="jarOuvir"][data-i]').forEach(b=>{const t=JAR.turnos[+b.dataset.i];if(!t||!t.fontes||!t.fontes.length||b.parentNode.querySelector(".jvfontes"))return;
    const d=document.createElement("div");d.className="jvfontes";d.innerHTML=`<span class="tiny faint">${ic("globe")} Fontes:</span>`+t.fontes.map(f=>`<a class="chip" href="${esc(f.u)}" target="_blank" rel="noopener">${esc(f.t)}</a>`).join("");
    b.parentNode.appendChild(d);if(t.sug){const fr=document.createElement("iframe");fr.className="jvsug";fr.setAttribute("sandbox","allow-popups allow-popups-to-escape-sandbox allow-same-origin");fr.srcdoc=t.sug;fr.title="Sugestões da Busca Google";b.parentNode.appendChild(fr);}});
  S.querySelectorAll('[data-a="jarOuvir"][data-i]').forEach(b=>{const i=+b.dataset.i,t=JAR.turnos[i];if(!t||!t.conf||b.parentNode.querySelector(".jvconf"))return;const d=document.createElement("div");d.className="jvconf";
    d.innerHTML=t.conf.map(a=>{const[i2,tx]=typeof copiDesc==="function"?copiDesc(a):["check",a.tipo];return `<div class="jvconf-it">${ic(i2)}<span>${esc(tx)}</span></div>`;}).join("")+`<div class="btns h"><button class="btn sm" data-a="jvConf" data-i="${i}">${ic("check")} Confirmar e lançar</button><button class="btn ghost sm" data-a="jvConfNao" data-i="${i}">Cancelar</button></div>`;b.parentNode.appendChild(d);});
  const tit=S.querySelector(".jarc")&&S.querySelector("h2");if(tit&&!S.querySelector(".jvmodelo")&&IA42.modelo){const s=document.createElement("span");s.className="jvmodelo tiny faint";s.textContent=/hydrogen/.test(IA42.modelo)?"Gemini 4 Hydrogen":IA42.modelo.replace(/^gemini-/,"Gemini ");tit.after(s);}};

/* ---------- voz: Gemini 3.8 Flash TTS e ElevenLabs ---------- */
VOZ_MODELOS.length=0;VOZ_MODELOS.push("gemini-3.8-flash-tts","gemini-3.8-flash-lite-tts","gemini-3.1-flash-tts-preview");
const VOZ_ESTILO38="Assistente de IA sofisticado e leal, no estilo de um mordomo britânico: voz masculina grave, calma e segura, dicção impecável, ritmo tranquilo, cordialidade discreta e um leve humor seco. Português do Brasil.";
vozGemini=async function(texto){const nome=vozCfg().nome||"Charon";const ms=VOZ.modelo?[VOZ.modelo].concat(VOZ_MODELOS.filter(m=>m!==VOZ.modelo)):VOZ_MODELOS.slice();let last=null;
  for(const m of ms){const novo=/gemini-3\.8/.test(m);for(const vf of (novo?["pre","voice"]:["pre"])){
    const part=novo?{text:texto,speech_metadata:{style:VOZ_ESTILO38}}:{text:VOZ_ESTILO+"\n\n"+texto};const voiceConfig=vf==="voice"?{voice:nome}:{prebuiltVoiceConfig:{voiceName:nome}};
    const r=await gFetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`,{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({contents:[{role:"user",parts:[part]}],generationConfig:{responseModalities:["AUDIO"],speechConfig:{voiceConfig}}})},MU_CONFIG.geminiKey);
    if(r.status===429){const t=await r.text();vozLimite(t);throw new Error("limite");}
    if(r.status===400){const t=await r.text();last=new Error("voz "+m+" 400 "+t.slice(0,160));if(novo&&vf==="pre"&&/voice/i.test(t))continue;break;}
    if(r.status===404||r.status===403){last=new Error("voz "+m+" "+r.status);break;}
    if(!r.ok)throw new Error("voz "+r.status+" "+(await r.text()).slice(0,200));
    const j=await r.json(),p=(((j.candidates||[])[0]||{}).content||{}).parts||[],a=p.find(x=>x.inlineData&&x.inlineData.data);if(!a)throw new Error("resposta sem áudio");
    VOZ.modelo=m;return{b64:a.inlineData.data,mime:a.inlineData.mimeType||(novo?"audio/wav":"")};}}
  throw last||new Error("nenhum modelo de voz disponível");};
const _vozDec42=vozDecodifica;vozDecodifica=async function(c,a){if(a&&/^UklGR|^SUQz|^\/\/[sv]/.test(String(a.b64||"").slice(0,8))){const bin=atob(a.b64),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return c.decodeAudioData(u.buffer);}return _vozDec42.apply(this,arguments);};
/* ElevenLabs: a chave fica nos seus dados (Ajustes), nunca no GitHub */
const EL_PADRAO="JBFqnCBsd6RMkjVDRZzb";
const elCfg=()=>{const c=cfg();return{key:c.elKey||"",voz:c.elVoz||EL_PADRAO,nome:c.elVozNome||"George",modelo:c.elModelo||"humana",on:c.vozProv==="eleven"&&!!c.elKey};};
const elBloq=()=>{try{return Date.now()<(+localStorage.getItem("mu_el_ate")||0);}catch(e){return false;}};
function b64DeBuf(buf){const u=new Uint8Array(buf);let s="";for(let i=0;i<u.length;i+=32768)s+=String.fromCharCode.apply(null,u.subarray(i,i+32768));return btoa(s);}
async function vozEleven(texto){const E=elCfg();const cadeia=E.modelo==="rapida"?["eleven_v4_turbo","eleven_flash_v2_5"]:["eleven_v4","eleven_v3","eleven_multilingual_v2"];let last=null;
  for(const m of cadeia){const r=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(E.voz)}?output_format=mp3_44100_128`,{method:"POST",headers:{"xi-api-key":E.key,"Content-Type":"application/json",Accept:"audio/mpeg"},
      body:JSON.stringify({text:texto,model_id:m,voice_settings:{stability:.45,similarity_boost:.8,style:.25,use_speaker_boost:true}})});
    if(r.ok)return{b64:b64DeBuf(await r.arrayBuffer()),mime:"audio/mpeg"};const t=await r.text();last=new Error("eleven "+r.status+" "+t.slice(0,160));
    if(r.status===401){const e=new Error("chave");e.el=1;throw e;}
    if(r.status===429||/quota|credits|limit/i.test(t)){try{localStorage.setItem("mu_el_ate",String(Date.now()+(/quota|credits/i.test(t)?6*3600e3:60e3)));}catch(e){}throw new Error("limite");}
    if(r.status===400||r.status===422||r.status===404){if(/model/i.test(t))continue;throw last;}throw last;}
  throw last||new Error("eleven");}
vozAudio=async function(texto){const E=elCfg(),el=E.on&&!elBloq();const k="tts_"+await vozHash((el?"el|"+E.voz+"|"+E.modelo:"g38|"+vozCfg().nome)+"|"+texto);const c=await vozCacheLer(k);if(c)return c;
  let a=null;if(el){try{a=await vozEleven(texto);}catch(e){console.warn("eleven",e);if(e.el)toast("audio-lines","A chave da ElevenLabs foi recusada","Confira em Ajustes → Voz. Uso a voz do Gemini por enquanto.");}}
  if(!a)a=await vozGemini(texto);await vozCacheGravar(k,a);return a;};
const _vozFalar42=vozFalar;vozFalar=async function(texto,o={}){if(elCfg().on&&!elBloq()&&navigator.onLine!==false&&vozCfg().modo!=="aparelho"){texto=String(texto||"").trim();if(!texto)return;calar();const id=++VOZ.seq;
    try{const a=await Promise.race([vozAudio(texto.slice(0,3000)),new Promise((_,rej)=>setTimeout(()=>rej(new Error("tempo")),30000))]);if(id!==VOZ.seq)return;await vozTocar(a,o.onFim);return;}
    catch(e){console.warn("voz eleven",e);if(id!==VOZ.seq)return;}}
  return _vozFalar42.apply(this,arguments);};
function vozElevenHTML(){const c=cfg(),E=elCfg();
  return `<div class="pushb" style="margin-top:12px"><b class="small" style="display:block">${ic("audio-lines")} Voz ainda mais humana · ElevenLabs</b>
   <p class="tiny muted" style="margin:4px 0 8px">Crie uma conta grátis em elevenlabs.io, copie a chave em <i>Developers → API Keys</i> e cole aqui. Ela fica só nos seus dados, nunca no GitHub. O plano grátis dá alguns minutos de fala por mês; quando acabar, volto para a voz do Gemini.</p>
   <div class="qadd"><input id="elK" type="password" placeholder="${E.key?"Chave salva · cole outra para trocar":"Cole a chave da ElevenLabs"}" autocomplete="off"><button class="btn sm" data-a="elSalvar">${ic("check")}</button></div>
   ${E.key?`<div class="seg" style="margin-top:8px">${[["gemini","Voz do Gemini"],["eleven","ElevenLabs"]].map(([k,n])=>`<button data-a="elProv" data-v="${k}" aria-pressed="${(c.vozProv||"gemini")===k}">${n}</button>`).join("")}</div>
   <div class="seg" style="margin-top:6px">${[["humana","Mais humana (v4)"],["rapida","Mais rápida (v4 Turbo)"]].map(([k,n])=>`<button data-a="elMod" data-v="${k}" aria-pressed="${E.modelo===k}">${n}</button>`).join("")}</div>
   <div class="btns h" style="margin-top:8px"><button class="btn ghost sm" data-a="elVozes">${ic("users")} Voz: ${esc(E.nome)}</button><button class="btn ghost sm" data-a="elTeste">${ic("play")} Ouvir</button><button class="btn ghost sm" data-a="elTirar">${ic("trash-2")}</button></div>`:""}</div>`;}
ACT.elSalvar=()=>{const v=($("elK")||{}).value;if(!v||v.trim().length<20)return toast("triangle-alert","Cole a chave completa","Ela começa com sk_ e é bem longa.");const c=cfg();c.elKey=v.trim();c.vozProv="eleven";save(c);rr();toast("audio-lines","Chave da ElevenLabs salva","O Jarvis já fala com a voz nova.");};
ACT.elProv=el=>{const c=cfg();c.vozProv=el.dataset.v;save(c);rr();};
ACT.elMod=el=>{const c=cfg();c.elModelo=el.dataset.v;save(c);rr();};
ACT.elTirar=()=>confirmSheet("Remover a chave da ElevenLabs?","O Jarvis volta a usar a voz do Gemini.","Remover",()=>{const c=cfg();delete c.elKey;c.vozProv="gemini";save(c);rr();});
ACT.elTeste=()=>vozFalar("Às suas ordens. Sua agenda de hoje está sob controle, e o próximo treino também.",{tipo:"resp",forcaIA:true});
ACT.elVozes=async()=>{const E=elCfg();sheet(`<h2>${ic("users")} Escolha a voz</h2><p class="muted small">Carregando as vozes da sua conta…</p>`);
  try{const r=await fetch("https://api.elevenlabs.io/v1/voices",{headers:{"xi-api-key":E.key}});if(!r.ok)throw new Error(r.status);const j=await r.json();
    const V=(j.voices||[]).slice(0,60);sheet(`<h2>${ic("users")} Escolha a voz</h2><p class="tiny muted">As vozes masculinas e graves combinam com o Jarvis. Todas falam português com o modelo v4.</p><div class="btns">${V.map(v=>`<button class="btn ghost full" data-a="elVoz" data-id="${esc(v.voice_id)}" data-n="${esc(v.name)}" aria-pressed="${v.voice_id===E.voz}">${esc(v.name)}<span class="tiny faint" style="margin-left:6px">${esc([v.labels&&v.labels.gender,v.labels&&v.labels.accent,v.labels&&v.labels.description].filter(Boolean).join(" · "))}</span></button>`).join("")}</div>`);}
  catch(e){sheet(`<h2>Não consegui listar as vozes</h2><p class="muted small">Confira a chave e a internet. A voz padrão (George) continua valendo.</p>`);}};
ACT.elVoz=el=>{const c=cfg();c.elVoz=el.dataset.id;c.elVozNome=el.dataset.n;save(c);closeSheet();rr();ACT.elTeste();};
const _ajVoz42=VIEWS.ajustes;VIEWS.ajustes=function(){const h=_ajVoz42.apply(this,arguments);const i=h.indexOf('<div class="sec"><h2>Minhas frases</h2>');return i<0?h:h.slice(0,i)+`<div class="card">${vozElevenHTML()}</div>`+h.slice(i);};

/* ---------- ao vivo: Gemini 3.8 Live primeiro ---------- */
const _liveMod42=liveModelos;liveModelos=async function(key){const m=await _liveMod42.apply(this,arguments);return iaUniq(["gemini-3.8-live"].concat(m||[]));};
const _liveCon42=liveConectar;liveConectar=function(L,ms,i,comTools){try{const novo=/gemini-3\.8-live/.test(ms[i]||"");LIVE_TOOLS.forEach(t=>(t.functionDeclarations||[]).forEach(f=>{if(novo)f.behavior="BLOCKING";else delete f.behavior;}));}catch(e){}return _liveCon42.apply(this,arguments);};

/* ---------- "Ei, Jarvis": escuta contínua com o app aberto ---------- */
const EI={r:null,ativo:false,ult:0,falhas:0,ate:0,tm:null};
const eiLigado=()=>cfg().eiJarvis===true;
const EI_RE=/(?:^|\s)(?:ei|hey|oi|ok|o|ô|olá|ola|fala|e aí|e ai)?[,\s]*(?:jarvis|jarbas|javis|jervis|jarves|djarvis|jarvi|jairvis|jarvez)\b[,.!?:]?\s*(.*)$/i;
function eiPode(){return eiLigado()&&document.visibilityState==="visible"&&!VZ.s&&!JAR.busy&&!JAR.ouvindo&&!(typeof LV!=="undefined"&&LV)&&!document.body.classList.contains("modo-prova")
  &&$("sheet").classList.contains("hidden")&&!$("kgp")&&!$("camrep")&&!(VOZ&&VOZ.src)&&!(window.speechSynthesis&&speechSynthesis.speaking);}
function eiParar(){clearTimeout(EI.tm);const r=EI.r;EI.r=null;EI.ativo=false;if(r){r.onend=null;r.onresult=null;r.onerror=null;try{r.abort();}catch(e){}}eiPill();}
function eiIniciar(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR||EI.r||!eiPode()||Date.now()<EI.ate)return;
  const r=new SR();r.lang="pt-BR";r.continuous=true;r.interimResults=true;r.maxAlternatives=1;EI.r=r;EI.ativo=true;EI.ult=Date.now();
  r.onresult=e=>{let fin="",tudo="";for(let i=e.resultIndex;i<e.results.length;i++){const t=e.results[i][0].transcript;tudo+=t+" ";if(e.results[i].isFinal)fin+=t+" ";}
    const m=EI_RE.exec(tudo.trim());if(!m)return;const resto=(m[1]||"").trim();if(!fin&&resto.split(/\s+/).filter(Boolean).length<3&&resto)return;
    if(!fin&&!resto){clearTimeout(EI.tm);EI.tm=setTimeout(()=>eiAcionar(""),900);return;}eiAcionar(fin?vzLimpa(EI_RE.exec(fin.trim())?EI_RE.exec(fin.trim())[1]:resto):resto);};
  r.onerror=ev=>{if(/not-allowed|service-not-allowed/.test(ev.error)){const c=cfg();c.eiJarvis=false;save(c);eiParar();toast("mic","Microfone bloqueado","Libere o microfone para o Moving Up e ligue o 'Ei, Jarvis' de novo em Ajustes.");return;}
    if(ev.error==="network"){EI.ate=Date.now()+15000;}else if(ev.error!=="no-speech"&&ev.error!=="aborted")EI.falhas++;};
  r.onend=()=>{EI.r=null;EI.ativo=false;eiPill();const durou=Date.now()-EI.ult;if(durou<1500)EI.falhas++;else EI.falhas=0;if(EI.falhas>6)EI.ate=Date.now()+20000;};
  try{r.start();}catch(e){EI.r=null;EI.ativo=false;}eiPill();}
function eiAcionar(resto){clearTimeout(EI.tm);eiParar();EI.ate=Date.now()+2500;
  try{const A=new (window.AudioContext||window.webkitAudioContext)(),t=A.currentTime;[[660,0],[990,.12]].forEach(([f,d])=>{const o=A.createOscillator(),g=A.createGain();o.frequency.value=f;g.gain.setValueAtTime(.0001,t+d);g.gain.exponentialRampToValueAtTime(.25,t+d+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d+.16);o.connect(g);g.connect(A.destination);o.start(t+d);o.stop(t+d+.2);});setTimeout(()=>A.close&&A.close(),600);}catch(e){}
  try{navigator.vibrate&&navigator.vibrate(30);}catch(e){}
  if(resto&&resto.length>2){jarSheet(false);jarPerguntar(resto);}else{jarSheet(false);setTimeout(()=>jarOuvir(),250);}}
function eiPill(){let p=$("eipill");if(!eiLigado()){if(p)p.remove();return;}if(!p){p=document.createElement("button");p.id="eipill";p.className="eipill";p.dataset.a="eiToque";document.body.appendChild(p);}
  p.classList.toggle("on",!!EI.ativo);p.innerHTML=`<i></i>Ei, Jarvis`;p.setAttribute("aria-label",EI.ativo?"Ouvindo 'Ei, Jarvis'. Toque para falar agora.":"'Ei, Jarvis' em pausa. Toque para falar.");}
ACT.eiToque=()=>eiAcionar("");
ACT.eiLiga=()=>{const c=cfg();c.eiJarvis=!eiLigado();save(c);if(!c.eiJarvis)eiParar();else{EI.ate=0;EI.falhas=0;eiIniciar();toast("mic","'Ei, Jarvis' ligado","Com o app aberto, diga 'Ei, Jarvis' e o pedido. No Android, o celular pode dar um bipe quando volta a ouvir.");}rr();};
setInterval(()=>{try{if(!DB.be)return;if(eiPode()){if(!EI.r)eiIniciar();}else if(EI.r)eiParar();else eiPill();}catch(e){}},1600);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState!=="visible")eiParar();});
const _ouvir42=ouvir;ouvir=function(o){eiParar();return _ouvir42.apply(this,arguments);};

/* ---------- encaixar na agenda: "encaixa 2 horas de estudo esta semana" ---------- */
const ENC_NUM={um:1,uma:1,dois:2,duas:2,tres:3,"três":3,quatro:4,cinco:5,seis:6,sete:7,oito:8,nove:9,dez:10,meia:.5,meio:.5};
function encaixarParse(txt){const n=normTxt(txt);let min=0,m;
  if((m=n.match(/(\d+(?:[.,]\d+)?|uma|um|duas|dois|tres|quatro|cinco|seis|sete|oito|dez)\s*(?:h\b|hs\b|horas?)(?:\s*e\s*(\d+|meia)\s*(?:min|minutos)?)?/))){min=Math.round((ENC_NUM[m[1]]||num(m[1]))*60)+(m[2]==="meia"?30:+m[2]||0);}
  else if((m=n.match(/meia hora/)))min=30;else if((m=n.match(/(\d+)\s*(?:min|minutos)\b/)))min=+m[1];
  if(!min)return null;let bloco=0;const b=n.match(/blocos? de (\d+(?:[.,]\d+)?|uma|meia)\s*(h|hora|horas|min|minutos)/);if(b)bloco=/h/.test(b[2])?Math.round((ENC_NUM[b[1]]||num(b[1]))*60):+b[1]||0;
  let at=(n.match(/(?:horas?|min|minutos|h)\s+(?:de|para|pra)\s+([a-zà-ú ]{3,40}?)(?=\s+(?:esta|essa|nesta|nessa|na|no|hoje|amanha|ate|semana|ainda|antes|em blocos|$))/)||n.match(/encaix\w*\s+(?:um |uma )?([a-zà-ú]{3,30})\s+(?:de\s+)?\d/)||[])[1]||"";
  at=at.replace(/\b(de|para|pra|um|uma|o|a)\b/g," ").replace(/\s+/g," ").trim()||"foco";at=encOriginal(txt,at);
  const t=TODAY(),dw=new Date().getDay();let de=t,ate=addDays(t,dw===0?0:7-dw);
  if(/semana que vem|proxima semana/.test(n)){de=addDays(t,dw===0?1:8-dw);ate=addDays(de,6);}else if(/\bhoje\b/.test(n))ate=t;
  else if(/depois de amanha/.test(n)){de=ate=addDays(t,2);}else if(/amanha/.test(n)&&!/ate amanha/.test(n)){de=ate=addDays(t,1);}
  else if(/fim de semana/.test(n)){de=addDays(t,(6-dw+7)%7);ate=addDays(de,dw===0?0:1);if(dw===0)de=t;}
  else{const a=n.match(/ate (segunda|terca|quarta|quinta|sexta|sabado|domingo)/);if(a){const w=["domingo","segunda","terca","quarta","quinta","sexta","sabado"].indexOf(a[1]);ate=addDays(t,(w-dw+7)%7||7);}
    else if(!/semana/.test(n))ate=addDays(t,6);}
  return{min,bloco,at,de,ate};}
function encOriginal(txt,at){const W=String(txt).split(/\s+/),n=at.split(" ").length;for(let i=0;i+n<=W.length;i++){const p=W.slice(i,i+n).join(" ").replace(/[,.;!?]+$/,"");if(normTxt(p)===at)return p.toLowerCase();}return at;}
function encOcupado(d){const B=[];const hm=s=>{const[a,b]=String(s).split(":").map(Number);return a*60+(b||0);};
  all("ev").filter(e=>evNoDia(e,d)).forEach(e=>{if(e.h){const i=hm(e.h);B.push([i-15,i+(+e.dur||60)+15]);}else if(e.d===d&&!e.ate)B.push([12*60,13*60]);});
  try{if(typeof acadPlan==="function"&&acadPlan(d)){const A=acad(),dw=pd(d).getDay(),h=(A.horas&&A.horas[dw])||A.hora||(typeof horaTreino==="function"?horaTreino():"");if(h){const i=hm(h);B.push([i-20,i+100]);}}}catch(e){}
  all("rem").filter(r=>!r.feito&&r.d===d&&r.h).forEach(r=>{const i=hm(r.h);B.push([i,i+10]);});
  if(d===TODAY()){const n=new Date();B.push([0,n.getHours()*60+n.getMinutes()+30]);}return B;}
function encSlots(d,dur,pref){const B=encOcupado(d),S=[];const livre=(a,b)=>!B.some(([x,y])=>a<y&&b>x);
  for(let s=6*60;s+dur<=22*60;s+=30)if(livre(s,s+dur))S.push(s);
  const nota=s=>pref.reduce((acc,[a,b],i)=>acc+(s>=a*60&&s+dur<=b*60?100-i*10:0),0)-Math.abs(s-pref[0][0]*60)/60;return S.sort((a,b)=>nota(b)-nota(a));}
function encPref(at){const n=normTxt(at);if(/estud|leitura|ler|curso|ibge|prova|questo/.test(n))return[[7,11],[19,22],[14,18]];if(/trein|corr|acad|nata|capoeira|exerc/.test(n))return[[6,8],[17,20],[8,12]];return[[8,12],[14,19],[19,22]];}
function encPlanejar(P){const tot=P.min,bl=P.bloco||(tot<=60?tot:tot<=180?60:90),pref=encPref(P.at);const dias=[];for(let d=P.de;d<=P.ate;d=addDays(d,1))dias.push(d);
  const R=[];let falta=tot,volta=0;while(falta>0&&volta<3){for(const d of dias){if(falta<=0)break;if(volta===0&&R.some(x=>x.d===d))continue;const dur=Math.min(bl,falta);
      const S=encSlots(d,dur,pref).filter(s=>!R.some(x=>x.d===d&&s<x.s+x.dur+30&&s+dur>x.s-30));if(!S.length)continue;R.push({d,s:S[0],dur,alt:S.slice(1,8),ai:0});falta-=dur;}volta++;}
  return{R:R.sort((a,b)=>a.d.localeCompare(b.d)||a.s-b.s),falta};}
let ENC=null;const hhmm=m=>pad(Math.floor(m/60))+":"+pad(m%60);const durTxt=m=>m%60?(m>=60?Math.floor(m/60)+"h"+pad(m%60):m+" min"):(m/60)+"h";
function encaixarPedido(txt,doJarvis){const P=encaixarParse(txt);if(!P)return false;const X=encPlanejar(P);ENC={P,R:X.R,falta:X.falta};encSheet();
  if(doJarvis){const msg=X.R.length?`Achei ${X.R.length} ${X.R.length===1?"horário":"horários"} para ${P.at}. Confira e aprove com um toque.`:"Não encontrei espaço livre nesse período.";try{falarLongo(msg);}catch(e){}}return true;}
function encSheet(){const {P,R,falta}=ENC,at=P.at.charAt(0).toUpperCase()+P.at.slice(1);
  sheet(`<h2>${ic("calendar-plus")} Encaixar ${esc(durTxt(P.min))} de ${esc(P.at)}</h2><p class="muted small" style="margin:4px 0 8px">${fdate(P.de).slice(0,5)}${P.ate!==P.de?" a "+fdate(P.ate).slice(0,5):""} · entre 6h e 22h, longe dos seus compromissos e do horário do treino.</p>
   ${R.length?R.map((x,i)=>`<div class="encit"><span class="mb" ${mstyle("cal")}>${ic("clock")}</span><div class="grow"><b>${esc(DOW[pd(x.d).getDay()])}, ${fdate(x.d).slice(0,5)}</b><span class="small muted" style="display:block">${hhmm(x.s)} às ${hhmm(x.s+x.dur)} · ${durTxt(x.dur)}</span></div>
     <button class="ib" data-a="encTroca" data-i="${i}" aria-label="Outro horário">${ic("refresh-cw")}</button><button class="ib" data-a="encTira" data-i="${i}" aria-label="Tirar">${ic("x")}</button></div>`).join(""):`<div class="note">${ic("calendar-x")} Não sobrou espaço livre nesse período. Tente "semana que vem" ou blocos menores.</div>`}
   ${falta>0&&R.length?`<div class="note">${ic("triangle-alert")} Faltou encaixar ${durTxt(falta)}: a agenda está cheia.</div>`:""}
   ${R.length?`<div class="btns"><button class="btn full" data-a="encOk">${ic("check")} Aprovar e pôr na agenda</button></div><p class="tiny faint" style="text-align:center">Cada bloco entra como "${esc(at)}", com aviso 15 minutos antes.</p>`:""}`);}
ACT.encTroca=el=>{const x=ENC&&ENC.R[+el.dataset.i];if(!x)return;if(!x.alt.length){const n=encSlots(addDays(x.d,1),x.dur,encPref(ENC.P.at));if(n.length&&addDays(x.d,1)<=ENC.P.ate){x.d=addDays(x.d,1);x.alt=n;}else return toast("calendar","Sem outro horário livre","");}
  const ant=x.s;x.s=x.alt.shift();x.alt.push(ant);encSheet();};
ACT.encTira=el=>{if(!ENC)return;ENC.R.splice(+el.dataset.i,1);encSheet();};
ACT.encOk=()=>{if(!ENC||!ENC.R.length)return;const at=ENC.P.at.charAt(0).toUpperCase()+ENC.P.at.slice(1),cat=/estud|leitura|ler|curso|ibge|prova/.test(normTxt(at))?"acad":/trein|corr|acad|nata/.test(normTxt(at))?"treino":/trabalh|edital|projeto/.test(normTxt(at))?"trab":"pess";
  ENC.R.forEach(x=>save({id:"ev_"+nid(),c:"ev",t:`${at} (${durTxt(x.dur)})`,cat,d:x.d,h:hhmm(x.s),dur:x.dur,al:"15",nota:"Encaixado pelo Jarvis.",enc:1,fired:0}));
  const n=ENC.R.length;ENC=null;closeSheet();rr();toast("calendar-check",n+(n===1?" bloco na agenda":" blocos na agenda"),"Com aviso 15 minutos antes.");try{if(typeof pushAgendar==="function")pushAgendar();}catch(e){}};

/* ---------- advogado do diabo nas decisões do Segundo cérebro ---------- */
function diaboLocal(n){const t=n.t.replace(/^decidi\s*/i,"");return{contra:[`E se o motivo principal para "${t}" estiver errado? O que mudaria?`,"Você está escolhendo isso por convicção ou para fugir de um desconforto?","Quem você respeita discordaria dessa decisão, e por quê?"],
  riscos:["O custo de voltar atrás daqui a 3 meses","O que você deixa de fazer para caber essa escolha"],premortem:"Imagine que daqui a 6 meses isso deu errado. Escreva em uma frase o motivo mais provável. Ele é evitável hoje?",
  perguntas:["Você decidiria igual se estivesse descansado e de bom humor?","Qual é a menor versão dessa decisão que dá para testar em 7 dias?"],teste:"Faça um teste pequeno e com prazo antes de se comprometer de vez.",veredito:"ajustar",porque:"Sem a IA ligada, estas são perguntas gerais para testar a decisão."};}
async function diaboIA(n){const ctx=(typeof cerBuscar==="function"?cerBuscar(n.t).filter(x=>x.id!==n.id).slice(0,3).map(x=>`- ${x.titulo}${x.trecho?": "+x.trecho:""}`).join("\n"):"");
  const prompt=`Você é o advogado do diabo de uma pessoa que quer evoluir. Ataque a decisão abaixo com honestidade, respeito e precisão, sem moralismo. Português do Brasil, frases curtas.
DECISÃO: ${n.t}
${n.x?"DETALHES: "+n.x+"\n":""}${n.porque?"POR QUE DECIDIU: "+n.porque+"\n":""}${ctx?"NOTAS RELACIONADAS DO SEGUNDO CÉREBRO:\n"+ctx+"\n":""}
Responda só com JSON: {"contra":["3 argumentos fortes contra"],"riscos":["2 riscos concretos"],"premortem":"se der errado em 6 meses, o motivo mais provável","custo":"o custo oculto ou de oportunidade","perguntas":["2 perguntas que a pessoa precisa responder"],"teste":"como testar barato antes de se comprometer","veredito":"manter | ajustar | repensar","porque":"1 frase justificando o veredito"}`;
  const txt=(window.MU_CONFIG&&MU_CONFIG.geminiKey)?await geminiREST([{text:prompt}],{json:true,nivel:"fundo",max:1600}):await aiGenerate([{text:prompt}],{json:true});
  const j=JSON.parse(String(txt).replace(/```json|```/g,"").trim());if(!j||!Array.isArray(j.contra))throw new Error("formato");return j;}
function diaboHTML(D){const L=(t,arr)=>arr&&arr.length?`<b class="small">${t}</b><ul class="diabo-l">${arr.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:"";const V={manter:["c","Manter"],ajustar:["a","Ajustar"],repensar:["n","Repensar"]}[String(D.veredito||"").toLowerCase()]||["a","Ajustar"];
  return `<div class="card diabo"><div class="row"><b class="grow">${ic("flame")} Advogado do diabo</b><span class="chip ${V[0]}">${V[1]}</span></div>${D.porque?`<p class="small" style="margin:6px 0 10px">${esc(D.porque)}</p>`:""}
   ${L("Contra",D.contra)}${L("Riscos",D.riscos)}${D.premortem?`<b class="small">Pré-mortem</b><p class="small">${esc(D.premortem)}</p>`:""}${D.custo?`<b class="small">Custo oculto</b><p class="small">${esc(D.custo)}</p>`:""}
   ${L("Responda antes de seguir",D.perguntas)}${D.teste?`<div class="note" style="margin:8px 0 0">${ic("flask-conical")} ${esc(D.teste)}</div>`:""}<div class="tiny faint" style="margin-top:8px">${D.em?"Feito em "+fdate(D.em):""}</div></div>`;}
const _cerNota42=VIEWS.cerNota;VIEWS.cerNota=function(){const h=_cerNota42.apply(this,arguments);const n=getD(VIEW.id);if(!n||n.tipo!=="decisao")return h;
  const bloco=n.diabo?diaboHTML(n.diabo)+`<button class="btn ghost full" data-a="cerDiabo" data-id="${n.id}" style="margin-top:8px">${ic("refresh-cw")} Atacar de novo</button>`:`<button class="btn full diabo-b" data-a="cerDiabo" data-id="${n.id}">${ic("flame")} Chamar o advogado do diabo</button><p class="tiny faint" style="margin:4px 0 0;text-align:center">Ele procura os pontos fracos da decisão antes que a vida procure.</p>`;
  const k='<div class="btns h" style="margin-top:16px">',i=h.indexOf(k);return i<0?h:h.slice(0,i)+`<div class="grp">${ic("flame")} Teste da decisão</div>`+bloco+h.slice(i);};
ACT.cerDiabo=async el=>{const n=getD(el.dataset.id);if(!n)return;el.disabled=true;el.innerHTML=`${ic("hourglass")} Procurando os pontos fracos…`;
  let D;try{D=temIA()?await Promise.race([diaboIA(n),new Promise((_,r)=>setTimeout(()=>r(new Error("tempo")),45000))]):diaboLocal(n);}catch(e){console.warn("diabo",e);D=diaboLocal(n);toast("flame","A IA não respondeu","Usei as perguntas gerais. Tente de novo depois.");}
  D.em=TODAY();n.diabo=D;save(n);rr();};

/* ---------- comandos novos do Jarvis ---------- */
const _rota42=rotaNova;rotaNova=function(txt){const n=normTxt(txt).replace(/^(ei |ok |oi )?jarvis[,\s]*/,"").replace(/[!.?]/g," ").trim();
  if(/^(encaix|acha (um )?horario|arruma (um )?horario|reserva (um )?horario)/.test(n)&&encaixarPedido(txt,true))return true;
  let m=n.match(/advogado do diabo(?: (?:sobre|da|do|de|para|pra|com))?\s*(.*)$/);
  if(m){const q=m[1].trim();const D=all("cer").filter(x=>x.tipo==="decisao");const alvo=q?(typeof cerBuscar==="function"?(cerBuscar(q).map(x=>getD(x.id)).find(x=>x&&x.tipo==="decisao")):null):D.sort((a,b)=>(b.u||0)-(a.u||0))[0];
    if(alvo){closeSheet();go({v:"cerNota",id:alvo.id});setTimeout(()=>{const b=document.querySelector('[data-a="cerDiabo"]');if(b&&!alvo.diabo)ACT.cerDiabo(b);},300);return true;}
    if(q&&typeof cerSalvar==="function"){const x=cerSalvar("Decidi "+q,"decisao");closeSheet();go({v:"cerNota",id:x.id});setTimeout(()=>{const b=document.querySelector('[data-a="cerDiabo"]');if(b)ACT.cerDiabo(b);},300);return true;}}
  const ag=n.match(/^(?:eu )?(?:bebi|tomei|registra|registrar|marca|marcar|anota|anotar|soma|somar)\s+(?:mais\s+)?(\d+(?:[.,]\d+)?|um|uma|dois|duas|tres|meio|meia)?\s*(copos?|garrafas?|ml|mililitros|litros?|l)?\s*(?:de\s+)?agua\b/);
  if(ag){const A=aguaCfg(),ml=+A.ml||100,q=ENC_NUM[ag[1]]||(ag[1]?num(ag[1]):1),u=ag[2]||"copo";let un=/garraf/.test(u)?Math.round(q*500/ml):/^(l|litro)/.test(u)?Math.round(q*1000/ml):/^(ml|mili)/.test(u)?Math.round(q/ml):Math.round(q);
    un=Math.max(1,Math.min(50,un));if(!A.on){A.on=true;save(A);}ACT.aguaMais({dataset:{n:String(un)}});const lt=v=>String(Math.round(v*ml/100)/10).replace(".",",");
    jarResp("Água",`Anotado: mais ${un*ml} ml. Hoje você está em ${lt(aguaHoje())} de ${lt(+A.meta)} litros.`);return true;}
  if(/^(liga|ligar|ativa|ativar) (o )?(ei jarvis|modo escuta|escuta)/.test(n)){if(!eiLigado())ACT.eiLiga();else jarResp("Ei, Jarvis","Já estou ouvindo. É só dizer 'Ei, Jarvis' e o pedido.");return true;}
  if(/^(desliga|desligar|desativa|desativar) (o )?(ei jarvis|modo escuta|escuta)/.test(n)){if(eiLigado())ACT.eiLiga();jarResp("Ei, Jarvis","Desliguei a escuta. Para falar comigo, toque no microfone.");return true;}
  return _rota42(txt);};

/* ---------- Ajustes: Ei, Jarvis e o cérebro em uso ---------- */
function iaAjustesHTML(){return `<div class="sec"><h2>${ic("audio-lines")} Jarvis</h2></div><div class="card">
   <button class="tg-row" data-a="eiLiga" aria-pressed="${eiLigado()}"><span class="grow"><b>"Ei, Jarvis"</b><span class="tiny muted" style="display:block">Com o app aberto na tela, diga "Ei, Jarvis" e o pedido. O microfone só escuta enquanto o app está visível.</span></span><span class="sw42 ${eiLigado()?"on":""}" aria-hidden="true"></span></button>
   <div class="tiny faint" style="margin-top:10px">${ic("sparkles")} Cérebro: Gemini 4 Hydrogen, com reserva automática no Gemini 3.8 Flash. Entendimento rápido: Gemini Decisions API. Perguntas sobre o mundo: Busca Google com fontes. Voz: Gemini 3.8 TTS${elCfg().on?" · ElevenLabs ligada":""}. Ao vivo: Gemini 3.8 Live.</div></div>`;}
const _ajIa42=VIEWS.ajustes;VIEWS.ajustes=function(){const h=_ajIa42.apply(this,arguments);const i=h.indexOf('<div class="sec"><h2>Seus dados</h2>');return i<0?h:h.slice(0,i)+iaAjustesHTML()+h.slice(i);};

/* ---------- Hydrogen com ferramentas: consulta só o que precisa e faz vários pedidos de uma vez ---------- */
const jvP=(props,req)=>({type:"object",properties:props,required:req||[]});
const JV_DATA={type:"string",description:"data no formato AAAA-MM-DD"};
const JV_FERR=[{functionDeclarations:[
  {name:"consultar_gastos",description:"Soma e lista os gastos registrados num período. Use para quanto gastou, com o quê, em qual categoria.",parameters:jvP({de:JV_DATA,ate:JV_DATA,termo:{type:"string",description:"filtra pela descrição, ex.: ifood, gasolina, mercado"},categoria:{type:"string"}},["de","ate"])},
  {name:"consultar_agenda",description:"Compromissos da agenda num período.",parameters:jvP({de:JV_DATA,ate:JV_DATA},["de","ate"])},
  {name:"consultar_treinos",description:"Registros de treino e rotina num período: academia (gym), corrida (run), natação (swim), capoeira (cap), hiit, kegel, meditação (med), estudo (conc), bíblia (bib).",parameters:jvP({de:JV_DATA,ate:JV_DATA,tipo:{type:"string",description:"um dos códigos, ou vazio para todos"}},["de","ate"])},
  {name:"consultar_tarefas",description:"Tarefas de um período, feitas e pendentes.",parameters:jvP({de:JV_DATA,ate:JV_DATA},["de","ate"])},
  {name:"consultar_contas",description:"Contas a pagar e a receber, inclusive as dos editais, com vencimento e valor.",parameters:jvP({tipo:{type:"string",description:"pagar, receber ou vazio"},status:{type:"string",description:"aberta, paga ou vazio"}})},
  {name:"consultar_estudos",description:"Estudo para o concurso do IBGE e foco: questões por dia, acertos e minutos de foco.",parameters:jvP({de:JV_DATA,ate:JV_DATA},["de","ate"])},
  {name:"registrar_no_app",description:"Registra no app um pedido: gasto, tarefa, lembrete, compromisso, check de treino ou água. Uma chamada por pedido, com a frase só daquele pedido.",parameters:jvP({frase:{type:"string"}},["frase"])}]}];
const jvFaixa=(a,b)=>{const t=TODAY(),ok=s=>/^\d{4}-\d\d-\d\d$/.test(s||"");let de=ok(a)?a:addDays(t,-30),ate=ok(b)?b:t;if(de>ate)[de,ate]=[ate,de];return[de,ate];};
const r2=v=>Math.round((+v||0)*100)/100;
const JV_FN42={
  consultar_gastos:({de,ate,termo,categoria})=>{[de,ate]=jvFaixa(de,ate);const tn=normTxt(termo||""),cn=normTxt(categoria||"");const L=all("exp").filter(x=>x.d>=de&&x.d<=ate&&(!tn||normTxt((x.desc||"")+" "+(x.cat||"")).includes(tn))&&(!cn||normTxt(x.cat||"").includes(cn)));
    const por={};L.forEach(x=>{const c=x.cat||"Outros";por[c]=(por[c]||0)+(+x.v||0);});
    return{de,ate,total:r2(sum(L.map(x=>+x.v||0))),quantidade:L.length,por_categoria:Object.entries(por).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([c,v])=>({categoria:c,total:r2(v)})),maiores:L.slice().sort((a,b)=>b.v-a.v).slice(0,12).map(x=>({data:x.d,descricao:x.desc||"",valor:r2(x.v),categoria:x.cat||""}))};},
  consultar_agenda:({de,ate})=>{[de,ate]=jvFaixa(de,ate);const L=[];for(let d=de;d<=ate&&L.length<40;d=addDays(d,1))all("ev").filter(e=>evNoDia(e,d)).forEach(e=>L.push({data:d,hora:e.h||"",titulo:e.t,local:e.local||""}));return{de,ate,compromissos:L};},
  consultar_treinos:({de,ate,tipo})=>{[de,ate]=jvFaixa(de,ate);const K=tipo?[tipo]:["gym","run","swim","cap","hiit","kegel","med","conc","bib","man","des"];const L=all("trk").filter(x=>x.d>=de&&x.d<=ate&&K.includes(x.k));const por={};L.forEach(x=>{por[x.k]=(por[x.k]||0)+1;});
    return{de,ate,total:L.length,por_tipo:Object.entries(por).map(([k,n])=>({tipo:(MODS[k]||{}).n||k,vezes:n})),km_corridos:r2(sum(L.filter(x=>x.k==="run").map(x=>+x.km||0))),registros:L.sort((a,b)=>b.d.localeCompare(a.d)).slice(0,25).map(x=>({data:x.d,tipo:(MODS[x.k]||{}).n||x.k,titulo:x.t||"",km:x.km||undefined}))};},
  consultar_tarefas:({de,ate})=>{[de,ate]=jvFaixa(de,ate);const L=all("todo").filter(x=>(x.d>=de&&x.d<=ate)||(x.feito&&x.feito>=de&&x.feito<=ate));return{de,ate,feitas:L.filter(x=>x.ok).length,pendentes:L.filter(x=>!x.ok).length,lista:L.slice(0,30).map(x=>({titulo:x.t,dia:x.d,feita:!!x.ok,importante:!!x.imp}))};},
  consultar_contas:({tipo,status})=>{const L=all("conta").filter(c=>(!tipo||c.tipo===tipo)&&(!status||(status==="paga"?c.status==="paga":c.status!=="paga"))).sort((a,b)=>(a.venc||"").localeCompare(b.venc||""));
    return{em_aberto_pagar:r2(sum(L.filter(c=>c.tipo==="pagar"&&c.status!=="paga").map(c=>c.valor))),em_aberto_receber:r2(sum(L.filter(c=>c.tipo==="receber"&&c.status!=="paga").map(c=>c.valor))),contas:L.slice(0,30).map(c=>({descricao:c.desc,tipo:c.tipo,valor:r2(c.valor),vencimento:c.semData?"sem data prevista":c.venc,status:c.status,de_quem:c.quem||"",edital:!!c.ed}))};},
  consultar_estudos:({de,ate})=>{[de,ate]=jvFaixa(de,ate);const s=DB.docs.get("ibge")||{},D=s.dia||{},F=all("dia").filter(x=>x.d>=de&&x.d<=ate);const dias=Object.keys(D).filter(d=>d>=de&&d<=ate).sort();
    return{de,ate,questoes:sum(dias.map(d=>D[d].q||0)),acertos:sum(dias.map(d=>D[d].ac||0)),dias_estudando:dias.length,minutos_foco:sum(F.map(x=>+x.foco||0)),por_dia:dias.slice(-14).map(d=>({data:d,questoes:D[d].q||0,acertos:D[d].ac||0}))};},
  registrar_no_app:async({frase})=>{if(typeof parseIA!=="function")return{erro:"indisponível"};const A=(await parseIA(String(frase||""))||[]).filter(a=>a&&a.tipo&&a.tipo!=="nada");
    if(jvTemGasto(A)){JV_PEND.push(...A);return{aguardando_confirmacao:true,aviso:"Lançamentos de dinheiro só entram depois que a pessoa confirmar na tela. Diga isso em poucas palavras."};}
    const ok=jvExecLista(A);return{registrado:ok.map(x=>x.t)};}};
let JV_PEND=[];
async function jvComFerramentas(q){const key=MU_CONFIG.geminiKey;let salvo="";try{salvo=localStorage.getItem("mu_iam")||"";}catch(e){}
  const ms=iaUniq(["gemini-4-hydrogen",salvo].concat(await iaModelos(key),IA_MODELOS)).filter(m=>!/lite/.test(m)).slice(0,3);
  const hist=JAR.turnos.slice(-5,-1).filter(x=>x.a&&!x.erro).map(x=>`Pessoa: ${x.q}\nJarvis: ${x.a}`).join("\n");
  const sys=jarSistema()+`\n- Os dados do app NÃO estão no texto: use as ferramentas para buscar só o necessário, várias de uma vez quando ajudar. Hoje é ${TODAY()} (${DSEML[new Date().getDay()]}).\n- Pedidos de registro: use registrar_no_app, uma chamada por pedido, e confirme em poucas palavras o que foi feito.`;
  for(const m of ms){const contents=[{role:"user",parts:[{text:(hist?"CONVERSA ATÉ AQUI:\n"+hist+"\n\n":"")+"PEDIDO: "+q}]}];let semPensar=false;
    try{for(let passo=0;passo<5;passo++){const gc={maxOutputTokens:900};const pz=semPensar?null:iaPensar(m,"rapido");if(pz)gc.thinkingConfig=pz;if(!/gemini-4/.test(m))gc.temperature=.3;
        const r=await gFetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents,generationConfig:gc,systemInstruction:{parts:[{text:sys}]},tools:JV_FERR})},key);
        if(!r.ok){const err=await r.text();if(r.status===400&&/thinking|level|budget/i.test(err)&&!semPensar){semPensar=true;passo--;continue;}if(iaChaveRuim(r.status,err))throw iaErro(r.status,err,m);throw new Error(m+" "+r.status);}
        const j=await r.json(),c=(j.candidates||[])[0]||{},parts=(c.content||{}).parts||[],calls=parts.filter(p=>p.functionCall);
        if(!calls.length){const txt=parts.filter(p=>!p.thought).map(p=>p.text||"").join("").trim();if(txt){IA42.modelo=m;return txt;}throw new Error("vazio");}
        contents.push({role:"model",parts});const resp=[];
        for(const p of calls){const fc=p.functionCall,f=JV_FN42[fc.name];let out;try{out=f?await f(fc.args||{}):{erro:"ferramenta desconhecida"};}catch(e){out={erro:String(e&&e.message||e)};}resp.push({functionResponse:{name:fc.name,id:fc.id,response:out}});}
        contents.push({role:"user",parts:resp});}
      throw new Error("passos demais");}catch(e){if(e.status&&iaChaveRuim(e.status,e.message||""))throw e;console.warn("jarvis ferramentas",m,e);}}
  return null;}
async function jvTurnoFerramentas(q){JAR.busy=true;JV_PEND=[];const turno={q,a:""};JAR.turnos.push(turno);jarSheet(true);
  try{const txt=await Promise.race([jvComFerramentas(q),new Promise((_,rej)=>setTimeout(()=>rej(new Error("tempo")),26000))]);JAR.busy=false;
    if(!txt){JAR.turnos.pop();JV_PEND=[];return false;}turno.a=txt;turno.ferr=1;if(JV_PEND.length){turno.conf=JV_PEND;JV_PEND=[];}jarSheet(false);falarLongo(txt,()=>{if(JAR.conversa&&!$("sheet").classList.contains("hidden")&&$("jarI"))jarOuvir();});return true;}
  catch(e){JAR.busy=false;JAR.turnos.pop();return false;}}
const _jpF42=jarPerguntar;jarPerguntar=async function(q){q=String(q||"").trim();
  if(!q||JAR.busy||JAR.decidindo||!(window.MU_CONFIG&&MU_CONFIG.geminiKey)||cfg().jvFerr===false)return _jpF42.apply(this,arguments);
  const n=normTxt(q);const dados=/(quanto|quantos|quantas|qual|quais|quando|como (estou|foi|anda)|o que (falta|tenho)|gastei|treinei|estudei|minhas?|meus?).{0,60}(gast|treino|corri|academia|agenda|compromisso|tarefa|conta|boleto|receber|pagar|estud|questo|ibge|foco|kegel|semana|mes|hoje|ontem)/.test(n);
  const varios=(n.match(/\b(e|tambem|depois|alem disso)\b/g)||[]).length>=2&&/(gastei|lembr|marca|anota|tarefa|treinei|corri|bebi)/.test(n);
  const temas=[/gast|dinheiro|compr/,/trein|corri|academia|nade|natac|capoeira|kegel/,/agenda|compromisso|reuniao/,/tarefa/,/conta|boleto|receber|pagar/,/estud|questo|ibge|foco|simulado/].filter(r=>r.test(n)).length;
  if(temas>=2&&(dados||/\b(e|alem|tambem)\b/.test(n))){if(await jvTurnoFerramentas(q))return;}
  JV_Q=q;try{if(rotaNova(q))return;}catch(e){console.warn(e);}
  try{const c=typeof comandoLocal==="function"?comandoLocal(q):null;if(c&&typeof rodarLocal==="function"&&rodarLocal(c,q))return;}catch(e){}
  if(dados||varios){if(await jvTurnoFerramentas(q))return;}
  return _jpF42.apply(this,arguments);};
