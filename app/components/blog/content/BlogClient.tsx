import BlogContentWrapper from "@/app/components/blog/content/BlogWrapper";
import GlobalNavbar from "@/app/components/global/Navbar";

interface BlogClientProps {
  content: string;
}

const BlogClient = ({ content }: BlogClientProps) => {
  return (
    <>
      <GlobalNavbar/>
			<BlogContentWrapper content={content} />
    </>
  );
};

export default BlogClient;