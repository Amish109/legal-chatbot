const Document = require('../models/Document');
const storageService = require('../services/storageService');
const ingestService = require('../services/ingestService');

async function uploadDocument(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const text = await storageService.extractTextFromFile(req.file.path, req.file.mimetype);
    const doc = new Document({
      user: req.user._id,
      originalName: req.file.originalname,
      filename: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      text,
      chunks: [],
      metadata: { uploadedAt: new Date() }
    });
    await doc.save();
    const ingestRes = await ingestService.ingestDocument(doc);
    doc.ingested = ingestRes.success;
    await doc.save();
    res.json({ success: true, document: doc, ingest: ingestRes });
  } catch (err) { next(err); }
}

async function listDocuments(req, res, next) {
  try {
    const docs = await Document.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ documents: docs });
  } catch (err) { next(err); }
}

module.exports = { uploadDocument, listDocuments };
