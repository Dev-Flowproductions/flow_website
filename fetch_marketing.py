import urllib.request
import re

url = 'https://flowproductions.pt/marketing/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=15) as r:
    html = r.read().decode('utf-8', errors='ignore')

with open('marketing_page.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("HTML saved, length:", len(html))

# Background images (carousel slides)
bg_imgs = re.findall(r'background-image:\s*url\(["\']?(https://[^"\')\s]+)["\']?\)', html)
print("\n=== BACKGROUND IMAGES (carousel slides) ===")
for img in bg_imgs:
    print(img)

# All img src
print("\n=== LOGO/BRAND IMAGES ===")
all_imgs = re.findall(r'src=["\']([^"\']+\.(?:png|jpg|jpeg|webp|svg))["\']', html)
seen = set()
for img in all_imgs:
    if img not in seen and ('uploads' in img or img.startswith('//')):
        seen.add(img)
        print(img)
