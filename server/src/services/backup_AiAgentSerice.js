// Install dependencies first:
// npm install @inngest/agent-kit inngest

const { createAgent, gemini } = require('@inngest/agent-kit');
const { ai } = require('../config');

// Define the system prompt outside the run block
const systemPrompt = `You are LegalGPT, a helpful assistant that explains legal documents and gives next-step guidance in plain language. Always include a short disclaimer that you are not a lawyer and suggest consulting a qualified attorney when necessary. If the user asks for instructions to commit wrongdoing, refuse and provide legal/ethical alternatives. Respond in the user's language when possible.`;


/**
 * askAgent - unified AI call using @inngest/agent-kit
 * Supports OpenAI, Gemini, Anthropic, etc. (through the Inngest SDK)
 */
async function askAgent({ prompt, context = [], lang = 'en' }) {
  console.log('In Ask Agent method');
  try {
    // =================================================================
    // 🛑 DEBUG CHANGE: HARDCODE KEY AND PROVIDER TO ISOLATE CONFIG ISSUE
    // !!! REPLACE THIS PLACEHOLDER WITH YOUR ACTUAL, VALID GEMINI API KEY !!!
    const hardcodedKey = "YOUR_ACTUAL_VALID_GEMINI_API_KEY_STRING_HERE"; 
    
    // Define the key and model for clarity
    const apiKey = hardcodedKey; 
    const modelString = 'gemini-2.5-flash'; 
    // =================================================================


    // 1. Agent Creation: Configured correctly with 'system' prompt and 'gemini' helper.
    const agent = createAgent({
      name: 'LegalGPT',
      system: systemPrompt,
      model: gemini({
        model: modelString,
        apiKey: apiKey, 
      }),
    });
    console.log("====================== create agent line ====================================================");
    console.log(agent);
    console.log("====================== create agent line ====================================================");

    
    // Build the prompt containing only context and user query
    let fullPrompt = '';
    if (context && context.length) {
      fullPrompt += `Context from uploaded document:\n${context.join('\n\n')}`;
      fullPrompt += `\n\n`;
    }
    fullPrompt += `User query:\n${prompt}`;
    
    // 2. FIX: Create an explicit message array payload. 
    // This guarantees the user's input is recognized as a 'user' turn.
    const messagesPayload = [{
      role: 'user',
      // content: fullPrompt
      content: 'what is contract?'
    }];

    // Call the agent using Inngest’s standard API
    console.log("====================== Before run ====================================================");
    const result = await agent.run({
      messages: messagesPayload, // <<< FIX IS HERE: Passing explicit messages >>>
    });
    console.log("====================== After run ====================================================");
    
    // 3. Output Extraction (Kept from previous successful step)
    let reply = result?.output?.text;
    if (!reply && Array.isArray(result.output) && result.output.length > 0) {
        reply = result.output[0].content;
    }

    if (!reply) {
        throw new Error('AI provider returned a response but no readable text content was found.');
    }

    return reply;
    
  } catch (err) {
    // Log the original error
    console.error('AI call failed:', err.response?.data || err.message || err);
    
    // Simplified error handling for final output
    const errorMessage = err.message.includes('Cast to string failed') 
      ? 'Internal Server Error: AI response was malformed for database saving.'
      : 'AI provider error: ' + (err.message || 'Unknown error');
      
    throw new Error(errorMessage);
  }
}

module.exports = { askAgent };
