// services/storyService/characterService.ts
import { Character, Story } from "../../model"; // Ensure your Character and Story models are correctly imported
import { CHARACTER_BUILDER_PROMPT } from "../../system_prompt";
import { createChatbot, REFINE_PROMPT } from "../llm";

// Create Character
interface CreateCharacterInput {
  userId: string;
  prompt: string;
  // themeId: string;
  // worldId: string;
  storyId: string;
}

interface CreateCharacterOutput {
  characterId: string;
  character_details: string;
}

export async function createCharacter({
  userId,
  prompt,
  // themeId,
  // worldId,
  storyId,
}: CreateCharacterInput): Promise<CreateCharacterOutput> {
  try {
    const story = await Story.findOne({
      _id: storyId,
    }).populate(["theme", "world"]);

    if (story?.character) {
      throw new Error(
        "character already exist, you can only refine the character if you have not yet saved it"
      );
    }

    if (!story) {
      throw new Error("no story found");
    }

    if (!story.theme) throw new Error("No Theme associated with the story");
    if (!story.world) throw new Error("No world associated with the story");

    const CHARACTER_PROMPT = CHARACTER_BUILDER_PROMPT({
      THEME: story.theme,
      WORLD: story.world,
    });
    const { chain: llm_chain } = createChatbot(storyId, CHARACTER_PROMPT);
    const output = await llm_chain.invoke({
      input: prompt,
    });

    const character = await new Character({
      userId,
      details: JSON.parse(JSON.stringify(output)).response,
      themeId: story.theme._id,
      worldId: story.world._id,
    }).save();

    story.character = character._id;
    await story.save();

    return {
      characterId: character._id.toString(),
      character_details: JSON.parse(character.details).characters,
    };
  } catch (error: unknown) {
    console.error("Error creating character:", error);
    throw new Error(`Failed to create character: ${(error as any).message}`);
  }
}

// Refine Character
interface RefineCharacterInput {
  userId: string;
  prompt: string;
  storyId: string;
  characterId: string; // Optional parameter
}

interface RefineCharacterOutput {
  characterId: string;
  character_details: any;
}

export async function refineCharacter({
  userId,
  prompt,
  storyId,
  characterId,
}: RefineCharacterInput): Promise<RefineCharacterOutput> {
  try {
    const story = await Story.findOne({
      _id: storyId,
      character: characterId,
    }).populate(["character", "theme", "world"]);

    if (!story) throw new Error("Story not found");
    if (!story.theme) throw new Error("No Theme associated with the story");
    if (!story.world) throw new Error("World not associated with the story");
    if (!story.character)
      throw new Error("Character not associated with the story");

    if (story.save_status.character) {
      throw new Error("Character already saved. Cannot be refined");
    }

    //   FIX:
    // =====================================================
    // const characters = story.character as any; // Assuming details is an array of characters

    // // If character_unique_id is provided, find the specific character to refine
    // const characterToRefine = character_unique_id
    //   ? characters.find(
    //       (character: any) => character.unique_id === character_unique_id
    //     ) // Adjust based on your actual character structure
    //   : characters[0]; // Default to first character if none is specified

    // if (!characterToRefine) throw new Error("Character not found");

    // // Update the character's details
    // characterToRefine.details = prompt; // Modify based on your actual structure
    // const updatedCharacter = await Character.findByIdAndUpdate(
    //   story.character._id,
    //   { details: characters }, // Update the details array
    //   { new: true }
    // );

    // if (!updatedCharacter) throw new Error("Failed to refine character");
    // =====================================================
    const character = await Character.findById({ _id: characterId });

    if (!character) {
      throw new Error("No story character found");
    }

    const CHARACTER_PROMPT = CHARACTER_BUILDER_PROMPT({
      THEME: story.theme,
      WORLD: story.world,
    });
    const { chain: llm_chain } = createChatbot(storyId, CHARACTER_PROMPT);
    const output = await llm_chain.invoke({
      input: await REFINE_PROMPT.format({
        context: character?.details,
        instruction: prompt,
      }),
    });

    console.log("============== CHARACTER OUTPUT ==================");
    console.log(JSON.parse(JSON.stringify(output)));

    character.details = JSON.parse(JSON.stringify(output)).response;

    await character.save()

    return {
      characterId: character._id.toString(),
      character_details: JSON.parse(character.details).characters,
    };
  } catch (error: unknown) {
    console.error("Error refining character:", error);
    throw new Error(`Failed to refine character: ${(error as any).message}`);
  }
}

// Save Character
interface SaveCharacterInput {
  storyId: string;
  userId: string;
  characterId: string;
}

export async function saveCharacter({
  storyId,
  userId,
  characterId,
}: SaveCharacterInput): Promise<void> {
  try {
    const story = await Story.findOneAndUpdate(
      { _id: storyId, character: characterId },
      { "save_status.character": true },
      { new: true }
    );

    if (!story) throw new Error("Character not found");

    console.log("Character saved successfully for story:", story._id);
  } catch (error: unknown) {
    console.error("Error saving character:", error);
    throw new Error(`Failed to save character: ${(error as any).message}`);
  }
}
