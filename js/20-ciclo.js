"use strict";
/* ======================================================================
   12 SEMANAS · método "The 12 Week Year" (Brian Moran e Michael Lennington)
   O ano vira um ciclo de 12 semanas: até 3 metas e, para cada meta, as táticas (ações) da semana.
   A nota da semana é a % de táticas cumpridas; 85% ou mais é semana vencida.
   As metas do ano continuam como visão de longo prazo, na aba "Metas do ano".
   Dados: um documento por ciclo, c:"cic"
     {nome, ini (segunda-feira), visao, metas:[{id,t,bloco,ano,un,alvo,atual,ok}],
      tat:[{id,meta,t,freq,log:[datas]}], notas:{semana:texto}, fim, media, rev:{bom,ruim,levo}}
   ====================================================================== */
MODS.ciclo={n:"12 semanas",ic:"target",c1:"#6D28D9",c2:"#FF3D7F",g:3,v:{v:"ciclo"}};
const CIC_ALVO=85,CIC_MAX_METAS=3;

const cicTodos=()=>all("cic").sort((a,b)=>(a.ini||"").localeCompare(b.ini||""));
const cicAberto=()=>cicTodos().find(c=>!c.fim)||null;
const cicFim=c=>addDays(c.ini,83);
const cicSem=(c,d)=>Math.floor((pd(d||TODAY())-pd(c.ini))/(7*864e5))+1;
const cicSemIni=(c,w)=>addDays(c.ini,(w-1)*7);
const fmtN=v=>(+v||0).toLocaleString("pt-BR");
const tatDaMeta=(c,m)=>(c.tat||[]).filter(t=>t.meta===m.id);
function tatFeitas(t,c,w){const a=cicSemIni(c,w),b=addDays(a,6);return (t.log||[]).filter(d=>d>=a&&d<=b).length;}
/* nota da semana: táticas cumpridas / táticas planejadas (cada repetição conta) */
function cicNota(c,w){const T=c.tat||[];const tot=sum(T.map(t=>+t.freq||1));if(!tot)return null;
  return Math.round(sum(T.map(t=>Math.min(tatFeitas(t,c,w),+t.freq||1)))/tot*100);}
/* média só das semanas já fechadas (a semana em andamento ainda não conta) */
function cicMedia(c,ate){const fim=ate||Math.min(12,cicSem(c)-1);const N=[];for(let w=1;w<=fim;w++){const n=cicNota(c,w);if(n!=null)N.push(n);}return N.length?Math.round(sum(N)/N.length):null;}
function cicInicioSugerido(){const t=TODAY(),seg=semanaKey(t),dow=(pd(t).getDay()+6)%7;let ini=dow<=2?seg:addDays(seg,7);
  const prev=cicTodos().filter(c=>c.fim).pop();if(prev){const depois=addDays(prev.ini,91);if(depois>ini&&depois<=addDays(t,21))ini=depois;}return ini;}

/* ---------- desenho ---------- */
function cicBarras(c,atual){let b="",l="";for(let w=1;w<=12;w++){const n=w<=atual?cicNota(c,w):null;
    b+=`<i class="${n!=null&&n>=CIC_ALVO?"ok":""} ${w===atual?"cur":""} ${w>atual?"fut":""}" style="--h:${n==null?0:Math.max(4,n)}%" title="Semana ${w}${n!=null?": "+n+"%":""}"></i>`;
    l+=`<span class="${w===atual?"cur":""}">${w}</span>`;}
  return `<div class="cicb" role="img" aria-label="Execução por semana; a linha tracejada marca ${CIC_ALVO}%"><div class="cbars">${b}<em></em></div><div class="clab">${l}</div></div>`;}
function tatRow(c,t,w,marca){const f=+t.freq||1,n=marca?tatFeitas(t,c,w):0,done=marca&&n>=f;
  const btn=!marca?"":f>1?`<button class="tcnt ${done?"on":""}" data-a="tatHit" data-c="${c.id}" data-t="${t.id}" aria-label="${esc(t.t)}: ${n} de ${f} nesta semana">${n}/${f}</button>`
    :`<button class="ck ${done?"on":""}" data-a="tatHit" data-c="${c.id}" data-t="${t.id}" aria-label="Marcar ${esc(t.t)}">${ic("check")}</button>`;
  return `<div class="item tat">${btn}<div class="ibody"><b class="${done?"strike":""}">${esc(t.t)}</b>${f>1?`<span class="tiny faint">${f}x por semana</span>`:""}</div></div>`;}
function metaHead(c,m){const bi=BLOCOS.find(b=>b[0]===m.bloco),a=+m.alvo||0;
  return `<div class="grp blk">${bi?`<span class="mb" style="width:30px;height:30px;border-radius:9px;font-size:.9rem">${ic(bi[1])}</span>`:""}<span class="grow">${esc(m.t)}</span>${a?`<span class="chip m">${fmtN(m.atual)}/${fmtN(a)} ${esc(m.un||"")}</span>`:""}<button class="ib" style="width:32px;height:32px" data-a="cicMeta" data-c="${c.id}" data-m="${m.id}" aria-label="Editar meta">${ic("pencil")}</button></div>`;}
function cicMetasHTML(c,w,marca){const M=c.metas||[];
  if(!M.length)return `<div class="note">${ic("target")} Escolha até ${CIC_MAX_METAS} metas para este ciclo. Menos metas, mais foco.</div><button class="btn full" data-a="cicMetaNova" data-c="${c.id}">${ic("plus")} Adicionar meta</button>`;
  return M.map(m=>{const T=tatDaMeta(c,m);return metaHead(c,m)+(T.length?T.map(t=>tatRow(c,t,w,marca)).join(""):`<div class="note" style="margin:0 0 6px">Sem táticas. Toque no lápis para listar as ações da semana.</div>`);}).join("");}

/* ---------- tela ---------- */
VIEWS.ciclo=()=>{const c=cicAberto(),fechados=cicTodos().filter(x=>x.fim);let ab=VIEW.ct||"ciclo";if(ab==="hist"&&!fechados.length)ab="ciclo";
  let h=topbar("12 semanas","ciclo",c&&ab==="ciclo"?`<button class="ib" style="margin-left:auto" data-a="cicEdit" data-c="${c.id}" aria-label="Ajustar ciclo">${ic("settings")}</button>`:"");
  const tabs=[["ciclo","Ciclo atual"],["ano","Metas do ano"]].concat(fechados.length?[["hist","Ciclos anteriores"]]:[]);
  h+=`<div class="tabs">${tabs.map(([k,n])=>`<button data-a="cicTab" data-v="${k}" aria-pressed="${k===ab}">${n}</button>`).join("")}</div>`;
  if(ab==="ano")h+=listBody("ano");
  else if(ab==="hist")h+=cicHistHTML(fechados);
  else if(!c)h+=empty("ciclo","Seu ano em 12 semanas","Escolha até 3 metas e as ações de cada semana. Toda semana você vê sua nota de execução: 85% ou mais é semana vencida.",`<button class="btn" data-a="cicNovo">${ic("plus")} Planejar meu ciclo</button>`);
  else{const w=cicSem(c);
    if(w<1){h+=`<div class="hero"><div class="muted small">${esc(c.nome)}</div><h2>Começa ${esc(flong(c.ini).toLowerCase())}</h2><div class="small muted">Use estes dias para deixar metas e táticas prontas.</div></div>`;
      h+=`<div class="sec"><h2>Metas e táticas</h2>${(c.metas||[]).length<CIC_MAX_METAS&&(c.metas||[]).length?`<button class="lk" data-a="cicMetaNova" data-c="${c.id}">${ic("plus")} Meta</button>`:""}</div>`+cicMetasHTML(c,w,false);}
    else if(w>12){const md=cicMedia(c,12);
      h+=`<div class="hero"><div class="muted small">${esc(c.nome)}</div><h2>Semana de revisão</h2><div class="small muted">As 12 semanas terminaram${md!=null?` com média de <b>${md}%</b> de execução`:""}.</div>${cicBarras(c,13)}</div>`;
      h+=`<button class="card ctac" style="margin-top:12px" data-a="cicRev" data-c="${c.id}"><b>${ic("flag")} Fazer a revisão e fechar o ciclo</b><span class="small muted">O que funcionou, o que travou e o que levar para o próximo.</span></button>`;
      h+=`<div class="sec"><h2>Metas do ciclo</h2></div>`+cicMetasHTML(c,w,false);}
    else{const n=cicNota(c,w),md=cicMedia(c),wi=cicSemIni(c,w),falta=diasAte(cicFim(c));
      h+=`<div class="hero"><div class="row"><div class="grow"><div class="muted small">${esc(c.nome)}</div><h2>Semana ${w} de 12</h2><div class="small muted">${fshort(wi)} a ${fshort(addDays(wi,6))} · ${falta===0?"último dia":falta+(falta===1?" dia":" dias")+" até o fim"}</div></div>
        <div class="ring" style="--p:${n||0}" aria-label="Execução da semana"><b>${n==null?"–":n+"%"}</b></div></div>${cicBarras(c,w)}
        <div class="tiny muted" style="margin-top:8px">${md==null?`A nota da semana é a % das táticas cumpridas. Semana vencida: ${CIC_ALVO}% ou mais.`:`Média das semanas fechadas: <b>${md}%</b> · meta ${CIC_ALVO}%`}</div></div>`;
      h+=`<div class="sec"><h2>Táticas da semana</h2>${(c.metas||[]).length&&(c.metas||[]).length<CIC_MAX_METAS?`<button class="lk" data-a="cicMetaNova" data-c="${c.id}">${ic("plus")} Meta</button>`:""}</div>`+cicMetasHTML(c,w,true);
      const nt=(c.notas||{})[w]||"";
      h+=`<details class="card cicrf" style="margin-top:16px"><summary><b>Reflexão da semana</b>${nt?` <span class="chip c">${ic("check")} escrita</span>`:""}</summary>
        <label class="fld"><span>O que ajudou e o que atrapalhou a execução?</span><textarea id="cicRf" placeholder="Ex.: Planejar no domingo funcionou. Perdi a terça com imprevistos.">${esc(nt)}</textarea></label><button class="btn sm" data-a="cicRfSave" data-c="${c.id}" data-w="${w}">Salvar reflexão</button></details>`;
      if(c.visao)h+=`<div class="note" style="margin-top:12px">${ic("mountain-snow")} <b>Visão:</b> ${esc(c.visao)}</div>`;}}
  return `<div class="app">${h}</div>`;};
function cicHistHTML(F){return F.slice().reverse().map(c=>{const md=c.media!=null?c.media:cicMedia(c,12);
  return `<div class="card" style="margin-bottom:10px"><div class="row"><b class="grow" style="font:800 1.05rem var(--disp)">${esc(c.nome)}</b>${md!=null?`<span class="chip ${md>=CIC_ALVO?"c":"m"}">${md}% de execução</span>`:""}</div>
    <div class="tiny faint" style="margin-top:2px">${fdate(c.ini)} a ${fdate(cicFim(c))}</div>
    ${(c.metas||[]).map(m=>`<div class="mit"><span class="ck ${m.ok?"on":""}" aria-hidden="true">${ic("check")}</span><span class="${m.ok?"":"muted"}">${esc(m.t)}</span></div>`).join("")}
    ${c.rev&&(c.rev.bom||c.rev.ruim||c.rev.levo)?`<details style="margin-top:8px"><summary class="small" style="font-weight:800">Revisão</summary>${[["bom","O que funcionou"],["ruim","O que travou"],["levo","O que levo para o próximo"]].map(([k,l])=>c.rev[k]?`<div class="small" style="margin-top:8px"><b>${l}</b><div class="muted" style="white-space:pre-wrap">${esc(c.rev[k])}</div></div>`:"").join("")}</details>`:""}</div>`;}).join("");}

ACT.cicTab=el=>{VIEW.ct=el.dataset.v;rr();};
ACT.cicNovo=()=>cicForm(null);
ACT.cicEdit=el=>cicForm(getD(el.dataset.c));
ACT.cicMetaNova=el=>{const c=getD(el.dataset.c);if((c.metas||[]).length>=CIC_MAX_METAS)return toast("target","Até "+CIC_MAX_METAS+" metas por ciclo","No 12 semanas, menos metas significa mais execução.");cicMetaForm(c,null);};
ACT.cicMeta=el=>{const c=getD(el.dataset.c);cicMetaForm(c,(c.metas||[]).find(m=>m.id===el.dataset.m));};
ACT.cicRev=el=>cicRevisao(getD(el.dataset.c));
ACT.cicRfSave=el=>{const c=getD(el.dataset.c);c.notas=c.notas||{};c.notas[el.dataset.w]=$("cicRf").value.trim();save(c);toast("check","Reflexão salva","");rr();};
ACT.tatHit=el=>{const c=getD(el.dataset.c);if(!c)return;const t=(c.tat||[]).find(x=>x.id===el.dataset.t);if(!t)return;const w=cicSem(c);
  if(w<1)return toast("calendar","O ciclo ainda não começou","Começa "+flong(c.ini).toLowerCase()+".");if(w>12)return;
  const f=+t.freq||1,n=tatFeitas(t,c,w),antes=cicNota(c,w)||0;t.log=t.log||[];
  if(n<f){t.log.push(TODAY());save(c);const dep=cicNota(c,w)||0;if(antes<CIC_ALVO&&dep>=CIC_ALVO)toast("trophy","Semana vencida!","Você passou de "+CIC_ALVO+"% de execução.");}
  else{const a=cicSemIni(c,w),b=addDays(a,6);t.log=t.log.filter(d=>d<a||d>b);save(c);toast("rotate-ccw","Tática desmarcada nesta semana",t.t);}
  rr();};

/* ---------- formulários ---------- */
function cicForm(c){const novo=!c,prev=cicTodos().filter(x=>x.fim).pop();const pend=prev?(prev.metas||[]).filter(m=>!m.ok):[];
  sheet(`<h2>${novo?"Planejar 12 semanas":"Ajustar ciclo"}</h2>${novo?`<p class="muted small" style="margin:4px 0 0">Doze semanas criam urgência: cada semana conta como um mês. Depois você escolhe até 3 metas.</p>`:""}
   <label class="fld"><span>Nome</span><input id="cN" value="${esc(c?c.nome:"Ciclo "+(cicTodos().length+1))}"></label>
   <label class="fld"><span>Começa na segunda-feira</span><input id="cI" type="date" value="${esc(c?c.ini:cicInicioSugerido())}"></label>
   <label class="fld"><span>Visão: como você quer estar daqui a 3 anos (opcional)</span><textarea id="cV" placeholder="Ex.: Vivendo da cultura, com 3 projetos aprovados por ano e corpo pronto para maratonas.">${esc(c?c.visao:"")}</textarea></label>
   ${novo&&pend.length?`<div class="fld"><span>Do ciclo anterior ficaram ${pend.length} ${pend.length===1?"meta":"metas"} sem atingir</span><div class="seg" data-k="cP"><button type="button" data-a="seg" data-v="1" aria-pressed="true">Trazer para este ciclo</button><button type="button" data-a="seg" data-v="" aria-pressed="false">Começar do zero</button></div></div>`:""}
   <div class="btns"><button class="btn full" id="cS">${novo?"Criar ciclo":"Salvar"}</button>${c?`<button class="btn ghost full" id="cR">${ic("flag")} Revisar e encerrar o ciclo</button><button class="btn danger full" id="cX">Apagar ciclo</button>`:""}</div>`,s=>{
  s.querySelector("#cS").onclick=()=>{let ini=s.querySelector("#cI").value;if(!ini)return toast("triangle-alert","Escolha a data de início","");const seg=semanaKey(ini);
    if(seg!==ini){ini=seg;toast("calendar","Início ajustado para segunda-feira",fdate(ini));}
    const d=c||{id:"cic_"+nid(),c:"cic",metas:[],tat:[],notas:{},fim:false};Object.assign(d,{nome:s.querySelector("#cN").value.trim()||"Ciclo",ini,visao:s.querySelector("#cV").value.trim()});
    if(novo&&pend.length&&segVal(s,"cP")){pend.forEach(m=>{const nm={...m,id:nid(),ok:false};d.metas.push(nm);tatDaMeta(prev,m).forEach(t=>d.tat.push({id:nid(),meta:nm.id,t:t.t,freq:t.freq,log:[]}));});}
    save(d);closeSheet();VIEW.ct="ciclo";rr();if(novo&&!d.metas.length)setTimeout(()=>cicMetaForm(d,null),250);};
  const r=s.querySelector("#cR");if(r)r.onclick=()=>{closeSheet();cicRevisao(c);};
  const x=s.querySelector("#cX");if(x)x.onclick=()=>confirmSheet("Apagar este ciclo?","Metas, táticas e registros deste ciclo serão apagados. As metas do ano continuam.","Apagar",()=>{removeDoc(c.id);rr();});});}

function parseTaticas(txt,old){return txt.split("\n").map(x=>x.trim()).filter(Boolean).map(l=>{const m=/\s+(\d{1,2})\s*x(\s*(por|\/)\s*semana)?$/i.exec(l);const freq=m?clamp(+m[1],1,14):1;const t=m?l.slice(0,m.index).trim():l;
  const o=old.find(a=>a.t.toLowerCase()===t.toLowerCase());return{id:o?o.id:nid(),t,freq,log:o?o.log||[]:[]};});}
function cicMetaForm(c,m){const anos=[c.ini.slice(0,4),cicFim(c).slice(0,4)];const AM=all("ano").filter(a=>anos.includes(String(a.ano))&&!a.feito);const T=m?tatDaMeta(c,m):[];
  sheet(`<h2>${m?"Editar meta":"Meta do ciclo"}</h2><div class="muted small">${esc(c.nome)} · ${(c.metas||[]).length+(m?0:1)} de ${CIC_MAX_METAS}</div>
   <label class="fld"><span>O que você vai conquistar em 12 semanas</span><input id="mT" value="${esc(m?m.t:"")}" placeholder="Ex.: Enviar 4 projetos para editais" autofocus></label>
   <div class="fld"><span>Bloco</span><div class="seg" data-k="mB">${BLOCOS.map(([b])=>`<button type="button" data-a="seg" data-v="${b}" aria-pressed="${(m?m.bloco:"Profissional")===b}">${b}</button>`).join("")}</div></div>
   ${AM.length?`<label class="fld"><span>Faz parte de qual meta do ano? (opcional)</span><select id="mA"><option value="">Nenhuma</option>${AM.map(a=>`<option value="${a.id}" ${m&&m.ano===a.id?"selected":""}>${esc(a.t)}</option>`).join("")}</select></label>`:""}
   <div class="tri"><label class="fld"><span>Medida</span><input id="mU" value="${esc(m?m.un:"")}" placeholder="projetos"></label><label class="fld"><span>Alvo</span><input id="mAl" inputmode="decimal" value="${esc(m&&m.alvo!==""&&m.alvo!=null?m.alvo:"")}" placeholder="4"></label><label class="fld"><span>Atual</span><input id="mAt" inputmode="decimal" value="${esc(m&&m.atual!==""&&m.atual!=null?m.atual:"")}" placeholder="0"></label></div>
   <label class="fld"><span>Táticas: o que você vai fazer toda semana</span><textarea id="mTa" style="min-height:140px" placeholder="Pesquisar editais abertos&#10;Escrever 1 hora por dia 5x&#10;Pedir carta de anuência">${esc(T.map(t=>t.t+((+t.freq||1)>1?" "+t.freq+"x":"")).join("\n"))}</textarea></label>
   <div class="tiny faint" style="margin-top:-6px">Uma ação por linha, do tipo que só depende de você. Para repetir na semana, termine com 3x.</div>
   <div class="btns"><button class="btn full" id="mS">${m?"Salvar":"Adicionar meta"}</button>${m?`<button class="btn danger full" id="mX">Apagar meta</button>`:""}</div>`,s=>{
  s.querySelector("#mS").onclick=()=>{const t=s.querySelector("#mT").value.trim();if(!t)return toast("triangle-alert","Escreva a meta","");
    const d=m||{id:nid(),ok:false};const sel=s.querySelector("#mA");Object.assign(d,{t,bloco:segVal(s,"mB")||"Profissional",ano:sel?sel.value:(d.ano||""),un:s.querySelector("#mU").value.trim(),
      alvo:s.querySelector("#mAl").value.trim()===""?"":num(s.querySelector("#mAl").value),atual:s.querySelector("#mAt").value.trim()===""?"":num(s.querySelector("#mAt").value)});
    if(!m){c.metas=c.metas||[];c.metas.push(d);}
    const novas=parseTaticas(s.querySelector("#mTa").value,T).map(x=>({...x,meta:d.id}));c.tat=(c.tat||[]).filter(x=>x.meta!==d.id).concat(novas);
    save(c);closeSheet();rr();if(!novas.length)toast("list-checks","Meta salva","Sem táticas, a semana não tem como ser medida.");};
  const x=s.querySelector("#mX");if(x)x.onclick=()=>confirmSheet("Apagar esta meta?",m.t+" e as táticas dela.","Apagar",()=>{c.metas=c.metas.filter(z=>z.id!==m.id);c.tat=(c.tat||[]).filter(z=>z.meta!==m.id);save(c);rr();});});}

function cicRevisao(c){const md=cicMedia(c,Math.min(12,cicSem(c)));const R=c.rev||{};
  sheet(`<h2>Revisão do ciclo</h2><div class="muted small">${esc(c.nome)}${md!=null?` · média de ${md}% de execução`:""}</div>
   ${(c.metas||[]).map(m=>`<div class="fld"><span>${esc(m.t)}</span><div class="seg" data-k="r_${m.id}"><button type="button" data-a="seg" data-v="1" aria-pressed="${!!m.ok}">Atingi</button><button type="button" data-a="seg" data-v="" aria-pressed="${!m.ok}">Não atingi</button></div></div>`).join("")}
   <label class="fld"><span>O que funcionou</span><textarea id="rB" style="min-height:80px">${esc(R.bom||"")}</textarea></label>
   <label class="fld"><span>O que travou a execução</span><textarea id="rR" style="min-height:80px">${esc(R.ruim||"")}</textarea></label>
   <label class="fld"><span>O que levo para o próximo ciclo</span><textarea id="rL" style="min-height:80px">${esc(R.levo||"")}</textarea></label>
   <div class="btns"><button class="btn full" id="rS">${ic("flag")} Encerrar ciclo</button></div>`,s=>{
  s.querySelector("#rS").onclick=()=>{(c.metas||[]).forEach(m=>{m.ok=!!segVal(s,"r_"+m.id);});c.rev={bom:s.querySelector("#rB").value.trim(),ruim:s.querySelector("#rR").value.trim(),levo:s.querySelector("#rL").value.trim()};
    c.media=md;c.fim=true;c.fimEm=TODAY();save(c);rr();
    sheet(`<h2>${ic("party-popper")} Ciclo encerrado</h2><p class="muted">${(c.metas||[]).filter(m=>m.ok).length} de ${(c.metas||[]).length} metas atingidas${md!=null?`, com ${md}% de execução média`:""}. Uma semana de pausa e você começa o próximo.</p>
      <div class="btns"><button class="btn full" id="nx">Planejar o próximo ciclo</button><button class="btn ghost full" data-a="close">Agora não</button></div>`,s2=>{s2.querySelector("#nx").onclick=()=>{closeSheet();cicForm(null);};});};});}

/* ---------- metas do ano: visão do ciclo ---------- */
LISTS.ano.tabs.def=()=>{const y=String(yNow());return all("ano").some(a=>String(a.ano)===y)?y:String(Math.max(2027,yNow()));};
LISTS.ano.top=items=>progTop(items,"feito","metas do ano atingidas")+`<div class="note">${ic("target")} As metas do ano são a visão. Cada ciclo de 12 semanas escolhe até ${CIC_MAX_METAS} delas para atacar agora.</div>`;
LISTS.ano.sub=i=>{const c=cicAberto();const lig=c&&(c.metas||[]).some(m=>m.ano===i.id);return metaSub(i)+(lig?`<div class="meta"><span class="chip m">${ic("target")} no ciclo atual</span></div>`:"");};

/* ---------- Início ---------- */
function secCiclo(){const c=cicAberto(),go=`data-a="go" data-v="${gv({v:"ciclo"})}"`;
  if(!c)return `<div class="sec"><h2>${ic("target")} 12 semanas</h2></div><button class="card ctac" ${mstyle("ciclo")} ${go}><b>Planeje as próximas 12 semanas</b><span class="small muted">Até 3 metas e as ações de cada semana, com nota de execução.</span></button>`;
  const w=cicSem(c);
  if(w<1)return `<div class="sec"><h2>${ic("target")} 12 semanas</h2></div><button class="card ctac" ${mstyle("ciclo")} ${go}><b>Seu ciclo começa ${esc(flong(c.ini).toLowerCase())}</b><span class="small muted">Deixe metas e táticas prontas antes da largada.</span></button>`;
  if(w>12)return `<div class="sec"><h2>${ic("target")} 12 semanas</h2></div><button class="card ctac" ${mstyle("ciclo")} data-a="cicRev" data-c="${c.id}"><b>Semana de revisão</b><span class="small muted">Feche o ciclo e planeje o próximo.</span></button>`;
  const n=cicNota(c,w)||0,pend=[];(c.metas||[]).forEach(m=>tatDaMeta(c,m).forEach(t=>{if(tatFeitas(t,c,w)<(+t.freq||1))pend.push(t);}));
  let h=`<div class="sec"><h2>${ic("target")} Semana ${w} de 12</h2><button class="lk" ${go}>Abrir</button></div><div class="card" ${mstyle("ciclo")}>
    <div class="row"><b class="big" style="color:var(--deep)">${n}%</b><div class="grow small muted">das táticas da semana<br>semana vencida: ${CIC_ALVO}%</div></div><div class="bar"><i style="width:${n}%"></i></div>`;
  if(pend.length)h+=`<div class="hgrid2" style="margin-top:12px">${pend.slice(0,4).map(t=>{const f=+t.freq||1;return `<button class="hchip" data-a="tatHit" data-c="${c.id}" data-t="${t.id}"><span class="ck">${ic("check")}</span><span class="grow">${esc(t.t)}</span>${f>1?`<span class="chip">${tatFeitas(t,c,w)}/${f}</span>`:""}</button>`;}).join("")}</div>${pend.length>4?`<button class="lk small" style="margin-top:8px" ${go}>Mais ${pend.length-4}</button>`:""}`;
  else h+=(c.tat||[]).length?`<div class="small" style="margin-top:10px;font-weight:800">${ic("trophy")} Todas as táticas da semana feitas.</div>`:`<div class="small muted" style="margin-top:10px">Cadastre as táticas para medir a semana.</div>`;
  return h+`</div>`;}

/* ---------- Montanha: cada tática feita é um passo no bloco da meta ---------- */
const _passosCic=passos;passos=function(desde){const r=_passosCic(desde);const de=desde||"0000",t=TODAY();
  all("cic").forEach(c=>(c.tat||[]).forEach(tt=>{const m=(c.metas||[]).find(x=>x.id===tt.meta);(tt.log||[]).forEach(d=>{if(d<de)return;r.tot++;if(m&&r.B[m.bloco]!=null)r.B[m.bloco]++;if(d===t)r.hoje++;});}));
  return r;};
