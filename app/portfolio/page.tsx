import React from 'react'
import { Metadata } from 'next'
import GlobalNavbar from '@/components/global/Navbar'
import ContentPortfolio from '@/components/portfolio/content'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Explore my portfolio showcasing various projects I have built and contributed to. From web applications to mobile apps, discover the technologies and solutions I work with.',
  keywords: 'portfolio, projects, web development, mobile apps, fullstack developer, MERN stack, Next.js, React, Flutter',
  openGraph: {
    title: 'Portfolio | SalamP',
    description: 'Explore my portfolio showcasing various projects I have built and contributed to.',
    images: ['/assets/jumbotron.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | SalamP',
		creator: '@salamp_',
    description: 'Explore my portfolio showcasing various projects I have built and contributed to.',
  },
  alternates: {
    canonical: '/portfolio',
  },
}

const Portfolio = () => {
	return (
		<main>
			<GlobalNavbar space/>
			<div className="container mx-auto px-4 py-8">
				<div className="text-center mb-12">
					<h1 className="text-4xl md:text-6xl font-bold mb-6">
						My Portfolio
					</h1>
					<p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
						Discover the projects I&apos;ve built and contributed to. Each project represents 
						a unique challenge and solution in the world of web and mobile development.
					</p>
				</div>
				<ContentPortfolio />
			</div>
		</main>
	)
}

export default Portfolio
