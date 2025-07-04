import { blogDummy } from "@/app/components/interface/blogStructure";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { delay } from "../../utils/Utilites";
import Loading from "../../global/Loading";

const BlogCreate = () => {
	const { data, isLoading } = useQuery({
		queryKey: ['blogTitle'],
		queryFn: async () => {
			await delay(3000)
			return blogDummy
			const res = await fetch('/api/blog');
			if (!res.ok) {
				return blogDummy
				throw new Error('Network response error');
			}
			return res.json();
		},
	});

	useEffect(() => {
		console.log(data, isLoading)
	}, [data, isLoading])

	return (<>
		<Loading isLoading={isLoading}/>
		{/* Additional content can go here */}
	</>)
}

export default BlogCreate