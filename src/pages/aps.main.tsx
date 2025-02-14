import { Button, Card, Col, Flex, Row, Tabs } from 'antd';
import PropaneTankIcon from '@mui/icons-material/PropaneTank';
import Gastight from '@/components/aps.gastight';
import MainPlan from '@/components/aps.main.wip';
import TabPane from 'antd/es/tabs/TabPane';
import AssistantIcon from '@mui/icons-material/Assistant';
import CategoryIcon from '@mui/icons-material/Category';
import ApsPriorityPlan from './aps.priority.plan';
import Meta from 'antd/es/card/Meta';
import { useEffect, useState } from 'react';
import { LiaDoorOpenSolid } from "react-icons/lia";
import { TbLock } from "react-icons/tb";
import { useDispatch, useSelector } from 'react-redux';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import TagScanCompare from '@/components/aps.tagscan';
import MainHistory from '@/components/main.history';
import { LuHistory } from "react-icons/lu";

export interface lineProps {
    text: string;
    value: string;
    icon?: any;
    iconBg?: string;
    iconColor?: string;
}
export interface PropsWip {
    time: string;
    modelcode: string;
    modelname: string;
    plan: number;
    status: string;
    seq: number;
    type: string;
}
export interface PropsWipSelected {
    group: string;
    wip: PropsWip;
    line: string;
    type: string;
}
interface PropSelectPlan {
    code: string;
    text: string;
    icon: any,
    desc: string;
    iconDisabled: any;
    enable: boolean;
}

function ApsMain() {
    const redux = useSelector((state: any) => state.redux);
    const dispatch = useDispatch();
    const [CodePlan, setCodePlan] = useState<string>('');
    useEffect(() => {
        initPlan();
    }, [])
    const initPlan = async () => {
        // let RES
    }
    const handleSelectPlan = async () => {
        console.log(CodePlan)
        dispatch({ type: 'SET_PLANT', payload: CodePlan });
    }
    return (
        <div>
            {
                (typeof redux.filter?.plant != 'undefined' && redux.filter?.plant != '') ? <Tabs defaultActiveKey="1">
                    <TabPane tab={<div className='flex items-center gap-2 pr-3  '><AssistantIcon /><span>Main Sequence</span></div>} key="1">
                        <MainPlan />
                    </TabPane>
                    <TabPane tab={<div className='flex items-center gap-2 pr-10'><PropaneTankIcon /><span>Gastight</span></div>} key="2">
                        <Gastight />
                    </TabPane>
                    <TabPane tab={<div className='flex items-center gap-2 pr-10'><CategoryIcon /><span>Priority Plan</span></div>} key="3">
                        <ApsPriorityPlan />
                    </TabPane>
                    <TabPane tab={<div className='flex items-center gap-2 pr-10'><QrCodeScannerIcon /><span>Tag Scan Compare</span></div>} key="4">
                        <TagScanCompare />
                    </TabPane>
                    <TabPane tab={<div className='flex items-center gap-2 pr-10'><LuHistory /><span>History</span></div>} key="5">
                        <MainHistory />
                    </TabPane>
                </Tabs> : <Flex gap="middle" align='center' vertical>
                    <div className='flex flex-col items-center gap-2 py-2'>
                        <strong className='text-3xl tracking-wider'>Plant Select Plant !</strong>
                        <small>Please select the area where you want to use the system.</small>
                    </div>
                    <Row gutter={[16, 16]} >
                        {
                            [
                                { code: 'SCR', text: 'SCR', icon: 'SCR', desc: 'SCROLL', iconDisabled: <TbLock />, enable: true },
                                { code: 'YC', text: 'YC', icon: 'YC', desc: '1YC, 2YC', iconDisabled: <TbLock />, enable: false },
                                { code: 'ODM', text: 'ODM', icon: 'ODM', desc: 'ODM', iconDisabled: <TbLock />, enable: false }
                            ].map((oLine: PropSelectPlan, idx: number) => {
                                return (
                                    <Col>
                                        <Card
                                            key={idx}
                                            className={` ${CodePlan === oLine.code ? 'border-2  border-[#1677ff] bg-[#1677ff]/10' : 'opacity-100'} cursor-pointer ${oLine.enable == true && ' hover:shadow-md'} transition-all duration-100 select-none h-[250px] min-w-[150px]`}
                                            onClick={() => oLine.enable == true && setCodePlan(oLine.code)}
                                        >
                                            <Meta title={<span className={`${CodePlan === oLine.code && 'text-[#1677ff]'}`}>{oLine.text}</span>} description={<div className='flex flex-col'>
                                                <span>{oLine.desc}</span>
                                                {
                                                    oLine.enable == false && <small className='text-red-500/50'>ยังไม่เปิดให้ใช้งาน</small>
                                                }
                                            </div>} />
                                        </Card>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                    <Button type='primary' icon={<LiaDoorOpenSolid size={18} />} onClick={handleSelectPlan} disabled={CodePlan == ''}>เริ่มใช้งาน</Button>
                </Flex>
            }
        </div>
    )
}
export default ApsMain
