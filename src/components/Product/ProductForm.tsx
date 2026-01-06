import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Upload, message } from "antd";
import { UploadOutlined,  } from "@ant-design/icons";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import {
  createProduct,
  updateProduct,
} from "../../store/slices/productSlice";
import { fetchSubCategories } from "../../store/slices/subCategorySlice";
import type { RootState, AppDispatch } from "../../store/store";

const ProductForm: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const product = location.state?.product;
  const isEdit = Boolean(product);

  const { subCategories } = useSelector(
    (state: RootState) => state.subCategories
  );

  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchSubCategories(undefined));

    if (product) {
      form.setFieldsValue({
        title: product.title,
        description: product.description,
        price: product.price,
        subCategoryId: product.subCategoryId,
      });

      if (product.image) {
        setFileList([
          {
            uid: "-1",
            name: "image",
            status: "done",
            url: product.image,
          },
        ]);
      }
    }
  }, [dispatch, product, form]);

  const onFinish = async (values: any) => {
    if (!isEdit && fileList.length === 0) {
      message.error("Product image is required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("subCategoryId", values.subCategoryId);

      if (fileList[0]?.originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      if (isEdit) {
        await dispatch(
          updateProduct({ id: product.id, data: formData })
        ).unwrap();
        message.success("Product updated successfully");
      } else {
        await dispatch(createProduct(formData)).unwrap();
        message.success("Product created successfully");
      }

      navigate("/dashboard/products");
    } catch (error: any) {
      message.error("Failed to save product");
    }
  };

  return (
    <>
      <Button
        className="mb-4"
        icon={<ArrowLeft />}
        onClick={() => navigate("/dashboard/products")}
      >
        Go Back
      </Button>

      <div className="bg-white p-6 rounded-lg shadow max-w-xl ">
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Product" : "Add Product"}
        </h2>

        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name="title"
            label="Product Title"
            rules={[{ required: true, message: "Enter product title" }]}
          >
            <Input placeholder="Enter product title" />
          </Form.Item>

          {/* ✅ REACT QUILL DESCRIPTION */}
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Enter product description" }]}
            getValueFromEvent={(content) => content}
          >
            <ReactQuill theme="snow" style={{ height: 200 }} />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Enter price" }]}
          >
            <Input type="number" placeholder="Enter price" />
          </Form.Item>

          <Form.Item
            name="subCategoryId"
            label="SubCategory"
            rules={[{ required: true, message: "Select subcategory" }]}
          >
            <Select placeholder="Select subcategory">
              {subCategories.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Product Image">
            <Upload
              beforeUpload={() => false}
              listType="picture"
              maxCount={1}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
            >
              <Button icon={<UploadOutlined />}>
                {fileList.length ? "Change Image" : "Upload Image"}
              </Button>
            </Upload>
          </Form.Item>

          <Button type="primary" htmlType="submit">
            {isEdit ? "Update Product" : "Create Product"}
          </Button>
        </Form>
      </div>
    </>
  );
};

export default ProductForm;
