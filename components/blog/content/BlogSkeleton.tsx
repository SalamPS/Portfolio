import { IconBookmark, IconHeartPlus } from "@tabler/icons-react";
import { Skeleton } from "@/components/global/Skeleton";

const BlogSkeleton = () => {
	return (
		<>
			<div className="flex flex-col xl:flex-row px-8 py-24 xl:py-36 xl:px-28 gap-4 xl:gap-8">
				<section id="stats" className="flex flex-row xl:flex-col order-2 xl:order-1 items-center justify-start gap-6">
					<div className="flex xl:flex-col gap-2 xl:gap-1 items-center justify-center">
						<div className="xl:bg-slate-700 xl:p-4 rounded-full">
							<IconHeartPlus/>
						</div>
						{0}
					</div>
					
					<div className="flex xl:flex-col gap-2 xl:gap-1 items-center justify-center">
						<div className="xl:bg-slate-700 xl:p-4 rounded-full">
							<IconBookmark/>
						</div>
						{0}
					</div>
				</section>
				<main className="grow order-1 xl:order-2">
					<Skeleton className="bg-white rounded-full w-full text-4xl font-bold mb-2">
						<h1>A</h1>
					</Skeleton>
					<Skeleton className="bg-white rounded-full w-36">
						<p>A</p>
					</Skeleton>
					<Skeleton className="bg-white rounded-full w-24 mt-2 text-sm">
						<p>A</p>
					</Skeleton>

					<div className="my-6 xl:my-8 flex flex-col gap-2">
						<Skeleton className="bg-white rounded-full w-64 text-xl">
							<p>A</p>
						</Skeleton>
						<Skeleton className="bg-white rounded-full w-full text-sm">
							<p>A</p>
						</Skeleton>
						<Skeleton className="bg-white rounded-full w-full text-sm">
							<p>A</p>
						</Skeleton>
					</div>

					<div className="my-12 flex flex-col gap-2">
						<h2 className="text-xl font-semibold">Comments</h2>
						<Skeleton className="bg-white rounded-full w-full">
							<p>A</p>
						</Skeleton>
						<Skeleton className="bg-white rounded-full w-full text-sm">
							<p>A</p>
						</Skeleton>
						<Skeleton className="bg-white rounded-full w-full text-sm">
							<p>A</p>
						</Skeleton>
					</div>
				</main>
				
				<section id="ads" className="w-full order-last xl:w-96 flex flex-col gap-4">
				</section>
			</div>
		</>
	)
}

export default BlogSkeleton