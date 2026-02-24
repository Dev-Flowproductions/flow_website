import urllib.request
import os

def download(url, dest):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=20) as r:
            data = r.read()
        with open(dest, 'wb') as f:
            f.write(data)
        print(f"OK  {dest} ({len(data)} bytes)")
    except Exception as e:
        print(f"ERR {dest}: {e}")

# --- Redes Sociais carousel (8 slides) ---
sociais = {
    'dental-hpa':           'https://flowproductions.pt/wp-content/uploads/2025/09/mockup-scaled.jpg',
    'albufeira-dn':         'https://flowproductions.pt/wp-content/uploads/2025/10/Mockup-scaled.png',
    'kubidoce':             'https://flowproductions.pt/wp-content/uploads/2025/09/Mockup-scaled.png',
    'rb-woodfinish':        'https://flowproductions.pt/wp-content/uploads/2025/09/RB_Mockup_1-scaled.jpg',
    'missao-conducao':      'https://flowproductions.pt/wp-content/uploads/2025/11/Comp-1-0-00-10-21.jpg',
    'adm-24':               'https://flowproductions.pt/wp-content/uploads/2025/09/ADM_Mockup-scaled.jpg',
    'nature-soul-food':     'https://flowproductions.pt/wp-content/uploads/2025/09/mockup-verde-scaled.jpg',
    'jardim-aurora':        'https://flowproductions.pt/wp-content/uploads/2025/09/08-mockup-scaled.jpg',
}

# --- Content Writing carousel (6 slides) ---
content = {
    'dias-medievais':       'https://flowproductions.pt/wp-content/uploads/2025/10/Castro-Marim.webp',
    'mia':                  'https://flowproductions.pt/wp-content/uploads/2025/09/MIA.webp',
    'witfy':                'https://flowproductions.pt/wp-content/uploads/2025/10/Witfy-scaled.jpg',
    'pro-am-vilamoura':     'https://flowproductions.pt/wp-content/uploads/2026/02/Thumbnails-DETAILS_3.1.1.jpg-scaled.jpeg',
    'dom-jose':             'https://flowproductions.pt/wp-content/uploads/2025/09/Dom-Jose-Promo-scaled.jpg',
    'ria-shopping':         'https://flowproductions.pt/wp-content/uploads/2025/09/Capa-Olhanense-4K-scaled.jpg',
}

for name, url in sociais.items():
    ext = url.split('.')[-1].split('?')[0]
    download(url, f'public/images/projects/marketing-carousel/sociais-{name}.{ext}')

for name, url in content.items():
    ext = url.split('.')[-1].split('?')[0]
    download(url, f'public/images/projects/marketing-carousel/content-{name}.{ext}')

print("\nDone!")
