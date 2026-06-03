import fitz, os
pdf = r"C:\Users\cfcar\biopharma\ebook-ifood-farma\Ebook-iFood-Farma-Analise-Estrategica.pdf"
od = r"C:\Users\cfcar\biopharma\ebook-ifood-farma\build\final_chk"
os.makedirs(od, exist_ok=True)
doc = fitz.open(pdf)
for idx in [0, 1, 13, 14]:
    p = doc[idx]
    pix = p.get_pixmap(dpi=110)
    pix.save(os.path.join(od, f"f{idx+1:02d}.png"))
print("done", doc.page_count)
