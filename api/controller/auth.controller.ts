import { validationResult } from "express-validator";
import { UserModel } from "../models/mongo_db_schema/user.schema.ts";
import { CustomResponse } from "../models/response.ts";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.ts";
import ApiError from "../utils/apiError.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import { cookieOptions } from "../utils/cookieOptions.ts";
import jwt from "jsonwebtoken";
import exp from "constants";

// Function to handle user login
export const login = async (
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

    // Check if email exists in the database
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      throw new ApiError(404, "User not found!");
    }

    // Matching password with hashed password
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      throw new ApiError(401, "Wrong credentials!");
    }

    // Generating access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    // Removing password from user object
    delete user.password;

    // Sending tokens as cookies and user data in response
    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(new ApiResponse(200, user, "Login successful"));
  } catch (error: any) {
    next(error);
  }
};

// Function to handle user signup
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const response: CustomResponse<null> = {
        status: false,
        message: errors.array().map((i) => i["msg"]),
        data: null,
        error: errors.array(),
      };
      return res.status(400).json(response);
    }

    // Checking if user already exists
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
      throw new ApiError(400, "User already exists!");
    }

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = bcrypt.hashSync(req.body.password, salt);

    // Creating new user
    const newUser = new UserModel({ ...req.body, password: hashPassword });
    const savedUser = await newUser.save();

    // Sending response
    res.status(201).json(new ApiResponse(201, savedUser, "Signup successful"));
  } catch (error: any) {
    next(error);
  }
};

// Function to generate access and refresh tokens
const generateAccessAndRefreshToken = async (userID: string) => {
  try {
    // Finding user by ID
    const user = await UserModel.findById(userID);

    // Generating tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Updating refresh token in database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (e: any) {
    throw new ApiError(
      500,
      e?.message ??
        "Something went wrong while generating refresh and access tokens"
    );
  }
};

// Function to refresh access token
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extracting refresh token from cookies
    const token = req.cookies.refreshToken;

    // If token is not provided
    if (!token) {
      throw new ApiError(401, "Refresh token not provided ");
    }

    // Decoding the refresh token
    const decodedToken = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET || "defaultSecret"
    ) as { id: string };

    // If token is invalid
    if (!decodedToken) {
      throw new ApiError(401, "Invalid token");
    }

    // Finding user by ID
    const user: User | null = await UserModel.findById(decodedToken.id);

    if (!user) {
      throw new ApiError(401, "Invalid token");
    }

    // Verifying refresh token from database
    if (token !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or invalid");
    }

    // Generating new access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    // Sending new tokens as cookies
    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken: accessToken, refreshToken: refreshToken },
          "Refresh successful"
        )
      );
  } catch (error: any) {
    next(error);
  }
};

// Function to handle user logout
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extracting access token from cookies
    const token = req.cookies.accessToken;
    if (!token) {
      throw new ApiError(401, "Token is required");
    }

    // Decoding access token
    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as {
      _id: string;
    };

    if (!decodeToken) {
      throw new ApiError(401, "Token is invalid");
    }

    // Finding user by ID
    const user = await UserModel.findById(decodeToken._id);
    if (!user) {
      throw new ApiError(401, "Token is invalid");
    }

    // Clearing refresh token from database
    user.refreshToken = "";
    user.save({ validateBeforeSave: false });

    // Clearing cookies and sending response
    res
      .status(204)
      .cookie("accessToken", "", cookieOptions)
      .cookie("refreshToken", "", cookieOptions)
      .json(new ApiResponse(204, null, "Logout success"));
  } catch (error) {
    next(error);
  }
};
