import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config()
import connectToDatabase from "./Database/db_connection.js";
import dreamRouter from "./Routes/db_management.js";
import errorMiddleware from "./error_handler/error.middleware.js";
import cookieParser from 'cookie-parser';
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/api/v1/dbOperations', dreamRouter);
app.use(errorMiddleware);

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

process.on('SIGINT', async () => {
    await mongoose.disconnect();
    console.log('Mongoose connection closed on app termination');
    process.exit(0);
  });