import { ChangeEvent, useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import AddIcon from '@mui/icons-material/Add';
import ButtonMtr from './button.mtr'
import { API_GET_MODEL_MASTER, ApiGetPartGroupMaster, ApiInsertPlan } from '../service/aps.service'
import { DictMstr, Mdw27Props, ParamInsertPlan, PropsInsertPlan } from '../interface/aps.interface'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import Login from './aps.login'
interface ParamDialogInsertPlan {
    type: string; // MAIN OR SUBLINE
    open: boolean;
    setOpen: Function;
    ymd: string;
    apsLoad: Function;
    param: ParamInsertPlan;
}
function DialogInsertPlan(props: ParamDialogInsertPlan) {
    const { open, setOpen, ymd, apsLoad, param } = props;
    const redux = useSelector((state: any) => state.redux);
    const empcode = (typeof redux.empcode != 'undefined') ? redux.empcode : '';
    const login = (typeof redux.login != 'undefined') ? redux.login : false;
    const type: string = param.type;
    const [models, setModels] = useState<Mdw27Props[]>([]);
    const [newPlan, setNewPlan] = useState<PropsInsertPlan>({ date: moment(ymd).format('YYYYMMDD'), empcode: empcode, model: '', qty: 0, wcno: '', seq: 0, type: '' });
    const [WrnQty, setWrnQty] = useState<boolean>(false);
    const [WrnModel, setWrnModel] = useState<boolean>(false);
    const [partGroup, setPartGroup] = useState<DictMstr[]>([]);
    const [GroupSelected, setGroupSelected] = useState<string>(param.group);
    useEffect(() => {
        if (open == true) {
            initData();
        } else {
            setModels([]);
            setNewPlan({ ...newPlan, model: '', qty: 0, date: '' })
        }
    }, [open]);
    useEffect(() => {
        if (newPlan.qty > 0) {
            setWrnQty(false);
        } else {
            setWrnQty(true);
        }
    }, [newPlan.qty])
    useEffect(() => {
        if (newPlan.model != '') {
            setWrnModel(false);
        } else {
            setWrnModel(true);
        }
    }, [newPlan.model])
    const initData = async () => {
        const ApiGetPartGroup = await ApiGetPartGroupMaster();
        setPartGroup(ApiGetPartGroup);
        let resGetModels = await API_GET_MODEL_MASTER(type == 'MAIN' ? {
            group: 'SCR',
            type: 'MAIN'
        } : {
            group: GroupSelected,
            type: 'SUBLINE'
        });
        setModels(resGetModels);
    }
    const handleInsertPlan = async () => {
        if (newPlan.qty <= 0) {
            setWrnQty(true);
            toast.error('กรุณาระบุยอดผลิต')
            return false;
        }
        if (newPlan.model == '') {
            setWrnModel(true);
            return false;
        }
        let res = await ApiInsertPlan({
            model: newPlan.model, qty: newPlan.qty, date: ymd, empcode: empcode, wcno: type == 'MAIN' ? '904' : newPlan.wcno, seq: param.seq, type: type, partGroup: GroupSelected
        });
        if (res.status == true) {
            toast.success('เพิ่มแผนสำเร็จ');
            setOpen(true);
            apsLoad();
        } else {
            toast.error('ไม่สามารถเพิ่มแผนได้');
        }
    }

    useEffect(() => {
        if (GroupSelected != '') {
            initData();
        }
    }, [GroupSelected])
    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth={'sm'}>
            <DialogContent>
                <div className='flex flex-col gap-3'>
                    {
                        login == false ? <Login /> : <> <div className='flex flex-col gap-1'>
                            <div className='text-[16px] font-semibold flex items-center gap-1'>
                                <AddIcon />
                                <span>เพิ่มแผนผลิต {type}</span>
                            </div>
                        </div>
                            <div className='border-b '></div>
                            <div className='grid grid-cols-1'>
                                <div className='flex flex-col gap-1'>
                                    <span>วันที่ผลิต</span>
                                    <input type="date" className='border rounded-md  px-3 py-1 focus:outline-none ' value={(newPlan.date == '' ? moment() : moment(newPlan.date)).format('YYYY-MM-DD')} onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPlan({ ...newPlan, date: moment(e.target.value).format('YYYYMMDD') })} />
                                </div>
                            </div>
                            {
                                type == 'SUBLINE' && <div className='grid grid-cols-1'>
                                    <div className='flex flex-col gap-1'>
                                        <span>กลุ่ม</span>
                                        <select className='border rounded-md px-2 py-1 text-blue-500 focus:outline-none hover:outline-none focus:border-blue-400' onChange={(e: ChangeEvent<HTMLSelectElement>) => setGroupSelected(e.target.value)}  >
                                            <option value="">--- ทั้งหมด ---</option>
                                            {
                                                partGroup.filter(x => x.code != 'OS').map((o: DictMstr, i: number) => (<option key={i} value={o.code} selected={o.code == GroupSelected ? true : false}>{o.code == 'FS' ? (`${o.description} ORBITING`) : o.description} ({o.code == 'FS' ? `FS/OS` : o.code})</option>))
                                            }
                                        </select>
                                    </div>
                                </div>
                            }
                            <div className='flex flex-col gap-1'>
                                <p>Model</p>
                                <select className={`text-blue-500 border rounded-md py-1 px-3 ${WrnModel ? 'border-red-500 bg-red-50 text-red-500' : ''}`} onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewPlan({ ...newPlan, model: e.target.value, wcno: (type == 'MAIN' ? '904' : (models.filter(x => x.modelCode == e.target.value).length ? models.filter(x => x.modelCode == e.target.value)[0].wcno : '')) })}>
                                    <option value="">--- กรุณาเลือก ---</option>
                                    {
                                        models.map((o: Mdw27Props, i: number) => {
                                            return type == 'MAIN' ? <option key={i} value={o.modelName}>{o.modelName} ({o.modelCode})</option> : <option key={i} value={o.modelCode}>{o.modelCode} {`${o.modelName != '' ? `(${o.modelName})` : ''}`}</option>
                                        })
                                    }
                                </select>
                                {
                                    WrnModel && <small className='text-red-500'>* กรุณาเลือก Model</small>
                                }
                            </div>
                            <div className='flex flex-col gap-1'>
                                <p>จำนวนผลิต (Prd. Plan Qty)</p>
                                <input type="number" min={0} className={`text-end border rounded-md px-3 py-1 focus:outline-none ${WrnQty ? 'border-red-500 text-red-600 bg-red-50' : 'border-blue-500 text-blue-600 bg-blue-50'} font-semibold `} autoFocus={true} value={newPlan.qty} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    if (Number(e.target.value) > 0) {
                                        setNewPlan({ ...newPlan, qty: Number(e.target.value) })
                                    } else {
                                        setNewPlan({ ...newPlan, qty: Number(0) })
                                    }
                                }} />
                                {
                                    WrnQty && <small className='text-red-500'>* กรุณาระบุยอดที่ต้องการผลิต</small>
                                }
                            </div>
                            <div className='flex flex-col gap-1'>
                                <div className='text-[14px] text-gray-500'></div>
                            </div>
                            <div className='flex items-center justify-end gap-2'>
                                <div onClick={() => setOpen(false)}>
                                    <ButtonMtr text='ปิดหน้าต่าง' event='red' />
                                </div>
                                <div onClick={handleInsertPlan}>
                                    <ButtonMtr text='เพิ่ม' event='' icon={<AddIcon />} />
                                </div>
                            </div>
                        </>}
                    <ToastContainer autoClose={3000} />

                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DialogInsertPlan