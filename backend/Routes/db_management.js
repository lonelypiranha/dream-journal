import mongoose from "mongoose";
import Dream from "../Models/dream.model.js";
import { Router } from "express";

const dreamRouter = Router();

dreamRouter.post("/dbAddDream", async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { dreamTitle, dreamContent, dreamGenre, dreamAnalysis, dreamImage } = req.body;
    const dream = await Dream.create([{title: dreamTitle, content: dreamContent, genre: dreamGenre, analysis: dreamAnalysis, image: dreamImage}], { session });
    await session.commitTransaction();
    session.endSession();
    res.status(201).json({
        success: true,
        message: 'Dream saved successfully',
    })

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
});

dreamRouter.get("/dbFetchDream", async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const allDreams = await Dream.find({});
      session.endSession();
      res.status(201).json({
          success: true,
          dreamList: allDreams,
      })
  
    } catch (error) {
      await session.abortTransaction;
      session.endSession();
      next(error);
    }
  });

export default dreamRouter;
