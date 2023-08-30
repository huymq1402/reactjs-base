import { useEffect, useRef, useState } from "react";

import "./DragAndDrop.scss";

const DragAndDrop = ({
    onClick,
    className,
    style = {},
    draggingTitle,
    children,
    onDrag = () => {},
    onDrop = () => {},
}) => {
    const [dragging, setDragging] = useState(false);
    const dropRef = useRef();
    const dragCounter = useRef(0);

    useEffect(() => {
        const handleDragIn = (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter.current++;
            if (e.dataTransfer.items?.length > 0) {
                setDragging(true);
            }
        };
        const handleDragOut = (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter.current--;
            if (dragCounter.current > 0) {
                return;
            }
            setDragging(false);
        };
        const handleDrag = (e) => {
            e.preventDefault();
            e.stopPropagation();
            onDrag(e);
        };
        const handleDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter.current = 0;
            setDragging(false);
            onDrop(e);
        };
        dragCounter.current = 0;
        if (dropRef.current) {
            dropRef.current.addEventListener("dragenter", handleDragIn);
            dropRef.current.addEventListener("dragleave", handleDragOut);
            dropRef.current.addEventListener("dragover", handleDrag);
            dropRef.current.addEventListener("drop", handleDrop);
        }
        return () => {
            if (dropRef.current) {
                dropRef.current.removeEventListener("dragenter", handleDragIn);
                dropRef.current.removeEventListener("dragleave", handleDragOut);
                dropRef.current.removeEventListener("dragover", handleDrag);
                dropRef.current.removeEventListener("drop", handleDrop);
            }
        };
    }, []);

    return (
        <div
            ref={dropRef}
            onClick={onClick}
            className={dragging ? `dragging-area ${className} dragging` : `dragging-area ${className}`}
            style={style}
        >
            <div className="dragging-content">{children}</div>
            {dragging && <div className="dragging-fog">{draggingTitle}</div>}
        </div>
    );
};

export default DragAndDrop;
