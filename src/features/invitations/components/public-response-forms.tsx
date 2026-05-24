"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type FieldErrors = Record<string, string[] | undefined>;

type Wish = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

type PublicResponseFormsProps = {
  guestCode?: string | null;
  guestName?: string | null;
  initialWishes: Wish[];
  maxGuest?: number | null;
  slug: string;
};

const attendanceOptions = [
  ["ATTENDING", "Hadir"],
  ["NOT_ATTENDING", "Tidak Hadir"],
  ["MAYBE", "Mungkin"],
] as const;

function getFieldError(fields: FieldErrors | undefined, name: string) {
  return fields?.[name]?.[0];
}

function FieldError({ children }: { children?: string }) {
  if (!children) {
    return null;
  }

  return <p className="mt-2 text-sm text-rose-200">{children}</p>;
}

function Notice({
  children,
  tone,
}: {
  children: string;
  tone: "error" | "success";
}) {
  return (
    <p
      className={`rounded-2xl border px-4 py-3 text-sm ${
        tone === "success"
          ? "border-emerald-200/15 bg-emerald-300/10 text-emerald-100"
          : "border-rose-200/15 bg-rose-300/10 text-rose-100"
      }`}
    >
      {children}
    </p>
  );
}

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-amber-50 outline-none transition placeholder:text-slate-500 focus:border-amber-200/45 focus:bg-white/[0.09]";
const textareaClass =
  "w-full resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm leading-6 text-amber-50 outline-none transition placeholder:text-slate-500 focus:border-amber-200/45 focus:bg-white/[0.09]";

export function PublicResponseForms({
  guestCode,
  guestName,
  initialWishes,
  maxGuest,
  slug,
}: PublicResponseFormsProps) {
  const [attendanceStatus, setAttendanceStatus] = useState("ATTENDING");
  const [rsvpStatus, setRsvpStatus] = useState<string | null>(null);
  const [rsvpError, setRsvpError] = useState<string | null>(null);
  const [rsvpFields, setRsvpFields] = useState<FieldErrors>();
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [wishStatus, setWishStatus] = useState<string | null>(null);
  const [wishError, setWishError] = useState<string | null>(null);
  const [wishFields, setWishFields] = useState<FieldErrors>();
  const [isSubmittingWish, setIsSubmittingWish] = useState(false);
  const [wishes, setWishes] = useState(initialWishes);

  async function submitRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRsvpStatus(null);
    setRsvpError(null);
    setRsvpFields(undefined);
    setIsSubmittingRsvp(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch(`/api/public/invitations/${slug}/rsvp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("name"),
        attendanceStatus: formData.get("attendanceStatus"),
        guestCode,
        guestCount: formData.get("guestCount"),
        message: formData.get("message"),
      }),
    });
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
      fields?: FieldErrors;
    };

    setIsSubmittingRsvp(false);

    if (!response.ok) {
      setRsvpError(data.error ?? "RSVP gagal dikirim.");
      setRsvpFields(data.fields);
      return;
    }

    form.reset();
    setAttendanceStatus("ATTENDING");
    setRsvpStatus("Terima kasih, RSVP Anda sudah tersimpan.");
  }

  async function submitWish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setWishStatus(null);
    setWishError(null);
    setWishFields(undefined);
    setIsSubmittingWish(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch(`/api/public/invitations/${slug}/wishes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("name"),
        message: formData.get("message"),
      }),
    });
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
      fields?: FieldErrors;
      wish?: Wish;
    };

    setIsSubmittingWish(false);

    if (!response.ok || !data.wish) {
      setWishError(data.error ?? "Ucapan gagal dikirim.");
      setWishFields(data.fields);
      return;
    }

    form.reset();
    setWishStatus("Terima kasih, ucapan Anda sudah terkirim.");
    setWishes((current) => [data.wish as Wish, ...current]);
  }

  return (
    <section className="relative overflow-hidden bg-slate-950 px-5 py-28 sm:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(251,191,36,0.12),transparent_30%),radial-gradient(circle_at_90%_60%,rgba(244,114,182,0.1),transparent_34%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl" data-invitation-reveal="up">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200/60">
            RSVP & Ucapan
          </p>
          <h2 className="mt-4 font-serif text-4xl font-medium text-amber-50 sm:text-6xl">
            Hadir di Hari Bahagia
          </h2>
          <p className="mt-5 max-w-xl text-sm font-light leading-7 text-slate-300">
            Konfirmasi kehadiran dan tinggalkan doa terbaik. Setiap ucapan akan
            menjadi bagian dari kenangan hari ini.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="invitation-perspective" data-invitation-reveal="left">
            <form
              className="invitation-tilt rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-8"
              onSubmit={submitRsvp}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200/60">
                Konfirmasi
              </p>
              <h3 className="mt-3 font-serif text-3xl text-amber-50">
                RSVP
              </h3>

              <div className="mt-8 space-y-6">
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-amber-100/65">
                    Nama
                  </label>
                  <input
                    className={inputClass}
                    defaultValue={guestName ?? ""}
                    id="rsvp-name"
                    maxLength={80}
                    name="name"
                    placeholder="Nama lengkap"
                    required
                  />
                  <FieldError>{getFieldError(rsvpFields, "name")}</FieldError>
                </div>

                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-amber-100/65">
                    Kehadiran
                  </p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {attendanceOptions.map(([value, label]) => (
                      <label
                        className={`cursor-pointer rounded-2xl border px-3 py-3 text-center text-[0.68rem] font-semibold uppercase tracking-[0.15em] transition ${
                          attendanceStatus === value
                            ? "border-amber-200/45 bg-amber-200/12 text-amber-50"
                            : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/20"
                        }`}
                        key={value}
                      >
                        <input
                          checked={attendanceStatus === value}
                          className="sr-only"
                          name="attendanceStatus"
                          onChange={() => setAttendanceStatus(value)}
                          type="radio"
                          value={value}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                  <FieldError>
                    {getFieldError(rsvpFields, "attendanceStatus")}
                  </FieldError>
                </div>

                {attendanceStatus === "ATTENDING" ? (
                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-amber-100/65">
                      Jumlah tamu
                    </label>
                    <input
                      className={inputClass}
                      defaultValue="1"
                      id="guest-count"
                      max={maxGuest ?? 10}
                      min="1"
                      name="guestCount"
                      type="number"
                    />
                    {maxGuest ? (
                      <p className="mt-2 text-xs text-slate-400">
                        Maksimal {maxGuest} tamu untuk link undangan ini.
                      </p>
                    ) : null}
                    <FieldError>
                      {getFieldError(rsvpFields, "guestCount")}
                    </FieldError>
                  </div>
                ) : (
                  <input name="guestCount" type="hidden" value="1" />
                )}

                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-amber-100/65">
                    Pesan
                  </label>
                  <textarea
                    className={textareaClass}
                    id="rsvp-message"
                    maxLength={500}
                    name="message"
                    placeholder="Pesan singkat untuk mempelai"
                    rows={4}
                  />
                  <FieldError>
                    {getFieldError(rsvpFields, "message")}
                  </FieldError>
                </div>

                {rsvpError ? <Notice tone="error">{rsvpError}</Notice> : null}
                {rsvpStatus ? (
                  <Notice tone="success">{rsvpStatus}</Notice>
                ) : null}

                <button
                  className="w-full rounded-2xl border border-amber-200/30 bg-amber-100/12 px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-amber-50 transition hover:bg-amber-100/20 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSubmittingRsvp}
                  type="submit"
                >
                  {isSubmittingRsvp ? "Mengirim..." : "Kirim RSVP"}
                </button>
              </div>
            </form>
          </div>

          <div className="grid gap-6" data-invitation-reveal="right">
            <form
              className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-8"
              onSubmit={submitWish}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200/60">
                Doa Terbaik
              </p>
              <h3 className="mt-3 font-serif text-3xl text-amber-50">
                Kirim Ucapan
              </h3>
              <div className="mt-8 grid gap-5">
                <div>
                  <input
                    className={inputClass}
                    id="wish-name"
                    maxLength={80}
                    name="name"
                    placeholder="Nama Anda"
                    required
                  />
                  <FieldError>{getFieldError(wishFields, "name")}</FieldError>
                </div>
                <div>
                  <textarea
                    className={textareaClass}
                    id="wish-message"
                    maxLength={500}
                    name="message"
                    placeholder="Tulis ucapan dan doa Anda..."
                    required
                    rows={5}
                  />
                  <FieldError>
                    {getFieldError(wishFields, "message")}
                  </FieldError>
                </div>
                {wishError ? <Notice tone="error">{wishError}</Notice> : null}
                {wishStatus ? (
                  <Notice tone="success">{wishStatus}</Notice>
                ) : null}
                <button
                  className="rounded-2xl border border-amber-200/30 bg-amber-100/12 px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-amber-50 transition hover:bg-amber-100/20 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSubmittingWish}
                  type="submit"
                >
                  {isSubmittingWish ? "Mengirim..." : "Kirim Ucapan"}
                </button>
              </div>
            </form>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl sm:p-8">
              <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200/60">
                    Buku Tamu
                  </p>
                  <h3 className="mt-2 font-serif text-3xl text-amber-50">
                    Ucapan Tamu
                  </h3>
                </div>
                <span className="rounded-full bg-amber-100/10 px-3 py-1 text-xs text-amber-100/70">
                  {wishes.length}
                </span>
              </div>

              {wishes.length > 0 ? (
                <div className="mt-6 max-h-[30rem] space-y-4 overflow-y-auto pr-1">
                  {wishes.map((wish) => (
                    <article
                      className="rounded-2xl border border-white/5 bg-slate-900/55 p-5"
                      data-invitation-reveal="up"
                      key={wish.id}
                    >
                      <p className="text-sm font-semibold text-amber-50">
                        {wish.name}
                      </p>
                      <p className="mt-3 text-sm font-light leading-7 text-slate-300">
                        &quot;{wish.message}&quot;
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.04] px-5 py-8 text-center">
                  <p className="text-sm leading-6 text-slate-300">
                    Belum ada ucapan. Jadilah yang pertama mengirim doa terbaik.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
