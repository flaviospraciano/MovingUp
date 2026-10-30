"use strict";
/* ======================================================================
   PROJETOS PESSOAIS · Curso de projetos culturais
   ====================================================================== */
const AULA_ST=[["ideia","Ideia",""],["rot","Roteiro","n"],["grav","Gravação","a"],["edi","Edição","a"],["pub","Publicada","c"]];
const CURSO_DEF={nome:"Curso de projetos culturais",plat:"",lanc:"",pub:"",desc:""};
const CURSO_SUG=[["Módulo 1 · Fundamentos",["O que é um projeto cultural","Políticas de fomento: PNAB, Lei Paulo Gustavo e Cultura Viva","Como ler um edital sem se perder"]],
 ["Módulo 2 · Elaboração do projeto",["Objeto e objetivos","Justificativa que convence","Metas, indicadores e cronograma","Público, acessibilidade e contrapartidas","Orçamento e planilha de custos"]],
 ["Módulo 3 · Inscrição",["Portfólio que comprova trajetória","Inscrição no Mapa Cultural passo a passo","Documentos, cotas e erros que desclassificam"]],
 ["Módulo 4 · Resultado, execução e prestação de contas",["Resultado, recurso e habilitação","Executando o projeto e registrando tudo","Prestação de contas sem medo"]]];
VIEWS.curso=()=>{const C=single("curso",CURSO_DEF);const A=all("aula").sort((a,b)=>(a.o||0)-(b.o||0));let h=topbar(C.nome||"Curso","curso",`<button class="ib" data-a="cursoEdit" aria-label="Editar curso">${ic("pencil")}</button>`);
  const cnt=k=>A.filter(a=>(a.st||"ideia")===k).length,pub=cnt("pub"),dur=sum(A.map(a=>+a.dur||0));
  h+=`<div class="hero"><div class="muted small">${C.plat?esc(C.plat)+" · ":""}${C.lanc?"Lançamento: "+fdate(C.lanc):"Defina a data de lançamento"}</div><h2>${esc(C.nome||"Curso")}</h2>${C.pub?`<div class="muted small">Para: ${esc(C.pub)}</div>`:""}
   <div class="stats"><div><b>${A.length}</b><span>aulas</span></div><div><b>${pub}</b><span>publicadas</span></div><div><b>${dur?mmTot(dur*60).split(" ")[0]:0}</b><span>min de conteúdo</span></div></div>
   ${A.length?`<div class="bar"><i style="width:${pub/A.length*100}%"></i></div>`:""}</div>`;
  if(A.length)h+=`<div class="pipe">${AULA_ST.map(([k,n,c])=>`<div class="${c}"><b>${cnt(k)}</b><span>${n}</span></div>`).join("")}</div>`;
  const mods=[...new Set(A.map(a=>a.mod||"Sem módulo"))];
  h+=A.length?mods.map(md=>{const L=A.filter(a=>(a.mod||"Sem módulo")===md);return `<div class="grp">${esc(md)}<span class="chip">${L.filter(a=>a.st==="pub").length}/${L.length}</span></div>`+L.map(a=>{const st=AULA_ST.find(s=>s[0]===(a.st||"ideia"));const ix=AULA_ST.indexOf(st);
     return `<div class="item"><button class="ck ${a.st==="pub"?"on":""}" data-a="aulaNext" data-id="${a.id}" aria-label="Avançar etapa">${ic(a.st==="pub"?"check":"chevron-right")}</button><button class="ibody" data-a="aulaEdit" data-id="${a.id}"><b class="${a.st==="pub"?"strike":""}">${esc(a.t)}</b><div class="meta"><span class="chip ${st[2]}">${st[1]}</span>${a.dur?`<span class="chip">${a.dur} min</span>`:""}${a.roteiro?`<span class="chip">${ic("notebook-pen")} roteiro</span>`:""}</div><div class="steps">${AULA_ST.map((s,j)=>`<i class="${j<=ix?"on":""}"></i>`).join("")}</div></button></div>`;}).join("");}).join("")
    :empty("curso","Monte o seu curso","Crie as aulas e acompanhe cada uma do roteiro à publicação.",`<button class="btn sm" data-a="cursoSug">${ic("sparkles")} Usar estrutura sugerida</button>`);
  h+=`<div class="qadd" style="margin-top:14px"><input id="auN" placeholder="Nova aula" data-enter="aulaAdd" aria-label="Nova aula"><button class="btn" data-a="aulaAdd" aria-label="Adicionar aula">${ic("plus")}</button></div>`;
  return `<div class="app">${h}</div>`;};
ACT.cursoSug=()=>{let o=0;CURSO_SUG.forEach(([md,L])=>L.forEach(t=>save({id:"aula_"+nid()+o,c:"aula",t,mod:md,st:"ideia",o:o++*10})));rr();toast("sparkles","Estrutura criada",o+" aulas em 4 módulos. Ajuste do seu jeito.");};
ACT.aulaAdd=()=>{const i=$("auN");const t=i.value.trim();if(!t)return i.focus();const A=all("aula");const last=A.sort((a,b)=>(b.o||0)-(a.o||0))[0];save({id:"aula_"+nid(),c:"aula",t,mod:last?last.mod:"Módulo 1",st:"ideia",o:(last?last.o:0)+10});rr();const n=$("auN");if(n)n.focus();};
ACT.aulaNext=el=>{const a=getD(el.dataset.id);const ix=AULA_ST.findIndex(s=>s[0]===(a.st||"ideia"));a.st=AULA_ST[(ix+1)%AULA_ST.length][0];save(a);rr();if(a.st==="pub")toast("party-popper","Aula publicada!",a.t);};
ACT.aulaEdit=el=>{const a=getD(el.dataset.id);const mods=[...new Set(all("aula").map(x=>x.mod).filter(Boolean))];
  const F=[{k:"t",l:"Título da aula"},{k:"mod",l:"Módulo",ph:"Ex.: Módulo 2 · Elaboração do projeto"},{k:"st",l:"Etapa",type:"status",opts:AULA_ST},{k:"dur",l:"Duração (min)",type:"number"},{k:"roteiro",l:"Roteiro / tópicos da aula",type:"textarea",tall:1},{k:"link",l:"Link do vídeo",ph:"https://…"},{k:"obs",l:"Observações",type:"textarea"}];
  sheet(`<h2>Aula</h2>${F.map(f=>fieldHTML(f,a[f.k])).join("")}${mods.length?`<div class="wrap-row" style="margin-top:-6px">${mods.map(m=>`<button class="chip" data-a="aulaMod" data-m="${esc(m)}">${esc(m)}</button>`).join("")}</div>`:""}
   ${a.link?`<a class="btn ghost full" style="margin-top:10px" href="${esc(a.link)}" target="_blank" rel="noopener">${ic("play")} Abrir vídeo</a>`:""}
   <div class="btns"><button class="btn full" id="aS">Salvar</button><button class="btn danger full" id="aX">Apagar aula</button></div>`,s=>{
   s.querySelector("#aS").onclick=()=>{const o=readFields(F,s);if(o.link&&!/^https?:\/\//i.test(o.link))o.link="https://"+o.link;Object.assign(a,o);if(!a.t)a.t="Aula";save(a);closeSheet();rr();};
   s.querySelector("#aX").onclick=()=>confirmSheet("Apagar esta aula?",a.t,"Apagar",()=>{removeDoc(a.id);rr();});});};
ACT.aulaMod=el=>{const i=$("f_mod");if(i)i.value=el.dataset.m;};
ACT.cursoEdit=()=>{const C=single("curso",CURSO_DEF);const F=[{k:"nome",l:"Nome do curso"},{k:"pub",l:"Para quem é",ph:"Ex.: Artistas e grupos culturais iniciantes em editais"},{k:"plat",l:"Plataforma",ph:"Ex.: YouTube, Hotmart"},{k:"lanc",l:"Data de lançamento",type:"date"},{k:"desc",l:"Promessa do curso",type:"textarea"}];
  sheet(`<h2>Seu curso</h2>${F.map(f=>fieldHTML(f,C[f.k])).join("")}<div class="btns"><button class="btn full" id="cS">Salvar</button></div>`,s=>{s.querySelector("#cS").onclick=()=>{Object.assign(C,readFields(F,s));save(C);closeSheet();rr();};});};
