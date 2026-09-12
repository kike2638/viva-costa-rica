// Limpieza de propiedades demo de la colección en Appwrite.
// - Elimina SOLO documentos demo (por título exacto), con ID limpio o legado.
// - NO crea ni modifica propiedades reales (nunca toca MAG-1005, etc.).
// - Permisos de documentos: las escrituras van por /api/admin/* (serverless).
//
// Uso: npx tsx cleanup-demo-properties.ts TU_API_KEY   (o define APPWRITE_API_KEY)
import { Client, Databases } from 'node-appwrite';

const ENDPOINT = 'https://sfo.cloud.appwrite.io/v1';
const PROJECT_ID = '6a7e4f6f0037477961d2';
const DATABASE_ID = 'VIVA_db';
const COLLECTION_ID = 'properties';

const apiKey = process.argv[2] || process.env.APPWRITE_API_KEY;

if (!apiKey) {
  console.error('\n❌ ERROR: Falta la API Key de Appwrite.\n');
  console.log('📌 Uso: npx tsx cleanup-demo-properties.ts TU_API_KEY o define APPWRITE_API_KEY');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(apiKey);

const db = new Databases(client);

// Títulos exactos de las propiedades demo que deben eliminarse.
const DEMO_TITLES = [
  'Cabaña Alpina A-Frame con Vistas Panorámicas y Energía Solar',
  'Residencia Contemporánea de Lujo en Escazú',
  'Quinta Residencial Campestre en Atenas',
  'Cabaña Romántica A-Frame para Escapadas Vacacionales',
];
const demoSet = new Set(DEMO_TITLES);

async function cleanup() {
  console.log('🔍 Buscando propiedades demo en la colección...');

  const existing = await db.listDocuments(DATABASE_ID, COLLECTION_ID);
  let deleted = 0;
  let skipped = 0;

  for (const doc of existing.documents) {
    if (demoSet.has(doc.title)) {
      await db.deleteDocument(DATABASE_ID, COLLECTION_ID, doc.$id);
      console.log(`🗑️  Eliminada demo: ${doc.title} (${doc.$id})`);
      deleted++;
    } else {
      console.log(`✅ Conservada: ${doc.title} (${doc.$id})`);
      skipped++;
    }
  }

  console.log(`\n🎉 Terminado: ${deleted} demo eliminada(s), ${skipped} propiedad(es) conservada(s).`);
  if (skipped > 0) console.log('Tus propiedades reales no fueron tocadas.');
}

cleanup().catch(console.error);

