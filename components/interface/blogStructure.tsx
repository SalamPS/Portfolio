export interface blogStructure_ {
	_id?: string,
	slug?: string,
	title: string,
	content: string,
	authorId: string,
	authorName: string,
	createdAt: string | Date,
	updatedAt: string | Date,
	comments: commentStructure_[],
	tags: string[],
	category: string,
	likes: string[],
	saves: string[],
	thumbnail: string,
}

export interface commentStructure_ {
	authorId: 'string',
	authorName: 'string',
	content: 'string',
	createdAt: 'string',
}

export interface blogAds_ {
	adsId: string,
	adsTitle: string,
	adsImageLink: string,
	adsLink: string,
}

export const blogDummy:blogStructure_ = {
	title: 'Why is this post seems empty?',
	authorId: '1',
	authorName: 'SalamPS',
	createdAt: '2025-07-05T12:00:00Z',
	updatedAt: '2025-07-05T12:00:00Z',
	tags: ['dummy', 'blog', 'tags'],
	category: 'LamP Post',
	comments: [],
	likes: [],
	saves: [],
	thumbnail: '/blog/thumbnail-1.png',
	content: 
`
## Main issues
This is how you do it.
> As simple as flipping your head up and down

Fill the whole content with your own words, and make sure to use the right markdown syntax.
`
}

export const blog404:blogStructure_ = {
	title: 'Why is this post seems empty?',
	authorId: '1',
	authorName: 'SalamPS',
	createdAt: '2025-07-05T12:00:00Z',
	updatedAt: '2025-07-05T12:00:00Z',
	tags: ['404', 'not', 'found'],
	category: 'LamP Post',
	comments: [],
	likes: [],
	saves: [],
	thumbnail: '/blog/thumbnail-1.png',
	content: 
`
## Chill, it's a common issue

> The solution is simple as flipping your head up and down

1. Search for the right post.
2. Open the right link.
3. Or, simply just go back to the homepage.

What are you searching for btw?
`
}

export const adsDummy: blogAds_[] = [
	{
		adsId: '1',
		adsTitle: 'Lamp.Devs',
		adsImageLink: '/ads/ads-1.png',
		adsLink: 'https://salamp.id',
	},
	{
		adsId: '2',
		adsTitle: 'Jetson AGX Orin',
		adsImageLink: 'https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/_jcr_content/root/responsivegrid/nv_container_1336425203/nv_image.coreimg.100.850.jpeg/1734419987053/jetson-orin-nano-super-dev-kit-ari.jpeg',
		adsLink: 'https://developer.nvidia.com/embedded/jetson-agx-orin-devkit',
	},
];