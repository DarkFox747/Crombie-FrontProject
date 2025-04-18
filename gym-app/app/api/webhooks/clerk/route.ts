import { verifyWebhook } from '@clerk/nextjs/webhooks';
import prisma from '../../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const evt = await verifyWebhook(req);

    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address || '';
    const name = `${first_name || ''} ${last_name || ''}`.trim() || 'Usuario sin nombre';

    if (evt.type === 'user.created' || evt.type === 'user.updated') {
      await prisma.user.upsert({
        where: { id },
        update: { email, name },
        create: {
          id,
          email,
          name,
          dni: `DNI-${id.slice(-8)}`,
          role: 'ALUMNO',
        },
      });
    }

    return new Response('Webhook received', { status: 200 });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
}
