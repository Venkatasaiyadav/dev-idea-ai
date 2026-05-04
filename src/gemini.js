import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!import.meta.env.VITE_GEMINI_API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY is missing in environment variables");
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateIdeas(techStack) {
  if (!API_KEY) {
    throw new Error("Missing VITE_GEMINI_API_KEY in environment variables.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Act as an expert startup mentor and senior software architect.

The user will provide their tech stack.

Your job is to generate 3 unique, high-quality, and practical software project ideas that are suitable for building as portfolio projects or startups.

For EACH idea, strictly follow this format:

1. Project Name:
(A catchy and professional name)

2. Problem Statement:
(What real-world problem does this solve? Keep it clear and relevant.)

3. Solution Overview:
(Explain how the product solves the problem)

4. Key Features:
- Feature 1
- Feature 2
- Feature 3
- Feature 4

5. Target Users:
(Who will use this product?)

6. Monetization Strategy:
(How can this product make money? Be realistic.)

7. Difficulty Level:
(Easy / Medium / Hard)

8. Suggested Tech Enhancements:
(How AI, automation, or scaling can improve it)

Important rules:
- Avoid generic ideas like "todo app" or "chat app"
- Make ideas modern, practical, and impressive
- Ensure ideas match the user's tech stack
- Keep the response clean, structured, and readable
- Do NOT add unnecessary explanations outside the format

Return the response as a valid JSON array of objects. Each object must have these exact keys:
"projectName", "problemStatement", "solutionOverview", "keyFeatures" (an array of strings), "targetUsers", "monetizationStrategy", "difficultyLevel", "suggestedTechEnhancements".

User Tech Stack:
${techStack}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Extract JSON block in case the model wraps it in markdown code blocks
    let jsonString = responseText;
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      jsonString = jsonMatch[1];
    } else {
      const genericMatch = responseText.match(/```\n([\s\S]*?)\n```/);
      if (genericMatch) {
        jsonString = genericMatch[1];
      }
    }

    const data = JSON.parse(jsonString);
    return data;
  } catch (error) {
    console.error("Error generating ideas:", error);
    throw error;
  }
}
