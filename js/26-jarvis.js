"use strict";
/* ======================================================================
   JARVIS · o cérebro do app
   1. Perguntas sobre os seus dados: a IA consulta os registros por ferramentas que rodam
      no próprio celular (buscar, agrupar, semanas) e responde por texto e voz.
      As contas são feitas pelo app, não pela IA, para os números saírem certos.
   2. Briefing falado: de manhã (planejar) e à noite (fechar o dia), gerado na hora em que você abre o app.
   3. Alerta precoce: regras que vigiam ciclo, compromissos, treinos, hábitos, gastos e contas.
   Tudo roda no aparelho com a IA do Firebase (plano gratuito). Sem servidor.
   ====================================================================== */
MODS.jarvis={n:"Jarvis",ic:"audio-lines",c1:"#4F46E5",c2:"#22D3EE",g:9};
const JAR={hist:[],turnos:[],busy:false};
const JAR_V="11.10.0";

/* ---------- 1. os dados, em formato que a IA entende ---------- */
const JAR_TIPOS={gastos:"exp",contas:"conta",treinos:"trk",habitos:"hab",feitos:"fiz",dias:"dia",agenda:"ev",lembretes:"rem",contatos:"ctt",
  compromissos:"cmp",ciclos:"cic",metas_ano:"ano",editais:"ed",livros:"livros",aprendizados:"aprend",notas:"notas",audiobooks:"ouv",feynman:"fey",
  gratidao:"grat",revisoes:"rev",planos_rpm:"rpm",renda:"renda",profissional:"prof",habilidades:"habil",casamento:"casa",cartas:"carta"};
const JAR_DESC={gastos:"gastos (desc, v=valor, cat, pag=forma)",contas:"contas a pagar/receber (desc, valor, venc, status, tipo)",treinos:"checks de treino, estudo, Bíblia e ritual (t, km)",
  habitos:"cada check de hábito (t=nome)",feitos:"o que fiz hoje (t)",dias:"planejamento do dia (dom=dominó, mits, foco em min, decl, noite.energia 1-5)",agenda:"compromissos (t, h, local)",
  lembretes:"lembretes",contatos:"contatos profissionais (nome, papel, org, ult=último contato, log)",compromissos:"contratos de compromisso (meta, prazo, cons, st)",
  ciclos:"ciclos de 12 semanas (semanas = % de execução por semana)",metas_ano:"metas do ano",editais:"editais da cultura",feynman:"conceitos estudados (nota 0-10)",
  gratidao:"gratidões",revisoes:"revisões semanais",cartas:"cartas para o futuro (conteúdo só das já abertas)"};
const jarMini=x=>{if(x==null||typeof x!=="object")return x;const o={};for(const [k,v] of Object.entries(x)){if(v==null||v===""||typeof v==="object")continue;o[k]=typeof v==="string"&&v.length>160?v.slice(0,160)+"…":v;}return o;};
const jarData=d=>d.d||d.data||d.fim||d.prazo||d.venc||d.ult||d.entrega||d.ini||(d.u?iso(new Date(d.u)):"");
function jarRec(doc){const o={};for(const [k,v] of Object.entries(doc)){if(["id","c","u","img","o","fired","af","lk"].includes(k)||v==null||v==="")continue;
    if(typeof v==="string")o[k]=v.length>240?v.slice(0,240)+"…":v;else if(typeof v!=="object")o[k]=v;
    else if(Array.isArray(v))o[k]=v.slice(-20).map(jarMini);else o[k]=jarMini(v);}
  o.data=jarData(doc);return o;}
function jarRegistros(tipo){const c=JAR_TIPOS[tipo];if(!c)return[];
  if(tipo==="habitos"){const R=[];all("hab").forEach(h=>Object.keys(h.dias||{}).forEach(d=>{if(h.dias[d])R.push({data:d,t:h.nome});}));return R;}
  if(tipo==="treinos")return all("trk").map(x=>Object.assign(jarRec(x),{modulo:x.k,t:(TRK[x.k]&&TRK[x.k].t)||(MODS[x.k]&&MODS[x.k].n)||x.t||x.k,detalhe:x.t||""}));
  if(tipo==="gratidao")return all("grat").map(jarRec).concat(all("dia").flatMap(x=>(x.grat||[]).filter(Boolean).map(t=>({data:x.d,t}))));
  if(tipo==="ciclos")return all("cic").map(c=>{const w=Math.min(12,cicSem(c));return{nome:c.nome,data:c.ini,fim:cicFim(c),encerrado:!!c.fim,semana_atual:w,
    semanas:[...Array(Math.max(0,w))].map((_,i)=>({semana:i+1,execucao:cicNota(c,i+1)})),metas:(c.metas||[]).map(m=>({t:m.t,bloco:m.bloco,alvo:m.alvo,atual:m.atual,un:m.un,atingida:m.ok})),
    taticas:(c.tat||[]).map(t=>({t:t.t,freq_semana:+t.freq||1,vezes_feitas:(t.log||[]).length,ultima:(t.log||[]).slice(-1)[0]||""}))};});
  if(tipo==="cartas")return all("carta").map(x=>{const r=jarRec(x);if(!x.aberta)delete r.texto;return r;});
  return all(c).map(jarRec);}
const jarValor=r=>r.v!=null?+r.v:r.valor!=null?+r.valor:r.km!=null?+r.km:r.val!=null?+r.val:null;
const jarTermos=txt=>String(txt||"").split("|").map(normTxt).filter(Boolean);
function jarFiltra(tipo,{texto,de,ate}){const tipos=!tipo||tipo==="todos"?Object.keys(JAR_TIPOS):[tipo];const T=jarTermos(texto);let R=[];
  tipos.forEach(tp=>{if(!JAR_TIPOS[tp])return;jarRegistros(tp).forEach(r=>{if(tipos.length>1)r.tipo=tp;R.push(r);});});
  if(de)R=R.filter(r=>r.data&&r.data>=de);if(ate)R=R.filter(r=>r.data&&r.data<=ate);
  if(T.length)R=R.filter(r=>{const s=normTxt(JSON.stringify(r));return T.some(t=>s.includes(t));});
  return R.sort((a,b)=>String(b.data||"").localeCompare(String(a.data||"")));}
const jarSoma=R=>{const V=R.map(jarValor).filter(v=>v!=null&&!isNaN(v));return V.length?Math.round(sum(V)*100)/100:null;};

/* ferramentas que a IA pode chamar */
const JAR_FN={
  buscar(a){const R=jarFiltra(a.tipo,a),lim=clamp(+a.limite||40,1,120);return{total:R.length,soma:jarSoma(R),registros:R.slice(0,lim),mostrando:Math.min(lim,R.length)};},
  agrupar(a){const R=jarFiltra(a.tipo,a),por=a.por||"mes";const key=r=>{const d=String(r.data||"");
      return por==="dia"?d:por==="semana"?(d?semanaKey(d):""):por==="mes"?d.slice(0,7):por==="ano"?d.slice(0,4):por==="categoria"?(r.cat||"sem categoria"):por==="forma"?(r.pag||"não informada"):por==="tipo"?(r.tipo||a.tipo):(r.t||r.desc||r.nome||r.meta||"—");};
    const G=new Map();R.forEach(r=>{const k=key(r)||"sem data";const g=G.get(k)||{grupo:k,quantidade:0,soma:0};g.quantidade++;const v=jarValor(r);if(v!=null&&!isNaN(v))g.soma=Math.round((g.soma+v)*100)/100;G.set(k,g);});
    let L=[...G.values()];if(["dia","semana","mes","ano"].includes(por))L.sort((a,b)=>a.grupo.localeCompare(b.grupo));else L.sort((a,b)=>b.soma-a.soma||b.quantidade-a.quantidade);
    return{agrupado_por:por,total:R.length,soma:jarSoma(R),grupos:L.slice(0,80)};},
  semanas(a){const ate=a.ate||TODAY(),de=a.de||addDays(semanaKey(ate),-7*11);const out=[];let w=semanaKey(de);const ci=all("cic");
    while(w<=ate&&out.length<60){const f=addDays(w,6),inW=d=>d&&d>=w&&d<=f,D=all("dia").filter(x=>inW(x.d)),tr={};
      all("trk").filter(x=>inW(x.d)).forEach(x=>{tr[x.k]=(tr[x.k]||0)+1;});
      const en=D.map(x=>x.noite&&+x.noite.energia).filter(Boolean),c=ci.find(z=>z.ini<=w&&cicFim(z)>=w);
      out.push({semana:w,treinos:tr,total_treinos:sum(Object.values(tr)),habitos_feitos:sum(all("hab").map(h=>Object.keys(h.dias||{}).filter(d=>h.dias[d]&&inW(d)).length)),
        foco_min:sum(D.map(x=>x.foco||0)),dominos_feitos:D.filter(x=>x.domOk).length,dias_planejados:D.filter(x=>x.dom||(x.mits||[]).length).length,dias_fechados:D.filter(x=>x.fechado).length,
        energia_media:en.length?Math.round(sum(en)/en.length*10)/10:null,coisas_feitas:all("fiz").filter(x=>inW(x.d)).length,gastos:Math.round(sum(all("exp").filter(x=>inW(x.d)).map(x=>x.v))*100)/100,
        gratidoes:all("grat").filter(x=>inW(x.d)).length,execucao_ciclo:c?cicNota(c,cicSem(c,w)):null});w=addDays(w,7);}
    return{semanas:out};}};
async function jarAI(){const appM=await import(`https://www.gstatic.com/firebasejs/${JAR_V}/firebase-app.js`);const aiM=await import(`https://www.gstatic.com/firebasejs/${JAR_V}/firebase-ai.js`);
  const app=appM.getApps().find(a=>a.name==="mu-ai")||appM.initializeApp(FBCFG,"mu-ai");return{aiM,ai:aiM.getAI(app,{backend:new aiM.GoogleAIBackend()})};}
function jarDecl(S){const str=d=>S.string({description:d});const datas={de:str("data inicial AAAA-MM-DD"),ate:str("data final AAAA-MM-DD")};
  const tipo=str("um destes: "+Object.keys(JAR_TIPOS).join(", ")+" ou todos");
  return[{name:"buscar",description:"Lista registros com total e soma dos valores. Use para achar itens, datas e conversas.",
      parameters:S.object({properties:{tipo,texto:str("palavras para filtrar; separe sinônimos com | (ex.: delivery|ifood|rappi|aiqfome)"),...datas,limite:S.integer({description:"máximo de registros (padrão 40)"})},optionalProperties:["texto","de","ate","limite"]})},
    {name:"agrupar",description:"Agrupa registros e devolve quantidade e soma por grupo. Use para totais por mês, categoria, forma de pagamento ou semana.",
      parameters:S.object({properties:{tipo,por:str("dia, semana, mes, ano, categoria, forma, titulo ou tipo"),texto:str("filtro opcional, sinônimos com |"),...datas},optionalProperties:["texto","de","ate"]})},
    {name:"semanas",description:"Painel por semana: treinos por modalidade, hábitos, foco, dominós, energia, gastos, gratidões e execução do ciclo. Use para comparar semanas boas e ruins.",
      parameters:S.object({properties:datas,optionalProperties:["de","ate"]})}];}
function jarPanorama(){const cont=Object.keys(JAR_TIPOS).map(tp=>{const R=jarRegistros(tp);if(!R.length)return"";const ds=R.map(r=>r.data).filter(Boolean).sort();
    return `- ${tp}: ${R.length}${ds.length?` (de ${ds[0]} a ${ds[ds.length-1]})`:""}${JAR_DESC[tp]?" · "+JAR_DESC[tp]:""}`;}).filter(Boolean).join("\n");
  return{cont,fatos:briefFatos(new Date().getHours()>=18?"noite":"manha"),alertas:alertas().map(a=>a.t)};}
function jarSistema(){const c=cfg(),now=new Date(),P=jarPanorama();
  return `Você é o Jarvis, o assistente pessoal dentro do app Moving Up${c.nome?`, de ${c.nome}`:""}. Agora: ${DSEML[now.getDay()]}, ${TODAY()}, ${pad(now.getHours())}:${pad(now.getMinutes())}.
Responda em português do Brasil, direto e caloroso, como quem conhece a vida da pessoa e quer vê-la evoluir.
Regras:
- Antes de falar de números, datas ou histórico, consulte os registros com as ferramentas. Nunca invente dados.
- Para somas e contagens use os campos total e soma das ferramentas. Não some de cabeça.
- Na busca por texto, inclua sinônimos e variações separados por | (ex.: delivery|ifood|rappi|aiqfome|lanche).
- "Desde agosto" = de AAAA-08-01 até hoje, no ano mais recente que faça sentido.
- Se os dados não existirem, diga isso em uma frase e sugira o que registrar.
- A resposta será lida em voz alta: até 6 frases curtas, sem markdown, sem listas com símbolos, sem emojis. Valores como R$ 1.234,50.
- Quando fizer sentido, termine com uma sugestão prática para a próxima semana.
Registros disponíveis:
${P.cont||"(nenhum registro ainda)"}
Panorama de hoje: ${JSON.stringify(P.fatos)}
Alertas da semana: ${JSON.stringify(P.alertas)}`;}
const JAR_LOG={buscar:"buscou",agrupar:"somou",semanas:"comparou semanas"};
async function jarResponder(pergunta,onPasso){const {aiM,ai}=await jarAI();const models=[AIM,(window.MU_CONFIG&&MU_CONFIG.aiModel)||"","gemini-flash-latest","gemini-2.5-flash","gemini-2.5-flash-lite"].filter((v,i,a)=>v&&a.indexOf(v)===i);let last=null;
  for(const m of models){try{const model=aiM.getGenerativeModel(ai,{model:m,systemInstruction:jarSistema(),tools:[{functionDeclarations:jarDecl(aiM.Schema)}],generationConfig:{temperature:.3}});
      const chat=model.startChat({history:JAR.hist.slice(-12)});let r=await chat.sendMessage(pergunta);
      for(let i=0;i<6;i++){const calls=r.response.functionCalls&&r.response.functionCalls();if(!calls||!calls.length)break;
        const parts=calls.map(c=>{let res;try{res=JAR_FN[c.name]?JAR_FN[c.name](c.args||{}):{erro:"ferramenta desconhecida"};}catch(e){res={erro:String(e&&e.message||e)};}
          onPasso&&onPasso(`${JAR_LOG[c.name]||c.name} ${(c.args&&c.args.tipo)||""}${c.args&&c.args.texto?" · "+c.args.texto.split("|")[0]:""}`.trim());return{functionResponse:{name:c.name,response:{resultado:res}}};});
        r=await chat.sendMessage(parts);}
      AIM=m;return String(r.response.text()||"").trim();}
    catch(e){last=e;console.warn("jarvis",m,e);if(/not found|404|not supported|unknown model|is not available/i.test(String(e&&e.message||e)))continue;break;}}
  /* plano B: sem ferramentas, com um resumo dos registros recentes */
  const desde=addDays(TODAY(),-120),dig={};Object.keys(JAR_TIPOS).forEach(tp=>{const R=jarRegistros(tp).filter(r=>!r.data||r.data>=desde).slice(0,80);if(R.length)dig[tp]=R;});
  const txt=await aiGenerate([{text:jarSistema()+`\n\nRegistros dos últimos 120 dias: ${JSON.stringify(dig).slice(0,180000)}\n\nPergunta: ${pergunta}\nResponda só com JSON: {"resposta":"..."}`}]);
  try{return JSON.parse(String(txt).replace(/```json|```/g,"")).resposta;}catch(e){if(last)throw last;throw e;}}

/* ---------- fala em partes (o Chrome do Android corta falas longas) ---------- */
function falarLongo(t,onFim){try{if(!("speechSynthesis" in window))return;speechSynthesis.cancel();const v=speechSynthesis.getVoices().find(v=>/pt(-|_)BR/i.test(v.lang));
  const P=String(t).replace(/\s+/g," ").match(/[^.!?]+[.!?]*/g)||[t];P.forEach((p,i)=>{const u=new SpeechSynthesisUtterance(p.trim());u.lang="pt-BR";u.rate=1.05;if(v)u.voice=v;if(i===P.length-1&&onFim)u.onend=onFim;speechSynthesis.speak(u);});}catch(e){}}
const calar=()=>{try{speechSynthesis.cancel();}catch(e){}};

/* ---------- tela de conversa ---------- */
function jarSheet(pensando){const T=JAR.turnos.slice(-6);
  sheet(`<div class="row"><span class="mb" ${mstyle("jarvis")}>${ic("audio-lines")}</span><h2 class="grow" style="margin:0">Jarvis</h2><button class="ib" data-a="jarCalar" aria-label="Parar a voz">${ic("volume-x")}</button></div>
   <div class="jarc">${T.length?T.map(x=>`<div class="jarq">${esc(x.q)}</div>${x.a?`<div class="jara">${esc(x.a)}<button class="lk tiny" data-a="jarOuvir" data-i="${JAR.turnos.indexOf(x)}">${ic("volume-2")} Ouvir</button></div>`:""}`).join("")
     :`<p class="muted small">Pergunte qualquer coisa sobre a sua vida registrada no app.</p><div class="wrap-row">${["Quanto gastei com delivery desde agosto?","Quando falei com a Ana pela última vez?","Em quais semanas eu mais treinei e o que fiz diferente?","Como está meu ciclo?"].map(s=>`<button class="chip" data-a="jarSug">${esc(s)}</button>`).join("")}</div>`}
     ${pensando?`<div class="jarp"><div class="bar"><i style="width:40%"></i></div><span class="tiny faint" id="jarPassos">Consultando seus registros…</span></div>`:""}</div>
   <div class="qadd" style="margin-top:12px"><input id="jarI" placeholder="Pergunte ao Jarvis" data-enter="jarEnviar" aria-label="Pergunta" ${pensando?"disabled":""}><button class="btn ghost micb" data-a="jarMic" id="jarMic" data-curto="1" aria-label="Falar">${ic("mic")}</button><button class="btn" data-a="jarEnviar" aria-label="Enviar">${ic("send")}</button></div>`,
   s=>{const c=s.querySelector(".jarc");if(c)c.scrollTop=c.scrollHeight;});}
async function jarPerguntar(q){q=String(q||"").trim();if(!q||JAR.busy)return;
  if(!FBCFG){toast("audio-lines","O Jarvis precisa da IA","Entre com sua conta do Firebase para fazer perguntas.");return;}
  ditarParar();calar();JAR.busy=true;const turno={q,a:""};JAR.turnos.push(turno);jarSheet(true);const passos=[];
  try{turno.a=await Promise.race([jarResponder(q,p=>{passos.push(p);const e=$("jarPassos");if(e)e.textContent=passos.join(" · ");}),new Promise((_,rej)=>setTimeout(()=>rej(new Error("tempo")),60000))]);
    if(!turno.a)turno.a="Não consegui montar uma resposta. Tente perguntar de outro jeito.";
    JAR.hist.push({role:"user",parts:[{text:q}]},{role:"model",parts:[{text:turno.a}]});falarLongo(turno.a);}
  catch(e){console.warn(e);turno.a="Não consegui consultar a IA agora. Confira a internet e tente de novo.";}
  JAR.busy=false;if(!$("sheet").classList.contains("hidden"))jarSheet(false);}
ACT.jarAbrir=()=>jarSheet(false);
ACT.jarEnviar=()=>{const i=$("jarI");if(!i)return;const v=i.value.trim();if(!v)return i.focus();jarPerguntar(v);};
ACT.jarSug=el=>jarPerguntar(el.textContent);
ACT.jarMic=()=>{if(DIT){ditarParar();ACT.jarEnviar();return;}ditar("jarI","jarMic");};
ACT.jarOuvir=el=>{const t=JAR.turnos[+el.dataset.i];if(t&&t.a)falarLongo(t.a);};
ACT.jarCalar=()=>calar();

/* o copiloto do Início: ordens continuam sendo executadas; perguntas vão para o Jarvis */
function ehPergunta(t){const s=normTxt(t);if(/^jarvis\b/.test(s))return true;
  if(/^(me lembr|lembr|marc|anot|registr|gastei|paguei|recebi|treinei|corri|nadei|estudei|li |agend|cri|adicion|fiz )/.test(s))return false;
  if(/\?\s*$/.test(String(t)))return true;
  return /^(quanto|quantos|quantas|quando|qual|quais|como|por que|porque|o que|oque|quem|onde|em que|me (diz|fala|conta|mostra|explica)|resum|compar|analis|list|mostr|devo|vale a pena|tenho|estou|to |tou )/.test(s);}
const _copiRunJ=copiRun;copiRun=function(txt){const s=normTxt(txt);
  if(/^(jarvis )?(briefing|resumo do dia|bom dia jarvis|boa noite jarvis)/.test(s)){closeSheet();return brfAbrir();}
  if(ehPergunta(txt))return jarPerguntar(String(txt).replace(/^\s*jarvis[,:!]?\s*/i,""));return _copiRunJ.apply(this,arguments);};

/* ---------- 2. briefing falado ---------- */
function quandoTxt(d){const n=diasAte(d);return n<0?"já venceu":n===0?"hoje":n===1?"amanhã":n<7?DSEML[pd(d).getDay()]+(pd(d).getDay()===0||pd(d).getDay()===6?"":"-feira"):"em "+n+" dias";}
function briefFatos(per){const t=TODAY(),am=addDays(t,1),F={};const ci=typeof cicAberto==="function"?cicAberto():null;
  if(ci){const w=cicSem(ci);if(w>=1&&w<=12){const P=(ci.tat||[]).filter(x=>tatFeitas(x,ci,w)<(+x.freq||1));F.ciclo={semana:w,execucao:cicNota(ci,w)||0,pendentes:P.map(x=>x.t),feitas_hoje:(ci.tat||[]).filter(x=>(x.log||[]).includes(t)).map(x=>x.t)};}else if(w>12)F.ciclo={revisao:true};}
  const ev=d=>all("ev").filter(e=>e.d===d).sort((a,b)=>(a.h||"").localeCompare(b.h||"")).map(e=>({t:e.t,h:e.h||""}));
  F.agenda_hoje=ev(t);F.agenda_amanha=ev(am);
  F.lembretes_hoje=all("rem").filter(r=>!r.feito&&iso(nextOcc(r,new Date()))===t).map(r=>({t:r.t,h:r.h||""}));
  F.compromissos=all("cmp").filter(c=>c.st==="ativo"&&c.prazo&&diasAte(c.prazo)<=7).map(c=>({meta:c.meta,prazo:c.prazo,quando:quandoTxt(c.prazo),testemunha:c.test||""}));
  F.contas_pagar=all("conta").filter(c=>c.tipo==="pagar"&&c.status!=="paga"&&c.venc&&diasAte(c.venc)<=3).map(c=>({desc:c.desc,valor:c.valor,quando:quandoTxt(c.venc)}));
  const ct=all("ctt").filter(c=>cttProx(c)<=t).sort((a,b)=>(a.ult||"").localeCompare(b.ult||""))[0];if(ct)F.contato={nome:ct.nome,dias:-diasAte(ct.ult||t)};
  F.revisoes_feynman=feyDevidos().length;F.cartas=cartasChegaram().length;F.alertas=alertas().map(a=>a.t);
  const x=dia(t);F.domino=x.dom||"";F.domino_feito=!!x.domOk;F.prioridades=(x.mits||[]).map(m=>({t:m.t,feita:!!m.ok}));
  if(per==="noite"){F.treinos_hoje=Object.keys(TRK).filter(k=>trkHas(k,t)).map(k=>TRK[k].t);F.foco_min=x.foco||0;F.feitos_hoje=all("fiz").filter(f=>f.d===t).map(f=>f.t);
    const H=all("hab");F.habitos={feitos:H.filter(h=>h.dias&&h.dias[t]).length,total:H.length};F.gastos_hoje=Math.round(sum(all("exp").filter(e=>e.d===t).map(e=>e.v))*100)/100;F.dia_fechado=!!x.fechado;}
  return F;}
const listaTxt=L=>L.length<=1?L.join(""):L.slice(0,-1).join(", ")+" e "+L[L.length-1];
const valFala=v=>DISCRETO?"":" ("+moneyRaw(v)+")";
function briefLocal(per){const F=briefFatos(per),c=cfg(),nome=c.nome?", "+c.nome.split(" ")[0]:"",d=new Date(),S=[];
  if(per==="manha"){S.push(`${greet()}${nome}. Hoje é ${DSEML[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()].toLowerCase()}.`);
    if(F.ciclo&&F.ciclo.revisao)S.push("Seu ciclo de 12 semanas terminou. Reserve um tempo hoje para a revisão.");
    else if(F.ciclo)S.push(`Semana ${F.ciclo.semana} do ciclo: você está em ${F.ciclo.execucao}% de execução${F.ciclo.pendentes.length?`, com ${F.ciclo.pendentes.length} ${F.ciclo.pendentes.length===1?"tática pendente":"táticas pendentes"}`:""}.`);
    const ag=F.agenda_hoje.map(e=>e.t+(e.h?" às "+e.h.replace(":00","h").replace(":","h"):"")).concat(F.lembretes_hoje.map(r=>r.t));
    S.push(ag.length?`Na agenda de hoje: ${listaTxt(ag.slice(0,4))}.`:"Sua agenda está livre hoje.");
    F.compromissos.forEach(c=>S.push(`O prazo do compromisso ${c.meta} ${c.quando==="já venceu"?"já venceu":"vence "+c.quando}${c.testemunha?`, e ${c.testemunha.split(/[ ,]/)[0]} vai cobrar`:""}.`));
    if(F.contas_pagar.length)S.push(F.contas_pagar.length===1?`Tem a conta ${F.contas_pagar[0].desc} para pagar ${F.contas_pagar[0].quando}${valFala(F.contas_pagar[0].valor)}.`:`Tem ${F.contas_pagar.length} contas para pagar nos próximos dias${valFala(sum(F.contas_pagar.map(x=>x.valor)))}.`);
    if(F.contato)S.push(`Faz ${F.contato.dias>=60?Math.round(F.contato.dias/30)+" meses":F.contato.dias+" dias"} que você não fala com ${F.contato.nome}.`);
    if(F.cartas)S.push("Chegou uma carta do seu eu do passado.");
    if(F.revisoes_feynman)S.push(`${F.revisoes_feynman===1?"Um conceito":F.revisoes_feynman+" conceitos"} para revisar no método Feynman.`);
    if(F.alertas.length)S.push(`Atenção: ${F.alertas[0]}${F.alertas.length>1?`, e mais ${F.alertas.length-1} ${F.alertas.length===2?"sinal":"sinais"} na semana`:""}.`);
    S.push(F.domino?`Seu dominó de hoje: ${F.domino}.`:"Defina o dominó do dia: a única coisa que, feita, facilita todo o resto.");}
  else{S.push(`${greet()}${nome}. Hora de fechar o dia.`);
    const av=[].concat(F.ciclo?F.ciclo.feitas_hoje:[],F.treinos_hoje.map(x=>x.toLowerCase()),F.foco_min?[F.foco_min+" minutos de foco"]:[],F.domino_feito?["o dominó do dia"]:[]);
    S.push(av.length?`Hoje você avançou em: ${listaTxt(av.slice(0,5))}.`:"Hoje não houve avanço registrado no app.");
    if(F.feitos_hoje.length)S.push(`Você registrou ${F.feitos_hoje.length} ${F.feitos_hoje.length===1?"coisa feita":"coisas feitas"}.`);
    if(F.habitos.total)S.push(`Hábitos: ${F.habitos.feitos} de ${F.habitos.total}.`);
    const fic=(F.prioridades||[]).filter(m=>!m.feita).map(m=>m.t).concat(F.ciclo?F.ciclo.pendentes.filter(p=>!F.ciclo.feitas_hoje.includes(p)).slice(0,2):[]);
    if(fic.length)S.push(`Ficou para depois: ${listaTxt(fic.slice(0,3))}.`);
    if(F.gastos_hoje&&!DISCRETO)S.push(`Gastos de hoje: ${moneyRaw(F.gastos_hoje)}.`);
    const prio=F.agenda_amanha[0]?`${F.agenda_amanha[0].t}${F.agenda_amanha[0].h?" às "+F.agenda_amanha[0].h:""}`:F.compromissos.find(c=>c.quando==="amanhã")?F.compromissos.find(c=>c.quando==="amanhã").meta:F.ciclo&&F.ciclo.pendentes[0]?F.ciclo.pendentes[0]:"";
    if(prio)S.push(`Prioridade de amanhã: ${prio}.`);
    if(!F.dia_fechado)S.push("Antes de dormir, faça o fechamento do dia: três coisas boas e o que melhorar.");}
  return S.join(" ");}
async function briefTexto(per){const loc=briefLocal(per),key="mu_brf_"+TODAY()+"_"+per;
  try{const c=JSON.parse(localStorage.getItem(key)||"null");if(c&&c.base===loc)return c.txt;}catch(e){}
  if(!FBCFG)return loc;
  try{const r=await Promise.race([aiGenerate([{text:`Reescreva este briefing ${per==="manha"?"da manhã":"da noite"} como um assistente pessoal falaria em voz alta, em português do Brasil.
Mantenha todos os fatos, não invente nenhum. Tom: direto, energético e próximo. Entre 90 e 160 palavras, frases curtas, sem emojis, sem listas.
${per==="manha"?"Termine com uma frase que puxe para a ação.":"Termine com uma frase que ajude a descansar com a cabeça leve."}
Fatos: ${JSON.stringify(briefFatos(per))}
Texto base: ${loc}
Responda só com JSON: {"texto":"..."}`}]),new Promise((_,rej)=>setTimeout(()=>rej(new Error("tempo")),20000))]);
    const txt=JSON.parse(String(r).replace(/```json|```/g,"")).texto;if(txt&&txt.length>40){try{localStorage.setItem(key,JSON.stringify({base:loc,txt}));}catch(e){}return txt;}}
  catch(e){console.warn(e);}return loc;}
const brfPer=()=>{const p=periodo();return p==="tarde"?null:p;};
async function brfAbrir(per){per=per||brfPer()||(new Date().getHours()<12?"manha":"noite");const tit=per==="manha"?"Briefing da manhã":"Fechamento do dia";
  sheet(`<div class="row"><span class="mb" ${mstyle("jarvis")}>${ic(per==="manha"?"sunrise":"moon-star")}</span><h2 class="grow" style="margin:0">${tit}</h2></div><div class="jara" id="brfT" style="margin-top:12px">Preparando…</div><div class="bar"><i style="width:35%"></i></div>`);
  const txt=await briefTexto(per);if($("brfT")){
    sheet(`<div class="row"><span class="mb" ${mstyle("jarvis")}>${ic(per==="manha"?"sunrise":"moon-star")}</span><h2 class="grow" style="margin:0">${tit}</h2><button class="ib" data-a="jarCalar" aria-label="Parar a voz">${ic("volume-x")}</button></div>
     <div class="jara" style="margin-top:12px;font-size:1rem">${esc(txt)}</div>
     <div class="btns h"><button class="btn ghost" data-a="brfOuvirDe" data-p="${per}">${ic("volume-2")} Ouvir de novo</button><button class="btn" data-a="jarAbrir">${ic("audio-lines")} Perguntar</button></div>`);
    falarLongo(txt);try{localStorage.setItem("mu_brf_ouvido",TODAY()+"_"+per);}catch(e){}rr();}}
ACT.brfOuvir=()=>brfAbrir();
ACT.brfOuvirDe=el=>briefTexto(el.dataset.p).then(t=>falarLongo(t));
ACT.brfX=()=>{try{localStorage.setItem("mu_brf_x",TODAY()+"_"+brfPer());}catch(e){}rr();};
function secBriefing(){const per=brfPer();if(!per||!DB.be)return"";let x="",o="";try{x=localStorage.getItem("mu_brf_x");o=localStorage.getItem("mu_brf_ouvido");}catch(e){}
  if(x===TODAY()+"_"+per)return"";const F=briefFatos(per),ouv=o===TODAY()+"_"+per;
  const sub=per==="manha"?[F.ciclo&&F.ciclo.semana?`Semana ${F.ciclo.semana} · ${F.ciclo.execucao}%`:"",F.agenda_hoje.length?F.agenda_hoje.length+(F.agenda_hoje.length===1?" compromisso":" compromissos"):"agenda livre",F.compromissos.length?F.compromissos.length+" prazo"+(F.compromissos.length>1?"s":""):""].filter(Boolean).join(" · ")
    :"O que avançou, o que ficou e a prioridade de amanhã";
  return `<div class="brf" ${mstyle("jarvis")}><button class="brfp" data-a="brfOuvir" aria-label="Ouvir o briefing">${ic(ouv?"refresh-cw":"play")}</button><button class="grow brft" data-a="brfOuvir"><b>${per==="manha"?"Briefing da manhã":"Fechamento do dia"}</b><span class="tiny muted">${esc(sub)}</span></button><button class="ib" style="width:32px;height:32px" data-a="brfX" aria-label="Esconder até o próximo período">${ic("x")}</button></div>`;}

/* ---------- 3. alerta precoce ---------- */
const PARADAS="para pelo pela com sem que dos das nos nas uma por mais menos meu minha".split(" ");
const palavras=s=>normTxt(s).split(" ").filter(w=>w.length>=5&&!PARADAS.includes(w)).map(w=>w.slice(0,4)); /* raiz de 4 letras: correr ≈ corrida */
function alertas(){const t=TODAY(),A=[];const ci=typeof cicAberto==="function"?cicAberto():null;
  /* ciclo: semanas seguidas abaixo de 60% */
  if(ci){const w=Math.min(13,cicSem(ci));let n=0;for(let k=w-1;k>=1;k--){const v=cicNota(ci,k);if(v!=null&&v<60)n++;else break;}
    if(n>=3)A.push({k:"cic3",ic:"target",t:`${n} semanas seguidas abaixo de 60% no ciclo`,d:"Reduza as táticas para o essencial ou planeje a semana no domingo.",v:{v:"ciclo"}});
    else if(w>=1&&w<=12&&((pd(t).getDay()+6)%7)>=4){const v=cicNota(ci,w);if(v!=null&&v<40)A.push({k:"cicw",ic:"target",t:`Semana ${w} em risco: ${v}% de execução`,d:"Ainda dá tempo: escolha as 2 táticas mais importantes e faça hoje.",v:{v:"ciclo"}});}}
  /* compromisso sem tática ligada */
  const tat=ci?(ci.tat||[]).map(x=>palavras(x.t)).flat():[];
  all("cmp").filter(c=>c.st==="ativo"&&c.prazo&&diasAte(c.prazo)>=0&&diasAte(c.prazo)<=30).forEach(c=>{const P=palavras(c.meta);if(!P.some(p=>tat.includes(p)))
    A.push({k:"cmp_"+c.id,ic:"handshake",t:`Compromisso sem tática: ${c.meta}`,d:`Vence ${quandoTxt(c.prazo)}. Nenhuma tática do ciclo trabalha por ele.`,v:{v:ci?"ciclo":"cmp"}});});
  /* treinos e rotinas parados */
  Object.keys(TRK).filter(k=>k!=="man").forEach(k=>{const D=all("trk").filter(x=>x.k===k).map(x=>x.d).sort();if(!D.length)return;const ult=D[D.length-1],dias=-diasAte(ult);
    const antes=D.filter(d=>d<=addDays(ult,0)&&d>=addDays(ult,-59)).length;if(dias>=10&&antes>=3)A.push({k:"trk_"+k,ic:(MODS[k]||{}).ic||"activity",t:`${dias} dias sem ${TRK[k].t.toLowerCase()}`,d:"Volte com uma sessão curta: o que conta agora é quebrar a parada.",v:{v:"trk",k}});});
  all("hab").forEach(h=>{const D=Object.keys(h.dias||{}).filter(d=>h.dias[d]);const rec=D.filter(d=>d>addDays(t,-7)).length,ant=D.filter(d=>d<=addDays(t,-7)&&d>addDays(t,-37)).length;
    if(!rec&&ant>=8)A.push({k:"hab_"+h.id,ic:"list-checks",t:`Hábito parado: ${h.nome}`,d:`${ant} checks no mês anterior e nenhum nos últimos 7 dias.`,v:{v:"habitos"}});});
  /* gastos subindo três meses seguidos (meses já fechados) */
  const m0=t.slice(0,7),mes=k=>{const d=pd(m0+"-01");d.setMonth(d.getMonth()-k);return iso(d).slice(0,7);};const M=[3,2,1].map(mes),E=all("exp");
  [...new Set(E.map(e=>e.cat||"Outros"))].forEach(cat=>{const V=M.map(m=>sum(E.filter(e=>(e.cat||"Outros")===cat&&(e.d||"").startsWith(m)).map(e=>e.v)));
    if(V[0]>0&&V[0]<V[1]&&V[1]<V[2]&&V[2]>=V[0]*1.2&&V[2]>=100)A.push({k:"exp_"+cat,ic:"wallet",t:`Gastos com ${cat.toLowerCase()} subindo há 3 meses`,d:DISCRETO?"Três meses seguidos de alta.":`${moneyRaw(V[0])} → ${moneyRaw(V[1])} → ${moneyRaw(V[2])}`,v:{v:"gastos"}});});
  /* parou de anotar gastos */
  const g7=E.filter(e=>e.d>addDays(t,-7)).length,g30=E.filter(e=>e.d<=addDays(t,-7)&&e.d>addDays(t,-37)).length;
  if(!g7&&g30>=10)A.push({k:"expstop",ic:"wallet",t:"Você parou de anotar os gastos",d:"Nenhum gasto nos últimos 7 dias. Use o gasto rápido ou cole a lista.",v:{v:"gastos"}});
  /* contas vencidas */
  const cv=all("conta").filter(c=>c.tipo==="pagar"&&c.status!=="paga"&&c.venc&&c.venc<t);
  if(cv.length)A.push({k:"contas",ic:"receipt",t:cv.length===1?`Conta vencida: ${cv[0].desc}`:`${cv.length} contas vencidas`,d:DISCRETO?"Pague ou renegocie.":`Total ${moneyRaw(sum(cv.map(c=>c.valor)))}.`,v:{v:"contas",tab:"pagar"}});
  return A;}
const alertaSemana=()=>semanaKey(TODAY());
function alertasNovos(){const A=alertas();let vis=[];try{const o=JSON.parse(localStorage.getItem("mu_alerta")||"{}");if(o.w===alertaSemana())vis=o.k||[];}catch(e){}return A.filter(a=>!vis.includes(a.k));}
ACT.alertas=()=>{const A=alertas();
  sheet(`<div class="row"><span class="mb" style="background:var(--wait)">${ic("triangle-alert")}</span><h2 class="grow" style="margin:0">Alerta precoce</h2></div>
   <p class="muted small">Sinais de que algo está escorregando, antes de virar problema.</p>
   ${A.length?A.map(a=>`<button class="item" style="width:100%;text-align:left" data-a="alertaIr" data-v="${gv(a.v)}"><span class="mb" style="width:34px;height:34px;border-radius:10px;background:var(--waitbg);color:var(--waittx)">${ic(a.ic)}</span><span class="ibody"><b>${esc(a.t)}</b><span class="small muted">${esc(a.d)}</span></span></button>`).join(""):`<div class="note">${ic("circle-check")} Nenhum sinal de alerta agora.</div>`}
   <div id="alIA"></div>
   <div class="btns">${A.length&&FBCFG?`<button class="btn ghost full" data-a="alertaIA">${ic("sparkles")} Pedir a análise do Jarvis</button>`:""}<button class="btn full" data-a="alertaVi">Entendi</button></div>`);};
ACT.alertaIr=el=>{ACT.alertaVi();go(JSON.parse(el.dataset.v));};
ACT.alertaVi=()=>{try{localStorage.setItem("mu_alerta",JSON.stringify({w:alertaSemana(),k:alertas().map(a=>a.k)}));}catch(e){}closeSheet();rr();};
ACT.alertaIA=async el=>{el.disabled=true;el.innerHTML=`${ic("sparkles")} Analisando…`;const box=$("alIA");
  try{const r=await Promise.race([aiGenerate([{text:`Você é o Jarvis, coach de alta performance. Estes são os sinais de alerta da semana e o histórico recente da pessoa.
Faça um diagnóstico curto: o que provavelmente está causando os sinais (cruze os dados, por exemplo energia, foco e treinos) e a UMA ação mais importante para esta semana.
Português do Brasil, até 90 palavras, direto, sem listas, sem emojis. Responda só com JSON: {"analise":"...","acao":"..."}
Alertas: ${JSON.stringify(alertas().map(a=>a.t+" ("+a.d+")"))}
Últimas semanas: ${JSON.stringify(JAR_FN.semanas({de:addDays(semanaKey(TODAY()),-7*7)}).semanas)}`}]),new Promise((_,rej)=>setTimeout(()=>rej(new Error("tempo")),25000))]);
    const j=JSON.parse(String(r).replace(/```json|```/g,""));if(box)box.innerHTML=`<div class="card" style="margin-top:12px"><div class="jara">${esc(j.analise||"")}</div>${j.acao?`<div class="note" style="margin-bottom:0">${ic("crosshair")} <b>Ação da semana:</b> ${esc(j.acao)}</div>`:""}</div>`;
    falarLongo((j.analise||"")+" "+(j.acao?"Ação da semana: "+j.acao:""));el.remove();}
  catch(e){console.warn(e);el.disabled=false;el.innerHTML=`${ic("sparkles")} Tentar de novo`;toast("triangle-alert","A IA não respondeu","Confira a internet.");}};
