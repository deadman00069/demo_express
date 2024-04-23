import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ApiError from "../utils/apiError";
import { TaskModel } from "../models/mongo_db_schema/task.schema";
import { ApiResponse } from "../utils/apiResponse";
import { Task } from "../models/task";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user";

// decoding token
const decodeToken = (token: string): string | JwtPayload =>
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

// Creating new task
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, errors.array().at(0).msg, errors.array());
    }

    // Getting token and decoding it
    const token = req.cookies.accessToken;
    const decodeData = decodeToken(token) as User;

    // task obejct
    const taskData = {
      ...req.body,
      createdBy: decodeData._id,
    };

    // creating new task
    const task = new TaskModel(taskData);
    await task.save();

    // sending response
    res
      .status(201)
      .json(new ApiResponse(201, task, "Task creation successful"));
  } catch (error) {
    next(error);
  }
};

// GEtting all task of perticular user
export const getAllTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Getting token and decoding it
    const token = req.cookies.accessToken;
    const decodeData = decodeToken(token) as User;

    // Finding all task of perticualr user
    const tasks = await TaskModel.find({ createdBy: decodeData._id });

    // Not found
    if (!tasks) {
      throw new ApiError(404, "Task not find");
    }

    // success
    res.status(200).json(new ApiResponse(200, tasks, "Task retrival success"));
  } catch (error) {
    next(error);
  }
};

// Getting perticualr task by id
export const getTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // checking if id is provided
    const taskId = req.params.taskId;
    if (!taskId) {
      throw new ApiError(400, "Task id is not provided.");
    }

    // Finding task
    const task = await TaskModel.findById(
      taskId,
      "title description priority dueDate status"
    ).exec();

    // If not found
    if (!task) {
      throw new ApiError(404, "task not found");
    }

    // success
    res.status(200).json(new ApiResponse(200, task, "Task fetch success"));
  } catch (error) {
    next(error);
  }
};

// Udating task
export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, errors.array().at(0).msg, errors.array());
    }

    // Getting token and decoding it
    const token = req.cookies.accessToken;
    const decodeData = decodeToken(token) as User;

    // task object
    const task = { ...req.body, createdBy: decodeData._id } as Task;

    //updating task
    await TaskModel.findByIdAndUpdate(task._id, task).exec();

    //success
    res.status(200).json(new ApiResponse(200, "Update success"));
  } catch (error) {
    next(error);
  }
};
