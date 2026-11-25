"use strict";
/* ======================================================================
   CONEXÕES v2.8 · as partes do app conversando entre si
    1. Check automático (academia, Kegel e desafio marcam sozinhos) e nomes curtos padronizados
    2. Briefing da manhã e fechamento da noite completos
    3. Jarvis: tarefa, orçamento, desafio, edital, "o que falta hoje", relatório (sem IA)
    4. Deslizar tarefa (direita conclui, esquerda passa para amanhã)
    5. Cartões concluídos encolhem (desafio, briefing, gratidão)
    6. Faixa única de pendências
    7. Mentalidade: frase e afirmação num cartão só
    8. Módulos por uso · 9. Cores por área
   10. Backup em arquivo · 11. Comprovante na edição do gasto
   12. Relatório do mês · 13. Previsão de caixa · 14. Horas de estudo pelo foco
   15. Aniversário dos contatos · 16. Microfone nos campos · 17. Modo essencial
   ====================================================================== */
Object.assign(ICONS,{
  "focus":'<circle cx="12" cy="12" r="3"/><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>',
  "cake":'<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v3"/><path d="M12 8v3"/><path d="M17 8v3"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/>',
  "upload":'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  "piggy-bank":'<path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"/><path d="M2 9v1c0 1.1.9 2 2 2h1"/><path d="M16 11h.01"/>',
  "bar-chart":'<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>'
});
const lsGet=(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}};
const mesNome=ym=>MESES[+ym.slice(5,7)-1]+" de "+ym.slice(0,4);
const ymAdd=(ym,n)=>{const d=new Date(+ym.slice(0,4),+ym.slice(5,7)-1+n,1);return d.getFullYear()+"-"+pad(d.getMonth()+1);};
const qualVoz=t=>{try{if(typeof vozFalar==="function")vozFalar(t,{tipo:"resp"});else falar(t);}catch(e){}};

/* ---------- 1. CHECK AUTOMÁTICO e nomes padronizados ---------- */
TRK.des={photo:0,t:"Desafio do dia"};
/* um nome curto e igual em todo lugar para cada prática do Check */
const CK_NOME={gym:"Academia",cap:"Capoeira",des:"Desafio",kegel:"Kegel",conc:"Estudo",bib:"Bíblia",man:"Ritual",med:"Meditação",run:"Corrida",swim:"Natação"};
const CK_ORDEM=["gym","cap","des","kegel","conc","bib","man","med"];
const ckNome=k=>CK_NOME[k]||(MODS[k]&&MODS[k].n)||k;
secCheck=function(){const t=TODAY();const K=CK_ORDEM.filter(k=>TRK[k]&&MODS[k]).concat(Object.keys(TRK).filter(k=>!CK_ORDEM.includes(k)&&k!=="swim"&&k!=="run"&&MODS[k]));
  const feitos=K.filter(k=>trkHas(k,t)).length;
  return `<div class="sec"><h2>${ic("circle-check")} Check de hoje</h2><span class="chip ${feitos===K.length?"c":""}" style="margin-left:auto">${feitos}/${K.length}</span></div><div class="quick">${K.map(k=>{const m=MODS[k],on=trkHas(k,t);
    return `<button class="qk ${on?"on":""}" ${mstyle(k)} data-a="quickTrk" data-k="${k}"><span class="dot">${ic(m.ic)}</span>${esc(ckNome(k))}${on?`<span class="ok">${ic("check")}</span>`:""}</button>`;}).join("")}</div>`;};
/* o desafio marca o Check sozinho quando as 4 séries são feitas (e desmarca se desfizer) */
function desSyncCheck(d){d=d||TODAY();const id=tid("des",d),D=desDados(),w=desSemana(d);
  if(desFeito(D,d)){if(!getD(id))save({id,c:"trk",k:"des",d,t:"Desafio do dia",s:DES[w][1]+" · "+DES_SERIES+"×"+desReps(D,DES[w][0])});}
  else if(getD(id))removeDoc(id);}
const _desSerie47=ACT.desSerie;ACT.desSerie=el=>{_desSerie47(el);desSyncCheck();rr();};
const _quickTrk47=ACT.quickTrk;ACT.quickTrk=el=>{if(el.dataset.k==="des"){DES_ABRIR=true;rr();after(()=>{const c=document.querySelector(".card.des");if(c)c.scrollIntoView({behavior:"smooth",block:"center"});});return;}return _quickTrk47(el);};

/* ---------- 5. CARTÕES CONCLUÍDOS ENCOLHEM ---------- */
let DES_ABRIR=false;
const _secDes47=secDesafio;
secDesafio=function(){const t=TODAY(),D=desDados();if(!desFeito(D,t)||DES_ABRIR)return _secDes47();const w=desSemana(t),p=desPontosSemana(D,t,w);
  return `<button class="mini" style="--mc:${DES[w][3]}" data-a="desAbrir"><span class="mini-i">${ic("flame")}</span><span class="grow"><b>Desafio feito hoje</b> · ${esc(DES[w][2])} · ${p}/${desDiasDaSemana(t,w).length}</span>${ic("chevron-down")}</button>`;};
ACT.desAbrir=()=>{DES_ABRIR=!DES_ABRIR;rr();};
const _secBrf47=secBriefing;
secBriefing=function(){const per=brfPer();if(!per||!DB.be)return"";let o="",x="";try{o=localStorage.getItem("mu_brf_ouvido");x=localStorage.getItem("mu_brf_x");}catch(e){}
  if(x===TODAY()+"_"+per)return"";if(o!==TODAY()+"_"+per)return _secBrf47();
  return `<div class="mini" style="--mc:var(--brand)"><span class="mini-i">${ic(per==="manha"?"sunrise":"moon-star")}</span><button class="grow" style="text-align:left" data-a="brfOuvir"><b>${per==="manha"?"Briefing ouvido":"Fechamento ouvido"}</b> · ouvir de novo</button><button class="ib mini-x" data-a="brfX" aria-label="Esconder">${ic("x")}</button></div>`;};
let GRAT_ABRIR=false;
const _secGrat47=secGrat;
secGrat=function(){const x=dia();const g=x.grat.filter(Boolean).concat(all("grat").filter(z=>z.d===TODAY()).map(z=>z.t));if(!g.length)return"";if(GRAT_ABRIR)return _secGrat47();
  return `<button class="mini" style="--mc:#DB2777;margin-top:10px" data-a="gratAbrir"><span class="mini-i">${ic("heart")}</span><span class="grow"><b>Gratidão feita</b> · ${g.length} ${g.length===1?"motivo":"motivos"} hoje</span>${ic("chevron-down")}</button>`;};
ACT.gratAbrir=()=>{GRAT_ABRIR=!GRAT_ABRIR;rr();};

/* ---------- 7. MENTALIDADE: frase e afirmação num cartão só ---------- */
function secMente(){const per=periodo();const modo=VIEW.mente||(per==="manha"?"a":"f");
  let corpo=modo==="f"?secFrase():secAfirm().replace(/^\s*<div class="sec">[\s\S]*?<\/div>\s*/,"");
  return `<div class="sec"><h2>${ic("sparkles")} Mentalidade</h2><div class="mseg" role="tablist"><button role="tab" data-a="mente" data-m="f" aria-selected="${modo==="f"}">Frase</button><button role="tab" data-a="mente" data-m="a" aria-selected="${modo==="a"}">Afirmação</button></div></div>${corpo}`;}
ACT.mente=el=>{VIEW.mente=el.dataset.m;rr();};

/* ---------- 6. FAIXA ÚNICA DE PENDÊNCIAS ---------- */
function pendencias(){const A=[],t=TODAY(),go=v=>`data-a="go" data-v="${gv(v)}"`;
  try{const al=alertasNovos();if(al.length)A.push(["jarvis","triangle-alert",al.length===1?"Alerta: "+al[0].t:`${al.length} sinais de atenção nesta semana`,`data-a="alertas"`,2]);}catch(e){}
  /* contas */
  const C=all("conta").filter(c=>c.status!=="paga"&&c.venc);
  const atr=C.filter(c=>c.tipo==="pagar"&&c.venc<t),hj=C.filter(c=>c.tipo==="pagar"&&(c.venc===t||c.venc===addDays(t,1))),rc=C.filter(c=>c.tipo==="receber"&&c.venc<=t);
  if(atr.length)A.push(["contas","receipt",atr.length===1?`Conta atrasada: ${atr[0].desc} · ${money(atr[0].valor)}`:`${atr.length} contas atrasadas · ${money(sum(atr.map(c=>c.valor)))}`,go({v:"contas",tab:"pagar"}),0]);
  if(hj.length)A.push(["contas","receipt",hj.length===1?`${hj[0].venc===t?"Vence hoje":"Vence amanhã"}: ${hj[0].desc} · ${money(hj[0].valor)}`:`${hj.length} contas vencem até amanhã · ${money(sum(hj.map(c=>c.valor)))}`,go({v:"contas",tab:"pagar"}),1]);
  if(rc.length)A.push(["contas","coins",rc.length===1?`A receber hoje: ${rc[0].desc}`:`${rc.length} valores para receber`,go({v:"contas",tab:"receber"}),2]);
  /* documentos dos editais com prazo perto */
  all("ed").forEach(e=>(e.pess||[]).forEach(p=>{if(p.st!=="c"||!p.docs||!p.docs.prazo||!p.id)return;const I=p.docs.itens||[],f=I.filter(x=>!x.ok).length;if(!f)return;const n=diasAte(p.docs.prazo);if(n>5)return;
    A.push(["editais","clipboard-check",`Documentos de ${p.n}: ${f===1?"falta 1":"faltam "+f} · ${n<0?"prazo vencido":n===0?"vence hoje":n===1?"vence amanhã":"vence em "+n+" dias"}`,`data-a="eddAbrir" data-ed="${e.id}" data-p="${p.id}"`,n<=1?0:1]);}));
  /* aniversários */
  anivHoje().forEach(c=>A.push(["ctt","cake",`Hoje é aniversário de ${c.nome}`,`data-a="anivMsg" data-id="${c.id}"`,1]));
  /* contatos, compromissos, ciclo, cartas, Feynman */
  try{cmpVencidos().slice(0,2).forEach(c=>A.push(["cmp","handshake",`Prazo vencido: ${c.meta}. Cumpriu?`,go({v:"cmp"}),1]));const pg=cmpPendentes();if(pg.length)A.push(["cmp","scale",pg.length===1?`Consequência a pagar: ${pg[0].cons}`:`${pg.length} consequências a pagar`,go({v:"cmp"}),2]);}catch(e){}
  try{const ci=cicAberto();if(ci&&cicSem(ci)>12)A.push(["ciclo","flag","O ciclo terminou: faça a revisão",`data-a="cicRev" data-c="${ci.id}"`,2]);}catch(e){}
  const ct=cttDevidos();if(ct.length)A.push(["ctt","users",ct.length===1?`Retomar contato com ${ct[0].nome}`:`${ct.length} contatos para retomar`,go({v:"ctt"}),3]);
  try{const ca=cartasChegaram();if(ca.length)A.push(["carta","mail-open",ca.length===1?"Chegou uma carta do seu eu do passado":`Chegaram ${ca.length} cartas do seu eu do passado`,go({v:"carta"}),2]);}catch(e){}
  try{const fy=feyDevidos();if(fy.length)A.push(["feyn","brain",fy.length===1?`Revisar: ${fy[0].conceito}`:`${fy.length} conceitos para revisar`,go({v:"feyn"}),3]);}catch(e){}
  /* relatório do mês nos primeiros dias */
  const ant=ymAdd(t.slice(0,7),-1);if(+t.slice(8)<=5&&lsGet("mu_rel_visto","")!==ant)A.push(["todo","bar-chart",`Seu relatório de ${MESES[+ant.slice(5)-1].toLowerCase()} está pronto`,go({v:"rel",ym:ant}),1]);
  return A.sort((a,b)=>a[4]-b[4]);}
let PENDS=[];
secAvisos=function(){const A=pendencias();PENDS=A;if(!A.length)return"";
  const row=([k,i,tx,a])=>`<button class="av" role="listitem" ${mstyle(MODS[k]?k:"todo")} ${a}><span class="mb">${ic(i)}</span><span class="grow">${esc(tx)}</span>${ic("chevron-right")}</button>`;
  const V=A.length>4?A.slice(0,3).map(row).join("")+`<button class="av" role="listitem" data-a="pendTodas"><span class="mb" style="background:var(--sf3);color:var(--soft)">${ic("ellipsis-vertical")}</span><span class="grow">Mais ${A.length-3} pendências</span>${ic("chevron-right")}</button>`:A.map(row).join("");
  return `<div class="avs" role="list" aria-label="Pendências">${V}</div>`;};
ACT.pendTodas=()=>sheet(`<h2>Pendências</h2><div class="avs" style="box-shadow:none">${PENDS.map(([k,i,tx,a])=>`<button class="av" ${mstyle(MODS[k]?k:"todo")} ${a}><span class="mb">${ic(i)}</span><span class="grow">${esc(tx)}</span>${ic("chevron-right")}</button>`).join("")}</div>`);
ACT.avisosTodos=ACT.pendTodas;

/* ---------- 15. ANIVERSÁRIO DOS CONTATOS ---------- */
(()=>{const i=CTT_F.findIndex(f=>f.k==="notas");CTT_F.splice(i<0?CTT_F.length:i,0,{k:"aniv",l:"Aniversário (o ano pode ser qualquer um)",type:"date"});})();
const anivMD=c=>c&&c.aniv?String(c.aniv).slice(5,10):"";
const anivHoje=()=>all("ctt").filter(c=>anivMD(c)===TODAY().slice(5,10));
const anivProx=(dias=7)=>{const R=[];for(let i=1;i<=dias;i++){const d=addDays(TODAY(),i);all("ctt").filter(c=>anivMD(c)===d.slice(5,10)).forEach(c=>R.push({c,d,i}));}return R;};
function anivTexto(c){const n=String(c.nome||"").split(" ")[0];return `Feliz aniversário, ${n}! 🎉 Que esse novo ano venha com muita saúde, alegria e grandes realizações. Um abraço!`;}
ACT.anivMsg=el=>{const c=getD(el.dataset.id);if(!c)return;const wa=typeof eddWa==="function"?eddWa(c):"";const txt=anivTexto(c);
  sheet(`<div class="row"><span class="mb" ${mstyle("ctt")}>${ic("cake")}</span><h2 class="grow" style="margin:0">Aniversário de ${esc(c.nome)}</h2></div>
   <label class="fld"><span>Mensagem</span><textarea id="anT" rows="4">${esc(txt)}</textarea></label>
   <div class="btns h"><button class="btn" id="anZ">${ic("send")} ${wa?"Abrir conversa":"Abrir WhatsApp"}</button><button class="btn ghost" id="anC">${ic("copy")} Copiar</button></div>
   <button class="btn ghost full" style="margin-top:8px" id="anR">${ic("check")} Já mandei os parabéns</button>`,s=>{
    const T=()=>s.querySelector("#anT").value;
    s.querySelector("#anZ").onclick=()=>{window.open(`https://wa.me/${wa}?text=${encodeURIComponent(T())}`,"_blank","noopener");anivFeito(c);};
    s.querySelector("#anC").onclick=async()=>{const ok=await eddCopiar(T());toast(ok?"copy":"triangle-alert",ok?"Mensagem copiada":"Não deu para copiar","");};
    s.querySelector("#anR").onclick=()=>{anivFeito(c);closeSheet();rr();};});};
function anivFeito(c){c.log=c.log||[];if(!c.log.some(x=>x.d===TODAY()&&/aniversário/i.test(x.t||""))){c.log.push({d:TODAY(),t:"Parabéns de aniversário"});c.ult=TODAY();save(c);}}
/* aviso no celular uma vez no dia */
setInterval(()=>{try{if(!DB.be)return;const t=TODAY();if(new Date().getHours()<8)return;anivHoje().forEach(c=>{if(c.anivAv===t)return;c.anivAv=t;save(c);notify("Aniversário de "+c.nome,"Toque para mandar os parabéns.");});}catch(e){}},60000);
const _cttSheet47=cttSheet;cttSheet=function(c){_cttSheet47.apply(this,arguments);if(!c||!c.aniv)return;const s=$("sheet");const sub=s&&s.querySelector(".muted.small");
  if(sub){const hoje=anivMD(c)===TODAY().slice(5,10);sub.insertAdjacentHTML("afterend",`<div class="tiny" style="margin-top:4px;font-weight:700;color:${hoje?"var(--notx)":"var(--soft)"}">${ic("cake")} ${hoje?"Aniversário hoje!":"Aniversário: "+fdate(c.aniv).slice(0,5)}${hoje?` · <button class="lk tiny" data-a="anivMsg" data-id="${c.id}">mandar parabéns</button>`:""}</div>`);}};

/* ---------- 2. BRIEFING E FECHAMENTO COMPLETOS ---------- */
const _briefFatos47=briefFatos;
briefFatos=function(per){const F=_briefFatos47.apply(this,arguments),t=TODAY();
  try{const L=all("todo"),hj=L.filter(x=>x.d===t);F.tarefas={pendentes:hj.filter(x=>!x.ok).map(x=>x.t),de_dias_anteriores:hj.filter(x=>!x.ok&&todoIdade(x)>0).map(x=>x.t),concluidas_hoje:L.filter(x=>x.ok&&x.feito===t).map(x=>x.t),importantes:hj.filter(x=>!x.ok&&x.imp).map(x=>x.t)};}catch(e){}
  try{F.documentos=[];all("ed").forEach(e=>(e.pess||[]).forEach(p=>{if(p.st!=="c"||!p.docs||!p.docs.prazo)return;const f=(p.docs.itens||[]).filter(x=>!x.ok).length;if(f&&diasAte(p.docs.prazo)<=7)F.documentos.push({edital:e.nome,projeto:p.n,faltam:f,quando:quandoTxt(p.docs.prazo)});}));}catch(e){}
  try{const D=desDados(),w=desSemana(t);F.desafio={semana:DES[w][2],series:DES_SERIES+"x"+desReps(D,DES[w][0]),feito_hoje:desFeito(D,t),series_feitas:desSer(D,t).filter(Boolean).length,pontos_semana:desPontosSemana(D,t,w)};}catch(e){}
  F.contas_receber_hoje=all("conta").filter(c=>c.tipo==="receber"&&c.status!=="paga"&&c.venc===t).map(c=>({desc:c.desc,valor:c.valor}));
  F.aniversarios_hoje=anivHoje().map(c=>c.nome);
  return F;};
const _briefLocal47=briefLocal;
briefLocal=function(per){let txt=_briefLocal47.apply(this,arguments);const F=briefFatos(per),S=[];
  if(per==="manha"){const T=F.tarefas||{pendentes:[],de_dias_anteriores:[],importantes:[]};
    if(T.pendentes.length)S.push(`Você tem ${T.pendentes.length} ${T.pendentes.length===1?"tarefa":"tarefas"} para hoje${T.de_dias_anteriores.length?`, ${T.de_dias_anteriores.length===1?"uma veio":T.de_dias_anteriores.length+" vieram"} de dias anteriores: ${listaTxt(T.de_dias_anteriores.slice(0,2))}`:""}.`);
    if(T.importantes&&T.importantes.length)S.push(`A mais importante: ${T.importantes[0]}.`);
    (F.documentos||[]).slice(0,2).forEach(d=>S.push(`Documentos do edital ${d.edital}, projeto ${d.projeto}: ${d.faltam===1?"falta um":"faltam "+d.faltam}, prazo ${d.quando}.`));
    F.contas_receber_hoje.forEach(c=>S.push(`Hoje você recebe ${c.desc}${valFala(c.valor)}.`));
    if(F.desafio&&!F.desafio.feito_hoje)S.push(`É a ${F.desafio.semana.toLowerCase()}: ${F.desafio.series.replace("x"," séries de ")} te esperam.`);
    F.aniversarios_hoje.forEach(n=>S.push(`Hoje é aniversário de ${n}.`));}
  else{const T=F.tarefas||{pendentes:[],concluidas_hoje:[]};
    if(T.concluidas_hoje.length)S.push(`Você concluiu ${T.concluidas_hoje.length} ${T.concluidas_hoje.length===1?"tarefa":"tarefas"}.`);
    if(T.pendentes.length)S.push(`Ficam para amanhã: ${listaTxt(T.pendentes.slice(0,3))}${T.pendentes.length>3?" e mais "+(T.pendentes.length-3):""}.`);
    if(F.desafio)S.push(F.desafio.feito_hoje?`Ponto do desafio batido: ${F.desafio.pontos_semana} na semana.`:F.desafio.series_feitas?`Faltam ${4-F.desafio.series_feitas} séries para bater o ponto do desafio.`:"O ponto do desafio ainda está aberto.");}
  if(!S.length)return txt;
  /* na manhã, entra antes do fecho; na noite, antes do convite final */
  const corte=per==="manha"?txt.search(/(Seu dominó de hoje|Atenção:)/):txt.search(/(Prioridade de amanhã|Antes de dormir)/);
  return corte>0?txt.slice(0,corte)+S.join(" ")+" "+txt.slice(corte):txt+" "+S.join(" ");};

/* ---------- 3. JARVIS: comandos e respostas na hora ---------- */
function jarResp(titulo,texto,extra=""){sheet(`<div class="row"><span class="mb" ${mstyle("jarvis")}>${ic("audio-lines")}</span><h2 class="grow" style="margin:0">${esc(titulo)}</h2><button class="ib" data-a="jarCalar" aria-label="Parar a voz">${ic("volume-x")}</button></div>
  <div class="jara" style="margin-top:12px;font-size:1rem;white-space:pre-line">${esc(texto)}</div>${extra}<div class="btns"><button class="btn ghost full" data-a="close">Ok</button></div>`);qualVoz(texto);}
const achar=(lista,campo,q)=>{const P=normTxt(q).split(/\s+/).filter(w=>w.length>=3&&!["edital","projeto","orcamento","de","do","da","dos","das"].includes(w));if(!P.length)return null;
  let best=null,bs=0;lista.forEach(x=>{const n=normTxt(campo(x));const sc=P.filter(w=>n.includes(w)||n.includes(w.slice(0,5))).length;if(sc>bs){bs=sc;best=x;}});return best;};
function oQueFaltaHoje(){const t=TODAY(),now=new Date(),S=[];
  const T=todosDoDia(t).filter(x=>!x.ok);S.push(T.length?`Tarefas: ${T.length} pendente${T.length>1?"s":""} — ${listaTxt(T.slice(0,4).map(x=>x.t))}${T.length>4?" e mais "+(T.length-4):""}.`:"Tarefas: nenhuma pendente. 👏");
  const ag=all("ev").filter(e=>evNoDia(e,t)&&(!e.h||dtOf(t,e.h)>now));if(ag.length)S.push(`Agenda: ${listaTxt(ag.slice(0,3).map(e=>e.t+(e.h?" às "+e.h:"")))}.`);
  const C=all("conta").filter(c=>c.status!=="paga"&&c.venc&&c.venc<=t);if(C.length)S.push(`Contas: ${listaTxt(C.slice(0,3).map(c=>(c.tipo==="receber"?"receber ":"pagar ")+c.desc+(DISCRETO?"":" ("+moneyRaw(c.valor)+")")))}.`);
  const docs=[];all("ed").forEach(e=>(e.pess||[]).forEach(p=>{if(p.st==="c"&&p.docs&&p.docs.prazo&&diasAte(p.docs.prazo)<=3){const f=(p.docs.itens||[]).filter(x=>!x.ok).length;if(f)docs.push(`${p.n} (${f})`);}}));if(docs.length)S.push(`Documentos com prazo perto: ${listaTxt(docs)}.`);
  const tr=[];if(!trkHas("gym",t)&&typeof treinoHoje==="function"&&treinoHoje(t).length)tr.push("academia");if(!trkHas("cap",t)&&/cap/i.test(JSON.stringify(typeof treinoHoje==="function"?treinoHoje(t):[])))tr.push("capoeira");
  try{const D=desDados();if(!desFeito(D,t)){const f=DES_SERIES-desSer(D,t).filter(Boolean).length;tr.push(`${f} ${f===1?"série":"séries"} do desafio`);}}catch(e){}
  if(tr.length)S.push(`Treino: ${listaTxt(tr)}.`);
  const H=all("hab"),hf=H.filter(h=>!(h.dias&&h.dias[t]));if(H.length&&hf.length)S.push(`Hábitos: faltam ${hf.length} de ${H.length}.`);
  return S.join("\n");}
function faltaEdital(e){const S=[`Edital ${e.nome} (${edAno(e)}).`];const C=(e.pess||[]).filter(p=>p.st==="c"),A=(e.pess||[]).filter(p=>p.st==="a");
  if(!C.length&&!A.length)return S.concat("Ainda não há projetos neste edital.").join("\n");
  C.forEach(p=>{const I=(p.docs&&p.docs.itens)||[],f=I.filter(x=>!x.ok);const g=ganhoP(p),rc=recP(p);
    S.push(`• ${p.n}: ${I.length?(f.length?`faltam ${f.length} documento${f.length>1?"s":""} (${listaTxt(f.slice(0,3).map(x=>x.t))}${f.length>3?"…":""})`:"documentação completa"):"lista de documentos ainda não montada"}${p.docs&&p.docs.prazo&&f.length?`, prazo ${quandoTxt(p.docs.prazo)}`:""}${g>rc?`; falta receber ${DISCRETO?"um valor":moneyRaw(g-rc)}`:g?"; tudo recebido":""}.`);});
  if(A.length)S.push(`Aguardando resultado: ${listaTxt(A.map(p=>p.n))}.`);
  try{const n=edNotas(edAno(e)).filter(x=>!x.feito&&x.ed===e.id).length;if(n)S.push(`${n} nota${n>1?"s":""} pendente${n>1?"s":""} neste edital.`);}catch(x){}
  return S.join("\n");}
function rotaNova(txt){const n=normTxt(txt).replace(/^(jarvis|ei jarvis|ok jarvis)[,\s]*/,"").trim();if(!n)return false;
  /* tarefa */
  let m=n.match(/^(?:(?:anota|anote|adiciona|adicione|cria|crie|coloca|coloque|bota|inclui|inclua)(?:\s+(?:uma|a|na|nas))?\s+(?:nova\s+)?(?:tarefas?|to-?do)\b|(?:nova\s+)?tarefa\s*[:,-])\s*(?:de |pra |para |:|,|-)?\s*(.+)$/);
  if(m&&m[1]&&!/^(de hoje|hoje|s de hoje)\??$/.test(m[1])){let tx=String(txt).replace(/^.*?(tarefas?|to-?do)\s*(de |pra |para |:|,|-)?\s*/i,"").trim();let d=TODAY();
    const AM=/(^|\s)(para |pra |de )?amanh[ãa](?=$|[\s.,!?])/i;if(AM.test(tx)){d=addDays(TODAY(),1);tx=tx.replace(AM," ").replace(/\s{2,}/g," ").trim();}
    tx=tx.replace(/^(que |de )/i,"");tx=tx.charAt(0).toUpperCase()+tx.slice(1);if(!tx)return false;
    const o=Math.max(0,...all("todo").filter(x=>x.d===d).map(x=>x.o||0))+1;save({id:"todo_"+nid(),c:"todo",t:tx,d,dias:[d],ok:false,o});rr();
    jarResp("Tarefa anotada",`${tx}${d===TODAY()?"":" · para amanhã"}.`);return true;}
  /* orçamento */
  if(/(copia|copie|copiar|manda|mande|me da|qual|quanto).{0,25}orcamento|orcamento.{0,10}(do|da|de)/.test(n)&&all("orc").length){const q=n.replace(/^.*?orcamentos?\s*(do|da|de|dos|das|pra|para)?\s*/,"");const o=achar(all("orc"),x=>x.t,q)||(all("orc").length===1&&!q.trim()?all("orc")[0]:null);
    if(!o){jarResp("Qual orçamento?",`Não achei "${q}". Você tem: ${listaTxt(orcLista().map(x=>x.t))}.`);return true;}
    const tx=orcTexto(o);eddCopiar(tx).then(ok=>{jarResp(ok?"Orçamento copiado":"Orçamento",`${o.t}${+o.v>0&&!DISCRETO?" · "+moneyRaw(+o.v):""}. ${ok?"É só colar para o cliente.":"Toque em copiar abaixo."}`,ok?"":`<button class="btn full" style="margin-top:12px" data-a="orcCopiar" data-id="${o.id}">${ic("copy")} Copiar</button>`);});return true;}
  /* desafio */
  if(/desafio|(bati|batí) o ponto|(fiz|terminei) (a |as |uma )?(serie|series)|(flexoes|abdominais|barras|agachamentos) (feit|do dia)/.test(n)&&/(fiz|feit|bati|terminei|marca|marque|concluí|conclui|serie)/.test(n)&&!/o que|quant[oa]s?|como|qual|quais|faltam|\?/.test(n)&&!/\?\s*$/.test(String(txt))){
    const t=TODAY(),D=desDados(),S=desSer(D,t).slice();while(S.length<DES_SERIES)S.push(0);const todas=/(bati|todas|4|quatro|completo|inteiro)/.test(n);
    if(todas)S.fill(1);else{const i=S.findIndex(x=>!x);if(i>=0)S[i]=1;}
    const antes=desFeito(D,t);D.log[t]=S;save(D);desSyncCheck(t);const w=desSemana(t),f=S.filter(Boolean).length;
    if(desFeito(D,t)&&!antes)save({id:"fiz_des_"+t,c:"fiz",t:`Desafio: ${DES_SERIES}×${desReps(D,DES[w][0])} ${DES[w][1].toLowerCase()}`,d:t,auto:1});rr();
    jarResp("Desafio",desFeito(D,t)?`Ponto do dia batido na ${DES[w][2].toLowerCase()}. ${desPontosSemana(D,t,w)} ponto${desPontosSemana(D,t,w)>1?"s":""} na semana.`:`Série ${f} de ${DES_SERIES} marcada. Faltam ${DES_SERIES-f}.`);return true;}
  /* edital */
  m=n.match(/(?:o que falta|como esta|como anda|situacao|resumo)\s*(?:d[oa]s?|n[oa]|pr[oa]|para o|para a)?\s*(?:edital\s*)?(.+)/);
  if(m&&(/edital/.test(n)||achar(all("ed"),e=>e.nome+" "+(e.pess||[]).map(p=>p.n).join(" "),m[1]))&&!/^hoje\b/.test(m[1])){
    const e=achar(all("ed"),e=>e.nome+" "+(e.pess||[]).map(p=>p.n).join(" "),m[1]);
    if(!e){jarResp("Qual edital?",`Não achei esse edital. Os deste ano: ${listaTxt(edsDoAno(String(yNow())).map(x=>x.nome))||"nenhum"}.`);return true;}
    jarResp("Edital",faltaEdital(e),`<button class="btn ghost full" style="margin-top:12px" data-a="go" data-v="${gv({v:"editais",ano:edAno(e)})}">${ic("kanban")} Abrir o edital</button>`);return true;}
  /* o que falta hoje */
  if(/^(o que|que) (ainda )?(falta|tem|preciso|devo)( fazer)?( pra| para| de)?( hoje)?\??$|^o que falta hoje|^(meu|me da o|me de o) resumo de hoje|^o que tenho (pra|para) hoje/.test(n)){jarResp("O que falta hoje",oQueFaltaHoje());return true;}
  /* relatório e fechamento */
  if(/relatorio (do|de) mes|relatorio mensal|como foi (o )?mes/.test(n)){closeSheet();go({v:"rel",ym:/passado|anterior/.test(n)?ymAdd(TODAY().slice(0,7),-1):TODAY().slice(0,7)});return true;}
  if(/fechamento (do|da) (dia|noite)|como foi (o )?meu dia|resumo da noite/.test(n)){brfAbrir("noite");return true;}
  return false;}
const _copiRun47=copiRun;copiRun=async function(txt){if(rotaNova(txt))return;return _copiRun47.apply(this,arguments);};
const _jarPerg47=jarPerguntar;jarPerguntar=async function(q){if(!JAR.busy&&rotaNova(q))return;return _jarPerg47.apply(this,arguments);};
try{JAR_TIPOS.orcamentos="orc";JAR_DESC.orcamentos="orçamentos do fotógrafo (t=serviço, v=valor, det=o que inclui)";}catch(e){}

/* ---------- 4. DESLIZAR A TAREFA ---------- */
(()=>{let S=null;const LIM=78;
  document.addEventListener("pointerdown",e=>{const row=e.target.closest&&e.target.closest(".todo-it[data-sw]");if(!row||e.button>0)return;S={row,x:e.clientX,y:e.clientY,dx:0,on:false,id:e.pointerId};},{passive:true});
  document.addEventListener("pointermove",e=>{if(!S||e.pointerId!==S.id)return;const dx=e.clientX-S.x,dy=e.clientY-S.y;
    if(!S.on){if(Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)){S=null;return;}if(Math.abs(dx)<12)return;S.on=true;S.row.classList.add("sw");try{S.row.setPointerCapture(e.pointerId);}catch(x){}}
    S.dx=Math.max(-140,Math.min(140,dx));S.row.style.transform=`translateX(${S.dx}px)`;S.row.dataset.dir=S.dx>LIM?"ok":S.dx<-LIM?"am":"";},{passive:true});
  const fim=e=>{if(!S||(e&&e.pointerId!==S.id))return;const{row,dx,on}=S;S=null;if(!on)return;row.classList.remove("sw");
    const bloq=ev=>{ev.stopPropagation();ev.preventDefault();};row.addEventListener("click",bloq,{capture:true,once:true});setTimeout(()=>row.removeEventListener("click",bloq,{capture:true}),400);
    lsSet("mu_sw_n",lsGet("mu_sw_n",0)+(Math.abs(dx)>LIM?1:0));
    if(dx>LIM){row.style.transform="translateX(110%)";setTimeout(()=>{const x=getD(row.dataset.sw);if(x&&!x.ok){todoMarca(x,true);toast("check","Tarefa concluída",x.t);}rr();},160);}
    else if(dx<-LIM){row.style.transform="translateX(-110%)";setTimeout(()=>{const x=getD(row.dataset.sw);if(x){const t=TODAY(),am=addDays(t,1);x.dias=todoDias(x).filter(z=>z!==t).concat(am);x.d=am;save(x);toast("calendar","Passou para amanhã",x.t);}rr();},160);}
    else{row.style.transform="";delete row.dataset.dir;}};
  document.addEventListener("pointerup",fim,{passive:true});document.addEventListener("pointercancel",e=>{if(S&&S.on){S.row.style.transform="";S.row.classList.remove("sw");}S=null;},{passive:true});})();

/* ---------- 8. MÓDULOS POR USO ---------- */
if(!lsGet("mu_uso_ini",""))lsSet("mu_uso_ini",TODAY());
let USO_ULT="";
function usoRegistrar(){const v=VIEW||{};let key=null;for(const k in MODS){const mv=MODS[k].v;if(mv&&mv.v===v.v&&(mv.k==null||mv.k===v.k)){key=k;break;}}
  if(!key||key===USO_ULT)return;USO_ULT=key;const U=lsGet("mu_uso",{});U[key]={n:((U[key]&&U[key].n)||0)+1,ult:TODAY()};lsSet("mu_uso",U);}
const _render47=render;render=function(){const r=_render47.apply(this,arguments);try{if(VIEW&&VIEW.v!=="mods")usoRegistrar();else USO_ULT="";}catch(e){}return r;};
const usoScore=u=>u?u.n*Math.pow(.5,Math.max(0,-diasAte(u.ult))/21):0;
const tile=k=>`<button class="tile" ${mstyle(k)} data-a="go" data-v="${gv(MODS[k].v)}"><span class="mb">${ic(MODS[k].ic)}</span>${esc(MODS[k].n)}</button>`;
modsGrid=function(){const U=lsGet("mu_uso",{}),maduro=-diasAte(lsGet("mu_uso_ini",TODAY()))>=14;
  const usados=Object.keys(U).filter(k=>MODS[k]&&U[k].n>=2).sort((a,b)=>usoScore(U[b])-usoScore(U[a])).slice(0,6);
  let h=usados.length>=3?`<div class="grp">${ic("star")} Mais usados</div><div class="grid">${usados.map(tile).join("")}</div>`:"";
  const pouco=[];
  const top=usados.length>=3?usados:[];
  h+=MOD_GROUPS.map(([g,ks])=>{const K=ks.filter(k=>MODS[k]&&!top.includes(k));const vis=maduro?K.filter(k=>U[k]):K;K.filter(k=>!vis.includes(k)).forEach(k=>pouco.push(k));
    return vis.length?`<div class="grp">${esc(g)}</div><div class="grid">${vis.map(tile).join("")}</div>`:"";}).join("");
  if(pouco.length)h+=`<details class="pouco"><summary>${ic("chevron-down")} Pouco usados <span class="chip">${pouco.length}</span></summary><div class="grid">${pouco.map(tile).join("")}</div></details>`;
  return h;};

/* ---------- 9. CORES POR ÁREA ---------- */
const AREA_COR={"Treinos e corpo":["#EA580C","#FB923C"],"Rotina e espiritualidade":["#0F766E","#2DD4BF"],"Estudos e crescimento":["#2563EB","#60A5FA"],"Metas":["#7C3AED","#A78BFA"],
  "Dinheiro":["#15803D","#4ADE80"],"Trabalho e cultura":["#BE123C","#FB7185"],"Vida pessoal":["#DB2777","#F9A8D4"],"Projetos pessoais":["#9333EA","#C084FC"]};
MOD_GROUPS.forEach(([g,ks])=>{const c=AREA_COR[g];if(!c)return;ks.forEach(k=>{if(MODS[k]){MODS[k].c1=c[0];MODS[k].c2=c[1];}});});
/* módulos fora dos grupos, mas da mesma área */
[["ctt","Trabalho e cultura"],["todo","Rotina e espiritualidade"],["med","Rotina e espiritualidade"],["kegel","Treinos e corpo"],["des","Treinos e corpo"],["conc","Estudos e crescimento"],["gastos","Dinheiro"],["contas","Dinheiro"]].forEach(([k,g])=>{if(MODS[k]&&AREA_COR[g]){MODS[k].c1=AREA_COR[g][0];MODS[k].c2=AREA_COR[g][1];}});

/* ---------- 10. BACKUP: o app já tem "Exportar cópia / Importar" em Ajustes → Seus dados (não duplicar) ---------- */

/* ---------- 11. COMPROVANTE NA EDIÇÃO DO GASTO ---------- */
const _gForm47=gForm;gForm=function(e){_gForm47.apply(this,arguments);if(!e||!e.img)return;const s=$("sheet"),h2=s&&s.querySelector("h2");if(!h2)return;
  h2.insertAdjacentHTML("afterend",`<button class="gfcmp" data-a="gComp" data-id="${e.id}" aria-label="Ver comprovante">${imgTag(e.img,"t","","Comprovante")}<span>${ic("receipt-text")} Comprovante · toque para ampliar</span></button>`);hydrate(s);};

/* ---------- 14. HORAS DE ESTUDO PELO FOCO ---------- */
function estudoSomar(min,d){if(!(min>0))return;d=d||TODAY();const id=tid("conc",d),ex=getD(id)||{};save({...ex,id,c:"trk",k:"conc",d,t:ex.t||"Dia de estudo",min:(+ex.min||0)+min});}
let FOCO_ULT=null;
const _focoGo47=ACT.focoGo;ACT.focoGo=el=>{_focoGo47(el);if(FOCO&&lsGet("mu_foco_est",false)){FOCO.estudo=true;FOCO.label="Estudo";focoSave();rr();}};
const _focoStop47=ACT.focoStop;ACT.focoStop=()=>{if(FOCO&&FOCO.estudo){const done=Math.floor((FOCO.dur*60000-focoLeft())/60000);if(done>0)estudoSomar(done);FOCO_ULT=null;}_focoStop47();};
setInterval(()=>{if(FOCO){FOCO_ULT=FOCO.estudo?{dur:FOCO.dur,end:FOCO.end,paused:FOCO.paused}:null;return;}
  if(FOCO_ULT){const f=FOCO_ULT;FOCO_ULT=null;if(f.paused==null&&Date.now()>=f.end)estudoSomar(f.dur);}},1000);
ACT.focoEst=()=>{lsSet("mu_foco_est",!lsGet("mu_foco_est",false));rr();};
const _secFoco47=secFoco;secFoco=function(){let h=_secFoco47();if(FOCO){if(FOCO.estudo)h=h.replace("EM FOCO","EM FOCO · ESTUDO");return h;}const on=lsGet("mu_foco_est",false);
  /* a opção fica numa linha própria, embaixo, para não espremer o texto */
  return h.replace(/<\/div><\/div>\s*$/,`<button class="focoest ${on?"on":""}" data-a="focoEst" aria-pressed="${on}">${ic(on?"check":"graduation-cap")} ${on?"Esta sessão conta como estudo":"Contar como estudo para o concurso"}</button></div></div>`);};
const estudoMin=pre=>sum(all("trk").filter(x=>x.k==="conc"&&x.d.startsWith(pre)).map(x=>+x.min||0));
const hmin=min=>min>=60?Math.floor(min/60)+"h"+(min%60?pad(min%60):""):min+" min";
const _trk47=VIEWS.trk;VIEWS.trk=function(){const h=_trk47.apply(this,arguments);if(VIEW.k!=="conc")return h;const t=TODAY();
  let sem=0;for(let i=0;i<7;i++)sem+=estudoMin(addDays(t,-i));
  const card=`<div class="card hero" ${mstyle("conc")}><div class="muted small">${ic("timer")} Horas de estudo (sessões de foco marcadas como Estudo)</div><div class="stats"><div><b>${hmin(estudoMin(t))}</b><span>hoje</span></div><div><b>${hmin(sem)}</b><span>últimos 7 dias</span></div><div><b>${hmin(estudoMin(t.slice(0,7)))}</b><span>no mês</span></div></div></div>`;
  return h.replace("</header>","</header>"+card);};

/* ---------- 13. PREVISÃO DE CAIXA ---------- */
function gastoMedio(){const ym=TODAY().slice(0,7);const M=[1,2,3].map(i=>sum(all("exp").filter(e=>(e.d||"").startsWith(ymAdd(ym,-i))).map(e=>+e.v||0))).filter(v=>v>0);return M.length?sum(M)/M.length:0;}
function previsao(n=3){const t=TODAY(),ym=t.slice(0,7),med=gastoMedio(),C=all("conta").filter(c=>c.status!=="paga");let acum=0;
  return Array.from({length:n},(_,i)=>{const m=ymAdd(ym,i);const naData=c=>c.venc&&(i===0?c.venc<=m+"-31":c.venc.startsWith(m));
    const rec=sum(C.filter(c=>c.tipo==="receber"&&naData(c)).map(c=>+c.valor||0)),pag=sum(C.filter(c=>c.tipo==="pagar"&&naData(c)).map(c=>+c.valor||0));
    const ja=i===0?sum(all("exp").filter(e=>(e.d||"").startsWith(ym)).map(e=>+e.v||0)):0;const gas=Math.max(0,med-ja);const sobra=rec-pag-gas;acum+=sobra;return{m,rec,pag,gas,sobra,acum};});}
function previsaoHTML(){const P=previsao(3),med=gastoMedio();if(!P.some(p=>p.rec||p.pag)&&!med)return"";
  const sem=all("conta").filter(c=>c.status!=="paga"&&!c.venc).length;
  return `<div class="card prev" ${mstyle("contas")}><div class="row"><b class="grow">${ic("piggy-bank")} Previsão de caixa</b><span class="tiny faint">próximos 3 meses</span></div>
   ${P.map((p,i)=>`<div class="prevm"><div class="row"><span class="grow" style="font-weight:800">${i===0?"Este mês":MESES[+p.m.slice(5)-1]}</span><b class="${p.sobra>=0?"pos":"neg"}">${p.sobra>=0?"sobra ":"falta "}${money(Math.abs(p.sobra))}</b></div>
     <span class="tiny muted">entra ${money(p.rec)} · contas ${money(p.pag)} · gastos ${money(p.gas)}</span></div>`).join("")}
   <p class="tiny faint" style="margin:8px 0 0">Conta o que está em Contas a receber (inclusive editais) e a pagar, menos a sua média de gastos (${money(med)} por mês nos últimos 3 meses).${sem?` ${sem} ${sem===1?"conta sem data não entra":"contas sem data não entram"}.`:""}</p></div>`;}
const _contas47=VIEWS.contas;VIEWS.contas=function(){const h=_contas47.apply(this,arguments),c=previsaoHTML();return c?h.replace("</header>","</header>"+c):h;};

/* ---------- 12. RELATÓRIO DO MÊS ---------- */
function relatorio(ym){const no=d=>(d||"").startsWith(ym);
  const exp=all("exp").filter(e=>no(e.d)),saiGastos=sum(exp.map(e=>+e.v||0));
  const pagas=all("conta").filter(c=>c.status==="paga"&&no(c.pagoEm));const entrou=sum(pagas.filter(c=>c.tipo==="receber").map(c=>+c.valor||0)),saiContas=sum(pagas.filter(c=>c.tipo==="pagar").map(c=>+c.valor||0));
  const cats={};exp.forEach(e=>{cats[e.cat||"Outros"]=(cats[e.cat||"Outros"]||0)+(+e.v||0);});const topCat=Object.entries(cats).sort((a,b)=>b[1]-a[1]).slice(0,3);
  const tk=k=>all("trk").filter(x=>x.k===k&&no(x.d)).length;
  const dias=new Date(+ym.slice(0,4),+ym.slice(5,7),0).getDate();const D=[];for(let i=1;i<=dias;i++)D.push(ym+"-"+pad(i));
  const st=D.map(d=>todoStats(d)).filter(s=>s.tot);const fe=sum(st.map(s=>s.fe)),tot=sum(st.map(s=>s.tot));const dias100=st.filter(s=>s.fe===s.tot).length;
  let melhor=null;D.forEach(d=>{const s=todoStats(d);if(s.fe&&(!melhor||s.fe>melhor.fe))melhor={d,fe:s.fe};});
  const H=all("hab");const habF=sum(H.map(h=>Object.keys(h.dias||{}).filter(no).length));
  let des=0;try{des=desPontosMes(desDados(),ym+"-");}catch(e){}
  const foco=sum(all("dia").filter(x=>no(x.d)).map(x=>+x.foco||0));
  const edC=[];all("ed").forEach(e=>(e.pess||[]).forEach(p=>{if(p.st==="c"&&p.stEm&&no(p.stEm))edC.push(p.n);}));
  return{ym,entrou,saiGastos,saiContas,saldo:entrou-saiGastos-saiContas,topCat,gym:tk("gym"),cap:tk("cap"),kegel:tk("kegel"),run:tk("run"),des,fe,tot,pct:tot?Math.round(fe/tot*100):0,dias100,melhor,habF,estudo:estudoMin(ym),foco,fiz:all("fiz").filter(f=>no(f.d)).length,edC};}
VIEWS.rel=()=>{const ym=VIEW.ym||ymAdd(TODAY().slice(0,7),-1);lsSet("mu_rel_visto",ym===ymAdd(TODAY().slice(0,7),-1)?ym:lsGet("mu_rel_visto",""));const R=relatorio(ym),A=relatorio(ymAdd(ym,-1));
  const var_=(a,b)=>b?Math.round((a-b)/b*100):null;const seta=(v,bomSubir=true)=>v==null||v===0?"":`<span class="relv ${(v>0)===bomSubir?"pos":"neg"}">${v>0?"▲":"▼"} ${Math.abs(v)}%</span>`;
  const pos=[];if(R.tot>=5&&R.pct>=70)pos.push(`Concluiu ${R.pct}% das tarefas planejadas`);if(R.dias100)pos.push(`${R.dias100} ${R.dias100===1?"dia":"dias"} com todas as tarefas feitas`);
  if(R.cap+R.gym>A.cap+A.gym&&A.cap+A.gym)pos.push(`Treinou mais que no mês anterior (${R.cap+R.gym} contra ${A.cap+A.gym})`);if(R.des>=15)pos.push(`${R.des} pontos no desafio do mês`);
  if(R.saldo>0)pos.push(`Mês fechou no positivo em ${DISCRETO?"dinheiro":money(R.saldo)}`);if(R.melhor)pos.push(`Dia mais produtivo: ${fdate(R.melhor.d).slice(0,5)}, com ${R.melhor.fe} ${R.melhor.fe===1?"tarefa":"tarefas"}`);if(R.estudo>=120)pos.push(`${hmin(R.estudo)} de estudo`);
  let h=topbar("Relatório do mês","todo");
  h+=`<div class="relnav"><button class="ib" data-a="relMes" data-d="-1" aria-label="Mês anterior">${ic("chevron-left")}</button><b>${mesNome(ym)}</b><button class="ib" data-a="relMes" data-d="1" aria-label="Próximo mês" ${ym>=TODAY().slice(0,7)?"disabled":""}>${ic("chevron-right")}</button></div>`;
  if(pos.length)h+=`<div class="card relpos">${pos.slice(0,5).map(p=>`<div>${ic("trending-up")} ${esc(p)}</div>`).join("")}</div>`;
  h+=`<div class="grp">${ic("wallet")} Dinheiro</div><div class="card"><div class="relst"><div><b class="pos">${money(R.entrou)}</b><span>entrou</span></div><div><b class="neg">${money(R.saiGastos+R.saiContas)}</b><span>saiu</span></div><div><b class="${R.saldo>=0?"pos":"neg"}">${R.saldo<0?"− ":""}${money(Math.abs(R.saldo))}</b><span>saldo</span></div></div>
    <p class="tiny muted" style="margin:10px 0 0">Saiu: ${money(R.saiGastos)} em gastos ${seta(var_(R.saiGastos,A.saiGastos),false)} e ${money(R.saiContas)} em contas pagas.${R.topCat.length?` Maiores categorias: ${R.topCat.map(([c,v])=>`${esc(c)} ${money(v)}`).join(", ")}.`:""}</p></div>`;
  h+=`<div class="grp">${ic("dumbbell")} Treinos</div><div class="card"><div class="relst"><div><b>${R.cap}</b><span>capoeira ${seta(var_(R.cap,A.cap))}</span></div><div><b>${R.gym}</b><span>academia ${seta(var_(R.gym,A.gym))}</span></div><div><b>${R.des}</b><span>pontos no desafio</span></div></div>
    ${R.kegel||R.run?`<p class="tiny muted" style="margin:10px 0 0">${[R.kegel?R.kegel+" de Kegel":"",R.run?R.run+" corridas":""].filter(Boolean).join(" · ")}</p>`:""}</div>`;
  h+=`<div class="grp">${ic("list-checks")} Produtividade</div><div class="card"><div class="relst"><div><b>${R.pct}%</b><span>das tarefas ${seta(R.pct-A.pct&&A.tot?R.pct-A.pct:null)}</span></div><div><b>${R.fe}</b><span>tarefas feitas</span></div><div><b>${R.dias100}</b><span>dias 100%</span></div></div>
    <p class="tiny muted" style="margin:10px 0 0">${[R.estudo?hmin(R.estudo)+" de estudo":"",R.foco?hmin(R.foco)+" de foco":"",R.habF?R.habF+" hábitos cumpridos":"",R.fiz?R.fiz+" atividades registradas":""].filter(Boolean).join(" · ")||"Sem outros registros."}</p></div>`;
  if(ym>=TODAY().slice(0,7))h+=previsaoHTML();
  h+=`<div class="btns"><button class="btn ghost full" data-a="relOuvir">${ic("volume-2")} Ouvir o resumo</button></div>`;
  return `<div class="app">${h}</div>`;};
ACT.relMes=el=>{VIEW.ym=ymAdd(VIEW.ym||ymAdd(TODAY().slice(0,7),-1),+el.dataset.d);rr();};
ACT.relOuvir=()=>{const R=relatorio(VIEW.ym||ymAdd(TODAY().slice(0,7),-1));
  qualVoz(`Resumo de ${mesNome(R.ym)}. ${DISCRETO?"":`Entrou ${moneyRaw(R.entrou)} e saiu ${moneyRaw(R.saiGastos+R.saiContas)}. `}Foram ${R.cap} treinos de capoeira e ${R.gym} de academia, e ${R.des} pontos no desafio. Você concluiu ${R.fe} tarefas, ${R.pct}% do planejado${R.dias100?`, com ${R.dias100} dias completos`:""}.`);};
/* acesso também pela tela de Produtividade */
const _todoV47=VIEWS.todo;VIEWS.todo=function(){const h=_todoV47.apply(this,arguments);return h.replace("</header>",`</header><button class="orc-ent" data-a="go" data-v="${gv({v:"rel",ym:ymAdd(TODAY().slice(0,7),-1)})}"><span class="mb" ${mstyle("todo")}>${ic("bar-chart")}</span><span class="grow"><b>Relatório do mês</b><span class="small muted" style="display:block">Dinheiro, treinos e produtividade de ${MESES[+ymAdd(TODAY().slice(0,7),-1).slice(5)-1].toLowerCase()}</span></span>${ic("chevron-right")}</button>`);};
/* registrar quando um projeto vira contemplado (para o relatório) */
const _ppSt47=ACT.ppSt;ACT.ppSt=el=>{const e=getD(el.dataset.id),p=e&&e.pess[+el.dataset.i];if(p&&el.dataset.st==="c"&&p.st!=="c")p.stEm=TODAY();return _ppSt47(el);};

/* ---------- 17. MODO ESSENCIAL ---------- */
function modoEssencial(){return !!cfg().essencial;}
const _secAcad47=secAcad;secAcad=function(){return modoEssencial()?"":_secAcad47.apply(this,arguments);};
ACT.essencial=()=>{const c=cfg();c.essencial=!c.essencial;save(c);rr();toast("focus",c.essencial?"Modo essencial":"Início completo",c.essencial?"Só tarefas, agenda e desafio.":"Todos os cartões de volta.");};
function secEssencialFim(){return `<button class="mini" style="--mc:var(--soft);margin-top:18px" data-a="essencial"><span class="mini-i">${ic("focus")}</span><span class="grow"><b>Modo essencial</b> · mostrar o Início completo</span></button>`;}

/* ---------- 16. MICROFONE NOS CAMPOS ---------- */
(()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return;let btn=null,alvo=null,rec=null;
  const serve=el=>el&&((el.tagName==="TEXTAREA")||(el.tagName==="INPUT"&&(!el.type||["text","search"].includes(el.type))))&&!el.readOnly&&!el.disabled&&!el.closest("[data-nomic],.copi,.qadd.jar")&&!/^(copiI|jarI|qgV|ppV|ppP|ppR|orV|eddCT)$/.test(el.id||"")&&!/decimal|numeric|tel|email|url/.test(el.inputMode||"");
  const pos=()=>{if(!btn||!alvo)return;const r=alvo.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight){btn.style.display="none";return;}btn.style.display="grid";
    btn.style.top=(alvo.tagName==="TEXTAREA"?r.bottom-38:r.top+(r.height-32)/2)+"px";btn.style.left=(r.right-38)+"px";};
  const parar=()=>{if(rec){try{rec.stop();}catch(e){}rec=null;}if(btn)btn.classList.remove("on");};
  const some=()=>{parar();if(btn)btn.style.display="none";if(alvo)alvo.classList.remove("commic");alvo=null;};
  document.addEventListener("focusin",e=>{const el=e.target;if(!serve(el))return;alvo=el;alvo.classList.add("commic");
    if(!btn){btn=document.createElement("button");btn.type="button";btn.className="fmic";btn.setAttribute("aria-label","Ditar texto");btn.innerHTML=ic("mic");document.body.appendChild(btn);
      btn.addEventListener("pointerdown",ev=>ev.preventDefault());
      btn.addEventListener("click",()=>{if(!alvo)return;if(rec){parar();return;}rec=new SR();rec.lang="pt-BR";rec.interimResults=false;rec.continuous=false;btn.classList.add("on");
        rec.onresult=ev=>{const t=Array.from(ev.results).map(r=>r[0].transcript).join(" ").trim();if(!t||!alvo)return;const a=alvo,i=a.selectionStart??a.value.length,j=a.selectionEnd??a.value.length;
          const antes=a.value.slice(0,i),sep=antes&&!/\s$/.test(antes)?" ":"";const ins=sep+(antes.trim()?t:t.charAt(0).toUpperCase()+t.slice(1));a.value=antes+ins+a.value.slice(j);const c=(antes+ins).length;try{a.setSelectionRange(c,c);}catch(x){}
          a.dispatchEvent(new Event("input",{bubbles:true}));};
        rec.onend=()=>{rec=null;btn.classList.remove("on");};rec.onerror=()=>{rec=null;btn.classList.remove("on");};try{rec.start();}catch(x){rec=null;btn.classList.remove("on");}});}
    pos();});
  document.addEventListener("focusout",e=>{if(e.target===alvo)setTimeout(()=>{if(document.activeElement!==alvo)some();},150);});
  window.addEventListener("scroll",pos,{passive:true,capture:true});window.addEventListener("resize",pos);})();

/* dica do deslizar: aparece até você usar 3 vezes */
const _secTodo47=secTodo;secTodo=function(){let h=_secTodo47();if(lsGet("mu_sw_n",0)>=3||!/data-sw=/.test(h))return h;
  const dica=`<div class="todo-dica">${ic("arrow-right-left")} Deslize a tarefa: para a direita conclui, para a esquerda passa para amanhã</div>`;
  return /<button class="todo-fe"/.test(h)?h.replace(/<button class="todo-fe"/,dica+'<button class="todo-fe"'):h.replace(/<\/div>\s*$/,dica+"</div>");};
