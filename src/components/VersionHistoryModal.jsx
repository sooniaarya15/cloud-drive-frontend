"use client";
import { useState, useEffect } from "react";
import { X, History, RotateCcw, Upload } from "lucide-react";
import { versionService } from "@/lib/versionService";
import { formatBytes, formatDate } from "@/utils/format";
import { toast } from "./Toast";

export default function VersionHistoryModal() {
  const [file, setFile] = useState(null);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async (item) => {
    setLoading(true);
    try {
      const result = await versionService.list(item.id);
      setVersions(result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = (e) => { setFile(e.detail); load(e.detail); };
    window.addEventListener("open-versions", handler);
    return () => window.removeEventListener("open-versions", handler);
  }, []);

  if (!file) return null;
  const close = () => setFile(null);

  const handleRevert = async (versionId) => {
    if (!confirm("Revert to this version? Your current version will be saved in history.")) return;
    await versionService.revert(file.id, versionId);
    toast.success("Reverted successfully");
    load(file);
  };

  const handleUploadNewVersion = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const formData = new FormData();
    formData.append("file", f);
    await versionService.upload(file.id, formData);
    toast.success("New version uploaded");
    load(file);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <History size={17} /> Version history
          </h2>
          <button onClick={close} className="text-gray-400 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-2">
          <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg py-3 text-sm text-indigo-600 font-medium cursor-pointer hover:border-indigo-300 mb-3">
            <Upload size={15} /> Upload new version
            <input type="file" hidden onChange={handleUploadNewVersion} />
          </label>

          {loading ? (
            <p className="text-xs text-gray-400">Loading...</p>
          ) : versions.length === 0 ? (
            <p className="text-xs text-gray-400">No previous versions yet</p>
          ) : (
            versions.map((v) => (
              <div key={v.id} className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2 text-sm">
                <div>
                  <p className="text-gray-800">Version {v.versionNumber}</p>
                  <p className="text-xs text-gray-400">
                    {formatBytes(v.sizeBytes)} · {formatDate(v.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => handleRevert(v.id)}
                  className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-xs font-medium"
                >
                  <RotateCcw size={13} /> Revert
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}