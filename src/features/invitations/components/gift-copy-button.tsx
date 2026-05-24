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
      className="inline-flex h-11 items-center justify-center rounded-full border border-amber-100/20 bg-amber-100/10 px-5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-amber-50 transition hover:border-amber-100/40 hover:bg-amber-100/15"
      onClick={copyAccountNumber}
      type="button"
    >
      {copied ? "Tersalin" : "Salin nomor"}
    </button>
  );
}
