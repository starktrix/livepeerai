import { Request, Response } from "express";
import { Story } from "../model";
import { Types } from "mongoose";
import { IStory } from "../model/story";
import { ITheme } from "../model/theme";

// Define the structure of a populated plot
interface PopulatedPlot {
  details?: string;
}

// Extend IStory to include the populated plot type
interface StoryWithPopulatedPlot extends Omit<IStory, "plot" | "_id"> {
  _id?: Types.ObjectId;
  storyId: Types.ObjectId;
  plot?: PopulatedPlot;
}

// Get all stories for the logged-in user
export async function getAllStoriesController(req: Request, res: Response) {
  try {
    const { userId } = req.user; // Extract userId from req.user

    // Validate userId
    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).json({ success: false, message: "Invalid user ID" });
      return;
    }

    // Fetch stories with populated plot
    const stories = await Story.find({ userId })
      .select("-sessionId -messages -createdAt -updatedAt -__v") // Exclude fields
      .populate<{ plot: PopulatedPlot }>({
        path: "plot",
        select: "-_id", // Exclude the _id field
      })
      .lean<StoryWithPopulatedPlot[]>(); // Convert documents to plain objects

    // Preprocess plot details
    stories.forEach((story) => {
      // Check if _id exists before renaming and deleting it
      if (story._id != null) {
        story.storyId = story._id;
        delete story._id;
      }

      if (story.plot?.details) {
        try {
          story.plot.details = JSON.parse(story.plot.details); // Parse plot details
        } catch (error) {
          console.error("Error parsing plot details:", error);
        }
      }
    });

    // Return the processed stories
    res.status(200).json({ success: true, data: stories });
    return;
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
    return;
  }
}

// Get a specific story by ID (owned by the user)
export async function getStoryByIdController(req: Request, res: Response) {
  try {
    const { userId } = req.user; // Extract userId from req.user
    const { storyId } = req.params; // Extract storyId from request params

    // Validate userId and storyId
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(storyId)) {
      res.status(400).json({ success: false, message: "Invalid ID" });
      return;
    }

    // Fetch the specific story by ID, owned by the authenticated user
    const story = await Story.findOne({ _id: storyId, userId })
      .select("-messages -sessionId -createdAt -updatedAt -__v") // Exclude specific fields
      .populate<{ plot: PopulatedPlot }>({
        path: "plot",
        select: "-_id", // Exclude the _id field from the plot
      })
      .lean<StoryWithPopulatedPlot | null>(); // Ensure plain object or null if not found

    // Check if the story exists
    if (!story) {
      res.status(404).json({ success: false, message: "Story not found" });
      return;
    }

    // Check if _id exists before renaming and deleting it
    if (story._id != null) {
      story.storyId = story._id;
      delete story._id;
    }
    // Preprocess plot details if available
    if (story.plot?.details) {
      try {
        story.plot.details = JSON.parse(story.plot.details); // Parse plot details
      } catch (error) {
        console.error("Error parsing plot details:", error);
        res
          .status(404)
          .json({ success: false, message: "error parsing plot details" });
        return;
      }
    }

    // Return the found story
    res.status(200).json({ success: true, data: story });
    return;
  } catch (error) {
    console.error("Error fetching story by ID:", error);
    res.status(500).json({
      success: false,
      message: `Internal Server Error: ${(error as any).message}`,
    });
    return;
  }
}

// Define the structure of a populated theme
interface PopulatedTheme {
  _id?: Types.ObjectId;
  details?: string; // Add details as optional
}

// Extend the IStory interface to include additional properties
interface StoryWithPopulatedTheme extends Omit<IStory, "theme" | "_id"> {
  _id?: Types.ObjectId;
  storyId: Types.ObjectId; // Add storyId as a new property
  themeId: Types.ObjectId;
  theme?: PopulatedTheme; // Keep the theme as an optional property
}

// Get all themes for the logged-in user
export async function getAllThemesController(req: Request, res: Response) {
  try {
    const { userId } = req.user; // Extract userId from req.user

    // Validate userId
    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).json({ success: false, message: "Invalid user ID" });
      return;
    }

    // Fetch stories with populated theme
    const stories = await Story.find({ userId })
      //   .select("-__v -sessionId -messages -createdAt -updatedAt -branch -timeline_origin -save_status") // Exclude fields
      .select("_id theme") // Exclude fields
      .populate<{ theme: PopulatedTheme }>({
        path: "theme",
        select: "_id details", // Include _id and details from theme
      })
      .lean<StoryWithPopulatedTheme[]>(); // Convert documents to plain objects

    // Modify each story to rename fields and handle optional properties
    stories.forEach((story) => {
      // Rename _id to storyId and delete original _id
      if (story._id) {
        story.storyId = story._id; // Create storyId
        delete story._id; // Remove original _id
      }

      // If theme exists, handle its details
      if (story.theme) {
        if (story.theme._id != null) {
          story.themeId = story.theme._id; // Rename theme _id to themeId
          delete story.theme._id; // Remove original _id from theme
        }

        // Check for details and parse if it exists
        if (story.theme.details) {
          try {
            story.theme = JSON.parse(story.theme.details); // Parse theme details
          } catch (error) {
            console.error("Error parsing theme details:", error);
            throw new Error("Error parsing theme details");
          }
        }
      }
    });

    // Return the processed themes
    res.status(200).json({ success: true, data: stories });
    return;
  } catch (error) {
    console.error("Error fetching themes:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
    return;
  }
}

// Define the structure of the response with populated theme
interface ThemeResponse {
  storyId: Types.ObjectId;
  themeId: Types.ObjectId; // Rename _id to themeId
  theme: Record<any, any>;
}

// Get a specific theme by story ID (owned by the user)
export async function getThemeByStoryIdController(req: Request, res: Response) {
  try {
    const { userId } = req.user; // Extract userId from req.user
    const { storyId } = req.params; // Get story ID from request parameters

    // Validate userId and storyId
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(storyId)) {
      res
        .status(400)
        .json({ success: false, message: "Invalid user ID or story ID" });
      return;
    }

    // Fetch the story for the authenticated user with populated theme
    const story = await Story.findOne({ userId, _id: storyId })
      .select("_id theme") // Exclude fields
      .populate<{ theme: ITheme }>({
        path: "theme",
        select: "_id details", // Include _id and details from theme
      }) // Populate theme with all fields and type it
      .lean(); // Convert document to a plain object

    // Check if the story exists and has a theme
    if (!story || !story.theme) {
      res
        .status(404)
        .json({ success: false, message: "Story or theme not found" });
      return;
    }

    // Create the response object
    const theme: ThemeResponse = {
      storyId: story._id, // Retain original story _id as storyId
      themeId: story.theme._id, // Rename _id to themeId
      theme: JSON.parse(story.theme.details), // Include the transformed theme object
    };

    // Return the processed theme
    res.status(200).json({ success: true, data: theme });
    return;
  } catch (error) {
    console.error("Error fetching theme by story ID:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
    return;
  }
}
// Define the structure of a populated world
interface PopulatedWorld {
  _id?: Types.ObjectId;
  details?: string; // Add details as optional
}

// Extend the IStory interface to include additional properties
interface StoryWithPopulatedWorld extends Omit<IStory, "world" | "_id"> {
  _id?: Types.ObjectId;
  storyId: Types.ObjectId; // Add storyId as a new property
  worldId: Types.ObjectId; // Add worldId as a new property
  world?: PopulatedWorld; // Keep the world as an optional property
}

// Get all worlds for the logged-in user
export async function getAllWorldsController(req: Request, res: Response) {
  try {
    const { userId } = req.user; // Extract userId from req.user

    // Validate userId
    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).json({ success: false, message: "Invalid user ID" });
      return;
    }

    // Fetch stories with populated world
    const stories = await Story.find({ userId })
      .select("_id world") // Include only _id and world
      .populate<{ world: PopulatedWorld }>({
        path: "world",
        select: "_id details", // Include _id and details from world
      })
      .lean<StoryWithPopulatedWorld[]>(); // Convert documents to plain objects

    // Modify each story to rename fields and handle optional properties
    stories.forEach((story) => {
      // Rename _id to storyId and delete original _id
      if (story._id) {
        story.storyId = story._id; // Create storyId
        delete story._id; // Remove original _id
      }

      // If world exists, handle its details
      if (story.world) {
        if (story.world._id != null) {
          story.worldId = story.world._id; // Rename world _id to worldId
          delete story.world._id; // Remove original _id from world
        }

        // Check for details and parse if it exists
        if (story.world.details) {
          try {
            story.world = JSON.parse(story.world.details).world_setting; // Parse world details
          } catch (error) {
            console.error("Error parsing world details:", error);
            throw new Error("Error parsing world details");
          }
        }
      }
    });

    // Return the processed worlds
    res.status(200).json({ success: true, data: stories });
    return;
  } catch (error) {
    console.error("Error fetching worlds:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
    return;
  }
}

// Define the structure of the response with populated world
interface WorldResponse {
  storyId: Types.ObjectId;
  worldId: Types.ObjectId; // Rename _id to worldId
  world: Record<any, any>; // This will hold the world details
}

// Get a specific world by story ID (owned by the user)
export async function getWorldByStoryIdController(req: Request, res: Response) {
  try {
    const { userId } = req.user; // Extract userId from req.user
    const { storyId } = req.params; // Get story ID from request parameters

    // Validate userId and storyId
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(storyId)) {
      res
        .status(400)
        .json({ success: false, message: "Invalid user ID or story ID" });
      return;
    }

    // Fetch the story for the authenticated user with populated world
    const story = await Story.findOne({ userId, _id: storyId })
      .select("_id world") // Exclude fields
      .populate<{ world: PopulatedWorld }>({
        path: "world",
        select: "_id details", // Include _id and details from world
      }) // Populate world with specified fields
      .lean(); // Convert document to a plain object

    // Check if the story exists and has a world
    if (!story || !story.world) {
      res
        .status(404)
        .json({ success: false, message: "Story or world not found" });
      return;
    }

    // Create the response object
    const world: WorldResponse = {
      storyId: story._id, // Retain original story _id as storyId
      worldId: story.world._id as Types.ObjectId, // Rename _id to worldId
      world: story.world.details
        ? JSON.parse(story.world.details).world_setting
        : {}, // Include the transformed world object
    };

    // Return the processed world
    res.status(200).json({ success: true, data: world });
    return;
  } catch (error) {
    console.error("Error fetching world by story ID:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
    return;
  }
}

// Define the structure of a populated character
interface PopulatedCharacter {
  _id?: Types.ObjectId;
  details?: string; // Add details as optional
}

// Extend the IStory interface to include additional properties
interface StoryWithPopulatedCharacter
  extends Omit<IStory, "character" | "_id"> {
  _id?: Types.ObjectId;
  storyId: Types.ObjectId; // Add storyId as a new property
  characterId: Types.ObjectId;
  character?: PopulatedCharacter; // Keep characters as an optional array of PopulatedCharacter
}

// Get all characters for the logged-in user
export async function getAllCharactersController(req: Request, res: Response) {
  try {
    const { userId } = req.user; // Extract userId from req.user

    // Validate userId
    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).json({ success: false, message: "Invalid user ID" });
      return;
    }

    // Fetch stories with populated characters
    const stories = await Story.find({ userId })
      .select("_id character") // Exclude fields, only include _id and characters
      .populate<{ character: PopulatedCharacter[] }>({
        path: "character",
        select: "_id details", // Include _id and details from characters
      })
      .lean<StoryWithPopulatedCharacter[]>(); // Convert documents to plain objects

    // Modify each story to rename fields and handle optional properties
    stories.forEach((story) => {
      // Rename _id to storyId and delete original _id
      if (story._id) {
        story.storyId = story._id; // Create storyId
        delete story._id; // Remove original _id
      }

      // If characters exist, process each character
      if (story.character) {
        if (story.character._id != null) {
          story.characterId = story.character._id; // Rename character _id to characterId
          delete story.character._id; // Remove original _id from character
        }

        // Check for details and parse if it exists
        if (story.character.details) {
          try {
            story.character = JSON.parse(story.character.details).characters; // Parse character details
          } catch (error) {
            console.error("Error parsing character details:", error);
            throw new Error("Error parsing character details");
          }
        }
      }
    });

    // Return the processed characters
    res.status(200).json({ success: true, data: stories });
    return;
  } catch (error) {
    console.error("Error fetching characters:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
    return;
  }
}

// Define the structure of the response with populated character
interface CharacterResponse {
  storyId: Types.ObjectId;
  characterId: Types.ObjectId; // Rename _id to characterId
  characters: Record<any, any>; // Include character details
}

// Get a specific character by story ID (owned by the user)
export async function getCharacterByStoryIdController(
  req: Request,
  res: Response
) {
  try {
    const { userId } = req.user; // Extract userId from req.user
    const { storyId } = req.params; // Get story ID from request parameters

    // Validate userId and storyId
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(storyId)) {
      res
        .status(400)
        .json({ success: false, message: "Invalid user ID or story ID" });
      return;
    }

    // Fetch the story for the authenticated user with populated character
    const story = await Story.findOne({ userId, _id: storyId })
      .select("_id character") // Exclude fields
      .populate<{ character: PopulatedCharacter }>({
        path: "character",
        select: "_id details", // Include _id and details from characters
      }) // Populate characters with specified fields
      .lean(); // Convert document to a plain object

    // Check if the story exists and has characters
    if (!story || !story.character) {
      res
        .status(404)
        .json({ success: false, message: "Story or character not found" });
      return;
    }

    // Create the response object for the first character (you can modify this if needed)
    const characters: CharacterResponse = {
      storyId: story._id as Types.ObjectId, // Retain original story _id as storyId
      characterId: story.character._id as Types.ObjectId, // Rename _id to characterId
      characters: story.character.details
        ? JSON.parse(story.character.details).characters
        : {}, // Include the transformed character object
    };

    // Return the processed character
    res.status(200).json({ success: true, data: characters });
    return;
  } catch (error) {
    console.error("Error fetching character by story ID:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
    return;
  }
}

// Define the structure of a populated plot
interface PopulatedPlot {
  _id?: Types.ObjectId;
  details?: string; // Add details as optional
}

interface StoryWithPopulatedPlot
  extends Omit<IStory, "plot" | "_id"> {
  _id?: Types.ObjectId;
  storyId: Types.ObjectId; // Add storyId as a new property
  plotId: Types.ObjectId;
  plot?: PopulatedPlot;
}

// Get all plots (public access)
export async function getAllPlotsController(req: Request, res: Response) {
  try {
    // Fetch all plots from the database
    const stories = await Story.find({}) // Assuming a field to filter public plots
      .select("_id plot") // Exclude fields, only include _id and details
      .populate<{ plot: PopulatedPlot[] }>({
        path: "plot",
        select: "_id details",
      })
      .lean<StoryWithPopulatedPlot[]>(); // Convert documents to plain objects

    // Check if plots exist
    if (!stories || stories.length === 0) {
       res
        .status(404)
            .json({ success: false, message: "No stories or plots found" });
            return
    }

    // Modify each plot to rename fields and handle optional properties
      stories.forEach((story) => {
          if (story._id) {
              story.storyId = story._id;
              delete story._id
        }

          if (story.plot) {
              if (story.plot._id != null) {
                  story.plotId = story.plot._id
                  delete story.plot._id
              }
              
              if (story.plot.details) {
                try {
                    story.plot = JSON.parse(story.plot.details) // Parse plot details
                  } catch (error) {
                    console.error("Error parsing plot details:", error);
                    throw new Error("Error parsing plot details");
                  }
              }
      }
    });

    // Return the processed plots
    res.status(200).json({ success: true, data: stories });
    return;
  } catch (error) {
    console.error("Error fetching plots:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
    return;
  }
}

// Define the structure of the response with populated plot
interface PlotResponse {
    storyId: Types.ObjectId;
    plotId: Types.ObjectId; // Rename _id to plotId
    plot: Record<any, any>; // Include plot details
  }
  
  // Get a specific plot by story ID (public access)
  export async function getPlotByStoryIdController(req: Request, res: Response) {
    try {
      const { storyId } = req.params; // Get story ID from request parameters
  
      // Validate storyId
      if (!Types.ObjectId.isValid(storyId)) {
          res.status(400).json({ success: false, message: "Invalid story ID" });
          return
      }
  
      // Fetch the plot for the specified story ID
      const story = await Story.findOne({ _id: storyId }) // Assuming a field to filter public plots
          .select("_id plot")
          .populate<{ plot: PopulatedPlot }>({
              path: "plot",
              select: "_id details"
        })  // Exclude fields, only include _id and details
        .lean(); // Convert document to a plain object
  
      // Check if the plot exists
      if (!story || !story.plot) {
          res.status(404).json({ success: false, message: "no story plot found" });
          return
      }
  
      // Create the response object for the plot
      const plotResponse: PlotResponse = {
        storyId: story._id as Types.ObjectId, // Retain original story ID
        plotId: story.plot._id as Types.ObjectId, // Rename _id to plotId
        plot: story.plot.details ? JSON.parse(story.plot.details) : {}, // Include the transformed plot object
      };
  
      // Return the processed plot
      res.status(200).json({ success: true, data: plotResponse });
      return;
    } catch (error) {
      console.error("Error fetching plot by story ID:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
      return;
    }
  }

// Get all visuals (public access)
export async function getAllVisualsController(req: Request, res: Response) {
  // TODO: Implement logic to fetch all visuals for public access
}

// Get a specific visual by story ID (public access)
export async function getVisualByStoryIdController(
  req: Request,
  res: Response
) {
  // TODO: Implement logic to fetch a specific visual by story ID for public access
}
