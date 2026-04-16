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

export function strArrToDatas(arr: string[], biggestUUID: string):t_mandalartChart {
        const out:t_mandalartChart = {};
        // 大目標のマンダラート
        out[biggestUUID] = [];
        for(let i = 0; i < 9; i++) {
            out[biggestUUID].push({
                id: crypto.randomUUID(),
                text: arr[i],
                color: "bg-slate-50",
            })
        }
        // 中目標のマンダラート
        for(let i = 0; i < 9; i++) {
            if(i == 4) { continue }
            const middleGoalKey = out[biggestUUID][i].id;
            out[middleGoalKey] = [];
            for(let j = 0; j < 9; j++) {
                out[middleGoalKey].push({
                    id: crypto.randomUUID(),
                    text: "",
                    color: "bg-slate-50",
                })
            }
            
            out[middleGoalKey][4].text = arr[i];
            out[middleGoalKey][4].id = out[biggestUUID][i].id
        }
        return out
    }

export function createNewMandalartDatas(mainKey: string): t_mandalartDatas {
    const date = new Date();
    const mandalartDatas: t_mandalartDatas = {
        mainKey: mainKey,
        title: "無題のマンダラート",
        mandalartChart: strArrToDatas(new Array(9).fill(""), mainKey),
        createdData: date,
        updateDate: date,
    }
    return mandalartDatas
}

export function updateChartData(mainKey: string, nextChartDatas: t_mandalartChart) {
    const userData: t_userData = getUserData();
    userData.mandalartDatas[mainKey].mandalartChart = nextChartDatas;
    userData.mandalartDatas[mainKey].updateDate = new Date();
    localStorage.setItem("userData", JSON.stringify(userData));
}

export function updateChartTitle(mainKey: string, nextTitle: string) {
    const userData: t_userData = getUserData()
    userData.mandalartDatas[mainKey].title = nextTitle;
    userData.mandalartDatas[mainKey].updateDate = new Date();
    localStorage.setItem("userData", JSON.stringify(userData));
}
