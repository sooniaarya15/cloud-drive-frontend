"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import FileIcon from "@/components/FileIcon";
import { searchService } from "@/lib/fileService";
import { formatBytes, formatDate } from "@/utils/format";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, ArrowUpDown } from "lucide-react";

export default function SearchPage() {
  return (
    <ProtectedRoute>
      <SearchView />
    </ProtectedRoute>
  );
}

function SearchView() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [q, setQ] = useState(searchParams.get("q") || "");
  const debouncedQ = useDebounce(q, 400);

  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [items, setItems] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);

  const runSearch = useCallback(
    async (cursor = null, append = false) => {
      setLoading(true);
      try {
        const result = await searchService.search({
          q: debouncedQ,
          sort,
          order,
          cursor: cursor || undefined,
          limit: 20,
        });
        setItems((prev) => (append ? [...prev, ...result.items] : result.items));
        setNextCursor(result.nextCursor);
      } finally {
        setLoading(false);
      }
    },
    [debouncedQ, sort, order]
  );

  useEffect(() => {
    router.replace(`/search?q=${encodeURIComponent(debouncedQ)}`);
    runSearch();
  }, [debouncedQ, sort, order]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="relative max-w-lg mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            autoFocus
            placeholder="Search all files..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 mb-4 text-sm">
          <span className="text-gray-400 flex items-center gap-1">
            <ArrowUpDown size={14} /> Sort by
          </span>
          {["name", "created_at", "size_bytes"].map((option) => (
            <button
              key={option}
              onClick={() => setSort(option)}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                sort === option ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-500"
              }`}
            >
              {option === "created_at" ? "Date" : option === "size_bytes" ? "Size" : "Name"}
            </button>
          ))}
          <button
            onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
            className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500"
          >
            {order === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>

        {items.length === 0 && !loading ? (
          <p className="text-sm text-gray-400">No files found</p>
        ) : (
          <div className="border border-gray-100 rounded-xl divide-y divide-gray-100 bg-white">
            {items.map((file) => (
              <div key={file.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                <FileIcon mimeType={file.mimeType} size={22} />
                <span className="flex-1 text-sm text-gray-800 truncate">{file.name}</span>
                <span className="text-xs text-gray-400 w-20 text-right">{formatBytes(file.sizeBytes)}</span>
                <span className="text-xs text-gray-400 w-24 text-right">{formatDate(file.createdAt)}</span>
              </div>
            ))}
          </div>
        )}

        {nextCursor && (
          <button
            onClick={() => runSearch(nextCursor, true)}
            disabled={loading}
            className="mt-4 text-sm text-indigo-600 font-medium disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        )}
      </main>
    </div>
  );
}