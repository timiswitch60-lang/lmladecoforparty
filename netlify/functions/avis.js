const https = require('https');

// Utilisation de Netlify Blobs natif avec fallback mémoire ultra-robuste
const { getStore } = require("@netlify/blobs");

let memoryStore = [];

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*"
  };

  let items = [];
  let useMemory = false;

  try {
    const store = getStore("avis-store");
    items = (await store.get("liste", { type: "json" })) || [];
    if (!Array.isArray(items)) items = [];
  } catch (err) {
    useMemory = true;
    items = memoryStore;
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
      if (useMemory) {
        memoryStore = items;
      } else {
        try {
          const store = getStore("avis-store");
          await store.setJSON("liste", items);
        } catch (e) {
          memoryStore = items;
        }
      }
    }
  } else if (body.action === "delete") {
    const id = String(body.id || '');
    const auteur = String(body.auteur || '');
    items = items.filter(a => !(a.id === id && a.auteur === auteur));
    if (useMemory) {
      memoryStore = items;
    } else {
      try {
        const store = getStore("avis-store");
        await store.setJSON("liste", items);
      } catch (e) {
        memoryStore = items;
      }
    }
  }

  return { statusCode: 200, headers, body: JSON.stringify(items) };
};
