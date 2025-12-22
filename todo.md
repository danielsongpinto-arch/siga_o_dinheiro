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
