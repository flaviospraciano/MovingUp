"use strict";
/* ======================================================================
   CONTATOS PROFISSIONAIS · produtores, gestores, curadores e parceiros de projeto
   Cada contato tem uma frequência para retomar a conversa. O app avisa quando passou do tempo.
   Dados: c:"ctt" {nome,papel,org,tel,email,insta,juntos,notas,freq (dias),ult (data),log:[{d,t}]}
   ====================================================================== */
MODS.ctt={n:"Contatos profissionais",ic:"users",c1:"#0F766E",c2:"#14B8A6",g:2,v:{v:"ctt"}};
const CTT_PAPEIS=["Produtor","Gestor público","Curador","Parceiro de projeto","Artista","Patrocinador","Outro"];
const CTT_FREQ=[["30","1 mês"],["60","2 meses"],["90","3 meses"],["180","6 meses"]];
const CTT_F=[{k:"nome",l:"Nome",auto:1,ph:"Ex.: Ana Souza"},{k:"papel",l:"Quem é",type:"select",opts:CTT_PAPEIS,def:"Produtor"},
  {k:"org",l:"Organização ou projeto",ph:"Ex.: Secretaria de Cultura do Crato"},{k:"tel",l:"WhatsApp ou telefone",ph:"(88) 99999-9999"},
  {k:"email",l:"E-mail"},{k:"insta",l:"Instagram",ph:"@perfil"},{k:"juntos",l:"Em que vocês já trabalharam juntos",type:"textarea",ph:"Projetos, eventos, editais…"},
  {k:"freq",l:"Retomar o contato a cada",type:"select",opts:CTT_FREQ,def:"90"},{k:"ult",l:"Último contato",type:"date",def:TODAY},{k:"notas",l:"Anotações",type:"textarea",ph:"Interesses, como gosta de ser abordado, ideias de parceria…"}];
const cttProx=c=>addDays(c.ult||TODAY(),+c.freq||90);
const cttDevidos=()=>all("ctt").filter(c=>cttProx(c)<=TODAY());
const cttIni=n=>String(n||"?").trim().split(/\s+/).slice(0,2).map(p=>p[0]).join("").toUpperCase();
function cttQuando(c){const d=-diasAte(c.ult||TODAY());return d<=0?"falaram hoje":d===1?"falaram ontem":d<60?`último contato há ${d} dias`:`último contato há ${Math.round(d/30)} meses`;}
function cttCard(c){const p=cttProx(c),n=diasAte(p);
  return `<div class="item"><span class="mb cttav" aria-hidden="true">${esc(cttIni(c.nome))}</span><button class="ibody" data-a="cttVer" data-id="${c.id}"><b>${esc(c.nome)}</b>
    <div class="meta"><span class="chip">${esc(c.papel||"Contato")}</span>${c.org?`<span class="chip">${esc(c.org)}</span>`:""}</div>
    <span class="tiny faint">${cttQuando(c)}${n>0?` · retomar ${n<=31?"em "+n+(n===1?" dia":" dias"):fshort(p)}`:""}</span></button></div>`;}

VIEWS.ctt=()=>{let L=all("ctt");const q=(VIEW.q||"").toLowerCase();let h=topbar("Contatos","ctt");
  if(L.length>6)h+=`<div class="search">${ic("search")}<input id="lsq" placeholder="Buscar por nome, projeto ou papel" value="${esc(VIEW.q||"")}" data-in="liSearch"></div>`;
  if(q)L=L.filter(c=>[c.nome,c.org,c.papel,c.juntos,c.notas].join(" ").toLowerCase().includes(q));
  if(!L.length)return `<div class="app">${h}${empty("ctt",q?"Ninguém encontrado":"Sua rede profissional",q?"Tente outro nome.":"Produtores, gestores, curadores e parceiros. O app lembra quando é hora de retomar cada conversa.",q?"":`<button class="btn sm" data-a="cttNovo">${ic("plus")} Adicionar contato</button>`)}</div>`;
  L.sort((a,b)=>cttProx(a).localeCompare(cttProx(b)));const t=TODAY(),lim=addDays(t,30);
  const G=[["Retomar agora",L.filter(c=>cttProx(c)<=t)],["Nos próximos 30 dias",L.filter(c=>cttProx(c)>t&&cttProx(c)<=lim)],["Em dia",L.filter(c=>cttProx(c)>lim).sort((a,b)=>a.nome.localeCompare(b.nome))]];
  G.forEach(([g,arr])=>{if(arr.length)h+=`<div class="grp">${g}<span class="chip">${arr.length}</span></div>`+arr.map(cttCard).join("");});
  return `<div class="app">${h}</div>${fab("cttNovo","Novo contato")}`;};

ACT.cttNovo=()=>cttForm(null);
ACT.cttVer=el=>cttSheet(getD(el.dataset.id));
function cttLinks(c){const L=[];const dig=String(c.tel||"").replace(/\D/g,"");
  if(dig){const wa=dig.length<=11?"55"+dig:dig;L.push(`<a class="btn ghost sm" href="https://wa.me/${wa}" target="_blank" rel="noopener">${ic("message-circle")} WhatsApp</a>`,`<a class="btn ghost sm" href="tel:+${wa}">${ic("phone")} Ligar</a>`);}
  if(c.email)L.push(`<a class="btn ghost sm" href="mailto:${esc(c.email)}">${ic("mail")} E-mail</a>`);
  if(c.insta)L.push(`<a class="btn ghost sm" href="https://instagram.com/${esc(String(c.insta).replace(/^@/,""))}" target="_blank" rel="noopener">${ic("at-sign")} Instagram</a>`);
  return L.length?`<div class="wrap-row" style="margin-top:12px">${L.join("")}</div>`:"";}
function cttSheet(c){if(!c)return;const p=cttProx(c),n=diasAte(p),log=(c.log||[]).slice().sort((a,b)=>b.d.localeCompare(a.d));
  sheet(`<div class="row"><span class="mb cttav" ${mstyle("ctt")}>${esc(cttIni(c.nome))}</span><div class="grow"><h2 style="margin:0">${esc(c.nome)}</h2><div class="muted small">${esc([c.papel,c.org].filter(Boolean).join(" · "))}</div></div><button class="ib" id="ctE" aria-label="Editar">${ic("pencil")}</button></div>
   ${cttLinks(c)}
   <div class="note" style="margin-top:14px">${ic(n<=0?"bell":"calendar")} ${cttQuando(c)[0].toUpperCase()+cttQuando(c).slice(1)}. ${n<=0?"Hora de retomar.":"Retomar em "+fdate(p)+"."}</div>
   <label class="fld"><span>Registrar um contato de hoje</span><input id="ctL" placeholder="Sobre o que falaram? (opcional)" data-enter="cttReg" data-id="${c.id}"></label>
   <button class="btn full" data-a="cttReg" data-id="${c.id}">${ic("check")} Falei com ${esc(String(c.nome).split(" ")[0])} hoje</button>
   ${c.juntos?`<div class="small" style="margin-top:16px"><b>Trabalharam juntos em</b><div class="muted" style="white-space:pre-wrap">${esc(c.juntos)}</div></div>`:""}
   ${c.notas?`<div class="small" style="margin-top:12px"><b>Anotações</b><div class="muted" style="white-space:pre-wrap">${esc(c.notas)}</div></div>`:""}
   ${log.length?`<div class="small" style="margin-top:16px"><b>Histórico</b>${log.slice(0,12).map(x=>`<div class="ctlog"><span class="faint">${fdate(x.d)}</span><span>${esc(x.t||"Contato registrado")}</span></div>`).join("")}</div>`:""}`,
  s=>{s.querySelector("#ctE").onclick=()=>cttForm(c);});}
ACT.cttReg=el=>{const c=getD(el.dataset.id);if(!c)return;const i=$("ctL");const t=i?i.value.trim():"";c.log=c.log||[];c.log.push({d:TODAY(),t});c.ult=TODAY();save(c);closeSheet();rr();
  toast("handshake","Contato registrado","Próximo em "+fdate(cttProx(c))+".");};
function cttForm(c){sheet(`<h2>${c?"Editar contato":"Novo contato"}</h2>${CTT_F.map(f=>fieldHTML(f,c?c[f.k]:null)).join("")}
   <div class="btns"><button class="btn full" id="ctS">${c?"Salvar":"Adicionar contato"}</button>${c?`<button class="btn danger full" id="ctX">Apagar</button>`:""}</div>`,s=>{
  s.querySelector("#ctS").onclick=()=>{const o=readFields(CTT_F,s);if(!o.nome)return toast("triangle-alert","Escreva o nome","");if(!o.ult)o.ult=TODAY();
    const d=c||{id:"ctt_"+nid(),c:"ctt",log:[]};Object.assign(d,o);save(d);closeSheet();rr();};
  const x=s.querySelector("#ctX");if(x)x.onclick=()=>confirmSheet("Apagar este contato?",c.nome,"Apagar",()=>{removeDoc(c.id);rr();});});}
