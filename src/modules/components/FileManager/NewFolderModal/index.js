import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { setLoading } from "../store";

const NewFolderModal = ({ controller, okText = "OK", cancelText = "Cancel", makeFolder = () => {} }) => {
    const [visible, setVisibale] = useState(false);
    const [name, setName] = useState("");
    const [parent, setParent] = useState(null);
    const inputRef = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                inputRef.current && inputRef.current.focus();
            }, 200);
        }
    }, [visible]);

    useEffect(() => {
        controller.set("new_folder.show", (parent) => {
            setVisibale(true);
            setParent(parent);
            setName("");
        });
        controller.set("new_folder.hide", () => {
            setVisibale(false);
            setParent(null);
            setName("");
        });

        return () => {
            controller.remove("new_folder.show");
            controller.remove("new_folder.hide");
        };
    }, []);

    useEffect(() => {
        controller.set("new_folder.confirm", () => {
            const res = makeFolder(name?.trim() || "", parent);
            if (res instanceof Promise) {
                dispatch(setLoading(["creatingdir", true]));
                res.then((folder) => {
                    if (folder) {
                        controller.call("content.add_items", [folder], parent);
                        controller.call(`sidebar_item.${parent.id}.add_child`, folder);
                        setVisibale(false);
                        setParent(null);
                        dispatch(setLoading(["creatingdir", false]));
                        setTimeout(() => {
                            setName("");
                        }, 300);
                    } else {
                        dispatch(setLoading(["creatingdir", false]));
                        controller.call("notification.show", "Tạo thu mục không thành công!");
                    }
                }).catch(({ message }) => {
                    message && controller.call("notification.show", message);
                    dispatch(setLoading(["creatingdir", false]));
                });
            }
        });

        return () => {
            controller.remove("new_folder.confirm");
        };
    }, [name, parent]);

    const classNames = useMemo(() => {
        const arr = ["file-manager-modal"];
        visible && arr.push("file-manager-modal-active");
        return arr;
    }, [visible]);

    const className = classNames.join(" ");

    return (
        <div className={className}>
            <div className="file-manager-modal-fog" onClick={() => controller.call("new_folder.hide")}></div>
            <div className="file-manager-modal-content">
                <div className="file-manager-modal-body">
                    <input
                        className="fm-input-center"
                        placeholder="Tên thư mục"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={50}
                        ref={inputRef}
                        onKeyDown={(e) => {
                            if (e.code === "Enter") {
                                return controller.call("new_folder.confirm");
                            }
                        }}
                    />
                </div>
                <div className="file-manager-modal-actions">
                    <button onClick={() => controller.call("new_folder.confirm")} disabled={!(name?.trim() || "")}>
                        {okText}
                    </button>
                    <button onClick={() => controller.call("new_folder.hide")}>{cancelText}</button>
                </div>
            </div>
        </div>
    );
};

export default NewFolderModal;
