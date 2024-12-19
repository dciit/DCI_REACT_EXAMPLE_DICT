import { useEffect, useRef, useState } from 'react'
import { ApiAdjStock, APIGetDrawingSubline } from '../service/aps.service'
import { PropsAdjStock } from '../pages/aps.adj.stock'
import moment from 'moment'
import { useSelector } from 'react-redux'
import SCMLogin from './scm.login'
import { Alert, Badge, Button, Descriptions, DescriptionsProps, Input, Modal, notification, Radio, Select, Spin } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { PropMainWIPSelected } from '@/interface/aps.interface'

interface ParamWipDetail {
    open: boolean;
    setOpen: Function;
    wip: PropMainWIPSelected | null;
}
export interface PropsDrawing {
    model: string;
    sebango: string;
    partno: string;
    cm: string;
    wcno: string;
    qty: number;
}
type NotificationType = 'success' | 'info' | 'warning' | 'error';
const items: DescriptionsProps['items'] = [
    {
        key: '1',
        label: 'Product',
        children: 'Cloud Database',
    },
    {
        key: '2',
        label: 'Billing Mode',
        children: 'Prepaid',
    },
    {
        key: '3',
        label: 'Automatic Renewal',
        children: 'YES',
    },
    {
        key: '4',
        label: 'Order time',
        children: '2018-04-24 18:00:00',
    },
    {
        key: '5',
        label: 'Usage Time',
        children: '2019-04-24 18:00:00',
        span: 2,
    },
    {
        key: '6',
        label: 'Status',
        children: <Badge status="processing" text="Running" />,
        span: 3,
    },
    {
        key: '7',
        label: 'Negotiated Amount',
        children: '$80.00',
    },
    {
        key: '8',
        label: 'Discount',
        children: '$20.00',
    },
    {
        key: '9',
        label: 'Official Receipts',
        children: '$60.00',
    },
    {
        key: '10',
        label: 'Config Info',
        children: (
            <>
                Data disk type: MongoDB
                <br />
                Database version: 3.4
                <br />
                Package: dds.mongo.mid
                <br />
                Storage space: 10 GB
                <br />
                Replication factor: 3
                <br />
                Region: East China 1
                <br />
            </>
        ),
    },
];
function DialogWipDetail(props: ParamWipDetail) {
    const redux = useSelector((state: any) => state.redux);
    const empcode = (typeof redux.empcode != 'undefined') ? redux.empcode : '';
    const login = (typeof redux.login != 'undefined') ? redux.login : false;
    const { open, setOpen, wip } = props;
    const [success, setSuccess] = useState<boolean>(false);
    const [load, setLoad] = useState<boolean>(true);
    const [data, setData] = useState<PropsAdjStock>({ ymd: moment().format('YYYYMMDD'), wcno: '', partno: '', cm: '', adj_qty: 0, adj_by: empcode, remark: '', wipBefore: 0 });
    const [drawings, setDrawings] = useState<PropsDrawing[]>([]);
    const refInpRemark = useRef<HTMLTextAreaElement | null>(null);
    const [remarkError, setRemarkError] = useState<boolean>(false);
    const [api, contextHolder] = notification.useNotification();
    const [saving, setSaving] = useState<boolean>(false);
    const openNotificationWithIcon = (type: NotificationType, message: string) => {
        api[type]({
            message: 'แจ้งเตือน',
            description: message
        });
    };
    useEffect(() => {
        if (open == true) {
            init();
        } else {
            setData({ ymd: moment().format('YYYYMMDD'), wcno: '', partno: '', cm: '', adj_qty: 0, adj_by: '', remark: '', wipBefore: 0 });
        }
    }, [open]);
    const init = async () => {
        setLoad(true);
        if (wip?.LINE_CODE != undefined && wip?.WIP_INFO.SEBANGO != undefined) {
            try {
                let res = await APIGetDrawingSubline({
                    group: wip?.LINE_CODE,
                    sebango: wip?.WIP_INFO.SEBANGO,
                    type: wip.PROCESS_CODE
                });
                setDrawings(res);
                setLoad(false)
            } catch {
                setData({ ...data, wcno: '' });
            }
        }
    }
    useEffect(() => {
        if (drawings.length) {
            setData((prev) => ({ ...prev, partno: drawings[0].partno, cm: drawings[0].cm, wcno: drawings[0].wcno, adj_qty: drawings[0].qty, wipBefore: drawings[0].qty }));
        }
        setLoad(false);
    }, [drawings])

    const handleUpdateWip = async () => {
        if (data?.remark == undefined || data.remark.trim() == '' || (data.remark.trim().length == 1 && data.remark.trim() == '-')) {
            setRemarkError(true);
            setData({ ...data, remark: '' });
            refInpRemark.current?.focus();
            return false;
        }
        setRemarkError(false);
        if (confirm(`คุณแน่ใจใช่หรือไม่ ว่าต้องการ Adj.Wip = ${data.adj_qty} ?`)) {
            setSaving(true);
            if (isNaN(data.adj_qty) && data.adj_qty == null || data.adj_qty < 0 || data.wcno == '' || data.partno == '') {
                alert('ข้อมูลไม่ครบถ้วน');
                return false;
            } else {
                let res = await ApiAdjStock(data);
                setData({ ...data, remark: '', wipBefore: data.adj_qty });
                if (res.status == true) {
                    openNotificationWithIcon('success', 'แก้ไขยอดคงเหลือเรียบร้อยแล้ว');
                    setSuccess(true);
                    setSaving(false);
                } else {
                    openNotificationWithIcon('error', 'เกิดข้อผิดพลาดระหว่างแก้ไขข้อมูล ติดต่อ 250 เบียร์');
                    setSaving(false);
                }
            }
        }
    }
    useEffect(() => {
        if (success == true) {
            setTimeout(() => {
                setSuccess(false);
            }, 5000);
        }
    }, [success])
    return (
        <Modal width={1000} open={open} onClose={() => setOpen(false)} onCancel={() => setOpen(false)} footer={
            <div className={`${login == false ? 'hidden' : ''} flex items-center gap-1 justify-end`}>
                <Button type='primary' disabled={(data.adj_qty < 0 || data?.partno == null || load) ? true : false} title={data.adj_qty < 0 ? 'กรุณาระบุยอดคงเหลือมากกว่า 0' : (data?.partno == null ? 'ข้อมูลของ Part ไม่ครบถ้วน' : '')} onClick={data.adj_qty < 0 ? () => undefined : handleUpdateWip} loading={saving} >บันทึก</Button>
                <Button onClick={() => setOpen(false)}>ปิดหน้าต่าง</Button>
            </div>
        }>
            <div className='w-full'>

                {contextHolder}
                {
                    login == false ? <SCMLogin /> : <div className=''>
                        <Spin spinning={load} tip='กำลังโหลดข้อมูล'>
                            <Descriptions title="WIP Information" bordered column={{ xs: 2, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 }} size='small' >
                                <Descriptions.Item key={'Model'} label="Model">{wip?.WIP_INFO?.MODEL}</Descriptions.Item>
                                <Descriptions.Item label="Sebango">{wip?.WIP_INFO.SEBANGO}</Descriptions.Item>
                                <Descriptions.Item label="Drawing">
                                    <Select className='w-full' onChange={(e) => setData({ ...data, partno: e, adj_qty: drawings.filter(x => x.partno == e)[0].qty, cm: drawings.filter(x => x.partno == e)[0].cm, wcno: drawings.filter(x => x.partno == e)[0].wcno })} value={data.partno}>
                                        {
                                            Array.from(new Set([...drawings.map(x => x.partno)])).map((item, index) => {
                                                return <Select.Option key={index} value={item}>{item}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Descriptions.Item>
                                <Descriptions.Item label="CM">{data.cm}</Descriptions.Item>
                                <Descriptions.Item label="รหัสพื้นที่" span={2}>
                                    <Radio.Group onChange={(e) => setData({ ...data, wcno: e.target.value, adj_qty: drawings.filter(x => x.partno == data.partno && x.wcno == e.target.value)[0].qty })} value={data.wcno}>
                                        {
                                            drawings.filter(x => x.partno == data.partno).map((item, index) => {
                                                return <Radio.Button key={index} value={item.wcno}>{item.wcno}</Radio.Button>
                                            })
                                        }
                                    </Radio.Group>
                                </Descriptions.Item>
                                <Descriptions.Item style={{ color: 'black' }} label="จำนวนคงเหลือ" span={2}>
                                    <Input type='number' className='font-semibold focus:bg-sky-50' value={data.adj_qty} onChange={(e) => setData({ ...data, adj_qty: Number(e.target.value) })} autoFocus />
                                </Descriptions.Item>
                                <Descriptions.Item label="จำนวนคงเหลือ (รวม)" span={2}>
                                    {drawings.reduce((acc, current) => acc + current.qty, 0)}
                                </Descriptions.Item>
                                <Descriptions.Item style={{ alignContent: 'start' }} label={<div className='flex gap-2'><span className='text-red-500'>เหตุผลที่ต้องแก้ไขตัวเลข</span><span className='text-black'>จำนวนคงเหลือ</span></div>}>
                                    <TextArea
                                        allowClear
                                        placeholder="กรุณาระบุเหตุผลที่ต้องแก้ไขตัวเลขจำนวนคงเหลือ"
                                        autoSize={{ minRows: 2, maxRows: 6 }}
                                        value={data.remark} onChange={(e) => setData({ ...data, remark: e.target.value })} ref={refInpRemark}
                                    />
                                </Descriptions.Item>
                            </Descriptions>
                        </Spin>
                    </div>
                }
            </div >
        </Modal >
    )
}

export default DialogWipDetail