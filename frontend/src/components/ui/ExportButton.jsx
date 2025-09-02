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

  async function exportData() {
    setExporting(true);
    const data = prepareData();

    // Convert to sheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Calculate column widths
    const title_max_width = data.reduce(
      (w, r) => Math.max(w, r.Title.length),
      10,
    );
    const category_max_width = data.reduce(
      (w, r) => Math.max(w, r.Category.length),
      10,
    );

    // Set column widths
    if (!worksheet["!cols"]) worksheet["!cols"] = [];
    worksheet["!cols"][1] = { wch: title_max_width };
    worksheet["!cols"][4] = { wch: "Estimated Hours".length };
    worksheet["!cols"][5] = { wch: category_max_width };

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
