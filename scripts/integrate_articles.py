#!/usr/bin/env python3
import re

# Ler artigos
with open('/home/ubuntu/siga_o_dinheiro/research/wwii_article_draft.md', 'r', encoding='utf-8') as f:
    wwii_content = f.read()

with open('/home/ubuntu/siga_o_dinheiro/research/postwar_article_draft.md', 'r', encoding='utf-8') as f:
    postwar_content = f.read()

# Remover título do markdown (primeira linha)
wwii_content = '\n'.join(wwii_content.split('\n')[1:])
postwar_content = '\n'.join(postwar_content.split('\n')[1:])

# Escapar backticks para template string
wwii_escaped = wwii_content.replace('`', '\\`').replace('${', '\\${')
postwar_escaped = postwar_content.replace('`', '\\`').replace('${', '\\${')

print("Artigos preparados para integração")
print(f"Artigo 1: {len(wwii_escaped)} caracteres")
print(f"Artigo 2: {len(postwar_escaped)} caracteres")

