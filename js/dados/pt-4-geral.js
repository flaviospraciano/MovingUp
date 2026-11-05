"use strict";
/* Classes de palavras, acentuação, concordância, regência, colocação, pontuação e semântica.
   Formato: regra|índice da correta (0 a 3)|alternativa;alternativa;alternativa;alternativa|enunciado */
window.PT=window.PT||{};
PT.MC=`cl_subst|0|substantivo;verbo;adjetivo;advérbio|Em “O jantar estava ótimo”, a palavra “jantar” é:
cl_subst|0|substantivo;advérbio;conjunção;interjeição|Em “Ele respondeu com um não seco”, a palavra “não” é:
cl_subst|0|substantivo;verbo;adjetivo;pronome|Em “O falar alto incomoda”, a palavra “falar” é:
cl_adj|1|substantivo;adjetivo;advérbio;verbo|Em “Comprou um carro novo”, a palavra “novo” é:
cl_adj|1|advérbio;adjetivo;substantivo;numeral|Em “Os candidatos estavam confiantes”, “confiantes” é:
cl_adv|2|adjetivo;pronome;advérbio;numeral|Em “Ela estava meio cansada”, “meio” é:
cl_adv|2|numeral;adjetivo;advérbio;substantivo|Em “Ele fala muito bem”, a palavra “bem” é:
cl_adv|0|advérbio;adjetivo;pronome;preposição|Em “As candidatas estavam bastante nervosas”, “bastante” é:
cl_adj|1|advérbio;adjetivo;pronome;substantivo|Em “Havia bastantes provas para corrigir”, “bastantes” é:
cl_num|3|adjetivo;advérbio;substantivo;numeral|Em “Comeu o dobro da porção”, “dobro” é:
cl_num|1|adjetivo;numeral;advérbio;pronome|Em “Ficou em segundo lugar”, “segundo” é:
cl_prep|1|conjunção;preposição;advérbio;numeral|Em “Segundo o relatório, as metas foram cumpridas”, “segundo” é:
cl_conj|0|conjunção;preposição;advérbio;numeral|Em “Segundo disseram, a prova foi adiada”, “segundo” é:
cl_pron|2|artigo;preposição;pronome;conjunção|Em “Esta é a minha opinião”, “esta” é:
cl_pron|0|pronome;artigo;substantivo;advérbio|Em “Alguém deixou a porta aberta”, “alguém” é:
cl_verbo|3|substantivo;adjetivo;advérbio;verbo|Em “Ela estuda todas as noites”, “estuda” é:
cl_que|0|pronome relativo;conjunção integrante;advérbio de intensidade;preposição|Em “O livro que comprei é ótimo”, o “que” é:
cl_que|1|pronome relativo;conjunção integrante;advérbio de intensidade;substantivo|Em “Ele disse que viria”, o “que” é:
cl_que|2|pronome relativo;conjunção integrante;advérbio de intensidade;pronome indefinido|Em “Que bonita está a cidade!”, o “que” é:
cl_que|0|pronome relativo;conjunção integrante;preposição;conjunção causal|Em “A cidade em que nasci é pequena”, o “que” é:
cl_se|0|partícula apassivadora;índice de indeterminação do sujeito;pronome reflexivo;conjunção condicional|Em “Alugam-se salas comerciais”, o “se” é:
cl_se|1|partícula apassivadora;índice de indeterminação do sujeito;pronome reflexivo;conjunção integrante|Em “Precisa-se de técnicos”, o “se” é:
cl_se|2|partícula apassivadora;índice de indeterminação do sujeito;pronome reflexivo;conjunção condicional|Em “Ele se cortou com a faca”, o “se” é:
cl_se|3|partícula apassivadora;pronome reflexivo;índice de indeterminação do sujeito;conjunção condicional|Em “Se chover, a prova será adiada”, o “se” é:
cl_se|3|pronome reflexivo;partícula apassivadora;índice de indeterminação do sujeito;conjunção integrante|Em “Não sei se ela virá”, o “se” é:
ac_reg|1|herói, ideia, vôo;herói, ideia, voo;heroi, idéia, voo;herói, idéia, vôo|Assinale a grafia correta segundo o Novo Acordo:
ac_reg|0|fácil, hífen, caráter;facil, hifen, caráter;fácil, hífen, carater;facil, hífen, caráter|Assinale a série em que todas as palavras estão corretamente acentuadas:
ac_reg|2|item, itens, hífens;ítem, ítens, hífens;item, itens, hifens;ítem, itens, hífens|Assinale a série correta:
ac_novo|0|Eles têm razão e vêm amanhã.;Eles tem razão e vem amanhã.;Eles têm razão e veem amanhã.;Eles tem razão e vêm amanhã.|Assinale a frase correta:
ac_novo|1|Ontem ele não pode vir.;Ontem ele não pôde vir.;Ontem ele não pôdi vir.;Ontem ele não podia vim.|Assinale a frase correta no passado:
ac_novo|2|heróico, jibóia, assembléia;heroico, jiboia, assembléia;heroico, jiboia, assembleia;heróico, jiboia, assembleia|Assinale a série correta:
ac_reg|3|juíz, juízes, raiz;juíz, juizes, raíz;juiz, juizes, raiz;juiz, juízes, raízes|Assinale a série em que todas estão corretas:
co_verbal|1|Faltou três candidatos.;Faltaram três candidatos.;Faltou-se três candidatos.;Faltavam-se três candidatos.|Assinale a concordância correta:
co_verbal|0|Chegaram, ontem à noite, os documentos.;Chegou, ontem à noite, os documentos.;Chegou-se, ontem à noite, os documentos.;Chegaram-se, ontem à noite, os documentos.|Assinale a frase correta:
co_haver|0|Havia muitas pessoas na fila.;Haviam muitas pessoas na fila.;Houveram muitas pessoas na fila.;Hão muitas pessoas na fila.|Assinale a frase correta:
co_haver|2|Devem haver soluções.;Deviam haver soluções.;Deve haver soluções.;Podem haver soluções.|Assinale a frase correta:
co_haver|1|Fazem dez anos que me formei.;Faz dez anos que me formei.;Fizeram dez anos que me formei.;Façam dez anos que me formei.|Assinale a frase correta:
co_haver|3|Houveram falhas no sistema.;Haviam falhas no sistema.;Hão de haverem falhas.;Houve falhas no sistema.|Assinale a frase correta:
co_se|0|Vendem-se casas.;Vende-se casas.;Vendem-se de casas.;Vende-se casas novas e usadas.|Assinale a concordância correta:
co_se|1|Precisam-se de vendedores.;Precisa-se de vendedores.;Precisam-se vendedores.;Precisa-se vendedores.|Assinale a frase correta:
co_se|2|Consertam-se de sapatos.;Conserta-se sapatos.;Consertam-se sapatos.;Consertam-se-se sapatos.|Assinale a frase correta:
co_se|0|Trata-se de questões delicadas.;Tratam-se de questões delicadas.;Trata-se questões delicadas.;Tratam-se questões delicadas.|Assinale a frase correta:
co_nominal|0|Seguem anexas as certidões.;Segue anexo as certidões.;Seguem anexo as certidões.;Segue anexa as certidões.|Assinale a frase correta:
co_nominal|1|É proibida entrada de estranhos.;É proibido entrada de estranhos.;É proibida entradas de estranhos.;São proibido entrada de estranhos.|Assinale a frase correta:
co_nominal|2|Era meio-dia e meio.;Ela estava meia cansada.;Era meio-dia e meia.;Bebeu meio garrafa.|Assinale a frase correta:
co_nominal|3|Havia menas pessoas.;Os soldados estavam alertas.;Ela mesmo resolveu.;Elas mesmas resolveram.|Assinale a frase correta:
co_nominal|0|Muito obrigada, disse a candidata.;Muito obrigado, disse a candidata.;Muita obrigada, disse a candidata.;Muitas obrigado, disse a candidata.|Assinale a frase correta:
re_verbal|1|Assisti o filme ontem.;Assisti ao filme ontem.;Assisti no filme ontem.;Assisti do filme ontem.|No sentido de “ver”, assinale a correta:
re_verbal|2|Prefiro estudar do que sair.;Prefiro mais estudar a sair.;Prefiro estudar a sair.;Prefiro mais estudar do que sair.|Assinale a regência correta:
re_verbal|0|O candidato aspira ao cargo.;O candidato aspira o cargo.;O candidato aspira pelo cargo.;O candidato aspira no cargo.|No sentido de “desejar”, assinale a correta:
re_verbal|3|Cheguei no escritório cedo.;Cheguei em o escritório cedo.;Cheguei para o escritório cedo.;Cheguei ao escritório cedo.|Assinale a regência correta:
re_verbal|1|Obedeça os sinais de trânsito.;Obedeça aos sinais de trânsito.;Obedeça com os sinais de trânsito.;Obedeça pelos sinais de trânsito.|Assinale a correta:
re_verbal|2|A medida implica em mudanças.;A medida implica para mudanças.;A medida implica mudanças.;A medida implica com mudanças.|No sentido de “acarretar”, assinale a correta:
re_verbal|0|O projeto visa ao lucro.;O projeto visa o lucro em.;O projeto visa no lucro.;O projeto visa pelo lucro.|No sentido de “ter como objetivo”, a forma recomendada pela norma é:
re_verbal|1|Esqueci do nome dele.;Esqueci o nome dele.;Esqueci-me o nome dele.;Esqueci ao nome dele.|Assinale a correta:
re_nominal|0|Ele é residente em Juazeiro.;Ele é residente a Juazeiro.;Ele é residente para Juazeiro.;Ele é residente de Juazeiro em.|Assinale a correta:
re_nominal|2|Estou ansioso de o resultado.;Estou ansioso em o resultado.;Estou ansioso pelo resultado.;Estou ansioso ao resultado.|Assinale a correta:
cp_enc|1|Me disseram a verdade.;Disseram-me a verdade.;Disseram-me-a a verdade.;Me disseram-me a verdade.|Segundo a norma-padrão, assinale a correta:
cp_proc|0|Não me disseram nada.;Não disseram-me nada.;Não disseram nada-me.;Disseram-me não nada.|Assinale a colocação correta:
cp_proc|2|Quem contou-te isso?;Quem contou isso-te?;Quem te contou isso?;Te quem contou isso?|Assinale a colocação correta:
cp_proc|1|Embora esforce-se, não passou.;Embora se esforce, não passou.;Embora esforce, se não passou.;Se embora esforce, não passou.|Assinale a colocação correta:
cp_meso|3|Direi-te a verdade amanhã.;Te direi a verdade amanhã.;Direi a verdade te amanhã.;Dir-te-ei a verdade amanhã.|Sem palavra atrativa, assinale a colocação correta:
cp_meso|0|Não te direi nada.;Não dir-te-ei nada.;Não direi-te nada.;Dir-te-ei não nada.|Assinale a colocação correta:
cp_proc|1|Aqui trabalha-se muito.;Aqui se trabalha muito.;Se aqui trabalha muito.;Aqui trabalha muito se.|Assinale a colocação recomendada pela norma:
pt_virg|1|Os candidatos aprovados, devem comparecer amanhã.;Os candidatos aprovados devem comparecer amanhã.;Os candidatos, aprovados devem comparecer amanhã.;Os candidatos aprovados devem, comparecer amanhã.|Assinale a pontuação correta:
pt_virg|0|Ontem à noite, os resultados foram divulgados.;Ontem à noite os resultados, foram divulgados.;Ontem, à noite os resultados foram, divulgados.;Ontem à noite os resultados foram, divulgados.|Assinale a pontuação correta:
pt_virg|2|Pedro venha aqui.;Pedro venha, aqui.;Pedro, venha aqui.;Pedro venha aqui,.|Assinale a pontuação correta:
pt_virg|3|O servidor porém, não compareceu.;O servidor porém não, compareceu.;O, servidor porém não compareceu.;O servidor, porém, não compareceu.|Assinale a pontuação correta:
pt_virg|0|Ana, a diretora, aprovou o projeto.;Ana a diretora, aprovou o projeto.;Ana, a diretora aprovou, o projeto.;Ana a diretora aprovou, o projeto.|Assinale a pontuação correta:
pt_expl|1|Em “Os alunos que estudaram passaram”, todos os alunos estudaram.;Em “Os alunos, que estudaram, passaram”, todos os alunos estudaram.;As duas frases têm exatamente o mesmo sentido.;A vírgula nunca altera o sentido de uma frase.|Assinale a afirmação correta:
pt_expl|0|restringe o grupo;generaliza para todo o grupo;é sempre erro de pontuação;indica causa|Em “Os servidores que faltaram foram advertidos”, a oração sem vírgulas:
se_paron|0|iminente;eminente;emitente;imanente|“O perigo de desabamento é ___”, ou seja, está prestes a acontecer:
se_paron|1|eminente;iminente;imanente;emitente|“O ___ jurista proferiu a palestra”, ou seja, o jurista importante:
se_paron|2|retificou;ratificaram;ratificou;retificaram|“O conselho ___ a decisão”, ou seja, confirmou:
se_paron|3|ratificou;retificaram;ratificaram;retificou|“O órgão ___ o edital”, ou seja, corrigiu:
se_paron|0|infringiu;infligiu;infringiu-se;infligiu-se|“O motorista ___ a lei de trânsito”, ou seja, violou:
se_paron|1|tráfico;tráfego;tráfegos;tráficos|“O ___ de veículos está intenso”, ou seja, o trânsito:
se_paron|2|descrição;discreção;discrição;descrições|“Ela agiu com ___”, ou seja, de forma reservada:
se_paron|1|mandado;mandato;mandado de;mandatos de|“O ___ do vereador é de quatro anos”:
se_paron|0|deferiu;diferiu;difere;deferirá|“O juiz ___ o pedido”, ou seja, atendeu:
se_paron|3|seção;cessão;sessões;sessão|“A ___ da Câmara começa às 14h”, ou seja, a reunião:
se_conect|1|portanto;embora;logo;por isso|Mantém o sentido de “Apesar de cansado, terminou a prova”: “___ estivesse cansado, terminou a prova.”
se_conect|0|porém;embora;caso;porque|Substitui “mas” sem mudar o sentido em “Estudou muito, mas não passou”:
se_conect|2|entretanto;embora;portanto;ainda que|Indica conclusão: “Estudou com método; ___, passou.”
se_conect|3|portanto;contudo;logo;visto que|Indica causa: “Saiu cedo, ___ estava cansado.”
se_conect|1|desde que (tempo);desde que (condição);desde que (causa);desde que (finalidade)|Em “Pode sair, desde que termine a tarefa”, a relação é:
se_conect|0|concessão;adversidade;conclusão;causa|Em “Ainda que chova, o evento acontecerá”, a relação é de:`;
