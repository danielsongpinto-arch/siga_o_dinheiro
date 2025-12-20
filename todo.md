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

## Leitura Offline
- [x] Criar hook para gerenciar artigos salvos offline
- [x] Adicionar botão de download nos artigos
- [x] Implementar indicador de artigos disponíveis offline
- [x] Criar seção "Salvos Offline" no perfil

## Histórico de Leitura
- [x] Criar hook para rastrear artigos lidos
- [x] Adicionar indicador de progresso de leitura
- [x] Criar tela de histórico de leitura
- [x] Mostrar tempo estimado de leitura
- [x] Adicionar estatísticas de leitura no perfil

## Compartilhamento Social Aprimorado
- [x] Criar componente de card visual para compartilhamento
- [x] Implementar seleção de citações do artigo
- [x] Gerar imagem com citação e branding
- [x] Integrar com Share API nativo

## Modo Escuro Aprimorado
- [x] Criar hook para gerenciar preferência de tema
- [x] Adicionar seletor de tema no perfil (claro/escuro/automático)
- [x] Implementar persistência da preferência
- [x] Atualizar tema em tempo real

## Artigos Relacionados
- [x] Criar algoritmo de recomendação baseado em tema
- [x] Adicionar seção "Você também pode gostar" nos artigos
- [x] Implementar cards de artigos relacionados
- [x] Limitar a 3-4 sugestões relevantes

## Marcadores de Texto
- [x] Criar hook para gerenciar highlights
- [x] Implementar seleção de texto nos artigos
- [x] Adicionar menu de contexto para marcar texto
- [x] Criar tela de visualização de marcadores salvos
- [x] Permitir navegação para o artigo original do marcador

## Modo de Leitura Focado
- [x] Adicionar botão de modo focado no artigo
- [x] Ocultar tabs e navegação em modo focado
- [x] Implementar transição suave
- [x] Adicionar botão de saída do modo focado

## Estatísticas Avançadas
- [x] Criar componente de gráfico de barras
- [x] Implementar gráfico de artigos por tema
- [x] Adicionar gráfico de evolução mensal
- [x] Criar dashboard de estatísticas no perfil
- [x] Mostrar tempo médio de leitura

## Exportação de Marcadores
- [x] Implementar geração de PDF com marcadores
- [x] Adicionar botão de exportar na tela de marcadores
- [x] Incluir título, data e notas no PDF
- [x] Permitir compartilhamento do PDF gerado

## Sistema de Badges e Conquistas
- [x] Criar tipos e dados de badges
- [x] Implementar hook para gerenciar conquistas
- [x] Criar tela de badges e conquistas
- [x] Adicionar notificações ao desbloquear badges
- [x] Mostrar progresso de conquistas no perfil

## Modo de Áudio
- [x] Instalar e configurar expo-speech
- [x] Adicionar controles de áudio no artigo
- [x] Implementar play/pause/stop
- [x] Adicionar controle de velocidade
- [x] Manter áudio em background

## Comunidade e Discussões
- [x] Criar estrutura de discussões por artigo
- [x] Implementar sistema de respostas aninhadas
- [x] Adicionar reações (curtir/útil)
- [x] Criar tela de comunidade
- [x] Adicionar filtros e ordenação
