//@ts-nocheck
import { Fragment, useEffect, useState } from 'react'
import { intervalTime, lines } from '../constants'
import moment from 'moment';
import { ApsNotify, DictMstr, LineProps, ParamInsertPlan, PropsMain, PropsPartMaster, PropsPlanMachine } from '../interface/aps.interface';
import { ApiGetPartGroupMaster, ApiApsGetPlanMachine, ApiGetNotify, ApiGetPartMaster, ApiMachineChangeSeq, ApiGetMainPlan } from '../service/aps.service';
// import DialogEditSeq from '../components/aps.dialog.edit.seq';
import { CircularProgress, IconButton } from '@mui/material';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
// import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
// import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { ToastContainer, toast } from 'react-toastify';
import DialogEditMainPlan from '../components/aps.dialog.edit.main.plan';
// import ButtonMtr from '../components/button.mtr';
import DialogInsertPlan from '../components/aps.dialog.insert.plan';
import AddIcon from '@mui/icons-material/Add';
import DialogMachineConfChangeSeq from '../components/machine/machine.conf.change.seq';
import DialogEditPlanMachine from '../components/machine/machine.edit';
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined';
import ListPlanStatus from '../components/list.status';
import ReportIcon from '@mui/icons-material/Report';
import { Alert, Badge, Button, Card, Tabs } from 'antd';
import ApsItemSublune from '@/components/aps.item.subline';
import CircleIcon from '@mui/icons-material/Circle';
import CasingRMStock from '@/components/casing.rm.stock';
import NotWorking from '@/components/notworking';
import MachineRMStock from '@/components/machine.rm.stock';
function ApsSubLine() {
    let dateLoop: string = '';
    const [dev] = useState<boolean>(false);
    const [ymd, _] = useState<any>(moment());
    // const [modelUse] = useState<string>('');
    const [apsProductionPlan, setApsProductionPlan] = useState<PropsMain[]>([]);
    const [partGroup, setPartGroup] = useState<DictMstr[]>([]);
    const [partGroupSelected, setPartGroupSelected] = useState<DictMstr | null>(null);
    const [openEditSeq, setOpenEditSeq] = useState<boolean>(false);
    const [lineSelected, setLineSelected] = useState<LineProps>(lines[0]);
    const [planMachines, setPlanMachines] = useState<PropsPlanMachine[]>([]);
    const [partMasters, setPartMasters] = useState<PropsPartMaster[]>([]);
    const [load, setLoad] = useState<boolean>(true);
    const [planSelected, setPlanSelected] = useState<PropsMain | null>(null);
    const [MachinePlan, setMachinePlan] = useState<PropsPlanMachine | null>(null);
    // const [openDialogConfSeq, setOpenDialogConfSeq] = useState<boolean>(false);
    const [openDialogInsertPlan, setOpenDialogInsertPlan] = useState<boolean>(false);
    const [PrevPlanChange, setPrevPlanChange] = useState<PropsPlanMachine | null>(null);
    const [ToPlanChange, setToPlanChange] = useState<PropsPlanMachine | null>(null);
    const [openDialogMachineChangeSeq, setOpenDialogMachineChangeSeq] = useState<boolean>(false);
    const [openDialogEditMachinePlan, setOpenDialogEditMachinePlan] = useState<boolean>(false);
    const [openDialogEditMainPlan, setDialogEditMainPlan] = useState<boolean>(false);
    const [typeInsert, setTypeInsert] = useState<string>('');
    const [notifys, setNotifys] = useState<ApsNotify[]>([]);
    const [ParamInsertPlan, setParamInsertPlan] = useState<ParamInsertPlan>({
        group: '',
        seq: 0,
        type: ''
    });

    let LoopDate: string = '';
    let DrawDate: boolean = false;

    useEffect(() => {
        const intervalCall = setInterval(() => {
            dateLoop = '';
            init();
        }, intervalTime);
        return () => {
            clearInterval(intervalCall);
        }
    }, [])
    const init = async () => {
        setPartGroup([]);
        let partMaster: PropsPartMaster[] = await ApiGetPartMaster();
        setPartMasters(partMaster);
        const ResGetPartGroupMaster = await ApiGetPartGroupMaster();
        setPartGroup(ResGetPartGroupMaster);
        const res = await ApiGetMainPlan({
            paramDate: ymd.format('YYYYMMDD'),
            paramWCNO: '904'
        });
        setApsProductionPlan(res.main);
        const ApiGetApsPlanMachine = await ApiApsGetPlanMachine({ ymd: ymd.format('YYYYMMDD') });
        setPlanMachines(ApiGetApsPlanMachine);
        const ResGetNotify = await ApiGetNotify({
            wcno: '904', date: ymd.format('YYYYMMDD')
        });
        setNotifys(ResGetNotify);
        setLoad(false);
    }
    useEffect(() => {
        if (partGroupSelected != null && typeof partGroupSelected != 'undefined' && Object.keys(partGroupSelected).length > 0) {
            setOpenEditSeq(true);
        } else {
            setOpenEditSeq(false);
        }
    }, [partGroupSelected])
    useEffect(() => {
        if (openDialogEditMainPlan == false) {
            setPlanSelected(null);
        }
    }, [openDialogEditMainPlan])


    useEffect(() => {
        if (openEditSeq == false) {
            setPartGroupSelected(null);
        }
    }, [openEditSeq]);
    useEffect(() => {
        init();
    }, [ymd]);
    useEffect(() => {
        if (planSelected != null && Object.keys(planSelected).length > 0) {
            setDialogEditMainPlan(true);
        }
    }, [planSelected])

    useEffect(() => {
        if (PrevPlanChange != null && ToPlanChange != null) {
            setOpenDialogMachineChangeSeq(true);
        } else {
            setOpenDialogMachineChangeSeq(false);
        }
    }, [PrevPlanChange, ToPlanChange]);

    const handleMachineChangeSeq = async () => {
        let prevSeq: number | undefined = PrevPlanChange?.prdSeq;
        let toSeq: number | undefined = ToPlanChange?.prdSeq;
        if (prevSeq != undefined && toSeq != undefined) {
            await ApiMachineChangeSeq([
                { prdPlanCode: PrevPlanChange?.prdPlanCode, prdSeq: Number(ToPlanChange?.prdSeq) },
                { prdPlanCode: ToPlanChange?.prdPlanCode, prdSeq: Number(PrevPlanChange?.prdSeq) },
            ]);
            try {
                toast.success('เปลี่ยนลำดับสำเร็จแล้ว')
            } catch {
                toast.error('เกิดข้อผิดพลาดกับการเปลี่ยนลำดับการผลิต')
            }
            setOpenDialogMachineChangeSeq(false);
            init();
        }
    }

    const handleEvent = async (change: boolean, item: PropsPlanMachine) => {
        if (change) {
            setPrevPlanChange(null);
            setToPlanChange(null);
        } else {
            if (PrevPlanChange != null && PrevPlanChange?.prdPlanCode != item.prdPlanCode) {
                if (PrevPlanChange?.partGroup != item?.partGroup) {
                    toast.error('ไม่สามารถเปลี่ยนลำดับแผนข้ามกลุ่มได้')
                    setToPlanChange(null);
                } else {
                    setToPlanChange({ ...item })
                }
            } else {
                setPrevPlanChange({ ...item })
            }
        }
    }

    useEffect(() => {
        if (openDialogMachineChangeSeq == false) {
            setPrevPlanChange(null);
            setToPlanChange(null);
        }
    }, [openDialogMachineChangeSeq])

    useEffect(() => {
        if (MachinePlan != null) {
            setOpenDialogEditMachinePlan(true);
        }
    }, [MachinePlan])

    useEffect(() => {
        if (openDialogEditMachinePlan == false) {
            setMachinePlan(null);
        }
    }, [openDialogEditMachinePlan])

    useEffect(() => {
        if (typeInsert != '') {
            setOpenDialogInsertPlan(true);
        }
    }, [typeInsert])

    useEffect(() => {
        if (ParamInsertPlan.type != '') {
            setOpenDialogInsertPlan(true);
        }
    }, [ParamInsertPlan])
    useEffect(() => {
        if (openDialogInsertPlan == false) {
            setTypeInsert('');
        }
    }, [openDialogInsertPlan])
    const DrawItemMain = ({ qty, status }: any) => {
        if (qty == 0) {
            return <div className='px-3 bg-red-600 text-white rounded-full w-fit '>ยกเลิก</div>
        } else {
            if (status == 'CURRENT') {
                return <div className='px-3 bg-[#FFA500] text-black font-semibold rounded-full w-fit shadow-lg'>กำลังผลิต</div>
            } else if (status == 'SOME') {
                return <div className='px-3 bg-blue-600 text-white rounded-full w-fit '>ผลิตบางส่วน</div>
            } else if (status == 'SUCCESS') {
                return <div className='px-3 bg-green-700 text-white rounded-full w-fit '>ผลิตแล้ว</div>
            } else {
                return ''
            }
        }
    }
    return (
        <div className='grid grid-cols-1 gap-6 p-3'>
            {
                dev == true ? <Alert
                    message="ระหว่างพัฒนา"
                    description="กำลังปรับปรุงและแก้ไขระบบ กรุณารอสักครู่"
                    type="error"
                    showIcon
                /> : <div className='grid sm:grid-cols-6 md:grid-cols-6 xl:grid-cols-6 gap-6'>
                    <div className='sm:col-span-6 md:col-span-6 xl:col-span-2 border rounded-md bg-white  flex flex-col gap-2 w-full '>
                        <div className='bg-[#f9fafb]   border-b rounded-t-md h-[50px] flex item pl-4 items-center gap-1 pr-4'>
                            <div className='grow flex items-center gap-2'>
                                <ClearAllIcon />
                                <span className='select-none'>Main Assy Sequence</span>
                            </div>
                            {
                                notifys.filter((x: ApsNotify) => x.lineType == 'SUBLINE' && x.ackStatus == 'NOTIFY').length > 0 && <div className='flex-none flex items-center gap-2 bg-red-500 px-3 py-1 rounded-md shadow-md text-white'>
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/60 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white/80"></span>
                                    </span>
                                    <small>Subline เปลี่ยนแปลง</small>
                                </div>
                            }
                        </div>
                        <div className=' overflow-auto px-3 py-2 grid grid-cols-1 gap-3'>
                            <ListPlanStatus />
                            <table className='w-full bg-white text-[12px] shadow-md' id='tbMain'>
                                <thead className='border-b font-semibold select-none bg-[#F9FAFB]'>
                                    <tr>
                                        <td className='border py-1 text-center w-[10%]' rowSpan={2}>SEQ.</td>
                                        <td className='border w-[35%] pl-3' rowSpan={2}>MODEL</td>
                                        <td className='border text-center py-1' colSpan={1} >PLAN</td>
                                    </tr>
                                    <tr>
                                        <td className='border text-center w-[10%] py-1'>APS </td>
                                        {/* <td className='border text-center w-[10%]'>PRD </td> */}
                                    </tr>
                                </thead>
                                <tbody className='text-[12px]'>
                                    {
                                        load ? <tr><td colSpan={7} className='border'><div className='flex w-full items-center flex-col p-6 gap-2'><CircularProgress sx={{ color: '#2563EB' }} /><span className='text-[14px]'>กำลังโหลดข้อมูล</span></div></td></tr> : apsProductionPlan.length == 0 ? <tr><td colSpan={7} className='border py-2 text-center text-[14px] '>ไม่พบข้อมูล</td></tr> :
                                            apsProductionPlan.map((o: PropsMain, i: number) => {
                                                let groupModelIsUse = apsProductionPlan.map((o: PropsMain) => o.partNo);
                                                groupModelIsUse = [...new Set(groupModelIsUse)];
                                                if (dateLoop == '' || dateLoop != moment(o.apsPlanDate).format('DD/MM/YYYY')) {
                                                    dateLoop = moment(o.apsPlanDate).format('DD/MM/YYYY');
                                                }
                                                let dtNow = moment().format('DD/MM/YYYY');
                                                let event = dateLoop == dtNow ? true : false;
                                                let noPlan: boolean = o.prdPlanQty == 0 ? true : false;
                                                if (LoopDate == '' || LoopDate != moment(o.apsPlanDate).format('DD/MM/YYYY')) {
                                                    LoopDate = moment(o.apsPlanDate).format('DD/MM/YYYY');
                                                    DrawDate = true;
                                                } else {
                                                    DrawDate = false;
                                                }
                                                let isDate: boolean = moment(o.apsPlanDate).format('DD/MM/YYYY') == moment().format('DD/MM/YYYY') ? true : false;
                                                let apsCurrent: string = o.apsCurrent;
                                                return <Fragment key={i}>
                                                    {
                                                        DrawDate == true && <tr key={i} className={`cursor-pointer select-none ${noPlan && 'opacity-50'}`} >
                                                            <td colSpan={6} className='border py-2 pl-3'>
                                                                <div className='flex w-[100%] items-center gap-2'>
                                                                    <strong>{LoopDate}</strong>
                                                                    {
                                                                        !load && <Button disabled={true} title='ปิดการใช้งานชั่วคราว' type='primary' icon={<AddIcon sx={{ width: '20px' }} />}>เพิ่มแผนผลิต</Button>
                                                                    }
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    }
                                                    <tr className={`${isDate == true ? (apsCurrent == '' ? 'cursor-pointer' : (apsCurrent == 'CURRENT' ? 'bg-[#FFA500]/10' : (apsCurrent == 'SOME' ? 'bg-blue-50' : (apsCurrent == 'SUCCESS' ? 'bg-green-50' : 'bg-white')))) : 'cursor-not-allowed opacity-40'} select-none ${noPlan && 'opacity-50'}`} >
                                                        <td className={`border text-center ${apsCurrent == '' ? 'bg-[#F9FAFB]' : (apsCurrent == 'CURRENT' ? 'bg-[#FFA500] text-black font-semibold' : (apsCurrent == 'SOME' ? 'bg-blue-700 text-white' : (apsCurrent == 'SUCCESS' ? 'bg-green-700 text-white' : 'bg-white')))} font-semibold`} >
                                                            {
                                                                isDate == true ? o.prdSeq : <RemoveCircleOutlinedIcon className='text-[#ddd]' />
                                                            }
                                                        </td>
                                                        <td className={` pl-3  border`}>
                                                            <div className='pt-[2px] pb-[3px]'>
                                                                <p className='font-bold'>{o.partNo}</p>
                                                                <div className='flex items-center gap-1'>
                                                                    <strong>({o.modelCode})</strong>
                                                                    <DrawItemMain qty={o.apsPlanQty} status={apsCurrent} />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className={`border text-end pr-[4px] text-[14px] font-semibold text-blue-700`}>{o.apsPlanQty}</td>
                                                        {/* <td className={`border text-end pr-[4px]`}>
                                                            <div className={`pr-[4px] pt-[3px] pb-[2px]  rounded-lg font-semibold text-[14px] ${(o.prdPlanQty != undefined && o.prdPlanQty > 0) ? 'text-green-600 drop-shadow-lg' : 'text-red-500'}`}>{o.prdPlanQty}</div>
                                                        </td> */}
                                                        {/* <td className='border text-center bg-[#F9FAFB]'>
                                                            {
                                                                isDate == true && <IconButton onClick={() => event ? setPlanSelected(o) : false}>
                                                                    <EditIcon className='text-gray-600' sx={{ fontSize: '18px' }} />
                                                                </IconButton>
                                                            }
                                                        </td> */}
                                                    </tr>
                                                </Fragment>
                                            })
                                    }
                                </tbody>
                            </table>

                        </div>
                    </div>
                    <div className='sm:col-span-6 md:col-span-6 xl:col-span-4 flex flex-col gap-3'>
                        <Tabs
                            type="card"
                            items={[
                                { title: 'machine', code: 'machine', children: <MachineRMStock partGroup={partGroup} planMachines={planMachines} notifys={notifys} lineSelected={lineSelected} PrevPlanChange={PrevPlanChange} handleEvent={handleEvent} setMachinePlan={setMachinePlan} partMasters={partMasters} /> },
                                { title: 'casing', code: 'casing', children: <CasingRMStock mainplan={apsProductionPlan} /> },
                                { title: 'motor', code: 'motor', children: <NotWorking /> },
                            ].map((x, i) => {
                                return {
                                    label: <span className='capitalize'>{x.title}</span>,
                                    key: i.toString(),
                                    children: x.children,
                                };
                            })}
                        />

                    </div>
                </div>
            }

            <ToastContainer autoClose={1500} />
            <DialogEditMainPlan open={openDialogEditMainPlan} apsLoad={init} setOpen={setDialogEditMainPlan} data={planSelected} setData={setPlanSelected} planSelected={planSelected} />
            {/* <DialogConfChangeSequence open={openDialogConfSeq} setOpen={setOpenDialogConfSeq} changeSeq={handleChangeSeq} planChanged={PlanChanged} ymd={ymd} /> */}
            <DialogMachineConfChangeSeq open={openDialogMachineChangeSeq} setOpen={setOpenDialogMachineChangeSeq} handleChangeSeq={handleMachineChangeSeq} />
            <DialogEditPlanMachine open={openDialogEditMachinePlan} setOpen={setOpenDialogEditMachinePlan} MachinePlan={MachinePlan} apsLoad={init} />
            <DialogInsertPlan type={typeInsert} open={openDialogInsertPlan} setOpen={setOpenDialogInsertPlan} ymd={ymd.format('YYYYMMDD')} apsLoad={init} param={ParamInsertPlan} />
        </div >
    )
}

export default ApsSubLine