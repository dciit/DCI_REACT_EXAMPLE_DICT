import { Tabs } from 'antd';
import PropaneTankIcon from '@mui/icons-material/PropaneTank';
import Gastight from '@/components/aps.gastight';
import MainPlan from '@/components/aps.main.component';
import TabPane from 'antd/es/tabs/TabPane';
import AssistantIcon from '@mui/icons-material/Assistant';
import CategoryIcon from '@mui/icons-material/Category';
import { Badge } from 'antd';
import ApsPriorityPlan from './aps.priority.plan';
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
function ApsMain() {
    return (
        <Tabs defaultActiveKey="1">
            <TabPane tab={<div className='flex items-center gap-2 pr-3  '><AssistantIcon /><span>Main Sequence</span></div>} key="1">
                <MainPlan />
            </TabPane>
            <TabPane tab={<Badge.Ribbon text="ใหม่" color="green"><div className='flex items-center gap-2 pr-10'><PropaneTankIcon /><span>Gastight</span></div></Badge.Ribbon>} key="2">
                <Gastight />
            </TabPane>
            <TabPane tab={<Badge.Ribbon text="ใหม่" color="green"><div className='flex items-center gap-2 pr-10'><CategoryIcon /><span>Priority Plan</span></div></Badge.Ribbon>} key="3">
                <ApsPriorityPlan />
            </TabPane>
        </Tabs>
    )
}
export default ApsMain