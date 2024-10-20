// controllers/storyController.ts
import { Request, Response } from "express";
import { Types } from "mongoose";
import { createStory } from "../service/storyService"; // Adjust the import path as necessary

// Create Story Controller
export const createStoryController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(userId)) {
      res
        .status(401)
        .json({ success: false, message: "Invalid userId format" });
      return;
    }

   const storyId =  await createStory({ userId });
    res
      .status(200)
      .json({ storyId, success: true, message: "Story created successfully" });
    return; // Ensure the return statement is included
  } catch (error: any) {
    console.error("Create story failed:", error);
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    return; // Ensure the return statement is included
  }
};
