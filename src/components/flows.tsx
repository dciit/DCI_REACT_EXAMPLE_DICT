import { intervalTime } from "@/constants";
import { PropFlows, PropItemFlow } from "@/interface/aps.interface";
import { APIGetFlowInfo, APIGetStationInfo } from "@/service/aps.service";
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { BsStack } from "react-icons/bs";
import { Button, Modal, Spin } from "antd";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import moment from "moment";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
interface PropItem {
    title: string;
    data: PropItemFlow[];
}
interface PropWIPBetweenProcess {
    fData: PropItemFlow[];
    tData: PropItemFlow[];
}
function Flows() {
    const [Datas, setDatas] = useState<PropFlows>({
        axiscore: [], gastight: [], shrinkage: [], largeP: []
    });
    const [once, setOnce] = useState<boolean>(true);
    const [OpenModalFlowDetail, setOpenModalFlowDetail] = useState<boolean>(false);
    // const [Labels, setLabels] = useState<string[]>(['January', 'February', 'March', 'April', 'May', 'June', 'July'])
    const [LoadFlow, setLoadFlow] = useState<boolean>(true);
    const [chartData, setChartData] = useState({
        labels: [] as string[],
        datasets: [] as any[],
    });
    const [FlowSelected, setFlowSelected] = useState<string>('');
    const [chartOptions] = useState({
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: false,
                text: "Dynamic Chart Data",
            },
        },
    });
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
    }, [once])
    const init = async () => {
        let res = await APIGetFlowInfo();
        console.log(res)
        setDatas(res);
        setOnce(false);
    }

    const LoadFlowInfo = async () => {
        let res = await APIGetStationInfo(FlowSelected);
        try {
            setChartData({
                labels: res.data.map((x: any) => x.MODEL),
                datasets: [
                    {
                        label: "Result",
                        data: Object.values(res.data),
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                    },
                ],
            });
            setLoadFlow(false);
        } catch (e: Error | any) {
            console.log(e.message)
        }
    }
    useEffect(() => {
        if (OpenModalFlowDetail == true) {
            LoadFlowInfo();
        } else {
            setFlowSelected('');
        }
    }, [OpenModalFlowDetail])
    useEffect(() => {
        if (FlowSelected != '') {
            setOpenModalFlowDetail(true);
        }
    }, [FlowSelected])
    const ItemFlowOffline = ({ title }: any) => {
        return <div className="w-full h-fit  backdrop-blur-lg bg-gradient-to-r from-slate-900 to-slate-700 shadow-lg rounded-md relative  z-50 pl-[8px] pr-[10px] pt-[4px] pb-[4px] flex items-center justify-between" id="box1">
            <div className='flex items-center gap-2'>
                <span className='text-white/90'>{title}</span>
            </div>
            <div className="w-fit text-xs font-semibold px-[8px] bg-red-500 text-black rounded-full tracking-wide flex gap-[2px] items-center">
                <span>Offline</span>
            </div>
        </div>
    }
    const ItemFlow = ({ title, data }: PropItem) => {
        return <div className=' bg-gradient-to-r text-xs from-slate-900 to-slate-700 px-[16px] pt-[8px] pb-[12px] rounded-[8px] w-fit  shadow-md z-50 cursor-pointer'>
            <div className="flex justify-between items-center gap-[8px]">
                <div className="flex gap-[8px] items-center">
                    <span className="text-lg text-white/90 tracking-wider">{title}</span>
                </div>
                <div className="w-fit text-xs font-semibold px-[8px] bg-green-500 text-black rounded-full tracking-wide flex gap-[2px] items-center" onClick={() => setFlowSelected(title)}>
                    <span>Online</span> <IoSearch className="opacity-50" />
                </div>
            </div>
            <div>
                <table className="w-full 	tracking-wide">
                    <thead>
                        <tr>
                            <td className="text-white/50 tracking-wide py-[4px] w-[150px] ">Model </td>
                            <td className="text-white/50 w-[150px] text-end pr-[0px]">Actual</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.filter(x => x.MODEL != 'TOTAL' && x.MODEL != 'OTHER').map((o: PropItemFlow, index: number) => {
                                return <tr className="leading-none " key={index}>
                                    <td className="text-white/85 py-[4px]">
                                        <div className="flex gap-[8px] items-center">
                                            <span className={`${o.STATUS == 'CURRENT' && 'text-yellow-400 font-semibold tracking-wider'}`}>{o.MODEL}</span>
                                            {
                                                o.STATUS == 'CURRENT' && <div className=" animate-pulse w-fit px-[8px] py-[2px] font-semibold shadow-md bg-green-500 text-black rounded-full tracking-wide">
                                                    Current
                                                </div>
                                            }
                                        </div>
                                    </td>
                                    <td className="text-green-400 not-italic text-end font-semibold pr-[0px] drop-shadow-lg">{o.ACTUAL}</td>
                                </tr>
                            })
                        }

                        {
                            data.filter(x => x.MODEL == 'OTHER').length > 0 &&
                            <tr className="leading-none">
                                <td className="text-white/85 py-[4px]">Other</td>
                                <td className="text-green-400 not-italic text-end font-semibold pr-[0px]">{data.filter(x => x.MODEL == 'OTHER')[0].ACTUAL}</td>
                            </tr>
                        }
                        <tr className="leading-none ">
                            <td className="text-white pt-[8px]">Total</td>
                            <td className="text-white not-italic text-end font-semibold pr-[0px]"> {data.filter(x => x.MODEL == 'TOTAL').length ? data.filter(x => x.MODEL == 'TOTAL')[0].ACTUAL : 0}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    }

    const WIPBetweenProcess = ({ fData, tData }: PropWIPBetweenProcess) => {
        var TotalError: string = '';
        var TotalFrom: number = 0;
        var TotalTo: number = 0;
        var TotalDiff: number = 0;
        try {
            TotalFrom = fData.filter(x => x.MODEL == 'TOTAL').length != 0 ? Number(fData.filter(x => x.MODEL == 'TOTAL')[0].ACTUAL) : 0;
            TotalTo = tData.filter(x => x.MODEL == 'TOTAL').length != 0 ? Number(tData.filter(x => x.MODEL == 'TOTAL')[0].ACTUAL) : 0;
            TotalDiff = TotalFrom - TotalTo;
            TotalDiff = TotalDiff < 0 ? 0 : TotalDiff;
        } catch (e: Error | any) {
            TotalError = e.message;
        }
        return <div className='flex items-center justify-center '>
            <div className="w-fit h-fit  backdrop-blur-lg bg-gradient-to-r from-slate-900 to-slate-700 shadow-lg rounded-md relative  z-50 px-[8px] py-[6px] flex flex-col leading-none gap-1" id="box1">
                <div className='flex gap-2 items-center'>
                    <span className='text-white/85'>WIP :</span>
                    <strong className='text-green-400 tracking-wide text-md animate-pulse'>{TotalDiff}</strong>
                </div>
                {
                    TotalError != '' && <div className="text-red-500 text-xs">
                        {TotalError}
                    </div>
                }

            </div>
        </div>
    }
    return (
        <>
            <div className='grow bg-black/20 p-3 rounded-md backdrop-blur-md shadow-md'>
                <div className='flex flex-col gap-2'>
                    <div className="relative h-fit flex items-center justify-between">
                        <div className='grid grid-cols-5 items-center w-full'>
                            {
                                Datas.largeP.length > 0 ? <ItemFlow title='Large P' data={Datas.largeP} /> : <ItemFlowOffline title='Large P' />
                            }
                            {/* <div className="w-full h-fit  backdrop-blur-lg bg-gradient-to-r from-slate-900 to-slate-700 shadow-lg rounded-md relative  z-50 pl-[8px] pr-[10px] pt-[4px] pb-[4px] flex items-center justify-between" id="box1">
                                <div className='flex items-center gap-2'>
                                    <span className='text-white/90'>Large P</span>
                                </div>
                                <div className="w-fit text-xs font-semibold px-[8px] bg-red-500 text-black rounded-full tracking-wide flex gap-[2px] items-center">
                                    <span>Offline</span>
                                </div>
                            </div> */}
                            <div></div>
                            <div></div>
                            <div></div>
                            <div className="flex items-center justify-end select-none">
                                <div className="w-fit h-fit  backdrop-blur-lg bg-gradient-to-r from-slate-900 to-slate-700 shadow-lg rounded-[16px] relative  z-50 pl-[16px] pr-[8px] py-[4px] flex items-center justify-between border-[2px] border-yellow-400" id="box1">
                                    <div className='flex items-center gap-2 text-white/90'>
                                        <BsStack />
                                        <span className=''>WIP Accum. : </span>
                                    </div>
                                    <div className="w-fit font-semibold px-[8px] text-yellow-400 rounded-full tracking-wide flex gap-[2px] items-center">
                                        <span>0</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <svg className="absolute w-full h-[5em]">
                            <line
                                x1="50%" y1="50%"
                                x2="50%" y2="125%"
                                stroke="gray" stroke-width="2"
                            />
                            <line
                                x1="50%" y1="50%"
                                x2="50%" y2="125%"
                                stroke="yellow"
                                stroke-width="4"
                                stroke-dasharray="10, 10"
                                stroke-linecap="round"
                                className="beam-line"
                            />
                        </svg>
                        <svg
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 "
                            width="100%"
                            height="4"
                        >
                            <line x1="0%" y1="0" x2="50%" y2="0" stroke="gray" stroke-width="4" />
                            <line
                                x1="0%"
                                y1="0"
                                x2="50%"
                                y2="0"
                                stroke="yellow"
                                stroke-width="4"
                                stroke-dasharray="10, 10"
                                stroke-linecap="round"
                                className="beam-line"
                            />
                        </svg>
                    </div>
                    <div className="relative h-fit flex">
                        <div className='grid grid-cols-5 items-center w-full justify-center '>
                            {
                                Datas.shrinkage.length > 0 ? <ItemFlow title='Shrinkage' data={Datas.shrinkage} /> : <ItemFlowOffline title='Shrinkage' />
                            }
                            <WIPBetweenProcess fData={Datas.shrinkage} tData={Datas.axiscore} />
                            {
                                Datas.axiscore.length > 0 ? <ItemFlow title='Axiscore' data={Datas.axiscore} /> : <ItemFlowOffline title='Axiscore' />
                            }
                            <WIPBetweenProcess fData={Datas.axiscore} tData={Datas.gastight} />
                            {
                                Datas.gastight.length > 0 ? <ItemFlow title='Gastight' data={Datas.gastight} /> : <ItemFlowOffline title='Gastight' />
                            }
                        </div>
                        <svg
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 "
                            width="100%"
                            height="4"
                        >
                            <line x1="0%" y1="0" x2="100%" y2="0" stroke="gray" stroke-width="4" />

                            <line
                                x1="0%"
                                y1="0"
                                x2="100%"
                                y2="0"
                                stroke="yellow"
                                stroke-width="4"
                                stroke-dasharray="10, 10"
                                stroke-linecap="round"
                                className="beam-line"
                            />
                        </svg>
                    </div>
                </div>
            </div>
            <Modal title={`${FlowSelected} Information`} open={OpenModalFlowDetail} onClose={() => setOpenModalFlowDetail(false)} onCancel={() => setOpenModalFlowDetail(false)} footer={
                <Button onClick={() => setOpenModalFlowDetail(false)}>ปิดหน้าต่าง</Button>
            }>
                <Spin spinning={LoadFlow}>
                    {
                        chartData.labels.length > 0 ? <div>
                            <p>{moment().subtract(8, 'hours').format('DD/MM/YYYY HH:mm:ss')}</p>
                            <Bar options={chartOptions} data={chartData} />
                        </div> : <p>ไม่พบข้อมูล</p>
                    }
                </Spin>
            </Modal>
        </>
    )
}

export default Flows