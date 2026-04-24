export default async function handler(req, res) {
  // CORS — solo permitir POST desde el dominio propio (ajustar en producción)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nombre, email, estado, utm_source, utm_medium, utm_campaign, utm_content } = req.body || {};

  // Validación básica
  if (!email || !nombre || !estado) {
    return res.status(400).json({ error: 'Faltan campos requeridos: nombre, email, estado.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email inválido.' });
  }

  // Variables de entorno (configurar en Vercel)
  const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
  const MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID;

  if (!MAILERLITE_API_KEY || !MAILERLITE_GROUP_ID) {
    console.error('Missing MailerLite env vars');
    return res.status(500).json({ error: 'Configuración del servidor incompleta.' });
  }

  try {
    const mlResponse = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        fields: {
          name: nombre,
          estado,
          utm_source: utm_source || 'direct',
          utm_medium: utm_medium || 'none',
          utm_campaign: utm_campaign || 'organic',
          utm_content: utm_content || '',
        },
        groups: [MAILERLITE_GROUP_ID],
        status: 'active',
      }),
    });

    const data = await mlResponse.json();

    if (!mlResponse.ok) {
      // MailerLite devuelve 422 si el email ya existe — eso no es un error real
      if (mlResponse.status === 422 && data.errors?.email) {
        return res.status(200).json({ success: true, alreadyExists: true });
      }
      console.error('MailerLite error:', data);
      return res.status(500).json({ error: 'No pudimos registrar tu email. Inténtalo de nuevo.' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Error inesperado. Inténtalo de nuevo.' });
  }
}
