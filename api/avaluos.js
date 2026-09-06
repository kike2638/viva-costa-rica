// Vercel Serverless Function — Terra Capital (San Ramón)
// Requiere Vercel Postgres (POSTGRES_URL) y env var creada en dashboard
// Fallback a memoria si no hay DB (para deploy inicial sin Postgres)

let mem = []; // fallback

export default async function handler(req, res) {
  // CORS para Vite
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const hasDB = !!process.env.POSTGRES_URL;

  try {
    if (hasDB) {
      const { sql } = await import('@vercel/postgres');
      if (req.method === 'GET') {
        const { rows } = await sql`SELECT * FROM avaluos ORDER BY created_at DESC LIMIT 100`;
        return res.status(200).json(rows);
      }
      if (req.method === 'POST') {
        const b = req.body;
        const id = `AV-${Date.now().toString().slice(-6)}`;
        await sql`
          INSERT INTO avaluos (id, nombre, email, telefono, direccion, superficie, tipo, descripcion, modalidad, urgencia, status, pago_status, costo_total, desplazamiento_costo)
          VALUES (${id}, ${b.nombre}, ${b.email}, ${b.telefono}, ${b.direccion}, ${b.superficie}, ${b.tipo}, ${b.descripcion}, ${b.modalidad}, ${b.urgencia}, ${b.status||'pendiente_pago'}, ${b.pagoStatus||'pendiente'}, ${b.costoTotal||0}, ${b.desplazamientoCosto||0})
        `;
        return res.status(201).json({ id });
      }
      return res.status(405).json({ error: 'Method not allowed' });
    } else {
      // fallback memoria (útil antes de crear Postgres)
      if (req.method === 'GET') return res.status(200).json(mem);
      if (req.method === 'POST') { const id=`AV-${Date.now().toString().slice(-6)}`; const item={ id, createdAt:new Date().toISOString(), ...req.body }; mem.unshift(item); return res.status(201).json({ id }); }
      return res.status(200).json({ message: 'No DB yet, using memory. Create Vercel Postgres.' });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: String(e.message || e) });
  }
}
