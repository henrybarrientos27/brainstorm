// lib/openai.ts

import OpenAI from "openai";

// Server-only client. The placeholder permits static builds without a secret;
// live API routes still require OPENAI_API_KEY and will fail closed without it.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "missing-api-key",
  organization: process.env.OPENAI_ORG_ID,
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
});

export default openai;
