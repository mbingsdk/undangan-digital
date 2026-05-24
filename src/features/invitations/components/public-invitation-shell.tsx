/* eslint-disable @next/next/no-img-element */
"use client";

import { Headphones, Mail, Music2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type PublicInvitationShellProps = {
  brideName: string;
  coverImage?: string | null;
  groomName: string;
  musicUrl?: string | null;
  recipientName?: string;
  weddingDateLabel?: string;
};

export function PublicInvitationShell({
  brideName,
  coverImage,
  groomName,
  musicUrl,
  recipientName,
  weddingDateLabel,
}: PublicInvitationShellProps) {
  const [stage, setStage] = useState<
    "closed" | "opening" | "onboarding" | "open"
  >("closed");
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timeoutRefs = useRef<number[]>([]);

  useEffect(() => {
    document.body.style.overflow = stage === "open" ? "auto" : "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [stage]);

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(window.clearTimeout);
      timeoutRefs.current = [];
    };
  }, []);

  function queueTimeout(callback: () => void, delay: number) {
    const timeout = window.setTimeout(callback, delay);
    timeoutRefs.current.push(timeout);
  }

  function completeOnboarding() {
    timeoutRefs.current.forEach(window.clearTimeout);
    timeoutRefs.current = [];
    setStage("open");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  async function openInvitation() {
    timeoutRefs.current.forEach(window.clearTimeout);
    timeoutRefs.current = [];
    setStage("opening");

    if (audioRef.current) {
      const played = await audioRef.current
        .play()
        .then(() => true)
        .catch(() => false);
      setIsMusicPlaying(played);
    }

    queueTimeout(() => {
      setOnboardingStep(0);
      setStage("onboarding");
    }, 900);
    queueTimeout(() => setOnboardingStep(1), 3000);
    queueTimeout(() => setOnboardingStep(2), 5700);
    queueTimeout(completeOnboarding, 8500);
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
    <>
      {musicUrl ? (
        <audio loop preload="none" ref={audioRef} src={musicUrl}>
          <track kind="captions" />
        </audio>
      ) : null}

      {stage === "closed" || stage === "opening" ? (
        <section
          className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-950 px-5 py-10 text-center transition duration-1000 ${
            stage === "opening" ? "-translate-y-full opacity-0 blur-md" : ""
          }`}
        >
          <div className="absolute inset-0">
            {coverImage ? (
              <img
                alt=""
                className="invitation-kenburns h-full w-full object-cover opacity-60 transition duration-[8000ms] ease-out"
                src={coverImage}
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-950/70 to-slate-950" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_18%,rgba(251,191,36,0.22),transparent_30%),radial-gradient(circle_at_78%_72%,rgba(244,114,182,0.18),transparent_32%)]" />
          </div>

          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <span className="invitation-float absolute left-[12%] top-[18%] h-28 w-28 rounded-full border border-amber-200/15 bg-amber-200/5 blur-[1px]" />
            <span className="invitation-float absolute right-[10%] top-[28%] h-16 w-16 rounded-full border border-rose-200/15 bg-rose-200/5 [animation-delay:1s]" />
            <span className="invitation-drift absolute bottom-[16%] left-[18%] h-72 w-72 rounded-full bg-amber-500/20 blur-[90px]" />
            <span className="invitation-drift absolute right-[12%] top-[18%] h-80 w-80 rounded-full bg-rose-500/15 blur-[110px] [animation-delay:1.4s]" />
          </div>

          <div className="relative z-10 mx-auto flex min-h-[78vh] w-full max-w-4xl flex-col items-center justify-center">
            <div className="invitation-rise">
              <p className="text-xs font-semibold uppercase tracking-[0.42em] text-amber-200/75">
                The Wedding Of
              </p>
              <h1 className="mt-7 font-serif text-6xl font-medium leading-[0.9] tracking-tight text-amber-50 drop-shadow-2xl sm:text-8xl md:text-9xl">
                {groomName}
                <span className="my-3 block text-5xl font-light italic text-amber-300/80 sm:text-7xl">
                  &
                </span>
                {brideName}
              </h1>
              {weddingDateLabel ? (
                <p className="mt-8 text-xs font-light uppercase tracking-[0.28em] text-slate-300">
                  {weddingDateLabel}
                </p>
              ) : null}
            </div>

            {recipientName ? (
              <div className="invitation-rise mt-8 w-full max-w-xs border border-amber-100/20 bg-white/[0.06] px-5 py-4 shadow-2xl shadow-amber-950/20 backdrop-blur-xl [animation-delay:250ms]">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-amber-200/60">
                  Kepada Yth.
                </p>
                <p className="mt-2 text-lg font-medium text-amber-50">
                  {recipientName}
                </p>
              </div>
            ) : null}

            <button
              className="invitation-shimmer invitation-rise group relative mt-10 inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full border border-amber-200/30 bg-amber-200/10 px-8 text-xs font-semibold uppercase tracking-[0.22em] text-amber-50 shadow-[0_0_38px_rgba(251,191,36,0.16)] backdrop-blur-md transition hover:scale-[1.03] hover:border-amber-200/50 hover:bg-amber-200/15 [animation-delay:400ms] after:absolute after:inset-0 after:-translate-x-full after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent"
              onClick={openInvitation}
              type="button"
            >
              <Mail aria-hidden="true" size={18} />
              Buka Undangan
            </button>
          </div>
        </section>
      ) : null}

      {stage === "onboarding" ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-slate-950 text-center text-amber-50">
          <div className="absolute inset-0">
            {coverImage ? (
              <img
                alt=""
                className={`invitation-kenburns h-full w-full object-cover transition duration-[2600ms] ${
                  onboardingStep === 0
                    ? "scale-105 opacity-15 blur-sm"
                    : onboardingStep === 1
                      ? "scale-110 opacity-35"
                      : "scale-100 opacity-20 blur-[2px]"
                }`}
                src={coverImage}
              />
            ) : null}
            <div className="absolute inset-0 bg-slate-950/70" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,rgba(251,191,36,0.2),transparent_32%),radial-gradient(circle_at_76%_74%,rgba(244,114,182,0.16),transparent_34%)]" />
          </div>

          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <span className="invitation-drift absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/15 blur-[120px]" />
            <span className="invitation-float absolute left-[18%] top-[22%] h-3 w-3 rounded-full bg-amber-100/70 shadow-[0_0_26px_rgba(251,191,36,0.7)]" />
            <span className="invitation-float absolute right-[22%] top-[34%] h-2 w-2 rounded-full bg-rose-100/60 shadow-[0_0_24px_rgba(244,114,182,0.55)] [animation-delay:0.8s]" />
            <span className="invitation-float absolute bottom-[26%] left-[28%] h-2.5 w-2.5 rounded-full bg-emerald-100/50 shadow-[0_0_22px_rgba(16,185,129,0.45)] [animation-delay:1.4s]" />
            <span className="invitation-frame absolute left-1/2 top-1/2 h-[min(72vw,28rem)] w-[min(72vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-100/15" />
            <span className="invitation-orbit absolute left-1/2 top-1/2 h-[min(78vw,31rem)] w-[min(78vw,31rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-transparent border-t-amber-200/35" />
            <span className="absolute inset-x-8 top-8 h-24 border-x border-t border-amber-100/10" />
            <span className="absolute inset-x-8 bottom-8 h-24 border-x border-b border-amber-100/10" />
          </div>

          <div className="relative z-10 w-full overflow-hidden px-6 invitation-perspective">
            <div
              className="invitation-onboarding-track flex w-full"
              style={{
                transform: `translate3d(-${onboardingStep * 100}%, 0, 0)`,
              }}
            >
              <div
                className={`invitation-onboarding-panel flex min-w-full justify-center ${
                  onboardingStep === 0 ? "is-active" : ""
                }`}
              >
                <div className="invitation-scene flex max-w-sm flex-col items-center">
                  <div className="invitation-scene-line rounded-full border border-amber-200/20 bg-amber-200/10 p-6 shadow-[0_0_50px_rgba(251,191,36,0.16)]">
                    <Headphones className="h-10 w-10 text-amber-200/80" />
                  </div>
                  <h2 className="invitation-scene-line mt-7 font-serif text-3xl text-amber-100 sm:text-4xl [animation-delay:140ms]">
                    Pengalaman Audio
                  </h2>
                  <p className="invitation-scene-line mt-4 text-sm font-light leading-7 text-slate-300 [animation-delay:280ms]">
                    Untuk pengalaman yang lebih mendalam, nyalakan suara
                    perangkat Anda dan ikuti perjalanan kecil ini.
                  </p>
                  <div className="mt-9 h-px w-40 overflow-hidden bg-amber-100/10">
                    <span className="invitation-progress-sweep block h-full bg-gradient-to-r from-transparent via-amber-200/80 to-transparent" />
                  </div>
                </div>
              </div>

              <div
                className={`invitation-onboarding-panel flex min-w-full justify-center ${
                  onboardingStep === 1 ? "is-active" : ""
                }`}
              >
                <div className="invitation-scene max-w-2xl">
                  <p className="invitation-scene-line font-serif text-4xl font-light italic text-amber-100 drop-shadow-lg sm:text-6xl">
                    Dua jiwa,
                  </p>
                  <p className="invitation-scene-line mt-2 font-serif text-5xl font-medium text-amber-300 drop-shadow-xl sm:text-7xl [animation-delay:150ms]">
                    Satu Tujuan
                  </p>
                  <p className="invitation-scene-line mx-auto mt-7 max-w-md text-sm font-light leading-7 text-slate-300 [animation-delay:320ms]">
                    Sebuah cerita baru dimulai, dirayakan bersama orang-orang
                    terdekat yang kami kasihi.
                  </p>
                  <div className="mx-auto mt-9 h-px w-44 overflow-hidden bg-amber-100/10">
                    <span className="invitation-progress-sweep block h-full bg-gradient-to-r from-transparent via-rose-200/70 to-transparent" />
                  </div>
                </div>
              </div>

              <div
                className={`invitation-onboarding-panel flex min-w-full justify-center ${
                  onboardingStep === 2 ? "is-active" : ""
                }`}
              >
                <div className="invitation-scene max-w-3xl">
                  <span className="mx-auto mb-7 block h-px w-20 bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />
                  <p className="invitation-scene-line font-serif text-4xl font-light leading-tight text-amber-100 sm:text-6xl">
                    Melangkah bersama menyusuri waktu,
                  </p>
                  <p className="invitation-scene-line mt-3 font-serif text-4xl font-medium italic text-amber-300 sm:text-6xl [animation-delay:160ms]">
                    dalam keabadian.
                  </p>
                  <div className="invitation-scene-line mx-auto mt-9 rounded-full border border-amber-100/20 bg-white/[0.06] px-6 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-amber-100/70 backdrop-blur-xl [animation-delay:340ms]">
                    {groomName} & {brideName}
                  </div>
                  <div className="mx-auto mt-9 h-px w-48 overflow-hidden bg-amber-100/10">
                    <span className="invitation-progress-sweep block h-full bg-gradient-to-r from-transparent via-amber-200/80 to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
            {[0, 1, 2].map((step) => (
              <span
                className={`h-1.5 rounded-full transition-all ${
                  onboardingStep === step
                    ? "w-8 bg-amber-200/80"
                    : "w-1.5 bg-amber-200/25"
                }`}
                key={step}
              />
            ))}
          </div>

          <button
            className="absolute bottom-7 right-6 z-20 text-xs font-semibold uppercase tracking-[0.22em] text-amber-200/50 transition hover:text-amber-100"
            onClick={completeOnboarding}
            type="button"
          >
            Lewati
          </button>
        </div>
      ) : null}

      {musicUrl && stage === "open" ? (
        <button
          aria-label={isMusicPlaying ? "Jeda musik" : "Putar musik"}
          className="fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full border border-amber-100/20 bg-slate-900/80 text-amber-100 shadow-2xl shadow-black/30 backdrop-blur-xl transition hover:bg-slate-800"
          onClick={toggleMusic}
          type="button"
        >
          <Music2
            className={
              isMusicPlaying
                ? "[animation:invitation-spin-soft_4s_linear_infinite]"
                : ""
            }
            size={18}
          />
        </button>
      ) : null}
    </>
  );
}
