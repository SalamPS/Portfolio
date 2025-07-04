export interface blogStructure_ {
	title: string,
	content: string,
	authorId: string,
	authorName: string,
	createdAt: string,
	updatedAt: string,
	comments: commentStructure_[],
	likes: number,
	saves: number,
	tags: string[],
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
	title: 'Connecting Husky Clearpath A200 with Jetson AGX Orin',
	authorId: '1',
	authorName: 'SalamPS',
	createdAt: '2023-10-01T12:00:00Z',
	updatedAt: '2023-10-01T12:00:00Z',
	comments: [],
	likes: 0,
	saves: 0,
	tags: ['robotics', 'jetson', 'husky'],
	content: 
`
## Main issues
This is how you do it.
> As simple as flipping your head up and down
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