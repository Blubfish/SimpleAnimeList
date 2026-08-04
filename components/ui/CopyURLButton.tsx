"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyUrlButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center justify-center gap-2 rounded-3xl bg-linear-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 shadow-md shadow-orange-500/20 ring-1 ring-orange-300/30 transition hover:brightness-110 hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-orange-300/50"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied!" : "Copy URL"}
    </button>
  );
}
