import { useEffect, useState } from 'react'
import { intervalTime, lines } from '../constants'
import moment from 'moment';
import { ApsNotify, DictMstr, LineProps, ParamInsertPlan, PropsMain, PropsPartMaster, PropsPlanMachine } from '../interface/aps.interface';
import { ApiGetPartGroupMaster, API_APS_PRODUCTION_PLAN, ApiApsGetPlanMachine, ApiGetNotify, ApiGetPartMaster, ApiMachineChangeSeq } from '../service/aps.service';
// import DialogEditSeq from '../components/aps.dialog.edit.seq';
import { CircularProgress, IconButton } from '@mui/material';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { ToastContainer, toast } from 'react-toastify';
import DialogEditMainPlan from '../components/aps.dialog.edit.main.plan';
import ButtonMtr from '../components/button.mtr';
import DialogInsertPlan from '../components/aps.dialog.insert.plan';
import AddIcon from '@mui/icons-material/Add';
import DialogMachineConfChangeSeq from '../components/machine/machine.conf.change.seq';
import DialogEditPlanMachine from '../components/machine/machine.edit';
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined';
import ListPlanStatus from '../components/list.status';
function ApsSubLine() {
    let dateLoop: string = '';
    const [ymd, setYmd] = useState<any>(moment());
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
            getData();
        }, intervalTime);
        return () => {
            clearInterval(intervalCall);
        }
    }, [])

    const getData = async () => {
        let partMaster: PropsPartMaster[] = await ApiGetPartMaster();
        setPartMasters(partMaster);
        const ResGetPartGroupMaster = await ApiGetPartGroupMaster();
        setPartGroup(ResGetPartGroupMaster);
        const ApiGetApsPlan = await API_APS_PRODUCTION_PLAN(ymd.format('YYYYMMDD'));
        setApsProductionPlan(ApiGetApsPlan);
        const ApiGetApsPlanMachine = await ApiApsGetPlanMachine({ ymd: ymd.format('YYYYMMDD') });
        setPlanMachines(ApiGetApsPlanMachine);
        const ResGetNotify = await ApiGetNotify({
            wcno: '904', date: ymd.format('YYYYMMDD')
        });
        setNotifys(ResGetNotify);
    }
    // const [openDialogACK,setOpenDialogACK] = useState<<
    // useEffect(() => {
    //     init();
    // }, [])
    const init = async () => {
        setPartGroup([]);
        setLoad(true);
        let partMaster: PropsPartMaster[] = await ApiGetPartMaster();
        setPartMasters(partMaster);
        const ResGetPartGroupMaster = await ApiGetPartGroupMaster();
        setPartGroup(ResGetPartGroupMaster);
        const ApiGetApsPlan = await API_APS_PRODUCTION_PLAN(ymd.format('YYYYMMDD'));
        setApsProductionPlan(ApiGetApsPlan);
        const ApiGetApsPlanMachine = await ApiApsGetPlanMachine({ ymd: ymd.format('YYYYMMDD') });
        console.log(ApiGetApsPlanMachine)
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

    // useEffect(() => {
    //     if (openDialogConfSeq) {

    //     } else {
    //         setApsProductionPlan([...apsProductionPlan])
    //     }
    // }, [openDialogConfSeq])

    // useEffect(() => {
    //     if (!openDialogConfSeq) {
    //         setApsProductionPlan([...apsProductionPlan]);
    //     }
    // }, [openDialogConfSeq])
    // const handleOnDragEnd = (result: DropResult) => {
    //     if (!result.destination) return;
    //     const newItems = Array.from(apsProductionPlan);
    //     const [reorderedItem] = newItems.splice(result.source.index, 1);
    //     newItems.splice(result.destination.index, 0, reorderedItem);
    //     // setPlanChanged();
    //     console.log(newItems.map((item, index) => ({ ...item, prdSeq: (moment(item.apsPlanDate).format(dateFormat) == ymd.format(dateFormat) ? index + 1 : item.prdSeq)?.toString() })))
    //     setOpenDialogConfSeq(true);
    // };
    // const handleChangeSeq = async () => {
    //     setApsProductionPlan([...PlanChanged]);
    // }

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
            console.log(PrevPlanChange)
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

    return (
        <div className='grid grid-cols-1 gap-6 p-3'>
            <div className='grid sm:grid-cols-6 md:grid-cols-6 xl:grid-cols-6 gap-6'>
                <div className='sm:col-span-6 '>
                    <div className='flex  gap-2 bg-white rounded-lg border px-3 pt-[6px] pb-[6px] shadow-sm  items-center justify-center w-fit'>
                        <div className='cursor-pointer select-none  rounded-full transition-all duration-300' onClick={() => setYmd(moment(ymd.format('YYYYMMDD')).subtract(1, 'days'))}><KeyboardArrowLeftOutlinedIcon /></div>
                        <div className='select-none font-semibold'>{ymd.format('DD/MM/YYYY').toUpperCase()}</div>
                        <div className='cursor-pointer select-none  rounded-full transition-all duration-300' onClick={() => setYmd(moment(ymd.format('YYYYMMDD')).add(1, 'days'))}><KeyboardArrowRightOutlinedIcon /></div>
                    </div>
                </div>
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
                    <div className=' overflow-auto px-6 py-4 grid grid-cols-1 gap-3'>
                        {/* let notify = notifys.filter((x: ApsNotify) => x.subLine == group && x.lineType == 'MAIN').length; */}
                        <ListPlanStatus />
                        <table className='w-full bg-white text-[14px] shadow-md' id='tbMain'>
                            <thead className='border-b font-semibold select-none bg-[#F9FAFB]'>
                                <tr>
                                    <td className='border py-1 text-center w-[10%]' rowSpan={2}>ลำดับ</td>
                                    <td className='border w-[35%] pl-3' rowSpan={2}>Model</td>
                                    <td className='border text-center' colSpan={2}>Plan</td>
                                    <td className='border text-center w-[10%]' rowSpan={2}>#</td>
                                </tr>
                                <tr>
                                    <td className='border text-center w-[10%] py-1'>APS </td>
                                    <td className='border text-center w-[10%]'>PRD </td>
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
                                            // let prdQty: number = (o.prdPlanQty != undefined) ? o.prdPlanQty : 0;
                                            let noPlan: boolean = o.prdPlanQty == 0 ? true : false;
                                            if (LoopDate == '' || LoopDate != moment(o.apsPlanDate).format('DD/MM/YYYY')) {
                                                LoopDate = moment(o.apsPlanDate).format('DD/MM/YYYY');
                                                DrawDate = true;
                                            } else {
                                                DrawDate = false;
                                            }
                                            let isDate: boolean = moment(o.apsPlanDate).format('DD/MM/YYYY') == moment().format('DD/MM/YYYY') ? true : false;
                                            let planStatus: string = o.statusPlan;
                                            planStatus = planStatus == '' ? 'wait' : planStatus;
                                            return <>
                                                {
                                                    DrawDate == true && <tr key={i} className={`cursor-pointer select-none ${noPlan && 'opacity-50'}`} >
                                                        <td colSpan={6} className='border py-2 pl-3'><strong>{LoopDate}</strong></td>
                                                    </tr>
                                                }
                                                <tr key={i} className={`${isDate == true ? (planStatus == 'wait' ? 'cursor-pointer' : (planStatus == 'process' ? 'bg-[#FFA500]/10' : '')) : 'cursor-not-allowed opacity-40'} select-none ${noPlan && 'opacity-50'}`} >
                                                    <td className={`border text-center ${planStatus == 'wait' ? 'bg-[#F9FAFB]' : (planStatus == 'process' ? 'bg-[#FFA500] text-black font-semibold' : '')} font-semibold`} >
                                                        {
                                                            isDate == true ? o.prdSeq : <RemoveCircleOutlinedIcon className='text-[#ddd]' />
                                                        }
                                                    </td>
                                                    <td className={` pl-3  border`}>
                                                        <div className='pt-[2px] pb-[3px]'>
                                                            <p className='font-bold'>{o.partNo}</p>
                                                            <div className='flex items-center gap-1'>
                                                                <strong>({o.modelCode})</strong>
                                                                {
                                                                    o.prdPlanQty == 0 ? <div className='px-3 bg-red-600 text-white rounded-full w-fit shadow-md'>ยกเลิก</div> : (planStatus == 'wait' ? <div className='px-3 bg-gray-400 text-white rounded-full w-fit shadow-md'>รอผลิต</div> : (planStatus == 'process' ? <div className='px-3 bg-[#FFA500] text-black font-semibold rounded-full w-fit'>กำลังผลิต</div> : <div className='px-3 bg-green-700 text-white rounded-full w-fit shadow-md'>ผลิตแล้ว</div>))
                                                                }
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className={`border text-end pr-[4px] text-[14px] font-semibold text-blue-700`}>{o.apsPlanQty}</td>
                                                    <td className={`border text-end pr-[4px]`}>
                                                        <div className={`pr-[4px] pt-[3px] pb-[2px]  rounded-lg font-semibold text-[14px] ${(o.prdPlanQty != undefined && o.prdPlanQty > 0) ? 'text-green-600 drop-shadow-lg' : 'text-red-500'}`}>{o.prdPlanQty}</div>
                                                    </td>

                                                    <td className='border text-center bg-[#F9FAFB]'>
                                                        {
                                                            isDate == true && <IconButton onClick={() => event ? setPlanSelected(o) : false}>
                                                                <EditIcon className='text-gray-600' sx={{ fontSize: '18px' }} />
                                                            </IconButton>
                                                        }
                                                    </td>
                                                </tr>
                                            </>
                                        })
                                }
                            </tbody>
                        </table>
                        {
                            !load && <div className='text-center pb-3' onClick={() => setParamInsertPlan({
                                type: 'MAIN',
                                group: '',
                                seq: 0
                            })}>
                                <ButtonMtr text='เพิ่มแผนผลิต' event='' icon={<AddIcon sx={{ width: '20px', height: '20px' }} />} />
                            </div>
                        }
                    </div>
                </div>
                <div className='sm:col-span-6 md:col-span-6 xl:col-span-4 flex flex-col gap-3'>
                    <div className='flex gap-3'>
                        <div className=' w-full flex-none items-center gap-2 bg-white border  rounded-lg select-none cursor-pointer'>
                            <div id='select-line' className='flex gap-6 mb-6 h-[50px] bg-[#f9fafb] rounded-t-lg px-3  border-b'>
                                {
                                    lines.map((oLine: LineProps, i: number) => <div key={i} onClick={() => setLineSelected(oLine)}>
                                        <div key={i} className={`px-4 py-3 min-w-[75px] text-center ${lineSelected.value == oLine.value ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-500 transition-all duration-300`}>{oLine.text}</div>
                                        <div className={`w-full border-b-2 transition-all duration-300 ${lineSelected.value == oLine.value ? 'border-blue-500' : 'border-transparent'}`}></div>
                                    </div>)
                                }
                            </div>
                            <div className=' grid sm:grid-cols-1 xl:grid-cols-2   gap-6 px-6'>
                                {
                                    partGroup.length == 0 ? <div className='col-span-2 pb-6 text-center'>ไม่พบข้อมูล</div> : partGroup.filter((x: DictMstr) => x.refCode == lineSelected.value && x.code != 'OS').map((oGroup: DictMstr, iGroup: number) => {
                                        let group: string = oGroup.code;
                                        let planMachine: PropsPlanMachine[] = [];
                                        if (group == 'FS' || group == 'OS') {
                                            planMachine = planMachines.filter(x => x.partGroup == 'FS' || x.partGroup == 'OS');
                                        } else {
                                            planMachine = planMachines.filter(x => x.partGroup == group);
                                        }
                                        let notify = notifys.filter((x: ApsNotify) => x.subLine == group && x.lineType == 'MAIN').length;
                                        let oPartGroup: string | null = oGroup.refCode;
                                        group = group == 'FS' ? 'FS/OS' : group;
                                        return <div key={iGroup} className='   bg-white flex flex-col  gap-2'>
                                            <table className={`text-[12px] w-full select-none  shadow-md ${notify ? '' : ''}`} id='tbSubline'>
                                                <thead className='font-semibold '>
                                                    <tr>
                                                        <td className='border py-2 pr-3' colSpan={8}>
                                                            <div className='flex  justify-between items-center'>
                                                                <div className='px-3 text-[16px] flex items-center gap-2'>

                                                                    {
                                                                        group.length <= 3 ? <div className={`flex h-10 w-10 items-center justify-center rounded-full ${notify ? 'bg-red-500' : 'bg-blue-500'}`}>
                                                                            <p className='text-white'>{group}</p>
                                                                        </div> : <div className={`${notify ? 'bg-red-500' : 'bg-blue-500'} px-3 rounded-xl py-1 text-white`}>
                                                                            {group}
                                                                        </div>
                                                                    }
                                                                    <div className='flex flex-col'>
                                                                        {group.length <= 3 && <span className={`font-bold ${notify ? 'text-red-500' : 'text-blue-500'}`}>{oGroup.description}</span>}
                                                                        <div className='flex gap-2 items-center'>
                                                                            {notify > 0 && <>
                                                                                <small className='text-red-500 '>MAIN มีการเปลี่ยนแผน</small>
                                                                                <span className="relative flex h-3 w-3">
                                                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                                                </span>
                                                                            </>}

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='bg-blue-500 px-3 hover:scale-105 transition-all duration-150 py-1 flex  items-center h-fit text-white rounded-md text-center shadow-md font-light' onClick={() => setParamInsertPlan({
                                                                    type: 'SUBLINE',
                                                                    group: group,
                                                                    seq: planMachine.length + 1
                                                                })}>
                                                                    <AddIcon sx={{ width: '18px', height: '18px' }} />
                                                                    <span>เพิ่มแผนผลิต</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className={`${notify && 'border-gray-'} border text-center w-[10%]`} rowSpan={2}>ลำดับ</td>
                                                        <td className={`${notify && 'border-gray-'} border text-center w-[20%]`} rowSpan={2}>Model</td>
                                                        <td className={`${notify && 'border-gray-'} border text-center py-2 w-[20%]`} colSpan={2}>Plan</td>
                                                        <td className={`${notify && 'border-gray-'} border text-center w-[10%]`} rowSpan={2}>Result</td>
                                                        <td className={`${notify && 'border-gray-'} border text-center w-[20%]`} colSpan={2}>Stock</td>
                                                        <td className={`${notify && 'border-gray-'} border text-center w-[7.5%]`} rowSpan={2}>#</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border text-center py-2 w-[7.5%]">APS</td>
                                                        <td className="border text-center w-[7.5%]">PRD</td>
                                                        <td className="border text-center bg-orange-200">{oPartGroup == 'MC' ? 'M/C' : (oPartGroup == 'MOTOR' ? 'MOTOR' : 'CASING')}</td>
                                                        <td className="border text-center bg-yellow-200">Main</td>
                                                    </tr>
                                                </thead>
                                                <tbody >
                                                    {
                                                        (planMachine != null && planMachine.length) ? planMachine.map((item: PropsPlanMachine, i: number) => {
                                                            let eventChange: boolean = (PrevPlanChange != null && PrevPlanChange.prdPlanCode == item.prdPlanCode);
                                                            let styleChange: string = eventChange ? 'border-2 border-dashed border-blue-500' : '';
                                                            let production: boolean = item.prdPlanQty > 0 ? true : false;
                                                            if (item.partGroup == 'OS') {
                                                                item.partGroup = 'FS';
                                                            }
                                                            return <tr key={i} className={`${production == false && 'opacity-50'} ${eventChange && 'animated-background-2 border-dashed border-blue-500  bg-gradient-to-l from-white via-blue-50 to-blue-200'}`}
                                                            >
                                                                <td className={` text-center py-2 font-semibold border ${styleChange}`} onClick={() => handleEvent(eventChange, item)}>
                                                                    <span>{item.prdSeq}</span>
                                                                </td>
                                                                <td className={`font-semibold  border ${styleChange}`} onClick={() => handleEvent(eventChange, item)}>
                                                                    <div className=' flex flex-col '>
                                                                        <div className='pl-[4px] text-blue-600 font-semibold'>{(partMasters.filter(x => x.partno == item.partNo).length ? partMasters.filter(x => x.partno == item.partNo)[0].model_common : '')}</div>
                                                                        <div className='pl-[4px] text-[12px]'>{item.partNo}</div>
                                                                        {
                                                                            production == false && <div className=' pl-[8px] bg-red-500 text-white  w-full font-light'>ไม่ผลิต</div>
                                                                        }
                                                                    </div>
                                                                </td>
                                                                <td className={`text-[14px] border text-end pr-[4px] font-semibold ${styleChange}`} onClick={() => handleEvent(eventChange, item)}>{item.apsPlanQty.toLocaleString('en')}</td>
                                                                <td className={`text-[14px] border text-end pr-[4px]  font-semibold ${styleChange} ${item.prdPlanQty > 0 ? 'text-green-600' : 'text-red-500'}`} onClick={() => handleEvent(eventChange, item)}>{item.prdPlanQty.toLocaleString('en')}</td>
                                                                <td className={`border text-right pr-[4px] ${styleChange} ${(typeof item.result != 'undefined' && item.result > 0) && 'text-green-700 font-bold bg-green-50'}`} onClick={() => handleEvent(eventChange, item)}>{(typeof item.result != 'undefined' && item.result > 0) ? item.result.toLocaleString('en') : '-'}</td>
                                                                <td className={`  border text-right pr-[4px] font-semibold ${styleChange}`} onClick={() => handleEvent(eventChange, item)}>{item.stockMachine > 0 ? item.stockMachine.toLocaleString('en') : '-'}</td>
                                                                <td className={` border text-right pr-[4px] font-semibold ${styleChange}`} onClick={() => handleEvent(eventChange, item)}>{item.stockMain > 0 ? item.stockMain.toLocaleString('en') : '-'}</td>
                                                                <td className={`border text-center ${styleChange}`}>
                                                                    {
                                                                        eventChange ? <ChangeCircleIcon className='animate-spin text-blue-600' /> : <IconButton onClick={() => setMachinePlan(item)}>
                                                                            <EditIcon className='text-gray-600 ' sx={{ width: '20px', height: '20px' }} />
                                                                        </IconButton>
                                                                    }

                                                                </td>
                                                            </tr>
                                                        }
                                                        ) : <tr>
                                                            <td className='border py-3 text-center font-semibold' colSpan={8}>ไม่พบข้อมูล</td>
                                                        </tr>
                                                    }
                                                </tbody>
                                            </table>

                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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