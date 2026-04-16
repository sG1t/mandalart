import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { t_mandaraCell } from "../types";

export function TitleChangeDialog(props: {isTitleDialog: boolean, setIsTitleDialog: Dispatch<SetStateAction<boolean>>, title: string, setTitle: Dispatch<SetStateAction<string>>}) {

    const {isTitleDialog, setIsTitleDialog, title, setTitle} = props;

    const [currentTitle, setCurrentTitle] = useState<string>(title);

    const titleInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(isTitleDialog == false) {
            return;
        }
        setCurrentTitle(title);
        titleInputRef.current?.focus();
    }, [isTitleDialog])

    function handleKeydown(ev:React.KeyboardEvent<HTMLInputElement>) {
        if(ev.key.toLowerCase() != "enter") {
            return;
        }
        handleDefineBtn()
    }

    function handleChangeInput(ev:React.ChangeEvent<HTMLInputElement>) {
        setCurrentTitle(ev.currentTarget.value);
    }

    function handleDefineBtn() {
        setTitle(currentTitle);
        setIsTitleDialog(false);
    }

    function handleClose() {
        setIsTitleDialog(false);
    }

    return (
        <>
            <div onClick={handleClose} aria-label="背景クリックで閉じる" className={"fixed z-40 inset-0 w-dvw h-dvh bg-slate-800/50 " + (isTitleDialog ? "block" : "hidden")}></div>
            <dialog open className={ "fixed z-50 inset-0 m-auto w-80 h-60 bg-white rounded shadow-lg p-4 transition-all duration-300 " + (isTitleDialog ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none")}>
                <h2 className="text-lg font-bold text-center text-emerald-600 mb-10">タイトルを入力</h2>
                <input ref={titleInputRef} onChange={handleChangeInput} onKeyDown={handleKeydown} value={currentTitle} className="block w-60 px-2 mx-auto font-bold text-slate-600 text-lg text-center border-b-2 border-slate-400 focus:bg-sky-100 focus:outline-none"></input>
                <button className="absolute bottom-12 right-4 text-white font-bold text-lg px-8 bg-sky-500 rounded" onClick={handleDefineBtn}>
                    決定
                </button>
                <button className="absolute bottom-4 right-4 text-slate-600 font-bold px-2 rounded" onClick={handleClose}>
                    キャンセル
                </button>
            </dialog>
        </>
    )
}

const colorsArr: string[] = [
    "bg-red-200",
    // "bg-orange-200",
    "bg-amber-200",
    // "bg-yellow-200",
    "bg-lime-200",
    // "bg-green-200",
    "bg-emerald-200",
    // "bg-teal-200",
    "bg-cyan-200",
    // "bg-sky-200",
    "bg-blue-200",
    // "bg-indigo-200",
    "bg-violet-200",
    // "bg-purple-200",
    "bg-fuchsia-200",
    // "bg-pink-200",
    "bg-rose-200",
    "bg-mauve-200",
    "bg-slate-200",
    "bg-slate-50",
]

export function EditCardDialog(props: {isEditCardDialog: boolean, setIsEditCardDialog: Dispatch<SetStateAction<boolean>>, mandalartDatas: {[key:string]: t_mandaraCell[]}, setMandalartDatas: Dispatch<SetStateAction<{[key:string]: t_mandaraCell[]}>>, editCartKey:string}) {

    const {isEditCardDialog, setIsEditCardDialog, mandalartDatas, setMandalartDatas, editCartKey} = props;

    const [currentText, setCurrentText] = useState<string>("");
    const [currentColor, setCurrentColor] = useState<string>("")

    const cardNameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(isEditCardDialog == false) {
            return;
        }
        Object.values(mandalartDatas).forEach((arr) => {
            const idx = arr.findIndex(v => v.id == editCartKey);
            if(idx != -1) {
                setCurrentText(arr[idx].text);
                setCurrentColor(arr[idx].color);
                return;
            }
        })
        cardNameInputRef.current?.focus();
    }, [isEditCardDialog])

    function handleKeydown(ev:React.KeyboardEvent<HTMLInputElement>) {
        if(ev.key.toLowerCase() != "enter") {
            return;
        }
        handleDefineBtn()
    }

    function handleChangeInput(ev:React.ChangeEvent<HTMLInputElement>) {
        setCurrentText(ev.currentTarget.value);
    }

    function handleDefineBtn() {
        setMandalartDatas((prev) => {
            const next = structuredClone(prev);
            Object.keys(prev).forEach((k) => {
                prev[k].forEach((v, i) => {
                    if(v.id == editCartKey) {
                        next[k][i].text = currentText;
                        next[k][i].color = currentColor;
                    }
                })
            })
            return next;
        })
        setIsEditCardDialog(false);
    }

    function handleColorBtn(val:string) {
        setCurrentColor(val);
    }

    function handleClose() {
        setIsEditCardDialog(false);
    }

    return (
        <>
            <div onClick={handleClose} aria-label="背景クリックで閉じる" className={"fixed z-40 inset-0 w-dvw h-dvh bg-slate-800/50 " + (isEditCardDialog ? "block" : "hidden")}></div>
            <dialog open className={ "fixed z-50 inset-0 m-auto w-80 h-96 bg-white rounded shadow-lg p-4 transition-all duration-300 " + (isEditCardDialog ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none")}>
                <h2 className="text-lg font-bold text-center text-emerald-600 mb-10">カードを編集</h2>
                <input ref={cardNameInputRef} onChange={handleChangeInput} onKeyDown={handleKeydown} value={currentText} className="block w-60 px-2 mx-auto font-bold text-slate-600 text-lg text-center border-b-2 border-slate-400 focus:bg-sky-100 focus:outline-none mb-10"></input>
                <div className="w-60 mx-auto flex justify-baseline flex-wrap gap-2">
                    {
                        colorsArr.map((val, idx) => (
                            <button onClick={() => handleColorBtn(val)} aria-label={"カード色 " + val} key={idx} className={"w-8 h-8 border-neutral-400 border rounded ring-blue-400 " + (currentColor == val ? " ring " : " ") + val}>

                            </button>

                        ))
                    }

                </div>
                <button className="absolute bottom-12 right-4 text-white font-bold text-lg px-8 bg-sky-500 rounded" onClick={handleDefineBtn}>
                    決定
                </button>
                <button className="absolute bottom-4 right-4 text-slate-600 font-bold px-2 rounded" onClick={handleClose}>
                    キャンセル
                </button>
            </dialog>
        </>
    )
}

export function MenuDialog(props: {isMenuDialog: boolean, setIsMenuDialog: Dispatch<SetStateAction<boolean>>}) {

    const { isMenuDialog, setIsMenuDialog } = props;

    function handleClose() {
        setIsMenuDialog(false);
    }

    // function handleJSONExport() {
    //     const a_elm = document.createElement("a");
    //     a_elm.download =
    // }

    return(
        <>
            <div onClick={handleClose} aria-label="背景クリックで閉じる"  className={"fixed z-40 inset-0 w-dvw h-dvh bg-slate-800/50 " + (isMenuDialog ? "block" : "hidden")}></div>
            <dialog open className={ "fixed z-50 inset-0 m-auto w-80 h-96 bg-white rounded shadow-lg p-4 transition-all duration-300 " + (isMenuDialog ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none")}>
                <h2 className="text-lg font-bold text-center text-emerald-600 mb-10">メニュー</h2>
                <menu className="flex flex-col gap-4 mt-6">
                    <li className="bg-slate-200 rounded p-2 text-center cursor-pointer hover:bg-slate-300 transition-colors">
                        <button className="w-full" >
                            JSON出力
                        </button>
                    </li>
                    <li className="bg-slate-200 rounded p-2 text-center cursor-pointer hover:bg-slate-300 transition-colors">
                        <button className="w-full" >
                            JSON入力
                        </button>
                    </li>
                    <li className="bg-slate-200 rounded p-2 text-center cursor-pointer hover:bg-slate-300 transition-colors">
                        <button className="w-full" >
                            画像出力
                        </button>
                    </li>
                </menu>

                <button className="absolute bottom-4 right-4 text-slate-600 font-bold px-2 rounded" onClick={handleClose}>
                    閉じる
                </button>
            </dialog>
        </>
    )
}

export function HelpDialog(props: {isHelpDialog: boolean, setIsHelpDialog: Dispatch<SetStateAction<boolean>>}) {

    const { isHelpDialog, setIsHelpDialog } = props;

    function handleClose() {
        setIsHelpDialog(false);
    }
    
    return(
        <>
            <div onClick={handleClose} aria-label="背景クリックで閉じる" className={"fixed z-40 inset-0 w-dvw h-dvh bg-slate-800/50 " + (isHelpDialog ? "block" : "hidden")}></div>
            <dialog open className={ "fixed z-50 inset-0 m-auto flex flex-col w-80 h-96 bg-white rounded shadow-lg p-4 transition-all duration-300 " + (isHelpDialog ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none")}>
                <h2 className="text-lg font-bold text-center text-emerald-600 mb-6">
                    マンダラートの作り方
                </h2>
                <div className="grow">
                    <dl className="h-full">
                        <dt className="font-bold mb-1 text-sky-600">
                            1. 中央に主題を置く
                        </dt>
                        <dd className="mb-6 ml-2">
                            達成したい目標を一つ決める
                        </dd>
                        <dt className="font-bold mb-1 text-sky-600">
                            2. 周囲に要素を広げる
                        </dt>
                        <dd className="mb-6 ml-2">
                            必要な要素を書き出す
                        </dd>
                        <dt className="font-bold mb-1 text-sky-600">
                            3. 
                            <svg className="inline-block w-5 h-5 fill-sky-600 mx-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                            {/* <!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--> */}
                            <path d="M97.5 400l50-160 379.4 0-50 160-379.4 0zm190.7 48L477 448c21 0 39.6-13.6 45.8-33.7l50-160c9.7-30.9-13.4-62.3-45.8-62.3l-379.4 0c-21 0-39.6 13.6-45.8 33.7L80.2 294.4 80.2 96c0-8.8 7.2-16 16-16l138.7 0c3.5 0 6.8 1.1 9.6 3.2L282.9 112c13.8 10.4 30.7 16 48 16l117.3 0c8.8 0 16 7.2 16 16l48 0c0-35.3-28.7-64-64-64L330.9 80c-6.9 0-13.7-2.2-19.2-6.4L273.3 44.8C262.2 36.5 248.8 32 234.9 32L96.2 32c-35.3 0-64 28.7-64 64l0 288c0 35.3 28.7 64 64 64l192 0z"/></svg>
                            ボタンで深堀りする
                        </dt>
                        <dd className="ml-2">
                            要素ごとに具体的なアイデアを書き出す<br></br>
                            これにより最大72個のアイデアが生まれます
                        </dd>
                    </dl>
                </div>

                <button className="block ml-auto text-slate-600 font-bold px-2 rounded" onClick={handleClose}>
                    閉じる
                </button>

            </dialog>
        </>
    )
}