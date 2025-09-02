export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    // Pending first (false < true)
    if (a.isDone !== b.isDone) return a.isDone - b.isDone;
    // Then by due date (nulls last)
    const ad = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
    const bd = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
    return ad - bd;
  });
}
