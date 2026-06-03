import fitz, os, sys

pdf = r"C:\Users\cfcar\biopharma\ebook-ifood-farma\build\ebook_body.pdf"
od = r"C:\Users\cfcar\biopharma\ebook-ifood-farma\build\preview"
os.makedirs(od, exist_ok=True)
doc = fitz.open(pdf)
print("PAGES:", doc.page_count)
for i, p in enumerate(doc):
    pix = p.get_pixmap(dpi=110)
    pix.save(os.path.join(od, f"p{i+1:02d}.png"))
print("rendered", doc.page_count, "pages ->", od)
