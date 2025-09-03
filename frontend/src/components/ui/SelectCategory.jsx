import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import CategoryList from "./CategoryList";
import CreateCategory from "./CreateCategory";

export default function SelectCategory({
  categoryId,
  setCategoryId,
  categories,
  loadTasks,
  loadCategories,
  loading,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  function handleIsOpen() {
    setIsOpen(!isOpen);
  }
  return (
    <div className="relative">
      <div
        className={`flex w-full items-center justify-between rounded-xl border border-gray-300 px-3 py-2 outline-none ${isOpen && "ring-2 ring-blue-500"}`}
        onClick={handleIsOpen}
      >
        <p>
          {categoryId !== 0
            ? categories.find((c) => c.id === categoryId)?.name
            : "Select a category"}
        </p>
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full rounded-xl border border-gray-300 bg-white shadow">
          {loading ? (
            <p className="p-4">Loading…</p>
          ) : (
            <>
              {/* Category Errors / Loading */}
              {error && (
                <div className="rounded-t-xl border border-red-200 bg-red-50 p-3 text-red-700">
                  {error}
                </div>
              )}
              <CategoryList
                categories={categories}
                loadTasks={loadTasks}
                setCategoryId={setCategoryId}
                setIsOpen={handleIsOpen}
                setError={setError}
                loadCategories={loadCategories}
              />
              <CreateCategory
                setCategoryId={setCategoryId}
                loadTasks={loadTasks}
                setError={setError}
                loadCategories={loadCategories}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
