// controllers/characterController.ts
import { Request, Response } from "express";
import { Types } from "mongoose";
import {
  createCharacter,
  refineCharacter,
  saveCharacter,
} from "../service/storyService/character";

// Create Character Controller
export const createCharacterController = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    const { userId } = req.user;
    const { storyId } = req.params;


    // Validate ObjectId formats
    if (
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(storyId)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid ObjectId format",
      });
      return; // Ensure return after response
    }

    // Validate prompt
    if (!prompt || prompt.trim() === "") {
      res.status(400).json({
        success: false,
        message: "Prompt cannot be empty",
      });
      return; // Ensure return after response
    }

    const result = await createCharacter({
      userId,
      prompt,
      storyId,
    });
    res.status(201).json({
      success: true,
      message: "Character created successfully",
      data: result,
    });
    return; // Ensure return after response
  } catch (error: any) {
    console.error("Create character failed:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
    return; // Ensure return after response
  }
};

// Refine Character Controller
export const refineCharacterController = async (req: Request, res: Response) => {
  try {
    // const { userId, prompt, storyId, character_unique_id } = req.body;
    const { prompt } = req.body;
    const { userId } = req.user;
    const { storyId, characterId } = req.params;

    // Validate ObjectId formats
    if (
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(storyId) ||
      !Types.ObjectId.isValid(characterId)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid ObjectId format",
      });
      return; // Ensure return after response
    }

    // Validate prompt
    if (!prompt || prompt.trim() === "") {
      res.status(400).json({
        success: false,
        message: "Prompt cannot be empty",
      });
      return; // Ensure return after response
    }

    const result = await refineCharacter({
      userId,
      prompt,
      storyId,
      characterId,
    });
    res.status(200).json({
      success: true,
      message: "Character refined successfully",
      data: result,
    });
    return; // Ensure return after response
  } catch (error: any) {
    console.error("Refine character failed:", error);
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
    return; // Ensure return after response
  }
};

// Save Character Controller
export const saveCharacterController = async (req: Request, res: Response) => {
  try {
    const { storyId, characterId } = req.params;
    const { userId } = req.user;

    // Validate ObjectId formats
    if (
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(storyId) ||
      !Types.ObjectId.isValid(characterId)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid ObjectId format",
      });
      return; // Ensure return after response
    }

    await saveCharacter({ storyId, userId, characterId });
    res.status(200).json({
      success: true,
      message: "Character saved successfully",
    });
    return; // Ensure return after response
  } catch (error: any) {
    console.error("Save character failed:", error);
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
    return; // Ensure return after response
  }
};
