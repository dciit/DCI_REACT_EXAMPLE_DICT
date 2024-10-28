//@ts-nocheck
import { bgMain, bgSubline, styleTxtPrimary, txtSuccess } from '@/constants'
import moment from 'moment'
import React, { Fragment } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, Tooltip, Legend, BarElement, CategoryScale, LinearScale, Title } from "chart.js";
import { Badge, Card, Spin, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { ApiGetGastight, ApiGetMainPlan } from '@/service/aps.service';
import { Datum, PropsChart, PropsMain, PropsWip } from '@/interface/aps.interface';
import { AiOutlineClose } from "react-icons/ai";

Chart.register(ChartDataLabels);
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
interface PropsPartGroup {
    column: string;
    group: string;
    line: string;
}
let columnMstr: PropsPartGroup[] = [
    { column: 'statorMain', group: 'STATOR', line: 'MAIN' },
    { column: 'statorSubline', group: 'STATOR', line: 'SUBLINE' },
    { column: 'rotorMain', group: 'ROTOR', line: 'MAIN' },
    { column: 'rotorSubline', group: 'ROTOR', line: 'SUBLINE' },
    { column: 'hsMain', group: 'HS', line: 'MAIN' },
    { column: 'hsSubline', group: 'HS', line: 'SUBLINE' },
    { column: 'csMain', group: 'CS', line: 'MAIN' },
    { column: 'csSubline', group: 'CS', line: 'SUBLINE' },
    { column: 'fsMain', group: 'FS', line: 'MAIN' },
    { column: 'fsSubline', group: 'FS', line: 'SUBLINE' },
    { column: 'lwMain', group: 'LW', line: 'MAIN' },
    { column: 'lwSubline', group: 'LW', line: 'SUBLINE' },
    { column: 'bodyMain', group: 'BODY', line: 'MAIN' },
    { column: 'bodySubline', group: 'BODY', line: 'SUBLINE' },
    { column: 'topMain', group: 'TOP', line: 'MAIN' },
    { column: 'topSubline', group: 'TOP', line: 'SUBLINE' },
    { column: 'bottomMain', group: 'BOTTOM', line: 'MAIN' },
    { column: 'bottomSubline', group: 'BOTTOM', line: 'SUBLINE' }
];
interface Params {
    load: boolean;
    Wips: PropsWip[];
}
function ApsMainStock(props: Params) {
    const { load, Wips } = props
    const [ymd, setYmd] = useState<string>(moment().subtract(8, 'hours').format('YYYYMMDD'));
    const [MainPlans, setMainPlans] = useState<PropsMain[]>([]);
    const [cntGastight, setCntGastight] = useState<number>(0);
    const [GastightChart, setGastightChart] = useState<PropsChart>();
    let delayed = false;
    const [dataSource, setDataSource] = useState<Datum[]>([]);
    useEffect(() => {
        init();
    }, [])

    const columns = [
        {
            title: 'Serial',
            dataIndex: 'serial',
            key: 'serial',
        },
        {
            title: 'Model',
            dataIndex: 'model',
            key: 'model',
            render: (text: string, record: any, index: number) => {
                let isFirstRow: number = dataSource.findIndex(x => x.serial == record.serial && x.model == record.model);
                return <div key={index} className={` font-semibold flex flex-row items-center gap-3`}>
                    <span>{text}</span><Tag className={`${isFirstRow != 0 && 'hidden'} drop-shadow-md`} color="#adfa1d" style={{ color: 'black' }}>
                        ผลิตล่าสุด
                    </Tag></div>
            }
        },
        {
            title: 'Model Name',
            dataIndex: 'modelname',
            key: 'modelname',
            render: (text: string) => <span className='font-semibold'>{text} </span>
        },
        {
            title: 'Insert Date',
            dataIndex: 'insertDate',
            key: 'insertDate',
        },
    ];

    const init = async () => {

        let resGastight = await ApiGetGastight(ymd);
        setCntGastight(resGastight.data.length);
        setDataSource(resGastight.data);
        setGastightChart(resGastight.chart);
    }
    useEffect(() => {
        if (ymd != '') {
            init();
        }
    }, [ymd])
    return (
        <>
            <div className='' id='tag-main'>
                <div className='flex flex-col  gap-2  rounded-sm p-3 shadow-md bg-[#1e1f23] text-white h-full'>
                    <div className='pl-1 flex items-center justify-between'>
                        <span className='text-[1em] font-semibold'>Main Stock</span>
                        <div className='flex items-center gap-3 justify-end pr-2'>
                            <div className={`flex items-center gap-2 ${bgMain} rounded-sm`}>
                                <div className={`h-5 w-8 rounded-sm border border-[#6A67F3] shadow-lg bg-[#6A67F3] text-sm flex items-center justify-center drop-shadow-2xl`}>
                                    <span className='opacity-90'>M</span>
                                </div>
                                <small>Main</small>
                            </div>
                            <div className={`flex items-center gap-2 ${bgSubline} rounded-sm`}>
                                <div className='h-5 w-8 rounded-sm border border-[#498DCA] shadow-lg bg-[#498DCA] text-sm flex items-center justify-center drop-shadow-2xl'>
                                    <span className='opacity-90'>S</span>
                                </div>
                                <small>Subline</small>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-3 h-[500px] overflow-auto'>
                        {/* <Spin spinning={false}> */}
                        <table id='tbMain' className=' w-full  border border-[#181a1e] shadow-2xl  backdrop-blur-lg  border-collapse'>
                            <thead className='bg-white/15 backdrop-blur-lg shadow-lg text-white text-[10px]'>
                                <tr>
                                    <td rowSpan={3} className='text-center'>SEQ.</td>
                                    <td rowSpan={3} colSpan={2} className='text-center'>MODEL</td>
                                    <td colSpan={2} className='text-center py-1 border-[#181a1e]'>PLAN</td>
                                    <td rowSpan={3} className='text-center'>TIME</td>
                                    <td colSpan={8} className='text-center bg-gradient-to-r from-[#181a1e] via-[#181a1e]/10 to-[#181a1e] '>MACHINE</td>
                                    <td colSpan={6} className='text-center bg-gradient-to-r from-[#181a1e] via-[#181a1e]/10 to-[#181a1e]  '>CASING</td>
                                    <td colSpan={4} className='text-center  bg-gradient-to-r from-[#181a1e] via-[#181a1e]/10 to-[#181a1e] '>MOTOR</td>
                                </tr>
                                <tr>
                                    <td rowSpan={2} className='text-center'>REMAIN</td>
                                    <td rowSpan={2} className='text-center py-1'>RESULT</td>
                                    {/* <td colSpan={2} className='text-center bg-gradient-to-r from-[#181a1e] to-[#181a1e]/80 backdrop-blur-lg '>CS</td>
                                    <td colSpan={2} className='text-center bg-gradient-to-r from-[#181a1e] via-[#181a1e]/10 to-[#181a1e]'>HS</td>
                                    <td colSpan={2} className='text-center bg-gradient-to-r from-[#181a1e] via-[#181a1e]/10 to-[#181a1e]'>LW</td>
                                    <td colSpan={2} className='text-center bg-gradient-to-r from-[#181a1e]/80 to-[#181a1e] backdrop-blur-lg '>FS/OS</td>
                                    <td colSpan={2} className='text-center bg-gradient-to-r from-[#181a1e] to-[#181a1e]/80 backdrop-blur-lg'>TOP</td>
                                    <td colSpan={2} className='text-center bg-gradient-to-r from-[#181a1e] via-[#181a1e]/10 to-[#181a1e]'>BODY</td>
                                    <td colSpan={2} className='text-center bg-gradient-to-r from-[#181a1e]/80 to-[#181a1e] backdrop-blur-lg '>BOTTOM</td>
                                    <td colSpan={2} className='text-center bg-gradient-to-r from-[#181a1e] to-[#181a1e]/50 backdrop-blur-lg'>STATOR</td>
                                    <td colSpan={2} className=' text-center bg-gradient-to-r from-[#181a1e]/50 to-[#181a1e] backdrop-blur-lg'>ROTOR</td> */}
                                    <td colSpan={2} className='text-center bg-gradient-to-r  '>CS</td>
                                    <td colSpan={2} className='text-center bg-gradient-to-r '>HS</td>
                                    <td colSpan={2} className='text-center bg-gradient-to-r '>LW</td>
                                    <td colSpan={2} className='text-center bg-gradient-to-r '>FS/OS</td>
                                    <td colSpan={2} className='text-center bg-gradient-to-r '>TOP</td>
                                    <td colSpan={2} className='text-center bg-gradient-to-r '>BODY</td>
                                    <td colSpan={2} className='text-center bg-gradient-to-r '>BOTTOM</td>
                                    <td colSpan={2} className='text-center bg-gradient-to-r '>STATOR</td>
                                    <td colSpan={2} className=' text-center bg-gradient-to-r'>ROTOR</td>
                                </tr>
                                <tr>
                                    {
                                        [...Array(9)].map((_) => {
                                            return <>
                                                <td className={`text-center ${bgMain}`}>M</td>
                                                <td className={`text-center ${bgSubline}`}>S</td>
                                            </>
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Wips.map((item: any, index) => {
                                        let inProcess = item.apsCurrent == 'CURRENT';
                                        let inNext = item.apsCurrent == 'NEXT';
                                        let indNext = Wips.findIndex((x) => x.apsCurrent == 'NEXT');
                                        let indCurrent = Wips.findIndex((x) => x.apsCurrent == 'CURRENT');
                                        let isShow = item.apsSeq != ''
                                        let isNextDay = item.apsCurrent == 'NEXTDAY'
                                        return (
                                            <Fragment key={index}>
                                                {
                                                    (index == 0 || isNextDay) && <tr>
                                                        <td colSpan={24} className='pl-2 bg-black/80 tracking-wide'>{index == 0 ? moment().format('DD/MM/YYYY') : item.hhmm}</td>
                                                    </tr>
                                                }
                                                {
                                                    !isNextDay && <tr key={index} className={`${inProcess && `inProcess ${index != 0 && 'animate-bounce'}`} ${inProcess && 'shadow-md font-bold current'} ${inNext && ' bg-sky-600/45 shadow-md font-semibold'} ${index > indNext && 'inNext'}`}>
                                                        <td className={`${!inProcess && 'border-b border-white/5'} text-center`}>{item.apsSeq}</td>
                                                        <td className={`${!inProcess && 'border-b border-white/5'} ${index >= 2 && 'bg-white/5 '} text-center`}>{item.modelcode}</td>
                                                        <td className={`${!inProcess && 'border-b border-white/5'} pl-2`}>{item.modelname.replace('-10', '')}</td>
                                                        <td className={`${!inProcess && 'border-b border-white/5'} text-end pr-1 font-semibold  drop-shadow-2xl`}>
                                                            <span className={`font-bold  ${inProcess ? 'bg-red-500 rounded-sm px-1  text-white' : 'bg-[#242323]  text-red-500 rounded-sm px-1 opacity-100'}`}>
                                                                {item.apsRemainPlan > 0 ? item.apsRemainPlan : ''}
                                                            </span>
                                                        </td>
                                                        <td id='tdResult' className='text-end pr-1 font-bold bg-white/10 '>
                                                            <span className={` ${(index >= indCurrent ? (inProcess ? (item.apsResult > 0 ? 'bg-blue-500 text-white rounded-sm px-1' : '') : styleTxtPrimary) : txtSuccess)}`}>
                                                                {
                                                                    item.apsResult > 0 ? item.apsResult : ''
                                                                }
                                                            </span>
                                                        </td>
                                                        <td className={`text-center ${isShow ? 'h-fit' : 'h-[15px]'}`}>{item.hhmm}</td>
                                                        {
                                                            columnMstr.map((oCol: PropsPartGroup, iCol: number) => {
                                                                let qty: number = 0
                                                                try {
                                                                    qty = (typeof item[oCol.column] != 'undefined' ? item[oCol.column] : 0);
                                                                } catch {
                                                                    qty = 0;
                                                                }
                                                                let isEmpty = qty > 0 ? false : true
                                                                return <td key={iCol} className={`${!inProcess && (iCol % 2 ? 'bg-gradient-to-r from-sky-600/20 to-sky-600/0' : 'bg-gradient-to-r from-violet-600/20 to-indigo-600/0')} ${isEmpty ? 'text-center' : 'text-end pr-1'}  ${(qty <= 0 && isShow) && 'bg-red-'} `} >{qty > 0 ? qty : (isShow && <div className='text-center flex items-center justify-center text-red-500'><AiOutlineClose /></div>)}</td>
                                                            })
                                                        }
                                                    </tr>
                                                }
                                            </Fragment>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        {/* </Spin> */}

                    </div>
                </div>
            </div>
            <div className='border  border-[#eab308]/50 p-3 bg-[#eab308]/5 rounded-md w-[100%] grid grid-cols-5 '>
                {/* <small>Gastight</small> */}
                <div className='h-[150px] col-span-2 bg-[#1e1f23] rounded-md'>
                    <Bar
                        data={
                            {
                                labels: GastightChart?.labels,
                                datasets: [{
                                    label: 'Result',
                                    data: GastightChart?.data,
                                    backgroundColor: [
                                        'rgba(254 ,195 ,1, 1)',
                                        'rgba(254 ,195 ,1, 0.25)',
                                        'rgba(254 ,195 ,1, 0.25)',
                                        'rgba(254 ,195 ,1, 0.25)',
                                        'rgba(254 ,195 ,1, 0.25)',
                                        'rgba(254 ,195 ,1, 0.25)',
                                        'rgba(254 ,195 ,1, 0.25)'
                                    ],
                                    borderColor: [
                                        'rgba(254 ,195 ,1, 1)',
                                        'rgba(254 ,195 ,1, 1)',
                                        'rgba(254 ,195 ,1, 1)',
                                        'rgba(254 ,195 ,1, 1)',
                                        'rgba(254 ,195 ,1, 1)',
                                        'rgba(254 ,195 ,1, 1)',
                                        'rgba(254 ,195 ,1, 1)'
                                    ],
                                    borderWidth: 0,
                                    borderRadius: 4
                                }]
                            }
                        }
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    grid: {
                                        display: false
                                    },
                                    ticks: {
                                        display: false, // Remove Y-axis text (ticks)
                                    },
                                    max: GastightChart?.data != undefined ? Math.max(...GastightChart?.data.map((item) => Number(item))) + 100 : 0
                                },
                                x: {
                                    grid: {
                                        display: false
                                    },
                                    ticks: {
                                        color: '#ffffff80',
                                        font: {
                                            weight: 'bold',
                                            size: 12
                                        }
                                    }
                                }
                            },
                            plugins: {
                                legend: {
                                    display: false
                                },
                                datalabels: {
                                    color: 'white',
                                    align: 'top',
                                    anchor: 'end',
                                    font: {
                                        size: 12,
                                        weight: 'bold'
                                    }
                                },

                            },
                            animation: {
                                onComplete: () => {
                                    delayed = true;
                                },
                                delay: (context) => {
                                    let delay = 0;
                                    if (context.type === 'data' && context.mode === 'default' && !delayed) {
                                        delay = context.dataIndex * 50 + context.datasetIndex * 50;
                                    }
                                    return delay;
                                },
                            }
                        }}
                    />
                </div>
            </div>
        </>
    )
}

export default ApsMainStock