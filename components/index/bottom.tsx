"use client"
import {motion} from "framer-motion"

interface _contact { name: string, full: string, link: string, icon: string }
const contact:_contact[] = [
  {
    name: 'WhatsApp',
    full: '(+62) 813-6677-6988',
    link: 'https://wa.me/6281366776988',
    icon: 'whatsapp'
  },
  {
    name: 'Instagram',
    full: '@salamp.png',
    link: 'https://instagram.com/salamp.png',
    icon: 'instagram'
  },
  {
    name: 'LinkedIn',
    full: 'Muhammad Salam Pararta',
    link: 'https://www.linkedin.com/in/salam-pararta/',
    icon: 'linkedin'
  },
]

export default function IndexBottom () {
    return <>
    <div className="w-full flex flex-wrap justify-start gap-4 text-sm">
        <div className="w-[50%] text-gray-400">
            <motion.span
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 2,
                  duration: 1.5,
                  ease: "easeInOut",
                }}>
                I{"'"}m constantly exploring new technologies and currently diving in Python Machine Learning.
            </motion.span>
        </div>
    </div>
    <div className="w-full hidden md:flex flex-col flex-wrap items-end justify-end gap-4">
        <div className="absolute flex flex-col flex-wrap items-end justify-end gap-4">
            {contact.map(((item:_contact) =>(
            <motion.a 
                target="_blank"
                key={item.link} 
                href={item.link} 
                initial={{ backgroundColor: '#313b5d55', opacity: 0 }}
                whileInView={{ backgroundColor: '#313b5daa', opacity: 1 }}
                transition={{
                  delay: 2,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
                className="hover:bg-[#455383] duration-200 cursor-pointer w-10 h-10 rounded-full flex items-center justify-center">
                <i className={`bi bi-${item.icon}`}/>
            </motion.a>)))}
        </div>
    </div>
    </>
}