import urllib.request
import re
import json

# Try WP media API with photo/fotografia keywords
searches = ['fotografia', 'social+hackathon', 'hackathon', 'adm+24', 'pro+am', 'evento']
for s in searches:
    url = f'https://flowproductions.pt/wp-json/wp/v2/media?per_page=5&search={s}'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read())
            for item in data[:3]:
                print(s, '|', item.get('slug','')[:40], '|', item.get('source_url',''))
    except Exception as e:
        print(s, '| ERROR:', e)

# Also look at the fotografias CPT or page
print("\n--- Checking fotografias page directly ---")
url2 = 'https://flowproductions.pt/wp-json/wp/v2/pages?slug=audiovisual'
req2 = urllib.request.Request(url2, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req2, timeout=10) as r:
    data2 = json.loads(r.read())
    if data2:
        content = data2[0].get('content', {}).get('rendered', '')
        imgs = re.findall(r'(https://flowproductions\.pt/wp-content/uploads/[^\s"\'<>]+\.(?:jpg|png|webp|jpeg))', content)
        print("Images in page content:")
        for img in imgs[:20]:
            print(img)
    else:
        print("No page found")
