const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function extractTextFromFile(filePath, mimeType) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.pdf') {
    const data = fs.readFileSync(filePath);
    const result = await pdfParse(data);
    return result.text;
  }
  if (ext === '.docx' || ext === '.doc') {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (e) {
      return fs.readFileSync(filePath, 'utf8');
    }
  }
  return fs.readFileSync(filePath, 'utf8');
}

module.exports = { extractTextFromFile };
