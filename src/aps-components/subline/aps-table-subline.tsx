//@ts-check
import { bgMain, bgSubline, colorYellowMstr,  txtSuccess } from '@/constants'
import { PropCasingHeader, PropCasingInfo, PropsMain, PropsWip } from '@/interface/aps.interface';
import { APIGetWIPSubline } from '@/service/aps.service';
import { Spin } from 'antd'
import { Fragment, useEffect, useState } from 'react';
import { AiFillProduct } from "react-icons/ai";
interface Params {
    load: boolean;
    Wips: PropsWip[];
    MainSequence: PropsMain[];
}
const processMstr = [
    {
        label: 'Machine', value: 'machine', children: [
            {
                label: 'Housing', value: 'hs'
            },
            {
                label: 'Lower', value: 'lw'
            },
            {
                label: 'Crankshaft', value: 'cs'
            },
            {
                label: 'FS/OS', value: 'fs'
            },
            {
                label: 'Clamber', value: 'cb'
            }
        ]
    },
    {
        label: 'Casing', value: 'casing', children: [
            {
                label: 'Top', value: 'top'
            },
            {
                label: 'Body', value: 'body'
            },
            {
                label: 'Bottom', value: 'bottom'
            }
        ]
    }, {
        label: 'Motor', value: 'motor', children: [
            {
                label: 'Stator', value: 'stator'
            },
            {
                label: 'Rotor', value: 'rotor'
            }
        ]
    }
]
function ApsTableSubline(props: Params) {
    const { load } = props;
    const [line, setLine] = useState<string>('casing'); // Machine, Casing, Motor 
    const [process, setProcess] = useState<string>(''); // Housing, Lower, Crankshaft, FS/OS, Clamber ...
    const [casingInfo, setCasingInfo] = useState<PropCasingInfo>({
        item: [],
        header: [],
        lastUpdate:[]
    });
    useEffect(() => {
        init();
    }, [])
    const init = async () => {
        let RESGetStockCasing = await APIGetWIPSubline('sdas',process);
        setCasingInfo(RESGetStockCasing);
    }
    useEffect(() => {
        if (!load) {

        }
    }, [load])
    useEffect(() => {
        init();
    }, [process])
    return (
        <div>
            <div className='flex flex-col  gap-2  rounded-md px-3 pb-3 shadow-md bg-[#1e1f23] text-white h-full'>
                <div className='flex flex-col  bg-[rgb(30,31,35)] text-white border rounded-md shadow-md border-[#1e1f23] gap-3'>
                    <div className='grid grid-cols-3 items-center'>
                        <div className='text-[1em] font-semibold flex items-center gap-2 pl-1'>
                            <AiFillProduct />
                            <span>Subline Sequence</span>
                        </div>
                        <div className='grid grid-cols-3 divide-x divide-white/10 border-x border-white/5 backdrop-blur shadow-lg'>
                            {
                                processMstr.map((x) => {
                                    return <div className={` text-center uppercase tracking-widest cursor-pointer select-none hover:bg-gradient-to-r ${x.value == line ? 'bg-gradient-to-r' : ''} from-[#181a1e] via-[#181a1e]/10 to-[#181a1e] transition-all duration-300 py-3`} onClick={() => setLine(x.value)}>
                                        <span className={`${line == x.value ? colorYellowMstr : 'opacity-50'} hover:opacity-100  transition-all duration-200`}> {x.label}</span>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                    <div className='pl-1 flex items-center justify-between'>
                        <div className={`flex  items-center divide-x divide-white/10 backdrop-blur shadow-lg border border-white/5`}>
                            {
                                processMstr.filter((x) => x.value == line).map((x) => x.children).flat().map((item) => {
                                    return <div className={`w-[100px]  text-center uppercase tracking-widest cursor-pointer select-none hover:bg-gradient-to-r ${item.value == process ? 'bg-gradient-to-r' : ''} from-[#181a1e] via-[#181a1e]/10 to-[#181a1e] transition-all duration-300 py-1`} onClick={() => setProcess(item.value)}>
                                        <span className={`${process == item.value ? colorYellowMstr : 'opacity-50'} hover:opacity-100  transition-all duration-200 px-3`}> {item.label}</span>
                                    </div>
                                })
                            }
                        </div>
                        <div className='flex items-center gap-3 justify-end pr-2'>
                            <div className={`flex items-center gap-2 ${bgMain} rounded-sm`}>
                                <div className={`h-5 w-8 rounded-sm border border-[#6A67F3] shadow-lg bg-[#6A67F3] text-sm flex items-center justify-center drop-shadow-2xl`}>
                                    <span className='opacity-90'>P</span>
                                </div>
                                <small>Plant</small>
                            </div>
                            <div className={`flex items-center gap-2 ${bgSubline} rounded-sm`}>
                                <div className='h-5 w-8 rounded-sm border border-[#498DCA] shadow-lg bg-[#498DCA] text-sm flex items-center justify-center drop-shadow-2xl'>
                                    <span className='opacity-90'>PS</span>
                                </div>
                                <small>Part supply</small>
                            </div>
                        </div>
                    </div>
                    <Spin spinning={load}>
                        <table className='w-full  border border-[#181a1e] shadow-lg   '>
                            <thead className='bg-white/15 backdrop-blur-lg shadow-2xl text-white text-[11px] '>
                                <tr>
                                    <td className='w-[35px] text-center' rowSpan={2}>SEQ.</td>
                                    <td className='w-[125px] text-center' rowSpan={2}>C.MODEL</td>
                                    <td className='text-center w-[75px]' rowSpan={2}>DRAWING</td>
                                    <td rowSpan={2} className='text-center w-[50px] font-semibold'>PLAN</td>
                                    <td colSpan={2} className='text-center w-[100px]  font-bold '>RESULT</td>
                                    {
                                        casingInfo.header.map((oHeaderSubline: PropCasingHeader, index) => {
                                            return <td colSpan={2} key={index} className='w-[100px] text-center tracking-wider py-1'>
                                                <p>{oHeaderSubline.groupName}</p>
                                            </td>
                                        })
                                    }
                                </tr>
                                <tr>
                                    <td className='text-center w-[50px] font-bold text-white'>M/C</td>
                                    <td className='text-center  w-[50px]  text-white font-bold tracking-wider'>MAIN</td>
                                    {
                                        casingInfo.header.map((_, index) => {
                                            return <Fragment key={index}>
                                                <td className={`text-center bg-violet-500 w-[50px] py-1`}>P</td>
                                                <td className={`text-center bg-sky-600 w-[50px]`}>PS</td>
                                            </Fragment>
                                        })
                                    }
                                </tr>

                            </thead>
                            <tbody className='text-[12px]'>
                                {
                                    casingInfo.item.map((item, idxWipRM) => {
                                        const keys = Object.keys(item.data) as (keyof typeof item.data)[];
                                        let models = item.model.split(',');
                                        // let modelsInMainSeq = MainSequence.filter((main: PropsMain) => main.apsPlanDate != moment().format('YYYY-MM-DDT00:00:00')).map((main: PropsMain) => main.modelCode);
                                        console.log(item)
                                        return (
                                            <tr key={idxWipRM}>
                                                <td className='text-center align-top bg-white/5 border border-black/35'>{item.prdSeq}</td>
                                                <td className='text-start w-[150px] align-top  border border-black/25'>
                                                    {
                                                        Array.from(new Set(models.slice(0, 3))).map((model: string, idx: number) => {

                                                            return <span key={idx} className={`text-center text-white/80`}>{model}{idx != Array.from(new Set(models.slice(0, 3))).length - 1 ? ', ' : ''} </span>
                                                        })
                                                    }
                                                    ...
                                                </td>
                                                <td className='align-top pl-2 font-semibold w-[120px] opacity-75 pr-2 bg-white/5 border-l border-y border-black/10'>
                                                    <div className='flex flex-col justify-center leading-1'>
                                                        <span className='text-white/30 tracking-wider'>{item.partNo}</span>
                                                        <span>{item.modelName}</span>
                                                    </div>
                                                </td>
                                                <td className={`align-top text-end pr-1 font-semibold text-white bg-[#265df3]/80 border-y border-black/50`}>{item.remainPlan}</td>
                                                <td className={` border-y border-black/50 align-top text-end pr-1 font-semibold tracking-widest  bg-[#28ad50]/80 text-white ${txtSuccess} drop-shadow-lg `}>{item.resultSubline}</td>
                                                <td className='  border-y border-black/50 align-top text-end pr-1 bg-[#fec91b]/80   text-black'>-</td>
                                                {
                                                    keys.map((keyItem: any, indWipRm: number) => {
                                                        var RMStock = typeof item.data[keyItem] != 'undefined' ? (Number(item.data[keyItem]) > 0 ? Number(item.data[keyItem]) : 0) : 0;
                                                        return <Fragment key={indWipRm}>
                                                            <td className={`${indWipRm != keys.length - 1 ? 'border-r' : ''} ${RMStock <= 0 && 'bg-black/50'} border-y border-white/5 align-top text-end  pr-1 `}><span>{RMStock > 0 ? RMStock.toLocaleString() : ''}</span> </td>
                                                        </Fragment>
                                                    })
                                                }
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </Spin>
                </div>
            </div>
        </div>
    )
}

export default ApsTableSubline