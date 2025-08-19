import { Person, WithContext, WebSite } from 'schema-dts'

export function generatePersonSchema(): WithContext<Person> {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://salamp.id' 
    : 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Muhammad Salam Pararta',
    alternateName: 'SalamP',
    description: 'Fullstack Web Developer specializing in MERN Stack, Next.js, Flutter, and modern web technologies',
    url: baseUrl,
    image: `${baseUrl}/assets/lamp.png`,
    sameAs: [
      'https://github.com/SalamPS',
      'https://linkedin.com/in/salam-pararta',
    ],
    jobTitle: 'Fullstack Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'LamP Dynamics',
    },
    knowsAbout: [
      'Web Development',
      'MERN Stack',
      'Next.js',
      'React',
      'Node.js',
      'MongoDB',
      'TypeScript',
      'JavaScript',
      'Flutter',
      'Mobile Development',
      'API Development',
      'Database Design',
      'Python',
      'ROS',
      'ROS2',
			'Robotics',
      'Embedded Systems',
      'Jetson',
    ],
    alumniOf: {
      '@type': 'Organization',
      name: 'Universitas Pendidikan Indonesia',
    },
  }
}

export function generateWebsiteSchema(): WithContext<WebSite> {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://salamp.id' 
    : 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SalamP Portfolio',
    description: 'Salam Pararta\'s Portfolio - Fullstack Developer specializing in MERN Stack and Next.js',
    url: baseUrl,
    author: {
      '@type': 'Person',
      name: 'Salam Pararta',
    },
  }
}
