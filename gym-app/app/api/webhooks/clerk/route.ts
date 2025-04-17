import { Webhook } from 'svix';
import { headers } from 'next/headers';
import prisma from '../../../../lib/prisma';

export async function POST(req: Request) {
  const heads = headers();
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new Response('Webhook secret not set', { status: 400 });
  }

  const svix_id = heads.get('svix-id');
  const svix_timestamp = heads.get('svix-timestamp');
  const svix_signature = heads.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 });
  }

  const rawBody = await req.text();

  let payload: any;
  try {
    const wh = new Webhook(webhookSecret);
    payload = wh.verify(rawBody, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  // Ya verificado, ahora procesamos el body parseado
  const { type: eventType, data } = payload;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = data;
    const email = email_addresses[0].email_address;
    const name = `${first_name || ''} ${last_name || ''}`.trim() || 'Usuario sin nombre';

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

  return new Response('Webhook processed', { status: 200 });
}
