import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public', 'videos', 'hero');
const tmpDir = path.join(root, '.tmp', 'hero-videos');

const HERO_VIDEOS = [
  { fileId: '1L-iRc0FlBvlbfyUqWVjHUCsXnHuNOXTH', output: 'animacao.mp4' },
  { fileId: '1Tr6QxcGr7lIVGqMqEC9nI5T4fwZ0hByP', output: 'audiovisual.mp4' },
];

async function resolveGoogleDriveVideoUrl(fileId) {
  const initialUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  const response = await fetch(initialUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    redirect: 'follow',
  });

  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('video/')) {
    return response.url;
  }

  if (!contentType.includes('text/html')) {
    throw new Error(`Unexpected Google Drive response type for ${fileId}`);
  }

  const html = await response.text();
  const confirmMatch = html.match(/name="confirm" value="([^"]+)"/);
  const uuidMatch = html.match(/name="uuid" value="([^"]+)"/);

  if (!uuidMatch) {
    throw new Error(`Google Drive virus-scan page missing download token for ${fileId}`);
  }

  const confirm = confirmMatch?.[1] ?? 't';
  return `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=${confirm}&uuid=${uuidMatch[1]}`;
}

async function downloadFile(url, destination) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });

  if (!response.ok || !response.body) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }

  await fs.promises.mkdir(path.dirname(destination), { recursive: true });
  const fileStream = fs.createWriteStream(destination);
  const reader = response.body.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    fileStream.write(Buffer.from(value));
  }

  await new Promise((resolve, reject) => {
    fileStream.end((error) => (error ? reject(error) : resolve()));
  });
}

function compressVideo(inputPath, outputPath) {
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-i',
      inputPath,
      '-an',
      '-vf',
      "scale='min(1920,iw)':-2",
      '-c:v',
      'libx264',
      '-crf',
      '28',
      '-preset',
      'medium',
      '-movflags',
      '+faststart',
      outputPath,
    ],
    { stdio: 'inherit' }
  );
}

async function main() {
  await fs.promises.mkdir(outDir, { recursive: true });
  await fs.promises.mkdir(tmpDir, { recursive: true });

  for (const { fileId, output } of HERO_VIDEOS) {
    const outputPath = path.join(outDir, output);
    const sourcePath = path.join(tmpDir, `${fileId}.source.mp4`);

    console.log(`\nPreparing ${output}...`);
    const videoUrl = await resolveGoogleDriveVideoUrl(fileId);
    console.log(`Downloading ${fileId}...`);
    await downloadFile(videoUrl, sourcePath);

    const sourceStats = await fs.promises.stat(sourcePath);
    console.log(`Downloaded ${(sourceStats.size / 1024 / 1024).toFixed(1)} MB`);

    console.log(`Compressing to ${outputPath}...`);
    compressVideo(sourcePath, outputPath);

    const outputStats = await fs.promises.stat(outputPath);
    console.log(`Created ${output} (${(outputStats.size / 1024 / 1024).toFixed(1)} MB)`);
    await fs.promises.unlink(sourcePath);
  }

  console.log('\nHero videos ready in public/videos/hero/');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
