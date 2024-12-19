import { PropItemHistoryMainPlan, PropHistoryMainPlan, PropHeaderHistoryMainPlan } from '@/interface/aps.interface';
import { APIAPSGetHistoryMainPlan } from '@/service/aps.service';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Descriptions, Input, Modal, Spin } from 'antd'
import moment from 'moment';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

function MainHistory() {
    const redux = useSelector((state: any) => state.redux);
    const plant = typeof redux.plant != 'undefined' ? redux.plant : '';
    const [ymd, setYmd] = useState<string>(moment().subtract(8, 'hours').format('YYYYMMDD'));
    const [OpenModel, setOpenModel] = useState<boolean>(false);
    const [HistoryDatas, setHistoryDatas] = useState<PropHistoryMainPlan>({ data: [], header: [] });
    const [Load, setLoad] = useState<boolean>(false);
    const init = async () => {
        setLoad(true);
        let RES = await APIAPSGetHistoryMainPlan(plant, ymd);
        console.log(RES)
        setHistoryDatas(RES);
        setLoad(false);
    }
    useEffect(() => {
        if (OpenModel == false) {
            init();
        }
    }, [OpenModel])
    return (
        <div className='border pt-[16px] pb-[16px] px-[16px] rounded-[8px] gap-[16px] flex flex-col'>
            <strong>ประวัติการผลิต (Production History)</strong>
            <div className='flex items-end w-full gap-[16px]'>
                <div className='flex items-center gap-1 cursor-pointer select-none text-nowrap '>
                    {/* <MdOutlineFilterAlt />
                    <span className='tracking-wide'>Filter</span> */}
                    <span>วันที่ : </span>
                    <Input type='date' value={moment(ymd, 'YYYYMMDD').format('YYYY-MM-DD')} onChange={(e) => setYmd(moment(e.target.value).format('YYYYMMDD'))} />
                </div>
                <Button type='primary' icon={<SearchOutlined />} onClick={() => init()}>ค้นหา</Button>
            </div>

            <div className='overflow-x-auto'>
                <Spin spinning={Load} tip="กําลังโหลดข้อมูล...">
                    <table className='w-[100%] border-collapse '>
                        <thead className='bg-[#fafafb] drop-shadow-sm text-sm'>
                            <tr>
                                <th className='border w-8' rowSpan={2} >Seq.</th>
                                <th className='border w-16' rowSpan={2}>Sebango</th>
                                <th className='border w-40 ' rowSpan={2}>Model</th>
                                <th className='border w-16' rowSpan={2}>Result</th>
                                <th className='border w-16' rowSpan={2}>Time</th>
                                {
                                    Array.from(new Set([...HistoryDatas.header.map(x => x.LINE_TXT)])).map((h: string, iH: number) => {
                                        return <th key={iH} className='border text-center w-16' colSpan={2}>{h}</th>
                                    })
                                }
                            </tr>
                            <tr>
                                {
                                    Array.from(new Set([...HistoryDatas.header])).map((h: PropHeaderHistoryMainPlan, iH: number) => {
                                        return <th key={iH} className='border text-center w-8'>{h.PROCESS_TXT}</th>
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                HistoryDatas.data.length > 0 ? HistoryDatas.data.map((o: PropItemHistoryMainPlan, i: number) => {
                                    return <tr key={i}>
                                        <td className='border text-center font-semibold bg-[#fafafb]'>{o.APS_SEQ}</td>
                                        <td className='border text-center bg-[#fafafb]'>{o.MODELCODE}</td>
                                        <td className='border text-start pl-2 font-semibold bg-[#fafafb]'>{o.MODELNAME}</td>
                                        <td className='border text-end pr-1 font-bold text-green-600 bg-green-500/10'>{o.APS_RESULT}</td>
                                        <td className='border text-center bg-[#fafafb] font-semibold text-nowrap'>{o.TIME}</td>
                                        {
                                            Array.from(new Set([...HistoryDatas.header])).map((h: PropHeaderHistoryMainPlan, iH: number) => {
                                                var colWarning = '';
                                                var colVal = 0;
                                                try {
                                                    colVal = Number(o[h.COLUMN_NAME]);
                                                    if (colVal < 0) {
                                                        colWarning = 'bg-red-400/50 text-red-600 font-bold';
                                                    }
                                                } catch (e: Error | any) {
                                                    colWarning = '';
                                                }
                                                return <td className={`border text-end pr-1 ${colWarning}`} key={iH}>{colVal.toLocaleString('en')}</td>
                                            })
                                        }

                                    </tr>
                                }) : (
                                    <tr>
                                        <td colSpan={(5 + (HistoryDatas.header.length))} className='text-center border font-semibold py-2 text-red-500 bg-red-50'>ไม่พบข้อมูล</td>
                                    </tr>
                                )
                            }
                            {
                                HistoryDatas.data.length > 0 && <tr className='bg-[#fafafa] select-none'>
                                    <td className='text-end pr-2 border py-3 font-bold tracking-wider' colSpan={3}>Total Result : </td>
                                    <td className='text-end pr-2 border font-semibold text-md'>{HistoryDatas.data.reduce((a: number, b: PropItemHistoryMainPlan) => a + Number(b.APS_RESULT), 0).toLocaleString('en')}</td>
                                    <td className='text-end pr-2 border' colSpan={1 + (HistoryDatas.header.length)}></td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </Spin>
            </div>
            <Modal open={OpenModel} onCancel={() => setOpenModel(false)} onClose={() => setOpenModel(false)} footer={
                <div className='flex items-center justify-end gap-2'>
                    <Button onClick={() => setOpenModel(false)}>ปิดหน้าต่าง</Button>
                    <Button type='primary' onClick={() => setOpenModel(false)} >ค้นหา</Button>
                </div>
            }>
                <Descriptions title="Basic Information" bordered>
                    <Descriptions.Item label="วันที่">
                        <Input type='date' value={ymd} onChange={(e) => setYmd(e.target.value)} />
                    </Descriptions.Item>
                </Descriptions>
            </Modal>
        </div>
    )
}

export default MainHistory
