# Tarefas — Conversas múltiplas

## Etapa 1 — Estado e persistência

- [x] Instalar e configurar Zustand conforme os padrões do projeto.
- [x] Criar a store em `src/stores` com a lista de conversas, o ID da conversa ativa e ações para criar, selecionar e adicionar mensagens.
- [x] Modelar cada conversa com um ID único e um histórico tipado como `Message[]`, preservando todos os campos do tipo existente.
- [x] Configurar o middleware `persist` do Zustand para salvar e restaurar conversas e mensagens no armazenamento local do navegador.
- [x] Persistir somente os dados das conversas; manter a conversa ativa fora da persistência e iniciar sem conversa selecionada após cada carregamento.
- [x] Garantir que o remetente não seja persistido e inicie como `user` em cada sessão.
- [x] Tratar explicitamente falhas de leitura e gravação da persistência.

## Etapa 2 — Interface e fluxo

- [x] Adicionar um sidebar à esquerda com a lista de conversas identificadas pelo ID.
- [x] Adicionar o botão “Nova conversa”; criar uma conversa vazia com ID único e ativá-la imediatamente.
- [x] Permitir selecionar conversas existentes e exibir somente o histórico correspondente.
- [x] Integrar o envio de mensagens à conversa ativa, sem misturar ou descartar históricos ao alternar entre conversas.
- [x] Manter a seleção do remetente global durante a sessão, sem alterá-la ao trocar de conversa.
- [x] Exibir o estado inicial sem conversa ativa, mantendo disponível a ação de criar conversa.
- [x] Desabilitar input, botão de envio e controle de remetente quando não houver conversa ativa, aplicando opacidade de 50% e impedindo ações por clique e teclado.

## Etapa 3 — Responsividade

- [x] Manter o sidebar visível à esquerda em telas largas.
- [x] Em telas pequenas, adicionar botão hamburger no canto superior esquerdo para abrir e recolher o sidebar.
- [x] Ajustar a área de mensagens e o input para ocupar o espaço restante sem sobrepor o sidebar.

## Etapa 4 — Validação

- [x] Testar a criação de conversas e confirmar a identificação pelo ID e ativação imediata.
- [x] Testar alternância entre pelo menos duas conversas, confirmando isolamento dos históricos e destino correto das novas mensagens.
- [x] Testar persistência após recarregar e reabrir o site, confirmando que nenhuma conversa inicia ativa.
- [x] Testar que trocar de conversa não altera o remetente e que uma nova sessão inicia como `user`.
- [x] Testar o estado sem conversa ativa, incluindo envio e alternância de remetente por teclado e clique.
- [x] Testar o sidebar em telas largas e pequenas, incluindo abrir e recolher pelo botão hamburger.
