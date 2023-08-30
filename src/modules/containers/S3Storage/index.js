import api from "src/modules/api";
import FileManager from "src/modules/components/FileManager/FileManager";

const S3Storage = () => {
    return (
        <>
            <FileManager
                // containerStyle={{ width: 900, height: 500 }}
                containerStyle={{ width: "100%", height: "100%" }}
                // withHeader
                // withShadow
                visible
                onClose={() => {
                    alert("onClose");
                }}
                onListFolders={(parent_id = null) => {
                    return new Promise((resolve, reject) => {
                        api.get("/admin/s3_storage", {
                            params: {
                                _filters: `{"parent_id":"${parent_id}","type":"folder"}`,
                                _paging: 0
                            },
                        })
                            .then(({ status, data }) => {
                                if (status && Array.isArray(data)) {
                                    resolve(data);
                                }
                            })
                            .catch(() => {
                                resolve([]);
                            });
                    });
                }}
                onListFiles={(parent_id = null) => {
                    return new Promise((resolve, reject) => {
                        api.get("/admin/s3_storage", {
                            params: {
                                _filters: `{"parent_id":${parent_id}}`,
                                _paging: 0
                            },
                        })
                            .then(({ status, data }) => {
                                if (status && Array.isArray(data)) {
                                    resolve(data);
                                }
                            })
                            .catch(() => {
                                resolve([]);
                            });
                    });
                }}
                onMakeFolder={(name, parent) => {
                    return new Promise((resolve, reject) => {
                        api.post("storage/create-folder", {
                            name,
                            parent_id: parent.id,
                        })
                            .then(({ status, data, code, message }) => {
                                if (status && data) {
                                    resolve(data);
                                } else {
                                    reject({ code, message });
                                }
                            })
                            .catch(() => {
                                resolve(null);
                            });
                    });
                }}
                onUploadFiles={(fileList, path, couter) => {
                    function calculate(loaded) {
                        let sum = 0;
                        for (let value of loaded) {
                            sum += value;
                        }
                        return sum;
                    }
                    return new Promise((resolve, reject) => {
                        const run = async (files) => {
                            let total = 0,
                                loaded = [];
                            files.forEach((file, index) => {
                                loaded[index] = 0;
                                total += file.size;
                            });
                            const upload = (file, index) => {
                                return new Promise((sub) => {
                                    const formData = new FormData();
                                    formData.append("path", path);
                                    formData.append("file", file);
                                    api.post("storage/upload-files", formData, {
                                        headers: {
                                            "Content-Type": "multipart/form-data",
                                        },
                                        onUploadProgress: (progressEvent) => {
                                            loaded[index] = progressEvent.loaded;
                                            couter?.(calculate(loaded), total);
                                        },
                                    })
                                        .then(({ status, data }) => {
                                            if (status && Array.isArray(data)) {
                                                couter?.(calculate(loaded), total);
                                                sub(data);
                                            }
                                        })
                                        .catch(() => {
                                            resolve([]);
                                        });
                                });
                            };
                            const promises = [];
                            for (let i = 0; i < files.length; i++) {
                                const file = files[i];
                                promises.push(upload(file, i));
                            }
                            Promise.all(promises).then((responses) => {
                                let result = [];
                                responses.forEach((data) => {
                                    result = [...result, ...data];
                                });
                                resolve(result);
                            });
                        };
                        run([...fileList]);
                    });
                }}
                onRemoveFiles={(items) => {
                    return new Promise((resolve) => {
                        api.delete("storage/delete-items", {
                            data: { items: items.map((f) => ({ id: f.id, type: f.type })) },
                        }).then(({ status }) => {
                            if (status) {
                                resolve();
                            }
                        });
                    });
                }}
                onRenameFile={(name, item) => {
                    return new Promise((resolve) => {
                        api.put("storage/rename-item", { id: item.id, type: item.type, name }).then(
                            ({ status, ...others }) => {
                                if (status) {
                                    resolve({ status, ...others });
                                }
                            }
                        );
                    });
                }}
                onSelectFile={(file, close) => {
                    window.open(file.src, "_blank");
                }}
            />
        </>
    );
}

export default S3Storage;