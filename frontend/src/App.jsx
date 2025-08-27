import { useEffect, useState } from "react";
import { api } from "./api";
import Header from "./components/layout/Header";
import CreateTask from "./components/ui/CreateTask";
import TaskList from "./components/ui/TaskList";
import { delay } from "./utils";

export default function App() {
  // ----- state for list -----
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load tasks from API
  async function loadTasks() {
    try {
      setError("");
      setLoading(true);
      await delay(1000);
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <main className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Create Form */}
        <CreateTask setError={setError} loadTasks={loadTasks} />

        {/* Errors / Loading */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3">
            {error}
          </div>
        )}
        {loading && <div className="text-gray-600">Loading…</div>}

        {/* Task List */}
        <TaskList
          tasks={tasks}
          loading={loading}
          setError={setError}
          loadTasks={loadTasks}
        />
      </main>
    </div>
  );
}
