"use strict";
/* ======================================================================
   TAREFAS DO DIA · to-do list no Início e a tela de Produtividade
   Cada tarefa concluída também entra em "O que eu fiz hoje" (c:"fiz", id "fiz_todo_<id>").
   Dados: c:"todo" {t, d=dia planejado, dias=[todos os dias em que esteve planejada],
                    ok, feito=dia em que foi concluída, okAt, o=ordem}
   ====================================================================== */
MODS.todo={n:"Tarefas do dia",ic:"list-checks",c1:"#0F766E",c2:"#22C55E",g:3,v:{v:"todo"}};
(()=>{const g=MOD_GROUPS.find(x=>x[0]==="Rotina e espiritualidade");if(g&&!g[1].includes("todo"))g[1].unshift("todo");})();
try{JAR_TIPOS.tarefas="todo";JAR_DESC.tarefas="tarefas do dia (t, d=dia planejado, ok=concluída, feito=dia em que concluiu)";}catch(e){}

const todoDias=x=>x.dias&&x.dias.length?x.dias:[x.d];
const todosDoDia=d=>all("todo").filter(x=>x.d===d).sort((a,b)=>(!!a.ok-!!b.ok)||(a.ok?(a.okAt||0)-(b.okAt||0):(!!b.imp-!!a.imp)||(a.o||0)-(b.o||0)));
/* O que não foi concluído passa sozinho para o dia seguinte, até ser feito.
   Cada dia em que a tarefa ficou pendente entra em "dias" (conta na produtividade daquele dia). */
function todoRolar(){if(!DB.be)return 0;const t=TODAY();let o=Math.max(0,...all("todo").filter(x=>x.d===t).map(x=>x.o||0)),n=0;
  all("todo").filter(x=>!x.ok&&x.d<t).sort((a,b)=>a.d.localeCompare(b.d)||(a.o||0)-(b.o||0)).forEach(x=>{
    const D=todoDias(x).slice();for(let d=addDays(x.d,1);d<=t;d=addDays(d,1))if(!D.includes(d))D.push(d);
    x.de=x.de||x.d;x.dias=D;x.d=t;x.o=++o;save(x);n++;});
  return n;}
const todoIdade=x=>{const de=x.de||todoDias(x)[0];if(!de||de>=TODAY())return 0;return Math.round((pd(TODAY())-pd(de))/864e5);};
const todoAtrasadas=()=>{const t=TODAY();return all("todo").filter(x=>!x.ok&&x.d<t).sort((a,b)=>a.d.localeCompare(b.d));};
/* produtividade de um dia: tudo o que esteve planejado para ele (ou foi concluído nele) */
const fizSolo=d=>all("fiz").filter(f=>f.d===d&&!f.todo).sort((a,b)=>(a.u||0)-(b.u||0));
function todoStats(d){const L=all("todo").filter(x=>todoDias(x).includes(d)||x.feito===d);const fs=fizSolo(d).length;
  const fe=L.filter(x=>x.ok&&x.feito===d).length+fs,tot=L.length+fs;
  return{tot,fe,pct:tot?Math.round(fe/tot*100):0,ativ:all("fiz").filter(f=>f.d===d).length};}
function todoSeq(){let n=0,d=TODAY();if(!todoStats(d).fe)d=addDays(d,-1);while(todoStats(d).fe&&n<400){n++;d=addDays(d,-1);}return n;}
const todoPctTxt=s=>s.tot?`${s.fe}/${s.tot} · ${s.pct}%`:"sem tarefas";

/* ---------- cartão do Início: um campo, as pendentes e as feitas recolhidas ---------- */
let TODO_VER=false;
function secTodo(){todoRolarUmaVez();const t=TODAY(),L=todosDoDia(t),pend=L.filter(x=>!x.ok),feitas=L.filter(x=>x.ok),solo=fizSolo(t),S=todoStats(t),atr=todoAtrasadas();
  const nf=feitas.length+solo.length;
  return `<div class="sec"><h2>${ic("list-checks")} Tarefas de hoje</h2><button class="lk" data-a="go" data-v="${gv({v:"todo"})}">Produtividade</button></div>
  <div class="card todo" ${mstyle("todo")}>
    <div class="todo-in"><input id="todoI" placeholder="Anotar tarefa…" data-enter="todoAdd" aria-label="Nova tarefa" enterkeyhint="done">
      <button class="btn ghost todo-jf" data-a="todoJaFiz" aria-label="Anotar como já feita">${ic("check")} Já fiz</button><button class="btn" data-a="todoAdd" aria-label="Anotar como a fazer">${ic("plus")}</button></div>
    ${S.tot?`<div class="todo-pg"><span class="small" style="font-weight:800">${S.fe} de ${S.tot} feitas</span><span class="bar"><i style="width:${S.pct}%"></i></span><b class="todo-p">${S.pct}%</b></div>`:""}
    ${pend.length?`<div class="todo-l">${pend.map(x=>{const id=todoIdade(x);return `<div class="mit todo-it${x.imp?" todo-imp":""}"><button class="ck" data-a="todoOk" data-id="${x.id}" aria-label="Concluir: ${esc(x.t)}">${ic("check")}</button><button class="grow todo-tx" data-a="todoEd" data-id="${x.id}">${esc(x.t)}${id?`<span class="todo-id">${ic("rotate-ccw")} ${id===1?"desde ontem":`há ${id} dias`}</span>`:""}</button><button class="todo-st${x.imp?" on":""}" data-a="todoImp" data-id="${x.id}" aria-pressed="${!!x.imp}" aria-label="${x.imp?"Tirar de importante":"Marcar como importante"}">${ic("star")}</button></div>`;}).join("")}</div>`:""}
    ${nf?`<button class="todo-fe" data-a="todoVer" aria-expanded="${TODO_VER}">${ic("circle-check")}<span class="grow">${nf===1?"1 feita hoje":`${nf} feitas hoje`}</span>${ic(TODO_VER?"chevron-up":"chevron-down")}</button>
      ${TODO_VER?`<div class="todo-l">${feitas.map(x=>`<div class="mit todo-it"><button class="ck on" data-a="todoOk" data-id="${x.id}" aria-label="Desmarcar: ${esc(x.t)}">${ic("check")}</button><button class="grow todo-tx strike" data-a="todoEd" data-id="${x.id}">${esc(x.t)}</button></div>`).join("")}${solo.map(f=>`<div class="mit todo-it"><span class="ck on">${ic("check")}</span><button class="grow todo-tx strike" data-a="todoFizEd" data-id="${f.id}">${esc(f.t)}</button></div>`).join("")}</div>`:""}`:""}
  </div>`;}
ACT.todoVer=()=>{TODO_VER=!TODO_VER;rr();};
ACT.todoImp=el=>{const x=getD(el.dataset.id);if(!x)return;x.imp=!x.imp;save(x);rr();};
/* roda uma vez por dia (ao abrir o app e na virada da meia-noite) */
let TODO_ROLOU="";
function todoRolarUmaVez(){const t=TODAY();if(TODO_ROLOU===t||!DB.be)return;TODO_ROLOU=t;setTimeout(()=>{if(todoRolar())rr();},0);}
ACT.todoAdd=()=>{const i=$("todoI");if(!i)return;const v=i.value.trim();if(!v)return i.focus();const t=TODAY();
  const o=Math.max(0,...all("todo").filter(x=>x.d===t).map(x=>x.o||0))+1;
  save({id:"todo_"+nid(),c:"todo",t:v,d:t,dias:[t],ok:false,o});rr();const n=$("todoI");if(n)n.focus();};
function todoMarca(x,ok){const fid="fiz_todo_"+x.id;
  if(ok){x.ok=true;x.feito=TODAY();x.okAt=Date.now();save(x);save({id:fid,c:"fiz",t:x.t,d:x.feito,auto:1,todo:x.id});}
  else{x.ok=false;delete x.feito;delete x.okAt;save(x);if(getD(fid))removeDoc(fid);}}
ACT.todoJaFiz=()=>{const i=$("todoI");if(!i)return;const v=i.value.trim();if(!v)return i.focus();const t=TODAY();
  const x=save({id:"todo_"+nid(),c:"todo",t:v,d:t,dias:[t],ok:false,o:0});todoMarca(x,true);rr();toast("circle-check","Anotado como feito",v);const n=$("todoI");if(n)n.focus();};
ACT.todoFizEd=el=>{const f=getD(el.dataset.id);if(!f)return;confirmSheet("Apagar este registro?",f.t,"Apagar",()=>{removeDoc(f.id);rr();});};
ACT.todoOk=el=>{const x=getD(el.dataset.id);if(!x)return;const ok=!x.ok;todoMarca(x,ok);rr();
  if(ok){try{navigator.vibrate&&navigator.vibrate(30);}catch(e){}const S=todoStats(TODAY());if(S.tot&&S.fe===S.tot&&x.d===TODAY())toast("party-popper","Todas as tarefas de hoje concluídas!",S.tot+(S.tot===1?" tarefa":" tarefas"));}};
function todoApaga(id){if(getD("fiz_todo_"+id))removeDoc("fiz_todo_"+id);removeDoc(id);}
ACT.todoEd=el=>{const x=getD(el.dataset.id);if(!x)return;const t=TODAY(),am=addDays(t,1);
  const ops=[[t,"Hoje"],[am,"Amanhã"]];const outra=x.d!==t&&x.d!==am;
  sheet(`<h2>Editar tarefa</h2>
   <label class="fld"><span>Tarefa</span><input id="tdT" value="${esc(x.t)}" autofocus></label>
   ${x.ok?`<p class="small muted" style="margin:8px 0 0">${ic("circle-check")} Concluída em ${fdate(x.feito)}.</p>`:`<div class="fld"><span>Para quando</span><div class="seg" data-k="tdQ">${ops.map(([d,n])=>`<button type="button" data-a="seg" data-v="${d}" aria-pressed="${x.d===d}">${n}</button>`).join("")}<button type="button" data-a="seg" data-v="" aria-pressed="${outra}">Outra data</button></div></div>
   <label class="fld"><span>Data</span><input id="tdD" type="date" value="${x.d}"></label>`}
   ${x.ok?"":`<label class="todo-impl"><input type="checkbox" id="tdI" ${x.imp?"checked":""}> ${ic("star")} Importante (fica no topo)</label>`}
   <div class="btns"><button class="btn full" id="tdS">Salvar</button><button class="btn danger full" id="tdX">Apagar tarefa</button></div>`,s=>{
    const di=s.querySelector("#tdD");s.querySelectorAll('[data-k="tdQ"] button').forEach(b=>b.addEventListener("click",()=>{if(b.dataset.v&&di)di.value=b.dataset.v;}));
    s.querySelector("#tdS").onclick=()=>{const tx=s.querySelector("#tdT").value.trim();if(!tx)return toast("triangle-alert","Escreva a tarefa","");x.t=tx;const ci=s.querySelector("#tdI");if(ci)x.imp=ci.checked;
      if(di&&di.value&&di.value!==x.d){const nd=di.value;x.dias=todoDias(x).filter(z=>z<t).concat(nd);x.d=nd;}
      save(x);const f=getD("fiz_todo_"+x.id);if(f&&f.t!==x.t){f.t=x.t;save(f);}closeSheet();rr();};
    s.querySelector("#tdX").onclick=()=>{todoApaga(x.id);closeSheet();rr();};});};

/* ---------- tela de Produtividade ---------- */
VIEWS.todo=()=>{const t=TODAY(),S=todoStats(t);let h=topbar("Produtividade","todo");
  const sem=[];for(let i=6;i>=0;i--){const d=addDays(t,-i);sem.push([d,todoStats(d)]);}
  const comT=sem.filter(([,s])=>s.tot),media=comT.length?Math.round(sum(comT.map(([,s])=>s.pct))/comT.length):0,feitas7=sum(sem.map(([,s])=>s.fe)),seq=todoSeq();
  const mx=Math.max(1,...sem.map(([,s])=>Math.max(s.tot,s.fe)));
  h+=`<div class="card hero" ${mstyle("todo")}><div class="row"><span class="mb">${ic("list-checks")}</span><div class="grow"><b style="font:800 1.1rem var(--disp)">Hoje</b><span class="small muted" style="display:block">${S.tot?`${S.fe} de ${S.tot} tarefas concluídas`:"Nenhuma tarefa para hoje"}${S.ativ?` · ${S.ativ} ${S.ativ===1?"atividade registrada":"atividades registradas"}`:""}</span></div><b class="todo-p" style="font-size:1.6rem">${S.pct}%</b></div>
    <span class="bar" style="display:block"><i style="width:${S.pct}%"></i></span>
    <div class="stats"><div><b>${media}%</b><span>média em 7 dias</span></div><div><b>${feitas7}</b><span>concluídas em 7 dias</span></div><div><b>${seq}</b><span>${seq===1?"dia seguido":"dias seguidos"}</span></div></div></div>`;
  h+=`<div class="grp">Últimos 7 dias</div><div class="card todo-gr" ${mstyle("todo")} role="img" aria-label="Tarefas concluídas nos últimos 7 dias">${sem.map(([d,s])=>`<button class="todo-col" data-a="todoDia" data-d="${d}" aria-label="${esc(flong(d))}: ${todoPctTxt(s)}"><span class="todo-v">${s.fe||""}</span><span class="todo-cb"><i class="pl" style="height:${s.tot/mx*100}%"></i><i class="fe" style="height:${s.fe/mx*100}%"></i></span><span class="tiny ${d===t?"":"faint"}" style="font-weight:800">${d===t?"Hoje":DSEM[pd(d).getDay()]}</span></button>`).join("")}
    <div class="tiny faint todo-leg"><span><i style="background:var(--c1)"></i>concluídas</span><span><i style="background:var(--t3)"></i>planejadas</span></div></div>`;
  const vel=all("todo").filter(x=>!x.ok&&todoIdade(x)>=3).sort((a,b)=>todoIdade(b)-todoIdade(a));
  if(vel.length)h+=`<div class="grp">Pendentes há 3 dias ou mais<span class="chip">${vel.length}</span></div><div class="card" ${mstyle("todo")}><p class="small muted" style="margin:0 0 4px">Vale fazer hoje, dividir em partes menores ou apagar.</p>${vel.map(x=>`<div class="mit todo-it"><button class="ck" data-a="todoOk" data-id="${x.id}" aria-label="Concluir: ${esc(x.t)}">${ic("check")}</button><button class="grow todo-tx" data-a="todoEd" data-id="${x.id}">${esc(x.t)}<span class="todo-id">${ic("rotate-ccw")} há ${todoIdade(x)} dias</span></button></div>`).join("")}</div>`;
  const fut=all("todo").filter(x=>!x.ok&&x.d>t).sort((a,b)=>a.d.localeCompare(b.d));
  if(fut.length)h+=`<div class="grp">Próximos dias<span class="chip">${fut.length}</span></div><div class="card" ${mstyle("todo")}>${fut.map(x=>`<div class="mit todo-it"><span class="chip">${esc(fshort(x.d))}</span><button class="grow todo-tx" data-a="todoEd" data-id="${x.id}">${esc(x.t)}</button></div>`).join("")}</div>`;
  const hist=[];for(let i=1;i<=30;i++){const d=addDays(t,-i),s=todoStats(d);if(s.tot||s.ativ)hist.push([d,s]);}
  h+=`<div class="grp">Histórico</div>`+(hist.length?hist.map(([d,s])=>`<button class="item todo-h" style="width:100%" data-a="todoDia" data-d="${d}" ${mstyle("todo")}><span class="ibody"><b>${esc(flong(d))}</b><span class="tiny faint" style="display:block">${s.tot?`${s.fe} de ${s.tot} tarefas`:"sem tarefas"}${s.ativ?` · ${s.ativ} ${s.ativ===1?"atividade":"atividades"}`:""}</span>${s.tot?`<span class="bar" style="display:block;margin-top:6px"><i style="width:${s.pct}%"></i></span>`:""}</span><b class="todo-p">${s.tot?s.pct+"%":""}</b>${ic("chevron-right")}</button>`).join("")
    :`<div class="note" ${mstyle("todo")}>${ic("list-checks")} O histórico aparece aqui a partir de amanhã.</div>`);
  return `<div class="app">${h}</div>`;};

/* detalhe de um dia: tarefas e tudo o que foi registrado em "O que eu fiz" */
ACT.todoDia=el=>{const d=el.dataset.d,s=todoStats(d);
  const L=all("todo").filter(x=>todoDias(x).includes(d)||x.feito===d).sort((a,b)=>(!(a.ok&&a.feito===d))-!(b.ok&&b.feito===d));
  const fz=fizSolo(d);
  sheet(`<h2>${esc(flong(d))}</h2><p class="muted small" style="margin:4px 0 0">${s.tot?`${s.fe} de ${s.tot} tarefas concluídas · ${s.pct}%`:"Nenhuma tarefa planejada."}</p>
   ${L.length?`<div class="grp" style="margin-top:14px">Tarefas</div>${L.map(x=>{const ok=x.ok&&x.feito===d;return `<div class="mit" ${mstyle("todo")}><span class="ck ${ok?"on":""}">${ic("check")}</span><span class="grow ${ok?"strike":""}">${esc(x.t)}${!ok&&x.ok?`<span class="tiny faint" style="display:block">concluída em ${fdate(x.feito)}</span>`:!ok&&x.d!==d?`<span class="tiny faint" style="display:block">passou para ${fdate(x.d)}</span>`:""}</span></div>`;}).join("")}`:""}
   ${fz.length?`<div class="grp" style="margin-top:14px">Outras atividades</div><ul class="fzl" ${mstyle("fiz")}>${fz.map(f=>`<li>${ic("check")}<span class="grow">${esc(f.t)}</span></li>`).join("")}</ul>`:""}
   <div class="btns"><button class="btn ghost full" data-a="close">Fechar</button></div>`);};
