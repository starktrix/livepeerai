import mongoose, { Schema, Document, Types, Model } from 'mongoose';

interface IWorld extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    themeId: Types.ObjectId;
    details: string;
  }
  
  const WorldSchema: Schema<IWorld> = new Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      themeId: { type: Schema.Types.ObjectId, ref: 'Theme', required: true },
      details: { type: String, required: true },
    },
    { timestamps: true }
  );
  
  const World: Model<IWorld> = mongoose.model('World', WorldSchema);
  export default World;
  