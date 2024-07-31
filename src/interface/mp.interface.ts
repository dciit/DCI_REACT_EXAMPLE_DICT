export interface PropsMpckObject {
    objCode: string;
    layoutCode: string;
    objMasterId: string;
    objType: string;
    objTitle: string;
    objSubtitle: string;
    objPath: string;
    objX: string;
    objY: string;
    objStatus: string;
    empCode: string;
    objLastCheckDt: Date;
    layoutName: string;
    layoutSubName: string;
    factory: string;
    line: string;
    subLine: string;
    layoutStatus: string;
    bypassMq: boolean;
    bypassSa: boolean;
    mq: string;
    sa: string;
    ot: string;
    string: string;
    empName: string;
    objSvg: any;
    mstOrder: number;
    manskill: string;
    objPicture: string;
    objSA: any[];
    objMQ: any[];
    objWidth: number;
    objHeight: number;
    objBackgroundColor: string;
    objBorderColor: string;
    objBorderWidth: number;
    objFontSize: number;
    objFontColor: string;
    objPriority: number;
    sync: boolean;
    objPosition: string;
}
export interface ParamGetObjectByLayout {
    layoutCode: string;
}
export interface ManpowerInfo {
    dataDate: Date;
    dataShift: string;
    lineNo: string;
    lineType: string;
    lineSubCode: string;
    lineSubName: string;
    dvcd: string;
    mpPDPlan: string;
    mpStandard: string;
    mpRegis: string;
    mpRegisLists: EmployeeInfo[];
    mpActual: string;
    mpActualLists: EmployeeInfo[];
    mpDiff: string;
    mpAbsent: string;
    mpAbsentLists: EmployeeInfo[];
    mpSupportOut: string;
    mpSupportOutLists: EmployeeInfo[];
    mpSupportIn: string;
    mpSupportInLists: EmployeeInfo[];
    mpAnnual: string;
    mpAnnualLists: EmployeeInfo[];
    attWork: string;
    attWorkLists: EmployeeInfo[];
    attOT: string;
    attOTLists: EmployeeInfo[];
    attCheckIn: string;
    attCheckInLists: EmployeeInfo[];
    attNoLicense: string;
    attNoLicenseLists: EmployeeInfo[];
    attNoSkill: string;
    attNoSkillLists: EmployeeInfo[];
    attNoSA: string;
    attNoSALists: EmployeeInfo[];
    attNoMQ: string;
    attNoMQLists: EmployeeInfo[];
    attNoCheckIn: string;
    attNoCheckInLists: EmployeeInfo[];
}

export interface EmployeeInfo {
    empCode: string;
    empName: string;
    empPosit: string;
}


export interface ManpowerLineTitleInfo {
    lineNo: string;
    lineTitle: string;
    lineType: string;
    lineSubCode: string;
    lineSubName: string;
    dvcd: string;
    sortOrder: string;
}

export interface MPDisplayInfo {
    key: string;
    value: string;
}


export interface MPLineInfo {
    dvcd: string;
    lineNo: string;
    lineTitle: string;
}

export interface MPEmpOTInfo {
    code: string;
    name: string;
    surn: string;
    fName: string;
    posit: string;
    dvcd: string;
    lineCode: string;
    otStatus: string;
}


export interface PropsDialogManpower {
    open: boolean;
    dataHeader: string;
    empLists: MPEmpOTInfo[];
    setDialogOpen: Function;
}

export interface ParamGetLayouts {
    objCode: string;
    layoutCode: string;
    factory?: string;
}