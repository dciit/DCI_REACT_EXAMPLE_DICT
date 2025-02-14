//@ts-nocheck
import React, { useEffect, useRef, useState } from 'react'
import { ApiLoginAdjStock } from '../service/aps.service';
import { contact } from '../constants';
import { useDispatch } from 'react-redux';
import { Button, Input } from 'antd';

function SCMLogin() {
    const [empcode, setEmpcode] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const inputRef = useRef(null);
    const dispatch = useDispatch();
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };
    useEffect(() => {
        if (empcode != '') {
            setMessage('')
        }
    }, [empcode])
    const handleLogin = async () => {
        if (empcode == '') {
            setMessage('- กรุณาระบุรหัสพนักงาน')
        } else {
            let res = await ApiLoginAdjStock(empcode);
            if (res.code == null) {
                setEmpcode('');
                setMessage(`ไม่พบสิทธิในการแก้ไข Wip ${contact}`)
                return false;
            } else {
                dispatch({
                    type: 'LOGIN', payload: {
                        login : true,
                        empcode: res.code,
                        img: res.img,
                        name: res.name,
                        surn: res.surn,
                        fullName: res.fullName
                    }
                })
            }
        }
        if (inputRef != null) {
            inputRef.current.focus();
        }
    }
    return (
        <div className='grid sm:grid-cols-1'>
            <div className='sm:col-span-1 px-6 pt-6 pb-3'>
                <div className="grid grid-cols-1 items-center gap-4"><label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-right" >รหัสพนักงาน</label>
                    <Input type='number' className='w-full' placeholder='กรอกรหัสพนักงาน' value={empcode} onChange={(e) => setEmpcode(e.target.value)} onKeyDown={handleKeyDown} ref={inputRef} />
                    <small className='col-start-2 col-span-3 text-red-500'>{message}</small>
                </div>
                <div className='pt-6 flex justify-end gap-3 select-none'>
                    <Button type='primary' onClick={handleLogin} >เข้าสู่ระบบ</Button>
                </div>
            </div>
        </div>
    )
}

export default SCMLogin