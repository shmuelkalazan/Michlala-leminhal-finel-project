import express from "express";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import lessonRouter from "./routes/lessonsRouter.js";
import branchRouter from "./routes/branchRouter.js";
import adminRouter from "./routes/adminRouter.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// CORS configuration for client access
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// API routes
app.use("/users", userRouter);
app.use("/lessons", lessonRouter);
app.use("/branches", branchRouter);
app.use("/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
