"use strict";
/* ======================================================================
   MARATONA · planilha automática e adaptativa (base de 39 semanas, ~9 meses)
   · Parte do seu ritmo atual de 5 km e de um volume inicial de até 20 km por semana.
   · Fases: Base → Construção → Específico → Pico → Polimento. Semana de alívio a cada 4.
   · Toda semana fechada decide a próxima: cumpriu bem → avança; cumpriu em parte → repete;
     cumpriu pouco ou sentiu dor → recua. A data prevista da prova se ajusta sozinha. Parar, nunca.
   · Treino perdido: o longão e o treino de qualidade são remarcados na mesma semana quando dá;
     rodagens perdidas não são empilhadas.
   · Capoeira ou academia na véspera de um treino forte → ele vira rodagem leve.
   · Corridas registradas pelo check de "Corridas" contam automaticamente.
   · O ritmo se atualiza com os treinos (esforço percebido) e com os testes de 5 km.
   Dados: um documento c:"mpl" com a configuração e as semanas geradas.
   ====================================================================== */
const MP_DIAS=["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"],MP_DIASL=["segunda","terça","quarta","quinta","sexta","sábado","domingo"];
const dowOf=d=>(pd(d).getDay()+6)%7;
const fpace=s=>Math.floor(s/60)+":"+pad(Math.round(s%60))+"/km";
const kmR=v=>Math.max(3,Math.round(v*2)/2);
/* nível k (0 a 38): volume semanal e longão. Alívio a cada 4 semanas; polimento nas 3 últimas. */
function mpNivel(i,vIni){const N=[];let v=vIni,lg=Math.min(9,Math.max(7.5,vIni*.44));
  for(let k=0;k<=38;k++){const corte=k<36&&(k+1)%4===0;let fase=k<12?"Base":k<24?"Construção":k<32?"Específico":k<36?"Pico":"Polimento";
    if(k>0&&k<36&&!corte){v=Math.min(56,v*1.065);lg=Math.min(k>=32?32:30,lg+.95);}
    let vol=corte?v*.78:v,long=corte?lg*.7:lg;
    if(k===36){vol=v*.72;long=21;}if(k===37){vol=v*.5;long=14;}if(k===38){vol=v*.3+42.2;long=42.2;fase="Prova";}
    N.push({k,fase,corte,vol:Math.round(vol*2)/2,long:Math.round(long*2)/2});}
  return N[Math.max(0,Math.min(38,i))];}
const MP_ULT=38;
const mpDoc=()=>single("mpl",{ini:"",p5:410,vIni:18,dias:[1,3,5,6],longao:5,nivel:0,W:{},hist:[],criado:""});
function mpPaces(p5){return{leve:p5*1.19,longo:p5*1.21,rec:p5*1.25,limiar:p5*1.06,int:p5*.985,mara:p5*1.136};}
const mpSemIdx=(P,d)=>Math.floor((pd(d||TODAY())-pd(P.ini))/(7*864e5))+1;
const mpWIni=(P,k)=>addDays(P.ini,(k-1)*7);

/* ---------- monta uma semana ---------- */
function mpGerar(P,k){const ini=mpWIni(P,k),N=mpNivel(P.nivel,P.vIni),pc=mpPaces(P.p5),R=N.vol<24?3:4;
  const outros=P.dias.filter(d=>d!==P.longao).sort((a,b)=>a-b);let qd=outros[0],ed=outros[1],rd=R===4?outros[2]:null;if(rd==null&&R===4)rd=outros.find(d=>d!==qd&&d!==ed);
  const resto=N.vol-N.long;let q,e,r=0;if(R===3){q=resto*.5;e=resto-q;}else{q=resto*.38;e=resto*.37;r=resto-q-e;}
  const teste=[5,11,17,23,29].includes(P.nivel),fase=N.fase,S=[];
  const mk=(dia,tipo,nome,km,pace,desc)=>{const d=addDays(ini,dia);if(P.criado&&d<P.criado)return;S.push({id:nid(),d,tipo,nome,km:kmR(km),pace:Math.round(pace),desc,st:""});};
  /* treino de qualidade da semana */
  if(N.fase==="Prova")mk(qd,"leve","Rodagem leve com 4 acelerações",Math.min(6,q),pc.leve,"Solte as pernas. Nos últimos minutos, 4 acelerações de 15 s.");
  else if(teste)mk(qd,"teste","Teste de 5 km",q<9?Math.max(q,8):q,P.p5,"Aqueça 2 km leve, corra 5 km no seu melhor ritmo sustentável e desaqueça. Registre o tempo dos 5 km: ele recalcula todos os seus ritmos.");
  else if(P.nivel<2)mk(qd,"leve","Rodagem leve",q,pc.leve,"Ritmo de conversa: dá para falar frases inteiras.");
  else if(fase==="Base")mk(qd,"qual","Rodagem com acelerações",q,pc.leve,"Corra leve e, no fim, faça 6 acelerações de 20 s (rápido e solto), voltando ao trote entre elas.");
  else if(fase==="Construção")mk(qd,"qual",P.nivel%2?"Fartlek":"Corrida no limiar",q,pc.limiar,P.nivel%2?"Aqueça 2 km. Depois alterne 1 min forte e 2 min leve, 8 vezes. Desaqueça no fim.":`Aqueça 2 km leve, corra ${kmR(Math.max(2,q-3))} km em ${fpace(pc.limiar)} (forte, mas controlado) e desaqueça 1 km.`);
  else if(fase==="Polimento")mk(qd,"qual","Ritmo de prova curto",q,pc.mara,`Aqueça 2 km e corra ${kmR(Math.max(3,q-3))} km no ritmo de maratona (${fpace(pc.mara)}).`);
  else mk(qd,"qual",P.nivel%2?"Intervalado de 1 km":"Ritmo de maratona",q,P.nivel%2?pc.int:pc.mara,P.nivel%2?`Aqueça 2 km. ${Math.min(8,Math.max(4,Math.round((q-3)/1.4)))} × 1 km em ${fpace(pc.int)}, com 2 min de trote entre eles. Desaqueça.`:`Aqueça 2 km e corra ${kmR(Math.max(4,q-3))} km no ritmo de maratona (${fpace(pc.mara)}). Desaqueça 1 km.`);
  mk(ed,"leve","Rodagem leve",e,pc.leve,"Ritmo de conversa. Se o corpo estiver pesado, pode ir mais devagar.");
  if(R===4&&rd!=null)mk(rd,"rec","Regenerativo",r,pc.rec,"Bem leve, só para soltar. Cadência curta e relaxada.");
  if(N.fase==="Prova")mk(P.longao,"prova","MARATONA",42.2,pc.mara,"Dia da prova. Comece mais devagar que o ritmo alvo e deixe o fim para quem guardou energia.");
  else mk(P.longao,"longao",N.corte?"Longão leve (semana de alívio)":"Longão",N.long,pc.longo,(fase==="Específico"||fase==="Pico")&&!N.corte&&P.nivel%2===0?`Longo e leve; os últimos ${Math.min(6,Math.round(N.long/5))} km no ritmo de maratona (${fpace(pc.mara)}). Leve água e treine a hidratação.`:"Bem leve, ritmo de conversa. O objetivo é tempo em pé, não velocidade.");
  S.sort((a,b)=>a.d.localeCompare(b.d));
  return{k,ini,nivel:P.nivel,fase:N.fase,corte:N.corte,alvo:Math.round(sum(S.map(s=>s.km))*2)/2,sess:S,fechada:false};}

/* ---------- adaptação ---------- */
const kmCorrido=d=>{const t=getD(tid("run",d));return t?(+t.km||0):0;};
const treinoForteEm=d=>trkHas("cap",d)||trkHas("gym",d);
function mpFechar(P,W){const ok=W.sess.filter(s=>s.st==="ok");const vinc=new Set(ok.map(s=>s.d));
  let feito=sum(ok.map(s=>+(s.real&&s.real.km)||s.km));for(let i=0;i<7;i++){const d=addDays(W.ini,i);if(!vinc.has(d))feito+=kmCorrido(d);}
  const c=W.alvo?feito/W.alvo:1,R=ok.map(s=>s.real&&s.real.rpe).filter(Boolean),rpe=R.length?sum(R)/R.length:5,dor=W.sess.some(s=>s.real&&s.real.dor==="dor")||W.dor;
  let dec,nv=P.nivel;
  if(dor){nv=Math.max(0,P.nivel-2);dec="Você relatou dor: recuei o plano para o corpo se recuperar.";}
  else if(c>=.85&&rpe<=7.5){nv=Math.min(MP_ULT,P.nivel+1);dec="Semana cumprida: o plano avança.";}
  else if(c>=.6){dec=c>=.85?"Cumpriu, mas com muito esforço: repito o nível para consolidar.":"Cumpriu boa parte: repito o nível na próxima semana.";}
  else{nv=Math.max(0,P.nivel-1);dec="Semana difícil: recuei um passo para você voltar firme. O importante é não parar.";}
  W.fechada=true;W.feito=Math.round(feito*10)/10;W.cumprido=Math.round(c*100);W.decisao=dec;P.hist=(P.hist||[]).concat([{k:W.k,c:W.cumprido,de:P.nivel,para:nv}]).slice(-60);P.nivel=nv;}
function mpLivre(W,d){return !W.sess.some(s=>s.d===d&&s.st!=="perdido"&&s.st!=="movido"&&s.st!=="trocado");}
function mpRemarcar(W,s,hoje){const duros=W.sess.filter(x=>x!==s&&["qual","longao","teste"].includes(x.tipo)&&!["perdido","movido","trocado"].includes(x.st));
  const vizinhoDuro=d=>duros.some(x=>Math.abs((pd(x.d)-pd(d))/864e5)<=1);
  for(let i=0;i<7;i++){const d=addDays(W.ini,i);if(d<hoje)continue;const fim=addDays(W.ini,6);if(d>fim)break;
    if(vizinhoDuro(d))continue;const nele=W.sess.find(x=>x.d===d&&x.st===""&&x!==s);
    if(nele&&nele.tipo!=="leve"&&nele.tipo!=="rec")continue;
    if(nele){nele.st="trocado";nele.nota="Trocado pelo "+s.nome.toLowerCase();}
    const novo={...s,id:nid(),d,st:"",nota:"Remarcado de "+MP_DIASL[dowOf(s.d)]};s.st="movido";W.sess.push(novo);W.sess.sort((a,b)=>a.d.localeCompare(b.d));return novo;}
  s.st="perdido";return null;}
function mpAtualiza(){const P=mpDoc();if(!P.ini)return P;const t=TODAY();let mud=false;P.W=P.W||{};
  const k=mpSemIdx(P,t);let ult=Math.max(0,...Object.keys(P.W).map(Number));
  if(!ult){P.W[1]=mpGerar(P,1);ult=1;mud=true;}
  for(let j=ult;j<k;j++){const W=P.W[j];if(W&&!W.fechada){mpCheckAuto(W);mpFechar(P,W);mud=true;}if(!P.W[j+1]){P.W[j+1]=mpGerar(P,j+1);mud=true;}}
  const W=P.W[Math.min(k,Math.max(...Object.keys(P.W).map(Number)))];
  if(W&&!W.fechada){if(mpCheckAuto(W))mud=true;
    W.sess.filter(s=>s.st===""&&s.d<t).forEach(s=>{if(["longao","qual","teste"].includes(s.tipo))mpRemarcar(W,s,t);else{s.st="perdido";s.nota="Não deu: sem problema, o volume da semana se ajusta.";}mud=true;});
    W.sess.filter(s=>s.st===""&&s.d>=t&&(s.tipo==="qual"||s.tipo==="teste")).forEach(s=>{const v=addDays(s.d,-1);if(v<=t&&treinoForteEm(v)&&!s.ajCruz){s.ajCruz=true;s.tipoOrig=s.tipo;s.tipo="leve";s.nome="Rodagem leve";s.km=kmR(s.km*.85);s.pace=Math.round(mpPaces(P.p5).leve);s.desc="Treino forte ontem (capoeira ou academia): hoje vale mais rodar leve e chegar inteiro ao longão.";s.nota="Ajustado pelo treino de ontem";mud=true;}});}
  if(mud)save(P);return P;}
function mpCheckAuto(W){let m=false;W.sess.forEach(s=>{if(s.st===""||s.st==="perdido"){const km=kmCorrido(s.d);if(km>0&&!W.sess.some(x=>x!==s&&x.d===s.d&&x.st==="ok")){s.st="ok";s.real={km,min:0,rpe:5,dor:"",auto:true};s.nota="Registrado pelo check de Corridas";m=true;}}});return m;}
const mpAtual=P=>{const k=mpSemIdx(P);const ks=Object.keys(P.W||{}).map(Number);return P.W[Math.min(k,Math.max(0,...ks))]||null;};
function mpPrevisao(P){const W=mpAtual(P);if(!W)return null;const falta=MP_ULT-P.nivel;return addDays(W.ini,falta*7+P.longao);}
function mpResumoIA(){const P=mpDoc();if(!P.ini)return"";const W=mpAtual(P),pc=mpPaces(P.p5),pr=mpPrevisao(P);
  return `Nível ${P.nivel}/${MP_ULT}, ritmo de 5 km ${fpace(P.p5)}, leve ${fpace(pc.leve)}, maratona ${fpace(pc.mara)}. Previsão da prova: ${pr}.`+(W?` Semana atual (${W.ini}, ${W.fase}): alvo ${W.alvo} km; treinos: ${W.sess.map(s=>`${s.d} ${s.nome} ${s.km} km [${s.st||"a fazer"}${s.real?" "+s.real.km+" km esforço "+s.real.rpe:""}]`).join("; ")}.`:"")
    +` Semanas anteriores: ${Object.values(P.W).filter(w=>w.fechada).slice(-8).map(w=>`${w.ini}: ${w.feito}/${w.alvo} km (${w.cumprido}%)`).join("; ")}`;}

/* ---------- tela ---------- */
const _maraVelha=VIEWS.mara;
VIEWS.mara=function(){if(VIEW.velha)return _maraVelha.apply(this,arguments);const P=mpAtualiza();
  if(!P.ini)return `<div class="app">${topbar("Maratona","mara")}${mpConfigHTML(P,true)}${all("mp").length?`<button class="lk small" style="margin-top:14px" data-a="mpVelha">Ver a planilha antiga</button>`:""}</div>`;
  const t=TODAY(),W=mpAtual(P),pc=mpPaces(P.p5),N=mpNivel(P.nivel,P.vIni),pr=mpPrevisao(P),hoje=W&&W.sess.filter(s=>s.d===t&&!["movido","trocado"].includes(s.st));
  let h=topbar("Maratona","mara",`<button class="ib" style="margin-left:auto" data-a="mpCfg" aria-label="Ajustes do plano">${ic("settings")}</button>`);
  const pct=Math.round(P.nivel/MP_ULT*100);
  h+=`<div class="hero"><div class="muted small">Semana ${P.nivel+1} de ${MP_ULT+1} · ${esc(W?W.fase:N.fase)}${W&&W.corte?" · alívio":""}</div><h2>Maratona prevista: ${pr?esc(flong(pr).split("·")[0].trim()):"—"}</h2>
    <div class="bar"><i style="width:${pct}%"></i></div>
    <div class="stats"><div><b>${W?Math.round(sum(W.sess.filter(s=>s.st==="ok").map(s=>+(s.real&&s.real.km)||s.km))):0}/${W?W.alvo:0}</b><span>km na semana</span></div><div><b>${fpace(P.p5).replace("/km","")}</b><span>ritmo de 5 km</span></div><div><b>${mpSeqSemanas(P)}</b><span>semanas sem parar</span></div></div></div>`;
  /* hoje */
  if(hoje&&hoje.length)hoje.forEach(s=>{h+=mpCardHoje(s,W);});
  else{const cross=treinoForteEm(t);h+=`<div class="card" style="margin-top:12px"><b>${ic("moon")} Hoje: descanso de corrida</b><p class="small muted" style="margin:4px 0 0">${cross?"Treino de capoeira ou academia registrado: ótimo complemento.":"Descansar também é treino. Capoeira, academia ou mobilidade leve combinam com hoje."}</p></div>`;}
  /* semana */
  if(W){h+=`<div class="sec"><h2>Esta semana</h2><span class="chip">${W.alvo} km</span></div>`;
    for(let i=0;i<7;i++){const d=addDays(W.ini,i),S=W.sess.filter(s=>s.d===d),cr=[trkHas("cap",d)?"Capoeira":"",trkHas("gym",d)?"Academia":""].filter(Boolean);
      h+=`<div class="mpd ${d===t?"hoje":""}"><div class="mpdn"><b>${MP_DIAS[i]}</b><span>${pd(d).getDate()}</span></div><div class="grow">${S.length?S.map(s=>mpLinha(s)).join(""):`<span class="small faint">Descanso de corrida</span>`}${cr.length?`<div class="tiny" style="margin-top:4px">${cr.map(c=>`<span class="chip m">${ic(c==="Capoeira"?"swords":"dumbbell")} ${c}</span>`).join(" ")}</div>`:""}</div></div>`;}}
  h+=`<div class="sec"><h2>Seus ritmos</h2></div><div class="card small"><div class="ctlog"><span class="grow">Rodagem leve e longão</span><b>${fpace(pc.leve)} a ${fpace(pc.longo)}</b></div><div class="ctlog"><span class="grow">Limiar (forte e controlado)</span><b>${fpace(pc.limiar)}</b></div><div class="ctlog"><span class="grow">Intervalado de 1 km</span><b>${fpace(pc.int)}</b></div><div class="ctlog"><span class="grow">Ritmo de maratona</span><b>${fpace(pc.mara)}</b></div>
    <p class="tiny muted" style="margin:8px 0 0">Calculados do seu ritmo de 5 km e atualizados pelos treinos e pelos testes. Em dia quente ou de cansaço, vale correr pelo esforço, não pelo relógio.</p></div>`;
  const F=Object.values(P.W).filter(w=>w.fechada).sort((a,b)=>b.k-a.k).slice(0,6);
  if(F.length)h+=`<div class="sec"><h2>Semanas anteriores</h2></div><div class="card small">${F.map(w=>`<div class="ctlog"><span class="faint">${fdate(w.ini)}</span><span class="grow">${w.feito} de ${w.alvo} km<span class="tiny faint" style="display:block">${esc(w.decisao||"")}</span></span><b>${w.cumprido}%</b></div>`).join("")}</div>`;
  h+=`<p class="tiny faint" style="margin-top:14px">Corridas marcadas no check de "Corridas" contam aqui automaticamente. ${all("mp").length?`<button class="lk tiny" data-a="mpVelha">Planilha antiga</button>`:""}</p>`;
  return `<div class="app">${h}</div>`;};
function mpLinha(s){const cls=s.st==="ok"?"c":s.st==="perdido"?"n":s.st===""?"":"m";const rot={ok:"feito",perdido:"não feito",movido:"remarcado",trocado:"trocado"}[s.st];
  return `<div class="mpl ${s.st}"><b class="${["movido","trocado","perdido"].includes(s.st)?"muted":""}">${esc(s.nome)} · ${String(s.km).replace(".",",")} km</b>${rot?` <span class="chip ${cls}">${rot}</span>`:""}${s.st===""?`<span class="tiny faint" style="display:block">${fpace(s.pace)}</span>`:s.real&&s.st==="ok"?`<span class="tiny faint" style="display:block">${String(s.real.km).replace(".",",")} km${s.real.min?" em "+s.real.min+" min":""}</span>`:""}${s.nota?`<span class="tiny faint" style="display:block">${esc(s.nota)}</span>`:""}</div>`;}
function mpCardHoje(s,W){if(s.st==="ok")return `<div class="card" style="margin-top:12px;border-color:var(--ok)"><b>${ic("circle-check")} ${esc(s.nome)} feito</b><p class="small muted" style="margin:4px 0 0">${String((s.real&&s.real.km)||s.km).replace(".",",")} km. Um degrau a mais rumo aos 42 km.</p></div>`;
  if(s.st==="perdido")return `<div class="card" style="margin-top:12px"><b>${esc(s.nome)}: não deu hoje</b><p class="small muted" style="margin:4px 0 0">${esc(s.nota||"A semana já foi ajustada.")} O que importa é não parar.</p></div>`;
  return `<div class="card mphoje" ${mstyle("mara")}><div class="muted small">Treino de hoje</div><h3 style="margin:2px 0 6px;font:800 1.25rem var(--disp)">${esc(s.nome)} · ${String(s.km).replace(".",",")} km</h3>
    <div class="meta"><span class="chip m">${ic("timer")} ${fpace(s.pace)}</span>${s.nota?`<span class="chip">${esc(s.nota)}</span>`:""}</div><p class="small" style="margin:8px 0 0">${esc(s.desc)}</p>
    <div class="btns h" style="margin-top:12px"><button class="btn" data-a="mpOk" data-id="${s.id}">${ic("check")} Cumpri</button><button class="btn ghost" data-a="mpNao" data-id="${s.id}">Não consegui</button></div></div>`;}
function mpSeqSemanas(P){const F=Object.values(P.W||{}).filter(w=>w.fechada).sort((a,b)=>b.k-a.k);let n=0;for(const w of F){if(w.feito>0)n++;else break;}return n;}
const mpSess=id=>{const P=mpDoc();for(const W of Object.values(P.W||{})){const s=W.sess.find(x=>x.id===id);if(s)return{P,W,s};}return{};};
ACT.mpVelha=()=>{VIEW.velha=1;rr();};
ACT.mpOk=el=>{const {P,W,s}=mpSess(el.dataset.id);if(!s)return;const teste=s.tipo==="teste";
  sheet(`<h2>${ic("check")} ${esc(s.nome)}</h2><p class="muted small" style="margin:4px 0 0">Planejado: ${String(s.km).replace(".",",")} km em ${fpace(s.pace)}</p>
   <div class="two"><label class="fld"><span>Distância (km)</span><input id="mkK" inputmode="decimal" value="${String(teste?5:s.km).replace(".",",")}"></label><label class="fld"><span>${teste?"Tempo dos 5 km (mm:ss)":"Tempo total (minutos, mm:ss ou h:mm)"}</span><input id="mkT" inputmode="text" placeholder="${teste?"34:10":"Opcional"}"></label></div>
   <div class="fld"><span>Esforço</span><div class="seg" data-k="mkR">${[[3,"Leve"],[5,"Moderado"],[7,"Forte"],[9,"Exaustivo"]].map(([v,n],i)=>`<button type="button" data-a="seg" data-v="${v}" aria-pressed="${i===(s.tipo==="leve"||s.tipo==="rec"||s.tipo==="longao"?0:1)}">${n}</button>`).join("")}</div></div>
   <div class="fld"><span>Dor ou incômodo</span><div class="seg" data-k="mkD"><button type="button" data-a="seg" data-v="" aria-pressed="true">Nenhum</button><button type="button" data-a="seg" data-v="inc" aria-pressed="false">Incômodo leve</button><button type="button" data-a="seg" data-v="dor" aria-pressed="false">Dor</button></div></div>
   <div class="btns"><button class="btn full" id="mkOk">${ic("check")} Registrar treino</button></div>`,sh=>{
  sh.querySelector("#mkOk").onclick=()=>{const km=num(sh.querySelector("#mkK").value)||s.km,tt=sh.querySelector("#mkT").value.trim();let seg=0;
    if(tt){const p=tt.replace(/[h']/g,":").split(":").map(x=>+x||0);seg=p.length===3?p[0]*3600+p[1]*60+p[2]:p.length===2?(!teste&&p[0]<6&&km>12?p[0]*3600+p[1]*60:p[0]*60+p[1]):p[0]*60;}
    const rpe=+segVal(sh,"mkR")||5,dor=segVal(sh,"mkD")||"";
    s.st="ok";s.real={km,min:seg?Math.round(seg/60):0,rpe,dor};
    /* aprendizado do ritmo */
    const pc=mpPaces(P.p5),antes=P.p5;
    if(teste&&seg>600&&seg<3600)P.p5=clamp(Math.round(seg/(km||5)),240,600);
    else if(seg&&km>=3){const ritmo=seg/km;if((s.tipo==="leve"||s.tipo==="longao")&&rpe<=3&&ritmo<pc.leve-15)P.p5=Math.max(240,P.p5-2);if(rpe>=7&&(s.tipo==="leve"||s.tipo==="longao"||s.tipo==="rec"))P.p5=Math.min(600,P.p5+3);}
    else if(rpe>=9&&s.tipo!=="qual"&&s.tipo!=="teste")P.p5=Math.min(600,P.p5+2);
    if(dor==="dor"){W.dor=true;W.sess.filter(x=>x.st===""&&x.d>s.d).forEach(x=>{x.km=kmR(x.km*.7);if(x.tipo!=="longao"){x.tipo="rec";x.nome="Regenerativo";x.pace=Math.round(mpPaces(P.p5).rec);}x.nota="Reduzido por dor";});}
    save(P);const run=getD(tid("run",s.d));save({...(run||{}),id:tid("run",s.d),c:"trk",k:"run",d:s.d,t:"Corrida",km,s:s.nome+(seg?" · "+mmss(seg*1000):"")});
    closeSheet();rr();
    toast(dor==="dor"?"heart-pulse":"medal",dor==="dor"?"Treino registrado. Cuide da dor":"Treino cumprido!",dor==="dor"?"Reduzi o resto da semana. Se a dor continuar, procure avaliação.":P.p5<antes?"Você está mais rápido: ritmos atualizados.":String(km).replace(".",",")+" km rumo aos 42.");};});};
ACT.mpNao=el=>{const {P,W,s}=mpSess(el.dataset.id);if(!s)return;
  sheet(`<h2>Não deu hoje</h2><p class="muted small" style="margin:4px 0 0">Acontece. Eu ajusto a semana para você seguir em frente.</p>
   <div class="fld"><span>O que aconteceu</span><div class="seg" data-k="nmR"><button type="button" data-a="seg" data-v="imprevisto" aria-pressed="true">Imprevisto</button><button type="button" data-a="seg" data-v="cansaco" aria-pressed="false">Cansaço</button><button type="button" data-a="seg" data-v="clima" aria-pressed="false">Clima</button><button type="button" data-a="seg" data-v="dor" aria-pressed="false">Dor</button></div></div>
   <div class="btns"><button class="btn full" id="nmOk">Ajustar a semana</button></div>`,sh=>{
  sh.querySelector("#nmOk").onclick=()=>{const mot=segVal(sh,"nmR")||"imprevisto";let novo=null;
    if(mot==="dor"){W.dor=true;s.st="perdido";s.nota="Dor: descanso hoje";W.sess.filter(x=>x.st===""&&x.d>s.d).forEach(x=>{x.km=kmR(x.km*.7);if(x.tipo!=="longao"){x.tipo="rec";x.nome="Regenerativo";}x.nota="Reduzido por dor";});}
    else if(["longao","qual","teste"].includes(s.tipo)){novo=mpRemarcar(W,s,addDays(TODAY(),1));if(!novo)s.nota="Sem dia livre esta semana: seguimos na próxima.";}
    else{s.st="perdido";s.nota=mot==="cansaco"?"Descanso também é treino.":"Sem problema: o volume da semana se ajusta.";}
    save(P);closeSheet();rr();toast("rotate-ccw","Semana ajustada",novo?"Remarquei para "+MP_DIASL[dowOf(novo.d)]+".":mot==="dor"?"Reduzi a semana. Se a dor continuar, procure avaliação.":"O que não pode é parar. Amanhã tem mais.");};});};

/* ---------- configuração ---------- */
function mpConfigHTML(P,novo){const p5=P.p5||410;
  return `${novo?`<div class="hero"><h2>Sua planilha até os 42 km</h2><p class="muted small" style="margin:6px 0 0">Plano automático de cerca de 9 meses que se adapta ao que você consegue cumprir, aos treinos de capoeira e academia e aos imprevistos.</p></div>`:""}
   <div class="two"><label class="fld"><span>Seu ritmo atual nos 5 km (min:seg por km)</span><input id="cfP" value="${Math.floor(p5/60)}:${pad(p5%60)}" placeholder="6:50"></label><label class="fld"><span>Volume inicial (km/semana, até 20)</span><input id="cfV" inputmode="decimal" value="${P.vIni||18}"></label></div>
   <div class="fld"><span>Dias de corrida (3 ou 4)</span><div class="wrap-row" id="cfD">${MP_DIAS.map((n,i)=>`<button type="button" class="chip ${P.dias.includes(i)?"c":""}" data-a="mpDia" data-v="${i}" aria-pressed="${P.dias.includes(i)}">${n}</button>`).join("")}</div></div>
   <div class="fld"><span>Dia do longão</span><div class="seg" data-k="cfL">${MP_DIAS.map((n,i)=>`<button type="button" data-a="seg" data-v="${i}" aria-pressed="${P.longao===i}">${n}</button>`).join("")}</div></div>
   <p class="tiny faint">Dica: deixe o longão longe do dia seguinte à capoeira mais puxada, e um dia sem corrida entre os treinos fortes.</p>
   <div class="btns"><button class="btn full" data-a="mpSalvarCfg" data-novo="${novo?1:""}">${novo?ic("sparkles")+" Gerar meu plano":"Salvar e reajustar"}</button>${novo?"":`<button class="btn danger full" data-a="mpReset">Recomeçar do zero</button>`}</div>`;}
let MPDIAS=null;
ACT.mpDia=el=>{const P=mpDoc();MPDIAS=MPDIAS||P.dias.slice();const v=+el.dataset.v;MPDIAS=MPDIAS.includes(v)?MPDIAS.filter(x=>x!==v):MPDIAS.concat([v]);el.classList.toggle("c",MPDIAS.includes(v));el.setAttribute("aria-pressed",MPDIAS.includes(v));};
ACT.mpCfg=()=>{MPDIAS=null;sheet(`<h2>Ajustes do plano</h2>${mpConfigHTML(mpDoc(),false)}`);};
ACT.mpSalvarCfg=el=>{const P=mpDoc(),box=el.closest("#sheet")||document,dias=(MPDIAS||P.dias).slice().sort((a,b)=>a-b),lgv=segVal(box,"cfL"),lg=lgv===""||lgv==null?P.longao:+lgv;
  const pp=String($("cfP").value||"").split(":").map(x=>+x),p5=pp.length===2?pp[0]*60+pp[1]:Math.round(+pp[0]*60),v=clamp(num($("cfV").value)||18,8,20);
  if(!(p5>=240&&p5<=600))return toast("triangle-alert","Ritmo inválido","Use o formato 6:50.");
  if(dias.length<3||dias.length>4)return toast("triangle-alert","Escolha 3 ou 4 dias de corrida","");if(!dias.includes(lg))dias.push(lg);
  const novo=!!el.dataset.novo;Object.assign(P,{p5,vIni:v,dias:dias.slice(0,dias.length>4?4:dias.length),longao:lg});
  if(novo||!P.ini){P.ini=semanaKey(TODAY());P.criado=TODAY();P.nivel=0;P.W={};P.hist=[];}
  else{const W=mpAtual(P);if(W&&!W.fechada){const feitos=W.sess.filter(s=>s.st!=="");const nova=mpGerar(P,W.k);nova.sess=feitos.concat(nova.sess.filter(s=>s.d>=TODAY()&&!feitos.some(f=>f.d===s.d)));P.W[W.k]=nova;}}
  MPDIAS=null;save(P);closeSheet();VIEW.velha=0;rr();toast("sparkles",novo?"Plano criado":"Plano reajustado",novo?"Primeira semana pronta. Bora!":"");};
ACT.mpReset=()=>confirmSheet("Recomeçar o plano?","O histórico de semanas do plano será apagado. As corridas registradas continuam.","Recomeçar",()=>{const P=mpDoc();P.ini="";P.W={};P.nivel=0;P.hist=[];save(P);rr();});
