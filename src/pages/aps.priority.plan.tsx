import ApsLoading from "@/components/aps.loading";
import { PropPriorityPlan } from "@/interface/pn.interface";
import { ApiGetPriorityPlan } from "@/service/pn.service";
import moment from "moment"
import { useEffect, useState } from "react"

function ApsPriorityPlan() {
    const dtNow = moment();
    const [once] = useState<boolean>(true);
    const [ymd] = useState<string>(dtNow.format('YYYYMMDD'));
    const [plans, setPlans] = useState<PropPriorityPlan[]>([]);
    const [load, setLoad] = useState<boolean>(true);
    useEffect(() => {
        init();
    }, [])
    useEffect(() => {
        if (plans.length > 0) {
            setLoad(false);
        }else{
            if(once == false){
                setLoad(false);
            }
        }
    }, [plans])
    const init = async () => {
        setLoad(true);
        let ResGetPriorityPlan = await ApiGetPriorityPlan({ ymd: ymd });
        setPlans(ResGetPriorityPlan);
    }
    return (
        <div>
            <table className="w-full ">
                <thead className="bg-gray-600/10">
                    <tr>
                        <th colSpan={2} className="border-2 border-[#848484]">Priority Plan</th>
                        <th colSpan={2} className="border-2 border-[#848484]">Update : XXXXXXX</th>
                        <th colSpan={2} className="border-2 border-[#848484]">ISSUE BY</th>
                        <th colSpan={2} className="border-2 border-[#848484]">CHECKED BY</th>
                        <th className="border-2 border-[#848484]">APPROVED BY</th>
                    </tr>
                    <tr>
                        <th colSpan={2} className="border-2 border-[#848484]">SCR</th>
                        <th colSpan={2} className="border-2 border-[#848484]">DD/MM/YYYY HH:mm</th>
                        <th colSpan={2} className="border-2 border-[#848484]"></th>
                        <th colSpan={2} className="border-2 border-[#848484]"></th>
                        <th className="border-2 border-[#848484]"></th>
                    </tr>
                    <tr>
                        <th className='border-2 border-[#848484]'>DATE</th>
                        <th className='border-2 border-[#848484]'>WCNO</th>
                        <th className='border-2 border-[#848484]'>SUBLINE</th>
                        <th className='border-2 border-[#848484]'>MODEL</th>
                        <th className='border-2 border-[#848484]'>MODEL CODE</th>
                        <th className='border-2 border-[#848484]'>PLAN</th>
                        <th className='border-2 border-[#848484]'>PACKING</th>
                        <th className='border-2 border-[#848484]'>PALLET QTY</th>
                        <th className='border-2 border-[#848484]'>REMARK</th>
                    </tr>
                </thead>
                <tbody className="text-black">
                    {
                        load == true ? <tr><td colSpan={9} className="text-center border-2 border-[#848484]"><ApsLoading message="กำลังโหลดข้อมูล" /></td></tr> : plans.map((oPlan: PropPriorityPlan, iPlan: number) => {
                            return <tr key={iPlan}>
                                <td className="border-2 border-[#848484] text-center">{oPlan.date}</td>
                                <td className="border-2 border-[#848484] text-center">{oPlan.wcno}</td>
                                <td className="border-2 border-[#848484] pl-3">{oPlan.subLine}</td>
                                <td className="border-2 border-[#848484] pl-3">{oPlan.model}</td>
                                <td className="border-2 border-[#848484] text-center">{oPlan.modelCode}</td>
                                <td className="border-2 border-[#848484] text-right pr-1">{oPlan.plan.toLocaleString('en')}</td>
                                <td className="border-2 border-[#848484] pl-3">{oPlan.packing}</td>
                                <td className="border-2 border-[#848484] text-right pr-1">{oPlan.palletQty}</td>
                                <td className="border-2 border-[#848484]"></td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default ApsPriorityPlan