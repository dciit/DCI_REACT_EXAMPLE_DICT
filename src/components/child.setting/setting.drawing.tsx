import { ParamGetPartSetInByDrawing, PropDrawings } from '@/interface/aps.interface'
import { APIGetDrawings, APIGetPartSetInByDrawing, APIUpdateStatusPartSetIn } from '@/service/aps.service';
import { Button, notification, Select, Switch, Table } from 'antd'
import  { useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import DialogAddModelToDrawing from './dialog.setting.drawing.add.model';
import { useSelector } from 'react-redux';
interface PropItem {
    key: string;
    ID: number;
    MODEL: string;
    MODELNAME: string;
    STATUS: string;
}
type NotificationType = 'success' | 'info' | 'warning' | 'error';
function SettingDrawing() {
    const redux = useSelector((state: any) => state.redux);
    const empcode = redux?.empcode || '';
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (type: NotificationType, message: string) => {
        api[type]({
            message: message,
            placement: 'topRight',
        });
    };
    const [openDialogAddModelToDrawing, setOpenDialogAddModelToDrawing] = useState<boolean>(false)
    const columns: TableProps<PropItem>['columns'] = [
        { title: '#', dataIndex: 'ID', key: 'ID' },
        { title: 'MODEL', dataIndex: 'MODEL', key: 'MODEL', render: (text) => { return <strong>{text}</strong> } },
        { title: 'MODEL NAME', dataIndex: 'MODELNAME', key: 'MODELNAME' },
        {
            title: 'STATUS', dataIndex: 'STATUS', key: 'STATUS', render: (_, row) => {
                return <Switch checkedChildren="ใช้งาน" unCheckedChildren="ไม่ใช้งาน" value={row.STATUS == 'ACTIVE' ? true : false} onChange={(e) => handleChangeStatus(e, row.ID)} />
            }
        },
    ]
    const [param, setParam] = useState<ParamGetPartSetInByDrawing>({ drawing: '' });
    const [drawings, setDrawings] = useState<PropDrawings[]>([]);
    const [data, setData] = useState<PropItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        init();
    }, [])
    const handleChangeStatus = async (checked: boolean, dictId: number) => {
        let RESUpdateStatusPartSetIn = await APIUpdateStatusPartSetIn({
            empcode: empcode,
            dictId: dictId,
            dictStatus: checked ? 'ACTIVE' : 'INACTIVE'
        });
        if (RESUpdateStatusPartSetIn.status == true) {
            openNotification('success', 'บันทึกข้อมูลเรียบร้อยแล้ว')
        } else {
            openNotification('error', 'เกิดข้อผิดพลาด')
        }
        handleSearch();
    }
    const init = async () => {
        let RESGetDrawings = await APIGetDrawings();
        setDrawings(RESGetDrawings);
    }
    const handleSearch = async () => {
        setLoading(true);
        let RESGetPartSetIN = await APIGetPartSetInByDrawing(param);
        setData(RESGetPartSetIN.map((item, i) => ({ key: i.toString(), ID: item.dictId, MODEL: item.code, MODELNAME: item.description, STATUS: item.dictStatus })))
        setLoading(false);
    }
    useEffect(() => {
        handleSearch();
    }, [param])
    return (
        <div className='flex flex-col  gap-6'>
            {contextHolder}
            <div className='flex gap-2 flex-col'>
                <span>เครื่องมือค้นหา</span>
                <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-2 pl-6'>
                        <strong>Drawing : </strong>
                        <Select showSearch placeholder="เลือกหรือค้นหา Drawing ที่ต้องการ" allowClear options={drawings.map(item => ({ label: item.drawing, value: item.drawing }))} onChange={(e) => setParam({ ...param, drawing: e })} />
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-2 items-start '>
                <Button icon={<PlusOutlined />} type='primary' onClick={() => setOpenDialogAddModelToDrawing(true)} disabled={param.drawing == '' || true}>เพิ่มโมเดล</Button>
                <Table size='small' loading={loading} columns={columns} dataSource={data} className='border w-full' pagination={false} />
            </div>
            <DialogAddModelToDrawing open={openDialogAddModelToDrawing} setOpen={setOpenDialogAddModelToDrawing} load={handleSearch} />
        </div>
    )
}

export default SettingDrawing