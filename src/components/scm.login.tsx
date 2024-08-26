//@ts-nocheck
import React, { useEffect, useRef, useState } from 'react'
import { ApiLoginAdjStock } from '../service/aps.service';
import { contact } from '../constants';
import { useDispatch } from 'react-redux';

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
                <div className="grid grid-cols-4 items-center gap-4"><label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-right" >รหัสพนักงาน</label>
                    <input type='number' value={empcode} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 col-span-3" autoFocus={true} min={0} onChange={(e) => setEmpcode(e.target.value)} onKeyDown={handleKeyDown} ref={inputRef} />
                    <small className='col-start-2 col-span-3 text-red-500'>{message}</small>
                </div>
                <div className='pt-6 flex justify-end gap-3 select-none'>
                    <div className='bg-black text-white  px-4 text-center rounded-md w-fit py-2 shadow-md cursor-pointer' onClick={handleLogin} >
                        เข้าสู่ระบบ
                    </div>
                </div>
            </div>
            <div className='sm:col-span-1'>
                รายการสิทธิในระบบ APS
            </div>
        </div>
    )
}

export default SCMLogin