import mongoose, { Schema, Document } from 'mongoose';

export interface ITask {
  username: string;
  task: string;
  completed: boolean;
}

export interface ITaskModel extends Document {
  username: string;
  task: string;
  completed: boolean;
}

const taskSchema: Schema = new Schema({
  username: { type: String, required: true },
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

export const Task = mongoose.model<ITaskModel>('Task', taskSchema);
