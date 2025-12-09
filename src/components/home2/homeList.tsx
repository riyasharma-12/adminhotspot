import React, { useEffect } from "react";
import { Table, Button, Space, Image, message } from "antd";
import { Edit2, Trash2, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { fetchHomes, deleteHome } from "../../store/slices/homeSlice";
import { useNavigate } from "react-router-dom";

const HomeList: React.FC = () => {
    const dispatch = useDispatch<any>();
    const navigate = useNavigate();
    const { homes, loading } = useSelector((s: RootState) => s.homes);

    useEffect(() => {
        dispatch(fetchHomes());
    }, [dispatch]);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this home?")) return;
        try {
            await dispatch(deleteHome(id)).unwrap();
            message.success("Deleted");
        } catch {
            message.error("Delete failed");
        }
    };

    const columns = [
        { title: "Title", dataIndex: "title", key: "title" },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (t: string) => (t?.length > 80 ? t.slice(0, 80) + "..." : t),
        },
        {
            title: "Images",
            key: "images",
            render: (_: any, record: any) => (
                <div style={{ display: "flex", gap: 8 }}>
                    {record.image1 ? <Image src={record.image1} width={60} preview={false} /> : null}
                    {record.image2 ? <Image src={record.image2} width={60} preview={false} /> : null}
                    {record.image3 ? <Image src={record.image3} width={60} preview={false} /> : null}
                </div>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => (
                <Space>
                    <Button icon={<Edit2 />} onClick={() => navigate("/dashboard/homeForm", { state: { home: record } })} />
                    <Button icon={<Trash2 />} danger onClick={() => handleDelete(record.id)} />
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold mt-2 mb-2">Home Sections</h1>
                <div className="flex gap-2">
                    <Button type="primary" icon={<Plus />} onClick={() => navigate("/dashboard/whyChooseList")}>Show whyChoose</Button>
                    {/* <Button type="primary" icon={<Plus />} onClick={() => navigate("/dashboard/whychooseForm")}>Create whyChoose</Button> */}
                    <Button type="primary" icon={<Plus />} onClick={() => navigate("/dashboard/mission")}>Show Mission</Button>
                    {/* <Button type="primary" icon={<Plus />} onClick={() => navigate("/dashboard/missionForm")}>Create Mission</Button> */}
                    {/* <Button type="primary" icon={<Plus />} onClick={() => navigate("/dashboard/homeForm")}>Create Home</Button> */}
                    {homes?.length === 0 && (
                        <Button
                            type="primary"
                            icon={<Plus />}
                            onClick={() => navigate("/dashboard/homeForm")}
                        >
                            Create Home
                        </Button>
                    )}

                </div>
            </div>

            <Table columns={columns} dataSource={homes} rowKey="id" loading={loading} pagination={{ pageSize: 8 }} />
        </div>
    );
};

export default HomeList;
