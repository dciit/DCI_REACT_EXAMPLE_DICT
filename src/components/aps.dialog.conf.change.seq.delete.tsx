import { ChangeEvent, useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { toast } from 'react-toastify'
import { API_CHANGE_PRIORITY } from '../service/aps.service'
import { ApsProductionPlanProps } from '../interface/aps.interface'
import { contact, dateFormat } from '../constants'
import moment from 'moment'
interface ParamDialogConfSeq {
    open: boolean;
    setOpen: Function;
    changeSeq: Function;
    planChanged: ApsProductionPlanProps[];
    ymd: any;
}
function DialogConfChangeSequence(props: ParamDialogConfSeq) {
    const { open, setOpen, changeSeq, planChanged, ymd } = props;
    const [warning, setWarning] = useState<boolean>(false);
    const [remark, setRemark] = useState<string>('');
    const handleChangeSeqPlan = async () => {
        if (remark.length > 0) {
            let ResultUpdateMainPlan = await API_CHANGE_PRIORITY(planChanged.filter((o: ApsProductionPlanProps) => moment(o.apsPlanDate).format(dateFormat) == ymd.format(dateFormat)));
            if (ResultUpdateMainPlan.status == true) {
                changeSeq();
                toast.success('แก้ไขลำดับการผลิตเรียบร้อยแล้ว');
                setOpen(false);
            } else {
                toast.error(`เกิดข้อผิดพลาดกับการเปลี่ยนลำดับการผลิต ${contact}`);
            }
        } else {
            setWarning(true);
        }
    }

    useEffect(() => {
        if (remark.length > 0) {
            setWarning(false);
        } else {
            setWarning(true);
        }
    }, [remark])
    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth={'sm'} >
            <DialogContent>
                <div className='flex flex-col gap-3'>
                    <div className='flex flex-col gap-1'>
                        <div className='text-[16px] font-semibold'>ยืนยันการเปลี่ยนแปลงแผนการผลิต</div>
                    </div>
                    <div className='border-b '></div>
                    <div className='flex flex-col gap-1'>
                        <div className='text-[14px] text-gray-500'>คุณกำลังเปลี่ยนแปลงการผลิต จำเป็นต้องระบุข้อมูลเพิ่มเติม</div>
                        <p>หมายเหตุ</p>
                        <textarea rows={5} className='w-full border rounded-md bg-gray-50 focus:outline-blue-500 p-3' autoFocus={true} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setRemark(e.target.value)} />
                    </div>
                    {
                        warning && <small className='text-red-500'>* กรุณาระบุหมายเหตุการเปลี่ยนลำดับแผนการผลิต</small>
                    }
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)} >
                    ปิดหน้าต่าง
                </Button>
                <Button variant='contained' onClick={handleChangeSeqPlan}>บันทึก</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogConfChangeSequence