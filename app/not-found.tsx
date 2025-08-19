import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Page Not Found",
	description: "The page you are looking for could not be found. Return to homepage to explore more content.",
	robots: {
		index: false,
		follow: true,
	},
}

export default function NotFound() {
	return (<>
		<div className="flex flex-col h-[100svh] items-center justify-center p-8 pb-20 sm:p-20">
			<h1 className="text-3xl md:text-9xl">
				<b>404</b>
			</h1>
			<h2 className="text-xl md:text-2xl mb-6">
				NOT FOUND
			</h2>
			<p>Page you are searching was not found !</p>
		</div>
	</>);
}