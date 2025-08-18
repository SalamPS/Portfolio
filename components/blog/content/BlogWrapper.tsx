'use client';

import { useQuery } from '@tanstack/react-query';
import { blogStructure_, blogAds_, adsDummy, blog404 } from "@/components/interface/blogStructure";
import BlogSkeleton from '@/components/blog/content/BlogSkeleton';
import BlogContent from "@/components/blog/content/BlogContent";
import client from "@/lib/auth";
import { useEffect, useState } from 'react';

interface BlogContentWrapperProps {
    content: string;
}

const BlogContentWrapper = ({ content }: BlogContentWrapperProps) => {
	const [blogData, setBlogData] = useState<blogStructure_>(blog404);
	const [blogAds, setBlogAds] = useState<blogAds_[]>([]);

	const { data, isLoading, error } = useQuery({
		queryKey: ['blog', content],
		queryFn: async () => {
			const response = await client.get(`blog/spec?slug=${content}`);
			return response.data.data;
		},
		staleTime: 5 * 60 * 1000,
		cacheTime: 10 * 60 * 1000,
	});

	useEffect(() => {
		if (!error && !isLoading) {
			const blogData: blogStructure_ = data?.blog || (error ? blog404 : {} as blogStructure_);
			const blogAds: blogAds_[] = data?.ads || (error ? adsDummy : []);
			setBlogData(blogData);
			setBlogAds(blogAds);
			document.title = "LampBlog | " + blogData.title;
		}
	}, [data, error, isLoading])

	return <>
		{isLoading 
			? <BlogSkeleton/> 
			: <BlogContent data={blogData} ads={blogAds}/>
		}
	</>
};

export default BlogContentWrapper;