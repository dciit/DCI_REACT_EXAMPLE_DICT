//@ts-nocheck
import React, { useEffect, useState } from 'react';
import type { DrawerProps, RadioChangeEvent } from 'antd';
import { Button, Drawer, Menu, Radio, Space } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { TbBuildingFactory } from "react-icons/tb";
import { MdFactory } from "react-icons/md";
import { MdOutlineAccountCircle } from "react-icons/md";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

interface PropDrawerMenu {
    text: string;
    code: string;
    enable: boolean;
}
type MenuItem = Required<MenuProps>['items'][number];
function DrawerPlant(props: any) {
    const { closeDrawer, openDrawer } = props;
    const dispatch = useDispatch();
    const redux = useSelector((state: any) => state.redux);
    const plant = redux.plant;
    const items: MenuItem[] = [
        {
            key: 'sub1',
            label: 'PLANT',
            className: 'font-semibold',
            icon: <MdFactory />,
            children: [
                {
                    key: 'g1',
                    label: 'Please select plant',
                    type: 'group',
                    children: [
                        { key: '1', label: 'SCR', className: 'font-semibold', onClick: () => handleSelectPlant('SCR') },
                        { key: '2', label: 'YC', disabled: false, title: 'Disabled', onClick: () => handleSelectPlant('YC') },
                    ],
                },
            ],
        },
        {
            type: 'divider',
        },
        {
            key: 'grp',
            label: 'Other',
            type: 'group',
            children: [
                { key: '13', label: 'เกี่ยวกับฉัน', icon: <MdOutlineAccountCircle /> },
                { key: '14', label: 'ออกจากระบบ', icon: <RiLogoutBoxRLine /> },
            ],
        },
    ];

    const handleSelectPlant = async (plant: string) => {
        dispatch({ type: 'SET_PLANT', payload: plant })
    }
    useEffect(() => {
        closeDrawer(false)
    }, [plant])

    return (
        <Drawer
            title="APS CONTROL"
            placement={'left'}
            closable={false}
            onClose={() => closeDrawer(false)}
            open={openDrawer}
            key={'left'}
            bodyStyle={{ padding: 0 }}
        >
            <Menu
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                items={items}
            />
        </Drawer>
    )
}

export default DrawerPlant