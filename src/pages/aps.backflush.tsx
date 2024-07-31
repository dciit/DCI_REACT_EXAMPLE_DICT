import { ChangeEvent, useEffect, useState } from 'react'
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
function ApsBackflush() {
    const dispatch = useDispatch();
    const redux = useSelector((state: any) => state.redux);
    let login: boolean = redux.login;
    let empcode: string = redux.empcode;
    let lineSelected: string = typeof redux.backflush == 'undefined' ? lines[0] : redux.backflush?.line;
    const [openLogin, setOpenLogin] = useState<boolean>(false);
    // const createBy: string = '41256 PEERAPONG.k';
    const dtNow: any = moment().add('hours',-8);
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
    // const [ymd, setYmd] = useState<any>(reduxBackflush.ymd != undefined ? moment(reduxBackflush.ymd) : dtNow);
    // const [lineSelected, setLineSelected] = useState<any>(reduxBackflush.line != undefined ? (lines.filter(x => x.value == reduxBackflush.line).length ? lines.filter(x => x.value == reduxBackflush.line)[0] : '') : {})
    let ymd: string = (reduxBackflush.ymd == undefined || reduxBackflush.ymd == 'undefined') ? dtNow.format('YYYYMMDD') : moment(reduxBackflush.ymd).format('YYYYMMDD');
    let line: string = (reduxBackflush.line == undefined || reduxBackflush.line == 'undefined') ? lines[0].value : reduxBackflush.line;
    const init = async () => {
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
            qty: Number(inpValue),
            period: period,
            createBy: empcode
        });
        if (ApiUpdateResult.status == true) {
            init();
        }
    }
    useEffect(() => {
        if (once == false) {
            location.reload();
        }
    }, [line, ymd]);

    useEffect(() => {
        if (once == true) {
            init();
        }
    }, [once]);
    return (
        <div className='pt-3 px-3 flex flex-col' id='upload-result'>
            <div className='mb-3'>
                <div className='flex  gap-2 bg-white rounded-lg border px-3 pt-[6px] pb-[6px] shadow-sm  items-center justify-center w-fit'>
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
                </div>
                <small className='text-red-600'>* ระบบสามารถลงยอดผลิตได้ภายในวันปัจจุบัน หากต้องการลงยอดผลิตวันอื่นๆ ติดต่อ 208 (SCM)</small>
            </div>
            <div id='tab' className='pb-3 flex   sticky top-0  w-full cursor-pointer select-none  '>
                <div className='flex grow gap-6'>
                    <div className='flex shadow-sm'>
                        {
                            lines.map((oLine: any, iLine: number) => {
                                return <div key={iLine} className={`hover:text-blue-500 hover:font-semibold   bg-white ${oLine.value == line ? 'font-semibold text-blue-600' : 'text-gray-400 font-light'} transition-all duration-300 py-2 ${lines.length == 1 ? 'border rounded-md pl-4 pr-3 ' : (iLine == (lines.length - 1) ? 'border-r border-y rounded-r-md pl-3 pr-4' : (iLine == 0) ? 'border-l rounded-l-md border-y pl-4 pr-3' : 'border px-4')}`} onClick={() => dispatch({
                                    type: 'BACKFLUSH_SET_FILTER', payload: {
                                        ymd: ymd, line: oLine.value
                                    }
                                })}>{oLine.text}</div>
                            })
                        }
                    </div>
                </div>
                <div className='flex-none '>
                    <div className={`static right-0 top-0 w-fit transition-all duration-300 border rounded-md px-3 py-1 bg-white flex gap-2 items-center shadow-sm text-gray-600`} onClick={() => setIsHiddenStd(!isHiddenStd)}>
                        {
                            isHiddenStd ? <RemoveRedEyeIcon /> : <VisibilityOffIcon />
                        }
                        <span>({isHiddenStd ? 'เปิด' : 'ปิด'}) Standard</span>
                    </div>
                </div>
            </div>
            <div className=' grow overflow-y-auto '>
                <table className='w-full text-[14px] bg-white ' id='tbBackflush'>
                    <thead className='font-semibold bg-blue-300 border-[#4f46e5] '>
                        <tr>
                            {/* <td className='border text-center py-2 w-[7.5%]' rowSpan={3}>LINE</td> */}
                            <td rowSpan={3} className='border pl-2 w-[10%]'>MODEL</td>
                            <td rowSpan={3} className='border pl-2 w-[10%]'>CODE MODEL</td>
                            <td colSpan={7} className={`${isHiddenStd && 'hidden'} border text-center w-[10%]`}>Machine (Data base)</td>
                            <td rowSpan={2} colSpan={2} className='border text-center  py-1 w-[10%]'>STOCK</td>
                            <td rowSpan={1} colSpan={12} className='border text-center'>TIME</td>
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
                            {/* <td className='border text-center w-[5%] py-1 bg-orange-300'>{M/C}</td> */}
                            <td className='border text-center w-[5%] py-1 bg-orange-300'>{lineSelected == 'MC' ? 'M/C' : (lineSelected == 'MOTOR' ? 'MOTOR' : 'CASING')}</td>
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
                                // let rowSpan: number = rowOfPartGroup.length + 1;
                                return <>
                                    {/* <tr key={iPartGroup}>
                                        <td className='border bg-blue-200 text-top' rowSpan={rowSpan}>
                                            <div className='flex flex-col  items-center justify-end h-[100%]'>
                                                <span className='font-semibold text-lg'>{oPartGroup.part}</span>
                                                <span className='text-[10px]  font-semibold'>{oPartGroup.partName}</span>
                                            </div>
                                        </td>
                                    </tr > */}
                                    {
                                        rowOfPartGroup.map((oScheme: APSResultPartProps, iScheme: number) => {
                                            let RowStockMC: EkbWipPartStock[] = stockMain.filter((x => x.partno == oScheme.partno && x.wcno == oScheme.wcno));
                                            let totalStockMC: number = RowStockMC.reduce((a, b) => a + b.bal, 0);
                                            let RowStockMain: EkbWipPartStock[] = stockMain.filter((x => x.partno == oScheme.partno && x.wcno == "904"));
                                            let totalStockMain: number = RowStockMain.reduce((a, b) => a + b.bal, 0);
                                            return <>
                                                {
                                                    iScheme == 0 && <>
                                                        <tr>
                                                            <td colSpan={16} className='border  text-white font-semibold text-center h-[14px] bg-transparent'></td>
                                                        </tr>
                                                        <tr>
                                                            <td colSpan={16} className='border py-2 bg-blue-600 text-white font-semibold text-center'>{oPartGroup.part} ({oPartGroup.partName})</td>
                                                        </tr>
                                                    </>
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
                                                            let readOnly: boolean = (ymd == dtNow.format('YYYYMMDD') && privileges.filter((x => x == oScheme.wcno)).length) ? false : true;
                                                            return <td className='border' key={i}><input type='number' className={`${!readOnly ? `${Qty > 0 ? 'border-green-700' : 'border-blue-400'} focus:outline-blue-500 caret-blue-600 bg-blue-100` : 'bg-gray-200  cursor-not-allowed focus:outline-none'}  border w-full font-semibold rounded-sm h-[37.5px] text-end pr-2 text-md ${Qty > 0 && 'bg-green-100 text-green-800 font-semibold border-1 border-green-700'}`}
                                                                readOnly={readOnly}
                                                                onClick={() => {
                                                                    if (readOnly == false && login == false) {
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
                                                                        setInpValue(Number(e.target.value))
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
                                                </tr>
                                            </>
                                        })
                                    }
                                </>
                            })
                        }
                        {
                            partGroupMaster.length == 0 && <tr>
                                <td colSpan={16} className='border py-3 text-center'>ไม่พบข้อมูล</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
            <DialogLogin open={openLogin} setOpen={setOpenLogin} />
        </div >
    )
}

export default ApsBackflush