import axios from 'axios';
import { apsapi } from '../constants';
import { ApsProductionPlanProps, DictMstr, PropStatus, APSUpdatePlanProps, ParamUpdateBackflush, PropBackflush, APSResultProps, EmpProps, ParamMachineChangeSeq, PropsPart, ParamGetPart, ParamGetMainPlan, PropsMpckLayout, PropsInOut, ParamInOut, PropsPartGroup, ParamGetDrawingAdjust, PropsGastight, PropsGetMainPlan, ParamGetPartSetInByDrawing, PropDrawings, PropModels, ParamUpdateStatusPartSetIN, PropCasingInfo, PropItemAdjWIP, ParamSublineSetting, ParamAddDrawingSubline, PropRMDetail, ParamRMDetail } from '../interface/aps.interface';
import { ParamAdminUpdateDrawing, PropsAdjStock } from '../pages/aps.adj.stock';
import { ParamMpckGetObjectByLayout } from '../interface/mpck.interface';
import { PropsDrawing } from '../components/dialog.wip.detail';
import { PropPrivilege } from '@/interface/admin.interface';
const http = axios.create({
    baseURL: apsapi,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8;json/html; charset=UTF-8',
    }
});
export function API_GET_REASON() {
    return new Promise<DictMstr[]>(resolve => {
        http.get(`/aps/dictmstr/reason`).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e);
        });
    })
}

export function API_CHANGE_PRIORITY(ApsPlan: ApsProductionPlanProps[]) {
    return new Promise<PropStatus>(resolve => {
        http.post(`/ApsPlanChangePrioriry`, ApsPlan).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e);
        });
    })
}


export function API_UPDATE_PLAN(param: APSUpdatePlanProps) {
    return new Promise<PropStatus>(resolve => {
        http.post(`/ApsUpdatePlan`, param).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e);
        });
    })
}
// export function API_APS_INSERT_PLAN(props: APSInsertPlanProps) {
//     return new Promise<PropStatus>(resolve => {
//         http.post(`/ApsInsertPlan`, props).then((res) => {
//             resolve(res.data);
//         }).catch((e) => {
//             console.log(e);
//         });
//     })
// }

export function API_GET_MODEL_MASTER(param: ParamGetPart) {
    return new Promise<PropsPart[]>(resolve => {
        http.post(`/ApsGetDrawing`, param).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e);
        });
    })
}


export function API_APS_RESULT(param: PropBackflush) {
    return new Promise<APSResultProps>(resolve => {
        http.post(`/Aps/GetBackflush`, param).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e)
        })
    })
}

export function APIUpdateBackflush(param: ParamUpdateBackflush) {
    return new Promise<PropStatus>(resolve => {
        http.post(`/UpdateBackflush`, param).then((res) => [
            resolve(res.data)
        ]).catch((e) => {
            console.log(e);
        })
    })
}

export function ApiGetPartGroupMaster() {
    return new Promise<DictMstr[]>(resolve => {
        http.get(`/ApsGetPartGroupMaster`).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e)
        })
    })
}

export function ApiMachineChangeSeq(param: ParamMachineChangeSeq[]) {
    return new Promise<PropStatus>(resolve => {
        http.post(`/Aps/MachineChangeSeq`, param).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e)
        })
    })
}

export function APIGetMainPlan(param: ParamGetMainPlan) {
    return new Promise<PropsGetMainPlan>(resolve => {
        http.post(`/GetMainPlan`, param).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e)
        })
    })
}

export function ApiBackflushPrivilege(empcode: string) {
    return new Promise<string[]>(resolve => {
        http.get(`/Aps/GetPrivilegeBackflush/${empcode}`).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e)
        })
    })
}

export function ApiApsLogin(empcode: string) {
    return new Promise<EmpProps>(resolve => {
        http.get(`/ApsLoginByEmpcode/${empcode}`).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e)
        })
    })
}

export function ApiAdjStock(param: PropsAdjStock | PropItemAdjWIP) {
    return new Promise<PropStatus>(resolve => {
        http.post(`/ApsWipAdjust`, param).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e)
        })
    })
}

export function ApiAdminUpdateDrawing(param: ParamAdminUpdateDrawing) {
    return new Promise<PropStatus>(resolve => {
        http.post(`/ApsAdminUpdateDrawing`, param).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e)
        })
    })
}

export function ApiMpckGetObjectByLayout(param: ParamMpckGetObjectByLayout) {
    return new Promise<PropsMpckLayout[]>(resolve => {
        http.post(`/mpck/getObjectlistbylayout`, param).then((res) => {
            resolve(res.data);
        })
    })
}

export function ApiMpckGetFilters(param: any) {
    return new Promise<any[]>(resolve => {
        http.post(`/mpck/filters`, param).then((res) => {
            resolve(res.data);
        })
    })
}

export function ApiGetInOut(param: ParamInOut) {
    return new Promise<PropsInOut[]>(resolve => {
        http.post(`/ApsGetInOut`, param).then((res) => {
            resolve(res.data);
        })
    })
}



export function ApiPartGroups() {
    return new Promise<PropsPartGroup[]>(resolve => {
        http.get(`/ApsPartGroups`).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e)
        })
    })
}


export function APIGetDrawingSubline(param: ParamGetDrawingAdjust) {
    return new Promise<PropsDrawing[]>(resolve => {
        http.post(`/GetDrawingAdjust`, param).then((res) => {
            resolve(res.data);
        })
    })
}

export function ApiLoginAdjStock(empcode: string) {
    return new Promise<EmpProps>(resolve => {
        http.get(`/adjstock/login/${empcode}`).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e)
        })
    })
}



export function ApiGetGastight(ymd: string) {
    return new Promise<PropsGastight>(resolve => {
        http.get(`/GetGastight/${ymd}`).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e)
        })
    })
}

export function ApiGetUserInformation(empcode: string) {
    return new Promise<any>(resolve => {
        http.get(`/GetUserInformation/${empcode}`).then((res) => {
            resolve(res.data);
        })
    })
}


export function ApiApsSavePrivilege(param: PropPrivilege) {
    return new Promise<any>(resolve => {
        http.post(`/ApsSavePrivilege`, param).then((res) => {
            resolve(res.data);
        })
    })
}

export function ApiGetLastGastight() {
    return new Promise<any>(resolve => {
        http.get(`/ApsGetLastGastight`).then((res) => {
            resolve(res.data);
        })
    })
}

export function APIGetWIPSubline(line: string, group: string) {

    try {
        return new Promise<PropCasingInfo>(resolve => {
            http.get(`/GetWIPSubline/${line}/${group}`).then((res) => {
                resolve(res.data);
            }).catch((e: Error | any) => {
                if (axios.isAxiosError(e)) {
                    resolve({
                        header: [],
                        item: [],
                        errorType: 'network',
                        lastUpdate: []
                    })
                } else {
                    resolve({
                        header: [],
                        item: [],
                        errorType: '',
                        lastUpdate: []
                    })
                }
            }).finally(() => {
                resolve({
                    header: [],
                    item: [],
                    lastUpdate: []
                })
            })
        })
    } catch {
        return new Promise<PropCasingInfo>(resolve => {
            resolve({
                header: [],
                item: [],
                lastUpdate: []
            })
        })
    }
}

export function APIGetPartSetInByDrawing(param: ParamGetPartSetInByDrawing) {
    return new Promise<DictMstr[]>(resolve => {
        http.post(`/GetPartSetInByDrawing`, param).then((res) => {
            resolve(res.data);
        })
    })
}
export function APIGetDrawings() {
    return new Promise<PropDrawings[]>(resolve => {
        http.get(`/GetDrawings`).then((res) => {
            resolve(res.data);
        })
    })
}
export function APIGetModels() {
    return new Promise<PropModels[]>(resolve => {
        http.get(`/GetModels`).then((res) => {
            resolve(res.data);
        })
    })
}

export function APIUpdateStatusPartSetIn(param: ParamUpdateStatusPartSetIN) {
    return new Promise<PropStatus>(resolve => {
        http.post(`/UpdateStatusPartSetIn`, param).then((res) => {
            resolve(res.data);
        })
    })
}

export function APIGetWipStockByPart(param: PropItemAdjWIP) {
    return new Promise<number>(resolve => {
        http.post(`/GetWipStockByPart`, param).then((res) => {
            resolve(res.data);
        })
    })
}
export default function emptyCache() {
    if ('caches' in window) {
        caches.keys().then((names) => {
            // Delete all the cache files
            names.forEach(name => {
                caches.delete(name);
            })
        });
    }
}
export function APIGetDataSublineSetting(param: ParamSublineSetting) {
    return new Promise<any>(resolve => {
        http.post(`/SublineSetting`, param).then((res) => {
            resolve(res.data);
        })
    })
}
export function APIAddDrawingSubline(param: ParamAddDrawingSubline) {
    return new Promise<any>(resolve => {
        http.post(`/SublineSettingAddDrawing`, param).then((res) => {
            resolve(res.data);
        })
    })
}

export function APIChangeSublineSeq(param: any) {
    return new Promise<any>(resolve => {
        http.post(`/aps/subline/change/seq`, param).then((res) => {
            resolve(res.data);
        })
    })
}

export function APIGetRMDetail(param: ParamRMDetail) {
    return new Promise<PropRMDetail>(resolve => {
        http.post(`/GetRMDetail`, param).then((res) => {
            resolve(res.data);
        })
    })
}
export function APIGetApsProductionPlanInfo(PrdPlanCode: string) {
    return new Promise<any>(resolve => {
        http.get(`/aps/production/plan/get/${PrdPlanCode}`).then((res) => {
            resolve(res.data);
        })
    })
}
export function APIUpdateApsProdPlan(param: any) {
    return new Promise<any>(resolve => {
        http.post(`/aps/production/plan/update`, param).then((res) => {
            resolve(res.data);
        })
    })
}

export function APIUpdateSeqSublineSeq(FromPrdPlanCode: string, ToPrdPlanCode: string) {
    console.log(`/AspProductionPlan/change/seq`)
    return new Promise<PropStatus>(resolve => {
        http.post(`/AspProductionPlan/change/seq`, { FromPrdPlanCode, ToPrdPlanCode }).then((res) => {
            resolve(res.data);
        })
    })
}

export function APIGetDictMstr() {
    return new Promise<DictMstr[]>(resolve => {
        http.get(`/DictMstr/get`).then((res) => {
            resolve(res.data);
        })
    })
}

export function APIGetWIPInfo(PartNo: string) {
    return new Promise<any>(resolve => {
        http.get(`/APSWIPInfo/` + PartNo).then((res) => {
            resolve(res.data);
        })
    })
}
export function APIInsertPartSetOut(param: any) {
    return new Promise<PropStatus>(resolve => {
        http.post(`/APSWIPInfo/InsertPartSetOut`, param).then((res) => {
            resolve(res.data);
        })
    })
}

export function APIAPSGetHistoryMainPlan(plant: string, ymd: string) {
    return new Promise<any>(resolve => {
        http.get(`/APS/GetHistoryMainPlan/${plant}/${ymd}`).then((res) => {
            resolve(res.data);
        })
    })
}

export function APIGetMainPlanOnly(param: any) {
    return new Promise<any>(resolve => {
        http.post(`/GetMainPlanOnly`, param).then((res) => {
            resolve(res.data);
        })
    })
}
export function APIApsEditMainSeq(param: any) {
    return new Promise<any>(resolve => {
        http.post(`/aps/mainseq/edit`, param).then((res) => {
            resolve(res.data);
        })
    })
}
export function APIApsRouter(plant: string) {
    return new Promise<any>(resolve => {
        http.get(`/aps/router/${plant}`).then((res) => {
            resolve(res.data);
        })
    })
}

// export function APIGetSublineSeq(param: any) {
//     return new Promise<any>(resolve => {
//         http.post(`/GetSublinePlan`, param).then((res) => {
//             resolve(res.data);
//         })
//     })
// }

export function APIGetRMInfo(param: any) {
    return new Promise<any>(resolve => {
        http.post(`/GetSublineWIPInfo`, param).then((res) => {
            resolve(res.data);
        })
    })
}

export function APIUpdateRMStock(param: any) {
    return new Promise<any>(resolve => {
        http.post(`/aps/subline/rm/stock/update`, param).then((res) => {
            resolve(res.data);
        })
    })
}

export function APIGetFlowInfo() {
    return new Promise<any>(resolve => {
        http.get(`/aps/flow/info`).then((res) => {
            resolve(res.data);
        })
    })
}

export function APIGetStationInfo(station: string) {
    return new Promise<any>(resolve => {
        http.get(`/aps/flow/info/${station}`).then((res) => {
            resolve(res.data);
        })
    });
}

// export function APIGetDrawingForBackflushSetting(){
//     return new Promise<any>(resolve => {
//         http.get(`/GetDrawingForBackflushSetting`).then((res) => {
//             resolve(res.data);
//         })
//     });
// }

export function APIGetPriorityPlan(param: any) {
    return new Promise<any>(resolve => {
        http.post(`/GetPriorityPlan`, param).then((res) => {
            resolve({
                data: res.data,
                status: true
            });
        }).catch((err) => {
            if (axios.isAxiosError(err)) {
                resolve({
                    data: err.code,
                    status: false
                });
            } else {
                resolve({
                    data: err.message,
                    status: false
                });
            }
        })
    })
}
export function APISublinePlan(param:any) {
    return new Promise<any>(resolve => {
        http.post(`/GetSublinePlan`,param).then((res) => {
            resolve(res.data);
        })
    })
}