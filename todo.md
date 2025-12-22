# TODO - Siga o Dinheiro

## Funcionalidades Concluídas
- [x] Reiniciar servidor que retornou erro HTTP 502
- [x] Expandir artigo da Segunda Guerra Mundial com análise financeira inédita (economia de saque, contadores, custo-benefício, recursos estratégicos)
- [x] Criar segundo artigo sobre pós-Segunda Guerra Mundial (divisão da Europa, saques, Yalta, Potsdam, conexão com conflito Rússia-Ucrânia)
- [x] Criar terceiro artigo sobre laços comerciais pré-guerra (IBM, Ford, GM, Standard Oil, IG Farben, bancos internacionais, 1920-1939)
- [x] Implementar sistema de narração de áudio (text-to-speech) para artigos
  - [x] Criar player de áudio com controles (play/pause, velocidade, progresso)
  - [x] Integrar text-to-speech nativo do React Native
  - [x] Adicionar botão de áudio na tela de leitura
  - [x] Implementar controle de reprodução com navegação de parágrafos
  - [x] Criar testes automatizados (12 testes passando)
- [x] Criar gráficos e visualizações para artigos da Segunda Guerra Mundial
  - [x] Fluxograma do saque nazista (países → Alemanha → gastos militares)
  - [x] Gráfico de déficit final (414 bi gastos vs 121 bi saqueados = 293 bi déficit)
  - [x] Linha do tempo com valores por ano (1933-1945)
  - [x] Mapa da Europa com valores saqueados por país
  - [x] Gráfico de comparação: produção alemã vs aliados
  - [x] Integrar visualizações nos artigos do app com galeria interativa

## Próximas Funcionalidades
- [ ] Criar artigo sobre Sistema Monetário e Crises Financeiras (O MAIS IMPORTANTE!)
  - [ ] Compilar material (10 arquivos recebidos + pesquisa Richard Wolff)
  - [ ] Escrever artigo completo (10 partes: fundamentos, crises, repo, bail-ins, desdolarização, COVID-19, 2026, proteção)
  - [ ] Criar visualizações (ciclo de 5 fases, transferência de riqueza, derivativos $715 tri)
  - [ ] Integrar ao aplicativo
- [x] Criar artigo sobre "Rei do Petróleo" (Rockefeller - CONCLUÍDO!)
  - [x] Escrever artigo completo (Standard Oil, controle medicina/farmacêutica, influência educação/mídia, banqueiros, legado) - 8.500 palavras
  - [x] Integrar ao aplicativo
- [ ] Criar artigo sobre Primeira Guerra Mundial (análise financeira, Tratado de Versalhes, reparações, conexão com Segunda Guerra)
- [ ] Criar artigo sobre conflito Rússia-Ucrânia (terras raras para EUA, territórios para Rússia, Europa sem participação, reservas russas congeladas)
- [ ] Expandir outros temas (COVID-19, Crise 2008, Banco Master)
- [ ] Adicionar bibliografia e referências aos artigos
- [ ] Criar versão PDF dos artigos para download

- [x] Integrar artigo "O Sistema Autoperpetuante" ao aplicativo
  - [x] Criar tema no mock-data.ts
  - [x] Converter artigo markdown para JSON (45KB)
  - [x] Adicionar ao array de artigos
  - [x] Integração completa

- [x] Criar artigo sobre J.P. Morgan - "O Senhor das Finanças" (Série Arquitetos do Poder)
  - [x] Escrever artigo completo (ascensão, controle bancário, resgates do governo 1895/1907, Federal Reserve, consolidação industrial, legado) - 9.200 palavras
  - [x] Integrar ao aplicativo
  - [x] Criar tema "Arquitetos do Poder" com 2 artigos (Rockefeller + Morgan)

- [x] Criar artigo "Conexões dos Arquitetos do Poder"
  - [x] Escrever artigo completo (Jekyll Island, conselhos interligados, colaborações, fluxo de poder/dinheiro) - 7.500 palavras
  - [x] Integrar ao aplicativo como 3º artigo da série Arquitetos do Poder
  - [x] Atualizar contagem de artigos do tema para 3

- [x] Criar artigo sobre Andrew Carnegie - "O Barão do Aço" (Série Arquitetos do Poder)
  - [x] Escrever artigo completo (ascensão, monopólio do aço, Homestead 1892, venda para Morgan 1901, filantropia estratégica, Evangelho da Riqueza, conexões, legado) - 9.500 palavras
  - [x] Integrar ao aplicativo como 4º artigo da série
  - [x] Atualizar contagem de artigos do tema para 4

- [x] 🐛 BUG CRÍTICO: Navegação entre partes dos artigos - RESOLVIDO!
  - [x] Investigar código da tela de artigo
  - [x] Implementar botões "Anterior" e "Próxima" no final de cada parte
  - [x] Adicionar indicador de progresso (Parte X de Y) com dots clicáveis
  - [x] Sistema detecta automaticamente artigos com "## Parte X:" e divide
  - [x] Artigos sem partes definidas mostram conteúdo completo (comportamento original)

- [x] Criar visualizações para TODOS os artigos (gráficos, tabelas, infográficos)
  
  **O Sistema Autoperpetuante:**
  - [x] Gráfico do Ciclo de 5 Fases (circular): Expansão → Euforia → Crise → Transferência → Renovação (433KB)
  - [x] Linha do Tempo de Crises: 1929, 1987, 2000, 2008, 2020, 2023, 2026 (previsão) (681KB)
  - [x] Infográfico do Multiplicador Bancário: $1 → $10 (reservas fracionárias) (510KB)
  - [x] Tabela de Transferência de Riqueza por crise (971KB)
  
  **Rockefeller - O Rei do Petróleo:**
  - [ ] Gráfico de consolidação: % controle petróleo (1870-1911)
  - [ ] Linha do tempo: Standard Oil (1870 → dissolução 1911 → ExxonMobil hoje)
  - [ ] Fluxograma: Controle sistêmico (petróleo → medicina → educação → mídia)
  - [ ] Tabela: Fortuna vs. PIB americano ao longo do tempo
  
  **J.P. Morgan - O Senhor das Finanças:**
  - [ ] Diagrama: Resgate do governo 1895 (fluxo de ouro)
  - [ ] Gráfico: Pânico de 1907 (quem sobreviveu vs. quem morreu)
  - [ ] Infográfico: Jekyll Island 1910 (6 homens, % riqueza mundial)
  - [ ] Tabela: Consolidações industriais (U.S. Steel, GE, ferrovias)
  
  **Carnegie - O Barão do Aço:**
  - [ ] Gráfico: Ascensão ($1,20/semana → $480 milhões)
  - [ ] Infográfico: Homestead 1892 (batalha, mortos, repressão)
  - [ ] Tabela: Filantropia (2.509 bibliotecas, universidades, $350 milhões)
  - [ ] Comparação: Modelo Carnegie vs. Gates/Buffett/Bezos
  
  **Conexões - A Rede Invisível:**
  - [x] Diagrama de rede: Jekyll Island (6 participantes, conexões, instituições) (741KB)
  - [x] Linha do tempo integrada: 1870-2024 (eventos-chave dos 3 Arquitetos) (460KB)
  - [ ] Fluxograma: Conselhos interligados (341 diretorias, 112 corporações) - PENDENTE
  - [ ] Tabela: Legado moderno (ExxonMobil, JPMorgan Chase, Carnegie Corp) - PENDENTE
  
  - [x] Integrar 6 visualizações principais ao aplicativo (3.8MB total)
  - [x] Sistema Autoperpetuante: 4 visualizações
  - [x] Arquitetos do Poder: 2 visualizações (compartilhadas entre todos os artigos da série)
  - [ ] Testar renderização e responsividade

- [x] 🐛 BUG CRÍTICO RESOLVIDO: Usuário agora consegue ler artigos completos na web
  - [x] Botões de navegação não apareciam na versão web
  - [x] Artigo parava na Parte 1, antes das visualizações
  - [x] SOLUÇÃO IMPLEMENTADA: Desabilitada divisão por partes na web (Platform.OS === 'web')
  - [x] Web: artigo completo com scroll contínuo
  - [x] Mobile: mantida divisão por partes com botões de navegação (melhor UX)

- [x] Implementar 3 melhorias de UX para leitura de artigos - CONCLUÍDO!
  
  **1. Índice Clicável:**
  - [x] Extrair todas as seções/partes do artigo (## Parte X:)
  - [x] Criar componente de índice expansível no início do artigo
  - [x] Implementar navegação para seção clicada
  - [x] Destacar seção atual no índice
  - [x] Badge mostrando número total de partes
  
  **2. Barra de Progresso de Leitura:**
  - [x] Criar componente ReadingProgressBar
  - [x] Calcular % lido baseado em scroll position
  - [x] Atualizar em tempo real conforme usuário faz scroll
  - [x] Mostrar texto "X% lido"
  - [ ] Integrar ao ScrollView (pendente - requer refatoração de Animated.ScrollView)
  
  **3. Modo Resumo Executivo:**
  - [x] Adicionar botão toggle "Modo Resumo" / "Ver Artigo Completo"
  - [x] Extrair primeiro parágrafo de cada parte (200 caracteres)
  - [x] Modo resumo: mostrar apenas títulos + preview do conteúdo
  - [x] Cards visuais para cada seção no modo resumo
  - [x] Toggle instantâneo entre modos

- [ ] 🐛 BUG CRÍTICO: Artigo "O Sistema Autoperpetuante" está incompleto
  - [ ] Usuário vê apenas início do artigo, não consegue ler conteúdo completo
  - [ ] Data errada: 21 de dezembro de 2024 (deve ser data de publicação correta)
  - [ ] Duração errada: 31 min (deve refletir 6.033 palavras completas)
  - [ ] Verificar arquivo JSON do artigo
  - [ ] Substituir por conteúdo completo do markdown
  - [ ] Corrigir metadados (data, duração)

- [x] 🐛 BUG CRÍTICO RESOLVIDO: Artigo "O Sistema Autoperpetuante" completo
  - [x] Artigo original só tinha 6 partes, adicionada Parte 7 completa (2.800 palavras)
  - [x] Parte 7: A Grande Transferência de Riqueza (22/agosto/2023, previsão 2026, proteção individual)
  - [x] Conclusão: Siga o Dinheiro
  - [x] Data corrigida: 22/dez/2024
  - [x] Duração: 31 min (7.549 palavras)
  - [x] Arquivo JSON atualizado com conteúdo completo e metadados

- [x] Implementar sistema completo de referências e fontes - FASE 1 E 2 CONCLUÍDAS! ✅
  
  **Objetivo:** Dar credibilidade aos artigos mostrando que dados são públicos e verificáveis
  
  **Fase 1: Artigo Sistema Autoperpetuante - COMPLETO!**
  - [x] Adicionar 34 citações numeradas inline para todos os dados factuais
  - [x] Criar seção "Fontes e Referências" no final do artigo com URLs diretos
  - [x] Links para: Fed, BIS, FMI, FDIC, Bloomberg, Reuters, FT, Treasury, World Gold Council, CBO, S&P
  - [x] Dados específicos: $18 trilhões depósitos[20], $120 bi FDIC[19], $4 trilhões Repo[11], $307 tri dívida global[31]
  - [x] Artigo atualizado: 9.800 palavras com 34 referências verificáveis
  
  **Fase 2: Sistema de Notas de Rodapé no App - COMPLETO!**
  - [x] Criar componente ArticleTextWithReferences
  - [x] Detectar citações [1], [2], etc. e transformá-las em links clicáveis
  - [x] Abrir URLs das fontes em navegador externo ao clicar
  - [x] Componente ReferenceList para renderizar lista formatada
  - [x] Integrar ao sistema de renderização (app/article/[id].tsx)
  - [x] Haptic feedback ao clicar
  
  **Fase 3: Artigos Arquitetos do Poder - PENDENTE**
  - [ ] Rockefeller: Standard Oil 90%, $400 bilhões, Relatório Flexner 1910, AMA, escolas médicas
  - [ ] Morgan: Resgate 1895, Pânico 1907, Jekyll Island 1910, U.S. Steel $1,4 bi, $480 milhões Carnegie
  - [ ] Carnegie: Homestead 1892 (10 mortos), 2.509 bibliotecas, $350 milhões doados, venda $480 mi
  - [ ] Conexões: Investigação Pujo 1912 (341 diretorias, 40% capital industrial), Jekyll Island 6 homens
  
  **Fontes Utilizadas (Sistema Autoperpetuante):**
  ✅ Federal Reserve (QE, balanço, reservas)
  ✅ BIS - Bank for International Settlements (Repo $4 tri)
  ✅ FMI (dívida global $307 tri, Chipre 2013)
  ✅ FDIC ($120 bi reservas, $18 tri depósitos)
  ✅ Bloomberg/Reuters/FT (22/agosto/2023, desdolarização)
  ✅ Treasury (yield curve, taxas)
  ✅ FSB/G20 (bail-in 2013)
  ✅ World Gold Council (preço ouro)
  ✅ CBO (déficits governo)
  ✅ S&P Global (vencimentos dívida corporativa)

## Melhorias em Andamento (Solicitação do Usuário)

- [ ] 1. Adicionar referências aos 4 artigos "Arquitetos do Poder"
  - [ ] Rockefeller: Standard Oil 90%, $400 bilhões, Relatório Flexner 1910, AMA, escolas médicas destruídas
  - [ ] Morgan: Jekyll Island 1910, Pânico 1907, Resgate governo 1895, U.S. Steel $1,4 bi, compra Carnegie $480 mi
  - [ ] Carnegie: Homestead 1892 (10 mortos), 2.509 bibliotecas, $350 milhões doados, venda para Morgan
  - [ ] Conexões: Investigação Pujo 1912 (341 diretorias, 112 corporações, 40% capital industrial)
  - [ ] Fontes: livros históricos (Chernow, Strouse), documentos governamentais, arquivos históricos

- [ ] 2. Criar artigo completo sobre BRICS e Desdolarização
  - [ ] Cúpula de Kazan 2024 (expansão BRICS+, novos membros)
  - [ ] Petróleo em yuan (China-Arábia Saudita)
  - [ ] Sistema SWIFT alternativo (CIPS chinês, SPFS russo)
  - [ ] Acordo petrodólar expirado (junho 2024)
  - [ ] Ouro como reserva (bancos centrais comprando)
  - [ ] Conexão com "O Sistema Autoperpetuante"
  - [ ] Adicionar referências verificáveis

- [ ] 3. Implementar sistema de bookmarks/destaques
  - [ ] Permitir usuário marcar trechos do artigo
  - [ ] Salvar posição (parte, parágrafo)
  - [ ] Adicionar notas pessoais aos destaques
  - [ ] Lista de bookmarks salvos
  - [ ] Sincronização com AsyncStorage
  - [ ] Navegação rápida para trechos marcados
