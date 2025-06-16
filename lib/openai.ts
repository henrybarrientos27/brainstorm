// lib/openai.ts

import OpenAI from "openai";

// Highly structured client instance for scalable use across BrAInstorm
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID, // Optional, if using org-scoped keys
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
  defaultHeaders: {
    "X-Client-App": "BrAInstorm-Platform",
    "X-Compliance-Mode": "true",
  },
  defaultQuery: {
    user: process.env.SYSTEM_USER_EMAIL || "compliance@brainstorm.ai",
  },
});

export default openai;
