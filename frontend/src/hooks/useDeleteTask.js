import { useState } from "react";
import { api } from "../api";
import { delay } from "../utils";

export default function useDeleteTask(setError, loadTasks) {
  const [deleteBusyId, setDeleteBusyId] = useState(null); // id currently deleting
  async function remove(id) {
    try {
      setError("");
      setDeleteBusyId(id);
      await delay(1000);
      await api.deleteTask(id);
      await loadTasks();
    } catch (err) {
      setError(err.message || "Failed to delete task");
    } finally {
      setDeleteBusyId(null);
    }
  }

  return { deleteBusyId, remove };
}
