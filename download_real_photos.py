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

photos = [
    ('foto-1', 'https://flowproductions.pt/wp-content/uploads/2025/12/img-5038-scaled.webp'),
    ('foto-2', 'https://flowproductions.pt/wp-content/uploads/2025/12/img-5875-scaled.webp'),
    ('foto-3', 'https://flowproductions.pt/wp-content/uploads/2025/12/edr-1764-scaled.webp'),
    ('foto-4', 'https://flowproductions.pt/wp-content/uploads/2025/12/edr-5384-scaled.webp'),
    ('foto-5', 'https://flowproductions.pt/wp-content/uploads/2025/12/edr-5820-scaled.webp'),
    ('foto-6', 'https://flowproductions.pt/wp-content/uploads/2025/12/img-423a0.5x-1-816x544-1.webp'),
]

for name, url in photos:
    download(url, f'public/images/projects/audiovisual-carousel/{name}.webp')

print("\nDone!")
