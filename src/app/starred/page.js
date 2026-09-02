"use client";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import FileExplorer from "@/components/FileExplorer";
import { searchService, fileService, starService } from "@/lib/fileService";
import { toast } from "@/components/Toast";

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
    searchService.search({ starred: true }).then((r) => setFiles(r.items)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleAction = async (action, type, item) => {
    if (action === "download") {
      const { signedUrl } = await fileService.get(item.id);
      window.open(signedUrl, "_blank");
    } else if (action === "trash") {
      await fileService.trash(item.id);
      toast.success(`"${item.name}" moved to Trash`);
      load();
    } else if (action === "star") {
      await starService.remove("file", item.id);
      toast.success("Removed from starred");
      load();
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
          <p className="text-sm text-gray-400">No starred files yet</p>
        ) : (
          <FileExplorer folders={[]} files={files} onAction={handleAction} />
        )}
      </main>
    </div>
  );
}