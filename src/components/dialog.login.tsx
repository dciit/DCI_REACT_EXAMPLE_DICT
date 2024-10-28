import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { ChangeEvent, useState } from 'react';
// import axios from 'axios';
// import { apiSoapLogin } from '../constants';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { ApiApsLogin } from '../service/aps.service';
import { Button, Flex, Input } from 'antd';
export interface ParamDialogLogin {
    open: boolean;
    setOpen: Function;
}
function DialogLogin(props: ParamDialogLogin) {
    const dispatch = useDispatch();
    const { open, setOpen } = props;
    const [username, setUsername] = useState<string>('');
    // const [password, setPassword] = useState<string>('');
    const [warning, setWarning] = useState<boolean>(false);
    const [loginFailed, setLoginFailed] = useState<boolean>(false);
    const handleLogin = async () => {
        // if (username == '' || password == '') {  if (username == '' || password == '') {
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
                    setTimeout(() => {
                        location.reload();
                    }, 500);
                }
            } catch {
                toast.error('ไม่สามารถเข้าสู่ระบบได้')
            }
            // axios.get<any>(`${apiSoapLogin}username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
            //     .then(response => {
            //         if (response.data[0].EmpCode != null && response.data[0].EmpCode != '') {
            //             toast.success('เข้าสู่ระบบเรียบร้อยแล้ว');
            //             dispatch({
            //                 type: 'LOGIN', payload: {
            //                     empcode: response.data[0].EmpCode,
            //                     img: response.data[0].EmpPic,
            //                     name: '',
            //                     surn: '',
            //                     fullName: response.data[0].ShortName
            //                 }
            //             })
            //             setLoginFailed(true);
            //             setTimeout(() => {
            //                 setOpen(false);
            //             }, 1500);
            //         } else {
            //             setLoginFailed(false);
            //         }
            //     })
            //     .catch(error => {
            //         console.log(error)
            //     });
        }
    }
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };
    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='sm' >
            <DialogContent >
                <div className={`font-['Th'] p-4`}>
                    <div className='flex flex-col'>
                        <span className='font-semibold uppercase'>Login</span>
                        <small className='text-gray-500'>เข้าสู่ระบบ</small>
                    </div>
                    <div>
                        {/* <small className='text-blue-500'>ใช้ชื่อผู้ใช้และรหัสผ่านเดียวกับที่เข้าระบบ ALPHA</small> */}
                        <small className='text-blue-500'>ใช้รหัสพนักงาน</small>
                    </div>
                    <div className='flex flex-col mt-6 gap-1'>
                        <span>รหัสพนักงาน</span>
                        <Input type='text' size='large' autoFocus={true} placeholder='กรอกชื่อผู้ใช้' onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setUsername(e.target.value);
                            setWarning(false);
                        }} onKeyDown={handleKeyDown} />
                    </div>
                    {/* <div className='flex flex-col mt-3 gap-1'>
                        <span>รหัสผ่าน</span>
                        <input type="password" className=' rounded-t border-b border-b-[#747474] px-3 py-2 bg-gray-100' placeholder='กรอกรหัสผ่าน' onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setPassword(e.target.value);
                            setWarning(false);
                        }} />
                    </div> */}
                    {
                        warning && <div className='mt-1'><small className='text-red-500'>กรุณากรอกข้อมูลให้ครบถ้วน </small></div>
                    }
                    <div className='mt-1'>
                        {
                            !loginFailed && <small className='text-red-500'>ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง </small>
                        }
                    </div>
                    <Flex gap={6}>
                        <Button type='primary' onClick={handleLogin}>เข้าสู่ระบบ</Button>
                        <Button onClick={() => setOpen(false)}>ปิดหน้าต่าง</Button>
                    </Flex>
                </div>
            </DialogContent>
            <DialogActions>
            </DialogActions>
            <ToastContainer autoClose={3000} />
        </Dialog>
    )
}

export default DialogLogin