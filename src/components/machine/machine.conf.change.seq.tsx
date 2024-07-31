import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import ButtonMtr from '../button.mtr'
import { ChangeEvent, useEffect , useState } from 'react'
import { useSelector } from 'react-redux'
import Login from '../aps.login'
interface ParamDialogMachineConfChangeSeq {
    open: boolean;
    setOpen: Function;
    handleChangeSeq: Function;
}
function DialogMachineConfChangeSeq(props: ParamDialogMachineConfChangeSeq) {
    const { open, setOpen, handleChangeSeq } = props;
    const redux = useSelector((state: any) => state.redux);
    const login = (typeof redux.login != 'undefined') ? redux.login : false;
    const [remark, setRemark] = useState<string>('');
    const [warning, setWarning] = useState<boolean>(false);
    const handleChanged = async () => {
        if (remark.length == 0) {
            setWarning(true);
            return false;
        }
        handleChangeSeq();
    }
    useEffect(() => {
        if (remark.length) {
            setWarning(false);
        } else {
            setWarning(true);
        }
    }, [remark]);


    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth={'sm'} >
            <DialogContent>
                {
                    login == false ? <Login /> : <div className='flex flex-col gap-3'>
                        <div className='flex flex-col gap-1'>
                            <div className='text-[16px] font-semibold'>ยืนยันการเปลี่ยนแปลงแผนการผลิต</div>
                        </div>
                        <div className='border-b '></div>
                        <div className='flex flex-col gap-1'>
                            <div className='text-[14px] text-gray-500'>คุณกำลังเปลี่ยนแปลงการผลิต จำเป็นต้องระบุข้อมูลเพิ่มเติม</div>
                            <p>หมายเหตุ</p>
                            <textarea rows={5} className={`w-full border rounded-md bg-gray-50 focus:outline-blue-500 p-3`} autoFocus={true} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setRemark(e.target.value)} />
                        </div>
                        {
                            warning && <small className='text-red-500'>* กรุณาระบุหมายเหตุเพิ่มเติม</small>
                        }
                        <div className='flex justify-end gap-2'>
                            <div onClick={() => setOpen(false)}>
                                <ButtonMtr text='ปิดหน้าต่าง' event='red' />
                            </div>
                            <div onClick={handleChanged}>
                                <ButtonMtr text='บันทึก' event='' />
                            </div>
                        </div>
                    </div>
                }
            </DialogContent>
        </Dialog>
    )
}

export default DialogMachineConfChangeSeq