"use strict";
/* ======================================================================
   JARVIS · SESSÕES POR VOZ
   1. Planejar o dia conversando (gratidão, dominó sugerido, prioridades, o que tornaria hoje ótimo)
   2. Fechar o dia conversando (3 coisas incríveis, o que melhorar, energia, o amanhã)
   3. Revisão semanal conversada (o Jarvis lê os números da semana e faz as perguntas)
   4. Afirmações "repita comigo" e rituais lidos em voz alta, com pausas
   5. Jarvis puxa assunto ao abrir o app (uma frase curta, só quando há algo importante)
   6. Comandos instantâneos: gasto, check e lembrete entendidos no aparelho, sem IA e sem internet
   ====================================================================== */
const JS={on:false,res:null,cancel:false,log:[],titulo:"",perg:"",ouvindo:false,parcial:"",dig:false};
const jsNome=()=>{const c=cfg(),t=c.trat||"senhor",n=(c.nome||"").split(" ")[0];return t==="nome"&&n?n:t==="senhora"?"senhora":"senhor";};
const jsSaud=()=>{const h=new Date().getHours();return h<5?"Boa noite":h<12?"Bom dia":h<18?"Boa tarde":"Boa noite";};
/* ---------- fala e escuta, com espera ---------- */
function jsFala(t){return new Promise(res=>{let ok=false;const fim=()=>{if(!ok){ok=true;res();}};try{vozFalar(t,{tipo:"resp",onFim:fim});}catch(e){fim();}setTimeout(fim,6000+String(t).length*95);});}
function jsResposta(o={}){return new Promise(res=>{JS.res=v=>{JS.res=null;JS.ouvindo=false;jsRender();res(v);};JS.parcial="";
  if(JS.dig){jsRender();return;}
  const ok=ouvir({silencio:o.silencio||1700,max:o.max||45000,onTexto:t=>{JS.parcial=t;const p=$("jsP");if(p)p.textContent=t;},onFim:t=>{if(JS.res)JS.res(String(t||"").trim());}});
  JS.ouvindo=!!ok;if(!ok){JS.dig=true;}jsRender();});}
const jsN=t=>normTxt(t||"");
const ehSim=t=>/^(sim|pode|pode ser|isso|ok|okay|beleza|claro|com certeza|bora|vamos|perfeito|uhum|aham|esse|esse mesmo|exato|certo|manda|quero)\b/.test(jsN(t));
const ehNao=t=>jsN(t).split(" ").length<=3&&/^(nao|nenhum|nenhuma|nada|negativo|depois|agora nao|dispenso|sem|nao obrigado)\b/.test(jsN(t));
const ehPular=t=>/^(pula|pular|proxima|proxima pergunta|passa|passar|nao sei|pula essa)$/.test(jsN(t));
const ehParar=t=>/^(para|parar|encerra|encerrar|cancela|cancelar|chega|sair|termina|terminar)( (a|por|aqui|a sessao|a conversa|por hoje))*$/.test(jsN(t));
const ehRepetir=t=>/^(repete|repetir|como|o que|nao entendi)\b/.test(jsN(t));
function jsLista(t,n){return String(t||"").split(/,\s*|;\s*|\s+e\s+(?=(?:o|a|os|as|meu|minha|meus|minhas|ter|poder|um|uma|pel[oa]s?|por|estar|ver)\b)|\s+e\s+(?=[a-záéíóúç]+(?:ar|er|ir)\b)|\s+tamb[eé]m\s+|\s+al[eé]m disso\s+/i)
  .map(s=>s.replace(/^\s*(e|que|por|pelo|pela|sou grato|grato|agrade[cç]o)\s+/i,"").replace(/^(por|pelo|pela)\s+/i,"").trim()).filter(s=>s.length>1).map(s=>s.charAt(0).toUpperCase()+s.slice(1)).slice(0,n);}
function jsNumero(t){const n=jsN(t),m=n.match(/\b([1-5])\b/);if(m)return +m[1];const W={um:1,uma:1,dois:2,duas:2,tres:3,quatro:4,cinco:5};const w=Object.keys(W).find(k=>new RegExp("\\b"+k+"\\b").test(n));return w?W[w]:0;}
/* pergunta: fala, escuta e trata pular, parar e repetir */
async function jsPergunta(fala,o={}){for(let tent=0;tent<3&&!JS.cancel;tent++){JS.perg=fala;jsRender();await jsFala(tent?"Pode repetir? "+fala:fala);if(JS.cancel)return null;
    const r=await jsResposta(o);if(JS.cancel||r===null)return null;if(r==="__pular__"||ehPular(r))return"";if(ehParar(r)){JS.cancel=true;return null;}if(ehRepetir(r)&&r.split(" ").length<4)continue;
    if(!r){if(o.opcional)return"";continue;}JS.log.push({q:o.rotulo||fala,a:r});jsRender();return r;}return"";}
/* ---------- tela da sessão ---------- */
function jsRender(){if(!JS.on)return;let d=$("jsess");if(!d){d=document.createElement("div");d.id="jsess";d.className="jsess";document.body.appendChild(d);document.body.style.overflow="hidden";}
  d.innerHTML=`<div class="jst"><span class="grow small"><b>${ic("audio-lines")} Jarvis · ${esc(JS.titulo)}</b></span><button class="ib" data-a="jsParar" aria-label="Encerrar">${ic("x")}</button></div>
   <div class="jsmid"><div class="jsorb ${JS.ouvindo?"ouve":""}">${ic(JS.ouvindo?"mic":"audio-lines")}</div><p class="jsq">${esc(JS.perg)}</p>
    ${JS.dig?`<div class="jsdig"><input id="jsI" placeholder="Responda aqui" autofocus data-enter="jsEnviar"><button class="btn" data-a="jsEnviar">${ic("send")}</button></div>`:`<p class="jsp" id="jsP">${esc(JS.parcial||(JS.ouvindo?"Pode falar…":""))}</p>`}</div>
   <div class="jslog">${JS.log.slice(-4).map(x=>`<div><span>${esc(x.q)}</span><b>${esc(x.a)}</b></div>`).join("")}</div>
   <div class="jsbtns"><button class="btn ghost" data-a="jsDig">${ic(JS.dig?"mic":"pencil")} ${JS.dig?"Falar":"Digitar"}</button><button class="btn ghost" data-a="jsPular">${ic("skip-forward")} Pular</button><button class="btn ghost" data-a="jsParar">${ic("square")} Encerrar</button></div>`;
  const i=$("jsI");if(i)setTimeout(()=>i.focus(),50);}
ACT.jsEnviar=()=>{const i=$("jsI");const v=i?i.value.trim():"";if(!v)return;if(JS.res)JS.res(v);};
ACT.jsPular=()=>{try{vzCancelar();}catch(e){}if(JS.res)JS.res("__pular__");};
ACT.jsDig=()=>{JS.dig=!JS.dig;try{vzCancelar();}catch(e){}if(JS.res){const r=JS.res;if(!JS.dig){JS.res=null;jsResposta().then(v=>r(v));}else jsRender();}else jsRender();};
ACT.jsParar=()=>{JS.cancel=true;try{vzCancelar();}catch(e){}try{calar();}catch(e){}if(JS.res)JS.res(null);jsFechar();};
function jsFechar(){JS.on=false;const d=$("jsess");if(d)d.remove();document.body.style.overflow="";rr();}
async function jsSessao(titulo,fn){if(JS.on)return;Object.assign(JS,{on:true,cancel:false,log:[],titulo,perg:"",parcial:"",ouvindo:false,dig:!(window.SpeechRecognition||window.webkitSpeechRecognition)});
  try{vozCtx&&vozCtx()&&vozCtx().resume&&vozCtx().resume();}catch(e){}jsRender();try{await fn();}catch(e){console.warn("sessão",e);}if(JS.on&&!JS.cancel)setTimeout(jsFechar,900);else if(JS.on)jsFechar();}

/* ---------- 1. PLANEJAR O DIA ---------- */
ACT.jsPlanejar=()=>jsSessao("Planejar o dia",async()=>{const x=dia();
  await jsFala(`${jsSaud()}, ${jsNome()}. Vamos planejar o seu dia em dois minutos.`);if(JS.cancel)return;
  const g=await jsPergunta("Pelo que você é grato hoje? Pode dizer até três coisas.",{rotulo:"Gratidão"});if(g===null)return;
  if(g){const L=jsLista(g,3);x.grat=[0,1,2].map(i=>L[i]||x.grat[i]||"");}
  const S=(typeof sugestoesDomino==="function"?sugestoesDomino():[]);const sug=x.dom||(S[0]&&S[0].t)||"";
  let dom="";if(sug){const r=await jsPergunta(`Agora, o dominó do dia: a tarefa que, se feita, deixa todo o resto mais fácil. ${x.dom?"O rascunho de ontem era":"Minha sugestão é"}: ${sug}. Pode ser esse, ou diga outro.`,{rotulo:"Dominó"});if(r===null)return;
    dom=!r||ehSim(r)?sug:ehNao(r)?(await jsPergunta("Certo. Qual vai ser o dominó então?",{rotulo:"Dominó"}))||"":r;}
  else{const r=await jsPergunta("Qual é o dominó do dia? A tarefa que, se feita, deixa todo o resto mais fácil.",{rotulo:"Dominó"});if(r===null)return;dom=r;}
  if(JS.cancel)return;if(dom){dom=dom.charAt(0).toUpperCase()+dom.slice(1);if(dom!==x.dom)x.domOk=false;x.dom=dom;}
  const outros=S.filter(s=>s.t!==dom).slice(0,2).map(s=>s.t);
  const p=await jsPergunta(`Mais uma ou duas prioridades para hoje?${outros.length?" Na sua lista tem: "+outros.join("; e ")+".":""} Se não tiver, diga nenhuma.`,{rotulo:"Prioridades",opcional:true});if(p===null)return;
  if(p&&!ehNao(p)){const L=ehSim(p)&&outros.length?outros:jsLista(p,2);x.mits=L.map(t=>({id:nid(),t,ok:false}));}
  const ot=await jsPergunta("E o que tornaria hoje um dia ótimo?",{rotulo:"Hoje será ótimo se",opcional:true});if(ot===null)return;if(ot&&!ehNao(ot))x.otimo=ot.charAt(0).toUpperCase()+ot.slice(1);
  x.primed=true;x.rasc=false;save(x);
  const resumo=`Pronto. Dominó do dia: ${x.dom||"livre"}.${x.mits.length?" Prioridades: "+x.mits.map(m=>m.t).join(" e ")+".":""}`;
  const af=await jsPergunta(resumo+" Quer declarar as suas afirmações agora, comigo?",{rotulo:"Afirmações agora?",opcional:true});
  if(af&&ehSim(af)){JS.on=false;const d=$("jsess");if(d)d.remove();document.body.style.overflow="";return jsRepetir();}
  await jsFala("Combinado. Foco no dominó. Tenha um ótimo dia.");});

/* ---------- 2. FECHAR O DIA ---------- */
ACT.jsNoite=()=>jsSessao("Fechar o dia",async()=>{const x=dia(),am=addDays(TODAY(),1);
  await jsFala(`${jsSaud()}, ${jsNome()}. Vamos fechar o dia.`);if(JS.cancel)return;
  const inc=await jsPergunta("Quais foram as três coisas incríveis que aconteceram hoje?",{rotulo:"Coisas incríveis"});if(inc===null)return;
  const mel=await jsPergunta("Como hoje poderia ter sido ainda melhor?",{rotulo:"Poderia ser melhor",opcional:true});if(mel===null)return;
  const en=await jsPergunta("De um a cinco, como foi a sua energia hoje?",{rotulo:"Energia",opcional:true});if(en===null)return;
  const L=jsLista(inc,3);x.noite={inc:[0,1,2].map(i=>L[i]||((x.noite&&x.noite.inc)||[])[i]||""),melhor:mel&&!ehNao(mel)?mel:"",energia:jsNumero(en)||(x.noite&&x.noite.energia)||0};x.fechado=true;save(x);
  /* o amanhã */
  const now=new Date();const ev=all("ev").filter(e=>e.d===am).sort((a,b)=>(a.h||"").localeCompare(b.h||""));const rm=all("rem").filter(r=>!r.feito&&iso(nextOcc(r,now))===am);const ct=all("conta").filter(c=>c.status!=="paga"&&c.venc===am);
  const itens=ev.map(e=>(e.h?e.h.replace(":00"," horas")+", ":"")+e.t).concat(rm.map(r=>r.t),ct.map(c=>(c.tipo==="receber"?"receber ":"pagar ")+c.desc));
  const pend=[x.dom&&!x.domOk?x.dom:null].concat((x.mits||[]).filter(m=>!m.ok).map(m=>m.t)).filter(Boolean);
  const A=dia(am);const sug=A.dom||pend[0]||((typeof sugestoesDomino==="function"?sugestoesDomino(am):[])[0]||{}).t||"";
  const agenda=itens.length?`Amanhã você tem: ${itens.slice(0,4).join("; ")}.`:"Amanhã a agenda está livre.";
  let dom="";if(sug){const r=await jsPergunta(`${agenda} Para o dominó de amanhã, sugiro: ${sug}. Pode ser?`,{rotulo:"Dominó de amanhã",opcional:true});if(r===null)return;dom=!r||ehSim(r)?sug:ehNao(r)?"":r;}
  else{const r=await jsPergunta(`${agenda} Qual vai ser o dominó de amanhã?`,{rotulo:"Dominó de amanhã",opcional:true});if(r===null)return;dom=r&&!ehNao(r)?r:"";}
  const B=dia(am);if(dom&&!B.primed){B.dom=dom.charAt(0).toUpperCase()+dom.slice(1);B.domOk=false;B.rasc=true;}if(!B.mits.length){const rest=pend.filter(t=>t!==dom).slice(0,2);if(rest.length){B.mits=rest.map(t=>({id:nid(),t,ok:false}));B.rasc=true;}}save(B);
  await jsFala(`Dia fechado.${pend.length>1?" As pendências de hoje já estão nas prioridades de amanhã.":""} Descanse bem, ${jsNome()}.`);});

/* ---------- 3. REVISÃO SEMANAL ---------- */
ACT.jsRevisao=()=>jsSessao("Revisão da semana",async()=>{const wk=semanaKey(TODAY());let resumo="";try{resumo=resumoLocal(statsSemana());}catch(e){}
  await jsFala(`${jsSaud()}, ${jsNome()}. Vamos à revisão da semana. ${DISCRETO?resumo.replace(/R\$\s?[\d.,]+/g,"um valor"):resumo}`);if(JS.cancel)return;
  const R=getD("rev_"+wk)||{id:"rev_"+wk,c:"rev",wk};
  const Q=[["wins","Quais foram as suas vitórias da semana?"],["apr","O que você aprendeu?"],["nao","O que não funcionou?"],["r80","Pensando no oitenta vinte: quais poucas ações geraram a maior parte dos seus resultados?"],["e80","E o que gerou a maior parte do estresse ou do desperdício?"],["foco","Por fim: qual é o seu dominó da próxima semana?"]];
  for(const [k,q] of Q){const r=await jsPergunta(q,{rotulo:q.replace(/\?$/,""),opcional:true});if(r===null)break;if(r&&!ehNao(r))R[k]=r.charAt(0).toUpperCase()+r.slice(1);save(R);}
  if(!JS.cancel)await jsFala("Revisão salva. Que a próxima semana seja ainda melhor.");});

/* ---------- 4. REPITA COMIGO e RITUAIS EM VOZ ALTA ---------- */
let JR=null;
function jsRepetir(cat){const C=afirmCats();const c=C.find(x=>x[0]===(cat||VIEW.afCat||afirmDoDia()[0]))||C[0];JR={c,i:0,stop:false,pausa:false};jrRender();jrLoop();}
ACT.jsRepetir=el=>jsRepetir(el&&el.dataset&&el.dataset.c);
function jrRender(){let d=$("jsess");if(!d){d=document.createElement("div");d.id="jsess";d.className="jsess";document.body.appendChild(d);document.body.style.overflow="hidden";}const it=JR.c[1][JR.i]||"";
  d.innerHTML=`<div class="jst"><span class="grow small"><b>${ic("sparkles")} Repita comigo · ${esc(JR.c[0])}</b> · ${JR.i+1} de ${JR.c[1].length}</span><button class="ib" data-a="jrParar" aria-label="Encerrar">${ic("x")}</button></div>
   <div class="jsmid"><p class="jraf">${esc(it)}</p><div class="jrvez" id="jrVez">${JR.vez?`${ic("mic")} Sua vez: repita em voz alta`:`${ic("audio-lines")} Ouça…`}</div><div class="bar" style="width:70%;margin:10px auto"><i id="jrBar" style="width:0%"></i></div></div>
   <div class="jsbtns"><button class="btn ghost" data-a="jrPausa">${ic(JR.pausa?"play":"pause")} ${JR.pausa?"Continuar":"Pausar"}</button><button class="btn ghost" data-a="jrProx">${ic("skip-forward")} Próxima</button><button class="btn ghost" data-a="jrParar">${ic("square")} Encerrar</button></div>`;}
async function jrLoop(){const me=JR;while(me&&!me.stop&&me.i<me.c[1].length){if(me.pausa){await new Promise(r=>setTimeout(r,300));continue;}
    const t=me.c[1][me.i];me.vez=false;jrRender();await jsFala(t);if(me.stop)return;
    me.vez=true;jrRender();const ms=Math.max(3500,t.split(" ").length*480+1500),t0=Date.now();
    while(Date.now()-t0<ms&&!me.stop&&!me.skip){await new Promise(r=>setTimeout(r,100));const b=$("jrBar");if(b)b.style.width=Math.min(100,(Date.now()-t0)/ms*100)+"%";if(me.pausa)break;}
    if(me.pausa&&!me.skip)continue;me.skip=false;const x=dia();x.decl=(x.decl||0)+1;save(x);me.i++;}
  if(me&&!me.stop){const d=$("jsess");if(d)d.remove();document.body.style.overflow="";JR=null;await jsFala("Muito bem. Leve essa energia para o seu dia.");rr();toast("sparkles","Afirmações declaradas","Hoje: "+dia().decl);}}
ACT.jrPausa=()=>{if(!JR)return;JR.pausa=!JR.pausa;if(JR.pausa){try{calar();}catch(e){}}jrRender();};
ACT.jrProx=()=>{if(!JR)return;JR.skip=true;try{calar();}catch(e){}};
ACT.jrParar=()=>{if(JR)JR.stop=true;JR=null;try{calar();}catch(e){}const d=$("jsess");if(d)d.remove();document.body.style.overflow="";rr();};
/* rituais longos: o Jarvis lê parágrafo por parágrafo, com pausas */
let JL=null;
async function jsLerRitual(r){const P=String(r.texto||"").split(/\n\s*\n|\n/).map(s=>s.trim()).filter(Boolean);if(!P.length)return;JL={P,i:0,stop:false,t:r.t};jlRender();
  const me=JL;while(!me.stop&&me.i<P.length){jlRender();await jsFala(P[me.i]);if(me.stop)return;await new Promise(z=>setTimeout(z,/[.!?]$/.test(P[me.i])?1400:900));if(!me.skip)me.i++;me.skip=false;}
  if(!me.stop){JL=null;const d=$("jsess");if(d)d.remove();document.body.style.overflow="";}}
function jlRender(){let d=$("jsess");if(!d){d=document.createElement("div");d.id="jsess";d.className="jsess";document.body.appendChild(d);document.body.style.overflow="hidden";}
  d.innerHTML=`<div class="jst"><span class="grow small"><b>${ic("book-open")} ${esc(JL.t||"Ritual")}</b> · ${JL.i+1} de ${JL.P.length}</span><button class="ib" data-a="jlParar" aria-label="Encerrar">${ic("x")}</button></div>
   <div class="jlread">${JL.P.map((p,i)=>`<p class="${i===JL.i?"on":i<JL.i?"lido":""}">${esc(p)}</p>`).join("")}</div>
   <div class="jsbtns"><button class="btn ghost" data-a="jlProx">${ic("skip-forward")} Próximo trecho</button><button class="btn ghost" data-a="jlParar">${ic("square")} Encerrar</button></div>`;
  const on=d.querySelector(".jlread p.on");if(on)on.scrollIntoView({block:"center",behavior:"smooth"});}
ACT.jlProx=()=>{if(!JL)return;JL.i++;JL.skip=true;try{calar();}catch(e){}};
ACT.jlParar=()=>{if(JL)JL.stop=true;JL=null;try{calar();}catch(e){}const d=$("jsess");if(d)d.remove();document.body.style.overflow="";};
/* botão no leitor de rituais */
const _rdShowJs=rdShow;rdShow=function(){_rdShowJs.apply(this,arguments);if(!RD||!RD.long)return;const t=document.querySelector("#reader .rt");if(t&&!t.querySelector('[data-a="jsLer"]'))t.insertAdjacentHTML("beforeend",`<button class="ib" data-a="jsLer" aria-label="Ouvir com o Jarvis">${ic("audio-lines")}</button>`);};
ACT.jsLer=()=>{if(!RD)return;const it=RD.items[RD.i];closeReader();jsLerRitual(it);};

/* ---------- botões nas telas ---------- */
secDia=(f=>function(){return f.apply(this,arguments).replace(/(<button class="lk" data-a="planDia">)/,`<button class="lk" data-a="jsPlanejar" style="margin-left:auto">${ic("mic")} Planejar falando</button>$1`);})(secDia);
secNoite=(f=>function(){const h=f.apply(this,arguments);const i=h.lastIndexOf("</button>");return i<0?h:h+`<button class="btn ghost full" style="margin-top:8px" data-a="jsNoite">${ic("mic")} Fechar o dia conversando</button>`;})(secNoite);
secAfirm=(f=>function(){return f.apply(this,arguments).replace(/(<button class="btn" data-a="afDeclarar">)/,`<button class="btn" data-a="jsRepetir">${ic("mic")} Repita comigo</button>$1`).replace('<button class="btn" data-a="afDeclarar">','<button class="btn ghost" data-a="afDeclarar">');})(secAfirm);
const _revJs=VIEWS.rev;VIEWS.rev=function(){const h=_revJs.apply(this,arguments);const mk='<div class="hero">';const i=h.indexOf(mk);return i<0?h:h.slice(0,i)+`<button class="btn full" style="margin-bottom:12px" data-a="jsRevisao">${ic("mic")} Fazer a revisão conversando com o Jarvis</button>`+h.slice(i);};

/* ---------- 5. JARVIS PUXA ASSUNTO ---------- */
function jsAbertura(){const t=TODAY(),itens=[];let acao=null;
  try{const R=typeof acadResgate==="function"?acadResgate():null;if(R){itens.push(R.duas?"faz dois dias que não tem academia":"ontem não teve academia");acao={a:"acadMin",t:"Começar o treino mínimo",p:"Começamos pelo treino mínimo?"};}}catch(e){}
  try{const E=all("edn").filter(n=>!n.feito).map(n=>({n,dt:typeof notaData==="function"?notaData(n.t):""})).filter(x=>x.dt&&x.dt>=t).sort((a,b)=>a.dt.localeCompare(b.dt))[0];
    if(E){const dd=Math.round((pd(E.dt)-pd(t))/864e5);if(dd<=3){const ed=E.n.ed?getD(E.n.ed):null;const nome=E.n.t.replace(/\s*(até|ate)?\s*\d{1,2}\/\d{1,2}(\/\d{2,4})?/i,"").trim();
      itens.push(`o prazo de ${nome.toLowerCase()}${ed?" da "+ed.nome:""} é ${dd<=0?"hoje":dd===1?"amanhã":"em "+dd+" dias"}`);if(!acao)acao={a:"go",v:{v:"editais"},t:"Abrir os editais",p:"Quer abrir os editais?"};}}}catch(e){}
  try{const V=all("conta").filter(c=>c.tipo==="pagar"&&c.status!=="paga"&&c.venc<=t);if(V.length){itens.push(V.length===1?`a conta ${V[0].desc} ${V[0].venc<t?"está vencida":"vence hoje"}`:`${V.length} contas vencem hoje ou estão atrasadas`);if(!acao)acao={a:"go",v:{v:"contas",tab:"pagar"},t:"Ver as contas",p:"Quer ver as contas?"};}}catch(e){}
  try{const now=new Date(),lim=new Date(now.getTime()+2.5*3600e3);const ev=all("ev").filter(e=>e.d===t&&e.h).map(e=>({e,at:dtOf(e.d,e.h)})).filter(x=>x.at>now&&x.at<lim).sort((a,b)=>a.at-b.at)[0];if(ev)itens.push(`você tem ${ev.e.t} às ${ev.e.h.replace(":00","h")}`);}catch(e){}
  if(!itens.length)return null;const txt=`${jsSaud()}, ${jsNome()}. ${itens.length===1?itens[0].charAt(0).toUpperCase()+itens[0].slice(1):itens.slice(0,-1).map((s,i)=>i?s:s.charAt(0).toUpperCase()+s.slice(1)).join(", ")+" e "+itens[itens.length-1]}.${acao?" "+acao.p:""}`;
  return{txt,acao};}
const jsAbChave=()=>"mu_jsab_"+TODAY()+"_"+(new Date().getHours()<12?"m":new Date().getHours()<18?"t":"n");
let JSAB=null;
function jsAbFalar(){if(!JSAB||cfg().jarAbre===false)return;try{if(localStorage.getItem(jsAbChave()))return;localStorage.setItem(jsAbChave(),"1");}catch(e){}
  const A=JSAB;const card=document.querySelector(".jsab");if(card)card.classList.add("falando");
  jsFala(A.txt).then(async()=>{if(card)card.classList.remove("falando");if(!A.acao||JS.on)return;
    try{const p=navigator.permissions&&await navigator.permissions.query({name:"microphone"});if(!p||p.state!=="granted")return;}catch(e){return;}
    const ok=ouvir({silencio:1300,max:7000,onFim:t=>{if(t&&ehSim(t))jsAbAgir();}});});}
function jsAbAgir(){const A=JSAB&&JSAB.acao;if(!A)return;if(A.a==="go")go(A.v);else if(ACT[A.a])ACT[A.a]({dataset:{}});}
ACT.jsAbAcao=()=>jsAbAgir();ACT.jsAbOuvir=()=>{try{localStorage.removeItem(jsAbChave());}catch(e){}jsAbFalar();};
ACT.jsAbFechar=()=>{JSAB=null;try{localStorage.setItem("mu_jsab_x_"+TODAY(),"1");}catch(e){}rr();};
const _homeJs=VIEWS.home;VIEWS.home=function(){const h=_homeJs.apply(this,arguments);if(!JSAB||localStorage.getItem("mu_jsab_x_"+TODAY()))return h;
  const card=`<div class="jsab"><div class="row"><span class="jsorb sm">${ic("audio-lines")}</span><p class="grow">${esc(DISCRETO?JSAB.txt.replace(/R\$\s?[\d.,]+/g,""):JSAB.txt)}</p><button class="ib" data-a="jsAbFechar" aria-label="Dispensar">${ic("x")}</button></div>
    <div class="btns h" style="margin-top:8px">${JSAB.acao?`<button class="btn sm" data-a="jsAbAcao">${esc(JSAB.acao.t)}</button>`:""}<button class="btn ghost sm" data-a="jsAbOuvir">${ic("volume-2")} Ouvir</button></div></div>`;
  const i=h.indexOf('<div class="copi"');return i<0?card+h:h.slice(0,i)+card+h.slice(i);};
/* calcula ao abrir; fala no primeiro toque (os navegadores só liberam o som depois de um toque) */
const _startJs=startApp;startApp=function(){const r=_startJs.apply(this,arguments);setTimeout(()=>{try{JSAB=jsAbertura();if(JSAB&&VIEW.v==="home")rr();}catch(e){console.warn(e);}},700);return r;};
document.addEventListener("pointerdown",function jsPrimeiro(){setTimeout(()=>{if(JSAB&&!JS.on&&!JR)jsAbFalar();},350);},{once:true,capture:true});
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&DB.be){try{const novo=jsAbertura();if(novo&&(!JSAB||novo.txt!==JSAB.txt)){JSAB=novo;if(VIEW.v==="home")rr();}}catch(e){}}});

/* ---------- 6. COMANDOS INSTANTÂNEOS (sem IA) ---------- */
const PERGUNTA_RE=/^(quanto|quantos|quantas|qual|quais|como|quando|onde|por que|porque|o que|me diz|me fala|resum|compar|mostra|lista|tem |eu tenho|existe|sera)/;
const SESSAO_RE=[[/(vamos |quero )?planejar (o |meu )?dia/,"jsPlanejar"],[/(vamos |quero )?fechar (o |meu )?dia/,"jsNoite"],[/revis(ao|ar) (da |a )?semana/,"jsRevisao"],[/(repita comigo|afirmac(oes|ao)|declarar)/,"jsRepetir"],[/treino minimo/,"acadMin"]];
function comandoLocal(txt){const n=jsN(txt).replace(/^(jarvis|ei jarvis|ok jarvis)\s*/,"");if(!n)return null;
  const s=SESSAO_RE.find(([re])=>re.test(n));if(s)return{sessao:s[1]};
  if(PERGUNTA_RE.test(n)||/\?\s*$/.test(txt))return null;
  let A;try{A=parseLocal(txt);}catch(e){return null;}if(!A||!A.length||A.some(a=>a.tipo==="nada"))return null;return{acoes:A};}
function rodarLocal(c,txt){if(c.sessao){closeSheet();setTimeout(()=>ACT[c.sessao]&&ACT[c.sessao]({dataset:{}}),150);return true;}
  const done=execAcoes(c.acoes);const ok=done.filter(d=>!d.miss&&d.fala);if(!ok.length)return false;COPI={done,txt};rr();
  sheet(`<h2>${ic("zap")} Feito na hora</h2><div class="mict" style="text-align:left;font-style:italic">“${esc(txt)}”</div><ul class="copil">${done.map(d=>`<li><span class="mb" style="width:32px;height:32px;border-radius:10px">${ic(d.ic)}</span><span>${esc(d.t)}</span></li>`).join("")}</ul>
   <div class="tiny faint">${ic("zap")} Entendido no próprio aparelho, sem IA e sem internet.</div><div class="btns h"><button class="btn ghost" data-a="copiUndo">${ic("undo-2")} Desfazer</button><button class="btn" data-a="close">Ok</button></div>`);
  try{falar("Pronto. "+ok.map(d=>d.fala).join(", ")+".");}catch(e){}return true;}
const _copiRunJs=copiRun;copiRun=async function(txt){const c=comandoLocal(txt);if(c&&rodarLocal(c,txt))return;return _copiRunJs.apply(this,arguments);};
const _jarPergJs=jarPerguntar;jarPerguntar=async function(q){const c=comandoLocal(q);if(c&&!JAR.busy&&rodarLocal(c,q))return;return _jarPergJs.apply(this,arguments);};
