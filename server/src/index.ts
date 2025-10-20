import express from "express";
import userRouter from "./routes/userRouter.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
connectDB();


app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Hello, TypeScript + Node.js Server!");
// });


app.use("/users", userRouter);


app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
