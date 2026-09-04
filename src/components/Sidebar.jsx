"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HardDrive, Users, Star, Clock, Trash2, LogOut, Menu, X, Search as SearchIcon } from "lucide-react";
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
  const [mobileOpen, setMobileOpen] = useState(false);
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

  const content = (
    <>
      <div className="flex items-center justify-between px-2 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            C
          </div>
          <span className="font-semibold text-gray-900">CloudDrive</span>
        </div>
        <button className="md:hidden text-gray-400" onClick={() => setMobileOpen(false)}>
          <X size={20} />
        </button>
      </div>

      <Link
        href="/search"
        onClick={() => setMobileOpen(false)}
        className="flex items-center gap-2 px-3 py-2 mb-4 text-sm text-gray-400 border border-gray-200 rounded-lg hover:border-indigo-300"
      >
        <SearchIcon size={16} /> Search everywhere
      </Link>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                active ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon size={18} /> {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 pt-4 mt-4">
        <div className="px-2 mb-2">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500" style={{ width: `${usedPct}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {formatBytes(user?.storageUsedBytes)} of {formatBytes(user?.storageQuotaBytes)} used
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-2 py-2 text-sm text-gray-500 hover:text-red-600 w-full"
        >
          <LogOut size={16} /> Log out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-100 flex items-center px-4 z-30">
        <button onClick={() => setMobileOpen(true)} className="text-gray-600">
          <Menu size={22} />
        </button>
        <span className="ml-3 font-semibold text-gray-900">CloudDrive</span>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 border-r border-gray-100 bg-white h-screen flex-col p-4 sticky top-0">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white p-4 flex flex-col">
            {content}
          </aside>
        </div>
      )}

      {/* Spacer so content isn't hidden under the mobile top bar */}
      <div className="md:hidden h-14 w-full" />
    </>
  );
}