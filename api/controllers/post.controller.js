import Post from "../models/post.model.js";
import User from "../models/user.model.js";
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

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex || 0);
    const limit = parseInt(req.query.limit || 9);
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalPosts = await Post.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

//chatGPT given code improve code
// export const getPosts = async (req, res, next) => {
//   try {
//     const startIndex = Number.isNaN(parseInt(req.query.startIndex))
//       ? 0
//       : parseInt(req.query.startIndex);
//     const limit = Number.isNaN(parseInt(req.query.limit))
//       ? 9
//       : parseInt(req.query.limit);
//     const sortDirection = req.query.order === "asc" ? 1 : -1;

//     const query = {
//       ...(req.query.userId && { userId: req.query.userId }),
//       ...(req.query.category && { category: req.query.category }),
//       ...(req.query.slug && { slug: req.query.slug }),
//       ...(req.query.postId && { _id: req.query.postId }),
//       ...(req.query.searchTerm && {
//         $or: [
//           { title: { $regex: req.query.searchTerm, $options: "i" } },
//           { content: { $regex: req.query.searchTerm, $options: "i" } },
//         ],
//       }),
//     };

//     const posts = await Post.find(query)
//       .sort({ updatedAt: sortDirection })
//       .skip(startIndex)
//       .limit(limit);

//     const totalPosts = await Post.countDocuments(query);

//     const now = new Date();
//     const oneMonthAgo = new Date(
//       now.getFullYear(),
//       now.getMonth() - 1,
//       now.getDate()
//     );

//     const lastMonthPosts = await Post.countDocuments({
//       createdAt: { $gte: oneMonthAgo },
//     });

//     res.status(200).json({
//       posts,
//       totalPosts,
//       lastMonthPosts,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const deletePost = async (req, res, next) => {
  const { isAdmin, userId } = req.user;
  if (!isAdmin || userId !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this post"));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json({ message: "post is deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  const { isAdmin, userId } = req.user;
  const { content, title, image, category } = req.body;
  if (!isAdmin || userId !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this post"));
  }
  try {
    const updatePost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        title,
        content,
        category,
        image,
      },
      { new: true }
    );

    res.status(200).json(updatePost);
  } catch (error) {
    next(error);
  }
};


