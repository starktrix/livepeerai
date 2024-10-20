import mongoose, { Schema, Document, Types, Model } from 'mongoose';

export interface ITheme extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    details: string;
  }
  
  const ThemeSchema: Schema<ITheme> = new Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      details: { type: String, required: true },
    },
    { timestamps: true }
  );
  
  const Theme: Model<ITheme> = mongoose.model('Theme', ThemeSchema);
  export default Theme;
  