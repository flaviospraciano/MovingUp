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
