/* Moving Up · envio dos avisos com o app fechado, pelo GitHub Actions (sem plano Blaze).
   A cada execução: pega na fila pushq os avisos que venceram, envia para os aparelhos da pessoa
   (users/{uid}/tokens) e reagenda os repetidos (rep: d = diário, w = semanal, m = mensal, y = anual).
   Precisa do segredo FIREBASE_SERVICE_ACCOUNT no repositório (veja LEIA-ME.md). */
import {initializeApp,cert} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {getMessaging} from "firebase-admin/messaging";

const segredo=process.env.FIREBASE_SERVICE_ACCOUNT;
if(!segredo){console.log("O segredo FIREBASE_SERVICE_ACCOUNT ainda não foi configurado. Nada a enviar.");process.exit(0);}
let conta;try{conta=JSON.parse(segredo);}catch(e){console.error("FIREBASE_SERVICE_ACCOUNT não é um JSON válido. Cole o arquivo inteiro baixado do Firebase.");process.exit(1);}
initializeApp({credential:cert(conta)});
const db=getFirestore();
const TOKEN_MORTO=new Set(["messaging/registration-token-not-registered","messaging/invalid-registration-token","messaging/invalid-argument"]);
const ATRASO_MAX=6*3600e3; /* aviso vencido há mais de 6 horas não é mais enviado */

/* próxima ocorrência no horário local da pessoa (tzo = fuso em minutos, como no getTimezoneOffset do celular) */
function proxima(at,rep,tzo,agora){if(!rep)return null;const off=(tzo||0)*60000;let x=at,n=0;
  while(x<=agora&&n<5000){const d=new Date(x-off);
    if(rep==="d")d.setUTCDate(d.getUTCDate()+1);else if(rep==="w")d.setUTCDate(d.getUTCDate()+7);
    else if(rep==="m")d.setUTCMonth(d.getUTCMonth()+1);else if(rep==="y")d.setUTCFullYear(d.getUTCFullYear()+1);else return null;
    x=d.getTime()+off;n++;}
  return x;}

const agora=Date.now();
const snap=await db.collection("pushq").where("at","<=",agora).orderBy("at").limit(300).get();
if(snap.empty){console.log("Nenhum aviso vencido.");process.exit(0);}
const cache=new Map(),mortos=new Map();
async function tokens(uid){if(!cache.has(uid)){const s=await db.collection("users").doc(uid).collection("tokens").get();
  cache.set(uid,s.docs.map(d=>({ref:d.ref,token:d.get("token")})).filter(t=>t.token));}return cache.get(uid).filter(t=>!mortos.has(t.ref.path));}
const batch=db.batch();let enviados=0,velhos=0;
for(const doc of snap.docs){const x=doc.data();
  if(agora-x.at<ATRASO_MAX){const T=await tokens(x.uid);
    if(T.length){try{const r=await getMessaging().sendEachForMulticast({tokens:T.map(t=>t.token),
          data:{title:String(x.t||"Moving Up"),body:String(x.b||""),url:"./",tag:doc.id},
          webpush:{headers:{Urgency:"high",TTL:"43200"}}});
        enviados+=r.successCount;
        r.responses.forEach((res,i)=>{if(!res.success){const c=res.error&&res.error.code;if(TOKEN_MORTO.has(c))mortos.set(T[i].ref.path,T[i].ref);else console.warn("falha",c);}});}
      catch(e){console.error("falha ao enviar",doc.id,e.message);}}}
  else velhos++;
  const prox=proxima(x.at,x.rep,x.tzo,agora);
  if(prox)batch.update(doc.ref,{at:prox,enviadoEm:agora});else batch.delete(doc.ref);}
mortos.forEach(ref=>batch.delete(ref));
await batch.commit();
console.log(`${snap.size} avisos vencidos · ${enviados} entregues · ${velhos} antigos demais · ${mortos.size} aparelhos removidos`);
