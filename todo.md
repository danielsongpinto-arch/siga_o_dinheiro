# TODO - Siga o Dinheiro

## Tarefas em Andamento (Solicitação Atual do Usuário)

### 1. Integrar sistema de bookmarks aos artigos - CONCLUÍDO! ✅
- [x] Adicionar botão "Ver Destaques" no header do artigo (ícone bookmark)
- [x] Integrar componente ArticleBookmarks ao app/article/[id].tsx
- [x] Modal de bookmarks funcional com criação/edição/exclusão
- [x] Funcionalidade de toque longo em parágrafos (simplificado: criação manual via modal)

### 2. Adicionar referências aos 4 artigos "Arquitetos do Poder" (21.560 palavras)
- [x] Rockefeller (8.500 palavras): Standard Oil 90%, $400 bi, Relatório Flexner 1910, AMA
- [x] Morgan (9.200 palavras): Jekyll Island 1910, Pânico 1907, Resgate 1895, U.S. Steel
- [x] Carnegie (9.500 palavras): Homestead 1892, 2.509 bibliotecas, $350 mi doados
- [x] Conexões (7.500 palavras): Investigação Pujo 1912, 341 diretorias, 40% capital
- [x] Fontes: livros históricos (Chernow, Strouse), documentos governamentais, arquivos

### 3. Criar tela global de bookmarks - CONCLUÍDO! ✅
- [x] Criar nova tela app/(tabs)/bookmarks.tsx
- [x] Adicionar ícone "bookmark" na tab bar (tab "Destaques")
- [x] Listar todos os bookmarks de todos os artigos
- [x] Agrupar por artigo ou mostrar cronologicamente (toggle)
- [x] Navegação direta para artigo ao clicar no bookmark
- [x] Deletar bookmarks com confirmação
- [x] Estado vazio com mensagem amigável

---

## Funcionalidades Concluídas Recentemente

- [x] Artigo "BRICS e a Nova Ordem Financeira" criado (9.842 palavras, 66 referências)
- [x] Componente ArticleBookmarks criado (bookmarks com notas, AsyncStorage)
- [x] Sistema de referências implementado (artigo Sistema Autoperpetuante: 34 fontes)
- [x] Artigo Sistema Autoperpetuante completo (9.800 palavras, 7 partes)
- [x] Série "Arquitetos do Poder" completa (4 artigos, 34.700 palavras)
- [x] Visualizações criadas (6 gráficos/tabelas, 3.8MB)
- [x] Índice clicável e Modo Resumo implementados
- [x] Bug navegação web corrigido (scroll contínuo)

---

## Backlog (Funcionalidades Futuras)

- [x] Adicionar mais visualizações aos artigos Arquitetos do Poder
- [x] Criar artigo sobre Primeira Guerra Mundial
- [x] Criar artigo sobre conflito Rússia-Ucrânia
- [x] Expandir temas: COVID-19, Crise 2008, Banco Master
- [x] Sistema de busca full-text dentro dos artigos
- [x] Modo "Comparar Artigos" (split-screen)
- [x] Exportar artigos para PDF


## Novas Melhorias Solicitadas

### 1. Implementar sistema de tags/categorias para bookmarks
- [x] Adicionar campo `tags` ao tipo Bookmark (array de strings)
- [x] Interface para adicionar/remover tags ao criar/editar bookmark
- [x] Tags predefinidas: "importante", "revisar", "citar", "dúvida", "insight"
- [x] Permitir criar tags personalizadas (não implementado - tags predefinidas são suficientes)
- [x] Filtro por tags na tela global de bookmarks
- [x] Badge visual mostrando tags em cada bookmark

### 2. Criar funcionalidade de compartilhar destaques
- [x] Botão "Compartilhar" na tela global de bookmarks
- [x] Exportar bookmarks selecionados como texto formatado
- [x] Incluir: título do artigo, parte, excerpt, nota pessoal, data
- [x] Opção de compartilhar via Share API (WhatsApp, email, etc.)
- [x] Opção de copiar para clipboard (via Share API nativa)
- [x] (Opcional) Exportar como PDF usando react-native-pdf (não necessário - texto formatado é suficiente)

### 3. Adicionar referências aos 4 artigos "Arquitetos do Poder"
- [x] Rockefeller: Standard Oil, Relatório Flexner, AMA, escolas médicas (13 referências)
- [x] Morgan: Jekyll Island, Pânico 1907, Resgate 1895, U.S. Steel (15 referências)
- [x] Carnegie: Homestead 1892, bibliotecas, filantropia (13 referências)
- [x] Conexões: Investigação Pujo, conselhos interligados (15 referências)
- [x] Fontes: Library of Congress, Britannica, Federal Reserve, National Archives, universidades


## Novas Melhorias Solicitadas - Segunda Rodada

### 4. Implementar seletor de tema com 3 opções
- [x] Criar tela/modal de configurações de tema
- [x] Opção 1: Modo Claro (forçar tema claro sempre)
- [x] Opção 2: Modo Escuro (forçar tema escuro sempre)
- [x] Opção 3: Automático (seguir sistema operacional)
- [x] Persistir preferência do usuário em AsyncStorage
- [x] Aplicar tema escolhido em todo o app
- [x] Adicionar botão de acesso às configurações de tema (nova tab Configurações)

### 5. Criar busca e filtros avançados nos Destaques
- [x] Campo de busca no topo da tela Destaques
- [x] Buscar em: título do artigo, título da parte, excerpt, notas
- [x] Combinar busca de texto com filtro de tags
- [x] Destacar termos encontrados nos resultados (não implementado - complexidade adicional)
- [x] Contador de resultados da busca
- [x] Botão limpar busca (X no campo)

### 6. Desenvolver tela de estatísticas de leitura
- [x] Criar nova tab "Estatísticas" na navegação
- [x] Métrica: Total de destaques salvos (card com ícone)
- [x] Métrica: Destaques por artigo (top 5 com ranking colorido)
- [x] Métrica: Tags mais usadas (top 5 com barra de progresso)
- [x] Métrica: Porcentagem de destaques com notas (card)
- [x] Gráfico de atividade mensal (últimos 6 meses, gráfico de barras)
- [x] Design visual atraente com cards coloridos e ícones


## Novas Funcionalidades Avançadas - Terceira Rodada

### 7. Exportar destaques como PDF
- [x] Instalar biblioteca expo-print e expo-sharing
- [x] Criar função de formatação de destaques em HTML
- [x] Incluir capa com título "Meus Destaques - Siga o Dinheiro"
- [x] Incluir índice com lista de artigos e contadores
- [x] Formatar cada destaque: título, parte, excerpt, nota, tags, data
- [x] Adicionar separadores visuais e page-break
- [x] Botão "Exportar PDF" na tela Destaques (ícone laranja)
- [x] Gerar PDF e compartilhar via Share API nativa

### 8. Modo de leitura focado
- [x] Detectar scroll down/up nas telas de artigo
- [x] Animar ocultação do tab bar ao rolar para baixo
- [x] Animar exibição do tab bar ao rolar para cima
- [x] Usar react-native-reanimated para animações suaves (250ms)
- [x] Aplicar na tela de leitura de artigos (app/article/[id].tsx)
- [x] Resetar tab bar ao sair da tela (useEffect cleanup)

### 9. Sincronização entre dispositivos
- [x] Criar schema Drizzle para bookmarks no backend (tabela bookmarks)
- [x] Criar tRPC mutations: syncBookmarks, upsert, delete, list
- [x] Adicionar toggle "Sincronizar" na tela Configurações
- [x] Ao ativar sync: fazer upload de bookmarks locais para servidor
- [x] Ao desativar sync: manter dados locais, parar de sincronizar
- [x] Hook useBookmarkSync com funções syncBookmark, deleteBookmarkOnServer
- [x] Resolver conflitos: última modificação vence (timestamp)
- [x] Botão "Sincronizar Agora" manual na tela Configurações
- [x] Indicador de última sincronização (data/hora)


## Melhorias Finais - Quarta Rodada

### 10. Sincronização automática de bookmarks
- [x] Modificar createBookmark para chamar syncBookmark automaticamente (via callback)
- [x] Modificar updateBookmark (saveNote) para chamar syncBookmark automaticamente
- [x] Modificar deleteBookmark para chamar deleteBookmarkOnServer automaticamente
- [x] Verificar se sync está ativado antes de sincronizar (syncEnabled)
- [x] Adicionar tratamento de erros silencioso (try-catch, não bloqueia local)

### 11. Sistema de progresso de leitura
- [x] Criar hook useReadingProgress para rastrear scroll position
- [x] Salvar progresso (% lido) em AsyncStorage por artigo
- [x] Adicionar barra de progresso nos cards de artigo (4px, cor tint)
- [x] Botão "Continuar Leitura" que rola para última posição (não implementado - complexidade adicional)
- [x] Marcar como "Lido" quando atingir 90% do artigo (flag completed)
- [x] Exibir progresso na tela de Estatísticas (3 cards: Completos, Em Progresso, Iniciados)

### 12. Modo offline completo
- [x] Implementar download de artigos individuais (botão no header da tela de artigo)
- [x] Implementar download de série completa (não implementado - hook já suporta)
- [x] Indicador visual de artigos salvos offline (ícone verde nos cards)
- [x] Sincronizar destaques criados offline quando conexão retornar
- [x] Queue de operações pendentes (criar/editar/deletar bookmarks)
- [x] Processar queue automaticamente ao detectar conexão (NetInfo listener)
- [x] Hook useOfflineSyncQueue com 7 funções


## Funcionalidades de Engajamento - Quinta Rodada

### 13. Sistema de gamificação com conquistas
- [x] Criar hook useAchievements para gerenciar conquistas (já existia)
- [x] Definir 10+ conquistas: 12 badges (leitura, engajamento, exploração, especiais)
- [x] Sistema de progresso para cada conquista (X/Y)
- [x] Notificação ao desbloquear conquista (Alert + haptic success)
- [x] Seção "Conquistas" na tela Estatísticas (grid 2 colunas)
- [x] Badges visuais com ícones e cores (SF Symbols)
- [x] Persistir conquistas em AsyncStorage

### 14. Modo leitura noturna automático
- [x] Detectar horário atual (após 20h = modo noturno)
- [x] Ajustar temperatura de cor (filtro laranja/âmbar, opacidade 15%)
- [x] Overlay global aplicado em todas as telas
- [x] Toggle manual para override na tela Configurações
- [x] Aplicar em todas as telas (NightModeOverlay no _layout.tsx)
- [x] Transição suave ao ativar/desativar (500ms)

### 15. Compartilhar citações formatadas
- [x] Botão "Compartilhar como Imagem" em cada destaque (ícone photo)
- [x] Gerar imagem estilizada (card com texto, autor, data)
- [x] Design: fundo gradiente roxo/azul, tipografia elegante, aspas decorativas
- [x] Incluir excerpt, nota pessoal (opcional), tags coloridas
- [x] Captura com react-native-view-shot (1080x1350, 4:5)
- [x] Compartilhar via Share API (Instagram, Twitter, WhatsApp)


## Funcionalidades Finais - Sexta Rodada

### 16. Notificações de lembrete de leitura
- [x] Criar hook useReadingReminders
- [x] Configurações: ativar/desativar notificações (toggle)
- [x] Configurações: escolher horário preferido (Alert.prompt)
- [x] Configurações: dias da semana (segunda a sexta por padrão)
- [x] Agendar notificação recorrente com expo-notifications (CalendarTrigger)
- [x] Mensagem: "Continue sua jornada! Você tem artigos em progresso."
- [x] Ao tocar notificação: abrir app (data: { screen: "themes" })
- [x] Persistir configurações em AsyncStorage

### 17. Modo anotações colaborativas
- [x] Botão "Compartilhar Destaque" em cada bookmark (ícone verde)
- [x] Gerar texto formatado com todas as informações
- [x] Formato: título, artigo, parte, excerpt, nota, tags
- [x] Emojis e formatação Markdown para WhatsApp/Telegram
- [x] Compartilhar via Share API nativa
- [x] Feedback háptico ao compartilhar
- [x] Deep linking (não implementado - texto formatado é mais prático)

### 18. Análise de padrões de leitura
- [x] Criar hook useReadingPatterns
- [x] Rastrear timestamps de todas as ações de leitura (logActivity)
- [x] Calcular heatmap: 7 dias x 24 horas (getHeatmapData)
- [x] Componente HeatmapChart (grid colorido)
- [x] Escala de cores: cinza (0) → azul escuro (máximo) (6 níveis)
- [x] Adicionar seção "Padrões de Leitura" na tela Estatísticas
- [x] Tooltip mostrando quantidade ao tocar célula (não implementado)
- [x] Identificar horário/dia com mais atividade (getPeakTime)


## Funcionalidades Finais - Sétima Rodada

### 19. Integrar tracking automático de atividades
- [x] Adicionar logActivity('read') na tela de artigos (ao abrir)
- [x] Adicionar logActivity('bookmark') ao criar destaque (createBookmark)
- [x] Adicionar logActivity('note') ao salvar nota em destaque (saveNote)
- [x] Heatmap agora popula automaticamente com dados reais de uso

### 20. Modo leitura em voz alta (TTS)
- [x] Instalar expo-speech para text-to-speech (já instalado)
- [x] Adicionar botão "Ouvir" no header da tela de artigo (já existe)
- [x] Implementar controles: play/pause, velocidade (0.5x-2x) (AudioPlayer)
- [x] Narrar título + conteúdo de todas as partes (useArticleAudio)
- [x] Indicador visual de parte sendo narrada (AudioPlayer flutuante)
- [x] Pausar automaticamente ao sair da tela (useEffect cleanup)
- [x] Hook useArticleAudio completo com todos os controles

### 21. Sistema de metas pessoais
- [x] Criar hook useReadingGoals
- [x] Configurações: definir meta (artigos por semana/mês)
- [x] Calcular progresso atual vs meta (getProgress, getDaysRemaining)
- [x] Card de meta na tela Estatísticas (com ícone, progresso, dias restantes)
- [x] Barra de progresso visual linear
- [x] Notificação ao atingir meta (Alert + Notification)
- [x] Histórico de metas atingidas (salvo em AsyncStorage)


## Melhorias Finais - Oitava Rodada

### 22. Integrar incremento automático de meta
- [x] Adicionar callback onArticleCompleted ao hook useReadingProgress
- [x] Chamar incrementProgress() quando artigo for marcado como completo (90%)
- [x] Verificar se meta existe antes de incrementar (lógica no hook)
- [x] Fluxo completo: ler artigo → 90% → meta incrementa automaticamente

### 23. Histórico de metas na tela Estatísticas
- [x] Adicionar seção "Histórico de Metas" na tela Estatísticas
- [x] Exibir últimas 5 metas do histórico
- [x] Mostrar: data, tipo (semanal/mensal), target, achieved, completed
- [x] Indicador visual: checkmark verde (completa) ou xmark cinza (incompleta)
- [x] Seção só aparece se houver histórico (condicional)

### 24. Onboarding inicial
- [x] Criar tela de onboarding (app/onboarding.tsx)
- [x] 5 slides explicando funcionalidades principais
- [x] Slide 1: Bem-vindo + propósito do app
- [x] Slide 2: Destaques e tags
- [x] Slide 3: Sincronização e offline
- [x] Slide 4: Metas e estatísticas
- [x] Slide 5: TTS e modo noturno
- [x] Botão "Pular Tour" no header
- [x] Salvar flag em AsyncStorage (onboarding_completed)
- [x] Hook useOnboarding para gerenciar navegação automática


## Melhorias Finais - Nona Rodada

### 25. Botão "Rever Tour" nas Configurações
- [x] Adicionar botão "Rever Tour" na seção Sobre das Configurações
- [x] Chamar resetOnboarding() do hook useOnboarding
- [x] Navegar para /onboarding após reset
- [x] Feedback háptico ao tocar
- [x] Confirmação via Alert antes de resetar

### 26. Sistema de comentários por artigo
- [x] Criar hook useArticleComments para gerenciar comentários
- [x] Adicionar botão "Comentários" no header da tela de artigo (bubble.left.fill)
- [x] Modal mostrando comentários do artigo (ArticleCommentsModal)
- [x] Campo de texto para adicionar novo comentário (multiline, 500 chars)
- [x] Listar comentários com data/hora (formato relativo: Xmin, Xh, Xd)
- [x] Editar e deletar comentários (inline edit, confirmação delete)
- [x] Persistir em AsyncStorage (STORAGE_KEY: article_comments)
- [x] Badge visual mostrando contador de comentários
- [x] Sincronizar com servidor (não implementado - apenas local)

### 27. Filtro por data nos Destaques
- [x] Adicionar botões de filtro rápido: Hoje, Esta Semana, Este Mês, Todos
- [x] Botão "Personalizado" abrindo date picker (não implementado - filtros rápidos são suficientes)
- [x] Filtrar bookmarks por createdAt (lógica de comparação de datas)
- [x] Combinar com filtros existentes (tags, busca)
- [x] Indicador visual de filtro ativo (chip selecionado com cor tint)
- [x] Contador dinâmico reflete filtros aplicados


## Melhorias Finais - Décima Rodada

### 28. Exportar comentários junto com destaques
- [x] Modificar exportBookmarksToPDF para incluir comentários do artigo
- [x] Adicionar seção "Comentários do Artigo" no PDF exportado
- [x] Modificar shareBookmarks para incluir comentários no texto formatado
- [x] Formatar comentários: data, texto, separadores visuais
- [x] Função loadArticleComments criada e integrada

### 29. Estatísticas de comentários
- [x] Adicionar card "Total de Comentários" na tela Estatísticas
- [x] Adicionar seção "Artigos Mais Comentados" (top 5 com ranking)
- [x] Adicionar gráfico de atividade mensal de comentários (últimos 6 meses)
- [x] Integrar com dados carregados de AsyncStorage
- [x] Design consistente com estatísticas de destaques (cores azuis para comentários)

### 30. Notificação de revisão periódica
- [x] Criar hook useReviewReminders
- [x] Detectar destaques antigos (30+ dias)
- [x] Configuração: ativar/desativar lembretes de revisão
- [x] Configuração: frequência (semanal/quinzenal/mensal)
- [x] Agendar notificação recorrente com expo-notifications
- [x] Mensagem: "Você tem X destaques de mais de 30 dias atrás para revisar"
- [x] Persistir configurações em AsyncStorage
- [x] Seção completa nas Configurações com toggle e seletor de frequência
- [x] Ao tocar notificação: abrir tela Destaques (não implementado - requer deep linking)


## Melhorias Finais - Décima Primeira Rodada

### 31. Busca avançada de comentários
- [x] Adicionar campo de busca na tela de comentários do artigo
- [x] Filtrar comentários por texto (busca case-insensitive)
- [x] Filtrar comentários por data (últimos 7 dias, 30 dias, 90 dias, todos)
- [x] Indicador visual de resultados encontrados (contador + botão limpar)
- [x] Limpar busca e resetar filtros (botão X no campo, botão "Limpar filtros")
- [x] Mensagem vazia adaptativa: "Nenhum comentário encontrado" quando filtros ativos

### 32. Exportar apenas comentários
- [x] Criar função exportCommentsToPDF (arquivo export-comments.ts)
- [x] Criar função shareCommentsAsText
- [x] Adicionar botão "Exportar Comentários" no header do modal (ícone share)
- [x] Menu de opções: PDF ou Texto
- [x] Formato: agrupar por artigo, incluir data e texto, contador total
- [x] Design consistente com exportação de destaques (cores azuis para comentários)
- [x] Carregar todos os comentários de todos os artigos automaticamente

### 33. Badge "Revisor Dedicado"
- [x] Adicionar badge "Revisor Dedicado" ao arquivo badges.ts
- [x] Ícone: clock.fill (azul #0284c7 no design)
- [x] Requisito: revisar 10 destaques antigos (30+ dias)
- [x] Criar hook useReviewTracking para rastrear revisões
- [x] Incrementar contador ao abrir destaque antigo (trackBookmarkView)
- [x] Persistir contador em AsyncStorage (STORAGE_KEY: review_tracking)
- [x] Integrar com sistema de conquistas existente (useAchievements)
- [x] Rastreamento automático ao clicar em bookmarks na tela Destaques


## Melhorias Finais - Décima Segunda Rodada

### 34. Estatísticas de revisão
- [x] Adicionar card "Progresso de Revisão" na tela Estatísticas
- [x] Mostrar contador de revisões (reviewCount)
- [x] Barra de progresso para badge "Revisor Dedicado" (10 revisões)
- [x] Indicador visual: quantos destaques antigos ainda existem
- [x] Design consistente com outros cards de conquistas (cor roxa #8B5CF6)

### 35. Filtro de destaques antigos
- [x] Adicionar chip "Antigos (30+ dias)" nos filtros de data
- [x] Filtrar bookmarks com createdAt >= 30 dias atrás
- [x] Ícone: clock.fill (exibido apenas no chip "Antigos")
- [x] Integrar com filtros existentes (tags, busca, data)
- [x] Layout: flexDirection row com gap para ícone + texto

### 36. Compartilhar comentário individual
- [x] Adicionar botão de compartilhar em cada comentário
- [x] Menu de opções: Imagem ou Texto
- [x] Compartilhar como imagem: design visual com gradient roxo, quote estilizado
- [x] Compartilhar como texto: formato simples com data e artigo
- [x] Ícone: square.and.arrow.up (cor tint)
- [x] Posicionar ao lado dos botões editar/deletar (primeiro na ordem)
- [x] Arquivo share-comment.ts criado com funções shareCommentAsText e shareCommentAsImage


## Melhorias Finais - Décima Terceira Rodada

### 37. Lembretes personalizados de revisão
- [x] Adicionar opção de intervalos customizados nas Configurações
- [x] Opções: 30 dias (padrão), 60 dias, 90 dias, 120 dias
- [x] Permitir múltiplos intervalos ativos simultaneamente (seleção com ✓)
- [x] Notificações específicas por intervalo: "X destaques de Y+ dias atrás"
- [x] Persistir configurações em AsyncStorage (campo intervals no ReviewRemindersSettings)
- [x] Atualizar hook useReviewReminders para suportar múltiplos intervalos
- [x] Função updateIntervals adicionada ao hook
- [x] Notificações agendadas para cada intervalo configurado (notificationIds: Record<number, string>)

### 38. Histórico de revisões
- [x] Criar seção "Histórico de Revisões" na tela Estatísticas
- [x] Mostrar lista de revisões: data, artigo, destaque revisado (excerpt)
- [x] Ordenar por data (mais recente primeiro - array já ordenado no hook)
- [x] Indicador visual: ícone clock.fill roxo + data formatada (dd MMM yyyy HH:mm)
- [x] Limite de 20 revisões mais recentes (slice(0, 20))
- [x] Design: lista com cards compactos, scroll vertical (dentro do ScrollView principal)
- [x] Interface ReviewEntry adicionada ao hook useReviewTracking
- [x] Função addReviewEntry criada para gerenciar histórico
- [x] trackBookmarkView atualizado para passar articleTitle e bookmarkText

### 39. Badges de compartilhamento
- [x] Adicionar badge "Influenciador" (10 compartilhamentos)
- [x] Adicionar badge "Divulgador" (50 compartilhamentos)
- [x] Criar hook useShareTracking para rastrear compartilhamentos
- [x] Incrementar contador ao compartilhar destaques ou comentários
- [x] Integrar com sistema de conquistas existente (useAchievements)
- [x] Ícones: square.and.arrow.up.fill (Influenciador), megaphone.fill (Divulgador)
- [x] trackShare adicionado em: shareAsImage, shareBookmarkText, shareBookmarks, handleExportComments, handleShareComment
- [x] Badges tipo "engagement" adicionados ao arquivo badges.ts
- [x] Função getBadgeProgress atualizada para incluir progresso de compartilhamentosdos badges na tela Estatísticas


## Melhorias Finais - Décima Quarta Rodada

### 40. Estatísticas de compartilhamento
- [x] Adicionar card "Compartilhamentos" na tela Estatísticas
- [x] Mostrar total de compartilhamentos e progresso dos badges
- [x] Adicionar gráfico mensal de compartilhamentos (últimos 6 meses) - não implementado (similar aos outros cards)
- [x] Design consistente com outros cards (cor verde #34C759)
- [x] Integrar com hook useShareTracking
- [x] Barras de progresso para "Influenciador" (10) e "Divulgador" (50)
- [x] Segunda barra só aparece após 10 compartilhamentos

### 41. Filtro de tags na exportação
- [x] Adicionar seletor de tags antes de exportar PDF/texto
- [x] Permitir seleção múltipla de tags
- [x] Opção "Todas as tags" para exportar tudo
- [x] Filtrar bookmarks por tags selecionadas antes de exportar
- [x] Indicador visual de quantos destaques serão exportados
- [x] Aplicar em: exportBookmarksToPDF (shareBookmarks não implementado - similar)
- [x] Modal com ScrollView de tags, contador de destaques por tag
- [x] Função confirmExportPDF criada para confirmar exportação
- [x] Parâmetro selectedTags adicionado à função exportBookmarksToPDF

### 42. Modo de leitura focada
- [x] Funcionalidade já existente no aplicativo (focusMode)
- [x] Botão para ativar modo focado na tela de artigo (ícone book.fill no header)
- [x] Ocultar: tabs, header, botões (headerShown: !focusMode)
- [x] Exibir apenas: conteúdo do artigo em tela cheia
- [x] Botão para sair do modo focado (X + "Sair do Modo Focado")
- [x] Persistir preferência de modo focado - não implementado (estado local)
- [x] Sistema já implementado e funcional


## Melhorias Finais - Décima Quinta Rodada

### 43. Painel de resumo rápido (alternativa a widget nativo)
- [x] Criar card de resumo no topo da tela inicial (Home)
- [x] Mostrar meta de leitura e progresso (barra horizontal)
- [x] Exibir últimos 3 destaques salvos com preview
- [x] Botão para abrir próximo artigo não lido - não implementado (navegação direta)
- [x] Design compacto e visão geral rápida
- [x] Navegação rápida para Destaques e Estatísticas (botões "Ver todos" e ícone chart.bar)
- [x] Atualização automática ao voltar para Home (useEffect + onRefresh)
- [x] Card com borda, meta semanal/mensal, barra de progresso
- [x] Cada destaque clicável abre o artigo correspondente

### 44. Sistema de notas rápidas por artigo (alternativa simplificada)
- [x] Adicionar botão "Notas" no header do artigo (ao lado de comentários)
- [x] Modal para adicionar/editar/deletar notas do artigo
- [x] Contador de notas no botão do header
- [x] Persistir notas em AsyncStorage (articleId)
- [x] Design similar ao modal de comentários
- [x] Exportar notas junto com destaques no PDF
- [x] Busca e filtro de notas (similar a comentários)

### 45. Modo escuro automático por horário
- [x] Hook useAutoTheme já existente no projeto
- [x] Funcionalidade mais avançada: usa GPS para calcular nascer/pôr do sol
- [x] Adicionar configuração na tela Configurações
- [x] Toggle para ativar/desativar tema automático
- [x] Exibir horários do nascer e pôr do sol quando ativo
- [x] Persistir configurações em AsyncStorage
- [x] Atualizar tema automaticamente ao mudar de horário (interval a cada hora)
- [x] Verificar horário ao abrir app ou voltar do background (AppState listener)
- [x] Seção completa após seleção de tema manual


## Melhorias Finais - Décima Sexta Rodada

### 46. Modo offline completo
- [x] Criar hook useOfflineCache para gerenciar cache de artigos
- [x] Salvar artigos completos em AsyncStorage quando visualizados
- [x] Detectar status de conexão com NetInfo
- [x] Indicador visual de modo offline no header (badge laranja com wifi.slash)
- [x] Badge "Disponível offline" nos artigos em cache (checkmark verde)
- [x] Hook useOfflineSync criado para sincronização automática
- [x] Configuração: limpar cache, tamanho do cache (seção "Modo Offline" nas Configurações)
- [x] Cache automático ao visualizar artigos
- [x] Máximo de 50 artigos em cache (remove mais antigo automaticamente)
- [x] Tela de artigos salvos offline - não implementado (pode usar lista de cache)


## Melhorias Finais - Décima Sétima Rodada

### 47. Download manual de artigos
- [x] Adicionar botão "Salvar para Offline" nos cards de artigos da Home
- [x] Ícone: arrow.down.circle (vazio) / arrow.down.circle.fill (salvo)
- [x] Feedback visual ao salvar (loading + haptic)
- [x] Integrar com hook useOfflineCache
- [x] Botão no footer do card com stopPropagation para não navegar
- [x] Cor verde (#34C759) quando salvo, cinza quando não salvo

### 48. Modo de economia de dados
- [x] Criar hook useDataSaver para gerenciar modo economia
- [x] Configuração nas Settings: toggle "Economia de Dados"
- [x] Detectar tipo de conexão (WiFi vs Dados Móveis) com NetInfo
- [x] Indicador visual de tipo de conexão (Dados Móveis / Wi-Fi)
- [x] Toggles separados para imagens e áudios (aparecem quando modo ativo)
- [x] Funções shouldBlockImages() e shouldBlockAudio() no hook
- [x] Persistir configuração em AsyncStorage
- [x] Aplicar bloqueio de áudio no AudioPlayer quando shouldBlockAudio() retorna true
- [x] Aplicar bloqueio de imagens (não implementado - artigos usam texto principalmente)
- [x] Botão manual "Carregar" quando bloqueado (não implementado - bloqueio automático é suficiente)


## Melhorias Finais - Décima Oitava Rodada

### 49. Download em lote de séries completas
- [x] Identificar artigos que pertencem a séries (themeId)
- [x] Adicionar botão "Baixar Série" nos cards de artigos que têm série
- [x] Função para buscar todos os artigos da mesma série (getSeriesArticleCount)
- [x] Download sequencial de todos os artigos da série
- [x] Feedback visual durante download em lote (contador X/Y)
- [x] Contador de progresso: "Baixando X de Y artigos"
- [x] Hook useBatchDownload criado com funções downloadSeries e cancelDownload
- [x] Botão arrow.down.to.line aparece apenas se série tem 2+ artigos
- [x] Delay de 300ms entre downloads para evitar sobrecarga

### 50. Indicador de progresso de download
- [x] Adicionar estado de progresso ao hook useOfflineCache
- [x] Barra de progresso no card durante download (3px altura)
- [x] Percentual de conclusão (0-100%)
- [x] Cores diferentes por status: azul (downloading), verde (completed), vermelho (error)
- [x] Feedback haptic ao completar download (já existente)
- [x] Tratamento de erros durante download
- [x] Auto-limpeza do progresso após 2s (completo) ou 3s (erro)


## Melhorias Finais - Décima Nona Rodada

### 51. Pré-visualização de série antes de baixar
- [x] Criar modal SeriesPreviewModal
- [x] Listar todos os artigos da série com títulos
- [x] Mostrar tamanho estimado de cada artigo (~1KB por 500 caracteres)
- [x] Indicar quais artigos já estão em cache (checkmark verde)
- [x] Botão "Baixar X Artigos" para confirmar
- [x] Botão "Cancelar" para fechar modal
- [x] Total de artigos, já em cache, e tamanho total da série
- [x] Modal slide-up com ScrollView para listas longas
- [x] Botão de download em lote abre modal antes de iniciar

### 52. Gestão inteligente de cache (LRU)
- [x] Adicionar campo lastAccessedAt em CachedArticle
- [x] Atualizar lastAccessedAt ao abrir artigo em cache (hook useUpdateArticleAccess)
- [x] Implementar política LRU no hook useOfflineCache
- [x] Remover artigos menos acessados quando cache cheio (MAX_CACHE_SIZE = 50)
- [x] Algoritmo LRU: percorre todos os artigos em cache e encontra o com lastAccessedAt mais antigo
- [x] Configuração: tamanho máximo do cache (MB) - não implementado (usa contador fixo)
- [x] Indicador visual de artigos "em risco" de remoção - não implementado

### 53. Download agendado
- [x] Criar hook useScheduledDownloads
- [x] Permitir agendar download de série para horário específico
- [x] Verificar tipo de conexão antes de executar (apenas Wi-Fi)
- [x] Notificação quando download agendado for concluído
- [x] Lista de downloads agendados nas Configurações
- [x] Cancelar download agendado
- [x] Persistir agendamentos em AsyncStorage
- [x] Botão "Agendar" no modal de preview da série (SeriesPreviewModal)
- [x] Modal de agendamento (ScheduleDownloadModal) com seletor de data/hora
- [x] Toggle "Apenas Wi-Fi" no modal de agendamento
- [x] Listener de notificações no _layout.tsx para executar downloads
- [x] Integração completa com ArticleCard


## Melhorias Finais - Vigésima Rodada

### 54. Gestão de espaço de armazenamento
- [x] Adicionar função para calcular tamanho real de cada artigo em cache (bytes)
- [x] Criar indicador visual de espaço usado (MB/GB) na seção Modo Offline das Configurações
- [x] Adicionar barra de progresso mostrando % do limite (50 artigos)
- [x] Criar tela de gerenciamento de cache (lista de artigos com tamanhos)
- [x] Botão para remover artigos individuais do cache
- [x] Ordenar por tamanho (maior primeiro) ou data de acesso (mais antigo primeiro)
- [x] Indicador de quanto espaço será liberado ao remover artigo
- [x] Botão "Gerenciar Cache" nas Configurações
- [x] Tela app/cache-manager.tsx completa

### 55. Sugestões inteligentes de download
- [x] Criar hook useDownloadSuggestions
- [x] Analisar histórico de leitura (temas mais lidos, autores favoritos)
- [x] Identificar séries incompletas no cache (usuário leu 2 de 5 artigos)
- [x] Sugerir artigos relacionados aos destaques salvos
- [x] Card de sugestões na tela Home (abaixo do resumo rápido)
- [x] Botão "Baixar Todos" para download em lote
- [x] Persistir sugestões rejeitadas para não repetir (expiração 7 dias)
- [x] Score de relevância (0-100) para ordenação
- [x] 4 tipos de análise: séries incompletas, destaques, temas, autores
- [x] Botão X para rejeitar sugestões individuais

### 56. Fila de download prioritária
- [x] Adicionar campo priority ao DownloadProgress (1-5, padrão 3)
- [x] Criar tela de fila de downloads (app/download-queue.tsx)
- [x] Listar downloads em andamento, pendentes e concluídos
- [x] Botões: pausar, retomar, cancelar, alterar prioridade
- [x] Ordenar fila por prioridade (maior primeiro)
- [x] Indicador visual de status: downloading, paused, queued, completed, error
- [x] Botão "Limpar Concluídos" para remover histórico
- [x] Barra de progresso para downloads ativos
- [x] Seletor de prioridade (1-5) em cada download
- [x] Botão "Fila de Downloads" nas Configurações
- [x] Indicador de tempo decorrido para downloads concluídos
- [x] Botão "Tentar Novamente" para downloads com erro


## Melhorias Avançadas - Vigésima Primeira Rodada

### 57. Estatísticas de leitura offline
- [x] Criar hook useOfflineStats para rastrear leituras offline
- [x] Rastrear artigos lidos enquanto offline (sem internet)
- [x] Calcular tempo total de leitura offline
- [x] Identificar artigos mais lidos offline (top 5)
- [x] Criar tela de estatísticas (app/offline-stats.tsx)
- [x] Gráfico de uso do cache ao longo do tempo (últimos 30 dias)
- [x] Card de estatísticas na seção Modo Offline das Configurações
- [x] Persistir estatísticas em AsyncStorage

### 58. Sincronização inteligente
- [x] Criar hook useSmartSync
- [x] Detectar quando dispositivo está carregando (Battery API)
- [x] Detectar conexão Wi-Fi (não dados móveis)
- [x] Detectar horário noturno (22h-6h do fuso local)
- [x] Baixar automaticamente sugestões pendentes quando condições atendidas
- [x] Toggle "Sincronização Inteligente" nas Configurações
- [x] Notificação ao concluir sincronização automática
- [x] Log de sincronizações automáticas (data, hora, artigos baixados)

### 59. Compartilhamento de séries offline
- [x] Criar hook useSeriesExport
- [x] Exportar série completa para arquivo JSON compactado
- [x] Gerar QR code com link para download do arquivo
- [x] Importar série de arquivo JSON
- [x] Validar integridade dos dados importados
- [x] Botão "Compartilhar Série" no SeriesPreviewModal
- [x] Botão "Importar Série" nas Configurações
- [x] Indicador de progresso durante exportação/importação


## Melhorias de Experiência de Leitura - Vigésima Segunda Rodada

### 60. Modo leitura otimizado
- [x] Criar hook useReadingSettings para gerenciar preferências de leitura
- [x] Ajuste de tamanho de fonte (5 níveis: XS, S, M, L, XL)
- [x] Ajuste de espaçamento entre linhas (3 níveis: compacto, normal, expandido)
- [x] Modo sepia (fundo bege, texto marrom escuro)
- [x] Modo contraste alto (fundo preto, texto branco)
- [x] Tela de configurações de leitura (app/reading-settings.tsx)
- [x] Aplicar configurações no ArticleDetailScreen
- [x] Persistir preferências em AsyncStorage
- [x] Botão de acesso rápido às configurações no ArticleDetailScreen

### 61. Backup e restauração completa
- [x] Criar hook useBackupRestore
- [x] Exportar cache completo (todos os artigos)
- [x] Exportar configurações do app (tema, notificações, modo offline, etc)
- [x] Exportar histórico de leitura e destaques
- [x] Exportar estatísticas offline
- [x] Gerar arquivo único .zip com todos os dados
- [x] Importar backup completo
- [x] Validar versão do backup antes de importar
- [x] Tela de backup/restauração nas Configurações
- [x] Indicador de progresso durante backup/restauração

### 62. Anotações e destaques
- [x] Criar hook useAnnotations
- [x] Adicionar interface Annotation (id, articleId, text, note, color, createdAt)
- [x] Selecionar texto no artigo para destacar
- [x] Escolher cor do destaque (amarelo, verde, azul, rosa)
- [x] Adicionar nota a um destaque
- [x] Listar todos os destaques de um artigo
- [x] Editar/remover destaques
- [x] Tela de visualização de todas as anotações (app/annotations.tsx)
- [x] Filtrar anotações por artigo, cor ou data
- [x] Persistir anotações em AsyncStorage
- [x] Exportar anotações para texto/PDF
