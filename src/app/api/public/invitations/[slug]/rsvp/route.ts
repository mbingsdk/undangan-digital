import { NextRequest, NextResponse } from "next/server";
import { GuestLimitExceededError } from "@/features/guests/service";
import { checkRateLimit } from "@/features/invitations/rate-limit";
import { rsvpSubmissionSchema } from "@/features/invitations/schemas";
import {
  createPublicRsvp,
  PublicInvitationUnavailableError,
} from "@/features/invitations/service";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

function getClientIp(request: NextRequest) {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    null
  );
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const ipAddress = getClientIp(request);
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (contentLength > 2048) {
    return NextResponse.json(
      { error: "Data terlalu besar." },
      { status: 413 },
    );
  }

  const rateLimitKey = `rsvp:${slug}:${ipAddress ?? "unknown"}`;
  const isAllowed = checkRateLimit({
    key: rateLimitKey,
    limit: 5,
    windowMs: 60_000,
  });

  if (!isAllowed) {
    return NextResponse.json(
      { error: "Terlalu banyak percobaan. Coba lagi sebentar lagi." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = rsvpSubmissionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Data RSVP tidak valid.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const rsvp = await createPublicRsvp({
      guestCode: typeof body?.guestCode === "string" ? body.guestCode : null,
      input: parsed.data,
      ipAddress,
      slug,
    });

    return NextResponse.json({ ok: true, rsvp });
  } catch (error) {
    if (error instanceof PublicInvitationUnavailableError) {
      return NextResponse.json(
        { error: "Undangan tidak tersedia." },
        { status: 404 },
      );
    }

    if (error instanceof GuestLimitExceededError) {
      return NextResponse.json(
        {
          error: "Data RSVP tidak valid.",
          fields: {
            guestCount: [error.message],
          },
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Gagal menyimpan RSVP." },
      { status: 500 },
    );
  }
}
