import urllib.request
import re

url = 'https://flowproductions.pt/projetos-sociais-2/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=15) as r:
    html = r.read().decode('utf-8', errors='ignore')

with open('social_page.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("HTML saved, length:", len(html))

print("\n=== IMG SRC (uploads only, no thumbnails) ===")
imgs = re.findall(r'src=["\']([^"\']+\.(?:png|jpg|jpeg|webp))["\']', html)
seen = set()
for img in imgs:
    if img not in seen and 'uploads' in img:
        if not any(x in img for x in ['-840x', '-300x', '-768x', '-150x', 'favicon', 'cropped']):
            seen.add(img)
            print(img)

print("\n=== JS STRING IMAGES ===")
js_imgs = re.findall(r'"(https://flowproductions\.pt/wp-content/uploads/[^"]+\.(?:jpg|jpeg|png|webp))"', html)
seen2 = set()
for img in js_imgs:
    if img not in seen2 and not any(x in img for x in ['-840x', '-300x', '-768x', 'favicon', 'cropped']):
        seen2.add(img)
        print(img)
