import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendMail, isSendGridConfigured } from '@/lib/sendgrid';
import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  locale: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = newsletterSchema.parse(body);
    
    const locale = validatedData.locale || 
      request.headers.get('accept-language')?.split(',')[0] || 'pt';

    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        {
          email: validatedData.email,
          locale,
          consent_at: new Date().toISOString(),
          status: 'active',
          source: 'website',
        },
        {
          onConflict: 'email',
        }
      );

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to subscribe' },
        { status: 500 }
      );
    }

    if (isSendGridConfigured()) {
      await sendMail({
        to: validatedData.email,
        subject: 'Bem-vindo à Newsletter da Flow Productions',
        text: `
Obrigado por subscrever a nossa newsletter!

Irá receber as nossas últimas novidades e atualizações diretamente no seu email.

Flow Productions
        `,
        html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2>Bem-vindo à Newsletter da Flow Productions</h2>
  <p>Obrigado por subscrever a nossa newsletter!</p>
  <p>Irá receber as nossas últimas novidades e atualizações diretamente no seu email.</p>
  <br>
  <p>Flow Productions<br>
  <a href="https://flowproductions.pt">flowproductions.pt</a></p>
</div>
        `,
      });
    }

    return NextResponse.json(
      { success: true, message: 'Subscribed successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
