"use strict";
/* ======================================================================
   PORTUGUÊS PARA CONCURSOS (INSS, Banco do Brasil, SEFAZ e afins)
   · Trilha progressiva: classes de palavras → acentuação → porquês → crase → concordância →
     regência → colocação → pontuação → semântica e conectivos. Cada tópico tem lição e prática.
   · Banco: 123 questões de porquês, 225 de crase e 87 dos demais tópicos (js/dados/, carregado sob demanda).
   · Treino inteligente: mistura o que você errou e já está na hora de rever (repetição espaçada),
     as regras em que você mais erra e questões novas.
   · Ao errar: a regra, a explicação e o macete. No fim: os padrões dos seus erros.
   Dados: um documento c:"ptst" {q:{id:[acertos,erros,caixa,próxima revisão]}, hist:[{d,n,ok}]}
   ====================================================================== */
MODS.port={n:"Português para concursos",ic:"spell-check",c1:"#1D4ED8",c2:"#60A5FA",g:1,v:{v:"port"}};
let PTQ=null,PTS=null;
const PT_ARQ=["pt-1-regras","pt-2-porques","pt-3-crase","pt-4-geral"];
const PT_CAIXA=[0,1,3,7,21];
const ptHash=s=>{let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return "q"+(h>>>0).toString(36);};
const ptStat=()=>single("ptst",{q:{},hist:[]});
async function ptCarregar(){if(PTQ)return PTQ;for(const f of PT_ARQ)await loadScript("js/dados/"+f+".js");
  const top={};PT.TRILHA.forEach(t=>t.regras.forEach(r=>{top[r]=t.id;}));const Q=[];
  const linhas=s=>String(s||"").split("\n").map(x=>x.trim()).filter(Boolean);
  linhas(PT.PQ).forEach(l=>{const [r,resp,f]=l.split("|");const op=resp==="porquês"?["por quês","porques","porquês","por que"]:["por que","por quê","porque","porquê"];Q.push({id:ptHash(f),regra:r,top:top[r],tipo:"lacuna",f,op,certa:op.indexOf(resp)});});
  linhas(PT.CR).forEach(l=>{const [r,resp,f]=l.split("|");const op=r==="cr_ha"?["há","a","à"]:r==="cr_fac"?["a","à","ambas"]:(r==="cr_plural"||r==="cr_aquele")?["a","à"]:["a","à","as","às"];Q.push({id:ptHash(f),regra:r,top:top[r],tipo:"lacuna",f,op,certa:op.indexOf(resp)});});
  linhas(PT.MC).forEach(l=>{const [r,i,o,e]=l.split("|");Q.push({id:ptHash(e+o),regra:r,top:top[r],tipo:"multipla",f:e,op:o.split(";"),certa:+i});});
  PTQ=Q.filter(q=>q.certa>=0&&q.top);return PTQ;}
const ptVence=(st,id)=>{const x=st.q[id];return x&&x[3]<=TODAY();};
function ptTaxaRegras(st){const R={};(PTQ||[]).forEach(q=>{const x=st.q[q.id];if(!x)return;const g=R[q.regra]||(R[q.regra]={a:0,e:0});g.a+=x[0];g.e+=x[1];});return R;}
function ptMontar(modo,topico){const st=ptStat(),Q=PTQ.filter(q=>!topico||q.top===topico),emb=a=>a.sort(()=>Math.random()-.5),sel=[],usa=q=>{if(q&&!sel.includes(q)&&sel.length<10)sel.push(q);};
  if(modo==="erros"){emb(Q.filter(q=>{const x=st.q[q.id];return x&&x[1]>0&&x[2]<3;})).forEach(usa);return sel;}
  emb(Q.filter(q=>{const x=st.q[q.id];return x&&x[2]<=1&&ptVence(st,q.id);})).slice(0,4).forEach(usa);
  const T=ptTaxaRegras(st),fracas=Object.entries(T).filter(([,g])=>g.a+g.e>=2&&g.e>0).sort((a,b)=>b[1].e/(b[1].a+b[1].e)-a[1].e/(a[1].a+a[1].e)).slice(0,3).map(([r])=>r);
  emb(Q.filter(q=>fracas.includes(q.regra)&&(!st.q[q.id]||ptVence(st,q.id)))).slice(0,3).forEach(usa);
  emb(Q.filter(q=>!st.q[q.id])).forEach(usa);
  emb(Q.filter(q=>ptVence(st,q.id))).forEach(usa);
  Q.slice().sort((a,b)=>((st.q[a.id]||[0,0,0,""])[3]||"").localeCompare((st.q[b.id]||[0,0,0,""])[3]||"")).forEach(usa);
  return emb(sel);}

/* ---------- telas ---------- */
VIEWS.port=()=>{if(!PTQ){ptCarregar().then(()=>{if(VIEW.v==="port")rr();}).catch(e=>{console.warn(e);toast("triangle-alert","Não consegui carregar as questões","Confira a internet e abra de novo.");});
    return `<div class="app">${topbar("Português","port")}<div class="note">Carregando o banco de questões…</div></div>`;}
  if(PTS)return ptQuizHTML();
  const st=ptStat(),Q=PTQ,feitas=Q.filter(q=>st.q[q.id]),H=(st.hist||[]).slice(-30),ac=sum(H.map(h=>h.ok)),tot=sum(H.map(h=>h.n));
  const erros=Q.filter(q=>{const x=st.q[q.id];return x&&x[1]>0&&x[2]<3;}).length;
  let h=topbar("Português para concursos","port");
  h+=`<div class="hero"><div class="muted small">Grade de INSS, Banco do Brasil e SEFAZ · ${Q.length} questões</div><h2>${feitas.length?`${tot?Math.round(ac/tot*100):0}% de acerto recente`:"Comece pela trilha"}</h2>
    <div class="stats"><div><b>${feitas.length}</b><span>questões vistas</span></div><div><b>${erros}</b><span>no caderno de erros</span></div><div><b>${new Set(H.map(x=>x.d)).size}</b><span>dias de treino</span></div></div>
    <button class="btn full" style="margin-top:14px;padding:15px" data-a="ptIniciar" data-m="inteligente">${ic("sparkles")} Treino inteligente · 10 questões</button>
    ${erros?`<button class="btn ghost full" style="margin-top:8px" data-a="ptIniciar" data-m="erros">${ic("rotate-ccw")} Refazer o caderno de erros (${erros})</button>`:""}</div>`;
  const T=ptTaxaRegras(st),pad2=Object.entries(T).filter(([,g])=>g.e>0&&g.a+g.e>=2).map(([r,g])=>[r,g,Math.round(g.e/(g.a+g.e)*100)]).sort((a,b)=>b[2]-a[2]).slice(0,4);
  if(pad2.length)h+=`<div class="sec"><h2>${ic("crosshair")} Padrões dos seus erros</h2></div>`+pad2.map(([r,g,p])=>{const R=PT.REGRAS[r]||[r,"",""];return `<button class="item" style="width:100%;text-align:left" data-a="ptRegra" data-r="${r}"><span class="mb" style="background:var(--waitbg);color:var(--waittx);font:800 .8rem var(--body)">${p}%</span><span class="ibody"><b>${esc(R[0])}</b><span class="small muted">${esc(R[2])}</span></span></button>`;}).join("");
  h+=`<div class="sec"><h2>Trilha de estudo</h2></div><p class="tiny faint" style="margin:-4px 0 8px">Na ordem do que dá base para o que dá segurança.</p>`;
  PT.TRILHA.forEach((t,i)=>{const qq=Q.filter(q=>q.top===t.id),vis=qq.filter(q=>st.q[q.id]),a=sum(vis.map(q=>st.q[q.id][0])),e=sum(vis.map(q=>st.q[q.id][1])),dom=a+e?Math.round(a/(a+e)*100):null;
    h+=`<div class="card ptt" style="margin-bottom:10px"><div class="row"><span class="kgn">${i+1}</span><b class="grow">${esc(t.n)}</b>${dom!=null?`<span class="chip ${dom>=80?"c":dom>=60?"a":"n"}">${dom}%</span>`:""}</div>
      <div class="bar" style="margin:8px 0 6px"><i style="width:${qq.length?vis.length/qq.length*100:0}%"></i></div><div class="tiny faint">${vis.length} de ${qq.length} questões vistas</div>
      <div class="btns h" style="margin-top:10px"><button class="btn ghost sm" data-a="ptLicao" data-t="${t.id}">${ic("book-open")} Lição</button><button class="btn sm" data-a="ptIniciar" data-m="topico" data-t="${t.id}">${ic("play")} Praticar</button></div></div>`;});
  return `<div class="app">${h}</div>`;};
function ptQuizHTML(){const S=PTS,q=S.qs[S.i],R=PT.REGRAS[q.regra]||[q.regra,"",""],resp=S.resp[S.i];
  const frase=q.tipo==="lacuna"?esc(q.f).replace("___",resp==null?`<span class="ptbl">_____</span>`:`<span class="ptbl ${resp===q.certa?"ok":"no"}">${esc(q.op[resp])}</span>`).replace("___","<span class=\"ptbl\">_____</span>"):esc(q.f);
  let h=`<header class="top"><button class="ib" data-a="ptSair" aria-label="Sair">${ic("x")}</button><span class="mb" ${mstyle("port")}>${ic("spell-check")}</span><h1>Questão ${S.i+1} de ${S.qs.length}</h1></header>
    <div class="bar" style="margin:4px 0 14px"><i style="width:${(S.i+(resp!=null?1:0))/S.qs.length*100}%"></i></div>
    <div class="meta" style="margin-bottom:8px"><span class="chip m">${esc((PT.TRILHA.find(t=>t.id===q.top)||{}).n||"")}</span><span class="chip">${q.regra.startsWith("cr_")||q.regra.startsWith("pq_")?"médio a difícil":"concurso"}</span></div>
    <div class="card ptq"><p class="ptf">${frase}</p>${q.tipo==="lacuna"?`<p class="tiny faint" style="margin:6px 0 0">Complete a lacuna.</p>`:""}</div>
    <div class="ptops">${q.op.map((o,i)=>{const cls=resp==null?"":i===q.certa?"ok":i===resp?"no":"off";return `<button class="ptop ${cls}" data-a="ptResp" data-i="${i}" ${resp!=null?"disabled":""}><span>${String.fromCharCode(65+i)}</span>${esc(o==="ambas"?"as duas formas estão corretas":o)}</button>`;}).join("")}</div>`;
  if(resp!=null){const ok=resp===q.certa;
    h+=`<div class="card ptfb ${ok?"ok":"no"}"><b>${ic(ok?"circle-check":"circle-alert")} ${ok?"Certo!":"Resposta: "+esc(q.op[q.certa]==="ambas"?"as duas formas":q.op[q.certa])}</b>
      <div class="small" style="margin-top:6px"><b>${esc(R[0])}</b></div><p class="small" style="margin:4px 0 0">${esc(R[1])}</p>${R[2]?`<p class="small" style="margin:6px 0 0"><b>Macete:</b> ${esc(R[2])}</p>`:""}</div>
      <button class="btn full" style="margin-top:12px;padding:15px" data-a="ptProx">${S.i+1<S.qs.length?"Próxima questão":"Ver resultado"} ${ic("chevron-right")}</button>`;}
  return `<div class="app">${h}</div>`;}
ACT.ptIniciar=async el=>{await ptCarregar();const qs=ptMontar(el.dataset.m,el.dataset.t||null);if(!qs.length)return toast("circle-check","Nada para revisar agora","Seu caderno de erros está em dia.");
  PTS={qs,i:0,resp:[],modo:el.dataset.m};closeSheet();if(VIEW.v!=="port")go({v:"port"});else rr();window.scrollTo(0,0);};
ACT.ptResp=el=>{const S=PTS;if(!S||S.resp[S.i]!=null)return;const i=+el.dataset.i,q=S.qs[S.i],ok=i===q.certa;S.resp[S.i]=i;
  const st=ptStat(),x=st.q[q.id]||[0,0,0,""];if(ok){x[0]++;x[2]=Math.min(4,x[2]+1);}else{x[1]++;x[2]=0;}x[3]=addDays(TODAY(),PT_CAIXA[x[2]]);st.q[q.id]=x;save(st);
  if(navigator.vibrate)navigator.vibrate(ok?30:[60,40,60]);rr();};
ACT.ptProx=()=>{const S=PTS;if(!S)return;if(S.i+1<S.qs.length){S.i++;rr();window.scrollTo(0,0);return;}ptFim();};
ACT.ptSair=()=>{const S=PTS;if(!S)return;const n=S.resp.filter(x=>x!=null).length;if(!n){PTS=null;rr();return;}confirmSheet("Sair do treino?",`Você respondeu ${n} de ${S.qs.length}. As respostas já ficaram salvas.`,"Sair",()=>ptFim());};
function ptFim(){const S=PTS;PTS=null;const R=S.qs.map((q,i)=>({q,r:S.resp[i]})).filter(x=>x.r!=null),ok=R.filter(x=>x.r===x.q.certa).length;
  if(R.length){const st=ptStat();st.hist=(st.hist||[]).concat([{d:TODAY(),n:R.length,ok}]).slice(-200);save(st);
    if(R.length>=10&&typeof TRK!=="undefined"&&TRK.conc){const id=tid("conc",TODAY()),ex=getD(id);if(!ex)save({id,c:"trk",k:"conc",d:TODAY(),t:"Dia de estudo",s:`Português: ${ok}/${R.length}`});}}
  rr();const err=R.filter(x=>x.r!==x.q.certa),reg={};err.forEach(x=>{reg[x.q.regra]=(reg[x.q.regra]||0)+1;});
  sheet(`<h2>${ok===R.length&&R.length?ic("trophy")+" Gabaritou!":"Resultado: "+ok+" de "+R.length}</h2>
   <div class="bar" style="margin:8px 0 14px"><i style="width:${R.length?ok/R.length*100:0}%"></i></div>
   ${Object.keys(reg).length?`<div class="small"><b>Onde você escorregou</b></div>`+Object.entries(reg).sort((a,b)=>b[1]-a[1]).map(([r,n])=>{const G=PT.REGRAS[r]||[r,"",""];return `<div class="card small" style="margin-top:8px"><b>${esc(G[0])}</b> <span class="chip n">${n} ${n===1?"erro":"erros"}</span><p style="margin:6px 0 0">${esc(G[1])}</p><p style="margin:6px 0 0"><b>Macete:</b> ${esc(G[2])}</p></div>`;}).join("")
     +`<p class="tiny muted" style="margin-top:10px">As questões erradas voltam no próximo treino inteligente, até você acertar com segurança.</p>`:`<p class="muted">Sem erros neste treino. As questões voltam em alguns dias para fixar.</p>`}
   <div class="btns"><button class="btn full" data-a="ptIniciar" data-m="inteligente">Mais 10 questões</button><button class="btn ghost full" data-a="close">Fechar</button></div>`);}
ACT.ptLicao=async el=>{await ptCarregar();const t=PT.TRILHA.find(x=>x.id===el.dataset.t);if(!t)return;
  sheet(`<h2>${esc(t.n)}</h2><div class="small ptlic">${esc(t.texto).replace(/\n/g,"<br>")}</div>
   <div class="sec" style="margin-top:16px"><h2>Regras e macetes</h2></div>${t.regras.map(r=>{const R=PT.REGRAS[r];return R?`<details class="card small" style="margin-bottom:8px"><summary><b>${esc(R[0])}</b></summary><p style="margin:8px 0 0">${esc(R[1])}</p><p style="margin:6px 0 0"><b>Macete:</b> ${esc(R[2])}</p></details>`:"";}).join("")}
   <div class="btns"><button class="btn full" data-a="ptIniciar" data-m="topico" data-t="${t.id}">${ic("play")} Praticar ${esc(t.n.toLowerCase())}</button></div>`);};
ACT.ptRegra=el=>{const R=PT.REGRAS[el.dataset.r];if(!R)return;const t=PT.TRILHA.find(x=>x.regras.includes(el.dataset.r));
  sheet(`<h2>${esc(R[0])}</h2><p>${esc(R[1])}</p><p><b>Macete:</b> ${esc(R[2])}</p><div class="btns">${t?`<button class="btn full" data-a="ptIniciar" data-m="topico" data-t="${t.id}">Praticar ${esc(t.n.toLowerCase())}</button>`:""}</div>`);};

/* atalho dentro de "Estudos p/ concurso" */
const _trkPort=VIEWS.trk;VIEWS.trk=function(){const h=_trkPort.apply(this,arguments);if(VIEW.k!=="conc")return h;
  return h.replace("</header>",`</header><button class="card ctac" style="margin-bottom:12px" ${mstyle("port")} data-a="go" data-v="${gv({v:"port"})}"><b>${ic("spell-check")} Português para concursos</b><span class="small muted">Trilha, ${"350+"} questões de porquês, crase e muito mais, com correção dos seus padrões de erro.</span></button>`);};
