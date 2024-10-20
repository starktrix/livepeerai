// routes/characterRoutes.ts
import { Router } from "express";
import {
  createCharacterController,
  refineCharacterController,
  saveCharacterController,
} from "../controllers/character-controller";

const characterRouter = Router();

// Route to create a character
characterRouter.post("/:storyId/character", createCharacterController);

// Route to refine a character
characterRouter.patch("/:storyId/character/:characterId/refine", refineCharacterController);

// Route to save a character
characterRouter.patch("/:storyId/character/:characterId/save", saveCharacterController);

export default characterRouter;
