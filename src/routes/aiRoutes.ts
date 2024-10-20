import express from "express";
import {
  textToImageController,
  imageToVideoController,
  imageToImageController,
  imageUpscaleController,
} from "../controllers/ai-controller";

const aiRouter = express.Router();

aiRouter.post("/text-to-image", textToImageController);
aiRouter.post("/image-to-video", imageToVideoController);
aiRouter.post("/image-to-image", imageToImageController);
aiRouter.post("/image-upscale", imageUpscaleController);

export default aiRouter;
