import { Button, Divider } from '@mui/material';
import moment from 'moment';
import { ChangeEvent, useState } from 'react'
import { ApiAdjStock, ApiAdminUpdateDrawing } from '../service/aps.service';
import { toast, ToastContainer } from 'react-toastify';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
export interface PropsAdjStock {
    ymd: string;
    wcno: string;
    partno: string;
    cm: string;
    adj_qty: number;
    adj_by: string
}
export interface ParamAdminUpdateDrawing {
    drawing: string;
    cm: string;
    empcode?: string;
}
function AdjStock() {
    const [login, setLogin] = useState<boolean>(false);
    const [data, setData] = useState<PropsAdjStock>({ ymd: moment().format('YYYYMMDD'), wcno: '904', partno: '', cm: '', adj_qty: 0, adj_by: '' });
    const [drawing, setDrawing] = useState<ParamAdminUpdateDrawing>({
        drawing: '',
        cm: ''
    });
    const privilege: string[] = ['41256', '40865', '30146', '41078'];
    const [empcode, setEmpcode] = useState<string>('');
    const handleAjustStock = async () => {
        if (data.adj_qty < 0) {
            alert('กรุณากรอกจํานวนที่ต้องการปรับ');
            return false;
        }
        let res = await ApiAdjStock(data);
        if (res.status == true) {
            toast.success('บันทึกข้อมูลเรียบร้อย');
        } else {
            toast.error('บันทึกข้อมูลไม่สําเร็จ');
        }
    }
    const handleLogin = async () => {
        if (privilege.includes(empcode)) {
            setData({ ...data, adj_by: empcode });
            setLogin(true);
        } else {
            setData({ ...data, adj_by: '' });
            setLogin(false);
        }
    }
    const handleChangeDrawingDetail = async () => {
        if (drawing.drawing == '') {
            toast.error('บันทึกข้อมูลไม่สําเร็จ');
        } else {
            const res = await ApiAdminUpdateDrawing({ ...drawing, empcode: empcode });
            if (res.status == true) {
                toast.success('บันทึกข้อมูลเรียบร้อย');
            } else {
                toast.error('บันทึกข้อมูลไม่สําเร็จ');
            }
        }
    }


    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };
    return (
        <>
            {
                login == true ? <div className='grid grid-cols-2 gap-6'>
                    <div className='border rounded-md p-6 shadow-md'>
                        <div className='mb-2 uppercase font-semibold flex  gap-2 items-center'>
                            <AutoFixHighIcon />
                            <span>Adjust Stock</span>
                        </div>
                        <Divider />
                        <div className='mt-3'>
                            <p>YMD</p>
                            <input type="date" className='border rounded-md' onChange={(e: ChangeEvent<HTMLInputElement>) => setData({ ...data, ymd: moment(e.target.value).format('YYYYMMDD') })} value={moment(data.ymd, 'YYYYMMDD').format('YYYY-MM-DD')} />
                        </div>
                        <div>
                            <p>WCNO</p>
                            <input type="number" className='border rounded-md' onChange={(e: ChangeEvent<HTMLInputElement>) => setData({ ...data, wcno: e.target.value })} value={data.wcno} />
                        </div>
                        <div>
                            <p>PART</p>
                            <input type="text" className='border rounded-md' onChange={(e: ChangeEvent<HTMLInputElement>) => setData({ ...data, partno: e.target.value })} value={data.partno} />
                        </div>
                        <div>
                            <p>CM</p>
                            <input type="text" className='border rounded-md' onChange={(e: ChangeEvent<HTMLInputElement>) => setData({ ...data, cm: e.target.value })} value={data.cm.toUpperCase()} />
                        </div>
                        <div>
                            <p>Adjust Qty</p>
                            <input type="number" className='border rounded-md text-end' min={0} onChange={(e: ChangeEvent<HTMLInputElement>) => setData({ ...data, adj_qty: Number(e.target.value) })} value={data.adj_qty} />
                        </div>
                        <div className='mt-3 flex items-center gap-2'>
                            <Button variant='contained' onClick={handleAjustStock}>บันทึก</Button>
                            <Button variant='outlined' onClick={() => setLogin(false)}>ออกจากระบบ</Button>
                        </div>
                    </div>

                    <div className='border rounded-md p-6 shadow-md'>
                        <div>
                            <div className='mb-2 uppercase font-semibold flex  gap-2 items-center'>
                                <ChangeCircleIcon />
                                <span>Edit Drawing Detail</span>
                            </div>
                            <Divider />
                            <div className='mt-3'>
                                <p>Drawing</p>
                                <input type="text" className='border rounded-md' onChange={(e: ChangeEvent<HTMLInputElement>) => setDrawing({ ...drawing, drawing: e.target.value })} value={drawing.drawing} />
                            </div>
                            <div  >
                                <p>CM</p>
                                <input type="text" className='border rounded-md' onChange={(e: ChangeEvent<HTMLInputElement>) => setDrawing({ ...drawing, cm: e.target.value })} value={drawing.cm} />
                            </div>
                            <div className='mt-3 flex items-center gap-2'>
                                <Button variant='contained' onClick={handleChangeDrawingDetail}>บันทึก</Button>
                                <Button variant='outlined' onClick={() => setLogin(false)}>ออกจากระบบ</Button>
                            </div>
                        </div>
                    </div>
                </div> : <div className='flex flex-col gap-3'>
                    <div>
                        <p>รหัสพนักงาน</p>
                        <input type="text" className='border rounded-md' onChange={(e: ChangeEvent<HTMLInputElement>) => setEmpcode(e.target.value)} value={empcode} onKeyDown={handleKeyDown} />
                    </div>
                    <div className=''>
                        <Button variant='contained' onClick={handleLogin}>เข้าสู่ระบบ</Button>
                    </div>
                </div>
            }

            <ToastContainer autoClose={1500} />
        </>
    )
}

export default AdjStock