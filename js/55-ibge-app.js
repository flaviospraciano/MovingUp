"use strict";
/* ======================================================================
   IBGE · RECENSEADOR · TELAS E JOGO (dentro de Estudos p/ concurso)
   ====================================================================== */
Object.assign(ICONS,{
  "arrow-right":'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  "swords":'<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/>',
  "layers":'<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  "file-json":'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1"/><path d="M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1"/>'
});
const IBGE_COR={TEC:"#0E7490",POR:"#7C3AED",MAT:"#EA580C"};
const IB_TOPS={TEC:IBGE_TOP_TEC,POR:IBGE_TOP_POR,MAT:IBGE_TOP_MAT};
const ibTodosTop=()=>[].concat(...Object.entries(IB_TOPS).map(([d,o])=>Object.keys(o).map(t=>[d,t])));
/* progresso salvo: r[id]=[tentativas, acertos, último 1/0] · er[id]=acertos seguidos no reforço */
const ibEst=()=>{const s=single("ibge",{r:{},er:{},xp:0,dia:{},conq:{},sims:[],cv:{},meta:30});["r","er","dia","conq","cv"].forEach(k=>s[k]=s[k]||{});s.sims=s.sims||[];s.meta=s.meta||30;return s;};
let IB_SALVA=null;const ibSalvar=s=>{clearTimeout(IB_SALVA);IB_SALVA=setTimeout(()=>save(s),400);};
/* níveis com nomes da carreira censitária */
const IB_NIV=[[1,"Candidato"],[3,"Inscrito no processo seletivo"],[5,"Recenseador em treinamento"],[8,"Recenseador"],[11,"Recenseador experiente"],[14,"Agente Censitário Supervisor"],[18,"Agente Censitário Regional"],[22,"Assistente Operacional Regional"],[26,"Analista Censitário"],[30,"Lenda do Censo"]];
const ibLimiar=n=>50*(n-1)*n;
function ibNivel(xp){let n=1;while(ibLimiar(n+1)<=xp)n++;const tit=IB_NIV.filter(x=>x[0]<=n).pop()[1];return{n,tit,de:ibLimiar(n),ate:ibLimiar(n+1),pc:Math.round((xp-ibLimiar(n))/(ibLimiar(n+1)-ibLimiar(n))*100)};}
const IB_CONQ=[["primeira","Primeiro passo","Respondeu a primeira questão","sparkles"],["c10","Em chamas","10 acertos seguidos","flame"],["c25","Imparável","25 acertos seguidos","zap"],["meta","Meta do dia","Bateu a meta diária","target"],["d7","Uma semana firme","7 dias seguidos estudando","calendar-days"],["q100","Centenário","100 questões respondidas","award"],["q500","Maratonista","500 questões respondidas","medal"],["q1000","Mil questões","1.000 questões respondidas","trophy"],["sim","Dia da prova","Concluiu um simulado completo","clipboard-check"],["sim42","Aprovado no treino","70% ou mais num simulado","trophy"],["zero","Caderno zerado","Resolveu todos os erros pendentes","circle-check"],["todos","Edital inteiro","Treinou todos os tópicos do edital","layers"],["cards","Teoria em dia","Leu todos os cards de estudo","book-open"],["escala","Mestre da escala","20 acertos em escalas e mapas","map-pin"]];
function ibConquista(s,k){if(s.conq[k])return;s.conq[k]=TODAY();const c=IB_CONQ.find(x=>x[0]===k);if(c){setTimeout(()=>toast(c[3],"Conquista: "+c[1],c[2]),600);try{navigator.vibrate&&navigator.vibrate([30,40,30,40,80]);}catch(e){}}}
const ibDia=(s,d=TODAY())=>s.dia[d]||(s.dia[d]={q:0,ac:0});
function ibSeq(s){let n=0,d=TODAY();if(!((s.dia[d]||{}).q>=10))d=addDays(d,-1);while((s.dia[d]||{}).q>=10&&n<999){n++;d=addDays(d,-1);}return n;}
function ibStatsTop(s,d,t){const B=ibBanco();const ids=B.ids.filter(id=>B.B[id].disc===d&&B.B[id].top===t);let fe=0,ac=0,ten=0;ids.forEach(id=>{const x=s.r[id];if(x){fe++;ten+=x[0];ac+=x[1];}});
  return{tot:ids.length,fe,ten,ac,pc:ten?Math.round(ac/ten*100):0,dom:fe>=Math.min(10,ids.length)&&ten&&ac/ten>=.6};}
function ibCobertura(s){const T=ibTodosTop();const dom=T.filter(([d,t])=>ibStatsTop(s,d,t).dom).length;return{dom,tot:T.length,pc:Math.round(dom/T.length*100)};}

/* ---------- PAINEL ---------- */
VIEWS.ibge=()=>{ibBanco();const s=ibEst(),nv=ibNivel(s.xp||0),hj=ibDia(s),seq=ibSeq(s),cob=ibCobertura(s);
  const R=Object.values(s.r),ten=sum(R.map(x=>x[0])),ac=sum(R.map(x=>x[1])),pc=ten?Math.round(ac/ten*100):0,cad=Object.keys(s.er).length;
  const meta=s.meta,mp=Math.min(100,Math.round(hj.q/meta*100));
  let h=topbar("IBGE · Recenseador","conc");
  h+=`<div class="ibhero"><div class="ibnv"><div class="ibring" style="--p:${mp}"><b>${hj.q}</b><span>/${meta}</span></div><div class="grow"><span class="tiny">Nível ${nv.n}</span><b class="ibtit">${esc(nv.tit)}</b>
      <div class="ibxp"><i style="width:${nv.pc}%"></i></div><span class="tiny">${nf(s.xp||0)} XP · faltam ${nf(nv.ate-(s.xp||0))} para o nível ${nv.n+1}</span></div></div>
    <div class="ibchips"><span>${ic("flame")} ${seq} ${seq===1?"dia":"dias"}</span><span>${ic("target")} meta ${hj.q>=meta?"batida ✓":hj.q+"/"+meta}</span><span>${ic("trophy")} ${Object.keys(s.conq).length}/${IB_CONQ.length}</span></div></div>`;
  h+=`<div class="card ibcob"><div class="row"><b class="grow">Cobertura do edital</b><b>${cob.pc}%</b></div><div class="ibxp" style="margin-top:8px"><i style="width:${cob.pc}%;background:var(--ok)"></i></div><span class="tiny muted">${cob.dom} de ${cob.tot} tópicos dominados (10 questões ou mais, com 60% de acerto)</span>
    <div class="ibmet"><div><b>${nf(R.length)}</b><span>questões feitas</span></div><div><b>${pc}%</b><span>de acerto</span></div><div><b>${cad}</b><span>no caderno de erros</span></div></div></div>`;
  h+=`<div class="ibmodos">
    <button class="ibmodo prim" data-a="ibIni" data-m="rapida">${ic("zap")}<b>Rodada rápida</b><span>10 questões · misturadas</span></button>
    <button class="ibmodo" data-a="ibSimNovo">${ic("clipboard-check")}<b>Simulado realista</b><span>60 questões · 4 horas</span></button>
    <button class="ibmodo" data-a="go" data-v="${gv({v:"ibgeTop",d:"TEC"})}">${ic("layers")}<b>Estudo por tópicos</b><span>escolha o assunto do edital</span></button>
    <button class="ibmodo ${cad?"alerta":""}" data-a="ibIni" data-m="reforco" ${cad?"":"disabled"}>${ic("rotate-ccw")}<b>Reforço diário</b><span>${cad?cad+" no caderno de erros":"nenhum erro pendente"}</span></button>
    <button class="ibmodo" data-a="ibZero" ${cad?"":"disabled"}>${ic("swords")}<b>Zero Erros</b><span>simulado só com seus erros</span></button>
    <button class="ibmodo" data-a="go" data-v="${gv({v:"ibgeCards",d:"TEC"})}">${ic("book-open")}<b>Cards de estudo</b><span>toda a teoria + pegadinhas</span></button></div>`;
  h+=`<div class="grp">Por disciplina</div>`+["TEC","POR","MAT"].map(d=>{const B=ibBanco().por[d];let fe=0,t2=0,a2=0;B.forEach(id=>{const x=s.r[id];if(x){fe++;t2+=x[0];a2+=x[1];}});const tops=Object.keys(IB_TOPS[d]);const dm=tops.filter(t=>ibStatsTop(s,d,t).dom).length;
    return `<button class="item ibdisc" style="--dc:${IBGE_COR[d]}" data-a="go" data-v="${gv({v:"ibgeTop",d})}"><span class="ibdi">${d==="TEC"?"30":"15"}<small>na prova</small></span><span class="ibody"><b>${IB_DISC[d]}</b><span class="tiny faint" style="display:block">${fe} de ${B.length} questões · ${t2?Math.round(a2/t2*100):0}% de acerto · ${dm}/${tops.length} tópicos</span><span class="ibxp" style="display:block;margin-top:6px"><i style="width:${Math.round(fe/B.length*100)}%;background:var(--dc)"></i></span></span>${ic("chevron-right")}</button>`;}).join("");
  if(s.sims.length)h+=`<div class="grp">Seus simulados</div><div class="card">${s.sims.slice(-5).reverse().map(x=>`<div class="row ibsimh"><span class="grow">${fdate(x.d)} · ${x.tipo==="zero"?"Zero Erros":"Simulado"}</span><span class="tiny muted">P ${x.por??"-"} · M ${x.mat??"-"} · T ${x.tec??"-"}</span><b class="${x.pc>=70?"pos":x.pc>=50?"":"neg"}">${x.nota}/${x.tot}</b></div>`).join("")}</div>`;
  h+=`<div class="grp">Conquistas</div><div class="ibconq">${IB_CONQ.map(c=>`<div class="${s.conq[c[0]]?"on":""}" title="${esc(c[2])}">${ic(c[3])}<b>${esc(c[1])}</b><span>${esc(c[2])}</span></div>`).join("")}</div>`;
  h+=`<div class="btns"><button class="btn ghost full" data-a="ibMeta">${ic("target")} Ajustar meta diária (${meta})</button><button class="btn ghost full" data-a="ibExport">${ic("file-json")} Baixar o banco de questões (JSON)</button></div>`;
  return `<div class="app">${h}</div>`;};
ACT.ibMeta=()=>{const s=ibEst();sheet(`<h2>Meta diária</h2><div class="seg" data-k="ibm">${[10,20,30,40,60].map(n=>`<button type="button" data-a="seg" data-v="${n}" aria-pressed="${s.meta===n}">${n}</button>`).join("")}</div><div class="btns"><button class="btn full" id="ibmOk">Salvar</button></div>`,sh=>{sh.querySelector("#ibmOk").onclick=()=>{s.meta=+segVal(sh,"ibm")||30;save(s);closeSheet();rr();};});};
ACT.ibExport=()=>{const blob=new Blob([JSON.stringify(ibJSON(),null,1)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="ibge-recenseador-2500-questoes.json";document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},2000);toast("file-json","Banco exportado","2.500 questões em JSON");};

/* ---------- TÓPICOS ---------- */
VIEWS.ibgeTop=()=>{const s=ibEst(),d=VIEW.d||"TEC";let h=topbar("Estudo por tópicos","conc");
  h+=`<div class="tabs ibtabs">${["TEC","POR","MAT"].map(x=>`<button data-a="ibAba" data-d="${x}" aria-pressed="${x===d}" style="--dc:${IBGE_COR[x]}">${IB_DISC[x]}</button>`).join("")}</div>`;
  h+=Object.entries(IB_TOPS[d]).map(([t,o])=>{const st=ibStatsTop(s,d,t);const nC=(d==="TEC"?IBGE_CARDS_TEC:d==="POR"?IBGE_CARDS_POR:IBGE_CARDS_MAT).filter(c=>c[0]===t).length;
    return `<div class="card ibtop ${st.dom?"dom":""}" style="--dc:${IBGE_COR[d]}"><div class="row"><b class="grow">${esc(o.n)}</b>${st.dom?`<span class="chip c">${ic("check")} dominado</span>`:""}</div>
      <span class="tiny faint">${st.fe}/${st.tot} questões · ${st.ten?st.pc+"% de acerto":"ainda não treinado"}</span><span class="ibxp" style="display:block;margin:6px 0 10px"><i style="width:${Math.round(st.fe/st.tot*100)}%;background:var(--dc)"></i></span>
      <div class="btns h" style="margin-top:0"><button class="btn sm" data-a="ibIni" data-m="topico" data-d="${d}" data-t="${t}">${ic("play")} Treinar</button>${nC?`<button class="btn ghost sm" data-a="go" data-v="${gv({v:"ibgeCards",d,t})}">${ic("book-open")} Teoria (${nC})</button>`:""}</div></div>`;}).join("");
  return `<div class="app">${h}</div>`;};
ACT.ibAba=el=>{VIEW.d=el.dataset.d;VIEW.t=null;rr();};

/* ---------- CARDS ---------- */
VIEWS.ibgeCards=()=>{const s=ibEst(),d=VIEW.d||"TEC";const L=d==="PEG"?IBGE_PEGA.map((c,i)=>["PEG",c[0],c[1],"peg"+i]):(d==="TEC"?IBGE_CARDS_TEC:d==="POR"?IBGE_CARDS_POR:IBGE_CARDS_MAT).map((c,i)=>[c[0],c[1],c[2],d+i]);
  const F=VIEW.t?L.filter(c=>c[0]===VIEW.t):L;const lidos=F.filter(c=>s.cv[c[3]]).length;
  let h=topbar("Cards de estudo","conc");
  h+=`<div class="tabs ibtabs">${[["TEC","Técnicos"],["POR","Português"],["MAT","Matemática"],["PEG","Pegadinhas"]].map(([x,n])=>`<button data-a="ibAbaC" data-d="${x}" aria-pressed="${x===d}" style="--dc:${IBGE_COR[x]||"#DC2626"}">${n}</button>`).join("")}</div>`;
  h+=`<div class="row" style="margin:4px 0 10px"><span class="small muted grow">${VIEW.t?esc(ibTopNome(VIEW.t)):"Todos os assuntos"}</span><b class="small">${lidos}/${F.length} lidos</b></div>`;
  h+=F.map(c=>`<details class="card ibcard ${s.cv[c[3]]?"lido":""}" style="--dc:${IBGE_COR[d]||"#DC2626"}"><summary><span class="ibct">${d==="PEG"?ic("triangle-alert"):ic("book-open")}</span><b class="grow">${esc(c[1])}</b>${s.cv[c[3]]?ic("check"):ic("chevron-down")}</summary>
     <div class="ibcx">${d!=="PEG"?`<span class="tiny faint">${esc(ibTopNome(c[0]))}</span>`:""}<p>${esc(c[2]).replace(/\n/g,"<br>")}</p>
     <div class="btns h" style="margin-top:8px">${s.cv[c[3]]?"":`<button class="btn sm" data-a="ibLido" data-c="${c[3]}">${ic("check")} Entendi (+5 XP)</button>`}${d!=="PEG"?`<button class="btn ghost sm" data-a="ibIni" data-m="topico" data-d="${d}" data-t="${c[0]}">${ic("play")} Treinar este assunto</button>`:""}</div></div></details>`).join("");
  return `<div class="app">${h}</div>`;};
ACT.ibAbaC=el=>{VIEW.d=el.dataset.d;VIEW.t=null;rr();};
ACT.ibLido=el=>{const s=ibEst();if(!s.cv[el.dataset.c]){s.cv[el.dataset.c]=1;s.xp=(s.xp||0)+5;}
  const tot=IBGE_CARDS_TEC.length+IBGE_CARDS_POR.length+IBGE_CARDS_MAT.length+IBGE_PEGA.length;if(Object.keys(s.cv).length>=tot)ibConquista(s,"cards");save(s);rr();};

/* ---------- SESSÕES ---------- */
let IBQ=null;
function ibEscolher(ids,n,s,r){/* prioriza nunca feitas, depois as erradas, depois as mais antigas */const nunca=ids.filter(id=>!s.r[id]),errou=ids.filter(id=>s.r[id]&&!s.r[id][2]),resto=ids.filter(id=>s.r[id]&&s.r[id][2]);
  return ibShuf(r,nunca).concat(ibShuf(r,errou),ibShuf(r,resto)).slice(0,n);}
ACT.ibIni=el=>{const m=el.dataset.m,s=ibEst(),B=ibBanco(),r=ibRng(Date.now()%2147483647);let fila=[],nome="";
  if(m==="rapida"){const cad=ibShuf(r,Object.keys(s.er)).slice(0,2);fila=cad.concat(ibEscolher(B.ids.filter(id=>!cad.includes(id)),10-cad.length,s,r));fila=ibShuf(r,fila);nome="Rodada rápida";}
  else if(m==="topico"){const d=el.dataset.d,t=el.dataset.t;fila=ibEscolher(B.ids.filter(id=>B.B[id].disc===d&&B.B[id].top===t),15,s,r);nome=ibTopNome(t);}
  else if(m==="reforco"){fila=ibShuf(r,Object.keys(s.er)).slice(0,20);nome="Reforço diário";}
  if(!fila.length)return toast("circle-check","Nada para treinar aqui","");
  IBQ={modo:m,nome,fila,i:0,n:0,ok:0,combo:0,max:0,xp:0,re:[],atual:null,resp:null,ref:false,errs:[],novasConq:[]};ibProx();go({v:"ibgeQ"});};
function ibProx(){const q=IBQ;q.resp=null;const due=q.re.findIndex(x=>x.due<=q.n);
  if(due>=0){q.atual=q.re.splice(due,1)[0].id;q.ref=true;return true;}
  if(q.i<q.fila.length){q.atual=q.fila[q.i++];q.ref=!!ibEst().er[q.atual]&&q.modo!=="reforco";return true;}
  if(q.re.length){/* acabou a fila, mas ainda há reforços: puxa o próximo */q.re.sort((a,b)=>a.due-b.due);q.atual=q.re.shift().id;q.ref=true;return true;}
  q.atual=null;return false;}
const ibTxt=t=>esc(t).replace(/\n/g,"<br>");
VIEWS.ibgeQ=()=>{const q=IBQ;if(!q)return `<div class="app">${topbar("IBGE","conc")}<p class="muted">Nenhuma sessão em andamento.</p></div>`;
  if(q.sim)return ibSimView();if(!q.atual)return ibFimView();
  const B=ibBanco().B,Q=B[q.atual],s=ibEst();const respondida=q.resp!=null;const total=q.fila.length;
  let h=`<header class="top ibqtop"><button class="ib" data-a="ibSair" aria-label="Sair da sessão">${ic("x")}</button><div class="grow"><div class="ibxp"><i style="width:${Math.min(100,Math.round(q.i/Math.max(1,total)*100))}%"></i></div><span class="tiny muted">${esc(q.nome)} · ${Math.min(q.i,total)}/${total}${q.re.length?` · ${q.re.length} em reforço`:""}</span></div>${q.combo>=2?`<span class="ibcombo">${ic("flame")} ${q.combo}</span>`:""}<span class="ibxpq">+${q.xp} XP</span></header>`;
  h+=`<div class="ibq" style="--dc:${IBGE_COR[Q.disc]}"><div class="ibqmeta"><span class="chip" style="color:var(--dc)">${IB_DISC[Q.disc]}</span><span class="chip">${esc(ibTopNome(Q.top))}</span><span class="chip">${Q.dif}</span>${q.ref?`<span class="chip ibref">${ic("rotate-ccw")} reforço</span>`:""}</div>
    <p class="iben">${ibTxt(Q.en)}</p><div class="ibalts">${Q.alt.map((t,i)=>{const cls=!respondida?"":i===Q.ok?"ok":i===q.resp?"err":"apaga";
      return `<button class="ibalt ${cls}" data-a="ibResp" data-i="${i}" ${respondida?"disabled":""}><span class="ibl">${LET[i]}</span><span class="grow">${ibTxt(t)}</span>${respondida&&i===Q.ok?ic("check"):respondida&&i===q.resp?ic("x"):""}</button>`;}).join("")}</div>`;
  if(respondida){const certo=q.resp===Q.ok;
    h+=certo?`<div class="ibfb ok">${ic("circle-check")}<div><b>${ibElogio(q.combo)}</b>${q.ganho?`<span>+${q.ganho} XP${q.combo>=3?` · combo ${q.combo}`:""}</span>`:""}</div></div>`
      :`<div class="ibfb err">${ic("lightbulb")}<div><b>Pílula de reforço</b><span>${ibTxt(Q.dica)}</span><span class="tiny" style="margin-top:6px;display:block;opacity:.85">Esta questão volta daqui a algumas questões. Acerte 2 vezes seguidas para tirá-la do caderno de erros.</span></div></div>`;
    h+=`<details class="card ibgab" ${certo?"":"open"}><summary><b>${ic("list-checks")} Gabarito comentado</b></summary><p>${ibTxt(Q.com)}</p></details>`;
    h+=`<div class="btns"><button class="btn full ibnext" data-a="ibNext">${ic("arrow-right")} ${q.i>=total&&!q.re.length?"Ver resultado":"Próxima"}</button>${certo?"":`<button class="btn ghost full" data-a="go" data-v="${gv({v:"ibgeCards",d:Q.disc,t:Q.top})}">${ic("book-open")} Revisar a teoria deste tópico</button>`}</div>`;}
  h+=`</div>`;return `<div class="app ibapp">${h}</div>`;};
const ibElogio=c=>c>=10?"Imparável! 🔥":c>=5?"Sequência de ouro!":c>=3?"Mandou bem, combo!":["Isso!","Correto!","Na mosca!","Boa!","Exato!"][c%5];
ACT.ibResp=el=>{const q=IBQ;if(!q||q.resp!=null)return;const i=+el.dataset.i,B=ibBanco().B,Q=B[q.atual],s=ibEst(),certo=i===Q.ok;q.resp=i;q.n++;
  const reg=s.r[Q.id]||[0,0,0];reg[0]++;if(certo)reg[1]++;reg[2]=certo?1:0;s.r[Q.id]=reg;const dd=ibDia(s);dd.q++;if(certo)dd.ac++;
  let ganho=0;
  if(certo){q.ok++;q.combo++;q.max=Math.max(q.max,q.combo);ganho={"Fácil":8,"Médio":10,"Difícil":14}[Q.dif]||10;if(q.combo>=3)ganho+=2*Math.min(q.combo,10);
    if(s.er[Q.id]!=null){s.er[Q.id]++;if(s.er[Q.id]>=2){delete s.er[Q.id];ganho+=15;setTimeout(()=>toast("circle-check","Saiu do caderno de erros","Acertou 2 vezes seguidas. +15 XP"),300);if(!Object.keys(s.er).length&&Object.keys(s.r).length>=20)ibConquista(s,"zero");}
      else q.re.push({id:Q.id,due:q.n+ibInt(Math.random,5,8)});}
    try{navigator.vibrate&&navigator.vibrate(20);}catch(e){}}
  else{q.combo=0;ganho=1;s.er[Q.id]=0;q.errs.push(Q.id);q.re=q.re.filter(x=>x.id!==Q.id);q.re.push({id:Q.id,due:q.n+ibInt(Math.random,5,8)});try{navigator.vibrate&&navigator.vibrate([60,40,60]);}catch(e){}}
  const nvA=ibNivel(s.xp||0).n;s.xp=(s.xp||0)+ganho;q.xp+=ganho;q.ganho=ganho;const nvB=ibNivel(s.xp);
  if(nvB.n>nvA)setTimeout(()=>toast("trophy","Subiu para o nível "+nvB.n,nvB.tit),400);
  /* conquistas */
  const tot=Object.keys(s.r).length;ibConquista(s,"primeira");if(q.combo>=10)ibConquista(s,"c10");if(q.combo>=25)ibConquista(s,"c25");
  if(tot>=100)ibConquista(s,"q100");if(tot>=500)ibConquista(s,"q500");if(tot>=1000)ibConquista(s,"q1000");
  if(dd.q===s.meta){s.xp+=50;setTimeout(()=>toast("target","Meta do dia batida!","+50 XP de bônus"),700);ibConquista(s,"meta");}
  if(ibSeq(s)>=7)ibConquista(s,"d7");
  if(ibTodosTop().every(([d,t])=>ibStatsTop(s,d,t).fe>0))ibConquista(s,"todos");
  const esc_=ibBanco().ids.filter(id=>{const x=ibBanco().B[id];return(x.top==="T06"||x.top==="M10")&&s.r[id]&&s.r[id][1];}).length;if(esc_>=20)ibConquista(s,"escala");
  /* estudar pelo IBGE marca o Check "Estudo" do dia */
  if(dd.q===10){const id=tid("conc",TODAY());if(!getD(id))save({id,c:"trk",k:"conc",d:TODAY(),t:"Dia de estudo",s:"Questões do IBGE"});}
  ibSalvar(s);rr();setTimeout(()=>{const f=document.querySelector(".ibfb");if(f)f.scrollIntoView({behavior:"smooth",block:"nearest"});},60);};
ACT.ibNext=()=>{if(!IBQ)return;ibProx();rr();window.scrollTo(0,0);};
ACT.ibSair=()=>{if(IBQ&&IBQ.sim&&!IBQ.sim.fim){confirmSheet("Sair do simulado?","As respostas marcadas serão perdidas.","Sair",()=>{IBQ=null;back();});return;}if(IBQ&&IBQ.n&&IBQ.atual){IBQ.atual=null;rr();return;}IBQ=null;back();};
function ibFimView(){const q=IBQ,s=ibEst();const pc=q.n?Math.round(q.ok/q.n*100):0;const nv=ibNivel(s.xp||0);
  let h=topbar("Resultado","conc");
  h+=`<div class="ibres"><div class="ibbig ${pc>=70?"pos":pc>=50?"":"neg"}">${pc}%</div><b>${pc>=90?"Espetacular!":pc>=70?"Muito bom!":pc>=50?"Bom treino!":"Treino é treino. Bora de novo!"}</b><span class="muted small">${q.ok} de ${q.n} acertos · combo máximo ${q.max}</span>
    <div class="ibmet"><div><b>+${q.xp}</b><span>XP</span></div><div><b>${nv.n}</b><span>nível</span></div><div><b>${Object.keys(s.er).length}</b><span>no caderno</span></div></div></div>`;
  if(q.errs.length)h+=`<div class="note">${ic("rotate-ccw")} ${q.errs.length} ${q.errs.length===1?"questão foi":"questões foram"} para o caderno de erros. Elas voltam no Reforço diário até você acertar 2 vezes seguidas.</div>`;
  h+=`<div class="btns"><button class="btn full" data-a="ibIni" data-m="rapida">${ic("zap")} Mais uma rodada</button>${Object.keys(s.er).length?`<button class="btn ghost full" data-a="ibIni" data-m="reforco">${ic("rotate-ccw")} Reforçar os erros</button>`:""}<button class="btn ghost full" data-a="ibPainel">Voltar ao painel</button></div>`;
  return `<div class="app">${h}</div>`;}
ACT.ibPainel=()=>{IBQ=null;STACK=STACK.filter(v=>v.v!=="ibgeQ");VIEW={v:"ibge"};rr();};

/* ---------- SIMULADO ---------- */
ACT.ibSimNovo=()=>{sheet(`<h2>${ic("clipboard-check")} Simulado realista</h2><p class="muted">Como no dia da prova: 15 de Língua Portuguesa, 15 de Matemática e 30 de Conhecimentos Técnicos, com 4 horas de cronômetro. O gabarito aparece só no final.</p>
  <div class="btns"><button class="btn full" data-a="ibSimIni">${ic("play")} Começar agora</button><button class="btn ghost full" data-a="close">Agora não</button></div>`);};
function ibSimMontar(ids,min,tipo){const r=ibRng(Date.now()%2147483647);IBQ={sim:{ids,resp:{},i:0,ini:Date.now(),dur:min*60000,tipo,fim:null},nome:tipo==="zero"?"Zero Erros":"Simulado"};closeSheet();go({v:"ibgeQ"});}
ACT.ibSimIni=()=>{const s=ibEst(),B=ibBanco(),r=ibRng(Date.now()%2147483647);const P=ibEscolher(B.por.POR,15,s,r),M=ibEscolher(B.por.MAT,15,s,r),T=ibEscolher(B.por.TEC,30,s,r);ibSimMontar(P.concat(M,T),240,"real");};
ACT.ibZero=()=>{const s=ibEst();const L=ibShuf(ibRng(Date.now()%2147483647),Object.keys(s.er)).slice(0,30);if(!L.length)return toast("circle-check","Sem erros pendentes","");ibSimMontar(L,Math.max(10,L.length*4),"zero");};
const ibTempo=ms=>{ms=Math.max(0,ms);const h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000),s=Math.floor(ms%60000/1000);return `${h}:${pad(m)}:${pad(s)}`;};
function ibSimView(){const S=IBQ.sim,B=ibBanco().B;if(S.fim)return ibSimRes();const id=S.ids[S.i],Q=B[id],resta=S.ini+S.dur-Date.now();
  if(resta<=0){ibSimFim();return ibSimRes();}
  let h=`<header class="top ibqtop"><button class="ib" data-a="ibSair" aria-label="Sair">${ic("x")}</button><div class="grow"><span class="tiny muted">${IBQ.nome} · questão ${S.i+1} de ${S.ids.length} · ${Object.keys(S.resp).length} respondidas</span></div><span class="ibtimer" id="ibTimer">${ic("timer")} ${ibTempo(resta)}</span></header>`;
  h+=`<div class="ibq" style="--dc:${IBGE_COR[Q.disc]}"><div class="ibqmeta"><span class="chip" style="color:var(--dc)">${IB_DISC[Q.disc]}</span></div><p class="iben">${ibTxt(Q.en)}</p>
    <div class="ibalts">${Q.alt.map((t,i)=>`<button class="ibalt ${S.resp[id]===i?"marc":""}" data-a="ibSimMarca" data-i="${i}"><span class="ibl">${LET[i]}</span><span class="grow">${ibTxt(t)}</span></button>`).join("")}</div>
    <div class="btns h"><button class="btn ghost" data-a="ibSimNav" data-d="-1" ${S.i?"":"disabled"}>${ic("chevron-left")} Anterior</button><button class="btn" data-a="ibSimNav" data-d="1">${S.i<S.ids.length-1?"Próxima "+ic("chevron-right"):"Revisar"}</button></div>
    <details class="card ibgrade"><summary><b>Ir para a questão</b></summary><div class="ibgr">${S.ids.map((x,k)=>`<button class="${S.resp[x]!=null?"on":""} ${k===S.i?"at":""}" data-a="ibSimIr" data-k="${k}">${k+1}</button>`).join("")}</div></details>
    <button class="btn danger full" style="margin-top:12px" data-a="ibSimEntregar">${ic("flag")} Entregar a prova</button></div>`;
  return `<div class="app ibapp">${h}</div>`;}
ACT.ibSimMarca=el=>{const S=IBQ.sim;S.resp[S.ids[S.i]]=+el.dataset.i;if(S.i<S.ids.length-1)setTimeout(()=>{S.i++;rr();window.scrollTo(0,0);},180);rr();};
ACT.ibSimNav=el=>{const S=IBQ.sim;S.i=Math.max(0,Math.min(S.ids.length-1,S.i+ +el.dataset.d));rr();window.scrollTo(0,0);};
ACT.ibSimIr=el=>{IBQ.sim.i=+el.dataset.k;rr();window.scrollTo(0,0);};
ACT.ibSimEntregar=()=>{const S=IBQ.sim,f=S.ids.length-Object.keys(S.resp).length;confirmSheet("Entregar a prova?",f?`Ainda há ${f} questões sem resposta.`:"Todas as questões foram respondidas.","Entregar",()=>{ibSimFim();rr();window.scrollTo(0,0);});};
function ibSimFim(){const S=IBQ.sim,B=ibBanco().B,s=ibEst();S.fim=Date.now();const por={TEC:[0,0],POR:[0,0],MAT:[0,0]};let xp=0;
  S.ids.forEach(id=>{const Q=B[id],r=S.resp[id],ok=r===Q.ok;por[Q.disc][1]++;if(ok)por[Q.disc][0]++;
    if(r!=null){const reg=s.r[id]||[0,0,0];reg[0]++;if(ok)reg[1]++;reg[2]=ok?1:0;s.r[id]=reg;const dd=ibDia(s);dd.q++;if(ok)dd.ac++;}
    if(ok){xp+=10;if(s.er[id]!=null){s.er[id]++;if(s.er[id]>=2)delete s.er[id];}}else if(r!=null){s.er[id]=0;}});
  const nota=por.TEC[0]+por.POR[0]+por.MAT[0],tot=S.ids.length,pc=Math.round(nota/tot*100);s.xp=(s.xp||0)+xp+(S.tipo==="real"?100:30);
  s.sims.push({d:TODAY(),tipo:S.tipo,nota,tot,pc,tec:por.TEC[1]?por.TEC[0]:null,por:por.POR[1]?por.POR[0]:null,mat:por.MAT[1]?por.MAT[0]:null,min:Math.round((S.fim-S.ini)/60000)});
  if(S.tipo==="real"){ibConquista(s,"sim");if(pc>=70)ibConquista(s,"sim42");}if(!Object.keys(s.er).length)ibConquista(s,"zero");
  S.por=por;S.xp=xp+(S.tipo==="real"?100:30);save(s);}
function ibSimRes(){const S=IBQ.sim,B=ibBanco().B;const por=S.por;const nota=por.TEC[0]+por.POR[0]+por.MAT[0],tot=S.ids.length,pc=Math.round(nota/tot*100);
  let h=topbar(IBQ.nome+": resultado","conc");
  h+=`<div class="ibres"><div class="ibbig ${pc>=70?"pos":pc>=50?"":"neg"}">${nota}<small>/${tot}</small></div><b>${pc}% de acerto</b><span class="muted small">Tempo: ${ibTempo(S.fim-S.ini)} · +${S.xp} XP</span>
    <div class="ibmet">${["POR","MAT","TEC"].filter(d=>por[d][1]).map(d=>`<div><b>${por[d][0]}/${por[d][1]}</b><span>${IB_DISC[d]}</span></div>`).join("")}</div></div>`;
  const erros=S.ids.filter(id=>S.resp[id]!=null&&S.resp[id]!==B[id].ok),brancos=S.ids.filter(id=>S.resp[id]==null).length;
  if(erros.length||brancos)h+=`<div class="note">${ic("rotate-ccw")} ${erros.length} ${erros.length===1?"questão errada foi":"questões erradas foram"} para o caderno de erros.${brancos?` ${brancos} ficaram em branco (contam como erro na nota).`:""}</div>`;
  h+=`<div class="grp">Gabarito comentado</div>`+S.ids.map((id,k)=>{const Q=B[id],r=S.resp[id],ok=r===Q.ok;
    return `<details class="card ibgab ${ok?"":"errou"}"><summary><span class="ibnum ${ok?"ok":"err"}">${k+1}</span><span class="grow small">${esc(Q.en.split("\n").pop().slice(0,90))}${Q.en.length>90?"…":""}</span><b class="tiny">${r!=null?LET[r]:"–"} / ${LET[Q.ok]}</b></summary>
      <p class="iben">${ibTxt(Q.en)}</p>${Q.alt.map((t,i)=>`<div class="ibalt mini ${i===Q.ok?"ok":i===r?"err":"apaga"}"><span class="ibl">${LET[i]}</span><span class="grow">${ibTxt(t)}</span></div>`).join("")}
      ${ok?"":`<div class="ibfb err" style="margin-top:8px">${ic("lightbulb")}<div><b>Pílula de reforço</b><span>${ibTxt(Q.dica)}</span></div></div>`}<p class="small" style="margin-top:8px">${ibTxt(Q.com)}</p></details>`;}).join("");
  h+=`<div class="btns"><button class="btn full" data-a="ibPainel">Voltar ao painel</button>${erros.length?`<button class="btn ghost full" data-a="ibIni" data-m="reforco">${ic("rotate-ccw")} Reforçar os erros agora</button>`:""}</div>`;
  return `<div class="app">${h}</div>`;}
/* relógio do simulado */
setInterval(()=>{if(!IBQ||!IBQ.sim||IBQ.sim.fim||VIEW.v!=="ibgeQ")return;const t=$("ibTimer");const resta=IBQ.sim.ini+IBQ.sim.dur-Date.now();
  if(resta<=0){ibSimFim();rr();toast("timer","Tempo esgotado","A prova foi entregue automaticamente.");return;}if(t)t.innerHTML=`${ic("timer")} ${ibTempo(resta)}`;},1000);

/* ---------- entrada no módulo Estudos p/ concurso ---------- */
const _trkIb=VIEWS.trk;VIEWS.trk=function(){const h=_trkIb.apply(this,arguments);if(VIEW.k!=="conc")return h;const s=ibEst(),nv=ibNivel(s.xp||0),hj=ibDia(s),cad=Object.keys(s.er).length;
  const card=`<button class="ibent" data-a="go" data-v="${gv({v:"ibge"})}"><span class="ibent-i">${ic("clipboard-check")}</span><span class="grow"><b>IBGE · Recenseador</b><span class="tiny" style="display:block">12º Censo Agro · 2.500 questões · simulados · cards</span>
    <span class="ibent-c"><span>Nível ${nv.n}</span><span>${hj.q}/${s.meta} hoje</span>${cad?`<span>${cad} erros p/ revisar</span>`:""}</span></span>${ic("chevron-right")}</button>`;
  return h.replace("</header>","</header>"+card);};
/* Jarvis: "treinar IBGE" */
try{const _rIb=rotaNova;rotaNova=function(txt){const n=normTxt(txt);if(/(ibge|recenseador|censo agro)/.test(n)&&/(treinar|estudar|questoes|questao|simulado|rodada|abrir)/.test(n)){closeSheet();if(/simulado/.test(n)){go({v:"ibge"});setTimeout(()=>ACT.ibSimNovo(),150);}else go({v:"ibge"});return true;}return _rIb(txt);};}catch(e){}
