import { RetweetOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Tooltip, Popconfirm, notification } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react'
import ListPlanStatus from './list.status';
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined';
import { useSelector } from 'react-redux';
import { APIChargeMainSeq  } from '@/service/aps.service';
import { PropsMain } from '../interface/aps.interface';
import DialogEditMainPlan from './aps.dialog.edit.main.plan';
type NotificationType = 'success' | 'info' | 'warning' | 'error';
const ItemMainSeq = ({ qty, status }: any) => {
    if (qty == 0) {
        return <div className='px-3 py-[3px] bg-red-600 text-white rounded-full w-fit '>ยกเลิก</div>
    } else {
        if (status == 'CURRENT') {
            return <div className='px-3 py-[3px] bg-[#FFA500] text-black font-semibold rounded-full w-fit shadow-lg'>กำลังผลิต</div>
        } else if (status == 'SOME') {
            return <div className='px-3 py-[3px] bg-blue-600 text-white rounded-full w-fit '>ผลิตบางส่วน</div>
        } else if (status == 'SUCCESS') {
            return <div className='px-3 py-[3px] bg-green-700 text-white rounded-full w-fit '>ผลิตแล้ว</div>
        } else {
            return ''
        }
    }
}
interface Params {
    mainSeq: PropsMain[];
    loadMain: Function;
}
function APSMainmainSeq(props: Params) {
    const { mainSeq, loadMain } = props;
    const redux = useSelector((state: any) => state.redux);
    const empcode = (typeof redux.empcode != 'undefined') ? redux.empcode : '';
    const dtNow = moment().subtract(8, 'hours');
    const [changeSeq, setChangeSeq] = useState<string>('');
    const [TextAreaChangeSeq, setTextAreaChageSeq] = useState<string>('');
    const [Changing, setChanging] = useState<any>({
        change: false,
        prdPlanCode: ''
    });
    // const [openDialogNotice, setOpenDialogNotice] = useState<boolean>(false);
    // const [Wips, setWips] = useState<PropsWip[]>([]);
    // const [once, setOnce] = useState<boolean>(true);
    // const [shrinkGage, setShrinkGage] = useState<PropShrinkGage | null>({ model: '', sebango: '', insertDate: '' });
    const [planSelected, setPlanSelected] = useState<PropsMain | null>(null);
    const [openEditPlan, setOpenEditPlan] = useState<boolean>(false);
    // useEffect(() => {
    //     if (once == true) {
    //         console.log('load')
    //         init();
    //     } else {
    // const intervalCall = setInterval(() => {
    //     init();
    // }, intervalTime);
    // return () => {
    //     clearInterval(intervalCall);
    // }
    // }
    // }, [once])

    // const init = async () => {
    // console.log('load')
    // const res = await ApiGetMainPlan({
    //     paramDate: dtNow.format('YYYYMMDD'),
    //     paramWCNO: '904'
    // });
    // console.log(res)
    // setmainSeq(res.main);
    // setWips(res.wip);
    // setShrinkGage(res.shrinkgage)
    // try {
    //     const lastGas = await ApiGetLastGastight();
    //     if (lastGas != null && lastGas != '') {
    //         setShrinkGage(lastGas);
    //     }
    // } catch {
    //     setShrinkGage(null);
    // }
    // setLoad(false);
    //     setOnce(false);
    // }
    const handleChangeSeq = async (prdPlanCode: string) => {
        if (TextAreaChangeSeq == '') {
            alert('กรุณาระบุหมายเหตุการเปลี่ยนแปลง')
        } else {
            let RESChargeMainSeq = await APIChargeMainSeq({ fPrdPlanCode: Changing.prdPlanCode, tPrdPlanCode: prdPlanCode, empcode: empcode });
            console.log(RESChargeMainSeq)
            try {
                if (RESChargeMainSeq.status) {
                    openNotificationWithIcon('success', 'เปลี่ยนลำดับสำเร็จแล้ว');
                    setChanging({ ...Changing, prdPlanCode: '', change: false });
                } else {
                    openNotificationWithIcon('error', `เปลี่ยนแผนลำดับไม่สำเร็จ ${RESChargeMainSeq.message}`);
                }
            } catch (e: any) {
                alert('error : ' + e.message);
            }
            // init();
        }
    }
    const openNotificationWithIcon = (type: NotificationType, message: string) => {
        api[type]({
            message: 'แจ้งเตือน',
            description:
                message,
        });
    };
    // useEffect(() => {
    //     if (planSelected != null && Object.keys(planSelected).length > 0) {
    //         setOpenDialogNotice(true);
    //     }
    // }, [planSelected]);
    // useEffect(() => {
    //     if (openDialogNotice == false) {
    //         setPlanSelected(null)
    //     }
    // }, [openDialogNotice])
    useEffect(() => {
        if (planSelected != null && Object.keys(planSelected).length > 0) {
            setOpenEditPlan(true);
        }
    }, [planSelected]);

    useEffect(()=>{
        if(!openEditPlan){
            setPlanSelected(null);
        }
    },[openEditPlan])

    const [api, contextHolder] = notification.useNotification();
    return (
        <div className='sm:col-span-1 md:col-span-1 lg:col-span-3 xl:col-span-2 flex flex-col gap-3  bg-gradient-to-r from-green-50 to-teal-50 p-4 border rounded-xl'>
            {contextHolder}
            <div className='flex flex-col'>
                <span>Main Scroll mainSeq Plan</span>
                <small className='text-teal-700'>แผนการผลิตประจำไลน์ Main</small>
            </div>
            <ListPlanStatus />
            <table className='w-full bg-white  shadow-md' id='tbMain'>
                <thead className='sm:text-[8px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] border-b font-semibold select-none bg-[#F9FAFB] '>
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
                        mainSeq.map((o: PropsMain, i: number) => {
                            let groupModelIsUse = mainSeq.map((o: PropsMain) => o.partNo);
                            groupModelIsUse = [...new Set(groupModelIsUse)];
                            let noPlan: boolean = o.prdPlanQty == 0 ? true : false;
                            let isDate: boolean = moment(o.apsPlanDate).format('DD/MM/YYYY') == dtNow.format('DD/MM/YYYY') ? true : false;
                            let apsCurrent: string = o.apsCurrent;
                            let apsDate = moment(o.apsPlanDate).format('DD/MM/YYYY');
                            let oPlanOfDay = mainSeq.filter((x: PropsMain) => moment(x.apsPlanDate).format('DD/MM/YYYY') == apsDate);
                            let isFirstOfDay = oPlanOfDay.length > 0 && oPlanOfDay[0].prdSeq == o.prdSeq;
                            return <Fragment key={i}>
                                {
                                    isFirstOfDay && <tr className={`cursor-pointer select-none ${noPlan && 'opacity-50'}`} >
                                        <td colSpan={3} className='border py-2 pl-3'>
                                            <div className='flex w-[100%] items-center gap-2'>
                                                <strong>{apsDate}</strong>
                                                {/* {
                                                    !load && <Button size='small' disabled={true} title='ปิดการใช้งานชั่วคราว' type='primary' icon={<AddIcon sx={{ width: '20px' }} />}>เพิ่มแผน</Button>
                                                } */}
                                                <Button disabled={apsDate == moment().subtract(8, 'hour').format('DD/MM/YYYY') ? false : true} size='small' type={`${(changeSeq.length > 0 && changeSeq == apsDate) ? 'primary' : 'default'}`} icon={<RetweetOutlined />} onClick={() => setChangeSeq(changeSeq != '' ? '' : apsDate)}>สลับลำดับ</Button>
                                                {

                                                    (changeSeq.length > 0 && changeSeq == apsDate) && <Button icon={<CloseOutlined />} type='default' onClick={() => setChangeSeq('')} size='small'>ยกเลิก</Button>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                }
                                <tr className={`${isDate == true ? (apsCurrent == '' ? 'cursor-pointer' : (apsCurrent == 'CURRENT' ? 'bg-[#FFA500]/10' : (apsCurrent == 'SOME' ? 'bg-blue-50' : (apsCurrent == 'SUCCESS' ? 'bg-green-50' : 'bg-white')))) : 'cursor-not-allowed opacity-40'} select-none ${noPlan && 'opacity-50'}`} >
                                    <td className={`border text-center ${apsCurrent == '' ? 'bg-[#F9FAFB]' : (apsCurrent == 'CURRENT' ? 'bg-[#FFA500] text-black font-semibold' : (apsCurrent == 'SOME' ? 'bg-blue-700 text-white' : (apsCurrent == 'SUCCESS' ? 'bg-green-700 text-white' : 'bg-white')))} font-semibold`} >
                                        {
                                            isDate == true ? o.prdSeq : <RemoveCircleOutlinedIcon className='text-[#ddd]' />
                                        }
                                    </td>
                                    <td className={` pl-1  border`}>
                                        <div className='flex items-center justify-between pr-2'>
                                            <div className='grow'>
                                                <p className='font-bold'>{o.partNo}</p>
                                                <div className='flex items-center gap-1'>
                                                    {o.modelCode != '' && <strong className='text-blue-500 tracking-wider'>({o.modelCode})</strong>}
                                                    <ItemMainSeq qty={o.apsPlanQty} status={apsCurrent} />
                                                </div>
                                            </div>
                                            <div className='flex-none flex items-center gap-2'>
                                                <div className='flex items-center gap-1' id='icon-edit' >
                                                    <Tooltip title={`${apsCurrent == 'SUCCESS' ? 'ผลิตครบแล้ว' : 'แก้ไขแผนการผลิต'}`}   >
                                                        <Button type="primary" size='small' shape="circle" icon={<EditOutlined size={16} onClick={() => event ? setPlanSelected(o) : false} />} disabled={apsCurrent == 'SUCCESS'} />
                                                    </Tooltip>
                                                </div>
                                                {
                                                    (changeSeq && changeSeq == apsDate) && <div className='flex items-center justify-end pr-1 '>
                                                        {
                                                            Changing.change == true ? (Changing.prdPlanCode == o.prdPlanCode ? <Button onClick={() => setChanging({ ...Changing, change: false, prdPlanCode: '' })} size='small'>ยกเลิก</Button> : <Popconfirm title='ยืนยันการเปลี่ยน' onConfirm={() => handleChangeSeq(o.prdPlanCode)} okText='ยืนยัน' cancelText='ยกเลิก' description={<div>
                                                                <TextArea rows={3} className='w-[250px]' size='small' onChange={(e) => setTextAreaChageSeq(e.target.value)} value={TextAreaChangeSeq} placeholder='กรุณาระบุหมายเหตุการเปลี่ยนแปลงลำดับการผลิต' />
                                                            </div>}>
                                                                <Button type='primary' size='small' disabled={apsCurrent == 'SUCCESS'} icon={Changing.change == true && <RetweetOutlined />}>สลับ
                                                                </Button>
                                                            </Popconfirm>) : <Button type='primary' size='small' disabled={apsCurrent == 'SUCCESS'} onClick={() => setChanging({ ...Changing, change: true, prdPlanCode: o.prdPlanCode })} icon={Changing.change == true && <RetweetOutlined />}>
                                                                เลือก
                                                            </Button>
                                                        }

                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`border text-end pr-[4px]`}>
                                        <div className='pr-[4px] pt-[3px] pb-[2px] flex flex-col  '>
                                            <span className={`font-semibold text-blue-700`}>{o.prdPlanQty}</span>
                                            {
                                                o.changePlanQty && <small className='text-red-500'>{`[PD Changed]`}</small>
                                            }
                                        </div>
                                    </td>
                                </tr>
                            </Fragment>
                        })
                    }
                </tbody>
            </table>
            <DialogEditMainPlan open={openEditPlan} setOpen={setOpenEditPlan} planSelected={planSelected} apsLoad={loadMain} data={null} setData={undefined} />
        </div>
    )
}

export default APSMainmainSeq