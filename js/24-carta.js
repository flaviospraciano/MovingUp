"use strict";
/* ======================================================================
   CARTAS PARA O FUTURO · escreva agora, leia na data escolhida
   A carta fica selada: não dá para ler antes do dia da entrega.
   Dados: c:"carta" {texto,escrita,entrega,ocasiao,aberta,abertaEm}
   ====================================================================== */
MODS.carta={n:"Cartas para o futuro",ic:"mail",c1:"#BE185D",c2:"#F472B6",g:4,v:{v:"carta"}};
const cartasChegaram=()=>all("carta").filter(c=>!c.aberta&&c.entrega<=TODAY()).sort((a,b)=>a.entrega.localeCompare(b.entrega));
function cartaFalta(d){const n=diasAte(d);return n<=0?"chegou":n===1?"chega amanhã":n<60?`chega em ${n} dias`:n<730?`chega em ${Math.round(n/30)} meses`:`chega em ${Math.round(n/365)} anos`;}

VIEWS.carta=()=>{const L=all("carta"),t=TODAY();let h=topbar("Cartas para o futuro","carta");
  if(!L.length)return `<div class="app">${h}${empty("carta","Escreva para quem você vai ser","O que você espera ter conquistado? O que não quer esquecer? A carta fica selada até a data que você escolher.",`<button class="btn sm" data-a="cartaNova">${ic("notebook-pen")} Escrever uma carta</button>`)}</div>`;
  const che=cartasChegaram(),cam=L.filter(c=>c.entrega>t).sort((a,b)=>a.entrega.localeCompare(b.entrega)),lid=L.filter(c=>c.aberta).sort((a,b)=>(b.abertaEm||"").localeCompare(a.abertaEm||""));
  if(che.length)h+=`<div class="grp">Chegaram<span class="chip">${che.length}</span></div>`+che.map(c=>`<button class="card ctac cartac" data-a="cartaAbrir" data-id="${c.id}"><b>${ic("mail-open")} Carta escrita em ${fdate(c.escrita)}</b><span class="small muted">${c.ocasiao?esc(c.ocasiao)+" · ":""}Toque para abrir.</span></button>`).join("");
  if(cam.length)h+=`<div class="grp">A caminho<span class="chip">${cam.length}</span></div>`+cam.map(c=>`<div class="item"><span class="mb">${ic("lock")}</span><button class="ibody" data-a="cartaSelada" data-id="${c.id}"><b>${c.ocasiao?esc(c.ocasiao):"Carta de "+fdate(c.escrita)}</b><span class="tiny faint">Selada · ${cartaFalta(c.entrega)}, ${fdate(c.entrega)}</span></button></div>`).join("");
  if(lid.length)h+=`<div class="grp">Lidas<span class="chip">${lid.length}</span></div>`+lid.map(c=>`<div class="item"><span class="mb" style="background:var(--sf3);color:var(--soft)">${ic("mail-open")}</span><button class="ibody" data-a="cartaAbrir" data-id="${c.id}"><b>${c.ocasiao?esc(c.ocasiao):"Carta de "+fdate(c.escrita)}</b><span class="tiny faint">Escrita em ${fdate(c.escrita)} · lida em ${fdate(c.abertaEm)}</span></button></div>`).join("");
  return `<div class="app">${h}</div>${fab("cartaNova","Escrever carta")}`;};

ACT.cartaNova=()=>cartaForm();
ACT.cartaAbrir=el=>{const c=getD(el.dataset.id);if(!c)return;if(c.entrega>TODAY())return ACT.cartaSelada(el);
  if(!c.aberta){c.aberta=true;c.abertaEm=TODAY();save(c);}
  const dias=-diasAte(c.escrita);
  openReader({title:"Carta para o futuro",long:true,items:[{t:`De você, ${dias>=365?"há "+Math.round(dias/365*10)/10+" ano"+(dias>=730?"s":""):"há "+dias+" dias"} (${fdate(c.escrita)})`,texto:c.texto}]});};
ACT.cartaSelada=el=>{const c=getD(el.dataset.id);
  sheet(`<div style="text-align:center"><span class="mb" style="margin:6px auto 10px;width:56px;height:56px;border-radius:16px;font-size:1.5rem" ${mstyle("carta")}>${ic("lock")}</span><h2>Carta selada</h2>
   <p class="muted">Escrita em ${fdate(c.escrita)}. Ela ${cartaFalta(c.entrega).replace("chega","abre")}, em ${esc(flong(c.entrega).toLowerCase())}.</p></div>
   <label class="fld"><span>Mudar a data de entrega</span><input id="caD" type="date" value="${c.entrega}" min="${addDays(TODAY(),1)}"></label>
   <div class="btns"><button class="btn full" id="caS">Salvar data</button><button class="btn danger full" id="caX">Apagar carta</button></div>`,s=>{
  s.querySelector("#caS").onclick=()=>{const d=s.querySelector("#caD").value;if(!d||d<=TODAY())return toast("triangle-alert","Escolha uma data futura","");c.entrega=d;save(c);closeSheet();rr();toast("lock","Nova data de entrega",fdate(d));};
  s.querySelector("#caX").onclick=()=>confirmSheet("Apagar sem ler?","A carta será apagada para sempre.","Apagar",()=>{removeDoc(c.id);rr();});});};
function cartaForm(){const ci=typeof cicAberto==="function"?cicAberto():null,t=TODAY();
  const ops=[];if(ci&&cicFim(ci)>t)ops.push(["ciclo","Fim do ciclo",addDays(cicFim(ci),1),"Fim do "+ci.nome]);
  ops.push(["6m","Em 6 meses",iso(new Date(pd(t).setMonth(pd(t).getMonth()+6))),""],["1a","Em 1 ano",addDays(t,365),""],["outra","Outra data","",""]);
  sheet(`<h2>Carta para o futuro</h2><p class="muted small" style="margin:4px 0 0">Conte como está hoje, o que espera ter conquistado e o que não quer esquecer.</p>
   <label class="fld"><span>Sua carta</span><textarea id="caT" class="tall" placeholder="Oi, eu do futuro…" autofocus></textarea></label>
   <div class="fld"><span>Quando entregar</span><div class="seg" data-k="caQ">${ops.map(([k,n,d,o],i)=>`<button type="button" data-a="cartaQuando" data-v="${k}" data-d="${d}" data-o="${esc(o)}" aria-pressed="${i===0}">${n}</button>`).join("")}</div></div>
   <div class="two"><label class="fld"><span>Data</span><input id="caD" type="date" min="${addDays(t,1)}" value="${ops[0][2]}"></label><label class="fld"><span>Ocasião (opcional)</span><input id="caO" value="${esc(ops[0][3])}" placeholder="Ex.: dia da prova"></label></div>
   <div class="btns"><button class="btn full" id="caS">${ic("lock")} Selar carta</button></div>`,s=>{
  s.querySelector("#caS").onclick=()=>{const texto=s.querySelector("#caT").value.trim(),d=s.querySelector("#caD").value;
    if(texto.length<10)return toast("triangle-alert","Escreva a carta","Algumas linhas já valem.");if(!d||d<=TODAY())return toast("triangle-alert","Escolha uma data futura","");
    save({id:"carta_"+nid(),c:"carta",texto,escrita:TODAY(),entrega:d,ocasiao:s.querySelector("#caO").value.trim(),aberta:false});closeSheet();rr();
    toast("lock","Carta selada","Abre em "+fdate(d)+". Até lá, nem você lê.");};});}
ACT.cartaQuando=el=>{ACT.seg(el);const d=$("caD"),o=$("caO");if(el.dataset.d&&d)d.value=el.dataset.d;if(o&&(el.dataset.o||o.value.startsWith("Fim do ")))o.value=el.dataset.o;if(!el.dataset.d&&d){d.value="";d.focus();try{d.showPicker&&d.showPicker();}catch(e){}}};
