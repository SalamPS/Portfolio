'use client'

import BlogCreate from "@/components/blog/create/BlogCreate";
import GlobalNavbar from "@/components/global/Navbar";

const Page = () => {
	return (<>
		<GlobalNavbar/>
		<BlogCreate />
	</>);
};

export default Page;