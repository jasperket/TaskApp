import { useState } from "react";
import { api } from "../api";
import { delay } from "../utils";

export default function useCreateTask(setError, loadTasks) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(""); // YYYY-MM-DD from <input type="date">
  const [estimateHours, setEstimateHours] = useState(0);
  const [categoryId, setCategoryId] = useState(0);
  const [saving, setSaving] = useState(false); // shows button loading state

  // Handle create
  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!categoryId) {
      setError("Category is required.");
      return;
    }

    if(estimateHours < 0) {
      setError("Estimated hours must be a positive number.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // Send null if no date picked; the API accepts either ISO date or null
      await api.createTask({
        title: title.trim(),
        isDone: false,
        dueDate: dueDate || null,
        estimateHours: estimateHours,
        categoryId: categoryId,
      });

      // reset form + refresh list
      await delay(1000);
      setTitle("");
      setDueDate("");
      setEstimateHours(0);
      setCategoryId(0);
      await loadTasks();
    } catch (err) {
      setError(err.message || "Failed to create task");
    } finally {
      setSaving(false);
    }
  }

  return { title, dueDate, saving, handleAdd, setTitle, setDueDate, estimateHours, setEstimateHours, categoryId, setCategoryId };
}
