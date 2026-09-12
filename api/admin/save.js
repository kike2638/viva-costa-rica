// POST /api/admin/save  { token, id, data } -> { ok, $id }
// Crea o actualiza una propiedad en Appwrite usando la API Key del servidor.
import { json, verifyToken } from './_shared.js';

const ENDPOINT = 'https://sfo.cloud.appwrite.io/v1';
const DB = 'magno_db';
const COLL = 'properties';

function headers() {
  return {
    'X-Appwrite-Project': process.env.APPWRITE_PROJECT_ID || '6a7e4f6f0037477961d2',
    'X-Appwrite-Key': process.env.APPWRITE_API_KEY || '',
    'X-Appwrite-Response-Format': '1.9.5',
    'Content-Type': 'application/json',
  };
}

function cleanData(data) {
  const out = { ...data };
  delete out.id;
  delete out.created_at;
  delete out.$id;
  delete out.$createdAt;
  delete out.$updatedAt;
  delete out.$permissions;
  return out;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Método no permitido' });

  const { token, id, data } = req.body || {};
  if (!verifyToken(token)) return json(res, 401, { error: 'Sesión inválida o expirada' });
  if (!id || !data || typeof data !== 'object') return json(res, 400, { error: 'Datos incompletos' });
  if (!process.env.APPWRITE_API_KEY) return json(res, 500, { error: 'Servidor mal configurado: falta APPWRITE_API_KEY' });

  const payload = cleanData(data);
  const docId = String(id).replace(/[^a-zA-Z0-9_.-]/g, '_');

  try {
    // 1) Intentar actualizar si ya existe
    const getRes = await fetch(`${ENDPOINT}/databases/${DB}/collections/${COLL}/documents/${encodeURIComponent(docId)}`, {
      headers: headers(),
    });

    if (getRes.ok) {
      // Appwrite exige todos los atributos requeridos en cada update.
      // Fusionamos el cambio parcial con los datos ya guardados.
      const existingDoc = await getRes.json();
      const existingData = { ...existingDoc };
      delete existingData.$id;
      delete existingData.$createdAt;
      delete existingData.$updatedAt;
      delete existingData.$permissions;
      const merged = { ...existingData, ...payload };

      const upRes = await fetch(`${ENDPOINT}/databases/${DB}/collections/${COLL}/documents/${encodeURIComponent(docId)}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify({ data: merged }),
      });
      const upBody = await upRes.json();
      if (!upRes.ok) return json(res, upRes.status, { error: upBody.message || 'Error al actualizar' });
      return json(res, 200, { ok: true, $id: docId });
    }

    // 2) Si no existe, crear
    const crRes = await fetch(`${ENDPOINT}/databases/${DB}/collections/${COLL}/documents`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ documentId: docId, data: payload, permissions: ['read("any")'] }),
    });
    const crBody = await crRes.json();
    if (!crRes.ok) return json(res, crRes.status, { error: crBody.message || 'Error al crear' });
    return json(res, 200, { ok: true, $id: docId });
  } catch (e) {
    return json(res, 500, { error: e.message || 'Error interno' });
  }
}
