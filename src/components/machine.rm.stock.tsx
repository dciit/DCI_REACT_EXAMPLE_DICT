//@ts-nocheck
import { ApsNotify, DictMstr, LineProps, PropsPlanMachine } from '@/interface/aps.interface';
import { IconButton } from '@mui/material';
import   { useEffect } from 'react'
import ReportIcon from '@mui/icons-material/Report';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { Col, Row, Spin } from 'antd';
import { ApiApsGetPlanMachine } from '@/service/aps.service';
import moment from 'moment';
interface PropMachineRMStock {
    partGroup: DictMstr[];
    planMachines: PropsPlanMachine[];
    notifys: ApsNotify[];
    lineSelected: LineProps;
    PrevPlanChange: PropsPlanMachine | null;
    handleEvent: Function;
}
function MachineRMStock(props: PropMachineRMStock) {
    const { partGroup, planMachines, notifys, lineSelected, PrevPlanChange, handleEvent, setMachinePlan, partMasters } = props;
    const ymd = moment();
    useEffect(() => {
        init();
    }, [])
    const init = async () => {
        const ApiGetApsPlanMachine = await ApiApsGetPlanMachine({ ymd: ymd.format('YYYYMMDD') });
        console.log(ApiGetApsPlanMachine)
    }
    return (
        <>
            <Spin spinning={false}>
                <Row className='bg-red-500'>
                    {
                        partGroup.filter((x: DictMstr) => x.refCode == lineSelected.value && x.code != 'OS').map((oGroup: DictMstr, iGroup: number) => {
                            return <Col xs={12} >
                                {
                                    oGroup.code
                                }
                            </Col>
                        })
                    }

                </Row>
            </Spin>
            <div className='flex gap-3 '  > 
                <div className=' grid sm:grid-cols-1 xl:grid-cols-2   gap-6 px-6 pb-6'>
                    {
                        partGroup.length == 0 ? <div className='col-span-2 pb-6 text-center'>ไม่พบข้อมูล</div> : partGroup.filter((x: DictMstr) => x.refCode == lineSelected.value && x.code != 'OS').map((oGroup: DictMstr, iGroup: number) => {
                            let group: string = oGroup.code;
                            let planMachine: PropsPlanMachine[] = [];
                            if (group == 'FS' || group == 'OS') {
                                planMachine = planMachines.filter(x => x.partGroup == 'FS' || x.partGroup == 'OS');
                            } else {
                                planMachine = planMachines.filter(x => x.partGroup == group);
                            }
                            let notify = notifys.filter((x: ApsNotify) => x.subLine == group && x.lineType == 'MAIN').length;
                            let oPartGroup: string | null = oGroup.refCode;
                            group = group == 'FS' ? 'FS/OS' : group;
                            return <div key={iGroup} className='bg-white flex flex-col  gap-2'>
                                <table className={`text-[12px] w-full select-none  shadow-md ${notify ? '' : ''}`} id='tbSubline'>
                                    <thead className='font-semibold '>
                                        <tr>
                                            <td className='border py-2 pr-3' colSpan={8}>
                                                <div className='flex  justify-between items-center'>
                                                    <div className='px-3 text-[16px] flex items-center gap-2'>
                                                        {
                                                            group.length <= 3 ? <div className={`flex h-10 w-10 items-center justify-center rounded-full ${notify ? 'bg-red-500' : 'bg-blue-500'}`}>
                                                                <p className='text-white'>{group}</p>
                                                            </div> : <div className={`${notify ? 'bg-red-500' : 'bg-blue-500'} px-3 rounded-xl py-1 text-white`}>
                                                                {group}
                                                            </div>
                                                        }
                                                        <div className='flex flex-col'>
                                                            {group.length <= 3 && <span className={`font-bold ${notify ? 'text-red-500' : 'text-blue-500'}`}>{oGroup.description}</span>}
                                                            <div className='flex gap-2 items-center'>
                                                                {notify > 0 && <>
                                                                    <small className='text-red-500 '>MAIN มีการเปลี่ยนแผน</small>
                                                                    <span className="relative flex h-3 w-3">
                                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                                    </span>
                                                                </>}

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='bg-blue-500 px-3 hover:scale-105 transition-all duration-150 py-1 flex  items-center h-fit text-white rounded-md text-center shadow-md font-light' onClick={() => setParamInsertPlan({
                                                        type: 'SUBLINE',
                                                        group: group,
                                                        seq: planMachine.length + 1
                                                    })}>
                                                        <AddIcon sx={{ width: '18px', height: '18px' }} />
                                                        <span>เพิ่มแผนผลิต</span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className={`${notify && 'border-gray-'} border text-center w-[10%]`} rowSpan={2}>ลำดับ</td>
                                            <td className={`${notify && 'border-gray-'} border text-center w-[20%]`} rowSpan={2}>MODEL</td>
                                            <td className={`${notify && 'border-gray-'} border text-center py-2 w-[20%]`} colSpan={2}>PLAN</td>
                                            <td className={`${notify && 'border-gray-'} border text-center w-[10%]`} rowSpan={2}>RESULT</td>
                                            <td className={`${notify && 'border-gray-'} border text-center w-[20%]`} colSpan={2}>STOCK</td>
                                            <td className={`${notify && 'border-gray-'} border text-center w-[7.5%]`} rowSpan={2}>#</td>
                                        </tr>
                                        <tr>
                                            <td className="border text-center py-2 w-[7.5%]">APS</td>
                                            <td className="border text-center w-[7.5%]">PRD</td>
                                            <td className="border text-center bg-orange-200 uppercase">{oPartGroup == 'MC' ? 'M/C' : (oPartGroup == 'MOTOR' ? 'MOTOR' : 'CASING')}</td>
                                            <td className="border text-center bg-yellow-200">MAIN</td>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        {
                                            (planMachine != null && planMachine.length) ? planMachine.filter((x: PropsPlanMachine) => x.partGroup != 'OS' && !x.subLine.includes('VARNISH')).map((item: PropsPlanMachine, i: number) => {
                                                let eventChange: boolean = (PrevPlanChange != null && PrevPlanChange.prdPlanCode == item.prdPlanCode);
                                                let styleChange: string = eventChange ? 'border-2 border-dashed border-blue-500' : '';
                                                let subLine: string = item.subLine;
                                                let production: boolean = item.prdPlanQty > 0 ? true : false;
                                                if (item.partGroup == 'OS') {
                                                    item.partGroup = 'FS';
                                                }
                                                let result: string = (typeof item.result != 'undefined' && item.result > 0) ? item.result.toLocaleString('en') : '-';
                                                let wipSub: number = item.stockMachine == null ? 0 : item.stockMachine;
                                                let wipMain: number = item.stockMain == null ? 0 : item.stockMain;
                                                return <tr key={i} className={`${production == false && 'opacity-50'} ${eventChange && 'animated-background-2 border-dashed border-blue-500  bg-gradient-to-l from-white via-blue-50 to-blue-200'}`}
                                                >
                                                    <td className={` text-center py-2 font-semibold border ${styleChange}`} onClick={() => handleEvent(eventChange, item)}>
                                                        <span>{item.prdSeq}</span>
                                                    </td>
                                                    <td className={`font-semibold  border ${styleChange}`} onClick={() => handleEvent(eventChange, item)}>
                                                        <div className='flex'>
                                                            <div className='grow flex flex-col '>
                                                                <div className='pl-[4px] text-blue-600 font-semibold'>{(partMasters.filter(x => x.partno == item.partNo).length ? partMasters.filter(x => x.partno == item.partNo)[0].model_common : '')}</div>
                                                                <div className='pl-[4px] text-[12px]'>{item.partNo}  {item.cm != '' && `(${item.cm})`}</div>
                                                                {
                                                                    production == false && <div className=' pl-[8px] bg-red-500 text-white  w-full font-light'>ไม่ผลิต</div>
                                                                }
                                                                {
                                                                    subLine.length > 0 && <small className=' pl-[8px] bg-blue-300 text-black   w-full  '>{(item.partGroup != 'FS' ? subLine : subLine.replace(
                                                                        'FIXED SCROLL R&F', ''
                                                                    ))}</small>
                                                                }
                                                            </div>
                                                            <div className='flex-none flex items-center px-3 hidden'>
                                                                <ReportIcon className='text-red-500' />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className={`text-[14px] border text-end pr-[4px] font-semibold text-blue-700/80 ${styleChange}`} onClick={() => handleEvent(eventChange, item)}>{item.apsPlanQty.toLocaleString('en')}</td>
                                                    <td className={`text-[14px] border text-end pr-[4px]  font-semibold ${styleChange} ${item.prdPlanQty > 0 ? 'text-green-600' : 'text-red-600'}`} onClick={() => handleEvent(eventChange, item)}>{item.prdPlanQty.toLocaleString('en')}</td>
                                                    <td className={`border text-right pr-[4px] ${styleChange} ${(typeof item.result != 'undefined' && item.result > 0) && 'text-green-700 font-bold bg-green-50'}`} onClick={() => handleEvent(eventChange, item)}>{result}</td>
                                                    <td className={`border text-right pr-[4px] font-semibold ${styleChange} ${wipSub == 0 ? '' : (wipSub > 0 ? 'bg-orange-100/50' : 'text-red-600 bg-orange-100/50')}`} onClick={() => handleEvent(eventChange, item)}>{wipSub.toLocaleString('en')}</td>
                                                    <td className={` border text-right pr-[4px] font-semibold ${styleChange} ${wipMain == 0 ? '' : (wipMain > 0 ? 'bg-yellow-100/50' : 'text-red-600 bg-yellow-100/50')}`} onClick={() => handleEvent(eventChange, item)}>{wipMain.toLocaleString('en')}</td>
                                                    <td className={`border text-center ${styleChange}`}>
                                                        {
                                                            eventChange ? <ChangeCircleIcon className='animate-spin text-blue-600' /> : <IconButton onClick={() => setMachinePlan(item)}>
                                                                <EditIcon className='text-gray-600 ' sx={{ width: '20px', height: '20px' }} />
                                                            </IconButton>
                                                        }

                                                    </td>
                                                </tr>
                                            }
                                            ) : <tr>
                                                <td className='border py-3 text-center font-semibold' colSpan={8}>ไม่พบข้อมูล</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        })
                    }
                </div>
            </div>
        </>

    )
}

export default MachineRMStock