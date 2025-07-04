import BlogContent from "@/app/components/blog/content/BlogContent";
import { blogStructure_, blogDummy, blogAds_, adsDummy } from "@/app/components/interface/blogStructure";
import { delay } from "@/app/lib/delay";

interface BlogContentWrapperProps {
    content: string;
}

const BlogContentWrapper = async ({ content }: BlogContentWrapperProps) => {
	let blogData: blogStructure_;
	let blogAds: blogAds_[];
	
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blog?content=${content}`, {
			cache: 'no-store'
		});
		await delay(1000); // Simulate network delay for better UX
		if (!response.ok) {
			throw new Error('Failed to fetch blog data');
		}
		const result = await response.json();
		blogData = result.blog;
		blogAds = result.ads;
	} catch (error) {
		console.log('Error fetching blog data:', error);
		blogData = blogDummy;
		blogAds = adsDummy;
	}

	return <BlogContent data={blogData} ads={blogAds}/>;
};

export default BlogContentWrapper;