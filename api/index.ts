import express from "express";
import connectDB from "./database/connect_db.ts";
import AuthRouter from "./routes/auth.route.ts";
import TaskRouter from "./routes/task.route.ts";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middleware/errorMiddleware.ts";
import { refreshToken } from "./controller/auth.controller.ts";

const app = express();
const port = 3007;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", AuthRouter);
// app.use("/api/v1/task", TaskRouter);

app.use(ErrorMiddleware);
app.listen(port, () => {
  connectDB();
  console.log(`Example app listening on port ${port}`);
});
