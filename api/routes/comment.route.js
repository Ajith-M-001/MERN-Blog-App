import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  createComment,
  getPostComments,
} from "../controllers/Comment.controller.js";

const commentRouter = express.Router();

commentRouter.post("/createComment", verifyToken, createComment);
commentRouter.get("/getPostComments/:postId", getPostComments);

export default commentRouter;
