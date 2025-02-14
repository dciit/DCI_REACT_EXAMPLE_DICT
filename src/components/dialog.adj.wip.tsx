import { useEffect, useState } from 'react'
import { ApiAdjStock, APIGetWipStockByPart } from '../service/aps.service'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { Alert, Button, Input, Modal, notification, Popconfirm, Spin } from 'antd'

import { PropAdjWIP, PropItemAdjWIP } from '@/interface/aps.interface'
import TextArea from 'antd/es/input/TextArea'
type NotificationType = 'success' | 'info' | 'warning' | 'error';
function DialogAdjWip(props: PropAdjWIP) {
    const [api, contextHolder] = notification.useNotification();
    const openNotify = (type: NotificationType, message: string) => {
        api[type]({
            message: 'แจ้งเตือน',
            description: message,
        });
    };
    const redux = useSelector((state: any) => state.redux);
    const empcode = (typeof redux.empcode != 'undefined') ? redux.empcode : '';
    const { open, setOpen, prop, loadBackflush } = props;
    const [success, setSuccess] = useState<boolean>(false);
    const [load, setLoad] = useState<boolean>(true);
    const [warning, setWarning] = useState<boolean>(true);
    const [data, setData] = useState<PropItemAdjWIP>({ ym: moment().format('YYYYMM'), wcno: prop?.wcno != undefined ? prop.wcno : '', partno: prop?.partno != undefined ? prop.partno : '', cm: prop?.cm != undefined ? prop.cm : '', adj_qty: 0, adj_by: '' });
    useEffect(() => {
        if (open == true) {
            init()
        } else {
            setData({ ...data, remark: '' })
        }
    }, [open]);
    const init = async () => {
        setLoad(true);
        let StockOfPart = await APIGetWipStockByPart({ ym: moment().format('YYYYMM'), wcno: prop?.wcno != undefined ? prop.wcno : '', partno: prop?.partno != undefined ? prop.partno : '', cm: prop?.cm != undefined ? prop.cm : '', adj_qty: 0, adj_by: '' });
        setData({ ym: moment().format('YYYYMM'), wcno: prop?.wcno != undefined ? prop.wcno : '', partno: prop?.partno != undefined ? prop.partno : '', cm: prop?.cm != undefined ? prop.cm : '', adj_qty: StockOfPart, adj_by: '', wipBefore: StockOfPart });
        setTimeout(() => {
            setLoad(false);
        }, 500);
    }
    useEffect(() => {
        setLoad(false);
        if (data?.remark != undefined && data.remark.trim().length != 1 && data.remark.trim() != '-' && data.remark.trim() != '' && data.remark.trim() != '.') {
            setWarning(false);
        } else {
            setWarning(true);
        }
    }, [data])

    const handleUpdate = async () => {
        if (data?.remark == undefined || data.remark.trim().length == 1 || data.remark.trim() == '-' || data.remark.trim() == '' || data.remark.trim() == '.') {
            setWarning(true);
            return false;
        }
        let res = await ApiAdjStock(data);
        if (res.status == true) {
            openNotify('success', 'บันทึกเรียบร้อยแล้ว');
        } else {
            openNotify('error', `ไม่สามารถบันทึกได้ ${res.message}`)
        }
        loadBackflush();
        setOpen(false);
    }
    useEffect(() => {
        if (success == true) {
            setTimeout(() => {
                setSuccess(false);
            }, 5000);
        }
    }, [success])
    return (
        <Modal title='แก้ไขยอดคงเหลือ' animation={true} open={open} onCancel={() => setOpen(false)} onClose={() => setOpen(false)} footer={
            <>
                <Popconfirm
                    title="การแก้ไขยอดคงเหลือ"
                    description={`คุณต้องการแก้ไขยอดคงเหลือเท่ากับ [${data.adj_qty}] ใช่หรือไม่ ?`}
                    onConfirm={handleUpdate}
                    okText="ใช่"
                    cancelText="ไม่">
                    <Button type='primary' disabled={load || (data?.adj_qty == undefined || data.adj_qty < 0) || warning == true} >บันทึก</Button>
                </Popconfirm>
                <Button onClick={() => setOpen(false)}>ปิดหน้าต่าง</Button>
            </>
        }>
            <Spin spinning={load}>
                {contextHolder}
                <div className='flex flex-col gap-3 py-3'>
                    <div className='grid grid-cols-5 gap-2'>
                        <div className='col-span-2 text-right'>
                            <div className='h-full flex items-center justify-end pr-3'>WCNO : </div>
                        </div>
                        <div className='col-span-3'>
                            <Input type='text' readOnly={true} value={prop?.wcno} defaultValue={0} />
                        </div>
                    </div>
                    <div className='grid grid-cols-5 gap-2'>
                        <div className='col-span-2 text-right'>
                            <div className='h-full flex items-center justify-end pr-3'>DRAWING CM : </div>
                        </div>
                        <div className='col-span-2'>
                            <Input readOnly={true} value={`${prop?.partno}`} />
                        </div>
                        <div className='col-span-1'>
                            <Input readOnly={true} value={`${prop?.cm}`} className='text-center' />
                        </div>
                    </div>
                    <div className='grid grid-cols-5 gap-2'>
                        <div className='col-span-2 text-right'>
                            <div className='h-full flex items-center justify-end pr-3'>STOCK : </div>
                        </div>
                        <div className='col-span-3'>
                            <Input autoFocus type='number' min={0} className={`${data?.adj_qty < 0 ? 'text-red-500' : ''}`} value={`${data?.adj_qty}`} defaultValue={0} onChange={(e) => setData({ ...data, adj_by: empcode, adj_qty: Number(e.target.value) >= 0 ? Number(e.target.value) : 0 })} />
                        </div>
                    </div>
                    <div className='grid grid-cols-5 gap-2'>
                        <div className='col-span-2 text-right'>
                            <div className='h-full flex items-top justify-end pr-3'>หมายเหตุ : </div>
                        </div>
                        <div className='col-span-3 flex flex-col gap-2'>
                            <TextArea rows={3} placeholder='กรอกเหตุผลในการแก้ไข Stock' onChange={(e) => setData({ ...data, remark: e.target.value })} value={data.remark} />
                            {
                                warning == true && <Alert message={`กรุณาระบุหมายเหตุ หรือ ห้ามกรอก '-' หรือ ช่องว่าง !`} type="error" showIcon />
                            }
                        </div>
                    </div>
                    <div className={`${data?.adj_qty != undefined && data.adj_qty < 0 ? '' : 'hidden'}`}>
                        <Alert message="กรุณาระบุค่าคงเหลือมากกว่าหรือเท่ากับ 0 เท่านั้น" type="error" showIcon />
                    </div>
                </div>
            </Spin>
        </Modal>
    )
}

export default DialogAdjWip