"use strict";
/* ======================================================================
   SEGUNDO CÉREBRO
   Ideias, decisões, aprendizados, referências, links, memórias e notas, todos conectados.
   · Captura rápida que reconhece o tipo sozinha (link, decisão, aprendizado, ideia…)
   · [[Ligações]] entre notas, #tags e @contatos; conexões automáticas quando uma nota
     cita o título de outra; "Citada em" (ligações de volta)
   · Conexões sugeridas por semelhança de conteúdo, com um toque para ligar
   · Grafo vivo de tudo o que você pensa, puxando também Anotações, Aprendizados e Livros
   · Revisitar: as notas voltam em 3, 7, 21, 60 e 180 dias para não morrerem esquecidas
   · Decisões com o porquê e data de revisão (que entra em Lembretes)
   · "Pergunte ao seu cérebro": responde a partir das SUAS notas (com IA, se ligada)
   · O Jarvis guarda aqui o que você pede para lembrar
   Dados: c:"cer" {tipo,t,x,url,tags,links,d,rev,nv,fav,porque,revisar,arq}
   ====================================================================== */
Object.assign(ICONS,{
  "brain":'<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/>',
  "share-2":'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',
  "scale":'<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
  "sparkle":'<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>'
});
MODS.cer={n:"Segundo cérebro",ic:"brain",c1:"#7C3AED",c2:"#C084FC",g:1,v:{v:"cer"}};
(()=>{const g=MOD_GROUPS.find(x=>x[0]==="Estudos e crescimento");if(g&&!g[1].includes("cer"))g[1].unshift("cer");})();
const CER_T={ideia:["Ideia","lightbulb","#F59E0B"],decisao:["Decisão","scale","#DC2626"],aprendizado:["Aprendizado","graduation-cap","#2563EB"],referencia:["Referência","book-open","#0D9488"],link:["Link","link","#4F46E5"],memoria:["Memória","brain-circuit","#9333EA"],nota:["Nota","notebook-pen","#64748B"]};
const CER_REV=[3,7,21,60,180];
const CER_STOP=new Set("para pela pelo como mais muito sobre entre quando onde quem porque porquê então essa esse isso esta este isto aquele aquela tambem também ainda depois antes cada todo toda todos todas tudo nada sempre nunca outra outro outros outras mesmo mesma assim agora apenas tenho temos fazer feito ficar foram sendo seria pode podem deve devem seus suas minha meus minhas nossa nosso dela dele elas eles você voce vocês uma umas uns dos das nos nas num numa".split(" "));
/* ---------- núcleo ---------- */
const cerTodas=()=>all("cer").filter(x=>!x.arq);
const cerTok=s=>[...new Set(normTxt(s||"").replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(w=>w.length>=4&&!CER_STOP.has(w)))];
function cerTipoAuto(s){const n=normTxt(s);if(/https?:\/\/|www\./.test(s))return"link";if(/^(decidi|decisao|vou passar a|a partir de agora|escolhi)/.test(n))return"decisao";
  if(/^(aprendi|licao|li que|descobri|entendi que)/.test(n))return"aprendizado";if(/^(ideia|e se|que tal|poderia|imagina)/.test(n))return"ideia";
  if(/^(livro|filme|video|podcast|artigo|curso|ref|referencia|autor)/.test(n))return"referencia";if(/^(lembrar|lembre|nao esquecer)/.test(n))return"memoria";return"nota";}
function cerParse(txt){const links=[...String(txt).matchAll(/\[\[([^\]]{1,80})\]\]/g)].map(m=>m[1].trim());const tags=[...String(txt).matchAll(/(^|\s)#([\p{L}\d_-]{2,30})/gu)].map(m=>m[2].toLowerCase());
  const url=(String(txt).match(/https?:\/\/[^\s)]+/)||[])[0]||"";return{links,tags,url};}
/* ligações automáticas: a nota cita o título de outra nota */
function cerAuto(n){const tx=normTxt((n.t||"")+" "+(n.x||""));return cerTodas().filter(o=>o.id!==n.id&&(o.t||"").length>=4&&tx.includes(normTxt(o.t))).map(o=>o.t);}
function cerLinksDe(n){const p=cerParse((n.t||"")+"\n"+(n.x||""));return[...new Set(p.links.concat(cerAuto(n)))];}
function cerSalvar(texto,tipo,extra){texto=String(texto||"").trim();if(!texto)return null;const tp=tipo||cerTipoAuto(texto);const p=cerParse(texto);
  let lin=texto.split("\n");let t=lin[0].replace(/https?:\/\/\S+/g,"").replace(/\[\[[^\]]*\]\]/g,"").replace(/(^|\s)#[\p{L}\d_-]+/gu,"").replace(/^(ideia|decisão|decisao|aprendi que|lição|licao)\s*[:,-]\s*/i,"").replace(/\s+/g," ").trim();let x=lin.slice(1).join("\n").trim();
  if(t!==lin[0].trim()&&!x)x=texto;
  if(t.length>70){x=texto;t=t.slice(0,67).replace(/\s+\S*$/,"")+"…";}
  if(!t&&p.url){try{t=new URL(p.url).hostname.replace(/^www\./,"");}catch(e){t="Link";}x=texto;}
  t=t.charAt(0).toUpperCase()+t.slice(1);
  const n={id:"cer_"+nid(),c:"cer",tipo:tp,t,x,url:p.url,tags:p.tags,d:TODAY(),rev:addDays(TODAY(),CER_REV[0]),nv:0,...(extra||{})};
  if(tp==="decisao"&&!n.revisar)n.revisar=addDays(TODAY(),30);
  n.links=cerLinksDe(n);save(n);return n;}
function cerSim(a,b){const A=a._tk||(a._tk=cerTok(a.t+" "+(a.x||"")+" "+(a.tags||[]).join(" "))),B=b._tk||(b._tk=cerTok(b.t+" "+(b.x||"")+" "+(b.tags||[]).join(" ")));if(!A.length||!B.length)return 0;
  const S=new Set(A);const i=B.filter(w=>S.has(w)).length;return i/Math.sqrt(A.length*B.length);}
const cerPorTitulo=t=>cerTodas().find(o=>normTxt(o.t)===normTxt(t));
/* fontes do resto do app que também entram no cérebro */
function cerFontes(){const F=[];
  all("notas").forEach(x=>F.push({id:x.id,fonte:"Anotações",t:x.t||"Anotação",x:x.texto||"",tipo:"nota",abre:{v:"list",k:"notas"}}));
  all("aprend").forEach(x=>F.push({id:x.id,fonte:"Aprendizados",t:x.t||"Aprendizado",x:x.res||x.texto||x.desc||"",tipo:"aprendizado",abre:{v:"list",k:"aprend"}}));
  all("livros").filter(x=>x.res).forEach(x=>F.push({id:x.id,fonte:"Livros",t:x.t,x:x.res,tipo:"referencia",abre:{v:"list",k:"livros"}}));
  return F;}
function cerBuscar(q){const Q=cerTok(q);const nq=normTxt(q);if(!nq)return[];const R=[];
  cerTodas().concat(cerFontes()).forEach(n=>{const tx=normTxt(n.t+" "+(n.x||"")+" "+(n.tags||[]).join(" "));let sc=tx.includes(nq)?5:0;Q.forEach(w=>{if(tx.includes(w))sc++;});
    if(sc){const i=normTxt(n.x||"").indexOf(Q[0]||nq);R.push({sc,titulo:n.t,trecho:(n.x||"").slice(Math.max(0,i-30),i+90).replace(/\s+/g," ").trim(),n});}});
  return R.sort((a,b)=>b.sc-a.sc);}
/* ---------- texto com ligações clicáveis ---------- */
function cerRender(s){let h=esc(s||"");
  h=h.replace(/\[\[([^\]]{1,80})\]\]/g,(m,t)=>`<button class="cer-wl" data-a="cerLink" data-t="${t}">${t}</button>`);
  h=h.replace(/(^|\s)#([\p{L}\d_-]{2,30})/gu,(m,a,t)=>`${a}<button class="cer-tag" data-a="cerTag" data-t="${t.toLowerCase()}">#${t}</button>`);
  h=h.replace(/(^|\s)@([\p{L}]{2,30})/gu,(m,a,t)=>{const c=all("ctt").find(x=>normTxt(x.nome).startsWith(normTxt(t)));return c?`${a}<button class="cer-at" data-a="cttVer" data-id="${c.id}">@${t}</button>`:m;});
  h=h.replace(/(https?:\/\/[^\s<]+)/g,u=>`<a href="${u}" target="_blank" rel="noopener" class="cer-url">${u.replace(/^https?:\/\/(www\.)?/,"").slice(0,40)}</a>`);
  return h.replace(/\n/g,"<br>");}
const cerCor=tp=>(CER_T[tp]||CER_T.nota)[2];
const cerChip=tp=>`<span class="cer-tp" style="--cc:${cerCor(tp)}">${ic((CER_T[tp]||CER_T.nota)[1])} ${(CER_T[tp]||CER_T.nota)[0]}</span>`;
function cerBack(n){return cerTodas().filter(o=>o.id!==n.id&&(o.links||[]).some(l=>normTxt(l)===normTxt(n.t)));}

/* ---------- tela principal ---------- */
VIEWS.cer=()=>{const L=cerTodas().sort((a,b)=>(b.u||0)-(a.u||0)),f=VIEW.f||"",tg=VIEW.tag||"";const t=TODAY();
  const F=L.filter(n=>(!f||n.tipo===f)&&(!tg||(n.tags||[]).includes(tg)));
  const revis=L.filter(n=>n.rev&&n.rev<=t).slice(0,5);const lig=sum(L.map(n=>(n.links||[]).length));
  let h=topbar("Segundo cérebro","cer",`<button class="ib" data-a="go" data-v="${gv({v:"cerGrafo"})}" aria-label="Ver o grafo">${ic("share-2")}</button>`);
  h+=`<div class="cer-cap"><textarea id="cerI" rows="2" placeholder="Capture qualquer coisa: uma ideia, um link, uma decisão, algo que aprendeu… Use [[ ]] para ligar, # para tag, @ para pessoa." aria-label="Capturar"></textarea>
    <div class="row" style="margin-top:8px;gap:6px;flex-wrap:wrap"><span id="cerTp">${cerChip("nota")}</span><span class="grow"></span><button class="btn sm" data-a="cerCap">${ic("plus")} Guardar</button></div></div>`;
  h+=`<div class="cer-stats"><div><b>${L.length}</b><span>pensamentos</span></div><div><b>${lig}</b><span>conexões</span></div><div><b>${[...new Set([].concat(...L.map(n=>n.tags||[])))].length}</b><span>tags</span></div><div><b>${cerFontes().length}</b><span>de outros módulos</span></div></div>`;
  h+=`<div class="cer-ask"><span>${ic("sparkle")}</span><input id="cerQ" placeholder="Pergunte ao seu cérebro…" data-enter="cerPerg" aria-label="Pergunte ao seu cérebro"><button class="ib" data-a="cerPerg" aria-label="Perguntar">${ic("send")}</button></div>`;
  if(revis.length)h+=`<div class="grp">${ic("rotate-ccw")} Para revisitar hoje<span class="chip">${revis.length}</span></div><div class="cer-rev">${revis.map(n=>`<div class="cer-rc" style="--cc:${cerCor(n.tipo)}"><button class="cer-rcb" data-a="cerAbre" data-id="${n.id}">${cerChip(n.tipo)}<b>${esc(n.t)}</b><span class="tiny faint">${fdate(n.d)} · ${esc((n.x||"").slice(0,80))}</span></button>
      <div class="btns h" style="margin-top:6px"><button class="btn sm" data-a="cerRevOk" data-id="${n.id}">${ic("check")} Ainda vale</button><button class="btn ghost sm" data-a="cerArq" data-id="${n.id}">Arquivar</button></div></div>`).join("")}</div>`;
  const fa=L.length>=5?cerFaisca(L):null;
  if(fa)h+=`<div class="cer-fa"><span class="tiny">${ic("sparkle")} Faísca do dia</span><p>O que <button class="cer-wl" data-a="cerAbre" data-id="${fa[0].id}">${esc(fa[0].t)}</button> tem a ver com <button class="cer-wl" data-a="cerAbre" data-id="${fa[1].id}">${esc(fa[1].t)}</button>?</p><button class="btn ghost sm" data-a="cerFaisca" data-a1="${fa[0].id}" data-a2="${fa[1].id}">${ic("link")} Escrever a conexão</button></div>`;
  h+=`<div class="cer-fil">${[["","Tudo",L.length]].concat(Object.entries(CER_T).map(([k,v])=>[k,v[0],L.filter(n=>n.tipo===k).length]).filter(x=>x[2])).map(([k,n,c])=>`<button class="chip ${f===k?"on":""}" data-a="cerF" data-f="${k}" style="${k?`--cc:${cerCor(k)}`:""}">${k?ic(CER_T[k][1]):""}${n} <small>${c}</small></button>`).join("")}</div>`;
  const tags=[...new Set([].concat(...L.map(n=>n.tags||[])))];if(tags.length)h+=`<div class="cer-tags">${tags.slice(0,30).map(x=>`<button class="cer-tag ${tg===x?"on":""}" data-a="cerTag" data-t="${x}">#${x}</button>`).join("")}</div>`;
  h+=`<input class="cer-busca" id="cerB" placeholder="Filtrar…" aria-label="Filtrar notas">`;
  h+=F.length?`<div class="cer-lista">${F.map(n=>{const b=cerBack(n).length,lk=(n.links||[]).length;return `<button class="cer-it" data-a="cerAbre" data-id="${n.id}" style="--cc:${cerCor(n.tipo)}" data-busca="${esc(normTxt(n.t+" "+(n.x||"")+" "+(n.tags||[]).join(" ")))}"><span class="row" style="gap:6px">${cerChip(n.tipo)}${n.fav?ic("star"):""}<span class="grow"></span><span class="tiny faint">${fshort(n.d)}</span></span><b>${esc(n.t)}</b>${n.x?`<span class="cer-sn">${esc(n.x.slice(0,140))}</span>`:""}${lk||b?`<span class="tiny cer-con">${ic("link")} ${lk+b} ${lk+b===1?"conexão":"conexões"}</span>`:""}</button>`;}).join("")}</div>`
    :empty("cer","Seu segundo cérebro está vazio",'Escreva qualquer coisa acima. Experimente: "Ideia: oferecer ensaio de família no Dia das Mães #fotografia" ou cole um link. Também dá para dizer ao Jarvis: "lembre que…".');
  h+=`<div class="btns h"><button class="btn ghost" data-a="go" data-v="${gv({v:"cerGrafo"})}">${ic("share-2")} Ver o grafo</button><button class="btn ghost" data-a="cerExport">${ic("download")} Exportar</button></div>`;
  return `<div class="app">${h}</div>`;};
function cerFaisca(L){const r=ibRng(Number(TODAY().replace(/-/g,"")));for(let k=0;k<40;k++){const a=ibPick(r,L),b=ibPick(r,L);if(a!==b&&!(a.links||[]).includes(b.t)&&!(b.links||[]).includes(a.t))return[a,b];}return null;}
/* detecção de tipo enquanto digita e filtro sem recarregar a tela */
document.addEventListener("input",e=>{if(e.target.id==="cerI"){const s=$("cerTp");if(s)s.innerHTML=cerChip(cerTipoAuto(e.target.value));e.target.style.height="auto";e.target.style.height=Math.min(260,e.target.scrollHeight)+"px";}
  if(e.target.id==="cerB"){const q=normTxt(e.target.value);document.querySelectorAll(".cer-it").forEach(b=>{b.style.display=!q||b.dataset.busca.includes(q)?"":"none";});}});
ACT.cerCap=()=>{const i=$("cerI");const v=i.value.trim();if(!v)return i.focus();const n=cerSalvar(v);rr();toast(CER_T[n.tipo][1],CER_T[n.tipo][0]+" guardada",n.links.length?`Conectada a ${listaTxt(n.links.slice(0,3))}`:"No seu Segundo cérebro");};
ACT.cerF=el=>{VIEW.f=el.dataset.f;rr();};
ACT.cerTag=el=>{const t=el.dataset.t;if(VIEW.v!=="cer")go({v:"cer",tag:t});else{VIEW.tag=VIEW.tag===t?"":t;rr();}};
ACT.cerAbre=el=>go({v:"cerNota",id:el.dataset.id});
ACT.cerLink=el=>{const t=el.dataset.t;let n=cerPorTitulo(t);if(!n){n=cerSalvar(t,"nota");toast("plus","Nota criada",t);}go({v:"cerNota",id:n.id});};
ACT.cerRevOk=el=>{const n=getD(el.dataset.id);if(!n)return;n.nv=Math.min(CER_REV.length-1,(n.nv||0)+1);n.rev=addDays(TODAY(),CER_REV[n.nv]);save(n);rr();toast("rotate-ccw","Volta em "+CER_REV[n.nv]+" dias","");};
ACT.cerArq=el=>{const n=getD(el.dataset.id);if(!n)return;n.arq=1;save(n);rr();toast("check","Arquivada",n.t);};
ACT.cerFaisca=el=>{const a=getD(el.dataset.a1),b=getD(el.dataset.a2);go({v:"cerNota",id:a.id,novo:`\n\nConexão com [[${b.t}]]: `});};
ACT.cerExport=()=>{const L=cerTodas();const md=L.map(n=>`## ${n.t}\n_${(CER_T[n.tipo]||CER_T.nota)[0]} · ${fdate(n.d)}${(n.tags||[]).length?" · "+n.tags.map(t=>"#"+t).join(" "):""}_\n\n${n.x||""}${n.porque?`\n\n**Por quê:** ${n.porque}`:""}${(n.links||[]).length?`\n\nLigações: ${n.links.map(l=>"[["+l+"]]").join(" ")}`:""}\n`).join("\n---\n\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([md],{type:"text/markdown"}));a.download="segundo-cerebro.md";document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},2000);toast("download","Exportado","segundo-cerebro.md");};

/* ---------- pergunte ao seu cérebro ---------- */
ACT.cerPerg=async()=>{const i=$("cerQ");const q=(i&&i.value||"").trim();if(!q)return i&&i.focus();const R=cerBuscar(q).slice(0,8);
  const lista=R.map(x=>`<button class="cer-it" style="--cc:${cerCor(x.n.tipo)}" data-a="${x.n.c==="cer"?"cerAbre":"go"}" ${x.n.c==="cer"?`data-id="${x.n.id}"`:`data-v="${esc(JSON.stringify(x.n.abre))}"`}>${cerChip(x.n.tipo)}${x.n.fonte?`<span class="tiny faint"> · ${x.n.fonte}</span>`:""}<b>${esc(x.titulo)}</b>${x.trecho?`<span class="cer-sn">${esc(x.trecho)}</span>`:""}</button>`).join("");
  sheet(`<div class="row"><span class="mb" ${mstyle("cer")}>${ic("sparkle")}</span><h2 class="grow" style="margin:0">${esc(q)}</h2></div><div id="cerResp" class="cer-resp">${R.length?(temIA()?`<span class="tiny faint">Pensando com as suas notas…</span>`:`Encontrei ${R.length} ${R.length===1?"nota relacionada":"notas relacionadas"}.`):"Ainda não há nada sobre isso no seu cérebro."}</div><div class="cer-lista">${lista}</div><div class="btns"><button class="btn ghost full" data-a="close">Fechar</button></div>`);
  if(R.length&&temIA()){try{const ctx=R.map((x,k)=>`[${k+1}] ${x.titulo}: ${(x.n.x||"").slice(0,600)}`).join("\n");
      const txt=await Promise.race([aiGenerate([{text:`Você é o segundo cérebro da pessoa. Responda à pergunta usando SOMENTE as notas abaixo, em português do Brasil, em até 6 frases, citando as notas pelo número entre colchetes. Se as notas não bastarem, diga o que falta.\nPergunta: ${q}\n\nNotas:\n${ctx}`}],{max:500}),new Promise((_,j)=>setTimeout(()=>j(new Error("tempo")),15000))]);
      const el=$("cerResp");if(el)el.innerHTML=esc(String(txt).trim()).replace(/\n/g,"<br>");}catch(e){const el=$("cerResp");if(el)el.textContent=`Encontrei ${R.length} notas relacionadas.`;}}};

/* ---------- página da nota ---------- */
VIEWS.cerNota=()=>{const n=getD(VIEW.id);if(!n)return `<div class="app">${topbar("Nota","cer")}<p class="muted">Nota não encontrada.</p></div>`;
  if(VIEW.novo){n.x=(n.x||"")+VIEW.novo;VIEW.novo="";save(n);}
  const back=cerBack(n),links=(n.links||[]).map(t=>cerPorTitulo(t)).filter(Boolean);const cand=cerTodas().filter(o=>o.id!==n.id&&!links.includes(o)&&!back.includes(o)).map(o=>({o,s:cerSim(n,o)})).filter(x=>x.s>=.12).sort((a,b)=>b.s-a.s).slice(0,5);
  const fontes=cerFontes().map(f=>({f,s:cerSim(n,f)})).filter(x=>x.s>=.15).sort((a,b)=>b.s-a.s).slice(0,3);
  let h=topbar((CER_T[n.tipo]||CER_T.nota)[0],"cer",`<button class="ib" data-a="cerFav" data-id="${n.id}" aria-label="Favoritar">${ic("star")}</button>`);
  h+=`<div class="cer-nota" style="--cc:${cerCor(n.tipo)}"><div class="cer-tps">${Object.entries(CER_T).map(([k,v])=>`<button class="cer-tp ${n.tipo===k?"on":""}" style="--cc:${v[2]}" data-a="cerTipo" data-id="${n.id}" data-t="${k}">${ic(v[1])} ${v[0]}</button>`).join("")}</div>
    <textarea class="cer-tit" id="cerT" rows="2" aria-label="Título">${esc(n.t)}</textarea>
    <div class="cer-meta tiny faint">${fdate(n.d)} · próxima revisita ${n.rev?fdate(n.rev).slice(0,5):"—"}${n.fav?" · favorita":""}</div>
    <div class="cer-ver" id="cerV">${n.x?cerRender(n.x):`<span class="faint">Toque para escrever. Use [[Título]] para ligar a outra nota, #tag e @pessoa.</span>`}</div>
    <textarea class="cer-ed hidden" id="cerX" rows="8" aria-label="Texto">${esc(n.x||"")}</textarea>
    ${n.tipo==="decisao"?`<label class="fld"><span>Por que decidi isso</span><textarea id="cerP" rows="3">${esc(n.porque||"")}</textarea></label><label class="fld"><span>Revisar a decisão em</span><input id="cerR" type="date" value="${esc(n.revisar||"")}"></label>`:""}
    ${n.url?`<a class="btn ghost full" href="${esc(n.url)}" target="_blank" rel="noopener" style="margin-top:10px">${ic("link")} Abrir o link</a>`:""}</div>`;
  h+=`<div class="grp">${ic("link")} Ligações<span class="chip">${links.length}</span></div>`+(links.length?`<div class="cer-lks">${links.map(o=>`<button class="cer-lk" style="--cc:${cerCor(o.tipo)}" data-a="cerAbre" data-id="${o.id}">${ic(CER_T[o.tipo][1])} ${esc(o.t)}</button>`).join("")}</div>`:`<p class="tiny faint" style="margin:0">Nenhuma ainda. Escreva [[ ]] no texto ou use as sugestões abaixo.</p>`);
  if(back.length)h+=`<div class="grp">${ic("rotate-ccw")} Citada em<span class="chip">${back.length}</span></div><div class="cer-lks">${back.map(o=>`<button class="cer-lk" style="--cc:${cerCor(o.tipo)}" data-a="cerAbre" data-id="${o.id}">${ic(CER_T[o.tipo][1])} ${esc(o.t)}</button>`).join("")}</div>`;
  if(cand.length||fontes.length)h+=`<div class="grp">${ic("sparkle")} Pode ter a ver</div>${cand.map(x=>`<div class="cer-sug" style="--cc:${cerCor(x.o.tipo)}"><button class="grow cer-sugb" data-a="cerAbre" data-id="${x.o.id}">${ic(CER_T[x.o.tipo][1])} <b>${esc(x.o.t)}</b><span class="tiny faint">${Math.round(x.s*100)}% parecido</span></button><button class="btn sm" data-a="cerConecta" data-id="${n.id}" data-t="${esc(x.o.t)}">${ic("link")} Ligar</button></div>`).join("")}${fontes.map(x=>`<div class="cer-sug" style="--cc:#94A3B8"><button class="grow cer-sugb" data-a="go" data-v="${esc(JSON.stringify(x.f.abre))}">${ic("book-open")} <b>${esc(x.f.t)}</b><span class="tiny faint">em ${x.f.fonte}</span></button></div>`).join("")}`;
  h+=`<div class="btns h" style="margin-top:16px"><button class="btn ghost" data-a="cerTarefa" data-id="${n.id}">${ic("list-checks")} Virar tarefa</button><button class="btn ghost" data-a="cerLemb" data-id="${n.id}">${ic("alarm-clock")} Lembrete</button></div>
    <div class="btns"><button class="btn danger full" data-a="cerDel" data-id="${n.id}">${ic("trash-2")} Excluir</button></div>`;
  return `<div class="app">${h}</div>`;};
/* edição: toca no texto para editar; salva ao sair */
document.addEventListener("click",e=>{const v=e.target.closest&&e.target.closest("#cerV");if(!v||e.target.closest("button,a"))return;const x=$("cerX");v.classList.add("hidden");x.classList.remove("hidden");x.focus();x.style.height=Math.max(160,x.scrollHeight)+"px";});
document.addEventListener("focusout",e=>{if(!["cerX","cerT","cerP","cerR"].includes(e.target.id)||VIEW.v!=="cerNota")return;const n=getD(VIEW.id);if(!n)return;
  if(e.target.id==="cerX")n.x=e.target.value;if(e.target.id==="cerT")n.t=e.target.value.trim()||n.t;if(e.target.id==="cerP")n.porque=e.target.value;if(e.target.id==="cerR")n.revisar=e.target.value;
  const p=cerParse(n.t+"\n"+(n.x||""));n.tags=p.tags;n.url=n.url||p.url;n.links=cerLinksDe(n);delete n._tk;save(n);if(e.target.id==="cerX")setTimeout(()=>rr(),0);});
ACT.cerTipo=el=>{const n=getD(el.dataset.id);n.tipo=el.dataset.t;if(n.tipo==="decisao"&&!n.revisar)n.revisar=addDays(TODAY(),30);save(n);rr();};
ACT.cerFav=el=>{const n=getD(el.dataset.id);n.fav=!n.fav;save(n);rr();};
ACT.cerConecta=el=>{const n=getD(el.dataset.id),t=el.dataset.t;n.x=(n.x||"").trim()+`\n\nVer também: [[${t}]]`;n.links=cerLinksDe(n);save(n);rr();toast("link","Conectadas",t);};
ACT.cerTarefa=el=>{const n=getD(el.dataset.id);const d=TODAY();save({id:"todo_"+nid(),c:"todo",t:n.t,d,dias:[d],ok:false,o:Date.now()%100000});toast("list-checks","Virou tarefa de hoje",n.t);};
ACT.cerLemb=el=>{const n=getD(el.dataset.id);sheet(`<h2>Lembrete desta nota</h2><div class="two"><label class="fld"><span>Dia</span><input id="clD" type="date" value="${addDays(TODAY(),1)}"></label><label class="fld"><span>Hora</span><input id="clH" type="time" value="09:00"></label></div><div class="btns"><button class="btn full" id="clOk">Criar lembrete</button></div>`,s=>{s.querySelector("#clOk").onclick=()=>{save({id:"rem_"+nid(),c:"rem",t:"Revisitar: "+n.t,d:s.querySelector("#clD").value||TODAY(),h:s.querySelector("#clH").value||"09:00",rep:"",feito:false,fired:"",cer:n.id});if(typeof pushAgendar==="function")pushAgendar();closeSheet();toast("alarm-clock","Lembrete criado",n.t);};});};
ACT.cerDel=el=>{const n=getD(el.dataset.id);confirmSheet("Excluir esta nota?",n.t,"Excluir",()=>{removeDoc(n.id);back();});};

/* ---------- grafo ---------- */
function cerGrafo(){const N=cerTodas().map(n=>({id:n.id,t:n.t,tipo:n.tipo,n})),idx={};N.forEach((x,i)=>idx[normTxt(x.t)]=i);const E=[];
  N.forEach((x,i)=>(x.n.links||[]).forEach(l=>{const j=idx[normTxt(l)];if(j!=null&&j!==i)E.push([i,j,1]);}));
  /* tags viram nós pequenos */
  const tg={};N.forEach((x,i)=>(x.n.tags||[]).forEach(t=>{if(tg[t]==null){tg[t]=N.length;N.push({id:"tag:"+t,t:"#"+t,tipo:"tag"});}E.push([i,tg[t],.6]);}));
  /* fontes de outros módulos ligadas por semelhança */
  if(N.length<160)cerFontes().slice(0,60).forEach(f=>{let best=-1,bs=0;N.forEach((x,i)=>{if(!x.n)return;const s=cerSim(x.n,f);if(s>bs){bs=s;best=i;}});if(bs>=.18){N.push({id:"src:"+f.id,t:f.t,tipo:"fonte",f});E.push([best,N.length-1,.4]);}});
  /* layout por forças */
  const W=1000,H=1000,r=ibRng(7);N.forEach(x=>{x.x=W/2+(r()-.5)*W*.6;x.y=H/2+(r()-.5)*H*.6;x.vx=0;x.vy=0;});const deg=N.map(()=>0);E.forEach(([a,b])=>{deg[a]++;deg[b]++;});
  const k=Math.sqrt(W*H/Math.max(1,N.length))*.55;
  for(let it=0;it<260;it++){const temp=1-it/260;
    for(let i=0;i<N.length;i++)for(let j=i+1;j<N.length;j++){const a=N[i],b=N[j];let dx=a.x-b.x,dy=a.y-b.y,d2=dx*dx+dy*dy||.01;const f=k*k/d2;a.vx+=dx*f*.02;a.vy+=dy*f*.02;b.vx-=dx*f*.02;b.vy-=dy*f*.02;}
    E.forEach(([i,j,w])=>{const a=N[i],b=N[j];const dx=b.x-a.x,dy=b.y-a.y,d=Math.sqrt(dx*dx+dy*dy)||.01;const f=(d-k)*.06*w;a.vx+=dx/d*f;a.vy+=dy/d*f;b.vx-=dx/d*f;b.vy-=dy/d*f;});
    N.forEach(x=>{x.vx+=(W/2-x.x)*.004;x.vy+=(H/2-x.y)*.004;const sp=Math.min(30*temp+2,Math.hypot(x.vx,x.vy));const a=Math.atan2(x.vy,x.vx);x.x+=Math.cos(a)*sp;x.y+=Math.sin(a)*sp;x.vx*=.5;x.vy*=.5;});}
  const xs=N.map(x=>x.x),ys=N.map(x=>x.y);const mnx=Math.min(...xs),mxx=Math.max(...xs),mny=Math.min(...ys),mxy=Math.max(...ys);
  /* encaixa tudo numa área de 360 × 420, com margem para os nomes */
  const sx=240/Math.max(1,mxx-mnx),sy=340/Math.max(1,mxy-mny),sc=Math.min(sx,sy,1.2);N.forEach(x=>{x.x=60+(x.x-mnx)*sc+(240-(mxx-mnx)*sc)/2;x.y=34+(x.y-mny)*sc+(340-(mxy-mny)*sc)/2;});
  return{N,E,deg,vb:"0 0 360 420"};}
VIEWS.cerGrafo=()=>{let h=topbar("Grafo do cérebro","cer");const L=cerTodas();
  if(L.length<2)return `<div class="app">${h}${empty("cer","O grafo aparece com 2 notas ou mais","Capture algumas ideias e ligue com [[ ]] ou #tags.")}</div>`;
  const G=cerGrafo(),sel=VIEW.sel||"";const viz=new Set();if(sel){const i=G.N.findIndex(x=>x.id===sel);G.E.forEach(([a,b])=>{if(a===i)viz.add(b);if(b===i)viz.add(a);});viz.add(i);}
  const cor=x=>x.tipo==="tag"?"#94A3B8":x.tipo==="fonte"?"#CBD5E1":cerCor(x.tipo);
  h+=`<p class="tiny faint" style="margin:0 0 8px">Cada ponto é um pensamento; as linhas são ligações, tags e semelhanças com Anotações, Aprendizados e Livros. Toque num ponto para destacar as conexões; toque de novo para abrir.</p>`;
  h+=`<div class="cer-gw ${VIEW.zoom?"z":""}"><svg class="cer-g" viewBox="${G.vb}" role="img" aria-label="Grafo das notas">
    ${G.E.map(([a,b,w])=>{const A=G.N[a],B=G.N[b];const on=!sel||(viz.has(a)&&viz.has(b));return `<line x1="${A.x.toFixed(1)}" y1="${A.y.toFixed(1)}" x2="${B.x.toFixed(1)}" y2="${B.y.toFixed(1)}" class="cer-e" style="opacity:${on?(w<1?.35:.7):.06}"/>`;}).join("")}
    ${G.N.map((x,i)=>{const rr_=x.tipo==="tag"?4:x.tipo==="fonte"?3.5:Math.min(13,6+G.deg[i]*1.6);const on=!sel||viz.has(i);const lbl=x.tipo!=="fonte"&&(G.deg[i]>=2||x.tipo==="tag"||G.N.length<=25||viz.has(i));
      return `<g class="cer-n" data-a="cerNo" data-id="${x.id}" style="opacity:${on?1:.15}"><circle cx="${x.x.toFixed(1)}" cy="${x.y.toFixed(1)}" r="${rr_}" fill="${cor(x)}"${x.id===sel?' stroke="currentColor" stroke-width="4"':""}/>${lbl?`<text x="${x.x.toFixed(1)}" y="${(x.y+rr_+10).toFixed(1)}" text-anchor="middle">${esc(x.t.slice(0,22))}${x.t.length>22?"…":""}</text>`:""}</g>`;}).join("")}</svg></div>`;
  h+=`<div class="cer-leg">${Object.entries(CER_T).map(([k,v])=>`<span><i style="background:${v[2]}"></i>${v[0]}</span>`).join("")}<span><i style="background:#94A3B8"></i>Tag</span><span><i style="background:#CBD5E1"></i>Outros módulos</span></div>`;
  h+=`<div class="btns h"><button class="btn ghost" data-a="cerZoom">${ic(VIEW.zoom?"minus":"plus")} ${VIEW.zoom?"Reduzir":"Ampliar"}</button>${sel?`<button class="btn ghost" data-a="cerNoLimpa">Ver tudo</button>`:""}</div>`;
  return `<div class="app">${h}</div>`;};
ACT.cerNo=el=>{const id=el.dataset.id;if(VIEW.sel===id){if(id.startsWith("tag:"))return go({v:"cer",tag:id.slice(4)});if(id.startsWith("src:")){const f=cerFontes().find(x=>"src:"+x.id===id);return f&&go(f.abre);}return go({v:"cerNota",id});}VIEW.sel=id;rr();};
ACT.cerNoLimpa=()=>{VIEW.sel="";rr();};
ACT.cerZoom=()=>{VIEW.zoom=!VIEW.zoom;rr();};

/* ---------- conexões com o resto do app ---------- */
/* anotações do "Falar e separar" vão para o cérebro */
try{const _desp60=ACT.despSalvar;ACT.despSalvar=()=>{if(typeof DESP!=="undefined"&&DESP&&DESP.itens)DESP.itens.forEach(x=>{if(x.on&&x.k==="n"){cerSalvar((x.t||"")+(x.texto&&x.texto!==x.t?"\n"+x.texto:""),cerTipoAuto(x.texto||x.t)==="nota"?"ideia":cerTipoAuto(x.texto||x.t));x.on=false;x._cer=1;}});
  const n=DESP?DESP.itens.filter(x=>x._cer).length:0;_desp60();if(n)setTimeout(()=>toast("brain",n===1?"1 ideia no Segundo cérebro":`${n} ideias no Segundo cérebro`,""),400);};}catch(e){}
/* decisões a revisar e notas para revisitar entram em Lembretes */
try{const _lh60=lhItens;lhItens=function(){const L=_lh60.apply(this,arguments),t=TODAY();
  cerTodas().filter(n=>n.tipo==="decisao"&&n.revisar&&n.revisar<=t).forEach(n=>{const k="cerdec:"+n.id;if(lhMarcado(k,t)||lhExcluido(k,t))return;L.push({k,d:t,g:"crescimento",ic:"scale",t:"Revisar decisão: "+n.t,sub:"ainda faz sentido?",abre:{v:"cerNota",id:n.id},ok:()=>{const y=getD(n.id);y.revisar=addDays(t,90);save(y);}});});
  const R=cerTodas().filter(n=>n.rev&&n.rev<=t);if(R.length&&!lhMarcado("cerrev",t)&&!lhExcluido("cerrev",t))L.push({k:"cerrev",d:t,g:"crescimento",ic:"brain",t:`${R.length} ${R.length===1?"ideia":"ideias"} para revisitar no Segundo cérebro`,sub:"para não morrerem esquecidas",abre:{v:"cer"},ok:()=>{}});
  return L;};}catch(e){}
LH_G.push(["cerebro","Segundo cérebro","brain"]);
/* busca do Jarvis inclui o cérebro e o briefing lembra de uma ideia */
try{const _bf60=briefFatos;briefFatos=function(per){const F=_bf60.apply(this,arguments);const R=cerTodas().filter(n=>n.rev&&n.rev<=TODAY());if(R.length)F.segundo_cerebro=`${R.length} ideia(s) para revisitar, como "${R[0].t}"`;return F;};}catch(e){}
