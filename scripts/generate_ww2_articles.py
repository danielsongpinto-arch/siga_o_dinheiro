#!/usr/bin/env python3
import json

# Ler artigos
with open('/home/ubuntu/siga_o_dinheiro/research/wwii_article_draft.md', 'r', encoding='utf-8') as f:
    wwii_lines = f.readlines()[1:]  # Skip title
    wwii_content = ''.join(wwii_lines).strip()

with open('/home/ubuntu/siga_o_dinheiro/research/postwar_article_draft.md', 'r', encoding='utf-8') as f:
    postwar_lines = f.readlines()[1:]  # Skip title
    postwar_content = ''.join(postwar_lines).strip()

# Escapar para template string TypeScript
def escape_for_ts(text):
    return text.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

wwii_escaped = escape_for_ts(wwii_content)
postwar_escaped = escape_for_ts(postwar_content)

# Gerar arquivo TypeScript
ts_content = f'''import {{ Article }} from "@/types";

export const WW2_ARTICLES: Article[] = [
  {{
    id: "ww2-001",
    themeId: "ww2",
    title: "Segunda Guerra Mundial: O Maior Esquema Ponzi Geográfico da História",
    date: "2024-12-22",
    summary: "Uma análise financeira inédita revelando como a Alemanha nazista construiu sua máquina de guerra sobre um sistema parasita de pilhagem, manipulação financeira e exploração sistemática - um esquema Ponzi geográfico destinado ao colapso.",
    content: `{wwii_escaped}`,
    authors: [
      {{
        name: "Hjalmar Schacht",
        role: "Presidente do Reichsbank e arquiteto das Contas Mefo",
        financialInterest: "Criou sistema de financiamento invisível que permitiu rearmamento alemão através de 12 bilhões de marcos em notas promissórias fantasma",
      }},
      {{
        name: "Regime Nazista",
        role: "Saqueadores sistemáticos",
        financialInterest: "Pilhagem de 121 bilhões de marcos de países ocupados (ouro, fábricas, recursos, trabalho escravo) para financiar gastos militares de 414 bilhões",
      }},
      {{
        name: "Corporações Alemãs (IG Farben, Siemens, Krupp)",
        role: "Beneficiários de trabalho escravo",
        financialInterest: "Lucros massivos através de 6 milhões de trabalhadores escravos pagando 20 marcos/mês vs 250 marcos/mês para alemães livres",
      }},
      {{
        name: "Bancos Suíços",
        role: "Depositários de ouro saqueado",
        financialInterest: "Taxas sobre depósitos de ouro roubado, incluindo ouro de vítimas do Holocausto (Conta Melmer: 180 milhões de marcos)",
      }},
    ],
    financialCycle: {{
      inicio: "1933-1938 - Hjalmar Schacht cria sistema de Contas Mefo (12 bilhões de marcos em notas promissórias fantasma) para financiar rearmamento secreto. Anexação da Áustria e Tchecoslováquia rende primeiras pilhagens (122 toneladas de ouro).",
      meio: "1939-1942 - Saque sistemático da Europa (França: 400 mi francos/dia, Bélgica, Holanda, Polônia). Trabalho escravo (6 milhões) e roubo de propriedade judaica. Reunião de março 1942 revela déficit de produção de 32 milhões de toneladas - derrota matematicamente inevitável.",
      fim: "1943-1945 - Colapso do esquema Ponzi geográfico. Frente Oriental drena recursos (custos 8x maiores que ganhos). Déficit final: 293 bilhões de marcos. Alemanha gastou 3,4x mais do que saqueou. Sistema insustentável colapsa em maio de 1945.",
    }},
  }},
  {{
    id: "ww2-002",
    themeId: "ww2",
    title: "Pós-Segunda Guerra Mundial: A Divisão da Europa e o Saque Continuado",
    date: "2024-12-22",
    summary: "A história raramente contada de como a Europa foi dividida como um bolo entre as potências vencedoras através de acordos informais, e como o saque continuou mesmo após o fim oficial da guerra - com paralelos reveladores para conflitos atuais.",
    content: `{postwar_escaped}`,
    authors: [
      {{
        name: "Winston Churchill e Joseph Stalin",
        role: "Arquitetos do 'Acordo do Guardanapo'",
        financialInterest: "Divisão informal da Europa Oriental em esferas de influência (outubro 1944) - Romênia 90% URSS, Grécia 90% UK, etc. - sem tratado formal",
      }},
      {{
        name: "União Soviética",
        role: "Saqueadora da Europa Oriental",
        financialInterest: "Transferência de bilhões de dólares em equipamentos industriais da Europa Oriental para URSS. Exploração econômica de Polônia, Hungria, Romênia, Alemanha Oriental como colônias",
      }},
      {{
        name: "Estados Unidos",
        role: "Financiador da reconstrução",
        financialInterest: "Plano Marshall - bilhões em empréstimos que retornaram aos EUA via contratos para empresas americanas. Criação de mercados cativos para produtos americanos",
      }},
      {{
        name: "Potências Atuais (Rússia, EUA, Europa)",
        role: "Repetindo padrões históricos",
        financialInterest: "Conflito Rússia-Ucrânia: EUA busca terras raras, Rússia busca territórios orientais, Europa frustrada por não ter 'parte do bolo' - tenta usar reservas russas congeladas (€300+ bilhões)",
      }},
    ],
    financialCycle: {{
      inicio: "1944-1945 - 'Acordo do Guardanapo' divide Europa informalmente. Levante de Varsóvia: Stalin permite massacre para eliminar resistência anti-soviética. Conferências de Yalta e Potsdam estabelecem divisão provisória que se torna permanente.",
      meio: "1945-1948 - Saque soviético da Europa Oriental: fábricas desmontadas, ferrovias arrancadas, bilhões em equipamentos transferidos. Instalação de regimes comunistas. Deportações em massa (40.000 lituanos para Sibéria). 'Cortina de Ferro' divide Europa.",
      fim: "1948-1990 - Guerra Fria de 45 anos. Plano Marshall (1948) financia reconstrução ocidental mas retorna aos EUA via contratos. Bloqueio de Berlim, OTAN vs Pacto de Varsóvia. Fronteiras 'provisórias' tornam-se permanentes. Só resolvido em 1990 com reunificação alemã.",
    }},
  }},
];
'''

with open('/home/ubuntu/siga_o_dinheiro/data/ww2-articles.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Arquivo ww2-articles.ts criado com sucesso!")
print(f"Artigo 1: {len(wwii_escaped)} caracteres")
print(f"Artigo 2: {len(postwar_escaped)} caracteres")
