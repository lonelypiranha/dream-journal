import mongoose from "mongoose";
import Dream from "../Models/dream.model.js";
import User from "../Models/user.model.js";
import { Router } from "express";
import authorize from "../error_handler/auth.middleware.js";

const statsRouter = Router();

function normalizeDate(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

statsRouter.post("/generateStats", authorize, async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const mostCommonGenre = await Dream.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(`${req.userId}`) } },
        { $group: { _id: "$genre", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]);
    const dateNow = normalizeDate(new Date());
    const user = await User.findById(req.userId);
    if (user.lastDreamed === null) {
      return res.status(201).json({
        success: true,
        isDbChanged: false,
        mostCommonGenre: mostCommonGenre
      });
    }

    const lastDreamed = normalizeDate(user.lastDreamed);
    const diff = (dateNow - lastDreamed) / (1000 * 60 * 60 * 24);
    if (diff === 0 || diff === 1) {
      return res.status(201).json({
        success: true,
        isDbChanged: false,
        mostCommonGenre: mostCommonGenre
      });
    } else {
      const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { $set: { currentStreak: 0} },
        { new: true }
      );
      return res.status(201).json({
        success: true,
        isDbChanged: true,
        updatedUser: updatedUser,
        mostCommonGenre: mostCommonGenre
      });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
});

export default statsRouter;
