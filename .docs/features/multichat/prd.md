# PRD — Conversas múltiplas

## Contexto

O produto atualmente oferece uma única conversa, cujo histórico fica no estado local do componente e é perdido ao recarregar a página. Esta funcionalidade transforma a experiência em um chat com várias conversas independentes, mantendo o histórico de cada uma.

Este PRD detalha a funcionalidade descrita em [brain-drump.md](./brain-drump.md).

## Objetivo

Permitir que a pessoa usuária crie e alterne entre várias conversas, cada uma com seu próprio histórico de mensagens, sem perder as conversas ao recarregar o site.

## Público e necessidade

Quem usa o chat precisa separar mensagens em conversas diferentes e retornar a uma conversa anterior sem misturar ou perder seu histórico.

## Escopo

### Incluído

- Armazenar no Zustand as conversas e o identificador da conversa ativa.
- Manter o histórico de cada conversa como uma lista de objetos `Message`, preservando todos os campos do tipo existente (`id`, `text` e `sender`).
- Persistir as conversas localmente no navegador para que permaneçam disponíveis após recarregar ou reabrir o site.
- Exibir uma lista de conversas em um sidebar à esquerda, identificando cada conversa pelo próprio ID.
- Criar uma conversa pelo botão do sidebar e ativá-la imediatamente.
- Permitir selecionar uma conversa existente para exibir seu histórico e enviar novas mensagens nela.
- Iniciar cada carregamento do site sem uma conversa ativa, mesmo quando houver conversas salvas.
- Manter a seleção de remetente (usuário/robô) compartilhada entre conversas durante a sessão, sem alterá-la ao trocar de conversa.
- Em telas pequenas, permitir abrir e recolher o sidebar por um botão hamburger no canto superior esquerdo.
- Desabilitar o input e seus controles quando não houver conversa ativa, com opacidade de 50% e sem permitir ações.

### Fora de escopo

- Excluir, renomear, ordenar ou pesquisar conversas.
- Sincronizar conversas entre dispositivos ou usuários.
- Alterar o formato ou o comportamento dos tipos de mensagem existentes.

## Requisitos funcionais

### RF-1 — Estado das conversas

O estado compartilhado da aplicação deve ser gerenciado por uma store Zustand localizada em `src/stores`. A store deve conter:

- As conversas, cada uma identificada por um ID único e associada a seu histórico de mensagens.
- O ID da conversa ativa, ou `null` quando nenhuma estiver ativa.
- Ações para criar uma conversa, selecionar uma conversa e adicionar uma mensagem à conversa ativa.

Cada mensagem deve preservar integralmente as informações do tipo `Message` existente. O estado do remetente selecionado permanece global à interface e não é reiniciado ao alternar entre conversas.

### RF-2 — Persistência e inicialização

- As conversas e seus históricos devem ser persistidos no armazenamento local do navegador.
- Ao iniciar o site, os históricos persistidos devem ser restaurados, mas nenhuma conversa deve estar ativa.
- A seleção de conversa ativa e o remetente selecionado não precisam ser restaurados entre carregamentos. O remetente inicia com o padrão atual (`user`).
- Falhas ao salvar ou restaurar dados devem ser tratadas explicitamente; a interface não deve indicar que os dados foram salvos quando a persistência falhar.

### RF-3 — Criar e selecionar conversas

- O sidebar deve listar todas as conversas existentes usando seus IDs como identificação visível.
- A ação “Nova conversa” deve criar uma conversa vazia com ID único e torná-la ativa.
- Selecionar uma conversa deve torná-la ativa e exibir somente suas mensagens.
- Trocar de conversa não deve apagar nem misturar históricos.
- Mensagens enviadas devem ser adicionadas somente ao histórico da conversa ativa.

### RF-4 — Estado sem conversa ativa

- Se não houver conversa ativa, o input de mensagem, o botão de envio e o controle de remetente devem estar desabilitados e visualmente apresentados com opacidade de 50%.
- Teclado, clique ou outros eventos não devem permitir enviar mensagens nem alternar o remetente nesse estado.
- A pessoa usuária deve poder iniciar uma conversa pelo botão do sidebar.

### RF-5 — Layout responsivo

- Em telas largas, o sidebar deve permanecer visível à esquerda da área de conversa.
- Em telas pequenas, o sidebar deve poder ser recolhido e aberto pelo botão hamburger no canto superior esquerdo.
- A lista de mensagens e o input devem ocupar a área restante sem sobrepor o sidebar.

## Critérios de aceite

1. Ao abrir o site sem conversas salvas, nenhuma conversa está ativa e os controles de mensagem estão desabilitados com opacidade de 50%.
2. Ao criar uma conversa, ela aparece no sidebar identificada pelo ID, fica ativa e permite o envio de mensagens.
3. Ao criar uma segunda conversa, o histórico da primeira permanece intacto e separado.
4. Ao alternar entre conversas, é exibido apenas o histórico da conversa selecionada; novas mensagens são registradas nela.
5. Ao recarregar o site, as conversas e mensagens anteriores continuam disponíveis, mas nenhuma conversa está ativa até a pessoa selecionar ou criar uma.
6. Alternar entre conversas não altera o remetente selecionado; o remetente começa como `user` ao iniciar uma nova sessão do site.
7. Em telas pequenas, o botão hamburger abre e recolhe o sidebar; em telas largas, a lista permanece visível à esquerda.
8. Quando não há conversa ativa, nenhum controle do input consegue executar ações, inclusive por teclado.

## Requisitos técnicos e restrições

- Usar Zustand para o estado compartilhado e manter a store em `src/stores`.
- Reutilizar o tipo `Message` existente e os componentes de chat sempre que compatível com o novo fluxo.
- Usar persistência local no navegador para os dados das conversas; não persistir a conversa ativa.
- Gerar IDs únicos para as conversas. O formato deve permitir exibir o ID diretamente no sidebar.
- Não alterar a semântica existente dos remetentes `user` e `robot`.

## Decisões registradas

- **Persistência:** conversas e mensagens são persistidas localmente no navegador.
- **Remetente:** a seleção é global durante a sessão e não muda ao alternar de conversa.
- **Inicialização:** históricos são restaurados, mas o site sempre abre sem conversa ativa.
- **Criação:** uma nova conversa é ativada assim que é criada.
