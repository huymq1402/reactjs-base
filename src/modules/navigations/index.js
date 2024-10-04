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
        key: "/template",
        title: "Template",
        icon: <AppstoreOutlined />,
        type: undefined, // "group" | "divider" | undefined
        children: [
            {
                key: "/list",
                title: "List",
                icon: <AppstoreOutlined />,
                type: undefined, // "group" | "divider" | undefined
                children: [],
            }
        ],
    }
]
export default menuConfigs;