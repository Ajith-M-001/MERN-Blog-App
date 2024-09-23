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

export const editComment = async (req, res, user) => {
  const { comment } = req.body;
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(403, "comment not found"));
    }
    if (!req.user.isAdmin && comment.userId !== req.user.userId) {
      return next(errorHandler(403, "you are not allowed to edit the comment"));
    }
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        comment: req.body.comment,
      },
      {
        new: true,
      }
    );
    res.status(200).json({ editedComment });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  const { isAdmin, userId } = req.user;
  if (!isAdmin || userId !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this post"));
  }
  try {
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json({ message: "comment is deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(
      errorHandler(403, "You are not allwoed to get all the comments")
    );
  }

  try {
    const startIndex = parseInt(req.query.startIndex || 0);
    const limit = parseInt(req.query.limit || 9);
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      comments,
      totalComments,
      lastMonthComments,
    });
  } catch (error) {
    next(error);
  }
};
