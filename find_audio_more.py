with open('audiovisual_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

# Find what comes after "Cobertura de Eventos"
idx = html.find('Cobertura de Eventos')
if idx >= 0:
    section = html[idx:idx+5000]
    # Find all img srcs in that section
    imgs = re.findall(r'src=["\']([^"\']+\.(?:png|jpg|jpeg|webp))["\']', section)
    print("Images after Cobertura de Eventos:")
    for img in imgs:
        if 'uploads' in img:
            print(img)

# Find "Flow Fotografias" section
idx2 = html.find('Flow Fotografias')
if idx2 < 0:
    idx2 = html.lower().find('fotografias')
if idx2 >= 0:
    section2 = html[idx2:idx2+5000]
    imgs2 = re.findall(r'src=["\']([^"\']+\.(?:png|jpg|jpeg|webp))["\']', section2)
    print("\nImages in Fotografias section:")
    for img in imgs2:
        if 'uploads' in img:
            print(img)

# Look for hackathon or event coverage images
for kw in ['hackathon', 'adm', 'social-hackathon']:
    hits = re.findall(r'(https://[^\s"\'<>]*' + kw + r'[^\s"\'<>]*)', html, re.IGNORECASE)
    for h in hits:
        print("Found:", h)
