import { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { ApiApsLogin } from '../service/aps.service';
function Login() {
    const dispatch = useDispatch();
    const [load, setload] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [warning, setWarning] = useState<boolean>(false);
    const [loginFailed, setLoginFailed] = useState<boolean>(false);
    const handleLogin = async () => {
        setload(true);
        if (username == '') {
            setWarning(true);
            return false;
        } else {
            let res = await ApiApsLogin(username);
            try {
                if (res.code != null) {
                    toast.success('เข้าสู่ระบบเรียบร้อยแล้ว');
                    dispatch({
                        type: 'LOGIN', payload: {
                            empcode: res.code,
                            img: res.img,
                            name: res.name,
                            surn: res.surn,
                            fullName: res.fullName
                        }
                    })
                    setLoginFailed(true);
                }
            } catch {
                toast.error('ไม่สามารถเข้าสู่ระบบได้')
            }
        }
    }
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };
    return (
        <div className={`font-['Th'] p-4`}>
            <div className='flex flex-col'>
                <span className='font-semibold uppercase'>Login</span>
                <small className='text-gray-500'>เข้าสู่ระบบ</small>
            </div>
            <div>
                <small className='text-blue-500'>ใช้รหัสพนักงาน</small>
            </div>
            <div className='flex flex-col mt-6 gap-1'>
                <span>รหัสพนักงาน</span>
                <input type="text" autoFocus={true} className=' rounded-t border-b border-b-[#747474] px-3 py-2 bg-gray-100' placeholder='กรอกชื่อผู้ใช้' onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setUsername(e.target.value);
                    setWarning(false);
                }}  onKeyDown={handleKeyDown}/>
            </div>
            {
                warning && <div className='mt-1'><small className='text-red-500'>กรุณากรอกข้อมูลให้ครบถ้วน </small></div>
            }
            {
                !loginFailed && <div className='mt-1'><small className='text-red-500'>ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง </small></div>
            }
            <div className='mt-6 flex gap-2'>
                <div className={`bg-blue-500 rounded-sm px-3 py-2 text-white shadow-md flex gap-2 items-center cursor-pointer select-none  ${load && 'opacity-50'}`} onClick={() => load ? false : handleLogin()}>
                    {
                        load ? <CircularProgress size={'16px'} sx={{ color: 'white' }} /> : <LoginIcon sx={{ color: 'white', width: '16px', height: '16px' }} />
                    }
                    {
                        load ? 'กำลังเข้าสู่ระบบ' : 'เข้าสู่ระบบ'
                    }
                </div>
            </div>
            <ToastContainer autoClose={2000} />
        </div>
    )
}

export default Login