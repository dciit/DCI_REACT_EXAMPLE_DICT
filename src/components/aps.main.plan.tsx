//@ts-nocheck
import { Fragment, useEffect, useState } from 'react'
import moment from 'moment';
import { ApiGetLastGastight, ApiGetMainPlan } from '../service/aps.service';
import { ApsProductionPlanProps, PropGastight, PropsGastight, PropsMain, PropsWip } from '../interface/aps.interface';
import { StyleTdMainPlan, StyleTextSublineStock } from '../Functions';
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined';
// import { StockBalance, PropsWipCurrent } from '../interface/aps.main.interface';
import { CircularProgress, Divider } from '@mui/material';
import ListPlanStatus from '../components/list.status';
import { intervalTime } from '../constants';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DialogWipDetail from './dialog.wip.detail';
import { Tag } from 'antd';
// import DialogWipDetail from '../components/dialog.wip.detail';
export interface lineProps {
    text: string;
    value: string;
    icon?: any;
    iconBg?: string;
    iconColor?: string;
}
export interface PropsWipSelected {
    group: string;
    wip: PropsWip;
    line: string;
    type: string;
}
interface PropsPartGroup {
    column: string;
    group: string;
    line: string;

}
function MainPlan() {
    let dateLoop: string = '';
    const [ymd] = useState<any>(moment().subtract(8, 'hours'));
    let columnMstr: PropsPartGroup[] = [
        { column: 'statorMain', group: 'STATOR', line: 'MAIN' },
        { column: 'statorSubline', group: 'STATOR', line: 'SUBLINE' },
        { column: 'rotorMain', group: 'ROTOR', line: 'MAIN' },
        { column: 'rotorSubline', group: 'ROTOR', line: 'SUBLINE' },
        { column: 'hsMain', group: 'HS', line: 'MAIN' },
        { column: 'hsSubline', group: 'HS', line: 'SUBLINE' },
        { column: 'csMain', group: 'CS', line: 'MAIN' },
        { column: 'csSubline', group: 'CS', line: 'SUBLINE' },
        { column: 'fsMain', group: 'FS', line: 'MAIN' },
        { column: 'fsSubline', group: 'FS', line: 'SUBLINE' },
        { column: 'lwMain', group: 'LW', line: 'MAIN' },
        { column: 'lwSubline', group: 'LW', line: 'SUBLINE' },
        { column: 'bodyMain', group: 'BODY', line: 'MAIN' },
        { column: 'bodySubline', group: 'BODY', line: 'SUBLINE' },
        { column: 'topMain', group: 'TOP', line: 'MAIN' },
        { column: 'topSubline', group: 'TOP', line: 'SUBLINE' },
        { column: 'bottomMain', group: 'BOTTOM', line: 'MAIN' },
        { column: 'bottomSubline', group: 'BOTTOM', line: 'SUBLINE' }
    ];
    const [planSelected, setPlanSelected] = useState<ApsProductionPlanProps | null>(null);
    const [openDialogNotice, setOpenDialogNotice] = useState<boolean>(false);
    const [MainPlans, setMainPlans] = useState<PropsMain[]>([]);
    const [Wips, setWips] = useState<PropsWip[]>([]);
    const [load, setLoad] = useState<boolean>(true);
    const [WipSelected, setWipSelected] = useState<PropsWipSelected | null>(null);
    const [OpenWipDetail, setOpenWipDetail] = useState<boolean>(false);
    const [lastGastight, setLastGastight] = useState<any | null>(null);
    let LoopDate: string = '';
    let DrawDate: boolean = false;
    const [once, setOnce] = useState<boolean>(true);
    useEffect(() => {
        if (once == true) {
            init();
        } else {
            const intervalCall = setInterval(() => {
                init();
            }, intervalTime);
            const intervalRefresh = setInterval(() => {
                location.reload();
            }, 18000000);
            const intervalId = setInterval(() => {
                const date = new Date();
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                let hmsCurrent = `${hours}:${minutes}:${seconds}`;
                if (hmsCurrent == '08:00:00' || hmsCurrent == '08:00:01' || hmsCurrent == '20:00:00' || hmsCurrent == '20:00:01') {
                    location.reload();
                }
            }, 1000); // Logs time every second
            return () => {
                clearInterval(intervalCall);
                clearInterval(intervalRefresh);
                clearInterval(intervalId)
            }

        }
    }, [once])

    const init = async () => {
        const res = await ApiGetMainPlan({
            paramDate: ymd.format('YYYYMMDD'),
            paramWCNO: '904'
        });
        setMainPlans(res.main);
        setWips(res.wip);
        try {
            const lastGas = await ApiGetLastGastight();
            if (lastGas != null && lastGas != '') {
                setLastGastight(lastGas);
            }
        } catch {
            setLastGastight(null);
        }
        setLoad(false);
        setOnce(false);
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
    }, [planSelected]);

    useEffect(() => {
        if (WipSelected != null) {
            setOpenWipDetail(true);
        }
    }, [WipSelected])
    useEffect(() => {
        if (OpenWipDetail == false) { setWipSelected(null) }
    }, [OpenWipDetail])

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
    const GetDTCurrentShinkGate = (shink: any) => {
        try {
            if (shink != null && typeof shink.dt != 'undefined') {
                return shink.dt
            }else{
                return 'ไม่พบข้อมูล';
            }
        } catch {
            return '';
        }
    }
    return (
        <>
            {/* md:bg-red-500 lg:bg-yellow-500 xl:bg-green-700 2xl:bg-pink-500 */}
            <div className='grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-8 xl:grid-cols-8 gap-9'>
                <div className='sm:col-span-1 md:col-span-1 lg:col-span-3 xl:col-span-2 flex flex-col gap-3  bg-gradient-to-r from-green-50 to-teal-50 p-6 border rounded-xl'>
                    <div className='flex items-end gap-3'>
                        <span>Main Scroll Sequence Plan</span>
                        <small className='text-teal-700'>แผนการผลิตประจำไลน์ Main</small>
                    </div>
                    <ListPlanStatus />
                    <table className='w-full bg-white  shadow-md ' id='tbMain'>
                        <thead className='sm:text-[8px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] border-b font-semibold select-none bg-[#F9FAFB] '>
                            <tr>
                                <td className='border py-1 text-center w-[10%]' rowSpan={2}>ลำดับ</td>
                                <td className='border w-[35%] pl-3' rowSpan={2}>Model</td>
                                <td className='border text-center' colSpan={2}>Plan</td>
                            </tr>
                            <tr>
                                <td className='border text-center w-[10%] py-1'>APS </td>
                                <td className='border text-center w-[10%]'>PRD </td>
                            </tr>
                        </thead>
                        <tbody className='sm:text-[8px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]'>
                            {
                                load ? <tr><td colSpan={4} className='border'><div className='flex w-full items-center flex-col p-6 gap-2'><CircularProgress sx={{ color: '#2563EB' }} /><span className='text-[14px]'>กำลังโหลดข้อมูล</span></div></td></tr> : (MainPlans.length == 0) ? <tr><td colSpan={7} className='border py-2 text-center   text-red-600'>* ไม่พบแผนผลิต</td></tr> :
                                    MainPlans.map((o: PropsMain, i: number) => {
                                        let groupModelIsUse = MainPlans.map((o: PropsMain) => o.partNo);
                                        groupModelIsUse = [...new Set(groupModelIsUse)];
                                        if (dateLoop == '' || dateLoop != moment(o.apsPlanDate).format('DD/MM/YYYY')) {
                                            dateLoop = moment(o.apsPlanDate).format('DD/MM/YYYY');
                                        }
                                        let noPlan: boolean = o.prdPlanQty == 0 ? true : false;
                                        if (LoopDate == '' || LoopDate != moment(o.apsPlanDate).format('DD/MM/YYYY')) {
                                            LoopDate = moment(o.apsPlanDate).format('DD/MM/YYYY');
                                            DrawDate = true;
                                        } else {
                                            DrawDate = false;
                                        }
                                        let isDate: boolean = moment(o.apsPlanDate).format('DD/MM/YYYY') == ymd.format('DD/MM/YYYY') ? true : false;
                                        let apsCurrent: string = o.apsCurrent;
                                        return <Fragment key={i}>
                                            {
                                                DrawDate == true && <tr className={`cursor-pointer select-none ${noPlan && 'opacity-50'}`} >
                                                    <td colSpan={6} className='border py-2 pl-3'><strong>{LoopDate}</strong></td>
                                                </tr>
                                            }
                                            <tr className={`${isDate == true ? (apsCurrent == '' ? 'cursor-pointer' : (apsCurrent == 'CURRENT' ? 'bg-[#FFA500]/10' : (apsCurrent == 'SOME' ? 'bg-blue-50' : (apsCurrent == 'SUCCESS' ? 'bg-green-50' : 'bg-white')))) : 'cursor-not-allowed opacity-40'} select-none ${noPlan && 'opacity-50'}`} >
                                                <td className={`border text-center ${apsCurrent == '' ? 'bg-[#F9FAFB]' : (apsCurrent == 'CURRENT' ? 'bg-[#FFA500] text-black font-semibold' : (apsCurrent == 'SOME' ? 'bg-blue-700 text-white' : (apsCurrent == 'SUCCESS' ? 'bg-green-700 text-white' : 'bg-white')))} font-semibold`} >
                                                    {
                                                        isDate == true ? o.prdSeq : <RemoveCircleOutlinedIcon className='text-[#ddd]' />
                                                    }
                                                </td>
                                                <td className={` pl-1  border`}>
                                                    <div className='pt-[2px] pb-[3px]'>
                                                        <p className='font-bold'>{o.partNo}</p>
                                                        <div className='flex items-center gap-1'>
                                                            <strong>({o.modelCode})</strong>
                                                            <DrawItemMain qty={o.apsPlanQty} status={apsCurrent} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={`border text-end pr-[4px]  font-semibold text-blue-700`}>{o.apsPlanQty}</td>
                                                <td className={`border text-end pr-[4px]`}>
                                                    <div className={`pr-[4px] pt-[3px] pb-[2px]  rounded-lg font-semibold ${(o.prdPlanQty != undefined && o.prdPlanQty > 0) ? 'text-green-600 drop-shadow-lg' : 'text-red-500'}`}>{o.prdPlanQty}</div>
                                                </td>
                                            </tr>
                                        </Fragment>
                                    })
                            }
                        </tbody>
                    </table>
                </div>
                <div className='sm:col-span-1 md:col-span-1 lg:col-span-5 xl:col-span-6 flex flex-col gap-3 align-top  bg-gradient-to-r from-teal-50 to-blue-100 p-6 border rounded-xl'>
                    <div className='grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5'>
                        <div className='sm:col-span-1 md:col-span-2 lg:col-span-2'>
                            <div className='flex items-end gap-3'>
                                <span>Main Scroll Current Stock</span>
                                <small className='text-teal-700'>แผนการผลิตที่ผ่านมาและจำนวนคงเหลือของวัตถุดิบ</small>
                            </div>
                            <div className='flex items-center gap-3'>
                                <div className='flex items-center gap-1'>
                                    <div className='w-3 h-3 rounded-sm bg-[#FFA500] border border-black/40'></div>
                                    <small className={`tracking-wide`}>กำลังผลิต</small>
                                </div>
                                <div className='flex items-center gap-1'>
                                    <div className='w-3 h-3 rounded-sm bg-gray-400 border border-black/40'></div>
                                    <small className={`tracking-wide`}>
                                        ผลิตถัดไป</small>
                                </div>
                                <div className='flex items-center gap-1'>
                                    <div className='w-3 h-3 rounded-sm bg-white border border-black/40'></div>
                                    <small className={`tracking-wide`}>รอผลิต</small>
                                </div>
                            </div>
                        </div>
                        <div className='sm:col-span-1 md:col-span-2 lg:col-start-4 lg:col-end-6'>
                            <div className='bg-white border rounded-md shadow-sm px-4 py-2 flex gap-3 items-center'>
                                <span>SHRINKGAGE</span>
                                <Tag color={lastGastight != null ? '#52c41a' : '#dc2626'}>{lastGastight != null ? 'ผลิต' : 'ยังไม่ผลิต'}</Tag>
                                <Divider orientation="vertical" flexItem />
                                <div className='flex flex-col'>
                                    <div className='flex  flex-col justify-center gap-0'>
                                        <strong>{lastGastight != null ? lastGastight.modelName : '-'} ({lastGastight != null ? lastGastight.modelCode : '-'})</strong>
                                        <small></small>
                                    </div>
                                    <small>{lastGastight != null ? GetDTCurrentShinkGate(lastGastight) : '-'}</small>
                                </div>
                                <span className="relative flex h-3 w-3">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${lastGastight != null ? 'bg-[#52c41a]' : 'bg-[#dc2626]'} opacity-75`}></span>
                                    <span className={`relative inline-flex rounded-full h-3 w-3 ${lastGastight != null ? 'bg-[#52c41a]' : 'bg-[#dc2626]'}`}></span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div id='main_plan_page' className=' sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-5 overflow-auto'>
                        <table className="w-full  shadow-md text-sm bg-white" id='tbMainPlan'>
                            <thead className=''>
                                < tr className='font-semibold'>
                                    <td className='border text-center' rowSpan={2}>Seq.</td>
                                    <td className='border text-center' rowSpan={2}>Model no</td>
                                    <td className='border text-center' rowSpan={2}>Model</td>
                                    <td className='border text-center' rowSpan={2}>Remain<br></br>Plan</td>
                                    <td className='border text-center' rowSpan={2}>Result</td>
                                    <td className='border  text-center px-1' rowSpan={2}>Time</td>
                                    <td className={`border text-center  py-1`} colSpan={2}>Stator</td>
                                    <td className={`border text-center `} colSpan={2}>Rotor</td>
                                    <td className={`border text-center `} colSpan={2}>Housing</td>
                                    <td className={`border text-center `} colSpan={2}>CS</td>
                                    <td className={`border text-center `} colSpan={2}>FS/OS</td>
                                    <td className={`border text-center `} colSpan={2}>Lower</td>
                                    <td className={`border text-center `} colSpan={2}>Pipe</td>
                                    <td className={`border text-center `} colSpan={2}>Top</td>
                                    <td className={`border text-center `} colSpan={2}>Bottom</td>
                                </tr>
                                < tr className='font-semibold'>
                                    <td className={`border text-center  py-1`}>Main</td>
                                    <td className={`border text-center  `}>Motor</td>
                                    <td className={`border text-center  `}>Main</td>
                                    <td className={`border text-center  `}>Motor</td>
                                    <td className={`border text-center  `}>Main</td>
                                    <td className={`border text-center  `}>M/C</td>
                                    <td className={`border text-center  `}>Main</td>
                                    <td className={`border text-center  `}>M/C</td>
                                    <td className={`border text-center  `}>Main</td>
                                    <td className={`border text-center  `}>M/C</td>
                                    <td className={`border text-center  `}>Main</td>
                                    <td className={`border text-center  `}>M/C</td>
                                    <td className={`border text-center  `}>Main</td>
                                    <td className={`border text-center  `}>Casing</td>
                                    <td className={`border text-center  `}>Main</td>
                                    <td className={`border text-center  `}>Casing</td>
                                    <td className={`border text-center  `}>Main</td>
                                    <td className={`border text-center  `}>Casing</td>
                                </tr>
                            </thead>
                            <tbody className='sm:text-[8px] lg:text-[10px] xl:text-[12px]  2xl:text-[14px]'>
                                {
                                    load == true ? <tr><td colSpan={24} className='border'><div className='flex w-full items-center flex-col p-6 gap-2'><CircularProgress sx={{ color: '#2563EB' }} /><span className='text-[14px]'>กำลังโหลดข้อมูล</span></div></td></tr> :
                                        <Fragment>
                                            {
                                                Wips.map((oWip: any, iWip: number) => {
                                                    oWip.modelname = oWip.modelname != null ? oWip.modelname.replace('-10', '') : '';
                                                    let isMain: boolean = oWip.modelname != '';
                                                    let isWipCurrent: boolean = oWip.apsCurrent == 'CURRENT' ? true : false;
                                                    let isWipNext: boolean = oWip.apsCurrent == 'NEXT' ? true : false;
                                                    let isProductOfPart: boolean = oWip.apsCurrent == 'SOME' ? true : false;
                                                    return <tr key={iWip} className={`${isWipCurrent == true && 'drop-shadow-xl font-semibold'} ${(isWipCurrent == true) && 'bg-[#FFA500]/20'} ${isWipNext == true && 'bg-gray-700/10 drop-shadow-sm'}`}>
                                                        <td className={`border text-center ${isWipCurrent == true && 'bg-[#FFA500]/50'}`}>{oWip.apsSeq}</td>
                                                        <td className='border text-center '>{isMain == true && oWip.modelcode}</td>
                                                        <td className='border  pl-[4px]'>{oWip.modelname}</td>
                                                        <td className={`border text-end ${isWipCurrent == true && 'font-semibold'}  ${isMain == true ? 'bg-[#FFA500]/20' : 'bg-[#FFA500]/5'}`}>{oWip.apsRemainPlan != 0 ? oWip.apsRemainPlan : ''}</td>
                                                        <td className={`border text-end ${(isWipNext == true || isProductOfPart == true) ? 'text-blue-700' : 'text-green-700'} font-semibold pr-[4px] ${isWipCurrent == true && 'py-2'}`}>{isWipCurrent == true && <LocationOnIcon className='animate-bounce' sx={{
                                                            width: '16px', height: '16px'
                                                        }} />}<span className={` ${isWipCurrent == true ? 'opacity-100' : 'opacity-70 drop-shadow-lg'}`}>{oWip.apsResult != 0 ? oWip.apsResult : ''}</span></td>
                                                        <td className={`border text-center ${isWipCurrent == true ? 'bg-sky-300' : 'bg-sky-200'} font-semibold`}>{oWip.hhmm}</td>
                                                        {
                                                            columnMstr.map((oCol: PropsPartGroup, iCol: number) => <td key={iCol} className={`border cursor-pointer font-normal text-end ${isWipCurrent == true ? StyleTdMainPlan(oWip[oCol.column]) : StyleTextSublineStock(oWip[oCol.column])}`} onClick={() => {
                                                                if (oWip.ym == null && oWip.ymd == null && oWip.wcno == null) {
                                                                    setWipSelected({
                                                                        group: oCol.group,
                                                                        wip: oWip,
                                                                        line: oCol.line,
                                                                        type: oCol.column.includes('Main') ? 'main' : 'subline'
                                                                    })
                                                                }
                                                            }}>{(typeof oWip[oCol.column] != 'undefined' ? oWip[oCol.column] : '')}</td>)
                                                        }
                                                    </tr>
                                                })
                                            }
                                        </Fragment>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <DialogWipDetail open={OpenWipDetail} setOpen={setOpenWipDetail} wip={WipSelected} />
        </>
    )
}

export default MainPlan