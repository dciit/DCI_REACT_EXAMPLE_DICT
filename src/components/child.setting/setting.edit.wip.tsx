
import { Input, Button, notification } from 'antd'
import moment from 'moment'
import { ChangeEvent, useState } from 'react'
import { PropsAdjStock } from '@/pages/aps.adj.stock';
import { ApiAdjStock } from '@/service/aps.service';
import { contact } from '@/constants';
type NotificationType = 'success' | 'info' | 'warning' | 'error';

function SettingWIP() {
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (type: NotificationType, message: string) => {
        api[type]({
            message: message,
            placement: 'topRight',
        });
    };
    const [data, setData] = useState<PropsAdjStock>({ ymd: moment().format('YYYYMMDD'), wcno: '904', partno: '', cm: '', adj_qty: 0, adj_by: '' ,remark : ''});
    const handleAjustStock = async () => {
        if (data.adj_qty < 0) {
            alert('กรุณากรอกจํานวนที่ต้องการปรับ');
            return false;
        }
        let res = await ApiAdjStock(data);
        if (res.status == true) {
            openNotification('success', 'บันทึกข้อมูลเรียบร้อยแล้ว')
        } else {
            openNotification('error', `เกิดข้อผิดพลาด ${contact}`)
        }
    }
    return (
        <div className='border rounded-md p-6 shadow-md'>
            {contextHolder}
            <div className='mt-3'>
                <p>YMD</p>
                <Input type='date' onChange={(e: ChangeEvent<HTMLInputElement>) => setData({ ...data, ymd: moment(e.target.value).format('YYYYMMDD') })} value={moment(data.ymd, 'YYYYMMDD').format('YYYY-MM-DD')} />
            </div>
            <div>
                <p>WCNO</p>
                <Input onChange={(e: ChangeEvent<HTMLInputElement>) => setData({ ...data, wcno: e.target.value })} value={data.wcno} />
            </div>
            <div>
                <p>PART</p>
                <Input type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => setData({ ...data, partno: e.target.value })} value={data.partno} allowClear />
            </div>
            <div>
                <p>CM</p>
                <Input type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => setData({ ...data, cm: e.target.value })} value={data.cm.toUpperCase()} />
            </div>
            <div>
                <p>Adjust Qty</p>
                <Input type="number" min={0} onChange={(e: ChangeEvent<HTMLInputElement>) => setData({ ...data, adj_qty: Number(e.target.value) })} value={data.adj_qty} />
            </div>
            <div className='mt-3 flex items-center gap-2'>
                <Button type='primary' onClick={handleAjustStock} disabled={data.adj_qty < 0 || data.partno == ''}>บันทึก</Button>
                <Button>ออกจากระบบ</Button>
            </div>
        </div>
    )
}

export default SettingWIP