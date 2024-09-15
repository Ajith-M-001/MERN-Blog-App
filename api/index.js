import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./database/db.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});


app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);


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
