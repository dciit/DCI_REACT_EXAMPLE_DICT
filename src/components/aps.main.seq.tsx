import { RetweetOutlined, CloseOutlined, EditOutlined, PullRequestOutlined, HolderOutlined } from '@ant-design/icons';
import { Button, Popconfirm, notification, Spin, Dropdown, Result } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react'
import PlanStatusComponent from './list.status';
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined';
import { useSelector } from 'react-redux';
import { APIGetMainPlanOnly, APIChangeSublineSeq } from '@/service/aps.service';
import { PropIsError, PropMainSeq } from '../interface/aps.interface';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import DialogEditMainSeq from './aps.dialog.edit.main.plan';
import { intervalTime } from '@/constants';
type NotificationType = 'success' | 'info' | 'warning' | 'error';
const ItemMainSeq = ({ qty, status }: any) => {
    if (qty == 0) {
        return <div className='px-3 py-[3px] bg-red-600 text-white rounded-full w-fit '>ยกเลิก</div>
    } else {
        if (status == 'PROGRESS') {
            return <div className='px-3 pt-[3px] pb-[2px] bg-[#ffa500]/80 text-black font-semibold rounded-full w-fit border  border-black/20 '>
                <div className='flex items-center gap-1 '>
                    <span>กำลังผลิต</span>
                    <AiOutlineLoading3Quarters className='animate-spin text-black opacity-80' />
                </div>
            </div>
        } else if (status == 'SOME') {
            return <div className='px-3 py-[3px] bg-blue-600 text-white rounded-full w-fit '>ผลิตบางส่วน</div>
        } else if (status == 'SUCCESS') {
            return <div className='px-3 py-[3px] bg-green-700 text-white rounded-full w-fit '>ผลิตแล้ว</div>
        } else {
            return ''
        }
    }
}
interface ParamChangeMainSeq {
    from_prd_plan_code: string;
    to_prd_plan_code: string;
    empcode: string;
    remark: string;
}
function APSMainSeq() {
    const [IsError, setIsError] = useState<PropIsError>({ status: false, message: '' });
    const [MainSeq, setMainSeq] = useState<PropMainSeq[]>([]);
    const redux = useSelector((state: any) => state.redux);
    const empcode = (typeof redux.empcode != 'undefined') ? redux.empcode : '';
    const dtNow = moment().subtract(8, 'hours');
    // const [Changing, setChanging] = useState<any>({
    //     change: false,
    //     PRD_PLANCODE: ''
    // });
    const [MainSeqSelected, setMainSeqSelected] = useState<PropMainSeq | null>(null);
    const [OpenEditMainSeq, setOpenEditMainSeq] = useState<boolean>(false);
    const [Load, setLoad] = useState<boolean>(true);
    const [ParamChangeMainSeq, setParamChangeMainSeq] = useState<ParamChangeMainSeq>({
        from_prd_plan_code: '',
        to_prd_plan_code: '',
        empcode: '',
        remark: ''
    });
    const [once, setOnce] = useState<boolean>(true);
    useEffect(() => {
        if (once == true) {
            init();
        } else {
            const intervalCall = setInterval(() => {
                init();
            }, intervalTime);
            return () => {
                clearInterval(intervalCall);
            }
        }
    }, [])
    const init = async () => {
        try {
            let ReduxPlant = redux.filter?.plant;
            let ReduxLine = redux.filter?.line;
            if ((typeof ReduxPlant == 'undefined' || ReduxPlant == '') || (typeof ReduxLine == 'undefined' || ReduxLine == '')) {
                setLoad(false);
                setIsError({ status: true, message: 'ไม่พบข้อมูลของโรงงานและไลน์ผลิต กรุณาตรวจสอบหรือเลือกเมนูอีกครั้ง' });
            } else {
                setIsError({ status: false, message: '' });
                setLoad(true);
                const res = await APIGetMainPlanOnly({ plant: ReduxPlant, line: ReduxLine });
                setMainSeq(res.data);
                setLoad(false);
            }
            setOnce(false);
        } catch (e: Error | any) {
            setIsError({ status: true, message: e.message });
        }
    }

    const openNotificationWithIcon = (type: NotificationType, message: string) => {
        api[type]({
            message: 'แจ้งเตือน',
            description:
                message,
        });
    };
    useEffect(() => {
        if (MainSeqSelected != null && Object.keys(MainSeqSelected).length > 0) {
            setOpenEditMainSeq(true);
        }
    }, [MainSeqSelected]);

    useEffect(() => {
        if (!OpenEditMainSeq) {
            setMainSeqSelected(null);
        }
    }, [OpenEditMainSeq])

    const [api, contextHolder] = notification.useNotification();
    const handleChangeMainSeq = async () => {
        let res = await APIChangeSublineSeq({ fPrdPlanCode: ParamChangeMainSeq.from_prd_plan_code, tPrdPlanCode: ParamChangeMainSeq.to_prd_plan_code, remark: encodeURIComponent(ParamChangeMainSeq.remark), empcode: empcode });
        try {
            if (res.status == true) {
                openNotificationWithIcon('success', 'เปลี่ยนลำดับสำเร็จแล้ว');
                setParamChangeMainSeq({ ...ParamChangeMainSeq, from_prd_plan_code: '', to_prd_plan_code: '', remark: '', empcode: '' });
            } else {
                openNotificationWithIcon('error', `เปลี่ยนแผนลำดับไม่สำเร็จ ${res.message}`);
            }
            init();
        } catch (e: any) {
            openNotificationWithIcon('error', `เปลี่ยนแผนลำดับไม่สำเร็จ ${e.message}`);
        }
    }
    return (
        <div className='sm:w-[100%] md:w-[25%] flex flex-col gap-[16px]  bg-gradient-to-r from-green-50 to-teal-50 p-4 border rounded-xl '>
            {contextHolder}
            <div className='flex flex-col'>
                <strong>MAIN SCR SEQUENCE</strong>
                <small className='text-teal-700'>แผนการผลิตประจำไลน์ Main</small>
            </div>
            <PlanStatusComponent />
            {
                IsError.status == true ? <Result
                    status="error"
                    title="โหลดข้อมูลไม่สำเร็จ"
                    subTitle={IsError.message}
                    extra={[
                        <Button onClick={() => init()}>โหลดข้อมูลอีกครั้ง</Button>
                    ]}
                > </Result> : <Spin spinning={Load} tip={'กําลังโหลดข้อมูล'}>
                    <table className='w-full bg-white  shadow-md' id='tbMain'>
                        <thead className='sm:text-[8px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] border-b font-semibold select-none bg-gray-100 '>
                            <tr>
                                <td className='border py-1 text-center w-[10%]' rowSpan={2}>SEQ</td>
                                <td className='border w-[35%] pl-3' rowSpan={2}>MODEL</td>
                                <td className='border text-center py-1' colSpan={2}>PLAN</td>
                            </tr>
                            <tr>
                                <td className='border text-center w-[10%] py-1'>APS </td>
                            </tr>
                        </thead>
                        <tbody className='sm:text-[8px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]'>
                            {
                                MainSeq.filter(x => x.PLN_STATUS != 'HISTORY').map((o: PropMainSeq, i: number) => {
                                    let noPlan: boolean = o.PRD_PLAN == 0 ? true : false;
                                    let isDate: boolean = moment(o.YMD).format('YYYYMMDD') == dtNow.format('YYYYMMDD') ? true : false;
                                    let PlanStatus: string = o.PLN_STATUS;
                                    let PrdStatus: boolean = o.PLN_CURRENT == 'CURRENT';
                                    let isNextDay = o.PRD_SEQ == 1 ? true : false;
                                    let ChangePlanQty: boolean = o.APS_PLAN != o.PRD_PLAN ? true : false
                                    return <Fragment key={i}>
                                        {
                                            isNextDay && <tr className={`cursor-pointer select-none ${noPlan && 'opacity-50'}`} >
                                                <td colSpan={3} className='border py-2 pl-3'>
                                                    <div className='flex w-[100%] items-center gap-2'>
                                                        <strong>{moment(o.YMD).format('DD/MM/YYYY')}</strong>
                                                    </div>
                                                </td>
                                            </tr>
                                        }
                                        <tr className={`${PrdStatus == true && 'shadow-lg  border-2 border-black border-dashed'} ${isDate == true ? (PlanStatus == '' ? 'cursor-pointer' : (PrdStatus ? 'bg-[#FFA500]/10 ' : (PlanStatus == 'SOME' ? 'bg-blue-50' : (PlanStatus == 'SUCCESS' ? 'bg-green-50' : 'bg-white')))) : 'cursor-not-allowed opacity-40'} select-none `} >
                                            <td className={`border text-center ${PlanStatus == '' ? 'bg-[#F9FAFB]' : (PrdStatus ? 'bg-[#FFA500]  text-black font-semibold' : (PlanStatus == 'SOME' ? 'bg-blue-700 text-white' : (PlanStatus == 'SUCCESS' ? 'bg-green-700 text-white' : 'bg-white')))} font-semibold`} >
                                                {
                                                    isDate == true ? <span className={`${PrdStatus == true && 'font-bold text-[1.25em]'}`}>{o.PRD_SEQ}</span> : <RemoveCircleOutlinedIcon className='text-[#ddd]' />
                                                }
                                            </td>
                                            <td className={` pl-1  border`}>
                                                <div className='flex items-center justify-between pr-2'>
                                                    <div className='grow'>
                                                        <p className='font-bold'>{o.MODEL}</p>
                                                        <div className='flex items-center gap-1'>
                                                            {o.SEBANGO != '' && <strong className='text-blue-500 tracking-wider'>({o.SEBANGO})</strong>}
                                                            <ItemMainSeq qty={o.APS_PLAN} status={o.PLN_STATUS} />
                                                        </div>
                                                    </div>
                                                    <div className='flex-none flex items-center gap-2'>
                                                        {/* <div className='flex items-center gap-1' id='icon-edit' >
                                                        <Tooltip title={`${PlanStatus == 'SUCCESS' ? 'ผลิตครบแล้ว' : 'แก้ไขแผนการผลิต'}`}   >
                                                            <Button type="primary" size='small' shape="circle" icon={<EditOutlined size={16} onClick={() => setMainSeqSelected(o)} />} disabled={PlanStatus == 'SUCCESS'} />
                                                        </Tooltip>
                                                    </div> */}
                                                        {
                                                            (o.YMD == dtNow.format('YYYYMMDD') && o.PLN_STATUS != 'SUCCESS') && ParamChangeMainSeq.from_prd_plan_code != '' ? (
                                                                ParamChangeMainSeq.from_prd_plan_code == o.PRD_PLANCODE
                                                                    ? <Button type='default' icon={<CloseOutlined />} size='small' onClick={() => setParamChangeMainSeq({ ...ParamChangeMainSeq, from_prd_plan_code: '' })}></Button>
                                                                    : <Popconfirm
                                                                        title="คุณกำลังย้ายลำดับแผนผลิต"
                                                                        description={<div className='flex flex-col gap-[8px] pr-[16px] pb-[8px]'>
                                                                            คุณแน่ใจหรือไม่ว่าต้องการย้ายลำดับแผนผลิต?
                                                                            <TextArea
                                                                                allowClear
                                                                                value={ParamChangeMainSeq.remark}
                                                                                onChange={(e) => setParamChangeMainSeq({ ...ParamChangeMainSeq, remark: e.target.value, empcode: empcode })}
                                                                                placeholder="ระบุหมายเหตุที่ต้องย้ายลำดับแผนการผลิต"
                                                                                autoSize={{ minRows: 2, maxRows: 6 }}
                                                                            />
                                                                        </div>}
                                                                        onConfirm={() => ParamChangeMainSeq.remark.length == 0 ? openNotificationWithIcon('warning', 'ระบุหมายเหตุที่ต้องย้ายลำดับแผนการผลิต') : handleChangeMainSeq()}
                                                                        okText="ยืนยัน"
                                                                        cancelText="ยกเลิก"
                                                                        onCancel={() => setParamChangeMainSeq({ ...ParamChangeMainSeq, from_prd_plan_code: '', remark: '' })}
                                                                    >
                                                                        <Button type='primary' size='small' icon={<RetweetOutlined />} onClick={() => setParamChangeMainSeq({ ...ParamChangeMainSeq, to_prd_plan_code: o.PRD_PLANCODE })}></Button>
                                                                    </Popconfirm>
                                                            ) : <Dropdown menu={{
                                                                items: [
                                                                    {
                                                                        label: (
                                                                            <div className='flex items-center gap-2' onClick={() => setMainSeqSelected(o)} >
                                                                                <EditOutlined />
                                                                                <a >
                                                                                    แก้ไขยอดการผลิต
                                                                                </a>
                                                                            </div>
                                                                        ),
                                                                        key: '0',
                                                                    },
                                                                    {
                                                                        label: (
                                                                            <div className='flex items-center gap-2' onClick={() => setParamChangeMainSeq({ ...ParamChangeMainSeq, from_prd_plan_code: o.PRD_PLANCODE })}>
                                                                                <PullRequestOutlined />
                                                                                <a >
                                                                                    ย้ายลำดับการผลิต
                                                                                </a>
                                                                            </div>
                                                                        ),
                                                                        key: '1',
                                                                        disabled: false
                                                                    }
                                                                ]
                                                            }} >
                                                                <a onClick={(e) => e.preventDefault()}>
                                                                    {
                                                                        (o.YMD == dtNow.format('YYYYMMDD') && o.PLN_STATUS != 'SUCCESS') && <div>
                                                                            <div className='flex items-center justify-between h-full pl-2'>
                                                                                <div className='border rounded-sm bg-black/10 border-black/10 px-[3px] py-[3px] hover:bg-sky-500/20 transition-all duration-100'>
                                                                                    <HolderOutlined />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                </a>
                                                            </Dropdown>
                                                        }
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`border text-end pr-[4px] leading-none ${PrdStatus == true && 'bg-[#FFA500]'}`}>
                                                <div className={`pr-[4px] pt-[3px] pb-[2px] flex flex-col gap-[4px]  tracking-wider`}>
                                                    <span className={`   text-[1.25em] font-semibold ${PrdStatus == true ? 'text-black text-[1.25em]' : (ChangePlanQty == true ? 'text-red-600' : 'text-blue-700')}`}>{o.PRD_PLAN}</span>
                                                    {
                                                        ChangePlanQty && <small className='text-red-500'>{`[PD Changed]`}</small>
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    </Fragment>
                                })
                            }
                        </tbody>
                    </table>
                </Spin>
            }

            <DialogEditMainSeq open={OpenEditMainSeq} setOpen={setOpenEditMainSeq} MainSeqSelected={MainSeqSelected} loadSeq={init} />
        </div>
    )
}
export default APSMainSeq