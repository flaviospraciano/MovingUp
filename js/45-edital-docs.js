"use strict";
/* ======================================================================
   EDITAIS · DOCUMENTAÇÃO DOS CONTEMPLADOS e VÍNCULO COM CONTATOS
   Na pessoa/projeto de um edital (e.pess[i]) ficam:
     p.docs = {forma, info, prazo, itens:[{id,t,ok}]}  (só para contemplados)
     p.ctt  = id de um contato profissional (c:"ctt")
   ====================================================================== */
Object.assign(ICONS,{
  "copy":'<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  "link":'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  "globe":'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  "file-text":'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  "user-plus":'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>',
  "clipboard-check":'<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>'
});

/* formas de envio: [chave, nome, ícone, rótulo do detalhe, exemplo, frase da mensagem] */
const EDD_FORMAS=[
  ["email","E-mail","mail","E-mail para onde enviar","Ex.: editais@cultura.ce.gov.br","Envio por e-mail"],
  ["mapa","Mapa Cultural","globe","Link ou instrução (opcional)","Ex.: anexar na aba Documentos da inscrição","Envio pelo Mapa Cultural"],
  ["presencial","Presencial","map-pin","Local e horário","Ex.: Secretaria de Cultura, seg a sex, 8h às 12h","Entrega presencial"],
  ["plataforma","Outra plataforma","link","Link do formulário ou plataforma","Ex.: https://…","Envio pela plataforma"],
  ["whats","Para mim","message-circle","Detalhe (opcional)","Ex.: me mande em PDF pelo WhatsApp","Pode me mandar por aqui mesmo, pelo WhatsApp"]];
const eddForma=k=>EDD_FORMAS.find(f=>f[0]===k);
const EDD_MODELOS=["RG ou CNH","CPF","Comprovante de residência","Dados bancários (conta no nome do proponente)","Certidão negativa federal","Certidão negativa estadual","Certidão negativa municipal","Certidão negativa trabalhista","Certificado do FGTS","Termo de compromisso assinado","Currículo ou portfólio","Plano de trabalho"];

/* ---------- utilidades ---------- */
function eddAchar(eid,pid){const e=getD(eid);if(!e)return{};const i=(e.pess||[]).findIndex(p=>String(p.id)===String(pid));return{e,i,p:i<0?null:e.pess[i]};}
function eddGarantirId(e,i){const p=e.pess[i];if(p&&!p.id){p.id=nid();save(e);}return p;}
function eddDocs(p){p.docs=p.docs||{forma:"",info:"",prazo:"",itens:[]};p.docs.itens=p.docs.itens||[];return p.docs;}
const eddCont=p=>{const I=(p.docs&&p.docs.itens)||[];return{tot:I.length,ok:I.filter(x=>x.ok).length};};
const eddCtt=p=>p&&p.ctt?getD(p.ctt):null;
const eddPrimeiro=s=>String(s||"").trim().split(/\s+/)[0]||"";
const eddWa=c=>{const d=String((c&&c.tel)||"").replace(/\D/g,"");return d?(d.length<=11?"55"+d:d):"";};
const eddPrazoTxt=d=>{if(!d)return"";const n=diasAte(d),dt=fdate(d).slice(0,5);return n<0?`venceu em ${dt}`:n===0?`vence hoje (${dt})`:n===1?`vence amanhã (${dt})`:`até ${dt} · faltam ${n} dias`;};
async function eddCopiar(txt){try{await navigator.clipboard.writeText(txt);return true;}catch(e){}
  try{const t=document.createElement("textarea");t.value=txt;t.setAttribute("readonly","");t.style.cssText="position:fixed;opacity:0;top:0;left:0";document.body.appendChild(t);t.select();const ok=document.execCommand("copy");t.remove();return ok;}catch(e){return false;}}

/* a mensagem pronta para o WhatsApp */
function eddMensagem(e,p){const D=eddDocs(p),c=eddCtt(p),F=eddForma(D.forma);
  const pend=D.itens.filter(x=>!x.ok),lista=(pend.length?pend:D.itens);const parcial=pend.length&&pend.length<D.itens.length;
  const nome=eddPrimeiro(c?c.nome:p.n);let m=`Olá${nome?", "+nome:""}! `;
  m+=parcial?`Para fechar a documentação do projeto contemplado no edital *${e.nome}*, ainda faltam:\n\n`:`O projeto foi contemplado no edital *${e.nome}*! 🎉\nAgora precisamos enviar a documentação. Os documentos solicitados são:\n\n`;
  m+=lista.map(x=>"• "+x.t).join("\n");
  if(F){m+=`\n\n*${F[5]}*`;if(D.info)m+=`: ${D.info}`;}
  if(D.prazo)m+=`\n*Prazo:* até ${fdate(D.prazo).slice(0,5)}`;
  m+="\n\nQualquer dúvida, me chama. Obrigado!";return m;}

/* ---------- 1. blocos dentro da ficha da pessoa/projeto ---------- */
const _ppSheetDocs=ppSheet;
ppSheet=function(eid,i){const e=getD(eid);if(!e||!e.pess||!e.pess[i])return _ppSheetDocs.apply(this,arguments);const p=eddGarantirId(e,i);
  _ppSheetDocs.apply(this,arguments);
  const s=$("sheet"),alvo=s&&s.querySelector("#ppN");if(!alvo)return;const lab=alvo.closest("label")||alvo;
  const c=eddCtt(p),wa=eddWa(c),K=eddCont(p),D=p.docs||{},F=eddForma(D.forma);
  let h=`<div class="eddbloco">`;
  if(p.st==="c")h+=`<button class="eddbtn" data-a="eddAbrir" data-ed="${e.id}" data-p="${p.id}"><span class="mb" ${mstyle("editais")}>${ic("clipboard-check")}</span><span class="grow"><b>Documentação para envio</b><span class="small muted" style="display:block">${K.tot?`${K.ok} de ${K.tot} ${K.ok===1?"documento ok":"documentos ok"}`:"Monte a lista dos documentos pedidos"}${F?` · ${F[1]}`:""}${D.prazo?` · ${eddPrazoTxt(D.prazo)}`:""}</span>${K.tot?`<span class="bar" style="display:block;margin-top:6px"><i style="width:${K.ok/K.tot*100}%"></i></span>`:""}</span>${ic("chevron-right")}</button>`;
  h+=c?`<div class="eddctt"><button class="grow eddcttn" data-a="eddVerCtt" data-id="${c.id}"><span class="mb cttav" ${mstyle("ctt")}>${esc(cttIni(c.nome))}</span><span class="grow"><span class="tiny faint" style="display:block">Contato vinculado</span><b>${esc(c.nome)}</b></span></button>${wa?`<a class="btn ghost sm" href="https://wa.me/${wa}" target="_blank" rel="noopener" aria-label="WhatsApp de ${esc(c.nome)}">${ic("message-circle")}</a>`:""}<button class="btn ghost sm" data-a="eddVincular" data-ed="${e.id}" data-p="${p.id}" aria-label="Trocar contato">${ic("pencil")}</button></div>`
    :`<button class="btn ghost full" data-a="eddVincular" data-ed="${e.id}" data-p="${p.id}">${ic("link")} Vincular a um contato profissional</button>`;
  h+=`</div>`;
  /* logo abaixo dos botões de situação, para não ficar escondido depois dos valores */
  const st=s.querySelector(".stbtn");const grp=st?st.closest(".btns"):null;
  if(grp)grp.insertAdjacentHTML("afterend",h);else lab.insertAdjacentHTML("beforebegin",h);};
const eddVoltar=(e,p)=>{const i=e.pess.findIndex(x=>x.id===p.id);if(i>=0)ppSheet(e.id,i);else closeSheet();};

/* ---------- 2. tela da documentação ---------- */
ACT.eddAbrir=el=>eddSheet(el.dataset.ed,el.dataset.p);
function eddSheet(eid,pid){const{e,p}=eddAchar(eid,pid);if(!p)return;const D=eddDocs(p),F=eddForma(D.forma),c=eddCtt(p),wa=eddWa(c),K=eddCont(p);
  const outros=(e.pess||[]).filter(x=>x.st==="c"&&x.id!==p.id);
  const usados=new Set(D.itens.map(x=>normTxt(x.t)));const sug=EDD_MODELOS.filter(m=>!usados.has(normTxt(m)));
  sheet(`<button class="eddvolta" data-a="eddVoltar" data-ed="${e.id}" data-p="${p.id}">${ic("chevron-left")} ${esc(p.n)}</button>
   <h2 style="margin-top:4px">Documentação para envio</h2><div class="muted small">${esc(e.nome)} · ${edAno(e)}</div>

   <div class="grp" style="margin-top:16px">Forma de envio</div>
   <div class="eddformas">${EDD_FORMAS.map(f=>`<button type="button" class="eddf" data-a="eddForma" data-ed="${e.id}" data-p="${p.id}" data-k="${f[0]}" aria-pressed="${D.forma===f[0]}">${ic(f[2])}<span>${f[1]}</span></button>`).join("")}</div>
   ${F?`<label class="fld"><span>${F[3]}</span><input id="eddInfo" value="${esc(D.info||"")}" placeholder="${esc(F[4])}" ${F[0]==="email"?'inputmode="email"':F[0]==="plataforma"?'inputmode="url"':""}></label>`:""}
   <label class="fld"><span>Prazo para enviar</span><input id="eddPrazo" type="date" value="${esc(D.prazo||"")}"></label>
   ${D.prazo?`<div class="tiny ${diasAte(D.prazo)<=3?"eddurg":"faint"}" style="margin-top:4px;font-weight:700">${eddPrazoTxt(D.prazo)}</div>`:""}

   <div class="grp" style="margin-top:18px">Documentos ${K.tot?`<span class="chip ${K.ok===K.tot?"c":""}">${K.ok}/${K.tot}</span>`:""}</div>
   ${K.tot?`<p class="tiny faint" style="margin:0 0 6px">Marque quando o documento estiver ok (recebido ou enviado).</p><div class="eddlist">${D.itens.map(x=>`<div class="mit eddit"><button class="ck ${x.ok?"on":""}" data-a="eddOk" data-ed="${e.id}" data-p="${p.id}" data-id="${x.id}" aria-label="${x.ok?"Desmarcar":"Marcar"}: ${esc(x.t)}">${ic("check")}</button><span class="grow ${x.ok?"strike":""}">${esc(x.t)}</span><button class="todo-x" data-a="eddDel" data-ed="${e.id}" data-p="${p.id}" data-id="${x.id}" aria-label="Tirar da lista">${ic("x")}</button></div>`).join("")}</div>`:`<p class="small muted" style="margin:0">Adicione os documentos que o edital pede. Dá para colar a lista inteira de uma vez.</p>`}
   <div class="qadd" style="margin:10px 0 0"><input id="eddNovo" placeholder="Ex.: Certidão negativa federal" data-enter="eddAdd" data-ed="${e.id}" data-p="${p.id}" aria-label="Novo documento"><button class="btn" data-a="eddAdd" data-ed="${e.id}" data-p="${p.id}" aria-label="Adicionar documento">${ic("plus")}</button></div>
   <div class="wrap-row" style="margin-top:8px"><button class="btn ghost sm" data-a="eddColar" data-ed="${e.id}" data-p="${p.id}">${ic("clipboard-list")} Colar lista</button>${outros.length&&K.tot?`<button class="btn ghost sm" data-a="eddReplicar" data-ed="${e.id}" data-p="${p.id}">${ic("copy")} Usar nos outros contemplados</button>`:""}</div>

   ${K.tot?`<div class="eddenvio"><b>${ic("message-circle")} Pedir os documentos${c?" a "+esc(eddPrimeiro(c.nome)):""}</b>
     <span class="tiny muted" style="display:block;margin:2px 0 10px">${K.ok&&K.ok<K.tot?"A mensagem lista só o que ainda falta.":"A mensagem vai com a lista, a forma de envio e o prazo."}</span>
     <div class="btns h" style="margin-top:0"><button class="btn" data-a="eddCopiar" data-ed="${e.id}" data-p="${p.id}">${ic("copy")} Copiar mensagem</button><button class="btn ghost" data-a="eddZap" data-ed="${e.id}" data-p="${p.id}">${ic("send")} ${wa?"Abrir conversa":"Abrir WhatsApp"}</button></div>
     ${c?"":`<span class="tiny faint" style="display:block;margin-top:8px">Vincule um contato com WhatsApp para a conversa abrir direto com a pessoa.</span>`}</div>`:""}
   ${sug.length?`<div class="eddsug"><span class="tiny faint">Toque para incluir:</span>${sug.map(m=>`<button type="button" class="chip" data-a="eddMod" data-ed="${e.id}" data-p="${p.id}" data-t="${esc(m)}">${ic("plus")} ${esc(m)}</button>`).join("")}</div>`:""}`,
  s=>{const sv=()=>{const i=s.querySelector("#eddInfo"),d=s.querySelector("#eddPrazo");let mud=false;
      if(i&&i.value.trim()!==(D.info||"")){D.info=i.value.trim();mud=true;}if(d&&d.value!==(D.prazo||"")){D.prazo=d.value;mud=true;}if(mud)save(e);};
    s.querySelectorAll("#eddInfo,#eddPrazo").forEach(x=>x.addEventListener("change",()=>{sv();if(x.id==="eddPrazo")eddSheet(eid,pid);}));
    s._eddSalvar=sv;});}
/* antes de qualquer ação, guarda o que foi digitado nos campos */
const eddPre=()=>{const s=$("sheet");if(s&&s._eddSalvar)s._eddSalvar();};
const eddCtx=el=>{eddPre();const r=eddAchar(el.dataset.ed,el.dataset.p);if(r.p)eddDocs(r.p);return r;};
ACT.eddVoltar=el=>{const{e,p}=eddCtx(el);if(p)eddVoltar(e,p);};
ACT.eddForma=el=>{const{e,p}=eddCtx(el);if(!p)return;const D=p.docs;if(D.forma!==el.dataset.k){D.forma=el.dataset.k;D.info="";}save(e);eddSheet(e.id,p.id);const i=$("eddInfo");if(i)i.focus();};
function eddAddItens(e,p,L){const D=p.docs,ja=new Set(D.itens.map(x=>normTxt(x.t)));let n=0;
  L.map(t=>t.replace(/^\s*([-•*–·]|\d+[.)-]|\[\s?\]|☐)\s*/,"").trim()).filter(Boolean).forEach(t=>{if(ja.has(normTxt(t)))return;ja.add(normTxt(t));D.itens.push({id:nid(),t,ok:false});n++;});
  if(n)save(e);return n;}
ACT.eddAdd=el=>{const{e,p}=eddCtx(el);if(!p)return;const i=$("eddNovo");const v=i?i.value.trim():"";if(!v)return i&&i.focus();eddAddItens(e,p,v.split(/\n|;/));eddSheet(e.id,p.id);const n=$("eddNovo");if(n)n.focus();};
ACT.eddMod=el=>{const{e,p}=eddCtx(el);if(!p)return;eddAddItens(e,p,[el.dataset.t]);eddSheet(e.id,p.id);};
ACT.eddOk=el=>{const{e,p}=eddCtx(el);if(!p)return;const x=p.docs.itens.find(z=>z.id===el.dataset.id);if(!x)return;x.ok=!x.ok;save(e);eddSheet(e.id,p.id);
  const K=eddCont(p);if(x.ok&&K.ok===K.tot)toast("party-popper","Documentação completa!",p.n+" · "+e.nome);};
ACT.eddDel=el=>{const{e,p}=eddCtx(el);if(!p)return;p.docs.itens=p.docs.itens.filter(z=>z.id!==el.dataset.id);save(e);eddSheet(e.id,p.id);};
ACT.eddColar=el=>{const{e,p}=eddCtx(el);if(!p)return;
  sheet(`<h2>Colar lista de documentos</h2><p class="small muted" style="margin:4px 0 0">Um documento por linha. Pode colar direto do edital: marcadores e números são tirados sozinhos.</p>
   <label class="fld"><span>Documentos</span><textarea id="eddTx" rows="8" placeholder="RG e CPF&#10;Comprovante de residência&#10;Certidão negativa federal"></textarea></label>
   <div class="btns"><button class="btn full" id="eddTxOk">${ic("plus")} Adicionar à lista</button><button class="btn ghost full" id="eddTxV">Voltar</button></div>`,s=>{
    s.querySelector("#eddTxOk").onclick=()=>{const n=eddAddItens(e,p,s.querySelector("#eddTx").value.split(/\n/));eddSheet(e.id,p.id);toast("clipboard-list",n?(n===1?"1 documento adicionado":`${n} documentos adicionados`):"Nada novo para adicionar","");};
    s.querySelector("#eddTxV").onclick=()=>eddSheet(e.id,p.id);});};
ACT.eddReplicar=el=>{const{e,p}=eddCtx(el);if(!p)return;const O=(e.pess||[]).filter(x=>x.st==="c"&&x.id!==p.id);
  const aplicar=()=>{
    O.forEach(x=>{if(!x.id)x.id=nid();const D=eddDocs(x);if(!D.forma){D.forma=p.docs.forma;D.info=p.docs.info;}if(!D.prazo)D.prazo=p.docs.prazo;const ja=new Set(D.itens.map(z=>normTxt(z.t)));p.docs.itens.forEach(z=>{if(!ja.has(normTxt(z.t)))D.itens.push({id:nid(),t:z.t,ok:false});});});
    save(e);toast("copy","Lista aplicada",O.length===1?"1 projeto":`${O.length} projetos`);eddSheet(e.id,p.id);};
  sheet(`<h2>Usar esta lista nos outros contemplados?</h2><p class="muted">${esc(O.map(x=>x.n).join(", "))} ${O.length===1?"vai":"vão"} receber os documentos que ainda não ${O.length===1?"tem":"têm"}, a forma de envio e o prazo. O que já foi marcado como ok continua igual.</p>
   <div class="btns"><button class="btn full" id="eddRepOk">${ic("copy")} Usar a mesma lista</button><button class="btn ghost full" id="eddRepV">Voltar</button></div>`,s2=>{
    s2.querySelector("#eddRepOk").onclick=aplicar;s2.querySelector("#eddRepV").onclick=()=>eddSheet(e.id,p.id);});};
ACT.eddCopiar=async el=>{const{e,p}=eddCtx(el);if(!p)return;const ok=await eddCopiar(eddMensagem(e,p));
  toast(ok?"copy":"triangle-alert",ok?"Mensagem copiada":"Não deu para copiar",ok?"É só colar no WhatsApp.":"Use “Abrir WhatsApp”.");};
ACT.eddZap=el=>{const{e,p}=eddCtx(el);if(!p)return;const wa=eddWa(eddCtt(p));
  window.open(`https://wa.me/${wa}?text=${encodeURIComponent(eddMensagem(e,p))}`,"_blank","noopener");};

/* ---------- 3. vincular a um contato profissional ---------- */
ACT.eddVincular=el=>{const{e,p}=eddAchar(el.dataset.ed,el.dataset.p);if(!p)return;eddVincSheet(e,p,"");};
function eddVincSheet(e,p,q){const L=all("ctt").sort((a,b)=>String(a.nome).localeCompare(String(b.nome),"pt-BR"));const nq=normTxt(q||"");
  const F=nq?L.filter(c=>normTxt([c.nome,c.org,c.papel].join(" ")).includes(nq)):L;
  sheet(`<button class="eddvolta" data-a="eddVincVolta" data-ed="${e.id}" data-p="${p.id}">${ic("chevron-left")} ${esc(p.n)}</button>
   <h2 style="margin-top:4px">Vincular a um contato</h2><div class="muted small">${esc(e.nome)}</div>
   ${L.length>5?`<div class="search" style="margin-top:12px">${ic("search")}<input id="eddQ" placeholder="Buscar contato" value="${esc(q||"")}" aria-label="Buscar contato"></div>`:""}
   <div style="margin-top:10px">${F.map(c=>`<button class="item eddci" style="width:100%" data-a="eddVinc" data-ed="${e.id}" data-p="${p.id}" data-c="${c.id}" aria-pressed="${p.ctt===c.id}"><span class="mb cttav" ${mstyle("ctt")}>${esc(cttIni(c.nome))}</span><span class="ibody"><b>${esc(c.nome)}</b><span class="tiny faint" style="display:block">${esc([c.papel,c.org].filter(Boolean).join(" · "))}${c.tel?"":" · sem WhatsApp"}</span></span>${p.ctt===c.id?ic("check"):""}</button>`).join("")||`<p class="small muted">${L.length?"Nenhum contato com esse nome.":"Você ainda não tem contatos profissionais."}</p>`}</div>
   <div class="card" style="margin-top:12px"><b>${ic("user-plus")} Novo contato</b>
     <label class="fld"><span>Nome</span><input id="eddCN" value="${esc(q||p.n||"")}"></label>
     <label class="fld"><span>WhatsApp</span><input id="eddCT" inputmode="tel" placeholder="(88) 99999-9999"></label>
     <button class="btn full" style="margin-top:10px" data-a="eddVincNovo" data-ed="${e.id}" data-p="${p.id}">${ic("link")} Criar e vincular</button></div>
   ${p.ctt?`<div class="btns"><button class="btn ghost full" data-a="eddDesv" data-ed="${e.id}" data-p="${p.id}">${ic("x")} Tirar o vínculo</button></div>`:""}`,s=>{
    const i=s.querySelector("#eddQ");if(i){i.addEventListener("input",()=>{clearTimeout(i._t);i._t=setTimeout(()=>{eddVincSheet(e,p,i.value);const n=$("eddQ");if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length);}},250);});}});}
ACT.eddVincVolta=el=>{const{e,p}=eddAchar(el.dataset.ed,el.dataset.p);if(p)eddVoltar(e,p);};
ACT.eddVinc=el=>{const{e,p}=eddAchar(el.dataset.ed,el.dataset.p);if(!p)return;p.ctt=el.dataset.c;save(e);const c=getD(p.ctt);toast("link","Contato vinculado",(c?c.nome:"")+" · "+e.nome);eddVoltar(e,p);};
ACT.eddDesv=el=>{const{e,p}=eddAchar(el.dataset.ed,el.dataset.p);if(!p)return;delete p.ctt;save(e);eddVoltar(e,p);};
ACT.eddVincNovo=el=>{const{e,p}=eddAchar(el.dataset.ed,el.dataset.p);if(!p)return;const n=($("eddCN")||{}).value||"";const t=($("eddCT")||{}).value||"";
  if(!n.trim())return toast("triangle-alert","Escreva o nome","");
  const c={id:"ctt_"+nid(),c:"ctt",nome:n.trim(),papel:"Parceiro de projeto",tel:t.trim(),freq:"90",ult:TODAY(),juntos:e.nome,log:[]};save(c);
  p.ctt=c.id;save(e);toast("user-plus","Contato criado e vinculado",c.nome);eddVoltar(e,p);};
ACT.eddVerCtt=el=>cttSheet(getD(el.dataset.id));

/* ---------- 4. no contato: os editais vinculados a ele ---------- */
function eddDoContato(cid){const R=[];all("ed").forEach(e=>(e.pess||[]).forEach((p,i)=>{if(p.ctt===cid)R.push({e,p,i});}));
  return R.sort((a,b)=>edAno(b.e).localeCompare(edAno(a.e))||(ST_ORD[a.p.st]??1)-(ST_ORD[b.p.st]??1));}
const _cttSheetEdd=cttSheet;
cttSheet=function(c){_cttSheetEdd.apply(this,arguments);if(!c)return;const R=eddDoContato(c.id);if(!R.length)return;const s=$("sheet");if(!s)return;
  const alvo=s.querySelector("#ctL");const lab=alvo?alvo.closest("label"):null;
  const h=`<div class="eddved"><div class="grp" style="margin-top:14px">Editais vinculados</div>${R.map(({e,p})=>{const st=estOf(p.st),K=eddCont(p);
    return `<button class="pp ${st[0]}" data-a="eddIrEd" data-ed="${e.id}" data-p="${p.id}"><span class="grow"><span style="display:block">${esc(e.nome)}</span><small class="tiny faint" style="display:block;font-weight:700">${esc(p.n)} · ${edAno(e)}${p.st==="c"&&K.tot?` · docs ${K.ok}/${K.tot}`:""}</small></span><span class="chip ${st[0]}">${st[0]==="c"?"Contemplado":st[0]==="a"?"Aguardando":"Não"}</span></button>`;}).join("")}</div>`;
  if(lab)lab.insertAdjacentHTML("beforebegin",h);else s.querySelector(".in")?.insertAdjacentHTML("beforeend",h);};
ACT.eddIrEd=el=>{const{e,i}=eddAchar(el.dataset.ed,el.dataset.p);if(!e||i<0)return;closeSheet();
  const E=edsDoAno(edAno(e)),ci=E.indexOf(e);go({v:"editais",ano:edAno(e),ci});
  setTimeout(()=>{const b=$("board");const col=b&&qa(".col",b)[ci];if(col)b.scrollLeft=col.offsetLeft-16;ppSheet(e.id,i);},80);};

/* ---------- 5. no quadro: resumo nos contemplados ---------- */
const _viewEdEdd=VIEWS.editais;
VIEWS.editais=function(){let h=_viewEdEdd.apply(this,arguments);if(!VIEW.ano)return h;
  edsDoAno(VIEW.ano).forEach(e=>(e.pess||[]).forEach((p,i)=>{const c=eddCtt(p),K=eddCont(p);if(!(p.st==="c"&&K.tot)&&!c)return;
    const key=`data-a="ppOpen" data-id="${e.id}" data-i="${i}"><span class="grow"><span style="display:block">${esc(p.n)}</span>`;
    const extra=`<small class="ppdoc">${p.st==="c"&&K.tot?`<span class="${K.ok===K.tot?"ok":""}">${ic("clipboard-check")} Docs ${K.ok}/${K.tot}${p.docs&&p.docs.prazo&&K.ok<K.tot&&diasAte(p.docs.prazo)<=3?` · ${eddPrazoTxt(p.docs.prazo)}`:""}</span>`:""}${c?`<span>${ic("users")} ${esc(eddPrimeiro(c.nome))}</span>`:""}</small>`;
    h=h.replace(key,key+extra);}));
  return h;};
