import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { t_mandalartChart, t_mandalartDatas, t_mandaraCell, t_userData } from "../types";
import { getUserData, updateLastKey, updateMandalartDatas } from "../logics";

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
            <dialog open className={ "fixed z-50 inset-0 m-auto w-80 h-fit bg-white rounded shadow-lg pt-4 pb-6 px-6 transition-all duration-300 " + (isTitleDialog ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none")}>
                <h2 className="text-lg font-bold text-center text-emerald-600 mb-10">タイトルを入力</h2>
                <input ref={titleInputRef} onChange={handleChangeInput} onKeyDown={handleKeydown} value={currentTitle} className="block w-60 px-2 mx-auto font-bold text-slate-600 text-lg text-center border-b-2 border-slate-400 focus:bg-sky-100 focus:outline-none"></input>
                <div className="flex justify-between mt-10">
                    <button className="block text-white font-bold text-lg px-8 bg-sky-500 rounded" onClick={handleDefineBtn}>
                        決定
                    </button>
                    <button className="block text-slate-600 font-bold px-2 rounded" onClick={handleClose}>
                        キャンセル
                    </button>
                </div>
            </dialog>
        </>
    )
}

const colorsArr: string[] = [
    "bg-red-200",
    "bg-amber-200",
    "bg-lime-200",
    "bg-emerald-200",
    "bg-cyan-200",
    "bg-blue-200",
    "bg-violet-200",
    "bg-fuchsia-200",
    "bg-rose-200",
    "bg-mauve-200",
    "bg-slate-200",
    "bg-slate-50",
]

export function EditCardDialog(props: {isEditCardDialog: boolean, setIsEditCardDialog: Dispatch<SetStateAction<boolean>>, mandalartCharts: t_mandalartChart, setMandalartCharts: Dispatch<SetStateAction<{[key:string]: t_mandaraCell[]}>>, editCartKey:string}) {

    const {isEditCardDialog, setIsEditCardDialog, mandalartCharts, setMandalartCharts, editCartKey} = props;

    const [currentText, setCurrentText] = useState<string>("");
    const [currentColor, setCurrentColor] = useState<string>("")

    const cardNameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(isEditCardDialog == false) {
            return;
        }
        Object.values(mandalartCharts).forEach((arr) => {
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
        setMandalartCharts((prev) => {
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
            <dialog open className={ "fixed z-50 inset-0 m-auto w-72 h-fit bg-white rounded shadow-lg pt-4 pb-6 px-6 transition-all duration-300 " + (isEditCardDialog ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none")}>
                <h2 className="text-lg font-bold text-center text-emerald-600 mb-10">カードを編集</h2>
                <input ref={cardNameInputRef} onChange={handleChangeInput} onKeyDown={handleKeydown} value={currentText} className="block w-60 px-2 mx-auto font-bold text-slate-600 text-lg text-center border-b-2 border-slate-400 focus:bg-sky-100 focus:outline-none mb-10"></input>
                <div className="w-60 mx-auto flex justify-between flex-wrap gap-2">
                    {
                        colorsArr.map((val, idx) => (
                            <button onClick={() => handleColorBtn(val)} aria-label={"カード色 " + val} key={idx} className={"w-8 h-8 border-neutral-400 border rounded ring-blue-400 " + (currentColor == val ? " ring " : " ") + val}>

                            </button>

                        ))
                    }

                </div>
                <div className="mt-10 flex justify-between">
                    <button className="inline-block text-white font-bold text-lg px-8 bg-sky-500 rounded" onClick={handleDefineBtn}>
                        決定
                    </button>
                    <button className="inline-block text-slate-600 font-bold px-2 rounded" onClick={handleClose}>
                        キャンセル
                </button>
                </div>
            </dialog>
        </>
    )
}

export function MenuDialog(props: {isMenuDialog: boolean, setIsMenuDialog: Dispatch<SetStateAction<boolean>>, mainKey: string, title:string, setTitle: Dispatch<SetStateAction<string>>, mandalartCharts: t_mandalartChart, setMandalartCharts: Dispatch<SetStateAction<t_mandalartChart>>, setMainKey: Dispatch<SetStateAction<string>>, setCurrentGoalKey: Dispatch<SetStateAction<string>>}) {

    const { isMenuDialog, setIsMenuDialog, mainKey, title, setTitle, mandalartCharts, setMandalartCharts, setMainKey, setCurrentGoalKey } = props;

    function handleClose() {
        setIsMenuDialog(false);
    }

    function handleExportJson() {
        const userData = getUserData();
        const mandalartData = userData.mandalartDatas[mainKey];
        const json = JSON.stringify(mandalartData, null, 2);
        const blob = new Blob([json], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "mandalart.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    function handleImportJson(ev: React.ChangeEvent<HTMLInputElement>) {
        const file = ev.target.files[0];
        if(!file) {
            return;
        }
        
        const reader = new FileReader();

        reader.onload = () => {
            try {
                const parsed: t_mandalartDatas = JSON.parse(reader.result as string);
                const isValidInfo = (
                    typeof parsed.title == "string" &&
                    typeof parsed.mainKey == "string" &&
                    typeof parsed.createdDate == "string"&&
                    typeof parsed.updateDate == "string" &&
                    typeof parsed.mandalartChart == "object"
                );                
                if (!isValidInfo) {
                    alert("無効なJSON構造です");
                    return;
                }
                setTitle(parsed.title);
                setMandalartCharts(parsed.mandalartChart);
                setMainKey(parsed.mainKey);
                setCurrentGoalKey(parsed.mainKey);
                updateMandalartDatas(parsed.mainKey, parsed);
                updateLastKey(parsed.mainKey);

                alert("JSONの読み込みに成功しました")
                handleClose();
            } catch {
                alert("JSONの読み込みに失敗しました")
            }
        }
        reader.readAsText(file);
    }

    const outputCard_W = 128;
    const outputCard_H = 180;
    const outputGap = 4;
    const outputPadding = 20;
    const titleSize = 20;
    const titleMb = 24;
    const textSize = 16;
    const cardPadding = 8;
    const textMb = 4;

    function createCanvasTemplate(canvasElement: HTMLCanvasElement, mandalartSize: number) {
        canvasElement.width = outputCard_W * mandalartSize + outputGap * mandalartSize + outputPadding * 2;
        canvasElement.height = titleSize + titleMb + outputCard_H * mandalartSize + outputGap * mandalartSize + outputPadding * 2;
        const ctx = canvasElement.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
        ctx.fillStyle = "#314158";
        ctx.font = titleSize + "px serif";
        ctx.fillText(title, outputPadding, outputPadding+ titleSize);
        ctx.strokeStyle = "#dddddd";
        ctx.lineWidth = outputGap;
        const topLine = outputPadding + titleSize + titleMb;
        const intervalWidth = outputCard_W + outputGap;
        const intervalHeight = outputCard_H + outputGap;
        ctx.beginPath();
        for(let i = 0; i <= mandalartSize; i++) {
        ctx.moveTo(outputPadding, topLine - (ctx.lineWidth / 2) + (intervalHeight * i));
        ctx.lineTo(canvasElement.width - outputPadding + outputGap, topLine - (ctx.lineWidth / 2) + (intervalHeight * i));
        ctx.moveTo(outputPadding + (ctx.lineWidth / 2) + (intervalWidth * i), topLine);
        ctx.lineTo(outputPadding + (ctx.lineWidth / 2) + (intervalWidth * i), canvasElement.height - outputPadding);
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = "#aaaaaa";
        for(let i = 0; i <= mandalartSize; i += 3) {
        ctx.moveTo(outputPadding, topLine - (ctx.lineWidth / 2) + (intervalHeight * i));
        ctx.lineTo(canvasElement.width - outputPadding + outputGap, topLine - (ctx.lineWidth / 2) + (intervalHeight * i));
        ctx.moveTo(outputPadding + (ctx.lineWidth / 2) + (intervalWidth * i), topLine);
        ctx.lineTo(outputPadding + (ctx.lineWidth / 2) + (intervalWidth * i), canvasElement.height - outputPadding);
        }
        ctx.stroke();
    }

    function fillMandalartText(canvasElement: HTMLCanvasElement, mandalartSize: 3|9) {

        const ctx = canvasElement.getContext("2d");

        const topLine = outputPadding + titleSize + titleMb + textSize;
        const intervalWidth = outputCard_W + outputGap;
        const intervalHeight = outputCard_H + outputGap;

        if(mandalartSize == 3) {
            mandalartCharts[mainKey].forEach((val, idx) => {
                const x = idx % 3;
                const y = Math.floor(idx / 3);
                ctx.fillStyle = "#314158";
                ctx.font = textSize + "px serif";

                const origin_X = outputPadding + outputGap + (intervalWidth * x) + cardPadding;
                const origin_Y = topLine  + (intervalHeight * y) ;

                let lineHeight = 0;
                let strLine = "";

                charLoop: for(const char of val.text) {
                    if(lineHeight + textSize > outputCard_H) {
                        break charLoop;
                    }
                    const strWidth = ctx.measureText(strLine + char).width + outputGap;
                    if(strWidth > outputCard_W - (cardPadding * 2)) {
                        ctx.fillText(strLine + char, origin_X, origin_Y + lineHeight);
                        lineHeight += textSize + textMb;
                        strLine = "";
                    }else {
                        strLine += char;
                    }
                }
                if(strLine) {
                    ctx.fillText(strLine, origin_X, origin_Y + lineHeight);
                }
            })
        } else if(mandalartSize == 9)  {
            const mainGoalKeys = Object.values(mandalartCharts[mainKey]);

            for(let i = 0; i < mainGoalKeys.length; i++) {
                const parent_X = i % 3;
                const parent_Y = Math.floor(i / 3);
                for(let j = 0; j < mandalartCharts[mainGoalKeys[i].id].length; j++) {
                    const child_X = j % 3;
                    const child_Y = Math.floor(j / 3);
                    ctx.fillStyle = "#314158";
                    ctx.font = textSize + "px serif";

                    const origin_X = outputPadding + outputGap + (intervalWidth * child_X) + cardPadding + (parent_X * intervalWidth * 3);
                    const origin_Y = topLine  + (intervalHeight * child_Y) + (parent_Y * intervalHeight * 3);

                    let lineHeight = 0;
                    let strLine = "";

                    charLoop: for(const char of mandalartCharts[mainGoalKeys[i].id][j].text) {
                        if(lineHeight + textSize > outputCard_H) {
                            break charLoop;
                        }
                        const strWidth = ctx.measureText(strLine + char).width + outputGap;
                        if(strWidth > outputCard_W - (cardPadding * 2)) {
                            ctx.fillText(strLine + char, origin_X, origin_Y + lineHeight);
                            lineHeight += textSize + textMb;
                            strLine = "";
                        }else {
                            strLine += char;
                        }
                    }
                    if(strLine) {
                        ctx.fillText(strLine, origin_X, origin_Y + lineHeight);
                    }
                }
            }
        }  
    }

    function handleOutputImage_3x3() {
        const canvasElement:HTMLCanvasElement = document.createElement("canvas");
        createCanvasTemplate(canvasElement, 3);
        fillMandalartText(canvasElement, 3)
        const url = canvasElement.toDataURL();

        const link = document.createElement("a");
        link.download = title + "_3x3.png";
        link.type = "png";
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function handleOutputImage_9x9() {
        const canvasElement:HTMLCanvasElement = document.createElement("canvas");
        createCanvasTemplate(canvasElement, 9);
        fillMandalartText(canvasElement, 9)
        const url = canvasElement.toDataURL();

        const link = document.createElement("a");
        link.download = title + "_9x9.png";
        link.type = "png";
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    return(
        <>
            <div onClick={handleClose} aria-label="背景クリックで閉じる"  className={"fixed z-40 inset-0 w-dvw h-dvh bg-slate-800/50 " + (isMenuDialog ? "block" : "hidden")}></div>
            <dialog open className={ "fixed z-50 inset-0 m-auto w-80 h-96 bg-white rounded shadow-lg p-4 transition-all duration-300 " + (isMenuDialog ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none")}>
                <h2 className="text-lg font-bold text-center text-emerald-600 mb-6">メニュー</h2>
                <menu className="flex flex-col gap-4 mt-6">
                    <li className="bg-slate-200 rounded text-center cursor-pointer hover:bg-slate-300 transition-colors">
                        <button onClick={handleExportJson} className="w-full p-2" >
                            JSON出力
                        </button>
                    </li>
                    <li className="bg-slate-200 rounded text-center cursor-pointer hover:bg-slate-300 transition-colors">
                        <label>
                            <p className="w-full p-2">JSON入力</p>
                            <input onChange={handleImportJson} type="file" accept=".json" className="hidden" >
                            </input>
                        </label>

                    </li>
                    <li className="bg-slate-200 rounded text-center cursor-pointer hover:bg-slate-300 transition-colors">
                        <button onClick={handleOutputImage_3x3} className="w-full p-2" >
                            画像出力 (3×3)
                        </button>
                    </li>
                    <li className="bg-slate-200 rounded text-center cursor-pointer hover:bg-slate-300 transition-colors">
                        <button onClick={handleOutputImage_9x9} className="w-full p-2" >
                            画像出力 (9×9)
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
                            2. 周囲8マスに要素を広げる
                        </dt>
                        <dd className="mb-6 ml-2">
                            主題に必要な要素を書き出す
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