'use client'
import BlogSkeleton from "@/app/components/blog/content/BlogSkeleton";
import BlogContentWrapper from "@/app/components/blog/content/BlogWrapper";
import GlobalNavbar from "@/app/components/global/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface Params {
  content: string;
}

export default function BlogPageParams ({params}: { params: Promise<Params> }) {
  const [unwrappedParams, setUnwrappedParams] = useState<Params | null>(null);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    params.then(resolvedParams => {
      setUnwrappedParams(resolvedParams);
    });
  }, [params]);

  if (!unwrappedParams) {
    return (<>
      <GlobalNavbar/>
      <BlogSkeleton/>
    </>)
  }

  console.log("BlogPageParams content:", unwrappedParams.content);

  return (<>
    <GlobalNavbar/>
    <QueryClientProvider client={queryClient}>
      <BlogContentWrapper content={unwrappedParams.content} />
    </QueryClientProvider>
  </>)
}