"use strict";
/* ======================================================================
   IBGE · RECENSEADOR · MOTOR
   - Banco de 2.500 questões (1.250 técnicas, 625 português, 625 matemática),
     gerado de forma determinística (mesmos IDs sempre) a partir das bases
     52-ibge-tec.js e 53-ibge-por.js e dos geradores de matemática abaixo
   - Sessões com retorno imediato, caderno de erros e reforço espaçado
     (a questão errada volta depois de 5 a 8 questões até 2 acertos seguidos)
   - Simulado realista (15 + 15 + 30, 4 horas), estudo por tópico, Zero Erros
   - Jogo: XP, níveis com nomes da carreira censitária, combo, meta diária,
     sequência de dias e conquistas
   Fica todo dentro do módulo Estudos p/ concurso.
   ====================================================================== */
const IBGE_TOP_MAT={
 M01:{n:"Números naturais: operações, múltiplos e divisores",d:"MMC resolve 'quando coincidem de novo'. MDC resolve 'maior pedaço possível, sem sobras'. Ordem das operações: parênteses → multiplicação/divisão → soma/subtração."},
 M02:{n:"Números inteiros e racionais",d:"Fração de um número: divida pelo denominador e multiplique pelo numerador. Sinais: (−)·(−) = +. Para somar frações, iguale os denominadores."},
 M03:{n:"Razão, proporção e divisão proporcional",d:"Divisão proporcional: some as partes, divida o total pela soma e multiplique por cada parte."},
 M04:{n:"Regra de três simples",d:"Direta: as grandezas sobem juntas (multiplica cruzado). Inversa: uma sobe e a outra desce (mais gente → menos dias): multiplique em linha."},
 M05:{n:"Porcentagem",d:"x% de y = x·y/100. Aumento de x%: multiplique por (1 + x/100). Desconto de x%: multiplique por (1 − x/100)."},
 M06:{n:"Equações do 1º grau",d:"Traduza o texto: 'o dobro' = 2x; 'a metade' = x/2; 'excede em 5' = +5. Isole o x fazendo a operação inversa dos dois lados."},
 M07:{n:"Medidas e conversões",d:"km → m: ×1.000. m → cm: ×100. 1 ha = 10.000 m². 1 m³ = 1.000 L. 1 t = 1.000 kg. 1 h = 60 min."},
 M08:{n:"Áreas, perímetros e volumes",d:"Retângulo: área = base × altura; perímetro = soma dos lados. Triângulo: (base × altura)/2. Círculo: π·r². Volume do bloco: c × l × a (em m³; ×1.000 para litros)."},
 M09:{n:"Tabelas, gráficos e quadros",d:"Leia título, unidade e legenda antes de calcular. Média = soma ÷ quantidade. Variação percentual = (novo − antigo)/antigo × 100."},
 M10:{n:"Mapas, croquis e escalas",d:"Escala 1:X → 1 cm = X cm no terreno. Para km, divida por 100.000. No croqui, deslocamentos perpendiculares de 3 e 4 dão 5 em linha reta (Pitágoras)."}
};
const IBGE_CARDS_MAT=[
["M01","MMC e MDC sem confusão","MMC (mínimo múltiplo comum): eventos que se repetem e coincidem (ônibus a cada 12 e 18 min → coincidem a cada 36 min).\nMDC (máximo divisor comum): dividir em partes iguais, do maior tamanho possível, sem sobras (cordas de 24 m e 36 m → pedaços de 12 m).\nCritérios de divisibilidade: 2 (par), 3 (soma dos algarismos divisível por 3), 5 (termina em 0 ou 5), 10 (termina em 0)."],
["M02","Frações e sinais","3/4 de 120 = 120 ÷ 4 × 3 = 90. Somar frações: 1/2 + 1/3 = 3/6 + 2/6 = 5/6. Dividir por fração: multiplique pelo inverso.\nSinais: + com + = +; − com − = +; sinais diferentes = −. Temperatura de −3 °C a 5 °C: variou 8 °C."],
["M03","Divisão proporcional","Dividir 900 em partes proporcionais a 2, 3 e 4: soma 9 → 900 ÷ 9 = 100 → 200, 300 e 400.\nRazão entre a e b = a/b (a ordem importa). Proporção: a/b = c/d → a·d = b·c."],
["M04","Regra de três: direta ou inversa?","Pergunte: se uma grandeza dobra, a outra dobra (direta) ou cai pela metade (inversa)?\nDireta: 4 setores em 2 dias → 10 setores em x: x = 5 dias.\nInversa: 6 recenseadores em 10 dias → 12 recenseadores: 5 dias."],
["M05","Porcentagem em 30 segundos","10% = dividir por 10. 1% = dividir por 100. 25% = 1/4. 50% = metade.\nAumento de 20%: ×1,20. Desconto de 15%: ×0,85.\nPegadinha: aumentar 10% e depois diminuir 10% NÃO volta ao valor inicial (100 → 110 → 99)."],
["M06","Montando a equação","'Um número' = x. 'O dobro' = 2x. 'O triplo' = 3x. 'A metade' = x/2. 'Somado a 5' = +5. 'É' = '='.\nEx.: o dobro de um número mais 5 é 23 → 2x + 5 = 23 → 2x = 18 → x = 9. Confira sempre substituindo."],
["M07","Tabela de conversões","Comprimento: km ↔ hm ↔ dam ↔ m ↔ dm ↔ cm ↔ mm (×10 a cada degrau).\nÁrea: ×100 a cada degrau. 1 ha = 10.000 m² = 1 hm². 1 km² = 100 ha.\nVolume: ×1.000 a cada degrau. 1 m³ = 1.000 L. 1 dm³ = 1 L.\nMassa: 1 t = 1.000 kg; 1 kg = 1.000 g. Tempo: 1 h = 60 min = 3.600 s."],
["M08","Fórmulas de área e volume","Quadrado: l². Retângulo: b·h. Triângulo: b·h/2. Trapézio: (B + b)·h/2. Círculo: π·r² (π ≈ 3,14); comprimento da circunferência: 2·π·r.\nVolume do paralelepípedo: c·l·a. Cilindro: π·r²·h. Para litros, converta m³ × 1.000."],
["M09","Lendo tabelas e gráficos","1) Título e unidade (mil t? hectares?). 2) Fonte e período. 3) O que a pergunta quer (total, média, maior, variação).\nMédia aritmética = soma ÷ quantidade. Variação % = (final − inicial) ÷ inicial × 100. Em gráfico de setores, o círculo inteiro é 100% = 360°."],
["M10","Escalas e croquis","1:10.000 → 1 cm = 100 m. 1:25.000 → 1 cm = 250 m. 1:50.000 → 1 cm = 500 m. 1:100.000 → 1 cm = 1 km.\nDistância real = distância no mapa × denominador. Distância no mapa = real ÷ denominador (mesma unidade!).\nÁrea no mapa: multiplique pelo QUADRADO da escala."]
];
const IBGE_PEGA=[
["Censo × senso","Censo (com C) é o levantamento estatístico; senso (com S) é juízo. 'Bom senso', 'Censo Agro'."],
["1990 não teve","Não houve Censo Agro em 1990: o seguinte foi em 1996. E os do século XXI são 2007 e 2017 (não 2006/2016)."],
["5.569, 10.744, 645, 566","5.569 municípios · 10.744 distritos · ≈ 645 subdistritos · 566 agências do IBGE · 27 SES. As bancas trocam esses números entre si."],
["Lei estadual × lei municipal","Município é criado por lei ESTADUAL. Distrito é criado por lei MUNICIPAL."],
["15 × 50","Agrupamentos indígena e quilombola: 15 pessoas. Quartel, alojamento/acampamento, convento/hospital/ILPI/IACA: 50 habitantes. Prisão: mais de 50 presos. Agrovila: mais de 50 DOMICÍLIOS."],
["Linha seca não é rio seco","Linha seca é um limite reto, imaginário, que não existe no terreno. Não confunda com rio que secou."],
["Estrada não divide fazenda","Rio, estrada ou ferrovia cortando a terra NÃO tornam a área descontínua."],
["As 4 condições são TODAS","Áreas não contínuas só são um estabelecimento se TODAS as quatro condições forem atendidas: mesmo município, mesmos recursos técnicos, mesmo pessoal, mesma administração."],
["Sede primeiro, área depois","Estabelecimento em vários setores: vale o setor da SEDE. A maior parte das terras só decide quando NÃO há sede."],
["Recenseador não altera perímetro","Nem quando o limite sumiu. Avise a supervisão."],
["Quem decide se é recenseável","O questionário de abordagem inicial — não o olhar do recenseador por cima da cerca."],
["Autodeclaração","O recenseador não corrige nem questiona a identidade declarada. Pode haver mais de uma."],
["Nada de nomes no endereço","'Casa do Seu Zé' fere o sigilo estatístico. Use pontos fixos: 'em frente à caixa d'água'."],
["Comodato × arrendamento","Comodato = emprestado, SEM pagar. Arrendamento = com pagamento."],
["Latitude × longitude","Latitude: Equador, até 90°, N/S. Longitude: Greenwich, até 180°, L/O. Negativo = sul ou oeste."],
["Pesque-pague","Só é estabelecimento se cria e engorda peixe. Se só compra peixe pronto, não é."],
["Jacaré e rã","Fazem parte da aquicultura, junto com peixes, camarões e moluscos."],
["Haver × haverem","'Havia muitos produtores' (singular!). 'Deve haver' (auxiliar também no singular)."],
["Vir × ver","Se eu VIR (ver) o produtor... Quando ele VIER (vir) ao posto..."],
["Aumento e desconto iguais","+10% e depois −10% não volta ao início: 100 → 110 → 99."]
];

/* ---------- utilidades ---------- */
function ibRng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const ibPick=(r,L)=>L[Math.floor(r()*L.length)];
const ibShuf=(r,L)=>{const A=L.slice();for(let i=A.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[A[i],A[j]]=[A[j],A[i]];}return A;};
const ibInt=(r,a,b)=>a+Math.floor(r()*(b-a+1));
const nf=(v,d=0)=>Number(v).toLocaleString("pt-BR",{minimumFractionDigits:d,maximumFractionDigits:d});
const nfa=v=>Number.isInteger(v)?nf(v):nf(v,2).replace(/,?0+$/,"");
const LET=["A","B","C","D","E"];
/* monta questão: alts = [{t, why}] com a correta na posição 0; embaralha */
function ibMonta(r,o){const idx=ibShuf(r,[0,1,2,3,4]);const alt=idx.map(i=>o.alts[i].t);const ok=idx.indexOf(0);
  const com=idx.map((i,k)=>`(${LET[k]}) ${i===0?"CORRETA":"Incorreta"}. ${o.alts[i].why||""}`.trim()).join("\n");
  return{disc:o.disc,top:o.top,dif:o.dif||"Médio",en:o.en,alt,ok,com:(o.intro?o.intro+"\n\n":"")+com,dica:o.dica};}

/* ---------- CONHECIMENTOS TÉCNICOS ---------- */
function ibGerarTEC(r,alvo){const out=[],vis=new Set();const add=q=>{if(!q||new Set(q.alt).size<5)return;const k=q.en+"|"+q.alt[q.ok];if(vis.has(k))return;vis.add(k);out.push(q);};
  const porTop={};IBGE_FATOS.forEach((f,i)=>{(porTop[f[0]]=porTop[f[0]]||[]).push(i);});
  const tn=t=>{const n=IBGE_TOP_TEC[t].n;return /^[A-ZÁÉÍÓÚ][a-záéíóúãõç]/.test(n)?n.charAt(0).toLowerCase()+n.slice(1):n;};
  const falsosDe=t=>{const L=[];porTop[t].forEach(i=>IBGE_FATOS[i][3].forEach(fs=>L.push({t:fs,src:i})));return L;};
  const abre=["Segundo a apostila do 12º Censo Agro, sobre {T}, é correto afirmar que","Com base no material de estudo do IBGE, a respeito de {T}, assinale a afirmativa correta.","De acordo com as orientações do IBGE para o Censo Agropecuário, Florestal e Aquícola, sobre {T}:","Assinale a alternativa correta quanto a {T}, conforme a apostila do Recenseador."];
  const abreI=["Segundo a apostila do 12º Censo Agro, sobre {T}, assinale a alternativa INCORRETA.","A respeito de {T}, todas as afirmativas abaixo estão de acordo com o material do IBGE, EXCETO:","Sobre {T}, a única afirmativa em DESACORDO com a apostila é:"];
  /* 1) cenários escritos */
  IBGE_CEN.forEach(c=>{const alts=c[3].map((t,i)=>({t,why:i===c[4]?c[5]:"Contraria a orientação da apostila explicada na alternativa correta."}));const ord=[c[4]].concat([0,1,2,3,4].filter(i=>i!==c[4]));
    add(ibMonta(r,{disc:"TEC",top:c[0],dif:c[1],en:c[2],alts:ord.map(i=>alts[i]),dica:c[5]}));});
  /* 2) geradores de situação */
  const G=[ibSitGeo,ibSitEscala,ibSitCoord,ibSitTipo,ibSitContinua,ibSitSede,ibSitRecens,ibSitEndereco,ibSitHierarquia];
  for(let k=0;k<220;k++)add(G[k%G.length](r));
  /* 3) fatos: correta, incorreta e I/II/III, até completar */
  let guarda=0;
  while(out.length<alvo&&guarda++<20000){const tipo=guarda%5;const i=ibInt(r,0,IBGE_FATOS.length-1),f=IBGE_FATOS[i],t=f[0];const P=porTop[t];
    if(tipo<=1){/* correta */const Fs=ibShuf(r,falsosDe(t).filter(x=>x.src!==i));const minhas=f[3].map(fs=>({t:fs,src:i}));
      const errs=ibShuf(r,minhas).slice(0,ibInt(r,1,2)).concat(Fs).slice(0,4);if(errs.length<4)continue;
      add(ibMonta(r,{disc:"TEC",top:t,dif:tipo?"Fácil":"Médio",en:ibPick(r,abre).replace("{T}",tn(t)),dica:f[4],
        alts:[{t:f[2],why:f[4]}].concat(errs.map(e=>({t:e.t,why:"O correto é: "+IBGE_FATOS[e.src][2]})))}));}
    else if(tipo<=3){/* incorreta */const fs=ibPick(r,f[3]);const V=ibShuf(r,P.filter(j=>j!==i)).slice(0,4);if(V.length<4)continue;
      add(ibMonta(r,{disc:"TEC",top:t,dif:"Médio",en:ibPick(r,abreI).replace("{T}",tn(t)),dica:f[4],
        alts:[{t:fs,why:"Esta é a errada. O correto é: "+f[2]}].concat(V.map(j=>({t:IBGE_FATOS[j][2],why:"Está de acordo com a apostila (p. "+IBGE_FATOS[j][1]+")."})))}));}
    else{/* I, II, III */const tr=ibShuf(r,P).slice(0,3);if(tr.length<3)continue;const vf=tr.map(()=>r()<.55);if(!vf.some(Boolean))vf[ibInt(r,0,2)]=true;
      const txt=tr.map((j,k)=>vf[k]?IBGE_FATOS[j][2]:ibPick(r,IBGE_FATOS[j][3]));const rom=["I","II","III"];
      const certo=rom.filter((x,k)=>vf[k]);const nome=S=>S.length===3?"I, II e III":S.length===1?S[0]+", apenas":S.join(" e ")+", apenas";
      const todos=[["I"],["II"],["III"],["I","II"],["I","III"],["II","III"],["I","II","III"]].filter(S=>S.join()!==certo.join());
      const errs=ibShuf(r,todos).slice(0,4);
      const just=tr.map((j,k)=>`${rom[k]}: ${vf[k]?"verdadeira":"falsa — o correto é: "+IBGE_FATOS[j][2]}`).join("\n");
      add(ibMonta(r,{disc:"TEC",top:t,dif:"Difícil",en:`Sobre ${tn(t)}, analise as afirmativas a seguir.\nI. ${txt[0]}\nII. ${txt[1]}\nIII. ${txt[2]}\nEstá(ão) correta(s):`,dica:IBGE_TOP_TEC[t].d,intro:just,
        alts:[{t:nome(certo),why:"Corresponde exatamente às afirmativas verdadeiras."}].concat(errs.map(S=>({t:nome(S),why:"Não corresponde às afirmativas verdadeiras."})))}));}}
  return out.slice(0,alvo);}
/* situações geradas */
const UFS=[["23","Ceará"],["29","Bahia"],["26","Pernambuco"],["31","Minas Gerais"],["51","Mato Grosso"],["15","Pará"],["43","Rio Grande do Sul"],["21","Maranhão"]];
function ibSitGeo(r){const uf=ibPick(r,UFS),mu=String(ibInt(r,10000,99999)),di=String(ibInt(r,5,20)).padStart(2,"0"),sd=ibPick(r,["00","00","01","02"]),se=String(ibInt(r,1,950)).padStart(4,"0");
  const code=`${uf[0]} ${mu} ${di} ${sd} ${se}`;const parts={UF:uf[0],município:mu,distrito:di,subdistrito:sd,setor:se};const k=ibPick(r,["município","distrito","setor","UF","subdistrito"]);
  const pool=Object.entries(parts).filter(([n,v])=>n!==k).map(([n,v])=>({t:v,why:`É o código do ${n}.`}));const opts=[{t:parts[k],why:`Ordem do geocódigo: UF (2) + município (5) + distrito (2) + subdistrito (2) + setor (4).`}].concat(pool);
  if(new Set(opts.map(o=>o.t)).size<5)opts[4]={t:code.replace(/ /g,""),why:"É o geocódigo completo, não uma parte."};
  return ibMonta(r,{disc:"TEC",top:"T08",dif:"Médio",en:`Um setor censitário (${uf[1]}) tem o geocódigo ${code}. O código que identifica o ${k} é:`,alts:opts,dica:IBGE_TOP_TEC.T08.d});}
function ibSitEscala(r){const den=ibPick(r,[10000,20000,25000,50000,100000]),cm=ibPick(r,[2,3,4,5,6,7,8,1.5,2.5]);const m=cm*den/100;const fmt=v=>v>=1000?nfa(v/1000)+" km":nfa(v)+" m";
  const opts=[{t:fmt(m),why:`${nfa(cm)} cm × ${nf(den)} = ${nf(cm*den)} cm = ${nfa(m)} m.`},{t:fmt(m*10),why:"Erro de conversão: multiplicou por 10 a mais."},{t:fmt(m/10),why:"Erro de conversão: dividiu por 10 a mais."},{t:fmt(m*100),why:"Esqueceu de converter centímetros em metros."},{t:fmt(den/cm/100),why:"Dividiu em vez de multiplicar."}];
  if(new Set(opts.map(o=>o.t)).size<5)opts[4]={t:fmt(m+500),why:"Valor sem relação com a escala."};
  return ibMonta(r,{disc:"TEC",top:"T06",dif:"Médio",en:`No mapa do setor, na escala 1:${nf(den)}, a distância entre o ponto inicial e a sede de um estabelecimento é de ${nfa(cm)} cm. A distância real é de:`,alts:opts,dica:IBGE_TOP_TEC.T06.d});}
function ibSitCoord(r){const la=ibPick(r,[-1,1])*(ibInt(r,100,3300)/100),lo=-(ibInt(r,3500,7300)/100);const sul=la<0;
  const ok=`${sul?"ao sul":"ao norte"} do Equador e a oeste de Greenwich`;const L=["ao sul do Equador e a oeste de Greenwich","ao norte do Equador e a oeste de Greenwich","ao sul do Equador e a leste de Greenwich","ao norte do Equador e a leste de Greenwich","sobre a linha do Equador, a oeste de Greenwich"];
  return ibMonta(r,{disc:"TEC",top:"T12",dif:"Fácil",en:`O DMC registrou as coordenadas latitude ${nfa(la)} e longitude ${nfa(lo)} na entrada da sede de um estabelecimento. Esse ponto está:`,alts:[{t:ok,why:"Latitude negativa = Sul; positiva = Norte. Longitude negativa = Oeste."}].concat(L.filter(x=>x!==ok).slice(0,4).map(t=>({t,why:"Sinais trocados: negativo indica sul (latitude) ou oeste (longitude)."}))),dica:IBGE_TOP_TEC.T12.d});}
const TIPOS=[["Agrupamento Indígena",n=>`${n} indivíduos indígenas residentes em moradias contíguas, com vínculos familiares`,15,"pessoas"],["Agrupamento Quilombola",n=>`${n} indivíduos autodeclarados quilombolas em moradias contíguas, com vínculos comunitários`,15,"pessoas"],["Quartel e Base Militar",n=>`uma instalação das Forças Armadas com ${n} habitantes permanentes residindo há mais de um ano`,50,"hab"],["Unidade prisional",n=>`uma unidade prisional com ${n} presos permanentes`,51,"presos"],["Agrovila",n=>`${n} domicílios associados a um Projeto de Assentamento`,51,"domicílios"]];
function ibSitTipo(r){const T=ibPick(r,TIPOS);const ok=r()<.7;const n=ok?T[2]+ibInt(r,0,40):Math.max(2,T[2]-ibInt(r,2,10));const corr=ok?T[0]:"Nenhum desses tipos, pois não atinge o mínimo exigido";
  const outros=TIPOS.filter(x=>x!==T).map(x=>x[0]);const L=[corr].concat(ok?["Nenhum desses tipos, pois não atinge o mínimo exigido"].concat(outros.slice(0,3)):[T[0]].concat(outros.slice(0,3)));
  return ibMonta(r,{disc:"TEC",top:"T09",dif:"Difícil",en:`Um setor censitário é composto por ${T[1](n)}. Pela apostila, ele se enquadra como:`,alts:L.map((t,i)=>({t,why:i===0?`${T[0]} exige ${T[2]===51?"mais de 50":T[2]===15?"15 ou mais":"pelo menos 50"} ${T[3]}.`:"Não corresponde aos critérios da apostila."})),dica:IBGE_TOP_TEC.T09.d});}
function ibSitContinua(r){const C=["estão no mesmo município","usam o mesmo trator e implementos","trabalham com os mesmos empregados","são administradas pelo próprio produtor"];const N=["ficam em municípios diferentes","usam máquinas próprias de cada área","têm empregados diferentes","uma delas é administrada de forma independente pelo filho"];
  const falha=r()<.6?ibInt(r,0,3):-1;const desc=C.map((c,i)=>i===falha?N[i]:c);const um=falha<0;
  const ok=um?"um único estabelecimento, pois atendem às quatro condições":"dois estabelecimentos, pois não atendem a todas as quatro condições";
  const L=[ok,um?"dois estabelecimentos, porque as áreas não são contínuas":"um único estabelecimento, porque pertencem ao mesmo dono","nenhum estabelecimento, por serem áreas separadas","um único estabelecimento, desde que a área total passe de 20 ha","o recenseador decide livremente, sem consultar a supervisão"];
  return ibMonta(r,{disc:"TEC",top:"T16",dif:"Difícil",en:`Um produtor explora duas áreas separadas entre si. As áreas ${desc.join("; ")}. Elas devem ser registradas como:`,alts:L.map((t,i)=>({t,why:i===0?"Áreas não contínuas formam um estabelecimento só se atenderem SIMULTANEAMENTE às quatro condições (p. 61–62).":"Contraria a regra das quatro condições simultâneas."})),dica:IBGE_TOP_TEC.T16.d});}
function ibSitSede(r){const temSede=r()<.65;const a=ibPick(r,["A","B","C"]),b=ibPick(r,["A","B","C"].filter(x=>x!==a));
  const en=temSede?`Um estabelecimento tem terras nos setores ${a} e ${b}, do mesmo município. A sede fica no setor ${a}, mas a maior parte das terras está no setor ${b}. O estabelecimento deve ser recenseado no setor:`:`Um estabelecimento sem sede tem 30% das terras no setor ${a} e 70% no setor ${b}. Ele deve ser recenseado no setor:`;
  const ok=temSede?a:b,ot=temSede?b:a;const L=[ok,ot,`${a} e ${b}, dividindo a produção`,"que for visitado primeiro","de menor área, para facilitar a coleta"];
  return ibMonta(r,{disc:"TEC",top:"T16",dif:"Médio",en,alts:L.map((t,i)=>({t,why:i===0?(temSede?"Vale o setor da sede (p. 61).":"Sem sede, vale o setor com a maior parte das terras (p. 61)."):"Contraria a regra da sede/maior parte das terras."})),dica:IBGE_TOP_TEC.T16.d});}
const RECENS=[["um sítio que produz mandioca e vende a farinha na feira",1],["uma família que cria porcos e galinhas para o próprio sustento",1],["um apicultor com colmeias em mata de terceiros",1],["um tanque com criação e engorda de tilápias para venda",1],["uma horta hidropônica que vende alface ao mercado",1],["um plantio de eucalipto para celulose",1],["uma propriedade com mudas novas de café, ainda sem produção",1],["um criadouro de rãs para comercialização",1],["um quintal com duas mangueiras e um cachorro, só para lazer",0],["um canil que cria cães de raça para venda",0],["um biotério que cria camundongos para laboratório",0],["um hotel-fazenda com pomar para os hóspedes",0],["uma estação experimental de pesquisa agrícola",0],["um convento com horta cultivada pelas irmãs",0],["uma penitenciária com lavoura trabalhada pelos detentos",0],["um criador de pássaros ornamentais",0],["um pesque-pague que só compra peixes já criados",0],["uma escola profissionalizante com área de cultivo",0]];
function ibSitRecens(r){const sim=r()<.5;const ok=ibPick(r,RECENS.filter(x=>x[1]===(sim?1:0)));const outros=ibShuf(r,RECENS.filter(x=>x[1]!==(sim?1:0))).slice(0,4);
  return ibMonta(r,{disc:"TEC",top:"T13",dif:"Médio",en:`Assinale a alternativa que apresenta ${sim?"uma unidade RECENSEÁVEL":"uma situação NÃO recenseável"} no Censo Agro.`,alts:[{t:ok[0].charAt(0).toUpperCase()+ok[0].slice(1),why:sim?"Há produção para venda ou subsistência.":"Está entre as atividades/locais excluídos ou é só lazer (p. 52–56)."}].concat(outros.map(x=>({t:x[0].charAt(0).toUpperCase()+x[0].slice(1),why:sim?"Não é recenseável.":"É recenseável."}))),dica:IBGE_TOP_TEC.T13.d});}
const ENDS=[["Estrada da Serrinha","4573","B","Galpão 2","Sítio Boa Esperança"],["Rodovia CE-060","12","KM","Lote 4","Povoado Lagoa Seca"],["Travessa Santa Inês","88","A","Fundos","Assentamento Chico Mendes"],["Acesso para Lavras","230","","Gleba 3","Comunidade do Campinho"],["Rio Imperador","15","","Casa 2","Ilha de Santo Antônio"]];
function ibSitEndereco(r){const e=ibPick(r,ENDS);const s=`${e[0]}, ${e[1]}${e[2]?" "+e[2]:""}, ${e[3]} – ${e[4]}`;const comp={logradouro:e[0],número:e[1],modificador:e[2],complemento:e[3],localidade:e[4]};
  const ks=Object.keys(comp).filter(k=>comp[k]);const k=ibPick(r,ks);const outros=ks.filter(x=>x!==k);while(outros.length<4)outros.push(["ponto de referência","CEP","coordenada"][outros.length%3]);
  return ibMonta(r,{disc:"TEC",top:"T11",dif:"Médio",en:`No endereço “${s}”, o trecho “${comp[k]}” corresponde ao componente:`,alts:[{t:k,why:"Padrão CNEFE (p. 43–47)."}].concat(outros.slice(0,4).map(x=>({t:x,why:`Não é o ${x}.`}))),dica:IBGE_TOP_TEC.T11.d});}
const HIER=[["Recenseador","ACS"],["ACS","ACR"],["ACR","AOR"],["ACA","AOR"],["ACI","AOR"]];
function ibSitHierarquia(r){const h=ibPick(r,HIER);const L=["AOR","ACR","ACS","Recenseador","ACQ","ACA","ACI","Analista Censitário Nacional"].filter(x=>x!==h[1]&&x!==h[0]);
  return ibMonta(r,{disc:"TEC",top:"T04",dif:"Fácil",en:`No posto censitário, o ${h[0]} se reporta ou presta apoio diretamente ao:`,alts:[{t:h[1],why:"Cadeia do posto: AOR → ACR → ACS → Recenseador; ACA e ACI apoiam o AOR (p. 14–15)."}].concat(ibShuf(r,L).slice(0,4).map(t=>({t,why:"Não é a relação direta indicada na apostila."}))),dica:IBGE_TOP_TEC.T04.d});}

/* ---------- LÍNGUA PORTUGUESA ---------- */
function ibGerarPOR(r,alvo){const out=[],vis=new Set();const add=q=>{if(!q||new Set(q.alt).size<5)return;const k=q.en+"|"+q.alt[q.ok];if(vis.has(k))return;vis.add(k);out.push(q);};
  const T=k=>IBGE_TOP_POR[k].d;const dest=s=>s.replace(/\*(.+?)\*/,"‘$1’");
  /* textos (escritos) */
  POR_TXT.forEach(tx=>tx.q.forEach(q=>{const ord=[q[2]].concat([0,1,2,3,4].filter(i=>i!==q[2]));add(ibMonta(r,{disc:"POR",top:"P01",dif:"Médio",en:`Leia o texto “${tx.t}”.\n\n${tx.x}\n\n${q[0]}`,alts:ord.map(i=>({t:q[1][i],why:i===q[2]?q[3]:"Não se sustenta no texto: confira o trecho citado na explicação da correta."})),dica:T("P01")}));}));
  const fab=[];
  /* sinônimo */
  fab.push(()=>{const it=ibPick(r,POR_SIN);const dis=ibShuf(r,POR_SIN.filter(x=>x!==it)).slice(0,4).map(x=>x[1]);
    return ibMonta(r,{disc:"POR",top:"P02",dif:"Fácil",en:`Em “${dest(it[2])}”, a palavra destacada pode ser substituída, sem alteração de sentido, por:`,alts:[{t:it[1],why:`“${it[0]}” significa “${it[1]}”.`}].concat(dis.map(d=>({t:d,why:"Não tem o mesmo sentido no contexto."}))),dica:T("P02")});});
  /* antônimo */
  fab.push(()=>{const it=ibPick(r,POR_ANT);const dis=ibShuf(r,POR_ANT.filter(x=>x!==it)).slice(0,3).map(x=>x[1]).concat([ibPick(r,POR_SIN)[1]]);
    return ibMonta(r,{disc:"POR",top:"P02",dif:"Fácil",en:`Em “${dest(it[2])}”, o antônimo da palavra destacada é:`,alts:[{t:it[1],why:`“${it[1]}” é o oposto de “${it[0]}”.`}].concat(dis.map(d=>({t:d,why:"Não é o oposto da palavra destacada."}))),dica:T("P02")});});
  /* homônimos: preencher */
  fab.push(()=>{const it=ibPick(r,POR_HOM);const dis=ibShuf(r,POR_HOM.filter(x=>x[1]!==it[1]&&x[2]!==it[1])).slice(0,3).map(x=>x[1]).filter(x=>x!==it[2]);while(dis.length<3)dis.push(ibPick(r,POR_HOM)[2]);
    return ibMonta(r,{disc:"POR",top:"P02",dif:"Médio",en:`Assinale a palavra que completa corretamente a frase: “${it[0]}”`,alts:[{t:it[1],why:it[3]}, {t:it[2],why:it[3]}].concat(dis.slice(0,3).map(d=>({t:d,why:"Não se encaixa no sentido da frase."}))),dica:it[3]});});
  /* homônimos: frase correta */
  fab.push(()=>{const it=ibPick(r,POR_HOM);const ers=ibShuf(r,POR_HOM.filter(x=>x!==it)).slice(0,4);
    return ibMonta(r,{disc:"POR",top:"P02",dif:"Médio",en:"Assinale a frase em que a palavra entre aspas está empregada corretamente.",alts:[{t:it[0].replace("___","“"+it[1]+"”"),why:it[3]}].concat(ers.map(x=>({t:x[0].replace("___","“"+x[2]+"”"),why:"Erro: "+x[3]}))),dica:T("P02")});});
  /* ortografia */
  fab.push(()=>{const it=ibPick(r,POR_ORT);const ers=ibShuf(r,POR_ORT.filter(x=>x!==it)).slice(0,4);
    return ibMonta(r,{disc:"POR",top:"P05",dif:"Fácil",en:"Assinale a palavra grafada de acordo com a ortografia oficial.",alts:[{t:it[0],why:"Grafia correta."}].concat(ers.map(x=>({t:ibPick(r,x[1]),why:`O correto é “${x[0]}”.`}))),dica:T("P05")});});
  fab.push(()=>{const ok=ibShuf(r,POR_ORT).slice(0,3);const ers=ibShuf(r,POR_ORT.filter(x=>!ok.includes(x))).slice(0,4).map(x=>{const g=ibShuf(r,POR_ORT.filter(y=>y!==x)).slice(0,2).map(y=>y[0]);const w=ibPick(r,x[1]);return{t:ibShuf(r,[w].concat(g)).join(", "),why:`Erro em “${w}”: o correto é “${x[0]}”.`};});
    return ibMonta(r,{disc:"POR",top:"P05",dif:"Médio",en:"Assinale a alternativa em que TODAS as palavras estão grafadas corretamente.",alts:[{t:ok.map(x=>x[0]).join(", "),why:"Todas corretas."}].concat(ers),dica:T("P05")});});
  /* acentuação */
  fab.push(()=>{const it=ibPick(r,POR_ACE);const ers=ibShuf(r,POR_ACE.filter(x=>x!==it)).slice(0,4);
    return ibMonta(r,{disc:"POR",top:"P06",dif:"Fácil",en:"Assinale a palavra corretamente grafada quanto à acentuação, segundo o Acordo Ortográfico vigente.",alts:[{t:it[0],why:`Correta: ${it[1]}.`}].concat(ers.map(x=>({t:x[2],why:`O correto é “${x[0]}” (${x[1]}).`}))),dica:T("P06")});});
  const cat=x=>/sem acento/.test(x[1])?"sem acento":/^proparox/.test(x[1])?"proparoxítona":/^parox/.test(x[1])?"paroxítona":/^oxít/.test(x[1])?"oxítona":"hiato";
  fab.push(()=>{const it=ibPick(r,POR_ACE.filter(x=>cat(x)!=="sem acento"));const mesmo=POR_ACE.filter(x=>x!==it&&x[1]===it[1]);if(!mesmo.length)return null;const ok=ibPick(r,mesmo);
    const ers=ibShuf(r,POR_ACE.filter(x=>cat(x)!==cat(it)&&cat(x)!=="sem acento")).slice(0,4);
    return ibMonta(r,{disc:"POR",top:"P06",dif:"Difícil",en:`A palavra “${it[0]}” é acentuada pela mesma regra que:`,alts:[{t:ok[0],why:`Ambas: ${it[1]}.`}].concat(ers.map(x=>({t:x[0],why:`“${x[0]}”: ${x[1]}.`}))),dica:T("P06")});});
  /* pontuação, concordância, regência, pronomes: certa/errada */
  const cf=(L,top,dif,enOk,enEr)=>{fab.push(()=>{const it=ibPick(r,L);const ers=ibShuf(r,L.filter(x=>x!==it)).slice(0,4);
      return ibMonta(r,{disc:"POR",top,dif,en:enOk,alts:[{t:it[0],why:it[2]}].concat(ers.map(x=>({t:x[1],why:"Erro: "+x[2]}))),dica:it[2]});});
    fab.push(()=>{const it=ibPick(r,L);const oks=ibShuf(r,L.filter(x=>x!==it)).slice(0,4);
      return ibMonta(r,{disc:"POR",top,dif,en:enEr,alts:[{t:it[1],why:"Aqui está o erro. "+it[2]}].concat(oks.map(x=>({t:x[0],why:"Correta."}))),dica:it[2]});});};
  cf(POR_PON,"P03","Médio","Assinale a frase corretamente pontuada.","Assinale a frase que apresenta ERRO de pontuação.");
  cf(POR_CON,"P08","Médio","Assinale a frase que respeita a concordância da norma-padrão.","Assinale a frase com ERRO de concordância.");
  cf(POR_REG,"P09","Médio","Assinale a frase que respeita a regência e o emprego do acento indicativo de crase segundo a norma-padrão.","Assinale a frase com ERRO de regência ou de crase.");
  cf(POR_PRO,"P12","Médio","Assinale a frase em que o pronome está empregado de acordo com a norma-padrão.","Assinale a frase com ERRO no emprego ou na colocação do pronome.");
  /* classes */
  const CLS=["substantivo","adjetivo","advérbio","pronome","verbo","preposição","conjunção","numeral","interjeição"];
  fab.push(()=>{const it=ibPick(r,POR_CLA);const ers=ibShuf(r,CLS.filter(c=>c!==it[1])).slice(0,4);
    return ibMonta(r,{disc:"POR",top:"P07",dif:"Médio",en:`Na frase “${dest(it[0])}”, a palavra destacada classifica-se como:`,alts:[{t:it[1],why:"Classificação pelo uso na frase."}].concat(ers.map(c=>({t:c,why:"Não é a função da palavra nesse contexto."}))),dica:T("P07")});});
  /* verbos */
  fab.push(()=>{const it=ibPick(r,POR_VER);const extra=ibShuf(r,POR_VER.filter(x=>x!==it)).map(x=>x[1]).filter(x=>x!==it[1]&&!it[2].includes(x));const ers=it[2].concat(extra).slice(0,4);
    return ibMonta(r,{disc:"POR",top:"P10",dif:"Médio",en:`Assinale a forma verbal que completa corretamente a frase: “${it[0]}”`,alts:[{t:it[1],why:it[3]}].concat(ers.map(x=>({t:x,why:"Forma inadequada à norma-padrão ou ao tempo pedido."}))),dica:it[3]});});
  /* vozes */
  fab.push(()=>{const it=ibPick(r,POR_VOZ);const out4=it[2].concat([ibPick(r,POR_VOZ.filter(x=>x!==it))[1]]).slice(0,4);
    return ibMonta(r,{disc:"POR",top:"P11",dif:"Difícil",en:`A frase “${it[0]}”, transposta para a voz passiva analítica, mantendo o tempo verbal, fica:`,alts:[{t:it[1],why:"Ser no mesmo tempo do verbo original + particípio concordando com o novo sujeito."}].concat(out4.map(x=>({t:x,why:"Tempo verbal diferente, concordância errada ou frase sem relação."}))),dica:T("P11")});});
  /* sequência lógica */
  fab.push(()=>{const it=ibPick(r,POR_SEQ);const ord=ibShuf(r,[0,1,2,3]);const fr=ord.map((o,k)=>`(${k+1}) ${it[o]}`).join("\n");
    const certa=[0,1,2,3].map(i=>ord.indexOf(i)+1).join(" – ");const perms=[];while(perms.length<4){const p=ibShuf(r,[1,2,3,4]).join(" – ");if(p!==certa&&!perms.includes(p))perms.push(p);}
    return ibMonta(r,{disc:"POR",top:"P04",dif:"Difícil",en:`As frases abaixo estão fora de ordem.\n${fr}\nA sequência que forma um parágrafo coeso e coerente é:`,alts:[{t:certa,why:"Segue a ordem lógica e os conectivos (em seguida, depois, por isso, por fim…)."}].concat(perms.map(p=>({t:p,why:"Quebra a sequência lógica dos fatos ou dos conectivos."}))),dica:T("P04")});});
  let g=0;while(out.length<alvo&&g++<30000)add(fab[g%fab.length]());
  return out.slice(0,alvo);}

/* ---------- MATEMÁTICA ---------- */
function mq(r,top,dif,en,certo,erros,expl,dica){const fx=t=>String(t).replace(/^(-?\d+)\.(\d+)$/,(m,a,b)=>a+","+b);certo=fx(certo);erros=erros.map(e=>({t:fx(e.t),why:e.why}));/* certo: string; erros: [{t,why}] */const vis=new Set([certo]);const E=[];erros.forEach(e=>{if(!vis.has(e.t)){vis.add(e.t);E.push(e);}});
  let k=1;while(E.length<4){const t=certo.replace(/\d+/,m=>String(+m+k*7));if(!vis.has(t)){vis.add(t);E.push({t,why:"Resultado de conta errada."});}k++;}
  return ibMonta(r,{disc:"MAT",top,dif,en,alts:[{t:certo,why:expl}].concat(E.slice(0,4)),dica:dica||IBGE_TOP_MAT[top].d});}
const mdc=(a,b)=>b?mdc(b,a%b):a,mmc=(a,b)=>a*b/mdc(a,b);
const IBR=v=>"R$ "+nf(v,2);
const MAT_GEN={
 M01:[r=>{const a=ibPick(r,[6,8,10,12,15,18,20,24]),b=ibPick(r,[9,14,16,25,30,36,40].filter(x=>x!==a));const m=mmc(a,b);const h=ibInt(r,6,9);const fim=h*60+m;
    return mq(r,"M01","Médio",`Dois carros do IBGE saem do posto às ${h}h: um retorna a cada ${a} min e o outro a cada ${b} min. Se saírem juntos, voltarão a se encontrar no posto às:`,`${Math.floor(fim/60)}h${pad(fim%60)}`,[{t:`${Math.floor((h*60+a*b)/60)}h${pad((h*60+a*b)%60)}`,why:"Multiplicou os intervalos em vez de usar o MMC."},{t:`${Math.floor((h*60+mdc(a,b))/60)}h${pad((h*60+mdc(a,b))%60)}`,why:"Usou o MDC no lugar do MMC."},{t:`${Math.floor((h*60+a+b)/60)}h${pad((h*60+a+b)%60)}`,why:"Somou os intervalos."}],`MMC(${a}, ${b}) = ${m} min. ${h}h + ${m} min = ${Math.floor(fim/60)}h${pad(fim%60)}.`);},
  r=>{const g=ibPick(r,[4,5,6,8,10,12]);const a=g*ibInt(r,3,9),b=g*ibInt(r,3,9);if(a===b)return null;const d=mdc(a,b);
    return mq(r,"M01","Médio",`Duas cordas de ${a} m e ${b} m serão cortadas em pedaços iguais, do maior tamanho possível, sem sobras. Cada pedaço terá:`,`${d} m`,[{t:`${mmc(a,b)} m`,why:"Usou o MMC."},{t:`${Math.min(a,b)} m`,why:"Não divide a maior corda sem sobra."},{t:`${d/2} m`,why:"Divide, mas não é o maior possível."}],`MDC(${a}, ${b}) = ${d} m.`);},
  r=>{const n=ibPick(r,[3,4,6,7,8,9,11,12,13]),lim=ibPick(r,[100,150,200,250]);const c=Math.floor(lim/n);
    return mq(r,"M01","Fácil",`Quantos múltiplos de ${n} existem entre 1 e ${lim}?`,String(c),[{t:String(c+1),why:"Contou um a mais (incluiu o zero ou passou do limite)."},{t:String(c-1),why:"Contou um a menos."},{t:String(Math.round(lim/n*1.1)),why:"Aproximação errada."}],`${lim} ÷ ${n} = ${nfa(lim/n)} → ${c} múltiplos.`);},
  r=>{const a=ibInt(r,12,40),b=ibInt(r,2,9),c=ibInt(r,2,9),d=ibInt(r,10,60);const v=a+b*c-d;
    return mq(r,"M01","Fácil",`O valor da expressão ${a} + ${b} × ${c} − ${d} é:`,String(v),[{t:String((a+b)*c-d),why:"Somou antes de multiplicar."},{t:String(a+b*(c-d)),why:"Subtraiu antes de multiplicar."},{t:String(a+b*c+d),why:"Trocou o sinal da subtração."}],`Primeiro a multiplicação: ${b} × ${c} = ${b*c}. Depois ${a} + ${b*c} − ${d} = ${v}.`);},
  r=>{const n=ibPick(r,[12,18,20,24,28,30,36,40,45,48,60]);let c=0;for(let i=1;i<=n;i++)if(n%i===0)c++;
    return mq(r,"M01","Médio",`Quantos divisores naturais tem o número ${n}?`,String(c),[{t:String(c-1),why:"Esqueceu o 1 ou o próprio número."},{t:String(c+2),why:"Contou números que não dividem."},{t:String(c-2),why:"Esqueceu o 1 e o próprio número."}],`Divisores de ${n}: ${Array.from({length:n},(_,i)=>i+1).filter(i=>n%i===0).join(", ")}.`);}],
 M02:[r=>{const d=ibPick(r,[3,4,5,8,10]),nn=ibInt(r,1,d-1),tot=d*ibInt(r,10,60);const v=tot/d*nn;
    return mq(r,"M02","Fácil",`Um setor tem ${tot} estabelecimentos. O recenseador já visitou ${nn}/${d} deles. Quantos ainda faltam?`,String(tot-v),[{t:String(v),why:"Esse é o número de visitados, não o que falta."},{t:String(tot-nn),why:"Subtraiu o numerador do total."},{t:String(tot/d),why:"Calculou só 1/"+d+"."}],`${nn}/${d} de ${tot} = ${v}. Faltam ${tot} − ${v} = ${tot-v}.`);},
  r=>{const a=ibInt(r,-9,-1),b=ibInt(r,4,15);
    return mq(r,"M02","Fácil",`De madrugada, a temperatura numa área rural foi de ${a} °C; à tarde, chegou a ${b} °C. A variação foi de:`,`${b-a} °C`,[{t:`${b+a} °C`,why:"Somou os valores com sinal, sem fazer a diferença."},{t:`${-(b-a)} °C`,why:"Sinal invertido."},{t:`${Math.abs(a)} °C`,why:"Considerou só o valor negativo."}],`${b} − (${a}) = ${b} + ${-a} = ${b-a} °C.`);},
  r=>{const[x,y]=ibPick(r,[[2,3],[3,4],[2,5],[4,6],[3,5]]);const p=ibPick(r,[1,1,2]),q=1;const num=p*y+q*x,den=x*y,g=mdc(num,den);
    return mq(r,"M02","Médio",`O valor de ${p}/${x} + ${q}/${y} é:`,`${num/g}/${den/g}`,[{t:`${p+q}/${x+y}`,why:"Somou numeradores e denominadores (erro clássico)."},{t:`${p+q}/${den}`,why:"Não ajustou os numeradores ao novo denominador."},{t:`${num}/${x+y}`,why:"Denominador errado."}],`MMC(${x}, ${y}) = ${den}. ${p}/${x} = ${p*y}/${den}; ${q}/${y} = ${q*x}/${den}. Soma = ${num}/${den}${g>1?` = ${num/g}/${den/g}`:""}.`);},
  r=>{const a=ibInt(r,12,95)/10,b=ibInt(r,2,6);const v=Math.round(a*b*100)/100;
    return mq(r,"M02","Fácil",`Cada saca pesa ${nfa(a)} kg. Quanto pesam ${b} sacas?`,`${nfa(v)} kg`,[{t:`${nfa(v*10)} kg`,why:"Errou a posição da vírgula."},{t:`${nfa(a+b)} kg`,why:"Somou em vez de multiplicar."},{t:`${nfa(Math.round(v/10*100)/100)} kg`,why:"Vírgula deslocada."}],`${nfa(a)} × ${b} = ${nfa(v)} kg.`);}],
 M03:[r=>{const P=ibShuf(r,[2,3,4,5,1,6]).slice(0,3),k=ibPick(r,[100,150,200,250,300,500]);const tot=k*(P[0]+P[1]+P[2]);const i=ibInt(r,0,2);
    return mq(r,"M03","Médio",`Um prêmio de ${IBR(tot)} será dividido entre três agentes em partes proporcionais a ${P.join(", ")}. O agente que recebe a parte proporcional a ${P[i]} ganhará:`,IBR(k*P[i]),[{t:IBR(tot/3),why:"Dividiu em partes iguais."},{t:IBR(k*P[(i+1)%3]),why:"Parte de outro agente."},{t:IBR(tot/P[i]),why:"Dividiu o total pela parte."}],`Soma das partes: ${P[0]+P[1]+P[2]}. ${IBR(tot)} ÷ ${P[0]+P[1]+P[2]} = ${IBR(k)} por parte. ${P[i]} × ${IBR(k)} = ${IBR(k*P[i])}.`);},
  r=>{const a=ibInt(r,2,9)*10,b=ibInt(r,2,9)*10;if(a===b)return null;const g=mdc(a,b);
    return mq(r,"M03","Fácil",`Em um setor há ${a} estabelecimentos de lavoura e ${b} de pecuária. A razão entre os de lavoura e os de pecuária é:`,`${a/g}/${b/g}`,[{t:`${b/g}/${a/g}`,why:"Inverteu a ordem da razão."},{t:`${a/g}/${(a+b)/g}`,why:"Usou o total no denominador."},{t:`${a-b>0?a-b:b-a}/${g}`,why:"Calculou diferença, não razão."}],`${a}/${b} = ${a/g}/${b/g} (a ordem importa: primeiro lavoura).`);},
  r=>{const a=ibInt(r,2,8),b=ibInt(r,3,9),c=ibInt(r,2,12);const x=b*c/a;if(!Number.isInteger(x)||a===b)return null;
    return mq(r,"M03","Fácil",`Na proporção ${a}/${b} = ${c}/x, o valor de x é:`,String(x),[{t:String(a*c/b),why:"Montou a proporção invertida."},{t:String(a*b*c),why:"Multiplicou todos."},{t:String(b+c-a),why:"Somou/subtraiu."}],`${a}·x = ${b}·${c} → x = ${b*c}/${a} = ${x}.`);}],
 M04:[r=>{const s=ibInt(r,2,6),d=ibPick(r,[2,3,4]),s2=s*ibInt(r,2,4);const v=d*s2/s;
    return mq(r,"M04","Fácil",`Um recenseador cobre ${s} setores em ${d} semanas. Mantendo o ritmo, quantas semanas levará para cobrir ${s2} setores?`,`${nfa(v)} semanas`,[{t:`${nfa(s*s2/d)} semanas`,why:"Montou a regra de três errada."},{t:`${nfa(s/s2*d)} semanas`,why:"Tratou como inversa, mas é direta."},{t:`${s2+d-s} semanas`,why:"Somou e subtraiu, sem proporção."}],`Direta: ${s}/${s2} = ${d}/x → x = ${d}·${s2}/${s} = ${nfa(v)}.`);},
  r=>{const p=ibPick(r,[4,5,6,8,10]),d=ibPick(r,[12,15,18,20,24,30]),p2=ibPick(r,[2,3,12,15,20,6].filter(x=>x!==p));const v=p*d/p2;if(!Number.isInteger(v))return null;
    return mq(r,"M04","Médio",`${p} recenseadores concluem a coleta de uma área em ${d} dias. Com ${p2} recenseadores, no mesmo ritmo, a coleta levará:`,`${v} dias`,[{t:`${nfa(d*p2/p)} dias`,why:"Tratou como direta, mas é inversa (mais gente, menos dias)."},{t:`${d+p-p2} dias`,why:"Somou e subtraiu."},{t:`${nfa(d/p2)} dias`,why:"Ignorou a equipe inicial."}],`Inversa: ${p} × ${d} = ${p2} × x → x = ${p*d}/${p2} = ${v} dias.`);},
  r=>{const kg=ibInt(r,2,9)*5,pr=ibInt(r,3,12),kg2=ibInt(r,2,12)*5;if(kg===kg2)return null;
    return mq(r,"M04","Fácil",`Se ${kg} kg de feijão custam ${IBR(pr*kg)}, quanto custarão ${kg2} kg?`,IBR(pr*kg2),[{t:IBR(pr*kg2*2),why:"Dobrou o valor por engano."},{t:IBR(pr*kg*kg/kg2),why:"Inverteu a proporção."},{t:IBR(pr*kg+kg2),why:"Somou os quilos ao preço."}],`Preço por kg: ${IBR(pr)}. ${kg2} × ${IBR(pr)} = ${IBR(pr*kg2)}.`);}], M05:[r=>{const p=ibPick(r,[5,10,12,15,20,25,30,35,40,45,60,75]),b=ibInt(r,2,40)*20;const v=p*b/100;
    return mq(r,"M05","Fácil",`Dos ${b} estabelecimentos de um município, ${p}% são de agricultura familiar. Quantos são de agricultura familiar?`,nfa(v),[{t:nfa(v*10),why:"Errou a casa decimal."},{t:nfa(b-v),why:"Esse é o restante."},{t:nfa(b/p),why:"Dividiu pelo percentual."}],`${p}% de ${b} = ${p} × ${b} / 100 = ${nfa(v)}.`);},
  r=>{const b=ibInt(r,5,60)*100,p=ibPick(r,[5,8,10,12,15,20,25]),up=r()<.5;const v=up?b*(1+p/100):b*(1-p/100);
    return mq(r,"M05","Médio",`Uma diária de ${IBR(b)} sofreu ${up?"aumento":"desconto"} de ${p}%. O novo valor é:`,IBR(v),[{t:IBR(up?b*(1-p/100):b*(1+p/100)),why:up?"Aplicou desconto em vez de aumento.":"Aplicou aumento em vez de desconto."},{t:IBR(b*p/100),why:"Esse é só o valor do "+(up?"aumento":"desconto")+"."},{t:IBR(up?b+p:b-p),why:"Somou/subtraiu o número do percentual, não a porcentagem."}],`${IBR(b)} × ${up?"(1 + "+p/100+")":"(1 − "+p/100+")"} = ${IBR(v)}.`);},
  r=>{const tot=ibPick(r,[40,50,80,120,150,200,250]),p=ibPick(r,[10,20,25,30,40,60,75]);const part=tot*p/100;
    return mq(r,"M05","Fácil",`Um recenseador visitou ${nfa(part)} dos ${tot} estabelecimentos do setor. Que percentual do setor ele já cobriu?`,`${p}%`,[{t:`${100-p}%`,why:"Esse é o percentual que falta."},{t:`${nfa(part/tot)}%`,why:"Esqueceu de multiplicar por 100."},{t:`${nfa(tot/part*10)}%`,why:"Inverteu a divisão."}],`${nfa(part)} ÷ ${tot} = ${p/100} → ${p}%.`);},
  r=>{const b=100*ibInt(r,1,9),p=ibPick(r,[10,20,25]);const v=b*(1+p/100)*(1-p/100);
    return mq(r,"M05","Difícil",`Um preço de ${IBR(b)} subiu ${p}% e, depois, caiu ${p}%. O preço final é:`,IBR(v),[{t:IBR(b),why:"Pegadinha: aumentos e descontos iguais NÃO se anulam."},{t:IBR(b*(1+p/100)),why:"Considerou só o aumento."},{t:IBR(b*(1-p/100)),why:"Considerou só o desconto."}],`${IBR(b)} × ${1+p/100} = ${IBR(b*(1+p/100))}; × ${1-p/100} = ${IBR(v)}.`);}],
 M06:[r=>{const x=ibInt(r,3,40),a=ibPick(r,[2,3,4,5]),b=ibInt(r,1,30);const c=a*x+b;const nome={2:"o dobro",3:"o triplo",4:"o quádruplo",5:"o quíntuplo"}[a];
    return mq(r,"M06","Fácil",`${nome.charAt(0).toUpperCase()+nome.slice(1)} de um número, somado a ${b}, é igual a ${c}. Esse número é:`,String(x),[{t:String((c+b)/a%1?c-b:(c+b)/a),why:"Somou em vez de subtrair."},{t:String(c-b),why:"Esqueceu de dividir por "+a+"."},{t:String(Math.round(c/a)),why:"Ignorou o "+b+"."}],`${a}x + ${b} = ${c} → ${a}x = ${c-b} → x = ${x}.`);},
  r=>{const v=ibInt(r,4,20),d=ibInt(r,2,12);const tot=2*v+d;
    return mq(r,"M06","Médio",`Dois recenseadores visitaram juntos ${tot} estabelecimentos. Um visitou ${d} a mais que o outro. Quantos visitou o que fez menos visitas?`,String(v),[{t:String(v+d),why:"Esse é o que fez mais visitas."},{t:String(tot/2),why:"Dividiu igualmente, ignorando a diferença."},{t:String(tot-d),why:"Não dividiu por 2."}],`x + (x + ${d}) = ${tot} → 2x = ${tot-d} → x = ${v}.`);},
  r=>{const x=ibInt(r,6,60)*2;const a=x/2,b=ibInt(r,1,15);
    return mq(r,"M06","Médio",`A metade de um número, menos ${b}, é igual a ${a-b}. O número é:`,String(x),[{t:String(a),why:"Esqueceu de multiplicar por 2."},{t:String(2*(a-2*b)),why:"Sinal trocado."},{t:String(x+b),why:"Somou o "+b+" a mais."}],`x/2 − ${b} = ${a-b} → x/2 = ${a} → x = ${x}.`);}],
 M07:[r=>{const km=ibInt(r,2,95)/10;return mq(r,"M07","Fácil",`${nfa(km)} km correspondem a:`,`${nf(km*1000)} m`,[{t:`${nf(km*100)} m`,why:"Multiplicou por 100 (1 km = 1.000 m)."},{t:`${nf(km*10000)} m`,why:"Multiplicou por 10.000."},{t:`${nfa(km/1000)} m`,why:"Dividiu em vez de multiplicar."}],`${nfa(km)} × 1.000 = ${nf(km*1000)} m.`);},
  r=>{const m2=ibInt(r,1,90)*5000;return mq(r,"M07","Médio",`Um terreno tem ${nf(m2)} m². Em hectares, isso equivale a:`,`${nfa(m2/10000)} ha`,[{t:`${nfa(m2/1000)} ha`,why:"Usou 1 ha = 1.000 m² (o certo é 10.000 m²)."},{t:`${nfa(m2/100)} ha`,why:"Usou 1 ha = 100 m²."},{t:`${nfa(m2/100000)} ha`,why:"Dividiu demais."}],`1 ha = 10.000 m². ${nf(m2)} ÷ 10.000 = ${nfa(m2/10000)} ha.`);},
  r=>{const m3=ibInt(r,2,40)/2;return mq(r,"M07","Fácil",`Uma caixa d'água de ${nfa(m3)} m³ comporta:`,`${nf(m3*1000)} litros`,[{t:`${nf(m3*100)} litros`,why:"Usou 1 m³ = 100 L."},{t:`${nf(m3*10)} litros`,why:"Usou 1 m³ = 10 L."},{t:`${nf(m3*10000)} litros`,why:"Usou 1 m³ = 10.000 L."}],`1 m³ = 1.000 L → ${nfa(m3)} × 1.000 = ${nf(m3*1000)} L.`);},
  r=>{const min=ibInt(r,70,400);return mq(r,"M07","Fácil",`Um deslocamento durou ${min} minutos, ou seja:`,`${Math.floor(min/60)} h ${min%60} min`,[{t:`${Math.floor(min/100)} h ${min%100} min`,why:"Tratou a hora como 100 minutos."},{t:`${nfa(Math.round(min/60*100)/100)} h`,why:"Deixou em hora decimal e confundiu a leitura."},{t:`${Math.floor(min/60)+1} h ${min%60} min`,why:"Somou uma hora a mais."}],`${min} ÷ 60 = ${Math.floor(min/60)} h e sobram ${min%60} min.`);},
  r=>{const t=ibInt(r,2,40)/2;return mq(r,"M07","Fácil",`Uma colheita de ${nfa(t)} toneladas equivale a:`,`${nf(t*1000)} kg`,[{t:`${nf(t*100)} kg`,why:"Usou 1 t = 100 kg."},{t:`${nf(t*10000)} kg`,why:"Usou 1 t = 10.000 kg."},{t:`${nfa(t/1000)} kg`,why:"Dividiu em vez de multiplicar."}],`1 t = 1.000 kg.`);}],
 M08:[r=>{const b=ibInt(r,5,40)*10,h=ibInt(r,5,40)*10;return mq(r,"M08","Médio",`Uma lavoura retangular mede ${b} m por ${h} m. Sua área, em hectares, é:`,`${nfa(b*h/10000)} ha`,[{t:`${nf(2*(b+h))} ha`,why:"Calculou o perímetro, não a área."},{t:`${nfa(b*h/1000)} ha`,why:"Conversão errada (1 ha = 10.000 m²)."},{t:`${nf(b*h)} ha`,why:"Não converteu m² para ha."}],`Área = ${b} × ${h} = ${nf(b*h)} m² = ${nfa(b*h/10000)} ha.`);},
  r=>{const b=ibInt(r,20,90),h=ibInt(r,15,70),fios=ibPick(r,[1,2,3,4]);const p=2*(b+h)*fios;
    return mq(r,"M08","Médio",`Um cercado retangular de ${b} m por ${h} m será cercado com ${fios} fio${fios>1?"s":""} de arame. São necessários:`,`${nf(p)} m de arame`,[{t:`${nf(b*h)} m de arame`,why:"Calculou a área."},{t:`${nf((b+h)*fios)} m de arame`,why:"Somou só dois lados."},{t:`${nf(2*(b+h))} m de arame`,why:"Esqueceu de multiplicar pelo número de fios."}],`Perímetro = 2 × (${b} + ${h}) = ${2*(b+h)} m; × ${fios} = ${nf(p)} m.`);},
  r=>{const c=ibInt(r,2,6),l=ibInt(r,1,4),a=ibInt(r,1,3);const v=c*l*a;return mq(r,"M08","Médio",`Um tanque de piscicultura tem forma de bloco retangular: ${c} m de comprimento, ${l} m de largura e ${a} m de profundidade. Sua capacidade é de:`,`${nf(v*1000)} litros`,[{t:`${nf(v)} litros`,why:"Não converteu m³ para litros."},{t:`${nf(v*100)} litros`,why:"Usou 1 m³ = 100 L."},{t:`${nf((c+l+a)*1000)} litros`,why:"Somou as medidas."}],`V = ${c} × ${l} × ${a} = ${v} m³ = ${nf(v*1000)} L.`);},
  r=>{const b=ibInt(r,4,30)*2,h=ibInt(r,3,25);return mq(r,"M08","Fácil",`Um terreno triangular tem base de ${b} m e altura de ${h} m. Sua área é:`,`${nf(b*h/2)} m²`,[{t:`${nf(b*h)} m²`,why:"Esqueceu de dividir por 2."},{t:`${nf(b+h)} m²`,why:"Somou as medidas."},{t:`${nf(b*h/4)} m²`,why:"Dividiu por 4."}],`(${b} × ${h}) / 2 = ${nf(b*h/2)} m².`);},
  r=>{const rr=ibInt(r,2,20);return mq(r,"M08","Médio",`Um pivô central irriga um círculo de raio ${rr*10} m. Usando π = 3,14, a área irrigada é:`,`${nf(3.14*rr*rr*100)} m²`,[{t:`${nf(2*3.14*rr*10)} m²`,why:"Calculou o comprimento da circunferência."},{t:`${nf(3.14*rr*10)} m²`,why:"Esqueceu de elevar o raio ao quadrado."},{t:`${nf(3.14*rr*rr*400)} m²`,why:"Usou o diâmetro no lugar do raio."}],`π·r² = 3,14 × ${rr*10}² = ${nf(3.14*rr*rr*100)} m².`);}],
 M09:[r=>{const M=["Sobral","Crato","Juazeiro","Iguatu","Quixadá"];const V=M.map(()=>ibInt(r,8,60)*10);const tab=M.map((m,i)=>`${m}: ${nf(V[i])} t`).join(" · ");const tipo=ibInt(r,0,2);
    if(tipo===0){const s=sum(V);return mq(r,"M09","Fácil",`A tabela mostra a produção de milho (em toneladas): ${tab}. A produção total foi de:`,`${nf(s)} t`,[{t:`${nf(s-V[0])} t`,why:"Esqueceu um município."},{t:`${nf(s/5)} t`,why:"Calculou a média."},{t:`${nf(Math.max(...V))} t`,why:"Pegou o maior valor."}],`Soma: ${V.join(" + ")} = ${nf(s)} t.`);}
    if(tipo===1){const s=sum(V);return mq(r,"M09","Médio",`A tabela mostra a produção de milho (em toneladas): ${tab}. A média de produção por município foi de:`,`${nfa(s/5)} t`,[{t:`${nf(s)} t`,why:"Esse é o total."},{t:`${nfa(s/4)} t`,why:"Dividiu por 4."},{t:`${nf(V[2])} t`,why:"Pegou o valor do meio da lista."}],`Total ${nf(s)} ÷ 5 = ${nfa(s/5)} t.`);}
    const i=V.indexOf(Math.max(...V)),j=V.indexOf(Math.min(...V));return mq(r,"M09","Fácil",`A tabela mostra a produção de milho (em toneladas): ${tab}. A diferença entre a maior e a menor produção é:`,`${nf(V[i]-V[j])} t`,[{t:`${nf(V[i]+V[j])} t`,why:"Somou."},{t:`${nf(V[i])} t`,why:"Só o maior valor."},{t:`${nf(Math.abs(V[0]-V[4]))} t`,why:"Usou o primeiro e o último da lista."}],`${M[i]} (${nf(V[i])}) − ${M[j]} (${nf(V[j])}) = ${nf(V[i]-V[j])} t.`);},
  r=>{const a=ibInt(r,40,200)*10,p=ibPick(r,[10,20,25,40,50,-10,-20,-25]);const b=a*(1+p/100);
    return mq(r,"M09","Médio",`Um gráfico mostra que o número de estabelecimentos de um município passou de ${nf(a)} em 2017 para ${nf(b)} em 2027. A variação percentual foi de:`,`${p>0?"+":""}${p}%`,[{t:`${p>0?"+":""}${nfa(Math.abs(b-a)/b*100*(p>0?1:-1))}%`,why:"Dividiu pelo valor final (o certo é pelo inicial)."},{t:`${p>0?"+":""}${nf(b-a)}%`,why:"Usou a diferença absoluta como porcentagem."},{t:`${p>0?"−":"+"}${Math.abs(p)}%`,why:"Sinal invertido."}],`(${nf(b)} − ${nf(a)}) ÷ ${nf(a)} × 100 = ${p}%.`);},
  r=>{const p=ibPick(r,[10,15,20,25,30,40,45,50]);return mq(r,"M09","Médio",`Num gráfico de setores, a fatia que representa a pecuária corresponde a ${p}% do total. O ângulo central dessa fatia é:`,`${nfa(p*3.6)}°`,[{t:`${p}°`,why:"Confundiu porcentagem com graus."},{t:`${nfa(p*1.8)}°`,why:"Usou 180° como total."},{t:`${nfa(p*36)}°`,why:"Multiplicou por 36."}],`100% = 360° → ${p}% = ${p} × 3,6 = ${nfa(p*3.6)}°.`);}],
 M10:[r=>{const den=ibPick(r,[10000,25000,50000,100000]),km=ibPick(r,[1,2,2.5,3,4,5,6,10]);const cm=km*100000/den;
    return mq(r,"M10","Médio",`Num mapa de escala 1:${nf(den)}, uma estrada de ${nfa(km)} km é representada por:`,`${nfa(cm)} cm`,[{t:`${nfa(cm*10)} cm`,why:"Erro de conversão (×10)."},{t:`${nfa(cm/10)} cm`,why:"Erro de conversão (÷10)."},{t:`${nfa(km*den/100000)} cm`,why:"Multiplicou pela escala em vez de dividir."}],`${nfa(km)} km = ${nf(km*100000)} cm. ÷ ${nf(den)} = ${nfa(cm)} cm.`);},
  r=>{const[a,b,c]=ibPick(r,[[3,4,5],[6,8,10],[5,12,13],[9,12,15],[8,15,17]]);const d1=ibPick(r,["norte","sul"]),d2=ibPick(r,["leste","oeste"]);
    return mq(r,"M10","Difícil",`Pelo croqui, o recenseador sai do posto, anda ${a} km para o ${d1} e depois ${b} km para o ${d2}. A distância em linha reta entre o posto e o ponto final é de:`,`${c} km`,[{t:`${a+b} km`,why:"Somou os trechos (esse é o caminho percorrido)."},{t:`${Math.abs(b-a)} km`,why:"Subtraiu os trechos."},{t:`${nfa(Math.round(Math.sqrt(a*a+b*b)*10)/10+1)} km`,why:"Erro no cálculo de Pitágoras."}],`Os trechos são perpendiculares: d² = ${a}² + ${b}² = ${c*c} → d = ${c} km.`);},
  r=>{const den=ibPick(r,[10000,20000,50000]),a=ibInt(r,2,6),b=ibInt(r,2,6);const lado1=a*den/100,lado2=b*den/100;const ha=lado1*lado2/10000;
    return mq(r,"M10","Difícil",`No mapa de escala 1:${nf(den)}, uma fazenda retangular aparece com ${a} cm × ${b} cm. Sua área real é de:`,`${nfa(ha)} ha`,[{t:`${nfa(a*b*den/10000/100)} ha`,why:"Aplicou a escala só uma vez sobre a área (ela entra ao quadrado)."},{t:`${nfa(ha*10)} ha`,why:"Erro de conversão."},{t:`${nfa(ha/100)} ha`,why:"Converteu m² em ha errado."}],`Lados reais: ${nf(lado1)} m × ${nf(lado2)} m = ${nf(lado1*lado2)} m² = ${nfa(ha)} ha.`);}]
};
function ibGerarMAT(r,alvo){const out=[],vis=new Set();const tops=Object.keys(MAT_GEN);let g=0;
  while(out.length<alvo&&g++<40000){const t=tops[g%tops.length];const q=ibPick(r,MAT_GEN[t])(r);if(!q)continue;const k=q.en+"|"+q.alt[q.ok];if(vis.has(k))continue;
    if(new Set(q.alt).size<5)continue;vis.add(k);out.push(q);}
  return out.slice(0,alvo);}

/* ---------- banco ---------- */
let IBGE_BANCO=null;
function ibBanco(){if(IBGE_BANCO)return IBGE_BANCO;const r=ibRng(20270612);
  const T=ibGerarTEC(r,1250),P=ibGerarPOR(r,625),M=ibGerarMAT(r,625);const B={};
  const nome={TEC:"TEC",POR:"POR",MAT:"MAT"};[[T,"TEC"],[P,"POR"],[M,"MAT"]].forEach(([L,p])=>L.forEach((q,i)=>{q.id=`${p}_${String(i+1).padStart(4,"0")}`;B[q.id]=q;}));
  const top={};Object.values(B).forEach(q=>{(top[q.top]=top[q.top]||[]).push(q.id);});
  IBGE_BANCO={B,ids:Object.keys(B),top,por:{TEC:T.map(q=>q.id),POR:P.map(q=>q.id),MAT:M.map(q=>q.id)}};return IBGE_BANCO;}
const IB_DISC={TEC:"Conhecimentos Técnicos",POR:"Língua Portuguesa",MAT:"Matemática"};
const ibTopNome=t=>(IBGE_TOP_TEC[t]||IBGE_TOP_POR[t]||IBGE_TOP_MAT[t]||{n:t}).n;
function ibJSON(){const{B,ids}=ibBanco();return ids.map(id=>{const q=B[id];const al={};q.alt.forEach((t,i)=>al[LET[i]]=t);
  return{id_questao:id,disciplina:IB_DISC[q.disc],topico_edital:ibTopNome(q.top),dificuldade:q.dif,enunciado:q.en,alternativas:al,resposta_correta:LET[q.ok],gabarito_comentado:q.com,dica_reforco:q.dica};});}
if(typeof window!=="undefined")window.ibJSON=ibJSON;
