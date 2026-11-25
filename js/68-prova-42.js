"use strict";
/* ======================================================================
   4.2 · SIMULADO DE FIM DE SEMANA E MODO PROVA
   · Sábado e domingo, o app só abre depois de 20 questões do IBGE no modo prova. Depois ele convida para mais 40,
     fechando as 60 questões da prova de verdade (15 de Português, 15 de Matemática e 30 de Conhecimentos Técnicos).
   · Modo prova: tela cheia, tela sempre acesa, sem avisos nem toasts, o voltar não sai. O gabarito só aparece no fim.
   · Saída de emergência: segurar 3 segundos libera o app por 15 minutos (fica registrado).
   · As respostas entram nas estatísticas do IBGE, no caderno de erros e na meta de 20 questões do dia.
   Dados: single "fds" {d:{data:{ok, n, esc, emerg}}} · prova em andamento no aparelho (mu_prova).
   ====================================================================== */
const fdsLigado=()=>cfg().fdsProva!==false;
const ehFds=()=>{const w=new Date().getDay();return w===0||w===6;};
const fdsDoc=()=>{const F=single("fds",{d:{}});F.d=F.d||{};return F;};
const fdsHoje=()=>fdsDoc().d[TODAY()]||{};
function fdsPrecisa(){if(!fdsLigado()||!ehFds()||!DB.be)return false;const x=fdsHoje();if(x.ok)return false;if(x.emerg&&Date.now()<x.emerg)return false;
  try{const B=ibBanco();if(!B||!B.ids||B.ids.length<20)return false;}catch(e){return false;}return true;}
let PV=null;
const provaSalvaLocal=()=>{try{if(PV)localStorage.setItem("mu_prova",JSON.stringify(PV));else localStorage.removeItem("mu_prova");}catch(e){}};
function provaMontar(n,usados){const s=ibEst(),B=ibBanco(),r=ibRng(Date.now()%2147483647),fora=new Set(usados||[]);const q=Math.round(n/4);
  const pega=(L,k)=>ibEscolher(L.filter(id=>!fora.has(id)),k,s,r);return pega(B.por.POR,q).concat(pega(B.por.MAT,q),pega(B.por.TEC,n-2*q));}
/* o: {tipo:"fds"|"fds40"|"livre", n, dur(min)} */
function provaAbrir(o){o=o||{};if($("prova"))return;let salvo=null;try{salvo=JSON.parse(localStorage.getItem("mu_prova")||"null");}catch(e){}
  if(salvo&&salvo.d===TODAY()&&salvo.fase!=="fim"&&(!o.tipo||o.tipo===salvo.tipo||o.tipo==="fds"&&/^fds/.test(salvo.tipo)))PV=salvo;
  else{const tipo=o.tipo||"livre",n=o.n||(tipo==="fds"?20:tipo==="fds40"?40:60);PV={tipo,d:TODAY(),ids:provaMontar(n,o.usados),resp:{},i:0,ini:0,dur:(o.dur||(tipo==="livre"?240:Math.round(n*4)))*60000,fase:"capa",ant:o.ant||null};}
  if(!PV.ids.length){PV=null;return toast("clipboard-check","Banco de questões indisponível","");}
  const d=document.createElement("div");d.id="prova";d.className="prova";document.body.appendChild(d);document.body.classList.add("modo-prova");document.body.style.overflow="hidden";guard();provaRender();provaSalvaLocal();}
async function provaTelaCheia(){try{if(!document.fullscreenElement&&document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen({navigationUI:"hide"});}catch(e){}
  try{if(navigator.wakeLock)PV.lock=await navigator.wakeLock.request("screen");}catch(e){}}
const pvTempo=ms=>{ms=Math.max(0,ms);const h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000),s=Math.floor(ms%60000/1000);return (h?h+":":"")+pad(m)+":"+pad(s);};
function provaRender(){const d=$("prova");if(!d||!PV)return;const B=ibBanco().B;
  if(PV.fase==="capa"){const fds=/^fds/.test(PV.tipo);
    d.innerHTML=`<div class="pv-capa"><span class="pv-sel">${ic("clipboard-check")} MODO PROVA</span><h1>${fds?(PV.tipo==="fds"?"Simulado de fim de semana":"Mais 40: o simulado completo"):"Simulado em modo prova"}</h1>
     <p>${PV.tipo==="fds"?"Hoje o app abre depois de <b>20 questões</b>. Celular em modo prova: tela cheia, sem avisos e o voltar não sai.":PV.tipo==="fds40"?"Mais <b>40 questões</b> e você fecha as 60 da prova real. Sem pressa e sem consulta.":`<b>${PV.ids.length} questões</b> e ${Math.round(PV.dur/60000/60)} horas de relógio, como no dia da prova.`}</p>
     <div class="pv-reg"><div>${ic("bell-off")}<span>Ative o <b>Não perturbe</b> do celular</span></div><div>${ic("timer")}<span>Ritmo de prova: ${Math.round(PV.dur/PV.ids.length/60000)} min por questão</span></div><div>${ic("eye-off")}<span>O gabarito aparece só no fim</span></div></div>
     <button class="btn full pv-go" data-a="provaIr">${ic("play")} Começar agora</button>${fds?provaEmergHTML():`<button class="btn ghost full" data-a="provaDesiste">Agora não</button>`}</div>`;return;}
  if(PV.fase==="res")return provaResultado();
  const id=PV.ids[PV.i],Q=B[id];if(!Q){PV.i=0;return provaRender();}const feitas=Object.keys(PV.resp).length,tot=PV.ids.length,todas=feitas>=tot;
  d.innerHTML=`<header class="pv-top"><span class="pv-sel">${ic("clipboard-check")} PROVA</span><span class="grow tiny">questão ${PV.i+1} de ${tot} · ${feitas} respondidas</span><span class="pv-tm" id="pvTm">${ic("timer")} ${pvTempo(PV.tipo==="livre"?PV.ini+PV.dur-Date.now():Date.now()-PV.ini)}</span></header>
   <div class="pv-bar"><i style="width:${Math.round(feitas/tot*100)}%"></i></div>
   <div class="ibq pv-q" style="--dc:${IBGE_COR[Q.disc]}"><div class="ibqmeta"><span class="chip" style="color:var(--dc)">${IB_DISC[Q.disc]}</span></div><p class="iben">${ibTxt(Q.en)}</p>
    <div class="ibalts">${Q.alt.map((t,i)=>`<button class="ibalt ${PV.resp[id]===i?"marc":""}" data-a="provaMarca" data-i="${i}"><span class="ibl">${LET[i]}</span><span class="grow">${ibTxt(t)}</span></button>`).join("")}</div>
    <div class="btns h"><button class="btn ghost" data-a="provaNav" data-d="-1" ${PV.i?"":"disabled"}>${ic("chevron-left")} Anterior</button><button class="btn ghost" data-a="provaNav" data-d="1" ${PV.i<tot-1?"":"disabled"}>Próxima ${ic("chevron-right")}</button></div>
    <details class="card ibgrade"><summary><b>Ir para a questão</b></summary><div class="ibgr">${PV.ids.map((x,k)=>`<button class="${PV.resp[x]!=null?"on":""} ${k===PV.i?"at":""}" data-a="provaIrQ" data-k="${k}">${k+1}</button>`).join("")}</div></details>
    <button class="btn full pv-ent" data-a="provaEntregar" ${todas||PV.tipo==="livre"?"":"disabled"}>${ic("flag")} ${todas?"Entregar a prova":`Entregar (faltam ${tot-feitas})`}</button>
    ${/^fds/.test(PV.tipo)?provaEmergHTML():`<button class="btn ghost full" data-a="provaDesiste" style="margin-top:8px">Sair sem entregar</button>`}<div class="pv-aviso" id="pvAviso"></div></div>`;}
const provaEmergHTML=()=>PV&&PV.tipo==="fds40"?`<button class="btn ghost full" data-a="provaChega" style="margin-top:8px">Parar aqui e liberar o app</button>`:`<button class="pv-emerg" id="pvEm" aria-label="Saída de emergência: segure 3 segundos">${ic("siren")} Emergência: segure 3 s</button>`;
ACT.provaIr=async()=>{if(!PV)return;await provaTelaCheia();if(!PV.ini)PV.ini=Date.now();PV.fase="q";provaSalvaLocal();provaRender();};
ACT.provaMarca=el=>{if(!PV)return;const id=PV.ids[PV.i];PV.resp[id]=+el.dataset.i;provaSalvaLocal();try{navigator.vibrate&&navigator.vibrate(12);}catch(e){}
  provaRender();if(PV.i<PV.ids.length-1)setTimeout(()=>{if(!PV)return;let j=PV.ids.findIndex((x,k)=>k>PV.i&&PV.resp[x]==null);if(j<0)j=PV.i+1;PV.i=j;provaRender();const q=$("prova");if(q)q.scrollTop=0;},220);};
ACT.provaNav=el=>{if(!PV)return;PV.i=Math.max(0,Math.min(PV.ids.length-1,PV.i+ +el.dataset.d));provaRender();const q=$("prova");if(q)q.scrollTop=0;};
ACT.provaIrQ=el=>{if(!PV)return;PV.i=+el.dataset.k;provaRender();const q=$("prova");if(q)q.scrollTop=0;};
ACT.provaEntregar=()=>{if(!PV)return;const f=PV.ids.length-Object.keys(PV.resp).length;if(f&&PV.tipo!=="livre")return;if(f){const a=$("pvAviso");if(a&&!PV.conf){PV.conf=1;a.textContent=`Ainda há ${f} sem resposta. Toque de novo em Entregar para confirmar.`;return;}}provaFechar();};
function provaRegistrar(ids,resp){const B=ibBanco().B,s=ibEst(),por={TEC:[0,0],POR:[0,0],MAT:[0,0]};let xp=0;
  ids.forEach(id=>{const Q=B[id];if(!Q)return;const r=resp[id],ok=r===Q.ok;por[Q.disc][1]++;if(ok)por[Q.disc][0]++;
    if(r!=null){const reg=s.r[id]||[0,0,0];reg[0]++;if(ok)reg[1]++;reg[2]=ok?1:0;ibCaixa(reg,ok,false);s.r[id]=reg;if(typeof concAdd==="function")concAdd(1);const dd=ibDia(s);dd.q++;if(ok)dd.ac++;}
    if(ok){xp+=10;if(s.er[id]!=null){s.er[id]++;if(s.er[id]>=2)delete s.er[id];}}else if(r!=null)s.er[id]=0;});s.xp=(s.xp||0)+xp;save(s);return{por,xp};}
function provaSim(tipo,por,tot,min){const s=ibEst(),nota=por.TEC[0]+por.POR[0]+por.MAT[0],pc=Math.round(nota/tot*100),bonus=tipo==="real"?100:30;s.xp=(s.xp||0)+bonus;
  s.sims.push({d:TODAY(),tipo,nota,tot,pc,tec:por.TEC[1]?por.TEC[0]:null,por:por.POR[1]?por.POR[0]:null,mat:por.MAT[1]?por.MAT[0]:null,min});if(tipo==="real"){ibConquista(s,"sim");if(pc>=70)ibConquista(s,"sim42");}save(s);return{nota,pc,bonus};}
function provaFechar(){const fim=Date.now(),R=provaRegistrar(PV.ids,PV.resp),min=Math.round((fim-PV.ini)/60000);let S;
  if(PV.tipo==="fds40"&&PV.ant){const A=PV.ant,por={};["TEC","POR","MAT"].forEach(k=>{por[k]=[R.por[k][0]+A.por[k][0],R.por[k][1]+A.por[k][1]];});S=provaSim("real",por,PV.ids.length+A.tot,min+A.min);PV.tot60=PV.ids.length+A.tot;PV.por60=por;}
  else S=provaSim(PV.tipo==="fds"?"fds20":"real",R.por,PV.ids.length,min);
  PV.R={por:R.por,xp:R.xp+S.bonus,nota:S.nota,pc:S.pc,min};PV.fase="res";if(/^fds/.test(PV.tipo)){const F=fdsDoc(),x=F.d[TODAY()]=F.d[TODAY()]||{};x.ok=1;x.n=(x.n||0)+PV.ids.length;delete x.emerg;save(F);}
  provaSalvaLocal();provaRender();}
function provaResultado(){const d=$("prova"),B=ibBanco().B,R=PV.R,tot=PV.tot60||PV.ids.length,por=PV.por60||R.por,nota=por.TEC[0]+por.POR[0]+por.MAT[0],pc=Math.round(nota/tot*100);
  const erros=PV.ids.filter(id=>PV.resp[id]!=null&&B[id]&&PV.resp[id]!==B[id].ok);
  d.innerHTML=`<div class="pv-res"><span class="pv-sel">${ic("flag")} PROVA ENTREGUE</span><div class="ibres"><div class="ibbig ${pc>=70?"pos":pc>=50?"":"neg"}">${nota}<small>/${tot}</small></div><b>${pc}% de acerto${PV.tot60?" no simulado completo":""}</b><span class="muted small">${R.min} min · +${R.xp} XP</span>
     <div class="ibmet">${["POR","MAT","TEC"].filter(k=>por[k][1]).map(k=>`<div><b>${por[k][0]}/${por[k][1]}</b><span>${IB_DISC[k]}</span></div>`).join("")}</div></div>
   ${PV.tipo==="fds"?`<div class="pv-conv"><b>${ic("flame")} Bora fechar o simulado?</b><p>Mais 40 questões e você faz as 60 da prova de verdade. Quem treina a prova inteira chega descansado no dia.</p><button class="btn full" data-a="provaMais40">${ic("play")} Fazer mais 40</button><button class="btn ghost full" data-a="provaChega">Agora não, liberar o app</button></div>`:`<button class="btn full" data-a="provaChega">${ic("check")} Fechar e voltar ao app</button>`}
   ${erros.length?`<div class="grp">Gabarito das ${erros.length} que errou</div>`+erros.map(id=>{const Q=B[id],r=PV.resp[id];return `<details class="card ibgab errou"><summary><span class="ibnum err">${PV.ids.indexOf(id)+1}</span><span class="grow small">${esc(Q.en.split("\n").pop().slice(0,90))}</span><b class="tiny">${LET[r]} / ${LET[Q.ok]}</b></summary><p class="iben">${ibTxt(Q.en)}</p>${Q.alt.map((t,i)=>`<div class="ibalt mini ${i===Q.ok?"ok":i===r?"err":"apaga"}"><span class="ibl">${LET[i]}</span><span class="grow">${ibTxt(t)}</span></div>`).join("")}<p class="small" style="margin-top:8px">${ibTxt(Q.com)}</p></details>`;}).join(""):`<div class="note">${ic("party-popper")} Nenhum erro. Impecável.</div>`}</div>`;}
ACT.provaMais40=()=>{if(!PV)return;const ant={por:PV.R.por,tot:PV.ids.length,min:PV.R.min},usados=PV.ids.slice();provaSair(false);provaAbrir({tipo:"fds40",n:40,usados,ant});};
ACT.provaChega=()=>provaSair(true);
ACT.provaDesiste=()=>{if(PV&&/^fds/.test(PV.tipo))return;provaSair(true);};
function provaSair(fim){if(PV){try{PV.lock&&PV.lock.release();}catch(e){}if(fim){PV.fase="fim";}}provaSalvaLocal();PV=null;try{localStorage.removeItem("mu_prova");}catch(e){}
  const d=$("prova");if(d)d.remove();document.body.classList.remove("modo-prova");document.body.style.overflow="";try{if(document.fullscreenElement)document.exitFullscreen();}catch(e){}if(fim)rr();}
/* emergência: segurar 3 segundos */
(function(){let tm=null;const solta=()=>{clearTimeout(tm);tm=null;const b=$("pvEm");if(b)b.classList.remove("seg");};
  document.addEventListener("pointerdown",e=>{const b=e.target.closest&&e.target.closest("#pvEm");if(!b)return;b.classList.add("seg");tm=setTimeout(()=>{solta();
      const F=fdsDoc(),x=F.d[TODAY()]=F.d[TODAY()]||{};x.emerg=Date.now()+15*60000;x.esc=(x.esc||0)+1;save(F);if(PV)PV.fase=PV.fase==="capa"?"capa":PV.fase;const salvo=PV;provaSair(false);
      if(salvo){try{localStorage.setItem("mu_prova",JSON.stringify(salvo));}catch(e){}}setTimeout(()=>toast("siren","Liberado por 15 minutos","Depois a prova volta de onde parou."),200);},3000);});
  ["pointerup","pointercancel","pointerleave"].forEach(ev=>document.addEventListener(ev,solta,true));})();
/* voltar não sai da prova; toasts e avisos ficam mudos */
window.addEventListener("popstate",e=>{if($("prova")){e.stopImmediatePropagation();GUARD=false;guard();const a=$("pvAviso");if(a)a.textContent="Termine a prova para sair. Em emergência, segure o botão de emergência.";}},true);
const _toast68=toast;toast=function(){if(document.body.classList.contains("modo-prova"))return;return _toast68.apply(this,arguments);};
if(typeof notify==="function"){const _not68=notify;notify=function(){if(document.body.classList.contains("modo-prova"))return;return _not68.apply(this,arguments);};}
/* relógio da prova */
setInterval(()=>{if(!PV||PV.fase!=="q")return;const t=$("pvTm");if(PV.tipo==="livre"){const resta=PV.ini+PV.dur-Date.now();if(resta<=0){provaFechar();return;}if(t)t.innerHTML=`${ic("timer")} ${pvTempo(resta)}`;}else if(t)t.innerHTML=`${ic("timer")} ${pvTempo(Date.now()-PV.ini)}`;},1000);
/* portão do fim de semana */
function fdsConferir(){try{if(!$("prova")&&fdsPrecisa())provaAbrir({tipo:"fds"});}catch(e){console.warn("fds",e);}}
const _start68=startApp;startApp=function(){const r=_start68.apply(this,arguments);setTimeout(fdsConferir,1200);return r;};
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")setTimeout(fdsConferir,600);});
setInterval(fdsConferir,60000);
/* entrada pelo IBGE e Ajustes */
ACT.provaLivre=()=>provaAbrir({tipo:"livre"});
const _ibge68=VIEWS.ibge;VIEWS.ibge=function(){const h=_ibge68.apply(this,arguments);const b=`<button class="crbtn" data-a="provaLivre">${ic("clipboard-check")} Simulado em modo prova<span class="tiny">60 questões · 4 horas · tela cheia, sem distração</span></button>`;const i=h.indexOf("</header>");return i<0?h:h.slice(0,i+9)+b+h.slice(i+9);};
ACT.fdsLiga=()=>{const c=cfg();c.fdsProva=!fdsLigado();save(c);rr();};
AJ42.push(()=>ajLinha("fdsLiga","clipboard-check","Simulado de fim de semana","Sábado e domingo, o app abre depois de 20 questões no modo prova e convida para mais 40.",ajTg(fdsLigado())));
