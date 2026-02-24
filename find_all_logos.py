with open('design_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

# Find all img src URLs  
all_imgs = re.findall(r'src=["\']([^"\']+\.(?:png|jpg|jpeg|webp|svg))["\']', html)
print("=== ALL UNIQUE IMAGE SOURCES ===")
seen = set()
for img in all_imgs:
    if img not in seen:
        seen.add(img)
        if 'wp-content/uploads' in img or img.startswith('//'):
            print(img)

print("\n=== BACKGROUND IMAGE URLS ===")
bg_imgs = re.findall(r'background-image:\s*url\(["\']?([^"\')\s]+)["\']?\)', html)
for img in bg_imgs:
    print(img)
