"use client";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import FileIcon from "@/components/FileIcon";
import { shareService } from "@/lib/shareService";
import { formatBytes } from "@/utils/format";
import { Folder } from "lucide-react";

export default function SharedPage() {
  const [data, setData] = useState({ files: [], folders: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    shareService.sharedWithMe().then(setData).finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-lg font-semibold text-gray-900 mb-6">Shared with me</h1>

          {loading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : data.files.length === 0 && data.folders.length === 0 ? (
            <p className="text-sm text-gray-400">Nothing has been shared with you yet</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {data.folders.map((f) => (
                <div key={f.id} className="border border-gray-100 rounded-xl p-4 flex flex-col items-center gap-2 bg-white">
                  <Folder size={36} className="text-indigo-500" />
                  <span className="text-sm font-medium text-gray-700 truncate w-full text-center">{f.name}</span>
                </div>
              ))}
              {data.files.map((f) => (
                <div key={f.id} className="border border-gray-100 rounded-xl p-4 flex flex-col items-center gap-2 bg-white">
                  <FileIcon mimeType={f.mime_type} />
                  <span className="text-sm font-medium text-gray-700 truncate w-full text-center">{f.name}</span>
                  <span className="text-xs text-gray-400">{formatBytes(f.size_bytes)}</span>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}