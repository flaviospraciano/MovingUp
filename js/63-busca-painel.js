"use strict";
/* ======================================================================
   4.2 · ATALHOS NO ÍCONE · BUSCA UNIVERSAL · PAINEL NA MESA · COMPARTILHAR · MÓDULOS FIXOS
   · Segurar o ícone do app: Câmera, Gasto, Tarefa, Jarvis e Água (manifest "shortcuts", ?acao=…).
   · Puxar para baixo no topo de qualquer tela abre a busca: acha tudo e executa ("abrir maratona", "nova conta").
   · Carregando e parado: vira um painel de mesa (relógio, próximo compromisso, água, tarefa atual), tela acesa.
   · Compartilhar um arquivo com o Moving Up (share target): fotos vão para a câmera rápida, GPX/TCX/FIT para a corrida.
   · Módulos sempre no mesmo lugar: sem "mais usados" e "pouco usados".
   ====================================================================== */
/* ---------- módulos fixos ---------- */
modsGrid=function(){return MOD_GROUPS.map(([g,ks])=>{const K=ks.filter(k=>MODS[k]);return K.length?`<div class="grp">${esc(g)}</div><div class="grid">${K.map(k=>`<button class="tile" ${mstyle(k)} data-a="go" data-v="${gv(MODS[k].v)}"><span class="mb">${ic(MODS[k].ic)}</span>${esc(MODS[k].n)}</button>`).join("")}</div>`:"";}).join("");};

/* ---------- sobreposições de tela cheia desta versão: o voltar fecha (a prova bloqueia) ---------- */
const OVL42=["busca","painel","camrep","corimp","semimg"];
const _fechaSob42=fecharSobreposicao;fecharSobreposicao=function(){for(const id of OVL42){const d=$(id);if(d){const f=ACT[id+"Fechar"];if(f)f();else{d.remove();document.body.style.overflow="";}return true;}}return _fechaSob42.apply(this,arguments);};

/* ---------- atalhos do ícone e retorno do compartilhar ---------- */
const _start63=startApp;startApp=function(){const r=_start63.apply(this,arguments);try{const P=new URLSearchParams(location.search),a=P.get("acao"),sh=P.get("compartilhado");
    if(a||sh){history.replaceState(null,"",location.pathname);setTimeout(()=>{if(a)atalhoExec(a);if(sh)compartilhadoLer();},700);}}catch(e){console.warn(e);}return r;};
function atalhoExec(a){if(a==="camera")return sheet(`<div style="text-align:center"><span class="mb" style="margin:6px auto 10px;width:64px;height:64px;border-radius:20px;font-size:1.7rem;background:linear-gradient(135deg,#0EA5E9,#6366F1)">${ic("camera")}</span><h2>Câmera rápida</h2><p class="muted small">Tire a foto e escolha para qual atividade ela vai.</p></div><div class="btns"><button class="btn full" data-a="camAtalho">${ic("camera")} Tirar foto</button></div>`);
  if(a==="gasto"){go({v:"gastos"});return setTimeout(()=>ACT.gNew&&ACT.gNew(),120);}
  if(a==="tarefa")return tarefaRapida();
  if(a==="jarvis"){jarSheet(false);return setTimeout(()=>{try{jarOuvir();}catch(e){}},350);}
  if(a==="agua"){const A=aguaCfg();if(!A.on){A.on=true;save(A);}ACT.aguaMais();const n=aguaHoje(),ml=+A.ml||100,lt=v=>String(Math.round(v*ml/100)/10).replace(".",",");toast("droplet",`+${ml} ml de água`,`${lt(n)} L de ${lt(+A.meta)} L hoje`+(n>=+A.meta?" · meta batida!":""));}}
ACT.camAtalho=()=>{closeSheet();camAbrir();};
function tarefaRapida(){sheet(`<h2>${ic("list-checks")} Nova tarefa</h2><label class="fld"><span>O que precisa fazer?</span><input id="trI" placeholder="Ex.: Enviar o relatório do edital" data-enter="trAdd" enterkeyhint="done" autofocus></label>
   <div class="seg" data-k="trD" style="margin-top:4px"><button type="button" data-a="seg" data-v="h" aria-pressed="true">Hoje</button><button type="button" data-a="seg" data-v="a" aria-pressed="false">Amanhã</button></div>
   <div class="btns h"><button class="btn" data-a="trAdd">${ic("plus")} Anotar</button><button class="btn ghost" data-a="trJaFiz">${ic("check")} Já fiz</button></div>`,s=>{setTimeout(()=>{const i=s.querySelector("#trI");if(i)i.focus();},60);});}
function trCriar(feito){const i=$("trI");const v=i&&i.value.trim();if(!v){if(i)i.focus();return;}const amanha=(document.querySelector('[data-k="trD"] [aria-pressed="true"]')||{}).dataset;const d=amanha&&amanha.v==="a"?addDays(TODAY(),1):TODAY();
  const o=Math.max(0,...all("todo").filter(x=>x.d===d).map(x=>x.o||0))+1;const x=save({id:"todo_"+nid(),c:"todo",t:v,d,dias:[d],ok:false,o});closeSheet();
  if(x&&feito&&!x.ok)todoMarca(x,true);rr();if(x&&x.t===v&&getD(x.id))toast(feito?"circle-check":"list-checks",feito?"Anotado como feito":"Tarefa anotada",v+(d===TODAY()?"":" · amanhã"));}
ACT.trAdd=()=>trCriar(false);ACT.trJaFiz=()=>trCriar(true);
async function compartilhadoLer(){let F=[],meta={};try{const c=await caches.open("mu-share");const K=await c.keys();
    for(const k of K){const r=await c.match(k);if(/\/share\/meta$/.test(k.url))meta=await r.json().catch(()=>({}));else{const b=await r.blob();F.push(new File([b],decodeURIComponent(r.headers.get("x-nome")||"arquivo"),{type:b.type||r.headers.get("content-type")||""}));}await c.delete(k);}}catch(e){console.warn("share",e);}
  const imgs=F.filter(f=>/^image\//.test(f.type)),rot=F.filter(f=>/\.(gpx|tcx|fit|zip|gz)$/i.test(f.name)||/gpx|tcx|garmin|fit|zip|xml|octet/.test(f.type));
  if(rot.length&&typeof corridaImportar==="function")return corridaImportar(rot);
  if(imgs.length){CAM={img:null,d:TODAY(),prom:processImage(imgs[0]).then(p=>{CAM.img=p;return p;})};camEscolher();CAM.prom.then(p=>{const im=$("camPv");if(im){im.src=p.preview;im.parentElement.classList.remove("load");}});return;}
  const txt=[meta.title,meta.text,meta.url].filter(Boolean).join(" ");
  if(/strava\.(com|app)/i.test(txt))return sheet(`<h2>${ic("activity")} Corrida do Strava</h2><p class="muted small">O link do Strava não traz os dados da corrida. Duas saídas:</p><div class="note">${ic("link")} <b>Automático:</b> conecte o Strava em Ajustes. As corridas entram sozinhas.</div><div class="note">${ic("file-up")} <b>Arquivo:</b> no site do Strava, abra a atividade, toque em ⋯ e em <i>Exportar GPX</i>, e compartilhe o arquivo com o Moving Up.</div><div class="btns"><button class="btn full" data-a="go" data-v="${gv({v:"ajustes"})}">Abrir Ajustes</button></div>`);
  if(txt){jarSheet(false);const i=$("jarI");if(i)i.value=txt.slice(0,500);return;}
  if(F.length)toast("file-question","Não reconheci o arquivo","Envie fotos ou arquivos de corrida (GPX, TCX, FIT).");}

/* ---------- busca universal ---------- */
const BUSCA_ACOES=()=>[
 ["Nova conta a pagar","receipt","nova conta pagar boleto fatura",()=>{go({v:"contas",tab:"pagar"});setTimeout(()=>ctForm(null,"pagar"),80);}],
 ["Nova conta a receber","hand-coins","nova conta receber cache",()=>{go({v:"contas",tab:"receber"});setTimeout(()=>ctForm(null,"receber"),80);}],
 ["Novo gasto","wallet","novo gasto gastei compra despesa",()=>{go({v:"gastos"});setTimeout(()=>ACT.gNew&&ACT.gNew(),80);}],
 ["Nova tarefa","list-checks","nova tarefa anotar afazer todo",()=>tarefaRapida()],
 ["Novo compromisso","calendar-plus","novo compromisso evento agenda marcar reuniao",()=>{go({v:"cal"});setTimeout(()=>ACT.evNew&&ACT.evNew(),80);}],
 ["Novo lembrete","alarm-clock","novo lembrete lembrar alarme",()=>{go({v:"lemb"});setTimeout(()=>ACT.remNew&&ACT.remNew(),80);}],
 ["Beber água","droplet","agua beber copo hidratar",()=>atalhoExec("agua")],
 ["Câmera rápida","camera","camera foto fotografar",()=>camAbrir()],
 ["Falar com o Jarvis","audio-lines","jarvis falar perguntar assistente",()=>{jarSheet(false);setTimeout(()=>jarOuvir(),300);}],
 ["Encaixar na agenda","calendar-search","encaixar encaixa horario livre agenda estudo",q=>{if(!encaixarPedido(q))jarSheet(false);}],
 ["Simulado em modo prova","clipboard-check","simulado prova modo prova ibge questoes",()=>typeof provaAbrir==="function"&&provaAbrir({tipo:"livre"})],
 ["Contar flexões pela câmera","scan-eye","contar flexoes camera contador",()=>typeof camRepAbrir==="function"&&camRepAbrir("flex")],
 ["Contar agachamentos pela câmera","scan-eye","contar agachamentos camera contador",()=>typeof camRepAbrir==="function"&&camRepAbrir("agach")],
 ["Importar corrida (GPX, TCX, FIT)","file-up","importar corrida relogio strava gpx tcx fit garmin",()=>typeof corridaEscolher==="function"&&corridaEscolher()],
 ["Sua semana em uma imagem","image","semana imagem postar story instagram",()=>typeof semanaImagem==="function"&&semanaImagem()],
 ["Você contra o você do mês passado","swords","mes passado voce contra comparar produzir",()=>go({v:"vsmes"})],
 ["Kegel rápido · 2 minutos","timer","kegel rapido 2 minutos",()=>typeof kgMicro==="function"&&kgMicro()],
 ["Linha do tempo das contas","calendar-range","linha do tempo contas entra sai quando caixa",()=>go({v:"contas",tab:"linha"})],
 ["Limite de gastos do mês","gauge","limite gastos orcamento mes",()=>{go({v:"gastos"});setTimeout(()=>ACT.limDef&&ACT.limDef(),80);}],
 ["Escrever carta para o futuro","mail","carta futuro escrever",()=>{go({v:"carta"});setTimeout(()=>ACT.cartaNova(),80);}],
 ["Lixeira","trash-2","lixeira apagados restaurar recuperar",()=>go({v:"lixeira"})],
 ["Exportar a sua vida (planilhas e Markdown)","download","exportar planilha excel markdown backup",()=>go({v:"exportar"})],
 ["Painel na mesa","monitor","painel mesa relogio carregando",()=>painelAbrir(true)],
 ["Ajustes","settings","ajustes configuracoes",()=>go({v:"ajustes"})]];
const BUSCA_TIPOS={todo:["Tarefa","list-checks",x=>x.t,x=>fdate(x.d),x=>go({v:"todo"})],rem:["Lembrete","alarm-clock",x=>x.t,x=>x.d?fdate(x.d):"",x=>go({v:"lemb"})],
  ev:["Compromisso","calendar-days",x=>x.t+" "+(x.local||"")+" "+(x.nota||""),x=>fdate(x.d)+(x.h?" · "+x.h:""),x=>go({v:"cal",sel:x.d,y:pd(x.d).getFullYear(),m:pd(x.d).getMonth()})],
  exp:["Gasto","wallet",x=>(x.desc||"")+" "+(x.cat||""),x=>fdate(x.d)+(DISCRETO?"":" · "+money(x.v)),x=>go({v:"gastos"})],
  conta:["Conta","receipt",x=>(x.desc||"")+" "+(x.quem||""),x=>(x.tipo==="receber"?"a receber":"a pagar")+" · "+fdate(x.venc)+(DISCRETO?"":" · "+money(x.valor)),x=>ctForm(x)],
  ed:["Edital","folder",x=>(x.nome||"")+" "+(x.pess||[]).map(p=>p.n).join(" "),x=>"Editais "+(x.ano||""),x=>go({v:"editais",ano:String(x.ano||"2026")})],
  cer:["Segundo cérebro","brain",x=>(x.t||"")+" "+(x.x||""),x=>(CER_T&&CER_T[x.tipo]?CER_T[x.tipo][0]:"Nota"),x=>go({v:"cerNota",id:x.id})],
  ctt:["Contato","user",x=>(x.nome||"")+" "+(x.org||"")+" "+(x.papel||""),x=>[x.papel,x.org].filter(Boolean).join(" · "),x=>go({v:"ctt"})],
  trk:["Registro","dumbbell",x=>(x.t||"")+" "+(x.s||"")+" "+((MODS[x.k]||{}).n||""),x=>((MODS[x.k]||{}).n||"")+" · "+fdate(x.d),x=>trkSheet(x.k,x.d)],
  hab:["Hábito","list-checks",x=>x.nome||"",x=>"hábito",x=>go({v:"habitos"})],ouv:["Audiobook","headphones",x=>(x.t||"")+" "+(x.autor||""),x=>"audiobook",x=>go({v:"audio"})],
  carta:["Carta","mail",x=>x.ocasiao||"",x=>x.aberta?"lida":"selada",x=>go({v:"carta"})],cmp:["Compromisso público","handshake",x=>x.meta||"",x=>x.prazo?fdate(x.prazo):"",x=>go({v:"cmp"})]};
let BUSCA=null;
function buscaAbrir(){if($("busca"))return;const d=document.createElement("div");d.id="busca";d.className="busca";
  d.innerHTML=`<div class="busca-top"><span class="ib">${ic("search")}</span><input id="buscaI" placeholder="Buscar ou mandar: abrir maratona, nova conta…" autocomplete="off" enterkeyhint="go" aria-label="Buscar no app"><button class="ib" data-a="buscaFechar" aria-label="Fechar">${ic("x")}</button></div><div class="busca-r" id="buscaR"></div>`;
  document.body.appendChild(d);document.body.style.overflow="hidden";guard();const i=$("buscaI");i.addEventListener("input",()=>{clearTimeout(BUSCA&&BUSCA.t);BUSCA={t:setTimeout(buscaRender,70)};});
  i.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();const b=document.querySelector("#buscaR [data-a='buscaIr']");if(b)b.click();}});buscaRender();setTimeout(()=>i.focus(),30);}
ACT.buscaFechar=()=>{const d=$("busca");if(d)d.remove();document.body.style.overflow="";BUSCA_L=[];};
let BUSCA_L=[];
function buscaRender(){const i=$("buscaI"),R=$("buscaR");if(!i||!R)return;const q=i.value.trim(),n=normTxt(q).replace(/[^a-z0-9 ]/g," ").trim();BUSCA_L=[];
  const add=(grp,ico,t,sub,fn)=>{BUSCA_L.push({grp,ico,t,sub,fn});};const U=lsGet("mu_uso",{});
  if(!n){BUSCA_ACOES().slice(0,8).forEach(a=>add("Ações rápidas",a[1],a[0],"",a[3]));}
  else{const pal=n.split(" ").filter(w=>w.length>1);const casa=txt=>{const t=normTxt(txt);return pal.every(w=>t.includes(w));};
    const sem=n.replace(/^(abrir|abre|abra|ir para|ir pra|vai para|vai pra|mostrar|mostra|ver|entrar em|entra em)\s+(o |a |no |na )?/,"");
    BUSCA_ACOES().filter(a=>casa(a[0]+" "+a[2])||(sem!==n&&casa(a[0]))).slice(0,6).forEach(a=>add("Fazer",a[1],a[0],"",()=>a[3](q)));
    const sp=sem.split(" ").filter(w=>w.length>1);Object.keys(MODS).filter(k=>MODS[k].v&&k!=="home").filter(k=>{const t=normTxt(MODS[k].n+" "+k);return sp.length&&sp.every(w=>t.includes(w));})
      .sort((a,b)=>((U[b]&&U[b].n)||0)-((U[a]&&U[a].n)||0)).slice(0,6).forEach(k=>add("Abrir",MODS[k].ic,MODS[k].n,"módulo",()=>go(MODS[k].v)));
    let n2=0;Object.entries(BUSCA_TIPOS).forEach(([c,T])=>{if(n2>=30)return;all(c).filter(x=>{try{return casa(T[2](x));}catch(e){return false;}}).sort((a,b)=>(b.u||0)-(a.u||0)).slice(0,6).forEach(x=>{if(n2++>=30)return;
        let sub="";try{sub=T[3](x);}catch(e){}add("Encontrado",T[1],String(T[2](x)).trim().slice(0,80)||T[0],T[0]+(sub?" · "+sub:""),()=>T[4](x));});});
    if(pal.length>=2||!BUSCA_L.length)add("Jarvis","audio-lines",`Mandar para o Jarvis: “${q}”`,"ele executa ou responde",()=>{jarSheet(false);jarPerguntar(q);});}
  let g="";R.innerHTML=BUSCA_L.length?BUSCA_L.map((x,j)=>{const cab=x.grp!==g?`<div class="grp">${esc(x.grp)}</div>`:"";g=x.grp;return cab+`<button class="busca-it" data-a="buscaIr" data-j="${j}"><span class="mb">${ic(x.ico)}</span><span class="grow"><b>${esc(x.t)}</b>${x.sub?`<span class="tiny muted">${esc(x.sub)}</span>`:""}</span>${ic("chevron-right")}</button>`;}).join("")
    :`<p class="muted small" style="padding:20px">Nada encontrado.</p>`;}
ACT.buscaIr=el=>{const x=BUSCA_L[+el.dataset.j];if(!x)return;ACT.buscaFechar();try{x.fn();}catch(e){console.warn(e);}};
ACT.buscaAbrir=()=>buscaAbrir();
/* gesto: puxar para baixo no topo */
(function(){let y0=null,x0=0,arm=false,pill=null;const livre=e=>{if(!DB.be||window.scrollY>2||document.body.style.overflow==="hidden")return false;if(!$("sheet").classList.contains("hidden"))return false;
    if(document.body.classList.contains("modo-prova")||$("busca")||$("painel")||$("kgp")||$("camrep")||$("viewer"))return false;const t=e.target;if(t.closest&&t.closest("input,textarea,select,.board,.seg,[contenteditable],.kgp,.mdp,.reader"))return false;return true;};
  const pp=()=>{if(!pill){pill=document.createElement("div");pill.className="pullb";document.body.appendChild(pill);}return pill;};
  document.addEventListener("touchstart",e=>{if(e.touches.length!==1||!livre(e)){y0=null;return;}y0=e.touches[0].clientY;x0=e.touches[0].clientX;arm=false;},{passive:true});
  document.addEventListener("touchmove",e=>{if(y0==null)return;const dy=e.touches[0].clientY-y0,dx=Math.abs(e.touches[0].clientX-x0);if(dy<12||dx>dy*.7||window.scrollY>2){if(pill)pill.style.opacity=0;arm=false;return;}
    const p=pp();arm=dy>130;p.style.opacity=Math.min(1,dy/90);p.style.transform=`translate(-50%,${Math.min(dy*.45,72)}px)`;p.innerHTML=`${ic("search")} ${arm?"Solte para buscar":"Puxe para buscar"}`;p.classList.toggle("arm",arm);},{passive:true});
  document.addEventListener("touchend",()=>{if(pill){pill.style.opacity=0;pill.style.transform="translate(-50%,0)";}if(y0!=null&&arm){try{navigator.vibrate&&navigator.vibrate(15);}catch(e){}buscaAbrir();}y0=null;arm=false;},{passive:true});})();
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();buscaAbrir();}});

/* ---------- painel na mesa ---------- */
let BAT=null,PAINEL=null,ULT_TOQUE=Date.now();
["pointerdown","keydown","wheel","touchstart"].forEach(ev=>document.addEventListener(ev,()=>{ULT_TOQUE=Date.now();},{passive:true,capture:true}));
try{navigator.getBattery&&navigator.getBattery().then(b=>{BAT=b;b.addEventListener("chargingchange",()=>{if(!b.charging&&PAINEL&&!PAINEL.manual)ACT.painelFechar();});}).catch(()=>{});}catch(e){}
const painelOn=()=>cfg().painel!==false;
setInterval(()=>{try{if(!DB.be||PAINEL||!painelOn()||!BAT||!BAT.charging||document.visibilityState!=="visible")return;if(Date.now()-ULT_TOQUE<25000)return;
  if(!$("sheet").classList.contains("hidden")||document.body.style.overflow==="hidden"||document.body.classList.contains("modo-prova")||$("kgp")||$("mdp")||$("camrep"))return;
  const a=document.activeElement;if(a&&/INPUT|TEXTAREA|SELECT/.test(a.tagName))return;if(typeof FOCO!=="undefined"&&FOCO&&VIEW.v==="foco")return;painelAbrir(false);}catch(e){}},5000);
function painelProx(){const now=new Date(),t=TODAY(),L=[];
  [t,addDays(t,1)].forEach(d=>all("ev").filter(e=>evNoDia(e,d)&&e.h).forEach(e=>{const at=dtOf(d,e.h);if(at>now)L.push({at,t:e.t,ic:"calendar-days",d,h:e.h});}));
  all("rem").filter(r=>!r.feito).forEach(r=>{try{const w=nextOcc(r,now);if(w&&w-now<36*3600e3)L.push({at:w,t:r.t,ic:"alarm-clock",d:iso(w),h:pad(w.getHours())+":"+pad(w.getMinutes())});}catch(e){}});
  return L.sort((a,b)=>a.at-b.at)[0]||null;}
function painelTarefa(){if(typeof FOCO!=="undefined"&&FOCO&&FOCO.t)return{t:FOCO.t,foco:true};const L=todosDoDia(TODAY()).filter(x=>!x.ok);return L[0]?{t:L[0].t,id:L[0].id}:null;}
function painelHTML(){const n=new Date(),P=painelProx(),T=painelTarefa(),A=aguaCfg(),ag=aguaHoje(),meta=+A.meta||30,ml=+A.ml||100,lt=v=>String(Math.round(v*ml/100)/10).replace(".",",");
  const quando=P?(P.d===TODAY()?"hoje":"amanhã")+" às "+P.h+(P.at-n<3600e3?` · em ${Math.max(1,Math.round((P.at-n)/60000))} min`:""):"";
  return `<div class="pn-in" style="transform:translate(${PAINEL.dx}px,${PAINEL.dy}px)"><div class="pn-h">${pad(n.getHours())}<span class="pn-pt">:</span>${pad(n.getMinutes())}</div><div class="pn-d">${esc(flong(TODAY()))}</div>
   <div class="pn-g"><div class="pn-c"><span>${ic("calendar-clock")} Próximo</span>${P?`<b>${esc(P.t)}</b><small>${esc(quando)}</small>`:`<b class="pn-fa">Nada marcado</b><small>agenda livre</small>`}</div>
    <div class="pn-c"><span>${ic("list-checks")} ${T&&T.foco?"Em foco agora":"Tarefa atual"}</span>${T?`<b>${esc(T.t)}</b>${T.id?`<button class="pn-ok" data-a="painelOk" data-id="${T.id}">${ic("check")} Feita</button>`:""}`:`<b class="pn-fa">Tudo feito por hoje</b>`}</div>
    <div class="pn-c"><span>${ic("droplet")} Água</span><b>${lt(ag)} L <small>de ${lt(meta)} L</small></b><div class="pn-bar"><i style="width:${Math.min(100,ag/meta*100)}%"></i></div><button class="pn-ok" data-a="painelAgua">${ic("plus")} ${ml} ml</button></div></div>
   <div class="pn-f">${BAT?`${ic("battery-charging")} ${Math.round(BAT.level*100)}% · carregando`:""} · toque para sair</div></div>`;}
async function painelAbrir(manual){if($("painel"))return;PAINEL={manual:!!manual,dx:0,dy:0};const d=document.createElement("div");d.id="painel";d.className="painel";document.body.appendChild(d);document.body.style.overflow="hidden";guard();
  d.addEventListener("click",e=>{if(e.target.closest("[data-a]"))return;ACT.painelFechar();});painelTick();PAINEL.t=setInterval(painelTick,10000);
  try{if(navigator.wakeLock)PAINEL.lock=await navigator.wakeLock.request("screen");}catch(e){}}
function painelTick(){const d=$("painel");if(!d||!PAINEL)return;const m=new Date().getMinutes();if(PAINEL.m!==m){PAINEL.m=m;PAINEL.dx=Math.round(Math.random()*24-12);PAINEL.dy=Math.round(Math.random()*24-12);}d.innerHTML=painelHTML();}
ACT.painelFechar=()=>{const d=$("painel");if(d)d.remove();if(PAINEL){clearInterval(PAINEL.t);try{PAINEL.lock&&PAINEL.lock.release();}catch(e){}}PAINEL=null;document.body.style.overflow="";ULT_TOQUE=Date.now();};
ACT.painelAgua=()=>{ACT.aguaMais();painelTick();};
ACT.painelOk=el=>{const x=getD(el.dataset.id);if(x&&!x.ok)todoMarca(x,true);painelTick();toast("circle-check","Tarefa feita",x?x.t:"");};
document.addEventListener("visibilitychange",async()=>{if(document.visibilityState==="visible"&&PAINEL&&navigator.wakeLock){try{PAINEL.lock=await navigator.wakeLock.request("screen");}catch(e){}}});
ACT.painelLiga=()=>{const c=cfg();c.painel=!painelOn();save(c);rr();};
