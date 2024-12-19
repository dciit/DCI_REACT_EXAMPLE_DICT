
export function LessThenZero(val: string | number | undefined | null, def: string = '0') {
    try {
        return (Number(val) <= 0 || val == '') ? def : Number(val)
    } catch {
        return def;
    }
}

export function ConvStrToNum(val: string) {
    try {
        return Number(val)
    } catch {
        return 0;
    }
}

export function StyleTdMainPlan(val: string | number | null) {
    let style: string = Number(val) == 0 ? 'font-bold text-red-600 ' : (Number(val) > 0 ? 'font-bold text-green-700 bg-green-100' : 'font-bold text-red-600 bg-red-200')
    return style;
}
export function StyleTextSublineStock(val: string | number | null) {
    let style: string = Number(val) == 0 ? 'font-semibold text-red-600 ' : (Number(val) > 0 ? '  ' : 'font-semibold text-red-600')
    return style;
}
export function Comma(val: string | number | null, def: string = '') {
    try {
        return isNaN(Number(val)) == true ? def : Number(val).toLocaleString('en');
    } catch {
        return def;
    }
}
export const isNumber = (value: unknown): boolean => {
    return typeof value === 'number';
};
