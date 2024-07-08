import moment from 'moment';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { PropsPlanMachine } from '../interface/aps.interface';

export interface ApsPlanMachineDNDParam {
    partGroup: string;
}
const ApsPlanMachineDND = (props: ApsPlanMachineDNDParam) => {
    const { partGroup } = props;
    const [plan, setPlan] = useState<PropsPlanMachine[]>([]);
    const handleOnDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        // const newItems = Array.from(plan);
        // const [reorderedItem] = newItems.splice(result.source.index, 1);
        // newItems.splice(result.destination.index, 0, reorderedItem);
        // setItems(newItems.map((item, index) => ({ ...item, prdSeq: (moment(item.apsPlanDate).format(dateFormat) == dtNow.format(dateFormat) ? index + 1 : item.prdSeq)?.toString() })));
        // setPlan(newItems.map((item, index) => ({ ...item, prdSeq: (moment(item.apsPlanDate).format(dateFormat) == dtNow.format(dateFormat) ? index + 1 : item.prdSeq)?.toString() })))
    };
    useEffect(() => {
        console.log('open')
    }, [])
    // useEffect(() => {
    //     if (items.length > 0) {
    //         // handleUpdatePriority();
    //     }
    // }, [items])

    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId={`droppable-${partGroup}`}>
                {(provided) => (
                    <table  {...provided.droppableProps} ref={provided.innerRef} className={`text-[12px] w-full select-none `}>
                        <thead className='font-semibold '>
                            <tr>
                                <td className='border text-center' rowSpan={2}>Seq.</td>
                                <td className='border text-center' rowSpan={2}>Model</td>
                                <td className='border text-center py-2' colSpan={2}>Plan</td>
                                <td className='border text-center' rowSpan={2}>Result</td>
                                <td className='border text-center' colSpan={2}>Stock</td>
                                <td className='border text-center w-[7.5%]' rowSpan={2}>#</td>
                            </tr>
                            <tr>
                                <td className="border text-center py-2">APS</td>
                                <td className="border text-center">PRD</td>
                                <td className="border text-center">M/C</td>
                                <td className="border text-center">Main</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (plan != null && plan.length) ? plan.map((item: PropsPlanMachine, i: number) => (
                                    <Draggable key={`${item.prdPlanCode}-${item.prdSeq}`} draggableId={`${item.prdPlanCode}-${item.prdSeq}`} index={i}>
                                        {(provided) => (
                                            <tr
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <td className="border text-center py-2 font-semibold">{item.prdSeq}</td>
                                                <td className="border text-center font-semibold">{item.partNo}</td>
                                                <td className="border text-center">{item.apsPlanQty.toLocaleString('en')}</td>
                                                <td className="border text-center">{item.prdPlanQty.toLocaleString('en')}</td>
                                                <td className="border text-center">-</td>
                                                <td className="border text-center">-</td>
                                                <td className="border text-center">{item.stockMain > 0 ? item.stockMain.toLocaleString('en') : '-'}</td>
                                                <td className='border'></td>
                                            </tr>
                                        )}
                                    </Draggable>
                                )) : <tr>
                                    <td className='border py-3 text-center font-semibold' colSpan={8}>ไม่พบข้อมูล</td>
                                </tr>
                            }
                            {provided.placeholder}
                        </tbody>
                    </table>

                )}
            </Droppable>
        </DragDropContext>
    );
};

export default ApsPlanMachineDND;
