import re

with open('audiovisual_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find "Flow Fotografias" heading area
idx = html.find('Flow Fotografias')
if idx < 0:
    idx = html.lower().find('fotografias')

print(f"Found at index {idx}")
# Print 8000 chars after it to find the image gallery
section = html[idx:idx+8000]

# Find all URLs with image extensions
imgs = re.findall(r'((?:https?:)?//[^\s"\'<>]+\.(?:jpg|jpeg|png|webp)(?:-scaled)?)', section)
print("\nImages found after Fotografias heading:")
for img in imgs:
    if 'uploads' in img:
        print(img)

# Also check if there are data-src or srcset attributes
data_srcs = re.findall(r'data-src=["\']([^"\']+)["\']', section)
print("\nData-src attributes:")
for d in data_srcs:
    if 'uploads' in d:
        print(d)

srcsets = re.findall(r'srcset=["\']([^"\']+)["\']', section)
print("\nSrcset attributes:")
for s in srcsets[:5]:
    print(s[:200])
