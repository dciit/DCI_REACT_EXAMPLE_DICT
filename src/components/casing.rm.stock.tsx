//@ts-nocheck
import { bgMain, bgSubline } from '@/constants';
import { PropCasingHeader, PropCasingInfo, PropDataSubline, PropsMain, PropSubline } from '@/interface/aps.interface';
import { APIGetInfoStockSubline } from '@/service/aps.service';
import { Button, Card, Radio, RadioChangeEvent, Result, Spin } from 'antd';
import { Fragment, useEffect, useState } from 'react'
type TabPosition = 'left' | 'right' | 'top' | 'bottom';
interface ParamMainPlan {
    mainplan: PropsMain[];
}
function CasingRMStock(props: ParamMainPlan) {
    const { mainplan } = props;
    const [widthTable, setWidthTable] = useState<number>(0);
    const mainModel = mainplan.map(x => x.modelCode);
    const [tabPosition, setTabPosition] = useState<TabPosition>('top');
    const changeTabPosition = (e: RadioChangeEvent) => {
        setTabPosition(e.target.value);
    };

    const [load, setLoad] = useState<boolean>(true);
    const [casingInfo, setCasingInfo] = useState<PropCasingInfo>({
        item: [],
        header: [],
    });
    useEffect(() => {
        loadData();
    }, [])
    const loadData = async () => {
        setLoad(true);
        try {
            let RESGetStockCasing = await APIGetInfoStockSubline(tabPosition);
            console.log(RESGetStockCasing)
            setCasingInfo(RESGetStockCasing);
            setWidthTable(475 + (RESGetStockCasing.header.length * 100))
            setTimeout(() => {
                setLoad(false);
            }, 500);
        } catch (e: Error | any) {
            setLoad(false);
        }
    }
    useEffect(() => {
        loadData();
    }, [tabPosition])


    return (
        <div className='flex flex-col gap-2'>
            <div className='flex items-center justify-between'>
                <Radio.Group value={tabPosition} onChange={changeTabPosition}>
                    <Radio.Button value="top">TOP</Radio.Button>
                    <Radio.Button value="body">BODY</Radio.Button>
                    <Radio.Button value="bottom">BOTTOM</Radio.Button>
                </Radio.Group>
                <div className='flex items-center gap-3 justify-end '>
                    <div className={`flex items-center gap-2 ${bgMain} rounded-sm pr-3`}>
                        <div className={`h-5 w-8 rounded-sm border border-[#6A67F3] shadow-lg bg-[#6A67F3] text-sm flex items-center justify-center drop-shadow-2xl`}>
                            <span className='opacity-90'>P</span>
                        </div>
                        <small>Plant</small>
                    </div>
                    <div className={`flex items-center gap-2 ${bgSubline} rounded-sm pr-3`}>
                        <div className='h-5 w-8 rounded-sm border border-[#498DCA] shadow-lg bg-[#498DCA] text-sm flex items-center justify-center drop-shadow-2xl'>
                            <span className='opacity-90'>PS</span>
                        </div>
                        <small>Part supply</small>
                    </div>
                </div>
            </div>
            <div className='overflow-auto  max-h-[600px]'>
                <Spin spinning={load}>
                    <table id='tbCasingSubline' style={{ width: widthTable }}>
                        <thead className="sm:text-[10px] md:text-[10px] lg:text-[10px] bg-[#ffffff]  text-black sticky top-0">
                            <tr>
                                <th className='border w-[50px]' rowSpan={2}>SEQ</th>
                                <th className='border w-[125px]' rowSpan={2}>MODEL</th>
                                <th className='border w-[150px]' rowSpan={2}>PART</th>
                                <th className='border w-[50px]' rowSpan={2}>REMAIN<br></br>PLAN</th>
                                <th className='border w-[100px]' colSpan={2}>RESULT</th>
                                {
                                    casingInfo.header.map((item: PropCasingHeader, index: number) => {
                                        return <th key={index} className='border text-vertical px-1 w-[100px]' colSpan={2}>{item.groupName}</th>
                                    })
                                }
                            </tr>
                            <tr>
                                <th className='border w-[50px] py-1'>M/C</th>
                                <th className='border w-[50px]'>MAIN</th>
                                {
                                    casingInfo.header.map((_, i: number) => {
                                        return <Fragment key={i}>
                                            <th className="border w-[50px]">P</th>
                                            <th className="border w-[50px]">PS</th>
                                        </Fragment>
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody className='sm:text-[10px] md:text-[10px] lg:text-[10px] '>
                            {
                                casingInfo?.item == undefined || casingInfo.item.length == 0 ? <tr><td colSpan={(casingInfo.header.length * 2) + 6}>
                                    <Result
                                        title="ไม่พบข้อมูลที่คุณต้องการ ... "
                                        extra={
                                            <Button type="primary" key="console" onClick={() => loadData()}>
                                                โหลดข้อมูล
                                            </Button>
                                        }
                                    />
                                </td></tr> : casingInfo.item.length == 0 ? <tr><td colSpan={(casingInfo.header.length * 2) + 6}>
                                    <Result
                                        title="ไม่พบข้อมูลที่คุณต้องการ ... "
                                        extra={
                                            <Button type="primary" key="console">
                                                โหลดข้อมูล
                                            </Button>
                                        }
                                    />
                                </td></tr> :
                                    casingInfo.item.map((item: PropSubline, index: number) => {
                                        const keys = Object.keys(item.data) as (keyof typeof item.data)[];
                                        let models = item.model.split(',');
                                        console.log(item)
                                        return <tr key={index}>
                                            <td className='border text-center align-top'>{item.prdSeq}</td>
                                            <td className='border break-all align-top'>
                                                {
                                                    models.slice(0, 3).map((model: string, idx: number) => {
                                                        return <span key={idx} className={`text-center`}>{model} {idx != models.slice(0, 3).length - 1 ? ',' : ''}</span>
                                                    })
                                                }
                                                ...
                                            </td>
                                            <td className='border break-all align-top pl-1  font-semibold '>
                                                <div className='flex flex-col'>
                                                    <strong>{item.modelName}</strong>
                                                    <span>{item.partNo}</span>
                                                </div>
                                            </td>
                                            <td className='border break-all text-end pr-1 align-top text-[#1d4ed8] font-bold'>{item.remainPlan.toLocaleString('en')}</td>
                                            <td className='border break-all text-end pr-1 align-top'>{item?.wipMain != undefined ? item?.wipMain : 0}</td>
                                            <td className='border break-all text-end pr-1 align-top'>{item?.wipSubline != undefined ? item?.wipSubline : 0}</td>
                                            {/* <td className='border break-all'>{item.time}</td> */}
                                            {
                                                keys.map((keyItem: any, idxItem: number) => {
                                                    var RMStock = typeof item.data[keyItem] != 'undefined' ? (Number(item.data[keyItem]) > 0 ? (Number(item.data[keyItem]) >= 10000 ? (Number(item.data[keyItem]) / 1000).toFixed(0).toString() + 'K' : Number(item.data[keyItem]).toLocaleString('en')) : '') : '-';
                                                    return <td key={idxItem} className={`text-right pr-1 align-top border ${RMStock != '' ? 'font-semibold' : ''}`}>{RMStock}</td>
                                                })
                                            }
                                            {/* {
                                                item.data.map((oItemSubline: PropDataSubline, idxItemSubline: number) => {
                                                    return <td key={idxItemSubline}>{0}</td>
                                                })
                                            } */}
                                            {/* {
                                                Object.keys(item).map((key: string) => {
                                                    let isVal: boolean = (key != 'prdSeq' && key != 'part' && key != 'model' && key != 'remainPlan' && key != 'time' && key != 'result') ? true : false;
                                                    return <td className={`break-all border text-center font-semibold  ${(isVal && item[key] != '') ? 'bg-green-100 text-green-700' : (isVal ? 'bg-red-100 text-red-700' : '')}`} key={key}>
                                                        {item[key]}
                                                    </td>
                                                })
                                            } */}
                                        </tr>
                                    })
                            }
                        </tbody>
                    </table>
                </Spin>
            </div>
        </div>
    )
}

export default CasingRMStock