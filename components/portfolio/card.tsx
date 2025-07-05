/* eslint-disable @next/next/no-img-element */
import { motion } from "framer-motion";
import { _links } from "./data";
import { Dispatch, SetStateAction } from "react";

export default function PortfolioCard ({item, type, index, setPopup}: {item: _links, type: string, index: number, setPopup:Dispatch<SetStateAction<number>>}) {
	if (item.type == type) return <motion.div
		key={item.link+index}
		onClick={() => {setPopup(index)}}
		className="py-1 md:py-1 cursor-pointer pl-4 md:pl-6 pr-4 md:pr-10 border-l-2 border-gray-400 hover:border-white transition-colors hover:translate-y-[-4px] md:text-start flex flex-col gap-2 rounded-r-xl hover:bg-[#313b5d33]"
		initial={{ opacity: 0, x: -20 }}
		whileInView={{ opacity: 1, x: 0 }}
		transition={{
				delay: index%3*0.1,
				duration: 0.5,
				ease: "easeOut",
		}}>
		<h2 className="font-bold text-xl md:text-2xl mb-0 md:mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
				<img src={item.icon} alt={item.name} className="w-6 h-6 mb-1 mr-3 inline-block rounded-md" />
				{item.name}
		</h2>
		<p className="text-sm text-gray-400 line-clamp-2">
				{item.year ? `(${item.year})` : ''} {item.desc}
		</p>
	</motion.div> 
}