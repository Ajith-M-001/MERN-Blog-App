import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signIn = (req, res) => {
  console.log("req", req.body);
};

export const signUp = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Required fields can't be empty" });
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


    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

