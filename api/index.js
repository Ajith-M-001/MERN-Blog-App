import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./database/db.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from 'cors'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: " http://localhost:5173", // Replace with your frontend domain
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("error connecting to mongodb ", error);
  }
};

startServer();
