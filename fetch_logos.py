import urllib.request
import re
import os

url = 'https://flowproductions.pt/design/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=15) as r:
    html = r.read().decode('utf-8', errors='ignore')

# Save HTML so we can inspect it
with open('design_page.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("HTML saved, length:", len(html))

# Find all image URLs
pattern = r'https://flowproductions\.pt/wp-content/uploads/[^"\'\s>]+'
imgs = re.findall(pattern, html)
for img in imgs[:60]:
    print(img)
