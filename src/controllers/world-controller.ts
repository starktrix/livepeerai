// controllers/worldController.ts
import { Request, Response } from "express";
import { Types } from "mongoose";
import {
  createWorld,
  refineWorld,
  saveWorld,
} from "../service/storyService/world";

// Create World Controller
export const createWorldController = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    const { userId } = req.user;
    const { storyId } = req.params;

    // Validate ObjectId formats
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(storyId)) {
      res
        .status(400)
        .json({ success: false, message: "Invalid ObjectId format" });
      return;
    }

    // Validate prompt
    if (!prompt || prompt.trim() === "") {
      res
        .status(400)
        .json({ success: false, message: "Prompt cannot be empty" });
      return;
    }

    const result = await createWorld({ userId, prompt, storyId });
    res.status(201).json({
      success: true,
      message: "World created successfully",
      data: result,
    });
    return;
  } catch (error: any) {
    console.error("Create world failed:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
    return;
  }
};

// Refine World Controller
export const refineWorldController = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    const { userId } = req.user;
    const { storyId, worldId } = req.params;

    // Validate ObjectId formats
    if (
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(storyId) ||
      !Types.ObjectId.isValid(worldId)
    ) {
      res
        .status(400)
        .json({ success: false, message: "Invalid ObjectId format" });
      return;
    }

    // Validate prompt
    if (!prompt || prompt.trim() === "") {
      res
        .status(400)
        .json({ success: false, message: "Prompt cannot be empty" });
      return;
    }

    const result = await refineWorld({ userId, prompt, storyId, worldId });
    res.status(200).json({
      success: true,
      message: "World refined successfully",
      data: result,
    });
    return;
  } catch (error: any) {
    console.error("Refine world failed:", error);
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({ success: false, message: error.message });
    return;
  }
};

// Save World Controller
export const saveWorldController = async (req: Request, res: Response) => {
  try {
    const { storyId, worldId } = req.params;
    const { userId } = req.user;

    // Validate ObjectId formats
    if (
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(storyId) ||
      !Types.ObjectId.isValid(worldId)
    ) {
      res
        .status(400)
        .json({ success: false, message: "Invalid ObjectId format" });
      return;
    }

    await saveWorld({ storyId, worldId, userId });
    res
      .status(200)
      .json({ success: true, message: "World saved successfully" });
    return;
  } catch (error: any) {
    console.error("Save world failed:", error);
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({ success: false, message: error.message });
    return;
  }
};
