import { useEffect, useState } from "react";
import { CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Table, Tag } from 'antd';
import api from "@modules/api";
const parseString = (str, params) => {
    str.replace(/{(.*?)}/g, (match, key) => params[key] || match);
}
const renderFields = (fields) => {
    let listColumns = [];
    fields.map((field, idx) => {
        let columnItem = {
            key: field.key,
            title: field.title,
            dataIndex: field.key,
        }
        if (field?.type == 'tags') {
            columnItem['render'] = (value, record) => (
                <>
                    {record.tags.map((tag) => {
                        let color = field?.colors[tag] ?? null;
                        return (
                            <Tag color={color} key={tag}>
                                {tag}
                            </Tag>
                        );
                    })}
                </>
            )
        } else if (field?.type == 'link') {
            columnItem['render'] = (value, record) => {
                let color = field.color ?? null;
                let url = parseString(field.url, record);
                let target = field.target;
                let styles = field.styles;
                return (
                    <a style={{ color: color, ...styles }} href={url} target={target}>
                        {value}
                    </a>
                );
            }
        } else {
            columnItem['render'] = (value, record) => {
                let color = field.color ?? null;
                let styles = field.styles;
                return (
                    <div style={{ color: color, ...styles }}>
                        {value}
                    </div>
                );
            }
        }
        listColumns.push(columnItem)
    })
    return listColumns;
}

const renderActions = (actions, setLoading = () => { }) => {
    let actionItems = [];
    actions.map((action, idx) => {
        let actionItem = null;
        let styles = action.styles;
        let className = action.class;
        if (action.type == 'button') {
            actionItem = (
                <button
                    key={idx}
                    style={{ ...styles }}
                    className={className}
                    onClick={
                        () => {
                            if (action.action == 'api') {
                                let apiRequest = null;
                                if (action.method == 'get') {
                                    apiRequest = api.get(`${action.path}`);
                                } else if (action.method == 'put') {
                                    apiRequest = api.put(`${action.path}`);
                                } else if (action.method == 'delete') {
                                    apiRequest = api.delete(`${action.path}`);
                                } else {
                                    apiRequest = api.post(`${action.path}`);
                                }
                                apiRequest.then(({ status, message }) => {
                                    if (status) {
                                        setLoading(true);
                                        console.log(message ?? 'success');
                                    } else {
                                        setLoading(true);
                                        console.log(message ?? 'error');
                                    }
                                }).catch(() => {
                                    setLoading(true);
                                    console.log('error');
                                })
                            }
                        }
                    }
                >
                    {action.title}
                </button >
            );
        } else if (action.type == 'link') {
            actionItem = (
                <a
                    key={idx}
                    className={className}
                    style={{ ...styles }}
                    placeholder={action.placeholder}
                    href={action.url}
                    target={action.target}
                >
                    {action.title}
                </a>
            );
        }

        actionItems.push(actionItem);
    })
    return {
        key: 'actions',
        title: 'Actions',
        dataIndex: null,
        render: (value, record) => <>{actionItems}</>
    };
}

const ListView = ({ apiPath, selectRow = false }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (loading) {
            api.get(apiPath).then(({ status, data, fields, actions }) => {
                if (status) {
                    let listColumns = []
                    if (fields) {
                        listColumns.push(...renderFields(fields))
                    }
                    if (actions) {
                        listColumns.push(renderActions(actions, setLoading))
                    }
                    setColumns(listColumns)
                    if (data) {
                        setData(data)
                    }
                }
            })
            setLoading(false);
        }
    }, [loading])

    const handleDeselect = () => {
        setLoading(true);
        setSelectedRowKeys([]);
        setLoading(false);
    };

    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    return (
        <div>
            <div
                style={{
                    marginBottom: 16,
                }}
            >
                <div
                    style={{
                        padding: '10px 10px 0 10px',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <div>

                    </div>
                    <div>
                        {
                            selectedRowKeys.length > 0 ? (<>
                                <Button
                                    style={{ marginRight: 5 }}
                                    type="primary"
                                    onClick={handleDeselect}
                                    loading={loading}>
                                    {`${selectedRowKeys.length} selected`} <CloseOutlined />
                                </Button>
                                <Button
                                    style={{ marginRight: 5 }}
                                    // onClick={handleDeselect}
                                    loading={loading}
                                >
                                    Delete <DeleteOutlined />
                                </Button>
                            </>) : null
                        }
                    </div>
                    <div>
                        <Button
                            type="primary"
                            // onClick={ }
                            loading={loading}>
                            Create new
                        </Button>
                    </div>
                </div>
            </div>
            <Table
                rowSelection={
                    selectRow ? {
                        selectedRowKeys,
                        onChange: onSelectChange,
                    } : null
                }
                columns={columns}
                dataSource={data}
                rowKey='id'
            />
        </div>
    );
}

export default ListView;