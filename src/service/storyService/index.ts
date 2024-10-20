import mongoose, { Types } from "mongoose";
import { Story } from "../../model";

// https://github.com/langchain-ai/langchainjs/blob/391bc4645036fd0c2c41b5ed35236919732edf2a/libs/langchain-mongodb/src/chat_history.ts#L11

// Input Interface for createStory
interface CreateStoryInput {
  userId: string;
}

// createStory Function
export async function createStory({ userId }: CreateStoryInput): Promise<string> {
  try {
    // Create the initial Story with all references
    const story = await new Story({
      userId,
    }).save();

    // Step 2: Use the created story's ID as the sessionId
    story.sessionId = story._id;

    // Step 3: Save the updated story with the sessionId
    await story.save();

    return story._id.toString();

    console.log("Story successfully created:", story);
  } catch (error) {
    console.error("Error creating story:", error);
    throw new Error("Failed to create story.");
  }
}
