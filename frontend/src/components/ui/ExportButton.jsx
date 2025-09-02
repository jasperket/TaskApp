import { useState } from "react";
import { Download } from "lucide-react";

export default function ExportButton({ tasks, categories }) {
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  async function exportData() {
    console.log(tasks);
    console.log(categories);
  }

  return (
    <div className="flex gap-4">
      <button
        disabled={exporting}
        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-white ${
          exporting
            ? "cursor-not-allowed bg-green-400"
            : "cursor-pointer bg-green-600 hover:bg-green-700"
        }`}
      >
        {exporting ? "Exporting..." : "Export"}
        <Download size={16} />
      </button>
      <p>{exportError}</p>
    </div>
  );
}
