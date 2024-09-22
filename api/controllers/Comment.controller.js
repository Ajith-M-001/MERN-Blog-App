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

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler("comment doesnot exist"));
    }
    const userIndex = comment.likes.indexOf(req.user.userId);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.userId);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }

    await comment.save();
    res.status(200).json({ comment });
  } catch (error) {
    next(error);
  }
};
