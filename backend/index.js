import express from "express";
import cors from "cors";
// import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config()
import connectToDatabase from "./Database/db_connection.js";
import dreamRouter from "./Routes/db_management.js";
import aiRouter from "./Routes/openai_response.js";
import authRouter from "./Routes/auth.routes.js";
import userRouter from "./Routes/user.routes.js";
import errorMiddleware from "./error_handler/error.middleware.js";
import statsRouter from "./Routes/statistics.routes.js";
import cookieParser from 'cookie-parser';
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/dbOperations', dreamRouter);
app.use('/api/v1/aiResponse', aiRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/stats', statsRouter);
app.use(errorMiddleware);


app.listen(3001, async () => {
  console.log("Server running on port 3001");
  await connectToDatabase();
});

process.on('SIGINT', async () => {
    await mongoose.disconnect();
    console.log('Mongoose connection closed on app termination');
    process.exit(0);
  });