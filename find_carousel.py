with open('design_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Look for the carousel project list - find "01", "02" etc
import re
# Find the section with project numbers
idx = html.find('Albufeira Digital Nomads')
if idx >= 0:
    print("Carousel section found:")
    print(html[max(0,idx-500):idx+2000])

print("\n\n=== LOOKING FOR LOGO IMAGES ===")
# Find all img tags with logo-related content
img_tags = re.findall(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>', html)
for img in img_tags:
    if 'logo' in img.lower() or any(brand in img.lower() for brand in ['zion', 'witfy', 'cesarius', 'pizza', 'rocket', 'nature', 'urleg', 'jardim', 'albufeira', '100']):
        print(img)
