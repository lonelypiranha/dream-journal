import User from "../Models/user.model.js";
import jwt from "jsonwebtoken";

export const getUser = async (req, res, next) => {
console.log(req.headers.authorization);
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      throw error;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
