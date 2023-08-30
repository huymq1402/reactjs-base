import { useEffect } from "react";
import { Provider } from "react-redux";

import Confirm from "./Confirm";
import Content from "./Content";
import "./FileManager.scss";
import GlobalLoading from "./GlobalLoading";
import Header from "./Header";
import NewFolderModal from "./NewFolderModal";
import Notification from "./Notification";
import RenameModal from "./RenameModal";
import Shared from "./Shared";
import Sidebar from "./Sidebar";
import Toolbar from "./Toolbar";
import { store } from "./store";
import useController from "./useController";

function FileManager({
    title = "File Manager",
    containerStyle,
    withHeader = false,
    withShadow = false,
    visible = false,
    onMakeFolder = () => {},
    onUploadFiles = () => {},
    onListFolders = () => {},
    onListFiles = () => {},
    onSelectFile = () => {},
    onRemoveFiles = () => {},
    onRenameFile = () => {},
    onClose = () => {},
}) {
    const internal = useController();

    useEffect(() => {
        internal.set("close", () => {
            onClose?.();
        });
        return () => {
            internal.remove("close");
        };
    }, []);

    if (!visible) {
        return <></>;
    }

    const boxClass = withShadow ? "file-manager-box with-shadow" : "file-manager-box";

    return (
        <Provider store={store}>
            <div className="file-manager-container" style={containerStyle}>
                <div className={boxClass}>
                    {withHeader && <Header controller={internal} title={title} />}
                    <Toolbar controller={internal} removeFiles={onRemoveFiles} />
                    <Shared controller={internal} />
                    <div className="file-manager-body">
                        <Sidebar controller={internal} listFolders={onListFolders} />
                        <Content
                            controller={internal}
                            listFiles={onListFiles}
                            selectFile={onSelectFile}
                            uploadFiles={onUploadFiles}
                            removeFiles={onRemoveFiles}
                        />
                    </div>
                </div>
                <Confirm controller={internal} />
                <NewFolderModal controller={internal} makeFolder={onMakeFolder} />
                <RenameModal controller={internal} renameFile={onRenameFile} />
                <Notification controller={internal} />
                <GlobalLoading />
            </div>
        </Provider>
    );
}
FileManager.useController = () => {
    return useController();
};

export default FileManager;
