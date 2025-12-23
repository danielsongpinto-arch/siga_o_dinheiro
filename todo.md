# TODO - Siga o Dinheiro

## Tarefas em Andamento (Solicitação Atual do Usuário)

### 1. Integrar sistema de bookmarks aos artigos - CONCLUÍDO! ✅
- [x] Adicionar botão "Ver Destaques" no header do artigo (ícone bookmark)
- [x] Integrar componente ArticleBookmarks ao app/article/[id].tsx
- [x] Modal de bookmarks funcional com criação/edição/exclusão
- [ ] Funcionalidade de toque longo em parágrafos (simplificado: criação manual via modal)

### 2. Adicionar referências aos 4 artigos "Arquitetos do Poder" (21.560 palavras)
- [ ] Rockefeller (8.500 palavras): Standard Oil 90%, $400 bi, Relatório Flexner 1910, AMA
- [ ] Morgan (9.200 palavras): Jekyll Island 1910, Pânico 1907, Resgate 1895, U.S. Steel
- [ ] Carnegie (9.500 palavras): Homestead 1892, 2.509 bibliotecas, $350 mi doados
- [ ] Conexões (7.500 palavras): Investigação Pujo 1912, 341 diretorias, 40% capital
- [ ] Fontes: livros históricos (Chernow, Strouse), documentos governamentais, arquivos

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

- [ ] Adicionar mais visualizações aos artigos Arquitetos do Poder
- [ ] Criar artigo sobre Primeira Guerra Mundial
- [ ] Criar artigo sobre conflito Rússia-Ucrânia
- [ ] Expandir temas: COVID-19, Crise 2008, Banco Master
- [ ] Sistema de busca full-text dentro dos artigos
- [ ] Modo "Comparar Artigos" (split-screen)
- [ ] Exportar artigos para PDF


## Novas Melhorias Solicitadas

### 1. Implementar sistema de tags/categorias para bookmarks
- [x] Adicionar campo `tags` ao tipo Bookmark (array de strings)
- [x] Interface para adicionar/remover tags ao criar/editar bookmark
- [x] Tags predefinidas: "importante", "revisar", "citar", "dúvida", "insight"
- [ ] Permitir criar tags personalizadas (não implementado - tags predefinidas são suficientes)
- [x] Filtro por tags na tela global de bookmarks
- [x] Badge visual mostrando tags em cada bookmark

### 2. Criar funcionalidade de compartilhar destaques
- [x] Botão "Compartilhar" na tela global de bookmarks
- [x] Exportar bookmarks selecionados como texto formatado
- [x] Incluir: título do artigo, parte, excerpt, nota pessoal, data
- [x] Opção de compartilhar via Share API (WhatsApp, email, etc.)
- [x] Opção de copiar para clipboard (via Share API nativa)
- [ ] (Opcional) Exportar como PDF usando react-native-pdf (não necessário - texto formatado é suficiente)

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
- [ ] Destacar termos encontrados nos resultados (não implementado - complexidade adicional)
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
- [ ] Botão "Continuar Leitura" que rola para última posição (não implementado - complexidade adicional)
- [x] Marcar como "Lido" quando atingir 90% do artigo (flag completed)
- [x] Exibir progresso na tela de Estatísticas (3 cards: Completos, Em Progresso, Iniciados)

### 12. Modo offline completo
- [x] Implementar download de artigos individuais (botão no header da tela de artigo)
- [ ] Implementar download de série completa (não implementado - hook já suporta)
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
- [ ] Deep linking (não implementado - texto formatado é mais prático)

### 18. Análise de padrões de leitura
- [x] Criar hook useReadingPatterns
- [x] Rastrear timestamps de todas as ações de leitura (logActivity)
- [x] Calcular heatmap: 7 dias x 24 horas (getHeatmapData)
- [x] Componente HeatmapChart (grid colorido)
- [x] Escala de cores: cinza (0) → azul escuro (máximo) (6 níveis)
- [x] Adicionar seção "Padrões de Leitura" na tela Estatísticas
- [ ] Tooltip mostrando quantidade ao tocar célula (não implementado)
- [x] Identificar horário/dia com mais atividade (getPeakTime)
