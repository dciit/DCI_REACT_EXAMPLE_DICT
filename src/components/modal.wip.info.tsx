//@ts-nocheck
import { APIGetWIPInfo, APIInsertPartSetOut } from '@/service/aps.service';
import { Button, Dropdown, MenuProps, Modal, notification, Space } from 'antd';
import { Typography } from 'antd';
import { AiFillCloseCircle } from "react-icons/ai";
import { AiFillCheckCircle } from "react-icons/ai";
import { AiOutlineMore } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineCloudDownload } from "react-icons/ai";

import React, { useEffect } from 'react'
import { DictMstr } from '@/interface/aps.interface';
type NotificationType = 'success' | 'info' | 'warning' | 'error';
interface Props {
    open: boolean;
    setWIPInfo: Function;
    WIPInfo: string;
}
interface PropPartSetOut {
    sebango: string;
    model: string;
    wcno: string;
    partno: string;
    cm: string;
    partname: string;
    partgroup: string;
    active: string;
    match?: boolean;
    load?: boolean;
    tsa: boolean;
    aps: boolean;
}
interface PropWIPGroup {
    code: string;
    name: string;
}
interface PropProcessOfLine {
    process: string;
    line: string;
}
interface PropWIPInfo {
    partNo: string;
    cm: string;
    partSetOut: PropPartSetOut[];
    partSetOutLocal: DictMstr[];
    wipGroup: PropWIPGroup[];
    processOfLine: PropProcessOfLine[];
}
const { Paragraph } = Typography;
function ModalWIPInfo(props: Props) {
    const { WIPInfo, open, setWIPInfo } = props;
    const [api, contextHolder] = notification.useNotification();
    const menus = [
        { key: 'PART_SET_OUT', text: 'PART_SET_OUT' }, { key: 'PART_SET_IN', text: 'PART_SET_IN_%' }
    ]
    const openNotificationWithIcon = (type: NotificationType, msg: string) => {
        api[type]({
            message: 'แจ้งเตือน',
            description: msg
        });
    };
    const [WIPInfos, setWIPInfos] = React.useState<PropWIPInfo>({
        partSetOut: [],
        wipGroup: [],
        cm: '',
        partNo: WIPInfo,
        partSetOutLocal: [],
        processOfLine: []
    });
    useEffect(() => {
        if (open == true) {
            loadData();
        }
    }, [open]);
    const loadData = async () => {
        let RESGetWIPInfo = await APIGetWIPInfo(WIPInfo);
        console.log(RESGetWIPInfo)
        setWIPInfos(RESGetWIPInfo);
    }
    const handleInsertPartSetOut = async (partSetOut: PropPartSetOut, index: number) => {
        let RESInsertPartSetOut = await APIInsertPartSetOut(partSetOut);
        try {
            if (RESInsertPartSetOut.status == true) {
                openNotificationWithIcon('success', 'บันทึกข้อมูลสำเร็จ');
            } else {
                openNotificationWithIcon('success', `บันทึกข้อมูลไม่สำเร็จ เนื่องจาก ${RESInsertPartSetOut.message}`);
            }
        } catch (e: Error | any) {
            alert(`บันทึกข้อมูลไม่สำเร็จ เนื่องจาก : ${e.message}`);
        }
        await loadData();
    }
    const items: MenuProps['items'] = [
        {
            label: <span>เรียกข้อมูล</span>,
            key: '0',
            icon: <AiOutlineCloudDownload size={18} />
        },
        {
            type: 'divider',
        },
        {
            label: <span>ยกเลิกใช้งาน</span>,
            key: '3',
            icon: <AiOutlineClose size={18} />
        },
    ];

    return (
        <Modal width={800} title={`รายละเอียด #${WIPInfo}`} open={open} onCancel={() => setWIPInfo('')} onClose={() => setWIPInfo('')} footer={
            <div className='flex items-end'>
                <Button onClick={() => setWIPInfo('')}>ปิดหน้าต่าง</Button>
            </div>
        }>
            <div>
                {
                    contextHolder
                }
                <div id='tabs' className='flex flex-col gap-2'>
                    <div className='p-3 border rounded-md border-[#ddd] flex gap-2'>
                        <strong className='opacity-65'>WC MASTER  </strong>
                        <Paragraph strong={true} copyable={{ text: WIPInfo }} style={{ margin: 0 }} >#{WIPInfo} <span className='text-sky-500'>{WIPInfos.cm}</span></Paragraph>
                    </div>
                    <div className='p-3 border rounded-md border-[#ddd] flex flex-col gap-2'>
                        <strong className='opacity-65'>PART_SET_OUT</strong>
                        <table className='w-full shadow-md'>
                            {/* <thead>
                                <tr>
                                    <th colSpan={8} className='border text-start pl-2 py-1'> TSA Information </th>
                                </tr>
                                <tr>
                                    <th className='border py-1' colSpan={6}>DCI</th>
                                    <th className='border' colSpan={2}>ALPHA</th>
                                </tr>
                                <tr>
                                    <th className='border rounded-md border-[#ddd] text-center py-1'>WCNO</th>
                                    <th className='border rounded-md border-[#ddd] text-center'>SEBANGO</th>
                                    <th className='border rounded-md border-[#ddd] text-center'>MODEL</th>
                                    <th className='border rounded-md border-[#ddd] text-center'>PARTNO</th>
                                    <th className='border rounded-md border-[#ddd] text-center'>PARTGROUP</th>
                                    <th className='border rounded-md border-[#ddd] text-center'>ACTIVE</th>
                                    <th className='border rounded-md border-[#ddd] text-center'>MATCH</th>
                                    <th className='border '>#</th>
                                </tr>
                            </thead> */}
                            <tbody>
                                {/* {
                                    WIPInfos.partSetOut.map((partSetOut: PropPartSetOut, i: number) => {
                                        return (
                                            <tr key={i} className={` ${partSetOut.match == false && 'text-red-500 font-bold bg-red-50'}`}>
                                                <td className='border rounded-md border-[#ddd] text-center align-top'>{partSetOut.wcno}</td>
                                                <td className='border rounded-md border-[#ddd] text-center align-top'>{partSetOut.sebango}</td>
                                                <td className={`border rounded-md border-[#ddd] align-top pl-2`}>{partSetOut.model}</td>
                                                <td className='border rounded-md border-[#ddd] px-2 py-1'>
                                                    <div className='flex flex-col leading-none gap-1'>
                                                        <div className='flex items-center gap-1'>
                                                            <span className='font-semibold text-black/75'>{partSetOut.partno}</span>
                                                            <span className={`font-semibold text-sky-500`}>{WIPInfos.cm}</span>
                                                        </div>
                                                        <strong>{partSetOut.partname}</strong>
                                                    </div>
                                                </td>
                                                <td className='border rounded-md border-[#ddd]'>
                                                    <Select allowClear onClear={() => {
                                                        var o = partSetOut;
                                                        o.partgroup = '';
                                                        var clone = WIPInfos.partSetOut;
                                                        clone[i] = o;
                                                        setWIPInfos({ ...WIPInfos, partSetOut: clone });
                                                    }} className='w-full' size='small' value={partSetOut.partgroup} onChange={(value) => setWIPInfos({ ...WIPInfos, partSetOut: [...WIPInfos.partSetOut.slice(0, i), { ...partSetOut, partgroup: value }, ...WIPInfos.partSetOut.slice(i + 1)] })}>
                                                        {
                                                            WIPInfos.wipGroup.map((wipGroup: PropWIPGroup, i: number) => {
                                                                return (
                                                                    <Select.Option key={i} value={wipGroup.code}>{wipGroup.name}</Select.Option>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                </td>
                                                <td className='border rounded-md border-[#ddd] align-top'>{partSetOut.active}</td>
                                                <td className='border align-middle'>
                                                    <div className='flex items-center justify-center'>
                                                        {
                                                            partSetOut.match ? <AiFillCheckCircle className='text-green-600' size={25} /> : <AiFillCloseCircle className='text-red-600' size={25} />
                                                        }

                                                    </div>
                                                </td>
                                                <td className='border'><Button disabled={(typeof partSetOut.partgroup == 'undefined' || partSetOut.partgroup == '' || partSetOut.match) ? true : false} size='small' icon={<AiOutlineCloudDownload />} type='primary' onClick={() => handleInsertPartSetOut(partSetOut, i)}>โหลดข้อมูล</Button></td>
                                            </tr>
                                        )
                                    })
                                } */}
                                {/* {
                                    (WIPInfos.partSetOut.length > 0 && WIPInfos.partSetOutLocal.length > 0) && <tr>
                                        <td colSpan={8} className='border bg-white'>&nbsp;</td>
                                    </tr>
                                }
                                {
                                    WIPInfos.partSetOutLocal.length && <tr>
                                        <td colSpan={8} className='text-start pl-2 font-bold py-1 border'>APS Information</td>
                                    </tr>
                                } */}

                                {
                                    WIPInfos.partSetOut.length && <tr>
                                        <th className='border rounded-md border-[#ddd] text-center py-1' rowSpan={2}>WCNO</th>
                                        <th className='border rounded-md border-[#ddd] text-center' rowSpan={2}>MODEL</th>
                                        <th className='border px-2'>ALPHA (TSA)</th>
                                        <th className='border rounded-md border-[#ddd] text-center py-1 px-2' colSpan={2}>APS (MASTER)</th>
                                        <th className='border px-6' rowSpan={2}>#</th>
                                    </tr>
                                }
                                {
                                    WIPInfos.partSetOut.length && <tr>
                                        <th className='border rounded-md border-[#ddd] text-center'>ใช้งาน</th>
                                        <th className='border rounded-md border-[#ddd] text-center'>มีข้อมูล</th>
                                        <th className='border rounded-md border-[#ddd] text-center'>ใช้งาน</th>
                                    </tr>
                                }
                                {
                                    WIPInfos.partSetOut.map((partSetOutLocal: PropPartSetOut, i: number) => {
                                        var tsa = partSetOutLocal.tsa;
                                        var aps = partSetOutLocal.aps;
                                        return <tr key={i}>
                                            <td className={`border text-center align-top `}>{partSetOutLocal.wcno}</td>
                                            <td className={`border p-1 align-top font-bold `}>
                                                <div className='flex w-full justify-center flex-col leading-none gap-1'>
                                                    <span>{partSetOutLocal.model}</span>
                                                    <span className='opacity-75'>{partSetOutLocal.sebango}</span>
                                                </div>
                                            </td>
                                            <td className='border text-center'>
                                                <div className='w-full flex items-center justify-center'>
                                                    {
                                                        tsa == true ? <AiFillCheckCircle className='text-green-600' size={25} /> : <AiFillCloseCircle className='text-red-600' size={25} />
                                                    }
                                                </div>
                                            </td>
                                            <td className='border text-center'>
                                                <div className='w-full flex items-center justify-center'>
                                                    {
                                                        aps == true ? <AiFillCheckCircle className='text-green-600' size={25} /> : <AiFillCloseCircle className='text-red-600' size={25} />
                                                    }
                                                </div>
                                            </td>
                                            <td className={`border`}>
                                                <div className='flex items-center justify-center w-full'>
                                                    {
                                                        aps == true ? <AiFillCheckCircle className='text-green-600' size={25} /> : <AiFillCloseCircle className='text-red-600' size={25} />
                                                    }
                                                </div>
                                            </td>
                                            <td className='border text-center'>
                                                <Dropdown menu={{
                                                    items: [
                                                        {
                                                            label: <span>เรียกข้อมูล</span>,
                                                            key: '0',
                                                            icon: <AiOutlineCloudDownload size={18} />,
                                                            disabled: ((partSetOutLocal.tsa && partSetOutLocal.aps) || partSetOutLocal.tsa == false) ? true : false
                                                        },
                                                        {
                                                            type: 'divider',
                                                        },
                                                        {
                                                            label: <span>ยกเลิกใช้งาน (APS)</span>,
                                                            key: '3',
                                                            icon: <AiOutlineClose size={18} />,
                                                            disabled: partSetOutLocal.aps == false ? true : false
                                                        },
                                                    ]
                                                }} trigger={['click']}>
                                                    <a onClick={(e) => e.preventDefault()}>
                                                        <Space>
                                                            <AiOutlineMore size={20} />
                                                        </Space>
                                                    </a>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className='p-3 border rounded-md border-[#ddd] flex flex-col gap-2'>
                        <strong className='opacity-65'>PART_SET_IN_</strong>
                    </div>
                    {/* <Tabs
                        defaultActiveKey="1"
                        type="card"
                        items={menus.map((o, i) => {
                            const id = String(i + 1);
                            return {
                                label: `${o.text}`,
                                key: id,
                                children: `Content of card tab ${id}`,
                            };
                        })}
                    /> */}
                </div>
            </div>
        </Modal>
    )
}

export default ModalWIPInfo