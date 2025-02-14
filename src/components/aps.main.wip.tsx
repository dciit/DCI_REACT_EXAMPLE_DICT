import { Fragment, useEffect, useState } from 'react'
import moment from 'moment';
import { APIGetMainPlan } from '../service/aps.service';
import { StyleTdMainPlan, StyleTextSublineStock } from '../Functions';
import { intervalTime } from '../constants';
import DialogWipDetail from './dialog.wip.detail';
import { Spin } from 'antd';
// import { PropGastightMainWIP, PropShrinkGage } from '@/interface/aps.main.interface';
import APSMainSequence from './aps.main.seq';
import {  PropMainSeq, PropMainWIPSelected, PropsWip } from '@/interface/aps.interface';
import Flows from './flows';
// import { useSelector } from 'react-redux';
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
    // const redux = useSelector((state: any) => state.redux);
    const [ymd] = useState<any>(moment().subtract(8, 'hours'));
    // const [currentDateTime, setCurrentDateTime] = useState<string>(new Date().toLocaleString());
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setCurrentDateTime(new Date().toLocaleString());
    //     }, 1000);
    //     return () => clearInterval(interval);
    // }, []);
    const [MainWips, setMainWip] = useState<PropMainSeq[]>([]);
    const [MainHeader, setMainHeader] = useState<any[]>([]);
    const [load, setLoad] = useState<boolean>(true);
    const [MainWIPSelected, setMainWIPSelected] = useState<PropMainWIPSelected | null>(null);
    const [OpenWipDetail, setOpenWipDetail] = useState<boolean>(false);
    const [once, setOnce] = useState<boolean>(true);
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
        // let ReduxPlant = redux.filter?.plan;
        // let ReduxLine = redux.filter?.line;
        const res = await APIGetMainPlan({
            paramDate: ymd.format('YYYYMMDD'),
            paramWCNO: '904'
        });
        setMainHeader(res.main_header);
        setMainWip(res.main_wip);
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
    // const ViewFlows = () => {
    //     try {
    //         return <Flows />
    //     } catch (e: Error | any) {
    //         return <div>{e.message}</div>
    //     }
    // }
    return (
        <>
            <Spin spinning={load} tip='กำลังโหลดข้อมูล'>
                <div className='flex gap-4'>
                    <APSMainSequence />
                    <div className='sm:w-[100%] md:w-[75%] flex flex-col gap-3 align-top  bg-gradient-to-r from-teal-50 to-blue-100 p-4 border rounded-xl'>
                        <div className='sm:flex lg:flex-col sm:gap-9 md:gap-6 lg:gap-4 xl:gap-3'>
                            <div className='flex-none  flex  flex-col justify-start gap-2'>
                                <div className='flex flex-col'>
                                    <strong className='text-lg'>MAIN SCR WIP CONTROL</strong>
                                </div>
                            </div>
                            <Flows />
                        </div>
                        <div id='main_plan_page' className=' sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-5 overflow-auto'>
                            <table className="w-full  shadow-md text-sm bg-white" id='tbMainPlan'>
                                <thead className=''>
                                    < tr className='font-semibold'>
                                        <td className='border text-center' rowSpan={2}>Seq.</td>
                                        <td className='border text-center' rowSpan={2}>Sebango</td>
                                        <td className='border text-center' rowSpan={2}>Model</td>
                                        <td className='border text-center' rowSpan={2}>Remain<br></br>Plan</td>
                                        <td className='border text-center' rowSpan={2}>Result</td>
                                        <td className='border  text-center px-1' rowSpan={2}>Time</td>
                                        {
                                            Array.from(new Set([...MainHeader.map(x => x.LINE_TXT)])).map((item, index) => (
                                                <td key={index} className={`border text-center uppercase `} colSpan={2}>{item}</td>
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
                                                            isNextDay == true && <tr><td colSpan={MainHeader.length * 2} className={` border px-3 py-1 bg-black/80 text-white tracking-wide `}>วันที่ : {oWIP.YMD != '' ? <span className='text-yellow-400 font-semibold tracking-wider'>{moment(oWIP.YMD).format('DD/MM/YYYY')}</span> : <span className='text-red-500 drop-shadow-lg'>Datetime Invalid</span>}</td></tr>
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
                                                                                isHistory == true ? null : setMainWIPSelected({
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