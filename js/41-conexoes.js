"use strict";
/* ======================================================================
   CONEXÕES · uma ação sua atualiza o app inteiro
   1. Metas do ano que se atualizam sozinhas (cada meta conta só os dados do ano dela: 2026, 2027…)
   2. Treino concluído → check, "O que eu fiz", meta e Montanha
   3. Corrida registrada → Maratona ("faltam X km nesta semana")
   4. Treino do dia → aparece na agenda, no horário em que você costuma treinar
   5. Bíblia + ritual + afirmações + gratidão → meta espiritual
   6. Dominó sugerido a partir de metas, editais, planos RPM e pendências
   7. Fechar o dia → mostra o amanhã e deixa o rascunho do dominó pronto
   ====================================================================== */

/* ---------- 1. METAS AUTOMÁTICAS ---------- */
const META_FONTES=[
 ["auto","Detectar pelo nome da meta",""],["manual","Manual: eu atualizo",""],
 ["treinos","Treinos: academia, corrida, natação, capoeira e Kegel","treinos"],["gym","Academia","treinos"],["treinoABC","Treinos A, B e C completos","treinos"],
 ["run_n","Corridas (quantidade)","corridas"],["run_km","Corridas (quilômetros)","km"],["swim","Natação","treinos"],["cap","Capoeira","treinos"],["kegel","Kegel","dias"],
 ["esp","Espiritual: dias com Bíblia, ritual, afirmações ou gratidão","dias"],["bib","Leitura da Bíblia","dias"],["man","Ritual de manifestação","dias"],["decl","Afirmações declaradas","afirmações"],["grat","Gratidões registradas","gratidões"],
 ["conc","Estudo para o concurso","dias"],["foco","Horas de foco","horas"],["livros","Livros lidos","livros"],["ed","Editais aprovados","editais"],["edrec","Recebido de editais","R$"]];
const fonteNome=k=>(META_FONTES.find(f=>f[0]===k)||["","",""])[1];
const TREINO_K=["gym","run","swim","cap","kegel"];
function metaAdivinha(m){const t=" "+normTxt((m.t||"")+" "+(m.esp||""))+" ",un=normTxt(m.un||"");const has=re=>re.test(t);
  if(has(/kegel/))return"kegel";
  if(has(/ corr| maratona| km /)||un==="km")return /km/.test(t)||un==="km"?"run_km":"run_n";
  if(has(/ nat|nadar|piscina/))return"swim";if(has(/capoeira/))return"cap";
  if(has(/treino (a|b|c)|treinos abc|ficha/))return"treinoABC";if(has(/academia|musculac/))return"gym";
  if(has(/treino|treinar|exercici|atividade fisica|malhar/))return"treinos";
  if(has(/biblia|palavra de deus/))return"bib";if(has(/ritual|manifest/))return"man";if(has(/afirmac/))return"decl";if(has(/gratid|agradec/))return"grat";
  if(has(/espiritual|deus|oracao|orar| fe /)||m.area==="Espiritual")return"esp";
  if(has(/concurso|estudar|estudo/))return"conc";if(has(/ foco|deep work|horas focad/))return"foco";
  if(has(/edita/)&&has(/receb|faturar|ganhar|r\$/))return"edrec";if(has(/edita|projeto aprovad|contemplad/))return"ed";
  if(has(/livro|ler |leitura/))return"livros";return"";}
function metaFonte(m){if(m.fonte==="manual")return"";if(m.fonte&&m.fonte!=="auto")return m.fonte;return metaAdivinha(m);}
function metaValor(src,ano){const y=String(ano),inY=d=>String(d||"").startsWith(y);const trk=k=>all("trk").filter(x=>x.k===k&&inY(x.d));
  switch(src){
   case"treinos":return all("trk").filter(x=>TREINO_K.includes(x.k)&&inY(x.d)).length;
   case"gym":case"swim":case"cap":case"kegel":case"bib":case"man":case"conc":return trk(src).length;
   case"run_n":return trk("run").length;
   case"run_km":return Math.round(sum(trk("run").map(x=>+x.km||0))*10)/10;
   case"treinoABC":return all("trc").filter(x=>{if(!inY(x.d))return false;const tr=getD(x.tr);return tr&&tr.ex&&tr.ex.length&&x.done.filter(id=>tr.ex.some(e=>e.id===id)).length>=tr.ex.length;}).length;
   case"esp":{const S=new Set();trk("bib").concat(trk("man")).forEach(x=>S.add(x.d));all("dia").forEach(x=>{if(inY(x.d)&&x.decl)S.add(x.d);});all("grat").forEach(g=>{if(inY(g.d))S.add(g.d);});return S.size;}
   case"decl":return sum(all("dia").filter(x=>inY(x.d)).map(x=>x.decl||0));
   case"grat":return all("grat").filter(g=>inY(g.d)).length;
   case"foco":return Math.round(sum(all("dia").filter(x=>inY(x.d)).map(x=>x.foco||0))/6)/10;
   case"livros":return all("livros").filter(l=>inY(l.fim)).length;
   case"ed":return sum(all("ed").filter(e=>String(edAno(e))===y).map(e=>(e.pess||[]).filter(p=>p.st==="c").length));
   case"edrec":return Math.round(sum(all("ed").filter(e=>String(edAno(e))===y).map(recE))*100)/100;}
  return null;}
let MSYNC=false,MSYNC_T=null,MSYNC_MSG=[];
function metasSync(avisar){if(MSYNC)return[];MSYNC=true;const mud=[];try{all("ano").forEach(m=>{const src=metaFonte(m);
    if(!src){if(m.fsrc){m.fsrc="";save(m);}return;}
    const vb=metaValor(src,m.ano||yNow());if(vb==null)return;const antes=+m.atual||0;
    if(m.fsrc!==src)m.fbase=Math.max(0,Math.round((antes-vb)*100)/100); /* guarda o que você já tinha marcado à mão antes de ligar a meta */
    const v=Math.round((vb+(+m.fbase||0))*100)/100;
    if(v!==antes||m.fsrc!==src){m.atual=v;m.fsrc=src;if(!m.un){const u=(META_FONTES.find(f=>f[0]===src)||[])[2];if(u)m.un=u;}
      let bateu=false;if(+m.alvo>0&&v>=+m.alvo&&!m.feito){m.feito=true;bateu=true;}save(m);if(v!==antes)mud.push({m,antes,v,bateu});}});}
  finally{MSYNC=false;}
  if(avisar)mud.forEach(x=>{if(x.bateu){toast("party-popper","Meta atingida!",x.m.t);notify("Meta atingida! 🎉",x.m.t);}});return mud;}
function metasAgendar(){clearTimeout(MSYNC_T);MSYNC_T=setTimeout(()=>{const mud=metasSync(true);const novos=mud.filter(x=>x.v>x.antes&&!x.bateu);
  if(novos.length&&MSYNC_MSG.length){const ln=novos.slice(0,2).map(x=>`${x.m.t}: ${fmtMeta(x.v)}${+x.m.alvo?" / "+fmtMeta(x.m.alvo):""}`).join(" · ");toast("target",MSYNC_MSG.shift(),ln);}MSYNC_MSG=[];},350);}
const fmtMeta=v=>(+v||0).toLocaleString("pt-BR");
/* formulário: campo "Atualização automática" */
(()=>{const F=LISTS.ano.fields;if(!F.some(f=>f.k==="fonte")){const i=F.findIndex(f=>f.k==="atual");F.splice(i,0,{k:"fonte",l:"Atualização automática (o campo Atual passa a ser calculado)",type:"select",opts:META_FONTES.map(f=>[f[0],f[1]]),def:"auto"});}
  const _sub=LISTS.ano.sub;LISTS.ano.sub=i=>{const s=_sub(i);return i.fsrc?s.replace('<div class="meta">',`<div class="meta"><span class="chip c" title="Atualiza sozinha">${ic("zap")} automática · ${esc(fonteNome(i.fsrc).split(":")[0].split(" (")[0])}</span>`):s;};})();
/* +1 manual não vale para metas automáticas */
const _metaMais=ACT.metaMais;ACT.metaMais=el=>{const m=getD(el.dataset.id);if(m&&m.fsrc)return toast("zap","Esta meta se atualiza sozinha",fonteNome(m.fsrc));_metaMais&&_metaMais(el);};

/* ---------- 2 e 3. TREINO CONCLUÍDO → TUDO ATUALIZADO ---------- */
const TREINO_NOME={gym:"Treino de academia",run:"Corrida",swim:"Natação",cap:"Treino de capoeira",kegel:"Treino de Kegel"};
function fizDoTreino(x){const base=x.t&&x.t!==TRK[x.k].t?x.t:TREINO_NOME[x.k];return base+(x.s?" · "+x.s:"")+(x.k==="run"&&x.km?" · "+fmtMeta(x.km)+" km":"");}
function maraFalta(){try{const P=mpAtualiza();if(!P.ini)return null;const W=mpAtual(P);if(!W)return null;const feito=sum(W.sess.filter(s=>s.st==="ok").map(s=>+(s.real&&s.real.km)||s.km));return{alvo:W.alvo,feito:Math.round(feito*10)/10,falta:Math.max(0,Math.round((W.alvo-feito)*10)/10)};}catch(e){return null;}}
const _saveCx=save;
save=function(doc){const novo=doc&&doc.id&&!DB.docs.has(doc.id);const r=_saveCx.apply(this,arguments);if(MSYNC||!doc)return r;
  try{if(doc.c==="trk"&&TREINO_K.includes(doc.k)&&doc.d){const fid="fiz_trk_"+doc.id;const f=getD(fid),txt=fizDoTreino(doc);
      if(!f)_saveCx({id:fid,c:"fiz",t:txt,d:doc.d,auto:1});else if(f.t!==txt&&f.auto)_saveCx(Object.assign(f,{t:txt}));
      if(novo){let msg={gym:"Treino de academia registrado",run:"Corrida registrada",swim:"Natação registrada",cap:"Treino de capoeira registrado",kegel:"Treino de Kegel registrado"}[doc.k]||"Treino registrado";if(doc.k==="run"){const mf=maraFalta();if(mf)msg+=mf.falta>0?` · faltam ${fmtMeta(mf.falta)} km na semana da maratona`:" · semana da maratona completa!";}MSYNC_MSG.push(msg);}}
    if(["trk","trc","dia","livros","ed","grat","ano"].includes(doc.c))metasAgendar();}catch(e){console.warn(e);}
  return r;};
const _removeCx=removeDoc;removeDoc=function(id){const d=getD(id);const r=_removeCx.apply(this,arguments);try{if(d&&d.c==="trk"&&getD("fiz_trk_"+id))_removeCx("fiz_trk_"+id);if(d&&["trk","trc","dia","livros","ed","grat"].includes(d.c))metasAgendar();}catch(e){}return r;};
/* maratona: quanto falta na semana */
const _maraCx=VIEWS.mara;VIEWS.mara=function(){const h=_maraCx.apply(this,arguments);if(VIEW.velha)return h;const mf=maraFalta();if(!mf)return h;
  const card=`<div class="note mpfalta">${ic("footprints")} ${mf.falta>0?`Faltam <b>${fmtMeta(mf.falta)} km</b> nesta semana (${fmtMeta(mf.feito)} de ${fmtMeta(mf.alvo)} km). Suas corridas registradas já contam aqui.`:`<b>Semana completa!</b> ${fmtMeta(mf.feito)} km corridos.`}</div>`;
  const i=h.indexOf('<div class="hero">');return i<0?h:h.slice(0,i)+card+h.slice(i);};

/* ---------- 4. TREINO DO DIA NA AGENDA ---------- */
function horaTreino(){const H=all("trk").filter(x=>TREINO_K.includes(x.k)&&x.u&&iso(new Date(x.u))===x.d).sort((a,b)=>b.u-a.u).slice(0,15).map(x=>{const d=new Date(x.u);return d.getHours()*60+d.getMinutes();}).sort((a,b)=>a-b);
  if(H.length<3)return"18:00";const m=H[Math.floor(H.length/2)];const r=Math.round(m/30)*30;return pad(Math.floor(r/60)%24)+":"+pad(r%60);}
function treinoHoje(d){d=d||TODAY();if(d!==TODAY())return[];const feitos=TREINO_K.filter(k=>k!=="kegel"&&trkHas(k,d));const L=[];const h=horaTreino();
  const T=all("tr").sort((a,b)=>(a.o||0)-(b.o||0));if(T.some(z=>(z.ex||[]).length)&&!trkHas("gym",d)&&!feitos.length){const s=trSugerido(T);L.push({t:`Treino ${s.letra}${s.nome?" · "+s.nome:""}`,h,v:{v:"trk",k:"gym",sub:"tr",trId:s.id},ic:"dumbbell"});}
  try{const P=mpDoc();if(P.ini&&!trkHas("run",d)){const W=mpAtual(mpAtualiza());const s=W&&W.sess.find(x=>x.d===d&&!["ok","movido","trocado"].includes(x.st));if(s)L.push({t:`Corrida · ${s.nome} · ${fmtMeta(s.km)} km`,h,v:{v:"mara"},ic:"footprints"});}}catch(e){}
  return L;}
const treinoCard=x=>`<div class="item tcard" ${mstyle("gym")}><button class="ibody" data-a="go" data-v="${gv(x.v)}"><b>${ic(x.ic)} ${esc(x.t)}</b><div class="meta"><span class="chip">${ic("clock")} ${x.h}</span><span class="chip m">sugerido · ainda não feito</span></div></button></div>`;
const _calCx=VIEWS.cal;VIEWS.cal=function(){const h=_calCx.apply(this,arguments);const sel=VIEW.sel||TODAY();if(sel!==TODAY()||VIEW.flt)return h;const L=treinoHoje(sel);if(!L.length)return h;
  const mk=`<div class="sec"><h2>${esc(flong(sel))}</h2></div>`;const i=h.indexOf(mk);if(i<0)return h;
  return (h.slice(0,i+mk.length)+L.map(treinoCard).join("")+h.slice(i+mk.length)).replace(/<div class="note">Nada marcado neste dia\.[^<]*<\/div>/,"");};
if(typeof secAgenda==="function"){const _secAgCx=secAgenda;secAgenda=function(am){let h=_secAgCx.apply(this,arguments);if(am)return h;const L=treinoHoje();if(!L.length)return h;
  h=h.replace(/<div class="note"[^>]*>(?:(?!<\/div>).)*Nada marcado para hoje\.<\/div>/s,"");const mk="Abrir agenda</button></div>";const i=h.indexOf(mk);return i<0?h+L.map(treinoCard).join(""):h.slice(0,i+mk.length)+L.map(treinoCard).join("")+h.slice(i+mk.length);};}

/* ---------- 6. DOMINÓ SUGERIDO ---------- */
const DM_RE=/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/;
function notaData(t){const m=String(t||"").match(DM_RE);if(!m)return"";const y=m[3]?(m[3].length===2?"20"+m[3]:m[3]):String(yNow());const d=`${y}-${pad(+m[2])}-${pad(+m[1])}`;return /^\d{4}-\d{2}-\d{2}$/.test(d)?d:"";}
function sugestoesDomino(d){d=d||TODAY();const S=[],t=TODAY();
  const ont=dia(addDays(d,-1));if(ont.dom&&!ont.domOk)S.push({ic:"rotate-ccw",tag:"Ficou de ontem",t:ont.dom});
  ont.mits.filter(m=>!m.ok).forEach(m=>S.push({ic:"rotate-ccw",tag:"Prioridade pendente",t:m.t}));
  const E=all("edn").filter(n=>!n.feito).map(n=>({n,dt:notaData(n.t)})).filter(x=>x.dt&&x.dt>=t).sort((a,b)=>a.dt.localeCompare(b.dt));
  if(E[0]){const ed=E[0].n.ed?getD(E[0].n.ed):null;const dias=Math.round((pd(E[0].dt)-pd(t))/864e5);S.push({ic:"clipboard-list",tag:`Edital · prazo ${dias<=0?"hoje":dias===1?"amanhã":"em "+dias+" dias"}`,t:E[0].n.t.replace(/\s*(até|ate)?\s*\d{1,2}\/\d{1,2}(\/\d{2,4})?/i,"").trim()+(ed?" · "+ed.nome:"")});}
  else{const N=all("edn").filter(n=>!n.feito).sort((a,b)=>(b.u||0)-(a.u||0))[0];if(N){const ed=N.ed?getD(N.ed):null;S.push({ic:"clipboard-list",tag:"Pendência de edital",t:N.t+(ed?" · "+ed.nome:"")});}}
  const R=all("rpm").filter(r=>!r.fim&&(r.acoes||[]).some(a=>!a.ok)).sort((a,b)=>(a.prazo||"9999").localeCompare(b.prazo||"9999"))[0];
  if(R){const a=R.acoes.find(a=>!a.ok);S.push({ic:"crosshair",tag:"Próxima ação do plano",t:a.t+" · "+R.res});}
  const y=String(yNow()),doy=(pd(t)-pd(y+"-01-01"))/864e5+1,frac=doy/365;
  const M=all("ano").filter(m=>String(m.ano)===y&&!m.feito&&+m.alvo>0).map(m=>({m,atr:(+m.alvo*frac-(+m.atual||0))/+m.alvo})).filter(x=>x.atr>.05).sort((a,b)=>b.atr-a.atr)[0];
  if(M)S.push({ic:"target",tag:`Meta atrasada · ${fmtMeta(M.m.atual||0)} de ${fmtMeta(M.m.alvo)}`,t:"Avançar: "+M.m.t});
  const seen=new Set();return S.filter(s=>{const k=normTxt(s.t);if(!k||seen.has(k))return false;seen.add(k);return true;}).slice(0,5);}
const sugHTML=(S,alvo)=>S.length?`<div class="dmsug"><span class="tiny muted">Sugestões do app · toque para usar</span>${S.map(s=>`<button type="button" class="dmchip" data-a="dmUsar" data-alvo="${alvo}" data-t="${esc(s.t)}">${ic(s.ic)}<span><small>${esc(s.tag)}</small>${esc(s.t)}</span></button>`).join("")}</div>`:"";
ACT.dmUsar=el=>{const i=$(el.dataset.alvo);if(!i)return;if(el.dataset.alvo==="pdom"&&i.value.trim()&&i.value.trim()!==el.dataset.t){const p=[$("pm0"),$("pm1")].find(x=>x&&!x.value.trim());if(p)p.value=i.value.trim();}i.value=el.dataset.t;i.focus();el.classList.add("on");};
const _planCx=ACT.planDia;ACT.planDia=()=>{_planCx();const inp=$("pdom");if(!inp)return;const x=dia();
  if(x.rasc&&x.dom&&!x.primed)inp.insertAdjacentHTML("beforebegin",`<span class="tiny" style="color:var(--oktx);font-weight:800">${ic("moon-star")} Rascunho preparado ontem à noite. Confirme ou troque.</span>`);
  inp.insertAdjacentHTML("afterend",sugHTML(sugestoesDomino(),"pdom"));};

/* ---------- 7. FECHAR O DIA → PREPARA O AMANHÃ ---------- */
const _noiteCx=ACT.noite;ACT.noite=()=>{_noiteCx();const s=$("sheet"),btn=s&&s.querySelector("#nS");if(!btn)return;const am=addDays(TODAY(),1),hj=dia(),A=dia(am),now=new Date();
  const ev=all("ev").filter(e=>e.d===am).sort((a,b)=>(a.h||"").localeCompare(b.h||""));const rm=all("rem").filter(r=>!r.feito&&iso(nextOcc(r,now))===am);const ct=all("conta").filter(c=>c.status!=="paga"&&c.venc===am);
  const pend=[hj.dom&&!hj.domOk?hj.dom:null].concat(hj.mits.filter(m=>!m.ok).map(m=>m.t)).filter(Boolean);
  const rasc=A.dom||pend[0]||(sugestoesDomino(am)[0]||{}).t||"";
  const lista=ev.map(e=>`<li>${ic("calendar-days")} ${e.h?`<b>${esc(e.h)}</b> `:""}${esc(e.t)}</li>`).concat(rm.map(r=>`<li>${ic("alarm-clock")} ${r.h?`<b>${esc(r.h)}</b> `:""}${esc(r.t)}</li>`),ct.map(c=>`<li>${ic(c.tipo==="receber"?"hand-coins":"receipt")} ${c.tipo==="receber"?"Receber":"Pagar"}: ${esc(c.desc)} · <b>${money(c.valor)}</b></li>`));
  btn.closest(".btns").insertAdjacentHTML("beforebegin",`<div class="card amanha"><b>${ic("sunrise")} ${esc(flong(am))}</b>
    ${lista.length?`<ul>${lista.join("")}</ul>`:`<div class="tiny muted" style="margin-top:6px">Nenhum compromisso ou conta marcados.</div>`}
    <label class="fld"><span>Rascunho do dominó de amanhã</span><input id="amDom" value="${esc(rasc)}" placeholder="O que, se feito amanhã, facilita todo o resto?"></label>
    ${pend.length>1||(pend.length===1&&pend[0]!==rasc)?`<div class="tiny muted">${pend.length} ${pend.length===1?"pendência de hoje vai":"pendências de hoje vão"} para as prioridades de amanhã.</div>`:""}
    ${sugHTML(sugestoesDomino(am).filter(x=>x.t!==rasc).slice(0,3),"amDom")}</div>`);
  const inp=s.querySelector("#amDom");
  btn.addEventListener("click",()=>{const v=inp.value.trim();const B=dia(am);let mud=false;
    if(v&&!B.primed&&(!B.dom||B.rasc)){B.dom=v;B.domOk=false;B.rasc=true;mud=true;}
    if(!B.mits.length){const rest=pend.filter(t=>t!==v).slice(0,2);if(rest.length){B.mits=rest.map(t=>({id:nid(),t,ok:false}));B.rasc=true;mud=true;}}
    if(mud)save(B);});};

/* ---------- ao abrir o app: alinha tudo ---------- */
const _startCx=startApp;startApp=function(){const r=_startCx.apply(this,arguments);setTimeout(()=>{try{metasSync(false);if(VIEW.v==="home"||VIEW.v==="ciclo"||VIEW.v==="list")rr();}catch(e){console.warn(e);}},400);return r;};
