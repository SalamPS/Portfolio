'use client'

import { delay } from "@/lib/delay";
import { useEffect, useState } from "react"

export default function Loading(
	{children, isLoading}: 
	{children?: React.ReactNode, isLoading:boolean}
) {
	const [wait, setWait] = useState(true)

	useEffect(() => {
		(async() => {
			await delay(300)
			setWait(isLoading)
		})();
	}, [isLoading])

	return (
		<div className="fixed duration-300 top-0 left-0 w-screen z-[999] h-screen flex flex-col items-center justify-center min-h-screen bg-background/95 backdrop-blur-sm"
			style={{
				opacity: isLoading ? 1 : 0,
				zIndex: wait ? '-1' : '999'}
			}>
			<div className="animate-spin rounded-full h-32 w-32 border-t-4 border-primary"></div>
			<p className="mt-12 text-lg animate-pulse text-white">{children}</p>
		</div>
	);
}