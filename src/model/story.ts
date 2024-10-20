import mongoose, { Schema, Document, Types, Model } from "mongoose";

// Story Interface
export interface IStory extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  theme: Types.ObjectId;
  world: Types.ObjectId;
  character: Types.ObjectId;
  plot: Types.ObjectId;
  visual: Types.ObjectId;
  branch?: boolean;
  timeline_origin?: Types.ObjectId[];
  save_status: {
    theme: boolean;
    world: boolean;
    character: boolean;
    plot: boolean;
  };
  // this is for langchain
  // https://www.phind.com/search?cache=yh8zd37t4t9mpeffcecjnlat
  
  sessionId: Types.ObjectId;
  messages: Record<any, any>[];
}

// Story Schema
const StorySchema: Schema<IStory> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    theme: { type: Schema.Types.ObjectId, ref: "Theme" },
    world: { type: Schema.Types.ObjectId, ref: "World" },
    character: { type: Schema.Types.ObjectId, ref: "Character" },
    plot: { type: Schema.Types.ObjectId, ref: "Plot" },
    visual: { type: Schema.Types.ObjectId, ref: "Visual" },
    branch: { type: Boolean, default: false },
    timeline_origin: [{ type: Schema.Types.ObjectId, ref: "Story" }],
    save_status: {
      theme: { type: Boolean, default: false },
      world: { type: Boolean, default: false },
      character: { type: Boolean, default: false },
      plot: { type: Boolean, default: false },
    },
    sessionId: { type: Schema.Types.ObjectId },
    messages: [{ type: Object}],
  },
  { timestamps: true }
);

// Story Model
const Story: Model<IStory> = mongoose.model<IStory>("Story", StorySchema);


// Add a virtual to preprocess plot details and remove unwanted fields
// StorySchema.set("toJSON", {
//   transform: (doc, ret) => {
//     // Remove internal MongoDB fields
//     delete ret._id;
//     delete ret.__v;
//     delete ret.sessionId;
//     delete ret.messages;
//     delete ret.createdAt;
//     delete ret.updatedAt;

//     // If plot details exist, parse them
//     if (ret.plot && ret.plot.details) {
//       try {
//         ret.plot.details = JSON.parse(ret.plot.details);
//       } catch (error) {
//         console.error("Error parsing plot details:", error);
//       }
//     }

//     return ret;
//   },
// });


// // Virtual field to preprocess plot details
// Story.schema.path("plot").schema.set("toJSON", {
//   transform: (doc, ret) => {
//     if (ret.details) {
//       try {
//         ret.details = JSON.parse(ret.details); // Parse plot.details
//       } catch (error) {
//         console.error("Error parsing plot details:", error);
//       }
//     }
//     delete ret._id; // Exclude _id from plot
//     return ret;
//   },
// });

export default Story;
