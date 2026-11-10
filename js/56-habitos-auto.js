"use strict";
/* ======================================================================
   HÁBITOS AUTOMÁTICOS
   - Treino de Kegel (ou Resistência) concluído → marca o hábito de Kegel do dia
   - Treino de academia completo → marca o hábito de atividade física do dia
   Se o hábito ainda não existir, ele é criado uma vez, com o nome padrão.
   ====================================================================== */
const HAB_AUTO={kegel:{re:/kegel/,nome:"Exercício de Kegel"},gym:{re:/(atividade f[ií]sica|exerc[ií]cio f[ií]sico|exerc[ií]cios|academia|treino|malh)/,nome:"Atividade física"}};
function habAuto(k,d){const A=HAB_AUTO[k];if(!A)return;let h=all("hab").find(x=>A.re.test(normTxt(x.nome||"")));
  if(!h){h={id:"hab_"+nid(),c:"hab",nome:A.nome,pts:10,o:Date.now(),dias:{}};}
  h.dias=h.dias||{};if(h.dias[d])return;h.dias[d]=1;save(h);toast("circle-check","Hábito marcado: "+h.nome,"+"+(h.pts||10)+" pontos");}
const _saveHabAuto=save;
save=function(doc){const novo=doc&&doc.id&&!DB.docs.has(doc.id);const r=_saveHabAuto.apply(this,arguments);
  /* só treinos de HOJE e registrados agora (não reprocessa histórico, backup nem sincronização) */
  try{if(novo&&doc.c==="trk"&&(doc.k==="kegel"||(doc.k==="gym"&&!doc.min))&&doc.d===TODAY())setTimeout(()=>habAuto(doc.k,doc.d),0);}catch(e){}
  return r;};
