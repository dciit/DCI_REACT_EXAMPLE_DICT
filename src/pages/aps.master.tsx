import { DictMstr } from '@/interface/aps.interface';
import { APIGetDictMstr } from '@/service/aps.service';
import { Button, Input, Modal, Select } from 'antd';
import { useEffect, useState } from 'react'
import { Table } from 'antd';
import { useVT } from 'virtualizedtableforantd4';
function APSMaster() {
    const [vt, _] = useVT(() => ({ scroll: { y: 600 } }), []);
    const [DictMstr, setDictMstrs] = useState<DictMstr[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [filter, setFilter] = useState<any>({});
    useEffect(() => {
        init();
    }, [])
    const init = async () => {
        let RESGetDictMstr = await APIGetDictMstr();
        setDictMstrs(RESGetDictMstr)
    }

    const columns = [
        {
            title: 'DICT_ID',
            dataIndex: 'dictId',
            key: 'dictId',
        },
        {
            title: 'DICT_SYSTEM',
            dataIndex: 'dictSystem',
            key: 'dictSystem',
        },
        {
            title: 'DICT_TYPE',
            dataIndex: 'dictType',
            key: 'dictType',
        },
        {
            title: 'CODE',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'DESCRIPTION',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'REF_CODE',
            dataIndex: 'refCode',
            key: 'refCode',
        },
        {
            title: 'REF1',
            dataIndex: 'ref1',
            key: 'ref1',
        },
        {
            title: 'REF2',
            dataIndex: 'ref2',
            key: 'ref2',
        },
        {
            title: 'REF3',
            dataIndex: 'ref3',
            key: 'ref3',
        },
        {
            title: 'REF4',
            dataIndex: 'ref4',
            key: 'ref4',
        },
        {
            title: 'NOTE',
            dataIndex: 'note',
            key: 'note',
        },
        {
            title: 'CREATE_DATE',
            dataIndex: 'createDate',
            key: 'createDate',
        },
        {
            title: 'UPDATE BY',
            dataIndex: 'updateBy',
            key: 'updateBy',
        },
        {
            title: 'UPDATE DATE',
            dataIndex: 'updateDate',
            key: 'updateDate',
        },
        {
            title: 'DICT_STATUS',
            dataIndex: 'dictStatus',
            key: 'dictStatus',
        }
    ];
    return (
        <div className='flex flex-col gap-3'>
            <div>
                <Button type='primary' onClick={() => setOpen(true)}>เรียกข้อมูล RM_XXXX_XXX</Button>
            </div>
            <div className='bg-white rounded-md border shadow-md p-6 flex items-center gap-3'>
                <div className='flex items-center gap-2'>
                    <div className='flex-none'>DICT TYPE</div>
                    <Select className='w-[200px]' onChange={(e) => setFilter({ ...filter, dictType: e })} showSearch>
                        {
                            [...new Set(DictMstr.map(x => x.dictType))].map((oDictMstr: string, iDictMstr: number) => {
                                return <Select.Option key={iDictMstr} value={oDictMstr}>{oDictMstr}</Select.Option>
                            })
                        }
                    </Select>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='flex-none'>DESCRIPTION</div>
                    <Select className='w-[200px]' onChange={(value) => setFilter({ ...filter, description: value })} showSearch allowClear>
                        {
                            [...new Set(DictMstr.filter(x => x.dictType == filter.dictType).map(x => x.description))].map((item: string, iDictMstr: number) => {
                                return <Select.Option key={iDictMstr} value={item}>{item}</Select.Option>
                            })
                        }
                    </Select>
                </div>
            </div>
            <Table
                size='small'
                scroll={{ y: 600 }} // It's important for using VT!!! DO NOT FORGET!!!
                components={vt}
                columns={columns}
                dataSource={
                    DictMstr.filter(x => x.dictType == filter.dictType && (typeof filter.description != 'undefined' && filter.description != '' ? x.description == filter.description : true)).map((oDictMstr: DictMstr) => ({ ...oDictMstr }))
                }
            />
            <Modal title='เรียกข้อมูล RM_XXXX_XXX' open={open} onCancel={() => setOpen(false)} footer={
                <div className='flex items-center justify-end gap-2'>
                    <Button type='primary'>บันทึก</Button>
                    <Button>ปิดหน้าต่าง</Button>
                </div>
            }>
                <div className='flex flex-col gap-3'>
                    <div className='flex gap-2 items-center'>
                        <div className='flex-none'>PARTNO : </div>
                        <Input type='text' placeholder='Input Partno' />
                        <Button type='primary' >โหลดข้อมูล</Button>
                    </div>
                    <div>
                        <table className='w-full'>
                            <thead>
                                <tr>
                                    <td className='border'>RM</td>
                                    <td className='border'>CM</td>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default APSMaster