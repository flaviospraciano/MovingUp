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
| `js/30-push.js` | avisos com o app fechado (lado do celular) |
| `js/99-iniciar.js` | liga o app |
| `sw.js` | offline, atualização e recebimento dos avisos |
| `.github/workflows/avisos.yml` | tarefa do GitHub que roda a cada 5 minutos |
| `automacao/enviar-avisos.mjs` | o script que envia os avisos |
| `firestore.rules` | regras de segurança do banco |
