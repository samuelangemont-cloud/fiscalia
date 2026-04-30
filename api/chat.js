export default async function handler(req, res) {
  // Autoriser seulement les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // Vérifier que la clé API est bien configurée
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Clé API manquante. Configurez ANTHROPIC_API_KEY dans Vercel.' });
  }

  try {
    // Appel sécurisé vers l'API Anthropic (la clé reste côté serveur)
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: 'Erreur de connexion à l\'API Claude.' });
  }
}
