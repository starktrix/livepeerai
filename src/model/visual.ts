import { Schema, Document, Types, model } from "mongoose";

interface VisualItem {
    image_url: string;
    episode: number;
    scene: number;
    act: number;
  }
  
  interface Visual extends Document {
    _id: Types.ObjectId;
    visuals: VisualItem[];
    video_url?: string;
  }

const VisualSchema = new Schema<Visual>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    visuals: {
      image_url: { type: String, required: true },
      episode: { type: Number, required: true },
      scene: { type: Number, required: true },
      act: { type: Number, required: true },
    },
    video_url: { type: String },
  },
  { timestamps: true }
);

// Add unique index for the combination of episode, scene, and act.
VisualSchema.index({ "visuals.episode": 1, "visuals.scene": 1, "visuals.act": 1 }, { unique: true });

export const VisualModel = model<Visual>("Visual", VisualSchema);
