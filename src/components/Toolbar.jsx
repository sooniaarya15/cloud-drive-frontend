"use client";
import { FolderPlus, Upload, Search, LayoutGrid, List } from "lucide-react";

export default function Toolbar({ onNewFolder, onUploadClick, view, onViewChange, search, onSearchChange }) {
  return (
    <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          placeholder="Search files and folders..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => onViewChange("grid")}
            className={`p-2 ${view === "grid" ? "bg-gray-100" : "bg-white"}`}
          >
            <LayoutGrid size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => onViewChange("list")}
            className={`p-2 ${view === "list" ? "bg-gray-100" : "bg-white"}`}
          >
            <List size={16} className="text-gray-600" />
          </button>
        </div>

        <button
          onClick={onNewFolder}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <FolderPlus size={16} /> New Folder
        </button>

        <button
          onClick={onUploadClick}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          <Upload size={16} /> Upload
        </button>
      </div>
    </div>
  );
}