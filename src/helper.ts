interface PropsObj {
    data: any;
    key: string;
    type: string;
}
const GetValByObj = (type: string, data: any, key: string) => {
    try {
        if (typeof data[key] != 'undefined') {
            return type == 'number' ? Number(data[key]) : data[key];
        } else {
            return type == 'number' ? 0 : '';
        }
    } catch {
        return '';
    }
}