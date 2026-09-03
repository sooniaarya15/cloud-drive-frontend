"use client";
import { useState, useEffect, useCallback } from "react";
import { X, Link2, Copy, Check, Trash2, Lock, Calendar, Clock } from "lucide-react";
import { shareService } from "@/lib/shareService";
import { toast } from "./Toast";

export default function ShareModal() {
  const [file, setFile] = useState(null);
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [inviting, setInviting] = useState(false);

  const [linkInfo, setLinkInfo] = useState(null);
  const [linkPassword, setLinkPassword] = useState("");
  const [linkExpiry, setLinkExpiry] = useState("");
  const [copied, setCopied] = useState(false);

  const loadShares = useCallback(async (item) => {
    setLoading(true);
    try {
      const result = await shareService.list("file", item.id);
      setShares(result);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      setFile(e.detail);
      setLinkInfo(null);
      setEmail("");
      loadShares(e.detail);
    };
    window.addEventListener("open-share-modal", handler);
    return () => window.removeEventListener("open-share-modal", handler);
  }, [loadShares]);

  if (!file) return null;

  const close = () => setFile(null);

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviting(true);
    try {
      const result = await shareService.create({
        resourceType: "file",
        resourceId: file.id,
        granteeEmail: email,
        role,
      });
      toast.success(
        result.pending
          ? `Invite sent to ${email} — they'll get access once they sign up`
          : `Shared with ${email}`
      );
      setEmail("");
      loadShares(file);
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Could not share");
    } finally {
      setInviting(false);
    }
  };

  const handleRevoke = async (shareId) => {
    await shareService.revoke(shareId);
    toast.success("Access revoked");
    loadShares(file);
  };

  const handleCreateLink = async () => {
    try {
      const result = await shareService.createLink({
        resourceType: "file",
        resourceId: file.id,
        password: linkPassword || null,
        expiresAt: linkExpiry ? new Date(linkExpiry).toISOString() : null,
      });
      setLinkInfo(result);
      toast.success("Link created");
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Could not create link");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(linkInfo.shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 truncate">Share &quot;{file.name}&quot;</h2>
          <button onClick={close} className="text-gray-400 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          {/* Invite by email */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Share with people</h3>
            <p className="text-xs text-gray-400 mb-2">
              Works even if they don&apos;t have an account yet — they&apos;ll get access as soon as they sign up.
            </p>
            <form onSubmit={handleInvite} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
              </select>
              <button
                disabled={inviting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 rounded-lg disabled:opacity-50"
              >
                {inviting ? "..." : "Add"}
              </button>
            </form>
          </div>

          {/* Existing shares */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">People with access</h3>
            {loading ? (
              <p className="text-xs text-gray-400">Loading...</p>
            ) : shares.length === 0 ? (
              <p className="text-xs text-gray-400">Only you have access</p>
            ) : (
              <div className="space-y-2">
                {shares.map((s) => (
                  <div key={s.shareId} className="flex items-center justify-between text-sm">
                    <div className="min-w-0 flex items-center gap-2">
                      {s.pending && (
                        <Clock size={13} className="text-amber-500 shrink-0" title="Pending — hasn't signed up yet" />
                      )}
                      <div className="min-w-0">
                        <p className="text-gray-800 truncate">
                          {s.user.name || s.user.email}
                        </p>
                        {s.user.name && (
                          <p className="text-xs text-gray-400 truncate">{s.user.email}</p>
                        )}
                        {s.pending && (
                          <p className="text-xs text-amber-500">Invited — not signed up yet</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                        {s.role}
                      </span>
                      <button
                        onClick={() => handleRevoke(s.shareId)}
                        className="text-gray-400 hover:text-red-600"
                        title="Revoke access"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Link2 size={15} /> Public link
            </h3>

            {!linkInfo ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Lock size={13} />
                  <input
                    type="password"
                    placeholder="Optional password"
                    value={linkPassword}
                    onChange={(e) => setLinkPassword(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar size={13} />
                  <input
                    type="date"
                    value={linkExpiry}
                    onChange={(e) => setLinkExpiry(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  onClick={handleCreateLink}
                  className="w-full text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg py-2 hover:bg-indigo-50"
                >
                  Generate shareable link
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <input
                  readOnly
                  value={linkInfo.shareUrl}
                  className="flex-1 bg-transparent text-xs text-gray-600 outline-none truncate"
                />
                <button onClick={handleCopy} className="text-indigo-600 shrink-0">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}