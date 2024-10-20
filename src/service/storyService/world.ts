// services/worldService.ts
import { Types } from "mongoose";
import { World, Story } from "../../model"; // Ensure your World and Story models are correctly imported
import { createChatbot, REFINE_PROMPT } from "../llm";
import { WORLD_BUILDING_PROMPT } from "../../system_prompt";

// Create World
interface CreateWorldInput {
  userId: string;
  prompt: string;
  storyId: string;
}

interface CreateWorldOutput {
  worldId: string;
  world_details: string;
}

export async function createWorld({
  userId,
  prompt,
  storyId,
}: CreateWorldInput): Promise<CreateWorldOutput> {
  try {
    const story = await Story.findOne({
      _id: storyId,
    }).populate("theme");

    if (!story) {
      throw new Error("no story found");
    }
    if (!story.theme) throw new Error("No Theme associated with the story");

    if (story.world) {
      throw new Error(
        "world already exist, you can only refine the world if you have not yet saved it"
      );
    }

    const WORLD_PROMPT = WORLD_BUILDING_PROMPT({ THEME: story.theme });

    const { chain: llm_chain } = createChatbot(storyId, WORLD_PROMPT);
    const output = await llm_chain.invoke({
      input: prompt,
    });
    // console.log("============== THEME OUTPUT ==================");
    // console.log(JSON.parse(JSON.stringify(output)));
    // Create new World
    const world = await new World({
      userId,
      details: JSON.parse(JSON.stringify(output)).response,
      themeId: story.theme._id,
    }).save();

    // Update Story with worldId
    story.world = world._id;
    await story.save();


    return { worldId: world._id.toString(), world_details: JSON.parse(world.details).world_setting };
    // return { worldId: "", world_details: "" };
  } catch (error: unknown) {
    console.error("Error creating world:", error);
    throw new Error(`Failed to create world: ${(error as any).message}`);
  }
}

// Refine World
interface RefineWorldInput {
  userId: string;
  prompt: string;
  storyId: string;
  worldId: string;
}

interface RefineWorldOutput {
  worldId: string;
  world_details: string;
}

export async function refineWorld({
  userId,
  prompt,
  storyId,
  worldId,
}: RefineWorldInput): Promise<RefineWorldOutput> {
  try {
    const story = await Story.findOne({
      _id: storyId,
      world: worldId,
    }).populate(["world", "theme"]);
    if (!story) throw new Error("Story not found");
    if (!story.world) throw new Error("World not associated with the story");
    if (!story.theme) throw new Error("No Theme associated with the story");

    if (story.save_status.world) {
      throw new Error("World already saved. Cannot be refined");
    }

    const world = await World.findById(
      { _id: worldId },
    );

    if (!world) {
      throw new Error("No story world found");
    }

    const WORLD_PROMPT = WORLD_BUILDING_PROMPT({ THEME: story.theme });
    const { chain: llm_chain } = createChatbot(storyId, WORLD_PROMPT);
    const output = await llm_chain.invoke({
      input: (await REFINE_PROMPT.format({
        context: world?.details,
        instruction: prompt,
      })),
    });
    console.log("============== WORLD OUTPUT ==================");
    console.log(JSON.parse(JSON.stringify(output)));

    world.details = JSON.parse(JSON.stringify(output)).response;

    await world.save()

    return { worldId: world._id.toString(), world_details: JSON.parse(world.details).world_setting };
  } catch (error: unknown) {
    console.error("Error refining world:", error);
    throw new Error(`Failed to refine world: ${(error as any).message}`);
  }
}

// Save World
interface SaveWorldInput {
  storyId: string;
  worldId: string;
  userId: string;
}

export async function saveWorld({
  storyId,
  worldId,
  userId,
}: SaveWorldInput): Promise<void> {
  try {
    const story = await Story.findOneAndUpdate(
      { _id: storyId, world: worldId },
      { "save_status.world": true },
      { new: true }
    );

    if (!story) throw new Error("Story or world not found");

    console.log("World saved successfully for story:", story._id);
  } catch (error: unknown) {
    console.error("Error saving world:", error);
    throw new Error(`Failed to save world: ${(error as any).message}`);
  }
}
