const warmModels = [
  "SG161222/RealVisXL_V4.0_Lightning",
  "ByteDance/SDXL-Lightning",
];

const onDemandModels = [
  "SG161222/Realistic_Vision_V6.0_B1_noVAE",
  "stabilityai/stable-diffusion-xl-base-1.0",
  "runwayml/stable-diffusion-v1-5",
  "prompthero/openjourney-v4",
  "ByteDance/SDXL-Lightning",
  "SG161222/RealVisXL_V4.0",
  "SG161222/RealVisXL_V4.0_Lightning",
  "stabilityai/sd-turbo",
  "stabilityai/sdxl-turbo",
  "stabilityai/stable-diffusion-3-medium-diffusers",
];

export const TEXT_TO_IMAGE_MODELS: string[] = [
  ...new Set([...warmModels, ...onDemandModels]),
];

const warmImageToImageModels = ["timbrooks/instruct-pix2pix"];

const onDemandImageToImageModels = [
  "timbrooks/instruct-pix2pix",
  "ByteDance/SDXL-Lightning",
  "SG161222/RealVisXL_V4.0",
  "SG161222/RealVisXL_V4.0_Lightning",
  "stabilityai/sd-turbo",
  "stabilityai/sdxl-turbo",
];

export const IMAGE_TO_IMAGE_MODELS: string[] = [
  ...new Set([...warmImageToImageModels, ...onDemandImageToImageModels]),
];

const warmImageToVideoModels = [
  "stabilityai/stable-video-diffusion-img2vid-xt-1-1",
];

const onDemandImageToVideoModels = [
  "stable-video-diffusion-img2vid-xt",
  "stabilityai/stable-video-diffusion-img2vid-xt-1-1",
];

export const IMAGE_TO_VIDEO_MODEL: string[] = [
  ...new Set([...warmImageToVideoModels, ...onDemandImageToVideoModels]),
];

const warmUpScaleModels = ["stabilityai/stable-diffusion-x4-upscaler"];

const onDemandUpScaleModels = ["stabilityai/stable-diffusion-x4-upscaler"];

export const IMAGE_UPSCALE_MODEL: string[] = [
  ...new Set([...warmUpScaleModels, ...onDemandUpScaleModels]),
];
