import { Types } from "mongoose";
import { Story, Theme } from "../../model";
import { createChatbot, REFINE_PROMPT } from "../llm";
import { STORY_CONCEPT_PROMPT } from "../../system_prompt";

interface CreateThemeInput {
  userId: string;
  storyId: string;
  prompt: string;
}

interface CreateThemeOutput {
  themeId: string;
  theme_details: string;
}

export async function createTheme({
  userId,
  storyId,
  prompt,
}: CreateThemeInput): Promise<CreateThemeOutput> {
  try {
    const story = await Story.findById(storyId);

    if (!story) {
      throw new Error("no story found");
    }

    if (story.theme) {
      throw new Error(
        "theme already exist, you can only refine the theme if you have not yet saved it"
      );
    }

    // const messages = [
    //   {
    //     role: "system",
    //     content: STORY_CONCEPT_PROMPT,
    //   },
    //   {
    //     role: "user",
    //     content: prompt
    //       // "Generate a twelve(12) episode superhero themed action story in a dystopian futuristic interstellar world",
    //   },
    // ];

    const { chain: llm_chain } = createChatbot(storyId, STORY_CONCEPT_PROMPT);
    const output = await llm_chain.invoke({ input: prompt });
    console.log("============== THEME OUTPUT ==================");
    console.log(JSON.parse(JSON.stringify(output)));

    const theme = await new Theme({
      userId,
      details: JSON.parse(JSON.stringify(output)).response,
    }).save();

    // await Story.findByIdAndUpdate(storyId, {
    //   themeId: theme._id,
    // });

    story.theme = theme._id;
    await story.save();

    return {
      themeId: theme._id.toString(),
      theme_details: JSON.parse(theme.details),
    };
    // return { themeId: "", theme_details: "" };
  } catch (error: unknown) {
    console.error("Error creating theme:", error);
    throw new Error(`Failed to create theme: ${(error as any).message}`);
  }
}

// ========================================
// REFINE THEME
// ========================================
interface RefineThemeInput {
  userId: string;
  storyId: string;
  themeId: string;
  prompt: string;
}

interface RefineThemeOutput {
  themeId: string;
  theme_details: string;
}

export async function refineTheme({
  userId,
  storyId,
  prompt,
  themeId,
}: RefineThemeInput): Promise<RefineThemeOutput> {
  try {
    const story = await Story.findOne({
      _id: storyId,
      theme: themeId,
    }).populate("theme");
    if (!story) throw new Error("Story not found");
    if (!story.theme) throw new Error("No Theme associated with the story");

    if (story.save_status.theme) {
      throw new Error("Theme already saved. Cannot be refined");
    }

    const theme = await Theme.findById({ _id: themeId });

    if (!theme) {
      throw new Error("No story theme found");
    }

    const { chain: llm_chain } = createChatbot(storyId, STORY_CONCEPT_PROMPT);
    const output = await llm_chain.invoke({
      input: await REFINE_PROMPT.format({
        context: theme?.details,
        instruction: prompt,
      }),
    });
    console.log("============== THEME OUTPUT ==================");
    console.log(JSON.parse(JSON.stringify(output)));

    theme.details = JSON.parse(JSON.stringify(output)).response;

    // await Theme.findByIdAndUpdate(
    //   { _id: themeId },
    //   { details: JSON.parse(JSON.stringify(output)).response },
    //   { new: true }
    // );
    await theme.save();

    return {
      themeId: theme._id.toString(),
      theme_details: JSON.parse(theme.details),
    };
  } catch (error: unknown) {
    console.error("Error refining theme:", error);
    throw new Error(`Failed to refine theme: ${(error as any).message}`);
  }
}

//   ========================================
// SAVE THEME
// ==========================================

interface SaveThemeInput {
  userId: string;
  storyId: string;
  themeId: string;
}

export async function saveTheme({
  userId,
  storyId,
  themeId,
}: SaveThemeInput): Promise<void> {
  try {
    const story = await Story.findOneAndUpdate(
      { _id: storyId, theme: themeId },
      { "save_status.theme": true },
      { new: true }
    );
    if (!story) throw new Error("Story or theme not found");

    console.log("Theme saved successfully for story:", story._id);
  } catch (error: unknown) {
    console.error("Error saving theme:", error);
    throw new Error(`Failed to save theme: ${(error as any).message}`);
  }
}
