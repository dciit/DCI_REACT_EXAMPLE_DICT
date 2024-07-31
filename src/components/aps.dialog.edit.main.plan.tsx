import { Dialog, DialogContent, DialogActions } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DictMstr, PropsDialogNotice, PropsMain, StatusProps } from '../interface/aps.interface';
import { API_GET_REASON, API_UPDATE_PLAN } from '../service/aps.service';
import moment from 'moment';
import ButtonMtr from './button.mtr';
import { useSelector } from 'react-redux';
import Login from './aps.login';
function DialogEditMainPlan(props: PropsDialogNotice) {
    const { open, setOpen, data, apsLoad, planSelected } = props;
    const redux = useSelector((state: any) => state.redux);
    const login = (typeof redux.login != 'undefined') ? redux.login : false;
    const [plan, setPlan] = useState<PropsMain | null>(planSelected);
    const [reasons, setReasons] = useState<DictMstr[]>([]);
    const [reason, setReason] = useState<string>('');
    // const [nbr, setNbr] = useState<string | undefined>('');
    const [remark, setRemark] = useState<string>('');
    // const [planEdit, setPlanEdit] = useState<ApsProductionPlanProps | null>(null);

    // const [ParamInsertPlan, setParamInsertPlan] = useState<APSInsertPlanProps>({ modelCode: '', prdQty: 0, prdPlanCode: '' });
    const [WrnReason, setWrnReason] = useState<boolean>(false);
    const [WrnQty, setWrnQty] = useState<boolean>(false);
    const initData = async () => {
        let resReason: DictMstr[] = await API_GET_REASON();
        setReasons(resReason);
    }
    // useEffect(() => {
    //     if (planEdit != null && Object.keys(planEdit).length != 0) {
    //         setOpenInsertPlan(false);
    //     }
    // }, [planEdit])
    useEffect(() => {
        if (open == true) {
            setPlan(planSelected);
            initData();
        } else {
            setPlan(null);
        }
    }, [open]);
    const handleUpdatePlan = async () => {
        if (plan?.prdPlanQty == 0 && reason == '') {
            setWrnReason(true);
            toast.error('กรุณาระบุสาเหตุ ...')
            return false;
        }
        if (plan?.prdPlanQty == 0 && remark.length == 0) {
            setWrnQty(true);
            toast.error('กรุณาระบุหมายเหตุเพิ่มเติม ...')
            return false;
        }
        let res: StatusProps = await API_UPDATE_PLAN({
            prdPlanCode: (data != null && data.prdPlanCode != undefined) ? data.prdPlanCode : '',
            reasonCode: reason,
            prdPlanQty: plan != null && plan.prdPlanQty != undefined ? Number(plan.prdPlanQty) : 0,
            remark: remark
        });
        if (res.status == true) {
            toast.success("บันทึกข้อมูลเรียบร้อยแล้ว");
            apsLoad();
            setTimeout(() => {
                setOpen(false);
            }, 1000);
        } else {
            toast.error('แก้ไขข้อมูลแผนผลิตไม่สำเร็จ')
        }
    }
    useEffect(() => {
        if (remark != null && remark.length > 0) {
            setWrnQty(false)
        }
    }, [remark])
    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            fullWidth maxWidth='sm'
        >
            <DialogContent dividers>
                <div className='flex flex-col gap-3'>
                    {
                        !login ? <Login /> : <>
                            <div className='flex flex-col gap-1'>
                                <div className='text-[16px] font-semibold'>แก้ไขข้อมูลแผนผลิต</div>
                            </div>
                            <div className='border-b '></div>
                            {
                                data == null ? <div>NOT FOUND</div > : <div className='flex flex-col gap-3'>
                                    <div className={` px-3  pb-6   `}>
                                        <div className='grid grid-cols-2 gap-3'>
                                            <div className='flex flex-col gap-1'>
                                                <div>Model</div>
                                                <div className='flex text-[18px] items-center gap-1 pl-3 border rounded-lg px-3 pt-[5px] pb-[6px] bg-gray-100 cursor-not-allowed'>
                                                    <span>{(plan != undefined && typeof plan.partNo != 'undefined') ? plan.partNo : '-'}</span>
                                                </div>
                                            </div>
                                            <div className='flex flex-col gap-1'>
                                                <div>วันที่</div>
                                                <div className='flex text-[18px] items-center gap-1 pl-3 border rounded-lg px-3 pt-[5px] pb-[6px] bg-gray-100 cursor-not-allowed'>
                                                    <span>{(plan != undefined && typeof plan.apsPlanDate != undefined) ? moment(plan.apsPlanDate).format('DD/MM/YYYY') : '-'}</span>
                                                </div>
                                            </div>
                                            <div className='flex flex-col gap-1 col-span-2'>
                                                <div>APS Plan Qty</div>
                                                <div className='flex text-[18px] items-center gap-1 pl-3 border rounded-lg px-3 pt-[5px] pb-[6px] bg-gray-100 cursor-not-allowed'>
                                                    <span>{(plan != undefined && typeof plan.apsPlanQty != 'undefined') ? plan.apsPlanQty : 0}</span>
                                                </div>
                                            </div>
                                            <div className='flex flex-col gap-1 col-span-2'>
                                                <div>PRD Plan Qty </div>
                                                <input type="number" value={(plan != undefined && typeof plan.prdPlanQty != 'undefined') ? plan.prdPlanQty : 0} className={`hover:outline-none focus:outline-none   transition-colors duration-300   font-bold text-[18px] border-dashed border-2 ${plan?.prdPlanQty == 0 ? 'border-red-500 bg-red-50 text-red-500 focus:bg-red-50' : 'border-blue-500 bg-blue-50 text-blue-500 focus:bg-blue-50'} rounded-lg px-3 pt-[5px] pb-[6px]`} autoFocus={true} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    if (plan != null) {
                                                        setPlan({ ...plan, prdPlanQty: Number(e.target.value) })
                                                    }
                                                }} />
                                            </div>
                                            <div className='flex flex-col gap-1 col-span-2'>
                                                <p>สถานะ</p>
                                                <div className='flex gap-2'>
                                                    <div className={`flex items-center w-fit px-3 pt-[2px] pb-[3px]  shadow-md bg-blue-500 text-white   font-semibold rounded-xl cursor-pointer select-none ${(plan != null && (plan.prdPlanQty != undefined && plan.prdPlanQty > 0)) ? '' : 'opacity-35'}`} onClick={() => {
                                                        setPlan(plan != null ? { ...plan, prdPlanQty: plan.apsPlanQty } : null);
                                                        setReason('');
                                                        setWrnReason(false);
                                                    }}>รอผลิต</div>
                                                    <div className={`flex items-center w-fit px-3 pt-[2px] pb-[3px]  bg-red-500  text-white  rounded-xl cursor-pointer select-none ${(plan != null && (plan.prdPlanQty != undefined && plan.prdPlanQty <= 0)) ? '' : 'opacity-35'}`} onClick={() => {
                                                        setPlan(plan != null ? { ...plan, prdPlanQty: 0 } : null);
                                                        setWrnReason(false);
                                                    }}>ไม่ผลิต</div>
                                                </div>
                                            </div>
                                            {
                                                (plan != null && (plan.prdPlanQty != undefined && plan.prdPlanQty <= 0)) && <div className='flex flex-col gap-2'>
                                                    <div className='text-[#5f5f5f]'>สาเหตุ</div>
                                                    <div className='flex gap-1'>
                                                        {
                                                            reasons.map((oReason: DictMstr, i) => {
                                                                return <div className={`flex items-center w-fit px-3 pt-[2px] pb-[3px]  ${oReason.code == reason ? 'bg-red-500 text-white' : 'bg-white text-red-500 opacity-60'} border-red-400 border rounded-xl cursor-pointer select-none`} onClick={() => {
                                                                    setReason(oReason.code)
                                                                    setWrnReason(false)
                                                                }} key={i}> {oReason.description}</div>
                                                            })
                                                        }
                                                    </div>
                                                    {
                                                        WrnReason && <small className='text-red-500'>* กรุณาเลือกสาเหตุ</small>
                                                    }
                                                </div>
                                            }
                                            <div className='col-span-2'>
                                                <div className='text-[#5f5f5f]'>หมายเหตุ</div>
                                                <textarea
                                                    className={`border-2  focus:outline-none pt-1 pb-3 ${WrnQty ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'} rounded-lg w-full px-3 `} placeholder='คุณสามารถระบุหมายเหตุให้กับแผนการผลิตนี้ได้ ... ' rows={4} onChange={(e) => {
                                                        setRemark(e.target.value)
                                                    }} />
                                                {
                                                    WrnQty && <small className='text-red-500'>* กรุณาระบุหมายเหตุเพิ่มเติม เนื่องจาก ยอดผลิตจริงที่ต้องการ ไม่ตรงกับที่ระบบระบุ</small>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </>
                    }
                </div>

            </DialogContent>
            <DialogActions>
                {
                    login && <>
                        <div onClick={() => setOpen(false)}>
                            <ButtonMtr text='ปิดหน้าต่าง' event='red' />
                        </div>
                        {
                            plan != null && <div onClick={() => handleUpdatePlan()}>
                                <ButtonMtr text='บันทึก' event='' />
                            </div>
                        }
                    </>
                }
            </DialogActions>
            <ToastContainer autoClose={3000} />
        </Dialog >
    )
}

export default DialogEditMainPlan