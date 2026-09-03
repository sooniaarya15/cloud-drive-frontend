"use client";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import FileIcon from "@/components/FileIcon";
import { trashService, fileService, folderService } from "@/lib/fileService";
import { formatBytes } from "@/utils/format";
import { toast } from "@/components/Toast";
import { Folder, RotateCcw, Trash2, AlertTriangle } from "lucide-react";

export default function TrashPage() {
  return (
    <ProtectedRoute>
      <TrashView />
    </ProtectedRoute>
  );
}

function TrashView() {
  const [data, setData] = useState({ files: [], folders: [] });
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    trashService
      .list()
      .then(setData)
      .catch((err) => {
        console.error("Failed to load trash:", err);
        toast.error("Could not load Trash");
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleRestore = async (type, item) => {
    try {
      await trashService.restore(type, item.id);
      toast.success(`"${item.name}" restored`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Restore failed");
    }
  };

  const handleDeleteForever = async (type, item) => {
    if (!confirm(`Permanently delete "${item.name}"? This cannot be undone.`)) return;
    try {
      if (type === "file") {
        await fileService.deleteForever(item.id);
      } else {
        await folderService.delete(item.id);
      }
      toast.success(`"${item.name}" deleted permanently`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Delete failed");
    }
  };

  const isEmpty = data.files.length === 0 && data.folders.length === 0;

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg font-semibold text-gray-900">Trash</h1>
        </div>
        <p className="text-xs text-gray-400 mb-6 flex items-center gap-1.5">
          <AlertTriangle size={13} /> Items are permanently deleted after 30 days
        </p>

        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Trash2 size={48} className="mb-3 opacity-40" />
            <p className="text-sm">Trash is empty</p>
          </div>
        ) : (
          <div className="border border-gray-100 rounded-xl divide-y divide-gray-100 bg-white">
            {data.folders.map((folder) => (
              <div key={folder.id} className="flex items-center gap-3 px-4 py-3">
                <Folder size={20} className="text-indigo-400 shrink-0" />
                <span className="flex-1 text-sm text-gray-800 truncate">{folder.name}</span>
                <span className="text-xs text-gray-400">
                  Deleted {folder.deletedAt ? new Date(folder.deletedAt).toLocaleDateString() : "-"}
                </span>
                <button
                  onClick={() => handleRestore("folder", folder)}
                  className="text-gray-400 hover:text-indigo-600 p-1.5"
                  title="Restore"
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  onClick={() => handleDeleteForever("folder", folder)}
                  className="text-gray-400 hover:text-red-600 p-1.5"
                  title="Delete forever"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}

            {data.files.map((file) => (
              <div key={file.id} className="flex items-center gap-3 px-4 py-3">
                <FileIcon mimeType={file.mimeType} size={20} />
                <span className="flex-1 text-sm text-gray-800 truncate">{file.name}</span>
                <span className="text-xs text-gray-400 w-16 text-right">{formatBytes(file.sizeBytes)}</span>
                <span className="text-xs text-gray-400">
                  Deleted {file.deletedAt ? new Date(file.deletedAt).toLocaleDateString() : "-"}
                </span>
                <button
                  onClick={() => handleRestore("file", file)}
                  className="text-gray-400 hover:text-indigo-600 p-1.5"
                  title="Restore"
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  onClick={() => handleDeleteForever("file", file)}
                  className="text-gray-400 hover:text-red-600 p-1.5"
                  title="Delete forever"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}