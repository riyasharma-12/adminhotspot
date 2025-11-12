
import React, { useEffect, useState } from "react";
import { Input, Button, Form, message, Upload } from "antd";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch } from "react-redux";
import { createProduct, updateProduct } from "../../store/slices/productSlice";

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<any>();

  const product = location.state?.product;
  const [form] = Form.useForm();
  const [description, setDescription] = useState(product?.description || "");
  const [fileList, setFileList] = useState<any[]>([]);

  // Set initial form values and existing image
  useEffect(() => {
    if (product) {
      form.setFieldsValue({ title: product.title });
      setDescription(product.description || "");
      if (product.image) {
        setFileList([
          {
            uid: "-1",
            name: product.image.split("/").pop(),
            status: "done",
            url: product.image,
          },
        ]);
      }
    }
  }, [product, form]);

  const handleGoBack = () => navigate("/dashboard/products");

  const handleSubmit = async (values: any) => {
    if (fileList.length === 0 && !product?.image) {
      message.error("Please upload a product image");
      return;
    }

    const hide = message.loading(product ? "Updating..." : "Creating...", 0);

    try {
      // Prepare FormData
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", description);

      if (fileList[0]?.originFileObj) {
        // New file uploaded
        formData.append("image", fileList[0].originFileObj);
      } else if (product?.image) {
        // Keep existing image URL
        formData.append("image", product.image);
      }

      if (product) {
        // Update product
        await dispatch(
          updateProduct({ id: product.id.toString(), product: formData })
        ).unwrap();
        message.success("Product updated successfully");
      } else {
        // Create product
        await dispatch(createProduct(formData)).unwrap();
        message.success("Product created successfully");
      }

      // Reset form and navigate back
      form.resetFields();
      setDescription("");
      setFileList([]);
      navigate("/dashboard/products");
    } catch (error: any) {
      message.error(error || "Failed to save product");
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
          {product ? "Edit Product" : "Add New Product"}
        </h1>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="title"
            label="Product Title"
            rules={[{ required: true, message: "Enter product title" }]}
          >
            <Input placeholder="Enter product title" />
          </Form.Item>

          <Form.Item label="Product Image">
            <Upload
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              listType="picture"
              maxCount={1}
            >
              <Button icon={<UploadCloud size={16} />}>
                {fileList.length > 0 ? "Change Image" : "Upload Image"}
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Enter product description" }]}
          >
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              style={{ height: "200px" }}
            />
          </Form.Item>

          <Form.Item className="mt-4">
            <Button type="primary" htmlType="submit">
              {product ? "Update Product" : "Create Product"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default ProductForm;

