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
