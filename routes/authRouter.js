import { Router } from "express";
import * as authController from '../controllers/authController.js'

export const authRouter = Router();

authRouter.get('/login', authController.loginGet)
authRouter.post('/login', authController.loginPost)

authRouter.get('/signup', authController.signupGet)
authRouter.post("/signup", authController.signupPost)

authRouter.get('/logout', authController.logoutGet)