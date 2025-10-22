const franc = require('franc');

function detectLang(text) {
  try {
    const code = franc(text || '');
    if (!code || code === 'und') return 'en';
    return code;
  } catch (e) {
    return 'en';
  }
}

module.exports = { detectLang };
