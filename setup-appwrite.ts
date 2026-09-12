/**
 * Script de inicialización automática de Appwrite Cloud para Viva Costa Rica
 * 
 * Uso:
 * 1. Genera una API Key en Appwrite Console (Project Settings -> API Keys) con todos los permisos (databases, collections, attributes, buckets, files).
 * 2. Ejecuta en tu terminal:
 *    npx tsx setup-appwrite.ts TU_API_KEY_AQUI
 *    (o export APPWRITE_API_KEY=tu_key && npx tsx setup-appwrite.ts)
 */

import { Client, Databases, Storage, Permission, Role } from 'node-appwrite';

const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'https://sfo.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID || '6a7e4f6f0037477961d2';
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || 'VIVA_db';
const COLLECTION_ID = process.env.VITE_APPWRITE_COLLECTION_ID || 'properties';
const BUCKET_ID = process.env.VITE_APPWRITE_BUCKET_ID || 'property_images';

const apiKey = process.argv[2] || process.env.APPWRITE_API_KEY;

if (!apiKey) {
  console.error('\n❌ ERROR: Falta la API Key de Appwrite.\n');
  console.log('📌 Cómo obtener tu API Key en 30 segundos:');
  console.log('1. Entra en https://cloud.appwrite.io/console/project-sfo-6a7e4f6f0037477961d2/settings/api-keys');
  console.log('2. Haz clic en "Create API Key"');
  console.log('3. Nombre: "VIVA Setup", marca todos los permisos (Scopes) y dale a "Create"');
  console.log('4. Ejecuta el script pasando tu clave:\n');
  console.log('   npx tsx setup-appwrite.ts TU_SECRET_KEY\n');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(apiKey);

const databases = new Databases(client);
const storage = new Storage(client);

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runSetup() {
  console.log('🚀 Iniciando configuración automática en Appwrite Cloud...');
  console.log(`🌐 Endpoint: ${ENDPOINT}`);
  console.log(`🆔 Project ID: ${PROJECT_ID}\n`);

  // 1. Crear Base de Datos
  try {
    console.log(`📁 1/4 Creando/verificando base de datos '${DATABASE_ID}'...`);
    await databases.get(DATABASE_ID);
    console.log(`   ✅ Base de datos '${DATABASE_ID}' ya existe.`);
  } catch (err: any) {
    if (err.code === 404) {
      await databases.create(DATABASE_ID, 'VIVA Database');
      console.log(`   ✅ Base de datos '${DATABASE_ID}' creada con éxito.`);
    } else {
      console.error('   ❌ Error en base de datos:', err.message);
    }
  }

  // 2. Crear Colección de Propiedades
  try {
    console.log(`\n📋 2/4 Creando/verificando colección '${COLLECTION_ID}'...`);
    await databases.getCollection(DATABASE_ID, COLLECTION_ID);
    console.log(`   ✅ Colección '${COLLECTION_ID}' ya existe.`);
  } catch (err: any) {
    if (err.code === 404) {
      await databases.createCollection(
        DATABASE_ID,
        COLLECTION_ID,
        'Properties',
        [
          Permission.read(Role.any()),
          Permission.create(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any()),
        ],
        false // documentSecurity
      );
      console.log(`   ✅ Colección '${COLLECTION_ID}' creada con permisos públicos.`);
    } else {
      console.error('   ❌ Error al crear colección:', err.message);
    }
  }

  // 3. Crear Atributos
  console.log('\n⚙️  3/4 Creando atributos de la colección de propiedades...');
  
  const stringAttributes = [
    { key: 'title', size: 255, required: true },
    { key: 'description', size: 5000, required: false, default: '' },
    { key: 'currency', size: 10, required: false, default: 'USD' },
    { key: 'property_type', size: 50, required: false, default: 'casa' },
    { key: 'transaction_type', size: 50, required: false, default: 'venta' },
    { key: 'rental_period', size: 20, required: false, default: 'mes' },
    { key: 'status', size: 50, required: false, default: 'disponible' },
    { key: 'location', size: 255, required: false, default: '' },
    { key: 'map_link', size: 1000, required: false, default: '' },
    { key: 'website_url', size: 1000, required: false, default: '' },
  ];

  const floatAttributes = [
    { key: 'price', required: true },
    { key: 'bathrooms', required: false, default: 0 },
    { key: 'land_area_sqm', required: false, default: 0 },
    { key: 'building_area_sqm', required: false, default: 0 },
    { key: 'latitude', required: false },
    { key: 'longitude', required: false },
  ];

  const integerAttributes = [
    { key: 'bedrooms', required: false, default: 0 },
    { key: 'floors', required: false, default: 1 },
  ];

  for (const attr of stringAttributes) {
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        attr.key,
        attr.size,
        attr.required,
        attr.default
      );
      console.log(`   ➕ Atributo String '${attr.key}' creado.`);
      await wait(300);
    } catch (e: any) {
      if (e.code === 409) {
        console.log(`   ℹ️  Atributo '${attr.key}' ya existe.`);
      } else {
        console.warn(`   ⚠️  Error en '${attr.key}':`, e.message);
      }
    }
  }

  for (const attr of floatAttributes) {
    try {
      await databases.createFloatAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        attr.key,
        attr.required,
        undefined,
        undefined,
        attr.default
      );
      console.log(`   ➕ Atributo Float '${attr.key}' creado.`);
      await wait(300);
    } catch (e: any) {
      if (e.code === 409) {
        console.log(`   ℹ️  Atributo '${attr.key}' ya existe.`);
      } else {
        console.warn(`   ⚠️  Error en '${attr.key}':`, e.message);
      }
    }
  }

  for (const attr of integerAttributes) {
    try {
      await databases.createIntegerAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        attr.key,
        attr.required,
        undefined,
        undefined,
        attr.default
      );
      console.log(`   ➕ Atributo Integer '${attr.key}' creado.`);
      await wait(300);
    } catch (e: any) {
      if (e.code === 409) {
        console.log(`   ℹ️  Atributo '${attr.key}' ya existe.`);
      } else {
        console.warn(`   ⚠️  Error en '${attr.key}':`, e.message);
      }
    }
  }

  // Boolean featured
  try {
    await databases.createBooleanAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      'featured',
      false,
      false
    );
    console.log(`   ➕ Atributo Boolean 'featured' creado.`);
    await wait(300);
  } catch (e: any) {
    if (e.code === 409) {
      console.log(`   ℹ️  Atributo 'featured' ya existe.`);
    }
  }

  // Arrays (images, features)
  try {
    await databases.createStringAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      'images',
      2000,
      false,
      undefined,
      true // array
    );
    console.log(`   ➕ Atributo Array de imágenes 'images' creado.`);
    await wait(300);
  } catch (e: any) {
    if (e.code === 409) {
      console.log(`   ℹ️  Atributo 'images' ya existe.`);
    }
  }

  try {
    await databases.createStringAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      'features',
      500,
      false,
      undefined,
      true // array
    );
    console.log(`   ➕ Atributo Array 'features' creado.`);
    await wait(300);
  } catch (e: any) {
    if (e.code === 409) {
      console.log(`   ℹ️  Atributo 'features' ya existe.`);
    }
  }

  // 4. Crear Storage Bucket para las imágenes
  console.log(`\n🖼️  4/4 Creando/verificando Storage Bucket '${BUCKET_ID}'...`);
  try {
    await storage.getBucket(BUCKET_ID);
    console.log(`   ✅ Bucket '${BUCKET_ID}' ya existe.`);
  } catch (err: any) {
    if (err.code === 404) {
      await storage.createBucket(
        BUCKET_ID,
        'Property Images',
        [
          Permission.read(Role.any()),
          Permission.create(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any())
        ],
        false, // fileSecurity
        true,  // enabled
        10485760, // max 10MB
        ['jpg', 'jpeg', 'png', 'webp', 'gif']
      );
      console.log(`   ✅ Bucket '${BUCKET_ID}' creado con permisos públicos.`);
    } else {
      console.error('   ❌ Error al crear bucket:', err.message);
    }
  }

  console.log('\n🎉 ¡CONFIGURACIÓN COMPLETADA CON ÉXITO!');
  console.log('Tu proyecto de Appwrite Cloud está 100% listo para almacenar propiedades y fotos sin caídas.');
}

runSetup().catch((e) => {
  console.error('Error general:', e);
});

