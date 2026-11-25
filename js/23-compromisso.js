"use strict";
/* ======================================================================
   CONTRATOS DE COMPROMISSO · meta com prazo e uma consequência real se não cumprir
   Ter algo a perder, e alguém que cobra, aumenta muito a chance de cumprir.
   Dados: c:"cmp" {meta,crit,prazo,cons,valor,test,st:"ativo"|"ok"|"falhou",pago,fimEm}
   ====================================================================== */
MODS.cmp={n:"Contratos de compromisso",ic:"handshake",c1:"#B45309",c2:"#F59E0B",g:3,v:{v:"cmp"}};
const CMP_F=[{k:"meta",l:"Eu me comprometo a",auto:1,ph:"Ex.: Enviar 3 projetos para editais"},
  {k:"crit",l:"Como vou provar que cumpri",ph:"Ex.: 3 comprovantes de inscrição"},{k:"prazo",l:"Prazo",type:"date"},
  {k:"cons",l:"Se eu não cumprir, eu vou",ph:"Ex.: Doar R$ 50 para uma causa que eu não apoio"},{k:"valor",l:"Valor em jogo (opcional)",type:"money"},
  {k:"test",l:"Testemunha: quem vai cobrar você (opcional)",ph:"Ex.: Rafa, meu parceiro de treino"}];
const cmpVencidos=()=>all("cmp").filter(c=>c.st==="ativo"&&c.prazo&&c.prazo<TODAY());
const cmpPendentes=()=>all("cmp").filter(c=>c.st==="falhou"&&!c.pago);
function cmpTexto(c){return `Compromisso assinado: ${c.meta}.\nPrazo: ${fdate(c.prazo)}.${c.crit?"\nProva: "+c.crit+".":""}\nSe eu não cumprir: ${c.cons}${c.valor?" ("+moneyRaw(c.valor)+")":""}.\n${c.test?c.test.split(/[ ,]/)[0]+", você":"Você"} é minha testemunha. Me cobre!`;}
async function cmpCompartilhar(c){const txt=cmpTexto(c);try{if(navigator.share){await navigator.share({text:txt});return;}}catch(e){if(e&&e.name==="AbortError")return;}
  window.open("https://wa.me/?text="+encodeURIComponent(txt),"_blank","noopener");}

function cmpCard(c){const n=diasAte(c.prazo),venc=n<0;
  return `<div class="card cmpc ${venc?"venc":""}" style="margin-bottom:10px"><div class="row"><b class="grow" style="font:800 1.02rem/1.3 var(--disp)">${esc(c.meta)}</b><button class="ib" data-a="cmpEdit" data-id="${c.id}" aria-label="Editar">${ic("pencil")}</button></div>
   <div class="meta" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"><span class="chip ${venc?"n":n<=3?"a":""}">${venc?"prazo vencido":n===0?"prazo hoje":"faltam "+n+(n===1?" dia":" dias")}</span><span class="chip">${fdate(c.prazo)}</span>${c.test?`<span class="chip">${ic("eye")} ${esc(c.test.split(/[ ,]/)[0])}</span>`:""}</div>
   ${c.crit?`<div class="small" style="margin-top:8px"><b>Prova:</b> ${esc(c.crit)}</div>`:""}
   <div class="small muted" style="margin-top:4px"><b>Se falhar:</b> ${esc(c.cons)}${c.valor?" · "+money(c.valor):""}</div>
   ${venc?`<div class="btns h" style="margin-top:12px"><button class="btn sm" data-a="cmpOk" data-id="${c.id}">${ic("check")} Cumpri</button><button class="btn danger sm" data-a="cmpFalhei" data-id="${c.id}">Não cumpri</button></div>`
     :c.test?`<button class="lk small" style="margin-top:10px" data-a="cmpShare" data-id="${c.id}">${ic("send")} Enviar para a testemunha</button>`:""}</div>`;}

VIEWS.cmp=()=>{const L=all("cmp");let h=topbar("Compromissos","cmp");
  if(!L.length)return `<div class="app">${h}${empty("cmp","Coloque algo em jogo","Uma meta com prazo, uma prova de que cumpriu e uma consequência real se falhar. Quem tem algo a perder age.",`<button class="btn sm" data-a="cmpNovo">${ic("plus")} Assinar um compromisso</button>`)}</div>`;
  const fech=L.filter(c=>c.st!=="ativo"),ok=fech.filter(c=>c.st==="ok").length;
  if(fech.length){const p=Math.round(ok/fech.length*100);h+=`<div class="hero row" style="margin-bottom:6px"><div class="ring" style="--p:${p}"><b>${p}%</b></div><div><h2>${ok} de ${fech.length}</h2><div class="muted small">compromissos cumpridos</div></div></div>`;}
  const pend=cmpPendentes();
  if(pend.length)h+=`<div class="grp">Consequência a pagar<span class="chip">${pend.length}</span></div>`+pend.map(c=>`<div class="item"><span class="mb" style="background:var(--no)">${ic("scale")}</span><div class="ibody"><b>${esc(c.cons)}${c.valor?" · "+money(c.valor):""}</b><span class="tiny faint">Não cumpri: ${esc(c.meta)}</span></div><button class="btn sm" data-a="cmpPaguei" data-id="${c.id}">Paguei</button></div>`).join("");
  const at=L.filter(c=>c.st==="ativo").sort((a,b)=>(a.prazo||"").localeCompare(b.prazo||""));
  if(at.length)h+=`<div class="grp">Em andamento<span class="chip">${at.length}</span></div>`+at.map(cmpCard).join("");
  const enc=fech.filter(c=>c.st==="ok"||c.pago).sort((a,b)=>(b.fimEm||"").localeCompare(a.fimEm||""));
  if(enc.length)h+=`<details class="card" style="margin-top:16px"><summary><b>Encerrados</b> <span class="chip">${enc.length}</span></summary>${enc.map(c=>`<div class="mit"><span class="ck ${c.st==="ok"?"on":""}" aria-hidden="true">${ic(c.st==="ok"?"check":"x")}</span><span class="grow ${c.st==="ok"?"":"muted"}">${esc(c.meta)}<span class="tiny faint" style="display:block">${c.st==="ok"?"Cumprido":"Consequência paga"} · ${fdate(c.fimEm||c.prazo)}</span></span></div>`).join("")}</details>`;
  return `<div class="app">${h}</div>${fab("cmpNovo","Novo compromisso")}`;};

ACT.cmpNovo=()=>cmpForm(null);
ACT.cmpEdit=el=>cmpForm(getD(el.dataset.id));
ACT.cmpShare=el=>cmpCompartilhar(getD(el.dataset.id));
ACT.cmpOk=el=>{const c=getD(el.dataset.id);c.st="ok";c.fimEm=TODAY();save(c);rr();toast("trophy","Compromisso cumprido!","Palavra dada, palavra cumprida.");};
ACT.cmpFalhei=el=>{const c=getD(el.dataset.id);confirmSheet("Não cumpriu?","O acordo era: "+c.cons+". Ele fica em “Consequência a pagar” até você pagar.","Registrar",()=>{c.st="falhou";c.pago=false;c.fimEm=TODAY();save(c);rr();});};
ACT.cmpPaguei=el=>{const c=getD(el.dataset.id);c.pago=true;c.pagoEm=TODAY();save(c);rr();toast("scale","Consequência paga","Acordo honrado. Use a lição no próximo compromisso.");};
function cmpForm(c){sheet(`<h2>${c?"Editar compromisso":"Novo compromisso"}</h2>${c?"":`<p class="muted small" style="margin:4px 0 0">Escolha uma consequência que doa de verdade, mas que você pagaria.</p>`}${CMP_F.map(f=>fieldHTML(f,c?c[f.k]:(f.k==="prazo"?addDays(TODAY(),30):null))).join("")}
   <div class="btns"><button class="btn full" id="cpS">${ic("handshake")} ${c?"Salvar":"Assinar compromisso"}</button>${c?`<button class="btn danger full" id="cpX">Apagar</button>`:""}</div>`,s=>{
  s.querySelector("#cpS").onclick=()=>{const o=readFields(CMP_F,s);if(!o.meta)return toast("triangle-alert","Escreva o compromisso","");if(!o.prazo)return toast("triangle-alert","Escolha o prazo","");
    if(!o.cons)return toast("triangle-alert","Defina a consequência","Sem algo em jogo, é só uma meta.");if(!c&&o.prazo<TODAY())return toast("triangle-alert","O prazo já passou","Escolha uma data a partir de hoje.");
    const d=c||{id:"cmp_"+nid(),c:"cmp",st:"ativo",criado:TODAY()};Object.assign(d,o);save(d);rr();
    if(c||!d.test){closeSheet();if(!c)toast("handshake","Compromisso assinado","Prazo: "+fdate(d.prazo));return;}
    sheet(`<h2>${ic("handshake")} Compromisso assinado</h2><p class="muted">Agora conte para ${esc(d.test.split(/[ ,]/)[0])}. Saber que alguém vai cobrar faz diferença.</p><div class="mict" style="text-align:left">${esc(cmpTexto(d))}</div>
      <div class="btns"><button class="btn full" id="cpSh">${ic("send")} Enviar para ${esc(d.test.split(/[ ,]/)[0])}</button><button class="btn ghost full" data-a="close">Depois</button></div>`,s2=>{s2.querySelector("#cpSh").onclick=()=>{cmpCompartilhar(d);closeSheet();};});};
  const x=s.querySelector("#cpX");if(x)x.onclick=()=>confirmSheet("Apagar este compromisso?",c.meta,"Apagar",()=>{removeDoc(c.id);rr();});});}

/* Montanha: compromisso cumprido vale 5 passos */
const _passosCmp=passos;passos=function(desde){const r=_passosCmp(desde);const de=desde||"0000",t=TODAY();
  all("cmp").forEach(c=>{if(c.st==="ok"&&c.fimEm&&c.fimEm>=de){r.tot+=5;if(c.fimEm===t)r.hoje+=5;}});return r;};
