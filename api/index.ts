import express from "express";
import { NextFunction, Request, Response } from "express";

const port = 3002;
const app = express();

app.use(express.json());

app.use("/f1", (req: Request, res: Response) => {
  res.status(200).json({
    data: "data from f1",
  });
});

app.use("/f2", (req: Request, res: Response) => {
  res.status(200).json({
    data: "data from f2",
  });
});

app.use("/f3", (req: Request, res: Response) => {
  res.status(200).json({
    data: "data from f3",
  });
});

app.use("/f4", (req: Request, res: Response) => {
  res.status(200).json({
    data: "data from f4",
  });
});

app.listen(port, () => {
  console.log("listending to this");
});
