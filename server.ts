import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiInstance: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for explanation
  app.post("/api/explain", async (req, res) => {
    try {
      const { problem, language, code } = req.body;

      if (!code || !code.trim()) {
        return res.status(400).json({ error: "Code content is required." });
      }

      const problemText = problem && problem.trim() ? problem : "Unnamed Problem";
      const languageText = language || "Python";

      const prompt = `You are a DSA tutor helping a student understand their own LeetCode solution. 
Problem: ${problemText}. Language: ${languageText}.
Code: 
${code}

Explain this solution clearly. Return ONLY valid JSON with no markdown, no backticks, no explanation.
Format: { 
  "intuition": "", 
  "pattern": { "name": "", "reason": "" }, 
  "complexity": { "time": "", "timeReason": "", "space": "", "spaceReason": "" }, 
  "memoryTrick": "" 
}`;

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              intuition: {
                type: Type.STRING,
                description: "What the solution is actually doing in plain English (2-3 lines)"
              },
              pattern: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["name", "reason"]
              },
              complexity: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  timeReason: { type: Type.STRING },
                  space: { type: Type.STRING },
                  spaceReason: { type: Type.STRING }
                },
                required: ["time", "timeReason", "space", "spaceReason"]
              },
              memoryTrick: {
                type: Type.STRING,
                description: "One memory trick or key insight to retain this pattern"
              }
            },
            required: ["intuition", "pattern", "complexity", "memoryTrick"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response text received from Gemini.");
      }

      const parsed = JSON.parse(responseText.trim());
      return res.json(parsed);

    } catch (error: any) {
      console.error("Gemini completion error:", error);
      return res.status(500).json({ 
        error: error.message || "An unexpected error occurred while analyzing the solution."
      });
    }
  });

  // Vite integration middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
