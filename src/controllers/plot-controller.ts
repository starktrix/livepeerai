// controllers/plotController.ts
import { Request, Response } from "express";
import { Types } from "mongoose";
import { createPlot, refinePlot, savePlot } from "../service/storyService/plot";

// Create Plot Controller
export const createPlotController = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    const { userId } = req.user;
    const { storyId } = req.params;

    // Validate ObjectId formats
    if (
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(storyId)
    ) {
        res.status(400).json({ success: false, message: "Invalid ObjectId format" });
        return
    }

    // Validate prompt
    if (!prompt || prompt.length === 0) {
        res.status(400).json({ success: false, message: "Prompt cannot be empty" });
        return
    }

    const result = await createPlot({ userId, prompt, storyId  });
     res.status(200).json({
      success: true,
      message: "Plot created successfully",
      data: result,
     });
     return
  } catch (error: any) {
    console.error("Create plot failed:", error);
     res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
     });
     return
  }
};

// Refine Plot Controller
export const refinePlotController = async (req: Request, res: Response) => {
  try {
    // const { userId, prompt, plotId } = req.body;
    const { prompt } = req.body;
    const { userId } = req.user;
    const { storyId, plotId } = req.params;

    // Validate ObjectId formats
    if (
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(plotId)
    ) {
        res.status(400).json({ success: false, message: "Invalid ObjectId format" });
        return
    }

    // Validate prompt
    if (!prompt || prompt.length === 0) {
        res.status(400).json({ success: false, message: "Prompt cannot be empty" });
        return
    }

    const result = await refinePlot({ userId, prompt, storyId, plotId });
     res.status(200).json({
      success: true,
      message: "Plot refined successfully",
      data: result,
     });
     return
  } catch (error: any) {
    console.error("Refine plot failed:", error);
    const statusCode = error.message.includes("not found") ? 404 : 500;
      res.status(statusCode).json({ success: false, message: error.message });
      return
  }
};

// Save Plot Controller
export const savePlotController = async (req: Request, res: Response) => {
  try {
    const { storyId, plotId } = req.params;
    const { userId } = req.user;

    // Validate ObjectId formats
    if (
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(plotId) ||
      !Types.ObjectId.isValid(plotId)
    ) {
        res.status(400).json({ success: false, message: "Invalid ObjectId format" });
        return
    }

    await savePlot({ userId, storyId, plotId });
      res.status(200).json({ success: true, message: "Plot saved successfully" });
      return
  } catch (error: any) {
    console.error("Save plot failed:", error);
    const statusCode = error.message.includes("not found") ? 404 : 500;
      res.status(statusCode).json({ success: false, message: error.message });
      return
  }
};
