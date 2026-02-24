import urllib.request
import json
import os

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

def get_media_url(media_id):
    url = f'https://flowproductions.pt/wp-json/wp/v2/media/{media_id}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as r:
        data = json.loads(r.read())
    return data.get('source_url', '')

# Get featured images for event/social portfolio items
event_items = {
    'social-hackathon': 40238,
    'hackathon':        40125,
    'aequum':           40113,
    'refood':           40161,
}
print("=== Fetching portfolio featured images ===")
for name, mid in event_items.items():
    try:
        src = get_media_url(mid)
        print(f"  {name}: {src}")
        ext = src.split('.')[-1].split('?')[0]
        download(src, f'public/images/projects/audiovisual-carousel/foto-{name}.{ext}')
    except Exception as e:
        print(f"  {name}: ERROR {e}")

# Also download raw photo images
raw_photos = {
    'img-4097': 'https://flowproductions.pt/wp-content/uploads/2025/08/IMG_4097-scaled.jpg',
    'img-4293': 'https://flowproductions.pt/wp-content/uploads/2025/08/IMG_4293-scaled.jpg',
    'img-7704': 'https://flowproductions.pt/wp-content/uploads/2025/10/IMG_7704-2-scaled.jpg',
}
print("\n=== Downloading raw photos ===")
for name, url in raw_photos.items():
    ext = url.split('.')[-1].split('?')[0]
    download(url, f'public/images/projects/audiovisual-carousel/foto-{name}.{ext}')

print("\nDone!")
