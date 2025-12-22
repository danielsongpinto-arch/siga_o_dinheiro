#!/usr/bin/env python3
import json

# Ler JSON atual
with open('/home/ubuntu/siga_o_dinheiro/data/ww2_prewar_article.json', 'r') as f:
    article = json.load(f)

# Adicionar campos faltantes
article['authors'] = ['Siga o Dinheiro']
article['financialCycle'] = {
    'interests': [
        'IBM: Tecnologia de identificação e rastreamento',
        'Ford e GM: Produção de veículos militares',
        'Standard Oil: Combustível sintético e borracha',
        'IG Farben: Química, explosivos e materiais bélicos',
        'Bancos internacionais: Empréstimos e facilitação financeira'
    ],
    'beneficiaries': [
        'Corporações americanas (IBM, Ford, GM, Standard Oil)',
        'Corporações alemãs (IG Farben, Siemens, Krupp)',
        'Bancos internacionais (Chase, Morgan, Brown Brothers Harriman)',
        'Regime nazista (tecnologia e capital para rearmamento)'
    ],
    'costs': [
        'Milhões de vítimas do Holocausto (identificadas por tecnologia IBM)',
        'Trabalhadores escravos em fábricas (IG Farben, Siemens, Krupp)',
        'Fortalecimento da máquina de guerra nazista',
        'Prolongamento da guerra e devastação da Europa'
    ]
}

# Salvar JSON atualizado
with open('/home/ubuntu/siga_o_dinheiro/data/ww2_prewar_article.json', 'w') as f:
    json.dump(article, f, ensure_ascii=False, indent=2)

print("Artigo pré-guerra atualizado com campos faltantes!")
