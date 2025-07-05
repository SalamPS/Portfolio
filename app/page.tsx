/* eslint-disable @next/next/no-img-element */
"use client"
import Link from "next/link";
import Introduction from "@/components/index/introduction";
import Content from "@/components/index/content";
import IndexBottom from "@/components/index/bottom";
import IndexLogo from "@/components/index/logo";
import ContentPortfolio from "@/components/portfolio/content";

const date = new Date();
const tanggal = date.getDate();
const bulan = date.getMonth() + 1;
const tahun = date.getFullYear();

export default function Home() {
  return (<>
    <main className="flex flex-col justify-between items-center p-4 md:p-8 h-[100vmax] md:h-screen gap-12">
      <div className="self-stretch flex md:flex-row md:pb-0 flex-wrap justify-between items-center gap-2 md:gap-4">
        <p className="relative m-0 p-2 px-4 md:p-4 text-sm border-[1px] border-gray-600 rounded-xl">
          Last deployment: &nbsp;
          <code className="code">{`${tanggal}/${bulan}/${tahun}`}</code>
        </p>
        <div className="flex justify-end items-end gap-2 text-sm md:text-base text-gray-300 ml-1">
          <div>
            Fullstack Dev {' '}
          </div>
          <Link
            href="https://nextjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/assets/next.svg"
              alt="Vercel"
              className="vercelLogo mb-[4px] md:mb-[7px] w-[66px] md:w-[100px]"
              height={100}
              width={64}
            />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 px-1 w-full xl:px-20 gap-12">
        <IndexLogo/>
        <div className="col-span-5 md:col-span-3 text-end hidden md:flex flex-col justify-center">
          <Introduction/>
        </div>
      </div>
      <div className="w-full">
        <div className="md:hidden w-full text-end px-1">
          <Introduction/>
        </div>
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 w-full">
          <IndexBottom/>
        </div>
      </div>
    </main>
    <section id="medias">
      <Content/>
    </section>
    <section id="medias">
      <ContentPortfolio/>
    </section>
    <footer className="text-center text-sm text-gray-500 py-8">&#169; 2024 LamP. All rights reserved.</footer>
  </>)
}
