import urllib.request
import re
import json

# Browse all media to find photography images
# Try larger batches
for page in range(1, 5):
    url = f'https://flowproductions.pt/wp-json/wp/v2/media?per_page=50&page={page}&media_type=image&orderby=date&order=desc'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.loads(r.read())
        if not data:
            break
        for item in data:
            slug = item.get('slug','')
            src = item.get('source_url','')
            # Filter for likely photography/event images  
            if any(kw in slug.lower() or kw in src.lower() for kw in ['foto', 'photo', 'hackathon', 'social', 'evento', 'adm', 'promo', 'event', 'cobertura']):
                print(f"p{page}", slug[:50], src)
    except Exception as e:
        print(f"Page {page} error:", e)
        break

# Also check the fotografias CPT/custom post type
print("\n--- Custom post types ---")
url3 = 'https://flowproductions.pt/wp-json/wp/v2/types'
req3 = urllib.request.Request(url3, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req3, timeout=10) as r:
    types = json.loads(r.read())
for t, v in types.items():
    print(t, '->', v.get('rest_base',''))
