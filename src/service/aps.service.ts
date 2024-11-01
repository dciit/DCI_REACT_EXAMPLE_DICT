import axios from 'axios';
import { apsapi } from '../constants';
import { ViApsPartMasterProps, ApsProductionPlanProps, DictMstr, StatusProps, APSUpdatePlanProps, APSUpdateResultParam, ApsResult, APSResultProps, ApsNotify, EmpProps, ParamGetPlanMachine, PropsPlanMachine, ParamUpdateSequencePlan, PropsPartMaster, PropsInsertPlan, ParamMachineChangeSeq, PropsPart, ParamGetPart, ParamGetMainPlan, ParamGetNotify, ParamGetMainPlanTest, PropsMain, PropsMpckLayout, PropsInOut, ParamInOut, PropsPartGroup, ParamGetDrawingAdjust, PropsGastight, PropsGetMainPlan, ParamGetPartSetInByDrawing, PropDrawings, PropModels, ParamUpdateStatusPartSetIN, PropCasingInfo, PropBackflushAdjWip, ParamSublineSetting, ParamAddDrawingSubline } from '../interface/aps.interface';
import { ParamAdminUpdateDrawing, PropsAdjStock } from '../pages/aps.adj.stock';
import { PropsApsMainStockBalance } from '../interface/aps.main.interface';
import { ParamGetLayouts } from '../interface/mp.interface';
import { ParamMpckGetObjectByLayout } from '../interface/mpck.interface';
import { PropsDrawing } from '../components/dialog.wip.detail';
import { PropPrivilege } from '@/interface/admin.interface';
const http = axios.create({
    baseURL: apsapi,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8;json/html; charset=UTF-8',
    }
});

export function ViApsPartMaster() {
    return new Promise<ViApsPartMasterProps[]>(resolve => {
        http.get(`/aps/data/maininout`).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e);
        });
    })
}
// export function ApsMainGetData(date: string) {
//     return new Promise<ApsMainProps>(resolve => {
//         http.get(`/ApsMainGetData/${date}`).then((res) => {
//             resolve(res.data);
//         }).catch((e) => {
//             console.log(e);
//         });
//     })
// }
export function API_APS_PRODUCTION_PLAN(ymd: string) {
    return new Promise<PropsMain[]>(resolve => {
        http.get(`/ApsProductionPlan/get/${ymd}`).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e);
        });
    })
}

// export function ApiGetProductionPlan(param: ParamApsGetProductionPlan) {
//     return new Promise<PropsApsGetProductionPlan[]>(resolve => {
//         http.post(`/Aps/GetProductionPlan`, param).then((res) => {
//             resolve(res.data);
//         }).catch((e) => {
//             console.log(e);
//         });
//     })
// }

// export function API_GET_GASTIGHT(date: string) {
//     return new Promise<WipProps[]>(resolve => {
//         http.get(`/aps/gastight/get/${date}`).then((res) => {
//             resolve(res.data);
//         }).catch((e) => {
//             console.log(e);
//         });
//     })
// }
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
    return new Promise<StatusProps>(resolve => {
        http.post(`/ApsPlanChangePrioriry`, ApsPlan).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e);
        });
    })
}

export function API_UPDATE_PLAN(param: APSUpdatePlanProps) {
    return new Promise<StatusProps>(resolve => {
        http.post(`/ApsUpdatePlan`, param).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e);
        });
    })
}
// export function API_APS_INSERT_PLAN(props: APSInsertPlanProps) {
//     return new Promise<StatusProps>(resolve => {
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

export function API_APS_RESULT(param: ApsResult) {
    return new Promise<APSResultProps>(resolve => {
        http.post(`/Aps/GetBackflush`, param).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e)
        })
    })
}

export function API_APS_UPDATE_RESULT(param: APSUpdateResultParam) {
    return new Promise<StatusProps>(resolve => {
        http.post(`/Aps/UpdateBackflush`, param).then((res) => [
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

export function ApiGetNotify(param: ParamGetNotify) {
    return new Promise<ApsNotify[]>(resolve => {
        http.post(`/ApsGetNotify`, param).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e)
        })
    })
}


// export function API_APS_NOTIFY_LOGIN(empcode: string) {
//     return new Promise<EmpProps>(resolve => {
//         http.get(`/aps/notify/login/${empcode}`).then((res) => {
//             resolve(res.data);
//         }).catch((e) => {
//             console.log(e)
//         })
//     })
// }

export function ApiApsGetPlanMachine(param: ParamGetPlanMachine) {
    return new Promise<PropsPlanMachine[]>(resolve => {
        http.post(`/Aps/GetPlanMachine`, param).then((res) => [
            resolve(res.data)
        ]).catch((e) => {
            console.log(e);
        })
    })
}

export function ApiUpdateSequencePlan(param: ParamUpdateSequencePlan) {
    return new Promise<StatusProps>(resolve => {
        http.post(`/Aps/UpdateSequencePlan`, param).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e)
        })
    })
}

export function ApiGetPartMaster() {
    try {
        return new Promise<PropsPartMaster[]>(resolve => {
            http.get(`/Aps/GetPartMaster`).then((res) => {
                resolve(res.data);
            }).catch((e) => {
                console.log(e)
            })
        })
    } catch {
        return new Promise<PropsPartMaster[]>(resolve => {
            resolve([])
        })
    }
}

export function ApiInsertPlan(param: PropsInsertPlan) {
    return new Promise<StatusProps>(resolve => {
        http.post(`/Aps/InsertPlan`, param).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e)
        })
    })
}


export function ApiMachineChangeSeq(param: ParamMachineChangeSeq[]) {
    return new Promise<StatusProps>(resolve => {
        http.post(`/Aps/MachineChangeSeq`, param).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e)
        })
    })
}

export function ApiGetMainPlan(param: ParamGetMainPlan) {
    return new Promise<PropsGetMainPlan>(resolve => {
        http.post(`/aps/plan`, param).then((res) => {
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

export function ApiAdjStock(param: PropsAdjStock | PropBackflushAdjWip) {
    return new Promise<StatusProps>(resolve => {
        http.post(`/ApsWipAdjust`, param).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e)
        })
    })
}

export function ApiGetStockSubline(param: ParamGetMainPlanTest) {
    return new Promise<PropsApsMainStockBalance>(resolve => {
        http.post(`/ApsGetStockSubline`, param).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e)
        })
    })
}

export function ApiAdminUpdateDrawing(param: ParamAdminUpdateDrawing) {
    return new Promise<StatusProps>(resolve => {
        http.post(`/ApsAdminUpdateDrawing`, param).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e)
        })
    })
}


export function ApiGetLayouts(param: ParamGetLayouts) {
    return new Promise<PropsMpckLayout[]>(resolve => {
        http.post(`/mpck/getLayoutlist`, param).then((res) => {
            resolve(res.data);
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


export function ApiGetDrawingAdjust(param: ParamGetDrawingAdjust) {
    return new Promise<PropsDrawing>(resolve => {
        http.post(`/ApsGetDrawingAdjust`, param).then((res) => {
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

export function APIGetInfoStockSubline(group: string) {

    try {
        return new Promise<PropCasingInfo>(resolve => {
            http.get(`/GetStockCasing/${group}`).then((res) => {
                resolve(res.data);
            }).catch((e: Error | any) => {
                if (axios.isAxiosError(e)) {
                    resolve({
                        header: [],
                        item: [],
                        errorType: 'network'
                    })
                } else {
                    resolve({
                        header: [],
                        item: [],
                        errorType: ''
                    })
                }
            }).finally(() => {
                resolve({
                    header: [],
                    item: [],
                })
            })
        })
    } catch {
        return new Promise<PropCasingInfo>(resolve => {
            resolve({
                header: [],
                item: [],
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
    return new Promise<StatusProps>(resolve => {
        http.post(`/UpdateStatusPartSetIn`, param).then((res) => {
            resolve(res.data);
        })
    })
}

export function APIGetWipStockByPart(param: PropBackflushAdjWip) {
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