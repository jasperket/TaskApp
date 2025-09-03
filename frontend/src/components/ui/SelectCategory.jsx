import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import CategoryList from "./CategoryList";

export default function SelectCategory({
  categoryId,
  setCategoryId,
  categories,
  loadTasks,
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <div
        className={`flex w-full items-center justify-between rounded-xl border border-gray-300 px-3 py-2 outline-none ${isOpen && "ring-2 ring-blue-500"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <p>
          {categoryId !== 0
            ? categories.find((c) => c.id === categoryId)?.name
            : "Select a category"}
        </p>
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-xl border border-gray-300 bg-white shadow">
          <CategoryList
            categories={categories}
            loading={false}
            setError={() => {}}
            loadTasks={loadTasks}
            setCategoryId={setCategoryId}
          />
        </div>
      )}
    </div>
  );
}
