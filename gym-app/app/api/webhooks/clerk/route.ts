import { Webhook } from 'svix';
import { headers } from 'next/headers';
import prisma from '../../../../lib/prisma';

export async function POST(req: Request) {
  const payload = await req.json();
  const heads = headers();

  // Verificar la firma del webhook
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

  try {
    const wh = new Webhook(webhookSecret);
    wh.verify(JSON.stringify(payload), {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  // Manejar eventos de Clerk
  const eventType = payload.type;
  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = payload.data;
    const email = email_addresses[0].email_address;
    const name = `${first_name || ''} ${last_name || ''}`.trim() || 'Usuario sin nombre';

    await prisma.user.upsert({
      where: { id }, // Usar el ID de Clerk como ID en Prisma
      update: {
        email,
        name,
        // Actualizar otros campos si es necesario
      },
      create: {
        id, // Sincronizar con Clerk
        email,
        name,
        dni: `DNI-${id.slice(-8)}`, // Generar un DNI temporal
        role: 'ALUMNO', // Por defecto, ajustar según lógica
      },
    });
  }

  return new Response('Webhook processed', { status: 200 });
}