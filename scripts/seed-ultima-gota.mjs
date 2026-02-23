// Run with: node scripts/seed-ultima-gota.mjs
import https from 'https';

const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9saHBycWdueHNiZWt4Y2lqZXVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ5NzgzMywiZXhwIjoyMDg3MDczODMzfQ.-WTOSRHYRE3NL_a4NSRojR-8WTXCrJoMxL9AgTqMDo0';
const HOST = 'olhprqgnxsbekxcijeuq.supabase.co';

const ANIMACAO_CATEGORY_ID = '663e84b9-1300-454a-be62-d971e8921067';
const ANIMATION_TAG_ID = '83c06e96-3d81-47b5-9b9f-0a708fe7cbdf';

function supabase(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: HOST,
      path,
      method,
      headers: {
        'apikey': KEY,
        'Authorization': 'Bearer ' + KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function run() {
  // 1. Insert the project
  const projRes = await supabase('POST', '/rest/v1/projects', {
    title: { pt: '\u00DAltima Gota', en: '\u00DAltima Gota', fr: '\u00DAltima Gota' },
    slug:  { pt: 'ultima-gota',      en: 'ultima-gota',      fr: 'ultima-gota' },
    summary: {
      pt: 'Anima\u00E7\u00E3o 2D criada para a campanha \u00DAltima Gota.',
      en: '2D animation created for the \u00DAltima Gota campaign.',
      fr: 'Animation 2D cr\u00E9\u00E9e pour la campagne \u00DAltima Gota.',
    },
    client_name: '\u00DAltima Gota',
    featured_image_path: '/images/projects/Ultima-Gota.webp',
    gallery: { video_url: 'https://www.youtube.com/watch?v=Mt-9bDmBWSs' },
    is_featured: true,
    status: 'published',
    published_at: new Date().toISOString(),
  });
  if (projRes.status !== 201) {
    console.error('Failed to insert project:', projRes.body);
    process.exit(1);
  }
  const project = JSON.parse(projRes.body)[0];
  console.log('✓ Project inserted:', project.id, project.title.pt);

  // 2. Create a default section for the animação category
  const secRes = await supabase('POST', '/rest/v1/project_category_sections', {
    category_id: ANIMACAO_CATEGORY_ID,
    title: { pt: 'Anima\u00E7\u00F5es', en: 'Animations', fr: 'Animations' },
    order: 1,
  });
  if (secRes.status !== 201) {
    console.error('Failed to insert section:', secRes.body);
    process.exit(1);
  }
  const section = JSON.parse(secRes.body)[0];
  console.log('✓ Category section created:', section.id);

  // 3. Link project → section
  const linkRes = await supabase('POST', '/rest/v1/category_section_projects', {
    category_section_id: section.id,
    project_id: project.id,
    order: 1,
  });
  console.log('✓ Project linked to category section:', linkRes.status);

  // 4. Tag the project as Animation
  const tagRes = await supabase('POST', '/rest/v1/project_project_tags', {
    project_id: project.id,
    tag_id: ANIMATION_TAG_ID,
  });
  console.log('✓ Tag applied:', tagRes.status);

  console.log('\nAll done! Project ID:', project.id);
}

run().catch(err => { console.error(err); process.exit(1); });
