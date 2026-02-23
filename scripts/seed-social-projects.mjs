// Run with: node scripts/seed-social-projects.mjs
import https from 'https';

const KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9saHBycWdueHNiZWt4Y2lqZXVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ5NzgzMywiZXhwIjoyMDg3MDczODMzfQ.-WTOSRHYRE3NL_a4NSRojR-8WTXCrJoMxL9AgTqMDo0';
const HOST = 'olhprqgnxsbekxcijeuq.supabase.co';

// Existing IDs
const SOCIAL_SECTION_ID = 'd62a5160-c6c7-4b24-a0b8-5674bbdf68f9';
const TAG_VIDEO         = '2818441c-2497-4d56-9018-88ba27c34caf';
const TAG_SOCIAL_MEDIA  = '78f60a60-b640-4aa1-89aa-01c196c7f1e8';

// Projects belonging to Projetos Sociais
const PROJECTS = [
  {
    title:    'AeQuum',
    slug:     'aequum',
    client:   'AeQuum',
    image:    '/images/projects/aequum.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=c2Xn8B8Dhf4',
    tags:     [TAG_VIDEO, TAG_SOCIAL_MEDIA],
  },
  {
    title:    'Hackathon',
    slug:     'hackathon',
    client:   'Hackathon',
    image:    '/images/projects/hackathon.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=86FgEIoor4I',
    tags:     [TAG_VIDEO, TAG_SOCIAL_MEDIA],
  },
  {
    title:    'Liga Portuguesa Contra o C\u00E2ncro',
    slug:     'liga-portuguesa-contra-o-cancro',
    client:   'Liga Portuguesa Contra o C\u00E2ncro',
    image:    '/images/projects/liga-portuguesa-contra-o-cancro.jpg',
    videoUrl: null,
    tags:     [TAG_SOCIAL_MEDIA],
  },
  {
    title:    'ReFood',
    slug:     'refood',
    client:   'ReFood',
    image:    '/images/projects/refood.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=PWIBs-amki4',
    tags:     [TAG_VIDEO, TAG_SOCIAL_MEDIA],
  },
  {
    title:    'Social Hackathon',
    slug:     'social-hackathon',
    client:   'Social Hackathon',
    image:    '/images/projects/social-hackathon.jpg',
    videoUrl: null,
    tags:     [TAG_SOCIAL_MEDIA],
  },
];

function req(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const r = https.request({
      hostname: HOST, path, method,
      headers: {
        'apikey':        KEY,
        'Authorization': 'Bearer ' + KEY,
        'Content-Type':  'application/json',
        'Prefer':        'return=representation',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    r.on('error', reject);
    if (payload) r.write(payload);
    r.end();
  });
}

async function run() {
  let order = 1;
  for (const p of PROJECTS) {
    // 1. Insert project
    const res = await req('POST', '/rest/v1/projects', {
      title:    { pt: p.title, en: p.title, fr: p.title },
      slug:     { pt: p.slug,  en: p.slug,  fr: p.slug },
      client_name: p.client,
      featured_image_path: p.image,
      gallery:  p.videoUrl ? { video_url: p.videoUrl } : null,
      is_featured: false,
      status:   'published',
      published_at: new Date().toISOString(),
    });

    if (res.status !== 201) {
      console.error(`\u2717 Failed to insert ${p.title}:`, res.body);
      continue;
    }

    const project = JSON.parse(res.body)[0];
    console.log(`\u2713 Inserted: ${p.title} (${project.id})`);

    // 2. Link to social section
    const linkRes = await req('POST', '/rest/v1/category_section_projects', {
      category_section_id: SOCIAL_SECTION_ID,
      project_id:          project.id,
      order:               order++,
    });
    if (linkRes.status !== 201) {
      console.error(`  \u2717 Failed to link section:`, linkRes.body);
    } else {
      console.log(`  \u2192 Linked to Projetos Sociais section`);
    }

    // 3. Link tags
    for (const tagId of p.tags) {
      const tagRes = await req('POST', '/rest/v1/project_project_tags', {
        project_id: project.id,
        tag_id:     tagId,
      });
      if (tagRes.status !== 201) {
        console.error(`  \u2717 Failed to link tag ${tagId}:`, tagRes.body);
      }
    }
    console.log(`  \u2192 Tags linked`);
  }

  console.log('\nDone!');
}

run().catch(console.error);
