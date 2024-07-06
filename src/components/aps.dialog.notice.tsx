import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Avatar, IconButton, Divider } from '@mui/material';
import { useEffect, useState } from 'react'
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import WorkspacesOutlinedIcon from '@mui/icons-material/WorkspacesOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { contact } from '../constants';
import ApsDND from './aps.dnd.plan';
import ApsInsertPlan from './aps.insert.plan';
import { APSInsertPlanProps, ApsProductionPlanProps, DictMstr, PropsDialogNotice, StatusProps } from '../interface/aps.interface';
import { API_GET_REASON, API_UPDATE_PLAN, API_APS_INSERT_PLAN } from '../service/aps.service';
function ApsDialogNotice(props: PropsDialogNotice) {
    const { open, setOpen, data, setData, plan, setPlan, apsLoad } = props;
    const [reasons, setReasons] = useState<DictMstr[]>([]);
    const [reason, setReason] = useState<string>('');
    const [changePriority, setChangePriority] = useState<boolean>(true);
    // const [nbr, setNbr] = useState<string | undefined>('');
    const [remark, setRemark] = useState<string>('');
    const [planEdit, setPlanEdit] = useState<ApsProductionPlanProps | null>(null);

    const [ParamInsertPlan, setParamInsertPlan] = useState<APSInsertPlanProps>({ modelCode: '', prdQty: 0, prdPlanCode: '' });

    const notify = () => toast.success("บันทึกข้อมูลเรียบร้อยแล้ว")
    const notifyInsertPlanReqSelectModel = () => toast.error("กรุณาเลือก Model ก่อน")
    const initData = async () => {
        let resReason: DictMstr[] = await API_GET_REASON();
        setReasons(resReason);
    }
    useEffect(() => {
        if (planEdit != null && Object.keys(planEdit).length != 0) {
            setOpenInsertPlan(false);
        }
    }, [planEdit])
    useEffect(() => {
        if (open == true) {
            // setNbr(data.prdPlanCode)
            initData();
        } else {
            setOpenInsertPlan(false);
            setPlanEdit(null);
            setChangePriority(false)
            // setNbr('');
        }
    }, [open])
    const handleUpdatePlan = async () => {
        let res: StatusProps = await API_UPDATE_PLAN({
            prdPlanCode: (data != null && data.prdPlanCode != undefined) ? data.prdPlanCode : '',
            reasonCode: reason,
            prdPlanQty: planEdit != null && planEdit.prdPlanQty != undefined ? Number(planEdit.prdPlanQty) : 0,
            remark: remark
        });
        if (res.status == true) {
            let indexOfPlanSelected: number = plan.findIndex((o: ApsProductionPlanProps) => o.prdPlanCode == (planEdit != null ? planEdit.prdPlanCode : ''));
            if (indexOfPlanSelected != -1) {
                let newPlans = Array.from(plan);
                newPlans[indexOfPlanSelected].prdPlanQty = planEdit != null ? planEdit.prdPlanQty : 0;
                setPlan(newPlans);
                notify();
            } else {
                console.log('123')
            }
        } else {
            alert(`เกิดข้อมูลพลาดระหว่างการบันทึกข้อมูล APS002 ${contact}`)
        }
    }

    const handleInsertPlan = async () => {
        if (typeof ParamInsertPlan.modelCode == 'undefined' || ParamInsertPlan.modelCode == undefined || ParamInsertPlan.modelCode == '') {
            notifyInsertPlanReqSelectModel();
            return false;
        } else {
            let res: StatusProps = await API_APS_INSERT_PLAN(ParamInsertPlan);
            if (res.status == true) {
                toast.success("เพิ่มแผนเรียบร้อยแล้ว")
                apsLoad();
            } else {
                alert(`${res.message} ${contact}`)
            }
        }
    }
    useEffect(() => {
        setReason('')
    }, [planEdit])

    const [openInsertPlan, setOpenInsertPlan] = useState<boolean>(false)
    const handleOpenInsertSequence = async () => {
        setOpenInsertPlan(true)
        setPlanEdit(null)
        setParamInsertPlan({ modelCode: '', prdQty: 0, prdPlanCode: (data != null ? (data.prdPlanCode != undefined ? data.prdPlanCode : '') : '') })
    }
    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            fullWidth maxWidth='sm'
        >
            <DialogTitle>{"จัดการแผนการผลิต"}</DialogTitle>
            <DialogContent dividers>
                {
                    data == null ? <div>NOT FOUND</div > : <div className='flex flex-col gap-3'>
                        <div className='grid grid-cols-1 gap-3'>
                            <div className='flex gap-2'>
                                <SyncAltIcon />
                                <div>ปรับเปลี่ยนลำดับแผนการผลิต <span className='text-red-500 text-sm'>* คุณสามารถลากและวางเพื่อปรับลำดับการผลิตได้</span></div>
                            </div>
                            {/* <ApsDND plan={plan} setPlan={setPlan} close={changePriority} /> */}
                            <ApsDND plan={plan} setPlan={setPlan} close={changePriority} planEdit={planEdit} setPlanEdit={setPlanEdit} />
                            <div className={`border-2 gap-2 bg-[#5c5fc8] border-[#5c5fc8]  text-white shadow-lg hover:opacity-100 ${openInsertPlan == true ? 'opacity-100' : 'opacity-80'} transition-all px-[8px] pt-[6px] pb-[7px] rounded-md flex items-center justify-center cursor-pointer select-none`} onClick={handleOpenInsertSequence}>
                                <AddCircleOutlineOutlinedIcon />
                                <span>เพิ่มแผนการผลิต</span>
                            </div>
                        </div>
                        {
                            (openInsertPlan == true && planEdit == null) && <ApsInsertPlan param={ParamInsertPlan} setParam={setParamInsertPlan} open={openInsertPlan} />
                        }
                        <div className={`${(planEdit == null) ? 'hidden' : ''} shadow-xl px-6 py-3 pb-6 rounded-md border`}>
                            <div className='font-semibold flex items-center justify-between mb-3'>
                                <div className='text-[#5c5fc8] select-none'>แก้ไขข้อมูลการผลิต</div>
                                <IconButton onClick={() => setPlanEdit(null)}>
                                    <CloseIcon className='text-[#5c5c5c]' />
                                </IconButton>
                            </div>
                            <div >  
                                <div className='grid grid-cols-2 gap-3'>
                                    <div className='flex flex-col gap-1'>
                                        <div>APS Qty <span className='text-[14px] text-[#5c5fc8] opacity-80'>(แผนการผลิตจากระบบ)</span></div>
                                        <div className='flex text-[18px] items-center gap-1 pl-3 border rounded-lg px-3 pt-[5px] pb-[6px]'>
                                            <WorkspacesOutlinedIcon className='text-[#5f5f5f]' />
                                            <span>{planEdit != null ? planEdit.apsPlanQty : 0}</span>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <div>Production Qty <span className='text-[14px] text-[#5c5fc8] opacity-80'>(ผลิตจริง)</span></div>
                                        <input type="number" value={planEdit != null ? planEdit.prdPlanQty : 0} className='hover:outline-none focus:outline-none focus:bg-[#5c5fc820] bg-[#5c5fc810] transition-colors duration-300  text-[#5c5fc8] font-bold text-[18px] border-dashed border-2 border-[#5c5fc8] rounded-lg px-3 pt-[5px] pb-[6px]' onChange={(e) => setPlanEdit(planEdit != null ? { ...planEdit, prdPlanQty: Number(e.target.value) } : null)} />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <div>Plan Status</div>
                                    <div className='flex gap-2'>
                                        <div className={`flex items-center w-fit px-3 pt-[2px] pb-[3px] border-2 border-[#5c5fc8] text-[#5c5fc8] bg-[#5c5fc820] font-semibold rounded-xl cursor-pointer select-none ${(planEdit != null && (planEdit.prdPlanQty != undefined && planEdit.prdPlanQty > 0)) ? '' : 'opacity-35'}`} onClick={(e) => {
                                            setPlanEdit(planEdit != null ? { ...planEdit, prdPlanQty: planEdit.apsPlanQty } : null);
                                            setReason('');
                                        }}>รอผลิต</div>
                                        <div className={`flex items-center w-fit px-3 pt-[2px] pb-[3px]  border-red-500 border-2 text-red-500 bg-red-50 border-dashed rounded-xl cursor-pointer select-none ${(planEdit != null && (planEdit.prdPlanQty != undefined && planEdit.prdPlanQty <= 0)) ? '' : 'opacity-35'}`} onClick={() => setPlanEdit(planEdit != null ? { ...planEdit, prdPlanQty: 0 } : null)}>ไม่ผลิต</div>
                                    </div>
                                </div>
                                {
                                    (planEdit != null && (planEdit.prdPlanQty != undefined && planEdit.prdPlanQty <= 0)) && <div className='flex flex-col gap-2'>
                                        <div className='text-[#5f5f5f]'>Reason</div>
                                        <div className='flex gap-1'>
                                            {
                                                reasons.map((oReason: DictMstr, i) => {
                                                    return <div className={`flex items-center w-fit px-3 pt-[2px] pb-[3px]  ${oReason.code == reason ? 'bg-red-500 text-white' : 'bg-white text-red-500 opacity-60'} border-red-400 border rounded-xl cursor-pointer select-none`} onClick={() => setReason(oReason.code)} key={i}> {oReason.description}</div>
                                                })
                                            }
                                        </div>
                                    </div>
                                }
                                <div>
                                    <div className='text-[#5f5f5f]'>Remark</div>
                                    <textarea
                                        className='border-2 bg-[#5c5fc810] focus:outline-none pt-1 pb-3 border-[#5c5fc8] rounded-lg w-full px-3 bg-gray-50' placeholder='คุณสามารถระบุหมายเหตุให้กับแผนการผลิตนี้ได้ ... ' rows={4} onChange={(e) => setRemark(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </DialogContent>
            <DialogActions>
                <div onClick={() => setOpen(false)} className='border-[#5c5fc8] border text-[#5c5fc8] px-3 pt-1 pb-1 rounded-md bg-[#5c5fc810] cursor-pointer select-none transition-all duration-100 hover:scale-105'>ปิดหน้าต่าง</div>
                {
                    (planEdit != null && Object.keys(planEdit).length) && <div onClick={() => ((planEdit.prdPlanQty != undefined && planEdit.prdPlanQty > 0) || (planEdit.prdPlanQty != undefined && planEdit.prdPlanQty == 0 && reason != '')) ? handleUpdatePlan() : false} className={`text-white px-4 pt-1 pb-1 rounded-md bg-[#5c5fc8] border border-[#5c5fc8] ${((planEdit.prdPlanQty != undefined && planEdit.prdPlanQty > 0) || (planEdit.prdPlanQty != undefined && planEdit.prdPlanQty == 0 && reason != '')) ? 'hover:scale-105 cursor-pointer' : 'opacity-60 cursor-not-allowed'}  select-none transition-all duration-100 `}>บันทึก</div>
                }
                {
                    openInsertPlan == true && <div className={`text-white px-4 pt-1 pb-1 rounded-md bg-[#5c5fc8] border border-[#5c5fc8] select-none cursor-pointer hover:scale-105 transition-all duration-100 `} onClick={handleInsertPlan}>
                        เพิ่ม
                    </div>
                }
            </DialogActions>
            <ToastContainer autoClose={3000} />
        </Dialog >
    )
}

export default ApsDialogNotice