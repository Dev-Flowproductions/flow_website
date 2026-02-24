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

animations = {
    'ultima-gota':          ('https://flowproductions.pt/wp-content/uploads/2025/09/Ultima-Gota.webp',       'webp'),
    'likewise':             ('https://flowproductions.pt/wp-content/uploads/2026/01/Likewise.jpg',           'jpg'),
    'medwater':             ('https://flowproductions.pt/wp-content/uploads/2025/09/Zero.webp',              'webp'),
    'one-select':           ('https://flowproductions.pt/wp-content/uploads/2026/01/One-Select-Properties.jpg', 'jpg'),
    'mia':                  ('https://flowproductions.pt/wp-content/uploads/2025/09/MIA.webp',               'webp'),
    'barturs':              ('https://flowproductions.pt/wp-content/uploads/2025/09/vlcsnap-2025-09-29-11h41m04s259.png', 'png'),
    'lets-communicate':     ('https://flowproductions.pt/wp-content/uploads/2026/01/LetsCommunicate.jpg',    'jpg'),
    'kipt':                 ('https://flowproductions.pt/wp-content/uploads/2025/09/KIPT.webp',              'webp'),
    'emjogo':               ('https://flowproductions.pt/wp-content/uploads/2025/09/EmJogo.webp',            'webp'),
    'travel-tech-partners': ('https://flowproductions.pt/wp-content/uploads/2025/09/Geotravel.webp',         'webp'),
    'toma-la-da-ca':        ('https://flowproductions.pt/wp-content/uploads/2025/10/Toma-la.webp',           'webp'),
}

for name, (url, ext) in animations.items():
    download(url, f'public/images/projects/animacao-carousel/{name}.{ext}')

print("\nDone!")
