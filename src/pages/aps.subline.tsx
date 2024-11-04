//@ts-nocheck
import { Fragment, useEffect, useRef, useState } from 'react'
import moment from 'moment';
import { ApsNotify, DictMstr, LineProps, ParamInsertPlan, PropsMain, PropsPartMaster, PropsPlanMachine } from '../interface/aps.interface';
import { ApiGetPartGroupMaster, ApiApsGetPlanMachine, ApiGetNotify, ApiGetPartMaster, ApiMachineChangeSeq, ApiGetMainPlan, APIChargeMainSeq } from '../service/aps.service';
// import DialogEditSeq from '../components/aps.dialog.edit.seq';
import { CircularProgress, IconButton } from '@mui/material';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
// import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
// import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
// import EditIcon from '@mui/icons-material/Edit';
import { ToastContainer, toast } from 'react-toastify';
import DialogEditMainPlan from '../components/aps.dialog.edit.main.plan';
// import ButtonMtr from '../components/button.mtr';
// import DialogInsertPlan from '../components/aps.dialog.insert.plan';
import AddIcon from '@mui/icons-material/Add';
import DialogMachineConfChangeSeq from '../components/machine/machine.conf.change.seq';
import DialogEditPlanMachine from '../components/machine/machine.edit';
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined';
import ListPlanStatus from '../components/list.status';
import { Alert, Badge, Button, Card, Drawer, Flex, FloatButton, notification, Popconfirm, Radio, Result, Space, Spin, Tabs, Tooltip } from 'antd';
// import CasingRMStock from '@/components/casing.rm.stock';
// import NotWorking from '@/components/notworking';
// import MachineRMStock from '@/components/machine.rm.stock';
import EditOutlined from '@mui/icons-material/EditOutlined';
// import CaretDownOutlined from '@ant-design/icons/lib/icons/CaretDownOutlined';
import { RetweetOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { CloseOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import SublineWIPs from '@/components/casing.rm.stock';
import APSMainSequence from '@/components/aps.main.seq';
type NotificationType = 'success' | 'info' | 'warning' | 'error';
interface PropTabSubline {
    line: string;
    process: string;
}
function ApsSubLine() {
    const redux = useSelector((state: any) => state.redux);
    const empcode = (typeof redux.empcode != 'undefined') ? redux.empcode : '';
    const [TextAreaChangeSeq, setTextAreaChageSeq] = useState<string>('');
    let dateLoop: string = '';
    const [dev] = useState<boolean>(false);
    // const [ymd, _] = useState<any>(moment());
    const dtNow = moment().subtract(8, 'hour');
    // const [modelUse] = useState<string>('');
    const [apsProductionPlan, setMainPlans] = useState<PropsMain[]>([]);
    // const [partGroup, setPartGroup] = useState<DictMstr[]>([]);
    const [partGroupSelected, setPartGroupSelected] = useState<DictMstr | null>(null);
    const [openEditSeq, setOpenEditSeq] = useState<boolean>(false);
    // const [planMachines, setPlanMachines] = useState<PropsPlanMachine[]>([]);
    // const [partMasters, setPartMasters] = useState<PropsPartMaster[]>([]);
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
    // const [notifys, setNotifys] = useState<ApsNotify[]>([]);
    const [Changing, setChanging] = useState<any>({
        change: false,
        prdPlanCode: ''
    });
    // const [ParamInsertPlan, setParamInsertPlan] = useState<ParamInsertPlan>({
    //     group: '',
    //     seq: 0,
    //     type: ''
    // });
    const [tabs, setTabs] = useState<PropTabSubline[]>([]);
    const [tabSelected, setTabSelected] = useState<string>('');
    const [processSelected, setProcessSelected] = useState<string>('');
    const [changeSeq, setChangeSeq] = useState<string>('');
    // useEffect(() => {
    //     const intervalCall = setInterval(() => {
    //         dateLoop = '';
    //         init();
    //     }, intervalTime);
    //     return () => {
    //         clearInterval(intervalCall);
    //     }
    // }, [])
    const init = async () => {
        setLoad(true);
        // setPartGroup([]);
        // let partMaster: PropsPartMaster[] = await ApiGetPartMaster();
        // setPartMasters(partMaster);
        // const ResGetPartGroupMaster = await ApiGetPartGroupMaster();
        // setPartGroup(ResGetPartGroupMaster);
        console.log('subline load')
        const RESGetMainPlan = await ApiGetMainPlan({
            paramDate: dtNow.format('YYYYMMDD'),
            paramWCNO: '904'
        });
        console.log(RESGetMainPlan)
        setMainPlans(RESGetMainPlan.main);
        setTabs(RESGetMainPlan.masterSubline);
        // const ApiGetApsPlanMachine = await ApiApsGetPlanMachine({ ymd: ymd.format('YYYYMMDD') });
        // setPlanMachines(ApiGetApsPlanMachine);
        // const ResGetNotify = await ApiGetNotify({
        //     wcno: '904', date: ymd.format('YYYYMMDD')
        // });
        // setNotifys(ResGetNotify);
        setLoad(false);
    }
    useEffect(() => {
        init();
    }, []);

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
        setChanging({
            change: false,
            prdPlanCode: ''
        })
    }, [changeSeq])

    useEffect(() => {
        if (openEditSeq == false) {
            setPartGroupSelected(null);
        }
    }, [openEditSeq]);

    useEffect(() => {
        if (planSelected != null && Object.keys(planSelected).length > 0) {
            setDialogEditMainPlan(true);
            setChangeSeq('');
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

    // const handleEvent = async (change: boolean, item: PropsPlanMachine) => {
    //     if (change) {
    //         setPrevPlanChange(null);
    //         setToPlanChange(null);
    //     } else {
    //         if (PrevPlanChange != null && PrevPlanChange?.prdPlanCode != item.prdPlanCode) {
    //             if (PrevPlanChange?.partGroup != item?.partGroup) {
    //                 toast.error('ไม่สามารถเปลี่ยนลำดับแผนข้ามกลุ่มได้')
    //                 setToPlanChange(null);
    //             } else {
    //                 setToPlanChange({ ...item })
    //             }
    //         } else {
    //             setPrevPlanChange({ ...item })
    //         }
    //     }
    // }

    useEffect(() => {
        if (tabs.length > 0) {
            var processOfLine = tabs.filter(x => x.line == tabSelected);
            if (processOfLine.length) {
                setProcessSelected(processOfLine[0].process);
            }
        }
    }, [tabSelected])

    useEffect(() => {
        if (tabs.length && tabSelected == '') {
            setTabSelected(tabs[0].line)
        }
    }, [tabs])

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

    // useEffect(() => {
    //     if (ParamInsertPlan.type != '') {
    //         setOpenDialogInsertPlan(true);
    //     }
    // }, [ParamInsertPlan])
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
    // const handleConfirm = () => {
    //     // Do nothing to keep the Popconfirm open on "Confirm"
    //     console.log('Confirm button clicked');
    // };
    // const [open, setOpen] = useState(false);

    // const handleCancel = () => {
    //     // Close the Popconfirm only on "Cancel"
    //     setOpen(false);
    // };

    const handleChangeSeq = async (prdPlanCode: string) => {
        if (TextAreaChangeSeq == '') {
            alert('กรุณาระบุหมายเหตุการเปลี่ยนแปลง')
        } else {
            let RESChargeMainSeq = await APIChargeMainSeq({ fPrdPlanCode: Changing.prdPlanCode, tPrdPlanCode: prdPlanCode, empcode: empcode });
            console.log(RESChargeMainSeq)
            try {
                if (RESChargeMainSeq.status) {
                    openNotificationWithIcon('success', 'เปลี่ยนลำดับสำเร็จแล้ว');
                    setChanging({ ...Changing, prdPlanCode: '', change: false });
                } else {
                    openNotificationWithIcon('error', `เปลี่ยนแผนลำดับไม่สำเร็จ ${RESChargeMainSeq.message}`);
                }
            } catch (e: any) {
                alert('error : ' + e.message);
            }
            init();
        }
    }
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type: NotificationType, message: string) => {
        api[type]({
            message: 'แจ้งเตือน',
            description:
                message,
        });
    };

    return (
        <Spin spinning={load} tip='กำลังโหลดข้อมูล'>
            <div className='grid grid-cols-1 gap-3 '>
                {contextHolder}
                <div className='grid sm:grid-cols-6 md:grid-cols-6 xl:grid-cols-6 gap-4'>
                    <APSMainSequence mainSeq={apsProductionPlan} loadMain={load} />
                    <div className='sm:col-span-6 md:col-span-6 xl:col-span-4 flex flex-col gap-3 rounded-lg  bg-gradient-to-r from-green-50 to-teal-50 p-4 border '>
                        <div className='flex flex-col gap-3'>
                            <div className='flex flex-col'>
                                <div className='flex items-center gap-3'>
                                    <strong>Subline sequence and WIP raw material</strong>
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3b82f6] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#3b82f6]"></span>
                                    </span>
                                </div>
                                <small className='text-teal-700'>แผนการผลิตประจำซับไลน์และจำนวนคงเหลือของวัตถุดิบ</small>
                            </div>
                            <Radio.Group value={tabSelected} onChange={(e) => setTabSelected(e.target.value)}>
                                {
                                    Array.from(new Set(tabs.map(x => x.line))).map(o => <Radio.Button value={o}>{o}</Radio.Button>)
                                }
                            </Radio.Group>
                            {
                                tabSelected != null && <SublineWIPs subline={processSelected} setSubline={setProcessSelected} processs={tabs.filter(x => x.line == tabSelected).map(o => o.process)} line={tabSelected} mainplan={apsProductionPlan} />
                            }
                        </div>
                    </div>
                </div>
                <ToastContainer autoClose={1500} />
                <DialogEditMainPlan open={openDialogEditMainPlan} apsLoad={init} setOpen={setDialogEditMainPlan} data={planSelected} setData={setPlanSelected} planSelected={planSelected} />
                {/* <DialogConfChangeSequence open={openDialogConfSeq} setOpen={setOpenDialogConfSeq} changeSeq={handleChangeSeq} planChanged={PlanChanged} ymd={ymd} /> */}
                <DialogMachineConfChangeSeq open={openDialogMachineChangeSeq} setOpen={setOpenDialogMachineChangeSeq} handleChangeSeq={handleMachineChangeSeq} />
                <DialogEditPlanMachine open={openDialogEditMachinePlan} setOpen={setOpenDialogEditMachinePlan} MachinePlan={MachinePlan} apsLoad={init} />
                {/* <DialogInsertPlan type={typeInsert} open={openDialogInsertPlan} setOpen={setOpenDialogInsertPlan} ymd={ymd.format('YYYYMMDD')} apsLoad={init} param={ParamInsertPlan} /> */}
            </div >
        </Spin>
    )
}

export default ApsSubLine