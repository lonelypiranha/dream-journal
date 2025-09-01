import { Router } from 'express';
import { signUp } from '../Controllers/auth.controller.js';
import { signIn } from '../Controllers/auth.controller.js';
import { signOut } from '../Controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIn);
authRouter.post('/sign-out', signOut);

export default authRouter;