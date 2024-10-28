//@ts-check
import { PropModels } from '@/interface/aps.interface';
import { APIGetModels, APIGetDataSublineSetting, APIAddDrawingSubline } from '@/service/aps.service';
import { Alert, Button, Input, Modal, notification, Select, Spin, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { AiOutlineSearch } from "react-icons/ai";
import { AiFillPlusCircle } from "react-icons/ai";
import { useSelector } from 'react-redux';

interface PropDrawing {
    drawing: string;
}
interface PropAddDrawing {
    line: string;
    group: string;
    wcno: string;
    drawing: string;
    model: string[];
    cm: string;
    createBy: string;
}
type NotificationType = 'success' | 'info' | 'warning' | 'error';
function SettingDrawingSubline() {
    const redux = useSelector((state: any) => state.redux);
    const empcode = redux.empcode;
    console.log(redux)
    const [process, setProcess] = useState<string>('machine');
    const [load, setLoad] = useState<boolean>(true);
    const [groups, setGroups] = useState<string[]>([]);
    const [group, setGroup] = useState<string>('');
    const [drawings, setDrawings] = useState<string[]>([]);
    const [defDrawings, setDefDrawings] = useState<string[]>([]);
    const [search, setSearch] = useState<string>('');
    const [openAdd, setOpenAdd] = useState<boolean>(false);
    const [loadAdd, setLoadAdd] = useState<boolean>(false);
    const [dataAdd, setDataAdd] = useState<PropAddDrawing>({ drawing: '', group: group, wcno: '', line: process, model: [], cm: '', createBy: empcode });
    const [error, setError] = useState<boolean>(false);
    const [models, setModels] = useState<PropModels[]>([]);
    const [api, contextHolder] = notification.useNotification();

    const openNotify = (type: NotificationType) => {
        api[type]({
            message: 'แจ้งเตือน',
            description:
                'บันทึกข้อมูลเรียบร้อยแล้ว',
        });
    };
    useEffect(() => {
        init();
    }, []);
    const init = async (newProcess: boolean = false) => {
        // setGroup('')
        let RESGetSublineSetting = await APIGetDataSublineSetting({
            method: "init",
            process: process,
            group: newProcess ? '' : group
        });
        if (newProcess) {
            setGroup('');
        } else {
            setDataAdd({ ...dataAdd, line: process, group: group });
        }
        setGroups(RESGetSublineSetting.groups);
        setLoad(false);
        setDrawings(RESGetSublineSetting.drawing)
        setDefDrawings(RESGetSublineSetting.drawing);
    }
    useEffect(() => {
        if (groups.length > 0 && group == '') {
            setGroup(groups[0] ?? '');
        }
    }, [groups])
    useEffect(() => {
        if (search.trim().length > 0) {
            setDrawings(defDrawings.filter((item: string) => {
                return item.toLowerCase().includes(search.toLowerCase())
            }))
        } else {
            setDrawings(defDrawings);
        }
    }, [search])
    const columns = [
        {
            title: 'Drawing',
            dataIndex: 'drawing',
            key: 'drawing',
        }
    ]
    useEffect(() => {
        if (group != '') {
            init();
        }
    }, [group])
    useEffect(() => {
        if (process != '') {
            setSearch('');
            init(true);
        }
    }, [process])
    const handleAddDrawing = async () => {
        if (dataAdd.drawing == '' || dataAdd.group == '' || dataAdd.wcno == '' || dataAdd.line == '') {
            return;
        }
        setLoadAdd(true);
        await APIAddDrawingSubline(dataAdd);
        openNotify('success');
        setLoadAdd(false);
        setOpenAdd(false);
    }
    useEffect(() => {
        if (dataAdd.model.length == 0 || dataAdd.drawing == '' || dataAdd.group == '' || dataAdd.wcno == '' || dataAdd.line == '') {
            setError(true);
        } else {
            setError(false);
        }
    }, [dataAdd]);
    useEffect(() => {
        if (openAdd == true) {
            loadModels();
        } else {
            setDataAdd({ drawing: '', group: group, wcno: '', line: process, model: [], cm: '', createBy: empcode });
        }
    }, [openAdd])
    const loadModels = async () => {
        let RESGetModels = await APIGetModels();
        setModels(RESGetModels);
    }
    return (
        <>
            <div className='flex flex-col gap-3'>

                <p className='text-xl'>Setting Drawing in subline</p>
                <div id='button-group' className='flex items-center justify-between'>
                    <div className='flex gap-3 items-center'>
                        <div>
                            <span>Line : </span>
                            <Select defaultValue={process} value={process} style={{ width: 120 }} onChange={(e) => setProcess(e)}>
                                <Select.Option value={'machine'}>Machine</Select.Option>
                                <Select.Option value={'casing'}>Casing</Select.Option>
                                <Select.Option value={'motor'}>Motor</Select.Option>
                            </Select>
                        </div>
                        <div>
                            <span>Group : </span>
                            <Select defaultValue={group} style={{ width: 120 }} value={group} onChange={(e) => setGroup(e)} disabled={load}>
                                {
                                    groups.map((item: string, index: number) => {
                                        return <Select.Option key={index} value={item}>{item}</Select.Option>
                                    })
                                }
                            </Select>
                        </div>
                    </div>
                    <Button type='primary' icon={<AiFillPlusCircle />} onClick={() => setOpenAdd(true)}>เพิ่ม Drawing</Button>
                </div>
                <div className='flex w-full items-center justify-end'>
                    <Input prefix={<AiOutlineSearch />} placeholder='ค้นหาตามต้องการ' value={search} onChange={(e) => setSearch(e.target.value)} allowClear />
                </div>
                <div>
                    <Spin spinning={load}>
                        <Table size='small' columns={columns} dataSource={drawings.map((item: string, index: number) => { return { key: index, drawing: item } })} className='border shadow-md' />
                    </Spin>
                </div>
            </div>
            <Modal open={openAdd} title='เพิ่ม Drawing' onCancel={() => setOpenAdd(false)} onClose={() => setOpenAdd(false)} footer={
                <div className='flex items-center gap-2 justify-end'>
                    <Button onClick={() => handleAddDrawing()} type='primary' disabled={loadAdd || error}>บันทึก</Button>
                    <Button onClick={() => setOpenAdd(false)} disabled={loadAdd}>ปิดหน้าต่าง</Button>
                </div>
            }>
                <Spin spinning={loadAdd}>
                    <div className='flex flex-col gap-3'>
                        {contextHolder}
                        <div className='grid grid-cols-3  '>
                            <div className='flex items-center justify-end pr-3'>Line : </div>
                            <div className='col-span-2'>
                                <Select defaultValue={process} value={process} style={{ width: 120 }} onChange={(e) => setProcess(e)}>
                                    <Select.Option value={'machine'}>Machine</Select.Option>
                                    <Select.Option value={'casing'}>Casing</Select.Option>
                                    <Select.Option value={'motor'}>Motor</Select.Option>
                                </Select>
                            </div>
                        </div>
                        <div className='grid grid-cols-3  '>
                            <div className='flex items-center justify-end pr-3'>Group : </div>
                            <div className='col-span-2'>
                                <Select defaultValue={group} style={{ width: 120 }} value={group} onChange={(e) => setGroup(e)} disabled={load}>
                                    {
                                        groups.map((item: string, index: number) => {
                                            return <Select.Option key={index} value={item}>{item}</Select.Option>
                                        })
                                    }
                                </Select>
                            </div>
                        </div>
                        <div className='grid grid-cols-3'>
                            <div className='flex items-center justify-end pr-3'>Model : </div>
                            <div className="col-span-2">
                                <Select
                                    allowClear
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="Please select common model"
                                    onChange={(value) => setDataAdd({ ...dataAdd, model: value })}
                                    value={dataAdd.model}
                                    options={models.map((item: PropModels) => { return { label: item.sebango, value: item.sebango } })}
                                />
                            </div>
                        </div>
                        <div className='grid grid-cols-3  '>
                            <div className='flex items-center justify-end pr-3'>Wcno : </div>
                            <div className='col-span-2'><Input type='number' placeholder='Enter Wcno' onChange={(e) => setDataAdd({ ...dataAdd, wcno: e.target.value })} /></div>
                        </div>
                        <div className='grid grid-cols-3  '>
                            <div className='flex items-center justify-end pr-3'>Drawing : </div>
                            <div className='col-span-2'><Input placeholder='Enter Drawing' onChange={(e) => setDataAdd({ ...dataAdd, drawing: e.target.value })} /></div>
                        </div>
                        <div className='grid grid-cols-3  '>
                            <div className='flex items-center justify-end pr-3'>CM : </div>
                            <div className='col-span-2'><Input placeholder='Enter CM' onChange={(e) => setDataAdd({ ...dataAdd, cm: e.target.value })} /></div>
                        </div>
                        {
                            error && <Alert message="ข้อมูลไม่ครบถ้วน" type="error" showIcon />
                        }
                    </div>
                </Spin>
            </Modal>
        </>
    )
}

export default SettingDrawingSubline