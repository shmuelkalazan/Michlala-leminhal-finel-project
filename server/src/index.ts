import express from "express";
import userRouter from "./routes/userRouter.js";
import lessonRouter from "./routes/lessonsRouter.js"
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
connectDB();


app.use(express.json());

app.use("/users", userRouter);
app.use("/lessons", lessonRouter);


app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
