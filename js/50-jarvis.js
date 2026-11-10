"use strict";
/* ======================================================================
   JARVIS v2.11 · correções e respostas instantâneas
   - Perguntas sobre os seus dados respondidas no aparelho, na hora, com ou sem IA:
     gastos (hoje, ontem, semana, mês, mês passado, por categoria), agenda (hoje, amanhã),
     treinos (semana, mês), a receber / a pagar, tarefas, desafio, água, poupança
   - Respostas locais entram na conversa do Jarvis (e a conversa contínua segue ouvindo)
   - Sem IA: perguntas gerais recebem uma explicação clara em vez de silêncio
   - Sugestões da tela do Jarvis atualizadas
   ====================================================================== */
ACT.copiEx=el=>{closeSheet();copiRun(el.textContent);};

/* períodos falados */
function jvPeriodo(n){const t=TODAY(),ym=t.slice(0,7);const ini=d=>d;
  if(/\bhoje\b/.test(n))return{de:t,ate:t,nome:"hoje"};
  if(/\bontem\b/.test(n)){const y=addDays(t,-1);return{de:y,ate:y,nome:"ontem"};}
  if(/semana passada/.test(n)){const dw=(pd(t).getDay()+6)%7,s=addDays(t,-dw-7);return{de:s,ate:addDays(s,6),nome:"na semana passada"};}
  if(/(esta|essa|nesta|nessa|na) semana|semana/.test(n)){const dw=(pd(t).getDay()+6)%7;return{de:addDays(t,-dw),ate:t,nome:"nesta semana"};}
  if(/mes passado|mes anterior/.test(n)){const a=ymAdd(ym,-1);return{de:a+"-01",ate:a+"-31",nome:"no mês passado"};}
  const m=MESES.findIndex(x=>new RegExp("\\b(em|de|no mes de) "+normTxt(x)+"\\b").test(n));if(m>=0){let y=+t.slice(0,4);if(m+1>+t.slice(5,7))y--;const a=y+"-"+pad(m+1);return{de:a+"-01",ate:a+"-31",nome:"em "+MESES[m].toLowerCase()};}
  if(/(este|esse|neste|nesse|no) mes|\bmes\b/.test(n))return{de:ym+"-01",ate:t,nome:"neste mês"};
  if(/(este|esse|neste|nesse|no) ano/.test(n))return{de:t.slice(0,4)+"-01-01",ate:t,nome:"neste ano"};
  return null;}
const noPer=(d,P)=>d&&d>=P.de&&d<=P.ate;
const R$=v=>DISCRETO?"um valor oculto":moneyRaw(v);

function jvGastos(n,txt){if(!/(quanto|qual|total|soma).{0,25}(gastei|gasto|gastos|despesa)|(gastei|gastos?).{0,15}quanto/.test(n))return null;
  const P=jvPeriodo(n)||{de:TODAY().slice(0,7)+"-01",ate:TODAY(),nome:"neste mês"};
  /* complexos (desde, entre, média, comparação) ficam com a IA, se houver */
  if(temIA()&&/(desde|entre|media|por mes|cada mes|compar|mais que|menos que)/.test(n))return null;
  const m=n.match(/\b(?:com|de|no|na|em)\s+(?!hoje|ontem|esta|essa|este|esse|nest|ness|no mes|na semana|semana|mes|ano)([a-z0-9 ]{3,30}?)(?:\s+(?:hoje|ontem|esta|essa|este|esse|nest|ness|no|na|em|semana|mes|ano)\b|\?|$)/);
  let E=all("exp").filter(e=>noPer(e.d,P));let filtro="";
  if(m&&MESES.some(x=>normTxt(x)===m[1].trim()))m[1]="";
  if(m&&m[1]){const q=m[1].trim();const cat=CATS.find(c=>normTxt(c[0])===q||normTxt(c[0]).startsWith(q.slice(0,5)));
    if(cat){E=E.filter(e=>e.cat===cat[0]);filtro=" com "+cat[0].toLowerCase();}
    else{const F=E.filter(e=>normTxt(e.desc||"").includes(q));if(F.length){E=F;filtro=" com "+q;}else if(temIA())return null;else filtro=" com "+q;}}
  const tot=sum(E.map(e=>+e.v||0));if(!E.length)return`Você não registrou gastos${filtro} ${P.nome}.`;
  const cats={};E.forEach(e=>{cats[e.cat||"Outros"]=(cats[e.cat||"Outros"]||0)+(+e.v||0);});const top=Object.entries(cats).sort((a,b)=>b[1]-a[1]);
  return `${P.nome.charAt(0).toUpperCase()+P.nome.slice(1)} você gastou ${R$(tot)}${filtro}, em ${E.length} ${E.length===1?"lançamento":"lançamentos"}.${!filtro&&top.length>1?` A maior parte foi com ${top[0][0]} (${R$(top[0][1])}).`:""}`;}

function jvAgenda(n){if(!/(agenda|compromisso|o que (eu )?tenho|programacao)/.test(n))return null;if(/\bagendar\b|^(marca|cria|coloca|adiciona|anota)|pra fazer|para fazer/.test(n))return null;
  const am=/amanha/.test(n),d=am?addDays(TODAY(),1):TODAY();const now=new Date();
  const E=all("ev").filter(e=>evNoDia(e,d)).sort((a,b)=>(a.h||"99").localeCompare(b.h||"99"));const f=feriado(d);
  const L=E.map(e=>`${e.t}${e.h?" às "+e.h:""}${evDias(e)>1?" (dia "+(Math.round((pd(d)-pd(e.d))/864e5)+1)+" de "+evDias(e)+")":""}`);
  let s=L.length?`${am?"Amanhã":"Hoje"} você tem ${L.length===1?"um compromisso":L.length+" compromissos"}: ${listaTxt(L)}.`:`${am?"Amanhã":"Hoje"} a agenda está livre.`;
  if(f)s+=` E é feriado: ${f.n}.`;const T=todosDoDia(d).filter(x=>!x.ok);if(T.length)s+=` Há ${T.length} ${T.length===1?"tarefa":"tarefas"} para ${am?"amanhã":"hoje"}.`;return s;}

function jvTreinos(n){if(!/(quantos|quantas|quanto).{0,20}(treino|treinei|vezes treinei|academia|capoeira)|treinei quantas/.test(n))return null;
  const P=jvPeriodo(n)||{de:(()=>{const t=TODAY(),dw=(pd(t).getDay()+6)%7;return addDays(t,-dw);})(),ate:TODAY(),nome:"nesta semana"};
  const K=[["gym","academia"],["cap","capoeira"],["run","corrida"],["swim","natação"],["kegel","Kegel"],["des","desafio"]];
  const C=K.map(([k,l])=>[l,all("trk").filter(x=>x.k===k&&noPer(x.d,P)).length]).filter(x=>x[1]);
  const so=K.find(([k,l])=>n.includes(normTxt(l)));if(so){const c=all("trk").filter(x=>x.k===so[0]&&noPer(x.d,P)).length;return `${P.nome.charAt(0).toUpperCase()+P.nome.slice(1)}: ${c} ${c===1?"treino":"treinos"} de ${so[1]}.`;}
  if(!C.length)return`Nenhum treino registrado ${P.nome}.`;const tot=sum(C.map(x=>x[1]));return `${P.nome.charAt(0).toUpperCase()+P.nome.slice(1)} foram ${tot} registros: ${listaTxt(C.map(([l,c])=>c+" de "+l))}.`;}

function jvContas(n){const rec=/(a receber|vou receber|tenho (pra|para|a) receber|me devem|quanto (eu )?recebo)/.test(n),pag=/(a pagar|tenho (pra|para|a) pagar|preciso pagar|contas? (pendentes|em aberto|vencendo)|quanto devo)/.test(n);if(!rec&&!pag)return null;
  const C=all("conta").filter(c=>c.status!=="paga"&&c.tipo===(rec?"receber":"pagar")).sort((a,b)=>(a.venc||"9").localeCompare(b.venc||"9"));
  if(!C.length)return rec?"Não há nada em aberto para receber.":"Nenhuma conta em aberto para pagar.";
  const tot=sum(C.map(c=>+c.valor||0)),atr=C.filter(c=>c.venc&&c.venc<TODAY()),px=C.find(c=>c.venc&&c.venc>=TODAY());
  return `${rec?"A receber":"A pagar"}: ${R$(tot)} em ${C.length} ${C.length===1?"conta":"contas"}.${atr.length?` ${atr.length} ${atr.length===1?"está":"estão"} ${rec?"em atraso":"vencida"+(atr.length>1?"s":"")}.`:""}${px?` A próxima é ${px.desc}, ${quandoTxt(px.venc)}${DISCRETO?"":", "+moneyRaw(+px.valor||0)}.`:""}`;}

function jvTarefas(n){if(!/(quais|minhas|lista).{0,15}tarefas|tarefas (de hoje|pendentes|que faltam)|o que (tenho|preciso) (pra|para) fazer/.test(n))return null;
  const am=/amanha/.test(n),d=am?addDays(TODAY(),1):TODAY(),T=todosDoDia(d).filter(x=>!x.ok),F=todosDoDia(d).filter(x=>x.ok);
  if(!T.length)return F.length?`Todas as ${F.length} tarefas de ${am?"amanhã":"hoje"} estão feitas.`:`Nenhuma tarefa para ${am?"amanhã":"hoje"}.`;
  return `${T.length} ${T.length===1?"tarefa pendente":"tarefas pendentes"} ${am?"amanhã":"hoje"}: ${listaTxt(T.slice(0,5).map(x=>x.t+(x.imp?" (importante)":"")))}${T.length>5?" e mais "+(T.length-5):""}.${F.length?` Já feitas: ${F.length}.`:""}`;}

function jvDesafio(n){if(!/desafio/.test(n)||!/(quant|como|qual|status|pontos|falta|\?)/.test(n))return null;const t=TODAY(),D=desDados(),w=desSemana(t),f=desSer(D,t).filter(Boolean).length;
  return `${DES[w][2]}. Hoje: ${desFeito(D,t)?"ponto batido":`${f} de ${DES_SERIES} séries feitas, faltam ${DES_SERIES-f}`}. Na semana: ${desPontosSemana(D,t,w)} pontos; no mês: ${desPontosMes(D,t.slice(0,8))}.`;}
function jvAgua(n){if(!/(quanta|quantos copos|quanto de) agua|agua (hoje|bebi)/.test(n))return null;const a=aguaCfg();return a.on?`Hoje: ${aguaHoje()} de ${a.meta} copos de água.`:`Os lembretes de água estão desligados. Ligue no Início, abaixo do Check de hoje.`;}
function jvPoup(n){if(!/(poupanca|reserva|guardado|economizei|quanto (eu )?(tenho )?guardei)/.test(n)||/(guardei|depositei|poupei) [\d]/.test(n))return null;const L=poupLista();if(!L.length)return"Você ainda não tem metas de poupança. Crie em Módulos, Dinheiro.";
  return L.map(p=>{const s=poupSaldo(p),pc=+p.alvo?Math.round(s/p.alvo*100):0;return `${p.t}: ${R$(s)} de ${R$(+p.alvo||0)} (${pc}%)`;}).join(". ")+".";}

const JV_LOCAIS=[jvGastos,jvTarefas,jvAgenda,jvTreinos,jvContas,jvDesafio,jvAgua,jvPoup];

/* agendar sem IA: "agendar reunião com a secretaria sexta às 10", "marca dentista dia 12 às 15h" */
function jvAgendar(n,txt){if(!/^(agendar|agende|agenda|marcar|marca|marque)\b/.test(n)||/^(agenda|marca)\s+(de|da|do|pra hoje)\b/.test(n))return null;
  let q={};try{q=parseQuando(txt)||{};}catch(e){}if(!q.d&&!q.h)return null;let t=String(txt).replace(/^\s*(jarvis[,\s]*)?(agendar|agende|agenda|marcar|marca|marque)\s+(um |uma |o |a )?/i,"");try{t=stripTime(t);}catch(e){}
  t=t.replace(/\s+(para|pra)\s*$/i,"").trim();t=t.charAt(0).toUpperCase()+t.slice(1);if(!t)return null;const d=q.d||TODAY();
  save({id:"ev_"+nid(),c:"ev",t,d,h:q.h||"",cat:"trab"});rr();return `Agendado: ${t}, ${d===TODAY()?"hoje":d===addDays(TODAY(),1)?"amanhã":flong(d)}${q.h?" às "+q.h:""}.`;}
function jvCiclo(n){if(!/ciclo/.test(n)||!/(como|qual|semana|quant|status|\?)/.test(n))return null;const c=typeof cicAberto==="function"?cicAberto():null;if(!c)return"Você não tem um ciclo de 12 semanas aberto. Crie um em Módulos, Metas.";
  const w=cicSem(c),M=(c.metas||[]).map(x=>x.t||x.nome||x.meta).filter(Boolean);return w>12?"As 12 semanas terminaram: é hora da revisão do ciclo.":`Você está na semana ${Math.max(1,w)} de 12 do ciclo.${M.length?` ${M.length===1?"Meta":"Metas"}: ${listaTxt(M.slice(0,3))}.`:""}`;}
function jvResumo(n){if(!/^(resumo|me (da|de|faz) (um|o) resumo)( de| do)? (hoje|dia|meu dia)/.test(n))return null;return oQueFaltaHoje().replace(/\n/g," ");}
JV_LOCAIS.unshift(jvAgendar);JV_LOCAIS.push(jvCiclo,jvResumo);
let JV_Q="";
const _rota50=rotaNova;rotaNova=function(txt){const n=normTxt(txt).replace(/^(ei |ok |oi )?jarvis[,\s]*/,"").replace(/[!.]/g," ").trim();JV_Q=String(txt);
  for(const f of JV_LOCAIS){let r=null;try{r=f(n,txt);}catch(e){console.warn("jarvis local",e);}if(r){jarResp("Jarvis",r);return true;}}
  return _rota50(txt);};

/* resposta local dentro da conversa: vira um turno e a conversa contínua segue */
const _jarResp50=jarResp;jarResp=function(titulo,texto,extra=""){const conversa=!$("sheet").classList.contains("hidden")&&$("sheet").querySelector(".jarc");
  if(!conversa||extra)return _jarResp50.apply(this,arguments);
  const turno={q:JV_Q||titulo,a:texto};JAR.turnos.push(turno);jarSheet(false);
  falarLongo(texto,()=>{if(JAR.conversa&&!$("sheet").classList.contains("hidden")&&$("jarI"))jarOuvir();});};

/* sem IA: em vez de só um aviso, uma resposta clara dentro da conversa */
const _jarPerg50=jarPerguntar;jarPerguntar=async function(q){if(!temIA()&&!JAR.busy){JV_Q=String(q||"");if(rotaNova(q))return;
    const turno={q:String(q||"").trim(),a:"Para perguntas gerais eu preciso da IA ligada. Sem ela, respondo sobre os seus dados: gastos, agenda, tarefas, treinos, contas, desafio, água e poupança. Em Ajustes, Diagnóstico da IA, dá para ativar."};
    if(!turno.q)return;JAR.turnos.push(turno);jarSheet(false);return;}
  return _jarPerg50.apply(this,arguments);};

/* sugestões da tela do Jarvis: mostram o que ele já sabe fazer */
const _jarSheet50=jarSheet;jarSheet=function(pensando){_jarSheet50.apply(this,arguments);const w=$("sheet").querySelector(".jarc .wrap-row");if(!w)return;
  const S=["O que falta hoje?","Quanto gastei este mês?","Gastei mais que no mês passado?","Qual minha agenda de amanhã?","Quantos treinos fiz esta semana?","Vou falar tudo"];
  w.innerHTML=S.map(s=>`<button class="chip" data-a="jarSug">${esc(s)}</button>`).join("");};
/* sugestões passam pelo mesmo caminho das perguntas digitadas (respostas locais incluídas) */
ACT.jarSug=el=>{const q=el.textContent;JV_Q=q;if(rotaNova(q))return;jarPerguntar(q);};
