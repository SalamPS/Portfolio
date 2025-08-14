import BlogList from "@/components/blog/BlogList"
import Jumbotron from "@/components/global/Jumbotron"
import GlobalNavbar from "@/components/global/Navbar"
import LampQueryProvider from "@/components/global/QueryProvider"

const BlogListPage = () => {
	return (<>
		<GlobalNavbar space/>
		<Jumbotron>
			<h1 className="text-2xl md:text-4xl font-bold mb-4">Lamp BLOG</h1>
			<p className="text-md md:text-lg text-slate-400">Explore the latest articles, insights, and stories from my journey!</p>
		</Jumbotron>
    <LampQueryProvider>
			<BlogList/>
    </LampQueryProvider>
	</>)
}

export default BlogListPage