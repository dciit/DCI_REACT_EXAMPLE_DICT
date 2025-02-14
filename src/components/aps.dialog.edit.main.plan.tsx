import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { DictMstr, PropMainSeq } from '../interface/aps.interface';
import { API_GET_REASON, APIApsEditMainSeq, ApiApsLogin } from '../service/aps.service';
import moment from 'moment';
import { Button, Descriptions, Input, Modal, notification, Radio, Result, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { IoWarningOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { IoLogInOutline } from "react-icons/io5";
import { OTPProps, OTPRef } from 'antd/es/input/OTP';
import { useDispatch } from 'react-redux';
type NotificationType = 'success' | 'info' | 'warning' | 'error';
export interface ParamDialogEditMainSeq {
    open: boolean;
    MainSeqSelected: PropMainSeq | null;
    setOpen: any;
    loadSeq: Function;
}
interface ParamEditMainSeq {
    PRD_PLAN_CODE: string;
    PRD_PLAN_QTY: number;
    APS_PLAN_QTY: number;
    PRD_REASON_CODE: string;
    PRD_REMARK: string;
    PRD_EMP_CODE: string;
}
function DialogEditMainSeq(props: ParamDialogEditMainSeq) {
    const { open, setOpen, MainSeqSelected, loadSeq } = props;
    const redux = useSelector((state: any) => state.redux);
    const empcode = (typeof redux.empcode != 'undefined') ? redux.empcode : '';
    const [api, contextHolder] = notification.useNotification();
    const [Handle, setHandle] = useState<boolean>(false);
    const openNotification = (type: NotificationType, msg: string) => {
        api[type]({
            message: 'แจ้งเตือน',
            description: msg,
        });
    };
    const [MainSeq, setMainSeq] = useState<PropMainSeq | null>(null);
    const [MainSeqEdit, setMainSeqEdit] = useState<ParamEditMainSeq>({
        PRD_PLAN_CODE: '',
        PRD_PLAN_QTY: 0,
        APS_PLAN_QTY: 0,
        PRD_REASON_CODE: '',
        PRD_REMARK: '',
        PRD_EMP_CODE: empcode
    });
    const [reasons, setReasons] = useState<DictMstr[]>([]);
    const [load, setLoad] = useState<boolean>(true);
    const [username, setUsername] = useState<string>('');
    const refInputLogin = useRef<OTPRef>(null);
    const dispatch = useDispatch();
    const init = async () => {
        setLoad(true);
        let resReason: DictMstr[] = await API_GET_REASON();
        setReasons(resReason);
        setLoad(false);
    }
    useEffect(() => {
        if (open == true) {
            setMainSeq(MainSeqSelected);
            setMainSeqEdit({
                ...MainSeqEdit,
                APS_PLAN_QTY: Number(MainSeqSelected?.APS_PLAN),
                PRD_PLAN_QTY: Number(MainSeqSelected?.PRD_PLAN),
                PRD_PLAN_CODE: typeof MainSeqSelected?.PRD_PLANCODE != 'undefined' ? MainSeqSelected?.PRD_PLANCODE : ''
            })
        }
    }, [open]);

    useEffect(() => {
        if (MainSeq != null) {
            init();
        }
    }, [MainSeq])
    useEffect(() => {
        if (MainSeqEdit.PRD_PLAN_QTY == MainSeqSelected?.APS_PLAN) {
            setMainSeqEdit({
                ...MainSeqEdit, PRD_REMARK: ''
            })
        }
    }, [MainSeqEdit.PRD_PLAN_QTY])
    const handleEditMainSeq = async () => {
        if (MainSeqEdit.PRD_PLAN_QTY == 0 && MainSeqEdit.PRD_REASON_CODE == '') {
            openNotification('error', `แก้ไขข้อมูลแผนผลิตไม่สำเร็จ เนื่องจาก : ไม่ได้เลือกสาเหตุ`);
            return false;
        }
        if ((MainSeqSelected?.APS_PLAN != MainSeqEdit.PRD_PLAN_QTY) && MainSeqEdit.PRD_REMARK == '') {
            openNotification('error', `แก้ไขข้อมูลแผนผลิตไม่สำเร็จ เนื่องจาก : ไม่ได้ระบุหมายเหตุ`);
            return false;
        }
        setHandle(true);
        try {
            let res = await APIApsEditMainSeq(MainSeqEdit);
            if (res.status == true) {
                openNotification('success', 'บันทึกข้อมูลเรียบร้อยแล้ว');
            } else {
                openNotification('error', `แก้ไขข้อมูลแผนผลิตไม่สำเร็จ เนื่องจาก : ${res.message}`);
            }
            setMainSeqEdit({ ...MainSeqEdit, PRD_REMARK: '' });
            loadSeq();
            setHandle(false);
        } catch (e: Error | any) {
            openNotification('error', `แก้ไขข้อมูลแผนผลิตไม่สำเร็จ เนื่องจาก : ${e.message}`);
            setHandle(false);
        }
    }
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };
    const handleLogin = async () => {
        console.log(username)
        let res = await ApiApsLogin(username);
        try {
            if (res.code != null) {
                openNotification('success', 'เข้าสู่ระบบสําเร็จ');
                dispatch({
                    type: 'LOGIN', payload: {
                        empcode: res.code,
                        img: res.img,
                        name: res.name,
                        surn: res.surn,
                        fullName: res.fullName
                    }
                })
            }
        } catch (e: Error | any) {
            openNotification('error', `ไม่สามารถเข้าสู่ระบบได้ เนื่องจาก ${e.message}`);
        }
    }
    const onChange: OTPProps['onChange'] = (text) => {
        setUsername(text);
    };
    const sharedProps: OTPProps = {
        onChange
    };
    useEffect(() => {
        if (username.length == 0) {
            refInputLogin.current?.focus();
        }
    }, [username])
    return (
        <Modal width={800} open={open} title={`แก้ไขข้อมูลแผนผลิต`} onCancel={() => setOpen(false)} onClose={() => setOpen(false)} footer={empcode == '' ? null : <div className='flex items-center gap-2 w-full justify-end'>
            <Button type='primary' onClick={() => handleEditMainSeq()} disabled={load} title={(MainSeq?.APS_PLAN == MainSeqEdit.PRD_PLAN_QTY ? 'ไม่มีอะไรแตกต่างจากกัน' : '')} loading={Handle}>บันทึก</Button>
            <Button onClick={() => setOpen(false)}>ปิดหน้าต่าง</Button>
        </div>}>
            {contextHolder}
            <Spin spinning={load}>
                {
                    empcode == '' ? <Result
                        status="404"
                        title="! คุณไม่มีสิทธิ กรุณาเข้าสู่ระบบ"
                        subTitle="Sorry, the page you visited does not information."
                        extra={<div className='w-full flex justify-center'>
                            <div className='flex flex-col w-fit gap-[8px] '>
                                <Input.OTP length={5} value={username} {...sharedProps} onKeyDown={handleKeyDown} ref={refInputLogin} />
                                <div className='flex justify-between gap-[8px]'>
                                    <Button className='flex-1' type="primary" icon={<IoLogInOutline size={20} />} onClick={() => handleLogin()}>เข้าสู่ระบบ</Button>
                                    <Button className='flex-2' onClick={() => {
                                        setUsername('')
                                    }}>ล้าง</Button>
                                </div>
                            </div>
                        </div>}
                    /> : MainSeq != null ?
                        <>
                            <Descriptions size='small' bordered column={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }} className='select-none' >
                                <Descriptions.Item label="รหัสแผนการผลิต" span={2}>{MainSeqSelected?.PRD_PLANCODE}</Descriptions.Item>
                                <Descriptions.Item label="แผนผลิตประจำวันที่" span={2}>{moment(MainSeq.YMD).format('DD/MM/YYYY')}</Descriptions.Item>
                                <Descriptions.Item label="ชื่อสินค้า (Model)" >{(MainSeq != undefined && typeof MainSeq.MODEL != 'undefined') ? MainSeq.MODEL : '-'}</Descriptions.Item>
                                <Descriptions.Item label="รหัสสินค้า (Sebango)">{(MainSeq != undefined && typeof MainSeq.SEBANGO != 'undefined') ? MainSeq.SEBANGO : '-'}</Descriptions.Item>
                                <Descriptions.Item label="จำนวนแผนผลิตที่ระบบวางแผน" span={2}>{(MainSeq != undefined && typeof MainSeq.APS_PLAN != 'undefined') ? MainSeq.APS_PLAN : 0}</Descriptions.Item>
                                <Descriptions.Item label="จำนวนแผนผลิตที่ต้องการผลิต" style={{ color: 'black' }} span={2}>
                                    <Input type='number' className='bg-yellow-50 font-semibold' value={MainSeqEdit.PRD_PLAN_QTY} onChange={(e) => setMainSeqEdit({ ...MainSeqEdit, PRD_PLAN_QTY: Number(e.target.value) })} />
                                </Descriptions.Item>
                                <Descriptions.Item label="สถานะแผนการผลิต" span={2}>
                                    <Radio.Group value={MainSeqEdit.PRD_PLAN_QTY != 0 ? 1 : 2} onChange={(e) => {
                                        setMainSeqEdit({ ...MainSeqEdit, PRD_PLAN_QTY: Number(e.target.value) == 2 ? 0 : Number(MainSeqSelected?.APS_PLAN), PRD_REASON_CODE: '' })
                                    }}>
                                        <Radio value={1} className='text-sky-600'>ผลิต</Radio>
                                        <Radio value={2} className='text-red-500' style={{ color: 'red' }} >ไม่ผลิต</Radio>
                                    </Radio.Group>
                                </Descriptions.Item>
                                {
                                    MainSeqEdit.PRD_PLAN_QTY == 0 && <>
                                        <Descriptions.Item label={<div className='flex gap-1 items-center text-red-500'><IoWarningOutline /> <span>สาเหตุที่ยกเลิกการผลิต</span></div>} span={2} style={{ color: 'black' }} >
                                            <Radio.Group onChange={(e) => setMainSeqEdit({ ...MainSeqEdit, PRD_REASON_CODE: e.target.value })}>
                                                {
                                                    reasons.map((oReason: DictMstr, iReason: number) => {
                                                        return <Radio key={iReason} value={oReason.code} className='font-semibold'>{oReason.description}</Radio>
                                                    })
                                                }
                                            </Radio.Group>
                                        </Descriptions.Item>
                                    </>
                                }
                                {
                                    (MainSeqEdit.PRD_REASON_CODE == 'REASON_2' || MainSeqEdit.PRD_PLAN_QTY == 0 || MainSeqSelected?.APS_PLAN != MainSeqEdit.PRD_PLAN_QTY) && <Descriptions.Item label="หมายเหตุ" span={2} style={{ alignContent: 'start' }}>
                                        <TextArea status={`${MainSeqSelected?.APS_PLAN != MainSeqEdit.PRD_PLAN_QTY ? 'error' : ''}`} rows={3} value={MainSeqEdit.PRD_REMARK} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMainSeqEdit({ ...MainSeqEdit, PRD_REMARK: e.target.value })} placeholder='กรุณากรอกหมายเหตุ หากมีการเปลี่ยนแปลงแผนการผลิต' />
                                    </Descriptions.Item>
                                }
                            </Descriptions>
                        </>
                        : <Result
                            status="404"
                            title="No Information"
                            subTitle="Sorry, the page you visited does not information."
                            extra={<Button type="primary">Back Home</Button>}
                        />
                }
            </Spin>
        </Modal>
    )
}
export default DialogEditMainSeq