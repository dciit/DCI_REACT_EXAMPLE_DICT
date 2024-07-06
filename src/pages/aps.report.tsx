import React, { useEffect, useState } from 'react'
import { lines } from '../constants'
import moment from 'moment';
import { ApsNotify, ApsProductionPlanProps, DictMstr, EmpProps, LineProps, PropsPlanMachine } from '../interface/aps.interface';
import { API_APS_NOTIFY, API_APS_PART_GROUP, API_APS_PRODUCTION_PLAN, ApiApsGetPlanMachine } from '../service/aps.service';
import DialogEditSeq from '../components/aps.dialog.edit.seq';
import { Avatar, Box, Tab } from '@mui/material';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import ApsPlanMachineDND from '../components/aps.report.dnd.plan';
function ApsReport() {
    let dateLoop: string = '';
    const [planSelected, setPlanSelected] = useState<ApsProductionPlanProps | null>(null);
    const [modelUse, setModelUse] = useState<string>('');
    const [apsProductionPlan, setApsProductionPlan] = useState<ApsProductionPlanProps[]>([]);
    const [partGroup, setPartGroup] = useState<DictMstr[]>([]);
    const [wcno, setWcno] = useState<string>('904');
    const [notify, setNotify] = useState<ApsNotify[]>([]);
    const [openEditSeq, setOpenEditSeq] = useState<boolean>(false);
    const [groupSelected, setGroupSelected] = useState<string>('');
    const [lineSelected, setLineSelected] = useState<LineProps>(lines[0]);
    const [empProps, setEmpProps] = useState<EmpProps | null>(null);
    const [planMachines, setPlanMachines] = useState<PropsPlanMachine[]>([]);
    // const [openDialogACK,setOpenDialogACK] = useState<<
    useEffect(() => {
        init();
    }, [])
    const init = async () => {
        const ApiGetPartGroup = await API_APS_PART_GROUP();
        setPartGroup(ApiGetPartGroup);
        const ApiGetApsPlan = await API_APS_PRODUCTION_PLAN();
        setApsProductionPlan(ApiGetApsPlan);
        const ApiGetApsPlanMachine = await ApiApsGetPlanMachine({ ymd: '2024-07-06' });
        setPlanMachines(ApiGetApsPlanMachine);
        const ApiGetNotify = await API_APS_NOTIFY(wcno);
        setNotify(ApiGetNotify);
    }
    useEffect(() => {
        if (groupSelected.length > 0) {
            setOpenEditSeq(true);
        } else {
            setOpenEditSeq(false);
        }
    }, [groupSelected])
    useEffect(() => {
        if (openEditSeq == false) {
            if (empProps == null) {
                setGroupSelected('');
            }
        } else {
            setEmpProps(null);
        }
    }, [openEditSeq])


    useEffect(() => {
        console.log(planMachines)
    }, [planMachines])
    const [line, setLine] = useState('MC');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setLine(newValue);
    };
    return (
        <div className='h-full'>
            <div className='grid grid-cols-6 gap-6'>
                <div id='report-sequence-main' className='sm:col-span-2 border rounded-md bg-white  flex flex-col gap-2 w-full'>
                    <div className='bg-[#f9fafb]   border-b rounded-t-md h-[50px] flex item pl-4 items-center gap-1'>
                        <ClearAllIcon />
                        <span className='select-none'>Main Assy Sequence</span>
                    </div>
                    <div className=' overflow-auto px-6 pt-4'>
                        <table className='w-full bg-white text-[14px]'>
                            <thead className='border-b font-semibold select-none'>
                                <tr>
                                    <td className='border' colSpan={3}></td>
                                    <td className='border text-center py-2' colSpan={2}>Plan</td>
                                    <td className='border'></td>
                                </tr>
                                <tr>
                                    <td className='border py-2 text-center w-[10%]'>ลำดับ</td>
                                    <td className='border w-[35%] pl-3'>Model</td>
                                    <td className='border text-center w-[15%]'>วันที่</td>
                                    <td className='border text-center w-[10%]'>APS </td>
                                    <td className='border text-center w-[10%]'>PRD </td>
                                    <td className='border text-center w-[10%]'>#</td>
                                </tr>
                            </thead>
                            <tbody className='text-[12px]'>
                                {
                                    apsProductionPlan.map((o: ApsProductionPlanProps, i: number) => {
                                        let groupModelIsUse = apsProductionPlan.map((o: ApsProductionPlanProps) => o.partNo);
                                        groupModelIsUse = [...new Set(groupModelIsUse)];
                                        let header: boolean = false;
                                        if (dateLoop == '' || dateLoop != moment(o.apsPlanDate).format('DD/MM/YYYY')) {
                                            header = true;
                                            dateLoop = moment(o.apsPlanDate).format('DD/MM/YYYY');
                                        }
                                        let dtNow = moment().format('DD/MM/YYYY');
                                        let event = dateLoop == dtNow ? true : false;
                                        let rowInProcess = ((o.partNo != undefined && o.partNo.includes(modelUse)) && event) ? true : false;
                                        let rowStyle = rowInProcess ? 'border-dashed border-2 border-yellow-500' : 'border';
                                        return <>
                                            {
                                                header && <tr>
                                                    <td colSpan={6} className={`border-2 px-3 py-2 font-semibold ${dateLoop == dtNow ? ' border-dashed border-yellow-500 bg-yellow-50' : 'bg-[#5c5fc810] border'}`}>
                                                        <div className='flex gap-2 items-center'>
                                                            {
                                                                dateLoop == dtNow && <span className="relative flex h-3 w-3">
                                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                                                                </span>
                                                            }
                                                            <span>{dateLoop}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            }
                                            <tr key={i} className={`cursor-pointer select-none ${dateLoop != dtNow ? 'opacity-60' : 'border-dashed border-2 border-yellow-500'} ${rowInProcess && 'bg-yellow-50'}`} onClick={() => event ? setPlanSelected(o) : false}>
                                                <td className={`${rowStyle} text-center ${rowInProcess && 'bg-yellow-400  font-semibold '}`} >{o.prdSeq}</td>
                                                <td className={`${rowStyle} pl-3 ${rowInProcess && 'bg-yellow-300'} font-bold`}>{o.partNo}</td>
                                                <td className={`${rowStyle} text-center  font-semibold`}>{moment(o.apsPlanDate).format('DD/MM')}</td>
                                                <td className={`${rowStyle} text-center p-2`}>
                                                    <div className='px-[8px] pt-[3px] pb-[2px]  rounded-lg font-semibold '>{o.apsPlanQty}</div>
                                                </td>
                                                <td className={`${rowStyle} text-center p-2`}>
                                                    <div className={`px-[8px] pt-[3px] pb-[2px]  rounded-lg ${rowInProcess && 'border-dashed border-[#4caf50] border-2 bg-[#4caf5030]'} font-semibold  text-[#3f9642]`}>{o.prdPlanQty}</div>
                                                </td>
                                                <td className='border text-center'></td>
                                            </tr>
                                        </>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='sm:col-span-4 flex flex-col gap-3'>
                    <div className='flex gap-3'>
                        <div className=' w-full flex-none items-center gap-2 bg-white border  rounded-lg select-none cursor-pointer'>
                            <div id='select-line' className='flex gap-6 mb-6 h-[50px] bg-[#f9fafb] rounded-t-lg px-3  border-b'>
                                {
                                    lines.map((oLine: LineProps, i: number) => <div className='' onClick={() => setLineSelected(oLine)}>
                                        <div key={i} className={`px-4 py-3 min-w-[75px] text-center ${lineSelected.value == oLine.value ? 'text-[#4f46e5]' : 'text-gray-500'} hover:text-[#4f46e5] transition-all duration-300`}>{oLine.text}</div>
                                        <div className={`w-full border-b-2 transition-all duration-300 ${lineSelected.value == oLine.value ? 'border-[#4f46e5]' : 'border-transparent'}`}></div>
                                    </div>)
                                }
                            </div>
                            <div className=' grid sm:grid-cols-2 xl:grid-cols-2   gap-6 px-6'>
                                {
                                    partGroup.filter((x: DictMstr) => x.refCode == lineSelected.value).map((oGroup: DictMstr, iGroup: number) => {
                                        let group: string = oGroup.code;
                                        let planMachine: PropsPlanMachine[] = planMachines.filter(x => x.partGroup == group);
                                        return <div key={iGroup} className='rounded-md  drop-shadow-md border min-h-[200px] bg-white flex flex-col  gap-2'>
                                            <div id='title-group' className='bg-[#f9fafb] py-3 border-b flex gap-2 pl-4 pr-4 items-end justify-between  rounded-t-md'>
                                                <strong>{oGroup.code}</strong>
                                                {oGroup.code != oGroup.description && <span className='text-gray-500 text-[12px]'>{oGroup.description}</span>}
                                            </div>
                                            <div className='px-6 pt-3 gap-3 flex flex-col'>

                                                {
                                                    (empProps != null && Object.values(empProps).length != 0 && groupSelected != '' && groupSelected == oGroup.code) &&
                                                    <div className="relative inline-flex w-full">
                                                        <div className='flex gap-2 bg-[#f9fbfb] border border-[#4f46e5] py-2 px-3 rounded-md w-full'>
                                                            <Avatar src={empProps?.img} className='flex-none drop-shadow-lg border' />
                                                            <div className='flex  justify-between items-center grow'>
                                                                <div className='flex flex-col'>
                                                                    <strong>{empProps?.code}</strong>
                                                                    <span className='text-gray-500 text-[12px]'>{empProps?.fullName}</span>
                                                                </div>
                                                                <div className='text-[12px] text-white bg-[#4f46e5] px-3 rounded-xl py-1 '>กำลังแก้ไข</div>
                                                            </div>
                                                        </div>
                                                        <span className="flex absolute h-4 w-4 top-0 left-0 -mt-1 -ml-1">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4f46e5] opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#4f46e5]"></span>
                                                        </span>
                                                    </div>
                                                }
                                                <div className='flex justify-between '>
                                                    {
                                                        !(empProps != null && Object.values(empProps).length != 0 && groupSelected != '' && groupSelected == oGroup.code) && <>
                                                            <div className='border rounded-md pl-3 pr-4 w-fit pt-1 pb-1 text-sm flex items-center bg-[#4f46e5] text-white border-none drop-shadow-md gap-1' onClick={() => setGroupSelected(oGroup.code)}>
                                                                <ModeEditOutlineOutlinedIcon sx={{ width: '18px', height: '18px' }} />
                                                                <span>แก้ไข</span>
                                                            </div> <div className='rounded-2xl font-semibold flex items-center justify-between bg-red-400 pl-2 pr-3 py-1 gap-2 drop-shadow-md'>
                                                                <div className='bg-red-600 text-sm text-white rounded-xl pl-2 pr-2'>NEW</div>
                                                                <div className='text-white flex items-center'>
                                                                    <div className='font-light'>ไลน์ Main มีการเปลี่ยนแปลง</div>
                                                                    <PriorityHighIcon sx={{ width: '16px', height: '16px' }} />
                                                                    {/* <div>{`>`}</div> */}
                                                                </div>
                                                            </div>
                                                        </>
                                                    }

                                                </div>
                                            </div>
                                            <div className='px-6 pt-2 pb-4'>
                                                <ApsPlanMachineDND planMachine={planMachine} close={false}  partGroup = {oGroup.code}  />
                                                {
                                                    (empProps != null && Object.values(empProps).length != 0 && groupSelected != '' && groupSelected == oGroup.code) &&
                                                    <div className='mt-3 flex justify-end'>
                                                        <div className='border rounded-md w-fit px-4 py-1 bg-[#4f46e5] text-white shadow-lg'>
                                                            บันทึก
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        {/* <div id='list-line' className='pl-3 grow flex flex-col gap-1 py-2 bg-white rounded-md border'>
                            <div className='text-[12px]'>Line</div>
                            <div className='flex gap-3'>
                                {
                                    lines.map((oLine: any, iLine: number) => {
                                        return <div key={iLine} className={`border pl-3 pr-4 border-[#4f46e5] text-[#4f46e5] bg-[#4f46e510] font-semibold py-1 rounded-lg cursor-pointer select-none flex items-center gap-1`}>
                                            <CheckIcon sx={{ width: '18px', height: '18px' }} />
                                            <span>{oLine.text}</span>
                                        </div>
                                    })
                                }
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
            <DialogEditSeq open={openEditSeq} setOpen={setOpenEditSeq} empProps={empProps!} setEmpProps={setEmpProps} />
        </div>
    )
}

export default ApsReport