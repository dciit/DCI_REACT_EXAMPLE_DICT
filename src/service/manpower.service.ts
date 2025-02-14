// import axios from 'axios';
// import { manpowerapi } from '../constants';
// const http = axios.create({
//     baseURL: manpowerapi,
//     headers: {
//         'Content-Type': 'application/json;charset=UTF-8;json/html; charset=UTF-8',
//     }
// });

// export function API_GET_MANPOWER_TITLE(lineno: string) {
//     const param = {
//         lineNo: lineno
//     }
//     return new Promise<ManpowerLineTitleInfo[]>(resolve => {
//         http.post(`/aps/mp_title`, param).then((res) => {
//             resolve(res.data);
//         }).catch((e) => {
//             console.log(e);
//         });
//     })
// }

// export function API_GET_MANPOWER() {
//     return new Promise<ManpowerInfo[]>(resolve => {
//         http.post(`/aps/mp`).then((res) => {
//             resolve(res.data);
//         }).catch((e) => {
//             console.log(e);
//         });
//     })
// }

// export function API_GET_EMP_OT() {
//     return new Promise<MPEmpOTInfo[]>(resolve => {
//         http.post(`/aps/emp_ot`).then((res) => {
//             resolve(res.data);
//         }).catch((e) => {
//             console.log(e);
//         });
//     })
// }


// export function API_GET_MANPOWER_HISTORY(paramDate : Date, paramShift : string) {
//     const param = {
//         paramDate : paramDate,
//         paramShift : paramShift
//     }
//     return new Promise<ManpowerInfo[]>(resolve => {
//         http.post(`/aps/mp_history`, param).then((res) => {
//             resolve(res.data);
//         }).catch((e) => {
//             console.log(e);
//         });
//     })
// }