// routes/themeRoutes.ts
import { Router } from "express";
import {
  createThemeController,
  refineThemeController,
  saveThemeController,
} from "../controllers/theme-controller";

const themeRouter = Router();

// Route to create a new theme
themeRouter.post("/:storyId/theme", createThemeController); // POST /api/theme

// Route to refine an existing theme
themeRouter.patch("/:storyId/theme/:themeId/refine", refineThemeController); // PUT /api/theme/refine

// Route to save a theme
themeRouter.patch("/:storyId/theme/:themeId/save", saveThemeController); // PUT /api/theme/save

export default themeRouter;
