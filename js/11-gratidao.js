"use strict";
/* ======================================================================
   MÚSICA nos módulos · PAUSA DE GRATIDÃO ao abrir o app
   ====================================================================== */
(()=>{MOD_GROUPS.forEach(g=>{g[1]=g[1].filter(k=>k!=="atab"&&k!=="viol");});const i=MOD_GROUPS.findIndex(g=>g[0]==="Projetos pessoais");MOD_GROUPS.splice(i<0?MOD_GROUPS.length:i,0,["Música",["viol","atab"]]);})();

let GRAT_T=null,GRAT_HID=0;
function gratOpen(){if(window.__noGrat||!DB.be||$("gratp"))return;const total=all("grat").length;const d=document.createElement("div");d.id="gratp";d.className="gratp";d.setAttribute("role","dialog");d.setAttribute("aria-label","Pausa de gratidão");
  d.innerHTML=`<div class="gin"><div class="gheart">${ic("heart")}</div>
   <p class="gtx">Lembre de um motivo pelo qual você é grato.<br><b>Agradeça.</b><br>Leve essa energia para o seu dia.</p>
   <input id="gIn" placeholder="Hoje sou grato por… (opcional)" aria-label="Motivo de gratidão" enterkeyhint="done">
   <button class="btn" id="gOk">${ic("heart")} Agradeci</button>
   <div class="tiny" style="opacity:.6;margin-top:8px">${total?total+" agradecimentos registrados":""}</div></div>`;
  document.body.appendChild(d);document.body.style.overflow="hidden";
  d.querySelector("#gOk").onclick=gratClose;d.querySelector("#gIn").addEventListener("keydown",e=>{if(e.key==="Enter")gratClose();});
  if(matchMedia("(hover:hover)").matches)setTimeout(()=>{const i=$("gIn");if(i)i.focus();},350);}
function gratClose(){const i=$("gIn");const v=i?i.value.trim():"";if(v){save({id:"grat_"+nid(),c:"grat",t:v,d:TODAY()});}
  clearInterval(GRAT_T);const d=$("gratp");if(d){d.classList.add("out");setTimeout(()=>d.remove(),350);}document.body.style.overflow="";if(v)toast("heart","Gratidão registrada",v);rr();}
const _start13=startApp;startApp=function(){const r=_start13.apply(this,arguments);setTimeout(gratOpen,250);return r;};
document.addEventListener("visibilitychange",()=>{if(document.hidden)GRAT_HID=Date.now();else if(GRAT_HID&&Date.now()-GRAT_HID>10*60000){GRAT_HID=0;gratOpen();}});
/* gratidões do dia aparecem no Início à noite */
function secGrat(){const x=dia();const g=x.grat.filter(Boolean).concat(all("grat").filter(z=>z.d===TODAY()).sort((a,b)=>(a.u||0)-(b.u||0)).map(z=>z.t));if(!g.length)return"";
  return `<div class="card grat" style="margin-top:10px"><b>${ic("heart")} Hoje você agradeceu por</b><ul>${g.map(s=>`<li>${esc(s)}</li>`).join("")}</ul></div>`;}
