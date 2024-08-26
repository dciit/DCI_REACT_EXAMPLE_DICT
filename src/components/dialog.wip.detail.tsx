import Dialog from '@mui/material/Dialog'
import { PropsWipSelected } from '../pages/aps.main'
import { useEffect, useState } from 'react'
import { ApiAdjStock, ApiGetDrawingAdjust } from '../service/aps.service'
import ApsLoading from './aps.loading'
import { PropsAdjStock } from '../pages/aps.adj.stock'
import moment from 'moment'
import { useSelector } from 'react-redux'
import CheckIcon from '@mui/icons-material/Check';
import SCMLogin from './scm.login'
import CloseIcon from '@mui/icons-material/Close';
interface ParamWipDetail {
    open: boolean;
    setOpen: Function;
    wip: PropsWipSelected | null;
    type:string;
}
export interface PropsDrawing {
    drawing: string;
    cm: string;
    wcno: string;
}
function DialogWipDetail(props: ParamWipDetail) {
    const redux = useSelector((state: any) => state.redux);
    const empcode = (typeof redux.empcode != 'undefined') ? redux.empcode : '';
    const fullName = (typeof redux.fullName != 'undefined') ? redux.fullName : '';
    const login = (typeof redux.login != 'undefined') ? redux.login : false;
    const { open, setOpen, wip} = props;
    const [success, setSuccess] = useState<boolean>(false);
    const [fail, setFail] = useState<boolean>(false);
    const [load, setLoad] = useState<boolean>(true);
    const [data, setData] = useState<PropsAdjStock>({ ymd: moment().format('YYYYMMDD'), wcno: '', partno: '', cm: '', adj_qty: 0, adj_by: empcode });
    const [time, setTime] = useState<string>('');
    useEffect(() => {
        if (open == true) {
            init();
        } else {
            setData({ ymd: moment().format('YYYYMMDD'), wcno: '', partno: '', cm: '', adj_qty: 0, adj_by: '' })
        }
    }, [open]);
    const init = async () => {
        setLoad(true);
        if (wip?.group != undefined && wip?.wip.modelcode != undefined) {
            try {
                let res = await ApiGetDrawingAdjust({
                    group: wip?.group,
                    sebango: wip?.wip.modelcode,
                    type : wip.type
                });
                setData({ ...data, wcno: res.wcno, partno: res.drawing, cm: res.cm, adj_by: empcode });
            } catch {
                setData({ ...data, wcno: '' });
            }
        }
    }
    useEffect(() => {
        setLoad(false);
    }, [data])

    const ItemReadonly = ({ label, value }: { label: string, value: string }) => {
        return <div className="grid grid-cols-4 items-center gap-4"><label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-right" >{label}</label><input className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 col-span-3 select-none" readOnly value={value} /></div>
    }

    const handleUpdateWip = async () => {
        if (confirm(`คุณแน่ใจใช่หรือไม่ ว่าต้องการ Adj.Wip = ${data.adj_qty} ?`)) {
            if (isNaN(data.adj_qty) && data.adj_qty == null || data.adj_qty < 0 || data.wcno == '' || data.partno == '') {
                alert('ข้อมูลไม่ครบถ้วน')
                return false;
            } else {
                let res = await ApiAdjStock(data);
                setTime(moment().format('HH:mm:ss'));
                if (res.status == true) {
                    setFail(false);
                    setSuccess(true);
                } else {
                    setFail(true);
                }
            }
        }
    }
    useEffect(() => {
        if (success == true) {
            setTimeout(() => {
                setSuccess(false);
            }, 5000);
        }
    }, [success])
    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='sm'>
            <div className='p-[1.5rem] w-full'>
                <div className='flex flex-col'>
                    <strong>Wip Adjust</strong>
                    <small>You can edit or modify the numbers yourself.</small>
                </div>
                {
                    login == false ? <SCMLogin /> : <div className='px-6 pt-6 pb-3'>
                        {
                            load ? <ApsLoading message='กำลังโหลดข้อมูล' /> : <div className='grid grid-cols-1 gap-4 py-4'>

                                <ItemReadonly label='Model' value={`${wip?.wip.modelname} (${wip?.wip.modelcode})`} />
                                {
                                    (data.partno != undefined && data.partno != '') && <>
                                        <ItemReadonly label='WCNO' value={`${data?.wcno != null ? data.wcno : 'ไม่พบข้อมูล'}`} />
                                        <ItemReadonly label='Drawing' value={`${data?.partno != null ? data.partno : 'ไม่พบข้อมูล'}`} />
                                        <ItemReadonly label='CM' value={`${data?.cm != null ? data.cm : 'ไม่พบข้อมูล'}`} />
                                        <div className="grid grid-cols-4 items-center gap-4"><label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-right" >Adj. Qty</label>
                                            <input type='number' value={Number(data.adj_qty)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 col-span-3" autoFocus={true} min={0} onChange={(e) => setData({ ...data, adj_qty: e.target.value == '' ? 0 : Number(e.target.value) })} />
                                        </div>
                                        <ItemReadonly label='ผู้แก้ไข' value={`${fullName} (${empcode})`} />
                                    </>
                                }
                                {
                                    success == true && <div className='grid grid-cols-4 '>
                                        <div className='col-start-2 col-span-3 bg-green-500 text-white   pl-3 pr-4 text-center rounded-2xl w-fit py-1 shadow-md text-sm  gap-1 items-end justify-center'>
                                            <CheckIcon />
                                            <span>บันทึกสำเร็จแล้ว {time}</span>
                                        </div>
                                    </div>
                                }

                                {
                                    fail == true && <div className='grid grid-cols-4 '>
                                        <div className='col-start-2 col-span-3 bg-red-600 text-white   pl-3 pr-4 text-center rounded-2xl w-fit py-1 shadow-md text-sm  gap-1 items-end justify-center'>
                                            <CloseIcon />
                                            <span>บันทึกไม่สำเร็จ {time}</span>
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                        <div className='pt-6 flex justify-end gap-3 select-none'>
                            {
                                data.wcno == undefined ? <div className='bg-black text-white  px-4 text-center rounded-md w-fit py-2 shadow-md cursor-pointer opacity-80'>ไม่พบข้อมูล Drawing</div> : <div className='bg-black text-white  px-4 text-center rounded-md w-fit py-2 shadow-md cursor-pointer' onClick={handleUpdateWip}>บันทึก</div>
                            }
                            <div className='bg-white text-black  px-4 text-center rounded-md w-fit py-2 shadow-sm border cursor-pointer' onClick={() => setOpen(false)}>
                                ปิดหน้าต่าง
                            </div>
                        </div>
                    </div>
                }
            </div>
        </Dialog>
    )
}

export default DialogWipDetail