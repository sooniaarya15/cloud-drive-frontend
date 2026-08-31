"use client";
import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { fileService } from "@/lib/fileService";
import { fileIconType } from "@/utils/format";

export default function PreviewModal() {
  const [file, setFile] = useState(null);
  const [signedUrl, setSignedUrl] = useState(null);
  const [textContent, setTextContent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = async (e) => {
      setLoading(true);
      setFile(e.detail);
      setTextContent(null);
      try {
        const { signedUrl } = await fileService.get(e.detail.id);
        setSignedUrl(signedUrl);

        if (fileIconType(e.detail.mimeType) === "text") {
          const res = await fetch(signedUrl);
          const text = await res.text();
          setTextContent(text.slice(0, 5000)); // cap preview length
        }
      } finally {
        setLoading(false);
      }
    };
    window.addEventListener("open-preview", handler);
    return () => window.removeEventListener("open-preview", handler);
  }, []);

  if (!file) return null;

  const type = fileIconType(file.mimeType);
  const close = () => { setFile(null); setSignedUrl(null); };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h2 className="font-medium text-gray-900 truncate">{file.name}</h2>
          <div className="flex items-center gap-3">
            {signedUrl && (
              <a href={signedUrl} download className="text-gray-400 hover:text-gray-700">
                <Download size={18} />
              </a>
            )}
            <button onClick={close} className="text-gray-400 hover:text-gray-700">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-50 p-4">
          {loading && <p className="text-sm text-gray-400">Loading preview...</p>}

          {!loading && type === "image" && signedUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={signedUrl} alt={file.name} className="max-h-[70vh] max-w-full object-contain rounded" />
          )}

          {!loading && type === "pdf" && signedUrl && (
            <iframe src={signedUrl} title={file.name} className="w-full h-[70vh] rounded border border-gray-200" />
          )}

          {!loading && type === "text" && (
            <pre className="w-full h-full overflow-auto text-xs bg-white p-4 rounded border border-gray-200 whitespace-pre-wrap">
              {textContent}
            </pre>
          )}

          {!loading && !["image", "pdf", "text"].includes(type) && (
            <div className="text-center text-gray-400">
              <p className="text-sm">No preview available for this file type.</p>
              {signedUrl && (
                <a href={signedUrl} download className="text-indigo-600 text-sm font-medium mt-2 inline-block">
                  Download instead
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}