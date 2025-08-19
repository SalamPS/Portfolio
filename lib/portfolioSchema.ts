import { WithContext, CreativeWork } from 'schema-dts'
import { _links } from '@/components/portfolio/data'

export function generatePortfolioSchema(project: _links): WithContext<CreativeWork> {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://salamp.id' 
    : 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.desc,
    url: `${baseUrl}/portfolio/${project.slug}`,
    image: project.imageUrl ? project.imageUrl.map(img => `${baseUrl}/storage/portfolio/${img}`) : [],
    creator: {
      '@type': 'Person',
      name: 'Salam Pararta',
      url: baseUrl,
    },
    dateCreated: project.year ? `${project.year}-01-01` : undefined,
    genre: project.type === 'beenMade' ? 'Original Work' : 'Collaborative Work',
    keywords: project.name,
    mainEntityOfPage: `${baseUrl}/portfolio/${project.slug}`,
  }
}
