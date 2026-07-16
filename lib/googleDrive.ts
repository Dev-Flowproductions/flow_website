export function getGoogleDriveFileId(urlOrId: string): string {
  const match = urlOrId.match(/\/d\/([^/]+)/);
  return match?.[1] ?? urlOrId;
}

export function getGoogleDrivePreviewUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

export function getGoogleDriveVideoSrc(fileId: string): string {
  return `/api/drive-video?fileId=${encodeURIComponent(fileId)}`;
}
