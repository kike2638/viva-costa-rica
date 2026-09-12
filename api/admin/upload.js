// POST /api/admin/upload  { token, name, mimeType, base64 } -> { url }
// Sube una imagen comprimida a Appwrite Storage usando la API Key del servidor.
import { json, verifyToken } from './_shared.js';

const ENDPOINT = 'https://sfo.cloud.appwrite.io/v1';
const BUCKET = 'property_images';

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Método no permitido' });

  const { token, name = 'imagen.jpg', mimeType = 'image/jpeg', base64 } = req.body || {};
  if (!verifyToken(token)) return json(res, 401, { error: 'Sesión inválida o expirada' });
  if (!base64) return json(res, 400, { error: 'Falta el archivo' });
  if (!process.env.APPWRITE_API_KEY) return json(res, 500, { error: 'Servidor mal configurado: falta APPWRITE_API_KEY' });

  const buf = Buffer.from(base64, 'base64');
  if (buf.length === 0) return json(res, 400, { error: 'Archivo vacío' });
  if (buf.length > 8 * 1024 * 1024) return json(res, 413, { error: 'Archivo demasiado grande' });

  const blob = new Blob([buf], { type: mimeType || 'image/jpeg' });
  const fileId = Array.from({ length: 20 }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('');
  const fd = new FormData();
  fd.append('fileId', fileId);
  fd.append('file', blob, name);
  // Appwrite espera los arrays en FormData como claves repetidas `key[]` (igual que el SDK oficial),
  // no como JSON string.
  fd.append('permissions[]', 'read("any")');

  try {
    const resp = await fetch(`${ENDPOINT}/storage/buckets/${BUCKET}/files`, {
      method: 'POST',
      headers: {
        'X-Appwrite-Project': process.env.APPWRITE_PROJECT_ID || '6a7e4f6f0037477961d2',
        'X-Appwrite-Key': process.env.APPWRITE_API_KEY,
        'X-Appwrite-Response-Format': '1.9.5',
      },
      body: fd,
    });

    const body = await resp.json();
    if (!resp.ok) return json(res, resp.status, { error: body.message || 'Error al subir' });

    const url = `${ENDPOINT}/storage/buckets/${BUCKET}/files/${body.$id}/view?project=${process.env.APPWRITE_PROJECT_ID || '6a7e4f6f0037477961d2'}`;
    return json(res, 200, { url });
  } catch (e) {
    return json(res, 500, { error: e.message || 'Error interno' });
  }
}
