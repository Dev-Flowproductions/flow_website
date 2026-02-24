with open('audiovisual_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

for keyword in ['Cobertura', 'Fotografias', 'Eventos', 'hackathon', 'social']:
    idx = html.lower().find(keyword.lower())
    if idx >= 0:
        print(f"=== '{keyword}' at {idx} ===")
        print(html[max(0,idx-200):idx+800])
        print()
