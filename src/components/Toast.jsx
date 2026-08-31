"use client";
import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, UploadCloud, CheckCircle2, XCircle, File as FileIcon } from "lucide-react";
import { fileService } from "@/lib/fileService";
import { formatBytes } from "@/utils/format";

export default function UploadModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [folderId, setFolderId] = useState(null);
  const [queue, setQueue] = useState([]); // [{ id, file, progress, status }]

  useEffect(() => {
    const handler = (e) => {
      setFolderId(e.detail || null);
      setIsOpen(true);
    };
    window.addEventListener("open-upload", handler);
    return () => window.removeEventListener("open-upload", handler);
  }, []);

  const uploadOne = useCallback(
    async (item) => {
      const formData = new FormData();
      formData.append("file", item.file);
      if (folderId) formData.append("folderId", folderId);

      try {
        await fileService.upload(formData, (progress) => {
          setQueue((q) => q.map((i) => (i.id === item.id ? { ...i, progress } : i)));
        });
        setQueue((q) => q.map((i) => (i.id === item.id ? { ...i, status: "done", progress: 100 } : i)));
      } catch (err) {
        const message = err.response?.data?.error?.message || "Upload failed";
        setQueue((q) => q.map((i) => (i.id === item.id ? { ...i, status: "error", error: message } : i)));
      }
    },
    [folderId]
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      const newItems = acceptedFiles.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        progress: 0,
        status: "uploading",
      }));
      setQueue((q) => [...q, ...newItems]);
      newItems.forEach(uploadOne);
    },
    [uploadOne]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleClose = () => {
    const stillUploading = queue.some((i) => i.status === "uploading");
    if (stillUploading && !confirm("Uploads still in progress. Close anyway?")) return;
    setIsOpen(false);
    setQueue([]);
    window.dispatchEvent(new CustomEvent("uploads-finished"));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Upload files</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
              isDragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud size={32} className="mx-auto mb-2 text-indigo-500" />
            <p className="text-sm text-gray-600">
              {isDragActive ? "Drop files here..." : "Drag & drop files, or click to browse"}
            </p>
          </div>
        </div>

        {queue.length > 0 && (
          <div className="px-5 pb-5 overflow-y-auto flex-1 space-y-2">
            {queue.map((item) => (
              <div key={item.id} className="flex items-center gap-3 border border-gray-100 rounded-lg p-3">
                <FileIcon size={20} className="text-gray-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-sm">
                    <span className="truncate font-medium text-gray-700">{item.file.name}</span>
                    <span className="text-gray-400 text-xs ml-2 shrink-0">{formatBytes(item.file.size)}</span>
                  </div>
                  {item.status === "uploading" && (
                    <div className="h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 transition-all"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                  {item.status === "error" && (
                    <p className="text-xs text-red-500 mt-1">{item.error}</p>
                  )}
                </div>
                {item.status === "done" && <CheckCircle2 size={18} className="text-green-500 shrink-0" />}
                {item.status === "error" && <XCircle size={18} className="text-red-500 shrink-0" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}