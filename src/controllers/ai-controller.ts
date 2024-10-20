import { Request, Response } from "express";
import { Livepeer } from "@livepeer/ai";
import {
  DEFAULT_IMAGE_TO_IMAGE_CONFIG,
  DEFAULT_IMAGE_TO_VIDEO_CONFIG,
  DEFAULT_IMAGE_UPSCALE_CONFIG,
  DEFAULT_TEXT_TO_IMAGE_CONFIG,
  ImageToImageConfig,
  ImageToVideoConfig,
  ImageUpScaleConfig,
  TextToImageConfig,
} from "../type";
import { getImageBlob } from "../util";
import { Story } from "../model";
import { VisualModel } from "../model/visual";

const livepeerAI = new Livepeer({
  httpBearer: "", // Replace with config.LIVEPEER_API_KEY
});

// Controller to handle text-to-image requests
export const textToImageController = async (req: Request, res: Response) => {
  const { prompt, configOption } = req.body;

  if (!prompt) {
    res.status(400).json({
      message: "Prompt is required.",
      success: false,
    });
    return;
  }

  try {
    const config: TextToImageConfig = {
      ...DEFAULT_TEXT_TO_IMAGE_CONFIG,
      ...configOption,
    };
    const result = await livepeerAI.generate.textToImage({ prompt, ...config });

    res.status(200).json({
      data:  result.imageResponse?.images ,
      success: true,
    });
    return;
  } catch (error) {
    console.error("Error in textToImage:", error);
    res.status(500).json({
      message: `Error generating image from text: ${(error as Error).message}`,
      success: false,
    });
    return;
  }
};

// Controller to handle image-to-video requests
export const imageToVideoController = async (req: Request, res: Response) => {
  const { image_url, configOption } = req.body;

  if (!image_url) {
    res.status(400).json({
      message: "Image URL is required.",
      success: false,
    });
    return;
  }

  try {
    const imageBlob = await getImageBlob(image_url);
    const config: ImageToVideoConfig = {
      ...DEFAULT_IMAGE_TO_VIDEO_CONFIG,
      ...configOption,
    };
    const result = await livepeerAI.generate.imageToVideo({
      image: imageBlob,
      ...config,
    });

    res.status(200).json({
      data:result.videoResponse?.images,
      success: true,
    });
    return;
  } catch (error) {
    console.error("Error in imageToVideo:", error);
    res.status(500).json({
      message: `Error generating video from image: ${(error as Error).message}`,
      success: false,
    });
    return;
  }
};

// Controller to handle image-to-image requests
export const imageToImageController = async (req: Request, res: Response) => {
  const { image_url, prompt, configOption } = req.body;

  if (!image_url) {
    res.status(400).json({
      message: "Image URL is required.",
      success: false,
    });
    return;
  }

    if (!prompt || prompt.length <= 0) {
        res.status(400).json({
            message: "Prompt is required.",
            success: false,
          });
          return;
  }

  try {
    const imageBlob = await getImageBlob(image_url);
    const config: ImageToImageConfig = {
      ...DEFAULT_IMAGE_TO_IMAGE_CONFIG,
      ...(configOption ? configOption : {}),
    };
    const result = await livepeerAI.generate.imageToImage({
      image: imageBlob,
      prompt,
      ...config,
    });

    res.status(200).json({
      data: result.imageResponse?.images,
      success: true,
    });
    return;
  } catch (error) {
    console.error("Error in imageToImage:", error);
    res.status(500).json({
      message: `Error generating image from image: ${(error as Error).message}`,
      success: false,
    });
    return;
  }
};

// Controller to handle upscale requests
export const imageUpscaleController = async (req: Request, res: Response) => {
  const { image_url, prompt, configOption } = req.body;

  if (!image_url) {
    res.status(400).json({
      message: "Image URL is required.",
      success: false,
    });
    return;
  }

    if (!prompt || prompt.length <= 0) {
        res.status(400).json({
            message: "Prompt is required.",
            success: false,
          });
          return;
  }

  try {
    const imageBlob = await getImageBlob(image_url);
    const config: ImageUpScaleConfig = {
      ...DEFAULT_IMAGE_UPSCALE_CONFIG,
      ...(configOption ? configOption : {}),
    };
    const result = await livepeerAI.generate.upscale({
      image: imageBlob,
      prompt,
      ...config,
    });

    res.status(200).json({
      data: result.imageResponse?.images,
      success: true,
    });
    return;
  } catch (error) {
    console.error("Error in imageToImage:", error);
    res.status(500).json({
      message: `Error generating image from image: ${(error as Error).message}`,
      success: false,
    });
    return;
  }
};



// UTILITTY CONTROLLER FOR SAVING IMAGE / VIDEO

// Controller to save or update visuals based on the type (image or video)
export const saveOrUpdateVisualController = async (req: Request, res: Response) => {
    const { type, image_url, video_url, episode, scene, act } = req.body;
    const { userId } = req.user;
    const { storyId } = req.params;
  
    // Validate input
    if (!type || !["image", "video"].includes(type)) {
       res.status(400).json({
        message: "Invalid type. Type must be either 'image' or 'video'.",
        success: false,
       });
       return
    }
  
    let visualId;

    try {
      if (type === "image") {
        // Ensure required fields for image type
        if (!image_url || episode === undefined || scene === undefined || act === undefined) {
           res.status(400).json({
            message: "Image URL, episode, scene, and act are required for type 'image'.",
            success: false,
           });
           return
          }
          
          const story = await Story.findOne({ _id: storyId, userId })

          if (!story) {
            throw new Error("no story found");
          }
        //   ensure themes ,world, character and plot already exist
        if (!story.theme) throw new Error("no theme found for the story")
        if (!story.world) throw new Error("no world found for the story")
        if (!story.character) throw new Error("no character found for the story")
        if (!story.plot) throw new Error("no plot found for the story")

          if (!story.visual) {
              const visual = await new VisualModel({}).save()
              story.visual = visual._id
              visualId = visual._id
              await story.save()
          } else {
              visualId = story.visual
          }
  
        // Check for existing document with matching episode, scene, and act
        const filter = { _id: visualId,  "visuals.episode": episode, "visuals.scene": scene, "visuals.act": act };
  
        const update = {
          $addToSet: {
            visuals: { image_url, episode, scene, act }, // Ensure uniqueness within visuals array
          },
        };
  
        const options = { upsert: true, new: true }; // Create if not found, return updated document
  
        const result = await VisualModel.findOneAndUpdate(filter, update, options);
  
         res.status(200).json({
          data: result,
          success: true,
         });
         return
  
      } else if (type === "video") {
        // Ensure video_url is provided
        if (!video_url) {
           res.status(400).json({
            message: "Video URL is required for type 'video'.",
            success: false,
           });
           return
        }
  
        // Create or update the document with the video URL
        const result = await VisualModel.findOneAndUpdate(
          {_id: visualId},
          { video_url },
          { upsert: true, new: true }
        );
  
         res.status(200).json({
          data: result,
          success: true,
         });
         return
      }
    } catch (error) {
      console.error("Error saving or updating visual:", error);
       res.status(500).json({
        message: `Error saving or updating visual: ${(error as Error).message}`,
        success: false,
       });
       return
    }
  };