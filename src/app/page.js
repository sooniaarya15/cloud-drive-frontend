"use client";
import { useState, useEffect, useCallback } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import Toolbar from "@/components/Toolbar";
import FileExplorer from "@/components/FileExplorer";
import { folderService, fileService } from "@/lib/fileService";

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

  const handleNewFolder = async () => {
    const name = prompt("Folder name");
    if (!name) return;
    await folderService.create({ name, parentId: folderId });
    load();
  };

  const handleAction = async (action, type, item) => {
    if (type === "file") {
      if (action === "download") {
        const { signedUrl } = await fileService.get(item.id);
        window.open(signedUrl, "_blank");
      } else if (action === "rename") {
        const newName = prompt("New name", item.name);
        if (newName) await fileService.update(item.id, { name: newName });
        load();
      } else if (action === "trash") {
        await fileService.trash(item.id);
        load();
      } else if (action === "star") {
        const { starService } = await import("@/lib/fileService");
        item.starred
          ? await starService.remove("file", item.id)
          : await starService.add("file", item.id);
        load();
      } else if (action === "share") {
        window.dispatchEvent(new CustomEvent("open-share-modal", { detail: item }));
      }
    } else {
      if (action === "rename") {
        const newName = prompt("New name", item.name);
        if (newName) await folderService.update(item.id, { name: newName });
        load();
      } else if (action === "trash") {
        if (confirm(`Delete "${item.name}" and everything inside it?`)) {
          await folderService.delete(item.id);
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
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <Toolbar
          onNewFolder={handleNewFolder}
          onUploadClick={() => window.dispatchEvent(new CustomEvent("open-upload", { detail: folderId }))}
          view={view}
          onViewChange={setView}
          search={search}
          onSearchChange={setSearch}
        />
        <Breadcrumbs path={data.path} />

        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : (
          <FileExplorer folders={filteredFolders} files={filteredFiles} onAction={handleAction} />
        )}
      </main>
    </div>
  );
}