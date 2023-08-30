import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AddFolder from "../assets/add-folder.svg";
import Back from "../assets/back.svg";
import Reload from "../assets/reload.svg";
import Rename from "../assets/rename.svg";
import TrashBin from "../assets/trash-bin.svg";
import { setLoading } from "../store";

const Item = ({ src, className, onClick = () => {}, disabled = false }) => {
    return (
        <button
            className={className ? `file-manager-toolbar-item ${className}` : "file-manager-toolbar-item"}
            onClick={onClick}
            disabled={disabled}
        >
            <img src={src} />
        </button>
    );
};

const SpinItem = ({ src, className, onClick = () => {}, disabled = false, spinning = false }) => {
    return (
        <button
            className={className ? `file-manager-toolbar-item ${className}` : "file-manager-toolbar-item"}
            onClick={onClick}
            disabled={disabled}
        >
            <img src={src} className={spinning ? "fm-spinning" : ""} />
        </button>
    );
};

const Toolbar = ({ controller, removeFiles = () => {} }) => {
    const [activeItems, setActiveItems] = useState(["new_folder", "reload"]);
    const { reloading } = useSelector((state) => state.data.loading);
    const dispatch = useDispatch();

    useEffect(() => {
        controller.set("toolbar.add_action", (actions) => {
            if (typeof actions === "string") {
                actions = [actions];
            }
            if (actions instanceof Array && actions.length > 0) {
                setActiveItems((currenActions) => {
                    return [...currenActions, ...actions];
                });
            }
        });
        controller.set("toolbar.remove_action", (actions) => {
            if (typeof actions === "string") {
                actions = [actions];
            }
            if (actions instanceof Array && actions.length > 0) {
                setActiveItems((currenActions) => {
                    return [...currenActions].filter((action) => !actions.includes(action));
                });
            }
        });

        return () => {
            controller.remove("toolbar.add_action");
            controller.remove("toolbar.remove_action");
        };
    }, []);

    const handleClickDelete = () => {
        if (activeItems.includes("delete")) {
            controller.call("confirm.show", "Bạn có chắc muốn xóa tập tin/thư mục không?", () => {
                const files = controller.call("content.get_selected_items");
                const res = removeFiles(files);
                if (res instanceof Promise) {
                    dispatch(setLoading(["removing", true]));
                    res.then(() => {
                        controller.call("content.remove_files", files);
                        const folders = files.filter((f) => f.type == "folder");
                        const list = {};
                        folders.forEach((folder) => {
                            let parent_id = folder.parent_id || null;
                            if (!list[parent_id]) {
                                list[parent_id] = [folder];
                            } else {
                                list[parent_id].push(folder);
                            }
                        });
                        for (let parent_id in list) {
                            controller.call(`sidebar_item.${parent_id}.remove_children`, list[parent_id]);
                        }
                        dispatch(setLoading(["removing", false]));
                    }).catch(({ message }) => {
                        message && controller.call("notification.show", message);
                        dispatch(setLoading(["removing", false]));
                    });
                }
            });
        }
    };

    const handleClickRename = () => {
        if (activeItems.includes("rename")) {
            const items = controller.call("content.get_selected_items");
            if (items.length > 0) {
                controller.call("rename_item.show", items[0]);
            }
        }
    };

    const handleClickNewFolder = () => {
        if (activeItems.includes("new_folder")) {
            const parent = controller.call("content.get_current_parent");
            if (parent) {
                controller.call("new_folder.show", parent);
            }
        }
    };

    const handleClickReload = () => {
        if (activeItems.includes("reload")) {
            const res = controller.call("content.reload");
            if (res instanceof Promise) {
                dispatch(setLoading(["reloading", true]));
                res.finally(() => {
                    dispatch(setLoading(["reloading", false]));
                });
            }
        }
    };

    const handleClickBack = () => {
        controller.call("shared.pop_flow_folder");
        setTimeout(() => {
            const folders = controller.call("shared.get_flow_folders");
            if (folders instanceof Array) {
                const last = folders[folders.length - 1];
                if (last) {
                    controller.call("content.open_folder", last);
                } else {
                    controller.call("content.open_folder", { id: null, name: "Root" });
                }
            }
        });
    };

    return (
        <div className="file-manager-toolbar">
            <Item disabled={!activeItems.includes("back")} src={Back} onClick={handleClickBack} />
            <Item
                disabled={!activeItems.includes("new_folder")}
                className="fm-new-folder"
                src={AddFolder}
                onClick={handleClickNewFolder}
            />
            <Item disabled={!activeItems.includes("rename")} src={Rename} onClick={handleClickRename} />
            <Item disabled={!activeItems.includes("delete")} src={TrashBin} onClick={handleClickDelete} />
            <SpinItem
                disabled={!activeItems.includes("reload") || reloading}
                src={Reload}
                onClick={handleClickReload}
                spinning={reloading}
            />
        </div>
    );
};

export default Toolbar;
