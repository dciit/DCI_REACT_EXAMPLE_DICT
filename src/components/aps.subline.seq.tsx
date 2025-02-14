import { PropApsPlnInfo, PropRouter, PropRouterSublineSeq, PropsMain, PropSublineSeq } from '@/interface/aps.interface';
import { APIApsRouter, APIGetApsProductionPlanInfo, APIGetRMInfo, APISublinePlan, APIUpdateApsProdPlan, APIUpdateRMStock, APIUpdateSeqSublineSeq } from '@/service/aps.service';
import { Badge, Button, Descriptions, Dropdown, Input, Modal, notification, Popover, Radio, Result, Spin, Tabs, Tooltip, Typography } from 'antd';
import { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { AiOutlineCoffee } from "react-icons/ai";
import { FaCheck } from "react-icons/fa6";
import { BsDiamondHalf } from "react-icons/bs";
import { useNavigate } from 'react-router';
import { base, intervalTime } from '@/constants';
import moment from 'moment';
const { Paragraph } = Typography;

type NotificationType = 'success' | 'info' | 'warning' | 'error';
interface ParamMainPlan {
    line: string;
    process: string[];
    subline: string;
    setSubline: Function;
    oMainSeq: PropsMain[];
}
interface PropSublineLastUpdate {
    partno: string;
    updatedate: string;
    updateby: string;
}
interface ParamSublineSeq {
    line: string;
    process: string;
    paramDate: string;
}
interface ParamSublineRMInfo {
    type: string;
    partno: string;
    wcno: string;
    process: string;
}

interface PropRMInfo {
    data: PropItemRMInfo[];
    load: boolean;
}

interface PropItemRMInfo {
    PARENT_WCNO: string;
    PARENT_PART_NO: string;
    PARENT_CM: string;
    PARENT_PART_DESC: string;
    WCNO: string;
    PART_NO: string;
    CM: string;
    PART_DESC: string;
    PART_PROCESS: string;
    BAL: number;
    LUPDATE: string;
}
interface PropSublineDatas {
    load: boolean;
    plan: PropItemSublineDatas[];
    rowspan: PropSublineRowSpan[];
    router: PropSublineRouter[];
}
interface PropSublineRouter {
    process_code: string;
    process_txt: string;
}
interface PropItemSublineDatas {
    rn: number;
    aps_seq: number;
    model: string;
    partno: string;
    cm: string;
    common_model: string;
    qty: number;
}
interface PropSublineRowSpan {
    rn: number;
    part: string;
    rowspan: number;
    filter: string;
}
function SublineWIPs(_: ParamMainPlan) {
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();
    const openNotification = (type: NotificationType, message: string) => {
        api[type]({
            message: 'แจ้งเตือน',
            description: message
        });
    };
    const redux = useSelector((state: any) => state.redux);
    const empcode = (typeof redux.empcode != 'undefined') ? redux.empcode : '';
    const plant = (typeof redux.filter?.plant != 'undefined') ? redux.filter?.plant : '';
    const [load, setLoad] = useState<boolean>(true);
    const [openRMDetail, setOpenRMDetail] = useState<boolean>(false);
    const [SublineLastUpdate] = useState<PropSublineLastUpdate[]>([]);
    const [PrdPlanCodeSelected, setPrdPlanCodeSelected] = useState<string>('');
    const [openEditSublineSeq, setOpenEditSublineSeq] = useState<boolean>(false);
    const [ApsPlnInfo, setApsPlnInfo] = useState<PropApsPlnInfo>({ data: [], load: true });
    const [FromPrdPlanCode, setFromPrdPlanCode] = useState<string>('');
    const [Routers, setRouters] = useState<PropRouter[]>([]);
    const [SublineParam, setSublineParam] = useState<ParamSublineSeq>({ line: '', process: '', paramDate: moment().subtract(8, 'hours').format('YYYY-MM-DD') });
    // const [SublineParam, setSublineParam] = useState<ParamSublineSeq>({ line: '', process: '', paramDate: '2025-01-31' });
    const [LineSelected] = useState<string>('');
    const [SublineInfo, setSublineInfo] = useState<PropSublineSeq>();
    const [SublineRMInfo, setSublineRMInfo] = useState<ParamSublineRMInfo>({
        type: '',
        partno: '',
        process: '',
        wcno: ''
    });
    const [RMInfo, setRMInfo] = useState<PropRMInfo>({ data: [], load: true });
    const [RMPartNoSelected, setRMPartNoSelected] = useState<string>('');
    const [IsError, setIsError] = useState<any>({
        status: false,
        message: ''
    });
    const [once, setOnce] = useState<boolean>(true);
    const [SublinePlanDatas, setSublinePlanDatas] = useState<PropSublineDatas>({
        load: true,
        plan: [],
        rowspan: [],
        router: []
    });
    const init = async () => {
        if (plant == '') {
            navigate(`./${base}/main`)
        }
        try {
            let routers = await APIApsRouter(plant);
            setRouters(routers);
            if (LineSelected == '') {
                setSublineParam({ ...SublineParam, line: routers[0].LINE_GROUP, process: routers[0].LINE_CODE })
            }
            setIsError({ status: false, message: '' })
        } catch (e: Error | any) {
            setIsError({ status: true, message: e.message });
        }
        setOnce(false);
        if (plant == '') {
            navigate(`./${base}/main`)
        }
        try {
            let routers = await APIApsRouter(plant);
            setRouters(routers);
            if (LineSelected == '') {
                setSublineParam({ ...SublineParam, line: routers[0].LINE_GROUP, process: routers[0].LINE_CODE })
            }
            let RESSublineDatas = await APISublinePlan(SublineParam);
            setSublinePlanDatas({ ...RESSublineDatas, load: false });
            // setIsError({ status: false, message: '' })
        } catch (e: Error | any) {
            setIsError({ status: true, message: e.message });
        }
        setOnce(false);
    }
    useEffect(() => {
        console.log(SublinePlanDatas)
    }, [SublinePlanDatas])
    useEffect(() => {
        if (IsError.status) {
            setLoad(false);
        }
    }, [IsError])
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

    useEffect(() => {
        if (SublineRMInfo.partno != '' && SublineRMInfo.type) {
            setOpenRMDetail(true);
        }
    }, [SublineRMInfo])

    useEffect(() => {
        if (SublineParam.line != '' && SublineParam.process != '') {
            LoadSublineData();
        }
    }, [SublineParam])

    const LoadSublineData = async () => {
        // setIsError({ status: false, message: '' });
        // setLoad(true);
        // let res = await APIGetSublineSeq(SublineParam);
        // console.log(res)
        // setSublineInfo(res);
        // setLoad(false);
    }
    const LoadAPSPrdPlnInfo = async () => {
        setApsPlnInfo({ ...ApsPlnInfo, data: [], load: true });
        let res = await APIGetApsProductionPlanInfo(PrdPlanCodeSelected);
        try {
            if (typeof res.data != 'undefined' && res.data.length > 0) {
                setApsPlnInfo({ ...ApsPlnInfo, data: res.data[0], load: false });
            } else {
                setApsPlnInfo({ ...ApsPlnInfo, data: [], load: false });
            }
        } catch (e: Error | any) {
            openNotification('error', `เกิดข้อผิดพลาด ${e.message}`)
        }
        setApsPlnInfo(res);
        setLoad(false);
    }
    useEffect(() => {
        if (openEditSublineSeq) {
            LoadAPSPrdPlnInfo();
        } else {
            setPrdPlanCodeSelected('');
        }
    }, [openEditSublineSeq])
    useEffect(() => {
        if (PrdPlanCodeSelected != '') {
            setOpenEditSublineSeq(true);
        }
    }, [PrdPlanCodeSelected])
    useEffect(() => {
        if (openRMDetail == true) {
            LoadRMInfo();
        } else {
            setRMInfo({ ...RMInfo, data: [], load: true });
            setRMPartNoSelected('');
        }
    }, [openRMDetail])


    const LoadRMInfo = async () => {
        let res = await APIGetRMInfo(SublineRMInfo);
        try {
            if (typeof res.data != 'undefined' && res.data.length > 0) {
                setRMPartNoSelected(res.data[0].PART_NO);
            }
        } catch (e: Error | any) {
            openNotification('error', `เกิดข้อผิดพลาด ${e.message}`)
        }
        setRMInfo({ ...RMInfo, data: res.data, load: false });
    }
    const handleEditApsPlnInfo = async () => {
        try {
            let res = await APIUpdateApsProdPlan({ empcode: empcode, prd_plan_code: ApsPlnInfo.data[0].PRD_PLAN_CODE, prd_plan_qty: ApsPlnInfo.data[0].PRD_PLAN_QTY });
            if (res.status == true) {
                openNotification('success', 'บันทึกข้อมูลเรียบร้อยแล้ว');
                LoadSublineData();
                setOpenEditSublineSeq(false);
            } else { openNotification('error', res.message != undefined ? res.message : 'บันทึกข้อมูลไม่สําเร็จ') }
        } catch (e: Error | any) {
            openNotification('error', `บันทึกข้อมูลไม่สําเร็จ ${e.message}`);
            alert(e.message);
        }
    }

    const handleTransformSeq = async (ToPrdPlanCode: string) => {
        let RESUpdateSeq = await APIUpdateSeqSublineSeq(FromPrdPlanCode, ToPrdPlanCode);
        if (RESUpdateSeq.status == true) {
            LoadSublineData();
            setFromPrdPlanCode('');
            openNotification('success', `สลับลำดับแผนการผลิตสําเร็จ`);
        } else {
            openNotification('error', `สลับลำดับแผนการผลิตไม่สําเร็จ : ${RESUpdateSeq.message}`);
        }
    }

    const TdStatus = (status: string) => {
        let icon: any;
        let style: string = '';
        let text: string = '';
        if (status == 'PARTIALY') {
            icon = <BsDiamondHalf />
            style = 'bg-[#ffa500]/80 text-black/90 border border-yellow-500/50 shadow-md';
            text = 'ผลิตบางส่วน'
        } else if (status == 'WAITING') {
            icon = <AiOutlineCoffee />
            style = 'bg-gray-500/10 text-gray-600 border border-gray-600/25';
            text = 'รอผลิต'
        } else if (status == 'SUCCESS') {
            icon = <FaCheck />
            style = 'bg-green-500/10 text-green-600 border border-green-600/25';
            text = 'ผลิตแล้ว'
        }
        return <div className={`${style}  font-semibold  tracking-wide rounded-md px-2 w-fit flex gap-1 items-center justify-center`}>
            {icon}
            {text}
        </div>
    }

    const handleUpdateRMStock = async () => {
        try {
            var RMIndex = RMInfo.data.findIndex((o) => o.PART_NO == RMPartNoSelected);
            if (RMIndex != -1) {
                var RMInfoOfIndex = RMInfo.data[RMIndex];
                if (RMInfoOfIndex != null) {
                    let res = await APIUpdateRMStock({ rm_code: RMInfoOfIndex.PART_NO, rm_cm: RMInfoOfIndex.CM, empcode: empcode, stock: Number(Math.round(RMInfoOfIndex.BAL)), rm_wcno: RMInfoOfIndex.WCNO });
                    if (res.status == true) {
                        openNotification('success', `บันทึกข้อมูลเรียบร้อยแล้ว`);
                    } else {
                        openNotification('error', `บันทึกข้อมูลไม่สําเร็จ ${res.message}`);
                    }
                    LoadSublineData();
                } else {
                    openNotification('error', 'ไม่สามารถบันทึกข้อมูลได้ เนื่องจาก หาข้อมูลจากลำดับไม่');
                }
            } else {
                openNotification('error', 'ไม่สามารถบันทึกข้อมูลได้ เนื่องจาก เกิดปัญหาการหาลำดับของ RM');
            }
        } catch (e: Error | any) {
            openNotification('error', `บันทึกข้อมูลไม่สําเร็จ ${e.message}`);
        }
    }
    return (
        <div className='flex flex-col gap-2'>
            {contextHolder}
            {
                IsError.status ? <Result
                    status="error"
                    title="โหลดข้อมูลล้มเหลว"
                    subTitle="กรุณาติดต่อหน่วยงาน IT เพิ่อตรวจสอบความถูกต้อง"
                    extra={[
                        <Button key="buy" onClick={() => LoadSublineData()}>โหลดข้อมูลอีกครั้ง</Button>,
                    ]}
                ></Result> : <>
                    <div className='select-none'>
                        <Radio.Group value={SublineParam.line} onChange={(e) => {
                            setSublineParam({ ...SublineParam, line: e.target.value, process: Routers.find(o => o.LINE_GROUP == e.target.value)?.LINE_CODE as string ?? '' })
                        }}>
                            {
                                Array.from(new Set([...Routers].map((o) => o.LINE_GROUP))).map((o, i) => <Radio.Button key={i} value={o}>{o}</Radio.Button>)
                            }
                        </Radio.Group>
                    </div>
                    <div className='flex items-center justify-between select-none'>
                        <Radio.Group value={SublineParam.process} onChange={(e) => setSublineParam({ ...SublineParam, process: e.target.value })} >
                            {
                                Array.from(new Set([...Routers.filter(x => x.LINE_GROUP == SublineParam.line).map(x => x.LINE_CODE)])).map((o, i) => <Radio.Button key={i} value={o}>{o}</Radio.Button>)
                            }
                        </Radio.Group>
                        <div className='flex items-center gap-3 justify-end '>
                            <div className={`flex items-center gap-2  rounded-sm pr-3`}>
                                <div className={`h-5 w-8 rounded-sm border  shadow-lg bg-[#6A67F3] text-sm flex items-center justify-center drop-shadow-2xl`}>
                                    <span className='opacity-90 text-white font-bold'>PD</span>
                                </div>
                                <small>Production</small>
                            </div>
                            <div className={`flex items-center gap-2  rounded-sm pr-3`}>
                                <div className='h-5 w-8 rounded-sm border border-[#498DCA] shadow-lg bg-[#498DCA] text-sm flex items-center justify-center drop-shadow-2xl'>
                                    <span className='opacity-90 text-white font-bold'>PS</span>
                                </div>
                                <small>Part Supply</small>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Spin spinning={SublinePlanDatas.load }>
                            {
                                SublineInfo?.data.length == 0 ? <Result
                                    title="ไม่พบข้อมูล"
                                    extra={
                                        <Button type="primary" key="console">
                                            โหลดข้อมูล
                                        </Button>
                                    }
                                /> : <div className='overflow-x-auto'>
                                    {
                                        !SublinePlanDatas.load && <table id='tbSublinePlanDatas'>
                                            <thead>
                                                <tr>
                                                    <th className='border w-[37.5px]' rowSpan={2}>SEQ</th>
                                                    <th className='border w-[125px]' rowSpan={2}>MODEL</th>
                                                    <th className='border w-[200px]' rowSpan={2}>PART</th>
                                                    {/* <th className='border w-[125px]' rowSpan={2}>STATUS</th> */}
                                                    <th className="border w-[100px]" rowSpan={2}>PLAN</th>
                                                    {/* <th className='border w-[75px]' rowSpan={2}>REMAIN<br></br>PLAN</th> */}
                                                    <th className='border w-[75px]' colSpan={1}>
                                                        <div className='flex flex-col'>
                                                            <span>RESULT</span>
                                                            <span className='tracking-wide text-green-500 font-mono'>(Backflash)</span>
                                                        </div>
                                                    </th>
                                                    {
                                                        SublinePlanDatas.router.map((item: PropSublineRouter, index: number) => {
                                                            return <th key={index} className='border  px-1  w-[150px]' colSpan={2}>{item.process_txt}</th>
                                                        })
                                                    }
                                                </tr>
                                                <tr>
                                                    <th className='border w-[50px] py-1 bg-green-800/10'>M/C</th>
                                                    {
                                                        SublinePlanDatas.router.map((_, index: number) => {
                                                            return <Fragment key={index} >
                                                                <Tooltip title='Production' className='cursor-pointer'>
                                                                    <th className="td-title font-bold w-[75px] bg-[#6A67F3] text-white" title='Production'>PD</th>
                                                                </Tooltip>
                                                                <Tooltip title='Part Supply' className='cursor-pointer'>
                                                                    <th className="td-title font-bold w-[75px] bg-[#498DCA] text-white" title='Part supply'>PS</th>
                                                                </Tooltip>
                                                            </Fragment>
                                                        })
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    SublinePlanDatas.rowspan.map((oSublinePlan: PropSublineRowSpan, iSublinePlan: number) => {
                                                        let oFilterRN: string[] = oSublinePlan.filter.split(',');
                                                        let oFilterSublinePlan: any[] = SublinePlanDatas.plan.filter((item: PropItemSublineDatas) => oFilterRN.some((o: string) => o == item.rn.toString()));
                                                        return oFilterSublinePlan.map((item: PropItemSublineDatas, i: number) => {
                                                            return i == 0 ? <tr key={iSublinePlan}>
                                                                <td className='border'>{item.aps_seq}</td>
                                                                <td rowSpan={oFilterSublinePlan.length} className='border'>{item.common_model}</td>
                                                                <td rowSpan={oFilterSublinePlan.length} className='border'>{item.partno}</td>
                                                                <td className='td-number border'>{item.qty}</td>
                                                                <td className='border'>-</td>
                                                            </tr> : <tr>
                                                                <td className='border'>{item.aps_seq}</td>
                                                                <td className='td-number border'>{item.qty}</td>
                                                                <td className='border'>-</td>
                                                            </tr>
                                                        })

                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    }
                                    {/* <table id='tbSublineSeq' className='w-fit bg-white table-fixed'>
                                        <thead className="sm:text-[10px] md:text-[10px] lg:text-[10px] sticky top-0 bg-[#f9fafb] ">
                                            <tr>
                                                <th className='border w-[37.5px]' rowSpan={2}>SEQ</th>
                                                <th className='border w-[125px]' rowSpan={2}>MODEL</th>
                                                <th className='border w-[200px]' rowSpan={2}>PART</th>
                                                <th className='border w-[125px]' rowSpan={2}>STATUS</th>
                                                <th className="border w-[100px]" rowSpan={2}>PLAN</th>
                                                <th className='border w-[75px]' rowSpan={2}>REMAIN<br></br>PLAN</th>
                                                <th className='border w-[75px]' colSpan={1}>
                                                    <div className='flex flex-col'>
                                                        <span>RESULT</span>
                                                        <span className='tracking-wide text-green-500 font-mono'>(Backflash)</span>
                                                    </div>
                                                </th>

                                                {
                                                    SublineInfo?.router.map((item: PropRouterSublineSeq, index: number) => {
                                                        return <th key={index} className='border  px-1  w-[150px]' colSpan={2}>{item.PROCESS_TXT}</th>
                                                    })
                                                }
                                            </tr>
                                            <tr>
                                                <th className='border w-[50px] py-1 bg-green-800/10'>M/C</th>
                                                {
                                                    SublineInfo?.router.map((_, index: number) => {
                                                        return <Fragment key={index} >
                                                            <Tooltip title='Production' className='cursor-pointer'>
                                                                <th className="td-title font-bold w-[75px] bg-[#6A67F3] text-white" title='Production'>PD</th>
                                                            </Tooltip>
                                                            <Tooltip title='Part Supply' className='cursor-pointer'>
                                                                <th className="td-title font-bold w-[75px] bg-[#498DCA] text-white" title='Part supply'>PS</th>
                                                            </Tooltip>
                                                        </Fragment>
                                                    })
                                                }
                                            </tr>
                                        </thead>
                                        <tbody className='sm:text-[11px] md:text-[11px] lg:text-[11px] '>
                                            {
                                                SublineInfo?.data.map((item: PropDataSublineSeq, index: number) => {
                                                    console.log(item)
                                                    let remain: number = item.PLN_REMAIN;
                                                    let status: string = item.PLN_STATUS;
                                                    let isProduction: boolean = status == "PARTIALY" ? true : false;
                                                    let hasLastUpdate: PropSublineLastUpdate[] = SublineLastUpdate.filter(x => x.partno == item.partNo);
                                                    return <Fragment key={index}>
                                                        <tr key={index} className={`${isProduction ? 'row-production' : ''} ${status == 'Done' && 'bg-green-100/20'} hover:shadow-top-bottom transition-all duration-300 cursor-pointer `}>
                                                            <td className={`${isProduction ? 'bg-[#FFA500]' : 'bg-[#f9fafb]'} font-semibold border text-center align-middle py-1`}>
                                                                <div className='flex gap-1 justify-center items-center'>
                                                                    <span>{item.PRD_SEQ}</span>
                                                                </div>
                                                            </td>
                                                            <td className={` border break-all font-semibold pl-[8px] align-top pt-[4px] ${(hasLastUpdate.length > 0 && remain > 0) && 'bg-yellow-300/30'}`}>
                                                                <Popover className='cursor-pointer' content={
                                                                    <div className='grid  gap-1'>
                                                                        {item.COMMON_SEBANGO}
                                                                    </div>
                                                                } title='โมเดลที่ใช้งาน'>
                                                                    <span className='tracking-wider text-blue-500'>{item.COMMON_SEBANGO}</span>
                                                                </Popover>
                                                            </td>
                                                            <td className={` border align-top pl-[8px]`}>
                                                                <div className='flex'>
                                                                    <div className='grow flex flex-col leading-[1] gap-1 py-1'>
                                                                        <strong>{item.COMMON_MODEL}</strong>
                                                                        <span>{item.MC_NAME}</span>
                                                                        <Paragraph copyable={{ text: typeof item.PARTNO == 'string' ? item.PARTNO : '' }} style={{ margin: 0, fontWeight: '400', fontSize: '12px' }}>{item.PARTNO} {item.CM != '' ? `${item.CM}` : ''}</Paragraph>
                                                                    </div>
                                                                    {
                                                                        isProduction && <div className='flex-none flex justify-center items-center px-[8px]'>
                                                                            <span className="relative flex size-3">
                                                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
                                                                                <span className="relative inline-flex size-3 rounded-full bg-yellow-500"></span>
                                                                            </span>
                                                                        </div>
                                                                    }
                                                                </div>
                                                            </td>
                                                            <td className={`border px-[8px]`}>
                                                                {TdStatus(item.PLN_STATUS)}
                                                            </td>
                                                            <td id='plan' className="border text-end pr-1  font-bold ">
                                                                {
                                                                    FromPrdPlanCode != '' ? <div className='flex items-center justify-between px-1'>
                                                                        {
                                                                            FromPrdPlanCode != item.PRD_PLAN_CODE ? <Button type='primary' size='small' icon={<RetweetOutlined />} onClick={() => handleTransformSeq(item.PRD_PLAN_CODE)}></Button> : <Button type='default' icon={<CloseOutlined />} size='small' onClick={() => setFromPrdPlanCode('')}></Button>
                                                                        }
                                                                        <div className='flex flex-col  justify-end'>
                                                                            <span className='text-lg'>{item.PRD_PLAN_QTY.toLocaleString('en')}</span>
                                                                            {
                                                                                item.APS_PLAN_QTY != item.PRD_PLAN_QTY && <Tooltip title="มีการปรับเปลี่ยนจำนวนแผนการผลิต">
                                                                                    <small className='text-red-500'>[PD Chg.]</small>
                                                                                </Tooltip>
                                                                            }
                                                                        </div>
                                                                    </div> :
                                                                        <Dropdown menu={{
                                                                            items: [
                                                                                // {
                                                                                //     label: (
                                                                                //         <div className='flex items-center gap-2' onClick={() => setPrdPlanCodeSelected(item.PRD_PLAN_CODE)}>
                                                                                //             <EditOutlined />
                                                                                //             <a >
                                                                                //                 แก้ไขยอดการผลิต
                                                                                //             </a>
                                                                                //         </div>
                                                                                //     ),
                                                                                //     key: '0',
                                                                                // },
                                                                                // {
                                                                                //     label: (
                                                                                //         <div className='flex items-center gap-2' onClick={() => setFromPrdPlanCode(item.PRD_PLAN_CODE)}>
                                                                                //             <PullRequestOutlined />
                                                                                //             <a >
                                                                                //                 ย้ายลำดับการผลิต
                                                                                //             </a>
                                                                                //         </div>
                                                                                //     ),
                                                                                //     key: '1',
                                                                                //     disabled: false
                                                                                // }
                                                                            ]
                                                                        }} >
                                                                            <a onClick={(e) => e.preventDefault()}>
                                                                                <div>
                                                                                    <div className='flex items-center justify-between h-full pl-2'>
                                                                                        <div className='border rounded-sm bg-black/10 border-black/10 px-[3px] py-[3px] hover:bg-sky-500/20 transition-all duration-100'>
                                                                                            <HolderOutlined />
                                                                                        </div>
                                                                                        <div className='flex flex-col  justify-end'>
                                                                                            <div className={`px-[8px] rounded-md text-end pr-1 bg-blue-500/10 text-blue-600 drop-shadow-md border-blue-600/20 border`}>{item.PRD_PLAN_QTY.toLocaleString('en')}</div>

                                                                                        </div>
                                                                                    </div>
                                                                                    {
                                                                                        item.PRD_PLAN_QTY != item.APS_PLAN_QTY && <Tooltip title="มีการปรับเปลี่ยนจำนวนแผนการผลิต">
                                                                                            <small className='text-red-500'>[PD Chg.]</small>
                                                                                        </Tooltip>
                                                                                    }
                                                                                </div>
                                                                            </a>
                                                                        </Dropdown>
                                                                }
                                                            </td>
                                                            <td className={`border px-[8px] `}>
                                                                <div className='flex justify-end items-center'>
                                                                    {
                                                                        remain != 0 && <div className={`px-[8px] w-fit rounded-md text-end pr-1 font-semibold bg-sky-500/10 text-sky-600 drop-shadow-md border-sky-600/20 border`}>{remain.toLocaleString('en')}</div>
                                                                    }
                                                                </div>
                                                            </td>
                                                            <td className={`border  px-[8px]`}>
                                                                <div className='flex justify-end items-center'>
                                                                    {
                                                                        item.PRD_QTY > 0 && <div className={`px-[8px] rounded-md text-end pr-1 font-semibold bg-green-500/10 text-green-700 drop-shadow-md border-green-600/20 border`}>{item.PRD_QTY.toLocaleString('en')}</div>
                                                                    }
                                                                </div>
                                                            </td>
                                                            {
                                                                SublineInfo.router.map((oRouter: PropRouterSublineSeq, idxItem: number) => {
                                                                    let ProcessCode: string = oRouter.PROCESS_CODE;
                                                                    let StockOfLine: number = item[`${ProcessCode}-LINE`] != '' ? Number(item[`${ProcessCode}-LINE`]) : 0;
                                                                    let StockOfPS: number = item[`${ProcessCode}-PS`] != '' ? Number(item[`${ProcessCode}-PS`]) : 0;
                                                                    let StyleOfLine: string = StockOfLine <= 0 ? '' : '';
                                                                    let StyleOfPS: string = StockOfPS <= 0 ? '' : '';
                                                                    return <Fragment key={idxItem}>
                                                                        <td className={`px-[8px] text-right align-middle pr-1  border font-bold tracking-wide ${StyleOfLine}`} key={idxItem + '-LINE-' + ProcessCode} onClick={() => setSublineRMInfo({ partno: (typeof item.PARTNO == 'string' && item.PARTNO.length > 0 ? item.PARTNO : ''), process: ProcessCode, type: 'LINE', wcno: item.WCNO })}>
                                                                            {
                                                                                StockOfLine != 0 && (StockOfLine < 0 ? <div className='px-[8px] text-end pr-1 border border-red-700/30 bg-red-500/10 text-red-500 rounded-md tracking-wide'>{StockOfLine <= -10000 ? (StockOfLine / 1000).toFixed(0) + 'K' : StockOfLine.toLocaleString('en')}</div> : StockOfLine >= 10000 ? (Number(StockOfLine / 1000).toFixed(0) + 'K') : StockOfLine.toLocaleString('en'))
                                                                            }
                                                                        </td>
                                                                        <td className={`px-[8px] text-right align-middle pr-1  border font-bold tracking-wide ${StyleOfPS}`} key={idxItem + '-PS-' + ProcessCode} onClick={() => setSublineRMInfo({ partno: (typeof item.PARTNO == 'string' && item.PARTNO.length > 0 ? item.PARTNO : ''), process: ProcessCode, type: 'PS', wcno: item.WCNO })}>
                                                                            {
                                                                                StockOfPS != 0 && (StockOfPS < 0 ? <div className='px-[8px] text-end pr-1 border border-red-700/30 bg-red-500/10 text-red-500 rounded-md'>{StockOfPS <= -10000 ? (StockOfPS / 1000).toFixed(0) + 'K' : StockOfPS.toLocaleString('en')}</div> : StockOfPS >= 10000 ? (Number(StockOfPS / 1000).toFixed(0) + 'K') : StockOfPS.toLocaleString('en'))
                                                                            }
                                                                        </td>
                                                                    </Fragment>
                                                                })
                                                            }
                                                        </tr>
                                                    </Fragment>
                                                })

                                            }
                                        </tbody>
                                    </table> */}
                                    {/* <table>
                                        <thead>
                                            <tr>
                                                <th className='border w-[37.5px]' rowSpan={2}>SEQ</th>
                                                <th className='border w-[125px]' rowSpan={2}>MODEL</th>
                                                <th className='border w-[200px]' rowSpan={2}>PART</th>
                                                <th className='border w-[125px]' rowSpan={2}>STATUS</th>
                                                <th className="border w-[100px]" rowSpan={2}>PLAN</th>
                                                <th className='border w-[75px]' rowSpan={2}>REMAIN<br></br>PLAN</th>
                                                <th className='border w-[75px]' colSpan={1}>
                                                    <div className='flex flex-col'>
                                                        <span>RESULT</span>
                                                        <span className='tracking-wide text-green-500 font-mono'>(Backflash)</span>
                                                    </div>
                                                </th> */}
                                    {/* {
                                                    SublineInfo?.router.map((item: PropRouterSublineSeq, index: number) => {
                                                        return <th key={index} className='border  px-1  w-[150px]' colSpan={2}>{item.PROCESS_TXT}</th>
                                                    })
                                                } */}
                                    {/* </tr>
                                        </thead>
                                    </table> */}
                                </div>
                            }
                        </Spin>
                    </div>
                </>
            }

            <Modal width={800} title={`Raw Material Information`} open={openRMDetail} onCancel={() => setOpenRMDetail(false)} onClose={() => setOpenRMDetail(false)} footer={
                <div className='flex gap-[8px] justify-end'>
                    <Button type='primary' onClick={handleUpdateRMStock} disabled={RMInfo.data.length == 0 || SublineRMInfo.type == 'PS'}>บันทึก</Button>
                    <Button onClick={() => setOpenRMDetail(false)}>ปิดหน้าต่าง</Button>
                </div>
            }>
                <Spin spinning={RMInfo.load} tip='กำลังโหลดข้อมูล'>
                    {
                        RMInfo.data.length == 0 ? <Result
                            title="ไม่พบข้อมูล"
                            extra={
                                <Button type="primary" key="console" onClick={() => LoadRMInfo()}>
                                    โหลดข้อมูล
                                </Button>
                            }
                        /> : <div className='flex flex-col gap-[16px] p-[16px]'>
                            <Descriptions title={'Part Information'} size='small' bordered className='select-none' column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }} >
                                <Descriptions.Item label='รหัสพื้นที่ (WCNO)'><Paragraph copyable={{ text: SublineRMInfo.wcno }} style={{ margin: 0, fontWeight: '400' }}>{SublineRMInfo.wcno}</Paragraph></Descriptions.Item>
                                <Descriptions.Item label='รหัสชิ้นงาน (Part Code)'><Paragraph copyable={{ text: SublineRMInfo.partno }} style={{ margin: 0, fontWeight: '400' }}>{SublineRMInfo.partno}</Paragraph></Descriptions.Item>
                                <Descriptions.Item label='ชื่อชิ้นงาน (Part Name)'>{RMInfo.data[0]?.PARENT_PART_DESC || '-'}</Descriptions.Item>
                            </Descriptions>

                            <div className='flex items-center gap-[8px]'>
                                <strong className='text-lg'>Raw Material</strong>
                                <div className={` px-[16px] py-[4px]  rounded-lg text-white font-semibold tracking-wide ${RMInfo.data.reduce((a, b) => a + b.BAL, 0) < 0 ? 'bg-red-500' : 'bg-blue-500'}`}>
                                    Stock  {RMInfo.data.reduce((a, b) => a + b.BAL, 0) < 0 && 'ติดลบ'} รวม : {Number(RMInfo.data.reduce((a, b) => a + b.BAL, 0)).toLocaleString('en')}
                                </div>
                            </div>
                            <Tabs
                                defaultActiveKey={RMInfo.data[0].PART_NO}
                                type="card"
                                tabBarStyle={{ marginRight: '16px' }}
                                onChange={(e) => setRMPartNoSelected(e)}
                                items={RMInfo.data.map((oRMInfo: PropItemRMInfo) => {
                                    return {
                                        label: <div className='flex items-center gap-[8px]'><span>{oRMInfo.PART_NO}</span> {oRMInfo.BAL < 0 && <Badge count={'Stock ติดลบ'} />}</div>,
                                        key: oRMInfo.PART_NO,
                                        children: <Descriptions size='small' bordered column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }} className='select-none' >
                                            <Descriptions.Item label='รหัสพื้นที่ (WCNO)'><Paragraph copyable={{ text: oRMInfo.PART_NO }} style={{ margin: 0, fontWeight: '400' }}>{oRMInfo.WCNO}</Paragraph></Descriptions.Item>
                                            <Descriptions.Item label='รหัสวัตถุดิบ (RM Code)'><Paragraph copyable={{ text: oRMInfo.PART_NO }} style={{ margin: 0, fontWeight: '400' }}>{oRMInfo.PART_NO}</Paragraph></Descriptions.Item>
                                            <Descriptions.Item label='ชื่อวัตถุดิบ (RM Name)'>{oRMInfo.PART_DESC || '-'}</Descriptions.Item>
                                            <Descriptions.Item label={<Badge status="processing" text="จำนวนคงเหลือ (Inventory)" />} style={{ color: 'black' }}>
                                                {
                                                    SublineRMInfo.type == 'PS' ? oRMInfo.BAL : <Input className={`grow col-span-2  font-semibold ${oRMInfo.BAL < 0 ? 'text-red-600 bg-red-600/10' : 'bg-yellow-50'}`} type='number' min={0} value={Number(oRMInfo.BAL)} onChange={(e) => SublineRMInfo.type == 'PS' ? null : setRMInfo({ ...RMInfo, data: RMInfo.data.map((o: any) => o.PART_NO == oRMInfo.PART_NO ? { ...o, BAL: Number(e.target.value) } : o) })}
                                                        autoFocus />
                                                }

                                            </Descriptions.Item>
                                            <Descriptions.Item label='อัพเดรตล่าสุด (DD/MM/YYYY)'>{oRMInfo.LUPDATE != '' ? moment(oRMInfo.LUPDATE).format('DD/MM/YYYY HH:mm') : '-'}</Descriptions.Item>
                                        </Descriptions>,
                                    };
                                })}
                            />

                        </div>
                    }
                </Spin>
            </Modal>
            <Modal width={800} title='แก้ไขยอดการผลิต (Subline)' onClose={() => setOpenEditSublineSeq(false)} open={openEditSublineSeq} footer={
                <div className='flex items-center justify-end gap-1'>
                    <Button type='primary' onClick={handleEditApsPlnInfo} disabled={ApsPlnInfo?.load == true || ApsPlnInfo.data.length == 0}>บันทึก</Button>
                    <Button onClick={() => setOpenEditSublineSeq(false)}>ปิดหน้าต่าง</Button>
                </div>
            }>
                <div>
                    <Spin spinning={ApsPlnInfo?.load == true} tip='กำลังโหลดข้อมูล'>
                        {
                            (ApsPlnInfo.load == false && ApsPlnInfo.data.length == 0) ? <Result
                                title="ไม่พบข้อมูล"
                                extra={
                                    <Button type="primary" key="console" onClick={() => LoadAPSPrdPlnInfo()}>
                                        โหลดข้อมูล
                                    </Button>
                                }
                            /> : <Descriptions size='small' bordered column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }} className='select-none' >
                                <Descriptions.Item label='รหัสแผนการผลิต (PrdPlanCode)' >{ApsPlnInfo.data[0]?.PRD_PLAN_CODE}</Descriptions.Item>
                                <Descriptions.Item label='รหัสสินค้า (Model)' >{ApsPlnInfo.data[0]?.COMMON_MODEL}</Descriptions.Item>
                                <Descriptions.Item label='ชื่อชิ้นงาน (PartNo)'>{ApsPlnInfo.data[0]?.PART_NO}</Descriptions.Item>
                                <Descriptions.Item label={<Badge status="processing" text="จำนวนแผนการผลิต" />} style={{ color: 'black' }}>
                                    <Input className='grow col-span-2 bg-yellow-50 font-semibold' type='number' min={0} value={ApsPlnInfo.data[0]?.PRD_PLAN_QTY}
                                        onChange={(e) => setApsPlnInfo({ ...ApsPlnInfo, data: [{ ...ApsPlnInfo.data[0], PRD_PLAN_QTY: Number(e.target.value) }] })}
                                        autoFocus />
                                </Descriptions.Item>
                            </Descriptions>
                        }
                    </Spin>
                </div>
            </Modal>
        </div>
    )
}

export default SublineWIPs