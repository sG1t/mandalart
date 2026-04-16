
"use client"

import { useEffect, useState } from "react";

function List() {

    const [chartList, setChartList] = useState<string[]>([]);

    useEffect(() => {
        // chartList取得
        const localListStr = localStorage.getItem("chartList");
        if(localListStr) {
            setChartList(localListStr.split(","));
        }
    }, [])

    return (
        <div className="relative h-full overflow-y-scroll">
            {
                chartList.length == 0 ? (
                    <p className="translate-y-10 text-center">
                        チャートが作成されていません<br></br>
                        メインメニューから新規作成しましょう
                    </p>
                ) : (
                    chartList.map((val, idx) => (
                        <div key={idx}>
                            {
                                val
                            }
                        </div>
                    ))
                )
            }

        </div>
    )

}

export default List