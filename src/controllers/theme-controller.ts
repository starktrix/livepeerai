import { Request, Response } from "express";
import { Types } from "mongoose";
import {
  createTheme,
  refineTheme,
  saveTheme,
} from "../service/storyService/theme";

export const createThemeController = async (req: Request, res: Response) => {
  try {
    const {  prompt } = req.body;
    const { userId } = req.user;
    const { storyId } = req.params;

    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(storyId)) {
      res.status(400).json({
        success: false,
        message: "Invalid ObjectId format",
      });
      return;
    }

    if (!prompt || prompt.trim() === "") {
      res.status(400).json({
        success: false,
        message: "Prompt cannot be empty",
      });
      return;
    }

    const result = await createTheme({ userId, storyId, prompt });
    res.status(200).json({
      success: true,
      message: "Theme created successfully",
      data: result,
    });
    return;
  } catch (error: any) {
    console.error("Create theme failed:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
    return;
  }
};

export const refineThemeController = async (req: Request, res: Response) => {
  try {
    const {  prompt } = req.body;
    const { userId } = req.user;
    const { storyId, themeId } = req.params;

    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(storyId) || !Types.ObjectId.isValid(themeId)) {
      res.status(400).json({
        success: false,
        message: "Invalid ObjectId format",
      });
      return;
    }

    if (!prompt || prompt.trim() === "") {
      res.status(400).json({
        success: false,
        message: "Prompt cannot be empty",
      });
      return;
    }

    const result = await refineTheme({ userId, storyId, themeId, prompt });
    res.status(200).json({
      success: true,
      message: "Theme refined successfully",
      data: result,
    });
    return;
  } catch (error: any) {
    console.error("Refine theme failed:", error);
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }
};

export const saveThemeController = async (req: Request, res: Response) => {
  try {
    const { storyId, themeId } = req.params;
    const { userId } = req.user;

    if (
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(storyId) ||
      !Types.ObjectId.isValid(themeId)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid ObjectId format",
      });
      return;
    }

    await saveTheme({ userId, storyId, themeId });
    res.status(200).json({
      success: true,
      message: "Theme saved successfully",
    });
    return;
  } catch (error: any) {
    console.error("Save theme failed:", error);
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }
};
