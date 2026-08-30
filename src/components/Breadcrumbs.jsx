"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Breadcrumbs({ path }) {
  // path = [{ id: null, name: "My Drive" }, { id: "uuid", name: "Photos" }]
  return (
    <div className="flex items-center gap-1 text-sm text-gray-500 mb-4 flex-wrap">
      {path.map((crumb, i) => {
        const isLast = i === path.length - 1;
        const href = crumb.id ? `/folder/${crumb.id}` : "/";
        return (
          <span key={crumb.id ?? "root"} className="flex items-center gap-1">
            <Link
              href={href}
              className={`hover:text-indigo-600 ${isLast ? "text-gray-900 font-medium pointer-events-none" : ""}`}
            >
              {crumb.name}
            </Link>
            {!isLast && <ChevronRight size={14} />}
          </span>
        );
      })}
    </div>
  );
}