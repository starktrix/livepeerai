// routes/worldRouter.ts
import { Router } from 'express';
import {
  createWorldController,
  refineWorldController,
  saveWorldController,
} from '../controllers/world-controller';

const worldRouter = Router();

// Route to create a new world
worldRouter.post('/:storyId/world', createWorldController);          // POST /api/world

// Route to refine an existing world
worldRouter.patch('/:storyId/world/:worldId/refine', refineWorldController);     // PUT /api/world/refine

// Route to save a world
worldRouter.patch('/:storyId/world/:worldId/save', saveWorldController);         // PUT /api/world/save

export default worldRouter;
