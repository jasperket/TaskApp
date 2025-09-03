import useDeleteCategory from "../../hooks/useDeleteCategory";
import useEditCategory from "../../hooks/useEditCategory";
import DeleteBtn from "./DeleteBtn";
import clsx from "clsx";

export default function CategoryList({
  categories = [],
  loading,
  setError,
  loadCategories,
  loadTasks,
  setCategoryId,
  setIsOpen,
}) {
  const {
    editId,
    editName,
    setEditName,
    updating,
    startEdit,
    saveEdit,
    cancelEdit,
  } = useEditCategory(setError, loadCategories, loadTasks);

  const { deleteBusyId, remove } = useDeleteCategory(
    setError,
    loadCategories,
    loadTasks,
  );

  function handleSelectCategory(categoryId) {
    setCategoryId(categoryId);
    setIsOpen(false);
  }

  return (
    <ul className="relative divide-y divide-gray-100 rounded-t-2xl bg-white shadow">
      {/* Display if no category */}
      {categories.length === 0 && !loading && (
        <li className="p-8 text-center text-gray-500">
          <div className="text-lg font-medium">No categories yet</div>
          <div className="text-sm">
            Add your first category using the form below.
          </div>
        </li>
      )}

      {/* Display each category */}
      {categories.length > 0 &&
        categories.map((category) => {
          const isEditing = editId === category.id;
          const rowBusy = deleteBusyId === category.id;

          return (
            <li
              key={category.id}
              className="relative flex items-center gap-3 p-4"
            >
              {!isEditing && (
                <span
                  className="absolute inset-0 cursor-pointer hover:bg-gray-100/50"
                  onClick={handleSelectCategory.bind(null, category.id)}
                ></span>
              )}
              {/* Content area */}
              <div className="flex-1">
                {!isEditing ? (
                  <>
                    <div className={`font-medium`}>{category.name}</div>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    <input
                      className="w-full flex-1 rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Title"
                      disabled={updating}
                    />
                  </div>
                )}
              </div>
              {/* Right-side actions */}
              {!isEditing ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      startEdit(category);
                    }}
                    disabled={rowBusy}
                    className={`isolate cursor-pointer rounded-lg px-3 py-1 text-gray-700 ${
                      rowBusy
                        ? "cursor-not-allowed bg-gray-200"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (confirm(`Delete "${category.name}"?`)) {
                        remove(category.id);
                      }
                    }}
                    disabled={rowBusy}
                    className={clsx("isolate rounded-lg px-3 py-1 text-white", {
                      "cursor-not-allowed bg-red-700": rowBusy,
                      "cursor-pointer bg-red-600 hover:bg-red-700": !rowBusy,
                    })}
                    aria-label={`Delete ${category.title}`}
                  >
                    {deleteBusyId === category.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      saveEdit(category);
                    }}
                    className={`${updating ? "cursor-not-allowed" : "cursor-pointer"} rounded-lg bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:bg-blue-400`}
                    disabled={updating}
                  >
                    {updating ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className={`${updating ? "cursor-not-allowed" : "cursor-pointer"} rounded-lg bg-gray-100 px-3 py-1 text-gray-700 hover:bg-gray-200`}
                    disabled={updating}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </li>
          );
        })}
    </ul>
  );
}
