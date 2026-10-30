"use strict";
/* ================= ARRASTAR PARA REORDENAR (SortableJS) ================= */
async function getSortable(){if(window.Sortable)return window.Sortable;await loadScript("https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.2/Sortable.min.js");return window.Sortable;}
const dragMark=()=>{window.__dragT=Date.now();};
function reorder(ids){ids.forEach((id,k)=>{const d=getD(id);if(d&&d.o!==k*10){d.o=k*10;save(d);}});}
async function enableBoardSort(b){try{const S=await getSortable();if(!b.isConnected)return;
  S.create(b,{draggable:".col[data-id]",handle:".colh",filter:".ib",preventOnFilter:false,animation:160,delay:160,delayOnTouchOnly:true,
    ghostClass:"sg",chosenClass:"sc",scroll:true,scrollSensitivity:90,scrollSpeed:14,
    onStart:()=>b.classList.add("dragging"),
    onEnd:ev=>{b.classList.remove("dragging");dragMark();if(ev.oldIndex===ev.newIndex)return;reorder(qa(".col[data-id]",b).map(c=>c.dataset.id));VIEW.ci=ev.newIndex;toast("arrow-right-left","Ordem dos editais salva","");}});
}catch(e){console.warn("arrastar indisponível",e);}}
async function enableFolderSort(el){try{const S=await getSortable();if(!el.isConnected)return;
  S.create(el,{draggable:".alb",animation:160,delay:220,delayOnTouchOnly:true,ghostClass:"sg",chosenClass:"sc",
    onStart:dragMark,onEnd:ev=>{dragMark();if(ev.oldIndex===ev.newIndex)return;reorder(qa(".alb",el).map(a=>a.dataset.fid));toast("folder","Ordem das pastas salva","");}});
}catch(e){console.warn("arrastar indisponível",e);}}

/* ================= MOVER PASTA PARA OUTRO LUGAR ================= */
function folderOptions(excl){const out=[];const walk=(par,d)=>folders(par).forEach(f=>{if(excl.includes(f.id))return;out.push([f.id,f.nome,d]);walk(f.id,d+1);});walk("",0);return out;}
ACT.fMove=()=>{const F=getD(VIEW.f);if(!F)return;const cur=F.par||"";const opts=[["","Álbuns (nível principal)",0]].concat(folderOptions(descend(F.id)));
  sheet(`<h2>Mover “${esc(F.nome)}”</h2><p class="muted small">Escolha o destino. A pasta vai com todas as fotos e subpastas.</p><div class="btns">${opts.map(o=>`<button class="btn ghost full" style="justify-content:flex-start;padding-left:${14+o[2]*18}px" ${o[0]===cur?"disabled":`data-a="fMoveTo" data-to="${o[0]}"`}>${ic(o[0]?"folder":"images")} ${esc(o[1])}${o[0]===cur?" (local atual)":""}</button>`).join("")}</div>`);};
ACT.fMoveTo=el=>{const F=getD(VIEW.f);if(!F)return;F.par=el.dataset.to;F.o=Date.now();save(F);closeSheet();rr();toast("folder-input","Pasta movida",F.nome);};

/* ================= ZOOM DA GRADE DE FOTOS (dois dedos) ================= */
function colsGet(){try{return clamp(+localStorage.getItem("mu_cols")||3,2,5);}catch(e){return 3;}}
function colsSet(n){n=clamp(n,2,5);try{localStorage.setItem("mu_cols",String(n));}catch(e){}qa(".pgrid").forEach(g=>g.style.setProperty("--cols",n));const l=$("colsLbl");if(l)l.textContent=n+" por linha";}
ACT.colsMinus=()=>colsSet(colsGet()-1);ACT.colsPlus=()=>colsSet(colsGet()+1);
function enablePinch(g){const pts=new Map();let base=0,acc=0;
  const dist=()=>{const [a,b]=[...pts.values()];return Math.hypot(a[0]-b[0],a[1]-b[1]);};
  g.addEventListener("pointerdown",e=>{if(e.pointerType!=="touch")return;pts.set(e.pointerId,[e.clientX,e.clientY]);if(pts.size===2){base=dist();dragMark();}});
  g.addEventListener("pointermove",e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,[e.clientX,e.clientY]);
    if(pts.size===2&&base){const d=dist(),r=d/base;if(r>1.22){colsSet(colsGet()-1);base=d;}else if(r<0.82){colsSet(colsGet()+1);base=d;}dragMark();}});
  const up=e=>{if(pts.delete(e.pointerId)&&base)dragMark();if(pts.size<2)base=0;};
  ["pointerup","pointercancel","pointerleave"].forEach(t=>g.addEventListener(t,up));
  g.addEventListener("wheel",e=>{if(!e.ctrlKey)return;e.preventDefault();acc+=e.deltaY;if(acc>50){colsSet(colsGet()+1);acc=0;}else if(acc<-50){colsSet(colsGet()-1);acc=0;}},{passive:false});}

/* ================= COLAR LISTA DE GASTOS ================= */
const normTxt=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9 ]+/g," ").replace(/\s+/g," ").trim();
const G_CAT_RULES=[
  ["Esportes",["natacao","sunga","palmar","touca","oculos de natacao","joelho","cdo","capoeira","academia","tripe","treino","corrida","tenis de corrida"]],
  ["Alimentação",["almoco","jantar","lanche","pizza","ru","restaurante","churrasco","cafe","acai","hamburguer","ifood","sorvete","padaria"]],
  ["Mercado",["supermercado","mercado","feira","atacadao"]],
  ["Transporte",["uber","99","gasolina","combustivel","pneu","onibus","passagem","estacionamento","oficina","moto","carro"]],
  ["Contas",["agua","luz","energia","internet","tim","claro","vivo","oi","telefone","celular"]],
  ["Moradia",["aluguel","condominio","gas"]],
  ["Saúde",["farmacia","remedio","consulta","exame","dentista","medico"]],
  ["Educação",["curso","livro","apostila","faculdade","mensalidade escola","concurso"]],
  ["Assinaturas",["capcut","captcut","netflix","spotify","prime","assinatura","youtube premium","icloud","google one"]],
  ["Lazer",["montanha russa","ingresso","cinema","avatar","show","parque","festa","carnaval","viagem","passeio","bar"]],
  ["Vestuário",["bermuda","blusa","camisa","calca","roupa","sapato","tenis","short","vestido"]],
  ["Cuidados pessoais",["perfume","cabelo","barbearia","corte","salao","cosmetico","creme"]],
  ["Doações",["oferta","dizimo","doacao"]],
];
function gCat(item){const t=" "+normTxt(item)+" ";for(const [c,ks] of G_CAT_RULES)if(ks.some(k=>t.includes(" "+k+" ")||(k.includes(" ")&&t.includes(k))))return c;return "Outros";}
const G_PAG_RULES=[["Dinheiro",/dinheiro( fisico)?|especie|cash/],["Débito",/debito/],["Cartão",/cartao|credito|card/],["Pix",/\bpix\b/],["Boleto",/boleto/]];
const G_FIX={"agua":"Água","ru":"RU","tim":"TIM","uber":"Uber","cdo":"CDO"};
function gNiceItem(s){s=s.replace(/\s+/g," ").trim();if(!s)return"";
  return s.split(" ").map((w,i)=>{const n=normTxt(w);if(G_FIX[n])return G_FIX[n];if(w.length>3&&w===w.toUpperCase()&&/[A-ZÀ-Ú]/.test(w))w=w.toLowerCase();return i===0?w.charAt(0).toUpperCase()+w.slice(1):w;}).join(" ");}
function gParseValue(s){s=s.replace(/\s/g,"");if(/,/.test(s))s=s.replace(/\./g,"").replace(",",".");else if(/\.\d{3}$/.test(s))s=s.replace(/\./g,"");const n=parseFloat(s);return isNaN(n)?null:Math.round(n*100)/100;}
function gParseList(txt){const rows=[],bad=[];let informed=null;
  txt.split(/\r?\n/).forEach(raw=>{let l=raw.trim();if(!l)return;
    const tm=l.match(/^total\s*[:\-]?\s*(?:r\$)?\s*([\d.,]+)/i);if(tm){informed=gParseValue(tm[1]);return;}
    const vm=l.match(/^(?:r\$\s*)?(\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?|\d+(?:[.,]\d{1,2})?)/i);
    if(!vm){bad.push(raw);return;}const v=gParseValue(vm[1]);let rest=l.slice(vm[0].length).replace(/^\s*(reais|real|r\$)\b/i,"");
    let pag="";const nrest=normTxt(rest);for(const [p,re] of G_PAG_RULES){const mm=nrest.match(re);if(mm){pag=p;break;}}
    if(pag){const words=["dinheiro físico","dinheiro fisico","dinheiro","espécie","especie","cartão de crédito","cartao de credito","cartão","cartao","crédito","credito","débito","debito","pix","boleto"];
      for(const w of words){const re=new RegExp("(^|[\\s|\\-–—:/])"+w.replace(/ /g,"\\s+")+"(?=$|[\\s|\\-–—:/])","i");if(re.test(rest)){rest=rest.replace(re,"$1");break;}}}
    const item=gNiceItem(rest.split(/\s*[|–—]\s*|\s+-\s+|^\s*-\s*|\s*-\s*$/).map(x=>x.replace(/^[\s|\-–—:]+|[\s|\-–—:]+$/g,"")).filter(Boolean).join(" · "));
    if(v==null||v<=0){bad.push(raw);return;}
    rows.push({v,pag:pag||"Outro",desc:item||"Gasto",cat:gCat(item),inc:true});});
  return{rows,bad,informed};}
let GL=null;
ACT.gLista=()=>{const y=VIEW.y??yNow(),m=VIEW.m??new Date().getMonth();const t=TODAY();const defD=t.startsWith(y+"-"+pad(m+1))?t:y+"-"+pad(m+1)+"-01";
  sheet(`<h2>Colar lista de gastos</h2><p class="muted small">Cole uma linha por gasto, no formato <b>valor, forma de pagamento e item</b>. O app separa, padroniza e categoriza tudo. Ex.:<br><code>18 reais - PIX | Almoço</code><br><code>8,81 CARTÃO | Uber</code></p>
   <label class="fld"><span>Sua lista</span><textarea id="glT" class="tall" placeholder="20 reais - DINHEIRO FÍSICO | Montanha Russa&#10;18 reais - PIX | Almoço&#10;Total: R$ 38,00">${esc(GL&&GL.txt||"")}</textarea></label>
   <label class="fld"><span>Data dos gastos</span><input id="glD" type="date" value="${GL&&GL.d||defD}"></label>
   <div class="btns"><button class="btn full" data-a="glGo">${ic("sparkles")} Organizar</button><button class="btn ghost full" data-a="close">Cancelar</button></div>`);};
ACT.glGo=()=>{const txt=$("glT").value,d=$("glD").value||TODAY();const r=gParseList(txt);if(!r.rows.length)return toast("triangle-alert","Não encontrei gastos na lista","Comece cada linha pelo valor. Ex.: 18 reais - PIX | Almoço");GL={txt,d,...r};glRender();};
function glRender(){const R=GL.rows,inc=R.filter(x=>x.inc),tot=Math.round(sum(inc.map(x=>x.v))*100)/100;const y=$("sheet").querySelector(".in")?$("sheet").querySelector(".in").scrollTop:0;
  const conf=GL.informed!=null?(Math.abs(GL.informed-tot)<0.005?`<div class="note" style="background:var(--okbg);border-color:transparent;color:var(--oktx)">${ic("check")} O total confere com o informado na lista (${money(GL.informed)}).</div>`:`<div class="note" style="background:var(--waitbg);border-color:transparent;color:var(--waittx)">${ic("triangle-alert")} A soma dá ${money(tot)}, mas a lista informa ${money(GL.informed)}. Diferença de ${money(Math.abs(GL.informed-tot))}.</div>`):"";
  sheet(`<h2>Confira os gastos</h2><div class="row" style="justify-content:space-between;flex-wrap:wrap"><div class="muted small">${inc.length} gastos · ${fdate(GL.d)}</div><div class="amt" style="font-size:1.3rem">${money(tot)}</div></div>${conf}
   ${GL.bad.length?`<div class="note">${ic("info")} Não entendi ${GL.bad.length===1?"esta linha":"estas linhas"}: ${GL.bad.map(b=>`<code>${esc(b)}</code>`).join(", ")}. Corrija na lista ou adicione depois pelo +.</div>`:""}
   <div class="glt">${R.map((x,i)=>`<div class="glr ${x.inc?"":"off"}"><input class="glv" inputmode="decimal" value="${moneyRaw(x.v)}" data-ch="glV" data-i="${i}" aria-label="Valor">
     <select data-ch="glP" data-i="${i}" aria-label="Forma de pagamento">${PAGS.map(p=>`<option ${p===x.pag?"selected":""}>${p}</option>`).join("")}</select>
     <input class="gli" value="${esc(x.desc)}" data-in="glI" data-i="${i}" aria-label="Item">
     <select class="glc" data-ch="glC" data-i="${i}" aria-label="Categoria" style="border-left:5px solid ${catCol(x.cat)}">${CATS.map(([c])=>`<option ${c===x.cat?"selected":""}>${c}</option>`).join("")}</select>
     <button class="ib" data-a="glX" data-i="${i}" aria-label="${x.inc?"Tirar":"Incluir"}">${ic(x.inc?"x":"plus")}</button></div>`).join("")}</div>
   <div class="btns stk"><button class="btn full" data-a="glSave" ${inc.length?"":"disabled"}>${ic("check")} Salvar ${inc.length} gastos · ${money(tot)}</button><button class="btn ghost full" data-a="gLista">${ic("pencil")} Voltar e editar a lista</button></div>`);
  const inn=$("sheet").querySelector(".in");if(inn)inn.scrollTop=y;}
CH.glV=el=>{const x=GL.rows[+el.dataset.i];const v=gParseValue(el.value.replace(/r\$|\s/gi,""));if(v!=null&&v>0)x.v=v;glRender();};
CH.glP=el=>{GL.rows[+el.dataset.i].pag=el.value;};
CH.glI=el=>{GL.rows[+el.dataset.i].desc=el.value;};
CH.glC=el=>{GL.rows[+el.dataset.i].cat=el.value;glRender();};
ACT.glX=el=>{const x=GL.rows[+el.dataset.i];x.inc=!x.inc;glRender();};
ACT.glSave=()=>{const R=GL.rows.filter(x=>x.inc);const d=GL.d;R.forEach((x,k)=>save({id:"exp_"+nid()+k,c:"exp",v:x.v,desc:x.desc.trim()||"Gasto",cat:x.cat,pag:x.pag,d}));
  const tot=sum(R.map(x=>x.v));GL=null;VIEW.y=+d.slice(0,4);VIEW.m=+d.slice(5,7)-1;closeSheet();rr();toast("wallet",R.length+" gastos salvos",money(tot));};

/* ================= CONTAS A PAGAR E A RECEBER ================= */
const diasAte=d=>Math.round((pd(d)-pd(TODAY()))/864e5);
function vencTxt(c){if(c.status==="paga")return (c.tipo==="receber"?"Recebida":"Paga")+(c.pagoEm?" em "+fdate(c.pagoEm):"");const n=diasAte(c.venc);
  return n<0?`Vencida há ${-n} ${-n===1?"dia":"dias"}`:n===0?"Vence hoje":n===1?"Vence amanhã":`Vence em ${n} dias · ${fshort(c.venc)}`;}
function contaCard(c){const n=c.status==="paga"?null:diasAte(c.venc);const cls=c.status==="paga"?"c":n<0?"n":n<=3?"a":"";
  return `<div class="item"><button class="ck ${c.status==="paga"?"on":""}" data-a="ctPay" data-id="${c.id}" aria-label="${c.tipo==="receber"?"Marcar como recebida":"Marcar como paga"}">${ic("check")}</button><button class="ibody" data-a="ctEdit" data-id="${c.id}"><div class="row"><b class="grow ell ${c.status==="paga"?"strike":""}">${esc(c.desc)}</b><span class="amt" style="color:${c.tipo==="receber"?"var(--ok)":"var(--no)"}">${c.tipo==="receber"?"+":"−"} ${money(c.valor)}</span></div>
    <div class="meta"><span class="chip ${cls}">${ic(c.status==="paga"?"circle-check":"calendar-clock")} ${esc(vencTxt(c))}</span>${c.quem?`<span class="chip">${esc(c.quem)}</span>`:""}${c.rep==="m"?`<span class="chip m">${ic("repeat")} mensal</span>`:""}${c.tipo==="pagar"&&c.cat?`<span class="chip">${esc(c.cat)}</span>`:""}</div></button></div>`;}
VIEWS.contas=()=>{const tb=VIEW.tab||"pagar";const C=all("conta");const ab=C.filter(c=>c.status!=="paga");
  const tP=sum(ab.filter(c=>c.tipo==="pagar").map(c=>c.valor)),tR=sum(ab.filter(c=>c.tipo==="receber").map(c=>c.valor));
  const venc=ab.filter(c=>c.tipo==="pagar"&&diasAte(c.venc)<0);
  let h=topbar("Contas a pagar e receber","contas");
  h+=`<div class="hero"><div class="edst"><div><div class="muted small">A pagar (em aberto)</div><h2 style="color:var(--no)">${money(tP)}</h2></div><div><div class="muted small">A receber (em aberto)</div><h2 style="color:var(--ok)">${money(tR)}</h2></div><div><div class="muted small">Saldo previsto</div><h2>${money(tR-tP)}</h2></div></div>
   ${venc.length?`<div class="small" style="margin-top:10px;color:var(--notx);font-weight:800">${ic("triangle-alert")} ${venc.length} ${venc.length===1?"conta vencida":"contas vencidas"}: ${money(sum(venc.map(c=>c.valor)))}</div>`:""}</div>`;
  h+=`<div class="tabs" style="margin-top:12px"><button data-a="liTab" data-v="pagar" aria-pressed="${tb==="pagar"}">${ic("arrow-up-right")} A pagar</button><button data-a="liTab" data-v="receber" aria-pressed="${tb==="receber"}">${ic("arrow-down-left")} A receber</button><button data-a="liTab" data-v="hist" aria-pressed="${tb==="hist"}">${ic("circle-check")} Quitadas</button></div>`;
  if(tb==="hist"){const H=C.filter(c=>c.status==="paga").sort((a,b)=>(b.pagoEm||"").localeCompare(a.pagoEm||""));
    h+=H.length?H.slice(0,80).map(contaCard).join(""):empty("contas","Nada quitado ainda","As contas pagas e recebidas aparecem aqui.");
    return `<div class="app">${h}</div>`;}
  const L=ab.filter(c=>c.tipo===tb).sort((a,b)=>a.venc.localeCompare(b.venc));
  const g1=L.filter(c=>diasAte(c.venc)<0),g2=L.filter(c=>{const n=diasAte(c.venc);return n>=0&&n<=7;}),g3=L.filter(c=>diasAte(c.venc)>7);
  const grp=(t,arr,cls)=>arr.length?`<div class="grp">${t}<span class="chip ${cls}">${arr.length} · ${money(sum(arr.map(c=>c.valor)))}</span></div>`+arr.map(contaCard).join(""):"";
  h+=L.length?grp(tb==="pagar"?"Vencidas":"Atrasadas",g1,"n")+grp("Próximos 7 dias",g2,"a")+grp("Mais adiante",g3,"")
    :empty("contas",tb==="pagar"?"Nenhuma conta a pagar":"Nada a receber por enquanto",tb==="pagar"?"Cadastre boletos, faturas e mensalidades e o app avisa no vencimento.":"Cadastre o que você tem para receber: cachês, editais, serviços.");
  return `<div class="app">${h}</div>${fab("ctNew","Nova conta")}`;};
const CTF=tipo=>[{k:"desc",l:tipo==="receber"?"O que vou receber":"O que vou pagar",auto:1,ph:tipo==="receber"?"Ex.: Cachê do evento":"Ex.: Fatura do cartão"},
  {k:"valor",l:"Valor (R$)",type:"money"},{k:"venc",l:tipo==="receber"?"Data prevista":"Vencimento",type:"date",def:TODAY},
  {k:"quem",l:tipo==="receber"?"De quem":"Para quem",ph:tipo==="receber"?"Ex.: Prefeitura de Sobral":"Ex.: Enel"},
  {k:"rep",l:"Repetir",type:"select",opts:[["","Não repete"],["m","Todo mês"]],def:""},
  ...(tipo==="pagar"?[{k:"cat",l:"Categoria (para a planilha de gastos)",type:"select",opts:CATS.map(c=>c[0]),def:"Contas"},{k:"lanc",l:"Lançar nos gastos quando pagar",type:"check",def:true}]:[]),
  {k:"nota",l:"Observações",type:"textarea"}];
function ctForm(c,tipo){tipo=c?c.tipo:tipo;const F=CTF(tipo);
  sheet(`<h2>${c?"Editar conta":tipo==="receber"?"Nova conta a receber":"Nova conta a pagar"}</h2>${c?"":`<div class="seg" style="margin:6px 0 4px">${[["pagar","A pagar"],["receber","A receber"]].map(([k,n])=>`<button type="button" data-a="ctTipo" data-v="${k}" aria-pressed="${tipo===k}">${n}</button>`).join("")}</div>`}
   ${F.map(f=>fieldHTML(f,c?c[f.k]:null)).join("")}
   <div class="btns"><button class="btn full" id="cS">${c?"Salvar":"Adicionar"}</button>${c&&c.status==="paga"?`<button class="btn ghost full" id="cR">${ic("rotate-ccw")} Reabrir conta</button>`:""}${c?`<button class="btn danger full" id="cX">Apagar</button>`:""}</div>`,s=>{
   s.querySelector("#cS").onclick=()=>{const o=readFields(F,s);if(!o.desc)return toast("triangle-alert","Descreva a conta","");if(!(o.valor>0))return toast("triangle-alert","Informe o valor","Ex.: 120,00");o.venc=o.venc||TODAY();
     const d=c||{id:"ct_"+nid(),c:"conta",tipo,status:"aberta"};Object.assign(d,o);save(d);closeSheet();VIEW.tab=VIEW.tab==="hist"&&d.status!=="paga"?d.tipo:VIEW.tab||d.tipo;rr();};
   const r=s.querySelector("#cR");if(r)r.onclick=()=>{c.status="aberta";c.pagoEm="";if(c.gasto){removeDoc(c.gasto);c.gasto="";}save(c);closeSheet();rr();};
   const x=s.querySelector("#cX");if(x)x.onclick=()=>confirmSheet("Apagar esta conta?",c.desc,"Apagar",()=>{removeDoc(c.id);rr();});});}
ACT.ctNew=()=>ctForm(null,VIEW.tab==="receber"?"receber":"pagar");
ACT.ctTipo=el=>ctForm(null,el.dataset.v);
ACT.ctEdit=el=>ctForm(getD(el.dataset.id));
ACT.ctPay=el=>{const c=getD(el.dataset.id);const t=TODAY();
  if(c.status==="paga"){c.status="aberta";c.pagoEm="";if(c.gasto){removeDoc(c.gasto);c.gasto="";}save(c);rr();toast("rotate-ccw","Conta reaberta",c.desc);return;}
  c.status="paga";c.pagoEm=t;
  if(c.tipo==="pagar"&&c.lanc!==false){const g={id:"exp_"+nid(),c:"exp",v:+c.valor,desc:c.desc,cat:c.cat||"Contas",pag:"",d:t};save(g);c.gasto=g.id;}
  if(c.rep==="m"){const nd=pd(c.venc);const dd=nd.getDate();nd.setDate(1);nd.setMonth(nd.getMonth()+1);nd.setDate(Math.min(dd,new Date(nd.getFullYear(),nd.getMonth()+1,0).getDate()));
    save({...c,id:"ct_"+nid(),status:"aberta",pagoEm:"",gasto:"",venc:iso(nd),u:0});}
  save(c);rr();toast(c.tipo==="receber"?"hand-coins":"check",c.tipo==="receber"?"Recebido!":"Conta paga",money(c.valor)+(c.rep==="m"?" · próxima já agendada":"")+(c.gasto?" · lançada nos gastos":""));};
setInterval(()=>{try{if(!DB.be)return;const t=TODAY(),hm=pad(new Date().getHours())+":"+pad(new Date().getMinutes());if(hm<"08:00")return;
  all("conta").forEach(c=>{if(c.status==="paga"||c.nt===t)return;const n=diasAte(c.venc);if(n===0||(n===1&&c.tipo==="pagar")){c.nt=t;save(c);notify(c.tipo==="receber"?"Para receber hoje: "+c.desc:(n===0?"Conta vence hoje: ":"Conta vence amanhã: ")+c.desc,money(c.valor)+(c.quem?" · "+c.quem:""));}});}catch(e){}},45000);

/* ================= ACADEMIA: PLANILHA DE TREINOS ================= */
function treinos(){let T=all("tr").sort((a,b)=>(a.o||0)-(b.o||0));if(!T.length){T=["A","B","C"].map((l,k)=>save({id:"tr_"+l,c:"tr",letra:l,nome:"",o:k*10,ex:[]}));}return T;}
const trcId=(tr,d)=>"tc_"+tr+"_"+d;
function trDone(tr,d){const x=getD(trcId(tr.id,d));return x?x.done.filter(id=>tr.ex.some(e=>e.id===id)):[];}
function trLast(tr){const L=all("trc").filter(x=>x.tr===tr.id&&tr.ex.length&&x.done.filter(id=>tr.ex.some(e=>e.id===id)).length>=tr.ex.length).map(x=>x.d).sort();return L[L.length-1]||"";}
function trSugerido(T){let best=null,bd="";T.forEach(t=>{const l=trLast(t);if(l>bd){bd=l;best=t;}});if(!best)return T[0];const i=T.indexOf(best);return T[(i+1)%T.length];}
const _trkView=VIEWS.trk;
VIEWS.trk=()=>{if(VIEW.k==="gym"&&VIEW.sub==="tr")return treinosView();const h=_trkView();if(VIEW.k!=="gym")return h;
  return h.replace("</header>",`</header>${gymTabs("cal")}`);};
const gymTabs=a=>`<div class="tabs"><button data-a="gymTab" data-v="cal" aria-pressed="${a==="cal"}">${ic("calendar-days")} Calendário</button><button data-a="gymTab" data-v="tr" aria-pressed="${a==="tr"}">${ic("list-checks")} Planilha de treinos</button></div>`;
ACT.gymTab=el=>{VIEW.sub=el.dataset.v==="tr"?"tr":"";window.scrollTo(0,0);rr();};
function treinosView(){const T=treinos(),t=TODAY();const sug=trSugerido(T);let tr=T.find(x=>x.id===VIEW.trId)||sug;
  const ex=tr.ex||[],dn=trDone(tr,t),pct=ex.length?Math.round(dn.length/ex.length*100):0,last=trLast(tr);
  let h=topbar("Academia","gym")+gymTabs("tr");
  h+=`<div class="tabs">${T.map(x=>`<button data-a="trSel" data-id="${x.id}" aria-pressed="${x.id===tr.id}">Treino ${esc(x.letra)}${x.id===sug.id?" ★":""}</button>`).join("")}<button data-a="trNovo" aria-label="Novo treino">${ic("plus")}</button></div>`;
  h+=`<div class="hero"><div class="row"><div class="grow"><div class="muted small">${tr.id===sug.id?"★ Sugerido para hoje":"Treino"}</div><h2>Treino ${esc(tr.letra)}${tr.nome?" · "+esc(tr.nome):""}</h2><div class="muted small">${last?"Último completo: "+flong(last):"Ainda não concluído"}</div></div><button class="ib" data-a="trEdit" aria-label="Editar treino">${ic("pencil")}</button></div>
   ${ex.length?`<div class="row" style="margin-top:12px"><div class="grow bar" style="margin:0"><i style="width:${pct}%"></i></div><b class="small">${dn.length}/${ex.length} hoje</b></div>`:""}</div>`;
  h+=`<div class="sec"><h2>Exercícios</h2>${dn.length?`<button class="lk" data-a="trReset">${ic("rotate-ccw")} Desmarcar hoje</button>`:""}</div>`;
  h+=ex.length?ex.map((e,i)=>{const on=dn.includes(e.id);const meta=[e.series&&e.reps?`${e.series} × ${e.reps}`:e.series?e.series+" séries":e.reps?e.reps+" reps":"",e.carga?e.carga+(/[a-z]/i.test(e.carga)?"":" kg"):"",e.desc?"desc. "+e.desc:""].filter(Boolean);
    return `<div class="ex"><button class="ck ${on?"on":""}" data-a="trCk" data-e="${e.id}" aria-label="Concluir ${esc(e.n)}">${ic("check")}</button><button class="grow" style="text-align:left" data-a="trExEdit" data-i="${i}"><b class="${on?"strike":""}">${esc(e.n)}</b>${meta.length||e.obs?`<span class="small muted" style="display:block">${esc(meta.join(" · "))}${e.obs?(meta.length?" · ":"")+esc(e.obs):""}</span>`:""}</button><span class="mv"><button data-a="trMv" data-i="${i}" data-d="-1" aria-label="Subir" ${i?"":"disabled"}>${ic("chevron-up")}</button><button data-a="trMv" data-i="${i}" data-d="1" aria-label="Descer" ${i<ex.length-1?"":"disabled"}>${ic("chevron-down")}</button></span></div>`;}).join("")
    :`<div class="note">Nenhum exercício no Treino ${esc(tr.letra)}. Adicione abaixo: o nome e, se quiser, séries × repetições (ex.: 4x12).</div>`;
  h+=`<div class="qadd" style="margin-top:12px"><input id="trN" placeholder="Ex.: Supino reto" data-enter="trAdd" aria-label="Exercício"><input id="trS" style="flex:0 0 84px" placeholder="4x12" data-enter="trAdd" aria-label="Séries e repetições"><button class="btn" data-a="trAdd" aria-label="Adicionar exercício">${ic("plus")}</button></div>`;
  VIEW.trId=tr.id;return `<div class="app">${h}</div>`;}
const curTr=()=>getD(VIEW.trId)||treinos()[0];
ACT.trSel=el=>{VIEW.trId=el.dataset.id;rr();};
ACT.trNovo=()=>{const T=treinos();const L="ABCDEFGHIJ".split("").find(l=>!T.some(t=>t.letra===l))||String(T.length+1);const d=save({id:"tr_"+nid(),c:"tr",letra:L,nome:"",o:Math.max(...T.map(t=>t.o||0))+10,ex:[]});VIEW.trId=d.id;rr();};
ACT.trEdit=()=>{const tr=curTr();const F=[{k:"letra",l:"Letra",ph:"A"},{k:"nome",l:"Foco do treino",ph:"Ex.: Peito, ombro e tríceps"}];
  sheet(`<h2>Treino ${esc(tr.letra)}</h2>${F.map(f=>fieldHTML(f,tr[f.k])).join("")}<div class="btns"><button class="btn full" id="tS">Salvar</button>${treinos().length>1?`<button class="btn danger full" id="tX">Apagar treino</button>`:""}</div>`,s=>{
    s.querySelector("#tS").onclick=()=>{const o=readFields(F,s);tr.letra=(o.letra||tr.letra).toUpperCase().slice(0,3);tr.nome=o.nome;save(tr);closeSheet();rr();};
    const x=s.querySelector("#tX");if(x)x.onclick=()=>confirmSheet("Apagar o Treino "+tr.letra+"?","Os exercícios dele também serão apagados.","Apagar",()=>{removeDoc(tr.id);VIEW.trId="";rr();});});};
ACT.trAdd=()=>{const tr=curTr(),n=$("trN"),s=$("trS");const nome=n.value.trim();if(!nome)return n.focus();const m=(s.value||"").match(/(\d+)\s*[x×*]\s*(\d+(?:\s*-\s*\d+)?)/i);
  tr.ex=(tr.ex||[]).concat({id:nid(),n:nome,series:m?m[1]:(s.value.trim()&&!m?s.value.trim():""),reps:m?m[2].replace(/\s/g,""):"",carga:"",desc:"",obs:""});save(tr);rr();const nn=$("trN");if(nn)nn.focus();};
ACT.trCk=el=>{const tr=curTr(),t=TODAY(),id=el.dataset.e;const d=getD(trcId(tr.id,t))||{id:trcId(tr.id,t),c:"trc",tr:tr.id,d:t,done:[]};
  const was=trDone(tr,t).length>=tr.ex.length;d.done=d.done.includes(id)?d.done.filter(x=>x!==id):d.done.concat(id);save(d);
  const now=trDone(tr,t).length;if(!was&&now>=tr.ex.length&&tr.ex.length){if(!trkHas("gym",t))save({id:tid("gym",t),c:"trk",k:"gym",d:t,t:"Treino "+tr.letra,s:tr.nome||""});toast("medal","Treino "+tr.letra+" concluído!","Dia marcado no calendário da Academia.");}
  rr();};
ACT.trReset=()=>{const tr=curTr();const d=getD(trcId(tr.id,TODAY()));if(d){d.done=[];save(d);}rr();};
ACT.trMv=el=>{const tr=curTr(),i=+el.dataset.i,j=i+ +el.dataset.d;if(j<0||j>=tr.ex.length)return;[tr.ex[i],tr.ex[j]]=[tr.ex[j],tr.ex[i]];save(tr);rr();};
ACT.trExEdit=el=>{const tr=curTr(),i=+el.dataset.i,e=tr.ex[i];const F=[{k:"n",l:"Exercício"},{k:"series",l:"Séries",type:"number",ph:"4"},{k:"reps",l:"Repetições",ph:"12 ou 10-12"},{k:"carga",l:"Carga",ph:"Ex.: 20 kg"},{k:"desc",l:"Descanso",ph:"Ex.: 60 s"},{k:"obs",l:"Observação",type:"textarea",ph:"Ex.: Pegada fechada, cadência lenta"}];
  sheet(`<h2>${esc(e.n)}</h2><div class="muted small">Treino ${esc(tr.letra)}</div>${F.map(f=>fieldHTML(f,e[f.k])).join("")}<div class="btns"><button class="btn full" id="xS">Salvar</button><button class="btn danger full" id="xX">Remover exercício</button></div>`,s=>{
    s.querySelector("#xS").onclick=()=>{const o=readFields(F,s);o.series=o.series===""?"":String(o.series);Object.assign(e,o);if(!e.n)e.n="Exercício";save(tr);closeSheet();rr();};
    s.querySelector("#xX").onclick=()=>{tr.ex.splice(i,1);save(tr);closeSheet();rr();};});};

/* ================= ORGANIZAÇÃO: INÍCIO E MÓDULOS ================= */
/* Agenda (Calendário), Hábitos e Lembretes ficam só na barra de baixo. */
const MOD_GROUPS=[["Treinos e corpo",["gym","run","swim","cap","hiit","mara"]],["Rotina e espiritualidade",["bib","man","fiz"]],["Estudos e crescimento",["conc","aprend","livros","audio","habil"]],
  ["Metas",["ano"]],["Dinheiro",["gastos","contas","renda"]],["Trabalho e cultura",["editais","prof"]],["Vida pessoal",["casa","foto","notas"]]];
function modsGrid(){return MOD_GROUPS.map(([g,ks])=>`<div class="grp">${esc(g)}</div><div class="grid">${ks.filter(k=>MODS[k]).map(k=>`<button class="tile" ${mstyle(k)} data-a="go" data-v="${gv(MODS[k].v)}"><span class="mb">${ic(MODS[k].ic)}</span>${esc(MODS[k].n)}</button>`).join("")}</div>`).join("");}
VIEWS.mods=()=>`<div class="app"><header class="top"><span class="mb" style="background:var(--brand)">${ic("layout-grid")}</span><h1>Módulos</h1><button class="ib" data-a="go" data-v="${gv({v:"ajustes"})}" aria-label="Ajustes">${ic("settings")}</button></header>
  <div class="note" style="--c1:#4F46E5">${ic("info")} Agenda, Hábitos e Lembretes ficam na barra de baixo, sempre à mão.</div>${modsGrid()}</div>`;

/* ================= MAIS FRASES ================= */
FRASES.push(
["Não vivo por oportunidades, vivo por propósito.","Luciano Subirá"],
["A minha vida não é orientada por oportunidades, a minha vida é orientada por propósito.","Luciano Subirá"],
["É exatamente em momentos de conflitos que os aprovados se manifestam.","Luciano Subirá"],
["Agradar o coração de Deus requer de nós dedicação.","Luciano Subirá"],
["A oração não é uma arma de guerra. A oração é a própria guerra!","Luciano Subirá"],
["Caráter tem a ver com os valores que cultivamos no íntimo, os quais nos obrigamos a praticar mesmo sem ninguém para observar.","Luciano Subirá"],
["Uma só coisa é necessária! Nada é mais importante do que a nossa concentração em buscar a Deus sem distração alguma.","Luciano Subirá"],
["No ambiente de oração, Deus deveria conseguir tudo aquilo que Ele quer de nós.","Luciano Subirá"],
["Ou o Senhor muda aquilo que enfrentamos, ou Ele nos muda.","Luciano Subirá"],
["Quando eles descem o nível, nós subimos.","Michelle Obama"],
["Sucesso não é sobre quanto dinheiro você ganha, mas sobre a diferença que você faz na vida das pessoas.","Michelle Obama"],
["Sua história é o que você tem, o que sempre terá. É algo para assumir como seu.","Michelle Obama"],
["O fracasso é parte importante do seu crescimento e da sua resiliência. Não tenha medo de falhar.","Michelle Obama"],
["A verdadeira medida de um homem não é como ele se comporta em momentos de conforto, mas como se mantém em tempos de desafio.","Martin Luther King Jr."],
["Devemos aceitar a decepção finita, mas nunca perder a esperança infinita.","Martin Luther King Jr."],
["No fim, não nos lembraremos das palavras dos nossos inimigos, mas do silêncio dos nossos amigos.","Martin Luther King Jr."],
["Se alguém é chamado para varrer ruas, deve varrê-las como Michelangelo pintava.","Martin Luther King Jr."],
["Eu tenho um sonho.","Martin Luther King Jr."],
["Não é porque as coisas são difíceis que não ousamos; é porque não ousamos que elas são difíceis.","Sêneca"],
["Sofremos mais na imaginação do que na realidade.","Sêneca"],
["Enquanto adiamos, a vida passa.","Sêneca"],
["Não é que tenhamos pouco tempo; é que desperdiçamos muito.","Sêneca"],
["A vida é longa, se você souber usá-la.","Sêneca"],
["Nenhum vento é favorável para quem não sabe a que porto se dirige.","Sêneca"],
["Enquanto ensinamos, aprendemos.","Sêneca"],
["Pobre não é quem tem pouco, mas quem deseja mais.","Sêneca"],
["Comece a viver agora e conte cada dia como uma vida à parte.","Sêneca"],
["Governar a si mesmo é o maior dos poderes.","Sêneca"],
["Às vezes, até viver é um ato de coragem.","Sêneca"],
["Se queres ser amado, ama.","Sêneca"],
["O fogo prova o ouro; a adversidade, os fortes.","Sêneca"],
["Nada me parece mais infeliz do que quem nunca enfrentou uma adversidade.","Sêneca"],
["Onde houver um ser humano, há uma oportunidade para a bondade.","Sêneca"],
["O que a razão não conseguiu curar, muitas vezes o tempo curou.","Sêneca"],
["Os ventos e as ondas estão sempre do lado dos navegadores mais habilidosos.","Edward Gibbon"],
["Todo homem recebe duas educações: a que lhe dão os outros e outra, mais importante, que ele dá a si mesmo.","Edward Gibbon"],
["O sucesso de uma pessoa pode ser medido pelo número de conversas desconfortáveis que ela está disposta a ter.","Tim Ferriss"],
["O que mais tememos fazer é, geralmente, o que mais precisamos fazer.","Tim Ferriss"],
["Estar ocupado é uma forma de preguiça: pensamento preguiçoso e ação indiscriminada.","Tim Ferriss"],
["“Algum dia” é uma doença que vai levar seus sonhos para o túmulo com você.","Tim Ferriss"],
["Definir metas é o primeiro passo para transformar o invisível em visível.","Tony Robbins"],
["Para onde vai o foco, flui a energia.","Tony Robbins"],
["Não é a falta de recursos, é a falta de engenhosidade que impede o sucesso.","Tony Robbins"],
["É nos momentos de decisão que o seu destino é traçado.","Tony Robbins"],
["A qualidade da sua vida é a qualidade dos seus relacionamentos.","Tony Robbins"],
["A força não vem da capacidade física. Vem de uma vontade indomável.","Mahatma Gandhi"],
["O fraco nunca pode perdoar. O perdão é um atributo dos fortes.","Mahatma Gandhi"],
["Viva como se fosse morrer amanhã. Aprenda como se fosse viver para sempre.","Mahatma Gandhi"],
["Felicidade é quando o que você pensa, o que você diz e o que você faz estão em harmonia.","Mahatma Gandhi"],
["O futuro depende do que você faz hoje.","Mahatma Gandhi"]
);

/* ================= MIGRAÇÃO: Metas → Metas do ano (blocos) ================= */
function migrateData(){const MAP={"Saúde e corpo":"Físico","Finanças":"Financeiro","Carreira":"Profissional","Estudos":"Profissional","Cultura e arte":"Profissional","Relacionamento":"Relacionamento","Espiritualidade":"Espiritual"};
  all("metas").forEach(m=>{const n={...m,id:"ano_"+m.id.replace(/^metas_/,""),c:"ano",ano:String((m.prazo||"").slice(0,4)||yNow()),area:MAP[m.area]||m.area||"Físico"};save(n);removeDoc(m.id);});
  all("ano").forEach(a=>{if(MAP[a.area]&&MAP[a.area]!==a.area){a.area=MAP[a.area];save(a);}});}

/* ================= NOTAS DOS EDITAIS ================= */
function edNotas(ano){return all("edn").filter(n=>!ano||String(n.ano||"2026")===String(ano)).sort((a,b)=>(a.feito?1:0)-(b.feito?1:0)||(b.u||0)-(a.u||0));}
function edNotasCount(eid){return all("edn").filter(n=>n.ed===eid&&!n.feito).length;}
const EDN_SUG=["Fazer a prestação de contas","Falta documento:","Aguardando resultado","Assinar o termo","Enviar recurso até","Conferir pagamento"];
ACT.ednOpen=el=>{VIEW.ednEd=el&&el.dataset&&el.dataset.ed||"";ednRender();};
function ednRender(){const y=VIEW.ano||"2026",fe=VIEW.ednEd||"";const E=edsDoAno(y);const L=edNotas(y).filter(n=>!fe||n.ed===fe);const pend=L.filter(n=>!n.feito);
  sheet(`<h2>${ic("notebook-pen")} Notas dos editais ${esc(y)}</h2><p class="muted small">Pendências e lembretes de cada edital. Marque ✓ quando resolver.</p>
   <div class="tabs"><button data-a="ednF" data-ed="" aria-pressed="${!fe}">Todas</button>${E.map(e=>`<button data-a="ednF" data-ed="${e.id}" aria-pressed="${fe===e.id}">${esc(e.nome)}</button>`).join("")}</div>
   <label class="fld" style="margin-top:6px"><span>Nova nota</span><textarea id="ednT" style="min-height:70px" placeholder="Ex.: Falta enviar o relatório de execução"></textarea></label>
   <div class="wrap-row" style="margin:-4px 0 8px">${EDN_SUG.map(s=>`<button class="chip" style="padding:6px 10px" data-a="ednSug" data-t="${esc(s)}">${esc(s)}</button>`).join("")}</div>
   <div class="row"><select id="ednE" style="flex:1;min-width:0;border:1.5px solid var(--line);border-radius:12px;padding:10px;background:var(--sf)"><option value="">Geral (sem edital específico)</option>${E.map(e=>`<option value="${e.id}" ${fe===e.id?"selected":""}>${esc(e.nome)}</option>`).join("")}</select><button class="btn" data-a="ednAdd">${ic("plus")} Salvar</button></div>
   <div class="grp">Pendentes<span class="chip a">${pend.length}</span></div>
   ${L.length?L.map(n=>{const ed=n.ed?getD(n.ed):null;return `<div class="item"><button class="ck ${n.feito?"on":""}" data-a="ednT" data-id="${n.id}" aria-label="Resolvida">${ic("check")}</button><div class="ibody"><b class="${n.feito?"strike":""}" style="white-space:pre-wrap;font-weight:700">${esc(n.t)}</b><div class="meta">${ed?`<span class="chip m">${esc(ed.nome)}</span>`:`<span class="chip">Geral</span>`}<span class="chip">${new Date(n.cr||n.u||Date.now()).toLocaleDateString("pt-BR")}</span></div></div><button class="ib" style="width:32px;height:32px" data-a="ednX" data-id="${n.id}" aria-label="Apagar nota">${ic("trash-2")}</button></div>`;}).join(""):`<div class="note">Nenhuma nota ${fe?"neste edital":"ainda"}.</div>`}
   <div class="btns"><button class="btn ghost full" data-a="close">Fechar</button></div>`);}
ACT.ednF=el=>{VIEW.ednEd=el.dataset.ed;ednRender();};
ACT.ednSug=el=>{const t=$("ednT");t.value=(t.value?t.value+" ":"")+el.dataset.t+(el.dataset.t.endsWith(":")||el.dataset.t.endsWith("até")?" ":"");t.focus();};
ACT.ednAdd=()=>{const t=$("ednT").value.trim();if(!t)return $("ednT").focus();save({id:"edn_"+nid(),c:"edn",t,ed:$("ednE").value,ano:VIEW.ano||"2026",feito:false,cr:Date.now()});VIEW.ednEd=$("ednE").value||VIEW.ednEd;rr();ednRender();toast("notebook-pen","Nota salva","");};
ACT.ednT=el=>{const n=getD(el.dataset.id);n.feito=!n.feito;save(n);rr();ednRender();};
ACT.ednX=el=>{removeDoc(el.dataset.id);rr();ednRender();};

/* ================= FOTOS DISPONÍVEIS OFFLINE ================= */
ACT.fOffline=async()=>{const F=getD(VIEW.f);if(!F)return;if(DB.be.kind!=="firebase")return toast("check","Já disponível offline","As fotos ficam guardadas neste aparelho.");
  const ph=descend(F.id).flatMap(id=>photosIn(id));if(!ph.length)return toast("info","Nenhuma foto neste álbum","");
  const bar=document.createElement("div");bar.className="toast";bar.innerHTML=`<span class="ti">${ic("download")}</span><div><b>Salvando para ver offline</b><span id="ofn">0 de ${ph.length}</span></div>`;$("toasts").appendChild(bar);let ok=0;
  for(let i=0;i<ph.length;i++){try{await FireImgs.url(ph[i].img.t);if(!(await offHas(ph[i].img.f)))await FireImgs.url(ph[i].img.f);ok++;}catch(e){}const n=$("ofn");if(n)n.textContent=(i+1)+" de "+ph.length;}
  bar.remove();F.off=Date.now();save(F);rr();toast(ok===ph.length?"check":"triangle-alert",ok===ph.length?"Álbum disponível offline":"Algumas fotos não foram salvas",ok+" de "+ph.length+" fotos no aparelho");};
