export async function resolveGoogleDriveVideoUrl(fileId: string): Promise<string> {
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
    throw new Error('Unexpected Google Drive response type');
  }

  const html = await response.text();
  const confirmMatch = html.match(/name="confirm" value="([^"]+)"/);
  const uuidMatch = html.match(/name="uuid" value="([^"]+)"/);

  if (!uuidMatch) {
    throw new Error('Google Drive virus-scan page missing download token');
  }

  const confirm = confirmMatch?.[1] ?? 't';
  return `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=${confirm}&uuid=${uuidMatch[1]}`;
}
