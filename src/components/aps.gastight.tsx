import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, BarElement, CategoryScale, LinearScale, Title } from "chart.js";
import { Badge, Card, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { ApiGetGastight } from '@/service/aps.service';
import { Datum, PropsChart } from '@/interface/aps.interface';
Chart.register(ChartDataLabels);
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
function Gastight() {
    const [ymd, setYmd] = useState<any>(moment().subtract(8, 'hours').format('YYYYMMDD'));
    const [cntGastight, setCntGastight] = useState<number>(0);
    const [GastightChart, setGastightChart] = useState<PropsChart>();
    let delayed = false;
    const [dataSource, setDataSource] = useState<Datum[]>([]);

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
        <div>
            <Card className='mb-6' title="Search" bordered={true} size='small' type="inner" >
                <div className='flex  gap-3'>
                    <div className='w-fit flex items-center gap-2'>
                        <span>วันที่ : </span>
                        <input type="date" className='drop-shadow-sm border rounded-md px-3' value={moment(ymd, 'YYYYMMDD').format('YYYY-MM-DD')} onChange={(e) => setYmd(moment(e.target.value).format('YYYYMMDD'))} />
                    </div>
                    {/* <div className='w-fit flex items-center gap-2'>
                        <span>กะผลิต : </span>
                        <input type="date" className='drop-shadow-sm border rounded-md px-3' value={moment(ymd, 'YYYYMMDD').format('YYYY-MM-DD')} onChange={(e) => setYmd(moment(e.target.value).format('YYYYMMDD'))} />
                    </div> */}
                </div>
            </Card>

            <div className='grid sm:grid-cols-4 border'>
                <div className="col-span-1 flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <h3 className="font-semibold leading-none tracking-tight">GasTight Monitor</h3>
                    <p className="text-sm text-muted-foreground">แสดงข้อมูลการผลิตไลน์ Main Assembly</p>
                </div>
                <div className="col-span-2 bg-black text-white">
                    <button data-active="false" className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"><span className="text-xs ">กำลังผลิต  <span className='text-[#3b5999] font-semibold'></span></span><span className="text-lg font-bold leading-none sm:text-3xl">{dataSource.length > 0 ? `${dataSource.at(1)?.modelname} (${dataSource.at(1)?.model})` : '-'}</span></button>
                </div>
                <div className="flex col-span-1 bg-[#1777fe] text-white">
                    <button data-active="true" className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l   sm:border-l sm:border-t-0 sm:px-8 sm:py-6"><span className="text-xs ">ผลิตทั้งหมด <span className=' font-semibold'>({moment(ymd, 'YYYYMMDD').format('DD/MM/YYYY')})</span></span><span className="text-lg font-bold leading-none sm:text-3xl ">{cntGastight.toLocaleString('en')}</span></button>
                </div>
            </div>

            <div id='grid' className='grid sm:grid-cols-1 md:grid-cols-4 py-6 gap-6'>
                <div className='sm:col-span-1 md:col-span-2 flex flex-col gap-3'>
                    <div className='flex flex-col gap-1'>
                        <strong>Count of Model</strong>
                        <small className='opacity-75'>จำนวนที่ผลิตได้แต่ละโมเดลของวันนี้</small>
                    </div>
                    <div className='shadow-md p-6 rounded-md border w-[100%] sm:h-[100%] md:h-[400px]'>
                        <Bar
                            data={
                                {
                                    labels: GastightChart?.labels,
                                    datasets: [{
                                        label: 'Result',
                                        data: GastightChart?.data,
                                        backgroundColor: [
                                            'rgba(23,119,254, 1)',
                                            'rgba(23,119,254, 1)',
                                            'rgba(23,119,254, 1)',
                                            'rgba(23,119,254, 1)',
                                            'rgba(23,119,254, 1)',
                                            'rgba(23,119,254, 1)',
                                            'rgba(23,119,254, 1)'
                                        ],
                                        borderColor: [
                                            'rgba(23,119,254, 1)',
                                            'rgba(23,119,254, 1)',
                                            'rgba(23,119,254, 1)',
                                            'rgba(23,119,254, 1)',
                                            'rgba(23,119,254, 1)',
                                            'rgba(23,119,254, 1)',
                                            'rgba(23,119,254, 1)'
                                        ],
                                        borderWidth: 0
                                    }]
                                }
                            }
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: { max: GastightChart?.data != undefined ? Math.max(...GastightChart?.data.map((item) => Number(item))) + 50 : 0 },
                                    x: {
                                        ticks: {
                                            font: {
                                                weight: 'bold',
                                                size: 14
                                            }
                                        }
                                    }
                                },
                                plugins: {
                                    legend: {
                                        display: false
                                    },
                                    datalabels: {
                                        color: 'black',
                                        align: 'top',
                                        anchor: 'end',
                                        font: {
                                            size: 24,
                                            weight: 'bold'
                                        }
                                    }
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
                <div className='sm:col-span-1  md:col-span-2 flex flex-col gap-3' id={dataSource.length > 0 ? 'TagTableGastight' : ''}>
                    <div className='flex justify-between'>
                        <div className='flex flex-col gap-1'>
                            <strong>GasTight List</strong>
                            <small className='opacity-75'>ข้อมูลการผลิตของ GasTight</small>
                        </div>
                        <div className='w-fit flex items-center rounded-md '>
                            <div>ทั้งหมด :  <Badge count={cntGastight} showZero={true} overflowCount={99999} /> รายการ</div>
                        </div>
                    </div>
                    <Table id='tbGastight' dataSource={dataSource} columns={columns} className='border rounded-md shadow-md' size='small' />
                </div>
            </div>
        </div>
    )
}

export default Gastight