"use strict";
/* ======================================================================
   MÚSICA nos módulos · PAUSA DE GRATIDÃO ao abrir o app
   ====================================================================== */
(()=>{MOD_GROUPS.forEach(g=>{g[1]=g[1].filter(k=>k!=="atab"&&k!=="viol");});const i=MOD_GROUPS.findIndex(g=>g[0]==="Projetos pessoais");MOD_GROUPS.splice(i<0?MOD_GROUPS.length:i,0,["Música",["viol","atab"]]);})();

let GRAT_T=null,GRAT_HID=0;
function gratOpen(){if(window.__noGrat||!DB.be||$("gratp"))return;const total=all("grat").length;const d=document.createElement("div");d.id="gratp";d.className="gratp";d.setAttribute("role","dialog");d.setAttribute("aria-label","Pausa de gratidão");
  d.innerHTML=`<div class="gin"><div class="gring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="gbg"/><circle cx="60" cy="60" r="52" class="gfg" id="gfg"/></svg><b id="gsec">5</b></div>
   <p class="gtx">Pare 5 segundos.<br>Lembre de um motivo pelo qual você é grato.<br><b>Agradeça.</b><br>Pegue essa energia.<br>Leve para o resto do seu dia, agora.</p>
   <input id="gIn" placeholder="Hoje sou grato por… (opcional)" aria-label="Motivo de gratidão">
   <button class="btn" id="gOk" disabled>${ic("heart")} Agradeci</button>
   <div class="tiny" style="opacity:.6;margin-top:8px">${total?total+" agradecimentos registrados":""}</div></div>`;
  document.body.appendChild(d);document.body.style.overflow="hidden";const t0=Date.now();
  const fg=d.querySelector("#gfg"),L=2*Math.PI*52;fg.style.strokeDasharray=L;
  const tick=()=>{const el=(Date.now()-t0)/1000,left=Math.max(0,5-el);const s=$("gsec");if(s)s.textContent=left>0?Math.ceil(left):"✓";fg.style.strokeDashoffset=L*(left/5);
    if(left<=0){const b=$("gOk");if(b&&b.disabled){b.disabled=false;b.focus();}clearInterval(GRAT_T);}};GRAT_T=setInterval(tick,100);tick();
  d.querySelector("#gOk").onclick=gratClose;d.querySelector("#gIn").addEventListener("keydown",e=>{if(e.key==="Enter"&&!$("gOk").disabled)gratClose();});}
function gratClose(){const i=$("gIn");const v=i?i.value.trim():"";if(v){save({id:"grat_"+nid(),c:"grat",t:v,d:TODAY()});}
  clearInterval(GRAT_T);const d=$("gratp");if(d){d.classList.add("out");setTimeout(()=>d.remove(),350);}document.body.style.overflow="";if(v)toast("heart","Gratidão registrada",v);rr();}
const _start13=startApp;startApp=function(){const r=_start13.apply(this,arguments);setTimeout(gratOpen,250);return r;};
document.addEventListener("visibilitychange",()=>{if(document.hidden)GRAT_HID=Date.now();else if(GRAT_HID&&Date.now()-GRAT_HID>10*60000){GRAT_HID=0;gratOpen();}});
/* gratidões do dia aparecem no Início à noite */
function secGrat(){const x=dia();const g=x.grat.filter(Boolean).concat(all("grat").filter(z=>z.d===TODAY()).sort((a,b)=>(a.u||0)-(b.u||0)).map(z=>z.t));if(!g.length)return"";
  return `<div class="card grat" style="margin-top:10px"><b>${ic("heart")} Hoje você agradeceu por</b><ul>${g.map(s=>`<li>${esc(s)}</li>`).join("")}</ul></div>`;}
