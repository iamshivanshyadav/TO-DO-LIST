import React, { useState, useEffect } from "react";
import axios from "axios";

interface Task {
  _id: string;
  task: string;
  completed: boolean;
}

interface TaskListPageProps {
  username: string;
}
const URL = import.meta.env.VITE_SERVER_URL;
const TaskListPage: React.FC<TaskListPageProps> = ({ username }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<Task[]>(
          `${URL}/tasks/${username}`
        );
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [username]);

  const toggleTaskStatus = async (taskId: string, completed: boolean) => {
    try {
      await axios.patch(`${URL}/tasks/${taskId}`, {
        completed: !completed,
      });
      const updatedTasks = tasks.map((task) => {
        if (task._id === taskId) {
          return { ...task, completed: !completed };
        }
        return task;
      });
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await axios.delete(`${URL}/tasks/${taskId}`);
      const updatedTasks = tasks.filter((task) => task._id !== taskId);
      setTasks(updatedTasks);
      alert("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Filter tasks based on completion status
  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Task List</h1>

      <div>
        <h2 className="text-xl font-bold mb-2 text-center">Pending Tasks</h2>
        {pendingTasks.length === 0 ? (
          <p className="text-lg font-semibold mb-2 text-center">
            No pending tasks
          </p>
        ) : (
          <ul className="w-3/5 mx-auto">
            {pendingTasks.map((task) => (
              <li
                key={task._id}
                className="border rounded-md p-4 mb-4 flex justify-between items-center shadow bg-[#f6f6f6] text-basic font-semibold"
              >
                <span className={task.completed ? "line-through" : ""}>
                  {task.task}
                </span>
                <div>
                  <button
                    className={`px-4 py-2 rounded-md ${
                      task.completed ? "bg-gray-500" : "bg-green-500"
                    } text-white mr-2`}
                    onClick={() => toggleTaskStatus(task._id, task.completed)}
                  >
                    {task.completed ? "Mark Incomplete" : "Mark Complete"}
                  </button>
                  <button
                    className="px-4 py-2 rounded-md bg-red-500 text-white"
                    onClick={() => deleteTask(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2 text-center">Completed Tasks</h2>
        {completedTasks.length === 0 ? (
          <p className="text-lg font-semibold mb-2 text-center">
            No completed tasks
          </p>
        ) : (
          <ul className="w-3/5 mx-auto">
            {completedTasks.map((task) => (
              <li
                key={task._id}
                className="border rounded-md p-4 mb-4 flex justify-between items-center shadow bg-[#f6f6f6] text-basic font-semibold"
              >
                <span className={task.completed ? "line-through" : ""}>
                  {task.task}
                </span>
                <div>
                  <button
                    className={`px-4 py-2 rounded-md ${
                      task.completed ? "bg-gray-500" : "bg-green-500"
                    } text-white mr-2`}
                    onClick={() => toggleTaskStatus(task._id, task.completed)}
                  >
                    {task.completed ? "Mark Incomplete" : "Mark Complete"}
                  </button>
                  <button
                    className="px-4 py-2 rounded-md bg-red-500 text-white"
                    onClick={() => deleteTask(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskListPage;
