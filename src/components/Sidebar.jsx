"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HardDrive, Users, Star, Clock, Trash2, LogOut, Search as SearchIcon } from "lucide-react";
import { authService } from "@/lib/authService";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { formatBytes } from "@/utils/format";

const NAV_ITEMS = [
  { href: "/", label: "My Drive", icon: HardDrive },
  { href: "/shared", label: "Shared with me", icon: Users },
  { href: "/recent", label: "Recent", icon: Clock },
  { href: "/starred", label: "Starred", icon: Star },
  { href: "/trash", label: "Trash", icon: Trash2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, clearUser } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await authService.logout();
    localStorage.removeItem("accessToken");
    clearUser();
    router.push("/login");
  };

  const usedPct = user
    ? Math.min(100, Math.round((user.storageUsedBytes / user.storageQuotaBytes) * 100))
    : 0;

  return (
    <aside className="w-64 shrink-0 border-r border-gray-100 bg-white h-screen flex flex-col p-5 sticky top-0">
      <div className="flex items-center gap-2.5 px-1 mb-7">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-indigo-200">
          C
        </div>
        <span className="font-semibold text-gray-900 text-[15px]">CloudDrive</span>
      </div>

      <Link
        href="/search"
        className="flex items-center gap-2.5 px-3.5 py-2.5 mb-6 text-sm text-gray-400 border border-gray-200 rounded-lg hover:border-indigo-300 hover:text-gray-500 transition-colors"
      >
        <SearchIcon size={16} /> Search everywhere
      </Link>

      <nav className="flex-1 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon size={18} /> {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 pt-5 mt-5">
        <div className="px-1 mb-3">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all"
              style={{ width: `${usedPct}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {formatBytes(user?.storageUsedBytes)} of {formatBytes(user?.storageQuotaBytes)} used
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
        >
          <LogOut size={16} /> Log out
        </button>
      </div>
    </aside>
  );
}