import useEditTask from "../../hooks/useEditTask";
import useDeleteTask from "../../hooks/useDeleteTask";
import DeleteBtn from "./DeleteBtn";
import { sortTasks } from "../../utils";
import SelectCategory from "./SelectCategory";

export default function TaskList({
  tasks,
  loading,
  setError,
  loadTasks,
  categories,
  categoriesLoading,
  loadCategories,
}) {
  const {
    editId,
    toggleBusyId,
    toggleDone,
    editTitle,
    setEditTitle,
    editDueDate,
    setEditDueDate,
    editCategoryId,
    setEditCategoryId,
    editEstimateHours,
    setEditEstimateHours,
    updating,
    startEdit,
    saveEdit,
    cancelEdit,
  } = useEditTask(setError, loadTasks);

  const { deleteBusyId, remove } = useDeleteTask(setError, loadTasks);

  const sorted = sortTasks(tasks);

  return (
    <ul className="relative divide-y divide-gray-100 rounded-2xl bg-white shadow">
      {/* Display if no tasks */}
      {(sorted ?? tasks).length === 0 && !loading && (
        <li className="p-8 text-center text-gray-500">
          <div className="text-lg font-medium">No tasks yet</div>
          <div className="text-sm">
            Add your first task using the form above.
          </div>
        </li>
      )}

      {/* Display each task */}
      {(sorted ?? tasks).map((task) => {
        const isEditing = editId === task.id;
        const rowBusy = toggleBusyId === task.id || deleteBusyId === task.id;
        const category = categories.find((c) => c.id === task.categoryId);
        return (
          <li key={task.id} className="relative flex items-center gap-3 p-4">
            {/* Done checkbox */}
            <input
              type="checkbox"
              className={`size-5 accent-blue-600 ${rowBusy || isEditing ? "cursor-not-allowed" : "cursor-pointer"}`}
              checked={task.isDone}
              onChange={() => toggleDone(task)}
              disabled={rowBusy || isEditing}
              aria-label={`Toggle ${task.title}`}
            />
            {/* Content area */}
            <div className="flex-1">
              {!isEditing ? (
                <>
                  <div
                    className={`font-medium ${
                      task.isDone ? "text-gray-400 line-through" : ""
                    }`}
                  >
                    {task.title}
                  </div>
                  <div className="flex gap-4">
                    {task.dueDate && (
                      <div className="text-sm text-gray-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                    {task.estimateHours > 0 && (
                      <div className="text-sm text-gray-500">
                        Estimated: {task.estimateHours} hours
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className="flex-1 rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Title"
                      disabled={updating}
                    />
                    <SelectCategory
                      categoryId={editCategoryId}
                      setCategoryId={setEditCategoryId}
                      categories={categories}
                      loadTasks={loadTasks}
                      loadCategories={loadCategories}
                      loading={categoriesLoading}
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className="flex-1 rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      disabled={updating}
                    />
                    <input
                      type="number"
                      className="flex-1 rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                      value={editEstimateHours}
                      onChange={(e) => setEditEstimateHours(e.target.value)}
                      disabled={updating}
                    />
                  </div>
                </div>
              )}
            </div>
            {/* Right-side actions */}
            {!isEditing ? (
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{category?.name}</h3>
                <button
                  onClick={() => startEdit(task)}
                  disabled={rowBusy}
                  className={`cursor-pointer rounded-lg px-3 py-1 text-gray-700 ${
                    rowBusy
                      ? "cursor-not-allowed bg-gray-200"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Edit
                </button>
                <DeleteBtn
                  task={task}
                  rowBusy={rowBusy}
                  setError={setError}
                  loadTasks={loadTasks}
                  deleteBusyId={deleteBusyId}
                  remove={remove}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => saveEdit(task)}
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
