import urllib.request
import re
import os

with open('audiovisual_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find Fotografias section
idx = html.lower().find('fotografias')
# Search broader area after it
section = html[idx:idx+20000] if idx >= 0 else html

# All image srcs in that section
imgs = re.findall(r'src=["\']([^"\']+\.(?:png|jpg|jpeg|webp))["\']', section)
print("Images in/after Fotografias section:")
for img in imgs:
    if 'uploads' in img or img.startswith('//'):
        print(img)

# Also search for hackathon, social, event photo keywords
print("\nSearching for photo gallery images across full HTML:")
photo_kws = ['foto', 'photo', 'galeria', 'gallery', 'hackathon', 'social-hack', 'adm', 'evento']
for kw in photo_kws:
    hits = re.findall(r'((?:https:)?//flowproductions\.pt/wp-content/uploads/[^\s"\'<>]*' + kw + r'[^\s"\'<>]*\.(?:jpg|png|webp|jpeg))', html, re.IGNORECASE)
    for h in hits:
        print(kw, "->", h)
