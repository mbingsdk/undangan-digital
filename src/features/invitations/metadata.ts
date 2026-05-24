const fallbackAppUrl = "http://localhost:3000";

export function getAppUrl() {
  return process.env.APP_URL?.replace(/\/$/, "") ?? fallbackAppUrl;
}

export function getInvitationPublicUrl(slug: string, guestCode?: string | null) {
  const path = guestCode ? `/${slug}?guest=${guestCode}` : `/${slug}`;

  return `${getAppUrl()}${path}`;
}

export function getAbsolutePublicUrl(pathOrUrl: string) {
  try {
    return new URL(pathOrUrl).toString();
  } catch {
    return new URL(pathOrUrl, getAppUrl()).toString();
  }
}

export function getInvitationOgImageUrl(slug: string) {
  return `${getAppUrl()}/api/og/invitations/${slug}`;
}

export function buildInvitationDescription({
  brideName,
  eventDateLabel,
  groomName,
}: {
  brideName: string;
  eventDateLabel?: string;
  groomName: string;
}) {
  const coupleNames = `${groomName} & ${brideName}`;
  const dateText = eventDateLabel ? ` pada ${eventDateLabel}` : "";

  return `Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri pernikahan ${coupleNames}${dateText}. Buka undangan digital untuk melihat detail acara, lokasi, RSVP, dan ucapan.`;
}
