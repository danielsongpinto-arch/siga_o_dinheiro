import { QuizQuestion } from "@/types/quiz";

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Quiz para "Siga o Dinheiro na Segunda Guerra Mundial"
  {
    id: "q1-1",
    articleId: "1",
    question: "Qual foi o principal interesse financeiro das indústrias de armamentos durante a Segunda Guerra Mundial?",
    options: [
      "Promover a paz mundial",
      "Lucrar com contratos governamentais de produção em massa",
      "Desenvolver tecnologia para uso civil",
      "Reduzir custos de produção",
    ],
    correctAnswer: 1,
    explanation: "As indústrias de armamentos lucraram enormemente com contratos governamentais para produção em massa de armas, munições e equipamentos militares durante a guerra.",
  },
  {
    id: "q1-2",
    articleId: "1",
    question: "Como os banqueiros se beneficiaram financeiramente durante a Segunda Guerra Mundial?",
    options: [
      "Financiando apenas um lado do conflito",
      "Emprestando dinheiro para ambos os lados e cobrando juros",
      "Doando recursos para refugiados",
      "Fechando suas operações durante a guerra",
    ],
    correctAnswer: 1,
    explanation: "Banqueiros financiaram ambos os lados do conflito através de empréstimos governamentais, lucrando com os juros independentemente do resultado da guerra.",
  },
  {
    id: "q1-3",
    articleId: "1",
    question: "Qual foi o ciclo financeiro da Segunda Guerra Mundial?",
    options: [
      "Início: Paz | Meio: Negociação | Fim: Tratado",
      "Início: Investimento em armamentos | Meio: Produção em massa | Fim: Reconstrução lucrativa",
      "Início: Crise econômica | Meio: Recuperação | Fim: Prosperidade",
      "Início: Isolamento | Meio: Neutralidade | Fim: Cooperação",
    ],
    correctAnswer: 1,
    explanation: "O ciclo começou com investimentos em armamentos, passou pela produção em massa durante a guerra e terminou com a reconstrução lucrativa da Europa através do Plano Marshall.",
  },

  // Quiz para "Siga o Dinheiro na Fraude do Banco Master"
  {
    id: "q2-1",
    articleId: "2",
    question: "Qual foi o principal mecanismo da fraude do Banco Master?",
    options: [
      "Roubo de dinheiro físico",
      "Manipulação de balanços e criação de ativos fictícios",
      "Invasão de sistemas bancários",
      "Falsificação de moeda",
    ],
    correctAnswer: 1,
    explanation: "A fraude envolveu manipulação de balanços contábeis e criação de ativos fictícios para esconder perdas e atrair investidores.",
  },
  {
    id: "q2-2",
    articleId: "2",
    question: "Quem foram os principais beneficiários da fraude?",
    options: [
      "Os clientes do banco",
      "Executivos e auditores que receberam propinas",
      "O governo federal",
      "Pequenos investidores",
    ],
    correctAnswer: 1,
    explanation: "Executivos do banco e auditores cúmplices foram os principais beneficiários, recebendo bônus, propinas e desvios de recursos.",
  },
  {
    id: "q2-3",
    articleId: "2",
    question: "Qual foi o fim do ciclo financeiro da fraude?",
    options: [
      "Recuperação total dos valores",
      "Falência e prejuízo para investidores e depositantes",
      "Fusão com outro banco",
      "Nacionalização bem-sucedida",
    ],
    correctAnswer: 1,
    explanation: "O ciclo terminou com a falência do banco, causando prejuízos bilionários para investidores e depositantes, enquanto os responsáveis tentavam fugir com os recursos desviados.",
  },

  // Quiz para "Siga o Dinheiro na COVID-19"
  {
    id: "q3-1",
    articleId: "3",
    question: "Qual setor teve o maior crescimento financeiro durante a pandemia de COVID-19?",
    options: [
      "Turismo e hotelaria",
      "Indústria farmacêutica e tecnologia",
      "Entretenimento presencial",
      "Aviação comercial",
    ],
    correctAnswer: 1,
    explanation: "A indústria farmacêutica lucrou com vacinas e tratamentos, enquanto empresas de tecnologia cresceram com trabalho remoto e e-commerce.",
  },
  {
    id: "q3-2",
    articleId: "3",
    question: "Como os governos financiaram os pacotes de estímulo econômico?",
    options: [
      "Usando apenas reservas existentes",
      "Emitindo dívida pública e imprimindo moeda",
      "Vendendo empresas estatais",
      "Aumentando impostos imediatamente",
    ],
    correctAnswer: 1,
    explanation: "Governos emitiram trilhões em dívida pública e aumentaram a oferta monetária para financiar auxílios emergenciais e programas de estímulo.",
  },
  {
    id: "q3-3",
    articleId: "3",
    question: "Qual foi uma consequência financeira de longo prazo da pandemia?",
    options: [
      "Redução da desigualdade social",
      "Aumento da inflação e concentração de riqueza",
      "Eliminação da dívida pública",
      "Estabilização dos preços",
    ],
    correctAnswer: 1,
    explanation: "A pandemia resultou em inflação elevada devido ao aumento da oferta monetária e concentração de riqueza, com bilionários aumentando fortunas enquanto milhões perderam empregos.",
  },

  // Quiz para "Siga o Dinheiro na Crise de 2008"
  {
    id: "q4-1",
    articleId: "4",
    question: "Qual foi a causa raiz da crise financeira de 2008?",
    options: [
      "Guerra comercial internacional",
      "Bolha imobiliária e empréstimos subprime",
      "Ataque cibernético aos bancos",
      "Escassez de petróleo",
    ],
    correctAnswer: 1,
    explanation: "A crise foi causada pela bolha imobiliária nos EUA e pela concessão irresponsável de empréstimos subprime a tomadores sem capacidade de pagamento.",
  },
  {
    id: "q4-2",
    articleId: "4",
    question: "Como os bancos lucraram antes da crise?",
    options: [
      "Investindo em empresas sustentáveis",
      "Empacotando e vendendo hipotecas tóxicas como investimentos seguros",
      "Reduzindo taxas de juros",
      "Aumentando reservas de capital",
    ],
    correctAnswer: 1,
    explanation: "Bancos empacotaram hipotecas de alto risco em produtos financeiros complexos (CDOs) e os venderam como investimentos seguros, lucrando com comissões.",
  },
  {
    id: "q4-3",
    articleId: "4",
    question: "Quem pagou a conta da crise de 2008?",
    options: [
      "Apenas os executivos bancários",
      "Contribuintes através de resgates governamentais",
      "Investidores estrangeiros",
      "Ninguém, a crise se resolveu sozinha",
    ],
    correctAnswer: 1,
    explanation: "Os contribuintes pagaram através de trilhões em resgates governamentais aos bancos, enquanto milhões perderam casas e empregos. Poucos executivos foram responsabilizados.",
  },

  // Quiz para "Siga o Dinheiro nas Privatizações no Brasil"
  {
    id: "q5-1",
    articleId: "5",
    question: "Qual foi o argumento principal para as privatizações no Brasil nos anos 90?",
    options: [
      "Aumentar o controle estatal",
      "Melhorar eficiência e reduzir dívida pública",
      "Nacionalizar empresas estrangeiras",
      "Criar monopólios estatais",
    ],
    correctAnswer: 1,
    explanation: "O argumento era que empresas privadas seriam mais eficientes e que a venda geraria recursos para reduzir a dívida pública brasileira.",
  },
  {
    id: "q5-2",
    articleId: "5",
    question: "Quem foram os principais beneficiários das privatizações?",
    options: [
      "Pequenos investidores brasileiros",
      "Grandes grupos econômicos e investidores estrangeiros",
      "Trabalhadores das empresas",
      "Consumidores através de preços menores",
    ],
    correctAnswer: 1,
    explanation: "Grandes grupos econômicos nacionais e investidores estrangeiros adquiriram ativos estratégicos, muitas vezes por valores abaixo do mercado, consolidando monopólios privados.",
  },
  {
    id: "q5-3",
    articleId: "5",
    question: "Qual foi uma crítica ao processo de privatização?",
    options: [
      "Empresas foram vendidas por valores muito altos",
      "Ativos estratégicos foram vendidos abaixo do valor real",
      "Houve excesso de transparência",
      "Trabalhadores receberam muitos benefícios",
    ],
    correctAnswer: 1,
    explanation: "Críticos apontam que empresas lucrativas como Vale e Telebrás foram vendidas por valores subavaliados, beneficiando compradores em detrimento do interesse público.",
  },

  // Quiz para "Siga o Dinheiro na Indústria Farmacêutica"
  {
    id: "q6-1",
    articleId: "6",
    question: "Como a indústria farmacêutica mantém preços elevados de medicamentos?",
    options: [
      "Através de competição justa",
      "Usando patentes para criar monopólios temporários",
      "Reduzindo custos de produção",
      "Doando medicamentos gratuitamente",
    ],
    correctAnswer: 1,
    explanation: "Patentes garantem monopólios de 20 anos, permitindo que farmacêuticas definam preços sem competição, mesmo quando os custos de produção são baixos.",
  },
  {
    id: "q6-2",
    articleId: "6",
    question: "Qual é o interesse financeiro das farmacêuticas em doenças crônicas?",
    options: [
      "Curar rapidamente para reduzir custos",
      "Criar tratamentos contínuos que geram receita recorrente",
      "Prevenir doenças antes que apareçam",
      "Desenvolver vacinas gratuitas",
    ],
    correctAnswer: 1,
    explanation: "Doenças crônicas geram receita recorrente através de tratamentos contínuos, sendo mais lucrativas que curas definitivas ou prevenção.",
  },
  {
    id: "q6-3",
    articleId: "6",
    question: "Como farmacêuticas influenciam prescrições médicas?",
    options: [
      "Apenas através de evidências científicas",
      "Pagando comissões e oferecendo benefícios a médicos",
      "Reduzindo preços de medicamentos",
      "Publicando apenas estudos negativos",
    ],
    correctAnswer: 1,
    explanation: "Farmacêuticas pagam comissões, oferecem viagens e benefícios a médicos, e financiam estudos que favorecem seus produtos, influenciando prescrições.",
  },
];
