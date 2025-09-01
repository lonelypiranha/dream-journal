import { getUser } from "../Controllers/user.controller.js";
import { Router } from 'express';

const userRouter = Router();

userRouter.get('/me', getUser);

export default userRouter;