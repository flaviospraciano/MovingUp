"use strict";
/* ======================================================================
   4.2 · CARTAS QUE ABREM COM O ACONTECIMENTO · VOCÊ CONTRA O VOCÊ DO MÊS PASSADO · EXPORTAR A SUA VIDA
   · Carta "quando eu terminar a maratona", "quando passar no IBGE": o app liga a carta sozinho ao compromisso da agenda
     que combina com ela (e a um compromisso criado depois) e abre quando acontece. Corrida de 42 km também abre a da maratona.
     Acontecimentos de resultado (passar, ser aprovado) pedem a sua confirmação antes de abrir.
   · Você contra o você do mês passado: os mesmos dias do mês anterior, métrica por métrica, com placar e o que falta para virar.
   · Exportar a sua vida: planilha do Excel com uma aba por setor e um .zip com um Markdown por setor.
   ====================================================================== */
/* ---------- cartas por acontecimento ---------- */
const CARTA_NUNCA="9999-12-31";
const CARTA_EX=["quando eu terminar a maratona","quando passar no IBGE","quando eu correr 21 km","no dia do meu casamento"];
const CARTA_PARE=new Set(["quando","eu","meu","minha","meus","minhas","terminar","termine","passar","passe","concluir","acabar","chegar","fizer","fazer","depois","primeira","primeiro","dia","no","na","em","do","da","de","o","a","um","uma","for","ser","estar","tiver","conseguir","completar","correr"]);
function cartaCond(txt){const n=normTxt(txt||"").replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim();if(!n)return null;
  const kw=n.split(" ").filter(w=>w.length>=3&&!CARTA_PARE.has(w)).slice(0,6);let fato=null,km=0;
  if(/maratona/.test(n)){fato="km";km=42;}const m=n.match(/(\d+(?:[.,]\d+)?)\s*(?:km|k\b|quilometros)/);if(m){fato="km";km=num(m[1]);}
  const conf=/(passar|passei|aprovad|aprova|ganhar|venc|conseguir|nomead|chamad|resultado|contratad|casar|nascer)/.test(n)&&!/maratona/.test(n);
  const t=TODAY();const cands=all("ev").filter(e=>(e.ate||e.d)>=t).map(e=>{const et=normTxt(e.t+" "+(e.nota||""));return{e,s:kw.filter(w=>et.includes(w)).length};}).filter(x=>x.s>0).sort((a,b)=>b.s-a.s||a.e.d.localeCompare(b.e.d));
  const ev=cands[0]&&cands[0].e;return{txt:String(txt).trim(),kw,fato,km,conf,ev:ev?ev.id:null};}
const cartaEvTxt=C=>{const e=C&&C.ev&&getD(C.ev);return e?`${e.t} · ${fdate(e.d)}${e.h?" às "+e.h:""}`:"";};
function cartaLinkTxt(C){if(!C)return"";const e=cartaEvTxt(C);const p=[];if(e)p.push(`Ligada ao compromisso <b>${esc(e)}</b>: abre ${C.conf?"quando você confirmar que aconteceu":"quando esse dia passar"}.`);
  if(C.fato==="km")p.push(`Abre sozinha quando você registrar uma corrida de ${String(C.km).replace(".",",")} km ou mais.`);
  if(!p.length)p.push(C.conf?"Quando acontecer, toque em <b>Aconteceu</b> na carta selada. Se você marcar um compromisso que combine com ela, eu ligo sozinho.":"Se você marcar na agenda um compromisso que combine com ela, eu ligo sozinho. Ou toque em Aconteceu quando chegar a hora.");return p.join(" ");}
cartaForm=function(){const ci=typeof cicAberto==="function"?cicAberto():null,t=TODAY();
  const ops=[];if(ci&&cicFim(ci)>t)ops.push(["ciclo","Fim do ciclo",addDays(cicFim(ci),1),"Fim do "+ci.nome]);
  ops.push(["6m","Em 6 meses",iso(new Date(pd(t).setMonth(pd(t).getMonth()+6))),""],["1a","Em 1 ano",addDays(t,365),""],["evento","Quando acontecer…","",""],["outra","Outra data","",""]);
  sheet(`<h2>Carta para o futuro</h2><p class="muted small" style="margin:4px 0 0">Conte como está hoje, o que espera ter conquistado e o que não quer esquecer.</p>
   <label class="fld"><span>Sua carta</span><textarea id="caT" class="tall" placeholder="Oi, eu do futuro…" autofocus></textarea></label>
   <div class="fld"><span>Quando entregar</span><div class="seg" data-k="caQ">${ops.map(([k,n,d,o],i)=>`<button type="button" data-a="cartaQuando" data-v="${k}" data-d="${d}" data-o="${esc(o)}" aria-pressed="${i===0}">${n}</button>`).join("")}</div></div>
   <div class="two" id="caDW"><label class="fld"><span>Data</span><input id="caD" type="date" min="${addDays(t,1)}" value="${ops[0][2]}"></label><label class="fld"><span>Ocasião (opcional)</span><input id="caO" value="${esc(ops[0][3])}" placeholder="Ex.: dia da prova"></label></div>
   <div id="caEvW" class="hidden"><label class="fld"><span>Quando acontecer o quê?</span><input id="caEv" placeholder="Ex.: quando eu terminar a maratona" data-in="cartaEvIn"></label>
    <div class="wrap-row">${CARTA_EX.map(x=>`<button type="button" class="chip" data-a="cartaEx" data-t="${esc(x)}">${esc(x)}</button>`).join("")}</div><div id="caLink" class="note tiny" style="margin-top:8px">Escreva o acontecimento e eu procuro na sua agenda.</div></div>
   <div class="btns"><button class="btn full" id="caS">${ic("lock")} Selar carta</button></div>`,s=>{
  s.querySelector("#caS").onclick=()=>{const texto=s.querySelector("#caT").value.trim();if(texto.length<10)return toast("triangle-alert","Escreva a carta","Algumas linhas já valem.");
    const modo=(s.querySelector('[data-k="caQ"] [aria-pressed="true"]')||{}).dataset||{};
    if(modo.v==="evento"){const C=cartaCond(s.querySelector("#caEv").value);if(!C)return toast("triangle-alert","Diga o acontecimento","Ex.: quando eu terminar a maratona");
      save({id:"carta_"+nid(),c:"carta",texto,escrita:TODAY(),entrega:CARTA_NUNCA,ocasiao:C.txt.charAt(0).toUpperCase()+C.txt.slice(1),cond:C,aberta:false});closeSheet();rr();toast("lock","Carta selada",C.ev?"Ligada a: "+cartaEvTxt(C):"Abre quando acontecer.");return;}
    const d=s.querySelector("#caD").value;if(!d||d<=TODAY())return toast("triangle-alert","Escolha uma data futura","");
    save({id:"carta_"+nid(),c:"carta",texto,escrita:TODAY(),entrega:d,ocasiao:s.querySelector("#caO").value.trim(),aberta:false});closeSheet();rr();toast("lock","Carta selada","Abre em "+fdate(d)+". Até lá, nem você lê.");};});};
const _cartaQ69=ACT.cartaQuando;ACT.cartaQuando=el=>{const ev=el.dataset.v==="evento",w=$("caEvW"),dw=$("caDW");if(w)w.classList.toggle("hidden",!ev);if(dw)dw.classList.toggle("hidden",ev);
  if(ev){ACT.seg(el);const i=$("caEv");if(i)setTimeout(()=>i.focus(),50);return;}return _cartaQ69(el);};
ACT.cartaEx=el=>{const i=$("caEv");if(!i)return;i.value=el.dataset.t;CH.cartaEvIn(i);};
CH.cartaEvIn=el=>{const L=$("caLink");if(!L)return;const C=cartaCond(el.value);L.innerHTML=C?cartaLinkTxt(C):"Escreva o acontecimento e eu procuro na sua agenda.";};
/* abre quando acontece */
function cartaAconteceu(c){const C=c.cond;if(!C)return false;const t=TODAY(),now=new Date();
  if(C.fato==="km"&&all("trk").some(x=>x.k==="run"&&x.d>=c.escrita&&(+x.km||0)>=C.km-.2))return true;
  const e=C.ev&&getD(C.ev);if(e&&!C.conf){const fim=e.ate||e.d;if(fim<t)return true;if(fim===t&&e.h&&now-dtOf(fim,e.h)>4*3600e3)return true;}return false;}
function cartaChegou(c){c.entrega=TODAY();c.cond=Object.assign({},c.cond,{ok:TODAY()});save(c);try{notify("Chegou uma carta para você",(c.ocasiao||"Carta")+" · escrita em "+fdate(c.escrita));}catch(e){}}
let CARTA_PERG=new Set();
function cartaChecar(){try{const t=TODAY();all("carta").filter(c=>c.cond&&!c.aberta&&c.entrega===CARTA_NUNCA).forEach(c=>{
    if(!c.cond.ev){const C=cartaCond(c.cond.txt);if(C&&C.ev){c.cond=Object.assign({},c.cond,{ev:C.ev});save(c);toast("link","Carta ligada à agenda",(c.ocasiao||"")+" → "+cartaEvTxt(C));}}
    if(cartaAconteceu(c))return cartaChegou(c);
    const e=c.cond.ev&&getD(c.cond.ev);if(c.cond.conf&&e&&(e.ate||e.d)<=t&&!CARTA_PERG.has(c.id)&&c.cond.perg!==t&&$("sheet").classList.contains("hidden")){CARTA_PERG.add(c.id);c.cond=Object.assign({},c.cond,{perg:t});save(c);
      sheet(`<div style="text-align:center"><span class="mb" style="margin:6px auto 10px;width:56px;height:56px;border-radius:16px;font-size:1.5rem" ${mstyle("carta")}>${ic("mail")}</span><h2>Chegou o dia: ${esc(e.t)}</h2><p class="muted">Você tem uma carta selada para <b>${esc(c.ocasiao||c.cond.txt)}</b>. Aconteceu?</p></div><div class="btns"><button class="btn full" data-a="cartaAcont" data-id="${c.id}">${ic("party-popper")} Aconteceu! Abrir a carta</button><button class="btn ghost full" data-a="closeSheet">Ainda não</button></div>`);}});}catch(e){console.warn("cartas",e);}}
ACT.cartaAcont=el=>{const c=getD(el.dataset.id);if(!c)return;cartaChegou(c);closeSheet();ACT.cartaAbrir({dataset:{id:c.id}});};
const _cartaSel69=ACT.cartaSelada;ACT.cartaSelada=el=>{const c=getD(el.dataset.id);if(!c||!c.cond)return _cartaSel69(el);const fut=all("ev").filter(e=>(e.ate||e.d)>=TODAY()).sort((a,b)=>a.d.localeCompare(b.d)).slice(0,30);
  sheet(`<div style="text-align:center"><span class="mb" style="margin:6px auto 10px;width:56px;height:56px;border-radius:16px;font-size:1.5rem" ${mstyle("carta")}>${ic("lock")}</span><h2>Carta selada</h2><p class="muted">Escrita em ${fdate(c.escrita)}. Abre <b>${esc(c.cond.txt)}</b>.</p></div>
   <div class="note small">${cartaLinkTxt(c.cond)}</div>
   ${fut.length?`<label class="fld"><span>Ligar a um compromisso da agenda</span><select id="caLig"><option value="">${c.cond.ev?"Tirar a ligação":"Escolha…"}</option>${fut.map(e=>`<option value="${e.id}" ${e.id===c.cond.ev?"selected":""}>${esc(e.t)} · ${fdate(e.d)}</option>`).join("")}</select></label>`:""}
   <div class="btns"><button class="btn full" id="caAc">${ic("party-popper")} Aconteceu! Abrir agora</button><button class="btn danger full" id="caX">Apagar carta</button></div>`,s=>{
   const L=s.querySelector("#caLig");if(L)L.onchange=()=>{c.cond=Object.assign({},c.cond,{ev:L.value||null});save(c);toast("link",L.value?"Carta ligada":"Ligação removida",L.value?cartaEvTxt(c.cond):"");};
   s.querySelector("#caAc").onclick=()=>confirmSheet("Aconteceu mesmo?",`A carta "${c.ocasiao||c.cond.txt}" abre agora e não volta a ser selada.`,"Abrir",()=>{cartaChegou(c);ACT.cartaAbrir({dataset:{id:c.id}});});
   s.querySelector("#caX").onclick=()=>confirmSheet("Apagar sem ler?","A carta vai para a lixeira por 5 dias.","Apagar",()=>{removeDoc(c.id);rr();});});};
const _cartaV69=VIEWS.carta;VIEWS.carta=function(){return _cartaV69.apply(this,arguments).replace(/, 31\/12\/9999/g,"");};
const _cartaF69=cartaFalta;cartaFalta=function(d){return d===CARTA_NUNCA?"abre quando acontecer":_cartaF69.apply(this,arguments);};
if(typeof pushFila==="function"){const _pf69=pushFila;pushFila=function(){return _pf69.apply(this,arguments).filter(x=>!(String(x.k).startsWith("carta_")&&x.at>Date.now()+2*365*864e5));};}
const _save69=save;save=function(doc){const r=_save69.apply(this,arguments);if(doc&&(doc.c==="trk"&&doc.k==="run"||doc.c==="ev")){clearTimeout(save.t69);save.t69=setTimeout(cartaChecar,1500);}return r;};
const _start69=startApp;startApp=function(){const r=_start69.apply(this,arguments);setTimeout(cartaChecar,3000);return r;};
setInterval(()=>{if(DB.be)cartaChecar();},15*60000);

/* ---------- você contra o você do mês passado ---------- */
const r1=v=>Math.round((+v||0)*10)/10;
const VS_M=[["Treinos","dumbbell",(a,b)=>all("trk").filter(x=>TREINO_KS.includes(x.k)&&x.d>=a&&x.d<=b).length,1],
  ["Km corridos","footprints",(a,b)=>r1(sum(all("trk").filter(x=>x.k==="run"&&x.d>=a&&x.d<=b).map(x=>+x.km||0))),1],
  ["Questões do IBGE","graduation-cap",(a,b)=>{const D=(getD("concq")||{d:{}}).d||{};return sum(Object.keys(D).filter(d=>d>=a&&d<=b).map(d=>D[d]||0));},1],
  ["Horas de foco","timer",(a,b)=>r1(sum(all("dia").filter(x=>x.d>=a&&x.d<=b).map(x=>+x.foco||0))/60),1],
  ["Tarefas feitas","list-checks",(a,b)=>all("todo").filter(x=>x.ok&&x.feito>=a&&x.feito<=b).length,1],
  ["Hábitos marcados","repeat",(a,b)=>sum(all("hab").map(h=>Object.keys(h.dias||{}).filter(d=>d>=a&&d<=b).length)),1],
  ["Dias de água na meta","droplet",(a,b)=>{const A=aguaCfg();return Object.keys(A.log||{}).filter(d=>d>=a&&d<=b&&+A.log[d]>=+A.meta).length;},1],
  ["Kegel","activity",(a,b)=>all("trk").filter(x=>x.k==="kegel"&&x.d>=a&&x.d<=b).length,1],
  ["Séries do desafio","flame",(a,b)=>{const D=desDados();return sum(Object.keys(D.log||{}).filter(d=>d>=a&&d<=b).map(d=>(D.log[d]||[]).filter(Boolean).length));},1],
  ["Gratidões","heart",(a,b)=>all("grat").filter(x=>x.d>=a&&x.d<=b).length,1],
  ["Gastos","wallet",(a,b)=>Math.round(sum(all("exp").filter(x=>x.d>=a&&x.d<=b).map(x=>+x.v||0))),-1]];
function vsCalc(){const n=new Date(),dia=n.getDate(),y=n.getFullYear(),m=n.getMonth();const a1=iso(new Date(y,m,1)),b1=TODAY();const ult=new Date(y,m,0).getDate();
  const a0=iso(new Date(y,m-1,1)),b0=iso(new Date(y,m-1,Math.min(dia,ult))),c0=iso(new Date(y,m-1,ult)),restam=new Date(y,m+1,0).getDate()-dia;
  const L=VS_M.map(([nome,ico,f,dir])=>{let v1=0,v0=0,vt=0;try{v1=f(a1,b1);v0=f(a0,b0);vt=f(a0,c0);}catch(e){}const ganha=dir>0?v1>v0:v1<v0,empata=v1===v0;return{nome,ico,dir,v1,v0,vt,ganha:!empata&&ganha,perde:!empata&&!ganha,falta:dir>0?Math.max(0,v0-v1):0,porDia:dir>0&&restam>0?Math.max(0,(vt-v1)/restam):0};}).filter(x=>x.v1||x.v0||x.vt);
  return{L,eu:L.filter(x=>x.ganha).length,ele:L.filter(x=>x.perde).length,mesA:MESES[(m+11)%12].toLowerCase(),mesB:MESES[m].toLowerCase(),dia,restam};}
const vsFmt=(x,v)=>x.nome==="Gastos"?money(v):String(v).replace(".",",");
function vsFrase(V){const virar=V.L.filter(x=>x.perde&&x.dir>0).sort((a,b)=>a.falta-b.falta)[0];if(!V.L.length)return"Registre treinos, estudos e tarefas: a disputa começa assim que houver números.";
  if(V.eu>V.ele)return `Você está vencendo o você de ${V.mesA} por ${V.eu} a ${V.ele}. Mantém o ritmo${virar?`, e dá para virar também em ${virar.nome.toLowerCase()}: faltam ${vsFmt(virar,r1(virar.falta))}.`:"."}`;
  if(V.eu===V.ele)return `Empate com o você de ${V.mesA}: ${V.eu} a ${V.ele}.${virar?` O desempate mais perto: ${virar.nome.toLowerCase()}, faltam ${vsFmt(virar,r1(virar.falta))}.`:""}`;
  return `O você de ${V.mesA} está na frente: ${V.ele} a ${V.eu}.${virar?` Comece virando ${virar.nome.toLowerCase()}: faltam só ${vsFmt(virar,r1(virar.falta))}.`:""} Ainda restam ${V.restam} dias.`;}
VIEWS.vsmes=()=>{const V=vsCalc();let h=topbar("Você contra o você do mês passado","fiz");
  h+=`<div class="vsplac"><div><span>Você em ${V.mesB}</span><b>${V.eu}</b></div><i>×</i><div><b>${V.ele}</b><span>Você de ${V.mesA}</span></div></div><p class="vsfr">${esc(vsFrase(V))}</p>
   <p class="tiny faint" style="text-align:center;margin:0 0 10px">Comparação justa: do dia 1 ao dia ${V.dia} de cada mês.</p>`;
  h+=V.L.map(x=>{const mx=Math.max(x.v1,x.v0,1);return `<div class="card vsit ${x.ganha?"ganha":x.perde?"perde":""}"><div class="row"><span class="mb">${ic(x.ico)}</span><b class="grow">${x.nome}</b><span class="chip ${x.ganha?"c":x.perde?"n":""}">${x.ganha?"você vence":x.perde?"ele vence":"empate"}</span></div>
     <div class="vsb"><span>${V.mesB}</span><i style="width:${x.v1/mx*100}%"></i><b>${vsFmt(x,x.v1)}</b></div><div class="vsb ant"><span>${V.mesA}</span><i style="width:${x.v0/mx*100}%"></i><b>${vsFmt(x,x.v0)}</b></div>
     <div class="tiny muted">${x.dir<0?(x.ganha?`Você gastou ${money(x.v0-x.v1)} a menos.`:x.perde?`Você gastou ${money(x.v1-x.v0)} a mais.`:""):x.perde?`Faltam ${vsFmt(x,r1(x.falta))} para empatar.`:""}${x.dir>0&&x.vt>x.v1&&V.restam>0?` Para passar ${V.mesA} inteiro (${vsFmt(x,x.vt)}): ${vsFmt(x,r1(x.porDia))} por dia.`:x.dir>0&&x.vt&&x.v1>=x.vt?` Já passou ${V.mesA} inteiro!`:""}</div></div>`;}).join("");
  h+=`<div class="btns"><button class="btn ghost full" data-a="semAbrir">${ic("image")} Sua semana em uma imagem</button></div>`;return `<div class="app">${h}</div>`;};
const _home69=VIEWS.home;VIEWS.home=function(){const h=_home69.apply(this,arguments);if(new Date().getDate()<3)return h;let V;try{V=vsCalc();}catch(e){return h;}if(V.L.length<2)return h;
  const c=`<button class="card vshome" data-a="go" data-v="${gv({v:"vsmes"})}"><span class="vsmini"><b>${V.eu}</b><i>×</i><b>${V.ele}</b></span><span class="grow"><b>Você contra o você de ${V.mesA}</b><span class="tiny muted" style="display:block">${esc(vsFrase(V))}</span></span>${ic("chevron-right")}</button>`;
  const i=h.indexOf('<div class="copi"');return i<0?h:h.slice(0,i)+c+h.slice(i);};

/* ---------- exportar a sua vida ---------- */
const EXP_SET=()=>{const ord=(a,b)=>String(a[0]).localeCompare(String(b[0]));const T=k=>(MODS[k]||{}).n||k;const sim=b=>b?"sim":"";
  const st=DB.docs.get("ibge")||{},D=st.dia||{},F={};all("dia").forEach(x=>{F[x.d]=+x.foco||0;});
  return[
  ["Treinos","Treinos e corpo",["Data","Tipo","Título","Detalhe","Km","Tempo","Ritmo","Foto"],all("trk").filter(x=>[...TREINO_KS,"kegel","des"].includes(x.k)).map(x=>[x.d,T(x.k),x.t||"",x.s||"",x.km||"",x.seg?fmtSeg(x.seg):"",x.k==="run"?fmtPace(x.seg,x.km):"",sim(x.img)]).sort(ord)],
  ["Rotina","Rotina e espiritualidade",["Data","O que","Título","Detalhe"],all("trk").filter(x=>!TREINO_KS.includes(x.k)&&!["kegel","des"].includes(x.k)).map(x=>[x.d,T(x.k),x.t||"",x.s||""]).sort(ord)],
  ["Estudos","Estudos para o IBGE e foco",["Data","Questões","Acertos","% de acerto","Minutos de foco"],[...new Set(Object.keys(D).concat(Object.keys(F)))].sort().map(d=>{const q=(D[d]||{}).q||0,a=(D[d]||{}).ac||0;return[d,q,a,q?Math.round(a/q*100):"",F[d]||0];})],
  ["Simulados","Simulados do IBGE",["Data","Tipo","Nota","Total","%","Português","Matemática","Técnicos","Minutos"],(st.sims||[]).map(s=>[s.d,s.tipo,s.nota,s.tot,s.pc,s.por??"",s.mat??"",s.tec??"",s.min||""])],
  ["Tarefas","Tarefas",["Dia","Tarefa","Importante","Feita em","Situação"],all("todo").map(x=>[x.de||x.d,x.t,sim(x.imp),x.feito||"",x.ok?"feita":"pendente"]).sort(ord)],
  ["Hábitos","Hábitos",["Data","Hábito"],[].concat(...all("hab").map(h=>Object.keys(h.dias||{}).map(d=>[d,h.nome]))).sort(ord)],
  ["Água","Água",["Data","Copos","Meta","Bateu a meta"],(()=>{const A=aguaCfg();return Object.keys(A.log||{}).sort().map(d=>[d,+A.log[d],+A.meta,sim(+A.log[d]>=+A.meta)]);})()],
  ["Gastos","Gastos",["Data","Descrição","Categoria","Pagamento","Valor (R$)"],all("exp").map(x=>[x.d,x.desc||"",x.cat||"",x.pag||"",r2d(x.v)]).sort(ord)],
  ["Contas","Contas a pagar e a receber",["Vencimento","Tipo","Descrição","De/para","Valor (R$)","Situação","Pago em","Mensal","Edital"],all("conta").map(c=>[c.semData?"sem data":c.venc,c.tipo,c.desc,c.quem||"",r2d(c.valor),c.status,c.pagoEm||"",sim(c.rep==="m"),sim(c.ed)]).sort(ord)],
  ["Editais","Editais da cultura",["Ano","Edital","Pessoa","Situação","Valor do edital","%","Ganho","Recebido","Falta","Previsão"],[].concat(...all("ed").map(e=>(e.pess||[]).map(p=>[edAno(e),e.nome,p.n,estOf(p.st)[1],+p.val||"",+p.pct||"",r2d(ganhoP(p)),r2d(recP(p)),r2d(Math.max(0,ganhoP(p)-recP(p))),p.prev||""])))],
  ["Agenda","Agenda",["Data","Até","Hora","Compromisso","Tipo","Local","Anotações"],all("ev").map(e=>[e.d,e.ate||"",e.h||"",e.t,((EVC.find(c=>c[0]===e.cat)||[])[1])||"",e.local||"",e.nota||""]).sort(ord)],
  ["Lembretes","Lembretes",["Data","Hora","Lembrete","Repete","Feito"],all("rem").map(r=>[r.d||"",r.h||"",r.t,r.rep||"",sim(r.feito)]).sort(ord)],
  ["Segundo cérebro","Segundo cérebro",["Data","Tipo","Título","Texto"],all("cer").map(n=>[n.d||"",(CER_T&&CER_T[n.tipo]?CER_T[n.tipo][0]:n.tipo)||"",n.t||"",n.x||""]).sort(ord)],
  ["Gratidão","Gratidão",["Data","Gratidão"],all("grat").map(g=>[g.d,g.t||""]).sort(ord)],
  ["Cartas","Cartas para o futuro",["Escrita em","Abre","Ocasião","Situação","Texto"],all("carta").map(c=>[c.escrita,c.cond?c.cond.txt:c.entrega,c.ocasiao||"",c.aberta?"lida":"selada",c.aberta?c.texto:"(selada)"]).sort(ord)]].filter(s=>s[3].length);};
function expXLSXcarrega(){if(window.XLSX)return Promise.resolve(window.XLSX);return new Promise((res,rej)=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";s.onload=()=>res(window.XLSX);s.onerror=()=>rej(new Error("xlsx"));document.head.appendChild(s);});}
async function expEntregar(blob,nome){const f=new File([blob],nome,{type:blob.type});try{if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:nome});return;}}catch(e){if(e&&e.name==="AbortError")return;}
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=nome;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},3000);}
ACT.expXlsx=async el=>{el.disabled=true;const o=el.innerHTML;el.innerHTML=`${ic("hourglass")} Montando a planilha…`;try{const X=await expXLSXcarrega(),wb=X.utils.book_new(),S=EXP_SET();
    const res=[["Setor","Registros","Primeiro","Último"]].concat(S.map(s=>[s[1],s[3].length,s[3][0]?s[3][0][0]:"",s[3].length?s[3][s[3].length-1][0]:""]));
    const add=(nome,linhas)=>{const ws=X.utils.aoa_to_sheet(linhas);ws["!cols"]=linhas[0].map((_,j)=>({wch:Math.min(60,Math.max(8,...linhas.slice(0,400).map(r=>String(r[j]==null?"":r[j]).length+2)))}));if(linhas.length>1)ws["!autofilter"]={ref:X.utils.encode_range({s:{r:0,c:0},e:{r:linhas.length-1,c:linhas[0].length-1}})};X.utils.book_append_sheet(wb,ws,nome.slice(0,31));};
    add("Resumo",[["Moving Up · exportado em "+fdate(TODAY())],[]].concat(res));S.forEach(s=>add(s[0],[s[2]].concat(s[3])));
    const buf=X.write(wb,{type:"array",bookType:"xlsx"});await expEntregar(new Blob([buf],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}),`moving-up-vida-${TODAY()}.xlsx`);}
  catch(e){console.warn(e);toast("triangle-alert","Não consegui montar a planilha","Na primeira vez precisa de internet.");}finally{el.disabled=false;el.innerHTML=o;}};
/* zip sem compressão, com CRC32 */
const CRC_T=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
const crc32=u=>{let c=0xFFFFFFFF;for(let i=0;i<u.length;i++)c=CRC_T[(c^u[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0;};
function zipCriar(F){const en=new TextEncoder(),partes=[],cen=[];let off=0;const dt=new Date(),dtm=((dt.getHours()<<11)|(dt.getMinutes()<<5)|(dt.getSeconds()>>1))&65535,ddt=(((dt.getFullYear()-1980)<<9)|((dt.getMonth()+1)<<5)|dt.getDate())&65535;
  F.forEach(([nome,txt])=>{const n=en.encode(nome),d=en.encode(txt),c=crc32(d),h=new DataView(new ArrayBuffer(30));h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(8,0,true);h.setUint16(10,dtm,true);h.setUint16(12,ddt,true);h.setUint32(14,c,true);h.setUint32(18,d.length,true);h.setUint32(22,d.length,true);h.setUint16(26,n.length,true);h.setUint16(28,0,true);
    partes.push(new Uint8Array(h.buffer),n,d);const C=new DataView(new ArrayBuffer(46));C.setUint32(0,0x02014b50,true);C.setUint16(4,20,true);C.setUint16(6,20,true);C.setUint16(8,0x0800,true);C.setUint16(10,0,true);C.setUint16(12,dtm,true);C.setUint16(14,ddt,true);C.setUint32(16,c,true);C.setUint32(20,d.length,true);C.setUint32(24,d.length,true);C.setUint16(28,n.length,true);C.setUint32(42,off,true);cen.push(new Uint8Array(C.buffer),n);off+=30+n.length+d.length;});
  const tamC=cen.reduce((a,x)=>a+x.length,0),E=new DataView(new ArrayBuffer(22));E.setUint32(0,0x06054b50,true);E.setUint16(8,F.length,true);E.setUint16(10,F.length,true);E.setUint32(12,tamC,true);E.setUint32(16,off,true);
  return new Blob([...partes,...cen,new Uint8Array(E.buffer)],{type:"application/zip"});}
const mdC=v=>String(v==null?"":v).replace(/\|/g,"\\|").replace(/\r?\n/g," ");
function mdSetor([nome,tit,cab,L]){let s=`# ${tit}\n\n_Exportado do Moving Up em ${fdate(TODAY())} · ${L.length} ${L.length===1?"registro":"registros"}._\n`;
  if(nome==="Segundo cérebro")return s+"\n"+L.slice().reverse().map(r=>`## ${mdC(r[2])||"(sem título)"}\n\n_${r[1]} · ${r[0]}_\n\n${String(r[3]||"").trim()}\n`).join("\n");
  const G={};L.forEach(r=>{const k=/^\d{4}-\d\d/.test(String(r[0]))?String(r[0]).slice(0,7):"Sem data";(G[k]=G[k]||[]).push(r);});
  Object.keys(G).sort().reverse().forEach(k=>{s+=`\n## ${k==="Sem data"?k:MESES[+k.slice(5)-1]+" de "+k.slice(0,4)}\n\n| ${cab.map(mdC).join(" | ")} |\n| ${cab.map(()=>"---").join(" | ")} |\n`+G[k].map(r=>`| ${r.map(mdC).join(" | ")} |`).join("\n")+"\n";});return s;}
ACT.expMd=async el=>{el.disabled=true;try{const S=EXP_SET(),arqs=S.map(x=>[`${x[0]}.md`,mdSetor(x)]);
    const idx=`# A sua vida no Moving Up\n\nExportado em ${fdate(TODAY())}.\n\n| Setor | Registros | Arquivo |\n| --- | --- | --- |\n`+S.map(x=>`| ${x[1]} | ${x[3].length} | [${x[0]}.md](${encodeURI(x[0])}.md) |`).join("\n")+"\n";
    await expEntregar(zipCriar([["LEIA-ME.md",idx]].concat(arqs)),`moving-up-vida-${TODAY()}-markdown.zip`);}catch(e){console.warn(e);toast("triangle-alert","Não consegui montar o Markdown","");}finally{el.disabled=false;}};
VIEWS.exportar=()=>{const S=EXP_SET();let h=topbar("Exportar a sua vida","ajustes");
  h+=`<div class="note">${ic("download")} Tudo o que você registrou, separado por setor. Os arquivos ficam com você: dá para abrir no Excel, no Google Planilhas ou em qualquer editor de texto.</div>
   <div class="btns"><button class="btn full" data-a="expXlsx">${ic("sheet")} Planilha do Excel · uma aba por setor</button><button class="btn ghost full" data-a="expMd">${ic("file-text")} Markdown · um arquivo por setor (.zip)</button></div>
   <div class="grp">O que vai junto</div>${S.map(s=>`<div class="item"><span class="mb" style="background:var(--sf3);color:var(--soft)">${ic("table")}</span><div class="ibody"><b>${esc(s[1])}</b><span class="tiny muted">${s[3].length} ${s[3].length===1?"registro":"registros"} · ${esc(s[2].join(", "))}</span></div></div>`).join("")}
   <p class="tiny faint">As fotos não vão nos arquivos (ficam na nuvem do app). A cópia de segurança completa continua em Ajustes → Seus dados.</p>`;return `<div class="app">${h}</div>`;};
AJ42.push(()=>ajLinha("go","download","Exportar a sua vida","Planilha do Excel com uma aba por setor e Markdown por setor.").replace('data-a="go"',`data-a="go" data-v="${gv({v:"exportar"})}"`));
AJ42.push(()=>ajLinha("go","swords","Você contra o você do mês passado","Placar mês contra mês, métrica por métrica.").replace('data-a="go"',`data-a="go" data-v="${gv({v:"vsmes"})}"`));
