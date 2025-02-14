import ApsLoading from "@/components/aps.loading";
import { Button, DatePicker, Result } from "antd";
import moment from "moment"
import { useEffect, useRef, useState } from "react"
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import { APIGetPriorityPlan } from "@/service/aps.service";
import { PropAxios } from "@/interface/aps.interface";
import dayjs from "dayjs";
interface PropPriorityPlan {
    data: PropItem[];
    status: boolean;
    message: string;
}
interface PropItem {
    plan_create: string;
    plan_seq: number;
    plan_date: Date;
    plan_model: string;
    plan_qty: number;
}
function ApsPriorityPlan() {
    const dateFormat = 'YYYY/MM/DD';
    const tbRef = useRef<HTMLTableElement>(null);
    const dtNow = moment();
    const [Datas, setDatas] = useState<PropAxios>({
        data: '',
        status: false
    });
    const [once] = useState<boolean>(true);
    const [ymd] = useState<string>(dtNow.format('YYYYMMDD'));
    const [plans] = useState<PropPriorityPlan[]>([]);
    const [load, setLoad] = useState<boolean>(true);
    const [DateStart, setDateStart] = useState<string>(moment().format('YYYY/MM/DD'));
    const [DateEnd, setDateEnd] = useState<string>(moment().add(13, 'days').format('YYYY/MM/DD'));
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
        let RESGetPriorityPlan = await APIGetPriorityPlan({ startDate: DateStart, endDate: DateEnd });
        if (RESGetPriorityPlan.status) {
            setDatas(RESGetPriorityPlan);
            setLoad(false);
        } else {
            setLoad(false);
        }
    }
    return (
        <div className="flex flex-col gap-3 px-[1.75rem]" >
            <div className="flex justify-between items-center mb-1">
                <div className="flex flex-col gap-3">
                    <strong>ค้นหาข้อมูล</strong>
                    <div className="flex gap-3 items-center">
                        <span>วันที่</span>     <DatePicker allowClear={false} onChange={(e) => setDateStart(dayjs(e).format(dateFormat))} value={dayjs(DateStart, dateFormat)} format={dateFormat} /> <span>ถึง</span>  <DatePicker allowClear={false} onChange={(e) => setDateEnd(dayjs(e).format(dateFormat))} value={dayjs(DateEnd, dateFormat)} format={dateFormat} />
                        <Button type='primary' icon={<SearchOutlined />} onClick={init}>ค้นหา</Button>
                    </div>
                </div>
                <div className="flex gap-3">
                    <DownloadTableExcel
                        filename={`Priority Plan ${ymd}`}
                        sheet="priority plan"
                        currentTableRef={tbRef.current}
                    >
                        <Button type="primary" icon={<DownloadOutlined />} className="w-fit float-right" disabled={load}>Export to Excel</Button>
                    </DownloadTableExcel>
                    <Button icon={<SearchOutlined />} onClick={init}>โหลดข้อมูลอีกครั้ง</Button>
                </div>
            </div>
            <div className="overflow-auto h-[500px]">
                {
                    (!load && Datas.status == false) ? <Result
                        status="warning"
                        title={`เกิดข้อผิดพลาดกับการโหลดข้อมูล เนื่องจาก ${Datas.data}`}
                        extra={
                            <Button type="primary" key="console" onClick={init}>
                                โหลดข้อมูลอีกครั้ง
                            </Button>
                        }
                    /> : <table className="w-full" id="tb-priority-plan" ref={tbRef}>
                        {/* <thead className="bg-gray-600/10">
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
                    </thead> */}
                        <thead>
                            <tr>
                                <th>ลำดับการผลิต</th>
                                <th>วันที่ผลิต</th>
                                <th>ผลิตภัณฑ์</th>
                                <th>จำนวนการผลิต</th>
                            </tr>
                        </thead>
                        <tbody className="text-black">
                            {
                                load == true ? <tr><td colSpan={9} className="text-center border"><ApsLoading message="กำลังโหลดข้อมูล" /></td></tr> : Datas.data.data.map((oPlan: PropItem, iPlan: number) => {
                                    var strDate: string = moment(oPlan.plan_date, 'YYYYMMDD').format('DD/MM/YYYY');
                                    return <tr key={iPlan} >
                                        <td className="text-center">{oPlan.plan_seq}</td>
                                        <td className="text-center">{strDate}</td>
                                        <td>{oPlan.plan_model}</td>
                                        <td>{oPlan.plan_qty.toLocaleString('en')}</td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                }
            </div>


        </div>
    )
}

export default ApsPriorityPlan