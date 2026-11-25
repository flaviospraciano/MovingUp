"use strict";
/* ================= INÍCIO DO APP ================= */
const FBCFG=(window.MU_CONFIG&&window.MU_CONFIG.firebase&&window.MU_CONFIG.firebase.apiKey)?window.MU_CONFIG.firebase:null;
const FBV="10.12.2";
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement("script");s.src=src;s.onload=res;s.onerror=()=>rej(new Error("script"));document.head.appendChild(s);});}
function hideSplash(){const s=$("splash");if(s)s.remove();}
function startApp(be,docs){DB.be=be;DB.docs.clear();docs.forEach(d=>DB.docs.set(d.id,d));try{migrateData();}catch(e){console.warn(e);}applyTheme();hideSplash();$("main").classList.remove("hidden");$("nav").classList.remove("hidden");VIEW={v:"home"};STACK=[];render();setTimeout(tick,1500);}
/* tela de login (modo Firebase) */
function showLogin(msg){hideSplash();$("nav").classList.add("hidden");$("main").classList.remove("hidden");
  $("view").innerHTML=`<div class="app" style="max-width:460px;padding-top:7vh"><div style="text-align:center">${logo(84)}<div class="hello" style="margin-top:16px">Moving Up</div><p class="muted">Entre para guardar tudo na nuvem e ver seus dados em qualquer aparelho.</p></div>
   <div class="card" style="margin-top:18px"><label class="fld" style="margin-top:0"><span>E-mail</span><input id="lgE" type="email" autocomplete="email" inputmode="email"></label>
   <label class="fld"><span>Senha</span><input id="lgS" type="password" autocomplete="current-password" data-enter="lgIn"></label>
   ${msg?`<div class="note" style="color:var(--notx);background:var(--nobg)">${esc(msg)}</div>`:""}
   <div class="btns"><button class="btn full" data-a="lgIn">Entrar</button><button class="btn ghost full" data-a="lgUp">Criar minha conta</button><button class="lnk small" style="margin-top:6px" data-a="lgReset">Esqueci a senha</button></div></div></div>`;}
const authMsg=e=>{const c=(e&&e.code)||"";return c.includes("invalid-credential")||c.includes("wrong-password")||c.includes("user-not-found")?"E-mail ou senha incorretos.":c.includes("email-already-in-use")?"Este e-mail já tem conta. Use Entrar.":c.includes("weak-password")?"A senha precisa ter pelo menos 6 caracteres.":c.includes("invalid-email")?"Digite um e-mail válido.":c.includes("network")?"Sem internet. Conecte-se e tente de novo.":c.includes("too-many")?"Muitas tentativas. Espere alguns minutos.":c.includes("operation-not-allowed")?"Ative o login por e-mail/senha no Firebase (Authentication > Sign-in method).":"Não foi possível entrar ("+c+").";};
const lgVals=()=>[($("lgE").value||"").trim(),$("lgS").value||""];
ACT.lgIn=async el=>{const[e,p]=lgVals();if(!e||!p)return showLogin("Preencha e-mail e senha.");el.disabled=true;try{await firebase.auth().signInWithEmailAndPassword(e,p);}catch(x){showLogin(authMsg(x));$("lgE").value=e;}};
ACT.lgUp=async el=>{const[e,p]=lgVals();if(!e||!p)return showLogin("Preencha e-mail e uma senha (mínimo 6 caracteres) para criar a conta.");el.disabled=true;try{await firebase.auth().createUserWithEmailAndPassword(e,p);}catch(x){showLogin(authMsg(x));$("lgE").value=e;}};
ACT.lgReset=async()=>{const[e]=lgVals();if(!e)return showLogin("Digite seu e-mail acima e toque em “Esqueci a senha”.");try{await firebase.auth().sendPasswordResetEmail(e);toast("mail","E-mail enviado","Abra o link para criar uma nova senha.");}catch(x){showLogin(authMsg(x));}};
ACT.logout=()=>confirmSheet("Sair da conta?","Seus dados continuam salvos na nuvem. Basta entrar de novo.","Sair",()=>{firebase.auth().signOut();});
/* leva o que estava salvo só neste aparelho para a nuvem (inclusive as fotos) */
async function localDocs(){try{const L=LocalBackend();return await L.loadAll();}catch(e){return[];}}
async function migrateLocal(){const docs=await localDocs();if(!docs.length)return toast("info","Nada para enviar","Não há dados guardados só neste aparelho.");
  const bar=document.createElement("div");bar.className="toast";bar.innerHTML=`<span class="ti">${ic("cloud-upload")}</span><div><b>Enviando para a nuvem</b><span id="mgn">0 de ${docs.length}</span></div>`;$("toasts").appendChild(bar);let n=0,fail=0;
  for(const d of docs){try{if(d.img&&d.img.s==="l"){const d2=await idb();const full=await idbReq(d2.transaction("imgs").objectStore("imgs").get(d.img.f));const th=await idbReq(d2.transaction("imgs").objectStore("imgs").get(d.img.t));
      if(full&&th)d.img=await FireImgs.put(full,th);else delete d.img;}
    if(!DB.docs.has(d.id)||(DB.docs.get(d.id).u||0)<(d.u||0)){DB.docs.set(d.id,d);await DB.be.put(d);}}catch(e){fail++;}n++;const m=$("mgn");if(m)m.textContent=n+" de "+docs.length;}
  bar.remove();localStorage.setItem("mu_migrado","1");rr();toast(fail?"triangle-alert":"check",fail?"Envio concluído com "+fail+" falhas":"Tudo enviado para a nuvem",(docs.length-fail)+" registros");}
ACT.migrar=()=>confirmSheet("Enviar dados deste aparelho?","Tudo o que você registrou neste celular antes do login (inclusive fotos) vai para a sua conta. Nada é apagado.","Enviar agora",migrateLocal);
async function bootFirebase(){
  try{await loadScript(`https://www.gstatic.com/firebasejs/${FBV}/firebase-app-compat.js`);await Promise.all([loadScript(`https://www.gstatic.com/firebasejs/${FBV}/firebase-auth-compat.js`),loadScript(`https://www.gstatic.com/firebasejs/${FBV}/firebase-firestore-compat.js`)]);}
  catch(e){hideSplash();$("main").classList.remove("hidden");$("view").innerHTML=`<div class="app" style="padding-top:12vh">${empty("home","Sem conexão","Na primeira vez, o app precisa de internet para entrar na sua conta. Conecte-se e toque em tentar de novo.",`<button class="btn" onclick="location.reload()">Tentar de novo</button>`)}</div>`;return;}
  firebase.initializeApp(FBCFG);const db=firebase.firestore();try{await db.enablePersistence({synchronizeTabs:true});}catch(e){}
  let started=false;
  firebase.auth().onAuthStateChanged(async u=>{
    if(!u){if(started)location.reload();else showLogin();return;}
    if(started)return;started=true;$("view").innerHTML=`<div class="splash" style="position:static;height:70vh"><div class="lg">${logo(80)}</div></div>`;
    try{const be=FireBackend(db,u.uid);const docs=await be.loadAll();startApp(be,docs);
      if(!docs.length&&!localStorage.getItem("mu_migrado")){const loc=await localDocs();if(loc.length)setTimeout(()=>ACT.migrar(),600);}}
    catch(e){started=false;showLogin(e&&e.code==="permission-denied"?"Sem permissão no banco. Confira as regras do Firestore (passo 5).":"Não foi possível carregar seus dados. Tente de novo.");}});}
async function boot(){
  if(FBCFG)return bootFirebase();
  let be=null,docs=[];
  try{if(window.claude&&typeof claude.use==="function"){const tm=new Promise(r=>setTimeout(()=>r(null),12000));
    const db=await Promise.race([claude.use("db"),tm]);const user=db?await Promise.race([claude.use("user"),tm]):null;const uid=user?await user.id():null;
    if(db&&uid){const assets=await Promise.race([claude.use("assets"),new Promise(r=>setTimeout(()=>r(null),4000))]);const cb=CloudBackend(db,uid,assets);docs=await cb.loadAll();be=cb;}}}
  catch(e){console.warn("nuvem indisponível",e);be=null;docs=[];}
  if(!be){try{be=LocalBackend();docs=await be.loadAll();}catch(e){be={kind:"mem",loadAll:async()=>[],put:async()=>{},del:async()=>{},imgs:{put:async(f,t)=>({s:"m",f:URL.createObjectURL(f),t:URL.createObjectURL(t)}),url:async k=>k,del:async()=>{}}};docs=[];toast("triangle-alert","O armazenamento está bloqueado","Os dados desta visita não serão guardados.");}}
  startApp(be,docs);
  let hid=0;document.addEventListener("visibilitychange",async()=>{if(document.hidden){hid=Date.now();return;}tick();
    if(DB.be.kind==="cloud"&&hid&&Date.now()-hid>60000&&$("sheet").classList.contains("hidden")&&!VW){try{const d=await DB.be.loadAll();DB.docs.clear();d.forEach(x=>DB.docs.set(x.id,x));rr();}catch(e){}}});}
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&DB.be)tick();});
