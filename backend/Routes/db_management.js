import mongoose from "mongoose";
import Dream from "../Models/dream.model.js";
import User from "../Models/user.model.js";
import { Router } from "express";
import authorize from "../error_handler/auth.middleware.js";

const dreamRouter = Router();

function normalizeDate(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

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
          postedDate: new Date(),
        },
      ],
      { session }
    );

    const currDate = new Date();
    if (user.lastDreamed === null) {
      const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { $set: { currentStreak: 1, highestStreak: 1, lastDreamed: currDate } },
        { new: true },
        { session }
      );
      return res.status(201).json({
        success: true,
        data: dreams,
        updatedUser: updatedUser,
      });
    }
    const currDateNormalized = normalizeDate(currDate);
    const latestDreamNormalized = normalizeDate(user.lastDreamed);
    const diff =
      (currDateNormalized - latestDreamNormalized) / (1000 * 60 * 60 * 24);

    let updatedUser;
    if (diff === 1) {
      updatedUser = await User.findByIdAndUpdate(
        req.userId,
        {
          $set: {
            currentStreak: user.currentStreak + 1,
            highestStreak: Math.max(user.highestStreak, user.currentStreak),
            lastDreamed: currDate,
          },
        },
        { new: true },
        { session }
      );
    } else if (diff === 0) {
      updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { $set: { lastDreamed: currDate } },
        { new: true },
        { session }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { $set: { currentStreak: 1, lastDreamed: currDate } },
        { new: true },
        { session }
      );
    }
    await session.commitTransaction();
    session.endSession();
    return res.status(201).json({
      success: true,
      data: dreams,
      updatedUser: updatedUser,
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
    const allDreams = await Dream.find({ posted: true }).sort({
      postedDate: 1,
    });
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
      { $set: { posted: !postedOrNot, postedDate: new Date() } },
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
