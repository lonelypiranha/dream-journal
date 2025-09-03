import mongoose from "mongoose";
import Dream from "../Models/dream.model.js";
import User from "../Models/user.model.js";
import { Router } from "express";
import authorize from "../error_handler/auth.middleware.js";

const dreamRouter = Router();

dreamRouter.post("/dbAddDream", authorize, async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { dreamTitle, dreamContent, dreamGenre, dreamAnalysis, dreamImage } =
      req.body;
    const user = await User.findById(req.userId);
    const dreams = await Dream.create(
      [
        {
          title: dreamTitle,
          content: dreamContent,
          genre: dreamGenre,
          analysis: dreamAnalysis,
          image: dreamImage,
          user: req.userId,
          username: user.name,
          posted: false,
        },
      ],
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    console.log(dreams);
    res.status(201).json({
      success: true,
      data: dreams,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
});

dreamRouter.get("/dbFetchDream", authorize, async (req, res, next) => {
  try {
    const allDreams = await Dream.find({ user: req.userId });
    res.status(201).json({
      success: true,
      dreamList: allDreams,
    });
  } catch (error) {
    next(error);
  }
});

dreamRouter.get("/dbFetchPost", authorize, async (req, res, next) => {
    try {
      const allDreams = await Dream.find({ posted: true });
      res.status(201).json({
        success: true,
        dreamList: allDreams,
      });
    } catch (error) {
      next(error);
    }
  });

dreamRouter.post("/dbChangePostStatus", authorize, async (req, res, next) => {
  try {
    const { dreamID, postedOrNot } = req.body;

    const dream = await Dream.findOneAndUpdate(
      { _id: dreamID },
      { $set: { posted: !postedOrNot } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      dreamObj: dream,
    });
  } catch (error) {
    next(error);
  }
});

dreamRouter.post("/dbDeleteDream", authorize, async (req, res, next) => {
  try {
    const { dreamID } = req.body;

    await Dream.deleteOne({ _id: dreamID });

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
});

export default dreamRouter;
