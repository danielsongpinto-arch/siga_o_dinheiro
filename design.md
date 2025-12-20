# Design do Aplicativo "Siga o Dinheiro"

## Conceito
Aplicativo móvel que analisa fatos históricos e atuais através da perspectiva financeira dos autores envolvidos. O objetivo é revelar os interesses financeiros por trás de eventos importantes, mostrando que cada ciclo tem início, meio e fim.

## Orientação e Usabilidade
- **Orientação**: Portrait (9:16) - uso com uma mão
- **Plataforma**: iOS-first design seguindo Apple Human Interface Guidelines
- **Navegação**: Bottom tabs para seções principais

## Paleta de Cores
- **Accent**: #D4AF37 (Dourado) - representa dinheiro e valor
- **Background Light**: #FFFFFF
- **Background Dark**: #0A0A0A
- **Text Primary**: #1A1A1A (light) / #FFFFFF (dark)
- **Text Secondary**: #666666 (light) / #999999 (dark)
- **Card Background**: #F8F8F8 (light) / #1C1C1C (dark)

## Tipografia
- **Title**: 28pt, Bold, lineHeight 36
- **Subtitle**: 20pt, SemiBold, lineHeight 26
- **Body**: 16pt, Regular, lineHeight 24
- **Caption**: 14pt, Regular, lineHeight 20

## Estrutura de Telas

### 1. Home (Início)
**Conteúdo:**
- Header com logo e título "Siga o Dinheiro"
- Seção de introdução explicando o conceito do app
- Card destacado: "Por que analisar fatos pela visão financeira?"
- Lista de artigos recentes (3-4 cards)
- Botão "Ver Todos os Artigos"

**Funcionalidade:**
- Scroll vertical
- Tap em card de artigo → navega para tela de Detalhes do Artigo
- Pull-to-refresh para atualizar conteúdo

### 2. Temas (Categorias)
**Conteúdo:**
- Lista de temas disponíveis (cards grandes)
- Cada card mostra: título do tema, breve descrição, número de artigos
- Temas iniciais:
  - Segunda Guerra Mundial
  - Fraude do Banco Master
  - COVID-19

**Funcionalidade:**
- Tap em tema → navega para tela de Lista de Artigos do Tema
- Visual: cards com imagem de fundo e overlay de texto

### 3. Detalhes do Artigo
**Conteúdo:**
- Título do artigo
- Data de publicação
- Conteúdo completo do artigo (texto formatado)
- Seção "Autores e Interesses Financeiros" destacada
- Seção "Ciclo Financeiro" (início, meio, fim)
- Botões de ação: Favoritar, Compartilhar
- Seção de comentários no final

**Funcionalidade:**
- Scroll vertical
- Botão de voltar no topo
- Botão de favoritar (coração) - toggle on/off
- Botão de compartilhar - abre sheet nativo
- Campo de comentário com botão "Enviar"
- Lista de comentários existentes

### 4. Favoritos
**Conteúdo:**
- Lista de artigos salvos pelo usuário
- Cada card mostra: título, tema, data
- Mensagem vazia: "Nenhum artigo favoritado ainda"

**Funcionalidade:**
- Tap em artigo → navega para Detalhes do Artigo
- Swipe left → opção de remover dos favoritos

### 5. Perfil
**Conteúdo:**
- Informações do usuário (nome, email)
- Estatísticas: artigos lidos, comentários feitos
- Botão "Sobre o App"
- Botão "Logout"

**Funcionalidade:**
- Botão "Sobre o App" → abre modal com explicação detalhada
- Botão "Logout" → desloga usuário

## Fluxos Principais

### Fluxo 1: Ler um Artigo
1. Usuário abre app → Home
2. Tap em card de artigo → Detalhes do Artigo
3. Lê conteúdo completo
4. Pode favoritar ou compartilhar

### Fluxo 2: Explorar por Tema
1. Usuário navega para tab "Temas"
2. Tap em tema específico → Lista de Artigos do Tema
3. Tap em artigo → Detalhes do Artigo

### Fluxo 3: Comentar
1. Usuário está em Detalhes do Artigo
2. Scroll até seção de comentários
3. Tap no campo de texto → teclado abre
4. Digita comentário
5. Tap "Enviar" → comentário é adicionado

### Fluxo 4: Gerenciar Favoritos
1. Usuário navega para tab "Favoritos"
2. Vê lista de artigos salvos
3. Tap em artigo → Detalhes do Artigo
4. Ou swipe left → Remove dos favoritos

## Componentes Customizados

### ArticleCard
- Card com título, tema, data, preview do conteúdo
- Ícone de favorito se estiver salvo
- Touch feedback com scale animation

### ThemeCard
- Card grande com imagem de fundo
- Overlay com gradiente
- Título e número de artigos

### CommentItem
- Avatar do usuário
- Nome e data
- Texto do comentário
- Estilo de chat bubble

## Espaçamento
- Padding lateral das telas: 16pt
- Espaçamento entre cards: 12pt
- Espaçamento entre seções: 24pt
- Radius de cards: 12pt
- Radius de botões: 8pt

## Ícones (SF Symbols → Material Icons)
- house.fill → home (Home)
- square.grid.2x2.fill → apps (Temas)
- heart.fill → favorite (Favoritos)
- person.fill → person (Perfil)
- heart → favorite_border (Favoritar)
- square.and.arrow.up → share (Compartilhar)
- bubble.left.fill → comment (Comentários)

## Animações
- Fade in ao carregar conteúdo
- Scale animation ao tocar em cards (0.95)
- Smooth scroll em listas
- Haptic feedback ao favoritar
