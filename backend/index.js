import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config()
import connectToDatabase from "./database/db_connection.js";

const app = express();
app.use(cors());
app.use(express.json());

console.log(process.env.MONGODB_API_KEY);
console.log(process.env.OPENAI_API_KEY);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/ai", async (req, res) => {
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

app.listen(3001, async () => {
  console.log("Server running on port 3001");
  await connectToDatabase();
});
