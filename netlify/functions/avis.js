const https = require('https');

// Utilisation d'un stockage ultra-simple et persistant (JSONbin alternative via MyJsonServer ou stockage direct KV local)
exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*"
  };

  // En attendant d'utiliser Netlify Blobs correctement configuré, 
  // on utilise un stockage JSON robuste basé sur une API publique stable.
  return new Promise((resolve) => {
    https.get('https://api.npoint.io/462d7c07e289bf40707a', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let items = [];
        try { items = JSON.parse(data); } catch(e) {}
        if (!Array.isArray(items)) items = [];

        if (event.httpMethod === 'GET') {
          resolve({ statusCode: 200, headers, body: JSON.stringify(items) });
          return;
        }

        if (event.httpMethod !== 'POST') {
          resolve({ statusCode: 405, headers, body: '[]' });
          return;
        }

        let body = {};
        try { body = JSON.parse(event.body || '{}'); } catch(e) {}

        if (body.action === 'add' && body.avis) {
          const avis = body.avis;
          const item = {
            id: String(avis.id || Date.now()),
            auteur: String(avis.auteur || ''),
            nom: String(avis.nom || '').trim().slice(0, 40),
            occasion: String(avis.occasion || '').trim().slice(0, 60),
            note: Math.max(1, Math.min(5, parseInt(avis.note, 10) || 5)),
            texte: String(avis.texte || '').trim().slice(0, 500)
          };
          if (!item.nom || !item.texte || !item.auteur) {
            resolve({ statusCode: 400, headers, body: JSON.stringify({ error: 'invalid' }) });
            return;
          }
          items = items.filter(a => a.id !== item.id).concat(item).slice(-100);
        } else if (body.action === 'delete') {
          const id = String(body.id || '');
          const auteur = String(body.auteur || '');
          items = items.filter(a => !(a.id === id && a.auteur === auteur));
        }

        // Sauvegarde sur npoint.io
        const postData = JSON.stringify(items);
        const req = https.request({
          hostname: 'api.npoint.io',
          path: '/462d7c07e289bf40707a',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        }, (postRes) => {
          resolve({ statusCode: 200, headers, body: JSON.stringify(items) });
        });
        req.on('error', () => {
          resolve({ statusCode: 200, headers, body: JSON.stringify(items) });
        });
        req.write(postData);
        req.end();
      });
    }).on('error', () => {
      resolve({ statusCode: 200, headers, body: JSON.stringify([]) });
    });
  });
};
