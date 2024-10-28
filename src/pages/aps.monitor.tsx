//@ts-check
import ApsCurrentMain from '@/aps-components/main/aps-current-main'
import ApsMainSequence from '@/aps-components/main/aps-main-sequence'
import ApsMainStock from '@/aps-components/main/aps-main-stock'
import ApsTableSubline from '@/aps-components/subline/aps-table-subline'
import { bgCard } from '@/constants'
import { PropsMain, PropsWip } from '@/interface/aps.interface'
import { ApiGetMainPlan } from '@/service/aps.service'
import moment from 'moment'
import { useEffect, useState } from 'react'
function ApsMonitor() {
    const [ymd, setYmd] = useState<string>(moment().subtract(8, 'hours').format('YYYYMMDD'));
    const [MainSequence, setMainSequence] = useState<PropsMain[]>([]);
    const [Wips, setWips] = useState<PropsWip[]>([]);
    const [loadMain, setLoadMain] = useState<boolean>(true);
    useEffect(() => {
        init()
    }, [])
    const init = async () => {
        const RESGetApsMainSeq = await ApiGetMainPlan({
            paramDate: ymd,
            paramWCNO: '904'
        });
        setMainSequence(RESGetApsMainSeq.main)
        setWips(RESGetApsMainSeq.wip);
        setLoadMain(false);
    }
    return (
        <div className='flex gap-3 flex-col bg-black pb-3' id='aps-ds'>
            <div className='border-none backdrop-blur-xl h-[50px] flex '>
                <div className='grow flex h-full items-center pl-[18px] pr-[12px]  pt-3 justify-between w-full'>
                    <span className='font-bold uppercase text-white/90'>APS Dashboard</span>
                    <div className={`${bgCard} text-white/90 px-4 py-2 rounded-lg drop-shadow-md`}>
                        <span>{moment().format('DD/MM/YYYY ')}</span>
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-9 gap-3 px-3'>
                <div className='col-span-2'>
                    <ApsMainSequence load={loadMain} MainSequence={MainSequence}  />
                </div>
                <div className='col-span-7 flex flex-col gap-3'>
                    {/* <ApsCurrentMain load={loadMain} Wips={Wips} /> */}
                    <ApsMainStock load={loadMain} Wips={Wips} />
                </div>
            </div>
            <div className='px-3 '>
                <ApsTableSubline load={loadMain} Wips={Wips} MainSequence={MainSequence} />
            </div>
        </div>
    )
}

export default ApsMonitor
