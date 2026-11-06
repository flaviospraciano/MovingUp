"use strict";
/* ======================================================================
   CORREÇÕES v2.12
   - Virada do dia e do período com o app aberto: o Início se atualiza sozinho
     (tarefas passam para o novo dia; briefing, desafio, água e agenda ficam certos)
   ====================================================================== */
(()=>{let chave="";const ver=()=>{try{if(!DB.be)return;const k=TODAY()+"_"+periodo();if(!chave){chave=k;return;}if(k===chave)return;
    /* espera fechar o que estiver aberto por cima e tenta de novo depois */
    if(!$("sheet").classList.contains("hidden")||$("jsess")||$("kgp")||$("mdp")||$("gratp"))return;
    chave=k;rr();}catch(e){}};
  setInterval(ver,30000);document.addEventListener("visibilitychange",()=>{if(!document.hidden)ver();});})();
