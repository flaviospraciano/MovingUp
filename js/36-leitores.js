"use strict";
/* ======================================================================
   LEITORES INTELIGENTES
   1. Gasto por foto: a IA lê o comprovante (cupom, nota, Pix, maquininha, print de banco) com regras
      de comprovantes brasileiros; se ela falhar, o texto da imagem é lido com a imagem tratada
      (tons de cinza, contraste e ampliação) e o motivo da falha aparece na tela.
   2. Livros: colar uma lista e salvar cada livro separado, em blocos por ano (2020 a 2026).
   3. Copiloto de voz: entende melhor ordens e perguntas misturadas na mesma fala.
   ====================================================================== */

/* ---------- 1. comprovantes ---------- */
const COMP_PROMPT=()=>`Você é especialista em ler comprovantes brasileiros: cupom fiscal (NFC-e, SAT), nota fiscal, recibo, comprovante de Pix ou TED, boleto pago, via da maquininha de cartão, print de aplicativo de banco.
Extraia o gasto principal.
Regras:
- valor: o valor efetivamente pago (TOTAL, VALOR PAGO, VALOR A PAGAR, valor da transferência). Ignore subtotal, troco, descontos, tributos, saldo e limite. Número com ponto decimal (ex.: 45.9).
- descricao: em Pix ou transferência, o nome de quem RECEBEU (não de quem pagou); em cupom ou nota, o nome fantasia do estabelecimento. Curto, sem CNPJ.
- data: a data do pagamento no formato AAAA-MM-DD (as datas brasileiras vêm como dd/mm/aaaa). Vazio se não houver.
- forma: "Pix", "Cartão" (crédito), "Débito", "Dinheiro" ou "" se não der para saber.
- categoria: uma destas: ${CATS.map(c=>c[0]).join(", ")}.
- itens: até 5 itens principais, se houver.
- Se a imagem não for um comprovante, use valor 0.
Responda só com JSON: {"valor":0,"descricao":"","data":"","forma":"","categoria":"","itens":[]}`;
async function ocrPreparar(file){const im=await loadBitmap(file);const s=Math.min(2.5,2200/Math.max(im.width,im.height));const c=document.createElement("canvas");c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);
  const x=c.getContext("2d");x.drawImage(im,0,0,c.width,c.height);const d=x.getImageData(0,0,c.width,c.height),a=d.data;let mn=255,mx=0;
  for(let i=0;i<a.length;i+=4){const g=a[i]*.299+a[i+1]*.587+a[i+2]*.114;a[i]=g;if(g<mn)mn=g;if(g>mx)mx=g;}
  const k=255/Math.max(1,mx-mn);for(let i=0;i<a.length;i+=4){let g=(a[i]-mn)*k;g=g<128?g*.75:Math.min(255,g*1.12);a[i]=a[i+1]=a[i+2]=g;}x.putImageData(d,0,0);return c;}
ocrParse=function(t){const L=t.split(/\n/).map(s=>s.trim()).filter(Boolean),T=normTxt(t),vals=[];const chave=/(valor\s*(total|pago|a pagar|da transfer|do pix|cobrado)|total\s*(a pagar|pago|r\$)?|^total|pagamento|transferido|pix enviado|debito|credito)/;
  L.forEach((l,i)=>{const n=normTxt(l),ant=i?normTxt(L[i-1]):"";const re=/(?:R\$\s*)?(\d{1,3}(?:\.\d{3})*,\d{2}|\d+,\d{2})/g;let m;
    while((m=re.exec(l))){const v=num(m[1]);if(!(v>0))continue;vals.push({v,s:(chave.test(n)?4:0)+(chave.test(ant)&&!/\d,\d{2}/.test(ant)?3:0)+(/R\$/.test(l)?1:0)+(/troco|desconto|tribut|imposto|subtotal|saldo|limite|juros|tarifa|aproximad/.test(n)?-5:0)});}});
  vals.sort((a,b)=>b.s-a.s||b.v-a.v);const valor=vals.length?vals[0].v:0;
  const dm=t.match(/(\d{2})\/(\d{2})\/(\d{2,4})/);const data=dm?`${dm[3].length===2?"20"+dm[3]:dm[3]}-${dm[2]}-${dm[1]}`:"";
  const forma=/\bpix\b/.test(T)?"Pix":/debito/.test(T)?"Débito":/credito|cartao/.test(T)?"Cartão":/dinheiro/.test(T)?"Dinheiro":"";
  let desc="";const di=L.findIndex(l=>/^(para|destino|destinat|favorecido|recebedor|quem recebeu|nome)/i.test(normTxt(l)));
  if(di>=0){const so=L[di].includes(":")?L[di].replace(/^[^:]*:\s*/,"").trim():L[di].replace(/^(para|destino|destinatario|destinatário|favorecido|recebedor|quem recebeu|nome)\s*/i,"").trim();desc=so||L[di+1]||"";}
  if(!desc)desc=L.slice(0,6).find(l=>/[A-Za-zÀ-ú]{3}/.test(l)&&!/cnpj|cpf|cupom|nota|fiscal|data|hora|comprovante|extrato|documento|via|cliente/i.test(normTxt(l)))||"";
  return{valor,descricao:desc.replace(/\s{2,}/g," ").slice(0,40),data,forma};};
ACT.gFoto=async()=>{const f=await pickFiles(false);if(!f.length)return;const file=f[0];
  const msg=t=>{const s=$("sheet");if(s&&!s.classList.contains("hidden")){const p=s.querySelector("p");if(p)p.textContent=t;}};
  sheet(`<h2>${ic("scan-line")} Lendo o comprovante…</h2><p class="muted small">${temIA()?"A IA está lendo valor, local, data e forma de pagamento.":"Lendo o texto da imagem…"}</p><div class="bar"><i style="width:45%"></i></div>`);
  let r=null,via="",motivo="";const p=await processImage(file).catch(()=>null);
  if(temIA()){try{const b64=await fileToB64(file);const txt=await Promise.race([aiGenerate([{text:COMP_PROMPT()},{inlineData:{mimeType:"image/jpeg",data:b64}}],{max:700}),new Promise((_,j)=>setTimeout(()=>j(new Error("tempo")),40000))]);
      const j=JSON.parse(String(txt).replace(/```json|```/g,"").trim());const v=typeof j.valor==="string"?num(j.valor):+j.valor;
      r={valor:v>0?Math.round(v*100)/100:0,descricao:String(j.descricao||""),data:String(j.data||""),forma:String(j.forma||""),categoria:String(j.categoria||""),itens:Array.isArray(j.itens)?j.itens.slice(0,5):[]};via="ia";
      if(!(r.valor>0))motivo="A IA não encontrou um valor nesta imagem.";}
    catch(e){console.warn("comprovante IA",e);motivo=(e&&e.amigavel)||(/tempo/.test(String(e&&e.message))?"A IA demorou demais para responder.":"A IA não conseguiu ler a imagem.");}}
  if(!r||!(r.valor>0)){msg("Lendo o texto da imagem (na primeira vez leva alguns segundos)…");
    try{if(!window.Tesseract)await loadScript("https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js");
      const w=await Tesseract.createWorker("por",1,{langPath:"https://cdn.jsdelivr.net/npm/@tesseract.js-data/por@1.0.0/4.0.0_best_int",gzip:true});
      const out=await w.recognize(await ocrPreparar(file));await w.terminate();const o=ocrParse(out.data.text||"");if(o.valor>0||!r){r=o;via="ocr";}}catch(e){console.warn("ocr",e);r=r||{};}}
  GFOTO={p,r:r||{},via,motivo};gFotoForm();};
const _gFotoFormIA=gFotoForm;gFotoForm=function(){_gFotoFormIA.apply(this,arguments);const r=GFOTO&&GFOTO.r||{};
  if(r.categoria&&CATS.some(c=>c[0]===r.categoria)){const s=$("gfC");if(s)s.value=r.categoria;}
  const nota=document.querySelector("#sheet .small.muted");
  if(nota){if(GFOTO.motivo&&GFOTO.via!=="ia")nota.insertAdjacentHTML("beforeend",`<span style="display:block;margin-top:4px;color:var(--waittx)">${esc(GFOTO.motivo)}</span>`);
    if(r.itens&&r.itens.length)nota.insertAdjacentHTML("beforeend",`<span style="display:block;margin-top:4px">Itens: ${esc(r.itens.map(x=>typeof x==="string"?x:(x.nome||x.descricao||"")).filter(Boolean).join(", "))}</span>`);}};

/* ---------- 2. livros: colar lista e blocos por ano ---------- */
const LIV_ANOS=["2026","2025","2024","2023","2022","2021","2020"];
LISTS.livros.fields.splice(2,0,{k:"ano",l:"Ano da leitura",type:"select",opts:LIV_ANOS.concat(["Antes de 2020"]),def:()=>String(Math.min(2026,yNow()))});
const livAno=i=>{const a=String(i.ano||(i.fim?String(i.fim).slice(0,4):""));return LIV_ANOS.includes(a)?a:a&&+a<2020?"Antes de 2020":a&&+a>2026?a:"Sem ano";};
const _listLiv=VIEWS.list;VIEWS.list=function(){if(VIEW.k!=="livros")return _listLiv.apply(this,arguments);
  const q=normTxt(VIEW.q||"");let L=all("livros");if(q)L=L.filter(i=>normTxt([i.t,i.autor,i.res].join(" ")).includes(q));
  let h=topbar(MODS.livros.n,"livros")+`<div class="hero row" style="gap:14px"><div class="grow"><h2 style="margin:0">${all("livros").length} livros</h2><div class="muted small">${all("livros").filter(i=>livAno(i)===String(yNow())).length} em ${yNow()}</div></div><button class="btn sm" data-a="livColar">${ic("clipboard-list")} Colar lista</button></div>
    <div class="search">${ic("search")}<input id="lsq" placeholder="Buscar título ou autor" value="${esc(VIEW.q||"")}" data-in="liSearch"></div>`;
  const anos=LIV_ANOS.concat([...new Set(L.map(livAno))].filter(a=>!LIV_ANOS.includes(a)).sort().reverse());
  anos.forEach(a=>{const arr=L.filter(i=>livAno(i)===a).sort((x,y)=>(y.fim||"").localeCompare(x.fim||"")||(x.t||"").localeCompare(y.t||""));if(!arr.length&&(q||!LIV_ANOS.includes(a)))return;
    h+=`<details class="livano" ${a===String(yNow())||q?"open":""}><summary><b class="grow">${esc(a)}</b><span class="chip">${arr.length} ${arr.length===1?"livro":"livros"}</span></summary>${arr.length?arr.map(i=>itemCard("livros",i)).join(""):`<div class="note" style="margin:6px 0">Nenhum livro em ${esc(a)}.</div>`}</details>`;});
  return `<div class="app">${h}</div>${fab("liNew","Adicionar",`data-k="livros"`)}`;};
function livParseLocal(txt,anoPadrao){let ano=anoPadrao;const out=[];
  String(txt||"").split(/\r?\n/).forEach(l=>{const s=l.replace(/^\s*(?:[-*•▪◦·–—]|\d+\s*[.)-]|\[\s*[xX✓]?\s*\]|[☐☑✅✔📚📖])\s*/u,"").trim();if(!s)return;
    const ya=s.match(/^(?:livros?\s+(?:lidos\s+)?(?:em|de)\s+)?(20\d{2}|19\d{2})\s*[:\-–]?\s*$/i);if(ya){ano=ya[1];return;}
    let t=s,autor="",a=ano;const yy=t.match(/[\s(\-–,]+(20[0-2]\d)\)?\s*$/);if(yy){a=yy[1];t=t.slice(0,yy.index).trim();}
    const m=t.match(/^(.*?)\s+(?:[-–—|]|,\s*de|\bde\b(?=\s+[A-ZÀ-Ú][a-zà-ú]+\s+[A-ZÀ-Ú]))\s+(.+)$/)||t.match(/^(.*?)\s*\((.+)\)\s*$/);
    if(m){t=m[1].trim();autor=m[2].trim();}t=t.replace(/^["“”']|["“”']$/g,"").replace(/[,;:\s]+$/,"").trim();if(t.length>1)out.push({t,autor,ano:a});});
  return out;}
async function livParseIA(txt,anoPadrao){const r=await Promise.race([aiGenerate([{text:`Organize esta lista de livros lidos. Para cada livro: título correto (como publicado no Brasil, se reconhecer), autor (complete se souber com certeza; senão vazio) e ano em que a pessoa leu.
O ano vem de títulos de seção (ex.: "2023:") ou do texto da linha; se não houver, use ${anoPadrao||"vazio"}. Não invente livros nem junte livros diferentes.
Responda só com JSON: {"livros":[{"titulo":"","autor":"","ano":""}]}

Lista:
${txt}`}],{max:4000}),new Promise((_,j)=>setTimeout(()=>j(new Error("tempo")),35000))]);
  const j=JSON.parse(String(r).replace(/```json|```/g,""));return(j.livros||[]).map(x=>({t:String(x.titulo||"").trim(),autor:String(x.autor||"").trim(),ano:String(x.ano||anoPadrao||"").trim()})).filter(x=>x.t);}
let LIVP=null;
ACT.livColar=()=>{sheet(`<h2>Colar lista de livros</h2><p class="muted small" style="margin:4px 0 0">Um livro por linha. Pode separar por ano com títulos como <i>2023:</i>, ou escrever o ano no fim da linha. Formatos aceitos: <i>Título - Autor</i>, <i>Título (Autor)</i>, <i>Título, de Autor</i>.</p>
   <label class="fld"><span>Lista</span><textarea id="lvT" class="tall" placeholder="2024:&#10;Hábitos Atômicos - James Clear&#10;O Poder do Agora (Eckhart Tolle)&#10;2025:&#10;Essencialismo, de Greg McKeown"></textarea></label>
   <div class="fld"><span>Ano para as linhas sem ano</span><div class="seg" data-k="lvA">${LIV_ANOS.map(a=>`<button type="button" data-a="seg" data-v="${a}" aria-pressed="${a===String(Math.min(2026,yNow()))}">${a}</button>`).join("")}</div></div>
   <div class="btns"><button class="btn full" id="lvOk">${ic("sparkles")} Organizar lista</button></div>`,s=>{
  s.querySelector("#lvOk").onclick=async e=>{const txt=s.querySelector("#lvT").value,ano=segVal(s,"lvA")||String(yNow());if(!txt.trim())return toast("triangle-alert","Cole a lista primeiro","");
    e.currentTarget.disabled=true;e.currentTarget.innerHTML=`${ic("sparkles")} Organizando…`;let L=null,via="local";
    if(temIA()){try{L=await livParseIA(txt,ano);via="ia";}catch(x){console.warn("livros IA",x);}}
    if(!L||!L.length)L=livParseLocal(txt,ano);LIVP={L,via};livPrevia();};});};
function livPrevia(){const {L,via}=LIVP,ex=new Set(all("livros").map(i=>normTxt(i.t)+"|"+livAno(i)));L.forEach(x=>{x.ano=LIV_ANOS.includes(x.ano)||/^\d{4}$/.test(x.ano)?x.ano:"";x.dup=ex.has(normTxt(x.t)+"|"+(x.ano?livAno(x):"Sem ano"));});
  const novos=L.filter(x=>!x.dup),G={};novos.forEach(x=>{const a=x.ano||"Sem ano";(G[a]=G[a]||[]).push(x);});
  sheet(`<h2>${novos.length} ${novos.length===1?"livro":"livros"} para salvar</h2><p class="muted small" style="margin:4px 0 0">${via==="ia"?"Organizado pela IA. ":""}Confira antes de salvar.${L.length-novos.length?` ${L.length-novos.length} já estavam na sua lista e foram ignorados.`:""}</p>
   ${Object.keys(G).sort().reverse().map(a=>`<div class="grp" style="margin-top:12px">${esc(a)}<span class="chip">${G[a].length}</span></div>`+G[a].map(x=>`<div class="ctlog"><span class="grow"><b>${esc(x.t)}</b>${x.autor?`<span class="tiny muted" style="display:block">${esc(x.autor)}</span>`:""}</span></div>`).join("")).join("")}
   <div class="btns"><button class="btn full" id="lvS" ${novos.length?"":"disabled"}>${ic("check")} Salvar ${novos.length} ${novos.length===1?"livro":"livros"}</button><button class="btn ghost full" data-a="livColar">Voltar e editar</button></div>`,s=>{
  s.querySelector("#lvS").onclick=()=>{novos.forEach(x=>save({id:"livros_"+nid(),c:"livros",t:x.t,autor:x.autor,ano:x.ano||"",fim:""}));const n=novos.length;LIVP=null;closeSheet();rr();toast("library",n+(n===1?" livro salvo":" livros salvos"),"Separados por ano.");};});}

/* ---------- 3. copiloto: ordens e perguntas na mesma fala ---------- */
parseIA=async function(frase){const hoje=new Date();const txt=await Promise.race([aiGenerate([{text:`Hoje é ${DIAS[hoje.getDay()]}, ${TODAY()}, ${pad(hoje.getHours())}:${pad(hoje.getMinutes())}. A pessoa falou ou digitou uma frase para o assistente de um app pessoal (pode ser transcrição de voz, com erros, repetições e pontuação estranha: interprete pelo sentido).
Transforme em ações. Tipos:
- gasto {valor:number,desc,pag:"Pix"|"Cartão"|"Débito"|"Dinheiro",data:"AAAA-MM-DD"} (ex.: "gastei 30 no uber", "paguei 120 de luz no pix")
- check {modulo:"gym"|"run"|"swim"|"cap"|"kegel"|"bib"|"conc"|"man"|"med"} (academia, corrida, natação, capoeira, kegel, bíblia, estudo para concurso, ritual de manifestação, meditação)
- lembrete {titulo,data:"AAAA-MM-DD",hora:"HH:MM"} (ex.: "me lembra de ligar pra Ana amanhã às 9")
- evento {titulo,data,hora} (compromisso de agenda)
- fiz {texto} (algo que a pessoa fez hoje e quer registrar)
- habito {nome} (marcou um hábito)
- pergunta {texto} quando a pessoa quer SABER algo (sobre os dados dela ou qualquer dúvida), e não registrar.
Uma frase pode ter várias ações. Datas relativas (amanhã, sexta, semana que vem) viram datas reais. Valores por extenso viram números ("trinta e cinco reais" = 35).
Responda só com JSON: {"acoes":[{"tipo":"...",...}]}

Frase: ${frase}`}],{max:800}),new Promise((_,r)=>setTimeout(()=>r(new Error("tempo")),15000))]);
  const j=JSON.parse(String(txt).replace(/```json|```/g,""));return(j.acoes||[]).map(a=>{if(a.tipo==="habito"){const hb=all("hab").find(h=>normTxt(h.nome).includes(normTxt(a.nome||""))||normTxt(a.nome||"").includes(normTxt(h.nome)));return hb?{tipo:"habito",id:hb.id,nome:hb.nome}:{tipo:"fiz",texto:a.nome};}return a;});};
/* se a frase tiver perguntas, elas vão para o Jarvis depois de executar as ordens */
const _execAcoesP=execAcoes;execAcoes=function(A){const P=(A||[]).filter(a=>a&&a.tipo==="pergunta"&&a.texto),R=_execAcoesP.call(this,(A||[]).filter(a=>!a||a.tipo!=="pergunta"));
  if(P.length&&typeof jarPerguntar==="function"){if(R.some(d=>d.id))setTimeout(()=>jarPerguntar(P.map(p=>p.texto).join(" ")),1800);else R.length=0;}return R;};
