
import { Dispatch, SetStateAction } from "react";
import { t_mandalartDatas } from "../types";
import { cntEditedCells, deleteMandalartDatas } from "../logics";

export function DeleteDialog(props: {deleteMainKey: string, setDeleteMainKey: Dispatch<SetStateAction<string>>, mandalartDatas: {[key: string]: t_mandalartDatas}, setMandalartDatas: Dispatch<SetStateAction<{[key: string]: t_mandalartDatas}>>}) {

    const { deleteMainKey, setDeleteMainKey, mandalartDatas, setMandalartDatas } = props;

    function deleteMandalart() {
        if(!Object.keys(mandalartDatas).includes(deleteMainKey)) {
            return;
        }
        const nextMandalart = structuredClone(mandalartDatas);
        delete nextMandalart[deleteMainKey];
        deleteMandalartDatas(deleteMainKey);
        setMandalartDatas(nextMandalart);
    }

    function handleClose() {
        setDeleteMainKey("");
    }
    
    return(
        <>
            <div onClick={handleClose} aria-label="背景クリックで閉じる" className={"fixed z-40 inset-0 w-dvw h-dvh bg-slate-800/50 " + (deleteMainKey != "" ? "block" : "hidden")}></div>
            <dialog open className={ "fixed z-50 inset-0 m-auto flex flex-col w-72 h-80 bg-white rounded shadow-lg py-4 px-6 transition-all duration-300 " + (deleteMainKey != "" ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none")}>
                <h2 className="text-lg font-bold text-center text-emerald-600 mb-6">
                    削除確認
                </h2>
                {
                    mandalartDatas[deleteMainKey] && (
                        <>
                            <h3 className="font-bold text-sky-500 min-w-10 max-w-54 mb-4 overflow-hidden whitespace-nowrap text-ellipsis">
                                { mandalartDatas[deleteMainKey].title ? mandalartDatas[deleteMainKey].title : "無題のマンダラート" }
                            </h3>
                            <p className="text-sm mb-2">
                                編集済み : { cntEditedCells(mandalartDatas[deleteMainKey].mandalartChart) } マス
                            </p>
                            <p className="text-sm mb-2">
                                作成日時 : { new Date(mandalartDatas[deleteMainKey].createdDate).toLocaleDateString() + " " + new Date(mandalartDatas[deleteMainKey].createdDate).toLocaleTimeString() }
                            </p>
                            <p className="text-sm">
                                最終更新 : { new Date(mandalartDatas[deleteMainKey].updateDate).toLocaleDateString() + " " + new Date(mandalartDatas[deleteMainKey].updateDate).toLocaleTimeString() }
                            </p>
                        </>
                    )
                }

                <p className="mt-10 mb-4">
                    このマンダラートを削除しますか?
                </p>

                <div className="flex justify-between ">
                    <button onClickCapture={deleteMandalart} className="block text-red-600 font-bold px-4 rounded border border-red-600" onClick={handleClose}>
                        削除
                    </button>
                    <button onClick={handleClose} className="block ml-4 text-slate-600 font-bold px-2 rounded">
                        キャンセル
                    </button>
                </div>

            </dialog>
        </>
    )
}