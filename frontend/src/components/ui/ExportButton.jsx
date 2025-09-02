import { useState } from "react";
import { Download } from "lucide-react";
import { delay, sortTasks } from "../../utils";
import XLSX from "xlsx";
import LoadingSpinner from "./LoadingSpinner";

export default function ExportButton({ tasks, categories }) {
  const [exporting, setExporting] = useState(false);

  function prepareData() {
    const sorted = sortTasks(tasks);
    const data = sorted.map((task) => {
      return {
        ID: task.id,
        Title: task.title,
        Done: task.isDone,
        "Due Date": task.dueDate
          ? new Date(task.dueDate).toLocaleDateString()
          : "",
        "Estimated Hours": task.estimateHours,
        Category: categories.find((c) => c.id === task.categoryId).name,
      };
    });
    return data;
  }

  function calculateWidths(data, columns) {
    const widths = [];
    for (const column of columns) {
      console.log(column);
      const max_width = data.reduce(
        (w, r) => Math.max(w, r[column].length, column.length),
        10,
      );
      widths.push({ wch: max_width });
    }
    return widths;
  }

  async function exportData() {
    setExporting(true);
    await delay(1000);
    const data = prepareData();

    // Convert to sheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Calculate column widths
    const widths = calculateWidths(data, Object.keys(data[0]));

    // Set column widths
    if (!worksheet["!cols"]) worksheet["!cols"] = widths;

    // Add to workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

    // Download Workbook
    XLSX.writeFile(workbook, "Tasks.xlsx", { compression: true });

    setExporting(false);
  }

  return (
    <div className="flex gap-4">
      <button
        disabled={exporting}
        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-white ${
          exporting
            ? "cursor-not-allowed bg-green-700"
            : "cursor-pointer bg-green-600 hover:bg-green-700"
        }`}
        onClick={exportData}
      >
        {exporting ? "Exporting..." : "Export to Excel"}
        {exporting ? <LoadingSpinner /> : <Download size={16} />}
      </button>
    </div>
  );
}
