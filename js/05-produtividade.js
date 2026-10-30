"use strict";
/* ======================================================================
   CENTRAL DE PRODUTIVIDADE (inspirada em Tim Ferriss e Tony Robbins)
   ====================================================================== */
MODS.fear={n:"Fear-setting",ic:"shield-check",c1:"#BE123C",c2:"#BE123C",g:9,v:{v:"list",k:"fear"}};
MODS.rpm={n:"Plano RPM",ic:"crosshair",c1:"#C2410C",c2:"#C2410C",g:9,v:{v:"rpm"}};
MODS.naof={n:"Lista do não-fazer",ic:"ban",c1:"#475569",c2:"#475569",g:9,v:{v:"list",k:"naof"}};
MODS.rev={n:"Revisão semanal",ic:"calendar-check",c1:"#4338CA",c2:"#4338CA",g:9,v:{v:"rev"}};
MODS.dia={n:"Meu dia",ic:"sunrise",c1:"#4F46E5",c2:"#4F46E5",g:9};
function modOf(V){if(V.v==="trk"||V.v==="list")return MODS[V.k]||MODS.home;if(V.v==="hiitv")return MODS.hiit;
  return MODS[{home:"home",mods:"home",habitos:"habitos",gastos:"gastos",mara:"mara",hiit:"hiit",editais:"editais",audio:"audio",manif:"man",cal:"cal",lemb:"lemb",foto:"foto",ajustes:"ajustes",contas:"contas",rpm:"rpm",rev:"rev",kegel:"kegel",curso:"curso",atab:"atab",viol:"viol"}[V.v]]||MODS[V.v]||MODS.home;}

/* ---------- registro do dia ---------- */
const diaId=d=>"dia_"+d;
function dia(d){d=d||TODAY();const x=getD(diaId(d))||{id:diaId(d),c:"dia",d};
  x.grat=x.grat||["","",""];x.dom=x.dom||"";x.domOk=!!x.domOk;x.mits=x.mits||[];x.otimo=x.otimo||"";x.decl=x.decl||0;x.foco=x.foco||0;
  x.noite=x.noite||{inc:["","",""],melhor:"",energia:0};return x;}

/* ---------- IA opcional (Gemini pelo Firebase AI Logic) ---------- */
let AIM=null;
async function aiGenerate(parts){if(!FBCFG)throw new Error("sem firebase");const V="11.10.0";
  const appM=await import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`);const aiM=await import(`https://www.gstatic.com/firebasejs/${V}/firebase-ai.js`);
  const app=appM.getApps().find(a=>a.name==="mu-ai")||appM.initializeApp(FBCFG,"mu-ai");const ai=aiM.getAI(app,{backend:new aiM.GoogleAIBackend()});let last=null;
  const models=[(window.MU_CONFIG&&MU_CONFIG.aiModel)||"","gemini-flash-latest","gemini-2.5-flash","gemini-2.5-flash-lite"].filter((v,i,a)=>v&&a.indexOf(v)===i);
  for(const m of (AIM?[AIM]:models)){try{const model=aiM.getGenerativeModel(ai,{model:m,generationConfig:{responseMimeType:"application/json",temperature:0.2}});const r=await model.generateContent(parts);AIM=m;return r.response.text();}
    catch(e){last=e;if(/not found|404|not supported|unknown model|is not available/i.test(String(e&&e.message||e)))continue;throw e;}}throw last||new Error("modelo indisponível");}

/* ---------- AFIRMAÇÕES ---------- */
const AFIRM=[
 ["Riqueza",["O dinheiro flui para mim de forma abundante, constante e honesta.","Sou um excelente administrador dos recursos que Deus me confia.","Minhas fontes de renda crescem a cada mês.","Cada projeto que escrevo carrega excelência e é aprovado.","Eu mereço ganhar bem pelo valor que entrego.","Tomo decisões financeiras com clareza, calma e sabedoria."]],
 ["Abundância",["Vivo em abundância e compartilho com generosidade.","Há mais do que suficiente para mim e para os meus.","Sou grato pelo que tenho, e a gratidão multiplica o que chega até mim.","Portas se abrem para mim no tempo certo.","Atraio pessoas, oportunidades e parcerias que me fazem crescer."]],
 ["Prosperidade",["Prospero em tudo o que faço, porque faço com propósito e disciplina.","Meu trabalho gera valor, e esse valor retorna multiplicado.","Cada dia eu subo um degrau.","Sou constante: pequenas ações todos os dias constroem grandes resultados.","Meu corpo é forte, minha mente é clara e meu espírito é firme."]],
 ["Rafaelly",["Meu relacionamento com a Rafaelly é cheio de amor, respeito e parceria.","Construo com a Rafaelly um lar de paz, alegria e fé.","Escuto, cuido e celebro a Rafaelly todos os dias.","Eu e a Rafaelly sonhamos juntos e realizamos juntos.","Escolho a paciência, a ternura e o diálogo com a Rafaelly."]],
 ["Deus",["Deus é a fonte de tudo o que tenho e de tudo o que sou.","Caminho na presença de Deus, e Ele dirige os meus passos.","Sou grato a Deus por cada vitória, cada porta aberta e cada aprendizado.","Minha vida é guiada por propósito, não por oportunidades.","Entrego meus planos a Deus e trabalho com fé e excelência."]]
];
function afirmCats(){const M=single("manif",MANIF_DEF);const own=(M.afirm||[]).filter(Boolean);return own.length?AFIRM.concat([["Minhas",own]]):AFIRM;}
function afirmDoDia(cat){const C=afirmCats();const c=C.find(x=>x[0]===cat)||C[(Math.floor(pd(TODAY())/864e5))%C.length];const i=(Math.floor(pd(TODAY())/864e5)+(VIEW.afOff||0))%c[1].length;return[c[0],c[1][i]];}
ACT.afCat=el=>{VIEW.afCat=el.dataset.c;VIEW.afOff=0;rr();};
ACT.afNext=()=>{VIEW.afOff=(VIEW.afOff||0)+1;rr();};
/* leitor em tela cheia (afirmações e rituais) */
let RD=null;
function openReader(o){RD=o;RD.i=RD.i||0;let d=$("reader");if(!d){d=document.createElement("div");d.id="reader";d.className="reader";document.body.appendChild(d);}document.body.style.overflow="hidden";guard();rdShow();}
function rdShow(){const d=$("reader");if(!d||!RD)return;const it=RD.items[RD.i];
  d.innerHTML=`<div class="rt"><button class="ib" data-a="rdClose" aria-label="Fechar">${ic("x")}</button><div class="grow small">${esc(RD.title||"")}${RD.items.length>1?` · ${RD.i+1} de ${RD.items.length}`:""}</div>${RD.onEdit?`<button class="ib" data-a="rdEdit" aria-label="Editar">${ic("pencil")}</button>`:""}</div>
   <div class="rb ${RD.long?"long":""}" ${RD.long?"":`data-a="rdNext"`}>${RD.long?`<h2>${esc(it.t||"")}</h2><div class="rtx">${esc(it.texto||"")}</div>`:`<p>${esc(it)}</p><span class="tiny" style="opacity:.6">Declare em voz alta, com emoção. Toque para a próxima.</span>`}</div>
   ${RD.long?"":`<div class="rn"><button class="ib" data-a="rdPrev" aria-label="Anterior" ${RD.i?"":"disabled"}>${ic("chevron-left")}</button><button class="btn" data-a="rdNext">${RD.i<RD.items.length-1?"Declarei · próxima":"Concluir"}</button></div>`}`;}
ACT.rdNext=()=>{if(!RD)return;if(RD.onStep)RD.onStep();if(RD.i<RD.items.length-1){RD.i++;rdShow();}else{const f=RD.onDone;closeReader();f&&f();}};
ACT.rdPrev=()=>{if(RD&&RD.i>0){RD.i--;rdShow();}};
ACT.rdEdit=()=>{const f=RD.onEdit,it=RD.items[RD.i];closeReader();f(it);};
function closeReader(){const d=$("reader");if(d)d.remove();RD=null;document.body.style.overflow="";}
ACT.rdClose=()=>{closeReader();rr();};
window.addEventListener("popstate",e=>{if(RD){e.stopImmediatePropagation();closeReader();GUARD=false;guard();}},true);
ACT.afDeclarar=()=>{const C=afirmCats();const c=C.find(x=>x[0]===(VIEW.afCat||afirmDoDia()[0]))||C[0];
  openReader({title:"Afirmações · "+c[0],items:c[1],onStep:()=>{const x=dia();x.decl++;save(x);},onDone:()=>{rr();toast("sparkles","Afirmações declaradas","Hoje: "+dia().decl+" declarações");}});};

/* ---------- PLANEJAR O DIA (Priming de Tony Robbins + 5-Minute Journal + Dominó de Tim Ferriss) ---------- */
ACT.planDia=()=>{const x=dia();
  sheet(`<h2>${ic("sunrise")} Planejar meu dia</h2><p class="muted small">Dois minutos que mudam o dia. Inspirado no <b>Priming</b> de Tony Robbins e nas perguntas de Tim Ferriss.</p>
   <div class="pl"><b>1. Sou grato por…</b><span class="tiny muted">Gratidão muda o estado. Seja específico.</span>${x.grat.map((g,i)=>`<input id="pg${i}" value="${esc(g)}" placeholder="${["Ex.: A saúde para treinar hoje","Ex.: O carinho da Rafaelly","Ex.: Mais um edital aprovado"][i]}">`).join("")}</div>
   <div class="pl"><b>2. Meu dominó do dia</b><span class="tiny muted">“Qual é a tarefa que, se feita, torna todas as outras mais fáceis ou desnecessárias?” (Tim Ferriss)</span><input id="pdom" value="${esc(x.dom)}" placeholder="Ex.: Enviar o recurso do edital"></div>
   <div class="pl"><b>3. Mais duas prioridades</b><span class="tiny muted">No máximo três coisas importantes por dia. O resto é bônus.</span>${[0,1].map(i=>`<input id="pm${i}" value="${esc((x.mits[i]||{}).t||"")}" placeholder="Prioridade ${i+2}">`).join("")}</div>
   <div class="pl"><b>4. O que tornaria hoje ótimo?</b><input id="pot" value="${esc(x.otimo)}" placeholder="Ex.: Jantar tranquilo com a Rafaelly"></div>
   <div class="btns"><button class="btn full" id="pS">${ic("check")} Salvar e declarar afirmações</button><button class="btn ghost full" id="pS2">Só salvar</button></div>`,s=>{
   const go=decl=>{const y=dia();y.grat=[0,1,2].map(i=>s.querySelector("#pg"+i).value.trim());const nd=s.querySelector("#pdom").value.trim();if(nd!==y.dom)y.domOk=false;y.dom=nd;
     y.mits=[0,1].map(i=>{const t=s.querySelector("#pm"+i).value.trim();const old=y.mits.find(m=>m.t===t);return t?{id:old?old.id:nid(),t,ok:old?old.ok:false}:null;}).filter(Boolean);
     y.otimo=s.querySelector("#pot").value.trim();y.primed=true;save(y);closeSheet();rr();if(decl)ACT.afDeclarar();else toast("sunrise","Dia planejado","Foco no dominó.");};
   s.querySelector("#pS").onclick=()=>go(true);s.querySelector("#pS2").onclick=()=>go(false);});};
ACT.domOk=()=>{const x=dia();x.domOk=!x.domOk;save(x);rr();if(x.domOk)toast("medal","Dominó derrubado!","O resto do dia fica mais leve.");};
ACT.mitOk=el=>{const x=dia();const m=x.mits.find(m=>m.id===el.dataset.id);if(m){m.ok=!m.ok;save(x);rr();}};

/* ---------- FOCO (sessões cronometradas) ---------- */
let FOCO=null;try{FOCO=JSON.parse(localStorage.getItem("mu_foco")||"null");}catch(e){}
const focoSave=()=>{try{localStorage.setItem("mu_foco",JSON.stringify(FOCO));}catch(e){}};
const focoLeft=()=>FOCO?(FOCO.paused!=null?FOCO.paused:Math.max(0,FOCO.end-Date.now())):0;
const mmss=ms=>{const s=Math.ceil(ms/1000);return pad(Math.floor(s/60))+":"+pad(s%60);};
ACT.focoGo=el=>{const min=+el.dataset.m;FOCO={dur:min,end:Date.now()+min*60000,label:dia().dom||"Sessão de foco",paused:null};focoSave();rr();toast("timer","Foco por "+min+" minutos","Celular longe, uma coisa só.");};
ACT.focoPause=()=>{if(!FOCO)return;if(FOCO.paused!=null){FOCO.end=Date.now()+FOCO.paused;FOCO.paused=null;}else FOCO.paused=Math.max(0,FOCO.end-Date.now());focoSave();rr();};
ACT.focoStop=()=>{if(!FOCO)return;const done=Math.floor((FOCO.dur*60000-focoLeft())/60000);if(done>0){const x=dia();x.foco+=done;save(x);}FOCO=null;focoSave();rr();toast("square","Sessão encerrada",done>0?"+"+done+" min de foco registrados":"");};
setInterval(()=>{if(!FOCO)return;const el=$("focoT");if(el)el.textContent=mmss(focoLeft());
  if(FOCO.paused==null&&Date.now()>=FOCO.end){const x=dia();x.foco+=FOCO.dur;if(DB.be)save(x);const d=FOCO.dur;FOCO=null;focoSave();notify("Sessão de foco concluída","+"+d+" minutos. Faça uma pausa de 5 minutos.");if(VIEW.v==="home")rr();}},1000);

/* ---------- O QUE EU FIZ HOJE: texto e voz ---------- */
ACT.fizAdd=()=>{const i=$("fizI");const v=i.value.trim();if(!v)return i.focus();save({id:"fiz_"+nid(),c:"fiz",t:v,d:TODAY()});rr();const n=$("fizI");if(n)n.focus();};
ACT.fizDel=el=>{removeDoc(el.dataset.id);rr();};
let REC=null;
ACT.fizMic=()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return toast("mic","Este navegador não grava voz","Use o Chrome no Android ou no computador.");
  sheet(`<h2>${ic("mic")} Conte o que você fez hoje</h2><p class="muted small">Fale à vontade. Depois o app organiza em uma lista curta e descarta o que for enrolação.</p>
   <div class="micw"><button class="mic on" data-a="micStop" aria-label="Parar">${ic("mic")}</button></div><div id="micT" class="mict">Ouvindo…</div>
   <div class="btns"><button class="btn full" data-a="micStop">${ic("check")} Parar e organizar</button><button class="btn ghost full" data-a="micCancel">Cancelar</button></div>`);
  const r=new SR();r.lang="pt-BR";r.continuous=true;r.interimResults=true;REC={r,keep:true,fin:"",inter:""};
  r.onresult=e=>{let inter="";for(let i=e.resultIndex;i<e.results.length;i++){const t=e.results[i][0].transcript;if(e.results[i].isFinal)REC.fin+=t.trim()+". ";else inter+=t;}REC.inter=inter;const m=$("micT");if(m)m.textContent=(REC.fin+inter)||"Ouvindo…";};
  r.onerror=ev=>{if(ev.error==="not-allowed"||ev.error==="service-not-allowed"){REC.keep=false;toast("mic","Microfone bloqueado","Libere o microfone para este site nas configurações do navegador.");}};
  r.onend=()=>{if(REC&&REC.keep){try{r.start();}catch(e){}}};
  try{r.start();}catch(e){toast("mic","Não foi possível usar o microfone","");}};
ACT.micCancel=()=>{if(REC){REC.keep=false;try{REC.r.abort();}catch(e){}}REC=null;closeSheet();};
ACT.micStop=async()=>{if(!REC)return;REC.keep=false;try{REC.r.stop();}catch(e){}await new Promise(r=>setTimeout(r,600));const txt=(REC.fin+" "+(REC.inter||"")).trim();REC=null;
  if(!txt){closeSheet();return toast("mic","Não ouvi nada","Tente de novo, mais perto do microfone.");}
  sheet(`<h2>Organizando…</h2><div class="mict">${esc(txt)}</div><div class="bar"><i style="width:40%"></i></div>`);
  let itens=null,via="local";try{const j=JSON.parse(String(await Promise.race([aiGenerate([{text:FIZ_PROMPT+"\n\nTranscrição:\n"+txt}]),new Promise((_,rej)=>setTimeout(()=>rej(new Error("tempo")),15000))])).replace(/```json|```/g,""));itens=(j.itens||j.items||[]).map(String).filter(Boolean);via="ia";}catch(e){}
  if(!itens||!itens.length)itens=organizarLocal(txt);
  FIZP={itens:itens.map(t=>({t,inc:true})),txt,via};fizRender();};
const FIZ_PROMPT=`A transcrição abaixo é uma pessoa falando, em português, o que fez hoje. Extraia uma lista de ações realizadas: curtas (no máximo 12 palavras), claras, no passado e na primeira pessoa (ex.: "Treinei capoeira com as crianças"). Junte o que for repetido, ignore hesitações, comentários, opiniões e detalhes que não sejam ações. Responda SOMENTE JSON: {"itens":["..."]}`;
const FILLERS=["tipo assim","meio que","sei lá","quer dizer","na verdade","no caso","basicamente","enfim","então","tipo","né","aí","daí","assim","cara","hum","hmm","ahn","uhum","éé","é é","tá","beleza","sabe","olha","bom","bem","ah","eh"];
function organizarLocal(txt){const t=" "+String(txt).replace(/\s+/g," ")+" ";
  const parts=t.split(/[.;!?\n]+|,\s+(?:e\s+)?|\s+(?:e\s+)?depois(?:\s+disso)?\s+|\s+em seguida\s+|\s+(?:e\s+)?também\s+|\s+e\s+aí\s+|\s+além disso\s+|\s+e\s+(?=(?:eu\s+)?[a-záéíóúâêôãõç]+(?:ei|ou|i|amos|emos|imos)\b)/i);
  const out=[],seen=new Set();
  parts.forEach(p=>{let s=" "+(p||"")+" ";FILLERS.forEach(f=>{s=s.replace(new RegExp("(^|[\\s,])"+f.replace(/ /g,"\\s+")+"(?=[\\s,]|$)","gi"),"$1 ");});
    s=s.replace(/\s+/g," ").trim();let prev;do{prev=s;s=s.replace(/^(e|que|hoje|eu|então|aí|daí|também)\s+/i,"");}while(s!==prev);s=s.replace(/\s+(e|que|aí|né)$/i,"").trim();
    if(s.split(" ").length<2||s.length<6)return;s=s.charAt(0).toUpperCase()+s.slice(1);const k=normTxt(s);if(seen.has(k))return;seen.add(k);out.push(s);});
  return out.slice(0,15);}
let FIZP=null;
function fizRender(){sheet(`<h2>Confira a sua lista</h2><p class="muted small">${FIZP.via==="ia"?"Organizado pela IA.":"Organizado no aparelho."} Corrija, desmarque o que não quiser e salve.</p>
  ${FIZP.itens.map((x,i)=>`<div class="ir ${x.inc?"":"off"}"><button class="tg ${x.inc?"on":""}" data-a="fizPT" data-i="${i}">${ic("check")}</button><input class="nm" style="border:1.5px solid var(--line);border-radius:10px;padding:8px;background:var(--sf)" value="${esc(x.t)}" data-in="fizPE" data-i="${i}"></div>`).join("")||`<div class="note">Não identifiquei ações. Veja o que foi entendido abaixo.</div>`}
  <details style="margin-top:10px"><summary class="small muted">Ver o que foi falado</summary><div class="mict" style="text-align:left">${esc(FIZP.txt)}</div></details>
  <div class="btns stk"><button class="btn full" data-a="fizPS">${ic("check")} Salvar ${FIZP.itens.filter(x=>x.inc).length} itens</button><button class="btn ghost full" data-a="fizMic">${ic("mic")} Gravar de novo</button></div>`);}
ACT.fizPT=el=>{const x=FIZP.itens[+el.dataset.i];x.inc=!x.inc;fizRender();};
CH.fizPE=el=>{FIZP.itens[+el.dataset.i].t=el.value;};
ACT.fizPS=()=>{const L=FIZP.itens.filter(x=>x.inc&&x.t.trim());L.forEach((x,k)=>save({id:"fiz_"+nid()+k,c:"fiz",t:x.t.trim(),d:TODAY()}));FIZP=null;closeSheet();rr();toast("check",L.length+" itens em “O que eu fiz hoje”","");};

/* ---------- GASTO RÁPIDO ---------- */
const lastPag=()=>{try{return localStorage.getItem("mu_pag")||"Pix";}catch(e){return"Pix";}};
CH.qgCat=el=>{const c=$("qgC");if(c){const k=gCat(el.value);c.textContent=el.value.trim()?"Categoria: "+k:"A categoria é escolhida sozinha";}};
ACT.qgSave=()=>{const V=$("qgV"),I=$("qgI");const v=num((V.value||"").replace(/r\$|\s/gi,""));if(!(v>0)){V.focus();return toast("wallet","Digite o valor","Ex.: 18,50");}
  const desc=gNiceItem(I.value.trim())||"Gasto";const pag=segVal($("view"),"qgP")||lastPag();try{localStorage.setItem("mu_pag",pag);}catch(e){}
  save({id:"exp_"+nid(),c:"exp",v,desc,cat:gCat(desc),pag,d:TODAY()});rr();toast("wallet","Gasto salvo",money(v)+" · "+desc+" · "+pag);const n=$("qgV");if(n)n.focus();};

/* ---------- FECHAR O DIA (revisão noturna) ---------- */
ACT.noite=()=>{const x=dia();const N=x.noite;
  sheet(`<h2>${ic("moon-star")} Fechar o dia</h2><p class="muted small">Três minutos para terminar o dia com clareza.</p>
   <div class="pl"><b>3 coisas incríveis que aconteceram hoje</b>${N.inc.map((g,i)=>`<input id="ni${i}" value="${esc(g)}" placeholder="${i+1}.">`).join("")}</div>
   <div class="pl"><b>Como hoje poderia ter sido ainda melhor?</b><input id="nm" value="${esc(N.melhor)}" placeholder="Ex.: Ter dormido mais cedo"></div>
   <div class="pl"><b>Minha energia hoje</b><div class="stars" id="ne" data-v="${N.energia||0}">${[1,2,3,4,5].map(n=>`<button type="button" data-a="star" data-v="${n}" class="${n<=(N.energia||0)?"on":""}" aria-label="${n}">★</button>`).join("")}</div></div>
   ${all("naof").length?`<div class="pl"><b>Respeitei minha lista do não-fazer?</b><div class="seg" data-k="nnf"><button type="button" data-a="seg" data-v="1" aria-pressed="${x.naof===true}">Sim</button><button type="button" data-a="seg" data-v="0" aria-pressed="${x.naof===false&&x.naofSet}">Não</button></div></div>`:""}
   <div class="btns"><button class="btn full" id="nS">${ic("check")} Fechar o dia</button></div>`,s=>{
   s.querySelector("#nS").onclick=()=>{const y=dia();y.noite={inc:[0,1,2].map(i=>s.querySelector("#ni"+i).value.trim()),melhor:s.querySelector("#nm").value.trim(),energia:+s.querySelector("#ne").dataset.v||0};
     const nf=segVal(s,"nnf");if(nf!==""){y.naof=nf==="1";y.naofSet=true;}y.fechado=true;save(y);closeSheet();rr();toast("moon-star","Dia fechado","Descanse. Amanhã, mais um degrau.");};});};

/* ---------- INÍCIO ---------- */

/* ---------- LISTAS: Fear-setting e Não-fazer ---------- */
LISTS.fear={title:"Fear-setting",fields:[{k:"t",l:"O que estou com medo de fazer ou adiando?",auto:1,ph:"Ex.: Pedir aumento no valor dos meus cachês"},
  {k:"def",l:"1. Definir: o pior que pode acontecer",type:"textarea",ph:"Liste os piores cenários, um por linha"},
  {k:"prev",l:"2. Prevenir: o que faço para evitar cada um",type:"textarea"},{k:"rep",l:"3. Reparar: se acontecer, como conserto ou a quem peço ajuda",type:"textarea"},
  {k:"ben",l:"Benefícios de tentar, mesmo com sucesso parcial",type:"textarea"},
  {k:"in6",l:"Custo de não agir em 6 meses",type:"textarea",ph:"Financeiro, emocional, físico"},{k:"in1",l:"Custo de não agir em 1 ano",type:"textarea"},{k:"in3",l:"Custo de não agir em 3 anos",type:"textarea"},
  {k:"dec",l:"Decisão",type:"status",opts:[["agir","Vou agir","c"],["pensar","Ainda pensando","a"],["nao","Não vou agora","n"]]}],
  sub:i=>`<div class="meta">${stChip(LISTS.fear.fields[8],i.dec)}<span class="chip">${new Date(i.u||Date.now()).toLocaleDateString("pt-BR")}</span></div>${i.ben?`<p>${esc(i.ben)}</p>`:""}`,
  top:()=>`<div class="note">${ic("shield-check")} Exercício de Tim Ferriss: definir, prevenir e reparar os piores cenários, e comparar com o custo de não agir. Quase sempre o medo é menor do que parece.</div>`,
  emptyT:"Encare um medo",emptyX:"Escolha algo que você está adiando por medo e faça o exercício."};
LISTS.naof={title:"Lista do não-fazer",fields:[{k:"t",l:"Não vou mais…",auto:1,ph:"Ex.: Checar o celular na primeira hora do dia"},{k:"porq",l:"Por quê",type:"textarea"}],
  top:()=>{const x=dia();return `<div class="note">${ic("ban")} O que você deixa de fazer libera tempo e energia para o que importa (Tim Ferriss).</div><button class="btn ${x.naof?"":"ghost"} full" style="margin-bottom:10px" data-a="naofHoje">${ic("check")} ${x.naof?"Hoje respeitei a lista ✓":"Marcar: hoje respeitei a lista"}</button>`;},
  emptyT:"Monte sua lista do não-fazer",emptyX:"Ex.: não responder mensagens durante o treino; não aceitar reunião sem pauta."};
ACT.naofHoje=()=>{const x=dia();x.naof=!x.naof;x.naofSet=true;save(x);rr();};

/* ---------- PLANO RPM (Tony Robbins: Resultado, Propósito, Plano de ação massiva) ---------- */
VIEWS.rpm=()=>{const L=all("rpm").sort((a,b)=>(a.fim?1:0)-(b.fim?1:0)||(b.u||0)-(a.u||0));let h=topbar("Plano RPM","rpm");
  h+=`<div class="note">${ic("crosshair")} Método RPM de Tony Robbins: comece pelo <b>Resultado</b> que você quer, conecte-se ao <b>Propósito</b> (o porquê que dá energia) e liste um <b>Plano de ação massiva</b>.</div>`;
  h+=L.length?L.map(r=>{const A=r.acoes||[],d=A.filter(a=>a.ok).length;return `<div class="card" style="margin-bottom:10px"><div class="row"><b class="grow ${r.fim?"strike":""}" style="font:800 1.05rem var(--disp)">${esc(r.res)}</b>${r.area?`<span class="chip m">${esc(r.area)}</span>`:""}<button class="ib" data-a="rpmEdit" data-id="${r.id}" aria-label="Editar">${ic("pencil")}</button></div>
     ${r.prop?`<div class="small" style="margin-top:6px"><b style="color:var(--deep)">Por quê:</b> ${esc(r.prop)}</div>`:""}${r.prazo?`<div class="tiny faint" style="margin-top:4px">Prazo: ${fdate(r.prazo)}</div>`:""}
     ${A.length?`<div class="bar"><i style="width:${d/A.length*100}%"></i></div>`:""}${A.map(a=>`<div class="mit"><button class="ck ${a.ok?"on":""}" data-a="rpmA" data-id="${r.id}" data-a2="${a.id}">${ic("check")}</button><span class="${a.ok?"strike":""}">${esc(a.t)}</span></div>`).join("")}</div>`;}).join("")
    :empty("rpm","Planeje um resultado","Ex.: Resultado: aprovar 3 projetos em 2027. Propósito: viver da cultura com dignidade. Ações: mapear editais, montar portfólio…");
  return `<div class="app">${h}</div>${fab("rpmNew","Novo plano")}`;};
function rpmForm(r){sheet(`<h2>${r?"Editar plano":"Novo plano RPM"}</h2>
  <label class="fld"><span>R · Resultado: o que eu quero, de forma específica</span><input id="rR" value="${esc(r?r.res:"")}" placeholder="Ex.: Juntar R$ 20 mil de reserva até dezembro"></label>
  <label class="fld"><span>P · Propósito: por que isso importa para mim</span><textarea id="rP" placeholder="Os motivos que me fazem agir mesmo cansado">${esc(r?r.prop:"")}</textarea></label>
  <label class="fld"><span>M · Plano de ação massiva (uma ação por linha)</span><textarea id="rA" class="tall" style="min-height:160px" placeholder="Separar 20% de cada pagamento&#10;Cortar 2 assinaturas&#10;Abrir uma conta para a reserva">${esc(r?(r.acoes||[]).map(a=>a.t).join("\n"):"")}</textarea></label>
  <div class="two"><label class="fld"><span>Prazo</span><input id="rD" type="date" value="${esc(r?r.prazo:"")}"></label><label class="fld"><span>Bloco</span><select id="rB">${["",...BLOCOS.map(b=>b[0])].map(b=>`<option ${r&&r.area===b?"selected":""}>${b}</option>`).join("")}</select></label></div>
  <div class="btns"><button class="btn full" id="rS">${r?"Salvar":"Criar plano"}</button>${r?`<button class="btn ghost full" id="rF">${r.fim?"Reabrir":"✓ Marcar resultado alcançado"}</button><button class="btn danger full" id="rX">Apagar</button>`:""}</div>`,s=>{
  s.querySelector("#rS").onclick=()=>{const res=s.querySelector("#rR").value.trim();if(!res)return toast("triangle-alert","Escreva o resultado","");const old=r?(r.acoes||[]):[];
    const acoes=s.querySelector("#rA").value.split("\n").map(x=>x.trim()).filter(Boolean).map(t=>{const o=old.find(a=>a.t===t);return{id:o?o.id:nid(),t,ok:o?o.ok:false};});
    const d=r||{id:"rpm_"+nid(),c:"rpm"};Object.assign(d,{res,prop:s.querySelector("#rP").value.trim(),acoes,prazo:s.querySelector("#rD").value,area:s.querySelector("#rB").value});save(d);closeSheet();rr();};
  const f=s.querySelector("#rF");if(f)f.onclick=()=>{r.fim=!r.fim;save(r);closeSheet();rr();if(r.fim)toast("party-popper","Resultado alcançado!",r.res);};
  const x=s.querySelector("#rX");if(x)x.onclick=()=>confirmSheet("Apagar este plano?",r.res,"Apagar",()=>{removeDoc(r.id);rr();});});}
ACT.rpmNew=()=>rpmForm(null);ACT.rpmEdit=el=>rpmForm(getD(el.dataset.id));
ACT.rpmA=el=>{const r=getD(el.dataset.id);const a=(r.acoes||[]).find(a=>a.id===el.dataset.a2);if(a){a.ok=!a.ok;save(r);rr();}};

/* ---------- REVISÃO SEMANAL (80/20) ---------- */
function semanaKey(d){const x=pd(d);const day=(x.getDay()+6)%7;x.setDate(x.getDate()-day);return iso(x);} /* segunda-feira da semana */
VIEWS.rev=()=>{const t=TODAY(),wk=semanaKey(t);const days=[...Array(7)].map((_,i)=>addDays(wk,i)).filter(d=>d<=t);const D=days.map(d=>dia(d));
  const mits=sum(D.map(x=>x.mits.length)),mOk=sum(D.map(x=>x.mits.filter(m=>m.ok).length)),dom=D.filter(x=>x.dom).length,domOk=D.filter(x=>x.domOk).length;
  const foco=sum(D.map(x=>x.foco)),decl=sum(D.map(x=>x.decl)),plan=D.filter(x=>x.primed).length,gs=sum(all("exp").filter(e=>e.d>=wk&&e.d<=t).map(e=>e.v)),fz=all("fiz").filter(f=>f.d>=wk&&f.d<=t).length;
  const R=getD("rev_"+wk)||{};const F=[["wins","Minhas vitórias da semana"],["apr","O que aprendi"],["nao","O que não funcionou"],["r80","80/20: quais 20% das ações geraram 80% dos resultados?"],["e80","80/20: o que gerou 80% do estresse ou desperdício?"],["foco","Meu dominó da próxima semana"]];
  let h=topbar("Revisão semanal","rev");
  h+=`<div class="hero"><div class="muted small">Semana de ${fshort(wk)} a ${fshort(addDays(wk,6))}</div><div class="stats" style="grid-template-columns:repeat(auto-fit,minmax(96px,1fr))">
    <div><b>${domOk}/${dom}</b><span>dominós derrubados</span></div><div><b>${mOk}/${mits}</b><span>prioridades feitas</span></div><div><b>${Math.round(foco/60*10)/10}h</b><span>de foco</span></div>
    <div><b>${plan}</b><span>dias planejados</span></div><div><b>${decl}</b><span>afirmações</span></div><div><b>${fz}</b><span>coisas feitas</span></div><div><b>${money(gs)}</b><span>gastos</span></div></div></div>`;
  h+=`<div class="card" style="margin-top:12px">${F.map(([k,l])=>`<label class="fld"><span>${l}</span><textarea id="rv_${k}" style="min-height:70px">${esc(R[k]||"")}</textarea></label>`).join("")}<button class="btn full" data-a="revSave" data-w="${wk}">${ic("check")} Salvar revisão</button></div>`;
  const P=all("rev").filter(r=>r.id!=="rev_"+wk).sort((a,b)=>b.wk.localeCompare(a.wk)).slice(0,8);
  if(P.length)h+=`<div class="grp">Semanas anteriores</div>`+P.map(r=>`<details class="item" style="display:block"><summary><b>Semana de ${fshort(r.wk)}</b>${r.foco?` · <span class="small muted">dominó: ${esc(r.foco)}</span>`:""}</summary>${F.map(([k,l])=>r[k]?`<div class="small" style="margin-top:8px"><b>${l}</b><div class="muted" style="white-space:pre-wrap">${esc(r[k])}</div></div>`:"").join("")}</details>`).join("");
  return `<div class="app">${h}</div>`;};
ACT.revSave=el=>{const wk=el.dataset.w;const R=getD("rev_"+wk)||{id:"rev_"+wk,c:"rev",wk};["wins","apr","nao","r80","e80","foco"].forEach(k=>R[k]=$("rv_"+k).value.trim());save(R);toast("calendar-check","Revisão salva","Boa semana!");rr();};

/* ---------- RITUAL DE MANIFESTAÇÃO: rituais longos para ler ---------- */
const _manifView=VIEWS.manif;
VIEWS.manif=()=>{const h=_manifView();const R=all("rit").sort((a,b)=>(a.o||0)-(b.o||0));
  const sec=`<div class="sec" id="ritS"><h2>${ic("book-open")} Rituais para ler</h2><button class="lk" data-a="ritNew">${ic("plus")} Novo</button></div>
   ${R.length?R.map((r,i)=>`<div class="item"><span class="mb" style="width:34px;height:34px;border-radius:10px">${ic("book-open")}</span><button class="ibody" data-a="ritRead" data-i="${i}"><b>${esc(r.t)}</b><p>${esc((r.texto||"").slice(0,160))}</p></button></div>`).join("")
     :`<div class="note">Guarde aqui seus rituais mais longos (orações, scripts de manifestação, cartas ao futuro) e leia em tela cheia, com letra grande.</div>`}`;
  if(VIEW.rit)after(()=>{const s=$("ritS");if(s)s.scrollIntoView({behavior:"smooth",block:"start"});VIEW.rit=0;});
  return h.replace(/<\/div>\s*$/,sec+"</div>");};
function ritForm(r){sheet(`<h2>${r?"Editar ritual":"Novo ritual"}</h2><label class="fld"><span>Título</span><input id="rtT" value="${esc(r?r.t:"")}" placeholder="Ex.: Ritual da manhã · Prosperidade"></label>
  <label class="fld"><span>Texto do ritual</span><textarea id="rtX" class="tall" style="min-height:320px" placeholder="Escreva ou cole o seu ritual completo…">${esc(r?r.texto:"")}</textarea></label>
  <div class="btns"><button class="btn full" id="rtS">Salvar</button>${r?`<button class="btn danger full" id="rtD">Apagar</button>`:""}</div>`,s=>{
  s.querySelector("#rtS").onclick=()=>{const t=s.querySelector("#rtT").value.trim()||"Ritual";const d=r||{id:"rit_"+nid(),c:"rit",o:Date.now()};d.t=t;d.texto=s.querySelector("#rtX").value;save(d);closeSheet();rr();};
  const x=s.querySelector("#rtD");if(x)x.onclick=()=>confirmSheet("Apagar este ritual?",r.t,"Apagar",()=>{removeDoc(r.id);rr();});});}
ACT.ritNew=()=>ritForm(null);
ACT.ritRead=el=>{const R=all("rit").sort((a,b)=>(a.o||0)-(b.o||0));openReader({title:"Ritual",long:true,items:R,i:+el.dataset.i,onEdit:it=>ritForm(it)});};
