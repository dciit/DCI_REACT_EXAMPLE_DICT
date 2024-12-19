export interface PropsApsMainStockBalance {
    stockBalance: StockBalance[];
    stockCurrent: PropsWipCurrent[];
    gastight: Gastight;
}

export interface Gastight {
    id: number;
    serial: string;
    modelCode: string;
    insertBy: string;
    insertDate: Date;
}

export interface StockBalance {
    apsSeq: number;
    ym: string;
    ymd: string;
    wcno: string;
    hhmm: string;
    modelcode: string;
    modelname: string;
    apsPlan: number;
    apsResult: number;
    apsRemainPlan: number;
    fsMain: number;
    fsSubline: number;
    hsMain: number;
    hsSubline: number;
    lwMain: number;
    lwSubline: number;
    csMain: number;
    csSubline: number;
    bodyMain: number;
    bodySubline: number;
    bottomMain: number;
    bottomSubline: number;
    topMain: number;
    topSubline: number;
    statorMain: number;
    statorSubline: number;
    rotorMain: number;
    rotorSubline: number;
    createDate: Date;
    apsCurrent: string;
}
export interface PropsWipCurrent {
    apsCurrent: string;
    ym: string;
    pwcno: string;
    modelCode: string;
    modelName: string;
    fsSubline: number;
    fsMain: number;
    hsSubline: number;
    hsMain: number;
    lwSubline: number;
    lwMain: number;
    csSubline: number;
    csMain: number;
    bodySubline: number;
    bodyMain: number;
    bottomSubline: number;
    bottomMain: number;
    topSubline: number;
    topMain: number;
    statorSubline: number | null;
    statorMain: number | null;
    rotorSubline: number | null;
    rotorMain: number | null;
}
export interface PropShrinkGage {
    model: string;
    sebango: string;
    total:number;
    produced :number;
}

export interface PropGastightMainWIP {
    model: string;
    sebango: string;
    total:number;
    produced:number;
}