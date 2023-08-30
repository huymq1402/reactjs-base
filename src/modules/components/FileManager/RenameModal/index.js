import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { setLoading } from "../store";

const RenameModal = ({ controller, okText = "OK", cancelText = "Cancel", renameFile = () => {} }) => {
    const [visible, setVisibale] = useState(false);
    const [name, setName] = useState("");
    const [item, setItem] = useState(null);
    const inputRef = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    const value = inputRef.current.value;
                    inputRef.current.value = "";
                    inputRef.current.value = value;
                }
            }, 200);
        }
    }, [visible]);

    useEffect(() => {
        controller.set("rename_item.show", (item) => {
            setVisibale(true);
            setItem(item);
            setName(item.name);
        });
        controller.set("rename_item.hide", () => {
            setVisibale(false);
            setItem(null);
            setName("");
        });

        return () => {
            controller.remove("rename_item.show");
            controller.remove("rename_item.hide");
        };
    }, []);

    useEffect(() => {
        controller.set("rename_item.confirm", () => {
            const res = renameFile(name?.trim() || "", item);
            if (res instanceof Promise) {
                dispatch(setLoading(["changingname", true]));
                res.then((data) => {
                    if (item.type === "file") {
                        controller.call("content.update_item", item, { name, src: data.url });
                        controller.call(`sidebar_item.${item.id}.change_name`, { name, src: data.url });
                    } else {
                        controller.call("content.update_item", item, { name });
                        controller.call(`sidebar_item.${item.id}.change_name`, { name });
                    }
                    setVisibale(false);
                    setItem(null);
                    dispatch(setLoading(["changingname", false]));
                    setTimeout(() => {
                        setName("");
                    }, 300);
                }).catch(({ message }) => {
                    message && controller.call("notification.show", message);
                    dispatch(setLoading(["changingname", false]));
                });
            }
        });

        return () => {
            controller.remove("rename_item.confirm");
        };
    }, [name, item]);

    const classNames = useMemo(() => {
        const arr = ["file-manager-modal"];
        visible && arr.push("file-manager-modal-active");
        return arr;
    }, [visible]);

    const className = classNames.join(" ");

    return (
        <div className={className}>
            <div className="file-manager-modal-fog" onClick={() => controller.call("rename_item.hide")}></div>
            <div className="file-manager-modal-content">
                <div className="file-manager-modal-body">
                    <input
                        className="fm-input-center"
                        style={{ width: 300 }}
                        placeholder="Nhập tên mới"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={50}
                        ref={inputRef}
                        onKeyDown={(e) => {
                            if (e.code === "Enter") {
                                return controller.call("rename_item.confirm");
                            }
                        }}
                    />
                    <div style={{ fontSize: 12, marginTop: 10 }}>
                        <span>Lưu ý: Có thể tập tin đã được sử dụng ở đâu đó!</span>
                    </div>
                </div>
                <div className="file-manager-modal-actions">
                    <button onClick={() => controller.call("rename_item.confirm")} disabled={!(name?.trim() || "")}>
                        {okText}
                    </button>
                    <button onClick={() => controller.call("rename_item.hide")}>{cancelText}</button>
                </div>
            </div>
        </div>
    );
};

export default RenameModal;
