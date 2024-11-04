//@ts-nocheck
import { ParamRMDetail, PropCasingHeader, PropCasingInfo, PropDataSubline, PropLineAndProcess, PropsMain, PropSubline } from '@/interface/aps.interface';
import { APIGetWIPSubline } from '@/service/aps.service';
import { Badge, Button, Card, Input, Modal, Popover, Radio, RadioChangeEvent, Result, Spin } from 'antd';
import { Fragment, useEffect, useState } from 'react'
// type TabPosition = 'left' | 'right' | 'top' | 'bottom';
interface ParamMainPlan {
    // mainplan: PropsMain[];
    line: string;
    processs: string[];
    subline: string;
    setSubline: Function;
}

function SublineWIPs(props: ParamMainPlan) {
    const { line, processs, subline, setSubline } = props;
    const [widthTable, setWidthTable] = useState<number>(0);
    const [load, setLoad] = useState<boolean>(true);
    const [WIPSubline, setWIPSubline] = useState<PropCasingInfo>({
        item: [],
        header: [],
    });
    const [RMSelected, setRMSelected] = useState<ParamRMDetail>({ part: '', cm: '', rm_group: '' });
    const [openRMDetail, setOpenRMDetail] = useState<boolean>(false);
    const [loadRMDetail, setLoadRMDetail] = useState<boolean>(true);
    const loadData = async () => {
        setLoad(true);
        try {
            let RESGetStockCasing = await APIGetWIPSubline(line, subline);
            setWIPSubline(RESGetStockCasing);
            setWidthTable(475 + (RESGetStockCasing.header.length * 80))
            setTimeout(() => {
                setLoad(false);
            }, 500);
        } catch (e: Error | any) {
            setLoad(false);
        }
    }
    useEffect(() => {
        loadData();
    }, [line, subline])

    const getIndexFromEnd = (str: string, char: string, positionFromEnd: number): number => {
        const reversedIndex = str.split("").reverse().join("").indexOf(char, positionFromEnd);
        let index = reversedIndex === -1 ? -1 : str.length - 1 - reversedIndex;
        return str.substring(0, index);
    };
    useEffect(() => {
        if (RMSelected.part != '') {
            setOpenRMDetail(true);
        } else {
            setOpenRMDetail(false);
        }
    }, [RMSelected])
    useEffect(() => {
        if (openRMDetail == true) {
            loadRMDetial();
        }else{
            setRMSelected({part : '',cm : '',rm_group : ''})
        }
    }, [openRMDetail])
    const loadRMDetial = async () => {
        let RESGetRMDetail = await GetRMDetail(RMSelected);
    }
    return (
        <div className='flex flex-col gap-2'>
            <div className='flex items-center justify-between'>
                <Radio.Group value={subline} onChange={(e) => setSubline(e.target.value)}>
                    {
                        processs.map(o => <Radio.Button value={o}>{o}</Radio.Button>)
                    }
                </Radio.Group>
                <div className='flex items-center gap-3 justify-end '>
                    <div className={`flex items-center gap-2  rounded-sm pr-3`}>
                        <div className={`h-5 w-8 rounded-sm border  shadow-lg bg-[#6A67F3] text-sm flex items-center justify-center drop-shadow-2xl`}>
                            <span className='opacity-90 text-white font-bold'>P</span>
                        </div>
                        <small>Plant</small>
                    </div>
                    <div className={`flex items-center gap-2  rounded-sm pr-3`}>
                        <div className='h-5 w-8 rounded-sm border border-[#498DCA] shadow-lg bg-[#498DCA] text-sm flex items-center justify-center drop-shadow-2xl'>
                            <span className='opacity-90 text-white font-bold'>PS</span>
                        </div>
                        <small>Part supply</small>
                    </div>
                </div>
            </div>
            <div className='overflow-auto'>
                {
                    JSON.stringify(RMSelected)
                }
                <Spin spinning={load}>
                    <table id='tbCasingSubline' className='w-[100%] bg-white' style={{ width: load ? '100%' : widthTable }}>
                        <thead className="sm:text-[10px] md:text-[10px] lg:text-[10px]   sticky top-0 bg-[#f9fafb]">
                            <tr>
                                <th className='border w-[50px]  text-white' rowSpan={2}>SEQ</th>
                                <th className='border w-[150px]' rowSpan={2}>MODEL</th>
                                <th className='border w-[175px]' rowSpan={2}>PART</th>
                                <th className='border w-[50px]' rowSpan={2}>REMAIN<br></br>PLAN</th>
                                <th className='border w-[50px]' colSpan={1}>RESULT</th>
                                {
                                    WIPSubline.header.map((item: PropCasingHeader, index: number) => {
                                        return <th key={index} className='border text-vertical px-1 w-[100px]' colSpan={2}>{item.groupName}</th>
                                    })
                                }
                            </tr>
                            <tr>
                                <th className='border w-[50px] py-1'>M/C</th>
                                {
                                    WIPSubline.header.map((_, i: number) => {
                                        return <Fragment key={i}>
                                            <th className="border w-[40px] bg-[#6A67F3] text-white">P</th>
                                            <th className="border w-[40px] bg-[#498DCA] text-white">PS</th>
                                        </Fragment>
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody className='sm:text-[11px] md:text-[11px] lg:text-[11px] '>
                            {
                                WIPSubline?.item == undefined || WIPSubline.item.length == 0 ? <tr><td colSpan={(WIPSubline.header.length * 2) + 6}>
                                    <Result
                                        title="ไม่พบข้อมูลที่คุณต้องการ ... "
                                        extra={
                                            <Button type="primary" key="console" onClick={() => loadData()}>
                                                โหลดข้อมูล
                                            </Button>
                                        }
                                    />
                                </td></tr> : WIPSubline.item.length == 0 ? <tr><td colSpan={(WIPSubline.header.length * 2) + 6}>
                                    <Result
                                        title="ไม่พบข้อมูลที่คุณต้องการ ... "
                                        extra={
                                            <Button type="primary" key="console">
                                                โหลดข้อมูล
                                            </Button>
                                        }
                                    />
                                </td></tr> :
                                    WIPSubline.item.map((item: PropSubline, index: number) => {
                                        const keys = Object.keys(item.data) as (keyof typeof item.data)[];
                                        let models = item.model.split(',');
                                        return <tr key={index}>
                                            <td className='border text-center align-top py-1 bg-slate-800/80 text-white'>{item.prdSeq}</td>
                                            <td className='border break-all align-top pl-1'>
                                                {
                                                    models.slice(0, 3).map((model: string, idx: number) => {
                                                        return <Popover className='cursor-pointer' content={
                                                            <div className='grid grid-cols-6 gap-1'>
                                                                {
                                                                    models.map((o: string, idxmc: number) => {
                                                                        return <Badge color='blue' count={o} overflowCount={9999}></Badge>
                                                                    })
                                                                }
                                                            </div>
                                                        } title='โมเดลที่ใช้งาน'>
                                                            <span key={idx} className={`text-center`}>{model} {idx != models.slice(0, 3).length - 1 ? ',' : ''}</span>
                                                        </Popover>
                                                    })
                                                }
                                                ...
                                            </td>
                                            <td className='border break-all align-top pl-1  font-semibold '>
                                                <div className='flex flex-col leading-none gap-1 py-1'>
                                                    <strong>{item.modelName}</strong>
                                                    <span>{item.partNo} {item.cm != '' ? `(${item.cm})` : ''}</span>
                                                </div>
                                            </td>
                                            <td className='border break-all text-end pr-1 align-top text-[#1d4ed8] font-bold'>{item.remainPlan.toLocaleString('en')}</td>
                                            <td className={`border break-all text-end pr-1 align-top font-bold ${(item?.resultSubline != undefined && item?.resultSubline != '0') ? 'text-green-600' : ''}`}>{(item?.resultSubline != undefined && item?.resultSubline != '0') ? item?.resultSubline : ''}</td>
                                            {
                                                keys.map((keyItem: any, idxItem: number) => {
                                                    var RMStock = typeof item.data[keyItem] != 'undefined' ? (Number(item.data[keyItem]) > 0 ? (Number(item.data[keyItem]) >= 10000 ? (Number(item.data[keyItem]) / 1000).toFixed(0).toString() + 'K' : Number(item.data[keyItem]).toLocaleString('en')) : '') : '-';
                                                    return <td key={idxItem} className={`text-right pr-1 align-top border ${RMStock != '' ? 'font-bold tracking-wide' : ''} ${RMStock != '' && (idxItem % 2 == 0 ? 'bg-[#6A67F3]/10' : 'bg-[#498DCA]/10')}`} onClick={() => setRMSelected({
                                                        part: item.partNo,
                                                        cm: item.cm,
                                                        rm_group: getIndexFromEnd(keyItem, '-', 0)
                                                    })}>{RMStock}</td>
                                                })
                                            }
                                        </tr>
                                    })
                            }
                        </tbody>
                    </table>
                </Spin>
            </div>
            <Modal title='รายละเอียดของ Raw material' open={openRMDetail} onCancel={() => setOpenRMDetail(false)} onClose={() => setOpenRMDetail(false)} footer={<Button onClick={() => setOpenRMDetail(false)}>ปิดหน้าต่าง</Button>}>
                <Spin spinning={loadRMDetail} tip='กำลังโหลดข้อมูล'>
                    <div className='flex flex-col gap-3'>
                        <div className='grid grid-cols-2 gap-2 items-center'>
                            <strong className='col-span-1 text-end'>Part : </strong>
                            <Input type='text' readOnly={true} value={RMSelected.part} />
                        </div>
                        <div className='grid grid-cols-2 gap-2 items-center'>
                            <strong className='col-span-1 text-end'>Raw Material : </strong>
                            <Input type='text' readOnly={true} value={RMSelected.rm_group == ''} />
                        </div>
                    </div>
                </Spin>
            </Modal>
        </div>
    )
}

export default SublineWIPs