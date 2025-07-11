/* eslint-disable @next/next/no-img-element */
import { blogAds_, blogStructure_, commentStructure_ } from "@/components/interface/blogStructure";
import { IconBookmark, IconHeartPlus } from "@tabler/icons-react";
import { AutoMD } from "@/components/utils/Markdown";
import AdBanner from "./Adsense";
import Link from "next/link";

const BlogContent = ({data, ads}: {data: blogStructure_, ads:blogAds_[]}) => {
	return (
		<>
			<div className="flex flex-col xl:flex-row px-8 py-24 xl:py-36 xl:px-28 gap-4 xl:gap-8">
				<section id="stats" className="flex flex-row xl:flex-col order-2 xl:order-1 items-center justify-start gap-6">
					<div className="flex xl:flex-col gap-2 xl:gap-1 items-center justify-center">
						<div className="xl:bg-slate-700 xl:p-4 rounded-full">
							<IconHeartPlus/>
						</div>
						{data?.likes}
					</div>
					
					<div className="flex xl:flex-col gap-2 xl:gap-1 items-center justify-center">
						<div className="xl:bg-slate-700 xl:p-4 rounded-full">
							<IconBookmark/>
						</div>
						{data?.saves}
					</div>
				</section>
				<main className="grow order-1 xl:order-2">
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

					<div className="my-6 xl:my-8 flex flex-col gap-2">
						<AutoMD content={data?.content || ''}/>
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
				
				<section id="ads" className="w-full order-last xl:w-96 flex flex-col gap-4">
					<div className="w-full aspect-square bg-slate-100 rounded shadow">
						<AdBanner
							dataAdSlot="8897271609"
							dataAdFormat="auto"
							dataFullWidthResponsive={true}
						/>
					</div>
					{ads && (
						ads.map((ad, index) => (
							<Link key={index} href={ad.adsLink} target="_blank" rel="noopener noreferrer" className="bg-slate-500 rounded shadow hover:shadow-lg transition-shadow">
								<img src={ad.adsImageLink} alt={ad.adsTitle} className="w-full object-cover rounded"/>
							</Link>
						))
					)}					
				</section>
			</div>
		</>
	)
}

export default BlogContent