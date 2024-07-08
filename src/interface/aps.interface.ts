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

export interface PropsDialogNotice {
    open: boolean;
    setOpen: any;
    data: ApsProductionPlanProps | null;
    setData: any;
    plan: ApsProductionPlanProps[];
    setPlan: any;
    apsLoad: any;
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

export interface PropsDialogNotice {
    open: boolean;
    setOpen: any;
    data: ApsProductionPlanProps | null;
    setData: any;
    plan: ApsProductionPlanProps[];
    setPlan: any;
    apsLoad: any;
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
}
export interface ApsResult {
    wc: string;
    ym: string;
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
    stockMachine?: number;
    reason?: string;

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

export interface ParamInsertPlan {
    model: string;
    prdQty: number;
    planDate: string;
    partGroup: string;
    empcode: string;
    partNo: string;
    wcno: string;
    prdSeq: number;
    partGroupName: string;
}