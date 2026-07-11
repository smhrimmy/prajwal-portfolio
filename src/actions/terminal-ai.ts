import { createServerFn } from "@tanstack/react-start";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

export const askTerminalFn = createServerFn({ method: "POST" })
  .validator(z.string().min(1))
  .handler(async ({ data: query }) => {
    try {
      const model = getModel();
      const prompt = `You are a helpful, extremely concise Linux/DevOps terminal assistant. A user has typed "ask ${query}". Answer their question directly, without markdown formatting like bolding or headers, but you may use code blocks if providing a specific command. Keep the response under 4 sentences.`;
      const result = await model.generateContent(prompt);
      return { success: true, text: result.response.text().trim() };
    } catch (e: any) {
      console.error("askTerminalFn error", e);
      return { success: false, error: e.message };
    }
  });
