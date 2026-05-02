
"use client";

import { Dispatch, SetStateAction, useEffect, useReducer, useState } from "react";
import { useSearchParams } from 'next/navigation';

import { DragDropProvider } from '@dnd-kit/react';
import { useSortable } from "@dnd-kit/react/sortable";
import { t_mandalartChart, t_mandalartDatas, t_mandaraCell, t_userData } from "../types";
import { motion } from "framer-motion";
import { EditCardDialog, HelpDialog, MenuDialog, TitleChangeDialog } from "./dialog";
import { getUserData, updateChartData, updateChartTitle, createNewMandalartDatas, updateMandalartDatas, updateLastKey, strArrToChart, checkEmptyCardIdx } from "../logics";


function Sortable(props: {item: t_mandaraCell, idx: number, targetId: string, isGuide: boolean, setCurrentGoalKey: Dispatch<SetStateAction<string>>, goalKeys: string[], biggestGoalKey: string, handleOpenEditCardDialog: (key:string) => void}) {
    const {item, idx, targetId, isGuide, setCurrentGoalKey, goalKeys, biggestGoalKey, handleOpenEditCardDialog} = props;
    const isCenter = (idx == 4);
    
    const goalTier:number = item.id == biggestGoalKey ? 0 : goalKeys.includes(item.id) ? 1 : 2;

    const cardText = item.text ?
        item.text : isGuide ? (
        goalTier == 0 ? "主題・目標を入力" :
        goalTier == 1 ? "課題・アイデアを入力" :
        goalTier == 2 ? "具体的な行動を入力" :
        ""
    ) : "";

    const {ref} = useSortable({
        id: item.id,
        index: idx,
        disabled: isCenter,
        plugins: [],
    })

    function handleDigMandalart() {
        switch(goalTier) {
            case 0:
            case 2: {
                return;
            }
            case 1: {
                if(isCenter) {
                    setCurrentGoalKey(biggestGoalKey);
                }else {
                    setCurrentGoalKey(item.id);
                }
                break;
            }
            default: {
                return;
            }
        }
    }
    function handleEditCardBtn() {
        handleOpenEditCardDialog(item.id)
    }

    return (
        <motion.div
            ref={ref}
            layout
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`
                relative w-full h-full flex flex-col
                rounded shadow border-2 font-bold
                ${isCenter ? "" : " cursor-move"}
                ${targetId === item.id ? "border-slate-500 brightness-90" : "border-transparent"}
            `}
            style={{backgroundColor: item.color || "#F8FAFC"}}
        >
            <div className="flex justify-between px-2 sm:px-4 w-full h-8 sm:h-10 border-b border-slate-300">
                <button onClick={handleDigMandalart} className={(goalTier == 1) ? "w-8 sm:w-10 h-8 sm:h-10" : "invisible pointer-none"}>
                    {
                        isCenter ? (
                            <svg className="w-4 sm:w-6 h-4 sm:h-6 fill-slate-500 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            {/* <!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--> */}
                            <path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM136 232l176 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-176 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"/></svg>
                        ) : (
                            <svg className="w-4 sm:w-6 h-4 sm:h-6 fill-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                            {/* <!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--> */}
                            <path d="M97.5 400l50-160 379.4 0-50 160-379.4 0zm190.7 48L477 448c21 0 39.6-13.6 45.8-33.7l50-160c9.7-30.9-13.4-62.3-45.8-62.3l-379.4 0c-21 0-39.6 13.6-45.8 33.7L80.2 294.4 80.2 96c0-8.8 7.2-16 16-16l138.7 0c3.5 0 6.8 1.1 9.6 3.2L282.9 112c13.8 10.4 30.7 16 48 16l117.3 0c8.8 0 16 7.2 16 16l48 0c0-35.3-28.7-64-64-64L330.9 80c-6.9 0-13.7-2.2-19.2-6.4L273.3 44.8C262.2 36.5 248.8 32 234.9 32L96.2 32c-35.3 0-64 28.7-64 64l0 288c0 35.3 28.7 64 64 64l192 0z"/></svg>
                        )
                    }
                </button>
                <button onClick={handleEditCardBtn} aria-label="編集" className={`w-8 sm:w-10 h-8 sm:h-10 ${isGuide ? "fill-cyan-500" : "fill-slate-600"}`}>
                    <svg className="w-4 sm:w-6 h-4 sm:h-6 ml-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                    {/* <!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--> */}
                    <path d="M128.1 0c-35.3 0-64 28.7-64 64l0 384c0 35.3 28.7 64 64 64l146.2 0 10.9-54.5c4.3-21.7 15-41.6 30.6-57.2l132.2-132.2 0-97.5c0-17-6.7-33.3-18.7-45.3L322.8 18.7C310.8 6.7 294.5 0 277.6 0L128.1 0zM389.6 176l-93.5 0c-13.3 0-24-10.7-24-24l0-93.5 117.5 117.5zM332.3 466.9l-11.9 59.6c-.2 .9-.3 1.9-.3 2.9 0 8 6.5 14.6 14.6 14.6 1 0 1.9-.1 2.9-.3l59.6-11.9c12.4-2.5 23.8-8.6 32.7-17.5l118.9-118.9-80-80-118.9 118.9c-8.9 8.9-15 20.3-17.5 32.7zm267.8-123c22.1-22.1 22.1-57.9 0-80s-57.9-22.1-80 0l-28.8 28.8 80 80 28.8-28.8z"/></svg>
                </button>
            </div>
            <div className="grow flex justify-center items-center p-2 sm:p-4">
                <p className={`text-wrap text-xs sm:text-base line-clamp-5 md:line-clamp-4 ${isGuide && "text-slate-400"}`}>
                    { cardText }
                </p>
            </div>
            {
                !isCenter && (
                    <svg className="hidden sm:block absolute bottom-2 right-2 fill-slate-400  w-3 sm:w-5  h-3 sm:h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    {/* <!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--> */}
                    <path d="M128 40c0-22.1-17.9-40-40-40L40 0C17.9 0 0 17.9 0 40L0 88c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zm0 192c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zM0 424l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40zM320 40c0-22.1-17.9-40-40-40L232 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zM192 232l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40zM320 424c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48z"/></svg>
                )
            }
        </motion.div>
    );
}

function Chart() {

    const searchParams = useSearchParams();
    const mode = searchParams?.get("mode") ?? "createNew";

    const [title, setTitle] = useState("");
    // 長さ81の配列で管理すると、小目標の配置換えの手間ができる。
    // 大目標、中目標のUUIDをKeyとするObjectにする
    const [mandalartCharts, setMandalartCharts] = useState<t_mandalartChart>({})
    const [startId, setStartId] = useState<string>("");
    const [targetId, setTargetId] = useState<string>("");

    const [biggestGoalKey, setBiggestGoalKey] = useState<string>("");
    const [currentGoalKey, setCurrentGoalKey] = useState<string>("");

    const currentMandalart: t_mandaraCell[] = mandalartCharts[currentGoalKey] ?? [];

    const [editCardKey, setEditCardKey] = useState<string>("");

    const [isTitleDialog, setIsTitleDialog] = useState<boolean>(false);
    const [isEditCardDialog, setIsEditCardDialog] = useState<boolean>(false);
    const [isMenuDialog, setIsMenuDialog] = useState<boolean>(false);
    const [isHelpDialog, setIsHelpDialog] = useState<boolean>(false);

    const [isInitialized, completeInitialized] = useReducer(() => true, false);

    const guideCardIdx: number = checkEmptyCardIdx(mandalartCharts || {}, currentGoalKey);

    function closeDialogByBackBtn() {
        setIsTitleDialog(false);
        setIsEditCardDialog(false);
        setIsMenuDialog(false);
        setIsHelpDialog(false);
    }

    useEffect(() => {
        switch(mode) {
            // 前回の続きから始めるときの処理
            case "continue": {
                const userData:t_userData = getUserData();
                const localmainKey = searchParams.get("mainKey") ?? "";
                const mandalartDatas: t_mandalartDatas = userData.mandalartDatas[localmainKey];
                if(mandalartDatas) {
                    setTitle(mandalartDatas.title);
                    setMandalartCharts(mandalartDatas.mandalartChart);
                    setBiggestGoalKey(localmainKey);
                    setCurrentGoalKey(localmainKey);
                }else {
                    const mainUUID = crypto.randomUUID();
                    const mandalartDatas = createNewMandalartDatas(mainUUID, "", new Array(9).fill(""));
                    setMandalartCharts(mandalartDatas.mandalartChart);
                    setTitle(mandalartDatas.title);
                    setBiggestGoalKey(mandalartDatas.mainKey);
                    setCurrentGoalKey(mandalartDatas.mainKey);
                    updateMandalartDatas(mainUUID, mandalartDatas);
                    updateLastKey(mainUUID);
                }
                break;
            }
            // テンプレート名に応じてマンダラートの初期値を設定
            case "template": {
                const templateName = searchParams.get("template");
                const mainUUID = crypto.randomUUID();
                const mandalartDatas = createNewMandalartDatas(mainUUID, "", new Array(9).fill(""));

                switch (templateName) {
                    case "study": {
                        mandalartDatas.title = "学習計画"
                        mandalartDatas.mandalartChart = strArrToChart(["英語", "プログラミング", "資格", "読書", "学習", "", "", "", "", ], mandalartDatas.mainKey);
                        // mandalartDatas.mandalartChart = strArrToChart(["英語", "プログラミング", "資格", "読書", "学習", "運動", "趣味", "休息", "その他", ], mandalartDatas.mainKey);
                        break;
                    }
                    case "job": {
                        mandalartDatas.title = "転職活動"
                        mandalartDatas.mandalartChart = strArrToChart(["企業研究", "自己分析", "履歴書・職務経歴書作成", "面接対策", "転職活動", "", "", "", "", ], mandalartDatas.mainKey);
                        // mandalartDatas.mandalartChart = strArrToChart(["企業研究", "自己分析", "履歴書・職務経歴書作成", "面接対策", "転職活動", "スキルアップ", "ネットワーキング", "健康管理", "その他", ], mandalartDatas.mainKey);
                        break;
                    }
                    case "project": {
                        mandalartDatas.title = "プロジェクト管理"
                        mandalartDatas.mandalartChart = strArrToChart(["企画", "設計", "開発", "テスト", "プロジェクト", "", "", "", "", ], mandalartDatas.mainKey);
                        // mandalartDatas.mandalartChart = strArrToChart(["企画", "設計", "開発", "テスト", "プロジェクト", "リリース", "マーケティング", "運用", "その他", ], mandalartDatas.mainKey);
                        break;
                    }
                    default: {
                    }
                }
                setMandalartCharts(mandalartDatas.mandalartChart);
                setTitle(mandalartDatas.title);
                setBiggestGoalKey(mandalartDatas.mainKey);
                setCurrentGoalKey(mandalartDatas.mainKey);
                updateMandalartDatas(mainUUID, mandalartDatas);
                updateLastKey(mainUUID);
                break;
            }
            case "createNew":
            default: {
                const mainUUID = crypto.randomUUID();
                const mandalartDatas = createNewMandalartDatas(mainUUID, "", new Array(9).fill(""));
                setMandalartCharts(mandalartDatas.mandalartChart);
                setTitle(mandalartDatas.title);
                setBiggestGoalKey(mandalartDatas.mainKey);
                setCurrentGoalKey(mandalartDatas.mainKey);
                updateMandalartDatas(mainUUID, mandalartDatas);
                updateLastKey(mainUUID);
            }
        }
        completeInitialized();

        window.addEventListener('popstate', function() {
            closeDialogByBackBtn();
        });

        return (
            window.removeEventListener("popstate", closeDialogByBackBtn)
        )

    }, []);
    
    useEffect(() => {
        if(!isInitialized) {
            return;
        }
        updateChartData(biggestGoalKey, mandalartCharts);
        updateLastKey(biggestGoalKey);
    }, [mandalartCharts]);

    useEffect(() => {
        if(!isInitialized) {
            return;
        }
        updateChartTitle(biggestGoalKey, title);
        updateLastKey(biggestGoalKey);
    }, [title]);

    function handleDragStart(ev:any) {
        setStartId(ev.operation.target.id);
    }

    function handleCollision(ev:any) {
        if(ev.collisions.length == 0) {
            return;
        }
        setTargetId(ev.collisions[0].id);
    }
    function handleDragEnd() {
        if (!startId || !targetId) return;

        setMandalartCharts((prev) => {
            const startIdx = prev[currentGoalKey].findIndex(v => v.id == startId);
            const targetIdx = prev[currentGoalKey].findIndex(v => v.id == targetId);
            
            if(targetIdx === 4) {
                return prev;
            }

            const next:{[key:string]: t_mandaraCell[]} = structuredClone(prev);
            next[currentGoalKey][startIdx] = prev[currentGoalKey][targetIdx];
            next[currentGoalKey][targetIdx] = prev[currentGoalKey][startIdx];

            return next;
        })
        setStartId("");
        setTargetId("");
    }

    function handleOpenTitleDialog() {
        setIsTitleDialog(true);
        history.pushState(null, null, null);
    }

    function handleOpenEditCardDialog(keyString: string) {
        setEditCardKey(keyString);
        setIsEditCardDialog(true);
        history.pushState(null, null, null);
    }

    function handleMenuBtn() {
        setIsMenuDialog(true);
        history.pushState(null, null, null);
    }

    function handleHelpBtn() {
        setIsHelpDialog(true);
        history.pushState(null, null, null);
    }

    return (
        <div className="h-full">
            <EditCardDialog isEditCardDialog={isEditCardDialog} setIsEditCardDialog={setIsEditCardDialog} mandalartCharts={mandalartCharts} setMandalartCharts={setMandalartCharts} editCartKey={editCardKey}></EditCardDialog>
            <TitleChangeDialog isTitleDialog={isTitleDialog} setIsTitleDialog={setIsTitleDialog} title={title} setTitle={setTitle}></TitleChangeDialog>
            <MenuDialog isMenuDialog={isMenuDialog} setIsMenuDialog={setIsMenuDialog} mainKey={biggestGoalKey} title={title} setTitle={setTitle} mandalartCharts={mandalartCharts} setMandalartCharts={setMandalartCharts} setMainKey={setBiggestGoalKey} setCurrentGoalKey={setCurrentGoalKey}></MenuDialog>
            <HelpDialog isHelpDialog={isHelpDialog} setIsHelpDialog={setIsHelpDialog}></HelpDialog>
            <div className="contentWrapper flex flex-col h-full">
                <div className="flex justify-between mb-4 md:mb-8 ">
                    <div className="flex justify-between w-fit pl-2 ">
                        <h2 className={ `w-44 md:w-60 h-6 sm:h-8 text-base sm:text-xl text-center font-bold overflow-hidden whitespace-nowrap text-ellipsis border-b-2 border-slate-400 ${title ? "text-slate-600 " : "text-slate-400 "}`}>{title || "無題のマンダラート"}</h2>
                        <button onClick={handleOpenTitleDialog} aria-label="マンダラート名変更" className="px-2 bg-slate-400 text-white rounded-r py-1.5 w-8 sm:w-10 h-6 sm:h-8">
                            <svg className="w-full h-full fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            {/* <!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--> */}
                            <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L368 46.1 465.9 144 490.3 119.6c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L432 177.9 334.1 80 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/></svg>
                        </button>
                    </div>
                    <div className="w-fit h-6 sm:h-8 flex items-center">
                        
                        <button onClick={handleHelpBtn} aria-label="ヘルプボタン" className="inline-block w-6 sm:w-10 h-auto rounded sm:p-2 mr-2 hover:bg-slate-200 active:brightness-90">
                            <svg className="w-full h-full fill-slate-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            {/* <!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--> */}
                            <path d="M464 256a208 208 0 1 0 -416 0 208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm256-80c-17.7 0-32 14.3-32 32 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-44.2 35.8-80 80-80s80 35.8 80 80c0 47.2-36 67.2-56 74.5l0 3.8c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-8.1c0-20.5 14.8-35.2 30.1-40.2 6.4-2.1 13.2-5.5 18.2-10.3 4.3-4.2 7.7-10 7.7-19.6 0-17.7-14.3-32-32-32zM224 368a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                        </button>
                        
                        <button onClick={handleMenuBtn} aria-label="メニューボタン" className="inline-block w-6 sm:w-10 ml-2 h-auto rounded sm:p-2 hover:bg-slate-200 active:brightness-90">
                            <svg className="w-full h-full fill-slate-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            {/* <!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--> */}
                            <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>
                        </button>
                    </div>
                </div>
                <div className="grow mb-4 md:mb-16">
                <DragDropProvider onDragStart={handleDragStart} onCollision={handleCollision} onDragEnd={handleDragEnd}>
                    <div className="w-full h-full mx-auto grid grid-cols-3 grid-rows-3 gap-1 md:gap-3">
                        {currentMandalart && currentMandalart.map((item, idx) => (
                            <Sortable key={item.id} item={item} idx={idx} targetId={targetId} isGuide={guideCardIdx == idx} setCurrentGoalKey={setCurrentGoalKey} goalKeys={Object.keys(mandalartCharts)} biggestGoalKey={biggestGoalKey} handleOpenEditCardDialog={handleOpenEditCardDialog}></Sortable>
                        ))}
                    </div>
                </DragDropProvider>

                </div>
            </div>
            
        </div>
    );
}

export default Chart;