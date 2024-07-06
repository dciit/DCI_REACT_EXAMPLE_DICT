import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import React from 'react'
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined';
function ApsDialogAddSequence(props: any) {
    const { open, close } = props;
    return (
        <Dialog open={open} onClose={() => close(false)} fullWidth maxWidth='md'>
            <DialogTitle >
                <div className='flex gap-2 flex-row items-center'>
                    <div className='rounded-full bg-[#5c5fc8] text-[#fff]  w-[36px] h-[36px] flex items-center justify-center'>
                        <RadioButtonCheckedOutlinedIcon sx={{ fontSize: '20px' }} />
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-[18px]'>Add Sequence</span>
                        <span className='text-[12px] text-[#939393]'>เพิ่มแผนการผลิต</span>
                    </div>
                </div>
            </DialogTitle>
            <DialogContent dividers>

            </DialogContent>
            <DialogActions>

            </DialogActions>
        </Dialog>
    )
}

export default ApsDialogAddSequence