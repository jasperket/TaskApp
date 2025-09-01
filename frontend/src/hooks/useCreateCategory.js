import { useState } from "react";
import { api } from "../api";
import { delay } from "../utils";

export default function useCreateCategory(setError, loadTasks) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false); // shows button loading state

  // Handle create
  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await api.createCategory({
        name: name.trim(),
      });

      // reset form + refresh list
      await delay(1000);
      setName("");
      await loadTasks();
    } catch (err) {
      setError(err.message || "Failed to create task");
    } finally {
      setSaving(false);
    }
  }

  return { name, saving, handleAdd, setName };
}
