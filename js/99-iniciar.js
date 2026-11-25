"use strict";
/* ======================================================================
   INICIAR · roda por último, depois que todos os módulos foram carregados
   ====================================================================== */
boot();
if("serviceWorker" in navigator&&location.protocol==="https:"&&!/claude/.test(location.hostname))
  window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
