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

  return <p className="text-sm text-red-700">{children}</p>;
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
      className={`border px-4 py-3 text-sm ${
        tone === "success"
          ? "border-emerald-100 bg-emerald-50 text-emerald-900"
          : "border-red-100 bg-red-50 text-red-800"
      }`}
    >
      {children}
    </p>
  );
}

const inputClass =
  "w-full border-0 border-b border-zinc-300 bg-transparent px-0 py-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-amber-700";
const textareaClass =
  "w-full resize-none border-0 border-b border-zinc-300 bg-transparent px-0 py-3 text-sm leading-6 text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-amber-700";

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
    <section className="bg-[#f9f9f7] px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-zinc-500">
            RSVP & Ucapan
          </p>
          <h2 className="mt-4 font-serif text-3xl font-light text-zinc-800 sm:text-4xl">
            Konfirmasi Kehadiran
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-sm font-light leading-7 text-zinc-500">
            Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i
            berkenan hadir dan mengirimkan doa terbaik.
          </p>
        </div>

        <div className="mt-14 grid gap-0 border border-zinc-200 bg-white md:grid-cols-2">
          <form
            className="border-b border-zinc-200 p-8 md:border-b-0 md:border-r md:p-12"
            onSubmit={submitRsvp}
          >
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-amber-800">
              RSVP
            </p>
            <h3 className="mt-3 font-serif text-2xl font-light text-zinc-800">
              Kehadiran Anda
            </h3>

            <div className="mt-8 space-y-7">
              <div>
                <input
                  className={inputClass}
                  defaultValue={guestName ?? ""}
                  id="rsvp-name"
                  maxLength={80}
                  name="name"
                  placeholder="Nama Lengkap"
                  required
                />
                <FieldError>{getFieldError(rsvpFields, "name")}</FieldError>
              </div>

              <div>
                <p className="mb-4 text-sm text-zinc-500">
                  Apakah Anda akan hadir?
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {attendanceOptions.map(([value, label]) => (
                    <label
                      className={`cursor-pointer border px-3 py-3 text-center text-[0.68rem] font-semibold uppercase tracking-[0.16em] transition ${
                        attendanceStatus === value
                          ? "border-amber-700 bg-amber-50 text-amber-900"
                          : "border-zinc-200 text-zinc-500 hover:border-zinc-300"
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
                  <input
                    className={inputClass}
                    defaultValue="1"
                    id="guest-count"
                    max={maxGuest ?? 10}
                    min="1"
                    name="guestCount"
                    placeholder="Jumlah tamu"
                    type="number"
                  />
                  {maxGuest ? (
                    <p className="mt-2 text-xs text-zinc-500">
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
                <textarea
                  className={textareaClass}
                  id="rsvp-message"
                  maxLength={500}
                  name="message"
                  placeholder="Pesan singkat"
                  rows={3}
                />
                <FieldError>{getFieldError(rsvpFields, "message")}</FieldError>
              </div>

              {rsvpError ? <Notice tone="error">{rsvpError}</Notice> : null}
              {rsvpStatus ? <Notice tone="success">{rsvpStatus}</Notice> : null}

              <button
                className="h-12 w-full bg-zinc-900 px-5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
                disabled={isSubmittingRsvp}
                type="submit"
              >
                {isSubmittingRsvp ? "Mengirim..." : "Kirim RSVP"}
              </button>
            </div>
          </form>

          <form className="p-8 md:p-12" onSubmit={submitWish}>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-amber-800">
              Ucapan
            </p>
            <h3 className="mt-3 font-serif text-2xl font-light text-zinc-800">
              Doa Terbaik
            </h3>

            <div className="mt-8 space-y-7">
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
                  rows={6}
                />
                <FieldError>{getFieldError(wishFields, "message")}</FieldError>
              </div>

              {wishError ? <Notice tone="error">{wishError}</Notice> : null}
              {wishStatus ? <Notice tone="success">{wishStatus}</Notice> : null}

              <button
                className="h-12 w-full bg-zinc-900 px-5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
                disabled={isSubmittingWish}
                type="submit"
              >
                {isSubmittingWish ? "Mengirim..." : "Kirim Ucapan"}
              </button>
            </div>
          </form>
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-zinc-500">
              Doa dan Harapan
            </p>
            <h3 className="mt-4 font-serif text-3xl font-light text-zinc-800">
              Ucapan Tamu
            </h3>
          </div>

          {wishes.length > 0 ? (
            <div className="mt-9 max-h-[28rem] space-y-7 overflow-y-auto pr-2">
              {wishes.map((wish) => (
                <article
                  className="border-l border-amber-700/30 pl-6 text-sm leading-7"
                  key={wish.id}
                >
                  <p className="font-medium text-zinc-800">{wish.name}</p>
                  <p className="mt-2 font-serif italic text-zinc-500">
                    &quot;{wish.message}&quot;
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-9 border border-dashed border-zinc-200 bg-white/70 px-5 py-8 text-center">
              <p className="text-sm leading-6 text-zinc-500">
                Belum ada ucapan. Jadilah yang pertama mengirim doa terbaik.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
