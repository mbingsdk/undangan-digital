/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Calendar,
  ChevronDown,
  Clock,
  CreditCard,
  ImageIcon,
  MapPin,
  Share2,
} from "lucide-react";
import { CelebrationBackground } from "@/components/invitation/celebration-background";
import { InvitationMotionController } from "@/components/invitation/invitation-motion-controller";
import {
  PublicEmptyState,
  SectionHeading,
} from "@/components/invitation/section-heading";
import {
  getPublicGuestForInvitation,
  markGuestOpened,
} from "@/features/guests/service";
import { Countdown } from "@/features/invitations/components/countdown";
import { GiftCopyButton } from "@/features/invitations/components/gift-copy-button";
import { PublicInvitationShell } from "@/features/invitations/components/public-invitation-shell";
import { PublicResponseForms } from "@/features/invitations/components/public-response-forms";
import {
  buildInvitationDescription,
  getAbsolutePublicUrl,
  getInvitationOgImageUrl,
  getInvitationPublicUrl,
} from "@/features/invitations/metadata";
import { getPublicInvitationBySlug } from "@/features/invitations/service";

type PublicInvitationPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    guest?: string | string[];
  }>;
};

function getPublicInvitationUrl(slug: string, guestCode?: string | null) {
  return getInvitationPublicUrl(slug, guestCode);
}

function getDatePart(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
  }).format(date);
}

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatEventTime(startTime: string, endTime?: string | null) {
  return endTime ? `${startTime} - ${endTime}` : startTime;
}

function buildWhatsAppUrl({
  brideName,
  groomName,
  publicUrl,
}: {
  brideName: string;
  groomName: string;
  publicUrl: string;
}) {
  const coupleNames = `${groomName} & ${brideName}`;
  const message = `Assalamu'alaikum Wr. Wb.

Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan kami:

${coupleNames}

Silakan buka undangan digital kami melalui link berikut:
${publicUrl}

Terima kasih.`;

  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export async function generateMetadata({
  params,
}: PublicInvitationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await getPublicInvitationBySlug(slug);

  if (!invitation) {
    return {
      title: "Undangan tidak ditemukan",
    };
  }

  const coupleNames = `${invitation.groomName} & ${invitation.brideName}`;
  const firstEvent = invitation.events[0];
  const eventDateLabel = firstEvent ? formatDate(firstEvent.date) : undefined;
  const description = buildInvitationDescription({
    brideName: invitation.brideName,
    eventDateLabel,
    groomName: invitation.groomName,
  });
  const publicUrl = getInvitationPublicUrl(invitation.slug);
  const ogImageUrl = getInvitationOgImageUrl(invitation.slug);
  const title = `${coupleNames} | ${invitation.title}`;

  return {
    alternates: {
      canonical: publicUrl,
    },
    authors: [
      {
        name: "Undangan Digital",
      },
    ],
    category: "wedding invitation",
    description,
    keywords: [
      "undangan digital",
      "undangan pernikahan",
      "wedding invitation",
      invitation.groomName,
      invitation.brideName,
      invitation.title,
    ],
    openGraph: {
      description,
      images: [
        {
          alt: `Undangan pernikahan ${coupleNames}`,
          height: 630,
          url: ogImageUrl,
          width: 1200,
        },
        ...(invitation.coverImage
          ? [
              {
                alt: `Cover undangan ${coupleNames}`,
                height: 1200,
                url: getAbsolutePublicUrl(invitation.coverImage),
                width: 1200,
              },
            ]
          : []),
      ],
      locale: "id_ID",
      siteName: "Undangan Digital",
      title,
      type: "website",
      url: publicUrl,
    },
    robots: {
      follow: true,
      googleBot: {
        follow: true,
        index: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
      index: true,
    },
    title,
    twitter: {
      card: "summary_large_image",
      description,
      images: [ogImageUrl],
      title,
    },
  };
}

export default async function PublicInvitationPage({
  params,
  searchParams,
}: PublicInvitationPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const guestCodeParam = Array.isArray(resolvedSearchParams?.guest)
    ? resolvedSearchParams?.guest[0]
    : resolvedSearchParams?.guest;
  const invitation = await getPublicInvitationBySlug(slug);

  if (!invitation) {
    notFound();
  }

  const guest = await getPublicGuestForInvitation({
    guestCode: guestCodeParam,
    invitationId: invitation.id,
  });

  if (guest && !guest.openedAt) {
    await markGuestOpened(guest.id);
  }

  const firstEvent = invitation.events[0];
  const weddingDateLabel = firstEvent ? formatDate(firstEvent.date) : undefined;
  const displayDateLabel = weddingDateLabel ?? "Tanggal akan diumumkan";
  const countdownTarget = firstEvent
    ? `${getDatePart(firstEvent.date)}T${firstEvent.startTime}:00`
    : undefined;
  const publicUrl = getPublicInvitationUrl(invitation.slug, guest?.guestCode);
  const whatsAppUrl = buildWhatsAppUrl({
    brideName: invitation.brideName,
    groomName: invitation.groomName,
    publicUrl,
  });
  const initialWishes = invitation.wishes.map((wish) => ({
    id: wish.id,
    name: wish.name,
    message: wish.message,
    createdAt: wish.createdAt.toISOString(),
  }));
  const coupleNames = `${invitation.groomName} & ${invitation.brideName}`;
  const recipientName = guest?.name ?? "Bapak/Ibu/Saudara/i";

  return (
    <>
      <PublicInvitationShell
        brideName={invitation.brideName}
        coverImage={invitation.coverImage}
        groomName={invitation.groomName}
        musicUrl={invitation.musicUrl}
        recipientName={recipientName}
        weddingDateLabel={displayDateLabel}
      />
      <main className="invitation-experience relative min-h-screen overflow-hidden bg-slate-950 text-amber-50">
        <InvitationMotionController />
        <CelebrationBackground />

        <section className="relative z-10 flex min-h-[115vh] items-center justify-center overflow-hidden px-5 py-24 text-center">
          <div className="absolute inset-0">
            {invitation.coverImage ? (
              <img
                alt=""
                className="invitation-kenburns h-full w-full object-cover object-center opacity-45"
                src={invitation.coverImage}
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/35 via-slate-950/65 to-slate-950" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0%,rgba(2,6,23,0.42)_50%,rgba(2,6,23,0.92)_100%)]" />
          </div>

          <div className="relative mx-auto max-w-5xl invitation-rise">
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-amber-200/70">
              Maha Suci Allah
            </p>
            <div className="mt-10">
              <h1 className="font-serif text-6xl font-medium leading-[0.9] tracking-tight text-amber-50 drop-shadow-2xl sm:text-8xl lg:text-9xl">
                {invitation.groomName}
              </h1>
              <p className="my-2 font-serif text-5xl font-light italic text-amber-300/80 sm:text-7xl">
                &
              </p>
              <h1 className="font-serif text-6xl font-medium leading-[0.9] tracking-tight text-amber-50 drop-shadow-2xl sm:text-8xl lg:text-9xl">
                {invitation.brideName}
              </h1>
            </div>

            <p className="mx-auto mt-12 max-w-2xl whitespace-pre-line text-sm font-light leading-8 text-slate-300 sm:text-base">
              &quot;
              {invitation.openingText ??
                "Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada hari bahagia kami."}
              &quot;
            </p>

            <div className="mx-auto mt-10 max-w-sm rounded-3xl border border-amber-100/15 bg-white/[0.06] px-6 py-5 shadow-2xl shadow-black/25 backdrop-blur-xl">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-amber-200/60">
                Kepada Yth.
              </p>
              <p className="mt-3 text-xl font-medium text-amber-50">
                {recipientName}
              </p>
            </div>
          </div>

          <div className="absolute bottom-12 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-amber-200/50">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.24em]">
              Scroll to Explore
            </span>
            <ChevronDown className="invitation-float h-5 w-5" />
          </div>
        </section>

        <section className="relative z-10 overflow-hidden px-5 py-28 sm:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(251,191,36,0.12),transparent_34%),radial-gradient(circle_at_88%_75%,rgba(16,185,129,0.1),transparent_36%)]" />
            <div
              className="relative mx-auto max-w-5xl"
              data-invitation-reveal="pop"
            >
            <div className="rounded-[2rem] bg-gradient-to-b from-amber-200/20 to-transparent p-px shadow-2xl shadow-black/25">
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/65 px-5 py-10 text-center backdrop-blur-2xl sm:px-10 sm:py-14">
                <Calendar className="mx-auto mb-6 h-8 w-8 text-amber-200/65" />
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200/60">
                  Save The Date
                </p>
                <h2 className="mx-auto mt-4 max-w-3xl font-serif text-4xl font-medium text-amber-50 sm:text-6xl">
                  {displayDateLabel}
                </h2>
                <div className="mx-auto mt-12 max-w-4xl">
                  {countdownTarget ? (
                    <Countdown targetDate={countdownTarget} />
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                      {["Hari", "Jam", "Menit", "Detik"].map((label) => (
                        <div
                          className="flex min-h-28 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-5 text-center shadow-2xl shadow-black/20 backdrop-blur-xl"
                          key={label}
                        >
                          <p className="font-serif text-4xl font-medium tabular-nums text-amber-100 sm:text-5xl">
                            00
                          </p>
                          <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-amber-200/55">
                            {label}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {!countdownTarget ? (
                  <p className="mx-auto mt-7 max-w-md text-sm font-light leading-7 text-slate-300">
                    Countdown akan aktif setelah admin menambahkan tanggal acara.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 px-5 py-28 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              description="Rangkaian acara disusun sebagai perjalanan hangat untuk merayakan awal cerita baru."
              eyebrow="Rangkaian"
              title="Acara Pernikahan"
            />

            <div className="mt-16 grid gap-6 md:grid-cols-2">
              {invitation.events.length > 0 ? (
                invitation.events.map((event, index) => (
                  <article
                    className="invitation-perspective relative group"
                    data-invitation-reveal={index % 2 === 0 ? "left" : "right"}
                    key={`${event.title}-${event.sortOrder}`}
                  >
                    <div className="absolute inset-0 rounded-[2.5rem] bg-amber-500/20 opacity-0 blur-2xl transition duration-700 group-hover:opacity-100" />
                    <div className="invitation-tilt relative flex h-full flex-col rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-slate-900/85 to-slate-900/45 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-10">
                      <div className="absolute right-10 top-0 h-14 w-px bg-gradient-to-b from-amber-200/50 to-transparent" />
                      <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold tracking-[0.18em] text-amber-100/80">
                        0{index + 1}
                      </div>
                      <h3 className="font-serif text-3xl text-amber-100 sm:text-4xl">
                        {event.title}
                      </h3>
                      <p className="mt-3 text-sm text-amber-200/55">
                        {formatShortDate(event.date)}
                      </p>

                      <div className="mt-9 flex-1 space-y-6 text-sm leading-7 text-slate-300">
                        <div className="flex items-start gap-4">
                          <span className="rounded-full border border-white/10 bg-white/5 p-2 text-amber-100/75">
                            <Clock size={17} />
                          </span>
                          <div>
                            <p className="font-medium text-slate-100">Waktu</p>
                            <p className="mt-1 font-light">
                              {formatEventTime(event.startTime, event.endTime)}
                            </p>
                          </div>
                        </div>

                        {event.venueName || event.address ? (
                          <div className="flex items-start gap-4">
                            <span className="rounded-full border border-white/10 bg-white/5 p-2 text-amber-100/75">
                              <MapPin size={17} />
                            </span>
                            <div>
                              {event.venueName ? (
                                <p className="font-medium text-slate-100">
                                  {event.venueName}
                                </p>
                              ) : null}
                              {event.address ? (
                                <p className="mt-1 font-light">
                                  {event.address}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        ) : null}
                      </div>

                      {event.mapsUrl ? (
                        <a
                          className="mt-9 inline-flex items-center justify-center rounded-full border border-amber-100/20 bg-amber-100/10 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-amber-50 transition hover:bg-amber-100/20"
                          href={event.mapsUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Lihat Lokasi Maps
                        </a>
                      ) : null}
                    </div>
                    <span className="absolute -left-2 -top-2 text-xs font-semibold text-amber-200/30">
                      0{index + 1}
                    </span>
                  </article>
                ))
              ) : (
                <div className="md:col-span-2">
                  <PublicEmptyState>
                    Detail acara belum tersedia.
                  </PublicEmptyState>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="relative z-10 overflow-hidden px-5 py-28 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              description="Potongan momen yang dirangkai seperti celebration board, lembut di mobile dan tetap kaya di desktop."
              eyebrow="Our Memories"
              title="Galeri"
            />

            {invitation.galleries.length > 0 ? (
              <div className="mt-16 columns-1 gap-5 space-y-5 sm:columns-2 lg:columns-3">
                {invitation.galleries.map((image, index) => (
                  <figure
                    className="group relative break-inside-avoid overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20"
                    data-invitation-reveal="pop"
                    key={`${image.imageUrl}-${image.sortOrder}`}
                  >
                    <img
                      alt={image.caption ?? `Gallery ${index + 1}`}
                      className="block h-auto w-full object-cover transition duration-1000 ease-out group-hover:scale-110"
                      loading="lazy"
                      src={image.imageUrl}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 transition duration-500 group-hover:bg-transparent">
                      <ImageIcon
                        aria-hidden="true"
                        className="text-amber-50/0 transition duration-500 group-hover:text-amber-50"
                        size={28}
                        strokeWidth={1.3}
                      />
                    </div>
                    {image.caption ? (
                      <figcaption className="border-t border-white/10 bg-slate-900/75 px-4 py-3 text-xs leading-5 text-slate-300 backdrop-blur">
                        {image.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            ) : (
              <div className="mt-10">
                <PublicEmptyState>Gallery belum tersedia.</PublicEmptyState>
              </div>
            )}
          </div>
        </section>

        {invitation.gifts.length > 0 ? (
          <section className="relative z-10 overflow-hidden px-5 py-28 sm:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(251,191,36,0.12),transparent_36%)]" />
            <div className="relative mx-auto max-w-4xl text-center">
              <SectionHeading
                description="Doa dan restu Anda adalah karunia yang sangat berarti. Jika ingin memberikan tanda kasih, informasi berikut dapat digunakan."
                eyebrow="Wedding Gift"
                title="Tanda Kasih"
              />
              <div className="mt-14 grid gap-5 md:grid-cols-2">
                {invitation.gifts.map((gift) => (
                  <article
                    className="invitation-tilt rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 text-left shadow-2xl shadow-black/20 backdrop-blur-xl"
                    data-invitation-reveal="up"
                    key={`${gift.providerName}-${gift.accountNumber}`}
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-amber-100">
                          {gift.providerName}
                        </h3>
                        <p className="mt-4 break-all text-xl tracking-wider text-slate-100">
                          {gift.accountNumber}
                        </p>
                        <p className="mt-2 text-xs text-slate-400">
                          a.n {gift.accountHolder}
                        </p>
                      </div>
                      <CreditCard className="shrink-0 text-amber-100/45" />
                    </div>
                    {gift.note ? (
                      <p className="mt-5 text-sm font-light leading-6 text-slate-300">
                        {gift.note}
                      </p>
                    ) : null}
                    <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                      {gift.qrImage ? (
                        <img
                          alt={`QR ${gift.providerName}`}
                          className="h-28 w-28 rounded-2xl border border-white/10 bg-white object-cover"
                          loading="lazy"
                          src={gift.qrImage}
                        />
                      ) : null}
                      <GiftCopyButton accountNumber={gift.accountNumber} />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <PublicResponseForms
          guestCode={guest?.guestCode}
          guestName={guest?.name}
          initialWishes={initialWishes}
          maxGuest={guest?.maxGuest}
          slug={invitation.slug}
        />

        <section className="relative z-10 overflow-hidden px-5 py-28 text-center sm:px-8">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-slate-950" />
          <div
            className="relative mx-auto max-w-3xl"
            data-invitation-reveal="pop"
          >
            <span className="invitation-pulse mx-auto mb-7 block h-px w-20 bg-gradient-to-r from-transparent via-amber-200/50 to-transparent" />
            <p className="text-sm font-light leading-8 text-amber-200/65">
              Terima Kasih
            </p>
            <p className="mx-auto mt-6 max-w-xl whitespace-pre-line text-sm font-light leading-8 text-slate-300 sm:text-base">
              {invitation.closingText ??
                "Merupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu."}
            </p>

            <h2 className="mt-12 font-serif text-5xl font-medium tracking-tight text-amber-50 sm:text-7xl">
              {coupleNames}
            </h2>

            <a
              className="mx-auto mt-12 inline-flex items-center justify-center gap-3 rounded-full border border-emerald-200/20 bg-emerald-400/15 px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-50 shadow-2xl shadow-emerald-950/20 transition hover:bg-emerald-400/25"
              href={whatsAppUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Share2 aria-hidden="true" size={17} strokeWidth={1.8} />
              Bagikan via WhatsApp
            </a>
          </div>
        </section>

        <footer className="relative z-10 border-t border-white/10 bg-slate-950 px-5 py-8 text-center">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-slate-500">
            Undangan Digital
          </p>
        </footer>
      </main>
    </>
  );
}
