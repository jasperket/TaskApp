import clsx from "clsx";

export default function DeleteBtn({
  task,
  rowBusy,
  deleteBusyId,
  remove,
  className,
}) {
  return (
    <button
      onClick={() => {
        if (confirm(`Delete "${task.title}"?`)) remove(task.id);
      }}
      disabled={rowBusy}
      className={clsx(
        "rounded-lg px-3 py-1 text-gray-700",
        {
          "cursor-not-allowed bg-red-200": rowBusy,
          "cursor-pointer bg-red-100 hover:bg-red-200": !rowBusy,
        },
        className,
      )}
      aria-label={`Delete ${task.title}`}
    >
      {deleteBusyId === task.id ? "Deleting..." : "Delete"}
    </button>
  );
}
