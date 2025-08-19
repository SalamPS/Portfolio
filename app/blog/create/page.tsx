import BlogCreate from "@/components/blog/create/BlogCreate";
import GlobalNavbar from "@/components/global/Navbar";

export const metadata = {
  title: "Create Blog"
}

const Page = () => {
	return (<>
		<GlobalNavbar/>
		<BlogCreate />
	</>);
};

export default Page;