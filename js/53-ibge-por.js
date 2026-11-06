"use strict";
/* ======================================================================
   IBGE · RECENSEADOR · LÍNGUA PORTUGUESA (base de itens para os geradores)
   ====================================================================== */
const IBGE_TOP_POR={
 P01:{n:"Compreensão de texto",d:"Responda pelo que o TEXTO diz, não pelo que você sabe. Desconfie de alternativas com 'sempre', 'nunca', 'apenas', 'todos': costumam extrapolar o texto."},
 P02:{n:"Significação: sinônimos, antônimos e homônimos",d:"Sinônimo = mesmo sentido; antônimo = sentido oposto; homônimos = mesma pronúncia e/ou grafia, sentidos diferentes (censo × senso); parônimos = parecidos (descrição × discrição). Sempre teste a troca na frase."},
 P03:{n:"Pontuação",d:"NUNCA vírgula entre sujeito e verbo, nem entre verbo e complemento. Vírgula obrigatória: vocativo, aposto explicativo, adjunto adverbial longo deslocado, antes de 'mas/porém' (adversativas)."},
 P04:{n:"Estrutura e sequência lógica de frases e parágrafos",d:"Siga os conectivos: 'Além disso' soma; 'No entanto' opõe; 'Portanto' conclui; 'Por exemplo' exemplifica. A frase que apresenta o tema vem primeiro; a conclusão, por último."},
 P05:{n:"Ortografia oficial",d:"exceção, paralisar, analisar, pesquisar, privilégio, beneficente, mexer, enxergar, cabeleireiro, pretensão, ascensão, obsessão, admissão, consciência, ansioso."},
 P06:{n:"Acentuação gráfica",d:"Proparoxítonas: todas acentuadas. Paroxítonas: terminadas em r, l, n, x, ps, ã(s), ão(s), i(s), us, um(uns), ditongo. Oxítonas: a(s), e(s), o(s), em(ens). Sem acento após o Acordo: ideia, heroico, assembleia, voo, enjoo, leem, creem, para (verbo)."},
 P07:{n:"Classes de palavras",d:"Substantivo nomeia; adjetivo caracteriza; advérbio modifica verbo/adjetivo/advérbio (invariável); pronome substitui ou acompanha o nome; preposição liga termos; conjunção liga orações. A classe depende do USO na frase."},
 P08:{n:"Concordância nominal e verbal",d:"HAVER (existir) e FAZER (tempo) são impessoais: ficam no singular. Voz passiva sintética concorda: 'Vendem-se casas'. 'É proibido entrada' × 'É proibida a entrada'. 'Meio' advérbio não varia (meio cansada); 'anexo/obrigado' concordam."},
 P09:{n:"Regência nominal e verbal (e crase)",d:"Assistir (ver) A; visar (objetivar) A; obedecer A; preferir X A Y (sem 'do que'); ir/chegar A (não 'em'); implicar (acarretar) sem preposição. Crase = a + a: use o truque de trocar por masculino (à praça → ao parque). Não há crase antes de verbo, masculino ou pronome pessoal."},
 P10:{n:"Verbos regulares e irregulares",d:"VER: se eu vir, quando ele vir. VIR: se eu vier. PÔR: se ele puser. INTERVIR (como vir): ele interveio. MANTER/DETER (como ter): se ele mantiver, ele deteve. CABER: coube. TRAZER: trouxe. REQUERER: eu requeiro."},
 P11:{n:"Vozes verbais",d:"Ativa: o sujeito faz. Passiva analítica: SER + particípio ('foram registrados'), com agente 'por'. Passiva sintética: verbo + SE ('Registraram-se os dados'). Na passagem, o TEMPO do verbo se mantém: 'registrou' → 'foi registrado'."},
 P12:{n:"Emprego dos pronomes",d:"'Para EU fazer' (eu é sujeito do verbo); 'entre MIM e você'. Próclise com palavra atrativa (não, nunca, que, ninguém): 'Não o vi'. Não se inicia frase com pronome oblíquo: 'Vi-o'. 'O/A' para objeto direto; 'LHE' para indireto."}
};
/* sinônimos: [palavra, sinônimo, frase com * em volta da palavra] */
const POR_SIN=[
["diligente","cuidadoso","O recenseador mostrou-se *diligente* ao revisar cada questionário."],["exíguo","escasso","O prazo para a coleta era *exíguo*."],["ratificar","confirmar","O produtor fez questão de *ratificar* a informação dada pela esposa."],
["inóspito","hostil","O acesso ao setor atravessava um terreno *inóspito*."],["perene","duradouro","O rio que limita o setor é *perene*."],["sucinto","breve","O relato do produtor foi *sucinto*."],
["tácito","implícito","Havia um acordo *tácito* entre os herdeiros."],["êxito","sucesso","A coleta foi concluída com *êxito*."],["dirimir","esclarecer","O supervisor ajudou a *dirimir* a dúvida do recenseador."],
["outorgar","conceder","A lei permite *outorgar* o uso da terra em comodato."],["precário","frágil","A ponte de madeira estava em estado *precário*."],["salientar","destacar","O ACS fez questão de *salientar* a importância do sigilo."],
["íntegro","honesto","Espera-se que o agente seja *íntegro* no trato com as informações."],["preponderante","predominante","A agricultura familiar é *preponderante* na região."],["tênue","sutil","Há uma diferença *tênue* entre os dois conceitos."],
["exaurir","esgotar","As chuvas fortes podem *exaurir* as estradas de terra."],["conciso","resumido","O relatório do posto foi *conciso*."],["coibir","reprimir","O sigilo estatístico busca *coibir* o uso indevido dos dados."],
["efêmero","passageiro","O alagamento da estrada foi *efêmero*."],["ímpeto","impulso","Teve o *ímpeto* de alterar o limite do setor, mas avisou a supervisão."],["inerente","próprio","A confidencialidade é *inerente* à função do recenseador."],
["notório","conhecido","É *notório* o papel do IBGE no planejamento do país."],["pleitear","reivindicar","Os moradores foram *pleitear* melhorias na estrada."],["vultoso","volumoso","A safra teve um valor *vultoso*."],
["árduo","difícil","O trabalho em setores rurais é *árduo*."],["veemente","enérgico","O produtor fez um protesto *veemente* contra a seca."],["profícuo","proveitoso","O treinamento foi *profícuo*."],
["anuir","concordar","O informante decidiu *anuir* à entrevista."],["ínfimo","mínimo","O prejuízo foi *ínfimo*."],["prolixo","extenso","Evite um descritivo *prolixo*."],
["iminente","próximo","O temporal *iminente* obrigou o recenseador a acelerar o passo."],["exímio","excelente","Ele é um *exímio* conhecedor da região."],["abolir","extinguir","A nova norma vai *abolir* o formulário em papel."],
["contíguo","vizinho","O terreno *contíguo* ao posto também foi visitado."],["consolidar","fortalecer","O IBGE buscou *consolidar* sua rede de agências."],["minucioso","detalhado","Fez um registro *minucioso* das culturas."],
["peculiar","particular","Cada comunidade tem um modo de vida *peculiar*."],["usufruir","desfrutar","A família pode *usufruir* da produção da horta."],["mitigar","atenuar","A irrigação ajuda a *mitigar* os efeitos da seca."],
["obsoleto","ultrapassado","O mapa antigo estava *obsoleto*."],["respaldo","apoio","O recenseador contou com o *respaldo* do supervisor."],["acarretar","provocar","A falta de chuva pode *acarretar* perdas na lavoura."]
];
/* antônimos: [palavra, antônimo, frase] */
const POR_ANT=[
["escasso","abundante","O pasto ficou *escasso* no período da seca."],["efêmero","duradouro","Foi um sucesso *efêmero*."],["prolixo","conciso","O texto do relatório ficou *prolixo*."],
["contíguo","distante","O terreno era *contíguo* à estrada."],["ascender","descer","O balão começou a *ascender*."],["ratificar","retificar","O supervisor resolveu *ratificar* o dado."],
["explícito","implícito","O acordo era *explícito*."],["rural","urbano","A coleta ocorreu na área *rural*."],["perene","temporário","O córrego é *perene*."],
["dócil","arisco","O animal era *dócil*."],["escassez","fartura","A *escassez* de chuvas preocupou os produtores."],["moroso","rápido","O deslocamento pelo rio foi *moroso*."],
["próspero","decadente","Era um município *próspero*."],["anuir","discordar","O informante preferiu *anuir*."],["ínfimo","enorme","O prejuízo foi *ínfimo*."],
["ameno","rigoroso","O clima estava *ameno*."],["lícito","ilícito","Era um negócio *lícito*."],["simplificar","complicar","O novo sistema veio *simplificar* a coleta."],
["inclusão","exclusão","A *inclusão* do endereço foi feita no DMC."],["presente","ausente","O produtor estava *presente*."],["habitual","raro","Esse tipo de limite é *habitual*."],
["fértil","árido","O solo era *fértil*."],["generoso","mesquinho","O vizinho foi *generoso*."],["obscuro","claro","O sentido da frase era *obscuro*."],
["vitória","derrota","Foi uma *vitória* da equipe."],["louvar","censurar","Decidiu *louvar* a atitude do colega."],["otimista","pessimista","Mostrou-se *otimista* com a safra."],
["preservar","destruir","É preciso *preservar* a mata nativa."],["inferior","superior","A produção foi *inferior* à do ano anterior."],["admitir","negar","Resolveu *admitir* o erro."]
];
/* homônimos e parônimos: [frase com ___, correta, errada, explicação] */
const POR_HOM=[
["O IBGE realiza o ___ agropecuário a cada década.","censo","senso","Censo = recenseamento, levantamento estatístico. Senso = juízo, entendimento (bom senso)."],
["O recenseador demonstrou bom ___ ao avisar a supervisão.","senso","censo","Senso = juízo, discernimento."],
["A ___ de treinamento começa às 8h.","sessão","seção","Sessão = reunião, tempo de duração. Seção = divisão, departamento. Cessão = ato de ceder."],
["Os documentos ficam na ___ de arquivo do posto.","seção","sessão","Seção = divisão, setor."],
["Houve a ___ da terra ao vizinho, sem cobrança.","cessão","sessão","Cessão = ato de ceder."],
["O trator precisou de ___ antes da colheita.","conserto","concerto","Conserto = reparo. Concerto = apresentação musical."],
["O ___ da orquestra foi na praça da cidade.","concerto","conserto","Concerto = espetáculo musical; também 'acordo, harmonia'."],
["O ___ da cerca era de 300 metros.","comprimento","cumprimento","Comprimento = extensão. Cumprimento = saudação ou execução."],
["O ___ dos prazos é responsabilidade do ACR.","cumprimento","comprimento","Cumprimento = execução, realização (cumprir)."],
["É preciso ___ a luz do galpão.","acender","ascender","Acender = pôr fogo, ligar. Ascender = subir."],
["O servidor conseguiu ___ ao cargo de supervisor.","ascender","acender","Ascender = subir, elevar-se."],
["A ___ do setor está no verso do mapa.","descrição","discrição","Descrição = ato de descrever. Discrição = reserva, sigilo."],
["O recenseador deve agir com ___ ao lidar com os dados.","discrição","descrição","Discrição = reserva, qualidade de discreto."],
["A chuva era ___; o céu escureceu de repente.","iminente","eminente","Iminente = prestes a acontecer. Eminente = ilustre, elevado."],
["O ___ professor foi homenageado pela universidade.","eminente","iminente","Eminente = ilustre, notável."],
["O ___ de veículos na rodovia aumentou na colheita.","tráfego","tráfico","Tráfego = trânsito. Tráfico = comércio ilegal."],
["O supervisor pediu para ___ o dado errado.","retificar","ratificar","Retificar = corrigir. Ratificar = confirmar."],
["O produtor quis ___ o que já havia dito.","ratificar","retificar","Ratificar = confirmar."],
["Ele não fez nada de ___ à comunidade.","mal","mau","Mal opõe-se a bem (fazer o bem × fazer o mal). Mau opõe-se a bom."],
["Era um ___ caminho para chegar ao setor.","mau","mal","Mau é adjetivo (oposto de bom): bom caminho × mau caminho."],
["O ___ do vereador termina em dezembro.","mandato","mandado","Mandato = período de exercício de cargo. Mandado = ordem judicial."],
["O oficial cumpriu o ___ de busca.","mandado","mandato","Mandado = ordem escrita de autoridade."],
["Ela vai ___ a roupa rasgada.","coser","cozer","Coser = costurar. Cozer = cozinhar."],
["É preciso ___ a mandioca antes de comer.","cozer","coser","Cozer = cozinhar."],
["O ___ bancário mostrou os gastos do mês.","extrato","estrato","Extrato = resumo, produto extraído. Estrato = camada."],
["O ___ social mais pobre foi o mais afetado.","estrato","extrato","Estrato = camada, nível."],
["O produtor tirou um cochilo, a famosa ___, depois do almoço.","sesta","sexta","Sesta = descanso após o almoço. Sexta = dia/numeral. Cesta = recipiente."],
["Ele colocou as frutas na ___.","cesta","sesta","Cesta = recipiente de vime, palha etc."],
["Reservou um ___ na primeira fila.","assento","acento","Assento = lugar de sentar. Acento = sinal gráfico ou tônica."],
["A palavra 'árvore' leva ___ agudo.","acento","assento","Acento = sinal gráfico."],
["O juiz decidiu ___ o pedido do produtor.","deferir","diferir","Deferir = atender, conceder. Diferir = adiar ou ser diferente."],
["O motorista vai ___ a lei se avançar o sinal.","infringir","infligir","Infringir = desrespeitar. Infligir = aplicar (pena, castigo)."],
["O tribunal resolveu ___ uma multa ao infrator.","infligir","infringir","Infligir = aplicar pena."],
["O submarino começou a ___ do fundo do lago.","emergir","imergir","Emergir = vir à tona. Imergir = afundar."],
["A cidade teve o alvará ___ pela prefeitura.","cassado","caçado","Cassado = anulado. Caçado = perseguido (caça)."],
["O preso ficou na ___ por três dias.","cela","sela","Cela = pequeno quarto. Sela = arreio de montaria."],
["Colocou a ___ no cavalo antes de sair.","sela","cela","Sela = assento de montaria."],
["Pagou a conta com um ___.","cheque","xeque","Cheque = ordem de pagamento. Xeque = lance do xadrez ou chefe árabe."],
["A crise pôs em ___ o plano de safra.","xeque","cheque","Pôr em xeque = ameaçar, pôr em dúvida."],
["Era um negócio ainda ___, em fase inicial.","incipiente","insipiente","Incipiente = que está começando. Insipiente = ignorante."]
];
/* ortografia: [correta, [erradas]] */
const POR_ORT=[
["exceção",["excessão","exeção"]],["paralisar",["paralizar"]],["analisar",["analizar"]],["pesquisar",["pesquizar"]],["privilégio",["previlégio","privilêgio"]],
["beneficente",["beneficiente"]],["mexer",["mecher"]],["enxergar",["enchergar"]],["cabeleireiro",["cabelereiro"]],["pretensão",["pretenção"]],
["ascensão",["ascenção","acensão"]],["obsessão",["obseção","obcessão"]],["admissão",["admição"]],["consciência",["conciência","consiência"]],["ansioso",["ancioso"]],
["extensão",["extenção"]],["impressão",["impreção"]],["exceto",["esceto"]],["necessário",["nescessário","necesário"]],["discussão",["discução"]],
["empecilho",["impecilho"]],["mendigo",["mendingo"]],["prazeroso",["prazeiroso"]],["próprio",["própio"]],["reivindicar",["reinvindicar"]],
["frustrar",["frustar"]],["companhia",["compania"]],["asterisco",["asterístico"]],["bandeja",["bandeija"]],["caderneta",["cardeneta"]],
["xícara",["chícara"]],["enchente",["inchente"]],["lagartixa",["lagarticha"]],["vizinho",["visinho"]],["atrás",["atraz"]],
["através",["atravéz"]],["catequese",["catequeze"]],["deslizar",["deslisar"]],["hesitar",["exitar"]],["umedecer",["humedecer"]],
["paralisação",["paralização"]],["previsão",["previzão"]],["usufruto",["uzufruto"]],["obsoleto",["obisoleto"]],
];
/* acentuação: [palavra correta, regra, forma sem/com acento errada] */
const POR_ACE=[
["lâmpada","proparoxítona","lampada"],["árvore","proparoxítona","arvore"],["público","proparoxítona","publico"],["estatística","proparoxítona","estatistica"],["agrícola","proparoxítona","agricola"],
["caráter","paroxítona terminada em r","carater"],["fácil","paroxítona terminada em l","facil"],["tórax","paroxítona terminada em x","torax"],["bíceps","paroxítona terminada em ps","biceps"],["órfã","paroxítona terminada em ã","orfã"],
["órgão","paroxítona terminada em ão","orgão"],["júri","paroxítona terminada em i","juri"],["vírus","paroxítona terminada em us","virus"],["álbum","paroxítona terminada em um","album"],["história","paroxítona terminada em ditongo","historia"],
["café","oxítona terminada em e","cafe"],["você","oxítona terminada em e","voce"],["avô","oxítona terminada em o","avo"],["também","oxítona terminada em em","tambem"],["alguém","oxítona terminada em em","alguem"],
["saúde","hiato com u tônico","saude"],["país","hiato com i tônico","pais"],["baú","hiato com u tônico","bau"],["juíza","hiato com i tônico","juiza"],["Piauí","hiato com i tônico","Piaui"],
["ideia","ditongo aberto ei em paroxítona (sem acento)","idéia"],["heroico","ditongo aberto oi em paroxítona (sem acento)","heróico"],["assembleia","ditongo aberto ei em paroxítona (sem acento)","assembléia"],["voo","hiato oo (sem acento)","vôo"],["enjoo","hiato oo (sem acento)","enjôo"],
["leem","verbo terminado em eem (sem acento)","lêem"],["creem","verbo terminado em eem (sem acento)","crêem"],["herói","oxítona com ditongo aberto ói","heroi"],["papéis","oxítona com ditongo aberto éis","papeis"],["chapéu","oxítona com ditongo aberto éu","chapeu"]
];
/* pontuação: [frase correta, frase com erro, explicação] */
const POR_PON=[
["O recenseador visitou todos os estabelecimentos do setor.","O recenseador, visitou todos os estabelecimentos do setor.","Não se separa o sujeito do verbo por vírgula."],
["O produtor informou ao recenseador a área da propriedade.","O produtor informou, ao recenseador a área da propriedade.","Não se separa o verbo de seus complementos por vírgula."],
["Senhor Mário, o recenseador chegou.","Senhor Mário o recenseador chegou.","O vocativo deve ser isolado por vírgula."],
["Juazeiro, cidade do Cariri, recebeu o treinamento.","Juazeiro cidade do Cariri, recebeu o treinamento.","O aposto explicativo vem entre vírgulas."],
["Choveu muito, mas a coleta continuou.","Choveu muito mas, a coleta continuou.","A vírgula vem antes da conjunção adversativa 'mas', não depois."],
["Na manhã de segunda-feira, a equipe saiu para o campo.","Na manhã, de segunda-feira a equipe saiu para o campo.","O adjunto adverbial deslocado é isolado por inteiro."],
["Foram registrados milho, feijão, arroz e soja.","Foram registrados, milho, feijão, arroz e soja.","Não há vírgula entre o verbo e seu sujeito/complemento; a vírgula separa os itens da enumeração."],
["O DMC, que é um tablet, armazena os dados.","O DMC que, é um tablet armazena os dados.","A oração adjetiva explicativa vem entre vírgulas, com a vírgula antes do 'que'."],
["A estrada estava ruim; por isso, a equipe atrasou.","A estrada estava ruim por isso a equipe, atrasou.","Conectivo deslocado ('por isso') pode vir isolado; nunca se separa o sujeito do verbo."],
["Os herdeiros, porém, não chegaram a um acordo.","Os herdeiros porém, não chegaram a um acordo.","Conjunção intercalada ('porém') fica entre vírgulas."],
["O ACS orienta os recenseadores; o ACR, os supervisores.","O ACS orienta os recenseadores o ACR os supervisores.","A vírgula marca a omissão do verbo (zeugma): 'o ACR, [orienta] os supervisores'."],
["Quando o sol nasceu, o recenseador já estava na estrada.","Quando o sol nasceu o recenseador, já estava na estrada.","Oração adverbial anteposta é separada por vírgula; não se separa sujeito e verbo."]
];
/* classes de palavras: [frase com *palavra*, classe correta] */
const POR_CLA=[
["O recenseador chegou *cedo* ao posto.","advérbio"],["A coleta foi *rápida*.","adjetivo"],["O *censo* é realizado pelo IBGE.","substantivo"],["*Ele* explicou o objetivo da visita.","pronome"],
["O mapa estava *sobre* a mesa.","preposição"],["Choveu, *mas* a equipe saiu.","conjunção"],["Ela andou *bastante* naquele dia.","advérbio"],["Havia *bastantes* motivos para atrasar.","adjetivo"],
["O *jantar* foi servido na fazenda.","substantivo"],["Precisamos *registrar* os dados.","verbo"],["*Nossa* equipe é pequena.","pronome"],["Visitou *três* estabelecimentos.","numeral"],
["O produtor respondeu *calmamente*.","advérbio"],["O *belo* da paisagem impressionou a todos.","substantivo"],["*Ai*, que susto!","interjeição"],["Saímos *porque* chovia pouco.","conjunção"],
["*Este* questionário está completo.","pronome"],["O produtor *rural* recebeu a equipe.","adjetivo"],["A estrada *de* terra estava alagada.","preposição"],["O agente *vendeu* a ideia do censo.","verbo"],
["Ela chegou *meio* cansada.","advérbio"],["Comeu *meio* quilo de feijão.","numeral"],["*Todos* os setores foram cobertos.","pronome"],["A *primeira* visita foi na segunda.","numeral"],
["O recenseador *que* veio ontem voltou.","pronome"],["Disse *que* voltaria amanhã.","conjunção"],["*Não* altere o perímetro do setor.","advérbio"],["O *sim* do produtor permitiu a entrevista.","substantivo"]
];
/* concordância: [frase correta, frase errada, explicação] */
const POR_CON=[
["Havia muitos estabelecimentos no setor.","Haviam muitos estabelecimentos no setor.","Haver no sentido de existir é impessoal: fica no singular."],
["Faz dez anos que o censo passou por aqui.","Fazem dez anos que o censo passou por aqui.","Fazer indicando tempo decorrido é impessoal: singular."],
["Vendem-se mudas de café.","Vende-se mudas de café.","Voz passiva sintética: o verbo concorda com o sujeito (mudas)."],
["Precisa-se de recenseadores.","Precisam-se de recenseadores.","Com verbo que exige preposição, o SE é índice de indeterminação: verbo no singular."],
["É proibido entrada.","É proibida entrada.","Sem artigo, a expressão fica invariável: 'é proibido entrada'. Com artigo: 'é proibida a entrada'."],
["É proibida a entrada de estranhos.","É proibido a entrada de estranhos.","Com artigo, o adjetivo concorda: 'proibida a entrada'."],
["Ela ficou meio preocupada com a chuva.","Ela ficou meia preocupada com a chuva.","'Meio' com valor de 'um pouco' é advérbio: invariável."],
["Seguem anexas as fotos do estabelecimento.","Seguem anexo as fotos do estabelecimento.","'Anexo' é adjetivo e concorda: anexas as fotos."],
["Muito obrigada, disse a produtora.","Muito obrigado, disse a produtora.","'Obrigado' concorda com quem fala: mulher diz 'obrigada'."],
["Havia menos chuvas neste ano.","Havia menas chuvas neste ano.","'Menos' é invariável; 'menas' não existe."],
["Os recenseadores mesmos fizeram a correção.","Os recenseadores mesmo fizeram a correção.","'Mesmo' com sentido de 'próprio' concorda: eles mesmos."],
["Fui eu que registrei o endereço.","Fui eu que registrou o endereço.","Com 'que', o verbo concorda com o antecedente: eu registrei."],
["Mais de um produtor reclamou da estrada.","Mais de um produtor reclamaram da estrada.","'Mais de um' leva o verbo ao singular (salvo reciprocidade)."],
["Deve haver muitos endereços novos.","Devem haver muitos endereços novos.","Haver impessoal transmite a impessoalidade ao auxiliar: 'deve haver'."],
["As informações foram registradas no DMC.","As informações foi registrada no DMC.","Verbo e particípio concordam com o sujeito plural."],
["Bastantes produtores participaram.","Bastante produtores participaram.","'Bastante' antes de substantivo é adjetivo (= muitos): varia."],
["Os produtores estavam bastante satisfeitos.","Os produtores estavam bastantes satisfeitos.","'Bastante' antes de adjetivo é advérbio (= muito): invariável."],
["Faltam dois setores para concluir a coleta.","Falta dois setores para concluir a coleta.","O sujeito 'dois setores' está posposto: verbo no plural."]
];
/* regência e crase: [frase correta, frase errada, explicação] */
const POR_REG=[
["O produtor assistiu ao jogo na vila.","O produtor assistiu o jogo na vila.","Assistir (ver) é transitivo indireto: assistir a."],
["O treinamento visa à qualidade dos dados.","O treinamento visa a qualidade dos dados.","Visar (objetivar) exige 'a': visa à qualidade (com crase)."],
["Todos devem obedecer às normas do IBGE.","Todos devem obedecer as normas do IBGE.","Obedecer exige 'a': obedecer às normas."],
["Prefiro trabalhar no campo a ficar no escritório.","Prefiro trabalhar no campo do que ficar no escritório.","Preferir algo A outra coisa; não se usa 'do que' nem 'mais'."],
["Fomos à fazenda logo cedo.","Fomos na fazenda logo cedo.","Ir pede a preposição 'a': ir à fazenda."],
["Chegamos ao posto às 7h.","Chegamos no posto às 7h.","Chegar pede 'a' na norma-padrão: chegar ao posto."],
["A seca implicou perdas na lavoura.","A seca implicou em perdas na lavoura.","Implicar (acarretar) é transitivo direto: implicou perdas."],
["Ele aspira ao cargo de supervisor.","Ele aspira o cargo de supervisor.","Aspirar (desejar) pede 'a': aspira ao cargo."],
["Lembrei-me do compromisso.","Lembrei-me o compromisso.","Lembrar-se (pronominal) pede 'de'."],
["Esqueci o mapa no posto.","Esqueci do mapa no posto.","Esquecer sem pronome é transitivo direto: esqueci o mapa."],
["Ela namora um agricultor da região.","Ela namora com um agricultor da região.","Namorar é transitivo direto na norma-padrão."],
["A reunião será à noite.","A reunião será a noite.","Locução adverbial feminina de tempo leva crase: à noite."],
["O posto abre às 8h.","O posto abre as 8h.","Indicação de hora determinada leva crase: às 8h."],
["Vou a Fortaleza amanhã.","Vou à Fortaleza amanhã.","'Vou a Fortaleza, volto de Fortaleza': sem artigo, sem crase. (Volto DA Bahia → vou À Bahia.)"],
["Vou à Bahia no feriado.","Vou a Bahia no feriado.","'Volto da Bahia' → há artigo → 'vou à Bahia'."],
["O recenseador foi a pé até a porteira.","O recenseador foi à pé até a porteira.","Não há crase antes de palavra masculina."],
["Começou a chover no meio da coleta.","Começou à chover no meio da coleta.","Não há crase antes de verbo."],
["Entreguei o questionário a ela.","Entreguei o questionário à ela.","Não há crase antes de pronome pessoal."],
["A partir de amanhã, a rota muda.","À partir de amanhã, a rota muda.","Não há crase antes de verbo ('partir')."],
["Comprou o trator a prazo.","Comprou o trator à prazo.","Não há crase antes de palavra masculina."],
["Fez o almoço à moda caipira.","Fez o almoço a moda caipira.","Expressão 'à moda (de)' leva crase."],
["O acesso à comunidade é feito por barco.","O acesso a comunidade é feito por barco.","Acesso A + A comunidade = à comunidade."],
["Ele é apto ao trabalho de campo.","Ele é apto com o trabalho de campo.","Regência nominal: apto a (ou para)."]
];
/* verbos: [frase com ___, correta, [erradas], explicação] */
const POR_VER=[
["Se eu ___ o produtor amanhã, aviso o supervisor. (ver)","vir",["ver","vier"],"Futuro do subjuntivo de VER: se eu vir."],
["Quando você ___ ao posto, traga o mapa. (vir)","vier",["vir","vim"],"Futuro do subjuntivo de VIR: quando você vier."],
["Se ele ___ o DMC na mesa, não vai esquecê-lo. (pôr)","puser",["pôr","por"],"Futuro do subjuntivo de PÔR: se ele puser."],
["O supervisor ___ na discussão ontem. (intervir)","interveio",["interviu","intervio"],"Intervir conjuga-se como VIR: ele veio → interveio."],
["Se o produtor ___ a calma, a entrevista será rápida. (manter)","mantiver",["manter","mantesse"],"Manter conjuga-se como TER: se ele tiver → mantiver."],
["A polícia ___ o suspeito na estrada. (deter)","deteve",["deteu","deteviu"],"Deter conjuga-se como TER: ele teve → deteve."],
["Não ___ todos os equipamentos no carro. (caber, pretérito)","couberam",["caberam","cabiam-se"],"CABER no pretérito perfeito: coube, couberam."],
["O recenseador ___ o mapa do posto. (trazer, pretérito)","trouxe",["trazeu","truxe"],"TRAZER no pretérito perfeito: trouxe."],
["Eu ___ uma nova via do documento. (requerer, presente)","requeiro",["requero","requisito"],"REQUERER no presente: eu requeiro (não segue 'querer')."],
["Se nós ___ tempo, visitaremos o setor vizinho. (ter)","tivermos",["termos","tiver"],"Futuro do subjuntivo de TER: se nós tivermos."],
["Espero que ele ___ o problema. (resolver)","resolva",["resolve","resolverá"],"Após 'espero que', usa-se o presente do subjuntivo."],
["Se o informante ___ mais cedo, a coleta terminaria antes. (vir)","viesse",["vinha","visse"],"Imperfeito do subjuntivo de VIR: se ele viesse."],
["Ontem eu ___ ao posto às 7h. (ir)","fui",["ia","vou"],"Pretérito perfeito de IR: eu fui."],
["Ele ___ o prejuízo da seca no ano passado. (prever)","previu",["preveu","previ"],"PREVER conjuga-se como VER: ele viu → previu."],
["O produtor ___ a terra que havia perdido. (reaver)","reouve",["reaveu","reaviu"],"REAVER segue HAVER nas formas com V: houve → reouve."],
["Se você ___ a lista, encontrará o endereço. (rever)","revir",["rever","revier"],"REVER conjuga-se como VER: se você vir → revir."],
["Nós ___ o questionário ontem. (refazer)","refizemos",["refazemos","refazimos"],"REFAZER como FAZER: nós fizemos → refizemos."],
["Ele ___ sobre o assunto antes da reunião. (dizer, pretérito)","disse",["dizeu","dice"],"DIZER no pretérito perfeito: disse."],
["Que eles ___ atenção às instruções. (dar)","deem",["dêem","dão"],"Presente do subjuntivo de DAR: que eles deem (sem acento, Acordo)."],
["Eles ___ o manual com atenção. (ler, presente)","leem",["lêem","lêm"],"Presente de LER: eles leem (sem acento após o Acordo)."]
];
/* vozes: [ativa, passiva analítica correta, [erradas]] */
const POR_VOZ=[
["O recenseador registrou os dados.","Os dados foram registrados pelo recenseador.",["Os dados são registrados pelo recenseador.","Os dados foram registrando pelo recenseador.","Os dados tinham sido registrado pelo recenseador."]],
["O ACS treinará os recenseadores.","Os recenseadores serão treinados pelo ACS.",["Os recenseadores foram treinados pelo ACS.","Os recenseadores são treinados pelo ACS.","Os recenseadores seriam treinado pelo ACS."]],
["O produtor vende a farinha na feira.","A farinha é vendida pelo produtor na feira.",["A farinha foi vendida pelo produtor na feira.","A farinha será vendida pelo produtor na feira.","A farinha é vendido pelo produtor na feira."]],
["A chuva destruiu a ponte.","A ponte foi destruída pela chuva.",["A ponte era destruída pela chuva.","A ponte será destruída pela chuva.","A ponte foi destruído pela chuva."]],
["O IBGE divulgou os resultados.","Os resultados foram divulgados pelo IBGE.",["Os resultados são divulgados pelo IBGE.","Os resultados serão divulgados pelo IBGE.","Os resultados foi divulgado pelo IBGE."]],
["O supervisor corrigia os questionários.","Os questionários eram corrigidos pelo supervisor.",["Os questionários foram corrigidos pelo supervisor.","Os questionários são corrigidos pelo supervisor.","Os questionários eram corrigido pelo supervisor."]],
["Os agentes percorrerão o setor.","O setor será percorrido pelos agentes.",["O setor foi percorrido pelos agentes.","O setor é percorrido pelos agentes.","O setor serão percorridos pelos agentes."]],
["A equipe tinha concluído a coleta.","A coleta tinha sido concluída pela equipe.",["A coleta foi concluída pela equipe.","A coleta tinha concluída pela equipe.","A coleta será concluída pela equipe."]],
["O tablet armazena as informações.","As informações são armazenadas pelo tablet.",["As informações foram armazenadas pelo tablet.","As informações serão armazenadas pelo tablet.","As informações é armazenada pelo tablet."]],
["Os herdeiros dividiram a terra.","A terra foi dividida pelos herdeiros.",["A terra era dividida pelos herdeiros.","A terra é dividida pelos herdeiros.","A terra foram divididas pelos herdeiros."]]
];
/* pronomes: [frase correta, frase errada, explicação] */
const POR_PRO=[
["O supervisor trouxe o mapa para eu analisar.","O supervisor trouxe o mapa para mim analisar.","Antes de verbo no infinitivo, 'eu' é sujeito: para eu analisar."],
["Não há segredo entre mim e você.","Não há segredo entre eu e você.","Após preposição, usa-se pronome oblíquo tônico: entre mim e você."],
["Não o vi no posto hoje.","Não vi-o no posto hoje.","A palavra negativa 'não' atrai o pronome: próclise."],
["Vi-o na estrada pela manhã.","O vi na estrada pela manhã.","Não se inicia frase com pronome oblíquo átono na norma-padrão: ênclise."],
["Encontrá-lo-ei amanhã no posto.","Encontrarei-o amanhã no posto.","Com futuro do presente, sem atrativo, usa-se a mesóclise: encontrá-lo-ei."],
["Ninguém me avisou da mudança.","Ninguém avisou-me da mudança.","Pronome indefinido 'ninguém' atrai o oblíquo: próclise."],
["Eu o encontrei ontem.","Eu lhe encontrei ontem.","Encontrar é transitivo direto: usa-se 'o', não 'lhe'."],
["Entreguei-lhe o questionário.","Entreguei-o o questionário.","Entregar algo A alguém: o objeto indireto é 'lhe'."],
["Que Deus o abençoe.","Que Deus abençoe-o.","Frases optativas (desejo) pedem próclise."],
["Quando me chamaram, já estava no carro.","Quando chamaram-me, já estava no carro.","Conjunção subordinativa ('quando') atrai o pronome."],
];
/* compreensão de texto: textos originais com perguntas [enunciado, [A..E], correta, comentário] */
const POR_TXT=[
{t:"A estrada de terra",x:"Na estrada de terra que leva à comunidade, o tempo parece andar devagar. O recenseador desce da moto, ajeita o colete e confere o mapa mais uma vez. Sabe que o GPS ajuda, mas aprendeu cedo que nenhum aparelho substitui uma boa conversa com quem mora ali. É na varanda, entre um café e outro, que surgem os nomes dos lugares que nenhum mapa registra: o Sítio da Pedra, a Baixa do Angico, a Ladeira do Caboclo. Cada nome é uma pista; cada pista, um estabelecimento que não pode ficar de fora.",q:[
["De acordo com o texto, o recenseador:",["dispensa o mapa quando tem GPS","valoriza a conversa com os moradores como fonte de informação","considera os nomes populares inúteis para o censo","prefere trabalhar sem contato com a comunidade","usa apenas o GPS para se orientar"],1,"O texto diz que nenhum aparelho substitui uma boa conversa com quem mora ali."],
["No trecho 'Cada nome é uma pista; cada pista, um estabelecimento', a vírgula após 'pista' indica:",["a separação do sujeito e do verbo","a omissão do verbo 'é'","um vocativo","um aposto explicativo","uma enumeração de adjetivos"],1,"A vírgula marca a elipse (zeugma) do verbo 'é': cada pista [é] um estabelecimento."],
["A expressão 'o tempo parece andar devagar' é exemplo de:",["linguagem denotativa","linguagem figurada","erro de concordância","discurso direto","linguagem técnica"],1,"Sentido figurado: o tempo não anda; a expressão sugere calma e lentidão."],
["O objetivo principal do texto é:",["ensinar a usar o GPS","mostrar que o conhecimento local ajuda a não deixar estabelecimentos de fora","criticar a tecnologia","descrever a culinária da comunidade","explicar a escala do mapa"],1,"A conclusão do texto: cada pista é um estabelecimento que não pode ficar de fora."]]},
{t:"Dados que viram políticas",x:"Os números do Censo Agropecuário não ficam guardados numa gaveta. Eles orientam onde o crédito rural vai chegar, onde uma estrada precisa ser asfaltada e onde a assistência técnica é mais urgente. Quando um produtor deixa de ser contado, não é só uma linha que some da tabela: é uma família que pode ficar invisível para o poder público. Por isso, a qualidade da coleta não é um detalhe burocrático, mas uma questão de justiça.",q:[
["Segundo o texto, a qualidade da coleta é:",["um detalhe burocrático","uma questão de justiça","responsabilidade exclusiva do governo","importante apenas para as tabelas","irrelevante para o crédito rural"],1,"Última frase do texto."],
["A conjunção 'mas', em 'não é um detalhe burocrático, mas uma questão de justiça', expressa:",["adição","oposição/retificação","causa","conclusão","tempo"],1,"'Não... mas' contrapõe e corrige a ideia anterior."],
["A expressão 'ficar invisível para o poder público' significa:",["ficar sem documentos","não ser considerado nas decisões e políticas","mudar de endereço","ser fiscalizado","perder a terra"],1,"Sentido figurado: não aparecer nos dados que orientam as políticas."],
["Infere-se do texto que:",["os dados do censo não têm uso prático","deixar de contar um produtor pode prejudicá-lo","o crédito rural independe de dados","a assistência técnica chega a todos igualmente","a tabela é mais importante que a família"],1,"O texto relaciona a ausência do produtor nos dados à invisibilidade para o poder público."]]},
{t:"O mapa e o caminho",x:"Um mapa é sempre uma simplificação. Ele escolhe o que mostrar e o que esconder: destaca a estrada, mas não conta que ela vira lama depois da chuva; mostra o rio, mas não diz que a ponte caiu no inverno. Quem trabalha em campo aprende a ler o mapa como quem lê um bilhete antigo: com respeito, mas desconfiando das novidades que ele não traz.",q:[
["Para o autor, o mapa:",["representa a realidade de forma completa","é uma simplificação que pode não mostrar mudanças recentes","deve ser descartado em campo","é mais confiável que a observação","mostra a situação das pontes"],1,"Primeira frase e exemplos do texto."],
["A comparação 'como quem lê um bilhete antigo' sugere uma leitura:",["descuidada","respeitosa, mas atenta às mudanças","apressada","literal e sem crítica","desnecessária"],1,"'Com respeito, mas desconfiando das novidades que ele não traz.'"],
["Os dois-pontos após 'o que esconder' introduzem:",["uma citação","exemplos que explicam a ideia anterior","um vocativo","uma conclusão oposta","uma pergunta"],1,"Os exemplos (estrada que vira lama, ponte que caiu) explicam a afirmação."],
["A palavra 'simplificação' é formada por:",["composição","derivação sufixal","derivação prefixal","hibridismo","onomatopeia"],1,"simplific(ar) + -ação: derivação sufixal."]]},
{t:"Autodeclaração",x:"Em comunidades tradicionais, a identidade não se confere na aparência nem no documento. Ela se afirma na palavra de quem fala. Por isso, o entrevistador não corrige, não duvida e não sugere: registra. Respeitar a autodeclaração é reconhecer que cada pessoa é a principal autoridade sobre a própria história.",q:[
["De acordo com o texto, o entrevistador deve:",["corrigir a identidade declarada quando discordar","registrar o que a pessoa declara, sem duvidar","pedir documento comprobatório","sugerir a identidade mais adequada","avaliar a aparência do informante"],1,"'Não corrige, não duvida e não sugere: registra.'"],
["Em 'Ela se afirma na palavra de quem fala', o pronome 'Ela' retoma:",["a comunidade","a identidade","a aparência","a palavra","a história"],1,"Retoma 'a identidade' da frase anterior (coesão referencial)."],
["A sequência 'não corrige, não duvida e não sugere' constitui:",["uma gradação de ações proibidas ao entrevistador","uma explicação técnica","um vocativo","uma comparação","uma conclusão contrária"],0,"Enumeração de ações que o entrevistador não deve fazer."],
["A ideia central do texto é:",["a importância dos documentos","o respeito à autodeclaração","a dificuldade de acesso às comunidades","o uso do DMC","a história das comunidades"],1,"Tese do texto."]]},
{t:"Chuva no setor",x:"A previsão dizia que a chuva só viria à tarde, mas às dez da manhã o céu já estava fechado. O recenseador guardou o tablet na capa, anotou o ponto onde parou e voltou ao povoado antes que o riacho subisse. No dia seguinte, retomou o trabalho exatamente dali. Não perdeu nenhum endereço: perdeu apenas algumas horas.",q:[
["A atitude do recenseador revela:",["imprudência","planejamento e cuidado com a cobertura do setor","desinteresse pelo trabalho","descumprimento das regras","pressa em terminar"],1,"Anotou onde parou e retomou dali, sem perder endereços."],
["A conjunção 'mas', no primeiro período, introduz uma ideia de:",["conclusão","contraste com a previsão","explicação","finalidade","condição"],1,"A realidade contrariou a previsão."],
["Na frase 'antes que o riacho subisse', a oração expressa:",["causa","tempo","consequência","concessão","comparação"],1,"Oração adverbial temporal."],
["Os dois-pontos em 'Não perdeu nenhum endereço: perdeu apenas algumas horas' introduzem:",["uma enumeração","um esclarecimento/oposição ao que foi dito","um vocativo","uma citação","uma pergunta"],1,"Esclarecem o que de fato foi perdido."]]}
];
/* sequência lógica: [frases embaralhadas em ordem correta] */
const POR_SEQ=[
["O recenseador chegou ao posto às sete horas.","Em seguida, conferiu o mapa do setor e o descritivo.","Depois, partiu para a primeira rota do dia.","Ao final da tarde, transmitiu os dados coletados."],
["O Censo Agro investiga os estabelecimentos agropecuários.","Para isso, os recenseadores visitam cada setor censitário.","Nessas visitas, aplicam o questionário aos produtores.","Assim, o país conhece melhor sua produção no campo."],
["Choveu forte durante toda a madrugada.","Por isso, a estrada de terra amanheceu alagada.","A equipe, então, decidiu chegar ao setor pelo rio.","Apesar do atraso, todos os endereços foram visitados."],
["A lista prévia traz endereços de pesquisas anteriores.","No entanto, ela pode estar desatualizada.","Por esse motivo, o recenseador deve confirmar, incluir e excluir endereços.","Desse modo, a lista final reflete a realidade do setor."],
["O produtor recebeu o recenseador na varanda.","Primeiro, ouviu a explicação sobre o censo.","Depois, respondeu às perguntas sobre a produção.","Por fim, indicou o caminho para a casa do vizinho."]
];
const IBGE_CARDS_POR=[
["P01","Como ler a questão de texto","1) Leia o enunciado antes do texto. 2) Volte ao trecho citado. 3) Marque o que o texto DIZ, não o que você pensa. 4) Elimine alternativas que generalizam (sempre, nunca, todos) ou que trazem informação de fora."],
["P02","Homônimos que caem","censo (contagem) × senso (juízo) · sessão (reunião) × seção (divisão) × cessão (ceder) · conserto (reparo) × concerto (música) · comprimento (medida) × cumprimento (saudação/execução) · acender (fogo) × ascender (subir) · descrição × discrição · iminente (prestes) × eminente (ilustre) · tráfego (trânsito) × tráfico · retificar (corrigir) × ratificar (confirmar) · mal (× bem) × mau (× bom) · mandato (cargo) × mandado (ordem)."],
["P03","Vírgula: 3 proibições e 5 usos","PROIBIDO: entre sujeito e verbo; entre verbo e complemento; entre nome e seu complemento.\nOBRIGATÓRIO/USUAL: vocativo; aposto explicativo; adjunto adverbial deslocado; orações adjetivas explicativas; conjunções intercaladas (porém, contudo) e antes de 'mas'. Também marca omissão de verbo (Eu fui à feira; ela, ao mercado)."],
["P04","Conectivos e o que eles fazem","Adição: e, além disso. Oposição: mas, porém, no entanto, contudo. Conclusão: portanto, logo, assim. Causa: porque, já que, visto que. Explicação: pois (posposto), ou seja. Tempo: quando, enquanto, depois que. Condição: se, caso. Concessão: embora, ainda que (sempre com subjuntivo)."],
["P05","Ortografia que mais derruba","exceção · paralisar · analisar · pesquisar · privilégio · beneficente · mexer · enxergar · cabeleireiro · pretensão · ascensão · obsessão · admissão · consciência · ansioso · empecilho · reivindicar · frustrar · companhia · hesitar · através · atrás."],
["P06","Acentuação depois do Acordo","Perderam o acento: ideia, assembleia, heroico, jiboia (ditongos abertos ei/oi em paroxítonas) · voo, enjoo · leem, creem, deem, veem · para (verbo), pelo (verbo), pera (fruta).\nContinuam: herói, papéis, chapéu (oxítonas) · saúde, país (hiato i/u) · têm, vêm (plural de ter/vir) · pôr (verbo) · pôde (passado)."],
["P07","Mesma palavra, classe diferente","'Bastante': antes de substantivo varia (bastantes motivos, adjetivo); antes de adjetivo não varia (bastante cansados, advérbio).\n'Meio': meio quilo (numeral) × meio cansada (advérbio).\n'Que': o homem que veio (pronome relativo) × disse que vinha (conjunção).\n'O belo', 'o sim', 'o jantar': substantivados pelo artigo."],
["P08","Concordância: os clássicos","HAVER = existir → singular (havia muitos). FAZER tempo → singular (faz dez anos). Deve haver (auxiliar também fica no singular). Vendem-se casas (passiva) × Precisa-se de casas (indeterminado). É proibido entrada × É proibida a entrada. Meio (= um pouco) não varia. Anexo, obrigado, mesmo, quite: variam. Menos: nunca 'menas'."],
["P09","Crase sem decorar","Crase = preposição A + artigo A. Teste: troque por masculino. 'Vou à praça' → 'vou ao parque' (tem crase). 'Vou a Fortaleza' → 'volto de Fortaleza' (sem crase); 'vou à Bahia' → 'volto da Bahia' (com crase).\nNUNCA: antes de verbo, masculino, pronome pessoal, 'a prazo', 'a pé', 'a partir'. SEMPRE: horas (às 8h), à noite, à moda, à medida que."],
["P09","Regência verbal que cai","Assistir (ver) a · visar (objetivar) a · obedecer a · aspirar (desejar) a · preferir X a Y · ir/chegar a · implicar (acarretar) sem preposição · lembrar-se de × lembrar algo · esquecer-se de × esquecer algo · namorar alguém · informar algo a alguém."],
["P10","Verbos que derrubam","VER (se eu vir) × VIR (se eu vier). Derivados seguem o primitivo: prever, rever (como ver); intervir, convir (como vir: interveio); manter, deter, conter (como ter: mantiver, deteve); propor, compor (como pôr: puser). Caber: coube. Trazer: trouxe. Requerer: requeiro. Reaver: reouve. Leem, creem, deem, veem: sem acento."],
["P11","Vozes verbais","ATIVA: O recenseador registrou os dados. PASSIVA ANALÍTICA: Os dados foram registrados pelo recenseador (ser + particípio; o tempo de 'ser' copia o do verbo original: registrou → foram registrados). PASSIVA SINTÉTICA: Registraram-se os dados (verbo concorda com o sujeito). REFLEXIVA: O produtor se feriu."],
["P12","Pronomes sem susto","Para EU fazer (sujeito do infinitivo) × para MIM (sem verbo depois). Entre mim e você. Próclise com: não, nunca, ninguém, que, quando, advérbios. Ênclise no início da frase (Vi-o). Mesóclise no futuro sem atrativo (encontrá-lo-ei). 'O' = objeto direto; 'lhe' = objeto indireto. Este (perto de mim), esse (perto de você), aquele (longe dos dois)."]
];
