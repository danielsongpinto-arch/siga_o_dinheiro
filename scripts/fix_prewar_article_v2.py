#!/usr/bin/env python3
import json

# Ler JSON atual
with open('/home/ubuntu/siga_o_dinheiro/data/ww2_prewar_article.json', 'r') as f:
    article = json.load(f)

# Corrigir authors para formato correto
article['authors'] = [
    {
        'name': 'IBM',
        'role': 'Fornecedor de tecnologia de identificação',
        'financialInterest': 'Lucros de aluguel de máquinas Hollerith e venda de cartões perfurados. Expansão de 400.000 para 7 milhões de Reichsmarks em capital alemão.'
    },
    {
        'name': 'Ford e General Motors',
        'role': 'Fabricantes de veículos militares',
        'financialInterest': 'Contratos militares alemães. GM/Opel produziu 40% dos veículos da Wehrmacht. Compensação pós-guerra de $32 milhões da GM por danos de bombardeios.'
    },
    {
        'name': 'Standard Oil',
        'role': 'Fornecedor de tecnologia de combustível sintético',
        'financialInterest': 'Acordo de compartilhamento de patentes com IG Farben. Royalties de tecnologia de hidrogenação e borracha sintética.'
    },
    {
        'name': 'IG Farben',
        'role': 'Conglomerado químico alemão',
        'financialInterest': 'Produção de combustível sintético, borracha, explosivos e Zyklon B. Uso de 30.000 trabalhadores escravos de Auschwitz.'
    }
]

# Corrigir financialCycle para formato correto
article['financialCycle'] = {
    'inicio': '1920-1929: Colapso econômico alemão pós-Primeira Guerra cria oportunidades para investimento americano. Plano Dawes (1924) reestrutura reparações e abre caminho para $2 bilhões em investimentos americanos. IBM adquire Dehomag (1922). Ford estabelece operações (1925). GM adquire Opel (1929). Standard Oil assina acordo com IG Farben (1929).',
    'meio': '1933-1939: Hitler assume poder. IBM expande capital alemão em 1.650%. Watson recebe medalha de Hitler (1937). Ford Werke e GM/Opel produzem veículos militares. Standard Oil compartilha tecnologia de combustível sintético. IG Farben desenvolve Zyklon B. Censo de 1933 identifica 2 milhões de judeus usando tecnologia IBM. Corporações americanas lucram com rearmamento alemão.',
    'fim': '1939-1945: Guerra eclode. Subsidiárias americanas continuam operando sob controle alemão. IBM mantém controle técnico através de subsidiárias suíças. Trabalho escravo em fábricas Ford, GM e IG Farben. Pós-guerra: Julgamentos de Nuremberg condenam executivos IG Farben. Corporações americanas recebem compensações por danos de guerra. Nenhum executivo americano processado.'
}

# Salvar JSON atualizado
with open('/home/ubuntu/siga_o_dinheiro/data/ww2_prewar_article.json', 'w') as f:
    json.dump(article, f, ensure_ascii=False, indent=2)

print("Artigo pré-guerra corrigido com estruturas corretas!")
