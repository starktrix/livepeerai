import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { login, signUp } from "../service/authService";
import Joi from "joi";

// Define validation schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(), // Example: minimum 6 characters
});

const signupSchema = Joi.object({
  username: Joi.string().min(3).required(), // Example: minimum 3 characters
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Login controller with validation
export const loginController = async (req: Request, res: Response) => {
  // Validate request body
  const { error } = loginSchema.validate(req.body);
  if (error) {
     res.status(401).json({
      message: error.details[0].message,
      success: false,
     });
    return
  }

  try {
    console.log("Login creds: ========\n", req.body);
    const user = await login({
      email: req.body.email,
      password: req.body.password,
    });

    if (!user.success) {
      res.status(401).json({
        message: user.err_message,
        success: false,
      });
      return;
    }

    const token = jwt.sign(
      {
        username: user.user?.username,
        userId: user.user?.userId,
        email: user.user?.email,
      },
      `${process.env.ACCESS_TOKEN_SECRET}`,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "login successful",
      success: true,
      token: token,
    });
    return
  } catch (error) {
    console.log("controller error: ", error);
    res.status(500).json({
      message: `login controller error: ${(error as any).message}`,
      success: false,
    });
    return
  }
};

// Signup controller with validation
export const sigupController = async (req: Request, res: Response) => {
  // Validate request body
  const { error } = signupSchema.validate(req.body);
  if (error) {
     res.status(401).json({
      message: error.details[0].message,
      success: false,
     });
     return
  }

  try {
    const user = await signUp({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    if (!user.success) {
      res.status(401).json({
        message: user.err_message,
        success: false,
      });
      return;
    }

    const token = jwt.sign(
      {
        username: user.user?.username,
        userId: user.user?.userId,
        email: user.user?.email,
      },
      `${process.env.ACCESS_TOKEN_SECRET}`,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "signup successful",
      success: true,
      token: token,
    });
    return
  } catch (error) {
    console.log("controller error: ", error);
    res.status(500).json({
      message: `signup controller error: ${(error as any).message}`,
      success: false,
    });
    return
  }
};
