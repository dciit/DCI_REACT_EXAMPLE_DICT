import { faker } from '@faker-js/faker';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Avatar } from '@mui/material';
import React, { useState } from 'react'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
function ApsDialogEditPlan(props: any) {
    const { open, setOpen } = props;
    const [reason, setReason] = useState<number>(0);
    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            fullWidth maxWidth='sm'
        >
            <DialogTitle>{"แก้ไขข้อมูลการผลิต"}</DialogTitle>
            <DialogContent >
                <div className='flex flex-col gap-3'>
                    <div id='header' className='flex'>
                        <div id='header-edit-by'>
                            <div className='text-[#5f5f5f]'>แก้ไขโดย</div>
                            <div className='flex gap-2 items-center'>
                                <Avatar sx={{ width: 30, height: 30 }} src={faker.image.avatar()} />
                                <span>{faker.name.fullName()}</span>
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                        <div className='flex flex-col gap-1'>
                            <div>APS Plan date </div>
                            <div className='flex  gap-2 border rounded-lg pl-3 pr-4 py-2 '>
                                <CalendarMonthOutlinedIcon />
                                <span>{faker.date.recent().toDateString()}</span>
                            </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div>Model </div>
                            <div className='flex  gap-2 border rounded-lg pl-3 pr-4 py-2'>
                                <CategoryOutlinedIcon />
                                <span>{faker.company.bsNoun()}</span>
                            </div>
                        </div>
                    </div>
                    <div className='grid-cols-2 grid gap-3'>
                        <div className='flex flex-col gap-2 '>
                            <div className=' rounded-xl w-fit bg-blue-500 px-3 pt-[2px] pb-[3px] text-white'>APS Plan Qty</div>
                            <div className='border rounded-lg py-3 px-3 gap-1 flex justify-between'>
                                <div className=' px-3 w-full text-center  text-[36px]'>{faker.datatype.number({ min: 1, max: 10000 }).toLocaleString('en')}</div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-2 items-end'>
                            <div className=' rounded-xl w-fit bg-orange-500 px-3 pt-[2px] pb-[3px] text-white'>Production Plan Qty</div>
                            <div className='border rounded-lg py-3 px-3 gap-1 flex justify-between w-full'>
                                <div className='border rounded-lg  shadow-inner  px-3 w-full text-center bg-gray-50 text-[36px]'>{faker.datatype.number({ min: 1, max: 10000 }).toLocaleString('en')}</div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <div className='text-[#5f5f5f]'>เหตุผล</div>
                        <div className='flex gap-1'>
                            {
                                [...Array(5)].map((_, i) => {
                                    let oReason: string = faker.name.firstName();
                                    return <div className={`flex items-center w-fit px-3 pt-[2px] pb-[3px] ${i == reason ? 'bg-red-500' : 'text-red-600'} border-red-400 border text-white rounded-xl cursor-pointer select-none`} onClick={() => setReason(i)} key={i}> {oReason}</div>
                                })
                            }
                        </div>
                    </div>
                    <div>
                        <div className='text-[#5f5f5f]'>หมายเหตุ</div>
                        <textarea
                            className='border rounded-lg w-full px-3 bg-gray-50' rows={4} />
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)} variant='outlined'>ปิดหน้าต่าง</Button>
                <Button onClick={() => setOpen(false)} variant='contained'>บันทึก</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ApsDialogEditPlan