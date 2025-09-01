import { useState } from "react";
import { api } from "../api";
import { delay } from "../utils";

export default function useDeleteCategory(setError, loadCategories, loadTasks) {
  const [deleteBusyId, setDeleteBusyId] = useState(null); // id currently deleting
  async function remove(id) {
    try {
      setError("");
      setDeleteBusyId(id);
      await delay(1000);
      await api.deleteCategory(id);
      await loadCategories();
      await loadTasks();
    } catch (err) {
      setError(err.message || "Failed to delete category");
    } finally {
      setDeleteBusyId(null);
    }
  }

  return { deleteBusyId, remove };
}
