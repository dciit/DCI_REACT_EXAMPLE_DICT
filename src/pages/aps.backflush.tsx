import { ChangeEvent, useEffect, useState } from 'react'
import { API_APS_RESULT, API_APS_UPDATE_RESULT, ApiGetPartMaster } from '../service/aps.service';
import moment from 'moment';
import { Paper, TableContainer } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { APSResultPartProps, DictMstr, EkbWipPartStock, EkbWipPartStockTransactionProps, PartGroupMasterProps, PropsPartMaster } from '../interface/aps.interface';
import { lines } from '../constants';

function ApsBackflush() {
    const createBy: string = '41256 PEERAPONG.k';
    const dtNow: any = moment();
    const [ymd, setYmd] = useState<string>(dtNow.format('YYYYMMDD'))
    const [parts, setParts] = useState<APSResultPartProps[]>([]);
    const [stock, setStock] = useState<EkbWipPartStockTransactionProps[]>([]);
    const [partGroupMaster, setPartGroupMaster] = useState<PartGroupMasterProps[]>([]);
    const [lineSelected, setLineSelected] = useState<any>(lines[0]);
    const [stockMain, setStockMain] = useState<EkbWipPartStock[]>([]);
    const [modelStandard, setModelStandard] = useState<DictMstr[]>([]);
    const [isHiddenStd, setIsHiddenStd] = useState<boolean>(true);
    // const [line,setLine]
    let timeStart: number = 10;
    useEffect(() => {
        init();
    }, [])
    const init = async () => {
    
        let ApiApsResult = await API_APS_RESULT({
            wc: lineSelected.value,
            ym: dtNow.format('YYYYMM')
        });
        setPartGroupMaster(ApiApsResult.partGroupMaster);
        setParts(ApiApsResult.parts);
        setStock(ApiApsResult.data);
        setStockMain(ApiApsResult.stockMain);
        setModelStandard(ApiApsResult.modelStandard);
    }

    const handleUpdateResult = async (qty: string, shift: string, period: string, wcno: string, partno: string, cm: string) => {
        let ApiUpdateResult = await API_APS_UPDATE_RESULT({
            ym: dtNow.format('YYYYMM'),
            ymd: dtNow.format('YYYYMMDD'),
            shift: shift,
            wcno: wcno,
            partno: partno,
            cm: cm,
            type: 'IN',
            qty: Number(qty),
            period: period,
            createBy: createBy
        });
        if (ApiUpdateResult.status == true) {
            init();
        }
    }
    useEffect(() => {
        init();
    }, [lineSelected])
    return (
        <div className='pt-3 px-3 flex flex-col' id='upload-result'>
            <div id='tab' className='   pb-3 flex   sticky top-0  w-full cursor-pointer select-none  '>
                <div className='flex grow'>
                    {
                        lines.map((oLine: any, iLine: number) => {
                            return <div key={iLine} className={`hover:text-[#38bdf8] bg-white ${typeof lineSelected == 'object' && lineSelected.value == oLine.value && 'font-semibold text-[#38bdf8]'} transition-all duration-300 py-2 ${lines.length == 1 ? 'border rounded-md pl-4 pr-3 ' : (iLine == (lines.length - 1) ? 'border-r border-y rounded-r-md pl-3 pr-4' : (iLine == 0) ? 'border-l rounded-l-md border-y pl-4 pr-3' : 'border px-4')}`} onClick={() => setLineSelected(oLine)}>{oLine.text}</div>
                        })
                    }
                </div>
                <div className='flex-none'>
                    <div className={`  transition-all duration-300 border rounded-md px-3 py-2 bg-white flex gap-2 items-center shadow-sm`} onClick={() => setIsHiddenStd(!isHiddenStd)}>
                        {
                            isHiddenStd ? <RemoveRedEyeIcon /> : <VisibilityOffIcon />
                        }
                        <span>({isHiddenStd ? 'เปิด' : 'ปิด'}) Standard</span>
                    </div>
                </div>
            </div>
            <div className=' grow overflow-y-auto '>
                <TableContainer component={Paper} elevation={0} className=' overflow-auto'>
                    <table className='w-full text-[14px] bg-white '>
                        <thead className='font-semibold bg-[#f9fafb] border-[#4f46e5]'>
                            <tr>
                                <td className='border text-center py-2 w-[7.5%]' rowSpan={3}>Line</td>
                                <td rowSpan={3} className='border pl-2 w-[12%]'>Model</td>
                                <td colSpan={7} className={`${isHiddenStd && 'hidden'} border text-center w-[10%]`}>Machine (Data base)</td>
                                <td rowSpan={1} colSpan={2} className='border text-center  py-1'>Stock</td>
                                <td rowSpan={1} colSpan={12} className='border text-center'>Time</td>
                            </tr>
                            <tr>

                                <td className={`${isHiddenStd && 'hidden'} border text-center`} rowSpan={2}>M/C (Unit)</td>
                                <td className={`${isHiddenStd && 'hidden'} border text-center`} rowSpan={2}>CT/MC</td>
                                <td className={`${isHiddenStd && 'hidden'} border text-center`} rowSpan={2}>CT</td>
                                <td className={`${isHiddenStd && 'hidden'} border text-center`} rowSpan={2}> (Hr)</td>
                                <td className={`${isHiddenStd && 'hidden'} border text-center`} rowSpan={2}>(Shift)</td>
                                <td className={`${isHiddenStd && 'hidden'} border text-center`} rowSpan={2}>(Day)</td>
                                <td className={`${isHiddenStd && 'hidden'} border text-center`} rowSpan={2}>Need Day</td>
                                <td className='border text-center w-[5%] py-1'>M/C</td>
                                <td className='border text-center w-[5%]'>Main</td>
                                {
                                    [...Array(12)].map((_: any, i: number) => {
                                        let hour = ((timeStart + (i * 2)) >= 24 ? ((timeStart + (i * 2)) - 24) : (timeStart + (i * 2))).toString().padStart(2, '0')
                                        if (i == 11) {
                                            hour = moment(hour, 'HH').subtract(10, 'minutes').format('HH:mm')
                                        } else {
                                            hour = moment(hour, 'HH').format('HH:mm')
                                        }
                                        return <td rowSpan={2} className='border text-center w-[5%] py-1'>{`${hour}`}</td>
                                    })
                                }
                            </tr>

                        </thead>
                        <tbody>
                            {
                                partGroupMaster.map((oPartGroup: PartGroupMasterProps, iPartGroup: number) => {
                                    let rowOfPartGroup: APSResultPartProps[] = parts.filter((o: APSResultPartProps) => o.part_group == oPartGroup.part);
                                    let rowSpan: number = rowOfPartGroup.length + 1;
                                    return <>
                                        <tr key={iPartGroup}>
                                            <td className='border bg-[#f9fafb] text-top' rowSpan={rowSpan}>
                                                <div className='flex flex-col  items-center justify-end h-[100%]'>
                                                    <span className='font-semibold text-lg'>{oPartGroup.part}</span>
                                                    <span className='text-[10px] text-[#5f5f5f]'>{oPartGroup.partName}</span>
                                                </div>
                                            </td>
                                        </tr >
                                        {
                                            rowOfPartGroup.map((oScheme: APSResultPartProps, iScheme: number) => {
                                                let RowStockMC: EkbWipPartStock[] = stockMain.filter((x => x.partno == oScheme.partno && x.wcno == oScheme.wcno));
                                                let totalStockMC: number = RowStockMC.reduce((a, b) => a + b.bal, 0);
                                                let RowStockMain: EkbWipPartStock[] = stockMain.filter((x => x.partno == oScheme.partno && x.wcno == "904"));
                                                let totalStockMain: number = RowStockMain.reduce((a, b) => a + b.bal, 0);
                                                return <tr key={iScheme}>
                                                    <td className='border pl-2 bg-[#f9fafb]'>
                                                        <div className='flex flex-col'>
                                                            <span className='font-bold'>{oScheme.model_common}</span>
                                                            <span className='text-[10px] text-[#5f5f5f]'>{oScheme.partno} {oScheme.cm}</span>
                                                        </div>
                                                    </td>
                                                    <td className={`${isHiddenStd && 'hidden'} border text-center`}>{oScheme.stdMC > 0 ? oScheme.stdMC : ''}</td>
                                                    <td className={`${isHiddenStd && 'hidden'} border text-center`}>{oScheme.stdCTMC > 0 ? oScheme.stdCTMC : ''}</td>
                                                    <td className={`${isHiddenStd && 'hidden'} border text-center`}>{oScheme.stdCT > 0 ? oScheme.stdCT : ''}</td>
                                                    <td className={`${isHiddenStd && 'hidden'} border text-center`}>{oScheme.stdCapHR > 0 ? oScheme.stdCapHR : ''}</td>
                                                    <td className={`${isHiddenStd && 'hidden'} border text-center`}>{oScheme.stdCapShift > 0 ? oScheme.stdCapShift : ''}</td>
                                                    <td className={`${isHiddenStd && 'hidden'} border text-center`}>{oScheme.stdCapDay > 0 ? oScheme.stdCapDay : ''}</td>
                                                    <td className={`${isHiddenStd && 'hidden'} border text-center`}>{oScheme.stdNeedDay > 0 ? oScheme.stdNeedDay : ''}</td>
                                                    <td className='border text-center font-bold'>{totalStockMC > 0 ? totalStockMC.toLocaleString('en') : '-'}</td>
                                                    <td className='border text-center font-bold'>{totalStockMain > 0 ? totalStockMain.toLocaleString('en') : '-'}</td>
                                                    {
                                                        [...Array(12)].map((_: any, i: number) => {
                                                            let period = ((timeStart + (i * 2)) >= 24 ? ((timeStart + (i * 2)) - 24) : (timeStart + (i * 2))).toString().padStart(2, '0');
                                                            if (i == 11) {
                                                                period = moment(period, 'HH').subtract(10, 'minutes').format('HH:mm')
                                                            } else {
                                                                period = moment(period, 'HH').format('HH:mm')
                                                            }
                                                            let shift: string = i < 6 ? 'D' : 'N';
                                                            // let index: number = ((i + 1) * 2) <= 12 ? ((i + 1) * 2) : (((i + 1) * 2) - 12);
                                                            let stockRow: EkbWipPartStockTransactionProps[] = stock.filter((x => x.wcno == oScheme.wcno && x.shift == shift && x.partno == oScheme.partno && x.ym == moment(ymd, 'YYYYMMDD').format('YYYYMM') && x.qrcodeData == period));
                                                            let qty: number = stockRow.length ? stockRow[0].transQty : 0;
                                                            return <td className='border'><input type='number' className={`focus:bg-[#4f46e520] focus:outline-[#4f46e5] focus:text-[#4f46e5] focus:font-semibold border w-full  round rounded-sm h-[35px] text-end pr-2 text-sm ${qty > 0 && 'bg-[#4f46e520] text-[#4f46e5] font-semibold border-1 border-[#4f46e550]'} transition-all duration-200`} onChange={(e: ChangeEvent<HTMLInputElement>) => handleUpdateResult(e.target.value, shift, period, oScheme.wcno, oScheme.partno, oScheme.cm)} value={qty} /></td>
                                                        })
                                                    }
                                                </tr>
                                            })
                                        }
                                    </>
                                })
                            }
                            {
                                partGroupMaster.length == 0 && <tr>
                                    <td colSpan={20} className='border py-3 text-center'>ไม่พบข้อมูล</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </TableContainer>
            </div>
        </div >
    )
}

export default ApsBackflush