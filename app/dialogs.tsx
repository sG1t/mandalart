
import { useRouter } from "next/navigation";

type props = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TemplateDialog(props: props) {
    // テンプレートから作成のダイアログ表示ロジック

    const router = useRouter();

    function handleTemplateSelect(templateName: string) {
        // テンプレート選択時の処理
        router.push('/chart' + `?mode=template` + `&template=${templateName}`);
        props.setIsOpen(false);
    }

    function handleClose() {
        // ダイアログを閉じる処理
        props.setIsOpen(false);
    }

    return(
        <>
            <div onClick={handleClose} aria-label="背景クリックで閉じる" className={"fixed z-40 inset-0 w-dvw h-dvh bg-slate-800/50 " + (props.isOpen ? "block" : "hidden")}></div>
            <dialog open className={ "fixed z-50 inset-0 m-auto w-80 h-96 bg-white rounded shadow-lg p-4 transition-all duration-300 " + (props.isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none")}>
                <h2 className="text-lg font-bold text-center text-emerald-600">テンプレートを選択</h2>
                <menu className="flex flex-col gap-4 mt-6">
                    {/* <li className="bg-slate-200 rounded p-2 text-center cursor-pointer hover:bg-slate-300 transition-colors">
                        <button className="w-full" onClick={() => handleTemplateSelect("sample")}>
                            操作説明
                        </button>
                    </li> */}
                    <li className="bg-slate-200 rounded p-2 text-center cursor-pointer hover:bg-slate-300 transition-colors">
                        <button className="w-full" onClick={() => handleTemplateSelect("study")}>
                            学習計画
                        </button>
                    </li>
                    <li className="bg-slate-200 rounded p-2 text-center cursor-pointer hover:bg-slate-300 transition-colors">
                        <button className="w-full" onClick={() => handleTemplateSelect("job")}>
                            転職活動
                        </button>
                    </li>
                    <li className="bg-slate-200 rounded p-2 text-center cursor-pointer hover:bg-slate-300 transition-colors">
                        <button className="w-full" onClick={() => handleTemplateSelect("project")}>
                            プロジェクト管理
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

