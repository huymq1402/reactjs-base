import { useEffect, useState } from "react";

const Breadcrumb = ({ controller }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        controller.set("breadcrumb.set_items", (items) => {
            setItems(items);
        });
        return () => {
            controller.remove("breadcrumb.set_items");
        };
    }, []);

    return (
        <div className="file-manager-breadcrumb">
            <ul>
                {items.map((folder, idx) => (
                    <li key={idx}>{folder.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Breadcrumb;
