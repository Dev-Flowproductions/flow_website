import urllib.request
import re
import json

# Check portfolio items for photo/photography tags
url = 'https://flowproductions.pt/wp-json/wp/v2/cpt_portfolio?per_page=100&_fields=slug,title,tags,featured_media,content'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=15) as r:
    items = json.loads(r.read())

print(f"Total portfolio items: {len(items)}")
for item in items:
    slug = item.get('slug','')
    title = item.get('title',{}).get('rendered','')
    tags = item.get('tags', [])
    media_id = item.get('featured_media', 0)
    print(f"  {slug} | {title} | tags:{tags} | media:{media_id}")

# Also browse media page 5+ for photo content
print("\n--- Recent media uploads (page 5-8) ---")
for page in range(5, 9):
    url2 = f'https://flowproductions.pt/wp-json/wp/v2/media?per_page=30&page={page}&media_type=image'
    try:
        req2 = urllib.request.Request(url2, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req2, timeout=15) as r:
            data = json.loads(r.read())
        if not data:
            break
        for item in data:
            src = item.get('source_url','')
            slug = item.get('slug','')
            # print all non-thumbnail non-logo images
            if '-scaled' in src or ('-840x' not in src and '-300x' not in src):
                if not any(x in slug for x in ['logo', 'favicon', 'icon', 'wabi']):
                    print(f"  {slug[:50]} | {src}")
    except Exception as e:
        print(f"  page {page} error:", e)
        break
