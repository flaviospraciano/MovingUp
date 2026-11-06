"use strict";
/* ======================================================================
   EXERCÍCIO DE KEGEL · treino guiado de ~15 minutos
   ====================================================================== */
MODS.kegel={n:"Exercício de Kegel",ic:"activity",c1:"#0E7490",c2:"#0E7490",g:9,v:{v:"kegel"}};
TRK.kegel={photo:0,t:"Treino de Kegel"};
MOD_GROUPS[0][1]=["gym","run","swim","cap","kegel","mara"];
MODS.grav.v={v:"list",k:"grav"};MODS.grav.n="Gravação de audiobooks";
MODS.curso={n:"Curso de projetos culturais",ic:"clapperboard",c1:"#9D174D",c2:"#9D174D",g:9,v:{v:"curso"}};
MOD_GROUPS.splice(MOD_GROUPS.findIndex(g=>g[0]==="Trabalho e cultura")+1,0,["Projetos pessoais",["hiit","grav","curso"]]);
const _quickTrk=ACT.quickTrk;ACT.quickTrk=el=>{if(el.dataset.k==="kegel")return go({v:"kegel"});_quickTrk(el);};

/* ---------- ilustrações (esquema do assoalho pélvico) ---------- */
function kgSVG(kind){const W=200,H=120;const c="var(--c1)",g="var(--faint)";
  const pelve=`<path d="M30 30 C30 70 60 92 100 92 C140 92 170 70 170 30" fill="none" stroke="${g}" stroke-width="3" stroke-linecap="round"/><path d="M30 30 C42 26 50 34 56 44 M170 30 C158 26 150 34 144 44" fill="none" stroke="${g}" stroke-width="3" stroke-linecap="round"/>`;
  const rede=y=>`<path d="M50 ${y-4} Q100 ${y+16} 150 ${y-4}" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`;
  const up=(x,y)=>`<path d="M${x} ${y} v-18 m-7 7 l7 -7 l7 7" fill="none" stroke="${c}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  const down=(x,y)=>`<path d="M${x} ${y} v18 m-7 -7 l7 7 l7 -7" fill="none" stroke="${g}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  const fig=(p)=>p==="lie"?`<g stroke="${g}" stroke-width="4" stroke-linecap="round" fill="none"><circle cx="28" cy="96" r="8"/><path d="M38 98 H96 L120 78 L140 100"/></g><circle cx="96" cy="98" r="7" fill="${c}"/>`
    :p==="sit"?`<g stroke="${g}" stroke-width="4" stroke-linecap="round" fill="none"><circle cx="78" cy="22" r="8"/><path d="M78 32 V74 H112 V104"/><path d="M60 78 H130" stroke-width="3"/></g><circle cx="80" cy="74" r="7" fill="${c}"/>`
    :`<g stroke="${g}" stroke-width="4" stroke-linecap="round" fill="none"><circle cx="100" cy="16" r="8"/><path d="M100 26 V66 M100 66 L88 106 M100 66 L112 106 M100 38 L84 56 M100 38 L116 56"/></g><circle cx="100" cy="66" r="7" fill="${c}"/>`;
  let body="";
  if(kind==="slow")body=pelve+rede(70)+up(100,62)+`<text x="182" y="20" text-anchor="end" font-size="13" font-weight="800" fill="${c}">segura</text>`;
  else if(kind==="quick")body=pelve+rede(72)+up(70,64)+down(100,46)+up(130,64)+`<text x="182" y="20" text-anchor="end" font-size="13" font-weight="800" fill="${c}">1s · 1s</text>`;
  else if(kind==="elev")body=pelve+[48,62,76].map((y,i)=>`<line x1="40" x2="160" y1="${y}" y2="${y}" stroke="${g}" stroke-dasharray="4 5"/><text x="168" y="${y+4}" font-size="11" font-weight="800" fill="${g}">${3-i}</text>`).join("")+rede(52)+up(100,96);
  else if(kind==="long")body=pelve+rede(66)+`<g transform="translate(150 6)"><path d="M0 0 H22 M0 34 H22 M3 0 C3 12 19 22 19 34 M19 0 C19 12 3 22 3 34" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/></g>`;
  else if(kind==="breath")body=`<g fill="none" stroke="${g}" stroke-width="3"><path d="M100 14 V40"/><path d="M98 40 C70 34 56 60 60 92 C78 96 94 84 98 66 Z"/><path d="M102 40 C130 34 144 60 140 92 C122 96 106 84 102 66 Z"/></g><path d="M40 108 Q100 120 160 108" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`;
  else if(kind==="breath2")body=pelve+rede(70)+up(100,62)+`<path d="M20 20 q10 -8 20 0 t20 0" fill="none" stroke="${g}" stroke-width="3" stroke-linecap="round"/><text x="20" y="38" font-size="11" font-weight="800" fill="${g}">expire</text>`;
  else if(kind==="relax")body=fig("lie")+`<path d="M60 40 q10 -8 20 0 t20 0 t20 0" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`;
  else if(kind==="lie"||kind==="sit"||kind==="stand")body=fig(kind);
  return `<svg viewBox="0 0 ${W} ${H}" class="kgsvg" role="img" aria-label="Ilustração do exercício">${body}</svg>`;}

/* ---------- níveis e plano ---------- */
const KLV={ini:{n:"Iniciante",hold:5,rest:5,reps:15,q:15,lh:8,lr:10},int:{n:"Intermediário",hold:8,rest:8,reps:10,q:15,lh:12,lr:12},adv:{n:"Avançado",hold:10,rest:10,reps:8,q:15,lh:15,lr:12}};
const kgLevel=()=>{try{return localStorage.getItem("mu_kglv")||cfg().kglv||"ini";}catch(e){return"ini";}};
function kegelPlano(lv){const L=KLV[lv]||KLV.ini;return[
 {id:"resp",n:"Respiração e consciência",pos:"Deitado",img:"breath",tipo:"breath",reps:6,c:4,r:6,como:"Inspire pelo nariz deixando a barriga e o períneo soltos; solte o ar devagar pela boca. Apenas perceba a região, sem contrair."},
 {id:"lent1",n:"Contrações lentas",pos:"Deitado, joelhos dobrados",img:"slow",tipo:"cr",reps:L.reps,c:L.hold,r:L.rest,como:"Contraia como se segurasse o xixi e puxasse a região para dentro e para cima. Segure firme, respirando normalmente. Depois solte por completo."},
 {id:"rap1",n:"Contrações rápidas",pos:"Deitado",img:"quick",tipo:"cr",reps:L.q,c:1,r:1,series:2,pausa:20,como:"Contraia forte e solte logo em seguida, no ritmo de 1 segundo. Solte totalmente entre uma e outra."},
 {id:"elev",n:"Elevador (3 andares)",pos:"Sentado",img:"elev",tipo:"elev",reps:5,step:2,top:3,r:6,como:"Suba a contração aos poucos: 1º andar (leve), 2º (média), 3º (máxima). Segure no topo e desça andar por andar, com controle."},
 {id:"long",n:"Sustentação longa",pos:"Sentado",img:"long",tipo:"cr",reps:4,c:L.lh,r:L.lr,como:"Contraia com cerca de metade da força e mantenha pelo tempo todo, respirando. Treina resistência."},
 {id:"lent2",n:"Contrações lentas em pé",pos:"Em pé",img:"stand",tipo:"cr",reps:L.reps,c:L.hold,r:L.rest,como:"O mesmo movimento das contrações lentas, agora em pé, contra a gravidade. Glúteos, coxas e barriga ficam soltos."},
 {id:"rap2",n:"Contrações rápidas em pé",pos:"Em pé",img:"quick",tipo:"cr",reps:L.q,c:1,r:1,como:"Contrações rápidas e fortes, soltando por completo entre elas."},
 {id:"exp",n:"Kegel na expiração",pos:"Sentado",img:"breath2",tipo:"cr",reps:8,c:4,r:4,lc:"Solte o ar e contraia",lr:"Puxe o ar e relaxe",como:"Contraia enquanto solta o ar e relaxe enquanto puxa o ar. Ensina o músculo a trabalhar junto com a respiração."},
 {id:"fim",n:"Relaxamento final",pos:"Deitado",img:"relax",tipo:"breath",reps:6,c:4,r:6,como:"Respire devagar e deixe toda a região solta. Relaxar bem é tão importante quanto contrair."}];}
const KPREP=12;
function kgTimeline(lv){return kgTimelineP(kegelPlano(lv));}
function kgTimelineP(P){const T=[];P.forEach((b,bi)=>{T.push({b:bi,k:"prep",d:KPREP,l:"Prepare-se",s:b.n+" · "+b.pos});
  const series=b.series||1;for(let se=0;se<series;se++){if(se>0)T.push({b:bi,k:"prep",d:b.pausa||15,l:"Pausa",s:"Série "+(se+1)+" de "+series});
    for(let r=1;r<=b.reps;r++){const tag=`${r}/${b.reps}`+(series>1?` · série ${se+1}`:"");
      if(b.tipo==="breath"){T.push({b:bi,k:"in",d:b.c,l:"Inspire",rep:tag,lvl:0});T.push({b:bi,k:"out",d:b.r,l:"Expire devagar",rep:tag,lvl:0});}
      else if(b.tipo==="elev"){const N=b.andares||3,up=[...Array(N)].map((_,i)=>i+1);up.forEach(a=>T.push({b:bi,k:"c",d:b.step,l:"Suba: "+a+"º andar",rep:tag,lvl:a/N}));T.push({b:bi,k:"c",d:b.top,l:"Segure no topo",rep:tag,lvl:1});up.slice(0,-1).reverse().concat([0]).forEach(a=>T.push({b:bi,k:"r",d:b.step,l:a?"Desça: "+a+"º andar":"Solte tudo",rep:tag,lvl:a/N}));T.push({b:bi,k:"r",d:b.r,l:"Descanse",rep:tag,lvl:0});}
      else if(b.tipo==="react"){const esp=b.esp[(r*7+se*3)%b.esp.length];T.push({b:bi,k:"r",d:esp,l:"Solto… espere o sinal",rep:tag,lvl:0});T.push({b:bi,k:"c",d:b.c,l:"AGORA! Contraia rápido",rep:tag,lvl:1});}
      else if(b.tipo==="rev"){T.push({b:bi,k:"in",d:b.c,l:b.lc||"Inspire e deixe a região descer e abrir",rep:tag,lvl:0});T.push({b:bi,k:"out",d:b.r,l:b.lr||"Expire e solte ainda mais",rep:tag,lvl:0});}
      else{T.push({b:bi,k:"c",d:b.c,l:b.lc||(b.c<=1?"Contraia":"Contraia e segure"),rep:tag,lvl:b.lvl||1});T.push({b:bi,k:"r",d:b.r,l:b.lr||"Relaxe",rep:tag,lvl:0});}}}});return T;}
const kgTotal=lv=>sum(kgTimeline(lv).map(s=>s.d));
const mmTot=s=>Math.floor(s/60)+" min"+(s%60?" "+(s%60)+" s":"");

/* ---------- tela do módulo ---------- */
VIEWS.kegel=()=>{const lv=kgLevel(),P=kegelPlano(lv),t=TODAY(),[y,m]=ym();const done=trkHas("kegel",t);const mes=trkDocs("kegel",y+"-"+pad(m+1)).length;
  let h=topbar("Exercício de Kegel","kegel");
  h+=`<div class="hero"><div class="row"><div class="grow"><div class="muted small">Treino guiado de hoje · ${KLV[lv].n}</div><h2>${done?"✓ Treino feito hoje":"Treino de "+mmTot(kgTotal(lv))}</h2><div class="muted small">${P.length} exercícios, com voz visual, sinal sonoro e vibração.</div></div></div>
   <div class="stats"><div><b>${streakK("kegel")}</b><span>dias seguidos</span></div><div><b>${mes}</b><span>neste mês</span></div><div><b>${mmTot(kgTotal(lv)).replace(" min"," min").split(" ")[0]}</b><span>minutos/dia</span></div></div>
   <button class="btn full" style="margin-top:14px;padding:16px;font-size:1.05rem" data-a="kgStart">${ic("play")} ${done?"Treinar de novo":"Iniciar treino guiado"}</button></div>`;
  h+=`<div class="sec"><h2>Nível</h2></div><div class="seg">${Object.entries(KLV).map(([k,v])=>`<button data-a="kgLv" data-v="${k}" aria-pressed="${k===lv}">${v.n}</button>`).join("")}</div>
   <div class="tiny faint" style="margin-top:6px">Segurar ${KLV[lv].hold} s · soltar ${KLV[lv].rest} s · sustentação longa de ${KLV[lv].lh} s. Suba de nível quando o atual ficar fácil por uma semana.</div>`;
  h+=`<div class="sec"><h2>Os exercícios do treino</h2></div>`+P.map((b,i)=>{const sec=(b.tipo==="elev"?b.reps*(b.step*6+b.top+b.r):b.reps*(b.c+b.r))*(b.series||1)+(b.series>1?(b.pausa||15)*(b.series-1):0);
    const dose=b.tipo==="breath"?`${b.reps} respirações · inspire ${b.c} s, expire ${b.r} s`:b.tipo==="elev"?`${b.reps} repetições · ${b.step} s por andar, segura ${b.top} s no topo, descansa ${b.r} s`:`${b.series?b.series+" séries × ":""}${b.reps} repetições · contrai ${b.c} s, solta ${b.r} s`;
    return `<div class="kgx"><div class="kgimg">${kgSVG(b.img)}</div><div class="grow"><div class="row"><span class="kgn">${i+1}</span><b class="grow">${esc(b.n)}</b><span class="chip">${mmTot(sec)}</span></div>
      <div class="meta"><span class="chip m">${esc(b.pos)}</span></div><div class="small" style="margin-top:6px"><b>${esc(dose)}</b></div><p class="small muted" style="margin:6px 0 0">${esc(b.como)}</p></div></div>`;}).join("");
  h+=`<div class="sec"><h2>Antes de começar</h2></div><div class="card small kgtips">
    <p><b>Como encontrar o músculo:</b> é o mesmo que você usa para interromper o xixi ou segurar gases. Faça esse teste no banheiro só uma vez, para reconhecer; não treine urinando.</p>
    <p><b>Durante o treino:</b> não prenda a respiração e não contraia glúteos, coxas ou barriga. A força vem só de dentro, “para dentro e para cima”.</p>
    <p><b>Relaxar conta:</b> solte por completo em cada descanso. Contração sem relaxamento cansa o músculo.</p>
    <p><b>Constância:</b> os efeitos costumam aparecer depois de algumas semanas de treino diário.</p>
    <p class="muted"><b>Atenção:</b> se sentir dor, ardência ou piora de algum sintoma, pare e procure um urologista ou fisioterapeuta pélvico. Este treino não substitui orientação profissional.</p></div>`;
  h+=`<div class="sec"><h2>Dias de treino</h2><span class="chip m" style="margin-left:auto">${ic("flame")} ${streakK("kegel")} seguidos</span></div>`+calNav(y,m,"mNav")+monthGrid(y,m,(d,n)=>`<button class="day ${trkHas("kegel",d)?"done":""} ${d===t?"td":""}" data-a="kgDay" data-d="${d}">${n}${trkHas("kegel",d)?ic("check"):""}</button>`);
  return `<div class="app">${h}</div>`;};
ACT.kgLv=el=>{try{localStorage.setItem("mu_kglv",el.dataset.v);}catch(e){}const c=cfg();c.kglv=el.dataset.v;save(c);rr();};
ACT.kgDay=el=>{toggleSimple("kegel",el.dataset.d);rr();};

/* ---------- player guiado ---------- */
let KG=null,KGA=null;
function kgBeep(f,ms){try{if(!KG||!KG.som)return;KGA=KGA||new (window.AudioContext||window.webkitAudioContext)();const o=KGA.createOscillator(),g=KGA.createGain();o.frequency.value=f;o.type="sine";g.gain.value=.0001;o.connect(g);g.connect(KGA.destination);const n=KGA.currentTime;g.gain.exponentialRampToValueAtTime(.25,n+.02);g.gain.exponentialRampToValueAtTime(.0001,n+ms/1000);o.start(n);o.stop(n+ms/1000+.05);}catch(e){}}
ACT.kgStart=async()=>{const lv=kgLevel();const T=kgTimeline(lv);KG={lv,T,i:0,t0:Date.now(),el:0,pause:false,som:true,vib:true,tot:sum(T.map(s=>s.d)),plano:kegelPlano(lv)};
  try{KGA=KGA||new (window.AudioContext||window.webkitAudioContext)();KGA.resume&&KGA.resume();}catch(e){}
  try{if(navigator.wakeLock)KG.lock=await navigator.wakeLock.request("screen");}catch(e){}
  let d=$("kgp");if(!d){d=document.createElement("div");d.id="kgp";d.className="kgp";document.body.appendChild(d);}document.body.style.overflow="hidden";guard();kgPhase(true);
  KG.timer=setInterval(kgTick,100);};
function kgPhase(first){if(!KG)return;const s=KG.T[KG.i];const b=KG.plano[s.b];KG.ps=Date.now();KG.pd=s.d*1000;
  if(!first||s.k!=="prep"){if(s.k==="c")kgBeep(880,180);else if(s.k==="r"||s.k==="out")kgBeep(440,220);else if(s.k==="in")kgBeep(660,150);else kgBeep(520,120);}
  if(KG.vib&&navigator.vibrate)navigator.vibrate(s.k==="c"?[90]:s.k==="prep"?[40,60,40]:[40]);
  const d=$("kgp");const next=KG.T.slice(KG.i+1).find(x=>x.b!==s.b);
  d.innerHTML=`<div class="kt"><button class="ib" data-a="kgClose" aria-label="Encerrar">${ic("x")}</button><div class="grow small"><b>${s.b+1}/${KG.plano.length} · ${esc(b.n)}</b><span style="display:block;opacity:.75">${esc(b.pos)}</span></div><button class="ib" data-a="kgSom" aria-label="Som">${ic(KG.som?"volume-2":"volume-x")}</button></div>
   <div class="kbar"><i id="kgTot"></i></div>
   <div class="kmain k-${s.k}"><div class="kimg">${kgSVG(b.img)}</div>
     <div class="kring"><div class="kfill" id="kgF" style="height:${Math.round((s.lvl||0)*100)}%"></div><div class="kin"><span class="kl">${esc(s.l)}</span><b id="kgS">${Math.ceil(s.d)}</b>${s.rep?`<span class="kr">${esc(s.rep)}</span>`:`<span class="kr">${esc(s.s||"")}</span>`}</div></div>
     <div class="small" style="opacity:.8;max-width:420px;text-align:center">${s.k==="prep"?esc(b.como):""}</div></div>
   <div class="kfoot"><span class="small" id="kgR"></span><span class="grow"></span>${next?`<span class="tiny" style="opacity:.7">Depois: ${esc(KG.plano[next.b].n)}</span>`:""}</div>
   <div class="kbtn"><button class="ib" data-a="kgSkip" aria-label="Pular exercício">${ic("skip-forward")}</button><button class="btn" data-a="kgPause">${ic(KG.pause?"play":"pause")} ${KG.pause?"Continuar":"Pausar"}</button></div>`;
  kgTick();}
function kgTick(){if(!KG||KG.pause)return;const now=Date.now(),el=now-KG.ps,s=KG.T[KG.i];
  const S=$("kgS");if(S)S.textContent=Math.max(1,Math.ceil((KG.pd-el)/1000));
  const doneS=sum(KG.T.slice(0,KG.i).map(x=>x.d))+Math.min(el/1000,s.d);const tb=$("kgTot");if(tb)tb.style.width=(doneS/KG.tot*100)+"%";const R=$("kgR");if(R)R.textContent="Faltam "+mmss((KG.tot-doneS)*1000);
  const F=$("kgF");if(F){let lv=s.lvl||0;const prev=KG.T[KG.i-1];const from=prev&&prev.b===s.b?(prev.lvl||0):0;const p=Math.min(1,el/Math.min(700,KG.pd));F.style.height=Math.round((from+(lv-from)*p)*100)+"%";}
  if(el>=KG.pd){KG.i++;if(KG.i>=KG.T.length)return kgDone();kgPhase();}}
ACT.kgPause=()=>{if(!KG)return;if(KG.pause){KG.ps=Date.now()-(KG.pel||0);KG.pause=false;}else{KG.pel=Date.now()-KG.ps;KG.pause=true;}
  const b=document.querySelector('#kgp [data-a="kgPause"]');if(b)b.innerHTML=`${ic(KG.pause?"play":"pause")} ${KG.pause?"Continuar":"Pausar"}`;const m=document.querySelector("#kgp .kmain");if(m)m.classList.toggle("paused",KG.pause);};
ACT.kgSkip=()=>{if(!KG)return;const b=KG.T[KG.i].b;while(KG.i<KG.T.length&&KG.T[KG.i].b===b)KG.i++;if(KG.i>=KG.T.length)return kgDone();KG.pause=false;kgPhase();};
ACT.kgSom=()=>{if(!KG)return;KG.som=!KG.som;const b=document.querySelector('[data-a="kgSom"]');if(b)b.innerHTML=ic(KG.som?"volume-2":"volume-x");};
function kgEnd(){if(!KG)return;clearInterval(KG.timer);try{KG.lock&&KG.lock.release();}catch(e){}const d=$("kgp");if(d)d.remove();document.body.style.overflow="";const k=KG;KG=null;return k;}
function kgDone(){const k=kgEnd();const t=TODAY();const id=tid("kegel",t);save({...(getD(id)||{}),id,c:"trk",k:"kegel",d:t,t:"Treino de Kegel",s:KLV[k.lv].n+" · "+mmTot(Math.round(k.tot))});
  kgBeep(990,300);if(navigator.vibrate)navigator.vibrate([120,80,120,80,200]);rr();toast("medal","Treino de Kegel concluído!",mmTot(Math.round(k.tot))+" · "+streakK("kegel")+(streakK("kegel")===1?" dia seguido":" dias seguidos"));}
ACT.kgClose=()=>{if(!KG)return;const done=KG.i/KG.T.length;confirmSheet("Encerrar o treino?",done>.8?"Você está quase no fim. Se encerrar agora, o dia ainda conta.":"O treino não será marcado como feito.","Encerrar",()=>{const k=kgEnd();if(done>.8&&k){const t=TODAY();save({id:tid("kegel",t),c:"trk",k:"kegel",d:t,t:"Treino de Kegel",s:KLV[k.lv].n});}rr();});};
window.addEventListener("popstate",e=>{if(KG){e.stopImmediatePropagation();GUARD=false;guard();ACT.kgClose();}},true);
