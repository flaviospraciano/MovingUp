"use strict";
/* ======================================================================
   ATABAQUE · toques e coordenação motora (aprender por observação)
   Notação de cada passo: D/E = mão direita/esquerda · a = aberto (centro, grave)
   b = borda (aberto na borda, agudo) · t = tapa (estalado) · f = abafado (a mão fica no couro) · "." = pausa
   ====================================================================== */
MODS.atab={n:"Atabaque: toques e coordenação",ic:"drum",c1:"#92400E",c2:"#92400E",g:9,v:{v:"atab"}};
MOD_GROUPS[0][1].splice(5,0,"atab");
const ATR=[
 /* Capoeira */
 {id:"angola",n:"Angola",cat:"Capoeira",bpm:62,sub:4,nv:1,p:"Da . . . Ea . Da . Dt . . . Ea . Da .",d:"Toque lento e firme da capoeira Angola. Peso no primeiro tempo."},
 {id:"benguela",n:"Benguela",cat:"Capoeira",bpm:72,sub:4,nv:1,p:"Da . Ea . Dt . . Ea Da . Ea . Dt . Ea .",d:"Cadenciado, conversa com o jogo baixo e malicioso."},
 {id:"sbg",n:"São Bento Grande (Regional)",cat:"Capoeira",bpm:96,sub:4,nv:2,p:"Da . Ea Ea Dt . Ea . Da . Ea Ea Dt . Ea Ea",d:"Mais acelerado, para o jogo rápido da Regional."},
 {id:"sroda",n:"Samba de roda",cat:"Capoeira",bpm:100,sub:4,nv:2,p:"Da . Ef Ea Dt Ef Ea . Da . Ef Ea Dt . Ea Ef",d:"Balanço do samba do Recôncavo, com abafados que dão o molho."},
 {id:"macu",n:"Maculelê",cat:"Capoeira",bpm:104,sub:4,nv:2,p:"Da . . Ea Da . Dt . Da . . Ea Da . Dt .",d:"Marcado e forte, acompanha o bater das grimas."},
 /* Candomblé e umbanda */
 {id:"ijexa",n:"Ijexá",cat:"Candomblé e umbanda",bpm:84,sub:4,nv:2,p:"Da . Ea Dt . Ea Da . Ea . Dt . Ea Da Ea .",d:"Toque cadenciado e envolvente, base também do afoxé."},
 {id:"congo",n:"Congo de Ouro",cat:"Candomblé e umbanda",bpm:100,sub:4,nv:2,p:"Da . Ea . Db Ea . Dt . Ea Da . Db . Ea .",d:"Swing marcado, usa a borda para dar brilho."},
 {id:"barra",n:"Barravento",cat:"Candomblé e umbanda",bpm:90,sub:3,nv:2,p:"Da . Ea Dt . Ea Da Ea . Dt . Ea",d:"Ciclo ternário, sensação de onda."},
 {id:"nago",n:"Nagô",cat:"Candomblé e umbanda",bpm:96,sub:3,nv:2,p:"Da Ea . Dt Ea . Da . Ea Dt . Ea",d:"Ternário, firme e constante."},
 {id:"aguere",n:"Agueré",cat:"Candomblé e umbanda",bpm:110,sub:3,nv:3,p:"Da . Ea Da . Ea Dt . Ea Da Ea .",d:"Ágil e saltitante."},
 {id:"opanije",n:"Opanijé",cat:"Candomblé e umbanda",bpm:70,sub:3,nv:1,p:"Da . . Ea . Dt . . Ea Da . .",d:"Lento e pesado, com espaços longos."},
 {id:"aluja",n:"Alujá",cat:"Candomblé e umbanda",bpm:130,sub:3,nv:3,p:"Dt Ea Da Ea Dt Ea Da Ea Dt . Da Ea",d:"Rápido e vibrante, muitas notas seguidas."},
 {id:"ilu",n:"Ilu",cat:"Candomblé e umbanda",bpm:140,sub:3,nv:3,p:"Da Ea Dt Ea Da Ea Dt Ea Da Ea Dt .",d:"Veloz e contínuo, exige resistência."},
 {id:"vassi",n:"Avaninha (Vassi)",cat:"Candomblé e umbanda",bpm:120,sub:3,nv:3,p:"Da . Ea Dt . Ea Da . Ea Dt Ea .",d:"Andamento de marcha rápida."},
 {id:"cabula",n:"Cabula",cat:"Candomblé e umbanda",bpm:98,sub:4,nv:2,p:"Da . Ea . Dt . Ea Da . Ea Dt . Ea . Dt .",d:"Balanço sincopado com tapas espaçados."},
 {id:"sato",n:"Sató",cat:"Candomblé e umbanda",bpm:76,sub:3,nv:1,p:"Da . . Db . Ea Dt . . Ea . .",d:"Lento, solene, com respiro entre as frases."},
 {id:"caboclo",n:"Toque de Caboclo",cat:"Candomblé e umbanda",bpm:108,sub:4,nv:2,p:"Da . Ea Dt . Ea Da Ea . Ea Dt . Ea Da Ea .",d:"Forte e animado, típico das giras de caboclo."},
 /* Ritmos populares adaptados ao atabaque */
 {id:"coco",n:"Coco",cat:"Popular (adaptado)",bpm:112,sub:4,nv:2,p:"Da . Ea Dt Ea . Da Ea Dt . Ea . Da Ea Dt Ea",d:"Pulsação do coco de roda, adaptada para uma mão de atabaque."},
 {id:"maracatu",n:"Maracatu",cat:"Popular (adaptado)",bpm:92,sub:4,nv:2,p:"Da . . Ea Da . Dt . Da . Ea Ea Da . Dt .",d:"Levada de baque virado adaptada ao atabaque."},
 {id:"sreggae",n:"Samba-reggae",cat:"Popular (adaptado)",bpm:100,sub:4,nv:1,p:"Da . . . Ea . Da . . Ea Dt . Ea . . .",d:"Groove baiano, espaçado e pesado."},
 {id:"afoxe",n:"Afoxé (variação do ijexá)",cat:"Popular (adaptado)",bpm:88,sub:4,nv:2,p:"Da . Ea Dt Ea . Da . Ea Da Dt . Ea . Da Ea",d:"Variação de rua do ijexá, mais preenchida."}
];
const ATX=[
 {id:"x1",n:"Alternado D-E",bpm:70,sub:2,nv:1,p:"Da Ea Da Ea Da Ea Da Ea",d:"Base de tudo: mãos alternadas, mesmo volume e mesma distância entre os toques."},
 {id:"x2",n:"Só a mão direita",bpm:70,sub:2,nv:1,p:"Da . Da . Da . Da .",d:"Constância e relaxamento do braço direito."},
 {id:"x3",n:"Só a mão esquerda",bpm:70,sub:2,nv:1,p:"Ea . Ea . Ea . Ea .",d:"Iguale a mão fraca à mão forte."},
 {id:"x4",n:"Duplas (DD EE)",bpm:70,sub:2,nv:1,p:"Da Da Ea Ea Da Da Ea Ea",d:"Dois toques por mão; controle do rebote."},
 {id:"x5",n:"Paradiddle (D E D D · E D E E)",bpm:66,sub:2,nv:2,p:"Da Ea Da Da Ea Da Ea Ea",d:"Clássico de coordenação: a mão que começa troca a cada grupo."},
 {id:"x6",n:"Centro e borda",bpm:70,sub:2,nv:1,p:"Da Eb Da Eb Da Eb Da Eb",d:"Direita no centro (grave), esquerda na borda (agudo)."},
 {id:"x7",n:"Independência das mãos",bpm:66,sub:2,nv:2,p:"Db Ea Db Ea Db . Db Ea",d:"Cada mão com um som fixo: direita só borda, esquerda só centro."},
 {id:"x8",n:"Tapa no contratempo",bpm:72,sub:2,nv:2,p:"Ea Dt Ea Dt Ea Dt Ea Dt",d:"O tapa cai entre os tempos. Esquerda marca, direita estala."},
 {id:"x9",n:"Tercinas",bpm:60,sub:3,nv:2,p:"Da Ea Da Ea Da Ea Da Ea Da Ea Da Ea",d:"Três toques por tempo, sentindo o ciclo ternário."},
 {id:"x10",n:"Acento a cada 3 (3 contra 4)",bpm:60,sub:4,nv:3,p:"Dt Ea Da Et Da Ea Dt Ea Da Et Da Ea",d:"Polirritmia: o tapa forma um ciclo de 3 dentro de um pulso de 4."},
 {id:"x11",n:"Aberto e abafado",bpm:66,sub:2,nv:1,p:"Da Ef Da Ef Ea Df Ea Df",d:"Controle do som: deixar o couro vibrar ou segurar."},
 {id:"x12",n:"Rufo contínuo",bpm:60,sub:4,nv:2,p:"Da Ea Da Ea Da Ea Da Ea Da Ea Da Ea Da Ea Da Ea",d:"Alternado rápido. Comece em 50% e aumente aos poucos."},
 {id:"x13",n:"Pergunta e resposta",bpm:72,sub:4,nv:1,p:"Da . Da . Dt . . . Ea . Ea . Et . . .",d:"A direita pergunta, a esquerda responde igual."},
 {id:"x14",n:"Escada de toques",bpm:64,sub:4,nv:2,p:"Da . . . Da Ea . . Da Ea Da . Da Ea Da Ea",d:"1, 2, 3 e 4 toques por tempo: aumenta a densidade sem acelerar."}
];
const ST_N={a:"Aberto (centro)",b:"Borda",t:"Tapa",f:"Abafado"},ST_S={a:"A",b:"B",t:"T",f:"F"};
const HC={E:"#EA580C",D:"#2563EB"};
const atParse=p=>p.trim().split(/\s+/).map(t=>t==="."?null:{h:t[0],s:t[1]||"a"});
const atAll=()=>ATR.concat(ATX);
const atCur=()=>atAll().find(r=>r.id===(AT.id||"x1"))||ATX[0];

/* ---------- estado e áudio ---------- */
const AT={id:null,speed:1,bpm:null,mirror:false,som:true,metro:true,prev:true,playing:false,ctx:null,q:[],st:0,nt:0,cyc:0,timer:null,raf:null,since:0};
try{Object.assign(AT,JSON.parse(localStorage.getItem("mu_at")||"{}"),{playing:false,ctx:null,q:[],timer:null,raf:null});}catch(e){}
const atSaveCfg=()=>{try{localStorage.setItem("mu_at",JSON.stringify({id:AT.id,speed:AT.speed,mirror:AT.mirror,som:AT.som,metro:AT.metro,prev:AT.prev}));}catch(e){}};
function atBpm(){return Math.round(atCur().bpm*AT.speed);}
let NOISE=null;
function atSound(t,s,acc){if(!AT.som)return;const c=AT.ctx;const g=c.createGain();g.connect(c.destination);const v=acc?1:.85;
  if(s==="t"){if(!NOISE){NOISE=c.createBuffer(1,c.sampleRate*.2,c.sampleRate);const d=NOISE.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;}
    const n=c.createBufferSource();n.buffer=NOISE;const bp=c.createBiquadFilter();bp.type="bandpass";bp.frequency.value=2400;bp.Q.value=.9;n.connect(bp);bp.connect(g);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.9*v,t+.003);g.gain.exponentialRampToValueAtTime(.0001,t+.09);n.start(t);n.stop(t+.12);
    const o=c.createOscillator(),g2=c.createGain();o.frequency.setValueAtTime(420,t);o.frequency.exponentialRampToValueAtTime(260,t+.06);g2.gain.setValueAtTime(.0001,t);g2.gain.exponentialRampToValueAtTime(.35,t+.003);g2.gain.exponentialRampToValueAtTime(.0001,t+.07);o.connect(g2);g2.connect(c.destination);o.start(t);o.stop(t+.1);return;}
  const o=c.createOscillator();o.type="sine";o.connect(g);const P={a:[150,72,.5,1],b:[290,230,.28,.7],f:[120,90,.09,.8]}[s]||[150,72,.5,1];
  o.frequency.setValueAtTime(P[0],t);o.frequency.exponentialRampToValueAtTime(P[1],t+P[2]*.6);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(P[3]*v,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+P[2]);o.start(t);o.stop(t+P[2]+.05);}
function atClick(t,strong){if(!AT.metro)return;const c=AT.ctx,o=c.createOscillator(),g=c.createGain();o.frequency.value=strong?1750:1250;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(strong?.28:.16,t+.002);g.gain.exponentialRampToValueAtTime(.0001,t+.04);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+.06);}
function atSched(){if(!AT.playing)return;const r=atCur(),P=atParse(r.p),N=P.length,dur=60/atBpm()/r.sub;
  while(AT.nt<AT.ctx.currentTime+.12){const s=AT.st;
    if(s<0){if((s%r.sub+r.sub)%r.sub===0)atClick(AT.nt,s===-4*r.sub);}
    else{const tk=P[s];if(s%r.sub===0)atClick(AT.nt,s===0);if(tk)atSound(AT.nt,tk.s,s%r.sub===0);}
    AT.q.push({t:AT.nt,s});AT.nt+=dur;AT.st=s+1>=N?0:s+1;if(AT.st===0&&s>=0)AT.cyc++;}}
function atDraw(){if(!AT.playing)return;const now=AT.ctx.currentTime;let ev=null;while(AT.q.length&&AT.q[0].t<=now)ev=AT.q.shift();if(ev)atShow(ev.s);AT.raf=requestAnimationFrame(atDraw);}
ACT.atPlay=()=>{if(AT.playing)return atStop();try{AT.ctx=AT.ctx||new (window.AudioContext||window.webkitAudioContext)();AT.ctx.resume&&AT.ctx.resume();}catch(e){return toast("drum","Áudio indisponível","");}
  const r=atCur();AT.playing=true;AT.q=[];AT.cyc=0;AT.st=-4*r.sub;AT.nt=AT.ctx.currentTime+.15;AT.since=Date.now();AT.timer=setInterval(atSched,25);atSched();AT.raf=requestAnimationFrame(atDraw);atBtn();
  try{if(navigator.wakeLock)navigator.wakeLock.request("screen").then(l=>AT.lock=l).catch(()=>{});}catch(e){}};
function atStop(){AT.playing=false;clearInterval(AT.timer);cancelAnimationFrame(AT.raf);AT.q=[];try{AT.lock&&AT.lock.release();}catch(e){}
  const secs=Math.round((Date.now()-AT.since)/1000);if(AT.since&&secs>=20){const id="atab_"+TODAY();const d=getD(id)||{id,c:"atabs",d:TODAY(),seg:0};d.seg=(d.seg||0)+secs;save(d);}AT.since=0;
  atBtn();atShow(null);const l=$("atPracT");if(l)l.textContent=atPratTxt();}
function atBtn(){const b=$("atPlayB");if(b)b.innerHTML=`${ic(AT.playing?"square":"play")} ${AT.playing?"Parar":"Tocar"}`;}

/* ---------- visual ---------- */
function atShow(s){const r=atCur(),P=atParse(r.p),stage=$("atStage");if(!stage)return;
  qa(".atcell.on",document).forEach(c=>c.classList.remove("on"));qa(".atcell.nx",document).forEach(c=>c.classList.remove("nx"));
  const cd=$("atCount"),lab=$("atLab");
  if(s==null){if(lab)lab.innerHTML=`<span class="faint">Toque em <b>Tocar</b> e observe as mãos</span>`;if(cd)cd.textContent="";qa(".athand",stage).forEach(h=>h.classList.remove("hit","ghost"));return;}
  if(s<0){const beat=Math.ceil(-s/r.sub);if(cd)cd.textContent=(-s)%r.sub===0?String(beat):cd.textContent;if(lab)lab.innerHTML=`<b>Prepare-se…</b>`;return;}
  if(cd)cd.textContent="";const cy=$("atCyc");if(cy)cy.textContent="Ciclo "+(AT.cyc+1);
  const cell=$("atc"+s);if(cell){cell.classList.add("on");const ln=cell.parentElement;const l=cell.offsetLeft-ln.offsetLeft;if(l<ln.scrollLeft||l+cell.offsetWidth>ln.scrollLeft+ln.clientWidth)ln.scrollLeft=Math.max(0,l-8);}
  const tk=P[s];
  qa(".athand",stage).forEach(h=>h.classList.remove("ghost"));
  if(AT.prev){let j=(s+1)%P.length,k=0;while(!P[j]&&k<P.length){j=(j+1)%P.length;k++;}const nx=P[j];if(nx){const hn=stage.querySelector(".athand."+nx.h);if(hn&&!(tk&&tk.h===nx.h))hn.classList.add("ghost");const nc=$("atc"+j);if(nc)nc.classList.add("nx");}}
  if(!tk){return;}
  const h=stage.querySelector(".athand."+tk.h);if(h){h.dataset.z=tk.s;h.classList.remove("hit");void h.getBBox();h.classList.add("hit");clearTimeout(h._t);h._t=setTimeout(()=>h.classList.remove("hit"),tk.s==="f"?260:140);}
  const zone=stage.querySelector(".atz."+(tk.s==="b"||tk.s==="t"?"edge":"cen"));if(zone){zone.classList.remove("flash");void zone.getBBox();zone.classList.add("flash");zone.style.setProperty("--hc",HC[tk.h]);}
  const rip=stage.querySelector(".atrip."+tk.h);if(rip){rip.setAttribute("data-z",tk.s);rip.classList.remove("go");void rip.getBBox();rip.classList.add("go");}
  if(lab)lab.innerHTML=`<span class="atbig" style="color:${HC[tk.h]}">${tk.h==="D"?"DIREITA":"ESQUERDA"}</span><span class="atst">${ST_N[tk.s]}</span>`;}
function atStageSVG(){const L=AT.mirror?"D":"E",R=AT.mirror?"E":"D";
  const hand=(side,letter)=>`<g class="athand ${letter} ${side}" style="--hc:${HC[letter]}"><g class="hmove"><circle r="27" fill="${HC[letter]}" stroke="#fff" stroke-width="3"/><g transform="translate(-14 -16) scale(1.2)${side==="L"?" translate(24 0) scale(-1 1)":""}" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${ICONS.hand}</g><text y="46" text-anchor="middle" font-size="22" font-weight="900" fill="${HC[letter]}" stroke="#fff" stroke-width="4" paint-order="stroke">${letter}</text></g></g>`;
  return `<svg viewBox="0 0 360 300" class="atsvg" role="img" aria-label="Atabaque visto de cima">
   <path d="M58 138 L84 268 Q180 296 276 268 L302 138 Z" fill="#7C3F12"/>
   ${[0,1,2,3,4,5,6].map(i=>{const x=72+i*36;return `<path d="M${x} 140 L${x+18} 262" stroke="#5B2E0D" stroke-width="3"/><path d="M${x+18} 140 L${x} 262" stroke="#A86A32" stroke-width="2" opacity=".55"/>`;}).join("")}
   <path d="M66 190 Q180 214 294 190" stroke="#3B1D08" stroke-width="7" fill="none"/>
   <ellipse cx="180" cy="134" rx="128" ry="54" fill="#3B1D08"/>
   <ellipse cx="180" cy="128" rx="118" ry="48" fill="#E8CFA0"/>
   <ellipse class="atz edge" cx="180" cy="128" rx="118" ry="48" fill="none" stroke="#C9A46A" stroke-width="22" opacity=".55"/>
   <ellipse class="atz cen" cx="180" cy="128" rx="62" ry="25" fill="#EED8AE" stroke="#C9A46A" stroke-dasharray="4 4"/>
   <text x="180" y="132" text-anchor="middle" font-size="10" font-weight="800" fill="#9C7A45">centro</text><text x="180" y="94" text-anchor="middle" font-size="10" font-weight="800" fill="#9C7A45">borda</text>
   <ellipse class="atrip ${L}" cx="135" cy="128" rx="14" ry="6" fill="none" stroke="${HC[L]}" stroke-width="3"/><ellipse class="atrip ${R}" cx="225" cy="128" rx="14" ry="6" fill="none" stroke="${HC[R]}" stroke-width="3"/>
   ${hand("L",L)}${hand("R",R)}</svg>`;}
function atPratTxt(){const d=getD("atab_"+TODAY());const m=d?Math.round(d.seg/60):0;let n=0,x=TODAY();if(!getD("atab_"+x))x=addDays(x,-1);while(getD("atab_"+x)){n++;x=addDays(x,-1);}return `Hoje: ${m} min de prática · ${n} ${n===1?"dia seguido":"dias seguidos"}`;}

VIEWS.atab=()=>{const r=atCur(),P=atParse(r.p),tb=VIEW.tab||(ATX.some(x=>x.id===r.id)?"x":"r");
  let h=topbar("Atabaque","atab");
  h+=`<div class="atplayer"><div class="row" style="align-items:flex-start"><div class="grow"><div class="tiny" style="opacity:.75">${esc(r.cat||"Exercício de coordenação")} · nível ${"●".repeat(r.nv)}${"○".repeat(3-r.nv)}</div><h2 style="margin:2px 0 0;font:800 1.3rem var(--disp)">${esc(r.n)}</h2></div><span class="chip" id="atCyc" style="background:rgba(255,255,255,.14);color:#fff;border:0"></span></div>
   <div class="atwrap"><div id="atStage">${atStageSVG()}</div><div class="atcount" id="atCount"></div></div>
   <div class="atlab" id="atLab"><span class="faint">Toque em <b>Tocar</b> e observe as mãos</span></div>
   <div class="atlane">${P.map((tk,i)=>`<div class="atcell ${i%r.sub===0?"beat":""} ${tk?tk.h:""}" id="atc${i}">${tk?`<b>${tk.h}</b><span>${ST_S[tk.s]}</span>`:"<i>·</i>"}</div>`).join("")}</div>
   <div class="atctl"><button class="btn" id="atPlayB" data-a="atPlay">${ic("play")} Tocar</button>
     <div class="atspd">${[[.5,"50%"],[.75,"75%"],[1,"100%"],[1.25,"125%"]].map(([v,l])=>`<button data-a="atSpd" data-v="${v}" aria-pressed="${AT.speed===v}">${l}</button>`).join("")}</div></div>
   <div class="row" style="margin-top:8px"><span class="small" style="opacity:.85">${ic("gauge")} <b id="atBpmL">${atBpm()}</b> bpm</span><input type="range" min="30" max="200" value="${atBpm()}" data-in="atBpmR" style="flex:1;accent-color:#F59E0B" aria-label="Andamento"></div>
   <div class="attog">${[["prev","eye","Mostrar próximo"],["metro","timer","Metrônomo"],["som","volume-2","Som"],["mirror","flip-horizontal-2","Espelho"]].map(([k,i,l])=>`<button data-a="atTog" data-k="${k}" aria-pressed="${!!AT[k]}">${ic(i)} ${l}</button>`).join("")}</div>
   <div class="tiny" style="opacity:.8;margin-top:8px">${esc(r.d)}</div></div>
   <div class="small muted" style="margin:10px 2px" id="atPracT">${atPratTxt()}</div>`;
  h+=`<div class="card small atleg"><b>Como ler</b><div class="wrap-row" style="margin-top:8px"><span class="chip" style="background:${HC.E};color:#fff">E · mão esquerda</span><span class="chip" style="background:${HC.D};color:#fff">D · mão direita</span></div>
    <div class="leg" style="margin-top:10px"><div><b>A</b>&nbsp;Aberto: no centro, a mão bate e sai (grave)</div><div><b>B</b>&nbsp;Borda: dedos na borda, som agudo</div><div><b>T</b>&nbsp;Tapa: mão em concha, estalado</div><div><b>F</b>&nbsp;Abafado: a mão fica no couro</div></div>
    <p class="tiny muted" style="margin:10px 0 0">Comece em 50%, observe dois ciclos sem tocar e depois toque junto. A conta “1, 2, 3, 4” antes de começar é a sua entrada. No modo <b>Espelho</b>, as mãos ficam como as de um professor de frente para você.</p></div>`;
  h+=`<div class="tabs" style="margin-top:14px"><button data-a="liTab" data-v="r" aria-pressed="${tb==="r"}">${ic("music")} Ritmos (${ATR.length})</button><button data-a="liTab" data-v="x" aria-pressed="${tb==="x"}">${ic("activity")} Coordenação (${ATX.length})</button></div>`;
  const L=tb==="x"?ATX:ATR;const cats=[...new Set(L.map(x=>x.cat||"Exercícios"))];
  h+=cats.map(cg=>`<div class="grp">${esc(cg)}</div>`+L.filter(x=>(x.cat||"Exercícios")===cg).map(x=>`<button class="item atitem ${x.id===r.id?"sel":""}" style="width:100%;text-align:left" data-a="atSel" data-id="${x.id}"><span class="mb">${ic(tb==="x"?"activity":"drum")}</span><span class="ibody"><b>${esc(x.n)}</b><span class="small muted" style="display:block">${esc(x.d)}</span><span class="meta"><span class="chip">${x.bpm} bpm</span><span class="chip">${atParse(x.p).length} passos</span><span class="chip m">${["","Fácil","Médio","Difícil"][x.nv]}</span></span></span></button>`).join("")).join("");
  h+=`<div class="note" style="margin-top:14px">${ic("info")} Os toques aparecem em <b>versões didáticas simplificadas</b>, para treinar coordenação e escuta. Cada toque varia de casa para casa e de mestre para mestre, e muitos têm fundamento religioso no candomblé e na umbanda. Use como estudo e aprofunde com o seu mestre.</div>`;
  return `<div class="app">${h}</div>`;};
ACT.atSel=el=>{const was=AT.playing;if(was)atStop();AT.id=el.dataset.id;atSaveCfg();rr();window.scrollTo({top:0,behavior:"smooth"});};
ACT.atSpd=el=>{AT.speed=+el.dataset.v;atSaveCfg();const was=AT.playing;if(was)atStop();rr();};
CH.atBpmR=el=>{AT.speed=Math.max(.2,(+el.value)/atCur().bpm);const l=$("atBpmL");if(l)l.textContent=el.value;qa(".atspd button").forEach(b=>b.setAttribute("aria-pressed","false"));atSaveCfg();};
ACT.atTog=el=>{const k=el.dataset.k;AT[k]=!AT[k];atSaveCfg();el.setAttribute("aria-pressed",String(AT[k]));if(k==="mirror"){const s=$("atStage");if(s)s.innerHTML=atStageSVG();}};
/* parar o som ao sair da tela */
const _render8=render;
render=function(){if(AT.playing&&VIEW.v!=="atab")atStop();return _render8.apply(this,arguments);};
