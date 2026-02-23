// Run with: node scripts/seed-all-projects.mjs
import https from 'https';

const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9saHBycWdueHNiZWt4Y2lqZXVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ5NzgzMywiZXhwIjoyMDg3MDczODMzfQ.-WTOSRHYRE3NL_a4NSRojR-8WTXCrJoMxL9AgTqMDo0';
const HOST = 'olhprqgnxsbekxcijeuq.supabase.co';

// ── Tag IDs (already exist in DB) ────────────────────────────────────────────
const TAGS = {
  animation:  '83c06e96-3d81-47b5-9b9f-0a708fe7cbdf',
  video:      '2818441c-2497-4d56-9018-88ba27c34caf',
  marketing:  'abccfe08-d634-4b03-9d83-5cccc6572487',
  design:     '7872f017-4558-46b8-8a21-3684ff45d5bc',
  branding:   'c1dba0c8-c3b4-411f-9ec1-0b75ab3519e0',
  socialMedia:'78f60a60-b640-4aa1-89aa-01c196c7f1e8',
  // content-writing will be created below
};

// ── Category IDs ─────────────────────────────────────────────────────────────
const CATS = {
  animacao:       '663e84b9-1300-454a-be62-d971e8921067',
  audiovisual:    '09380c9b-e06e-48d7-bb6b-337ec26a2214',
  marketing:      'd5bee894-e5fd-45f3-8047-6d825ac9b2ff',
  design:         '2073fd02-2302-4601-a2c3-bbe8a7a1d99f',
  projetosSociais:'aa449a51-19e5-4786-84b7-d09e0429788f',
};

// ── Existing animação section ─────────────────────────────────────────────────
const ANIMACAO_SECTION_ID = '7d166e45-a074-48e4-b874-a9a401443641';

// ── Projects ─────────────────────────────────────────────────────────────────
// Each project: { title_pt, slug, client, tags: [], categories: [], videoUrl?, imagePath? }
const PROJECTS = [
  // ── ANIMAÇÃO ────────────────────────────────────────────────────────────────
  {
    title: 'Likewise',
    slug: 'likewise',
    client: 'Likewise',
    tags: ['animation'],
    categories: ['animacao'],
  },
  {
    title: 'Medwater',
    slug: 'medwater',
    client: 'Medwater',
    tags: ['animation'],
    categories: ['animacao'],
  },
  {
    title: 'One Select Properties',
    slug: 'one-select-properties',
    client: 'One Select Properties',
    tags: ['animation'],
    categories: ['animacao'],
  },
  {
    title: 'MIA',
    slug: 'mia',
    client: 'MIA',
    tags: ['animation'],
    categories: ['animacao'],
  },
  {
    title: 'Barturs',
    slug: 'barturs',
    client: 'Barturs',
    tags: ['animation'],
    categories: ['animacao'],
  },
  {
    // Let\u2019s Communicate
    title: 'Let\u2019s Communicate',
    slug: 'lets-communicate',
    client: 'Let\u2019s Communicate',
    tags: ['animation'],
    categories: ['animacao'],
  },
  {
    title: 'KIPT',
    slug: 'kipt',
    client: 'KIPT',
    tags: ['animation'],
    categories: ['animacao'],
  },
  {
    title: 'EmJogo',
    slug: 'emjogo',
    client: 'EmJogo',
    tags: ['animation'],
    categories: ['animacao'],
  },
  {
    title: 'Travel Tech Partners',
    slug: 'travel-tech-partners',
    client: 'Travel Tech Partners',
    tags: ['animation'],
    categories: ['animacao'],
  },
  {
    // Toma l\u00E1, d\u00E1 c\u00E1
    title: 'Toma l\u00E1, d\u00E1 c\u00E1',
    slug: 'toma-la-da-ca',
    client: 'Toma l\u00E1, d\u00E1 c\u00E1',
    tags: ['animation'],
    categories: ['animacao'],
  },

  // ── AUDIOVISUAL ─────────────────────────────────────────────────────────────
  {
    title: 'Dias Medievais de Castro Marim',
    slug: 'dias-medievais-de-castro-marim',
    client: 'Dias Medievais de Castro Marim',
    tags: ['video'],
    categories: ['audiovisual'],
  },
  {
    title: 'Neomarca',
    slug: 'neomarca',
    client: 'Neomarca',
    tags: ['video'],
    categories: ['audiovisual'],
  },
  {
    // PRO AM \u2013 Vilamoura
    title: 'PRO AM \u2013 Vilamoura',
    slug: 'pro-am-vilamoura',
    client: 'PRO AM Vilamoura',
    tags: ['video'],
    categories: ['audiovisual'],
  },
  {
    title: 'Designer Outlet Algarve',
    slug: 'designer-outlet-algarve',
    client: 'Designer Outlet Algarve',
    tags: ['video'],
    categories: ['audiovisual'],
  },
  {
    title: 'IBC Security',
    slug: 'ibc-security',
    client: 'IBC Security',
    tags: ['video'],
    categories: ['audiovisual'],
  },
  {
    title: 'Indasa',
    slug: 'indasa',
    client: 'Indasa',
    tags: ['video'],
    categories: ['audiovisual'],
  },
  {
    title: 'Rocamar Beach Hotel',
    slug: 'rocamar-beach-hotel',
    client: 'Rocamar Beach Hotel',
    tags: ['video'],
    categories: ['audiovisual'],
  },
  {
    title: 'Odyssea',
    slug: 'odyssea',
    client: 'Odyssea',
    tags: ['video'],
    categories: ['audiovisual'],
  },
  {
    title: 'The Originals',
    slug: 'the-originals',
    client: 'The Originals',
    tags: ['video'],
    categories: ['audiovisual'],
  },
  {
    title: 'Ria Shopping',
    slug: 'ria-shopping',
    client: 'Ria Shopping',
    tags: ['video'],
    categories: ['audiovisual'],
  },
  {
    title: 'Parque Mineiro Aljustrel',
    slug: 'parque-mineiro-aljustrel',
    client: 'Parque Mineiro Aljustrel',
    tags: ['video'],
    categories: ['audiovisual'],
  },
  {
    title: 'Fujifilm',
    slug: 'fujifilm',
    client: 'Fujifilm',
    tags: ['video'],
    categories: ['audiovisual'],
  },
  {
    title: 'Algarseafood',
    slug: 'algarseafood',
    client: 'Algarseafood',
    tags: ['video'],
    categories: ['audiovisual'],
  },

  // ── MULTI-CATEGORY (Audiovisual + Design) ───────────────────────────────────
  {
    title: 'Witfy',
    slug: 'witfy',
    client: 'Witfy',
    tags: ['video', 'design'],
    categories: ['audiovisual', 'design'],
  },
  {
    // Dom Jos\u00E9 Beach Hotel
    title: 'Dom Jos\u00E9 Beach Hotel',
    slug: 'dom-jose-beach-hotel',
    client: 'Dom Jos\u00E9 Beach Hotel',
    tags: ['video', 'design'],
    categories: ['audiovisual', 'design'],
  },

  // ── MULTI-CATEGORY (Marketing + Audiovisual) ────────────────────────────────
  {
    title: 'Kubidoce',
    slug: 'kubidoce',
    client: 'Kubidoce',
    tags: ['marketing', 'video'],
    categories: ['marketing', 'audiovisual'],
  },
  {
    title: 'Albufeira Digital Nomads',
    slug: 'albufeira-digital-nomads',
    client: 'Albufeira Digital Nomads',
    tags: ['marketing', 'video', 'design'],
    categories: ['marketing', 'audiovisual', 'design'],
  },

  // ── MARKETING ───────────────────────────────────────────────────────────────
  {
    title: 'DENTAL HPA',
    slug: 'dental-hpa',
    client: 'DENTAL HPA',
    tags: ['marketing'],
    categories: ['marketing'],
  },
  {
    title: 'RB Woodfinish',
    slug: 'rb-woodfinish',
    client: 'RB Woodfinish',
    tags: ['marketing'],
    categories: ['marketing'],
  },
  {
    // Miss\u00E3o Condu\u00E7\u00E3o
    title: 'Miss\u00E3o Condu\u00E7\u00E3o',
    slug: 'missao-conducao',
    client: 'Miss\u00E3o Condu\u00E7\u00E3o',
    tags: ['marketing'],
    categories: ['marketing'],
  },
  {
    title: 'ADM 24\u2019',
    slug: 'adm-24',
    client: 'ADM 24',
    tags: ['marketing', 'socialMedia'],
    categories: ['marketing'],
  },

  // ── MULTI-CATEGORY (Marketing + Design) ────────────────────────────────────
  {
    title: 'Nature Soul Food',
    slug: 'nature-soul-food',
    client: 'Nature Soul Food',
    tags: ['marketing', 'design'],
    categories: ['marketing', 'design'],
  },
  {
    title: 'Jardim Aurora',
    slug: 'jardim-aurora',
    client: 'Jardim Aurora',
    tags: ['marketing', 'design'],
    categories: ['marketing', 'design'],
  },

  // ── DESIGN ──────────────────────────────────────────────────────────────────
  {
    title: 'ZION Creative Artisans',
    slug: 'zion-creative-artisans',
    client: 'ZION Creative Artisans',
    tags: ['design', 'branding'],
    categories: ['design'],
  },
  {
    title: '100LIXO',
    slug: '100lixo',
    client: '100LIXO',
    tags: ['design', 'branding'],
    categories: ['design'],
  },
  {
    title: 'URLEGFIX',
    slug: 'urlegfix',
    client: 'URLEGFIX',
    tags: ['design'],
    categories: ['design'],
  },
  {
    title: 'Cesarius',
    slug: 'cesarius',
    client: 'Cesarius',
    tags: ['design', 'branding'],
    categories: ['design'],
  },
  {
    title: 'Rocket Booster',
    slug: 'rocket-booster',
    client: 'Rocket Booster',
    tags: ['design'],
    categories: ['design'],
  },
  {
    title: 'Pizza Lab',
    slug: 'pizza-lab',
    client: 'Pizza Lab',
    tags: ['design', 'branding'],
    categories: ['design'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────

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
  console.log('Creating category sections...\n');

  // Create one default section per category (skip animacao — already exists)
  const sectionMap = { animacao: ANIMACAO_SECTION_ID };

  for (const [key, categoryId] of Object.entries(CATS)) {
    if (key === 'animacao') continue;
    const titles = {
      audiovisual:    { pt: 'Audiovisual', en: 'Audiovisual', fr: 'Audiovisuel' },
      marketing:      { pt: 'Marketing', en: 'Marketing', fr: 'Marketing' },
      design:         { pt: 'Design', en: 'Design', fr: 'Design' },
      projetosSociais:{ pt: 'Projetos Sociais', en: 'Social Projects', fr: 'Projets Sociaux' },
    };
    const res = await supabase('POST', '/rest/v1/project_category_sections', {
      category_id: categoryId,
      title: titles[key],
      order: 1,
    });
    if (res.status !== 201) {
      console.error(`Failed to create section for ${key}:`, res.body);
      process.exit(1);
    }
    sectionMap[key] = JSON.parse(res.body)[0].id;
    console.log(`  ✓ Section created for ${key}: ${sectionMap[key]}`);
  }

  console.log('\nInserting projects...\n');

  let order = 2; // Última Gota is already order 1
  for (const p of PROJECTS) {
    // 1. Insert project
    const projRes = await supabase('POST', '/rest/v1/projects', {
      title:    { pt: p.title, en: p.title, fr: p.title },
      slug:     { pt: p.slug,  en: p.slug,  fr: p.slug  },
      summary:  null,
      client_name: p.client,
      featured_image_path: p.imagePath || null,
      gallery: p.videoUrl ? { video_url: p.videoUrl } : null,
      is_featured: false,
      status: 'published',
      published_at: new Date().toISOString(),
    });

    if (projRes.status !== 201) {
      console.error(`  ✗ Failed: ${p.title}`, projRes.body);
      continue;
    }
    const project = JSON.parse(projRes.body)[0];

    // 2. Link to category sections
    for (const catKey of p.categories) {
      const sectionId = sectionMap[catKey];
      if (!sectionId) { console.warn(`    No section for ${catKey}`); continue; }
      await supabase('POST', '/rest/v1/category_section_projects', {
        category_section_id: sectionId,
        project_id: project.id,
        order: order++,
      });
    }

    // 3. Apply tags
    for (const tagKey of p.tags) {
      const tagId = TAGS[tagKey];
      if (!tagId) { console.warn(`    Unknown tag: ${tagKey}`); continue; }
      await supabase('POST', '/rest/v1/project_project_tags', {
        project_id: project.id,
        tag_id: tagId,
      });
    }

    console.log(`  ✓ ${p.title} [${p.categories.join(', ')}]`);
  }

  console.log('\n✅ All done!');
}

run().catch(err => { console.error(err); process.exit(1); });
