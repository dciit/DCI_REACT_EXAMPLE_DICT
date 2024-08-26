export interface PropPrivilege {
    empcode: string;
    privilege: string | undefined;
    updateBy: string;
    wcno: string[];
}
export interface PropOptionAnt {
    label: string;
    value: string | number;
}
export interface PropUserInformation {
    dictId: number;
    dictSystem: string;
    dictType: string;
    code: string;
    description: string;
    refCode: string;
    ref1: null;
    ref2: null;
    ref3: null;
    ref4: null;
    note: null;
    createDate: string;
    updateBy: string;
    updateDate: string;
    dictStatus: string;
}