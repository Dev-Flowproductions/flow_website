import urllib.request
import re
import json
import os

def get_media_url(media_id):
    url = f'https://flowproductions.pt/wp-json/wp/v2/media/{media_id}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as r:
        data = json.loads(r.read())
    return data.get('source_url', '')

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

# From earlier portfolio listing:
# liga-portuguesa-contra-o-cancro | media:39481
# aequum                          | media:40113
# social-hackathon                | media:40238
# hackathon (Green)               | media:40125
# refood                          | media:40161

projects = {
    'liga-portuguesa-contra-o-cancro': 39481,
    'aequum':                          40113,
    'social-hackathon':                40238,
    'hackathon':                       40125,
    'refood':                          40161,
}

for name, media_id in projects.items():
    try:
        src = get_media_url(media_id)
        print(f"{name}: {src}")
        ext = src.split('.')[-1].split('?')[0]
        download(src, f'public/images/projects/social-carousel/{name}.{ext}')
    except Exception as e:
        print(f"ERROR {name}: {e}")

print("\nDone!")
