'use client'

import BlogCreate from "@/app/components/blog/create/BlogCreate";
import GlobalNavbar from "@/app/components/global/Navbar";

const Page = () => {
	return (<>
		<GlobalNavbar/>
		<BlogCreate />
	</>);
};

export default Page;