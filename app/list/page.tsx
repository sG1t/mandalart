
"use client"

import { useEffect, useState } from "react";
import { getUserData } from "../logics";
import { t_mandalartDatas } from "../types";
import Link from "next/link";

import { motion } from "framer-motion";
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';


type t_order = "title" | "createdDate" | "lastUpdate";

function Sortable(props: {mandalartMainKey: string, idx: number, title: string, createdDate: Date, updateDate: Date}) {
    const {mandalartMainKey, idx, title, createdDate, updateDate} = props;

    return (
        <motion.div
            layout
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-80 bg-white rouded p-4 my-4 mx-auto"
        >
            <Link href={`/chart?mode=continue&mainKey=${mandalartMainKey}`} className="inline-block font-bold text-sky-500 mb-4 underline">
                {title || "無題のマンダラート"}
            </Link>
            <p className="mb-2 text-sm">作成日時 : {new Date(createdDate).toLocaleDateString()} {new Date(createdDate).toLocaleTimeString()}</p>
            <p className="text-sm">最終更新 : {new Date(updateDate).toLocaleDateString()} {new Date(updateDate).toLocaleTimeString()}</p>
        </motion.div>
    )
}

function List() {

    const [mandalartDatas, setMandalartDatas] = useState<{[key: string]: t_mandalartDatas}>({});
    const [keysArr, setKeysArr] = useState<string[]>([]);
    const orderArr: [t_order, string][] = [["title", "タイトル"], ["createdDate", "作成日時"], ["lastUpdate", "最終更新"]];
    const [orderIdx, setOrderIdx] = useState<number>(0);
    const [isAscending, setIsAscending] = useState<boolean>(true);
    const [searchStr, setSearchStr] = useState<string>("");

    useEffect(() => {
        // chartList取得
        const userData = getUserData();
        setMandalartDatas(userData.mandalartDatas);
        setKeysArr(Object.keys(userData.mandalartDatas));
    }, [])

    useEffect(() => {
        const nextKeysArr = Object.keys(mandalartDatas).filter((val) => {
            const title = mandalartDatas[val].title ? mandalartDatas[val].title.trim().toLowerCase() : "無題のマンダラート";
            return title.includes(searchStr.toLocaleLowerCase());
        });
        switch(orderArr[orderIdx][0]) {
            case "title": {
                nextKeysArr.sort((a, b) => mandalartDatas[a].title > mandalartDatas[b].title ? 1 : -1)
                break
            }
            case "createdDate": {
                nextKeysArr.sort((a, b) => mandalartDatas[a].createdDate > mandalartDatas[b].createdDate ? 1 : -1)
                break
            }
            case "lastUpdate": {
                nextKeysArr.sort((a, b) => mandalartDatas[a].updateDate > mandalartDatas[b].updateDate ? 1 : -1)
                break
            }
            default: {
            }

        }
        if(!isAscending) {
            nextKeysArr.reverse();
        }
        setKeysArr(nextKeysArr);

    }, [orderIdx, isAscending, mandalartDatas, searchStr])

    function handleChangeSearch(ev:React.ChangeEvent<HTMLInputElement>) {
        setSearchStr(ev.currentTarget.value);
    }

    function handleOrderBtn() {
        setOrderIdx((prev) => {
            return (prev + 1) % orderArr.length
        })
    }
    function handleToggleAscDec() {
        setIsAscending((prev) => !prev);
    }

    return (
        <div className="relative h-full max-h-[80dvh]">
            {
                Object.keys(mandalartDatas).length == 0 ? (
                    <p className="translate-y-10 text-center">
                        チャートが作成されていません<br></br>
                        メインメニューから新規作成しましょう
                    </p>
                ) : (
                    <div className="flex flex-col h-full w-96 mx-auto">
                        <div className="flex justify-between w-full mb-4">
                            <input type="text" value={searchStr} onChange={handleChangeSearch} placeholder="チャートを検索" className="bg-white rounded border border-slate-600 px-1"></input>
                            <div>
                                <button onClick={handleOrderBtn} className="w-24 bg-white text-center mr-2 border border-slate-600 rounded">
                                    {
                                        orderArr[orderIdx][1]
                                    }
                                </button>
                                <button onClick={handleToggleAscDec} className="w-5 h-5 p-1 rounded hover:bg-slate-200" aria-label="昇順・降順切り替え">
                                    <svg className={ `fill-slate-600 ${isAscending ? "" : "rotate-180"}` } xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                    {/* <!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--> */}
                                    <path d="M32 224c-12.9 0-24.6-7.8-29.6-19.8S.2 178.5 9.4 169.4l160-160c12.5-12.5 32.8-12.5 45.3 0l160 160c9.2 9.2 11.9 22.9 6.9 34.9S364.9 224 352 224L32 224z"/></svg>
                                </button>
                            </div>
                        </div>
                            {/* <DragDropProvider> */}
                                <SimpleBar autoHide={false} id="simpleBar" className="grow flex flex-col w-full h-full overflow-y-auto">
                                    {
                                        keysArr.map((val, idx) => (
                                            <Sortable key={val} mandalartMainKey={val} idx={idx} title={mandalartDatas[val].title} createdDate={mandalartDatas[val].createdDate} updateDate={mandalartDatas[val].updateDate}></Sortable>
                                        ))
                                    }
                                </SimpleBar>
                            {/* </DragDropProvider> */}
                    </div>
                )
            }

        </div>
    )

}

export default List