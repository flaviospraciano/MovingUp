# Moving Up 2.0

## 1. Substituir no GitHub

1. No repositório, apague os arquivos antigos (principalmente o `index.html` antigo, de 2,2 MB).
2. Envie **todo o conteúdo** desta pasta, mantendo as subpastas `css`, `js`, `assets`, `automacao` e `.github`.
   A pasta `.github` começa com ponto e pode ficar oculta: no Mac, aperte Cmd+Shift+. na janela de arquivos; no Windows, ative *Itens ocultos* em *Exibir*.
   Se ela não subir, crie no GitHub: *Add file → Create new file*, nome `.github/workflows/avisos.yml`, e cole o conteúdo do arquivo deste pacote.
   Se o seu repositório antigo tinha uma pasta `functions`, `firebase.json` ou `.firebaserc`, pode apagar.
   No site do GitHub: *Add file → Upload files* e arraste as pastas inteiras.
3. Espere 1 a 2 minutos e abra o app. Na primeira abertura ele baixa a versão nova; a partir daí abre do cache.

Seus dados não mudam: eles ficam no Firebase, não nos arquivos.

## 2. Ligar os avisos com o app fechado (grátis, sem plano Blaze)

Quem envia os avisos é o próprio GitHub: uma tarefa agendada (GitHub Actions) roda a cada 5 minutos, confere a fila no Firebase e manda o que venceu. Seu Firebase continua no plano gratuito.

**Limitações:**
- O GitHub pode atrasar tarefas agendadas. Um lembrete das 9:00 pode chegar entre 9:05 e 9:20.
- O GitHub desliga tarefas agendadas depois de 60 dias sem nenhuma alteração no repositório. O próprio workflow evita isso: às segundas ele confere e, se o repositório estiver parado há 40 dias, faz um registro automático.
- O repositório precisa ser **público** para o GitHub Actions ser ilimitado. Se você usa o GitHub Pages grátis, ele já é. A chave secreta fica guardada nos Secrets, que não aparecem para ninguém.

### Passo A · Chave do Web Push (2 minutos)
1. Abra o [Firebase Console](https://console.firebase.google.com) → projeto **movingup-2d72f**.
2. Engrenagem → **Configurações do projeto** → aba **Cloud Messaging**.
3. Em **Configuração da Web → Certificados push da Web**, toque em **Gerar par de chaves**.
4. Copie a chave e cole no `config.js`, em `vapidKey: "COLE_AQUI"`. Envie o `config.js` para o GitHub.

### Passo B · Regras do banco (1 minuto)
1. No Firebase Console → **Firestore Database** → aba **Regras**.
2. Apague o que estiver lá, cole o conteúdo do arquivo `firestore.rules` deste pacote e toque em **Publicar**.

### Passo C · Chave de acesso para o GitHub (3 minutos)
1. No Firebase Console → engrenagem → **Configurações do projeto** → aba **Contas de serviço**.
2. Toque em **Gerar nova chave privada** e confirme. Um arquivo `.json` será baixado.
3. No GitHub, abra o repositório → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.
4. Nome: `FIREBASE_SERVICE_ACCOUNT`. Valor: abra o arquivo `.json` num editor de texto, copie **tudo** e cole. Salve.
5. Apague o arquivo `.json` do computador ou do celular. **Nunca** envie esse arquivo para o repositório: ele dá acesso total ao seu Firebase.

### Passo D · Ligar a tarefa
1. No GitHub, abra a aba **Actions** do repositório. Se aparecer um aviso, toque em **I understand my workflows, go ahead and enable them**.
2. Abra **Avisos do Moving Up** → **Run workflow** para rodar uma vez na hora. Ela deve terminar com um ✓ verde.

### Passo E · No celular
Abra o app → **Ajustes → Avisos no celular → Ativar neste aparelho** → **Enviar teste**. O aviso chega em até 15 minutos, mesmo com o app fechado.

- **Android:** funciona no Chrome. Melhor ainda com o app instalado (menu ⋮ → *Instalar app*).
- **iPhone:** precisa do iOS 16.4 ou mais novo **e** do app na Tela de Início (Safari → Compartilhar → *Adicionar à Tela de Início*). Ative os avisos abrindo o app por lá.

Repita o Passo E em cada aparelho.

### Se o teste não chegar
- No GitHub → **Actions** → **Avisos do Moving Up**, abra a última execução e leia a etapa **Enviar avisos vencidos**. Ela diz quantos avisos foram entregues.
- "O segredo ainda não foi configurado": refaça o Passo C (o nome precisa ser exatamente `FIREBASE_SERVICE_ACCOUNT`).
- Erro de permissão no Firebase: refaça o Passo B.
- Confira se a `vapidKey` está no `config.js` publicado.
- No celular, as notificações do navegador (ou do app instalado) precisam estar permitidas.

## 2b. Voz de IA do Jarvis (grátis)

O Jarvis fala com uma voz de IA do Google (Gemini TTS): grave, calma e elegante, no estilo de um mordomo britânico. Sem a chave, ele usa a voz instalada no aparelho.

1. Abra o [Google AI Studio](https://aistudio.google.com/apikey) com sua conta Google e toque em **Create API key** (Criar chave de API).
2. Copie a chave e cole no `config.js`, em `geminiKey: "COLE_AQUI"`. Envie o `config.js` para o GitHub.
3. No app: **Ajustes → Voz do Jarvis → Ouvir amostra**. Ali você também escolhe a voz (Grave, Suave, Firme ou Clara), quando usar a voz de IA e se ele chama você de senhor, senhora ou pelo nome.

**Importante:**
- **Não ative cobrança** nesse projeto do AI Studio. Assim a chave fica no plano gratuito e nunca gera custo.
- A chave fica visível no `config.js`, porque o app é público. No pior caso, alguém gasta a sua cota gratuita do dia. Para evitar, no [Google Cloud Console → Credenciais](https://console.cloud.google.com/apis/credentials), abra a chave e, em **Restrições do aplicativo**, escolha **Sites** e adicione `https://flaviospraciano.github.io/*`.
- A cota gratuita de voz é pequena (algo como 10 a 15 falas por dia, e o Google muda isso de tempos em tempos). Por isso o app guarda cada áudio no aparelho: ouvir de novo não gasta cota. O briefing é preparado assim que aparece no Início, para tocar sem espera. Quando a cota acaba, o app avisa e usa a voz do aparelho até ela voltar.
- Para melhorar a voz reserva no Android: **Configurações → Conversão de texto em voz → Mecanismo do Google → Instalar dados de voz → Português (Brasil)** e escolha uma voz masculina. No computador, o Edge tem as vozes mais naturais (Antonio e Francisca).

## 3. O que mudou

**Organização**
- O app foi dividido em um CSS e vários arquivos JS por assunto (`js/01-base.js` a `js/99-iniciar.js`), carregados nessa ordem.
- Os sons do violão saíram do código e viraram arquivos em `assets/violao/`. Eles só são baixados quando você abre o Violão.
- Saíram as funções repetidas e as versões antigas da tela Início que não eram mais usadas.
- O app abre do cache e se atualiza em segundo plano: o que você publicar aparece na abertura seguinte.

**Módulos novos**
- **12 semanas** (*12 Week Year*): até 3 metas por ciclo, táticas semanais, nota de execução semanal (meta: 85%) e revisão no fim. As metas do ano ficam dentro do módulo, como visão de longo prazo.
- **Contatos profissionais:** frequência para retomar, registro de cada conversa e atalhos para WhatsApp, e-mail e Instagram.
- **Método Feynman:** você explica o conceito, a IA avalia e faz 3 perguntas, e o conceito volta para revisão espaçada.
- **Contratos de compromisso:** meta, prova, prazo, consequência e testemunha.
- **Cartas para o futuro:** a carta fica selada até a data de entrega.
- **Avisos no Início:** o cartão só aparece quando algo pede ação, com no máximo 4 linhas.

**Jarvis**
- **Perguntas sobre os seus dados:** use a barra do Início. Ordens ("gastei 30 no Uber") continuam sendo executadas; perguntas ("quanto gastei com delivery desde agosto?", "quando falei com a Ana?") vão para o Jarvis, que consulta seus registros e responde por texto e voz. Para forçar o modo pergunta, comece com "Jarvis,". As somas e contagens são feitas pelo app, não pela IA.
- **Briefing falado:** de manhã e à noite aparece uma linha no Início. Toque no ▶ para ouvir. Dá para pedir também dizendo "briefing" na barra.
- **Alerta precoce:** o app vigia o ciclo, compromissos sem tática, treinos e hábitos parados, gastos subindo há 3 meses, gastos sem anotar e contas vencidas. Os sinais aparecem nos Avisos uma vez por semana, com a opção de pedir a análise do Jarvis.
- O Jarvis usa a IA do Firebase no plano gratuito, que tem limite diário de uso. Se ele parar de responder num dia de muito uso, volta no dia seguinte.


## 4. Novidades da versão 2.2

- **Contas a receber sem duplicatas:** os lançamentos feitos à mão que repetiam o dinheiro de um edital são removidos sozinhos; ficam os ligados aos editais. Se a manual estava como recebida, o edital passa a registrar o recebimento. Casos duvidosos aparecem em Contas para você confirmar, e dá para desfazer por 30 dias.
- **Jarvis mais rápido e confiável:** uma única chamada à IA com um retrato compacto dos seus dados. Com a `geminiKey` no `config.js`, ele usa a API direta do Gemini (mais rápida); sem ela, o Firebase. No microfone do Jarvis, fale e ele envia sozinho quando você para. O botão "Conversa" faz ele voltar a ouvir depois de cada resposta. Frases que não são ordens, digitadas ou faladas na barra do Início, viram pergunta para o Jarvis.
- **Kegel → aba "Resistência":** programa de 3 fases, sessões de 15 a 20 minutos, com teste de controle semanal.
- **Meditação:** timers de 10, 15 e 20 minutos (silenciosa, respiração guiada ou atenção ao corpo), sino, sequência e calendário, registrados como os treinos.
- **Maratona:** planilha automática e adaptativa (cerca de 9 meses), com check de cada treino, remarcação de treinos perdidos, ajuste pela capoeira e academia e previsão da prova que se atualiza.
- **Português para concursos:** trilha com lições e 435 questões (123 de porquês, 225 de crase e 87 dos demais tópicos), treino inteligente com repetição espaçada, caderno de erros e padrões de erro. O banco fica em `js/dados/` e só é baixado quando você abre o módulo.
- **Fotógrafo:** checklist de fotos por pasta (colar lista, marcar, modelos prontos) e mover fotos entre pastas (botão "Selecionar" na grade).

## 5. Novidades da versão 2.3

- **Tamanho fixo:** o app não dá mais zoom (nem com os dois dedos, nem com toque duplo, nem com Ctrl + roda do mouse no computador). O tamanho do texto também não muda com o tamanho de fonte do sistema.
- **Confirmar a saída:** no Início, o botão voltar do celular abre a pergunta "Sair do Moving Up?". Toque em **Ficar no app** para continuar, ou aperte voltar de novo para fechar. Nas outras telas, o voltar continua levando para a tela anterior.
- **Tarefas de hoje (to-do list):** um cartão só, logo abaixo da barra de comando, em qualquer horário. Escreva e toque em **+** (a fazer) ou em **Já fiz** (entra direto como feita). Toque no círculo para concluir e no texto para editar, mudar de dia ou apagar. As feitas ficam recolhidas na linha "N feitas hoje"; toque para ver. O que você registra pela barra de comando ("fiz…") e os treinos concluídos também entram ali. Tarefas não feitas de dias anteriores aparecem com o botão **Trazer para hoje**.
- **Início mais limpo:** saíram "Meu dia" (dominó e prioridades) e "O que eu fiz hoje". O histórico do que você fez continua em Produtividade e no módulo "O que eu fiz hoje".
- **Produtividade:** em *Tarefas de hoje → Produtividade*, veja o dia de hoje, a média dos últimos 7 dias, o gráfico da semana, os dias seguidos com tarefas concluídas e o histórico de 30 dias (toque num dia para ver o que foi feito).
- O Jarvis também consulta as tarefas ("quantas tarefas concluí esta semana?").

Para publicar: envie `index.html`, `sw.js`, `css/app.css`, `LEIA-ME.md`, `js/01-base.js`, `js/10-pro.js` e o arquivo novo `js/44-tarefas.js`. O app do Android (APK) abre o site, então não precisa gerar um APK novo.

## 6. Ícone novo: espiral áurea (versão 2.4)

O ícone agora é a espiral áurea dourada dentro de um anel, sobre fundo azul-noite. Mudou em: `mu-icon-192.png`, `mu-icon-512.png`, `mu-maskable-512.png`, `mu-apple-touch.png`, `mu-logo.svg`, a tela de abertura e o logo do Início (`index.html` e `js/01-base.js`). A cor da barra do app instalado (`theme_color` no `moving-up.webmanifest`) passou a ser o mesmo azul-noite.

Para publicar: envie esses arquivos, mais `sw.js` e `moving-up.webmanifest`.

**Onde o ícone novo aparece sozinho:** dentro do app, no navegador e no atalho do iPhone (se não aparecer, remova o atalho e adicione de novo).

**No APK do Android, o ícone fica gravado no próprio APK.** Para trocar, gere um APK novo no PWABuilder:
1. Publique os arquivos no GitHub e espere 2 minutos.
2. Abra [pwabuilder.com](https://www.pwabuilder.com), cole o endereço do app e toque em **Package for stores → Android → Generate package**.
3. Em **Options**, mantenha o **Package ID** `io.github.flaviospraciano.movingup` e aumente o **App version code** (por exemplo, de 1 para 2).
4. Em **Signing key**, escolha **Use mine** e envie o `APK/signing.keystore`, com o alias e as senhas do `APK/signing-key-info.txt`. Usar a mesma chave é o que permite instalar por cima do app atual sem perder nada; com uma chave nova, o Android trata como outro app.
5. Baixe o pacote, instale o `.apk` novo no celular e guarde o `.aab` (é ele que vai para a Play Store, se um dia publicar lá).

## 7. Versão 2.5: correções e limpeza

- **Telas que passavam da largura do celular:** o cartão de Afirmações empurrava a tela para o lado e, com isso, a pausa de gratidão, o "Repita comigo" e a pergunta de sair ficavam maiores que a tela. Agora nada passa da largura, em nenhuma tela (conferido também com fonte grande).
- **Ícone apagado no topo:** o celular estava aplicando o "modo escuro forçado" por cima do app, o que desbotava o ícone e as cores. O app agora avisa que tem tema próprio, e o celular não mexe mais nas cores.
- **Voz ao sair:** o voltar agora fecha a tela cheia aberta (Repita comigo, Jarvis, leitor, gratidão) em silêncio. Ao sair ou trocar de app, nada continua falando (a meditação e o Kegel seguem, porque guiam com a tela apagada).
- **Saíram do app:** "Sua montanha" (Serra da Constância), Plano RPM, Fear-setting e Lista do não-fazer.
- **Tarefas que ficam para o dia seguinte:** o que não foi concluído passa sozinho para o próximo dia, até ser feito, com o selo "desde ontem" ou "há N dias". Em Produtividade aparece o que está pendente há 3 dias ou mais.
- **Ícone do topo (v2.5.1):** o fundo azul-noite do logo agora é desenhado pelo CSS, e não dentro do SVG. Assim o modo escuro forçado do celular não consegue mais clarear o ícone.
- **Novo: tarefa importante.** Toque na estrela de uma tarefa para ela ficar no topo da lista.

Arquivos alterados: `index.html`, `sw.js`, `css/app.css`, `js/01-base.js`, `js/05-produtividade.js`, `js/10-pro.js`, `js/26-jarvis.js`, `js/41-conexoes.js`, `js/44-tarefas.js` e este `LEIA-ME.md`.

## 8. Editais: documentação dos contemplados e contatos (v2.6)

- **Documentação para envio:** nos projetos **contemplados**, toque no projeto e depois em *Documentação para envio*. Ali ficam a **forma de envio** (e-mail, Mapa Cultural, presencial, outra plataforma ou para você mesmo), o detalhe (e-mail, local, link), o **prazo** e o **checklist** dos documentos. Dá para colar a lista inteira do edital ou tocar nos documentos mais comuns para incluir.
- **Mensagem pronta:** *Copiar mensagem* monta o texto com a lista, a forma de envio e o prazo, pronto para colar no WhatsApp. Se parte já estiver ok, a mensagem lista só o que falta. *Abrir conversa* já abre o WhatsApp da pessoa com o texto escrito.
- **Usar nos outros contemplados:** aplica a mesma lista, forma de envio e prazo aos outros contemplados do mesmo edital.
- **Vínculo com contato:** em qualquer projeto, *Vincular a um contato profissional* (ou criar um na hora, só com nome e WhatsApp). No contato aparecem os *Editais vinculados*; no quadro do edital, cada projeto mostra o contato e o andamento dos documentos.

Arquivos: o novo `js/45-edital-docs.js`, mais `index.html`, `sw.js`, `css/app.css` e este `LEIA-ME.md`.

## 9. Versão 2.7

- **Agenda de vários dias:** no compromisso, preencha *Até o dia*. Ex.: Gravações em Conceição dos Caetanos, de 2 a 4. Aparece em todos os dias do período, com "dia 2 de 3".
- **Check de hoje:** saíram Natação e Corridas (continuam em Módulos).
- **Gasto por foto:** enquanto lê, há o botão *Ocultar e continuar usando o app*. Ao terminar, o gasto é salvo sozinho e aparece um aviso no rodapé com *Conferir*. Ficou mais rápido: a foto vai menor para a IA e o leitor de texto fica pronto entre um uso e outro.
- **Orçamentos do fotógrafo:** no Espaço do fotógrafo, *Meus orçamentos*. Cada serviço com valor e o que inclui; *Copiar* manda o texto pronto para o cliente. Há um texto final comum a todos (pagamento, sinal, validade) e *Copiar a tabela completa*.
- **Treinos e corpo, nesta ordem:** Academia, Corridas, Treinos de capoeira, Exercício de Kegel, Natação e Maratona.
- **Semana do desafio:** o mês tem 4 semanas (1–7 flexões, 8–14 abdominais, 15–21 barras, 22 ao fim agachamentos). No Início, um cartão com as 4 séries de 20: marque cada uma; completou as 4, bateu o ponto do dia. Em *Placar*, os pontos do mês, os dias seguidos e as 4 semanas. Dá para ajustar as repetições por exercício.

Arquivos: o novo `js/46-extras.js`, mais `index.html`, `sw.js`, `css/app.css`, `js/02-modulos.js`, `js/10-pro.js` e este `LEIA-ME.md`.

## 10. Versão 2.8: as partes conversando entre si

- **Check automático:** academia, Kegel e desafio marcam o Check de hoje sozinhos. O Check mostra o placar (5/8) e usa nomes curtos iguais em todo o app.
- **Briefing da manhã completo:** tarefas (as que vieram de ontem e a importante), prazos de documentos, valores a receber, a semana do desafio e aniversários.
- **Fechamento da noite por voz:** o que você concluiu, o que fica para amanhã e o desafio, em cerca de 30 segundos.
- **Jarvis na hora, sem IA:** "anota tarefa…", "copia o orçamento do estúdio", "fiz a série do desafio", "o que falta do edital X", "o que falta hoje", "relatório do mês".
- **Deslizar a tarefa:** para a direita conclui, para a esquerda passa para amanhã.
- **Cartões concluídos encolhem:** desafio feito, briefing ouvido e gratidão feita viram uma linha.
- **Faixa única de pendências:** contas, documentos, aniversários, contatos e o relatório do mês.
- **Mentalidade:** frase e afirmação num cartão só.
- **Módulos por uso:** mais usados em cima; os que você não abre ficam em "Pouco usados" (depois de 14 dias).
- **Cores por área:** treinos laranja, dinheiro verde, trabalho e cultura vermelho, rotina verde-azulado, estudos azul, vida pessoal rosa.
- **Comprovante na edição do gasto**, **aniversário nos contatos** (com mensagem pronta), **horas de estudo pelo foco**, **microfone nos campos de texto**, **modo essencial** (botão no topo), **previsão de caixa** (em Contas) e **relatório do mês** (pela faixa de pendências ou por Produtividade).
- O backup já existia em Ajustes → Seus dados (Exportar cópia / Importar); não foi duplicado.

Arquivos: o novo `js/47-conexoes.js`, mais `index.html`, `sw.js`, `css/app.css`, `js/10-pro.js`, `js/26-jarvis.js`, `js/44-tarefas.js` e este `LEIA-ME.md`.

## 11. Versão 2.9

- **Áudio vira tarefas:** no cartão Tarefas de hoje, toque em *Falar* (ou diga ao Jarvis "vou falar tudo"). Fale até uns 2 minutos; o app separa em tarefas, compromissos e anotações, você confere e salva.
- **Comparações com gráfico:** "gastei mais que no mês passado?" ou "treinei mais que no mês passado?" mostram o gráfico por categoria, comparando o mesmo período dos dois meses.
- **Feriados no calendário:** nacionais, do Ceará (19/3 e 25/3) e de Sobral (5/7 e 8/12), com pontos facultativos (Carnaval, Cinzas, Corpus Christi). Aparecem no calendário, na agenda do Início e no briefing.
- **Metas de poupança** (Módulos → Dinheiro): reserva de emergência e outras, com progresso, quanto guardar por mês e sugestão de reserva de 6 meses dos seus gastos. Pelo Jarvis: "guardei 300 na reserva".
- **Descanso entre séries:** no treino da academia (45s, 1 min, 1min30, 2 min) e automático entre as séries do desafio. Vibra e apita no fim.
- **Água:** abaixo do Check de hoje. Meta de copos, horário do primeiro e do último aviso e intervalo. Com os avisos do celular ligados, chegam mesmo com o app fechado.
- **Fila de leitura** (Módulos → Estudos): livros em ordem de prioridade, "Lendo agora" e "Terminei", que guarda em Livros lidos.
- **Versículo do dia** nas afirmações.
- Aniversários dos contatos também passam a avisar com o app fechado.

Arquivos: o novo `js/48-novidades.js`, mais `index.html`, `sw.js` e `css/app.css`.

## 12. Versão 2.10

- **Frase do dia:** saíram as frases de capoeira e de Paulo Freire.
- **Treino feito sai do Início:** depois que a academia de hoje é concluída, o cartão do treino deixa de aparecer no Início (o Check de hoje continua mostrando Academia ✓).
- **Ciclo dos treinos:** o treino concluído (ex.: Treino A) fica marcado até você concluir todos os outros. A planilha mostra o ciclo (A ✓ · B · C) e sugere o próximo que falta. Quando todos estão feitos, o ciclo fecha e, no dia seguinte, tudo é desmarcado para recomeçar. Para desfazer, toque num exercício do treino concluído ou em *Desmarcar*.

Arquivos: o novo `js/49-ajustes.js`, mais `index.html`, `sw.js`, `css/app.css` e este `LEIA-ME.md`.

## 13. Versão 2.11: Jarvis revisado

Correções:
- "Quantas séries faltam do desafio?" marcava uma série em vez de responder. Agora responde.
- "Copia o orçamento do casamento" copiava outro orçamento quando só havia um. Agora diz que não achou e lista os que existem.
- Quando nada era entendido, a tela dizia "Feito!" e oferecia "Desfazer". Agora diz "Não entendi" e mostra exemplos.
- Sem a IA ligada, perguntas gerais mostravam só um aviso rápido. Agora a resposta explica o que o Jarvis consegue fazer sem IA.
- O nome "Jarvis" quebrava em duas linhas no topo da conversa.

Melhorias (respostas na hora, no aparelho, com ou sem IA):
- Gastos: "quanto gastei hoje / ontem / esta semana / este mês / no mês passado / em outubro", também por categoria ("com alimentação").
- Agenda: "qual minha agenda de amanhã?" (inclui feriado e tarefas do dia). "Agendar reunião sexta às 10" cria o compromisso.
- Tarefas, treinos ("quantos treinos fiz esta semana?"), contas ("quanto tenho a pagar / a receber"), desafio, água, poupança, ciclo de 12 semanas e "resumo de hoje".
- Essas respostas entram na conversa do Jarvis, e a conversa contínua segue ouvindo.
- As sugestões da tela do Jarvis mostram o que ele já sabe fazer.

Arquivos: o novo `js/50-jarvis.js`, mais `index.html`, `sw.js`, `css/app.css`, `js/10-pro.js`, `js/47-conexoes.js` e este `LEIA-ME.md`.

## 14. Versão 2.12: revisão geral

Revisão automática de 54 telas (tema claro e escuro, celular de 360 px, fonte grande): todos os botões levam a uma ação que existe, todas as telas abrem sem erro, nenhuma passa da largura. Corrigido:
- **Virada do dia com o app aberto:** o Início agora se atualiza sozinho na meia-noite e na troca de período (manhã, tarde, noite). Antes ficava no dia anterior até reabrir.
- **Água à noite:** o cartão da água não aparecia no período da noite, justo quando ainda há lembretes. Agora aparece.
- **Sessão de foco:** em telas estreitas o texto ficava espremido numa coluna; agora os botões 25 e 50 min ficam lado a lado embaixo.
- **Tarefas de hoje:** o título quebrava em duas linhas; o botão Falar virou só o ícone do microfone.
- **Relatório do mês:** "Concluiu 100% das tarefas" só aparece com pelo menos 5 tarefas no mês.

Arquivos: o novo `js/51-correcoes.js`, mais `index.html`, `sw.js`, `css/app.css`, `js/10-pro.js`, `js/47-conexoes.js` e este `LEIA-ME.md`.

## 15. Versão 3.0: IBGE · Recenseador (dentro de Estudos p/ concurso)

Entrada: Módulos → Estudos p/ concurso → cartão **IBGE · Recenseador**.

- **Banco de 2.500 questões** no formato da Cesgranrio (5 alternativas, uma correta): 1.250 de Conhecimentos Técnicos (tiradas da apostila oficial do 12º Censo Agro, com página citada), 625 de Língua Portuguesa e 625 de Matemática, distribuídas por todos os tópicos do edital. Cada questão tem tópico, dificuldade, gabarito comentado alternativa por alternativa e uma pílula de reforço. O banco é gerado sempre igual (mesmos IDs: TEC_0001, POR_0001, MAT_0001…) e pode ser baixado em JSON no próprio painel.
- **Modos:** Rodada rápida (10), Simulado realista (15 + 15 + 30, cronômetro de 4 h, gabarito só no fim), Estudo por tópicos, Reforço diário (caderno de erros) e Zero Erros (simulado só com o que você errou).
- **Reforço espaçado:** errou, a questão vai para o caderno de erros e volta na mesma sessão depois de 5 a 8 questões, até você acertar 2 vezes seguidas.
- **Cards de estudo:** toda a apostila em cards por tópico, mais os de Português, Matemática e um bloco de **Pegadinhas** de concurso.
- **Jogo:** XP por acerto (mais nas difíceis e em combo), níveis com nomes da carreira censitária, meta diária, sequência de dias e 14 conquistas. Responder 10 questões no dia marca o Check "Estudo".
- **Hábitos automáticos:** treino de Kegel concluído marca o hábito de Kegel; treino de academia completo marca o hábito de atividade física (se o hábito não existir, ele é criado).

Arquivos: os novos `js/52-ibge-tec.js`, `js/53-ibge-por.js`, `js/54-ibge.js`, `js/55-ibge-app.js` e `js/56-habitos-auto.js`, mais `index.html`, `sw.js`, `css/app.css` e este `LEIA-ME.md`.

## 16. Versão 3.1: espaço de estudo do IBGE revisado

- **Hábito de 20 questões:** ao responder 20 questões de concurso no dia (IBGE e Português para concursos somados), o hábito "20 questões de concurso" é marcado sozinho (criado se não existir). Kegel e academia continuam como estavam.
- **Correções:** o progresso podia se perder entre uma resposta e outra (XP, estrelas, conquistas repetidas); siglas no enunciado saíam como "iBGE"; o simulado mandava as questões em branco para o caderno de erros; "bastante" antes de substantivo passou a ser classificado como pronome indefinido. O banco foi refeito sem quase-repetições e conferido automaticamente: nenhuma questão tem duas certas ou duas erradas.
- **Trilha do Recenseador:** 38 unidades (todo o edital): ler a teoria → praticar 8 → estrelas (6, 7 ou 8 de primeira) → libera a próxima.
- **Revisão do dia:** cada acerto agenda a questão para voltar em 1, 3, 7, 16 e 35 dias; errou, volta para o começo.
- **"Não tenho certeza (vou chutar)":** acerto no chute não conta como aprendido e a questão volta na sessão.
- **Teoria sem sair da questão**, **Relâmpago V ou F** (20 afirmações da apostila, priorizando as que você erra), **Missão do dia** (+100 XP), **pontos fracos**, **diagnóstico do simulado** e **simulado que continua** mesmo se o app fechar.

Arquivos: o novo `js/57-ibge-plus.js`, mais `js/53-ibge-por.js`, `js/54-ibge.js`, `js/55-ibge-app.js`, `index.html`, `sw.js`, `css/app.css` e este `LEIA-ME.md`.

## 17. Água: copo de 100 ml, meta de 30

O padrão agora é copo de 100 ml e meta de 30 copos (3 L). Quem estava no padrão antigo (8 copos de 250 ml) foi atualizado sozinho. Nos ajustes da água dá para escolher o tamanho do copo (100, 200, 250 ou 300 ml) e a meta (até 60). O cartão ganhou o botão +3 e uma barra no lugar dos copinhos, e cada aviso diz quantos copos beber naquele momento. Arquivos: `js/48-novidades.js`, `css/app.css` e `sw.js`.

## 18. Versão 4.0: Lembretes conectados, Jarvis proativo e Segundo cérebro

**Lembretes conectados.** A tela Lembretes reúne tudo o que precisa ser feito hoje: agenda (e compromissos atrasados de até 7 dias), contas atrasadas e de hoje/amanhã, treinos, desafio, Check (rituais, Kegel, estudo…), afirmações, gratidão, hábitos, água, tarefas importantes, desafios de crescimento, decisões a revisar e ideias a revisitar. Cada item só sai quando você marca ✓ (o app faz a ação de verdade no módulo) ou exclui ✕ do dia. Marcar conta como paga pede confirmação. A barra de baixo mostra quantas pendências faltam e, às 20h, chega um aviso se ainda houver itens.

**Início que se limpa.** Hábitos feitos, água batida, afirmações declaradas, itens do Check, desafio, gratidão e briefing somem do Início e viram uma linha "Feito hoje". Voltam no dia seguinte.

**Recompensa que faz crescer.** Ao cumprir pelo menos 80% dos hábitos (ou fazer 60 pontos), aparece um desafio proporcional aos pontos: correr X km, fechar uma venda de R$ X (pela média dos seus orçamentos), enviar orçamentos, fazer X questões, simulado, ler X páginas, guardar R$ X, flexões, retomar contatos ou sessões de foco. Aceitou: vira tarefa importante até você concluir.

**Jarvis.** Confirmação antes de executar quando há gasto ou 3 ações ou mais (dá para desmarcar itens). Novos comandos: "planeja meu dia", "como estou indo?", "relatório da semana", "alertas", "lembre que…", "decidi…", "ideia: …", "o que você sabe sobre…". Cartão "Jarvis sugere" no Início com alertas e a ordem recomendada; relatório da semana no domingo à tarde.

**Segundo cérebro** (Módulos → Estudos e crescimento): captura que reconhece o tipo, [[ligações]], #tags, @pessoas, ligações automáticas quando uma nota cita o título de outra, "Citada em", "Pode ter a ver", faísca do dia, revisitas espaçadas, decisões com porquê e data de revisão, grafo, "Pergunte ao seu cérebro" e exportação em Markdown. Anotações do "Falar e separar" e o que você pede para o Jarvis lembrar vão para lá.

**Correção:** o hábito automático da academia/Kegel só marca treinos de hoje registrados agora (não reprocessa histórico nem backup).

Arquivos: os novos `js/58-lembretes-hub.js`, `js/59-jarvis-pro.js` e `js/60-cerebro.js`, mais `js/10-pro.js`, `js/43-jarvis-sessoes.js`, `js/56-habitos-auto.js`, `index.html`, `sw.js`, `css/app.css` e este `LEIA-ME.md`.

## Mapa dos arquivos

| Arquivo | O que tem |
|---|---|
| `index.html` | estrutura da página e ordem dos scripts |
| `css/app.css` | todo o visual |
| `js/01-base.js` | utilidades, armazenamento, navegação, formulários |
| `js/02-modulos.js` | módulos originais, listas, gastos, agenda, ajustes |
| `js/03-nuvem.js` | login e Firebase |
| `js/04` a `js/11` | ferramentas, produtividade, Kegel, curso, atabaque, violão, PRO, gratidão |
| `js/12-icones.js` | ícones novos |
| `js/20` a `js/25` | 12 semanas, contatos, Feynman, compromissos, cartas, Início |
| `js/26-jarvis.js` | perguntas aos dados, briefing falado e alerta precoce |
| `js/27-voz.js` | voz do Jarvis (Gemini TTS e voz do aparelho) |
| `js/44-tarefas.js` | tarefas do dia e tela de Produtividade |
| `js/45-edital-docs.js` | documentação dos contemplados e vínculo edital ↔ contato |
| `js/46-extras.js` | semana do desafio, orçamentos do fotógrafo, gasto por foto em segundo plano |
| `js/48-novidades.js` | áudio vira tarefas, comparações, feriados, poupança, descanso, água, fila de leitura, versículo |
| `js/47-conexoes.js` | check automático, pendências, Jarvis local, relatório, previsão de caixa e demais conexões |
| `js/28-contas.js` | limpeza de contas duplicadas dos editais |
| `js/29-foto.js` | checklist de fotos e mover fotos |
| `js/31-maratona.js` | planilha adaptativa da maratona |
| `js/32-resistencia.js` | programa Resistência do Kegel |
| `js/33-meditacao.js` | meditação |
| `js/34-portugues.js` e `js/dados/` | português para concursos e banco de questões |
| `js/30-push.js` | avisos com o app fechado (lado do celular) |
| `js/99-iniciar.js` | liga o app |
| `sw.js` | offline, atualização e recebimento dos avisos |
| `.github/workflows/avisos.yml` | tarefa do GitHub que roda a cada 5 minutos |
| `automacao/enviar-avisos.mjs` | o script que envia os avisos |
| `firestore.rules` | regras de segurança do banco |
