// Install dependencies first:
// npm install @google/generative-ai

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ai } = require('../config');

// Define the system prompt
const systemPrompt = `You are LegalGPT, a helpful assistant that explains legal documents and gives next-step guidance in plain language. Always include a short disclaimer that you are not a lawyer and suggest consulting a qualified attorney when necessary. If the user asks for instructions to commit wrongdoing, refuse and provide legal/ethical alternatives. Respond in the user's language when possible.`;

/**
 * askAgent - AI call using Google's Generative AI SDK directly
 * Supports Gemini models through the official Google SDK
 */
async function askAgent({ prompt, context = [], lang = 'en' }) {
  console.log('In Ask Agent method');
  try {
    // Get API key from config or use hardcoded value for testing
    const apiKey = ai?.gemini?.apiKey || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in your environment or config.');
    }

    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Get the model (you can use 'gemini-pro', 'gemini-1.5-flash', 'gemini-1.5-pro', etc.)
    const model = genAI.getGenerativeModel({ 
      // model: 'gemini-1.5-flash',
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt,
      // generationConfig: {
      //   maxOutputTokens: 8192, 
      //   temperature: 0.7,       
      //   topP: 0.95,            
      //   topK: 40,             
      // },
    });

    console.log('====================== Model initialized ====================================================');
    
    // Build the full prompt with context
    let fullPrompt = '';
    if (context && context.length) {
      fullPrompt += `Context from uploaded document:\n${context.join('\n\n')}`;
      fullPrompt += `\n\n`;
    }
    fullPrompt += `User query:\n${prompt}`;
    
    console.log('====================== Sending request to Gemini ====================================================');
    
    // Generate content
    const result = await model.generateContent(fullPrompt);
    
    console.log('====================== Received response from Gemini ====================================================');
    
    // Extract the response text
    const response = result.response;
    const reply = response.text();
    
    if (!reply) {
      throw new Error('AI provider returned a response but no readable text content was found.');
    }

    return reply;
    
  } catch (err) {
    // Log the original error
    console.error('AI call failed:', err.message || err);
    
    // Handle specific error types
    let errorMessage = 'AI provider error: ';
    
    if (err.message?.includes('API key')) {
      errorMessage += 'Invalid or missing API key. Please check your Gemini API key configuration.';
    } else if (err.message?.includes('quota')) {
      errorMessage += 'API quota exceeded. Please check your Gemini API usage limits.';
    } else if (err.message?.includes('safety')) {
      errorMessage += 'Content was blocked by safety filters. Please rephrase your query.';
    } else {
      errorMessage += err.message || 'Unknown error occurred.';
    }
      
    throw new Error(errorMessage);
  }
}

module.exports = { askAgent };