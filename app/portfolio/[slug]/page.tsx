/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { links } from '@/components/portfolio/data';
import { generatePortfolioSchema } from '@/lib/portfolioSchema';

type Params = {
  slug: string;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const link = links.find(link => link.slug === slug);
  
  if (!link) {
    return {
      title: 'Portfolio Item Not Found',
      description: 'The requested portfolio item could not be found.'
    };
  }

  // Base URL untuk production atau development
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://salamp.id' 
    : 'http://localhost:3000';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      absolute: `${link.name} | SalamP Portfolio`
    },
    description: link.desc,
    keywords: `${link.name}, portfolio, ${link.type}, web development, fullstack developer, SalamP`,
    authors: [{ name: 'Salam Pararta' }],
    creator: 'Salam Pararta',
    publisher: 'SalamP',
    openGraph: {
      title: `${link.name} | SalamP Portfolio`,
      description: link.desc,
      url: `/portfolio/${slug}`,
      siteName: 'SalamP Portfolio',
      images: link.imageUrl ? link.imageUrl.map(img => ({
        url: `/storage/portfolio/${img}`,
        width: 1200,
        height: 630,
        alt: `${link.name} - ${link.desc}`,
      })) : [{
        url: '/assets/jumbotron.png',
        width: 1200,
        height: 630,
        alt: `${link.name} Portfolio Item`,
      }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${link.name} | SalamP Portfolio`,
      description: link.desc,
      creator: '@salamp_',
      images: link.imageUrl ? [`/storage/portfolio/${link.imageUrl[0]}`] : ['/assets/jumbotron.png'],
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
    alternates: {
      canonical: `/portfolio/${slug}`,
    },
  };
}

export default async function KuisInfo ({params}: { params: Promise<{slug:string}> }) {
  const slug = (await params).slug
  const link = links.find(link => link.slug === slug);
  if (!link) return notFound()
  
  const portfolioSchema = generatePortfolioSchema(link);

  return (
    <>
      {/* Portfolio Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(portfolioSchema),
        }}
      />
      {slug}
    </>
  );
}