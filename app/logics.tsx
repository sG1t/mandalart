import { t_mandalartChart, t_mandalartDatas, t_userData } from "./types";

export function getUserData(): t_userData {
    const userDataStr = localStorage.getItem("userData");
    const userData: t_userData = userDataStr ? JSON.parse(userDataStr): {
        mandalartDatas: {},
        lastMandalartKey: "",
    };
    return userData
}

export function createUserData() {
    const userDataStr = localStorage.getItem("userData");
    if(userDataStr) {
        return;
    }else {
        const userData: t_userData = {
            mandalartDatas: {},
            lastMandalartKey: "",
        };
        localStorage.setItem("userData", JSON.stringify(userData));
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