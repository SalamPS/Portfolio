'use client';

import { useQuery } from '@tanstack/react-query';
import { blogStructure_, blogAds_, adsDummy, blog404 } from "@/components/interface/blogStructure";
import BlogSkeleton from '@/components/blog/content/BlogSkeleton';
import BlogContent from "@/components/blog/content/BlogContent";
import client from "@/lib/auth";

interface BlogContentWrapperProps {
    content: string;
}

const BlogContentWrapper = ({ content }: BlogContentWrapperProps) => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['blog', content],
		queryFn: async () => {
			const response = await client.get(`blog/spec?slug=${content}`);
			return response.data.data;
		},
		staleTime: 5 * 60 * 1000,
		cacheTime: 10 * 60 * 1000,
	});

	const blogData: blogStructure_ = data?.blog || (error ? blog404 : {} as blogStructure_);
	const blogAds: blogAds_[] = data?.ads || (error ? adsDummy : []);

	if (isLoading) {
		return <BlogSkeleton/>;
	}

	return <BlogContent data={blogData} ads={blogAds}/>;
};

export default BlogContentWrapper;