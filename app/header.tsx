
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserData } from "./logics";

function Header() {

    const currentPath = usePathname();
    const [lastKey, setLastKey] = useState<string>("");

    useEffect(() => {
        const userData = getUserData();
        setLastKey(userData.lastMandalartKey ?? "");
    }, [currentPath]);

    return (
        <>
            <header className='relative z-40 w-full h-12 bg-slate-400 bg-no-repeat justify-center mb-6 md:mb-8 overflow-hidden'>
                <div className="contentWrapper flex justify-between items-center h-full">                    
                    <h1 className={' text-sm sm:text-base text-white font-bold transition-opacity duration-500 ' + (currentPath === "/" ? "opacity-0" : "opacity-100")}>
                        <Link href="/">
                            Mandalart app
                        </Link>
                    </h1>
                    <div className="bg-[url(/img/headerBG.png)] bg-contain bg-no-repeat bg-left h-full w-fit pl-24">
                        <nav className='relative z-20 flex justify-center gap-4 items-center h-full'>
                            <Link href="/" className={"font-bold text-white border-b-4 px-2 transition-colors " + (currentPath === "/" ? "border-slate-300" : "border-transparent")}>Home</Link>
                            <Link href={"/chart?mode=" + (lastKey == "" ? "createNew" : "continue&mainKey=" + lastKey)} className={"font-bold text-white border-b-4 px-2 transition-colors " + (currentPath === "/chart" ? "border-slate-300" : "border-transparent")}>Chart</Link>
                            <Link href="/list" className={"font-bold text-white border-b-4 px-2 transition-colors " + (currentPath === "/list" ? "border-slate-300" : "border-transparent")}>List</Link>
                        </nav>
                        <div className="absolute w-dvw h-full top-0  bg-slate-600"></div>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;