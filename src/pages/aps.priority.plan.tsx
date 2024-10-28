import ApsLoading from "@/components/aps.loading";
import { PropPriorityPlan } from "@/interface/pn.interface";
import { ApiGetPriorityPlan } from "@/service/pn.service";
import {  Button } from "antd";
import moment from "moment"
import { useEffect, useRef, useState } from "react"
import { DownloadOutlined,SearchOutlined} from '@ant-design/icons';
import { DownloadTableExcel } from 'react-export-table-to-excel';
function ApsPriorityPlan() {
    const tbRef = useRef<HTMLTableElement>(null);
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
        } else {
            if (once == false) {
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
        <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <div className="flex gap-3">
                    <DownloadTableExcel
                        filename={`Priority Plan ${ymd}`}
                        sheet="priority plan"
                        currentTableRef={tbRef.current}
                    >
                        <Button type="primary" icon={<DownloadOutlined />} className="w-fit float-right" disabled = {load}>Export to Excel</Button>
                    </DownloadTableExcel>
                    <Button icon = {<SearchOutlined />} onClick={init}>โหลดข้อมูลอีกครั้ง</Button>
                </div>
            </div>
            <table className="w-full " ref={tbRef}>
                <thead className="bg-gray-600/10">
                    <tr>
                        <th colSpan={2} className="border-2 border-[#848484]">Priority Plan</th>
                        <th colSpan={2} className="border-2 border-[#848484] w-[30%]">Update : {dtNow.format('DD/MM/YYYY')}</th>
                        <th colSpan={2} className="border-2 border-[#848484] w-[15%]">ISSUE BY</th>
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
                        <th className='border-2 border-[#848484] w-[8%]'>MODEL CODE</th>
                        <th className='border-2 border-[#848484]  w-[7%]'>PLAN</th>
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
                                <td className="border-2 border-[#848484] text-right pr-1 bg-sky-500/10 font-bold drop-shadow-sm">{oPlan.plan.toLocaleString('en')}</td>
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