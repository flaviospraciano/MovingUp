"use strict";
/* ======================================================================
   AJUSTES v2.10
   1. Sem frases de capoeira e de Paulo Freire na Frase do dia
   2. Treino de academia concluído hoje sai do Início
   3. Ciclo dos treinos: o treino feito fica marcado até todos os outros
      serem feitos; quando o ciclo fecha, tudo recomeça (no dia seguinte)
   ====================================================================== */

/* ---------- 1. FRASES ---------- */
(()=>{const fora=([t,a])=>/pastinha|bimba|freire|mestre /i.test(a||"")||/capoeira|berimbau|\broda\b|ginga|mandinga|ax[eé]\b/i.test(t||"");
  for(let i=FRASES.length-1;i>=0;i--)if(fora(FRASES[i]))FRASES.splice(i,1);})();

/* ---------- 3. CICLO DOS TREINOS ---------- */
/* single("trciclo") = {feitos:{trId:data}, fechadoEm:"", n:ciclos completos} */
const trCiclo=()=>{const c=single("trciclo",{feitos:{},fechadoEm:"",n:0});c.feitos=c.feitos||{};return c;};
const trAtivos=()=>all("tr").filter(t=>(t.ex||[]).length).sort((a,b)=>(a.o||0)-(b.o||0));
/* o ciclo fechado recomeça no dia seguinte (até lá os treinos aparecem todos concluídos) */
function trCicloAtual(){const c=trCiclo();if(c.fechadoEm&&c.fechadoEm<TODAY()){c.feitos={};c.fechadoEm="";save(c);}return c;}
const trNoCiclo=tr=>!!(tr&&trCicloAtual().feitos[tr.id]);
const _trDone49=trDone;
trDone=function(tr,d){if(tr&&d===TODAY()&&trNoCiclo(tr))return (tr.ex||[]).map(e=>e.id);return _trDone49.apply(this,arguments);};
/* sugerido: o próximo da ordem que ainda não foi feito no ciclo */
const _trSug49=trSugerido;
trSugerido=function(T){const c=trCicloAtual(),A=(T||[]).filter(t=>(t.ex||[]).length);if(!A.length)return _trSug49.apply(this,arguments);
  if(c.fechadoEm)return A[0];const falta=A.filter(t=>!c.feitos[t.id]);if(!falta.length)return A[0];
  const ult=Object.entries(c.feitos).sort((a,b)=>a[1].localeCompare(b[1])).map(([id])=>id).pop();const i=A.findIndex(t=>t.id===ult);
  for(let k=1;k<=A.length;k++){const t=A[(i+k+A.length)%A.length];if(!c.feitos[t.id])return t;}return falta[0];};
try{if(typeof proximoTreino==="function"){const _pt49=proximoTreino;proximoTreino=function(TT){return trSugerido(TT&&TT.length?TT:trAtivos())||_pt49.apply(this,arguments);};}}catch(e){}
function trFechouAgora(tr){const c=trCicloAtual();c.feitos[tr.id]=TODAY();const A=trAtivos();const todos=A.length&&A.every(t=>c.feitos[t.id]);
  if(todos){c.fechadoEm=TODAY();c.n=(c.n||0)+1;}save(c);return todos;}
const _trCk49=ACT.trCk;
ACT.trCk=el=>{const tr=curTr(),t=TODAY(),c=trCicloAtual();
  /* desmarcar um exercício de um treino já concluído no ciclo: ele volta a ficar em andamento */
  if(c.feitos[tr.id]){delete c.feitos[tr.id];c.fechadoEm="";save(c);const id=trcId(tr.id,t);const d=getD(id)||{id,c:"trc",tr:tr.id,d:t,done:[]};d.done=(tr.ex||[]).map(e=>e.id);save(d);}
  const antes=_trDone49(tr,t).length>=(tr.ex||[]).length&&(tr.ex||[]).length;
  _trCk49(el);
  const agora=(tr.ex||[]).length&&_trDone49(tr,t).length>=tr.ex.length;
  if(agora&&!antes&&!trCicloAtual().feitos[tr.id]){const fechou=trFechouAgora(tr);
    if(fechou)setTimeout(()=>toast("trophy","Ciclo completo!",`Todos os treinos feitos (${trAtivos().map(x=>x.letra).join(", ")}). Amanhã recomeça.`),900);
    else{const f=trAtivos().filter(x=>!trCiclo().feitos[x.id]).map(x=>x.letra);setTimeout(()=>toast("check",`Treino ${tr.letra} fica marcado`,`Faltam ${f.join(" e ")} para fechar o ciclo.`),900);}rr();}};
const _trReset49=ACT.trReset;ACT.trReset=()=>{const tr=curTr(),c=trCiclo();if(c.feitos[tr.id]){delete c.feitos[tr.id];c.fechadoEm="";save(c);}_trReset49();};
/* na planilha: abas com ✓ e uma faixa mostrando o ciclo */
const _trView49=treinosView;
treinosView=function(){let h=_trView49.apply(this,arguments);const c=trCicloAtual(),A=trAtivos();if(!A.length)return h;
  A.forEach(t=>{if(c.feitos[t.id])h=h.replace(new RegExp(`(data-a="trSel" data-id="${t.id}"[^>]*>)Treino `),`$1✓ Treino `);});
  const tr=getD(VIEW.trId);if(tr&&c.feitos[tr.id])h=h.replace(/<b class="small">\d+\/\d+ hoje<\/b>/,`<b class="small">feito em ${fdate(c.feitos[tr.id]).slice(0,5)}</b>`).replace(`${ic("rotate-ccw")} Desmarcar hoje`,`${ic("rotate-ccw")} Desmarcar`);
  const falta=A.filter(t=>!c.feitos[t.id]);
  const faixa=`<div class="trcic ${c.fechadoEm?"ok":""}">${A.map(t=>`<span class="l ${c.feitos[t.id]?"on":""}">${c.feitos[t.id]?ic("check"):""}${esc(t.letra)}</span>`).join("")}<b class="grow">${c.fechadoEm?"Ciclo completo! Amanhã recomeça.":falta.length===A.length?"Ciclo novo: comece pelo Treino "+esc(falta[0].letra):`Faltam ${falta.map(t=>t.letra).join(" e ")} para fechar o ciclo`}</b>${c.n?`<span class="tiny faint">${c.n} ${c.n===1?"ciclo":"ciclos"}</span>`:""}</div>`;
  return h.replace(/(<div class="hero">)/,faixa+"$1");};

/* ---------- 2. TREINO FEITO SAI DO INÍCIO ---------- */
const gymHoje=()=>trkHas("gym",TODAY());
const _secTreino49=secTreino;secTreino=function(){return gymHoje()?"":_secTreino49.apply(this,arguments);};
const _secAcad49=secAcad;secAcad=function(){return gymHoje()?"":_secAcad49.apply(this,arguments);};
