import { createServerFn } from "@tanstack/react-start";


export const generateArticleFn = createServerFn({ method: "POST" }).validator((topic: string) => topic).handler(async ({ data: topic }) => {
  const prompt = `
    You are an expert SEO content writer and AI Search (AEO) specialist.
    Write a comprehensive, highly-structured blog post about: "${topic}".
    
    REQUIREMENTS:
    1. Write in Markdown format.
    2. Include a compelling title (H1).
    3. Use semantic hierarchy (H2, H3).
    4. Include an executive summary / TL;DR right after the title.
    5. Include a FAQ section at the end.
    6. Provide metadata at the very end in a JSON block inside \`\`\`json format.
    
    The JSON block must match this exact TypeScript interface:
    {
      "seo_title": "String max 60 chars",
      "meta_description": "String max 160 chars",
      "slug": "url-friendly-slug",
      "excerpt": "Short summary",
      "category": "One of: Frontend, DevOps, AI, Design, Career",
      "read_time": "e.g., '6 min'",
      "json_ld": { /* Complete Article Schema.org JSON-LD object */ }
    }
  `;

  // Simulating a delay
  await new Promise(r => setTimeout(r, 2000));
  
  return { 
    success: true, 
    content: `# ${topic}\n\n**TL;DR:** This is a simulated response because OpenAI is bypassed.\n\n## Overview\nThis article would contain highly structured content about ${topic}.`,
    meta: {
      seo_title: topic,
      meta_description: "Simulated meta description.",
      slug: topic.toLowerCase().replace(/\s+/g, '-'),
      excerpt: "Simulated excerpt.",
      category: "AI",
      read_time: "5 min",
      json_ld: {}
    },
    image_url: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=800&auto=format&fit=crop"
  };
});
