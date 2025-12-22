#!/usr/bin/env python3
import json

# Ler artigo pré-guerra
with open('/home/ubuntu/siga_o_dinheiro/research/prewar_article_draft.md', 'r') as f:
    content = f.read()
    # Remover título principal (primeira linha)
    lines = content.split('\n')
    content_without_title = '\n'.join(lines[1:]).strip()

# Criar objeto do artigo
article = {
    "id": "ww2-prewar",
    "themeId": "ww2",
    "title": "Véspera da Segunda Guerra: Os Laços Comerciais que Financiaram o Nazismo",
    "date": "1920-1939",
    "readTime": 16,
    "difficulty": "advanced",
    "summary": "Uma investigação sobre como IBM, Ford, General Motors e Standard Oil forneceram tecnologia, capital e conhecimento que tornaram possível o rearmamento alemão, operando sob o princípio de que lucros transcendem fronteiras e ideologias.",
    "content": content_without_title
}

# Salvar como JSON
with open('/home/ubuntu/siga_o_dinheiro/data/ww2_prewar_article.json', 'w') as f:
    json.dump(article, f, ensure_ascii=False, indent=2)

print("Artigo pré-guerra criado com sucesso!")
