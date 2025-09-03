import { useEffect, useState } from "react";
import { api } from "./api";
import Header from "./components/layout/Header";
import CreateTask from "./components/ui/CreateTask";
import TaskList from "./components/ui/TaskList";
import { delay } from "./utils";
import ExportButton from "./components/ui/ExportButton";
import "./App.css";

export default function App() {
  // ----- state for tasks list -----
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState([]);

  // ----- state for categories list -----
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  // Load tasks from API
  async function loadTasks() {
    try {
      setTasksError("");
      setTasksLoading(true);
      await delay(1000);
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      setTasksError(err.message || "Failed to load tasks");
    } finally {
      setTasksLoading(false);
    }
  }

  // Load categories from API
  async function loadCategories() {
    try {
      setCategoriesError("");
      setCategoriesLoading(true);
      await delay(1000);
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      setCategoriesError(err.message || "Failed to load categories");
    } finally {
      setCategoriesLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
    loadTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <ExportButton
        tasks={tasks}
        categories={categories}
        tasksLoading={tasksLoading}
      />
      <main className="mx-auto max-w-3xl space-y-6 p-6">
        <h2 className="text-xl font-bold">Tasks</h2>
        {/* Create Form */}
        <CreateTask
          setError={setTasksError}
          loadTasks={loadTasks}
          categories={categories}
          loadCategories={loadCategories}
          categoriesLoading={categoriesLoading}
        />

        {/* Category Errors / Loading */}
        {categoriesError && categoriesError.length > 0 && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">
            {categoriesError}
          </div>
        )}

        {/* Task Errors */}
        {tasksError && tasksError.length > 0 && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">
            <ul className="list-inside list-disc">
              {tasksError.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Loading state */}
        {tasksLoading ? (
          <div className="text-gray-600">Loading…</div>
        ) : (
          <>
            <TaskList
              tasks={tasks}
              loading={tasksLoading}
              setError={setTasksError}
              loadTasks={loadTasks}
              categories={categories}
              categoriesLoading={categoriesLoading}
              loadCategories={loadCategories}
            />
          </>
        )}
      </main>
    </div>
  );
}
