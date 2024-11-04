//@ts-nocheck
import { ChangeEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DictMstr, PropsDialogNotice, PropsMain, StatusProps } from '../interface/aps.interface';
import { API_GET_REASON, API_UPDATE_PLAN } from '../service/aps.service';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Button, Input, Modal, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
function DialogEditMainPlan(props: PropsDialogNotice) {
    const { open, setOpen,  apsLoad, planSelected } = props;
    // const redux = useSelector((state: any) => state.redux);
    // const login = (typeof redux.login != 'undefined') ? redux.login : false;
    const [plan, setPlan] = useState<PropsMain | null>(planSelected);
    const [reasons, setReasons] = useState<DictMstr[]>([]);
    const [reason, setReason] = useState<string>('');
    // const [nbr, setNbr] = useState<string | undefined>('');
    const [remark, setRemark] = useState<string>('');
    // const [planEdit, setPlanEdit] = useState<ApsProductionPlanProps | null>(null);

    // const [ParamInsertPlan, setParamInsertPlan] = useState<APSInsertPlanProps>({ modelCode: '', prdQty: 0, prdPlanCode: '' });
    const [WrnReason, setWrnReason] = useState<boolean>(false);
    const [WrnQty, setWrnQty] = useState<boolean>(false);
    const [load, setLoad] = useState<boolean>(true);
    const initData = async () => {
        setLoad(true);
        let resReason: DictMstr[] = await API_GET_REASON();
        setReasons(resReason);
        setLoad(false);
    }
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
        if (planSelected != null) {
            let res: StatusProps = await API_UPDATE_PLAN({
                prdPlanCode: planSelected.prdPlanCode,
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
    }
    useEffect(() => {
        if (remark != null && remark.length > 0) {
            setWrnQty(false)
        }
    }, [remark])
    return (

        <Modal open={open} title={`แก้ไขข้อมูลแผนผลิต`} onCancel={()=>setOpen(false)} onClose={()=>setOpen(false)} footer={<div className='flex items-center gap-2 w-full justify-end'>
            <Button type='primary' onClick={() => handleUpdatePlan()} >บันทึก</Button>
            <Button onClick={() => setOpen(false)}>ปิดหน้าต่าง</Button>
        </div>}>
            <Spin spinning={load}>
                <div className='flex flex-col gap-3'>
                    <div className='flex flex-col gap-3'>
                        <div className={` px-3  pb-6   `}>
                            <div className='grid grid-cols-2 gap-3'>
                                <div className='flex col-span-2 flex-col gap-1'>
                                    <div>วันที่</div>
                                    <Input readOnly={true} value={(plan != undefined && typeof plan.apsPlanDate != undefined) ? moment(plan.apsPlanDate).format('DD/MM/YYYY') : '-'} />
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <div>Model</div>
                                    <Input readOnly={true} value={(plan != undefined && typeof plan.partNo != 'undefined') ? plan.partNo : '-'} />
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <div>Sebango</div>
                                    <Input readOnly={true} value={(plan != undefined && typeof plan.partNo != 'undefined') ? plan.partNo : '-'} />
                                </div>
                                <div className='flex flex-col gap-1 col-span-2'>
                                    <div>จำนวนที่ต้องการผลิต</div>
                                    <Input size='large' value={(plan != undefined && typeof plan.prdPlanQty != 'undefined') ? plan.prdPlanQty : 0} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        setPlan({ ...plan, prdPlanQty: Number(e.target.value) })
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
                                    <TextArea rows={5} placeholder='คุณสามารถระบุหมายเหตุให้กับแผนการผลิตนี้ได้ ...' onChange={(e) => { setRemark(e.target.value) }} />
                                    {
                                        WrnQty && <small className='text-red-500'>* กรุณาระบุหมายเหตุเพิ่มเติม เนื่องจาก ยอดผลิตจริงที่ต้องการ ไม่ตรงกับที่ระบบระบุ</small>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Spin>
        </Modal>
    )
}

export default DialogEditMainPlan