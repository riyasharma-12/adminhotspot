import React, { useEffect } from "react";
import { Input, Button, Form, message } from "antd";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  createCategory,
  updateCategory,
} from "../../store/slices/categorySlice";

const CategoryForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<any>();

  const category = location.state?.category;
  const [form] = Form.useForm();

  // Pre-fill form for edit
  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        name: category.name,
      });
    }
  }, [category, form]);

  const handleGoBack = () => navigate("/dashboard/categories");

  const handleSubmit = async (values: { name: string }) => {
    const hide = message.loading(
      category ? "Updating category..." : "Creating category...",
      0
    );

    try {
      if (category) {
        await dispatch(
          updateCategory({
            id: category.id,
            data: { name: values.name },
          })
        ).unwrap();

        message.success("Category updated successfully");
      } else {
        await dispatch(createCategory({ name: values.name })).unwrap();
        message.success("Category created successfully");
      }

      form.resetFields();
      navigate("/dashboard/categories");
    } catch (error: any) {
      message.error(error?.message || "Failed to save category");
    } finally {
      hide();
    }
  };

  return (
    <>
      <Button
        className="mb-4"
        onClick={handleGoBack}
        icon={<ArrowLeft size={16} />}
      >
        Go Back
      </Button>

      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-4">
          {category ? "Edit Category" : "Add New Category"}
        </h1>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Category Name"
            rules={[
              { required: true, message: "Please enter category name" },
              { min: 2, message: "Category name must be at least 2 characters" },
            ]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>

          <Form.Item className="mt-4">
            <Button type="primary" htmlType="submit">
              {category ? "Update Category" : "Create Category"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default CategoryForm;
