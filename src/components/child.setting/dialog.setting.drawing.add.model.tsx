//@ts-nocheck
import { Button, Modal, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { APIGetModels, APIUpdateStatusPartSetIn } from '@/service/aps.service';
import { PropModels } from '@/interface/aps.interface';
import useSelection from 'antd/es/table/hooks/useSelection';
import { useSelector } from 'react-redux';
interface Param {
    open: boolean,
    setOpen: Function,
    load: Function
}
function DialogAddModelToDrawing(props: Param) {
    const redux = useSelector((state: any) => state.reducer);
    const empcode = redux?.empcode || '';
    const { open, setOpen, load } = props;
    const [model, setModel] = useState<string>('');
    const [models, setModels] = useState<PropModels[]>([]);
    useEffect(() => {
        if (open) {
            init();
        }
    }, [])
    const init = async () => {
        let RESGetModels = await APIGetModels();
        setModels(RESGetModels);
    }
    const handleUpdate = async () => {

    }
    return (
        <Modal open={open} onClose={() => setOpen(false)} onCancel={() => setOpen(false)} footer={
            <>
                <Button onClick={() => setOpen(false)}>ปิดหน้าต่าง</Button>
                <Button icon={<PlusOutlined />} disabled={model != ''} onClick={handleUpdate} type='primary'>บันทึก</Button>
            </>
        }>
            <div className='p-6'>
                <div className='flex flex-col gap-3'>
                    <span>เลือกโมเดล</span>
                    <Select showSearch allowClear placeholder="กรุณาเลือกโมเดล" onSearch={(val) => setModel(val)} options={models.map((item, i) => ({ label: item.model, value: item.sebango }))} />
                </div>
            </div>
        </Modal>
    )
}

export default DialogAddModelToDrawing