import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import TaskListPage from "./pages/TaskListPage";
import AddTaskPage from "./pages/AddTaskPage";



const App = () => (
  <BrowserRouter>
    <SignedIn>
      <Main />
    </SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </BrowserRouter>
);
function Main() {
  const { user } = useUser();
  const username = user?.username;
  return (
    <div>
      <div className="bg-[#ACE2E1] p-4">
        <header className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold mr-4">
            Hello, {user?.firstName}
            <UserButton />
          </span>
          <span className="text-3xl font-bold"> To-Do List</span>
          <Link
            to="/add-task"
            className="inline-block px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 ml-4"
          >
            Add Task
          </Link>
        </header>
      </div>

      <Routes>
        <Route path="/" element={<TaskListPage username={username} />} />
        <Route path="/add-task" element={<AddTaskPage username={username} />} />
      </Routes>
    </div>
  );
}

export default App;
