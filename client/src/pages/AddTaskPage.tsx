// AddTaskPage.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface AddTaskPageProps {
  username: string;
}
const URL = import.meta.env.VITE_SERVER_URL;
const AddTaskPage: React.FC<AddTaskPageProps> = ({ username }) => {
  const navigate = useNavigate();
  const [task, setTask] = useState("");

  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${URL}/tasks`, {
        username,
        task,
        completed: false,
      });
      alert("Task added successfully");
      navigate("/");
      setTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="max-w-md my-10 mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Add Task</h1>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center"
      >
        <input
          type="text"
          value={task}
          onChange={handleTaskChange}
          className="w-64 px-4 py-2 mr-2 text-gray-800 placeholder-gray-500 border rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Enter task"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTaskPage;
