const particles = Array.from({ length: 18 }, (_, index) => ({
  delay: `${(index % 6) * 0.45}s`,
  left: `${8 + ((index * 17) % 84)}%`,
  size: `${5 + (index % 4) * 3}px`,
  top: `${7 + ((index * 23) % 78)}%`,
}));

const sparks = Array.from({ length: 26 }, (_, index) => ({
  delay: `${(index % 13) * 0.7}s`,
  duration: `${7 + (index % 6)}s`,
  left: `${3 + ((index * 19) % 94)}%`,
  size: `${3 + (index % 3) * 2}px`,
  x: `${index % 2 === 0 ? 36 : -28}px`,
}));

export function CelebrationBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(251,191,36,0.18),transparent_32%),radial-gradient(circle_at_86%_18%,rgba(244,114,182,0.14),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.12),transparent_34%)]" />
      <div className="absolute inset-0 opacity-[0.09] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="invitation-drift absolute -left-28 top-20 h-72 w-72 rounded-full bg-amber-500/20 blur-[90px]" />
      <div className="invitation-drift absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-rose-500/16 blur-[120px] [animation-delay:1.2s]" />
      <div className="invitation-drift absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-emerald-500/10 blur-[110px] [animation-delay:2s]" />
      <div className="invitation-ribbon absolute left-6 top-[18%] h-40 w-12 rounded-full bg-gradient-to-b from-amber-200/25 via-rose-200/10 to-transparent blur-sm" />
      <div className="invitation-ribbon absolute right-8 top-[58%] h-48 w-10 rounded-full bg-gradient-to-b from-emerald-200/15 via-amber-200/18 to-transparent blur-sm [animation-delay:1.4s]" />
      {particles.map((particle, index) => (
        <span
          className="invitation-float absolute rounded-full bg-amber-100/50 shadow-[0_0_24px_rgba(251,191,36,0.45)]"
          key={index}
          style={{
            animationDelay: particle.delay,
            height: particle.size,
            left: particle.left,
            top: particle.top,
            width: particle.size,
          }}
        />
      ))}
      {sparks.map((spark, index) => (
        <span
          className="invitation-spark absolute top-0 rounded-full bg-amber-100/70 shadow-[0_0_18px_rgba(251,191,36,0.65)]"
          key={`spark-${index}`}
          style={{
            "--spark-duration": spark.duration,
            "--spark-x": spark.x,
            animationDelay: spark.delay,
            height: spark.size,
            left: spark.left,
            width: spark.size,
          } as CSSProperties}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950 to-transparent" />
    </div>
  );
}
import type { CSSProperties } from "react";
