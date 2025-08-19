/* eslint-disable @next/next/no-img-element */
import { blogAds_, blogStructure_, commentStructure_ } from "@/components/interface/blogStructure";
import { IconBookmark, IconHeartPlus } from "@tabler/icons-react";
import { AutoMD } from "@/components/utils/Markdown";
import Link from "next/link";
import { markdownToBlocks } from "@/components/blog/create/blockUtils";
import BlockPreview from "@/components/blog/create/BlockPreview";
import { sans } from "@/app/fonts/fonts";
// import AdBanner from "./Adsense";

const BlogContent = ({data, ads}: {data: blogStructure_, ads:blogAds_[]}) => {
	return (
		<>
			<div className="grid grid-cols-1 xl:grid-cols-12 px-8 py-24 xl:py-36 xl:px-28 gap-4 xl:gap-8">
				<section id="stats" className="xl:col-span-1 flex flex-row xl:flex-col order-2 xl:order-1 items-center justify-start gap-6">
					<div className="flex xl:flex-col gap-2 xl:gap-1 items-center justify-center">
						<div className="xl:bg-slate-700 xl:p-4 rounded-full">
							<IconHeartPlus/>
						</div>
						{data?.likes?.length || 0}
					</div>
					
					<div className="flex xl:flex-col gap-2 xl:gap-1 items-center justify-center">
						<div className="xl:bg-slate-700 xl:p-4 rounded-full">
							<IconBookmark/>
						</div>
						{data?.saves?.length || 0}
					</div>
				</section>
				<main id="content" className="xl:col-span-8 order-1 xl:order-2">
					<h1 className="text-4xl font-bold mb-2">{data?.title}</h1>
					<p>
						Posted by {data?.authorName} at {new Date(data?.createdAt || '').toLocaleDateString()}
					</p>
					<div>
						{data?.tags && data.tags.length > 0 && (
							<div className="flex flex-wrap gap-2 mt-2">
								{data.tags.map((tag, index) => (
									<span key={index} className="bg-[#0f6252] text-white px-3 py-1 rounded-md text-sm">
										{tag}
									</span>
								))}
							</div>
						)}
					</div>

					<div className={`my-6 xl:my-8 flex flex-col gap-2 ${sans.variable} font-[family-name:var(--font-sans)]`}>
						{/* Try to render as blocks first, fallback to AutoMD if it's old format */}
						{data?.content ? (() => {
							try {
								const blocks = markdownToBlocks(data.content);
								// If we have meaningful blocks, use the block renderer
								if (blocks.length > 1 || (blocks.length === 1 && blocks[0].type !== 'paragraph') || (blocks.length === 1 && blocks[0].content.length > 50)) {
									return <BlockPreview blocks={blocks} />;
								}
								// Otherwise use the traditional markdown renderer
								return <AutoMD content={data.content} />;
							} catch (error) {
								// Fallback to AutoMD if parsing fails
								console.warn('Failed to parse content as blocks, using AutoMD:', error);
								return <AutoMD content={data.content} />;
							}
						})() : null}
					</div>

					<div className="mt-4">
						<h2 className="text-xl font-semibold">Comments</h2>
						{data?.comments.length ? (
							data.comments.map((comment: commentStructure_, index: number) => (
								<div key={index} className="border p-2 my-2 rounded">
									<p className="text-sm text-gray-500">{comment.authorName}:</p>
									<p>{comment.content}</p>
								</div>
							))
						) : (
							<p className="text-sm text-gray-500">No comments yet.</p>
						)}
					</div>
				</main>
				
				<section id="ads" className="xl:col-span-3 w-full order-last xl:w-96 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1 gap-4 h-fit">
					<div className="w-full flex items-center justify-center aspect-square border border-slate-600 bg-slate-800/40 rounded shadow text-slate-400">
						<div className="text-xs text-gray-400 mb-2 text-center">Advertisement</div>
						{/* <AdBanner
							dataAdSlot="8897271609"
							dataAdFormat="auto"
							dataFullWidthResponsive={true}
						/> */}
					</div>
					{ads && (
						ads.map((ad, index) => (
							<div key={index}>
								<Link href={ad.adsLink} target="_blank" rel="noopener noreferrer" className="rounded shadow hover:shadow-lg transition-shadow">
									<img src={ad.adsImageLink} alt={ad.adsTitle} className="w-full object-cover rounded"/>
								</Link>
							</div>
						))
					)}					
				</section>
			</div>
		</>
	)
}

export default BlogContent