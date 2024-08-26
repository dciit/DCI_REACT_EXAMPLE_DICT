//@ts-nocheck
import { ChangeEvent, Fragment, useEffect, useState } from 'react'
import { API_APS_RESULT, API_APS_UPDATE_RESULT, ApiBackflushPrivilege } from '../service/aps.service';
import moment from 'moment';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { APSResultPartProps, EkbWipPartStock, EkbWipPartStockTransactionProps, PartGroupMasterProps } from '../interface/aps.interface';
import { lines } from '../constants';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import { useSelector } from 'react-redux';
import DialogLogin from '../components/dialog.login';
import { useDispatch } from 'react-redux';
import { PropsBackflushFilter } from '../redux/initReducer';
import { Button, Spin } from 'antd';
import ApsLoading from '@/components/aps.loading';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import e from 'express';
function ApsBackflush() {
    const dispatch = useDispatch();
    const redux = useSelector((state: any) => state.redux);
    let login: boolean = redux.login;
    let empcode: string = redux.empcode;
    // let lineSelected: string = typeof redux.backflush == 'undefined' ? lines[0] : redux.backflush?.line;
    const [openLogin, setOpenLogin] = useState<boolean>(false);
    const dtNow: any = moment().add('hours', -8);
    const [parts, setParts] = useState<APSResultPartProps[]>([]);
    const [stock, setStock] = useState<EkbWipPartStockTransactionProps[]>([]);
    const [inpValue, setInpValue] = useState<number>(0);
    const [partGroupMaster, setPartGroupMaster] = useState<PartGroupMasterProps[]>([]);
    const [stockMain, setStockMain] = useState<EkbWipPartStock[]>([]);
    const [isHiddenStd, setIsHiddenStd] = useState<boolean>(true);
    const [privileges, setPrivileges] = useState<string[]>([])
    let timeStart: number = 10;
    const [once, setOnce] = useState<boolean>(true);
    let reduxBackflush: PropsBackflushFilter = redux.backflush == undefined ? {} : redux.backflush;
    const [ymd, setYmd] = useState<string>(moment().subtract(8, 'hours').format('YYYYMMDD'));
    const [line, setLine] = useState<string>(lines[0].value);
    // let line: string = (reduxBackflush.line == undefined || reduxBackflush.line == 'undefined') ? lines[0].value : reduxBackflush.line;
    const [load, setLoad] = useState<boolean>(true);
    const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);
    useEffect(() => {
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
            clearInterval(intervalId)
        }
    }, [])
    const init = async (load: boolean) => {
        if (load == true) {
            setLoad(true);
        }
        let ApiBFPriv = await ApiBackflushPrivilege(empcode == '' ? '-' : empcode);
        setPrivileges(ApiBFPriv)
        let ApiApsResult = await API_APS_RESULT({
            wc: line,
            ym: moment(ymd).format('YYYYMM'),
            ymd: ymd
        });
        setPartGroupMaster(ApiApsResult.partGroupMaster);
        setParts(ApiApsResult.parts);
        setStock(ApiApsResult.data);
        setStockMain(ApiApsResult.stockMain);
        setOnce(false);
        if (load == true) {
            setLoad(false);
        }
    }
    const handleUpdateResult = async (shift: string, period: string, wcno: string, partno: string, cm: string) => {
        let ApiUpdateResult = await API_APS_UPDATE_RESULT({
            ym: moment(ymd).format('YYYYMM'),
            ymd: ymd,
            shift: shift,
            wcno: wcno,
            partno: partno,
            cm: cm,
            type: 'IN',
            qty: Number(inpValue) < 0 ? 0 : Number(inpValue),
            period: period,
            createBy: empcode
        });
        if (ApiUpdateResult.status == true) {
            init(false);
        }
    }
    useEffect(() => {
        init(true);
    }, [line, ymd]);


    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight - ((30 / 100) * window.innerHeight));
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <div className='pt-3 px-3 flex flex-col' id='upload-result'>
            <div className='mb-3'>
                {/* {
                    windowHeight
                } */}
                {/* <div className='flex  gap-2 bg-white rounded-lg border px-3 pt-[6px] pb-[6px] shadow-sm  items-center justify-center w-fit'>
                    <div className='cursor-pointer select-none hover:bg-[#4f46e510] rounded-full transition-all duration-300 text-white' onClick={() => dispatch({
                        type: 'BACKFLUSH_SET_FILTER', payload: {
                            ymd: moment(ymd).subtract(1, 'days').format('YYYYMMDD'), line: line
                        }
                    })}><KeyboardArrowLeftOutlinedIcon className='text-gray-800' /></div>
                    <div className='select-none font-semibold'>{moment(ymd).format('DD/MM/YYYY').toUpperCase()}</div>
                    <div className='cursor-pointer select-none hover:bg-[#4f46e510] rounded-full transition-all duration-300 text-white' onClick={() => dispatch({
                        type: 'BACKFLUSH_SET_FILTER', payload: {
                            ymd: moment(ymd).add(1, 'days').format('YYYYMMDD'), line: line
                        }
                    })}><KeyboardArrowRightOutlinedIcon className='text-gray-800' /></div>
                </div> */}
                <div className='flex items-center gap-2'>
                    <div className='flex  gap-2 bg-white rounded-lg border px-3 pt-[6px] pb-[6px] shadow-sm  items-center justify-center w-fit'>
                        <div className='cursor-pointer select-none hover:bg-[#4f46e510] rounded-full transition-all duration-300 text-white' onClick={() => setYmd(moment(ymd).subtract(1, 'days').format('YYYYMMDD'))}><KeyboardArrowLeftOutlinedIcon className='text-gray-800' /></div>
                        <div className='select-none font-semibold'>{moment(ymd).format('DD/MM/YYYY').toUpperCase()}</div>
                        <div className='cursor-pointer select-none hover:bg-[#4f46e510] rounded-full transition-all duration-300 text-white' onClick={() => setYmd(moment(ymd).add(1, 'days').format('YYYYMMDD'))}><KeyboardArrowRightOutlinedIcon className='text-gray-800' /></div>
                    </div>
                    <Button className='pl-3' type='primary' icon={<NearMeOutlinedIcon />} onClick={() => setYmd(moment().format('YYYYMMDD'))}>Today</Button>
                </div>
                <small className='text-red-600'>* ระบบสามารถลงยอดผลิตได้ภายในวันปัจจุบัน หากต้องการลงยอดผลิตวันอื่นๆ ติดต่อ 208 (SCM)</small>
            </div>
            <div id='tab' className='pb-3 flex    w-full cursor-pointer select-none  '>
                <div className='flex grow gap-6'>
                    <div className='flex shadow-sm'>
                        {
                            lines.map((oLine: any, iLine: number) => {
                                return <div key={iLine} className={`hover:text-blue-500 hover:font-semibold   bg-white ${oLine.value == line ? 'font-semibold text-blue-600' : 'text-gray-400 font-light'} transition-all duration-300 py-2 ${lines.length == 1 ? 'border rounded-md pl-4 pr-3 ' : (iLine == (lines.length - 1) ? 'border-r border-y rounded-r-md pl-3 pr-4' : (iLine == 0) ? 'border-l rounded-l-md border-y pl-4 pr-3' : 'border px-4')}`} onClick={() => {
                                    // dispatch({
                                    //     type: 'BACKFLUSH_SET_FILTER', payload: {
                                    //         ymd: ymd, line: oLine.value
                                    //     }
                                    // })
                                    setLine(oLine.value)
                                }}>{oLine.text}</div>
                            })
                        }
                    </div>
                </div>
                {/* <div className='flex-none '>
                    <div className={`static right-0 top-0 w-fit transition-all duration-300 border rounded-md px-3 py-1 bg-white flex gap-2 items-center shadow-sm text-gray-600`} onClick={() => setIsHiddenStd(!isHiddenStd)}>
                        {
                            isHiddenStd ? <RemoveRedEyeIcon /> : <VisibilityOffIcon />
                        }
                        <span>({isHiddenStd ? 'เปิด' : 'ปิด'}) Standard</span>
                    </div>
                </div> */}
            </div>
            <div className={`grow overflow-y-auto block`} style={{ height: `${windowHeight}px` }}>
                {
                    load ? <ApsLoading /> : <table className='w-full text-[14px] bg-white ' id='tbBackflush'>
                        <thead className='font-semibold bg-blue-300 border-[#4f46e5] sticky top-0'>
                            <tr>
                                <td rowSpan={3} className='border pl-2 w-[10%]'>MODEL</td>
                                <td rowSpan={3} className='border pl-2 w-[10%]'>CODE MODEL</td>
                                <td colSpan={7} className={`${isHiddenStd && 'hidden'} border text-center w-[10%]`}>Machine (Data base)</td>
                                <td rowSpan={2} colSpan={2} className='border text-center  py-1 w-[10%]'>STOCK</td>
                                <td rowSpan={1} colSpan={12} className='border text-center'>TIME</td>
                                <td rowSpan={3} className='border bg-blue-600 text-center text-white'>Total</td>
                            </tr>
                            <tr>
                                <td className='border text-center' colSpan={6}>DAY</td>
                                <td className='border text-center' colSpan={6}>NIGHT</td>
                            </tr>
                            <tr>
                                <td className={`${isHiddenStd && 'hidden'} border text-center`} rowSpan={2}>M/C (Unit)</td>
                                <td className={`${isHiddenStd && 'hidden'} border text-center`} rowSpan={2}>CT/MC</td>
                                <td className={`${isHiddenStd && 'hidden'} border text-center`} rowSpan={2}>CT</td>
                                <td className={`${isHiddenStd && 'hidden'} border text-center`} rowSpan={2}> (Hr)</td>
                                <td className={`${isHiddenStd && 'hidden'} border text-center`} rowSpan={2}>(Shift)</td>
                                <td className={`${isHiddenStd && 'hidden'} border text-center`} rowSpan={2}>(Day)</td>
                                <td className={`${isHiddenStd && 'hidden'} border text-center`} rowSpan={2}>Need Day</td>
                                <td className='border text-center w-[5%] py-1 bg-orange-300'>{line == 'MC' ? 'M/C' : (line == 'MOTOR' ? 'MOTOR' : 'CASING')}</td>
                                <td className='border text-center w-[5%] bg-yellow-400'>MAIN</td>
                                {
                                    [...Array(12)].map((_: any, i: number) => {
                                        let hour = ((timeStart + (i * 2)) >= 24 ? ((timeStart + (i * 2)) - 24) : (timeStart + (i * 2))).toString().padStart(2, '0')
                                        if (i == 11) {
                                            hour = moment(hour, 'HH').subtract(10, 'minutes').format('HH:mm')
                                        } else {
                                            hour = moment(hour, 'HH').format('HH:mm')
                                        }
                                        return <td key={i} rowSpan={2} className='border text-center w-[5%] py-1'>{`${hour}`}</td>
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                partGroupMaster.map((oPartGroup: PartGroupMasterProps, iPartGroup: number) => {
                                    let rowOfPartGroup: APSResultPartProps[] = parts.filter((o: APSResultPartProps) => o.part_group == oPartGroup.part);
                                    let TotalGroups: number = 0;
                                    return <Fragment key={iPartGroup}>
                                        {
                                            rowOfPartGroup.map((oScheme: APSResultPartProps, iScheme: number) => {
                                                let RowStockMC: EkbWipPartStock[] = stockMain.filter((x => x.partno == oScheme.partno && x.wcno == oScheme.wcno && x.cm == oScheme.cm));
                                                let totalStockMC: number = RowStockMC.reduce((a, b) => a + b.bal, 0);
                                                let RowStockMain: EkbWipPartStock[] = stockMain.filter((x => x.partno == oScheme.partno && x.wcno == "904" && x.cm == oScheme.cm));
                                                let totalStockMain: number = RowStockMain.reduce((a, b) => a + b.bal, 0);
                                                let RowTransactions = stock.filter((x => x.partno == oScheme.partno && x.wcno == oScheme.wcno && x.cm == oScheme.cm));
                                                let Totals: number = 0;
                                                try {
                                                    Totals = RowTransactions.reduce((a, b) => a + b.transQty, 0);
                                                } catch {
                                                    Totals = 0;
                                                }
                                                TotalGroups += Totals;
                                                return <Fragment key={iScheme}>
                                                    {
                                                        iScheme == 0 && <Fragment key={`B-${iScheme}`}>
                                                            <tr>
                                                                <td colSpan={17} className='border  text-white font-semibold text-center h-[14px] bg-transparent'></td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan={17} className='border py-2 bg-blue-600 text-white font-semibold text-center'>{oPartGroup.part} ({oPartGroup.partName})</td>
                                                            </tr>
                                                        </Fragment>
                                                    }
                                                    <tr key={iScheme + '' + iPartGroup}>
                                                        <td className='border pl-2 bg-blue-200'>
                                                            <div className='flex flex-col items-start break-words'>
                                                                <span className='font-bold'>{oScheme.partno} {oScheme.cm}
                                                                    <small className='ml-1'>({oScheme.wcno})</small>
                                                                </span>
                                                                <span className='text-[12px] text-black font-semibold'>{oScheme.model_common}</span>
                                                            </div>
                                                        </td>
                                                        <td className={`${isHiddenStd && 'hidden'} border text-center`}>{oScheme.stdMC > 0 ? oScheme.stdMC : ''}</td>
                                                        <td className={`${isHiddenStd && 'hidden'} border text-center`}>{oScheme.stdCTMC > 0 ? oScheme.stdCTMC : ''}</td>
                                                        <td className={`${isHiddenStd && 'hidden'} border text-center`}>{oScheme.stdCT > 0 ? oScheme.stdCT : ''}</td>
                                                        <td className={`${isHiddenStd && 'hidden'} border text-center`}>{oScheme.stdCapHR > 0 ? oScheme.stdCapHR : ''}</td>
                                                        <td className={`${isHiddenStd && 'hidden'} border text-center`}>{oScheme.stdCapShift > 0 ? oScheme.stdCapShift : ''}</td>
                                                        <td className={`${isHiddenStd && 'hidden'} border text-center`}>{oScheme.stdCapDay > 0 ? oScheme.stdCapDay : ''}</td>
                                                        <td className={`${isHiddenStd && 'hidden'} border text-center`}>{oScheme.stdNeedDay > 0 ? oScheme.stdNeedDay : ''}</td>
                                                        <td className={` border  pr-1 text-[12px] text-wrap `}>
                                                            {oScheme.modelcode}
                                                        </td>
                                                        <td className={`bg-orange-200 border text-end pr-1 font-bold ${totalStockMC < 0 && 'text-red-500'}`}>{totalStockMC != 0 ? totalStockMC.toLocaleString('en') : ''}</td>
                                                        <td className={`border bg-yellow-200 text-end pr-1 font-bold ${totalStockMain < 0 && 'text-red-500'}`}>{totalStockMain != 0 ? totalStockMain.toLocaleString('en') : ''}</td>
                                                        {
                                                            [...Array(12)].map((_: any, i: number) => {
                                                                let period = ((timeStart + (i * 2)) >= 24 ? ((timeStart + (i * 2)) - 24) : (timeStart + (i * 2))).toString().padStart(2, '0');
                                                                if (i == 11) {
                                                                    period = moment(period, 'HH').subtract(10, 'minutes').format('HH:mm')
                                                                } else {
                                                                    period = moment(period, 'HH').format('HH:mm')
                                                                }
                                                                let shift: string = i < 6 ? 'D' : 'N';
                                                                let indexStock: number = stock.findIndex((x => x.wcno == oScheme.wcno && x.shift == shift && x.partno == oScheme.partno && x.ym == moment(ymd, 'YYYYMMDD').format('YYYYMM') && x.qrcodeData == period));
                                                                let Qty: number = indexStock != -1 ? stock[indexStock].transQty : 0;
                                                                let isDate: boolean = ymd == dtNow.format('YYYYMMDD');
                                                                let readOnly: boolean = (isDate == true && privileges.filter((x => x == oScheme.wcno)).length) ? false : true;
                                                                if (empcode == '41078') {
                                                                    readOnly = false;
                                                                }
                                                                return <td className='border' key={i}>
                                                                    <input type='number' className={`${readOnly == false ? (`${Qty > 0 ? 'border-green-700' : 'border-blue-400'} focus:outline-blue-500 caret-blue-600 bg-blue-100`) : 'bg-gray-200  cursor-not-allowed focus:outline-none'}  border w-full font-semibold rounded-sm h-[37.5px] text-end pr-2 text-md ${Qty > 0 && 'bg-green-100 text-green-800 font-semibold border-1 border-green-700'}`}
                                                                        readOnly={readOnly}
                                                                        onClick={() => {
                                                                            if (login == false) {
                                                                                setOpenLogin(true);
                                                                            }
                                                                        }}
                                                                        onBlur={(_: ChangeEvent<HTMLInputElement>) => {
                                                                            if (readOnly == false && login == true) {
                                                                                handleUpdateResult(shift, period, oScheme.wcno, oScheme.partno, oScheme.cm)
                                                                            }
                                                                        }}
                                                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                                            if (e.target.value == '') {
                                                                                setInpValue(0);
                                                                            } else {
                                                                                try {
                                                                                    setInpValue(Number(e.target.value) > 0 ? Number(e.target.value) : 0)
                                                                                } catch {
                                                                                    setInpValue(0)
                                                                                }
                                                                            }
                                                                        }}
                                                                        defaultValue={(Qty == 0) ? '' : Qty}
                                                                        onFocus={(_: ChangeEvent<HTMLInputElement>) => {
                                                                            if (readOnly == false) {
                                                                                setInpValue(Qty)
                                                                            }
                                                                        }}
                                                                    />
                                                                </td>
                                                            })
                                                        }
                                                        <td className={`border  text-end pr-[4px] font-semibold bg-blue-200 `}>{Totals > 0 && Totals.toLocaleString('en')}</td>
                                                    </tr>
                                                    {
                                                        iScheme == (rowOfPartGroup.length - 1) && <Fragment key={`C-${iScheme}`}>
                                                            <tr>
                                                                <td colSpan={16} className='border  font-semibold text-end py-2 bg-blue-200 pr-[8px]'>TOTAL</td>
                                                                <td colSpan={1} className='border  font-semibold text-end pr-[4px] py-2 bg-blue-300 '>{TotalGroups > 0 ? TotalGroups.toLocaleString('en') : '-'}</td>
                                                            </tr>
                                                        </Fragment>
                                                    }
                                                </Fragment>
                                            })
                                        }
                                    </Fragment>
                                })
                            }
                            {
                                partGroupMaster.length == 0 && <tr>
                                    <td colSpan={17} className='border py-3 text-center'>ไม่พบข้อมูล</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                }
            </div>
            <DialogLogin open={openLogin} setOpen={setOpenLogin} />
        </div >
    )
}

export default ApsBackflush