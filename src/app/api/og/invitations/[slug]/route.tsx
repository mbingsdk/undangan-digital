import { ImageResponse } from "next/og";
import {
  getAbsolutePublicUrl,
  getInvitationPublicUrl,
} from "@/features/invitations/metadata";
import { getPublicInvitationBySlug } from "@/features/invitations/service";

export const runtime = "nodejs";

type OgImageRouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export async function GET(_request: Request, context: OgImageRouteContext) {
  const { slug } = await context.params;
  const invitation = await getPublicInvitationBySlug(slug);

  if (!invitation) {
    return new Response("Undangan tidak ditemukan.", {
      status: 404,
    });
  }

  const couples =
    invitation.type === "TWIN" && invitation.couples.length >= 2
      ? invitation.couples
      : [
          {
            groomName: invitation.groomName,
            brideName: invitation.brideName,
            sortOrder: 0,
          },
        ];
  const firstEvent = invitation.events[0];
  const eventDateLabel = firstEvent
    ? formatDate(firstEvent.date)
    : "Save The Date";
  const coverImage = invitation.coverImage
    ? getAbsolutePublicUrl(invitation.coverImage)
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "linear-gradient(135deg, #17110d 0%, #2f2017 42%, #5a3824 100%)",
          color: "#fff7ed",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
          width: "100%",
        }}
      >
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt=""
            src={coverImage}
            style={{
              height: "100%",
              inset: 0,
              objectFit: "cover",
              opacity: 0.42,
              position: "absolute",
              width: "100%",
            }}
          />
        ) : null}
        <div
          style={{
            background:
              "radial-gradient(circle at 25% 20%, rgba(251,191,36,0.24), transparent 30%), radial-gradient(circle at 76% 78%, rgba(244,114,182,0.2), transparent 34%), linear-gradient(180deg, rgba(23,17,13,0.4), rgba(23,17,13,0.86))",
            inset: 0,
            position: "absolute",
          }}
        />
        <div
          style={{
            border: "1px solid rgba(253,230,138,0.34)",
            height: 540,
            left: 54,
            position: "absolute",
            top: 45,
            width: 1092,
          }}
        />
        <div
          style={{
            border: "1px solid rgba(255,247,237,0.14)",
            height: 492,
            left: 92,
            position: "absolute",
            top: 69,
            width: 1016,
          }}
        />
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: 24,
            padding: "0 120px",
            position: "relative",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              color: "#fde68a",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 9,
              textTransform: "uppercase",
            }}
          >
            The Wedding Of
          </div>
          <div
            style={{
              alignItems: "center",
              color: "#fffbeb",
              display: "flex",
              flexDirection: invitation.type === "TWIN" ? "row" : "column",
              fontFamily: "serif",
              fontSize: invitation.type === "TWIN" ? 56 : 108,
              fontWeight: 500,
              gap: invitation.type === "TWIN" ? 44 : 0,
              justifyContent: "center",
              lineHeight: 0.94,
              maxWidth: 1040,
              textShadow: "0 16px 44px rgba(0,0,0,0.45)",
              width: "100%",
            }}
          >
            {couples.map((couple) => (
              <div
                key={couple.sortOrder}
                style={{
                  alignItems: "center",
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <span>{couple.groomName}</span>
                <span
                  style={{
                    color: "#fcd34d",
                    display: "block",
                    fontSize: invitation.type === "TWIN" ? 46 : 82,
                    fontStyle: "italic",
                    fontWeight: 300,
                    margin: invitation.type === "TWIN" ? "8px 0" : "12px 0",
                  }}
                >
                  &
                </span>
                <span>{couple.brideName}</span>
              </div>
            ))}
          </div>
          <div
            style={{
              alignItems: "center",
              background: "rgba(255,247,237,0.1)",
              border: "1px solid rgba(253,230,138,0.25)",
              borderRadius: 999,
              color: "#fde68a",
              display: "flex",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 5,
              padding: "18px 36px",
              textTransform: "uppercase",
            }}
          >
            {eventDateLabel}
          </div>
          <div
            style={{
              color: "#e7d9c7",
              fontSize: 24,
              letterSpacing: 1,
              marginTop: 8,
            }}
          >
            {getInvitationPublicUrl(invitation.slug)}
          </div>
        </div>
        <div
          style={{
            bottom: 42,
            color: "rgba(253,230,138,0.72)",
            fontSize: 20,
            fontWeight: 700,
            left: 0,
            letterSpacing: 7,
            position: "absolute",
            right: 0,
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          Undangan Digital
        </div>
      </div>
    ),
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=3600",
      },
      height: 630,
      width: 1200,
    },
  );
}
