import { Schema, model, Document } from "mongoose";


interface User extends Document {
  _id: Schema.Types.ObjectId;
  username: string;
  email: string;
  passwordHash: string;
}

const UserSchema = new Schema<User>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserModel = model<User>("User", UserSchema);
