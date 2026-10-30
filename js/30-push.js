"use strict";
/* ======================================================================
   AVISOS COM O APP FECHADO · Web Push pelo Firebase Cloud Messaging
   Como funciona:
   1. Em Ajustes, "Ativar neste aparelho" pede permissão e salva o token do aparelho em users/{uid}/tokens.
   2. O app calcula os próximos avisos (lembretes, agenda, audiobook, contatos, compromissos, cartas, ciclo)
      e mantém uma fila em pushq/{uid}_{chave} = {uid, at (ms), t, b, rep, tzo}.
   3. O GitHub Actions (.github/workflows/avisos.yml + automacao/enviar-avisos.mjs) roda a cada
      5 minutos, envia o que venceu e reagenda os repetidos (rep: d, w, m, y). Sem plano Blaze.
   Precisa: vapidKey no config.js e o segredo FIREBASE_SERVICE_ACCOUNT no GitHub (veja LEIA-ME.md).
   ====================================================================== */
const PUSH={timer:null,busy:false,again:false};
const pushLigado=()=>{try{return localStorage.getItem("mu_push")==="1";}catch(e){return false;}};
const pushConfigurado=()=>!!(FBCFG&&window.MU_CONFIG&&MU_CONFIG.vapidKey);
const pushPronto=()=>pushConfigurado()&&DB.be&&DB.be.kind==="firebase"&&FDB&&FUID;
const pushSuportado=()=>"serviceWorker" in navigator&&"PushManager" in window&&"Notification" in window;
const ehIOS=()=>/iPhone|iPad|iPod/.test(navigator.userAgent);
const ehInstalado=()=>matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;

async function pushHash(s){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));return [...new Uint8Array(b)].slice(0,16).map(x=>x.toString(16).padStart(2,"0")).join("");}
async function pushMessaging(){if(!window.firebase||!firebase.messaging)await loadScript(`https://www.gstatic.com/firebasejs/${FBV}/firebase-messaging-compat.js`);
  if(!(await firebase.messaging.isSupported()))throw new Error("sem-suporte");return firebase.messaging();}
async function pushToken(){const reg=await navigator.serviceWorker.register("sw.js");await navigator.serviceWorker.ready;const m=await pushMessaging();
  const token=await m.getToken({vapidKey:MU_CONFIG.vapidKey,serviceWorkerRegistration:reg});if(!token)throw new Error("sem-token");
  const id=await pushHash(token);await FDB.collection("users").doc(FUID).collection("tokens").doc(id).set({token,ua:navigator.userAgent.slice(0,160),u:Date.now()});
  try{localStorage.setItem("mu_push_tok",id);}catch(e){}return id;}

async function pushAtivar(){
  if(!pushConfigurado())return toast("bell-off","Falta configurar o envio","Coloque a vapidKey no config.js (passo a passo no LEIA-ME).");
  if(!pushPronto())return toast("bell-off","Entre na sua conta primeiro","Os avisos com o app fechado usam a sua conta do Firebase.");
  if(!pushSuportado())return toast("bell-off","Este navegador não recebe avisos",ehIOS()?"No iPhone: Compartilhar → Adicionar à Tela de Início, e abra o app por lá.":"Use o Chrome, o Edge ou o Firefox.");
  if(ehIOS()&&!ehInstalado())return toast("bell-off","Instale o app primeiro","No Safari: Compartilhar → Adicionar à Tela de Início. Depois ative por lá.");
  const p=await Notification.requestPermission();if(p!=="granted")return toast("bell-off","Notificações bloqueadas","Libere as notificações deste site nas configurações do celular.");
  toast("bell","Ativando…","");
  try{await pushToken();try{localStorage.setItem("mu_push","1");}catch(e){}await pushSync();rr();toast("bell","Avisos ativados neste aparelho","Eles chegam mesmo com o app fechado.");}
  catch(e){console.warn(e);toast("triangle-alert","Não foi possível ativar",String(e&&e.message||"").includes("sem-suporte")?"Este navegador não aceita avisos por push.":"Confira a internet e a vapidKey no config.js.");}}
async function pushDesativar(){try{const id=localStorage.getItem("mu_push_tok");if(id&&pushPronto())await FDB.collection("users").doc(FUID).collection("tokens").doc(id).delete();
  const m=await pushMessaging();await m.deleteToken();}catch(e){console.warn(e);}
  try{localStorage.removeItem("mu_push");localStorage.removeItem("mu_push_tok");}catch(e){}rr();toast("bell-off","Avisos desligados neste aparelho","Os avisos dentro do app continuam.");}
async function pushTeste(){if(!pushPronto())return;const at=Date.now()+60000;
  await FDB.collection("pushq").doc(FUID+"_teste").set({uid:FUID,at,t:"Teste do Moving Up",b:"Se você está lendo isto, os avisos com o app fechado funcionam.",rep:"",tzo:new Date().getTimezoneOffset()});
  toast("send","Teste agendado","Chega em até 15 minutos, conforme o horário do GitHub. Pode fechar o app.");}
ACT.pushOn=()=>pushAtivar();ACT.pushOff=()=>confirmSheet("Desligar os avisos neste aparelho?","Lembretes e agenda continuam avisando enquanto o app estiver aberto.","Desligar",pushDesativar);ACT.pushTeste=()=>pushTeste();

/* ---------- a fila: o que precisa avisar e quando ---------- */
const pushEm=(d,h)=>dtOf(d,h||"09:00").getTime();
function pushFila(){const now=Date.now(),t=TODAY(),F=[];const add=(k,at,tt,b,rep)=>{if(at>now-30000||rep)F.push({k,at:Math.round(at),t:String(tt).slice(0,120),b:String(b||"").slice(0,240),rep:rep||""});};
  all("rem").forEach(r=>{if(r.feito)return;const w=nextOcc(r,new Date());if(!w)return;if(!r.rep&&w.getTime()<=now)return;add("rem_"+r.id,w.getTime(),"Lembrete: "+r.t,r.nota||whenTxt(w),r.rep);});
  all("ev").forEach(e=>{if(!e.al||e.fired)return;const at=dtOf(e.d,e.h||"09:00").getTime()-(+e.al)*60000;if(at>now)add("ev_"+e.id,at,"Agenda: "+e.t,(e.h?e.h+" · ":"")+flong(e.d));});
  all("ouv").forEach(a=>{if(a.fim||!a.lemb||!a.hora)return;const hoje=pushEm(t,a.hora);const at=(hoje>now&&!(a.log&&a.log[t]))?hoje:pushEm(addDays(t,1),a.hora);add("ouv_"+a.id,at,"Hora do audiobook","Continue ouvindo: "+a.t,"d");});
  all("ctt").forEach(c=>{const p=cttProx(c);if(p>t)add("ctt_"+c.id,pushEm(p),"Retomar contato: "+c.nome,[c.papel,c.org].filter(Boolean).join(" · ")||"Faz tempo que vocês não se falam.");});
  all("cmp").forEach(c=>{if(c.st!=="ativo"||!c.prazo)return;if(c.prazo>=t){add("cmp_"+c.id,pushEm(c.prazo),"Hoje é o prazo: "+c.meta,"Se não cumprir: "+c.cons);const v=addDays(c.prazo,-3);if(v>t)add("cmpv_"+c.id,pushEm(v),"Faltam 3 dias: "+c.meta,"Prova: "+(c.crit||"cumprir no prazo"));}});
  all("carta").forEach(c=>{if(!c.aberta&&c.entrega>=t)add("carta_"+c.id,pushEm(c.entrega),"Chegou uma carta para você","Escrita em "+fdate(c.escrita)+". Abra o Moving Up para ler.");});
  all("fey").forEach(f=>{if(f.prox&&f.prox>t)add("fey_"+f.id,pushEm(f.prox,"08:30"),"Revisar: "+f.conceito,"Explique de novo com suas palavras. Leva 3 minutos.");});
  if(typeof mpDoc==="function"){const P=mpDoc();if(P.ini)Object.values(P.W||{}).forEach(W=>{if(W.fechada)return;W.sess.forEach(x=>{if(x.st===""&&x.d>=t)add("mp_"+x.id,pushEm(x.d,"06:30"),"Treino de hoje: "+x.nome,String(x.km).replace(".",",")+" km em "+fpace(x.pace)+". Bora!");});});}
  if(all("trk").some(x=>x.k==="med")&&!trkHas("med",t))add("med_dia",pushEm(t,"20:30"),"Seu momento de silêncio","10 minutos de meditação antes de dormir?","");
  const ci=typeof cicAberto==="function"?cicAberto():null;
  if(ci){const w=cicSem(ci),seg=w<1?ci.ini:addDays(cicSemIni(ci,Math.max(1,w)),7),ws=cicSem(ci,seg);
    if(ws>=1&&ws<=12)add("ciclo_sem",pushEm(seg,"08:00"),`Semana ${ws} de 12 começou`,"Abra o ciclo e veja as táticas da semana.");
    else if(ws===13)add("ciclo_sem",pushEm(seg,"08:00"),"Semana de revisão do ciclo","Feche as 12 semanas e planeje o próximo ciclo.");}
  return F;}

/* ---------- sincroniza a fila com o Firestore (só o que mudou) ---------- */
async function pushSync(){if(!pushLigado()||!pushPronto())return;if(PUSH.busy){PUSH.again=true;return;}PUSH.busy=true;
  try{const col=FDB.collection("pushq"),tzo=new Date().getTimezoneOffset(),pre=FUID+"_";
    const snap=await col.where("uid","==",FUID).get();const srv=new Map();snap.forEach(d=>srv.set(d.id,d.data()));
    const want=new Map(pushFila().map(x=>[pre+x.k,x]));const batch=FDB.batch();let n=0;
    want.forEach((x,id)=>{const s=srv.get(id);
      const igual=s&&s.t===x.t&&s.b===x.b&&(s.rep||"")===x.rep&&(s.at===x.at||(x.rep&&s.at>Date.now()));
      if(!igual){batch.set(col.doc(id),{uid:FUID,at:x.at,t:x.t,b:x.b,rep:x.rep,tzo});n++;}});
    srv.forEach((s,id)=>{if(!want.has(id)&&id!==pre+"teste"){batch.delete(col.doc(id));n++;}});
    if(n)await batch.commit();}
  catch(e){console.warn("push",e);}
  finally{PUSH.busy=false;if(PUSH.again){PUSH.again=false;pushAgendar();}}}
function pushAgendar(){if(!pushLigado())return;clearTimeout(PUSH.timer);PUSH.timer=setTimeout(pushSync,4000);}

/* cada gravação reagenda a fila; com o app aberto, os avisos internos só mostram o toast (o push cuida do celular) */
const _savePush=save;save=function(doc){const r=_savePush.apply(this,arguments);pushAgendar();return r;};
const _removePush=removeDoc;removeDoc=function(id){const r=_removePush.apply(this,arguments);pushAgendar();return r;};
const _notifyPush=notify;notify=function(t,b){if(pushLigado()&&pushPronto()){toast("bell",t,b);try{navigator.vibrate&&navigator.vibrate([120,60,120]);}catch(e){}return;}return _notifyPush.apply(this,arguments);};
const _startPush=startApp;startApp=function(){const r=_startPush.apply(this,arguments);
  if(pushLigado()&&pushPronto()&&"Notification" in window&&Notification.permission==="granted")setTimeout(()=>{pushToken().catch(e=>console.warn(e));pushSync();},3000);return r;};

/* ---------- bloco em Ajustes ---------- */
function pushAjustesHTML(){const fb=DB.be&&DB.be.kind==="firebase";
  if(!fb)return `<div class="row"><span class="grow small">Notificações: <b>${notifOK()?"ativadas":"desativadas"}</b></span>${notifOK()?"":`<button class="btn sm" data-a="notif">Ativar</button>`}</div>
    <p class="tiny faint" style="margin:6px 0 0">Neste modo, os avisos aparecem enquanto o app estiver aberto.</p>`;
  const on=pushLigado()&&notifOK();
  return `<div class="pushb"><div class="row"><span class="mb" style="width:34px;height:34px;border-radius:10px;background:${on?"var(--ok)":"var(--sf3)"};color:${on?"#fff":"var(--soft)"}">${ic(on?"bell":"bell-off")}</span>
    <div class="grow"><b class="small" style="display:block">Avisos no celular</b><span class="tiny muted">${on?"Ligados: chegam com o app fechado (até 15 min de atraso).":"Desligados: só avisa com o app aberto."}</span></div></div>
    <div class="btns h" style="margin-top:10px">${on?`<button class="btn ghost sm" data-a="pushTeste">${ic("send")} Enviar teste</button><button class="btn ghost sm" data-a="pushOff">Desligar</button>`:`<button class="btn sm" data-a="pushOn">${ic("bell")} Ativar neste aparelho</button>`}</div>
    ${!pushConfigurado()?`<p class="tiny faint" style="margin:8px 0 0">Antes, coloque a vapidKey no config.js e configure o envio no GitHub (LEIA-ME.md).</p>`:ehIOS()&&!ehInstalado()?`<p class="tiny faint" style="margin:8px 0 0">No iPhone, os avisos só funcionam com o app instalado: Compartilhar → Adicionar à Tela de Início.</p>`:""}</div>`;}
