/**
 * Witflow CMS webhook alias — same handler as /api/webhooks/blog.
 * Configure the CMS to POST here with header x-webhook-secret.
 */
export { POST } from '@/app/api/webhooks/blog/route';
