import sgMail from '@sendgrid/mail';

const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
  sgMail.setApiKey(apiKey);
}

const defaultFrom = process.env.SENDGRID_FROM_EMAIL || process.env.CONTACT_INBOX_EMAIL || 'info@flowproductions.pt';

export type SendGridMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

export function isSendGridConfigured(): boolean {
  return Boolean(apiKey && apiKey.length > 0 && !apiKey.includes('your-'));
}

export async function sendMail(msg: SendGridMessage): Promise<boolean> {
  if (!isSendGridConfigured()) {
    return false;
  }
  try {
    await sgMail.send({
      to: msg.to,
      from: {
        email: defaultFrom,
        name: 'Flow Productions',
      },
      subject: msg.subject,
      text: msg.text,
      html: msg.html,
      ...(msg.replyTo && { replyTo: msg.replyTo }),
    });
    return true;
  } catch (err) {
    console.error('SendGrid send error:', err);
    return false;
  }
}
