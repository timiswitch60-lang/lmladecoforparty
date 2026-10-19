const https = require('https');

// Utilisation de Netlify Blobs natif pour stocker les avis de manière définitive et sécurisée
const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*"
  };

  try {
    const store = getStore("avis-store");
    let items = (await store.get("liste", { type: "json" })) || [];
    if (!Array.isArray(items)) items = [];

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
        // Évite les doublons et ajoute l'avis
        items = items.filter(a => a.id !== item.id).concat(item).slice(-100);
        await store.setJSON("liste", items);
      }
    } else if (body.action === "delete") {
      const id = String(body.id || '');
      const auteur = String(body.auteur || '');
      items = items.filter(a => !(a.id === id && a.auteur === auteur));
      await store.setJSON("liste", items);
    }

    return { statusCode: 200, headers, body: JSON.stringify(items) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'storage' }) };
  }
};
