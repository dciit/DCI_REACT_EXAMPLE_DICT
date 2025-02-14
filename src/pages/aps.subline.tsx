//@ts-nocheck
import { useEffect, useState } from 'react'
import moment from 'moment';
import { DictMstr, PropsMain, PropsPlanMachine } from '../interface/aps.interface';
import { ApiMachineChangeSeq, APIGetMainPlan } from '../service/aps.service';
import { ToastContainer, toast } from 'react-toastify';
import DialogMachineConfChangeSeq from '../components/machine/machine.conf.change.seq';
import { Radio} from 'antd';
import SublineWIPs from '@/components/aps.subline.seq';
import APSMainSeq from '@/components/aps.main.seq';
interface PropTabSubline {
    line: string;
    process: string;
}
function ApsSubLine() {
    const [ymd] = useState<any>(moment().subtract(8, 'hours'));
    const [oMainSeq, setMainPlans] = useState<PropsMain[]>([]);
    const [partGroupSelected, setPartGroupSelected] = useState<DictMstr | null>(null);
    const [openEditSeq, setOpenEditSeq] = useState<boolean>(false);
    const [load, setLoad] = useState<boolean>(true);
    const [planSelected, setPlanSelected] = useState<PropsMain | null>(null);
    const [MachinePlan, setMachinePlan] = useState<PropsPlanMachine | null>(null);
    const [openDialogInsertPlan, setOpenDialogInsertPlan] = useState<boolean>(false);
    const [PrevPlanChange, setPrevPlanChange] = useState<PropsPlanMachine | null>(null);
    const [ToPlanChange, setToPlanChange] = useState<PropsPlanMachine | null>(null);
    const [openDialogMachineChangeSeq, setOpenDialogMachineChangeSeq] = useState<boolean>(false);
    const [openDialogEditMachinePlan] = useState<boolean>(false);
    const [openDialogEditMainPlan, setDialogEditMainPlan] = useState<boolean>(false);
    const [typeInsert, setTypeInsert] = useState<string>('');
    const [tabs, setTabs] = useState<PropTabSubline[]>([]);
    const [tabSelected, setTabSelected] = useState<string>('');
    const [processSelected, setProcessSelected] = useState<string>('');
    const init = async () => {
        const res = await APIGetMainPlan({
            paramDate: ymd.format('YYYYMMDD'),
            paramWCNO: '904'
        });
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
        if (openEditSeq == false) {
            setPartGroupSelected(null);
        }
    }, [openEditSeq]);

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
        if (openDialogInsertPlan == false) {
            setTypeInsert('');
        }
    }, [openDialogInsertPlan])
    return (
        <>
            {/* <Spin spinning={load} tip='กำลังโหลดข้อมูล'> */}
            <div className='flex gap-3 '>
                <APSMainSeq />
                <div className='sm:w-[100%] md:w-[70%] flex flex-col gap-3 rounded-lg  bg-gradient-to-r from-green-50 to-teal-50 p-4 border '>
                    <div className='flex flex-col gap-3'>
                        <div className='flex flex-col'>
                            <div className='flex items-center gap-3'>
                                <strong>SUBLINE SEQUENCE AND WIP CONTROL</strong>
                            </div>
                            <small className='text-teal-700'>แผนการผลิตประจำซับไลน์และจำนวนคงเหลือของวัตถุดิบ</small>
                        </div>
                        {
                            tabSelected != null && <SublineWIPs subline={processSelected} setSubline={setProcessSelected} processs={tabs.filter(x => x.line == tabSelected).map(o => o.process)} line={tabSelected} oMainSeq={oMainSeq} />
                        }
                    </div>
                </div>
            </div>
            <ToastContainer autoClose={1500} />
            <DialogMachineConfChangeSeq open={openDialogMachineChangeSeq} setOpen={setOpenDialogMachineChangeSeq} handleChangeSeq={handleMachineChangeSeq} />
        </>
    )
}

export default ApsSubLine