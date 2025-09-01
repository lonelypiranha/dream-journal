import mongoose from "mongoose";
import Dream from "../Models/dream.model.js";
import { Router } from "express";
import authorize from "../error_handler/auth.middleware.js";

const dreamRouter = Router();

dreamRouter.post("/dbAddDream", authorize, async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      dreamTitle,
      dreamContent,
      dreamGenre,
      dreamAnalysis,
      dreamImage,
      dreamUser,
    } = req.body;
    const dream = await Dream.create(
      [
        {
          title: dreamTitle,
          content: dreamContent,
          genre: dreamGenre,
          analysis: dreamAnalysis,
          image: dreamImage,
          user: req.userId,
        },
      ],
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    res.status(201).json({
      success: true,
      message: "Dream saved successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
});

dreamRouter.get("/dbFetchDream", authorize, async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const allDreams = await Dream.find({ user: req.userId });
    
    session.endSession();
    res.status(201).json({
      success: true,
      dreamList: allDreams,
    });
  } catch (error) {
    await session.abortTransaction;
    session.endSession();
    next(error);
  }
});

export default dreamRouter;
