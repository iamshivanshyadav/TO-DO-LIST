import mongoose, { Schema, Document } from 'mongoose';

export interface IUser {
  username: string;
}

export interface IUserModel extends Document {
  username: string;
}

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
});

export const User = mongoose.model<IUserModel>('User', userSchema);
