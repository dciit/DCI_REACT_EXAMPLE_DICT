import axios from 'axios';
import { apsapi } from '../constants';
import { ViApsPartMasterProps, ApsMainProps, ApsProductionPlanProps, DictMstr, StatusProps, APSUpdatePlanProps, APSInsertPlanProps, Mdw27Props, WipProps, APSUpdateResultParam, ApsResult, APSResultProps, ApsNotify, EmpProps, ParamGetPlanMachine, PropsPlanMachine, ParamUpdateSequencePlan, PropsPartMaster, ParamInsertPlan } from '../interface/aps.interface';
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
export function ApsMainGetData(date: string) {
    return new Promise<ApsMainProps>(resolve => {
        http.get(`/ApsMainGetData/${date}`).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e);
        });
    })
}
export function API_APS_PRODUCTION_PLAN() {
    return new Promise<ApsProductionPlanProps[]>(resolve => {
        http.get(`/ApsProductionPlan/get`).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e);
        });
    })
}

export function API_GET_GASTIGHT(date: string) {
    return new Promise<WipProps[]>(resolve => {
        http.get(`/aps/gastight/get/${date}`).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e);
        });
    })
}
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
export function API_APS_INSERT_PLAN(props: APSInsertPlanProps) {
    return new Promise<StatusProps>(resolve => {
        http.post(`/ApsInsertPlan`, props).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e);
        });
    })
}

export function API_GET_MODEL_MASTER() {
    return new Promise<Mdw27Props[]>(resolve => {
        http.get(`/GetModelMaster`).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e);
        });
    })
}

export function API_APS_RESULT(param: ApsResult) {
    return new Promise<APSResultProps>(resolve => {
        http.post(`/aps/result/data`, param).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e)
        })
    })
}

export function API_APS_UPDATE_RESULT(param: APSUpdateResultParam) {
    return new Promise<StatusProps>(resolve => {
        http.post(`/aps/result/update`, param).then((res) => [
            resolve(res.data)
        ]).catch((e) => {
            console.log(e);
        })
    })
}

export function API_APS_PART_GROUP() {
    return new Promise<DictMstr[]>(resolve => {
        http.get(`/aps/partgroup`).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e)
        })
    })
}

export function API_APS_NOTIFY(wcno: string) {
    return new Promise<ApsNotify[]>(resolve => {
        http.get(`/aps/notify/${wcno}`).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e)
        })
    })
}


export function API_APS_NOTIFY_LOGIN(empcode: string) {
    return new Promise<EmpProps>(resolve => {
        http.get(`/aps/notify/login/${empcode}`).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e)
        })
    })
}

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
    return new Promise<PropsPartMaster[]>(resolve => {
        http.get(`/Aps/GetPartMaster`).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e)
        })
    })
}

export function ApiInsertPlan(param: ParamInsertPlan) {
    return new Promise<StatusProps>(resolve => {
        http.post(`/Aps/InsertPlan`, param).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e)
        })
    })
}
