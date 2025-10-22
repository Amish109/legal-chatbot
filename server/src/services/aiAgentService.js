// Install dependencies first:
// npm install @inngest/agent-kit inngest

const { createAgent } = require('@inngest/agent-kit');
const { ai } = require('../config');

/**
 * askAgent - unified AI call using @inngest/agent-kit
 * Supports OpenAI, Gemini, Anthropic, etc. (through the Inngest SDK)
 */
async function askAgent({ prompt, context = [], lang = 'en' }) {
  try {
    // Determine active AI provider and model from config
    const provider = ai.provider || 'openai';

    const apiKey =
      provider === 'gemini' ? ai.gemini.apiKey : ai.openai.apiKey;
    const model =
      provider === 'gemini' ? ai.gemini.model : ai.openai.model;

    // Initialize the Inngest AI agent
    const agent = createAgent({
      name: 'LegalGPT',
      model,
      provider,
      apiKey,
      // temperature & maxTokens can also be configured globally here
      defaultConfig: {
        temperature: 0.2,
        maxTokens: 800,
      },
    });

    // Build the system + user prompt
    const systemPrompt = `You are LegalGPT, a helpful assistant that explains legal documents and gives next-step guidance in plain language. Always include a short disclaimer that you are not a lawyer and suggest consulting a qualified attorney when necessary. If the user asks for instructions to commit wrongdoing, refuse and provide legal/ethical alternatives. Respond in the user's language when possible.`;

    let fullPrompt = systemPrompt;
    if (context && context.length) {
      fullPrompt += `\n\nContext from uploaded document:\n${context.join('\n\n')}`;
    }
    fullPrompt += `\n\nUser query:\n${prompt}`;

    // Call the agent using Inngest’s standard API
    const result = await agent.run({
      input: fullPrompt,
    });

    // Extract standardized text output
    const reply = result?.output?.text || result?.output || null;
    if (!reply) throw new Error('No reply from AI provider');

    return reply;
  } catch (err) {
    console.error('AI call failed:', err.response?.data || err.message || err);
    throw new Error('AI provider error: ' + (err.message || 'Unknown error'));
  }
}

module.exports = { askAgent };
