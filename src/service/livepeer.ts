import { Livepeer } from "@livepeer/ai";
import {
  DEFAULT_IMAGE_TO_IMAGE_CONFIG,
  DEFAULT_IMAGE_TO_VIDEO_CONFIG,
  DEFAULT_TEXT_TO_IMAGE_CONFIG,
  ImageToImageConfig,
  ImageToVideoConfig,
  TextToImageConfig,
} from "../type";
import { getImageBlob } from "../util";

const livepeerAI = new Livepeer({
  httpBearer: "", //config.LIVEPEER_API_KEY
});

export async function textToImage(
  prompt: string,
  configOption: TextToImageConfig = DEFAULT_TEXT_TO_IMAGE_CONFIG
) {
    try {
      const config = {...DEFAULT_TEXT_TO_IMAGE_CONFIG, ...configOption}
    const resultAI = await livepeerAI.generate.textToImage({
      prompt,
      ...config,
    });
        return {
            image: resultAI.imageResponse?.images,
            success: true
        }
    } catch (error) {
        console.error(error);
    return {
      message: `error generating image from text: ${(error as any).message}`,
      success: false,
    };
  }
}

export async function imageToVideo(
  image_url: string,
  configOption: ImageToVideoConfig = DEFAULT_IMAGE_TO_VIDEO_CONFIG
) {
    try {
        const config = {...DEFAULT_IMAGE_TO_VIDEO_CONFIG, ...configOption}
        const resultAI = await livepeerAI.generate.imageToVideo({
          image: await getImageBlob(image_url),
        ...config,
      });
          return {
              image: resultAI.videoResponse?.images,
              success: true
          }
      } catch (error) {
          console.error(error);
      return {
        message: `error generating video from image: ${(error as any).message}`,
        success: false,
      };
    }
}

export async function imageToImage(
    image_url: string,
  prompt: string="",
  configOption: ImageToImageConfig = DEFAULT_IMAGE_TO_IMAGE_CONFIG
) {
    try {
        const config = {...DEFAULT_IMAGE_TO_IMAGE_CONFIG, ...configOption}
        const resultAI = await livepeerAI.generate.imageToImage({
            image: await getImageBlob(image_url),
          prompt,
        ...config,
      });
          return {
              image: resultAI.imageResponse?.images,
              success: true
          }
      } catch (error) {
          console.error(error);
      return {
        message: `error generating video from image: ${(error as any).message}`,
        success: false,
      };
    }
}
