"use strict";
/* ======================================================================
   EXTRAS v2.7
   1. Ordem de "Treinos e corpo"
   2. Semana do desafio (flexões, abdominais, barras, agachamentos · 4×20)
   3. Orçamentos do fotógrafo (copiar e colar para o cliente)
   4. Gasto por foto: mais rápido e com opção de ocultar enquanto lê
   ====================================================================== */
Object.assign(ICONS,{
  "award":'<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
  "loader":'<path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/>'
});

/* ---------- 1. ordem dos treinos ---------- */
MODS.des={n:"Semana do desafio",ic:"flame",c1:"#C2410C",c2:"#F97316",g:9,v:{v:"des"}};
(()=>{const g=MOD_GROUPS.find(x=>x[0]==="Treinos e corpo")||MOD_GROUPS[0];if(!g)return;
  const pref=["gym","run","cap","kegel","swim","mara"];const resto=g[1].filter(k=>!pref.includes(k)&&k!=="des");
  g[1]=pref.filter(k=>MODS[k]).concat(resto,["des"]);})();

/* ---------- 2. SEMANA DO DESAFIO ---------- */
/* o mês tem 4 semanas: 1–7 flexões · 8–14 abdominais · 15–21 barras · 22 ao fim agachamentos */
const DES=[["flex","Flexões","Semana das flexões","#C2410C"],["abd","Abdominais","Semana das abdominais","#B45309"],["barra","Barras","Semana das barras","#9D174D"],["agach","Agachamentos","Semana dos agachamentos","#1D4ED8"]];
const DES_SERIES=4;
const desDados=()=>{const d=single("desafio",{log:{},reps:{}});d.log=d.log||{};d.reps=d.reps||{};return d;};
const desSemana=dt=>{const n=+dt.slice(8,10);return n<=7?0:n<=14?1:n<=21?2:3;};
function desDiasDaSemana(dt,w){const ym=dt.slice(0,8),ult=new Date(+dt.slice(0,4),+dt.slice(5,7),0).getDate();const ini=[1,8,15,22][w],fim=w===3?ult:ini+6;
  const L=[];for(let n=ini;n<=fim;n++)L.push(ym+String(n).padStart(2,"0"));return L;}
const desReps=(D,k)=>+(D.reps[k]||20);
const desSer=(D,dt)=>{const a=D.log[dt];return Array.isArray(a)?a:[];};
const desFeito=(D,dt)=>desSer(D,dt).filter(Boolean).length>=DES_SERIES;
const desPontosSemana=(D,dt,w)=>desDiasDaSemana(dt,w).filter(d=>desFeito(D,d)).length;
const desPontosMes=(D,ym)=>Object.keys(D.log).filter(d=>d.startsWith(ym)&&desFeito(D,d)).length;
function desSeq(D){let n=0,d=TODAY();if(!desFeito(D,d))d=addDays(d,-1);while(desFeito(D,d)&&n<400){n++;d=addDays(d,-1);}return n;}

/* desenho simples de cada exercício, no traço dos ícones do app */
const DES_ART={
  flex:'<path d="M3 17h18"/><circle cx="19" cy="9.5" r="1.6"/><path d="M17.4 10.4 6 13"/><path d="M14 11.2v5.8"/><path d="M6 13l-2.6 1.4"/>',
  abd:'<path d="M3 18h18"/><circle cx="8.5" cy="8" r="1.6"/><path d="M9.6 9.4 12 15h5"/><path d="M12 15l3-4 2 2"/><path d="M9.4 11l3.2-1"/>',
  barra:'<path d="M3 4h18"/><circle cx="12" cy="9" r="1.6"/><path d="M8 4l2.2 4.6M16 4l-2.2 4.6"/><path d="M12 10.6V16"/><path d="M12 16l-2 4M12 16l2 4"/>',
  agach:'<path d="M3 20h18"/><circle cx="13" cy="5" r="1.6"/><path d="M13 6.6 11 11.5l4 2-1 6"/><path d="M11 11.5 8 14l2.5 5.5"/><path d="M12 8.5h5"/>'};
const desArt=(k,c="")=>`<svg class="i desart ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${DES_ART[k]}</svg>`;

function secDesafio(){const t=TODAY(),D=desDados(),w=desSemana(t),[k,nome,titulo,cor]=DES[w],R=desReps(D,k),S=desSer(D,t),feito=desFeito(D,t);
  const dias=desDiasDaSemana(t,w),pts=desPontosSemana(D,t,w),idx=dias.indexOf(t)+1;
  return `<div class="sec"><h2>${ic("flame")} Semana do desafio</h2><button class="lk" data-a="go" data-v="${gv({v:"des"})}">Placar</button></div>
  <div class="card des ${feito?"ok":""}" style="--dc:${cor}">
    <div class="des-hd"><span class="des-art">${desArt(k)}</span><div class="grow"><b>${titulo}</b><span class="small muted" style="display:block">Dia ${idx} de ${dias.length} · ${pts} ${pts===1?"ponto":"pontos"} na semana</span></div>
      <div class="des-wk" aria-label="Dias da semana do desafio">${dias.map(d=>`<i class="${desFeito(D,d)?"on":""} ${d===t?"hj":""} ${d>t?"fut":""}"></i>`).join("")}</div></div>
    <div class="des-sr" role="group" aria-label="${DES_SERIES} séries de ${R} ${nome.toLowerCase()}">${Array.from({length:DES_SERIES},(_,i)=>`<button class="${S[i]?"on":""}" data-a="desSerie" data-i="${i}" aria-pressed="${!!S[i]}" aria-label="Série ${i+1}: ${R} ${nome.toLowerCase()}"><b>${R}</b><span>${i+1}ª</span></button>`).join("")}</div>
    <div class="tiny ${feito?"des-okt":"faint"}" style="margin-top:8px;text-align:center;font-weight:700">${feito?`${ic("check")} Ponto do dia batido. Amanhã tem mais.`:`${DES_SERIES}×${R} ${nome.toLowerCase()} · marque cada série ao terminar`}</div>
  </div>`;}
ACT.desSerie=el=>{const t=TODAY(),D=desDados(),i=+el.dataset.i;const S=desSer(D,t).slice();while(S.length<DES_SERIES)S.push(0);
  const antes=desFeito(D,t);S[i]=S[i]?0:1;D.log[t]=S;save(D);const agora=desFeito(D,t);const w=desSemana(t),[k,nome]=DES[w];const fid="fiz_des_"+t;
  if(agora&&!antes){try{navigator.vibrate&&navigator.vibrate([40,60,40]);}catch(e){}save({id:fid,c:"fiz",t:`Desafio: ${DES_SERIES}×${desReps(D,k)} ${nome.toLowerCase()}`,d:t,auto:1});
    const p=desPontosSemana(D,t,w);toast("flame","Ponto do dia batido!",`${p} ${p===1?"ponto":"pontos"} na ${DES[w][2].toLowerCase()}`);}
  if(!agora&&antes&&getD(fid))removeDoc(fid);
  rr();};

VIEWS.des=()=>{const t=TODAY(),D=desDados(),ym=t.slice(0,8),w=desSemana(t),pts=desPontosMes(D,ym),seq=desSeq(D);
  const ult=new Date(+t.slice(0,4),+t.slice(5,7),0).getDate();const passado=addDays(t.slice(0,8)+"01",-1).slice(0,8);const ptsAnt=desPontosMes(D,passado);
  let h=topbar("Semana do desafio","des");
  h+=`<div class="card hero des-hero"><div class="row"><div class="grow"><span class="muted small">${MESES[+t.slice(5,7)-1]} ${t.slice(0,4)}</span><b class="des-big">${pts}<span>/${ult}</span></b><span class="small muted">pontos no mês</span></div>
    <div class="des-mini"><div><b>${seq}</b><span>${seq===1?"dia seguido":"dias seguidos"}</span></div><div><b>${ptsAnt}</b><span>mês passado</span></div></div></div></div>`;
  h+=`<div class="note">${ic("flame")} Cada semana do mês tem um exercício. Faça ${DES_SERIES} séries e marque cada uma: completou as ${DES_SERIES}, bateu o ponto do dia. Dá para fazer em qualquer lugar.</div>`;
  h+=DES.map(([k,nome,titulo,cor],i)=>{const dias=desDiasDaSemana(t,i),p=dias.filter(d=>desFeito(D,d)).length,R=desReps(D,k),atual=i===w,passou=i<w;
    return `<div class="card des-row ${atual?"atual":""}" style="--dc:${cor}"><div class="des-hd"><span class="des-art">${desArt(k)}</span><div class="grow"><b>${titulo}</b><span class="small muted" style="display:block">Dias ${+dias[0].slice(8)} a ${+dias[dias.length-1].slice(8)} · ${DES_SERIES}×${R}</span></div>
      <span class="des-pt">${passou&&p>=5?ic("award"):""}${p}<small>/${dias.length}</small></span></div>
      <div class="des-cal">${dias.map(d=>{const n=desSer(D,d).filter(Boolean).length;return `<span class="${desFeito(D,d)?"on":n?"meio":""} ${d===t?"hj":""} ${d>t?"fut":""}" title="${fdate(d)}">${+d.slice(8)}</span>`;}).join("")}</div>
      ${passou?`<div class="tiny ${p>=5?"des-okt":"faint"}" style="margin-top:6px;font-weight:700">${p>=5?"Semana cumprida.":p?`${p} ${p===1?"dia":"dias"} feitos.`:"Semana sem pontos."}</div>`:""}</div>`;}).join("");
  h+=`<div class="btns"><button class="btn ghost full" data-a="desReps">${ic("repeat")} Ajustar repetições por série</button></div>`;
  return `<div class="app">${h}</div>`;};
ACT.desReps=()=>{const D=desDados();sheet(`<h2>Repetições por série</h2><p class="small muted" style="margin:4px 0 0">O padrão é ${DES_SERIES}×20. Nas barras, se 20 ainda for muito, comece com menos e vá subindo.</p>
  ${DES.map(([k,nome])=>`<label class="fld"><span>${nome}</span><input id="dr_${k}" type="number" inputmode="numeric" min="1" max="200" value="${desReps(D,k)}"></label>`).join("")}
  <div class="btns"><button class="btn full" id="drS">Salvar</button></div>`,s=>{s.querySelector("#drS").onclick=()=>{DES.forEach(([k])=>{const v=parseInt(s.querySelector("#dr_"+k).value,10);D.reps[k]=v>0&&v<=200?v:20;});save(D);closeSheet();rr();};});};

/* ---------- 3. ORÇAMENTOS DO FOTÓGRAFO ---------- */
/* c:"orc" {t, v (R$, opcional), det (o que inclui, prazo, condições), o} · rodapé em single("orc_cfg").rod */
const orcLista=()=>all("orc").sort((a,b)=>(a.o||0)-(b.o||0));
function orcTexto(o){const R=single("orc_cfg",{rod:""}).rod;let m=`📸 *${o.t}*`;if(+o.v>0)m+=`\nValor: ${moneyRaw(+o.v)}`;if(o.det)m+=`\n\n${o.det.trim()}`;if(R)m+=`\n\n${R.trim()}`;return m;}
const _viewFotoOrc=VIEWS.foto;
VIEWS.foto=function(){let h=_viewFotoOrc.apply(this,arguments);if(VIEW.f)return h;const n=orcLista().length;
  const card=`<button class="orc-ent" data-a="go" data-v="${gv({v:"orc"})}"><span class="mb" ${mstyle("foto")}>${ic("receipt-text")}</span><span class="grow"><b>Meus orçamentos</b><span class="small muted" style="display:block">${n?`${n} ${n===1?"serviço":"serviços"} · toque para copiar e mandar ao cliente`:"Guarde seus valores e copie para o cliente"}</span></span>${ic("chevron-right")}</button>`;
  return h.replace("</header>","</header>"+card);};
VIEWS.orc=()=>{const L=orcLista(),C=single("orc_cfg",{rod:""});let h=topbar("Meus orçamentos","foto");
  h+=L.length?L.map(o=>`<div class="item orc-it"><button class="ibody" data-a="orcEd" data-id="${o.id}"><div class="row"><b class="grow">${esc(o.t)}</b>${+o.v>0?`<span class="amt">${moneyRaw(+o.v)}</span>`:""}</div>${o.det?`<p class="orc-det">${esc(o.det)}</p>`:""}</button><button class="btn sm orc-cp" data-a="orcCopiar" data-id="${o.id}" aria-label="Copiar orçamento: ${esc(o.t)}">${ic("copy")} Copiar</button></div>`).join("")
    :empty("foto","Nenhum orçamento ainda","Ex.: Fotos em estúdio, Eventos de capoeira, Ensaio de casal. Cada um com o valor e o que inclui.",`<button class="btn sm" data-a="orcNovo">${ic("plus")} Novo orçamento</button>`);
  if(L.length>1)h+=`<div class="btns"><button class="btn ghost full" data-a="orcTodos">${ic("copy")} Copiar a tabela completa</button></div>`;
  h+=`<div class="card" style="margin-top:14px"><b class="small">Texto final (vai em todos)</b><p class="tiny faint" style="margin:2px 0 6px">Ex.: forma de pagamento, sinal para reservar a data, validade do orçamento.</p><textarea id="orcRod" rows="3" data-in="orcRod" placeholder="Ex.: Reserva da data com 50% via Pix. Orçamento válido por 15 dias.">${esc(C.rod||"")}</textarea></div>`;
  return `<div class="app">${h}</div>${fab("orcNovo","Novo orçamento")}`;};
CH.orcRod=el=>{clearTimeout(el._t);el._t=setTimeout(()=>{const C=single("orc_cfg",{rod:""});C.rod=el.value;save(C);},400);};
ACT.orcNovo=()=>orcForm(null);ACT.orcEd=el=>orcForm(getD(el.dataset.id));
function orcForm(o){sheet(`<h2>${o?"Editar orçamento":"Novo orçamento"}</h2>
  <label class="fld"><span>Serviço</span><input id="orT" value="${esc(o?o.t:"")}" placeholder="Ex.: Fotos em estúdio"></label>
  <label class="fld"><span>Valor (R$, opcional)</span><input id="orV" inputmode="decimal" value="${o&&+o.v>0?String(o.v).replace(".",","):""}" placeholder="Ex.: 250,00"></label>
  <label class="fld"><span>O que inclui, prazo e condições</span><textarea id="orD" rows="6" placeholder="Ex.: 1 hora de estúdio, 20 fotos tratadas, entrega em até 7 dias pelo Google Drive.">${esc(o?o.det||"":"")}</textarea></label>
  <div class="btns"><button class="btn full" id="orS">${o?"Salvar":"Guardar orçamento"}</button>${o?`<button class="btn danger full" id="orX">Apagar</button>`:""}</div>`,s=>{
  s.querySelector("#orS").onclick=()=>{const t=s.querySelector("#orT").value.trim();if(!t)return toast("triangle-alert","Escreva o serviço","");
    const d=o||{id:"orc_"+nid(),c:"orc",o:Date.now()};d.t=t;d.v=num(s.querySelector("#orV").value)||0;d.det=s.querySelector("#orD").value.trim();save(d);closeSheet();rr();};
  const x=s.querySelector("#orX");if(x)x.onclick=()=>confirmSheet("Apagar este orçamento?",o.t,"Apagar",()=>{removeDoc(o.id);rr();});});}
ACT.orcCopiar=async el=>{const o=getD(el.dataset.id);if(!o)return;const ok=await eddCopiar(orcTexto(o));toast(ok?"copy":"triangle-alert",ok?"Orçamento copiado":"Não deu para copiar",ok?o.t+" · é só colar para o cliente":"");};
ACT.orcTodos=async()=>{const L=orcLista(),R=single("orc_cfg",{rod:""}).rod;
  const txt=L.map(o=>{let m=`📸 *${o.t}*`;if(+o.v>0)m+=` · ${moneyRaw(+o.v)}`;if(o.det)m+=`\n${o.det.trim()}`;return m;}).join("\n\n")+(R?`\n\n${R.trim()}`:"");
  const ok=await eddCopiar(txt);toast(ok?"copy":"triangle-alert",ok?"Tabela copiada":"Não deu para copiar",ok?`${L.length} serviços`:"");};

/* ---------- 4. GASTO POR FOTO: mais rápido e em segundo plano ---------- */
/* imagem menor para a IA (sobe mais rápido) e leitor de texto guardado entre usos */
async function gfB64(file){const im=await loadBitmap(file);const s=Math.min(1,1400/Math.max(im.width,im.height));const c=document.createElement("canvas");c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);
  c.getContext("2d").drawImage(im,0,0,c.width,c.height);return c.toDataURL("image/jpeg",.8).split(",")[1];}
let GF_OCR=null;
async function gfOcrWorker(){if(GF_OCR)return GF_OCR;if(!window.Tesseract)await loadScript("https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js");
  GF_OCR=await Tesseract.createWorker("por",1,{langPath:"https://cdn.jsdelivr.net/npm/@tesseract.js-data/por@1.0.0/4.0.0_best_int",gzip:true});return GF_OCR;}
async function gfLer(file,msg){const pP=processImage(file).catch(()=>null);let r=null,via="",motivo="";
  const ia=temIA();if(!ia)gfOcrWorker().catch(()=>{}); /* sem IA: já começa a preparar o leitor de texto */
  if(ia){try{const b64=await gfB64(file);const txt=await Promise.race([aiGenerate([{text:COMP_PROMPT()},{inlineData:{mimeType:"image/jpeg",data:b64}}],{max:600}),new Promise((_,j)=>setTimeout(()=>j(new Error("tempo")),25000))]);
      const j=JSON.parse(String(txt).replace(/```json|```/g,"").trim());const v=typeof j.valor==="string"?num(j.valor):+j.valor;
      r={valor:v>0?Math.round(v*100)/100:0,descricao:String(j.descricao||""),data:String(j.data||""),forma:String(j.forma||""),categoria:String(j.categoria||""),itens:Array.isArray(j.itens)?j.itens.slice(0,5):[]};via="ia";
      if(!(r.valor>0))motivo="A IA não encontrou um valor nesta imagem.";}
    catch(e){console.warn("comprovante IA",e);motivo=(e&&e.amigavel)||(/tempo/.test(String(e&&e.message))?"A IA demorou demais para responder.":"A IA não conseguiu ler a imagem.");}}
  if(!r||!(r.valor>0)){msg("Lendo o texto da imagem…");
    try{const w=await gfOcrWorker();const out=await w.recognize(await ocrPreparar(file));const o=ocrParse(out.data.text||"");if(o.valor>0||!r){r=o;via="ocr";}}catch(e){console.warn("ocr",e);r=r||{};}}
  return{p:await pP,r:r||{},via,motivo};}
let GFB=null; /* leitura em andamento: {st:"lendo"|"ok"|"falha", id, v} */
function gfLendoSheet(){sheet(`<div id="gfLendo"><h2>${ic("scan-line")} Lendo o comprovante…</h2><p class="muted small" id="gfMsg">${temIA()?"A IA está lendo valor, local, data e forma de pagamento.":"Lendo o texto da imagem…"}</p><div class="gf-load"><i></i></div>
  <button class="btn ghost full" style="margin-top:16px" data-a="gfOcultar">${ic("eye-off")} Ocultar e continuar usando o app</button><p class="tiny faint" style="text-align:center;margin:8px 0 0">O gasto é salvo sozinho quando terminar. Você confere ou altera depois.</p></div>`);}
ACT.gFoto=async()=>{if(GFB&&GFB.st==="lendo"){gfLendoSheet();return;}const f=await pickFiles(false);if(!f.length)return;const file=f[0];
  GFB={st:"lendo"};gfLendoSheet();
  const res=await gfLer(file,t=>{const m=$("gfMsg");if(m)m.textContent=t;});GFOTO=res;
  if($("gfLendo")){GFB=null;gfPill();gFotoForm();return;}   /* ainda olhando a tela: mostra para conferir */
  await gfSalvarSozinho(res);};
ACT.gfOcultar=()=>{closeSheet();gfPill();toast("eye-off","Lendo em segundo plano","Avisamos quando o gasto for salvo.");};
async function gfSalvarSozinho(res){const r=res.r||{};
  if(!(+r.valor>0)){GFB={st:"falha"};gfPill();return;}
  const desc=gNiceItem(r.descricao||"")||"Gasto";const pag=["Pix","Cartão","Débito","Dinheiro"].includes(r.forma)?r.forma:lastPag();
  const cat=r.categoria&&CATS.some(c=>c[0]===r.categoria)?r.categoria:gCat(desc);const d=/^\d{4}-\d{2}-\d{2}$/.test(r.data||"")&&r.data<=TODAY()?r.data:TODAY();
  let img=null;try{if(res.p)img=await storeImage(res.p);}catch(e){}
  const id="exp_"+nid();save({id,c:"exp",v:+r.valor,desc,cat,pag,d,img});GFOTO=null;GFB={st:"ok",id,v:+r.valor,desc};gfPill();rr();
  try{navigator.vibrate&&navigator.vibrate(40);}catch(e){}
  clearTimeout(gfSalvarSozinho._t);gfSalvarSozinho._t=setTimeout(()=>{if(GFB&&GFB.st==="ok"&&GFB.id===id){GFB=null;gfPill();}},12000);}
/* aviso discreto no rodapé enquanto lê e quando termina */
function gfPill(){let el=$("gfpill");if(!GFB){if(el)el.remove();return;}
  if(!el){el=document.createElement("button");el.id="gfpill";el.className="gfpill";document.body.appendChild(el);el.addEventListener("click",gfPillToque);}
  el.className="gfpill "+GFB.st;
  el.innerHTML=GFB.st==="lendo"?`${ic("loader","gfspin")}<span>Lendo comprovante…</span>`
    :GFB.st==="ok"?`${ic("check")}<span>Gasto salvo · <b>${moneyRaw(GFB.v)}</b></span><em>Conferir</em>`
    :`${ic("triangle-alert")}<span>Não li o valor</span><em>Preencher</em>`;}
function gfPillToque(){if(!GFB)return;const st=GFB.st;
  if(st==="lendo"){gfLendoSheet();return;}
  if(st==="ok"){const e=getD(GFB.id);GFB=null;gfPill();if(e)gForm(e);return;}
  if(st==="falha"){GFB=null;gfPill();if(GFOTO)gFotoForm();}}
