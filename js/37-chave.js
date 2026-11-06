"use strict";
/* ======================================================================
   CHAVE DO GEMINI GUARDADA NO APP (e não no GitHub)
   O repositório é público: uma chave colada no config.js fica visível para qualquer pessoa,
   e o GitHub bloqueia o envio. Aqui a chave é colada em Ajustes e fica salva nos SEUS dados
   (no aparelho e na sua conta do Firebase, que só você acessa). Assim vale em todos os aparelhos
   em que você entrar, sem aparecer no código.
   ====================================================================== */
const CHAVE_DO_CONFIG=!!(window.MU_CONFIG&&MU_CONFIG.geminiKey);
function chaveAplicar(){if(!window.MU_CONFIG)window.MU_CONFIG={};if(CHAVE_DO_CONFIG)return;let k="";
  try{k=(DB.be&&cfg().geminiKey)||localStorage.getItem("mu_gkey")||"";}catch(e){}
  MU_CONFIG.geminiKey=k;if(k)try{localStorage.setItem("mu_gkey",k);}catch(e){}}
try{const k=localStorage.getItem("mu_gkey");if(k&&!CHAVE_DO_CONFIG)MU_CONFIG.geminiKey=k;}catch(e){}
const _startChave=startApp;startApp=function(){const r=_startChave.apply(this,arguments);chaveAplicar();setTimeout(chaveAplicar,2500);return r;};
function chaveHTML(){const k=MU_CONFIG.geminiKey||"";
  return `<div class="pushb" style="margin-top:12px"><b class="small" style="display:block">${ic("sparkles")} Chave do Gemini (IA e voz)</b>
   ${CHAVE_DO_CONFIG?`<p class="tiny muted" style="margin:4px 0 0">Definida no config.js.</p>`:k?`<p class="tiny muted" style="margin:4px 0 8px">Salva só nos seus dados: …${esc(k.slice(-4))}</p><div class="btns h"><button class="btn ghost sm" data-a="chaveTrocar">Trocar chave</button><button class="btn ghost sm" data-a="chaveApagar">Remover</button></div>`
     :`<p class="tiny muted" style="margin:4px 0 8px">Crie grátis em aistudio.google.com/apikey e cole aqui. Ela fica salva nos seus dados, nunca no GitHub.</p><button class="btn sm" data-a="chaveTrocar">${ic("plus")} Colar chave</button>`}</div>`;}
const _vozAjChave=vozAjustesHTML;vozAjustesHTML=function(){const h=_vozAjChave.apply(this,arguments);return h.replace(/<\/div>$/,chaveHTML()+"</div>");};
ACT.chaveTrocar=()=>{sheet(`<h2>Chave do Gemini</h2><p class="muted small" style="margin:4px 0 0">Cole a chave criada em aistudio.google.com/apikey. Ela fica salva só nos seus dados (aparelho e sua conta), não no código do app.</p>
   <label class="fld"><span>Chave</span><input id="gkI" autocomplete="off" spellcheck="false" placeholder="AQ.… ou AIza…"></label>
   <div class="btns"><button class="btn full" id="gkS">${ic("check")} Salvar e testar</button></div>`,s=>{
  s.querySelector("#gkS").onclick=async e=>{const k=s.querySelector("#gkI").value.trim().replace(/^["']|["']$/g,"");if(k.length<20)return toast("triangle-alert","Chave muito curta","Copie a chave inteira.");
    e.currentTarget.disabled=true;e.currentTarget.textContent="Testando…";const ant=MU_CONFIG.geminiKey;MU_CONFIG.geminiKey=k;try{localStorage.removeItem("mu_iams");localStorage.removeItem("mu_iam");}catch(x){}
    try{await geminiREST([{text:"Responda apenas: ok"}],{max:20});}catch(x){MU_CONFIG.geminiKey=ant;e.currentTarget.disabled=false;e.currentTarget.textContent="Salvar e testar";return toast("triangle-alert","A chave não funcionou",(x&&x.amigavel)||"Confira se copiou a chave inteira.");}
    const c=cfg();c.geminiKey=k;save(c);try{localStorage.setItem("mu_gkey",k);}catch(x){}closeSheet();rr();toast("sparkles","Chave salva e funcionando","Jarvis, comprovantes e voz de IA ativados.");};});};
ACT.chaveApagar=()=>confirmSheet("Remover a chave do Gemini?","O Jarvis e a voz de IA param de usar o Gemini neste app.","Remover",()=>{const c=cfg();delete c.geminiKey;save(c);try{localStorage.removeItem("mu_gkey");}catch(e){}MU_CONFIG.geminiKey="";rr();});
