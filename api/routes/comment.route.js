import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  createComment,
  getPostComments,
  likeComment,
  editComment,
  deleteComment,
  getComments,
} from "../controllers/Comment.controller.js";

const commentRouter = express.Router();

commentRouter.post("/createComment", verifyToken, createComment);
commentRouter.get("/getPostComments/:postId", getPostComments);
commentRouter.put("/likeComment/:commentId", verifyToken, likeComment);
commentRouter.put("/editComment/:commentId", verifyToken, editComment);
commentRouter.delete("/delete/:commentId/:userId", verifyToken, deleteComment);
commentRouter.get("/getcomments", verifyToken, getComments);

export default commentRouter;
