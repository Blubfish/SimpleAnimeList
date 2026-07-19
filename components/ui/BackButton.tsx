"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 shadow-md shadow-orange-500/20 ring-1 ring-orange-300/30 transition hover:brightness-110 hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-orange-300/50"
    >
      <ChevronLeft className="h-4 w-4" />

      <span>Back</span>
    </button>
  );
}
