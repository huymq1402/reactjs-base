import { useEffect, useRef, useState } from "react";

const Confirm = ({ controller, okText = "OK", cancelText = "Cancel" }) => {
    const [visible, setVisibale] = useState(false);
    const [message, setMessage] = useState("");
    const callback = useRef(null);

    useEffect(() => {
        controller.set("confirm.show", (message, cb) => {
            setVisibale(true);
            setMessage(message);
            callback.current = cb;
        });
        controller.set("confirm.hide", () => {
            setVisibale(false);
        });
        controller.set("confirm.confirm", () => {
            setVisibale(false);
            setMessage("");
            if (typeof callback.current === "function") {
                callback.current();
                callback.current = null;
            }
        });

        return () => {
            controller.remove("confirm.show");
            controller.remove("confirm.hide");
            controller.remove("confirm.confirm");
        };
    }, []);

    const className = visible ? "file-manager-modal file-manager-modal-active" : "file-manager-modal";

    return (
        <div className={className}>
            <div className="file-manager-modal-fog" onClick={() => controller.call("confirm.hide")}></div>
            <div className="file-manager-modal-content">
                <div className="file-manager-modal-message">{message}</div>
                <div className="file-manager-modal-actions">
                    <button onClick={() => controller.call("confirm.confirm")}>{okText}</button>
                    <button onClick={() => controller.call("confirm.hide")}>{cancelText}</button>
                </div>
            </div>
        </div>
    );
};

export default Confirm;
