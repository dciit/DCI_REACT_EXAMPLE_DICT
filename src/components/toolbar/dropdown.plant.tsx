//@ts-nocheck

import { Badge, Dropdown, MenuProps, Space, Tag } from 'antd'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { LuMousePointerClick } from "react-icons/lu";
import {
    FacebookOutlined,
    LinkedinOutlined,
    TwitterOutlined,
    YoutubeOutlined,
} from '@ant-design/icons';
function DropdownPlant(props: any) {
    const { setOpenDrawer } = props;
    const redux = useSelector((state: any) => state.redux);
    const plant = redux.plant;
    const [items] = useState<MenuProps['items']>([
        {
            key: '1',
            label: (
                <span > SCR</span>
            )
        },
        {
            key: '2',
            label: (
                <span > YC</span>
            )
        }
    ])
    return (
        plant != '' && <div onClick={() => setOpenDrawer(true)} className=' rounded-md gap-2 bg-blue-500 flex items-center justify-center pl-4 pr-6 py-1 shadow-md'>
            <span className="relative flex h-3 w-3 drop-shadow-lg">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
            </span>
            <span className=' select-none  text-white text-3xl font-semibold drop-shadow-2xl'>
                {(typeof redux.plant != 'undefined' && redux.plant != '') && (redux.plant)}
            </span>
        </div>
    )
}

export default DropdownPlant