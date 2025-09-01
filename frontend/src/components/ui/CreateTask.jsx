import useCreateTask from "../../hooks/useCreateTask";

export default function CreateTask({ setError, loadTasks, categories }) {
  const { title, dueDate, saving, handleAdd, setTitle, setDueDate, estimatedHours, setEstimatedHours, categoryId, setCategoryId } =
    useCreateTask(setError, loadTasks);
  return (
    <form
      onSubmit={handleAdd}
      className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow"
    >
      <div className="flex flex-1 gap-4">
        <div className="min-w-56 flex-1">
          <label className="mb-1 block text-sm text-gray-600">Title *</label>
          <input
            className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Learn CRUD"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm text-gray-600">Category *</label>
          <select
            className="rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select a category</option>
            {/* Category Loading */}
            {categories.length === 0 && <option>Loading…</option>}
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-sm text-gray-600">Due date</label>
          <input
            type="date"
            className="rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm text-gray-600">Estimated hours</label>
          <input
            type="number"
            className="rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={estimatedHours}
            onChange={(e) => setEstimatedHours(e.target.value)}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={saving}
        className={`rounded-xl px-4 py-2 text-white ${
          saving
            ? "cursor-not-allowed bg-blue-400"
            : "cursor-pointer bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {saving ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
