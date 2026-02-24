import re, json

with open('audiovisual_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

# The Fotografias section is at pos 107557 — look at a larger window after it
section = html[107557:107557+15000]

# Save it to inspect
with open('foto_section.html', 'w', encoding='utf-8') as f:
    f.write(section)

# Check for any JS data objects with image URLs near it
js_imgs = re.findall(r'"(https://flowproductions\.pt/wp-content/uploads/[^"]+\.(?:jpg|jpeg|png|webp))"', section)
print("JS image strings in section:")
for img in js_imgs:
    if '-840x' not in img and '-300x' not in img and 'scaled' in img.lower() or len(js_imgs) < 20:
        print(img)

# Also look for trx_addons gallery data
gallery_matches = re.findall(r'data-postcount=["\'](\d+)["\']', section)
print("\nPost counts:", gallery_matches)

# Look for post IDs embedded in the section
post_ids = re.findall(r'data-post-id=["\'](\d+)["\']', html[107000:115000])
print("Post IDs near Fotografias:", post_ids)

# Look for any elementor data near section
elem_data = re.findall(r'data-settings=["\']([^"\']+)["\']', html[107000:115000])
print(f"\n{len(elem_data)} elementor settings blocks found")
for d in elem_data[:3]:
    print(d[:300])
