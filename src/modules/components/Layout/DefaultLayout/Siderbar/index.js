import { useMemo, useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined, AntDesignOutlined } from '@ant-design/icons';
import { Avatar, Layout, Menu, Switch } from 'antd';
import './siderbar.scss';
const { Header, Content, Footer, Sider } = Layout;
function Siderbar() {
    const [theme, setTheme] = useState('light');
    const [collapsed, setCollapsed] = useState(false);
    function getItem(label, key, icon, children, type) {
        return {
            key,
            icon,
            children,
            label,
            type,
        };
    }
    const items = [
        // getItem('Navigation One', 'sub1', <MailOutlined />, [
        //     getItem('Item 1', 'g1', null, [getItem('Option 1', '1'), getItem('Option 2', '2')], 'group'),
        //     getItem('Item 2', 'g2', null, [getItem('Option 3', '3'), getItem('Option 4', '4')], 'group'),
        // ]),
        // getItem('Group', 'grp', null, [getItem('Option 13', '13'), getItem('Option 14', '14')], 'group'),
        getItem('Group', 'grp', <AppstoreOutlined />),
        getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
            getItem('Option 5', '5'),
            getItem('Option 6', '6'),
            getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
        ]),
        {
            type: 'divider',
        },
        getItem('Navigation Three', 'sub4', <SettingOutlined />, [
            getItem('Option 9', '9'),
            getItem('Option 10', '10'),
            getItem('Option 11', '11'),
            getItem('Option 12', '12'),
        ]),
    ];

    const onClick = (e) => {
        console.log('click ', e);
    };

    const changeTheme = (value) => {
        setTheme(value ? 'dark' : 'light');
    };

    const size = useMemo(() => {
        return collapsed ? 50 : 100
    }, [collapsed]);

    return <Layout className="siderbar">
        {console.log(size)}
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            <Avatar
                className="avatar"
                size={size}
                icon={<AntDesignOutlined />}
                src="https://huythuyen.io.vn/images/groom_avatar.jpg"
            />
            <Menu
                theme="light"
                mode="inline"
                defaultSelectedKeys={['1']}
                items={items}
                style={{ width: "100%" }}
                onClick={onClick}
            />
        </Sider>
    </Layout>;
}
export default Siderbar;