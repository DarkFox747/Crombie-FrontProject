import { verifyWebhook  } from '@clerk/nextjs/webhooks';
import prisma from '../../../../lib/prisma';


interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name?: string;
    last_name?: string;
  };
}

export async function POST(req: Request): Promise<Response> {
  try {
    //eslint-disable-next-line 
    const evt = await verifyWebhook(req as any) as ClerkWebhookEvent;

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
          dni: `DNI-${id.slice(-8)}`, // Generar un DNI ficticio basado en el ID
          role: 'ALUMNO',
        },
      });
    }

    return new Response('Webhook received', { status: 200 });
  } catch (err) {
    // Tipar el error como "unknown" y manejarlo adecuadamente
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
}
