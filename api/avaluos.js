// Vercel Serverless Function — Viva Costa Rica (vivacostarica.com)
// Requiere Vercel Postgres (POSTGRES_URL) + Vercel Blob (BLOB_READ_WRITE_TOKEN)
// Docs: https://vercel.com/docs/storage/vercel-postgres + /vercel-blob
// Tablas: sql/schema.sql (avaluos, propiedades)

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
          INSERT INTO avaluos (id, nombre, email, telefono, direccion, superficie, tipo, descripcion, modalidad, urgencia, status, pago_status, costo_total, desplazamiento_costo, metodologia, doc_completitud, documentos, numero_plano, folio_real, area_terreno, area_construccion, anio_construccion, materiales, uso_suelo, tiene_construccion)
          VALUES (${id}, ${b.nombre}, ${b.email}, ${b.telefono}, ${b.direccion}, ${b.superficie}, ${b.tipo}, ${b.descripcion}, ${b.modalidad}, ${b.urgencia}, ${b.status||'pendiente_pago'}, ${b.pagoStatus||'pendiente'}, ${b.costoTotal||0}, ${b.desplazamientoCosto||0}, ${b.metodologia||''}, ${b.docCompletitud||0}, ${JSON.stringify(b.documentos||{})}, ${b.numeroPlano||''}, ${b.folioReal||''}, ${b.areaTerreno||0}, ${b.areaConstruccion||0}, ${b.anioConstruccion||null}, ${b.materiales||''}, ${b.usoSuelo||''}, ${b.tieneConstruccion??true})
        `;
        return res.status(201).json({ id });
      }
      if (req.method === 'PUT') {
        const b = req.body; const id = b.id || req.query.id;
        if (!id) return res.status(400).json({ error: 'id required' });
        // update dinámico: solo campos enviados
        await sql`UPDATE avaluos SET status = COALESCE(${b.status}, status), pago_status = COALESCE(${b.pagoStatus}, pago_status), valor_estimado = COALESCE(${b.valorEstimado}, valor_estimado), tasador = COALESCE(${b.tasador}, tasador), fecha_visita = COALESCE(${b.fechaVisita}, fecha_visita), notas = COALESCE(${b.notas}, notas), documentos = COALESCE(${b.documentos ? JSON.stringify(b.documentos) : null}::jsonb, documentos), costo_total = COALESCE(${b.costoTotal}, costo_total) WHERE id = ${id}`;
        return res.status(200).json({ ok: true });
      }
      if (req.method === 'DELETE') {
        const id = req.query.id || req.body?.id;
        if (!id) return res.status(400).json({ error: 'id required' });
        await sql`DELETE FROM avaluos WHERE id = ${id}`;
        return res.status(200).json({ ok: true });
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
