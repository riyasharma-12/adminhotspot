import React, { useEffect } from "react";
import { Button, Table, Popconfirm, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCategories,
  deleteCategory,
} from "../../store/slices/categorySlice";
import type { RootState } from "../../store/store";

const CategoryList: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const { categories, loading } = useSelector(
    (state: RootState) => state.categories
  );

  useEffect(() => {
    dispatch(fetchCategories(undefined));
  }, [dispatch]);

  const handleEdit = (category: any) =>
    navigate("/dashboard/categoriesForm", { state: { category } });

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteCategory(id)).unwrap();
      message.success("Category deleted successfully");
    } catch {
      message.error("Failed to delete category");
    }
  };

  const columns = [
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete this category?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        <Button
          type="primary"
          onClick={() => navigate("/dashboard/categoriesForm")}
        >
          Add Category
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={categories}
        loading={loading}
      />
    </div>
  );
};

export default CategoryList;
