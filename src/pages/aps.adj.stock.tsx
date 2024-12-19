import { Button, Result, Tabs  } from 'antd';
import SettingModel from '@/components/child.setting/setting.drawing';
import SettingPrivilege from '@/components/child.setting/setting.privilege';
import SettingDrawingSubline from './aps.setting.drawing.subline';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DialogLogin from '@/components/dialog.login';
import APSMaster from './aps.master';
export interface PropsAdjStock {
    ymd: string;
    wcno: string;
    partno: string;
    cm: string;
    adj_qty: number;
    adj_by: string;
    remark: string;
    wipBefore?: number;
}
export interface ParamAdminUpdateDrawing {
    drawing: string;
    cm: string;
    empcode?: string;
}
// const Context = React.createContext({ name: 'Default' });
function AdjStock() {
    const redux = useSelector((state: any) => state.redux);
    const [open, setOpen] = useState<boolean>(false);
    const menuTabs = [
        // { label: 'แก้ไขยอดคงเหลือ (Wip)', key: '0', children: <SettingWIP /> },
        { label: 'สิทธิ', key: '1', children: <SettingPrivilege /> },
        { label: 'จัดการโมเดล', key: '2', children: <SettingModel /> },
        { label: 'Subline Management', key: '3', children: <SettingDrawingSubline /> },
        { label: 'Master', key: '4', children: <APSMaster /> },
    ]
    useEffect(() => {
        if (redux?.login == undefined || redux?.login == false) {
            setOpen(true);
        }
    }, [])
    return (
        <div className='grid gap-3'>

            {
                redux?.login != undefined && redux.login == true ? <Tabs type='card' items={menuTabs} defaultActiveKey="0" > </Tabs> : <Result
                    status="error"
                    title="Permission Failed"
                    subTitle="You do not have permission to manage the data. Please log in."
                    extra={[
                        <Button type="primary" onClick={() => setOpen(true)}>
                            เข้าสู่ระบบ
                        </Button>
                    ]}
                >
                </Result>
            }
            <DialogLogin open={open} setOpen={setOpen} />
        </div >
    )
}

export default AdjStock