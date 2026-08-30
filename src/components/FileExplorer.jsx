"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Folder, MoreVertical, Star, Download, Edit2, Trash2, Share2 } from "lucide-react";
import FileIcon from "./FileIcon";
import { formatBytes, formatDate } from "@/utils/format";

export default function FileExplorer({ folders, files, onAction }) {
  const [menuOpenId, setMenuOpenId] = useState(null);
  const router = useRouter();

  const closeMenu = () => setMenuOpenId(null);

  if (folders.length === 0 && files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <Folder size={48} className="mb-3 opacity-40" />
        <p className="text-sm">This folder is empty</p>
        <p className="text-xs mt-1">Drag files here or click Upload to get started</p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      onClick={closeMenu}
    >
      {folders.map((folder) => (
        <div
          key={folder.id}
          onDoubleClick={() => router.push(`/folder/${folder.id}`)}
          className="group relative border border-gray-100 rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md hover:border-indigo-200 transition cursor-pointer bg-white"
        >
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === `f_${folder.id}` ? null : `f_${folder.id}`); }}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-700"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpenId === `f_${folder.id}` && (
            <FolderMenu folder={folder} onAction={onAction} onClose={closeMenu} />
          )}

          <Folder size={36} className="text-indigo-500" />
          <span className="text-sm font-medium text-gray-700 truncate w-full text-center">
            {folder.name}
          </span>
        </div>
      ))}

      {files.map((file) => (
        <div
          key={file.id}
          className="group relative border border-gray-100 rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition bg-white"
        >
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === `x_${file.id}` ? null : `x_${file.id}`); }}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-700"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpenId === `x_${file.id}` && (
            <FileMenu file={file} onAction={onAction} onClose={closeMenu} />
          )}

          {file.starred && (
            <Star size={14} className="absolute top-2 left-2 fill-yellow-400 text-yellow-400" />
          )}

          <FileIcon mimeType={file.mimeType} />
          <span className="text-sm font-medium text-gray-700 truncate w-full text-center">
            {file.name}
          </span>
          <span className="text-xs text-gray-400">{formatBytes(file.sizeBytes)}</span>
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
      className="absolute top-9 right-2 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-10 w-40"
    >
      {items.map(({ label, icon: Icon, action, danger }) => (
        <button
          key={action}
          onClick={() => { onAction(action, "folder", folder); onClose(); }}
          className={`flex items-center gap-2 px-3 py-2 text-sm w-full hover:bg-gray-50 ${
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
    { label: file.starred ? "Unstar" : "Star", icon: Star, action: "star" },
    { label: "Move to Trash", icon: Trash2, action: "trash", danger: true },
  ];
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute top-9 right-2 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-10 w-44"
    >
      {items.map(({ label, icon: Icon, action, danger }) => (
        <button
          key={action}
          onClick={() => { onAction(action, "file", file); onClose(); }}
          className={`flex items-center gap-2 px-3 py-2 text-sm w-full hover:bg-gray-50 ${
            danger ? "text-red-500" : "text-gray-600"
          }`}
        >
          <Icon size={14} /> {label}
        </button>
      ))}
    </div>
  );
}