import express from "express";
import { NextFunction, Request, Response } from "express";

const port = 3009;
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

app.use("/f5", (req: Request, res: Response) => {
  res.status(200).json({
    data: "data from f5",
  });
});

app.use("/f6", (req: Request, res: Response) => {
  res.status(200).json({
    data: "data from f6",
  });
});

app.use("/f7", (req: Request, res: Response) => {
  res.status(200).json({
    data: "data from f7",
  });
});

app.use("/f8", (req: Request, res: Response) => {
  res.status(200).json({
    data: "data from f8",
  });
});

app.use("/f9", (req: Request, res: Response) => {
  res.status(200).json({
    data: "data from f9",
  });
});

app.use("/f10", (req: Request, res: Response) => {
  res.status(200).json({
    data: "data from f10",
  });
});

app.use("/f11", (req: Request, res: Response) => {
  res.status(200).json({
    data: "data from f11",
  });
});

app.use("/f12", (req: Request, res: Response) => {
  res.status(200).json({
    data: "data from f12",
  });
});

app.use("/f13", (req: Request, res: Response) => {
  res.status(200).json({
    data: "data from f13",
  });
});

app.use("/f14", (req: Request, res: Response) => {
  res.status(200).json({
    data: "data from f14",
  });
});

app.listen(port, () => {
  console.log("listending to this");
});
