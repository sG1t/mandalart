"use client"

import { t_mandalartChart, t_mandalartDatas, t_userData } from "./types";

export function getUserData(): t_userData {
    try {
        const userDataStr = localStorage.getItem("userData");

        if (!userDataStr) {
        return {
            mandalartDatas: {},
            lastMandalartKey: "",
        };
        }

        const parsed = JSON.parse(userDataStr);

        // 念のため構造チェック
        return {
        mandalartDatas: parsed.mandalartDatas ?? {},
        lastMandalartKey: parsed.lastMandalartKey ?? "",
        };

    } catch (e) {
        console.error("userData parse error:", e);

        return {
        mandalartDatas: {},
        lastMandalartKey: "",
        };
    }
}

export function createUserData() {
    try {
        const userDataStr = localStorage.getItem("userData");

        if (!userDataStr) {
        const userData: t_userData = {
            mandalartDatas: {},
            lastMandalartKey: "",
        };
        localStorage.setItem("userData", JSON.stringify(userData));
        }
    } catch (e) {
        console.error("createUserData error:", e);
    }
}

export function strArrToChart(arr: string[], mainKey: string):t_mandalartChart {
    const out:t_mandalartChart = {};
    // 大目標のマンダラート
    out[mainKey] = [];
    for(let i = 0; i < 9; i++) {
        out[mainKey].push({
            id: crypto.randomUUID(),
            text: arr[i],
            color: "bg-slate-50",
        })
    }
    out[mainKey][4].id = mainKey;
    // 中目標のマンダラート
    for(let i = 0; i < 9; i++) {
        if(i == 4) { continue }
        const middleGoalKey = out[mainKey][i].id;
        out[middleGoalKey] = [];
        for(let j = 0; j < 9; j++) {
            out[middleGoalKey].push({
                id: crypto.randomUUID(),
                text: "",
                color: "bg-slate-50",
            })
        }
        
        out[middleGoalKey][4].text = arr[i];
        out[middleGoalKey][4].id = out[mainKey][i].id
    }
    return out
}

export function createNewMandalartDatas(mainKey: string, newTitle: string, strArr: string[]): t_mandalartDatas {
    const date = new Date();
    const mandalartDatas: t_mandalartDatas = {
        mainKey: mainKey,
        title: newTitle,
        mandalartChart: strArrToChart(strArr, mainKey),
        createdDate: date,
        updateDate: date,
    }
    return mandalartDatas
}

export function updateMandalartDatas(mainKey: string, nextMandalartDatas: t_mandalartDatas) {
    if(!mainKey) {
        return
    }
    const userData: t_userData = getUserData();
    userData.mandalartDatas[mainKey] = nextMandalartDatas;
    localStorage.setItem("userData", JSON.stringify(userData));
}

export function updateChartData(mainKey: string, nextChartDatas: t_mandalartChart) {
    if(!mainKey) {
        return
    }
    const userData: t_userData = getUserData();
    userData.mandalartDatas[mainKey].mandalartChart = nextChartDatas;
    userData.mandalartDatas[mainKey].updateDate = new Date();
    localStorage.setItem("userData", JSON.stringify(userData));
}

export function updateChartTitle(mainKey: string, nextTitle: string) {
    if(!mainKey) {
        return
    }
    const userData: t_userData = getUserData()
    userData.mandalartDatas[mainKey].title = nextTitle;
    userData.mandalartDatas[mainKey].updateDate = new Date();
    localStorage.setItem("userData", JSON.stringify(userData));
}

export function updateLastKey(mainKey: string) {
    if(!mainKey) {
        return
    }
    const userData: t_userData = getUserData();
    userData.lastMandalartKey = mainKey;
    localStorage.setItem("userData", JSON.stringify(userData));
}

export function deleteMandalartDatas(deleteMainKey: string) {
    if(!deleteMainKey) {
        return
    }
    const userData: t_userData = getUserData();
    delete userData.mandalartDatas[deleteMainKey];
    localStorage.setItem("userData", JSON.stringify(userData));
}

export function cntEditedCells(mandalart: t_mandalartChart): number {
    const set = new Set();
    Object.values(mandalart).forEach((arr) => {
        arr.forEach((val) => {
            if(val.text.length > 0) {
                set.add(val.id);
            }
        })
    });
    return set.size
}

export function checkEmptyCardIdx(mandalart: t_mandalartChart, currentMainKey: string): number {
    let min = 999;
    if(mandalart[currentMainKey] == null) {
        return min;
    }
    if(mandalart[currentMainKey][4].text == "") {
        return 4;
    }
    Object.values(mandalart[currentMainKey]).forEach((val, idx) => {
        if(val.text == "") {
            min = Math.min(min, idx);
        }
    })
    return min;
}