import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import Header from "./components/layout/Header";
import CreateTask from "./components/ui/CreateTask";
import TaskList from "./components/ui/TaskList";
import { delay } from "./utils";
import ExportButton from "./components/ui/ExportButton";
import "./App.css";
import SelectCategory from "./components/ui/SelectCategory";

export default function App() {
  // ----- state for tasks list -----
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState([]);

  // ----- state for categories list -----
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  // ----- state for filtering by category -----
  const [categoryId, setCategoryId] = useState(0);

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

  function handleCategoryChange(e) {
    setCategoryId(parseInt(e.target.value));
  }

  const filteredTasks = useMemo(() => {
    if (categoryId === 0) return tasks;
    return tasks.filter((t) => t.categoryId === parseInt(categoryId));
  }, [tasks, categoryId]);

  useEffect(() => {
    loadCategories();
    loadTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <ExportButton
        tasks={filteredTasks}
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
            {filteredTasks.length !== 0 && (
              <div className="mb-2 flex w-fit items-center gap-2 p-2">
                <p>Filter:</p>
                <select
                  name="category"
                  id="category"
                  onChange={handleCategoryChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="0">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <TaskList
              tasks={filteredTasks}
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
