import { AppstoreOutlined, CloudOutlined } from "@ant-design/icons";

const menuConfigs = [
    {
        key: "/",
        title: "Dashboard",
        icon: <AppstoreOutlined />,
        type: undefined, // "group" | "divider" | undefined
        children: [],
    },
    {
        key: "/s3",
        title: "S3 storage",
        icon: <CloudOutlined />,
        children: [],
    },
]
export default menuConfigs;