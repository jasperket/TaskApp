import useCreateCategory from "../../hooks/useCreateCategory";

export default function AddCategory({setError, loadTasks}) {
    const {name, saving, handleAdd, setName} = useCreateCategory(setError, loadTasks);
  return (
    <form
      onSubmit={handleAdd}
      className="flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 shadow"
    >
      <div className="min-w-56 flex-1">
        <label className="mb-1 block text-sm text-gray-600">Name *</label>
        <input
          className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Learn CRUD"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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