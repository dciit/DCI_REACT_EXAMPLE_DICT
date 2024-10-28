import { Card, Flex, Input, Select, Tag, Alert, Button, notification } from 'antd'
import { useEffect, useState } from 'react'
import DialogLogin from '../dialog.login'
import { useSelector } from 'react-redux';
import { PropOptionAnt, PropPrivilege, PropUserInformation } from '@/interface/admin.interface';
import { ApiApsSavePrivilege, ApiGetUserInformation } from '@/service/aps.service';

type NotificationType = 'success' | 'info' | 'warning' | 'error';
function SettingPrivilege() {
    const [openLogin, setOpenLogin] = useState<boolean>(false);
    const redux = useSelector((state: any) => state.redux);
    const reduxLogin = redux.login;
    const reduxEmpcode = redux.empcode;
    const [userInfo, setUserInfo] = useState<PropUserInformation[]>([]);
    const [objPrivilege, setObjPrivilege] = useState<PropPrivilege>({
        empcode: '',
        privilege: undefined,
        updateBy: reduxEmpcode,
        wcno: []
    })
    const [openAlertPrivilege, setOpenAlertPrivilege] = useState<boolean>(false);
    const [ListWC, setListWC] = useState<PropOptionAnt[]>([]);
    const [openAlertWCPrivilege, setOpenAlertWCPrivilege] = useState<boolean>(false);
    const [openAlertSavePrivilege, setOpenAlertSavePrivilege] = useState<any>({
        open: false,
        message: ''
    });
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (type: NotificationType) => {
        api[type]({
            message: `บันทึกข้อมูลเรียบร้อยแล้ว`,
            placement: 'topRight',
        });
    };
    useEffect(() => {
        init();
    }, [])
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
    useEffect(() => {
        setOpenAlertSavePrivilege({ ...openAlertSavePrivilege, open: false, message: '' });
        setOpenAlertPrivilege(false);
        setOpenAlertWCPrivilege(false);
    }, [objPrivilege])
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
        <>
            {contextHolder}
            {
                reduxLogin == true ? <div className='sm:grid-cols-3 grid grid-cols-2 gap-6'>
                    {
                        userInfo.filter(x => x.code == reduxEmpcode && x.description == 'ADMIN').length > 0 && <Card className='shadow-sm' title='การให้สิทธิของแต่ละบุคคล' bordered={true} >
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

                    {/* <div className='border rounded-md p-6 shadow-md'>
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
                    </div> */}
                </div> : <Card>
                    <Flex vertical gap={6}>
                        <span>คุณจำเป็นต้องเข้าสู่ระบบก่อนเพื่อสามารถใช้งานในฟังก์ชันต่างๆ ที่ระบบมีให้ได้กับคุณได้</span>
                        <Button type='primary' className='w-fit' onClick={() => setOpenLogin(true)}>เข้าสู่ระบบ</Button>
                    </Flex>
                    <DialogLogin open={openLogin} setOpen={setOpenLogin} />
                </Card>
            }
        </>
    )
}

export default SettingPrivilege