import moment from 'moment';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { contact, dateFormat } from '../constants';
import { ApsProductionPlanProps } from '../interface/aps.interface';
import { API_CHANGE_PRIORITY } from '../service/aps.service';

export interface ApsDNDProps {
    plan: ApsProductionPlanProps[];
    close: boolean;
    setPlan: any;
    planEdit: ApsProductionPlanProps | null;
    setPlanEdit: any;
}
const ApsDND = (props: ApsDNDProps) => {
    let dtNow: any = moment();
    const { plan, close, setPlan, planEdit, setPlanEdit } = props;
    const [items, setItems] = useState<ApsProductionPlanProps[]>(plan.filter((o: ApsProductionPlanProps) => moment(o.apsPlanDate).format(dateFormat) == dtNow.format(dateFormat)));
    const handleOnDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const newItems = Array.from(plan);
        const [reorderedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, reorderedItem);
        setItems(newItems.map((item, index) => ({ ...item, prdSeq: (moment(item.apsPlanDate).format(dateFormat) == dtNow.format(dateFormat) ? index + 1 : item.prdSeq)?.toString() })));
        setPlan(newItems.map((item, index) => ({ ...item, prdSeq: (moment(item.apsPlanDate).format(dateFormat) == dtNow.format(dateFormat) ? index + 1 : item.prdSeq)?.toString() })))
    };
    useEffect(() => {
        if (items.length > 0) {
            handleUpdatePriority();
        }
    }, [items])

    useEffect(() => {
        setDND();
    }, [plan])

    const setDND = () => {
        const newItems = Array.from(plan);
        setItems(newItems.map((item, index) => ({ ...item, prdSeq: (moment(item.apsPlanDate).format(dateFormat) == dtNow.format(dateFormat) ? index + 1 : item.prdSeq)?.toString() })));
    }

    const handleUpdatePriority = async () => {
        if (items.length) {
            let resChange = await API_CHANGE_PRIORITY(items.filter((o: ApsProductionPlanProps) => moment(o.apsPlanDate).format(dateFormat) == dtNow.format(dateFormat)));
            if (resChange.status == true) {
                //TODO: create notify
            } else {
                alert(`เกิดข้อมูลพลาดระหว่างบันทึกข้อมูล [APS001] ${contact}`)
            }
        }
    }

    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="droppable">
                {(provided) => (
                    <table {...provided.droppableProps} ref={provided.innerRef} className=' select-none'>
                        <thead>
                            <tr className='bg-[#5c5fc8] text-white'>
                                <td className='border text-center'>ลำดับ</td>
                                <td className='border text-center'>Model</td>
                                <td className='border text-center'>Aps Qty</td>
                                <td className='border text-center'>Prd Qty</td>
                                <td className='border text-center'>#</td>
                            </tr>
                        </thead>
                        <tbody>
                            {items.filter((o: ApsProductionPlanProps) => moment(o.apsPlanDate).format(dateFormat) == dtNow.format(dateFormat)).map((item: ApsProductionPlanProps, index) => (
                                <Draggable key={item.prdSeq} draggableId={typeof item.prdSeq != 'undefined' ? item.prdSeq.toString() : ''} index={index}>
                                    {(provided) => (
                                        <tr
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <td className='py-2 border border-[#5c5fc880] text-center font-semibold'>{item.prdSeq}</td>
                                            <td className='border border-[#5c5fc880] text-center text-[#5c5fc8] font-bold'>{item.partNo}</td>
                                            <td className='border border-[#5c5fc880] text-center font-semibold'>{item.apsPlanQty}</td>
                                            <td className='border border-[#5c5fc880] text-[#5c5fc8] '>
                                                <div className='flex items-center justify-center'>
                                                    <div className='border-dashed border-2 rounded-lg w-fit px-[8px] border-[#4caf50] text-[#3f9642] font-bold bg-green-50'>
                                                        {item.prdPlanQty}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='border border-[#5c5fc880] text-center text-[#5c5fc8] '  >
                                                <div className='flex items-center justify-center'>
                                                    <div className='border opacity-80 hover:opacity-100 transition-all duration-100 border-[#5c5fc8] bg-[#5c5fc8] text-white rounded-xl px-3 w-fit shadow-lg' onClick={() => setPlanEdit(item)}>แก้ไขข้อมูล</div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </tbody>
                    </table>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default ApsDND;
