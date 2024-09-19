import express from "express";
import {
  test,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const userRouter = express.Router();

userRouter.get("/test", test);
userRouter.put("/update/:Id", verifyToken, updateUser);
userRouter.delete("/delete/:Id", verifyToken, deleteUser);

export default userRouter;
