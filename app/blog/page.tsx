import BlogList from "@/components/blog/BlogList"
import GlobalNavbar from "@/components/global/Navbar"
import LampQueryProvider from "@/components/global/QueryProvider"

const BlogListPage = () => {
	return (<>
		<GlobalNavbar/>
    <LampQueryProvider>
			<BlogList/>
    </LampQueryProvider>
	</>)
}

export default BlogListPage