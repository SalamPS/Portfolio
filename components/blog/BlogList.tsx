'use client'
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { blogStructure_ } from "../interface/blogStructure";
import client from "@/lib/auth";
import { useState, useMemo, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "../global/Skeleton";
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { Modal } from "../global/Modal";

const BlogList = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<blogStructure_ | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const ITEMS_PER_PAGE = 6;
  const queryClient = useQueryClient();

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await client.get('/auth/admin/ver');
        setIsAdmin(response.data.success);
      } catch {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await client.delete(`/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      setShowDeleteModal(false);
      setPostToDelete(null);
    },
    onError: (error) => {
      console.error('Failed to delete post:', error);
      // You can add toast notification here
    }
  });

  // Use react-query to fetch all blog posts (we'll filter client-side for better UX)
  const { data, isLoading, isError } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => client.get(`/blog`),
  });
  
  const allBlogPosts = useMemo(() => data?.data?.data || [], [data]);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    const filtered = allBlogPosts.filter((post: blogStructure_) => {
      // Search filter
      const matchesSearch = searchTerm === "" || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(post.category);

      return matchesSearch && matchesCategory;
    });

    // Sort posts
    filtered.sort((a: blogStructure_, b: blogStructure_) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allBlogPosts, searchTerm, selectedCategories, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedPosts.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const blogPosts = filteredAndSortedPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(allBlogPosts.map((post: blogStructure_) => post.category))];
    return uniqueCategories.filter(Boolean) as string[];
  }, [allBlogPosts]);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setCurrentPage(0); // Reset to first page when filter changes
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0); // Reset to first page when search changes
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(0); // Reset to first page when sort changes
  };

  const handleDeleteClick = (post: blogStructure_) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (postToDelete && postToDelete._id) {
      setIsDeleting(true);
      try {
        await deleteMutation.mutateAsync(postToDelete._id);
      } catch (error) {
        console.error('Delete failed:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  // Blog skeleton component
  const BlogCardSkeleton = () => (
    <div className="block shadow-lg rounded-lg overflow-hidden border border-slate-600">
      <Skeleton className="w-full aspect-video bg-slate-300" />
      <div className="p-4">
        <Skeleton className="h-6 bg-slate-300 rounded mb-2" />
        <Skeleton className="h-4 bg-slate-300 rounded w-24 mb-2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 bg-slate-300 rounded-full w-16" />
          <Skeleton className="h-6 bg-slate-300 rounded-full w-20" />
          <Skeleton className="h-6 bg-slate-300 rounded-full w-14" />
        </div>
      </div>
    </div>
  );

  return (<>
		<div className="px-8 xl:px-28 py-12 md:py-24 xl:py-32 grid grid-cols-1 xl:grid-cols-6 gap-4 xl:gap-8">
			<div className="xl:col-span-2 flex flex-col gap-4">
				<section id="filter" className="border border-slate-600 rounded-lg">
					<div className="flex flex-col gap-4 p-6">
						{/* Search Input */}
						<div className="space-y-2">
							<label className="text-sm ml-2 font-medium text-gray-400">Search Posts</label>
							<input
								type="text"
								placeholder="Search by title or tags..."
								value={searchTerm}
								onChange={(e) => handleSearchChange(e.target.value)}
								className="w-full px-4 py-2 border bg-[#1d2337] border-slate-300 rounded-lg ring-1 ring-slate-700 focus:ring-[#0f6252] border-none outline-none transition-all placeholder:text-slate-500"
							/>
						</div>

						{/* Sort Dropdown */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-400">Sort By</label>
							<div className="relative">
								<select
									value={sortBy}
									onChange={(e) => handleSortChange(e.target.value)}
									className="w-full px-4 py-2 border bg-slate-700 border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0f6252] border-none outline-none transition-all appearance-none cursor-pointer"
								>
									<option value="newest">Newest First</option>
									<option value="oldest">Oldest First</option>
									<option value="title-asc">Title A-Z</option>
									<option value="title-desc">Title Z-A</option>
								</select>
								{/* Custom dropdown arrow */}
								<div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
									<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
									</svg>
								</div>
							</div>
						</div>

						{/* Category Filter */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-400">Categories</label>
							<div className="space-y-2 max-h-48 overflow-y-auto">
								{categories.map((category) => (
									<label key={category} className="flex items-center cursor-pointer group">
										<div className="relative">
											<input
												type="checkbox"
												checked={selectedCategories.includes(category)}
												onChange={() => handleCategoryToggle(category)}
												className="sr-only"
											/>
											<div className={`w-5 h-5 border-[1px] rounded transition-all ${
												selectedCategories.includes(category)
													? 'bg-[#0f6252] border-[#0f6252]'
													: 'border-slate-500 group-hover:border-[#0f6252]'
											}`}>
												{selectedCategories.includes(category) && (
													<svg className="w-3 h-3 text-white absolute top-1 left-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
													</svg>
												)}
											</div>
										</div>
										<span className="ml-3 text-sm text-gray-400 group-hover:text-[#0f6252] transition-colors">
											{category}
										</span>
									</label>
								))}
							</div>
						</div>
					</div>
				</section>

				{
					isAdmin && (
						<div id="admin-menu flex" className="flex justify-stretch">
							<Link
								href="/blog/create"
								className="bg-[#0f6252] text-white px-4 py-2 text-center w-full rounded-md hover:bg-[#0f6252]/80 transition"
							>
								Create New Post
							</Link>
						</div>
					)
				}

				<div className="w-full aspect-square border flex items-center justify-center border-slate-600 bg-slate-800/40 rounded shadow text-slate-400">
					No ads available
				</div>
			</div>

			<div className="xl:col-span-4">
				<div className="flex flex-col xl:flex-row gap-4 xl:gap-8 min-h-screen">
					<main className="w-full">

						{/* Loading state with skeleton */}
						{isLoading && (
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
								{Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
									<div key={index}>
										<BlogCardSkeleton />
									</div>
								))}
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
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
								{blogPosts.length > 0 ? (
									blogPosts.map((post: blogStructure_) => (
										<div key={post._id} className="relative">
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
											
											{/* Edit Button for Admin */}
											{isAdmin && (
												<div className="absolute top-2 right-2 flex gap-2">
													<Link 
														href={`/blog/edit/${post.slug}`}
														className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors z-10"
														title="Edit Blog Post"
													>
														<IconPencil size={16} />
													</Link>
													<button
														onClick={(e) => {
															e.preventDefault();
															handleDeleteClick(post);
														}}
														className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors z-10"
														title="Delete Blog Post"
													>
														<IconTrash size={16} />
													</button>
												</div>
											)}
										</div>
									))
								) : (
									<div className="col-span-3 text-center py-10 text-gray-500">
										No blog posts found.
									</div>
								)}
							</div>
						)}

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="mt-8 flex justify-center">
								<ReactPaginate
									previousLabel={"←"}
									nextLabel={"→"}
									pageCount={totalPages}
									onPageChange={handlePageChange}
									forcePage={currentPage}
									containerClassName={"flex gap-2"}
									previousLinkClassName={"px-4 py-2 bg-[#0f6252]/80 rounded hover:bg-[#0f6252] transition-colors"}
									nextLinkClassName={"px-4 py-2 bg-[#0f6252]/80 rounded hover:bg-[#0f6252] transition-colors"}
									pageLinkClassName={"px-4 py-2 bg-[#0f6252]/80 rounded hover:bg-[#0f6252] transition-colors"}
									activeLinkClassName={"bg-[#0f6252] text-white hover:bg-[#0f6252] cursor-default"}
									disabledLinkClassName={"bg-[#0f6252]/40 text-gray-300 cursor-not-allowed"}
								/>
							</div>
						)}
					</main>
				</div>
			</div>
		</div>

		{/* Delete Confirmation Modal */}
		{showDeleteModal && postToDelete && (
			<Modal
				isOpen={showDeleteModal}
				onClose={handleDeleteCancel}
				title="Delete Blog Post"
			>
				<div className="">
					<p className="text-gray-300 mb-6">
						Are you sure you want to delete &ldquo;<strong>{postToDelete.title}</strong>&rdquo;? 
						This action cannot be undone.
					</p>
					<div className="flex gap-3 justify-end">
						<button
							onClick={handleDeleteCancel}
							disabled={isDeleting}
							className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
						>
							Cancel
						</button>
						<button
							onClick={handleDeleteConfirm}
							disabled={isDeleting}
							className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
						>
							{isDeleting ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
									Deleting...
								</>
							) : (
								'Delete'
							)}
						</button>
					</div>
				</div>
			</Modal>
		)}
  </>)
}

export default BlogList;