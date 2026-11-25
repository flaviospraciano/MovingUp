"use strict";
/* ======================================================================
   4.2 · TREINOS
   · Sem "treino mínimo". Com 2 dias ou mais sem academia ou outro treino, o app mostra urgência máxima
     para o próximo treino: no topo do Início, nos avisos com o app fechado e na fala do Jarvis.
   · Contador de flexões e agachamentos pela câmera (MediaPipe Pose, roda no próprio celular, nada vai para a internet):
     conta as repetições da Semana do desafio e marca a série sozinho quando bate a meta.
   · Importar corrida do relógio por arquivo (GPX, TCX, FIT, ZIP do Strava ou do Garmin) ou compartilhando o arquivo.
   · Strava conectado: os treinos entram sozinhos (com o app aberto e, com o app fechado, pelo robô do GitHub).
   · A sua semana numa imagem para postar (1080 × 1920).
   ====================================================================== */
const TREINO_KS=["gym","run","swim","cap","hiit"];
/* ---------- urgência ---------- */
function diasSemTreino(){const S=new Set();all("trk").forEach(x=>{if(TREINO_KS.includes(x.k))S.add(x.d);});all("trc").forEach(x=>{if(x.d)S.add(x.d);});if(!S.size)return 0;
  const t=TODAY();if(S.has(t))return 0;let exc={};try{exc=(typeof acad==="function"?acad().exc:{})||{};}catch(e){}let n=0,d=addDays(t,-1),g=0;
  while(!S.has(d)&&g<120){const e=exc[d];if(!(e==="off"||(e&&e.off)))n++;d=addDays(d,-1);g++;}return n;}
function proxTreino(){const t=TODAY();
  try{if(typeof acadOn==="function"&&acadOn()){const P=typeof acadPrevistos==="function"?acadPrevistos(10):{};for(let i=0;i<8;i++){const d=addDays(t,i);if(acadPlan(d)){const A=acad(),dw=pd(d).getDay(),h=(A.horas&&A.horas[dw])||A.hora||(typeof horaTreino==="function"?horaTreino():"");const tr=P[d];return{d,h,nome:"Academia"+(tr&&tr.letra?" · Treino "+tr.letra:""),k:"gym",tr:tr&&tr.id};}}}}catch(e){}
  try{const M=mpDoc();if(M.ini){const L=[];Object.values(M.W||{}).forEach(W=>{if(!W.fechada)W.sess.forEach(x=>{if(x.st===""&&x.d>=t)L.push(x);});});L.sort((a,b)=>a.d.localeCompare(b.d));if(L[0])return{d:L[0].d,h:"06:30",nome:"Corrida · "+L[0].nome,k:"run"};}}catch(e){}
  return{d:t,h:"",nome:"Qualquer treino",k:""};}
function urgFrase(n){return n===2?"Dois dias parado. Hoje não tem negociação: o próximo treino é a prioridade número um do dia.":n===3?"Três dias sem treinar. Cada dia a mais pesa o dobro amanhã. Levanta e vai.":`${n} dias sem treinar. Alerta máximo: o seu corpo e a sua sequência estão esperando por você agora.`;}
function urgCd(P){if(P.d!==TODAY()||!P.h)return"";const ms=dtOf(P.d,P.h)-new Date();if(ms<=0)return"o horário já passou: vai assim mesmo, agora";const m=Math.round(ms/60000);return "faltam "+(m>=60?Math.floor(m/60)+"h"+(m%60?pad(m%60):""):m+" min");}
function urgHTML(){const n=diasSemTreino();if(n<2)return"";const P=proxTreino(),cd=urgCd(P);
  return `<div class="urg" role="alert"><div class="urg-top"><span class="urg-ic">${ic("siren")}</span><div class="grow"><b class="urg-n">${n} DIAS SEM TREINO</b><span class="urg-s">${esc(urgFrase(n))}</span></div></div>
   <div class="urg-prox">${ic("calendar-clock")} Próximo: <b>${esc(P.nome)}</b> · ${P.d===TODAY()?"hoje":esc(DOW[pd(P.d).getDay()])+", "+fdate(P.d).slice(0,5)}${P.h?" às "+esc(P.h):""}${cd?` · <b id="urgCd">${esc(cd)}</b>`:""}</div>
   <div class="btns h"><button class="btn urg-b" data-a="urgVai">${ic("zap")} Vou treinar agora</button><button class="btn ghost urg-g" data-a="urgFeito">${ic("check")} Já treinei hoje</button></div></div>`;}
const urgEscolha=(acao,tit)=>sheet(`<h2>${tit}</h2><div class="camgrid">${TREINO_KS.filter(k=>MODS[k]).map(k=>`<button class="camat" style="--cma:${MODS[k].c1};--cmb:${MODS[k].c2}" data-a="${acao}" data-k="${k}"><span class="mb">${ic(MODS[k].ic)}</span>${esc(MODS[k].n)}</button>`).join("")}</div>`);
ACT.urgVai=()=>{const P=proxTreino();if(P.k==="gym"&&P.tr)return go({v:"trk",k:"gym",sub:"tr",trId:P.tr});if(P.k)return go(MODS[P.k].v);urgEscolha("urgIr","Qual treino agora?");};
ACT.urgIr=el=>{closeSheet();go(MODS[el.dataset.k].v);};
ACT.urgFeito=()=>urgEscolha("urgReg","O que você treinou hoje?");
ACT.urgReg=el=>{closeSheet();trkSheet(el.dataset.k,TODAY());};
ACT.acadMin=()=>ACT.urgVai();
const _home65=VIEWS.home;VIEWS.home=function(){const h=_home65.apply(this,arguments);const u=urgHTML();if(!u)return h;
  try{if(localStorage.getItem("mu_urg_vib")!==TODAY()){localStorage.setItem("mu_urg_vib",TODAY());setTimeout(()=>{try{navigator.vibrate&&navigator.vibrate([250,120,250,120,500]);}catch(e){}},600);}}catch(e){}
  const i=h.indexOf('<div class="perh');return i<0?u+h:h.slice(0,i)+u+h.slice(i);};
const _secAcad65=secAcad;secAcad=function(){if(diasSemTreino()>=2)return"";return _secAcad65.apply(this,arguments);};
setInterval(()=>{const e=$("urgCd");if(e){const c=urgCd(proxTreino());if(c)e.textContent=c;}},30000);
if(typeof pushFila==="function"){const _pf65=pushFila;pushFila=function(){const F=_pf65.apply(this,arguments);try{const now=Date.now(),t=TODAY(),n=diasSemTreino(),P=proxTreino();
    const add=(k,at,tt,b)=>{if(at>now)F.push({k,at:Math.round(at),t:tt,b,rep:""});};
    if(n>=2){add("urg_m_"+t,pushEm(t,"07:00"),`🚨 ${n} dias sem treino`,"O próximo treino é a prioridade máxima de hoje"+(P.d===t&&P.h?": "+P.h+".":"."));add("urg_t_"+t,pushEm(t,"12:30"),`🚨 Ainda dá: ${n} dias sem treino`,"Bloqueie a agenda e vá. Sem negociação.");
      if(P.d===t&&P.h)add("urg_h_"+t,pushEm(t,P.h)-60*60000,"🚨 Treino em 1 hora",`${n} dias parado. ${P.nome} às ${P.h}. Prepare a roupa agora.`);}
    if(n>=1){const am=addDays(t,1);add("urg_a_"+am,pushEm(am,"07:00"),`🚨 ${n+1} dias sem treino`,"Se hoje não rolar, amanhã é alerta máximo. Comece o dia pelo treino.");}}catch(e){}return F;};}
if(typeof jsAbertura==="function"){const _jsAb65=jsAbertura;jsAbertura=function(){const r=_jsAb65.apply(this,arguments);const n=diasSemTreino();if(n<2)return r;const P=proxTreino();
  const msg=`${n} dias sem treino. O próximo treino é prioridade máxima${P.d===TODAY()&&P.h?", hoje às "+P.h.replace(":00","h"):""}.`;
  const resto=r&&r.txt?r.txt.replace(/^[^.]*\.\s*/,"").replace(/(faz dois dias que não tem academia|ontem não teve academia)(, | e )?/i,"").replace(/Começamos pelo treino mínimo\?/,"").trim():"";
  return{txt:`${jsSaud()}, ${jsNome()}. ${msg}${resto&&resto.length>3?" Também: "+resto.charAt(0).toLowerCase()+resto.slice(1):""} Vamos treinar?`,acao:{a:"urgVai",t:"Treinar agora",p:"Vamos treinar?"}};};}

/* ---------- contador de repetições pela câmera ---------- */
const MP_V="0.10.14",MP_BASE=`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_V}`,MP_MODELO="https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";
const CR_CFG={flex:{baixo:100,alto:150,pts:[[11,13,15],[12,14,16]],nome:"Flexões",dica:"Celular no chão, de lado, a uns 2 metros: preciso ver ombro, cotovelo e mão."},
  agach:{baixo:115,alto:160,pts:[[23,25,27],[24,26,28]],nome:"Agachamentos",dica:"Celular em pé, de frente ou de lado, a uns 2 metros: preciso ver quadril, joelho e tornozelo."}};
function crAng(a,b,c){const x1=a.x-b.x,y1=a.y-b.y,x2=c.x-b.x,y2=c.y-b.y,d=Math.hypot(x1,y1)*Math.hypot(x2,y2);if(!d)return 180;return Math.acos(Math.max(-1,Math.min(1,(x1*x2+y1*y2)/d)))*180/Math.PI;}
/* um passo do contador: S = {tipo, fase, n, ema}; L = 33 pontos do corpo (x, y de 0 a 1, visibility) */
function crPasso(S,L){const C=CR_CFG[S.tipo],vis=i=>L[i]?(L[i].visibility==null?1:L[i].visibility):0;
  const s=C.pts.map(p=>({p,v:Math.min(vis(p[0]),vis(p[1]),vis(p[2]))})).sort((a,b)=>b.v-a.v)[0];if(!s||s.v<.5)return{st:"sem"};
  const ang=crAng(L[s.p[0]],L[s.p[1]],L[s.p[2]]);S.ema=S.ema==null?ang:S.ema*.55+ang*.45;
  if(S.tipo==="flex"){const sh=vis(11)>vis(12)?L[11]:L[12],hp=vis(23)>vis(24)?L[23]:L[24];if(sh&&hp&&Math.max(vis(11),vis(12))>.4&&Math.max(vis(23),vis(24))>.4){const a=Math.abs(Math.atan2(hp.y-sh.y,hp.x-sh.x)*180/Math.PI);if(Math.min(a,180-a)>50)return{st:"postura",ang:S.ema};}}
  let conta=false;if(S.fase==="alto"&&S.ema<C.baixo)S.fase="baixo";else if(S.fase==="baixo"&&S.ema>C.alto){S.fase="alto";S.n++;conta=true;}
  return{st:"ok",ang:S.ema,conta,fase:S.fase};}
let CR=null;
async function crModelo(){if(window.__mpPose)return window.__mpPose;const V=await import(MP_BASE+"/vision_bundle.mjs");const fs=await V.FilesetResolver.forVisionTasks(MP_BASE+"/wasm");
  const op=d=>({baseOptions:{modelAssetPath:MP_MODELO,delegate:d},runningMode:"VIDEO",numPoses:1,minPoseDetectionConfidence:.5,minPosePresenceConfidence:.5,minTrackingConfidence:.5});
  let pl;try{pl=await V.PoseLandmarker.createFromOptions(fs,op("GPU"));}catch(e){pl=await V.PoseLandmarker.createFromOptions(fs,op("CPU"));}window.__mpPose=pl;return pl;}
const crDesafio=tipo=>{try{const t=TODAY(),D=desDados(),w=desSemana(t);return DES[w][0]===tipo?{D,w,meta:desReps(D,tipo)}:null;}catch(e){return null;}};
const crSerieAtual=()=>{const t=TODAY(),S=desSer(desDados(),t).slice();while(S.length<DES_SERIES)S.push(0);return S.findIndex(x=>!x);};
async function camRepAbrir(tipo){if($("camrep"))return;const C=CR_CFG[tipo];if(!C)return;const des=crDesafio(tipo);
  CR={tipo,S:{tipo,fase:"alto",n:0,ema:null},meta:des?des.meta:(tipo==="flex"?15:20),des:!!des,som:true,face:"user",st:"",desc:0,fim:false};
  const d=document.createElement("div");d.id="camrep";d.className="camrep";document.body.appendChild(d);document.body.style.overflow="hidden";guard();
  d.innerHTML=`<video id="crV" playsinline muted autoplay></video><canvas id="crC"></canvas><div class="cr-top"><button class="ib" data-a="camrepFechar" aria-label="Fechar">${ic("x")}</button><div class="grow"><b>${C.nome}</b><span class="tiny" id="crSer"></span></div><button class="ib" data-a="crSom" aria-label="Som">${ic("volume-2")}</button><button class="ib" data-a="crVira" aria-label="Trocar câmera">${ic("switch-camera")}</button></div>
   <div class="cr-msg" id="crMsg">Preparando o contador… na primeira vez ele baixa uns 10 MB.</div><div class="cr-n"><b id="crN">0</b><span id="crMeta">de ${CR.meta}</span></div>
   <div class="cr-bt"><button class="btn ghost sm" data-a="crMais" data-d="-1">−1</button><button class="btn ghost sm" data-a="crMais" data-d="1">+1</button></div>`;
  crSer();try{CR.lock=navigator.wakeLock?await navigator.wakeLock.request("screen"):null;}catch(e){}
  try{await crCamera();}catch(e){crMsg("Não consegui abrir a câmera. Libere a câmera para o Moving Up nas configurações.");return;}
  try{CR.pl=await crModelo();}catch(e){console.warn(e);crMsg("Não consegui carregar o contador (precisa de internet na primeira vez).");return;}
  if(!CR)return;crMsg(C.dica);CR.loop=requestAnimationFrame(crLoop);}
async function crCamera(){const v=$("crV");if(CR.stream)CR.stream.getTracks().forEach(t=>t.stop());CR.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:CR.face,width:{ideal:640},height:{ideal:480}},audio:false});v.srcObject=CR.stream;v.classList.toggle("esp",CR.face==="user");await v.play().catch(()=>{});}
function crMsg(t){const m=$("crMsg");if(m)m.textContent=t;}
function crSer(){const e=$("crSer");if(!e||!CR)return;if(!CR.des){e.textContent="treino livre · fora da semana deste exercício no desafio";return;}const i=crSerieAtual();e.textContent=i<0?"desafio de hoje completo":`série ${i+1} de ${DES_SERIES} · meta ${CR.meta}`;}
const CR_LIG=[[11,12],[11,13],[13,15],[12,14],[14,16],[11,23],[12,24],[23,24],[23,25],[25,27],[24,26],[26,28]];
function crLoop(){if(!CR||!$("camrep"))return;const v=$("crV"),c=$("crC");
  if(v.readyState>=2&&CR.pl&&!CR.desc&&!CR.fim){const ts=performance.now();if(v.currentTime!==CR.vt){CR.vt=v.currentTime;let res=null;try{res=CR.pl.detectForVideo(v,ts);}catch(e){}
      const L=res&&res.landmarks&&res.landmarks[0];c.width=c.clientWidth;c.height=c.clientHeight;const g=c.getContext("2d");g.clearRect(0,0,c.width,c.height);
      if(L){const r=crPasso(CR.S,L);crDesenha(g,c,v,L,r.st);
        if(r.st==="sem")crMsg(CR_CFG[CR.tipo].dica);else if(r.st==="postura")crMsg("Fique na posição de flexão, com o corpo reto.");else crMsg(r.fase==="baixo"?"Isso, agora sobe!":"Desça até o fim e suba.");
        if(r.conta)crConta();}else crMsg("Não estou te vendo inteiro. Afaste o celular.");}}
  CR.loop=requestAnimationFrame(crLoop);}
function crDesenha(g,c,v,L,st){const vw=v.videoWidth||640,vh=v.videoHeight||480,sc=Math.max(c.width/vw,c.height/vh),ox=(c.width-vw*sc)/2,oy=(c.height-vh*sc)/2,esp=CR.face==="user";
  const P=i=>[(esp?1-L[i].x:L[i].x)*vw*sc+ox,L[i].y*vh*sc+oy];g.lineWidth=6;g.lineCap="round";g.strokeStyle=st==="ok"?(CR.S.fase==="baixo"?"#F97316":"#22C55E"):"rgba(255,255,255,.55)";
  CR_LIG.forEach(([a,b])=>{if((L[a].visibility||1)<.4||(L[b].visibility||1)<.4)return;const p=P(a),q=P(b);g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);g.stroke();});}
function crFala(t){if(!CR||!CR.som)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang="pt-BR";u.rate=1.15;speechSynthesis.speak(u);}catch(e){}}
function crConta(){const n=CR.S.n;const N=$("crN");if(N){N.textContent=n;N.classList.remove("pop");void N.offsetWidth;N.classList.add("pop");}try{navigator.vibrate&&navigator.vibrate(25);}catch(e){}
  if(n>=CR.meta)return crSerieFeita();crFala(String(n));}
function crSerieFeita(){CR.fim=true;crFala("Série completa!");try{navigator.vibrate&&navigator.vibrate([90,60,90,60,200]);}catch(e){}
  if(CR.des){const i=crSerieAtual();if(i>=0)ACT.desSerie({dataset:{i:String(i)}});crSer();const prox=crSerieAtual();
    if(prox<0){crMsg("Desafio de hoje completo! Ponto batido.");const b=document.querySelector(".cr-bt");if(b)b.innerHTML=`<button class="btn" data-a="camrepFechar">${ic("medal")} Concluir</button>`;return;}
    let s=+lsGet("mu_desc",60)||60;CR.desc=1;crMsg(`Série ${i+1} marcada. Descanse ${s} s.`);const tm=setInterval(()=>{if(!CR){clearInterval(tm);return;}s--;crMsg(`Descanse: ${s} s · depois, série ${prox+1}.`);
      if(s<=0){clearInterval(tm);CR.desc=0;CR.fim=false;CR.S.n=0;CR.S.fase="alto";const N=$("crN");if(N)N.textContent="0";crFala("Vai! Série "+(prox+1));crMsg("Comece a série "+(prox+1)+".");}},1000);}
  else{crMsg(`Meta de ${CR.meta} batida!`);setTimeout(()=>{if(CR){CR.fim=false;CR.S.n=0;const N=$("crN");if(N)N.textContent="0";}},2500);}}
ACT.crMais=el=>{if(!CR)return;CR.S.n=Math.max(0,CR.S.n+ +el.dataset.d);const N=$("crN");if(N)N.textContent=CR.S.n;if(+el.dataset.d>0&&CR.S.n>=CR.meta&&!CR.fim)crSerieFeita();};
ACT.crSom=()=>{if(!CR)return;CR.som=!CR.som;const b=document.querySelector('[data-a="crSom"]');if(b)b.innerHTML=ic(CR.som?"volume-2":"volume-x");};
ACT.crVira=async()=>{if(!CR)return;CR.face=CR.face==="user"?"environment":"user";try{await crCamera();}catch(e){}};
ACT.camrepFechar=()=>{if(CR){cancelAnimationFrame(CR.loop);if(CR.stream)CR.stream.getTracks().forEach(t=>t.stop());try{CR.lock&&CR.lock.release();}catch(e){}}CR=null;const d=$("camrep");if(d)d.remove();document.body.style.overflow="";try{speechSynthesis.cancel();}catch(e){}rr();};
ACT.camRep=el=>camRepAbrir(el.dataset.t);
const _secDes65=secDesafio;secDesafio=function(){const h=_secDes65.apply(this,arguments);try{const w=desSemana(TODAY()),k=DES[w][0];if(!CR_CFG[k]||desFeito(desDados(),TODAY()))return h;
  return h+`<button class="crbtn" data-a="camRep" data-t="${k}">${ic("scan-eye")} Contar ${CR_CFG[k].nome.toLowerCase()} pela câmera<span class="tiny">marca a série sozinho</span></button>`;}catch(e){return h;}};

/* ---------- importar corrida: GPX, TCX, FIT, ZIP, GZ ---------- */
const R_T=6371e3,rad=x=>x*Math.PI/180;
const hav=(a,b)=>{const dLa=rad(b[0]-a[0]),dLo=rad(b[1]-a[1]),s=Math.sin(dLa/2)**2+Math.cos(rad(a[0]))*Math.cos(rad(b[0]))*Math.sin(dLo/2)**2;return 2*R_T*Math.asin(Math.min(1,Math.sqrt(s)));};
function corPontos(P,esporte,fonte,nome){P=P.filter(p=>p.t);if(P.length<2&&!P.some(p=>p.dist))return null;let dist=0,mov=0,sub=0;const E=[];
  for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i];const dd=(a.la!=null&&b.la!=null)?hav([a.la,a.lo],[b.la,b.lo]):(b.dist!=null&&a.dist!=null?b.dist-a.dist:0),dt=(b.t-a.t)/1000;dist+=Math.max(0,dd);if(dt>0&&dt<30&&dd/dt>.5)mov+=dt;}
  const fimDist=P[P.length-1].dist;if(fimDist&&(!dist||Math.abs(fimDist-dist)/fimDist<.25||!P.some(p=>p.la!=null)))dist=fimDist;
  const al=P.map(p=>p.al).filter(x=>x!=null);for(let i=0;i<al.length;i++){const j=al.slice(Math.max(0,i-2),i+3);E.push(sum(j)/j.length);}for(let i=1;i<E.length;i++){const d=E[i]-E[i-1];if(d>.8)sub+=d;}
  const hr=P.map(p=>p.hr).filter(x=>x>30&&x<230);const tot=(P[P.length-1].t-P[0].t)/1000;const seg=Math.round(mov>tot*.5?mov:tot);
  const R=P.filter(p=>p.la!=null),passo=Math.max(1,Math.floor(R.length/140));
  return{fonte,esporte:esporte||"run",nome:nome||"",inicio:new Date(P[0].t),km:Math.round(dist/10)/100,seg,elev:Math.round(sub),fc:hr.length?Math.round(sum(hr)/hr.length):0,rota:R.filter((_,i)=>i%passo===0).map(p=>[Math.round(p.la*1e5)/1e5,Math.round(p.lo*1e5)/1e5])};}
const xNum=(el,tag)=>{const x=el.getElementsByTagName(tag)[0];return x?parseFloat(x.textContent):null;};
const xFilho=(el,local)=>[...el.getElementsByTagName("*")].find(n=>n.localName===local);
function gpxLer(txt){const X=new DOMParser().parseFromString(txt,"application/xml");const tipo=(X.getElementsByTagName("type")[0]||{}).textContent||"";const nome=((X.getElementsByTagName("trk")[0]||X).getElementsByTagName("name")[0]||{}).textContent||"";
  const P=[...X.getElementsByTagName("trkpt")].map(p=>{const tm=p.getElementsByTagName("time")[0],hr=xFilho(p,"hr");return{la:+p.getAttribute("lat"),lo:+p.getAttribute("lon"),al:xNum(p,"ele"),t:tm?Date.parse(tm.textContent):0,hr:hr?+hr.textContent:null};});
  return corPontos(P,/swim|nata/i.test(tipo)?"swim":/ride|bike|cicl/i.test(tipo)?"ride":/walk|caminh/i.test(tipo)?"walk":"run","gpx",nome);}
function tcxLer(txt){const X=new DOMParser().parseFromString(txt,"application/xml");return[...X.getElementsByTagName("Activity")].map(A=>{const sp=(A.getAttribute("Sport")||"").toLowerCase();
  const P=[...A.getElementsByTagName("Trackpoint")].map(p=>{const tm=p.getElementsByTagName("Time")[0],pos=p.getElementsByTagName("Position")[0],hr=p.getElementsByTagName("HeartRateBpm")[0];
    return{la:pos?xNum(pos,"LatitudeDegrees"):null,lo:pos?xNum(pos,"LongitudeDegrees"):null,al:xNum(p,"AltitudeMeters"),dist:xNum(p,"DistanceMeters"),t:tm?Date.parse(tm.textContent):0,hr:hr?xNum(hr,"Value"):null};});
  const a=corPontos(P,/run/.test(sp)?"run":/swim/.test(sp)?"swim":/bik/.test(sp)?"ride":"run","tcx","");if(!a)return null;
  const laps=[...A.getElementsByTagName("Lap")];const tt=sum(laps.map(l=>xNum(l,"TotalTimeSeconds")||0)),dm=sum(laps.map(l=>xNum(l,"DistanceMeters")||0));if(tt>0)a.seg=Math.round(tt);if(dm>0)a.km=Math.round(dm/10)/100;return a;}).filter(Boolean);}
/* FIT: leitura mínima das mensagens session (18) e record (20) */
function fitValor(dv,q,f,le){const bt=f.bt&31;try{switch(bt){case 0:case 2:case 10:case 13:{const v=dv.getUint8(q);return bt!==13&&v===255||bt===10&&v===0?null:v;}case 1:{const v=dv.getInt8(q);return v===127?null:v;}
  case 3:{const v=dv.getInt16(q,le);return v===32767?null:v;}case 4:case 11:{const v=dv.getUint16(q,le);return v===65535||bt===11&&v===0?null:v;}case 5:{const v=dv.getInt32(q,le);return v===2147483647?null:v;}
  case 6:case 12:{const v=dv.getUint32(q,le);return v===4294967295||bt===12&&v===0?null:v;}case 8:return dv.getFloat32(q,le);case 9:return dv.getFloat64(q,le);default:return null;}}catch(e){return null;}}
function fitLer(buf){const dv=new DataView(buf);if(buf.byteLength<14)return null;const hs=dv.getUint8(0),tam=dv.getUint32(4,true);if(String.fromCharCode(dv.getUint8(8),dv.getUint8(9),dv.getUint8(10),dv.getUint8(11))!==".FIT")return null;
  const end=Math.min(hs+tam,buf.byteLength),defs={},S=[],R=[];let p=hs,ult=0;const campos=(d,q)=>{const r={};for(const f of d.F){if(f.num>=0&&q+f.sz<=buf.byteLength){const v=fitValor(dv,q,f,d.le);if(v!=null)r[f.num]=v;}q+=f.sz;}return r;};
  const guarda=(g,r)=>{if(g===18)S.push(r);else if(g===20)R.push(r);};
  while(p<end){const h=dv.getUint8(p++);
    if(h&128){const d=defs[(h>>5)&3];if(!d)break;const r=campos(d,p);p+=d.size;const off=h&31;let ts=(ult&~31)+off;if(off<(ult&31))ts+=32;ult=ts;r[253]=ts;guarda(d.g,r);continue;}
    const lt=h&15;if(h&64){p++;const le=dv.getUint8(p++)===0,g=dv.getUint16(p,le);p+=2;const nf=dv.getUint8(p++),F=[];let size=0;for(let i=0;i<nf;i++){F.push({num:dv.getUint8(p),sz:dv.getUint8(p+1),bt:dv.getUint8(p+2)});size+=dv.getUint8(p+1);p+=3;}
      if(h&32){const nd=dv.getUint8(p++);for(let i=0;i<nd;i++){F.push({num:-1,sz:dv.getUint8(p+1),bt:0});size+=dv.getUint8(p+1);p+=3;}}defs[lt]={g,le,F,size};continue;}
    const d=defs[lt];if(!d)break;const r=campos(d,p);p+=d.size;if(r[253]!=null)ult=r[253];guarda(d.g,r);}
  const T0=631065600,sc=180/2147483648;const P=R.filter(r=>r[253]).map(r=>({t:(r[253]+T0)*1000,la:r[0]!=null?r[0]*sc:null,lo:r[1]!=null?r[1]*sc:null,al:r[2]!=null?r[2]/5-500:null,dist:r[5]!=null?r[5]/100:null,hr:r[3]||null}));
  const s=S[0]||{},esp={1:"run",5:"swim",2:"ride",11:"walk",10:"gym",4:"gym"}[s[5]]||"run";let a=corPontos(P,esp,"fit","");
  if(!a&&s[2])a={fonte:"fit",esporte:esp,nome:"",inicio:new Date((s[2]+T0)*1000),km:0,seg:0,elev:0,fc:0,rota:[]};if(!a)return null;
  if(s[9])a.km=Math.round(s[9]/1000)/100;if(s[8]||s[7])a.seg=Math.round((s[8]||s[7])/1000);if(s[16])a.fc=s[16];if(s[22]!=null)a.elev=s[22];if(s[2])a.inicio=new Date((s[2]+T0)*1000);return a;}
async function inflar(u8,modo){return new Uint8Array(await new Response(new Blob([u8]).stream().pipeThrough(new DecompressionStream(modo))).arrayBuffer());}
async function zipLer(buf){const dv=new DataView(buf),u=new Uint8Array(buf),out=[];let e=-1;for(let i=buf.byteLength-22;i>=Math.max(0,buf.byteLength-66000);i--)if(dv.getUint32(i,true)===0x06054b50){e=i;break;}if(e<0)return out;
  let p=dv.getUint32(e+16,true);const n=dv.getUint16(e+10,true);for(let k=0;k<n&&p+46<=buf.byteLength;k++){if(dv.getUint32(p,true)!==0x02014b50)break;const met=dv.getUint16(p+10,true),cs=dv.getUint32(p+20,true),nl=dv.getUint16(p+28,true),xl=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),off=dv.getUint32(p+42,true);
    const nome=new TextDecoder().decode(u.subarray(p+46,p+46+nl));p+=46+nl+xl+cl;if(!/\.(gpx|tcx|fit)(\.gz)?$/i.test(nome)||out.length>=40)continue;
    const ini=off+30+dv.getUint16(off+26,true)+dv.getUint16(off+28,true),raw=u.subarray(ini,ini+cs);try{out.push({nome,dados:met===8?await inflar(raw,"deflate-raw"):raw.slice()});}catch(err){}}
  return out;}
async function corLerArquivo(nome,u8){nome=nome.toLowerCase();if(/\.gz$/.test(nome)){u8=await inflar(u8,"gzip");nome=nome.replace(/\.gz$/,"");}
  if(u8[0]===0x50&&u8[1]===0x4b){const L=await zipLer(u8.buffer.slice(u8.byteOffset,u8.byteOffset+u8.byteLength));const R=[];for(const z of L)R.push(...await corLerArquivo(z.nome,z.dados));return R;}
  const buf=u8.buffer.slice(u8.byteOffset,u8.byteOffset+u8.byteLength);if(/\.fit$/.test(nome)||(u8.length>12&&String.fromCharCode(u8[8],u8[9],u8[10],u8[11])===".FIT")){const a=fitLer(buf);return a?[a]:[];}
  const txt=new TextDecoder().decode(u8);if(/<gpx[\s>]/i.test(txt)){const a=gpxLer(txt);return a?[a]:[];}if(/<TrainingCenterDatabase/i.test(txt))return tcxLer(txt);return[];}
const fmtSeg=s=>{s=Math.round(s||0);const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return h?`${h}:${pad(m)}:${pad(x)}`:`${m}:${pad(x)}`;};
const fmtPace=(seg,km)=>km>0&&seg>0?fmtSeg(seg/km)+"/km":"";
const corResumo=a=>[a.km?String(a.km).replace(".",",")+" km":"",a.seg?fmtSeg(a.seg):"",a.esporte==="run"?fmtPace(a.seg,a.km):"",a.elev?"↑"+a.elev+" m":"",a.fc?"❤ "+a.fc:""].filter(Boolean).join(" · ");
const rotaPares=R=>!R?[]:typeof R[0]==="number"?R.reduce((o,v,i)=>{if(i%2)o.push([R[i-1],v]);return o;},[]):R;
const rotaPlana=R=>[].concat(...(R||[]).map(p=>[p[0],p[1]]));
function rotaSVG(R,w,h,cor){R=rotaPares(R);if(!R||R.length<2)return"";const la=R.map(p=>p[0]),lo=R.map(p=>p[1]),a0=Math.min(...la),a1=Math.max(...la),o0=Math.min(...lo),o1=Math.max(...lo);const k=Math.cos(rad((a0+a1)/2));const sx=(o1-o0)*k||1e-6,sy=(a1-a0)||1e-6,s=Math.min((w-12)/sx,(h-12)/sy);
  const pts=R.map(p=>[(6+((p[1]-o0)*k)*s+((w-12)-sx*s)/2).toFixed(1),(6+(a1-p[0])*s+((h-12)-sy*s)/2).toFixed(1)].join(",")).join(" ");return `<svg viewBox="0 0 ${w} ${h}" class="rota"><polyline points="${pts}" fill="none" stroke="${cor||"#F97316"}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/></svg>`;}
const ESP_K={run:"run",swim:"swim",gym:"gym",hiit:"hiit"};
const dLocal=dt=>iso(new Date(dt.getTime()));
function corSalvar(A){const k=ESP_K[A.esporte];if(!k||!MODS[k])return false;const id=tid(k,A.d||dLocal(A.inicio)),ex=getD(id);const doc=ex?Object.assign({},ex):{id,c:"trk",k,d:A.d||dLocal(A.inicio)};
  doc.imp=(doc.imp||[]).slice();if(doc.imp.includes(A.chave))return false;doc.imp.push(A.chave);const vez=doc.imp.length;
  if(A.km)doc.km=Math.round(((vez>1?+doc.km||0:0)+A.km)*100)/100;doc.seg=(vez>1?doc.seg||0:0)+(A.seg||0);if(A.elev)doc.elev=(vez>1?doc.elev||0:0)+A.elev;if(A.fc)doc.fc=A.fc;if(A.rota&&A.rota.length&&!doc.rota)doc.rota=rotaPlana(A.rota); /* o Firestore não aceita lista dentro de lista */doc.fonte=A.fonte;
  if(!doc.t)doc.t=A.nome||({run:"Corrida",swim:"Natação",gym:"Academia",hiit:"HIIT"}[k]);if(!doc.s||doc.sAuto){doc.s=corResumo({...A,km:doc.km,seg:doc.seg,elev:doc.elev})+(A.fonte==="strava"?" · Strava":"");doc.sAuto=1;}
  save(doc);return true;}
let CORI=null;
async function corridaImportar(files){const R=[];for(const f of files){try{R.push(...await corLerArquivo(f.name||"arquivo",new Uint8Array(await f.arrayBuffer())));}catch(e){console.warn("importar",f.name,e);}}
  const L=R.filter(a=>a&&a.inicio&&!isNaN(a.inicio)).sort((a,b)=>b.inicio-a.inicio).slice(0,30);
  if(!L.length)return toast("file-question","Não achei treino nesse arquivo","Use GPX, TCX ou FIT exportados do relógio ou do Strava.");
  L.forEach(a=>{a.d=dLocal(a.inicio);a.chave=a.fonte+":"+a.inicio.getTime();a.on=!!ESP_K[a.esporte]&&!(getD(tid(ESP_K[a.esporte],a.d))||{imp:[]}).imp?.includes(a.chave);});CORI=L;corImpSheet();}
function corImpSheet(){const L=CORI;sheet(`<h2>${ic("file-up")} Importar ${L.length===1?"treino":L.length+" treinos"}</h2>
   ${L.map((a,i)=>{const k=ESP_K[a.esporte],ja=k&&(getD(tid(k,a.d))||{imp:[]}).imp?.includes(a.chave);return `<label class="corit"><input type="checkbox" data-i="${i}" ${a.on?"checked":""} ${!k||ja?"disabled":""}>${rotaSVG(a.rota,88,64)}<span class="grow"><b>${esc(a.nome||({run:"Corrida",swim:"Natação",ride:"Pedal",walk:"Caminhada",gym:"Treino"}[a.esporte]||"Treino"))} · ${esc(DOW[a.inicio.getDay()])}, ${fdate(a.d).slice(0,5)} ${pad(a.inicio.getHours())}:${pad(a.inicio.getMinutes())}</b><span class="small muted" style="display:block">${esc(corResumo(a))}</span>${ja?`<span class="tiny faint">já importado</span>`:!k?`<span class="tiny faint">sem módulo para este esporte</span>`:""}</span></label>`;}).join("")}
   <div class="btns"><button class="btn full" data-a="corImpOk">${ic("check")} Importar selecionados</button></div><p class="tiny faint" style="text-align:center">Entra no dia do treino. A sua foto e o seu título, se já existirem, são mantidos.</p>`,s=>{s.querySelectorAll('input[type="checkbox"]').forEach(c=>c.onchange=()=>{CORI[+c.dataset.i].on=c.checked;});});}
ACT.corImpOk=()=>{if(!CORI)return;let n=0;CORI.filter(a=>a.on).forEach(a=>{if(corSalvar(a))n++;});CORI=null;closeSheet();rr();toast("activity",n?(n===1?"Treino importado":n+" treinos importados"):"Nada novo para importar",n?"Já está no dia certo, com distância e ritmo.":"");};
async function corridaEscolher(){const f=await pickFiles(true,".gpx,.tcx,.fit,.zip,.gz,application/gpx+xml,application/vnd.garmin.tcx+xml,application/octet-stream,application/zip");if(f.length)corridaImportar(f);}
ACT.corEscolher=()=>corridaEscolher();

/* ---------- Strava ---------- */
const STV_MAP={Run:"run",TrailRun:"run",VirtualRun:"run",Swim:"swim",WeightTraining:"gym",Crossfit:"hiit",HighIntensityIntervalTraining:"hiit",Workout:"hiit"};
const stvCfg=()=>getD("strava")||{id:"strava",c:"strava",cid:"",sec:"",on:false,tipos:{run:1,swim:1,gym:1,hiit:1}};
const stvTok=()=>getD("stravatok");
let STV_SYNC=false,STV_ULT=0;
function polyDecode(s){if(!s)return[];const R=[];let i=0,la=0,lo=0;while(i<s.length){for(const k of [0,1]){let b,sh=0,r=0;do{b=s.charCodeAt(i++)-63;r|=(b&31)<<sh;sh+=5;}while(b>=32&&i<s.length);const d=r&1?~(r>>1):r>>1;if(k===0)la+=d;else lo+=d;}R.push([la/1e5,lo/1e5]);}return R;}
function stvGithub(){const h=location.hostname;if(!/\.github\.io$/.test(h))return"";const u=h.split(".")[0],rp=location.pathname.split("/").filter(Boolean)[0]||h;return `https://github.com/${u}/${rp}/actions/workflows/strava.yml`;}
function stvSalvarTok(j){const T=Object.assign({},stvTok()||{id:"stravatok",c:"stravatok"});Object.assign(T,{a:j.access_token,r:j.refresh_token||T.r,exp:j.expires_at});if(j.athlete)T.ath={id:j.athlete.id,nome:[j.athlete.firstname,j.athlete.lastname].filter(Boolean).join(" ")};
  delete T.codigo;delete T.erro;if(!T.desde)T.desde=Math.floor(Date.now()/1000)-3*86400;save(T);return T;}
async function stvPost(body){const r=await fetch("https://www.strava.com/oauth/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams(body).toString()});if(!r.ok)throw new Error("strava "+r.status);return r.json();}
async function stvTrocar(code){const C=stvCfg();try{const j=await stvPost({client_id:C.cid,client_secret:C.sec,code,grant_type:"authorization_code"});stvSalvarTok(j);toast("activity","Strava conectado!","Trazendo os treinos dos últimos 3 dias…");stvSync(true);}
  catch(e){console.warn("strava troca",e);save({id:"stravatok",c:"stravatok",codigo:code,codigoEm:Date.now(),desde:Math.floor(Date.now()/1000)-3*86400});const gh=stvGithub();
    sheet(`<h2>${ic("activity")} Falta um passo</h2><p class="muted small">O Strava autorizou, mas não deixa o navegador terminar a conexão sozinho. Quem termina é o robô do GitHub (o mesmo dos avisos).</p>
     <div class="note">${ic("info")} Faça agora, em até 10 minutos: abra a página abaixo, toque em <b>Run workflow</b> e depois no botão verde <b>Run workflow</b>. Em cerca de 1 minuto o Strava aparece conectado aqui.</div>
     ${gh?`<div class="btns"><a class="btn full" href="${esc(gh)}" target="_blank" rel="noopener">${ic("external-link")} Abrir o robô no GitHub</a></div>`:`<p class="tiny faint">No GitHub, abra o repositório do app → Actions → Strava do Moving Up → Run workflow.</p>`}`);}}
async function stvToken(){const T=stvTok();if(!T||!T.a)return null;if((T.exp||0)*1000>Date.now()+120000)return T.a;const C=stvCfg();if(!C.sec||!T.r)return null;
  try{const j=await stvPost({client_id:C.cid,client_secret:C.sec,grant_type:"refresh_token",refresh_token:T.r});return stvSalvarTok(j).a;}catch(e){return null;}}
async function stvSync(manual){if(STV_SYNC)return;const C=stvCfg(),T=stvTok();if(!C.on||!T||!T.a){if(manual&&T&&T.codigo)toast("activity","Conexão ainda pendente","Rode o robô do Strava no GitHub para terminar.");return;}
  STV_SYNC=true;STV_ULT=Date.now();try{const tk=await stvToken();if(!tk){if(manual)toast("activity","Strava sem acesso agora","O robô do GitHub renova o acesso em alguns minutos.");return;}
    const L=Object.assign({},getD("stravalog")||{id:"stravalog",c:"stravalog",ult:0,itens:[]});L.itens=(L.itens||[]).slice();const after=Math.max(T.desde||0,(L.ult||0)-86400);
    const r=await fetch(`https://www.strava.com/api/v3/athlete/activities?after=${after}&per_page=50`,{headers:{Authorization:"Bearer "+tk}});if(!r.ok){if(manual)toast("activity","O Strava não respondeu","Código "+r.status+". Tente de novo mais tarde.");return;}
    const A=(await r.json()).sort((x,y)=>new Date(x.start_date)-new Date(y.start_date));let n=0;
    for(const a of A){const k=STV_MAP[a.sport_type]||STV_MAP[a.type];if(!k||!(C.tipos||{})[k])continue;
      const at={chave:"strava:"+a.id,fonte:"strava",esporte:k,d:String(a.start_date_local||a.start_date).slice(0,10),inicio:new Date(a.start_date),km:Math.round((a.distance||0)/10)/100,seg:a.moving_time||a.elapsed_time||0,elev:Math.round(a.total_elevation_gain||0),fc:Math.round(a.average_heartrate||0),nome:a.name||"",rota:polyDecode(a.map&&a.map.summary_polyline).filter((_,i,x)=>i%Math.max(1,Math.floor(x.length/140))===0)};
      if(corSalvar(at)){n++;L.itens.unshift({id:a.id,d:at.d,nome:at.nome,km:at.km,k});}L.ult=Math.max(L.ult||0,Math.floor(new Date(a.start_date).getTime()/1000));}
    L.itens=L.itens.slice(0,30);L.chk=Date.now();save(L);if(n){rr();toast("activity",n===1?"Treino do Strava importado":n+" treinos do Strava importados",L.itens.slice(0,n).map(x=>x.nome||"").filter(Boolean).slice(0,2).join(" · "));}
    else if(manual)toast("check","Strava em dia","Nenhum treino novo.");}catch(e){console.warn("strava",e);if(manual)toast("activity","Não consegui falar com o Strava","Confira a internet.");}finally{STV_SYNC=false;}}
function stvForm(){const C=stvCfg();sheet(`<h2>${ic("activity")} Conectar o Strava</h2>
   <ol class="small stv-passos"><li>No navegador, abra <b>strava.com/settings/api</b> e crie um aplicativo: nome <i>Moving Up</i>, site <i>${esc(location.origin)}</i> e, em <b>Authorization Callback Domain</b>, <b>${esc(location.hostname)}</b>.</li><li>Copie o <b>Client ID</b> e o <b>Client Secret</b> e cole abaixo. Eles ficam só nos seus dados, nunca no GitHub.</li><li>Toque em <b>Conectar</b> e autorize.</li></ol>
   <label class="fld"><span>Client ID</span><input id="stvId" inputmode="numeric" value="${esc(C.cid||"")}"></label><label class="fld"><span>Client Secret</span><input id="stvSec" type="password" placeholder="${C.sec?"salvo · cole outro para trocar":""}" autocomplete="off"></label>
   <div class="fld"><span>O que importar</span><div class="wrap-row">${["run","swim","gym","hiit"].filter(k=>MODS[k]).map(k=>`<label class="chip"><input type="checkbox" data-k="${k}" ${(C.tipos||{})[k]?"checked":""}> ${esc(MODS[k].n)}</label>`).join("")}</div></div>
   <div class="btns"><button class="btn full" id="stvOk">${ic("link")} Salvar e conectar</button></div><p class="tiny faint">Com o app fechado, quem traz os treinos é o robô do GitHub, a cada 10 minutos. Veja o LEIA-ME.</p>`,s=>{
   s.querySelector("#stvOk").onclick=()=>{const cid=s.querySelector("#stvId").value.trim(),sec=s.querySelector("#stvSec").value.trim();if(!/^\d+$/.test(cid))return toast("triangle-alert","Cole o Client ID","São só números.");if(!sec&&!C.sec)return toast("triangle-alert","Cole o Client Secret","");
     const tipos={};s.querySelectorAll("input[data-k]").forEach(i=>{if(i.checked)tipos[i.dataset.k]=1;});save(Object.assign({},C,{cid,sec:sec||C.sec,tipos,on:true}));
     const st=Math.random().toString(36).slice(2);try{localStorage.setItem("mu_stv_st",st);}catch(e){}const red=location.origin+location.pathname+"?strava=1";
     location.href=`https://www.strava.com/oauth/mobile/authorize?client_id=${cid}&redirect_uri=${encodeURIComponent(red)}&response_type=code&approval_prompt=auto&scope=read,activity:read_all&state=${st}`;};});}
ACT.stvForm=()=>stvForm();ACT.stvSync=()=>stvSync(true);
ACT.stvSair=()=>confirmSheet("Desconectar o Strava?","Os treinos já importados continuam no app. Para revogar de vez, use strava.com/settings/apps.","Desconectar",()=>{const T=stvTok();LIXO_OFF++;try{if(T)removeDoc(T.id);}finally{LIXO_OFF--;}const C=stvCfg();C.on=false;save(C);rr();});
function stvLinha(){const C=stvCfg(),T=stvTok(),L=getD("stravalog");if(!C.on||!T)return ajLinha("stvForm","activity","Strava","Conecte e os treinos entram sozinhos, sem compartilhar arquivo.");
  if(T.codigo&&!T.a)return ajLinha("stvForm","activity","Strava · conexão pendente","Rode o robô do Strava no GitHub para terminar, ou conecte de novo.");
  return `<div class="tg-row"><span class="mb">${ic("activity")}</span><span class="grow"><b>Strava conectado${T.ath&&T.ath.nome?" · "+esc(T.ath.nome):""}</b><span class="tiny muted" style="display:block">${L&&L.chk?"Conferido "+fdate(iso(new Date(L.chk)))+" às "+pad(new Date(L.chk).getHours())+":"+pad(new Date(L.chk).getMinutes()):"Ainda não sincronizou"}${L&&L.itens&&L.itens[0]?" · último: "+esc(L.itens[0].nome||"")+" ("+fdate(L.itens[0].d).slice(0,5)+")":""}</span></span>
    <button class="btn ghost sm" data-a="stvSync">${ic("refresh-cw")}</button><button class="btn ghost sm" data-a="stvSair">${ic("unlink")}</button></div>`;}
AJ42.push(stvLinha);
const _start65=startApp;startApp=function(){const r=_start65.apply(this,arguments);try{const P=new URLSearchParams(location.search);if(P.get("strava")==="1"){const code=P.get("code"),st=P.get("state"),er=P.get("error");history.replaceState(null,"",location.pathname);
    let ok=true;try{const s=localStorage.getItem("mu_stv_st");ok=!s||s===st;}catch(e){}setTimeout(()=>{if(er||!code)toast("activity","Conexão com o Strava cancelada","");else if(!ok)toast("triangle-alert","Conexão do Strava recusada","Tente conectar de novo pelo app.");else stvTrocar(code);},900);}}catch(e){}
  setTimeout(()=>stvSync(false),4500);return r;};
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&Date.now()-STV_ULT>10*60000)setTimeout(()=>stvSync(false),1500);});
const _trk65=VIEWS.trk;VIEWS.trk=function(){const h=_trk65.apply(this,arguments);if(!VIEW||!["run","swim"].includes(VIEW.k)||VIEW.sub)return h;const C=stvCfg(),T=stvTok();
  const b=`<div class="btns h imprun"><button class="btn ghost" data-a="corEscolher">${ic("file-up")} Importar do relógio</button>${C.on&&T&&T.a?`<button class="btn ghost" data-a="stvSync">${ic("refresh-cw")} Strava</button>`:`<button class="btn ghost" data-a="stvForm">${ic("activity")} Conectar Strava</button>`}</div>`;
  const i=h.indexOf("</header>");return i<0?h:h.slice(0,i+9)+b+h.slice(i+9);};

/* ---------- a sua semana numa imagem ---------- */
function semanaFaixa(){const n=new Date();let ini=addDays(TODAY(),-((n.getDay()+6)%7));if(n.getDay()===1&&n.getHours()<14)ini=addDays(ini,-7);return[ini,addDays(ini,6)];}
function semanaDados(){const [de,ate]=semanaFaixa(),dentro=d=>d>=de&&d<=ate,T=all("trk").filter(x=>dentro(x.d));const por={};T.filter(x=>TREINO_KS.includes(x.k)).forEach(x=>{por[x.k]=(por[x.k]||0)+1;});
  const s=DB.docs.get("ibge")||{},D=s.dia||{};let q=0,ac=0;Object.keys(D).filter(dentro).forEach(d=>{q+=D[d].q||0;ac+=D[d].ac||0;});const cq=(getD("concq")||{d:{}}).d||{};const q2=sum(Object.keys(cq).filter(dentro).map(d=>cq[d]||0));
  const A=aguaCfg(),agua=Object.keys(A.log||{}).filter(d=>dentro(d)&&+A.log[d]>=+A.meta).length,foco=sum(all("dia").filter(x=>dentro(x.d)).map(x=>+x.foco||0));
  const tarefas=all("todo").filter(x=>x.ok&&x.feito&&dentro(x.feito)).length,hab=sum(all("hab").map(h=>Object.keys(h.dias||{}).filter(dentro).length));
  const Dd=desDados(),des=sum(Object.keys(Dd.log||{}).filter(dentro).map(d=>(Dd.log[d]||[]).filter(Boolean).length));
  return{de,ate,treinos:sum(Object.values(por)),por,km:Math.round(sum(T.filter(x=>x.k==="run").map(x=>+x.km||0))*10)/10,kegel:T.filter(x=>x.k==="kegel").length,questoes:Math.max(q,q2),acertos:ac,foco,tarefas,hab,agua,des,fotos:T.filter(x=>x.img).slice(-4)};}
async function semImg(ref){try{const u=await imgURL(ref,"f");if(!u)return null;const r=await fetch(u);if(!r.ok)return null;return await createImageBitmap(await r.blob());}catch(e){return null;}}
async function semanaCanvas(){const S=semanaDados(),W=1080,H=1920,c=document.createElement("canvas");c.width=W;c.height=H;const g=c.getContext("2d");const fam=(getComputedStyle(document.documentElement).getPropertyValue("--disp")||"").trim()||"system-ui, sans-serif";
  const bg=g.createLinearGradient(0,0,W,H);bg.addColorStop(0,"#16142E");bg.addColorStop(.55,"#3B2B8F");bg.addColorStop(1,"#C2185B");g.fillStyle=bg;g.fillRect(0,0,W,H);
  g.globalAlpha=.12;g.fillStyle="#fff";for(let i=0;i<5;i++){g.beginPath();g.arc(W*(i%2?.85:.12),300+i*360,180+i*30,0,7);g.fill();}g.globalAlpha=1;
  const txt=(t,x,y,sz,peso,cor,al)=>{g.font=`${peso||800} ${sz}px ${fam}`;g.fillStyle=cor||"#fff";g.textAlign=al||"left";g.fillText(t,x,y);};
  txt("MINHA SEMANA",80,170,62,900,"#FDE68A");txt(`${fdate(S.de).slice(0,5)} a ${fdate(S.ate).slice(0,5)}`,80,240,44,600,"rgba(255,255,255,.8)");
  txt(String(S.treinos),80,500,260,900);txt(S.treinos===1?"treino":"treinos",80,580,58,700,"rgba(255,255,255,.85)");
  const tipos=Object.entries(S.por).map(([k,n])=>`${(MODS[k]||{}).n||k} ${n}`).join(" · ");if(tipos)txt(tipos,80,650,38,600,"rgba(255,255,255,.75)");
  const tiles=[[S.km?String(S.km).replace(".",","):"0","km corridos"],[S.questoes,"questões IBGE"],[Math.round(S.foco/60*10)/10||0,"horas de foco"],[S.tarefas,"tarefas feitas"],[S.hab,"hábitos marcados"],[S.des,"séries do desafio"]];
  tiles.forEach(([v,l],i)=>{const x=80+(i%2)*470,y=730+Math.floor(i/2)*230;g.fillStyle="rgba(255,255,255,.12)";if(g.roundRect){g.beginPath();g.roundRect(x,y,440,200,36);g.fill();}else g.fillRect(x,y,440,200);txt(String(v),x+36,y+112,96,900);txt(l,x+36,y+170,34,600,"rgba(255,255,255,.8)");});
  let y0=1440;const F=[];for(const f of S.fotos){const b=await semImg(f.img);if(b)F.push(b);}
  if(F.length){const w=(W-160-(F.length-1)*20)/F.length;F.forEach((b,i)=>{const x=80+i*(w+20),hh=300;g.save();g.beginPath();if(g.roundRect)g.roundRect(x,y0,w,hh,28);else g.rect(x,y0,w,hh);g.clip();const sc=Math.max(w/b.width,hh/b.height);g.drawImage(b,x+(w-b.width*sc)/2,y0+(hh-b.height*sc)/2,b.width*sc,b.height*sc);g.restore();});}
  else{const f=S.treinos>=5?"Semana de atleta.":S.treinos>=3?"Constância é o que constrói.":"Semana que vem, mais forte.";txt(f,80,y0+150,64,800,"#FDE68A");}
  txt("Moving Up",W/2,H-90,44,800,"rgba(255,255,255,.9)","center");return c;}
async function semanaImagem(){sheet(`<h2>${ic("image")} Sua semana em uma imagem</h2><p class="muted small">Montando…</p>`);try{const c=await semanaCanvas();const url=c.toDataURL("image/png");const blob=await new Promise(r=>c.toBlob(r,"image/png"));SEMB=blob;
    sheet(`<h2>${ic("image")} Sua semana em uma imagem</h2><img src="${url}" class="semprev" alt="Resumo da semana"><div class="btns h"><button class="btn" data-a="semShare">${ic("share-2")} Compartilhar</button><button class="btn ghost" data-a="semBaixar">${ic("download")} Baixar</button></div>`);}
  catch(e){console.warn(e);sheet(`<h2>Não consegui montar a imagem</h2><p class="muted small">Tente de novo.</p>`);}}
let SEMB=null;
ACT.semShare=async()=>{if(!SEMB)return;const f=new File([SEMB],"minha-semana.png",{type:"image/png"});try{if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:"Minha semana"});return;}}catch(e){if(e&&e.name==="AbortError")return;}ACT.semBaixar();};
ACT.semBaixar=()=>{if(!SEMB)return;const a=document.createElement("a");a.href=URL.createObjectURL(SEMB);a.download="minha-semana-moving-up.png";document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},2000);};
ACT.semAbrir=()=>semanaImagem();
ACT.semX=()=>{try{localStorage.setItem("mu_sem_x_"+semanaFaixa()[0],"1");}catch(e){}rr();};
const _home65b=VIEWS.home;VIEWS.home=function(){const h=_home65b.apply(this,arguments);const n=new Date(),dw=n.getDay();if(!((dw===0&&n.getHours()>=16)||(dw===1&&n.getHours()<14)))return h;
  try{if(localStorage.getItem("mu_sem_x_"+semanaFaixa()[0]))return h;}catch(e){}
  const c=`<div class="card semc"><div class="row"><span class="mb" style="background:linear-gradient(135deg,#6366F1,#EC4899)">${ic("image")}</span><div class="grow"><b>Sua semana em uma imagem</b><span class="tiny muted" style="display:block">Pronta para postar nos stories.</span></div><button class="ib" data-a="semX" aria-label="Dispensar">${ic("x")}</button></div><button class="btn full" style="margin-top:10px" data-a="semAbrir">${ic("sparkles")} Gerar a imagem</button></div>`;
  const i=h.indexOf('<div class="copi"');return i<0?h:h.slice(0,i)+c+h.slice(i);};
/* botão do contador também na tela da Semana do desafio */
const _des65=VIEWS.des;VIEWS.des=function(){const h=_des65.apply(this,arguments);try{const k=DES[desSemana(TODAY())][0];if(!CR_CFG[k])return h;const i=h.indexOf('<div class="card des-row');if(i<0)return h;
  const feito=desFeito(desDados(),TODAY());return h.slice(0,i)+`<button class="crbtn" data-a="camRep" data-t="${k}">${ic("scan-eye")} Contar ${CR_CFG[k].nome.toLowerCase()} pela câmera<span class="tiny">${feito?"o ponto de hoje já foi batido · treino livre":"conta as repetições e marca a série sozinho"}</span></button>`+h.slice(i);}catch(e){return h;}};
