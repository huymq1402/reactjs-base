import { useSelector } from "react-redux";

const GlobalLoading = () => {
    const { removing, uploading, changingname, creatingdir } = useSelector((state) => state.data.loading);
    const { percent } = useSelector((state) => state.data.uploader);

    const loading = removing || uploading || changingname || creatingdir;

    return (
        <div className={loading ? "fm-global-loading fm-global-loading-active" : "fm-global-loading"}>
            {percent > 0 && (
                <div style={{ position: "absolute", bottom: 0, height: 3, left: 0, right: 0, backgroundColor: "#fff" }}>
                    <div
                        style={{
                            backgroundColor: "green",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            bottom: 0,
                            width: percent + "%",
                        }}
                    />
                    <div style={{ textAlign: "center", position: "relative" }} />
                </div>
            )}
        </div>
    );
};

export default GlobalLoading;
