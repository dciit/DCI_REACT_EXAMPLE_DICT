// import axios from 'axios';
// import { apsapi } from '../constants';
// import { ParamGetPriorityPlan, PropPriorityPlan } from '@/interface/pn.interface';
// const http = axios.create({
//     baseURL: apsapi,
//     headers: {
//         'Content-Type': 'application/json;charset=UTF-8;json/html; charset=UTF-8',
//     }
// })
// export function ApiGetPriorityPlan(param: ParamGetPriorityPlan) {
//     return new Promise<PropPriorityPlan[]>(resolve => {
//         http.post('/GetPriorityPlan', param).then((res) => {
//             resolve(res.data);
//         })
//     })
// }