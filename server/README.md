# LegalGPT — Express Backend (OpenAI)

This is a complete Express.js backend for a Legal Assistant chatbot (LegalGPT). It includes:
- JWT auth (MongoDB + Mongoose)
- File upload (PDF/DOCX/TXT) and text extraction
- Ingestion pipeline (chunking placeholder)
- Chat endpoint backed by OpenAI Chat Completion API
- Simple safety checks and multilingual detection

## Quick start
1. Copy `.env.example` to `.env` and fill `MONGODB_URI` and `OPENAI_API_KEY`.
2. Install dependencies: `npm install`
3. Start: `npm run dev` (nodemon) or `npm start`
4. Endpoints:
   - `POST /api/auth/signup` { name, email, password }
   - `POST /api/auth/login` { email, password }
   - `POST /api/documents/upload` (multipart `file`) — Authorization: Bearer <token>
   - `GET  /api/documents` — Authorization: Bearer <token>
   - `POST /api/chat` { message, documentId? } — Authorization: Bearer <token>
   - `GET  /api/chat/history` — Authorization: Bearer <token>

## Notes
- This implementation uses the OpenAI REST API (chat completions). You need an API key and billing enabled.
- To switch to Gemini, replace `src/services/aiAgentService.js` with Gemini-specific calls.
- For production: use S3, add HTTPS, stronger rate limits, and a vector DB for retrieval (Pinecone, Milvus, Weaviate).
