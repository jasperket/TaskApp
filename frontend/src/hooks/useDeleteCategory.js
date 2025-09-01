import { useState } from "react";
import { api } from "../api";
import { delay } from "../utils";

export default function useDeleteCategory(setError, loadCategories) {
  const [deleteBusyId, setDeleteBusyId] = useState(null); // id currently deleting
  async function remove(id) {
    try {
      setError("");
      setDeleteBusyId(id);
      await delay(1000);
      await api.deleteTask(id);
      await loadCategories();
    } catch (err) {
      setError(err.message || "Failed to delete task");
    } finally {
      setDeleteBusyId(null);
    }
  }

  return { deleteBusyId, remove };
}
