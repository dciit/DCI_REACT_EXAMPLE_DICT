export interface ContextInterface {
    appname?: string;
    style?: StyleInterface;
}
export interface StyleInterface {
    baseColorText?: string;
}
export interface ReduxInterface {
    login: boolean;
    name: string;
    surn: string;
    code: string;
    pren: string;
    fullname: string;
}
export interface ComponentProp {
    openComponent: boolean;
    setOpenComponent: Function;
}