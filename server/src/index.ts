import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { User, IUserModel } from './models/User.js';
import { Task, ITaskModel } from './models/Task.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;
let uri: string
if (process.env.MONGODB_URI) {
  uri = process.env.MONGODB_URI
} else {
  throw new Error("URI not defined")
};
let baseurl: string

if (process.env.BASE_URL) {
  baseurl = process.env.BASE_URL
} else {
  throw new Error("URI not defined")
};

// Middleware for parsing JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS middleware setup
app.use(cors({
    origin: [baseurl],
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    credentials: true,
}));


// Connect to MongoDB
mongoose.connect(uri)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));



// Define interfaces for request bodies
interface TaskRequestBody {
  username: string;
  task: string;
  completed: boolean;
}

// Route to create a new task
app.post('/tasks', async (req: Request<{}, {}, TaskRequestBody>, res: Response) => {
  const { username, task, completed } = req.body;
  try {
    let newUser;

    // Check if the user exists
    let user = await User.findOne({ username });

    // If user does not exist, create a new user
    if (!user) {
      newUser = await User.create({ username });
    }

    // Create the task
    const newTask = await Task.create({ username, task, completed });

    let result;

    // If a new user was created, include it in the response
    if (newUser) {
      result = { newTask, newUser };
    } else {
      result = { newTask };
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to get tasks for a specific user
app.get('/tasks/:username', async (req: Request<{ username: string }>, res: Response) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Find tasks for the user
    const tasks = await Task.find({ username });
    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to delete a task
app.delete('/tasks/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  try {
    // Find and delete the task by id
    await Task.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to update task completion status
app.patch('/tasks/:id', async (req: Request<{ id: string }, {}, { completed: boolean }>, res: Response) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    // Find and update the task by id
    const updatedTask = await Task.findByIdAndUpdate(id, { completed }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(3000, () => {
  console.log(`Server is running on port ${PORT}`);
});