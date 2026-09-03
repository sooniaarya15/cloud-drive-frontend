"use client";
import { useState, useEffect, useCallback } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import Toolbar from "@/components/Toolbar";
import FileExplorer from "@/components/FileExplorer";
import { folderService, fileService, starService } from "@/lib/fileService";
import { toast } from "@/components/Toast";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <DriveView folderId={null} />
    </ProtectedRoute>
  );
}

export function DriveView({ folderId }) {
  const [data, setData] = useState({ folder: null, children: { folders: [], files: [] }, path: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await folderService.get(folderId);
      setData(result);
    } finally {
      setLoading(false);
    }
  }, [folderId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const handler = () => load();
    window.addEventListener("uploads-finished", handler);
    return () => window.removeEventListener("uploads-finished", handler);
  }, [load]);

  const handleNewFolder = async () => {
    const name = prompt("Folder name");
    if (!name) return;
    await folderService.create({ name, parentId: folderId });
    toast.success(`Folder "${name}" created`);
    load();
  };

  const handleAction = async (action, type, item) => {
    if (type === "file") {
      if (action === "download") {
        const { signedUrl } = await fileService.get(item.id);
        window.open(signedUrl, "_blank");
      } else if (action === "rename") {
        const newName = prompt("New name", item.name);
        if (newName) {
          await fileService.update(item.id, { name: newName });
          toast.success("Renamed successfully");
        }
        load();
      } else if (action === "trash") {
        await fileService.trash(item.id);
        toast.success(`"${item.name}" moved to Trash`);
        load();
      } else if (action === "star") {
        item.starred
          ? await starService.remove("file", item.id)
          : await starService.add("file", item.id);
        toast.success(item.starred ? "Removed from starred" : "Added to starred");
        load();
      } else if (action === "share") {
        window.dispatchEvent(new CustomEvent("open-share-modal", { detail: item }));
      } else if (action === "versions") {
        window.dispatchEvent(new CustomEvent("open-versions", { detail: item }));
      }
    } else {
      if (action === "rename") {
        const newName = prompt("New name", item.name);
        if (newName) {
          await folderService.update(item.id, { name: newName });
          toast.success("Renamed successfully");
        }
        load();
      } else if (action === "trash") {
        if (confirm(`Delete "${item.name}" and everything inside it?`)) {
          await folderService.delete(item.id);
          toast.success(`"${item.name}" deleted`);
          load();
        }
      }
    }
  };

  const filteredFolders = data.children.folders.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredFiles = data.children.files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 px-6 py-6 md:px-10 md:py-8 max-w-[1600px] mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">My Drive</h1>
          <Breadcrumbs path={data.path} />
        </div>

        <Toolbar
          onNewFolder={handleNewFolder}
          onUploadClick={() => window.dispatchEvent(new CustomEvent("open-upload", { detail: folderId }))}
          view={view}
          onViewChange={setView}
          search={search}
          onSearchChange={setSearch}
        />

        <div className="mt-6">
          {loading ? (
            <LoadingGrid />
          ) : (
            <FileExplorer folders={filteredFolders} files={filteredFiles} onAction={handleAction} />
          )}
        </div>
      </main>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="border border-gray-100 rounded-xl p-5 flex flex-col items-center gap-3 bg-white animate-pulse"
        >
          <div className="w-9 h-9 bg-gray-100 rounded-lg" />
          <div className="h-3 bg-gray-100 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}