import React, { useEffect } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createSubCategory,
  updateSubCategory,
} from "../../store/slices/subCategorySlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import type { RootState, AppDispatch } from "../../store/store";


const SubCategoryForm: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ SAME KEY USED EVERYWHERE
  const subCategory = location.state?.subCategory;
  const isEdit = Boolean(subCategory);

  const { categories } = useSelector((state: RootState) => state.categories);

  const handleGoBack = () => navigate("/dashboard/subcategories");

  useEffect(() => {
    dispatch(fetchCategories(undefined));

    // ✅ PREFILL FORM ON EDIT
    if (subCategory) {
      form.setFieldsValue({
        name: subCategory.name,
        categoryId:
          subCategory.categoryId || subCategory.category?.id,
      });
    }
  }, [dispatch, form, subCategory]);

  const onFinish = async (values: {
    name: string;
    categoryId: string;
  }) => {
    try {
      if (isEdit) {
        await dispatch(
          updateSubCategory({
            id: subCategory.id,
            data: values,
          })
        ).unwrap();

        message.success("SubCategory updated successfully");
      } else {
        await dispatch(createSubCategory(values)).unwrap();
        message.success("SubCategory created successfully");
      }

      navigate("/dashboard/subcategories");
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Something went wrong"
      );
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

    <div className="bg-white p-6 rounded-lg shadow max-w-lg ">
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? "Edit SubCategory" : "Add SubCategory"}
      </h2>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="SubCategory Name"
          name="name"
          rules={[{ required: true, message: "Please enter subcategory name" }]}
        >
          <Input placeholder="Enter subcategory name" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="categoryId"
          rules={[{ required: true, message: "Please select category" }]}
        >
          <Select placeholder="Select category">
            {categories.map((cat) => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <div className="flex gap-3">
          <Button type="primary" htmlType="submit">
            {isEdit ? "Update" : "Create"}
          </Button>

          <Button onClick={() => navigate("/dashboard/subcategories")}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
    </>
  );
};

export default SubCategoryForm;
