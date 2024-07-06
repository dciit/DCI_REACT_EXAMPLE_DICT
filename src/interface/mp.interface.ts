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