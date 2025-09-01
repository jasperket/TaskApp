import { useEffect, useState } from "react";
import { api } from "./api";
import Header from "./components/layout/Header";
import CreateTask from "./components/ui/CreateTask";
import TaskList from "./components/ui/TaskList";
import { delay } from "./utils";
import CreateCategory from "./components/ui/CreateCategory";
import CategoryList from "./components/ui/CategoryList";

export default function App() {
  // ----- state for tasks list -----
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState("");

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
      <main className="max-w-3xl mx-auto p-6 space-y-6">

        <h2 className="text-xl font-bold">Categories</h2>
        {/* Add Category Form */}
        <CreateCategory setError={setCategories} loadTasks={loadTasks} />

        {/* Category Errors / Loading */}
        {categoriesError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3">
            {categoriesError}
          </div>
        )}
        {categoriesLoading && <div className="text-gray-600">Loading…</div>}

        <CategoryList categories={categories} loading={categoriesLoading} setError={setCategoriesError} loadCategories={loadCategories} />

        <h2 className="text-xl font-bold">Tasks</h2>
        {/* Create Form */}
        <CreateTask setError={setTasksError} loadTasks={loadTasks} categories={categories} />

        {/* Task Errors / Loading */}
        {tasksError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3">
            {tasksError}
          </div>
        )}
        {tasksLoading && <div className="text-gray-600">Loading…</div>}

        {/* Task List */}
        <TaskList
          tasks={tasks}
          loading={tasksLoading}
          setError={setTasksError}
          loadTasks={loadTasks}
        />
      </main>
    </div>
  );
}
