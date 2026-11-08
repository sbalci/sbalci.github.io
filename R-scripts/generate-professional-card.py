#!/usr/bin/env python3
"""Build bilingual, print-ready contact cards from the canonical vCard.

Dependencies: reportlab, segno==1.6.6, Pillow, and Poppler (pdftoppm).
Fonts: Open Sans (Apache 2.0), installed in /usr/share/fonts/truetype/open-sans
or set CARD_FONT_DIR. Run: python R-scripts/generate-professional-card.py

The single-sided 90 x 55 mm card includes the exact offline contact QR.
PDF retains vector text and QR modules; PNG is rendered at 600 dpi.
The printer PDF has a 3 mm bleed and PDF TrimBox/BleedBox metadata.
No external QR service, generated QR pattern, portrait alteration, or runtime
web dependency is used. Regenerate after changing the canonical vCard.
"""
import os
from pathlib import Path
import shutil
import subprocess
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.units import mm
import segno

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'links'
FONTS = Path(os.environ.get('CARD_FONT_DIR', '/usr/share/fonts/truetype/open-sans'))
for name, file in [('OpenSans','OpenSans-Regular.ttf'),('OpenSansBold','OpenSans-Bold.ttf'),('OpenSansSemi','OpenSans-Semibold.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(FONTS / file)))
PAYLOAD = (OUT / 'Serdar-Balci.vcf').read_bytes()
assert b'orcid' not in PAYLOAD.lower()
assert PAYLOAD.startswith(b'BEGIN:VCARD\r\nVERSION:3.0\r\n')
for value in ['FN:Serdar Balcı\\, MD', 'ORG:Memorial Healthcare Group', 'TEL;TYPE=CELL,VOICE:+905334472096', 'EMAIL;TYPE=WORK:serdarbalci@serdarbalci.com', 'URL:https://www.serdarbalci.com/links/']:
    assert value.encode('utf-8') in PAYLOAD, f'Contact data changed: review card text ({value})'
QR = segno.make(PAYLOAD.decode('utf-8'), error='m', encoding='utf-8', eci=True, boost_error=False)
MATRIX = list(QR.matrix_iter(scale=1, border=4))
NAVY, TEAL, MUTED, PALE = map(HexColor, ['#102e44', '#087e85', '#496171', '#e2f5f1'])
LANG = {
    'en': {'role':'Pathologist · Researcher · Developer', 'org':'Memorial Healthcare Group', 'city':'Istanbul, Türkiye', 'qr':'SAVE CONTACT · OFFLINE', 'link':'PROFILES & PROJECTS', 'phone':'MOBILE', 'email':'EMAIL'},
    'tr': {'role':'Patoloji Uzmanı · Araştırmacı · Yazılım Geliştirici', 'org':'Memorial Sağlık Grubu', 'city':'İstanbul, Türkiye', 'qr':'KİŞİYİ KAYDET · ÇEVRİMDIŞI', 'link':'PROFİLLER VE PROJELER', 'phone':'CEP TELEFONU', 'email':'E-POSTA'},
}

def create_card(path, lang, bleed=0):
    W, H = 90*mm, 55*mm
    b = bleed*mm
    c = canvas.Canvas(str(path), pagesize=(W+2*b,H+2*b), pageCompression=1, invariant=1)
    c.setTitle(f'Serdar Balcı, MD - Professional card ({lang.upper()})')
    c.setAuthor('Serdar Balcı')
    c.setSubject('90 x 55 mm contact card with offline vCard QR; print at actual size')
    c.setTrimBox((b,b,W+b,H+b))
    c.setBleedBox((0,0,W+2*b,H+2*b))
    c.translate(b,b)
    c.setFillColor(white); c.rect(-b,-b,W+2*b,H+2*b,fill=1,stroke=0)
    c.setFillColor(NAVY); c.rect(-b,H-17.5*mm,W+2*b,17.5*mm+b,fill=1,stroke=0)
    # Restrained corner geometry echoes the page's navy/teal visual identity.
    p=c.beginPath();p.moveTo(78*mm,H+b);p.lineTo(W+b,H+b);p.lineTo(W+b,H-17.5*mm);p.lineTo(87*mm,H-17.5*mm);p.close()
    c.setFillColor(HexColor('#163e53'));c.drawPath(p,fill=1,stroke=0)
    c.setFillColor(TEAL);c.rect(-b,H-18.1*mm,W+2*b,.6*mm,fill=1,stroke=0)
    def text(value,x,y,size=7,font='OpenSans',color=NAVY,align='left',maxwidth=None):
        if maxwidth:
            assert pdfmetrics.stringWidth(value,font,size) <= maxwidth*mm, (value,size,maxwidth)
        c.setFillColor(color);c.setFont(font,size)
        {'left':c.drawString,'center':c.drawCentredString,'right':c.drawRightString}[align](x*mm,H-y*mm,value)
    d=LANG[lang]
    text('Serdar Balcı, MD',5,8.6,17,'OpenSansBold',white,maxwidth=75)
    text(d['role'],5,13.7,7 if lang=='en' else 6.7,'OpenSans',HexColor('#d8eded'),maxwidth=80)
    text(d['org'],5,24.1,8,'OpenSansSemi',maxwidth=48)
    text(d['city'],5,28.1,6.6,color=MUTED,maxwidth=48)
    # Small labels are secondary; all actual contact details remain >= 7.4 pt.
    text(d['phone'],5,33.1,4.7,'OpenSansSemi',TEAL,maxwidth=48)
    text('+90 533 447 20 96',5,37.2,8.1,maxwidth=48)
    text(d['email'],5,41.5,4.7,'OpenSansSemi',TEAL,maxwidth=48)
    text('serdarbalci@serdarbalci.com',5,45.6,7.4,maxwidth=48)
    text('card.serdarbalci.com',5,51.0,7.4,'OpenSansSemi',TEAL,maxwidth=48)
    # Black vector modules, white four-module quiet zone, no logos or decoration.
    x, top, size = 56.0*mm, 19.6*mm, 29.0*mm
    s=size/len(MATRIX)
    c.setFillColor(white);c.rect(x,H-top-size,size,size,fill=1,stroke=0)
    c.setFillColor(black)
    # Merge adjacent modules horizontally to avoid hairline seams on renderers.
    for rownum,row in enumerate(MATRIX):
        start=None
        for col in range(len(row)+1):
            on=col<len(row) and row[col]
            if on and start is None: start=col
            if not on and start is not None:
                c.rect(x+start*s,H-top-(rownum+1)*s,(col-start)*s,s,fill=1,stroke=0)
                start=None
    text(d['qr'],70.5,51.0,4.9 if lang=='en' else 4.5,'OpenSansSemi',MUTED,align='center',maxwidth=30)
    c.linkURL('tel:+905334472096',(5*mm,H-38*mm,50*mm,H-34*mm),relative=1,thickness=0)
    c.linkURL('mailto:serdarbalci@serdarbalci.com',(5*mm,H-46.5*mm,53*mm,H-42.5*mm),relative=1,thickness=0)
    c.linkURL('https://card.serdarbalci.com',(5*mm,H-52*mm,53*mm,H-48*mm),relative=1,thickness=0)
    c.showPage();c.save()

for lang in LANG:
    stem=f'Serdar-Balci-professional-card-{lang}'
    create_card(OUT/f'{stem}.pdf',lang)
    create_card(OUT/f'{stem}-print-bleed.pdf',lang,bleed=3)
    subprocess.run(['pdftoppm','-r','600','-png','-singlefile',str(OUT/f'{stem}.pdf'),str(OUT/stem)],check=True)
    with Image.open(OUT/f'{stem}.png') as img:
        img.save(OUT/f'{stem}.png',dpi=(600,600),optimize=True)
    for suffix in ('.pdf','-print-bleed.pdf','.png'):
        shutil.copyfile(OUT/f'{stem}{suffix}',ROOT/'docs'/'links'/f'{stem}{suffix}')
    print(stem, '90 x 55 mm, 600 dpi PNG, vector PDF, 3 mm bleed PDF')
print('QR:',QR.designator,len(PAYLOAD),'bytes; identical canonical vCard, ORCID excluded')
