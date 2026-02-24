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

videos = {
    'witfy':            'https://flowproductions.pt/wp-content/uploads/2025/10/Witfy-scaled.jpg',
    'pro-am':           'https://flowproductions.pt/wp-content/uploads/2026/02/Thumbnails-DETAILS_3.1.1.jpg-scaled.jpeg',
    'dom-jose':         'https://flowproductions.pt/wp-content/uploads/2025/09/Dom-Jose-Promo-scaled.jpg',
    'designer-outlet':  'https://flowproductions.pt/wp-content/uploads/2025/09/designer-outlet-scaled.jpg',
    'ibc-security':     'https://flowproductions.pt/wp-content/uploads/2026/01/IBC.jpg',
    'indasa':           'https://flowproductions.pt/wp-content/uploads/2026/01/Indasa.jpg',
    'rocamar':          'https://flowproductions.pt/wp-content/uploads/2025/09/Rocamar-scaled.png',
    'kubidoce':         'https://flowproductions.pt/wp-content/uploads/2025/09/Kubidoce-scaled.jpg',
    'odyssea':          'https://flowproductions.pt/wp-content/uploads/2026/01/Odyssea.jpg',
    'the-originals':    'https://flowproductions.pt/wp-content/uploads/2025/10/TheOriginals-scaled.jpg',
    'ria-shopping':     'https://flowproductions.pt/wp-content/uploads/2025/09/Capa-Olhanense-4K-scaled.jpg',
    'albufeira-dn':     'https://flowproductions.pt/wp-content/uploads/2025/08/Albufeira-Digital-Nomads.jpg',
    'aljustrel':        'https://flowproductions.pt/wp-content/uploads/2025/10/Aljustrel.webp',
    'fujifilm':         'https://flowproductions.pt/wp-content/uploads/2025/09/Fuji-scaled.jpg',
    'algarseafood':     'https://flowproductions.pt/wp-content/uploads/2025/10/Algarseafood.webp',
}

for name, url in videos.items():
    ext = url.split('.')[-1].split('?')[0]
    download(url, f'public/images/projects/audiovisual-carousel/{name}.{ext}')

print("\nDone!")
