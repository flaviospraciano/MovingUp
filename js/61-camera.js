"use strict";
/* ======================================================================
   CÂMERA RÁPIDA · botão redondo no canto inferior direito
   Toca na câmera → tira (ou escolhe) a foto → escolhe a atividade →
   a foto vai direto para o dia daquela atividade (e o treino fica marcado).
   ====================================================================== */
const CAM_ORDEM=["cap","run","swim","gym"];
const camAtiv=()=>CAM_ORDEM.filter(k=>TRK[k]&&TRK[k].photo&&MODS[k]).concat(Object.keys(TRK).filter(k=>!CAM_ORDEM.includes(k)&&TRK[k].photo&&MODS[k]));
const CAM_NOME={cap:"Capoeira",run:"Corrida",swim:"Natação",gym:"Academia"};
const CAM_COR={cap:["#B45309","#EF4444"],run:["#C2410C","#F59E0B"],swim:["#0369A1","#3B82F6"],gym:["#BE123C","#FF7A59"]};
let CAM={img:null,prom:null,d:null};

function camBotao(){if($("camfab"))return;const b=document.createElement("button");b.id="camfab";b.className="camfab";b.type="button";
  b.setAttribute("aria-label","Foto de treino: tirar e guardar na atividade");b.title="Foto de treino";b.innerHTML=ic("camera");
  b.onclick=camAbrir;document.body.appendChild(b);}

async function camAbrir(){const f=await pickFiles(false);if(!f.length)return;
  CAM={img:null,d:TODAY(),prom:processImage(f[0]).then(p=>{CAM.img=p;return p;})};
  camEscolher();
  CAM.prom.then(p=>{const im=$("camPv");if(im){im.src=p.preview;im.parentElement.classList.remove("load");}})
    .catch(()=>{const pv=$("camPvBox");if(pv)pv.innerHTML=`<span>${ic("triangle-alert")} Não deu para abrir esta foto. Toque na câmera e tente outra.</span>`;CAM.img=null;});}

function camEscolher(){const hj=TODAY(),ont=addDays(hj,-1),d=CAM.d||hj;
  const L=camAtiv().map(k=>{const doc=getD(tid(k,d)),m=MODS[k];
    return `<button class="camat" data-ck="${k}" style="--cma:${(CAM_COR[k]||[m.c1])[0]};--cmb:${(CAM_COR[k]||[0,m.c2])[1]}">${ic(m.ic)}<b>${esc(CAM_NOME[k]||m.n)}</b>${doc&&doc.img?`<span>já tem foto neste dia</span>`:doc?`<span>treino já marcado</span>`:""}</button>`;}).join("");
  sheet(`<h2 style="margin-bottom:10px">Para qual atividade?</h2>
   <div class="campv load" id="camPvBox"><img id="camPv" alt="Foto escolhida" ${CAM.img?`src="${CAM.img.preview}"`:""}><span class="camld">${ic("hourglass")} Preparando a foto…</span></div>
   <div class="seg camdia" role="group" aria-label="Dia da foto"><button data-cd="${hj}" aria-pressed="${d===hj}">Hoje</button><button data-cd="${ont}" aria-pressed="${d===ont}">Ontem</button></div>
   <div class="camgrid">${L}</div>
   <p class="tiny muted" style="text-align:center;margin:12px 0 0">A foto vai para o dia escolhido e o treino fica marcado.</p>`,s=>{
    if(CAM.img)s.querySelector("#camPvBox").classList.remove("load");
    s.querySelectorAll("[data-cd]").forEach(b=>b.onclick=()=>{CAM.d=b.dataset.cd;camEscolher();});
    s.querySelectorAll("[data-ck]").forEach(b=>b.onclick=()=>{const k=b.dataset.ck,dd=CAM.d||TODAY(),doc=getD(tid(k,dd));
      if(doc&&doc.img)return confirmSheet("Trocar a foto?",`${CAM_NOME[k]||MODS[k].n} já tem uma foto nesse dia. A nova fica no lugar.`,"Trocar a foto",()=>camSalvar(k,dd));
      camSalvar(k,dd,b);});});}

async function camSalvar(k,d,btn){if(btn){btn.disabled=true;const b=btn.querySelector("b");if(b)b.textContent="Guardando…";}
  try{const p=CAM.img||await CAM.prom;if(!p)throw new Error("sem foto");
    const o=getD(tid(k,d))||{id:tid(k,d),c:"trk",k,d};const old=o.img;o.img=await storeImage(p);if(old&&old!==o.img){try{DB.be.imgs.del(old);}catch(e){}}
    save(o);CAM={img:null,prom:null,d:null};closeSheet();rr();toast("check",`Foto guardada em ${CAM_NOME[k]||MODS[k].n}`,flong(d)+" · treino marcado");}
  catch(e){console.warn(e);if(btn){btn.disabled=false;const b=btn.querySelector("b");if(b)b.textContent=CAM_NOME[k]||MODS[k].n;}
    toast("triangle-alert","A foto não foi guardada","Confira a internet e tente de novo.");}}

const _start61=startApp;startApp=function(){const r=_start61.apply(this,arguments);try{camBotao();}catch(e){console.warn(e);}return r;};
