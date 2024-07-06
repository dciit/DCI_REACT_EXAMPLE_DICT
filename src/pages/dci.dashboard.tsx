import { faker } from '@faker-js/faker'
import { Avatar, Breadcrumbs, Divider, Link, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

import TransferWithinAStationOutlinedIcon from '@mui/icons-material/TransferWithinAStationOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AddRoadOutlinedIcon from '@mui/icons-material/AddRoadOutlined';
import AlignHorizontalLeftOutlinedIcon from '@mui/icons-material/AlignHorizontalLeftOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ApsUploadResult from './aps.upload.result';
import ApsReport from './aps.report';
import ApsHome from './aps.home';
import Aps from '../components/aps.aps';
export interface moduleProps {
    text: string;
    value: string;
    icon: any;
}
function DciDashboard() {
    let lightTextColor = 'text-[#0f172a]';
    let lightColor = 'text-[#38bdf8]';
    let moduleList: moduleProps[] = [
        {
            text: 'Home', icon: null, value: 'home'
        },
        {
            text: 'Manpower', icon: <TransferWithinAStationOutlinedIcon />, value: 'manpower'
        },
        {
            text: 'Aps', icon: <AccountTreeOutlinedIcon />, value: 'aps'
        },
        {
            text: 'Backflush Result', icon: < AddRoadOutlinedIcon />, value: 'backflushresult'
        },
        {
            text: 'Plan', icon: <AlignHorizontalLeftOutlinedIcon />, value: 'report'
        }
    ];
    const [moduleSelected, setModuleSelected] = useState<string>(moduleList[0].text);
    let version = '1.0.0';
    return (
        <div className='flex flex-col h-screen bg-body bg-no-repeat'>
            <div id='toolbar' className='flex-none h-[60px] border-gray-200   border-b flex select-none sm:px-[5.75%] xl:px-[5.75%]  lg:border-b backdrop-blur-sm bg-white/60'>
                <div className={`flex justify-center items-center h-full flex-non  gap-2 `}>
                    <DashboardIcon className={`${lightColor}`} />
                    <span className={`uppercase space-x-6 tracking-wide ${lightTextColor} font-semibold sm:text-sm md:text-sm`}>DCI Dashboard</span>
                    <div className='bg-gray-100  text-[#828ea2] font-semibold text-[12px] px-[8px] rounded-xl'>v{version}</div>
                </div>
                <div id='module-list' className={`text-center grow flex sm:gap-3 xl:gap-6 items-center justify-end pr-6`}>
                    {
                        moduleList.map((item: moduleProps, i: number) => <div key={i} className={`uppercase  ${moduleSelected != item.text ? ` scale-90 ${lightTextColor} ` : `text-sky-500 drop-shadow-lg`} hover:opacity-100 cursor-pointer transition-all duration-300 gap-2 flex font-semibold`} onClick={() => setModuleSelected(item.value)}>
                            {/* {item.icon} */}

                            <div className='flex items-center gap-2'>
                                {
                                    moduleSelected == item.value && <span className="relative flex h-3 w-3">
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

            <div className='grow sm:px-[5.75%] xl:px-[5.75%] py-10  flex flex-col gap-2 overflow-auto'>
                <div className='flex-none'>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" href="/">
                            HOME
                        </Link>
                        <Typography color="text.primary">BACKFLUSH RESULT</Typography>
                    </Breadcrumbs>
                </div>
                <div className='grow bg-white/60 backdrop-blur sm:p-3  md:p-3 rounded-md  border border-gray-200 overflow-auto'>
                    <div className='w-full h-full p-3'>
                        {
                            moduleSelected == 'home' && <ApsHome />
                        }
                        {
                            moduleSelected == 'aps' && <Aps />
                        }
                        {
                            moduleSelected == 'backflushresult' && <ApsUploadResult />
                        }
                        {
                            moduleSelected == 'report' && <ApsReport />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DciDashboard