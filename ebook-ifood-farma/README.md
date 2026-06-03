# Ebook — iFood Farma · Análise Estratégica

Material executivo de apoio à decisão sobre **cadastrar a farmácia no iFood**, com foco em uma operação no
Centro Histórico de Porto Alegre (R. André da Rocha, 328 · divisa com a Cidade Baixa).

## Entregável

- **`Ebook-iFood-Farma-Analise-Estrategica.pdf`** — documento final, 15 páginas, A4.

### Conteúdo
1. Sumário executivo
2. Mercado de farmácia no delivery
3. Tutorial de cadastro (2 caminhos + checklist de documentos)
4. Modelos de entrega — como terceirizar 100% para entregadores do iFood
5. Regras da Anvisa (o que pode/não pode vender)
6. Estrutura de taxas e custos
7. Precificação — fórmula de markup e tabela por produto
8. Análise de localização (André da Rocha, 328)
9. Projeção de vendas incrementais — cenários +8% / +18% / +30%
10. Prós e contras
11. Plano de ação (90 dias), metodologia e fontes

## Como reconstruir o PDF

A fonte é HTML (`build/ebook.html`), renderizada com o Microsoft Edge em modo headless e finalizada com
um carimbo de numeração/rodapé via ReportLab + pypdf.

```powershell
# 1) HTML -> PDF (cores e fundos preservados)
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" `
  --headless=new --disable-gpu --no-pdf-header-footer `
  --print-to-pdf="build\ebook_body.pdf" `
  "file:///C:/Users/cfcar/biopharma/ebook-ifood-farma/build/ebook.html"

# 2) Carimbar numeração + rodapé -> PDF final
python build\stamp.py
```

Dependências Python: `reportlab`, `pypdf` (e `pymupdf` apenas para o QA visual em `render_preview.py` / `check_final.py`).

## Ressalva

As taxas e os percentuais de projeção são **estimativas de planejamento** baseadas em dados públicos e em uma
base de faturamento ilustrativa (R$ 120 mil/mês). Confirme as condições atuais diretamente com o iFood/integradora
e recalibre os percentuais com o faturamento real da loja antes de decidir.
