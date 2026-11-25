"use strict";
/* ======================================================================
   MÉTODO FEYNMAN COM IA · explicar com as próprias palavras para descobrir o que ainda não sabe
   1. Você explica o conceito (digitando ou falando).  2. A IA aponta o que ficou vago ou errado.
   3. Três perguntas testam o entendimento.  4. O conceito volta para revisão em 1, 3 ou 7 dias.
   Dados: c:"fey" {conceito,tema,prox,ses:[{d,texto,av:{nota,resumo,vagos,erros,perguntas,melhor},resp,corr}]}
   ====================================================================== */
MODS.feyn={n:"Método Feynman",ic:"brain",c1:"#7C3AED",c2:"#22D3EE",g:1,v:{v:"feyn"}};
const FEY_TEMAS=["Concurso","Curso","Editais","Outro"];
const feyUlt=f=>(f.ses||[])[(f.ses||[]).length-1]||null;
const feyNota=f=>{const s=feyUlt(f);return s&&s.av?s.av.nota:null;};
const feyDevidos=()=>all("fey").filter(f=>f.prox&&f.prox<=TODAY());
const feyCls=n=>n==null?"":n>=8?"c":n>=5?"a":"n";
const feyRot=n=>n>=8?"Você domina":n>=5?"Quase lá":"Ainda está vago";
let FEY=null; /* rascunho da sessão aberta */

VIEWS.feyn=()=>{let L=all("fey");let h=topbar("Método Feynman","feyn");
  h+=`<p class="muted small" style="margin:2px 0 12px">Explique um conceito como se ensinasse alguém de 12 anos. A IA mostra onde ficou vago e testa você com 3 perguntas.</p>
    <button class="btn full" data-a="feyNovo">${ic("mic")} Explicar um conceito</button>`;
  if(!L.length)return `<div class="app">${h}<div style="margin-top:14px">${empty("feyn","Nenhum conceito ainda","Bons para começar: um tópico do edital do concurso, uma aula do seu curso ou uma regra de edital que você vive consultando.")}</div></div>`;
  const temas=[...new Set(L.map(f=>f.tema).filter(Boolean))],tf=VIEW.tema||"";
  if(temas.length>1)h+=`<div class="tabs" style="margin-top:14px">${[""].concat(temas).map(t=>`<button data-a="feyTema" data-v="${esc(t)}" aria-pressed="${t===tf}">${t||"Todos"}</button>`).join("")}</div>`;
  if(tf)L=L.filter(f=>f.tema===tf);
  const dev=L.filter(f=>f.prox&&f.prox<=TODAY()).sort((a,b)=>a.prox.localeCompare(b.prox)),resto=L.filter(f=>!dev.includes(f)).sort((a,b)=>(b.u||0)-(a.u||0));
  if(dev.length)h+=`<div class="grp">Revisar hoje<span class="chip">${dev.length}</span></div>`+dev.map(feyCard).join("");
  if(resto.length)h+=`<div class="grp">Conceitos<span class="chip">${resto.length}</span></div>`+resto.map(feyCard).join("");
  return `<div class="app">${h}</div>`;};
function feyCard(f){const n=feyNota(f);
  return `<div class="item"><button class="ibody" data-a="feyVer" data-id="${f.id}"><b>${esc(f.conceito)}</b><div class="meta">${f.tema?`<span class="chip">${esc(f.tema)}</span>`:""}${n!=null?`<span class="chip ${feyCls(n)}">${n}/10</span>`:`<span class="chip">sem avaliação</span>`}${f.prox?`<span class="tiny faint">revisar ${f.prox<=TODAY()?"hoje":fshort(f.prox)}</span>`:""}</div></button></div>`;}
ACT.feyTema=el=>{VIEW.tema=el.dataset.v;rr();};
ACT.feyNovo=()=>{FEY={id:null,conceito:"",tema:VIEW.tema||"Concurso",texto:""};feyForm();};
ACT.feyVer=el=>{const f=getD(el.dataset.id);if(!f)return;const s=feyUlt(f);
  sheet(`<h2>${esc(f.conceito)}</h2><div class="muted small">${esc(f.tema||"")} · ${(f.ses||[]).length} ${(f.ses||[]).length===1?"explicação":"explicações"}</div>
   ${s&&s.av?feyAvHTML(s.av,false):s?`<div class="note">Explicação salva sem avaliação.</div>`:""}
   ${s?`<details style="margin-top:12px"><summary class="small" style="font-weight:800">Sua última explicação · ${fdate(s.d)}</summary><div class="small muted" style="white-space:pre-wrap;margin-top:6px">${esc(s.texto)}</div></details>`:""}
   <div class="btns"><button class="btn full" id="fyR">${ic("refresh-cw")} Explicar de novo</button><button class="btn danger full" id="fyX">Apagar</button></div>`,sh=>{
   sh.querySelector("#fyR").onclick=()=>{FEY={id:f.id,conceito:f.conceito,tema:f.tema,texto:""};feyForm();};
   sh.querySelector("#fyX").onclick=()=>confirmSheet("Apagar este conceito?",f.conceito,"Apagar",()=>{removeDoc(f.id);rr();});});};

/* ---------- 1. explicar ---------- */
function feyForm(){const novo=!FEY.id;
  sheet(`<h2>${novo?"Explique um conceito":esc(FEY.conceito)}</h2>
   ${novo?`<label class="fld"><span>Conceito</span><input id="fyC" value="${esc(FEY.conceito)}" placeholder="Ex.: Princípio da legalidade" autofocus></label>
   <div class="fld"><span>Para quê</span><div class="seg" data-k="fyT">${FEY_TEMAS.map(t=>`<button type="button" data-a="seg" data-v="${t}" aria-pressed="${FEY.tema===t}">${t}</button>`).join("")}</div></div>`:`<p class="muted small" style="margin:4px 0 0">Sem olhar o material. O que você não conseguir explicar é o que falta estudar.</p>`}
   <label class="fld"><span>Sua explicação, com suas palavras</span><textarea id="fyX" class="tall" placeholder="Comece pelo mais simples: o que é, para que serve e um exemplo.">${esc(FEY.texto)}</textarea></label>
   <button class="btn ghost full" data-a="feyDitar" id="fyMic">${ic("mic")} Falar em vez de digitar</button>
   ${temIA()?"":`<div class="note">${ic("info")} A avaliação usa a IA. Neste modo o app só guarda a sua explicação.</div>`}
   <div class="btns"><button class="btn full" data-a="feyAvaliar">${ic("sparkles")} ${temIA()?"Avaliar minha explicação":"Salvar explicação"}</button></div>`);}
function feyLer(){const s=$("sheet");if(!FEY.id){const c=s.querySelector("#fyC");if(c)FEY.conceito=c.value.trim();FEY.tema=segVal(s,"fyT")||FEY.tema;}const x=s.querySelector("#fyX");if(x)FEY.texto=x.value.trim();}
ACT.feyDitar=()=>ditar("fyX","fyMic");
ACT.feyAvaliar=async()=>{ditarParar();feyLer();
  if(!FEY.conceito)return toast("triangle-alert","Escreva o conceito","");
  if(FEY.texto.split(/\s+/).length<12)return toast("triangle-alert","Explique um pouco mais","Pelo menos duas ou três frases.");
  if(!temIA()){feySalvar(null,[],null);closeSheet();rr();return toast("check","Explicação salva","");}
  sheet(`<h2>Lendo sua explicação…</h2><div class="mict">${esc(FEY.texto.slice(0,280))}${FEY.texto.length>280?"…":""}</div><div class="bar"><i style="width:45%"></i></div>`);
  try{FEY.av=await feyIA(`Você é um professor exigente e gentil que ensina pelo Método Feynman. Tema: ${FEY.tema}. Conceito: "${FEY.conceito}".
O aluno explicou o conceito com as próprias palavras (pode ser transcrição de voz, ignore erros de digitação e vícios de fala). Avalie o entendimento, não o estilo.
Responda só com JSON neste formato:
{"nota":0,"resumo":"uma frase sobre o nível de domínio","vagos":["ideia que ficou vaga e o que faltou dizer"],"erros":["afirmação errada e a correção"],"perguntas":["","",""],"melhor":"explicação clara e simples do conceito, em até 120 palavras, com um exemplo"}
Regras: nota de 0 a 10, onde 10 = explicaria sem erros para alguém de 12 anos. No máximo 4 itens em vagos e 4 em erros; use lista vazia se não houver. As 3 perguntas testam entendimento (aplicar, dar exemplo, achar exceção), não decoreba.${FEY.tema==="Concurso"?" Pense em como uma banca de concurso cobraria o tema.":""}
Explicação do aluno:
"""${FEY.texto}"""`);
    FEY.av.nota=clamp(Math.round(+FEY.av.nota||0),0,10);FEY.av.perguntas=(FEY.av.perguntas||[]).slice(0,3);FEY.resp=FEY.av.perguntas.map(()=>"");FEY.corr=null;feySalvar(FEY.av,FEY.resp,null);feyResultado();}
  catch(e){console.warn(e);feyForm();toast("triangle-alert","A IA não respondeu","Confira a internet e tente de novo. Seu texto continua aqui.");}};
async function feyIA(prompt){const txt=await Promise.race([aiGenerate([{text:prompt}]),new Promise((_,rej)=>setTimeout(()=>rej(new Error("tempo")),40000))]);
  return JSON.parse(String(txt).replace(/```json|```/g,"").trim());}

/* ---------- 2. resultado e 3 perguntas ---------- */
function feyAvHTML(av,comMelhor=true){const n=av.nota;
  return `<div class="feyn"><div class="ring" style="--p:${n*10}"><b>${n}/10</b></div><div class="grow"><b>${feyRot(n)}</b><div class="small muted">${esc(av.resumo||"")}</div></div></div>
   ${(av.vagos||[]).length?`<div class="small" style="margin-top:12px"><b>Onde ficou vago</b><ul class="feyl">${av.vagos.map(v=>`<li>${esc(v)}</li>`).join("")}</ul></div>`:""}
   ${(av.erros||[]).length?`<div class="small" style="margin-top:10px"><b>O que está errado</b><ul class="feyl err">${av.erros.map(v=>`<li>${esc(v)}</li>`).join("")}</ul></div>`:""}
   ${comMelhor&&av.melhor?`<details style="margin-top:10px"><summary class="small" style="font-weight:800">Ver uma explicação mais clara</summary><div class="small muted" style="white-space:pre-wrap;margin-top:6px">${esc(av.melhor)}</div></details>`:""}`;}
function feyResultado(){const av=FEY.av,C=FEY.corr;
  sheet(`<h2>${esc(FEY.conceito)}</h2>${feyAvHTML(av)}
   <div class="sec" style="margin-top:20px"><h2>Teste-se</h2></div>
   ${av.perguntas.map((p,i)=>{const r=C&&C.itens&&C.itens[i];return `<label class="fld"><span>${i+1}. ${esc(p)}</span><textarea id="fyR${i}" style="min-height:70px" ${C?"readonly":""}>${esc(FEY.resp[i]||"")}</textarea></label>
     ${r?`<div class="note" style="margin-top:-4px">${ic(r.ok?"circle-check":"circle-alert")} ${esc(r.comentario||"")}</div>`:""}`;}).join("")}
   ${C?`<div class="note"><b>Nota nas perguntas: ${C.nota}/10.</b> ${(C.nota>=8&&av.nota>=8)?"Conceito dominado. Ele volta em 7 dias para fixar.":"O conceito volta para revisão em breve."}</div>`:""}
   <div class="btns">${C||!av.perguntas.length?"":`<button class="btn full" data-a="feyCorrigir">${ic("check")} Corrigir minhas respostas</button>`}<button class="btn ${C||!av.perguntas.length?"":"ghost"} full" data-a="feySalvarBtn">Salvar e sair</button></div>`);}
const feyRespLer=()=>{(FEY.av.perguntas||[]).forEach((_,i)=>{const t=$("fyR"+i);if(t)FEY.resp[i]=t.value.trim();});};
ACT.feyCorrigir=async()=>{feyRespLer();if(FEY.resp.filter(Boolean).length<FEY.av.perguntas.length)return toast("triangle-alert","Responda as 3 perguntas","Mesmo que seja um palpite.");
  const pr=FEY.av.perguntas.map((p,i)=>`${i+1}) Pergunta: ${p}\nResposta: ${FEY.resp[i]}`).join("\n\n");
  sheet(`<h2>Corrigindo…</h2><div class="bar"><i style="width:55%"></i></div>`);
  try{FEY.corr=await feyIA(`Conceito: "${FEY.conceito}" (${FEY.tema}). Corrija as respostas do aluno com rigor e gentileza.
Responda só com JSON: {"itens":[{"ok":true,"comentario":"uma ou duas frases: o que acertou e o que faltou"}],"nota":0}
Um item por pergunta, na mesma ordem. nota de 0 a 10 para o conjunto.
${pr}`);FEY.corr.nota=clamp(Math.round(+FEY.corr.nota||0),0,10);feyAtualizar();}
  catch(e){console.warn(e);toast("triangle-alert","A IA não respondeu","Tente corrigir de novo.");}
  feyResultado();};
ACT.feySalvarBtn=()=>{if(!FEY.corr)feyRespLer();feyAtualizar();closeSheet();rr();const f=getD(FEY.id);if(f)toast("brain","Conceito salvo","Revisão em "+fdate(f.prox)+".");};
function feySalvar(av,resp,corr){const f=FEY.id?getD(FEY.id):{id:"fey_"+nid(),c:"fey",conceito:FEY.conceito,tema:FEY.tema,ses:[]};
  f.ses=f.ses||[];f.ses.push({d:TODAY(),texto:FEY.texto,av,resp,corr});
  feyProx(f);save(f);FEY.id=f.id;}
/* a avaliação já fica salva; as respostas e a correção completam a mesma sessão */
function feyAtualizar(){const f=FEY&&FEY.id&&getD(FEY.id);if(!f||!(f.ses||[]).length)return;const s=f.ses[f.ses.length-1];s.resp=(FEY.resp||[]).slice();s.corr=FEY.corr||null;feyProx(f);save(f);}
/* repetição espaçada: quanto melhor a nota, mais longe a próxima revisão */
function feyProx(f){const s=f.ses[f.ses.length-1];const n=Math.min(s.av?s.av.nota:5,s.corr?s.corr.nota:10);f.prox=addDays(TODAY(),n>=8?7:n>=5?3:1);}

/* ---------- ditado por voz para qualquer campo de texto ---------- */
let DIT=null;
function ditar(campoId,btnId){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return toast("mic","Este navegador não grava voz","Use o Chrome no Android ou no computador.");
  if(DIT){ditarParar();return;}
  const campo=$(campoId),btn=$(btnId);if(!campo)return;const base=campo.value?campo.value.replace(/\s*$/," "):"";
  const r=new SR();r.lang="pt-BR";r.continuous=true;r.interimResults=true;DIT={r,keep:true,fin:"",btn};
  if(btn){DIT.orig=btn.innerHTML;btn.classList.add("rec");btn.innerHTML=btn.dataset.curto?ic("square"):`${ic("square")} Parar de gravar`;}
  r.onresult=e=>{let inter="";for(let i=e.resultIndex;i<e.results.length;i++){const t=e.results[i][0].transcript;if(e.results[i].isFinal)DIT.fin+=t.trim()+". ";else inter+=t;}const c=$(campoId);if(c)c.value=base+DIT.fin+inter;};
  r.onerror=ev=>{if(ev.error==="not-allowed"||ev.error==="service-not-allowed"){ditarParar();toast("mic","Microfone bloqueado","Libere o microfone para este site nas configurações do navegador.");}};
  r.onend=()=>{if(DIT&&DIT.keep){try{r.start();}catch(e){}}};
  try{r.start();}catch(e){DIT=null;toast("mic","Não foi possível usar o microfone","");}}
function ditarParar(){if(!DIT)return;DIT.keep=false;try{DIT.r.stop();}catch(e){}const b=DIT.btn;if(b&&b.isConnected){b.classList.remove("rec");b.innerHTML=DIT.orig||ic("mic");}DIT=null;}
const _closeSheetDit=closeSheet;closeSheet=function(){ditarParar();return _closeSheetDit.apply(this,arguments);};
