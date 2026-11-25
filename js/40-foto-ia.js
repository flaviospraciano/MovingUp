"use strict";
/* ======================================================================
   ESPAÇO DO FOTÓGRAFO · ORGANIZAR COM IA
   A IA olha cada foto (em miniatura) e sugere a pasta certa do álbum.
   Nada é movido antes de você conferir. Depois de aplicar, dá para desfazer.
   ====================================================================== */
const FIA_PADRAO=[
 ["Making of","preparação antes da cerimônia: noiva ou noivo se arrumando, maquiagem, cabelo, vestindo o vestido ou o terno, quarto de hotel ou casa, objetos da preparação (vestido pendurado, sapatos, perfume, alianças na caixa, buquê antes de sair)"],
 ["Noivo","fotos em que o foco é o noivo já pronto: retratos dele, sozinho ou com padrinhos dele, esperando no altar antes da noiva chegar"],
 ["Noiva","fotos em que o foco é a noiva já pronta: retratos dela, chegada da noiva, entrada no carro, sozinha ou com as madrinhas"],
 ["Cerimônia","durante a cerimônia: entrada dos noivos e cortejo, altar, celebrante ou padre, votos, troca de alianças, beijo, convidados assistindo sentados"],
 ["Pós-cerimônia (igreja)","logo depois da cerimônia, ainda na igreja ou no local da cerimônia: saída dos noivos, chuva de arroz ou pétalas, cumprimentos, fotos posadas no altar ou na porta da igreja"],
 ["Mesa do bolo","bolo, mesa de doces e bem-casados, decoração da mesa principal, corte do bolo, fotos dos noivos ou convidados junto à mesa do bolo"],
 ["Festa","recepção e festa: pista de dança, brindes, buffet, convidados se divertindo, música, valsa, lançamento do buquê"],
 ["Família e padrinhos","fotos posadas em grupo com familiares, pais, avós, padrinhos e madrinhas"],
 ["Casal","ensaio do casal: retratos românticos dos dois juntos, fora da cerimônia"],
 ["Detalhes","objetos e decoração em close: alianças, convite, arranjos de flores, lembrancinhas, placas, ambientação vazia"]];
const FIA_SINON=[[/making|prepar|camarim/,"Making of"],[/noivo/,"Noivo"],[/noiva/,"Noiva"],[/p[oó]s|depois|sa[ií]da|igreja/,"Pós-cerimônia (igreja)"],[/cerim|altar|votos/,"Cerimônia"],[/bolo|doce/,"Mesa do bolo"],
  [/festa|recep|pista|balada/,"Festa"],[/fam[ií]lia|padrinh|madrinh|convidad/,"Família e padrinhos"],[/casal|ensaio|pre ?wedding/,"Casal"],[/detalh|decor/,"Detalhes"]];
function fiaDesc(nome){const n=nome.toLowerCase();const s=FIA_SINON.find(([re])=>re.test(n));const p=s&&FIA_PADRAO.find(x=>x[0]===s[1]);return p?p[1]:"";}
function fiaRaiz(fid){const F=getD(fid);if(!F)return null;if(folders(fid).length||!F.par)return F;return getD(F.par)||F;}
const FIA={on:false,stop:false,root:null,dest:[],fotos:[],res:{},feito:0,undo:null,erro:""};

/* ---------- botão na pasta ---------- */
const _fotoViewIA=VIEWS.foto;VIEWS.foto=function(){let h=_fotoViewIA.apply(this,arguments);const fid=VIEW.f||"";if(!fid||FSEL.on||FORD.on)return h;const R=fiaRaiz(fid);if(!R)return h;
  const tot=descend(R.id).reduce((n,id)=>n+photosIn(id).length,0);if(!tot)return h;
  const bar=FIA.on&&FIA.root===R.id?`<button class="fiabar on" data-a="fiaVer">${ic("hourglass")}<span class="grow"><b>Organizando com IA…</b><span class="tiny">${FIA.feito} de ${FIA.fotos.length} fotos analisadas</span></span>${ic("chevron-right")}</button>`
    :FIA.root===R.id&&Object.keys(FIA.res).length&&!FIA.on?`<button class="fiabar" data-a="fiaRev">${ic("wand-sparkles")}<span class="grow"><b>Sugestões prontas para conferir</b><span class="tiny">Toque para revisar e mover</span></span>${ic("chevron-right")}</button>`
    :`<button class="fiabar" data-a="fiaAbrir">${ic("wand-sparkles")}<span class="grow"><b>Organizar com IA</b><span class="tiny">A IA separa as fotos de “${esc(R.nome)}” nas pastas certas</span></span>${ic("chevron-right")}</button>`;
  const mk='<div class="crumbs">';const i=h.indexOf(mk);return i<0?h:h.slice(0,i)+bar+h.slice(i);};

/* ---------- 1. escolher pastas e fotos ---------- */
ACT.fiaAbrir=()=>{if(!temIA())return sheet(`<h2>${ic("wand-sparkles")} Organizar com IA</h2><p class="muted">Para a IA enxergar as fotos, ative a inteligência artificial do app uma vez: em <b>Ajustes → Diagnóstico da IA</b>, ou colando a chave do Gemini no <code>config.js</code>.</p><div class="btns"><button class="btn full" data-a="close">Entendi</button></div>`);
  const R=fiaRaiz(VIEW.f);const subs=folders(R.id);const soltas=photosIn(R.id).length,todas=descend(R.id).reduce((n,id)=>n+photosIn(id).length,0);
  const noiva=subs.some(f=>/noiv/i.test(f.nome))||/casamento|&| e /i.test(R.nome);
  const faltam=FIA_PADRAO.filter(([n])=>!subs.some(f=>{const s=FIA_SINON.find(([re])=>re.test(f.nome.toLowerCase()));return s&&s[1]===n;})&&!subs.some(f=>f.nome.toLowerCase()===n.toLowerCase()));
  const pre=n=>noiva&&["Pós-cerimônia (igreja)","Mesa do bolo"].includes(n);
  sheet(`<h2>${ic("wand-sparkles")} Organizar “${esc(R.nome)}”</h2><p class="muted small" style="margin:4px 0 0">A IA olha cada foto e sugere a pasta. <b>Nada muda antes de você conferir.</b></p>
   <div class="fld"><span>Quais fotos analisar</span><div class="seg" data-k="fiaQ"><button type="button" data-a="seg" data-v="soltas" aria-pressed="${!!soltas}" ${soltas?"":"disabled"}>Só as soltas (${soltas})</button><button type="button" data-a="seg" data-v="todas" aria-pressed="${!soltas}">Todas (${todas})</button></div>
     <div class="tiny faint" style="margin-top:6px">“Todas” também revisa as fotos que já estão em pastas e corrige as que estiverem no lugar errado.</div></div>
   <div class="fld"><span>Pastas de destino</span>${subs.map(f=>`<label class="fiach"><input type="checkbox" data-fid="${f.id}" checked> ${ic("folder")} <b>${esc(f.nome)}</b> <span class="tiny faint">${photosIn(f.id).length} fotos</span></label>`).join("")||`<div class="tiny faint">Este álbum ainda não tem pastas.</div>`}</div>
   ${faltam.length?`<div class="fld"><span>Criar também estas pastas</span>${faltam.map(([n,d])=>`<label class="fiach"><input type="checkbox" data-nova="${esc(n)}" ${pre(n)||!subs.length&&["Making of","Noivo","Noiva","Cerimônia","Festa","Família e padrinhos"].includes(n)?"checked":""}> ${ic("folder-plus")} <b>${esc(n)}</b></label>`).join("")}</div>`:""}
   <div class="note">${ic("info")} Vai em miniatura, uma leva de 6 fotos por vez. Um álbum de 300 fotos leva alguns minutos. Pode fechar esta janela: o app avisa quando terminar.</div>
   <div class="btns"><button class="btn full" id="fiaGo">${ic("sparkles")} Começar</button></div>`,s=>{
   s.querySelector("#fiaGo").onclick=()=>{const dest=[...s.querySelectorAll("input[data-fid]:checked")].map(i=>getD(i.dataset.fid)).filter(Boolean);
     const novas=[...s.querySelectorAll("input[data-nova]:checked")].map(i=>i.dataset.nova);
     novas.forEach((n,k)=>{const d=save({id:"fold_"+nid()+k,c:"fold",nome:n,par:R.id,o:Date.now()+k});dest.push(d);});
     if(dest.length<2)return toast("triangle-alert","Escolha pelo menos 2 pastas","");
     const q=segVal(s,"fiaQ")||"todas";const ids=q==="soltas"?[R.id]:descend(R.id);const destIds=new Set(dest.map(d=>d.id));
     const fotos=ids.flatMap(id=>photosIn(id));
     closeSheet();fiaRodar(R,dest,fotos);};});};

/* ---------- 2. analisar ---------- */
async function fiaB64(ref){const u=await imgURL(ref,"t");if(!u)return null;if(u.startsWith("data:"))return{mime:(u.match(/^data:([^;]+)/)||[,"image/jpeg"])[1],data:u.split(",")[1]};
  const b=await (await fetch(u)).blob();const d=await blobToDataURL(b);return{mime:b.type||"image/jpeg",data:d.split(",")[1]};}
function fiaPrompt(dest,n){return `Você é um editor profissional de fotos de casamento. Vou mandar ${n} fotos, numeradas a partir de 0. Coloque cada foto em UMA das pastas abaixo, usando exatamente o nome da pasta.
${dest.map((d,i)=>`${i+1}. "${d.nome}"${fiaDesc(d.nome)?": "+fiaDesc(d.nome):""}`).join("\n")}
Regras: preparação (se arrumando) vai em making of, mesmo que apareça a noiva ou o noivo; retratos já prontos vão na pasta da pessoa. Se nenhuma pasta servir, use "?". Dê também a sua confiança de 0 a 1.
Responda SOMENTE JSON: {"r":[{"i":0,"p":"nome da pasta","c":0.9}]}`;}
async function fiaRodar(R,dest,fotos){Object.assign(FIA,{on:true,stop:false,root:R.id,dest:dest.map(d=>d.id),fotos:fotos.map(p=>p.id),res:{},feito:0,erro:"",undo:null});rr();
  toast("wand-sparkles","Organizando com IA",fotos.length+" fotos. Você pode continuar usando o app.");fiaProg();
  const nomes=dest.map(d=>d.nome),L=6;
  for(let k=0;k<fotos.length&&!FIA.stop;k+=L){const lote=fotos.slice(k,k+L);const parts=[{text:fiaPrompt(dest,lote.length)}];const ok=[];
    for(let j=0;j<lote.length;j++){try{const b=await fiaB64(lote[j].img);if(b){parts.push({text:"Foto "+ok.length+":"});parts.push({inlineData:{mimeType:b.mime,data:b.data}});ok.push(lote[j]);}}catch(e){}}
    if(!ok.length){FIA.feito+=lote.length;fiaProg();continue;}
    parts[0]={text:fiaPrompt(dest,ok.length)};let tent=0,txt=null;
    while(tent<4&&!FIA.stop){try{txt=await aiGenerate(parts,{max:900});break;}catch(e){tent++;const st=e&&e.status;if(st===429||/429|quota|limit/i.test(String(e&&e.message))){FIA.erro="Limite gratuito da IA: esperando para continuar…";fiaProg();await new Promise(r=>setTimeout(r,25000*tent));}
      else if(tent>=2){FIA.erro=(e&&e.amigavel)||"A IA não respondeu nesta leva.";break;}else await new Promise(r=>setTimeout(r,3000));}}
    FIA.erro=txt?"":FIA.erro;
    if(txt){try{const j=JSON.parse(String(txt).replace(/```json|```/g,"").trim());(j.r||[]).forEach(x=>{const p=ok[+x.i];if(!p)return;const nm=String(x.p||"").trim();
        const d=dest.find(d=>d.nome===nm)||dest.find(d=>d.nome.toLowerCase()===nm.toLowerCase());FIA.res[p.id]={to:d?d.id:"",c:Math.max(0,Math.min(1,+x.c||0)),de:p.f};});}catch(e){}}
    FIA.feito=Math.min(fotos.length,k+lote.length);fiaProg();}
  FIA.on=false;if(VIEW.v==="foto")rr();
  const n=Object.keys(FIA.res).length;if(FIA.stop){toast("x","Organização interrompida",n?n+" fotos já analisadas, dá para revisar":"");return;}
  if(!n){toast("triangle-alert","A IA não conseguiu analisar",FIA.erro||"Tente de novo em instantes.");return;}
  notify("Fotos analisadas","Toque para conferir as sugestões do álbum "+R.nome);toast("wand-sparkles","Sugestões prontas",n+" fotos analisadas. Toque em revisar no álbum.");
  if(VIEW.v==="foto"&&$("sheet").classList.contains("hidden"))fiaRevisar();}
function fiaProg(){const s=$("sheet");const b=s&&!s.classList.contains("hidden")&&s.querySelector("#fiaP");if(b){const t=FIA.fotos.length||1;b.querySelector("i").style.width=(FIA.feito/t*100)+"%";const x=s.querySelector("#fiaPT");if(x)x.textContent=`${FIA.feito} de ${FIA.fotos.length} fotos`;const e=s.querySelector("#fiaPE");if(e)e.textContent=FIA.erro||"";}
  const bar=document.querySelector(".fiabar.on .tiny");if(bar)bar.textContent=`${FIA.feito} de ${FIA.fotos.length} fotos analisadas`;}
ACT.fiaVer=()=>{sheet(`<h2>${ic("hourglass")} Organizando com IA…</h2><p class="muted small">Pode fechar esta janela e continuar usando o app.</p><div class="bar" id="fiaP"><i style="width:${FIA.feito/(FIA.fotos.length||1)*100}%"></i></div><div class="small" id="fiaPT">${FIA.feito} de ${FIA.fotos.length} fotos</div><div class="tiny" id="fiaPE" style="color:var(--waittx)">${esc(FIA.erro)}</div>
  <div class="btns"><button class="btn ghost full" data-a="close">Continuar em segundo plano</button><button class="btn danger full" data-a="fiaParar">Parar</button></div>`);};
ACT.fiaParar=()=>{FIA.stop=true;closeSheet();};

/* ---------- 3. revisar e aplicar ---------- */
const FIA_MIN=.55;
function fiaGrupos(){const G={},inc=[],ok=[];FIA.fotos.forEach(id=>{const r=FIA.res[id],p=getD(id);if(!r||!p)return;if(!r.to||r.c<FIA_MIN&&!r.man){inc.push(p);return;}if(p.f===r.to){ok.push(p);return;}(G[r.to]=G[r.to]||[]).push(p);});return{G,inc,ok};}
ACT.fiaRev=()=>fiaRevisar();
function fiaRevisar(){const{G,inc,ok}=fiaGrupos();const mov=Object.values(G).reduce((n,a)=>n+a.length,0);const dest=FIA.dest.map(getD).filter(Boolean);
  const th=(p,lbl)=>`<button class="fiath" data-a="fiaTroca" data-id="${p.id}" aria-label="Mudar a pasta desta foto">${imgTag(p.img,"t")}${lbl?`<span>${lbl}</span>`:""}</button>`;
  sheet(`<h2>${ic("wand-sparkles")} Confira antes de mover</h2><p class="muted small" style="margin:4px 0 0">Toque numa foto para trocar a pasta dela. As fotos sem certeza ficam onde estão, a menos que você escolha.</p>
   <div class="wrap-row" style="margin:10px 0">${dest.map(d=>`<span class="chip">${esc(d.nome)} · ${(G[d.id]||[]).length}</span>`).join("")}${inc.length?`<span class="chip a">Sem certeza · ${inc.length}</span>`:""}${ok.length?`<span class="chip c">Já no lugar · ${ok.length}</span>`:""}</div>
   ${dest.filter(d=>(G[d.id]||[]).length).map(d=>`<div class="grp">${ic("folder")} ${esc(d.nome)}<span class="chip">${G[d.id].length}</span></div><div class="fiag">${G[d.id].map(p=>th(p,p.f!==FIA.root?"de "+esc((getD(p.f)||{}).nome||""):"")).join("")}</div>`).join("")}
   ${inc.length?`<div class="grp">${ic("circle-help")} Sem certeza<span class="chip a">${inc.length}</span></div><div class="tiny faint" style="margin:-4px 0 6px">Toque para escolher a pasta.</div><div class="fiag">${inc.map(p=>th(p,"")).join("")}</div>`:""}
   ${ok.length?`<details style="margin-top:10px"><summary class="small muted">${ok.length} fotos já estão na pasta certa</summary><div class="fiag" style="margin-top:8px">${ok.map(p=>th(p,"")).join("")}</div></details>`:""}
   <div class="btns stk"><button class="btn full" data-a="fiaAplicar" ${mov?"":"disabled"}>${ic("folder-input")} Mover ${mov} ${mov===1?"foto":"fotos"}</button><button class="btn ghost full" data-a="fiaDescartar">Descartar sugestões</button></div>`);}
ACT.fiaTroca=el=>{const p=getD(el.dataset.id);const r=FIA.res[p.id]||{};const dest=FIA.dest.map(getD).filter(Boolean);
  sheet(`<h2>Para qual pasta?</h2><div class="fiaone">${imgTag(p.img,"f")}</div><div class="btns">${dest.map(d=>`<button class="btn ${r.to===d.id?"":"ghost"} full" style="justify-content:flex-start" data-a="fiaPara" data-id="${p.id}" data-to="${d.id}">${ic("folder")} ${esc(d.nome)}${r.to===d.id?` <span class="tiny" style="margin-left:auto">sugestão${r.c?" · "+Math.round(r.c*100)+"%":""}</span>`:""}</button>`).join("")}
   <button class="btn ghost full" data-a="fiaPara" data-id="${p.id}" data-to="">${ic("x")} Deixar onde está</button></div>`);};
ACT.fiaPara=el=>{const id=el.dataset.id,to=el.dataset.to;FIA.res[id]=Object.assign(FIA.res[id]||{},{to,c:to?1:0,man:true});fiaRevisar();};
ACT.fiaDescartar=()=>{FIA.res={};FIA.root=null;closeSheet();rr();};
ACT.fiaAplicar=()=>{const{G}=fiaGrupos();const undo=[];let n=0;const base=Date.now();
  Object.entries(G).forEach(([to,arr])=>arr.forEach(p=>{undo.push({id:p.id,f:p.f,at:p.at});p.f=to;p.at=base+n++;save(p);}));
  FIA.undo=undo;FIA.res={};const R=getD(FIA.root);closeSheet();rr();
  sheet(`<h2>${ic("check")} ${n} ${n===1?"foto organizada":"fotos organizadas"}</h2><p class="muted">As fotos já estão nas pastas de “${esc(R?R.nome:"")}”.</p><div class="btns h"><button class="btn ghost" data-a="fiaDesfazer">${ic("undo-2")} Desfazer</button><button class="btn" data-a="close">Pronto</button></div>`);};
ACT.fiaDesfazer=()=>{(FIA.undo||[]).forEach(u=>{const p=getD(u.id);if(p){p.f=u.f;p.at=u.at;save(p);}});const n=(FIA.undo||[]).length;FIA.undo=null;closeSheet();rr();toast("undo-2","Organização desfeita",n+" fotos voltaram para onde estavam");};
