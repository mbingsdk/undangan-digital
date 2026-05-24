import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Geist,
  Geist_Mono,
  Montserrat,
} from "next/font/google";
import "./globals.css";

const appUrl = process.env.APP_URL ?? "http://localhost:3000";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const invitationSerif = Cormorant_Garamond({
  variable: "--font-invitation-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const invitationSans = Montserrat({
  variable: "--font-invitation-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  applicationName: "Undangan Digital",
  description:
    "Undangan digital premium untuk pernikahan, lengkap dengan RSVP, ucapan, gallery, lokasi, dan share WhatsApp.",
  metadataBase: new URL(appUrl),
  title: {
    default: "Undangan Digital",
    template: "%s | Undangan Digital",
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${invitationSerif.variable} ${invitationSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
