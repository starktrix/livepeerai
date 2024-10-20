// routes/storyRouter.ts
import { Router } from "express";
import { createStoryController } from "../controllers/story-controller"; // Adjust the import path as necessary
import plotRouter from "./plotRoutes";
import themeRouter from "./themeRoutes";
import worldRouter from "./worldRoutes";
import characterRouter from "./characterRoutes";
import { ensureIsAuthenticated } from "../middleware";
import {
  getAllCharactersController,
  getAllPlotsController,
  getAllStoriesController,
  getAllThemesController,
  getAllVisualsController,
  getAllWorldsController,
  getCharacterByStoryIdController,
  getPlotByStoryIdController,
  getStoryByIdController,
  getThemeByStoryIdController,
  getVisualByStoryIdController,
  getWorldByStoryIdController,
} from "../controllers/get-story-controller";
import aiRouter from "./aiRoutes";
import { saveOrUpdateVisualController } from "../controllers/ai-controller";

const storyRouter = Router();

// Route to create a story
storyRouter.use("/ai", aiRouter)

storyRouter.use(ensureIsAuthenticated);
storyRouter.put("/ai/story/:storyId", saveOrUpdateVisualController)
storyRouter.post("/stories", createStoryController);
storyRouter.use("/stories", themeRouter);
storyRouter.use("/stories", worldRouter);
storyRouter.use("/stories", characterRouter);
storyRouter.use("/stories", plotRouter);

// Get all stories for the logged-in user
storyRouter.get("/stories", getAllStoriesController);
storyRouter.get("/stories/themes", getAllThemesController);
storyRouter.get("/stories/worlds", getAllWorldsController);
storyRouter.get("/stories/characters", getAllCharactersController);
storyRouter.get("/stories/plots", getAllPlotsController);
storyRouter.get("/stories/visuals", getAllVisualsController);



// Get a specific story by ID (owned by the user)
storyRouter.get("/stories/:storyId", getStoryByIdController);

// Routes for themes
storyRouter.get("/stories/themes/:storyId", getThemeByStoryIdController);

// Routes for worlds
storyRouter.get("/stories/worlds/:storyId", getWorldByStoryIdController);

// Routes for characters

storyRouter.get(
  "/stories/characters/:storyId",
  getCharacterByStoryIdController
);

// Routes for plots
storyRouter.get("/stories/plots/:storyId", getPlotByStoryIdController);

// Routes for visuals
storyRouter.get("/stories/visuals/:storyId", getVisualByStoryIdController);

export default storyRouter;
