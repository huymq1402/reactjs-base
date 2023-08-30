import { useEffect, useState } from "react";

function initCached() {
    try {
        const data = JSON.parse(window.localStorage.getItem("__folders"));
        return data ? data : {};
    } catch (e) {}
    return {};
}

let __cached = initCached();

const Item = ({ controller, activeFolder, listFolders = () => {}, folder, flow }) => {
    const [collapse, setCollapse] = useState(true);
    const [children, setChildren] = useState([]);
    const [name, setName] = useState(folder?.name);

    function fetchFolders(folderId) {
        const res = listFolders(folderId);
        if (res instanceof Promise) {
            return new Promise((resolve) => {
                res.then((folders) => {
                    if (folders instanceof Array) {
                        __cached[folderId ? folderId : "null"] = folders;
                        resolve(folders);
                    }
                }).catch(({ message }) => {
                    message && controller.call("notification.show", message);
                });
            });
        }
    }

    function tryCached(folderId) {
        if (!folderId) {
            folderId = "null";
        }
        if (__cached[folderId]) {
            return new Promise((resolve) => {
                resolve(__cached[folderId]);
            });
        }
        return null;
    }

    function cleanCached(folderId) {
        if (folderId) {
            delete __cached[folderId];
        } else {
            __cached = {};
        }
        window.localStorage.setItem("__folders", JSON.stringify(__cached));
    }

    function loadFolders(folder, withCache = true) {
        let res = null;
        if (withCache) {
            res = tryCached(folder?.id);
        }
        if (!res) {
            res = fetchFolders(folder?.id);
        }
        if (res instanceof Promise) {
            res.then((folders) => {
                setChildren(folders);
            });
        }
    }

    useEffect(() => {
        if (folder.id === null) {
            setTimeout(() => {
                setCollapse(false);
                handleLoadFiles();
            });
        }
        controller.set(`sidebar_item.${folder.id}.open`, () => {
            handleOpen();
            controller.call("sidebar.set_active_folder", folder);
        });

        return () => {
            controller.remove(`sidebar_item.${folder.id}.open`);
        };
    }, []);

    useEffect(() => {
        controller.set(`sidebar_item.${folder.id}.remove_children`, (removeFolders) => {
            if (Array.isArray(removeFolders)) {
                cleanCached(folder.id ? folder.id : "null");
                const removeIds = removeFolders.map((f) => f.id);
                const newChildren = [...children].filter((f) => !removeIds.includes(f.id));
                setChildren(newChildren);
            }
        });
        controller.set(`sidebar_item.${folder.id}.add_child`, (child) => {
            if (child && child.id) {
                cleanCached(folder.id ? folder.id : "null");
                setChildren([child, ...children]);
            }
        });
        controller.set(`sidebar_item.${folder.id}.change_name`, ({ name }) => {
            cleanCached(folder.id ? folder.id : "null");
            setName(name);
        });

        return () => {
            controller.remove(`sidebar_item.${folder.id}.remove_children`);
            controller.remove(`sidebar_item.${folder.id}.add_child`);
        };
    }, [children]);

    useEffect(() => {
        if (collapse) {
        } else {
            loadFolders(folder);
        }
    }, [collapse]);

    const handleOpen = () => {
        setCollapse(false);
    };

    const handleClose = () => {
        setCollapse(true);
    };

    const handleLoadFiles = () => {
        controller.call("content.open_folder", folder);
        controller.call("shared.set_flow_folders", flow);
        controller.call("sidebar.set_active_folder", folder);
    };

    let className = "file-manager-sidebar-item";
    if (folder.id === activeFolder?.id) {
        className += " active";
    }

    if (collapse) {
        return (
            <li className={className}>
                <span className="file-manager-sidebar-item-label">
                    <span className="file-manager-sidebar-item-collapse-target" onClick={handleOpen}>
                        +
                    </span>
                    <span
                        className="file-manager-sidebar-item-name"
                        onClick={() => {
                            handleLoadFiles();
                            handleOpen();
                        }}
                    >
                        {name}
                    </span>
                </span>
            </li>
        );
    }

    return (
        <li className={className}>
            <span className="file-manager-sidebar-item-label">
                <span className="file-manager-sidebar-item-collapse-target" onClick={handleClose}>
                    -
                </span>
                <span className="file-manager-sidebar-item-name" onClick={() => handleLoadFiles()}>
                    {name}
                </span>
            </span>
            {children.length > 0 && (
                <ul>
                    {children.map((child) => (
                        <Item
                            key={child.id}
                            activeFolder={activeFolder}
                            controller={controller}
                            listFolders={listFolders}
                            folder={child}
                            flow={[...flow, child]}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default Item;
