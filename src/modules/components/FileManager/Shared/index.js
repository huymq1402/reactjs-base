import { useEffect, useState } from "react";

const Shared = ({ controller }) => {
    const [flowFolders, setFlowFolders] = useState([]);
    const [openFolder, setOpenFolder] = useState(null);

    useEffect(() => {
        controller.set("shared.push_flow_folder", (folder) => {
            setFlowFolders([...flowFolders, folder]);
        });
        controller.set("shared.pop_flow_folder", () => {
            const newFlowFolders = [...flowFolders];
            newFlowFolders.pop();
            setFlowFolders(newFlowFolders);
        });
        controller.set("shared.get_flow_folders", () => {
            return flowFolders;
        });

        if (flowFolders.length > 1) {
            setTimeout(() => {
                controller.call("toolbar.add_action", "back");
            });
        } else {
            setTimeout(() => {
                controller.call("toolbar.remove_action", "back");
            });
        }
        controller.call("breadcrumb.set_items", flowFolders);

        return () => {
            controller.remove("shared.push_flow_folder");
            controller.remove("shared.pop_flow_folder");
            controller.remove("shared.get_flow_folders");
        };
    }, [flowFolders]);

    useEffect(() => {
        controller.set("shared.set_flow_folders", (folders) => {
            setFlowFolders(folders);
        });
        controller.set("shared.set_open_folder", (folder) => {
            setOpenFolder(folder);
        });

        return () => {
            controller.remove("shared.set_flow_folders");
            controller.remove("shared.set_open_folder");
        };
    }, []);

    useEffect(() => {
        controller.call("sidebar.set_active_folder", openFolder);
    }, [openFolder]);

    return <></>;
};

export default Shared;
