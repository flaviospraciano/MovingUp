"use strict";
/* ======================================================================
   MEDITAÇÃO · timers de 10, 15 e 20 minutos com sino, guia de respiração e atenção ao corpo
   Cada sessão concluída é registrada como os treinos físicos (check do dia, sequência, calendário).
   Dados: c:"trk" k:"med" por dia {min (total do dia), ses:[{h,min,tipo}]}
   ====================================================================== */
MODS.med={n:"Meditação",ic:"wind",c1:"#0E7490",c2:"#67E8F9",g:1,v:{v:"med"}};
TRK.med={photo:0,t:"Meditação"};
const _quickTrkMed=ACT.quickTrk;ACT.quickTrk=el=>{if(el.dataset.k==="med")return go({v:"med"});_quickTrkMed(el);};
const MED_TIPOS=[["silencio","Silenciosa","Só você, o tempo e o sino. Volte à respiração sempre que a mente fugir."],
  ["resp","Respiração guiada","Inspire em 4 tempos e solte em 6, seguindo o círculo. Acalma o corpo rápido."],
  ["corpo","Atenção ao corpo","Percorra o corpo dos pés à cabeça, soltando cada parte."]];
const MED_CORPO=["Leve a atenção aos pés. Perceba o contato com o chão.","Panturrilhas e joelhos. Deixe soltar.","Coxas e quadril pesados, apoiados.","A barriga sobe e desce com a respiração.","Peito e costas. Respire espaço.","Ombros: deixe-os cair, longe das orelhas.","Braços e mãos, pesados e quentes.","Pescoço e mandíbula: solte os dentes.","Rosto, olhos e testa relaxados.","O corpo inteiro, respirando junto."];
const medCfg=()=>{const c=cfg();return{min:c.medMin||10,tipo:c.medTipo||"silencio",int:c.medInt!==false};};
const medDocs=pref=>trkDocs("med",pref||"");
let MED=null,MEDA=null;

VIEWS.med=()=>{const c=medCfg(),t=TODAY(),[y,m]=ym(),mes=medDocs(y+"-"+pad(m+1)),hoje=getD(tid("med",t));
  let h=topbar("Meditação","med");
  h+=`<div class="hero"><div class="muted small">${hoje?"Hoje: "+hoje.min+" min meditados":"Um momento de silêncio por dia"}</div><h2>${hoje?"✓ Meditação feita hoje":"Medite "+c.min+" minutos"}</h2>
    <div class="stats"><div><b>${streakK("med")}</b><span>dias seguidos</span></div><div><b>${mes.length}</b><span>dias no mês</span></div><div><b>${sum(mes.map(x=>+x.min||0))}</b><span>min no mês</span></div></div>
    <div class="medd" role="group" aria-label="Duração">${[10,15,20].map(n=>`<button data-a="medMin" data-v="${n}" aria-pressed="${c.min===n}"><b>${n}</b><span>min</span></button>`).join("")}</div>
    <button class="btn full" style="margin-top:12px;padding:16px;font-size:1.05rem" data-a="medStart">${ic("play")} Começar ${c.min} minutos</button></div>`;
  h+=`<div class="sec"><h2>Tipo de meditação</h2></div>`+MED_TIPOS.map(([k,n,d])=>`<button class="item medt ${c.tipo===k?"on":""}" style="width:100%;text-align:left" data-a="medTipo" data-v="${k}"><span class="ck ${c.tipo===k?"on":""}">${ic("check")}</span><span class="ibody"><b>${n}</b><span class="small muted">${d}</span></span></button>`).join("");
  h+=`<div class="row" style="margin-top:10px"><span class="grow small">Sino suave a cada 5 minutos</span><button class="btn ${c.int?"":"ghost"} sm" data-a="medInt">${c.int?"Ligado":"Desligado"}</button></div>`;
  const rec=all("trk").filter(x=>x.k==="med").sort((a,b)=>b.d.localeCompare(a.d)).slice(0,8);
  if(rec.length)h+=`<div class="sec"><h2>Últimas sessões</h2></div><div class="card small">`+rec.map(x=>`<div class="ctlog"><span class="faint">${fdate(x.d)}</span><span class="grow">${(x.ses||[]).map(s=>`${s.h} · ${s.min} min${s.tipo?" · "+((MED_TIPOS.find(z=>z[0]===s.tipo)||[])[1]||""):""}`).join("<br>")||x.min+" min"}</span><b>${x.min} min</b></div>`).join("")+`</div>`;
  h+=`<div class="sec"><h2>Dias de meditação</h2><span class="chip m" style="margin-left:auto">${ic("flame")} ${streakK("med")} seguidos</span></div>`+calNav(y,m,"mNav")+monthGrid(y,m,(d,n)=>`<button class="day ${trkHas("med",d)?"done":""} ${d===t?"td":""}" data-a="medDay" data-d="${d}">${n}${trkHas("med",d)?ic("check"):""}</button>`);
  return `<div class="app">${h}</div>`;};
const medSalva=(k,v)=>{const c=cfg();c[k]=v;save(c);rr();};
ACT.medMin=el=>medSalva("medMin",+el.dataset.v);
ACT.medTipo=el=>medSalva("medTipo",el.dataset.v);
ACT.medInt=()=>medSalva("medInt",!medCfg().int);
ACT.medDay=el=>{const d=el.dataset.d,id=tid("med",d),x=getD(id);if(x)confirmSheet("Remover a meditação de "+fdate(d)+"?",x.min+" minutos registrados.","Remover",()=>{removeDoc(id);rr();});
  else{save({id,c:"trk",k:"med",d,t:"Meditação",min:medCfg().min,ses:[{h:"",min:medCfg().min,tipo:""}]});rr();toast("wind","Meditação registrada",fdate(d));}};

/* ---------- sino (sintetizado, sem arquivos) ---------- */
function medSino(vezes=1,vol=.35){try{MEDA=MEDA||new (window.AudioContext||window.webkitAudioContext)();if(MEDA.state==="suspended")MEDA.resume();
  for(let v=0;v<vezes;v++){const t0=MEDA.currentTime+.05+v*2.2;[[392,1],[784,.5],[1176,.25],[1568,.12]].forEach(([f,a])=>{const o=MEDA.createOscillator(),g=MEDA.createGain();o.type="sine";o.frequency.value=f;
    g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(vol*a,t0+.02);g.gain.exponentialRampToValueAtTime(.0001,t0+6);o.connect(g);g.connect(MEDA.destination);o.start(t0);o.stop(t0+6.2);});}}catch(e){}}

/* ---------- player ---------- */
ACT.medStart=async()=>{const c=medCfg();MED={min:c.min,tipo:c.tipo,int:c.int,dur:c.min*60000,ini:Date.now(),pausa:null,acum:0,ultInt:0,cue:-1};
  try{if(navigator.wakeLock)MED.lock=await navigator.wakeLock.request("screen");}catch(e){}
  let d=$("mdp");if(!d){d=document.createElement("div");d.id="mdp";d.className="mdp";document.body.appendChild(d);}document.body.style.overflow="hidden";guard();
  d.innerHTML=`<div class="kt"><button class="ib" data-a="medClose" aria-label="Encerrar">${ic("x")}</button><div class="grow small"><b>${(MED_TIPOS.find(x=>x[0]===c.tipo)||[])[1]}</b><span style="display:block;opacity:.75">${c.min} minutos</span></div></div>
    <div class="mdc"><div class="mdo" id="mdO"></div><div class="mdi"><b id="mdT">${c.min}:00</b><span id="mdL">${c.tipo==="resp"?"Inspire":"Respire naturalmente"}</span></div></div>
    <p class="mdcue" id="mdC">${c.tipo==="corpo"?MED_CORPO[0]:"Postura confortável, coluna alta, olhos fechados ou suaves."}</p>
    <div class="kbtn"><button class="btn" data-a="medPause">${ic("pause")} Pausar</button></div>`;
  medSino(1);MED.timer=setInterval(medTick,250);medTick();};
const medEl=()=>MED?(MED.pausa!=null?MED.pausa:Date.now()-MED.ini-MED.acum):0;
function medTick(){if(!MED||MED.pausa!=null)return;const el=medEl(),rest=Math.max(0,MED.dur-el);const T=$("mdT");if(T)T.textContent=mmss(rest);
  const O=$("mdO"),L=$("mdL");
  if(MED.tipo==="resp"){const ciclo=(el/1000)%10,ins=ciclo<4;const p=ins?ciclo/4:1-(ciclo-4)/6;if(O)O.style.transform=`scale(${.62+p*.38})`;if(L)L.textContent=ins?"Inspire":"Solte o ar devagar";}
  else if(O){const p=(Math.sin(el/1000*Math.PI/5)+1)/2;O.style.transform=`scale(${.8+p*.12})`;}
  if(MED.tipo==="corpo"){const i=Math.min(MED_CORPO.length-1,Math.floor(el/MED.dur*MED_CORPO.length));if(i!==MED.cue){MED.cue=i;const C=$("mdC");if(C)C.textContent=MED_CORPO[i];}}
  if(MED.int){const k=Math.floor(el/300000);if(k>MED.ultInt&&rest>20000){MED.ultInt=k;medSino(1,.18);}}
  if(rest<=0)medFim(false);}
ACT.medPause=()=>{if(!MED)return;if(MED.pausa!=null){MED.acum+=Date.now()-MED.ini-MED.acum-MED.pausa;MED.pausa=null;}else MED.pausa=medEl();
  const b=document.querySelector('#mdp [data-a="medPause"]');if(b)b.innerHTML=`${ic(MED.pausa!=null?"play":"pause")} ${MED.pausa!=null?"Continuar":"Pausar"}`;};
function medSair(){if(!MED)return null;clearInterval(MED.timer);try{MED.lock&&MED.lock.release();}catch(e){}const d=$("mdp");if(d)d.remove();document.body.style.overflow="";const m=MED;MED=null;return m;}
function medRegistra(min,tipo){const t=TODAY(),id=tid("med",t),x=getD(id)||{id,c:"trk",k:"med",d:t,t:"Meditação",min:0,ses:[]};const n=new Date();
  x.ses=(x.ses||[]).concat([{h:pad(n.getHours())+":"+pad(n.getMinutes()),min,tipo}]);x.min=(+x.min||0)+min;x.s=x.min+" min";save(x);}
function medFim(cedo){const m=medSair();if(!m)return;const min=Math.round(medElDe(m)/60000);
  if(!cedo){medSino(2);medRegistra(m.min,m.tipo);if(navigator.vibrate)navigator.vibrate([200,100,200]);rr();toast("wind","Meditação concluída",m.min+" minutos · "+streakK("med")+(streakK("med")===1?" dia seguido":" dias seguidos"));}
  else if(min>=3){medRegistra(min,m.tipo);rr();toast("wind","Sessão registrada",min+" minutos");}else rr();}
const medElDe=m=>m.pausa!=null?m.pausa:Date.now()-m.ini-m.acum;
ACT.medClose=()=>{if(!MED)return;const min=Math.round(medEl()/60000);confirmSheet("Encerrar a meditação?",min>=3?`Os ${min} minutos feitos serão registrados.`:"Menos de 3 minutos não são registrados.","Encerrar",()=>medFim(true));};
window.addEventListener("popstate",e=>{if(MED){e.stopImmediatePropagation();GUARD=false;guard();ACT.medClose();}},true);
