export type t_mandaraCell = {
    id: string,
    text: string,
    color: string,
}
export type t_mandalartChart = {
    [key: string]: t_mandaraCell[]
}

export type t_mandalartDatas = {
    mainKey: string,
    title: string,
    mandalartChart: t_mandalartChart,
    createdDate: Date,
    updateDate: Date,
}

export type t_userData = {
    mandalartDatas: {[key: string]: t_mandalartDatas},
    lastMandalartKey: string,
}