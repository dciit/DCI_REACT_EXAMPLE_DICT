//@ts-nocheck
import { ChangeEvent, useEffect, useState } from 'react'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import WidgetsIcon from '@mui/icons-material/Widgets';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import { ParamInOut, PropsInOut, PropsPartGroup } from '../interface/aps.interface';
import { ApiGetInOut, ApiPartGroups } from '../service/aps.service';
import moment from 'moment';
import { CircularProgress } from '@mui/material';
import { Alert } from 'antd';
function ApsInOut() {
    const dtNow = moment();
    const [partGroups, setPartGroups] = useState<PropsPartGroup[]>([]);
    const [InOuts, setInOuts] = useState<PropsInOut[]>([]);
    const [load, setLoad] = useState<boolean>(false);
    const [filter, setFilter] = useState<ParamInOut>({
        group: '',
        ymd: dtNow.format('YYYYMMDD')
    });
    useEffect(() => {
        init();
    }, [])
    const init = async () => {
        let resPartGroups = await ApiPartGroups();
        setPartGroups(resPartGroups);
    }
    const loadData = async () => {
        // setLoad(true);
        // let res = await ApiGetInOut({
        //     ymd: filter.ymd,
        //     group: filter.group,
        //     drawing: ''
        // });
        // setInOuts(res);
        // setLoad(false);
    }

    const handleSearch = async () => {
        loadData();
    }
    return (
        <div className='flex flex-col gap-3 h-[100%]'>
            {/* <Alert
                message="ระหว่างการปรับปรุง"
                showIcon
                description="การแสดงผลส่วนนี้ กำลังมีการปรับปรุงและแก้ไข"
                type="error"
            /> */}
            <iframe src='http://dciweb.dci.daikin.co.jp/EkbReportApp/SCR' className='h-[100%]'>
                
            </iframe>
            {/* <div className='flex w-full items-center border border-gray-300 rounded-md px-6 pt-3 pb-3 gap-3 shadow-md select-none'>
                <div className='flex items-center grow gap-3'>
                    <div className=' flex  flex-col gap-1 '>
                        <div className='font-semibold'>Line : </div>
                        <div>
                            <select className='border rounded-md px-3 h-8 w-full bg-gray-300/10  focus:outline-none' value={filter.group} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilter({ ...filter, group: e.target.value })}>
                                <option value="">ทั้งหมด</option>
                                {
                                    partGroups.map((v: PropsPartGroup, i: number) => <option key={i} value={v.code}>{v.desc} ({v.code})</option>)
                                }
                            </select>
                        </div>
                    </div>
                    <div className=' flex  flex-col gap-1 '>
                        <div className='font-semibold'>วัน/เดือน/ปี : </div>
                        <input type="date" className='border rounded-md px-3 h-8 w-full bg-gray-300/10 ' value={moment(filter.ymd, 'YYYYMMDD').format('YYYY-MM-DD')} onChange={(e: ChangeEvent<HTMLInputElement>) => setFilter({ ...filter, ymd: moment(e.target.value, 'YYYY-MM-DD').format('YYYYMMDD') })} />
                    </div>
                </div>
                <div className='flex-none  cursor-pointer  rounded-md px-3 py-1 shadow-lg bg-blue-500 border border-blue-400 text-white w-fit flex items-center gap-1' onClick={handleSearch}><SearchOutlinedIcon sx={{ width: '18px', height: '18px' }} /><span>Search</span></div>
            </div>
            <div className='flex flex-col border border-gray-300 rounded-md px-6 pt-4 pb-4 gap-3 shadow-md select-none bg-gradient-to-r from-teal-50 to-blue-100 w-full min-h-[150px]'>
                <strong className='uppercase'>Transaction IN-OUT <small className='font-light opacity-50'>การเคลื่อนไหวของวัตถุดิบ</small></strong>
                <table id='tbInOut' className='w-full bg-white'>
                    <thead>
                        <tr>
                            <th className='border w-[20%] bg-gray-50' rowSpan={2}>DWG</th>
                            <th className='border py-1 w-[40%] bg-yellow-500/40' colSpan={4}>
                                <div className='flex  gap-1  pl-[8px] drop-shadow-lg'>
                                    <BubbleChartIcon /><span>SUB-LINE</span>
                                </div>
                            </th>
                            <th className='w-[25px] bg-black/80'>&nbsp;&nbsp;&nbsp;&nbsp;</th>
                            <th className='border w-[40%] bg-orange-500/30' colSpan={4}>
                                <div className='flex  gap-1  justify-end pr-[8px] drop-shadow-lg'>
                                    <WidgetsIcon /><span>MAIN-LINE</span>
                                </div>
                            </th>
                        </tr>
                        <tr>
                            <th className='border py-1 w-[10%] bg-sky-600/50'>LBL</th>
                            <th className='border  w-[10%] bg-green-600/80'>IN</th>
                            <th className='border  w-[10%] bg-red-500/80'>OUT</th>
                            <th className='border  w-[10%] bg-yellow-500/40'>BAL</th>
                            <th className='w-[25px] bg-black/80'>&nbsp;&nbsp;&nbsp;&nbsp;</th>
                            <th className='border py-1 w-[10%] bg-sky-600/50'>LBL</th>
                            <th className='border  w-[10%] bg-green-600/80'>IN</th>
                            <th className='border  w-[10%] bg-red-500/80'>OUT</th>
                            <th className='border  w-[10%] bg-orange-500/30'>BAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            load == true ? <tr><td colSpan={10} className='p-3 text-center'>
                                <div className='flex flex-col w-full items-center justify-center gap-1'><CircularProgress /><small>กำลังโหลดข้อมูล</small></div>
                            </td></tr> : (
                                InOuts.length == 0 ? <tr><td colSpan={10} className='p-3 text-center'>
                                    <div> <small>ไม่พบข้อมูล</small></div>
                                </td></tr> : InOuts.map((x: PropsInOut, i: number) => {
                                    x.mainRecQty = x.mainIssQty < 0 ? (x.mainRecQty + Math.abs(x.mainIssQty)) : x.mainRecQty;
                                    return <tr key={i}>
                                        <td className=' pl-[4px]'>{x.partno} {x.cm != '' ? ` (${x.cm})` : ''}</td>
                                        <td className={`${x.subLbal < 0 && 'text-red-600'} text-end pr-[4px] bg-sky-600/10`}>{x.subLbal != 0 && x.subLbal.toLocaleString('en')}</td>
                                        <td className={`${x.subRecQty < 0 && 'text-red-600'} text-end pr-[4px] bg-green-600/10`}>{x.subRecQty != 0 && x.subRecQty.toLocaleString('en')}</td>
                                        <td className={`${x.subIssQty < 0 && 'text-red-600'} text-end pr-[4px] bg-red-500/10`}>{x.subIssQty != 0 && x.subIssQty.toLocaleString('en')}</td>
                                        <td className={`${x.subBal < 0 && 'text-red-600'} text-end pr-[4px] bg-yellow-500/10`}>{x.subBal != 0 && x.subBal.toLocaleString('en')}</td>
                                        <td className='w-[25px] bg-black/80'>&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                        <td className={`${x.mainLbal < 0 && 'text-red-600'} text-end pr-[4px] bg-sky-600/10`}>{x.mainLbal != 0 && x.mainLbal.toLocaleString('en')}</td>
                                        <td className={`${x.mainRecQty < 0 && 'text-red-600'} text-end pr-[4px] bg-green-600/10`}>{x.mainRecQty != 0 && x.mainRecQty.toLocaleString('en')}</td>
                                        <td className={`${x.mainIssQty < 0 && 'text-red-600'} text-end pr-[4px] bg-red-500/10`}>{x.mainIssQty != 0 && x.mainIssQty.toLocaleString('en')}</td>
                                        <td className={`${x.mainBal < 0 && 'text-red-600'} text-end pr-[4px] bg-orange-500/10`}>{x.mainBal != 0 && x.mainBal.toLocaleString('en')}</td>
                                    </tr>
                                })
                            )
                        }
                    </tbody>
                </table>
            </div> */}
        </div>
    )
}

export default ApsInOut