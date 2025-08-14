/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */

const GlobalNavbar = ({children, space, logo}: {children?: React.ReactNode, space?: boolean, logo?: string}) => {
	return (
		<nav className="fixed w-full z-20">
			<div className={
				`flex justify-between items-center text-white `
				+ (space ? 'px-8 xl:px-28 py-4 md:py-8' : 'px-6 md:px-12 py-4 bg-gray-800')
			}>
				<div className="h-8 md:h-12 flex items-end">
					<img src={logo || "/assets/lamp.png"} alt="LamP" className="h-full aspect-square" />
				</div>
				<ul className="flex space-x-8">
					{children ? children : 
					(<>
						<li><a href="/" className="hover:underline">Blog</a></li>
						<li><a href="/" className="hover:underline">Reach me</a></li>
					</>)}
				</ul>
			</div>
		</nav>
	)
}

export default GlobalNavbar;