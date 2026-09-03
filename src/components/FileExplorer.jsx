"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Folder, MoreVertical, Star, Download, Edit2, Trash2, Share2, History } from "lucide-react";
import FileIcon from "./FileIcon";
import { formatBytes } from "@/utils/format";

export default function FileExplorer({ folders, files, onAction }) {
  const [menuOpenId, setMenuOpenId] = useState(null);
  const router = useRouter();

  const closeMenu = () => setMenuOpenId(null);

  if (folders.length === 0 && files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-gray-400 bg-white border border-dashed border-gray-200 rounded-2xl">
        <Folder size={44} className="mb-4 opacity-30" />
        <p className="text-sm font-medium text-gray-500">This folder is empty</p>
        <p className="text-xs mt-1 text-gray-400">Drag files here or click Upload to get started</p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
      onClick={closeMenu}
    >
      {folders.map((folder) => (
        <div
          key={folder.id}
          onDoubleClick={() => router.push(`/folder/${folder.id}`)}
          className="group relative border border-gray-100 rounded-xl p-5 flex flex-col items-center gap-3 hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer bg-white"
        >
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === `f_${folder.id}` ? null : `f_${folder.id}`); }}
            className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-md p-1 transition-opacity"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpenId === `f_${folder.id}` && (
            <FolderMenu folder={folder} onAction={onAction} onClose={closeMenu} />
          )}

          <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-indigo-50">
            <Folder size={22} className="text-indigo-500" />
          </div>
          <span className="text-sm font-medium text-gray-700 truncate w-full text-center">
            {folder.name}
          </span>
        </div>
      ))}

      {files.map((file) => (
        <div
          key={file.id}
          onClick={() => window.dispatchEvent(new CustomEvent("open-preview", { detail: file }))}
          className="group relative border border-gray-100 rounded-xl p-5 flex flex-col items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 cursor-pointer bg-white"
        >
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === `x_${file.id}` ? null : `x_${file.id}`); }}
            className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-md p-1 transition-opacity"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpenId === `x_${file.id}` && (
            <FileMenu file={file} onAction={onAction} onClose={closeMenu} />
          )}

          {file.starred && (
            <Star size={13} className="absolute top-3 left-3 fill-yellow-400 text-yellow-400" />
          )}

          <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-gray-50">
            <FileIcon mimeType={file.mimeType} size={22} />
          </div>
          <div className="flex flex-col items-center gap-0.5 w-full">
            <span className="text-sm font-medium text-gray-700 truncate w-full text-center">
              {file.name}
            </span>
            <span className="text-xs text-gray-400">{formatBytes(file.sizeBytes)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function FolderMenu({ folder, onAction, onClose }) {
  const items = [
    { label: "Rename", icon: Edit2, action: "rename" },
    { label: "Delete", icon: Trash2, action: "trash", danger: true },
  ];
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute top-10 right-2 bg-white border border-gray-100 rounded-lg shadow-lg py-1.5 z-10 w-40 ring-1 ring-black/5"
    >
      {items.map(({ label, icon: Icon, action, danger }) => (
        <button
          key={action}
          onClick={() => { onAction(action, "folder", folder); onClose(); }}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-sm w-full hover:bg-gray-50 transition-colors ${
            danger ? "text-red-500" : "text-gray-600"
          }`}
        >
          <Icon size={14} /> {label}
        </button>
      ))}
    </div>
  );
}

function FileMenu({ file, onAction, onClose }) {
  const items = [
    { label: "Download", icon: Download, action: "download" },
    { label: "Rename", icon: Edit2, action: "rename" },
    { label: "Share", icon: Share2, action: "share" },
    { label: "Version history", icon: History, action: "versions" },
    { label: file.starred ? "Unstar" : "Star", icon: Star, action: "star" },
    { label: "Move to Trash", icon: Trash2, action: "trash", danger: true },
  ];
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute top-10 right-2 bg-white border border-gray-100 rounded-lg shadow-lg py-1.5 z-10 w-44 ring-1 ring-black/5"
    >
      {items.map(({ label, icon: Icon, action, danger }) => (
        <button
          key={action}
          onClick={() => { onAction(action, "file", file); onClose(); }}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-sm w-full hover:bg-gray-50 transition-colors ${
            danger ? "text-red-500" : "text-gray-600"
          }`}
        >
          <Icon size={14} /> {label}
        </button>
      ))}
    </div>
  );
}