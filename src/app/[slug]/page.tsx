/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  CreditCard,
  Heart,
  ImageIcon,
  MapPin,
  Share2,
} from "lucide-react";
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
  const appUrl = process.env.APP_URL?.replace(/\/$/, "");
  const path = guestCode ? `/${slug}?guest=${guestCode}` : `/${slug}`;

  if (!appUrl) {
    return path;
  }

  return `${appUrl}${path}`;
}

function getDatePart(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
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

  return {
    title: `${coupleNames} | ${invitation.title}`,
    description: `Undangan pernikahan ${coupleNames}. Buka undangan digital untuk melihat detail acara, lokasi, gallery, dan informasi gift.`,
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
    <PublicInvitationShell
      brideName={invitation.brideName}
      coverImage={invitation.coverImage}
      groomName={invitation.groomName}
      musicUrl={invitation.musicUrl}
      recipientName={recipientName}
      weddingDateLabel={weddingDateLabel}
    >
      <main className="min-h-screen bg-[#fafafa] text-zinc-800">
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-24 text-center">
          <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(#000_1px,transparent_1px)] [background-size:38px_38px]" />
          <div className="relative mx-auto max-w-4xl">
            <p className="text-xs font-medium uppercase tracking-[0.42em] text-zinc-500">
              Maha Suci Allah
            </p>
            <div className="mt-10">
              <h1 className="font-serif text-5xl font-light leading-tight text-zinc-800 sm:text-7xl">
                {invitation.groomName}
              </h1>
              <div className="my-7 flex items-center justify-center gap-5 sm:gap-8">
                <span className="h-px w-16 bg-zinc-300 sm:w-28" />
                <span className="text-5xl font-light text-amber-700">&</span>
                <span className="h-px w-16 bg-zinc-300 sm:w-28" />
              </div>
              <h1 className="font-serif text-5xl font-light leading-tight text-zinc-800 sm:text-7xl">
                {invitation.brideName}
              </h1>
            </div>
            <p className="mx-auto mt-14 max-w-2xl whitespace-pre-line font-serif text-sm font-light italic leading-8 text-zinc-600 sm:text-base">
              &quot;
              {invitation.openingText ??
                "Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada hari bahagia kami."}
              &quot;
            </p>
            <div className="mx-auto mt-10 max-w-sm border border-zinc-200 bg-white px-6 py-5 shadow-sm">
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-zinc-400">
                Kepada Yth.
              </p>
              <p className="mt-3 text-xl font-medium text-zinc-800">
                {recipientName}
              </p>
            </div>
          </div>
        </section>

        {countdownTarget ? (
          <section className="bg-white px-5 py-24 sm:px-8">
            <SectionHeading
              eyebrow="Menuju Hari Bahagia"
              title={weddingDateLabel ?? "Hari Pernikahan"}
            />
            <div className="mx-auto mt-12 max-w-3xl">
              <Countdown targetDate={countdownTarget} />
            </div>
          </section>
        ) : null}

        <section className="bg-[#f9f9f7] px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <SectionHeading
              eyebrow="Detail Acara"
              title="Rangkaian Acara"
            />

            <div className="mt-14 grid border border-zinc-200 bg-white md:grid-cols-2">
              {invitation.events.length > 0 ? (
                invitation.events.map((event, index) => (
                  <article
                    className={`flex flex-col items-center p-10 text-center sm:p-14 ${
                      index === 0
                        ? "border-b border-zinc-200 md:border-b-0 md:border-r"
                        : "border-t border-zinc-200 first:border-t-0 md:border-t-0 md:border-l-0"
                    }`}
                    key={`${event.title}-${event.sortOrder}`}
                  >
                    <Heart
                      aria-hidden="true"
                      className="mb-6 text-zinc-300"
                      size={26}
                      strokeWidth={1.2}
                    />
                    <h3 className="font-serif text-2xl font-light text-amber-800">
                      {event.title}
                    </h3>

                    <div className="mt-8 flex w-full flex-col items-center gap-6 text-sm leading-7 text-zinc-500">
                      <div className="flex flex-col items-center">
                        <CalendarDays
                          aria-hidden="true"
                          className="mb-3 text-zinc-300"
                          size={20}
                          strokeWidth={1.4}
                        />
                        <p className="font-medium uppercase tracking-widest text-zinc-800">
                          {formatDate(event.date)}
                        </p>
                        <p>{formatEventTime(event.startTime, event.endTime)}</p>
                      </div>

                      {event.venueName || event.address ? (
                        <>
                          <span className="h-px w-12 bg-zinc-100" />
                          <div className="flex flex-col items-center">
                            <MapPin
                              aria-hidden="true"
                              className="mb-3 text-zinc-300"
                              size={20}
                              strokeWidth={1.4}
                            />
                            {event.venueName ? (
                              <p className="font-medium text-zinc-800">
                                {event.venueName}
                              </p>
                            ) : null}
                            {event.address ? (
                              <p className="mt-1 max-w-xs">{event.address}</p>
                            ) : null}
                          </div>
                        </>
                      ) : null}
                    </div>

                    {event.mapsUrl ? (
                      <a
                        className="mt-9 inline-flex h-11 items-center justify-center border border-zinc-300 px-7 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-zinc-600 transition hover:border-amber-700 hover:text-amber-800"
                        href={event.mapsUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Lihat Peta
                      </a>
                    ) : null}
                  </article>
                ))
              ) : (
                <div className="p-8 md:col-span-2">
                  <PublicEmptyState>
                    Detail acara belum tersedia.
                  </PublicEmptyState>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Gallery" title="Galeri Bahagia" />

            {invitation.galleries.length > 0 ? (
              <div className="mt-14 columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3">
                {invitation.galleries.map((image, index) => (
                  <figure
                    className="group relative break-inside-avoid overflow-hidden bg-zinc-100"
                    key={`${image.imageUrl}-${image.sortOrder}`}
                  >
                    <img
                      alt={image.caption ?? `Gallery ${index + 1}`}
                      className="h-auto w-full object-cover transition duration-700 group-hover:scale-105"
                      loading="lazy"
                      src={image.imageUrl}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-500 group-hover:bg-black/20">
                      <ImageIcon
                        aria-hidden="true"
                        className="text-white opacity-0 transition duration-500 group-hover:opacity-100"
                        size={28}
                        strokeWidth={1.2}
                      />
                    </div>
                    {image.caption ? (
                      <figcaption className="bg-white px-4 py-3 text-xs leading-5 text-zinc-500">
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

        <section className="bg-[#f9f9f7] px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <SectionHeading
              description="Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Jika ingin memberikan tanda kasih, informasi berikut dapat digunakan."
              eyebrow="Wedding Gift"
              title="Tanda Kasih"
            />

            {invitation.gifts.length > 0 ? (
              <div className="mt-14 grid gap-6 md:grid-cols-2">
                {invitation.gifts.map((gift) => (
                  <article
                    className="flex flex-col items-center border border-zinc-200 bg-white p-9 text-center"
                    key={`${gift.providerName}-${gift.accountNumber}`}
                  >
                    <CreditCard
                      aria-hidden="true"
                      className="mb-6 text-zinc-300"
                      size={34}
                      strokeWidth={1.2}
                    />
                    <h3 className="font-serif text-xl font-light text-zinc-800">
                      {gift.providerName}
                    </h3>
                    <p className="mt-2 text-xs font-medium uppercase tracking-widest text-zinc-500">
                      {gift.accountHolder}
                    </p>
                    <p className="mt-7 break-all font-mono text-2xl font-light tracking-widest text-zinc-800">
                      {gift.accountNumber}
                    </p>
                    {gift.note ? (
                      <p className="mt-4 text-sm leading-6 text-zinc-500">
                        {gift.note}
                      </p>
                    ) : null}
                    {gift.qrImage ? (
                      <img
                        alt={`QR ${gift.providerName}`}
                        className="mt-7 h-32 w-32 bg-white object-cover ring-1 ring-zinc-100"
                        loading="lazy"
                        src={gift.qrImage}
                      />
                    ) : null}
                    <div className="mt-7">
                      <GiftCopyButton accountNumber={gift.accountNumber} />
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-10">
                <PublicEmptyState>
                  Informasi gift belum tersedia.
                </PublicEmptyState>
              </div>
            )}
          </div>
        </section>

        <PublicResponseForms
          guestCode={guest?.guestCode}
          guestName={guest?.name}
          initialWishes={initialWishes}
          maxGuest={guest?.maxGuest}
          slug={invitation.slug}
        />

        <section className="bg-white px-5 py-28 text-center sm:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="font-serif text-5xl font-light text-amber-700">
              Terima Kasih
            </p>
            <p className="mx-auto mt-9 max-w-xl whitespace-pre-line text-sm font-light leading-8 text-zinc-500 sm:text-base">
              {invitation.closingText ??
                "Merupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu."}
            </p>

            <div className="mt-14">
              <p className="text-xs font-medium uppercase tracking-[0.32em] text-zinc-400">
                Kami yang berbahagia
              </p>
              <h2 className="mt-5 font-serif text-3xl font-light text-zinc-800 sm:text-5xl">
                {coupleNames}
              </h2>
            </div>

            <a
              className="mx-auto mt-12 inline-flex h-12 items-center justify-center gap-3 rounded-full bg-[#25d366] px-7 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-lg shadow-[#25d366]/20 transition hover:bg-[#128c7e]"
              href={whatsAppUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Share2 aria-hidden="true" size={17} strokeWidth={1.8} />
              Bagikan via WhatsApp
            </a>
          </div>
        </section>

        <footer className="border-t border-zinc-100 bg-white px-5 py-8 text-center">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.26em] text-zinc-400">
            Undangan Digital
          </p>
        </footer>
      </main>
    </PublicInvitationShell>
  );
}
