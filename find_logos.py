with open('design_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find sections with "cliente" or logo-like content
# Look for the brand/client logos section
idx = html.lower().find('cliente')
if idx >= 0:
    print("Found 'cliente' at:", idx)
    print(html[max(0,idx-200):idx+500])

print("\n---\n")

# Look for marquee-related or brand carousel content
for keyword in ['marquee', 'carousel', 'brand', 'clientes', 'parceiros', 'logos']:
    idx = html.lower().find(keyword)
    if idx >= 0:
        print(f"Found '{keyword}' at {idx}:")
        print(html[max(0,idx-100):idx+400])
        print("---")
