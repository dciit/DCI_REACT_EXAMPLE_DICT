import React, { ChangeEvent, useEffect, useState } from 'react'
import { lines } from '../constants'
import moment from 'moment';
import { ApsNotify, ApsProductionPlanProps, DictMstr, EmpProps, LineProps, PropsPartMaster, PropsPlanMachine } from '../interface/aps.interface';
import { API_APS_NOTIFY, API_APS_PART_GROUP, API_APS_PRODUCTION_PLAN, ApiApsGetPlanMachine, ApiGetPartMaster } from '../service/aps.service';
import DialogEditSeq from '../components/aps.dialog.edit.seq';
import { Avatar, Box, CircularProgress, Tab } from '@mui/material';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { ToastContainer } from 'react-toastify';
function ApsPlan() {
    let dateLoop: string = '';
    const [ymd, setYmd] = useState<any>(moment());
    const [planSelected, setPlanSelected] = useState<ApsProductionPlanProps | null>(null);
    const [modelUse, setModelUse] = useState<string>('');
    const [apsProductionPlan, setApsProductionPlan] = useState<ApsProductionPlanProps[]>([]);
    const [partGroup, setPartGroup] = useState<DictMstr[]>([]);
    const [partGroupSelected, setPartGroupSelected] = useState<DictMstr | null>(null);
    const [wcno, setWcno] = useState<string>('904');
    const [notify, setNotify] = useState<ApsNotify[]>([]);
    const [openEditSeq, setOpenEditSeq] = useState<boolean>(false);
    const [groupSelected, setGroupSelected] = useState<string>('');
    const [lineSelected, setLineSelected] = useState<LineProps>(lines[0]);
    const [empProps, setEmpProps] = useState<EmpProps | null>(null);
    const [planMachines, setPlanMachines] = useState<PropsPlanMachine[]>([]);
    const [partMasters, setPartMasters] = useState<PropsPartMaster[]>([]);
    const [load, setLoad] = useState<boolean>(true);
    // const [openDialogACK,setOpenDialogACK] = useState<<
    useEffect(() => {
        init();
    }, [])
    const init = async () => {
        setLoad(true);
        let partMaster: PropsPartMaster[] = await ApiGetPartMaster();
        setPartMasters(partMaster);
        const ApiGetPartGroup = await API_APS_PART_GROUP();
        console.table(ApiGetPartGroup)
        setPartGroup(ApiGetPartGroup);
        const ApiGetApsPlan = await API_APS_PRODUCTION_PLAN();
        setApsProductionPlan(ApiGetApsPlan);
        const ApiGetApsPlanMachine = await ApiApsGetPlanMachine({ ymd: ymd.format('YYYYMMDD') });
        setPlanMachines(ApiGetApsPlanMachine);
        const ApiGetNotify = await API_APS_NOTIFY(wcno);
        setNotify(ApiGetNotify);
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
        if (openEditSeq == false) {
            setPartGroupSelected(null);
            if (empProps == null) {
                setGroupSelected('');
            }
        } else {
            setEmpProps(null);
        }
    }, [openEditSeq])
    return (
        <div className='h-full'>
            <div className='grid grid-cols-6 gap-6'>
                <div id='report-sequence-main' className='sm:col-span-2 border rounded-md bg-white  flex flex-col gap-2 w-full '>
                    <div className='bg-[#f9fafb]   border-b rounded-t-md h-[50px] flex item pl-4 items-center gap-1'>
                        <ClearAllIcon />
                        <span className='select-none'>Main Assy Sequence</span>
                    </div>
                    <div className=' overflow-auto px-6 py-4 grid grid-cols-1 gap-3'>
                        <div className='flex gap-3 items-center'>
                            <span>วันที่</span>
                            <input type="date" className='border rounded-md px-3 py-1 focus:outline-none hover:outline-none' value={ymd.format('YYYY-MM-DD')} onChange={(e: ChangeEvent<HTMLInputElement>) => setYmd(moment(e.target.value))} />
                            <button className='shadow-md px-4 py-1 text-white bg-[#4f46e5] rounded-lg'>ค้นหา</button>
                        </div>
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
                                    load ? <tr><td colSpan={6} className='border'><div className='flex w-full items-center flex-col p-6 gap-2'><CircularProgress sx={{ color: '#4f46e5' }} /><span className='text-[14px]'>กำลังโหลดข้อมูล</span></div></td></tr> : apsProductionPlan.length == 0 ? <tr><td colSpan={6} className='border py-2 text-center text-[14px] '>ไม่พบข้อมูล</td></tr> :
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
                                    partGroup.length == 0 ? <div className='col-span-2 pb-6 text-center'>ไม่พบข้อมูล</div> : partGroup.filter((x: DictMstr) => x.refCode == lineSelected.value).map((oGroup: DictMstr, iGroup: number) => {
                                        let group: string = oGroup.code;
                                        let planMachine: PropsPlanMachine[] = planMachines.filter(x => x.partGroup == group);
                                        return <div key={iGroup} className='rounded-md  drop-shadow-md border min-h-[200px] bg-white flex flex-col  gap-2 pb-3'>
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
                                                <div className='flex justify-between'>
                                                    {
                                                        !(empProps != null && Object.values(empProps).length != 0 && groupSelected != '' && groupSelected == oGroup.code) && <>
                                                            <div className='border rounded-md pl-3 pr-4 w-fit pt-1 pb-1 text-sm flex items-center bg-[#4f46e5] text-white border-none drop-shadow-md gap-1' onClick={() => {
                                                                setPartGroupSelected(oGroup)
                                                            }}>
                                                                <ModeEditOutlineOutlinedIcon sx={{ width: '18px', height: '18px' }} />
                                                                <span>แก้ไข</span>
                                                            </div>
                                                            {
                                                                notify.filter(x => x.subLine == oGroup.code).length ? <div className='rounded-2xl font-semibold flex items-center justify-between bg-red-400 pl-2 pr-3 py-1 gap-2 drop-shadow-md'>
                                                                    <div className='bg-red-600 text-sm text-white rounded-xl pl-2 pr-2'>NEW</div>
                                                                    <div className='text-white flex items-center'>
                                                                        <div className='font-light'>ไลน์ Main มีการเปลี่ยนแปลง</div>
                                                                        <PriorityHighIcon sx={{ width: '16px', height: '16px' }} />

                                                                    </div>
                                                                </div> : ''
                                                            }
                                                        </>
                                                    }

                                                </div>
                                            </div>
                                            <div className='px-6 pt-2 pb-4'>
                                                <table className={`text-[12px] w-full select-none `}>
                                                    <thead className='font-semibold '>
                                                        <tr>
                                                            <td className='border text-center' rowSpan={2}>Seq.</td>
                                                            <td className='border text-center' rowSpan={2}>Model</td>
                                                            <td className='border text-center py-2 w-[15%]' colSpan={2}>Plan</td>
                                                            <td className='border text-center' rowSpan={2}>Result</td>
                                                            <td className='border text-center' colSpan={2}>Stock</td>
                                                            <td className='border text-center w-[7.5%]' rowSpan={2}>#</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="border text-center py-2 w-[7.5%]">APS</td>
                                                            <td className="border text-center w-[7.5%]">PRD</td>
                                                            <td className="border text-center">M/C</td>
                                                            <td className="border text-center">Main</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody >
                                                        {
                                                            (planMachine != null && planMachine.length) ? planMachine.map((item: PropsPlanMachine, i: number) => (
                                                                <tr onClick={() => {
                                                                    setPartGroupSelected(oGroup)
                                                                }}>
                                                                    <td className="border text-center py-2 font-semibold">{item.prdSeq}</td>
                                                                    <td className="border font-semibold pl-3 py-1">
                                                                        <div className=' flex flex-col '>
                                                                            <strong>{(partMasters.filter(x => x.partno == item.partNo).length && partMasters.filter(x => x.partno == item.partNo)[0].model_common)}</strong>
                                                                            <span className='text-[12px] text-gray-500'>{item.partNo}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="border text-center">{item.apsPlanQty.toLocaleString('en')}</td>
                                                                    <td className="border text-center font-bold">{item.prdPlanQty.toLocaleString('en')}</td>
                                                                    <td className="border text-center">-</td>
                                                                    <td className="border text-center">-</td>
                                                                    <td className="border text-center">{item.stockMain > 0 ? item.stockMain.toLocaleString('en') : '-'}</td>
                                                                    <td className='border'></td>
                                                                </tr>
                                                            )
                                                            ) : <tr>
                                                                <td className='border py-3 text-center font-semibold' colSpan={8}>ไม่พบข้อมูล</td>
                                                            </tr>
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DialogEditSeq partMasters={partMasters} open={openEditSeq} setOpen={setOpenEditSeq} ymd={ymd.format('YYYYMMDD')} empProps={empProps!} partGroup={partGroupSelected} setEmpProps={setEmpProps} loadPlanComponent={init} />

        </div >
    )
}

export default ApsPlan