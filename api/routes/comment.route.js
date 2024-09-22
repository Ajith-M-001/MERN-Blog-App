import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  createComment,
  getPostComments,
  likeComment,
  editComment,
} from "../controllers/Comment.controller.js";

const commentRouter = express.Router();

commentRouter.post("/createComment", verifyToken, createComment);
commentRouter.get("/getPostComments/:postId", getPostComments);
commentRouter.put("/likeComment/:commentId", verifyToken,likeComment);
commentRouter.put("/editComment/:commentId", verifyToken,editComment);

export default commentRouter;
