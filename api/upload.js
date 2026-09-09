// Vercel Blob — Upload para Viva Costa Rica
// Docs: https://vercel.com/docs/storage/vercel-blob
import { put } from '@vercel/blob';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    // req.query.filename = ?filename=plano-xxx.pdf, avaluoId para carpeta
    const filename = req.query.filename || `upload-${Date.now()}`;
    const avaluoId = req.query.avaluoId || 'general';
    const blob = await put(`avaluos/${avaluoId}/${filename}`, req, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return res.status(200).json({ url: blob.url, pathname: blob.pathname });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: String(e.message || e) });
  }
}
