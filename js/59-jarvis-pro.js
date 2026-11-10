"use strict";
/* ======================================================================
   JARVIS PROATIVO
   - Alertas preventivos: contas, tarefas atrasadas, documentos de edital, compromissos
     de amanhã, sequências de hábito em risco, água atrasada, revisões do IBGE
   - Cartão "Jarvis sugere" no Início, com ordem recomendada para o dia (sem perguntar)
   - Plano do dia: encaixa tarefas, treino, foco e revisões nos horários livres
   - Análise de desempenho (7 dias × 7 dias anteriores) e relatório semanal por voz
   - Memória: "lembre que…", "decidi…" vão para o Segundo cérebro; "o que você sabe sobre…"
   Ações financeiras, mensagens, exclusões e mudanças importantes pedem confirmação.
   ====================================================================== */
/* ---------- alertas ---------- */
function jvAlertas(){const t=TODAY(),am=addDays(t,1),A=[],now=new Date();
  const C=all("conta").filter(c=>c.status!=="paga"&&c.venc&&c.tipo==="pagar");
  C.filter(c=>c.venc<t).forEach(c=>A.push({p:0,ic:"receipt",t:`a conta ${c.desc} está atrasada`,curta:`pagar ${c.desc}`,min:15,abre:{v:"contas",tab:"pagar"}}));
  C.filter(c=>c.venc===t).forEach(c=>A.push({p:1,ic:"receipt",t:`a conta ${c.desc} vence hoje`,curta:`pagar ${c.desc}`,min:15,abre:{v:"contas",tab:"pagar"}}));
  C.filter(c=>c.venc===am).forEach(c=>A.push({p:2,ic:"receipt",t:`a conta ${c.desc} vence amanhã`,curta:`pagar ${c.desc}`,min:15,abre:{v:"contas",tab:"pagar"}}));
  try{const T=todosDoDia(t).filter(x=>!x.ok&&todoIdade(x)>=1);if(T.length)A.push({p:1,ic:"list-checks",t:`${T.length===1?"uma tarefa está":T.length+" tarefas estão"} atrasada${T.length>1?"s":""}`,curta:T.length===1?T[0].t:`${T.length} tarefas atrasadas`,min:30*Math.min(3,T.length),abre:{v:"home"}});}catch(e){}
  try{all("ed").forEach(e=>(e.pess||[]).forEach(p=>{if(p.st!=="c"||!p.docs||!p.docs.prazo)return;const f=(p.docs.itens||[]).filter(x=>!x.ok).length,n=diasAte(p.docs.prazo);if(f&&n<=3)A.push({p:n<=1?0:1,ic:"clipboard-check",t:`${f===1?"um documento":f+" documentos"} de ${p.n} (edital ${e.nome}) ${n<0?"com prazo vencido":(f===1?"vence":"vencem")+(n===0?" hoje":n===1?" amanhã":" em "+n+" dias")}`,curta:`documentos de ${p.n}`,min:30,acao:{a:"eddAbrir",ed:e.id,p:p.id}});}));}catch(e){}
  all("ev").filter(e=>evNoDia(e,am)&&e.h&&e.h<="09:00").forEach(e=>A.push({p:2,ic:"calendar-days",t:`amanhã cedo tem ${e.t} às ${e.h}`,curta:`preparar ${e.t}`,min:15,abre:{v:"cal"}}));
  if(now.getHours()>=17)all("hab").forEach(h=>{if(h.dias&&h.dias[t])return;let s=0,d=addDays(t,-1);while(h.dias&&h.dias[d]&&s<400){s++;d=addDays(d,-1);}if(s>=3)A.push({p:2,ic:"flame",t:`sua sequência de ${s} dias em ${h.nome} quebra hoje se não marcar`,curta:h.nome,min:20,abre:{v:"lemb"}});});
  try{const a=aguaCfg();if(a.on){const H=aguaHoras(a),pass=H.filter(x=>x<=pad(now.getHours())+":"+pad(now.getMinutes())).length;const esp=Math.round(+a.meta*pass/H.length);if(esp-aguaHoje()>=6)A.push({p:3,ic:"droplet",t:`a água está ${esp-aguaHoje()} copos atrás do ritmo`,curta:"beber água",min:5,abre:{v:"lemb"}});}}catch(e){}
  try{const due=ibDue(ibEst()).length;if(due>=5)A.push({p:3,ic:"brain-circuit",t:`há ${due} revisões do IBGE agendadas para hoje`,curta:"revisão do IBGE",min:20,abre:{v:"ibge"}});}catch(e){}
  return A.sort((a,b)=>a.p-b.p);}
/* recomendação de ordem: o mais urgente de manhã, o resto à tarde */
function jvRecomenda(A){if(!A.length)return"";const h=new Date().getHours();const m=A.slice(0,2),tdd=A.slice(2,4);
  const p1=h<12?"hoje pela manhã":"agora",p2=h<12?"à tarde":"à noite";
  return `Recomendo ${p1}: ${listaTxt(m.map(x=>x.curta))}${tdd.length?`. ${p2.charAt(0).toUpperCase()+p2.slice(1)}, reserve ${sum(tdd.map(x=>x.min))} minutos para ${listaTxt(tdd.map(x=>x.curta))}`:""}.`;}
function jvFalaAlertas(){const A=jvAlertas();if(!A.length)return"Nenhum alerta por agora. Tudo sob controle.";const top=A.slice(0,4).map(x=>x.t);return `Atenção: ${listaTxt(top)}${A.length>4?`, e mais ${A.length-4} ${A.length-4===1?"ponto":"pontos"}`:""}. ${jvRecomenda(A)}`;}

/* ---------- cartão proativo no Início ---------- */
function secJarvisPro(){if(typeof modoEssencial==="function"&&modoEssencial())return"";const A=jvAlertas();if(A.length<2)return"";const per=periodo(),k="mu_jvp_"+TODAY()+"_"+per;
  try{if(localStorage.getItem(k))return"";}catch(e){}
  return `<div class="jvp"><div class="row"><span class="mb" ${mstyle("jarvis")}>${ic("audio-lines")}</span><b class="grow">Jarvis sugere</b><button class="ib" data-a="jvpX" aria-label="Dispensar">${ic("x")}</button></div>
   <p>Atenção: ${esc(listaTxt(A.slice(0,3).map(x=>x.t)))}${A.length>3?` (e mais ${A.length-3} ${A.length-3===1?"ponto":"pontos"})`:""}. ${esc(jvRecomenda(A))}</p>
   <div class="btns h" style="margin-top:6px"><button class="btn sm" data-a="jvPlano">${ic("route")} Planejar meu dia</button><button class="btn ghost sm" data-a="jvpOuvir">${ic("volume-2")} Ouvir</button></div></div>`;}
ACT.jvpX=()=>{try{localStorage.setItem("mu_jvp_"+TODAY()+"_"+periodo(),1);}catch(e){}rr();};
ACT.jvpOuvir=()=>qualVoz(jvFalaAlertas());
const _home59=VIEWS.home;VIEWS.home=function(){const h=_home59.apply(this,arguments);const c=secJarvisPro();if(!c)return h;
  return h.replace(/(<div class="copi"[\s\S]*?<\/div>)/,"$1"+c);};

/* ---------- plano do dia ---------- */
const hm2m=s=>{const[a,b]=String(s).split(":").map(Number);return a*60+(b||0);},m2hm=m=>pad(Math.floor(m/60))+":"+pad(m%60);
function jvPlano(){const t=TODAY(),now=new Date(),ini=Math.max(7*60,Math.ceil((now.getHours()*60+now.getMinutes())/15)*15),fim=22*60;
  const ocup=all("ev").filter(e=>evNoDia(e,t)&&e.h).map(e=>({a:hm2m(e.h),b:hm2m(e.h)+60,t:e.t,tipo:"agenda"}));
  const blocos=[];const livre=(a,b)=>!ocup.concat(blocos).some(x=>a<x.b&&b>x.a);
  const encaixa=(min,t,tipo,pref)=>{for(let m=pref!=null?Math.max(ini,pref):ini;m+min<=fim;m+=15){if(livre(m,m+min)){blocos.push({a:m,b:m+min,t,tipo});return true;}}return false;};
  /* treino no horário de costume */
  try{treinoHoje(t).forEach(x=>encaixa(75,x.t,"treino",hm2m(x.h)));}catch(e){}
  /* urgências primeiro (alertas), depois tarefas importantes e o resto */
  jvAlertas().filter(a=>a.p<=1&&!/sequência|água/.test(a.t)).slice(0,3).forEach(a=>encaixa(a.min,a.curta.charAt(0).toUpperCase()+a.curta.slice(1),"urgente",ini));
  try{const T=todosDoDia(t).filter(x=>!x.ok).sort((a,b)=>(!!b.imp-!!a.imp));T.slice(0,5).forEach(x=>encaixa(x.imp?50:30,x.t,x.imp?"importante":"tarefa",ini));}catch(e){}
  try{const due=ibDue(ibEst()).length;if(due)encaixa(25,`Revisão do IBGE (${due})`,"estudo",14*60);}catch(e){}
  try{if(!desFeito(desDados(),t))encaixa(15,"Desafio do dia","treino",17*60);}catch(e){}
  encaixa(50,"Sessão de foco no projeto principal","foco",9*60);
  if(!dia().decl)encaixa(10,"Afirmações e gratidão","ritual",ini);
  encaixa(20,"Leitura","leitura",21*60);
  return ocup.filter(x=>x.b>ini).concat(blocos).sort((a,b)=>a.a-b.a);}
ACT.jvPlano=()=>{const P=jvPlano();if(!P.length)return toast("calendar","Dia livre","Nada para encaixar agora.");
  const cor={agenda:"#2563EB",treino:"#EA580C",urgente:"#DC2626",importante:"#D97706",tarefa:"#64748B",estudo:"#0E7490",foco:"#7C3AED",ritual:"#DB2777",leitura:"#16A34A"};
  sheet(`<div class="row"><span class="mb" ${mstyle("jarvis")}>${ic("route")}</span><h2 class="grow" style="margin:0">Seu dia, organizado</h2></div>
   <p class="small muted" style="margin:6px 0 10px">Montei com sua agenda, o treino no horário de costume, o que é urgente, as tarefas importantes e os horários livres.</p>
   <div class="jvpl">${P.map(x=>`<div class="jvpl-it" style="--c:${cor[x.tipo]||"#64748B"}"><span class="jvpl-h">${m2hm(x.a)}<small>${m2hm(x.b)}</small></span><span class="grow"><b>${esc(x.t)}</b><span class="tiny faint">${x.tipo}</span></span></div>`).join("")}</div>
   <div class="btns"><button class="btn full" id="plOk">${ic("alarm-clock")} Criar lembretes para esses horários</button><button class="btn ghost full" data-a="jvPlanoOuvir">${ic("volume-2")} Ouvir o plano</button><button class="btn ghost full" data-a="close">Só ver, obrigado</button></div>`,s=>{
    s.querySelector("#plOk").onclick=()=>confirmSheet("Criar os lembretes?",`${P.filter(x=>x.tipo!=="agenda").length} lembretes serão criados para hoje.`,"Criar",()=>{P.filter(x=>x.tipo!=="agenda").forEach(x=>save({id:"rem_"+nid(),c:"rem",t:x.t,d:TODAY(),h:m2hm(x.a),rep:"",feito:false,fired:"",plano:1}));if(typeof pushAgendar==="function")pushAgendar();rr();toast("alarm-clock","Plano aplicado","Lembretes criados nos horários.");});});};
ACT.jvPlanoOuvir=()=>{const P=jvPlano();qualVoz("Seu dia: "+P.slice(0,8).map(x=>`às ${m2hm(x.a).replace(":00"," horas").replace(":"," e ")}, ${x.t}`).join("; ")+".");};

/* ---------- análise de desempenho ---------- */
function jvPeriodoStats(de,ate){const D=[];for(let d=de;d<=ate;d=addDays(d,1))D.push(d);const H=all("hab");
  const hab=H.length?Math.round(sum(D.map(d=>H.filter(h=>h.dias&&h.dias[d]).length))/(H.length*D.length)*100):null;
  let tf=0,tt=0;try{D.forEach(d=>{const s=todoStats(d);tf+=s.fe;tt+=s.tot;});}catch(e){}
  const trn=all("trk").filter(x=>["gym","cap","run","swim"].includes(x.k)&&x.d>=de&&x.d<=ate).length;
  let ag=null;try{const a=aguaCfg();if(a.on)ag=Math.round(sum(D.map(d=>+a.log[d]||0))/D.length);}catch(e){}
  let q=0;try{const s=ibEst();q=sum(D.map(d=>(s.dia[d]||{}).q||0));}catch(e){}
  const gas=sum(all("exp").filter(e=>e.d>=de&&e.d<=ate).map(e=>+e.v||0));
  const des=all("trk").filter(x=>x.k==="des"&&x.d>=de&&x.d<=ate).length;
  return{hab,tar:tt?Math.round(tf/tt*100):null,tf,trn,ag,q,gas,des};}
function jvAnalise(){const t=TODAY(),A=jvPeriodoStats(addDays(t,-6),t),B=jvPeriodoStats(addDays(t,-13),addDays(t,-7));
  const M=[["hábitos",A.hab,B.hab,"%"],["tarefas concluídas",A.tar,B.tar,"%"],["treinos",A.trn,B.trn,""],["dias de desafio",A.des,B.des,""],["questões do IBGE",A.q,B.q,""],["copos de água por dia",A.ag,B.ag,""]].filter(x=>x[1]!=null&&(x[1]||x[2]));
  const sobe=M.filter(x=>x[1]>(x[2]||0)),cai=M.filter(x=>x[1]<(x[2]||0));
  let s=`Últimos 7 dias comparados com os 7 anteriores. `;
  s+=sobe.length?`Avançando em ${listaTxt(sobe.map(x=>`${x[0]} (${x[2]||0}${x[3]} → ${x[1]}${x[3]})`))}. `:"";
  s+=cai.length?`Perdendo consistência em ${listaTxt(cai.map(x=>`${x[0]} (${x[2]}${x[3]} → ${x[1]}${x[3]})`))}. `:"Nada caiu: consistência mantida. ";
  if(!DISCRETO&&(A.gas||B.gas))s+=`Gastos: ${moneyRaw(A.gas)} nesta semana${B.gas?`, contra ${moneyRaw(B.gas)} na anterior`:""}. `;
  if(cai.length)s+=`Sugestão: escolha uma coisa para recuperar — ${cai[0][0]} — e coloque um horário fixo para ela amanhã.`;
  return{s,sobe,cai,M};}
function jvSemana(){const t=TODAY(),A=jvPeriodoStats(addDays(t,-6),t);let pend=[];try{pend=all("todo").filter(x=>!x.ok&&x.d<=t).map(x=>x.t);}catch(e){}
  const ct=all("conta").filter(c=>c.status!=="paga"&&c.venc&&c.venc<=addDays(t,7)&&c.tipo==="pagar");const an=jvAnalise();
  return `Relatório da semana. Realizado: ${A.tf} tarefas concluídas, ${A.trn} treinos, ${A.des} dias de desafio${A.hab!=null?`, ${A.hab}% dos hábitos`:""}${A.q?`, ${A.q} questões do IBGE`:""}${A.ag!=null?`, média de ${A.ag} copos de água por dia`:""}. `+
    `Pendente: ${pend.length?`${pend.length} tarefas, como ${listaTxt(pend.slice(0,2))}`:"nenhuma tarefa"}${ct.length?`, e ${ct.length} conta${ct.length>1?"s":""} a pagar nos próximos 7 dias`:""}. `+
    `O que mudar: ${an.cai.length?`recuperar ${an.cai[0][0]}, que caiu em relação à semana anterior`:"manter o ritmo e subir um pouco a meta mais fácil"}.`;}

/* ---------- comandos do Jarvis ---------- */
const _rota59=rotaNova;rotaNova=function(txt){const n=normTxt(txt).replace(/^(ei |ok |oi )?jarvis[,\s]*/,"").replace(/[!.?]/g," ").trim();
  if(/^(planeja|planeje|organiza|organize|monta|monte)( o| meu)? (dia|meu dia)|plano (do|de) (dia|hoje)/.test(n)){closeSheet();ACT.jvPlano();return true;}
  if(/(como estou indo|analise|análise|meu desempenho|onde (estou|eu estou) (perdendo|falhando)|estou consistente)/.test(n)){const a=jvAnalise();jarResp("Análise de desempenho",a.s);return true;}
  if(/(relatorio|resumo) (da|de) semana|como foi (a|minha) semana/.test(n)){jarResp("Relatório da semana",jvSemana());return true;}
  if(/(alertas?|o que (é|e) urgente|tem algo urgente|o que nao posso esquecer)/.test(n)){jarResp("Alertas",jvFalaAlertas());return true;}
  /* memória */
  let m=String(txt).match(/^\s*(?:jarvis[,\s]*)?(?:lembre(?:-se)? que|lembra que|guarda que|guarde que|memoriza que|anota que|registra que)\s+(.+)$/i);
  if(m&&typeof cerSalvar==="function"){const x=cerSalvar(m[1],"memoria");jarResp("Guardado na memória",`Vou lembrar: “${x.t}”. Está no seu Segundo cérebro.`);return true;}
  m=String(txt).match(/^\s*(?:jarvis[,\s]*)?(?:decidi|eu decidi|decisão:|decisao:)\s+(.+)$/i);
  if(m&&typeof cerSalvar==="function"){const x=cerSalvar("Decidi "+m[1],"decisao");jarResp("Decisão registrada",`Anotei a decisão: “${x.t}”. Daqui a 30 dias eu te lembro de revisar.`);return true;}
  m=String(txt).match(/^\s*(?:jarvis[,\s]*)?(?:ideia|tive uma ideia|anota a ideia|guarda a ideia)[:,]?\s+(.+)$/i);
  if(m&&typeof cerSalvar==="function"){const x=cerSalvar(m[1],"ideia");jarResp("Ideia guardada",`“${x.t}” está no Segundo cérebro${x.links&&x.links.length?`, ligada a ${listaTxt(x.links.slice(0,3))}`:""}.`);return true;}
  m=n.match(/^(o que (voce|vc) sabe|o que eu (sei|decidi|anotei)|me lembra o que)( sobre| de| do| da)? (.+)$/);
  if(m&&typeof cerBuscar==="function"){const R=cerBuscar(m[5]).slice(0,5);jarResp("Do seu Segundo cérebro",R.length?R.map(x=>`• ${x.titulo}${x.trecho?": "+x.trecho:""}`).join("\n"):`Não encontrei nada sobre “${m[5]}”. Diga “lembre que…” para eu guardar.`);return true;}
  return _rota59(txt);};
try{JAR_TIPOS.segundo_cerebro="cer";JAR_DESC.segundo_cerebro="Segundo cérebro: ideias, decisões, aprendizados, referências, links e memórias (t=título, x=texto, tipo, tags)";}catch(e){}

/* ---------- relatório semanal no domingo ---------- */
const _secBrf59=secBriefing;secBriefing=function(){const h=_secBrf59();const d=new Date();if(d.getDay()!==0||d.getHours()<17)return h;let k="mu_jvsem_"+TODAY();try{if(localStorage.getItem(k))return h;}catch(e){}
  return `<div class="jvp"><div class="row"><span class="mb" ${mstyle("jarvis")}>${ic("bar-chart")}</span><b class="grow">Relatório da semana pronto</b><button class="ib" data-a="jvSemX" aria-label="Dispensar">${ic("x")}</button></div><p>O que você realizou, o que ficou pendente e o que mudar na próxima semana.</p><div class="btns h" style="margin-top:6px"><button class="btn sm" data-a="jvSemOuvir">${ic("volume-2")} Ouvir</button><button class="btn ghost sm" data-a="jvSemLer">Ler</button></div></div>`+h;};
ACT.jvSemX=()=>{try{localStorage.setItem("mu_jvsem_"+TODAY(),1);}catch(e){}rr();};
ACT.jvSemOuvir=()=>{qualVoz(jvSemana());ACT.jvSemX();};
ACT.jvSemLer=()=>{jarResp("Relatório da semana",jvSemana());ACT.jvSemX();};
