import { Button, Divider, Input, InputRef, Modal, Select, Space, Spin } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import {  PlusOutlined } from '@ant-design/icons';
import { APIGetModels  } from '@/service/aps.service';
interface Param {
    open: boolean,
    setOpen: Function,
    load: Function
}
interface PropItem {
    label: string;
    value: string;
}
function DialogAddModelToDrawing(props: Param) {
    const { open, setOpen } = props;
    const [loadModel, setLoadModel] = useState<boolean>(true);
    const [model, setModel] = useState<string>('');
    const [models, setModels] = useState<PropItem[]>([]);
    const [name, setName] = useState('');
    const inputRef = useRef<InputRef>(null);

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        setModels([...models, { label: name, value: name }]);
        setName('');
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };
    useEffect(() => {
        if (open) {
            init();
        }
    }, [open])

    const init = async () => {
        setLoadModel(true);
        let RESGetModels = await APIGetModels();
        setModels(RESGetModels.map((item) => ({ label: item.model, value: item.model, wcno: '' })));
        setLoadModel(false);
    }
    const handleUpdate = async () => {
        console.log(model)
    }
    return (
        <Modal open={open} onClose={() => setOpen(false)} onCancel={() => setOpen(false)} footer={
            <>
                <Button onClick={() => setOpen(false)}>ปิดหน้าต่าง</Button>
                <Button icon={<PlusOutlined />} disabled={loadModel == true || model == ''} onClick={handleUpdate} type='primary' >บันทึก</Button>
            </>
        }>
            <Spin spinning={loadModel} tip='กำลังโหลดข้อมูล'>
                {
                    model
                }
                <div className='p-6'>
                    <div className='flex flex-col gap-3'>
                        <span>เลือกโมเดล</span>
                        <Select showSearch allowClear placeholder="กรุณาเลือกโมเดล" options={models} onChange={(e) => setModel(e)} dropdownRender={(menu) => (
                            <>
                                {menu}
                                <Divider style={{ margin: '8px 0' }} />
                                <Space style={{ padding: '0 8px 4px' }}>
                                    <Input
                                        placeholder="Please enter item"
                                        ref={inputRef}
                                        value={name}
                                        onChange={onNameChange}
                                        onKeyDown={(e) => e.stopPropagation()}
                                    />
                                    <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                                        เพิ่ม
                                    </Button>
                                </Space>
                            </>
                        )} />
                    </div>
                </div>
            </Spin>
        </Modal>
    )
}

export default DialogAddModelToDrawing