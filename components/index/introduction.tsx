"use client"
import {motion} from "framer-motion"
import Link from "next/link"

interface _job { position:string, company:string, link:string }
const job:_job[] = [
  {
    position: 'Founder',
    company: 'LamP',
    link: 'https://id.linkedin.com/company/lampdynamics?trk=public_profile_experience-item_profile-section-card_subtitle-click'
  }
]

export default function Introduction () {
    return <>
        <h2 className="text-2xl">
            <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                }}>
                hello!
            </motion.span>
            {" "}
            <motion.span className="xl:hidden inline-block"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                }}>
                {" "}i{"'"}m{" "}
            </motion.span>
        </h2>
        <h1 className="text-3xl mb-4">
            <motion.span 
                className="hidden xl:inline-block"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                }}>
                i{"'"}m
            </motion.span>
            {" "}
            <motion.span 
                className="text-[#8da2e4] font-bold inline-block"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                    delay: 0.5,
                    duration: 1,
                    ease: "easeInOut",
                }}>
                Muhammad Salam Pararta
            </motion.span>
        </h1>
        <div className="flex justify-end">
            <motion.p className="text-end text-sm text-gray-300 w-[90%] xl:w-[80%]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 1.3,
                    duration: .8,
                    ease: "easeOut",
                }}>
                A Fullstack Web Developer with a love for MERN Stack and NextJS. Also work with Flutter, C, C++ and Python.
            </motion.p>
        </div>
        <div className="flex flex-wrap justify-end gap-2 md:gap-3 mt-4 text-sm">
            {job.map((job:_job, index:number) => (
                <motion.div className="bg-white text-[#1d2337] rounded-full px-4 py-1 md:px-5 md:py-2" key={job.company}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                        delay: 1.8 + index*0.3,
                        duration: 0.6,
                        ease: "easeOut",
                    }}>
                    {job.position} of {" "}
                    <Link className="font-bold" href={job.link} target="_blank">
                        {job.company}
                    </Link>
                </motion.div>
            ))}
        </div>
    </>
}