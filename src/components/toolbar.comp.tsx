import { useState } from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Divider, Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { base, ver } from '../constants';
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
        {
            text: 'Home', icon: null, value: 'checkin'
        },
        {
            text: 'Manpower', icon: null, value: 'manpower'
        },
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
    ];
    const openLogout = async () => {
        if (confirm('คุณต้องการออกจากระบบใช่หรือไม่ ?')) {
            dispatch({ type: 'LOGOUT' });
            location.reload();
        }
    }
    return (
        <div id='toolbar' className='sticky top-0 flex-none h-[60px] border-gray-200   border-b flex select-none sm:px-[2.75%] md:px-[2.75%] xl:px-[2.75%]  lg:border-b backdrop-blur-sm bg-white/60'>
            <div className={`flex justify-center items-center h-full flex-non gap-2 z-[99999] `}>
                <DashboardIcon className={`${lightColor}`} />
                <span className={`uppercase space-x-6 tracking-wide ${lightTextColor} font-semibold sm:text-sm md:text-sm`}>ASP Control</span>
                <div className='bg-gray-100  text-[#828ea2] font-semibold text-[12px] px-[8px] rounded-xl'>v{ver}</div>
            </div>
            <div id='module-list' className={`text-center grow flex sm:gap-3 xl:gap-6 items-center justify-end pr-6`}>
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
            <div id='user-detail' className='flex-none flex items-center  justify-center gap-6 ' onClick={() => login == true ? openLogout() : setOpenLogin(true)}>
                <Divider orientation="vertical" variant="middle" flexItem />
                <div className='flex items-center gap-2'>
                    <Avatar sx={{
                        width: 30,
                        height: 30,
                        bgcolor: '#ddd',
                    }} src={`${img}`}></Avatar>
                    <div className='flex items-center gap-2' >
                        <span className={`${lightTextColor}`}>{`${login ? shortName : 'LOGIN'}`}</span>
                        {
                            login == true && <LockOutlinedIcon sx={{ color: '#5f5f5f' }} />
                        }
                    </div>
                </div>
            </div>
            <DialogLogin open={openLogin} setOpen={setOpenLogin} />
        </div>

    )
}

export default ToolbarComponent