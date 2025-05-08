import { Router } from "express";
import OpenAI from "openai";

const aiRouter = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

dreamRouter.post("/aiAnalysis", async (req, res, next) => {
    try {
        const { input } = req.body;
        const response = await openai.responses.create({
          model: "gpt-4o-mini-2024-07-18",
          input: [
            {
              role: "user",
              content:
                "You are a assistant helping to analyze the user's dreams. User will give you the dream desciprtion, you will help them analyze the dream. Lastly, identify whether the genre of the dream is Drama, Adventure, Horror, Fantasy, Science Fiction, Comedy, Realistic, or Abstract. Make sure to follow the capitalizations/spelling of the genre names exactly: " +
                input,
            },
          ],
          text: {
            format: {
              type: "json_schema",
              name: "dream_analysis",
              schema: {
                type: "object",
                properties: {
                  analysis: { type: "string" },
                  genre: { type: "string" },
                },
                required: ["analysis", "genre"],
                additionalProperties: false,
              },
              strict: true,
            },
          },
        });
        const parsed = JSON.parse(response.output_text);
        res.json({ result1: parsed.analysis, result2: parsed.genre });
      } catch (error) {
        res.status(500).send(error.message);
      }
});

export default aiRouter;
