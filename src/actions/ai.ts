import { createServerFn } from "@tanstack/react-start";
import { GoogleGenerativeAI } from "@google/generative-ai";

const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

export const generateArticleIdeaFn = createServerFn({ method: "POST" })
  .validator((topic: string) => topic)
  .handler(async ({ data: topic }) => {
    try {
      const model = getModel();
      const prompt = `You are an expert technical blog writer and SEO specialist. Generate 3 compelling article ideas and titles based on this topic/keyword: "${topic}". Format as a JSON array of objects with 'title' and 'description' keys. DO NOT include markdown ticks outside the JSON. Return only the JSON array.`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
      return { success: true, ideas: JSON.parse(jsonStr) };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e.message };
    }
  });

export const generateOutlineFn = createServerFn({ method: "POST" })
  .validator((title: string) => title)
  .handler(async ({ data: title }) => {
    try {
      const model = getModel();
      const prompt = `Generate a detailed, structured outline for a technical blog post titled: "${title}". Include an Introduction, 3-5 main body sections, and a Conclusion. Return as a Markdown list.`;
      const result = await model.generateContent(prompt);
      return { success: true, outline: result.response.text() };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

export const writeArticleSectionFn = createServerFn({ method: "POST" })
  .validator((params: { title: string, section: string, context: string }) => params)
  .handler(async ({ data: { title, section, context } }) => {
    try {
      const model = getModel();
      const prompt = `Write a comprehensive section for a blog post titled "${title}". The section to write is about: "${section}".\nHere is the existing context of the article so far: ${context}\n\nWrite in a professional, engaging technical tone using Markdown. 
Crucially, automatically format the text to look beautiful for a blog: 
1. Auto-bold key terms and important concepts. 
2. Ensure perfect capitalization. 
3. Use HTML tags like <p style="text-align: center;"> or <p style="text-align: justify;"> for alignment where it enhances presentation. 
4. Use <u> tags to underline highly emphasized words.
Include code examples if relevant. Return HTML/Markdown that TipTap can parse.`;
      const result = await model.generateContent(prompt);
      return { success: true, content: result.response.text() };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

export const improveGrammarFn = createServerFn({ method: "POST" })
  .validator((text: string) => text)
  .handler(async ({ data: text }) => {
    try {
      const model = getModel();
      const prompt = `Improve the grammar, clarity, and readability of the following text while maintaining its original meaning. 
Crucially, automatically format the text to look beautiful for a blog: 
1. Auto-bold key terms and important concepts. 
2. Ensure perfect capitalization. 
3. Use HTML tags like <p style="text-align: center;"> or <p style="text-align: justify;"> for alignment where it enhances presentation. 
4. Use <u> tags to underline highly emphasized words.
Return the formatted text in HTML/Markdown that TipTap can parse.\n\n${text}`;
      const result = await model.generateContent(prompt);
      return { success: true, content: result.response.text() };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

export const generateSeoMetadataFn = createServerFn({ method: "POST" })
  .validator((content: string) => content)
  .handler(async ({ data: content }) => {
    try {
      const model = getModel();
      const prompt = `Based on the following article content, generate optimized SEO metadata. Return ONLY a valid JSON object (no markdown ticks) with the keys: 'meta_title' (max 60 chars), 'meta_description' (max 160 chars), 'focus_keyword', and 'suggested_slug'.\n\nContent:\n${content.substring(0, 3000)}`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
      return { success: true, metadata: JSON.parse(jsonStr) };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });
