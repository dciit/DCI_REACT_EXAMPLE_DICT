import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { ApiApsLogin } from '../service/aps.service';
import { Button, Flex, Input, notification } from 'antd';
export interface ParamDialogLogin {
    open: boolean;
    setOpen: Function;
}
type NotificationType = 'success' | 'info' | 'warning' | 'error';

function DialogLogin(props: ParamDialogLogin) {
    const [api, contextHolder] = notification.useNotification();
    const dispatch = useDispatch();
    const { open, setOpen } = props;
    const [username, setUsername] = useState<string>('');
    const [warning, setWarning] = useState<boolean>(false);
    const [loginFailed, setLoginFailed] = useState<boolean>(false);
    const openNotification = (type: NotificationType, msg: string) => {
        api[type]({
            message: 'แจ้งเตือน',
            description: msg,
        });
    };
    const handleLogin = async () => {
        if (username == '') {
            setWarning(true);
            return false;
        } else {
            let res = await ApiApsLogin(username);
            try {
                if (res.code != null) {
                    openNotification('success', 'เข้าสู่ระบบเรียบร้อยแล้ว');
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
                openNotification('error', 'ไม่สามารถเข้าสู่ระบบได้');
            }
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
                {contextHolder}
                <div className={`font-['Th']`}>
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
                        }} onKeyDown={handleKeyDown}  maxLength={5}/>
                    </div>
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