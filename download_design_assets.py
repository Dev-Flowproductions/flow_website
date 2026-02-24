import urllib.request
import os
import re

def download(url, dest):
    if not url.startswith('http'):
        url = 'https:' + url
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

# --- Logos for marquee ---
logos = {
    'zion':                 'https://flowproductions.pt/wp-content/uploads/2025/07/ZION.png',
    'albufeira-dn':         'https://flowproductions.pt/wp-content/uploads/2025/07/Albufeira-Digital-Nomads.png',
    'cm-albufeira':         'https://flowproductions.pt/wp-content/uploads/2025/07/CM-Albufeira.png',
    'fujifilm':             'https://flowproductions.pt/wp-content/uploads/2025/07/Fujifilm.png',
    'faro':                 'https://flowproductions.pt/wp-content/uploads/2025/07/Faro.png',
    'inframoura':           'https://flowproductions.pt/wp-content/uploads/2025/07/Inframoura.png',
    'ccdr':                 'https://flowproductions.pt/wp-content/uploads/2025/07/CCDR.png',
    'nature':               'https://flowproductions.pt/wp-content/uploads/2025/07/Nature.png',
    'new-balance':          'https://flowproductions.pt/wp-content/uploads/2025/07/New-Balance.png',
}
for name, url in logos.items():
    ext = url.split('.')[-1]
    download(url, f'public/images/logos/{name}.{ext}')

# --- Carousel project images ---
carousel_imgs = {
    'zion-carousel':             'https://flowproductions.pt/wp-content/uploads/2025/10/Zion-03-scaled.webp',
    'dom-jose-carousel':         'https://flowproductions.pt/wp-content/uploads/2025/07/Cartoes-01-scaled-e1762862752809.png',
    '100lixo-carousel':          'https://flowproductions.pt/wp-content/uploads/2025/09/04-scaled.png',
    'witfy-carousel':            'https://flowproductions.pt/wp-content/uploads/2025/07/Business-Card-scaled.png',
    'albufeira-dn-carousel':     'https://flowproductions.pt/wp-content/uploads/2025/07/PAPERCompressed-scaled.png',
    'cesarius-carousel':         'https://flowproductions.pt/wp-content/uploads/2025/10/Brandbook__V03-9-scaled.png',
    'nature-sf-carousel':        'https://flowproductions.pt/wp-content/uploads/2025/10/garrafa-frente-scaled.jpg',
    'urlegfix-carousel':         'https://flowproductions.pt/wp-content/uploads/2025/10/business-card-proposta-scaled.jpg',
    'rocket-booster-carousel':   'https://flowproductions.pt/wp-content/uploads/2025/07/caneca-Large.png',
    'jardim-aurora-carousel':    'https://flowproductions.pt/wp-content/uploads/2025/09/469-scaled.png',
    'pizza-lab-carousel':        'https://flowproductions.pt/wp-content/uploads/2025/10/Restaurant-Wall-Mockup-1-scaled.jpg',
}
for name, url in carousel_imgs.items():
    ext = url.split('.')[-1].split('?')[0]
    download(url, f'public/images/projects/design-carousel/{name}.{ext}')

print("\nDone!")
