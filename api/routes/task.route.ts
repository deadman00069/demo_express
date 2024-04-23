import express from "express";
import taskValidationRules from "../rules/task.validation.rules";
import {
  createTask,
  getAllTask,
  getTask,
  updateTask,
} from "../controller/task.controller";
import verifyTokenMiddleware from "../middleware/verifyToken";

const router = express.Router();

/// For creating task
router.post("/", verifyTokenMiddleware, taskValidationRules, createTask);

// For getting all tasks
router.get("/", verifyTokenMiddleware, getAllTask);

// For getting single task
router.get("/:taskId", verifyTokenMiddleware, getTask);

// For updating task
router.patch("/", verifyTokenMiddleware, taskValidationRules, updateTask);

export default router;
