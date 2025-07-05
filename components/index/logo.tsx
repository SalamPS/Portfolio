/* eslint-disable @next/next/no-img-element */
"use client"
import {motion} from "framer-motion"

export default function IndexLogo () {
    return <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{
            delay: 2.1,
            duration: 1.5,
            ease: "easeOut",
        }}
        className="text-center md:text-start col-span-5 md:col-span-2">
        <img
            src="/assets/lamp.png"
            alt="Next.js Logo"
            className="z-10 inline-block"
            width={180}
            height={180}
        />
    </motion.div>
}