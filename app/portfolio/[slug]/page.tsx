/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import Head from 'next/head';
import { notFound } from 'next/navigation';
import { links } from '@/components/portfolio/data';

export default async function KuisInfo ({params}: { params: Promise<{slug:string}> }) {
  const slug = (await params).slug
  const link = links.find(link => link.slug === slug);
  if (!link) return notFound()

  return (
    <>
      <Head>
        <title>{link.name}</title>
      </Head>
      {slug}
    </>
  );
}