import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface ICharacterInfo {
  name: string;
  details: string;
}

interface ICharacter extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  themeId: Types.ObjectId;
  worldId: Types.ObjectId;
  // details: ICharacterInfo[];
  details: string;
}

const CharacterSchema: Schema<ICharacter> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    themeId: { type: Schema.Types.ObjectId, ref: "Theme", required: true },
    worldId: { type: Schema.Types.ObjectId, ref: "World", required: true },
    // details: [
    //   {
    //     name: { type: String, required: true },
    //     details: { type: String, required: true },
    //   },
    // ],
    details: { type: String },
  },
  { timestamps: true }
);

const Character: Model<ICharacter> = mongoose.model(
  "Character",
  CharacterSchema
);
export default Character;
