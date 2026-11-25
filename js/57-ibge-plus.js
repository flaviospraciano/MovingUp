"use strict";
/* ======================================================================
   IBGE · RECENSEADOR · ESPAÇO DE ESTUDO COMPLETO
   1. Trilha do Recenseador: 38 unidades (aprender o card → praticar 8 → estrelas → libera a próxima)
   2. Revisão do dia: repetição espaçada de longo prazo (1, 3, 7, 16 e 35 dias)
   3. Relâmpago V ou F: afirmações da apostila em sequência rápida
   4. Missão do dia, pontos fracos e diagnóstico do simulado
   5. Simulado que continua de onde parou (mesmo fechando o app)
   6. 20 questões de concurso no dia (IBGE + Português para concursos) marcam o hábito
   ====================================================================== */
Object.assign(ICONS,{
  "dices":'<rect width="12" height="12" x="2" y="10" rx="2" ry="2"/><path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6"/><path d="M6 18h.01"/><path d="M10 14h.01"/><path d="M15 6h.01"/><path d="M18 9h.01"/>',
  "route":'<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
  "lock":'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  "brain-circuit":'<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a4.5 4.5 0 0 0 3-4"/><path d="M12 13h4"/><path d="M12 18h6a2 2 0 0 1 2 2v1"/><path d="M12 8h8"/><path d="M16 8V5a2 2 0 0 1 2-2"/><circle cx="16" cy="13" r=".5"/><circle cx="18" cy="3" r=".5"/><circle cx="20" cy="21" r=".5"/><circle cx="20" cy="8" r=".5"/>'
});
IB_CONQ.push(["trilha5","Pegando o ritmo","5 unidades da trilha concluídas","route"],["trilha","Trilha completa","Todas as 38 unidades da trilha","trophy"],["vf","Relâmpago perfeito","20 de 20 no V ou F","zap"],["revisao","Memória de elefante","50 revisões espaçadas acertadas","brain-circuit"],["missao","Missão cumprida","Completou a missão do dia","target"]);

/* ---------- 6. contador de questões de concurso e hábito ---------- */
HAB_AUTO.q20={re:/quest/,nome:"20 questões de concurso"};
function concAdd(n){let c=DB.docs.get("concq");if(!c)c=single("concq",{d:{}});c.d=c.d||{};const t=TODAY();c.d[t]=(c.d[t]||0)+n;save(c);if(c.d[t]>=20&&c.d[t]-n<20)habAuto("q20",t);}
const concHoje=()=>((single("concq",{d:{}}).d||{})[TODAY()]||0);
try{const _ptResp57=ACT.ptResp;ACT.ptResp=el=>{const antes=PTS&&PTS.resp?PTS.resp[PTS.i]:undefined;_ptResp57(el);if(antes==null&&PTS&&PTS.resp&&PTS.resp[PTS.i]!=null)concAdd(1);};}catch(e){}

/* ---------- 1. TRILHA ---------- */
const IB_TRILHA=["T01","T02","P02","M01","T03","T04","P05","M02","T05","T06","P06","M07","T07","T08","P03","M03","T09","T10","P08","M04","T11","T12","P09","M05","T13","T14","P07","M06","T15","T16","P10","M08","P11","P12","M09","P01","P04","M10"];
const ibDiscDe=t=>t[0]==="T"?"TEC":t[0]==="P"?"POR":"MAT";
const ibCardsDe=t=>IBGE_CARDS_TEC.concat(IBGE_CARDS_POR,IBGE_CARDS_MAT).filter(c=>c[0]===t);
const ibLiberada=(s,k)=>k===0||(s.tr[IB_TRILHA[k-1]]||0)>=1;
const ibProxUnidade=s=>{const k=IB_TRILHA.findIndex(t=>!(s.tr[t]>=1));return k<0?null:k;};
const estrelas=n=>[1,2,3].map(i=>`<span class="ibst ${i<=n?"on":""}">★</span>`).join("");
VIEWS.ibgeTrilha=()=>{const s=ibEst(),prox=ibProxUnidade(s);const feitas=IB_TRILHA.filter(t=>s.tr[t]>=1).length,est=sum(IB_TRILHA.map(t=>s.tr[t]||0));
  let h=topbar("Trilha do Recenseador","conc");
  h+=`<div class="card ibtrh"><div class="row"><b class="grow">${feitas} de ${IB_TRILHA.length} unidades</b><span class="ibstx">★ ${est}/${IB_TRILHA.length*3}</span></div><div class="ibxp" style="margin-top:8px"><i style="width:${Math.round(feitas/IB_TRILHA.length*100)}%"></i></div>
    <span class="tiny muted">Cada unidade: leia a teoria e acerte pelo menos 6 de 8 na primeira tentativa para ganhar estrela e liberar a próxima.</span></div>`;
  h+=`<div class="ibtrilha">`+IB_TRILHA.map((t,k)=>{const d=ibDiscDe(t),st=s.tr[t]||0,lib=ibLiberada(s,k),atual=k===prox;
    return `<button class="ibun ${st?"feita":""} ${atual?"atual":""} ${lib?"":"bloq"}" style="--dc:${IBGE_COR[d]};--x:${[0,1,2,1][k%4]}" data-a="ibUnid" data-k="${k}"><span class="ibun-n">${lib?(st?ic("check"):k+1):ic("lock")}</span><span class="ibun-t"><b>${esc(ibTopNome(t))}</b><span class="tiny">${IB_DISC[d]}</span>${st?`<span class="ibun-s">${estrelas(st)}</span>`:atual?`<span class="ibun-go">Começar</span>`:""}</span></button>`;}).join("")+`</div>`;
  return `<div class="app">${h}</div>`;};
ACT.ibUnid=el=>{const k=+el.dataset.k,s=ibEst(),t=IB_TRILHA[k];if(!ibLiberada(s,k))return toast("lock","Unidade bloqueada","Ganhe pelo menos 1 estrela na unidade anterior.");
  const C=ibCardsDe(t),T=IB_TOPS[ibDiscDe(t)][t];
  sheet(`<div class="ibunh" style="--dc:${IBGE_COR[ibDiscDe(t)]}"><span class="tiny">Unidade ${k+1} · ${IB_DISC[ibDiscDe(t)]}</span><h2 style="margin:2px 0 0">${esc(T.n)}</h2>${s.tr[t]?`<div style="margin-top:4px">${estrelas(s.tr[t])}</div>`:""}</div>
   <div class="grp" style="margin-top:12px">${ic("book-open")} 1. Aprenda</div>${C.map(c=>`<div class="card ibcx"><b>${esc(c[1])}</b><p>${esc(c[2]).replace(/\n/g,"<br>")}</p></div>`).join("")||""}
   ${C.length?"":`<div class="note">${ic("lightbulb")} ${esc(T.d)}</div>`}
   <div class="grp" style="margin-top:12px">${ic("swords")} 2. Pratique</div><p class="small muted" style="margin:0">8 questões deste assunto. 6 acertos de primeira = ★, 7 = ★★, 8 = ★★★.</p>
   <div class="btns"><button class="btn full" data-a="ibIni" data-m="unidade" data-t="${t}" data-k="${k}">${ic("play")} Praticar agora</button><button class="btn ghost full" data-a="close">Depois</button></div>`);};

/* ---------- novos modos de sessão ---------- */
const ibDue=s=>Object.keys(s.r).filter(id=>(s.r[id][3]||0)>0&&s.r[id][4]&&s.r[id][4]<=TODAY()).sort((a,b)=>s.r[a][4].localeCompare(s.r[b][4]));
const _ibIni57=ACT.ibIni;
ACT.ibIni=el=>{const m=el.dataset.m;if(m!=="unidade"&&m!=="revisao")return _ibIni57(el);closeSheet();const s=ibEst(),B=ibBanco(),r=ibRng(Date.now()%2147483647);let fila,nome;
  if(m==="unidade"){const t=el.dataset.t;fila=ibEscolher(B.top[t]||[],8,s,r);nome="Unidade "+(+el.dataset.k+1)+" · "+ibTopNome(t);}
  else{fila=ibDue(s).slice(0,25);nome="Revisão do dia";if(!fila.length)return toast("circle-check","Nada para revisar hoje","Volte amanhã: as próximas revisões já estão agendadas.");}
  IBQ={modo:m,nome,fila,i:0,n:0,ok:0,combo:0,max:0,xp:0,re:[],atual:null,resp:null,ref:false,errs:[],novasConq:[],vistas:{},prim:0,primOk:0,top:el.dataset.t||"",k:+el.dataset.k||0,chute:false};
  ibProx();go({v:"ibgeQ"});};
/* revisão acertada conta para a conquista */
const _ibResp57=ACT.ibResp;ACT.ibResp=el=>{const q=IBQ;const era=q&&q.modo==="revisao";_ibResp57(el);if(era&&q.resp===ibBanco().B[q.atual].ok){const s=ibEst();s.revOk=(s.revOk||0)+1;if(s.revOk>=50)ibConquista(s,"revisao");ibSalvar(s);}};
/* fim da unidade: estrelas */
const _ibFim57=ibFimView;
ibFimView=function(){const q=IBQ;if(q.modo!=="unidade")return _ibFim57();const s=ibEst();const pr=q.primOk,tot=q.prim||q.fila.length;
  const st=pr>=8?3:pr>=7?2:pr>=6?1:0;const t=q.top;const antes=s.tr[t]||0;
  if(!q.gravou){q.gravou=1;if(st>antes){s.tr[t]=st;s.xp=(s.xp||0)+(st-antes)*20;}s.trDia=s.trDia||{};if(st)s.trDia[TODAY()]=1;
    const f=IB_TRILHA.filter(x=>s.tr[x]>=1).length;if(f>=5)ibConquista(s,"trilha5");if(f>=IB_TRILHA.length)ibConquista(s,"trilha");save(s);}
  const k=q.k,prox=k+1<IB_TRILHA.length&&ibLiberada(s,k+1)?k+1:null;
  let h=topbar("Unidade "+(k+1),"conc");
  h+=`<div class="ibres"><div class="ibstars">${estrelas(st)}</div><b>${st===3?"Perfeito!":st===2?"Muito bem!":st===1?"Unidade concluída!":"Quase lá!"}</b><span class="muted small">${pr} de ${tot} certas de primeira${st<3?` · ${st?"refaça para mais estrelas":"precisa de 6 para liberar a próxima"}`:""}</span>
    <div class="ibmet"><div><b>+${q.xp+(st>antes?(st-antes)*20:0)}</b><span>XP</span></div><div><b>${q.max}</b><span>combo máx.</span></div><div><b>${q.errs.length}</b><span>para o caderno</span></div></div></div>`;
  h+=`<div class="btns">${prox!=null?`<button class="btn full" data-a="ibUnid" data-k="${prox}">${ic("route")} Próxima unidade: ${esc(ibTopNome(IB_TRILHA[prox]))}</button>`:""}
    ${st<3?`<button class="btn ${prox!=null?"ghost":""} full" data-a="ibIni" data-m="unidade" data-t="${t}" data-k="${k}">${ic("rotate-ccw")} Refazer a unidade</button>`:""}
    <button class="btn ghost full" data-a="ibIrTrilha">Ver a trilha</button></div>`;
  return `<div class="app">${h}</div>`;};
ACT.ibIrTrilha=()=>{IBQ=null;STACK=STACK.filter(v=>v.v!=="ibgeQ");VIEW={v:"ibgeTrilha"};rr();};

/* ---------- 3. RELÂMPAGO V OU F ---------- */
let IBVF=null;
ACT.ibVF=()=>{const s=ibEst();s.vf=s.vf||{};const r=ibRng(Date.now()%2147483647);
  /* prioriza afirmações que você errou e as que nunca viu */
  const idx=IBGE_FATOS.map((f,i)=>i);const pes=i=>{const x=s.vf[i];return !x?2:x[1]<x[0]?3:x[0]>=3?0.3:1;};
  const L=ibShuf(r,idx).sort((a,b)=>pes(b)-pes(a)+(r()-.5)).slice(0,20).map(i=>{const f=IBGE_FATOS[i],v=r()<.5;return{i,v,t:v?f[2]:ibPick(r,f[3])};});
  IBVF={L,k:0,ok:0,combo:0,max:0,xp:0,resp:null};go({v:"ibgeVF"});};
VIEWS.ibgeVF=()=>{const V=IBVF;if(!V)return `<div class="app">${topbar("V ou F","conc")}</div>`;
  if(V.k>=V.L.length){const s=ibEst();if(!V.fim){V.fim=1;s.xp=(s.xp||0)+V.xp;s.vfDia=s.vfDia||{};s.vfDia[TODAY()]=1;if(V.ok===V.L.length)ibConquista(s,"vf");save(s);}
    return `<div class="app">${topbar("Relâmpago V ou F","conc")}<div class="ibres"><div class="ibbig ${V.ok>=16?"pos":V.ok>=12?"":"neg"}">${V.ok}<small>/${V.L.length}</small></div><b>${V.ok===20?"Perfeito!":V.ok>=16?"Afiado!":V.ok>=12?"Bom!":"Continue treinando!"}</b><span class="muted small">+${V.xp} XP · combo máximo ${V.max}</span></div>
      <div class="btns"><button class="btn full" data-a="ibVF">${ic("zap")} Outra rodada</button><button class="btn ghost full" data-a="ibPainel">Voltar ao painel</button></div></div>`;}
  const it=V.L[V.k],f=IBGE_FATOS[it.i],resp=V.resp!=null;const certo=resp&&V.resp===it.v;
  let h=`<header class="top ibqtop"><button class="ib" data-a="ibPainel" aria-label="Sair">${ic("x")}</button><div class="grow"><div class="ibxp"><i style="width:${Math.round(V.k/V.L.length*100)}%"></i></div><span class="tiny muted">Relâmpago V ou F · ${V.k+1}/${V.L.length}</span></div>${V.combo>=2?`<span class="ibcombo">${ic("flame")} ${V.combo}</span>`:""}<span class="ibxpq">+${V.xp} XP</span></header>`;
  h+=`<div class="ibvf"><span class="chip">${esc(ibTopNome(f[0]))}</span><p class="ibvft">${esc(it.t)}</p>
    <div class="ibvfb"><button class="ibvfv ${resp?(it.v?"ok":V.resp===true?"err":"apaga"):""}" data-a="ibVFr" data-v="1" ${resp?"disabled":""}>${ic("check")} Verdadeiro</button><button class="ibvff ${resp?(!it.v?"ok":V.resp===false?"err":"apaga"):""}" data-a="ibVFr" data-v="0" ${resp?"disabled":""}>${ic("x")} Falso</button></div>`;
  if(resp)h+=`<div class="ibfb ${certo?"ok":"err"}">${ic(certo?"circle-check":"lightbulb")}<div><b>${certo?ibElogio(V.combo):"Era "+(it.v?"verdadeira":"falsa")}</b>${it.v?"":`<span><b style="display:inline;font-size:.9rem">O correto:</b> ${esc(f[2])}</span>`}<span class="tiny" style="display:block;margin-top:4px;opacity:.85">${esc(f[4])}${/p\. \d/.test(f[4])?"":` (p. ${f[1]})`}</span></div></div>
    <div class="btns"><button class="btn full" data-a="ibVFn">${ic("arrow-right")} ${V.k+1<V.L.length?"Próxima":"Ver resultado"}</button></div>`;
  return `<div class="app ibapp">${h}</div></div>`;};
ACT.ibVFr=el=>{const V=IBVF;if(!V||V.resp!=null)return;const v=el.dataset.v==="1";V.resp=v;const it=V.L[V.k],ok=v===it.v,s=ibEst();s.vf=s.vf||{};const x=s.vf[it.i]||[0,0];x[0]++;if(ok)x[1]++;s.vf[it.i]=x;
  if(ok){V.ok++;V.combo++;V.max=Math.max(V.max,V.combo);V.xp+=3+(V.combo>=5?2:0);try{navigator.vibrate&&navigator.vibrate(15);}catch(e){}}else{V.combo=0;try{navigator.vibrate&&navigator.vibrate([50,30,50]);}catch(e){}}
  ibSalvar(s);rr();};
ACT.ibVFn=()=>{IBVF.k++;IBVF.resp=null;rr();window.scrollTo(0,0);};
document.addEventListener("keydown",e=>{if(VIEW.v==="ibgeVF"&&IBVF&&IBVF.k<IBVF.L.length){if(IBVF.resp==null&&/^[vf]$/i.test(e.key))ACT.ibVFr({dataset:{v:/v/i.test(e.key)?"1":"0"}});else if(IBVF.resp!=null&&e.key==="Enter")ACT.ibVFn();}});

/* ---------- 5. SIMULADO QUE CONTINUA ---------- */
const IB_SIMK="mu_ibge_sim";
const ibSimGuardar=()=>{try{if(IBQ&&IBQ.sim&&!IBQ.sim.fim)localStorage.setItem(IB_SIMK,JSON.stringify({nome:IBQ.nome,sim:IBQ.sim}));else localStorage.removeItem(IB_SIMK);}catch(e){}};
const ibSimSalvo=()=>{try{const x=JSON.parse(localStorage.getItem(IB_SIMK)||"null");if(x&&x.sim&&!x.sim.fim&&x.sim.ini+x.sim.dur>Date.now())return x;}catch(e){}return null;};
["ibSimMarca","ibSimNav","ibSimIr"].forEach(k=>{const f=ACT[k];ACT[k]=el=>{f(el);ibSimGuardar();};});
const _ibSimMontar57=ibSimMontar;ibSimMontar=function(){_ibSimMontar57.apply(this,arguments);ibSimGuardar();};
const _ibSimFim57=ibSimFim;ibSimFim=function(){_ibSimFim57.apply(this,arguments);try{localStorage.removeItem(IB_SIMK);}catch(e){}};
ACT.ibSimVolta=()=>{const x=ibSimSalvo();if(!x)return toast("timer","O simulado expirou","");IBQ={sim:x.sim,nome:x.nome};go({v:"ibgeQ"});};
/* diagnóstico por assunto no resultado */
const _ibSimRes57=ibSimRes;ibSimRes=function(){let h=_ibSimRes57();const S=IBQ.sim,B=ibBanco().B;const er={};S.ids.forEach(id=>{const Q=B[id];if(S.resp[id]!=null&&S.resp[id]!==Q.ok){er[Q.top]=(er[Q.top]||0)+1;}});
  const top=Object.entries(er).sort((a,b)=>b[1]-a[1]).slice(0,5);if(!top.length)return h;
  const bloco=`<div class="grp">Onde focar agora</div><div class="card">${top.map(([t,n])=>`<div class="row ibfoco"><span class="grow small"><b>${esc(ibTopNome(t))}</b><span class="tiny faint" style="display:block">${n} ${n===1?"erro":"erros"}</span></span><button class="btn sm" data-a="ibIni" data-m="topico" data-t="${t}">${ic("play")} Treinar</button></div>`).join("")}</div>`;
  return h.replace('<div class="grp">Gabarito comentado</div>',bloco+'<div class="grp">Gabarito comentado</div>');};

/* ---------- 4. PAINEL COMPLETO ---------- */
function ibMissao(s){const hj=ibDia(s),due=ibDue(s).length,t=TODAY();s.trDia=s.trDia||{};s.vfDia=s.vfDia||{};
  return[["Revisões do dia em dia",due===0,due?`${due} para revisar`:"tudo revisado","ibIni","revisao"],["Avançar 1 unidade da trilha",!!s.trDia[t],s.trDia[t]?"feito":"continue a trilha","ibIrTrilha2",""],["Meta de "+s.meta+" questões",hj.q>=s.meta,`${hj.q}/${s.meta}`,"ibIni","rapida"],["1 Relâmpago V ou F",!!s.vfDia[t],s.vfDia[t]?"feito":"20 afirmações rápidas","ibVF",""]];}
ACT.ibIrTrilha2=()=>go({v:"ibgeTrilha"});
VIEWS.ibge=()=>{ibBanco();const s=ibEst(),nv=ibNivel(s.xp||0),hj=ibDia(s),seq=ibSeq(s),cob=ibCobertura(s);
  const R=Object.values(s.r),ten=sum(R.map(x=>x[0])),ac=sum(R.map(x=>x[1])),pc=ten?Math.round(ac/ten*100):0,cad=Object.keys(s.er).length,due=ibDue(s).length;
  const meta=s.meta,mp=Math.min(100,Math.round(hj.q/meta*100)),prox=ibProxUnidade(s),simV=ibSimSalvo();
  const M=ibMissao(s),mf=M.filter(x=>x[1]).length;
  if(mf===M.length){s.misDia=s.misDia||{};if(!s.misDia[TODAY()]){s.misDia[TODAY()]=1;s.xp=(s.xp||0)+100;ibConquista(s,"missao");setTimeout(()=>toast("target","Missão do dia cumprida!","+100 XP"),300);save(s);}}
  let h=topbar("IBGE · Recenseador","conc");
  h+=`<div class="ibhero"><div class="ibnv"><div class="ibring" style="--p:${mp}"><b>${hj.q}</b><span>/${meta}</span></div><div class="grow"><span class="tiny">Nível ${nv.n}</span><b class="ibtit">${esc(nv.tit)}</b>
      <div class="ibxp"><i style="width:${nv.pc}%"></i></div><span class="tiny">${nf(s.xp||0)} XP · faltam ${nf(nv.ate-(s.xp||0))} para o nível ${nv.n+1}</span></div></div>
    <div class="ibchips"><span>${ic("flame")} ${seq} ${seq===1?"dia":"dias"}</span><span>${ic("target")} ${concHoje()}/20 questões de concurso hoje</span><span>${ic("trophy")} ${Object.keys(s.conq).length}/${IB_CONQ.length}</span></div></div>`;
  if(simV)h+=`<button class="ibmodo prim" style="width:100%;margin-bottom:10px" data-a="ibSimVolta">${ic("timer")}<b>Continuar o simulado</b><span>${Object.keys(simV.sim.resp).length}/${simV.sim.ids.length} respondidas · ${ibTempo(simV.sim.ini+simV.sim.dur-Date.now())} restantes</span></button>`;
  h+=`<div class="card ibmis"><div class="row"><b class="grow">${ic("target")} Missão do dia</b><span class="chip ${mf===M.length?"c":""}">${mf}/${M.length}</span></div>${M.map(([n,ok,sub,a,m])=>`<button class="ibmi ${ok?"ok":""}" data-a="${a}" ${m?`data-m="${m}"`:""}><span class="ibmi-c">${ok?ic("check"):""}</span><span class="grow">${esc(n)}<span class="tiny faint" style="display:block">${esc(sub)}</span></span>${ok?"":ic("chevron-right")}</button>`).join("")}<span class="tiny faint">Complete tudo e ganhe +100 XP.</span></div>`;
  if(prox!=null){const t=IB_TRILHA[prox],d=ibDiscDe(t);h+=`<button class="ibtrcta" style="--dc:${IBGE_COR[d]}" data-a="ibUnid" data-k="${prox}"><span class="ibtrcta-i">${ic("route")}</span><span class="grow"><span class="tiny">Trilha · unidade ${prox+1} de ${IB_TRILHA.length}</span><b>${esc(ibTopNome(t))}</b><span class="tiny">Aprenda a teoria e pratique 8 questões</span></span>${ic("play")}</button>`;}
  h+=`<div class="ibmodos">
    <button class="ibmodo ${due?"alerta":""}" data-a="ibIni" data-m="revisao" ${due?"":"disabled"}>${ic("brain-circuit")}<b>Revisão do dia</b><span>${due?due+" questões agendadas":"nada para hoje"}</span></button>
    <button class="ibmodo" data-a="ibIni" data-m="rapida">${ic("zap")}<b>Rodada rápida</b><span>10 questões misturadas</span></button>
    <button class="ibmodo" data-a="ibVF">${ic("check")}<b>Relâmpago V ou F</b><span>20 afirmações da apostila</span></button>
    <button class="ibmodo" data-a="ibSimNovo">${ic("clipboard-check")}<b>Simulado realista</b><span>60 questões · 4 horas</span></button>
    <button class="ibmodo" data-a="go" data-v="${gv({v:"ibgeTrilha"})}">${ic("route")}<b>Trilha</b><span>${IB_TRILHA.filter(t=>s.tr[t]>=1).length}/${IB_TRILHA.length} unidades</span></button>
    <button class="ibmodo" data-a="go" data-v="${gv({v:"ibgeTop",d:"TEC"})}">${ic("layers")}<b>Por tópico</b><span>escolha o assunto</span></button>
    <button class="ibmodo ${cad?"alerta":""}" data-a="ibIni" data-m="reforco" ${cad?"":"disabled"}>${ic("rotate-ccw")}<b>Caderno de erros</b><span>${cad?cad+" para resolver":"vazio"}</span></button>
    <button class="ibmodo" data-a="ibZero" ${cad?"":"disabled"}>${ic("swords")}<b>Zero Erros</b><span>simulado dos seus erros</span></button>
    <button class="ibmodo" data-a="go" data-v="${gv({v:"ibgeCards",d:"TEC"})}">${ic("book-open")}<b>Cards de estudo</b><span>teoria + pegadinhas</span></button>
    <button class="ibmodo" data-a="go" data-v="${gv({v:"ibgeCards",d:"PEG"})}">${ic("triangle-alert")}<b>Pegadinhas</b><span>${IBGE_PEGA.length} armadilhas da banca</span></button></div>`;
  /* pontos fracos */
  const fr=ibTodosTop().map(([d,t])=>({d,t,st:ibStatsTop(s,d,t)})).filter(x=>x.st.ten>=5&&x.st.pc<75).sort((a,b)=>a.st.pc-b.st.pc).slice(0,3);
  if(fr.length)h+=`<div class="grp">Seus pontos fracos</div><div class="card">${fr.map(x=>`<div class="row ibfoco" style="--dc:${IBGE_COR[x.d]}"><span class="grow small"><b>${esc(ibTopNome(x.t))}</b><span class="tiny faint" style="display:block">${x.st.pc}% de acerto em ${x.st.ten} tentativas</span></span><button class="btn ghost sm" data-a="ibTeoria" data-t="${x.t}" aria-label="Teoria">${ic("book-open")}</button><button class="btn sm" data-a="ibIni" data-m="topico" data-t="${x.t}">${ic("play")}</button></div>`).join("")}</div>`;
  h+=`<div class="card ibcob"><div class="row"><b class="grow">Cobertura do edital</b><b>${cob.pc}%</b></div><div class="ibxp" style="margin-top:8px"><i style="width:${cob.pc}%;background:var(--ok)"></i></div><span class="tiny muted">${cob.dom} de ${cob.tot} tópicos dominados (10 questões ou mais, com 60% de acerto)</span>
    <div class="ibmet"><div><b>${nf(R.length)}</b><span>de 2.500 feitas</span></div><div><b>${pc}%</b><span>de acerto</span></div><div><b>${R.filter(x=>(x[3]||0)>=3).length}</b><span>memorizadas</span></div></div></div>`;
  h+=`<div class="grp">Por disciplina</div>`+["TEC","POR","MAT"].map(d=>{const B=ibBanco().por[d];let fe=0,t2=0,a2=0;B.forEach(id=>{const x=s.r[id];if(x){fe++;t2+=x[0];a2+=x[1];}});const tops=Object.keys(IB_TOPS[d]);const dm=tops.filter(t=>ibStatsTop(s,d,t).dom).length;
    return `<button class="item ibdisc" style="--dc:${IBGE_COR[d]}" data-a="go" data-v="${gv({v:"ibgeTop",d})}"><span class="ibdi">${d==="TEC"?"30":"15"}<small>na prova</small></span><span class="ibody"><b>${IB_DISC[d]}</b><span class="tiny faint" style="display:block">${fe} de ${B.length} questões · ${t2?Math.round(a2/t2*100):0}% de acerto · ${dm}/${tops.length} tópicos</span><span class="ibxp" style="display:block;margin-top:6px"><i style="width:${Math.round(fe/B.length*100)}%;background:var(--dc)"></i></span></span>${ic("chevron-right")}</button>`;}).join("");
  if(s.sims.length)h+=`<div class="grp">Seus simulados</div><div class="card">${s.sims.slice(-5).reverse().map(x=>`<div class="row ibsimh"><span class="grow">${fdate(x.d)} · ${x.tipo==="zero"?"Zero Erros":"Simulado"}</span><span class="tiny muted">P ${x.por??"-"} · M ${x.mat??"-"} · T ${x.tec??"-"}</span><b class="${x.pc>=70?"pos":x.pc>=50?"":"neg"}">${x.nota}/${x.tot}</b></div>`).join("")}</div>`;
  h+=`<div class="grp">Conquistas</div><div class="ibconq">${IB_CONQ.map(c=>`<div class="${s.conq[c[0]]?"on":""}" title="${esc(c[2])}">${ic(c[3])}<b>${esc(c[1])}</b><span>${esc(c[2])}</span></div>`).join("")}</div>`;
  h+=`<div class="note" style="margin-top:14px">${ic("lightbulb")} <span><b>Como aprender de verdade:</b> 1) siga a trilha (teoria → prática); 2) faça a Revisão do dia sempre que aparecer — é ela que fixa na memória; 3) marque "vou chutar" quando não tiver certeza; 4) um simulado por semana para treinar o tempo.</span></div>`;
  h+=`<div class="btns"><button class="btn ghost full" data-a="ibMeta">${ic("target")} Ajustar meta diária (${meta})</button><button class="btn ghost full" data-a="ibExport">${ic("file-json")} Baixar o banco de questões (JSON)</button></div>`;
  return `<div class="app">${h}</div>`;};
