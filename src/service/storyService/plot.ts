// services/storyService/plotService.ts
import { Types } from "mongoose";
import {Plot, Story} from "../../model"; // Ensure the Plot model is correctly imported
import { IPlotDetail } from "../../model/plot"; // Ensure IPlotDetail is correctly imported
import { PLOT_WEAVER_PROMPT } from "../../system_prompt";
import { createChatbot, REFINE_PROMPT } from "../llm";

// Create Plot
interface CreatePlotInput {
  userId: string;
  prompt: string; // Assuming prompt is an array of plot details
  // themeId: string;
  // worldId: string;
  storyId: string;
}

interface CreatePlotOutput {
  plotId: string;
  plot_details: string;
}

export async function createPlot({
  userId,
  prompt,
storyId,
}: CreatePlotInput): Promise<CreatePlotOutput> {
  try {
    const story = await Story.findOne({
      _id: storyId,
    }).populate(["theme", "world", "character"]);

    if (!story) {
      throw new Error("no story found");
    }

    if (story.plot) {
      throw new Error(
        "plot already exist, you can only refine the plot if you have not yet saved it"
      );
    }

    if (!story.theme) throw new Error("No Theme associated with the story");
    if (!story.world) throw new Error("No world associated with the story");
    if (!story.character) throw new Error("No character associated with the story");

    const PLOT_PROMPT = PLOT_WEAVER_PROMPT({
      THEME: story.theme,
      WORLD: story.world,
      CHARACTERS: story.character
    });
    const { chain: llm_chain } = createChatbot(storyId, PLOT_PROMPT);
    const output = await llm_chain.invoke({
      input: prompt,
    });

    const plot = await new Plot({
      userId,
      details: JSON.parse(JSON.stringify(output)).response,
      themeId: story.theme._id,
      worldId: story.world._id,
      characterId: story.character._id,
    }).save();

    story.plot = plot._id
    await story.save()

    return {
      plotId: plot._id.toString(),
      plot_details: JSON.parse(plot.details),
    };
  } catch (error: unknown) {
    console.error("Error creating plot:", error);
    throw new Error(`Failed to create plot: ${(error as any).message}`);
  }
}

// Refine Plot
interface RefinePlotInput {
  userId: string;
  storyId: string;
  prompt: string; // Assuming prompt is an array of plot details
  plotId: string;
}

interface RefinePlotOutput {
  plotId: string;
  plot_details: string;
}

export async function refinePlot({
  userId,
  prompt,
  storyId,
  plotId,
}: RefinePlotInput): Promise<RefinePlotOutput> {
  try {

    const story = await Story.findOne({
      _id: storyId,
      plot: plotId,
    }).populate(["character", "theme", "world", "plot"]);

    if (!story) throw new Error("Story not found");
    if (!story.theme) throw new Error("No Theme associated with the story");
    if (!story.world) throw new Error("World not associated with the story");
    if (!story.character)
      throw new Error("Character not associated with the story");
    if (!story.plot) throw new Error("No Theme associated with the story");

    if (story.save_status.plot) {
      throw new Error("Plot already saved. Cannot be refined");
    }

    const plot = await Plot.findById({ _id: plotId });

    if (!plot) {
      throw new Error("No story character found");
    }

    const PLOT_PROMPT = PLOT_WEAVER_PROMPT({
      THEME: story.theme,
      WORLD: story.world,
      CHARACTER: story.character
    });
    const { chain: llm_chain } = createChatbot(storyId, PLOT_PROMPT);
    const output = await llm_chain.invoke({
      input: await REFINE_PROMPT.format({
        context: plot?.details,
        instruction: prompt,
      }),
    });

    console.log("============== PLOT OUTPUT ==================");
    console.log(JSON.parse(JSON.stringify(output)));

    plot.details = JSON.parse(JSON.stringify(output)).response;

    await plot.save()

    return {
      plotId: plot._id.toString(),
      plot_details: JSON.parse(plot.details),
    };
  } catch (error: unknown) {
    console.error("Error refining plot:", error);
    throw new Error(`Failed to refine plot: ${(error as any).message}`);
  }
}

// Save Plot
interface SavePlotInput {
  userId: string;
  storyId: string;
  plotId: string;
}

export async function savePlot({
  userId,
  storyId,
  plotId,
}: SavePlotInput): Promise<void> {
  try {
    const story = await Story.findOneAndUpdate(
      { _id: storyId, plot: plotId },
      { "save_status.plot": true },
      { new: true }
    );
    if (!story) throw new Error("Plot not found");

    // You can implement any logic you want for saving a plot
    console.log("Plot saved successfully for story:", story._id);
  } catch (error: unknown) {
    console.error("Error saving plot:", error);
    throw new Error(`Failed to save plot: ${(error as any).message}`);
  }
}
