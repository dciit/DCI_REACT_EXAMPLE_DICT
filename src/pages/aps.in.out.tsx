//@ts-nocheck
import React, { useEffect, useState } from 'react'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import WidgetsIcon from '@mui/icons-material/Widgets';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import { ParamInOut, PropsInOut } from '../interface/aps.interface';
import { ApiGetInOut } from '../service/aps.service';
import moment from 'moment';
import { CircularProgress } from '@mui/material';
function ApsInOut() {
    const dtNow = moment();
    // const [InOuts, setInOuts] = useState<PropsInOut[]>([]);
    // const [load, setLoad] = useState<boolean>(true);
    // const [filter, setFilter] = useState<ParamInOut>({
    //     group: '',
    //     ymd: dtNow.format('YYYYMMDD')
    // });
    useEffect(() => {
        loadData();
    }, [])
    const loadData = async () => {
        // let res = await ApiGetInOut(filter);
    }
    return (
        <div className='flex flex-col gap-6'>
            <div className='flex flex-col border border-gray-300 rounded-md px-6 pt-4 pb-4 w-fit gap-3 shadow-md select-none bg-gradient-to-r from-teal-50 to-blue-100 '>
                <strong>Filters <small className='font-light opabg-yellow-500/40city-50'>(เครื่องมือค้นหา)</small></strong>
                <div className='grid grid-cols-3 items-center gap-4'>
                    <div className='col-span-2 text-end font-semibold'>Line : </div>
                    <div>
                        <select className='border-2 rounded-md px-3 h-8 w-full border-sky-500  focus:outline-none'>
                            <option value="">ทั้งหมด</option>
                        </select>
                    </div>
                </div>
                <div className='grid grid-cols-3 items-center gap-4'>
                    <div className='col-span-2 text-end font-semibold'>Y/M/D : </div>
                    <div>
                        <input type="date" className='border-2 rounded-md px-3 h-8 w-full border-sky-500 ' />
                    </div>
                </div>
                <div className='cursor-pointer  rounded-md px-3 py-1 shadow-lg bg-sky-500 text-white w-fit flex items-center gap-1'><SearchOutlinedIcon sx={{ width: '18px', height: '18px' }} /><span>Search</span></div>
            </div>
            <div className='flex flex-col border border-gray-300 rounded-md px-6 pt-4 pb-4 gap-3 shadow-md select-none bg-gradient-to-r from-teal-50 to-blue-100 w-full min-h-[150px]'>
                <strong className='uppercase'>Transaction IN-OUT <small className='font-light opacity-50'>การเคลื่อนไหวของวัตถุดิบ</small></strong>
                <table id='tbInOut' className='w-full bg-white'>
                    <thead>
                        <tr>
                            <th className='border w-[20%] bg-gray-50' rowSpan={2}>DWG</th>
                            <th className='border py-1 w-[40%] bg-yellow-500/40' colSpan={4}>
                                <div className='flex items-center gap-1 justify-center drop-shadow-lg'>
                                    <BubbleChartIcon /><span>SUB-LINE</span>
                                </div>
                            </th>
                            <th className='border w-[40%] bg-orange-500/30' colSpan={4}>
                                <div className='flex items-center gap-1 justify-center drop-shadow-lg'>
                                    <WidgetsIcon /><span>MAIN-LINE</span>
                                </div>
                            </th>
                        </tr>
                        <tr>
                            <th className='border py-1 w-[10%] bg-sky-600/50'>LBL</th>
                            <th className='border  w-[10%] bg-green-600/80'>IN</th>
                            <th className='border  w-[10%] bg-red-500/80'>OUT</th>
                            <th className='border  w-[10%] bg-yellow-500/40'>BAL</th>
                            <th className='border py-1 w-[10%] bg-sky-600/50'>LBL</th>
                            <th className='border  w-[10%] bg-green-600/80'>IN</th>
                            <th className='border  w-[10%] bg-red-500/80'>OUT</th>
                            <th className='border  w-[10%] bg-orange-500/30'>BAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            load == true ? <tr><td colSpan={9} className='p-3 text-center'>
                                <div className='flex flex-col w-full items-center justify-center gap-1'><CircularProgress /><small>กำลังโหลดข้อมูล</small></div>
                            </td></tr> : (
                                InOuts.length == 0 ? <tr><td colSpan={9} className='p-3 text-center'>
                                    <div><CircularProgress /><small>กำลังโหลดข้อมูล</small></div>
                                </td></tr> : InOuts.map((x: PropsInOut, i: number) => {
                                    return <tr key={i}>
                                        <td>-</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                })
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ApsInOut