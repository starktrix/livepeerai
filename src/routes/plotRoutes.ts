// routes/plotRouter.ts
import { Router } from "express";
import {
  createPlotController,
  refinePlotController,
  savePlotController,
} from "../controllers/plot-controller";

const plotRouter = Router();

// Route to create a plot
plotRouter.post("/:storyId/plot", createPlotController);

// Route to refine a plot
plotRouter.patch("/:storyId/plot/:plotId/refine", refinePlotController);

// Route to save a plot
plotRouter.patch("/:storyId/plot/:plotId/save", savePlotController);

export default plotRouter;
