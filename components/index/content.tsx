"use client"
import { motion } from "framer-motion";

interface _links { name:string, desc:string, link:string }
const links:_links[] = [
    {
        name: 'LinkedIn',
        desc: 'Know me better at my personal profile on LinkedIn',
        link: 'https://www.linkedin.com/in/salam-pararta/',
    },
    {
        name: 'GitHub',
        desc: 'Take a look at some of my public repos here!',
        link: 'https://github.com/SalamPS',
    },
    {
        name: 'Codes',
        desc: 'Find some of website coding Guide, Tips and Tricks here!',
        link: 'https://www.instagram.com/lamp.devs/',
    },
    {
        name: 'Featured',
        desc: 'Current project that I am working on, I love to work on it tbh!',
        link: 'https://netradapt.com/',
    },
]

export default function Content () {
    return <div className="px-6 md:px-8">
        <h1 className="text-3xl md:text-4xl text-end py-8">
            My Medias
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {links.map((item:_links,index:number) => (
                <motion.a
                    key={item.link}
                    href={item.link}
                    className="py-1 md:py-3 pl-4 md:pl-6 pr-4 md:pr-10 border-l-2 border-gray-400 hover:border-white transition-colors hover:translate-y-[-4px] md:text-start flex flex-col gap-2 rounded-r-xl hover:bg-[#313b5d33]"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                        delay: index*0.1,
                        duration: 0.5,
                        ease: "easeOut",
                    }}>
                    <h2 className="font-bold text-xl md:text-2xl mb-0 md:mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                        {item.name}
                    </h2>
                    <p className="text-sm text-gray-400 line-clamp-2">
                        {item.desc}
                    </p>
                </motion.a>
            ))}
        </div>
    </div>
}