//@ts-nocheck
import { Fragment, useEffect, useState } from 'react'
import moment from 'moment';
import { ApiGetLastGastight, ApiGetMainPlan } from '../service/aps.service';
// import { ApsProductionPlanProps, PropsMain, PropsWip } from '../interface/aps.interface';
import { StyleTdMainPlan, StyleTextSublineStock } from '../Functions';
// import { StockBalance, PropsWipCurrent } from '../interface/aps.main.interface';
import { CircularProgress } from '@mui/material';
import { intervalTime } from '../constants';
import DialogWipDetail from './dialog.wip.detail';
import { Spin, Steps, Tag } from 'antd';
import { LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import { PropShrinkGage } from '@/interface/aps.main.interface';
import APSMainSequence from './aps.main.seq';
import { PropsMain, PropsWip } from '@/interface/aps.interface';
// import DialogEditMainPlan from './aps.dialog.edit.main.plan';
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
    // const [planSelected, setPlanSelected] = useState<ApsProductionPlanProps | null>(null);
    // const [openDialogNotice,setOpenDialogNotice ] = useState<boolean>(false);
    const [mainSeq, setMainSeq] = useState<PropsMain[]>([]);
    const [Wips, setWips] = useState<PropsWip[]>([]);
    const [load, setLoad] = useState<boolean>(true);
    const [WipSelected, setWipSelected] = useState<PropsWipSelected | null>(null);
    const [OpenWipDetail, setOpenWipDetail] = useState<boolean>(false);
    const [lastGastight, setLastGastight] = useState<any | null>(null);
    const [ShrinkGage, setShrinkGage] = useState<PropShrinkGage>({ model: '', sebango: '', insertDate: '' });
    // let DrawDate: boolean = false;
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
        const res = await ApiGetMainPlan({
            paramDate: ymd.format('YYYYMMDD'),
            paramWCNO: '904'
        });
        setMainSeq(res.main);
        setWips(res.wip);
        if (typeof res.shrinkgage != 'undefined') {
            setShrinkGage(res.shrinkgage)
        }
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
    // useEffect(() => {
    //     if (openDialogNotice == false) {
    //         setPlanSelected(null)
    //     }
    // }, [openDialogNotice])
    // useEffect(() => {
    //     if (planSelected != null && Object.keys(planSelected).length > 0) {
    //         setOpenDialogNotice(true);
    //     }
    // }, [planSelected]);

    useEffect(() => {
        if (WipSelected != null) {
            setOpenWipDetail(true);
        }
    }, [WipSelected])
    useEffect(() => {
        if (OpenWipDetail == false) { setWipSelected(null) }
    }, [OpenWipDetail])
    return (
        <>
            <Spin spinning={load} tip = 'กำลังโหลดข้อมูล'>
                <div className='grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-8 xl:grid-cols-8 gap-9'>
                    <APSMainSequence  mainSeq={mainSeq} loadMain = {init} />
                    <div className='sm:col-span-1 md:col-span-1 lg:col-span-5 xl:col-span-6 flex flex-col gap-3 align-top  bg-gradient-to-r from-teal-50 to-blue-100 p-4 border rounded-xl'>
                        <div className='grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-5 gap-3'>
                            <div className='sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-2  flex  flex-col justify-start gap-2'>
                                <div className='flex flex-col'>
                                    <span>Main Scroll Current Stock</span>
                                    <small className='text-teal-700'>แผนการผลิตที่ผ่านมาและจำนวนคงเหลือของวัตถุดิบ</small>
                                </div>
                                <div className='flex items-center gap-3 '>
                                    <div className='flex items-center gap-1'>
                                        <div className='w-3 h-3 rounded-sm bg-[#FFA500] border border-black/40'></div>
                                        <small className={`tracking-wide`}>กำลังผลิต</small>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <div className='w-3 h-3 rounded-sm bg-blue-400 border border-black/40'></div>
                                        <small className={`tracking-wide`}>
                                            ผลิตถัดไป</small>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <div className='w-3 h-3 rounded-sm bg-white border border-black/40'></div>
                                        <small className={`tracking-wide`}>รอผลิต</small>
                                    </div>
                                </div>
                            </div>
                            <div className='sm:col-span-1 md:col-span-1 lg:col-start-1 lg:col-end-6 xl:col-span-3'>
                                <Steps
                                    className='bg-white px-6 pt-2 pb-3 rounded-md shadow-md'
                                    items={[
                                        {
                                            title: <div>
                                                <div className='flex gap-3 items-center'>
                                                    <small>Shrink gage</small>
                                                    <Tag color={typeof ShrinkGage.model != 'undefined' ? '#52c41a' : '#dc2626'}>{typeof ShrinkGage.model != 'undefined' ? 'ผลิต' : 'ยังไม่ผลิต'}</Tag>
                                                </div>
                                                {
                                                    typeof ShrinkGage.model != 'undefined' && <div className='flex items-center leading-none gap-1'>
                                                        <small className='font-bold'>{ShrinkGage.sebango} {`${ShrinkGage.model}`}</small>
                                                    </div>
                                                }

                                            </div>,
                                            status: 'finish',
                                            icon: typeof ShrinkGage.model != 'undefined' ? <LoadingOutlined className={`text-[#52c41a]`} /> : <CloseOutlined className={`text-[#dc2626]`} />,
                                        },
                                        {
                                            title: <div>
                                                <div className='flex gap-3 items-center'>
                                                    <small>Gastight</small>
                                                    <Tag color={lastGastight != null ? '#2ec41a' : '#dc2626'}>{lastGastight != null ? 'ผลิต' : 'ยังไม่ผลิต'}</Tag>
                                                </div>
                                                {
                                                    lastGastight != null && <div className='flex items-center leading-none gap-1'>
                                                        <small className='font-bold'>{lastGastight.modelName} {lastGastight.modelCode}</small>
                                                    </div>
                                                }
                                            </div>,
                                            status: 'finish',
                                            icon: lastGastight != null ? <LoadingOutlined className={`text-[#2ec41a] font-bold`} /> : <CloseOutlined className={`text-[#dc2626]`} />,
                                        },
                                    ]}
                                />
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
                                <tbody className='sm:text-[10px] lg:text-[12px] xl:text-[12px]  2xl:text-[14px]'>
                                    {
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
                                                style = 'bg-yellow-500/50'
                                            }
                                            return isNextDay == true ? <tr key={iWip}><td colSpan={24} className='border px-3 py-1 bg-black/80 text-white'>วันถัดไป : {oWip.hhmm}</td></tr> : <tr key={iWip} className={`${style} ${isWipCurrent == true && 'drop-shadow-xl font-semibold'} ${(isWipCurrent == true) && 'bg-[#FFA500]/20'}`}>
                                                <td className={`border text-center ${isWipCurrent == true && 'bg-[#FFA500]/50'}`}>{oWip.apsSeq}</td>
                                                <td className='border text-center '>{isMain == true && oWip.modelcode}</td>
                                                <td className='border  pl-[4px]'>{oWip.modelname}</td>
                                                <td className={`border text-end ${isWipCurrent == true && 'font-semibold'}  ${isMain == true ? 'bg-[#FFA500]/20' : 'bg-[#FFA500]/5'}`}>{oWip.apsRemainPlan != 0 ? oWip.apsRemainPlan : ''}</td>
                                                <td className={`border text-end ${(isWipNext == true || isProductOfPart == true) ? 'text-blue-700' : 'text-green-700'} font-semibold pr-[4px] ${isWipCurrent == true && 'py-2'}`}>
                                                    <div className='flex justify-end items-center gap-3'>
                                                        {isWipCurrent == true && <span className="relative flex h-3 w-3">
                                                            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-500 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
                                                        </span>}<span className={` ${isWipCurrent == true ? 'opacity-100' : 'opacity-70 drop-shadow-lg'}`}>{oWip.apsResult != 0 ? oWip.apsResult : ''}</span>
                                                    </div>
                                                </td>
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
                                                            console.log({
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
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div >
            </Spin>
            <DialogWipDetail open={OpenWipDetail} setOpen={setOpenWipDetail} wip={WipSelected} type={''} />
        </>
    )
}

export default MainPlan