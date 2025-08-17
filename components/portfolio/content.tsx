/* eslint-disable @next/next/no-img-element */
"use client"
import { useState } from "react";
import Typing from "../utils/Typing";
import { _links, links } from "./data";
import PopupPortfolio from "./popup";
import PortfolioCard from "./card";

export default function ContentPortfolio () {
    const [popup, setPopup] = useState<number>(-1)
    const [mode, setMode] = useState<'beenMade'|'beenPartOf'>('beenMade')

    return <>
    <PopupPortfolio popup={popup} setPopup={setPopup}/>
    <div className="px-6 md:px-8 mt-8">
        <div className="flex justify-between border-t-2 border-gray-400">
            <h1 className="text-xl md:text-4xl py-8">
                {mode === 'beenMade' ? <Typing words={['Projects been made']}/> : <Typing words={['Has been part of']}/>}
            </h1>
            <button className="text-xl md:text-3xl" onClick={() => setMode(mode === 'beenMade' ? 'beenPartOf' : 'beenMade')}>
                {mode === 'beenMade' ? <i className="bi bi-toggle-off"/> : <i className="bi bi-toggle-on"/>}
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {mode === 'beenMade' 
            ? links.map((item:_links,index:number) => (<PortfolioCard key={item.link+index} item={item} type="beenMade" index={index} setPopup={setPopup}/>))
            : links.map((item:_links,index:number) => (<PortfolioCard key={item.link+index} item={item} type="beenPartOf" index={index} setPopup={setPopup}/>))}
        </div>
    </div>
    </>
}