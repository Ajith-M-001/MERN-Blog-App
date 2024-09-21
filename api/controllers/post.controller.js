import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const createPost = async (req, res, next) => {
  const { isAdmin, userId } = req.user;

  console.log(req.user);
  const { title, content } = req.body;
  try {
    if (!isAdmin) {
      return next(errorHandler(403, "you are not allowed to create a post"));
    }

    if ((!title, !content)) {
      return next(errorHandler(400, "required cannot be empty"));
    }
    const slug = title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "-");

    const newPost = new Post({
      ...req.body,
      slug,
      userId,
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};
