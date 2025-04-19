import { auth } from '@clerk/nextjs/server';
import { Storage } from '@google-cloud/storage';
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

const storage = new Storage(); // Usamos ADC como configuramos antes
const GOOGLE_CLOUD_BUCKET_NAME = "gym-app-profile-pics";
const bucket = storage.bucket(GOOGLE_CLOUD_BUCKET_NAME);

export async function POST(req: Request): Promise<Response> {
  const authData = await auth();
  const { userId } = authData;

  if (!userId) {
    return new Response('No autenticado', { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file');

  // Verificar que el archivo sea del tipo correcto
  if (!file || !(file instanceof Blob)) {
    return new Response('Archivo requerido o tipo inválido', { status: 400 });
  }

  const fileName = `${userId}-${Date.now()}.${file.name.split('.').pop()}`;
  const blob = bucket.file(fileName);
  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: file.type, // Establecer el tipo MIME correcto
    },
    predefinedAcl: 'publicRead', // Hacer el archivo público al subirlo
  });

  // Convertir el archivo a un buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Manejar el stream y devolver una respuesta explícita
  return new Promise<Response>((resolve) => {
    blobStream.on('error', (err: Error) => {
      console.error('Error al subir a GCS:', err);
      resolve(new Response('Error al subir archivo', { status: 500 }));
    });

    blobStream.on('finish', async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { profilePictureUrl: publicUrl },
        });
        resolve(NextResponse.json({ url: publicUrl }));
      } catch (err) {
        console.error('Error al actualizar la base de datos:', err);
        resolve(new Response('Error al actualizar la base de datos', { status: 500 }));
      }
    });

    blobStream.end(buffer);
  });
}
