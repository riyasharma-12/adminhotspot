import React, { useEffect } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchSubCategories,
  deleteSubCategory,
} from "../../store/slices/subCategorySlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import type { RootState, AppDispatch } from "../../store/store";

const SubCategoryList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { subCategories, loading } = useSelector(
    (state: RootState) => state.subCategories
  );

  useEffect(() => {
    dispatch(fetchSubCategories(undefined));
    dispatch(fetchCategories(undefined));
  }, [dispatch]);

  const handleEdit = (subCategory: any) => {
    navigate("/dashboard/subcategoriesForm", {
      state: { subCategory }, // ✅ MATCHED KEY
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteSubCategory(id)).unwrap();
      message.success("SubCategory deleted successfully");
    } catch {
      message.error("Failed to delete subcategory");
    }
  };

  const columns = [
    {
      title: "SubCategory Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      key: "category",
      render: (_: any, record: any) =>
        record.category?.name || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button onClick={() => handleEdit(record)}>
            Edit
          </Button>

          <Popconfirm
            title="Delete this subcategory?"
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
        <h2 className="text-xl font-semibold">SubCategories</h2>

        <Button
          type="primary"
          onClick={() => navigate("/dashboard/subcategoriesForm")}
        >
          Add SubCategory
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={subCategories}
        loading={loading}
      />
    </div>
  );
};

export default SubCategoryList;
