"use strict";
/* ================= MÓDULOS ================= */
const ICON192="mu-icon-192.png";
const MODS={
  gym:{n:"Academia",ic:"dumbbell",c1:"#E11D48",c2:"#FF7A59",g:0,v:{v:"trk",k:"gym"}},
  run:{n:"Corridas",ic:"footprints",c1:"#C2410C",c2:"#FFC53D",g:0,v:{v:"trk",k:"run"}},
  swim:{n:"Natação",ic:"waves",c1:"#0369A1",c2:"#3B82F6",g:0,v:{v:"trk",k:"swim"}},
  cap:{n:"Treinos de capoeira",ic:"swords",c1:"#B45309",c2:"#EF4444",g:0,v:{v:"trk",k:"cap"}},
  hiit:{n:"HIIT Capoeira",ic:"flame",c1:"#BE185D",c2:"#A855F7",g:0,v:{v:"hiit"}},
  mara:{n:"Maratona",ic:"medal",c1:"#DC2626",c2:"#E11D48",g:0,v:{v:"mara"}},
  bib:{n:"Leitura da Bíblia",ic:"book-heart",c1:"#047857",c2:"#0EA5E9",g:1,v:{v:"trk",k:"bib"}},
  man:{n:"Ritual de manifestação",ic:"sparkles",c1:"#A21CAF",c2:"#8B5CF6",g:1,v:{v:"manif"}},
  conc:{n:"Estudos p/ concurso",ic:"graduation-cap",c1:"#7C3AED",c2:"#6366F1",g:1,v:{v:"trk",k:"conc"}},
  aprend:{n:"Aprendizados",ic:"lightbulb",c1:"#4F46E5",c2:"#22D3EE",g:1,v:{v:"list",k:"aprend"}},
  livros:{n:"Livros lidos",ic:"library",c1:"#A16207",c2:"#FACC15",g:1,v:{v:"list",k:"livros"}},
  audio:{n:"Audiobooks",ic:"headphones",c1:"#9333EA",c2:"#EC4899",g:1,v:{v:"audio"}},
  habil:{n:"Habilidades a aprender",ic:"brain",c1:"#0F766E",c2:"#84CC16",g:1,v:{v:"list",k:"habil"}},
  prof:{n:"Vida profissional",ic:"briefcase",c1:"#2563EB",c2:"#06B6D4",g:2,v:{v:"list",k:"prof"}},
  editais:{n:"Editais da cultura",ic:"kanban",c1:"#BE123C",c2:"#F59E0B",g:2,v:{v:"editais"}},
  renda:{n:"Fontes de renda",ic:"coins",c1:"#15803D",c2:"#14B8A6",g:2,v:{v:"list",k:"renda"}},
  gastos:{n:"Planilha de gastos",ic:"wallet",c1:"#B91C1C",c2:"#F97316",g:2,v:{v:"gastos"}},
  contas:{n:"Contas a pagar e receber",ic:"receipt",c1:"#155E75",c2:"#0EA5E9",g:2,v:{v:"contas"}},
  ano:{n:"Metas do ano",ic:"rocket",c1:"#6D28D9",c2:"#FF3D7F",g:3,v:{v:"list",k:"ano"}},
  habitos:{n:"Hábitos",ic:"list-checks",c1:"#4D7C0F",c2:"#22C55E",g:3,v:{v:"habitos"}},
  fiz:{n:"O que eu fiz hoje",ic:"list-todo",c1:"#1D4ED8",c2:"#8B5CF6",g:3,v:{v:"list",k:"fiz"}},
  lemb:{n:"Lembretes",ic:"alarm-clock",c1:"#C2410C",c2:"#FB7185",g:3,v:{v:"lemb"}},
  cal:{n:"Calendário",ic:"calendar-days",c1:"#4338CA",c2:"#EC4899",g:3,v:{v:"cal"}},
  casa:{n:"Casamento",ic:"heart",c1:"#DB2777",c2:"#F472B6",g:4,v:{v:"list",k:"casa"}},
  foto:{n:"Espaço do fotógrafo",ic:"camera",c1:"#334155",c2:"#3B82F6",g:4,v:{v:"foto",f:""}},
  notas:{n:"Anotações",ic:"notebook-pen",c1:"#854D0E",c2:"#F97316",g:4,v:{v:"list",k:"notas"}},
  grav:{n:"Gravação de audiobooks",ic:"mic",c1:"#9333EA",c2:"#EC4899",g:9},
  ajustes:{n:"Ajustes",ic:"settings",c1:"#4F46E5",c2:"#A855F7",g:9},
  home:{n:"Início",ic:"house",c1:"#4F46E5",c2:"#FF8A3D",g:9}
};
const mstyle=k=>`style="--c1:${MODS[k].c1};--c2:${MODS[k].c2}"`;

/* ================= FRASES ================= */
const FRASES=[
["Dê o primeiro passo com fé. Você não precisa ver a escada inteira, apenas o primeiro degrau.","Martin Luther King Jr."],
["Se não puder voar, corra. Se não puder correr, ande. Se não puder andar, rasteje. Mas continue seguindo em frente.","Martin Luther King Jr."],
["A hora é sempre certa para fazer o que é certo.","Martin Luther King Jr."],
["A escuridão não pode expulsar a escuridão; só a luz pode fazer isso.","Martin Luther King Jr."],
["A mente é o limite. Enquanto a mente puder imaginar que você pode fazer algo, você pode.","Arnold Schwarzenegger"],
["A força não vem de vencer. Suas lutas desenvolvem suas forças.","Arnold Schwarzenegger"],
["Você não pode subir a escada do sucesso com as mãos nos bolsos.","Arnold Schwarzenegger"],
["Odiei cada minuto de treino, mas dizia: não desista. Sofra agora e viva o resto da vida como um campeão.","Muhammad Ali"],
["Não conte os dias. Faça os dias contarem.","Muhammad Ali"],
["Sempre parece impossível até que seja feito.","Nelson Mandela"],
["No que diz respeito ao empenho, ao compromisso, ao esforço, à dedicação, não existe meio-termo.","Ayrton Senna"],
["Não reze por uma vida fácil. Reze pela força para suportar uma difícil.","Bruce Lee"],
["Seja água, meu amigo.","Bruce Lee"],
["Nenhum ser humano é limitado.","Eliud Kipchoge"],
["Capoeira é tudo o que a boca come.","Mestre Pastinha"],
["Somos aquilo que fazemos repetidamente. A excelência, então, não é um ato, mas um hábito.","Will Durant"],
["Uma jornada de mil quilômetros começa com um único passo.","Lao-Tsé"],
["Tudo posso naquele que me fortalece.","Filipenses 4:13"],
["Seja forte e corajoso. Não tenha medo nem desanime.","Josué 1:9"],
["Educação não transforma o mundo. Educação muda as pessoas. Pessoas transformam o mundo.","Paulo Freire"],
["O que vale na vida não é o ponto de partida e sim a caminhada.","Cora Coralina"],
["A única maneira de fazer um excelente trabalho é amar o que você faz.","Steve Jobs"],
["Disciplina é liberdade.","Jocko Willink"],
["Um degrau por dia. Todo dia.","Mantra Moving Up"],
["Feito é melhor que perfeito.","Mantra Moving Up"],
["Eu sou capaz, eu sou forte, eu estou subindo.","Mantra Moving Up"],
["Constância vence talento quando o talento não tem constância.","Mantra Moving Up"],
["Hoje eu escolho o caminho difícil que me leva ao lugar certo.","Mantra Moving Up"]
];
let QI=null;
function frasesAll(){return FRASES.concat((cfg().frases||[]).map(f=>[f.t,f.a||"Minha frase"]));}
function quote(){const L=frasesAll();if(QI==null){const d=pd(TODAY());QI=Math.floor(d.getTime()/864e5)%L.length;}return L[QI%L.length];}
ACT.nextQuote=()=>{QI=(QI+1+Math.floor(Math.random()*4))%frasesAll().length;rr();};

/* ================= INÍCIO ================= */
const TRK={gym:{photo:1,t:"Treino de academia"},run:{photo:1,km:1,t:"Corrida"},swim:{photo:1,t:"Natação"},cap:{photo:1,t:"Treino de capoeira"},
  conc:{photo:0,t:"Dia de estudo"},bib:{photo:0,t:"Leitura bíblica"},man:{photo:0,t:"Ritual completo"}};
const tid=(k,d)=>"t_"+k+"_"+d;
const trkHas=(k,d)=>DB.docs.has(tid(k,d));
function greet(){const h=new Date().getHours();return h<5?"Boa madrugada":h<12?"Bom dia":h<18?"Boa tarde":"Boa noite";}
ACT.quickTrk=el=>{const k=el.dataset.k,t=TODAY();if(k==="man")return go({v:"manif"});if(TRK[k].photo)return trkSheet(k,t);toggleSimple(k,t);rr();};

/* ================= NAV ================= */
const NAV=[["home","house","Início"],["cal","calendar-days","Agenda"],["habitos","list-checks","Hábitos"],["lemb","alarm-clock","Lembretes"],["mods","layout-grid","Módulos"]];
function renderNav(){const cur=STACK.length?(STACK[0].v):VIEW.v;$("navIn").innerHTML=NAV.map(([k,i,n])=>`<button data-a="tab" data-v="${gv({v:k})}" aria-current="${cur===k||(k==="mods"&&!NAV.some(x=>x[0]===cur))}"><span class="pill">${ic(i)}</span>${n}</button>`).join("");}

/* ================= VISUALIZADOR ================= */
let VW=null;
function openViewer(items,i,opts={}){VW={items,i,opts};let d=$("viewer");if(!d){d=document.createElement("div");d.id="viewer";d.className="viewer";document.body.appendChild(d);}
  d.innerHTML=`<div class="vt"><button class="ib" data-a="vwClose" aria-label="Fechar">${ic("x")}</button><div class="grow small" id="vwN"></div>${opts.onEdit?`<button class="ib" data-a="vwEdit" aria-label="Editar">${ic("pencil")}</button>`:""}${opts.onDel?`<button class="ib" data-a="vwDel" aria-label="Apagar">${ic("trash-2")}</button>`:""}</div>
  <div class="stage" id="vwS"><img id="vwI" alt=""><button class="nv l" data-a="vwPrev" aria-label="Anterior">${ic("chevron-left")}</button><button class="nv r" data-a="vwNext" aria-label="Próxima">${ic("chevron-right")}</button></div><div class="cap" id="vwC"></div>`;
  document.body.style.overflow="hidden";guard();vwShow();
  const s=$("vwS");let x0=null,dx=0;
  s.addEventListener("pointerdown",e=>{x0=e.clientX;dx=0;$("vwI").style.transition="none";});
  s.addEventListener("pointermove",e=>{if(x0==null)return;dx=e.clientX-x0;$("vwI").style.transform=`translateX(${dx}px)`;});
  const end=()=>{if(x0==null)return;const im=$("vwI");im.style.transition="";im.style.transform="";if(Math.abs(dx)>50)vwGo(dx<0?1:-1);x0=null;};
  s.addEventListener("pointerup",end);s.addEventListener("pointercancel",end);s.addEventListener("pointerleave",end);}
async function vwShow(){if(!VW)return;const it=VW.items[VW.i];$("vwN").textContent=(VW.i+1)+" de "+VW.items.length;
  const im=$("vwI");im.src=await imgURL(it.ref,"t");imgURL(it.ref,"f").then(u=>{if(VW&&VW.items[VW.i]===it){const p=new Image();p.onload=()=>{if(VW&&VW.items[VW.i]===it)im.src=u;};p.src=u;}});
  $("vwC").innerHTML=(it.t||it.s)?`<b>${esc(it.t||"")}</b><span>${esc(it.s||"")}</span>`:"";
  [VW.i-1,VW.i+1].forEach(j=>{const n=VW.items[j];if(n)imgURL(n.ref,"f").then(u=>{const p=new Image();p.src=u;});});}
function vwGo(d){if(!VW)return;const n=VW.i+d;if(n<0||n>=VW.items.length)return;VW.i=n;vwShow();}
function closeViewer(){const d=$("viewer");if(d)d.remove();VW=null;document.body.style.overflow="";}
ACT.vwClose=()=>{closeViewer();};ACT.vwPrev=()=>vwGo(-1);ACT.vwNext=()=>vwGo(1);
ACT.vwDel=()=>{const it=VW.items[VW.i],o=VW.opts;confirmSheet("Apagar esta foto?","A foto será removida para sempre.","Apagar foto",()=>{o.onDel(it);VW.items.splice(VW.i,1);if(!VW.items.length){closeViewer();}else{VW.i=Math.min(VW.i,VW.items.length-1);vwShow();}rr();});};
ACT.vwEdit=()=>{const it=VW.items[VW.i],o=VW.opts;closeViewer();o.onEdit(it);};

/* ================= CALENDÁRIOS DE CHECK ================= */
function monthGrid(y,m,cell){const st=new Date(y,m,1).getDay(),n=new Date(y,m+1,0).getDate();let h=DSEM.map(d=>`<div class="h">${d}</div>`).join("");
  for(let i=0;i<st;i++)h+=`<div class="day out"></div>`;for(let d=1;d<=n;d++)h+=cell(y+"-"+pad(m+1)+"-"+pad(d),d);return `<div class="cal">${h}</div>`;}
function calNav(y,m,act){return `<div class="calnav"><button class="ib" data-a="${act}" data-d="-1" aria-label="Mês anterior">${ic("chevron-left")}</button><h3>${MESES[m]} ${y}</h3><button class="ib" data-a="${act}" data-d="1" aria-label="Próximo mês">${ic("chevron-right")}</button></div>`;}
function ym(){const n=new Date();return[VIEW.y??n.getFullYear(),VIEW.m??n.getMonth()];}
ACT.mNav=el=>{let[y,m]=ym();m+=+el.dataset.d;if(m<0){m=11;y--;}if(m>11){m=0;y++;}VIEW.y=y;VIEW.m=m;rr();};
function streakK(k){let d=TODAY();if(!trkHas(k,d))d=addDays(d,-1);let n=0;while(trkHas(k,d)){n++;d=addDays(d,-1);}return n;}
function trkDocs(k,prefix){return all("trk").filter(x=>x.k===k&&(!prefix||x.d.startsWith(prefix)));}
VIEWS.trk=()=>{const k=VIEW.k,m0=MODS[k],T=TRK[k],[y,m]=ym(),pre=y+"-"+pad(m+1),t=TODAY();
  const mes=trkDocs(k,pre),ano=trkDocs(k,String(y));const km=T.km?sum(mes.map(x=>x.km)):0;
  let h=topbar(m0.n,k)+`<div class="hero"><h2>${esc(m0.n)}</h2><div class="muted small">${T.photo?"Toque no dia para registrar com foto. A foto aparece no número do dia.":"Toque no dia para marcar o check."}</div>
   <div class="stats"><div><b>${mes.length}</b><span>neste mês</span></div><div><b>${streakK(k)}</b><span>dias seguidos</span></div><div><b>${T.km?km.toLocaleString("pt-BR",{maximumFractionDigits:1})+" km":ano.length}</b><span>${T.km?"no mês":"em "+y}</span></div></div></div>`;
  h+=calNav(y,m,"mNav")+monthGrid(y,m,(d,n)=>{const doc=getD(tid(k,d));const cls=(d===t?" td":"")+(d>t?" fut":"");
    if(doc&&doc.img)return `<button class="day ph${cls}" data-a="trkDay" data-d="${d}" aria-label="Dia ${n}, com foto">${imgTag(doc.img,"t")}<span class="dn">${n}</span></button>`;
    if(doc)return `<button class="day done${cls}" data-a="trkDay" data-d="${d}" aria-label="Dia ${n}, feito">${n}${ic("check")}</button>`;
    return `<button class="day${cls}" data-a="trkDay" data-d="${d}" aria-label="Dia ${n}">${n}</button>`;});
  const list=mes.sort((a,b)=>b.d.localeCompare(a.d));
  if(list.length){h+=`<div class="grp">Registros de ${MESES[m].toLowerCase()}</div>`+list.map(x=>`<div class="item"><button class="ibody row" data-a="trkDay" data-d="${x.d}">${x.img?`<span class="thm">${imgTag(x.img,"t")}</span>`:`<span class="mb" style="width:52px;height:52px">${ic(m0.ic)}</span>`}<span class="grow"><b>${esc(x.t||T.t)}</b><span class="small muted">${esc(flong(x.d))}${x.km?" · "+x.km+" km":""}${x.s?" · "+esc(x.s):""}</span></span></button></div>`).join("");}
  else h+=`<div style="margin-top:14px">${empty(k,"Nenhum registro neste mês","Toque em um dia do calendário para registrar.")}</div>`;
  return `<div class="app">${h}</div>`;};
ACT.trkDay=el=>{const k=VIEW.k,d=el.dataset.d,doc=getD(tid(k,d));
  if(TRK[k].photo){if(doc&&doc.img){const [y,m]=[d.slice(0,4),d.slice(5,7)];const ph=trkDocs(k,y+"-"+m).filter(x=>x.img).sort((a,b)=>a.d.localeCompare(b.d));
      const items=ph.map(x=>({ref:x.img,t:x.t||TRK[k].t,s:[flong(x.d),x.km?x.km+" km":"",x.s].filter(Boolean).join(" · "),id:x.id,d:x.d}));
      return openViewer(items,items.findIndex(x=>x.d===d),{onEdit:it=>trkSheet(k,it.d),onDel:it=>{removeDoc(it.id);}});}
    return trkSheet(k,d);}
  if(!doc){toggleSimple(k,d);rr();return;}
  sheet(`<h2>${esc(MODS[k].n)}</h2><div class="muted">${esc(flong(d))}</div><label class="fld"><span>Anotação (opcional)</span><textarea id="tN" placeholder="${k==="bib"?"Ex.: Salmos 23, Provérbios 3":"Ex.: 3h de Direito Constitucional"}">${esc(doc.s||"")}</textarea></label>
   <div class="btns"><button class="btn full" id="tS">Salvar anotação</button><button class="btn danger full" id="tX">Desmarcar o dia</button></div>`,s=>{
    s.querySelector("#tS").onclick=()=>{doc.s=s.querySelector("#tN").value.trim();save(doc);closeSheet();rr();};
    s.querySelector("#tX").onclick=()=>{removeDoc(doc.id);closeSheet();rr();};});};
function toggleSimple(k,d){const id=tid(k,d);if(DB.docs.has(id)){removeDoc(id);toast("rotate-ccw","Check removido",MODS[k].n);}else{save({id,c:"trk",k,d});toast("check",MODS[k].n+": check!",flong(d));}}
let PEND=null;
function trkSheet(k,d){const doc=getD(tid(k,d)),T=TRK[k];PEND=null;
  sheet(`<h2>${esc(MODS[k].n)}</h2><div class="muted" style="margin-bottom:10px">${esc(flong(d))}</div>
   <button class="pick" id="pk" data-a="pickTrk">${doc&&doc.img?imgTag(doc.img,"t"):""}<span>${ic("camera")}</span><span>${doc&&doc.img?"Trocar foto":"Tirar ou escolher foto"}</span></button>
   <label class="fld"><span>Título</span><input id="tT" value="${esc(doc?doc.t:"")}" placeholder="${esc(T.t)}"></label>
   <label class="fld"><span>Subtítulo / mensagem</span><input id="tSub" value="${esc(doc?doc.s:"")}" placeholder="Ex.: ${k==="gym"?"Peito e tríceps, carga nova!":k==="run"?"Ritmo 5:30, beira-mar":k==="swim"?"1.500 m, crawl":"Roda no grupo, aprendi um floreio"}"></label>
   ${T.km?`<label class="fld"><span>Distância (km)</span><input id="tK" inputmode="decimal" value="${doc&&doc.km?String(doc.km).replace(".",","):""}" placeholder="Ex.: 8,5"></label>`:""}
   <div class="btns"><button class="btn full" id="tS">${doc?"Salvar alterações":"Registrar treino"}</button>${doc?`<button class="btn danger full" id="tX">Apagar registro</button>`:""}</div>`,s=>{
    s.querySelector("#tS").onclick=async e=>{const b=e.currentTarget;b.disabled=true;b.textContent="Salvando…";
      try{const o=doc||{id:tid(k,d),c:"trk",k,d};o.t=s.querySelector("#tT").value.trim();o.s=s.querySelector("#tSub").value.trim();if(T.km)o.km=num(s.querySelector("#tK").value)||0;
        if(PEND){const old=o.img;o.img=await storeImage(PEND);if(old)DB.be.imgs.del(old);}save(o);closeSheet();rr();toast("check","Treino registrado!",o.t||T.t);}
      catch(err){b.disabled=false;b.textContent="Tentar de novo";toast("triangle-alert","A foto não foi enviada","Tente de novo ou escolha outra foto.");}};
    const x=s.querySelector("#tX");if(x)x.onclick=()=>{removeDoc(doc.id);closeSheet();rr();};});}
ACT.pickTrk=async el=>{const f=await pickFiles(false);if(!f.length)return;el.innerHTML=`<span>${ic("hourglass")}</span><span>Preparando foto…</span>`;
  try{PEND=await processImage(f[0]);el.innerHTML=`<img src="${PEND.preview}" alt=""><span></span>`;}catch(e){el.innerHTML=`<span>${ic("triangle-alert")}</span><span>Não deu para abrir esta imagem</span>`;}};

/* ================= LISTAS GENÉRICAS ================= */
const BLOCOS=[["Físico","dumbbell"],["Profissional","briefcase"],["Financeiro","coins"],["Relacionamento","heart"],["Espiritual","sparkles"]];
const AREAS=["Saúde e corpo","Finanças","Carreira","Estudos","Relacionamento","Espiritualidade","Cultura e arte","Pessoal"];
const yNow=()=>new Date().getFullYear();
function yearsOf(c,k,base){const s=new Set(base.map(String));all(c).forEach(i=>{if(i[k])s.add(String(i[k]));});(single("yrs_"+c,{l:[]}).l||[]).forEach(v=>s.add(String(v)));return[...s].sort();}
const STM={c:"c",a:"a",n:"n"};
function stChip(f,v){const o=(f.opts||[]).find(x=>x[0]===v);return o?`<span class="chip ${o[2]||""}">${esc(o[1])}</span>`:"";}
const LISTS={
  prof:{title:"Vida profissional",fields:[{k:"t",l:"Título",auto:1,ph:"Ex.: Lançar meu portfólio"},{k:"tipo",l:"Tipo",type:"select",opts:["Projeto","Objetivo de carreira","Conquista","Ideia","Networking","Curso / certificação"],def:"Projeto"},
      {k:"st",l:"Situação",type:"status",opts:[["todo","A fazer","n"],["doing","Em andamento","a"],["done","Concluído","c"]]},{k:"prazo",l:"Prazo",type:"date"},{k:"nota",l:"Detalhes",type:"textarea",ph:"Próximos passos, contatos, links…"}],
    group:i=>i.tipo||"Outros",emptyT:"Sua carreira começa aqui",emptyX:"Registre projetos, objetivos, conquistas e contatos importantes."},
  aprend:{title:"Aprendizados",tabs:{k:"ano",base:()=>{const y=yNow();return[2022,2023,2024,2025,2026,y,y+1].filter((v,i,a)=>a.indexOf(v)===i);},def:()=>String(yNow())},
    fields:[{k:"t",l:"O que aprendi",auto:1,ph:"Ex.: Pedir ajuda cedo economiza semanas"},{k:"texto",l:"Anotação",type:"textarea",ph:"Contexto, exemplo, como aplicar…"},{k:"fonte",l:"Fonte",ph:"Livro, curso, pessoa, situação"},{k:"d",l:"Data",type:"date",def:TODAY}],
    sort:(a,b)=>(b.d||"").localeCompare(a.d||""),emptyT:"Nenhuma nota neste ano",emptyX:"Guarde aqui as lições que você não quer esquecer."},
  casa:{title:"Casamento",check:"feito",fields:[{k:"t",l:"Meta ou compromisso",auto:1,ph:"Ex.: Encontro a dois toda sexta"},{k:"area",l:"Área",type:"select",opts:["Comunicação","Tempo de qualidade","Romance","Finanças do casal","Fé e propósito","Planos e sonhos","Casa e família"],def:"Tempo de qualidade"},
      {k:"prazo",l:"Prazo",type:"date"},{k:"nota",l:"Detalhes",type:"textarea"},{k:"feito",l:"Concluído",type:"check"}],
    group:i=>i.area||"Outros",top:items=>progTop(items,"feito","metas do casal concluídas"),emptyT:"Metas para o casamento",emptyX:"Crie metas e marque cada uma quando cumprir."},
  metas:{title:"Metas",check:"feito",fields:[{k:"t",l:"Meta",auto:1,ph:"Ex.: Correr 10 km abaixo de 55 min"},{k:"esp",l:"O que exatamente?",type:"textarea",ph:"Descreva de forma clara e específica"},
      {k:"un",l:"Unidade de medida",ph:"km, R$, livros, kg…"},{k:"alvo",l:"Alvo",type:"number",ph:"Ex.: 10"},{k:"atual",l:"Atual",type:"number",ph:"Ex.: 4"},{k:"prazo",l:"Prazo",type:"date"},
      {k:"area",l:"Área",type:"select",opts:AREAS,def:"Pessoal"},{k:"feito",l:"Meta atingida",type:"check"}],
    group:i=>i.area||"Pessoal",sub:metaSub,top:items=>progTop(items,"feito","metas atingidas")+`<div class="note">${ic("target")} Meta boa é específica, mensurável e tem prazo. Preencha alvo e atual para ver o progresso.</div>`,emptyT:"Defina sua primeira meta",emptyX:"Clara, específica, com número e prazo."},
  ano:{title:"Metas do ano",check:"feito",tabs:{k:"ano",base:()=>{const y=yNow();return[y,y+1,2027].filter((v,i,a)=>a.indexOf(v)===i);},def:()=>String(Math.max(2027,yNow()))},
    fields:[{k:"t",l:"Meta",auto:1,ph:"Ex.: Correr 10 km abaixo de 55 min"},{k:"area",l:"Bloco",type:"select",opts:()=>BLOCOS.map(b=>b[0]),def:"Físico"},{k:"esp",l:"O que exatamente?",type:"textarea",ph:"Descreva de forma clara e específica"},{k:"un",l:"Unidade de medida",ph:"km, R$, livros, kg…"},{k:"alvo",l:"Alvo",type:"number"},{k:"atual",l:"Atual",type:"number"},{k:"prazo",l:"Prazo",type:"date"},{k:"nota",l:"Como vou chegar lá",type:"textarea"},{k:"feito",l:"Meta atingida",type:"check"}],
    group:i=>i.area||"Outros",groupFixed:()=>BLOCOS.map(b=>b[0]),sub:metaSub,top:items=>progTop(items,"feito","metas do ano atingidas")+`<div class="note">${ic("target")} Meta boa é específica, mensurável e tem prazo. Preencha alvo e atual para ver o progresso.</div>`,emptyT:"Monte o seu ano",emptyX:"Organize as metas em cinco blocos: físico, profissional, financeiro, relacionamento e espiritual."},
  livros:{title:"Livros lidos",fields:[{k:"t",l:"Título",auto:1},{k:"autor",l:"Autor(a)"},{k:"fim",l:"Terminei em",type:"date",def:TODAY},{k:"nota",l:"Avaliação",type:"stars"},{k:"res",l:"O que ficou",type:"textarea",ph:"Ideias, frases, aprendizados"}],
    group:i=>(i.fim||"").slice(0,4)||"Sem data",groupDesc:1,sort:(a,b)=>(b.fim||"").localeCompare(a.fim||""),
    sub:i=>`<div class="meta">${i.autor?`<span class="chip">${esc(i.autor)}</span>`:""}${i.fim?`<span class="chip">${fdate(i.fim)}</span>`:""}${i.nota?`<span class="chip a">${"★".repeat(i.nota)}</span>`:""}</div>${i.res?`<p>${esc(i.res)}</p>`:""}`,
    top:items=>{const y=String(yNow());const n=items.filter(i=>(i.fim||"").startsWith(y)).length;return `<div class="hero" style="margin-bottom:10px"><div class="row"><div class="grow"><h2>${n} ${n===1?"livro":"livros"} em ${y}</h2><div class="muted small">${items.length} no total</div></div><span class="mb">${ic("library")}</span></div></div>`;},
    emptyT:"Sua estante está vazia",emptyX:"Adicione os livros que você terminou."},
  fiz:{title:"O que eu fiz hoje",quick:{k:"t",ph:"O que você fez hoje? Enter para salvar",extra:()=>({d:TODAY()})},
    fields:[{k:"t",l:"O que eu fiz",auto:1},{k:"d",l:"Data",type:"date",def:TODAY},{k:"nota",l:"Detalhes",type:"textarea"}],
    group:i=>i.d||"",groupLabel:g=>flong(g),groupDesc:1,sub:i=>i.nota?`<p>${esc(i.nota)}</p>`:"",emptyT:"Comece a lista de hoje",emptyX:"Escreva cada coisa que você realizou. No fim da semana, a lista mostra o quanto você subiu."},
  renda:{title:"Fontes de renda",fields:[{k:"t",l:"Fonte",auto:1,ph:"Ex.: Fotografia de casamentos"},{k:"st",l:"Como está",type:"status",opts:[["ativa","Ativa","c"],["const","Em construção","a"],["pausa","Pausada","n"],["ideia","Ideia",""]]},
      {k:"val",l:"Rende por mês (média)",type:"money"},{k:"nota",l:"Situação e próximos passos",type:"textarea"}],
    group:i=>({ativa:"Ativas",const:"Em construção",pausa:"Pausadas",ideia:"Ideias"})[i.st]||"Outras",groupOrder:["Ativas","Em construção","Ideias","Pausadas","Outras"],
    sub:i=>`<div class="meta">${stChip(LISTS.renda.fields[1],i.st)}${i.val?`<span class="amt">${money(i.val)}/mês</span>`:""}</div>${i.nota?`<p>${esc(i.nota)}</p>`:""}`,
    top:items=>{const t=sum(items.filter(i=>i.st==="ativa").map(i=>i.val));return `<div class="hero" style="margin-bottom:10px"><div class="muted small">Renda mensal das fontes ativas</div><h2 style="font-size:2rem">${money(t)}</h2><div class="muted small">${items.length} fontes cadastradas</div></div>`;},
    emptyT:"Mapeie suas fontes de renda",emptyX:"Salário, serviços, produtos, ideias. Veja quanto cada uma rende."},
  habil:{title:"Habilidades a aprender",fields:[{k:"t",l:"Habilidade",auto:1,ph:"Ex.: Edição de vídeo no DaVinci"},{k:"st",l:"Situação",type:"status",opts:[["quero","Quero aprender","n"],["apr","Aprendendo","a"],["dom","Dominei","c"]]},
      {k:"niv",l:"Nível",type:"pct"},{k:"prazo",l:"Prazo",type:"date"},{k:"rec",l:"Recursos",type:"textarea",ph:"Cursos, vídeos, livros, mentores"}],
    sub:i=>`<div class="meta">${stChip(LISTS.habil.fields[1],i.st)}${i.prazo?`<span class="chip">até ${fdate(i.prazo)}</span>`:""}</div><div class="bar"><i style="width:${i.niv||0}%"></i></div>`,
    sort:(a,b)=>(b.niv||0)-(a.niv||0),emptyT:"O que você quer dominar?",emptyX:"Liste habilidades e acompanhe seu nível."},
  grav:{title:"Gravação de audiobooks",fields:[{k:"t",l:"Nome do audiobook",auto:1},{k:"autor",l:"Autor(a)"},{k:"st",l:"Etapa",type:"status",opts:[["rot","Preparação","n"],["grav","Gravando","a"],["edi","Edição","a"],["fim","Finalizado","c"],["pub","Publicado","c"]]},
      {k:"cf",l:"Capítulos gravados",type:"number"},{k:"ct",l:"Total de capítulos",type:"number"},{k:"nota",l:"Anotações",type:"textarea"}],
    sub:i=>{const p=i.ct?Math.round((i.cf||0)/i.ct*100):0;return `<div class="meta">${stChip(LISTS.grav.fields[2],i.st)}${i.autor?`<span class="chip">${esc(i.autor)}</span>`:""}${i.ct?`<span class="chip">${i.cf||0}/${i.ct} capítulos</span>`:""}</div>${i.ct?`<div class="bar"><i style="width:${clamp(p,0,100)}%"></i></div>`:""}`;},
    emptyT:"Nenhuma gravação ainda",emptyX:"Liste os audiobooks que você está gravando."},
  notas:{title:"Anotações",search:1,fields:[{k:"t",l:"Título",auto:1},{k:"texto",l:"Texto",type:"textarea",tall:1,ph:"Escreva livremente…"},{k:"fix",l:"Fixar no topo",type:"check"}],
    sort:(a,b)=>(b.fix?1:0)-(a.fix?1:0)||(b.u||0)-(a.u||0),sub:i=>`<div class="meta">${i.fix?`<span class="chip m">${ic("pin")} fixada</span>`:""}<span class="chip">${new Date(i.u||Date.now()).toLocaleDateString("pt-BR")}</span></div>${i.texto?`<p>${esc(i.texto)}</p>`:""}`,
    emptyT:"Seu espaço de escrita",emptyX:"Textos pessoais, ideias, reflexões. Tudo guardado aqui."}
};
function metaSub(i){const a=+i.alvo||0,v=+i.atual||0,p=a?clamp(Math.round(v/a*100),0,100):(i.feito?100:0);
  return `<div class="meta">${i.prazo?`<span class="chip">até ${fdate(i.prazo)}</span>`:""}${a?`<span class="chip m">${v.toLocaleString("pt-BR")} / ${a.toLocaleString("pt-BR")} ${esc(i.un||"")}</span>`:""}${a?`<span class="chip">${p}%</span>`:""}</div>${i.esp?`<p>${esc(i.esp)}</p>`:""}${a?`<div class="bar"><i style="width:${p}%"></i></div>`:""}`;}
function progTop(items,k,label){const n=items.filter(i=>i[k]).length,p=items.length?Math.round(n/items.length*100):0;
  return `<div class="hero row" style="margin-bottom:10px"><div class="ring" style="--p:${p}"><b>${p}%</b></div><div><h2>${n} de ${items.length}</h2><div class="muted small">${esc(label)}</div></div></div>`;}
function autoSub(L,i){const parts=[];L.fields.forEach(f=>{if(f.k==="t"||f.k===L.check)return;const v=i[f.k];if(v===""||v==null||v===false)return;
  if(f.type==="status")parts.push(stChip(f,v));else if(f.type==="select")parts.push(`<span class="chip">${esc(v)}</span>`);else if(f.type==="date"&&f.k!=="d")parts.push(`<span class="chip">${f.k==="prazo"?"até ":""}${fdate(v)}</span>`);else if(f.type==="money")parts.push(`<span class="amt">${money(v)}</span>`);else if(f.type==="text"||!f.type){if(f.k!=="t")parts.push(`<span class="chip">${esc(v)}</span>`);}});
  const ta=L.fields.find(f=>f.type==="textarea"&&i[f.k]);return (parts.length?`<div class="meta">${parts.join("")}</div>`:"")+(ta?`<p>${esc(i[ta.k])}</p>`:"");}
function itemCard(k,i){const L=LISTS[k],done=L.check&&i[L.check];
  return `<div class="item">${L.check?`<button class="ck ${done?"on":""}" data-a="liCheck" data-k="${k}" data-id="${i.id}" aria-label="Concluir">${ic("check")}</button>`:""}<button class="ibody" data-a="liEdit" data-k="${k}" data-id="${i.id}"><b class="${done?"strike":""}">${esc(i.t||"Sem título")}</b>${(L.sub||autoSub.bind(null,L))(i)}</button></div>`;}
function listBody(k){const L=LISTS[k];let items=all(k);let h="";
  if(L.tabs){const tv=VIEW.tab||L.tabs.def();const ys=yearsOf(k,L.tabs.k,L.tabs.base());items=items.filter(i=>String(i[L.tabs.k])===String(tv));
    h+=`<div class="tabs">${ys.map(y=>`<button data-a="liTab" data-v="${y}" aria-pressed="${y===String(tv)}">${y}</button>`).join("")}<button data-a="liYear" data-k="${k}" aria-label="Adicionar ano">${ic("plus")} Ano</button></div>`;}
  if(L.top)h+=L.top(items);
  if(L.quick)h+=`<div class="qadd"><input id="qa" placeholder="${esc(L.quick.ph)}" data-enter="liQuick" data-k="${k}" aria-label="${esc(L.quick.ph)}"><button class="btn" data-a="liQuick" data-k="${k}" aria-label="Adicionar">${ic("plus")}</button></div>`;
  if(L.search){h+=`<div class="search">${ic("search")}<input id="lsq" placeholder="Buscar" value="${esc(VIEW.q||"")}" data-in="liSearch"></div>`;const q=(VIEW.q||"").toLowerCase();if(q)items=items.filter(i=>JSON.stringify(i).toLowerCase().includes(q));}
  items.sort(L.sort||((a,b)=>(a.feito?1:0)-(b.feito?1:0)||(b.u||0)-(a.u||0)));
  if(L.groupFixed){const F=L.groupFixed(),G=new Map(F.map(g=>[g,[]]));items.forEach(i=>{let g=L.group(i);if(!G.has(g))G.set(g,[]);G.get(g).push(i);});
    G.forEach((arr,g)=>{const bi=BLOCOS.find(b=>b[0]===g);h+=`<div class="grp blk">${bi?`<span class="mb" style="width:30px;height:30px;border-radius:9px;font-size:.9rem">${ic(bi[1])}</span>`:""}${esc(g)}<span class="chip">${arr.filter(i=>i[L.check]).length}/${arr.length}</span><button class="ib" style="width:32px;height:32px" data-a="liNew" data-k="${k}" data-area="${esc(g)}" aria-label="Nova meta em ${esc(g)}">${ic("plus")}</button></div>`+(arr.length?arr.map(i=>itemCard(k,i)).join(""):`<div class="note" style="margin:0 0 6px">Nenhuma meta no bloco ${esc(g.toLowerCase())}. Toque no + para criar.</div>`);});
    return h;}
  if(!items.length)return h+empty(k,VIEW.q?"Nada encontrado":L.emptyT,VIEW.q?"Tente outra palavra.":L.emptyX,VIEW.q?"":`<button class="btn sm" data-a="liNew" data-k="${k}">${ic("plus")} Adicionar</button>`);
  if(L.group){const G=new Map();items.forEach(i=>{const g=L.group(i);if(!G.has(g))G.set(g,[]);G.get(g).push(i);});let keys=[...G.keys()];
    if(L.groupOrder)keys.sort((a,b)=>L.groupOrder.indexOf(a)-L.groupOrder.indexOf(b));else if(L.groupDesc)keys.sort().reverse();else keys.sort();
    keys.forEach(g=>{const arr=G.get(g);h+=`<div class="grp">${esc(L.groupLabel?L.groupLabel(g):g)}<span class="chip">${arr.length}</span></div>`+arr.map(i=>itemCard(k,i)).join("");});}
  else h+=items.map(i=>itemCard(k,i)).join("");
  return h;}
VIEWS.list=()=>{const k=VIEW.k;return `<div class="app">${topbar(MODS[k].n,k)}${listBody(k)}</div>${fab("liNew","Adicionar",`data-k="${k}"`)}`;};
ACT.liTab=el=>{VIEW.tab=el.dataset.v;rr();};
ACT.liYear=el=>{const k=el.dataset.k;sheet(`<h2>Adicionar ano</h2><label class="fld"><span>Ano</span><input id="yv" inputmode="numeric" value="${yNow()+1}" autofocus></label><div class="btns"><button class="btn full" id="yS">Adicionar</button></div>`,s=>{
  s.querySelector("#yS").onclick=()=>{const v=parseInt(s.querySelector("#yv").value,10);if(!(v>1900&&v<2200))return toast("triangle-alert","Digite um ano válido","Ex.: 2028");const d=single("yrs_"+k,{l:[]});if(!d.l.includes(v))d.l.push(v);save(d);VIEW.tab=String(v);closeSheet();rr();};});};
CH.liSearch=el=>{VIEW.q=el.value;const pos=el.selectionStart;rr();const n=$("lsq");if(n){n.focus();try{n.setSelectionRange(pos,pos);}catch(e){}}};
ACT.liQuick=el=>{const k=el.dataset.k,L=LISTS[k],inp=$("qa");const v=inp.value.trim();if(!v){inp.focus();return;}
  save(Object.assign({id:k+"_"+nid(),c:k,[L.quick.k]:v},L.quick.extra?L.quick.extra():{}));rr();const n=$("qa");if(n)n.focus();toast("check","Adicionado",v);};
ACT.liCheck=el=>{const k=el.dataset.k,i=getD(el.dataset.id),L=LISTS[k];i[L.check]=!i[L.check];if(i[L.check]&&i.alvo&&!(+i.atual>=+i.alvo))i.atual=i.alvo;save(i);rr();if(i[L.check])toast("party-popper","Concluído!",i.t);};
ACT.liNew=el=>liForm(el.dataset.k,null,el.dataset.area?{area:el.dataset.area}:null);
ACT.liEdit=el=>liForm(el.dataset.k,getD(el.dataset.id));
function liForm(k,item,pre){const L=LISTS[k];sheet(`<h2>${item?"Editar":"Novo item"}</h2><div class="muted small">${esc(L.title)}</div>${L.fields.map(f=>fieldHTML(f,item?item[f.k]:(pre&&pre[f.k]!=null?pre[f.k]:null))).join("")}
  <div class="btns"><button class="btn full" id="lS">${item?"Salvar alterações":"Adicionar"}</button>${item?`<button class="btn danger full" id="lX">Apagar</button>`:""}</div>`,s=>{
  s.querySelector("#lS").onclick=()=>{const o=readFields(L.fields,s);if(!o.t)return toast("triangle-alert","Preencha o primeiro campo",L.fields[0].l);
    const d=item||{id:k+"_"+nid(),c:k};if(!item&&L.tabs)d[L.tabs.k]=VIEW.tab||L.tabs.def();Object.assign(d,o);save(d);closeSheet();rr();};
  const x=s.querySelector("#lX");if(x)x.onclick=()=>confirmSheet("Apagar este item?",item.t||"","Apagar",()=>{removeDoc(item.id);rr();});});}

/* ================= GASTOS ================= */
const CATS=[["Alimentação","#F97316"],["Mercado","#84CC16"],["Transporte","#3B82F6"],["Moradia","#8B5CF6"],["Contas","#06B6D4"],["Saúde","#10B981"],["Esportes","#FF3D7F"],["Educação","#6366F1"],["Lazer","#F59E0B"],["Assinaturas","#A855F7"],["Casamento","#EC4899"],["Vestuário","#0EA5E9"],["Cuidados pessoais","#D946EF"],["Doações","#14B8A6"],["Outros","#94A3B8"]];
const PAGS=["Pix","Cartão","Débito","Dinheiro","Boleto","Outro"];
const catCol=c=>(CATS.find(x=>x[0]===c)||CATS[CATS.length-1])[1];
VIEWS.gastos=()=>{const y=VIEW.y??yNow(),m=VIEW.m??new Date().getMonth(),orc=+cfg().orc||0;
  const ex=all("exp").filter(e=>e.d&&e.d.startsWith(y+"-"));const bm=Array(12).fill(0);ex.forEach(e=>bm[+e.d.slice(5,7)-1]+=+e.v||0);
  const tot=sum(bm),mx=Math.max(...bm,1),used=bm.filter(v=>v>0).length;const mm=ex.filter(e=>+e.d.slice(5,7)-1===m).sort((a,b)=>b.d.localeCompare(a.d)||(b.u||0)-(a.u||0));const mt=bm[m];
  const bc={};mm.forEach(e=>bc[e.cat||"Outros"]=(bc[e.cat||"Outros"]||0)+(+e.v||0));const cats=Object.entries(bc).sort((a,b)=>b[1]-a[1]);
  let h=topbar("Planilha de gastos","gastos",`<button class="ib" data-a="gOrc" aria-label="Orçamento mensal">${ic("target")}</button>`);
  h+=`<div class="calnav"><button class="ib" data-a="gYear" data-d="-1" aria-label="Ano anterior">${ic("chevron-left")}</button><h3>${y}</h3><button class="ib" data-a="gYear" data-d="1" aria-label="Próximo ano">${ic("chevron-right")}</button></div>
  <div class="card"><div class="row"><div class="grow"><div class="small muted">Total no ano</div><div class="big">${money(tot)}</div></div><div style="text-align:right"><div class="small muted">Média mensal</div><b>${money(used?tot/used:0)}</b></div></div>
   <div class="mbars" style="margin-top:14px">${bm.map((v,i)=>`<button data-a="gMonth" data-m="${i}" aria-pressed="${i===m}" aria-label="${MESES[i]}: ${money(v)}"><i style="height:${Math.max(4,v/mx*100)}%"></i><span>${MES3[i]}</span></button>`).join("")}</div></div>
  <div class="hero" style="margin-top:12px"><div class="row"><div class="grow"><div class="muted small">${MESES[m]} de ${y}</div><h2 style="font-size:2rem">${money(mt)}</h2><div class="muted small">${mm.length} ${mm.length===1?"gasto":"gastos"}</div></div></div>
   ${orc?`<div class="small" style="margin-top:10px">${mt<=orc?"Restam "+money(orc-mt)+" do orçamento de "+money(orc):"Passou "+money(mt-orc)+" do orçamento de "+money(orc)}</div><div class="bar"><i style="width:${clamp(mt/orc*100,0,100)}%"></i></div>`:""}</div>`;
  h+=`<div class="btns h" style="margin-top:12px"><button class="btn ghost" data-a="gFoto">${ic("camera")} Gasto por foto</button><button class="btn ghost" data-a="gLista">${ic("list-todo")} Colar lista</button></div>`;
  const bp={};mm.forEach(e=>{const k=e.pag||"Não informado";bp[k]=(bp[k]||0)+(+e.v||0);});const pags=Object.entries(bp).sort((a,b)=>b[1]-a[1]);
  if(mm.length)h+=`<div class="card" style="margin-top:12px"><b>Por forma de pagamento</b><div class="wrap-row" style="margin-top:10px">${pags.map(([k,v])=>`<span class="chip" style="padding:6px 12px">${esc(k)} · <b>${money(v)}</b></span>`).join("")}</div></div>`;
  if(cats.length)h+=`<div class="card" style="margin-top:12px"><b>Por categoria</b><div class="cbar">${cats.map(([c,v])=>`<i style="width:${v/mt*100}%;background:${catCol(c)}"></i>`).join("")}</div><div class="leg">${cats.map(([c,v])=>`<div><span class="sw" style="background:${catCol(c)}"></span><span class="ell">${esc(c)}</span><em>${money(v)}</em></div>`).join("")}</div></div>`;
  h+=`<div class="grp">Gastos de ${MESES[m].toLowerCase()}</div>`;
  h+=mm.length?mm.map(e=>`<div class="item"><span class="sw" style="width:12px;height:42px;border-radius:6px;background:${catCol(e.cat)}"></span><button class="ibody" data-a="gEdit" data-id="${e.id}"><div class="row"><b class="grow ell">${e.img?`<span class="compb" data-a="gComp" data-id="${e.id}" title="Ver comprovante">${ic("receipt-text")}</span> `:""}${esc(e.desc||e.cat||"Gasto")}</b><span class="amt">${money(e.v)}</span></div><div class="meta"><span class="chip">${esc(e.cat||"Outros")}</span>${e.pag?`<span class="chip m">${esc(e.pag)}</span>`:""}<span class="chip">${fshort(e.d)}</span></div></button></div>`).join("")
    :empty("gastos","Nenhum gasto em "+MESES[m].toLowerCase(),"Toque no + para registrar o que você gastou.");
  return `<div class="app">${h}</div>${fab("gNew","Adicionar gasto")}`;};
ACT.gYear=el=>{VIEW.y=(VIEW.y??yNow())+ +el.dataset.d;rr();};
ACT.gMonth=el=>{VIEW.m=+el.dataset.m;rr();};
ACT.gNew=()=>gForm(null);ACT.gEdit=el=>gForm(getD(el.dataset.id));
function gForm(e){const y=VIEW.y??yNow(),m=VIEW.m??new Date().getMonth();const t=TODAY();const defD=t.startsWith(y+"-"+pad(m+1))?t:y+"-"+pad(m+1)+"-01";
  sheet(`<h2>${e?"Editar gasto":"Novo gasto"}</h2><label class="fld"><span>Valor (R$)</span><input id="gv" inputmode="decimal" placeholder="0,00" value="${e?String(e.v).replace(".",","):""}" autofocus style="font:800 1.6rem var(--disp)"></label>
   <label class="fld"><span>Com o que gastei</span><input id="gd" value="${esc(e?e.desc:"")}" placeholder="Ex.: Almoço com o time"></label>
   <div class="fld"><span>Categoria</span><div class="seg" data-k="cat">${CATS.map(([c,col])=>`<button type="button" data-a="seg" data-v="${c}" aria-pressed="${(e?e.cat:"Alimentação")===c}"><span class="sw" style="display:inline-block;background:${col};margin-right:5px"></span>${c}</button>`).join("")}</div></div>
   <div class="fld"><span>Forma de pagamento</span><div class="seg" data-k="pag">${PAGS.map(p=>`<button type="button" data-a="seg" data-v="${p}" aria-pressed="${(e?e.pag:"Pix")===p}">${p}</button>`).join("")}</div></div>
   <label class="fld"><span>Data</span><input id="gdt" type="date" value="${e?e.d:defD}"></label>
   <div class="btns"><button class="btn full" id="gS">${e?"Salvar alterações":"Adicionar gasto"}</button>${e?`<button class="btn danger full" id="gX">Apagar gasto</button>`:""}</div>`,s=>{
   s.querySelector("#gS").onclick=()=>{const v=num(s.querySelector("#gv").value);if(!(v>0))return toast("triangle-alert","Digite o valor","Ex.: 35,90");const d=s.querySelector("#gdt").value||defD;
     const o=e||{id:"exp_"+nid(),c:"exp"};Object.assign(o,{v,desc:s.querySelector("#gd").value.trim(),cat:segVal(s,"cat")||"Outros",pag:segVal(s,"pag")||"",d});save(o);VIEW.y=+d.slice(0,4);VIEW.m=+d.slice(5,7)-1;closeSheet();rr();toast("wallet","Gasto salvo",money(v));};
   const x=s.querySelector("#gX");if(x)x.onclick=()=>{removeDoc(e.id);closeSheet();rr();};});}
ACT.gOrc=()=>{const c=cfg();sheet(`<h2>Orçamento mensal</h2><p class="muted small">Defina quanto pretende gastar por mês. O app mostra quanto ainda resta.</p><label class="fld"><span>Valor por mês (R$)</span><input id="ov" inputmode="decimal" value="${c.orc?String(c.orc).replace(".",","):""}" placeholder="Ex.: 3000"></label><div class="btns"><button class="btn full" id="oS">Salvar orçamento</button></div>`,s=>{
  s.querySelector("#oS").onclick=()=>{c.orc=num(s.querySelector("#ov").value);save(c);closeSheet();rr();};});};

/* ================= MARATONA ================= */
VIEWS.mara=()=>{const M=single("mara",{nome:"Minha maratona",data:"",meta:""});const P=all("mp").sort((a,b)=>(a.sem-b.sem)||(a.o-b.o));
  const done=P.filter(p=>p.feito),kmT=sum(P.map(p=>p.km)),kmD=sum(done.map(p=>p.km));const dias=M.data?Math.ceil((pd(M.data)-pd(TODAY()))/864e5):null;
  const cur=(P.find(p=>!p.feito)||{}).sem;
  let h=topbar("Maratona","mara",`<button class="ib" data-a="maraEdit" aria-label="Editar prova">${ic("pencil")}</button>`);
  h+=`<div class="hero"><div class="muted small">${M.data?esc(flong(M.data)):"Defina a data da prova"}</div><h2>${esc(M.nome||"Minha maratona")}</h2>${M.meta?`<div class="muted small">Meta de tempo: ${esc(M.meta)}</div>`:""}
   <div class="stats"><div><b>${dias==null?"—":dias<0?"Feita":dias}</b><span>${dias!=null&&dias>=0?"dias para a prova":"contagem"}</span></div><div><b>${done.length}/${P.length}</b><span>treinos feitos</span></div><div><b>${Math.round(kmD)}</b><span>de ${Math.round(kmT)} km</span></div></div>
   <div class="bar"><i style="width:${P.length?done.length/P.length*100:0}%"></i></div></div>`;
  if(!P.length)h+=`<div style="margin-top:14px">${empty("mara","Monte sua planilha de treino","Gere um plano base de 16 semanas e ajuste do seu jeito, ou adicione treino por treino.",`<button class="btn sm" data-a="maraGen">${ic("sparkles")} Gerar plano de 16 semanas</button>`)}</div>`;
  else{const W=[...new Set(P.map(p=>p.sem))];W.forEach(w=>{const arr=P.filter(p=>p.sem===w),dn=arr.filter(p=>p.feito).length;
    h+=`<div class="grp">Semana ${w}${w===cur?` · atual`:""}<span class="chip ${dn===arr.length?"c":""}">${dn}/${arr.length} · ${Math.round(sum(arr.map(p=>p.km)))} km</span></div>`+arr.map(p=>`<div class="item"><button class="ck ${p.feito?"on":""}" data-a="mpT" data-id="${p.id}" aria-label="Marcar treino">${ic("check")}</button><button class="ibody" data-a="mpEdit" data-id="${p.id}"><b class="${p.feito?"strike":""}">${esc(p.tipo)}${p.km?` · ${String(p.km).replace(".",",")} km`:""}</b><div class="meta">${p.dia?`<span class="chip m">${esc(p.dia)}</span>`:""}${p.desc?`<span class="small muted">${esc(p.desc)}</span>`:""}</div></button></div>`).join("");});
    h+=`<div style="margin-top:16px;text-align:center"><button class="btn ghost sm" data-a="maraClear">${ic("rotate-ccw")} Recomeçar planilha</button></div>`;}
  return `<div class="app">${h}</div>${fab("mpNew","Adicionar treino")}`;};
ACT.maraEdit=()=>{const M=single("mara",{nome:"Minha maratona",data:"",meta:""});const F=[{k:"nome",l:"Prova",ph:"Ex.: Maratona de Fortaleza"},{k:"data",l:"Data da prova",type:"date"},{k:"meta",l:"Meta de tempo",ph:"Ex.: 3h59"}];
  sheet(`<h2>Sua prova</h2>${F.map(f=>fieldHTML(f,M[f.k])).join("")}<div class="btns"><button class="btn full" id="mS">Salvar</button></div>`,s=>{s.querySelector("#mS").onclick=()=>{Object.assign(M,readFields(F,s));save(M);closeSheet();rr();};});};
const MPF=[{k:"sem",l:"Semana",type:"number",def:1},{k:"dia",l:"Dia",type:"select",opts:["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"],def:"Sáb"},{k:"tipo",l:"Treino",ph:"Ex.: Longão",auto:1},{k:"km",l:"Distância (km)",type:"number"},{k:"desc",l:"Como fazer",type:"textarea",ph:"Ritmo, intervalos, observações"}];
function mpForm(p){sheet(`<h2>${p?"Editar treino":"Novo treino"}</h2>${MPF.map(f=>fieldHTML(f,p?p[f.k]:null)).join("")}<div class="btns"><button class="btn full" id="pS">${p?"Salvar":"Adicionar treino"}</button>${p?`<button class="btn danger full" id="pX">Apagar treino</button>`:""}</div>`,s=>{
  s.querySelector("#pS").onclick=()=>{const o=readFields(MPF,s);if(!o.tipo)return toast("triangle-alert","Dê um nome ao treino","Ex.: Rodagem leve");o.sem=Math.max(1,Math.round(+o.sem||1));o.km=+o.km||0;const d=p||{id:"mp_"+nid(),c:"mp",o:"Seg Ter Qua Qui Sex Sáb Dom".split(" ").indexOf(o.dia)};Object.assign(d,o);d.o="Seg Ter Qua Qui Sex Sáb Dom".split(" ").indexOf(o.dia);save(d);closeSheet();rr();};
  const x=s.querySelector("#pX");if(x)x.onclick=()=>{removeDoc(p.id);closeSheet();rr();};});}
ACT.mpNew=()=>mpForm(null);ACT.mpEdit=el=>mpForm(getD(el.dataset.id));
ACT.mpT=el=>{const p=getD(el.dataset.id);p.feito=!p.feito;save(p);rr();if(p.feito)toast("medal","Treino concluído!",p.tipo+(p.km?" · "+p.km+" km":""));};
ACT.maraClear=()=>confirmSheet("Recomeçar a planilha?","Todos os treinos da planilha serão apagados.","Apagar planilha",()=>{all("mp").forEach(p=>removeDoc(p.id));rr();});
ACT.maraGen=()=>{const L=[12,14,16,13,18,20,22,18,24,26,28,22,30,24,16,0],E=[6,6,7,6,8,8,8,7,8,10,10,8,10,8,6,5],Q=[6,6,7,6,8,8,9,7,10,10,11,8,12,9,6,4];
  L.forEach((lg,i)=>{const w=i+1,add=(dia,tipo,km,desc)=>save({id:"mp_"+nid(),c:"mp",sem:w,dia,o:"Seg Ter Qua Qui Sex Sáb Dom".split(" ").indexOf(dia),tipo,km,desc,feito:false});
    add("Ter","Rodagem leve",E[i],"Ritmo confortável, dá para conversar.");
    add("Qui",w%2?"Intervalado":"Ritmo de prova",Q[i],w%2?"Aquecimento 2 km + tiros de 800 m com 2 min de trote + desaquecimento.":"Aquecimento 2 km + bloco no ritmo da maratona + desaquecimento.");
    add("Sáb","Regenerativo",Math.max(4,Math.round(E[i]*.7)),"Bem leve, só para soltar as pernas.");
    if(w<16)add("Dom","Longão",lg,"Ritmo leve e constante. Treine hidratação e gel.");else add("Dom","PROVA",42.195,"Dia da maratona! Largue controlado.");});
  rr();toast("sparkles","Plano de 16 semanas criado","Toque em cada treino para ajustar.");};

/* ================= HÁBITOS ================= */
function streakH(h){let d=TODAY();const D=h.dias||{};if(!D[d])d=addDays(d,-1);let n=0;while(D[d]){n++;d=addDays(d,-1);}return n;}
function pontos(){const g=sum(all("hab").map(h=>Object.keys(h.dias||{}).length*(+h.pts||10)));const s=sum(all("rec").map(r=>(r.resg||[]).length*(+r.custo||0)));return{g,s,saldo:g-s};}
VIEWS.habitos=()=>{const H=all("hab").sort((a,b)=>(a.o||0)-(b.o||0)),R=all("rec").sort((a,b)=>(a.custo||0)-(b.custo||0)),t=TODAY(),P=pontos();
  const days=[...Array(7)].map((_,i)=>addDays(t,i-6));const wk=sum(H.map(h=>days.filter(d=>h.dias&&h.dias[d]).length*(+h.pts||10)));
  let h=`<header class="top"><span class="mb">${ic("list-checks")}</span><h1>Hábitos</h1></header>
  <div class="hero"><div class="row"><div class="grow"><div class="muted small">Seus pontos para trocar</div><h2 style="font-size:2.4rem">${P.saldo} pts</h2><div class="muted small">+${wk} nesta semana · ${P.g} ganhos no total</div></div><span class="mb" style="width:56px;height:56px">${ic("trophy")}</span></div></div>`;
  if(!H.length)h+=`<div style="margin-top:14px">${empty("habitos","Crie seus hábitos","Cada check vale pontos. Junte pontos e troque por recompensas.")}</div><div class="grp">Sugestões rápidas</div><div class="wrap-row">${["Beber 2 L de água","Acordar às 5h30","Ler 10 páginas","Sem açúcar","Meditar 10 min","Dormir antes das 23h","Alongar 10 min"].map(s=>`<button class="chip m" style="padding:8px 12px" data-a="habSug" data-n="${esc(s)}">${ic("plus")} ${esc(s)}</button>`).join("")}</div>`;
  else{h+=`<div class="sec"><h2>Últimos 7 dias</h2></div><div class="card"><div class="hdays hhead2">${days.map(d=>`<div class="hd ${d===t?"td":""}">${DSEM[pd(d).getDay()]}<br>${+d.slice(8)}</div>`).join("")}</div>
    ${H.map(x=>`<div class="hrow"><button class="hn" data-a="habEdit" data-id="${x.id}">${esc(x.nome)} <small>${x.pts||10} pts${streakH(x)>1?" · "+streakH(x)+" dias seguidos":""}</small></button><div class="hdays">${days.map(d=>{const on=!!(x.dias&&x.dias[d]);return `<button class="hc ${on?"on":""}" data-a="habT" data-id="${x.id}" data-d="${d}" aria-label="${esc(x.nome)} em ${fdate(d)}">${ic("check")}</button>`;}).join("")}</div></div>`).join("")}</div>`;}
  h+=`<div class="sec"><h2>Recompensas</h2><button class="lk" data-a="recNew">${ic("plus")} Nova</button></div>`;
  h+=R.length?R.map(r=>{const p=clamp(P.saldo/(r.custo||1)*100,0,100),ok=P.saldo>=(r.custo||0);return `<div class="item rw"><span class="gift">${ic("gift")}</span><button class="ibody" data-a="recEdit" data-id="${r.id}"><b>${esc(r.nome)}</b><div class="meta"><span class="chip m">${r.custo} pts</span>${(r.resg||[]).length?`<span class="chip c">resgatada ${(r.resg||[]).length}x</span>`:""}</div><div class="bar"><i style="width:${p}%"></i></div></button><button class="btn sm" data-a="recGo" data-id="${r.id}" ${ok?"":"disabled"}>Resgatar</button></div>`;}).join("")
    :`<div class="wrap-row">${[["Pizza no fim de semana",100],["Comprar um livro novo",150],["Dia de folga total",300]].map(([n,c])=>`<button class="chip m" style="padding:8px 12px" data-a="recSug" data-n="${esc(n)}" data-c="${c}">${ic("plus")} ${esc(n)} · ${c} pts</button>`).join("")}</div>`;
  return `<div class="app">${h}</div>${fab("habNew","Novo hábito")}`;};
ACT.habT=el=>{const x=getD(el.dataset.id),d=el.dataset.d;x.dias=x.dias||{};if(x.dias[d])delete x.dias[d];else{x.dias[d]=1;toast("check","+"+(x.pts||10)+" pts",x.nome);}save(x);rr();};
ACT.habSug=el=>{save({id:"hab_"+nid(),c:"hab",nome:el.dataset.n,pts:10,o:Date.now(),dias:{}});rr();};
ACT.recSug=el=>{save({id:"rec_"+nid(),c:"rec",nome:el.dataset.n,custo:+el.dataset.c,resg:[]});rr();};
const HF=[{k:"nome",l:"Hábito",auto:1,ph:"Ex.: Beber 2 L de água"},{k:"pts",l:"Pontos por check",type:"number",def:10}];
function habForm(x){sheet(`<h2>${x?"Editar hábito":"Novo hábito"}</h2>${HF.map(f=>fieldHTML(f,x?x[f.k]:null)).join("")}${x?`<div class="note">${Object.keys(x.dias||{}).length} checks no total · sequência atual de ${streakH(x)} dias</div>`:""}
  <div class="btns"><button class="btn full" id="hS">${x?"Salvar":"Criar hábito"}</button>${x?`<button class="btn danger full" id="hX">Apagar hábito</button>`:""}</div>`,s=>{
  s.querySelector("#hS").onclick=()=>{const o=readFields(HF,s);if(!o.nome)return toast("triangle-alert","Dê um nome ao hábito","");o.pts=Math.max(1,Math.round(+o.pts||10));const d=x||{id:"hab_"+nid(),c:"hab",o:Date.now(),dias:{}};Object.assign(d,o);save(d);closeSheet();rr();};
  const xx=s.querySelector("#hX");if(xx)xx.onclick=()=>confirmSheet("Apagar este hábito?","Os pontos ganhos com ele também saem do saldo.","Apagar",()=>{removeDoc(x.id);rr();});});}
ACT.habNew=()=>habForm(null);ACT.habEdit=el=>habForm(getD(el.dataset.id));
const RF=[{k:"nome",l:"Recompensa",auto:1,ph:"Ex.: Jantar especial"},{k:"custo",l:"Custa quantos pontos",type:"number",def:100}];
function recForm(r){sheet(`<h2>${r?"Editar recompensa":"Nova recompensa"}</h2>${RF.map(f=>fieldHTML(f,r?r[f.k]:null)).join("")}
  <div class="btns"><button class="btn full" id="rS">${r?"Salvar":"Criar recompensa"}</button>${r&&(r.resg||[]).length?`<button class="btn ghost full" id="rU">Desfazer último resgate</button>`:""}${r?`<button class="btn danger full" id="rX">Apagar recompensa</button>`:""}</div>`,s=>{
  s.querySelector("#rS").onclick=()=>{const o=readFields(RF,s);if(!o.nome)return toast("triangle-alert","Dê um nome à recompensa","");o.custo=Math.max(1,Math.round(+o.custo||100));const d=r||{id:"rec_"+nid(),c:"rec",resg:[]};Object.assign(d,o);save(d);closeSheet();rr();};
  const u=s.querySelector("#rU");if(u)u.onclick=()=>{r.resg.pop();save(r);closeSheet();rr();};
  const x=s.querySelector("#rX");if(x)x.onclick=()=>{removeDoc(r.id);closeSheet();rr();};});}
ACT.recNew=()=>recForm(null);ACT.recEdit=el=>recForm(getD(el.dataset.id));
ACT.recGo=el=>{const r=getD(el.dataset.id);if(pontos().saldo<r.custo)return;r.resg=(r.resg||[]).concat(TODAY());save(r);rr();toast("party-popper","Recompensa liberada!","Aproveite: "+r.nome);};

/* ================= HIIT CAPOEIRA ================= */
VIEWS.hiit=()=>{const V=all("hiit").sort((a,b)=>a.n-b.n);let h=topbar("HIIT Capoeira","hiit");
  h+=`<div class="note">${ic("flame")} Um espaço para cada vídeo: anote os exercícios na ordem em que serão aplicados.</div>`;
  h+=V.length?V.map(v=>`<button class="vid" data-a="go" data-v="${gv({v:"hiitv",id:v.id})}"><span class="num"><small>VÍDEO</small><b>${v.n}</b></span><span class="grow"><b style="font-size:1.05rem">${esc(v.t||"Vídeo "+v.n)}</b><span class="small muted" style="display:block">${(v.ex||[]).length} ${(v.ex||[]).length===1?"exercício":"exercícios"}${v.link?" · com link":""}</span></span>${ic("chevron-right")}</button>`).join("")
    :empty("hiit","Nenhum vídeo ainda","Crie o Vídeo 1 e liste os exercícios.",`<button class="btn sm" data-a="hiitNew">${ic("plus")} Criar Vídeo 1</button>`);
  return `<div class="app">${h}</div>${fab("hiitNew","Novo vídeo")}`;};
ACT.hiitNew=()=>{const n=Math.max(0,...all("hiit").map(v=>v.n))+1;const d=save({id:"hiit_"+nid(),c:"hiit",n,t:"",link:"",ex:[]});go({v:"hiitv",id:d.id});};
VIEWS.hiitv=()=>{const v=getD(VIEW.id);if(!v){VIEW={v:"hiit"};return VIEWS.hiit();}const ex=v.ex||[];
  let h=topbar("VÍDEO "+v.n,"hiit",`<button class="ib" data-a="hiitEdit" aria-label="Editar vídeo">${ic("pencil")}</button>`);
  h+=`<div class="hero"><div class="row"><span class="num" style="width:70px;height:70px;border-radius:20px;background:var(--c1);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1"><small style="font-size:.6rem;font-weight:800">VÍDEO</small><b style="font:800 2rem var(--disp)">${v.n}</b></span><div class="grow"><h2>${esc(v.t||"Vídeo "+v.n)}</h2><div class="muted small">${ex.length} exercícios</div></div></div>${v.link?`<a class="btn sm" style="margin-top:12px" href="${esc(v.link)}" target="_blank" rel="noopener">${ic("play")} Abrir vídeo</a>`:""}</div>`;
  h+=`<div class="sec"><h2>Exercícios</h2></div>`;
  h+=ex.length?ex.map((e,i)=>`<div class="ex"><span class="n">${i+1}</span><button class="grow" style="text-align:left" data-a="exEdit" data-i="${i}"><b>${esc(e.t)}</b>${e.dur||e.obs?`<span class="small muted" style="display:block">${esc([e.dur,e.obs].filter(Boolean).join(" · "))}</span>`:""}</button><span class="mv"><button data-a="exMv" data-i="${i}" data-d="-1" aria-label="Subir" ${i?"":"disabled"}>${ic("chevron-up")}</button><button data-a="exMv" data-i="${i}" data-d="1" aria-label="Descer" ${i<ex.length-1?"":"disabled"}>${ic("chevron-down")}</button></span></div>`).join("")
    :`<div class="note">Nenhum exercício ainda. Digite abaixo e toque em + (ou Enter).</div>`;
  h+=`<div class="qadd" style="margin-top:12px"><input id="exN" placeholder="Exercício, ex.: Ginga + meia-lua de frente" data-enter="exAdd"><input id="exD" style="flex:0 0 96px" placeholder="40 s" data-enter="exAdd" aria-label="Duração ou repetições"><button class="btn" data-a="exAdd" aria-label="Adicionar exercício">${ic("plus")}</button></div>`;
  return `<div class="app">${h}</div>`;};
ACT.exAdd=()=>{const v=getD(VIEW.id),n=$("exN"),d=$("exD");const t=n.value.trim();if(!t)return n.focus();v.ex=(v.ex||[]).concat({t,dur:d.value.trim(),obs:""});save(v);rr();$("exN").focus();};
ACT.exMv=el=>{const v=getD(VIEW.id),i=+el.dataset.i,j=i+ +el.dataset.d;if(j<0||j>=v.ex.length)return;[v.ex[i],v.ex[j]]=[v.ex[j],v.ex[i]];save(v);rr();};
ACT.exEdit=el=>{const v=getD(VIEW.id),i=+el.dataset.i,e=v.ex[i];const F=[{k:"t",l:"Exercício"},{k:"dur",l:"Tempo ou repetições",ph:"Ex.: 40 s ou 15x"},{k:"obs",l:"Observação",type:"textarea"}];
  sheet(`<h2>Exercício ${i+1}</h2>${F.map(f=>fieldHTML(f,e[f.k])).join("")}<div class="btns"><button class="btn full" id="eS">Salvar</button><button class="btn danger full" id="eX">Remover exercício</button></div>`,s=>{
    s.querySelector("#eS").onclick=()=>{Object.assign(e,readFields(F,s));save(v);closeSheet();rr();};s.querySelector("#eX").onclick=()=>{v.ex.splice(i,1);save(v);closeSheet();rr();};});};
ACT.hiitEdit=()=>{const v=getD(VIEW.id);const F=[{k:"n",l:"Número do vídeo",type:"number"},{k:"t",l:"Título (opcional)",ph:"Ex.: Pernas e esquivas"},{k:"link",l:"Link do vídeo",ph:"https://…"}];
  sheet(`<h2>Vídeo ${v.n}</h2>${F.map(f=>fieldHTML(f,v[f.k])).join("")}<div class="btns"><button class="btn full" id="vS">Salvar</button><button class="btn danger full" id="vX">Apagar vídeo</button></div>`,s=>{
    s.querySelector("#vS").onclick=()=>{const o=readFields(F,s);o.n=Math.max(1,Math.round(+o.n||v.n));if(o.link&&!/^https?:\/\//i.test(o.link))o.link="https://"+o.link;Object.assign(v,o);save(v);closeSheet();rr();};
    s.querySelector("#vX").onclick=()=>confirmSheet("Apagar o Vídeo "+v.n+"?","Os exercícios dele também serão apagados.","Apagar vídeo",()=>{removeDoc(v.id);back();});});};

/* ================= EDITAIS DA CULTURA ================= */
const EST=[["c","Contemplado","#15803D"],["a","No aguardo do resultado","#B45309"],["n","Não contemplado","#B91C1C"]];
const estOf=k=>EST.find(e=>e[0]===k)||EST[1];
const ST_ORD={c:0,a:1,n:2};
const edAno=e=>String(e.ano||"2026");
const ganhoP=p=>p.st==="c"?(+p.val||0)*(+p.pct||0)/100:0;
const aprov=e=>(e.pess||[]).filter(p=>p.st==="c").length;
const ganhoE=e=>sum((e.pess||[]).map(ganhoP));
const recP=p=>p.st==="c"?Math.min(+p.rec||0,ganhoP(p)||+p.rec||0):0;
const recE=e=>sum((e.pess||[]).map(recP));
const faltaE=e=>Math.max(0,ganhoE(e)-recE(e));
const pctTxt=v=>(+v||0).toLocaleString("pt-BR",{maximumFractionDigits:2})+"%";
function anosEd(){const s=new Set(["2026","2027"]);all("ed").forEach(e=>s.add(edAno(e)));(single("yrs_ed",{l:[]}).l||[]).forEach(y=>s.add(String(y)));return[...s].sort();}
function edsDoAno(y){return all("ed").filter(e=>edAno(e)===y).sort((a,b)=>(a.o||0)-(b.o||0));}
/* tela 1: anos */
function edAnosView(){const Y=anosEd();const allE=all("ed");const tA=sum(allE.map(aprov)),tG=sum(allE.map(ganhoE));
  let h=topbar("Editais da cultura","editais");
  h+=`<div class="hero"><div class="muted small">Todas as aprovações</div><div class="row" style="align-items:flex-end;gap:18px;flex-wrap:wrap"><div><h2 style="font-size:2.2rem">${tA}</h2><div class="small muted">${tA===1?"edital aprovado":"editais aprovados"}</div></div>${tG?`<div><h2 style="font-size:1.6rem">${money(tG)}</h2><div class="small muted">ganho total</div></div><div><h2 style="font-size:1.6rem;color:var(--ok)">${money(sum(allE.map(recE)))}</h2><div class="small muted">já recebido</div></div><div><h2 style="font-size:1.6rem;color:var(--wait)">${money(sum(allE.map(faltaE)))}</h2><div class="small muted">falta receber</div></div>`:""}</div></div>`;
  h+=`<div class="sec"><h2>Anos</h2><button class="lk" data-a="edAnoNovo">${ic("plus")} Ano</button></div><div class="albums">${Y.map(y=>{const E=edsDoAno(y),a=sum(E.map(aprov)),g=sum(E.map(ganhoE));
    return `<button class="alb" data-a="go" data-v="${gv({v:"editais",ano:y})}"><div class="cv" style="flex-direction:column;gap:4px"><b style="font:800 2rem var(--disp);margin:0;color:var(--deep)">${y}</b><span style="color:var(--deep)">${ic("folder")}</span></div><b>Editais ${y}</b><span>${E.length} ${E.length===1?"edital":"editais"} · ${a} ${a===1?"aprovado":"aprovados"}${g?" · "+money(g):""}${sum(E.map(faltaE))?" · falta "+money(sum(E.map(faltaE))):""}</span></button>`;}).join("")}</div>`;
  return `<div class="app">${h}</div>`;}
ACT.edAnoNovo=()=>textEditOne("Novo ano","Ano","Ex.: 2028",v=>{const n=parseInt(v,10);if(!(n>1900&&n<2200))return toast("triangle-alert","Digite um ano válido","Ex.: 2028");const d=single("yrs_ed",{l:[]});if(!d.l.includes(n))d.l.push(n);save(d);rr();});
/* tela 2: quadro do ano */
VIEWS.editais=()=>{if(!VIEW.ano)return edAnosView();const y=VIEW.ano,E=edsDoAno(y);const ci=Math.min(VIEW.ci||0,E.length);
  const tA=sum(E.map(aprov)),tG=sum(E.map(ganhoE));
  let h=topbar("Editais "+y,"editais");
  h+=`<div class="edsum"><div class="hero" style="padding:14px 18px"><div class="edst"><div><div class="muted small">Aprovados em ${y}</div><h2>${tA}</h2></div><div><div class="muted small">Ganho total em ${y}</div><h2>${money(tG)}</h2></div><div><div class="muted small">Já recebido</div><h2 style="color:var(--ok)">${money(sum(E.map(recE)))}</h2></div><div><div class="muted small">Falta receber</div><h2 style="color:var(--wait)">${money(sum(E.map(faltaE)))}</h2></div></div></div>
   <div class="note" style="margin:0">${ic("arrow-right-left")} Segure o título de um edital para mudar a ordem. Toque numa pessoa aprovada para informar o valor e a sua porcentagem.</div></div>`;
  h+=`<div class="board" id="board">${E.map(e=>{const P=(e.pess||[]).map((p,i)=>({p,i})).sort((a,b)=>(ST_ORD[a.p.st]??1)-(ST_ORD[b.p.st]??1)||a.i-b.i);const g=ganhoE(e);
    return `<section class="col" data-id="${e.id}" aria-label="${esc(e.nome)}"><div class="colh"><span class="grip" aria-hidden="true">${ic("grip-vertical")}</span><div class="grow"><h3>${esc(e.nome)}</h3>${e.info?`<div class="small muted">${esc(e.info)}</div>`:""}</div><button class="ib" data-a="edMenu" data-id="${e.id}" aria-label="Opções do edital">${ic("ellipsis-vertical")}</button></div>
     <div class="wrap-row"><span class="chip c">${ic("trophy")} Aprovados: ${aprov(e)}</span>${g?`<span class="chip c">${money(g)}</span>`:""}${faltaE(e)?`<span class="chip a">falta ${money(faltaE(e))}</span>`:g?`<span class="chip c">${ic("check")} tudo recebido</span>`:""}${edNotasCount(e.id)?`<button class="chip m" data-a="ednOpen" data-ed="${e.id}">${ic("notebook-pen")} ${edNotasCount(e.id)}</button>`:""}</div>
     ${P.map(({p,i})=>{const s=estOf(p.st);const gp=ganhoP(p);return `<button class="pp ${s[0]}" data-a="ppOpen" data-id="${e.id}" data-i="${i}"><span class="grow"><span style="display:block">${esc(p.n)}</span>${s[0]==="c"?`<small class="ppv">${p.val?`${money(p.val)} × ${pctTxt(p.pct)} = <b>${money(gp)}</b>`:"Toque para informar valor e %"}</small>${gp?`<small class="ppr ${recP(p)>=gp?"ok":""}">${recP(p)>=gp?"✓ Recebido":recP(p)>0?`Recebido ${money(recP(p))} · falta ${money(gp-recP(p))}`:`A receber ${money(gp)}`}</small>`:""}`:""}</span><span class="chip ${s[0]}">${s[0]==="c"?"1. Contemplado":s[0]==="a"?"2. Aguardando":"3. Não"}</span></button>`;}).join("")}
     <div class="qadd" style="margin:4px 0 0"><input id="pa_${e.id}" placeholder="Adicionar pessoa" data-enter="ppAdd" data-id="${e.id}" aria-label="Nome da pessoa"><button class="btn sm" data-a="ppAdd" data-id="${e.id}" aria-label="Adicionar pessoa">${ic("plus")}</button></div></section>`;}).join("")}
   <button class="col new" data-a="edNew"><span class="mb">${ic("plus")}</span>Novo edital em ${y}</button></div>
   <div class="dotsnav" id="bdots">${E.map((_,i)=>`<i class="${i===ci?"on":""}"></i>`).join("")}<i class="${ci===E.length?"on":""}"></i></div>`;
  after(()=>{const b=$("board");if(!b)return;const cols=qa(".col",b);b.addEventListener("scroll",()=>{const x=b.scrollLeft+b.clientWidth/2;let best=0,bd=1e9;cols.forEach((c,i)=>{const m=c.offsetLeft+c.offsetWidth/2;const dd=Math.abs(m-x);if(dd<bd){bd=dd;best=i;}});VIEW.ci=best;qa("#bdots i").forEach((d,i)=>d.classList.toggle("on",i===best));},{passive:true});enableBoardSort(b);});
  const nn=edNotas(y).filter(n=>!n.feito).length;
  return `<div class="app wide">${h}</div><button class="ednbar" data-a="ednOpen">${ic("notebook-pen")} Notas dos editais${nn?`<span class="ednct">${nn}</span>`:""}<span class="tiny" style="margin-left:auto;opacity:.75">pendências, prestação de contas…</span></button>`;};
ACT.edNew=()=>edForm(null);
function edForm(e){const F=[{k:"nome",l:"Nome do edital",auto:1,ph:"Ex.: Lei Paulo Gustavo 2026"},{k:"info",l:"Informação curta",ph:"Ex.: Resultado sai em março"}];
  sheet(`<h2>${e?"Editar edital":"Novo edital"}</h2>${F.map(f=>fieldHTML(f,e?e[f.k]:null)).join("")}<div class="btns"><button class="btn full" id="eS">${e?"Salvar":"Criar edital"}</button></div>`,s=>{
   s.querySelector("#eS").onclick=()=>{const o=readFields(F,s);if(!o.nome)return toast("triangle-alert","Dê um nome ao edital","");const d=e||{id:"ed_"+nid(),c:"ed",o:Date.now(),ano:VIEW.ano||"2026",pess:[]};Object.assign(d,o);save(d);closeSheet();
     if(!e){const n=edsDoAno(d.ano).length-1;VIEW.ci=n;rr();const b=$("board");if(b){const c=qa(".col",b)[n];if(c)b.scrollLeft=c.offsetLeft-16;}}else rr();};});}
ACT.edMenu=el=>{const e=getD(el.dataset.id);const E=edsDoAno(edAno(e)),i=E.indexOf(e);
  sheet(`<h2>${esc(e.nome)}</h2><div class="btns"><button class="btn ghost full" id="m1">${ic("pencil")} Renomear</button>${i>0?`<button class="btn ghost full" id="m2">${ic("chevron-left")} Mover para a esquerda</button>`:""}${i<E.length-1?`<button class="btn ghost full" id="m3">${ic("chevron-right")} Mover para a direita</button>`:""}<button class="btn ghost full" id="m5">${ic("folder-input")} Mover para outro ano</button><button class="btn danger full" id="m4">${ic("trash-2")} Apagar edital</button></div>`,s=>{
   s.querySelector("#m1").onclick=()=>edForm(e);
   const sw=j=>{const o=E[j];const t=e.o||0;e.o=o.o||0;o.o=t;if(e.o===o.o)e.o+=j<i?-1:1;save(e);save(o);closeSheet();VIEW.ci=j;rr();const b=$("board");const c=b&&qa(".col",b)[j];if(c)b.scrollLeft=c.offsetLeft-16;};
   const a=s.querySelector("#m2");if(a)a.onclick=()=>sw(i-1);const b=s.querySelector("#m3");if(b)b.onclick=()=>sw(i+1);
   s.querySelector("#m5").onclick=()=>sheet(`<h2>Mover para qual ano?</h2><div class="btns">${anosEd().map(y=>`<button class="btn ghost full" ${y===edAno(e)?"disabled":`data-a="edAnoTo" data-id="${e.id}" data-y="${y}"`}>${ic("folder")} ${y}${y===edAno(e)?" (atual)":""}</button>`).join("")}</div>`);
   s.querySelector("#m4").onclick=()=>confirmSheet("Apagar este edital?",e.nome+" e todas as pessoas dele.","Apagar edital",()=>{removeDoc(e.id);rr();});});};
ACT.edAnoTo=el=>{const e=getD(el.dataset.id);e.ano=el.dataset.y;e.o=Date.now();save(e);closeSheet();rr();toast("folder-input","Edital movido para "+e.ano,e.nome);};
ACT.ppAdd=el=>{const e=getD(el.dataset.id),inp=$("pa_"+e.id);const names=inp.value.split(/[\n;]+/).map(x=>x.trim()).filter(Boolean);if(!names.length)return inp.focus();
  e.pess=(e.pess||[]).concat(names.map(n=>({id:nid(),n,st:"a"})));save(e);rr();const n=$("pa_"+e.id);if(n)n.focus();};
ACT.ppOpen=el=>ppSheet(el.dataset.id,+el.dataset.i);
function ppSheet(eid,i){const e=getD(eid),p=e.pess[i];
  sheet(`<h2>${esc(p.n)}</h2><div class="muted small" style="margin-bottom:12px">${esc(e.nome)}</div><div class="btns" style="margin-top:0">${EST.map((s,j)=>`<button class="stbtn" data-a="ppSt" data-id="${e.id}" data-i="${i}" data-st="${s[0]}" aria-pressed="${p.st===s[0]}"><span class="n" style="background:${s[2]}">${j+1}</span>${s[1]}</button>`).join("")}</div>
   ${p.st==="c"?`<div class="card" style="margin-top:14px;background:var(--okbg);border-color:transparent"><b>${ic("coins")} Quanto você ganha neste edital</b>
     <div class="two"><label class="fld"><span>Valor do edital (R$)</span><input id="ppV" inputmode="decimal" placeholder="Ex.: 10.000,00" value="${p.val?String(p.val).replace(".",","):""}" data-in="ppCalc"></label>
     <label class="fld"><span>Sua porcentagem (%)</span><input id="ppP" inputmode="decimal" placeholder="Ex.: 10" value="${p.pct?String(p.pct).replace(".",","):""}" data-in="ppCalc"></label></div>
     <div style="margin-top:10px">Seu ganho: <b id="ppG" style="font:800 1.3rem var(--disp)">${money(ganhoP(p))}</b></div>
     <div class="two"><label class="fld"><span>Quanto já recebi (R$)</span><input id="ppR" inputmode="decimal" placeholder="0,00" value="${p.rec?String(p.rec).replace(".",","):""}" data-in="ppCalc"></label><div class="fld"><span>&nbsp;</span><button type="button" class="btn ghost full" data-a="ppRecAll">${ic("check")} Recebi tudo</button></div></div>
     <div style="margin-top:6px">Falta receber: <b id="ppF" style="color:var(--waittx)">${money(Math.max(0,ganhoP(p)-(+p.rec||0)))}</b></div><label class="fld"><span>Previsão de pagamento (vai para Contas a receber)</span><input id="ppPrev" type="date" value="${esc(p.prev||"")}"></label></div>`:""}
   <label class="fld"><span>Nome</span><input id="ppN" value="${esc(p.n)}"></label><div class="btns h"><button class="btn" id="ppS">Salvar</button><button class="btn danger" id="ppX">Remover</button></div>`,s=>{
   s.querySelector("#ppS").onclick=()=>{const v=s.querySelector("#ppN").value.trim();if(v)p.n=v;const V=s.querySelector("#ppV"),Pc=s.querySelector("#ppP");if(V){p.val=num(V.value);p.pct=num(Pc.value);const R=s.querySelector("#ppR");p.rec=R?num(R.value):0;const PV=s.querySelector("#ppPrev");if(PV)p.prev=PV.value;}save(e);closeSheet();rr();if(V&&p.val)toast("coins","Ganho salvo",money(ganhoP(p))+" · "+e.nome);};
   s.querySelector("#ppX").onclick=()=>{e.pess.splice(i,1);save(e);closeSheet();rr();};});}
CH.ppCalc=()=>{const V=$("ppV"),P=$("ppP"),G=$("ppG"),R=$("ppR"),F=$("ppF");const g=num(V.value)*num(P.value)/100;if(G)G.textContent=money(g);if(F)F.textContent=money(Math.max(0,g-(R?num(R.value):0)));};
ACT.ppRecAll=()=>{const V=$("ppV"),P=$("ppP"),R=$("ppR");if(R){R.value=String(Math.round(num(V.value)*num(P.value))/100).replace(".",",");CH.ppCalc();}};
ACT.ppSt=el=>{const e=getD(el.dataset.id),i=+el.dataset.i,p=e.pess[i];p.st=el.dataset.st;save(e);rr();
  if(p.st==="c"){toast("party-popper","Contemplado!",p.n+" · "+e.nome);ppSheet(e.id,i);}else closeSheet();};

/* ================= AUDIOBOOKS ================= */
function ouvCard(a){const t=TODAY(),on=!!(a.log&&a.log[t]);return `<div class="item"><span class="mb">${ic("headphones")}</span><div class="ibody"><button style="text-align:left;display:block;width:100%" data-a="ouvEdit" data-id="${a.id}"><b>${esc(a.t)}</b><div class="meta">${a.autor?`<span class="chip">${esc(a.autor)}</span>`:""}<span class="chip m">${a.prog||0}%</span>${a.lemb&&a.hora&&!a.fim?`<span class="chip">${ic("bell")} ${esc(a.hora)}</span>`:""}${a.fim?`<span class="chip c">Finalizado</span>`:""}</div><div class="bar"><i style="width:${a.prog||0}%"></i></div></button>
  ${a.fim?"":`<div class="wrap-row" style="margin-top:10px"><button class="btn sm ${on?"ghost":""}" data-a="ouvHoje" data-id="${a.id}">${ic(on?"check":"headphones")} ${on?"Ouvi hoje":"Marcar que ouvi hoje"}</button><button class="btn ghost sm" data-a="ouvMais" data-id="${a.id}">+10%</button></div>`}</div></div>`;}
VIEWS.audio=()=>{let h=topbar("Audiobooks que estou ouvindo","audio");
  const A=all("ouv"),at=A.filter(a=>!a.fim).sort((a,b)=>(b.u||0)-(a.u||0)),fi=A.filter(a=>a.fim).sort((a,b)=>(b.u||0)-(a.u||0));
  if(!notifOK()&&at.some(a=>a.lemb))h+=`<div class="note row">${ic("bell")}<span class="grow">Ative as notificações para receber os lembretes de ouvir.</span><button class="btn sm" data-a="notif">Ativar</button></div>`;
  h+=at.length?at.map(ouvCard).join(""):empty("audio","Qual audiobook você está ouvindo?","Adicione e o app lembra você todo dia, no horário escolhido, até terminar.");
  if(fi.length)h+=`<div class="grp">Finalizados<span class="chip">${fi.length}</span></div>`+fi.map(ouvCard).join("");
  return `<div class="app">${h}</div>${fab("ouvNew","Novo audiobook")}`;};
const OF=[{k:"t",l:"Audiobook",auto:1},{k:"autor",l:"Autor(a)"},{k:"prog",l:"Progresso",type:"pct"},{k:"lemb",l:"Lembrar todo dia",type:"check"},{k:"hora",l:"Horário do lembrete",type:"time",def:"21:00"}];
function ouvForm(a){sheet(`<h2>${a?"Editar audiobook":"Novo audiobook"}</h2>${OF.map(f=>fieldHTML(f,a?a[f.k]:(f.k==="lemb"?true:null))).join("")}<div class="note">O lembrete toca enquanto o app estiver aberto ou em segundo plano. Para um alarme garantido com o celular bloqueado, use o botão do Google Agenda.</div>
  <div class="btns"><button class="btn full" id="aS">${a?"Salvar":"Adicionar"}</button><button class="btn ghost full" id="aG">${ic("calendar")} Criar lembrete diário no Google Agenda</button>${a?`<button class="btn danger full" id="aX">Apagar</button>`:""}</div>`,s=>{
  s.querySelector("#aS").onclick=()=>{const o=readFields(OF,s);if(!o.t)return toast("triangle-alert","Digite o nome do audiobook","");o.fim=o.prog>=100;const d=a||{id:"ouv_"+nid(),c:"ouv",log:{}};Object.assign(d,o);save(d);closeSheet();rr();if(o.lemb&&!notifOK())enableNotif();};
  s.querySelector("#aG").onclick=()=>{const t=s.querySelector("#f_t").value.trim()||"audiobook";window.open(gcalURL("Ouvir audiobook: "+t,TODAY(),s.querySelector("#f_hora").value||"21:00","d","Lembrete do Moving Up"),"_blank","noopener");};
  const x=s.querySelector("#aX");if(x)x.onclick=()=>{removeDoc(a.id);closeSheet();rr();};});}
ACT.ouvNew=()=>ouvForm(null);ACT.ouvEdit=el=>ouvForm(getD(el.dataset.id));
ACT.ouvHoje=el=>{const a=getD(el.dataset.id),t=TODAY();a.log=a.log||{};if(a.log[t])delete a.log[t];else{a.log[t]=1;toast("headphones","Boa! Mais um pouco ouvido",a.t);}save(a);rr();};
ACT.ouvMais=el=>{const a=getD(el.dataset.id);a.prog=clamp((a.prog||0)+10,0,100);a.log=a.log||{};a.log[TODAY()]=1;if(a.prog>=100){a.fim=true;toast("party-popper","Audiobook finalizado!",a.t);}save(a);rr();};

/* ================= RITUAL DE MANIFESTAÇÃO ================= */
const MANIF_DEF={intencao:"",afirm:["Eu sou disciplinado e constante.","Cada dia eu subo um degrau.","Eu mereço e recebo prosperidade."],
  passos:[{id:"p1",t:"Gratidão: escreva 3 coisas pelas quais você é grato"},{id:"p2",t:"Visualize por 5 minutos o resultado já realizado"},{id:"p3",t:"Leia as afirmações em voz alta"},{id:"p4",t:"Escreva sua intenção do dia"},{id:"p5",t:"Faça uma ação alinhada ao que você quer"}]};
VIEWS.manif=()=>{const M=single("manif",MANIF_DEF),t=TODAY(),D=single("ms_"+t,{c:"msp",d:t,p:[]});const done=D.p.filter(id=>M.passos.some(p=>p.id===id)).length,tot=M.passos.length;
  const [y,m]=ym();let h=topbar("Ritual de manifestação","man");
  h+=`<div class="hero"><div class="muted small">Minha intenção</div><h2 style="font-size:1.3rem;line-height:1.3;margin-top:4px">${M.intencao?esc(M.intencao):"Toque no lápis e escreva o que você está manifestando."}</h2><button class="btn ghost sm" style="margin-top:12px" data-a="manInt">${ic("pencil")} Editar intenção</button></div>`;
  h+=`<div class="sec"><h2>Ritual de hoje</h2><span class="chip ${done===tot&&tot?"c":"m"}" style="margin-left:auto">${done}/${tot}</span></div>`;
  h+=M.passos.map((p,i)=>{const on=D.p.includes(p.id);return `<div class="item"><button class="ck ${on?"on":""}" data-a="manStep" data-id="${p.id}" aria-label="Concluir passo">${ic("check")}</button><button class="ibody" data-a="manStepEdit" data-i="${i}"><b class="${on?"strike":""}">${esc(p.t)}</b></button></div>`;}).join("");
  h+=`<div class="row" style="justify-content:flex-end"><button class="lnk small" data-a="manStepNew">${ic("plus")} Adicionar passo</button></div>`;
  h+=`<div class="sec"><h2>Afirmações</h2><button class="lk" data-a="manAf">${ic("plus")} Nova</button></div>`+M.afirm.map((a,i)=>`<div class="item"><span class="mb" style="width:34px;height:34px;border-radius:11px">${ic("sparkles")}</span><button class="ibody" data-a="manAfEdit" data-i="${i}"><b style="font:700 1.05rem/1.35 var(--disp)">${esc(a)}</b></button></div>`).join("");
  h+=`<div class="sec"><h2>Dias com ritual completo</h2><span class="chip m" style="margin-left:auto">${ic("flame")} ${streakK("man")} seguidos</span></div>`+calNav(y,m,"mNav")+monthGrid(y,m,(d,n)=>`<div class="day ${trkHas("man",d)?"done":""} ${d===t?"td":""}">${n}</div>`);
  return `<div class="app">${h}</div>`;};
ACT.manStep=el=>{const M=single("manif",MANIF_DEF),t=TODAY(),D=single("ms_"+t,{c:"msp",d:t,p:[]});const id=el.dataset.id;D.p=D.p.includes(id)?D.p.filter(x=>x!==id):D.p.concat(id);save(D);
  const all5=M.passos.every(p=>D.p.includes(p.id));const has=trkHas("man",t);if(all5&&!has){save({id:tid("man",t),c:"trk",k:"man",d:t});toast("sparkles","Ritual completo!","Você está alinhado com o que quer.");}if(!all5&&has)removeDoc(tid("man",t));rr();};
ACT.manInt=()=>{const M=single("manif",MANIF_DEF);sheet(`<h2>Minha intenção</h2><label class="fld"><span>O que você está manifestando, no presente</span><textarea id="mi" placeholder="Ex.: Eu completo minha maratona forte e feliz.">${esc(M.intencao)}</textarea></label><div class="btns"><button class="btn full" id="mS">Salvar intenção</button></div>`,s=>{s.querySelector("#mS").onclick=()=>{M.intencao=s.querySelector("#mi").value.trim();save(M);closeSheet();rr();};});};
function textEdit(title,val,onSave,onDel){sheet(`<h2>${esc(title)}</h2><label class="fld"><span>Texto</span><textarea id="te">${esc(val||"")}</textarea></label><div class="btns"><button class="btn full" id="tS">Salvar</button>${onDel?`<button class="btn danger full" id="tX">Apagar</button>`:""}</div>`,s=>{
  s.querySelector("#tS").onclick=()=>{const v=s.querySelector("#te").value.trim();if(v)onSave(v);closeSheet();rr();};const x=s.querySelector("#tX");if(x)x.onclick=()=>{onDel();closeSheet();rr();};});}
ACT.manAf=()=>{const M=single("manif",MANIF_DEF);textEdit("Nova afirmação","",v=>{M.afirm.push(v);save(M);});};
ACT.manAfEdit=el=>{const M=single("manif",MANIF_DEF),i=+el.dataset.i;textEdit("Afirmação",M.afirm[i],v=>{M.afirm[i]=v;save(M);},()=>{M.afirm.splice(i,1);save(M);});};
ACT.manStepNew=()=>{const M=single("manif",MANIF_DEF);textEdit("Novo passo do ritual","",v=>{M.passos.push({id:"p"+nid(),t:v});save(M);});};
ACT.manStepEdit=el=>{const M=single("manif",MANIF_DEF),i=+el.dataset.i;textEdit("Passo do ritual",M.passos[i].t,v=>{M.passos[i].t=v;save(M);},()=>{M.passos.splice(i,1);save(M);});};

/* ================= LEMBRETES ================= */
const REP=[["","Não repete"],["d","Todo dia"],["w","Toda semana"],["m","Todo mês"],["y","Todo ano"]];
const dtOf=(d,h)=>{const x=pd(d);const[a,b]=(h||"09:00").split(":").map(Number);x.setHours(a,b,0,0);return x;};
function stepOcc(dt,rep,n){const x=new Date(dt);if(rep==="d")x.setDate(x.getDate()+n);else if(rep==="w")x.setDate(x.getDate()+7*n);else if(rep==="m")x.setMonth(x.getMonth()+n);else if(rep==="y")x.setFullYear(x.getFullYear()+n);return x;}
function lastOcc(r,now){const b=dtOf(r.d,r.h);if(b>now)return null;if(!r.rep)return b;let n=0;if(r.rep==="d")n=Math.floor((now-b)/864e5);else if(r.rep==="w")n=Math.floor((now-b)/(7*864e5));
  let x=stepOcc(b,r.rep,n);while(stepOcc(b,r.rep,n+1)<=now){n++;x=stepOcc(b,r.rep,n);}while(x>now&&n>0){n--;x=stepOcc(b,r.rep,n);}return x;}
function nextOcc(r,now){const b=dtOf(r.d,r.h);if(b>now||!r.rep)return b;const l=lastOcc(r,now);let n=1,x=stepOcc(l,r.rep,1);return x;}
function upcomingRems(){const now=new Date();return all("rem").filter(r=>!r.feito).map(r=>({r,w:nextOcc(r,now)})).sort((a,b)=>a.w-b.w).map(x=>x.r);}
function whenTxt(w){const d=iso(w);return flong(d)+" às "+pad(w.getHours())+":"+pad(w.getMinutes());}
function remCard(r){const now=new Date(),w=nextOcc(r,now),late=!r.rep&&w<=now&&!r.feito;
  return `<div class="item"><button class="ck ${r.feito?"on":""}" data-a="remDone" data-id="${r.id}" aria-label="Concluir lembrete">${ic("check")}</button><button class="ibody" data-a="remEdit" data-id="${r.id}"><b class="${r.feito?"strike":""}">${esc(r.t)}</b><div class="meta"><span class="chip ${late?"n":"m"}">${ic(late?"circle-alert":"clock")} ${esc(whenTxt(w))}</span>${r.rep?`<span class="chip">${ic("refresh-cw")} ${esc(REP.find(x=>x[0]===r.rep)[1])}</span>`:""}</div>${r.nota?`<p>${esc(r.nota)}</p>`:""}</button></div>`;}
VIEWS.lemb=()=>{const now=new Date(),A=all("rem");const late=A.filter(r=>!r.feito&&!r.rep&&dtOf(r.d,r.h)<=now).sort((a,b)=>dtOf(a.d,a.h)-dtOf(b.d,b.h));
  const up=A.filter(r=>!r.feito&&!late.includes(r)).sort((a,b)=>nextOcc(a,now)-nextOcc(b,now)),fe=A.filter(r=>r.feito).sort((a,b)=>(b.u||0)-(a.u||0)).slice(0,20);
  let h=`<header class="top"><span class="mb">${ic("alarm-clock")}</span><h1>Lembretes</h1></header>`;
  if(!notifOK())h+=`<div class="note row">${ic("bell")}<span class="grow">Ative as notificações para o celular avisar na hora certa.</span><button class="btn sm" data-a="notif">Ativar</button></div>`;
  h+=`<div class="qadd"><input id="rq" placeholder="Ex.: Cortar o cabelo" data-enter="remQuick" aria-label="Novo lembrete"><button class="btn" data-a="remQuick" aria-label="Criar lembrete">${ic("plus")}</button></div>`;
  if(!A.length)h+=empty("lemb","Nada para lembrar ainda","Escreva algo como “cortar o cabelo”, escolha o dia e a hora, e o app avisa você.");
  if(late.length)h+=`<div class="grp">Atrasados<span class="chip n">${late.length}</span></div>`+late.map(remCard).join("");
  if(up.length)h+=`<div class="grp">Próximos<span class="chip">${up.length}</span></div>`+up.map(remCard).join("");
  if(fe.length)h+=`<div class="grp">Concluídos</div>`+fe.map(remCard).join("");
  return `<div class="app">${h}</div>${fab("remNew","Novo lembrete")}`;};
const RMF=[{k:"t",l:"Lembrar de",auto:1,ph:"Ex.: Cortar o cabelo"},{k:"d",l:"Dia",type:"date",def:TODAY},{k:"h",l:"Hora",type:"time",def:()=>pad(Math.min(23,new Date().getHours()+1))+":00"},{k:"rep",l:"Repetir",type:"select",opts:REP,def:""},{k:"nota",l:"Detalhes",type:"textarea"}];
function remForm(r,pre){sheet(`<h2>${r?"Editar lembrete":"Novo lembrete"}</h2>${RMF.map(f=>fieldHTML(f,r?r[f.k]:(pre&&pre[f.k]!=null?pre[f.k]:null))).join("")}
  <div class="btns"><button class="btn full" id="rS">${r?"Salvar":"Criar lembrete"}</button><button class="btn ghost full" id="rG">${ic("calendar")} Também pôr no Google Agenda</button>${r?`<button class="btn danger full" id="rX">Apagar lembrete</button>`:""}</div>`,s=>{
  s.querySelector("#rS").onclick=()=>{const o=readFields(RMF,s);if(!o.t)return toast("triangle-alert","Escreva do que lembrar","");o.d=o.d||TODAY();o.h=o.h||"09:00";const d=r||{id:"rem_"+nid(),c:"rem"};Object.assign(d,o);d.fired="";d.feito=false;save(d);closeSheet();rr();toast("alarm-clock","Lembrete criado",whenTxt(nextOcc(d,new Date())));if(!notifOK())enableNotif();};
  s.querySelector("#rG").onclick=()=>{const o=readFields(RMF,s);window.open(gcalURL(o.t||"Lembrete",o.d,o.h,o.rep,o.nota),"_blank","noopener");};
  const x=s.querySelector("#rX");if(x)x.onclick=()=>{removeDoc(r.id);closeSheet();rr();};});}
ACT.remNew=()=>remForm(null);ACT.remEdit=el=>remForm(getD(el.dataset.id));
ACT.remQuick=()=>{const v=$("rq").value.trim();if(!v)return $("rq").focus();remForm(null,{t:v});};
ACT.remDone=el=>{const r=getD(el.dataset.id);if(r.rep&&!r.feito){const nx=stepOcc(nextOcc(r,new Date()),r.rep,1);r.d=iso(nx);r.fired="";save(r);rr();toast("check","Feito! Próxima vez:",whenTxt(nextOcc(r,new Date())));return;}
  r.feito=!r.feito;save(r);rr();if(r.feito)toast("check","Lembrete concluído",r.t);};

/* ================= MOTOR DE AVISOS ================= */
function tick(){if(!DB.be)return;const now=new Date(),t=TODAY(),hm=pad(now.getHours())+":"+pad(now.getMinutes());
  all("rem").forEach(r=>{if(r.feito)return;const o=lastOcc(r,now);if(!o)return;const key=iso(o)+" "+(r.h||"");if(r.fired===key)return;r.fired=key;save(r);if(now-o<12*36e5)notify("Lembrete: "+r.t,r.nota||whenTxt(o));});
  all("ev").forEach(e=>{if(!e.al||e.fired)return;const w=dtOf(e.d,e.h||"09:00");const at=new Date(w-(+e.al)*60000);if(now>=at&&now-at<12*36e5){e.fired=1;save(e);notify("Agenda: "+e.t,(e.h?e.h+" · ":"")+flong(e.d));}});
  all("ouv").forEach(a=>{if(a.fim||!a.lemb||!a.hora)return;if(hm>=a.hora&&!(a.log&&a.log[t])&&a.af!==t){a.af=t;save(a);notify("Hora do audiobook","Continue ouvindo: "+a.t);}});}
setInterval(()=>{try{tick();}catch(e){}},30000);

/* ================= CALENDÁRIO GERAL ================= */
const EVC=[["acad","Acadêmico","#8B5CF6"],["trab","Trabalho","#3B82F6"],["pess","Pessoal","#EC4899"],["treino","Treino","#F97316"],["casa","Casamento","#E11D48"],["fe","Fé","#10B981"]];
const evCol=k=>(EVC.find(x=>x[0]===k)||EVC[2])[2];
function dayItems(d){const ev=all("ev").filter(e=>e.d===d).sort((a,b)=>(a.h||"").localeCompare(b.h||""));const now=new Date();
  const rm=all("rem").filter(r=>!r.feito&&iso(nextOcc(r,now))===d);const tk=Object.keys(TRK).filter(k=>trkHas(k,d));const ct=all("conta").filter(c=>c.status!=="paga"&&c.venc===d);return{ev,rm,tk,ct};}
VIEWS.cal=()=>{const[y,m]=ym(),t=TODAY(),sel=VIEW.sel||t,flt=VIEW.flt||"";let h=`<header class="top"><span class="mb">${ic("calendar-days")}</span><h1>Calendário</h1><button class="ib" data-a="calToday" aria-label="Ir para hoje">${ic("sun-medium")}</button></header>`;
  h+=`<div class="tabs"><button data-a="calFlt" data-v="" aria-pressed="${!flt}">Tudo</button>${EVC.map(c=>`<button data-a="calFlt" data-v="${c[0]}" aria-pressed="${flt===c[0]}"><span class="sw" style="display:inline-block;background:${c[2]};margin-right:6px"></span>${c[1]}</button>`).join("")}</div>`;
  h+=calNav(y,m,"mNav")+monthGrid(y,m,(d,n)=>{const I=dayItems(d);const evs=I.ev.filter(e=>!flt||e.cat===flt);const nComp=evs.length+(flt?0:I.rm.length+I.ct.length);
    const bc=evs.length?evCol(evs[0].cat):!flt&&I.rm.length?"#C2410C":!flt&&I.ct.length?(I.ct[0].tipo==="receber"?"#15803D":"#B91C1C"):"";const dots=flt?[]:I.tk.map(k=>MODS[k].c1);
    return `<button class="day cd ${nComp?"busy":"free"} ${d===sel?"sel":""} ${d===t?"td":""}" ${nComp?`style="--bc:${bc}"`:""} data-a="calSel" data-d="${d}" aria-label="${n}, ${nComp} compromissos">${n}${nComp>1?`<span class="nc">${nComp}</span>`:""}<span class="dots">${dots.slice(0,5).map(c=>`<i style="background:${c}"></i>`).join("")}</span></button>`;});
  const I=dayItems(sel);const fz=all("fiz").filter(f=>f.d===sel);const gs=sum(all("exp").filter(e=>e.d===sel).map(e=>e.v));
  h+=`<div class="sec"><h2>${esc(flong(sel))}</h2></div>`;
  const evs=I.ev.filter(e=>!flt||e.cat===flt);
  if(evs.length)h+=evs.map(e=>`<div class="item" style="border-left:5px solid ${evCol(e.cat)}"><button class="ibody" data-a="evEdit" data-id="${e.id}"><b>${esc(e.t)}</b><div class="meta">${e.h?`<span class="chip">${ic("clock")} ${esc(e.h)}</span>`:""}<span class="chip" style="color:${evCol(e.cat)}">${esc((EVC.find(x=>x[0]===e.cat)||EVC[2])[1])}</span>${e.local?`<span class="chip">${ic("map-pin")} ${esc(e.local)}</span>`:""}</div>${e.nota?`<p>${esc(e.nota)}</p>`:""}</button></div>`).join("");
  if(!flt){if(I.rm.length)h+=I.rm.map(remCard).join("");
    if(I.tk.length)h+=`<div class="wrap-row" style="margin:6px 0 10px">${I.tk.map(k=>`<button class="chip m" style="padding:7px 11px" data-a="go" data-v="${gv(MODS[k].v)}">${ic(MODS[k].ic)} ${esc(MODS[k].n)}</button>`).join("")}</div>`;
    if(I.ct.length)h+=I.ct.map(c=>`<div class="item" style="border-left:5px solid ${c.tipo==="receber"?"var(--ok)":"var(--no)"}"><button class="ibody" data-a="go" data-v="${gv({v:"contas",tab:c.tipo})}"><div class="row"><b class="grow ell">${c.tipo==="receber"?"A receber":"A pagar"}: ${esc(c.desc)}</b><span class="amt">${money(c.valor)}</span></div>${c.quem?`<div class="meta"><span class="chip">${esc(c.quem)}</span></div>`:""}</button></div>`).join("");
    if(fz.length)h+=`<div class="card small"><b>O que eu fiz</b><ul style="margin:6px 0 0;padding-left:18px">${fz.map(f=>`<li>${esc(f.t)}</li>`).join("")}</ul></div>`;
    if(gs)h+=`<div class="note">${ic("wallet")} Gastos do dia: <b>${money(gs)}</b></div>`;}
  if(!evs.length&&(flt||(!I.rm.length&&!I.tk.length&&!fz.length&&!I.ct.length)))h+=`<div class="note">Nada marcado neste dia. Toque no + para adicionar um compromisso${flt?"":" ou uma atividade acadêmica"}.</div>`;
  return `<div class="app">${h}</div>${fab("evNew","Novo compromisso")}`;};
ACT.calSel=el=>{VIEW.sel=el.dataset.d;rr();};ACT.calFlt=el=>{VIEW.flt=el.dataset.v;rr();};
ACT.calToday=()=>{const n=new Date();VIEW.y=n.getFullYear();VIEW.m=n.getMonth();VIEW.sel=TODAY();rr();};
const EVF=[{k:"t",l:"Compromisso",auto:1,ph:"Ex.: Prova de Estatística"},{k:"cat",l:"Tipo",type:"select",opts:EVC.map(c=>[c[0],c[1]]),def:"acad"},{k:"d",l:"Dia",type:"date"},{k:"h",l:"Hora (opcional)",type:"time"},{k:"local",l:"Local",ph:"Ex.: Sala 204"},
  {k:"al",l:"Avisar antes",type:"select",opts:[["","Não avisar"],["0","Na hora"],["30","30 min antes"],["60","1 h antes"],["1440","1 dia antes"]],def:""},{k:"nota",l:"Anotações",type:"textarea"}];
function evForm(e){sheet(`<h2>${e?"Editar compromisso":"Novo compromisso"}</h2>${EVF.map(f=>fieldHTML(f,e?e[f.k]:(f.k==="d"?(VIEW.sel||TODAY()):null))).join("")}
  <div class="btns"><button class="btn full" id="eS">${e?"Salvar":"Adicionar ao calendário"}</button><button class="btn ghost full" id="eG">${ic("calendar")} Também pôr no Google Agenda</button>${e?`<button class="btn danger full" id="eX">Apagar</button>`:""}</div>`,s=>{
  s.querySelector("#eS").onclick=()=>{const o=readFields(EVF,s);if(!o.t)return toast("triangle-alert","Dê um nome ao compromisso","");o.d=o.d||TODAY();const d=e||{id:"ev_"+nid(),c:"ev"};Object.assign(d,o);d.fired=0;save(d);VIEW.sel=d.d;closeSheet();rr();};
  s.querySelector("#eG").onclick=()=>{const o=readFields(EVF,s);window.open(gcalURL(o.t||"Compromisso",o.d||TODAY(),o.h||"09:00","",o.nota),"_blank","noopener");};
  const x=s.querySelector("#eX");if(x)x.onclick=()=>{removeDoc(e.id);closeSheet();rr();};});}
ACT.evNew=()=>evForm(null);ACT.evEdit=el=>evForm(getD(el.dataset.id));

/* ================= ESPAÇO DO FOTÓGRAFO ================= */
const folders=par=>all("fold").filter(f=>(f.par||"")===par).sort((a,b)=>(a.o||0)-(b.o||0));
const photosIn=fid=>all("ph").filter(p=>p.f===fid).sort((a,b)=>(a.at||0)-(b.at||0));
function descend(fid){let out=[fid];folders(fid).forEach(s=>{out=out.concat(descend(s.id));});return out;}
function coverOf(fid){for(const id of descend(fid)){const p=photosIn(id)[0];if(p)return p.img;}return null;}
function countIn(fid){return sum(descend(fid).map(id=>photosIn(id).length));}
function albCard(f,small){const cv=coverOf(f.id),n=countIn(f.id);return `<button class="alb" data-fid="${f.id}" data-a="go" data-v="${gv({v:"foto",f:f.id})}"><div class="cv">${cv?imgTag(cv,"t"):ic(small?"folder":"images")}</div><b>${esc(f.nome)}</b><span>${n} ${n===1?"foto":"fotos"}${folders(f.id).length?" · "+folders(f.id).length+" pastas":""}</span></button>`;}
VIEWS.foto=()=>{const fid=VIEW.f||"";if(!fid){const A=folders("");let h=topbar("Espaço do fotógrafo","foto");
    if(A.length>1)h+=`<div class="note">${ic("grip-vertical")} Segure um álbum e arraste para mudar a ordem.</div>`;h+=A.length?`<div class="albums" id="albs">${A.map(f=>albCard(f)).join("")}</div>`:empty("foto","Crie seu primeiro álbum","Ex.: JOCELIO E LINDA. Dentro dele, crie pastas como Making of, Noivo e Noiva.",`<button class="btn sm" data-a="fNew">${ic("folder-plus")} Criar álbum</button>`);
    after(()=>{const a=$("albs");if(a)enableFolderSort(a);});return `<div class="app">${h}</div>${fab("fNew","Novo álbum")}`;}
  const F=getD(fid);if(!F){VIEW={v:"foto",f:""};return VIEWS.foto();}
  const path=[];let p=F;while(p){path.unshift(p);p=p.par?getD(p.par):null;}
  const subs=folders(fid),ph=photosIn(fid);
  let h=topbar(F.nome,"foto",`<button class="ib" data-a="fMenu" aria-label="Opções da pasta">${ic("ellipsis-vertical")}</button>`);
  h+=(DB.be.kind==="firebase"?`<div class="row" style="margin:-2px 0 6px"><button class="chip ${F.off?"c":""}" style="padding:6px 12px" data-a="fOffline">${ic(F.off?"check":"download")} ${F.off?"Disponível offline · atualizar":"Salvar para ver offline"}</button></div>`:"")+`<div class="crumbs"><button data-a="tab" data-v="${gv({v:"foto",f:""})}">Álbuns</button>${path.map(x=>` ${ic("chevron-right")} ${x.id===fid?`<span>${esc(x.nome)}</span>`:`<button data-a="tab" data-v="${gv({v:"foto",f:x.id})}">${esc(x.nome)}</button>`}`).join("")}</div>`;
  h+=`<div class="sec" style="margin-top:8px"><h2>Pastas</h2><button class="lk" data-a="fNew">${ic("folder-plus")} Nova pasta</button></div>`;
  const sug=["Making of","Noivo","Noiva","Cerimônia","Festa","Família"].filter(n=>!subs.some(f=>f.nome.toLowerCase()===n.toLowerCase()));
  if(subs.length)h+=`<div class="subs" id="subs">${subs.map(f=>albCard(f,1)).join("")}</div>`;
  if(sug.length&&subs.length<6)h+=`<div class="wrap-row" style="margin-top:8px">${sug.map(n=>`<button class="chip m" style="padding:8px 12px" data-a="fSug" data-n="${n}">${ic("plus")} ${n}</button>`).join("")}</div>`;
  h+=`<div class="sec"><h2>Fotos</h2><span class="chip">${ph.length}</span>${ph.length?`<span class="zoomctl"><button class="ib" data-a="colsPlus" aria-label="Fotos menores">${ic("zoom-out")}</button><span id="colsLbl" class="small muted">${colsGet()} por linha</span><button class="ib" data-a="colsMinus" aria-label="Fotos maiores">${ic("zoom-in")}</button></span>`:""}</div>${ph.length?`<div class="tiny faint" style="margin:-4px 0 8px">No celular, use dois dedos sobre as fotos para aumentar ou diminuir.</div>`:""}`;
  h+=ph.length?`<div class="pgrid" id="pgrid" style="--cols:${colsGet()}">${ph.map((x,i)=>`<button data-a="phOpen" data-i="${i}" aria-label="Abrir foto ${i+1}">${imgTag(x.img,"t")}</button>`).join("")}</div>`:`<div class="note">Nenhuma foto nesta pasta. Toque no + para adicionar várias de uma vez.</div>`;
  after(()=>{const s=$("subs");if(s)enableFolderSort(s);const g=$("pgrid");if(g)enablePinch(g);});
  return `<div class="app">${h}</div><button class="fab" data-a="phAdd" aria-label="Adicionar fotos">${ic("image-plus")}</button>`;};
ACT.fNew=()=>{const par=VIEW.f||"";textEditOne(par?"Nova pasta":"Novo álbum","Nome",par?"Ex.: Making of":"Ex.: JOCELIO E LINDA",v=>{save({id:"fold_"+nid(),c:"fold",nome:v,par,o:Date.now()});rr();});};
ACT.fSug=el=>{save({id:"fold_"+nid(),c:"fold",nome:el.dataset.n,par:VIEW.f,o:Date.now()});rr();};
function textEditOne(title,label,ph,fn,val=""){sheet(`<h2>${esc(title)}</h2><label class="fld"><span>${esc(label)}</span><input id="t1" value="${esc(val)}" placeholder="${esc(ph)}" autofocus data-enter="t1ok"></label><div class="btns"><button class="btn full" data-a="t1ok">Salvar</button></div>`);T1=fn;}
let T1=null;ACT.t1ok=()=>{const v=$("t1").value.trim();if(!v)return $("t1").focus();closeSheet();T1&&T1(v);};
ACT.fMenu=()=>{const F=getD(VIEW.f);sheet(`<h2>${esc(F.nome)}</h2><div class="btns"><button class="btn ghost full" id="f1">${ic("pencil")} Renomear</button><button class="btn ghost full" data-a="fMove">${ic("folder-input")} Mover para outra pasta</button>${DB.be.kind==="firebase"?`<button class="btn ghost full" data-a="fOffline">${ic("download")} ${F.off?"Atualizar fotos offline":"Salvar fotos para ver offline"}</button>`:""}<button class="btn danger full" id="f2">${ic("trash-2")} Apagar pasta e fotos</button></div>`,s=>{
  s.querySelector("#f1").onclick=()=>textEditOne("Renomear","Nome","",v=>{F.nome=v;save(F);rr();},F.nome);
  s.querySelector("#f2").onclick=()=>{const n=countIn(F.id);confirmSheet("Apagar “"+F.nome+"”?",`Isso apaga ${n} ${n===1?"foto":"fotos"} e todas as subpastas.`,"Apagar tudo",()=>{descend(F.id).forEach(id=>{photosIn(id).forEach(p=>removeDoc(p.id));removeDoc(id);});VIEW.f=F.par||"";rr();});};});};
ACT.phAdd=async()=>{const fid=VIEW.f;const files=await pickFiles(true);if(!files.length)return;let ok=0;const bar=document.createElement("div");bar.className="toast";bar.innerHTML=`<span class="ti">${ic("image-plus")}</span><div><b>Enviando fotos</b><span id="upn">0 de ${files.length}</span></div>`;$("toasts").appendChild(bar);
  for(let i=0;i<files.length;i++){try{const p=await processImage(files[i]);const ref=await storeImage(p);save({id:"ph_"+nid(),c:"ph",f:fid,img:ref,at:Date.now()+i});ok++;}catch(e){}const u=$("upn");if(u)u.textContent=(i+1)+" de "+files.length;if(VIEW.v==="foto"&&VIEW.f===fid&&i%3===2)rr();}
  bar.remove();if(VIEW.v==="foto"&&VIEW.f===fid)rr();toast(ok===files.length?"check":"triangle-alert",ok+" "+(ok===1?"foto adicionada":"fotos adicionadas"),ok<files.length?(files.length-ok)+" não puderam ser enviadas":"");};
ACT.phOpen=el=>{const ph=photosIn(VIEW.f);const items=ph.map(p=>({ref:p.img,id:p.id}));openViewer(items,+el.dataset.i,{onDel:it=>removeDoc(it.id)});};

/* ================= AJUSTES ================= */
VIEWS.ajustes=()=>{const c=cfg();const mode=DB.be.kind==="cloud";let h=topbar("Ajustes","ajustes");
  h+=`<div class="card"><div class="row">${logo(56)}<div><div class="wm">Moving Up</div><div class="small muted">Organização pessoal para elevar sua performance</div></div></div></div>`;
  h+=`<div class="sec"><h2>Você</h2></div><div class="card"><label class="fld" style="margin-top:0"><span>Como quer ser chamado</span><input id="cn" value="${esc(c.nome||"")}" placeholder="Seu nome" data-ch="cfgNome"></label>
   <div class="fld"><span>Tema</span><div class="seg" data-on="cfgTema">${[["light","Claro"],["dark","Escuro"],["auto","Automático"]].map(([k,n])=>`<button data-a="seg" data-v="${k}" aria-pressed="${(c.tema2||"light")===k}">${n}</button>`).join("")}</div></div>
   <div style="margin-top:14px">${pushAjustesHTML()}</div></div>`;
  h+=`<div class="sec"><h2>Minhas frases</h2><button class="lk" data-a="frNew">${ic("plus")} Nova</button></div>`+((c.frases||[]).length?(c.frases||[]).map((f,i)=>`<div class="item"><button class="ibody" data-a="frEdit" data-i="${i}"><b>“${esc(f.t)}”</b><div class="small muted">${esc(f.a||"Minha frase")}</div></button></div>`).join(""):`<div class="note">Adicione mantras e frases suas. Elas entram no rodízio da tela inicial.</div>`);
  const fb=DB.be.kind==="firebase",em=fb&&firebase.auth().currentUser?firebase.auth().currentUser.email:"";
  h+=`<div class="sec"><h2>Seus dados</h2></div><div class="card small"><p style="margin:0 0 10px">${fb?"Conectado ao Firebase como <b>"+esc(em)+"</b>. Tudo o que você registra, inclusive as fotos, fica salvo na nuvem e aparece em qualquer aparelho em que você entrar com esta conta. Funciona também sem internet: sincroniza quando a conexão voltar.":mode?"Seus dados ficam salvos na sua conta Claude e aparecem em qualquer aparelho em que você abrir este app. Ninguém mais vê o que você registra.":"Seus dados ficam salvos neste aparelho. Faça cópias de segurança de vez em quando."}</p>
   <div class="btns h"><button class="btn ghost" data-a="bkExp">${ic("download")} Exportar cópia</button><button class="btn ghost" data-a="bkImp">${ic("cloud-upload")} Importar</button></div>
   ${fb?`<div class="btns"><button class="btn ghost full" data-a="migrar">${ic("cloud-upload")} Enviar dados deste aparelho para a nuvem</button><button class="btn danger full" data-a="logout">${ic("log-out")} Sair da conta</button></div>`:""}
   <p class="tiny faint" style="margin:10px 0 0">A cópia exportada leva textos, números e checks. ${fb?"As fotos ficam na nuvem.":"As fotos continuam guardadas "+(mode?"na sua conta":"neste aparelho")+"."}</p></div>`;
  return `<div class="app">${h}<div class="foot">Moving Up · versão 2.0</div></div>`;};
CH.cfgNome=el=>{const c=cfg();c.nome=el.value.trim();save(c);};
ACT.cfgTema=el=>{const c=cfg();c.tema2=el.dataset.v;save(c);applyTheme();rr();};
ACT.frNew=()=>frForm(null);ACT.frEdit=el=>frForm(+el.dataset.i);
function frForm(i){const c=cfg();c.frases=c.frases||[];const f=i==null?{t:"",a:""}:c.frases[i];sheet(`<h2>${i==null?"Nova frase":"Editar frase"}</h2><label class="fld"><span>Frase ou mantra</span><textarea id="ft">${esc(f.t)}</textarea></label><label class="fld"><span>Autor (opcional)</span><input id="fa" value="${esc(f.a)}"></label>
  <div class="btns"><button class="btn full" id="fS">Salvar</button>${i!=null?`<button class="btn danger full" id="fX">Apagar</button>`:""}</div>`,s=>{
  s.querySelector("#fS").onclick=()=>{const t=s.querySelector("#ft").value.trim();if(!t)return;const o={t,a:s.querySelector("#fa").value.trim()};if(i==null)c.frases.push(o);else c.frases[i]=o;save(c);closeSheet();rr();};
  const x=s.querySelector("#fX");if(x)x.onclick=()=>{c.frases.splice(i,1);save(c);closeSheet();rr();};});}
ACT.bkExp=async()=>{const data=JSON.stringify({app:"movingup",v:1,em:new Date().toISOString(),docs:[...DB.docs.values()]});const name="moving-up-"+TODAY()+".json";
  try{if(window.claude&&claude.use){const dl=await claude.use("downloads");if(dl){await dl.save({filename:name,data});return;}}}catch(e){if(e&&e.code)return;}
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([data],{type:"application/json"}));a.download=name;document.body.appendChild(a);a.click();a.remove();};
ACT.bkImp=async()=>{const f=await pickFiles(false,"application/json,.json");if(!f.length)return;try{const j=JSON.parse(await f[0].text());if(j.app!=="movingup"||!Array.isArray(j.docs))throw 0;
  confirmSheet("Importar "+j.docs.length+" registros?","Itens com o mesmo identificador serão substituídos pela versão da cópia.","Importar",()=>{j.docs.forEach(d=>{if(d&&d.id&&d.c)save(d);});toast("check","Cópia importada",j.docs.length+" registros");rr();});}
  catch(e){toast("triangle-alert","Arquivo inválido","Escolha uma cópia exportada pelo Moving Up.");}};
