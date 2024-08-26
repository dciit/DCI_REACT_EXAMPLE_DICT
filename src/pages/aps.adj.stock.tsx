import { Divider } from '@mui/material';
import moment from 'moment';
import  { ChangeEvent, useEffect, useState } from 'react'
import { ApiAdjStock, ApiAdminUpdateDrawing, ApiApsSavePrivilege, ApiGetUserInformation } from '../service/aps.service';
import { toast, ToastContainer } from 'react-toastify';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { Alert, Button, Card, Flex, Input , notification, Select, Tag } from 'antd';
import SearchIcon from '@mui/icons-material/Search';
import { PropOptionAnt, PropPrivilege, PropUserInformation } from '@/interface/admin.interface';
import DialogLogin from '@/components/dialog.login';
import { useSelector } from 'react-redux';
type NotificationType = 'success' | 'info' | 'warning' | 'error';
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
// const Context = React.createContext({ name: 'Default' });
function AdjStock() {
    const redux = useSelector((state: any) => state.redux);
    const reduxLogin = redux.login;
    const reduxEmpcode = redux.empcode;
    const [openLogin, setOpenLogin] = useState<boolean>(false);
    const [data, setData] = useState<PropsAdjStock>({ ymd: moment().format('YYYYMMDD'), wcno: '904', partno: '', cm: '', adj_qty: 0, adj_by: '' });
    const [drawing, setDrawing] = useState<ParamAdminUpdateDrawing>({
        drawing: '',
        cm: ''
    });
    const [ListWC, setListWC] = useState<PropOptionAnt[]>([]);
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (type: NotificationType) => {
        api[type]({
            message: `บันทึกข้อมูลเรียบร้อยแล้ว`,
            placement: 'topRight',
        });
    };
    // const privilege: string[] = ['41256', '40865', '30146', '41078', '10986', '24448'];
    const [empcode] = useState<string>('');
    const [openAlertWCPrivilege, setOpenAlertWCPrivilege] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<PropUserInformation[]>([]);
    const [openAlertSavePrivilege, setOpenAlertSavePrivilege] = useState<any>({
        open: false,
        message: ''
    });
    const [objPrivilege, setObjPrivilege] = useState<PropPrivilege>({
        empcode: '',
        privilege: undefined,
        updateBy: reduxEmpcode,
        wcno: []
    })

    useEffect(() => {
        init();
    }, [])
    useEffect(() => {
        setOpenAlertSavePrivilege({ ...openAlertSavePrivilege, open: false, message: '' });
        setOpenAlertPrivilege(false);
        setOpenAlertWCPrivilege(false);
    }, [objPrivilege])
    const init = async () => {
        let res = await ApiGetUserInformation(reduxEmpcode);
        let buff: PropOptionAnt[] = [];
        res.wcno.map((o: string) => {
            buff.push({
                label: o,
                value: o
            })
        })
        setUserInfo(res.userInfo)
        setListWC(buff);
    }
    const [openAlertPrivilege, setOpenAlertPrivilege] = useState<boolean>(false);
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
    // const handleLogin = async () => {
    //     if (privilege.includes(empcode)) {
    //         setData({ ...data, adj_by: empcode });
    //         setLogin(true);
    //     } else {
    //         setData({ ...data, adj_by: '' });
    //         setLogin(false);
    //     }
    // }
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


    // const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    //     if (event.key === 'Enter') {
    //         handleLogin();
    //     }
    // };
    const handleSavePrivilege = async () => {
        if (typeof objPrivilege.privilege == 'undefined') {
            setOpenAlertPrivilege(true);
            return false;
        }
        if (objPrivilege.empcode == '' || objPrivilege.updateBy == '') {
            setOpenAlertPrivilege(true);
            return false;
        }
        if (objPrivilege.privilege == 'backflush' && objPrivilege.wcno.length == 0) {
            setOpenAlertWCPrivilege(true);
            return false;
        }
        let res = await ApiApsSavePrivilege(objPrivilege);
        if (res.status) {
            openNotification('success')
        } else {
            setOpenAlertSavePrivilege({ ...openAlertSavePrivilege, open: true, message: res.message })
        }
    }
    return (
        <div className='grid gap-3'>
            {contextHolder}
            <Button icon={<SearchIcon />} className='w-fit'>ตรวจสอบสิทธิ</Button>
            {
                reduxLogin == true ? <div className='sm:grid-cols-3 grid grid-cols-2 gap-6'>
                    {
                        userInfo.filter(x => x.code == reduxEmpcode && x.description == 'ADMIN').length > 0 && <Card className='shadow-sm' title='การให้สิทธิของแต่ละบุคคล' bordered={true} >
                            {/* {
                            JSON.stringify(objPrivilege)
                        } */}
                            <Flex gap={12} vertical>
                                <Flex vertical gap={3}>
                                    <span>รหัสพนักงาน</span>
                                    <Input type='text' placeholder='กรุณาระบุรหัสพนักงานที่ต้องการให้สิทธิ' onChange={(e) => setObjPrivilege({ ...objPrivilege, empcode: e.target.value })} value={objPrivilege.empcode} />
                                </Flex>
                                <Flex vertical gap={3}>
                                    <span>สิทธิที่มอบ</span>
                                    <Select value={objPrivilege.privilege} placeholder='กรุณาเลือกสิทธิที่ต้องมอบให้' options={[
                                        { label: <span>Admin  <Tag color="red">สิทธิเฉพาะระดับ Admin เท่านั้น</Tag></span>, value: 'admin', disabled: userInfo.filter(x => x.description == "ADMIN").length ? false : true },
                                        { label: 'สิทธิแก้ไขยอดคงเหลือ WIP', value: 'adjstock' },
                                        { label: 'สิทธิบันทึกข้อมูล Backflush', value: 'backflush' }
                                    ]} onChange={(e) => setObjPrivilege({ ...objPrivilege, privilege: e == undefined ? undefined : e, wcno: [] })} allowClear />
                                </Flex>
                                {
                                    objPrivilege.privilege == 'backflush' && <Flex>
                                        <Select
                                            mode="multiple"
                                            allowClear
                                            style={{ width: '100%' }}
                                            placeholder="Please select"
                                            options={ListWC}
                                            onChange={(e) => setObjPrivilege({ ...objPrivilege, wcno: e })}
                                        />
                                    </Flex>
                                }
                                {
                                    openAlertPrivilege == true && <Alert className='select-none'
                                        message="กรุณาระบุข้อมูลให้ครบถ้วน"
                                        type="warning"
                                        showIcon
                                        closable
                                        onClose={() => setOpenAlertPrivilege(false)}
                                    />
                                }
                                {
                                    openAlertWCPrivilege == true && <Alert className='select-none'
                                        message="กรุณาระบุ WCNO ที่เป้าหมายรับผิดชอบ"
                                        type="warning"
                                        showIcon
                                        closable
                                        onClose={() => setOpenAlertWCPrivilege(false)}
                                    />
                                }
                                {
                                    openAlertSavePrivilege.open == true && <Alert className='select-none'
                                        message={<span className='text-red-500'>{openAlertSavePrivilege.message}</span>}
                                        type="error"
                                        showIcon
                                        closable
                                        onClose={() => setOpenAlertSavePrivilege({ ...openAlertSavePrivilege, open: false })}
                                    />
                                }
                                <Flex gap={6}>
                                    <Button type='primary' onClick={handleSavePrivilege}>บันทึก</Button>
                                    <Button onClick={() => setObjPrivilege({ ...objPrivilege, empcode: '', privilege: undefined, wcno: [] })}>ล้าง</Button>
                                </Flex>
                            </Flex>
                        </Card>
                    }
                    <div className='border rounded-md p-6 shadow-md'>
                        <div className='mb-2 uppercase font-semibold flex  gap-2 items-center'>
                            <AutoFixHighIcon />
                            <span>ปรับเปลี่ยนยอดคงเหลือของ WIP</span>
                        </div>
                        <Divider />
                        <div className='mt-3'>
                            <p>YMD</p>
                            <Input type='date' onChange={(e: ChangeEvent<HTMLInputElement>) => setData({ ...data, ymd: moment(e.target.value).format('YYYYMMDD') })} value={moment(data.ymd, 'YYYYMMDD').format('YYYY-MM-DD')} />
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
                            <Button type='primary' onClick={handleAjustStock}>บันทึก</Button>
                            <Button>ออกจากระบบ</Button>
                        </div>
                    </div>

                    <div className='border rounded-md p-6 shadow-md'>
                        <div>
                            <div className='mb-2 uppercase font-semibold flex  gap-2 items-center'>
                                <ChangeCircleIcon />
                                <span>แก้ไขข้อมูล Drawing</span>
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
                                <Button onClick={handleChangeDrawingDetail} disabled={true} title='ผิดการใช้งานชั่วคราว'>บันทึก</Button>
                                <Button disabled={true} title='ผิดการใช้งานชั่วคราว'>ออกจากระบบ</Button>
                            </div>
                        </div>
                    </div>
                </div> : <Card>
                    <Flex vertical gap={6}>
                        <span>คุณจำเป็นต้องเข้าสู่ระบบก่อนเพื่อสามารถใช้งานในฟังก์ชันต่างๆ ที่ระบบมีให้ได้กับคุณได้</span>
                        <Button type='primary' className='w-fit' onClick={() => setOpenLogin(true)}>เข้าสู่ระบบ</Button>
                    </Flex>
                    <DialogLogin open={openLogin} setOpen={setOpenLogin} />
                </Card>
            }

            <ToastContainer autoClose={1500} />
        </div>
    )
}

export default AdjStock