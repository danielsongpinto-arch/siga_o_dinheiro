# TODO - Siga o Dinheiro

## Estrutura e Navegação
- [x] Configurar bottom tab navigation com 4 tabs (Home, Temas, Favoritos, Perfil)
- [x] Adicionar mapeamento de ícones no icon-symbol.tsx
- [x] Customizar tema com paleta de cores dourada

## Tela Home
- [x] Criar componente de header com logo e título
- [x] Criar seção de introdução explicando o conceito
- [x] Criar card destacado "Por que analisar fatos pela visão financeira?"
- [x] Criar lista de artigos recentes
- [x] Implementar pull-to-refresh

## Tela Temas
- [x] Criar lista de temas com cards grandes
- [x] Implementar navegação para lista de artigos por tema
- [x] Adicionar imagens de fundo nos cards de tema

## Tela Detalhes do Artigo
- [x] Criar layout de artigo completo
- [x] Adicionar seção "Autores e Interesses Financeiros"
- [x] Adicionar seção "Ciclo Financeiro" (início, meio, fim)
- [x] Implementar botão de favoritar com toggle
- [x] Implementar botão de compartilhar
- [x] Criar seção de comentários
- [x] Implementar campo de adicionar comentário
- [x] Listar comentários existentes

## Tela Favoritos
- [x] Criar lista de artigos favoritados
- [x] Implementar swipe-to-delete para remover favoritos
- [x] Adicionar estado vazio com mensagem

## Tela Perfil
- [x] Mostrar informações do usuário
- [x] Adicionar estatísticas (artigos lidos, comentários)
- [x] Criar modal "Sobre o App"
- [x] Implementar botão de logout

## Componentes Reutilizáveis
- [x] Criar ArticleCard component
- [x] Criar ThemeCard component
- [x] Criar CommentItem component

## Funcionalidades de Dados
- [x] Configurar AsyncStorage para favoritos locais
- [x] Criar hook useArticles para gerenciar artigos
- [x] Criar hook useFavorites para gerenciar favoritos
- [x] Criar hook useComments para gerenciar comentários
- [x] Implementar dados mock dos artigos iniciais

## Conteúdo
- [x] Escrever artigo "Siga o Dinheiro na Segunda Guerra Mundial"
- [x] Escrever artigo "Siga o Dinheiro na Fraude do Banco Master"
- [x] Escrever artigo "Siga o Dinheiro na COVID-19"
- [x] Criar conteúdo da página "Sobre o App"

## Branding
- [x] Gerar logo personalizado do aplicativo
- [x] Atualizar app.config.ts com nome e logo
- [x] Copiar logo para todos os locais necessários

## Testes e Refinamento
- [x] Testar fluxo completo de leitura de artigo
- [x] Testar funcionalidade de favoritos
- [x] Testar funcionalidade de comentários
- [x] Testar navegação entre todas as telas
- [x] Verificar responsividade em diferentes tamanhos de tela

## Expansão de Conteúdo
- [x] Adicionar artigo "Siga o Dinheiro na Crise de 2008"
- [x] Adicionar artigo "Siga o Dinheiro nas Privatizações no Brasil"
- [x] Adicionar artigo "Siga o Dinheiro na Indústria Farmacêutica"
- [x] Criar novos temas correspondentes

## Sistema de Busca
- [x] Criar tela de busca com campo de pesquisa
- [x] Implementar lógica de busca por título e conteúdo
- [x] Adicionar filtro por tema
- [x] Mostrar resultados em tempo real

## Notificações Push
- [x] Configurar Expo Notifications
- [x] Criar sistema de agendamento de notificações
- [x] Implementar notificação quando novo artigo é adicionado
- [x] Adicionar preferências de notificação no perfil
