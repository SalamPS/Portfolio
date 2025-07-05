/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */

const GlobalNavbar = () => {
	return (
		<nav className="fixed w-full">
			<div className="flex justify-between items-center px-12 py-4 bg-gray-800 text-white">
				<div className="h-8">
					<img src="/assets/lamp.png" alt="LamP" className="h-full aspect-square" />
				</div>
				<ul className="flex space-x-8">
					<li><a href="/" className="hover:underline">Blog</a></li>
					<li><a href="/" className="hover:underline">Reach me</a></li>
				</ul>
			</div>
		</nav>
	)
}

export default GlobalNavbar;