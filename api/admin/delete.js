// POST /api/admin/delete  { token, id } -> { ok }
// Elimina una propiedad de Appwrite usando la API Key del servidor.
import { json, verifyToken } from './_shared.js';

const ENDPOINT = 'https://sfo.cloud.appwrite.io/v1';
const DB = 'magno_db';
const COLL = 'properties';

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Método no permitido' });

  const { token, id } = req.body || {};
  if (!verifyToken(token)) return json(res, 401, { error: 'Sesión inválida o expirada' });
  if (!id) return json(res, 400, { error: 'Falta el ID' });
  if (!process.env.APPWRITE_API_KEY) return json(res, 500, { error: 'Servidor mal configurado: falta APPWRITE_API_KEY' });

  try {
    const resp = await fetch(
      `${ENDPOINT}/databases/${DB}/collections/${COLL}/documents/${encodeURIComponent(String(id))}`,
      {
        method: 'DELETE',
        headers: {
          'X-Appwrite-Project': process.env.APPWRITE_PROJECT_ID || '6a7e4f6f0037477961d2',
          'X-Appwrite-Key': process.env.APPWRITE_API_KEY,
          'X-Appwrite-Response-Format': '1.9.5',
        },
      }
    );

    if (resp.ok || resp.status === 404) {
      return json(res, 200, { ok: true });
    }
    const body = await resp.json();
    return json(res, resp.status, { error: body.message || 'Error al eliminar' });
  } catch (e) {
    return json(res, 500, { error: e.message || 'Error interno' });
  }
}
