import  { useEffect } from "react";
import { Table, Button, Space, message } from "antd";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  fetchMissionVision,
  deleteMissionVision,
} from "../../store/slices/missionSlice";
import { useNavigate } from "react-router-dom";

const MissionVisionList = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state: RootState) => state.mission);

  useEffect(() => {
    dispatch(fetchMissionVision());
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      await dispatch(deleteMissionVision(id)).unwrap();
      message.success("Deleted successfully");
    } catch {
      message.error("Delete failed");
    }
  };

  const columns = [
    { title: "Heading", dataIndex: "heading" },
    { title: "Description", dataIndex: "description" },
    {
      title: "Items",
      render: (record: any) =>
        record.items.map((i: any) => (
          <div key={i.id}>
            <strong>{i.title}</strong> – {i.description}
          </div>
        )),
    },
    {
      title: "Actions",
      render: (record: any) => (
        <Space>
          <Button
            icon={<Edit2 />}
            onClick={() => navigate("/dashboard/missionForm", { state: { edit: record } })}
          />
          <Button danger icon={<Trash2 />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold">Mission & Vision</h1>
        {items?.length === 0 && (
           <Button type="primary" icon={<Plus />} onClick={() => navigate("/dashboard/missionForm")}>Create Mission</Button>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={items}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
};

export default MissionVisionList;
