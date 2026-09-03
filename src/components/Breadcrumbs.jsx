"use client";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

export default function Breadcrumbs({ path }) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
      {path.map((crumb, i) => {
        const isLast = i === path.length - 1;
        const href = crumb.id ? `/folder/${crumb.id}` : "/";
        return (
          <span key={crumb.id ?? "root"} className="flex items-center gap-1.5">
            <Link
              href={href}
              className={`flex items-center gap-1 hover:text-indigo-600 transition-colors ${
                isLast ? "text-gray-900 font-medium pointer-events-none" : ""
              }`}
            >
              {i === 0 && <Home size={13} className="mb-0.5" />}
              {crumb.name}
            </Link>
            {!isLast && <ChevronRight size={13} className="text-gray-300" />}
          </span>
        );
      })}
    </div>
  );
}