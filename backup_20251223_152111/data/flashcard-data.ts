import { Flashcard } from "@/types/flashcard";

export const FLASHCARDS: Flashcard[] = [
  // Segunda Guerra Mundial
  {
    id: "fc1",
    articleId: "1",
    front: "Quem foram os principais autores financeiros da Segunda Guerra?",
    back: "Indústrias de armamentos, banqueiros internacionais e governos que financiaram o conflito",
    category: "autor",
  },
  {
    id: "fc2",
    articleId: "1",
    front: "Qual foi o interesse financeiro das indústrias de armamentos?",
    back: "Lucros recordes com contratos governamentais para produção em massa de armas e equipamentos militares",
    category: "interesse",
  },
  {
    id: "fc3",
    articleId: "1",
    front: "Descreva o ciclo financeiro da Segunda Guerra",
    back: "Início: investimento em produção bélica. Meio: lucros massivos durante o conflito. Fim: reconstrução pós-guerra gerando novo ciclo de lucros",
    category: "ciclo",
  },
  // Fraude Banco Master
  {
    id: "fc4",
    articleId: "2",
    front: "Quem foram os responsáveis pela fraude do Banco Master?",
    back: "Executivos do banco que manipularam demonstrações contábeis e auditores que falharam em detectar irregularidades",
    category: "autor",
  },
  {
    id: "fc5",
    articleId: "2",
    front: "Qual foi o valor do rombo do Banco Master?",
    back: "R$ 3,5 bilhões em fraude contábil descoberta em 1999",
    category: "conceito",
  },
  {
    id: "fc6",
    articleId: "2",
    front: "Qual foi o ciclo da fraude do Banco Master?",
    back: "Início: manipulação contábil para ocultar perdas. Meio: expansão artificial do banco. Fim: descoberta e intervenção do Banco Central",
    category: "ciclo",
  },
  // COVID-19
  {
    id: "fc7",
    articleId: "3",
    front: "Quem lucrou financeiramente com a pandemia de COVID-19?",
    back: "Indústria farmacêutica (vacinas), empresas de tecnologia (trabalho remoto) e grandes corporações que receberam estímulos governamentais",
    category: "autor",
  },
  {
    id: "fc8",
    articleId: "3",
    front: "Quanto foi o valor dos contratos de vacinas globalmente?",
    back: "Mais de US$ 100 bilhões em contratos de vacinas entre governos e farmacêuticas",
    category: "conceito",
  },
  {
    id: "fc9",
    articleId: "3",
    front: "Qual foi o ciclo financeiro da COVID-19?",
    back: "Início: colapso econômico e pânico. Meio: corrida por vacinas e tratamentos. Fim: estímulos massivos gerando inflação global",
    category: "ciclo",
  },
  // Crise de 2008
  {
    id: "fc10",
    articleId: "4",
    front: "Quem foram os principais responsáveis pela crise de 2008?",
    back: "Bancos de investimento, agências de rating que aprovaram ativos tóxicos, e reguladores que falharam na supervisão",
    category: "autor",
  },
  {
    id: "fc11",
    articleId: "4",
    front: "O que eram os empréstimos subprime?",
    back: "Empréstimos imobiliários de alto risco concedidos a pessoas sem capacidade de pagamento, empacotados e vendidos como investimentos seguros",
    category: "conceito",
  },
  {
    id: "fc12",
    articleId: "4",
    front: "Descreva o ciclo da crise de 2008",
    back: "Início: bolha imobiliária com empréstimos subprime. Meio: colapso do Lehman Brothers. Fim: resgates governamentais de trilhões",
    category: "ciclo",
  },
  // Privatizações no Brasil
  {
    id: "fc13",
    articleId: "5",
    front: "Quais foram as principais empresas privatizadas no Brasil nos anos 90?",
    back: "Vale (mineração), Telebrás (telecomunicações), e diversas empresas de energia elétrica",
    category: "conceito",
  },
  {
    id: "fc14",
    articleId: "5",
    front: "Qual foi a controvérsia da privatização da Vale?",
    back: "Vendida por R$ 3,3 bilhões, valor 50% abaixo do estimado, gerando lucros bilionários para compradores",
    category: "interesse",
  },
  {
    id: "fc15",
    articleId: "5",
    front: "Qual foi o ciclo das privatizações brasileiras?",
    back: "Início: venda de estatais por valores questionáveis. Meio: monopólios privados estabelecidos. Fim: lucros concentrados em poucos grupos",
    category: "ciclo",
  },
  // Indústria Farmacêutica
  {
    id: "fc16",
    articleId: "6",
    front: "O que foi a crise dos opioides nos EUA?",
    back: "Epidemia causada por prescrição excessiva de analgésicos opioides, gerando dependência massiva e centenas de milhares de mortes",
    category: "conceito",
  },
  {
    id: "fc17",
    articleId: "6",
    front: "Qual foi o interesse financeiro na crise dos opioides?",
    back: "Purdue Pharma e outras farmacêuticas lucraram bilhões vendendo opioides, mesmo sabendo do risco de dependência",
    category: "interesse",
  },
  {
    id: "fc18",
    articleId: "6",
    front: "Por que os preços de insulina triplicaram nos EUA?",
    back: "Três grandes farmacêuticas (Eli Lilly, Novo Nordisk, Sanofi) controlam o mercado e aumentam preços coordenadamente, priorizando lucros sobre vidas",
    category: "interesse",
  },
];
