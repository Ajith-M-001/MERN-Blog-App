import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  signOut,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const userRouter = express.Router();

userRouter.get("/test", test);
userRouter.put("/update/:Id", verifyToken, updateUser);
userRouter.delete("/delete/:Id", verifyToken, deleteUser);
userRouter.post("/signout", signOut);

export default userRouter;
