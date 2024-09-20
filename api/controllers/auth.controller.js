//api\controllers\auth.controller.js
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    next(errorHandler(400, "Required fields can't be empty"));
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Hash the password asynchronously
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Create the new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(errorHandler(400, "Required fields can't be empty"));
  }

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(400, "email or password incorrect"));
    }

    const verifyPassword = await bcryptjs.compare(password, validUser.password);
    if (!verifyPassword) {
      return next(errorHandler(400, "email or password incorrect"));
    }

    const token = jwt.sign(
      {
        userId: validUser._id,
      },
      process.env.JWTSECRET
    );

    const { password: pass, ...rest } = validUser._doc;
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json({ success: true, user: rest });
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { name, email, googlePhotoUrl } = req.body;
  console.log("google", req.body);
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ userId: user._id }, process.env.JWTSECRET);
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .json(rest);
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = await bcryptjs.hash(generatePassword, 12);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePic: googlePhotoUrl,
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWTSECRET);
      const { password, ...rest } = newUser._doc;
      res
        .status(201)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
