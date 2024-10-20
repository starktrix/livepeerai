export type TextToImageConfig = {
    modelId: string;
    loras?: string //Record<string, number>;
    // prompt: string;
    height?: number;
    width?: number;
    guidanceScale?: number;
    negativePrompt?: string;
    safetyCheck?: boolean;
    seed?: number;
    numInferenceSteps?: number;
    numImagesPerPrompt?: number;
};

// Default object initialization
export const DEFAULT_TEXT_TO_IMAGE_CONFIG: TextToImageConfig = {
    modelId: "SG161222/RealVisXL_V4.0_Lightning", // replace with actual model ID
    // loras: { 
    //     "latent-consistency/lcm-lora-sdxl": 1.0, 
    //     "nerijs/pixel-art-xl": 1.2 
    // },
    // prompt: "", // replace with actual prompt
    height: 576,
    width: 1024,
    guidanceScale: 7.5,
    negativePrompt: "",
    safetyCheck: true,
    seed: undefined,
    numInferenceSteps: 50,
    numImagesPerPrompt: 1
};

export type ImageToImageConfig = {
    // prompt: string;
    // image: Blob;
    modelId: string;
    loras?: string; //Record<string, number>;
    strength?: number;
    guidanceScale?: number;
    imageGuidanceScale?: number;
    negativePrompt?: string;
    safetyCheck?: boolean;
    seed?: number;
    numInferenceSteps?: number;
    numImagesPerPrompt?: number;
};

// Default config object initialization
export const DEFAULT_IMAGE_TO_IMAGE_CONFIG: ImageToImageConfig = {
    // prompt: "", // replace with actual prompt
    // image: "", // new File([], "image.png"), // replace with the actual image file
    modelId: "timbrooks/instruct-pix2pix", // replace with actual model ID
    // loras: {
    //     "latent-consistency/lcm-lora-sdxl": 1.0,
    //     "nerijs/pixel-art-xl": 1.2
    // },
    strength: 0.8,
    guidanceScale: 7.5,
    imageGuidanceScale: 1.5,
    negativePrompt: "",
    safetyCheck: true,
    seed: undefined,
    numInferenceSteps: 100,
    numImagesPerPrompt: 1
};

export type ImageToVideoConfig = {
    // image: Blob;
    modelId: string;
    height?: number;
    width?: number;
    fps?: number;
    motionBucketId?: number;
    noiseAugStrength?: number;
    safetyCheck?: boolean;
    seed?: number;
    numInferenceSteps?: number;
};

// Default config object initialization
export const DEFAULT_IMAGE_TO_VIDEO_CONFIG: ImageToVideoConfig = {
    // image: "", // new File([], "image.png"), // replace with the actual image file
    modelId: "stabilityai/stable-video-diffusion-img2vid-xt-1-1", // replace with actual model ID
    height: 576,
    width: 1024,
    fps: 6,
    motionBucketId: 127,
    noiseAugStrength: 0.02,
    safetyCheck: true,
    seed: undefined,
    numInferenceSteps: 25
};

export type ImageUpScaleConfig = {
      // prompt: string;
    // image: Blob;
    modelId: string;
    safetyCheck?: boolean;
    seed?: number;
    numInferenceSteps?: number;
}

export const DEFAULT_IMAGE_UPSCALE_CONFIG: ImageUpScaleConfig = {
     // prompt: "", // replace with actual prompt
    // image: "", // new File([], "image.png"), // replace with the actual image file
    modelId: "stabilityai/stable-diffusion-x4-upscaler", // replace with actual model ID
    safetyCheck: true,
    seed: undefined,
    numInferenceSteps: 75,
}