// POST /api/admin/login  { email, password } -> { token }
// Valida las credenciales contra variables de entorno de Vercel.
import { json, signToken, verifyPassword } from './_shared.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Método no permitido' });

  const { email = '', password = '' } = req.body || {};
  const adminEmail = process.env.ADMIN_EMAIL || '';
  const adminPassword = process.env.ADMIN_PASSWORD || '';
  const tokenSecret = process.env.ADMIN_TOKEN_SECRET || '';

  if (!adminEmail || !adminPassword || !tokenSecret) {
    return json(res, 500, { error: 'Servidor mal configurado: faltan variables de entorno' });
  }

  if (email.trim().toLowerCase() === adminEmail.toLowerCase() && verifyPassword(password, adminPassword)) {
    return json(res, 200, { token: signToken(adminEmail) });
  }

  return json(res, 401, { error: 'Credenciales incorrectas' });
}
