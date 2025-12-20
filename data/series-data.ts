import { Series } from "@/types/series";

export const SERIES: Series[] = [
  {
    id: "series-1",
    title: "Guerras e Economia: Do Conflito ao Lucro",
    description:
      "Uma série que explora como grandes conflitos mundiais geraram fortunas e moldaram o sistema financeiro global através dos interesses de fabricantes de armas, banqueiros e políticos.",
    themeId: "theme-1",
    articleIds: ["1"], // Segunda Guerra Mundial
    totalParts: 1,
  },
  {
    id: "series-2",
    title: "Crises Financeiras: Anatomia do Colapso",
    description:
      "Análise profunda das maiores crises financeiras da história, revelando os interesses por trás das bolhas especulativas, fraudes bancárias e resgates governamentais.",
    themeId: "theme-2",
    articleIds: ["2", "4"], // Fraude do Banco Master + Crise de 2008
    totalParts: 2,
  },
  {
    id: "series-3",
    title: "Saúde Pública e Interesses Privados",
    description:
      "Investigação sobre como pandemias e crises de saúde se tornaram oportunidades lucrativas para indústrias farmacêuticas, tecnológicas e governos.",
    themeId: "theme-3",
    articleIds: ["3", "6"], // COVID-19 + Indústria Farmacêutica
    totalParts: 2,
  },
  {
    id: "series-4",
    title: "Privatizações: Transferência de Riqueza",
    description:
      "Série que examina o processo de privatização de empresas estatais no Brasil, revelando os beneficiários diretos e indiretos dessas transações bilionárias.",
    themeId: "theme-5",
    articleIds: ["5"], // Privatizações no Brasil
    totalParts: 1,
  },
];
