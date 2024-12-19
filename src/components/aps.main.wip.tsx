import { Fragment, useEffect, useState } from 'react'
import moment from 'moment';
import { ApiGetMainPlan } from '../service/aps.service';
import { StyleTdMainPlan, StyleTextSublineStock } from '../Functions';
import { intervalTime } from '../constants';
import DialogWipDetail from './dialog.wip.detail';
import { Spin } from 'antd';
import { PropGastightMainWIP, PropShrinkGage } from '@/interface/aps.main.interface';
import APSMainSequence from './aps.main.seq';
import { PropMainWIPSelected, PropsMain, PropsWip, PropWIPInline } from '@/interface/aps.interface';
import { MdAccessTime } from "react-icons/md";

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
    type: string;
}

function MainWIPs() {
    const [ymd] = useState<any>(moment().subtract(8, 'hours'));
    const [currentDateTime, setCurrentDateTime] = useState<string>(new Date().toLocaleString());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDateTime(new Date().toLocaleString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    const [mainSeq, setMainSeq] = useState<PropsMain[]>([]);
    const [MainWips, setMainWip] = useState<PropMainWIP[]>([]);
    const [MainHeader, setMainHeader] = useState<any[]>([]);
    const [load, setLoad] = useState<boolean>(true);
    const [MainWIPSelected, setMainWIPSelected] = useState<PropMainWIPSelected | null>(null);
    const [OpenWipDetail, setOpenWipDetail] = useState<boolean>(false);
    const [GastightInfo, setGastightInfo] = useState<PropGastightMainWIP>({ model: '', sebango: '', total: 0, produced: 0 });
    const [LargeP] = useState<any | null>(null);
    const [ShrinkageInfo, setShrinkageInfo] = useState<PropShrinkGage>({ model: '', sebango: '', total: 0, produced: 0 });
    const [AxisCoreInfo, setAxisCoreInfo] = useState<PropShrinkGage>({ model: '', sebango: '', total: 0, produced: 0 });
    const [once, setOnce] = useState<boolean>(true);
    const [WIPInline, setWIPInline] = useState<PropWIPInline[]>([]);
    useEffect(() => {
        if (once == true) {
            init();
        } else {
            const intervalCall = setInterval(() => {
                init();
            }, intervalTime);
            return () => {
                clearInterval(intervalCall);
            }
        }
    }, [once])

    const init = async () => {
        const res = await ApiGetMainPlan({
            paramDate: ymd.format('YYYYMMDD'),
            paramWCNO: '904'
        });
        if (typeof res.wip_in_line != 'undefined') {
            setWIPInline(res.wip_in_line);
        }
        setMainHeader(res.main_header);
        setMainSeq(res.main_seq);
        setMainWip(res.main_wip);
        setGastightInfo(res.gastight);
        setShrinkageInfo(res.shrinkgage);
        setAxisCoreInfo(res.axiscore);
        setLoad(false);
        setOnce(false);
    }

    useEffect(() => {
        if (MainWIPSelected != null) {
            setOpenWipDetail(true);
        }
    }, [MainWIPSelected])
    useEffect(() => {
        if (OpenWipDetail == false) { setMainWIPSelected(null) }
    }, [OpenWipDetail])
    return (
        <>
            <Spin spinning={load} tip='กำลังโหลดข้อมูล'>
                <div className='flex gap-4'>
                    <APSMainSequence />
                    <div className='sm:w-[100%] md:w-[70%] flex flex-col gap-3 align-top  bg-gradient-to-r from-teal-50 to-blue-100 p-4 border rounded-xl'>
                        <div className='sm:flex lg:flex-col sm:gap-9 md:gap-6 lg:gap-4 xl:gap-3'>
                            <div className='flex-none  flex  flex-col justify-start gap-2'>
                                <div className='flex flex-col'>
                                    <strong>MAIN SCR WIP CONTROL</strong>
                                    <small className='text-teal-700'>แผนการผลิตที่ผ่านมาและจำนวนคงเหลือของวัตถุดิบ</small>
                                </div>

                            </div>
                            <div className='grow bg-black/20 p-3 rounded-md backdrop-blur-md shadow-md'>
                                <div className='flex flex-col gap-2'>
                                    <div className="relative h-fit flex items-center justify-between">
                                        <div className='grid grid-cols-5 items-center w-full'>
                                            <div className="w-full h-fit  backdrop-blur-lg bg-gradient-to-r from-slate-900 to-slate-700 shadow-lg rounded-md relative  z-50 pl-[8px] pr-[10px] pt-[4px] pb-[4px]" id="box1">
                                                <div className='flex items-center gap-2'>
                                                    {
                                                        LargeP != null ? <span className="relative flex h-3 w-3">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
                                                        </span> : <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                    }
                                                    <span className='text-white/90'>Large P</span>
                                                </div>
                                                {
                                                    LargeP != null ? <div className='pl-[16px] flex items-center gap-3 justify-between leading-none'>
                                                        <span className='text-white sm:text-sm md:text-md lg:text-lg font-bold tracking-wider'>{LargeP != null ? LargeP.sebango : ''}</span>
                                                        <span className='text-white/50 text-[12px]'>{LargeP != null ? LargeP.model.substring(0, 6) : ''}</span>
                                                    </div> : <div className='flex justify-end items-end'>
                                                        <div className='text-red-500  rounded-md  text-center px-[16px]  drop-shadow-lg'></div>
                                                    </div>
                                                }
                                            </div>
                                        </div>

                                        <svg className="absolute w-full h-[5em]">
                                            <line
                                                x1="50%" y1="50%"
                                                x2="50%" y2="125%"
                                                stroke="gray" stroke-width="2"
                                            />
                                            <line
                                                x1="50%" y1="50%"
                                                x2="50%" y2="125%"
                                                stroke="yellow"
                                                stroke-width="4"
                                                stroke-dasharray="10, 10"
                                                stroke-linecap="round"
                                                className="beam-line"
                                            />
                                        </svg>
                                        <svg
                                            className="absolute left-0 top-1/2 transform -translate-y-1/2 "
                                            width="100%"
                                            height="4"
                                        >
                                            <line x1="0%" y1="0" x2="50%" y2="0" stroke="gray" stroke-width="4" />
                                            <line
                                                x1="0%"
                                                y1="0"
                                                x2="50%"
                                                y2="0"
                                                stroke="yellow"
                                                stroke-width="4"
                                                stroke-dasharray="10, 10"
                                                stroke-linecap="round"
                                                className="beam-line"
                                            />
                                        </svg>
                                    </div>
                                    <div className="relative h-fit flex items-center justify-between ">
                                        <div className='grid grid-cols-5 items-center w-full '>
                                            <div className={`w-full h-fit  backdrop-blur-lg bg-gradient-to-r from-slate-900 to-slate-700 shadow-lg rounded-md relative  z-50 pl-[8px] pr-[10px] pt-[4px] pb-[8px] flex justify-between cursor-pointer`} id="box1">
                                                <div className=' flex flex-col justify-end  w-full'>
                                                    <div className='flex items-center gap-2'>
                                                        {
                                                            (ShrinkageInfo.sebango != null) ? <span className="relative flex h-3 w-3">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
                                                            </span> : <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                        }
                                                        <span className='text-white/90'>Shrinkage</span>
                                                        <div className='flex leading-none justify-end w-full items-end gap-1'>
                                                            <small className='tracking-wider font-semibold text-white'>{ShrinkageInfo.total}</small>
                                                            <small className='text-white/65'>Total</small>
                                                        </div>
                                                    </div>
                                                    {
                                                        (ShrinkageInfo.sebango != null) && <div className=' flex items-center gap-3 leading-none justify-center'>
                                                            <div className='flex flex-none flex-col leading-none text-white justify-center items-center'>
                                                                <span className='sm:text-sm md:text-md lg:text-lg font-bold tracking-wider text-green-400'>{(ShrinkageInfo.sebango != null) ? ShrinkageInfo.sebango : ''} </span>
                                                                <small className='opacity-75'>Model</small>
                                                            </div>
                                                            <div className='flex  flex-none flex-col leading-none text-white justify-center items-center'>
                                                                <span className='sm:text-sm md:text-md lg:text-lg tracking-wider font-semibold text-sky-400 '>({ShrinkageInfo.produced})</span>
                                                                <small className='opacity-75'>Current</small>
                                                            </div>

                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            <div className='flex items-center justify-center'>
                                                {
                                                    (WIPInline.length > 0 && WIPInline.find(x => x.process == 'shrinkage_axiscore') != null) && <div className="w-fit h-fit  backdrop-blur-lg bg-gradient-to-r from-slate-900 to-slate-700 shadow-lg rounded-md relative  z-50 px-[8px] py-[6px] flex flex-col leading-none gap-1" id="box1">
                                                        <div className='flex gap-2 items-center'>
                                                            <span className='text-white/85'>WIP :</span>
                                                            <strong className='text-green-400 tracking-wide text-md animate-pulse'>{
                                                                WIPInline.find(x => x.process == 'shrinkage_axiscore')?.wip_inline_qty
                                                            }</strong>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                            <div className={`w-full h-fit  backdrop-blur-lg bg-gradient-to-r from-slate-900 to-slate-700 shadow-lg rounded-md relative  z-50 pl-[8px] pr-[10px] pt-[4px] pb-[8px] flex justify-between `} >
                                                <div className=' flex flex-col justify-end  w-full'>
                                                    <div className='flex items-center gap-2'>
                                                        {
                                                            (AxisCoreInfo.sebango != null && AxisCoreInfo.sebango != '') ? <span className="relative flex h-3 w-3">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
                                                            </span> : <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                        }
                                                        <span className='text-white/90'>Axiscore</span>
                                                        <div className='flex leading-none justify-end w-full items-end gap-1'>
                                                            <small className='tracking-wider font-semibold text-white'>{AxisCoreInfo.total}</small>
                                                            <small className='text-white/65'>Total</small>
                                                        </div>
                                                    </div>
                                                    {
                                                        (AxisCoreInfo.sebango != null && AxisCoreInfo.sebango != '') && <div className='flex items-center gap-3 justify-center leading-none'>
                                                            <div className='flex flex-none flex-col leading-none text-white justify-center items-center'>
                                                                <span className='sm:text-sm md:text-md lg:text-lg font-bold tracking-wider text-green-400'>{(AxisCoreInfo.sebango != null) ? AxisCoreInfo.sebango : ''} </span>
                                                                <small className='opacity-75'>Model</small>
                                                            </div>
                                                            <div className='flex  flex-none flex-col leading-none text-white justify-center items-center'>
                                                                <span className='sm:text-sm md:text-md lg:text-lg tracking-wider font-semibold text-sky-400 '>({(AxisCoreInfo.produced != null) ? AxisCoreInfo.produced : ''})</span>
                                                                <small className='opacity-75'>Current</small>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>

                                            <div className='flex items-center justify-center'>
                                                {
                                                    (WIPInline.length > 0 && WIPInline.find(x => x.process == 'axiscore_gastight') != null) && < div className="w-fit h-fit  backdrop-blur-lg bg-gradient-to-r from-slate-900 to-slate-700 shadow-lg rounded-md relative  z-50 px-[8px] py-[6px] flex flex-col leading-none gap-1" id="box1">
                                                        <div className='flex gap-2 items-center'>
                                                            <span className='text-white/80'>WIP :</span>
                                                            <strong className='text-green-400 tracking-wide text-md animate-pulse'>{WIPInline.find(x => x.process == 'axiscore_gastight')?.wip_inline_qty}</strong>
                                                        </div>
                                                    </div>
                                                }
                                            </div>

                                            <div className={`w-full h-fit  backdrop-blur-lg bg-gradient-to-r from-slate-900 to-slate-700 shadow-lg rounded-md relative  z-50 pl-[8px] pr-[10px] pt-[4px] pb-[8px] flex justify-between `} >
                                                <div className=' flex flex-col justify-end  w-full'>
                                                    <div className='flex items-center gap-2'>
                                                        {
                                                            (GastightInfo.sebango != '' && GastightInfo.sebango != null) ? <span className="relative flex h-3 w-3">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
                                                            </span> : <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                        }
                                                        <span className='text-white/90'>Gastight</span>
                                                        <div className='flex leading-none justify-end w-full items-end gap-1'>
                                                            <small className='tracking-wider font-semibold text-white'>{GastightInfo.total}</small>
                                                            <small className='text-white/65'>Total</small>
                                                        </div>
                                                    </div>
                                                    {
                                                        (GastightInfo.sebango != '' && GastightInfo.sebango != null) && <div className='pl-[16px] flex items-center gap-3 justify-center leading-none'>
                                                            <div className='flex flex-none flex-col leading-none text-white justify-center items-center'>
                                                                <span className='sm:text-sm md:text-md lg:text-lg font-bold tracking-wider text-green-400'>{GastightInfo.sebango}</span>
                                                                <small className='opacity-75'>Model</small>
                                                            </div>
                                                            <div className='flex  flex-none flex-col leading-none text-white justify-center items-center'>
                                                                <span className='sm:text-sm md:text-md lg:text-lg tracking-wider font-semibold text-sky-400 '>({GastightInfo.produced})</span>
                                                                <small className='opacity-75'>Current</small>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>

                                        </div>
                                        <svg
                                            className="absolute left-0 top-1/2 transform -translate-y-1/2 "
                                            width="100%"
                                            height="4"
                                        >
                                            <line x1="0%" y1="0" x2="100%" y2="0" stroke="gray" stroke-width="4" />

                                            <line
                                                x1="0%"
                                                y1="0"
                                                x2="100%"
                                                y2="0"
                                                stroke="yellow"
                                                stroke-width="4"
                                                stroke-dasharray="10, 10"
                                                stroke-linecap="round"
                                                className="beam-line"
                                            />
                                        </svg>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div id='main_plan_page' className=' sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-5 overflow-auto'>
                            <table className="w-full  shadow-md text-sm bg-white" id='tbMainPlan'>
                                <thead className=''>
                                    <tr>
                                        <td colSpan={6 + (Array.from(new Set([...MainHeader.map(x => x.LINE_TXT)])).length * 2)} className='border bg-[#121314]'>
                                            <div className='flex justify-between py-[8px] px-[12px] text-white/90'>
                                                <div className=' border border-white/10 cursor-pointer select-none text-md backdrop-blur-lg bg-gradient-to-r from-slate-900 to-[#121314] shadow-lg rounded-md relative  z-50 pl-[12px] pr-[12px] pt-[4px] pb-[4px] flex gap-2'>
                                                    <MdAccessTime size={20} className='opacity-80' />
                                                    <span className='tracking-wide '>{moment(currentDateTime).format('DD/MM/YYYY HH:mm:ss')}</span>
                                                </div>
                                                <div className='flex items-center gap-3 '>
                                                    <div className='flex items-center gap-2'>
                                                        <div className='w-3 h-3 rounded-sm bg-[#FFA500] '></div>
                                                        <small className={`tracking-wider`}>Progress</small>
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                        <div className='w-3 h-3 rounded-sm bg-blue-400 '></div>
                                                        <small className={`tracking-wider`}>
                                                            Next Seq.</small>
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                        <div className='w-3 h-3 rounded-sm bg-white '></div>
                                                        <small className={`tracking-wider`}>Waiting</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    < tr className='font-semibold'>
                                        <td className='border text-center' rowSpan={2}>Seq.</td>
                                        <td className='border text-center' rowSpan={2}>Model no</td>
                                        <td className='border text-center' rowSpan={2}>Model</td>
                                        <td className='border text-center' rowSpan={2}>Remain<br></br>Plan</td>
                                        <td className='border text-center' rowSpan={2}>Result</td>
                                        <td className='border  text-center px-1' rowSpan={2}>Time</td>
                                        {
                                            Array.from(new Set([...MainHeader.map(x => x.LINE_TXT)])).map((item, index) => (
                                                <td key={index} className={`border text-center `} colSpan={2}>{item}</td>
                                            ))
                                        }
                                    </tr>
                                    < tr className='font-semibold'>
                                        {
                                            MainHeader.map((item, index) => (
                                                <td key={index} className={`border text-center `}>{item.PROCESS_TXT}</td>
                                            ))
                                        }
                                    </tr>
                                </thead>
                                <tbody className='sm:text-[10px] lg:text-[12px] xl:text-[12px]  2xl:text-[14px]'>
                                    {
                                        MainWips.map((oWIP: any, iMain: number) => {
                                            try {
                                                let isMain: boolean = oWIP.MODEL != '';
                                                let isCurrent: boolean = oWIP.PLN_CURRENT == 'CURRENT' ? true : false;
                                                let isWipNext: boolean = oWIP.PLN_STATUS == 'NEXT' ? true : false;
                                                let isProductOfPart: boolean = oWIP.PLN_STATUS == 'SOME' ? true : false;
                                                let isNextDay: boolean = oWIP.PLN_STATUS == 'NEXTDAY' ? true : false;
                                                let isHistory = oWIP.PLN_STATUS == 'HISTORY' ? true : false;
                                                let style = '';
                                                if (isHistory) {
                                                    style = 'bg-gray-700/20 drop-shadow-sm'
                                                }
                                                if (isWipNext) {
                                                    style = 'bg-blue-500/50'
                                                }
                                                if (isCurrent) {
                                                    style = 'bg-yellow-400 border-2 border-dashed border-black shadow-md'
                                                }
                                                if (typeof oWIP.SEBANGO == 'object') {
                                                    return <tr key={iMain}>
                                                        <td colSpan={5}></td>
                                                        <td className='border text-center bg-sky-50'>{oWIP.PRD_TIME}</td>
                                                        <td colSpan={Array.from(new Set([...MainHeader.map(x => x.LINE_TXT)])).length * 2}></td>
                                                    </tr>
                                                } else {
                                                    return <Fragment key={iMain}>
                                                        {
                                                            isNextDay == true && <tr><td colSpan={24} className={` border px-3 py-1 bg-black/80 text-white tracking-wide `}>วันที่ : {oWIP.YMD != '' ? <span className='text-yellow-400 font-semibold tracking-wider'>{moment(oWIP.YMD).format('DD/MM/YYYY')}</span> : <span className='text-red-500 drop-shadow-lg'>Datetime Invalid</span>}</td></tr>
                                                        }
                                                        <tr className={`${style} ${isCurrent == true && 'drop-shadow-xl font-semibold'} `}>
                                                            <td className={`border text-center ${isCurrent == true && 'py-2 bg-[#FFA500]'}`}>{oWIP.PRD_SEQ}</td>
                                                            <td className={`border text-center ${(isCurrent == true) && 'bg-[#FFA500]/80'}`}>{oWIP.SEBANGO}</td>
                                                            <td className={`border pl-2 ${(isCurrent == true) && 'bg-[#FFA500]/60'}`}>{oWIP.MODEL}</td>
                                                            <td className={`border text-end ${isCurrent == true && 'font-semibold bg-[#FFA500]'}  ${isMain == true ? 'bg-[#FFA500]/20' : 'bg-[#FFA500]/5'}`}>{oWIP.PRD_REMAIN}</td>
                                                            <td className={`border text-end ${(isWipNext == true || isProductOfPart == true || isCurrent) ? 'text-blue-700' : 'text-green-700'} font-semibold pr-[4px] ${isCurrent == true && 'py-2 bg-[#FFA500]/20'}`}>
                                                                <div className='flex justify-end oWIPs-center gap-3'>
                                                                    {isCurrent == true && <span className="relative flex h-3 w-3">
                                                                        <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-500 opacity-75"></span>
                                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
                                                                    </span>}<span className={` ${isCurrent == true ? 'opacity-100' : 'opacity-100 drop-shadow-lg'}`}>{oWIP.PRD_RESULT != 0 ? oWIP.PRD_RESULT : ''}</span>
                                                                </div>
                                                            </td>
                                                            <td className={`border text-center ${isCurrent == true ? 'bg-sky-300' : 'bg-sky-100'} font-semibold`}>{oWIP.PRD_TIME}</td>
                                                            {
                                                                MainHeader.map((oLine, iLine) => {
                                                                    var WIP = 0;
                                                                    try {
                                                                        if (oWIP[oLine.COLUMN_NAME] != '') {
                                                                            WIP = Number(oWIP[oLine.COLUMN_NAME]);
                                                                            return <td key={iLine} className={`cursor-pointer border text-right ${isCurrent == true ? StyleTdMainPlan(WIP) : StyleTextSublineStock(WIP)}`} onClick={() => {
                                                                                setMainWIPSelected({
                                                                                    WIP_INFO: oWIP,
                                                                                    LINE_CODE: oLine.LINE_CODE,
                                                                                    PROCESS_CODE: oLine.PROCESS_CODE
                                                                                })
                                                                            }}>{WIP.toLocaleString('en')}</td>
                                                                        } else {
                                                                            return <td key={iLine} className='border'></td>
                                                                        }
                                                                    } catch {
                                                                        return <td key={iLine}>-</td>
                                                                    }

                                                                })
                                                            }
                                                        </tr>
                                                    </Fragment>
                                                }
                                            } catch (e: Error | any) {
                                                return <tr><td>{e.message}</td></tr>
                                            }

                                        })
                                    }
                                    {/* {
                                        Wips.map((oWip: any, iWip: number) => {
                                            oWip.modelname = oWip.modelname != null ? oWip.modelname.replace('-10', '') : '';
                                            let isMain: boolean = oWip.modelname != '';
                                            let isWipCurrent: boolean = oWip.apsCurrent == 'CURRENT' ? true : false;
                                            let isWipNext: boolean = oWip.apsCurrent == 'NEXT' ? true : false;
                                            let isProductOfPart: boolean = oWip.apsCurrent == 'SOME' ? true : false;
                                            let isNextDay: boolean = oWip.apsCurrent == 'NEXTDAY' ? true : false;
                                            let isHistory = oWip.apsCurrent == 'HISTORY' ? true : false;
                                            let style = '';
                                            if (isHistory) {
                                                style = 'bg-gray-700/20 drop-shadow-sm'
                                            }
                                            if (isWipNext) {
                                                style = 'bg-blue-500/50'
                                            }
                                            if (isWipCurrent) {
                                                style = 'border-2 border-dashed border-black shadow-md'
                                            }
                                            return isNextDay == true ? <tr key={iWip}><td colSpan={24} className={` border px-3 py-1 bg-black/80 text-white `}>วันถัดไป : {oWip.hhmm}</td></tr> : <tr key={iWip} className={`${style} ${isWipCurrent == true && 'drop-shadow-xl font-semibold'} `}>
                                                <td className={`border text-center ${isWipCurrent == true && 'bg-[#FFA500]'}`}>{oWip.apsSeq}</td>
                                                <td className={`border text-center ${(isWipCurrent == true) && 'bg-[#FFA500]/80'}`}>{isMain == true && oWip.modelcode}</td>
                                                <td className={`border  pl-[4px] ${(isWipCurrent == true) && 'bg-[#FFA500]/60'}`}>{oWip.modelname}</td>
                                                <td className={`border text-end ${isWipCurrent == true && 'font-semibold bg-[#FFA500]'}  ${isMain == true ? 'bg-[#FFA500]/20' : 'bg-[#FFA500]/5'}`}>{oWip.apsRemainPlan != 0 ? oWip.apsRemainPlan : ''}</td>
                                                <td className={`border text-end ${(isWipNext == true || isProductOfPart == true || isWipCurrent) ? 'text-blue-700' : 'text-green-700'} font-semibold pr-[4px] ${isWipCurrent == true && 'py-2 bg-[#FFA500]/20'}`}>
                                                    <div className='flex justify-end items-center gap-3'>
                                                        {isWipCurrent == true && <span className="relative flex h-3 w-3">
                                                            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-500 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
                                                        </span>}<span className={` ${isWipCurrent == true ? 'opacity-100' : 'opacity-100 drop-shadow-lg'}`}>{oWip.apsResult != 0 ? oWip.apsResult : ''}</span>
                                                    </div>
                                                </td>
                                                <td className={`border text-center ${isWipCurrent == true ? 'bg-sky-300' : 'bg-sky-200'} font-semibold`}>{oWip.hhmm}</td>
                                                {
                                                    columnMstr.map((oCol: PropsPartGroup, iCol: number) => <td key={iCol} className={`border ${oWip.apsSeq != '' && 'cursor-pointer'} font-normal text-end ${isWipCurrent == true ? StyleTdMainPlan(oWip[oCol.column]) : StyleTextSublineStock(oWip[oCol.column])}`} onClick={() => {
                                                        console.log(oWip)
                                                        if (oWip.apsSeq != '') {
                                                            setMainWIPSelected({
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
                                    } */}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div >
            </Spin >
            <DialogWipDetail open={OpenWipDetail} setOpen={setOpenWipDetail} wip={MainWIPSelected} />
        </>
    )
}

export default MainWIPs