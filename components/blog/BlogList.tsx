'use client'
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { blogStructure_ } from "../interface/blogStructure";
import AdBanner from "./content/Adsense";
import client from "@/lib/auth";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import { useQuery } from "@tanstack/react-query";

const BlogList = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 8;

  // Use react-query to fetch blog posts
  const { data, isLoading, isError } = useQuery({
    queryKey: ['blogs', currentPage + 1, ITEMS_PER_PAGE],
    queryFn: () => client.get(`/blog?page=${currentPage + 1}&limit=${ITEMS_PER_PAGE}`),
  });
  
  const blogPosts = data?.data?.data || [];
  const totalPages = data?.data?.pagination?.totalPages || 0;

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  return (<>
		<div className="px-8 py-24 xl:py-32 xl:px-28 grid grid-cols-1 xl:grid-cols-4 gap-8 xl:gap-12">
			<div className="col-span-3">
				<h1 className="text-3xl font-bold">Blog List</h1>
				<p className="text-slate-400 mb-6">Explore LamBlogger Community Post.</p>
				<div className="flex flex-col xl:flex-row gap-4 xl:gap-8 ">
					<main className="w-full">

						{/* Loading state */}
						{isLoading && (
							<div className="flex justify-center items-center min-h-[200px]">
								<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
							</div>
						)}

						{/* Error state */}
						{isError && (
							<div className="text-red-500 p-4 bg-red-50 rounded-md">
								Failed to load blog posts. Please try again later.
							</div>
						)}

						{/* Post List */}
						{!isLoading && !isError && (
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{blogPosts.length > 0 ? (
									blogPosts.map((post: blogStructure_, index: number) => (<>
										<div key={post._id} className={index === 1 ? 'z-10 grid grid-cols-2 gap-6 col-span-2' : 'col-span-1'}>
											<Link className="block shadow-lg hover:shadow-xl hover:scale-[1.01] duration-200 rounded-lg overflow-hidden border border-slate-600"
												href={`/blog/${post.slug}`}>
												<div className="w-full aspect-video bg-cover bg-center">
													<img 
														src={post.thumbnail || '/placeholder-image.jpg'} 
														alt={post.title}
														className="w-full h-full object-cover"
													/>
												</div>
												<div className="p-4">
													<h2 className="text-xl font-semibold truncate">{post.title}</h2>
													<p className="text-sm text-gray-500 mt-1">By {post.authorName}</p>
													<div className="flex gap-2 mt-2">
														{post.tags && post.tags.slice(0, 3).map((tag: string, i: number) => (
															<span key={i} className="px-3 py-1 bg-[#0f6252] text-xs rounded-full">{tag}</span>
														))}
													</div>
												</div>
											</Link>
											{index === 1 && 
												<div className="w-full h-auto bg-slate-100 rounded shadow">
													<AdBanner
														dataAdSlot="8897271609"
														dataAdFormat="auto"
														dataFullWidthResponsive={true}
													/>
												</div>
											}
										</div>
									</>))
								) : (
									<div className="col-span-2 text-center py-10 text-gray-500">
										No blog posts found.
									</div>
								)}
							</div>
						)}

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="mt-8 flex justify-center">
								<ReactPaginate
									previousLabel={"← Previous"}
									nextLabel={"Next →"}
									pageCount={totalPages}
									onPageChange={handlePageChange}
									forcePage={currentPage}
									containerClassName={"flex gap-2"}
									previousLinkClassName={"px-4 py-2 bg-[#0f6252]/80 rounded hover:bg-[#0f6252] transition-colors"}
									nextLinkClassName={"px-4 py-2 bg-[#0f6252]/80 rounded hover:bg-[#0f6252] transition-colors"}
									pageLinkClassName={"px-4 py-2 bg-[#0f6252]/80 rounded hover:bg-[#0f6252] transition-colors"}
									activeLinkClassName={"bg-[#0f6252] text-white hover:bg-blue-600"}
									disabledLinkClassName={"bg-[#0f6252]/40 text-gray-300 cursor-not-allowed"}
								/>
							</div>
						)}
					</main>
				</div>
			</div>
			
			<section id="filter" className="col-span-1 order-last">
				<div className="flex flex-col gap-4 border border-slate-600 rounded-xl">
				</div>
			</section>
		</div>
  </>)
}

export default BlogList;