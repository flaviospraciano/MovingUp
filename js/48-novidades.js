"use strict";
/* ======================================================================
   NOVIDADES v2.9
   1. Áudio vira tarefas (fala livre → tarefas, compromissos e anotações)
   2. Comparações com gráfico (gastos e treinos: este mês × mês passado)
   3. Feriados nacionais, do Ceará e de Sobral no calendário
   4. Metas de poupança
   5. Descanso entre séries (cronômetro com vibração)
   6. Água: lembretes ao longo do dia
   7. Fila de leitura
   8. Versículo do dia nas afirmações
   ====================================================================== */
Object.assign(ICONS,{
  "droplet":'<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  "party":'<path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/>',
  "book-open-check":'<path d="M8 3H2v15h7c1.7 0 3 1.3 3 3V7c0-2.2-1.8-4-4-4Z"/><path d="m16 12 2 2 4-4"/><path d="M22 6V3h-6c-2.2 0-4 1.8-4 4v14c0-1.7 1.3-3 3-3h7v-2.3"/>'
});

/* ---------- 3. FERIADOS ---------- */
/* Ceará: 19/3 (São José) e 25/3 (Data Magna). Sobral (Decreto 190/1998): 5/7 (Dia do Município) e 8/12 (N. Sra. da Conceição, padroeira) */
function pascoa(y){const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),mes=Math.floor((h+l-7*m+114)/31),dia=((h+l-7*m+114)%31)+1;return `${y}-${pad(mes)}-${pad(dia)}`;}
const FER_CACHE={};
function feriadosAno(y){if(FER_CACHE[y])return FER_CACHE[y];const P=pascoa(y),F={};const add=(d,n,t)=>{F[d]={n,t};};
  [["01-01","Confraternização Universal"],["04-21","Tiradentes"],["05-01","Dia do Trabalho"],["09-07","Independência do Brasil"],["10-12","Nossa Senhora Aparecida"],["11-02","Finados"],["11-15","Proclamação da República"],["11-20","Consciência Negra"],["12-25","Natal"]].forEach(([md,n])=>add(`${y}-${md}`,n,"nacional"));
  add(addDays(P,-2),"Sexta-feira Santa","nacional");add(addDays(P,-48),"Carnaval","facultativo");add(addDays(P,-47),"Carnaval","facultativo");add(addDays(P,-46),"Quarta-feira de Cinzas (até 14h)","facultativo");add(addDays(P,60),"Corpus Christi","facultativo");
  add(`${y}-03-19`,"São José (Ceará)","estadual");add(`${y}-03-25`,"Data Magna do Ceará","estadual");
  add(`${y}-07-05`,"Aniversário de Sobral","municipal");add(`${y}-12-08`,"Nossa Senhora da Conceição (Sobral)","municipal");
  return FER_CACHE[y]=F;}
const feriado=d=>d?feriadosAno(+d.slice(0,4))[d]||null:null;
const ferTipo={nacional:"Feriado nacional",estadual:"Feriado no Ceará",municipal:"Feriado em Sobral",facultativo:"Ponto facultativo"};
const _cal48=VIEWS.cal;VIEWS.cal=function(){let h=_cal48.apply(this,arguments);
  h=h.replace(/<button class="day cd ([^"]*)"([^>]*?)data-d="(\d{4}-\d{2}-\d{2})"([^>]*)>/g,(m,cls,a,d,b)=>{const f=feriado(d);return f?`<button class="day cd ${cls} fer fer-${f.t}"${a}data-d="${d}"${b} title="${esc(f.n)}">`:m;});
  const sel=VIEW.sel||TODAY(),f=feriado(sel);
  if(f)h=h.replace(`<div class="sec"><h2>${esc(flong(sel))}</h2></div>`,`<div class="sec"><h2>${esc(flong(sel))}</h2></div><div class="ferl fer-${f.t}">${ic("party")} <b>${esc(f.n)}</b><span>${ferTipo[f.t]}</span></div>`);
  return h;};
const _secAg48=secAgenda;secAgenda=function(amanha){let h=_secAg48.apply(this,arguments);const d=amanha?addDays(TODAY(),1):TODAY(),f=feriado(d);
  if(!f)return h;const linha=`<div class="ferl fer-${f.t}" style="margin-top:0">${ic("party")} <b>${amanha?"Amanhã: ":""}${esc(f.n)}</b><span>${ferTipo[f.t]}</span></div>`;
  return h.replace(/(<\/div>)/,"$1"+linha);};
function proxFeriado(){let d=TODAY();for(let i=0;i<120;i++){const f=feriado(d);if(f&&f.t!=="facultativo")return{d,...f,em:i};d=addDays(d,1);}return null;}
try{const _bf48=briefFatos;briefFatos=function(per){const F=_bf48.apply(this,arguments);const f=feriado(TODAY()),n=proxFeriado();if(f)F.feriado_hoje=f.n;else if(n&&n.em<=7)F.proximo_feriado=`${n.n} (${quandoTxt(n.d)})`;return F;};
  const _bl48=briefLocal;briefLocal=function(per){let t=_bl48.apply(this,arguments);if(per!=="manha")return t;const F=briefFatos(per);
    if(F.feriado_hoje)t=t.replace(/(\.\s)/,`. Hoje é feriado: ${F.feriado_hoje}$1`);else if(F.proximo_feriado)t+=` Próximo feriado: ${F.proximo_feriado}.`;return t;};}catch(e){}

/* ---------- 8. VERSÍCULO DO DIA ---------- */
const VERS=[["O Senhor é o meu pastor; nada me faltará.","Salmos 23:1"],["Tudo posso naquele que me fortalece.","Filipenses 4:13"],["Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.","Salmos 37:5"],
 ["Não temas, porque eu sou contigo.","Isaías 41:10"],["Esforça-te e tem bom ânimo.","Josué 1:9"],["Os que esperam no Senhor renovarão as suas forças.","Isaías 40:31"],
 ["Buscai primeiro o Reino de Deus, e todas estas coisas vos serão acrescentadas.","Mateus 6:33"],["O choro pode durar uma noite, mas a alegria vem pela manhã.","Salmos 30:5"],
 ["Tudo tem o seu tempo determinado.","Eclesiastes 3:1"],["Confia no Senhor de todo o teu coração.","Provérbios 3:5"],["A mão dos diligentes enriquecerá.","Provérbios 10:4"],
 ["Consagra ao Senhor as tuas obras, e os teus planos serão estabelecidos.","Provérbios 16:3"],["Deleita-te no Senhor, e ele satisfará os desejos do teu coração.","Salmos 37:4"],
 ["Se Deus é por nós, quem será contra nós?","Romanos 8:31"],["Todas as coisas cooperam para o bem daqueles que amam a Deus.","Romanos 8:28"],
 ["Este é o dia que o Senhor fez; regozijemo-nos e alegremo-nos nele.","Salmos 118:24"],["A tua palavra é lâmpada para os meus pés e luz para o meu caminho.","Salmos 119:105"],
 ["Lança o teu cuidado sobre o Senhor, e ele te susterá.","Salmos 55:22"],["O meu Deus suprirá todas as vossas necessidades.","Filipenses 4:19"],
 ["Sede fortes e corajosos.","Deuteronômio 31:6"],["Tudo quanto fizerdes, fazei-o de todo o coração, como ao Senhor.","Colossenses 3:23"],
 ["Pedi, e dar-se-vos-á; buscai, e encontrareis.","Mateus 7:7"],["Deus não nos deu espírito de covardia, mas de poder, de amor e de moderação.","2 Timóteo 1:7"],
 ["Alegrai-vos sempre no Senhor.","Filipenses 4:4"],["O Senhor é a minha luz e a minha salvação; a quem temerei?","Salmos 27:1"],
 ["Grandes coisas fez o Senhor por nós, e por isso estamos alegres.","Salmos 126:3"],["Não vos canseis de fazer o bem.","Gálatas 6:9"],
 ["Aquele que começou a boa obra em vós há de completá-la.","Filipenses 1:6"],["O temor do Senhor é o princípio da sabedoria.","Provérbios 9:10"],
 ["Bem-aventurado o homem que confia no Senhor.","Jeremias 17:7"],["Em tudo dai graças.","1 Tessalonicenses 5:18"],["Vinde a mim, todos os que estais cansados, e eu vos aliviarei.","Mateus 11:28"],
 ["O amor jamais acaba.","1 Coríntios 13:8"],["Sede praticantes da palavra, e não somente ouvintes.","Tiago 1:22"],["Eu sou o caminho, a verdade e a vida.","João 14:6"],
 ["Quem anda com os sábios será sábio.","Provérbios 13:20"],["O Senhor pelejará por vós.","Êxodo 14:14"],["Renovai-vos no espírito do vosso entendimento.","Efésios 4:23"],
 ["Prossigo para o alvo.","Filipenses 3:14"],["As misericórdias do Senhor se renovam a cada manhã.","Lamentações 3:22-23"]];
const versDia=(d=TODAY())=>{const n=Math.floor(pd(d).getTime()/864e5);return VERS[((n%VERS.length)+VERS.length)%VERS.length];};
const _secAfirm48=secAfirm;secAfirm=function(){const h=_secAfirm48.apply(this,arguments);const[v,r]=versDia();
  return h.replace(/(<div class="afc"[^>]*>)/,`$1<div class="vers"><span class="tiny">${ic("book-heart")} Versículo do dia</span><p>“${esc(v)}”</p><b>${esc(r)}</b></div>`);};
ACT.versLer=()=>{const[v,r]=versDia();qualVoz(`${v} ${r.replace(":"," capítulo, versículo ")}.`);};

/* ---------- 5. DESCANSO ENTRE SÉRIES ---------- */
let DESC=null;
function descIniciar(seg){seg=+seg||lsGet("mu_desc",60);clearInterval(DESC&&DESC.t);DESC={fim:Date.now()+seg*1000,tot:seg,t:setInterval(descTick,250)};lsSet("mu_desc",seg);descTick();try{navigator.vibrate&&navigator.vibrate(30);}catch(e){}}
function descBip(){try{const C=new (window.AudioContext||window.webkitAudioContext)();[0,.25,.5].forEach(t=>{const o=C.createOscillator(),g=C.createGain();o.frequency.value=t<.5?880:1320;o.connect(g);g.connect(C.destination);g.gain.setValueAtTime(.18,C.currentTime+t);g.gain.exponentialRampToValueAtTime(.001,C.currentTime+t+.2);o.start(C.currentTime+t);o.stop(C.currentTime+t+.22);});setTimeout(()=>C.close(),1200);}catch(e){}}
function descTick(){let el=$("descp");if(!DESC){if(el)el.remove();return;}const r=Math.max(0,Math.ceil((DESC.fim-Date.now())/1000));
  if(!el){el=document.createElement("div");el.id="descp";el.className="descp";el.setAttribute("role","timer");document.body.appendChild(el);
    el.addEventListener("click",ev=>{const b=ev.target.closest("[data-dc]");if(!b)return;const a=b.dataset.dc;if(a==="x"){descParar();}else if(a==="+"){DESC.fim+=15000;DESC.tot+=15;descTick();}});}
  if(r<=0){clearInterval(DESC.t);DESC=null;try{navigator.vibrate&&navigator.vibrate([300,120,300,120,500]);}catch(e){}descBip();if(document.hidden)notify("Descanso acabou","Hora da próxima série.");
    el.className="descp fim";el.innerHTML=`${ic("flame")}<b>Bora, próxima série!</b>`;setTimeout(()=>{const x=$("descp");if(x&&!DESC)x.remove();},3500);return;}
  const p=1-r/DESC.tot;el.className="descp";el.style.setProperty("--p",p);
  el.innerHTML=`<span class="descr" aria-hidden="true"></span><span class="desct"><span class="tiny">Descanso</span><b>${Math.floor(r/60)}:${pad(r%60)}</b></span><button data-dc="+" aria-label="Mais 15 segundos">+15s</button><button data-dc="x" aria-label="Encerrar descanso">${ic("x")}</button>`;}
function descParar(){if(DESC)clearInterval(DESC.t);DESC=null;descTick();}
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&DESC)descTick();});
ACT.descGo=el=>descIniciar(+el.dataset.s);
const descBarra=()=>{const s=lsGet("mu_desc",60);return `<div class="descbar">${ic("timer")}<span>Descanso</span>${[45,60,90,120].map(x=>`<button class="chip ${x===s?"m":""}" data-a="descGo" data-s="${x}">${x<60?x+"s":x%60?Math.floor(x/60)+"min"+(x%60):x/60+" min"}</button>`).join("")}</div>`;};
const _trView48=treinosView;treinosView=function(){const h=_trView48.apply(this,arguments);return h.replace("</header>","</header>"+descBarra());};
/* no desafio, cada série marcada (menos a última) já começa o descanso */
const _desSerie48=ACT.desSerie;ACT.desSerie=el=>{const t=TODAY(),antes=desSer(desDados(),t).filter(Boolean).length;_desSerie48(el);const depois=desSer(desDados(),t).filter(Boolean).length;
  if(depois>antes&&depois<DES_SERIES)descIniciar(lsGet("mu_desc",60));};

/* ---------- 6. ÁGUA ---------- */
const aguaCfg=()=>{let a=DB.docs.get("agua");if(!a)a=single("agua",{on:false,meta:30,ml:100,ini:"08:00",fim:"21:00",int:90,log:{},v2:1});a.log=a.log||{};
  if(!a.v2){a.v2=1;if((+a.ml||250)===250&&(+a.meta||8)===8){a.ml=100;a.meta=30;}if(DB.docs.has("agua"))save(a);}return a;};
function aguaHoras(a){a=a||aguaCfg();const[h1,m1]=a.ini.split(":").map(Number),[h2,m2]=a.fim.split(":").map(Number);const L=[];for(let m=h1*60+m1;m<=h2*60+m2;m+=+a.int||90)L.push(pad(Math.floor(m/60))+":"+pad(m%60));return L;}
const aguaHoje=()=>+(aguaCfg().log[TODAY()]||0);
function secAgua(){const a=aguaCfg();if(!a.on)return `<button class="mini" style="--mc:#0284C7;margin-top:10px" data-a="aguaCfg"><span class="mini-i">${ic("droplet")}</span><span class="grow"><b>Água</b> · ativar lembretes ao longo do dia</span>${ic("chevron-right")}</button>`;
  const n=aguaHoje(),meta=+a.meta||30,ok=n>=meta,ml=+a.ml||100,L=v=>(v/1000).toLocaleString("pt-BR",{maximumFractionDigits:2});
  return `<div class="agua ${ok?"ok":""}"><button class="agua-i" data-a="aguaCfg" aria-label="Ajustar lembretes de água">${ic("droplet")}</button><div class="grow"><b>${ok?"Meta de água batida":"Água"}</b> <span class="tiny muted">${n} de ${meta} copos de ${ml} ml · ${L(n*ml)} de ${L(meta*ml)} L</span>
    ${meta<=12?`<div class="agua-c">${Array.from({length:meta},(_,i)=>`<i class="${i<n?"on":""}"></i>`).join("")}</div>`:`<div class="agua-b"><i style="width:${Math.min(100,Math.round(n/meta*100))}%"></i></div>`}</div>
    ${n?`<button class="ib" data-a="aguaMenos" aria-label="Tirar um copo" style="width:30px;height:30px">−</button>`:""}<div class="agua-bt"><button class="btn sm" data-a="aguaMais" aria-label="Bebi um copo">+1</button><button class="btn ghost sm" data-a="aguaMais" data-n="3" aria-label="Bebi três copos">+3</button></div></div>`;}
ACT.aguaMais=el=>{const a=aguaCfg(),t=TODAY(),k=+(el&&el.dataset&&el.dataset.n)||1,antes=+a.log[t]||0;a.log[t]=antes+k;save(a);try{navigator.vibrate&&navigator.vibrate(20);}catch(e){}if(antes<+a.meta&&a.log[t]>=+a.meta)toast("droplet","Meta de água batida!",a.meta+" copos hoje");rr();};
ACT.aguaMenos=()=>{const a=aguaCfg(),t=TODAY();a.log[t]=Math.max(0,(+a.log[t]||0)-1);save(a);rr();};
ACT.aguaCfg=()=>{const a=aguaCfg();sheet(`<div class="row"><span class="mb" style="--c1:#0284C7;--c2:#38BDF8">${ic("droplet")}</span><h2 class="grow" style="margin:0">Lembretes de água</h2></div>
   <div class="two"><label class="fld"><span>Meta por dia (copos)</span><input id="agM" type="number" inputmode="numeric" min="1" max="60" value="${a.meta}"></label>
   <div class="fld"><span>Tamanho do copo</span><div class="seg" data-k="agMl">${[100,200,250,300].map(v=>`<button type="button" data-a="seg" data-v="${v}" aria-pressed="${(+a.ml||100)===v}">${v} ml</button>`).join("")}</div></div></div>
   <div class="two"><label class="fld"><span>Primeiro aviso</span><input id="agI" type="time" value="${a.ini}"></label><label class="fld"><span>Último aviso</span><input id="agF" type="time" value="${a.fim}"></label></div>
   <div class="fld"><span>Avisar a cada</span><div class="seg" data-k="agInt">${[[60,"1 h"],[90,"1h30"],[120,"2 h"],[150,"2h30"]].map(([v,l])=>`<button type="button" data-a="seg" data-v="${v}" aria-pressed="${+a.int===v}">${l}</button>`).join("")}</div></div>
   <p class="tiny faint" id="agPrev" style="margin:8px 0 0"></p>
   <div class="btns"><button class="btn full" id="agS">${ic("check")} ${a.on?"Salvar":"Ativar lembretes"}</button>${a.on?`<button class="btn ghost full" id="agX">Desligar lembretes</button>`:""}</div>`,s=>{
    const prev=()=>{const tmp={...a,ini:s.querySelector("#agI").value||"08:00",fim:s.querySelector("#agF").value||"21:00",int:+segVal(s,"agInt")||90};const H=aguaHoras(tmp);const mt=parseInt(s.querySelector("#agM").value,10)||30,mlv=+segVal(s,"agMl")||100;s.querySelector("#agPrev").textContent=`Meta: ${mt} copos de ${mlv} ml = ${(mt*mlv/1000).toLocaleString("pt-BR")} L por dia. ${H.length} avisos: ${H.join(", ")}.`;};
    s.querySelectorAll("#agI,#agF,#agM").forEach(x=>x.addEventListener("change",prev));s.querySelectorAll('[data-k="agMl"] button').forEach(b=>b.addEventListener("click",()=>setTimeout(prev,0)));s.querySelectorAll('[data-k="agInt"] button').forEach(b=>b.addEventListener("click",()=>setTimeout(prev,0)));prev();
    s.querySelector("#agS").onclick=()=>{a.meta=Math.max(1,Math.min(60,parseInt(s.querySelector("#agM").value,10)||30));a.ml=+segVal(s,"agMl")||100;a.ini=s.querySelector("#agI").value||"08:00";a.fim=s.querySelector("#agF").value||"21:00";a.int=+segVal(s,"agInt")||90;a.on=true;save(a);closeSheet();rr();
      try{if(typeof notifOK==="function"&&!notifOK())enableNotif();}catch(e){}if(typeof pushAgendar==="function")pushAgendar();toast("droplet","Lembretes de água ligados",aguaHoras(a).length+" avisos por dia");};
    const x=s.querySelector("#agX");if(x)x.onclick=()=>{a.on=false;save(a);closeSheet();rr();if(typeof pushAgendar==="function")pushAgendar();};});};
const AGUA_FRASES=["Hora de um copo d'água 💧","Pausa rápida: beba água","Seu corpo agradece: um copo d'água","Hidrate-se para manter o foco","Um gole agora vale por três depois"];
/* com o app aberto (ou recém-fechado) o próprio app avisa; com os avisos do celular ligados, quem avisa é o servidor */
setInterval(()=>{try{if(!DB.be)return;const a=aguaCfg();if(!a.on)return;if(typeof pushLigado==="function"&&pushLigado()&&typeof pushPronto==="function"&&pushPronto())return;
  const now=new Date(),hm=pad(now.getHours())+":"+pad(now.getMinutes()),t=TODAY();if(!aguaHoras(a).includes(hm))return;const k="mu_agua_"+t+"_"+hm;if(lsGet(k,false))return;lsSet(k,true);
  if(aguaHoje()>=+a.meta)return;const f=AGUA_FRASES[now.getHours()%AGUA_FRASES.length];const por=Math.max(1,Math.ceil((+a.meta-aguaHoje())/Math.max(1,aguaHoras(a).filter(x=>x>=hm).length)));notify(f,`${aguaHoje()} de ${a.meta} copos hoje. Beba ${por} ${por===1?"copo":"copos"} agora.`);if(!document.hidden)toast("droplet",f,`${aguaHoje()} de ${a.meta} copos hoje`);}catch(e){}},30000);
/* avisos com o app fechado: água (todo dia) e aniversários (todo ano) entram na fila do servidor */
try{const _pf48=pushFila;pushFila=function(){const F=_pf48.apply(this,arguments),now=Date.now(),t=TODAY();const a=aguaCfg();
  if(a.on)aguaHoras(a).forEach((h,i)=>{let at=pushEm(t,h);if(at<=now)at=pushEm(addDays(t,1),h);const por=Math.max(1,Math.ceil((+a.meta||30)/aguaHoras(a).length));F.push({k:"agua_"+h.replace(":",""),at:Math.round(at),t:AGUA_FRASES[i%AGUA_FRASES.length],b:`Beba ${por} ${por===1?"copo":"copos"} agora (${(+a.ml||100)*por} ml). Meta: ${a.meta} por dia.`,rep:"d"});});
  all("ctt").forEach(c=>{if(!c.aniv)return;let d=t.slice(0,4)+"-"+c.aniv.slice(5,10);if(d<t)d=(+t.slice(0,4)+1)+"-"+c.aniv.slice(5,10);F.push({k:"aniv_"+c.id,at:pushEm(d,"08:30"),t:"Aniversário de "+c.nome,b:"Mande os parabéns pelo Moving Up.",rep:"y"});});
  return F;};}catch(e){}
const _secCheck48=secCheck;secCheck=function(){return _secCheck48.apply(this,arguments)+secAgua();};

/* ---------- 4. METAS DE POUPANÇA ---------- */
MODS.poup={n:"Metas de poupança",ic:"piggy-bank",c1:"#15803D",c2:"#4ADE80",g:2,v:{v:"poup"}};
(()=>{const g=MOD_GROUPS.find(x=>x[0]==="Dinheiro");if(g&&!g[1].includes("poup"))g[1].push("poup");})();
const poupLista=()=>all("poup").sort((a,b)=>(a.o||0)-(b.o||0));
const poupSaldo=p=>Math.round(sum((p.mov||[]).map(m=>+m.v||0))*100)/100;
function poupMes(p){if(!p.prazo)return 0;const falta=Math.max(0,(+p.alvo||0)-poupSaldo(p));const meses=Math.max(1,Math.ceil((pd(p.prazo)-pd(TODAY()))/864e5/30.4));return falta/meses;}
VIEWS.poup=()=>{const L=poupLista();let h=topbar("Metas de poupança","poup");const tot=sum(L.map(poupSaldo));
  if(L.length)h+=`<div class="card hero" ${mstyle("poup")}><span class="muted small">Guardado no total</span><b style="display:block;font:800 2rem var(--disp);color:var(--deep)">${money(tot)}</b><span class="small muted">${L.length} ${L.length===1?"meta":"metas"}</span></div>`;
  h+=L.length?L.map(p=>{const s=poupSaldo(p),al=+p.alvo||0,pc=al?Math.min(100,Math.round(s/al*100)):0,pm=poupMes(p);
    return `<div class="card poup ${pc>=100?"ok":""}" ${mstyle("poup")}><button class="poup-h" data-a="poupEd" data-id="${p.id}"><b class="grow">${esc(p.t)}</b><span class="chip ${pc>=100?"c":""}">${pc}%</span></button>
      <div class="row" style="margin-top:6px"><b style="font:800 1.35rem var(--disp)">${money(s)}</b><span class="small muted">de ${money(al)}</span></div><span class="bar" style="display:block;margin-top:8px"><i style="width:${pc}%"></i></span>
      <span class="tiny muted" style="display:block;margin-top:6px">${pc>=100?"Meta alcançada 🎉":`Falta ${money(Math.max(0,al-s))}${p.prazo?` · até ${fdate(p.prazo)} · guarde ${money(pm)} por mês`:""}`}</span>
      <div class="btns h" style="margin-top:10px"><button class="btn sm" data-a="poupMov" data-id="${p.id}" data-s="1">${ic("plus")} Guardar</button><button class="btn ghost sm" data-a="poupMov" data-id="${p.id}" data-s="-1">Retirar</button></div></div>`;}).join("")
    :empty("poup","Nenhuma meta ainda","Ex.: Reserva de emergência (6 meses de gastos), Casamento, Equipamento de fotografia.",`<button class="btn sm" data-a="poupNova">${ic("plus")} Criar meta</button>`);
  const med=typeof gastoMedio==="function"?gastoMedio():0;
  if(med&&!L.some(p=>/reserva|emerg/i.test(p.t)))h+=`<button class="mini" style="--mc:#15803D" data-a="poupReserva"><span class="mini-i">${ic("piggy-bank")}</span><span class="grow"><b>Sugestão:</b> reserva de emergência de ${money(med*6)} (6 meses dos seus gastos)</span>${ic("plus")}</button>`;
  return `<div class="app">${h}</div>${fab("poupNova","Nova meta")}`;};
ACT.poupNova=()=>poupForm(null);ACT.poupEd=el=>poupForm(getD(el.dataset.id));
ACT.poupReserva=()=>poupForm(null,{t:"Reserva de emergência",alvo:Math.round(gastoMedio()*6)});
function poupForm(p,pre){const v=p||pre||{};sheet(`<h2>${p?"Editar meta":"Nova meta de poupança"}</h2>
  <label class="fld"><span>Nome da meta</span><input id="ppT" value="${esc(v.t||"")}" placeholder="Ex.: Reserva de emergência"></label>
  <div class="two"><label class="fld"><span>Quanto quer juntar (R$)</span><input id="ppA" inputmode="decimal" value="${v.alvo?String(v.alvo).replace(".",","):""}"></label><label class="fld"><span>Até quando (opcional)</span><input id="ppD" type="date" value="${esc(v.prazo||"")}"></label></div>
  ${p?"":`<label class="fld"><span>Já tenho guardado (R$, opcional)</span><input id="ppJ" inputmode="decimal" placeholder="0,00"></label>`}
  ${p&&(p.mov||[]).length?`<div class="grp" style="margin-top:12px">Movimentos</div>${p.mov.slice().reverse().slice(0,12).map(m=>`<div class="row tiny" style="padding:6px 0;border-bottom:1px solid var(--line)"><span class="grow">${fdate(m.d)}${m.obs?" · "+esc(m.obs):""}</span><b class="${m.v>=0?"pos":"neg"}">${m.v>=0?"+":"−"} ${money(Math.abs(m.v))}</b></div>`).join("")}`:""}
  <div class="btns"><button class="btn full" id="ppS">${p?"Salvar":"Criar meta"}</button>${p?`<button class="btn danger full" id="ppX">Apagar meta</button>`:""}</div>`,s=>{
  s.querySelector("#ppS").onclick=()=>{const t=s.querySelector("#ppT").value.trim();const al=num(s.querySelector("#ppA").value);if(!t)return toast("triangle-alert","Dê um nome à meta","");if(!(al>0))return toast("triangle-alert","Informe quanto quer juntar","");
    const d=p||{id:"poup_"+nid(),c:"poup",o:Date.now(),mov:[]};d.t=t;d.alvo=al;d.prazo=s.querySelector("#ppD").value;const j=s.querySelector("#ppJ");if(j&&num(j.value)>0)d.mov.push({id:nid(),d:TODAY(),v:num(j.value),obs:"Saldo inicial"});save(d);closeSheet();rr();};
  const x=s.querySelector("#ppX");if(x)x.onclick=()=>confirmSheet("Apagar esta meta?",p.t,"Apagar",()=>{removeDoc(p.id);rr();});});}
ACT.poupMov=el=>{const p=getD(el.dataset.id),sg=+el.dataset.s;if(!p)return;sheet(`<h2>${sg>0?"Guardar em":"Retirar de"} ${esc(p.t)}</h2>
  <label class="fld"><span>Valor (R$)</span><input id="pmV" inputmode="decimal" placeholder="0,00" style="font:800 1.4rem var(--disp)"></label><label class="fld"><span>Observação (opcional)</span><input id="pmO" placeholder="${sg>0?"Ex.: parte do cachê":"Ex.: conserto do carro"}"></label>
  <div class="btns"><button class="btn full" id="pmS">${ic(sg>0?"plus":"minus")} ${sg>0?"Guardar":"Retirar"}</button></div>`,s=>{const i=s.querySelector("#pmV");setTimeout(()=>i.focus(),100);
  s.querySelector("#pmS").onclick=()=>{const v=num(i.value);if(!(v>0))return toast("triangle-alert","Informe o valor","");p.mov=p.mov||[];p.mov.push({id:nid(),d:TODAY(),v:sg*v,obs:s.querySelector("#pmO").value.trim()});save(p);closeSheet();rr();
    const pc=+p.alvo?Math.round(poupSaldo(p)/p.alvo*100):0;toast("piggy-bank",sg>0?`${money(v)} guardados`:`${money(v)} retirados`,`${p.t} · ${pc}%`);};});};

/* ---------- 7. FILA DE LEITURA ---------- */
MODS.fila={n:"Fila de leitura",ic:"book-open-check",c1:"#2563EB",c2:"#60A5FA",g:1,v:{v:"fila"}};
(()=>{const g=MOD_GROUPS.find(x=>x[0]==="Estudos e crescimento");if(g&&!g[1].includes("fila")){const i=g[1].indexOf("livros");g[1].splice(i<0?g[1].length:i,0,"fila");}})();
const filaLista=()=>all("fila").sort((a,b)=>(!!b.lendo-!!a.lendo)||(a.o||0)-(b.o||0));
VIEWS.fila=()=>{const L=filaLista(),lendo=L.filter(x=>x.lendo),prox=L.filter(x=>!x.lendo);let h=topbar("Fila de leitura","fila");
  h+=`<div class="qadd" style="margin:4px 0 12px"><input id="flI" placeholder="Livro que quer ler" data-enter="filaAdd" aria-label="Título do livro"><button class="btn" data-a="filaAdd" aria-label="Adicionar">${ic("plus")}</button></div>`;
  if(lendo.length)h+=`<div class="grp">Lendo agora</div>`+lendo.map(x=>`<div class="item fila lendo" ${mstyle("fila")}><span class="mb">${ic("book-open")}</span><button class="ibody" data-a="filaEd" data-id="${x.id}"><b>${esc(x.t)}</b><span class="tiny faint" style="display:block">${x.autor?esc(x.autor)+" · ":""}desde ${fdate(x.ini||TODAY())}</span></button><button class="btn sm" data-a="filaFim" data-id="${x.id}">${ic("check")} Terminei</button></div>`).join("");
  h+=prox.length?`<div class="grp">Próximos <span class="chip">${prox.length}</span></div>`+prox.map((x,i)=>`<div class="item fila" ${mstyle("fila")}><span class="fila-n">${i+1}</span><button class="ibody" data-a="filaEd" data-id="${x.id}"><b>${esc(x.t)}</b>${x.autor?`<span class="tiny faint" style="display:block">${esc(x.autor)}</span>`:""}</button>
      <div class="fila-a">${i>0?`<button class="ib" data-a="filaMv" data-id="${x.id}" data-d="-1" aria-label="Subir">${ic("chevron-up")}</button>`:""}${i<prox.length-1?`<button class="ib" data-a="filaMv" data-id="${x.id}" data-d="1" aria-label="Descer">${ic("chevron-down")}</button>`:""}<button class="ib" data-a="filaLer" data-id="${x.id}" aria-label="Começar a ler">${ic("play")}</button></div></div>`).join("")
    :!lendo.length?empty("fila","Sua fila está vazia","Anote os livros que quer ler e organize pela prioridade. O primeiro da lista é o próximo.",""):"";
  h+=`<button class="mini" style="--mc:var(--deep)" data-a="go" data-v="${gv({v:"list",k:"livros"})}"><span class="mini-i">${ic("library")}</span><span class="grow"><b>Livros lidos</b> · ${all("livros").length}</span>${ic("chevron-right")}</button>`;
  return `<div class="app">${h}</div>`;};
ACT.filaAdd=()=>{const i=$("flI");const v=i.value.trim();if(!v)return i.focus();const[t,autor]=v.split(/\s+[-–—]\s+/);const o=Math.max(0,...all("fila").map(x=>x.o||0))+1;save({id:"fila_"+nid(),c:"fila",t:t.trim(),autor:(autor||"").trim(),o});rr();const n=$("flI");if(n)n.focus();};
ACT.filaMv=el=>{const P=filaLista().filter(x=>!x.lendo),i=P.findIndex(x=>x.id===el.dataset.id),j=i+ +el.dataset.d;if(i<0||j<0||j>=P.length)return;const a=P[i],b=P[j],t=a.o||0;a.o=b.o||0;b.o=t;if(a.o===b.o)a.o+= +el.dataset.d;save(a);save(b);rr();};
ACT.filaLer=el=>{const x=getD(el.dataset.id);if(!x)return;x.lendo=true;x.ini=TODAY();save(x);rr();toast("book-open","Boa leitura!",x.t);};
ACT.filaEd=el=>{const x=getD(el.dataset.id);if(!x)return;sheet(`<h2>${esc(x.t)}</h2><label class="fld"><span>Título</span><input id="fT" value="${esc(x.t)}"></label><label class="fld"><span>Autor(a)</span><input id="fA" value="${esc(x.autor||"")}"></label>
  <div class="btns"><button class="btn full" id="fS">Salvar</button>${x.lendo?`<button class="btn ghost full" id="fP">Voltar para a fila</button>`:`<button class="btn ghost full" id="fL">${ic("play")} Começar a ler</button>`}<button class="btn danger full" id="fX">Tirar da fila</button></div>`,s=>{
  s.querySelector("#fS").onclick=()=>{x.t=s.querySelector("#fT").value.trim()||x.t;x.autor=s.querySelector("#fA").value.trim();save(x);closeSheet();rr();};
  const p=s.querySelector("#fP");if(p)p.onclick=()=>{x.lendo=false;x.o=Math.min(0,...all("fila").map(z=>z.o||0))-1;save(x);closeSheet();rr();};
  const l=s.querySelector("#fL");if(l)l.onclick=()=>{x.lendo=true;x.ini=TODAY();save(x);closeSheet();rr();};
  s.querySelector("#fX").onclick=()=>{removeDoc(x.id);closeSheet();rr();};});};
ACT.filaFim=el=>{const x=getD(el.dataset.id);if(!x)return;sheet(`<h2>${ic("party")} Terminou ${esc(x.t)}!</h2><div class="fld"><span>Avaliação</span><div class="seg" data-k="fN">${[1,2,3,4,5].map(n=>`<button type="button" data-a="seg" data-v="${n}" aria-pressed="${n===5}">${"★".repeat(n)}</button>`).join("")}</div></div>
  <label class="fld"><span>O que ficou (opcional)</span><textarea id="fR" rows="4" placeholder="Ideias, frases, aprendizados"></textarea></label><div class="btns"><button class="btn full" id="fOk">${ic("check")} Guardar em Livros lidos</button></div>`,s=>{
  s.querySelector("#fOk").onclick=()=>{save({id:"livros_"+nid(),c:"livros",t:x.t,autor:x.autor||"",fim:TODAY(),ano:TODAY().slice(0,4),nota:+segVal(s,"fN")||5,res:s.querySelector("#fR").value.trim()});removeDoc(x.id);closeSheet();rr();toast("library","Livro guardado em Livros lidos",x.t);};});};
const _list48=VIEWS.list;VIEWS.list=function(){const h=_list48.apply(this,arguments);if(VIEW.k!=="livros")return h;const n=all("fila").length,l=all("fila").find(x=>x.lendo);
  return h.replace("</header>",`</header><button class="mini" style="--mc:#2563EB;margin:4px 0 12px" data-a="go" data-v="${gv({v:"fila"})}"><span class="mini-i">${ic("book-open-check")}</span><span class="grow"><b>Fila de leitura</b> · ${l?"lendo "+esc(l.t):n?n+" na fila":"organize o que quer ler"}</span>${ic("chevron-right")}</button>`);};

/* ---------- 2. COMPARAÇÕES COM GRÁFICO ---------- */
function barrasSVG(G,fmt){/* G=[{l,a,b}] a=este mês, b=mês passado */const W=320,lh=34,H=G.length*lh+8,mx=Math.max(1,...G.map(g=>Math.max(g.a,g.b))),x0=96,bw=W-x0-8;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Comparação por categoria" style="display:block;margin-top:8px">${G.map((g,i)=>{const y=i*lh+4;
    return `<text x="0" y="${y+14}" font-size="11" font-weight="700" fill="currentColor">${esc(g.l.slice(0,14))}</text>
    <rect x="${x0}" y="${y+2}" width="${Math.max(2,g.a/mx*bw)}" height="11" rx="3" fill="var(--c1)"/><rect x="${x0}" y="${y+16}" width="${Math.max(2,g.b/mx*bw)}" height="9" rx="3" fill="var(--c1)" opacity=".3"/>
    <text x="${Math.min(W-2,x0+Math.max(2,g.a/mx*bw)+4)}" y="${y+12}" font-size="9.5" font-weight="700" fill="currentColor" ${g.a/mx>.7?'text-anchor="end" dx="-8" fill="#fff"':""}>${fmt(g.a)}</text>`;}).join("")}</svg>`;}
function compGastos(){const t=TODAY(),ym=t.slice(0,7),ant=ymAdd(ym,-1),dia=t.slice(8);const E=all("exp");
  const ateDia=(m)=>E.filter(e=>(e.d||"").startsWith(m)&&(e.d||"").slice(8)<=dia);const tA=sum(ateDia(ym).map(e=>+e.v||0)),tB=sum(ateDia(ant).map(e=>+e.v||0)),tBT=sum(E.filter(e=>(e.d||"").startsWith(ant)).map(e=>+e.v||0));
  const cat={};ateDia(ym).forEach(e=>{const c=e.cat||"Outros";(cat[c]=cat[c]||{l:c,a:0,b:0}).a+=+e.v||0;});ateDia(ant).forEach(e=>{const c=e.cat||"Outros";(cat[c]=cat[c]||{l:c,a:0,b:0}).b+=+e.v||0;});
  const G=Object.values(cat).sort((x,y)=>Math.max(y.a,y.b)-Math.max(x.a,x.b)).slice(0,6);const dif=tA-tB,pc=tB?Math.round(dif/tB*100):null;
  const sub=G.filter(g=>g.a>g.b).sort((x,y)=>(y.a-y.b)-(x.a-x.b))[0],des=G.filter(g=>g.b>g.a).sort((x,y)=>(y.b-y.a)-(x.b-x.a))[0];
  const frase=!tB&&!tA?(tBT?`Até o dia ${+dia} ainda não há gastos registrados neste mês nem no mesmo período de ${MESES[+ant.slice(5)-1].toLowerCase()}. ${MESES[+ant.slice(5)-1]} inteiro fechou em ${moneyRaw(tBT)}.`:"Ainda não há gastos para comparar."):`Até o dia ${+dia}, você gastou ${moneyRaw(tA)} neste mês, contra ${moneyRaw(tB)} no mesmo período do mês passado: ${dif>0?`${pc!=null?pc+"% ":""}a mais`:dif<0?`${pc!=null?Math.abs(pc)+"% ":""}a menos`:"igual"}.${sub?` O que mais subiu foi ${sub.l} (+${moneyRaw(sub.a-sub.b)}).`:""}${des?` O que mais caiu foi ${des.l}.`:""}`;
  return{frase,html:`<div class="comp" ${mstyle("gastos")}><div class="relst"><div><b class="${dif>0?"neg":"pos"}">${money(tA)}</b><span>${MESES[+ym.slice(5)-1]} até dia ${+dia}</span></div><div><b>${money(tB)}</b><span>${MESES[+ant.slice(5)-1]} até dia ${+dia}</span></div><div><b>${money(tBT)}</b><span>${MESES[+ant.slice(5)-1]} inteiro</span></div></div>
    ${G.length?barrasSVG(G,v=>DISCRETO?"•••":"R$ "+Math.round(v).toLocaleString("pt-BR"))+`<div class="tiny faint" style="margin-top:4px"><span class="leg" style="background:var(--c1)"></span> este mês <span class="leg" style="background:var(--c1);opacity:.3;margin-left:10px"></span> mês passado (mesmo período)</div>`:""}</div>`};}
function compTreinos(){const t=TODAY(),ym=t.slice(0,7),ant=ymAdd(ym,-1),dia=t.slice(8);const c=(k,m)=>all("trk").filter(x=>x.k===k&&x.d.startsWith(m)&&x.d.slice(8)<=dia).length;
  const G=[["cap","Capoeira"],["gym","Academia"],["des","Desafio"],["kegel","Kegel"],["run","Corrida"]].map(([k,l])=>({l,a:c(k,ym),b:c(k,ant)})).filter(g=>g.a||g.b);const tA=sum(G.map(g=>g.a)),tB=sum(G.map(g=>g.b));
  return{frase:G.length?`Até o dia ${+dia}: ${tA} treinos neste mês e ${tB} no mesmo período do mês passado. ${tA>tB?"Você está treinando mais.":tA<tB?"Está um pouco abaixo do mês passado.":"Mesmo ritmo."}`:"Ainda não há treinos registrados para comparar.",
    html:G.length?`<div class="comp" ${mstyle("gym")}>${barrasSVG(G,v=>String(v))}<div class="tiny faint" style="margin-top:4px"><span class="leg" style="background:var(--c1)"></span> este mês <span class="leg" style="background:var(--c1);opacity:.3;margin-left:10px"></span> mês passado</div></div>`:""};}
function compMostrar(tipo){const C=tipo==="treino"?compTreinos():compGastos();sheet(`<div class="row"><span class="mb" ${mstyle("jarvis")}>${ic("bar-chart")}</span><h2 class="grow" style="margin:0">${tipo==="treino"?"Treinos":"Gastos"}: este mês × mês passado</h2><button class="ib" data-a="jarCalar" aria-label="Parar a voz">${ic("volume-x")}</button></div>
  <div class="jara" style="margin-top:12px">${esc(C.frase)}</div>${C.html}<div class="btns"><button class="btn ghost full" data-a="close">Ok</button></div>`);qualVoz(C.frase);}
ACT.compGastos=()=>compMostrar("gasto");

/* ---------- 1. ÁUDIO VIRA TAREFAS ---------- */
let DESP=null;
function despAbrir(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;DESP={txt:"",inter:"",rec:null,ouvindo:false,ini:Date.now()};
  sheet(`<div class="row"><span class="mb" ${mstyle("jarvis")}>${ic("audio-lines")}</span><h2 class="grow" style="margin:0">Fale tudo de uma vez</h2></div>
   <p class="small muted" style="margin:8px 0 0">Até uns 2 minutos, do jeito que vier à cabeça. Ex.: <i>“preciso mandar o orçamento pra Ana amanhã, reunião com a secretaria sexta às 10, ideia de fazer um ensaio na praia”</i>. O Jarvis separa em tarefas, compromissos e anotações.</p>
   ${SR?`<div class="micw"><button class="mic on" id="dsM" aria-label="Pausar">${ic("mic")}</button></div><div class="tiny faint" id="dsS" style="text-align:center">Ouvindo…</div>`:""}
   <label class="fld"><span>${SR?"O que foi entendido (dá para corrigir)":"Escreva ou cole o texto"}</span><textarea id="dsT" rows="6" placeholder="O que você falar aparece aqui"></textarea></label>
   <div class="btns"><button class="btn full" id="dsOk">${ic("sparkles")} Separar</button><button class="btn ghost full" data-a="close">Cancelar</button></div>`,s=>{
    const T=s.querySelector("#dsT");
    const ligar=()=>{if(!SR)return;const r=new SR();r.lang="pt-BR";r.continuous=true;r.interimResults=true;DESP.rec=r;DESP.ouvindo=true;
      r.onresult=e=>{let inter="";for(let i=e.resultIndex;i<e.results.length;i++){const x=e.results[i][0].transcript;if(e.results[i].isFinal){DESP.txt+=(DESP.txt?" ":"")+x.trim()+".";}else inter+=x;}DESP.inter=inter;T.value=(DESP.txt+(inter?" "+inter:"")).trim();T.scrollTop=T.scrollHeight;};
      r.onend=()=>{if(DESP&&DESP.ouvindo&&Date.now()-DESP.ini<150000&&$("dsT"))try{r.start();}catch(e){}else despParouUI();};r.onerror=e=>{if(e.error==="not-allowed"){DESP.ouvindo=false;despParouUI();}};try{r.start();}catch(e){}};
    T.addEventListener("input",()=>{if(DESP){DESP.txt=T.value;DESP.inter="";}});
    const m=s.querySelector("#dsM");if(m)m.onclick=()=>{if(DESP.ouvindo){DESP.ouvindo=false;try{DESP.rec.stop();}catch(e){}despParouUI();}else{DESP.ini=Date.now();ligar();m.classList.add("on");$("dsS").textContent="Ouvindo…";}};
    s.querySelector("#dsOk").onclick=()=>{const txt=T.value.trim();if(DESP){DESP.ouvindo=false;try{DESP.rec&&DESP.rec.stop();}catch(e){}}if(!txt)return toast("mic","Fale ou escreva algo primeiro","");despSeparar(txt);};
    ligar();});}
function despParouUI(){const m=$("dsM"),s=$("dsS");if(m)m.classList.remove("on");if(s)s.textContent="Pausado. Toque no microfone para continuar.";}
const despLimpa=t=>{t=String(t||"").trim().replace(/^(e |entao |então |tambem |também |depois |ah |ai |aí )+/i,"").replace(/^(eu )?(preciso|tenho que|tenho de|vou|devo|quero|nao posso esquecer de|não posso esquecer de)\s+/i,"").trim();return t?t.charAt(0).toUpperCase()+t.slice(1).replace(/[.,;]+$/,""):"";};
function despLocal(txt){const P=txt.split(/[.!?\n;]+|,\s*(?=(?:e\s+)?(?:depois|tamb[eé]m|al[eé]m disso|preciso|tenho que|vou|ideia|reuni|marca))|\s+e depois\s+|\s+al[eé]m disso\s+/i).map(s=>s.trim()).filter(s=>s.length>2);
  const R={tarefas:[],compromissos:[],anotacoes:[]};
  P.forEach(p=>{const n=normTxt(p);let q={};try{q=parseQuando(p)||{};}catch(e){}
    if(/^(ideia|anota(r|cao)?|nota|lembrar que|observa|pensei|insight)/.test(n)||(/ideia/.test(n)&&!/(preciso|tenho que)/.test(n))){R.anotacoes.push({t:despLimpa(p.replace(/^(ideia( de)?|anota(r)?( que)?|nota|lembrar que|observa[cç][aã]o|pensei( em)?)\s*:?\s*/i,"")).slice(0,60),texto:p});return;}
    if(q.h||/\b(reuniao|consulta|ensaio|aula|encontro|gravacao|evento|apresentacao|show|roda|batizado|entrevista|viagem)\b/.test(n)&&(q.d||q.h)){let t=p;try{t=stripTime(p);}catch(e){}R.compromissos.push({t:despLimpa(t),data:q.d||TODAY(),hora:q.h||""});return;}
    let t=p;if(q.d){try{t=stripTime(p);}catch(e){}}R.tarefas.push({t:despLimpa(t),data:q.d||TODAY()});});
  R.tarefas=R.tarefas.filter(x=>x.t);R.compromissos=R.compromissos.filter(x=>x.t);R.anotacoes=R.anotacoes.filter(x=>x.t);return R;}
async function despIA(txt){const hoje=new Date();const r=await Promise.race([aiGenerate([{text:`Hoje é ${DIAS[hoje.getDay()]}, ${TODAY()}, ${pad(hoje.getHours())}:${pad(hoje.getMinutes())}. A pessoa falou livremente. Separe em:
- tarefas: coisas a fazer (verbo no infinitivo, curto). data = dia em que deve fazer (YYYY-MM-DD; hoje se não disser).
- compromissos: algo com dia ou hora marcada com outras pessoas ou lugar (reunião, consulta, gravação, evento). data, hora (HH:MM ou vazio), ate (último dia, se durar vários dias, ou vazio).
- anotacoes: ideias, pensamentos e informações para guardar. t = título curto, texto = a ideia completa.
Não invente nada. Datas relativas (amanhã, sexta, dia 12) viram datas reais. Responda só JSON: {"tarefas":[{"t":"","data":""}],"compromissos":[{"t":"","data":"","hora":"","ate":""}],"anotacoes":[{"t":"","texto":""}]}
Fala: ${txt}`}],{max:900}),new Promise((_,j)=>setTimeout(()=>j(new Error("tempo")),20000))]);
  const J=JSON.parse(String(r).replace(/```json|```/g,"").trim());return{tarefas:(J.tarefas||[]).filter(x=>x&&x.t),compromissos:(J.compromissos||[]).filter(x=>x&&x.t),anotacoes:(J.anotacoes||[]).filter(x=>x&&(x.t||x.texto))};}
async function despSeparar(txt){sheet(`<h2>${ic("sparkles")} Separando…</h2><div class="mict" style="text-align:left">${esc(txt.slice(0,300))}${txt.length>300?"…":""}</div><div class="gf-load"><i></i></div>`);
  let R=null,via="local";if(temIA()){try{R=await despIA(txt);via="ia";}catch(e){console.warn("despejo IA",e);}}if(!R||!(R.tarefas.length+R.compromissos.length+R.anotacoes.length))R=despLocal(txt);
  const I=[];R.tarefas.forEach(x=>I.push({k:"t",t:x.t,data:/^\d{4}-\d{2}-\d{2}$/.test(x.data||"")?x.data:TODAY(),on:true}));
  R.compromissos.forEach(x=>I.push({k:"c",t:x.t,data:/^\d{4}-\d{2}-\d{2}$/.test(x.data||"")?x.data:TODAY(),hora:x.hora||"",ate:x.ate||"",on:true}));
  R.anotacoes.forEach(x=>I.push({k:"n",t:x.t||String(x.texto).slice(0,50),texto:x.texto||x.t,on:true}));
  DESP={itens:I,txt,via};despRevisar();}
const DESP_TIPO={t:["Tarefa","list-checks"],c:["Compromisso","calendar-days"],n:["Anotação","notebook-pen"]};
function despRevisar(){const I=DESP.itens;if(!I.length){sheet(`<h2>Nada para separar</h2><p class="muted">Não encontrei tarefas, compromissos ou anotações nessa fala.</p><div class="btns"><button class="btn full" data-a="despNovo">${ic("mic")} Tentar de novo</button></div>`);return;}
  const quando=x=>x.k==="n"?"":x.data===TODAY()?"hoje":x.data===addDays(TODAY(),1)?"amanhã":fdate(x.data).slice(0,5);
  const grupo=k=>{const L=I.map((x,i)=>({x,i})).filter(o=>o.x.k===k);if(!L.length)return"";
    return `<div class="grp" style="margin-top:14px">${ic(DESP_TIPO[k][1])} ${DESP_TIPO[k][0]}s <span class="chip">${L.length}</span></div>${L.map(({x,i})=>`<div class="mit desp ${x.on?"":"off"}"><button class="ck ${x.on?"on":""}" data-a="despOn" data-i="${i}" aria-label="${x.on?"Não salvar":"Salvar"}">${ic("check")}</button>
      <input class="grow despin" data-i="${i}" value="${esc(x.t)}" aria-label="Texto">${x.k!=="n"?`<span class="chip">${quando(x)}${x.hora?" "+x.hora:""}</span>`:""}<button class="ib" data-a="despTipo" data-i="${i}" aria-label="Mudar tipo" title="Mudar tipo" style="width:32px;height:32px">${ic("repeat")}</button></div>`).join("")}`;};
  const n=I.filter(x=>x.on).length;
  sheet(`<div class="row"><span class="mb" ${mstyle("jarvis")}>${ic("sparkles")}</span><h2 class="grow" style="margin:0">Confira antes de salvar</h2></div><p class="tiny faint" style="margin:6px 0 0">${DESP.via==="ia"?"Separado pela IA.":"Separado no aparelho."} Toque no texto para corrigir e em ${ic("repeat")} para mudar o tipo.</p>
   ${grupo("t")}${grupo("c")}${grupo("n")}
   <div class="btns"><button class="btn full" data-a="despSalvar" ${n?"":"disabled"}>${ic("check")} Salvar ${n} ${n===1?"item":"itens"}</button><button class="btn ghost full" data-a="despNovo">${ic("mic")} Falar de novo</button></div>`,s=>{
    s.querySelectorAll(".despin").forEach(inp=>inp.addEventListener("input",()=>{DESP.itens[+inp.dataset.i].t=inp.value;}));});}
ACT.despOn=el=>{const x=DESP.itens[+el.dataset.i];x.on=!x.on;despRevisar();};
ACT.despTipo=el=>{const x=DESP.itens[+el.dataset.i];x.k=x.k==="t"?"c":x.k==="c"?"n":"t";if(x.k==="n")x.texto=x.texto||x.t;if(x.k!=="n"&&!x.data)x.data=TODAY();despRevisar();};
ACT.despNovo=()=>despAbrir();
ACT.despSalvar=()=>{const I=DESP.itens.filter(x=>x.on&&String(x.t).trim());const c={t:0,c:0,n:0};
  I.forEach(x=>{const t=String(x.t).trim();if(x.k==="t"){const o=Math.max(0,...all("todo").filter(z=>z.d===x.data).map(z=>z.o||0))+1;save({id:"todo_"+nid(),c:"todo",t,d:x.data,dias:[x.data],ok:false,o});}
    else if(x.k==="c"){save({id:"ev_"+nid(),c:"ev",t,d:x.data,h:x.hora||"",ate:x.ate&&x.ate>x.data?x.ate:"",cat:"trab"});}
    else save({id:"notas_"+nid(),c:"notas",t,texto:x.texto&&x.texto!==t?x.texto:""});c[x.k]++;});
  DESP=null;closeSheet();rr();toast("sparkles","Tudo organizado",[c.t?c.t+(c.t===1?" tarefa":" tarefas"):"",c.c?c.c+(c.c===1?" compromisso":" compromissos"):"",c.n?c.n+(c.n===1?" anotação":" anotações"):""].filter(Boolean).join(" · "));};
ACT.despAbrir=()=>despAbrir();
/* atalho no cartão de tarefas */
const _secTodo48=secTodo;secTodo=function(){const h=_secTodo48.apply(this,arguments);
  return h.replace(/(<button class="lk" data-a="go" data-v="[^"]*todo[^"]*">Produtividade<\/button>)/,`<button class="lk despb" data-a="despAbrir" aria-label="Falar e separar em tarefas">${ic("mic")} Falar</button>$1`);};

/* ---------- Jarvis entende as novidades ---------- */
const _rota48=rotaNova;rotaNova=function(txt){const n=normTxt(txt).replace(/^(jarvis|ei jarvis|ok jarvis)[,\s]*/,"").trim();
  if(/(gastei|gasto|gastos|gastando).{0,40}(mes passado|mes anterior|outro mes)|compar.{0,20}gasto/.test(n)){compMostrar("gasto");return true;}
  if(/(treinei|treino|treinos|treinando).{0,40}(mes passado|mes anterior)|compar.{0,20}trein/.test(n)){compMostrar("treino");return true;}
  if(/^(vou falar tudo|despejar|organiza (o que eu|isso)|anota tudo|separa (pra mim|em tarefas))/.test(n)){despAbrir();return true;}
  if(/versiculo/.test(n)){const[v,r]=versDia();jarResp("Versículo do dia",`${v} ${r}`);return true;}
  if(/(proximo|quando e o proximo) feriado|e feriado hoje|feriado amanha/.test(n)){const f=feriado(TODAY()),p=proxFeriado();jarResp("Feriados",f?`Hoje é ${f.n} (${ferTipo[f.t].toLowerCase()}).`:p?`O próximo feriado é ${p.n}, ${quandoTxt(p.d)} (${fdate(p.d).slice(0,5)}).`:"Nenhum feriado nos próximos meses.");return true;}
  let m=n.match(/(?:guardei|depositei|poupei|coloquei|separei)\s*(?:r\$\s*)?([\d.,]+)\s*(?:reais)?\s*(?:na|no|para a|para o|pra|pro)\s+(.+)/);
  if(m&&all("poup").length){const v=num(m[1]);const p=achar(all("poup"),x=>x.t,m[2])||(all("poup").length===1?all("poup")[0]:null);
    if(p&&v>0){p.mov=p.mov||[];p.mov.push({id:nid(),d:TODAY(),v,obs:"Pelo Jarvis"});save(p);rr();const pc=+p.alvo?Math.round(poupSaldo(p)/p.alvo*100):0;jarResp("Poupança",`${moneyRaw(v)} guardados em ${p.t}. Agora você está em ${pc}% da meta.`);return true;}}
  if(/(bebi|tomei) (um |1 )?(copo de )?agua/.test(n)){ACT.aguaMais();jarResp("Água",`Anotado: ${aguaHoje()} de ${aguaCfg().meta} copos hoje.`);return true;}
  return _rota48(txt);};
