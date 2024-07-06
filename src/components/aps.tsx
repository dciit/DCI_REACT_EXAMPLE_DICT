import React, { useEffect, useState } from 'react'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { Avatar, Divider, IconButton } from '@mui/material';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import moment from 'moment';
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import { faker } from '@faker-js/faker';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import ApsDialogEditPlan from './aps.dialog.edit.plan';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
export interface PlanProps {
    date?: string;
    model?: string;
}
function ApsTest() {
    let baseBgColor = 'bg-[#48a6a6]';
    let baseTextColor = 'text-[#5f5f5f]';
    let TextColor = 'text-[#48a6a6]';
    let icSize = '18px';
    const [planSelected, setPlanSelected] = useState<PlanProps>({})
    const [openEditPlan, setOpenEditPlan] = useState<boolean>(false);
    useEffect(() => {
        if (Object.keys(planSelected).length > 0) {
            setOpenEditPlan(true);
        }
    }, [planSelected])
    useEffect(() => {
        if (openEditPlan == false) {
            setPlanSelected({});
        }
    }, [openEditPlan])
    const planSuccess = (i: number, date: string) => {
        return <div key={i} className={`border border-green-600 rounded-2xl px-3 py-2 flex items-center gap-3 shadow-sm bg-green-50  select-none`}>
            <div className='w-[15%]'>{date}</div>
            <div className={`${baseTextColor} w-[30%]`}>{faker.finance.iban().substring(1,13)}</div>
            <div className='w-[17.5%] text-right pr-3'>
                {/* <div className='bg-gray-100 border rounded-xl  px-2'> */}
                {faker.datatype.number({ min: 1, max: 10000 }).toLocaleString('en')}
                {/* </div> */}
            </div>
            <div className={`w-[17.5%] text-right pr-3   text-green-600 font-semibold`}>{faker.datatype.number({ min: 1, max: 10000 }).toLocaleString('en')}</div>
            <div className='w-[10%]'>{i + 1}</div>
            <div className='w-[10%]'>
                <div className={`bg-green-600 rounded-xl flex items-center justify-center text-white pt-[2px] pb-[4px]`}>
                    <span className='text-[12px]'>เรียบร้อย</span>
                </div>
            </div>
            <div id='colRemark'>-</div>
        </div>
    }
    const planProcess = (i: number, date: string) => {
        let model: string = faker.finance.iban().substring(1,13);
        return <div key={i} className={`border-2 border-orange-400 rounded-2xl px-3 py-2 flex items-center gap-3 shadow-sm  bg-orange-50 cursor-pointer hover:scale-105 transition-all duration-100`} onClick={() => setPlanSelected({
            date: date, model: model
        })}>
            <div className='w-[15%]'>{date}</div>
            <div className={`${baseTextColor} w-[30%]`}>{model}</div>
            <div className='w-[17.5%] text-right pr-3'>
                {/* <div className='bg-gray-100 border rounded-xl  px-2'> */}
                {faker.datatype.number({ min: 1, max: 10000 }).toLocaleString('en')}
                {/* </div> */}
            </div>
            <div className={`w-[17.5%] text-right pr-3   text-orange-600 drop-shadow-md font-bold`}>{faker.datatype.number({ min: 1, max: 10000 }).toLocaleString('en')}</div>
            <div className='w-[10%]'>{i + 1}</div>
            <div className='w-[10%]'>
                <div className={`bg-orange-500 rounded-xl flex items-center justify-center text-white pt-[2px] pb-[4px]`}>
                    <span className='text-[12px]'>กำลังผลิต</span>
                </div>
            </div>
            <div id='colRemark'>-</div>
        </div>
    }
    const PlanTodo = (i: number, date: string) => {
        return <div key={i} className={`border border-gray-300 rounded-2xl px-3 py-2 flex items-center gap-3 shadow-sm opacity-50 `}>
            <div className='w-[15%]'>{date}</div>
            <div className={`${baseTextColor} w-[30%]`}>{faker.finance.iban().substring(1,13)}</div>
            <div className='w-[17.5%] text-right pr-3'>
                {faker.datatype.number({ min: 1, max: 10000 }).toLocaleString('en')}
            </div>
            <div className={`w-[17.5%] text-right pr-3   text-gray-400 font-semibold`}>{faker.datatype.number({ min: 1, max: 10000 }).toLocaleString('en')}</div>
            <div className='w-[10%]'>{i + 1}</div>
            <div className='w-[10%]'>
                <div className={`bg-gray-600 rounded-xl flex items-center justify-center text-white pt-[2px] pb-[4px]`}>
                    <span className='text-[12px]'>รอผลิต</span>
                </div>
            </div>
            <div id='colRemark'>-</div>
        </div>
    }
    return (
        <div id="container" className='flex '>
            <div id="drawer" className='w-[50px] flex-none hidden'>
                <div id="drawer-header">
                    <div id="drawer-header-logo"></div>
                    <div id="drawer-menu " className='h-screen border-r border-gray-300 gap-3 flex flex-col p-3'>
                        {
                            [...Array(10)].map((_, i) => <div key={i} className="flex">
                                <span>IC</span>
                                <CheckBoxOutlineBlankOutlinedIcon />
                            </div>)
                        }
                    </div>
                </div>
            </div>
            <div id="body" className='flex flex-col grow'>
                <div id='toolbar' className='flex flex-none border-b px-6 items-center h-[45px]'>
                    <div id='title' className='grow font-semibold'>Dashboard</div>
                    <div id='user' className='flex-none flex gap-3'>
                        <div id='notice' >
                            <IconButton>
                                <SearchOutlinedIcon sx={{ width: icSize, height: icSize }} />
                            </IconButton>
                            <IconButton>
                                <NotificationsNoneOutlinedIcon sx={{ width: icSize, height: icSize }} />
                            </IconButton>
                        </div>
                        <Divider orientation="vertical" variant="middle" flexItem />
                        <div id='avatar' className='flex items-center gap-2 ml-3'>
                            <Avatar sx={{ width: '24px', height: '24px' }} src='https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U' />
                            <div id='name' className={`${baseTextColor}`}>Username.U</div>
                            <ArrowDropDownOutlinedIcon className={`${baseTextColor}`} />
                        </div>

                    </div>
                </div>
                <div id='title' className='flex flex-none border-b py-2 items-center px-6 '>
                    <div className='flex gap-3 flex-none  items-center'>
                        <div className='grow font-semibold'>APS Plan</div>
                        <div className={`flex flex-row gap-2 rounded-lg px-2 py-1 ${baseBgColor}`}>
                            <div className='text-white bg-[#3a8585] rounded-md flex items-center px-1'>
                                <ChevronLeftOutlinedIcon sx={{ width: icSize, height: icSize }} />
                            </div>
                            <div className='text-white'>{moment().format('DD/MM/YYYY')}</div>
                            <div id='ic-date-prev' className='text-white bg-[#3a8585] rounded-md flex items-center px-1'>
                                <NavigateNextOutlinedIcon sx={{ width: icSize, height: icSize }} />
                            </div>
                        </div>
                    </div>
                    <div className='grow flex items-end justify-end'>
                        <IconButton>
                            <CloseOutlinedIcon/>
                        </IconButton>
                    </div>
                </div>
                <div id="content" className='grow p-6 grid  sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-5 gap-6'>

                    <div className='sm:col-span-1 md:col-span-1 lg:col-span-2'>
                        <div id='aps-subtitle' className=' md:col-span-3 flex items-center gap-1 cursor-pointer '>
                            <FormatListNumberedOutlinedIcon sx={{ width: icSize, height: icSize }} />
                            <span className='font-semibold'>แผนการผลิต (Main Assembly)</span>
                        </div>
                        <div className={`${baseTextColor} px-6 py-2 flex gap-3 0 text-[12px] sm:text-[12px] md:text-[14px] lg:text-[12px]`}>
                            <div className='w-[15%] '>วันที่</div>
                            <div className='w-[30%]'>โมเดล</div>
                            <div className='w-[17.5%] text-right'>จำนวนผลิต (ตามแผน)</div>
                            <div className='w-[17.5%] text-right'>ต้องการผลิต</div>
                            <div className='w-[10%]'>ลำดับ</div>
                            <div className='w-[10%]'>สถานะ</div>
                            <div className='w-'>หมายเหตุ</div>
                        </div>
                        <div id='aps-table-plan' className='p-2 gap-2 flex flex-col text-[12px] sm:text-[12px] md:text-[14px] lg:text-[12px]'>
                            {
                                [...Array(5)].map((_, i) => {
                                    return i < 2 ? planSuccess(i, moment().add(i, 'days').format('DD/MM/YYYY')) : (i == 2 ? planProcess(i, moment().add(i, 'days').format('DD/MM/YYYY')) : PlanTodo(i, moment().add(i, 'days').format('DD/MM/YYYY')));
                                })
                            }
                            <div id='add-plan' className='border border-[#48a6a6] border-dashed rounded-2xl px-3 py-2 flex items-center gap-3 hover:scale-105 transition-all duration-300 select-none cursor-pointer' >
                                <div className={`${TextColor} font-semibold`}>+ เพิ่มแผนการเดิน</div>
                            </div>
                        </div>
                    </div>

                    <div className='sm:col-span-1 md:col-span-1 lg:col-span-3 flex flex-col items-start gap-2'>
                        <div id='aps-subtitle' className='col-span-2 md:col-span-3 flex items-center gap-2 cursor-pointer '>
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                            </span>
                            <span className='font-semibold'>สภาพการณ์การผลิต</span>
                        </div>
                        <div className={`${baseTextColor} px-6 py-2 flex gap-3 0 text-[12px] w-full`}>
                            <div className='w-[10%] tex'>วันที่</div>
                            <div className='w-[30%]'>โมเดล</div>
                            <div className='w-[17.5%] text-right'>จำนวนผลิต (ตามแผน)</div>
                            <div className='w-[17.5%] text-right'>ต้องการผลิต</div>
                            <div className='w-[10%]'>ลำดับการผลิต</div>
                            <div className='w-[10%]'>สถานะ</div>
                            <div className='w-'>หมายเหตุ</div>
                        </div>
                        <div id='aps-table-plan' className='p-2 gap-2 flex flex-col w-full'>
                            {
                                [...Array(5)].map((_, i) => {
                                    return i < 2 ? planSuccess(i, moment().add(i, 'days').format('DD/MM/YYYY')) : (i == 2 ? planProcess(i, moment().add(i, 'days').format('DD/MM/YYYY')) : PlanTodo(i, moment().add(i, 'days').format('DD/MM/YYYY')));
                                })
                            }
                        </div>
                    </div>
                </div>
                <div id='footer' className='flex px-3 border-t flex-none'>
                    {
                        [...Array(5)].map((_, i) => <div key={i} className="flex">
                            <span>IC</span>
                            <NavigateNextOutlinedIcon />
                        </div>)
                    }
                </div>
            </div>
            <ApsDialogEditPlan open={openEditPlan} setOpen={setOpenEditPlan} />
        </div>
    )
}

export default ApsTest