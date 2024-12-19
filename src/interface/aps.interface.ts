// import { PropsWip } from "@/components/aps.main.plan";

import { PropGastightMainWIP, PropShrinkGage } from "./aps.main.interface";

export interface StatusProps {
    status: boolean | number;
    message: string | undefined;
}
export interface ViApsPartMasterProps {
    model: string;
    partNameCode: string;
    partCode: string;
    wcno: string;
    partno: string;
    cm: string;
}
// export interface ApsMainProps {
//     sequnce: string;
//     wcno: string;
//     model: string;
//     partno: string;
//     plan: number;
//     actual: number;
// }

// export interface ApsMainProps {
//     sequence: ApsMainSequenceProps[];
//     interactive: ApsMainInterActiveProps[];
// }
// export interface ApsMainInterActiveProps {
//     hour: number;
//     modelCode: string;
//     modelName: string;
//     cnt: number;
// }
// export interface ApsMainSequenceProps {
//     p_wcno: string;
//     p_group: string;
//     p_model: string;
//     p_startdate: string;
//     p_starttime: string;
//     p_enddate: string;
//     p_endtime: string;
//     p_modelcode: string;
//     p_palnqty: number;
//     _P_packing: any[];
//     p_StartDateT: Date;
//     plqty: number;
//     row: number;
//     p_comment: string;
//     p_packing: string;
//     p_palletqty: number;
//     plancode: string;
//     seq: string;
//     p_mc: string;
//     p_rev: string;
//     p_plancode: string;
//     p_planqty: number;
//     subline: string;
//     packingList: PackingList[];
// }

export interface PackingList {
    p_MODEL: string;
    p_PACKING: string;
    p_QTYSTD: number;
    p_PALLETQTY: number;
    p_REPORT_QTY: number;
    p_QTYPLAN: number;
    p_comment: string;
    subline: string;
}

export interface ApsProductionPlanProps {
    apsPlanCode: any;
    prdPlanCode?: string;
    wcno?: string;
    subline?: string;
    apsSeq?: string;
    apsPlanDate?: Date;
    apsDistribute?: string;
    prdSeq?: string;
    partNo?: string;
    cm?: string;
    apsPlanQty?: number;
    prdPlanQty?: number;
    rev?: string;
    lrev?: string;
    creBy?: string;
    creDt?: Date;
}
export interface GasTightProps {
    hour: number;
    modelCode: string;
    modelName: string;
    cnt: number;
}



export interface DictMstr {
    dictId: number;
    dictSystem: string;
    dictType: string;
    code: string;
    description: string;
    refCode: null;
    ref1: null;
    ref2: null;
    ref3: null;
    note: null;
    createDate: null;
    updateDate: null;
    dictStatus: string;
}

export interface PropsSaveNotice {
    reason?: string;
    lrev?: number;
    prdPlanQty?: number | undefined;
    remark: string;
}
export interface APSUpdatePlanProps {
    prdPlanCode: string;
    reasonCode: string;
    prdPlanQty: number;
    remark: string;
}
export interface APSInsertPlanProps {
    modelCode: string;
    prdQty: number;
    prdPlanCode: string;
}
export interface WipProps {
    hour: number;
    sebango: string;
    model: string;
    cnt: number;
    wip: partWipProps[];
    // stator: Tor;
    // rotor: Tor;
    // housing: CrankShaft;
    // crankShaft: CrankShaft;
    // fsOs: CrankShaft;
    // lower: CrankShaft;
    // pipe: Bottom;
    // top: Bottom;
    // bottom: Bottom;
}
export interface partWipProps {
    wcno: string;
    model: string;
    partno: string;
    parttype: string;
    stock: number;
}
export interface Mdw27Props {
    modelName: string;
    modelCode: string;
    wcno?: string;
}
export interface StatusProps {
    status: boolean | number;
    message: string | undefined;
}
export interface ViApsPartMasterProps {
    model: string;
    partNameCode: string;
    partCode: string;
    wcno: string;
    partno: string;
    cm: string;
}
// export interface ApsMainProps {
//     sequnce: string;
//     wcno: string;
//     model: string;
//     partno: string;
//     plan: number;
//     actual: number;
// }

export interface ApsMainProps {
    sequence: ApsMainSequenceProps[];
    interactive: ApsMainInterActiveProps[];
}
export interface ApsMainInterActiveProps {
    hour: number;
    modelCode: string;
    modelName: string;
    cnt: number;
}
export interface ApsMainSequenceProps {
    p_wcno: string;
    p_group: string;
    p_model: string;
    p_startdate: string;
    p_starttime: string;
    p_enddate: string;
    p_endtime: string;
    p_modelcode: string;
    p_palnqty: number;
    _P_packing: any[];
    p_StartDateT: Date;
    plqty: number;
    row: number;
    p_comment: string;
    p_packing: string;
    p_palletqty: number;
    plancode: string;
    seq: string;
    p_mc: string;
    p_rev: string;
    p_plancode: string;
    p_planqty: number;
    subline: string;
    packingList: PackingList[];
}

export interface PackingList {
    p_MODEL: string;
    p_PACKING: string;
    p_QTYSTD: number;
    p_PALLETQTY: number;
    p_REPORT_QTY: number;
    p_QTYPLAN: number;
    p_comment: string;
    subline: string;
}

export interface ApsProductionPlanProps {
    apsPlanCode: any;
    prdPlanCode?: string;
    wcno?: string;
    subline?: string;
    apsSeq?: string;
    apsPlanDate?: Date;
    apsDistribute?: string;
    prdSeq?: string;
    partNo?: string;
    cm?: string;
    apsPlanQty?: number;
    prdPlanQty?: number;
    rev?: string;
    lrev?: string;
    creBy?: string;
    creDt?: Date;
}
export interface GasTightProps {
    hour: number;
    modelCode: string;
    modelName: string;
    cnt: number;
}



export interface DictMstr {
    dictId: number;
    dictSystem: string;
    dictType: string;
    code: string;
    description: string;
    refCode: null;
    ref1: null;
    ref2: null;
    ref3: null;
    note: null;
    createDate: null;
    updateDate: null;
    dictStatus: string;
}

export interface PropsSaveNotice {
    reason?: string;
    lrev?: number;
    prdPlanQty?: number | undefined;
    remark: string;
}
export interface APSUpdatePlanProps {
    prdPlanCode: string;
    reasonCode: string;
    prdPlanQty: number;
    remark: string;
}
export interface APSInsertPlanProps {
    modelCode: string;
    prdQty: number;
    prdPlanCode: string;
}
export interface APSResultProps {
    partGroupMaster: PartGroupMasterProps[],
    parts: APSResultPartProps[];
    data: EkbWipPartStockTransactionProps[];
    stockMain: EkbWipPartStock[];
    modelStandard: DictMstr[];
}
export interface EkbWipPartStock {
    ym: string;
    wcno: string;
    partno: string;
    cm: string;
    partDesc: string;
    lbal: number;
    recqty: number;
    issqty: number;
    bal: number;
    updateBy: string;
    updateDate: Date;
    ptype: null | string;
}
export interface PartGroupMasterProps {
    part: string;
    partName: string;
}
export interface APSResultPartProps {
    wcno: string;
    model_common: string;
    partno: string;
    cm: string;
    part_group: string;
    part_group_name: string;
    stdMC: number;
    stdCTMC: number;
    stdCT: number;
    stdCapHR: number;
    stdCapShift: number;
    stdCapDay: number;
    stdNeedDay: number;
    modelcode: string;
}
export interface EkbWipPartStockTransactionProps {
    nbr: string;
    ym: string;
    ymd: null | string;
    shift: string;
    wcno: string;
    partno: string;
    cm: string;
    transType: string;
    transQty: number;
    qrcodeData: string;
    createBy: string;
    createDate: Date;
    refNo: string;
    modelcode: string;
}
export interface ApsResult {
    wc: string;
    ym: string;
    ymd: string;
}


export interface APSUpdateResultParam {
    ym: string;
    ymd: string;
    wcno: string;
    shift: string;
    partno: string;
    cm: string;
    type: string;
    qty: number;
    period: string;
    createBy: string;
}

export interface ApsNotify {
    wcno: string;
    lineType: string;
    changeDt: string;
    subLine: string;
    notifyDt: string;
    notifyBy: string;
    ackStatus: string;
    ackBy: null;
    ackDt: null;
}
export interface LineProps {
    value: string;
    text: string;
}

export interface EmpProps {
    code: string;
    name: string;
    surn: string;
    img: string;
    fullName: string;
}

export interface ParamGetPlanMachine {
    ymd: string;
    partGroup?: string;
}
export interface PropsPlanMachine {
    prdPlanCode: string;
    wcno: string;
    apsSeq: number;
    apsPlanDate: string;
    prdSeq: number;
    partNo: string;
    cm: string;
    apsPlanQty: number;
    prdPlanQty: number;
    lrev: number;
    partGroup: string;
    stockMain: number;
    stockMachine: number;
    reason?: string;
    result: number;
    subLine: string;
}
export interface ParamUpdateSequencePlan {
    empcode: string;
    partGroup: string | undefined;
    plan: PropsPlanMachine[];
}

export interface PropsPartMaster {
    wcno: string;
    model_common: string;
    partno: string;
    cm: string;
    part_group: string;
    part_group_name: string;
    stdMC: number;
    stdCTMC: number;
    stdCT: number;
    stdCapHR: number;
    stdCapShift: number;
    stdCapDay: number;
    stdNeedDay: number;
}


export interface ParamApsGetProductionPlan {
    ymd: string;
    subLine?: string;
}

export interface PropsApsGetProductionPlan {
    wcno: string;
    prdPlanCode: string;
    partNo: string;
    cm: string;
    apsSeq: string;
    subLine: string;
    prdSeq: string;
    result: number;
    estSet: number;
    safety: number;
    apsPlanQty: number;
    prdPlanQty: number;

    statorMain: number;
    statorMotor: number;
    rotorMain: number;
    rotorMotor: number;
    housingMain: number;
    housingMC: number;
}

export interface PropsPrivilege {
    wcno: string;
}
export interface PropsInsertPlan {
    date: string;
    model: string;
    qty: number;
    empcode: string;
    wcno: string | undefined;
    seq: number;
    type: string; // MAIN OR SUBLINE
    partGroup?: string;
}
export interface ParamMachineChangeSeq {
    prdPlanCode: string | undefined;
    prdSeq: number;
}
export interface PropsPart {
    modelName: string;
    modelCode: string;
}
export interface ParamGetPart {
    type: string;
    group: string;
}
export interface ParamGetMainPlan {
    paramDate: string;
    paramWCNO: string;
}

export interface PropsMain {
    prdPlanCode: string;
    wcno: string;
    subLine: string;
    apsSeq: number;
    apsPlanDate: string;
    prdSeq: number;
    modelCode: string;
    partNo: string;
    cm: string;
    apsPlanQty: number;
    prdPlanQty: number;
    dataWIP: DataWIP;
    statusPlan: string;
    apsCurrent: string;
    changePlanQty: boolean;
}

export interface DataWIP {
    wcno: string;
    modelCode: string;
    modelName: string;
    estimateMainSet: number;
    estimateAllSet: string;
    dataDateTime: Date;
    statorMain: string;
    statorSubLine: null | string;
    statorSafety: boolean;
    statorNotice: any[];
    rotorMain: string;
    rotorSubLine: string;
    rotorSafety: boolean;
    rotorNotice: any[];
    fsMain: string;
    fsSubLine: string;
    fsSafety: boolean;
    fsNotice: any[];
    hsMain: string;
    hsSubLine: string;
    hsSafety: boolean;
    hsNotice: any[];
    csMain: string;
    csSubLine: string;
    csSafety: boolean;
    csNotice: any[];
    lwMain: string;
    lwSubLine: string;
    lwSafety: boolean;
    lwNotice: any[];
    cbMain: null;
    cbSubLine: null;
    cbSafety: boolean;
    cbNotice: null;
    bodyMain: string;
    bodySubLine: string;
    bodySafety: boolean;
    bodyNotice: any[];
    topMain: string;
    topSubLine: string;
    topSafety: boolean;
    topNotice: any[];
    bottomMain: string;
    bottomSubLine: string;
    bottomSafety: boolean;
    bottomNotice: any[];
}

export interface ParamInsertPlan {
    type: string; // MAIN OR SUBLINE
    group: string; // OS/FS LW HS or Other
    seq: number; // SUBLINE ONLY LAST SEQ 
}
export interface ParamGetNotify {
    wcno: string;
    date: string;
}

export interface ParamGetMainPlanTest {
    ymd: string;
    modelName?: string;
}


export interface PropsSublineStock {
    stockHistory: StockHistory[];
    stockCurrent: StockCurrent[];
}

export interface StockCurrent {
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
    statorMain: number;
    rotorSubline: number;
    rotorMain: number;
}

export interface StockHistory {
    ym: string;
    ymd: string;
    wcno: string;
    hhmm: string;
    modelcode: string;
    modelname: string;
    apsPlan: number;
    apsResult: number;
    apsRemainPlan: number;
    prdSeq: number;
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
}

export interface PropsMpckLayout {
    layoutCode: string;
    layoutName: string;
    layoutSubName: null;
    factory: string;
    line: null;
    subLine: null;
    width: number;
    height: number;
    layoutStatus: null;
    bypassMq: boolean;
    bypassSa: boolean;
    updateBy: null;
    updateDate: null;
    boardId: string;
}

export interface PropsInOut {
    planDate: string;
    wcno: string;
    partno: string;
    cm: string;
    subLbal: number;
    subRecQty: number;
    subIssQty: number;
    subBal: number;
    mainLbal: number;
    mainRecQty: number;
    mainIssQty: number;
    mainBal: number;
}
export interface ParamInOut {
    group: string;
    ymd: string;
    drawing?: string;
}


export interface PropsPartGroup {
    code: string;
    desc: string;
}
export interface ParamGetDrawingAdjust {
    group: string;
    sebango: string;
    type: string;
}

export interface PropsGastight {
    data: Datum[];
    chart: PropsChart;
}
export interface PropGastight {
    id: number;
    serial: string;
    modelCode: string;
    insertBy: string;
    insertDate: string;
}

export interface PropsChart {
    labels: string[];
    data: string[];
}

export interface Datum {
    serial: string;
    model: string;
    insertDate: string;
    modelname: string;
}
export interface PropsGetMainPlan {
    main: PropsMain[];
    wip: PropsWip[];
    shrinkgage: PropShrinkGage;
    axiscore: PropShrinkGage;
    gastight: PropGastightMainWIP;
    masterSubline: PropLineAndProcess[];
    wip_in_line: PropWIPInline[];
    gastight_result: any[];
    main_wip: any[];
    main_seq: any[];
    main_header: any[];
}
export interface PropWIPInline {
    process: string;
    wip_inline_qty: number;
    wip_ok?: number;
    wip_ng?: number;
    model?: string;
    sebango?: string;
}
export interface PropLineAndProcess {
    line: string;
    process: string;
}
export interface PropsWip {
    ym: null | string;
    ymd: null | string;
    wcno: null | string;
    hhmm: string;
    apsSeq: string;
    modelcode: string;
    modelname: string;
    apsCurrent: string;
    apsPlan: number;
    apsResult: number;
    apsRemainPlan: number;
    fsMain: number | null;
    fsSubline: number | null;
    hsMain: number | null;
    hsSubline: number | null;
    lwMain: number | null;
    lwSubline: number | null;
    csMain: number | null;
    csSubline: number | null;
    bodyMain: number | null;
    bodySubline: number | null;
    bottomMain: number | null;
    bottomSubline: number | null;
    topMain: number | null;
    topSubline: number | null;
    statorMain: number | null;
    statorSubline: number | null;
    rotorMain: number | null;
    rotorSubline: number | null;
    createDate: Date | null;
}



export interface PropCasingInfo {
    item: PropSubline[];
    header: PropCasingHeader[];
    lastUpdate: any[];
    errorType?: string;
}
export interface PropSubline {
    prdPlanCode: string;
    prdSeq: number;
    model: string;
    modelName: string;
    partNo: string;
    cm: string;
    remainPlan: number;
    apsPlanQty: number;
    time: string;
    resultMain: number;
    resultSubline: number;
    data: PropDataSubline[];
}
export interface PropDataSubline {

}
export interface PropItemCasing {
    prdSeq: string;
    wcno: string;
    part: string;
    remainPlan: number;
    result: number;
    time: string;
}
export interface PropCasingHeader {
    groupCode: string;
    groupName: string;
}
export interface ParamGetPartSetInByDrawing {
    drawing: string;
}
export interface PropDrawings {
    drawing: string;
    cm: string;
}
export interface PropModels {
    model: string;
    sebango: string;
}
export interface ParamUpdateStatusPartSetIN {
    dictId: number;
    dictStatus: string;
    empcode: string;

}
export interface PropGroupRM {
    groupCode: string;
    groupDesc: string;
}
export interface ParamBackflushAdjWip {
    open: boolean;
    setOpen: Function;
    prop: PropBackflushAdjWip | null;
    loadBackflush: Function;
}
export interface PropBackflushAdjWip {
    ym: string;
    wcno: string;
    partno: string;
    cm: string;
    adj_by: string;
    adj_qty: number;
    remark?: string;
    wipBefore?: number;
    wipAdj?: number;
}
export interface ParamSublineSetting {
    method: string;
    process?: string;
    group?: string;
}
export interface ParamAddDrawingSubline {
    model: string[];
    wcno: string;
    drawing: string;
    cm: string;
    group: string;
    line: string;
}
export interface ParamChargeMainSeq {
    fPrdPlanCode: string;
    tPrdPlanCode: string;
    empcode: string;
}
export interface PropRMDetail {
    rm: string;
    rm_cm: string;
    rm_group_code: string;
    rm_group_desc: string;
}
export interface ParamRMDetail {
    part: string;
    cm: string;
    rm_group: string;
}
export interface PropApsProdPlan {
    prdPlanCode: string;
    wcno: string;
    subline: string;
    apsCurrent: null;
    apsSeq: string;
    apsPlanDate: Date;
    apsDistribute: string;
    prdSeq: string;
    partNo: string;
    cm: string;
    apsPlanQty: number;
    prdPlanQty: number;
    rev: string;
    lrev: string;
    creBy: string;
    creDt: Date;
    updBy: string;
    updDt: Date;
}


export interface PropMainSeq {
    PRD_PLANCODE: string;
    YMD: string;
    PRD_SEQ: number | string;
    MODEL: string;
    SEBANGO: string;
    APS_PLAN: number | string;
    PRD_PLAN: number | string;
    PRD_STATUS: string;
    PRD_RESULT: number | string;
    PLN_STATUS: string;
    PLN_CURRENT: string;
    PRD_REMAIN: number | string;
    PLN_START_DT: string;
    PLN_END_DT: string;
    PRD_START_DT: string;
    PRD_END_DT: string;
    PRD_START_HOUR: string;
    PRD_END_HOUR: string;
    PRD_TIME: string;
    PRD_PRIORITY: number | string;
    PRD_QTY_OF_PERIOD: number | string;
    STATOR_MAIN: string;
    STATOR_SUBLINE: string;
    ROTOR_MAIN: string;
    ROTOR_SUBLINE: string;
    HS_MAIN: string;
    HS_SUBLINE: string;
    CS_MAIN: string;
    CS_SUBLINE: string;
    FS_MAIN: string;
    FS_SUBLINE: string;
    LW_MAIN: string;
    LW_SUBLINE: string;
    BODY_MAIN: string;
    BODY_SUBLINE: string;
    TOP_MAIN: string;
    TOP_SUBLINE: string;
    BOTTOM_MAIN: string;
    BOTTOM_SUBLINE: string;
}

export interface PropMainWIPSelected {
    WIP_INFO: PropMainSeq;
    LINE_CODE: string;
    PROCESS_CODE: string;
}




export interface PropHistoryMainPlan {
    data: PropItemHistoryMainPlan[];
    header: PropRouter[];
}

export interface PropItemHistoryMainPlan {
    [key: string]: any;
    YMD: string;
    TIME: string;
    APS_SEQ: string;
    MODELCODE: string;
    MODELNAME: string;
    APS_PLAN: number;
    APS_RESULT: number;
    APS_REMAIN_PLAN: number;
    FS_MAIN: number;
    FS_SUBLINE: number;
    HS_MAIN: number;
    HS_SUBLINE: number;
    LW_MAIN: number;
    LW_SUBLINE: number;
    CS_MAIN: number;
    CS_SUBLINE: number;
    BODY_MAIN: number;
    BODY_SUBLINE: number;
    BOTTOM_MAIN: number;
    BOTTOM_SUBLINE: number;
    TOP_MAIN: number;
    TOP_SUBLINE: number;
    STATOR_MAIN: number;
    STATOR_SUBLINE: number;
    ROTOR_MAIN: number;
    ROTOR_SUBLINE: number;
    CreateDate: Date;
}

export interface PropRouter {
    CODE: string;
    LINE_GROUP: string;
    LINE_CODE: string;
    LINE_TXT: string;
    PROCESS_CODE: string;
    PROCESS_TXT: string;
    COLUMN_NAME: string;
}

export interface PropSublineSeq {
    data: PropDataSublineSeq[];
    router: PropRouterSublineSeq[];
}

export interface PropRouterSublineSeq {
    PROCESS_CODE: string;
    PROCESS_TXT: string;
}

export interface PropDataSublineSeq {
    [key: string | number]: string | number;
    PRD_SEQ: string;
    PRD_PLAN_CODE: string;
    WCNO: string;
    SUBLINE: string;
    APS_SEQ: string;
    APS_PLAN_DATE: string;
    COMMON_SEBANGO_SUPPORT_PLAN: string;
    COMMON_SEBANGO: string;
    COMMON_MODEL: string;
    PART_NO: string;
    CM: string;
    PROCESS_CODE: string;
    PLN_STATUS: string;
    APS_PLAN_QTY: number;
    PRD_PLAN_QTY: number;
    PRD_QTY: number;
    PLN_REMAIN: number;
}

export interface PropApsPlnInfo {
    data: PropDataApsPlnInfo[];
    load: boolean;
}

export interface PropDataApsPlnInfo {
    PRD_PLAN_CODE: string;
    COMMON_MODEL: string;
    PART_NO: string;
    CM: string;
    PRD_PLAN_QTY: number;
}