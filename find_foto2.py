import re

with open('audiovisual_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find ALL occurrences of fotografias
positions = [m.start() for m in re.finditer(r'fotografias|Flow Foto', html, re.IGNORECASE)]
print(f"All 'fotografias' positions: {positions}")

# The real section heading is likely the last occurrence or the one after a section tag
for pos in positions:
    context = html[pos:pos+100]
    print(f"\n  pos {pos}: ...{context[:100]}...")

# Also look for the gallery widget or post grid that would contain the photos
print("\n\n=== Searching for gallery/grid elements ===")
gallery_idx = html.find('sc_blogger')
if gallery_idx > 0:
    print(f"sc_blogger found at {gallery_idx}")
    section = html[gallery_idx-500:gallery_idx+5000]
    imgs = re.findall(r'src=["\']([^"\']+\.(?:jpg|jpeg|png|webp))["\']', section)
    for img in imgs:
        if 'uploads' in img and '-840x' not in img and '-300x' not in img:
            print(img)
