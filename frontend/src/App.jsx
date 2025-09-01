import { useEffect, useState } from "react";
import { api } from "./api";
import Header from "./components/layout/Header";
import CreateTask from "./components/ui/CreateTask";
import TaskList from "./components/ui/TaskList";
import { delay } from "./utils";
import AddCategory from "./components/ui/AddCategory";

export default function App() {
  // ----- state for tasks list -----
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [error, setError] = useState("");

  // Load tasks from API
  async function loadTasks() {
    try {
      setError("");
      setTasksLoading(true);
      await delay(1000);
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setTasksLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <main className="max-w-3xl mx-auto p-6 space-y-6">

        <h2 className="text-xl font-bold">Categories</h2>
        {/* Add Category Form */}
        <AddCategory setError={setError} loadTasks={loadTasks} />

        <h2 className="text-xl font-bold">Tasks</h2>
        {/* Create Form */}
        <CreateTask setError={setError} loadTasks={loadTasks} />

        {/* Errors / Loading */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3">
            {error}
          </div>
        )}
        {tasksLoading && <div className="text-gray-600">Loading…</div>}

        {/* Task List */}
        <TaskList
          tasks={tasks}
          loading={tasksLoading}
          setError={setError}
          loadTasks={loadTasks}
        />
      </main>
    </div>
  );
}
