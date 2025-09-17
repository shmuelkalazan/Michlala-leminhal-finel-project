import express from "express";
import userRouter from "./routes/userRouter.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, TypeScript + Node.js Server!");
});


app.use("/user999", userRouter);


app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
