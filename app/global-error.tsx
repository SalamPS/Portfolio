"use client"

import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Not Found"
}

export default function NotFound() {
	return (<>
		<div className="flex flex-col h-[100svh] items-center justify-center p-8 pb-20 sm:p-20">
			<h1 className="text-3xl md:text-9xl">
				<b>OOPS!</b>
			</h1>
			<h2 className="text-xl md:text-2xl mb-6">
				Unexpected Error Occurred
			</h2>
			<p>Contact us if you found this page!</p>
		</div>
	</>);
}