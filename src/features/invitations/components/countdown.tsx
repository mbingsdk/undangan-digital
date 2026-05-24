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
  const [remaining, setRemaining] = useState(() => getRemaining(targetDate));
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
    const interval = window.setInterval(() => {
      setRemaining(getRemaining(targetDate));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-0 border border-zinc-100 bg-white">
      {items.map(([label, value]) => (
        <div
          className="border-r border-zinc-100 px-2 py-5 text-center last:border-r-0"
          key={label}
        >
          <p className="font-serif text-3xl font-light tabular-nums text-zinc-800 sm:text-5xl">
            {String(value).padStart(2, "0")}
          </p>
          <p className="mt-2 text-[0.62rem] font-medium uppercase tracking-[0.22em] text-zinc-400">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
