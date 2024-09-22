import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { createComment } from "../controllers/Comment.controller.js";

const commentRouter = express.Router();

commentRouter.post("/createComment", verifyToken, createComment);

export default commentRouter;
