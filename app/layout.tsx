import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const tektur = localFont({
  src: "./fonts/tektur.ttf",
  variable: "--font-tektur",
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    absolute: 'SalamP | Dev',
    default: 'SalamP | Dev',
    template: '%s | SalamP'
  },
  description: "Salam Pararta's Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-3431571878986276"></meta>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css"/>
      </head>
      <body
        className={`${tektur.variable} font-[family-name:var(--font-tektur)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}