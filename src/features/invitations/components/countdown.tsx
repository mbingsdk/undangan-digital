"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownProps = {
  targetDate: string;
};

function getRemaining(targetDate: string) {
  const difference = new Date(targetDate).getTime() - Date.now();
  const safeDifference = Math.max(0, difference);

  return {
    days: Math.floor(safeDifference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((safeDifference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((safeDifference / (1000 * 60)) % 60),
    seconds: Math.floor((safeDifference / 1000) % 60),
  };
}

export function Countdown({ targetDate }: CountdownProps) {
  const [remaining, setRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const items = useMemo(
    () => [
      ["Hari", remaining.days],
      ["Jam", remaining.hours],
      ["Menit", remaining.minutes],
      ["Detik", remaining.seconds],
    ],
    [remaining],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setRemaining(getRemaining(targetDate));
    }, 0);

    const interval = window.setInterval(() => {
      setRemaining(getRemaining(targetDate));
    }, 1000);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [targetDate]);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {items.map(([label, value]) => (
        <div
          className="invitation-tilt flex min-h-28 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-5 text-center shadow-2xl shadow-black/20 backdrop-blur-xl"
          data-invitation-reveal="pop"
          key={label}
        >
          <p className="font-serif text-4xl font-medium tabular-nums text-amber-100 sm:text-5xl">
            {String(value).padStart(2, "0")}
          </p>
          <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-amber-200/55">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
