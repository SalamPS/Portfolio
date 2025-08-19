import type { Metadata } from "next";
import "./globals.css";
import { tektur } from "./fonts/fonts";
import { generatePersonSchema, generateWebsiteSchema } from "@/lib/structuredData";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://salamp.id' 
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'SalamP | Fullstack Developer',
    template: '%s | SalamP'
  },
  description: "Salam Pararta's Portfolio - A passionate fullstack web developer specializing in MERN Stack, Next.js, Flutter, and modern web technologies. Explore my projects and blog posts about web development.",
  keywords: [
    'Salam Pararta',
    'SalamP',
    'Fullstack Developer',
    'Web Developer',
    'MERN Stack',
    'Next.js',
    'React',
    'Node.js',
    'MongoDB',
    'Python',
    'Flutter',
    'TypeScript',
    'JavaScript',
    'Portfolio',
    'Blog',
    'ROS',
    'ROS2',
    'Robotics',
    'Embedded Systems',
  ],
  authors: [{ name: 'Salam Pararta', url: baseUrl }],
  creator: 'Salam Pararta',
  publisher: 'SalamP',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    title: 'SalamP | Fullstack Developer',
    description: "Salam Pararta's Portfolio - A passionate fullstack web developer specializing in MERN Stack, Next.js, Flutter, and modern web technologies.",
    siteName: 'SalamP Portfolio',
    images: [
      {
        url: '/assets/jumbotron.png',
        width: 1200,
        height: 630,
        alt: 'SalamP - Fullstack Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SalamP | Fullstack Developer',
    description: "Salam Pararta's Portfolio - Fullstack web developer specializing in MERN Stack and Next.js",
    creator: '@salamp_',
    images: ['/assets/jumbotron.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/pwa/icon-192x192.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/pwa/icon-192x192.png',
    },
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personSchema = generatePersonSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-3431571878986276"></meta>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css"/>
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
        
        {/* Preconnect to improve performance */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#1d2337" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body
        className={`${tektur.variable} font-[family-name:var(--font-tektur)] antialiased`}
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}