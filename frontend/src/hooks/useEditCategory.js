import { useState } from "react";
import { api } from "../api";
import { delay } from "../utils";

export default function useEditCategory(setError, loadCategories) {
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [updating, setUpdating] = useState(false);

  function startEdit(category) {
    setEditId(category.id);
    setEditName(category.name ?? "");
  }

  function cancelEdit() {
    setEditId(null);
    setEditName("");
  }

  async function saveEdit(originalTask) {
    if (!editName.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const payload = {
        ...originalTask,
        name: editName.trim(),
      };

      await api.updateCategory(originalTask.id, payload);
      await delay(1000);
      cancelEdit();
      await loadCategories();
    } catch (err) {
      setError(err.message || "Failed to update category");
    } finally {
      setUpdating(false);
    }
  }

  return {
    editId,
    editName,
    setEditName,
    updating,
    startEdit,
    saveEdit,
    cancelEdit,
  };
}
