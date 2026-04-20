
"use client"

import { useEffect, useMemo, useState } from "react";
import { cntEditedCells, getUserData } from "../logics";
import { t_mandalartDatas } from "../types";
import Link from "next/link";

import { motion } from "framer-motion";
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { DeleteDialog } from "./dialog";


type t_order = "title" | "createdDate" | "lastUpdate" | "count";

function Sortable(props: {mandalartMainKey: string, cnt: number, title: string, createdDate: Date, updateDate: Date, handleOpenDelete: (val: string) => void}) {
    const {mandalartMainKey, cnt, title, createdDate, updateDate, handleOpenDelete} = props;

    return (
        <motion.div
            layout
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-72 sm:w-80 bg-white rouded p-4 my-4 mx-auto rounded"
        >
            <div className="flex justify-between mb-4">
                <Link href={`/chart?mode=continue&mainKey=${mandalartMainKey}`} className="inline-block font-bold text-sky-500 underline text-center min-w-10 max-w-54 overflow-hidden whitespace-nowrap text-ellipsis">
                    {title || "無題のマンダラート"}
                </Link>
                <button onClick={() => handleOpenDelete(mandalartMainKey)} className="w-5 h-5 p-0.5 fill-slate-500 hover:bg-slate-200 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    {/* <!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--> */}
                    <path d="M136.7 5.9L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-8.7-26.1C306.9-7.2 294.7-16 280.9-16L167.1-16c-13.8 0-26 8.8-30.4 21.9zM416 144L32 144 53.1 467.1C54.7 492.4 75.7 512 101 512L347 512c25.3 0 46.3-19.6 47.9-44.9L416 144z"/></svg>
                </button>
            </div>
            <p className="mb-2 text-sm">編集済み : {cnt} マス</p>
            <p className="mb-2 text-sm">作成日時 : {new Date(createdDate).toLocaleDateString()} {new Date(createdDate).toLocaleTimeString()}</p>
            <p className="text-sm">最終更新 : {new Date(updateDate).toLocaleDateString()} {new Date(updateDate).toLocaleTimeString()}</p>
        </motion.div>
    )
}

function List() {

    const [mandalartDatas, setMandalartDatas] = useState<{[key: string]: t_mandalartDatas}>({});
    const orderArr: [t_order, string][] = [["title", "タイトル"], ["createdDate", "作成日時"], ["lastUpdate", "最終更新"], ["count", "編集済み"]];
    const [orderIdx, setOrderIdx] = useState<number>(2);
    const [isAscending, setIsAscending] = useState<boolean>(false);
    const [searchStr, setSearchStr] = useState<string>("");

    const [deleteMainKey, setDeleteMainKey] = useState<string>("");

    const keysArr = useMemo(() => {
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
            case "count": {
                nextKeysArr.sort((a, b) => cntEditedCells(mandalartDatas[a].mandalartChart) > cntEditedCells(mandalartDatas[b].mandalartChart) ? 1 : -1)
                break
            }
            default: {
            }
        }
        if(!isAscending) {
            nextKeysArr.reverse();
        }
        return nextKeysArr;
    }, [mandalartDatas, orderIdx, isAscending, searchStr])

    useEffect(() => {
        // chartList取得
        const userData = getUserData();
        setMandalartDatas(userData.mandalartDatas);
    }, [])

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

    function handleOpenDelete(val:string) {
        setDeleteMainKey(val)
    }

    return (
        <>
            <DeleteDialog deleteMainKey={deleteMainKey} setDeleteMainKey={setDeleteMainKey} mandalartDatas={mandalartDatas} setMandalartDatas={setMandalartDatas} ></DeleteDialog>
            <div className="relative h-full max-h-[80dvh]">
                {
                    Object.keys(mandalartDatas).length == 0 ? (
                        <p className="translate-y-10 text-center">
                            チャートが作成されていません<br></br>
                            メインメニューから新規作成しましょう
                        </p>
                    ) : (
                        <div className="flex flex-col h-full w-80 sm:w-96 mx-auto">
                            <div className="flex justify-between w-full px-2 mb-4">
                                <input type="text" value={searchStr} onChange={handleChangeSearch} placeholder="チャートを検索" className="bg-white rounded border border-slate-600 px-1 w-40 sm:w-48"></input>
                                <div>
                                    <button onClick={handleOrderBtn} className="w-24 bg-white text-center mr-2 border border-slate-600 rounded">
                                        {
                                            orderArr[orderIdx][1]
                                        }
                                    </button>
                                    <button onClick={handleToggleAscDec} className="w-5 h-5 p-0.5 rounded hover:bg-slate-200" aria-label="昇順・降順切り替え">
                                        {
                                            isAscending ? (
                                                <svg className="fill-slate-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                                {/* <!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--> */}
                                                <path d="M320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0zm0 128c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0zm0 128c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0zm0 128c-17.7 0-32 14.3-32 32s14.3 32 32 32l224 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-224 0zM150.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L96 141.3 96 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-306.7 41.4 41.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-96-96z"/></svg>
                                            ) : (
                                                <svg className="fill-slate-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                                {/* <!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--> */}
                                                <path d="M246.6 374.6l-96 96c-12.5 12.5-32.8 12.5-45.3 0l-96-96c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L96 370.7 96 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 306.7 41.4-41.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3zM320 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l32 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-96 0zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32l160 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-160 0zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32l224 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L320 96z"/></svg>
                                            )
                                        }
                                    </button>
                                </div>
                            </div>
                                {/* <DragDropProvider> */}
                                    <SimpleBar autoHide={false} id="simpleBar" className="grow flex flex-col w-full h-full overflow-y-auto">
                                        {
                                            keysArr.map((val) => (
                                                <Sortable key={val} cnt={cntEditedCells(mandalartDatas[val].mandalartChart)} mandalartMainKey={val} title={mandalartDatas[val].title} createdDate={mandalartDatas[val].createdDate} updateDate={mandalartDatas[val].updateDate} handleOpenDelete={handleOpenDelete}></Sortable>
                                            ))
                                        }
                                    </SimpleBar>
                                {/* </DragDropProvider> */}
                        </div>
                    )
                }

            </div>
        </>
    )

}

export default List