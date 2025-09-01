import { useState } from "react";
import { api } from "../api";
import { delay } from "../utils";

export default function useEditTask(setError, loadTasks) {
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDueDate, setEditDueDate] = useState(""); // YYYY-MM-DD
  const [editCategoryId, setEditCategoryId] = useState(0);
  const [editEstimateHours, setEditEstimateHours] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [toggleBusyId, setToggleBusyId] = useState(null); // id currently toggling

  async function toggleDone(task) {
    try {
      setError("");
      setToggleBusyId(task.id);
      await delay(1000);
      await api.updateTask(task.id, { ...task, isDone: !task.isDone });
      await loadTasks();
    } catch (err) {
      setError(err.message || "Failed to update task");
    } finally {
      setToggleBusyId(null);
    }
  }

  function startEdit(task) {
    setEditId(task.id);
    setEditTitle(task.title ?? "");
    setEditCategoryId(task.categoryId);
    setEditEstimateHours(task.estimateHours);
    // normalize due date to YYYY-MM-DD for <input type="date">
    const d = task.dueDate ? new Date(task.dueDate) : null;
    const ymd = d
      ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0",
        )}-${String(d.getDate()).padStart(2, "0")}`
      : "";
    setEditDueDate(ymd);
  }

  function cancelEdit() {
    setEditId(null);
    setEditTitle("");
    setEditDueDate("");
  }

  async function saveEdit(originalTask) {
    if (!editTitle.trim()) {
      setError("Title is required.");
      return;
    }

    if (!editCategoryId) {
      setError("Category is required.");
      return;
    }

    if (editEstimateHours < 0) {
      setError("Estimated hours must be greater than or equal to 0.");
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const payload = {
        ...originalTask,
        title: editTitle.trim(),
        // send null if empty string so API accepts it
        dueDate: editDueDate ? editDueDate : null,
        categoryId: editCategoryId,
        estimateHours: editEstimateHours,
      };

      await api.updateTask(originalTask.id, payload);
      await delay(1000);
      cancelEdit();
      await loadTasks();
    } catch (err) {
      setError(err.message || "Failed to update task");
    } finally {
      setUpdating(false);
    }
  }

  return {
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
  };
}
