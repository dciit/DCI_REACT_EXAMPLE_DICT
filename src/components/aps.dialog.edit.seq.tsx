import React, { ChangeEvent, useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import LoopIcon from '@mui/icons-material/Loop';
import { CircularProgress } from '@mui/material'
import { API_APS_NOTIFY_LOGIN } from '../service/aps.service'
import { EmpProps, StatusProps } from '../interface/aps.interface'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
export interface DialogEditSeqParam {
  open: boolean;
  setOpen: Function;
  empProps: EmpProps;
  setEmpProps: Function;
}
function DialogEditSeq(props: DialogEditSeqParam) {
  let textLogin: string = 'เข้าสู่ระบบ';
  let textLoading: string = 'กรุณารอสักครู่'
  const { open, setOpen,empProps,setEmpProps } = props;
  const [empcode, setEmpcode] = useState<string>('');
  const [load, setLoad] = useState<boolean>(false);
  const [textLoad, setTextLoad] = useState<string>(textLogin);
  const [alert, setAlert] = useState<boolean>(false);
  useEffect(() => {
    if (!open) {
      setEmpcode('');
      setLoad(false)
      setTextLoad(textLogin);
    }
  }, [open])
  useEffect(() => {
    setAlert(!empcode.length ? true : false);
  }, [empcode])
  const handleLogin = async () => {
    if (empcode.length >= 5) {
      setTextLoad(textLoading);
      setLoad(true);
      let empProps: EmpProps = await API_APS_NOTIFY_LOGIN(empcode);
      try {
        if (empProps.code != '') {
          setEmpProps(empProps)
          setOpen(false);
        }
      } catch (e) {
        setAlert(true);
      }
    } else {
      setAlert(true)
    }
  }
  return (
    <Dialog open={open} onClose={() => load ? false : setOpen(false)} fullWidth  >
      <DialogContent >
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-1'>
            <div className='text-[16px] font-semibold'>เข้าสู่ระบบ</div>
            <div className='text-[14px] text-gray-500'>ทำการเข้าสู่ระบบเพื่อสามารถแก้ไขแผนการผลิตได้</div>
          </div>
          <div className='border-b '></div>
          <div className='grid grid-cols-3 items-center gap-3 leading-none justify-between' >
            <div className='text-[14px] col-span-1'>รหัสพนักงาน</div>
            <input type='number' className={`col-span-2 border rounded-md px-2 py-1 focus-visible:outline-[#4f46e5] transition-all duration-300 hover:outline-none focus:bg-[#4f46e510]`} defaultValue={empcode == null ? '' : empcode} value={empcode} onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setEmpcode(e.target.value.length > 5 ? (e.target.value.substring(0, 5)) : e.target.value)
            }} autoFocus={true} />
          </div>
          <div className='border-b '></div>
          {
            alert == true && <div className=' flex gap-2 items-center justify-end'>
              <div className='bg-red-500 rounded-full w-[20px] h-[20px] flex items-center justify-center'><PriorityHighIcon className='text-white' sx={{ width: '14px', height: '14px' }} /></div>
              <span className='text-red-500'>กรุณากรอกรหัสพนักงานให้ครบถ้วน</span>
            </div>
          }
        </div>
        {/* <div className='flex gap-2 flex-row items-center'>
          <div className='rounded-full bg-[#5c5fc8] text-[#fff]  w-[36px] h-[36px] flex items-center justify-center'>
            <ExitToAppOutlinedIcon sx={{ fontSize: '20px' }} />
          </div>
          <div className='flex flex-col'>
            <span className='text-[18px]'>Sign in</span>
            <span className='text-[12px] text-[#939393]'>เข้าสู่ระบบ</span>
          </div>
        </div> */}

      </DialogContent>
      <DialogActions>
        <button className={`text-[#4f46e5] border-[#4f46e5] border opacity-75 transition-all duration-300 px-3 py-1 rounded-md drop-shadow-lg ${load ? 'opacity-40' : ' hover:opacity-100'}`} onClick={() => load ? false : setOpen(false)}>ออกจากระบบ</button>
        <button className={`bg-[#4f46e5] text-white px-3 py-1 rounded-md drop-shadow-lg opacity-90  transition-all duration-300 ${load ? 'opacity-40' : 'hover:opacity-100'}`} onClick={() => load ? false : handleLogin()}>
          <div className='flex gap-2 items-center'>
            {
              load && <CircularProgress size={'14px'} sx={{ color: 'white' }} />
            }
            <span>{textLoad}</span>
          </div>
        </button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogEditSeq