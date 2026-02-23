'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Supabase not configured');

  const titlePt = formData.get('title_pt') as string;
  const slugPt = (formData.get('slug') as string) || slugify(titlePt);
  const excerptPt = formData.get('excerpt_pt') as string;
  const authorName = (formData.get('author_name') as string) || 'Flow Productions';
  const status = formData.get('status') as string;
  const mediaType = formData.get('media_type') as string;
  const videoSource = formData.get('video_source') as string; // 'url' | 'file'
  const videoUrl = formData.get('video_url') as string;
  const imageFile = formData.get('image') as File | null;
  const videoFile = formData.get('video_file') as File | null;

  const { data: post, error } = await supabase
    .from('blog_posts')
    .insert({
      title: { pt: titlePt },
      slug: { pt: slugPt },
      excerpt: { pt: excerptPt },
      author_name: authorName,
      status,
      media_type: mediaType,
      video_url: mediaType === 'video' && videoSource === 'url' ? videoUrl : null,
      published_at: status === 'published' ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  if (mediaType === 'image' && imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split('.').pop() || 'jpg';
    const path = `blog/${post.id}.${ext}`;
    const arrayBuffer = await imageFile.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from('public-media')
      .upload(path, arrayBuffer, { contentType: imageFile.type, upsert: true });

    if (!uploadError) {
      const { data: urlData } = supabase.storage.from('public-media').getPublicUrl(path);
      await supabase
        .from('blog_posts')
        .update({ featured_image_path: urlData.publicUrl })
        .eq('id', post.id);
    }
  }

  if (mediaType === 'video' && videoSource === 'file' && videoFile && videoFile.size > 0) {
    const ext = videoFile.name.split('.').pop() || 'mp4';
    const path = `blog/videos/${post.id}.${ext}`;
    const arrayBuffer = await videoFile.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from('public-media')
      .upload(path, arrayBuffer, { contentType: videoFile.type, upsert: true });

    if (!uploadError) {
      const { data: urlData } = supabase.storage.from('public-media').getPublicUrl(path);
      await supabase
        .from('blog_posts')
        .update({ video_url: urlData.publicUrl })
        .eq('id', post.id);
    }
  }

  revalidatePath('/[locale]/admin/posts', 'page');
  revalidatePath('/[locale]/(site)/blog', 'page');
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Supabase not configured');

  const titlePt = formData.get('title_pt') as string;
  const slugPt = (formData.get('slug') as string) || slugify(titlePt);
  const excerptPt = formData.get('excerpt_pt') as string;
  const authorName = (formData.get('author_name') as string) || 'Flow Productions';
  const status = formData.get('status') as string;
  const mediaType = formData.get('media_type') as string;
  const videoSource = formData.get('video_source') as string; // 'url' | 'file'
  const videoUrl = formData.get('video_url') as string;
  const imageFile = formData.get('image') as File | null;
  const videoFile = formData.get('video_file') as File | null;

  const updates: Record<string, unknown> = {
    title: { pt: titlePt },
    slug: { pt: slugPt },
    excerpt: { pt: excerptPt },
    author_name: authorName,
    status,
    media_type: mediaType,
    video_url: mediaType === 'video' && videoSource === 'url' ? videoUrl : (mediaType === 'video' ? undefined : null),
  };

  if (status === 'published') {
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('published_at')
      .eq('id', id)
      .single();
    if (!existing?.published_at) {
      updates.published_at = new Date().toISOString();
    }
  }

  if (mediaType === 'image' && imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split('.').pop() || 'jpg';
    const path = `blog/${id}.${ext}`;
    const arrayBuffer = await imageFile.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from('public-media')
      .upload(path, arrayBuffer, { contentType: imageFile.type, upsert: true });

    if (!uploadError) {
      const { data: urlData } = supabase.storage.from('public-media').getPublicUrl(path);
      updates.featured_image_path = urlData.publicUrl;
    }
  }

  if (mediaType === 'video' && videoSource === 'file' && videoFile && videoFile.size > 0) {
    const ext = videoFile.name.split('.').pop() || 'mp4';
    const path = `blog/videos/${id}.${ext}`;
    const arrayBuffer = await videoFile.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from('public-media')
      .upload(path, arrayBuffer, { contentType: videoFile.type, upsert: true });

    if (!uploadError) {
      const { data: urlData } = supabase.storage.from('public-media').getPublicUrl(path);
      updates.video_url = urlData.publicUrl;
    }
  }

  const { error } = await supabase.from('blog_posts').update(updates).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/[locale]/admin/posts', 'page');
  revalidatePath('/[locale]/(site)/blog', 'page');
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Supabase not configured');

  await supabase.storage.from('public-media').remove([
    `blog/${id}.jpg`, `blog/${id}.png`, `blog/${id}.webp`,
    `blog/videos/${id}.mp4`, `blog/videos/${id}.mov`, `blog/videos/${id}.webm`,
  ]);

  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/[locale]/admin/posts', 'page');
  revalidatePath('/[locale]/(site)/blog', 'page');
}

export async function toggleStatus(id: string, currentStatus: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Supabase not configured');

  const newStatus = currentStatus === 'published' ? 'draft' : 'published';
  const updates: Record<string, unknown> = { status: newStatus };
  if (newStatus === 'published') {
    updates.published_at = new Date().toISOString();
  }

  const { error } = await supabase.from('blog_posts').update(updates).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/[locale]/admin/posts', 'page');
  revalidatePath('/[locale]/(site)/blog', 'page');
}
