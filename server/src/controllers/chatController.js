// controllers/chatController.js
const Chat = require('../models/Chat');
const Document = require('../models/Document');
const { detectLang } = require('../utils/langDetect');
const { askAgent } = require('../services/aiAgentService'); // ← your new unified AI service

/**
 * POST /api/chat/message
 * Sends user message to AI (Gemini/OpenAI), stores conversation in DB.
 */
async function postMessage(req, res, next) {
  try {
    const { message, documentId } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required.' });
    }

    const lang = detectLang(message);

    // 📄 Load document context if applicable
    const context = [];
    if (documentId) {
      const doc = await Document.findById(documentId);
      if (doc) {
        context.push(`Document: ${doc.originalName}`);
        context.push(doc.text?.slice(0, 4000) || '');
      }
    }

    // 🚫 Refuse unsafe or illegal prompts
    const lowered = message.toLowerCase();
    const illegalPatterns = ['how to make a bomb', 'how to forge', 'how to hack', 'evade', 'kill', 'murder'];
    if (illegalPatterns.some(p => lowered.includes(p))) {
      const refusal =
        "❌ I can’t assist with illegal, violent, or unethical actions. Please ask something else — for real legal help, consult a qualified lawyer.";
      const chat = new Chat({
        user: req.user._id,
        messages: [
          { sender: 'user', text: message, lang },
          { sender: 'bot', text: refusal, lang },
        ],
      });
      await chat.save();
      return res.json({ reply: refusal, chatId: chat._id });
    }

    // 💬 Call AI provider (Gemini or OpenAI)
    const aiReply = await askAgent({ prompt: message, context, lang });

    // 💾 Save conversation
    let chat = await Chat.findOne({ user: req.user._id });
    if (!chat) chat = new Chat({ user: req.user._id, messages: [] });

    chat.messages.push({ sender: 'user', text: message, lang });
    chat.messages.push({ sender: 'bot', text: aiReply, lang });
    if (documentId) chat.documentRef = documentId;
    await chat.save();

    res.json({ reply: aiReply, chatId: chat._id });
  } catch (err) {
    console.error('❗ Chat error:', err.message || err);
    next(err);
  }
}

/**
 * GET /api/chat/history
 * Returns user’s previous chat history (with optional document context).
 */
async function getHistory(req, res, next) {
  try {
    const chat = await Chat.findOne({ user: req.user._id }).populate('documentRef');
    if (!chat) return res.json({ messages: [] });
    res.json({ messages: chat.messages, document: chat.documentRef });
  } catch (err) {
    console.error('❗ History fetch error:', err.message || err);
    next(err);
  }
}

module.exports = { postMessage, getHistory };
