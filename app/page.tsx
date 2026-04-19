
'use client';

import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
import { TemplateDialog } from './dialogs';
import { createUserData, getUserData } from './logics';


// JSON入出力
// 画像出力
// ログイン機能

export default function Home() {

  const router = useRouter();

  const [showTemplateDialog, setShowTemplateDialog] = useState<boolean>(false);

  const [lastKey, setLastKey] = useState<string>("");

  function isContinueKeyExist () {
    const userData = getUserData();
    return Object.keys(userData.mandalartDatas).includes(userData.lastMandalartKey);
  }

  useEffect(() => {
    createUserData();
    const userData = getUserData();
    setLastKey(userData.lastMandalartKey);
  }, []);

  function handleNewMandalart() {
    // 新規作成ボタンのクリックイベントハンドラー
    router.push('/chart?mode=createNew');
  }

  function handleTemplate() {
    // テンプレートから作成ボタンのクリックイベントハンドラー
    setShowTemplateDialog(true);
  }

  function handleContinue() {
    // 前回の続きボタンのクリックイベントハンドラー
    router.push('/chart' + `?mode=continue` + `&mainKey=${lastKey}`);
  }

  return (
    <>
      <TemplateDialog isOpen={showTemplateDialog} setIsOpen={setShowTemplateDialog} />
      {/* 背景マンダラ */}
      <div className='absolute inset-0 m-auto w-fit h-fit'>
        <div className='fixed -z-10 inset-0 m-auto w-3xl aspect-square -translate-y-5 opacity-30'>
          <div className='absolute top-0 left-0 w-full h-full grid justify-around grid-rows-3 grid-cols-3 gap-3 rotate-12 animate-[spin_360s_linear_infinite]'>
            <div className='w-full h-full bg-linear-120 from-sky-300 to-teal-400 shadow shadow-slate-400 rounded'></div>
            <div className='w-full h-full bg-linear-120 from-teal-300 to-emerald-400 shadow shadow-slate-400 rounded'></div>
            <div className='w-full h-full bg-linear-120 from-emerald-300 to-green-400 shadow shadow-slate-400 rounded'></div>
            <div className='w-full h-full bg-linear-120 from-teal-300 to-emerald-400 shadow shadow-slate-400 rounded'></div>
            <div className='w-full h-full bg-linear-120 from-emerald-300 to-green-400 shadow shadow-slate-400 rounded'></div>
            <div className='w-full h-full bg-linear-120 from-emerald-300 to-lime-400 shadow shadow-slate-400 rounded'></div>
            <div className='w-full h-full bg-linear-120 from-emerald-300 to-green-400 shadow shadow-slate-400 rounded'></div>
            <div className='w-full h-full bg-linear-120 from-emerald-300 to-lime-400 shadow shadow-slate-400 rounded'></div>
            <div className='w-full h-full bg-linear-120 from-lime-300 to-lime-400 shadow shadow-slate-400 rounded'></div>
          </div>
        </div>

        <div className='w-fit mx-auto px-10 py-2 mb-4 text-white bg-linear-150 from-pink-500 to-indigo-500 rounded-md'>
          <p className='text-sm -translate-x-2'>3×3のアイデアツール</p>
          <h1 className='w-fit text-3xl font-bold text-center'>
            Mandalart app
          </h1>
        </div>
        <p className='text-sm mb-8'>
          3×3で目標を見える化<br></br>
          大きな目標を小さな行動に分解し、<br></br>
          学習・転職・プロジェクト管理をサポートします。
        </p>
        <menu className='bg-white/90 rounded-md w-64 h-fit mx-auto p-4 shadow-lg'>
          <li className='text-white font-bold text-lg px-2 w-fit mb-4 ring-2 bg-linear-0 bg-slate-600 rounded-md'>
            <button className='px-2' onClick={handleNewMandalart}>
              新規作成
            </button>
          </li>
          <li className='font-bold text-lg px-2 mb-4'>
            <button className='px-2' onClick={handleTemplate}>
              テンプレートから作成
            </button>
          </li>
          <li className='font-bold text-lg px-2'>
            <button className={`px-2 text-sm ${(lastKey == "" || !isContinueKeyExist()) ? "text-slate-400 pointer-events-none" : ""}`} onClick={handleContinue}>
              前回の続き
            </button>
          </li>
        </menu>
      </div>
    </>
  );
}