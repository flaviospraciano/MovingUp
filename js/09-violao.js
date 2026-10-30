"use strict";
/* ======================================================================
   VIOLÃO · acordes por nível, simulador em repetição, notas do braço e vídeos em loop
   Afinação padrão: 6ª Mi (E2) · 5ª Lá (A2) · 4ª Ré (D3) · 3ª Sol (G3) · 2ª Si (B3) · 1ª Mi (E4)
   Notação dos acordes: casas da 6ª para a 1ª corda (x = não toca, 0 = solta) e dedos (1 indicador ... 4 mínimo)
   ====================================================================== */
MODS.viol={n:"Violão",ic:"guitar",c1:"#7C2D12",c2:"#7C2D12",g:9,v:{v:"viol"}};
(()=>{const g=MOD_GROUPS.find(x=>x[0]==="Estudos e crescimento");if(g&&!g[1].includes("viol"))g[1].unshift("viol");})();
const OPEN=[40,45,50,55,59,64];
const NOTA=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"],SOLF=["Dó","Dó#","Ré","Ré#","Mi","Fá","Fá#","Sol","Sol#","Lá","Lá#","Si"];
const CORDA=["6ª · Mi grave","5ª · Lá","4ª · Ré","3ª · Sol","2ª · Si","1ª · Mi aguda"],CORDA_C=["Mi grave (6ª)","Lá (5ª)","Ré (4ª)","Sol (3ª)","Si (2ª)","Mi aguda (1ª)"];
const DEDO=["","indicador","médio","anelar","mínimo"],DCOL=["","#2563EB","#16A34A","#EA580C","#9333EA"];
const NIVEIS=[
 ["Nível 1 · Primeiros acordes","Acordes abertos, maiores e menores. A base de milhares de músicas.",[
  {id:"Em",n:"Em",nome:"Mi menor",f:"0 2 2 0 0 0",d:"- 2 3 - - -",dica:"O mais fácil para começar. Toque todas as cordas."},
  {id:"Am",n:"Am",nome:"Lá menor",f:"x 0 2 2 1 0",d:"- - 2 3 1 -",dica:"Mesmo desenho do Mi maior, uma corda abaixo. Não toque a 6ª."},
  {id:"E",n:"E",nome:"Mi maior",f:"0 2 2 1 0 0",d:"- 2 3 1 - -",dica:"Igual ao Em, acrescentando o indicador na 3ª corda."},
  {id:"A",n:"A",nome:"Lá maior",f:"x 0 2 2 2 0",d:"- - 1 2 3 -",dica:"Três dedos lado a lado na 2ª casa. Deixe a 1ª corda soar."},
  {id:"D",n:"D",nome:"Ré maior",f:"x x 0 2 3 2",d:"- - - 1 3 2",dica:"Toque só as 4 cordas mais finas. Formato de triângulo."},
  {id:"Dm",n:"Dm",nome:"Ré menor",f:"x x 0 2 3 1",d:"- - - 2 3 1",dica:"Do Ré maior, desça a 1ª corda para a 1ª casa."},
  {id:"C",n:"C",nome:"Dó maior",f:"x 3 2 0 1 0",d:"- 3 2 - 1 -",dica:"Arqueie bem os dedos para a 3ª corda soltar livre."},
  {id:"G",n:"G",nome:"Sol maior",f:"3 2 0 0 0 3",d:"2 1 - - - 3",dica:"Abra a mão: médio na 6ª corda e anelar na 1ª."}]],
 ["Nível 2 · Sétimas e suspensos","Acordes com tensão e cor, muito usados em MPB, samba e blues.",[
  {id:"E7",n:"E7",nome:"Mi com sétima",f:"0 2 0 1 0 0",d:"- 2 - 1 - -"},
  {id:"A7",n:"A7",nome:"Lá com sétima",f:"x 0 2 0 2 0",d:"- - 2 - 3 -"},
  {id:"D7",n:"D7",nome:"Ré com sétima",f:"x x 0 2 1 2",d:"- - - 2 1 3"},
  {id:"G7",n:"G7",nome:"Sol com sétima",f:"3 2 0 0 0 1",d:"3 2 - - - 1"},
  {id:"C7",n:"C7",nome:"Dó com sétima",f:"x 3 2 3 1 0",d:"- 3 2 4 1 -"},
  {id:"B7",n:"B7",nome:"Si com sétima",f:"x 2 1 2 0 2",d:"- 2 1 3 - 4",dica:"Chave para tocar em Mi (E – A – B7)."},
  {id:"Am7",n:"Am7",nome:"Lá menor com sétima",f:"x 0 2 0 1 0",d:"- - 2 - 1 -"},
  {id:"Em7",n:"Em7",nome:"Mi menor com sétima",f:"0 2 0 0 0 0",d:"- 2 - - - -"},
  {id:"Dm7",n:"Dm7",nome:"Ré menor com sétima",f:"x x 0 2 1 1",d:"- - - 2 1 1",b:{fr:1,from:2,to:1}},
  {id:"Asus2",n:"Asus2",nome:"Lá com segunda",f:"x 0 2 2 0 0",d:"- - 1 2 - -"},
  {id:"Asus4",n:"Asus4",nome:"Lá com quarta",f:"x 0 2 2 3 0",d:"- - 1 2 3 -"},
  {id:"Dsus2",n:"Dsus2",nome:"Ré com segunda",f:"x x 0 2 3 0",d:"- - - 1 3 -"},
  {id:"Dsus4",n:"Dsus4",nome:"Ré com quarta",f:"x x 0 2 3 3",d:"- - - 1 3 4"}]],
 ["Nível 3 · Pestana","O indicador deitado prende várias cordas. Abre todas as tonalidades.",[
  {id:"F",n:"F",nome:"Fá maior",f:"1 3 3 2 1 1",d:"1 3 4 2 1 1",b:{fr:1,from:6,to:1},dica:"A primeira pestana. Use a lateral do indicador, perto da casa."},
  {id:"Fm",n:"Fm",nome:"Fá menor",f:"1 3 3 1 1 1",d:"1 3 4 1 1 1",b:{fr:1,from:6,to:1}},
  {id:"Bb",n:"Bb",nome:"Si bemol maior",f:"x 1 3 3 3 1",d:"- 1 2 3 4 1",b:{fr:1,from:5,to:1}},
  {id:"Bm",n:"Bm",nome:"Si menor",f:"x 2 4 4 3 2",d:"- 1 3 4 2 1",b:{fr:2,from:5,to:1},dica:"O acorde com pestana mais pedido nas músicas."},
  {id:"B",n:"B",nome:"Si maior",f:"x 2 4 4 4 2",d:"- 1 2 3 4 1",b:{fr:2,from:5,to:1}},
  {id:"Fsm",n:"F#m",nome:"Fá sustenido menor",f:"2 4 4 2 2 2",d:"1 3 4 1 1 1",b:{fr:2,from:6,to:1}},
  {id:"Gpe",n:"G (pestana)",nome:"Sol maior na 3ª casa",f:"3 5 5 4 3 3",d:"1 3 4 2 1 1",b:{fr:3,from:6,to:1}},
  {id:"Gm",n:"Gm",nome:"Sol menor",f:"3 5 5 3 3 3",d:"1 3 4 1 1 1",b:{fr:3,from:6,to:1}},
  {id:"Cm",n:"Cm",nome:"Dó menor",f:"x 3 5 5 4 3",d:"- 1 3 4 2 1",b:{fr:3,from:5,to:1}},
  {id:"Csm",n:"C#m",nome:"Dó sustenido menor",f:"x 4 6 6 5 4",d:"- 1 3 4 2 1",b:{fr:4,from:5,to:1}}]],
 ["Nível 4 · Harmonia avançada","Acordes com sétima maior, nona, sexta, diminutos e aumentados: o tempero da bossa nova e da MPB.",[
  {id:"Cmaj7",n:"C7M",nome:"Dó com sétima maior",f:"x 3 2 0 0 0",d:"- 3 2 - - -"},
  {id:"Fmaj7",n:"F7M",nome:"Fá com sétima maior",f:"x x 3 2 1 0",d:"- - 3 2 1 -"},
  {id:"Gmaj7",n:"G7M",nome:"Sol com sétima maior",f:"3 2 0 0 0 2",d:"3 2 - - - 1"},
  {id:"Amaj7",n:"A7M",nome:"Lá com sétima maior",f:"x 0 2 1 2 0",d:"- - 2 1 3 -"},
  {id:"Dmaj7",n:"D7M",nome:"Ré com sétima maior",f:"x x 0 2 2 2",d:"- - - 1 2 3"},
  {id:"Cadd9",n:"C(9)",nome:"Dó com nona",f:"x 3 2 0 3 0",d:"- 2 1 - 3 -"},
  {id:"E9",n:"E7(9)",nome:"Mi com sétima e nona",f:"0 2 0 1 0 2",d:"- 2 - 1 - 3"},
  {id:"Em9",n:"Em7(9)",nome:"Mi menor com sétima e nona",f:"0 2 0 0 0 2",d:"- 2 - - - 3"},
  {id:"G6",n:"G6",nome:"Sol com sexta",f:"3 2 0 0 0 0",d:"2 1 - - - -"},
  {id:"Bm7",n:"Bm7",nome:"Si menor com sétima",f:"x 2 4 2 3 2",d:"- 1 3 1 2 1",b:{fr:2,from:5,to:1}},
  {id:"Bm7b5",n:"Bm7(b5)",nome:"Si meio-diminuto",f:"x 2 3 2 3 x",d:"- 1 3 2 4 -"},
  {id:"Bdim7",n:"Bº",nome:"Si diminuto",f:"x 2 3 1 3 1",d:"- 2 3 1 4 1",b:{fr:1,from:3,to:1}},
  {id:"Caug",n:"C+",nome:"Dó aumentado",f:"x 3 2 1 1 0",d:"- 4 3 1 2 -"}]]
];
const ACORDES=NIVEIS.flatMap(n=>n[2]);
const chF=c=>c.f.split(" ").map(v=>v==="x"?null:+v),chD=c=>c.d.split(" ").map(v=>v==="-"?0:+v);
const chById=id=>ACORDES.find(c=>c.id===id)||ACORDES[0];
function chBase(c){const fr=chF(c).filter(v=>v>0);const mx=Math.max(...fr,0),mn=Math.min(...fr);return mx>5?mn:1;}
function chNotas(c){const s=new Set();chF(c).forEach((f,i)=>{if(f!=null)s.add((OPEN[i]+f)%12);});return[...s];}
const nn=(pc,sol)=>(sol?SOLF:NOTA)[pc];
function chPassos(c){const F=chF(c),D=chD(c),P=[];if(c.b)P.push({dedo:1,b:c.b,txt:`Dedo 1 (indicador) deitado na ${c.b.fr}ª casa, da ${c.b.from}ª à ${c.b.to}ª corda: é a pestana`});
  [1,2,3,4].forEach(dd=>{F.forEach((f,i)=>{if(D[i]===dd&&f>0&&!(c.b&&dd===1&&f===c.b.fr)){P.push({dedo:dd,s:i,f,txt:`Dedo ${dd} (${DEDO[dd]}) na ${f}ª casa da corda ${CORDA_C[i]}`});}});});return P;}
/* diagrama do acorde (vertical) */
function chSVG(c,o={}){const F=chF(c),D=chD(c),base=chBase(c),W=o.big?240:150,sx=o.big?36:22,x0=o.big?30:19,y0=o.big?48:30,fh=o.big?44:27,nf=5;const X=i=>x0+i*sx,Y=fr=>y0+(fr-base+.5)*fh;
  const placed=o.placed==null?99:o.placed;const pass=chPassos(c);const showD=(i)=>{const k=pass.findIndex(p=>p.s===i||(p.b&&i>=6-p.b.from&&i<=6-p.b.to&&F[i]===p.b.fr));return k<0?true:k<placed;};
  const showB=pass.length&&pass[0].b?placed>0:false;
  let s=`<svg viewBox="0 0 ${W} ${y0+nf*fh+(o.big?44:22)}" class="chsvg ${o.big?"big":""}" role="img" aria-label="Diagrama do acorde ${esc(c.n)}">`;
  s+=`<rect x="${X(0)}" y="${y0}" width="${X(5)-X(0)}" height="${nf*fh}" fill="var(--chfb)" rx="2"/>`;
  for(let k=0;k<=nf;k++)s+=`<line x1="${X(0)}" x2="${X(5)}" y1="${y0+k*fh}" y2="${y0+k*fh}" stroke="var(--chfret)" stroke-width="${k===0&&base===1?(o.big?7:5):1.6}"/>`;
  if(base>1)s+=`<text x="${X(0)-6}" y="${y0+fh*.62}" text-anchor="end" font-size="${o.big?14:10}" font-weight="800" fill="var(--soft)">${base}ª</text>`;
  for(let i=0;i<6;i++){const strum=o.strum!=null&&o.strum>=i&&F[i]!=null;s+=`<line class="chstr ${strum?"vib":""}" x1="${X(i)}" x2="${X(i)}" y1="${y0}" y2="${y0+nf*fh}" stroke="${strum?"#F59E0B":"var(--chstr)"}" stroke-width="${(o.big?1.2:.9)+(5-i)*.35+(strum?1.2:0)}"/>`;
    const top=y0-(o.big?16:10);if(F[i]==null)s+=`<text x="${X(i)}" y="${top+4}" text-anchor="middle" font-size="${o.big?17:11}" font-weight="900" fill="var(--no)">×</text>`;else if(F[i]===0)s+=`<circle cx="${X(i)}" cy="${top}" r="${o.big?6.5:4}" fill="none" stroke="var(--ink)" stroke-width="2"/>`;
    if(o.big&&o.notas&&F[i]!=null)s+=`<text x="${X(i)}" y="${y0+nf*fh+20}" text-anchor="middle" font-size="12" font-weight="800" fill="${strum?"#B45309":"var(--soft)"}">${nn((OPEN[i]+F[i])%12,o.sol)}</text>`;}
  if(c.b&&showB){const a=6-c.b.from,b2=6-c.b.to;s+=`<rect class="chdot" x="${X(a)-(o.big?13:8)}" y="${Y(c.b.fr)-(o.big?13:8)}" width="${X(b2)-X(a)+(o.big?26:16)}" height="${o.big?26:16}" rx="${o.big?13:8}" fill="${DCOL[1]}"/>`;}
  for(let i=0;i<6;i++){const f=F[i];if(!(f>0))continue;if(c.b&&D[i]===1&&f===c.b.fr)continue;if(!showD(i))continue;const r=o.big?14:8.5;
    s+=`<g class="chdot"><circle cx="${X(i)}" cy="${Y(f)}" r="${r}" fill="${DCOL[D[i]]||"var(--ink)"}"/>${D[i]?`<text x="${X(i)}" y="${Y(f)+(o.big?5:3.5)}" text-anchor="middle" font-size="${o.big?14:9.5}" font-weight="900" fill="#fff">${D[i]}</text>`:""}</g>`;}
  if(c.b&&showB)s+=`<text x="${(X(6-c.b.from)+X(6-c.b.to))/2}" y="${Y(c.b.fr)+(o.big?5:3.5)}" text-anchor="middle" font-size="${o.big?14:9.5}" font-weight="900" fill="#fff">1</text>`;
  if(o.focus!=null){const p=pass[o.focus];if(p&&!p.b)s+=`<circle cx="${X(p.s)}" cy="${Y(p.f)}" r="${o.big?22:13}" fill="none" stroke="${DCOL[p.dedo]}" stroke-width="3" class="chping"/>`;}
  return s+`</svg>`;}

/* ---------- som: síntese de corda dedilhada (Karplus-Strong) ---------- */
const VI={ctx:null,out:null,buf:new Map()};
function ksBuf(midi){if(VI.buf.has(midi))return VI.buf.get(midi);const c=VI.ctx,sr=c.sampleRate,f=440*Math.pow(2,(midi-69)/12),N=Math.floor(sr*2.4),b=c.createBuffer(1,N,sr),d=b.getChannelData(0);
  const P=Math.max(2,Math.round(sr/f)),L=new Float32Array(P);for(let i=0;i<P;i++)L[i]=Math.random()*2-1;const decay=.9965+Math.min(.0025,(64-midi)*.00006);let j=0;
  for(let i=0;i<N;i++){const a=L[j],n=L[(j+1)%P];d[i]=a;L[j]=decay*.5*(a+n);j=(j+1)%P;}VI.buf.set(midi,b);return b;}
const viSol=()=>{try{return localStorage.getItem("mu_vsol")==="1";}catch(e){return false;}};

/* ---------- progresso: acordes que já sei ---------- */
const vSei=()=>single("violsei",{l:[]});
ACT.vSei=el=>{const d=vSei();const id=el.dataset.id;d.l=d.l.includes(id)?d.l.filter(x=>x!==id):d.l.concat(id);save(d);rr();};

/* ---------- tela principal ---------- */
VIEWS.viol=()=>{const tb=VIEW.tab||"ac";try{viCtx();}catch(e){}let h=topbar("Violão","viol");
  h+=`<div class="tabs vtabs">${[["ac","list-music","Acordes"],["rit","hand","Ritmos (mão direita)"],["sim","repeat","Simulador"],["braco","guitar","Notas do braço"],["vid","youtube","Vídeos em loop"]].map(([k,i,n])=>`<button data-a="liTab" data-v="${k}" aria-pressed="${tb===k}">${ic(i)} ${n}</button>`).join("")}</div>`;
  if(tb==="rit")return `<div class="app">${h}${rhView()}</div>`;
  if(tb==="sim")return `<div class="app">${h}${viSimView()}</div>`;
  if(tb==="braco")return `<div class="app">${h}${viBracoView()}</div>`;
  if(tb==="vid")return `<div class="app">${h}${viVidView()}</div>`;
  const S=vSei().l;const tot=ACORDES.length,ok=ACORDES.filter(c=>S.includes(c.id)).length;
  h+=`<div class="hero vhero"><div class="row"><div class="grow"><div class="muted small">Sua jornada no violão</div><h2>${ok} de ${tot} acordes</h2><div class="muted small">Marque “Já sei” quando trocar para o acorde sem olhar.</div></div><span class="mb" style="width:52px;height:52px">${ic("guitar")}</span></div><div class="bar"><i style="width:${ok/tot*100}%"></i></div><div class="row" style="margin-top:10px;gap:8px"><span class="small muted">Som do violão:</span>${gtTimSel()}</div></div>`;
  h+=NIVEIS.map(([t,d,L],ni)=>{const k=L.filter(c=>S.includes(c.id)).length;return `<div class="sec"><h2>${esc(t)}</h2><span class="chip ${k===L.length?"c":""}" style="margin-left:auto">${k}/${L.length}</span></div><div class="small muted" style="margin:-4px 0 10px">${esc(d)}</div>
    <div class="chgrid">${L.map(c=>`<button class="chcard ${S.includes(c.id)?"sei":""}" data-a="chOpen" data-id="${c.id}"><div class="chn">${esc(c.n)}${S.includes(c.id)?` <span class="tiny" style="color:var(--ok)">✓</span>`:""}</div>${chSVG(c)}<div class="tiny muted">${esc(c.nome)}</div></button>`).join("")}</div>`;}).join("");
  h+=`<div class="note" style="margin-top:16px">${ic("info")} <b>Como ler o diagrama:</b> as linhas verticais são as cordas (a da esquerda é a 6ª, Mi grave) e as horizontais são as casas. ○ = corda solta, × = não tocar. Cores dos dedos: <b style="color:${DCOL[1]}">1 indicador</b>, <b style="color:${DCOL[2]}">2 médio</b>, <b style="color:${DCOL[3]}">3 anelar</b>, <b style="color:${DCOL[4]}">4 mínimo</b>.</div><div class="tiny faint" style="margin-top:10px">Sons de violão gravados nota por nota: FluidR3 GM (Frank Wen), licença Creative Commons Atribuição 3.0.</div>`;
  return `<div class="app">${h}</div>`;};
ACT.chOpen=el=>{const c=chById(el.dataset.id);viCtx();const S=vSei().l;const sol=viSol();
  sheet(`<div class="row"><h2 class="grow" style="font-size:1.8rem">${esc(c.n)}</h2><span class="muted">${esc(c.nome)}</span></div>
   <div class="chbig">${chSVG(c,{big:true,notas:true,sol})}</div>
   <div class="small" style="text-align:center;margin-top:-4px">Notas: <b>${chNotas(c).map(p=>nn(p,sol)).join(" · ")}</b></div>
   ${c.dica?`<div class="note">${ic("lightbulb")} ${esc(c.dica)}</div>`:""}
   <ol class="chpass">${chPassos(c).map(p=>`<li><span class="dd" style="background:${DCOL[p.dedo]}">${p.dedo}</span>${esc(p.txt)}</li>`).join("")}<li><span class="dd" style="background:var(--ink)">♪</span>Toque ${chF(c).map((f,i)=>f==null?null:i).filter(v=>v!=null).length===6?"todas as 6 cordas":"a partir da corda "+CORDA_C[chF(c).findIndex(v=>v!=null)]}${chF(c).some(v=>v==null)?" (as marcadas com × não soam)":""}.</li></ol>
   <div class="btns h"><button class="btn" data-a="chOuvir" data-id="${c.id}">${ic("volume-2")} Ouvir</button><button class="btn ghost" data-a="chSim" data-id="${c.id}">${ic("repeat")} Simular em repetição</button></div>
   <div class="btns"><button class="btn ${S.includes(c.id)?"":"ghost"} full" data-a="vSei" data-id="${c.id}">${ic("check")} ${S.includes(c.id)?"Já sei este acorde":"Marcar: já sei"}</button></div>`);};
ACT.chOuvir=el=>{viCtx();strum(chById(el.dataset.id),VI.ctx.currentTime+.05,"D",.35);};
ACT.chSim=el=>{closeSheet();VIEW.tab="sim";VIEW.simM="ac";VIEW.simC=el.dataset.id;rr();window.scrollTo(0,0);};

/* ---------- SIMULADOR ---------- */
const PROG=[
 {id:"p1",n:"G – D – Em – C",c:["G","D","Em","C"],nv:1,d:"A progressão do pop. Milhares de músicas usam."},
 {id:"p2",n:"C – G – Am – F",c:["C","G","Am","F"],nv:2,d:"Clássica, com a primeira pestana (F)."},
 {id:"p3",n:"Am – F – C – G",c:["Am","F","C","G"],nv:2,d:"Mesma família, começando no menor."},
 {id:"p4",n:"Em – C – G – D",c:["Em","C","G","D"],nv:1,d:"Ótima para treinar trocas sem pestana."},
 {id:"p5",n:"D – A – Bm – G",c:["D","A","Bm","G"],nv:2,d:"Treina a pestana do Si menor."},
 {id:"p6",n:"E – A – B7 – E",c:["E","A","B7","E"],nv:1,d:"Base do blues, do rock e do forró em Mi."},
 {id:"p7",n:"Am – Dm – E7 – Am",c:["Am","Dm","E7","Am"],nv:1,d:"Menor com cara de samba-canção e bolero."},
 {id:"p8",n:"C – Am – Dm – G7",c:["C","Am","Dm","G7"],nv:1,d:"A progressão dos anos 50, o famoso “ciclo”."},
 {id:"p9",n:"A – D – E – A",c:["A","D","E","A"],nv:1,d:"Três acordes maiores, muito usada no sertanejo e no country."},
 {id:"p10",n:"Dm7 – G7 – C7M",c:["Dm7","G7","Cmaj7","Cmaj7"],nv:3,d:"O II – V – I, coração da bossa nova e do jazz."},
 {id:"p11",n:"F – C – G – Am",c:["F","C","G","Am"],nv:2,d:"Trocas com pestana em andamento lento."},
 {id:"p12",n:"Bm – G – D – A",c:["Bm","G","D","A"],nv:2,d:"Começa na pestana: bom desafio de precisão."}];
const BATIDA=[{id:"b1",n:"Só para baixo",p:"D . D . D . D ."},{id:"b2",n:"Pop básica",p:"D . D U . U D U"},{id:"b3",n:"Balada",p:"D . D U D . D U"},{id:"b4",n:"Rock/folk",p:"D D U U D U D U"},{id:"b5",n:"Contratempo (reggae)",p:". D . D . D . D"},{id:"b6",n:"Baião",p:"D . . D . D D ."}];
const SIM={on:false,loop:null,ph:0,speed:1,bpm:72,bat:"b2",prog:"p1",timer:null,raf:null,q:[],nt:0,slot:0,bar:0,since:0};
try{Object.assign(SIM,JSON.parse(localStorage.getItem("mu_vsim")||"{}"),{on:false,loop:null,timer:null,raf:null,q:[]});}catch(e){}
const simSave=()=>{try{localStorage.setItem("mu_vsim",JSON.stringify({speed:SIM.speed,bpm:SIM.bpm,bat:SIM.bat,prog:SIM.prog}));}catch(e){}};
function viSimView(){const m=VIEW.simM||"ac";let h=`<div class="seg" style="margin-bottom:10px"><button data-a="simM" data-v="ac" aria-pressed="${m==="ac"}">${ic("hand")} Formar o acorde</button><button data-a="simM" data-v="pr" aria-pressed="${m==="pr"}">${ic("repeat")} Trocar acordes no ritmo</button></div>`;
  if(m==="ac"){const c=chById(VIEW.simC||"Em");const P=chPassos(c);
    h+=`<div class="vstage"><div class="row"><div class="grow"><div class="tiny" style="opacity:.75">Observe e repita com o seu violão</div><h2 style="margin:0;font:800 1.6rem var(--disp)">${esc(c.n)} <span style="font:600 .95rem var(--body);opacity:.8">${esc(c.nome)}</span></h2></div><span class="chip" id="simLoop" style="background:rgba(255,255,255,.14);color:#fff;border:0"></span></div>
      <div class="vdiag" id="simD">${chSVG(c,{big:true,placed:0,notas:true,sol:viSol()})}</div>
      <div class="vstep" id="simT">Toque em <b>Repetir</b> para ver a montagem dedo por dedo</div>
      <div class="vdots">${P.map((p,i)=>`<i id="simP${i}" style="--dc:${DCOL[p.dedo]}"></i>`).join("")}<i id="simPs" style="--dc:#F59E0B"></i></div>
      <div class="atctl"><button class="btn" id="simB" data-a="simGo">${ic(SIM.on?"square":"repeat")} ${SIM.on?"Parar":"Repetir continuamente"}</button>
      <div class="atspd">${[[1.6,"Bem lento"],[1.2,"Lento"],[1,"Normal"],[.7,"Rápido"]].map(([v,l])=>`<button data-a="simSpd" data-v="${v}" aria-pressed="${SIM.speed===v}">${l}</button>`).join("")}</div></div></div>
      <div class="sec"><h2>Escolha o acorde</h2></div><div class="chips-sc">${NIVEIS.map(([t,,L],i)=>`<div class="tiny muted" style="margin:8px 0 4px;font-weight:800">${esc(t.split(" · ")[0])}</div><div class="wrap-row">${L.map(x=>`<button class="chip ${x.id===c.id?"m":""}" style="padding:7px 12px;font-size:.85rem" data-a="simAc" data-id="${x.id}">${esc(x.n)}</button>`).join("")}</div>`).join("")}</div>`;
    return h;}
  const pr=PROG.find(x=>x.id===SIM.prog)||PROG[0],bt=BATIDA.find(x=>x.id===SIM.bat)||BATIDA[1],bp=bt.p.split(" ");
  h+=`<div class="vstage"><div class="row"><div class="grow"><div class="tiny" style="opacity:.75">${esc(bt.n)} · 1 acorde por compasso</div><h2 style="margin:0;font:800 1.25rem var(--disp)">${esc(pr.n)}</h2></div><span class="chip" id="prCyc" style="background:rgba(255,255,255,.14);color:#fff;border:0"></span></div>
    <div class="prwrap"><div class="prcur"><div class="prname" id="prN">${esc(chById(pr.c[0]).n)}</div><div id="prD">${chSVG(chById(pr.c[0]),{big:true})}</div></div><div class="prnext"><div class="tiny" style="opacity:.75">Próximo</div><div class="prname sm" id="prNN">${esc(chById(pr.c[1%pr.c.length]).n)}</div><div id="prDN">${chSVG(chById(pr.c[1%pr.c.length]))}</div></div></div>
    <div class="prseq">${pr.c.map((x,i)=>`<span id="prs${i}">${esc(chById(x).n)}</span>`).join("")}</div>
    <div class="prlane">${bp.map((v,i)=>`<div class="prc ${i%2===0?"beat":""}" id="prl${i}">${v==="D"?"↓":v==="U"?"↑":"·"}<small>${i%2===0?i/2+1:"e"}</small></div>`).join("")}</div>
    <div class="vstep" id="prT">Toque em <b>Tocar</b>: a contagem “1, 2, 3, 4” prepara a entrada</div>
    <div class="atctl"><button class="btn" id="prB" data-a="prGo">${ic(SIM.on?"square":"play")} ${SIM.on?"Parar":"Tocar"}</button><span class="small" style="opacity:.85">${ic("gauge")} <b id="prBpmL">${SIM.bpm}</b> bpm</span><input type="range" min="40" max="140" value="${SIM.bpm}" data-in="prBpm" style="flex:1;accent-color:#F59E0B" aria-label="Andamento"></div></div>
    <div class="sec"><h2>Batida</h2></div><div class="wrap-row">${BATIDA.map(b=>`<button class="chip ${b.id===bt.id?"m":""}" style="padding:8px 12px" data-a="prBat" data-id="${b.id}">${esc(b.n)} <span style="letter-spacing:.1em;font-family:monospace">${b.p.replace(/D/g,"↓").replace(/U/g,"↑").replace(/\./g,"·")}</span></button>`).join("")}</div>
    <div class="sec"><h2>Progressões</h2></div>${PROG.map(p=>`<button class="item atitem ${p.id===pr.id?"sel":""}" style="width:100%;text-align:left" data-a="prSel" data-id="${p.id}"><span class="mb">${ic("list-music")}</span><span class="ibody"><b>${esc(p.n)}</b><span class="small muted" style="display:block">${esc(p.d)}</span><span class="meta"><span class="chip m">${["","Fácil","Médio","Difícil"][p.nv]}</span></span></span></button>`).join("")}`;
  return h;}
ACT.simM=el=>{simStop();VIEW.simM=el.dataset.v;rr();};
ACT.simAc=el=>{const was=SIM.on;simStop();VIEW.simC=el.dataset.id;rr();if(was)ACT.simGo();};
ACT.simSpd=el=>{SIM.speed=+el.dataset.v;simSave();qa(".atspd button").forEach(b=>b.setAttribute("aria-pressed",String(+b.dataset.v===SIM.speed)));};
/* formar o acorde: animação passo a passo, em repetição */
ACT.simGo=()=>{if(SIM.on)return simStop(true);viCtx();SIM.on=true;SIM.n=0;SIM.since=Date.now();const b=$("simB");if(b)b.innerHTML=`${ic("square")} Parar`;try{navigator.wakeLock&&navigator.wakeLock.request("screen").then(l=>SIM.lock=l).catch(()=>{});}catch(e){}simCycle();};
function simCycle(){if(!SIM.on)return;const c=chById(VIEW.simC||"Em"),P=chPassos(c),sol=viSol(),sp=SIM.speed;const D=$("simD"),T=$("simT");if(!D)return simStop();
  SIM.n++;const L=$("simLoop");if(L)L.textContent="Repetição "+SIM.n;let t=0;const at=(ms,fn)=>{SIM.loop=setTimeout(()=>{if(SIM.on)fn();},ms);SIM.tms=(SIM.tms||[]).concat(SIM.loop);};
  const dots=k=>P.forEach((p,i)=>{const e=$("simP"+i);if(e)e.classList.toggle("on",i<k);});
  D.innerHTML=chSVG(c,{big:true,placed:0,notas:true,sol});dots(0);const ps=$("simPs");if(ps)ps.classList.remove("on");if(T)T.innerHTML="Mão relaxada, polegar atrás do braço do violão";
  t+=900*sp;P.forEach((p,i)=>{at(t,()=>{D.innerHTML=chSVG(c,{big:true,placed:i+1,focus:i,notas:true,sol});dots(i+1);if(T)T.innerHTML=`<span class="dd" style="background:${DCOL[p.dedo]}">${p.dedo}</span> ${esc(p.txt)}`;});t+=1500*sp;});
  at(t,()=>{if(T)T.innerHTML=`<b>Toque!</b> Palheta ou polegar de cima para baixo`;if(ps)ps.classList.add("on");const st=VI.ctx.currentTime+.03;strum(c,st,"D",.36);const F=chF(c);const idx=[0,1,2,3,4,5].filter(i=>F[i]!=null);
    idx.forEach((s,k)=>setTimeout(()=>{if(SIM.on&&$("simD"))$("simD").innerHTML=chSVG(c,{big:true,strum:s,notas:true,sol});},k*60));});
  t+=1900*sp;at(t,()=>{if(T)T.innerHTML=`Solte, relaxe a mão… e de novo`;});t+=900*sp;at(t,simCycle);}
function simStop(log){SIM.on=false;(SIM.tms||[]).forEach(clearTimeout);SIM.tms=[];clearTimeout(SIM.loop);clearInterval(SIM.timer);cancelAnimationFrame(SIM.raf);SIM.q=[];try{SIM.lock&&SIM.lock.release();}catch(e){}
  const secs=SIM.since?Math.round((Date.now()-SIM.since)/1000):0;if(secs>=20){const id="viols_"+TODAY();const d=getD(id)||{id,c:"viols",d:TODAY(),seg:0};d.seg+=secs;save(d);}SIM.since=0;
  const b=$("simB");if(b)b.innerHTML=`${ic("repeat")} Repetir continuamente`;const p=$("prB");if(p)p.innerHTML=`${ic("play")} Tocar`;}
/* trocar acordes no ritmo */
ACT.prSel=el=>{const was=SIM.on;simStop(true);SIM.prog=el.dataset.id;simSave();rr();if(was)ACT.prGo();};
ACT.prBat=el=>{const was=SIM.on;simStop(true);SIM.bat=el.dataset.id;simSave();rr();if(was)ACT.prGo();};
CH.prBpm=el=>{SIM.bpm=+el.value;const l=$("prBpmL");if(l)l.textContent=el.value;simSave();};
ACT.prGo=()=>{if(SIM.on)return simStop(true);const c=viCtx();SIM.on=true;SIM.since=Date.now();SIM.q=[];SIM.slot=-8;SIM.bar=0;SIM.cyc=0;SIM.nt=c.currentTime+.15;SIM.timer=setInterval(prSched,25);prSched();SIM.raf=requestAnimationFrame(prDraw);
  const b=$("prB");if(b)b.innerHTML=`${ic("square")} Parar`;try{navigator.wakeLock&&navigator.wakeLock.request("screen").then(l=>SIM.lock=l).catch(()=>{});}catch(e){}};
function prSched(){if(!SIM.on)return;const pr=PROG.find(x=>x.id===SIM.prog)||PROG[0],bp=(BATIDA.find(x=>x.id===SIM.bat)||BATIDA[1]).p.split(" "),dur=60/SIM.bpm/2;
  while(SIM.nt<VI.ctx.currentTime+.12){const sl=SIM.slot;if(sl<0){if(sl%2===0)atClickV(SIM.nt,sl===-8);}else{const s=sl%8,bar=Math.floor(sl/8)%pr.c.length;const v=bp[s];if(v!=="."&&v)strum(chById(pr.c[bar]),SIM.nt,v,.3);if(s%2===0)atClickV(SIM.nt,s===0,.08);}
    SIM.q.push({t:SIM.nt,sl});SIM.nt+=dur;SIM.slot++;}}
function atClickV(t,strong,vol){const c=VI.ctx,o=c.createOscillator(),g=c.createGain();o.frequency.value=strong?1750:1250;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol||(strong?.25:.14),t+.002);g.gain.exponentialRampToValueAtTime(.0001,t+.04);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+.06);}
function prDraw(){if(!SIM.on)return;const now=VI.ctx.currentTime;let ev=null;while(SIM.q.length&&SIM.q[0].t<=now)ev=SIM.q.shift();if(ev)prShow(ev.sl);SIM.raf=requestAnimationFrame(prDraw);}
function prShow(sl){const pr=PROG.find(x=>x.id===SIM.prog)||PROG[0],bp=(BATIDA.find(x=>x.id===SIM.bat)||BATIDA[1]).p.split(" ");qa(".prc.on").forEach(e=>e.classList.remove("on"));const T=$("prT");
  if(sl<0){if(sl%2===0&&T)T.innerHTML=`<b style="font-size:1.8rem">${(sl+8)/2+1}</b> <span style="opacity:.75">contagem</span>`;return;}
  const s=sl%8,bar=Math.floor(sl/8)%pr.c.length;const c=$("prl"+s);if(c)c.classList.add("on");
  if(s===0){const cur=chById(pr.c[bar]),nx=chById(pr.c[(bar+1)%pr.c.length]);$("prN").textContent=cur.n;$("prD").innerHTML=chSVG(cur,{big:true});$("prNN").textContent=nx.n;$("prDN").innerHTML=chSVG(nx);
    qa(".prseq span").forEach((e,i)=>e.classList.toggle("on",i===bar));if(bar===0){SIM.cyc++;const y=$("prCyc");if(y)y.textContent="Volta "+SIM.cyc;}}
  if(T){const v=bp[s];T.innerHTML=v==="D"?`<b>↓ Para baixo</b>`:v==="U"?`<b>↑ Para cima</b>`:`<span style="opacity:.7">mão passa no ar</span>`;if(s>=6)T.innerHTML+=` <span style="opacity:.75">· prepare o ${esc(chById(pr.c[(bar+1)%pr.c.length]).n)}</span>`;}}

/* ---------- NOTAS DO BRAÇO ---------- */
function viBracoView(){const sol=viSol(),sel=VIEW.bnota==null?null:+VIEW.bnota,nat=VIEW.bnat!==false,q=VIEW.quiz;const FR=12;
  let h=`<div class="row" style="flex-wrap:wrap;gap:8px;margin-bottom:8px"><div class="seg"><button data-a="vSol" data-v="0" aria-pressed="${!sol}">C D E…</button><button data-a="vSol" data-v="1" aria-pressed="${sol}">Dó Ré Mi…</button></div><div class="seg"><button data-a="vNat" data-v="1" aria-pressed="${nat}">Só naturais</button><button data-a="vNat" data-v="0" aria-pressed="${!nat}">Todas</button></div></div>`;
  h+=`<div class="wrap-row" style="margin-bottom:10px"><button class="chip ${sel==null?"m":""}" style="padding:7px 11px" data-a="vNota" data-v="">Todas</button>${[0,2,4,5,7,9,11,1,3,6,8,10].filter(p=>!nat||[0,2,4,5,7,9,11].includes(p)).map(p=>`<button class="chip ${sel===p?"m":""}" style="padding:7px 11px" data-a="vNota" data-v="${p}">${nn(p,sol)}</button>`).join("")}</div>`;
  h+=`<div class="fbwrap"><div class="fb">`;
  for(let s=5;s>=0;s--){h+=`<div class="fbrow"><span class="fbs">${["E","A","D","G","B","e"][s]}</span>`;for(let f=0;f<=FR;f++){const pc=(OPEN[s]+f)%12,isNat=[0,2,4,5,7,9,11].includes(pc);const show=(sel==null?(!nat||isNat):pc===sel);const qq=q&&q.s===s&&q.f===f;
      h+=`<button class="fbc ${f===0?"open":""} ${qq?"qz":""}" data-a="vPlay" data-s="${s}" data-f="${f}" aria-label="${nn(pc,sol)} na ${f}ª casa">${qq?"?":show&&!q?`<span class="fbn ${isNat?"":"sh"} ${sel===pc?"hl":""}">${nn(pc,sol)}</span>`:""}</button>`;}h+=`</div>`;}
  h+=`<div class="fbrow fbnum"><span class="fbs"></span>${Array.from({length:FR+1},(_,f)=>`<span class="fbc">${[3,5,7,9,12].includes(f)?`<b>${f}</b>`:f}</span>`).join("")}</div></div></div>`;
  h+=`<div class="tiny faint" style="margin-top:6px">Toque em qualquer casa para ouvir. A linha de cima é a 1ª corda (Mi aguda), como nas tablaturas.</div>`;
  h+=`<div class="sec"><h2>${ic("circle-help")} Desafio: que nota é essa?</h2>${q?`<span class="chip m" style="margin-left:auto">${q.ok}/${q.tot}</span>`:""}</div>`;
  h+=q?`<div class="card"><div class="small">A casa marcada com <b>?</b> está na corda <b>${CORDA_C[q.s]}</b>, ${q.f===0?"solta":q.f+"ª casa"}. Qual é a nota?</div><div class="wrap-row" style="margin-top:10px">${q.op.map(p=>`<button class="btn ghost sm" data-a="vQuizR" data-v="${p}">${nn(p,sol)}</button>`).join("")}</div><button class="lk small" style="margin-top:10px" data-a="vQuizEnd">Encerrar desafio</button></div>`
    :`<button class="btn full" data-a="vQuiz">${ic("graduation-cap")} Começar desafio</button>`;
  h+=`<div class="note" style="margin-top:14px">${ic("lightbulb")} Dica de memorização: as cordas soltas, da 6ª para a 1ª, são <b>Mi, Lá, Ré, Sol, Si, Mi</b>. Na 12ª casa as notas se repetem, uma oitava acima. Entre Mi e Fá e entre Si e Dó não existe sustenido.</div>`;
  return h;}
ACT.vSol=el=>{try{localStorage.setItem("mu_vsol",el.dataset.v);}catch(e){}rr();};
ACT.vNat=el=>{VIEW.bnat=el.dataset.v==="1";rr();};
ACT.vNota=el=>{VIEW.bnota=el.dataset.v===""?null:+el.dataset.v;rr();};
ACT.vPlay=el=>{viCtx();const s=+el.dataset.s,f=+el.dataset.f;pluck(OPEN[s]+f,VI.ctx.currentTime+.02,.4,s);if(!VIEW.quiz)toast("music",nn((OPEN[s]+f)%12,viSol()),`${CORDA_C[s]} · ${f===0?"corda solta":f+"ª casa"}`);};
function quizNew(q){const s=Math.floor(Math.random()*6),f=Math.floor(Math.random()*13),pc=(OPEN[s]+f)%12;const nat=[0,2,4,5,7,9,11];const pool=VIEW.bnat===false?[...Array(12).keys()]:nat;let op=[pc];while(op.length<4){const r=pool[Math.floor(Math.random()*pool.length)];if(!op.includes(r))op.push(r);}op.sort(()=>Math.random()-.5);
  if(VIEW.bnat!==false&&!nat.includes(pc))return quizNew(q);VIEW.quiz={s,f,pc,op,ok:q?q.ok:0,tot:q?q.tot:0};}
ACT.vQuiz=()=>{VIEW.bnota=null;quizNew(null);rr();};
ACT.vQuizEnd=()=>{const q=VIEW.quiz;VIEW.quiz=null;rr();if(q&&q.tot)toast("graduation-cap","Desafio encerrado",q.ok+" acertos em "+q.tot);};
ACT.vQuizR=el=>{const q=VIEW.quiz;viCtx();pluck(OPEN[q.s]+q.f,VI.ctx.currentTime+.02,.4,q.s);q.tot++;const ok=+el.dataset.v===q.pc;if(ok){q.ok++;toast("check","Acertou!",nn(q.pc,viSol()));}else toast("x","Era "+nn(q.pc,viSol()),CORDA_C[q.s]+", "+(q.f?q.f+"ª casa":"solta"));quizNew(q);rr();};

/* ---------- VÍDEOS EM LOOP (YouTube) ---------- */
const ytId=u=>{const m=String(u||"").match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);return m?m[1]:"";};
const tSec=s=>{s=String(s||"").trim();if(!s)return 0;const p=s.split(":").map(Number);return p.length===2?p[0]*60+p[1]:p.length===3?p[0]*3600+p[1]*60+p[2]:+s||0;};
const tTxt=n=>{n=Math.max(0,Math.round(n||0));return Math.floor(n/60)+":"+pad(n%60);};
let YTP=null,YTT=null;
function viVidView(){const V=all("vvid").sort((a,b)=>(b.u||0)-(a.u||0));const cur=getD(VIEW.vid)||V[0];
  let h=`<div class="card"><b>${ic("youtube")} Treine um trecho em repetição</b><p class="small muted" style="margin:6px 0 10px">Cole o link de uma videoaula do YouTube, marque o início e o fim do trecho e ele repete sem parar, na velocidade que você quiser.</p>
   <div class="qadd" style="margin:0"><input id="vU" placeholder="Link do YouTube" inputmode="url"><button class="btn" data-a="vAdd">${ic("plus")} Adicionar</button></div></div>`;
  if(cur){h+=`<div class="vplayer"><div class="row"><b class="grow">${esc(cur.t||"Vídeo")}</b><button class="ib" data-a="vDel" data-id="${cur.id}" aria-label="Apagar">${ic("trash-2")}</button></div>
    <div class="ytbox"><div id="ytP"></div></div>
    <div class="vab"><div><span class="tiny muted">Início</span><b id="vIni">${tTxt(cur.ini)}</b><button class="btn ghost sm" data-a="vMark" data-k="ini">Marcar aqui</button></div><div><span class="tiny muted">Fim</span><b id="vFim">${cur.fim?tTxt(cur.fim):"—"}</b><button class="btn ghost sm" data-a="vMark" data-k="fim">Marcar aqui</button></div></div>
    <div class="row" style="margin-top:8px;flex-wrap:wrap"><div class="seg">${[.5,.75,1].map(v=>`<button data-a="vVel" data-v="${v}" aria-pressed="${(cur.vel||1)===v}">${v===1?"Normal":v*100+"%"}</button>`).join("")}</div><span class="chip m" id="vRep" style="margin-left:auto">${ic("repeat")} repetindo o trecho</span></div></div>`;
    after(()=>ytMount(cur));}
  if(V.length)h+=`<div class="grp">Meus vídeos</div>`+V.map(v=>`<button class="item atitem ${cur&&v.id===cur.id?"sel":""}" style="width:100%;text-align:left" data-a="vOpen" data-id="${v.id}"><span class="mb">${ic("youtube")}</span><span class="ibody"><b>${esc(v.t||"Vídeo")}</b><span class="small muted">Trecho ${tTxt(v.ini)} → ${v.fim?tTxt(v.fim):"fim"} · ${(v.vel||1)===1?"normal":(v.vel*100)+"%"}</span></span></button>`).join("");
  return h;}
ACT.vAdd=()=>{const u=$("vU").value.trim(),id=ytId(u);if(!id)return toast("triangle-alert","Link do YouTube inválido","Ex.: https://youtu.be/…");const d=save({id:"vvid_"+nid(),c:"vvid",yt:id,t:"Videoaula "+(all("vvid").length+1),ini:0,fim:0,vel:.75});VIEW.vid=d.id;rr();
  setTimeout(()=>textEditOne("Nome do vídeo","Nome","Ex.: Batida de samba no violão",v=>{d.t=v;save(d);rr();},d.t),300);};
ACT.vOpen=el=>{VIEW.vid=el.dataset.id;rr();window.scrollTo({top:0,behavior:"smooth"});};
ACT.vDel=el=>confirmSheet("Apagar este vídeo da lista?","","Apagar",()=>{removeDoc(el.dataset.id);VIEW.vid=null;rr();});
function ytLoad(){if(window.YT&&YT.Player)return Promise.resolve();return new Promise((res,rej)=>{const prev=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{prev&&prev();res();};const s=document.createElement("script");s.src="https://www.youtube.com/iframe_api";s.onerror=rej;document.head.appendChild(s);setTimeout(()=>{if(!(window.YT&&YT.Player))rej(new Error("tempo"));},9000);});}
async function ytMount(v){clearInterval(YTT);YTP=null;const box=$("ytP");if(!box)return;
  try{await ytLoad();if(!$("ytP"))return;YTP=new YT.Player("ytP",{videoId:v.yt,playerVars:{start:Math.floor(v.ini||0),rel:0,playsinline:1,modestbranding:1},events:{onReady:e=>{try{e.target.setPlaybackRate(v.vel||1);}catch(x){}},onStateChange:e=>{if(e.data===0&&YTP){YTP.seekTo(v.ini||0,true);YTP.playVideo();}}}});
    YTT=setInterval(()=>{const d=getD(v.id);if(!YTP||!YTP.getCurrentTime||!d||!$("ytP"))return;if(!document.body.contains(YTP.getIframe&&YTP.getIframe()))return clearInterval(YTT);const t=YTP.getCurrentTime();if(d.fim&&t>=d.fim){YTP.seekTo(d.ini||0,true);}},200);}
  catch(e){box.outerHTML=`<iframe src="https://www.youtube.com/embed/${v.yt}?start=${Math.floor(v.ini||0)}${v.fim?"&end="+Math.floor(v.fim):""}&loop=1&playlist=${v.yt}&playsinline=1" allow="autoplay; encrypted-media" allowfullscreen style="width:100%;aspect-ratio:16/9;border:0;border-radius:14px"></iframe><div class="tiny faint" style="margin-top:6px">Modo simples: o controle de trecho funciona completo na versão instalada do app.</div>`;}}
ACT.vMark=el=>{const v=getD(VIEW.vid)||all("vvid")[0];if(!v)return;if(!YTP||!YTP.getCurrentTime)return toast("youtube","Dê play no vídeo primeiro","");const t=Math.round(YTP.getCurrentTime());
  if(el.dataset.k==="ini"){v.ini=t;if(v.fim&&v.fim<=t)v.fim=0;}else{if(t<=(v.ini||0))return toast("triangle-alert","O fim precisa vir depois do início","");v.fim=t;}save(v);const a=$("vIni"),b=$("vFim");if(a)a.textContent=tTxt(v.ini);if(b)b.textContent=v.fim?tTxt(v.fim):"—";toast("repeat",el.dataset.k==="ini"?"Início marcado":"Fim marcado",tTxt(t));if(el.dataset.k==="fim")YTP.seekTo(v.ini||0,true);};
ACT.vVel=el=>{const v=getD(VIEW.vid)||all("vvid")[0];if(!v)return;v.vel=+el.dataset.v;save(v);try{YTP&&YTP.setPlaybackRate(v.vel);}catch(e){}qa('[data-a="vVel"]').forEach(b=>b.setAttribute("aria-pressed",String(+b.dataset.v===v.vel)));};
/* parar sons e vídeo ao sair */
const _render9=render;
render=function(){if(SIM.on&&!(VIEW.v==="viol"&&VIEW.tab==="sim"))simStop(true);if(!(VIEW.v==="viol"&&VIEW.tab==="vid")){clearInterval(YTT);YTP=null;}return _render9.apply(this,arguments);};

/* ======================================================================
   VIOLÃO · MÃO DIREITA: batidas e dedilhados com a mão em movimento
   Tokens: D = palhetada para baixo · U = para cima · X = abafa (pá) · P = polegar no baixo · p = polegar no baixo alternado
           I = indicador (3ª corda) · M = médio (2ª) · A = anelar (1ª) · F = indicador+médio+anelar juntos · PA = polegar+anelar (pinça) · . = pausa
   Visão: de quem toca, olhando para baixo. A corda de cima é a 6ª (Mi grave); "para baixo" vai da 6ª para a 1ª.
   ====================================================================== */
const RITMOS=[
 /* Batidas com a mão em pêndulo */
 {id:"r1",n:"Só para baixo",cat:"Batidas",tipo:"bat",sub:2,bpm:70,nv:1,c:"G",p:"D . D . D . D .",d:"A primeira batida. Repare: a mão sobe no ar entre um toque e outro, como um pêndulo."},
 {id:"r2",n:"Pop básica",cat:"Batidas",tipo:"bat",sub:2,bpm:76,nv:1,c:"G",p:"D . D U . U D U",d:"A batida mais usada no pop e no rock nacional. O braço nunca para: só não encosta nas cordas onde há pausa."},
 {id:"r3",n:"Balada",cat:"Batidas",tipo:"bat",sub:2,bpm:68,nv:1,c:"C",p:"D . D U D . D U",d:"Para músicas lentas e românticas."},
 {id:"r4",n:"Rock / folk",cat:"Batidas",tipo:"bat",sub:2,bpm:96,nv:2,c:"E",p:"D . D U D U D U",d:"Constante e cheia, com acento no início do compasso."},
 {id:"r5",n:"Pop com abafado (pá)",cat:"Batidas",tipo:"bat",sub:2,bpm:84,nv:2,c:"Am",p:"D . X U . U X U",d:"O “pá”: a mão bate de lado nas cordas e corta o som. Dá o efeito de caixa de bateria."},
 {id:"r6",n:"Reggae",cat:"Batidas",tipo:"bat",sub:2,bpm:72,nv:2,c:"A",p:". X . X . X . X",d:"Só no contratempo, curto e seco: toque e abafe logo em seguida."},
 {id:"r7",n:"Sertanejo / arrocha",cat:"Batidas",tipo:"bat",sub:2,bpm:88,nv:2,c:"D",p:"D . D U X U D U",d:"Batida embalada com o abafado no meio do compasso."},
 {id:"r8",n:"Ska / frevo-rock",cat:"Batidas",tipo:"bat",sub:2,bpm:120,nv:3,c:"C",p:"X U X U X U X U",d:"Rápida e percussiva: abafa para baixo, toca para cima."},
 /* Ritmos brasileiros com polegar */
 {id:"r9",n:"Baião",cat:"Ritmos brasileiros",tipo:"bat",sub:2,bpm:90,nv:2,c:"G",p:"P . X U P . X U",d:"Polegar no baixo marcando o pulso e o abafado respondendo. Versão didática."},
 {id:"r10",n:"Xote",cat:"Ritmos brasileiros",tipo:"bat",sub:2,bpm:84,nv:2,c:"D",p:"P . D U p . D U",d:"Baixo alternado (polegar) e o acorde para baixo e para cima."},
 {id:"r11",n:"Toada / moda de viola",cat:"Ritmos brasileiros",tipo:"bat",sub:2,bpm:80,nv:2,c:"A",p:"P . D U p . D .",d:"Cadenciado, com o polegar alternando os baixos."},
 {id:"r12",n:"Valsa (3 por 4)",cat:"Ritmos brasileiros",tipo:"ded",sub:2,bpm:84,nv:1,c:"C",p:"P . F . F .",d:"Um baixo e dois acordes beliscados: “tum, tchá, tchá”."},
 {id:"r13",n:"Guarânia / rasqueado",cat:"Ritmos brasileiros",tipo:"bat",sub:2,bpm:76,nv:2,c:"Am",p:"P . D U D U",d:"Em três tempos, base da música caipira e paraguaia."},
 {id:"r14",n:"Samba",cat:"Ritmos brasileiros",tipo:"ded",sub:4,bpm:64,nv:3,c:"Am7",p:"P . F F p F . F P . F F p . F .",d:"Polegar alternando no tempo e os dedos (indicador, médio e anelar juntos) no contratempo. Versão didática."},
 {id:"r15",n:"Bossa nova",cat:"Ritmos brasileiros",tipo:"ded",sub:4,bpm:60,nv:3,c:"Cmaj7",p:"P . F . p F . F P . F . p . F .",d:"Polegar constante e os dedos sincopados, bem leves. Versão didática da batida de João Gilberto."},
 {id:"r16",n:"Ijexá no violão",cat:"Ritmos brasileiros",tipo:"ded",sub:2,bpm:84,nv:2,c:"Em7",p:"P F . F p F . F",d:"Adaptação do toque do afoxé para o violão."},
 /* Dedilhados */
 {id:"r17",n:"Dedilhado básico (P I M A)",cat:"Dedilhados",tipo:"ded",sub:2,bpm:72,nv:1,c:"Am",p:"P I M A P I M A",d:"Cada dedo cuida da sua corda: polegar no baixo, indicador na 3ª, médio na 2ª, anelar na 1ª."},
 {id:"r18",n:"Arpejo de balada (P I M A M I)",cat:"Dedilhados",tipo:"ded",sub:3,bpm:60,nv:1,c:"C",p:"P I M A M I",d:"Sobe e desce: o dedilhado de músicas lentas em 6/8."},
 {id:"r19",n:"Pinça (P + A)",cat:"Dedilhados",tipo:"ded",sub:2,bpm:68,nv:2,c:"G",p:"PA I M I PA I M I",d:"Polegar e anelar tocam juntos, como uma pinça. Base de muita música popular."},
 {id:"r20",n:"Baixo alternado (Travis simples)",cat:"Dedilhados",tipo:"ded",sub:2,bpm:72,nv:3,c:"C",p:"P M p I P M p I",d:"O polegar alterna dois baixos enquanto os dedos respondem. Treina independência."},
 {id:"r21",n:"Arpejo descendente (P A M I)",cat:"Dedilhados",tipo:"ded",sub:2,bpm:70,nv:2,c:"Em",p:"P A M I P A M I",d:"Do agudo para o grave: contrário do dedilhado básico."}
];
const RH={id:"r2",chord:null,speed:1,on:false,ctx:null,t0:0,nt:0,k:0,timer:null,raf:null,vib:[0,0,0,0,0,0],since:0,cyc:0};
try{Object.assign(RH,JSON.parse(localStorage.getItem("mu_rh")||"{}"),{on:false,timer:null,raf:null,vib:[0,0,0,0,0,0]});}catch(e){}
const rhSave=()=>{try{localStorage.setItem("mu_rh",JSON.stringify({id:RH.id,chord:RH.chord,speed:RH.speed}));}catch(e){}};
const rhCur=()=>RITMOS.find(r=>r.id===RH.id)||RITMOS[1];
const rhChord=()=>chById(RH.chord||rhCur().c);
const rhTok=r=>r.p.trim().split(/\s+/).map(t=>t==="."?null:t);
const rhBpm=()=>Math.round(rhCur().bpm*RH.speed);
function rhBass(c){const F=chF(c);const b=F.findIndex(v=>v!=null);const alt=b===0?2:b===1?2:1;return{b,alt:F[alt]!=null?alt:b};}
const FINGER_S={I:3,M:4,A:5};
/* som de cada movimento */
function rhSound(tk,t){const c=rhChord(),F=chF(c),B=rhBass(c);const pl=(i,v)=>{if(F[i]!=null)pluck(OPEN[i]+F[i],t,v,i);};
  if(tk==="D")strum(c,t,"D",.3);else if(tk==="U")strum(c,t,"U",.3);
  else if(tk==="X"){gtMuteAll(t);const ctx=VI.ctx;const n=ctx.createBufferSource();if(!NOISE){NOISE=ctx.createBuffer(1,ctx.sampleRate*.2,ctx.sampleRate);const d=NOISE.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;}
    n.buffer=NOISE;const bp=ctx.createBiquadFilter();bp.type="bandpass";bp.frequency.value=1600;bp.Q.value=.8;const g=ctx.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.55,t+.003);g.gain.exponentialRampToValueAtTime(.0001,t+.07);n.connect(bp);bp.connect(g);g.connect(ctx.destination);n.start(t);n.stop(t+.1);}
  else{if(/P/.test(tk))pl(B.b,.42);if(/p/.test(tk))pl(B.alt,.38);if(/F/.test(tk)){pl(3,.24);pl(4,.24);pl(5,.24);}["I","M","A"].forEach(f=>{if(tk.includes(f)&&!/F/.test(tk))pl(FINGER_S[f],.3);});}}
function rhStrings(tk){const c=rhChord(),F=chF(c),B=rhBass(c);if(tk==="D")return[0,1,2,3,4,5].filter(i=>F[i]!=null);if(tk==="U")return[2,3,4,5].filter(i=>F[i]!=null);if(tk==="X")return[];
  const s=[];if(/P/.test(tk))s.push(B.b);if(/p/.test(tk))s.push(B.alt);if(/F/.test(tk))s.push(3,4,5);["I","M","A"].forEach(f=>{if(tk.includes(f)&&!/F/.test(tk))s.push(FINGER_S[f]);});return s;}
function rhLabel(tk,r){if(!tk)return r.tipo==="bat"?`<span class="rhl air">mão passa no ar</span>`:`<span class="rhl air">espera</span>`;
  if(tk==="D")return`<span class="rhl d">↓ Para baixo</span>`;if(tk==="U")return`<span class="rhl u">↑ Para cima</span>`;if(tk==="X")return`<span class="rhl x">✋ Abafa (pá)</span>`;
  const p=[];if(/P/.test(tk))p.push("Polegar no baixo");if(/p/.test(tk))p.push("Polegar no baixo alternado");if(/F/.test(tk))p.push("Indicador + médio + anelar juntos");["I","M","A"].forEach(f=>{if(tk.includes(f)&&!/F/.test(tk))p.push({I:"Indicador · 3ª corda",M:"Médio · 2ª corda",A:"Anelar · 1ª corda"}[f]);});
  return `<span class="rhl f">${p.join(" + ")}</span>`;}
/* desenho: corpo do violão visto por quem toca */
const RY=i=>62+i*26;
function rhView(){const r=rhCur(),T=rhTok(r),ch=rhChord();const cats=[...new Set(RITMOS.map(x=>x.cat))];
  let h=`<div class="rhstage"><div class="row" style="align-items:flex-start"><div class="grow"><div class="tiny" style="opacity:.75">${esc(r.cat)} · ${r.tipo==="bat"?"batida":"dedilhado"} · nível ${"●".repeat(r.nv)}${"○".repeat(3-r.nv)}</div><h2 style="margin:2px 0 0;font:800 1.35rem var(--disp)">${esc(r.n)}</h2></div><span class="chip" id="rhCyc" style="background:rgba(255,255,255,.14);color:#fff;border:0"></span></div>
   <div class="rhwrap"><div id="rhStage">${rhSVG()}</div><div class="atcount" id="rhCount"></div></div>
   <div class="rhlab" id="rhLab"><span class="rhl air">Toque em <b>Tocar</b> e observe a mão</span></div>
   <div class="rhlane">${T.map((tk,i)=>`<div class="rhc ${i%r.sub===0?"beat":""} ${tk?"t-"+(/[DUX]/.test(tk)&&tk.length===1?tk:"f"):""}" id="rhc${i}"><b>${tk==null?"·":tk==="D"?"↓":tk==="U"?"↑":tk==="X"?"✕":tk}</b><small>${i%r.sub===0?i/r.sub+1:r.sub===2?"e":r.sub===3?["","e","a"][i%3]:["","e","&","a"][i%4]}</small></div>`).join("")}</div>
   <div class="atctl"><button class="btn" id="rhB" data-a="rhGo">${ic(RH.on?"square":"play")} ${RH.on?"Parar":"Tocar"}</button>
     <div class="atspd">${[[.5,"50%"],[.75,"75%"],[1,"100%"],[1.25,"125%"]].map(([v,l])=>`<button data-a="rhSpd" data-v="${v}" aria-pressed="${RH.speed===v}">${l}</button>`).join("")}</div></div>
   <div class="row" style="margin-top:8px"><span class="small" style="opacity:.85">${ic("gauge")} <b id="rhBpmL">${rhBpm()}</b> bpm</span><input type="range" min="30" max="180" value="${rhBpm()}" data-in="rhBpmR" style="flex:1;accent-color:#F59E0B" aria-label="Andamento"></div>
   <div class="row" style="margin-top:8px;flex-wrap:wrap;gap:6px"><span class="tiny" style="opacity:.8">Acorde para ouvir:</span>${["Em","Am","C","G","D","E","A","Am7","Cmaj7","Em7"].map(id=>`<button class="rhch ${ch.id===id?"on":""}" data-a="rhCh" data-id="${id}">${esc(chById(id).n)}</button>`).join("")}</div>
   <div class="row" style="margin-top:8px;gap:8px"><span class="tiny" style="opacity:.8">Timbre:</span>${gtTimSel(true)}</div><div class="tiny" style="opacity:.85;margin-top:8px">${esc(r.d)}</div></div>`;
  h+=`<div class="card small" style="margin-top:12px"><b>Como ler</b><div class="leg" style="margin-top:8px"><div><b>↓</b>&nbsp;Para baixo: da 6ª para a 1ª corda</div><div><b>↑</b>&nbsp;Para cima: só as cordas mais finas</div><div><b>✕</b>&nbsp;Abafa: a lateral da mão bate e corta o som</div><div><b>·</b>&nbsp;A mão continua o movimento, sem tocar</div>
    <div><b>P / p</b>&nbsp;Polegar no baixo / baixo alternado</div><div><b>I M A</b>&nbsp;Indicador, médio e anelar</div><div><b>F</b>&nbsp;I, M e A juntos, beliscando</div><div><b>PA</b>&nbsp;Polegar e anelar juntos (pinça)</div></div>
    <p class="tiny muted" style="margin:10px 0 0">A imagem mostra o violão do jeito que você vê ao tocar, olhando para baixo: a corda de cima é a 6ª (Mi grave). O segredo das batidas é o <b>pêndulo</b>: o braço desce em todo tempo e sobe em todo contratempo, mesmo quando não encosta nas cordas.</p></div>`;
  h+=cats.map(cg=>`<div class="grp">${esc(cg)}</div>`+RITMOS.filter(x=>x.cat===cg).map(x=>`<button class="item atitem ${x.id===r.id?"sel":""}" style="width:100%;text-align:left" data-a="rhSel" data-id="${x.id}"><span class="mb">${ic(x.tipo==="bat"?"hand":"music")}</span><span class="ibody"><b>${esc(x.n)}</b><span class="small muted" style="display:block">${esc(x.d)}</span><span class="meta"><span class="chip" style="font-family:monospace;letter-spacing:.06em">${esc(x.p.replace(/D/g,"↓").replace(/U/g,"↑").replace(/X/g,"✕").replace(/\./g,"·"))}</span><span class="chip m">${["","Fácil","Médio","Difícil"][x.nv]}</span></span></span></button>`).join("")).join("");
  h+=`<div class="note" style="margin-top:14px">${ic("info")} Os ritmos brasileiros aparecem em versões didáticas. Cada músico tem sua levada; use como ponto de partida e copie também os seus violonistas favoritos na aba Vídeos em loop.</div>`;
  return h;}
ACT.rhSel=el=>{const was=RH.on;rhStop();RH.id=el.dataset.id;RH.chord=null;rhSave();rr();window.scrollTo({top:0,behavior:"smooth"});if(was)setTimeout(ACT.rhGo,250);};
ACT.rhCh=el=>{RH.chord=el.dataset.id;rhSave();qa(".rhch").forEach(b=>b.classList.toggle("on",b.dataset.id===RH.chord));if(rhCur().tipo==="ded"){const s=$("rhStage");if(s)s.innerHTML=rhSVG();}};
ACT.rhSpd=el=>{RH.speed=+el.dataset.v;rhSave();const was=RH.on;if(was)rhStop();rr();if(was)setTimeout(ACT.rhGo,200);};
CH.rhBpmR=el=>{RH.speed=Math.max(.2,(+el.value)/rhCur().bpm);const l=$("rhBpmL");if(l)l.textContent=el.value;qa(".atspd button").forEach(b=>b.setAttribute("aria-pressed","false"));rhSave();};
ACT.rhGo=()=>{if(RH.on)return rhStop();const c=viCtx();const r=rhCur();RH.on=true;RH.since=Date.now();RH.cyc=0;RH.dur=60/rhBpm()/r.sub;RH.t0=c.currentTime+.15+4*r.sub*RH.dur;RH.nt=c.currentTime+.15;RH.k=-4*r.sub;
  RH.timer=setInterval(rhSched,25);rhSched();RH.raf=requestAnimationFrame(rhDraw);const b=$("rhB");if(b)b.innerHTML=`${ic("square")} Parar`;try{navigator.wakeLock&&navigator.wakeLock.request("screen").then(l=>RH.lock=l).catch(()=>{});}catch(e){}};
function rhSched(){if(!RH.on)return;const r=rhCur(),T=rhTok(r),N=T.length;const want=60/rhBpm()/r.sub;
  if(Math.abs(want-RH.dur)>1e-4&&RH.k>=0){const now=RH.nt;RH.t0=now-(RH.k)*want;RH.dur=want;}
  while(RH.nt<VI.ctx.currentTime+.12){const k=RH.k;if(k<0){if((k%r.sub+r.sub)%r.sub===0)atClickV(RH.nt,k===-4*r.sub);}else{const tk=T[k%N];if(tk)rhSound(tk,RH.nt);if((k%N)%r.sub===0)atClickV(RH.nt,k%N===0,.07);}
    RH.k++;RH.nt+=RH.dur;}}
function rhDraw(){if(!RH.on)return;const r=rhCur(),T=rhTok(r),N=T.length,now=VI.ctx.currentTime;const el=(now-RH.t0)/RH.dur;const H=$("rhHand"),lab=$("rhLab"),cd=$("rhCount");if(!H){RH.raf=requestAnimationFrame(rhDraw);return;}
  if(el<0){const beat=4-Math.floor(-el/r.sub-1e-9);if(cd)cd.textContent=String(Math.max(1,Math.min(4,beat)));if(lab)lab.innerHTML=`<span class="rhl air">Prepare-se…</span>`;RH.raf=requestAnimationFrame(rhDraw);return;}
  if(cd&&cd.textContent)cd.textContent="";const kk=Math.floor(el),k=kk%N,fr=el-kk;const cyc=Math.floor(kk/N)+1;if(cyc!==RH.cyc){RH.cyc=cyc;const y=$("rhCyc");if(y)y.textContent="Volta "+cyc;}
  const tk=T[k];
  if(RH.lastK!==kk){RH.lastK=kk;qa(".rhc.on").forEach(e=>e.classList.remove("on"));const cell=$("rhc"+k);if(cell){cell.classList.add("on");const ln=cell.parentElement;const l=cell.offsetLeft-ln.offsetLeft;if(l<ln.scrollLeft||l+cell.offsetWidth>ln.scrollLeft+ln.clientWidth)ln.scrollLeft=Math.max(0,l-8);}
    if(lab)lab.innerHTML=rhLabel(tk,r);rhStrings(tk||"").forEach(i=>RH.vib[i]=now+.32);if(tk==="X")RH.vib=[0,0,0,0,0,0];
    if(r.tipo==="ded"){qa(".rhf",H).forEach(g=>g.classList.remove("pl"));if(tk){const fs=[];if(/P|p/.test(tk))fs.push("P");if(/F/.test(tk))fs.push("I","M","A");["I","M","A"].forEach(f=>{if(tk.includes(f)&&!/F/.test(tk))fs.push(f);});
      if(/p/.test(tk)){const g=$("rhfP");if(g){const c=rhChord(),B=rhBass(c);g.querySelector("circle").setAttribute("cy",RY(B.alt));g.querySelector("text").setAttribute("y",RY(B.alt)+4.5);g.querySelector("line").setAttribute("y1",RY(B.alt));}}
      else if(/P/.test(tk)){const g=$("rhfP");if(g){const B=rhBass(rhChord());g.querySelector("circle").setAttribute("cy",RY(B.b));g.querySelector("text").setAttribute("y",RY(B.b)+4.5);g.querySelector("line").setAttribute("y1",RY(B.b));}}
      fs.forEach(f=>{const g=$("rhf"+f);if(g){void g.getBBox();g.classList.add("pl");}});}}}
  for(let i=0;i<6;i++){const s=$("rhs"+i);if(s)s.classList.toggle("vib",RH.vib[i]>now);}
  if(r.tipo==="bat"){const down=kk%2===0;const top=RY(0)-30,bot=RY(5)+36;const e=fr<.55?(fr/.55):1;const ease=1-Math.pow(1-e,2);const y=down?top+(bot-top)*ease:bot-(bot-top)*ease;
    const air=!tk;const mute=tk==="X";const x=air?282:250;H.setAttribute("transform",`translate(${x} ${y}) ${air?"scale(1.12)":""}`);H.style.opacity=air?.6:1;const SH=$("rhShadow");if(SH){SH.setAttribute("transform",`translate(${x+(air?14:4)} ${y+(air?22:8)}) scale(${air?1.3:.85})`);SH.style.opacity=air?.12:.38;}H.classList.toggle("mute",mute);
    const ar=$("rhArrow");if(ar)ar.textContent=mute?"✕":down?"↓":"↑";}
  RH.raf=requestAnimationFrame(rhDraw);}
function rhStop(){RH.on=false;clearInterval(RH.timer);cancelAnimationFrame(RH.raf);try{RH.lock&&RH.lock.release();}catch(e){}const secs=RH.since?Math.round((Date.now()-RH.since)/1000):0;
  if(secs>=20){const id="viols_"+TODAY();const d=getD(id)||{id,c:"viols",d:TODAY(),seg:0};d.seg+=secs;save(d);}RH.since=0;RH.vib=[0,0,0,0,0,0];
  const b=$("rhB");if(b)b.innerHTML=`${ic("play")} Tocar`;const lab=$("rhLab");if(lab)lab.innerHTML=`<span class="rhl air">Toque em <b>Tocar</b> e observe a mão</span>`;qa(".rhs.vib").forEach(s=>s.classList.remove("vib"));const cd=$("rhCount");if(cd)cd.textContent="";}
const _render10=render;
render=function(){if(RH.on&&!(VIEW.v==="viol"&&VIEW.tab==="rit"))rhStop();return _render10.apply(this,arguments);};


/* ======================================================================
   VIOLÃO · som gravado (nota por nota, sem síntese) e violão em 3D realista
   ====================================================================== */
const GT={tim:(()=>{try{return localStorage.getItem("mu_gtim")||"n";}catch(e){return"n";}})(),bufs:{n:{},s:{}},pend:{n:{},s:{}},ring:[null,null,null,null,null,null],rev:null,dry:null,pre:false};
function viCtx(){if(!VI.ctx){const c=new (window.AudioContext||window.webkitAudioContext)();VI.ctx=c;
    const comp=c.createDynamicsCompressor();comp.threshold.value=-14;comp.knee.value=12;comp.ratio.value=3;comp.attack.value=.004;comp.release.value=.2;comp.connect(c.destination);
    const dry=c.createGain();dry.gain.value=.9;dry.connect(comp);
    const conv=c.createConvolver();const L=Math.floor(c.sampleRate*1.4),ir=c.createBuffer(2,L,c.sampleRate);for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<L;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/L,3.2)*.6;}conv.buffer=ir;
    const wet=c.createGain();wet.gain.value=.16;conv.connect(wet);wet.connect(comp);
    VI.out=c.createGain();VI.out.gain.value=1;VI.out.connect(dry);VI.out.connect(conv);}
  VI.ctx.resume&&VI.ctx.resume();if(!GT.pre){GT.pre=true;gtPreload(GT.tim);}return VI.ctx;}
/* As notas gravadas ficam em assets/violao/<timbre>/<nota>.mp3 e só são baixadas quando o violão é usado.
   Amostras: FluidR3_GM (Frank Wen), licença Creative Commons Attribution 3.0, via gleitz/midi-js-soundfonts. */
const GT_NOTAS=new Set([...Array(38).keys()].map(i=>40+i));
function gtDecode(tim,m){if(GT.bufs[tim][m])return Promise.resolve(GT.bufs[tim][m]);if(GT.pend[tim][m])return GT.pend[tim][m];if(!GT_NOTAS.has(+m)||!VI.ctx)return Promise.resolve(null);
  GT.pend[tim][m]=fetch(`assets/violao/${tim}/${m}.mp3`).then(r=>r.ok?r.arrayBuffer():Promise.reject(new Error("nota "+m))).then(ab=>new Promise((res,rej)=>VI.ctx.decodeAudioData(ab,res,rej)))
    .then(buf=>{const d=buf.getChannelData(0);let i=0;while(i<d.length&&Math.abs(d[i])<.008)i++;const e={buf,off:Math.max(0,i/buf.sampleRate-.003)};GT.bufs[tim][m]=e;return e;})
    .catch(()=>{delete GT.pend[tim][m];return null;});return GT.pend[tim][m];}
async function gtPreload(tim){const L=[...new Set([].concat(...[...Array(13).keys()].map(f=>OPEN.map(o=>o+f))))].filter(m=>m<=77);for(const m of L)await gtDecode(tim,m);}
function gtStopString(s,t){const r=GT.ring[s];if(r){try{r.g.gain.cancelScheduledValues(t);r.g.gain.setValueAtTime(r.g.gain.value||r.v,t);r.g.gain.exponentialRampToValueAtTime(.0001,t+.035);r.src.stop(t+.05);}catch(e){}GT.ring[s]=null;}}
function gtMuteAll(t){for(let s=0;s<6;s++)gtStopString(s,t);}
/* toca uma nota real da gravação (s = índice da corda, para uma corda não soar duas notas ao mesmo tempo) */
function pluck(midi,t,vol,s){const c=VI.ctx;if(!c)return;midi=Math.max(40,Math.min(77,midi));const e=GT.bufs[GT.tim][midi];
  if(!e){gtDecode(GT.tim,midi);return ksPluck(midi,t,vol,s);}
  if(s!=null)gtStopString(s,t);const src=c.createBufferSource();src.buffer=e.buf;const lp=c.createBiquadFilter();lp.type="lowpass";lp.frequency.value=1800+Math.min(1,vol*2.4)*9000;lp.Q.value=.3;
  const g=c.createGain();const v=Math.min(1,vol*2.2);g.gain.setValueAtTime(v,t);g.gain.setValueAtTime(v,t+2.6);g.gain.exponentialRampToValueAtTime(.0001,t+3.1);
  src.connect(lp);lp.connect(g);g.connect(VI.out);src.start(t,e.off);src.stop(t+3.15);if(s!=null)GT.ring[s]={src,g,v};}
/* reserva: síntese, usada só enquanto a gravação da nota ainda está carregando */
function ksPluck(midi,t,vol,s){const c=VI.ctx,src=c.createBufferSource();src.buffer=ksBuf(midi);const lp=c.createBiquadFilter();lp.type="lowpass";lp.frequency.value=2600;const g=c.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol*.8,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+1.6);src.connect(lp);lp.connect(g);g.connect(VI.out);src.start(t);src.stop(t+1.7);if(s!=null){gtStopString(s,t);GT.ring[s]={src,g,v:vol};}}
/* palhetada: as cordas soam em sequência, com leve variação humana */
function strum(c,t,dir,vol){const F=chF(c);let idx=[0,1,2,3,4,5].filter(i=>F[i]!=null);if(dir==="U")idx=idx.reverse().slice(0,4);
  const gap=dir==="U"?.011:.016;idx.forEach((i,k)=>{const hv=(vol||.3)*(dir==="U"?.72:1)*(1-k*.035)*(.94+Math.random()*.12);pluck(OPEN[i]+F[i],t+k*gap+Math.random()*.003,hv,i);});}
ACT.gtTim=el=>{GT.tim=el.dataset.v;try{localStorage.setItem("mu_gtim",GT.tim);}catch(e){}qa('[data-a="gtTim"]').forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.v===GT.tim)));if(VI.ctx)gtPreload(GT.tim);toast("guitar",GT.tim==="n"?"Violão de nylon":"Violão de aço","Timbre trocado");};
const gtTimSel=(dark)=>`<div class="seg gtsel ${dark?"dk":""}"><button data-a="gtTim" data-v="n" aria-pressed="${GT.tim==="n"}">Nylon</button><button data-a="gtTim" data-v="s" aria-pressed="${GT.tim==="s"}">Aço</button></div>`;

/* ---------- violão realista em perspectiva (mão direita) ---------- */
function rhSVG(){const r=rhCur(),nyl=GT.tim==="n";const th=[3.6,3.1,2.6,2.0,1.6,1.25];
  const defs=`<defs>
   <linearGradient id="gTop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F0CF98"/><stop offset=".45" stop-color="#E2B377"/><stop offset="1" stop-color="#C8914F"/></linearGradient>
   <pattern id="gGrain" width="400" height="7" patternUnits="userSpaceOnUse"><path d="M0 3.5 Q100 2.6 200 3.6 T400 3.3" stroke="#B9813F" stroke-width=".7" fill="none" opacity=".35"/></pattern>
   <radialGradient id="gHole" cx=".45" cy=".42" r=".6"><stop offset="0" stop-color="#050302"/><stop offset=".75" stop-color="#1A0D05"/><stop offset="1" stop-color="#3A1E0B"/></radialGradient>
   <linearGradient id="gBridge" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2A140A"/><stop offset=".5" stop-color="#4A2614"/><stop offset="1" stop-color="#22100A"/></linearGradient>
   <linearGradient id="sWound" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A6A55"/><stop offset=".45" stop-color="#F4EBDD"/><stop offset="1" stop-color="#6B5C48"/></linearGradient>
   <linearGradient id="sBronze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A4E1E"/><stop offset=".45" stop-color="#F7D8A0"/><stop offset="1" stop-color="#6A4114"/></linearGradient>
   <linearGradient id="sNylon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9B2A4"/><stop offset=".5" stop-color="#FFFDF7"/><stop offset="1" stop-color="#A9A193"/></linearGradient>
   <linearGradient id="sSteel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6F7378"/><stop offset=".5" stop-color="#F5F7FA"/><stop offset="1" stop-color="#5E6267"/></linearGradient>
   <pattern id="sWind" width="2.2" height="6" patternUnits="userSpaceOnUse"><rect width="1.1" height="6" fill="#000" opacity=".22"/></pattern>
   <radialGradient id="gSkin" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#F8D6B4"/><stop offset=".7" stop-color="#E9B88E"/><stop offset="1" stop-color="#C98E62"/></radialGradient>
   <linearGradient id="gPick" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBBF24"/><stop offset=".5" stop-color="#B45309"/><stop offset="1" stop-color="#78350F"/></linearGradient>
   <filter id="fSh" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4"/></filter>
   <filter id="fHand" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="#000" flood-opacity=".35"/></filter></defs>`;
  const body=`<path d="M-20 18 H420 V252 H-20 Z" fill="url(#gTop)"/><path d="M-20 18 H420 V252 H-20 Z" fill="url(#gGrain)"/>
   <rect x="-20" y="12" width="440" height="10" fill="#3B2412"/><rect x="-20" y="20" width="440" height="2" fill="#F1E2C6" opacity=".8"/><rect x="-20" y="248" width="440" height="10" fill="#3B2412"/><rect x="-20" y="246" width="440" height="2" fill="#F1E2C6" opacity=".8"/>
   <circle cx="118" cy="135" r="92" fill="none" stroke="#5B3216" stroke-width="5"/>
   ${[86,82,78].map((rr,i)=>`<circle cx="118" cy="135" r="${rr}" fill="none" stroke="${["#7C2D12","#E9D5A8","#14532D"][i]}" stroke-width="${i===1?3:2.4}" ${i===1?'stroke-dasharray="2 2.4"':""}/>`).join("")}
   <circle cx="118" cy="135" r="72" fill="#2A170B"/><circle cx="118" cy="135" r="69" fill="url(#gHole)"/><ellipse cx="104" cy="118" rx="40" ry="26" fill="#000" opacity=".35"/>
   <rect x="336" y="46" width="44" height="178" rx="10" fill="url(#gBridge)"/><rect x="344" y="52" width="4" height="166" rx="2" fill="#F5EBDD"/>
   ${[0,1,2,3,4,5].map(i=>`<circle cx="364" cy="${RY(i)}" r="4.2" fill="${nyl?"#1C0E06":"#F5EBDD"}" stroke="#000" stroke-opacity=".4"/>`).join("")}`;
  const strings=[0,1,2,3,4,5].map(i=>{const t=th[i],y=RY(i);const fill=nyl?(i<3?"url(#sWound)":"url(#sNylon)"):(i<4?"url(#sBronze)":"url(#sSteel)");const wound=nyl?i<3:i<4;
    return `<rect x="-20" y="${y+3}" width="368" height="${t}" fill="#000" opacity=".28" filter="url(#fSh)"/><g class="rhs" id="rhs${i}"><rect x="-20" y="${y-t/2}" width="368" height="${t}" rx="${t/2}" fill="${fill}"/>${wound?`<rect x="-20" y="${y-t/2}" width="368" height="${t}" fill="url(#sWind)"/>`:""}</g>
    <text x="6" y="${y-5}" font-size="9.5" font-weight="800" fill="#3B1D08" opacity=".75">${["6ª Mi","5ª Lá","4ª Ré","3ª Sol","2ª Si","1ª Mi"][i]}</text>`;}).join("");
  const handBat=`<g id="rhShadow" opacity=".35"><ellipse cx="0" cy="0" rx="34" ry="12" fill="#000" filter="url(#fSh)"/></g>
   <g id="rhHand" class="rhhand"><g class="rhh" filter="url(#fHand)">
    <path d="M-30 -30 C-46 -24 -54 -36 -44 -44 C-36 -50 -26 -44 -22 -40" fill="url(#gSkin)" stroke="#B9835B" stroke-width="1.6"/>
    <path d="M-28 -20 C-34 -50 -18 -72 6 -70 C30 -68 38 -48 30 -24 C24 -8 -18 -6 -28 -20 Z" fill="url(#gSkin)" stroke="#B9835B" stroke-width="1.8"/>
    <path d="M-14 -62 C-16 -82 -2 -86 0 -68 M2 -68 C2 -90 18 -90 16 -66 M16 -64 C20 -82 32 -78 28 -58" fill="url(#gSkin)" stroke="#B9835B" stroke-width="1.8"/>
    <path d="M-6 -16 C-8 -6 -4 2 2 4 C6 2 8 -6 6 -16 Z" fill="url(#gSkin)" stroke="#B9835B" stroke-width="1.6"/>
    <path d="M2 10 L-9 -8 Q2 -14 13 -8 Z" fill="url(#gPick)" stroke="#5A2A0A" stroke-width="1"/>
    <text x="2" y="-36" text-anchor="middle" font-size="16" font-weight="900" fill="#7C2D12" id="rhArrow">↓</text></g></g>`;
  const handDed=`<g id="rhHand" class="rhfing"><g filter="url(#fHand)"><path d="M300 ${RY(5)+24} C320 ${RY(5)+8} 372 ${RY(5)+10} 384 ${RY(5)+34} C390 ${RY(5)+58} 330 ${RY(5)+70} 304 ${RY(5)+54} Z" fill="url(#gSkin)" stroke="#B9835B" stroke-width="2"/></g>
    ${[["P",0,"#7C2D12"],["I",3,"#2563EB"],["M",4,"#16A34A"],["A",5,"#EA580C"]].map(([f,s,col],k)=>{const x=232+k*20,y=f==="P"?RY(rhBass(rhChord()).b):RY(s);return `<g class="rhf" id="rhf${f}"><line x1="${x}" y1="${y}" x2="${310+k*8}" y2="${RY(5)+34}" stroke="url(#gSkin)" stroke-width="${f==="P"?14:11}" stroke-linecap="round"/><line x1="${x}" y1="${y}" x2="${310+k*8}" y2="${RY(5)+34}" stroke="#B9835B" stroke-width="1" opacity=".5"/><circle cx="${x}" cy="${y}" r="12" fill="${col}" stroke="#fff" stroke-width="2.5" filter="url(#fHand)"/><text x="${x}" y="${y+4.5}" text-anchor="middle" font-size="12" font-weight="900" fill="#fff">${f}</text></g>`;}).join("")}</g>`;
  return `<svg viewBox="-20 -78 440 348" class="rhsvg" role="img" aria-label="Violão visto de quem toca, com a mão direita">${defs}${body}${strings}${r.tipo==="bat"?handBat:handDed}</svg>`;}
