"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAuthCookies } from "./actions";
import { LogOutIcon, TriangleAlertIcon } from "lucide-react";

export default function LogOut() {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogOut = async () => {
    if (isLoading) return;
    setIsLoading(true);
    await deleteAuthCookies();
    setIsLoading(false);
    setShowWarning(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-700/60 bg-slate-900/90 p-8 shadow-2xl shadow-black/60 backdrop-blur-xl">
        <div className="pointer-events-none absolute -top-px left-1/2 h-px w-3/4 -translate-x-1/2 bg-linear-to-r from-transparent via-orange-400/60 to-transparent" />

        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/15 ring-1 ring-orange-400/30">
          <LogOutIcon className="h-6 w-6 text-orange-400" />
        </div>

        <h2 className="text-center text-xl font-bold text-slate-100">
          Log out?
        </h2>
        <p className="mt-1 text-center text-sm text-slate-400">
          You&rsquo;ll need to sign in again to access your anime list.
        </p>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleLogOut}
            disabled={isLoading}
            className="w-full rounded-lg bg-linear-to-r from-red-500 to-red-400 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition hover:from-red-400 hover:to-red-300 hover:shadow-red-400/30 disabled:opacity-60"
          >
            {isLoading ? "Logging out…" : "Log out"}
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full rounded-lg py-2.5 text-sm font-medium text-slate-400 transition hover:text-slate-200"
          >
            Cancel
          </button>
        </div>
      </div>

      {showWarning && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/20 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-2xl border border-orange-500/40 bg-slate-900/90 p-8 shadow-2xl shadow-black/60 backdrop-blur-xl">
            <div className="pointer-events-none absolute -top-px left-1/2 h-px w-3/4 -translate-x-1/2 bg-linear-to-r from-transparent via-orange-400/60 to-transparent" />

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/15 ring-1 ring-orange-400/30">
              <TriangleAlertIcon className="h-6 w-6 text-orange-400" />
            </div>

            <h2 className="text-center text-xl font-bold text-slate-100">
              Heads up
            </h2>
            <p className="mt-2 text-center text-sm text-slate-400">
              You&rsquo;ve been logged out of this app. To fully sign out, you
              also need to log out of{" "}
              <span className="font-semibold text-orange-300">anilist.co</span>{" "}
              in your browser (Logout button can be found at the bottom of the
              page).
            </p>

            <div className="mt-6 space-y-3">
              <a
                href="https://anilist.co/settings"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-lg bg-linear-to-r from-orange-500 to-orange-400 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-400 hover:to-orange-300 hover:shadow-orange-400/30"
              >
                Open anilist.co
              </a>
              <button
                onClick={() => router.push("/")}
                className="w-full rounded-lg py-2.5 text-sm font-medium text-slate-400 transition hover:text-slate-200"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
