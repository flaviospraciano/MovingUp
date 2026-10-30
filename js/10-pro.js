"use strict";
/* ======================================================================
   MOVING UP · PRO
   1. Edital aprovado → conta a receber   2. Resumo semanal inteligente   3. Início que muda com a hora
   4. Copiloto por voz que executa        5. Gasto por foto                6. Modo discreto   7. Montanha da evolução
   ====================================================================== */
MODS.mont={n:"Montanha da evolução",ic:"mountain-snow",c1:"#4338CA",c2:"#4338CA",g:9,v:{v:"mont"}};
MODS.copi={n:"Copiloto",ic:"audio-lines",c1:"#4F46E5",c2:"#4F46E5",g:9};

/* ---------- 6. MODO DISCRETO ---------- */
const applyDisc=()=>document.documentElement.classList.toggle("disc",DISCRETO);applyDisc();
ACT.disc=()=>{DISCRETO=!DISCRETO;try{localStorage.setItem("mu_disc",DISCRETO?"1":"0");}catch(e){}applyDisc();rr();toast(DISCRETO?"eye-off":"eye",DISCRETO?"Modo discreto ligado":"Valores visíveis",DISCRETO?"Os valores ficam escondidos em todo o app.":"");};

/* ---------- 1. EDITAL APROVADO → CONTA A RECEBER ---------- */
let SYNC=false;
function edSync(e){if(!e||e.c!=="ed")return;SYNC=true;try{const P=e.pess||[],ids=new Set();
  P.forEach(p=>{const id="ct_ed_"+e.id+"_"+p.id;ids.add(id);const g=ganhoP(p),rc=Math.min(+p.rec||0,g),falta=Math.round((g-rc)*100)/100;const ex=getD(id);
    if(p.st!=="c"||!(g>0)){if(ex&&ex.status!=="paga")removeDoc(id);return;}
    if(falta<=0){if(ex&&ex.status!=="paga"){ex.status="paga";ex.pagoEm=TODAY();ex.valor=g;save(ex);}else if(!ex)save({id,c:"conta",tipo:"receber",auto:true,ed:e.id,pid:p.id,desc:e.nome+" · "+p.n,quem:e.nome,valor:g,venc:p.prev||TODAY(),status:"paga",pagoEm:TODAY()});return;}
    const d=ex||{id,c:"conta",tipo:"receber",auto:true,ed:e.id,pid:p.id};Object.assign(d,{desc:e.nome+" · "+p.n,quem:e.nome,valor:falta,venc:p.prev||(ex&&ex.venc)||addDays(TODAY(),30),status:"aberta",pagoEm:"",nota:rc>0?`Ganho total ${moneyRaw(g)} · já recebido ${moneyRaw(rc)}`:""});save(d);});
  all("conta").filter(c=>c.auto&&c.ed===e.id&&!ids.has(c.id)&&c.status!=="paga").forEach(c=>removeDoc(c.id));}finally{SYNC=false;}}
function contaToEdital(c){const e=getD(c.ed);if(!e)return;const p=(e.pess||[]).find(x=>x.id===c.pid);if(!p)return;SYNC=true;try{if(c.status==="paga"){c.recAntes=+p.rec||0;p.rec=ganhoP(p);}else{p.rec=c.recAntes||0;}save(e);}finally{SYNC=false;}edSync(e);}
const _save12=save;
save=function(doc){const r=_save12(doc);if(!SYNC){if(doc&&doc.c==="ed")edSync(doc);else if(doc&&doc.c==="conta"&&doc.auto)contaToEdital(doc);}return r;};
const _remove12=removeDoc;
removeDoc=function(id){const d=getD(id);_remove12(id);if(d&&d.c==="ed"&&!SYNC)all("conta").filter(c=>c.auto&&c.ed===id&&c.status!=="paga").forEach(c=>_remove12(c.id));};
function edSyncAll(){all("ed").forEach(edSync);}

/* ---------- 7. MONTANHA DA EVOLUÇÃO ---------- */
const BL=["Físico","Profissional","Financeiro","Relacionamento","Espiritual"];
const BLI={Físico:"dumbbell",Profissional:"briefcase",Financeiro:"coins",Relacionamento:"heart",Espiritual:"sparkles"};
function passos(desde){desde=desde||"0000";const t=TODAY();const B={Físico:0,Profissional:0,Financeiro:0,Relacionamento:0,Espiritual:0};let tot=0,hoje=0;
  const add=(d,n,b)=>{if(!d||d<desde)return;tot+=n;if(b)B[b]+=n;if(d===t)hoje+=n;};
  all("trk").forEach(x=>add(x.d,1,["gym","run","swim","cap","kegel"].includes(x.k)?"Físico":["bib","man"].includes(x.k)?"Espiritual":x.k==="conc"?"Profissional":null));
  all("trc").forEach(x=>{const tr=getD(x.tr);if(tr&&tr.ex&&tr.ex.length&&x.done.filter(id=>tr.ex.some(e=>e.id===id)).length>=tr.ex.length)add(x.d,1,"Físico");});
  all("hab").forEach(h=>Object.keys(h.dias||{}).forEach(d=>add(d,1,null)));
  all("fiz").forEach(f=>add(f.d,1,null));
  all("grat").forEach(g=>add(g.d,1,"Espiritual"));
  all("dia").forEach(x=>{if(x.domOk)add(x.d,2,"Profissional");(x.mits||[]).forEach(m=>{if(m.ok)add(x.d,1,null);});if(x.decl)add(x.d,1,"Espiritual");if(x.fechado)add(x.d,1,null);if(x.foco>=25)add(x.d,1,"Profissional");});
  all("ano").forEach(m=>{if(m.feito)add(iso(new Date(m.u||Date.now())),10,BL.includes(m.area)?m.area:null);});
  all("ed").forEach(e=>(e.pess||[]).forEach(p=>{if(p.st==="c")add(iso(new Date(e.u||Date.now())),10,"Profissional");}));
  all("conta").forEach(c=>{if(c.status==="paga"&&c.pagoEm)add(c.pagoEm,c.tipo==="receber"?2:1,"Financeiro");});
  const gd=new Set(all("exp").map(e=>e.d).filter(Boolean));gd.forEach(d=>add(d,1,"Financeiro"));
  all("livros").forEach(l=>add(l.fim,5,"Profissional"));all("aula").forEach(a=>{if(a.st==="pub")add(iso(new Date(a.u||Date.now())),3,"Profissional");});
  all("casa").forEach(c=>{if(c.feito)add(iso(new Date(c.u||Date.now())),5,"Relacionamento");});
  all("rpm").forEach(r=>(r.acoes||[]).forEach(a=>{if(a.ok)add(iso(new Date(r.u||Date.now())),1,BL.includes(r.area)?r.area:null);}));
  return{tot,B,hoje};}
const MONTES=["Morro do Início","Serra da Constância","Pico da Disciplina","Monte da Prosperidade","Cordilheira do Propósito","Cume da Excelência"];
function monteDe(tot){let need=0,k=0;while(true){const req=200*(k+1);if(tot<need+req)return{k,nome:MONTES[k%MONTES.length]+(k>=MONTES.length?" "+(Math.floor(k/MONTES.length)+1):""),frac:(tot-need)/req,falta:need+req-tot,req};need+=req;k++;}}
const MT_PATH="M30 282 L118 262 L70 236 L170 214 L112 186 L214 166 L150 138 L240 120 L182 96 L250 80 L206 58 L232 40";
function montSVG(o){const per=periodo();const sky=per==="noite"?["#0B1030","#1E1B4B"]:per==="tarde"?["#FDBA74","#FDE68A"]:["#93C5FD","#E0F2FE"];
  const M=o.m;const acamp=[.25,.5,.75].map((f,i)=>`<g class="mtcamp" data-f="${f}"><circle r="5" fill="#fff" stroke="#4338CA" stroke-width="2"/></g>`).join("");
  return `<svg viewBox="0 0 400 300" class="mtsvg ${o.mini?"mini":""}" role="img" aria-label="Montanha da evolução"><defs><linearGradient id="mSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient>
    <linearGradient id="mRock" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366F1"/><stop offset="1" stop-color="#312E81"/></linearGradient><linearGradient id="mRock2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A5B4FC"/><stop offset="1" stop-color="#6366F1"/></linearGradient></defs>
   <rect width="400" height="300" fill="url(#mSky)"/>
   ${per==="noite"?[...Array(24)].map((_,i)=>`<circle cx="${(i*67)%400}" cy="${(i*37)%140}" r="${i%3?1:1.6}" fill="#fff" opacity=".8"/>`).join(""):`<circle cx="${per==="tarde"?320:330}" cy="${per==="tarde"?70:52}" r="22" fill="${per==="tarde"?"#FB923C":"#FDE047"}" opacity=".95"/>`}
   <path d="M-10 300 L90 150 L150 210 L210 120 L280 200 L330 150 L410 300 Z" fill="url(#mRock2)" opacity=".55"/>
   <path d="M0 300 L232 30 L400 300 Z" fill="url(#mRock)"/><path d="M232 30 L210 62 L222 58 L232 70 L244 56 L256 64 Z" fill="#fff"/>
   <path d="M232 30 L330 300 L400 300 Z" fill="#1E1B4B" opacity=".35"/>
   <path id="mtPath" d="${MT_PATH}" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="2 6" stroke-linecap="round" opacity=".55"/>
   <path id="mtDone" d="${MT_PATH}" fill="none" stroke="#FDE047" stroke-width="4.5" stroke-linecap="round"/>
   ${acamp}<g transform="translate(232 40)"><line y1="0" y2="-26" stroke="#fff" stroke-width="2"/><path d="M0 -26 L18 -20 L0 -14 Z" fill="#F43F5E"/></g>
   <g id="mtMe"><circle r="9" fill="#F59E0B" stroke="#fff" stroke-width="3"/><circle r="3" fill="#fff"/></g>
   ${o.mini?"":`<text x="12" y="22" font-size="13" font-weight="900" fill="${per==="noite"?"#fff":"#1E1B4B"}">${esc(M.nome)}</text>`}</svg>`;}
function montAnimate(root,frac){const svg=root.querySelector("svg");if(!svg)return;const P=svg.querySelector("#mtPath"),D=svg.querySelector("#mtDone"),me=svg.querySelector("#mtMe");const L=P.getTotalLength();
  svg.querySelectorAll(".mtcamp").forEach(g=>{const p=P.getPointAtLength(L*(+g.dataset.f));g.setAttribute("transform",`translate(${p.x} ${p.y})`);});
  let from=0;try{from=+localStorage.getItem("mu_mtf")||0;}catch(e){}if(from>frac)from=0;const t0=performance.now(),dur=1600;D.style.strokeDasharray=L;
  const step=now=>{const k=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-k,3),f=from+(frac-from)*e;const p=P.getPointAtLength(L*f);me.setAttribute("transform",`translate(${p.x} ${p.y})`);D.style.strokeDashoffset=L*(1-f);if(k<1)requestAnimationFrame(step);else try{localStorage.setItem("mu_mtf",String(frac));}catch(x){}};
  requestAnimationFrame(step);}
VIEWS.mont=()=>{const S=passos(),M=monteDe(S.tot);const mes=passos(TODAY().slice(0,7)+"-01");const sem=passos(addDays(TODAY(),-6));let h=topbar("Montanha da evolução","mont");
  h+=`<div class="mtbox" id="mtBox">${montSVG({m:M})}</div>
   <div class="hero" style="margin-top:12px"><div class="stats"><div><b>${(S.tot*5).toLocaleString("pt-BR")} m</b><span>de altitude</span></div><div><b>${S.hoje}</b><span>passos hoje</span></div><div><b>${M.falta}</b><span>passos para o cume</span></div></div>
   <div class="small muted" style="margin-top:10px">Você está no <b>${esc(M.nome)}</b> (montanha ${M.k+1}). Cada check do app é um passo: treinos, hábitos, dominós, metas, contas em dia, afirmações e tudo o que você fez.</div></div>`;
  h+=`<div class="sec"><h2>Os cinco blocos · últimos 7 dias</h2></div><div class="blgrid">${BL.map(b=>{const v=sem.B[b],m=mes.B[b];return `<div class="blc ${v?"":"parado"}"><span class="mb" style="width:34px;height:34px;border-radius:10px">${ic(BLI[b])}</span><b>${b}</b><span class="big" style="font-size:1.4rem">${v}</span><span class="tiny muted">${v?"passos na semana":"parado na semana"} · ${m} no mês</span></div>`;}).join("")}</div>`;
  h+=`<div class="note" style="margin-top:12px">${ic("info")} Como ganhar passos: treino ou leitura bíblica registrados (1), dominó derrubado (2), dia fechado (1), sessão de foco (1), meta do ano atingida (10), edital contemplado (10), livro lido (5), conta paga em dia (1) ou recebida (2).</div>`;
  after(()=>{const b=$("mtBox");if(b)montAnimate(b,M.frac);});return `<div class="app">${h}</div>`;};

/* ---------- 2. RESUMO SEMANAL INTELIGENTE ---------- */
const TREINOS=["gym","run","swim","cap","kegel"];
function statsSemana(){const t=TODAY(),ini=addDays(t,-6),pIni=addDays(t,-34),pFim=addDays(t,-7);const E=all("exp");const sem=E.filter(e=>e.d>=ini&&e.d<=t),prev=E.filter(e=>e.d>=pIni&&e.d<=pFim);
  const byCat=a=>{const o={};a.forEach(e=>o[e.cat||"Outros"]=(o[e.cat||"Outros"]||0)+(+e.v||0));return o;};const cs=byCat(sem),cp=byCat(prev);
  const gS=sum(sem.map(e=>e.v)),gP=sum(prev.map(e=>e.v))/4;let maior=null;Object.keys(cs).forEach(k=>{const avg=(cp[k]||0)/4;if(avg>0&&cs[k]-avg>=20){const pc=Math.round((cs[k]/avg-1)*100);if(!maior||pc>maior.pc)maior={cat:k,pc};}});
  const dias=[...Array(7)].map((_,i)=>addDays(ini,i));const tdias=dias.filter(d=>TREINOS.some(k=>trkHas(k,d))).length;
  const D=dias.map(d=>dia(d));const B=passos(ini).B;const parados=BL.filter(b=>!B[b]);
  return{gS,gP,maior,tdias,dom:D.filter(x=>x.dom).length,domOk:D.filter(x=>x.domOk).length,foco:sum(D.map(x=>x.foco)),decl:sum(D.map(x=>x.decl)),fechados:D.filter(x=>x.fechado).length,parados,B,
    atras:all("conta").filter(c=>c.tipo==="pagar"&&c.status!=="paga"&&c.venc<t).length,aprov:all("ed").reduce((n,e)=>n+(e.pess||[]).filter(p=>p.st==="c"&&iso(new Date(e.u||0))>=ini).length,0)};}
function resumoLocal(s){const f=[];
  if(s.gS>0){if(s.maior)f.push(`Você gastou ${s.maior.pc}% mais com ${s.maior.cat.toLowerCase()} do que na sua média.`);else if(s.gP>0)f.push(`Seus gastos da semana (${money(s.gS)}) ficaram ${s.gS>s.gP?Math.round((s.gS/s.gP-1)*100)+"% acima":Math.round((1-s.gS/s.gP)*100)+"% abaixo"} da sua média.`);else f.push(`Você registrou ${money(s.gS)} em gastos nesta semana.`);}
  f.push(`Treinou ${s.tdias} de 7 dias${s.tdias>=5?": constância de atleta.":s.tdias>=3?".":", vale reforçar o corpo."}`);
  if(s.dom)f.push(`Derrubou ${s.domOk} de ${s.dom} dominós${s.foco?` e somou ${Math.round(s.foco/6)/10}h de foco`:""}.`);
  if(s.parados.length)f.push(s.parados.length===1?`O bloco ${s.parados[0].toLowerCase()} ficou parado.`:`Os blocos ${s.parados.slice(0,-1).join(", ").toLowerCase()} e ${s.parados.slice(-1)[0].toLowerCase()} ficaram parados.`);else f.push("Os cinco blocos tiveram movimento: semana equilibrada.");
  if(s.atras)f.push(`Atenção: ${s.atras} ${s.atras===1?"conta está":"contas estão"} em atraso.`);if(s.aprov)f.push(`E você teve ${s.aprov} ${s.aprov===1?"aprovação":"aprovações"} em editais. Celebre!`);
  const foco=s.parados[0]||BL.slice().sort((a,b)=>s.B[a]-s.B[b])[0];f.push(`Sugestão para a próxima semana: dê atenção ao bloco ${foco.toLowerCase()}.`);return f.join(" ");}
async function resumoIA(s){const txt=await Promise.race([aiGenerate([{text:`Você é um coach pessoal brasileiro, direto e motivador. Com base nestes dados reais da semana do usuário (JSON), escreva um resumo de 4 a 6 frases em português, citando números concretos, apontando 1 ponto forte, 1 ponto de atenção e 1 sugestão prática para a próxima semana. Não invente dados. Responda SOMENTE JSON: {"texto":"..."}\n\n${JSON.stringify({gastos_semana:s.gS,media_semanal_anterior:Math.round(s.gP),categoria_que_mais_subiu:s.maior,dias_com_treino:s.tdias,dominos:s.dom,dominos_feitos:s.domOk,minutos_foco:s.foco,afirmacoes:s.decl,dias_fechados:s.fechados,passos_por_bloco:s.B,blocos_parados:s.parados,contas_atrasadas:s.atras,aprovacoes_editais:s.aprov})}`}]),new Promise((_,r)=>setTimeout(()=>r(new Error("tempo")),20000))]);
  return JSON.parse(String(txt).replace(/```json|```/g,"")).texto;}
function resumoCard(full){const s=statsSemana();const wk=semanaKey(TODAY());const R=getD("rev_"+wk)||{};
  return `<div class="card resumo"><div class="row"><span class="mb" style="width:34px;height:34px;border-radius:10px">${ic("wand-sparkles")}</span><b class="grow">Resumo da sua semana</b>${full&&temIA()?`<button class="lk small" data-a="resIA">${ic("sparkles")} ${R.ia?"Refazer com IA":"Escrever com IA"}</button>`:""}</div>
   <p>${esc(R.ia||resumoLocal(s))}</p>${R.ia?`<div class="tiny faint">Escrito pela IA a partir dos seus dados</div>`:`<div class="tiny faint">Gerado a partir dos seus dados reais dos últimos 7 dias</div>`}${full?"":`<button class="lk small" data-a="go" data-v="${gv({v:"rev"})}">Abrir revisão semanal</button>`}</div>`;}
ACT.resIA=async el=>{el.disabled=true;el.innerHTML=`${ic("hourglass")} Escrevendo…`;try{const t=await resumoIA(statsSemana());const wk=semanaKey(TODAY());const R=getD("rev_"+wk)||{id:"rev_"+wk,c:"rev",wk};R.ia=t;save(R);rr();}
  catch(e){toast("sparkles","A IA não respondeu","Ative o AI Logic no Firebase. O resumo automático continua disponível.");el.disabled=false;el.innerHTML=`${ic("sparkles")} Escrever com IA`;}};
const _rev12=VIEWS.rev;VIEWS.rev=()=>{const h=_rev12();const i=h.indexOf('<div class="card" style="margin-top:12px">');return i<0?h:h.slice(0,i)+`<div style="margin-top:12px">${resumoCard(true)}</div>`+h.slice(i);};

/* ---------- 4. COPILOTO POR VOZ ---------- */
const DIAS=["domingo","segunda","terça","quarta","quinta","sexta","sábado"];
function parseQuando(txt){const t=normTxt(txt);let d=null,h=null;const hoje=TODAY();
  if(/depois de amanha/.test(t))d=addDays(hoje,2);else if(/amanha/.test(t))d=addDays(hoje,1);else if(/\bhoje\b/.test(t))d=hoje;
  const wd=DIAS.findIndex(x=>new RegExp("\\b"+normTxt(x)+"(-feira)?\\b").test(t));if(d==null&&wd>=0){const cur=new Date().getDay();let k=(wd-cur+7)%7;if(k===0)k=7;d=addDays(hoje,k);}
  const dm=t.match(/\bdia (\d{1,2})(?: de (\w+))?/);if(d==null&&dm){const n=new Date();let y=n.getFullYear(),m=n.getMonth();const ms=dm[2]?MESES.findIndex(x=>normTxt(x)===dm[2]):-1;if(ms>=0)m=ms;let dt=new Date(y,m,+dm[1]);if(dt<new Date(n.getFullYear(),n.getMonth(),n.getDate())&&ms<0)dt=new Date(y,m+1,+dm[1]);d=iso(dt);}
  if(/meio dia/.test(t))h="12:00";const hm=t.match(/\b(?:as|a|pelas)?\s*(\d{1,2})(?:[:h](\d{2}))?\s*(?:h\b|horas?\b|hs\b)?(?:\s*(da|de)\s*(manha|tarde|noite))?/);
  const hm2=t.match(/\bas (\d{1,2})(?:[:h ](\d{2}))?|(\d{1,2})h(\d{2})?|(\d{1,2}) horas?/);
  if(!h&&hm2){let H=+(hm2[1]||hm2[3]||hm2[5]),Mi=+(hm2[2]||hm2[4]||0);if(/tarde|noite/.test(t)&&H<12)H+=12;if(H<24&&Mi<60)h=pad(H)+":"+pad(Mi);}
  return{d,h};}
const CK_MAP=[["cap",/capoeira/],["gym",/academia|musculacao|malhei|treino de forca/],["run",/corri|corrida|correr/],["swim",/nadei|natacao|piscina/],["kegel",/kegel/],["bib",/biblia|li a palavra/],["conc",/concurso|estudei/],["man",/ritual|manifestacao/]];
const TB0="(?<![\\wÀ-ú])",TB1="(?![\\wÀ-ú])";
const TIME_RE=new RegExp(TB0+"(hoje|amanh[ãa]|depois de amanh[ãa]|(?:na |no )?(?:segunda|terça|terca|quarta|quinta|sexta|sábado|sabado|domingo)(?:-feira)?|dia \\d{1,2}(?: de [a-zç]+)?|(?:às|as|a|pelas) \\d{1,2}(?:[:h]\\d{2})?\\s*(?:h|hs|horas?)?|\\d{1,2}h(?:\\d{2})?|\\d{1,2} horas?|meio-?dia|(?:da|de) (?:manhã|manha|tarde|noite))"+TB1,"gi");
function stripTime(s){let r=s.replace(TIME_RE," ").replace(/\s+/g," ").trim();let prev;do{prev=r;r=r.replace(/\s+(às|as|a|pelas|de|no|na|para|pra|e)$/i,"").trim();}while(r!==prev);return r;}
function parseLocal(frase){const out=[];const parts=frase.replace(/\s+/g," ").split(/,(?!\d)|;|\.(?!\d)|\s+e\s+(?=(?:me |marca|marque|anota|anote|gastei|paguei|treinei|lembr|fiz|corri|nadei|estudei|li |registra|bebi))/i).map(s=>s.trim()).filter(Boolean);
  parts.forEach(p=>{const t=normTxt(p);
    const pl=p.toLowerCase();const gm=(/\b(?:gastei|paguei|comprei|deu|foi)\b/.test(t)&&pl.match(/(\d+(?:[.,]\d{1,2})?)/))||pl.match(/^(\d+(?:[.,]\d{1,2})?)\s*(?:reais|real|conto|pila)/);
    if(gm&&!/lembr/.test(t)){const v=num(gm[1]);const pag=/cartao|credito/.test(t)?"Cartão":/debito/.test(t)?"Débito":/dinheiro|especie/.test(t)?"Dinheiro":/pix/.test(t)?"Pix":lastPag();
      let desc=p.replace(/.*?\d+(?:[.,]\d{1,2})?\s*(?:reais|real|conto|pila)?/i,"").replace(/\b(no|na|com|em|de|do|da)\s+(cart[aã]o|cr[eé]dito|d[eé]bito|pix|dinheiro)\b.*$/i,"").replace(/^\s*(no|na|com|em|de|do|da|pro|pra|para)\s+/i,"").trim();
      out.push({tipo:"gasto",valor:v,desc:gNiceItem(desc)||"Gasto",pag,data:parseQuando(p).d||TODAY()});return;}
    if(/lembr|nao esquecer|me avisa/.test(t)){const q=parseQuando(p);let tit=stripTime(p.replace(/^.*?(me lembr[ae]r?|lembr[ae]r?(-me)?|me avis[ae]r?)\s*(de|que|pra|para)?\s*/i,""));
      out.push({tipo:"lembrete",titulo:gNiceItem(tit)||"Lembrete",data:q.d||(q.h?TODAY():addDays(TODAY(),1)),hora:q.h||"09:00"});return;}
    if(/\b(marca|marque|agenda|agende)\b.*\b(reuniao|compromisso|consulta|ensaio|aula|encontro)\b/.test(t)){const q=parseQuando(p);const tit=stripTime(p.replace(/^.*?\b(marca|marque|agenda|agende)\b\s*(uma?|o|a)?\s*/i,""));
      out.push({tipo:"evento",titulo:gNiceItem(tit)||"Compromisso",data:q.d||TODAY(),hora:q.h||""});return;}
    const ck=CK_MAP.find(([k,re])=>re.test(t));if(ck&&/(treinei|fiz|marca|marque|corri|nadei|li|estudei|terminei|registra|pratiquei|ritual|kegel)/.test(t)){out.push({tipo:"check",modulo:ck[0]});return;}
    const hb=all("hab").find(h=>{const n=normTxt(h.nome).split(" ").filter(w=>w.length>3);return n.length&&n.filter(w=>t.includes(w)).length>=Math.min(2,n.length);});if(hb){out.push({tipo:"habito",id:hb.id,nome:hb.nome});return;}
    if(/^(fiz|terminei|enviei|liguei|escrevi|gravei|entreguei|resolvi|finalizei|anota|anote)/.test(t)){out.push({tipo:"fiz",texto:gNiceItem(p.replace(/^(anota|anote)( que)?\s*/i,""))});return;}
    out.push({tipo:"nada",texto:p});});return out;}
async function parseIA(frase){const hoje=new Date();const txt=await Promise.race([aiGenerate([{text:`Hoje é ${DIAS[hoje.getDay()]}, ${TODAY()} e são ${pad(hoje.getHours())}:${pad(hoje.getMinutes())}. Converta o comando de voz em ações para um app pessoal. Tipos:
gasto {valor:number,desc,pag:"Pix"|"Cartão"|"Débito"|"Dinheiro",data:"YYYY-MM-DD"} · check {modulo:"gym"|"run"|"swim"|"cap"|"kegel"|"bib"|"conc"|"man"} (academia, corrida, natação, capoeira, kegel, bíblia, concurso, ritual) · lembrete {titulo,data,hora:"HH:MM"} · evento {titulo,data,hora} · fiz {texto} (algo que a pessoa fez hoje) · habito {nome}.
Datas relativas (amanhã, sexta) devem virar datas reais. Responda SOMENTE JSON: {"acoes":[{"tipo":"...",...}]}\n\nComando: ${frase}`}]),new Promise((_,r)=>setTimeout(()=>r(new Error("tempo")),9000))]);
  const j=JSON.parse(String(txt).replace(/```json|```/g,""));return(j.acoes||[]).map(a=>{if(a.tipo==="habito"){const hb=all("hab").find(h=>normTxt(h.nome).includes(normTxt(a.nome||""))||normTxt(a.nome||"").includes(normTxt(h.nome)));return hb?{tipo:"habito",id:hb.id,nome:hb.nome}:{tipo:"fiz",texto:a.nome};}return a;});}
function execAcoes(A){const done=[];A.forEach(a=>{try{
  if(a.tipo==="gasto"&&+a.valor>0){const d=save({id:"exp_"+nid(),c:"exp",v:+a.valor,desc:gNiceItem(a.desc||"Gasto"),cat:gCat(a.desc||""),pag:a.pag||lastPag(),d:a.data||TODAY()});done.push({id:d.id,ic:"wallet",t:`Gasto de ${moneyRaw(d.v)} · ${d.desc} · ${d.pag}`,fala:`gasto de ${String(d.v).replace(".",",")} reais em ${d.desc}`});}
  else if(a.tipo==="check"&&TRK[a.modulo]){const id=tid(a.modulo,TODAY());if(!getD(id)){save({id,c:"trk",k:a.modulo,d:TODAY()});done.push({id,ic:MODS[a.modulo].ic,t:`Check: ${MODS[a.modulo].n}`,fala:`check em ${MODS[a.modulo].n}`});}else done.push({ic:"check",t:`${MODS[a.modulo].n} já estava marcado hoje`,fala:`${MODS[a.modulo].n} já estava marcado`});}
  else if(a.tipo==="lembrete"){const d=save({id:"rem_"+nid(),c:"rem",t:a.titulo||"Lembrete",d:a.data||TODAY(),h:a.hora||"09:00",rep:"",feito:false,fired:""});done.push({id:d.id,ic:"alarm-clock",t:`Lembrete: ${d.t} · ${flong(d.d)} às ${d.h}`,fala:`lembrete de ${d.t}, ${flong(d.d).split("·")[0]} às ${d.h.replace(":00"," horas").replace(":"," e ")}`});}
  else if(a.tipo==="evento"){const d=save({id:"ev_"+nid(),c:"ev",t:a.titulo||"Compromisso",d:a.data||TODAY(),h:a.hora||"",cat:"pess"});done.push({id:d.id,ic:"calendar-days",t:`Agenda: ${d.t} · ${flong(d.d)}${d.h?" às "+d.h:""}`,fala:`compromisso ${d.t} na agenda`});}
  else if(a.tipo==="fiz"&&a.texto){const d=save({id:"fiz_"+nid(),c:"fiz",t:a.texto,d:TODAY()});done.push({id:d.id,ic:"list-todo",t:`Feito hoje: ${d.t}`,fala:`anotei que você ${a.texto.toLowerCase()}`});}
  else if(a.tipo==="habito"){const hb=getD(a.id);if(hb){hb.dias=hb.dias||{};const was=!!hb.dias[TODAY()];hb.dias[TODAY()]=1;save(hb);done.push({hab:was?null:hb.id,ic:"list-checks",t:`Hábito: ${hb.nome}`,fala:`hábito ${hb.nome} marcado`});}}
  else if(a.tipo==="nada")done.push({ic:"circle-help",t:`Não entendi: “${a.texto}”`,miss:true});}catch(e){}});return done;}
function falar(t){try{if(!("speechSynthesis" in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang="pt-BR";u.rate=1.05;const v=speechSynthesis.getVoices().find(v=>/pt(-|_)BR/i.test(v.lang));if(v)u.voice=v;speechSynthesis.speak(u);}catch(e){}}
let COPI=null;
ACT.copiMic=()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){toast("mic","Este navegador não reconhece voz","Digite o comando na caixa ao lado.");const i=$("copiI");if(i)i.focus();return;}
  sheet(`<h2>${ic("audio-lines")} Copiloto</h2><p class="muted small">Fale várias coisas de uma vez. Ex.: <i>“gastei 32 no almoço no cartão, marca que treinei capoeira e me lembra de pagar a internet sexta às 9h”</i></p>
   <div class="micw"><button class="mic on" data-a="copiStop" aria-label="Parar">${ic("mic")}</button></div><div id="micT" class="mict">Ouvindo…</div>
   <div class="btns"><button class="btn full" data-a="copiStop">${ic("check")} Pronto, executar</button><button class="btn ghost full" data-a="micCancel">Cancelar</button></div>`);
  const r=new SR();r.lang="pt-BR";r.continuous=true;r.interimResults=true;REC={r,keep:true,fin:"",inter:""};
  r.onresult=e=>{let inter="";for(let i=e.resultIndex;i<e.results.length;i++){const t=e.results[i][0].transcript;if(e.results[i].isFinal)REC.fin+=t.trim()+", ";else inter+=t;}REC.inter=inter;const m=$("micT");if(m)m.textContent=(REC.fin+inter)||"Ouvindo…";};
  r.onerror=ev=>{if(/not-allowed/.test(ev.error)){REC.keep=false;toast("mic","Microfone bloqueado","Libere o microfone para este site.");}};r.onend=()=>{if(REC&&REC.keep){try{r.start();}catch(e){}}};try{r.start();}catch(e){}};
ACT.copiStop=async()=>{if(!REC)return;REC.keep=false;try{REC.r.stop();}catch(e){}await new Promise(r=>setTimeout(r,500));const txt=(REC.fin+" "+(REC.inter||"")).replace(/,\s*$/,"").trim();REC=null;if(!txt){closeSheet();return toast("mic","Não ouvi nada","");}copiRun(txt);};
ACT.copiTxt=()=>{const i=$("copiI");const v=i.value.trim();if(!v)return i.focus();i.value="";copiRun(v);};
async function copiRun(txt){sheet(`<h2>${ic("audio-lines")} Executando…</h2><div class="mict">${esc(txt)}</div><div class="bar"><i style="width:45%"></i></div>`);
  let A=null,via="local";if(temIA()){try{A=await parseIA(txt);via="ia";}catch(e){}}if(!A||!A.length)A=parseLocal(txt);
  const done=execAcoes(A);const ok=done.filter(d=>!d.miss&&d.fala);
  if(!ok.length&&!done.some(d=>d.id)&&typeof jarPerguntar==="function"&&temIA()){closeSheet();return jarPerguntar(txt);} /* não era uma ordem: vira pergunta para o Jarvis */
  COPI={done,txt};rr();
  sheet(`<h2>${ic("check")} Feito!</h2><div class="mict" style="text-align:left;font-style:italic">“${esc(txt)}”</div>
   <ul class="copil">${done.map(d=>`<li class="${d.miss?"miss":""}"><span class="mb" style="width:32px;height:32px;border-radius:10px;${d.miss?"background:var(--sf3);color:var(--soft)":""}">${ic(d.ic)}</span><span>${esc(d.t)}</span></li>`).join("")}</ul>
   <div class="tiny faint">${via==="ia"?"Entendido pela IA.":"Entendido no aparelho."}</div>
   <div class="btns h"><button class="btn ghost" data-a="copiUndo">${ic("undo-2")} Desfazer</button><button class="btn" data-a="close">Ok</button></div>`);
  if(ok.length)falar("Pronto. Registrei "+ok.map(d=>d.fala).join(", ")+".");else falar("Não consegui entender. Tente de novo, falando uma ação de cada vez.");}
ACT.copiUndo=()=>{if(!COPI)return;COPI.done.forEach(d=>{if(d.id)removeDoc(d.id);if(d.hab){const h=getD(d.hab);if(h&&h.dias){delete h.dias[TODAY()];save(h);}}});COPI=null;closeSheet();rr();toast("undo-2","Tudo desfeito","");};

/* ---------- 5. GASTO POR FOTO ---------- */
let GFOTO=null;
ACT.gFoto=async()=>{const f=await pickFiles(false);if(!f.length)return;const file=f[0];
  sheet(`<h2>${ic("scan-line")} Lendo o comprovante…</h2><p class="muted small">Procurando valor, local, data e forma de pagamento.</p><div class="bar"><i style="width:40%"></i></div>`);
  let r=null,via="";const p=await processImage(file).catch(()=>null);
  if(FBCFG){try{const b64=await fileToB64(file);const txt=await Promise.race([aiGenerate([{text:`Leia este comprovante (cupom fiscal, nota, recibo ou print de Pix/cartão) e extraia o gasto. Responda SOMENTE JSON: {"valor":number,"descricao":"estabelecimento ou destinatário, curto","data":"YYYY-MM-DD ou vazio","forma":"Pix|Cartão|Débito|Dinheiro|"}`},{inlineData:{mimeType:"image/jpeg",data:b64}}]),new Promise((_,j)=>setTimeout(()=>j(new Error("tempo")),20000))]);
    r=JSON.parse(String(txt).replace(/```json|```/g,""));via="ia";}catch(e){}}
  if(!r||!(+r.valor>0)){try{const sheetT=$("sheet");if(sheetT&&!sheetT.classList.contains("hidden"))sheetT.querySelector("p").textContent="Lendo o texto da imagem (pode levar alguns segundos na primeira vez)…";
      if(!window.Tesseract)await loadScript("https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js");
      const w=await Tesseract.createWorker("por",1,{langPath:"https://cdn.jsdelivr.net/npm/@tesseract.js-data/por@1.0.0/4.0.0_best_int",gzip:true});const out=await w.recognize(file);await w.terminate();r=ocrParse(out.data.text||"");via="ocr";}catch(e){r=r||{};}}
  GFOTO={p,r:r||{},via};gFotoForm();};
function ocrParse(t){const L=t.split(/\n/).map(s=>s.trim()).filter(Boolean),T=normTxt(t);const vals=[];
  L.forEach((l,i)=>{const re=/(?:R\$\s*)?(\d{1,3}(?:\.\d{3})*,\d{2})/g;let m;while((m=re.exec(l))){const v=num(m[1]);const n=normTxt(l);vals.push({v,score:(/total|valor|pago|pagamento|transferido|pix/.test(n)?3:0)+(/R\$/.test(l)?1:0)+(/troco|desconto|tributo|imposto|subtotal/.test(n)?-3:0),i});}});
  vals.sort((a,b)=>b.score-a.score||b.v-a.v);const valor=vals.length?vals[0].v:0;
  const dm=t.match(/(\d{2})\/(\d{2})\/(\d{2,4})/);const data=dm?`${dm[3].length===2?"20"+dm[3]:dm[3]}-${dm[2]}-${dm[1]}`:"";
  const forma=/\bpix\b/.test(T)?"Pix":/debito/.test(T)?"Débito":/credito|cartao/.test(T)?"Cartão":/dinheiro/.test(T)?"Dinheiro":"";
  let desc="";const di=L.findIndex(l=>/^(para|destino|destinat|favorecido|recebedor|nome)/i.test(normTxt(l)));if(di>=0)desc=(L[di].replace(/^[^:]*:\s*/,"")||L[di+1]||"");if(!desc)desc=L.find(l=>/[A-Za-zÀ-ú]{3}/.test(l)&&!/cnpj|cpf|cupom|nota|fiscal|data|hora/i.test(l))||"";
  return{valor,descricao:desc.slice(0,40),data,forma};}
function gFotoForm(){const r=GFOTO.r,p=GFOTO.p;const desc=gNiceItem(r.descricao||"");const pag=["Pix","Cartão","Débito","Dinheiro"].includes(r.forma)?r.forma:lastPag();const cat=gCat(desc);const okData=/^\d{4}-\d{2}-\d{2}$/.test(r.data||"")&&r.data<=TODAY()?r.data:TODAY();
  sheet(`<h2>${ic("receipt-text")} Confira o gasto</h2><div class="row" style="gap:12px;align-items:flex-start">${p?`<img src="${p.preview}" alt="" style="width:84px;height:84px;object-fit:cover;border-radius:12px;flex:none">`:""}<div class="small muted">${GFOTO.via==="ia"?"Lido pela IA.":GFOTO.via==="ocr"?"Lido pelo texto da imagem. Confira os campos.":"Não consegui ler sozinho. Preencha abaixo."} O comprovante fica anexado ao gasto.</div></div>
   <label class="fld"><span>Valor (R$)</span><input id="gfV" inputmode="decimal" value="${r.valor?String(r.valor).replace(".",","):""}" style="font:800 1.5rem var(--disp)"></label>
   <label class="fld"><span>Com o que / onde</span><input id="gfD" value="${esc(desc)}" data-in="gfCat"></label>
   <div class="fld"><span>Forma de pagamento</span><div class="seg" data-k="gfP">${["Pix","Cartão","Débito","Dinheiro"].map(x=>`<button type="button" data-a="seg" data-v="${x}" aria-pressed="${x===pag}">${x}</button>`).join("")}</div></div>
   <div class="fld"><span>Categoria</span><select id="gfC" style="width:100%;border:1.5px solid var(--line);border-radius:12px;padding:12px;background:var(--sf2)">${CATS.map(([c])=>`<option ${c===cat?"selected":""}>${c}</option>`).join("")}</select></div>
   <label class="fld"><span>Data</span><input id="gfDt" type="date" value="${okData}"></label>
   <div class="btns"><button class="btn full" id="gfS">${ic("check")} Salvar gasto</button><button class="btn ghost full" data-a="close">Cancelar</button></div>`,s=>{
   s.querySelector("#gfS").onclick=async e=>{const v=num(s.querySelector("#gfV").value);if(!(v>0))return toast("wallet","Informe o valor","");e.currentTarget.disabled=true;let img=null;try{if(GFOTO.p)img=await storeImage(GFOTO.p);}catch(x){}
     save({id:"exp_"+nid(),c:"exp",v,desc:gNiceItem(s.querySelector("#gfD").value)||"Gasto",cat:s.querySelector("#gfC").value,pag:segVal(s,"gfP")||pag,d:s.querySelector("#gfDt").value||TODAY(),img});GFOTO=null;closeSheet();rr();toast("receipt-text","Gasto salvo com comprovante",moneyRaw(v));};});}
CH.gfCat=el=>{const c=$("gfC");if(c)c.value=gCat(el.value);};
ACT.gComp=el=>{const e=getD(el.dataset.id);if(e&&e.img)openViewer([{ref:e.img,t:e.desc,s:moneyRaw(e.v)+" · "+fdate(e.d)}],0);};

/* ---------- 3. INÍCIO QUE MUDA COM A HORA ---------- */
function periodo(){if(VIEW.per)return VIEW.per;const h=new Date().getHours();return h>=5&&h<12?"manha":h>=12&&h<18?"tarde":"noite";}
const PER={manha:{n:"Manhã",ic:"sun",d:"hora de planejar e se alinhar"},tarde:{n:"Tarde",ic:"sunset",d:"hora de executar"},noite:{n:"Noite",ic:"moon",d:"hora de fechar o dia e agradecer"}};
ACT.perSel=el=>{VIEW.per=el.dataset.v===periodo()&&!VIEW.per?null:el.dataset.v;rr();};
function secCopi(){return `<div class="copi"><button class="copim" data-a="copiMic" aria-label="Falar com o copiloto">${ic("mic")}</button><input id="copiI" placeholder="Peça ou pergunte: gastei 30 no uber · quanto gastei este mês?" data-enter="copiTxt" aria-label="Comando"><button class="ib" data-a="copiTxt" aria-label="Executar">${ic("send")}</button></div>`;}
function secFrase(){const q=quote();return `<div class="quote q${(QI||0)%5}"><p>“${esc(q[0])}”</p><div class="by">${esc(q[1])}<button class="nx" data-a="nextQuote">${ic("refresh-cw")} Outra frase</button></div></div>`;}
function secGasto(){const t=TODAY(),ym=t.slice(0,7),now=new Date();const gm=all("exp").filter(e=>(e.d||"").startsWith(ym));const gH=gm.filter(e=>e.d===t).sort((a,b)=>(b.u||0)-(a.u||0));const pg=lastPag();
  return `<div class="card qg" ${mstyle("gastos")}><div class="row"><span class="mb" style="width:34px;height:34px;border-radius:10px">${ic("wallet")}</span><b class="grow">Gasto rápido</b><button class="lk small" data-a="go" data-v="${gv({v:"gastos"})}">${MESES[now.getMonth()]}: <b>${money(sum(gm.map(e=>e.v)))}</b></button></div>
    <div class="qgr"><input id="qgV" inputmode="decimal" placeholder="R$ 0,00" aria-label="Valor" data-enter="qgSave"><input id="qgI" placeholder="Com o quê? Ex.: Almoço" aria-label="Item" data-in="qgCat" data-enter="qgSave"><button class="btn" data-a="qgSave" aria-label="Salvar gasto">${ic("check")}</button></div>
    <div class="seg qgp" data-k="qgP">${["Pix","Cartão","Dinheiro","Débito"].map(p=>`<button type="button" data-a="seg" data-v="${p}" aria-pressed="${p===pg}">${p}</button>`).join("")}</div>
    <div class="row" style="margin-top:6px;gap:12px"><span class="tiny faint grow" id="qgC">A categoria é escolhida sozinha</span><button class="lk tiny" data-a="gFoto">${ic("camera")} Por foto</button><button class="lk tiny" data-a="gLista">${ic("list-todo")} Colar lista</button></div>
    ${gH.length?`<div class="qgl">${gH.slice(0,3).map(e=>`<span>${esc(e.desc)} · <b>${money(e.v)}</b></span>`).join("")}${gH.length>3?`<span>+${gH.length-3}</span>`:""}</div>`:""}</div>`;}
function secDia(){const x=dia();let h=`<div class="sec"><h2>${ic("sunrise")} Meu dia</h2><button class="lk" data-a="planDia">${x.dom||x.mits.length?"Editar":"Planejar"}</button></div>`;
  if(!x.dom&&!x.mits.length)h+=`<button class="card ctac" ${mstyle("dia")} data-a="planDia"><b>${ic("sunrise")} Planejar o dia em 2 minutos</b><span class="small muted">Gratidão, o dominó do dia, duas prioridades e o que tornaria hoje ótimo.</span></button>`;
  else h+=`<div class="card" ${mstyle("dia")}>${x.dom?`<div class="dom ${x.domOk?"ok":""}"><button class="ck ${x.domOk?"on":""}" data-a="domOk" aria-label="Concluir dominó">${ic("check")}</button><div class="grow"><span class="tiny" style="color:var(--deep);font-weight:800">${ic("crosshair")} DOMINÓ DO DIA</span><b class="${x.domOk?"strike":""}">${esc(x.dom)}</b></div></div>`:""}
     ${x.mits.map(m=>`<div class="mit"><button class="ck ${m.ok?"on":""}" data-a="mitOk" data-id="${m.id}">${ic("check")}</button><span class="${m.ok?"strike":""}">${esc(m.t)}</span></div>`).join("")}${x.otimo?`<div class="small muted" style="margin-top:8px">${ic("star")} Hoje será ótimo se: <b style="color:var(--ink)">${esc(x.otimo)}</b></div>`:""}</div>`;
  return h;}
function secFoco(){const x=dia();return `<div class="card foco" ${mstyle("dia")} style="margin-top:10px">${FOCO?`<div class="row"><span class="mb">${ic("timer")}</span><div class="grow"><span class="tiny muted">${FOCO.paused!=null?"PAUSADO":"EM FOCO"} · ${esc(FOCO.label)}</span><div id="focoT" class="big">${mmss(focoLeft())}</div></div><button class="ib" data-a="focoPause" aria-label="Pausar">${ic(FOCO.paused!=null?"play":"pause")}</button><button class="ib" data-a="focoStop" aria-label="Parar">${ic("square")}</button></div>`
  :`<div class="row" style="flex-wrap:wrap"><span class="mb">${ic("timer")}</span><div class="grow"><b>Sessão de foco</b><span class="small muted" style="display:block">${x.foco?x.foco+" min de foco hoje":"Uma coisa só, sem distrações."}</span></div><button class="btn sm" data-a="focoGo" data-m="25">25 min</button><button class="btn ghost sm" data-a="focoGo" data-m="50">50 min</button></div>`}</div>`;}
function secAfirm(){const x=dia();const [afc,aft]=afirmDoDia(VIEW.afCat);return `<div class="sec"><h2>${ic("sparkles")} Afirmações</h2>${x.decl?`<span class="chip m" style="margin-left:auto">${x.decl} hoje</span>`:""}</div>
  <div class="afc" ${mstyle("man")}><div class="tabs" style="padding-bottom:4px">${afirmCats().map(([k])=>`<button data-a="afCat" data-c="${esc(k)}" aria-pressed="${k===afc}">${esc(k)}</button>`).join("")}</div><p>“${esc(aft)}”</p><div class="row"><button class="btn" data-a="afDeclarar">${ic("sparkles")} Declarar agora</button><button class="btn ghost" data-a="afNext">${ic("refresh-cw")} Outra</button><button class="lk small" style="margin-left:auto" data-a="go" data-v="${gv({v:"manif"})}">Ritual completo</button></div></div>`;}
function secAgenda(amanha){const now=new Date(),t=amanha?addDays(TODAY(),1):TODAY();const ev=all("ev").filter(e=>e.d===t).sort((a,b)=>(a.h||"").localeCompare(b.h||""));const rms=amanha?all("rem").filter(r=>!r.feito&&iso(nextOcc(r,now))===t):all("rem").filter(r=>!r.feito&&iso(nextOcc(r,now))<=t).sort((a,b)=>nextOcc(a,now)-nextOcc(b,now));
  const ct=all("conta").filter(c=>c.status!=="paga"&&c.venc===t);let h=`<div class="sec"><h2>${ic("calendar-days")} ${amanha?"Amanhã":"Agenda de hoje"}</h2><button class="lk" data-a="tab" data-v="${gv({v:"cal"})}">Abrir agenda</button></div>`;
  h+=(ev.length||rms.length||ct.length)?`<div ${mstyle("cal")}>${ev.map(e=>`<div class="item" style="border-left:5px solid ${evCol(e.cat)}"><button class="ibody" data-a="tab" data-v="${gv({v:"cal"})}"><b>${esc(e.t)}</b><div class="meta">${e.h?`<span class="chip">${ic("clock")} ${esc(e.h)}</span>`:""}${e.local?`<span class="chip">${ic("map-pin")} ${esc(e.local)}</span>`:""}</div></button></div>`).join("")}${ct.map(c=>`<div class="item" style="border-left:5px solid ${c.tipo==="receber"?"var(--ok)":"var(--no)"}"><button class="ibody" data-a="go" data-v="${gv({v:"contas",tab:c.tipo})}"><b>${c.tipo==="receber"?"Receber":"Pagar"}: ${esc(c.desc)}</b><div class="meta"><span class="chip">${money(c.valor)}</span></div></button></div>`).join("")}</div><div ${mstyle("lemb")}>${rms.map(remCard).join("")}</div>`
   :`<div class="note" ${mstyle("cal")}>${ic("calendar-check")} ${amanha?"Nada marcado para amanhã.":"Nada marcado para hoje."}</div>`;return h;}
function secFiz(){const t=TODAY();const fz=all("fiz").filter(f=>f.d===t).sort((a,b)=>(a.u||0)-(b.u||0));return `<div class="sec"><h2>${ic("list-todo")} O que eu fiz hoje</h2><button class="lk" data-a="go" data-v="${gv({v:"list",k:"fiz"})}">Histórico</button></div>
  <div class="card" ${mstyle("fiz")}><div class="qadd" style="margin:0"><input id="fizI" placeholder="Ex.: Enviei o relatório do edital" data-enter="fizAdd" aria-label="O que eu fiz"><button class="btn" data-a="fizAdd" aria-label="Adicionar">${ic("plus")}</button><button class="btn micb" data-a="fizMic" aria-label="Falar">${ic("mic")}</button></div>
  ${fz.length?`<ul class="fzl">${fz.map(f=>`<li>${ic("check")}<span class="grow">${esc(f.t)}</span><button data-a="fizDel" data-id="${f.id}" aria-label="Apagar">${ic("x")}</button></li>`).join("")}</ul>`:`<div class="tiny faint" style="margin-top:8px">Toque no microfone e conte o seu dia: o app organiza em tópicos.</div>`}</div>`;}
function secCheck(){const t=TODAY();return `<div class="sec"><h2>Check de hoje</h2></div><div class="quick">${Object.keys(TRK).map(k=>{const m=MODS[k],on=trkHas(k,t);return `<button class="qk ${on?"on":""}" ${mstyle(k)} data-a="quickTrk" data-k="${k}"><span class="dot">${ic(m.ic)}</span>${esc(m.n)}${on?`<span class="ok">${ic("check")}</span>`:""}</button>`;}).join("")}</div>`;}
function secTreino(){const t=TODAY();const T=all("tr").sort((a,b)=>(a.o||0)-(b.o||0));if(!T.some(z=>(z.ex||[]).length))return"";const s=trSugerido(T),dn=trDone(s,t).length,n=(s.ex||[]).length;
  return `<div ${mstyle("gym")} style="margin-top:12px"><button class="item" style="width:100%;text-align:left;align-items:center" data-a="go" data-v="${gv({v:"trk",k:"gym",sub:"tr",trId:s.id})}"><span class="mb">${ic("dumbbell")}</span><span class="ibody"><b>Treino de hoje: ${esc(s.letra)}${s.nome?" · "+esc(s.nome):""}</b><span class="small muted">${n?`${dn}/${n} exercícios`:"Sem exercícios ainda"}</span>${n?`<span class="bar" style="display:block"><i style="width:${dn/n*100}%"></i></span>`:""}</span>${ic("chevron-right")}</button></div>`;}
function secHab(){const t=TODAY();const habs=all("hab").sort((a,b)=>(a.o||0)-(b.o||0));if(!habs.length)return"";const hd=habs.filter(z=>z.dias&&z.dias[t]).length;
  return `<div class="sec"><h2>Hábitos de hoje</h2><button class="lk" data-a="tab" data-v="${gv({v:"habitos"})}">${hd}/${habs.length}</button></div><div ${mstyle("habitos")} class="hgrid2">${habs.slice(0,6).map(z=>{const on=!!(z.dias&&z.dias[t]);return `<button class="hchip ${on?"on":""}" data-a="habT" data-id="${z.id}" data-d="${t}"><span class="ck ${on?"on":""}">${ic("check")}</span><span class="grow">${esc(z.nome)}</span></button>`;}).join("")}</div>`;}
function secNoite(){const x=dia();return `<div class="sec"><h2>${ic("moon-star")} Fechar o dia</h2></div><button class="card ctac" data-a="noite"><b>${x.fechado?"✓ Dia fechado · rever":"3 coisas incríveis, o que melhorar e sua energia"}</b><span class="small muted">${x.fechado?esc(x.noite.inc.filter(Boolean).join(" · ")||""):"Revisão noturna do diário de 5 minutos."}</span></button>`;}
function secMont(){const S=passos(),M=monteDe(S.tot);after(()=>{const b=$("mtMini");if(b)montAnimate(b,M.frac);});
  return `<div class="sec"><h2>${ic("mountain-snow")} Sua montanha</h2><button class="lk" data-a="go" data-v="${gv({v:"mont"})}">Ver</button></div><button class="card mtcard" data-a="go" data-v="${gv({v:"mont"})}"><div id="mtMini">${montSVG({m:M,mini:true})}</div><div class="mtinfo"><b>${esc(M.nome)}</b><span class="small muted">${(S.tot*5).toLocaleString("pt-BR")} m · +${S.hoje} passos hoje · faltam ${M.falta} para o cume</span><span class="bar"><i style="width:${M.frac*100}%"></i></span></div></button>`;}
function secTools(){const tools=[["rpm",{v:"rpm"},"Planejar um resultado: o quê, por quê e ações"],["fear",{v:"list",k:"fear"},"Vencer o medo de agir (Tim Ferriss)"],["naof",{v:"list",k:"naof"},"O que você decidiu não fazer mais"],["rev",{v:"rev"},"Vitórias, 80/20 e foco da semana"]];
  return `<div class="sec"><h2>${ic("zap")} Alta performance</h2></div><div class="grid">${tools.map(([k,v,d])=>`<button class="tile tool" ${mstyle(k)} data-a="go" data-v="${gv(v)}"><span class="mb">${ic(MODS[k].ic)}</span><span><b style="display:block">${esc(MODS[k].n)}</b><span class="tiny muted" style="font-weight:600">${esc(d)}</span></span></button>`).join("")}<button class="tile tool" ${mstyle("man")} data-a="go" data-v="${gv({v:"manif",rit:1})}"><span class="mb">${ic("book-open")}</span><span><b style="display:block">Rituais para ler</b><span class="tiny muted" style="font-weight:600">Seus textos longos de manifestação</span></span></button></div>`;}
VIEWS.home=()=>{const c=cfg(),t=TODAY(),per=periodo(),P=PER[per];const wd=new Date().getDay();
  let h=`<div class="hhead">${logo(46)}<div class="grow wm">Moving Up<small>${esc(flong(t))}</small></div>
    <button class="ib" data-a="disc" aria-label="${DISCRETO?"Mostrar valores":"Esconder valores"}">${ic(DISCRETO?"eye-off":"eye")}</button><button class="ib" data-a="theme" aria-label="Alternar tema">${ic(isDark()?"sun":"moon")}</button><button class="ib" data-a="go" data-v="${gv({v:"ajustes"})}" aria-label="Ajustes">${ic("settings")}</button></div>
   <div class="perh per-${per}"><div class="grow"><div class="hello" style="margin:0">${greet()}${c.nome?", "+esc(c.nome.split(" ")[0]):""}.</div><div class="small" style="opacity:.85">${ic(P.ic)} ${P.n}: ${P.d}</div></div>
    <div class="perseg">${Object.entries(PER).map(([k,v])=>`<button data-a="perSel" data-v="${k}" aria-pressed="${k===per}" aria-label="${v.n}">${ic(v.ic)}</button>`).join("")}</div></div>`;
  h+=secCopi()+secBriefing()+secAvisos();
  const res=(wd===0||wd===1)?`<div style="margin-top:14px">${resumoCard(false)}</div>`:"";
  const S={manha:[secFrase,secDia,secAfirm,()=>secAgenda(false),secGasto,secCheck,secTreino,secHab,secCiclo,secMont,()=>res,secTools],
           tarde:[secDia,secFoco,()=>secAgenda(false),secFiz,secGasto,secCheck,secTreino,secHab,secCiclo,secFrase,secMont,()=>res,secTools],
           noite:[secNoite,secGrat,secFiz,secAfirm,secHab,secGasto,()=>secAgenda(true),secMont,()=>res,secFrase,secTools]}[per];
  h+=S.map(f=>f()).join("");if(per==="manha")h=h.replace(secDia(),secDia()+secFoco());
  return `<div class="app">${h}<div class="foot">Moving Up · um degrau por dia</div></div>`;};
/* sincroniza editais antigos uma vez por sessão */
const _start12=startApp;startApp=function(){const r=_start12.apply(this,arguments);try{edSyncAll();}catch(e){}return r;};
async function fileToB64(file){const im=await loadBitmap(file);const s=Math.min(1,1800/Math.max(im.width,im.height));const c=document.createElement("canvas");c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext("2d").drawImage(im,0,0,c.width,c.height);const b=await toBlob(c,.88);return (await blobToDataURL(b)).split(",")[1];}
