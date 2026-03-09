import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendMail, isSendGridConfigured } from '@/lib/sendgrid';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(200, 'Name too long'),
  email: z.string().trim().email('Invalid email address'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(10000, 'Message too long'),
  consent: z
    .union([z.boolean(), z.literal('true'), z.literal('on')])
    .transform((v) => v === true || v === 'true' || v === 'on')
    .refine((v) => v === true, 'Consent is required'),
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const locale = request.headers.get('accept-language')?.split(',')[0] || 'pt';

    const validatedData = contactSchema.parse(body);

    const supabase = await createClient();

    if (!supabase) {
      console.error('Contact API: Supabase not configured (missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY)');
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { error } = await supabase.from('contact_messages').insert({
      name: validatedData.name,
      email: validatedData.email,
      message: validatedData.message,
      locale,
      consent: validatedData.consent,
      consent_at: new Date().toISOString(),
      status: 'new',
    });

    if (error) {
      console.error('Supabase contact_messages insert error:', error.message, error.details);
      return NextResponse.json(
        { error: 'Failed to save message', code: error.code },
        { status: 500 }
      );
    }

    if (isSendGridConfigured()) {
      try {
        const inbox = process.env.CONTACT_INBOX_EMAIL || 'info@flowproductions.pt';
        await sendMail({
          to: inbox,
          subject: `Nova mensagem de contacto: ${validatedData.name}`,
          text: `
Nome: ${validatedData.name}
Email: ${validatedData.email}
Mensagem:
${validatedData.message}
        `,
          html: `
<h2>Nova mensagem de contacto</h2>
<p><strong>Nome:</strong> ${escapeHtml(validatedData.name)}</p>
<p><strong>Email:</strong> ${escapeHtml(validatedData.email)}</p>
<p><strong>Mensagem:</strong></p>
<p>${escapeHtml(validatedData.message).replace(/\n/g, '<br>')}</p>
        `,
          replyTo: validatedData.email,
        });
      } catch (emailErr) {
        console.error('SendGrid error in contact route:', emailErr);
        // Don't fail the request – message is already saved in DB
      }
    }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Contact validation failed:', error.errors);
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
