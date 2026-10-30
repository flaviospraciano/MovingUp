"use strict";
/* Português para concursos · parte 1: regras (explicação + macete) e trilha de estudo.
   Carregado só quando o módulo de Português é aberto. */
window.PT=window.PT||{};
PT.REGRAS={
/* os porquês */
pq_int:["“Por que” no início de pergunta direta","Separado e sem acento quando equivale a “por qual motivo” e abre uma pergunta direta.","Troque por “por qual motivo”. Se couber e a pergunta continua, é separado e sem acento."],
pq_ind:["“Por que” em pergunta indireta","Também é separado e sem acento na pergunta indireta, depois de verbos como saber, entender, perguntar, explicar, descobrir, dizer, quero saber.","“Não sei por que…” = “não sei por qual motivo…”. Se a frase continua depois dele, sem acento."],
pq_rel:["“Por que” = pelo qual / pela qual","Preposição “por” + pronome relativo “que”: equivale a pelo qual, pela qual, pelos quais, pelas quais.","Teste: troque por “pelo(s) qual(is) / pela(s) qual(is)”. Se a frase continua com sentido, é “por que”."],
pq_reg:["“Por que” = por + que (integrante)","Quando um verbo ou nome pede a preposição “por” (torcer por, ansiar por, lutar por, esperar por) e vem em seguida uma oração com “que”.","Pergunte: torço por quê? Por isso: “que tudo dê certo”. Preposição + conjunção = separado."],
pq_fim:["“Por quê” no fim da frase","Separado e com acento quando fica no fim da frase ou isolado antes de pontuação forte (ponto, interrogação, exclamação), mesmo em pergunta indireta.","Encostou no ponto final, interrogação ou exclamação? Ganha acento: “por quê?”. Mas “Por que não?” continua sem acento: depois dele ainda vem “não”."],
pq_causa:["“Porque” causal ou explicativo","Junto e sem acento quando é conjunção de causa ou explicação, equivalendo a “pois”, “uma vez que”, “já que”.","Troque por “pois”. Se funcionar, é “porque”."],
pq_conf:["“Porque” em pergunta de confirmação","Em perguntas que já trazem a causa e pedem um sim ou não, usa-se “porque” junto: “Você faltou porque estava doente?”.","Se a resposta esperada é “sim” ou “não”, a causa já está na pergunta: é “porque”."],
pq_subst:["“Porquê” substantivo","Junto e com acento quando é substantivo: vem com artigo, pronome ou numeral (o, um, este, seu, cada) e significa “motivo, razão”. Vai para o plural: os porquês.","Tem “o” ou “um” antes? É substantivo: “porquê”. Vale até no fim da frase: “Não entendi o porquê.”"],
/* crase */
cr_art:["Crase: preposição + artigo","Há crase quando a palavra anterior exige a preposição “a” e a palavra seguinte, feminina, admite o artigo “a”.","Troque a palavra feminina por uma masculina: se aparecer “ao”, use “à”. Vou à feira → vou ao mercado."],
cr_masc:["Sem crase antes de masculino","Antes de palavra masculina não existe artigo “a”, então não há crase (a pé, a cavalo, a prazo, a respeito).","Masculino na frente? Crase nunca (salvo “à moda de” implícita)."],
cr_verbo:["Sem crase antes de verbo","Verbo não aceita artigo. “A” antes de infinitivo é só preposição: começou a chover, a partir de hoje.","Viu verbo depois do “a”? Sem crase."],
cr_pron:["Sem crase antes da maioria dos pronomes","Pronomes pessoais (ela, você), de tratamento (Vossa Excelência), demonstrativos esta e essa, indefinidos (alguém, ninguém, qualquer, cada, toda) e “quem” e “cuja” não aceitam artigo.","Pronome que não aceita “a” antes não tem crase. Exceções no próximo cartão: senhora, senhorita, dona, aquela."],
cr_senhora:["Crase antes de senhora, senhorita e dona","Senhora, senhorita, madame e dona (quando há determinante) aceitam artigo, logo admitem crase: entreguei à senhora.","Funciona como substantivo comum feminino: troque por “ao senhor”."],
cr_aquele:["Crase com aquele, aquela, aquilo","Quando a regência exige “a”, a preposição se funde com o “a” inicial de aquele(s), aquela(s), aquilo: àquele, àquela, àquilo.","Troque por “a este”: se a frase pede “a este”, use “àquele”. Se pede só “este” (sem preposição), fica “aquele”."],
cr_hora:["Crase nas horas","Horas determinadas levam crase: às 10h, à 1h, à meia-noite. Com “de… a…” sem artigo: de 8h a 18h; com artigo: das 8h às 18h.","“Das… às…” andam juntas; “de… a…” também. Não misture."],
cr_ha:["Há (tempo passado) × a (futuro ou distância)","“Há” é o verbo haver indicando tempo decorrido (= faz). “A” indica tempo futuro ou distância. Nenhum dos dois leva crase.","Troque por “faz”: se funcionar, é “há”. Daqui a, dentro de, a 5 km: “a”."],
cr_loc:["Locuções femininas","Locuções adverbiais, prepositivas e conjuntivas formadas por palavra feminina levam crase: às vezes, à noite, à medida que, à custa de, à procura de, às pressas, à beira de.","Locução com palavra feminina = crase. Exceções de instrumento ainda dividem gramáticos (a faca, a bala); nas provas, prevalece “à” em à vista e à mão quando há ambiguidade."],
cr_moda:["À moda de / à maneira de","Há crase quando a expressão “à moda de” ou “à maneira de” está escrita ou subentendida, mesmo antes de masculino: bife à milanesa, gol à Pelé.","Cabe “à moda de” no meio? Então é crase, mesmo com nome masculino depois."],
cr_lugar:["Crase com nomes de lugar","Use a regra da volta: se eu volto “da” Bahia, vou “à” Bahia; se volto “de” Fortaleza, vou “a” Fortaleza. Lugar com determinante leva crase: à Fortaleza de Alencar.","Volto da, crase há. Volto de, crase pra quê?"],
cr_casa:["Crase com casa","“Casa” no sentido de lar, sem determinante, não leva crase (voltei a casa). Com determinante, leva (voltei à casa dos meus pais).","Casa sozinha = sem crase. Casa de alguém = crase."],
cr_terra:["Crase com terra","“Terra” como oposição a mar/bordo, sem determinante, não leva crase (os marinheiros desceram a terra). Com determinante ou como planeta, leva (voltou à terra natal; a nave voltou à Terra).","Terra firme sozinha: sem crase. Terra natal ou planeta: crase."],
cr_dist:["Crase com distância","Distância indeterminada não leva crase (observava a distância). Distância determinada leva (à distância de 50 metros).","Disse quanto? Crase. Não disse? Sem crase."],
cr_plural:["“A” no singular antes de plural","Se o “a” está no singular e a palavra seguinte no plural, ele é só preposição: não vou a festas, refiro-me a pessoas. Com determinação: refiro-me às pessoas do grupo.","“a” + plural = sem crase. “às” + plural = crase."],
cr_rep:["Palavras repetidas","Entre palavras repetidas não há crase: cara a cara, gota a gota, frente a frente, ponta a ponta.","Palavra repetida dos dois lados: o “a” é só preposição."],
cr_fac:["Crase facultativa","É opcional antes de pronome possessivo feminino singular (a/à minha mãe), de nome próprio feminino de pessoa (a/à Maria) e depois de “até” (até a/à praia).","Possessivo feminino, nome de mulher ou “até”: as duas formas estão certas."],
cr_semprep:["Verbo que não pede preposição","Se a palavra anterior não exige preposição (verbo transitivo direto), o “a” é apenas artigo e não há crase: vi a garota, conheço a cidade, amo a música.","Troque por masculino: “vi o garoto”. Apareceu “o” e não “ao”? Sem crase."],
cr_aque:["“A que” × “à que”","Antes de “que” e “qual”, há crase se a regência pede “a” e o termo é feminino: a empresa à qual me referi; a camisa é igual à que comprei. Sem palavra feminina subentendida, só preposição: o filme a que assisti.","Troque o feminino por masculino: “igual ao que comprei” → “igual à que comprei”."],
cr_num:["Antes de numeral","Antes de numeral cardinal não há crase, salvo nas horas: assisti a duas palestras; de 1 a 5 de maio.","Número que não é hora: sem crase."],
cr_uma:["Antes de “uma” (artigo indefinido)","Não há crase antes de artigo indefinido: fui a uma reunião. Exceção: à uma hora.","“Uma” sem ser hora: sem crase."],
cr_nominal:["Crase pedida por nomes","Muitos nomes e adjetivos pedem “a”: obediência às leis, favorável à proposta, referente à reunião, devido à chuva, graças à ajuda, rente à parede.","Troque por masculino: favorável ao projeto → favorável à proposta."],
cr_trat:["Pronomes de tratamento","Vossa Excelência, Vossa Senhoria, Sua Majestade e similares não aceitam artigo: entreguei a Vossa Senhoria.","“Vossa” ou “Sua” + título: sem crase."],
/* classes de palavras */
cl_subst:["Substantivo","Nomeia seres, objetos, ações, sentimentos. Qualquer palavra precedida de artigo vira substantivo (substantivação): o jantar, o não, o porquê.","Cabe um artigo antes e ela nomeia algo? Substantivo."],
cl_adj:["Adjetivo","Caracteriza o substantivo e concorda com ele: casa bonita, homens altos.","Responde “como é?” e varia com o substantivo? Adjetivo."],
cl_adv:["Advérbio","Modifica verbo, adjetivo ou outro advérbio, indicando circunstância (tempo, modo, intensidade). É invariável: Ela está meio cansada.","Não varia e indica circunstância? Advérbio. “Meio” antes de adjetivo = advérbio, não varia."],
cl_pron:["Pronome","Substitui ou acompanha o substantivo, indicando a pessoa do discurso: ele, meu, este, alguém, que.","Pode trocar por um nome ou acompanha indicando posse, posição ou indefinição? Pronome."],
cl_conj:["Conjunção","Liga orações ou termos, estabelecendo relação (adição, oposição, causa, conclusão): e, mas, porque, portanto, embora.","Liga duas ideias? Conjunção. Veja a relação de sentido."],
cl_prep:["Preposição","Liga dois termos, subordinando um ao outro: de, para, com, em, por, sobre.","Não varia, liga palavras e não tem sentido sozinha? Preposição."],
cl_verbo:["Verbo","Indica ação, estado ou fenômeno e se flexiona em tempo, modo, número e pessoa.","Conjuga? É verbo."],
cl_num:["Numeral","Indica quantidade, ordem, multiplicação ou fração: dois, segundo, dobro, metade.","Conta, ordena, multiplica ou divide? Numeral."],
cl_que:["As funções do “que”","Pronome relativo (= o qual): o livro que li. Conjunção integrante (inicia oração que completa o verbo): disse que vem. Advérbio de intensidade: que bonito!","Troque por “o qual”: se der, é pronome relativo. Se a oração vira “isso”, é conjunção integrante."],
cl_se:["As funções do “se”","Partícula apassivadora (vendem-se casas = casas são vendidas), índice de indeterminação do sujeito (precisa-se de ajuda), pronome reflexivo (ele se feriu), conjunção condicional (se chover).","Dá para passar para a voz passiva? Apassivadora, e o verbo concorda. Verbo com preposição (precisa-se de)? Indeterminação, verbo no singular."],
/* outros tópicos */
co_verbal:["Concordância verbal","O verbo concorda com o sujeito, mesmo quando ele vem depois do verbo ou longe dele.","Ache o sujeito perguntando “quem?” ou “o quê?” ao verbo e coloque-o antes do verbo."],
co_haver:["Haver e fazer impessoais","Haver no sentido de existir ou de tempo decorrido e fazer indicando tempo são impessoais: ficam no singular (havia muitas pessoas; faz dois anos). A impessoalidade passa para o auxiliar: deve haver problemas.","Haver = existir ou tempo? Singular, sempre. Inclusive o verbo que o acompanha."],
co_se:["Concordância com o “se”","Com partícula apassivadora, o verbo concorda com o sujeito (vendem-se casas). Com índice de indeterminação (verbo com preposição), fica no singular (precisa-se de vendedores).","Verbo + se + preposição: singular. Verbo + se sem preposição: concorda."],
co_nominal:["Concordância nominal","Adjetivo concorda com o substantivo. Casos clássicos: “meio” (meia hora × meio cansada), “anexo, incluso, obrigado” variam; “menos” e “alerta” não variam; “é proibido entrada” × “é proibida a entrada”.","Com artigo, concorda; sem artigo, fica no masculino singular: é necessário paciência × é necessária a paciência."],
re_verbal:["Regência verbal","Alguns verbos mudam de sentido conforme a preposição: assistir a (ver) × assistir (ajudar); visar a (pretender) × visar (mirar, rubricar); aspirar a (desejar) × aspirar (respirar). Preferir algo a algo (nunca “do que”).","Na dúvida, lembre o sentido: ver um filme = assistir AO filme."],
re_nominal:["Regência nominal","Nomes também pedem preposições: apto a/para, ansioso por, contrário a, devoto de, residente em, situado em, impróprio para.","“Residente em”, “sito em”: quem mora, mora EM."],
cp_proc:["Próclise obrigatória","Palavras atrativas puxam o pronome para antes do verbo: negação (não, nunca), advérbios, pronomes relativos e indefinidos, conjunções subordinativas: Não me disseram; Quem te contou?","Tem “não”, “que”, advérbio ou pronome antes? Pronome antes do verbo."],
cp_enc:["Ênclise e início de frase","Na norma-padrão, não se inicia frase com pronome oblíquo átono: Disseram-me a verdade (e não “Me disseram”). Também ênclise com verbo no imperativo afirmativo e no infinitivo impessoal.","Frase começando com me, te, se, lhe? Na prova, está errada."],
cp_meso:["Mesóclise","Com futuro do presente e do pretérito, sem palavra atrativa, o pronome vai no meio do verbo: Dir-te-ei; Far-se-ia. Com atrativa, próclise: Não te direi.","Futuro sem atrativa? Pronome no meio."],
pt_virg:["Vírgula","Não se separa sujeito de verbo nem verbo de complemento. Usa-se vírgula para isolar adjunto adverbial deslocado (longo), aposto, vocativo, orações explicativas e conjunções intercaladas.","Sujeito, vírgula, verbo: erro clássico. Termo deslocado ou explicação: entre vírgulas."],
pt_expl:["Oração adjetiva explicativa × restritiva","Explicativa (entre vírgulas) se refere a todo o grupo; restritiva (sem vírgula) limita o grupo. Os alunos, que estudaram, passaram (todos estudaram) × Os alunos que estudaram passaram (só alguns).","Com vírgula, generaliza. Sem vírgula, restringe."],
ac_reg:["Acentuação","Oxítonas terminadas em a, e, o (seguidos ou não de s) e em, ens são acentuadas (café, também). Paroxítonas terminadas em l, n, r, x, ps, ã, ão, i, us, um, ditongo levam acento (fácil, hífen, caráter). Todas as proparoxítonas são acentuadas.","Proparoxítona: sempre. Oxítona com a, e, o, em. Paroxítona: o contrário das oxítonas."],
ac_novo:["Novo Acordo Ortográfico","Caiu o acento dos ditongos abertos “ei” e “oi” em paroxítonas (ideia, heroico), do hiato “oo” e “ee” (voo, leem), e o trema. Mantém-se em oxítonas (herói, papéis) e o acento diferencial de pôde/pode, pôr/por e têm/tem.","Ideia e heroico sem acento; herói e papéis com acento (oxítonas)."],
se_paron:["Parônimos e homônimos","Palavras parecidas com sentidos diferentes: eminente (importante) × iminente (prestes a acontecer); ratificar (confirmar) × retificar (corrigir); descrição × discrição; mandato × mandado; tráfego × tráfico; infringir (violar) × infligir (aplicar pena).","Iminente = imediato. Retificar = reta, corrigir. Infringir = infração."],
se_conect:["Conectivos e relações de sentido","Adversativas: mas, porém, contudo, entretanto, todavia, no entanto. Concessivas: embora, ainda que, mesmo que. Conclusivas: logo, portanto, por isso. Causais: porque, visto que, já que. Condicionais: se, caso, desde que (+ subjuntivo).","Concessiva admite o obstáculo e segue (embora). Adversativa opõe com força (mas). As bancas trocam uma pela outra para ver se o sentido se mantém."]};

/* trilha: do que dá base ao que dá segurança */
PT.TRILHA=[
 {id:"classes",n:"Classes de palavras",ic:"spell-check",regras:["cl_subst","cl_adj","cl_adv","cl_pron","cl_verbo","cl_num","cl_prep","cl_conj","cl_que","cl_se"],texto:`A base de tudo. Não dá para entender crase, concordância ou regência sem saber reconhecer a classe de cada palavra.
• Substantivo nomeia; qualquer palavra com artigo antes vira substantivo (o jantar, o sim, o porquê).
• Adjetivo caracteriza e concorda com o substantivo. Advérbio indica circunstância e não varia (“meio cansada”: meio é advérbio).
• Pronome substitui ou acompanha o nome. Numeral conta, ordena, multiplica ou divide.
• Preposição liga termos (de, em, por, para). Conjunção liga orações e cria relações de sentido.
• As bancas adoram o “que” e o “se”: veja os cartões das regras para cada função.`},
 {id:"acento",n:"Acentuação e Novo Acordo",ic:"spell-check",regras:["ac_reg","ac_novo"],texto:`• Proparoxítonas: todas acentuadas (lâmpada, último).
• Oxítonas: acentuadas quando terminam em a, e, o, em, ens (sofá, café, avô, também, parabéns).
• Paroxítonas: acentuadas quando terminam em l, n, r, x, ps, i(s), us, um, uns, ã(s), ão(s) e ditongo (fácil, hífen, açúcar, tórax, bíceps, júri, vírus, álbum, órfã, órgão, história).
• Novo Acordo: sem acento em ideia, assembleia, heroico, jiboia, voo, enjoo, leem, creem, para (verbo), pelo. Com acento: herói, papéis, chapéu (oxítonas e monossílabos), pôde (passado), pôr (verbo), têm/vêm (plural).`},
 {id:"porques",n:"Os porquês",ic:"spell-check",regras:["pq_int","pq_ind","pq_rel","pq_reg","pq_fim","pq_causa","pq_conf","pq_subst"],texto:`Quatro formas, quatro testes:
• por que = por qual motivo / pelo qual. Pergunta direta (Por que você saiu?), indireta (Não sei por que saiu) e relativa (O caminho por que passei = pelo qual).
• por quê = o mesmo, mas no fim da frase ou antes de pontuação forte (Você saiu por quê? Ele saiu e não disse por quê.).
• porque = pois, uma vez que. Causa ou explicação (Saí porque estava tarde). Também em pergunta de sim ou não que já traz a causa (Você saiu porque estava tarde?).
• porquê = o motivo, substantivo, com artigo ou pronome antes (Não entendi o porquê. Os porquês da crise.).
Armadilhas de prova: “Por que não?” (sem acento, há palavra depois), “o porquê” no fim da frase (continua porquê), “torço por que dê certo” (por + que integrante).`},
 {id:"crase",n:"Crase",ic:"spell-check",regras:["cr_art","cr_semprep","cr_masc","cr_verbo","cr_pron","cr_senhora","cr_trat","cr_aquele","cr_hora","cr_ha","cr_loc","cr_moda","cr_lugar","cr_casa","cr_terra","cr_dist","cr_plural","cr_rep","cr_num","cr_uma","cr_aque","cr_nominal","cr_fac"],texto:`Crase é a fusão da preposição “a” (exigida pela palavra anterior) com o artigo “a” (aceito pela palavra seguinte). Precisa dos dois.
O teste mais seguro: troque a palavra feminina por uma masculina. Se surgir “ao”, use “à”. Vou à praia → vou ao clube. Vi a praia → vi o clube (sem crase).
Nunca há crase: antes de masculino, verbo, pronomes pessoais e de tratamento, “uma” (exceto à uma hora), numerais (exceto horas), entre palavras repetidas e com “a” singular antes de plural.
Sempre há: horas determinadas (às 10h), locuções femininas (às vezes, à medida que), “à moda de” (mesmo implícita) e com aquele/aquela/aquilo quando há preposição.
Facultativa: antes de possessivo feminino singular, nome de mulher e depois de “até”.
Lugares: “volto da, crase há; volto de, crase pra quê?”. Há × a: há = tempo passado (faz); a = futuro ou distância.`},
 {id:"concord",n:"Concordância verbal e nominal",ic:"spell-check",regras:["co_verbal","co_haver","co_se","co_nominal"],texto:`• O verbo concorda com o sujeito, onde quer que ele esteja: Faltaram três candidatos. Chegaram, ontem à noite, os documentos.
• Haver (existir ou tempo) e fazer (tempo) são impessoais: Havia problemas. Faz dez anos. Deve haver soluções.
• Vendem-se casas (apassivadora: concorda). Precisa-se de técnicos (indeterminação: singular).
• Nominal: meio-dia e meia (hora); ela estava meio cansada (advérbio, invariável); seguem anexas as cópias; é proibido entrada × é proibida a entrada; menos e alerta não variam.`},
 {id:"regencia",n:"Regência",ic:"spell-check",regras:["re_verbal","re_nominal"],texto:`• Assistir a (ver): assisti ao jogo. Assistir (ajudar): o médico assistiu o paciente.
• Visar a (objetivar): visa ao lucro. Visar (rubricar, mirar): visou o documento.
• Aspirar a (desejar): aspira ao cargo. Aspirar (respirar): aspirou o ar puro.
• Preferir algo a algo: prefiro estudar a sair (nunca “mais do que”).
• Obedecer e desobedecer a: obedeça às regras. Implicar (acarretar) é direto: implica mudanças.
• Chegar e ir a (e não em): chegou ao escritório; vou ao banco.
• Nomes: residente em, situado em, apto a, ansioso por, contrário a, favorável a.`},
 {id:"coloc",n:"Colocação pronominal",ic:"spell-check",regras:["cp_proc","cp_enc","cp_meso"],texto:`• Próclise (antes do verbo) quando há palavra atrativa: não, nunca, já, sempre, que, quem, alguém, ninguém, conjunções subordinativas. Ex.: Não me disseram. Alguém te ligou.
• Ênclise (depois): no início da frase e no imperativo afirmativo. Ex.: Disseram-me tudo. Faça-o agora.
• Mesóclise: futuro do presente e do pretérito sem atrativa. Ex.: Dir-lhe-ei. Far-se-ia.
• Infinitivo precedido de preposição ou negação: ambas costumam ser aceitas (para ajudá-lo / para o ajudar).`},
 {id:"pontu",n:"Pontuação",ic:"spell-check",regras:["pt_virg","pt_expl"],texto:`• Nunca separe sujeito de verbo nem verbo de complemento com vírgula única.
• Use vírgula para isolar: adjunto adverbial deslocado (Ontem à noite, saímos), aposto (Ana, a diretora, chegou), vocativo (Pedro, venha), orações explicativas, conjunções intercaladas (Ele, porém, ficou).
• Orações adjetivas: explicativas entre vírgulas (generalizam); restritivas sem vírgula (limitam). A mudança altera o sentido, e as bancas cobram exatamente isso.
• Antes de “e”: vírgula quando os sujeitos são diferentes ou há valor adversativo.`},
 {id:"semant",n:"Semântica e conectivos",ic:"spell-check",regras:["se_paron","se_conect"],texto:`• Parônimos clássicos: eminente × iminente, ratificar × retificar, descrição × discrição, mandato × mandado, tráfego × tráfico, infringir × infligir, deferir (atender) × diferir (adiar), cessão × sessão × seção.
• Conectivos: as bancas trocam um conectivo por outro e perguntam se o sentido se mantém. Agrupe por relação: adversativa (mas, porém, contudo, todavia, no entanto), concessiva (embora, conquanto, ainda que), conclusiva (logo, portanto, por isso), causal (porque, já que, visto que), condicional (se, caso, desde que), final (para que, a fim de que).
• Atenção: “desde que” pode ser condicional (+ subjuntivo) ou temporal (+ indicativo).`}];
