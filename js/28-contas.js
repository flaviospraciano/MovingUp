"use strict";
/* ======================================================================
   CONTAS A RECEBER · limpeza de lançamentos duplicados dos editais
   Desde que os editais geram as contas a receber sozinhos, os lançamentos feitos à mão antes
   para o mesmo dinheiro ficaram em dobro. Aqui:
   · duplicata certa (mesmo valor e nome do edital ou do item na descrição) → removida, fica a do edital;
     se a manual já estava paga, a do edital passa a paga também (e o edital registra o recebimento);
   · duplicata provável (só o valor bate) → aparece em Contas para você confirmar;
   · tudo o que é removido fica guardado por 30 dias para desfazer.
   ====================================================================== */
const CDUP_PARADAS=new Set("para pelo pela com sem que dos das nos nas uma por mais edital projeto premio prêmio cultura cultural pagamento parcela recebimento cache cachê valor".split(" ").map(normTxt));
const cdupPalavras=s=>normTxt(s).split(/[^a-z0-9]+/).filter(w=>w.length>=4&&!CDUP_PARADAS.has(w));
function contasDuplicadas(){const A=all("conta").filter(c=>c.tipo==="receber");const autos=A.filter(c=>c.auto&&c.ed),man=A.filter(c=>!c.auto);
  let ign=[];try{ign=JSON.parse(localStorage.getItem("mu_dup_ign")||"[]");}catch(e){}
  const certas=[],provaveis=[],usadas=new Set();
  autos.forEach(a=>{const e=getD(a.ed),p=e&&(e.pess||[]).find(x=>x.id===a.pid);const ganho=p&&typeof ganhoP==="function"?ganhoP(p):+a.valor||0;
    const chaves=[...new Set(cdupPalavras((e&&e.nome)||a.quem||"").concat(cdupPalavras(p&&p.n||"")))];
    man.forEach(m=>{if(usadas.has(m.id)||ign.includes(m.id+"|"+a.id))return;const v=+m.valor||0;
      const valorBate=[+a.valor||0,ganho].some(x=>x>0&&Math.abs(x-v)<0.01);if(!valorBate)return;
      const txt=normTxt([m.desc,m.quem,m.nota].join(" "));const nomeBate=chaves.some(w=>txt.includes(w));
      usadas.add(m.id);(nomeBate?certas:provaveis).push({a,m});});});
  return{certas,provaveis};}
function dupBackup(docs){let B=[];try{B=JSON.parse(localStorage.getItem("mu_dup_bkp")||"[]");}catch(e){}
  B=B.filter(x=>x.em>=addDays(TODAY(),-30));docs.forEach(d=>B.push({em:TODAY(),doc:JSON.parse(JSON.stringify(d))}));try{localStorage.setItem("mu_dup_bkp",JSON.stringify(B));}catch(e){}}
function dupResolver(par){const {a,m}=par;dupBackup([m]);
  if(m.status==="paga"&&a.status!=="paga"){a.status="paga";a.pagoEm=m.pagoEm||TODAY();save(a);} /* o edital registra que já recebeu */
  removeDoc(m.id);}
function limparDuplicadas(silencioso){const {certas}=contasDuplicadas();if(!certas.length)return 0;certas.forEach(dupResolver);
  try{localStorage.setItem("mu_dup_aviso",JSON.stringify({n:certas.length,em:TODAY()}));}catch(e){}
  if(!silencioso)toast("receipt",certas.length===1?"1 conta duplicada removida":certas.length+" contas duplicadas removidas","Ficaram as contas ligadas aos editais.");return certas.length;}
const _startDup=startApp;startApp=function(){const r=_startDup.apply(this,arguments);setTimeout(()=>{try{const n=limparDuplicadas(true);if(n)toast("receipt",n===1?"Removi 1 conta a receber duplicada":`Removi ${n} contas a receber duplicadas`,"Ficaram as ligadas aos editais. Dá para desfazer em Contas.");}catch(e){console.warn(e);}},1500);return r;};

/* aviso e duplicatas prováveis no topo de Contas */
function dupAvisoHTML(){let av=null,B=[];try{av=JSON.parse(localStorage.getItem("mu_dup_aviso")||"null");B=JSON.parse(localStorage.getItem("mu_dup_bkp")||"[]");}catch(e){}
  const {provaveis}=contasDuplicadas();let h="";
  if(av&&av.em>=addDays(TODAY(),-7)&&B.length)h+=`<div class="note">${ic("receipt")} Removi ${av.n} ${av.n===1?"lançamento duplicado":"lançamentos duplicados"} de contas a receber. Ficaram os ligados aos editais. <button class="lk small" data-a="dupDesfazer">Desfazer</button> <button class="lk small" data-a="dupOk">Ok</button></div>`;
  if(provaveis.length)h+=`<div class="card" style="margin:10px 0;border-color:var(--wait)"><b class="small">${ic("triangle-alert")} ${provaveis.length===1?"Possível conta em dobro":provaveis.length+" possíveis contas em dobro"}</b>
    <p class="tiny muted" style="margin:4px 0 8px">Mesmo valor de uma conta gerada por um edital. Se for o mesmo dinheiro, remova a manual.</p>
    ${provaveis.map(({a,m})=>`<div style="padding:8px 0;border-top:1px solid var(--line)"><div class="small"><b>${esc(m.desc||m.quem||"Conta")}</b> · ${money(m.valor)}</div><div class="tiny faint">mesmo valor de: ${esc(a.desc)}</div><div class="btns h" style="margin-top:8px"><button class="btn sm danger" data-a="dupSim" data-m="${m.id}" data-x="${a.id}">É duplicada, remover</button><button class="btn sm ghost" data-a="dupNao" data-m="${m.id}" data-x="${a.id}">Não é</button></div></div>`).join("")}</div>`;
  return h;}
const _contasDup=VIEWS.contas;VIEWS.contas=function(){const h=_contasDup.apply(this,arguments);const av=dupAvisoHTML();if(!av)return h;const i=h.indexOf("</header>");if(i>=0)return h.slice(0,i+9)+av+h.slice(i+9);const j=h.indexOf('<div class="app">');return j>=0?h.slice(0,j+17)+av+h.slice(j+17):av+h;};
ACT.dupSim=el=>{const a=getD(el.dataset.x),m=getD(el.dataset.m);if(a&&m)dupResolver({a,m});rr();toast("check","Conta duplicada removida","");};
ACT.dupNao=el=>{let ign=[];try{ign=JSON.parse(localStorage.getItem("mu_dup_ign")||"[]");}catch(e){}ign.push(el.dataset.m+"|"+el.dataset.x);try{localStorage.setItem("mu_dup_ign",JSON.stringify(ign));}catch(e){}rr();};
ACT.dupOk=()=>{try{localStorage.removeItem("mu_dup_aviso");}catch(e){}rr();};
ACT.dupDesfazer=()=>{let B=[];try{B=JSON.parse(localStorage.getItem("mu_dup_bkp")||"[]");}catch(e){}B.forEach(x=>{if(!getD(x.doc.id))save(x.doc);});
  try{localStorage.removeItem("mu_dup_bkp");localStorage.removeItem("mu_dup_aviso");}catch(e){}
  /* guarda como "não é duplicada" para não remover de novo */
  const {certas}=contasDuplicadas();let ign=[];try{ign=JSON.parse(localStorage.getItem("mu_dup_ign")||"[]");}catch(e){}certas.forEach(({a,m})=>ign.push(m.id+"|"+a.id));try{localStorage.setItem("mu_dup_ign",JSON.stringify(ign));}catch(e){}
  rr();toast("undo-2","Lançamentos restaurados","Eles não serão removidos de novo.");};
