import io
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.colors import Color

SRC = r"C:\Users\cfcar\biopharma\ebook-ifood-farma\build\ebook_body.pdf"
OUT = r"C:\Users\cfcar\biopharma\ebook-ifood-farma\Ebook-iFood-Farma-Analise-Estrategica.pdf"

ink   = Color(11/255, 36/255, 71/255)
gray  = Color(120/255, 134/255, 152/255)
line  = Color(214/255, 223/255, 236/255)
accent= Color(225/255, 29/255, 42/255)

reader = PdfReader(SRC)
n = len(reader.pages)
writer = PdfWriter()

LM = 39.7  # 14mm

for i, page in enumerate(reader.pages):
    w = float(page.mediabox.width)
    h = float(page.mediabox.height)
    if i == 0:
        # cover: no footer stamp
        writer.add_page(page)
        continue
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=(w, h))
    rm = w - LM
    # thin rule
    c.setStrokeColor(line); c.setLineWidth(0.6)
    c.line(LM, 42, rm, 42)
    # accent tick
    c.setFillColor(accent)
    c.rect(LM, 27.5, 5, 5, fill=1, stroke=0)
    # left brand text
    c.setFillColor(gray); c.setFont("Helvetica", 7)
    c.drawString(LM + 9, 28, "iFood Farma  ·  Analise Estrategica  ·  Confidencial")
    # right page number
    c.setFillColor(ink); c.setFont("Helvetica-Bold", 7.5)
    c.drawRightString(rm, 28, f"Pagina {i+1:02d}  /  {n:02d}")
    c.save()
    buf.seek(0)
    overlay = PdfReader(buf).pages[0]
    page.merge_page(overlay)
    writer.add_page(page)

# metadata
writer.add_metadata({
    "/Title": "iFood Farma - Analise Estrategica de Canal",
    "/Author": "Analise preparada via Claude",
    "/Subject": "Estudo de viabilidade: farmacia no iFood - Centro Historico, Porto Alegre/RS",
    "/Keywords": "iFood, farmacia, delivery, Porto Alegre, taxas, projecao de vendas",
})

with open(OUT, "wb") as f:
    writer.write(f)
print("FINAL PDF:", OUT)
print("pages:", n)
