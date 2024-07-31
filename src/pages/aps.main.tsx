import { Fragment, useEffect, useState } from 'react'
import moment from 'moment';
import { ApiGetMainPlan, ApiGetStockSubline } from '../service/aps.service';
import { ApsProductionPlanProps, PropsMain, StockHistory } from '../interface/aps.interface';
import { Comma, StyleTdMainPlan, StyleTextSublineStock } from '../Functions';
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined';
import { StockBalance, StockCurrent } from '../interface/aps.main.interface';
import { CircularProgress } from '@mui/material';
import ListPlanStatus from '../components/list.status';
export interface lineProps {
    text: string;
    value: string;
    icon?: any;
    iconBg?: string;
    iconColor?: string;
}
export interface PropsWip {
    time: string;
    modelname: string;
    plan: number;
}

function ApsMain() {
    let dateLoop: string = '';
    const [ymd] = useState<any>(moment());
    let columnMstr: string[] = ['statorMain', 'statorSubline', 'rotorMain', 'rotorSubline', 'hsMain', 'hsSubline', 'csMain', 'csSubline', 'fsSubline', 'fsSubline', 'lwMain', 'lwSubline', 'bodyMain', 'bodySubline', 'topMain', 'topSubline', 'bottomMain', 'bottomSubline'];
    const [planSelected, setPlanSelected] = useState<ApsProductionPlanProps | null>(null);
    const [openDialogNotice, setOpenDialogNotice] = useState<boolean>(false);
    const [MainPlans, setMainPlans] = useState<PropsMain[]>([]);
    // const [Stocks, setStocks] = useState<StockHistory[]>([]);
    // const [StockCurrent, setStockCurrent] = useState<StockCurrent[]>([]);
    // const [ModelInProcess, setModelInProcess] = useState<number | null>(0);
    const [stockTrans, setStockTrans] = useState<PropsWip[]>([]);
    // const [gastight, setGastight] = useState<Gastight | null>(null);
    const [stockBalance, setStockBalance] = useState<StockBalance[]>([]);
    const [stockCurrent, setStockCurrent] = useState<StockCurrent[]>([]);
    const [load, setLoad] = useState<boolean>(true);
    let cycleTime: number = 60;
    let LoopDate: string = '';
    let DrawDate: boolean = false;
    let oDate: string = '08:00';
    let oSeq: number = 0;
    let lastRow: boolean = false;
    useEffect(() => {
        init();
        // const intervalCall = setInterval(() => {
        //     init();
        // }, intervalTime);
        // return () => {
        //     clearInterval(intervalCall);
        // }
    }, [])

    const init = async () => {
        // setLoad(true);
        const resApiGetMainPlan = await ApiGetMainPlan({
            paramDate: ymd.format('YYYYMMDD'),
            paramWCNO: '904'
        });
        setMainPlans(resApiGetMainPlan);
        const res = await ApiGetStockSubline({
            ymd: ymd.format('YYYYMMDD')
        });
        setStockBalance(res.stockBalance);
        setStockCurrent(res.stockCurrent);
        setLoad(false);
    }
    useEffect(() => {
        try {
            if (stockBalance.length > 0) {
                let LoopDate: string = moment().format('HH:00');
                let TempPlan: any[] = [];
                let loop: number = 0;
                let remain: number = 0;
                let LastResult: number = stockBalance[stockBalance.length - 1].apsRemainPlan;
                let indexProcess: number = MainPlans.findIndex((x: PropsMain) => x.statusPlan == 'process');
                console.log(indexProcess)
                let index: number = indexProcess;
                while (index <= (MainPlans.length - 1)) {
                    let o: PropsMain = MainPlans[index];
                    let plan = loop == 0 ? LastResult : o.apsPlanQty;
                    let result = plan - 60;
                    if (remain > 0) {
                        result += remain;
                        remain = 0;
                    }
                    if (result >= 0 && result <= 60) {
                        remain = result;
                        TempPlan.push({ time: LoopDate, modelname: o.partNo, plan: plan });
                        LoopDate = moment(LoopDate, 'HH:mm').add(cycleTime, 'm').format('HH:mm');
                        index++;
                    } else if (result > 60) {
                        TempPlan.push({ time: LoopDate, modelname: o.partNo, plan: plan });
                        LoopDate = moment(LoopDate, 'HH:mm').add(cycleTime, 'm').format('HH:mm');
                        while (result > 60) {
                            result -= 60;
                            TempPlan.push({ time: LoopDate, modelname: '', plan: plan });
                            LoopDate = moment(LoopDate, 'HH:mm').add(cycleTime, 'm').format('HH:mm');
                            if (result < 60) {
                                remain = result;
                            }
                        }
                        index++;
                    } else if (result < 0) {
                        TempPlan.push({ time: LoopDate, modelname: o.partNo, plan: plan });
                        index++;
                    } else {
                        index++;
                    }
                    loop++;
                }
                setStockTrans(TempPlan);
            }
        } catch (e: any) {
            setStockTrans([]);
        }
    }, [stockBalance])

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
    return (
        <>
            <div className='grid sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-8 gap-9 '>
                <div className='sm:col-span-1 md:col-span-1 xl:col-span-2 flex flex-col gap-3  bg-gradient-to-r from-green-50 to-teal-50 p-6 border rounded-xl'>
                    <div className='flex items-end gap-3'>
                        <span>Main Scroll Sequence Plan</span>
                        <small className='text-teal-700'>แผนการผลิตประจำไลน์ Main</small>
                    </div>
                    <ListPlanStatus />
                    <table className='w-full bg-white text-[14px] shadow-md' id='tbMain'>
                        <thead className='border-b font-semibold select-none bg-[#F9FAFB]'>
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
                        <tbody className='text-[12px]'>
                            {
                                load ? <tr><td colSpan={4} className='border'><div className='flex w-full items-center flex-col p-6 gap-2'><CircularProgress sx={{ color: '#2563EB' }} /><span className='text-[14px]'>กำลังโหลดข้อมูล</span></div></td></tr> : MainPlans.length == 0 ? <tr><td colSpan={7} className='border py-2 text-center   text-red-600'>* ไม่พบแผนผลิต</td></tr> :
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
                                        let isDate: boolean = moment(o.apsPlanDate).format('DD/MM/YYYY') == moment().format('DD/MM/YYYY') ? true : false;
                                        let planStatus: string = o.statusPlan;
                                        planStatus = planStatus == '' ? 'wait' : planStatus;
                                        return <Fragment key={i}>
                                            {
                                                DrawDate == true && <tr className={`cursor-pointer select-none ${noPlan && 'opacity-50'}`} >
                                                    <td colSpan={6} className='border py-2 pl-3'><strong>{LoopDate}</strong></td>
                                                </tr>
                                            }
                                            <tr className={`${isDate == true ? (planStatus == 'wait' ? 'cursor-pointer' : (planStatus == 'process' ? 'bg-[#FFA500]/10' : 'bg-green-50')) : 'cursor-not-allowed opacity-40'} select-none ${noPlan && 'opacity-50'}`} >
                                                <td className={`border text-center ${planStatus == 'wait' ? 'bg-[#F9FAFB]' : (planStatus == 'process' ? 'bg-[#FFA500] text-black font-semibold' : 'bg-green-700 text-white')} font-semibold`} >
                                                    {
                                                        isDate == true ? o.prdSeq : <RemoveCircleOutlinedIcon className='text-[#ddd]' />
                                                    }
                                                </td>
                                                <td className={` pl-1  border`}>
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
                                            </tr>
                                        </Fragment>
                                    })
                            }
                        </tbody>
                    </table>
                </div>
                <div className='sm:col-span-1 md:col-span-1 xl:col-span-6 flex flex-col gap-3 align-top  bg-gradient-to-r from-teal-50 to-blue-100 p-6 border rounded-xl'>
                    <div className='flex items-end gap-3'>
                        <span>Main Scroll Current Stock</span>
                        <small className='text-teal-700'>แผนการผลิตที่ผ่านมาและจำนวนคงเหลือของวัตถุดิบ</small>
                    </div>
                    <ListPlanStatus />
                    <div className=' sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-5 overflow-auto'>
                        <table className="w-full  shadow-md text-sm bg-white" id='tbMainPlan'>
                            <thead className=''>
                                < tr className='font-semibold'>
                                    <td className='border  text-center ' rowSpan={2}>Seq.</td>
                                    <td className='border  text-center ' rowSpan={2}>Model no</td>
                                    <td className='border  text-center ' rowSpan={2}>Model</td>
                                    <td className='border  text-center ' rowSpan={2}><span className='text-green-700'>Result</span>/<br></br><span className='text-orange-700/70'>Remain</span></td>
                                    <td className='border  text-center ' rowSpan={2}>Time</td>
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
                                    <td className={`border text-center  `}>Main</td>
                                    <td className={`border text-center  `}>Casing</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    stockBalance.length == 0 ? <tr><td colSpan={32} className='border p-3 text-center   text-red-600'>* ไม่พบยอดการผลิตของวันนี้</td></tr> : <>
                                        {
                                            stockBalance.map((item: StockHistory | any, index: number) => {
                                                let modelName: string = item.modelname.replace('-10', '');
                                                let oStockCurrent: any[] = stockCurrent.filter(x => x.modelName == modelName);
                                                // let remainPlan: string | number = item.apsRemainPlan != null ? item.apsRemainPlan : '';
                                                oDate = moment(item.hhmm, 'HH:mm').format('HH:mm');
                                                lastRow = index == (stockBalance.length - 1);
                                                oSeq++;
                                                if (lastRow == true) {
                                                    oDate = moment().format('HH:00');
                                                } else {
                                                    oDate = moment(item.hhmm, 'HH:mm').format('HH:00');
                                                }
                                                let keys: string[] = Object.keys(item);
                                                let itemStock: any = (typeof oStockCurrent == 'object' && oStockCurrent.length > 0) ? oStockCurrent[0] : null;
                                                return <tr key={index} className={`${lastRow ? 'bg-[#FFA500]/70 font-semibold' : 'bg-gray-100/70'}`} >
                                                    <td className={`border text-center ${lastRow == true && 'py-2'}`}>{index + 1}</td>
                                                    <td className='border text-center'>{item.modelcode}</td>
                                                    <td className='border pl-1'>{modelName}</td>
                                                    <td className={`border text-end font-semibold drop-shadow-md ${lastRow == true ? '' : 'text-green-800'}`}>{Number(item.apsResult).toLocaleString('en')}</td>
                                                    <td className='border text-center bg-sky-200'>{oDate}</td>
                                                    {
                                                        columnMstr.map((oCol: string, iCol: number) => <td key={iCol} className={`border text-end ${lastRow == true && StyleTdMainPlan((lastRow == true && itemStock != null) ? itemStock[oCol] : '0')}`}>{keys.includes(oCol) == true ? Comma((lastRow == true && itemStock != null) ? itemStock[oCol] : item[oCol], '0') : ''}</td>)
                                                    }
                                                </tr>
                                            })
                                        }
                                        {
                                            stockTrans.slice(1, stockTrans.length - 1).map((item: PropsWip, index: number) => {
                                                let oStockCurrent: any[] = stockCurrent.filter(x => x.modelName == item.modelname.replace('-10', ''));
                                                let isMain: boolean = item.modelname != '';
                                                if (item.modelname != '') {
                                                    oSeq++;
                                                }
                                                let itemStock: any = (typeof oStockCurrent == 'object' && oStockCurrent.length > 0) ? oStockCurrent[0] : null;
                                                return <tr key={index} className={` ${(isMain == true && index == 0) && 'bg-gray-200'} }`}>
                                                    <td className={`border text-center ${isMain == true && 'py-1'}`}>{item.modelname != '' && oSeq}</td>
                                                    <td className='border'> </td>
                                                    <td className='border'>{item.modelname.replace('-10', '')}</td>
                                                    <td className='border text-end font-semibold text-orange-700/70 drop-shadow-md'>{isMain == true && item.plan}</td>
                                                    <td className={`border text-center ${'bg-sky-200'}`}>{moment(item.time, 'HH:mm').format('HH:00')}</td>
                                                    {
                                                        (itemStock != null && oStockCurrent.length > 0) ? <>
                                                            {
                                                                columnMstr.map((oCol: string, iCol) => <td key={iCol} className={`border text-end ${index == 0 ? StyleTdMainPlan(itemStock[oCol]) : StyleTextSublineStock(itemStock[oCol])}`}>{Comma(itemStock[oCol])}</td>)
                                                            }
                                                        </> : [...Array(18)].map((_: any, indexColSpan2: number) => <td key={indexColSpan2} className='border'></td>)
                                                    }
                                                </tr>
                                            })
                                        }
                                    </>
                                }

                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
            {/* <div className='grid grid-cols-1 gap-6 p-3 ' id='main_plan_page'>
                <div className='sm:col-span-1 rounded-lg hidden'>
                    <div className='sm:col-span-7 '>
                        <div className='flex  gap-2 bg-white rounded-lg border px-3 pt-[6px] pb-[6px] shadow-sm  items-center justify-center w-fit'>
                            <div className='cursor-pointer select-none hover:bg-[#4f46e510] rounded-full transition-all duration-300 text-white' onClick={() => setYmd(moment(ymd.format('YYYYMMDD')).subtract(1, 'days'))}><KeyboardArrowLeftOutlinedIcon className='text-gray-800' /></div>
                            <div className='select-none font-semibold'>{ymd.format('DD/MM/YYYY').toUpperCase()}</div>
                            <div className='cursor-pointer select-none hover:bg-[#4f46e510] rounded-full transition-all duration-300 text-white' onClick={() => setYmd(moment(ymd.format('YYYYMMDD')).add(1, 'days'))}><KeyboardArrowRightOutlinedIcon className='text-gray-800' /></div>
                        </div>
                    </div>
                </div>
                <div className='overflow-auto   grid grid-cols-1 gap-3'>
                    <div className='sm:col-span-1 flex justify-between items-center'>
                        <div className='select-none'>
                            <div className='flex items-center gap-2'>
                                <span className='text-xl font-semibold'>Main Scroll Sequence Plan</span>
                            </div>
                            <div className='text-sm text-gray-400'>แผนการผลิตประจำไลน์ Main </div>
                        </div>
                    </div>
                    <div className='grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-8 gap-3'>
                        <div className=' sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-3 overflow-auto '>
                            <table className='w-full shadow-lg text-sm' id='tbMainPlan'>
                                <thead>
                                    <tr>
                                        <td className='border py-1'>No.</td>
                                        <td className='border'>Model</td>
                                        <td className='border text-center'>Qty</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        MainPlans.map((item: PropsMain, index: number) => {
                                            if (LoopDate == '' || LoopDate != moment(item.apsPlanDate).format('YYYYMMDD')) {
                                                LoopDate = moment(item.apsPlanDate).format('YYYYMMDD');
                                                DrawDate = true;
                                            } else {
                                                DrawDate = false;
                                            }
                                            let isDate: boolean = moment(item.apsPlanDate).format('YYYYMMDD') == ymd.format('YYYYMMDD');
                                            return <>
                                                {
                                                    DrawDate == true && <tr>
                                                        <td className={`border text-start pl-3 py-1 ${isDate == true && 'font-semibold bg-yellow-200'}`} colSpan={4}>{moment(item.apsPlanDate).format('DD/MM/YYYY')} </td>
                                                    </tr>
                                                }
                                                <tr key={index} className={`${ModelInProcess == null ? '' : (index == ModelInProcess && isDate == true) ? 'bg-yellow-300' : ((isDate == true && index < ModelInProcess) ? 'bg-green-500' : '')}`}>
                                                    <td className='border text-center'>{item.prdSeq}</td>
                                                    <td className='border'>{item.partNo}</td>
                                                    <td className={`border text-end pr-[4px] ${isDate == true && 'font-semibold'}`}>{item.prdPlanQty}</td>
                                                </tr>
                                            </>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className=' sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-5 overflow-auto'>
                            <table className="w-full  shadow-md text-sm" id='tbMainPlan'>
                                <thead className=''>
                                    < tr className='font-semibold'>
                                        <td className='border border-[#a0a0a0] text-center ' rowSpan={2}>Seq.</td>
                                        <td className='border border-[#a0a0a0] text-center ' rowSpan={2}>Model no</td>
                                        <td className='border border-[#a0a0a0] text-center ' rowSpan={2}>Model</td>
                                        <td className='border border-[#a0a0a0] text-center ' rowSpan={2}>Remain<br></br>Plan</td>
                                        <td className='border border-[#a0a0a0] text-center ' rowSpan={2}>Time</td>
                                        <td className={`border text-center border-[#a0a0a0] py-1`} colSpan={2}>Stator</td>
                                        <td className={`border text-center border-[#a0a0a0]`} colSpan={2}>Rotor</td>
                                        <td className={`border text-center border-[#a0a0a0]`} colSpan={2}>Housing</td>
                                        <td className={`border text-center border-[#a0a0a0]`} colSpan={2}>CS</td>
                                        <td className={`border text-center border-[#a0a0a0]`} colSpan={2}>FS/OS</td>
                                        <td className={`border text-center border-[#a0a0a0]`} colSpan={2}>Lower</td>
                                        <td className={`border text-center border-[#a0a0a0]`} colSpan={2}>Pipe</td>
                                        <td className={`border text-center border-[#a0a0a0]`} colSpan={2}>Top</td>
                                        <td className={`border text-center border-[#a0a0a0]`} colSpan={2}>Bottom</td>
                                    </tr>
                                    < tr className='font-semibold'>
                                        <td className={`border text-center border-[#a0a0a0] py-1`}>Main</td>
                                        <td className={`border text-center border-[#a0a0a0] `}>Motor</td>
                                        <td className={`border text-center border-[#a0a0a0] `}>Main</td>
                                        <td className={`border text-center border-[#a0a0a0] `}>M/C</td>
                                        <td className={`border text-center border-[#a0a0a0] `}>Main</td>
                                        <td className={`border text-center border-[#a0a0a0] `}>M/C</td>
                                        <td className={`border text-center border-[#a0a0a0] `}>Main</td>
                                        <td className={`border text-center border-[#a0a0a0] `}>M/C</td>
                                        <td className={`border text-center border-[#a0a0a0] `}>Main</td>
                                        <td className={`border text-center border-[#a0a0a0] `}>M/C</td>
                                        <td className={`border text-center border-[#a0a0a0] `}>Main</td>
                                        <td className={`border text-center border-[#a0a0a0] `}>Casing</td>
                                        <td className={`border text-center border-[#a0a0a0] `}>Main</td>
                                        <td className={`border text-center border-[#a0a0a0] `}>Casing</td>
                                        <td className={`border text-center border-[#a0a0a0] `}>Main</td>
                                        <td className={`border text-center border-[#a0a0a0] `}>Casing</td>
                                        <td className={`border text-center border-[#a0a0a0] `}>Main</td>
                                        <td className={`border text-center border-[#a0a0a0] `}>Casing</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Stocks.map((item: StockHistory | any, index: number) => {
                                            let modelName: string = item.modelname.replace('-10', '');
                                            let oStockCurrent: any[] = stockCurrent.filter(x => x.modelName == modelName);
                                            let remainPlan: string | number = item.apsRemainPlan != null ? item.apsRemainPlan : '';
                                            oDate = moment(item.hhmm, 'HH:mm').format('HH:mm');
                                            lastRow = index == (Stocks.length - 1);
                                            oSeq++;
                                            if (lastRow == true) {
                                                oDate = moment().format('HH:00');
                                            } else {
                                                oDate = moment(item.hhmm, 'HH:mm').format('HH:00');
                                            }
                                            let keys: string[] = Object.keys(item);
                                            return <tr key={index} className={`${lastRow ? 'bg-yellow-300 font-semibold' : 'bg-gray-200'}`} >
                                                <td className={`border text-center ${lastRow == true && 'py-2'}`}>{index + 1}</td>
                                                <td className='border text-center'>{item.modelcode}</td>
                                                <td className='border'>{modelName}</td>
                                                <td className='border text-end'>{remainPlan.toLocaleString('en')}</td>
                                                <td className='border text-center bg-sky-200'>{oDate}</td>
                                                {
                                                    columnMstr.map((oCol: string, iCol: number) => <td key={iCol} className={`border text-end ${lastRow == true && StyleTdMainPlan(lastRow == true ? oStockCurrent[0][oCol] : item.fsMain)}`}>{keys.includes(oCol) == true ? Comma(lastRow ? oStockCurrent[0][oCol] : item[oCol], '0') : ''}</td>)
                                                }
                                            </tr>
                                        })
                                    }
                                    {
                                        stockTrans.slice(1, stockTrans.length - 1).map((item: PropsWip, index: number) => {
                                            let oStockCurrent: any[] = stockCurrent.filter(x => x.modelName == item.modelname.replace('-10', ''));
                                            let isMain: boolean = item.modelname != '';
                                            return <tr key={index} className={` ${(isMain == true && index == 0) && 'bg-gray-200'} }`}>
                                                <td className={`border text-center ${isMain == true && 'py-1'}`}>{oSeq}</td>
                                                <td className='border'> </td>
                                                <td className='border'>{item.modelname.replace('-10', '')}</td>
                                                <td className='border text-end '>{isMain == true && item.plan}</td>
                                                <td className={`border text-center ${'bg-sky-200'}`}>{moment(item.time, 'HH:mm').format('HH:00')}</td>
                                                {
                                                    (oStockCurrent.length > 0) ? <>
                                                        {
                                                            columnMstr.map((oCol: string, iCol) => <td key={iCol} className={`border text-end ${index == 0 ? StyleTdMainPlan(oStockCurrent[0][oCol]) : StyleTextSublineStock(oStockCurrent[0][oCol])}`}>{Comma(oStockCurrent[0][oCol])}</td>)
                                                        }
                                                    </> : [...Array(18)].map((_: any, indexColSpan2: number) => <td key={indexColSpan2} className='border'></td>)
                                                }
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div > */}
        </>
    )
}

export default ApsMain