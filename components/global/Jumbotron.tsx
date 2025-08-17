export default function Jumbotron ({children}: {children?: React.ReactNode}) {
	return (
		<div
			className="pt-24 md:pt-44 bg-cover bg-left-top text-white px-8 xl:px-28 py-12 md:py-32 rounded-lg shadow-lg"
			style={{ backgroundImage: "url('/assets/jumbotron.png')" }}
		>
			{children ? children : (
				<>
					<h1 className="text-3xl font-bold mb-4">Welcome to LamP Portfolio</h1>
					<p className="text-md md:text-lg text-slate-400">Explore the latest articles, insights, and stories from my journey!</p>
				</>
			)}
		</div>
	)
}