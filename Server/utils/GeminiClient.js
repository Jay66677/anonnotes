// server/utils/GeminiClient.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

let genAI = null;
if (!apiKey) {
  console.warn("Warning: GEMINI_API_KEY not found. AI features disabled.");
} else {
  genAI = new GoogleGenerativeAI(apiKey);
}

class GeminiClient {
  constructor() {
    this.modelName = "gemini-2.5-flash"; // Updated model name
  }

  async rewriteText(style, text) {
    if (!genAI) return text;

    const model = genAI.getGenerativeModel({ model: this.modelName });

    const prompt = `
Rewrite this message in a "${style}" style.
Keep it safe and meaningful.
Do NOT add emojis.
---
${text}
    `;

    try {
      const result = await model.generateContent(prompt);
      return result.response.text().trim() || text;
    } catch (err) {
      console.error("Gemini rewrite error:", err.message);
      return text;
    }
  }

  async detectMood(text) {
    if (!genAI) return "unknown";

    const model = genAI.getGenerativeModel({ model: this.modelName });

    const prompt = `
Classify the mood of this text into ONE word like:
happy, sad, angry, anxious, neutral, hopeful, frustrated, or confused.
Do NOT use emojis.
Text:
${text}
    `;

    try {
      const result = await model.generateContent(prompt);
      return result.response.text().trim().toLowerCase() || "unknown";
    } catch (err) {
      console.error("Gemini mood error:", err.message);
      return "unknown";
    }
  }
}

export default new GeminiClient();
