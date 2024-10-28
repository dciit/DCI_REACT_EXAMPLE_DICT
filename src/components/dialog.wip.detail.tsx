import Dialog from '@mui/material/Dialog'
import { PropsWipSelected } from '../pages/aps.main'
import { useEffect, useRef, useState } from 'react'
import { ApiAdjStock, ApiGetDrawingAdjust } from '../service/aps.service'
import ApsLoading from './aps.loading'
import { PropsAdjStock } from '../pages/aps.adj.stock'
import moment from 'moment'
import { useSelector } from 'react-redux'
import CheckIcon from '@mui/icons-material/Check';
import SCMLogin from './scm.login'
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Button } from 'antd'
import TextArea from 'antd/es/input/TextArea'
interface ParamWipDetail {
    open: boolean;
    setOpen: Function;
    wip: PropsWipSelected | null;
    type: string;
}
export interface PropsDrawing {
    drawing: string;
    cm: string;
    wcno: string;
    adj_qty: number;
}
function DialogWipDetail(props: ParamWipDetail) {
    const redux = useSelector((state: any) => state.redux);
    const empcode = (typeof redux.empcode != 'undefined') ? redux.empcode : '';
    const fullName = (typeof redux.fullName != 'undefined') ? redux.fullName : '';
    const login = (typeof redux.login != 'undefined') ? redux.login : false;
    const { open, setOpen, wip } = props;
    const [success, setSuccess] = useState<boolean>(false);
    const [fail, setFail] = useState<boolean>(false);
    const [load, setLoad] = useState<boolean>(true);
    const [data, setData] = useState<PropsAdjStock>({ ymd: moment().format('YYYYMMDD'), wcno: '', partno: '', cm: '', adj_qty: 0, adj_by: empcode, remark: '', wipBefore: 0 });
    const [time, setTime] = useState<string>('');
    const refInpRemark = useRef<HTMLTextAreaElement | null>(null);
    const [remarkError, setRemarkError] = useState<boolean>(false);
    useEffect(() => {
        if (open == true) {
            init();
        } else {
            setData({ ymd: moment().format('YYYYMMDD'), wcno: '', partno: '', cm: '', adj_qty: 0, adj_by: '', remark: '', wipBefore: 0 });
        }
    }, [open]);
    const init = async () => {
        setLoad(true);
        if (wip?.group != undefined && wip?.wip.modelcode != undefined) {
            try {
                let res = await ApiGetDrawingAdjust({
                    group: wip?.group,
                    sebango: wip?.wip.modelcode,
                    type: wip.type
                });
                setData({ ...data, wcno: res.wcno, partno: res.drawing, cm: res.cm, adj_by: empcode, adj_qty: res.adj_qty, wipBefore: res.adj_qty });
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
        if (data?.remark == undefined || data.remark.trim() == '' || (data.remark.trim().length == 1 && data.remark.trim() == '-')) {
            setRemarkError(true);
            setData({ ...data, remark: '' });
            refInpRemark.current?.focus();
            return false;
        }
        setRemarkError(false);
        if (confirm(`คุณแน่ใจใช่หรือไม่ ว่าต้องการ Adj.Wip = ${data.adj_qty} ?`)) {
            if (isNaN(data.adj_qty) && data.adj_qty == null || data.adj_qty < 0 || data.wcno == '' || data.partno == '') {
                alert('ข้อมูลไม่ครบถ้วน')
                return false;
            } else {
                let res = await ApiAdjStock(data);
                setData({ ...data, remark: '', wipBefore: data.adj_qty });
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

                                <ItemReadonly label='MODEL' value={`${wip?.wip?.modelname} (${wip?.wip.modelcode})`} />
                                {
                                    (data.partno != undefined && data.partno != '') && <>
                                        <ItemReadonly label='WCNO' value={`${data?.wcno != null ? data.wcno : 'ไม่พบข้อมูล'}`} />
                                        <ItemReadonly label='DRAWING' value={`${data?.partno != null ? data.partno : 'ไม่พบข้อมูล'}`} />
                                        <ItemReadonly label='CM' value={`${data?.cm != null ? data.cm : 'ไม่พบข้อมูล'}`} />
                                        <div className="grid grid-cols-4 items-center gap-4"><label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-right" >Adj. Qty</label>
                                            <input type='number' value={Number(data.adj_qty)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 col-span-3" autoFocus={true} onChange={(e) => setData({ ...data, adj_qty: e.target.value == '' ? 0 : Number(e.target.value) })} min={0} />
                                        </div>
                                        <ItemReadonly label='ผู้แก้ไข' value={`${fullName} (${empcode})`} />
                                        <div className="flex flex-col gap-2 py-2">
                                            <div className='flex gap-2 items-center'>
                                                <span className="relative flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                </span>
                                                <label className="text-red-600 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 " >หมายเหตุในการแก้ไขตัวเลข Stock
                                                </label>

                                            </div>
                                            <TextArea rows={4} placeholder="ระบุหมายเหตุที่ต้องแก้ไขตัวเลข Stock" value={data.remark} onChange={(e) => setData({ ...data, remark: e.target.value })} ref={refInpRemark} />
                                            {
                                                remarkError && <Alert message="กรุณาระบุหมายเหตุ หรือ ห้ามกรอก '-' หรือ ช่องว่าง !" type="error" showIcon />
                                            }
                                        </div>
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
                            <Button type='primary' disabled={(data.adj_qty < 0 || data?.partno == null) ? true : false} title={data.adj_qty < 0 ? 'กรุณาระบุยอดคงเหลือมากกว่า 0' : (data?.partno == null ? 'ข้อมูลของ Part ไม่ครบถ้วน' : '')} onClick={data.adj_qty < 0 ? () => undefined : handleUpdateWip}>บันทึก</Button>
                            <Button onClick={() => setOpen(false)}>ปิดหน้าต่าง</Button>
                        </div>
                    </div>
                }
            </div>
        </Dialog>
    )
}

export default DialogWipDetail