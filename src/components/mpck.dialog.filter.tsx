import  { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { PropsMpckLayout } from '../interface/aps.interface'
import { ApiGetLayouts } from '../service/aps.service'
interface PropsMPCKFilter {
    open: boolean;
    setOpen: Function;
}
function DialogMPCKFilter(props: PropsMPCKFilter) {
    const { open, setOpen } = props;
    const [fac, setFac] = useState<string>('1');
    const [layout, setLayout] = useState<PropsMpckLayout | null>(null);
    const [layouts, setLayouts] = useState<PropsMpckLayout[]>([]);
    useEffect(() => {
        if (open == true) {
            init();
        }
    }, [open])

    const init = async () => {

    }
    useEffect(() => {
        initLayouts();
    }, [fac])
    const initLayouts = async () => {
        let res = await ApiGetLayouts({
            factory: fac,
            layoutCode: "",
            objCode: ""
        });
        if (res.length > 0) {
            setLayouts(res);
        } else {
            setLayouts([]);
        }
    }
    useEffect(() => {
        if (layouts.length > 0) {
            setLayout(layouts[0]);
        }
    }, [layouts])
    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='sm'>
            <DialogTitle >
                <div className='flex items-center gap-1'>
                    <SearchOutlinedIcon className='opacity-70' />
                    <small>ค้นหาข้อมูล</small>
                </div>
            </DialogTitle>
            <DialogContent dividers >
                <DialogContentText>
                    คุณสามารถปรับแต่งตัวเลือกเพื่อค้นหาข้อมูล
                </DialogContentText>
                <div className='p-6 flex flex-col gap-3 select-none'>
                    <div className='grid grid-cols-2 gap-3 items-center'>
                        <div className='col-span-1 text-end'>โรงงาน</div>
                        <div>
                            <select name="" id="" className='border rounded-md px-3 py-1 w-full focus:outline-none cursor-pointer select-none' value={fac} onChange={(e) => setFac(e.target.value)}>
                                {
                                    ['1', '2', '3', 'ODM'].map((item, index) => {
                                        return <option key={index} value={item}>{item}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-3 items-center'>
                        <div className='col-span-1 text-end'>พื้นที่</div>
                        <div>
                            <select name="" id="" className={`border rounded-md px-3 py-1 w-full focus:outline-none cursor-pointer select-none ${layouts.length == 0 && 'bg-[#F4F4F5]'}`} disabled={layouts.length == 0} value={layout?.layoutCode} onChange={(e) => setLayout(layouts.find((item) => item.layoutCode == e.target.value)!)}>
                                {
                                    layouts.map((item, index) => {
                                        return <option key={index} value={item.layoutCode}>{item.layoutName}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)} variant='outlined'>
                    ปิดหน้าต่าง
                </Button>
                <Button onClick={() => setOpen(false)} variant='contained' startIcon={<SearchOutlinedIcon />}>
                    ค้นหา
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogMPCKFilter