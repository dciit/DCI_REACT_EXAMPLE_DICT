import { faker } from '@faker-js/faker'
import { Avatar, Divider } from '@mui/material'
import React from 'react'

import TransferWithinAStationOutlinedIcon from '@mui/icons-material/TransferWithinAStationOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AddRoadOutlinedIcon from '@mui/icons-material/AddRoadOutlined';
import AlignHorizontalLeftOutlinedIcon from '@mui/icons-material/AlignHorizontalLeftOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';

function DciDashboard() {
    let lightTextColor = 'text-[#0f172a]';
    let lightColor = 'text-[#38bdf8]';
    let moduleList: any[] = [
        {
            text: 'Manpower', icon: <TransferWithinAStationOutlinedIcon />
        },
        {
            text: 'Aps', icon: <AccountTreeOutlinedIcon />
        },
        {
            text: 'Plan', icon: < AddRoadOutlinedIcon />
        },
        {
            text: 'Report', icon: <AlignHorizontalLeftOutlinedIcon />
        }
    ];
    let moduleSelected: string = 'Manpower';
    let version = '1.0.0';
    return (
        <div className='flex flex-col h-screen bg-body bg-no-repeat'>
            <div id='toolbar' className='flex-none h-[60px] border-gray-200   border-b flex select-none px-[13.75%]  lg:border-b backdrop-blur-sm bg-white/60'>
                <div className={`flex justify-center items-center h-full flex-non  gap-2 `}>
                    <DashboardIcon className={`${lightColor}`} />
                    <span className={`uppercase space-x-6 tracking-wide ${lightTextColor} font-semibold text-md`}>DCI Dashboard</span>
                    <div className='bg-gray-100  text-[#828ea2] font-semibold text-[12px] px-[8px] rounded-xl'>v{version}</div>
                </div>
                <div id='module-list' className={`text-center grow flex  gap-6 items-center justify-end pr-6`}>
                    {
                        moduleList.map((item, i) => <div key={i} className={`uppercase  ${moduleSelected != item.text ? ` scale-90 ${lightTextColor} ` : `text-sky-500 drop-shadow-lg`} hover:opacity-100 cursor-pointer transition-all duration-300 gap-2 flex font-semibold`}>
                            {/* {item.icon} */}

                            <div className='flex items-center gap-2'>
                                {
                                    moduleSelected == item.text && <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                                    </span>
                                }
                                <span>{item.text}</span>

                            </div>

                        </div>)
                    }
                </div>
                <div id='user-detail' className='flex-none flex items-center  justify-center gap-6 '>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <div className='flex items-center gap-2'>
                        <Avatar sx={{
                            width: 30,
                            height: 30,
                            bgcolor: faker.internet.color(),
                        }} ></Avatar>
                        <span className={`${lightTextColor}`}>{faker.name.fullName()}</span>
                    </div>
                </div>
            </div>
            <div className='grow px-[13.75%] py-10 h-full'>
                <div className='bg-white/60 backdrop-blur h-full p-6 rounded-md  border border-gray-200'>
                    <div className='grid grid-cols-4 gap-2'>
                        <div className='border rounded-md bg-white border-gray-200 py-3 px-6 gap-2 flex flex-col'>
                            <div className=' flex gap-3'>
                                <span className='font-bold'>SCR LINE 4</span>
                                <div className='bg-green-100 border border-dashed border-green-600 rounded-xl px-2 text-green-700 w-fit text-[12px] items-center flex cursor-pointer '>Online</div>
                            </div>
                            <Divider />
                            <div className='grid grid-cols-3 text-sm'>
                                <div >
                                    <div className='text-[#6b7280]'>Total</div>
                                    <div className='pl-1 text-[#4f46e5] font-semibold'>{faker.datatype.number({ min: 1, max: 50 }).toLocaleString('en')}</div>
                                </div>
                                <div>
                                    <div className='text-[#6b7280]'>Check-In</div>
                                    <div className='pl-1 text-[#16A34A] font-semibold'>{faker.datatype.number({ min: 1, max: 30 }).toLocaleString('en')}</div>
                                </div>
                                <div>
                                    <div className='text-[#6b7280]'>Percent</div>
                                    <div className='pl-1 text-red-500 font-semibold'>{faker.datatype.number({ min: 1, max: 100 }).toLocaleString('en')} <span className='text-[12px] text-red-400'>%</span></div>
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center'>
                            {
                                ['MACHINE L5', 'MACHINE L6'].map((item, i) => <div key={i} className=' rounded-md py-3 px-6 gap-2 flex flex-col  cursor-pointer w-fit items-center'>
                                    <div  className={`text-[#4d5665] opacity-30`}>
                                        {item}
                                    </div>
                                    <div className='border bg-white rounded-md opacity-100 w-fit px-3 px-1'>View</div>
                                </div>)
                            }
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default DciDashboard