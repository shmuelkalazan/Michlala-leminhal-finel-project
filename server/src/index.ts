import express from "express";
import userRouter from "./routes/userRouter.js";
import { connectDB } from "./config/db.js";

const app = express();
const PORT = 3000;
connectDB();


app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, TypeScript + Node.js Server!");
});


app.use("/users", userRouter);


app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
