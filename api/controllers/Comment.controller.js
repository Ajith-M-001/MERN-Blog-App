import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  const { comment, postId, userId } = req.body;

  try {
    if (userId !== req.user.userId) {
      return next(errorHandler(403, "you are not allowed to comment"));
    }

    const newComment = new Comment({
      comment,
      userId,
      postId,
    });

    await newComment.save();
    res.status(200).json({ newComment });
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  console.log("running", req.params.postId);
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ comments });
  } catch (error) {
    next(error);
  }
};
