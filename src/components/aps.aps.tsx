import { useEffect, useState } from 'react'
import AgricultureOutlinedIcon from '@mui/icons-material/AgricultureOutlined';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import { CircularProgress, Paper, TableContainer } from '@mui/material';
import moment from 'moment';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { API_APS_PRODUCTION_PLAN, API_GET_GASTIGHT, ApiApsGetPlanMachine } from '../service/aps.service';
import { ApsProductionPlanProps, WipProps, partWipProps } from '../interface/aps.interface';
import ApsDialogNotice from './aps.dialog.notice';
import ApsDialogAddSequence from './aps.dialog.add.sequence';
export interface lineProps {
    text: string;
    value: string;
    icon?: any;
    iconBg?: string;
    iconColor?: string;
}

function Aps() {
    let line: lineProps[] = [
        { text: 'Main', value: 'main', icon: <AgricultureOutlinedIcon sx={{ width: '18px', height: '18px' }} /> }, { text: 'Machine', value: 'machine', icon: <WidgetsOutlinedIcon sx={{ width: '18px', height: '18px' }} /> }
    ];
    const [modelUse, setModelUse] = useState<string>('');
    // let dateformat = 'DD/MM/YYYY';
    // const [date, setDate] = useState<string>(moment().format(dateformat));
    const [load, setLoad] = useState<boolean>(true);
    const [wip, setWip] = useState<WipProps[]>([]);
    const [planSelected, setPlanSelected] = useState<ApsProductionPlanProps | null>(null);
    const [openDialogNotice, setOpenDialogNotice] = useState<boolean>(false);
    const [openDialogAddSequence, setOpenDialogAddSequence] = useState<boolean>(false);
    const [apsProductionPlan, setApsProductionPlan] = useState<ApsProductionPlanProps[]>([]);
    const [lineActive, setLineActive] = useState<lineProps>(line[0]);
    let dateLoop: string = '';
    useEffect(() => {
        init();
    }, [])
    const init = async () => {
        setLoad(true);
        const ApiGetApsPlan = await API_APS_PRODUCTION_PLAN();
        setApsProductionPlan(ApiGetApsPlan);
      
        setLoad(false);
        let ApiGetGasTight = await API_GET_GASTIGHT(moment().format('YYYYMMDD'));
        setWip(ApiGetGasTight);
    }
    useEffect(() => {
        if (openDialogNotice == false) {
            setPlanSelected(null)
        }
    }, [openDialogNotice])
    useEffect(() => {
        if (planSelected != null && Object.keys(planSelected).length > 0) {
            setOpenDialogNotice(true);
        }
    }, [planSelected])
    const NumWip = (val: undefined | string | number) => {
        let num: string = val != undefined ? typeof val == 'string' ? (val != '' ? (Number(val) > 0 ? Number(val).toLocaleString('en') : '') : '') : (val > 0 ? val.toLocaleString('en') : '') : '';
        return num;
    }
    return (
        <div className='grid sm:grid-cols-1 xl:grid-cols-7 pt-3 px-3   sm:gap-3 md:gap-3 '>
            <div className=' sm:col-span-7  gap-4 flex flex-col mb-3 '>
                <div className='font-semibold flex items-center gap-2'>
                    <TuneOutlinedIcon sx={{ width: '16px', height: '16px' }} className='text-[#5f5f5f]' />
                    <span>Filter the line</span>
                </div>
                <div className='flex  gap-6 border-b'>
                    {
                        line.map((oLine: lineProps, i: number) => {
                            let isActive: boolean = lineActive.value == oLine.value;
                            return <div id='item-menu' className={` ${isActive ? 'border-b-2 border-[#0ea5e910] border-b-[#0ea5e9] shadow-md bg-[#0ea5e9]/10 rounded-t-md' : 'opacity-80'} pl-4 pr-6 py-3   flex gap-2 items-center cursor-pointer select-none  hover:opacity-100 transition-all duration-300`} key={i}>
                                <div className={`w-[30px] h-[30px] border rounded-md flex items-center justify-center ${isActive ? 'bg-[#0ea5e9] text-white' : ''} `}>{oLine.icon}</div>
                                <span className={`text-[14px] ${isActive ? 'font-semibold' : ''}`}>{oLine.text}</span>
                                {
                                    isActive && <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                                    </span>
                                }
                            </div>
                        })
                    }
                </div>
            </div>
            <div className='col-span-1 sm:col-span-7 grid sm:grid-cols-7 gap-6 shadow-sm  w-full overflow-y-auto px-3'>
                <div className='sm:col-span-7 xl:col-span-2 flex flex-col gap-4 '>
                    <div className='sm:col-span-1 flex justify-between items-center'>
                        <div>
                            <div className='flex items-center gap-2'>
                                <span className='text-xl font-semibold'>Main</span>
                            </div>
                            <div className='text-sm text-gray-400'>แผนการผลิตประจำไลน์ Main </div>
                        </div>
                        {/* <div className='text-[14px] text-[#0284c7] font-semibold bg-[#eaf7fe] px-3 py-1 rounded-xl border border-[#0284c750] cursor-pointer select-none flex items-center gap-2'>
                            <CalendarMonthOutlinedIcon sx={{ width: '16px', height: '16px' }} />
                            <span> 03/07/2024 - 08/07/2024</span>
                        </div> */}
                    </div>
                    <TableContainer component={Paper} elevation={0} >
                        <table className='w-full bg-white text-[14px]'>
                            <thead className='border-b font-semibold select-none'>
                                <tr>
                                    <td colSpan={6} className='text-center py-2 border'>Sequence Main Assy</td>
                                </tr>
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
                                    load ? <tr><td className='border' colSpan={27}><div className='flex flex-col justify-center items-center py-3'>
                                        <CircularProgress />
                                        <span className='text-[14px]'>กำลังโหลดข้อมูล</span>
                                    </div></td></tr>
                                        : <>
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
                                            {/* <tr >
                                                <td className='border text-center p-3 bg-[#5c5fc850]' colSpan={6} onClick={() => setPlanSelected({
                                                    apsPlanCode: '0',
                                                })}>
                                                    <div className='bg-white border-2 border-dashed rounded-lg border-[#5c5fc8] p-3 text-[#5c5fc8] flex justify-center select-none cursor-pointer items-center gap-3'>
                                                        <AddCircleOutlineOutlinedIcon />
                                                        <div className='text-[14px]'>เพิ่มแผนการผลิต</div>
                                                    </div>
                                                </td>
                                            </tr> */}
                                        </>
                                }
                            </tbody>
                        </table>
                    </TableContainer>
                </div>
                <div className='sm:col-span-7 xl:col-span-5 flex flex-col gap-4 '>
                    <div className='flex justify-between items-center '>
                        <div>
                            <div className='text-xl font-semibold'>Main Scroll</div>
                            <div className='text-sm text-gray-400'>แผนการผลิตประจำไลน์ Main Scroll</div>
                        </div>
                        <div className='bg-[#27354d] text-[#f7f9fb] text-[14px] pl-4 pr-4 rounded-md border py-1 flex  gap-1 cursor-pointer select-none hover:border-blue-400 transition-all duration-300 items-center'>
                            <CalendarMonthOutlinedIcon sx={{ width: '16px', height: '16px' }} />
                            <span>ข้อมูลเมื่อวันที่</span>
                            <div>{moment().format('DD MMM YYYY').toUpperCase()}</div>
                        </div>
                        {/* <div className='text-[14px] text-[#0284c7] font-semibold bg-[#eaf7fe] px-3 py-1 rounded-xl border border-[#0284c750] cursor-pointer select-none flex items-center gap-2'>
                            <span>ข้อมูลเมื่อวันที่</span>
                            <span> 03/07/2024 - 08/07/2024</span>
                        </div> */}
                    </div>
                    <TableContainer component={Paper} elevation={0} className='h-[600px] border-t  overflow-auto'>
                        <table className='w-full bg-white text-[14px] '>
                            <thead className='sticky top-0 bg-white'>
                                <tr className='font-semibold'>
                                    <td className='border border-t-0 text-center font-semibold py-2' colSpan={4}>Result</td>
                                    <td className='border border-t-0 text-center' rowSpan={3}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                    <td className='border border-t-0 text-center' colSpan={18}>Current WIP</td>
                                </tr>
                                < tr className='font-semibold'>
                                    <td className='border text-center py-2' rowSpan={2}>Sebango</td>
                                    <td className='border text-center' rowSpan={2}>Model</td>
                                    <td className='border text-center' rowSpan={2}>Result</td>
                                    <td className='border text-center' rowSpan={2}>Time</td>
                                    <td className='border text-center py-2' colSpan={2}>Stator</td>
                                    <td className='border text-center' colSpan={2}>Rotor</td>
                                    <td className='border text-center' colSpan={2}>Housing</td>
                                    <td className='border text-center' colSpan={2}>CS</td>
                                    <td className='border text-center' colSpan={2}>FS/OS</td>
                                    <td className='border text-center' colSpan={2}>Lower</td>
                                    <td className='border text-center' colSpan={2}>Pipe</td>
                                    <td className='border text-center' colSpan={2}>Top</td>
                                    <td className='border text-center' colSpan={2}>Bottom</td>
                                </tr>
                                < tr className='font-semibold'>
                                    <td className='border text-center py-2'>Main</td>
                                    <td className='border text-center '>Motor</td>
                                    <td className='border text-center '>Main</td>
                                    <td className='border text-center '>Motor</td>
                                    <td className='border text-center '>Main</td>
                                    <td className='border text-center '>M/C</td>
                                    <td className='border text-center '>Main</td>
                                    <td className='border text-center '>M/C</td>
                                    <td className='border text-center '>Main</td>
                                    <td className='border text-center '>M/C</td>
                                    <td className='border text-center '>Main</td>
                                    <td className='border text-center '>M/C</td>
                                    <td className='border text-center '>Main</td>
                                    <td className='border text-center '>Casing</td>
                                    <td className='border text-center '>Main</td>
                                    <td className='border text-center '>Casing</td>
                                    <td className='border text-center '>Main</td>
                                    <td className='border text-center '>Casing</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    wip.map((oWip: WipProps, i: number) => {
                                        let wcnoMain: string = "904";
                                        let model: string = oWip.model;
                                        let statorMain: partWipProps = oWip.wip.find(x => x.parttype == 'STATOR' && x.model == model && x.wcno == wcnoMain)!;
                                        let statorMotor: partWipProps = oWip.wip.find(x => x.parttype == 'STATOR_MOTOR' && x.model == model)!;
                                        let rotorMain: partWipProps = oWip.wip.find(x => x.parttype == 'ROTOR' && x.model == model && x.wcno == wcnoMain)!;
                                        let rotorMotor: partWipProps = oWip.wip.find(x => x.parttype == 'ROTOR_MOTOR' && x.model == model)!;
                                        let housingMain: partWipProps = oWip.wip.find(x => x.parttype == 'HS' && x.model == model && x.wcno == wcnoMain)!;
                                        let housingMC: partWipProps = oWip.wip.find(x => x.parttype == 'HS_MC' && x.model == model)!;
                                        let csMain: partWipProps = oWip.wip.find(x => x.parttype == 'CS' && x.model == model && x.wcno == wcnoMain)!;
                                        let csMC: partWipProps = oWip.wip.find(x => x.parttype == 'CS_MC' && x.model == model)!;
                                        let fsMain: partWipProps = oWip.wip.find(x => x.parttype == 'FS' && x.model == model && x.wcno == wcnoMain)!;
                                        let fsMC: partWipProps = oWip.wip.find(x => x.parttype == 'FS_MC' && x.model == model)!;
                                        let lwMain: partWipProps = oWip.wip.find(x => x.parttype == 'LW' && x.model == model && x.wcno == wcnoMain)!;
                                        let lwMC: partWipProps = oWip.wip.find(x => x.parttype == 'LW_MC' && x.model == model)!;
                                        let pipeMain: partWipProps = oWip.wip.find(x => x.parttype == 'BODY' && x.model == model && x.wcno == wcnoMain)!;
                                        let pipeCS: partWipProps = oWip.wip.find(x => x.parttype == 'BODY_CS' && x.model == model)!;
                                        let topMain: partWipProps = oWip.wip.find(x => x.parttype == 'TOP' && x.model == model && x.wcno == wcnoMain)!;
                                        let topCS: partWipProps = oWip.wip.find(x => x.parttype == 'TOP_CS' && x.model == model)!;
                                        let bottomMain: partWipProps = oWip.wip.find(x => x.parttype == 'BOTTOM' && x.model == model && x.wcno == wcnoMain)!;
                                        let bottomCS: partWipProps = oWip.wip.find(x => x.parttype == 'BOTTOM_CS' && x.model == model)!;
                                        return <tr key={i} className={`${i == 0 ? 'bg-yellow-200  font-semibold' : 'bg-green-50'}`}>
                                            <td className={` text-center ${i == 0 ? 'bg-yellow-400 py-2 border-yellow-500 border-dashed border-2' : 'bg-green-600 text-white border'} `}>{oWip.sebango}</td>
                                            <td className={`border text-center ${i == 0 && 'border-yellow-500 border-dashed border-2'}`}>{oWip.model}</td>
                                            <td className={`border text-end font-semibold  ${i == 0 && 'border-yellow-500 border-dashed border-2'}`}>{oWip.cnt}</td>
                                            <td className={`border text-center  ${i == 0 && 'border-yellow-500 border-dashed border-2'}`}>{oWip.hour > 24 ? `${(oWip.hour - 24).toString().padStart(2, '0')}:00` : (oWip.hour + ':00').toString().padStart(2, '0')}</td>
                                            <td>&nbsp;</td>
                                            <td className={`border text-center  ${i == 0 && 'border-yellow-500 border-dashed border-2'}`}>{statorMain != undefined ? NumWip(statorMain.stock) : ''}</td>
                                            <td className={`border text-center  ${i == 0 && 'border-yellow-500 border-dashed border-2'}`}>{statorMotor != undefined ? NumWip(statorMotor.stock) : ''}</td>
                                            <td className={`border text-center  ${i == 0 && 'border-yellow-500 border-dashed border-2'}`}>{rotorMain != undefined ? NumWip(rotorMain.stock) : ''}</td>
                                            <td className={`border text-center  ${i == 0 && 'border-yellow-500 border-dashed border-2'}`}>{rotorMotor != undefined ? NumWip(rotorMotor.stock) : ''}</td>
                                            <td className={`border text-center  ${i == 0 && 'border-yellow-500 border-dashed border-2'}`}>{housingMain != undefined ? NumWip(housingMain.stock) : ''}</td>
                                            <td className={`border text-center  ${i == 0 && 'border-yellow-500 border-dashed border-2'}`}>{housingMC != undefined ? NumWip(housingMC.stock) : ''}</td>
                                            <td className={`border text-center  ${i == 0 && 'border-yellow-500 border-dashed border-2'}`}>{csMain != undefined ? NumWip(csMain.stock) : ''}</td>
                                            <td className={`border text-center  ${i == 0 && 'border-yellow-500 border-dashed border-2'}`}>{csMC != undefined ? NumWip(csMC.stock) : ''}</td>
                                            <td className={`border text-center  ${i == 0 && 'border-yellow-500 border-dashed border-2'}`}>{fsMain != undefined ? NumWip(fsMain.stock) : ''}</td>
                                            <td className={`border text-center  ${i == 0 && 'border-yellow-500 border-dashed border-2'}`}>{fsMC != undefined ? NumWip(fsMC.stock) : ''}</td>
                                            <td className={`border text-center  ${i == 0 && 'border-yellow-500 border-dashed border-2'}`}>{lwMain != undefined ? NumWip(lwMain.stock) : ''}</td>
                                            <td className={`border text-center  ${i == 0 && 'border-yellow-500 border-dashed border-2'}`}>{lwMC != undefined ? NumWip(lwMC.stock) : ''}</td>
                                            <td className={`border text-center  ${i == 0 && 'border-yellow-500 border-dashed border-2'}`}>{pipeMain != undefined ? NumWip(pipeMain.stock) : ''}</td>
                                            <td className={`border text-center  ${i == 0 && 'border-yellow-500 border-dashed border-2'}`}>{pipeCS != undefined ? NumWip(pipeCS.stock) : ''}</td>
                                            <td className={`border text-center  ${i == 0 && 'border-yellow-500 border-dashed border-2'}`}>{topMain != undefined ? NumWip(topMain.stock) : ''}</td>
                                            <td className={`border text-center  ${i == 0 && 'border-yellow-500 border-dashed border-2'}`}>{topCS != undefined ? NumWip(topCS.stock) : ''}</td>
                                            <td className={`border text-center  ${i == 0 && 'border-yellow-500 border-dashed border-2'}`}>{bottomMain != undefined ? NumWip(bottomMain.stock) : ''}</td>
                                            <td className={`border text-center  ${i == 0 && 'border-yellow-500 border-dashed border-2'}`}>{bottomCS != undefined ? NumWip(bottomCS.stock) : ''}</td>
                                        </tr>
                                    })
                                }

                            </tbody>
                            <tfoot className='sticky bottom-0  border font-semibold bg-white '>
                                <tr>
                                    <td className='border text-end pr-3 py-2' colSpan={2}>Total</td>
                                    <td className='border text-end pr-1'>{wip.length ? wip.reduce((acc, item) => acc + item.cnt, 0).toLocaleString('en') : 0}</td>
                                    <td className='border' colSpan={20}></td>
                                </tr>
                            </tfoot>
                        </table>
                    </TableContainer>
                </div>
            </div>
            <ApsDialogNotice open={openDialogNotice} apsLoad={init} setOpen={setOpenDialogNotice} data={planSelected} setData={setPlanSelected} plan={apsProductionPlan} setPlan={setApsProductionPlan} />
            <ApsDialogAddSequence open={openDialogAddSequence} close={setOpenDialogAddSequence} />
        </div>
    )
}

export default Aps