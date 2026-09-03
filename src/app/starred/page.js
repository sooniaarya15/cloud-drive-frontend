"use client";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import FileIcon from "@/components/FileIcon";
import { searchService, fileService, starService } from "@/lib/fileService";
import { formatBytes } from "@/utils/format";
import { toast } from "@/components/Toast";
import { Star, Download } from "lucide-react";

export default function StarredPage() {
  return (
    <ProtectedRoute>
      <StarredView />
    </ProtectedRoute>
  );
}

function StarredView() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    searchService
      .search({ starred: true })
      .then((r) => setFiles(r.items))
      .catch((err) => {
        console.error("Failed to load starred files:", err);
        toast.error("Could not load starred files");
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDownload = async (file) => {
    const { signedUrl } = await fileService.get(file.id);
    window.open(signedUrl, "_blank");
  };

  const handleUnstar = async (file) => {
    try {
      await starService.remove("file", file.id);
      toast.success(`"${file.name}" removed from starred`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Could not unstar");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-lg font-semibold text-gray-900 mb-6">Starred</h1>

        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Star size={48} className="mb-3 opacity-40" />
            <p className="text-sm">No starred files yet</p>
          </div>
        ) : (
          <div className="border border-gray-100 rounded-xl divide-y divide-gray-100 bg-white">
            {files.map((file) => (
              <div key={file.id} className="flex items-center gap-3 px-4 py-3">
                <FileIcon mimeType={file.mimeType} size={20} />
                <span className="flex-1 text-sm text-gray-800 truncate">{file.name}</span>
                <span className="text-xs text-gray-400 w-16 text-right">{formatBytes(file.sizeBytes)}</span>
                <button
                  onClick={() => handleDownload(file)}
                  className="text-gray-400 hover:text-indigo-600 p-1.5"
                  title="Download"
                >
                  <Download size={15} />
                </button>
                <button
                  onClick={() => handleUnstar(file)}
                  className="text-yellow-400 hover:text-gray-400 p-1.5"
                  title="Unstar"
                >
                  <Star size={15} className="fill-current" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}