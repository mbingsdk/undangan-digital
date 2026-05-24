/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";

type PublicInvitationShellProps = {
  brideName: string;
  children: React.ReactNode;
  coverImage?: string | null;
  groomName: string;
  musicUrl?: string | null;
  recipientName?: string;
  weddingDateLabel?: string;
};

export function PublicInvitationShell({
  brideName,
  children,
  coverImage,
  groomName,
  musicUrl,
  recipientName,
  weddingDateLabel,
}: PublicInvitationShellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  async function openInvitation() {
    setIsOpen(true);

    if (audioRef.current) {
      const played = await audioRef.current
        .play()
        .then(() => true)
        .catch(() => false);
      setIsMusicPlaying(played);
    }
  }

  async function toggleMusic() {
    if (!audioRef.current) {
      return;
    }

    if (audioRef.current.paused) {
      const played = await audioRef.current
        .play()
        .then(() => true)
        .catch(() => false);
      setIsMusicPlaying(played);
      return;
    }

    audioRef.current.pause();
    setIsMusicPlaying(false);
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-800 selection:bg-amber-100 selection:text-amber-900">
      {musicUrl ? (
        <audio loop preload="none" ref={audioRef} src={musicUrl}>
          <track kind="captions" />
        </audio>
      ) : null}

      {!isOpen ? (
        <section className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#171717] px-5 py-10">
          {coverImage ? (
            <img
              alt=""
              className="absolute inset-0 h-full w-full scale-105 object-cover opacity-80"
              src={coverImage}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/85" />

          <div className="relative mx-auto flex min-h-[80vh] w-full max-w-4xl flex-col items-center justify-center text-center text-white">
            <p className="text-xs font-medium uppercase tracking-[0.42em] text-zinc-200 sm:text-sm">
              The Wedding of
            </p>
            <h1 className="mt-7 text-6xl font-light leading-[0.95] tracking-normal drop-shadow-xl sm:text-8xl md:text-9xl">
              {groomName}
              <span className="my-3 block text-5xl font-light text-amber-200/80 sm:text-7xl">
                &
              </span>
              {brideName}
            </h1>
            {weddingDateLabel ? (
              <p className="mt-7 text-xs font-medium uppercase tracking-[0.28em] text-zinc-200">
                {weddingDateLabel}
              </p>
            ) : null}
            {recipientName ? (
              <div className="mx-auto mt-8 max-w-xs border border-white/30 bg-white/10 px-5 py-4 backdrop-blur-sm">
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-zinc-200">
                  Kepada Yth.
                </p>
                <p className="mt-2 text-lg font-medium text-white">
                  {recipientName}
                </p>
              </div>
            ) : null}
            <button
              className="mt-14 inline-flex h-12 min-w-52 items-center justify-center border border-white/45 bg-white/0 px-8 text-xs font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-sm transition hover:bg-white/12"
              onClick={openInvitation}
              type="button"
            >
              Buka Undangan
            </button>
          </div>
        </section>
      ) : null}

      {musicUrl && isOpen ? (
        <button
          aria-label={isMusicPlaying ? "Jeda musik" : "Putar musik"}
          className="fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full border border-zinc-200/60 bg-white/90 text-amber-800 shadow-xl shadow-zinc-900/10 backdrop-blur transition hover:bg-white"
          onClick={toggleMusic}
          type="button"
        >
          <span
            className={`h-4 w-4 rounded-full border border-current ${
              isMusicPlaying ? "animate-spin border-dashed" : ""
            }`}
          />
        </button>
      ) : null}

      <div
        className={`transition duration-700 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
