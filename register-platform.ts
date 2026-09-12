// Registra un Web Platform en Appwrite para permitir peticiones desde el navegador
// de un dominio (arregla el error "Invalid Origin ... Register your new client").
//
// Requisito: API key con scope platforms.write (y project.write).
// Uso: npx tsx register-platform.ts TU_API_KEY [hostname]
//   hostname por defecto: VIVA-bienesraices.vercel.app (sin https://)
const ENDPOINT = 'https://sfo.cloud.appwrite.io/v1';
const PROJECT_ID = '6a7e4f6f0037477961d2';

const apiKey = process.argv[2] || process.env.APPWRITE_API_KEY;
const hostname = process.argv[3] || 'VIVA-bienesraices.vercel.app';

if (!apiKey) {
  console.error('\n❌ ERROR: Falta la API Key de Appwrite.\n');
  console.log('📌 Uso: npx tsx register-platform.ts TU_API_KEY [hostname]');
  process.exit(1);
}

const platformId = `web-${hostname.replace(/[^a-zA-Z0-9_-]/g, '-')}`;

async function register() {
  console.log(`🔗 Registrando Web Platform para hostname: ${hostname}`);
  const res = await fetch(`${ENDPOINT}/project/platforms/web`, {
    method: 'POST',
    headers: {
      'X-Appwrite-Project': PROJECT_ID,
      'X-Appwrite-Key': apiKey,
      'X-Appwrite-Response-Format': '1.9.5',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      platformId,
      name: `Web - ${hostname}`,
      hostname,
    }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body.message || `Error ${res.status}`;
    if (res.status === 401 || res.status === 403) {
      console.error(`\n❌ ${msg}\n`);
      console.error('Tu API key probablemente no tiene el scope "platforms.write".');
      console.error('Créala así: Console → Auth → Settings → API Keys → Nueva → marca platforms.write (y project.write).');
      console.error('O hazlo por la consola: Home del proyecto → abajo → Integrations → Add Platform → Web app.');
    } else if (res.status === 409) {
      console.error(`\n⚠️  Ya existe una plataforma para ese hostname (${msg}).`);
      console.error('Si ya la registraste, solo recarga el celular.');
    } else {
      console.error(`\n❌ ${msg}`);
    }
    process.exit(1);
  }

  console.log('\n✅ Web Platform registrada correctamente:');
  console.log('   hostname:', hostname);
  console.log('   platformId:', body.$id || body.platformId || platformId);
  console.log('\n👉 Ahora recarga la página en tu celular (cierra y reabre la pestaña).');
}

register().catch(console.error);

