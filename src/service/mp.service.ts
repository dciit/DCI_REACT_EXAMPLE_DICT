import axios from 'axios';
import { checkinapi } from '../constants';
import { ParamGetObjectByLayout, PropsMpckObject } from '../interface/mp.interface';
const http = axios.create({
    baseURL: checkinapi,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8;json/html; charset=UTF-8',
    }
});


export function ApiGetObjectByLayout(param: ParamGetObjectByLayout) {
    return new Promise<PropsMpckObject[]>(resolve => {
        http.post(`/mpck/getObjectlistbylayout`, param).then((res) => {
            resolve(res.data);
        })
    })
}
