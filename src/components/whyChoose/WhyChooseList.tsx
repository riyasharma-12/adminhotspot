
import { useEffect } from "react";
import { Table, Button, Space, message } from "antd";
import { Edit2, Trash2, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";

import {
    fetchWhyChoose,
    deleteWhyChoose,
} from "../../store/slices/whychooseSlice";

const WhyChooseList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { items, loading } = useSelector(
        (state: RootState) => state.whyChoose
    );

    useEffect(() => {
        dispatch(fetchWhyChoose() as any);
    }, [dispatch]);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this section?"))
            return;

        try {
            await dispatch(deleteWhyChoose(id) as any);
            message.success("Deleted Successfully");
        } catch (error) {
            console.error(error);
            message.error("Failed to delete");
        }
    };

    const columns = [
        {
            title: "Heading",
            dataIndex: "heading",
        },
        {
            title: "Description",
            dataIndex: "description",
            render: (text: string) =>
                text?.length > 60 ? text.slice(0, 60) + "..." : text,
        },


        {
            title: "Items",
            dataIndex: "items",
            render: (items: any[]) =>
                items?.length ? (
                    <ul style={{ paddingLeft: "20px" }}>
                        {items.map((i) => (
                            <li key={i.id}>{i.description}</li>
                        ))}
                    </ul>
                ) : (
                    <span>No Items</span>
                ),
        },

        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => (
                <Space>
                    <Button
                        type="text"
                        icon={<Edit2 size={16} />}
                        onClick={() =>
                            navigate("/dashboard/whyChooseForm", {
                                state: { item: record },
                            })
                        }
                    />

                    <Button
                        type="text"
                        danger
                        icon={<Trash2 size={16} />}
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Why Choose Us</h1>

                <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => navigate("/dashboard/whyChooseForm")}
        >
          Create Why Choose
        </Button>

                {/* {items?.length === 0 && (
                    <Button
                        type="primary"
                        icon={<Plus />}
                        onClick={() => navigate("/dashboard/homeForm")}
                    >
                        Create Home
                    </Button>
                )} */}

            </div>

            <Table
                columns={columns}
                dataSource={items}
                loading={loading}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default WhyChooseList;
