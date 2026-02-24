import urllib.request
import re

url = 'https://flowproductions.pt/animacao-2/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=15) as r:
    html = r.read().decode('utf-8', errors='ignore')

with open('animacao_page.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("HTML saved, length:", len(html))

# Background images
bg_imgs = re.findall(r'background-image:\s*url\(["\']?(https://[^"\')\s]+)["\']?\)', html)
print("\n=== BACKGROUND IMAGES ===")
for img in bg_imgs:
    print(img)

# Img src
print("\n=== IMG SRC (uploads only) ===")
imgs = re.findall(r'src=["\']([^"\']+\.(?:png|jpg|jpeg|webp))["\']', html)
seen = set()
for img in imgs:
    if img not in seen and ('uploads' in img or img.startswith('//')):
        if '-840x' not in img and '-300x' not in img and '-768x' not in img:
            seen.add(img)
            print(img)

# JS string image URLs
print("\n=== JS STRING IMAGES ===")
js_imgs = re.findall(r'"(https://flowproductions\.pt/wp-content/uploads/[^"]+\.(?:jpg|jpeg|png|webp))"', html)
seen2 = set()
for img in js_imgs:
    if img not in seen2 and '-840x' not in img and '-300x' not in img:
        seen2.add(img)
        print(img)
