import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
  res.json({ message: "api working" });
};

export const updateUser = async (req, res, next) => {
  const { userId } = req.user;
  const { Id } = req.params;
  const { password, username, email, profilePic } = req.body;

  console.log(req.params, userId);

  if (Id !== userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }

  let hashedPassword;
  if (password) {
    if (password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }
    hashedPassword = await bcryptjs.hash(password, 12);
  }

  if (username) {
    if (username.length < 5 || username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 5 and 20 characters")
      );
    }
    if (!username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username can only contain letters and numbers")
      );
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      Id,
      {
        $set: {
          username: username,
          email: email,
          password: hashedPassword,
          profilePic: profilePic,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
