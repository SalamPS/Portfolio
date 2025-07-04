import BlogSkeleton from "@/app/components/blog/content/BlogSkeleton";
import BlogContentWrapper from "@/app/components/blog/content/BlogWrapper";
import GlobalNavbar from "@/app/components/global/Navbar";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ content: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { content } = await params;

  return (
    <>
      <GlobalNavbar/>
			{/* <BlogSkeleton /> */}
      <Suspense fallback={<BlogSkeleton />}>
        <BlogContentWrapper content={content} />
      </Suspense>
    </>
  );
};

export default Page;