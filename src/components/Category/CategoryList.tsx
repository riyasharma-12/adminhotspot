import React, { useEffect } from "react";
import { Table, Button, Space, message } from "antd";
import { Edit2, Trash2, Plus } from "lucide-react";
import { ArrowLeft,  } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { fetchCategories, deleteCategory } from "../../store/slices/categorySlice";
import type { AppDispatch } from "../../store/store";


const CategoryList: React.FC = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const dispatch = useDispatch<AppDispatch>();

  const { categories, loading } = useSelector((state: RootState) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories() as any);
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    const hide = message.loading("Deleting category...", 0);
    try {
      // await dispatch(deleteCategory(id)).unwrap();
      await dispatch(deleteCategory(Number(id))).unwrap();
      message.success("Category deleted successfully");
    } catch (error: any) {
      message.error(error || "Failed to delete category");
    } finally {
      hide();
    }
  };

  const handleGoBack = () => navigate("/dashboard/blogs");

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="text"
            icon={<Edit2 size={16} />}
            onClick={() => navigate("/dashboard/categoryForm", { state: { category: record } })}
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
        <Button className="mb-4" onClick={handleGoBack} icon={<ArrowLeft size={16} />}>
        Go Back
      </Button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Categories</h1>
          <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => navigate("/dashboard/categoryForm")}
        >
          Add Category
        </Button>
        {/* <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => navigate("/dashboard/categoryForm")}
        >
          Add Category
        </Button> */}
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default CategoryList;
