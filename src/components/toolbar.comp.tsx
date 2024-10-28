import { useEffect, useState } from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Divider, Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { base, ver } from '../constants';
import { Dropdown, MenuProps  } from 'antd';
import { LoginOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import DialogLogin from './dialog.login';
interface moduleProps {
    text: string;
    icon: any | null;
    value: string;
}
function ToolbarComponent() {
    let comp = window.location.pathname.split("/").pop();
    comp = comp == '' ? 'main' : comp;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const redux = useSelector((state: any) => state.redux);
    const login = redux.login;
    const img = redux.img;
    const shortName = redux.fullName;
    let lightTextColor = 'text-[#0f172a]';
    let lightColor = 'text-[#38bdf8]';
    const [openLogin, setOpenLogin] = useState<boolean>(false);
    let moduleList: moduleProps[] = [
        // {
        //     text: 'Home', icon: null, value: 'checkin'
        // },
        // {
        //     text: 'Manpower', icon: null, value: 'manpower'
        // },
        {
            text: 'Main Plan', icon: null, value: 'main'
        },
        {
            text: 'Sub-Line Plan', icon: null, value: 'subline'
        },
        {
            text: 'Sub-Line Result', icon: null, value: 'backflush'
        },
        // {
        //     text: 'Stock', icon: null, value: 'stock'
        // }
        {
            text: 'In-Out', icon: null, value: 'inout'
        }
    ];
    const [items] = useState<MenuProps['items']>([
        {
            key: '1',
            icon: <LoginOutlined />,
            label: (
                <span > เข้าสู่ระบบ</span>
            ),
            disabled: login,
            onClick: () => setOpenLogin(true)
        },
        {
            key: '2',
            icon: <SettingOutlined />,
            label: (
                <span> ตั้งค่า</span>
            ),
            onClick: () => window.open(`./adjstock`)
        },
        {
            key: '3',
            label: (
                <span>ออกจากระบบ</span>
            ),
            icon: <LogoutOutlined />,
            disabled: !login,
            onClick: () => openLogout()
        }
    ])
    const openLogout = async () => {
        if (confirm('คุณต้องการออกจากระบบใช่หรือไม่ ?')) {
            dispatch({ type: 'LOGOUT' });
            setTimeout(() => {
                location.reload();
            }, 500);
        }
    }
    useEffect(() => {

    }, [])
    return (
        <div id='toolbar' className='flex flex-row sticky top-0 flex-none h-[60px] border-gray-200   border-b  select-none px-[2.75%] sm:px-[2.75%] md:px-[2.75%] xl:px-[2.75%]  lg:border-b backdrop-blur-sm bg-white/60'>
            <div className='flex '>
                <div className='flex-none'></div>
                <div className='flex-none'></div>
                <div className='flex-none'></div>
            </div>
            <div className={`flex-none flex justify-center items-center h-full  gap-2 z-[99999]`}>
                <DashboardIcon className={`${lightColor}`} />
                <div className='flex items-center justify-center invisible sm:visible sm:gap-2'>
                    <div className={`flex items-center uppercase space-x-1 tracking-wide ${lightTextColor} font-semibold sm:text-sm md:text-sm`}>
                        <span>APS</span>
                        <span>Control</span>
                    </div>
                    <div className='bg-gray-100  text-[#828ea2] font-semibold text-[12px] px-[8px] rounded-xl'>v{ver}</div>
                </div>
            </div>
            <div className={`grow text-center  flex sm:gap-3 xl:gap-6 items-center justify-end pr-6`} id='module-list'>
                {
                    moduleList.map((item: moduleProps, i: number) => <div key={i} className={`uppercase sm:text-sm xl:text-md  ${comp != item.value ? `text-[#585858] ` : `text-blue-600 drop-shadow-sm`} hover:text-blue-600 cursor-pointer transition-all duration-300 gap-2 flex font-semibold`} onClick={() => navigate(`./${base}/${item.value}`)}>
                        <div className='flex items-center gap-2'>
                            {
                                comp == item.value && <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                                </span>
                            }
                            <span>{item.text}</span>
                        </div>
                    </div>)
                }
            </div>
            <div className={`flex-none flex items-center justify-center gap-3`}>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Dropdown menu={{ items }}>
                    <a onClick={(e) => e.preventDefault()}>
                        <div className='flex items-center justify-center gap-1'>
                            <Avatar sx={{
                                width: 30,
                                height: 30,
                                bgcolor: '#ddd',
                            }} src={`${img}`}></Avatar>
                            <div className='flex items-center gap-2  invisible md:visible' >
                                <span className={`${lightTextColor}`}>{`${login ? shortName : 'LOGIN'}`}</span>
                                {
                                    login == true && <LogoutOutlined color='#5f5f5f' />
                                }
                            </div>
                        </div>
                    </a>
                </Dropdown>
            </div>
            <DialogLogin open={openLogin} setOpen={setOpenLogin} />
        </div>

    )
}

export default ToolbarComponent