import BlogCreate from "@/components/blog/create/BlogCreate";
import GlobalNavbar from "@/components/global/Navbar";

export const metadata = {
  title: "Create Blog",
	description: "Create a new blog post according to Salam's journey!"
}

const Page = () => {
	return (<>
		<GlobalNavbar/>
		<BlogCreate />
	</>);
};

export default Page;