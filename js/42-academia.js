"use strict";
/* ======================================================================
   ACADEMIA 6x · rotina, agenda com aviso, resgate depois de uma falta e treino mínimo
   · Rotina: dias da semana, horário (aprendido dos seus treinos ou escolhido), aviso antes e meta semanal.
   · Agenda: cada dia de treino aparece como compromisso, com a letra do treino prevista (A, B, C…).
     Dá para mudar o horário só daquele dia ou marcar descanso.
   · Avisos (também com o app fechado, pela fila de push): antes do treino, "ainda dá tempo" à noite
     e o resgate na manhã seguinte a uma falta. Ao registrar o treino, os avisos daquele dia somem.
   · Resgate: no dia seguinte a uma falta, o Início abre com o cartão "Ontem não rolou" e o treino mínimo pronto.
   · Treino mínimo: os 3 primeiros exercícios do treino do dia, em 2 séries (~20 min). Vale como treino.
   Dados: c:"acad" (single) {dias:[0..6], hora, horas:{dow:hora}, antes, meta, resg, exc:{data:{h|off}}}
   ====================================================================== */
Object.assign(ICONS,{"calendar-check": "<path d=\"M8 2v4\" /> <path d=\"M16 2v4\" /> <rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" /> <path d=\"M3 10h18\" /> <path d=\"m9 16 2 2 4-4\" />", "calendar-plus": "<path d=\"M8 2v4\" /> <path d=\"M16 2v4\" /> <path d=\"M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8\" /> <path d=\"M3 10h18\" /> <path d=\"M16 19h6\" /> <path d=\"M19 16v6\" />"});
const ACAD_DEF={dias:[1,2,3,4,5,6],hora:"",horas:{},antes:30,meta:5,resg:"07:30",exc:{},on:false};
const DOW=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],DOWL=["domingo","segunda","terça","quarta","quinta","sexta","sábado"];
const acad=()=>single("acad",ACAD_DEF);
const acadOn=()=>!!acad().on;
const acadExc=d=>(acad().exc||{})[d]||null;
const acadPlan=d=>{const A=acad();if(!A.on)return false;const e=acadExc(d);if(e&&e.off)return false;if(e&&e.extra)return true;return (A.dias||[]).includes(pd(d).getDay());};
const acadHora=d=>{const A=acad(),e=acadExc(d);return(e&&e.h)||(A.horas||{})[pd(d).getDay()]||A.hora||horaTreino();};
const gymFeito=d=>trkHas("gym",d);
/* treinos previstos: letra de cada próximo dia de treino */
/* próximo treino da rotação: considera treinos completos (planilha) e treinos registrados com a letra, inclusive o mínimo */
function proximoTreino(T){let best=null,bd="";T.forEach(t=>{const l=trLast(t);if(l>bd){bd=l;best=t;}});
  all("trk").filter(x=>x.k==="gym").forEach(x=>{const m=String(x.t||"").match(/Treino ([A-Z]{1,3})\b/);if(!m)return;const t=T.find(z=>z.letra===m[1]);if(t&&x.d>=bd){bd=x.d;best=t;}});
  if(!best)return T[0];return T[(T.indexOf(best)+1)%T.length];}
function acadPrevistos(n){const T=all("tr").sort((a,b)=>(a.o||0)-(b.o||0)).filter(t=>(t.ex||[]).length);const out={};if(!T.length)return out;
  let i=T.indexOf(proximoTreino(T));if(i<0)i=0;let d=TODAY();if(gymFeito(d))d=addDays(d,1);
  for(let k=0;k<n;k++){if(acadPlan(d)&&!gymFeito(d)){out[d]=T[i%T.length];i++;}d=addDays(d,1);}return out;}
function acadSemana(d){d=d||TODAY();const ini=semanaKey(d),A=acad();const dias=[...Array(7)].map((_,i)=>addDays(ini,i));const feitos=dias.filter(gymFeito).length;
  const restam=dias.filter(x=>x>=TODAY()&&acadPlan(x)&&!gymFeito(x)).length;return{ini,dias,feitos,meta:+A.meta||5,restam};}
function acadSemanasSeguidas(){const A=acad(),meta=+A.meta||5;let n=0,w=semanaKey(TODAY());const cur=acadSemana().feitos>=meta;if(cur)n++;w=addDays(w,-7);
  for(let k=0;k<104;k++){const f=[...Array(7)].map((_,i)=>addDays(w,i)).filter(gymFeito).length;if(f>=meta)n++;else break;w=addDays(w,-7);}return n;}
/* resgate: ontem era dia de treino e não houve treino */
function acadResgate(){if(!acadOn())return null;const t=TODAY(),ont=addDays(t,-1);if(gymFeito(t))return null;
  if(!acadPlan(ont)||gymFeito(ont))return null;const antes=addDays(t,-2);const duas=acadPlan(antes)&&!gymFeito(antes);
  const S=acadSemana(),falta=Math.max(0,S.meta-S.feitos),hojePlan=acadPlan(t);const restamCont=S.restam+(hojePlan?0:1);
  let sem;if(!falta)sem=`A meta da semana já está garantida (${S.feitos}/${S.meta}). Treinar hoje é bônus.`;
  else if(falta<=restamCont)sem=`Semana: ${S.feitos} de ${S.meta}. Faltam ${falta} e ainda dá: restam ${restamCont} ${restamCont===1?"dia":"dias"}.`;
  else sem=`Esta semana a meta ficou difícil (faltam ${falta}). O objetivo agora é só um: não faltar de novo.`;
  return{duas,titulo:duas?"Dois dias sem academia.":"Ontem não rolou.",frase:duas?"Hoje não é sobre o treino perfeito. É sobre não deixar a falta virar hábito.":"Hoje é o dia que segura a sequência.",sem};}

/* ---------- treino mínimo ---------- */
function treinoMinimo(tr){return (tr.ex||[]).slice(0,3).map(e=>({id:e.id,n:e.n,series:Math.min(2,+e.series||2),reps:e.reps||"10-12",carga:e.carga||""}));}
let MIN=null;
ACT.acadMin=el=>{const T=all("tr").sort((a,b)=>(a.o||0)-(b.o||0)).filter(t=>(t.ex||[]).length);if(!T.length)return toast("dumbbell","Monte seus treinos A, B e C primeiro","Academia → Planilha de treinos");
  const tr=getD(el&&el.dataset&&el.dataset.tr)||proximoTreino(T);MIN={tr:tr.id,ok:new Set()};minRender();};
function minRender(){const tr=getD(MIN.tr),L=treinoMinimo(tr),feito=gymFeito(TODAY());
  sheet(`<h2>${ic("timer")} Treino mínimo · ${esc(tr.letra)}</h2><p class="muted small" style="margin:4px 0 0">Cerca de 20 minutos. Os 3 exercícios principais do Treino ${esc(tr.letra)}${tr.nome?" ("+esc(tr.nome)+")":""}, em 2 séries. <b>Vale como treino</b> e segura a sequência.</p>
   <div style="margin-top:12px">${L.map((e,i)=>`<button class="mit minx ${MIN.ok.has(e.id)?"ok":""}" data-a="minCk" data-e="${e.id}"><span class="ck ${MIN.ok.has(e.id)?"on":""}">${ic("check")}</span><span class="grow"><b>${i+1}. ${esc(e.n)}</b><span class="tiny muted" style="display:block">${e.series} séries × ${esc(String(e.reps))}${e.carga?" · "+esc(String(e.carga))+(/[a-z]/i.test(e.carga)?"":" kg"):""} · descanso de 60 s</span></span></button>`).join("")}</div>
   ${L.length<3?`<div class="note">O Treino ${esc(tr.letra)} tem ${L.length} exercício(s). Dá para completar com mais na planilha.</div>`:""}
   <div class="tiny faint" style="margin-top:8px">Aquecimento rápido: 3 minutos de mobilidade e uma série leve do primeiro exercício.</div>
   <div class="btns"><button class="btn full" data-a="minFim" ${MIN.ok.size>=L.length&&L.length?"":"disabled"}>${ic("medal")} ${feito?"Treino de hoje já registrado":"Concluir o treino mínimo"}</button><button class="btn ghost full" data-a="go" data-v="${gv({v:"trk",k:"gym",sub:"tr",trId:tr.id})}">Prefiro o treino completo</button></div>`);}
ACT.minCk=el=>{const id=el.dataset.e;if(MIN.ok.has(id))MIN.ok.delete(id);else MIN.ok.add(id);minRender();};
ACT.minFim=()=>{const tr=getD(MIN.tr),t=TODAY();if(!gymFeito(t))save({id:tid("gym",t),c:"trk",k:"gym",d:t,t:"Treino "+tr.letra+" · mínimo",s:tr.nome||"",min:true});MIN=null;closeSheet();rr();
  const S=acadSemana();toast("medal","Sequência salva!",`Treino mínimo conta. Semana: ${S.feitos}/${S.meta}`);};

/* ---------- configurar a rotina ---------- */
ACT.acadCfg=()=>{const A=acad(),ap=horaTreino();
  sheet(`<h2>${ic("dumbbell")} Minha rotina de academia</h2><p class="muted small" style="margin:4px 0 0">Os dias de treino entram na agenda, com aviso antes. Se faltar, o app te resgata no dia seguinte.</p>
   <div class="fld"><span>Dias de treino</span><div class="dowsel">${[1,2,3,4,5,6,0].map(d=>`<button type="button" data-a="acadDia" data-d="${d}" aria-pressed="${(A.dias||[]).includes(d)}">${DOW[d]}</button>`).join("")}</div></div>
   <div class="two"><label class="fld"><span>Horário</span><input id="acH" type="time" value="${esc(A.hora||ap)}"></label><label class="fld"><span>Avisar antes</span><select id="acAn">${[15,30,45,60,90].map(m=>`<option value="${m}" ${+A.antes===m?"selected":""}>${m} min</option>`).join("")}</select></label></div>
   ${A.hora&&ap!==A.hora&&all("trk").filter(x=>x.k==="gym").length>=3?`<div class="tiny" style="color:var(--oktx);font-weight:700;margin-top:-4px">Pelos seus registros, você costuma treinar por volta das ${ap}.</div>`:""}
   <details style="margin-top:10px"><summary class="small muted">Horário diferente em algum dia</summary>${[1,2,3,4,5,6,0].filter(d=>(A.dias||[]).includes(d)).map(d=>`<label class="fld"><span>${DOWL[d]}</span><input type="time" data-hd="${d}" value="${esc((A.horas||{})[d]||"")}"></label>`).join("")}</details>
   <div class="fld"><span>Meta por semana</span><div class="seg" data-k="acM">${[3,4,5,6].map(m=>`<button type="button" data-a="seg" data-v="${m}" aria-pressed="${(+A.meta||5)===m}">${m}x</button>`).join("")}</div></div>
   <label class="fld"><span>Resgate no dia seguinte a uma falta, às</span><input id="acR" type="time" value="${esc(A.resg||"07:30")}"></label>
   <div class="btns"><button class="btn full" id="acOk">${ic("check")} ${A.on?"Salvar":"Ativar rotina"}</button>${A.on?`<button class="btn ghost full" id="acOff">Pausar rotina</button>`:""}</div>`,s=>{
   s.querySelector("#acOk").onclick=()=>{const B=acad();B.dias=[...s.querySelectorAll(".dowsel [aria-pressed=true]")].map(b=>+b.dataset.d);if(!B.dias.length)return toast("triangle-alert","Escolha pelo menos um dia","");
     B.hora=s.querySelector("#acH").value||ap;B.antes=+s.querySelector("#acAn").value||30;B.meta=+segVal(s,"acM")||5;B.resg=s.querySelector("#acR").value||"07:30";B.horas={};s.querySelectorAll("[data-hd]").forEach(i=>{if(i.value)B.horas[i.dataset.hd]=i.value;});B.on=true;save(B);closeSheet();rr();if(typeof pushAgendar==="function")pushAgendar();
     toast("calendar-check","Rotina ativa",`${B.dias.length} dias por semana às ${B.hora}. Meta: ${B.meta}x.`);};
   const off=s.querySelector("#acOff");if(off)off.onclick=()=>{const B=acad();B.on=false;save(B);closeSheet();rr();if(typeof pushAgendar==="function")pushAgendar();toast("pause","Rotina pausada","Os avisos de academia foram desligados.");};});};
ACT.acadDia=el=>{const on=el.getAttribute("aria-pressed")==="true";el.setAttribute("aria-pressed",String(!on));};

/* ---------- 1. AGENDA: dias de treino como compromissos ---------- */
const _dayItemsAc=dayItems;
dayItems=function(d){const r=_dayItemsAc.apply(this,arguments);if(!acadOn()||d<TODAY()||gymFeito(d)||!acadPlan(d))return r;
  if(VIEW.v==="cal"&&d!==(VIEW.sel||TODAY()))return r; /* na grade do mês, o treino vira só um traço laranja, para não pintar o mês inteiro */
  const P=acadPrevistos(40),tr=P[d];const h=acadHora(d);
  r.ev=r.ev.concat({id:"vg_"+d,c:"vg",d,h,t:"Academia"+(tr?" · Treino "+tr.letra+(tr.nome?" ("+tr.nome+")":""):""),cat:"treino",nota:`Aviso ${acad().antes} min antes.`}).sort((a,b)=>(a.h||"").localeCompare(b.h||""));return r;};
const _evEditAc=ACT.evEdit;ACT.evEdit=el=>{const id=el.dataset.id||"";if(!id.startsWith("vg_"))return _evEditAc(el);acadDiaSheet(id.slice(3));};
function acadDiaSheet(d){const P=acadPrevistos(40),tr=P[d],h=acadHora(d),hoje=d===TODAY();
  sheet(`<h2>${ic("dumbbell")} Academia · ${esc(flong(d))}</h2><div class="card" style="margin-top:8px"><b>${tr?`Treino ${esc(tr.letra)}${tr.nome?" · "+esc(tr.nome):""}`:"Treino do dia"}</b><div class="small muted" style="margin-top:4px">${ic("clock")} ${h} · aviso ${acad().antes} min antes</div>${tr?`<div class="tiny muted" style="margin-top:6px">${tr.ex.map(e=>esc(e.n)).join(" · ")}</div>`:""}</div>
   <div class="btns">${hoje?`<button class="btn full" data-a="go" data-v="${gv({v:"trk",k:"gym",sub:"tr",trId:tr?tr.id:""})}">${ic("play")} Começar o treino</button><button class="btn ghost full" data-a="acadMin" data-tr="${tr?tr.id:""}">${ic("timer")} Hoje só o mínimo (20 min)</button>`:""}
   <button class="btn ghost full" data-a="acadHoraDia" data-d="${d}">${ic("clock")} Mudar o horário só deste dia</button><button class="btn ghost full" data-a="acadFolga" data-d="${d}">${ic("moon")} ${hoje?"Hoje vou descansar":"Marcar descanso neste dia"}</button><button class="btn ghost full" data-a="acadCfg">${ic("settings")} Ajustar a rotina</button></div>`);}
ACT.acadHoraDia=el=>{const d=el.dataset.d;textEditOne("Horário de "+flong(d),"Novo horário (ex.: 19:30)",acadHora(d),v=>{const m=v.match(/^(\d{1,2})[:h]?(\d{2})?$/);if(!m)return toast("triangle-alert","Use o formato 19:30","");
  const A=acad();A.exc=A.exc||{};A.exc[d]=Object.assign({},A.exc[d],{h:pad(+m[1])+":"+pad(+(m[2]||0)),off:false});save(A);rr();if(typeof pushAgendar==="function")pushAgendar();toast("clock","Horário ajustado",flong(d)+" às "+A.exc[d].h);},acadHora(d));};
ACT.acadFolga=el=>{const d=el.dataset.d,A=acad();A.exc=A.exc||{};A.exc[d]={off:true};save(A);closeSheet();rr();if(typeof pushAgendar==="function")pushAgendar();
  const S=acadSemana(d);toast("moon","Descanso marcado",S.feitos+S.restam>=S.meta?"A meta da semana continua possível.":"Atenção: sem esse dia, a meta da semana fica apertada.");};
/* os cartões de treino do módulo de conexões dão lugar à rotina, quando ela está ativa */
if(typeof treinoHoje==="function"){const _thAc=treinoHoje;treinoHoje=function(){const L=_thAc.apply(this,arguments);return acadOn()?L.filter(x=>x.ic!=="dumbbell"):L;};}

/* ---------- 2. AVISOS (também com o app fechado) ---------- */
function acadAvisos(){const F=[];if(!acadOn())return F;const now=Date.now(),A=acad(),P=acadPrevistos(14);
  for(let k=-1;k<9;k++){const d=addDays(TODAY(),k);if(!acadPlan(d)||gymFeito(d))continue;const h=acadHora(d),tr=P[d];const nome=tr?`Treino ${tr.letra}${tr.nome?" · "+tr.nome:""}`:"Treino do dia";
    const pre=pushEm(d,h)-(+A.antes||30)*60000;if(k>=0&&pre>now)F.push({k:"acad_pre_"+d,at:pre,t:`Academia em ${A.antes} min`,b:`${nome}. Bolsa pronta? Às ${h}.`});
    const late=Math.min(pushEm(d,h)+150*60000,pushEm(d,"21:30"));if(k>=0&&late>now&&late>pushEm(d,h))F.push({k:"acad_late_"+d,at:late,t:"Ainda dá tempo de treinar",b:"Treino mínimo de 20 minutos: 3 exercícios, 2 séries. Vale como treino."});
    const amanha=addDays(d,1);const res=pushEm(amanha,A.resg||"07:30");if(res>now&&!gymFeito(amanha)){const ant=addDays(d,-1),duas=acadPlan(ant)&&!gymFeito(ant)&&k<=0;
      F.push({k:"acad_res_"+d,at:res,t:duas?"Dois dias sem academia":"Ontem não rolou",b:duas?"Hoje não é sobre o treino perfeito. É sobre não deixar a falta virar hábito. O mínimo de 20 min está pronto.":"Hoje é o dia que segura a sequência. O treino mínimo de 20 minutos já está pronto."});}}
  return F;}
if(typeof pushFila==="function"){const _pfAc=pushFila;pushFila=function(){const F=_pfAc.apply(this,arguments);try{acadAvisos().forEach(x=>F.push({k:x.k,at:Math.round(x.at),t:String(x.t).slice(0,120),b:String(x.b).slice(0,240),rep:""}));}catch(e){console.warn(e);}return F;};}
/* com o app aberto: avisa na hora certa */
setInterval(()=>{try{if(!DB.be||!acadOn())return;const now=Date.now();acadAvisos().forEach(x=>{if(x.at<=now&&x.at>now-90000){const key="mu_acn_"+x.k;if(localStorage.getItem(key))return;localStorage.setItem(key,"1");notify(x.t,x.b);}});}catch(e){}},45000);
/* registrar treino atualiza a fila de avisos na hora */
const _saveAc=save;save=function(doc){const r=_saveAc.apply(this,arguments);if(doc&&doc.c==="trk"&&doc.k==="gym"&&typeof pushAgendar==="function")pushAgendar();return r;};

/* ---------- 3. INÍCIO: resgate, treino de hoje ou semana fechada ---------- */
function secAcad(){if(!acadOn()){const n=all("trk").filter(x=>x.k==="gym").length;return n>=2&&!localStorage.getItem("mu_acad_conv")?`<button class="card acadconv" data-a="acadCfg">${ic("calendar-check")}<span class="grow"><b>Treinar 5 ou 6 vezes por semana?</b><span class="tiny muted" style="display:block">Ative a rotina: a academia entra na agenda, com aviso, e o app te resgata se faltar.</span></span>${ic("chevron-right")}</button>`:"";}
  const t=TODAY(),S=acadSemana(),seq=acadSemanasSeguidas(),R=acadResgate(),P=acadPrevistos(10),TT=all("tr").filter(x=>(x.ex||[]).length).sort((a,b)=>(a.o||0)-(b.o||0)),tr=P[t]||(TT.length?proximoTreino(TT):null);
  const ring=`<div class="wkring">${S.dias.map(d=>`<i class="${gymFeito(d)?"ok":acadPlan(d)?(d<t?"miss":"plan"):""} ${d===t?"hj":""}" title="${DOW[pd(d).getDay()]}"><span>${DOW[pd(d).getDay()][0]}</span></i>`).join("")}<b>${S.feitos}/${S.meta}</b></div>`;
  const seqTxt=seq?`${ic("flame")} ${seq} ${seq===1?"semana de atleta":"semanas de atleta seguidas"}`:"";
  if(R)return `<div class="acadres ${R.duas?"duas":""}"><div class="row"><span class="mb">${ic("rotate-ccw")}</span><div class="grow"><b>${R.titulo}</b><span>${R.frase}</span></div></div>
    <div class="small" style="margin:10px 0 8px">${esc(R.sem)}</div>${ring}
    <div class="btns h" style="margin-top:12px"><button class="btn" data-a="acadMin" data-tr="${tr?tr.id:""}">${ic("timer")} Treino mínimo · 20 min</button>${tr?`<button class="btn ghost" data-a="go" data-v="${gv({v:"trk",k:"gym",sub:"tr",trId:tr.id})}">Treino ${esc(tr.letra)} completo</button>`:""}</div>${seqTxt?`<div class="tiny" style="margin-top:10px;opacity:.85">${seqTxt} · não deixe a falta virar duas.</div>`:""}</div>`;
  if(gymFeito(t))return `<div class="card acadok" ${mstyle("gym")}><div class="row"><span class="mb">${ic("medal")}</span><div class="grow"><b>Treino de hoje feito</b><span class="tiny muted" style="display:block">${S.feitos>=S.meta?"Meta da semana batida! Daqui em diante é bônus.":`Faltam ${S.meta-S.feitos} na semana.`}</span></div></div>${ring}${seqTxt?`<div class="tiny muted" style="margin-top:6px">${seqTxt}</div>`:""}</div>`;
  if(acadPlan(t)){const h=acadHora(t),agora=new Date(),passou=dtOf(t,h)<agora;
    return `<div class="card acadhj" ${mstyle("gym")}><div class="row"><span class="mb">${ic("dumbbell")}</span><div class="grow"><b>Academia ${passou?"hoje":"às "+h}${tr?` · Treino ${esc(tr.letra)}`:""}</b><span class="tiny muted" style="display:block">${tr&&tr.nome?esc(tr.nome)+" · ":""}${passou?"O horário passou, mas ainda dá tempo.":"Aviso "+acad().antes+" min antes."}</span></div><button class="ib" data-a="acadDiaHoje" aria-label="Opções">${ic("ellipsis-vertical")}</button></div>${ring}
      <div class="btns h" style="margin-top:10px">${tr?`<button class="btn" data-a="go" data-v="${gv({v:"trk",k:"gym",sub:"tr",trId:tr.id})}">${ic("play")} Começar</button>`:""}<button class="btn ghost" data-a="acadMin" data-tr="${tr?tr.id:""}">${ic("timer")} Só o mínimo</button></div>${seqTxt?`<div class="tiny muted" style="margin-top:8px">${seqTxt}</div>`:""}</div>`;}
  return `<div class="card acadok" ${mstyle("gym")}><div class="row"><span class="mb">${ic("moon")}</span><div class="grow"><b>Hoje é descanso da academia</b><span class="tiny muted" style="display:block">${S.feitos}/${S.meta} na semana${S.restam?" · próximos treinos já na agenda":""}.</span></div><button class="ib" data-a="acadCfg" aria-label="Rotina">${ic("settings")}</button></div>${ring}</div>`;}
ACT.acadDiaHoje=()=>acadDiaSheet(TODAY());
const _homeAc=VIEWS.home;VIEWS.home=function(){const h=_homeAc.apply(this,arguments);const card=secAcad();if(!card)return h;const i=h.indexOf('<div class="copi"');if(i<0)return h;const j=h.indexOf("</div>",i);return h.slice(0,j+6)+`<div style="margin-top:10px">${card}</div>`+h.slice(j+6);};
/* na Academia: atalho para a rotina */
const _trkAc=VIEWS.trk;VIEWS.trk=function(){const h=_trkAc.apply(this,arguments);if(VIEW.k!=="gym")return h;const S=acadSemana();
  const bar=`<button class="card acadbar" data-a="acadCfg">${ic(acadOn()?"calendar-check":"calendar-plus")}<span class="grow"><b>${acadOn()?`Rotina: ${acad().dias.length}x por semana · ${acad().hora||horaTreino()}`:"Ativar rotina de treinos"}</b><span class="tiny muted" style="display:block">${acadOn()?`Semana ${S.feitos}/${S.meta} · ${acadSemanasSeguidas()} semanas de atleta seguidas`:"Agenda, aviso antes do treino e resgate se faltar"}</span></span>${ic("chevron-right")}</button>`;
  const i=h.indexOf('<div class="tabs">');return i<0?h:h.slice(0,i)+bar+h.slice(i);};
const _calAc=VIEWS.cal;VIEWS.cal=function(){const h=_calAc.apply(this,arguments);if(!acadOn())return h;const t=TODAY();
  return h.replace(/data-a="calSel" data-d="(\d{4}-\d{2}-\d{2})"/g,(m,d)=>d>=t&&acadPlan(d)&&!gymFeito(d)?m+' data-acad="1"':m);};
