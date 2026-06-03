# -*- coding: utf-8 -*-
"""Converte ESTRATEGIA_REDES_SOCIAIS.md em PDF com a identidade visual Biopharma."""
import markdown
import subprocess
import pathlib
import os

BASE = pathlib.Path(r"C:\Users\cfcar\biopharma")
MD = BASE / "ESTRATEGIA_REDES_SOCIAIS.md"
HTML = BASE / "_estrategia_tmp.html"
PDF = BASE / "Estrategia_Redes_Sociais_Biopharma.pdf"
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

text = MD.read_text(encoding="utf-8")

body = markdown.markdown(
    text,
    extensions=["tables", "fenced_code", "toc", "sane_lists", "attr_list"],
)

CSS = """
:root{
  --navy:#0B2446; --corp:#173571; --blue:#2B66D9; --lum:#4FA3FF;
  --ice:#DCE7F5; --light:#F5F7FA; --gray:#6B7A90; --white:#FFFFFF;
}
@page{
  size:A4; margin:18mm 16mm 20mm 16mm;
}
@page cover{ margin:0; }
*{box-sizing:border-box;}
body{
  font-family:"Segoe UI","Inter",Arial,sans-serif;
  color:#1a2535; font-size:10.5pt; line-height:1.55; margin:0;
}
/* Capa */
.cover{
  background:linear-gradient(150deg,#0B2446 0%,#143a6b 55%,#173571 100%);
  color:#fff; padding:92mm 22mm 0; margin:0; min-height:297mm;
  page:cover; page-break-after:always; position:relative;
}
.cover .badge{
  display:inline-block; border:1px solid rgba(255,255,255,.35);
  border-radius:30px; padding:6px 18px; font-size:9.5pt;
  letter-spacing:.12em; text-transform:uppercase; color:var(--lum);
  margin-bottom:26px;
}
.cover h1{
  font-size:34pt; line-height:1.1; font-weight:700; margin:0 0 14px;
  color:#fff; border:none;
}
.cover h1 .accent{color:var(--lum);}
.cover .sub{font-size:13pt; color:#cfe0f7; max-width:430px; margin:0 0 40px;}
.cover .meta{font-size:10pt; color:#9fb6d8; line-height:1.9;}
.cover .meta b{color:#fff; font-weight:600;}
.cover .rule{width:64px; height:5px; background:var(--lum); border-radius:4px; margin:0 0 28px;}

h1,h2,h3,h4{font-family:"Segoe UI Semibold","Poppins","Segoe UI",sans-serif; color:var(--navy); line-height:1.25;}
h1{font-size:19pt; border-bottom:3px solid var(--blue); padding-bottom:6px; margin:26px 0 14px; page-break-before:always;}
h1:first-of-type{page-break-before:avoid;}
h2{font-size:15pt; color:var(--corp); margin:22px 0 10px; padding-left:11px; border-left:5px solid var(--lum);}
h3{font-size:12pt; color:var(--blue); margin:16px 0 6px;}
h4{font-size:11pt; color:var(--corp); margin:12px 0 4px;}
p{margin:7px 0;}
a{color:var(--blue); text-decoration:none;}
strong{color:var(--navy);}
ul,ol{margin:7px 0 7px 4px; padding-left:20px;}
li{margin:3px 0;}
blockquote{
  background:var(--ice); border-left:5px solid var(--blue);
  margin:12px 0; padding:9px 16px; border-radius:0 10px 10px 0;
  color:var(--corp); font-size:10pt;
}
blockquote p{margin:3px 0;}
code{
  background:#eef3fb; color:var(--corp); padding:1px 5px; border-radius:4px;
  font-family:"Consolas",monospace; font-size:9pt;
}
pre{
  background:var(--navy); color:#dbe7fb; padding:12px 16px; border-radius:10px;
  overflow:auto; font-size:8.8pt; line-height:1.5; page-break-inside:avoid;
  border-left:4px solid var(--lum);
}
pre code{background:none; color:inherit; padding:0;}
table{
  border-collapse:collapse; width:100%; margin:12px 0; font-size:9pt;
  page-break-inside:avoid; box-shadow:0 2px 10px rgba(11,36,70,.07);
  border-radius:8px; overflow:hidden;
}
thead th{
  background:var(--navy); color:#fff; text-align:left; padding:8px 10px;
  font-weight:600; font-size:9pt;
}
tbody td{padding:7px 10px; border-bottom:1px solid #e3eaf4; vertical-align:top;}
tbody tr:nth-child(even){background:var(--light);}
tbody tr:last-child td{border-bottom:none;}
hr{border:none; border-top:1px solid #d6e0ee; margin:18px 0;}
/* checkbox lists */
li input[type=checkbox]{margin-right:7px;}
"""

html = f"""<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><style>{CSS}</style></head>
<body>
<div class="cover">
  <span class="badge">Plano de Execução · 2026</span>
  <div class="rule"></div>
  <h1>Estratégia Digital<br><span class="accent">Biopharma</span> Farmácia</h1>
  <p class="sub">Instagram, Facebook, tráfego pago e WhatsApp — guia completo, pronto para executar.</p>
  <div class="meta">
    <b>Farmácia Biopharma</b> — Centro Histórico, Porto Alegre/RS<br>
    Av. Des. André da Rocha, 328 · CEP 90050-160<br>
    WhatsApp <b>(51) 99469-7388</b> · farmaciabiopharma.vercel.app<br>
    <b>20 seções</b> · Identidade navy · branco · azul luminoso
  </div>
</div>
{body}
</body></html>"""

HTML.write_text(html, encoding="utf-8")
print("HTML gerado:", HTML)

# Imprime para PDF via Edge headless
url = HTML.as_uri()
cmd = [
    EDGE, "--headless", "--disable-gpu", "--no-pdf-header-footer",
    f"--print-to-pdf={PDF}", url,
]
res = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
print("Edge stderr:", res.stderr[-400:] if res.stderr else "(vazio)")
print("PDF existe:", PDF.exists(), "tamanho:", PDF.stat().st_size if PDF.exists() else 0)
