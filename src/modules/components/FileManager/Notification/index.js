import { useEffect, useRef, useState } from "react";

const Notification = ({ controller }) => {
    const [visible, setVisibale] = useState(false);
    const [message, setMessage] = useState("");
    const hideTimeout = useRef();
    const cleanTimeout = useRef();

    useEffect(() => {
        controller.set("notification.get_visible", () => {
            return visible;
        });

        return () => {
            controller.remove("notification.get_visible");
        };
    }, [visible]);

    useEffect(() => {
        controller.set("notification.show", (message, timer = 2000) => {
            const visible = controller.call("notification.get_visible");
            if (visible) {
                clearTimeout(cleanTimeout.current);
            }
            setVisibale(true);
            setMessage(message);
            clearTimeout(hideTimeout.current);
            hideTimeout.current = setTimeout(() => {
                controller.call("notification.hide");
            }, timer);
        });
        controller.set("notification.hide", (timer = 2000) => {
            setVisibale(false);
            cleanTimeout.current = setTimeout(() => {
                setMessage("");
            }, 300);
            clearTimeout(hideTimeout.current);
        });

        return () => {
            controller.remove("notification.show");
            controller.remove("notification.hide");
        };
    }, []);

    const className = visible
        ? "file-manager-modal file-manager-modal-notification file-manager-modal-active"
        : "file-manager-modal file-manager-modal-notification";

    return (
        <div className={className}>
            <div
                className="file-manager-modal-content"
                onClick={() => {
                    controller.call("notification.hide");
                }}
            >
                <div className="file-manager-modal-body">
                    <div className="file-manager-modal-notification-content">{message}</div>
                </div>
            </div>
        </div>
    );
};

export default Notification;
