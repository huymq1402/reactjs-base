import { AppstoreOutlined } from "@ant-design/icons";

const menuConfigs = [
    {
        key: "/",
        title: "Dashboard",
        icon: <AppstoreOutlined />,
        type: undefined, // "group" | "divider" | undefined
        children: [],
    },
    {
        key: "/test",
        title: "Test",
        icon: <AppstoreOutlined />,
        type: undefined, // "group" | "divider" | undefined
        children: [],
    },
]
export default menuConfigs;