"use strict";
/* ======================================================================
   KEGEL · PROGRAMA "RESISTÊNCIA" (nome discreto de propósito)
   Treino de 15 a 20 minutos em 3 fases (12 semanas) para controle e resistência do assoalho pélvico:
   força máxima, resistência, contração rápida ao sinal, precisão (elevador), bloqueio com respiração
   e, tão importante quanto, relaxar (Kegel reverso). Usa o mesmo player guiado do Kegel.
   Dados: um documento c:"kres" {n (sessões feitas), log:[datas], testes:[{d,seg,rap}], fase (manual, opcional)}
   ====================================================================== */
const RES_FASES=[
  {n:"Base e consciência",desde:0,sub:"Encontrar o músculo, contrair e soltar com precisão."},
  {n:"Força e precisão",desde:20,sub:"Mais força, mais tempo segurando e controle por andares."},
  {n:"Domínio",desde:40,sub:"Resistência longa, reação rápida e bloqueio automático."}];
const resDoc=()=>single("kres",{n:0,log:[],testes:[],fase:null});
const resFase=()=>{const r=resDoc();if(r.fase!=null)return r.fase;let f=0;RES_FASES.forEach((x,i)=>{if((r.n||0)>=x.desde)f=i;});return f;};
function resPlano(f){
  const resp={id:"rresp",n:"Respiração e consciência",pos:"Deitado",img:"breath",tipo:"breath",reps:f?5:6,c:4,r:6,como:"Barriga sobe ao inspirar, desce ao soltar o ar. Deixe a região do períneo totalmente solta e só perceba o movimento."};
  const rev={id:"rrev",n:"Soltar com controle (Kegel reverso)",pos:"Deitado",img:"relax",tipo:"rev",reps:8,c:f>1?5:4,r:f>1?7:6,como:"Ao puxar o ar, deixe a região descer e abrir de leve, como no fim de uma respiração tranquila. Ao soltar o ar, relaxe ainda mais. Sem força: é aprender a soltar quando você quiser."};
  const lent={id:"rlent",n:"Contrações máximas lentas",pos:"Deitado, joelhos dobrados",img:"slow",tipo:"cr",reps:[10,8,7][f],c:[5,8,10][f],r:10,como:"Contraia com força total, para dentro e para cima, e segure respirando normalmente. Solte por completo no descanso. Glúteos, coxas e barriga ficam soltos."};
  const rap={id:"rrap",n:"Contrações rápidas",pos:"Sentado",img:"quick",tipo:"cr",reps:[12,15,20][f],c:1,r:1,series:[2,3,3][f],pausa:[20,20,10][f],como:"Contração forte e rápida, solta na hora. Qualidade antes de velocidade: cada uma completa, cada soltura completa."};
  const sub={id:"rsub",n:"Sustentação a meia força",pos:"Sentado",img:"long",tipo:"cr",reps:[3,3,2][f],c:[20,30,40][f],r:20,lvl:.5,lc:"Segure a meia força e respire",como:"Contraia com cerca de metade da força e mantenha pelo tempo todo, respirando devagar. É a base da resistência."};
  const elev={id:"relev",n:f?"Elevador (5 andares)":"Elevador (3 andares)",pos:"Sentado",img:"elev",tipo:"elev",andares:f?5:3,reps:f?4:5,step:2,top:[3,4,6][f],r:8,como:"Suba a contração andar por andar até o máximo e desça com o mesmo controle. Treina a precisão: escolher exatamente quanta força usar."};
  const react={id:"rreact",n:"Reação ao sinal",pos:"Sentado",img:"quick",tipo:"react",reps:[10,12,15][f],c:f>1?1:2,esp:f>1?[2,4,3,5,2,6,3]:[3,5,4,6,3,5],como:"Fique solto e atento. No sinal sonoro, contraia o mais rápido possível e solte. Treina o reflexo de contrair na hora certa."};
  const bloq={id:"rbloq",n:"Bloqueio com respiração",pos:"Sentado",img:"breath2",tipo:"cr",reps:6,c:f>1?10:8,r:15,lc:"Contração máxima · respire devagar",lr:"Solte tudo e respire",como:"Contração máxima mantida enquanto você respira lento pelo nariz, sem prender o ar. Depois solte por completo. É a técnica de controle que você vai usar no dia a dia."};
  const pe={id:"rpe",n:"Contrações em pé",pos:"Em pé",img:"stand",tipo:"cr",reps:[8,6,6][f],c:[5,8,10][f],r:10,como:"O mesmo movimento, agora contra a gravidade. Postura alta, glúteos e barriga soltos."};
  const fim=f>1?{...rev,id:"rfim",n:"Relaxamento final",reps:6,c:4,r:6,como:"Termine soltando a região por completo. Relaxar bem evita tensão acumulada."}:{id:"rfim",n:"Relaxamento final",pos:"Deitado",img:"relax",tipo:"breath",reps:6,c:4,r:6,como:"Respire devagar e deixe toda a região solta."};
  return f===0?[resp,rev,lent,rap,sub,elev,react,pe,fim]:[resp,rev,lent,rap,sub,elev,react,bloq,pe,fim];}
const resTotal=f=>sum(kgTimelineP(resPlano(f)).map(s=>s.d));

/* ---------- tela: abas no Kegel ---------- */
const _kegelView=VIEWS.kegel;VIEWS.kegel=function(){const ab=VIEW.kp||"dia";
  const tabs=`<div class="tabs" style="margin:2px 0 12px">${[["dia","Treino diário"],["res","Resistência"]].map(([k,n])=>`<button data-a="kpTab" data-v="${k}" aria-pressed="${k===ab}">${n}</button>`).join("")}</div>`;
  if(ab!=="res"){const h=_kegelView.apply(this,arguments);return h.replace("</header>","</header>"+tabs);}
  const r=resDoc(),f=resFase(),F=RES_FASES[f],P=resPlano(f),t=TODAY(),hoje=(r.log||[]).includes(t);
  const prox=RES_FASES[f+1],falta=prox?Math.max(0,prox.desde-(r.n||0)):0;
  let h=topbar("Exercício de Kegel","kegel")+tabs;
  h+=`<div class="hero"><div class="muted small">Fase ${f+1} de 3 · ${esc(F.n)}</div><h2>${hoje?"✓ Sessão feita hoje":"Sessão de "+mmTot(Math.round(resTotal(f)))}</h2><div class="muted small">${esc(F.sub)}</div>
    <div class="stats"><div><b>${r.n||0}</b><span>sessões</span></div><div><b>${resSeq()}</b><span>dias seguidos</span></div><div><b>${prox?falta:"—"}</b><span>${prox?"para a fase "+(f+2):"fase final"}</span></div></div>
    <button class="btn full" style="margin-top:14px;padding:16px;font-size:1.05rem" data-a="resStart">${ic("play")} ${hoje?"Treinar de novo":"Iniciar sessão guiada"}</button></div>`;
  h+=`<div class="sec"><h2>Fases</h2></div><div class="seg">${RES_FASES.map((x,i)=>`<button data-a="resFase" data-v="${i}" aria-pressed="${i===f}">${i+1}. ${x.n.split(" ")[0]}</button>`).join("")}</div>
    <div class="tiny faint" style="margin-top:6px">A fase avança sozinha conforme as sessões (20 por fase). Faça 5 a 6 sessões por semana; nos outros dias, só a respiração e o soltar.</div>`;
  h+=`<div class="sec"><h2>Exercícios desta fase</h2></div>`+P.map((b,i)=>{const T=kgTimelineP([b]).filter(s=>s.k!=="prep"),sec=sum(T.map(s=>s.d));
    return `<div class="kgx"><div class="kgimg">${kgSVG(b.img)}</div><div class="grow"><div class="row"><span class="kgn">${i+1}</span><b class="grow">${esc(b.n)}</b><span class="chip">${mmTot(Math.round(sec))}</span></div><div class="meta"><span class="chip m">${esc(b.pos)}</span></div><p class="small muted" style="margin:6px 0 0">${esc(b.como)}</p></div></div>`;}).join("");
  const T=(r.testes||[]).slice(-6);
  h+=`<div class="sec"><h2>Teste de controle</h2><button class="lk" data-a="resTeste">${ic("plus")} Registrar</button></div>
    <div class="card small">${T.length?`<div class="ctlog" style="font-weight:800"><span>Data</span><span class="grow">Segurou (máx.)</span><span>Rápidas em 10 s</span></div>`+T.map(x=>`<div class="ctlog"><span class="faint">${fdate(x.d)}</span><span class="grow">${x.seg} s</span><span>${x.rap}</span></div>`).join("")
      +(T.length>1?`<p class="tiny muted" style="margin:8px 0 0">${ic("trending-up")} Desde o primeiro teste: ${T[T.length-1].seg-T[0].seg>=0?"+":""}${T[T.length-1].seg-T[0].seg} s segurando e ${T[T.length-1].rap-T[0].rap>=0?"+":""}${T[T.length-1].rap-T[0].rap} rápidas.</p>`:"")
      :`<p class="muted" style="margin:0">Uma vez por semana: quanto tempo você segura a contração máxima e quantas contrações rápidas e completas faz em 10 segundos. É o seu termômetro de evolução.</p>`}</div>`;
  h+=`<div class="sec"><h2>Como tirar o máximo</h2></div><div class="card small kgtips">
    <p><b>Por que funciona:</b> um assoalho pélvico forte e, principalmente, bem controlado (que contrai e relaxa quando você quer) dá mais domínio sobre os reflexos da região. Por isso o programa treina força, resistência, reação e também soltar.</p>
    <p><b>No dia a dia:</b> respiração lenta e região solta mantêm a intensidade baixa. Quando ela subir, use o bloqueio: contração máxima por 5 a 10 segundos com respiração lenta, depois solte. Com as semanas, isso fica automático.</p>
    <p><b>Não exagere:</b> mais não é melhor. Músculo sempre tenso perde controle; os exercícios de soltar fazem parte do resultado.</p>
    <p class="muted"><b>Atenção:</b> se sentir dor, ardência ou tensão constante na região, priorize os exercícios de soltar e procure um urologista ou fisioterapeuta pélvico. Este programa não substitui avaliação profissional.</p></div>`;
  return `<div class="app">${h}</div>`;};
function resSeq(){const L=new Set(resDoc().log||[]);let n=0,d=TODAY();if(!L.has(d))d=addDays(d,-1);while(L.has(d)){n++;d=addDays(d,-1);}return n;}
ACT.kpTab=el=>{VIEW.kp=el.dataset.v;rr();};
ACT.resFase=el=>{const r=resDoc();const v=+el.dataset.v;let auto=0;RES_FASES.forEach((x,i)=>{if((r.n||0)>=x.desde)auto=i;});r.fase=v===auto?null:v;save(r);rr();};
ACT.resTeste=()=>{sheet(`<h2>Teste de controle</h2><p class="muted small" style="margin:4px 0 0">Descansado, sentado. Faça cada teste uma vez.</p>
   <label class="fld"><span>Quanto tempo segurou a contração máxima (segundos)</span><input id="rtS" inputmode="numeric" placeholder="Ex.: 12"></label>
   <label class="fld"><span>Quantas contrações rápidas e completas em 10 segundos</span><input id="rtR" inputmode="numeric" placeholder="Ex.: 8"></label>
   <div class="btns"><button class="btn full" id="rtOk">Salvar teste</button></div>`,s=>{s.querySelector("#rtOk").onclick=()=>{const seg=Math.round(num(s.querySelector("#rtS").value)),rap=Math.round(num(s.querySelector("#rtR").value));
     if(!(seg>0)||!(rap>=0))return toast("triangle-alert","Preencha os dois testes","");const r=resDoc();r.testes=(r.testes||[]).concat([{d:TODAY(),seg,rap}]);save(r);closeSheet();rr();toast("trending-up","Teste registrado",seg+" s · "+rap+" rápidas");};});};

/* ---------- player: usa o mesmo do Kegel ---------- */
ACT.resStart=async()=>{const f=resFase(),P=resPlano(f),T=kgTimelineP(P);KG={lv:"int",res:f,T,i:0,t0:Date.now(),el:0,pause:false,som:true,vib:true,tot:sum(T.map(s=>s.d)),plano:P};
  try{KGA=KGA||new (window.AudioContext||window.webkitAudioContext)();KGA.resume&&KGA.resume();}catch(e){}
  try{if(navigator.wakeLock)KG.lock=await navigator.wakeLock.request("screen");}catch(e){}
  let d=$("kgp");if(!d){d=document.createElement("div");d.id="kgp";d.className="kgp";document.body.appendChild(d);}document.body.style.overflow="hidden";guard();kgPhase(true);KG.timer=setInterval(kgTick,100);};
function resRegistrar(k,parcial){const t=TODAY(),r=resDoc();r.log=r.log||[];if(!r.log.includes(t)){r.log.push(t);r.n=(r.n||0)+1;}save(r);
  const id=tid("kegel",t),ex=getD(id);save({...(ex||{}),id,c:"trk",k:"kegel",d:t,t:"Treino de Kegel",s:(ex&&ex.s&&!/Resist/.test(ex.s)?ex.s+" + ":"")+"Resistência · fase "+(k.res+1)+(parcial?"":" · "+mmTot(Math.round(k.tot)))});}
const _kgDoneRes=kgDone;kgDone=function(){if(!KG||KG.res==null)return _kgDoneRes.apply(this,arguments);const f0=resFase();const k=kgEnd();resRegistrar(k,false);
  kgBeep(990,300);if(navigator.vibrate)navigator.vibrate([120,80,120,80,200]);rr();const f1=resFase();
  toast("medal",f1>f0?"Nova fase liberada: "+RES_FASES[f1].n:"Sessão concluída",mmTot(Math.round(k.tot))+" · "+resSeq()+(resSeq()===1?" dia seguido":" dias seguidos"));};
const _kgCloseRes=ACT.kgClose;ACT.kgClose=()=>{if(!KG||KG.res==null)return _kgCloseRes();const done=KG.i/KG.T.length;
  confirmSheet("Encerrar a sessão?",done>.8?"Você está quase no fim. Se encerrar agora, a sessão conta.":"A sessão não será registrada.","Encerrar",()=>{const k=kgEnd();if(done>.8&&k)resRegistrar(k,true);rr();});};
