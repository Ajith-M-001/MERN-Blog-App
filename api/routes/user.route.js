import express from "express";
import { test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const userRouter = express.Router();

userRouter.get("/test", test);
userRouter.put("/update/:Id", verifyToken, updateUser);

export default userRouter;
