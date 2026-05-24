"use client";

import { useState } from "react";

type GiftCopyButtonProps = {
  accountNumber: string;
};

export function GiftCopyButton({ accountNumber }: GiftCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyAccountNumber() {
    await navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      className="inline-flex h-10 items-center justify-center border border-zinc-200 bg-white px-4 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-zinc-600 transition hover:border-amber-700 hover:text-amber-800"
      onClick={copyAccountNumber}
      type="button"
    >
      {copied ? "Tersalin" : "Salin nomor"}
    </button>
  );
}
