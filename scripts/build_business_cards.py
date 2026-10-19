import os
import sys
import shutil
import urllib.request
import re

sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BC_DIR = os.path.join(BASE_DIR, "business_cards")
ASSETS_DIR = os.path.join(BC_DIR, "assets")
TEMPLATES_DIR = os.path.join(BC_DIR, "templates")

os.makedirs(ASSETS_DIR, exist_ok=True)
os.makedirs(TEMPLATES_DIR, exist_ok=True)

# Copy photos from public
for f in ["owner.png", "hero-portrait.jpg", "favicon.svg"]:
    src = os.path.join(BASE_DIR, "public", f)
    dst = os.path.join(ASSETS_DIR, f)
    if os.path.exists(src):
        shutil.copy(src, dst)

qr_path = os.path.join(ASSETS_DIR, "qr_code.svg")
if not os.path.exists(qr_path):
    qr_url = "https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https://yanapsychology.com&format=svg&color=2C2A29&bgcolor=FFFFFF"
    urllib.request.urlretrieve(qr_url, qr_path)

LEAF_SVG = """<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="leaf-icon">
  <path d="M13 36L30 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M20 28C16.5 24 14 17 17.5 12.5C21 11.5 25 15.5 26.5 21" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M26.5 21C27.5 15 32 8.5 36 10C39.5 11.5 37.5 18 31 22.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M23 25.5C27 25 36.5 22.5 39.5 26C40.5 29.5 36 32 20 28.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>"""

PHONE_SVG = """<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="contact-icon"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>"""
MAIL_SVG = """<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="contact-icon"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>"""
PIN_SVG = """<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="contact-icon"><path d="M12 21s-6-5.333-6-10a6 6 0 0 1 12 0c0 4.667-6 10-6 10z"/><circle cx="12" cy="11" r="2.5"/></svg>"""
WEB_SVG = """<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="contact-icon"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>"""

COMMON_FONTS = """
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
"""

COMMON_STYLE = """
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
html, body {
  width: 1004px;
  height: 650px;
  overflow: hidden;
  background: transparent;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
@page {
  size: 85mm 55mm;
  margin: 0;
}
.card {
  width: 1004px;
  height: 650px;
  position: relative;
  overflow: hidden;
}
.serif { font-family: 'Cormorant Garamond', Georgia, serif; }
.sans { font-family: 'Plus Jakarta Sans', sans-serif; }
"""

# ==============================================================================
# DESIGN 1: "Botanical Olive & Gold"
# ==============================================================================
D1_FRONT = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
{COMMON_FONTS}
<style>
{COMMON_STYLE}
.card {{
  background: linear-gradient(135deg, #242D21 0%, #353F30 45%, #22291F 100%);
  color: #FBF9F5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 50px;
}}
.border-frame {{
  position: absolute;
  top: 18px; left: 18px; right: 18px; bottom: 18px;
  border: 1px solid rgba(197, 168, 128, 0.45);
  border-radius: 12px;
  pointer-events: none;
}}
.border-inner {{
  position: absolute;
  top: 24px; left: 24px; right: 24px; bottom: 24px;
  border: 1px dashed rgba(197, 168, 128, 0.22);
  border-radius: 8px;
  pointer-events: none;
}}
.left-col {{
  flex: 1;
  max-width: 540px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 2;
}}
.monogram-badge {{
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}}
.badge-circle {{
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1.5px solid #C5A880;
  background: rgba(197, 168, 128, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  font-weight: 500;
  color: #EBDBC3;
  letter-spacing: -1px;
}}
.badge-label {{
  font-size: 10.5px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #C5A880;
  font-weight: 600;
}}
.name {{
  font-size: 46px;
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: 0.02em;
  color: #FFFFFF;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}}
.titles-list {{
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 18px;
}}
.title-line {{
  font-size: 12px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #D6BD96;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}}
.title-line::before {{
  content: "";
  display: inline-block;
  width: 14px;
  height: 1px;
  background: #C5A880;
}}
.leaf-divider {{
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
  width: 280px;
}}
.leaf-line {{
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(197,168,128,0.5), transparent);
}}
.leaf-divider .leaf-icon {{
  width: 22px;
  height: 22px;
  color: #C5A880;
}}
.slogan {{
  font-size: 20px;
  font-style: italic;
  font-weight: 400;
  color: #E5DFC8;
  letter-spacing: 0.02em;
}}
.right-col {{
  position: relative;
  z-index: 2;
  margin-right: 10px;
}}
.arch-frame {{
  width: 310px;
  height: 440px;
  border-radius: 155px 155px 24px 24px;
  padding: 5px;
  background: linear-gradient(180deg, #D4B892 0%, rgba(197, 168, 128, 0.45) 60%, rgba(197, 168, 128, 0.15) 100%);
  box-shadow: 0 20px 45px rgba(0,0,0,0.5);
}}
.arch-inner {{
  width: 100%;
  height: 100%;
  border-radius: 150px 150px 20px 20px;
  overflow: hidden;
  background: #E8E2D7;
  position: relative;
}}
.arch-inner img {{
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 8%;
}}
</style>
</head>
<body>
<div class="card">
  <div class="border-frame"></div>
  <div class="border-inner"></div>

  <div class="left-col">
    <div class="monogram-badge">
      <div class="badge-circle serif">ЯК</div>
      <div class="badge-label sans">Психологическа практика</div>
    </div>
    <div class="name serif">Яна Кърнолска</div>
    <div class="titles-list sans">
      <div class="title-line">Психолог</div>
      <div class="title-line">Спортен психолог</div>
      <div class="title-line">Организационен &amp; социален психолог</div>
    </div>
    <div class="leaf-divider">
      {LEAF_SVG}
      <div class="leaf-line"></div>
    </div>
    <div class="slogan serif">„Подкрепа. Разбиране. Промяна.“</div>
  </div>

  <div class="right-col">
    <div class="arch-frame">
      <div class="arch-inner">
        <img src="../assets/owner.png" alt="Яна Кърнолска" />
      </div>
    </div>
  </div>
</div>
</body>
</html>"""

D1_BACK = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
{COMMON_FONTS}
<style>
{COMMON_STYLE}
.card {{
  background: #FAF7F2;
  color: #2C2A29;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 50px;
  position: relative;
}}
.border-frame {{
  position: absolute;
  top: 18px; left: 18px; right: 18px; bottom: 18px;
  border: 1px solid #E0D7C9;
  border-radius: 12px;
  pointer-events: none;
}}
.left-col {{
  flex: 1;
  max-width: 530px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  z-index: 2;
}}
.brand-head {{
  display: flex;
  align-items: center;
  gap: 14px;
}}
.monogram-sm {{
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #353F30;
  color: #FBF9F5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  letter-spacing: -1px;
}}
.brand-text-name {{
  font-size: 22px;
  font-weight: 600;
  color: #2C2A29;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}}
.brand-text-title {{
  font-size: 10px;
  font-weight: 600;
  color: #676F5C;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}}
.specialties-box {{
  background: #F2ECE0;
  border-radius: 10px;
  padding: 10px 14px;
  border: 1px solid #E5DDCF;
}}
.spec-tag {{
  font-size: 11px;
  font-weight: 600;
  color: #454E3F;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
}}
.spec-tag:last-child {{ margin-bottom: 0; }}
.spec-tag span {{ color: #C5A880; }}
.contact-list {{
  display: flex;
  flex-direction: column;
  gap: 10px;
}}
.contact-item {{
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #383533;
}}
.icon-box {{
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #EBE5D8;
  color: #384233;
  display: flex;
  align-items: center;
  justify-content: center;
}}
.contact-icon {{
  width: 16px;
  height: 16px;
}}
.right-col {{
  width: 310px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-left: 1px solid #E8E2D5;
  padding-left: 40px;
  z-index: 2;
}}
.qr-wrapper {{
  background: #FFFFFF;
  padding: 16px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(78, 88, 72, 0.08);
  border: 1px solid #ECE5D8;
  margin-bottom: 12px;
}}
.qr-wrapper img {{
  width: 155px;
  height: 155px;
  display: block;
}}
.qr-label {{
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #353F30;
  margin-bottom: 4px;
}}
.qr-sub {{
  font-size: 12px;
  color: #7A7671;
  font-style: italic;
}}
.work-hours {{
  margin-top: 12px;
  font-size: 11px;
  color: #55524E;
  background: #EDE7DC;
  padding: 5px 12px;
  border-radius: 12px;
}}
</style>
</head>
<body>
<div class="card">
  <div class="border-frame"></div>

  <div class="left-col">
    <div class="brand-head">
      <div class="monogram-sm serif">ЯК</div>
      <div>
        <div class="brand-text-name serif">Яна Кърнолска</div>
        <div class="brand-text-title sans">Психологическо консултиране</div>
      </div>
    </div>

    <div class="specialties-box sans">
      <div class="spec-tag"><span>♦</span> Психолог &bull; Индивидуална терапия &amp; двойки</div>
      <div class="spec-tag"><span>♦</span> Спортен психолог &bull; Ментална устойчивост</div>
      <div class="spec-tag"><span>♦</span> Организационен и социален психолог</div>
    </div>

    <div class="contact-list sans">
      <div class="contact-item">
        <div class="icon-box">{PHONE_SVG}</div>
        <span><strong>+359 887 344 424</strong> / 0887 344 424</span>
      </div>
      <div class="contact-item">
        <div class="icon-box">{MAIL_SVG}</div>
        <span>yanakarnolska@gmail.com</span>
      </div>
      <div class="contact-item">
        <div class="icon-box">{PIN_SVG}</div>
        <span>гр. София, ул. „Оборище“ 42 &bull; Онлайн</span>
      </div>
      <div class="contact-item">
        <div class="icon-box">{WEB_SVG}</div>
        <span>yanapsychology.com</span>
      </div>
    </div>
  </div>

  <div class="right-col">
    <div class="qr-wrapper">
      <img src="../assets/qr_code.svg" alt="QR Code" />
    </div>
    <div class="qr-label sans">СКАНИРАЙ ЗА ЧАС</div>
    <div class="qr-sub serif">yanapsychology.com</div>
    <div class="work-hours sans">Пон – Пет: 09:00 – 19:00 ч.</div>
  </div>
</div>
</body>
</html>"""

# ==============================================================================
# DESIGN 2: "Warm Cream Elegance"
# ==============================================================================
D2_FRONT = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
{COMMON_FONTS}
<style>
{COMMON_STYLE}
.card {{
  background: #FCFAF6;
  color: #2C2A29;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 38px 55px;
  position: relative;
}}
.bg-ambient {{
  position: absolute;
  top: -50px;
  right: -50px;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(227, 230, 224, 0.45) 0%, transparent 70%);
  pointer-events: none;
}}
.left-col {{
  flex: 1;
  max-width: 510px;
  z-index: 2;
}}
.top-tag {{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: #6C7564;
  font-weight: 600;
  margin-bottom: 16px;
}}
.top-tag::before {{
  content: "";
  display: inline-block;
  width: 24px;
  height: 1px;
  background: #6C7564;
}}
.name {{
  font-size: 50px;
  font-weight: 500;
  line-height: 1.05;
  color: #262423;
  margin-bottom: 14px;
}}
.roles-stack {{
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 22px;
}}
.role-item {{
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #676F5C;
  display: flex;
  align-items: center;
  gap: 8px;
}}
.role-dot {{
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #C5A880;
}}
.quote-box {{
  border-left: 2px solid #C5A880;
  padding-left: 16px;
  margin-top: 8px;
}}
.quote {{
  font-size: 19px;
  font-style: italic;
  line-height: 1.35;
  color: #55524E;
}}
.right-col {{
  z-index: 2;
  position: relative;
}}
.photo-frame {{
  width: 310px;
  height: 440px;
  border-radius: 155px;
  padding: 6px;
  background: #FFFFFF;
  box-shadow: 0 20px 45px rgba(62, 71, 57, 0.12);
  border: 1px solid #EBE4D8;
}}
.photo-inner {{
  width: 100%;
  height: 100%;
  border-radius: 150px;
  overflow: hidden;
  background: #EAE5DB;
}}
.photo-inner img {{
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 8%;
}}
.monogram-watermark {{
  position: absolute;
  bottom: -10px;
  right: -10px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #4E5848;
  color: #FBF9F5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}}
</style>
</head>
<body>
<div class="card">
  <div class="bg-ambient"></div>

  <div class="left-col">
    <div class="top-tag sans">Психологическо пространство</div>
    <div class="name serif">Яна Кърнолска</div>
    <div class="roles-stack sans">
      <div class="role-item"><div class="role-dot"></div><span>Психолог</span></div>
      <div class="role-item"><div class="role-dot"></div><span>Спортен психолог</span></div>
      <div class="role-item"><div class="role-dot"></div><span>Организационен и социален психолог</span></div>
    </div>
    <div class="quote-box">
      <div class="quote serif">„Пространство, в което да бъдете чути, разбрани и приети.“</div>
    </div>
  </div>

  <div class="right-col">
    <div class="photo-frame">
      <div class="photo-inner">
        <img src="../assets/owner.png" alt="Яна Кърнолска" />
      </div>
    </div>
    <div class="monogram-watermark serif">ЯК</div>
  </div>
</div>
</body>
</html>"""

D2_BACK = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
{COMMON_FONTS}
<style>
{COMMON_STYLE}
.card {{
  background: #FCFAF6;
  color: #2C2A29;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 52px;
  position: relative;
}}
.card-frame {{
  position: absolute;
  top: 16px; left: 16px; right: 16px; bottom: 16px;
  border: 1px solid #EADBCC;
  border-radius: 12px;
  pointer-events: none;
}}
.left-col {{
  flex: 1;
  max-width: 530px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  z-index: 2;
}}
.header-box {{
  margin-bottom: 2px;
}}
.brand-name {{
  font-size: 34px;
  font-weight: 500;
  color: #262423;
  line-height: 1.1;
  letter-spacing: 0.02em;
}}
.brand-title {{
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #6C7564;
  margin-top: 4px;
}}
.focus-areas {{
  font-size: 12.5px;
  color: #4B4845;
  line-height: 1.5;
  background: #F3EFE7;
  padding: 10px 16px;
  border-radius: 10px;
  border-left: 3px solid #747D68;
}}
.focus-areas strong {{
  color: #262423;
}}
.contacts-grid {{
  display: flex;
  flex-direction: column;
  gap: 10px;
}}
.contact-row {{
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 14px;
  color: #33302E;
}}
.contact-row strong {{
  color: #262423;
  font-weight: 600;
}}
.c-icon {{
  width: 19px;
  height: 19px;
  color: #556050;
}}
.right-col {{
  width: 290px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #EBE4D8;
  padding-left: 40px;
  z-index: 2;
}}
.qr-card {{
  background: #FFFFFF;
  padding: 16px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.06);
  border: 1px solid #E8E0D2;
  text-align: center;
}}
.qr-card img {{
  width: 155px;
  height: 155px;
  display: block;
}}
.qr-hint {{
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #4E5848;
  margin-top: 10px;
}}
.web-url {{
  font-size: 13px;
  color: #706D69;
  margin-top: 3px;
}}
</style>
</head>
<body>
<div class="card">
  <div class="card-frame"></div>

  <div class="left-col">
    <div class="header-box">
      <div class="brand-name serif">Яна Кърнолска</div>
      <div class="brand-title sans">Психолог &bull; Консултант &bull; Терапевт</div>
    </div>

    <div class="focus-areas sans">
      <strong>Специализации &bull; Консултации:</strong><br>
      Психолог &bull; Спортен психолог &bull; Организационен и социален психолог
    </div>

    <div class="contacts-grid sans">
      <div class="contact-row">
        <div class="c-icon">{PHONE_SVG}</div>
        <span><strong>0887 344 424</strong> / +359 887 344 424</span>
      </div>
      <div class="contact-row">
        <div class="c-icon">{MAIL_SVG}</div>
        <span>yanakarnolska@gmail.com</span>
      </div>
      <div class="contact-row">
        <div class="c-icon">{PIN_SVG}</div>
        <span>гр. София, ул. „Оборище“ 42 &bull; Онлайн</span>
      </div>
      <div class="contact-row">
        <div class="c-icon">{WEB_SVG}</div>
        <span>yanapsychology.com</span>
      </div>
    </div>
  </div>

  <div class="right-col">
    <div class="qr-card">
      <img src="../assets/qr_code.svg" alt="QR Code" />
      <div class="qr-hint sans">Запази своя час</div>
      <div class="web-url serif">yanapsychology.com</div>
    </div>
  </div>
</div>
</body>
</html>"""

# ==============================================================================
# DESIGN 3: "Modern Editorial Dual"
# ==============================================================================
D3_FRONT = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
{COMMON_FONTS}
<style>
{COMMON_STYLE}
.card {{
  display: flex;
  align-items: stretch;
  background: #232A20;
  position: relative;
}}
.left-split {{
  width: 440px;
  background: linear-gradient(135deg, #F9F6F0 0%, #EFEAE0 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}}
.owner-cutout {{
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 8%;
}}
.split-badge {{
  position: absolute;
  top: 24px;
  left: 24px;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(8px);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #384233;
  font-weight: 700;
  border: 1px solid rgba(197, 168, 128, 0.4);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  z-index: 5;
}}
.right-split {{
  flex: 1;
  padding: 48px 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #FFFFFF;
  position: relative;
}}
.monogram-row {{
  display: flex;
  justify-content: space-between;
  align-items: center;
}}
.monogram-text {{
  font-size: 38px;
  letter-spacing: -2px;
  color: #C5A880;
  line-height: 1;
}}
.city-tag {{
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.65);
}}
.main-title-block {{
  margin: 12px 0;
}}
.name-line1 {{
  font-size: 44px;
  font-weight: 400;
  line-height: 1;
  color: #F8F5EE;
  letter-spacing: 0.02em;
}}
.name-line2 {{
  font-size: 54px;
  font-weight: 500;
  line-height: 1.05;
  color: #FFFFFF;
  letter-spacing: 0.02em;
}}
.roles-group {{
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}}
.role-badge {{
  font-size: 11.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #D6BD96;
  font-weight: 600;
}}
.footer-row {{
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(197, 168, 128, 0.3);
  padding-top: 16px;
}}
.footer-quote {{
  font-size: 17px;
  font-style: italic;
  color: #D3CDC4;
}}
.footer-web {{
  font-size: 12px;
  letter-spacing: 0.15em;
  color: #C5A880;
  font-weight: 500;
}}
</style>
</head>
<body>
<div class="card">
  <div class="left-split">
    <div class="split-badge sans">София &bull; Онлайн</div>
    <img src="../assets/owner.png" alt="Яна Кърнолска" class="owner-cutout" />
  </div>

  <div class="right-split">
    <div class="monogram-row">
      <div class="monogram-text serif">ЯК</div>
      <div class="city-tag sans">ПРАКТИКА &bull; КОНСУЛТАЦИИ</div>
    </div>

    <div class="main-title-block">
      <div class="name-line1 serif">Яна</div>
      <div class="name-line2 serif">Кърнолска</div>
      <div class="roles-group sans">
        <div class="role-badge">&bull; Психолог</div>
        <div class="role-badge">&bull; Спортен психолог</div>
        <div class="role-badge">&bull; Организационен и социален психолог</div>
      </div>
    </div>

    <div class="footer-row">
      <div class="footer-quote serif">Подкрепа. Разбиране. Промяна.</div>
      <div class="footer-web sans">yanapsychology.com</div>
    </div>
  </div>
</div>
</body>
</html>"""

D3_BACK = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
{COMMON_FONTS}
<style>
{COMMON_STYLE}
.card {{
  background: #232A20;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 52px;
  position: relative;
}}
.border-gold {{
  position: absolute;
  top: 18px; left: 18px; right: 18px; bottom: 18px;
  border: 1px solid rgba(197, 168, 128, 0.35);
  border-radius: 12px;
  pointer-events: none;
}}
.left-col {{
  flex: 1;
  max-width: 530px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  z-index: 2;
}}
.heading-name {{
  font-size: 34px;
  font-weight: 500;
  color: #F8F5EE;
  letter-spacing: 0.04em;
}}
.heading-sub {{
  font-size: 11.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #C5A880;
  font-weight: 600;
  margin-top: 4px;
}}
.services-box {{
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(197, 168, 128, 0.25);
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 12px;
  color: #E2DDD5;
  line-height: 1.5;
}}
.contact-items {{
  display: flex;
  flex-direction: column;
  gap: 11px;
}}
.c-item {{
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 14.5px;
  color: #E2DDD5;
}}
.c-item strong {{
  color: #FFFFFF;
  font-size: 15px;
}}
.c-box {{
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(197, 168, 128, 0.15);
  border: 1px solid rgba(197, 168, 128, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #C5A880;
}}
.c-icon {{
  width: 16px;
  height: 16px;
}}
.right-col {{
  width: 290px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-left: 1px solid rgba(197, 168, 128, 0.25);
  padding-left: 45px;
  z-index: 2;
}}
.white-qr-card {{
  background: #FFFFFF;
  padding: 16px;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.35);
  text-align: center;
}}
.white-qr-card img {{
  width: 155px;
  height: 155px;
  display: block;
}}
.qr-title {{
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #232A20;
  margin-top: 10px;
}}
.hours-tag {{
  margin-top: 14px;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: #C5A880;
  text-align: center;
}}
</style>
</head>
<body>
<div class="card">
  <div class="border-gold"></div>

  <div class="left-col">
    <div>
      <div class="heading-name serif">Яна Кърнолска</div>
      <div class="heading-sub sans">Психологически консултации</div>
    </div>

    <div class="services-box sans">
      &bull; Психолог &bull; Спортен психолог<br>
      &bull; Организационен и социален психолог
    </div>

    <div class="contact-items sans">
      <div class="c-item">
        <div class="c-box">{PHONE_SVG}</div>
        <span><strong>+359 887 344 424</strong></span>
      </div>
      <div class="c-item">
        <div class="c-box">{MAIL_SVG}</div>
        <span>yanakarnolska@gmail.com</span>
      </div>
      <div class="c-item">
        <div class="c-box">{PIN_SVG}</div>
        <span>гр. София, ул. „Оборище“ 42 &bull; Онлайн</span>
      </div>
      <div class="c-item">
        <div class="c-box">{WEB_SVG}</div>
        <span>yanapsychology.com</span>
      </div>
    </div>
  </div>

  <div class="right-col">
    <div class="white-qr-card">
      <img src="../assets/qr_code.svg" alt="QR Code" />
      <div class="qr-title sans">ЗАПАЗЕТЕ ЧАС</div>
    </div>
    <div class="hours-tag sans">Пон – Пет: 09:00 – 19:00 ч.</div>
  </div>
</div>
</body>
</html>"""

# ==============================================================================
# DESIGN 4: "Classic Harmony Portrait"
# ==============================================================================
D4_FRONT = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
{COMMON_FONTS}
<style>
{COMMON_STYLE}
.card {{
  background: #F8F5EE;
  color: #2C2A29;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 38px 52px;
  position: relative;
}}
.left-col {{
  flex: 1;
  max-width: 520px;
  z-index: 2;
}}
.monogram-bar {{
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}}
.circle-logo {{
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #4E5848;
  color: #FAF7F2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  letter-spacing: -1px;
}}
.logo-label {{
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #6C7564;
  font-weight: 600;
}}
.fullname {{
  font-size: 48px;
  font-weight: 500;
  line-height: 1.05;
  color: #242220;
  margin-bottom: 8px;
}}
.titles-flow {{
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #747D68;
  margin-bottom: 18px;
  line-height: 1.6;
}}
.titles-flow span {{
  color: #C5A880;
}}
.direct-contacts {{
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: #4D4A47;
  border-top: 1px solid #E5DED2;
  padding-top: 14px;
}}
.contact-line {{
  display: flex;
  align-items: center;
  gap: 10px;
}}
.contact-line strong {{
  color: #242220;
}}
.right-col {{
  z-index: 2;
}}
.photo-frame {{
  width: 320px;
  height: 440px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 16px 35px rgba(62, 71, 57, 0.16);
  border: 4px solid #FFFFFF;
  position: relative;
  background: #EAE5DB;
}}
.photo-frame img {{
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 8%;
}}
.photo-badge {{
  position: absolute;
  bottom: 14px;
  left: 14px;
  right: 14px;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(8px);
  padding: 8px 14px;
  border-radius: 12px;
  text-align: center;
  font-size: 13px;
  font-style: italic;
  color: #384233;
}}
</style>
</head>
<body>
<div class="card">
  <div class="left-col">
    <div class="monogram-bar">
      <div class="circle-logo serif">ЯК</div>
      <div class="logo-label sans">Психологически кабинет</div>
    </div>
    <div class="fullname serif">Яна Кърнолска</div>
    <div class="titles-flow sans">
      Психолог <span>&bull;</span> Спортен психолог<br>
      Организационен и социален психолог
    </div>
    <div class="direct-contacts sans">
      <div class="contact-line">
        <span>Телефон:</span>
        <strong>+359 887 344 424</strong>
      </div>
      <div class="contact-line">
        <span>Локация:</span>
        <span>гр. София, ул. „Оборище“ 42 &bull; Онлайн</span>
      </div>
      <div class="contact-line">
        <span>Уебсайт:</span>
        <span>yanapsychology.com</span>
      </div>
    </div>
  </div>

  <div class="right-col">
    <div class="photo-frame">
      <img src="../assets/owner.png" alt="Яна Кърнолска" />
      <div class="photo-badge serif">Подкрепа. Разбиране. Промяна.</div>
    </div>
  </div>
</div>
</body>
</html>"""

D4_BACK = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
{COMMON_FONTS}
<style>
{COMMON_STYLE}
.card {{
  background: #F2EEE5;
  color: #2C2A29;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 52px;
  position: relative;
}}
.card-border {{
  position: absolute;
  top: 16px; left: 16px; right: 16px; bottom: 16px;
  border: 1px solid #DCD3C3;
  border-radius: 16px;
  pointer-events: none;
}}
.left-col {{
  flex: 1;
  max-width: 530px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  z-index: 2;
}}
.header-area {{
  margin-bottom: 2px;
}}
.h-name {{
  font-size: 34px;
  font-weight: 500;
  color: #22201F;
}}
.h-sub {{
  font-size: 11px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #5E6954;
  font-weight: 600;
  margin-top: 4px;
}}
.services-card {{
  background: #FAF7F0;
  border: 1px solid #E5DDCF;
  border-radius: 14px;
  padding: 10px 16px;
}}
.services-card-title {{
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #4B5543;
  margin-bottom: 6px;
}}
.services-list {{
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12.5px;
  color: #44413E;
}}
.bullet-item {{
  display: flex;
  align-items: center;
  gap: 8px;
}}
.bullet-dot {{
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #C5A880;
}}
.contact-rows {{
  display: flex;
  flex-direction: column;
  gap: 9px;
}}
.c-row {{
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 14px;
  color: #383532;
}}
.c-row strong {{
  color: #201E1C;
}}
.c-row-icon {{
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #FAF7F0;
  border: 1px solid #E2D9CA;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4B5543;
}}
.right-col {{
  width: 290px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #DFD6C7;
  padding-left: 45px;
  z-index: 2;
}}
.qr-frame {{
  background: #FFFFFF;
  padding: 16px;
  border-radius: 22px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.06);
  border: 1px solid #E5DCCE;
  text-align: center;
}}
.qr-frame img {{
  width: 155px;
  height: 155px;
  display: block;
}}
.qr-cta {{
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #4B5543;
  margin-top: 10px;
}}
.schedule-info {{
  margin-top: 14px;
  font-size: 11.5px;
  color: #65615C;
  text-align: center;
  background: #E8E2D6;
  padding: 6px 14px;
  border-radius: 20px;
}}
</style>
</head>
<body>
<div class="card">
  <div class="card-border"></div>

  <div class="left-col">
    <div class="header-area">
      <div class="h-name serif">Яна Кърнолска</div>
      <div class="h-sub sans">Психологическо консултиране</div>
    </div>

    <div class="services-card sans">
      <div class="services-card-title">Направления на дейност</div>
      <div class="services-list">
        <div class="bullet-item"><div class="bullet-dot"></div><span>Психолог &bull; Индивидуална терапия и двойки</span></div>
        <div class="bullet-item"><div class="bullet-dot"></div><span>Спортен психолог &bull; Ментална устойчивост</span></div>
        <div class="bullet-item"><div class="bullet-dot"></div><span>Организационен и социален психолог</span></div>
      </div>
    </div>

    <div class="contact-rows sans">
      <div class="c-row">
        <div class="c-row-icon">{PHONE_SVG}</div>
        <span><strong>0887 344 424</strong> / +359 887 344 424</span>
      </div>
      <div class="c-row">
        <div class="c-row-icon">{MAIL_SVG}</div>
        <span>yanakarnolska@gmail.com</span>
      </div>
      <div class="c-row">
        <div class="c-row-icon">{PIN_SVG}</div>
        <span>гр. София, ул. „Оборище“ 42 &bull; Онлайн</span>
      </div>
    </div>
  </div>

  <div class="right-col">
    <div class="qr-frame">
      <img src="../assets/qr_code.svg" alt="QR Code" />
      <div class="qr-cta sans">СКАНИРАЙ ЗА ГРАФИК</div>
    </div>
    <div class="schedule-info sans">Понеделник – Петък: 09:00 – 19:00 ч.</div>
  </div>
</div>
</body>
</html>"""

# ==============================================================================
# DESIGN 5: "Corporate & Sport Executive" (NEW)
# ==============================================================================
D5_FRONT = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
{COMMON_FONTS}
<style>
{COMMON_STYLE}
.card {{
  background: linear-gradient(135deg, #1C2319 0%, #2A3326 50%, #1A2117 100%);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 52px;
}}
.gold-edge {{
  position: absolute;
  top: 16px; left: 16px; right: 16px; bottom: 16px;
  border: 1px solid rgba(212, 184, 146, 0.4);
  border-radius: 14px;
  pointer-events: none;
}}
.left-col {{
  flex: 1;
  max-width: 530px;
  z-index: 2;
}}
.top-header-line {{
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}}
.gold-pill {{
  background: rgba(212, 184, 146, 0.15);
  border: 1px solid #D4B892;
  color: #F0DFC8;
  font-size: 10.5px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
}}
.name {{
  font-size: 50px;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 1.05;
  letter-spacing: 0.02em;
  margin-bottom: 16px;
}}
.roles-box {{
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 22px;
}}
.role-badge {{
  background: rgba(255, 255, 255, 0.06);
  border-left: 3px solid #D4B892;
  padding: 6px 14px;
  border-radius: 0 8px 8px 0;
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #F7EFE4;
  font-weight: 600;
}}
.bottom-quote {{
  font-size: 19px;
  font-style: italic;
  color: #D6CEBE;
}}
.right-col {{
  z-index: 2;
}}
.portrait-box {{
  width: 310px;
  height: 440px;
  border-radius: 28px;
  border: 2px solid #D4B892;
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(0,0,0,0.55);
  background: #EAE5DB;
}}
.portrait-box img {{
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 8%;
}}
</style>
</head>
<body>
<div class="card">
  <div class="gold-edge"></div>
  <div class="left-col">
    <div class="top-header-line">
      <div class="gold-pill sans">Експертна практика</div>
      <span class="sans" style="font-size: 11px; letter-spacing: 0.2em; color: #D4B892;">СОФИЯ &bull; ОНЛАЙН</span>
    </div>
    <div class="name serif">Яна Кърнолска</div>
    <div class="roles-box sans">
      <div class="role-badge">Психолог</div>
      <div class="role-badge">Спортен психолог</div>
      <div class="role-badge">Организационен и социален психолог</div>
    </div>
    <div class="bottom-quote serif">„Пространство за доверие, приемане и промяна.“</div>
  </div>
  <div class="right-col">
    <div class="portrait-box">
      <img src="../assets/owner.png" alt="Яна Кърнолска" />
    </div>
  </div>
</div>
</body>
</html>"""

D5_BACK = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
{COMMON_FONTS}
<style>
{COMMON_STYLE}
.card {{
  background: #1C2319;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 38px 52px;
  position: relative;
}}
.gold-edge {{
  position: absolute;
  top: 16px; left: 16px; right: 16px; bottom: 16px;
  border: 1px solid rgba(212, 184, 146, 0.4);
  border-radius: 14px;
  pointer-events: none;
}}
.left-col {{
  flex: 1;
  max-width: 540px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  z-index: 2;
}}
.header-box {{
  display: flex;
  align-items: center;
  gap: 14px;
}}
.mono-circle {{
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid #D4B892;
  color: #F0DFC8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: rgba(212, 184, 146, 0.1);
}}
.header-name {{
  font-size: 26px;
  color: #FFFFFF;
  letter-spacing: 0.04em;
}}
.header-role {{
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #D4B892;
  font-weight: 600;
}}
.pillars-grid {{
  display: grid;
  grid-template-columns: 1fr;
  gap: 7px;
}}
.pillar-row {{
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(212, 184, 146, 0.2);
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 12.5px;
  color: #EAE5DB;
}}
.pillar-row strong {{
  color: #D4B892;
}}
.contact-items {{
  display: flex;
  flex-direction: column;
  gap: 10px;
}}
.c-item {{
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 14.5px;
  color: #EAE5DB;
}}
.c-item strong {{
  color: #FFFFFF;
}}
.c-icon {{
  width: 17px;
  height: 17px;
  color: #D4B892;
}}
.right-col {{
  width: 290px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-left: 1px solid rgba(212, 184, 146, 0.25);
  padding-left: 45px;
  z-index: 2;
}}
.white-qr-card {{
  background: #FFFFFF;
  padding: 16px;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.4);
  text-align: center;
}}
.white-qr-card img {{
  width: 155px;
  height: 155px;
  display: block;
}}
.qr-title {{
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #1C2319;
  margin-top: 10px;
}}
.hours-tag {{
  margin-top: 14px;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: #D4B892;
  text-align: center;
}}
</style>
</head>
<body>
<div class="card">
  <div class="gold-edge"></div>
  <div class="left-col">
    <div class="header-box">
      <div class="mono-circle serif">ЯК</div>
      <div>
        <div class="header-name serif">Яна Кърнолска</div>
        <div class="header-role sans">Психологическо консултиране</div>
      </div>
    </div>
    <div class="pillars-grid sans">
      <div class="pillar-row"><strong>&bull; Психолог</strong> &ndash; Индивидуална терапия и терапия за двойки</div>
      <div class="pillar-row"><strong>&bull; Спортен психолог</strong> &ndash; Ментална устойчивост и фокус</div>
      <div class="pillar-row"><strong>&bull; Организационен и социален психолог</strong> &ndash; Лидерство &amp; екипи</div>
    </div>
    <div class="contact-items sans">
      <div class="c-item">
        <div class="c-icon">{PHONE_SVG}</div>
        <span><strong>+359 887 344 424</strong> / 0887 344 424</span>
      </div>
      <div class="c-item">
        <div class="c-icon">{MAIL_SVG}</div>
        <span>yanakarnolska@gmail.com</span>
      </div>
      <div class="c-item">
        <div class="c-icon">{PIN_SVG}</div>
        <span>гр. София, ул. „Оборище“ 42 &bull; Онлайн</span>
      </div>
    </div>
  </div>
  <div class="right-col">
    <div class="white-qr-card">
      <img src="../assets/qr_code.svg" alt="QR Code" />
      <div class="qr-title sans">ЗАПАЗЕТЕ ЧАС</div>
    </div>
    <div class="hours-tag sans">Пон – Пет: 09:00 – 19:00 ч.</div>
  </div>
</div>
</body>
</html>"""

# ==============================================================================
# DESIGN 6: "Editorial Ivory & Gold" (NEW)
# ==============================================================================
D6_FRONT = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
{COMMON_FONTS}
<style>
{COMMON_STYLE}
.card {{
  background: #F7F4EE;
  color: #262422;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 52px;
  position: relative;
}}
.frame-outer {{
  position: absolute;
  top: 16px; left: 16px; right: 16px; bottom: 16px;
  border: 1px solid #C5A880;
  border-radius: 12px;
  pointer-events: none;
}}
.frame-inner {{
  position: absolute;
  top: 22px; left: 22px; right: 22px; bottom: 22px;
  border: 1px solid rgba(197, 168, 128, 0.35);
  border-radius: 8px;
  pointer-events: none;
}}
.left-col {{
  flex: 1;
  max-width: 530px;
  z-index: 2;
}}
.monogram-line {{
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}}
.monogram-box {{
  font-size: 32px;
  color: #4A5445;
  line-height: 1;
}}
.tag-line {{
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #8C7355;
  font-weight: 600;
}}
.name {{
  font-size: 52px;
  font-weight: 500;
  line-height: 1.05;
  color: #1F1D1B;
  margin-bottom: 16px;
  letter-spacing: 0.02em;
}}
.triad-roles {{
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 22px;
}}
.t-role {{
  font-size: 12px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #556050;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}}
.t-role span {{
  color: #C5A880;
  font-size: 10px;
}}
.slogan {{
  font-size: 20px;
  font-style: italic;
  color: #635F59;
}}
.right-col {{
  z-index: 2;
}}
.arch-window {{
  width: 310px;
  height: 440px;
  border-radius: 155px 155px 16px 16px;
  border: 2px solid #C5A880;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(74, 84, 69, 0.18);
  background: #EAE5DB;
}}
.arch-window img {{
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 8%;
}}
</style>
</head>
<body>
<div class="card">
  <div class="frame-outer"></div>
  <div class="frame-inner"></div>
  <div class="left-col">
    <div class="monogram-line">
      <div class="monogram-box serif">ЯК</div>
      <div class="tag-line sans">Психологически консултации</div>
    </div>
    <div class="name serif">Яна Кърнолска</div>
    <div class="triad-roles sans">
      <div class="t-role"><span>♦</span> Психолог</div>
      <div class="t-role"><span>♦</span> Спортен психолог</div>
      <div class="t-role"><span>♦</span> Организационен и социален психолог</div>
    </div>
    <div class="slogan serif">„Подкрепа. Разбиране. Промяна.“</div>
  </div>
  <div class="right-col">
    <div class="arch-window">
      <img src="../assets/owner.png" alt="Яна Кърнолска" />
    </div>
  </div>
</div>
</body>
</html>"""

D6_BACK = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
{COMMON_FONTS}
<style>
{COMMON_STYLE}
.card {{
  background: #F7F4EE;
  color: #262422;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 52px;
  position: relative;
}}
.frame-outer {{
  position: absolute;
  top: 16px; left: 16px; right: 16px; bottom: 16px;
  border: 1px solid #C5A880;
  border-radius: 12px;
  pointer-events: none;
}}
.left-col {{
  flex: 1;
  max-width: 530px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  z-index: 2;
}}
.head-block {{
  margin-bottom: 2px;
}}
.h-title {{
  font-size: 32px;
  font-weight: 500;
  color: #1F1D1B;
}}
.h-roles {{
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #747D68;
  margin-top: 4px;
}}
.services-card {{
  background: #EFE9DE;
  border: 1px solid #E0D6C5;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 12.5px;
  color: #3F3B36;
  line-height: 1.5;
}}
.contact-rows {{
  display: flex;
  flex-direction: column;
  gap: 10px;
}}
.c-row {{
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 14px;
  color: #383532;
}}
.c-row strong {{
  color: #1F1D1B;
}}
.c-icon {{
  width: 18px;
  height: 18px;
  color: #4A5445;
}}
.right-col {{
  width: 290px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #E2D8C7;
  padding-left: 45px;
  z-index: 2;
}}
.qr-frame {{
  background: #FFFFFF;
  padding: 16px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.06);
  border: 1px solid #E0D6C5;
  text-align: center;
}}
.qr-frame img {{
  width: 155px;
  height: 155px;
  display: block;
}}
.qr-title {{
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #4A5445;
  margin-top: 10px;
}}
.hours-tag {{
  margin-top: 14px;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: #6B655D;
  text-align: center;
}}
</style>
</head>
<body>
<div class="card">
  <div class="frame-outer"></div>
  <div class="left-col">
    <div class="head-block">
      <div class="h-title serif">Яна Кърнолска</div>
      <div class="h-roles sans">Психолог &bull; Консултант &bull; Ментор</div>
    </div>
    <div class="services-card sans">
      &bull; Психолог &ndash; Индивидуална терапия и терапия за двойки<br>
      &bull; Спортен психолог &ndash; Ментална устойчивост и фокус<br>
      &bull; Организационен и социален психолог &ndash; Екипи &amp; бизнес
    </div>
    <div class="contact-rows sans">
      <div class="c-row">
        <div class="c-icon">{PHONE_SVG}</div>
        <span><strong>0887 344 424</strong> / +359 887 344 424</span>
      </div>
      <div class="c-row">
        <div class="c-icon">{MAIL_SVG}</div>
        <span>yanakarnolska@gmail.com</span>
      </div>
      <div class="c-row">
        <div class="c-icon">{PIN_SVG}</div>
        <span>гр. София, ул. „Оборище“ 42 &bull; Онлайн</span>
      </div>
      <div class="c-row">
        <div class="c-icon">{WEB_SVG}</div>
        <span>yanapsychology.com</span>
      </div>
    </div>
  </div>
  <div class="right-col">
    <div class="qr-frame">
      <img src="../assets/qr_code.svg" alt="QR Code" />
      <div class="qr-title sans">ЗАПАЗЕТЕ ЧАС</div>
    </div>
    <div class="hours-tag sans">Понеделник – Петък: 09:00 – 19:00 ч.</div>
  </div>
</div>
</body>
</html>"""

# ==============================================================================
# DESIGN 7: "Athletic & Mental Resilience" (NEW)
# ==============================================================================
D7_FRONT = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
{COMMON_FONTS}
<style>
{COMMON_STYLE}
.card {{
  background: #3B4638;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 50px;
  position: relative;
}}
.left-col {{
  flex: 1;
  max-width: 530px;
  z-index: 2;
}}
.monogram-badge {{
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.18);
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 18px;
}}
.monogram-badge span {{
  font-size: 11px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #E2DDD5;
  font-weight: 600;
}}
.name {{
  font-size: 52px;
  font-weight: 500;
  line-height: 1.05;
  color: #FFFFFF;
  letter-spacing: 0.02em;
  margin-bottom: 16px;
}}
.pill-badges {{
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 22px;
}}
.pill-item {{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #F8F5EE;
  font-weight: 600;
}}
.pill-item::before {{
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: #C5A880;
}}
.slogan-box {{
  border-left: 2px solid #C5A880;
  padding-left: 14px;
}}
.slogan {{
  font-size: 20px;
  font-style: italic;
  color: #E2DBD0;
}}
.right-col {{
  z-index: 2;
}}
.photo-container {{
  width: 320px;
  height: 440px;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(0,0,0,0.45);
  border: 3px solid rgba(255, 255, 255, 0.2);
  background: #EAE5DB;
}}
.photo-container img {{
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 8%;
}}
</style>
</head>
<body>
<div class="card">
  <div class="left-col">
    <div class="monogram-badge">
      <span class="serif" style="font-size: 16px; color: #C5A880;">ЯК</span>
      <span class="sans">МЕНТАЛНА УСТОЙЧИВОСТ</span>
    </div>
    <div class="name serif">Яна Кърнолска</div>
    <div class="pill-badges sans">
      <div class="pill-item">Психолог</div>
      <div class="pill-item">Спортен психолог</div>
      <div class="pill-item">Организационен и социален психолог</div>
    </div>
    <div class="slogan-box">
      <div class="slogan serif">„Устойчивост, мотивация и съзидателна промяна.“</div>
    </div>
  </div>
  <div class="right-col">
    <div class="photo-container">
      <img src="../assets/owner.png" alt="Яна Кърнолска" />
    </div>
  </div>
</div>
</body>
</html>"""

D7_BACK = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
{COMMON_FONTS}
<style>
{COMMON_STYLE}
.card {{
  background: #FAF7F2;
  color: #2C2A29;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 52px;
  position: relative;
}}
.border-frame {{
  position: absolute;
  top: 16px; left: 16px; right: 16px; bottom: 16px;
  border: 1px solid #DDD6C8;
  border-radius: 14px;
  pointer-events: none;
}}
.left-col {{
  flex: 1;
  max-width: 530px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  z-index: 2;
}}
.name-area {{
  margin-bottom: 2px;
}}
.main-name {{
  font-size: 34px;
  font-weight: 500;
  color: #262423;
  line-height: 1.1;
}}
.sub-roles {{
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #556050;
  margin-top: 4px;
}}
.specs-container {{
  display: flex;
  flex-direction: column;
  gap: 6px;
}}
.spec-box {{
  background: #EFE9DE;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 12.5px;
  color: #383533;
}}
.spec-box strong {{
  color: #4A5445;
}}
.contacts-list {{
  display: flex;
  flex-direction: column;
  gap: 10px;
}}
.c-item {{
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #383533;
}}
.c-item strong {{
  color: #262423;
}}
.c-icon {{
  width: 18px;
  height: 18px;
  color: #4A5445;
}}
.right-col {{
  width: 290px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #E2D8C7;
  padding-left: 45px;
  z-index: 2;
}}
.qr-card {{
  background: #FFFFFF;
  padding: 16px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.06);
  border: 1px solid #E2D8C7;
  text-align: center;
}}
.qr-card img {{
  width: 155px;
  height: 155px;
  display: block;
}}
.qr-hint {{
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #4A5445;
  margin-top: 10px;
}}
.hours-info {{
  margin-top: 14px;
  font-size: 11px;
  letter-spacing: 0.06em;
  color: #55524E;
  text-align: center;
  background: #EFE9DE;
  padding: 5px 12px;
  border-radius: 12px;
}}
</style>
</head>
<body>
<div class="card">
  <div class="border-frame"></div>
  <div class="left-col">
    <div class="name-area">
      <div class="main-name serif">Яна Кърнолска</div>
      <div class="sub-roles sans">Психолог &bull; Консултант &bull; Ментор</div>
    </div>
    <div class="specs-container sans">
      <div class="spec-box"><strong>Психолог:</strong> Индивидуално и семейно консултиране</div>
      <div class="spec-box"><strong>Спортен психолог:</strong> Ментална издръжливост &amp; спорт</div>
      <div class="spec-box"><strong>Организационен &amp; социален психолог:</strong> Екипи &amp; бизнес</div>
    </div>
    <div class="contacts-list sans">
      <div class="c-item">
        <div class="c-icon">{PHONE_SVG}</div>
        <span><strong>+359 887 344 424</strong> / 0887 344 424</span>
      </div>
      <div class="c-item">
        <div class="c-icon">{MAIL_SVG}</div>
        <span>yanakarnolska@gmail.com</span>
      </div>
      <div class="c-item">
        <div class="c-icon">{PIN_SVG}</div>
        <span>гр. София, ул. „Оборище“ 42 &bull; Онлайн</span>
      </div>
    </div>
  </div>
  <div class="right-col">
    <div class="qr-card">
      <img src="../assets/qr_code.svg" alt="QR Code" />
      <div class="qr-hint sans">ЗАПАЗИ СВОЯ ЧАС</div>
    </div>
    <div class="hours-info sans">Понеделник – Петък: 09:00 – 19:00 ч.</div>
  </div>
</div>
</body>
</html>"""

# ==============================================================================
# DESIGN 8: "Midnight Onyx & Bronze" (NEW)
# ==============================================================================
D8_FRONT = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
{COMMON_FONTS}
<style>
{COMMON_STYLE}
.card {{
  background: #171B15;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 52px;
  position: relative;
}}
.left-col {{
  flex: 1;
  max-width: 530px;
  z-index: 2;
}}
.top-monogram {{
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}}
.monogram-sq {{
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: rgba(197, 168, 128, 0.15);
  border: 1px solid #C5A880;
  color: #F8F5EE;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
}}
.sq-label {{
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #C5A880;
  font-weight: 600;
}}
.name {{
  font-size: 52px;
  font-weight: 500;
  line-height: 1.05;
  color: #FFFFFF;
  letter-spacing: 0.02em;
  margin-bottom: 16px;
}}
.roles-stack {{
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 24px;
}}
.r-badge {{
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #D6BD96;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}}
.r-badge::before {{
  content: "";
  display: inline-block;
  width: 14px;
  height: 1.5px;
  background: #C5A880;
}}
.bottom-url {{
  font-size: 13px;
  letter-spacing: 0.18em;
  color: #A39D93;
}}
.right-col {{
  z-index: 2;
}}
.portrait-round {{
  width: 320px;
  height: 440px;
  border-radius: 160px;
  border: 2px solid #C5A880;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.6);
  background: #EAE5DB;
}}
.portrait-round img {{
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 8%;
}}
</style>
</head>
<body>
<div class="card">
  <div class="left-col">
    <div class="top-monogram">
      <div class="monogram-sq serif">ЯК</div>
      <div class="sq-label sans">ПСИХОЛОГИЧЕСКА ПРАКТИКА</div>
    </div>
    <div class="name serif">Яна Кърнолска</div>
    <div class="roles-stack sans">
      <div class="r-badge">Психолог</div>
      <div class="r-badge">Спортен психолог</div>
      <div class="r-badge">Организационен и социален психолог</div>
    </div>
    <div class="bottom-url sans">yanapsychology.com &bull; София &bull; Онлайн</div>
  </div>
  <div class="right-col">
    <div class="portrait-round">
      <img src="../assets/owner.png" alt="Яна Кърнолска" />
    </div>
  </div>
</div>
</body>
</html>"""

D8_BACK = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
{COMMON_FONTS}
<style>
{COMMON_STYLE}
.card {{
  background: #171B15;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 52px;
  position: relative;
}}
.gold-border {{
  position: absolute;
  top: 16px; left: 16px; right: 16px; bottom: 16px;
  border: 1px solid rgba(197, 168, 128, 0.3);
  border-radius: 12px;
  pointer-events: none;
}}
.left-col {{
  flex: 1;
  max-width: 530px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  z-index: 2;
}}
.top-title {{
  font-size: 34px;
  font-weight: 500;
  color: #FFFFFF;
}}
.top-sub {{
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #C5A880;
  font-weight: 600;
  margin-top: 4px;
}}
.spec-box {{
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(197, 168, 128, 0.2);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 12.5px;
  color: #E2DDD5;
  line-height: 1.5;
}}
.spec-box strong {{
  color: #C5A880;
}}
.contact-items {{
  display: flex;
  flex-direction: column;
  gap: 10px;
}}
.c-row {{
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 14.5px;
  color: #E2DDD5;
}}
.c-row strong {{
  color: #FFFFFF;
}}
.c-icon {{
  width: 17px;
  height: 17px;
  color: #C5A880;
}}
.right-col {{
  width: 290px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-left: 1px solid rgba(197, 168, 128, 0.2);
  padding-left: 45px;
  z-index: 2;
}}
.qr-box {{
  background: #FFFFFF;
  padding: 16px;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.5);
  text-align: center;
}}
.qr-box img {{
  width: 155px;
  height: 155px;
  display: block;
}}
.qr-text {{
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #171B15;
  margin-top: 10px;
}}
.hours-tag {{
  margin-top: 14px;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: #C5A880;
  text-align: center;
}}
</style>
</head>
<body>
<div class="card">
  <div class="gold-border"></div>
  <div class="left-col">
    <div>
      <div class="top-title serif">Яна Кърнолска</div>
      <div class="top-sub sans">Психологически консултации</div>
    </div>
    <div class="spec-box sans">
      &bull; <strong>Психолог</strong> &ndash; Индивидуална терапия и двойки<br>
      &bull; <strong>Спортен психолог</strong> &ndash; Ментална устойчивост<br>
      &bull; <strong>Организационен и социален психолог</strong>
    </div>
    <div class="contact-items sans">
      <div class="c-row">
        <div class="c-icon">{PHONE_SVG}</div>
        <span><strong>+359 887 344 424</strong> / 0887 344 424</span>
      </div>
      <div class="c-row">
        <div class="c-icon">{MAIL_SVG}</div>
        <span>yanakarnolska@gmail.com</span>
      </div>
      <div class="c-row">
        <div class="c-icon">{PIN_SVG}</div>
        <span>гр. София, ул. „Оборище“ 42 &bull; Онлайн</span>
      </div>
      <div class="c-row">
        <div class="c-icon">{WEB_SVG}</div>
        <span>yanapsychology.com</span>
      </div>
    </div>
  </div>
  <div class="right-col">
    <div class="qr-box">
      <img src="../assets/qr_code.svg" alt="QR Code" />
      <div class="qr-text sans">ЗАПАЗЕТЕ ЧАС</div>
    </div>
    <div class="hours-tag sans">Пон – Пет: 09:00 – 19:00 ч.</div>
  </div>
</div>
</body>
</html>"""

TEMPLATES = [
    ("design1_front.html", D1_FRONT, "card1-olive-gold-front.png"),
    ("design1_back.html", D1_BACK, "card1-olive-gold-back.png"),
    ("design2_front.html", D2_FRONT, "card2-cream-minimal-front.png"),
    ("design2_back.html", D2_BACK, "card2-cream-minimal-back.png"),
    ("design3_front.html", D3_FRONT, "card3-modern-split-front.png"),
    ("design3_back.html", D3_BACK, "card3-modern-split-back.png"),
    ("design4_front.html", D4_FRONT, "card4-harmony-portrait-front.png"),
    ("design4_back.html", D4_BACK, "card4-harmony-portrait-back.png"),
    ("design5_front.html", D5_FRONT, "card5-executive-dark-front.png"),
    ("design5_back.html", D5_BACK, "card5-executive-dark-back.png"),
    ("design6_front.html", D6_FRONT, "card6-ivory-gold-front.png"),
    ("design6_back.html", D6_BACK, "card6-ivory-gold-back.png"),
    ("design7_front.html", D7_FRONT, "card7-resilience-sage-front.png"),
    ("design7_back.html", D7_BACK, "card7-resilience-sage-back.png"),
    ("design8_front.html", D8_FRONT, "card8-midnight-bronze-front.png"),
    ("design8_back.html", D8_BACK, "card8-midnight-bronze-back.png"),
]

for filename, content, _ in TEMPLATES:
    file_path = os.path.join(TEMPLATES_DIR, filename)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
print(f"Saved all {len(TEMPLATES)} HTML templates.")

print("Starting Playwright to render high-res PNG and PDF files...")
with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(
        viewport={"width": 1004, "height": 650},
        device_scale_factor=2
    )
    page = context.new_page()

    # Render PNGs
    for filename, _, png_name in TEMPLATES:
        html_file = os.path.join(TEMPLATES_DIR, filename)
        file_url = f"file:///{html_file.replace(os.sep, '/')}"
        page.goto(file_url, wait_until="networkidle")
        page.evaluate("document.fonts.ready")
        
        output_png = os.path.join(BC_DIR, png_name)
        page.screenshot(path=output_png, clip={"x": 0, "y": 0, "width": 1004, "height": 650})
        print(f"Rendered PNG: {png_name}")

    # Render vector PDFs
    designs_info = [
        ("card1-olive-gold", "design1_front.html", "design1_back.html"),
        ("card2-cream-minimal", "design2_front.html", "design2_back.html"),
        ("card3-modern-split", "design3_front.html", "design3_back.html"),
        ("card4-harmony-portrait", "design4_front.html", "design4_back.html"),
        ("card5-executive-dark", "design5_front.html", "design5_back.html"),
        ("card6-ivory-gold", "design6_front.html", "design6_back.html"),
        ("card7-resilience-sage", "design7_front.html", "design7_back.html"),
        ("card8-midnight-bronze", "design8_front.html", "design8_back.html"),
    ]

    for en_name, front_file, back_file in designs_info:
        front_html_path = os.path.join(TEMPLATES_DIR, front_file)
        back_html_path = os.path.join(TEMPLATES_DIR, back_file)
        with open(front_html_path, "r", encoding="utf-8") as f:
            f_content = f.read()
        with open(back_html_path, "r", encoding="utf-8") as f:
            b_content = f.read()

        f_body = re.search(r"<body[^>]*>(.*?)</body>", f_content, re.DOTALL).group(1)
        b_body = re.search(r"<body[^>]*>(.*?)</body>", b_content, re.DOTALL).group(1)
        f_style = re.search(r"<style[^>]*>(.*?)</style>", f_content, re.DOTALL).group(1)
        b_style = re.search(r"<style[^>]*>(.*?)</style>", b_content, re.DOTALL).group(1)

        combined_pdf_html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
{COMMON_FONTS}
<style>
{f_style}
{b_style}
@page {{
  size: 85mm 55mm;
  margin: 0;
}}
body {{
  margin: 0;
  padding: 0;
}}
.page-break {{
  page-break-after: always;
  break-after: page;
}}
</style>
</head>
<body>
<div class="page-break">
{f_body}
</div>
<div>
{b_body}
</div>
</body>
</html>"""
        temp_pdf_html = os.path.join(TEMPLATES_DIR, f"{en_name}_combined.html")
        with open(temp_pdf_html, "w", encoding="utf-8") as f:
            f.write(combined_pdf_html)

        page.goto(f"file:///{temp_pdf_html.replace(os.sep, '/')}", wait_until="networkidle")
        page.evaluate("document.fonts.ready")
        pdf_en = os.path.join(BC_DIR, f"{en_name}.pdf")
        page.pdf(
            path=pdf_en,
            width="85mm",
            height="55mm",
            print_background=True,
            margin={"top": "0", "bottom": "0", "left": "0", "right": "0"}
        )
        print(f"Rendered vector PDF: {en_name}.pdf")

    # Generate A4 Printable Sheets (Sheet 1: Designs 1-4, Sheet 2: Designs 5-8)
    sheet1_html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
{COMMON_FONTS}
<style>
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
@page {{
  size: A4 portrait;
  margin: 10mm;
}}
body {{
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #FFFFFF;
  color: #333333;
}}
.header {{
  text-align: center;
  margin-bottom: 6mm;
  border-bottom: 1px solid #CCCCCC;
  padding-bottom: 3mm;
}}
.header h1 {{
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 20pt;
  color: #2E372B;
  margin-bottom: 1.5mm;
}}
.header p {{
  font-size: 8.5pt;
  color: #666666;
}}
.grid {{
  display: grid;
  grid-template-columns: 85mm 85mm;
  grid-gap: 6mm;
  justify-content: center;
}}
.card-item {{
  width: 85mm;
  height: 55mm;
  position: relative;
  border: 0.5px solid #DDDDDD;
  overflow: hidden;
}}
.card-item img {{
  width: 100%;
  height: 100%;
  object-fit: fill;
  display: block;
}}
.label-below {{
  font-size: 7pt;
  color: #888888;
  text-align: center;
  margin-top: 1mm;
}}
.page-break {{
  page-break-after: always;
  break-after: page;
}}
</style>
</head>
<body>
<div class="page-break">
  <div class="header">
    <h1>Яна Кърнолска &bull; Визитки (Лист 1 / Колекция 1)</h1>
    <p>Психолог &bull; Спортен психолог &bull; Организационен и социален психолог | 85 x 55 mm | 300+ DPI</p>
  </div>
  <div class="grid">
    <div>
      <div class="card-item"><img src="card1-olive-gold-front.png" /></div>
      <div class="label-below">Дизайн 1: Премиум Маслина (Лице)</div>
    </div>
    <div>
      <div class="card-item"><img src="card1-olive-gold-back.png" /></div>
      <div class="label-below">Дизайн 1: Премиум Маслина (Гръб)</div>
    </div>
    <div>
      <div class="card-item"><img src="card2-cream-minimal-front.png" /></div>
      <div class="label-below">Дизайн 2: Топъл Крем &amp; Арка (Лице)</div>
    </div>
    <div>
      <div class="card-item"><img src="card2-cream-minimal-back.png" /></div>
      <div class="label-below">Дизайн 2: Топъл Крем &amp; Арка (Гръб)</div>
    </div>
    <div>
      <div class="card-item"><img src="card3-modern-split-front.png" /></div>
      <div class="label-below">Дизайн 3: Модерен Сплит (Лице)</div>
    </div>
    <div>
      <div class="card-item"><img src="card3-modern-split-back.png" /></div>
      <div class="label-below">Дизайн 3: Модерен Сплит (Гръб)</div>
    </div>
    <div>
      <div class="card-item"><img src="card4-harmony-portrait-front.png" /></div>
      <div class="label-below">Дизайн 4: Хармония Портрет (Лице)</div>
    </div>
    <div>
      <div class="card-item"><img src="card4-harmony-portrait-back.png" /></div>
      <div class="label-below">Дизайн 4: Хармония Портрет (Гръб)</div>
    </div>
  </div>
</div>

<div>
  <div class="header">
    <h1>Яна Кърнолска &bull; Визитки (Лист 2 / Нови Концепции)</h1>
    <p>Психолог &bull; Спортен психолог &bull; Организационен и социален психолог | 85 x 55 mm | 300+ DPI</p>
  </div>
  <div class="grid">
    <div>
      <div class="card-item"><img src="card5-executive-dark-front.png" /></div>
      <div class="label-below">Дизайн 5: Екзекютив Триада (Лице)</div>
    </div>
    <div>
      <div class="card-item"><img src="card5-executive-dark-back.png" /></div>
      <div class="label-below">Дизайн 5: Екзекютив Триада (Гръб)</div>
    </div>
    <div>
      <div class="card-item"><img src="card6-ivory-gold-front.png" /></div>
      <div class="label-below">Дизайн 6: Слонова Кост &amp; Злато (Лице)</div>
    </div>
    <div>
      <div class="card-item"><img src="card6-ivory-gold-back.png" /></div>
      <div class="label-below">Дизайн 6: Слонова Кост &amp; Злато (Гръб)</div>
    </div>
    <div>
      <div class="card-item"><img src="card7-resilience-sage-front.png" /></div>
      <div class="label-below">Дизайн 7: Динамика &amp; Баланс (Лице)</div>
    </div>
    <div>
      <div class="card-item"><img src="card7-resilience-sage-back.png" /></div>
      <div class="label-below">Дизайн 7: Динамика &amp; Баланс (Гръб)</div>
    </div>
    <div>
      <div class="card-item"><img src="card8-midnight-bronze-front.png" /></div>
      <div class="label-below">Дизайн 8: Полунощен Оникс (Лице)</div>
    </div>
    <div>
      <div class="card-item"><img src="card8-midnight-bronze-back.png" /></div>
      <div class="label-below">Дизайн 8: Полунощен Оникс (Гръб)</div>
    </div>
  </div>
</div>
</body>
</html>"""
    a4_html_path = os.path.join(TEMPLATES_DIR, "a4_sheet.html")
    with open(a4_html_path, "w", encoding="utf-8") as f:
        f.write(sheet1_html)

    page.goto(f"file:///{a4_html_path.replace(os.sep, '/')}", wait_until="networkidle")
    page.evaluate("document.fonts.ready")
    page.pdf(
        path=os.path.join(BC_DIR, "print-sheet-a4.pdf"),
        format="A4",
        print_background=True,
        margin={"top": "8mm", "bottom": "8mm", "left": "8mm", "right": "8mm"}
    )
    print("Rendered 2-page printable A4 Sheet PDF (all 8 designs)!")

    browser.close()

print("All 8 business card designs rendered successfully in PNG, PDF, and A4 print sheet!")
