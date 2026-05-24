"use client";

import { useMemo, useState } from "react";

type GuestLinkActionsProps = {
  brideName: string;
  groomName: string;
  guestName: string;
  phone?: string | null;
  url: string;
};

function buildWhatsAppMessage({
  brideName,
  groomName,
  guestName,
  url,
}: Omit<GuestLinkActionsProps, "phone">) {
  return `Assalamu'alaikum Wr. Wb.

Kepada Yth. ${guestName},

Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan kami.

${groomName} & ${brideName}

Silakan buka undangan digital melalui link berikut:
${url}

Terima kasih.`;
}

function getWhatsAppHref(phone: string | null | undefined, message: string) {
  const encodedMessage = encodeURIComponent(message);
  const cleanPhone = phone?.replace(/[^\d]/g, "");

  if (cleanPhone) {
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }

  return `https://wa.me/?text=${encodedMessage}`;
}

export function GuestLinkActions({
  brideName,
  groomName,
  guestName,
  phone,
  url,
}: GuestLinkActionsProps) {
  const [copied, setCopied] = useState(false);
  const message = useMemo(
    () =>
      buildWhatsAppMessage({
        brideName,
        groomName,
        guestName,
        url,
      }),
    [brideName, groomName, guestName, url],
  );
  const whatsappHref = getWhatsAppHref(phone, message);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        className="inline-flex h-9 items-center justify-center border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-100"
        onClick={copyLink}
        type="button"
      >
        {copied ? "Link tersalin" : "Copy link"}
      </button>
      <a
        className="inline-flex h-9 items-center justify-center bg-emerald-700 px-3 text-sm font-medium text-white transition hover:bg-emerald-800"
        href={whatsappHref}
        rel="noopener noreferrer"
        target="_blank"
      >
        Share WhatsApp
      </a>
    </div>
  );
}
