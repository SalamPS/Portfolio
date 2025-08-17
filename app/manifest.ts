import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LamP Official Website',
    short_name: 'LamP',
    description: 'A Fullstack Web Developer with a love for MERN Stack and NextJS. Also work with Flutter, C, C++ and Python.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1d2337',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/pwa/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/pwa/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
		screenshots: [
			{
				form_factor: "wide",
				src: "/pwa/ss-wide.png",
				sizes: "1980x1080"
			},
			{
				form_factor: "narrow",
				src: "/pwa/ss-narrow.png",
				sizes: "413x769"
			},
		]
  }
}