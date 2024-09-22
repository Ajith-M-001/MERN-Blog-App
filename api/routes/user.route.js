import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  signOut,
  getUsersForAll,
  getUsers,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const userRouter = express.Router();

userRouter.get("/test", test);
userRouter.put("/update/:Id", verifyToken, updateUser);
userRouter.delete("/delete/:Id", verifyToken, deleteUser);
userRouter.post("/signout", signOut);
userRouter.get("/getusers", verifyToken, getUsers);
userRouter.get("/:userId", getUsersForAll);


export default userRouter;
