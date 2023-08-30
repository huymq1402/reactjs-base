import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { setLoading, setUploaderPercent } from "../store";
import Breadcrumb from "./Breadcrumb";
import DragAndDrop from "./DragAndDrop";
import Item from "./Item";

function initCached() {
    try {
        const data = JSON.parse(window.localStorage.getItem("__files"));
        return data ? data : {};
    } catch (e) { }
    return {};
}

let __cached = initCached();

const Content = ({ controller, listFiles = () => { }, selectFile = () => { }, uploadFiles = () => { } }) => {
    const [parent, setParent] = useState(null);
    const [items, setItems] = useState([]);
    const [openingId, setOpeningId] = useState(null);
    const [indexs, setIndexs] = useState([]);
    const wrapRef = useRef();
    const boxRef = useRef();
    const gridRef = useRef();
    const selectionRef = useRef();
    const downOffset = useRef({ x: 0, y: 0 });
    const mouseOffset = useRef({ x: 0, y: 0 });
    const clicked = useRef(false);
    const fileRefs = useRef([]);
    const awareBox = useRef({ width: 0, height: 0, top: 0, left: 0 });
    const dispatch = useDispatch();

    function fetchFiles(folderId) {
        const res = listFiles(folderId);
        if (res instanceof Promise) {
            return new Promise((resolve) => {
                res.then((files) => {
                    __cached[folderId ? folderId : "null"] = files;
                    window.localStorage.setItem("__files", JSON.stringify(__cached));
                    resolve(files);
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
        window.localStorage.setItem("__files", JSON.stringify(__cached));
    }

    function loadFiles(folder, withCache = true) {
        return new Promise((resolve) => {
            setOpeningId(folder?.id);
            setIndexs([]);

            let res = null;
            if (withCache) {
                res = tryCached(folder?.id);
            }
            if (!res) {
                res = fetchFiles(folder?.id);
            }

            if (res instanceof Promise) {
                wrapRef.current.classList.add("files-loading");
                res.then((files) => {
                    setOpeningId(null);
                    if (files instanceof Array) {
                        setItems(files);
                    } else {
                        setItems([]);
                    }
                    wrapRef.current.classList.remove("files-loading");
                    resolve();
                    boxRef.current.scrollTop = 0;
                }).catch(({ message }) => {
                    message && controller.call("notification.show", message);
                    wrapRef.current && wrapRef.current.classList.remove("files-loading");
                    setOpeningId(null);
                    setItems([]);
                    resolve();
                });
            }
        });
    }

    useEffect(() => {
        controller.set("content.open_folder", (folder) => {
            controller.call("shared.set_open_folder", folder);
            setParent(folder);
            loadFiles(folder);
        });

        return () => {
            controller.remove("content.open_folder");
        };
    }, []);

    useEffect(() => {
        controller.set("content.get_current_parent", () => {
            return parent;
        });
        controller.set("content.reload", () => {
            return loadFiles(parent, false);
        });

        return () => {
            controller.remove("content.get_current_parent");
            controller.remove("content.reload");
        };
    }, [parent]);

    useEffect(() => {
        controller.set("content.add_items", (__items, folder) => {
            cleanCached(folder.id ? folder.id : "null");
            if (folder.id !== parent.id) {
                return;
            }
            if (__items instanceof Array) {
                const ids = __items.map((f) => f.id);
                const newFolders = [...__items].filter((f) => f.type == "folder");
                const newFiles = [...__items].filter((f) => f.type == "file");
                const currentFolders = [...items].filter((f) => f.type == "folder");
                const currentFiles = [...items].filter((f) => f.type == "file");
                const folders = [...currentFolders, ...newFolders].sort((a, b) => (a.name > b.name ? 1 : -1));
                const files = [...newFiles, ...currentFiles].sort((a, b) => (a.name > b.name ? 1 : -1));
                const newItems = [...folders, ...files];
                const indexs = [];
                newItems.forEach((item, index) => {
                    if (ids.includes(item.id)) {
                        indexs.push(index);
                    }
                });
                setItems(newItems);
                setIndexs(indexs);
                if (indexs.length > 0) {
                    const index = indexs[0];
                    setTimeout(() => {
                        gridRef.current?.childNodes?.[index]?.scrollIntoView({ block: "center" });
                    });
                }
            } else {
                setIndexs([]);
            }
        });
        return () => {
            controller.remove("content.add_items");
        };
    }, [items, parent]);

    useEffect(() => {
        controller.set("content.update_item", (item, data) => {
            cleanCached(parent.id ? parent.id : "null");
            const newFiles = [...items];
            const file = newFiles.find((f) => f.id === item.id);
            if (file) {
                for (let key in data) {
                    file[key] = data[key];
                }
                setItems(newFiles);
            }
        });
        return () => {
            controller.remove("content.update_item");
        };
    }, [items, parent]);

    useEffect(() => {
        controller.set("content.get_selected_items", () => {
            return [...items].filter((_, index) => indexs.includes(index));
        });
        return () => {
            controller.remove("content.get_selected_items");
        };
    }, [items, indexs]);

    useEffect(() => {
        controller.set("content.remove_selected", () => {
            setIndexs([]);
        });
        return () => {
            controller.remove("content.remove_selected");
        };
    }, []);

    useEffect(() => {
        controller.set("content.remove_files", (removedFiles) => {
            cleanCached(parent.id ? parent.id : "null");
            const ids = removedFiles.map((file) => file.id);
            const newFiles = [...items].filter((file) => !ids.includes(file.id));
            setItems(newFiles);
            setIndexs([]);
        });
        return () => {
            controller.remove("content.remove_files");
        };
    }, [indexs, parent]);

    useEffect(() => {
        const addActions = [];
        const removeActions = [];
        if (indexs.length > 0) {
            const selected_items = controller.call("content.get_selected_items");
            const disabled_items = selected_items.filter((it) => it.disabled === true);
            if (disabled_items.length > 0) {
                removeActions.push("delete", "rename");
            } else {
                if (indexs.length === 1) {
                    addActions.push("rename");
                } else {
                    removeActions.push("rename");
                }
                addActions.push("delete");
            }
        } else {
            removeActions.push("delete", "rename");
        }
        controller.call("toolbar.add_action", addActions);
        controller.call("toolbar.remove_action", removeActions);
    }, [indexs]);

    function boxesIntersect(box, item) {
        const box_top = box?.top;
        const box_left = box?.left;
        const box_bottom = box?.top + box?.height;
        const box_right = box?.left + box?.width;

        const point_top = item?.offsetTop;
        const point_left = item?.offsetLeft;
        const point_bottom = item?.offsetTop + item?.offsetHeight;
        const point_right = item?.offsetLeft + item?.offsetWidth;

        return !(box_top > point_bottom || box_right < point_left || box_bottom < point_top || box_left > point_right);
    }

    function handleSetSelectedItems(awareBox, event) {
        if (event && awareBox.width === 0 && awareBox.height === 0) {
            const item = event.target.closest(".file-manager-file-item");
            if (item) {
                const metaKey = event.metaKey || event.ctrlKey;
                const index = Array.prototype.indexOf.call(item.parentNode.childNodes, item);
                if (metaKey) {
                    if (indexs.includes(index)) {
                        setIndexs([...indexs].filter((idx) => idx !== index));
                    } else {
                        setIndexs([...indexs, index]);
                    }
                } else {
                    if (indexs.includes(index)) {
                        if (indexs.length > 1) {
                            setIndexs([index]);
                        } else {
                            setIndexs([]);
                        }
                    } else {
                        setIndexs([index]);
                    }
                }
            } else {
                const metaKey = event.metaKey || event.ctrlKey;
                !metaKey && setIndexs([]);
            }
        } else {
            const arr = [];
            fileRefs.current.forEach((item, index) => {
                if (boxesIntersect(awareBox, item)) {
                    arr.push(index);
                }
            });
            if (event) {
                const metaKey = event.metaKey || event.ctrlKey;
                if (metaKey) {
                    setIndexs([...indexs, ...arr].filter((value, index, self) => self.indexOf(value) === index));
                } else {
                    setIndexs(arr);
                }
            } else {
                setIndexs(arr);
            }
        }
    }

    useEffect(() => {
        function wrapOffset(position, parent) {
            const parent_offset = parent.getBoundingClientRect();
            const parent_x = parent_offset.x;
            const parent_y = parent_offset.y;
            return { x: position.x - parent_x, y: position.y - parent_y };
        }
        const onmousedown = (e) => {
            if (e.button === 0) {
                const position = { x: e.x, y: e.y };
                const offset = wrapOffset(position, gridRef.current);
                selectionRef.current.style.top = offset.y + "px";
                selectionRef.current.style.left = offset.x + "px";
                clicked.current = true;
                downOffset.current = { ...offset };
                mouseOffset.current.x = e.x;
                mouseOffset.current.y = e.y;
            } else if (e.button === 2) {
                setIndexs([]);
            }
        };
        const handlemousemove = (position, event) => {
            const offset = wrapOffset(position, gridRef.current);
            const width = offset.x - downOffset.current.x;
            const height = offset.y - downOffset.current.y;
            const _awareBox = { width: 0, height: 0, top: 0, left: 0 };
            selectionRef.current.style.visibility = "visible";
            if (width >= 0) {
                selectionRef.current.style.width = width + "px";
                selectionRef.current.style.left = downOffset.current.x + "px";
                _awareBox.width = width;
                _awareBox.left = downOffset.current.x;
            } else {
                selectionRef.current.style.width = -width + "px";
                selectionRef.current.style.left = downOffset.current.x + width + "px";
                _awareBox.width = -width;
                _awareBox.left = downOffset.current.x + width;
            }
            if (height >= 0) {
                selectionRef.current.style.height = height + "px";
                selectionRef.current.style.top = downOffset.current.y + "px";
                _awareBox.height = height;
                _awareBox.top = downOffset.current.y;
            } else {
                selectionRef.current.style.height = -height + "px";
                selectionRef.current.style.top = downOffset.current.y + height + "px";
                _awareBox.height = -height;
                _awareBox.top = downOffset.current.y + height;
            }
            handleSetSelectedItems(_awareBox, event);
            awareBox.current = _awareBox;
        };
        const onmousemove = (e) => {
            if (clicked.current) {
                mouseOffset.current.x = e.x;
                mouseOffset.current.y = e.y;
                handlemousemove(mouseOffset.current, e);
            }
        };
        const onmouseup = (e) => {
            if (e.button === 0 && clicked.current) {
                clicked.current = false;
                handleSetSelectedItems(awareBox.current, e);
                awareBox.current = { width: 0, height: 0, top: 0, left: 0 };
                selectionRef.current.style.top = 0;
                selectionRef.current.style.left = 0;
                selectionRef.current.style.width = 0;
                selectionRef.current.style.height = 0;
                selectionRef.current.style.visibility = "hidden";
            }
        };
        const onscroll = () => {
            if (clicked.current) {
                handlemousemove(mouseOffset.current);
            }
        };
        if (gridRef.current) {
            gridRef.current.addEventListener("mousedown", onmousedown);
            gridRef.current.addEventListener("mousemove", onmousemove);
            boxRef.current.addEventListener("scroll", onscroll);
        }
        window.addEventListener("mouseup", onmouseup);
        return () => {
            if (gridRef.current) {
                gridRef.current.removeEventListener("mousedown", onmousedown);
                gridRef.current.removeEventListener("mousemove", onmousemove);
                boxRef.current.removeEventListener("scroll", onscroll);
            }
            window.removeEventListener("mouseup", onmouseup);
        };
    }, [indexs]);

    fileRefs.current = [];

    return (
        <div className="file-manager-files" ref={wrapRef}>
            <DragAndDrop
                className="file-manager-file-items"
                draggingTitle="Thả file để upload"
                onDrop={(e) => {
                    if (e.dataTransfer.files?.length > 0) {
                        const folders = controller.call("shared.get_flow_folders");
                        const names = [];
                        if (Array.isArray(folders)) {
                            folders.forEach((folder) => {
                                folder.name && folder.id && names.push(folder.name);
                            });
                        }
                        const res = uploadFiles(e.dataTransfer.files, `/${names.join("/")}`, (done, total) => {
                            dispatch(setUploaderPercent(Math.min((done / total) * 100, 99)));
                        });
                        if (res instanceof Promise) {
                            dispatch(setUploaderPercent(0.1));
                            dispatch(setLoading(["uploading", true]));
                            const parent = controller.call("content.get_current_parent");
                            res.then((newFiles) => {
                                controller.call("content.add_items", newFiles, parent);
                                dispatch(setUploaderPercent(100));
                                setTimeout(() => {
                                    dispatch(setLoading(["uploading", false]));
                                    dispatch(setUploaderPercent(0));
                                }, 300);
                            }).catch(({ message }) => {
                                message && controller.call("notification.show", message);
                                dispatch(setLoading(["uploading", false]));
                            });
                        }
                    }
                }}
            >
                <div className="file-manager-box-files" ref={boxRef}>
                    <div className="file-manager-grid-files" ref={gridRef}>
                        {items.map((file, i) => (
                            <Item
                                ref={(ref) => (fileRefs.current[i] = ref)}
                                selected={indexs.includes(i) || file.id === openingId}
                                key={file.id}
                                controller={controller}
                                file={file}
                                selectFile={selectFile}
                                onOpenFolder={(folder) => {
                                    controller.call("shared.push_flow_folder", folder);
                                    controller.call("content.open_folder", folder);
                                    controller.call(`sidebar_item.${folder.id}.open`);
                                }}
                            />
                        ))}
                        <div className="selection-wrap" ref={selectionRef}></div>
                    </div>
                </div>
            </DragAndDrop>
            <Breadcrumb controller={controller} />
        </div>
    );
};

export default Content;
