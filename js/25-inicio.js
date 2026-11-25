"use strict";
/* ======================================================================
   INÍCIO E MÓDULOS · onde os módulos novos aparecem
   No Início entra só um cartão de "Avisos", e só quando algo pede ação.
   ====================================================================== */
(()=>{const add=(grupo,ks,depois)=>{const g=MOD_GROUPS.find(x=>x[0]===grupo);if(!g)return MOD_GROUPS.push([grupo,ks]);
    ks.forEach(k=>{if(g[1].includes(k))return;const i=depois?g[1].indexOf(depois):-1;if(i<0)g[1].push(k);else g[1].splice(i+1,0,k);});};
  const metas=MOD_GROUPS.find(x=>x[0]==="Metas");if(metas)metas[1]=metas[1].filter(k=>k!=="ano"); /* as metas do ano agora vivem dentro de 12 semanas */
  add("Metas",["ciclo","cmp"]);add("Rotina e espiritualidade",["med"]);add("Estudos e crescimento",["port"],"conc");add("Estudos e crescimento",["feyn"],"conc");add("Trabalho e cultura",["ctt"],"editais");add("Vida pessoal",["carta"]);})();

/* Avisos: cartas que chegaram, prazos vencidos, contatos e revisões pendentes */
function secAvisos(){const A=[],go=v=>`data-a="go" data-v="${gv(v)}"`;
  const al=alertasNovos();if(al.length)A.push(["jarvis","triangle-alert",al.length===1?"Alerta: "+al[0].t:`${al.length} sinais de atenção nesta semana`,`data-a="alertas"`]);
  const ca=cartasChegaram();if(ca.length)A.push(["carta","mail-open",ca.length===1?"Chegou uma carta do seu eu do passado":`Chegaram ${ca.length} cartas do seu eu do passado`,go({v:"carta"})]);
  cmpVencidos().slice(0,2).forEach(c=>A.push(["cmp","handshake",`Prazo vencido: ${c.meta}. Cumpriu?`,go({v:"cmp"})]));
  const pg=cmpPendentes();if(pg.length)A.push(["cmp","scale",pg.length===1?`Consequência a pagar: ${pg[0].cons}`:`${pg.length} consequências a pagar`,go({v:"cmp"})]);
  const ci=cicAberto();if(ci&&cicSem(ci)>12)A.push(["ciclo","flag","O ciclo terminou: faça a revisão",`data-a="cicRev" data-c="${ci.id}"`]);
  const ct=cttDevidos();if(ct.length)A.push(["ctt","users",ct.length===1?`Retomar contato com ${ct[0].nome}`:`${ct.length} contatos para retomar`,go({v:"ctt"})]);
  const fy=feyDevidos();if(fy.length)A.push(["feyn","brain",fy.length===1?`Revisar: ${fy[0].conceito}`:`${fy.length} conceitos para revisar`,go({v:"feyn"})]);
  if(!A.length)return"";AVISOS=A;
  const row=([k,i,t,a])=>`<button class="av" role="listitem" ${mstyle(k)} ${a}><span class="mb">${ic(i)}</span><span class="grow">${esc(t)}</span>${ic("chevron-right")}</button>`;
  /* no máximo 4 linhas no Início; o resto fica a um toque */
  const V=A.length>4?A.slice(0,3).map(row).join("")+`<button class="av" role="listitem" data-a="avisosTodos"><span class="mb" style="background:var(--sf3);color:var(--soft)">${ic("ellipsis-vertical")}</span><span class="grow">Mais ${A.length-3} avisos</span>${ic("chevron-right")}</button>`:A.map(row).join("");
  return `<div class="avs" role="list" aria-label="Avisos">${V}</div>`;}
let AVISOS=[];
ACT.avisosTodos=()=>sheet(`<h2>Avisos</h2><div class="avs" style="box-shadow:none">${AVISOS.map(([k,i,t,a])=>`<button class="av" ${mstyle(k)} ${a}><span class="mb">${ic(i)}</span><span class="grow">${esc(t)}</span>${ic("chevron-right")}</button>`).join("")}</div>`);
