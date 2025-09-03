import useCreateCategory from "../../hooks/useCreateCategory";

export default function CreateCategory({ setError, loadCategories }) {
  const { name, saving, handleAdd, setName } = useCreateCategory(
    setError,
    loadCategories,
  );
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 shadow">
      <div className="flex-1">
        <input
          className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <button
        onClick={handleAdd}
        disabled={saving}
        className={`rounded-xl px-4 py-2 text-white ${
          saving
            ? "cursor-not-allowed bg-blue-400"
            : "cursor-pointer bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {saving ? "Adding..." : "Add"}
      </button>
    </div>
  );
}
