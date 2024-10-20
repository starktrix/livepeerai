import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IPlotDetail {
  plot: string;
  episode: string;
  scene: string;
  act: string;
}

interface IPlot extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  themeId: Types.ObjectId;
  worldId: Types.ObjectId;
  characterId: Types.ObjectId;
  // details: IPlotDetail[];
  details: string;
  branch?: boolean;
  plot_origin?: Types.ObjectId;
}

const PlotSchema: Schema<IPlot> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    themeId: { type: Schema.Types.ObjectId, ref: "Theme", required: true },
    worldId: { type: Schema.Types.ObjectId, ref: "World", required: true },
    characterId: {
      type: Schema.Types.ObjectId,
      ref: "Character",
      required: true,
    },
    // details: [
    //   {
    //     plot: { type: String, required: true },
    //     episode: { type: String, required: true },
    //     scene: { type: String, required: true },
    //     act: { type: String, required: true },
    //   },
    // ],
    details: { type: String },
    branch: { type: Boolean, default: false },
    plot_origin: { type: Schema.Types.ObjectId, ref: "Plot" },
  },
  { timestamps: true }
);

const Plot: Model<IPlot> = mongoose.model("Plot", PlotSchema);
export default Plot;
