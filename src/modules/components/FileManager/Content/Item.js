import * as React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { ReactComponent as AudioFile } from "../assets/audio.svg";
import { ReactComponent as BlankFile } from "../assets/blank-file.svg";
import { ReactComponent as FileDoc } from "../assets/file-doc.svg";
import { ReactComponent as FileDocx } from "../assets/file-docx.svg";
import { ReactComponent as FilePdf } from "../assets/file-pdf.svg";
import { ReactComponent as Folder } from "../assets/folder.svg";
import { ReactComponent as VideoFile } from "../assets/video.svg";

const ImageIcon = ({ src, alt }) => {
    return <LazyLoadImage src={src} alt={alt} />;
};

const Icon = ({ file }) => {
    if (/^image\/.+/.test(file.content_type)) {
        return <ImageIcon src={file.thumb} alt={file.name} />;
    }
    if (/^audio\/.+/.test(file.content_type)) {
        return <AudioFile />;
    }
    if (/^video\/.+/.test(file.content_type)) {
        return <VideoFile />;
    }
    if (file.content_type === "application/pdf") {
        return <FilePdf />;
    }
    if (file.content_type === "application/msword") {
        return <FileDoc />;
    }
    if (file.content_type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        return <FileDocx />;
    }
    return <BlankFile />;
};

const Item = React.forwardRef(({ controller, file, selectFile, selected, onOpenFolder = () => {} }, ref) => {
    const handleDoubleClick = (e) => {
        if (file.type === "folder") {
            onOpenFolder(file);
        } else {
            selectFile(file, () => controller.call("close"));
        }
    };

    return (
        <div
            ref={ref}
            className={["file-manager-file-item", selected ? "selected" : ""].filter((c) => c).join(" ")}
            onDoubleClick={handleDoubleClick}
        >
            {file.type === "folder" && (
                <div
                    className={
                        file.disabled
                            ? "fm-item-banner fm-item-banner-disabled fm-item-banner-folder"
                            : "fm-item-banner fm-item-banner-folder"
                    }
                >
                    <Folder />
                </div>
            )}
            {file.type === "file" && (
                <div className="fm-item-banner fm-item-banner-file">
                    <Icon file={file} />
                </div>
            )}
            <div className="fm-item-file-name">{file.name}</div>
        </div>
    );
});

export default Item;
