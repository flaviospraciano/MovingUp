"use strict";
/* ======================================================================
   4.2 · DINHEIRO
   · Limite de gastos do mês (vale para o mês todo ou só para este), com avisos em 50%, 80%, 90% e 100%,
     "pode gastar por dia" e cartão no Início a partir de 80%.
   · Categorias organizadas em lote pela Gemini Decisions API (gastos sem categoria ou em "Outros").
   · Contas: um só jeito de pagar (botão, Lembretes, Jarvis), sem gasto nem mês seguinte duplicados.
     Linha do tempo de 90 dias: quando entra e quando sai cada valor, com o saldo previsto semana a semana.
   · Editais: cada pessoa aprovada pode receber em parcelas; cada parcela vira uma conta a receber com a sua data.
     Sem data informada, a conta aparece como "sem data prevista" em vez de uma data inventada.
   ====================================================================== */
const ymDe=d=>String(d).slice(0,7);
const glim=()=>{const x=single("glim",{m:{},av:{}});x.m=x.m||{};x.av=x.av||{};return x;};
const limMes=ym=>{const L=glim().m;return ym in L?+L[ym]||0:+cfg().orc||0;};
const gastoMes=ym=>sum(all("exp").filter(x=>ymDe(x.d)===ym).map(x=>+x.v||0));
const diasFimMes=()=>{const n=new Date();return new Date(n.getFullYear(),n.getMonth()+1,0).getDate()-n.getDate()+1;};
function limInfo(ym){ym=ym||ymDe(TODAY());const lim=limMes(ym),g=gastoMes(ym);if(!lim)return null;const atual=ym===ymDe(TODAY()),dias=atual?diasFimMes():0,resta=lim-g;
  return{ym,lim,g,resta,pct:Math.round(g/lim*100),dia:atual&&resta>0?resta/dias:0,dias,atual};}
const limNome=ym=>MESES[+ym.slice(5,7)-1].toLowerCase();
function limCardHTML(I,compacto){const cor=I.pct>=100?"n":I.pct>=80?"a":"c";
  return `<div class="card limc lim-${cor}"><div class="row"><b class="grow">${ic("gauge")} Limite de ${limNome(I.ym)}</b><span class="chip ${cor}">${I.pct}% usado</span>${compacto?"":`<button class="lk" data-a="limDef">Mudar</button>`}</div>
   <div class="bar" style="margin-top:8px"><i style="width:${Math.min(100,I.pct)}%"></i></div>
   <div class="limr"><div><b>${money(I.g)}</b><span>gasto de ${money(I.lim)}</span></div><div><b class="${I.resta<0?"neg":""}">${I.resta<0?"−"+money(-I.resta):money(I.resta)}</b><span>${I.resta<0?"acima do limite":"ainda pode"}</span></div>${I.atual&&I.resta>0?`<div><b>${money(I.dia)}</b><span>por dia · ${I.dias} ${I.dias===1?"dia":"dias"}</span></div>`:""}</div>
   ${compacto?`<button class="btn ghost sm" style="margin-top:8px" data-a="go" data-v="${gv({v:"gastos"})}">Ver gastos</button>`:""}</div>`;}
ACT.limDef=()=>{const ym=VIEW.v==="gastos"&&VIEW.y!=null&&VIEW.m!=null?VIEW.y+"-"+pad(VIEW.m+1):ymDe(TODAY()),G=glim(),v=ym in G.m?G.m[ym]:(+cfg().orc||"");
  sheet(`<h2>${ic("gauge")} Limite de gastos de ${limNome(ym)}</h2><p class="muted small" style="margin:4px 0 0">Quando chegar perto, eu aviso: em 50%, 80%, 90% e quando passar.</p>
   <label class="fld"><span>Quanto posso gastar neste mês (R$)</span><input id="limV" inputmode="decimal" value="${v?String(v).replace(".",","):""}" placeholder="Ex.: 2500"></label>
   <label class="chk"><input type="checkbox" id="limT" ${!(ym in G.m)?"checked":""}> Usar este valor em todos os meses</label>
   <div class="btns"><button class="btn full" id="limOk">${ic("check")} Salvar limite</button>${(ym in G.m)||cfg().orc?`<button class="btn ghost full" id="limX">Tirar o limite</button>`:""}</div>`,s=>{
   s.querySelector("#limOk").onclick=()=>{const n=num(s.querySelector("#limV").value);if(!(n>0))return toast("triangle-alert","Informe o valor","Ex.: 2500");const G=glim();
     if(s.querySelector("#limT").checked){const c=cfg();c.orc=n;save(c);delete G.m[ym];}else G.m[ym]=n;delete G.av[ym];save(G);closeSheet();rr();limChecar(ym,true);};
   const x=s.querySelector("#limX");if(x)x.onclick=()=>{const G=glim();G.m[ym]=0;save(G);closeSheet();rr();};});};
/* avisos ao lançar gasto */
const LIM_FAIXAS=[100,90,80,50];
function limChecar(ym,mostrar){const I=limInfo(ym);if(!I||!I.atual)return;const G=glim(),ja=+G.av[ym]||0,f=LIM_FAIXAS.find(x=>I.pct>=x)||0;if(f<=ja&&!mostrar)return;
  if(f>ja){G.av[ym]=f;save(G);}if(!f)return;const tit=f>=100?`Limite de ${limNome(ym)} estourado`:`${I.pct}% do limite de ${limNome(ym)}`;
  const sub=f>=100?`Passou ${money(-I.resta)}. Daqui até o fim do mês, só o essencial.`:`Restam ${money(I.resta)} para ${I.dias} ${I.dias===1?"dia":"dias"}: ${money(I.dia)} por dia.`;
  setTimeout(()=>{if(document.visibilityState==="visible")toast(f>=100?"triangle-alert":"gauge",tit,sub);else try{notify(tit,sub);}catch(e){}},400);}
const _save67=save;save=function(doc){const novo=doc&&doc.c==="exp"&&!DB.docs.has(doc.id),antes=doc&&doc.c==="exp"&&DB.docs.has(doc.id)?+(getD(doc.id).v):null;const r=_save67.apply(this,arguments);
  if(doc&&doc.c==="exp"&&doc.d){try{if(novo||antes!==+doc.v)limChecar(ymDe(doc.d));if(novo&&(!doc.cat||doc.cat==="Outros"))gcatFila(doc.id);}catch(e){}}return r;};
/* tela de gastos: cartão do limite no lugar da linha do orçamento */
const _gastos67=VIEWS.gastos;VIEWS.gastos=function(){let h=_gastos67.apply(this,arguments);h=h.replace(/<div class="small" style="margin-top:10px">(?:Restam|Passou)[^<]*<\/div><div class="bar"><i style="width:[^"]*"><\/i><\/div>/,"");
  const y=VIEW.y!=null?VIEW.y:new Date().getFullYear(),m=VIEW.m!=null?VIEW.m:new Date().getMonth(),ym=y+"-"+pad(m+1),I=limInfo(ym);
  const bloco=(I?limCardHTML(I,false):`<button class="card limc lim-vazio" data-a="limDef"><b>${ic("gauge")} Definir um limite para ${limNome(ym)}</b><span class="tiny muted">Eu aviso quando chegar perto e mostro quanto dá para gastar por dia.</span></button>`)+gcatBotao(ym);
  const k='<div class="btns h" style="margin-top:12px"><button class="btn ghost" data-a="gFoto"',i=h.indexOf(k);if(i>=0)return h.slice(0,i)+bloco+h.slice(i);const j=h.indexOf("</header>");return j<0?h:h.slice(0,j+9)+bloco+h.slice(j+9);};
const _home67=VIEWS.home;VIEWS.home=function(){const h=_home67.apply(this,arguments);const I=limInfo();if(!I||I.pct<80)return h;const c=limCardHTML(I,true);const i=h.indexOf('<div class="copi"');return i<0?h:h.slice(0,i)+c+h.slice(i);};
if(typeof pushFila==="function"){const _pf67=pushFila;pushFila=function(){const F=_pf67.apply(this,arguments);try{const I=limInfo(),t=TODAY(),at=pushEm(t,"09:00");
    if(I&&I.pct>=80&&at>Date.now())F.push({k:"lim_"+t,at:Math.round(at),t:I.pct>=100?"Limite do mês estourado":`Hoje dá para gastar ${moneyRaw(I.dia)}`,b:I.pct>=100?"Daqui até o fim do mês, só o essencial.":`${I.pct}% do limite usado · restam ${moneyRaw(I.resta)}.`,rep:""});}catch(e){}return F;};}
/* ---------- categorias em lote: Gemini Decisions API ---------- */
const GCAT_K=CATS.map((c,i)=>"c"+i);let GCAT_Q=new Set(),GCAT_T=null;
function gcatFila(id){if(!(window.MU_CONFIG&&MU_CONFIG.geminiKey))return;GCAT_Q.add(id);clearTimeout(GCAT_T);GCAT_T=setTimeout(()=>gcatRodar([...GCAT_Q],false),4000);}
async function gcatRodar(ids,manual){GCAT_Q=new Set();const L=ids.map(getD).filter(x=>x&&x.c==="exp"&&(!x.cat||x.cat==="Outros")&&x.desc).slice(0,300);if(!L.length){if(manual)toast("check","Nada para organizar","Todos os gastos já têm categoria.");return;}
  const crit={};CATS.forEach((c,i)=>{crit["c"+i]=c[0];});const Q={};L.forEach((x,i)=>{Q["g"+i]={type:"choice",instructions:`Em qual categoria entra este gasto: "${String(x.desc).slice(0,120)}" (R$ ${(+x.v||0).toFixed(2)})${x.pag?", pago com "+x.pag:""}?`,criteria:crit};});
  const R=await iaDecidir("Gastos pessoais de uma pessoa no Brasil. Escolha a categoria mais provável de cada um.",Q,manual?8000:4000);if(!R){if(manual)toast("sparkles","A organização automática não respondeu","Tente de novo em alguns minutos.");return;}
  let n=0;L.forEach((x,i)=>{const a=R["g"+i];if(!a||!a.choice||(+a.confidence||0)<.7)return;const cat=crit[a.choice];if(!cat||cat==="Outros")return;const y=getD(x.id);if(!y||(y.cat&&y.cat!=="Outros"))return;y.cat=cat;y.catIA=1;_save67(y);n++;});
  if(n){rr();toast("sparkles",n===1?"1 gasto organizado":n+" gastos organizados","Categorias escolhidas pela IA. Dá para trocar tocando no gasto.");}else if(manual)toast("check","Nenhuma categoria com certeza suficiente","Esses ficam em Outros.");}
function gcatBotao(ym){if(!(window.MU_CONFIG&&MU_CONFIG.geminiKey))return"";const n=all("exp").filter(x=>ymDe(x.d)===ym&&(!x.cat||x.cat==="Outros")&&x.desc).length;if(n<2)return"";
  return `<button class="crbtn" data-a="gcatOk" data-ym="${ym}">${ic("sparkles")} Organizar ${n} gastos sem categoria<span class="tiny">a IA escolhe em segundos</span></button>`;}
ACT.gcatOk=el=>{el.disabled=true;el.innerHTML=`${ic("hourglass")} Organizando…`;gcatRodar(all("exp").filter(x=>ymDe(x.d)===el.dataset.ym).map(x=>x.id),true);};

/* ---------- contas: pagar e reabrir num lugar só ---------- */
function proxMes(venc){const nd=pd(venc),dd=nd.getDate();nd.setDate(1);nd.setMonth(nd.getMonth()+1);nd.setDate(Math.min(dd,new Date(nd.getFullYear(),nd.getMonth()+1,0).getDate()));return iso(nd);}
function contaPagar(c){if(!c||c.status==="paga")return c;const t=TODAY();c.status="paga";c.pagoEm=t;
  if(c.tipo==="pagar"&&c.lanc!==false&&!(c.gasto&&getD(c.gasto))){const g={id:"exp_ct_"+c.id,c:"exp",v:+c.valor,desc:c.desc,cat:c.cat||"Contas",pag:"",d:t,conta:c.id};save(g);c.gasto=g.id;}
  if(c.rep==="m"&&!(c.prox&&getD(c.prox))){const ja=all("conta").find(x=>x.ant===c.id);if(ja)c.prox=ja.id;else{const n={...c,id:"ct_"+nid(),status:"aberta",pagoEm:"",gasto:"",venc:proxMes(c.venc),u:0,prox:"",ant:c.id,nt:""};delete n.recAntes;save(n);c.prox=n.id;}}
  save(c);return c;}
function contaReabrir(c){if(!c)return;c.status="aberta";c.pagoEm="";if(c.gasto&&getD(c.gasto)){LIXO_SIL++;try{removeDoc(c.gasto);}finally{LIXO_SIL--;}}c.gasto="";save(c);}
ACT.ctPay=el=>{const c=getD(el.dataset.id);if(!c)return;if(c.status==="paga"){contaReabrir(c);rr();toast("rotate-ccw","Conta reaberta",c.desc+(c.prox?" · a do mês seguinte continua agendada":""));return;}
  contaPagar(c);rr();toast(c.tipo==="receber"?"hand-coins":"check",c.tipo==="receber"?"Recebido!":"Conta paga",money(c.valor)+(c.rep==="m"?" · próxima em "+fdate(getD(c.prox)?getD(c.prox).venc:proxMes(c.venc)):"")+(c.gasto?" · lançada nos gastos":""));};
const _lh67=lhItens;lhItens=function(){const L=_lh67.apply(this,arguments);L.forEach(x=>{if(/^ct:/.test(x.k)){const id=x.k.slice(3);x.ok=()=>contaPagar(getD(id));}});return L;};
/* cartão da conta com mais clareza */
const _cCard67=contaCard;contaCard=function(c){const h=_cCard67.apply(this,arguments);const X=[];
  if(c.ed){const e=getD(c.ed);X.push(`<span class="chip m">${ic("folder")} edital${e?" "+esc(e.ano||""):""}</span>`);}
  if(c.semData&&c.status!=="paga")X.push(`<span class="chip a">${ic("calendar-x")} sem data prevista</span>`);
  if(c.rep==="m"&&c.status==="paga"&&c.prox&&getD(c.prox))X.push(`<span class="chip">${ic("calendar-check")} próxima: ${fdate(getD(c.prox).venc).slice(0,5)}</span>`);
  return X.length?h.replace(/<\/div><\/button><\/div>\s*$/,X.join("")+"</div></button></div>"):h;};
/* linha do tempo: quando entra e quando sai */
function linhaItens(){const t=TODAY(),fim=addDays(t,90),L=[];all("conta").filter(c=>c.status!=="paga").forEach(c=>{
    if(c.semData)return L.push({c,d:"",v:c.tipo==="receber"?+c.valor:-c.valor,sem:1});L.push({c,d:c.venc<t?t:c.venc,atr:c.venc<t,v:c.tipo==="receber"?+c.valor:-c.valor});
    if(c.rep==="m"){let d=c.venc;for(let k=0;k<4;k++){d=proxMes(d);if(d>fim)break;if(d>=t)L.push({c,d,v:c.tipo==="receber"?+c.valor:-c.valor,prev:1});}}});return L;}
function linhaHTML(){const t=TODAY(),L=linhaItens(),c0=cfg(),saldo=+c0.saldoHoje||0;const segunda=d=>addDays(d,-((pd(d).getDay()+6)%7));let acum=saldo;
  let h=`<div class="card linsal"><div class="row"><div class="grow"><div class="muted small">Quanto você tem hoje (opcional)</div><b style="font:800 1.4rem var(--disp)">${money(saldo)}</b>${c0.saldoEm?`<span class="tiny faint"> · informado em ${fdate(c0.saldoEm)}</span>`:""}</div><button class="btn ghost sm" data-a="saldoDef">${ic("pencil")} Informar</button></div>
   <p class="tiny muted" style="margin:6px 0 0">Com o saldo de hoje, a linha mostra quanto vai sobrar a cada semana. Contas mensais entram já previstas.</p></div>`;
  const S={};L.filter(x=>!x.sem).forEach(x=>{const w=segunda(x.d);(S[w]=S[w]||[]).push(x);});
  for(let w=segunda(t),k=0;k<13;w=addDays(w,7),k++){const I=(S[w]||[]).sort((a,b)=>a.d.localeCompare(b.d));const ent=sum(I.filter(x=>x.v>0).map(x=>x.v)),sai=-sum(I.filter(x=>x.v<0).map(x=>x.v));acum+=ent-sai;
    if(!I.length&&k>0)continue;h+=`<div class="linw ${acum<0?"aperto":""}"><div class="linh"><b>${k===0?"Esta semana":k===1?"Semana que vem":fdate(w).slice(0,5)+" a "+fdate(addDays(w,6)).slice(0,5)}</b><span class="tiny ${acum<0?"neg":"muted"}">saldo previsto ${acum<0?"−"+money(-acum):money(acum)}</span></div>
      ${I.length?I.map(x=>`<button class="lini" data-a="ctEdit" data-id="${x.c.id}"><span class="lind">${x.atr?`<b class="neg">atrasada</b>`:esc(DOW[pd(x.d).getDay()])+" "+fdate(x.d).slice(0,5)}</span><span class="grow ell">${esc(x.c.desc)}${x.prev?` <span class="tiny faint">(prevista)</span>`:""}</span><b class="${x.v>0?"pos":"neg"}">${x.v>0?"+":"−"} ${money(Math.abs(x.v))}</b></button>`).join(""):`<div class="tiny faint" style="padding:6px 2px">Nada entra nem sai.</div>`}
      ${I.length?`<div class="tiny muted lint">${ent?"entra "+money(ent):""}${ent&&sai?" · ":""}${sai?"sai "+money(sai):""}</div>`:""}</div>`;}
  const sem=L.filter(x=>x.sem);if(sem.length)h+=`<div class="grp">${ic("calendar-x")} Sem data prevista<span class="chip a">${sem.length} · ${money(sum(sem.map(x=>Math.abs(x.v))))}</span></div><p class="tiny muted" style="margin:0 0 6px">Informe a data no edital (ou na conta) para entrar na linha do tempo.</p>`+sem.map(x=>`<button class="lini" data-a="ctEdit" data-id="${x.c.id}"><span class="lind">${ic("circle-help")}</span><span class="grow ell">${esc(x.c.desc)}</span><b class="${x.v>0?"pos":"neg"}">${x.v>0?"+":"−"} ${money(Math.abs(x.v))}</b></button>`).join("");
  return h;}
ACT.saldoDef=()=>{const c=cfg();sheet(`<h2>Quanto você tem hoje?</h2><p class="muted small">Some o que está disponível nas contas e na carteira. Fica só no app.</p><label class="fld"><span>Saldo de hoje (R$)</span><input id="sdV" inputmode="decimal" value="${c.saldoHoje?String(c.saldoHoje).replace(".",","):""}"></label><div class="btns"><button class="btn full" id="sdOk">Salvar</button></div>`,s=>{s.querySelector("#sdOk").onclick=()=>{const c=cfg();c.saldoHoje=num(s.querySelector("#sdV").value);c.saldoEm=TODAY();save(c);closeSheet();rr();};});};
const _contas67=VIEWS.contas;VIEWS.contas=function(){const linha=VIEW.tab==="linha";if(linha)VIEW.tab="pagar";let h;try{h=_contas67.apply(this,arguments);}finally{if(linha)VIEW.tab="linha";}
  const bt=`<button data-a="liTab" data-v="linha" aria-pressed="${linha}">${ic("calendar-range")} Linha do tempo</button>`;const i=h.indexOf('<div class="tabs"');if(i<0)return h;const j=h.indexOf("</div>",i);h=h.slice(0,j)+bt+h.slice(j);h=h.slice(0,i)+'<div class="tabs tabs4"'+h.slice(i+17);
  if(!linha)return h;h=h.replace(/(<div class="tabs"[^>]*>[\s\S]*?)aria-pressed="true"/,'$1aria-pressed="false"');const k=h.indexOf("</div>",h.indexOf('<div class="tabs"'))+6;const fab=h.lastIndexOf('<button class="fab"');
  return h.slice(0,k)+linhaHTML()+"</div>"+(fab>0?h.slice(fab):"");};

/* ---------- editais: parcelas viram contas a receber ---------- */
const r2d=v=>Math.round((+v||0)*100)/100;
const CT_CAMPOS=["desc","quem","valor","venc","semData","status","pagoEm","nota"];
function ctSalva(id,base,campos){const ex=getD(id),d=ex||Object.assign({id,c:"conta",tipo:"receber",auto:true},base);const antes=JSON.stringify(CT_CAMPOS.map(k=>d[k]));Object.assign(d,campos);if(!ex||antes!==JSON.stringify(CT_CAMPOS.map(k=>d[k])))save(d);}
edSync=function(e){if(!e||e.c!=="ed")return;SYNC=true;try{const ids=new Set();
  (e.pess||[]).forEach(p=>{const g=ganhoP(p),base={ed:e.id,pid:p.id},id0="ct_ed_"+e.id+"_"+p.id;
    if(p.st!=="c"||!(g>0)){all("conta").filter(c=>c.auto&&c.ed===e.id&&c.pid===p.id&&c.status!=="paga").forEach(c=>removeDoc(c.id));return;}
    const P=(p.parc||[]).filter(x=>+x.v>0);
    if(P.length){P.forEach((x,i)=>{const id=id0+"_"+x.id,ex=getD(id);ids.add(id);ctSalva(id,Object.assign({parc:x.id},base),{desc:`${e.nome} · ${p.n} · parcela ${i+1} de ${P.length}`,quem:e.nome,valor:r2d(x.v),venc:x.prev||(ex&&ex.venc)||addDays(TODAY(),30),semData:!x.prev,status:x.rec?"paga":"aberta",pagoEm:x.rec?(x.em||(ex&&ex.pagoEm)||TODAY()):"",nota:""});});
      const resto=r2d(g-sum(P.map(x=>+x.v||0)));if(resto>.009){ids.add(id0);const ex=getD(id0);ctSalva(id0,base,{desc:`${e.nome} · ${p.n} · restante`,quem:e.nome,valor:resto,venc:p.prev||(ex&&ex.venc)||addDays(TODAY(),30),semData:!p.prev,status:p.restRec?"paga":"aberta",pagoEm:p.restRec?(ex&&ex.pagoEm)||TODAY():"",nota:`Ganho total ${moneyRaw(g)} · ${P.length} ${P.length===1?"parcela":"parcelas"} + restante`});}
      else{const ex=getD(id0);if(ex&&ex.status==="paga")ids.add(id0);}return;}
    ids.add(id0);const ex=getD(id0),rc=Math.min(+p.rec||0,g),falta=r2d(g-rc);
    if(falta<=0){if(ex&&ex.status!=="paga")ctSalva(id0,base,{status:"paga",pagoEm:TODAY(),valor:g});else if(!ex)ctSalva(id0,base,{desc:e.nome+" · "+p.n,quem:e.nome,valor:g,venc:p.prev||TODAY(),semData:false,status:"paga",pagoEm:TODAY(),nota:""});return;}
    ctSalva(id0,base,{desc:e.nome+" · "+p.n,quem:e.nome,valor:falta,venc:p.prev||(ex&&ex.venc)||addDays(TODAY(),30),semData:!p.prev,status:"aberta",pagoEm:"",nota:rc>0?`Ganho total ${moneyRaw(g)} · já recebido ${moneyRaw(rc)}`:""});});
  all("conta").filter(c=>c.auto&&c.ed===e.id&&!ids.has(c.id)&&c.status!=="paga").forEach(c=>removeDoc(c.id));}finally{SYNC=false;}};
const parcRec=p=>r2d(sum((p.parc||[]).filter(x=>x.rec).map(x=>+x.v||0))+(p.restRec?Math.max(0,ganhoP(p)-sum((p.parc||[]).map(x=>+x.v||0))):0));
contaToEdital=function(c){const e=getD(c.ed);if(!e)return;const p=(e.pess||[]).find(x=>x.id===c.pid);if(!p)return;SYNC=true;try{const pago=c.status==="paga";
    if(c.parc){const x=(p.parc||[]).find(y=>y.id===c.parc);if(x){x.rec=pago;x.em=pago?(c.pagoEm||TODAY()):"";}p.rec=parcRec(p);}
    else if((p.parc||[]).length){p.restRec=pago;p.rec=parcRec(p);}
    else if(pago){c.recAntes=+p.rec||0;p.rec=ganhoP(p);}else p.rec=c.recAntes||0;save(e);}finally{SYNC=false;}edSync(e);};
const _pp67=ppSheet;ppSheet=function(eid,i){_pp67.apply(this,arguments);const e=getD(eid),p=e&&e.pess[i];if(!p||p.st!=="c")return;const S=$("sheet"),PV=S&&S.querySelector("#ppPrev");if(!PV)return;
  const P=p.parc||[],g=ganhoP(p),soma=sum(P.map(x=>+x.v||0));const d=document.createElement("div");d.className="ppparc";
  d.innerHTML=`<div class="row"><b class="grow small">${ic("layers")} Parcelas</b><button type="button" class="btn ghost sm" data-a="parcAbrir" data-id="${eid}" data-i="${i}">${P.length?"Editar":"Dividir em parcelas"}</button></div>`+
   (P.length?`<div class="ppl">${P.map((x,k)=>`<div class="row tiny"><span class="grow">${k+1}ª · ${money(+x.v)} · ${x.prev?fdate(x.prev):"sem data"}</span>${x.rec?`<span class="chip c">${ic("check")} recebida</span>`:""}</div>`).join("")}${g-soma>.009?`<div class="row tiny"><span class="grow">restante · ${money(g-soma)} · ${p.prev?fdate(p.prev):"sem data"}</span>${p.restRec?`<span class="chip c">recebido</span>`:""}</div>`:""}</div>`
     :`<div class="tiny muted">Vai receber em partes? Divida aqui: cada parcela vira uma conta a receber com a sua data, e o recebido se soma sozinho.</div>`);
  PV.closest("label").after(d);if(P.length){const R=S.querySelector("#ppR");if(R){R.value=String(parcRec(p)).replace(".",",");R.readOnly=true;const b=S.querySelector('[data-a="ppRecAll"]');if(b)b.style.display="none";R.closest("label").querySelector("span").textContent="Já recebi (somado das parcelas)";}
    const lb=PV.closest("label").querySelector("span");if(lb)lb.textContent=g-soma>.009?"Previsão do restante":"Previsão (cada parcela tem a sua)";}};
let PARC=null;
ACT.parcAbrir=el=>{const e=getD(el.dataset.id),i=+el.dataset.i,p=e.pess[i];PARC={eid:e.id,i,L:JSON.parse(JSON.stringify(p.parc||[]))};if(!PARC.L.length)PARC.L=[{id:nid(),v:r2d(ganhoP(p)/2),prev:"",rec:false},{id:nid(),v:r2d(ganhoP(p)-r2d(ganhoP(p)/2)),prev:"",rec:false}];parcSheet();};
function parcLer(){const S=$("sheet");if(!S||!PARC)return;S.querySelectorAll("[data-pk]").forEach(r=>{const x=PARC.L[+r.dataset.pk];if(!x)return;x.v=num(r.querySelector(".pv").value);x.prev=r.querySelector(".pd").value;x.rec=r.querySelector(".pr").checked;});}
function parcSheet(){const e=getD(PARC.eid),p=e.pess[PARC.i],g=ganhoP(p),soma=sum(PARC.L.map(x=>+x.v||0)),dif=r2d(g-soma);
  sheet(`<h2>${ic("layers")} Parcelas de ${esc(p.n)}</h2><div class="muted small" style="margin-bottom:8px">${esc(e.nome)} · ganho ${money(g)}</div>
   ${PARC.L.map((x,k)=>`<div class="parcr" data-pk="${k}"><b>${k+1}ª</b><input class="pv" inputmode="decimal" value="${x.v?String(x.v).replace(".",","):""}" aria-label="Valor da parcela ${k+1}"><input class="pd" type="date" value="${esc(x.prev||"")}" aria-label="Data prevista"><label class="tiny"><input type="checkbox" class="pr" ${x.rec?"checked":""}> recebida</label><button type="button" class="ib" data-a="parcTira" data-k="${k}" aria-label="Tirar">${ic("x")}</button></div>`).join("")}
   <div class="wrap-row" style="margin:8px 0"><button type="button" class="chip" data-a="parcMais">${ic("plus")} Parcela</button>${[2,3,4,6].map(n=>`<button type="button" class="chip" data-a="parcIguais" data-n="${n}">${n}× iguais</button>`).join("")}</div>
   <div class="tiny ${dif<-.009?"neg":"muted"}" id="parcDif">${dif>.009?`Faltam ${money(dif)}: viram uma conta "restante".`:dif<-.009?`As parcelas passam ${money(-dif)} do ganho.`:"As parcelas fecham o valor certinho."}</div>
   <div class="btns"><button class="btn full" data-a="parcSalvar">${ic("check")} Salvar parcelas</button>${(p.parc||[]).length?`<button class="btn ghost full" data-a="parcLimpar">Receber em uma vez só</button>`:""}</div>`);}
ACT.parcMais=()=>{parcLer();PARC.L.push({id:nid(),v:0,prev:"",rec:false});parcSheet();};
ACT.parcTira=el=>{parcLer();PARC.L.splice(+el.dataset.k,1);parcSheet();};
ACT.parcIguais=el=>{parcLer();const e=getD(PARC.eid),p=e.pess[PARC.i],g=ganhoP(p),n=+el.dataset.n,v=Math.floor(g/n*100)/100;const base=PARC.L[0]&&PARC.L[0].prev?PARC.L[0].prev:"";
  PARC.L=[...Array(n)].map((_,k)=>({id:(PARC.L[k]&&PARC.L[k].id)||nid(),v:k===n-1?r2d(g-v*(n-1)):v,prev:base?proxMesN(base,k):"",rec:!!(PARC.L[k]&&PARC.L[k].rec)}));parcSheet();};
const proxMesN=(d,k)=>{let x=d;for(let i=0;i<k;i++)x=proxMes(x);return x;};
ACT.parcSalvar=()=>{parcLer();const e=getD(PARC.eid),p=e.pess[PARC.i],g=ganhoP(p),L=PARC.L.filter(x=>+x.v>0);if(sum(L.map(x=>+x.v))-g>.009)return toast("triangle-alert","As parcelas passam do ganho","Ajuste os valores.");
  L.forEach(x=>{if(x.rec&&!x.em)x.em=TODAY();if(!x.rec)x.em="";});p.parc=L;p.rec=parcRec(p);const pend=L.filter(x=>!x.rec&&x.prev).sort((a,b)=>a.prev.localeCompare(b.prev))[0];if(!p.prev&&pend)p.prev="";save(e);
  const i=PARC.i,eid=PARC.eid;PARC=null;toast("layers",L.length+(L.length===1?" parcela salva":" parcelas salvas"),"Cada uma já está em Contas a receber.");ppSheet(eid,i);};
ACT.parcLimpar=()=>{const e=getD(PARC.eid),p=e.pess[PARC.i];confirmSheet("Receber em uma vez só?","As parcelas somem e fica uma conta só com o que falta receber.","Confirmar",()=>{p.parc=[];delete p.restRec;save(e);const i=PARC.i,eid=PARC.eid;PARC=null;ppSheet(eid,i);});};

/* ---------- Jarvis: quanto posso gastar ---------- */
const _rota67=rotaNova;rotaNova=function(txt){const n=normTxt(txt).replace(/^(ei |ok |oi )?jarvis[,\s]*/,"").replace(/[!.?]/g," ").trim();
  if(/(quanto (eu )?(ainda )?posso gastar|quanto (me )?sobra (do|no) (limite|mes)|como (esta|anda) (o )?(meu )?limite|limite de gastos)/.test(n)){const I=limInfo();
    jarResp("Limite do mês",I?(I.resta>=0?`Você gastou ${money(I.g)} de ${money(I.lim)}. Ainda pode ${money(I.resta)} até o fim do mês, cerca de ${money(I.dia)} por dia.`:`O limite de ${money(I.lim)} já passou em ${money(-I.resta)}. Daqui até o fim do mês, só o essencial.`):"Você ainda não definiu um limite para este mês. Em Gastos, toque em Definir um limite.");return true;}
  return _rota67(txt);};

/* previsão de caixa (Conexões): conta sem data prevista não entra num mês inventado */
if(typeof previsao==="function"){previsao=function(n=3){const t=TODAY(),ym=t.slice(0,7),med=gastoMedio(),C=all("conta").filter(c=>c.status!=="paga"&&!c.semData);let acum=0;
  return Array.from({length:n},(_,i)=>{const m=ymAdd(ym,i);const naData=c=>c.venc&&(i===0?c.venc<=m+"-31":c.venc.startsWith(m));
    const rec=sum(C.filter(c=>c.tipo==="receber"&&naData(c)).map(c=>+c.valor||0)),pag=sum(C.filter(c=>c.tipo==="pagar"&&naData(c)).map(c=>+c.valor||0));
    const ja=i===0?sum(all("exp").filter(e=>(e.d||"").startsWith(ym)).map(e=>+e.v||0)):0;const gas=Math.max(0,med-ja);const sobra=rec-pag-gas;acum+=sobra;return{m,rec,pag,gas,sobra,acum};});};}
const _venc67=vencTxt;vencTxt=function(c){if(c&&c.semData&&c.status!=="paga")return c.tipo==="receber"?"Sem data prevista · informe no edital":"Sem data prevista";return _venc67.apply(this,arguments);};
