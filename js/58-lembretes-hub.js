"use strict";
/* ======================================================================
   LEMBRETES CONECTADOS + INÍCIO QUE SE LIMPA + DESAFIOS DE CRESCIMENTO
   1. A tela Lembretes reúne tudo o que precisa ser feito: agenda, treinos, hábitos,
      rituais, água, contas e desafios. Cada item só sai quando é MARCADO (faz a ação
      de verdade no módulo) ou EXCLUÍDO do dia. Compromissos não marcados ficam como
      atrasados por até 7 dias. Número de pendências na barra de baixo.
   2. No Início, o que já foi resolvido some (hábitos feitos, água batida, afirmação
      declarada, Check feito, desafio, gratidão, briefing) e vira uma linha "Feito hoje".
   3. Recompensa que faz crescer: ao pontuar bem nos hábitos, o app propõe um desafio
      de crescimento proporcional aos pontos (correr, vender, estudar, ler, guardar…).
   ====================================================================== */
const lhub=()=>{let h=DB.docs.get("lhub");if(!h){h=single("lhub",{ok:{},x:{}});save(h);}h.ok=h.ok||{};h.x=h.x||{};return h;};
const lhMarcado=(k,d)=>!!((lhub().ok[d]||{})[k]);
const lhExcluido=(k,d)=>!!((lhub().x[d]||{})[k]);
function lhSet(tipo,k,d){const h=lhub();(h[tipo][d]=h[tipo][d]||{})[k]=1;
  /* limpa dias velhos (mais de 15) */Object.keys(h[tipo]).forEach(x=>{if(x<addDays(TODAY(),-15))delete h[tipo][x];});save(h);}

/* ---------- itens de hoje (gerados a partir de todo o app) ---------- */
function lhItens(){const t=TODAY(),now=new Date(),L=[];const add=o=>{if(lhExcluido(o.k,o.d||t))return;L.push(Object.assign({d:t},o));};
  /* agenda: hoje e atrasados não marcados (até 7 dias) */
  for(let i=7;i>=0;i--){const d=addDays(t,-i);all("ev").filter(e=>e.d===d||(i===0&&evNoDia(e,d))).forEach(e=>{const k="ev:"+e.id+(e.d!==d?":"+d:"");if(lhMarcado(k,d))return;
      if(i===0&&e.h&&dtOf(d,e.h)>new Date(now.getTime()+18*3600e3))return;
      add({k,d,g:"agenda",ic:"calendar-days",t:e.t,sub:(i?"atrasado · "+fshort(d):"hoje")+(e.h?" · "+e.h:""),h:e.h||"",tarde:i>0,ok:()=>{},abre:{v:"cal"}});});}
  /* lembretes do próprio app (rem) atrasados ficam na lista nativa abaixo */
  /* treinos sugeridos (academia, corrida do plano) */
  try{treinoHoje(t).forEach(x=>add({k:"tr:"+x.t,g:"treino",ic:x.ic,t:x.t,sub:"treino de hoje · "+x.h,h:x.h,abre:x.v,ok:()=>{const k=x.v.k==="gym"?"gym":"run";if(!trkHas(k,t))save({id:tid(k,t),c:"trk",k,d:t});}}));}catch(e){}
  /* desafio */
  try{const D=desDados(),w=desSemana(t);if(!desFeito(D,t)){const f=DES_SERIES-desSer(D,t).filter(Boolean).length;add({k:"des",g:"treino",ic:"flame",t:`Desafio: ${DES_SERIES}×${desReps(D,DES[w][0])} ${DES[w][1].toLowerCase()}`,sub:`faltam ${f} ${f===1?"série":"séries"}`,abre:{v:"des"},ok:()=>{D.log[t]=Array(DES_SERIES).fill(1);save(D);desSyncCheck(t);if(!getD("fiz_des_"+t))save({id:"fiz_des_"+t,c:"fiz",t:`Desafio: ${DES_SERIES}×${desReps(D,DES[w][0])} ${DES[w][1].toLowerCase()}`,d:t,auto:1});}});}}catch(e){}
  /* Check (rituais, Kegel, estudo, Bíblia, meditação, capoeira…) */
  const ckG={man:"ritual",bib:"ritual",med:"ritual",conc:"estudo",kegel:"treino",cap:"treino",gym:"treino"};
  Object.keys(TRK).filter(k=>MODS[k]&&!["swim","run","des"].includes(k)).forEach(k=>{if(trkHas(k,t))return;if(k==="gym"&&L.some(x=>x.k.startsWith("tr:")))return;
    add({k:"ck:"+k,g:ckG[k]||"ritual",ic:MODS[k].ic,t:typeof ckNome==="function"?ckNome(k):MODS[k].n,sub:"Check de hoje",abre:MODS[k].v,ok:()=>{if(!trkHas(k,t))save({id:tid(k,t),c:"trk",k,d:t});}});});
  /* afirmações e gratidão */
  try{const x=dia();if(!(x.decl>0))add({k:"afirm",g:"ritual",ic:"sparkles",t:"Declarar as afirmações",sub:"Repita comigo ou declare agora",abre:{v:"home"},ok:()=>{const y=dia();y.decl=(y.decl||0)+1;save(y);}});
    const g=(x.grat||[]).filter(Boolean).length+all("grat").filter(z=>z.d===t).length;if(!g)add({k:"grat",g:"ritual",ic:"heart",t:"Gratidão do dia",sub:"um motivo para agradecer",acao:"gratAbrirLh",ok:null});}catch(e){}
  /* hábitos */
  all("hab").sort((a,b)=>(a.o||0)-(b.o||0)).forEach(hb=>{if(hb.dias&&hb.dias[t])return;add({k:"hab:"+hb.id,g:"habito",ic:"list-checks",t:hb.nome,sub:"hábito · "+(hb.pts||10)+" pts",ok:()=>{const y=getD(hb.id);y.dias=y.dias||{};y.dias[t]=1;save(y);}});});
  /* água */
  try{const a=aguaCfg();if(a.on&&aguaHoje()<+a.meta)add({k:"agua",g:"saude",ic:"droplet",t:`Água: ${aguaHoje()} de ${a.meta} copos`,sub:`faltam ${((+a.meta-aguaHoje())*(+a.ml||100)/1000).toLocaleString("pt-BR")} L`,mais:1,ok:()=>{a.log[t]=+a.meta;save(a);}});}catch(e){}
  /* contas: atrasadas e de hoje/amanhã (pagar exige confirmação) */
  all("conta").filter(c=>c.status!=="paga"&&c.venc&&c.venc<=addDays(t,1)).forEach(c=>add({k:"ct:"+c.id,g:"conta",ic:c.tipo==="receber"?"coins":"receipt",t:(c.tipo==="receber"?"Receber: ":"Pagar: ")+c.desc,sub:(c.venc<t?"atrasada":c.venc===t?"vence hoje":"vence amanhã")+(DISCRETO?"":" · "+money(c.valor)),tarde:c.venc<t,abre:{v:"contas",tab:c.tipo},conf:`Marcar "${c.desc}" como ${c.tipo==="receber"?"recebida":"paga"}?`,ok:()=>{const y=getD(c.id);y.status="paga";y.pagoEm=TODAY();save(y);}}));
  /* tarefas importantes */
  try{todosDoDia(t).filter(x=>!x.ok&&x.imp&&!x.cresc).forEach(x=>add({k:"td:"+x.id,g:"tarefa",ic:"star",t:x.t,sub:"tarefa importante",ok:()=>{const y=getD(x.id);if(y&&!y.ok)todoMarca(y,true);}}));}catch(e){}
  /* desafio de crescimento aceito */
  const C=crescHoje();if(C&&C.st==="aceito")add({k:"cresc",g:"crescimento",ic:"trophy",t:C.txt,sub:"desafio de crescimento",ok:()=>{const c=cresc();c.d[t].st="feito";c.feitos=(c.feitos||0)+1;save(c);}});
  return L;}
const LH_G=[["agenda","Agenda","calendar-days"],["conta","Contas","receipt"],["treino","Treinos","dumbbell"],["ritual","Rituais","sparkles"],["habito","Hábitos","list-checks"],["saude","Saúde","droplet"],["estudo","Estudo","graduation-cap"],["tarefa","Tarefas importantes","star"],["crescimento","Crescimento","trophy"]];
let LH_ITENS=[];
function lhHTML(){const L=lhItens();LH_ITENS=L;if(!L.length)return `<div class="lh-vazio">${ic("circle-check")}<b>Tudo em dia por hoje</b><span>Agenda, treinos, hábitos e rituais marcados.</span></div>`;
  const tarde=L.filter(x=>x.tarde).length;
  return `<div class="lh-top"><b>${L.length} ${L.length===1?"coisa":"coisas"} para hoje</b>${tarde?`<span class="chip n">${tarde} atrasada${tarde>1?"s":""}</span>`:""}<span class="tiny faint">Só sai daqui quando você marca ✓ ou exclui ✕.</span></div>`+
   LH_G.map(([g,n,i])=>{const G=L.filter(x=>x.g===g);if(!G.length)return"";return `<div class="grp">${ic(i)} ${n}<span class="chip">${G.length}</span></div>`+G.map(x=>{const j=L.indexOf(x);
     return `<div class="lh-it ${x.tarde?"tarde":""}"><button class="lh-ck" data-a="lhOk" data-j="${j}" aria-label="Marcar como feito: ${esc(x.t)}">${ic("check")}</button><button class="grow lh-tx" data-a="lhAbre" data-j="${j}"><b>${esc(x.t)}</b><span class="tiny ${x.tarde?"":"faint"}">${esc(x.sub)}</span></button>${x.mais?`<button class="btn ghost sm" data-a="aguaMais" aria-label="Mais um copo">+1</button>`:""}<button class="lh-x" data-a="lhX" data-j="${j}" aria-label="Excluir de hoje">${ic("x")}</button></div>`;}).join("");}).join("");}
const lhExec=x=>{try{if(x.ok)x.ok();}catch(e){console.warn(e);}lhSet("ok",x.k,x.d);rr();toast("check","Feito: "+x.t,"");try{navigator.vibrate&&navigator.vibrate(20);}catch(e){}};
ACT.lhOk=el=>{const x=LH_ITENS[+el.dataset.j];if(!x)return;if(x.acao)return ACT[x.acao]&&ACT[x.acao]();if(x.conf)return confirmSheet(x.conf,"Confirme antes de alterar uma conta.","Confirmar",()=>lhExec(x));lhExec(x);};
ACT.lhX=el=>{const x=LH_ITENS[+el.dataset.j];if(!x)return;confirmSheet("Excluir de hoje?",`"${x.t}" sai da lista de hoje sem ser marcado como feito.`,"Excluir",()=>{lhSet("x",x.k,x.d);rr();});};
ACT.lhAbre=el=>{const x=LH_ITENS[+el.dataset.j];if(!x)return;if(x.acao)return ACT[x.acao]();if(x.abre)go(x.abre);};
ACT.gratAbrirLh=()=>{try{if(typeof gratOpen==="function")return gratOpen();}catch(e){}go({v:"home"});};
const _lemb58=VIEWS.lemb;VIEWS.lemb=function(){const h=_lemb58.apply(this,arguments);const bloco=`<div class="lh">${lhHTML()}</div><div class="grp" style="margin-top:22px">${ic("alarm-clock")} Seus lembretes</div>`;
  return h.replace(/(<div class="qadd">)/,bloco+"$1");};
/* número de pendências na barra de baixo */
function lhBadge(){try{const n=lhItens().length;document.querySelectorAll('#navIn [data-v*="lemb"]').forEach(b=>{let s=b.querySelector(".nbadge");if(!n){if(s)s.remove();return;}if(!s){s=document.createElement("span");s.className="nbadge";b.appendChild(s);}s.textContent=n>9?"9+":n;});}catch(e){}}
const _render58=render;render=function(){const r=_render58.apply(this,arguments);setTimeout(lhBadge,0);return r;};
/* aviso à noite com o que ficou (app aberto) */
setInterval(()=>{try{const d=new Date();if(d.getHours()!==20||d.getMinutes()>1)return;const k="mu_lh_aviso_"+TODAY();if(localStorage.getItem(k))return;localStorage.setItem(k,1);const n=lhItens().length;if(n)notify("Ainda faltam "+n+" itens hoje","Abra Lembretes para marcar ou excluir.");}catch(e){}},45000);

/* ---------- 2. INÍCIO QUE SE LIMPA ---------- */
const feitoHoje=[];
const _secHab58=secHab;secHab=function(){const t=TODAY(),H=all("hab").sort((a,b)=>(a.o||0)-(b.o||0));if(!H.length)return"";const P=H.filter(z=>!(z.dias&&z.dias[t]));
  if(!P.length){feitoHoje.push(`${H.length} hábitos`);return"";}
  return `<div class="sec"><h2>Hábitos de hoje</h2><button class="lk" data-a="tab" data-v="${gv({v:"habitos"})}">${H.length-P.length}/${H.length}</button></div><div ${mstyle("habitos")} class="hgrid2">${P.slice(0,6).map(z=>`<button class="hchip" data-a="habT" data-id="${z.id}" data-d="${t}"><span class="ck">${ic("check")}</span><span class="grow">${esc(z.nome)}</span></button>`).join("")}</div>`;};
const _secAgua58=secAgua;secAgua=function(){try{const a=aguaCfg();if(a.on&&aguaHoje()>=+a.meta){feitoHoje.push("água");return"";}}catch(e){}return _secAgua58();};
const _secCheck58=secCheck;secCheck=function(){const h=_secCheck58();const t=TODAY();
  /* tira os itens já feitos do Check; se tudo feito, some */
  const d=document.createElement("div");d.innerHTML=h;const bt=[...d.querySelectorAll(".quick .qk")];const feitos=bt.filter(b=>b.classList.contains("on"));feitos.forEach(b=>b.remove());
  if(bt.length&&feitos.length===bt.length){feitoHoje.push("Check completo");const ag=d.querySelector(".agua,.mini");return ag?ag.outerHTML:"";}
  return d.innerHTML;};
const _secMente58=secMente;secMente=function(){try{if(dia().decl>0){feitoHoje.push("afirmações");return `<div class="sec"><h2>${ic("sparkles")} Mentalidade</h2></div>${secFrase()}`;}}catch(e){}return _secMente58();};
const _secDes58=secDesafio;secDesafio=function(){try{if(desFeito(desDados(),TODAY())&&!DES_ABRIR){feitoHoje.push("desafio");return"";}}catch(e){}return _secDes58();};
const _secGrat58=secGrat;secGrat=function(){const h=_secGrat58();if(h&&!GRAT_ABRIR&&/gratAbrir/.test(h)){feitoHoje.push("gratidão");return"";}return h;};
const _secBrf58=secBriefing;secBriefing=function(){const h=_secBrf58();if(/brfOuvir/.test(h)&&/ouvido/.test(h)){feitoHoje.push("briefing");return"";}return h;};
const _home58=VIEWS.home;VIEWS.home=function(){feitoHoje.length=0;let h=_home58.apply(this,arguments);const F=[...new Set(feitoHoje)];
  const cr=secCresc();if(cr)h=h.replace(/(<div class="sec"><h2>[^<]*<svg[^>]*>.*?<\/svg> Tarefas de hoje)/,cr+"$1");
  if(F.length){const linha=`<button class="mini lh-feito" style="--mc:#16A34A;margin-top:16px" data-a="tab" data-v="${gv({v:"lemb"})}"><span class="mini-i">${ic("circle-check")}</span><span class="grow"><b>Feito hoje:</b> ${esc(F.join(" · "))}</span>${ic("chevron-right")}</button>`;
    h=h.replace(/(<div class="foot">)/,linha+"$1");if(!/lh-feito/.test(h))h=h.replace(/<\/div>\s*$/,linha+"</div>");}
  return h;};

/* ---------- 3. DESAFIOS DE CRESCIMENTO ---------- */
const cresc=()=>{let c=DB.docs.get("cresc");if(!c){c=single("cresc",{d:{},feitos:0});save(c);}c.d=c.d||{};return c;};
const crescHoje=()=>cresc().d[TODAY()]||null;
function pontosHoje(){const t=TODAY();const H=all("hab");const hp=sum(H.filter(h=>h.dias&&h.dias[t]).map(h=>+h.pts||10));const ck=Object.keys(TRK).filter(k=>trkHas(k,t)).length*5;
  let td=0;try{td=todosDoDia(t).filter(x=>x.ok).length*3;}catch(e){}return{tot:hp+ck+td,hab:H.length?H.filter(h=>h.dias&&h.dias[t]).length/H.length:0};}
const CRESC=[
 p=>({a:"corrida",txt:`Corra ${Math.min(21,3+Math.floor(p/40))} km hoje`,ic:"footprints"}),
 p=>{const O=all("orc").filter(o=>+o.v>0);const base=O.length?sum(O.map(o=>+o.v))/O.length:300;const v=Math.round(base*(1+p/200)/50)*50;return{a:"venda",txt:`Feche uma venda de ${moneyRaw(v)}`,ic:"coins"};},
 p=>({a:"prospec",txt:`Envie ${Math.min(10,2+Math.floor(p/50))} orçamentos para clientes novos`,ic:"send"}),
 p=>({a:"questoes",txt:`Faça ${Math.min(150,Math.round((30+p/2)/10)*10)} questões do IBGE`,ic:"graduation-cap"}),
 p=>({a:"simulado",txt:"Faça um simulado completo do IBGE (60 questões)",ic:"clipboard-check",min:120}),
 p=>({a:"leitura",txt:`Leia ${Math.min(80,15+Math.floor(p/5))} páginas do livro atual`,ic:"book-open"}),
 p=>({a:"poupanca",txt:`Guarde ${moneyRaw(Math.round((20+p)/10)*10)} na sua meta de poupança`,ic:"piggy-bank"}),
 p=>({a:"treino",txt:`Faça ${Math.min(200,50+p)} flexões extras ao longo do dia`,ic:"flame"}),
 p=>({a:"rede",txt:`Retome contato com ${Math.min(8,2+Math.floor(p/60))} pessoas da sua rede profissional`,ic:"users"}),
 p=>({a:"foco",txt:`Faça ${Math.min(4,1+Math.floor(p/80))} sessões de foco de 50 minutos no seu projeto principal`,ic:"timer"})];
function crescSortear(p,evita){const c=cresc();const usados=Object.values(c.d).slice(-5).map(x=>x.a);const r=ibRng(Date.now()%2147483647);
  const ops=CRESC.map(f=>f(p)).filter(o=>o.a!==evita&&!usados.includes(o.a)&&(o.a!=="simulado"||p>=120));return ibPick(r,ops.length?ops:CRESC.map(f=>f(p)));}
function secCresc(){const t=TODAY(),P=pontosHoje(),c=cresc();let C=c.d[t];
  /* libera quando você cumpre ao menos 80% dos hábitos do dia (ou faz 60 pontos) */
  if(!C&&(P.hab>=.8||P.tot>=60)&&all("hab").length){const o=crescSortear(P.tot);C=c.d[t]={...o,st:"novo",pts:P.tot,trocas:0};save(c);}
  if(!C||C.st!=="novo")return"";
  return `<div class="cresc"><span class="cresc-i">${ic("trophy")}</span><div class="grow"><span class="tiny">Parabéns: você fez ${C.pts} pontos hoje.</span><b>Seu prêmio é crescer:</b><p>${esc(C.txt)}</p>
    <div class="btns h" style="margin-top:8px"><button class="btn sm" data-a="crescOk">${ic("check")} Aceitar</button>${C.trocas<2?`<button class="btn ghost sm" data-a="crescTroca">${ic("repeat")} Outro</button>`:""}<button class="btn ghost sm" data-a="crescNao">Hoje não</button></div></div></div>`;}
ACT.crescOk=()=>{const c=cresc(),C=c.d[TODAY()];C.st="aceito";save(c);
  if(C.a==="questoes"){}const o=Math.max(0,...all("todo").filter(x=>x.d===TODAY()).map(x=>x.o||0))+1;save({id:"todo_cr_"+TODAY(),c:"todo",t:"🏆 "+C.txt,d:TODAY(),dias:[TODAY()],ok:false,o,imp:true,cresc:1});
  rr();toast("trophy","Desafio aceito","Está nas tarefas e em Lembretes até você concluir.");};
ACT.crescTroca=()=>{const c=cresc(),C=c.d[TODAY()];const n=crescSortear(C.pts,C.a);Object.assign(C,n,{trocas:(C.trocas||0)+1});save(c);rr();};
ACT.crescNao=()=>{const c=cresc();c.d[TODAY()].st="recusado";save(c);rr();};
/* concluir a tarefa do desafio conclui o desafio */
const _todoMarca58=todoMarca;todoMarca=function(x,ok){_todoMarca58.apply(this,arguments);try{if(x&&x.cresc&&ok){const c=cresc(),C=c.d[x.d]||c.d[TODAY()];if(C&&C.st!=="feito"){C.st="feito";c.feitos=(c.feitos||0)+1;save(c);setTimeout(()=>toast("trophy","Desafio de crescimento cumprido!",`${c.feitos} no total. Você está crescendo.`),300);}}}catch(e){}};
