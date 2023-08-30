import { useEffect, useState } from "react";

import Item from "./Item";

const Sidebar = ({ controller, listFolders = () => {} }) => {
    const [activeFolder, setActiveFolder] = useState(null);

    useEffect(() => {
        controller.set("sidebar.set_active_folder", (folder) => {
            setActiveFolder(folder);
        });
        return () => {
            controller.remove("sidebar.set_active_folder");
        };
    }, []);

    return (
        <div className="file-manager-sidebar">
            <div className="file-manager-sidebar-container">
                <ul>
                    <Item
                        activeFolder={activeFolder}
                        controller={controller}
                        listFolders={listFolders}
                        folder={{ id: null, name: "Root" }}
                        flow={[{ id: null, name: "Root" }]}
                        path="/"
                    />
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
