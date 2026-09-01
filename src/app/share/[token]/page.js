"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { shareService } from "@/lib/shareService";
import { formatBytes } from "@/utils/format";
import { Lock, Download, Folder } from "lucide-react";
import FileIcon from "@/components/FileIcon";

export default function PublicSharePage() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async (pwd) => {
    setError("");
    try {
      const result = await shareService.resolveLink(token, pwd);
      setData(result);
      setNeedsPassword(false);
    } catch (err) {
      if (err.response?.status === 403) {
        setNeedsPassword(true);
      } else {
        setError(err.response?.data?.error?.message || "This link is invalid or has expired");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    load(password);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Loading...</div>;
  }

  if (needsPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <form onSubmit={handlePasswordSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm">
          <Lock size={28} className="text-indigo-500 mb-3" />
          <h1 className="text-lg font-semibold text-gray-900 mb-1">Password required</h1>
          <p className="text-sm text-gray-500 mb-4">This link is protected.</p>
          <input
            type="password"
            required
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-lg">
            Unlock
          </button>
        </form>
      </div>
    );
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 text-sm">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md text-center">
        {data.resourceType === "file" ? (
          <>
            <FileIcon mimeType={data.file.mimeType} size={48} />
            <h1 className="text-lg font-semibold text-gray-900 mt-3">{data.file.name}</h1>
            <p className="text-sm text-gray-400 mb-5">{formatBytes(data.file.sizeBytes)}</p>
            
              href={data.signedUrl}
              download
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg"
            <a>
              <Download size={16} /> Download
            </a>
          </>
        ) : (
          <>
            <Folder size={48} className="text-indigo-500 mx-auto" />
            <h1 className="text-lg font-semibold text-gray-900 mt-3">{data.folder.name}</h1>
            <div className="mt-5 space-y-2 text-left">
              {data.files.map((f) => (
                <div key={f.id} className="flex items-center justify-between text-sm border border-gray-100 rounded-lg px-3 py-2">
                  <span className="truncate">{f.name}</span>
                  <span className="text-xs text-gray-400">{formatBytes(f.sizeBytes)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}