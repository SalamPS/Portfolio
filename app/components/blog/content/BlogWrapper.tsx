import BlogContent from "@/app/components/blog/content/BlogContent";
import { blogStructure_, blogAds_, adsDummy, blog404 } from "@/app/components/interface/blogStructure";
import client from "@/app/lib/auth";

interface BlogContentWrapperProps {
    content: string;
}

const BlogContentWrapper = async ({ content }: BlogContentWrapperProps) => {
	let blogData: blogStructure_;
	let blogAds: blogAds_[];
	
	try {
		const response = await client.get(`blog/spec?slug=${content}`);
		const { data } = response.data;
		blogData = data.blog;
		blogAds = data.ads;
	} catch (error) {
		console.log('Error fetching blog data:', error);
		blogData = blog404;
		blogAds = adsDummy;
	}

	return <BlogContent data={blogData} ads={blogAds}/>;
};

export default BlogContentWrapper;