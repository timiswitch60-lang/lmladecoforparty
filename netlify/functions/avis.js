const https = require('https');

// Stockage ultra-robuste avec persistance JSON externe (JSONbin / Netlify Blobs)
const { getStore } = require("@netlify/blobs");

// Fallback partagé universel (JSONBin public open bin ou stockage distant) pour garantir 100% de persistance
async function getRemoteStore() {
  try {
    const store = getStore("avis-store");
    const data = await store.get("liste", { type: "json" });
    if (Array.isArray(data)) return data;
  } catch (e) {}
  return null;
}

async function setRemoteStore(items) {
  try {
    const store = getStore("avis-store");
    await store.setJSON("liste", items);
    return true;
  } catch (e) {
    return false;
  }
}

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*"
  };

  // Récupération synchrone/asynchrone depuis Netlify Blobs avec fallback sur requête externe HTTPS (JSONbin)
  let items = await getRemoteStore();
  if (!items) {
    // Si Netlify Blobs n'est pas activé, on utilise une API JSON publique persistante de secours
    items = await new Promise((resolve) => {
      https.get('https://api.npoint.io/462d7c07e289bf40707a', (res) => {
        let d = '';
        res.on('data', chunk => d += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(d);
            resolve(Array.isArray(parsed) ? parsed : []);
          } catch(e) { resolve([]); }
        });
      }).on('error', () => resolve([]));
    });
  }

  if (event.httpMethod === "GET") {
    return { statusCode: 200, headers, body: JSON.stringify(items) };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: "[]" };
  }

  let body = {};
  try { body = JSON.parse(event.body || "{}"); } catch (e) {}

  if (body.action === "add" && body.avis) {
    const avis = body.avis;
    const item = {
      id: String(avis.id || Date.now()),
      auteur: String(avis.auteur || ''),
      nom: String(avis.nom || '').trim().slice(0, 40),
      occasion: String(avis.occasion || '').trim().slice(0, 60),
      note: Math.max(1, Math.min(5, parseInt(avis.note, 10) || 5)),
      texte: String(avis.texte || '').trim().slice(0, 500)
    };
    if (item.nom && item.texte && item.auteur) {
      items = items.filter(a => a.id !== item.id).concat(item).slice(-100);
      await setRemoteStore(items);
      // Sauvegarde secondaire sur npoint.io pour persistance universelle
      const postData = JSON.stringify(items);
      const req = https.request({
        hostname: 'api.npoint.io',
        path: '/462d7c07e289bf40707a',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) }
      }, () => {});
      req.on('error', () => {});
      req.write(postData);
      req.end();
    }
  } else if (body.action === "delete") {
    const id = String(body.id || '');
    const auteur = String(body.auteur || '');
    items = items.filter(a => !(a.id === id && a.auteur === auteur));
    await setRemoteStore(items);
    const postData = JSON.stringify(items);
    const req = https.request({
      hostname: 'api.npoint.io',
      path: '/462d7c07e289bf40707a',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) }
    }, () => {});
    req.on('error', () => {});
    req.write(postData);
    req.end();
  }

  return { statusCode: 200, headers, body: JSON.stringify(items) };
};
