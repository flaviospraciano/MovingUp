/* Moving Up · Strava com o app fechado, pelo GitHub Actions (de graça, sem plano Blaze).
   A cada execução, para cada pessoa que conectou o Strava no app:
   · termina a conexão (troca o código pelo acesso), quando o navegador não conseguiu;
   · renova o acesso antes de vencer;
   · traz os treinos novos e grava no dia certo (users/{uid}/docs/t_<tipo>_<data>), sem repetir;
   · avisa no celular quando entra treino novo (pela fila de avisos).
   Usa o mesmo segredo FIREBASE_SERVICE_ACCOUNT dos avisos. O Client ID e o Client Secret do Strava ficam
   nos dados da pessoa no Firebase (doc "strava"), colados em Ajustes. Nada disso vai para o GitHub. */
import {initializeApp,cert} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

const segredo=process.env.FIREBASE_SERVICE_ACCOUNT;
if(!segredo){console.log("O segredo FIREBASE_SERVICE_ACCOUNT ainda não foi configurado. Nada a fazer.");process.exit(0);}
let conta;try{conta=JSON.parse(segredo);}catch(e){console.error("FIREBASE_SERVICE_ACCOUNT não é um JSON válido.");process.exit(1);}
initializeApp({credential:cert(conta)});
const db=getFirestore();
const FORCAR=process.env.FORCAR==="1";
const MAP={Run:"run",TrailRun:"run",VirtualRun:"run",Swim:"swim",WeightTraining:"gym",Crossfit:"hiit",HighIntensityIntervalTraining:"hiit",Workout:"hiit"};
const NOME={run:"Corrida",swim:"Natação",gym:"Academia",hiit:"HIIT"};
const pad=n=>String(n).padStart(2,"0");
const fmtSeg=s=>{s=Math.round(s||0);const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return h?`${h}:${pad(m)}:${pad(x)}`:`${m}:${pad(x)}`;};
const resumo=(k,km,seg,elev,fc)=>[km?String(km).replace(".",",")+" km":"",seg?fmtSeg(seg):"",k==="run"&&km>0&&seg>0?fmtSeg(seg/km)+"/km":"",elev?"↑"+elev+" m":"",fc?"❤ "+fc:""].filter(Boolean).join(" · ");
function polyDecode(s){if(!s)return[];const R=[];let i=0,la=0,lo=0;while(i<s.length){for(const k of [0,1]){let b,sh=0,r=0;do{b=s.charCodeAt(i++)-63;r|=(b&31)<<sh;sh+=5;}while(b>=32&&i<s.length);const d=r&1?~(r>>1):r>>1;if(k===0)la+=d;else lo+=d;}R.push([la/1e5,lo/1e5]);}return R;}
async function token(body){const r=await fetch("https://www.strava.com/oauth/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams(body)});
  const t=await r.text();if(!r.ok)throw new Error("Strava recusou ("+r.status+"): "+t.slice(0,160));return JSON.parse(t);}
const atleta=j=>j.athlete?{id:j.athlete.id,nome:[j.athlete.firstname,j.athlete.lastname].filter(Boolean).join(" ")}:null;

const agora=Date.now();let total=0,pessoas=0;
const users=await db.collection("users").listDocuments();
for(const u of users){const docs=u.collection("docs");
  const [cS,tS]=await Promise.all([docs.doc("strava").get(),docs.doc("stravatok").get()]);if(!cS.exists||!tS.exists)continue;
  const C=cS.data(),T=tS.data();if(!C.on||!C.cid||!C.sec)continue;pessoas++;
  try{let tok={...T};
    if(T.codigo&&!T.a){if(agora-(T.codigoEm||0)>60*60e3){await docs.doc("stravatok").set({...T,erro:"O código de conexão venceu. Conecte o Strava de novo pelo app.",u:Date.now()});continue;}
      const j=await token({client_id:C.cid,client_secret:C.sec,code:T.codigo,grant_type:"authorization_code"});
      tok={...T,a:j.access_token,r:j.refresh_token,exp:j.expires_at,ath:atleta(j),desde:T.desde||Math.floor(agora/1000)-3*86400,u:Date.now()};delete tok.codigo;delete tok.codigoEm;delete tok.erro;
      await docs.doc("stravatok").set(tok);console.log("Strava conectado para",u.id.slice(0,6));}
    if(!tok.a||!tok.r)continue;
    if((tok.exp||0)*1000<agora+30*60e3){const j=await token({client_id:C.cid,client_secret:C.sec,grant_type:"refresh_token",refresh_token:tok.r});
      tok={...tok,a:j.access_token,r:j.refresh_token||tok.r,exp:j.expires_at,u:Date.now()};delete tok.erro;await docs.doc("stravatok").set(tok);}
    const L0=(await docs.doc("stravalog").get()).data()||{id:"stravalog",c:"stravalog",ult:0,itens:[]};
    if(!FORCAR&&L0.chk&&agora-L0.chk<9*60e3)continue;
    const after=Math.max(tok.desde||0,(L0.ult||0)-86400);
    const r=await fetch(`https://www.strava.com/api/v3/athlete/activities?after=${after}&per_page=50`,{headers:{Authorization:"Bearer "+tok.a}});
    if(!r.ok){console.warn("Strava respondeu",r.status,"para",u.id.slice(0,6));continue;}
    const A=(await r.json()).sort((x,y)=>new Date(x.start_date)-new Date(y.start_date));
    const L={...L0,itens:[...(L0.itens||[])]};const novos=[];
    for(const a of A){const k=MAP[a.sport_type]||MAP[a.type];const ini=Math.floor(new Date(a.start_date).getTime()/1000);L.ult=Math.max(L.ult||0,ini);if(!k||!(C.tipos||{})[k])continue;
      const d=String(a.start_date_local||a.start_date).slice(0,10),id=`t_${k}_${d}`,ref=docs.doc(id),ex=(await ref.get()).data(),chave="strava:"+a.id;
      const doc=ex?{...ex}:{id,c:"trk",k,d};doc.imp=[...(doc.imp||[])];if(doc.imp.includes(chave))continue;doc.imp.push(chave);const vez=doc.imp.length;
      const km=Math.round((a.distance||0)/10)/100,seg=a.moving_time||a.elapsed_time||0,elev=Math.round(a.total_elevation_gain||0),fc=Math.round(a.average_heartrate||0);
      if(km)doc.km=Math.round(((vez>1?+doc.km||0:0)+km)*100)/100;doc.seg=(vez>1?doc.seg||0:0)+seg;if(elev)doc.elev=(vez>1?doc.elev||0:0)+elev;if(fc)doc.fc=fc;
      const P=polyDecode(a.map&&a.map.summary_polyline);if(P.length&&!doc.rota){const passo=Math.max(1,Math.floor(P.length/140));doc.rota=[].concat(...P.filter((_,i)=>i%passo===0).map(p=>[Math.round(p[0]*1e5)/1e5,Math.round(p[1]*1e5)/1e5]));}
      doc.fonte="strava";if(!doc.t)doc.t=a.name||NOME[k];if(!doc.s||doc.sAuto){doc.s=resumo(k,doc.km,doc.seg,doc.elev,fc)+" · Strava";doc.sAuto=1;}doc.u=Date.now();
      await ref.set(doc);novos.push({nome:a.name||NOME[k],km,k,seg});L.itens.unshift({id:a.id,d,nome:a.name||"",km,k});}
    L.itens=L.itens.slice(0,30);L.chk=agora;L.u=Date.now();await docs.doc("stravalog").set(L);
    if(novos.length){total+=novos.length;const x=novos[novos.length-1];
      await db.collection("pushq").doc(`${u.id}_strava_${agora}`).set({uid:u.id,at:agora,rep:"",tzo:0,
        t:novos.length===1?`${NOME[x.k]} importada do Strava`:`${novos.length} treinos importados do Strava`,
        b:novos.length===1?[x.nome,x.km?String(x.km).replace(".",",")+" km":"",x.seg?fmtSeg(x.seg):""].filter(Boolean).join(" · "):novos.map(y=>y.nome).slice(0,3).join(" · ")});}}
  catch(e){console.error("Strava",u.id.slice(0,6),e.message);try{await docs.doc("stravatok").set({...T,erro:String(e.message).slice(0,180),erroEm:Date.now(),u:Date.now()});}catch(x){}}}
console.log(`Strava: ${pessoas} conectado(s) · ${total} treino(s) novo(s).`);
