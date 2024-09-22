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
