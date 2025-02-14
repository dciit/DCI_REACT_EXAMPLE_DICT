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
    let ReduxPlant = '';
    useEffect(() => {
        ReduxPlant = redux.filter?.plan;
    }, [])
    const items: MenuItem[] = [
        {
            key: 'sub1',
            label: 'โรงงาน (Plant)',
            className: 'font-semibold',
            icon: <MdFactory />,
            children: [
                {
                    key: 'g1',
                    label: 'กรุณาเลือกโรงงาน (Please select plant)',
                    type: 'group',
                    children: [
                        { key: '1', label: 'SCR', className: 'font-semibold', onClick: () => handleSelectPlant('SCR') },
                        { key: '2', label: '1YC', disabled: true, title: 'Disabled', onClick: () => handleSelectPlant('1YC') },
                        { key: '3', label: '2YC', disabled: true, title: 'Disabled', onClick: () => handleSelectPlant('2YC') },
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
        if (ReduxPlant != plant) {
            try {
                dispatch({ type: 'SET_FILTER', payload: { ...redux.filter, ...{ plant: plant } } });
                closeDrawer(false);
                setTimeout(() => {
                    location.reload();
                }, 500);
            } catch (e) {
                dispatch({ type: 'RESET' });
                alert('SESSION EXPIRED');
                location.reload();
            };
        }
    }
    useEffect(() => {
        if (typeof ReduxPlant != 'undefined' && ReduxPlant != '') {
            closeDrawer(false)
        }
    }, [ReduxPlant])

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