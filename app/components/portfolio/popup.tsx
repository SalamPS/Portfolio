'use client'
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { _links, links } from "./data";
import Link from "next/link";

export default function PopupPortfolio ({popup, setPopup}: {popup:number, setPopup:Dispatch<SetStateAction<number>>}) {
	const [item, setItem] = useState<_links|undefined>(undefined)
	useEffect(() => {
		if (popup !== -1) {
			setItem(links[popup])
		}
		else {
			setItem(undefined)
		}
	}, [popup])

	return <>
		<div className={`backdrop-blur-sm bg-opacity-50 fixed inset-0 h-full w-full duration-500 bg-black ${popup === -1 ? ' opacity-0 z-[-1]' : 'opacity-100 z-[997]'}`}></div>
		<div className={`z-[999] px-2 md:px-0 fixed inset-0 h-[100svh] flex justify-center items-center duration-500 ${popup === -1 ? 'translate-y-[-100svh]' : ''}`}>
			<div className="fixed inset-0 h-full w-full" onClick={() => {setPopup(-1)}}></div>
			<div className="z-[998] w-full md:w-[60%] lg:w-[50%] bg-lampblack px-4 py-6 md:p-8 rounded-2xl">
				<h1 className="text-xl md:text-2xl pb-3 md:pb-4">
					<span className="border-b-4 pb-1 border-gray-400 inline-block px-2">
						{item?.name} {item?.year ? `- ${item.year}` : ''}
					</span>
				</h1>
				<p className="text-gray-200 text-xs md:text-base">
					{item?.desc}
				</p>
				<div className="grid grid-cols-2 gap-2 my-2 md:my-3">
					{item?.imageUrl 
						&& item.imageUrl.map((img, i) => <>
							<div key={i} 
								className={`rounded-md aspect-video bg-cover bg-no-repeat my-2 md:my-3 ${item?.imageUrl && item.imageUrl.length < 2 ? 'col-span-2' : ''}`}	 
								style={{backgroundImage: `url(/storage/portfolio-ev/${img})`, backgroundPosition: 'center top'}}>
							</div>
						</>)
					}
				</div>
				<div className="flex">
					{item?.link && <Link className="text-black rounded-full px-5 py-2 text-sm bg-gray-200 duration-200 hover:bg-white" href={item.link} target="_blank">
						Visit {item.name}
					</Link>}
				</div>
			</div>
		</div>
	</>
}