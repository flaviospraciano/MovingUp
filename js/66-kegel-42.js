"use strict";
/* ======================================================================
   4.2 · KEGEL, VERSÃO COMPLETA
   · Desenhos novos: corte lateral da pelve (osso púbico, cóccix, bexiga, reto) com a musculatura do assoalho pélvico
     em destaque. Na lista, cada exercício se mexe sozinho; no treino guiado, o músculo sobe e desce junto com o tempo.
   · Posições (deitado, sentado, em pé) desenhadas. Respiração com diafragma. Elevador com andares.
   · Antes do treino: checagem rápida (bexiga vazia, respiração solta, só o períneo trabalha) e como você está.
   · Durante: voz guiando ("contraia", "solte") e modo discreto, só com vibração, para treinar em qualquer lugar.
   · Kegel rápido de 2 minutos e sessão leve para dias de desconforto.
   · Depois: "como foi?" e sugestão de subir de nível quando ficar fácil. Progresso de 28 dias.
   Dados: c:"single" id "kgx" {ck:{data:"bem|cansado|dor"}, av:{data:"facil|ok|dificil"}}
   ====================================================================== */
const kgx=()=>{const x=single("kgx",{ck:{},av:{}});x.ck=x.ck||{};x.av=x.av||{};return x;};
const kgPref=k=>{try{return localStorage.getItem("mu_kg_"+k)==="1";}catch(e){return false;}};
const kgPrefSet=(k,v)=>{try{localStorage.setItem("mu_kg_"+k,v?"1":"0");}catch(e){}};
/* ---------- desenhos ---------- */
function kgFig(p){const g="var(--kgfig,#94A3B8)";
  if(p==="lie")return `<g class="kg2-fig" stroke="${g}" stroke-width="4" stroke-linecap="round" fill="none"><circle cx="18" cy="128" r="6" fill="${g}" stroke="none"/><path d="M26 130 L58 130 L72 116 L86 130"/><path d="M44 130 L40 140"/></g>`;
  if(p==="sit")return `<g class="kg2-fig" stroke="${g}" stroke-width="4" stroke-linecap="round" fill="none"><circle cx="28" cy="98" r="6" fill="${g}" stroke="none"/><path d="M28 106 L30 126 L50 126 L52 142"/><path d="M18 128 L18 142 M18 128 L44 128"/></g>`;
  if(p==="stand")return `<g class="kg2-fig" stroke="${g}" stroke-width="4" stroke-linecap="round" fill="none"><circle cx="26" cy="92" r="6" fill="${g}" stroke="none"/><path d="M26 100 L26 124 L20 144 M26 124 L32 144 M26 106 L16 118 M26 106 L36 118"/></g>`;return"";}
kgSVG=function(kind){kind=kind||"slow";const pos={lie:"lie",sit:"sit",stand:"stand"}[kind]||"";const k=pos?"slow":kind;
  const ossos=`<path d="M58 70 C50 84 52 100 64 106" fill="none" stroke="var(--kgos,#CBD5E1)" stroke-width="9" stroke-linecap="round"/><path d="M186 46 C196 64 194 88 180 104 C176 108 172 110 168 110" fill="none" stroke="var(--kgos,#CBD5E1)" stroke-width="9" stroke-linecap="round"/>`;
  const orgaos=`<ellipse cx="88" cy="74" rx="22" ry="17" fill="var(--kgbx,#BFDBFE)" opacity=".9"/><path d="M88 91 v10" stroke="var(--kgbx,#93C5FD)" stroke-width="4" stroke-linecap="round"/><path d="M150 52 C162 62 160 80 152 96 L148 104" fill="none" stroke="var(--kgrt,#FBCFE8)" stroke-width="13" stroke-linecap="round"/>`;
  const musc=`<g class="kg2-m"><path d="M62 100 C86 128 150 128 172 104 C150 116 88 116 62 100 Z" fill="url(#kgG_${k})"/><path d="M62 100 C86 128 150 128 172 104" fill="none" stroke="var(--c1)" stroke-width="3" stroke-linecap="round"/>
    <path class="kg2-fib" d="M84 112 q6 6 12 0 M108 116 q6 6 12 0 M132 114 q6 6 12 0" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2" stroke-linecap="round"/></g>`;
  const setaC=`<g class="kg2-up" fill="none" stroke="var(--c1)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M117 140 v-16 m-7 7 l7 -7 l7 7"/><path d="M95 138 v-11 m-5 5 l5 -5 l5 5" opacity=".7"/><path d="M139 138 v-11 m-5 5 l5 -5 l5 5" opacity=".7"/></g>`;
  const setaR=`<g class="kg2-down" fill="none" stroke="var(--kgfig,#94A3B8)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M117 124 v14 m-6 -6 l6 6 l6 -6"/></g>`;
  let extra="";
  if(k==="breath"||k==="breath2")extra=`<g class="kg2-dia"><path d="M58 34 C86 14 150 14 178 34" fill="none" stroke="var(--kgdi,#A7F3D0)" stroke-width="7" stroke-linecap="round"/></g><g class="kg2-ar" fill="none" stroke="var(--kgdi,#34D399)" stroke-width="3" stroke-linecap="round"><path d="M117 26 v12 m-5 -5 l5 5 l5 -5"/></g>`;
  if(k==="elev")extra=`<g class="kg2-and" stroke="var(--kgfig,#94A3B8)" stroke-width="1.5" stroke-dasharray="4 4"><path d="M196 112 h28 M196 100 h28 M196 88 h28"/></g><g font-size="9" font-weight="800" fill="var(--kgfig,#94A3B8)"><text x="228" y="115">1</text><text x="228" y="103">2</text><text x="228" y="91">3</text></g>`;
  if(k==="quick")extra=`<g class="kg2-pul" fill="none" stroke="var(--c1)" stroke-width="2.5" stroke-linecap="round"><path d="M70 132 l4 -6 l4 6 l4 -6"/><path d="M152 132 l4 -6 l4 6 l4 -6"/></g>`;
  if(k==="long")extra=`<g fill="none" stroke="var(--c1)" stroke-width="3" stroke-linecap="round"><circle cx="212" cy="30" r="14"/><path d="M212 21 v9 l6 4"/></g>`;
  if(k==="relax")extra=`<g class="kg2-ond" fill="none" stroke="var(--kgdi,#34D399)" stroke-width="2.5" stroke-linecap="round"><path d="M80 140 q9 -7 18 0 t18 0 t18 0 t18 0"/></g>`;
  return `<svg class="kg2 kg2-${k}" viewBox="0 0 240 150" role="img" aria-label="Assoalho pélvico"><defs><linearGradient id="kgG_${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--c1)" stop-opacity=".95"/><stop offset="1" stop-color="var(--c2,var(--c1))" stop-opacity=".55"/></linearGradient></defs>
   <ellipse cx="120" cy="84" rx="104" ry="62" fill="var(--kgbg,rgba(148,163,184,.08))"/>${extra}${ossos}${orgaos}${musc}${k==="relax"||k==="breath"||k==="breath2"?setaR:setaC}${kgFig(pos)}</svg>`;};
/* o músculo acompanha o nível do treino guiado */
const _kgTick42=kgTick;kgTick=function(){_kgTick42.apply(this,arguments);const F=$("kgF"),K=document.querySelector("#kgp .kimg");if(F&&K)K.style.setProperty("--kl",(parseFloat(F.style.height)/100||0).toFixed(3));};
/* ---------- voz e modo discreto ---------- */
function kgFala(t){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang="pt-BR";u.rate=1.08;const v=speechSynthesis.getVoices().find(v=>/pt(-|_)BR/i.test(v.lang));if(v)u.voice=v;speechSynthesis.speak(u);}catch(e){}}
const KG_FALA={c:"Contraia",r:"Solte",in:"Inspire",out:"Expire",prep:""};
const _kgPhase42=kgPhase;kgPhase=function(first){_kgPhase42.apply(this,arguments);if(!KG)return;const s=KG.T[KG.i];
  if(KG.disc){KG.som=false;try{navigator.vibrate&&navigator.vibrate(s.k==="c"?[420]:s.k==="r"?[70,90,70]:s.k==="in"?[160]:s.k==="out"?[60,60,60,60]:[40,60,40,60,40]);}catch(e){}}
  else if(KG.voz&&s.d>=2){const b=KG.plano[s.b];kgFala(s.k==="prep"?(s.l==="Pausa"?"Pausa":b.n):/andar|topo|agora/i.test(s.l)?s.l.replace(/º/g,"").replace(/:/g,","):KG_FALA[s.k]||s.l);}
  const p=$("kgp");if(p){p.classList.toggle("disc",!!KG.disc);const kt=p.querySelector(".kt");if(kt&&!kt.querySelector('[data-a="kgVoz"]')){const b=document.createElement("span");b.className="kg-ex";
      b.innerHTML=`<button class="ib" data-a="kgVoz" aria-label="Voz guiando" aria-pressed="${!!KG.voz}">${ic(KG.voz?"message-circle":"message-circle-off")}</button><button class="ib" data-a="kgDisc" aria-label="Modo discreto: só vibração" aria-pressed="${!!KG.disc}">${ic("vibrate")}</button>`;kt.insertBefore(b,kt.lastElementChild);}}};
ACT.kgVoz=()=>{if(!KG)return;KG.voz=!KG.voz;kgPrefSet("voz",KG.voz);if(KG.voz){KG.disc=false;kgPrefSet("disc",false);}const b=document.querySelector('[data-a="kgVoz"]');if(b){b.innerHTML=ic(KG.voz?"message-circle":"message-circle-off");b.setAttribute("aria-pressed",KG.voz);}};
ACT.kgDisc=()=>{if(!KG)return;KG.disc=!KG.disc;kgPrefSet("disc",KG.disc);if(KG.disc){KG.voz=false;KG.som=false;}else KG.som=true;const p=$("kgp");if(p)p.classList.toggle("disc",KG.disc);const b=document.querySelector('[data-a="kgDisc"]');if(b)b.setAttribute("aria-pressed",KG.disc);toast("vibrate",KG.disc?"Modo discreto":"Modo normal",KG.disc?"Só vibração: longa = contraia, duas curtas = solte.":"Som e tela de volta.");};
/* ---------- antes de começar ---------- */
const _kgStart42=ACT.kgStart;
function kgIniciar(plano,extra){const lv=kgLevel(),T=plano?kgTimelineP(plano):kgTimeline(lv);KG={lv,T,i:0,t0:Date.now(),el:0,pause:false,som:!kgPref("disc"),vib:true,voz:kgPref("voz"),disc:kgPref("disc"),tot:sum(T.map(s=>s.d)),plano:plano||kegelPlano(lv)};Object.assign(KG,extra||{});
  try{KGA=KGA||new (window.AudioContext||window.webkitAudioContext)();KGA.resume&&KGA.resume();}catch(e){}
  (async()=>{try{if(navigator.wakeLock&&KG)KG.lock=await navigator.wakeLock.request("screen");}catch(e){}})();
  let d=$("kgp");if(!d){d=document.createElement("div");d.id="kgp";d.className="kgp";document.body.appendChild(d);}document.body.style.overflow="hidden";guard();kgPhase(true);KG.timer=setInterval(kgTick,100);}
const KG_MICRO=()=>[{id:"m1",n:"Contrações lentas",pos:"Sentado, em qualquer lugar",img:"sit",tipo:"cr",reps:5,c:5,r:5,como:"Contraia como se segurasse o xixi, puxando para dentro e para cima. Segure, respirando. Solte por completo."},
  {id:"m2",n:"Contrações rápidas",pos:"Sentado",img:"quick",tipo:"cr",reps:10,c:1,r:1,como:"Contraia forte e solte logo, no ritmo de 1 segundo."},{id:"m3",n:"Sustentação",pos:"Sentado",img:"long",tipo:"cr",reps:2,c:10,r:10,como:"Segure firme por 10 segundos sem prender a respiração. Depois solte tudo."}];
const KG_LEVE=()=>[{id:"l1",n:"Respiração com o assoalho solto",pos:"Deitado, joelhos dobrados",img:"breath",tipo:"breath",reps:8,c:4,r:6,como:"Inspire deixando a barriga e o períneo descerem. Solte o ar devagar. Nada de força."},
  {id:"l2",n:"Relaxamento do períneo",pos:"Deitado",img:"relax",tipo:"breath",reps:6,c:5,r:7,como:"A cada expiração, imagine a região amolecendo e abrindo. Só soltar."}];
function kgCheckin(){const t=TODAY(),X=kgx(),c=X.ck[t]||"bem";
  sheet(`<h2>${ic("sparkles")} Antes de começar</h2><div class="kgck">${[["droplet","Bexiga vazia"],["wind","Respire normalmente, sem prender o ar"],["target","Só o períneo trabalha: glúteos, coxas e barriga soltos"]].map(([i,t])=>`<div>${ic(i)}<span>${t}</span></div>`).join("")}</div>
   <div class="fld"><span>Como você está hoje?</span><div class="seg" id="kgCk">${[["bem","Bem"],["cansado","Cansado"],["dor","Com desconforto"]].map(([k,n])=>`<button type="button" data-a="kgCkSel" data-v="${k}" aria-pressed="${c===k}">${n}</button>`).join("")}</div></div>
   <div id="kgCkN">${kgCkNota(c)}</div>
   <div class="wrap-row" style="margin-top:8px"><button class="chip ${kgPref("voz")?"c":""}" data-a="kgPrefT" data-k="voz">${ic("message-circle")} Voz guiando</button><button class="chip ${kgPref("disc")?"c":""}" data-a="kgPrefT" data-k="disc">${ic("vibrate")} Modo discreto (só vibração)</button></div>
   <div class="btns">${c==="dor"?`<button class="btn full" data-a="kgLeve">${ic("heart")} Sessão leve · 2 min</button><button class="btn ghost full" data-a="kgStart" data-ok="1">Treino completo mesmo assim</button>`:`<button class="btn full" data-a="kgStart" data-ok="1">${ic("play")} Começar o treino de ${mmTot(kgTotal(kgLevel()))}</button><button class="btn ghost full" data-a="kgMicro">${ic("timer")} Só o rápido de 2 minutos</button>`}</div>`);}
const kgCkNota=c=>c==="dor"?`<div class="note">${ic("heart")} Hoje, só respiração e relaxamento. Dor ou ardência que se repete não é normal: vale procurar um fisioterapeuta pélvico.</div>`:c==="cansado"?`<div class="note">${ic("battery-low")} Cansado, a qualidade importa mais que a força. Se a contração ficar fraca no fim, pare e descanse.</div>`:"";
ACT.kgCkSel=el=>{const X=kgx();X.ck[TODAY()]=el.dataset.v;save(X);kgCheckin();};
ACT.kgPrefT=el=>{const k=el.dataset.k,v=!kgPref(k);kgPrefSet(k,v);if(v)kgPrefSet(k==="voz"?"disc":"voz",false);kgCheckin();};
ACT.kgStart=function(el){if(el&&el.dataset&&el.dataset.ok==="1"){closeSheet();return kgIniciar(null);}kgCheckin();};
ACT.kgMicro=()=>{closeSheet();kgIniciar(KG_MICRO(),{micro:"Kegel rápido · 2 min"});};
ACT.kgLeve=()=>{closeSheet();kgIniciar(KG_LEVE(),{micro:"Sessão leve · respiração e relaxamento"});};
function kgMicro(){ACT.kgMicro();}
/* ---------- depois: como foi ---------- */
const KG_ORD=["ini","int","adv"];
const _kgDone42=kgDone;kgDone=function(){const micro=KG&&KG.micro;_kgDone42.apply(this,arguments);const t=TODAY();if(micro){const d=getD(tid("kegel",t));if(d){d.s=micro;save(d);}}
  setTimeout(()=>sheet(`<h2>${ic("medal")} Treino feito!</h2><p class="muted small">Como foi hoje?</p><div class="btns">${[["facil","Fácil, sobrou força"],["ok","Na medida"],["dificil","Difícil, cansou no fim"]].map(([k,n])=>`<button class="btn ghost full" data-a="kgAv" data-v="${k}">${n}</button>`).join("")}</div>`),900);};
ACT.kgAv=el=>{const X=kgx(),t=TODAY();X.av[t]=el.dataset.v;save(X);const lv=kgLevel(),i=KG_ORD.indexOf(lv),ult=Object.keys(X.av).sort().slice(-5).map(d=>X.av[d]);
  if(i<KG_ORD.length-1&&ult.length>=5&&ult.every(v=>v==="facil"))return sheet(`<h2>${ic("trending-up")} Hora de subir de nível</h2><p class="muted small">As últimas 5 sessões ficaram fáceis. O próximo nível segura por mais tempo.</p><div class="btns"><button class="btn full" data-a="kgLv" data-v="${KG_ORD[i+1]}">${ic("trending-up")} Subir para ${KLV[KG_ORD[i+1]].n}</button><button class="btn ghost full" data-a="closeSheet">Ficar mais uma semana</button></div>`);
  if(i>0&&ult.slice(-3).length===3&&ult.slice(-3).every(v=>v==="dificil"))return sheet(`<h2>${ic("heart")} Um passo atrás também é treino</h2><p class="muted small">As últimas 3 sessões ficaram difíceis. Voltar um nível por uns dias ajuda a contração ficar firme até o fim.</p><div class="btns"><button class="btn full" data-a="kgLv" data-v="${KG_ORD[i-1]}">Voltar para ${KLV[KG_ORD[i-1]].n}</button><button class="btn ghost full" data-a="closeSheet">Manter o nível</button></div>`);
  closeSheet();toast("check","Anotado","Vou usar isso para sugerir o nível certo.");};
if(!ACT.closeSheet)ACT.closeSheet=()=>closeSheet();
/* ---------- progresso de 28 dias na tela do Kegel ---------- */
function kgMelhorSeq(){const D=new Set(trkDocs("kegel").map(x=>x.d));let best=0,cur=0,prev="";[...D].sort().forEach(d=>{cur=prev&&addDays(prev,1)===d?cur+1:1;best=Math.max(best,cur);prev=d;});return best;}
function kgProgressoHTML(){const t=TODAY(),X=kgx(),D=new Set(trkDocs("kegel").map(x=>x.d));const ini=addDays(t,-27);const dias=[...Array(28)].map((_,i)=>addDays(ini,i));const feitos=dias.filter(d=>D.has(d)).length;
  const av=Object.keys(X.av).sort().slice(-7).map(d=>X.av[d]),AVN={facil:["c","fácil"],ok:["","na medida"],dificil:["n","difícil"]};
  return `<div class="card kgprog"><div class="row"><b class="grow">${ic("activity")} Últimos 28 dias</b><span class="chip">${feitos}/28</span></div>
   <div class="kghm">${dias.map(d=>`<i class="${D.has(d)?"on":""} ${d===t?"hj":""}" title="${fdate(d)}"></i>`).join("")}</div>
   <div class="stats" style="margin-top:10px"><div><b>${streakK("kegel")}</b><span>seguidos agora</span></div><div><b>${kgMelhorSeq()}</b><span>melhor sequência</span></div><div><b>${Math.round(feitos*kgTotal(kgLevel())/60)}</b><span>min em 28 dias</span></div></div>
   ${av.length?`<div class="wrap-row" style="margin-top:8px"><span class="tiny faint">Como foram:</span>${av.map(v=>`<span class="chip ${(AVN[v]||[""])[0]}">${(AVN[v]||["",v])[1]}</span>`).join("")}</div>`:""}
   <div class="btns h" style="margin-top:10px"><button class="btn ghost" data-a="kgMicro">${ic("timer")} Rápido · 2 min</button><button class="btn ghost" data-a="kgLeve">${ic("heart")} Sessão leve</button></div></div>`;}
const _kegelV42=VIEWS.kegel;VIEWS.kegel=function(){const h=_kegelV42.apply(this,arguments);const k='<div class="sec"><h2>Nível</h2>',i=h.indexOf(k);return i<0?h:h.slice(0,i)+kgProgressoHTML()+h.slice(i);};
