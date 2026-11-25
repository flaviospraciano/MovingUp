"use strict";
/* ======================================================================
   4.2 · TAREFAS SEM REPETIÇÃO · ROTINA LIGADA AOS LEMBRETES · LIXEIRA DE 5 DIAS
   · Tarefa igual a uma que já está aberta: fica só uma. Parecida (escrita de outro jeito): o app pergunta.
     A comparação usa as palavras da tarefa e, com a chave do Gemini, a Decisions API (mesmo sentido, outras palavras).
   · Início: os itens de rotina de hoje (treinos, rituais, hábitos, água, estudo) aparecem junto das tarefas.
     Marcou num lugar, marca no outro: a fonte é a mesma. A aba Lembretes passa a mostrar todas as tarefas de hoje.
   · Rotina não acumula: treino, ritual e desafio do dia que ficaram sem fazer não passam para o dia seguinte.
   · Tudo o que for apagado vai para a Lixeira e pode ser restaurado por 5 dias.
   ====================================================================== */
/* ---------- registro de linhas extras em Ajustes ---------- */
const AJ42=[];
const _aj64=VIEWS.ajustes;VIEWS.ajustes=function(){const h=_aj64.apply(this,arguments);const i=h.indexOf('<div class="sec"><h2>Seus dados</h2>');if(i<0)return h;
  const L=AJ42.map(f=>{try{return f();}catch(e){return"";}}).join("");return h.slice(0,i)+`<div class="sec"><h2>${ic("sparkles")} Recursos da versão 4.2</h2></div><div class="card aj42">${L}</div>`+h.slice(i);};
const ajLinha=(a,ico,t,sub,dir)=>`<button class="tg-row" data-a="${a}"><span class="mb">${ic(ico)}</span><span class="grow"><b>${t}</b>${sub?`<span class="tiny muted" style="display:block">${sub}</span>`:""}</span>${dir||ic("chevron-right")}</button>`;
const ajTg=on=>`<span class="sw42 ${on?"on":""}" aria-hidden="true"></span>`;
AJ42.push(()=>ajLinha("painelLiga","monitor","Painel na mesa ao carregar","Parado e carregando, o celular vira relógio com próximo compromisso, água e tarefa atual.",ajTg(cfg().painel!==false)));

/* ---------- tarefas repetidas ---------- */
const TD_PAL=/\b(o|a|os|as|de|do|da|dos|das|para|pra|pro|e|um|uma|no|na|nos|nas|com|em|meu|minha)\b/g;
const tdNorm=s=>normTxt(String(s||"").replace(/^\W+/,"")).replace(/[^a-z0-9 ]/g," ").replace(TD_PAL," ").replace(/\s+/g," ").trim();
function tdLev(a,b){if(a===b)return 0;const m=a.length,n=b.length;if(!m||!n)return Math.max(m,n);let p=Array.from({length:n+1},(_,j)=>j);
  for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c;}return p[n];}
function tdSim(a,b){if(!a||!b)return 0;const A=new Set(a.split(" ")),B=new Set(b.split(" "));const inter=[...A].filter(w=>B.has(w)||[...B].some(z=>z.length>3&&w.length>3&&(z.startsWith(w.slice(0,4))))).length;
  const jac=inter/Math.max(1,new Set([...A,...B]).size);const lev=1-tdLev(a.slice(0,80),b.slice(0,80))/Math.max(a.length,b.length,1);return Math.max(jac,lev);}
let TD_SKIP=0;const TD_FILA=[];
const tdAbertas=id=>all("todo").filter(x=>!x.ok&&x.id!==id&&!x.cresc);
const _save64=save;
save=function(doc){if(doc&&doc.c==="todo"&&!TD_SKIP&&!DB.docs.has(doc.id)&&!doc.cresc&&!/^todo_cr_/.test(doc.id)&&DB.be){const n=tdNorm(doc.t);
    if(n){const A=tdAbertas(doc.id),igual=A.find(x=>tdNorm(x.t)===n);
      if(igual){let mud=false;if(doc.imp&&!igual.imp){igual.imp=true;mud=true;}if(doc.d&&doc.d<igual.d){igual.d=doc.d;igual.dias=Array.from(new Set([doc.d].concat(igual.dias||[])));mud=true;}
        if(mud)_save64(igual);setTimeout(()=>toast("copy-check","Essa tarefa já existia","Mantive só uma: "+igual.t),60);return igual;}
      const r=_save64.apply(this,arguments);const sim=A.map(x=>({x,s:tdSim(n,tdNorm(x.t))})).filter(o=>o.s>=.72).sort((a,b)=>b.s-a.s)[0];
      if(sim)tdPerguntar(doc.id,sim.x.id);else tdSemantico(doc.id,A);return r;}}
  return _save64.apply(this,arguments);};
async function tdSemantico(id,A){if(!A.length||!(window.MU_CONFIG&&MU_CONFIG.geminiKey))return;const nova=getD(id);if(!nova)return;
  const L=A.slice().sort((a,b)=>(b.u||0)-(a.u||0)).slice(0,40),Q={};L.forEach((x,i)=>{Q["t"+i]={type:"noul",instructions:`Estas duas tarefas pedem a mesma ação, ainda que escritas de jeitos diferentes? A: "${String(nova.t).slice(0,140)}" B: "${String(x.t).slice(0,140)}"`};});
  const R=await iaDecidir("Lista de tarefas pessoais de uma pessoa, em português do Brasil.",Q,1800);if(!R)return;
  let best=null,bp=0;L.forEach((x,i)=>{const a=R["t"+i];const p=a?+(a.noul!=null?a.noul:a.confidence)||0:0;if(p>bp){bp=p;best=x;}});if(best&&bp>=.85&&getD(id))tdPerguntar(id,best.id,bp);}
function tdPerguntar(novaId,velhaId,p){if(TD_FILA.some(f=>f[0]===novaId))return;TD_FILA.push([novaId,velhaId,p||0]);tdMostrar();}
function tdMostrar(){if(!TD_FILA.length)return;if(!$("sheet").classList.contains("hidden")){clearTimeout(tdMostrar.t);tdMostrar.t=setTimeout(tdMostrar,1500);return;}
  const [nid_,vid]=TD_FILA[0],N=getD(nid_),V=getD(vid);if(!N||!V||N.ok||V.ok){TD_FILA.shift();return tdMostrar();}
  sheet(`<h2>${ic("copy")} Tarefa parecida</h2><p class="muted small" style="margin:4px 0 10px">Você acabou de anotar uma tarefa muito parecida com outra que já está aberta.</p>
   <div class="tdpar"><span class="chip c">nova</span><b>${esc(N.t)}</b><span class="tiny muted">${N.d===TODAY()?"hoje":fdate(N.d)}</span></div><div class="tdpar"><span class="chip">já existia</span><b>${esc(V.t)}</b><span class="tiny muted">${V.d===TODAY()?"hoje":fdate(V.d)}</span></div>
   <div class="btns"><button class="btn full" data-a="tdFica" data-v="velha">${ic("check")} Ficar só com a que já existia</button><button class="btn ghost full" data-a="tdFica" data-v="nova">Ficar só com a nova</button><button class="btn ghost full" data-a="tdFica" data-v="duas">Manter as duas</button></div>`);}
ACT.tdFica=el=>{const f=TD_FILA.shift();if(!f)return closeSheet();const [nid_,vid]=f,v=el.dataset.v;
  if(v==="velha"&&getD(nid_)){const N=getD(nid_),V=getD(vid);if(V&&N.imp&&!V.imp){V.imp=true;save(V);}todoApaga(nid_);toast("check","Ficou só uma",V?V.t:"");}
  else if(v==="nova"&&getD(vid)){todoApaga(vid);toast("check","Ficou só a nova",(getD(nid_)||{}).t||"");}
  closeSheet();rr();setTimeout(tdMostrar,300);};
/* uma vez por abertura: junta as repetidas exatas que já existiam */
function tdUnirExatas(){const G={};all("todo").filter(x=>!x.ok&&!x.cresc).forEach(x=>{const k=tdNorm(x.t);if(k)(G[k]=G[k]||[]).push(x);});let n=0;
  Object.values(G).filter(L=>L.length>1).forEach(L=>{L.sort((a,b)=>(a.de||a.d).localeCompare(b.de||b.d)||(a.o||0)-(b.o||0));const fica=L[0];
    L.slice(1).forEach(x=>{if(x.imp)fica.imp=true;if(x.d<fica.d)fica.d=x.d;LIXO_SIL++;try{todoApaga(x.id);}finally{LIXO_SIL--;}n++;});save(fica);});
  if(n)toast("copy-check",n===1?"1 tarefa repetida foi unida":n+" tarefas repetidas foram unidas","Ficou só uma de cada. As outras estão na Lixeira por 5 dias.");}

/* ---------- rotina não acumula ---------- */
const ROTINA_RE=/^(treinar|treino|academia|correr|corrida|nadar|natacao|capoeira|kegel|meditar|meditacao|ritual|ritual da manha|ler a biblia|biblia|leitura da biblia|devocional|beber agua|alongar|alongamento|hiit|flexoes|abdominais|agachamentos|desafio|tomar (o |a )?(remedio|vitamina|creatina)|skincare)\b/;
const tdRotina=x=>!!(x.cresc||/^todo_cr_/.test(x.id)||x.rot||ROTINA_RE.test(tdNorm(x.t).replace(/^\s*/,"")));
todoRolar=function(){if(!DB.be)return 0;const t=TODAY();let o=Math.max(0,...all("todo").filter(x=>x.d===t).map(x=>x.o||0)),n=0;
  all("todo").filter(x=>!x.ok&&x.d<t).sort((a,b)=>a.d.localeCompare(b.d)||(a.o||0)-(b.o||0)).forEach(x=>{if(tdRotina(x))return;
    const D=todoDias(x).slice();for(let d=addDays(x.d,1);d<=t;d=addDays(d,1))if(!D.includes(d))D.push(d);x.de=x.de||x.d;x.dias=D;x.d=t;x.o=++o;save(x);n++;});return n;};
/* rotina que já tinha acumulado: sai de hoje e da lista de atrasadas (fica na Lixeira por 5 dias) */
function rotinaLimpar(){const t=TODAY();let n=0;all("todo").filter(x=>!x.ok&&tdRotina(x)).forEach(x=>{const dia=(/^todo_cr_(\d{4}-\d\d-\d\d)/.exec(x.id)||[])[1]||x.de||x.d;
    if(dia<t){LIXO_SIL++;try{todoApaga(x.id);}finally{LIXO_SIL--;}n++;}});return n;}

/* ---------- Lembretes e Início ligados ---------- */
try{const g=LH_G.find(x=>x[0]==="tarefa");if(g){g[1]="Tarefas de hoje";g[2]="list-checks";}}catch(e){}
const _lh64=lhItens;lhItens=function(){const L=_lh64.apply(this,arguments),t=TODAY();
  try{todosDoDia(t).filter(x=>!x.ok&&!x.imp&&!x.cresc).forEach(x=>{const k="td:"+x.id;if(lhExcluido(k,t)||L.some(y=>y.k===k))return;L.push({k,d:t,g:"tarefa",ic:"list-checks",t:x.t,sub:"tarefa de hoje",ok:()=>{const y=getD(x.id);if(y&&!y.ok)todoMarca(y,true);}});});}catch(e){}
  return L;};
const ROT_G=["treino","ritual","habito","saude","estudo","crescimento"];
function rotinaHTML(){let L=[];try{L=lhItens().filter(x=>ROT_G.includes(x.g)&&(x.d||TODAY())===TODAY());}catch(e){return"";}const t=TODAY(),feitos=Object.keys((lhub().ok||{})[t]||{}).filter(k=>!/^(td|ev|ct):/.test(k)).length;
  if(!L.length)return feitos?`<div class="card rotc rotc-ok"><b>${ic("circle-check")} Rotina de hoje completa</b><span class="tiny muted">Treinos, rituais e hábitos marcados.</span></div>`:"";
  return `<div class="card rotc"><div class="row rotc-h"><b class="grow">${ic("repeat")} Rotina de hoje</b><span class="chip">${L.length} ${L.length===1?"falta":"faltam"}</span></div>
   <div class="todo-l">${L.slice(0,10).map(x=>`<div class="mit rot-it"><button class="ck" data-a="rotOk" data-k="${esc(x.k)}" aria-label="Feito: ${esc(x.t)}">${ic("check")}</button><button class="grow todo-tx" data-a="rotAbre" data-k="${esc(x.k)}"><span class="rot-ic">${ic(x.ic||"circle")}</span>${esc(x.t)}<span class="tiny muted rot-sub">${esc(x.sub||"")}</span></button>${x.mais?`<button class="btn ghost sm" data-a="aguaMais">${ic("plus")} ${+aguaCfg().ml||100} ml</button>`:""}</div>`).join("")}</div>
   <div class="row" style="margin-top:6px;align-items:flex-start;gap:8px"><span class="tiny faint grow">Marcou aqui, marca nos Lembretes e no módulo. Rotina que fica sem fazer não passa para amanhã.</span><button class="lk tiny" data-a="go" data-v="${gv({v:"lemb"})}">Lembretes ${ic("chevron-right")}</button></div></div>`;}
const rotAchar=k=>{try{return lhItens().find(x=>x.k===k);}catch(e){return null;}};
ACT.rotOk=el=>{const x=rotAchar(el.dataset.k);if(!x)return rr();if(x.acao)return ACT[x.acao]&&ACT[x.acao]();if(x.conf)return confirmSheet(x.conf,"","Confirmar",()=>lhExec(x));lhExec(x);};
ACT.rotAbre=el=>{const x=rotAchar(el.dataset.k);if(!x)return;if(x.acao)return ACT[x.acao]&&ACT[x.acao]();if(x.abre)go(x.abre);};
const _secTodo64=secTodo;secTodo=function(){return _secTodo64.apply(this,arguments)+rotinaHTML();};

/* ---------- lixeira de 5 dias ---------- */
const LIXO_DIAS=5;let LIXO_OFF=0,LIXO_SIL=0;
const LIXO_FORA=new Set(["single","dia","lixo","fiz","strava","stravatok","stravalog","concq","ibge","acad","mpl","mp","metas","desafio","agua","cfg","fds","glim","kgx"]);
const LIXO_TIPO={todo:"Tarefa",rem:"Lembrete",ev:"Compromisso",exp:"Gasto",conta:"Conta",ed:"Edital",cer:"Segundo cérebro",carta:"Carta",trk:"Registro",hab:"Hábito",ctt:"Contato",ouv:"Audiobook",cmp:"Compromisso público",fey:"Feynman",tr:"Treino",hiit:"Vídeo de HIIT",orc:"Orçamento",poup:"Meta de poupança",grat:"Gratidão",ano:"Meta do ano",edn:"Nota de edital",lv:"Livro",nota:"Nota",alb:"Álbum",foto:"Foto"};
const lixoTitulo=d=>String(d.t||d.desc||d.nome||d.meta||d.ocasiao||d.conceito||d.titulo||(d.texto?String(d.texto).slice(0,50):"")||LIXO_TIPO[d.c]||d.c||"Item").slice(0,90);
const lixoVale=d=>!(!d||LIXO_FORA.has(d.c)||d.auto||/^(fiz_|ct_ed_)/.test(d.id||"")||(d.c==="trk"&&!d.img&&!d.t&&!d.s&&!d.km));
const _rm64=removeDoc;
removeDoc=function(id){const d=getD(id);if(LIXO_OFF||!DB.be||!lixoVale(d))return _rm64.apply(this,arguments);
  const copia=JSON.parse(JSON.stringify(d)),img=d.img;if(img)delete d.img;let r;try{r=_rm64.apply(this,arguments);}finally{if(img)d.img=img;}
  LIXO_OFF++;try{save({id:"lixo_"+nid(),c:"lixo",doc:copia,em:Date.now(),t:lixoTitulo(copia),tipo:LIXO_TIPO[copia.c]||"Item"});}finally{LIXO_OFF--;}
  if(!LIXO_SIL){clearTimeout(removeDoc.tt);removeDoc.tt=setTimeout(()=>toast("trash-2","Foi para a lixeira","Dá para restaurar por 5 dias em Ajustes → Lixeira."),250);}return r;};
function lixoPurgar(){const lim=Date.now()-LIXO_DIAS*864e5;all("lixo").filter(x=>(x.em||0)<lim).forEach(x=>{LIXO_OFF++;try{_rm64(x.id);}finally{LIXO_OFF--;}try{if(x.doc&&x.doc.img&&DB.be.imgs)DB.be.imgs.del(x.doc.img);}catch(e){}});}
const lixoResta=x=>Math.max(0,Math.ceil((x.em+LIXO_DIAS*864e5-Date.now())/864e5));
VIEWS.lixeira=()=>{const L=all("lixo").sort((a,b)=>b.em-a.em);let h=topbar("Lixeira","ajustes");
  h+=`<div class="note">${ic("trash-2")} O que você apaga fica aqui por ${LIXO_DIAS} dias. Depois some de vez.</div>`;
  if(!L.length)return `<div class="app">${h}${empty("ajustes","Lixeira vazia","Nada foi apagado nos últimos 5 dias.")}</div>`;
  h+=L.map(x=>{const n=lixoResta(x);return `<div class="item lixo-it"><span class="mb" style="background:var(--sf3);color:var(--soft)">${ic(BUSCA_TIPOS[x.doc&&x.doc.c]?BUSCA_TIPOS[x.doc.c][1]:"file")}</span><div class="ibody"><b>${esc(x.t)}</b><div class="meta"><span class="chip">${esc(x.tipo)}</span><span class="chip ${n<=1?"n":""}">${n<=1?"some amanhã":"some em "+n+" dias"}</span><span class="tiny faint">apagado ${fdate(iso(new Date(x.em)))}</span></div></div>
    <button class="btn sm" data-a="lixoRest" data-id="${x.id}">${ic("rotate-ccw")} Restaurar</button><button class="ib" data-a="lixoJa" data-id="${x.id}" aria-label="Apagar de vez">${ic("x")}</button></div>`;}).join("");
  h+=`<div class="btns"><button class="btn danger full" data-a="lixoEsv">${ic("trash-2")} Esvaziar a lixeira</button></div>`;return `<div class="app">${h}</div>`;};
ACT.lixoRest=el=>{const x=getD(el.dataset.id);if(!x||!x.doc)return;const vai=()=>{const d=x.doc;LIXO_OFF++;TD_SKIP++;try{save(d);_rm64(x.id);}finally{LIXO_OFF--;TD_SKIP--;}rr();toast("rotate-ccw","Restaurado",x.t);};
  if(getD(x.doc.id))return confirmSheet("Já existe um item no lugar","Restaurar substitui o que está lá agora.","Substituir",vai);vai();};
ACT.lixoJa=el=>{const x=getD(el.dataset.id);if(!x)return;confirmSheet("Apagar de vez?",x.t,"Apagar",()=>{LIXO_OFF++;try{_rm64(x.id);}finally{LIXO_OFF--;}try{if(x.doc&&x.doc.img)DB.be.imgs.del(x.doc.img);}catch(e){}rr();});};
ACT.lixoEsv=()=>confirmSheet("Esvaziar a lixeira?","Tudo o que está aqui some de vez.","Esvaziar",()=>{all("lixo").forEach(x=>{LIXO_OFF++;try{_rm64(x.id);}finally{LIXO_OFF--;}try{if(x.doc&&x.doc.img)DB.be.imgs.del(x.doc.img);}catch(e){}});rr();});
AJ42.push(()=>{const n=all("lixo").length;return ajLinha("go","trash-2","Lixeira"+(n?` <span class="chip">${n}</span>`:""),"Restaure em até 5 dias o que foi apagado.").replace('data-a="go"',`data-a="go" data-v='${gv({v:"lixeira"})}'`);});

/* ---------- ao abrir ---------- */
const _start64=startApp;startApp=function(){const r=_start64.apply(this,arguments);setTimeout(()=>{try{lixoPurgar();rotinaLimpar();tdUnirExatas();if(VIEW.v==="home")rr();}catch(e){console.warn("4.2 tarefas",e);}},1800);return r;};
setInterval(()=>{try{if(DB.be)lixoPurgar();}catch(e){}},3600e3);
