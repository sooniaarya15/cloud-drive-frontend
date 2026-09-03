"use client";
import { FolderPlus, Upload, Search, LayoutGrid, List } from "lucide-react";

export default function Toolbar({ onNewFolder, onUploadClick, view, onViewChange, search, onSearchChange }) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="relative flex-1 min-w-[220px] max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          placeholder="Search in this folder..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white">
          <button
            onClick={() => onViewChange("grid")}
            className={`p-2.5 transition-colors ${
              view === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"
            }`}
            title="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => onViewChange("list")}
            className={`p-2.5 border-l border-gray-200 transition-colors ${
              view === "list" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"
            }`}
            title="List view"
          >
            <List size={16} />
          </button>
        </div>

        <button
          onClick={onNewFolder}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          <FolderPlus size={16} /> New Folder
        </button>

        <button
          onClick={onUploadClick}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-colors"
        >
          <Upload size={16} /> Upload
        </button>
      </div>
    </div>
  );
}