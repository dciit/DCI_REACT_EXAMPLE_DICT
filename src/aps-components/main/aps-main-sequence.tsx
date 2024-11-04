//@ts-check
import { PropsMain} from '@/interface/aps.interface';
import { Spin } from 'antd';
import moment from 'moment';
interface Params {
    load: boolean;
    MainSequence: PropsMain[];
}
function ApsMainSequence(props: Params) {
    const dtNow = moment().add(-8, 'hours');
    const { load, MainSequence } = props
    let LoopDate: string = '';
    let isStartDay: boolean = false;
    return (
        <div className=''>
            <Spin spinning={load}>
                <div className='flex flex-col  gap-2   p-3 shadow-md bg-[#1e1f23] text-white h-full'>
                    <div className='pl-1 flex items-center justify-between'>
                        <span className='text-[1em] font-semibold'>Main Sequence</span>
                    </div>
                    <div className='shadow-2xl'>
                        <table className=' w-full backdrop-blur-lg   bg-gradient-to-r from-[#0c0d0f]/80  to-[#0c0d0f] text-[12px] border-collapse'>
                            <thead className='bg-white/15 backdrop-blur-lg shadow-lg text-white'>
                                <tr>
                                    <th className=' text-center w-[10%]' rowSpan={2}>SEQ.</th>
                                    <th className='pl-2 text-start' rowSpan={2}>MODEL</th>
                                    <th className=' text-center py-1 w-[20%]' rowSpan={2}>PLAN</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    MainSequence.map((item, index) => {
                                        let isCurrent = item.statusPlan == 'process';
                                        let isSome = item.statusPlan == 'some';
                                        let isSuccess = item.statusPlan == 'success';
                                        console.log(item.statusPlan)
                                        if (LoopDate == '' || LoopDate != moment(item.apsPlanDate).format('DD/MM/YYYY')) {
                                            LoopDate = moment(item.apsPlanDate).format('DD/MM/YYYY');
                                            isStartDay = true;
                                        } else {
                                            isStartDay = false;
                                        }
                                        let isDay = moment(item.apsPlanDate).format('DD/MM/YYYY') == dtNow.format('DD/MM/YYYY') ? true : false
                                        return (
                                            <>
                                                {
                                                    isStartDay && <tr className={`cursor-pointer select-none`} >
                                                        <td colSpan={6} className='pl-2  bg-black/80 tracking-wide'><strong>{LoopDate}</strong></td>
                                                    </tr>
                                                }
                                                <tr key={index} className={` ${!isDay && 'opacity-40'}  ${isCurrent && ' bg-[#eab308] text-black font-bold'} ${isSome && '  bg-gradient-to-r from-[#49ade7]/50  to-[#49ade7]/10'} ${isSuccess && ' bg-[#5cc873]'} border-b-2 border-black/50`}>
                                                    <td className={`text-center border-r-2 border-black/50`}>{item.apsSeq} </td>
                                                    <td className={`py-[4px] pl-2`}>
                                                        <div className='flex flex-col leading-[16px]'>
                                                            <div className={`flex gap-2 items-center `}>
                                                                <strong>{item.modelCode}</strong>
                                                                {isCurrent && <div className='bg-[#1e1f23] px-2 text-[#eab308] rounded-md shadow-lg backdrop-blur-lg font-semibold leading-none py-[3px]'>
                                                                    กำลังผลิต</div>}
                                                                {isSome && <div className='bg-[#49ade7] text-black/80 rounded-md px-1 shadow-lg backdrop-blur-lg font-semibold leading-none py-[3px]'>
                                                                    ผลิตบางส่วน</div>}
                                                                {isSuccess && <div className='bg-[#1e1f23] text-[#5cc873] rounded-md px-1 shadow-lg backdrop-blur-lg font-semibold leading-none py-[3px]'>
                                                                    ผลิตครบ</div>}
                                                            </div>
                                                            <span className='opacity-70 text-'>{item.partNo.replace('-10','')}</span>
                                                        </div>
                                                    </td>
                                                    <td className='text-center border-l-2 border-black/50'>{item.apsPlanQty}</td>
                                                </tr>
                                            </>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </Spin>
        </div>
    )
}

export default ApsMainSequence