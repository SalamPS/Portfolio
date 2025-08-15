/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import { useState, useEffect } from 'react';

const GlobalNavbar = ({children, space, logo}: {children?: React.ReactNode, space?: boolean, logo?: string}) => {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY;
			setIsScrolled(scrollTop > 100);
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<nav className="fixed w-full z-20 transition-all duration-300 ease-in-out">
			<div className={
				`flex justify-between items-center text-white transition-all duration-300 ease-in-out `
				+ (space ? `px-8 xl:px-28 py-4 md:py-8 ${isScrolled ? 'bg-lampblack/70 backdrop-blur-md shadow-lg' : ''}` : 'px-6 md:px-12 py-4 bg-lampblack/70 backdrop-blur-md shadow-lg')
			}>
				<div className="h-8 md:h-12 flex items-end">
					<img src={logo || "/assets/lamp.png"} alt="LamP" className="h-full aspect-square" />
				</div>
				<ul className="flex space-x-8">
					{children ? children : 
					(<>
						<li><a href="/blog" className="hover:underline">Blog</a></li>
						<li><a href="/" className="hover:underline">Reach me</a></li>
					</>)}
				</ul>
			</div>
		</nav>
	)
}

export default GlobalNavbar;