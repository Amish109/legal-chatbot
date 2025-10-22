const axios = require('axios');
const { openai } = require('../config');

async function chunkText(text, size = 1000) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + size));
    i += size;
  }
  return chunks;
}

async function ingestDocument(document) {
  const chunks = await chunkText(document.text || '', 1200);
  try {
    // Placeholder: in production, push to your ingest/kit or vector DB.
    // Here we just return chunk count.
    return { success: true, count: chunks.length, chunksCount: chunks.length };
  } catch (err) {
    console.error('Ingest error', err.message || err);
    return { success: false, error: err.message };
  }
}

module.exports = { chunkText, ingestDocument };
