import express from "express";
import { google, signIn, signUp } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signin", signIn);
authRouter.post("/signup", signUp);
authRouter.post("/google", google);

export default authRouter;
