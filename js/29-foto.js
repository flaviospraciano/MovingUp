"use strict";
/* ======================================================================
   ESPAÇO DO FOTÓGRAFO · checklist de fotos por pasta e mover fotos entre pastas
   · Checklist: cole a lista (uma foto por linha). Linhas que terminam com ":" viram títulos de seção.
     Dá para salvar como modelo e reaproveitar em outro casal.
   · Mover: "Selecionar" na grade de fotos, escolha as fotos e mande para outra pasta.
   ====================================================================== */
const FSEL={on:false,f:null,ids:new Set()},FORD={on:false,f:null};
const CHK_LIMPA=/^\s*(?:[-*•▪◦·–—]|\d+\s*[.)-]|\[\s*[xX✓]?\s*\]|[☐☑✅✔🔲⬜🟩📷📸]|\(\s*\))\s*/u;
function chkParse(txt){return String(txt||"").split(/\r?\n/).map(l=>{const ok=/^\s*(?:\[\s*[xX✓]\s*\]|[☑✅✔])/.test(l);const t=l.replace(CHK_LIMPA,"").replace(CHK_LIMPA,"").trim();
    if(!t)return null;const h=/:\s*$/.test(t)&&t.length<60;return{id:nid(),t:h?t.replace(/:\s*$/,""):t,ok:!h&&ok,h};}).filter(Boolean);}
const chkItens=F=>(F&&F.chk)||[];
function chkHTML(F){const L=chkItens(F);
  if(!L.length)return `<div class="wrap-row" style="margin:6px 0 2px"><button class="chip m" style="padding:8px 12px" data-a="fchkColar">${ic("clipboard-list")} Colar checklist de fotos</button>${all("fchkm").length?`<button class="chip m" style="padding:8px 12px" data-a="fchkModelos">${ic("list-checks")} Usar checklist pronto</button>`:""}</div>`;
  const it=L.filter(x=>!x.h),ok=it.filter(x=>x.ok).length,pct=it.length?Math.round(ok/it.length*100):0;
  return `<details class="card fchk" ${ok<it.length?"open":""} style="margin:8px 0 4px"><summary><span class="mb" style="width:30px;height:30px;border-radius:9px">${ic("clipboard-list")}</span><b class="grow">Checklist de fotos</b><span class="chip ${ok===it.length?"c":""}">${ok}/${it.length}</span></summary>
    <div class="bar" style="margin:10px 0 6px"><i style="width:${pct}%"></i></div>
    ${L.map((x,i)=>x.h?`<div class="grp" style="margin:12px 0 4px">${esc(x.t)}</div>`:`<button class="mit fchki" data-a="fchkT" data-i="${i}"><span class="ck ${x.ok?"on":""}">${ic("check")}</span><span class="${x.ok?"strike muted":""}">${esc(x.t)}</span></button>`).join("")}
    <div class="wrap-row" style="margin-top:12px"><button class="btn ghost sm" data-a="fchkColar">${ic("clipboard-list")} Colar mais</button><button class="btn ghost sm" data-a="fchkModelos">${ic("list-checks")} Modelos</button><button class="btn ghost sm" data-a="fchkMenu">${ic("ellipsis-vertical")} Mais</button></div></details>`;}
ACT.fchkT=el=>{const F=getD(VIEW.f);if(!F)return;const x=F.chk[+el.dataset.i];if(!x)return;x.ok=!x.ok;save(F);
  const ck=el.querySelector(".ck"),tx=el.querySelector("span:last-child");if(ck)ck.classList.toggle("on",x.ok);if(tx){tx.classList.toggle("strike",x.ok);tx.classList.toggle("muted",x.ok);}
  const it=F.chk.filter(z=>!z.h),ok=it.filter(z=>z.ok).length,d=el.closest("details");if(d){const c=d.querySelector("summary .chip");if(c){c.textContent=ok+"/"+it.length;c.classList.toggle("c",ok===it.length);}const b=d.querySelector(".bar i");if(b)b.style.width=(it.length?ok/it.length*100:0)+"%";}
  if(ok===it.length&&x.ok)toast("party-popper","Checklist completo!",F.nome);};
ACT.fchkColar=()=>{const F=getD(VIEW.f);if(!F)return;const tem=chkItens(F).length;
  sheet(`<h2>Colar checklist</h2><p class="muted small" style="margin:4px 0 0">Uma foto por linha. Marcadores como “-”, “1.” ou “☐” são limpos sozinhos. Linhas que terminam com “:” viram títulos (ex.: <i>Making of:</i>).</p>
   <label class="fld"><span>Lista de fotos</span><textarea id="chT" class="tall" placeholder="Making of:&#10;Detalhes do vestido&#10;Sapatos e alianças&#10;Cerimônia:&#10;Entrada do noivo&#10;Troca das alianças"></textarea></label>
   ${tem?`<div class="fld"><span>O que fazer com a lista atual</span><div class="seg" data-k="chM"><button type="button" data-a="seg" data-v="add" aria-pressed="true">Adicionar ao fim</button><button type="button" data-a="seg" data-v="sub" aria-pressed="false">Substituir</button></div></div>`:""}
   <label class="fld" style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="chS" style="width:auto"> <span style="margin:0">Salvar também como modelo para outros casais</span></label>
   <div class="btns"><button class="btn full" id="chOk">${ic("check")} Usar este checklist</button></div>`,s=>{
   s.querySelector("#chOk").onclick=()=>{const L=chkParse(s.querySelector("#chT").value);if(!L.length)return toast("triangle-alert","Cole a lista primeiro","");
     F.chk=(tem&&segVal(s,"chM")==="sub")?L:chkItens(F).concat(L);save(F);
     if(s.querySelector("#chS").checked)save({id:"fchkm_"+nid(),c:"fchkm",nome:F.nome,itens:L.map(x=>({t:x.t,h:!!x.h}))});
     closeSheet();rr();toast("clipboard-list","Checklist pronto",L.filter(x=>!x.h).length+" fotos na lista");};});};
ACT.fchkModelos=()=>{const M=all("fchkm").sort((a,b)=>(a.nome||"").localeCompare(b.nome||""));
  sheet(`<h2>Checklists prontos</h2><p class="muted small" style="margin:4px 0 0">Aplique um modelo nesta pasta ou cadastre um novo colando a lista.</p>
   ${M.length?M.map(m=>`<div class="item"><span class="mb">${ic("clipboard-list")}</span><button class="ibody" data-a="fchkAplicar" data-id="${m.id}"><b>${esc(m.nome)}</b><span class="tiny faint">${m.itens.filter(x=>!x.h).length} fotos · toque para usar aqui</span></button><button class="ib" data-a="fchkModDel" data-id="${m.id}" aria-label="Apagar modelo">${ic("trash-2")}</button></div>`).join(""):`<div class="note">Nenhum modelo ainda.</div>`}
   <div class="btns"><button class="btn ghost full" data-a="fchkModNovo">${ic("plus")} Novo modelo (colar lista)</button></div>`);};
ACT.fchkAplicar=el=>{const F=getD(VIEW.f),m=getD(el.dataset.id);if(!F||!m)return;const L=m.itens.map(x=>({id:nid(),t:x.t,h:!!x.h,ok:false}));
  const go=sub=>{F.chk=sub?L:chkItens(F).concat(L);save(F);closeSheet();rr();toast("clipboard-list","Checklist aplicado",m.nome);};
  if(!chkItens(F).length)return go(true);
  sheet(`<h2>Aplicar “${esc(m.nome)}”</h2><p class="muted">Esta pasta já tem um checklist.</p><div class="btns"><button class="btn full" id="a1">Adicionar ao fim</button><button class="btn ghost full" id="a2">Substituir o atual</button></div>`,s=>{s.querySelector("#a1").onclick=()=>go(false);s.querySelector("#a2").onclick=()=>go(true);});};
ACT.fchkModNovo=()=>{sheet(`<h2>Novo modelo</h2><label class="fld"><span>Nome do modelo</span><input id="mdN" placeholder="Ex.: Casamento completo"></label><label class="fld"><span>Lista de fotos</span><textarea id="mdT" class="tall" placeholder="Uma foto por linha"></textarea></label><div class="btns"><button class="btn full" id="mdOk">Salvar modelo</button></div>`,s=>{
  s.querySelector("#mdOk").onclick=()=>{const n=s.querySelector("#mdN").value.trim(),L=chkParse(s.querySelector("#mdT").value);if(!n||!L.length)return toast("triangle-alert","Dê um nome e cole a lista","");
    save({id:"fchkm_"+nid(),c:"fchkm",nome:n,itens:L.map(x=>({t:x.t,h:!!x.h}))});toast("check","Modelo salvo",n);ACT.fchkModelos();};});};
ACT.fchkModDel=el=>{const m=getD(el.dataset.id);confirmSheet("Apagar o modelo?",m.nome,"Apagar",()=>{removeDoc(m.id);ACT.fchkModelos();});};
ACT.fchkMenu=()=>{const F=getD(VIEW.f);sheet(`<h2>Checklist de fotos</h2><div class="btns"><button class="btn ghost full" id="m1">${ic("rotate-ccw")} Desmarcar tudo</button><button class="btn ghost full" id="m2">${ic("pencil")} Editar a lista</button><button class="btn ghost full" id="m3">${ic("list-checks")} Salvar como modelo</button><button class="btn danger full" id="m4">${ic("trash-2")} Apagar checklist</button></div>`,s=>{
  s.querySelector("#m1").onclick=()=>{F.chk.forEach(x=>x.ok=false);save(F);closeSheet();rr();};
  s.querySelector("#m2").onclick=()=>{sheet(`<h2>Editar checklist</h2><p class="muted small" style="margin:4px 0 0">Itens marcados começam com [x].</p><label class="fld"><span>Lista</span><textarea id="edT" class="tall">${esc(F.chk.map(x=>x.h?x.t+":":(x.ok?"[x] ":"")+x.t).join("\n"))}</textarea></label><div class="btns"><button class="btn full" id="edOk">Salvar</button></div>`,s2=>{
    s2.querySelector("#edOk").onclick=()=>{F.chk=chkParse(s2.querySelector("#edT").value);save(F);closeSheet();rr();};});};
  s.querySelector("#m3").onclick=()=>{save({id:"fchkm_"+nid(),c:"fchkm",nome:F.nome,itens:F.chk.map(x=>({t:x.t,h:!!x.h}))});closeSheet();toast("check","Modelo salvo",F.nome);};
  s.querySelector("#m4").onclick=()=>confirmSheet("Apagar o checklist desta pasta?","As fotos não são afetadas.","Apagar",()=>{F.chk=[];save(F);rr();});});};

/* ---------- selecionar e mover fotos ---------- */
const _fotoView=VIEWS.foto;VIEWS.foto=function(){let h=_fotoView.apply(this,arguments);const fid=VIEW.f||"";if(!fid)return h;const F=getD(fid);if(!F)return h;
  if(FSEL.f!==fid){FSEL.on=false;FSEL.ids.clear();FSEL.f=fid;}
  const mk='<div class="sec" style="margin-top:8px"><h2>Pastas</h2>';const i=h.indexOf(mk);if(i>=0)h=h.slice(0,i)+chkHTML(F)+h.slice(i);
  const ph=photosIn(fid);
  if(ph.length&&FORD.on&&FORD.f===fid){h=h.replace(/(<div class="sec"><h2>Fotos<\/h2><span class="chip">\d+<\/span>)/,`$1<button class="lk small" data-a="phOrdOff">Concluir</button>`);
    h=h.replace(/data-a="phOpen" data-i="(\d+)"([^>]*)>/g,(m,n,r)=>`data-pid="${ph[+n].id}" class="phord"${r}><span class="phn">${+n+1}</span>`);
    h=h.replace('<div class="pgrid" id="pgrid"',`<div class="note" style="margin-bottom:8px">${ic("arrow-right-left")} Segure uma foto e arraste para a nova posição. A ordem é salva na hora.</div><div class="pgrid" id="pgrid"`);
    setTimeout(phOrdAtivar,0);return h;}
  if(FORD.f!==fid)FORD.on=false;
  if(ph.length){h=h.replace(/(<div class="sec"><h2>Fotos<\/h2><span class="chip">\d+<\/span>)/,FSEL.on?`$1<button class="lk small" data-a="phSelOff">Cancelar</button>`:`$1<button class="lk small" data-a="phSelOn">Selecionar</button>${ph.length>1?`<button class="lk small" data-a="phOrdOn">Ordenar</button>`:""}`);
    if(FSEL.on){h=h.replace(/data-a="phOpen" data-i="(\d+)"/g,(m,n)=>`data-a="phSel" data-i="${n}" class="${FSEL.ids.has(ph[+n].id)?"psel":""}"`);
      h+=`<div class="selbar"><b>${FSEL.ids.size} ${FSEL.ids.size===1?"foto":"fotos"}</b><button class="btn ghost sm" data-a="phSelAll">${FSEL.ids.size===ph.length?"Nenhuma":"Todas"}</button><button class="btn sm" data-a="phMover" ${FSEL.ids.size?"":"disabled"}>${ic("folder-input")} Mover</button></div>`;}}
  return h;};
ACT.phSelOn=()=>{FSEL.on=true;FSEL.ids.clear();FSEL.f=VIEW.f;rr();};
ACT.phSelOff=()=>{FSEL.on=false;FSEL.ids.clear();rr();};
ACT.phSel=el=>{const p=photosIn(VIEW.f)[+el.dataset.i];if(!p)return;if(FSEL.ids.has(p.id))FSEL.ids.delete(p.id);else FSEL.ids.add(p.id);el.classList.toggle("psel",FSEL.ids.has(p.id));
  const b=document.querySelector(".selbar b"),m=document.querySelector('.selbar [data-a="phMover"]');if(b)b.textContent=FSEL.ids.size+(FSEL.ids.size===1?" foto":" fotos");if(m)m.disabled=!FSEL.ids.size;};
ACT.phSelAll=()=>{const ph=photosIn(VIEW.f);if(FSEL.ids.size===ph.length)FSEL.ids.clear();else ph.forEach(p=>FSEL.ids.add(p.id));rr();};
ACT.phMover=()=>{const n=FSEL.ids.size;if(!n)return;const opts=folderOptions([]).filter(o=>o[0]!==VIEW.f);
  sheet(`<h2>Mover ${n} ${n===1?"foto":"fotos"}</h2><p class="muted small">Escolha a pasta de destino.</p><div class="btns">${opts.map(o=>`<button class="btn ghost full" style="justify-content:flex-start;padding-left:${14+o[2]*18}px" data-a="phMoverPara" data-to="${o[0]}">${ic("folder")} ${esc(o[1])}</button>`).join("")||`<div class="note">Crie outra pasta primeiro.</div>`}</div>`);};
ACT.phMoverPara=el=>{const to=el.dataset.to,D=getD(to);let k=0;const base=Date.now();FSEL.ids.forEach(id=>{const p=getD(id);if(p){p.f=to;p.at=base+k++;save(p);}});
  FSEL.on=false;FSEL.ids.clear();closeSheet();rr();toast("folder-input",k+(k===1?" foto movida":" fotos movidas"),D?D.nome:"");};

/* ---------- mudar a ordem das fotos dentro da pasta (arrastar) ---------- */
ACT.phOrdOn=()=>{FSEL.on=false;FSEL.ids.clear();FORD.on=true;FORD.f=VIEW.f;rr();};
ACT.phOrdOff=()=>{FORD.on=false;rr();toast("check","Ordem das fotos salva","");};
async function phOrdAtivar(){const g=$("pgrid");if(!g||g.dataset.ord)return;g.dataset.ord="1";
  try{const S=await getSortable();if(!g.isConnected)return;
    S.create(g,{draggable:".phord",animation:170,delay:140,delayOnTouchOnly:true,ghostClass:"sg",chosenClass:"sc",scroll:true,scrollSensitivity:110,scrollSpeed:16,
      onEnd:ev=>{if(ev.oldIndex===ev.newIndex)return;const ids=qa(".phord",g).map(b=>b.dataset.pid),base=Date.now();
        ids.forEach((id,k)=>{const p=getD(id);if(p&&p.at!==base+k){p.at=base+k;save(p);}});
        qa(".phord .phn",g).forEach((n,k)=>{n.textContent=k+1;});}});}
  catch(e){console.warn(e);toast("triangle-alert","Não consegui ativar o arrastar","Confira a internet e tente de novo.");}}
